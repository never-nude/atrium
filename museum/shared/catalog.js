function link(label, url) {
  return { label, url };
}

function source(summary, links = [], note = "") {
  return { summary, links, note };
}

function smkSource({ summary, recordUrl, fullUrl, fallbackUrl, note = "" }) {
  const links = [];
  if (recordUrl) links.push(link("Record", recordUrl));
  if (fullUrl) links.push(link("Full STL", fullUrl));
  if (fallbackUrl && fallbackUrl !== fullUrl) links.push(link("Optimized STL", fallbackUrl));
  return source(summary, links, note);
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

const MICHELANGELO_SUBTITLE = "Artist: Michelangelo Buonarroti (1475-1564)";

export const museumSections = [
  {
    id: "egypt-mesopotamia",
    title: "Egypt & Mesopotamia",
    subtitle: "",
    spineId: "ancient-origins",
    spineTitle: "Ancient Origins",
    regionLabel: "Egypt & Mesopotamia"
  },
  {
    id: "greek-classical",
    title: "Greek Archaic & Classical",
    subtitle: "",
    spineId: "greek-foundations",
    spineTitle: "Greek Foundations",
    regionLabel: "Greek world"
  },
  {
    id: "hellenistic-world",
    title: "Hellenistic World",
    subtitle: "",
    spineId: "hellenistic-world",
    spineTitle: "Hellenistic World",
    regionLabel: "Greek world"
  },
  {
    id: "roman-world",
    title: "Roman World",
    subtitle: "",
    spineId: "roman-world",
    spineTitle: "Roman World",
    regionLabel: "Roman world"
  },
  {
    id: "asia",
    title: "Asia",
    subtitle: "",
    spineId: "parallel-traditions",
    spineTitle: "Parallel Traditions",
    regionLabel: "Asia"
  },
  {
    id: "sub-saharan-africa",
    title: "Sub-Saharan Africa",
    subtitle: "Devotional, court, and ancestral sculpture traditions",
    spineId: "parallel-traditions",
    spineTitle: "Parallel Traditions",
    regionLabel: "Sub-Saharan Africa"
  },
  {
    id: "americas",
    title: "Americas",
    subtitle: "",
    spineId: "parallel-traditions",
    spineTitle: "Parallel Traditions",
    regionLabel: "Americas"
  },
  {
    id: "early-renaissance",
    title: "Early Renaissance",
    subtitle: "",
    spineId: "rebirth-of-antiquity",
    spineTitle: "Rebirth of Antiquity",
    regionLabel: "Italy"
  },
  {
    id: "michelangelo",
    title: "Michelangelo",
    subtitle: "",
    spineId: "high-renaissance",
    spineTitle: "High Renaissance",
    regionLabel: "Italy"
  },
  {
    id: "bouchardon",
    title: "Bouchardon",
    subtitle: "",
    spineId: "enlightenment-sculpture",
    spineTitle: "Enlightenment Sculpture",
    regionLabel: "France"
  },
  {
    id: "nineteenth-century",
    title: "Nineteenth Century",
    subtitle: "",
    spineId: "nineteenth-century",
    spineTitle: "Nineteenth Century",
    regionLabel: ""
  },
  {
    id: "modern-sculpture",
    title: "Modern Sculpture",
    subtitle: "",
    spineId: "modern-sculpture",
    spineTitle: "Modern Sculpture",
    regionLabel: ""
  },
  {
    id: "rodin",
    title: "Rodin",
    subtitle: "",
    spineId: "modern-sculpture",
    spineTitle: "Modern Sculpture",
    regionLabel: "France"
  }
];

export const museumChronology = [
  {
    id: "ancient-origins",
    title: "Ancient Origins",
    sectionIds: ["egypt-mesopotamia"]
  },
  {
    id: "greek-foundations",
    title: "Greek Foundations",
    sectionIds: ["greek-classical"]
  },
  {
    id: "hellenistic-world",
    title: "Hellenistic World",
    sectionIds: ["hellenistic-world"]
  },
  {
    id: "roman-world",
    title: "Roman World",
    sectionIds: ["roman-world"]
  },
  {
    id: "parallel-traditions",
    title: "Parallel Traditions",
    sectionIds: ["asia", "sub-saharan-africa", "americas"]
  },
  {
    id: "rebirth-of-antiquity",
    title: "Rebirth of Antiquity",
    sectionIds: ["early-renaissance"]
  },
  {
    id: "high-renaissance",
    title: "High Renaissance",
    sectionIds: ["michelangelo"]
  },
  {
    id: "enlightenment-sculpture",
    title: "Enlightenment Sculpture",
    sectionIds: ["bouchardon"]
  },
  {
    id: "nineteenth-century",
    title: "Nineteenth Century",
    sectionIds: ["nineteenth-century"]
  },
  {
    id: "modern-sculpture",
    title: "Modern Sculpture",
    sectionIds: ["modern-sculpture", "rodin"]
  }
];

export const museumPieces = {
  "sphinx": {
    kind: "stl",
    path: "/sphinx/",
    sectionId: "egypt-mesopotamia",
    sortOrder: 10,
    viewerTitle: "Great Sphinx of Giza (c. 2558-2532 BCE)",
    subtitle: "Artist: Unknown Egyptian workshop (lifespan unknown)",
    lobbyMeta: "Source: Internet Archive / Thingiverse mirror",
    source: source(
      "Local STL mirrored from an Internet Archive Thingiverse mirror scan.",
      [
        link("Archive item", "https://archive.org/details/thingiverse-4940233"),
        link("Source ZIP", "https://archive.org/download/thingiverse-4940233/Great_Sphinx_of_Gizagenerated_by_Revopoint_POP_4940233.zip")
      ],
      "License listed on the source item: CC BY-NC-SA 4.0."
    ),
    model: {
      primaryUrl: "./sphinx_source.stl",
      fallbackUrl: "./sphinx_source.stl"
    }
  },
  "ashurnasirpal-lion-hunt": {
    kind: "stl",
    path: "/assyrian/ashurnasirpal-lion-hunt/",
    sectionId: "egypt-mesopotamia",
    sortOrder: 12,
    viewerTitle: "Ashurnasirpal II on Lion Hunt (Assyrian palace relief, c. 883-859 BCE)",
    subtitle: "Northwest Palace, Nimrud; British Museum original",
    lobbyMeta: "Source: SMK Open plaster-cast scan (KAS1994)",
    source: source(
      "Rendered from SMK's public-domain plaster-cast scan of Ashurnasirpal II on lion hunt from the Northwest Palace at Nimrud.",
      [
        link("SMK Open record", "https://open.smk.dk/artwork/image/KAS1994"),
        link("Full STL", "https://api.smk.dk/api/v1/download-3d/r207tt80w_smk-kas1994-ashurnasipal-ii-on-a-lion-hunt-decimated.stl"),
        link("Optimized STL", "https://api.smk.dk/api/v1/download-3d/r494vq871_KAS1994_small.stl")
      ],
      "SMK's linked original record places the alabaster relief in the British Museum and dates it to the reign of Ashurnasirpal II."
    ),
    defaults: {
      zoom: 2.85,
      exposure: 0.43,
      rough: 0.2
    },
    model: {
      primaryUrl: "./ashurnasirpal_lion_hunt_source_small.stl",
      fallbackUrl: "./ashurnasirpal_lion_hunt_source_small.stl"
    },
    scene: {
      rotateX: 0,
      targetHeight: 0.92,
      showPedestal: false,
      focusYRatio: 0.5,
      defaultViewVector: [1.0, 0.28, 2.65],
      mobileViewVector: [0.7, 0.22, 2.25]
    },
    material: {
      color: "#ddd2be",
      clearcoat: 0.12,
      clearcoatRoughness: 0.48,
      sheen: 0.16,
      sheenRoughness: 0.92,
      sheenColor: "#efe2cf",
      reflectivity: 0.3
    }
  },
  "lion-released-from-cage": {
    kind: "stl",
    path: "/assyrian/lion-released-from-cage/",
    sectionId: "egypt-mesopotamia",
    sortOrder: 12.5,
    viewerTitle: "Lion Released from Cage (Assyrian palace relief, c. 668-631 BCE)",
    subtitle: "North Palace, Nineveh; British Museum original",
    lobbyMeta: "Source: SMK Open plaster-cast scan (KAS1996)",
    source: source(
      "Rendered from SMK's public-domain plaster-cast scan of the Assyrian relief showing a lion released from a cage in Ashurbanipal's palace hunt cycle.",
      [
        link("SMK Open record", "https://open.smk.dk/artwork/image/KAS1996"),
        link("Full STL", "https://api.smk.dk/api/v1/download-3d/3197xs00g_smk-kas1996-assyrian-relief.stl"),
        link("Optimized STL", "https://api.smk.dk/api/v1/download-3d/xk81jq803_KAS1996_small.stl")
      ],
      "SMK's linked original record places the alabaster relief in the British Museum and identifies it as part of the North Palace lion-hunt program at Nineveh."
    ),
    defaults: {
      zoom: 2.55,
      exposure: 0.43,
      rough: 0.2
    },
    model: {
      primaryUrl: "./lion_released_from_cage_source_small.stl",
      fallbackUrl: "./lion_released_from_cage_source_small.stl"
    },
    scene: {
      rotateX: 0,
      targetHeight: 0.92,
      showPedestal: false,
      focusYRatio: 0.5,
      defaultViewVector: [1.0, 0.28, 2.45],
      mobileViewVector: [0.68, 0.22, 2.05]
    },
    material: {
      color: "#ddd2be",
      clearcoat: 0.12,
      clearcoatRoughness: 0.48,
      sheen: 0.16,
      sheenRoughness: 0.92,
      sheenColor: "#efe2cf",
      reflectivity: 0.3
    }
  },
  "goryeo-avalokiteshvara": {
    kind: "gltf",
    path: "/asia/goryeo-avalokiteshvara/",
    sectionId: "asia",
    sortOrder: 10,
    viewerTitle: "Goryeo Avalokiteshvara (Korea, c. 13th century CE)",
    subtitle: "National Museum of Korea original; Smithsonian National Museum of Asian Art 3D source",
    lobbyMeta: "Source: Smithsonian 3D / National Museum of Asian Art",
    source: source(
      "Rendered from Smithsonian 3D's Bodhisattva Avalokiteshvara (Gwaneum) model, identified on the source page as a Korean Goryeo-period work from the National Museum of Korea.",
      [
        link("Smithsonian 3D record", "https://3d.si.edu/object/dpo_3d_200035"),
        link("Voyager document", "https://3d-api.si.edu/content/document/d8c62792-4ebc-11ea-b77f-2e728ce88125/document.json"),
        link("Combined GLB", "https://3d-api.si.edu/content/document/d8c62792-4ebc-11ea-b77f-2e728ce88125/nmk_buddha_combined_100k-2048_std.glb")
      ],
      "Smithsonian lists metadata usage conditions on the source page. The c. 13th-century date here follows your master list and the source page's Goryeo-period identification."
    ),
    defaults: {
      zoom: 2.45,
      lightAngle: 24,
      lightPower: 2.05,
      exposure: 0.58,
      rough: 0.2
    },
    model: {
      primaryUrl: "https://3d-api.si.edu/content/document/d8c62792-4ebc-11ea-b77f-2e728ce88125/nmk_buddha_combined_100k-2048_std.glb",
      fallbackUrl: "https://3d-api.si.edu/content/document/d8c62792-4ebc-11ea-b77f-2e728ce88125/nmk_buddha_body_high-150k-2048-medium.glb"
    },
    scene: {
      targetHeight: 1.46,
      defaultYaw: Math.PI * 0.08,
      defaultViewVector: [1.45, 0.82, 1.72],
      mobileViewVector: [0.92, 0.56, 1.85]
    }
  },
  "sapi-portuguese-hunting-horn": {
    kind: "gltf",
    path: "/sub-saharan-africa/sapi-portuguese-hunting-horn/",
    sectionId: "sub-saharan-africa",
    sortOrder: 4,
    viewerTitle: "Sapi-Portuguese Hunting Horn (Sierra Leone, late 15th century)",
    subtitle: "Artist: Temne artist; likely made for export to a European patron",
    lobbyMeta: "Source: Smithsonian 3D / National Museum of African Art",
    source: source(
      "Rendered from Smithsonian 3D's Hunting horn model, which the source page attributes to a Temne artist in Sierra Leone and dates to the late fifteenth century.",
      [
        link("Smithsonian 3D record", "https://3d.si.edu/object/3d/hunting-horn%3Aad94884b-fdd7-4fc3-a692-e53b787d78e6"),
        link("Voyager document", "https://3d-api.si.edu/content/document/3d_package:ad94884b-fdd7-4fc3-a692-e53b787d78e6/document.json"),
        link("High GLB", "https://3d-api.si.edu/content/document/3d_package:ad94884b-fdd7-4fc3-a692-e53b787d78e6/nmafa-2005_6_9-150k-4096-high.glb")
      ],
      "Smithsonian marks the 3D package as CC0. The museum notes that the horn was likely made for a European client and links it to the Sapi-Portuguese ivory tradition."
    ),
    defaults: {
      zoom: 2.45,
      lightAngle: 22,
      lightPower: 2.0,
      exposure: 0.5,
      rough: 0.28
    },
    model: {
      primaryUrl: "https://3d-api.si.edu/content/document/3d_package:ad94884b-fdd7-4fc3-a692-e53b787d78e6/nmafa-2005_6_9-150k-4096-high.glb",
      fallbackUrl: "https://3d-api.si.edu/content/document/3d_package:ad94884b-fdd7-4fc3-a692-e53b787d78e6/nmafa-2005_6_9-150k-2048-medium.glb"
    },
    scene: {
      autoLevel: true,
      autoLevelBottomPercentile: 0.01,
      autoLevelBottomRatio: 0.025,
      showPedestal: false,
      targetHeight: 1.46,
      defaultYaw: 0,
      defaultViewVector: [1.12, 0.54, 1.88],
      mobileViewVector: [0.82, 0.42, 1.72]
    }
  },
  "loango-ivory-tusk-female-finial": {
    kind: "gltf",
    path: "/sub-saharan-africa/loango-ivory-tusk-female-finial/",
    sectionId: "sub-saharan-africa",
    sortOrder: 6,
    viewerTitle: "Loango Carved Ivory Tusk with Female Finial (Congo region, 1861)",
    subtitle: "Artist: Kongo artist; Loango coast, Congo; female finial head missing",
    lobbyMeta: "Source: Smithsonian 3D / National Museum of African Art",
    source: source(
      "Rendered from Smithsonian 3D's Tusk record 74-20-1, a Loango ivory tusk by a Kongo artist with spiral relief scenes and a damaged female finial.",
      [
        link("Smithsonian 3D record", "https://3d.si.edu/object/3d/tusk%3A8af570ba-2c32-455f-befd-4a8b7278c2f4"),
        link("Voyager document", "https://3d-api.si.edu/content/document/3d_package:8af570ba-2c32-455f-befd-4a8b7278c2f4/document.json"),
        link("High GLB A", "https://3d-api.si.edu/content/document/3d_package:8af570ba-2c32-455f-befd-4a8b7278c2f4/nmafa-74_20_1a-150k-4096-high.glb"),
        link("High GLB B", "https://3d-api.si.edu/content/document/3d_package:8af570ba-2c32-455f-befd-4a8b7278c2f4/nmafa-74_20_1b-150k-4096-high.glb"),
        link("High GLB C", "https://3d-api.si.edu/content/document/3d_package:8af570ba-2c32-455f-befd-4a8b7278c2f4/nmafa-74_20_1c-150k-4096-high.glb")
      ],
      "Smithsonian marks the 3D package as CC0. The source page describes scenes including fishermen, armed men, a monkey, a double-gong player, and a bird."
    ),
    defaults: {
      zoom: 2.5,
      lightAngle: 18,
      lightPower: 1.95,
      exposure: 0.5,
      rough: 0.28
    },
    model: {
      primaryUrl: [
        "https://3d-api.si.edu/content/document/3d_package:8af570ba-2c32-455f-befd-4a8b7278c2f4/nmafa-74_20_1a-150k-4096-high.glb",
        "https://3d-api.si.edu/content/document/3d_package:8af570ba-2c32-455f-befd-4a8b7278c2f4/nmafa-74_20_1b-150k-4096-high.glb",
        "https://3d-api.si.edu/content/document/3d_package:8af570ba-2c32-455f-befd-4a8b7278c2f4/nmafa-74_20_1c-150k-4096-high.glb"
      ],
      fallbackUrl: [
        "https://3d-api.si.edu/content/document/3d_package:8af570ba-2c32-455f-befd-4a8b7278c2f4/nmafa-74_20_1a-150k-2048-medium.glb",
        "https://3d-api.si.edu/content/document/3d_package:8af570ba-2c32-455f-befd-4a8b7278c2f4/nmafa-74_20_1b-150k-2048-medium.glb",
        "https://3d-api.si.edu/content/document/3d_package:8af570ba-2c32-455f-befd-4a8b7278c2f4/nmafa-74_20_1c-150k-2048-medium.glb"
      ]
    },
    scene: {
      autoLevel: true,
      autoLevelBottomPercentile: 0.01,
      autoLevelBottomRatio: 0.025,
      showPedestal: false,
      targetHeight: 1.38,
      defaultYaw: 0,
      defaultViewVector: [1.0, 0.5, 1.84],
      mobileViewVector: [0.78, 0.4, 1.66]
    }
  },
  "loango-ivory-tusk-seated-european-finial": {
    kind: "gltf",
    path: "/sub-saharan-africa/loango-ivory-tusk-seated-european-finial/",
    sectionId: "sub-saharan-africa",
    sortOrder: 7,
    viewerTitle: "Loango Carved Ivory Tusk with Seated European Finial (Congo region, 1861)",
    subtitle: "Artist: Kongo artist; Loango coast, Congo; seated European male finial",
    lobbyMeta: "Source: Smithsonian 3D / National Museum of African Art",
    source: source(
      "Rendered from Smithsonian 3D's Tusk record 74-20-2, a Loango ivory tusk by a Kongo artist with spiral relief scenes, an inscription ring, and a seated European male finial.",
      [
        link("Smithsonian 3D record", "https://3d.si.edu/object/3d/tusk%3A812d366b-b0cf-4175-8b21-f9c01ab62dc3"),
        link("Voyager document", "https://3d-api.si.edu/content/document/3d_package:812d366b-b0cf-4175-8b21-f9c01ab62dc3/document.json"),
        link("High GLB A", "https://3d-api.si.edu/content/document/3d_package:812d366b-b0cf-4175-8b21-f9c01ab62dc3/nmafa-74_20_2a-150k-4096-high.glb"),
        link("High GLB B", "https://3d-api.si.edu/content/document/3d_package:812d366b-b0cf-4175-8b21-f9c01ab62dc3/nmafa-74_20_2b-150k-4096-high.glb"),
        link("High GLB C", "https://3d-api.si.edu/content/document/3d_package:812d366b-b0cf-4175-8b21-f9c01ab62dc3/nmafa-74_20_2c-150k-4096-high.glb")
      ],
      "Smithsonian marks the 3D package as CC0. The source page identifies the finial as a seated European male and notes the tusk's wood base and inscription ring."
    ),
    defaults: {
      zoom: 2.5,
      lightAngle: 18,
      lightPower: 1.95,
      exposure: 0.5,
      rough: 0.28
    },
    model: {
      primaryUrl: [
        "https://3d-api.si.edu/content/document/3d_package:812d366b-b0cf-4175-8b21-f9c01ab62dc3/nmafa-74_20_2a-150k-4096-high.glb",
        "https://3d-api.si.edu/content/document/3d_package:812d366b-b0cf-4175-8b21-f9c01ab62dc3/nmafa-74_20_2b-150k-4096-high.glb",
        "https://3d-api.si.edu/content/document/3d_package:812d366b-b0cf-4175-8b21-f9c01ab62dc3/nmafa-74_20_2c-150k-4096-high.glb"
      ],
      fallbackUrl: [
        "https://3d-api.si.edu/content/document/3d_package:812d366b-b0cf-4175-8b21-f9c01ab62dc3/nmafa-74_20_2a-150k-2048-medium.glb",
        "https://3d-api.si.edu/content/document/3d_package:812d366b-b0cf-4175-8b21-f9c01ab62dc3/nmafa-74_20_2b-150k-2048-medium.glb",
        "https://3d-api.si.edu/content/document/3d_package:812d366b-b0cf-4175-8b21-f9c01ab62dc3/nmafa-74_20_2c-150k-2048-medium.glb"
      ]
    },
    scene: {
      autoLevel: true,
      autoLevelBottomPercentile: 0.01,
      autoLevelBottomRatio: 0.025,
      showPedestal: false,
      targetHeight: 1.38,
      defaultYaw: 0,
      defaultViewVector: [1.0, 0.5, 1.84],
      mobileViewVector: [0.78, 0.4, 1.66]
    }
  },
  "loango-ivory-tusk-trade-scenes": {
    kind: "gltf",
    path: "/sub-saharan-africa/loango-ivory-tusk-trade-scenes/",
    sectionId: "sub-saharan-africa",
    sortOrder: 8,
    viewerTitle: "Loango Carved Ivory Tusk with Trade Scenes (Congo region, late 19th century)",
    subtitle: "Artist: Kongo artist; Loango coast, Congo",
    lobbyMeta: "Source: Smithsonian 3D / National Museum of African Art",
    source: source(
      "Rendered from Smithsonian 3D's Tusk record 68-23-53, a late nineteenth-century Loango ivory tusk with spiral relief scenes of trade, dress, labor, and ritual life.",
      [
        link("Smithsonian 3D record", "https://3d.si.edu/object/3d/tusk%3Ac5952b8f-fa0d-4ab6-9fa7-452dffdfd416"),
        link("Voyager document", "https://3d-api.si.edu/content/document/3d_package:c5952b8f-fa0d-4ab6-9fa7-452dffdfd416/document.json"),
        link("High GLB", "https://3d-api.si.edu/content/document/3d_package:c5952b8f-fa0d-4ab6-9fa7-452dffdfd416/nmafa-68_23_53-150k-4096-high.glb")
      ],
      "Smithsonian lists usage conditions on the source page. The museum describes scenes including a coastal trading house, Africans in western dress, a blacksmith, a snake, a bird, a monkey, and bearers in chains."
    ),
    defaults: {
      zoom: 2.5,
      lightAngle: 16,
      lightPower: 1.95,
      exposure: 0.5,
      rough: 0.28
    },
    model: {
      primaryUrl: "https://3d-api.si.edu/content/document/3d_package:c5952b8f-fa0d-4ab6-9fa7-452dffdfd416/nmafa-68_23_53-150k-4096-high.glb",
      fallbackUrl: "https://3d-api.si.edu/content/document/3d_package:c5952b8f-fa0d-4ab6-9fa7-452dffdfd416/nmafa-68_23_53-150k-2048-medium.glb"
    },
    scene: {
      autoLevel: true,
      autoLevelBottomPercentile: 0.01,
      autoLevelBottomRatio: 0.025,
      showPedestal: false,
      targetHeight: 1.46,
      defaultYaw: 0,
      defaultViewVector: [1.04, 0.54, 1.9],
      mobileViewVector: [0.78, 0.42, 1.72]
    }
  },
  "kongo-maternity-figure": {
    kind: "gltf",
    path: "/sub-saharan-africa/kongo-maternity-figure/",
    sectionId: "sub-saharan-africa",
    sortOrder: 10,
    viewerTitle: "Kongo Maternity Figure (mid-19th to early 20th century)",
    subtitle: "Artist: Kongo artist; Mayombe region, Democratic Republic of the Congo",
    lobbyMeta: "Source: Smithsonian 3D / National Museum of African Art",
    source: source(
      "Rendered from Smithsonian 3D's Female figure with child model, which the source page identifies as a Kongo work from the Mayombe region and interprets as a phemba image associated with healing and motherhood.",
      [
        link("Smithsonian 3D record", "https://3d.si.edu/object/3d/female-figure-child%3A8335af2d-b54c-40b5-a8e7-89c1c147244a"),
        link("Voyager document", "https://3d-api.si.edu/content/document/8335af2d-b54c-40b5-a8e7-89c1c147244a/document.json"),
        link("High GLB", "https://3d-api.si.edu/content/document/8335af2d-b54c-40b5-a8e7-89c1c147244a/nmafa-8336-figure-100k-4096-high.glb")
      ],
      "Smithsonian lists usage conditions on the source page. The title here maps the source object to the Kongo maternity figure entry in your master list."
    ),
    defaults: {
      zoom: 2.55,
      lightAngle: 18,
      lightPower: 2.0,
      exposure: 0.5,
      rough: 0.2
    },
    model: {
      primaryUrl: "https://3d-api.si.edu/content/document/8335af2d-b54c-40b5-a8e7-89c1c147244a/nmafa-8336-figure-100k-4096-high.glb",
      fallbackUrl: "https://3d-api.si.edu/content/document/8335af2d-b54c-40b5-a8e7-89c1c147244a/nmafa-8336-figure-100k-2048-medium.glb"
    },
    scene: {
      autoLevel: true,
      autoLevelBottomPercentile: 0.01,
      autoLevelBottomRatio: 0.028,
      verticalOffset: -0.09,
      targetHeight: 1.24,
      defaultYaw: 0,
      defaultViewVector: [1.22, 0.62, 1.86],
      mobileViewVector: [0.86, 0.5, 1.72]
    }
  },
  "charioteer-of-delphi": {
    kind: "sketchfab",
    path: "/charioteer-of-delphi/",
    sectionId: "greek-classical",
    sortOrder: 20,
    hiddenFromLobby: true,
    viewerTitle: "Charioteer of Delphi (c. 478-474 BCE)",
    subtitle: "Artist: Unknown Ancient Greek sculptor (lifespan unknown)",
    lobbyMeta: "Source: Sketchfab / Virtual Museums of Malopolska",
    source: source(
      "Sketchfab model published by Virtual Museums of Malopolska.",
      [
        link("Sketchfab model", "https://sketchfab.com/3d-models/charioteer-of-delphi-a-plaster-cast-0d55b629f1334200ab8efa7195e1450f"),
        link("Museum record", "https://muzea.malopolska.pl/en/objects-list/2234")
      ],
      "The source model is listed as CC0 Public Domain."
    ),
    model: {
      uid: "0d55b629f1334200ab8efa7195e1450f",
      triangles: 508203,
      sourceBytes: 66185275
    }
  },
  "venus-de-milo": {
    kind: "stl",
    path: "/venus-de-milo/",
    sectionId: "hellenistic-world",
    sortOrder: 25,
    viewerTitle: "Venus de Milo (late 2nd century BCE)",
    subtitle: "Traditional attribution: Alexandros of Antioch (debated)",
    lobbyMeta: "Source: SMK Open plaster-cast scan (KAS434)",
    source: source(
      "Rendered from SMK's public-domain plaster-cast scan of the Louvre's Venus de Milo.",
      [
        link("SMK API", "https://api.smk.dk/api/v1/art?object_number=KAS434"),
        link("SMK Open record", "https://open.smk.dk/artwork/image/KAS434"),
        link("Full STL", "https://api.smk.dk/api/v1/download-3d/w0892g669_smk-venus-de-milo.stl"),
        link("Optimized STL", "https://api.smk.dk/api/v1/download-3d/h128nk52f_KAS434_small.stl")
      ],
      "Artist attribution follows the traditional Alexandros identification and remains debated."
    ),
    defaults: {
      zoom: 3.35
    },
    model: {
      primaryUrl: "./venus_de_milo_source_small.stl",
      fallbackUrl: "./venus_de_milo_source_small.stl"
    }
  },
  "discobolus": {
    kind: "stl",
    path: "/discobolus/",
    sectionId: "greek-classical",
    sortOrder: 27,
    viewerTitle: "Discobolus (Roman copy after Myron, c. 460-450 BCE)",
    subtitle: "Artist: Unknown Roman workshop after Myron of Eleutherae",
    lobbyMeta: "Source: SMK Open plaster-cast scan (KAS1549)",
    source: source(
      "Rendered from SMK's public-domain plaster-cast scan of the Discobolus type with a modern restored head.",
      [
        link("SMK API", "https://api.smk.dk/api/v1/art?object_number=KAS1549"),
        link("SMK Open record", "https://open.smk.dk/artwork/image/KAS1549"),
        link("Full STL", "https://api.smk.dk/api/v1/download-3d/n583z0576_smk-discobolus.stl"),
        link("Optimized STL", "https://api.smk.dk/api/v1/download-3d/ww72bg964_KAS1549_small.stl")
      ],
      "This SMK cast record is the Discobolus variant with a modern restored head."
    ),
    defaults: {
      zoom: 2.95
    },
    model: {
      primaryUrl: "./discobolus_source_small.stl",
      fallbackUrl: "./discobolus_source_small.stl"
    }
  },
  "artemision-bronze": {
    kind: "stl",
    path: "/artemision-bronze/",
    sectionId: "greek-classical",
    sortOrder: 27.5,
    viewerTitle: "Zeus/Poseidon of Artemision (c. 460 BCE)",
    subtitle: "Artist: Unknown Ancient Greek bronze sculptor",
    lobbyMeta: "Source: SMK Open cast scan (KAS2100); bronze material pass",
    source: source(
      "Rendered from SMK's public-domain cast scan of the Artemision bronze type, with a bronze material pass in the Form Gallery viewer to better evoke the surviving original.",
      [
        link("SMK API", "https://api.smk.dk/api/v1/art?object_number=KAS2100"),
        link("SMK Open record", "https://open.smk.dk/artwork/image/KAS2100"),
        link("Full STL", "https://api.smk.dk/api/v1/download-3d/7m01br55g_smk-poseidon.stl"),
        link("Optimized STL", "https://api.smk.dk/api/v1/download-3d/028711697_KAS2100_small.stl")
      ],
      "The identification remains debated between Zeus and Poseidon, and the underlying mesh comes from an SMK cast scan rather than a direct scan of the Athens bronze."
    ),
    defaults: {
      zoom: 3.05,
      lightAngle: 30,
      lightPower: 2.28,
      exposure: 0.48,
      rough: 0.2
    },
    model: {
      primaryUrl: "./artemision_bronze_source_small.stl",
      fallbackUrl: "./artemision_bronze_source_small.stl"
    },
    scene: {
      defaultYaw: -Math.PI * 0.5,
      targetHeight: 1.82
    },
    material: {
      color: "#72603d",
      metalness: 0.88,
      clearcoat: 0.08,
      clearcoatRoughness: 0.44,
      sheen: 0.0,
      sheenRoughness: 1.0,
      sheenColor: "#000000",
      reflectivity: 0.86
    }
  },
  "athena-lemnia": {
    kind: "stl",
    path: "/athena-lemnia/",
    sectionId: "greek-classical",
    sortOrder: 27.75,
    viewerTitle: "Athena Lemnia (copy tradition, c. 450 BCE type)",
    subtitle: "Traditional attribution: Pheidias; current mesh from SMK's Furtwangler reconstruction",
    lobbyMeta: "Source: SMK Open reconstruction scan (KAS40); bronze material pass",
    source: source(
      "Rendered from SMK's public-domain plaster-cast scan of Furtwangler's reconstruction of the Athena Lemnia type, with a bronze material pass in the Form Gallery viewer to better evoke the lost original bronze.",
      [
        link("SMK Open record", "https://open.smk.dk/artwork/image/KAS40"),
        link("Full STL", "https://api.smk.dk/api/v1/download-3d/cz30pz12n_20-smk-lemniam-athena-deci.stl"),
        link("Optimized STL", "https://api.smk.dk/api/v1/download-3d/p5547x350_KAS40_small.stl")
      ],
      "The underlying mesh is SMK's reconstruction record rather than a direct scan of an extant ancient bronze; the catalog links the type to the Dresden torso and the Palagi head in Bologna."
    ),
    defaults: {
      zoom: 2.95,
      lightAngle: 30,
      lightPower: 2.26,
      exposure: 0.47,
      rough: 0.2
    },
    model: {
      primaryUrl: "./athena_lemnia_source_small.stl",
      fallbackUrl: "./athena_lemnia_source_small.stl"
    },
    scene: {
      targetHeight: 2.08
    },
    material: {
      color: "#786748",
      metalness: 0.84,
      clearcoat: 0.06,
      clearcoatRoughness: 0.5,
      sheen: 0.0,
      sheenRoughness: 1.0,
      sheenColor: "#000000",
      reflectivity: 0.82
    }
  },
  "germanicus": {
    kind: "stl",
    path: "/germanicus/",
    sectionId: "roman-world",
    sortOrder: 52,
    hiddenFromLobby: true,
    viewerTitle: "Statue of Germanicus (Roman period, c. 30 BCE)",
    subtitle: "Artist: Unknown Roman workshop; identification between Germanicus and Octavian remains debated",
    lobbyMeta: "Source: SMK Open plaster-cast scan (KAS644)",
    source: source(
      "Rendered from SMK's public-domain plaster-cast scan of the standing Germanicus / Octavian type in the Louvre collections.",
      [
        link("SMK Open record", "https://open.smk.dk/artwork/image/KAS644"),
        link("Full STL", "https://api.smk.dk/api/v1/download-3d/0p096c25s_smk41-kas644-germanicus.stl"),
        link("Optimized STL", "https://api.smk.dk/api/v1/download-3d/nv935743t_KAS644_small.stl")
      ],
      "SMK's cast title preserves the uncertainty between Germanicus and Octavian; the Louvre provenance and c. 30 BCE dating come from the linked cast record."
    ),
    defaults: {
      zoom: 2.9
    },
    model: {
      primaryUrl: "./germanicus_source_small.stl",
      fallbackUrl: "./germanicus_source_small.stl"
    },
    scene: {
      targetHeight: 1.92
    }
  },
  "belvedere-torso": {
    kind: "stl",
    path: "/belvedere-torso/",
    sectionId: "roman-world",
    sortOrder: 28,
    viewerTitle: "Belvedere Torso (1st century BCE)",
    subtitle: "Artist: Unknown Hellenistic sculptor",
    lobbyMeta: "Source: SMK Open plaster-cast scan (KAS402)",
    source: source(
      "Rendered from SMK's public-domain plaster-cast scan of the Belvedere Torso in the Vatican collections.",
      [
        link("SMK API", "https://api.smk.dk/api/v1/art?object_number=KAS402"),
        link("SMK Open record", "https://open.smk.dk/artwork/image/KAS402"),
        link("Full STL", "https://api.smk.dk/api/v1/download-3d/gq67jw94x_smk1-kas402-belvedere-torso.stl"),
        link("Optimized STL", "https://api.smk.dk/api/v1/download-3d/zs25xf26x_KAS402_small.stl")
      ],
      "SMK's cast record identifies the figure as Ajax(?) and notes the missing lower base with signature."
    ),
    defaults: {
      zoom: 2.85
    },
    model: {
      primaryUrl: "./belvedere_torso_source_small.stl",
      fallbackUrl: "./belvedere_torso_source_small.stl"
    }
  },
  "apollo-belvedere": {
    kind: "stl",
    path: "/apollo-belvedere/",
    sectionId: "greek-classical",
    sortOrder: 29,
    viewerTitle: "Apollo Belvedere (Roman copy after a Greek original, c. 330 BCE)",
    subtitle: "Artist: Unknown Roman workshop after a classical Greek original",
    lobbyMeta: "Source: SMK Open plaster-cast scan (KAS353)",
    source: source(
      "Rendered from SMK's public-domain plaster-cast scan of the Apollo Belvedere in the Vatican collections.",
      [
        link("SMK API", "https://api.smk.dk/api/v1/art?object_number=KAS353"),
        link("SMK Open record", "https://open.smk.dk/artwork/image/KAS353"),
        link("Full STL", "https://api.smk.dk/api/v1/download-3d/wm117v118_smk-apollo-belvedere.stl"),
        link("Optimized STL", "https://api.smk.dk/api/v1/download-3d/sb397d83g_KAS353_small.stl")
      ],
      "The traditional attribution to Leochares is historical rather than certain."
    ),
    defaults: {
      zoom: 2.9
    },
    model: {
      primaryUrl: "./apollo_belvedere_source_small.stl",
      fallbackUrl: "./apollo_belvedere_source_small.stl"
    }
  },
  "dying-gaul": {
    kind: "stl",
    path: "/dying-gaul/",
    sectionId: "hellenistic-world",
    sortOrder: 30,
    viewerTitle: "Dying Gaul (Roman copy after a Hellenistic original, c. 230-220 BCE)",
    subtitle: "Artist: Unknown Roman workshop after a Hellenistic original",
    lobbyMeta: "Source: SMK Open local mirror (KAS1312)",
    source: source(
      "Viewer uses a local mirrored STL derived from SMK Open's public Dying Gaul / Dying Gladiator scan.",
      [
        link("Record", "https://open.smk.dk/en/artwork/image/KAS1312"),
        link("Full STL", "https://api.smk.dk/api/v1/download-3d/4f16c782s_smk-190-inv-dying-gladiator.stl"),
        link("Optimized STL", "https://api.smk.dk/api/v1/download-3d/5t34sq60f_KAS1312_small.stl")
      ],
      "The Form Gallery route now serves a local optimized mirror for reliability."
    ),
    model: {
      primaryUrl: "./dying_gaul_source_small.stl",
      fallbackUrl: "./dying_gaul_source_small.stl"
    },
    view: {
      fallbackLoadingText: "Loading STL sculpture..."
    }
  },
  "ludovisi-gaul": {
    kind: "stl",
    path: "/ludovisi-gaul/",
    sectionId: "hellenistic-world",
    sortOrder: 35,
    viewerTitle: "Ludovisi Gaul (Roman copy after a Hellenistic original, c. 225 BCE)",
    subtitle: "Artist: Unknown Roman workshop after a Hellenistic original",
    lobbyMeta: "Source: SMK Open plaster-cast scan (KAS66)",
    source: source(
      "Rendered from SMK's public-domain plaster-cast scan of the Ludovisi Gaul group, catalogued by SMK as 'Galler draber sin hustru og sig selv, Paetus og Arria'.",
      [
        link("SMK API", "https://api.smk.dk/api/v1/art?object_number=KAS66"),
        link("SMK Open record", "https://open.smk.dk/artwork/image/KAS66"),
        link("Full STL", "https://api.smk.dk/api/v1/download-3d/dn39x612z_105-kas66.stl"),
        link("Optimized STL", "https://api.smk.dk/api/v1/download-3d/d217qv67s_KAS66_small.stl")
      ],
      "The Ludovisi Gaul title is the modern identification; SMK's historical cast record also preserves the older Paetus and Arria naming."
    ),
    defaults: {
      zoom: 3.75
    },
    model: {
      primaryUrl: "./ludovisi_gaul_source_small.stl",
      fallbackUrl: "./ludovisi_gaul_source_small.stl"
    },
    scene: {
      rotateX: 0
    }
  },
  "capitoline-venus": {
    kind: "stl",
    path: "/capitoline-venus/",
    sectionId: "roman-world",
    sortOrder: 36,
    viewerTitle: "Capitoline Venus (Roman copy after a Hellenistic original, c. 2nd century BCE)",
    subtitle: "Artist: Unknown Roman workshop after a Hellenistic original",
    lobbyMeta: "Source: SMK Open plaster-cast scan (KAS493)",
    source: source(
      "Rendered from SMK's public-domain plaster-cast scan of the Capitoline Venus in the Capitoline Museums.",
      [
        link("SMK API", "https://api.smk.dk/api/v1/art?object_number=KAS493"),
        link("SMK Open record", "https://open.smk.dk/artwork/image/KAS493"),
        link("Full STL", "https://api.smk.dk/api/v1/download-3d/ff365988b_smk33-kas493-capitoline-venus-decimated.stl"),
        link("Optimized STL", "https://api.smk.dk/api/v1/download-3d/pz50h153z_KAS493_small.stl")
      ],
      "SMK's cast record identifies this as the Capitoline Venus type, a Roman copy after a Hellenistic Greek original."
    ),
    defaults: {
      zoom: 3.2
    },
    model: {
      primaryUrl: "./capitoline_venus_source_small.stl",
      fallbackUrl: "./capitoline_venus_source_small.stl"
    }
  },
  "laocoon": {
    kind: "stl",
    path: "/laocoon/",
    sectionId: "hellenistic-world",
    sortOrder: 40,
    viewerTitle: "Laocoon and His Sons (c. 40-20 BCE)",
    subtitle: "Traditional attribution: Hagesandros, Polydoros, and Athanodoros of Rhodes",
    lobbyMeta: "Source: SMK Open plaster-cast scan",
    source: source(
      "Rendered from SMK's public-domain plaster-cast scan after the Vatican group.",
      [
        link("SMK API", "https://api.smk.dk/api/v1/art?object_number=KAS385"),
        link("SMK Open record", "https://open.smk.dk/en/artwork/image/KAS385")
      ],
      "Artist attribution is traditional rather than certain."
    ),
    defaults: {
      zoom: 3.9
    },
    model: {
      primaryUrl: "./laocoon_source_small.stl",
      fallbackUrl: "./laocoon_source_small.stl"
    }
  },
  "augustus-of-prima-porta": {
    kind: "stl",
    path: "/augustus-of-prima-porta/",
    sectionId: "roman-world",
    sortOrder: 50,
    viewerTitle: "Augustus of Prima Porta (early 1st century CE)",
    subtitle: "Artist: Unknown Roman workshop (lifespan unknown)",
    lobbyMeta: "Source: Internet Archive / Thingiverse mirror",
    source: source(
      "Local STL mirrored from an Internet Archive Thingiverse mirror.",
      [
        link("Archive item", "https://archive.org/details/thingiverse-4973766"),
        link("Source ZIP", "https://archive.org/download/thingiverse-4973766/Augustus_of_Prima_Porta_4973766.zip")
      ],
      "License listed on the source item: CC BY 4.0."
    ),
    model: {
      primaryUrl: "./augustus_of_prima_porta_source.stl",
      fallbackUrl: "./augustus_of_prima_porta_source.stl"
    },
    scene: {
      rotateX: 0
    }
  },
  "donatello-saint-george": {
    kind: "sketchfab",
    path: "/donatello/saint-george/",
    sectionId: "early-renaissance",
    sortOrder: 10,
    hiddenFromLobby: true,
    viewerTitle: "Saint George (c. 1415-1417)",
    subtitle: "Artist: Donatello (c. 1386-1466)",
    lobbyMeta: "Source: Sketchfab model",
    source: source(
      "Sketchfab model used in the Form Gallery viewer pipeline.",
      [
        link("Sketchfab model", "https://sketchfab.com/3d-models/saint-george-donatellosan-jorge-b637727d39544f6d998ab996ded86f0c")
      ],
      "Viewer uses the published model UID b637727d39544f6d998ab996ded86f0c."
    ),
    defaults: {
      zoom: 1.95,
      lightPower: 2.55,
      exposure: 0.62,
      rough: 0.2
    },
    model: {
      uid: "b637727d39544f6d998ab996ded86f0c",
      triangles: 2000012,
      sourceBytes: 100000824
    }
  },
  "michelangelo-battle-of-the-centaurs": {
    kind: "stl",
    path: "/michelangelo/battle-of-the-centaurs/",
    sectionId: "michelangelo",
    sortOrder: 10,
    viewerTitle: "Battle of the Centaurs (c. 1490-1492)",
    subtitle: MICHELANGELO_SUBTITLE,
    lobbyMeta: "Source: SMK Open",
    source: smkSource({
      summary: "Viewer uses SMK Open's Battle of the Centaurs scan, mirrored locally for reliable loading.",
      recordUrl: "https://open.smk.dk/en/artwork/image/KAS455",
      fullUrl: "https://api.smk.dk/api/v1/download-3d/h415pg24h_smk-kas455-battle-of-the-centaurs.stl",
      note: "This route serves a local mirrored STL in the viewer."
    }),
    model: {
      primaryUrl: "./battle_of_the_centaurs_source.stl"
    }
  },
  "michelangelo-bacchus": {
    kind: "stl",
    path: "/michelangelo/bacchus/",
    sectionId: "michelangelo",
    sortOrder: 20,
    viewerTitle: "Bacchus (1496-1497)",
    subtitle: MICHELANGELO_SUBTITLE,
    lobbyMeta: "Source: SMK Open",
    source: smkSource({
      summary: "Viewer uses an optimized local Bacchus STL for reliable loading, while preserving the full SMK Open source mesh in the route.",
      recordUrl: "https://open.smk.dk/en/artwork/image/KAS83",
      fullUrl: "https://api.smk.dk/api/v1/download-3d/r207tt71x_142-inv-83-bacchus.stl"
    }),
    model: {
      primaryUrl: "./bacchus_source_small.stl",
      fallbackUrl: "./bacchus_source_small.stl"
    }
  },
  "michelangelo-pieta": {
    kind: "stl",
    path: "/michelangelo/pieta/",
    sectionId: "michelangelo",
    sortOrder: 30,
    viewerTitle: "Pieta (1497-1500)",
    subtitle: MICHELANGELO_SUBTITLE,
    lobbyMeta: "Source: SMK Open",
    source: smkSource({
      summary: "SMK Open source mesh for Michelangelo's Pieta.",
      recordUrl: "https://open.smk.dk/en/artwork/image/KAS115",
      fullUrl: "https://api.smk.dk/api/v1/download-3d/3197xr938_smk16-kas115-pieta-michelangelo.stl",
      fallbackUrl: "https://api.smk.dk/api/v1/download-3d/4m90f1143_KAS115_small.stl"
    }),
    model: {
      primaryUrl: "./pieta_source_small.stl",
      fallbackUrl: "./pieta_source_small.stl"
    },
    scene: {
      rotateX: 0
    }
  },
  "michelangelo-david": {
    kind: "stl",
    path: "/michelangelo/david/",
    sectionId: "michelangelo",
    sortOrder: 40,
    viewerTitle: "David (1501-1504)",
    subtitle: MICHELANGELO_SUBTITLE,
    lobbyMeta: "Source: local mirrored STL; Accademia reference",
    source: source(
      "This route currently uses a mirrored local STL for the viewer.",
      [
        link("Galleria dell'Accademia reference", "https://www.galleriaaccademiafirenze.it/opere/david-michelangelo/")
      ],
      "The exact public mesh source for the mirrored STL has not yet been reattached in the museum catalog."
    ),
    defaults: {
      zoom: 2.7
    },
    model: {
      primaryUrl: "./david_source.stl",
      fallbackUrl: "./david_source.stl"
    },
    scene: {
      targetHeight: 1.82
    }
  },
  "michelangelo-bruges-madonna": {
    kind: "stl",
    path: "/michelangelo/bruges-madonna/",
    sectionId: "michelangelo",
    sortOrder: 50,
    viewerTitle: "Bruges Madonna (1501-1504)",
    subtitle: MICHELANGELO_SUBTITLE,
    lobbyMeta: "Source: SMK Open",
    source: smkSource({
      summary: "SMK Open source mesh for Bruges Madonna.",
      recordUrl: "https://open.smk.dk/en/artwork/image/KAS225",
      fullUrl: "https://open.smk.dk/artwork/image/st74cw417_smk21-kas225-bruges-madonna.stl",
      fallbackUrl: "https://open.smk.dk/artwork/image/h128nk494_KAS225_small.stl"
    }),
    model: {
      primaryUrl: "./bruges_madonna_source_small.stl",
      fallbackUrl: "./bruges_madonna_source_small.stl"
    }
  },
  "michelangelo-tondo-pitti": {
    kind: "stl",
    path: "/michelangelo/tondo-pitti/",
    sectionId: "michelangelo",
    sortOrder: 60,
    viewerTitle: "Tondo Pitti (c. 1503-1505)",
    subtitle: MICHELANGELO_SUBTITLE,
    lobbyMeta: "Source: SMK Open",
    source: smkSource({
      summary: "SMK Open source mesh for Tondo Pitti.",
      recordUrl: "https://open.smk.dk/en/artwork/image/KAS2202",
      fullUrl: "https://api.smk.dk/api/v1/download-3d/n296x4001_smk46-kas2202-madonna-pitti.stl",
      fallbackUrl: "https://api.smk.dk/api/v1/download-3d/zc77sv67x_KAS2202_small.stl",
      note: "This route starts from the optimized local mirror for reliability."
    }),
    model: {
      primaryUrl: "./tondo_pitti_source_small.stl",
      fallbackUrl: "./tondo_pitti_source_small.stl"
    },
    timeouts: {
      primaryMs: 60000,
      fallbackMs: 60000
    },
    scene: {
      rotateX: 0
    }
  },
  "michelangelo-tondo-taddei": {
    kind: "stl",
    path: "/michelangelo/tondo-taddei/",
    sectionId: "michelangelo",
    sortOrder: 70,
    viewerTitle: "Tondo Taddei (c. 1504-1506)",
    subtitle: MICHELANGELO_SUBTITLE,
    lobbyMeta: "Source: SMK Open",
    source: smkSource({
      summary: "SMK Open source mesh for Tondo Taddei.",
      recordUrl: "https://open.smk.dk/en/artwork/image/KAS85",
      fullUrl: "https://api.smk.dk/api/v1/download-3d/th83m3943_smk31-kas85-taddei-tondo.stl",
      fallbackUrl: "https://api.smk.dk/api/v1/download-3d/h702qc06t_KAS85_small.stl",
      note: "This route starts from the optimized local mirror for reliability."
    }),
    model: {
      primaryUrl: "./tondo_taddei_source_small.stl",
      fallbackUrl: "./tondo_taddei_source_small.stl"
    },
    timeouts: {
      primaryMs: 60000,
      fallbackMs: 60000
    },
    scene: {
      rotateX: 0
    }
  },
  "michelangelo-moses": {
    kind: "stl",
    path: "/michelangelo/moses/",
    sectionId: "michelangelo",
    sortOrder: 80,
    viewerTitle: "Moses (1513-1515)",
    subtitle: MICHELANGELO_SUBTITLE,
    lobbyMeta: "Source: SMK Open",
    source: smkSource({
      summary: "SMK Open source mesh for Moses.",
      recordUrl: "https://open.smk.dk/en/artwork/image/KAS243",
      fullUrl: "https://api.smk.dk/api/v1/download-3d/m900p022q_154-smk-inv-243-moses.stl",
      fallbackUrl: "https://api.smk.dk/api/v1/download-3d/pr76f835r_KAS243_small.stl",
      note: "The current viewer starts from the local optimized STL for reliability."
    }),
    model: {
      primaryUrl: "./moses_source_small.stl",
      fallbackUrl: "./moses_source_small.stl"
    },
    timeouts: {
      primaryMs: 60000,
      fallbackMs: 60000
    }
  },
  "michelangelo-dying-slave": {
    kind: "stl",
    path: "/michelangelo/dying-slave/",
    sectionId: "michelangelo",
    sortOrder: 90,
    viewerTitle: "Dying Slave (1513-1516)",
    subtitle: MICHELANGELO_SUBTITLE,
    lobbyMeta: "Source: SMK Open",
    source: smkSource({
      summary: "SMK Open source mesh for Dying Slave.",
      recordUrl: "https://open.smk.dk/en/artwork/image/KAS87",
      fullUrl: "https://api.smk.dk/api/v1/download-3d/6969z5201_the-dying-slave.stl",
      fallbackUrl: "https://api.smk.dk/api/v1/download-3d/dv13zz66c_KAS87_small.stl"
    }),
    model: {
      primaryUrl: "./dying_slave_source_small.stl",
      fallbackUrl: "./dying_slave_source_small.stl"
    }
  },
  "michelangelo-rebellious-slave": {
    kind: "stl",
    path: "/michelangelo/rebellious-slave/",
    sectionId: "michelangelo",
    sortOrder: 100,
    viewerTitle: "Rebellious Slave (1513-1516)",
    subtitle: MICHELANGELO_SUBTITLE,
    lobbyMeta: "Source: SMK Open",
    source: smkSource({
      summary: "SMK Open source mesh for Rebellious Slave.",
      recordUrl: "https://open.smk.dk/en/artwork/image/KAS86",
      fullUrl: "https://api.smk.dk/api/v1/download-3d/dr26z301p_140-smk-inv-86-den-operprske-slave.stl",
      fallbackUrl: "https://api.smk.dk/api/v1/download-3d/1544bt98d_KAS86_small.stl"
    }),
    model: {
      primaryUrl: "./rebellious_slave_source_small.stl",
      fallbackUrl: "./rebellious_slave_source_small.stl"
    }
  },
  "michelangelo-prisoner": {
    kind: "stl",
    path: "/michelangelo/prisoner/",
    sectionId: "michelangelo",
    sortOrder: 110,
    viewerTitle: "Prisoner (c. 1519)",
    subtitle: MICHELANGELO_SUBTITLE,
    lobbyMeta: "Source: SMK Open",
    source: smkSource({
      summary: "SMK Open source mesh for Prisoner / Young Slave.",
      recordUrl: "https://open.smk.dk/en/artwork/image/KAS2360",
      fullUrl: "https://api.smk.dk/api/v1/download-3d/d791sm646_138-michelangelo-young-slave-kas-2360.stl",
      fallbackUrl: "https://api.smk.dk/api/v1/download-3d/8p58pj78x_KAS2360_small.stl"
    }),
    model: {
      primaryUrl: "./prisoner_source_small.stl",
      fallbackUrl: "./prisoner_source_small.stl"
    }
  },
  "michelangelo-medici-madonna": {
    kind: "stl",
    path: "/michelangelo/medici-madonna/",
    sectionId: "michelangelo",
    sortOrder: 120,
    viewerTitle: "Medici Madonna (c. 1521-1534)",
    subtitle: MICHELANGELO_SUBTITLE,
    lobbyMeta: "Source: SMK Open",
    source: smkSource({
      summary: "SMK Open source mesh for Medici Madonna.",
      recordUrl: "https://open.smk.dk/en/artwork/image/KAS114",
      fullUrl: "https://api.smk.dk/api/v1/download-3d/x633f5719_smk-kas114-medici-madonna.stl",
      fallbackUrl: "https://api.smk.dk/api/v1/download-3d/z029p939x_KAS114_small.stl"
    }),
    model: {
      primaryUrl: "./medici_madonna_source_small.stl",
      fallbackUrl: "./medici_madonna_source_small.stl"
    }
  },
  "michelangelo-dawn": {
    kind: "stl",
    path: "/michelangelo/dawn/",
    sectionId: "michelangelo",
    sortOrder: 130,
    viewerTitle: "Dawn (1524-1531)",
    subtitle: MICHELANGELO_SUBTITLE,
    lobbyMeta: "Source: SMK Open",
    source: smkSource({
      summary: "SMK Open source mesh for Dawn (KAS113/3).",
      fullUrl: "https://api.smk.dk/api/v1/download-3d/k643b617z_smk-kas113-3-allegory-of-dawn.stl",
      fallbackUrl: "https://api.smk.dk/api/v1/download-3d/rx913v89s_KAS113-3_small.stl"
    }),
    model: {
      primaryUrl: "./dawn_source_small.stl",
      fallbackUrl: "./dawn_source_small.stl"
    },
    scene: {
      rotateX: 0,
      defaultYaw: Math.PI * 0.5
    }
  },
  "michelangelo-dusk": {
    kind: "stl",
    path: "/michelangelo/dusk/",
    sectionId: "michelangelo",
    sortOrder: 140,
    viewerTitle: "Dusk (1524-1531)",
    subtitle: MICHELANGELO_SUBTITLE,
    lobbyMeta: "Source: SMK Open",
    source: smkSource({
      summary: "SMK Open source mesh for Dusk (KAS113/2).",
      fullUrl: "https://api.smk.dk/api/v1/download-3d/3n204405h_smk-kas113-2-allegory-of-dusk.stl",
      fallbackUrl: "https://api.smk.dk/api/v1/download-3d/8c97kv91g_KAS113-2_small.stl"
    }),
    model: {
      primaryUrl: "./dusk_source_small.stl",
      fallbackUrl: "./dusk_source_small.stl"
    }
  },
  "michelangelo-night": {
    kind: "stl",
    path: "/michelangelo/night/",
    sectionId: "michelangelo",
    sortOrder: 150,
    viewerTitle: "Night (Notte) (1526-1531)",
    subtitle: MICHELANGELO_SUBTITLE,
    lobbyMeta: "Source: SMK Open",
    source: smkSource({
      summary: "SMK Open source mesh for Night (KAS112/2).",
      fullUrl: "https://api.smk.dk/api/v1/download-3d/mg74qr55m_smk-kas112-2-night.stl",
      fallbackUrl: "https://api.smk.dk/api/v1/download-3d/kw52jd84f_KAS112-2_small.stl"
    }),
    model: {
      primaryUrl: "./night_source_small.stl",
      fallbackUrl: "./night_source_small.stl"
    },
    scene: {
      defaultYaw: Math.PI
    }
  },
  "michelangelo-day": {
    kind: "sketchfab",
    path: "/michelangelo/day/",
    sectionId: "michelangelo",
    sortOrder: 160,
    viewerTitle: "Day (1526-1531)",
    subtitle: MICHELANGELO_SUBTITLE,
    lobbyMeta: "Source: Sketchfab / Rmn-Grand Palais",
    source: source(
      "Sketchfab model published by Rmn-Grand Palais.",
      [
        link("Sketchfab model", "https://sketchfab.com/3d-models/le-jour-the-day-michelangelo-50a615fd366a463e8449ff942302f6e4")
      ]
    ),
    model: {
      uid: "50a615fd366a463e8449ff942302f6e4",
      triangles: 500000,
      sourceBytes: 3544546
    }
  },
  "michelangelo-giuliano-duke-of-nemours": {
    kind: "stl",
    path: "/michelangelo/giuliano-duke-of-nemours/",
    sectionId: "michelangelo",
    sortOrder: 170,
    viewerTitle: "Giuliano, Duke of Nemours (1526-1534)",
    subtitle: MICHELANGELO_SUBTITLE,
    lobbyMeta: "Source: SMK Open",
    source: smkSource({
      summary: "SMK Open source mesh for Giuliano, Duke of Nemours (KAS112/1).",
      fullUrl: "https://api.smk.dk/api/v1/download-3d/dn39x6162_smk-kas112-1-guiliano-de-medici-decimated.stl",
      fallbackUrl: "https://api.smk.dk/api/v1/download-3d/td96k687f_KAS112-1_small.stl"
    }),
    model: {
      primaryUrl: "./giuliano_source_small.stl",
      fallbackUrl: "./giuliano_source_small.stl"
    },
    scene: {
      rotateX: 0
    }
  },
  "michelangelo-lorenzo-duke-of-urbino": {
    kind: "stl",
    path: "/michelangelo/lorenzo-duke-of-urbino/",
    sectionId: "michelangelo",
    sortOrder: 180,
    viewerTitle: "Lorenzo, Duke of Urbino (1526-1534)",
    subtitle: MICHELANGELO_SUBTITLE,
    lobbyMeta: "Source: SMK Open",
    source: smkSource({
      summary: "SMK Open source mesh for Lorenzo, Duke of Urbino (KAS113/1).",
      fullUrl: "https://api.smk.dk/api/v1/download-3d/df65vd372_smk-kas113-1-lorenzo-de-medici-decimated.stl",
      fallbackUrl: "https://api.smk.dk/api/v1/download-3d/8p58pj77n_KAS113-1_small.stl"
    }),
    model: {
      primaryUrl: "./lorenzo_source_small.stl",
      fallbackUrl: "./lorenzo_source_small.stl"
    },
    scene: {
      rotateX: 0
    }
  },
  "michelangelo-brutus": {
    kind: "stl",
    path: "/michelangelo/brutus/",
    sectionId: "michelangelo",
    sortOrder: 190,
    viewerTitle: "Brutus (c. 1540-1548)",
    subtitle: MICHELANGELO_SUBTITLE,
    lobbyMeta: "Source: SMK Open",
    source: smkSource({
      summary: "SMK Open source mesh for Brutus.",
      recordUrl: "https://open.smk.dk/en/artwork/image/KAS105",
      fullUrl: "https://api.smk.dk/api/v1/download-3d/pz50h1458_smk-kas105-brutus.stl",
      fallbackUrl: "https://api.smk.dk/api/v1/download-3d/df65vd436_KAS105_small.stl"
    }),
    model: {
      primaryUrl: "./brutus_source_small.stl",
      fallbackUrl: "./brutus_source_small.stl"
    }
  },
  "michelangelo-rondanini-pieta": {
    kind: "stl",
    path: "/michelangelo/rondanini-pieta/",
    sectionId: "michelangelo",
    sortOrder: 200,
    viewerTitle: "Rondanini Pieta (c. 1553-1564)",
    subtitle: MICHELANGELO_SUBTITLE,
    lobbyMeta: "Source: SMK Open",
    source: smkSource({
      summary: "SMK Open source mesh for Rondanini Pieta.",
      recordUrl: "https://open.smk.dk/en/artwork/image/KAS2361",
      fullUrl: "https://api.smk.dk/api/v1/download-3d/0z709169b_smk-kas2361-rondanini-pieta.stl",
      fallbackUrl: "https://api.smk.dk/api/v1/download-3d/bn999c493_KAS2361_small.stl"
    }),
    model: {
      primaryUrl: "./rondanini_pieta_source_small.stl",
      fallbackUrl: "./rondanini_pieta_source_small.stl"
    }
  },
  "bouchardon-cupid": {
    kind: "stl",
    path: "/bouchardon/cupid/",
    sectionId: "bouchardon",
    sortOrder: 10,
    viewerTitle: "Cupid Cutting His Bow from the Club of Hercules (c. 1747-1750)",
    subtitle: "Artist: Edme Bouchardon (1698-1762)",
    lobbyMeta: "Source: local mirrored STL; Louvre reference",
    source: source(
      "This route currently uses a mirrored local STL of Bouchardon's sculpture.",
      [
        link("Louvre work reference", "https://collections.louvre.fr/en/ark:/53355/cl010091965")
      ],
      "The exact public mesh source for the mirrored STL predates this audit and is still being reconciled."
    ),
    defaults: {
      zoom: 2.7
    },
    model: {
      primaryUrl: "./cupid_source.stl",
      fallbackUrl: "./cupid_source.stl"
    },
    scene: {
      targetHeight: 1.72
    }
  },
  "rodin-the-thinker": {
    kind: "stl",
    path: "/rodin/the-thinker/",
    sectionId: "rodin",
    sortOrder: 10,
    viewerTitle: "The Thinker (1880-1904)",
    subtitle: "Artist: Auguste Rodin (1840-1917)",
    lobbyMeta: "Source: Wikimedia Commons / Scan the World",
    source: source(
      "Local STL mirrored from the Scan the World file published on Wikimedia Commons.",
      [
        link("File page", "https://commons.wikimedia.org/wiki/File:Scan_the_World_-_The_Thinker_(Auguste_Rodin).stl"),
        link("Direct STL", "https://upload.wikimedia.org/wikipedia/commons/e/e2/Scan_the_World_-_The_Thinker_%28Auguste_Rodin%29.stl")
      ],
      "License listed on the source file page: CC BY-SA 4.0."
    ),
    defaults: {
      zoom: 3.15,
      lightAngle: 28,
      lightPower: 2.35,
      exposure: 0.48,
      rough: 0.2
    },
    model: {
      primaryUrl: "./thinker_source.stl",
      fallbackUrl: "./thinker_source.stl"
    },
    timeouts: {
      primaryMs: 60000,
      fallbackMs: 60000
    },
    material: {
      color: "#8c6338",
      metalness: 0.82,
      clearcoat: 0.06,
      clearcoatRoughness: 0.48,
      sheen: 0.0,
      sheenRoughness: 1.0,
      sheenColor: "#000000",
      reflectivity: 0.82
    }
  }
};

function sectionItems(sectionId) {
  return Object.entries(museumPieces)
    .filter(([, piece]) => piece.sectionId === sectionId && !piece.hiddenFromLobby)
    .sort(([, a], [, b]) => {
      if (a.sortOrder !== b.sortOrder) {
        return a.sortOrder - b.sortOrder;
      }
      return (a.viewerTitle || "").localeCompare(b.viewerTitle || "");
    })
    .map(([pieceId]) => pieceId);
}

export const museumLobby = {
  pageTitle: "Atrium — Form Gallery",
  brand: "FORM GALLERY",
  title: "Atrium",
  contextLabel: "Collection Entrance",
  subtitle: "Form Gallery is a digital sculpture collection spanning antiquity through the twenty-first century. Browse the collection by gallery, era, region, or maker.",
  featuredPieceId: "kongo-maternity-figure",
  featuredPieceIds: [
    "kongo-maternity-figure",
    "standing-buddha-radiate-combined-halo",
    "haliphat",
    "bronze-horse-head-herculaneum",
    "venus-de-milo",
    "discobolus",
    "perseus-with-head-of-medusa",
    "dying-gaul",
    "princess-from-amarna",
    "capitoline-wolf",
    "michelangelo-david",
    "apollo-belvedere",
    "bouchardon-cupid",
    "rodin-the-thinker",
    "donatello-david-bronze"
  ],
  featuredRotationStart: "2026-03-23",
  featuredLabel: "Featured Sculpture",
  featuredCtaLabel: "Explore the Work",
  browseTitle: "Browse the Collection",
  browseSubtitle: "Filter by period, region, maker, or gallery.",
  browseResetLabel: "Show all works",
  sections: museumSections
    .map((section) => ({
      id: section.id,
      title: section.title,
      subtitle: section.subtitle,
      items: sectionItems(section.id)
    }))
    .filter((section) => section.items.length > 0),
  sectionGroups: museumChronology
    .map((group) => ({
      id: group.id,
      title: group.title,
      sectionIds: group.sectionIds
    }))
};

export const museumRouteMap = Object.fromEntries(
  Object.entries(museumPieces).flatMap(([pieceId, piece]) => routeEntriesForPath(piece.path, pieceId))
);
