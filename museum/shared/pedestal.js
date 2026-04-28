const PEDESTAL_EXCLUSION_PATTERN = /\brelief\b|\btondo\b|\btusk\b|\bhorn\b|\bsphinx\b/;

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function quantile(sortedValues, ratio) {
  if (!sortedValues.length) return 0;
  const index = clamp(Math.floor((sortedValues.length - 1) * ratio), 0, sortedValues.length - 1);
  return sortedValues[index];
}

function pieceText(piece) {
  return [
    piece?.viewerTitle,
    piece?.subtitle,
    piece?.medium,
    piece?.lobbyMeta,
    piece?.source?.summary,
    piece?.source?.note
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function resolveRadiusFromSamples(distances, fallbackRadius, sceneConfig, scale = 1) {
  const margin = sceneConfig.pedestalMargin ?? 1.08;
  const minRadius = sceneConfig.pedestalMinRadius ?? 0.18;
  const maxRadius = sceneConfig.pedestalMaxRadius ?? 1.45;

  let radius = fallbackRadius;
  if (distances.length) {
    distances.sort((a, b) => a - b);
    radius = quantile(distances, sceneConfig.pedestalFootprintQuantile ?? 0.96);
  }

  return clamp(radius * scale * margin, minRadius, maxRadius);
}

export function inferPedestalEnabled(piece, sceneConfig = {}) {
  if (typeof sceneConfig.showPedestal === "boolean") {
    return sceneConfig.showPedestal;
  }
  return !PEDESTAL_EXCLUSION_PATTERN.test(pieceText(piece));
}

export function resolvePedestalHeight(sceneConfig = {}, targetHeight = 1.58) {
  if (typeof sceneConfig.baseHeight === "number") {
    return sceneConfig.baseHeight;
  }
  return clamp(targetHeight * 0.1, 0.12, 0.2);
}

export function resolveGeometryPedestalRadius(geometry, size, scale, sceneConfig = {}) {
  const positions = geometry?.attributes?.position;
  if (!positions || !size) {
    return resolveRadiusFromSamples([], 0.34, sceneConfig);
  }

  const threshold = sceneConfig.pedestalSampleHeight ?? size.y * (sceneConfig.pedestalSampleRatio ?? 0.06);
  const sampleLimit = sceneConfig.pedestalMaxSamples ?? 18000;
  const step = Math.max(1, Math.ceil(positions.count / sampleLimit));
  const distances = [];

  for (let index = 0; index < positions.count; index += step) {
    if (positions.getY(index) > threshold) continue;
    distances.push(Math.hypot(positions.getX(index), positions.getZ(index)));
  }

  const fallbackRadius = Math.max(size.x, size.z) * 0.32;
  return resolveRadiusFromSamples(distances, fallbackRadius, sceneConfig, scale);
}

export function resolveObjectPedestalRadius(root, box, scale, THREE, sceneConfig = {}) {
  if (!root || !box) {
    return resolveRadiusFromSamples([], 0.34, sceneConfig);
  }

  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const threshold = sceneConfig.pedestalSampleHeight ?? size.y * (sceneConfig.pedestalSampleRatio ?? 0.06);
  const sampleLimit = sceneConfig.pedestalMaxSamples ?? 18000;
  const distances = [];
  const point = new THREE.Vector3();

  root.traverse((child) => {
    if (!child.isMesh || !child.geometry) return;
    const positions = child.geometry.getAttribute("position");
    if (!positions) return;

    const step = Math.max(1, Math.ceil(positions.count / sampleLimit));
    for (let index = 0; index < positions.count; index += step) {
      point.fromBufferAttribute(positions, index).applyMatrix4(child.matrixWorld);
      if (point.y > box.min.y + threshold) continue;
      distances.push(Math.hypot(point.x - center.x, point.z - center.z));
    }
  });

  const fallbackRadius = Math.max(size.x, size.z) * 0.32;
  return resolveRadiusFromSamples(distances, fallbackRadius, sceneConfig, scale);
}

export function createPedestalMesh(THREE, radius, height, sceneConfig = {}) {
  const pedestal = new THREE.Mesh(
    new THREE.CylinderGeometry(radius, radius * 1.08, height, sceneConfig.pedestalSegments ?? 96),
    new THREE.MeshStandardMaterial({
      color: sceneConfig.pedestalColor ?? 0xc9baa7,
      roughness: sceneConfig.pedestalRoughness ?? 0.84,
      metalness: sceneConfig.pedestalMetalness ?? 0.02
    })
  );

  pedestal.position.y = height * 0.5;
  pedestal.castShadow = true;
  pedestal.receiveShadow = true;
  return pedestal;
}
