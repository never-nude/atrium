const PROFILE_PRESETS = {
  cinematic: {
    nodeStep: 1,
    edgeStep: 1,
    faceStep: 1,
    includeSurface: true,
    maxNodes: 1_400_000,
    maxEdgeSegments: 2_100_000,
    maxTriangles: 1_400_000
  },
  gallery: {
    nodeStep: 1,
    edgeStep: 2,
    faceStep: 1,
    includeSurface: true,
    maxNodes: 900_000,
    maxEdgeSegments: 1_200_000,
    maxTriangles: 900_000
  },
  balanced: {
    nodeStep: 2,
    edgeStep: 3,
    faceStep: 2,
    includeSurface: true,
    maxNodes: 420_000,
    maxEdgeSegments: 620_000,
    maxTriangles: 420_000
  },
  performance: {
    nodeStep: 4,
    edgeStep: 6,
    faceStep: 4,
    includeSurface: true,
    maxNodes: 180_000,
    maxEdgeSegments: 280_000,
    maxTriangles: 180_000
  }
};

self.onmessage = async (event) => {
  const { requestId, item, profileName } = event.data || {};

  try {
    if (!item || !item.dataUrl) {
      throw new Error("Missing catalog item data URL.");
    }

    const profile = resolveProfile(profileName, item);
    const payload = await fetchJson(item.dataUrl);
    const model = buildModel(payload, profile);

    const transfers = [];
    collectTransfer(model.surface?.positions, transfers);
    collectTransfer(model.surface?.indices, transfers);
    collectTransfer(model.nodes?.positions, transfers);
    collectTransfer(model.edges?.positions, transfers);

    self.postMessage(
      {
        requestId,
        ok: true,
        model
      },
      transfers
    );
  } catch (error) {
    self.postMessage({
      requestId,
      ok: false,
      error: error instanceof Error ? error.message : String(error)
    });
  }
};

