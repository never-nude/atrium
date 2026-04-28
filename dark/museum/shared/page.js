const MODULE_VERSION = "20260330-0038";
const DARK_ROOT = "/dark/";

let catalogPromise = null;
let themePromise = null;
let printingPromise = null;
const COLLECTION_DESCRIPTION = "Form Gallery is a digital sculpture collection spanning antiquity through the twenty-first century. Browse by gallery, era, region, or maker.";

function loadThemeModule() {
  if (!themePromise) {
    themePromise = import(`./theme.js?v=${MODULE_VERSION}`);
  }
  return themePromise;
}

function loadPrintingModule() {
  if (!printingPromise) {
    printingPromise = import(`./printing.js?v=${MODULE_VERSION}`);
  }
  return printingPromise;
}

const MEDIUM_BY_PIECE = Object.freeze({
  sphinx: "Limestone",
  "ashurnasirpal-lion-hunt": "Alabaster relief",
  "lion-released-from-cage": "Alabaster relief",
  "goryeo-avalokiteshvara": "Carved wood with applied jewelry",
  "sapi-portuguese-hunting-horn": "Ivory, metal",
  "loango-ivory-tusk-female-finial": "Ivory, wood",
  "loango-ivory-tusk-seated-european-finial": "Ivory, wood",
  "loango-ivory-tusk-trade-scenes": "Ivory",
  "kongo-maternity-figure": "Wood, glass, glass beads, brass tacks, pigment",
  "charioteer-of-delphi": "Bronze",
  "venus-de-milo": "Marble",
  discobolus: "Marble copy",
  "artemision-bronze": "Bronze",
  "athena-lemnia": "Bronze type (reconstruction)",
  germanicus: "Marble",
  "belvedere-torso": "Marble",
  "apollo-belvedere": "Marble copy",
  "dying-gaul": "Marble copy",
  "ludovisi-gaul": "Marble group",
  "capitoline-venus": "Marble copy",
  laocoon: "Marble group",
  "augustus-of-prima-porta": "Marble",
  "donatello-saint-george": "Marble",
  "michelangelo-battle-of-the-centaurs": "Marble relief",
  "michelangelo-bacchus": "Marble",
  "michelangelo-pieta": "Marble",
  "michelangelo-david": "Marble",
  "michelangelo-bruges-madonna": "Marble",
  "michelangelo-tondo-pitti": "Marble relief",
  "michelangelo-tondo-taddei": "Marble relief",
  "michelangelo-moses": "Marble",
  "michelangelo-dying-slave": "Marble",
  "michelangelo-rebellious-slave": "Marble",
  "michelangelo-prisoner": "Marble",
  "michelangelo-medici-madonna": "Marble",
  "michelangelo-dawn": "Marble",
  "michelangelo-dusk": "Marble",
  "michelangelo-night": "Marble",
  "michelangelo-day": "Marble",
  "michelangelo-giuliano-duke-of-nemours": "Marble",
  "michelangelo-lorenzo-duke-of-urbino": "Marble",
  "michelangelo-brutus": "Marble",
  "michelangelo-rondanini-pieta": "Marble",
  "bouchardon-cupid": "Marble",
  "rodin-the-thinker": "Bronze",
  "donatello-david-bronze": "Bronze",
  "benedetto-da-maiano-john-the-baptist-as-a-boy": "Marble",
  "rodin-walking-man": "Bronze",
  "rodin-danaid": "Terracotta",
  "lorenzi-portrait-of-michelangelo": "Marble bust",
  "michelangelo-risen-christ": "Marble",
  "michelangelo-apollo": "Marble",
  "barberini-faun": "Marble",
  "apollo-lykeios": "Marble copy",
  "the-wrestlers": "Marble group"
});

