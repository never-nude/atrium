import { createViewerDefaults, renderViewerShell } from "./viewer-shell.js";
import { createPedestalMesh, inferPedestalEnabled, resolveGeometryPedestalRadius, resolvePedestalHeight } from "./pedestal.js";

const DEFAULT_PRIMARY_TIMEOUT_MS = 45000;
const DEFAULT_FALLBACK_TIMEOUT_MS = 30000;
const DEFAULT_TARGET_HEIGHT = 1.58;
const DEFAULT_ROTATE_X = -Math.PI * 0.5;
const DEFAULT_MODEL_YAW = 0;
const DEFAULT_PRIMARY_LOADING_TEXT = "Loading high-fidelity STL sculpture...";
const DEFAULT_FALLBACK_LOADING_TEXT = "Loading optimized STL sculpture...";
const DEFAULT_SWITCH_LOADING_TEXT = "Full-resolution mesh unavailable; switching to optimized STL...";
const DEFAULT_MATERIAL = Object.freeze({
  color: "#ece3d3",
  metalness: 0.0,
  clearcoat: 0.18,
  clearcoatRoughness: 0.38,
  sheen: 0.22,
  sheenRoughness: 0.8,
  sheenColor: "#fff2df",
  reflectivity: 0.38
});
const DEFAULT_DARK_STAGE = Object.freeze({
  background: 0x111018,
  fog: 0x111018,
  hemiSky: 0xf0e7e4,
  hemiGround: 0x17131b,
  key: 0xfff6f0,
  fill: 0xd8b2c5,
  rim: 0xbfe1d3,
  bounce: 0x8e79a6,
  floor: 0x201b23,
  pedestal: 0x2c2530
});
const HERO_PREVIEW_STAGE = Object.freeze({
  background: 0x07060c,
  fog: 0x07060c,
  hemiSky: 0xfff6e8,
  hemiGround: 0x100d18,
  key: 0xfffaf0,
  fill: 0xc7a8da,
  rim: 0xb7e0c9,
  bounce: 0x8d77b4,
  floor: 0x110d18,
  pedestal: 0x1c1626
});

let threeModulesPromise = null;

function getThreeModules() {
  if (!threeModulesPromise) {
    threeModulesPromise = (async () => {
      const THREE = await import("https://esm.sh/three@0.161.0?bundle");
      const { OrbitControls } = await import("https://esm.sh/three@0.161.0/examples/jsm/controls/OrbitControls.js?bundle");
      const { STLLoader } = await import("https://esm.sh/three@0.161.0/examples/jsm/loaders/STLLoader.js?bundle");
      const { RoomEnvironment } = await import("https://esm.sh/three@0.161.0/examples/jsm/environments/RoomEnvironment.js?bundle");
      const { mergeVertices } = await import("https://esm.sh/three@0.161.0/examples/jsm/utils/BufferGeometryUtils.js?bundle");

      return { THREE, OrbitControls, STLLoader, RoomEnvironment, mergeVertices };
    })();
  }

  return threeModulesPromise;
}

function withTimeout(promise, timeoutMs, label) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`${label} timed out after ${Math.round(timeoutMs / 1000)}s`));
    }, timeoutMs);

    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      }
    );
  });
}

async function fetchModelByteLength(url) {
  try {
    const head = await fetch(url, { method: "HEAD" });
    if (!head.ok) return null;
    const len = Number(head.headers.get("content-length"));
    return Number.isFinite(len) && len > 0 ? len : null;
  } catch {
    return null;
  }
}

function resolveColor(THREE, value) {
  return value instanceof THREE.Color ? value : new THREE.Color(value);
}

function bootError(message, error) {
  console.error(error);
  if (!document.body.innerHTML.trim()) {
    document.body.textContent = message;
  }
}

function chooseInitialModelUrl(model, hasDistinctFallback) {
  const primaryUrl = model.primaryUrl || model.url;
  const fallbackUrl = model.fallbackUrl || primaryUrl;
  const fullQueryParam = model.fullQueryParam;
  const params = new URLSearchParams(window.location.search);
  if (fullQueryParam) {
    if (params.get(fullQueryParam) === "1") {
      return primaryUrl;
    }
  }
  if (params.get("preview") === "1" && hasDistinctFallback) {
    return fallbackUrl;
  }
  if (model.preferFallback && hasDistinctFallback) {
    return fallbackUrl;
  }
  if (window.matchMedia("(max-width: 820px)").matches && hasDistinctFallback) {
    return fallbackUrl;
  }
  return primaryUrl;
}

