function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function roundToStep(value, step) {
  return Math.round(value / step) * step;
}

function arrayify(value) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function uniqueStrings(values) {
  const result = [];
  const seen = new Set();

  for (const value of values) {
    const text = String(value || "").trim();
    if (!text) continue;
    const key = text.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(text);
  }

  return result;
}

function pieceText(piece) {
  return [
    piece?.viewerTitle || "",
    piece?.subtitle || "",
    piece?.medium || "",
    piece?.lobbyMeta || "",
    piece?.source?.summary || "",
    piece?.source?.note || ""
  ]
    .join(" ")
    .toLowerCase();
}

function parseDimensionsCm(dimensions = "") {
  const result = {};
  const regex = /\b(H|W|D|L):\s*([\d.]+)\s*cm\b/gi;

  for (const match of dimensions.matchAll(regex)) {
    const key =
      match[1].toUpperCase() === "H" ? "height" :
      match[1].toUpperCase() === "W" ? "width" :
      match[1].toUpperCase() === "D" ? "depth" :
      "length";
    result[key] = Number.parseFloat(match[2]);
  }

  return result;
}

function inferPrintProfile(piece, dims) {
  const text = pieceText(piece);
  const widthLike = dims.width || dims.length || 0;

  if (/\brelief\b|\bstele\b|\bstela\b|\bplaque\b|\bpanel\b|\bslab\b|\btondo\b|\bsarcophagus\b/.test(text)) {
    return "relief";
  }

  if (/\bbust\b|\bhead\b|\bmask\b|\bportrait\b/.test(text)) {
    return "bust";
  }

  if (widthLike && dims.height && widthLike > dims.height * 1.12) {
    return "horizontal";
  }

  if (/\bseated\b|\bmadonna\b|\bmaternity\b|\bmoses\b|\bpieta\b/.test(text)) {
    return "seated";
  }

  return "standing";
}

function chooseStarterHeightMm(profile, heightCm) {
  if (!heightCm) {
    return profile === "bust" ? 130 : 160;
  }

  let heightMm =
    heightCm >= 400 ? 220 :
    heightCm >= 250 ? 190 :
    heightCm >= 150 ? 170 :
    heightCm >= 90 ? 150 :
    130;

  if (profile === "relief") {
    heightMm = Math.min(heightMm, 160);
  }

  if (profile === "horizontal") {
    heightMm = Math.min(heightMm, 170);
  }

  if (profile === "bust") {
    heightMm = Math.min(heightMm, 140);
  }

  return clamp(roundToStep(heightMm, 10), 110, 220);
}

function formatMillimeters(value) {
  return `${Math.round(value)} mm`;
}

function formatStarterPrint(heightMm, scalePercent) {
  if (!heightMm) return "Scale from the listed museum dimensions";
  if (!Number.isFinite(scalePercent)) return `${formatMillimeters(heightMm)} tall`;
  return `${formatMillimeters(heightMm)} tall (${scalePercent.toFixed(scalePercent >= 10 ? 0 : 1)}% of full scale)`;
}

function formatScaledFootprint(dims, scaleRatio, profile) {
  const widthLike = dims.width || dims.length;
  const depthLike = dims.depth || dims.width || dims.length;
  if (!widthLike || !scaleRatio) {
    return profile === "relief" ? "Scale thickness from the source mesh after import" : "Set after mesh import";
  }

  const scaledWidth = widthLike * 10 * scaleRatio;
  const scaledDepth = depthLike ? depthLike * 10 * scaleRatio : null;
  if (!scaledDepth) {
    return formatMillimeters(scaledWidth);
  }
  return `${formatMillimeters(scaledWidth)} × ${formatMillimeters(scaledDepth)}`;
}

function inferMeshAction(piece) {
  if (piece.kind === "stl") {
    return "STL is ready for slicing";
  }
  if (piece.kind === "gltf") {
    return "Convert GLB/GLTF to STL or 3MF before slicing";
  }
  if (piece.kind === "sketchfab") {
    return "Obtain the licensed model export, then convert it to STL or 3MF";
  }
  return "Prepare the mesh in Blender or MeshLab before slicing";
}

function inferWorkflow(profile, piece) {
  if (piece.kind === "sketchfab") {
    return "Check the source record for download and reuse terms first";
  }

  if (profile === "bust") {
    return "Resin gives the cleanest facial detail; FDM works for larger study prints";
  }

  if (profile === "relief") {
    return "FDM works well for wall-style pieces; resin is useful for very shallow surface detail";
  }

  if (profile === "horizontal") {
    return "FDM is usually the easiest starting point for long reclining forms";
  }

  return "FDM is the easiest starting point; resin is good for smaller, high-detail editions";
}

function inferOrientation(profile) {
  if (profile === "relief") {
    return "Orient the flattest back or rear plane on the build plate and add a brim if the contact area is narrow.";
  }

  if (profile === "bust") {
    return "Print from the neck or rear cut with a slight backward tilt if the face projects strongly.";
  }

  if (profile === "horizontal") {
    return "Lay the broadest back or underside on the build plate; split the model if the full footprint becomes unstable.";
  }

  if (profile === "seated") {
    return "Print upright on the seated base or broadest underside so the torso and knees stay correctly aligned.";
  }

  return "Print upright when the base is stable; if not, tilt it back 10-15 degrees and add a brim.";
}