const DIMENSIONS_BY_PIECE = Object.freeze({
  sphinx: "H: 2000 cm | L: 7300 cm",
  "ashurnasirpal-lion-hunt": "H: 90 cm | W: 224 cm",
  "lion-released-from-cage": "H: 57.5 cm | W: 114 cm",
  "goryeo-avalokiteshvara": "H: 67.65 cm",
  "sapi-portuguese-hunting-horn": "H: 64.2 cm | W: 16.4 cm | D: 9 cm",
  "loango-ivory-tusk-female-finial": "H: 34.4 cm | W: 13.5 cm | D: 13.5 cm",
  "loango-ivory-tusk-seated-european-finial": "H: 32.8 cm | W: 13.6 cm | D: 13.5 cm",
  "loango-ivory-tusk-trade-scenes": "H: 73.3 cm | W: 6.4 cm | D: 6.4 cm",
  "kongo-maternity-figure": "H: 25.7 cm | W: 10.5 cm | D: 10.2 cm",
  "venus-de-milo": "H: 204 cm",
  discobolus: "H: 170 cm | W: 115 cm | D: 50 cm",
  "artemision-bronze": "H: 201 cm | W: 214 cm | D: 43 cm",
  "athena-lemnia": "H: 208 cm | W: 81.5 cm | D: 50 cm",
  germanicus: "H: 192 cm | W: 80.5 cm | D: 54 cm",
  "belvedere-torso": "H: 122 cm | W: 79 cm | D: 90 cm",
  "apollo-belvedere": "H: 232 cm | W: 103 cm | D: 126 cm",
  "dying-gaul": "H: 96 cm | W: 185 cm | D: 89 cm",
  "ludovisi-gaul": "H: 229 cm | W: 168 cm | D: 112.5 cm",
  "capitoline-venus": "H: 188.5 cm | W: 62 cm",
  laocoon: "H: 242 cm | W: 162.5 cm | D: 103 cm",
  "augustus-of-prima-porta": "H: 217 cm",
  "donatello-saint-george": "H: 219 cm | W: 78.5 cm | D: 55 cm",
  "michelangelo-battle-of-the-centaurs": "H: 80 cm | W: 89 cm",
  "michelangelo-bacchus": "H: 208 cm | W: 76.5 cm | D: 59 cm",
  "michelangelo-pieta": "H: 176 cm | W: 170 cm | D: 89 cm",
  "michelangelo-david": "H: 517 cm",
  "michelangelo-bruges-madonna": "H: 129 cm | W: 60 cm | D: 71 cm",
  "michelangelo-tondo-pitti": "H: 89 cm | W: 83 cm",
  "michelangelo-tondo-taddei": "H: 105 cm | W: 104 cm",
  "michelangelo-moses": "H: 249 cm | W: 110 cm | D: 107 cm",
  "michelangelo-dying-slave": "H: 228 cm | W: 74 cm | D: 58 cm",
  "michelangelo-rebellious-slave": "H: 213 cm | W: 82.5 cm | D: 51.5 cm",
  "michelangelo-prisoner": "H: 256 cm | W: 73 cm | D: 93 cm",
  "michelangelo-medici-madonna": "H: 225 cm | W: 104.5 cm | D: 104 cm",
  "michelangelo-dawn": "H: 150 cm | W: 240 cm | D: 97 cm",
  "michelangelo-dusk": "H: 147.5 cm | W: 212 cm | D: 86 cm",
  "michelangelo-night": "H: 150 cm | W: 206 cm | D: 105 cm",
  "michelangelo-day": "H: 120 cm | W: 200 cm | D: 75 cm",
  "michelangelo-giuliano-duke-of-nemours": "H: 182 cm | W: 89 cm | D: 100 cm",
  "michelangelo-lorenzo-duke-of-urbino": "H: 187 cm | W: 76 cm | D: 94 cm",
  "michelangelo-brutus": "H: 105 cm | W: 71 cm | D: 43 cm",
  "michelangelo-rondanini-pieta": "H: 190 cm | W: 70 cm | D: 86 cm",
  "bouchardon-cupid": "H: 173 cm | W: 75 cm | D: 75 cm",
  "rodin-the-thinker": "H: 189 cm | W: 98 cm | D: 140 cm",
  "donatello-david-bronze": "H: 160 cm | W: 68 cm | D: 61 cm",
  "benedetto-da-maiano-john-the-baptist-as-a-boy": "H: 144 cm | W: 47 cm | D: 35 cm",
  "rodin-walking-man": "H: 214 cm | W: 70 cm | D: 164 cm",
  "rodin-danaid": "H: 20.2 cm | W: 36.5 cm | D: 27.5 cm",
  "lorenzi-portrait-of-michelangelo": "H: 43 cm | W: 25 cm | D: 28 cm",
  "michelangelo-risen-christ": "H: 251 cm | W: 74 cm | D: 82.5 cm",
  "michelangelo-apollo": "H: 149 cm | W: 56.5 cm | D: 59 cm",
  "barberini-faun": "H: 216 cm | W: 148 cm | D: 126 cm",
  "apollo-lykeios": "H: 231.5 cm | W: 90 cm | D: 72 cm",
  "the-wrestlers": "H: 95.5 cm | W: 117 cm | D: 70 cm"
});

