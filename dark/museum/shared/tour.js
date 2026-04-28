import { museumPieces } from "./catalog.js";
import { museumPiecesExtension } from "./catalog-overlay.js";
import { createPedestalMesh } from "./pedestal.js";
import {
  applyStoredTheme,
  applyStoredUiMode,
  bindThemeToggles,
  bindUiModeToggles,
  getActiveTheme,
  getTourThemePalette
} from "./theme.js";

const GALLERY_TITLE = "Michelangelo Hall";
const DEFAULT_STL_ROTATE_X = -Math.PI * 0.5;
const LOOK_SENSITIVITY = 0.003;
const MOVE_SPEED_MPS = 2.2;
const TURN_SPEED_RPS = 1.35;
const USER_RADIUS = 0.54;
const ROOM = Object.freeze({
  width: 22,
  depth: 28,
  height: 8.4,
  start: [0, 1.67, 11.4]
});

const TOUR_WORKS = Object.freeze([
  {
    pieceId: "michelangelo-david",
    asset: "/michelangelo/david/david_tour.stl",
    heightCm: 517,
    position: [0, -10.6],
    yaw: Math.PI,
    pedestal: { height: 0.22, radius: 0.98 },
    collisionRadius: 1.55
  },
  {
    pieceId: "michelangelo-risen-christ",
    asset: "/michelangelo/risen-christ/risen_christ_tour.stl",
    heightCm: 251,
    position: [7.9, -4.6],
    yaw: -Math.PI * 0.42,
    pedestal: { height: 0.14, radius: 0.54 },
    collisionRadius: 1.02
  },
  {
    pieceId: "michelangelo-moses",
    asset: "/michelangelo/moses/moses_tour.stl",
    heightCm: 235,
    position: [-8.1, -4.8],
    yaw: Math.PI * 0.46,
    pedestal: { height: 0.16, radius: 0.58 },
    collisionRadius: 1.06
  },
  {
    pieceId: "michelangelo-bacchus",
    asset: "/michelangelo/bacchus/bacchus_tour.stl",
    heightCm: 208,
    position: [-7.8, 4.2],
    yaw: Math.PI * 0.3,
    pedestal: { height: 0.16, radius: 0.52 },
    collisionRadius: 0.98
  },
  {
    pieceId: "michelangelo-bruges-madonna",
    asset: "/michelangelo/bruges-madonna/bruges_madonna_tour.stl",
    heightCm: 128,
    position: [8.0, 4.3],
    yaw: -Math.PI * 0.2,
    pedestal: { height: 0.22, radius: 0.42 },
    collisionRadius: 0.88
  },
  {
    pieceId: "michelangelo-brutus",
    asset: "/michelangelo/brutus/brutus_tour.stl",
    heightCm: 75,
    position: [-3.2, 8.8],
    yaw: Math.PI * 0.08,
    pedestal: { height: 1.12, radius: 0.32 },
    collisionRadius: 0.76
  },
  {
    pieceId: "michelangelo-crouching-boy",
    asset: "/michelangelo/crouching-boy/crouching_boy_tour.stl",
    heightCm: 61,
    position: [3.4, 8.7],
    yaw: -Math.PI * 0.12,
    pedestal: { height: 0.58, radius: 0.34 },
    collisionRadius: 0.74
  }
]);

const WORKS_BY_ID = Object.freeze(
  Object.fromEntries(
    TOUR_WORKS.map((entry) => {
      const piece = museumPiecesExtension[entry.pieceId] || museumPieces[entry.pieceId];
      if (!piece) {
        throw new Error(`Missing piece definition for ${entry.pieceId}`);
      }

      return [
        entry.pieceId,
        {
          ...entry,
          piece,
          title: simplifyTitle(piece.viewerTitle),
          attribution: String(piece.subtitle || "").replace(/^Artist:\s*/i, "").trim(),
          href: piece.path
        }
      ];
    })
  )
);

function simplifyTitle(viewerTitle = "") {
  return viewerTitle.replace(/\s+\([^)]*\)\s*$/, "").trim();
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function formatMeters(heightCm) {
  return `${(heightCm / 100).toFixed(2)} m`;
}