function loadMessageForUrl(piece, url, primaryUrl, fallbackUrl) {
  const view = piece.view || {};
  if (url === fallbackUrl && fallbackUrl !== primaryUrl) {
    return view.fallbackLoadingText || DEFAULT_FALLBACK_LOADING_TEXT;
  }
  return view.primaryLoadingText || DEFAULT_PRIMARY_LOADING_TEXT;
}

export async function initStlMuseumPage(piece) {
  const defaults = createViewerDefaults(piece.defaults);
  const model = piece.model || {};
  const sceneConfig = piece.scene || {};
  const primaryUrl = model.primaryUrl || model.url;
  const fallbackUrl = model.fallbackUrl || primaryUrl;
  const hasDistinctFallback = fallbackUrl !== primaryUrl;
  const initialUrl = chooseInitialModelUrl(model, hasDistinctFallback);
  const initialLoadingText = loadMessageForUrl(piece, initialUrl, primaryUrl, fallbackUrl);

  const ui = renderViewerShell({
    pageTitle: piece.pageTitle,
    viewerTitle: piece.viewerTitle,
    subtitle: piece.subtitle,
    medium: piece.medium,
    dimensions: piece.dimensions,
    location: piece.location,
    locationLabel: piece.locationLabel,
    source: piece.source,
    statsLoading: initialLoadingText,
    loadingText: initialLoadingText,
    defaults,
    controlsHint: piece.controlsHint
  });

  ui.setDefaults();

  const primaryTimeoutMs = piece.timeouts?.primaryMs || DEFAULT_PRIMARY_TIMEOUT_MS;
  const fallbackTimeoutMs = piece.timeouts?.fallbackMs || DEFAULT_FALLBACK_TIMEOUT_MS;
  const searchParams = new URLSearchParams(window.location.search);
  const embedMode = searchParams.get("embed") || searchParams.get("mode") || "";
  const isHeroEmbed = embedMode === "hero";
  const isPreviewMode = isHeroEmbed || searchParams.get("preview") === "1";
  const stagePalette = isHeroEmbed ? HERO_PREVIEW_STAGE : DEFAULT_DARK_STAGE;
  const exposureBoost = isHeroEmbed ? 0.48 : 0;
  const defaultYaw = sceneConfig.defaultYaw ?? DEFAULT_MODEL_YAW;
  const rotateX = sceneConfig.rotateX ?? DEFAULT_ROTATE_X;
  const rotateY = sceneConfig.rotateY ?? 0;
  const rotateZ = sceneConfig.rotateZ ?? 0;
  const targetHeight = sceneConfig.targetHeight ?? DEFAULT_TARGET_HEIGHT;
  const showPedestal = inferPedestalEnabled(piece, sceneConfig);
  const pedestalHeight = showPedestal ? resolvePedestalHeight(sceneConfig, targetHeight) : 0.004;
  const focusYRatio = sceneConfig.focusYRatio ?? 0.57;
  const materialConfig = { ...DEFAULT_MATERIAL, ...(piece.material || {}) };
  const stage = ui.stage;
  const stats = ui.stats;

  try {
    const { THREE, OrbitControls, STLLoader, RoomEnvironment, mergeVertices } = await getThreeModules();
    const isMobileRender = window.matchMedia("(max-width: 820px)").matches;
    let modelUrlInUse = initialUrl;

    const setLoadingState = (message) => {
      stats.textContent = message;
      ui.setLoadingState(message);
    };

    setLoadingState(initialLoadingText);

    let stlByteLength = await fetchModelByteLength(modelUrlInUse);

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isPreviewMode ? 1 : isMobileRender ? 1.15 : 1.8));
    renderer.setSize(stage.clientWidth, stage.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = defaults.exposure + exposureBoost;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(stagePalette.background);
    scene.fog = new THREE.Fog(stagePalette.fog, 7.0, 12.0);

    const camera = new THREE.PerspectiveCamera(44, stage.clientWidth / stage.clientHeight, 0.01, 120);
    camera.position.set(2.3, 1.6, defaults.zoom);

    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(renderer), 0.03).texture;

    const hemi = new THREE.HemisphereLight(stagePalette.hemiSky, stagePalette.hemiGround, 0.95);
    scene.add(hemi);

    const keyLight = new THREE.DirectionalLight(stagePalette.key, defaults.lightPower);
    keyLight.castShadow = true;
    const shadowMapSize = isPreviewMode ? 768 : isMobileRender ? 1024 : 2048;
    keyLight.shadow.mapSize.set(shadowMapSize, shadowMapSize);
    keyLight.shadow.camera.near = 0.1;
    keyLight.shadow.camera.far = 16;
    keyLight.shadow.camera.left = -3.2;
    keyLight.shadow.camera.right = 3.2;
    keyLight.shadow.camera.top = 3.2;
    keyLight.shadow.camera.bottom = -3.2;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(stagePalette.fill, defaults.lightPower * 0.82);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(stagePalette.rim, defaults.lightPower * 0.66);
    scene.add(rimLight);

    const bounceLight = new THREE.PointLight(stagePalette.bounce, defaults.lightPower * 0.34, 12, 2);
    bounceLight.position.set(0.0, 0.9, 1.25);
    scene.add(bounceLight);

    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(12, 12),
      new THREE.MeshStandardMaterial({ color: stagePalette.floor, roughness: 0.96, metalness: 0.0 })
    );
    floor.rotation.x = -Math.PI * 0.5;
    floor.position.y = 0;
    floor.receiveShadow = true;
    scene.add(floor);

    let sculptureMaterial = null;
    let sculpture = null;
    let focusY = 1.0;

    try {
      const loader = new STLLoader();
      let geometry = null;
      const startUrl = modelUrlInUse;
      const startTimeout = startUrl === primaryUrl ? primaryTimeoutMs : fallbackTimeoutMs;

      try {
        geometry = await withTimeout(loader.loadAsync(startUrl), startTimeout, "STL load");
      } catch (error) {
        if (hasDistinctFallback && startUrl !== fallbackUrl) {
          modelUrlInUse = fallbackUrl;
          stlByteLength = await fetchModelByteLength(modelUrlInUse);
          setLoadingState(piece.view?.fallbackSwitchText || DEFAULT_SWITCH_LOADING_TEXT);
          geometry = await withTimeout(loader.loadAsync(modelUrlInUse), fallbackTimeoutMs, "Fallback STL load");
        } else {
          throw error;
        }
      }

      if (rotateX) {
        geometry.rotateX(rotateX);
      }
      if (rotateY) {
        geometry.rotateY(rotateY);
      }
      if (rotateZ) {
        geometry.rotateZ(rotateZ);
      }

      const vertexCount = geometry.attributes.position?.count || 0;
      if (vertexCount < 1_800_000) {
        geometry = mergeVertices(geometry, 1e-4);
      }
      geometry.computeVertexNormals();
      geometry.computeBoundingBox();

      const box = geometry.boundingBox;
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      geometry.translate(-center.x, -box.min.y, -center.z);

      sculptureMaterial = new THREE.MeshPhysicalMaterial({
        color: resolveColor(THREE, materialConfig.color),
        roughness: defaults.rough,
        metalness: materialConfig.metalness,
        clearcoat: materialConfig.clearcoat,
        clearcoatRoughness: materialConfig.clearcoatRoughness,
        sheen: materialConfig.sheen,
        sheenRoughness: materialConfig.sheenRoughness,
        sheenColor: resolveColor(THREE, materialConfig.sheenColor),
        reflectivity: materialConfig.reflectivity
      });

      sculpture = new THREE.Mesh(geometry, sculptureMaterial);
      const scale = targetHeight / size.y;
      if (showPedestal) {
        scene.add(
          createPedestalMesh(
            THREE,
            resolveGeometryPedestalRadius(geometry, size, scale, sceneConfig),
            pedestalHeight,
            {
              ...sceneConfig,
              pedestalColor: sceneConfig.pedestalColor ?? stagePalette.pedestal
            }
          )
        );
      }
      sculpture.scale.setScalar(scale);
      sculpture.rotation.y = defaultYaw;
      sculpture.position.y = pedestalHeight;
      sculpture.castShadow = true;
      sculpture.receiveShadow = true;
      scene.add(sculpture);

      focusY = pedestalHeight + targetHeight * focusYRatio;

      const triCount = geometry.index ? geometry.index.count / 3 : geometry.attributes.position.count / 3;
      const sizeLabel = stlByteLength ? `${(stlByteLength / (1024 * 1024)).toFixed(1)} MB STL` : "High-fidelity STL";
      const fidelityLabel = hasDistinctFallback && modelUrlInUse === fallbackUrl ? " (fallback)" : "";
      stats.textContent = `${Math.round(triCount).toLocaleString()} triangles | ${sizeLabel}${fidelityLabel}`;

      ui.clearLoading();
      stage.appendChild(renderer.domElement);
    } catch (error) {
      stats.textContent = "Failed to load STL mesh.";
      ui.setLoadingState(`Mesh load error: ${error.message}`, {
        state: "error",
        title: "Unable to load this STL"
      });
      return;
    }

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.minDistance = 0.55;
    controls.maxDistance = 8.0;
    controls.maxPolarAngle = Math.PI * 0.64;
    const mobileQuery = window.matchMedia("(max-width: 820px)");
    let isMobileLayout = mobileQuery.matches;

    function zoomWithMobileOffset() {
      return ui.n("zoom") + (isMobileLayout ? 0.85 : 0.0);
    }

    function applyDefaultView() {
      const mobileTargetLift = isMobileLayout ? 0.22 : 0.0;
      controls.target.set(0, focusY + mobileTargetLift, 0);
      const viewVector = isMobileLayout
        ? new THREE.Vector3(...(sceneConfig.mobileViewVector || [1.1, 0.45, 2.2]))
        : new THREE.Vector3(...(sceneConfig.defaultViewVector || [1.8, 0.72, 1.85]));
      camera.position.copy(controls.target.clone().add(viewVector.normalize().multiplyScalar(defaults.zoom + (isMobileLayout ? 0.85 : 0.0))));
      controls.update();
    }

    function updateLight() {
      const angle = THREE.MathUtils.degToRad(ui.n("lightAngle"));
      const radius = 3.6;
      keyLight.position.set(Math.cos(angle) * radius, 4.2, Math.sin(angle) * radius);
      fillLight.position.set(-Math.sin(angle) * 3.2, 2.3, Math.cos(angle) * 2.8);
      rimLight.position.set(-Math.cos(angle) * 2.7, 2.7, -Math.sin(angle) * 2.9);

      const power = ui.n("lightPower");
      const multi = document.getElementById("multiLight").checked;

      keyLight.intensity = power;
      fillLight.intensity = multi ? power * 0.82 : 0;
      rimLight.intensity = multi ? power * 0.66 : 0;
      bounceLight.intensity = multi ? power * 0.34 : 0;
    }

    function updateCameraDistance() {
      const distance = zoomWithMobileOffset();
      const direction = camera.position.clone().sub(controls.target).normalize();
      camera.position.copy(controls.target.clone().addScaledVector(direction, distance));
    }

    function updateLook() {
      renderer.toneMappingExposure = ui.n("exposure") + exposureBoost;
      if (sculptureMaterial) {
        sculptureMaterial.roughness = ui.n("rough");
        sculptureMaterial.wireframe = document.getElementById("wire").checked;
      }
    }

    applyDefaultView();

    ui.bindControls({
      onRangeInput: (id) => {
        if (id === "zoom") {
          updateCameraDistance();
        }
        if (id === "lightAngle" || id === "lightPower") {
          updateLight();
        }
        if (id === "exposure" || id === "rough") {
          updateLook();
        }
      },
      onCheckboxChange: () => {
        controls.enabled = document.getElementById("canManipulate").checked;
        updateLight();
        updateLook();
      },
      onFront: () => {
        camera.position.set(0.0, focusY + (isMobileLayout ? 0.35 : 0.2), zoomWithMobileOffset());
        controls.target.set(0, focusY + (isMobileLayout ? 0.22 : 0.0), 0);
        controls.update();
      },
      onReset: () => {
        ui.setDefaults();
        if (sculpture) {
          sculpture.rotation.y = defaultYaw;
        }
        applyDefaultView();
        updateLight();
        updateLook();
      }
    });

    updateLight();
    updateLook();
    controls.enabled = defaults.canManipulate;

    const clock = new THREE.Clock();

    function render() {
      const dt = clock.getDelta();

      if (sculpture && document.getElementById("autoRotate").checked) {
        sculpture.rotation.y += dt * ui.n("spin");
      }

      controls.update();
      renderer.render(scene, camera);
      requestAnimationFrame(render);
    }

    render();

    const onResize = () => {
      const width = stage.clientWidth;
      const height = stage.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      const nextMobile = mobileQuery.matches;
      if (nextMobile !== isMobileLayout) {
        isMobileLayout = nextMobile;
        applyDefaultView();
      } else {
        updateCameraDistance();
      }
    };

    window.addEventListener("resize", onResize);
  } catch (error) {
    bootError("Failed to initialize STL viewer.", error);
    if (stats) {
      stats.textContent = "Failed to load 3D engine modules.";
    }
    ui.setLoadingState(`Module load error: ${error.message}`, {
      state: "error",
      title: "Viewer startup failed"
    });
  }
}
