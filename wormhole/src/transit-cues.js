import * as THREE from "three";

const UNIT_Z = new THREE.Vector3(0, 0, 1);

function createGlowTexture(innerColor, outerColor) {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;

  const context = canvas.getContext("2d");
  const gradient = context.createRadialGradient(
    size * 0.5,
    size * 0.5,
    0,
    size * 0.5,
    size * 0.5,
    size * 0.5,
  );
  gradient.addColorStop(0, innerColor);
  gradient.addColorStop(0.28, "rgba(255, 255, 255, 0.14)");
  gradient.addColorStop(0.68, outerColor);
  gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

  context.fillStyle = gradient;
  context.fillRect(0, 0, size, size);

  return new THREE.CanvasTexture(canvas);
}

function orientToTangent(object, point, tangent) {
  object.position.copy(point);
  object.quaternion.setFromUnitVectors(UNIT_Z, tangent.clone().normalize());
}

function wrapOffset(baseOffset, travel, config) {
  return (
    THREE.MathUtils.euclideanModulo(baseOffset - travel + config.behindAllowance, config.span + config.behindAllowance) -
    config.behindAllowance
  );
}

function createApertureGroup() {
  const group = new THREE.Group();

  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(1, 0.15, 12, 144),
    new THREE.MeshBasicMaterial({
      blending: THREE.AdditiveBlending,
      color: 0x92f2ff,
      depthWrite: false,
      opacity: 0.34,
      transparent: true,
    }),
  );
  group.add(ring);

  const innerBand = new THREE.Mesh(
    new THREE.RingGeometry(0.76, 0.92, 96),
    new THREE.MeshBasicMaterial({
      blending: THREE.AdditiveBlending,
      color: 0xffa761,
      depthWrite: false,
      opacity: 0.16,
      side: THREE.DoubleSide,
      transparent: true,
    }),
  );
  group.add(innerBand);

  const halo = new THREE.Sprite(
    new THREE.SpriteMaterial({
      blending: THREE.AdditiveBlending,
      color: 0xaaf6ff,
      depthWrite: false,
      map: createGlowTexture("rgba(146, 242, 255, 0.68)", "rgba(146, 242, 255, 0.08)"),
      opacity: 0.18,
      transparent: true,
    }),
  );
  group.add(halo);

  const boundaryGlow = new THREE.Sprite(
    new THREE.SpriteMaterial({
      blending: THREE.AdditiveBlending,
      color: 0xeffeff,
      depthWrite: false,
      map: createGlowTexture("rgba(255, 255, 255, 0.28)", "rgba(146, 242, 255, 0.04)"),
      opacity: 0.14,
      transparent: true,
    }),
  );
  group.add(boundaryGlow);

  const coreGlow = new THREE.Sprite(
    new THREE.SpriteMaterial({
      blending: THREE.AdditiveBlending,
      color: 0xcffcff,
      depthWrite: false,
      map: createGlowTexture("rgba(255, 255, 255, 0.42)", "rgba(146, 242, 255, 0.02)"),
      opacity: 0,
      transparent: true,
    }),
  );
  group.add(coreGlow);

  const shockwave = new THREE.Mesh(
    new THREE.RingGeometry(0.9, 1.16, 96),
    new THREE.MeshBasicMaterial({
      blending: THREE.AdditiveBlending,
      color: 0xe8ffff,
      depthWrite: false,
      opacity: 0,
      side: THREE.DoubleSide,
      transparent: true,
    }),
  );
  group.add(shockwave);

  return { boundaryGlow, coreGlow, group, halo, innerBand, ring, shockwave };
}

function createExitBeacon() {
  const group = new THREE.Group();

  const beacon = new THREE.Sprite(
    new THREE.SpriteMaterial({
      blending: THREE.AdditiveBlending,
      color: 0xffd28b,
      depthWrite: false,
      map: createGlowTexture("rgba(255, 226, 170, 0.86)", "rgba(140, 238, 255, 0.08)"),
      opacity: 0.12,
      transparent: true,
    }),
  );
  group.add(beacon);

  const halo = new THREE.Sprite(
    new THREE.SpriteMaterial({
      blending: THREE.AdditiveBlending,
      color: 0xbaf7ff,
      depthWrite: false,
      map: createGlowTexture("rgba(190, 248, 255, 0.32)", "rgba(255, 182, 104, 0.04)"),
      opacity: 0.08,
      transparent: true,
    }),
  );
  group.add(halo);

  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(1, 0.08, 10, 128),
    new THREE.MeshBasicMaterial({
      blending: THREE.AdditiveBlending,
      color: 0xffc46c,
      depthWrite: false,
      opacity: 0.14,
      transparent: true,
    }),
  );
  group.add(ring);

  return { beacon, group, halo, ring };
}

