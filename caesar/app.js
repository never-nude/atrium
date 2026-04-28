import * as THREE from "https://esm.sh/three@0.161.0?bundle";
import { OrbitControls } from "https://esm.sh/three@0.161.0/examples/jsm/controls/OrbitControls.js?bundle";

const CATALOG_URL = "./data/catalog.json";
const NUMBER = new Intl.NumberFormat("en-US");

const defaults = {
  spin: 0.12,
  zoom: 2.7,
  lightAngle: 34,
  lightPower: 2.2,
  exposure: 0.39,
  rough: 0.58,
  canManipulate: true,
  autoRotate: true,
  multiLight: true,
  wire: false
};

const dom = {
  pieceTitle: getById("pieceTitle"),
  stats: getById("stats"),
  workSelect: getById("workSelect"),
  spin: getById("spin"),
  spinv: getById("spinv"),
  zoom: getById("zoom"),
  zoomv: getById("zoomv"),
  lightAngle: getById("lightAngle"),
  lightAnglev: getById("lightAnglev"),
  lightPower: getById("lightPower"),
  lightPowerv: getById("lightPowerv"),
  exposure: getById("exposure"),
  exposurev: getById("exposurev"),
  rough: getById("rough"),
  roughv: getById("roughv"),
  canManipulate: getById("canManipulate"),
  autoRotate: getById("autoRotate"),
  multiLight: getById("multiLight"),
  wire: getById("wire"),
  frontBtn: getById("frontBtn"),
  resetBtn: getById("resetBtn"),
  viewerCanvas: getById("viewerCanvas"),
  viewerMessage: getById("viewerMessage")
};

const rangeIds = ["spin", "zoom", "lightAngle", "lightPower", "exposure", "rough"];
const checkIds = ["canManipulate", "autoRotate", "multiLight", "wire"];

const state = {
  items: [],
  byId: new Map(),
  activeId: null,
  zoomBaseDistance: null,
  loadingId: null
};

let viewer = null;

async function boot() {
  setDefaults();
  refreshReadouts();

  await viewer.init();

  const manifest = await fetchJson(CATALOG_URL);
  const items = (manifest.items || []).map(normalizeItem).filter((item) => item.dataUrl);

  if (items.length === 0) {
    dom.workSelect.innerHTML = '<option value="">No renderable sculptures found</option>';
    dom.workSelect.disabled = true;
    viewer.setMessage("No renderable sculptures are available.", true);
    dom.stats.textContent = "Renderable catalog is empty.";
    return;
  }

  state.items = items;
  state.byId = new Map(items.map((item) => [item.id, item]));
  populateWorkSelect();

  const requested = new URLSearchParams(window.location.search).get("id");
  const initialId = state.byId.has(requested) ? requested : items[0].id;

  await selectItem(initialId, { replaceHistory: true, resetPose: true });
}

function bindEvents() {
  dom.workSelect.addEventListener("change", () => {
    const id = dom.workSelect.value;
    if (!id) {
      return;
    }
    void selectItem(id, { pushHistory: true, resetPose: true });
  });

  for (const id of rangeIds) {
    getById(id).addEventListener("input", () => {
      refreshReadouts();
      applyViewerControls({ preserveView: true });
    });
  }

  for (const id of checkIds) {
    getById(id).addEventListener("change", () => {
      applyViewerControls({ preserveView: true });
    });
  }

  dom.frontBtn.addEventListener("click", () => {
    viewer.frontView(Number(dom.zoom.value), state.zoomBaseDistance, defaults.zoom);
  });

  dom.resetBtn.addEventListener("click", () => {
    setDefaults();
    refreshReadouts();
    viewer.resetView(Number(dom.zoom.value), state.zoomBaseDistance, defaults.zoom);
    applyViewerControls({ preserveView: true });
  });

  window.addEventListener("popstate", () => {
    const requested = new URLSearchParams(window.location.search).get("id");
    if (requested && state.byId.has(requested)) {
      void selectItem(requested, { resetPose: true });
    }
  });
}

