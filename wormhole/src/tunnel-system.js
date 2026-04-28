import * as THREE from "three";

const PATH_SEGMENTS = 360;
const RADIAL_SEGMENTS = 80;
const TAU = Math.PI * 2;
const UNIT_Z = new THREE.Vector3(0, 0, 1);

function createParticleTexture() {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;

  const context = canvas.getContext("2d");
  const gradient = context.createRadialGradient(size * 0.5, size * 0.5, 0, size * 0.5, size * 0.5, size * 0.5);
  gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
  gradient.addColorStop(0.32, "rgba(255, 255, 255, 0.94)");
  gradient.addColorStop(0.65, "rgba(255, 255, 255, 0.24)");
  gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

  context.fillStyle = gradient;
  context.fillRect(0, 0, size, size);

  return new THREE.CanvasTexture(canvas);
}

function getRadiusAt(t, throatRadius) {
  const mouth =
    Math.exp(-Math.pow(t / 0.11, 2.0)) + Math.exp(-Math.pow((1 - t) / 0.11, 2.0));
  const constriction = Math.pow(Math.sin(t * Math.PI), 1.3);
  const breathing = Math.sin(t * TAU * 2.6 + 0.55) * 0.04 + Math.sin(t * TAU * 5.4 - 0.3) * 0.02;
  return throatRadius * (0.82 + constriction * 0.16 + mouth * 0.82 + breathing);
}

function createTunnelMaterial(uniforms) {
  return new THREE.ShaderMaterial({
    side: THREE.DoubleSide,
    uniforms,
    vertexShader: `
      varying vec2 vUv;
      varying vec3 vWorldPosition;
      varying vec3 vWorldNormal;

      uniform float uDistortion;
      uniform float uFlow;
      uniform float uPulse;
      uniform float uSpeed;
      uniform float uTransit;
      uniform float uVelocity;

      void main() {
        vUv = uv;

        float angle = uv.x * 6.28318530718;
        float flow = uFlow * (180.0 + uSpeed * 120.0);
        float axialPulse = sin(uv.y * 96.0 - flow + angle * 2.4);
        float ribs = sin(angle * 12.0 + uv.y * 8.0 - flow * 0.18);
        float turbulence = cos(angle * 18.0 + uv.y * 38.0 - flow * 0.42);
        float compression = sin(uv.y * 44.0 - flow * 0.28);

        vec3 transformed = position;
        vec3 radial = normalize(normal);

        transformed += radial * axialPulse * (0.16 + uDistortion * 0.28 + uVelocity * 1.3);
        transformed += radial * ribs * 0.08 * (0.3 + uDistortion);
        transformed += radial * turbulence * 0.04 * (0.3 + uDistortion * 0.8);
        transformed += radial * compression * (0.06 + uPulse * 0.18 + uTransit * 0.04);

        vec4 worldPosition = modelMatrix * vec4(transformed, 1.0);
        vWorldPosition = worldPosition.xyz;
        vWorldNormal = normalize(mat3(modelMatrix) * radial);

        gl_Position = projectionMatrix * viewMatrix * worldPosition;
      }
    `,
    fragmentShader: `
      varying vec2 vUv;
      varying vec3 vWorldPosition;
      varying vec3 vWorldNormal;

      uniform float uDistortion;
      uniform float uExitReveal;
      uniform float uFlow;
      uniform float uGlow;
      uniform float uPulse;
      uniform float uSpeed;
      uniform float uTransit;
      uniform float uVelocity;

      void main() {
        float angle = vUv.x * 6.28318530718;
        float corridor = sin(vUv.y * 3.14159265359);
        float flow = uFlow * (260.0 + uSpeed * 150.0);
        float ribs = pow(abs(sin(angle * 10.0 + vUv.y * 5.0 - flow * 0.05)), 9.0);
        float lanes = pow(abs(cos(angle * 5.0 + vUv.y * 3.8 - flow * 0.08)), 7.0);
        float axialBands =
          smoothstep(0.58, 0.97, sin(vUv.y * 132.0 - flow * 0.32 + angle * 2.8) * 0.5 + 0.5);
        float caustics =
          sin(vUv.y * 210.0 - flow * 0.46 + angle * 4.6) * 0.5 + 0.5;

        float slip = fract(vUv.y * 26.0 - flow * 0.1);
        float slipBand = smoothstep(0.0, 0.16, slip) * (1.0 - smoothstep(0.2, 0.36, slip));

        float entryGlow = exp(-pow(vUv.y / 0.14, 2.0));
        float exitGlow = exp(-pow((1.0 - vUv.y) / 0.16, 2.0));

        vec3 deep = vec3(0.01, 0.03, 0.08);
        vec3 mid = vec3(0.04, 0.15, 0.28);
        vec3 cool = vec3(0.36, 0.94, 1.0);
        vec3 warm = vec3(1.0, 0.58, 0.19);

        vec3 color = mix(deep, mid, 0.34 + corridor * 0.42);
        color += cool * (lanes * 0.14 + ribs * 0.18 + axialBands * (0.18 + uGlow * 0.1));
        color += mix(cool, warm, caustics * 0.55 + uExitReveal * 0.18) *
          slipBand *
          (0.2 + uVelocity * 1.4 + uPulse * 0.14);
        color += cool * entryGlow * (0.22 + uDistortion * 0.18 + uTransit * 0.04);
        color += warm * exitGlow * (0.18 + uExitReveal * 0.92);
        color += mix(cool, warm, caustics) * (0.08 + uDistortion * 0.12 + uPulse * 0.2);

        vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
        float fresnel = pow(1.0 - abs(dot(normalize(vWorldNormal), viewDirection)), 2.3);
        color += cool * fresnel * (0.24 + uGlow * 0.28 + uTransit * 0.14);

        vec3 finalColor = min(color * (0.28 + uGlow * 0.42 + uPulse * 0.06 + uVelocity * 0.18), vec3(1.12));
        gl_FragColor = vec4(finalColor, 1.0);
      }
    `,
  });
}