function createMarkerSet(group, config) {
  const markers = [];

  for (let index = 0; index < config.count; index += 1) {
    const marker = new THREE.Mesh(
      new THREE.TorusGeometry(1, config.tubeRadius(index), 12, config.segments ?? 120),
      new THREE.MeshBasicMaterial({
        blending: THREE.AdditiveBlending,
        color: config.color(index),
        depthWrite: false,
        opacity: config.baseOpacity,
        transparent: true,
      }),
    );
    marker.userData.baseOffset = config.offset(index);
    marker.userData.scale = config.scale(index);
    marker.userData.speedFactor = config.speed(index);
    marker.userData.spin = config.spin(index);

    group.add(marker);
    markers.push(marker);
  }

  return markers;
}

function createStreakLayer(group, config) {
  const descriptors = Array.from({ length: config.count }, () => ({
    angle: Math.random() * Math.PI * 2,
    baseOffset: Math.random() * config.span - config.behindAllowance,
    radial: Math.random(),
    speedFactor: 0.78 + Math.random() * 0.5,
    sway: Math.random() * Math.PI * 2,
  }));

  const positions = new Float32Array(config.count * 2 * 3);
  const colors = new Float32Array(config.count * 2 * 3);
  const geometry = new THREE.BufferGeometry();
  const color = new THREE.Color();

  descriptors.forEach((descriptor, index) => {
    const hue = index % 4 === 0 ? 0.08 : 0.53;
    const lightness = index % 4 === 0 ? 0.72 : 0.82;
    color.setHSL(hue, 0.82, lightness);
    color.toArray(colors, index * 6);
    color.toArray(colors, index * 6 + 3);
  });

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  const lines = new THREE.LineSegments(
    geometry,
    new THREE.LineBasicMaterial({
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: config.opacity,
      transparent: true,
      vertexColors: true,
    }),
  );
  group.add(lines);

  return {
    config,
    descriptors,
    lines,
    positions,
  };
}

function updateStreakLayer(layer, tunnelSystem, runtime, settings) {
  const { config, descriptors, lines, positions } = layer;
  const flowBase = runtime.transitFlow * config.progressScale * (0.78 + settings.speed * config.speedGain);
  const baseCurveT = runtime.curveT;

  descriptors.forEach((descriptor, index) => {
    const offset =
      runtime.viewMode === "inspect"
        ? descriptor.baseOffset
        : wrapOffset(descriptor.baseOffset, flowBase * descriptor.speedFactor, config);

    const sampleT = THREE.MathUtils.clamp(baseCurveT + offset, config.minT ?? 0.02, config.maxT ?? 0.985);
    const frame = tunnelSystem.sampleFrame(sampleT);
    const radialVector = frame.normal
      .clone()
      .multiplyScalar(Math.cos(descriptor.angle))
      .add(frame.binormal.clone().multiplyScalar(Math.sin(descriptor.angle)));
    const sway =
      Math.sin(runtime.transitFlow * config.drift + descriptor.sway + descriptor.baseOffset * 18.0) * config.sway;
    const radialDistance = frame.radius * (config.radialMin + descriptor.radial * config.radialRange);
    const center = frame.point
      .clone()
      .addScaledVector(radialVector, radialDistance)
      .addScaledVector(frame.binormal, sway);

    const head = center.clone().addScaledVector(frame.tangent, config.head);
    const tail = center
      .clone()
      .addScaledVector(frame.tangent, -config.length * (1 + runtime.velocityIndex * config.velocityStretch));

    const writeIndex = index * 6;
    positions[writeIndex] = tail.x;
    positions[writeIndex + 1] = tail.y;
    positions[writeIndex + 2] = tail.z;
    positions[writeIndex + 3] = head.x;
    positions[writeIndex + 4] = head.y;
    positions[writeIndex + 5] = head.z;
  });

  lines.geometry.attributes.position.needsUpdate = true;
  lines.material.opacity =
    runtime.viewMode === "inspect"
      ? config.opacity * 0.1
      : config.opacity * (0.84 + runtime.phaseIntensity * 0.52 + runtime.entryFlash * 0.42);
}