function simplifyCatalogTitle(value = "") {
  return value.replace(/\s*\([^)]*\)\s*$/, "").trim() || value.trim();
}

function parseMakerFields(subtitle = "") {
  const trimmed = String(subtitle || "").trim();
  if (!trimmed) {
    return {
      maker: "",
      maker_lifespan: "",
      workshop_or_attribution: ""
    };
  }

  const hasMakerPrefix =
    /^Artist:\s*/i.test(trimmed) ||
    /^Traditional attribution:\s*/i.test(trimmed) ||
    /^Attributed to\s*/i.test(trimmed);

  if (!hasMakerPrefix) {
    return {
      maker: "",
      maker_lifespan: "",
      workshop_or_attribution: ""
    };
  }

  const cleaned = trimmed
    .replace(/^Artist:\s*/i, "")
    .replace(/^Traditional attribution:\s*/i, "")
    .replace(/^Attributed to\s*/i, "")
    .trim();
  const primary = cleaned.split(";")[0].trim();
  const workshop_or_attribution = /attributed|attribution|workshop|unknown|after\b/i.test(cleaned) ? cleaned : "";
  const lifespanMatch = primary.match(/^(.*?)(?:\s*\(([^)]*\d[^)]*)\))$/);
  const maker = (lifespanMatch ? lifespanMatch[1] : primary)
    .replace(/^(Attributed to|Traditional attribution:)\s*/i, "")
    .trim();
  const maker_lifespan = lifespanMatch ? lifespanMatch[2].trim() : "";

  return {
    maker,
    maker_lifespan,
    workshop_or_attribution
  };
}

function parseYearBoundsFromText(text = "") {
  const value = String(text || "");

  let match = value.match(/(\d{1,4})\s*[-–]\s*(\d{1,4})\s*(BCE|CE)/i);
  if (match) {
    const start = Number.parseInt(match[1], 10);
    const end = Number.parseInt(match[2], 10);
    const isBce = match[3].toUpperCase() === "BCE";
    return {
      start_year: isBce ? -start : start,
      end_year: isBce ? -end : end
    };
  }

  match = value.match(/(?:c\.\s*)?(\d{1,4})\s*(BCE|CE)/i);
  if (match) {
    const year = Number.parseInt(match[1], 10);
    const isBce = match[2].toUpperCase() === "BCE";
    return {
      start_year: isBce ? -year : year,
      end_year: isBce ? -year : year
    };
  }

  match = value.match(/\b(1[0-9]{3}|20[0-9]{2})\s*[-–]\s*(1[0-9]{3}|20[0-9]{2})\b/);
  if (match) {
    return {
      start_year: Number.parseInt(match[1], 10),
      end_year: Number.parseInt(match[2], 10)
    };
  }

  match = value.match(/\b(1[0-9]{3}|20[0-9]{2})\b/);
  if (match) {
    const year = Number.parseInt(match[1], 10);
    return {
      start_year: year,
      end_year: year
    };
  }

  return {
    start_year: null,
    end_year: null
  };
}