function createWorkListHtml() {
  return TOUR_WORKS.map((entry) => {
    const work = WORKS_BY_ID[entry.pieceId];
    return `
      <li class="tour-piece-item">
        <a class="tour-piece-link" href="${work.href}">
          <h2 class="tour-piece-title">${work.title}</h2>
          <p class="tour-piece-meta">
            ${work.attribution ? `${work.attribution} • ` : ""}${formatMeters(work.heightCm)} tall
          </p>
        </a>
      </li>
    `;
  }).join("");
}

function buildFactValues() {
  const heights = TOUR_WORKS.map((entry) => entry.heightCm / 100);
  const tallest = Math.max(...heights);
  const smallest = Math.min(...heights);
  return {
    workCount: TOUR_WORKS.length,
    tallest: `${tallest.toFixed(2)} m`,
    range: `${smallest.toFixed(2)}-${tallest.toFixed(2)} m`
  };
}

function bootError(message, error) {
  console.error(error);
  const loading = typeof document !== "undefined" ? document.querySelector("[data-tour-loading]") : null;
  const status = typeof document !== "undefined" ? document.querySelector("[data-tour-status]") : null;
  if (status) {
    status.textContent = message;
  }
  if (loading) {
    loading.hidden = false;
    loading.querySelector("[data-tour-loading-title]").textContent = "Unable to build the gallery";
    loading.querySelector("[data-tour-loading-copy]").textContent = message;
    return;
  }
  if (typeof document !== "undefined") {
    document.body.textContent = message;
  }
}

function paintLabelCanvas(context, canvas, work, palette) {
  context.clearRect(0, 0, canvas.width, canvas.height);

  context.fillStyle = palette.labelFill;
  context.strokeStyle = palette.labelStroke;
  context.lineWidth = 4;
  roundRect(context, 10, 10, canvas.width - 20, canvas.height - 20, 34);
  context.fill();
  context.stroke();

  context.fillStyle = palette.labelKicker;
  context.font = '600 28px "IBM Plex Sans", "Avenir Next", sans-serif';
  context.textAlign = "center";
  context.fillText("MICHELANGELO GALLERY", canvas.width / 2, 62);

  context.fillStyle = palette.labelTitle;
  context.font = '600 52px "Iowan Old Style", "Palatino Linotype", Georgia, serif';
  context.fillText(work.title, canvas.width / 2, 126);

  context.fillStyle = palette.labelMeta;
  context.font = '500 28px "IBM Plex Sans", "Avenir Next", sans-serif';
  context.fillText(`${formatMeters(work.heightCm)} tall`, canvas.width / 2, 176);
}

function createLabelSprite(THREE, work, palette) {
  const canvas = document.createElement("canvas");
  canvas.width = 640;
  canvas.height = 224;
  const context = canvas.getContext("2d");
  paintLabelCanvas(context, canvas, work, palette);

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 4;

  const sprite = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthTest: false
    })
  );
  sprite.scale.set(1.92, 0.67, 1);
  sprite.userData.labelCanvas = canvas;
  sprite.userData.labelContext = context;
  sprite.userData.labelTexture = texture;
  sprite.userData.labelWork = work;
  return sprite;
}

function refreshLabelSprite(sprite, palette) {
  const canvas = sprite?.userData?.labelCanvas;
  const context = sprite?.userData?.labelContext;
  const texture = sprite?.userData?.labelTexture;
  const work = sprite?.userData?.labelWork;
  if (!canvas || !context || !texture || !work) return;
  paintLabelCanvas(context, canvas, work, palette);
  texture.needsUpdate = true;
}

function roundRect(context, x, y, width, height, radius) {
  context.beginPath();
  context.moveTo(x + radius, y);
  context.lineTo(x + width - radius, y);
  context.quadraticCurveTo(x + width, y, x + width, y + radius);
  context.lineTo(x + width, y + height - radius);
  context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  context.lineTo(x + radius, y + height);
  context.quadraticCurveTo(x, y + height, x, y + height - radius);
  context.lineTo(x, y + radius);
  context.quadraticCurveTo(x, y, x + radius, y);
  context.closePath();
}

