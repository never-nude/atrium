import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { createBackgroundSystem } from "./background-system.js";
import { createPostProcessing } from "./post-processing.js";
import { createTransitCues } from "./transit-cues.js";
import { createTunnelSystem } from "./tunnel-system.js";
import { createUI } from "./ui-controller.js";

const canvas = document.querySelector("#scene");
const searchParams = new URLSearchParams(window.location.search);
const initialViewMode = searchParams.get("mode") === "inspect" ? "inspect" : "transit";

const settings = {
  bloom: 0.84,
  distortion: 0.56,
  glow: 1.04,
  speed: 1.08,
  throat: 7.8,
};

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  canvas,
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x02050b);
scene.fog = new THREE.FogExp2(0x030812, 0.0062);

const camera = new THREE.PerspectiveCamera(58, window.innerWidth / window.innerHeight, 0.05, 900);
camera.position.set(0, 0, 70);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.enablePan = false;
controls.maxDistance = 160;
controls.minDistance = 18;
controls.enabled = false;

const tunnelSystem = createTunnelSystem(scene, settings);
const backgroundSystem = createBackgroundSystem(scene);
backgroundSystem.setAnchors(tunnelSystem.getAnchors());

const transitCues = createTransitCues(scene, tunnelSystem, settings);
const postProcessing = createPostProcessing(renderer, scene, camera);

const ui = createUI({
  initialMode: initialViewMode,
  initialValues: settings,
  onControlsChange: handleControlsChange,
  onModeChange: setViewMode,
  onReplay: () => replayTransit({ preserveMode: true }),
  onPulse: triggerPulse,
});

const deepFog = new THREE.Color(0x030812);
const arrivalFog = new THREE.Color(0x08131f);
const currentLook = new THREE.Vector3();
const cameraDirection = new THREE.Vector3();
const cameraRig = new THREE.Object3D();
const exitAim = new THREE.Vector3();
const clock = new THREE.Clock();

let elapsedTime = 0;

const runtimeState = {
  bloomGain: settings.bloom,
  curveT: 0,
  entryFlash: 0,
  exitLock: 0,
  exitReveal: 0,
  inspectSettled: false,
  lastCameraPosition: new THREE.Vector3(),
  lastCurveT: 0,
  lensWarp: 0,
  phase: "approach",
  phaseIntensity: 0,
  phaseProgress: 0,
  pulse: 0,
  shear: 0,
  stability: 100,
  transitProgress: 0,
  transitTime: 0,
  transitVelocity: 0,
  turbulence: 0,
  velocityIndex: 0,
  viewMode: initialViewMode,
};

function clamp01(value) {
  return THREE.MathUtils.clamp(value, 0, 1);
}

function easeInOutCubic(value) {
  if (value < 0.5) {
    return 4 * value * value * value;
  }

  return 1 - Math.pow(-2 * value + 2, 3) / 2;
}