function updateMarkerSet(markers, config, tunnelSystem, runtime, settings, inspectMode) {
  const flowBase = runtime.transitFlow * config.progressScale * (0.8 + settings.speed * config.speedGain);

  markers.forEach((ring) => {
    const offset = inspectMode
      ? ring.userData.baseOffset
      : wrapOffset(ring.userData.baseOffset, flowBase * ring.userData.speedFactor, config);
    const sampleT = THREE.MathUtils.clamp(runtime.curveT + offset, config.minT, config.maxT);
    const frame = tunnelSystem.sampleFrame(sampleT);
    orientToTangent(ring, frame.point, frame.tangent);
    ring.scale.setScalar(frame.radius * ring.userData.scale);
    ring.rotation.z = runtime.transitProgress * ring.userData.spin * 6.0;

    const proximity = THREE.MathUtils.clamp(1 - Math.abs(offset - config.focusOffset) / config.focusSpan, 0, 1);
    ring.material.opacity = inspectMode
      ? config.inspectOpacity + proximity * config.inspectBoost
      : config.baseOpacity +
        proximity * config.proximityOpacity +
        runtime.phaseIntensity * config.phaseOpacity +
        runtime.entryFlash * config.entryOpacity +
        runtime.exitReveal * config.exitOpacity;
  });
}