async function getThreeModules() {
  const THREE = await import("https://esm.sh/three@0.161.0?bundle");
  const { STLLoader } = await import("https://esm.sh/three@0.161.0/examples/jsm/loaders/STLLoader.js?bundle");
  const { RoomEnvironment } = await import("https://esm.sh/three@0.161.0/examples/jsm/environments/RoomEnvironment.js?bundle");
  const { mergeVertices } = await import("https://esm.sh/three@0.161.0/examples/jsm/utils/BufferGeometryUtils.js?bundle");
  return { THREE, STLLoader, RoomEnvironment, mergeVertices };
}

function bindMobileButtons(buttons, state) {
  buttons.forEach((button) => {
    const action = button.dataset.move;
    const activate = (event) => {
      event.preventDefault();
      state[action] = true;
    };
    const deactivate = (event) => {
      event.preventDefault();
      state[action] = false;
    };

    button.addEventListener("pointerdown", activate);
    button.addEventListener("pointerup", deactivate);
    button.addEventListener("pointercancel", deactivate);
    button.addEventListener("pointerleave", deactivate);
  });
}

function bindKeyboard(state) {
  const map = {
    KeyW: "forward",
    ArrowUp: "forward",
    KeyS: "backward",
    ArrowDown: "backward",
    KeyA: "left",
    KeyD: "right",
    KeyQ: "turnLeft",
    ArrowLeft: "turnLeft",
    KeyE: "turnRight",
    ArrowRight: "turnRight",
    ShiftLeft: "fast",
    ShiftRight: "fast"
  };

  window.addEventListener("keydown", (event) => {
    const key = map[event.code];
    if (!key) return;
    state[key] = true;
  });

  window.addEventListener("keyup", (event) => {
    const key = map[event.code];
    if (!key) return;
    state[key] = false;
  });
}

function attachLookControls(stage, yawRig, pitchRig, raycastClick) {
  const drag = {
    active: false,
    moved: false,
    lastX: 0,
    lastY: 0,
    pointerId: null
  };

  const updateCursor = () => {
    stage.style.cursor = drag.active ? "grabbing" : "grab";
  };

  stage.addEventListener("pointerdown", (event) => {
    if (event.target.closest("button,a")) return;
    drag.active = true;
    drag.moved = false;
    drag.lastX = event.clientX;
    drag.lastY = event.clientY;
    drag.pointerId = event.pointerId;
    stage.setPointerCapture(event.pointerId);
    updateCursor();
  });

  stage.addEventListener("pointermove", (event) => {
    if (!drag.active || event.pointerId !== drag.pointerId) return;
    const dx = event.clientX - drag.lastX;
    const dy = event.clientY - drag.lastY;
    drag.lastX = event.clientX;
    drag.lastY = event.clientY;

    if (Math.abs(dx) + Math.abs(dy) > 2) {
      drag.moved = true;
    }

    yawRig.rotation.y -= dx * LOOK_SENSITIVITY;
    pitchRig.rotation.x = clamp(pitchRig.rotation.x - dy * LOOK_SENSITIVITY, -0.9, 0.72);
  });

  stage.addEventListener("pointerup", (event) => {
    if (!drag.active || event.pointerId !== drag.pointerId) return;
    if (!drag.moved) {
      raycastClick(event);
    }
    drag.active = false;
    drag.pointerId = null;
    updateCursor();
  });

  stage.addEventListener("pointercancel", () => {
    drag.active = false;
    drag.pointerId = null;
    updateCursor();
  });

  updateCursor();
}

