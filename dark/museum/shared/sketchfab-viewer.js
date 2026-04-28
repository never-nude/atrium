import { createViewerDefaults, renderViewerShell } from "./viewer-shell.js";

let sketchfabApiPromise = null;

function cloneJson(value) {
  return value ? JSON.parse(JSON.stringify(value)) : value;
}

function vAdd(a, b) {
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}

function vSub(a, b) {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

function vScale(vector, scalar) {
  return [vector[0] * scalar, vector[1] * scalar, vector[2] * scalar];
}

function vLen(vector) {
  return Math.hypot(vector[0], vector[1], vector[2]);
}

function detectVerticalAxis(offset) {
  const abs0 = Math.abs(offset[0]);
  const abs1 = Math.abs(offset[1]);
  const abs2 = Math.abs(offset[2]);
  if (abs0 <= abs1 && abs0 <= abs2) return 0;
  if (abs1 <= abs0 && abs1 <= abs2) return 1;
  return 2;
}

function rotateAroundAxis(vector, angle, axisIndex) {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  const [x, y, z] = vector;
  if (axisIndex === 0) {
    return [x, y * c - z * s, y * s + z * c];
  }
  if (axisIndex === 1) {
    return [x * c + z * s, y, -x * s + z * c];
  }
  return [x * c - y * s, x * s + y * c, z];
}

async function loadSketchfabApi() {
  if (window.Sketchfab) return;
  if (!sketchfabApiPromise) {
    sketchfabApiPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://static.sketchfab.com/api/sketchfab-viewer-1.12.1.js";
      script.async = true;
      script.onload = resolve;
      script.onerror = () => reject(new Error("Unable to load Sketchfab Viewer API"));
      document.head.appendChild(script);
    });
  }

  await sketchfabApiPromise;
}

function isMobileLayout() {
  return window.matchMedia("(max-width: 820px)").matches;
}

function bootError(message, error) {
  console.error(error);
  if (!document.body.innerHTML.trim()) {
    document.body.textContent = message;
  }
}