function inferSupportGuidance(profile) {
  if (profile === "relief") {
    return "Use light supports only for projecting rims, hands, or deep carved pockets.";
  }

  if (profile === "bust") {
    return "Add light tree or organic supports under the chin, nose, curls, and any thin locks of hair.";
  }

  if (profile === "horizontal") {
    return "Support the underside of arms, drapery, and any suspended limbs or heads.";
  }

  if (profile === "seated") {
    return "Support forearms, beard or hair undercuts, and any detached folds of drapery.";
  }

  return "Use supports under arms, drapery, detached hands, and any deep undercuts.";
}

function inferSlicerGuidance(profile) {
  if (profile === "relief") {
    return "Start around 0.12-0.16 mm layers with 3 walls and 12-15% infill for a study print.";
  }

  if (profile === "bust") {
    return "Start around 0.1-0.14 mm layers and slow outer walls so facial detail stays crisp.";
  }

  return "Start around 0.12-0.16 mm layers with 3 walls and 10-15% infill for a display study.";
}

function isDownloadableLocalUrl(url) {
  return /^\.{0,2}\//.test(url) || url.startsWith("/");
}

function buildDownloadLinks(piece, override = {}) {
  if (Array.isArray(override.links) && override.links.length) {
    return override.links;
  }

  if (override.downloadUrl) {
    const label = override.downloadLabel || "Download mesh";
    return [{
      label,
      url: override.downloadUrl,
      download: isDownloadableLocalUrl(override.downloadUrl)
    }];
  }

  if (piece.kind === "sketchfab") {
    const recordLink = piece.source?.links?.find((link) => /sketchfab|record/i.test(link.label || "")) || piece.source?.links?.[0];
    return recordLink ? [{ label: "Open source record", url: recordLink.url, external: true }] : [];
  }

  const urls = uniqueStrings(arrayify(piece.model?.primaryUrl || piece.model?.url));
  const directUrls = urls.filter((url) => /\.(stl|glb|gltf)(?:$|\?)/i.test(url));
  const downloadUrls = directUrls.length ? directUrls : urls;

  return downloadUrls.map((url, index) => {
    const extMatch = url.match(/\.([a-z0-9]+)(?:$|\?)/i);
    const ext = extMatch ? extMatch[1].toUpperCase() : "MODEL";
    const label = downloadUrls.length === 1 ? `Download ${ext}` : `Download ${ext} ${index + 1}`;
    return {
      label,
      url,
      download: isDownloadableLocalUrl(url),
      external: !isDownloadableLocalUrl(url)
    };
  });
}

export function buildPrintingInfo(piece = {}) {
  const override = piece.printing || {};
  if (override.enabled === false) return null;

  const dims = parseDimensionsCm(piece.dimensions || "");
  const profile = override.profile || inferPrintProfile(piece, dims);
  const heightCm = override.heightCm || dims.height || 0;
  const starterHeightMm = override.recommendedHeightMm || chooseStarterHeightMm(profile, heightCm);
  const scalePercent = heightCm ? (starterHeightMm / (heightCm * 10)) * 100 : null;
  const downloadLinks = buildDownloadLinks(piece, override);
  const rightsLabel = piece.license || override.licenseLabel || "Check source record";

  const facts = [
    {
      label: "Print source",
      value: override.meshAction || inferMeshAction(piece)
    },
    {
      label: "Starter print",
      value: override.starterPrint || formatStarterPrint(starterHeightMm, scalePercent)
    },
    {
      label: "Scaled footprint",
      value: override.footprint || formatScaledFootprint(dims, heightCm ? starterHeightMm / (heightCm * 10) : null, profile)
    },
    {
      label: "Workflow",
      value: override.workflow || inferWorkflow(profile, piece)
    },
    {
      label: "Rights",
      value: rightsLabel
    }
  ];

  const directions = Array.isArray(override.directions) && override.directions.length
    ? override.directions
    : [
        piece.kind === "stl"
          ? "Download the STL and import it directly into your slicer."
          : piece.kind === "sketchfab"
            ? "Open the linked source record, obtain the licensed mesh export, and convert it to STL or 3MF before slicing."
            : "Download the source model and convert it to STL or 3MF in Blender, MeshLab, or your slicer’s import workflow before slicing.",
        heightCm
          ? `Use the museum dimensions above as the authoritative scale reference and start around ${formatMillimeters(starterHeightMm)} tall.`
          : "Use the listed museum dimensions above as your scale reference before final slicing.",
        override.orientation || inferOrientation(profile),
        override.supports || inferSupportGuidance(profile),
        override.slicer || inferSlicerGuidance(profile)
      ];

  const note = override.note || "The on-page viewer normalizes digital display scale. For printing, rely on the physical dimensions listed above rather than the onscreen size.";

  return {
    title: override.title || "3D Printing Data & Directions",
    facts,
    directions,
    note,
    links: downloadLinks
  };
}