function smoothstep(edge0, edge1, value) {
  const t = clamp01((value - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

function damp(factor, delta) {
  return 1 - Math.exp(-factor * delta);
}

function getInspectView(time) {
  const start = tunnelSystem.getAnchors().start;
  const focus = start.point.clone().addScaledVector(start.tangent, 5.8);
  const position = start.point
    .clone()
    .addScaledVector(start.tangent, -48)
    .addScaledVector(start.normal, settings.throat * 0.78)
    .addScaledVector(start.binormal, settings.throat * 0.26)
    .addScaledVector(start.normal, Math.sin(time * 0.24) * 0.36);

  return {
    fov: 48,
    lookTarget: focus,
    position,
  };
}

function computeTransitTarget() {
  const transitProgress = clamp01(runtimeState.transitProgress);
  const { start, end } = tunnelSystem.getAnchors();
  const portalAim = tunnelSystem.sampleFrame(0.035).point;
  const outsideStart = start.point
    .clone()
    .addScaledVector(start.tangent, -34)
    .addScaledVector(start.normal, start.radius * 0.34)
    .addScaledVector(start.binormal, start.radius * 0.06);
  const threshold = start.point
    .clone()
    .addScaledVector(start.tangent, -4.6)
    .addScaledVector(start.normal, start.radius * 0.08)
    .addScaledVector(start.binormal, start.radius * 0.02);
  const outsideExit = end.point
    .clone()
    .addScaledVector(end.tangent, 24)
    .addScaledVector(end.normal, end.radius * 0.08);
  const exitFocus = outsideExit.clone().addScaledVector(end.tangent, 128);

  const flowWiggleA = Math.sin(transitProgress * 46.0);
  const flowWiggleB = Math.cos(transitProgress * 34.0);
  const flowWiggleC = Math.sin(transitProgress * 62.0 + 0.35);

  let phase = "approach";
  let phaseProgress = 0;
  let phaseIntensity = 0.24;
  let curveT = 0.01;
  let entryFlash = 0;
  let exitReveal = 0;
  let fov = 53.2;
  let lensWarp = 0.015;
  let roll = 0;
  let position = outsideStart.clone();
  let lookTarget = portalAim.clone();

  if (transitProgress < 0.12) {
    phase = "approach";
    phaseProgress = easeInOutCubic(transitProgress / 0.12);
    phaseIntensity = 0.26 + phaseProgress * 0.46;
    curveT = 0.01 + phaseProgress * 0.02;
    entryFlash = phaseProgress * 0.08;
    position = outsideStart.clone().lerp(threshold, phaseProgress * 0.96);
    lookTarget = portalAim
      .clone()
      .lerp(tunnelSystem.sampleFrame(0.06).point, phaseProgress * 0.4)
      .addScaledVector(start.normal, -start.radius * 0.04 * (1 - phaseProgress));
    lensWarp = 0.016 + phaseProgress * 0.028;
    fov = THREE.MathUtils.lerp(52.0, 56.0, phaseProgress) + runtimeState.pulse * 1.1;
    roll = phaseProgress * 0.003;
  } else if (transitProgress < 0.24) {
    phase = "entry";
    phaseProgress = easeInOutCubic((transitProgress - 0.12) / 0.12);
    curveT = 0.03 + phaseProgress * 0.2;
    const frame = tunnelSystem.sampleFrame(curveT);
    const ahead = tunnelSystem.sampleFrame(Math.min(0.34, curveT + 0.09));
    const radialDrift = flowWiggleA * 0.04 * settings.distortion;
    phaseIntensity = 0.68 + Math.sin(phaseProgress * Math.PI) * 0.22;
    entryFlash = Math.sin(phaseProgress * Math.PI);
    exitReveal = phaseProgress * 0.04;
    position = frame.point
      .clone()
      .addScaledVector(frame.tangent, -6.8 + phaseProgress * 6.1)
      .addScaledVector(frame.normal, frame.radius * (0.1 - phaseProgress * 0.08))
      .addScaledVector(frame.binormal, frame.radius * radialDrift);
    lookTarget = ahead.point
      .clone()
      .addScaledVector(ahead.normal, frame.radius * 0.03 * (1 - phaseProgress))
      .addScaledVector(ahead.binormal, frame.radius * flowWiggleB * 0.02);
    lensWarp = 0.034 + entryFlash * 0.052 + runtimeState.pulse * 0.024;
    fov = 56.8 + entryFlash * 4.8 + runtimeState.pulse * 1.5;
    roll = entryFlash * 0.01;
  } else if (transitProgress < 0.8) {
    phase = "transit";
    phaseProgress = easeInOutCubic((transitProgress - 0.24) / 0.56);
    curveT = 0.23 + phaseProgress * 0.57;
    const frame = tunnelSystem.sampleFrame(curveT);
    const ahead = tunnelSystem.sampleFrame(Math.min(0.995, curveT + 0.06 + settings.speed * 0.024));
    phaseIntensity = 0.76 + phaseProgress * 0.16;
    entryFlash = 0.14 * (1 - phaseProgress);
    exitReveal = smoothstep(0.08, 1.0, phaseProgress);
    position = frame.point
      .clone()
      .addScaledVector(frame.normal, flowWiggleA * 0.06 * settings.distortion * frame.radius)
      .addScaledVector(frame.binormal, flowWiggleB * 0.05 * settings.distortion * frame.radius);
    lookTarget = ahead.point
      .clone()
      .addScaledVector(ahead.normal, flowWiggleC * 0.12)
      .addScaledVector(ahead.binormal, flowWiggleB * 0.1);
    lensWarp = 0.038 + settings.distortion * 0.024 + entryFlash * 0.018 + exitReveal * 0.022 + runtimeState.pulse * 0.024;
    fov = 60.2 + entryFlash * 2.8 + exitReveal * 0.8 + runtimeState.pulse * 1.8;
    roll = flowWiggleA * 0.006 + settings.distortion * 0.003;
  } else {
    phase = "exit";
    phaseProgress = easeInOutCubic((transitProgress - 0.8) / 0.2);
    curveT = 0.8 + phaseProgress * 0.2;
    const frame = tunnelSystem.sampleFrame(Math.min(1, curveT));
    const blend = smoothstep(0.1, 1.0, phaseProgress);
    phaseIntensity = 0.38 * (1 - phaseProgress) + 0.14;
    entryFlash = 0.04 * (1 - phaseProgress);
    exitReveal = 0.72 + phaseProgress * 0.28;
    position = frame.point
      .clone()
      .lerp(outsideExit, blend)
      .addScaledVector(end.normal, (1 - phaseProgress) * 0.14);
    lookTarget = frame.point.clone().lerp(exitFocus, 0.52 + phaseProgress * 0.48);
    lensWarp = 0.018 + (1 - phaseProgress) * 0.02 + runtimeState.pulse * 0.012;
    fov = 59.0 - phaseProgress * 2.6 + runtimeState.pulse * 0.9;
    roll = (1 - phaseProgress) * 0.003;
  }

  return {
    curveT,
    entryFlash,
    exitReveal,
    fov,
    lensWarp,
    lookTarget,
    phase,
    phaseIntensity,
    phaseProgress,
    position,
    roll,
  };
}

function applyTransitCamera(target, delta) {
  const phaseSmoothing =
    target.phase === "approach" ? 4.8 : target.phase === "entry" ? 7.8 : target.phase === "exit" ? 5.8 : 6.8;
  const smoothing = damp(phaseSmoothing, delta);
  camera.position.lerp(target.position, smoothing);
  currentLook.lerp(target.lookTarget, smoothing);

  cameraRig.position.copy(camera.position);
  cameraRig.lookAt(currentLook);
  cameraRig.rotateZ(target.roll);
  camera.quaternion.slerp(cameraRig.quaternion, smoothing);

  camera.fov = THREE.MathUtils.lerp(camera.fov, target.fov, damp(5.6, delta));
  camera.updateProjectionMatrix();
}

function applyInspectCamera(time, delta) {
  const inspectView = getInspectView(time);
  controls.enabled = runtimeState.inspectSettled;

  if (!runtimeState.inspectSettled) {
    const smoothing = damp(3.8, delta);
    camera.position.lerp(inspectView.position, smoothing);
    currentLook.lerp(inspectView.lookTarget, smoothing);
    controls.target.lerp(inspectView.lookTarget, smoothing);

    cameraRig.position.copy(camera.position);
    cameraRig.lookAt(currentLook);
    camera.quaternion.slerp(cameraRig.quaternion, smoothing);

    runtimeState.inspectSettled =
      camera.position.distanceTo(inspectView.position) < 0.75 &&
      currentLook.distanceTo(inspectView.lookTarget) < 0.75;
  } else {
    controls.update();
    currentLook.copy(controls.target);
  }

  camera.fov = THREE.MathUtils.lerp(camera.fov, inspectView.fov, damp(4.2, delta));
  camera.updateProjectionMatrix();
}

function replayTransit({ preserveMode = false } = {}) {
  if (!preserveMode) {
    runtimeState.viewMode = "transit";
  }

  runtimeState.transitProgress = 0;
  runtimeState.transitVelocity = 0;
  runtimeState.transitTime = 0;
  runtimeState.phase = "approach";
  runtimeState.phaseProgress = 0;
  runtimeState.exitReveal = 0;
  runtimeState.entryFlash = 0;
  runtimeState.inspectSettled = false;
  runtimeState.lastCurveT = 0;
  controls.enabled = false;
}

function setViewMode(mode) {
  if (mode === runtimeState.viewMode) {
    return;
  }

  if (mode === "inspect") {
    runtimeState.viewMode = "inspect";
    runtimeState.transitVelocity = 0;
    runtimeState.inspectSettled = false;
    controls.enabled = false;
    return;
  }

  replayTransit();
}

function handleControlsChange(values) {
  Object.assign(settings, values);
  tunnelSystem.setSettings(settings);
  backgroundSystem.setAnchors(tunnelSystem.getAnchors());
}

function triggerPulse() {
  runtimeState.pulse = Math.min(1.45, runtimeState.pulse + 0.9);
}

function updateSceneMood(runtime, delta) {
  const fogBlend = runtime.exitReveal * 0.58;
  scene.fog.color.lerpColors(deepFog, arrivalFog, fogBlend);
  scene.fog.density =
    runtime.viewMode === "inspect"
      ? 0.0046
      : 0.0062 - runtime.exitReveal * 0.0019 + runtime.entryFlash * 0.0008;
  renderer.toneMappingExposure = THREE.MathUtils.lerp(
    renderer.toneMappingExposure,
    runtime.viewMode === "inspect"
      ? 0.9
      : 0.88 +
          runtime.transitProgress * 0.04 +
          runtime.phaseIntensity * 0.08 +
          runtime.entryFlash * 0.14 +
          runtime.exitReveal * 0.1 +
          settings.glow * 0.02,
    damp(3.2, delta),
  );
}

function buildRuntime(target, delta) {
  const transitProgress = runtimeState.viewMode === "inspect" ? 0 : runtimeState.transitProgress;
  const pathVelocity =
    Math.abs(target.curveT - runtimeState.lastCurveT) * tunnelSystem.getLength() / Math.max(delta, 0.0001);
  runtimeState.lastCameraPosition.copy(camera.position);
  runtimeState.lastCurveT = target.curveT;

  const visualPhaseIntensity =
    runtimeState.viewMode === "inspect" ? target.phaseIntensity * 0.22 + 0.04 : target.phaseIntensity;
  const visualEntryFlash = runtimeState.viewMode === "inspect" ? 0 : target.entryFlash;
  const visualExitReveal =
    runtimeState.viewMode === "inspect" ? Math.max(0.08, target.exitReveal * 0.35) : target.exitReveal;
  const visualLensWarp = runtimeState.viewMode === "inspect" ? 0.003 : target.lensWarp;

  const transitFlow = transitProgress * (1 + transitProgress * (1.05 + settings.speed * 0.35));

  camera.getWorldDirection(cameraDirection);
  const endFrame = tunnelSystem.sampleFrame(1);
  exitAim.copy(endFrame.point).addScaledVector(endFrame.tangent, 18).sub(camera.position).normalize();
  const exitAlignment = clamp01(cameraDirection.dot(exitAim) * 0.5 + 0.5);

  runtimeState.phase = target.phase;
  runtimeState.phaseProgress = target.phaseProgress;
  runtimeState.phaseIntensity = visualPhaseIntensity;
  runtimeState.entryFlash = visualEntryFlash;
  runtimeState.exitReveal = visualExitReveal;
  runtimeState.curveT = target.curveT;
  runtimeState.lensWarp = visualLensWarp;
  runtimeState.velocityIndex = runtimeState.viewMode === "inspect" ? 0 : THREE.MathUtils.clamp(pathVelocity / 24, 0, 4.8);
  runtimeState.shear =
    settings.distortion * (1.18 + visualEntryFlash * 0.48 + (1 - visualExitReveal) * 0.28) +
    visualLensWarp * 26 +
    runtimeState.pulse * 0.6;
  runtimeState.turbulence =
    settings.distortion * (1.08 - visualExitReveal * 0.5) +
    visualEntryFlash * 0.64 +
    runtimeState.pulse * 0.44;
  runtimeState.stability = THREE.MathUtils.clamp(
    96 - runtimeState.turbulence * 24 + visualExitReveal * 24,
    26,
    100,
  );
  runtimeState.exitLock = THREE.MathUtils.clamp(
    (smoothstep(0.46, 1.0, transitProgress) * 0.8 + exitAlignment * 0.2) * 100,
    0,
    100,
  );

  return {
    bloom: settings.bloom,
    curveT: runtimeState.curveT,
    distortion: settings.distortion,
    entryFlash: runtimeState.entryFlash,
    exitLock: runtimeState.exitLock,
    exitReveal: runtimeState.exitReveal,
    glow: settings.glow,
    lensWarp: runtimeState.lensWarp,
    phase: runtimeState.phase,
    phaseIntensity: runtimeState.phaseIntensity,
    phaseProgress: runtimeState.phaseProgress,
    progress: transitProgress,
    pulse: runtimeState.pulse,
    shear: runtimeState.shear,
    stability: runtimeState.stability,
    throat: settings.throat,
    transitFlow,
    transitProgress,
    transitTime: runtimeState.transitTime,
    transitVelocity: runtimeState.transitVelocity,
    turbulence: runtimeState.turbulence,
    velocityIndex: runtimeState.velocityIndex,
    viewMode: runtimeState.viewMode,
  };
}

function advanceTransit(delta) {
  if (runtimeState.viewMode !== "transit") {
    runtimeState.transitVelocity = 0;
    return;
  }

  if (runtimeState.transitProgress < 1) {
    const speedFactor = 0.056 + settings.speed * 0.06;
    runtimeState.transitVelocity = speedFactor;
    runtimeState.transitProgress = Math.min(1, runtimeState.transitProgress + delta * speedFactor);
    runtimeState.transitTime += delta;
    return;
  }

  runtimeState.transitVelocity = 0;
}

function syncInitialCamera() {
  if (runtimeState.viewMode === "inspect") {
    const inspectView = getInspectView(0);
    camera.position.copy(inspectView.position);
    currentLook.copy(inspectView.lookTarget);
    camera.lookAt(currentLook);
    camera.fov = inspectView.fov;
    controls.target.copy(inspectView.lookTarget);
    controls.enabled = true;
    runtimeState.inspectSettled = true;
    runtimeState.lastCurveT = 0;
  } else {
    const transitView = computeTransitTarget();
    camera.position.copy(transitView.position);
    currentLook.copy(transitView.lookTarget);
    camera.lookAt(currentLook);
    camera.fov = transitView.fov;
    controls.enabled = false;
    runtimeState.lastCurveT = transitView.curveT;
  }

  camera.updateProjectionMatrix();
  runtimeState.lastCameraPosition.copy(camera.position);
}

window.addEventListener("keydown", (event) => {
  if (event.repeat) {
    return;
  }

  if (event.code === "KeyI") {
    setViewMode("inspect");
  }

  if (event.code === "KeyT") {
    setViewMode("transit");
  }

  if (event.code === "KeyR") {
    replayTransit();
  }

  if (event.code === "ShiftLeft" || event.code === "ShiftRight") {
    triggerPulse();
  }
});

window.addEventListener("resize", () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const pixelRatio = window.devicePixelRatio;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  renderer.setPixelRatio(Math.min(pixelRatio, 2));
  renderer.setSize(width, height);
  postProcessing.resize(width, height, pixelRatio);
});

syncInitialCamera();
postProcessing.resize(window.innerWidth, window.innerHeight, window.devicePixelRatio);

function animate() {
  const delta = Math.min(clock.getDelta(), 0.1);
  elapsedTime += delta;
  runtimeState.pulse = THREE.MathUtils.lerp(runtimeState.pulse, 0, 0.068);

  advanceTransit(delta);

  const target = computeTransitTarget();

  if (runtimeState.viewMode === "inspect") {
    applyInspectCamera(elapsedTime, delta);
  } else {
    controls.enabled = false;
    runtimeState.inspectSettled = false;
    applyTransitCamera(target, delta);
  }

  const runtime = buildRuntime(target, delta);

  tunnelSystem.update(elapsedTime, delta, runtime);
  backgroundSystem.update(elapsedTime, runtime);
  transitCues.update(elapsedTime, delta, runtime);
  updateSceneMood(runtime, delta);

  runtimeState.bloomGain = postProcessing.update(runtime);
  ui.update({
    ...runtime,
    bloomGain: runtimeState.bloomGain,
  });

  postProcessing.render();
  requestAnimationFrame(animate);
}

animate();