export async function initSketchfabMuseumPage(piece) {
  const defaults = createViewerDefaults(piece.defaults);
  const ui = renderViewerShell({
    pageTitle: piece.pageTitle,
    viewerTitle: piece.viewerTitle,
    subtitle: piece.subtitle,
    medium: piece.medium,
    dimensions: piece.dimensions,
    location: piece.location,
    locationLabel: piece.locationLabel,
    source: piece.source,
    printing: piece.printing,
    statsLoading: piece.view?.primaryLoadingText || "Loading high-fidelity source mesh...",
    loadingText: piece.view?.primaryLoadingText || "Loading high-fidelity source mesh...",
    defaults,
    controlsHint: piece.controlsHint
  });

  ui.setDefaults();

  const state = {
    api: null,
    camera: null,
    defaultCamera: null,
    orbitAxis: null,
    orbitOffset: null,
    zoomScale: null,
    envBase: null,
    postBase: null,
    materialsBase: null,
    roughnessTimer: null,
    sceneReady: false,
    programmaticMoveUntil: 0,
    userInteracting: false
  };

  function syncOrbitState(camera) {
    if (!camera) return;
    const offset = vSub(camera.position, camera.target);
    const distance = vLen(offset);
    if (!Number.isFinite(distance) || distance <= 0.0001) return;
    state.camera = {
      position: camera.position.slice(0, 3),
      target: camera.target.slice(0, 3)
    };
    if (state.orbitAxis === null) {
      state.orbitAxis = detectVerticalAxis(offset);
    }
    state.orbitOffset = offset;
    if (!state.zoomScale) {
      state.zoomScale = distance / defaults.zoom;
    }
  }

  function setCamera(position, target, duration = 0) {
    if (!state.api || typeof state.api.setCameraLookAt !== "function") return;
    state.programmaticMoveUntil = performance.now() + Math.max(220, duration * 1000 + 120);
    state.api.setCameraLookAt(position, target, duration, () => {});
    syncOrbitState({ position, target });
  }

  async function getCameraLookAt() {
    return new Promise((resolve) => {
      if (!state.api || typeof state.api.getCameraLookAt !== "function") {
        resolve(null);
        return;
      }
      state.api.getCameraLookAt((err, camera) => {
        if (err || !camera || !Array.isArray(camera.position) || !Array.isArray(camera.target)) {
          resolve(null);
          return;
        }
        resolve({
          position: camera.position.slice(0, 3),
          target: camera.target.slice(0, 3)
        });
      });
    });
  }

  function desiredDistance() {
    const base = state.zoomScale || 2.8;
    const mobileLift = isMobileLayout() ? 0.85 : 0.0;
    return (ui.n("zoom") + mobileLift) * base;
  }

  function applyZoom() {
    if (!state.camera || !state.orbitOffset) return;
    const target = state.camera.target.slice(0, 3);
    const currentOffset = state.orbitOffset.slice(0, 3);
    const currentDistance = vLen(currentOffset);
    if (currentDistance <= 0.0001) return;
    const scaledOffset = vScale(currentOffset, desiredDistance() / currentDistance);
    setCamera(vAdd(target, scaledOffset), target, 0.2);
  }

  function applyFrontView(duration = 0.9) {
    if (!state.camera || !state.orbitOffset) return;
    const target = state.camera.target.slice(0, 3);
    const turned = rotateAroundAxis(state.orbitOffset.slice(0, 3), Math.PI, state.orbitAxis);
    state.defaultCamera = {
      position: vAdd(target, turned),
      target: target.slice(0, 3)
    };
    setCamera(state.defaultCamera.position, state.defaultCamera.target, duration);
    setTimeout(applyZoom, Math.max(150, Math.floor(duration * 900)));
  }

  function applyManipulation() {
    if (!state.api || typeof state.api.setUserInteraction !== "function") return;
    const enabled = document.getElementById("canManipulate").checked;
    state.api.setUserInteraction(enabled, () => {});
    if (!enabled) {
      state.userInteracting = false;
    }
  }

  function applyWireframe() {
    if (!state.api || typeof state.api.setWireframe !== "function") return;
    state.api.setWireframe(document.getElementById("wire").checked, { color: "8D7550FF" }, () => {});
  }

  function applyEnvironment() {
    if (!state.api || !state.envBase || typeof state.api.setEnvironment !== "function") return;
    const env = cloneJson(state.envBase);
    const multi = document.getElementById("multiLight").checked;

    if ("enabled" in env) env.enabled = true;
    if ("enable" in env) env.enable = true;
    if ("rotation" in env) env.rotation = (ui.n("lightAngle") * Math.PI) / 180;
    if ("lightIntensity" in env) env.lightIntensity = multi ? ui.n("lightPower") : ui.n("lightPower") * 0.36;
    if ("exposure" in env) env.exposure = 0.45 + ui.n("exposure") * 1.5;
    if ("backgroundExposure" in env) env.backgroundExposure = 0.82 + ui.n("exposure") * 0.85;
    if ("shadowEnabled" in env) env.shadowEnabled = multi;
    if ("shadowEnable" in env) env.shadowEnable = multi;

    state.api.setEnvironment(env, () => {});
  }

  function applyPostProcessing() {
    if (!state.api || !state.postBase || typeof state.api.setPostProcessing !== "function") return;
    const post = cloneJson(state.postBase);
    post.enable = true;

    if (post.toneMapping) {
      post.toneMapping.enable = true;
      post.toneMapping.exposure = 0.82 + ui.n("exposure") * 1.15;
      if (typeof post.toneMapping.contrast === "number") {
        post.toneMapping.contrast = Math.min(0.3, ui.n("exposure") * 0.15);
      }
    }

    if (post.vignette && typeof post.vignette.amount === "number") {
      post.vignette.amount = Math.max(0.08, 0.34 - ui.n("exposure") * 0.18);
    }

    state.api.setPostProcessing(post, () => {});
  }

  function applyRoughness() {
    if (state.roughnessTimer) {
      clearTimeout(state.roughnessTimer);
    }
    state.roughnessTimer = setTimeout(() => {
      if (!state.api || !Array.isArray(state.materialsBase) || typeof state.api.setMaterial !== "function") return;
      const roughness = ui.n("rough");
      for (const source of state.materialsBase) {
        const material = cloneJson(source);
        const channels = material && material.channels ? material.channels : null;
        if (!channels) continue;

        let touched = false;
        if (channels.RoughnessPBR && typeof channels.RoughnessPBR.factor === "number") {
          channels.RoughnessPBR.factor = roughness;
          channels.RoughnessPBR.enable = true;
          touched = true;
        }
        if (channels.GlossinessPBR && typeof channels.GlossinessPBR.factor === "number") {
          channels.GlossinessPBR.factor = 1 - roughness;
          touched = true;
        }
        if (channels.ClearCoatRoughness && typeof channels.ClearCoatRoughness.factor === "number") {
          channels.ClearCoatRoughness.factor = Math.min(1, roughness * 0.7);
          touched = true;
        }
        if (touched) {
          state.api.setMaterial(material, () => {});
        }
      }
    }, 80);
  }

  function startAutoRotateLoop() {
    let lastTs = performance.now();
    let lastSend = 0;

    const frame = (ts) => {
      const dt = Math.min(0.06, (ts - lastTs) / 1000);
      lastTs = ts;

      if (state.sceneReady && state.camera && state.orbitOffset && document.getElementById("autoRotate").checked && !state.userInteracting) {
        const speed = ui.n("spin");
        if (speed > 0.0001 && ts - lastSend > 70) {
          const target = state.camera.target.slice(0, 3);
          const nextOffset = rotateAroundAxis(state.orbitOffset, dt * speed, state.orbitAxis);
          setCamera(vAdd(target, nextOffset), target, 0);
          lastSend = ts;
        }
      }

      requestAnimationFrame(frame);
    };

    requestAnimationFrame(frame);
  }

  try {
    await loadSketchfabApi();

    const iframe = document.createElement("iframe");
    iframe.className = "viewer-frame";
    iframe.allow = "autoplay; fullscreen; xr-spatial-tracking";
    iframe.setAttribute("allowfullscreen", "");
    iframe.setAttribute("xr-spatial-tracking", "");
    iframe.setAttribute("execution-while-out-of-viewport", "");
    iframe.setAttribute("execution-while-not-rendered", "");
    iframe.setAttribute("web-share", "");
    iframe.setAttribute("src", "about:blank");
    ui.stage.appendChild(iframe);

    const client = new window.Sketchfab("1.12.1", iframe);
    const model = piece.model || {};

    await new Promise((resolve, reject) => {
      client.init(model.uid, {
        autostart: 1,
        transparent: model.transparent ? 1 : 0,
        cameraConstraints: false,
        ui_infos: 0,
        ui_controls: 0,
        ui_stop: 0,
        ui_watermark: 0,
        ui_settings: 0,
        ui_annotations: 0,
        ui_fullscreen: 0,
        success(api) {
          state.api = api;
          api.start(() => {
            api.addEventListener("viewerready", async () => {
              try {
                loading.remove();

                const sizeLabel = model.sourceBytes
                  ? `${(model.sourceBytes / (1024 * 1024)).toFixed(1)} MB source mesh archive`
                  : "Source mesh";
                if (model.triangles) {
                  ui.stats.textContent = `${Number(model.triangles).toLocaleString()} triangles | ${sizeLabel}`;
                } else {
                  ui.stats.textContent = sizeLabel;
                }

                state.sceneReady = true;
                state.defaultCamera = await getCameraLookAt();
                syncOrbitState(state.defaultCamera);

                api.getEnvironment((err, env) => {
                  if (!err && env) {
                    state.envBase = env;
                    applyEnvironment();
                  }
                });

                api.getPostProcessing((err, post) => {
                  if (!err && post) {
                    state.postBase = post;
                    applyPostProcessing();
                  }
                });

                api.getMaterialList((err, materials) => {
                  if (!err && Array.isArray(materials)) {
                    state.materialsBase = materials;
                    applyRoughness();
                  }
                });

                applyManipulation();
                applyWireframe();
                applyEnvironment();
                applyPostProcessing();
                applyRoughness();

                api.addEventListener("camerastart", () => {
                  if (performance.now() > state.programmaticMoveUntil) {
                    state.userInteracting = true;
                  }
                });

                api.addEventListener("camerastop", async () => {
                  state.userInteracting = false;
                  const camera = await getCameraLookAt();
                  if (camera) {
                    syncOrbitState(camera);
                  }
                });

                const onResize = async () => {
                  const camera = await getCameraLookAt();
                  if (camera) {
                    syncOrbitState(camera);
                    applyZoom();
                  }
                };

                window.addEventListener("resize", onResize);
                startAutoRotateLoop();
                resolve();
              } catch (error) {
                reject(error);
              }
            });
          });
        },
        error() {
          reject(new Error("Unable to initialize Sketchfab model."));
        }
      });
    });

    ui.bindControls({
      onRangeInput: (id) => {
        if (id === "zoom") {
          applyZoom();
          return;
        }
        if (id === "lightAngle" || id === "lightPower") {
          applyEnvironment();
          return;
        }
        if (id === "exposure") {
          applyEnvironment();
          applyPostProcessing();
          return;
        }
        if (id === "rough") {
          applyRoughness();
        }
      },
      onCheckboxChange: (id) => {
        if (id === "canManipulate") {
          applyManipulation();
          return;
        }
        if (id === "wire") {
          applyWireframe();
          return;
        }
        if (id === "multiLight") {
          applyEnvironment();
        }
      },
      onFront: () => {
        applyFrontView();
      },
      onReset: async () => {
        ui.setDefaults();
        if (state.defaultCamera) {
          setCamera(state.defaultCamera.position, state.defaultCamera.target, 0.9);
        }
        setTimeout(() => {
          applyZoom();
          applyManipulation();
          applyWireframe();
          applyEnvironment();
          applyPostProcessing();
          applyRoughness();
        }, 180);
      }
    });
  } catch (error) {
    bootError("Failed to initialize Sketchfab viewer.", error);
    if (ui.stats) {
      ui.stats.textContent = "Unable to load Sketchfab model.";
    }
    if (ui.loading) {
      ui.loading.textContent = `Model load error: ${error.message}`;
    }
  }
}