function setDefaults() {
  for (const id of rangeIds) {
    getById(id).value = String(defaults[id]);
  }
  for (const id of checkIds) {
    getById(id).checked = Boolean(defaults[id]);
  }
}

function refreshReadouts() {
  dom.spinv.textContent = Number(dom.spin.value).toFixed(2);
  dom.zoomv.textContent = Number(dom.zoom.value).toFixed(2);
  dom.lightAnglev.textContent = Number(dom.lightAngle.value).toFixed(2);
  dom.lightPowerv.textContent = Number(dom.lightPower.value).toFixed(2);
  dom.exposurev.textContent = Number(dom.exposure.value).toFixed(2);
  dom.roughv.textContent = Number(dom.rough.value).toFixed(2);
}

function normalizeItem(item) {
  return {
    ...item,
    id: String(item.id || ""),
    title: item.title || "Untitled",
    artist: item.artist || "Unknown artist",
    year: item.year || "",
    renderStyle: item.renderStyle || "default",
    defaultWireframe: Boolean(item.defaultWireframe),
    sourceTriangleCount: Number(item.sourceTriangleCount || item.triangleCount || 0),
    triangleCount: Number(item.triangleCount || 0),
    nodeCount: Number(item.nodeCount || 0),
    edgeCount: Number(item.edgeCount || 0)
  };
}

function populateWorkSelect() {
  dom.workSelect.innerHTML = state.items
    .map((item) => {
      const meta = item.artist ? ` — ${item.artist}` : "";
      return `<option value="${escapeHtml(item.id)}">${escapeHtml(item.title)}${escapeHtml(meta)}</option>`;
    })
    .join("");
  dom.workSelect.disabled = false;
}

async function selectItem(id, options = {}) {
  const item = state.byId.get(id);
  if (!item) {
    return;
  }

  state.activeId = id;
  state.loadingId = id;
  dom.workSelect.value = id;

  const title = item.artist ? `${item.artist}: ${item.title}` : item.title;
  dom.pieceTitle.textContent = title;
  dom.stats.textContent = `Loading ${item.title}...`;
  dom.wire.checked = item.defaultWireframe;
  viewer.setWireframe(item.defaultWireframe);

  if (options.pushHistory || options.replaceHistory) {
    const url = new URL(window.location.href);
    url.searchParams.set("id", id);
    if (options.pushHistory) {
      window.history.pushState({ id }, "", url);
    } else {
      window.history.replaceState({ id }, "", url);
    }
  }

  try {
    const renderStats = await viewer.load(item, "auto");

    if (state.loadingId !== id) {
      return;
    }

    state.zoomBaseDistance = viewer.getFitDistance() || state.zoomBaseDistance;

    if (options.resetPose) {
      viewer.resetView(Number(dom.zoom.value), state.zoomBaseDistance, defaults.zoom);
    }

    applyViewerControls({ preserveView: true });
    dom.stats.textContent = buildStatsLabel(item, renderStats);
  } catch (error) {
    if (String(error.message).includes("superseded")) {
      return;
    }
    viewer.setMessage(`Failed to render ${item.title}: ${error.message}`, true);
    dom.stats.textContent = `Failed to render ${item.title}.`;
  }
}

function applyViewerControls({ preserveView }) {
  viewer.setSpin(Number(dom.spin.value));
  viewer.setAutoRotate(dom.autoRotate.checked);
  viewer.setManipulation(dom.canManipulate.checked);

  viewer.applyZoom(Number(dom.zoom.value), state.zoomBaseDistance, defaults.zoom, {
    preserveDirection: Boolean(preserveView)
  });

  viewer.updateLights(Number(dom.lightAngle.value), Number(dom.lightPower.value), dom.multiLight.checked);
  viewer.setExposure(Number(dom.exposure.value));
  viewer.setRoughness(Number(dom.rough.value));
  viewer.setWireframe(dom.wire.checked);
}