function createPortalMaterial(coolHex, warmHex) {
  return new THREE.ShaderMaterial({
    side: THREE.DoubleSide,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uCool: { value: new THREE.Color(coolHex) },
      uGlow: { value: 1.0 },
      uPulse: { value: 0.0 },
      uReveal: { value: 0.0 },
      uTransit: { value: 0.0 },
      uWarm: { value: new THREE.Color(warmHex) },
    },
    vertexShader: `
      varying vec2 vUv;

      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec2 vUv;

      uniform vec3 uCool;
      uniform float uGlow;
      uniform float uPulse;
      uniform float uReveal;
      uniform float uTransit;
      uniform vec3 uWarm;

      void main() {
        vec2 centered = vUv - 0.5;
        float dist = length(centered) * 2.0;
        float rim = smoothstep(1.02, 0.74, dist) - smoothstep(0.78, 0.48, dist);
        float interior = smoothstep(0.74, 0.0, dist);
        float boundary = smoothstep(0.96, 0.82, dist);
        float swirl = sin(atan(centered.y, centered.x) * 13.0 - uTransit * 18.0 + dist * 22.0) * 0.5 + 0.5;

        vec3 color = mix(uCool, uWarm, swirl * 0.46 + uReveal * 0.22 + interior * 0.18);
        float alpha =
          rim * (0.38 + uGlow * 0.24 + uReveal * 0.18) +
          interior * (0.06 + uPulse * 0.18) +
          boundary * 0.22;
        alpha *= smoothstep(1.06, 0.08, dist);

        color += uCool * boundary * (0.2 + uGlow * 0.18);
        color += uWarm * rim * (0.08 + uReveal * 0.22 + uPulse * 0.16);
        color *= 0.52 + uGlow * 0.34 + uReveal * 0.2 + uPulse * 0.18;

        gl_FragColor = vec4(color, alpha);
      }
    `,
  });
}