export function createTransitCues(scene, tunnelSystem, settings) {
  const group = new THREE.Group();
  scene.add(group);

  const aperture = createApertureGroup();
  const exitBeacon = createExitBeacon();

  group.add(aperture.group);
  group.add(exitBeacon.group);

  const movingRings = createMarkerSet(group, {
    baseOpacity: 0.08,
    color: (index) => (index % 4 === 0 ? 0xffa258 : 0x8ef2ff),
    count: 36,
    offset: (index) => 0.04 + (index / 36) * 0.96,
    scale: (index) => 0.72 + (index % 4) * 0.06,
    speed: (index) => 0.78 + (index % 5) * 0.16,
    spin: (index) => 0.16 + (index % 6) * 0.06,
    tubeRadius: (index) => (index % 3 === 0 ? 0.075 : 0.05),
  });

  const foregroundRings = createMarkerSet(group, {
    baseOpacity: 0.1,
    color: (index) => (index % 3 === 0 ? 0xffc67c : 0xb1f6ff),
    count: 12,
    offset: (index) => -0.02 + (index / 12) * 0.24,
    scale: (index) => 0.64 + (index % 4) * 0.05,
    speed: (index) => 1.18 + (index % 4) * 0.24,
    spin: (index) => 0.34 + (index % 3) * 0.08,
    tubeRadius: (index) => 0.08 + (index % 2) * 0.02,
  });

  const streakLayers = [
    createStreakLayer(group, {
      behindAllowance: 0.04,
      count: 130,
      drift: 6.6,
      head: 0.18,
      length: 4.6,
      maxT: 0.98,
      minT: 0.02,
      opacity: 0.4,
      progressScale: 2.6,
      radialMin: 0.04,
      radialRange: 0.22,
      span: 0.2,
      speedGain: 0.34,
      sway: 0.08,
      velocityStretch: 0.14,
    }),
    createStreakLayer(group, {
      behindAllowance: 0.08,
      count: 92,
      drift: 4.8,
      head: 0.16,
      length: 3.1,
      opacity: 0.32,
      progressScale: 1.8,
      radialMin: 0.12,
      radialRange: 0.34,
      span: 0.34,
      speedGain: 0.2,
      sway: 0.12,
      velocityStretch: 0.12,
    }),
    createStreakLayer(group, {
      behindAllowance: 0.12,
      count: 72,
      drift: 3.4,
      head: 0.2,
      length: 4.9,
      opacity: 0.2,
      progressScale: 1.24,
      radialMin: 0.18,
      radialRange: 0.5,
      span: 0.56,
      speedGain: 0.12,
      sway: 0.18,
      velocityStretch: 0.1,
    }),
    createStreakLayer(group, {
      behindAllowance: 0.16,
      count: 54,
      drift: 2.4,
      head: 0.28,
      length: 6.8,
      opacity: 0.11,
      progressScale: 0.86,
      radialMin: 0.22,
      radialRange: 0.6,
      span: 0.82,
      speedGain: 0.08,
      sway: 0.24,
      velocityStretch: 0.08,
    }),
  ];

  function update(time, delta, runtime) {
    const startFrame = tunnelSystem.sampleFrame(0.01);
    const endFrame = tunnelSystem.sampleFrame(0.992);
    const inspectMode = runtime.viewMode === "inspect";
    const entryPeak = runtime.phase === "entry" ? Math.sin(runtime.phaseProgress * Math.PI) : 0;
    const aperturePosition = startFrame.point.clone().addScaledVector(startFrame.tangent, -0.35);
    const apertureScale = startFrame.radius * 1.24;
    const entryFocus =
      runtime.phase === "approach"
        ? 0.42 + runtime.phaseProgress * 0.58
        : runtime.phase === "entry"
          ? 0.82 + entryPeak * 0.42
          : Math.max(0.08, 0.2 * (1 - runtime.transitProgress));

    orientToTangent(aperture.group, aperturePosition, startFrame.tangent);
    aperture.group.scale.setScalar(apertureScale);
    aperture.ring.rotation.z = runtime.transitProgress * 4.2;
    aperture.innerBand.rotation.z = -runtime.transitProgress * 1.6;
    aperture.shockwave.rotation.z = runtime.transitProgress * 1.1;
    aperture.ring.material.opacity = inspectMode ? 0.08 : 0.2 + entryFocus * 0.24 + entryPeak * 0.22;
    aperture.innerBand.material.opacity = inspectMode ? 0.05 : 0.1 + entryFocus * 0.12 + entryPeak * 0.18;
    aperture.halo.scale.setScalar(apertureScale * 4.5);
    aperture.halo.material.opacity = inspectMode ? 0.06 : 0.1 + entryFocus * 0.14 + entryPeak * 0.28;
    aperture.boundaryGlow.scale.setScalar(apertureScale * 3.0);
    aperture.boundaryGlow.material.opacity = inspectMode ? 0.06 : 0.08 + entryFocus * 0.12 + entryPeak * 0.2;
    aperture.coreGlow.scale.setScalar(apertureScale * (1.5 + entryPeak * 0.58));
    aperture.coreGlow.material.opacity = inspectMode
      ? 0.05
      : runtime.phase === "approach"
        ? 0.08 + entryFocus * 0.2
        : 0.04 + (1 - runtime.phaseProgress) * 0.12 + entryPeak * 0.14;
    aperture.shockwave.scale.setScalar(apertureScale * (1.14 + entryPeak * 1.55));
    aperture.shockwave.material.opacity = inspectMode ? 0 : entryPeak * 0.36 + runtime.pulse * 0.08;

    const exitPosition = endFrame.point.clone().addScaledVector(endFrame.tangent, 4 + (1 - runtime.exitReveal) * 8);
    orientToTangent(exitBeacon.group, exitPosition, endFrame.tangent);
    exitBeacon.group.scale.setScalar(endFrame.radius * (0.34 + runtime.exitReveal * 1.82 + settings.bloom * 0.14));
    exitBeacon.ring.rotation.z = runtime.transitProgress * 3.6;
    exitBeacon.beacon.material.opacity =
      inspectMode ? 0.08 : 0.12 + runtime.exitReveal * 1.12 + settings.bloom * 0.08 + runtime.entryFlash * 0.06;
    exitBeacon.halo.material.opacity = inspectMode ? 0.04 : 0.06 + runtime.exitReveal * 0.42 + settings.bloom * 0.06;
    exitBeacon.halo.scale.setScalar(3.2 + runtime.exitReveal * 1.7);
    exitBeacon.ring.material.opacity = inspectMode ? 0.08 : 0.1 + runtime.exitReveal * 0.36 + settings.bloom * 0.05;

    updateMarkerSet(
      movingRings,
      {
        baseOpacity: 0.06,
        behindAllowance: 0.08,
        entryOpacity: 0.16,
        exitOpacity: 0.1,
        focusOffset: 0.06,
        focusSpan: 0.28,
        inspectBoost: 0.03,
        inspectOpacity: 0.04,
        maxT: 0.985,
        minT: 0.03,
        phaseOpacity: 0.08,
        progressScale: 1.32,
        proximityOpacity: 0.3,
        speedGain: 0.1,
        span: 1.04,
      },
      tunnelSystem,
      runtime,
      settings,
      inspectMode,
    );

    updateMarkerSet(
      foregroundRings,
      {
        baseOpacity: 0.1,
        behindAllowance: 0.04,
        entryOpacity: 0.18,
        exitOpacity: 0.08,
        focusOffset: 0.02,
        focusSpan: 0.18,
        inspectBoost: 0.02,
        inspectOpacity: 0.04,
        maxT: 0.985,
        minT: 0.035,
        phaseOpacity: 0.12,
        progressScale: 2.24,
        proximityOpacity: 0.4,
        speedGain: 0.18,
        span: 0.28,
      },
      tunnelSystem,
      runtime,
      settings,
      inspectMode,
    );

    streakLayers.forEach((layer) => {
      updateStreakLayer(layer, tunnelSystem, runtime, settings);
    });
  }

  return {
    update,
  };
}
