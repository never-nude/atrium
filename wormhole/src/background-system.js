import * as THREE from "three";

const UNIT_Z = new THREE.Vector3(0, 0, 1);

function createParticleTexture() {
  const size = 96;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;

  const context = canvas.getContext("2d");
  const gradient = context.createRadialGradient(size * 0.5, size * 0.5, 0, size * 0.5, size * 0.5, size * 0.5);
  gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
  gradient.addColorStop(0.3, "rgba(255, 255, 255, 0.95)");
  gradient.addColorStop(0.68, "rgba(255, 255, 255, 0.2)");
  gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

  context.fillStyle = gradient;
  context.fillRect(0, 0, size, size);

  return new THREE.CanvasTexture(canvas);
}

function createHaloTexture(innerColor, outerColor) {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;

  const context = canvas.getContext("2d");
  const gradient = context.createRadialGradient(size * 0.5, size * 0.5, 0, size * 0.5, size * 0.5, size * 0.5);
  gradient.addColorStop(0, innerColor);
  gradient.addColorStop(0.28, "rgba(255, 255, 255, 0.12)");
  gradient.addColorStop(0.6, outerColor);
  gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

  context.fillStyle = gradient;
  context.fillRect(0, 0, size, size);

  return new THREE.CanvasTexture(canvas);
}