function normalizeLocationFields(piece) {
  const value = piece.location || "";
  const label = String(piece.locationLabel || "").trim().toLowerCase();

  if (!value) {
    return {
      current_location: "",
      findspot_or_origin: ""
    };
  }

  if (label.startsWith("collection") || label.startsWith("current location")) {
    return {
      current_location: value,
      findspot_or_origin: ""
    };
  }

  if (
    label.startsWith("findspot") ||
    label.startsWith("origin") ||
    label.startsWith("place") ||
    label.startsWith("place made")
  ) {
    return {
      current_location: "",
      findspot_or_origin: value
    };
  }

  return {
    current_location: "",
    findspot_or_origin: ""
  };
}

function inferLicense(piece) {
  const text = [
    piece.license || "",
    piece.source?.summary || "",
    piece.source?.note || "",
    piece.lobbyMeta || ""
  ].join(" ");

  const patterns = [
    "CC BY-NC-SA 4.0",
    "CC BY-NC-SA",
    "CC BY-NC 4.0",
    "CC BY-NC",
    "CC BY-SA 4.0",
    "CC BY-SA",
    "CC BY-ND 4.0",
    "CC BY-ND",
    "CC BY 4.0",
    "CC BY",
    "CC0"
  ];

  for (const pattern of patterns) {
    if (new RegExp(pattern.replace(/\s+/g, "\\s+"), "i").test(text)) {
      return pattern;
    }
  }

  return "";
}

function inferMeshFormat(piece) {
  if (piece.mesh_format) return piece.mesh_format;
  if (piece.kind === "sketchfab") return "Sketchfab";
  const primary = String(piece.model?.primaryUrl || "").toLowerCase();
  if (primary.endsWith(".glb")) return "GLB";
  if (primary.endsWith(".gltf")) return "GLTF";
  if (primary.endsWith(".stl") || piece.kind === "stl") return "STL";
  if (piece.kind === "gltf") return "GLTF";
  return "";
}

function uniqueTags(values) {
  const result = [];
  const seen = new Set();
  for (const value of values) {
    const normalized = String(value || "").trim();
    if (!normalized) continue;
    const key = normalized.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(normalized);
  }
  return result;
}

function inferMediumFromText(piece) {
  const text = [
    piece?.viewerTitle || "",
    piece?.subtitle || "",
    piece?.lobbyMeta || "",
    piece?.source?.summary || "",
    piece?.source?.note || ""
  ]
    .join(" ")
    .toLowerCase();

  if (/\balabaster relief\b/.test(text)) return "Alabaster relief";
  if (/\bterracotta\b/.test(text)) return "Terracotta";
  if (/\bivory, wood\b/.test(text)) return "Ivory, wood";
  if (/\bivory\b/.test(text)) return "Ivory";
  if (/wood[, ]+glass|glass beads|brass tacks/.test(text)) return "Wood, glass, glass beads, brass tacks, pigment";
  if (/\bbronze\b/.test(text) && !/plaster/.test(text)) return "Bronze";
  if (/\blimestone\b/.test(text)) return "Limestone";
  if (/\bmarble\b/.test(text)) return "Marble";
  if (/\bplaster cast\b/.test(text)) return "Plaster cast";
  return "";
}