function buildPathCache(curve, throatRadius) {
  const points = curve.getPoints(PATH_SEGMENTS);
  const normals = [];
  const tangents = [];
  const binormals = [];
  const radii = [];
  const frames = curve.computeFrenetFrames(PATH_SEGMENTS, false);

  for (let index = 0; index <= PATH_SEGMENTS; index += 1) {
    const t = index / PATH_SEGMENTS;
    tangents.push(curve.getTangent(t).normalize());
    normals.push(frames.normals[index].clone().normalize());
    binormals.push(frames.binormals[index].clone().normalize());
    radii.push(getRadiusAt(t, throatRadius));
  }

  return {
    binormals,
    normals,
    points,
    radii,
    tangents,
  };
}

function createTubeGeometry(pathCache) {
  const vertexCount = (PATH_SEGMENTS + 1) * (RADIAL_SEGMENTS + 1);
  const positions = new Float32Array(vertexCount * 3);
  const normals = new Float32Array(vertexCount * 3);
  const uvs = new Float32Array(vertexCount * 2);
  const indices = [];

  let vertexOffset = 0;
  let uvOffset = 0;

  for (let segment = 0; segment <= PATH_SEGMENTS; segment += 1) {
    const t = segment / PATH_SEGMENTS;
    const point = pathCache.points[segment];
    const normal = pathCache.normals[segment];
    const binormal = pathCache.binormals[segment];
    const radius = pathCache.radii[segment];

    for (let radialSegment = 0; radialSegment <= RADIAL_SEGMENTS; radialSegment += 1) {
      const u = radialSegment / RADIAL_SEGMENTS;
      const angle = u * TAU;
      const radial = normal.clone().multiplyScalar(Math.cos(angle)).add(binormal.clone().multiplyScalar(Math.sin(angle)));
      const position = point.clone().addScaledVector(radial, radius);

      positions[vertexOffset] = position.x;
      positions[vertexOffset + 1] = position.y;
      positions[vertexOffset + 2] = position.z;

      normals[vertexOffset] = radial.x;
      normals[vertexOffset + 1] = radial.y;
      normals[vertexOffset + 2] = radial.z;

      uvs[uvOffset] = u;
      uvs[uvOffset + 1] = t;

      vertexOffset += 3;
      uvOffset += 2;
    }
  }

  for (let segment = 0; segment < PATH_SEGMENTS; segment += 1) {
    for (let radialSegment = 0; radialSegment < RADIAL_SEGMENTS; radialSegment += 1) {
      const a = segment * (RADIAL_SEGMENTS + 1) + radialSegment;
      const b = (segment + 1) * (RADIAL_SEGMENTS + 1) + radialSegment;
      const c = b + 1;
      const d = a + 1;

      indices.push(a, b, d);
      indices.push(b, c, d);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("normal", new THREE.BufferAttribute(normals, 3));
  geometry.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeBoundingSphere();

  return geometry;
}

function samplePath(pathCache, t) {
  const clamped = THREE.MathUtils.clamp(t, 0, 1);
  const scaled = clamped * PATH_SEGMENTS;
  const index = Math.min(PATH_SEGMENTS - 1, Math.floor(scaled));
  const alpha = scaled - index;

  return {
    binormal: pathCache.binormals[index].clone().lerp(pathCache.binormals[index + 1], alpha).normalize(),
    normal: pathCache.normals[index].clone().lerp(pathCache.normals[index + 1], alpha).normalize(),
    point: pathCache.points[index].clone().lerp(pathCache.points[index + 1], alpha),
    radius: THREE.MathUtils.lerp(pathCache.radii[index], pathCache.radii[index + 1], alpha),
    tangent: pathCache.tangents[index].clone().lerp(pathCache.tangents[index + 1], alpha).normalize(),
    t: clamped,
  };
}

function orientToTangent(object, point, tangent) {
  object.position.copy(point);
  object.quaternion.setFromUnitVectors(UNIT_Z, tangent.clone().normalize());
}

export function createTunnelSystem(scene, initialSettings) {
  const settings = { ...initialSettings };
  const particleTexture = createParticleTexture();
  const curve = new THREE.CatmullRomCurve3(
    [
      new THREE.Vector3(0, 0, 52),
      new THREE.Vector3(6.2, -3.4, 18),
      new THREE.Vector3(-4.6, 2.9, -28),
      new THREE.Vector3(2.4, -1.4, -82),
      new THREE.Vector3(0, 0.8, -140),
    ],
    false,
    "catmullrom",
    0.48,
  );

  const group = new THREE.Group();
  scene.add(group);

  const tunnelUniforms = {
    uDistortion: { value: settings.distortion },
    uExitReveal: { value: 0.0 },
    uFlow: { value: 0.0 },
    uGlow: { value: settings.glow },
    uPulse: { value: 0.0 },
    uSpeed: { value: settings.speed },
    uTransit: { value: 0.0 },
    uVelocity: { value: 0.0 },
  };

  const tunnelMaterial = createTunnelMaterial(tunnelUniforms);
  const tunnelMesh = new THREE.Mesh(new THREE.BufferGeometry(), tunnelMaterial);
  group.add(tunnelMesh);

  const entryPortalMaterial = createPortalMaterial(0x7fefff, 0xff9a3d);
  const exitPortalMaterial = createPortalMaterial(0xcffbff, 0xffc46b);
  const entryPortal = new THREE.Mesh(new THREE.CircleGeometry(1, 96), entryPortalMaterial);
  const exitPortal = new THREE.Mesh(new THREE.CircleGeometry(1, 96), exitPortalMaterial);
  group.add(entryPortal);
  group.add(exitPortal);

  const entranceHaloRings = [];
  for (let index = 0; index < 5; index += 1) {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(1, 0.03 + index * 0.018, 10, 112),
      new THREE.MeshBasicMaterial({
        blending: THREE.AdditiveBlending,
        color: index % 2 === 0 ? 0x82ebff : 0xffa357,
        depthWrite: false,
        opacity: 0.22 - index * 0.028,
        transparent: true,
      }),
    );
    entranceHaloRings.push(ring);
    group.add(ring);
  }

  const staticFieldRings = [];
  for (let index = 0; index < 36; index += 1) {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(1, 0.04, 10, 80),
      new THREE.MeshBasicMaterial({
        blending: THREE.AdditiveBlending,
        color: index % 4 === 0 ? 0xffab5f : 0x8bf3ff,
        depthWrite: false,
        opacity: 0.12,
        transparent: true,
      }),
    );
    ring.userData.baseT = 0.04 + (index / 35) * 0.92;
    staticFieldRings.push(ring);
    group.add(ring);
  }

  const pulseRings = [];
  for (let index = 0; index < 16; index += 1) {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(1, 0.06, 10, 96),
      new THREE.MeshBasicMaterial({
        blending: THREE.AdditiveBlending,
        color: index % 2 === 0 ? 0xff9a3d : 0x8bf3ff,
        depthWrite: false,
        opacity: 0.18,
        transparent: true,
      }),
    );
    ring.userData.baseOffset = index / 16;
    ring.userData.scale = 0.7 + (index % 4) * 0.06;
    pulseRings.push(ring);
    group.add(ring);
  }

  const interiorDustDescriptors = Array.from({ length: 3400 }, () => ({
    angle: Math.random() * TAU,
    drift: (Math.random() - 0.5) * 4.6,
    hueOffset: Math.random(),
    radial: 0.08 + Math.random() * 0.68,
    t: Math.random(),
  }));

  const interiorDustGeometry = new THREE.BufferGeometry();
  const interiorDust = new THREE.Points(
    interiorDustGeometry,
    new THREE.PointsMaterial({
      alphaMap: particleTexture,
      alphaTest: 0.02,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      map: particleTexture,
      opacity: 0.24,
      size: 0.72,
      sizeAttenuation: true,
      transparent: true,
      vertexColors: true,
    }),
  );
  group.add(interiorDust);

  let pathCache = buildPathCache(curve, settings.throat);
  const pathLength = curve.getLength();

  function rebuildTunnelGeometry() {
    const nextGeometry = createTubeGeometry(pathCache);
    tunnelMesh.geometry.dispose();
    tunnelMesh.geometry = nextGeometry;
  }

  function rebuildInteriorDust() {
    const positions = new Float32Array(interiorDustDescriptors.length * 3);
    const colors = new Float32Array(interiorDustDescriptors.length * 3);
    const color = new THREE.Color();

    interiorDustDescriptors.forEach((descriptor, index) => {
      const frame = samplePath(pathCache, descriptor.t);
      const radialVector =
        frame.normal.clone().multiplyScalar(Math.cos(descriptor.angle)).add(
          frame.binormal.clone().multiplyScalar(Math.sin(descriptor.angle)),
        );
      const position = frame.point
        .clone()
        .addScaledVector(radialVector, frame.radius * descriptor.radial)
        .addScaledVector(frame.tangent, descriptor.drift);

      positions[index * 3] = position.x;
      positions[index * 3 + 1] = position.y;
      positions[index * 3 + 2] = position.z;

      color.setHSL(0.52 + descriptor.hueOffset * 0.1, 0.7, 0.72 + descriptor.hueOffset * 0.16);
      color.toArray(colors, index * 3);
    });

    interiorDust.geometry.dispose();
    interiorDust.geometry = new THREE.BufferGeometry();
    interiorDust.geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    interiorDust.geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  }

  function updatePortalPlacement() {
    const startFrame = samplePath(pathCache, 0);
    const endFrame = samplePath(pathCache, 1);
    const startScale = startFrame.radius * 1.16;
    const endScale = endFrame.radius * 1.18;

    orientToTangent(entryPortal, startFrame.point, startFrame.tangent);
    orientToTangent(exitPortal, endFrame.point, endFrame.tangent);
    entryPortal.scale.setScalar(startScale);
    exitPortal.scale.setScalar(endScale);

    entranceHaloRings.forEach((ring, index) => {
      const haloPosition = startFrame.point.clone().addScaledVector(startFrame.tangent, -1.1 - index * 0.82);
      orientToTangent(ring, haloPosition, startFrame.tangent);
      ring.scale.setScalar(startScale * (1.02 + index * 0.14));
    });
  }

  function rebuildRadiusDependentAssets() {
    pathCache = buildPathCache(curve, settings.throat);
    rebuildTunnelGeometry();
    rebuildInteriorDust();
    updatePortalPlacement();
  }

  function setSettings(nextSettings) {
    const throatChanged = nextSettings.throat !== settings.throat;
    Object.assign(settings, nextSettings);
    tunnelUniforms.uDistortion.value = settings.distortion;
    tunnelUniforms.uGlow.value = settings.glow;
    tunnelUniforms.uSpeed.value = settings.speed;

    if (throatChanged) {
      rebuildRadiusDependentAssets();
    }
  }

  function update(time, delta, runtime) {
    tunnelUniforms.uDistortion.value = settings.distortion + runtime.entryFlash * 0.18 + (1 - runtime.exitReveal) * 0.06;
    tunnelUniforms.uExitReveal.value = runtime.exitReveal;
    tunnelUniforms.uFlow.value = runtime.transitFlow;
    tunnelUniforms.uGlow.value = settings.glow;
    tunnelUniforms.uPulse.value = runtime.pulse * 0.48;
    tunnelUniforms.uSpeed.value = settings.speed;
    tunnelUniforms.uTransit.value = runtime.transitProgress;
    tunnelUniforms.uVelocity.value = runtime.transitVelocity;

    entryPortalMaterial.uniforms.uGlow.value = settings.glow + runtime.entryFlash * 0.08;
    entryPortalMaterial.uniforms.uPulse.value = runtime.pulse + runtime.entryFlash * 0.18;
    entryPortalMaterial.uniforms.uTransit.value = runtime.transitFlow;
    entryPortalMaterial.uniforms.uReveal.value =
      runtime.phase === "approach"
        ? 0.42 + runtime.phaseProgress * 0.74
        : 0.26 + runtime.entryFlash * 0.34;

    exitPortalMaterial.uniforms.uGlow.value = settings.glow + runtime.exitReveal * 0.2 + settings.bloom * 0.08;
    exitPortalMaterial.uniforms.uPulse.value = runtime.pulse;
    exitPortalMaterial.uniforms.uTransit.value = runtime.transitFlow;
    exitPortalMaterial.uniforms.uReveal.value = runtime.exitReveal;

    const startFrame = samplePath(pathCache, 0);

    entranceHaloRings.forEach((ring, index) => {
      ring.rotation.z = runtime.transitProgress * (2.2 + index * 0.4);
      ring.material.opacity =
        (0.18 - index * 0.022) * (1 - runtime.transitProgress * 0.44) +
        runtime.entryFlash * 0.16 +
        runtime.pulse * 0.08;
      const position = startFrame.point.clone().addScaledVector(startFrame.tangent, -1.1 - index * 0.82);
      orientToTangent(ring, position, startFrame.tangent);
    });

    staticFieldRings.forEach((ring, index) => {
      const frame = samplePath(pathCache, ring.userData.baseT);
      const proximity = THREE.MathUtils.clamp(1 - Math.abs(ring.userData.baseT - runtime.curveT) / 0.2, 0, 1);
      orientToTangent(ring, frame.point, frame.tangent);
      ring.scale.setScalar(
        frame.radius * (0.68 + 0.09 * Math.sin((runtime.transitFlow + ring.userData.baseT) * 12.0) + settings.distortion * 0.08),
      );
      ring.rotation.z = runtime.transitProgress * (0.9 + index * 0.05);
      ring.material.opacity =
        0.06 +
        proximity * 0.16 +
        runtime.phaseIntensity * 0.1 +
        0.08 * Math.sin((runtime.transitFlow + ring.userData.baseT) * 10.0) ** 2;
    });

    pulseRings.forEach((ring) => {
      const wrapped = THREE.MathUtils.euclideanModulo(
        ring.userData.baseOffset - runtime.transitFlow * (0.32 + settings.speed * 0.22 + ring.userData.scale * 0.12),
        1,
      );
      const t = 0.03 + wrapped * 0.94;
      const frame = samplePath(pathCache, t);
      const proximity = THREE.MathUtils.clamp(1 - Math.abs(t - runtime.curveT) / 0.16, 0, 1);
      orientToTangent(ring, frame.point, frame.tangent);
      ring.scale.setScalar(frame.radius * (ring.userData.scale + runtime.entryFlash * 0.1 + runtime.pulse * 0.18));
      ring.material.opacity = 0.06 + runtime.phaseIntensity * 0.18 + runtime.pulse * 0.24 + proximity * 0.14;
      ring.rotation.z = runtime.transitProgress * (1.8 + ring.userData.scale * 0.8);
    });

    interiorDust.material.opacity =
      runtime.viewMode === "inspect" ? 0.08 : 0.18 + runtime.phaseIntensity * 0.18 + runtime.pulse * 0.08;
    interiorDust.material.size =
      runtime.viewMode === "inspect" ? 0.52 : 0.62 + runtime.velocityIndex * 0.12 + settings.glow * 0.06;
  }

  function getAnchors() {
    return {
      end: samplePath(pathCache, 1),
      start: samplePath(pathCache, 0),
    };
  }

  rebuildRadiusDependentAssets();

  return {
    getAnchors,
    getLength() {
      return pathLength;
    },
    group,
    sampleFrame(t) {
      return samplePath(pathCache, t);
    },
    setSettings,
    settings,
    update,
  };
}