function buildStatsLabel(item, renderStats) {
  const renderedTriangles = Number(renderStats?.renderedTriangles || item.triangleCount || 0);
  const sourceTriangles = Number(renderStats?.sourceTriangles || item.sourceTriangleCount || 0);
  const profile = renderStats?.profileName || "auto";
  const period = item.year ? ` • ${item.year}` : "";

  return `${item.artist}${period} • ${NUMBER.format(renderedTriangles)} rendered triangles • ${NUMBER.format(
    sourceTriangles
  )} source triangles • ${profile} profile`;
}

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Could not load ${url} (${response.status})`);
  }
  return response.json();
}

class MinimalArchiveViewer {
  constructor({ canvas, messageEl }) {
    this.canvas = canvas;
    this.messageEl = messageEl;

    this.renderer = null;
    this.scene = null;
    this.camera = null;
    this.controls = null;
    this.root = null;

    this.surfaceMesh = null;
    this.edgeLines = null;
    this.nodePoints = null;
    this.floor = null;

    this.keyLight = null;
    this.fillLight = null;
    this.rimLight = null;
    this.bounceLight = null;

    this.autoRotate = true;
    this.spinSpeed = defaults.spin;
    this.userInteracting = false;

    this.lightAngle = defaults.lightAngle;
    this.lightPower = defaults.lightPower;
    this.multiLight = defaults.multiLight;
    this.roughness = defaults.rough;
    this.wireframe = defaults.wire;

    this.requestCounter = 0;
    this.latestRequestId = 0;
    this.pendingRequests = new Map();

    this.fitCenter = null;
    this.fitOffset = null;
    this.fitDistance = null;
    this.fitHeight = 1.6;

    this.worker = new Worker(new URL("./model-worker.js", import.meta.url), { type: "module" });
    this.worker.onmessage = (event) => this.onWorkerMessage(event);

    this.animate = this.animate.bind(this);
    this.resize = this.resize.bind(this);
  }

  async init() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: false,
      powerPreference: "high-performance"
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight, false);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = defaults.exposure;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xe8dfd0);
    this.scene.fog = new THREE.Fog(0xe8dfd0, 9.0, 18.0);

    const width = this.canvas.clientWidth || 2;
    const height = this.canvas.clientHeight || 2;
    this.camera = new THREE.PerspectiveCamera(44, width / height, 0.01, 120);
    this.camera.position.set(2.4, 1.5, defaults.zoom);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.06;
    this.controls.enablePan = true;
    this.controls.minDistance = 0.7;
    this.controls.maxDistance = 20;

    this.controls.addEventListener("start", () => {
      this.userInteracting = true;
    });
    this.controls.addEventListener("end", () => {
      this.userInteracting = false;
    });

    this.root = new THREE.Group();
    this.scene.add(this.root);

    const hemi = new THREE.HemisphereLight(0xfff7e9, 0xbcad98, 0.95);
    this.scene.add(hemi);

    this.keyLight = new THREE.DirectionalLight(0xfff7ea, defaults.lightPower);
    this.keyLight.castShadow = true;
    this.keyLight.shadow.mapSize.set(2048, 2048);
    this.keyLight.shadow.camera.near = 0.1;
    this.keyLight.shadow.camera.far = 30;
    this.keyLight.shadow.camera.left = -6;
    this.keyLight.shadow.camera.right = 6;
    this.keyLight.shadow.camera.top = 6;
    this.keyLight.shadow.camera.bottom = -6;
    this.scene.add(this.keyLight);
    this.scene.add(this.keyLight.target);

    this.fillLight = new THREE.DirectionalLight(0xf4efe7, defaults.lightPower * 0.82);
    this.scene.add(this.fillLight);
    this.scene.add(this.fillLight.target);

    this.rimLight = new THREE.DirectionalLight(0xdde4f4, defaults.lightPower * 0.66);
    this.scene.add(this.rimLight);
    this.scene.add(this.rimLight.target);

    this.bounceLight = new THREE.PointLight(0xffead1, defaults.lightPower * 0.34, 24, 2);
    this.scene.add(this.bounceLight);

    this.floor = new THREE.Mesh(
      new THREE.PlaneGeometry(24, 24),
      new THREE.MeshStandardMaterial({ color: 0xd2c5b2, roughness: 0.96, metalness: 0.0 })
    );
    this.floor.rotation.x = -Math.PI * 0.5;
    this.floor.receiveShadow = true;
    this.scene.add(this.floor);

    this.resizeObserver = new ResizeObserver(this.resize);
    this.resizeObserver.observe(this.canvas.parentElement);

    window.addEventListener("resize", this.resize);
    this.animate();
  }

  onWorkerMessage(event) {
    const payload = event.data || {};
    const pending = this.pendingRequests.get(payload.requestId);
    if (!pending) {
      return;
    }

    this.pendingRequests.delete(payload.requestId);

    if (!payload.ok) {
      pending.reject(new Error(payload.error || "Worker failed to process geometry."));
      return;
    }

    pending.resolve(payload.model);
  }

  async load(item, profileName) {
    this.setMessage(`Loading ${item.title}...`);

    const requestId = ++this.requestCounter;
    this.latestRequestId = requestId;

    const resultPromise = new Promise((resolve, reject) => {
      this.pendingRequests.set(requestId, { resolve, reject });
    });

    this.worker.postMessage({
      requestId,
      item,
      profileName
    });

    const model = await resultPromise;

    if (requestId !== this.latestRequestId) {
      throw new Error("superseded");
    }

    this.applyModel(item, model);

    this.setMessage(
      `${NUMBER.format(model.stats.renderedTriangles)} triangles • ${NUMBER.format(
        model.stats.renderedNodes
      )} nodes • ${model.profileName}`
    );

    return {
      ...model.stats,
      profileName: model.profileName
    };
  }

  applyModel(item, model) {
    this.disposeModel();

    const palette = item.palette || {};

    if (model.surface && model.surface.positions.length > 0 && model.surface.indices.length > 0) {
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.BufferAttribute(model.surface.positions, 3));
      geometry.setIndex(new THREE.BufferAttribute(model.surface.indices, 1));
      geometry.computeVertexNormals();

      const vertexColors = buildSurfaceVertexColors(geometry, item, palette);

      const material = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(palette.surface || "#ece3d3"),
        vertexColors: Boolean(vertexColors),
        roughness: this.roughness,
        metalness: 0.02,
        clearcoat: 0.14,
        clearcoatRoughness: 0.38,
        sheen: item.renderStyle === "human-scan" ? 0.22 : 0.0,
        sheenColor: new THREE.Color(palette.surfaceWarm || palette.surface || "#ece3d3"),
        specularIntensity: item.renderStyle === "human-scan" ? 0.34 : 0.22,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.93
      });

      this.surfaceMesh = new THREE.Mesh(geometry, material);
      this.surfaceMesh.castShadow = true;
      this.surfaceMesh.receiveShadow = true;
      this.root.add(this.surfaceMesh);
    }

    if (model.edges && model.edges.positions.length > 0) {
      const edgeGeometry = new THREE.BufferGeometry();
      edgeGeometry.setAttribute("position", new THREE.BufferAttribute(model.edges.positions, 3));
      const edgeMaterial = new THREE.LineBasicMaterial({
        color: palette.edge || "#8d7550",
        transparent: true,
        opacity: 0.28
      });
      this.edgeLines = new THREE.LineSegments(edgeGeometry, edgeMaterial);
      this.edgeLines.visible = this.wireframe;
      this.root.add(this.edgeLines);
    }

    if (!this.surfaceMesh && model.nodes && model.nodes.positions.length > 0) {
      const nodeGeometry = new THREE.BufferGeometry();
      nodeGeometry.setAttribute("position", new THREE.BufferAttribute(model.nodes.positions, 3));
      const nodeMaterial = new THREE.PointsMaterial({
        color: palette.node || "#b68d5f",
        size: 0.006,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.9
      });
      this.nodePoints = new THREE.Points(nodeGeometry, nodeMaterial);
      this.root.add(this.nodePoints);
    }

    this.fitToModel();
    this.updateLights(this.lightAngle, this.lightPower, this.multiLight);
    this.setWireframe(this.wireframe);
    this.setRoughness(this.roughness);
  }

  fitToModel() {
    const bounds = new THREE.Box3().setFromObject(this.root);
    if (bounds.isEmpty()) {
      return;
    }

    const center = bounds.getCenter(new THREE.Vector3());
    const size = bounds.getSize(new THREE.Vector3());

    const maxDim = Math.max(size.x, size.y, size.z, 0.001);
    const distance = maxDim * 1.85;

    this.fitCenter = center.clone();
    this.fitDistance = distance;
    this.fitHeight = size.y;

    const startOffset = new THREE.Vector3(distance * 0.82, distance * 0.34, distance);
    this.fitOffset = startOffset.clone();

    this.controls.target.copy(center);
    this.camera.position.copy(center.clone().add(startOffset));

    this.camera.near = Math.max(maxDim / 1500, 0.001);
    this.camera.far = Math.max(maxDim * 160, 200);
    this.camera.updateProjectionMatrix();
    this.controls.update();

    this.floor.position.set(center.x, bounds.min.y - 0.02, center.z);
    this.floor.scale.setScalar(Math.max(maxDim * 1.9, 7.5));
  }

  getFitDistance() {
    return this.fitDistance;
  }

  applyZoom(zoomValue, zoomBaseDistance, baseZoomValue, options = {}) {
    if (!this.fitCenter) {
      return;
    }

    const baseDistance = zoomBaseDistance || this.fitDistance || 2.8;
    const targetDistance = Math.max(0.6, baseDistance * (zoomValue / Math.max(baseZoomValue, 0.1)));

    const preserveDirection = options.preserveDirection !== false;
    const target = this.controls.target.clone();
    let direction = null;

    if (preserveDirection) {
      direction = this.camera.position.clone().sub(target);
    } else if (this.fitOffset) {
      direction = this.fitOffset.clone();
    }

    if (!direction || direction.lengthSq() < 1e-7) {
      direction = new THREE.Vector3(0.82, 0.34, 1.0);
    }

    direction.normalize();
    this.camera.position.copy(target.addScaledVector(direction, targetDistance));
    this.controls.update();
  }

  frontView(zoomValue, zoomBaseDistance, baseZoomValue) {
    if (!this.fitCenter) {
      return;
    }

    const baseDistance = zoomBaseDistance || this.fitDistance || 2.8;
    const distance = Math.max(0.6, baseDistance * (zoomValue / Math.max(baseZoomValue, 0.1)));

    this.controls.target.copy(this.fitCenter);
    this.camera.position.set(
      this.fitCenter.x,
      this.fitCenter.y + this.fitHeight * 0.08,
      this.fitCenter.z + distance
    );
    this.controls.update();
  }

  resetView(zoomValue, zoomBaseDistance, baseZoomValue) {
    if (!this.fitCenter || !this.fitOffset) {
      return;
    }

    this.root.rotation.set(0, 0, 0);

    const baseDistance = zoomBaseDistance || this.fitDistance || 2.8;
    const distance = Math.max(0.6, baseDistance * (zoomValue / Math.max(baseZoomValue, 0.1)));

    const direction = this.fitOffset.clone().normalize();
    this.controls.target.copy(this.fitCenter);
    this.camera.position.copy(this.fitCenter.clone().addScaledVector(direction, distance));
    this.controls.update();
  }

  setManipulation(enabled) {
    if (!this.controls) {
      return;
    }
    this.controls.enabled = Boolean(enabled);
    if (!enabled) {
      this.userInteracting = false;
    }
  }

  setSpin(value) {
    this.spinSpeed = Number(value) || 0;
  }

  setAutoRotate(enabled) {
    this.autoRotate = Boolean(enabled);
  }

  updateLights(angleDeg, power, multiLight) {
    this.lightAngle = Number(angleDeg) || 0;
    this.lightPower = Number(power) || 1;
    this.multiLight = Boolean(multiLight);

    if (!this.fitCenter || !this.keyLight) {
      return;
    }

    const angle = THREE.MathUtils.degToRad(this.lightAngle);
    const target = this.controls.target;

    this.keyLight.position.set(target.x + Math.cos(angle) * 4.6, target.y + 4.2, target.z + Math.sin(angle) * 4.6);
    this.fillLight.position.set(target.x - Math.sin(angle) * 3.8, target.y + 2.6, target.z + Math.cos(angle) * 3.2);
    this.rimLight.position.set(target.x - Math.cos(angle) * 3.2, target.y + 3.2, target.z - Math.sin(angle) * 3.4);
    this.bounceLight.position.set(target.x, target.y + 0.9, target.z + 1.3);

    this.keyLight.target.position.copy(target);
    this.fillLight.target.position.copy(target);
    this.rimLight.target.position.copy(target);

    this.keyLight.intensity = this.lightPower;
    this.fillLight.intensity = this.multiLight ? this.lightPower * 0.82 : 0;
    this.rimLight.intensity = this.multiLight ? this.lightPower * 0.66 : 0;
    this.bounceLight.intensity = this.multiLight ? this.lightPower * 0.34 : 0;

    this.keyLight.target.updateMatrixWorld();
    this.fillLight.target.updateMatrixWorld();
    this.rimLight.target.updateMatrixWorld();
  }

  setExposure(value) {
    if (!this.renderer) {
      return;
    }
    this.renderer.toneMappingExposure = Number(value) || defaults.exposure;
  }

  setRoughness(value) {
    this.roughness = THREE.MathUtils.clamp(Number(value) || defaults.rough, 0.08, 1);
    if (this.surfaceMesh && this.surfaceMesh.material && "roughness" in this.surfaceMesh.material) {
      this.surfaceMesh.material.roughness = this.roughness;
      this.surfaceMesh.material.needsUpdate = true;
    }
  }

  setWireframe(enabled) {
    this.wireframe = Boolean(enabled);

    if (this.surfaceMesh && this.surfaceMesh.material) {
      this.surfaceMesh.material.wireframe = this.wireframe;
      this.surfaceMesh.material.needsUpdate = true;
    }

    if (this.edgeLines) {
      this.edgeLines.visible = this.wireframe;
    }
  }

  disposeModel() {
    for (const mesh of [this.surfaceMesh, this.edgeLines, this.nodePoints]) {
      if (!mesh) {
        continue;
      }
      if (mesh.geometry) {
        mesh.geometry.dispose();
      }
      if (mesh.material) {
        if (Array.isArray(mesh.material)) {
          for (const material of mesh.material) {
            material.dispose();
          }
        } else {
          mesh.material.dispose();
        }
      }
      this.root.remove(mesh);
    }

    this.surfaceMesh = null;
    this.edgeLines = null;
    this.nodePoints = null;
  }

  setMessage(text, isError = false) {
    this.messageEl.textContent = text;
    this.messageEl.style.borderColor = isError ? "rgba(184, 68, 42, 0.65)" : "rgba(133, 145, 129, 0.36)";
    this.messageEl.style.color = isError ? "#74270f" : "#304538";
  }

  resize() {
    if (!this.renderer || !this.camera) {
      return;
    }

    const parent = this.canvas.parentElement;
    const width = parent.clientWidth;
    const height = parent.clientHeight;
    if (width <= 0 || height <= 0) {
      return;
    }

    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  animate(timestamp = 0) {
    requestAnimationFrame(this.animate);

    if (!this.renderer || !this.scene || !this.camera || !this.controls) {
      return;
    }

    if (!this.lastTimestamp) {
      this.lastTimestamp = timestamp;
    }
    const dt = Math.min(0.06, Math.max(0.001, (timestamp - this.lastTimestamp) / 1000));
    this.lastTimestamp = timestamp;

    if (this.root && this.autoRotate && !this.userInteracting && this.spinSpeed > 0.0001) {
      this.root.rotation.y += dt * this.spinSpeed;
    }

    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
}

function getById(id) {
  const element = document.getElementById(id);
  if (!element) {
    throw new Error(`Missing expected DOM node: #${id}`);
  }
  return element;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function buildSurfaceVertexColors(geometry, item, palette) {
  if (item.renderStyle !== "human-scan") {
    return null;
  }

  const positionAttr = geometry.getAttribute("position");
  const normalAttr = geometry.getAttribute("normal");
  if (!positionAttr || !normalAttr) {
    return null;
  }

  let minY = Infinity;
  let maxY = -Infinity;
  for (let i = 0; i < positionAttr.count; i += 1) {
    const y = positionAttr.getY(i);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
  }

  const height = Math.max(maxY - minY, 1e-5);
  const colors = new Float32Array(positionAttr.count * 3);
  const base = new THREE.Color(palette.surface || "#cfaa96");
  const warm = new THREE.Color(palette.surfaceWarm || "#dfb59f");
  const cool = new THREE.Color(palette.surfaceCool || "#a88983");
  const shadow = new THREE.Color(palette.surfaceShadow || "#846962");
  const color = new THREE.Color();

  for (let i = 0; i < positionAttr.count; i += 1) {
    const x = positionAttr.getX(i);
    const y = positionAttr.getY(i);
    const z = positionAttr.getZ(i);
    const normalY = normalAttr.getY(i);
    const yNorm = (y - minY) / height;

    const grain = pseudoNoise3d(x * 17.0, y * 19.0, z * 23.0);
    const warmNoise = pseudoNoise3d(x * 41.0 + 3.1, y * 29.0 - 1.7, z * 31.0 + 5.4);
    const poreNoise = pseudoNoise3d(x * 95.0 - 4.3, y * 87.0 + 2.6, z * 91.0 - 0.9);

    const lightLift = THREE.MathUtils.clamp(0.97 + normalY * 0.07 + yNorm * 0.04, 0.86, 1.1);
    const toneShift = THREE.MathUtils.clamp(0.98 + (grain - 0.5) * 0.08 + (poreNoise - 0.5) * 0.04, 0.88, 1.1);
    const warmth = THREE.MathUtils.clamp(0.05 + warmNoise * 0.08 + (1 - yNorm) * 0.02, 0, 0.14);
    const coolness = THREE.MathUtils.clamp(0.03 + (1 - Math.max(normalY, 0)) * 0.08, 0, 0.12);

    color.copy(base);
    color.lerp(warm, warmth);
    color.lerp(cool, coolness);
    color.lerp(shadow, (1 - lightLift) * 0.2);
    color.multiplyScalar(lightLift * toneShift);

    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
  }

  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  return colors;
}

function pseudoNoise3d(x, y, z) {
  const value = Math.sin(x * 12.9898 + y * 78.233 + z * 37.719) * 43758.5453123;
  return value - Math.floor(value);
}

viewer = new MinimalArchiveViewer({
  canvas: dom.viewerCanvas,
  messageEl: dom.viewerMessage
});

bindEvents();

boot().catch((error) => {
  viewer.setMessage(`Failed to initialize viewer: ${error.message}`, true);
  dom.stats.textContent = "Viewer initialization failed.";
});