function enrichPieceMetadata(pieceId, piece, sectionMeta = {}) {
  if (!piece) return piece;
  const medium = piece.medium || MEDIUM_BY_PIECE[pieceId] || inferMediumFromText(piece);
  const dimensions = piece.dimensions || DIMENSIONS_BY_PIECE[pieceId] || "";
  const makerFields = parseMakerFields(piece.subtitle || "");
  const yearFields = parseYearBoundsFromText(piece.viewerTitle || "");
  const locationFields = normalizeLocationFields(piece);
  const title = piece.title || simplifyCatalogTitle(piece.lobbyTitle || piece.viewerTitle || "");
  const maker = piece.maker || makerFields.maker;
  const maker_lifespan = piece.maker_lifespan || makerFields.maker_lifespan;
  const workshop_or_attribution = piece.workshop_or_attribution || makerFields.workshop_or_attribution;
  const region = piece.region || sectionMeta.regionLabel || "";
  const period = piece.period || sectionMeta.spineTitle || sectionMeta.title || "";
  const gallery = piece.gallery || sectionMeta.title || "";
  const current_location = piece.current_location || locationFields.current_location;
  const findspot_or_origin = piece.findspot_or_origin || locationFields.findspot_or_origin;
  const scan_source = piece.scan_source || piece.lobbyMeta || "";
  const license = piece.license || inferLicense(piece);
  const mesh_format = inferMeshFormat(piece);
  const enriched = { ...piece };

  enriched.title = title;
  enriched.maker = maker;
  enriched.maker_lifespan = maker_lifespan;
  enriched.workshop_or_attribution = workshop_or_attribution;
  enriched.culture = piece.culture || "";
  enriched.region = region;
  enriched.period = period;
  enriched.start_year = piece.start_year ?? yearFields.start_year;
  enriched.end_year = piece.end_year ?? yearFields.end_year;
  enriched.current_location = current_location;
  enriched.findspot_or_origin = findspot_or_origin;
  enriched.scan_source = scan_source;
  enriched.license = license;
  enriched.mesh_format = mesh_format;
  enriched.gallery = gallery;

  if (medium) {
    enriched.medium = medium;
  }
  if (dimensions) {
    enriched.dimensions = dimensions;
  }
  enriched.tags = Array.isArray(piece.tags) && piece.tags.length
    ? piece.tags
    : uniqueTags([
        gallery,
        period,
        region,
        maker,
        enriched.medium,
        mesh_format
      ]);
  return enriched;
}

function buildMergedCatalog(base, extension) {
  const museumChronology = base.museumChronology || [];
  const museumSections = base.museumSections || [];
  const sectionMetaById = new Map(museumSections.map((section) => [section.id, section]));
  const museumPieces = Object.fromEntries(
    Object.entries({
      ...(base.museumPieces || {}),
      ...(extension.museumPiecesExtension || {})
    }).map(([pieceId, piece]) => [pieceId, enrichPieceMetadata(pieceId, piece, sectionMetaById.get(piece.sectionId))])
  );

  const sections = museumSections
    .map((section) => ({
      id: section.id,
      title: section.title,
      subtitle: section.subtitle,
      regionLabel: section.regionLabel || "",
      spineId: section.spineId || "",
      spineTitle: section.spineTitle || "",
      items: Object.entries(museumPieces)
        .filter(([, piece]) => piece.sectionId === section.id && !piece.hiddenFromLobby)
        .sort(([, a], [, b]) => {
          if (a.sortOrder !== b.sortOrder) {
            return a.sortOrder - b.sortOrder;
          }
          return (a.viewerTitle || "").localeCompare(b.viewerTitle || "");
        })
        .map(([pieceId]) => pieceId)
    }))
    .filter((section) => section.items.length > 0);
  const sectionsById = new Map(sections.map((section) => [section.id, section]));
  const sectionGroups = museumChronology
    .map((group) => ({
      id: group.id,
      title: group.title,
      sectionIds: group.sectionIds || [],
      sections: (group.sectionIds || []).map((sectionId) => sectionsById.get(sectionId)).filter(Boolean)
    }))
    .filter((group) => group.sections.length > 0);

  return {
    ...base,
    museumChronology,
    museumSections,
    museumPieces,
    museumLobby: {
      ...(base.museumLobby || {}),
      sections,
      sectionGroups
    },
    museumRouteMap: Object.fromEntries(
      Object.entries(museumPieces).flatMap(([pieceId, piece]) => routeEntriesForPath(piece.path, pieceId))
    )
  };
}

function loadCatalog() {
  if (!catalogPromise) {
    catalogPromise = Promise.all([
      import(`./catalog.js?v=${MODULE_VERSION}`),
      import(`./catalog-overlay.js?v=${MODULE_VERSION}`).catch(() => ({}))
    ]).then(([base, extension]) => buildMergedCatalog(base, extension));
  }
  return catalogPromise;
}

function normalizePath(pathname) {
  if (!pathname) return "/";
  if (pathname.endsWith(".html")) return pathname;
  return pathname.endsWith("/") ? pathname : `${pathname}/`;
}