function createRoom(scene, THREE, palette) {
  const floorMaterial = new THREE.MeshStandardMaterial({
    color: palette.floor,
    roughness: 0.96,
    metalness: 0.01
  });
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(ROOM.width, ROOM.depth),
    floorMaterial
  );
  floor.rotation.x = -Math.PI * 0.5;
  floor.receiveShadow = true;
  scene.add(floor);

  const runnerMaterial = new THREE.MeshStandardMaterial({
    color: palette.runner,
    roughness: 0.98,
    metalness: 0.0
  });
  const runner = new THREE.Mesh(
    new THREE.PlaneGeometry(3.4, ROOM.depth - 4),
    runnerMaterial
  );
  runner.rotation.x = -Math.PI * 0.5;
  runner.position.set(0, 0.002, 0.8);
  runner.receiveShadow = true;
  scene.add(runner);

  const wallMaterial = new THREE.MeshStandardMaterial({
    color: palette.wall,
    roughness: 0.95,
    metalness: 0.0
  });

  const walls = [
    { size: [ROOM.width, ROOM.height], position: [0, ROOM.height * 0.5, -ROOM.depth * 0.5], rotationY: 0 },
    { size: [ROOM.width, ROOM.height], position: [0, ROOM.height * 0.5, ROOM.depth * 0.5], rotationY: Math.PI },
    { size: [ROOM.depth, ROOM.height], position: [-ROOM.width * 0.5, ROOM.height * 0.5, 0], rotationY: Math.PI * 0.5 },
    { size: [ROOM.depth, ROOM.height], position: [ROOM.width * 0.5, ROOM.height * 0.5, 0], rotationY: -Math.PI * 0.5 }
  ];

  for (const wall of walls) {
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(...wall.size), wallMaterial);
    mesh.position.set(...wall.position);
    mesh.rotation.y = wall.rotationY;
    mesh.receiveShadow = true;
    scene.add(mesh);
  }

  const ceilingMaterial = new THREE.MeshStandardMaterial({
    color: palette.ceiling,
    roughness: 0.92,
    metalness: 0.0
  });
  const ceiling = new THREE.Mesh(
    new THREE.PlaneGeometry(ROOM.width, ROOM.depth),
    ceilingMaterial
  );
  ceiling.rotation.x = Math.PI * 0.5;
  ceiling.position.y = ROOM.height;
  scene.add(ceiling);

  return {
    floorMaterial,
    runnerMaterial,
    wallMaterial,
    ceilingMaterial
  };
}

function clampToRoom(nextPosition) {
  nextPosition.x = clamp(nextPosition.x, -ROOM.width * 0.5 + 1.1, ROOM.width * 0.5 - 1.1);
  nextPosition.z = clamp(nextPosition.z, -ROOM.depth * 0.5 + 1.1, ROOM.depth * 0.5 - 1.1);
}

function collidesWithWorks(nextPosition, works) {
  return works.some((entry) => {
    const dx = nextPosition.x - entry.position[0];
    const dz = nextPosition.z - entry.position[1];
    return Math.hypot(dx, dz) < entry.collisionRadius + USER_RADIUS;
  });
}

async function loadWork(work, modules, scene, pickables, loadingElements, palette) {
  const { THREE, STLLoader, mergeVertices } = modules;
  const loader = new STLLoader();
  loadingElements.copy.textContent = `Loading ${work.title}...`;

  let geometry = await loader.loadAsync(work.asset);
  const rotateX = work.rotateX ?? work.piece.scene?.rotateX ?? DEFAULT_STL_ROTATE_X;
  const rotateY = work.rotateY ?? work.piece.scene?.rotateY ?? 0;
  const rotateZ = work.rotateZ ?? work.piece.scene?.rotateZ ?? 0;

  if (rotateX) geometry.rotateX(rotateX);
  if (rotateY) geometry.rotateY(rotateY);
  if (rotateZ) geometry.rotateZ(rotateZ);

  if ((geometry.attributes.position?.count || 0) < 800000) {
    geometry = mergeVertices(geometry, 1e-4);
  }

  geometry.computeVertexNormals();
  geometry.computeBoundingBox();
  const box = geometry.boundingBox;
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  geometry.translate(-center.x, -box.min.y, -center.z);

  const material = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(palette.sculptureColor),
    roughness: 0.25,
    metalness: 0.0,
    clearcoat: 0.18,
    clearcoatRoughness: 0.4,
    sheen: 0.2,
    sheenRoughness: 0.84,
    sheenColor: new THREE.Color(palette.sculptureSheen),
    reflectivity: 0.36
  });

  const mesh = new THREE.Mesh(geometry, material);
  const heightMeters = work.heightCm / 100;
  const scale = heightMeters / size.y;
  mesh.scale.setScalar(scale);
  mesh.rotation.y = (work.piece.scene?.defaultYaw || 0) + work.yaw;
  mesh.castShadow = true;
  mesh.receiveShadow = true;

  const root = new THREE.Group();
  root.position.set(work.position[0], 0, work.position[1]);

  const pedestalHeight = work.pedestal?.height || 0;
  let pedestal = null;
  if (pedestalHeight > 0) {
    pedestal = createPedestalMesh(THREE, work.pedestal.radius, pedestalHeight, {
      pedestalColor: palette.pedestal,
      pedestalRoughness: 0.88
    });
    root.add(pedestal);
  }

  mesh.position.y = pedestalHeight;
  root.add(mesh);

  const label = createLabelSprite(THREE, work, palette);
  label.position.set(0, pedestalHeight + heightMeters + 0.4, 0);
  root.add(label);
  scene.add(root);

  mesh.userData.href = work.href;
  label.userData.href = work.href;
  pickables.push(mesh, label);

  return {
    root,
    mesh,
    material,
    pedestal,
    label
  };
}