function resolveProfile(profileName, item) {
  if (profileName && profileName !== "auto" && PROFILE_PRESETS[profileName]) {
    return { ...PROFILE_PRESETS[profileName], name: profileName };
  }

  const sourceTriangles = Number(item.sourceTriangleCount || item.triangleCount || 0);
  if (sourceTriangles > 1_500_000) {
    return { ...PROFILE_PRESETS.performance, name: "performance" };
  }
  if (sourceTriangles > 800_000) {
    return { ...PROFILE_PRESETS.balanced, name: "balanced" };
  }
  if (sourceTriangles > 350_000) {
    return { ...PROFILE_PRESETS.gallery, name: "gallery" };
  }
  return { ...PROFILE_PRESETS.cinematic, name: "cinematic" };
}

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to load model data from ${url} (${response.status}).`);
  }
  return response.json();
}

function buildModel(payload, profile) {
  if (Array.isArray(payload.positions)) {
    return buildTriMeshModel(payload, profile);
  }

  if (Array.isArray(payload.faces) || Array.isArray(payload.nodes) || Array.isArray(payload.vertices)) {
    return buildNodeFaceModel(payload, profile);
  }

  throw new Error("Unsupported dataset format. Expected positions/indices or vertices/faces/nodes.");
}

function buildTriMeshModel(payload, profile) {
  const positions = Float32Array.from(payload.positions);
  const indexSource = Array.isArray(payload.indices) ? payload.indices : [];
  const indices = Uint32Array.from(indexSource);

  const sourceVertexCount = Math.floor(positions.length / 3);
  const sourceTriangleCount = Math.floor(indices.length / 3);

  const nodeStep = applyBudget(sourceVertexCount, profile.nodeStep, profile.maxNodes);
  const faceStep = applyBudget(sourceTriangleCount, profile.faceStep, profile.maxTriangles);

  const sampledNodes = sampleFlatVec3(positions, nodeStep);
  const sampledFaces = sampleFlatTriples(indices, faceStep);
  const edgeBuild = buildEdgesFromTriangles(positions, indices, profile.edgeStep, profile.maxEdgeSegments);

  return {
    type: "tri_mesh",
    profileName: profile.name,
    surface: profile.includeSurface
      ? {
          positions,
          indices: sampledFaces
        }
      : null,
    nodes: {
      positions: sampledNodes
    },
    edges: {
      positions: edgeBuild.positions
    },
    stats: {
      sourceVertices: sourceVertexCount,
      sourceTriangles: sourceTriangleCount,
      renderedNodes: Math.floor(sampledNodes.length / 3),
      renderedTriangles: Math.floor(sampledFaces.length / 3),
      renderedEdgeSegments: Math.floor(edgeBuild.positions.length / 6),
      nodeStep,
      faceStep,
      edgeStep: edgeBuild.edgeStep
    }
  };
}

function buildNodeFaceModel(payload, profile) {
  const verticesFlat = Array.isArray(payload.vertices) ? flattenVec3(payload.vertices) : null;
  const nodesFlat = Array.isArray(payload.nodes)
    ? flattenVec3(payload.nodes)
    : verticesFlat
      ? verticesFlat.slice(0)
      : null;

  if (!nodesFlat && !verticesFlat) {
    throw new Error("Model must provide vertices or nodes.");
  }

  const sourceNodes = Math.floor((nodesFlat || verticesFlat).length / 3);
  const nodeStep = applyBudget(sourceNodes, profile.nodeStep, profile.maxNodes);
  const sampledNodes = sampleFlatVec3(nodesFlat || verticesFlat, nodeStep);

  const faceSource = Array.isArray(payload.faces) ? flattenTriples(payload.faces) : new Uint32Array(0);
  const sourceTriangles = Math.floor(faceSource.length / 3);
  const faceStep = applyBudget(sourceTriangles, profile.faceStep, profile.maxTriangles);
  const sampledFaces = sampleFlatTriples(faceSource, faceStep);

  const edges = Array.isArray(payload.edges) ? payload.edges : [];
  const edgePosSource = chooseEdgePositionSource(edges, nodesFlat, verticesFlat);
  const edgeBuild = buildEdgesFromNodeGraph(edgePosSource, edges, profile.edgeStep, profile.maxEdgeSegments);

  return {
    type: "node_face",
    profileName: profile.name,
    surface: profile.includeSurface && verticesFlat && sampledFaces.length > 0
      ? {
          positions: verticesFlat,
          indices: sampledFaces
        }
      : null,
    nodes: {
      positions: sampledNodes
    },
    edges: {
      positions: edgeBuild.positions
    },
    stats: {
      sourceVertices: verticesFlat ? Math.floor(verticesFlat.length / 3) : sourceNodes,
      sourceTriangles,
      renderedNodes: Math.floor(sampledNodes.length / 3),
      renderedTriangles: Math.floor(sampledFaces.length / 3),
      renderedEdgeSegments: Math.floor(edgeBuild.positions.length / 6),
      nodeStep,
      faceStep,
      edgeStep: edgeBuild.edgeStep
    }
  };
}

function chooseEdgePositionSource(edges, nodesFlat, verticesFlat) {
  if (!verticesFlat) {
    return nodesFlat;
  }
  if (!nodesFlat || edges.length === 0) {
    return verticesFlat;
  }

  const nodeCount = Math.floor(nodesFlat.length / 3);
  const vertexCount = Math.floor(verticesFlat.length / 3);

  let requiresVertices = false;
  const sampleCount = Math.min(edges.length, 1500);

  for (let i = 0; i < sampleCount; i += 1) {
    const edge = edges[i];
    if (!Array.isArray(edge) || edge.length < 2) {
      continue;
    }
    const a = edge[0] | 0;
    const b = edge[1] | 0;
    if ((a >= nodeCount || b >= nodeCount) && a < vertexCount && b < vertexCount) {
      requiresVertices = true;
      break;
    }
  }

  return requiresVertices ? verticesFlat : nodesFlat;
}

function buildEdgesFromTriangles(positions, indices, requestedStep, maxEdgeSegments) {
  const triangleCount = Math.floor(indices.length / 3);
  const requestedSegments = triangleCount * 3;
  const edgeStep = applyBudget(requestedSegments, requestedStep, maxEdgeSegments);
  const effectiveTriangleStep = Math.max(1, edgeStep);
  const sampledTriangleCount = Math.ceil(triangleCount / effectiveTriangleStep);
  const output = new Float32Array(sampledTriangleCount * 18);

  let offset = 0;
  for (let tri = 0; tri < triangleCount; tri += effectiveTriangleStep) {
    const base = tri * 3;
    const a = indices[base];
    const b = indices[base + 1];
    const c = indices[base + 2];

    offset = writeSegment(output, offset, positions, a, b);
    offset = writeSegment(output, offset, positions, b, c);
    offset = writeSegment(output, offset, positions, c, a);
  }

  return {
    edgeStep: effectiveTriangleStep,
    positions: offset === output.length ? output : output.slice(0, offset)
  };
}

function buildEdgesFromNodeGraph(positionSource, edges, requestedStep, maxEdgeSegments) {
  if (!positionSource || edges.length === 0) {
    return { edgeStep: 1, positions: new Float32Array(0) };
  }

  const edgeStep = applyBudget(edges.length, requestedStep, maxEdgeSegments);
  const outCount = Math.ceil(edges.length / edgeStep);
  const output = new Float32Array(outCount * 6);

  let offset = 0;
  for (let i = 0; i < edges.length; i += edgeStep) {
    const edge = edges[i];
    if (!Array.isArray(edge) || edge.length < 2) {
      continue;
    }

    const a = edge[0] | 0;
    const b = edge[1] | 0;
    offset = writeSegment(output, offset, positionSource, a, b);
  }

  return {
    edgeStep,
    positions: offset === output.length ? output : output.slice(0, offset)
  };
}

function writeSegment(output, offset, positions, aIndex, bIndex) {
  const maxIndex = Math.floor(positions.length / 3) - 1;
  if (aIndex < 0 || bIndex < 0 || aIndex > maxIndex || bIndex > maxIndex) {
    return offset;
  }

  const a = aIndex * 3;
  const b = bIndex * 3;

  output[offset] = positions[a];
  output[offset + 1] = positions[a + 1];
  output[offset + 2] = positions[a + 2];
  output[offset + 3] = positions[b];
  output[offset + 4] = positions[b + 1];
  output[offset + 5] = positions[b + 2];

  return offset + 6;
}

function sampleFlatVec3(source, step) {
  if (!source || source.length === 0) {
    return new Float32Array(0);
  }

  const safeStep = Math.max(1, step | 0);
  if (safeStep === 1) {
    return source.slice(0);
  }

  const total = Math.floor(source.length / 3);
  const outCount = Math.ceil(total / safeStep);
  const output = new Float32Array(outCount * 3);

  let outOffset = 0;
  for (let i = 0; i < total; i += safeStep) {
    const base = i * 3;
    output[outOffset] = source[base];
    output[outOffset + 1] = source[base + 1];
    output[outOffset + 2] = source[base + 2];
    outOffset += 3;
  }

  return output;
}

function sampleFlatTriples(source, step) {
  if (!source || source.length === 0) {
    return new Uint32Array(0);
  }

  const safeStep = Math.max(1, step | 0);
  if (safeStep === 1) {
    return source.slice(0);
  }

  const tripleCount = Math.floor(source.length / 3);
  const outCount = Math.ceil(tripleCount / safeStep);
  const output = new Uint32Array(outCount * 3);

  let outOffset = 0;
  for (let i = 0; i < tripleCount; i += safeStep) {
    const base = i * 3;
    output[outOffset] = source[base];
    output[outOffset + 1] = source[base + 1];
    output[outOffset + 2] = source[base + 2];
    outOffset += 3;
  }

  return output;
}

function flattenVec3(items) {
  const output = new Float32Array(items.length * 3);
  for (let i = 0; i < items.length; i += 1) {
    const item = items[i] || [0, 0, 0];
    const base = i * 3;
    output[base] = Number(item[0] || 0);
    output[base + 1] = Number(item[1] || 0);
    output[base + 2] = Number(item[2] || 0);
  }
  return output;
}

function flattenTriples(items) {
  const output = new Uint32Array(items.length * 3);
  for (let i = 0; i < items.length; i += 1) {
    const item = items[i] || [0, 0, 0];
    const base = i * 3;
    output[base] = Number(item[0] || 0);
    output[base + 1] = Number(item[1] || 0);
    output[base + 2] = Number(item[2] || 0);
  }
  return output;
}

function applyBudget(totalCount, requestedStep, maxCount) {
  if (!Number.isFinite(totalCount) || totalCount <= 0) {
    return Math.max(1, requestedStep | 0);
  }

  const minStep = Math.max(1, requestedStep | 0);
  if (!Number.isFinite(maxCount) || maxCount <= 0) {
    return minStep;
  }

  const budgetStep = Math.ceil(totalCount / maxCount);
  return Math.max(minStep, budgetStep, 1);
}

function collectTransfer(typedArray, transfers) {
  if (typedArray && typedArray.buffer instanceof ArrayBuffer) {
    transfers.push(typedArray.buffer);
  }
}