function routeEntriesForPath(pathname, pieceId) {
  const normalized = normalizePath(pathname);
  if (pathname && pathname.endsWith("/index.html")) {
    return [
      [normalized, pieceId],
      [normalizePath(pathname.slice(0, -"index.html".length)), pieceId]
    ];
  }
  if (pathname && pathname.endsWith("/")) {
    return [
      [normalized, pieceId],
      [`${pathname}index.html`, pieceId]
    ];
  }
  return [[normalized, pieceId]];
}

function isDarkMount(pathname = window.location.pathname) {
  const normalized = normalizePath(pathname);
  return normalized === DARK_ROOT || normalized === `${DARK_ROOT}index.html`;
}

function buildDarkPieceHref(pieceId) {
  return `${DARK_ROOT}?piece=${encodeURIComponent(pieceId)}`;
}

function resolveUrlValue(basePath, value) {
  if (Array.isArray(value)) {
    return value.map((item) => resolveUrlValue(basePath, item));
  }

  if (typeof value !== "string" || !value) {
    return value;
  }

  if (
    value.startsWith("/") ||
    value.startsWith("data:") ||
    value.startsWith("blob:") ||
    /^(?:[a-z]+:)?\/\//i.test(value)
  ) {
    return value;
  }

  try {
    const resolved = new URL(value, new URL(basePath || "/", window.location.origin));
    return `${resolved.pathname}${resolved.search}${resolved.hash}`;
  } catch {
    return value;
  }
}

function prepareDarkPiece(pieceId, piece) {
  const model = piece.model
    ? {
        ...piece.model,
        url: resolveUrlValue(piece.path, piece.model.url),
        primaryUrl: resolveUrlValue(piece.path, piece.model.primaryUrl),
        fallbackUrl: resolveUrlValue(piece.path, piece.model.fallbackUrl)
      }
    : piece.model;

  return {
    ...piece,
    darkHref: buildDarkPieceHref(pieceId),
    atriumHref: DARK_ROOT,
    model
  };
}

function renderBootError(message, error) {
  console.error(error);
  const atriumHref = isDarkMount(window.location.pathname) ? DARK_ROOT : "/museum/";
  document.body.innerHTML = `
    <a class="skip-link" href="#system-state">Skip to message</a>
    <main class="system-state" id="system-state">
      <section class="system-state-card" role="alert">
        <p class="system-state-kicker">Form Gallery</p>
        <h1 class="system-state-title">${escapeHtml(message)}</h1>
        <p class="system-state-copy">The page shell loaded, but this view could not be prepared. Refresh the page or return to the atrium and try again.</p>
        <a class="explore-button" href="${atriumHref}">Return to Atrium</a>
      </section>
    </main>
  `;
}

