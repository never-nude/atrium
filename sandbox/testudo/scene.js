import * as THREE from "three";
import { OrbitControls } from "./vendor/OrbitControls.js";

const PRESETS = {
  front: {
    position: new THREE.Vector3(-6.4, 4.9, -7.9),
    target: new THREE.Vector3(0, 1.18, -1.8),
  },
  side: {
    position: new THREE.Vector3(8.6, 3.6, 0),
    target: new THREE.Vector3(0, 1.18, 0),
  },
  top: {
    position: new THREE.Vector3(0.01, 11.8, 0.01),
    target: new THREE.Vector3(0, 1.05, 0),
  },
  inside: {
    position: new THREE.Vector3(0.16, 0.84, 1.75),
    target: new THREE.Vector3(0, 1.06, -1.65),
  },
};

export function createSceneApp(mount) {
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0xdce3e8, 14, 34);

  const camera = new THREE.PerspectiveCamera(42, mount.clientWidth / mount.clientHeight, 0.03, 100);
  camera.position.copy(PRESETS.front.position);

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(mount.clientWidth, mount.clientHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.98;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  mount.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.enablePan = false;
  controls.minDistance = 1.6;
  controls.maxDistance = 26;
  controls.minPolarAngle = 0.02;
  controls.maxPolarAngle = Math.PI - 0.02;
  controls.target.copy(PRESETS.front.target);
  controls.update();

  const ambientLight = new THREE.AmbientLight(0xffffff, 1.02);
  scene.add(ambientLight);

  const keyLight = new THREE.DirectionalLight(0xffffff, 1.9);
  keyLight.position.set(8.5, 11.5, 5.8);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.set(2048, 2048);
  keyLight.shadow.camera.left = -12;
  keyLight.shadow.camera.right = 12;
  keyLight.shadow.camera.top = 12;
  keyLight.shadow.camera.bottom = -12;
  keyLight.shadow.camera.near = 0.5;
  keyLight.shadow.camera.far = 28;
  keyLight.shadow.bias = -0.0001;
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0xbfd0df, 0.6);
  fillLight.position.set(-7, 5, -6);
  scene.add(fillLight);

  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(60, 60),
    new THREE.MeshStandardMaterial({
      color: 0xc9c2b5,
      roughness: 1,
      metalness: 0.02,
    }),
  );
  ground.rotation.x = -Math.PI * 0.5;
  ground.receiveShadow = true;
  scene.add(ground);

  let frameHandlers = [];
  let resizeQueued = false;
  let cameraTransition = null;

  function updateSize() {
    resizeQueued = false;
    const width = mount.clientWidth;
    const height = mount.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }

  function queueResize() {
    if (resizeQueued) {
      return;
    }
    resizeQueued = true;
    requestAnimationFrame(updateSize);
  }

  window.addEventListener("resize", queueResize);

  function setCameraPreset(name, immediate = false) {
    const preset = PRESETS[name];
    if (!preset) {
      return;
    }

    if (immediate) {
      camera.position.copy(preset.position);
      controls.target.copy(preset.target);
      controls.update();
      cameraTransition = null;
      return;
    }

    cameraTransition = {
      startedAt: performance.now(),
      duration: 800,
      fromPosition: camera.position.clone(),
      fromTarget: controls.target.clone(),
      toPosition: preset.position.clone(),
      toTarget: preset.target.clone(),
    };
  }

  function onFrame(handler) {
    frameHandlers.push(handler);
    return () => {
      frameHandlers = frameHandlers.filter((candidate) => candidate !== handler);
    };
  }

  let lastTime = performance.now();

  function render(now) {
    const deltaSeconds = (now - lastTime) / 1000;
    lastTime = now;

    if (cameraTransition) {
      const elapsed = now - cameraTransition.startedAt;
      const alpha = Math.min(elapsed / cameraTransition.duration, 1);
      const eased = 1 - Math.pow(1 - alpha, 3);
      camera.position.lerpVectors(cameraTransition.fromPosition, cameraTransition.toPosition, eased);
      controls.target.lerpVectors(cameraTransition.fromTarget, cameraTransition.toTarget, eased);
      if (alpha >= 1) {
        cameraTransition = null;
      }
    }

    controls.update();
    for (const handler of frameHandlers) {
      handler(deltaSeconds, now);
    }

    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);

  return {
    camera,
    controls,
    onFrame,
    renderer,
    scene,
    setCameraPreset,
  };
}