function createStarField({ count, hueRange, lightnessRange, radius, size, texture }) {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const geometry = new THREE.BufferGeometry();
  const color = new THREE.Color();

  for (let index = 0; index < count; index += 1) {
    const r = radius * Math.pow(Math.random(), 0.58);
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const sinPhi = Math.sin(phi);

    positions[index * 3] = r * sinPhi * Math.cos(theta);
    positions[index * 3 + 1] = r * Math.cos(phi);
    positions[index * 3 + 2] = r * sinPhi * Math.sin(theta);

    color.setHSL(
      hueRange[0] + Math.random() * (hueRange[1] - hueRange[0]),
      0.72,
      lightnessRange[0] + Math.random() * (lightnessRange[1] - lightnessRange[0]),
    );
    color.toArray(colors, index * 3);
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  return new THREE.Points(
    geometry,
    new THREE.PointsMaterial({
      alphaMap: texture,
      alphaTest: 0.02,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      map: texture,
      opacity: 0.9,
      size,
      sizeAttenuation: true,
      transparent: true,
      vertexColors: true,
    }),
  );
}

function orientGroup(group, point, tangent) {
  group.position.copy(point);
  group.quaternion.setFromUnitVectors(UNIT_Z, tangent.clone().normalize());
}

export function createBackgroundSystem(scene) {
  const particleTexture = createParticleTexture();
  const entryHaloTexture = createHaloTexture("rgba(130, 235, 255, 0.55)", "rgba(130, 235, 255, 0.14)");
  const exitHaloTexture = createHaloTexture("rgba(255, 205, 120, 0.68)", "rgba(130, 235, 255, 0.16)");
  const exitCoreTexture = createHaloTexture("rgba(255, 244, 220, 0.78)", "rgba(255, 168, 102, 0.05)");

  const root = new THREE.Group();
  scene.add(root);

  const entryGroup = new THREE.Group();
  const exitGroup = new THREE.Group();
  root.add(entryGroup);
  root.add(exitGroup);

  const entryStars = createStarField({
    count: 3200,
    hueRange: [0.5, 0.6],
    lightnessRange: [0.68, 0.92],
    radius: 210,
    size: 1.05,
    texture: particleTexture,
  });
  entryGroup.add(entryStars);

  const exitStars = createStarField({
    count: 4200,
    hueRange: [0.08, 0.18],
    lightnessRange: [0.66, 0.95],
    radius: 220,
    size: 1.18,
    texture: particleTexture,
  });
  exitGroup.add(exitStars);

  const exitFarStars = createStarField({
    count: 2400,
    hueRange: [0.1, 0.24],
    lightnessRange: [0.7, 0.97],
    radius: 260,
    size: 1.42,
    texture: particleTexture,
  });
  exitGroup.add(exitFarStars);

  const entryHalo = new THREE.Sprite(
    new THREE.SpriteMaterial({
      blending: THREE.AdditiveBlending,
      color: 0xa5f6ff,
      depthWrite: false,
      map: entryHaloTexture,
      opacity: 0.22,
      transparent: true,
    }),
  );
  entryHalo.scale.setScalar(120);
  entryGroup.add(entryHalo);

  const exitHalo = new THREE.Sprite(
    new THREE.SpriteMaterial({
      blending: THREE.AdditiveBlending,
      color: 0xffd08c,
      depthWrite: false,
      map: exitHaloTexture,
      opacity: 0.12,
      transparent: true,
    }),
  );
  exitHalo.scale.setScalar(178);
  exitGroup.add(exitHalo);

  const exitCore = new THREE.Sprite(
    new THREE.SpriteMaterial({
      blending: THREE.AdditiveBlending,
      color: 0xfff0cf,
      depthWrite: false,
      map: exitCoreTexture,
      opacity: 0.1,
      transparent: true,
    }),
  );
  exitCore.scale.setScalar(74);
  exitGroup.add(exitCore);

  const destinationArc = new THREE.Mesh(
    new THREE.TorusGeometry(84, 0.65, 8, 180),
    new THREE.MeshBasicMaterial({
      blending: THREE.AdditiveBlending,
      color: 0xb4ebff,
      depthWrite: false,
      opacity: 0.08,
      transparent: true,
    }),
  );
  destinationArc.rotation.x = Math.PI * 0.5;
  exitGroup.add(destinationArc);

  const destinationRing = new THREE.Mesh(
    new THREE.RingGeometry(44, 64, 120),
    new THREE.MeshBasicMaterial({
      blending: THREE.AdditiveBlending,
      color: 0xffc884,
      depthWrite: false,
      opacity: 0.08,
      side: THREE.DoubleSide,
      transparent: true,
    }),
  );
  exitGroup.add(destinationRing);

  let anchors = null;

  function setAnchors(nextAnchors) {
    anchors = {
      end: {
        ...nextAnchors.end,
        point: nextAnchors.end.point.clone(),
        tangent: nextAnchors.end.tangent.clone(),
      },
      start: {
        ...nextAnchors.start,
        point: nextAnchors.start.point.clone(),
        tangent: nextAnchors.start.tangent.clone(),
      },
    };

    orientGroup(entryGroup, anchors.start.point.clone().addScaledVector(anchors.start.tangent, -144), anchors.start.tangent);
    orientGroup(exitGroup, anchors.end.point.clone().addScaledVector(anchors.end.tangent, 132), anchors.end.tangent);
  }

  function update(time, runtime) {
    if (anchors) {
      const entryDistance = THREE.MathUtils.lerp(
        -128,
        -154,
        THREE.MathUtils.smoothstep(runtime.transitProgress, 0, 0.22),
      );
      const exitDistance = THREE.MathUtils.lerp(
        152,
        92,
        THREE.MathUtils.smoothstep(runtime.transitProgress, 0.34, 1.0),
      );
      orientGroup(entryGroup, anchors.start.point.clone().addScaledVector(anchors.start.tangent, entryDistance), anchors.start.tangent);
      orientGroup(exitGroup, anchors.end.point.clone().addScaledVector(anchors.end.tangent, exitDistance), anchors.end.tangent);
    }

    entryStars.rotation.z = runtime.transitFlow * 0.18;
    exitStars.rotation.z = -runtime.transitFlow * 0.24;
    exitStars.rotation.y = runtime.transitProgress * 0.16;
    exitFarStars.rotation.z = runtime.transitProgress * 0.08;

    const approachStretch =
      runtime.phase === "approach"
        ? 1 + runtime.phaseProgress * 0.96
        : 1.18 + runtime.transitProgress * 0.24;
    entryGroup.scale.set(1, 1, approachStretch);
    entryStars.material.opacity = runtime.viewMode === "inspect" ? 0.16 : 0.28 + runtime.phaseIntensity * 0.14;
    entryStars.material.size = 0.92 + runtime.velocityIndex * 0.16 + runtime.transitProgress * 0.08;
    entryHalo.material.opacity =
      runtime.viewMode === "inspect" ? 0.03 : 0.05 + runtime.phaseIntensity * 0.06 + runtime.entryFlash * 0.1;

    const exitOpacity = 0.08 + runtime.exitReveal * 1.02;
    exitStars.material.opacity = exitOpacity;
    exitStars.material.size = 1.08 + runtime.exitReveal * 0.42 + runtime.bloom * 0.08;
    exitFarStars.material.opacity = 0.04 + runtime.exitReveal * 0.66;
    exitFarStars.material.size = 1.22 + runtime.exitReveal * 0.38;

    exitGroup.scale.setScalar(0.88 + runtime.exitReveal * 0.28);
    exitGroup.scale.z = 1.02 + runtime.exitReveal * 0.5;
    exitHalo.material.opacity =
      runtime.viewMode === "inspect"
        ? 0.04
        : 0.06 + runtime.exitReveal * 0.34 + runtime.pulse * 0.04 + runtime.bloom * 0.04;
    exitHalo.scale.setScalar(178 + runtime.exitReveal * 54 + runtime.bloom * 16);
    exitCore.material.opacity =
      runtime.viewMode === "inspect" ? 0.06 : 0.08 + runtime.exitReveal * 0.6 + runtime.bloom * 0.08;
    exitCore.scale.setScalar(74 + runtime.exitReveal * 46 + runtime.bloom * 14);

    destinationArc.rotation.z = runtime.transitProgress * 2.1;
    destinationArc.rotation.y = 0.36 + runtime.exitReveal * 0.18 + Math.sin(runtime.transitProgress * Math.PI * 4.0) * 0.04;
    destinationArc.material.opacity = 0.04 + runtime.exitReveal * 0.24;

    destinationRing.rotation.z = -runtime.transitProgress * 1.7;
    destinationRing.material.opacity = 0.03 + runtime.exitReveal * 0.26 + runtime.bloom * 0.05;
    destinationRing.scale.setScalar(1 + runtime.exitReveal * 0.12);
  }

  return {
    setAnchors,
    update,
  };
}