function upsertMetaTag(key, value, attribute = "name") {
  let tag = document.head.querySelector(`meta[${attribute}="${key}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attribute, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", value);
}

function setPageMetadata({ title, description }) {
  if (title) {
    document.title = title;
    upsertMetaTag("og:title", title, "property");
    upsertMetaTag("twitter:title", title);
  }

  if (description) {
    upsertMetaTag("description", description);
    upsertMetaTag("og:description", description, "property");
    upsertMetaTag("twitter:description", description);
  }
}

function simplifyWorkTitle(value = "") {
  return value.replace(/\s*\([^)]*\)\s*$/, "").trim() || value.trim();
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function cleanMetadataText(value = "") {
  return value.replace(/^Artist:\s*/i, "").replace(/\s+/g, " ").trim();
}

function buildPiecePageDescription(piece) {
  const title = cleanMetadataText(piece.viewerTitle || "");
  const artist = cleanMetadataText(piece.subtitle || "");
  const medium = cleanMetadataText(piece.medium || "");
  const segments = [title];

  if (artist) {
    segments.push(artist);
  }

  if (medium) {
    segments.push(medium);
  }

  segments.push("Viewable in Form Gallery, a digital sculpture collection spanning antiquity through the twenty-first century.");
  return segments.join(". ").replace(/\.\s*$/, "") + ".";
}

export async function initMuseumLobbyPage(options = {}) {
  try {
    const [{ museumLobby, museumPieces }, { renderMuseumLobby }] = await Promise.all([
      loadCatalog(),
      import(`./lobby.js?v=${MODULE_VERSION}`)
    ]);
    const darkMount = Boolean(options.darkMount);
    const preparedPieces = darkMount
      ? Object.fromEntries(
          Object.entries(museumPieces).map(([pieceId, piece]) => [
            pieceId,
            {
              ...piece,
              darkHref: buildDarkPieceHref(pieceId)
            }
          ])
        )
      : museumPieces;
    const lobbyConfig = {
      ...museumLobby,
      title: darkMount ? "Dark Room" : museumLobby.title || "Atrium",
      pageTitle: darkMount ? "Dark Room — Form Gallery" : "Atrium — Form Gallery",
      tourHref: darkMount ? "" : museumLobby.tourHref
    };
    document.body.dataset.atriumHref = darkMount ? DARK_ROOT : "/museum/";
    renderMuseumLobby(lobbyConfig, preparedPieces);
    setPageMetadata({
      title: lobbyConfig.pageTitle,
      description: COLLECTION_DESCRIPTION
    });
  } catch (error) {
    renderBootError("Failed to load the museum lobby.", error);
  }
}

export async function initMuseumPiecePage(pieceId, options = {}) {
  const { museumPieces } = await loadCatalog();
  const piece = museumPieces[pieceId];
  if (!piece) {
    renderBootError(`Unknown museum piece: ${pieceId}`, new Error(`Unknown museum piece: ${pieceId}`));
    return;
  }

  try {
    const darkMount = Boolean(options.darkMount);
    const preparedPiece = darkMount ? prepareDarkPiece(pieceId, piece) : piece;
    const { buildPrintingInfo } = await loadPrintingModule();
    const pagePiece = {
      ...preparedPiece,
      printing: buildPrintingInfo(preparedPiece),
      pageTitle: darkMount
        ? `${simplifyWorkTitle(preparedPiece.viewerTitle)} — Dark Room — Form Gallery`
        : `${simplifyWorkTitle(preparedPiece.viewerTitle)} — Form Gallery`
    };
    document.body.dataset.atriumHref = pagePiece.atriumHref || "/museum/";

    setPageMetadata({
      title: pagePiece.pageTitle,
      description: buildPiecePageDescription(pagePiece)
    });

    if (pagePiece.kind === "stl") {
      const { initStlMuseumPage } = await import(`./stl-viewer.js?v=${MODULE_VERSION}`);
      await initStlMuseumPage(pagePiece);
      return;
    }

    if (pagePiece.kind === "sketchfab") {
      const { initSketchfabMuseumPage } = await import(`./sketchfab-viewer.js?v=${MODULE_VERSION}`);
      await initSketchfabMuseumPage(pagePiece);
      return;
    }

    if (pagePiece.kind === "gltf") {
      const { initGltfMuseumPage } = await import(`./gltf-viewer.js?v=${MODULE_VERSION}`);
      await initGltfMuseumPage(pagePiece);
      return;
    }

    throw new Error(`Unsupported museum piece kind: ${pagePiece.kind}`);
  } catch (error) {
    renderBootError(`Failed to initialize ${piece.viewerTitle}.`, error);
  }
}

export async function initMuseumPageForCurrentPath() {
  try {
    const { applyStoredTheme, applyStoredUiMode } = await loadThemeModule();
    applyStoredTheme();
    applyStoredUiMode();

    const currentPath = normalizePath(window.location.pathname);
    if (isDarkMount(currentPath)) {
      const pieceId = new URLSearchParams(window.location.search).get("piece");
      if (pieceId) {
        await initMuseumPiecePage(pieceId, { darkMount: true });
        return;
      }

      await initMuseumLobbyPage({ darkMount: true });
      return;
    }

    const { museumRouteMap } = await loadCatalog();

    if (currentPath === "/museum/") {
      await initMuseumLobbyPage();
      return;
    }

    const pieceId = museumRouteMap[currentPath];
    if (!pieceId) {
      renderBootError(`No museum entry is registered for ${currentPath}`, new Error(`Unknown museum route: ${currentPath}`));
      return;
    }

    await initMuseumPiecePage(pieceId);
  } catch (error) {
    renderBootError("Failed to initialize the museum page.", error);
  }
}