export async function initMichelangeloTour() {
  applyStoredTheme();
  applyStoredUiMode();
  bindThemeToggles(document.body);
  bindUiModeToggles(document.body);

  const stage = document.querySelector("[data-tour-stage]");
  const status = document.querySelector("[data-tour-status]");
  const loading = document.querySelector("[data-tour-loading]");
  const loadingTitle = document.querySelector("[data-tour-loading-title]");
  const loadingCopy = document.querySelector("[data-tour-loading-copy]");
  const pieceList = document.querySelector("[data-tour-pieces]");
  const factCount = document.querySelector("[data-tour-fact-count]");
  const factTallest = document.querySelector("[data-tour-fact-tallest]");
  const factRange = document.querySelector("[data-tour-fact-range]");

  if (!stage || !status || !loading || !loadingTitle || !loadingCopy || !pieceList) {
    throw new Error("Tour shell is incomplete.");
  }

  const facts = buildFactValues();
  pieceList.innerHTML = createWorkListHtml();
  factCount.textContent = String(facts.workCount);
  factTallest.textContent = facts.tallest;
  factRange.textContent = facts.range;
  status.textContent = `Loading ${TOUR_WORKS.length} scaled works into ${GALLERY_TITLE}.`;

  const modules = await getThreeModules();
  const { THREE, RoomEnvironment } = modules;
  let activeTheme = getActiveTheme();
  let palette = getTourThemePalette(activeTheme);
  const isCompact = window.matchMedia("(max-width: 980px)").matches;
  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, isCompact ? 1.1 : 1.55));
  renderer.setSize(stage.clientWidth, stage.clientHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = palette.exposure;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  stage.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(palette.background);
  scene.fog = new THREE.Fog(palette.fog, 12, 28);

  const camera = new THREE.PerspectiveCamera(56, stage.clientWidth / stage.clientHeight, 0.01, 90);
  const yawRig = new THREE.Group();
  const pitchRig = new THREE.Group();
  yawRig.position.set(...ROOM.start);
  pitchRig.rotation.x = -0.1;
  pitchRig.add(camera);
  yawRig.add(pitchRig);
  scene.add(yawRig);

  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(renderer), 0.03).texture;

  const hemi = new THREE.HemisphereLight(palette.hemiSky, palette.hemiGround, 1.02);
  scene.add(hemi);

  const keyLight = new THREE.DirectionalLight(palette.key, 1.15);
  keyLight.position.set(4.8, 7.4, 3.2);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.set(2048, 2048);
  keyLight.shadow.camera.left = -10;
  keyLight.shadow.camera.right = 10;
  keyLight.shadow.camera.top = 10;
  keyLight.shadow.camera.bottom = -10;
  keyLight.shadow.camera.near = 0.1;
  keyLight.shadow.camera.far = 24;
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(palette.fill, 0.52);
  fillLight.position.set(-3.8, 3.4, -2.4);
  scene.add(fillLight);

  const entryLight = new THREE.PointLight(palette.entry, 1.2, 18, 2);
  entryLight.position.set(0, 5.1, 7.4);
  scene.add(entryLight);

  const room = createRoom(scene, THREE, palette);

  const mobileState = {
    forward: false,
    backward: false,
    left: false,
    right: false,
    turnLeft: false,
    turnRight: false,
    fast: false
  };
  bindKeyboard(mobileState);
  bindMobileButtons([...document.querySelectorAll("[data-move]")], mobileState);

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const pickables = [];

  const raycastClick = (event) => {
    const rect = renderer.domElement.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    const hit = raycaster.intersectObjects(pickables, false)[0];
    if (hit?.object?.userData?.href) {
      window.location.href = hit.object.userData.href;
    }
  };

  attachLookControls(stage, yawRig, pitchRig, raycastClick);

  const loadedWorks = [];
  loadingTitle.textContent = "Building a scale-aware gallery";

  for (let index = 0; index < TOUR_WORKS.length; index += 1) {
    const config = WORKS_BY_ID[TOUR_WORKS[index].pieceId];
    loadingCopy.textContent = `Loading ${index + 1} of ${TOUR_WORKS.length}: ${config.title}`;
    loadedWorks.push(await loadWork(config, modules, scene, pickables, { copy: loadingCopy }, palette));
  }

  loading.hidden = true;
  status.textContent = "Room ready. Drag to look, use W/A/S/D to move, and tap any sculpture label to open its page.";

  const applyTourTheme = (theme) => {
    activeTheme = theme;
    palette = getTourThemePalette(theme);
    renderer.toneMappingExposure = palette.exposure;
    renderer.setClearColor(palette.background, 1);
    scene.background = new THREE.Color(palette.background);
    scene.fog.color.set(palette.fog);
    hemi.color.setHex(palette.hemiSky);
    hemi.groundColor.setHex(palette.hemiGround);
    keyLight.color.setHex(palette.key);
    fillLight.color.setHex(palette.fill);
    entryLight.color.setHex(palette.entry);
    room.floorMaterial.color.setHex(palette.floor);
    room.runnerMaterial.color.setHex(palette.runner);
    room.wallMaterial.color.setHex(palette.wall);
    room.ceilingMaterial.color.setHex(palette.ceiling);

    for (const workRef of loadedWorks) {
      workRef.material.color.set(palette.sculptureColor);
      workRef.material.sheenColor.set(palette.sculptureSheen);
      workRef.material.needsUpdate = true;

      if (workRef.pedestal) {
        workRef.pedestal.material.color.setHex(palette.pedestal);
      }

      refreshLabelSprite(workRef.label, palette);
    }
  };

  applyTourTheme(activeTheme);
  window.addEventListener("formgallery:themechange", (event) => {
    applyTourTheme(event.detail?.theme || getActiveTheme());
  });

  const tempForward = new THREE.Vector3();
  const tempRight = new THREE.Vector3();
  const nextPosition = new THREE.Vector3();
  const clock = new THREE.Clock();

  function updateMovement(deltaSeconds) {
    const turnDirection = (mobileState.turnRight ? 1 : 0) - (mobileState.turnLeft ? 1 : 0);
    if (turnDirection) {
      yawRig.rotation.y -= turnDirection * TURN_SPEED_RPS * deltaSeconds;
    }

    tempForward.set(0, 0, (mobileState.backward ? 1 : 0) - (mobileState.forward ? 1 : 0));
    tempRight.set((mobileState.right ? 1 : 0) - (mobileState.left ? 1 : 0), 0, 0);

    if (!tempForward.lengthSq() && !tempRight.lengthSq()) {
      return;
    }

    const speed = MOVE_SPEED_MPS * (mobileState.fast ? 1.7 : 1);
    const worldMove = new THREE.Vector3();
    if (tempForward.lengthSq()) {
      tempForward.normalize().applyAxisAngle(new THREE.Vector3(0, 1, 0), yawRig.rotation.y);
      worldMove.addScaledVector(tempForward, speed * deltaSeconds);
    }
    if (tempRight.lengthSq()) {
      tempRight.normalize().applyAxisAngle(new THREE.Vector3(0, 1, 0), yawRig.rotation.y);
      worldMove.addScaledVector(tempRight, speed * deltaSeconds);
    }

    nextPosition.copy(yawRig.position).add(worldMove);
    clampToRoom(nextPosition);

    if (!collidesWithWorks(nextPosition, TOUR_WORKS)) {
      yawRig.position.copy(nextPosition);
    }
  }

  function onResize() {
    const width = stage.clientWidth;
    const height = stage.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }

  window.addEventListener("resize", onResize);

  renderer.setAnimationLoop(() => {
    const delta = Math.min(clock.getDelta(), 0.033);
    updateMovement(delta);
    renderer.render(scene, camera);
  });
}

if (typeof window !== "undefined") {
  initMichelangeloTour().catch((error) => {
    bootError("The 3D tour preview could not be initialized.", error);
  });
}
