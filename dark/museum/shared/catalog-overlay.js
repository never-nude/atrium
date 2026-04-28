import { metBatchPieces } from "./met-batch-20260329.js";

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

function smithsonianDocument(packageId) {
  return `https://3d-api.si.edu/content/document/3d_package:${packageId}/document.json`;
}

function smithsonianAsset(packageId, filename) {
  return `https://3d-api.si.edu/content/document/3d_package:${packageId}/${filename}`;
}

function smithsonianSource({ summary, recordUrl, packageId, highFile = "", mediumFile = "", note = "" }) {
  const links = [];
  if (recordUrl) links.push(link("Smithsonian 3D record", recordUrl));
  if (packageId) links.push(link("Voyager document", smithsonianDocument(packageId)));
  if (highFile) {
    links.push(link("High GLB", smithsonianAsset(packageId, highFile)));
  } else if (mediumFile) {
    links.push(link("GLB", smithsonianAsset(packageId, mediumFile)));
  }
  return source(summary, links, note);
}

const MICHELANGELO_SUBTITLE = "Artist: Michelangelo Buonarroti (1475-1564)";
const DONATELLO_SUBTITLE = "Artist: Donatello (c. 1386-1466)";
const LORENZI_SUBTITLE = "Artist: Battista Lorenzi (1527-1594)";
const BENEDETTO_DA_MAIANO_SUBTITLE = "Artist: Attributed to Benedetto da Maiano (1442-1497)";
const SMK_CAST_SUBTITLE = "Artist: Unknown sculptor; current mesh from SMK's cast record";

export const museumPiecesExtension = {
  "donatello-saint-george": {
    kind: "stl",
    path: "/donatello/saint-george/",
    sectionId: "early-renaissance",
    sortOrder: 74,
    viewerTitle: "Saint George (c. 1415-1417)",
    subtitle: DONATELLO_SUBTITLE,
    lobbyMeta: "Source: SMK Open plaster cast (KAS82)",
    source: smkSource({
      summary: "Rendered from SMK Open's optimized STL for the museum's plaster cast of Saint George.",
      recordUrl: "https://open.smk.dk/en/artwork/image/KAS82",
      fullUrl: "https://api.smk.dk/api/v1/download-3d/rn3015822_153-kas82.stl",
      fallbackUrl: "https://api.smk.dk/api/v1/download-3d/765376019_KAS82_small.stl",
      note: "SMK catalogs the object itself as a plaster cast. The c. 1415-1417 date follows the original Donatello sculpture rather than the cast."
    }),
    defaults: {
      zoom: 2.82,
      lightAngle: 28,
      lightPower: 2.34,
      exposure: 0.5,
      rough: 0.2
    },
    model: {
      primaryUrl: "./saint_george_source_small.stl",
      fallbackUrl: "./saint_george_source_small.stl"
    },
    scene: {
      targetHeight: 1.92,
      defaultYaw: -Math.PI * 0.04,
      defaultViewVector: [1.38, 0.72, 2.18],
      mobileViewVector: [1.0, 0.56, 1.94]
    }
  },
  "donatello-david-bronze": {
    kind: "stl",
    path: "/donatello/david/",
    sectionId: "early-renaissance",
    sortOrder: 76,
    viewerTitle: "David with the Head of Goliath (c. 1440s)",
    subtitle: DONATELLO_SUBTITLE,
    lobbyMeta: "Source: Wikimedia Commons / Scan the World; bronze material pass",
    source: source(
      "Rendered from the Scan the World STL on Wikimedia Commons, mirrored locally and decimated to the gallery's ~20 MB target for reliable native loading.",
      [
        link("Wikimedia Commons file", "https://commons.wikimedia.org/wiki/File:Scan_the_World_-_SMK17_-_KAS2036_-_David_With_The_Head_of_Goliath_(Donatello).stl"),
        link("Direct STL", "https://upload.wikimedia.org/wikipedia/commons/5/56/Scan_the_World_-_SMK17_-_KAS2036_-_David_With_The_Head_of_Goliath_%28Donatello%29.stl")
      ],
      "The original bronze is in the Museo Nazionale del Bargello. The viewer uses a local 400,000-face binary STL derivative to keep the delivered model close to 20 MB."
    ),
    defaults: {
      zoom: 2.95,
      lightAngle: 28,
      lightPower: 2.18,
      exposure: 0.46,
      rough: 0.2
    },
    model: {
      primaryUrl: "./donatello_david_source_small.stl",
      fallbackUrl: "./donatello_david_source_small.stl"
    },
    scene: {
      defaultYaw: -Math.PI * 0.08,
      targetHeight: 1.73,
      defaultViewVector: [1.72, 0.74, 1.88],
      mobileViewVector: [1.08, 0.48, 2.08]
    },
    material: {
      color: "#6e5b3a",
      metalness: 0.86,
      clearcoat: 0.08,
      clearcoatRoughness: 0.44,
      sheen: 0.0,
      sheenRoughness: 1.0,
      sheenColor: "#000000",
      reflectivity: 0.84
    }
  },
  "benedetto-da-maiano-john-the-baptist-as-a-boy": {
    kind: "stl",
    path: "/donatello/john-the-baptist-as-a-boy/",
    sectionId: "early-renaissance",
    sortOrder: 79,
    viewerTitle: "John the Baptist as a Boy (attributed to Benedetto da Maiano, 1480-1481)",
    subtitle: BENEDETTO_DA_MAIANO_SUBTITLE,
    lobbyMeta: "Source: SMK Open plaster cast (KAS465)",
    source: smkSource({
      summary: "Rendered from SMK Open's optimized STL for the museum's plaster cast titled John the Baptist as a Boy.",
      recordUrl: "https://open.smk.dk/en/artwork/image/KAS465",
      fullUrl: "https://api.smk.dk/api/v1/download-3d/s4655n294_144-john-the-baptist-inv-465.stl",
      fallbackUrl: "https://api.smk.dk/api/v1/download-3d/d791sm78j_KAS465_small.stl",
      note: "SMK catalogs the object as a plaster cast after a Bargello marble original. The attribution to Benedetto da Maiano and the 1480-1481 date are inferred from the original-object notes attached to the SMK record."
    }),
    defaults: {
      zoom: 2.58,
      lightAngle: 32,
      lightPower: 2.14,
      exposure: 0.46,
      rough: 0.2
    },
    model: {
      primaryUrl: "./john_the_baptist_as_a_boy_source_small.stl",
      fallbackUrl: "./john_the_baptist_as_a_boy_source_small.stl"
    },
    scene: {
      targetHeight: 1.34,
      defaultYaw: Math.PI * 0.06,
      defaultViewVector: [1.08, 0.46, 1.84],
      mobileViewVector: [0.82, 0.38, 1.68]
    }
  },
  "rodin-walking-man": {
    kind: "stl",
    path: "/rodin/the-walking-man/",
    sectionId: "rodin",
    sortOrder: 20,
    viewerTitle: "The Walking Man (conceived 1899-1900)",
    subtitle: "Artist: Auguste Rodin (1840-1917)",
    lobbyMeta: "Source: Wikimedia Commons / Thingiverse-derived STL",
    source: source(
      "Local STL mirrored from the Wikimedia Commons file for Rodin's The Walking Man.",
      [
        link("File page", "https://commons.wikimedia.org/wiki/File:Auguste_Rodin_-_L'Homme_qui_marche_-_3D_model_Thingiverse.stl"),
        link("Direct STL", "https://upload.wikimedia.org/wikipedia/commons/e/e4/Auguste_Rodin_-_L%27Homme_qui_marche_-_3D_model_Thingiverse.stl"),
        link("Musee Rodin reference", "https://www.meudon.musee-rodin.fr/en/musee/collections/oeuvres/walking-man-large-model")
      ],
      "The Commons file credits Thingiverse and carries a CC BY 4.0 license. The date here follows the Musee Rodin chronology for the large model's conception."
    ),
    defaults: {
      zoom: 3.05,
      lightAngle: 26,
      lightPower: 2.28,
      exposure: 0.46,
      rough: 0.2
    },
    model: {
      primaryUrl: "./walking_man_source.stl",
      fallbackUrl: "./walking_man_source.stl"
    },
    timeouts: {
      primaryMs: 60000,
      fallbackMs: 60000
    },
    scene: {
      targetHeight: 1.78,
      defaultYaw: -Math.PI * 0.1,
      defaultViewVector: [1.34, 0.64, 2.02],
      mobileViewVector: [0.94, 0.48, 1.86]
    },
    material: {
      color: "#85613b",
      metalness: 0.8,
      clearcoat: 0.06,
      clearcoatRoughness: 0.5,
      sheen: 0.0,
      sheenRoughness: 1.0,
      sheenColor: "#000000",
      reflectivity: 0.8
    }
  },
  "rodin-danaid": {
    kind: "stl",
    path: "/rodin/danaid/",
    sectionId: "rodin",
    sortOrder: 30,
    viewerTitle: "Danaid (1889)",
    subtitle: "Artist: Auguste Rodin (1840-1917)",
    lobbyMeta: "Source: Wikimedia Commons / Nationalmuseum STL",
    source: source(
      "Local STL mirrored from the Wikimedia Commons file for Rodin's Danaid, credited to Nationalmuseum's Sketchfab release.",
      [
        link("File page", "https://commons.wikimedia.org/wiki/File:Danaid_NMSk_1854_(Auguste_Rodin)_-_Nationalmuseum_-_76c5c234c6074b13a94bf793c276a509.stl"),
        link("Direct STL", "https://upload.wikimedia.org/wikipedia/commons/2/22/Danaid_NMSk_1854_%28Auguste_Rodin%29_-_Nationalmuseum_-_76c5c234c6074b13a94bf793c276a509.stl")
      ],
      "The source file describes a terracotta Danaid made in 1889 and originally linked to The Gates of Hell. The gallery render keeps that terracotta reading rather than forcing a bronze finish."
    ),
    defaults: {
      zoom: 2.52,
      lightAngle: 18,
      lightPower: 2.02,
      exposure: 0.5,
      rough: 0.28
    },
    model: {
      primaryUrl: "./danaid_source.stl",
      fallbackUrl: "./danaid_source.stl"
    },
    timeouts: {
      primaryMs: 60000,
      fallbackMs: 60000
    },
    scene: {
      targetHeight: 0.92,
      focusYRatio: 0.48,
      defaultYaw: Math.PI * 0.08,
      defaultViewVector: [1.18, 0.34, 1.72],
      mobileViewVector: [0.86, 0.26, 1.54]
    },
    material: {
      color: "#9d6a4a",
      metalness: 0.04,
      clearcoat: 0.1,
      clearcoatRoughness: 0.58,
      sheen: 0.12,
      sheenRoughness: 0.9,
      sheenColor: "#e4b995",
      reflectivity: 0.16
    }
  },
  "rodin-heroic-head-of-pierre-de-wissant": {
    kind: "stl",
    path: "/rodin/heroic-head-of-pierre-de-wissant/",
    sectionId: "rodin",
    sortOrder: 40,
    viewerTitle: "Heroic Head of Pierre de Wissant (1886)",
    subtitle: "Artist: Auguste Rodin (1840-1917)",
    medium: "Plaster",
    dimensions: "H: 85.1 cm | W: 61 cm | D: 50.8 cm",
    lobbyMeta: "Source: Wikimedia Commons / Cleveland Museum of Art STL",
    source: source(
      "Local STL mirrored from the Wikimedia Commons file for Rodin's Heroic Head of Pierre de Wissant, cataloged by the Cleveland Museum of Art.",
      [
        link("Wikimedia Commons file", "https://commons.wikimedia.org/wiki/File:1917.722_Heroic_Head_of_Pierre_de_Wissant_-_3D_model.stl"),
        link("Direct STL", "https://upload.wikimedia.org/wikipedia/commons/1/1c/1917.722_Heroic_Head_of_Pierre_de_Wissant_-_3D_model.stl"),
        link("Cleveland Museum of Art", "https://www.clevelandart.org/art/1917.722")
      ],
      "The Commons file identifies the work as Auguste Rodin's Heroic Head of Pierre de Wissant in the Cleveland Museum of Art. The displayed dimensions follow the museum metadata surfaced on the Commons file page."
    ),
    defaults: {
      zoom: 2.44,
      lightAngle: 30,
      lightPower: 2.18,
      rough: 0.22
    },
    model: {
      primaryUrl: "./heroic_head_of_pierre_de_wissant_source.stl",
      fallbackUrl: "./heroic_head_of_pierre_de_wissant_source.stl"
    },
    timeouts: {
      primaryMs: 60000,
      fallbackMs: 60000
    },
    scene: {
      rotateX: 0,
      rotateZ: Math.PI,
      targetHeight: 1.08,
      defaultYaw: -Math.PI * 0.06,
      defaultViewVector: [1.18, 0.46, 1.66],
      mobileViewVector: [0.86, 0.38, 1.54]
    }
  },
  "lorenzi-portrait-of-michelangelo": {
    kind: "stl",
    path: "/lorenzi/portrait-of-michelangelo/",
    sectionId: "early-renaissance",
    sortOrder: 82,
    viewerTitle: "Portrait of Michelangelo (after Battista Lorenzi, 16th-century type)",
    subtitle: LORENZI_SUBTITLE,
    lobbyMeta: "Source: SMK Open; plaster cast after Battista Lorenzi",
    source: smkSource({
      summary: "Rendered from SMK Open's optimized STL of the museum's plaster cast after Battista Lorenzi's portrait of Michelangelo.",
      recordUrl: "https://open.smk.dk/en/artwork/image/KAS336",
      fullUrl: "https://api.smk.dk/api/v1/download-3d/1c18dm47p_smk29-kas336-bust-of-michelangelo3.stl",
      fallbackUrl: "https://api.smk.dk/api/v1/download-3d/fx719s420_KAS336_small.stl",
      note: "The gallery serves a local mirror of the optimized STL, which already lands almost exactly on the museum's target delivery budget at about 20 MB and 400,000 triangles. SMK catalogs the object itself as a plaster cast made before 1897 after Battista Lorenzi."
    }),
    defaults: {
      zoom: 2.58,
      lightAngle: 31,
      lightPower: 2.08,
      exposure: 0.44,
      rough: 0.2
    },
    model: {
      primaryUrl: "./portrait_of_michelangelo_source_small.stl",
      fallbackUrl: "./portrait_of_michelangelo_source_small.stl"
    },
    scene: {
      defaultYaw: -Math.PI * 0.08,
      targetHeight: 1.12,
      defaultViewVector: [1.18, 0.42, 1.54],
      mobileViewVector: [0.86, 0.34, 1.74]
    }
  },
  "michelangelo-risen-christ": {
    kind: "stl",
    path: "/michelangelo/risen-christ/",
    sectionId: "michelangelo",
    sortOrder: 78,
    viewerTitle: "Risen Christ (c. 1519-1521)",
    subtitle: MICHELANGELO_SUBTITLE,
    lobbyMeta: "Source: SMK Open",
    source: smkSource({
      summary: "SMK Open source mesh for Risen Christ / Den genopstandne Kristus.",
      recordUrl: "https://open.smk.dk/en/artwork/image/KAS422",
      fullUrl: "https://api.smk.dk/api/v1/download-3d/p5547x24g_smk40-kas422-risen-christ.stl",
      fallbackUrl: "https://api.smk.dk/api/v1/download-3d/k930c2765_KAS422_small.stl",
      note: "SMK catalogs this as a plaster cast after Michelangelo. The c. 1519-1521 date here follows the original sculpture rather than the cast."
    }),
    defaults: {
      zoom: 2.9,
      exposure: 0.42,
      rough: 0.2
    },
    model: {
      primaryUrl: "./risen_christ_source_small.stl",
      fallbackUrl: "./risen_christ_source_small.stl"
    },
    scene: {
      rotateX: -Math.PI * 0.5,
      targetHeight: 1.76,
      defaultYaw: Math.PI * 0.08
    }
  },
  "michelangelo-apollo": {
    kind: "stl",
    path: "/michelangelo/apollo/",
    sectionId: "michelangelo",
    sortOrder: 165,
    viewerTitle: "Apollo (c. 1530)",
    subtitle: MICHELANGELO_SUBTITLE,
    lobbyMeta: "Source: SMK Open",
    source: smkSource({
      summary: "SMK Open source mesh for Apollo / Apollon.",
      recordUrl: "https://open.smk.dk/en/artwork/image/KAS473",
      fullUrl: "https://api.smk.dk/api/v1/download-3d/qv33s208r_smk14-kas473-apollo-michelangelo.stl",
      fallbackUrl: "https://api.smk.dk/api/v1/download-3d/4q77fw84x_KAS473_small.stl",
      note: "SMK catalogs this as a plaster cast after Michelangelo. The c. 1530 date is the conventional art-historical dating for the original work."
    }),
    defaults: {
      zoom: 2.75,
      exposure: 0.42,
      rough: 0.2
    },
    model: {
      primaryUrl: "./apollo_source_small.stl",
      fallbackUrl: "./apollo_source_small.stl"
    },
    scene: {
      rotateX: 0,
      targetHeight: 1.54,
      defaultYaw: -Math.PI * 0.16
    }
  },
  "barberini-faun": {
    kind: "stl",
    path: "/barberini-faun/",
    sectionId: "hellenistic-world",
    sortOrder: 29.15,
    viewerTitle: "Barberini Faun (Roman copy after a Hellenistic original, c. 220 BCE)",
    subtitle: "Artist: Unknown Roman workshop after a Hellenistic original",
    lobbyMeta: "Source: SMK Open plaster-cast scan (KAS208)",
    source: smkSource({
      summary: "SMK Open source mesh for the Barberini Faun.",
      recordUrl: "https://open.smk.dk/en/artwork/image/KAS208",
      fullUrl: "https://api.smk.dk/api/v1/download-3d/df65vd33z_kas208-barberini-faun.stl",
      fallbackUrl: "https://api.smk.dk/api/v1/download-3d/8w32rb332_KAS208_small.stl",
      note: "SMK catalogs this as a plaster cast. The dating here follows the usual Roman-copy-after-Hellenistic-original framing for the Barberini Faun type."
    }),
    defaults: {
      zoom: 3.05,
      exposure: 0.43,
      rough: 0.2
    },
    model: {
      primaryUrl: "./barberini_faun_source_small.stl",
      fallbackUrl: "./barberini_faun_source_small.stl"
    }
  },
  "apollo-lykeios": {
    kind: "stl",
    path: "/apollo-lykeios/",
    sectionId: "greek-classical",
    sortOrder: 29.2,
    viewerTitle: "Apollo Lykeios (copy tradition, 4th century BCE type)",
    subtitle: "Traditional attribution: Praxiteles; current mesh from SMK's cast record",
    lobbyMeta: "Source: SMK Open plaster-cast scan (KAS1026)",
    source: smkSource({
      summary: "SMK Open source mesh for Apollo Lykeios / Apollon Lykeios.",
      recordUrl: "https://open.smk.dk/en/artwork/image/KAS1026",
      fullUrl: "https://api.smk.dk/api/v1/download-3d/9593v081h_42-kas2016.stl",
      fallbackUrl: "https://api.smk.dk/api/v1/download-3d/p5547x33f_KAS1026_small.stl",
      note: "SMK catalogs this as a plaster cast. The Praxiteles attribution is traditional rather than certain, and the title follows the source record's Apollo Lykeios identification."
    }),
    defaults: {
      zoom: 2.95,
      exposure: 0.43,
      rough: 0.2
    },
    model: {
      primaryUrl: "./apollo_lykeios_source_small.stl",
      fallbackUrl: "./apollo_lykeios_source_small.stl"
    }
  },
  "the-wrestlers": {
    kind: "stl",
    path: "/the-wrestlers/",
    sectionId: "hellenistic-world",
    sortOrder: 29.25,
    viewerTitle: "The Wrestlers (Roman copy after a Hellenistic original)",
    subtitle: "Artist: Unknown Roman workshop after a Hellenistic original",
    lobbyMeta: "Source: SMK Open plaster-cast scan (KAS403)",
    source: smkSource({
      summary: "SMK Open source mesh for the Uffizi Wrestlers group, titled 'To brydere i kamp' in the source record.",
      recordUrl: "https://open.smk.dk/en/artwork/image/KAS403",
      fullUrl: "https://api.smk.dk/api/v1/download-3d/4q77fw74p_smk8-kas403-uffizi-wrestlers-1.stl",
      fallbackUrl: "https://api.smk.dk/api/v1/download-3d/8w32rb35m_KAS403_small.stl",
      note: "The Form Gallery title uses the common English name. SMK catalogs the object itself as a plaster cast after the Uffizi group."
    }),
    defaults: {
      zoom: 3.25,
      exposure: 0.44,
      rough: 0.2
    },
    model: {
      primaryUrl: "./wrestlers_source_small.stl",
      fallbackUrl: "./wrestlers_source_small.stl"
    }
  },
  "princess-from-amarna": {
    kind: "stl",
    path: "/princess-from-amarna/",
    sectionId: "egypt-mesopotamia",
    sortOrder: 11,
    viewerTitle: "Princess from Amarna (Egypt, c. 1365-1349 BCE)",
    subtitle: "Artist: Unknown Egyptian workshop",
    medium: "Quartzite",
    dimensions: "H: 16.5 cm",
    lobbyMeta: "Source: SMK Open plaster-cast scan (KAS2226)",
    source: smkSource({
      summary: "SMK Open source mesh for Princess from Amarna, localized into Form Gallery's native STL viewer.",
      recordUrl: "https://open.smk.dk/en/artwork/image/KAS2226",
      fullUrl: "https://api.smk.dk/api/v1/download-3d/cj82kc77d_smk-kas2226-princess-of-amarna.stl",
      fallbackUrl: "https://api.smk.dk/api/v1/download-3d/v979v741f_KAS2226_small.stl",
      note: "SMK catalogs the object as a plaster cast after an Egyptian Museum original from Tell el-Amarna, associated in the source record with the workshop of Thutmose and dated to the Amarna Period, 18th Dynasty."
    }),
    defaults: {
      zoom: 2.38,
      lightAngle: 26,
      lightPower: 2.06,
      exposure: 0.42,
      rough: 0.22
    },
    model: {
      primaryUrl: "./princess_from_amarna_source_small.stl",
      fallbackUrl: "./princess_from_amarna_source_small.stl"
    },
    scene: {
      targetHeight: 1.16,
      defaultYaw: 0,
      defaultViewVector: [1.02, 0.44, 1.56],
      mobileViewVector: [0.74, 0.34, 1.38]
    },
    material: {
      color: "#d6b992",
      metalness: 0.02,
      clearcoat: 0.06,
      clearcoatRoughness: 0.58,
      sheen: 0.08,
      sheenRoughness: 0.9,
      sheenColor: "#ead2b1",
      reflectivity: 0.18
    }
  },
  "capitoline-wolf": {
    kind: "stl",
    path: "/capitoline-wolf/",
    sectionId: "roman-world",
    sortOrder: 27.65,
    viewerTitle: "Capitoline Wolf (Etruscan type, c. 450 BCE)",
    subtitle: "Artist: Unknown Italic workshop",
    medium: "Bronze",
    dimensions: "H: 94 cm | W: 65 cm | D: 144.5 cm",
    lobbyMeta: "Source: SMK Open painted plaster cast (KAS837); bronze material pass",
    source: smkSource({
      summary: "SMK Open source mesh for the Capitoline Wolf type, localized into Form Gallery's native STL viewer.",
      recordUrl: "https://open.smk.dk/en/artwork/image/KAS837",
      fullUrl: "https://api.smk.dk/api/v1/download-3d/g445cj932_smk39-kas837-capitoline-wolf-decimated.stl",
      fallbackUrl: "https://api.smk.dk/api/v1/download-3d/05741x168_KAS837_small.stl",
      note: "SMK catalogs the object itself as a painted plaster cast. The source record identifies the original as the Capitoline Wolf type in the Palazzo dei Conservatori, with Etruscan attribution and a c. 450 BCE date."
    }),
    defaults: {
      zoom: 2.9,
      lightAngle: 28,
      lightPower: 2.2,
      exposure: 0.44,
      rough: 0.2
    },
    model: {
      primaryUrl: "./capitoline_wolf_source_small.stl",
      fallbackUrl: "./capitoline_wolf_source_small.stl"
    },
    scene: {
      targetHeight: 1.12,
      defaultYaw: 0,
      defaultViewVector: [1.18, 0.46, 1.78],
      mobileViewVector: [0.84, 0.34, 1.6]
    },
    material: {
      color: "#6e5b3a",
      metalness: 0.86,
      clearcoat: 0.08,
      clearcoatRoughness: 0.44,
      sheen: 0.0,
      sheenRoughness: 1.0,
      sheenColor: "#000000",
      reflectivity: 0.84
    }
  },
  "aphrodite-anadyomene": {
    kind: "stl",
    path: "/aphrodite-anadyomene/",
    sectionId: "hellenistic-world",
    sortOrder: 28.7,
    viewerTitle: "Aphrodite Anadyomene (Roman copy after a Greek original, 1st century BCE)",
    subtitle: "Artist: Unknown Roman workshop after a Greek original",
    medium: "Marble",
    dimensions: "H: 154 cm | W: 59 cm | D: 41.5 cm",
    lobbyMeta: "Source: SMK Open plaster-cast scan (KAS185)",
    source: smkSource({
      summary: "SMK Open source mesh for Aphrodite Anadyomene, localized into Form Gallery's native STL viewer.",
      recordUrl: "https://open.smk.dk/en/artwork/image/KAS185",
      fullUrl: "https://api.smk.dk/api/v1/download-3d/rn301581s_16-smk-esquiline-aphrodite-inv-1141.stl",
      fallbackUrl: "https://api.smk.dk/api/v1/download-3d/1z40kz34x_KAS185_small.stl",
      note: "SMK catalogs the object itself as a plaster cast. The source record identifies the original as the Esquiline / Anadyomene Aphrodite type from Rome, held in the Palazzo dei Conservatori."
    }),
    defaults: {
      zoom: 2.86,
      lightAngle: 28,
      lightPower: 2.12,
      exposure: 0.43,
      rough: 0.2
    },
    model: {
      primaryUrl: "./aphrodite_anadyomene_source_small.stl",
      fallbackUrl: "./aphrodite_anadyomene_source_small.stl"
    }
  },
  "herakles-lansdowne": {
    kind: "stl",
    path: "/herakles-lansdowne/",
    sectionId: "greek-classical",
    sortOrder: 28.85,
    viewerTitle: "Herakles Lansdowne (Roman copy after a mid-4th-century BCE Greek original)",
    subtitle: "Artist: Unknown Roman workshop after a classical Greek original",
    medium: "Marble",
    dimensions: "H: 208 cm | W: 88 cm | D: 76 cm",
    lobbyMeta: "Source: SMK Open plaster-cast scan (KAS224)",
    source: smkSource({
      summary: "SMK Open source mesh for the Lansdowne Herakles type, localized into Form Gallery's native STL viewer.",
      recordUrl: "https://open.smk.dk/en/artwork/image/KAS224",
      fullUrl: "https://api.smk.dk/api/v1/download-3d/mg74qr49g_smk-110-kas224.stl",
      fallbackUrl: "https://api.smk.dk/api/v1/download-3d/kd17cz49m_KAS224_small.stl",
      note: "SMK catalogs the object itself as a plaster cast. The source record links the original to the Hadrianic Villa findspot at Tivoli and the Getty's Lansdowne Herakles."
    }),
    defaults: {
      zoom: 2.98,
      lightAngle: 30,
      lightPower: 2.2,
      exposure: 0.43,
      rough: 0.2
    },
    model: {
      primaryUrl: "./herakles_lansdowne_source_small.stl",
      fallbackUrl: "./herakles_lansdowne_source_small.stl"
    }
  },
  "kneeling-archer": {
    kind: "stl",
    path: "/kneeling-archer/",
    sectionId: "greek-classical",
    sortOrder: 26.8,
    viewerTitle: "Kneeling Archer (Aphaia temple figure, c. 500-490 BCE)",
    subtitle: "Artist: Unknown Greek sculptor",
    medium: "Marble",
    dimensions: "H: 104 cm",
    lobbyMeta: "Source: SMK Open plaster-cast scan (KAS2125)",
    source: smkSource({
      summary: "SMK Open source mesh for the Kneeling Archer from the Temple of Aphaia, localized into Form Gallery's native STL viewer.",
      recordUrl: "https://open.smk.dk/en/artwork/image/KAS2125",
      fullUrl: "https://api.smk.dk/api/v1/download-3d/tt44ps735_smk-kas2125-aphaia-kneeling-archer.stl",
      fallbackUrl: "https://api.smk.dk/api/v1/download-3d/kh04dv58t_KAS2125.stl",
      note: "SMK catalogs the object itself as a plaster cast. The source record identifies the original as a west-pediment figure from the Temple of Aphaia on Aegina."
    }),
    defaults: {
      zoom: 2.72,
      lightAngle: 24,
      lightPower: 2.08,
      exposure: 0.42,
      rough: 0.2
    },
    model: {
      primaryUrl: "./kneeling_archer_source_small.stl",
      fallbackUrl: "./kneeling_archer_source_small.stl"
    }
  },
  "castor-and-pollux": {
    kind: "stl",
    path: "/castor-and-pollux/",
    sectionId: "roman-world",
    sortOrder: 28.55,
    viewerTitle: "Castor and Pollux (Roman group, 1st century BCE)",
    subtitle: "Artist: Unknown Roman workshop",
    medium: "Marble group",
    dimensions: "H: 158 cm | W: 101 cm | D: 51 cm",
    lobbyMeta: "Source: SMK Open plaster-cast scan (KAS2362)",
    source: smkSource({
      summary: "SMK Open source mesh for Castor and Pollux, localized into Form Gallery's native STL viewer.",
      recordUrl: "https://open.smk.dk/en/artwork/image/KAS2362",
      fullUrl: "https://api.smk.dk/api/v1/download-3d/cv43p265m_smk54-kas2362-castor-and-pollux-d.stl",
      fallbackUrl: "https://api.smk.dk/api/v1/download-3d/4j03d4287_KAS2362_small.stl",
      note: "SMK catalogs the object itself as a plaster cast. The source record traces the original group through the Ludovisi and Odescalchi collections to the Prado."
    }),
    defaults: {
      zoom: 3.12,
      lightAngle: 26,
      lightPower: 2.14,
      exposure: 0.43,
      rough: 0.2
    },
    model: {
      primaryUrl: "./castor_and_pollux_source_small.stl",
      fallbackUrl: "./castor_and_pollux_source_small.stl"
    }
  },
  "athena-pallas-giustiniani": {
    kind: "stl",
    path: "/athena-pallas-giustiniani/",
    sectionId: "greek-classical",
    sortOrder: 27.9,
    viewerTitle: "Athena Pallas Giustiniani (Roman copy after a Greek original, early 4th century BCE type)",
    subtitle: "Artist: Unknown Roman workshop after a classical Greek original",
    medium: "Marble",
    dimensions: "H: 219 cm | W: 93 cm | D: 65 cm",
    lobbyMeta: "Source: SMK Open plaster-cast scan (KAS255)",
    source: smkSource({
      summary: "SMK Open source mesh for Athena Pallas Giustiniani, localized into Form Gallery's native STL viewer.",
      recordUrl: "https://open.smk.dk/en/artwork/image/KAS255",
      fullUrl: "https://api.smk.dk/api/v1/download-3d/g732df32k_smk52-kas255-athena-pallas-giustiniani.stl",
      fallbackUrl: "https://api.smk.dk/api/v1/download-3d/pz50h152p_KAS255_small.stl",
      note: "SMK catalogs the object itself as a plaster cast. The source record identifies the original as the Athena Pallas Giustiniani type in the Vatican's Museo Chiaramonti and dates the Greek prototype to the early 4th century BCE."
    }),
    defaults: {
      zoom: 2.92,
      lightAngle: 28,
      lightPower: 2.16,
      exposure: 0.43,
      rough: 0.2
    },
    model: {
      primaryUrl: "./athena_pallas_giustiniani_source_small.stl",
      fallbackUrl: "./athena_pallas_giustiniani_source_small.stl"
    }
  },
  "medici-faun": {
    kind: "stl",
    path: "/medici-faun/",
    sectionId: "hellenistic-world",
    sortOrder: 29.1,
    viewerTitle: "Medici Faun (Roman copy after a Hellenistic original, c. 200 BCE)",
    subtitle: "Artist: Unknown Roman workshop after a Hellenistic original",
    medium: "Marble",
    dimensions: "H: 141.5 cm | W: 81 cm | D: 54.5 cm",
    lobbyMeta: "Source: SMK Open plaster-cast scan (KAS460)",
    source: smkSource({
      summary: "SMK Open source mesh for the Medici Faun, localized into Form Gallery's native STL viewer.",
      recordUrl: "https://open.smk.dk/en/artwork/image/KAS460",
      fullUrl: "https://api.smk.dk/api/v1/download-3d/kk91fr31m_09-smk-dancing-satyr-inv-460.stl",
      fallbackUrl: "https://api.smk.dk/api/v1/download-3d/44558j590_KAS460_small.stl",
      note: "SMK catalogs the object itself as a plaster cast. The source record identifies the original as the Medici Faun / dancing satyr type in the Uffizi and dates the Greek prototype to around 200 BCE."
    }),
    defaults: {
      zoom: 2.88,
      lightAngle: 28,
      lightPower: 2.12,
      exposure: 0.43,
      rough: 0.2
    },
    model: {
      primaryUrl: "./medici_faun_source_small.stl",
      fallbackUrl: "./medici_faun_source_small.stl"
    }
  },
  "head-from-farnese-hercules-type": {
    kind: "stl",
    path: "/head-from-farnese-hercules-type/",
    sectionId: "roman-world",
    sortOrder: 28.15,
    viewerTitle: "Head from the Farnese Hercules Type (Roman marble head after a Greek prototype)",
    subtitle: "Artist: Unknown Roman workshop after a classical Greek original",
    medium: "Marble",
    dimensions: "H: 74.7 cm",
    lobbyMeta: "Source: SMK Open plaster-cast scan (KAS701)",
    source: source(
      "SMK Open source mesh for the Farnese Hercules head type, localized into Form Gallery's native STL viewer.",
      [
        link("SMK record", "https://open.smk.dk/en/artwork/image/KAS701"),
        link("Full STL", "https://api.smk.dk/api/v1/download-3d/f4752n479_smk26-kas701-head-from-farnese-hercules.stl"),
        link("Optimized STL", "https://api.smk.dk/api/v1/download-3d/nk322j800_KAS701_small.stl"),
        link("British Museum reference", "https://www.britishmuseum.org/collection/object/G_1776-1108-2")
      ],
      "SMK catalogs the object itself as a plaster cast after a Roman copy of the Farnese Hercules type. The height listed here follows the British Museum record for the marble head."
    ),
    defaults: {
      zoom: 2.44,
      lightAngle: 24,
      lightPower: 2.16,
      exposure: 0.42,
      rough: 0.22
    },
    model: {
      primaryUrl: "./farnese_hercules_head_source_small.stl",
      fallbackUrl: "./farnese_hercules_head_source_small.stl"
    },
    scene: {
      targetHeight: 1.08,
      defaultYaw: Math.PI * 0.08,
      defaultViewVector: [0.94, 0.42, 1.54],
      mobileViewVector: [0.7, 0.34, 1.38]
    }
  },
  "borghese-gladiator": {
    kind: "stl",
    path: "/borghese-gladiator/",
    sectionId: "hellenistic-world",
    sortOrder: 37.5,
    viewerTitle: "Borghese Gladiator (Roman copy after a Greek original, c. 100 BCE)",
    subtitle: "Artist: Agasias of Ephesos (traditional inscription attribution)",
    medium: "Marble",
    dimensions: "H: 166 cm | W: 131.5 cm | D: 152.5 cm",
    lobbyMeta: "Source: Wikimedia Commons STL; SMK cast record for context",
    source: source(
      "Local STL mirrored from the Wikimedia Commons file for the Borghese Gladiator cast, with SMK Open used for contextual record details and dimensions.",
      [
        link("Wikimedia Commons file page", "https://commons.wikimedia.org/wiki/File:Den_borghesiske_F%C3%A6gter,_Agasias_fra_Ephesos_-_KAS499.stl"),
        link("SMK context record", "https://open.smk.dk/en/artwork/image/KAS499")
      ],
      "The Commons file page lists the STL under CC BY-SA 4.0. SMK's linked original record places the marble statue in the Louvre and dates the Roman copy to around 100 BCE."
    ),
    defaults: {
      zoom: 3.18,
      lightAngle: 28,
      lightPower: 2.18,
      exposure: 0.43,
      rough: 0.2
    },
    model: {
      primaryUrl: "./borghese_gladiator_source_small.stl",
      fallbackUrl: "./borghese_gladiator_source_small.stl"
    },
    scene: {
      targetHeight: 1.62
    }
  },
  "doryphoros": {
    kind: "stl",
    path: "/doryphoros/",
    sectionId: "greek-classical",
    sortOrder: 27.1,
    viewerTitle: "Doryphoros / Spear-Bearer (Roman copy after Polykleitos, c. 450 BCE original)",
    subtitle: "Artist: Unknown Roman workshop after Polykleitos",
    medium: "Marble",
    dimensions: "H: 213 cm | W: 75.5 cm | D: 77 cm",
    lobbyMeta: "Source: SMK Open plaster-cast scan (KAS11)",
    source: smkSource({
      summary: "SMK Open source mesh for the Doryphoros / Spear-Bearer type, localized into Form Gallery's native STL viewer.",
      recordUrl: "https://open.smk.dk/en/artwork/image/KAS11",
      fullUrl: "https://api.smk.dk/api/v1/download-3d/q237hx73t_smk-doryphoros.stl",
      fallbackUrl: "https://api.smk.dk/api/v1/download-3d/th83m405d_KAS11_small.stl",
      note: "SMK catalogs the object itself as a plaster cast. The source record identifies the original as the Doryphoros type found at Pompeii and now in the Museo Archeologico Nazionale di Napoli, following a Greek classical prototype associated with Polykleitos."
    }),
    defaults: {
      zoom: 2.96,
      lightAngle: 28,
      lightPower: 2.16,
      exposure: 0.42,
      rough: 0.2
    },
    model: {
      primaryUrl: "./doryphoros_source_small.stl",
      fallbackUrl: "./doryphoros_source_small.stl"
    },
    scene: {
      targetHeight: 1.86,
      defaultYaw: 0,
      defaultViewVector: [1.28, 0.62, 1.92],
      mobileViewVector: [0.94, 0.48, 1.78]
    }
  },
  "doryphoros-torso": {
    kind: "stl",
    path: "/doryphoros-torso/",
    sectionId: "greek-classical",
    sortOrder: 27.2,
    viewerTitle: "Doryphoros Torso / Pourtales Torso (Roman fragment after Polykleitos)",
    subtitle: "Artist: Unknown Roman workshop after Polykleitos",
    medium: "Marble",
    dimensions: "H: 146 cm",
    lobbyMeta: "Source: SMK Open plaster-cast scan (KAS1242)",
    source: smkSource({
      summary: "SMK Open source mesh for the Pourtales Torso, a Doryphoros-related fragment localized into Form Gallery's native STL viewer.",
      recordUrl: "https://open.smk.dk/en/artwork/image/KAS1242",
      fullUrl: "https://api.smk.dk/api/v1/download-3d/qn59q832b_185-smk-kas1242.stl",
      fallbackUrl: "https://api.smk.dk/api/v1/download-3d/3b591f10n_KAS1242_small.stl",
      note: "SMK catalogs the object itself as a plaster cast. The source record identifies the original as the Pourtales Torso, a Roman marble fragment of the Doryphoros type formerly associated with the Palatine and now in the Staatliche Museen."
    }),
    defaults: {
      zoom: 2.4,
      lightAngle: 26,
      lightPower: 2.14,
      exposure: 0.42,
      rough: 0.22
    },
    model: {
      primaryUrl: "./doryphoros_torso_source_small.stl",
      fallbackUrl: "./doryphoros_torso_source_small.stl"
    },
    scene: {
      targetHeight: 1.24,
      focusYRatio: 0.55,
      defaultYaw: Math.PI * 0.04,
      defaultViewVector: [0.96, 0.4, 1.56],
      mobileViewVector: [0.72, 0.32, 1.38]
    }
  },
  "diadoumenos-bust": {
    kind: "stl",
    path: "/diadoumenos-bust/",
    sectionId: "greek-classical",
    sortOrder: 27.3,
    viewerTitle: "Diadoumenos Bust (Roman copy after Polykleitos, c. 420 BCE original)",
    subtitle: "Artist: Unknown Roman workshop after Polykleitos",
    medium: "Marble",
    dimensions: "H: 61 cm",
    lobbyMeta: "Source: SMK Open plaster-cast scan (KAS432)",
    source: smkSource({
      summary: "SMK Open source mesh for a Diadoumenos bust, localized into Form Gallery's native STL viewer.",
      recordUrl: "https://open.smk.dk/en/artwork/image/KAS432",
      fullUrl: "https://api.smk.dk/api/v1/download-3d/zk51vn418_smk19-kas432-diadoumenos-bust-d.stl",
      fallbackUrl: "https://api.smk.dk/api/v1/download-3d/fx719s41q_KAS432_small.stl",
      note: "SMK catalogs the object itself as a plaster cast. The source record identifies the original as a Roman marble bust after the Diadoumenos type, with the Greek classical prototype associated with Polykleitos."
    }),
    defaults: {
      zoom: 2.2,
      lightAngle: 24,
      lightPower: 2.12,
      exposure: 0.42,
      rough: 0.22
    },
    model: {
      primaryUrl: "./diadoumenos_bust_source_small.stl",
      fallbackUrl: "./diadoumenos_bust_source_small.stl"
    },
    scene: {
      targetHeight: 0.98,
      focusYRatio: 0.54,
      defaultYaw: Math.PI * 0.06,
      defaultViewVector: [0.82, 0.34, 1.28],
      mobileViewVector: [0.64, 0.28, 1.16]
    }
  },
  "kneeling-youth": {
    kind: "stl",
    path: "/kneeling-youth/",
    sectionId: "hellenistic-world",
    sortOrder: 28.5,
    viewerTitle: "Kneeling Youth / Ilioneus (Roman copy after a Hellenistic original, c. 300 BCE)",
    subtitle: "Artist: Unknown Roman workshop after a Greek original",
    medium: "Marble",
    dimensions: "H: 120 cm | W: 79.5 cm | D: 57 cm",
    lobbyMeta: "Source: SMK Open plaster-cast scan (KAS248)",
    source: smkSource({
      summary: "SMK Open source mesh for the kneeling youth traditionally identified as Ilioneus, localized into Form Gallery's native STL viewer.",
      recordUrl: "https://open.smk.dk/en/artwork/image/KAS248",
      fullUrl: "https://api.smk.dk/api/v1/download-3d/mp48sj40r_smk7-kas248-kneeling-youth.stl",
      fallbackUrl: "https://api.smk.dk/api/v1/download-3d/rr172264n_KAS248_small.stl",
      note: "SMK catalogs the object itself as a plaster cast. The source record describes the original as a Roman marble copy of a Greek figure identified as Ilioneus or a Niobid, now in the Staatliche Antikensammlungen und Glyptothek."
    }),
    defaults: {
      zoom: 2.82,
      lightAngle: 26,
      lightPower: 2.12,
      exposure: 0.42,
      rough: 0.2
    },
    model: {
      primaryUrl: "./kneeling_youth_source_small.stl",
      fallbackUrl: "./kneeling_youth_source_small.stl"
    },
    scene: {
      targetHeight: 1.18,
      focusYRatio: 0.52,
      defaultYaw: -Math.PI * 0.04,
      defaultViewVector: [1.14, 0.38, 1.82],
      mobileViewVector: [0.84, 0.3, 1.62]
    }
  },
  "antinoos-farnese": {
    kind: "stl",
    path: "/antinoos-farnese/",
    sectionId: "roman-world",
    sortOrder: 27.8,
    viewerTitle: "Antinoos Farnese (Roman statue, c. 125-138 CE)",
    subtitle: "Artist: Unknown Roman workshop",
    medium: "Marble",
    dimensions: "H: 199 cm | W: 76 cm | D: 51.5 cm",
    lobbyMeta: "Source: SMK Open plaster-cast scan (KAS229)",
    source: smkSource({
      summary: "SMK Open source mesh for Antinoos Farnese, localized into Form Gallery's native STL viewer.",
      recordUrl: "https://open.smk.dk/en/artwork/image/KAS229",
      fullUrl: "https://api.smk.dk/api/v1/download-3d/bv73c474q_smk-farnese-antinous-inv-6030-scan-the-world.stl",
      fallbackUrl: "https://api.smk.dk/api/v1/download-3d/fj236691w_KAS229_small.stl",
      note: "SMK catalogs the object itself as a plaster cast. The source record identifies the original as the Antinoos Farnese statue in the Museo Archeologico Nazionale di Napoli and dates it to the Roman imperial period."
    }),
    defaults: {
      zoom: 2.98,
      lightAngle: 28,
      lightPower: 2.16,
      exposure: 0.42,
      rough: 0.2
    },
    model: {
      primaryUrl: "./antinoos_farnese_source_small.stl",
      fallbackUrl: "./antinoos_farnese_source_small.stl"
    },
    scene: {
      targetHeight: 1.84,
      defaultYaw: Math.PI * 0.02,
      defaultViewVector: [1.22, 0.58, 1.92],
      mobileViewVector: [0.92, 0.44, 1.76]
    }
  },
  "crouching-venus": {
    kind: "stl",
    path: "/crouching-venus/",
    sectionId: "hellenistic-world",
    sortOrder: 28.35,
    viewerTitle: "Crouching Venus (Roman copy after a Hellenistic original, 3rd century BCE type)",
    subtitle: "Artist: Unknown Roman workshop after a Hellenistic original",
    medium: "Marble",
    dimensions: "H: 87.5 cm | W: 56 cm | D: 42 cm",
    lobbyMeta: "Source: SMK Open plaster-cast scan (KAS618)",
    source: smkSource({
      summary: "SMK Open source mesh for the Crouching Venus type, localized into Form Gallery's native STL viewer.",
      recordUrl: "https://open.smk.dk/en/artwork/image/KAS618",
      fullUrl: "https://api.smk.dk/api/v1/download-3d/mc87pv84t_smk6-kas618-crouching-venus.stl",
      fallbackUrl: "https://api.smk.dk/api/v1/download-3d/cj82kc853_KAS618_small.stl",
      note: "SMK catalogs the object itself as a plaster cast. The source record identifies the original as the crouching Venus type in the Museo Pio Clementino and traces it to a Hellenistic Greek prototype."
    }),
    defaults: {
      zoom: 2.56,
      lightAngle: 24,
      lightPower: 2.1,
      exposure: 0.42,
      rough: 0.22
    },
    model: {
      primaryUrl: "./crouching_venus_source_small.stl",
      fallbackUrl: "./crouching_venus_source_small.stl"
    },
    scene: {
      targetHeight: 1.1,
      focusYRatio: 0.5,
      defaultYaw: -Math.PI * 0.08,
      defaultViewVector: [1.06, 0.34, 1.62],
      mobileViewVector: [0.8, 0.28, 1.48]
    }
  },
  "menippos": {
    kind: "stl",
    path: "/menippos/",
    sectionId: "hellenistic-world",
    sortOrder: 28.95,
    viewerTitle: "Menippos of Gadara? (Roman copy after a Hellenistic philosopher portrait type)",
    subtitle: "Artist: Unknown Roman workshop after a Hellenistic original",
    medium: "Marble",
    dimensions: "H: 185 cm | W: 82.5 cm | D: 63 cm",
    lobbyMeta: "Source: SMK Open plaster-cast scan (KAS240)",
    source: smkSource({
      summary: "SMK Open source mesh for the standing philosopher traditionally identified as Menippos of Gadara, localized into Form Gallery's native STL viewer.",
      recordUrl: "https://open.smk.dk/en/artwork/image/KAS240",
      fullUrl: "https://api.smk.dk/api/v1/download-3d/5m60qx27n_smk-109-kas240.stl",
      fallbackUrl: "https://api.smk.dk/api/v1/download-3d/qv33s222k_KAS240_small.stl",
      note: "SMK catalogs the object itself as a plaster cast. The source record describes the original as a Roman copy after a mid-Hellenistic philosopher portrait, with the Menippos identification treated as traditional rather than certain."
    }),
    defaults: {
      zoom: 2.94,
      lightAngle: 28,
      lightPower: 2.12,
      exposure: 0.42,
      rough: 0.2
    },
    model: {
      primaryUrl: "./menippos_source_small.stl",
      fallbackUrl: "./menippos_source_small.stl"
    },
    scene: {
      targetHeight: 1.8,
      defaultYaw: Math.PI * 0.05,
      defaultViewVector: [1.2, 0.58, 1.92],
      mobileViewVector: [0.92, 0.44, 1.76]
    }
  },
  "old-fisherman": {
    kind: "stl",
    path: "/old-fisherman/",
    sectionId: "hellenistic-world",
    sortOrder: 29.4,
    viewerTitle: "Old Fisherman (\"Dying Seneca\" type, Roman copy after a Hellenistic original)",
    subtitle: "Artist: Unknown Roman workshop after a Hellenistic original",
    medium: "Black marble, alabaster",
    dimensions: "H: 130 cm | W: 74 cm | D: 86 cm",
    lobbyMeta: "Source: SMK Open plaster-cast scan (KAS2288)",
    source: smkSource({
      summary: "SMK Open source mesh for the figure traditionally known as the Old Fisherman or 'Dying Seneca' type, localized into Form Gallery's native STL viewer.",
      recordUrl: "https://open.smk.dk/en/artwork/image/KAS2288",
      fullUrl: "https://api.smk.dk/api/v1/download-3d/5x21tk78x_smk57-kas2288-dying-seneca-d.stl",
      fallbackUrl: "https://api.smk.dk/api/v1/download-3d/x920g267z_KAS2288_small.stl",
      note: "SMK catalogs the object itself as a plaster cast. The source record identifies the original as the black-marble and alabaster fisherman figure in the Louvre, long mislabeled as 'Dying Seneca' and now understood as a Hellenistic genre figure."
    }),
    defaults: {
      zoom: 2.78,
      lightAngle: 26,
      lightPower: 2.1,
      exposure: 0.42,
      rough: 0.22
    },
    model: {
      primaryUrl: "./old_fisherman_source_small.stl",
      fallbackUrl: "./old_fisherman_source_small.stl"
    },
    scene: {
      targetHeight: 1.36,
      defaultYaw: -Math.PI * 0.04,
      defaultViewVector: [1.08, 0.42, 1.74],
      mobileViewVector: [0.84, 0.34, 1.56]
    }
  },
  porcellino: {
    kind: "stl",
    path: "/porcellino/",
    sectionId: "hellenistic-world",
    sortOrder: 29.9,
    viewerTitle: "Porcellino / Seated Boar (Roman copy after a Hellenistic original)",
    subtitle: "Artist: Unknown Roman workshop after a Hellenistic original",
    medium: "Marble",
    dimensions: "H: 137 cm | W: 154 cm | D: 93 cm",
    lobbyMeta: "Source: SMK Open plaster-cast scan (KAS2157)",
    source: smkSource({
      summary: "SMK Open source mesh for the seated boar known as Porcellino, localized into Form Gallery's native STL viewer.",
      recordUrl: "https://open.smk.dk/en/artwork/image/KAS2157",
      fullUrl: "https://api.smk.dk/api/v1/download-3d/r207tt73g_porcellino.stl",
      fallbackUrl: "https://api.smk.dk/api/v1/download-3d/1n79h940q_KAS2157_small.stl",
      note: "SMK catalogs the object itself as a plaster cast. The source record identifies the original as a Roman copy after a Hellenistic boar type, with the famed bronze fountain version by Pietro Tacca noted separately in the provenance history."
    }),
    defaults: {
      zoom: 2.72,
      lightAngle: 26,
      lightPower: 2.08,
      exposure: 0.42,
      rough: 0.24
    },
    model: {
      primaryUrl: "./porcellino_source_small.stl",
      fallbackUrl: "./porcellino_source_small.stl"
    },
    scene: {
      targetHeight: 1.22,
      focusYRatio: 0.48,
      defaultYaw: Math.PI * 0.08,
      defaultViewVector: [1.18, 0.34, 1.78],
      mobileViewVector: [0.92, 0.28, 1.54]
    }
  },
  lion: {
    kind: "stl",
    path: "/lion/",
    sectionId: "greek-classical",
    sortOrder: 25.9,
    viewerTitle: "Lion from the Nereid Monument (c. 390 BCE)",
    subtitle: "Artist: Unknown Lycian sculptor",
    medium: "Marble",
    dimensions: "W: 160 cm | D: 51 cm",
    lobbyMeta: "Source: SMK Open plaster-cast scan (KAS1016)",
    source: smkSource({
      summary: "SMK Open source mesh for the lion from the Nereid Monument, localized into Form Gallery's native STL viewer.",
      recordUrl: "https://open.smk.dk/en/artwork/image/KAS1016",
      fullUrl: "https://api.smk.dk/api/v1/download-3d/g158bn64c_smk-54-lion.stl",
      fallbackUrl: "https://api.smk.dk/api/v1/download-3d/qf85nh32s_KAS1016_small.stl",
      note: "SMK catalogs the object itself as a plaster cast. The source record identifies the original as a lion from the Nereid Monument at Xanthos, now in the British Museum, and dates it to about 390 BCE."
    }),
    defaults: {
      zoom: 2.74,
      lightAngle: 24,
      lightPower: 2.08,
      exposure: 0.42,
      rough: 0.24
    },
    model: {
      primaryUrl: "./lion_source_small.stl",
      fallbackUrl: "./lion_source_small.stl"
    },
    scene: {
      targetHeight: 1.16,
      focusYRatio: 0.48,
      defaultYaw: -Math.PI * 0.14,
      defaultViewVector: [1.2, 0.32, 1.74],
      mobileViewVector: [0.94, 0.26, 1.52]
    }
  },
  "hermes-antinoos-from-belvedere": {
    kind: "stl",
    path: "/hermes-antinoos-from-belvedere/",
    sectionId: "greek-classical",
    sortOrder: 26.8,
    viewerTitle: "Hermes (Belvedere Antinous type, Roman copy after a classical Greek original)",
    subtitle: "Artist: Unknown Roman workshop after a classical Greek original",
    medium: "Marble",
    dimensions: "H: 233.5 cm | W: 80 cm | D: 66.5 cm",
    lobbyMeta: "Source: SMK Open plaster-cast scan (KAS1161)",
    source: smkSource({
      summary: "SMK Open source mesh for the Belvedere Antinous type, now often identified as Hermes, localized into Form Gallery's native STL viewer.",
      recordUrl: "https://open.smk.dk/en/artwork/image/KAS1161",
      fullUrl: "https://api.smk.dk/api/v1/download-3d/js956m23t_smk38-kas1161.stl",
      fallbackUrl: "https://api.smk.dk/api/v1/download-3d/0v838549t_KAS1161_small.stl",
      note: "SMK catalogs the object itself as a plaster cast. The source record explains the traditional Antinous identification while noting that the figure is now more often read as Hermes; the original is in the Museo Pio Clementino."
    }),
    defaults: {
      zoom: 2.96,
      lightAngle: 28,
      lightPower: 2.14,
      exposure: 0.42,
      rough: 0.2
    },
    model: {
      primaryUrl: "./hermes_antinoos_from_belvedere_source_small.stl",
      fallbackUrl: "./hermes_antinoos_from_belvedere_source_small.stl"
    },
    scene: {
      targetHeight: 1.9,
      defaultYaw: Math.PI * 0.03,
      defaultViewVector: [1.2, 0.58, 1.92],
      mobileViewVector: [0.92, 0.44, 1.76]
    }
  },
  "portrait-of-antinoos": {
    kind: "stl",
    path: "/portrait-of-antinoos/",
    sectionId: "roman-world",
    sortOrder: 28.4,
    viewerTitle: "Portrait of Antinoos (Roman bust, 2nd century CE)",
    subtitle: "Artist: Unknown Roman workshop",
    medium: "Marble",
    dimensions: "H: 119 cm",
    lobbyMeta: "Source: SMK Open plaster-cast scan (KAS836)",
    source: smkSource({
      summary: "SMK Open source mesh for the portrait bust of Antinoos, localized into Form Gallery's native STL viewer.",
      recordUrl: "https://open.smk.dk/en/artwork/image/KAS836",
      fullUrl: "https://api.smk.dk/api/v1/download-3d/xw42nc95h_smk48-kas836-portrait-of-antinous-d-no-base.stl",
      fallbackUrl: "https://api.smk.dk/api/v1/download-3d/wp988q70q_KAS836-no-base_small.stl",
      note: "SMK catalogs the object itself as a plaster cast. The source record identifies the original as a Roman portrait of Antinoos from Hadrian's Villa, now in the Museo Pio Clementino."
    }),
    defaults: {
      zoom: 2.42,
      lightAngle: 24,
      lightPower: 2.16,
      exposure: 0.42,
      rough: 0.2
    },
    model: {
      primaryUrl: "./portrait_of_antinoos_source_small.stl",
      fallbackUrl: "./portrait_of_antinoos_source_small.stl"
    },
    scene: {
      targetHeight: 1.02,
      focusYRatio: 0.56,
      defaultYaw: Math.PI * 0.08,
      defaultViewVector: [0.96, 0.42, 1.52],
      mobileViewVector: [0.78, 0.34, 1.38]
    }
  },
  "strangford-shield": {
    kind: "stl",
    path: "/strangford-shield/",
    sectionId: "greek-classical",
    sortOrder: 27.15,
    viewerTitle: "Strangford Shield (Amazonomachy from the Athena Parthenos shield)",
    subtitle: "Artist: Unknown Roman workshop after a classical Greek original",
    medium: "Marble relief",
    dimensions: "H: 39 cm | W: 54 cm",
    lobbyMeta: "Source: SMK Open plaster-cast scan (KAS767)",
    source: smkSource({
      summary: "SMK Open source mesh for the Strangford Shield relief, localized into Form Gallery's native STL viewer.",
      recordUrl: "https://open.smk.dk/en/artwork/image/KAS767",
      fullUrl: "https://api.smk.dk/api/v1/download-3d/bv73c4750_strangford-skjoldet-repaired-2022.stl",
      fallbackUrl: "https://api.smk.dk/api/v1/download-3d/5x21tk87w_KAS767-repaired_small.stl",
      note: "SMK catalogs the object itself as a plaster cast. The source record identifies the original as the so-called Strangford Shield, a Roman copy of the Amazonomachy shield composition associated with Phidias' Athena Parthenos."
    }),
    defaults: {
      zoom: 2.18,
      lightAngle: 24,
      lightPower: 2.06,
      exposure: 0.42,
      rough: 0.24
    },
    model: {
      primaryUrl: "./strangford_shield_source_small.stl",
      fallbackUrl: "./strangford_shield_source_small.stl"
    },
    scene: {
      targetHeight: 0.92,
      focusYRatio: 0.54,
      defaultYaw: -Math.PI * 0.08,
      defaultViewVector: [0.94, 0.24, 1.34],
      mobileViewVector: [0.78, 0.2, 1.18]
    }
  },
  "dionysos-farnese": {
    kind: "stl",
    path: "/dionysos-farnese/",
    sectionId: "hellenistic-world",
    sortOrder: 30.35,
    viewerTitle: "Dionysos Farnese (Roman copy after a Hellenistic original)",
    subtitle: "Artist: Unknown Roman workshop after a Hellenistic original",
    medium: "Marble",
    dimensions: "H: 95 cm | W: 68 cm | D: 72 cm",
    lobbyMeta: "Source: SMK Open plaster-cast scan (KAS99)",
    source: smkSource({
      summary: "SMK Open source mesh for the seated Dionysos Farnese torso, localized into Form Gallery's native STL viewer.",
      recordUrl: "https://open.smk.dk/en/artwork/image/KAS99",
      fullUrl: "https://api.smk.dk/api/v1/download-3d/n870zw578_smk-47-kas99.stl",
      fallbackUrl: "https://api.smk.dk/api/v1/download-3d/2b88qh62d_KAS99_small.stl",
      note: "SMK catalogs the object itself as a plaster cast. The source record identifies the original as a Roman copy of a Hellenistic Dionysos type in the Museo Archeologico Nazionale di Napoli."
    }),
    defaults: {
      zoom: 2.42,
      lightAngle: 24,
      lightPower: 2.08,
      exposure: 0.42,
      rough: 0.22
    },
    model: {
      primaryUrl: "./dionysos_farnese_source_small.stl",
      fallbackUrl: "./dionysos_farnese_source_small.stl"
    },
    scene: {
      targetHeight: 1.0,
      focusYRatio: 0.54,
      defaultYaw: Math.PI * 0.08,
      defaultViewVector: [0.98, 0.34, 1.46],
      mobileViewVector: [0.8, 0.26, 1.3]
    }
  },
  "michelangelo-crouching-boy": {
    kind: "stl",
    path: "/michelangelo/crouching-boy/",
    sectionId: "michelangelo",
    sortOrder: 125,
    viewerTitle: "Crouching Boy (c. 1526-1533)",
    subtitle: MICHELANGELO_SUBTITLE,
    medium: "Marble",
    dimensions: "H: 61 cm | W: 43.5 cm | D: 45.5 cm",
    lobbyMeta: "Source: SMK Open plaster-cast scan (KAS2382)",
    source: smkSource({
      summary: "SMK Open source mesh for Michelangelo's Crouching Boy, localized into Form Gallery's native STL viewer.",
      recordUrl: "https://open.smk.dk/en/artwork/image/KAS2382",
      fullUrl: "https://api.smk.dk/api/v1/download-3d/q524jt29h_smk-51-kas2382.stl",
      fallbackUrl: "https://api.smk.dk/api/v1/download-3d/3197xs07d_KAS2382_small.stl",
      note: "SMK catalogs the object itself as a plaster cast. The source record identifies the original as Michelangelo's Crouching Boy in the Hermitage and dates the sculpture to about 1526-1533."
    }),
    defaults: {
      zoom: 2.48,
      lightAngle: 28,
      lightPower: 2.14,
      exposure: 0.42,
      rough: 0.2
    },
    model: {
      primaryUrl: "./crouching_boy_source_small.stl",
      fallbackUrl: "./crouching_boy_source_small.stl"
    },
    scene: {
      targetHeight: 1.02,
      focusYRatio: 0.5,
      defaultYaw: -Math.PI * 0.1,
      defaultViewVector: [0.96, 0.3, 1.42],
      mobileViewVector: [0.78, 0.24, 1.28]
    }
  },
  penelope: {
    kind: "stl",
    path: "/penelope/",
    sectionId: "greek-classical",
    sortOrder: 27.35,
    viewerTitle: "Penelope (Roman copy after a Greek original, c. 460 BCE)",
    subtitle: SMK_CAST_SUBTITLE,
    medium: "Marble",
    dimensions: "H: 124 cm | W: 74.5 cm | D: 46 cm",
    lobbyMeta: "Source: SMK Open plaster-cast scan (KAS202)",
    source: smkSource({
      summary: "SMK Open source mesh for Penelope, localized into Form Gallery's native STL viewer.",
      recordUrl: "https://open.smk.dk/en/artwork/image/KAS202",
      fullUrl: "https://api.smk.dk/api/v1/download-3d/b5644x06s_penelope-1.stl",
      fallbackUrl: "https://api.smk.dk/api/v1/download-3d/dv13zz67n_KAS202_small.stl",
      note: "SMK catalogs the object itself as a plaster cast. The source record identifies the original as a Penelope type associated with the Greek classical tradition and dated around 460 BCE."
    }),
    defaults: {
      zoom: 2.46,
      lightAngle: 26,
      lightPower: 2.08,
      rough: 0.22
    },
    model: {
      primaryUrl: "./penelope_source_small.stl",
      fallbackUrl: "./penelope_source_small.stl"
    },
    scene: {
      targetHeight: 1.18,
      focusYRatio: 0.54,
      defaultYaw: -Math.PI * 0.06,
      defaultViewVector: [1.02, 0.38, 1.54],
      mobileViewVector: [0.78, 0.3, 1.36]
    }
  },
  thalia: {
    kind: "stl",
    path: "/thalia/",
    sectionId: "hellenistic-world",
    sortOrder: 30.15,
    viewerTitle: "Thalia, Muse of Comedy",
    subtitle: SMK_CAST_SUBTITLE,
    medium: "Marble",
    dimensions: "H: 161 cm | W: 80 cm | D: 86.5 cm",
    lobbyMeta: "Source: SMK Open plaster-cast scan (KAS35)",
    source: smkSource({
      summary: "SMK Open source mesh for Thalia, muse of comedy, localized into Form Gallery's native STL viewer.",
      recordUrl: "https://open.smk.dk/en/artwork/image/KAS35",
      fullUrl: "https://api.smk.dk/api/v1/download-3d/v979v730x_smk-103-kas35.stl",
      fallbackUrl: "https://api.smk.dk/api/v1/download-3d/gt54ks43p_KAS35_small.stl",
      note: "SMK catalogs the object itself as a plaster cast. The source record identifies the figure as Thalia, with theater mask and tympanon."
    }),
    defaults: {
      zoom: 2.7,
      lightAngle: 28,
      lightPower: 2.12,
      rough: 0.2
    },
    model: {
      primaryUrl: "./thalia_source_small.stl",
      fallbackUrl: "./thalia_source_small.stl"
    },
    scene: {
      targetHeight: 1.42,
      focusYRatio: 0.54,
      defaultYaw: Math.PI * 0.08,
      defaultViewVector: [1.14, 0.48, 1.72],
      mobileViewVector: [0.88, 0.38, 1.54]
    }
  },
  "aristippos-of-cyrene": {
    kind: "stl",
    path: "/aristippos-of-cyrene/",
    sectionId: "hellenistic-world",
    sortOrder: 29.55,
    viewerTitle: "Aristippos of Cyrene (seated philosopher)",
    subtitle: SMK_CAST_SUBTITLE,
    medium: "Marble",
    dimensions: "H: 128 cm | W: 57 cm | D: 90 cm",
    lobbyMeta: "Source: SMK Open plaster-cast scan (KAS207)",
    source: smkSource({
      summary: "SMK Open source mesh for the seated portrait of Aristippos of Cyrene, localized into Form Gallery's native STL viewer.",
      recordUrl: "https://open.smk.dk/en/artwork/image/KAS207",
      fullUrl: "https://api.smk.dk/api/v1/download-3d/df65vd347_smk-kas-43.stl",
      fallbackUrl: "https://api.smk.dk/api/v1/download-3d/8910k003r_KAS207_small.stl",
      note: "SMK catalogs the object itself as a plaster cast. The source record identifies the figure as Aristippos of Cyrene, seated, and labels him as a Greek philosopher."
    }),
    defaults: {
      zoom: 2.58,
      lightAngle: 28,
      lightPower: 2.1,
      rough: 0.22
    },
    model: {
      primaryUrl: "./aristippos_of_cyrene_source_small.stl",
      fallbackUrl: "./aristippos_of_cyrene_source_small.stl"
    },
    scene: {
      targetHeight: 1.24,
      focusYRatio: 0.54,
      defaultYaw: -Math.PI * 0.08,
      defaultViewVector: [1.08, 0.42, 1.58],
      mobileViewVector: [0.84, 0.34, 1.42]
    }
  },
  "dying-niobid": {
    kind: "stl",
    path: "/dying-niobid/",
    sectionId: "greek-classical",
    sortOrder: 27.45,
    viewerTitle: "Dying Niobid",
    subtitle: SMK_CAST_SUBTITLE,
    medium: "Marble",
    dimensions: "H: 149.5 cm | W: 97 cm | D: 41 cm",
    locationLabel: "Findspot:",
    location: "Sallust's Gardens, Rome",
    lobbyMeta: "Source: SMK Open plaster-cast scan (KAS2051)",
    source: smkSource({
      summary: "SMK Open source mesh for Dying Niobid, localized into Form Gallery's native STL viewer.",
      recordUrl: "https://open.smk.dk/en/artwork/image/KAS2051",
      fullUrl: "https://api.smk.dk/api/v1/download-3d/w6634853q_smk36-kas2051.stl",
      fallbackUrl: "https://api.smk.dk/api/v1/download-3d/w9505475s_KAS2051_small.stl",
      note: "SMK catalogs the object itself as a plaster cast. The source record identifies the figure as a dying Niobid from the classical myth cycle and ties the original to Sallust's Gardens in Rome."
    }),
    defaults: {
      zoom: 2.72,
      lightAngle: 27,
      lightPower: 2.12,
      rough: 0.2
    },
    model: {
      primaryUrl: "./dying_niobid_source_small.stl",
      fallbackUrl: "./dying_niobid_source_small.stl"
    },
    scene: {
      targetHeight: 1.42,
      focusYRatio: 0.5,
      defaultYaw: Math.PI * 0.06,
      defaultViewVector: [1.1, 0.42, 1.72],
      mobileViewVector: [0.86, 0.34, 1.5]
    }
  },
  hestia: {
    kind: "stl",
    path: "/hestia/",
    sectionId: "greek-classical",
    sortOrder: 27.4,
    viewerTitle: "Hestia? (east pediment figure from the Parthenon, 438 BCE)",
    subtitle: SMK_CAST_SUBTITLE,
    medium: "Marble",
    dimensions: "H: 141 cm | W: 112 cm | D: 90 cm",
    locationLabel: "Original location:",
    location: "Parthenon east pediment, Acropolis, Athens",
    lobbyMeta: "Source: SMK Open plaster-cast scan (KAS2118)",
    source: smkSource({
      summary: "SMK Open source mesh for the seated woman identified as Hestia?, localized into Form Gallery's native STL viewer.",
      recordUrl: "https://open.smk.dk/en/artwork/image/KAS2118",
      fullUrl: "https://api.smk.dk/api/v1/download-3d/vj23cc54r_smk-kas2118-east-gable-of-the-parthenon.stl",
      fallbackUrl: "https://api.smk.dk/api/v1/download-3d/hh63t193x_KAS2118_small.stl",
      note: "SMK catalogs the object itself as a plaster cast. The source record places the original on the east pediment of the Parthenon and dates it to 438 BCE; the Hestia identification remains tentative."
    }),
    defaults: {
      zoom: 2.86,
      lightAngle: 28,
      lightPower: 2.14,
      rough: 0.2
    },
    model: {
      primaryUrl: "./hestia_source_small.stl",
      fallbackUrl: "./hestia_source_small.stl"
    },
    scene: {
      targetHeight: 1.48,
      focusYRatio: 0.54,
      defaultYaw: Math.PI * 0.06,
      defaultViewVector: [1.18, 0.48, 1.82],
      mobileViewVector: [0.9, 0.38, 1.6]
    }
  },
  pudicity: {
    kind: "stl",
    path: "/pudicity/",
    sectionId: "hellenistic-world",
    sortOrder: 29.75,
    viewerTitle: "Pudicity (Roman copy after a Hellenistic original)",
    subtitle: SMK_CAST_SUBTITLE,
    medium: "Marble",
    dimensions: "H: 206 cm",
    locationLabel: "Collection history:",
    location: "Ex Villa Mattei, later Vatican collections",
    lobbyMeta: "Source: SMK Open plaster-cast scan (KAS199)",
    source: smkSource({
      summary: "SMK Open source mesh for Pudicity, localized into Form Gallery's native STL viewer.",
      recordUrl: "https://open.smk.dk/en/artwork/image/KAS199",
      fullUrl: "https://api.smk.dk/api/v1/download-3d/ff365989p_smk34-kas199-pudicitia.stl",
      fallbackUrl: "https://api.smk.dk/api/v1/download-3d/qz20sz34f_KAS199_small.stl",
      note: "SMK catalogs the object itself as a plaster cast. The source record describes the original as a Roman marble copy of a Hellenistic draped female type and notes its Villa Mattei and Vatican history."
    }),
    defaults: {
      zoom: 2.98,
      lightAngle: 26,
      lightPower: 2.1,
      rough: 0.2
    },
    model: {
      primaryUrl: "./pudicity_source_small.stl",
      fallbackUrl: "./pudicity_source_small.stl"
    },
    scene: {
      targetHeight: 1.7,
      focusYRatio: 0.56,
      defaultYaw: -Math.PI * 0.08,
      defaultViewVector: [1.18, 0.56, 1.9],
      mobileViewVector: [0.94, 0.42, 1.7]
    }
  },
  "portrait-of-homer": {
    kind: "stl",
    path: "/portrait-of-homer/",
    sectionId: "hellenistic-world",
    sortOrder: 28.25,
    viewerTitle: "Portrait of Homer (Roman copy of a Hellenistic type)",
    subtitle: SMK_CAST_SUBTITLE,
    medium: "Marble",
    dimensions: "H: 33 cm | W: 37 cm",
    locationLabel: "Collection history:",
    location: "Ex Farnese Collection, Italy",
    lobbyMeta: "Source: SMK Open plaster-cast scan (KAS210)",
    source: smkSource({
      summary: "SMK Open source mesh for the portrait bust of Homer, localized into Form Gallery's native STL viewer.",
      recordUrl: "https://open.smk.dk/en/artwork/image/KAS210",
      fullUrl: "https://api.smk.dk/api/v1/download-3d/g445cj835_smk-kas210-homer.stl",
      fallbackUrl: "https://api.smk.dk/api/v1/download-3d/ms35tf42j_KAS210_small.stl",
      note: "SMK catalogs the object itself as a plaster cast. The source record describes the original as a Roman copy of a Hellenistic blind-type portrait of Homer and notes Farnese collection provenance."
    }),
    defaults: {
      zoom: 2.26,
      lightAngle: 28,
      lightPower: 2.06,
      rough: 0.22
    },
    model: {
      primaryUrl: "./portrait_of_homer_source_small.stl",
      fallbackUrl: "./portrait_of_homer_source_small.stl"
    },
    scene: {
      targetHeight: 1.04,
      focusYRatio: 0.56,
      defaultYaw: Math.PI * 0.08,
      defaultViewVector: [0.96, 0.38, 1.36],
      mobileViewVector: [0.76, 0.3, 1.22]
    }
  },
  "lying-lion": {
    kind: "stl",
    path: "/lying-lion/",
    sectionId: "egypt-mesopotamia",
    sortOrder: 11.5,
    viewerTitle: "Lying Lion (Egyptian type, 1st century BCE)",
    subtitle: SMK_CAST_SUBTITLE,
    medium: "Stone",
    dimensions: "H: 99 cm | W: 66 cm | D: 211 cm",
    locationLabel: "Collection history:",
    location: "Italy, probably Rome",
    lobbyMeta: "Source: SMK Open plaster-cast scan (KAS1164)",
    source: smkSource({
      summary: "SMK Open source mesh for the lying lion, localized into Form Gallery's native STL viewer.",
      recordUrl: "https://open.smk.dk/en/artwork/image/KAS1164",
      fullUrl: "https://api.smk.dk/api/v1/download-3d/0d316r65f_smk-kas1164-lion.stl",
      fallbackUrl: "https://api.smk.dk/api/v1/download-3d/wp988q728_KAS1164_small.stl",
      note: "SMK catalogs the object itself as a plaster cast. The source record identifies the original as Egyptian and dates it to the 1st century BCE, with a probable Roman collection history."
    }),
    defaults: {
      zoom: 2.9,
      lightAngle: 26,
      lightPower: 2.12,
      rough: 0.22
    },
    model: {
      primaryUrl: "./lying_lion_source_small.stl",
      fallbackUrl: "./lying_lion_source_small.stl"
    },
    scene: {
      targetHeight: 1.08,
      focusYRatio: 0.48,
      defaultYaw: -Math.PI * 0.04,
      defaultViewVector: [1.16, 0.34, 1.86],
      mobileViewVector: [0.9, 0.28, 1.64]
    }
  },
  "kore-chiton-epiblema": {
    kind: "stl",
    path: "/kore-chiton-epiblema/",
    sectionId: "greek-classical",
    sortOrder: 26.15,
    viewerTitle: "Kore in Chiton and Epiblema (Archaic Greek kore, c. 530 BCE)",
    subtitle: "Artist: Unknown Greek sculptor",
    medium: "Marble",
    dimensions: "H: 205 cm | W: 51.5 cm | D: 51.5 cm",
    locationLabel: "Findspot:",
    location: "Acropolis, Athens (west of the Erechtheion)",
    lobbyMeta: "Source: Wikimedia Commons / SMK Open STL (KAS1800)",
    source: source(
      "Rendered from the Wikimedia Commons STL for SMK's 3D model of the Acropolis kore in chiton and epiblema, loaded directly into Form Gallery's native STL viewer.",
      [
        link("SMK record", "https://open.smk.dk/artwork/image/KAS1800"),
        link("Wikimedia Commons file", "https://commons.wikimedia.org/wiki/File:Ubekendt,_Kore_if%C3%B8rt_chiton_og_kappe_epiblema_,_,_KAS1800,_Statens_Museum_for_Kunst,_3D_model.stl"),
        link("Direct STL", "https://upload.wikimedia.org/wikipedia/commons/d/d0/Ubekendt%2C_Kore_if%C3%B8rt_chiton_og_kappe_epiblema_%2C_%2C_KAS1800%2C_Statens_Museum_for_Kunst%2C_3D_model.stl")
      ],
      "SMK catalogs the object as a plaster cast. The source record identifies the original as an archaic marble kore from the Acropolis, found west of the Erechtheion in 1886 and dated around 530 BCE."
    ),
    defaults: {
      zoom: 2.86,
      lightAngle: 28,
      lightPower: 2.12,
      rough: 0.2
    },
    model: {
      primaryUrl: "https://upload.wikimedia.org/wikipedia/commons/d/d0/Ubekendt%2C_Kore_if%C3%B8rt_chiton_og_kappe_epiblema_%2C_%2C_KAS1800%2C_Statens_Museum_for_Kunst%2C_3D_model.stl",
      fallbackUrl: "https://upload.wikimedia.org/wikipedia/commons/d/d0/Ubekendt%2C_Kore_if%C3%B8rt_chiton_og_kappe_epiblema_%2C_%2C_KAS1800%2C_Statens_Museum_for_Kunst%2C_3D_model.stl"
    },
    timeouts: {
      primaryMs: 60000,
      fallbackMs: 60000
    },
    scene: {
      targetHeight: 1.72,
      focusYRatio: 0.56,
      defaultYaw: -Math.PI * 0.06,
      defaultViewVector: [1.12, 0.54, 1.84],
      mobileViewVector: [0.88, 0.42, 1.64]
    }
  },
  "pseudo-seneca": {
    kind: "stl",
    path: "/pseudo-seneca/",
    sectionId: "hellenistic-world",
    sortOrder: 28.3,
    viewerTitle: "Pseudo-Seneca / Hesiod? (Roman copy after a Hellenistic portrait type)",
    subtitle: "Artist: Unknown Roman workshop after a Hellenistic original",
    medium: "Bronze portrait type",
    dimensions: "H: 47 cm",
    locationLabel: "Findspot:",
    location: "Villa dei Papiri, Herculaneum",
    lobbyMeta: "Source: Wikimedia Commons / SMK Open STL (KAS94)",
    source: source(
      "Rendered from the Wikimedia Commons STL for SMK's 3D model of the so-called Pseudo-Seneca portrait, loaded directly into Form Gallery's native STL viewer.",
      [
        link("SMK record", "https://open.smk.dk/artwork/image/KAS94"),
        link("Wikimedia Commons file", "https://commons.wikimedia.org/wiki/File:Ubekendt,_Pseudo-Seneca,_portr%C3%A6t_af_Hesiod_8_%C3%A5rh_fKr_,_,_KAS94,_Statens_Museum_for_Kunst,_3D_model.stl"),
        link("Direct STL", "https://upload.wikimedia.org/wikipedia/commons/b/b1/Ubekendt%2C_Pseudo-Seneca%2C_portr%C3%A6t_af_Hesiod_8_%C3%A5rh_fKr_%2C_%2C_KAS94%2C_Statens_Museum_for_Kunst%2C_3D_model.stl")
      ],
      "SMK catalogs the object as a plaster cast. The source record describes the original as a Roman copy of a Hellenistic bronze portrait type, traditionally labeled Pseudo-Seneca and sometimes identified as Hesiod."
    ),
    defaults: {
      zoom: 2.28,
      lightAngle: 30,
      lightPower: 2.08,
      rough: 0.22
    },
    model: {
      primaryUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b1/Ubekendt%2C_Pseudo-Seneca%2C_portr%C3%A6t_af_Hesiod_8_%C3%A5rh_fKr_%2C_%2C_KAS94%2C_Statens_Museum_for_Kunst%2C_3D_model.stl",
      fallbackUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b1/Ubekendt%2C_Pseudo-Seneca%2C_portr%C3%A6t_af_Hesiod_8_%C3%A5rh_fKr_%2C_%2C_KAS94%2C_Statens_Museum_for_Kunst%2C_3D_model.stl"
    },
    timeouts: {
      primaryMs: 60000,
      fallbackMs: 60000
    },
    scene: {
      targetHeight: 1.04,
      focusYRatio: 0.56,
      defaultYaw: Math.PI * 0.08,
      defaultViewVector: [0.96, 0.36, 1.38],
      mobileViewVector: [0.76, 0.3, 1.22]
    }
  },
  "julia-titi": {
    kind: "stl",
    path: "/julia-titi/",
    sectionId: "roman-world",
    sortOrder: 36.9,
    viewerTitle: "Julia Titi (Roman portrait, late 1st century CE)",
    subtitle: "Artist: Unknown Roman workshop",
    medium: "Marble",
    dimensions: "H: 48.5 cm",
    lobbyMeta: "Source: Wikimedia Commons / SMK Open STL (KAS866)",
    source: source(
      "Rendered from the Wikimedia Commons STL for SMK's 3D model of Julia Titi, loaded directly into Form Gallery's native STL viewer.",
      [
        link("SMK record", "https://open.smk.dk/artwork/image/KAS866"),
        link("Wikimedia Commons file", "https://commons.wikimedia.org/wiki/File:Ubekendt,_Julia_Titi,_,_KAS866,_Statens_Museum_for_Kunst,_3D_model.stl"),
        link("Direct STL", "https://upload.wikimedia.org/wikipedia/commons/5/5f/Ubekendt%2C_Julia_Titi%2C_%2C_KAS866%2C_Statens_Museum_for_Kunst%2C_3D_model.stl")
      ],
      "SMK catalogs the object as a plaster cast. The source record identifies the original as a Roman marble portrait of Julia Titi, typically dated within the Flavian period and sometimes discussed in relation to later restorations."
    ),
    defaults: {
      zoom: 2.34,
      lightAngle: 28,
      lightPower: 2.08,
      rough: 0.22
    },
    model: {
      primaryUrl: "https://upload.wikimedia.org/wikipedia/commons/5/5f/Ubekendt%2C_Julia_Titi%2C_%2C_KAS866%2C_Statens_Museum_for_Kunst%2C_3D_model.stl",
      fallbackUrl: "https://upload.wikimedia.org/wikipedia/commons/5/5f/Ubekendt%2C_Julia_Titi%2C_%2C_KAS866%2C_Statens_Museum_for_Kunst%2C_3D_model.stl"
    },
    timeouts: {
      primaryMs: 60000,
      fallbackMs: 60000
    },
    scene: {
      targetHeight: 1.06,
      focusYRatio: 0.56,
      defaultYaw: Math.PI * 0.08,
      defaultViewVector: [0.94, 0.36, 1.34],
      mobileViewVector: [0.74, 0.28, 1.18]
    }
  },
  "zeus-ammon": {
    kind: "stl",
    path: "/zeus-ammon/",
    sectionId: "greek-classical",
    sortOrder: 27.55,
    viewerTitle: "Zeus Ammon (Roman copy after a classical Greek original)",
    subtitle: "Artist: Unknown Roman workshop after a classical Greek original",
    medium: "Marble",
    dimensions: "H: 54 cm",
    lobbyMeta: "Source: Wikimedia Commons / SMK Open STL (KAS1110)",
    source: source(
      "Rendered from the Wikimedia Commons STL for SMK's 3D model of Zeus Ammon, loaded directly into Form Gallery's native STL viewer.",
      [
        link("SMK record", "https://open.smk.dk/artwork/image/KAS1110"),
        link("Wikimedia Commons file", "https://commons.wikimedia.org/wiki/File:Ubekendt,_Zeus_Ammon,_,_KAS1110,_Statens_Museum_for_Kunst,_3D_model.stl"),
        link("Direct STL", "https://upload.wikimedia.org/wikipedia/commons/5/5d/Ubekendt%2C_Zeus_Ammon%2C_%2C_KAS1110%2C_Statens_Museum_for_Kunst%2C_3D_model.stl")
      ],
      "SMK catalogs the object as a plaster cast. The source record identifies the original as a Roman marble copy after a classical Greek Zeus Ammon type, with an uncertain Italian collection history."
    ),
    defaults: {
      zoom: 2.38,
      lightAngle: 30,
      lightPower: 2.08,
      rough: 0.22
    },
    model: {
      primaryUrl: "https://upload.wikimedia.org/wikipedia/commons/5/5d/Ubekendt%2C_Zeus_Ammon%2C_%2C_KAS1110%2C_Statens_Museum_for_Kunst%2C_3D_model.stl",
      fallbackUrl: "https://upload.wikimedia.org/wikipedia/commons/5/5d/Ubekendt%2C_Zeus_Ammon%2C_%2C_KAS1110%2C_Statens_Museum_for_Kunst%2C_3D_model.stl"
    },
    timeouts: {
      primaryMs: 60000,
      fallbackMs: 60000
    },
    scene: {
      targetHeight: 1.08,
      focusYRatio: 0.56,
      defaultYaw: Math.PI * 0.1,
      defaultViewVector: [0.98, 0.38, 1.38],
      mobileViewVector: [0.78, 0.3, 1.22]
    }
  },
  "gathering-buddhas-and-bodhisattvas": {
    kind: "gltf",
    path: "/asia/gathering-buddhas-and-bodhisattvas/",
    sectionId: "asia",
    sortOrder: 4,
    viewerTitle: "Gathering of Buddhas and Bodhisattvas (China, 550-577 CE)",
    subtitle: "Freer Gallery of Art collection; Northern Qi dynasty, Hebei, China",
    medium: "Limestone with traces of pigment",
    dimensions: "H: 120.8 cm | W: 340 cm",
    locationLabel: "Origin:",
    location: "southern Xiangtangshan, Cave 2, Hebei province, China",
    lobbyMeta: "Source: Smithsonian 3D / National Museum of Asian Art",
    source: source(
      "Rendered from Smithsonian 3D's Gathering of Buddhas and Bodhisattvas model, identified as a Northern Qi relief from southern Xiangtangshan and held by the Freer Gallery of Art.",
      [
        link("Smithsonian 3D record", "https://3d.si.edu/object/3d/gathering-buddhas-and-bodhisattvas%3A476ad7f6-6add-448d-af7f-9f2ca9ba9cb6"),
        link("Voyager document", "https://3d-api.si.edu/content/document/3d_package:476ad7f6-6add-448d-af7f-9f2ca9ba9cb6/document.json"),
        link("High GLB", "https://3d-api.si.edu/content/document/3d_package:476ad7f6-6add-448d-af7f-9f2ca9ba9cb6/f1921_1-full_res-150k-4096-high.glb")
      ],
      "Smithsonian marks both the 3D package and the object metadata as CC0. The title, date, origin, medium, and dimensions follow the National Museum of Asian Art object page."
    ),
    defaults: {
      zoom: 2.36,
      lightAngle: 24,
      lightPower: 2.0,
      exposure: 0.46,
      rough: 0.24
    },
    model: {
      primaryUrl: "https://3d-api.si.edu/content/document/3d_package:476ad7f6-6add-448d-af7f-9f2ca9ba9cb6/f1921_1-full_res-150k-4096-high.glb",
      fallbackUrl: "https://3d-api.si.edu/content/document/3d_package:476ad7f6-6add-448d-af7f-9f2ca9ba9cb6/f1921_1-full_res-150k-2048-medium.glb"
    },
    scene: {
      showPedestal: false,
      targetHeight: 0.98,
      focusYRatio: 0.5,
      defaultViewVector: [1.02, 0.28, 2.32],
      mobileViewVector: [0.72, 0.22, 2.08]
    }
  },
  "western-paradise-buddha-amitabha": {
    kind: "gltf",
    path: "/asia/western-paradise-buddha-amitabha/",
    sectionId: "asia",
    sortOrder: 5,
    viewerTitle: "Western Paradise of the Buddha Amitabha (China, 550-577 CE)",
    subtitle: "Freer Gallery of Art collection; Northern Qi dynasty, Hebei, China",
    medium: "Limestone with traces of pigment",
    dimensions: "H: 159.3 cm | W: 334.5 cm",
    locationLabel: "Origin:",
    location: "southern Xiangtangshan, Cave 2, Hebei province, China",
    lobbyMeta: "Source: Smithsonian 3D / National Museum of Asian Art",
    source: source(
      "Rendered from Smithsonian 3D's Western Paradise of the Buddha Amitabha model, identified as a Northern Qi relief from southern Xiangtangshan and held by the Freer Gallery of Art.",
      [
        link("Smithsonian 3D record", "https://3d.si.edu/object/3d/western-paradise-buddha-amitabha%3A727b4bb6-ce87-40de-b07d-d492c1404221"),
        link("Voyager document", "https://3d-api.si.edu/content/document/3d_package:727b4bb6-ce87-40de-b07d-d492c1404221/document.json"),
        link("High GLB", "https://3d-api.si.edu/content/document/3d_package:727b4bb6-ce87-40de-b07d-d492c1404221/f1921_2-high_res-150k-4096-high.glb")
      ],
      "Smithsonian marks both the 3D package and the object metadata as CC0. The title, date, origin, medium, and dimensions follow the National Museum of Asian Art object page."
    ),
    defaults: {
      zoom: 2.34,
      lightAngle: 24,
      lightPower: 2.0,
      exposure: 0.46,
      rough: 0.24
    },
    model: {
      primaryUrl: "https://3d-api.si.edu/content/document/3d_package:727b4bb6-ce87-40de-b07d-d492c1404221/f1921_2-high_res-150k-4096-high.glb",
      fallbackUrl: "https://3d-api.si.edu/content/document/3d_package:727b4bb6-ce87-40de-b07d-d492c1404221/f1921_2-high_res-150k-2048-medium.glb"
    },
    scene: {
      showPedestal: false,
      targetHeight: 0.98,
      focusYRatio: 0.5,
      defaultViewVector: [1.02, 0.28, 2.34],
      mobileViewVector: [0.72, 0.22, 2.1]
    }
  },
  "standing-buddha-radiate-combined-halo": {
    kind: "gltf",
    path: "/asia/standing-buddha-radiate-combined-halo/",
    sectionId: "asia",
    sortOrder: 7,
    viewerTitle: "Standing Buddha with Radiate Combined Halo (Pakistan, ca. late 6th century)",
    subtitle: "The Metropolitan Museum of Art, Department of Asian Art",
    medium: "Brass",
    dimensions: "H: 33.7 cm",
    locationLabel: "Collection:",
    location: "The Metropolitan Museum of Art",
    culture: "Pakistan (ancient region of Gandhara)",
    region: "Asia",
    period: "late 6th century",
    current_location: "The Metropolitan Museum of Art",
    findspot_or_origin: "Pakistan (ancient region of Gandhara)",
    scan_source: "The Met 3D / VNTANA",
    mesh_format: "GLB",
    tags: ["Pakistan", "Gandhara", "Buddha", "Brass", "The Met"],
    lobbyMeta: "Source: The Met 3D / Department of Asian Art",
    source: source(
      "Rendered from The Metropolitan Museum of Art's 3D model of Standing Buddha with Radiate Combined Halo.",
      [
        link("Met object page", "https://www.metmuseum.org/art/collection/search/39165"),
        link("Original GLB", "https://api.vntana.com/assets/products/afbd8863-9cae-4cd9-815f-26c0d14c4b3e/organizations/The-Metropolitan-Museum-of-Art/clients/masters/9f778d31-c859-440d-bd8a-6b88ce9544ce.glb")
      ],
      "The title, date, culture, medium, dimensions, and department follow The Met collection record. The object page marks the sculpture as not on view."
    ),
    defaults: {
      zoom: 2.92,
      lightAngle: 24,
      lightPower: 2.02,
      exposure: 0.42,
      rough: 0.24
    },
    model: {
      primaryUrl: "./standing_buddha_with_radiate_combined_halo.glb",
      fallbackUrl: "./standing_buddha_with_radiate_combined_halo.glb"
    },
    scene: {
      targetHeight: 0.88,
      defaultYaw: Math.PI * 0.04,
      defaultViewVector: [0.94, 0.5, 1.02],
      mobileViewVector: [0.76, 0.36, 0.9]
    }
  },
  "horus-protecting-nectanebo-ii": {
    kind: "gltf",
    path: "/horus-protecting-nectanebo-ii/",
    sectionId: "egypt-mesopotamia",
    sortOrder: 12,
    viewerTitle: "Statue of Horus as a Falcon Protecting King Nectanebo II (Egyptian, 360-343 BCE)",
    subtitle: "The Metropolitan Museum of Art, Department of Egyptian Art",
    medium: "Metagraywacke",
    dimensions: "H: 72 cm | W: 20 cm | D: 46.5 cm | Weight: 55.3 kg",
    locationLabel: "On view:",
    location: "Gallery 128, The Metropolitan Museum of Art",
    culture: "Egyptian",
    region: "Egypt & the Nile",
    period: "Late Period",
    current_location: "Gallery 128, The Metropolitan Museum of Art",
    findspot_or_origin: "Heliopolis (Iunu; On), Tomb of a Mnevis bull, Memphite Region",
    scan_source: "The Met 3D / VNTANA",
    mesh_format: "GLB",
    tags: ["Egyptian", "Late Period", "Horus", "Nectanebo II", "Metagraywacke", "The Met"],
    lobbyMeta: "Source: The Met 3D / Department of Egyptian Art",
    source: source(
      "Rendered from The Metropolitan Museum of Art's 3D model of Statue of Horus as a Falcon Protecting King Nectanebo II.",
      [
        link("Met object page", "https://www.metmuseum.org/art/collection/search/544887"),
        link("Original GLB", "https://api.vntana.com/assets/products/3ea0b2f6-d8a9-46de-ab95-2b720ad8bac4/organizations/The-Metropolitan-Museum-of-Art/clients/masters/87d551e4-51ad-4419-904d-05397c0c581e.glb")
      ],
      "The title, date, culture, medium, dimensions, gallery location, and place of origin follow The Met collection record."
    ),
    defaults: {
      zoom: 2.9,
      lightAngle: 24,
      lightPower: 2.02,
      exposure: 0.42,
      rough: 0.24
    },
    model: {
      primaryUrl: "./horus_protecting_nectanebo_ii.glb",
      fallbackUrl: "./horus_protecting_nectanebo_ii.glb"
    },
    scene: {
      targetHeight: 0.92,
      focusYRatio: 0.54,
      defaultYaw: Math.PI * 0.06,
      defaultViewVector: [1.0, 0.48, 1.06],
      mobileViewVector: [0.8, 0.36, 0.94]
    }
  },
  "statue-of-ur-ningirsu": {
    kind: "gltf",
    path: "/statue-of-ur-ningirsu/",
    sectionId: "egypt-mesopotamia",
    sortOrder: 12.1,
    viewerTitle: "Statue of Ur-Ningirsu, son of Gudea (Neo-Sumerian, ca. 2080 BCE)",
    subtitle: "The Metropolitan Museum of Art, Department of Ancient West Asian Art",
    medium: "Chlorite",
    dimensions: "H. 55 cm (21 5/8 in.)",
    locationLabel: "Collection:",
    location: "The Metropolitan Museum of Art",
    culture: "Neo-Sumerian",
    region: "Mesopotamia",
    period: "Neo-Sumerian",
    current_location: "The Metropolitan Museum of Art",
    findspot_or_origin: "Mesopotamia",
    scan_source: "The Met 3D / VNTANA",
    mesh_format: "GLB",
    tags: ["Neo-Sumerian", "Mesopotamia", "Chlorite", "The Met"],
    lobbyMeta: "Source: The Met 3D / Department of Ancient West Asian Art",
    source: source(
      "Rendered from The Metropolitan Museum of Art's 3D model of Statue of Ur-Ningirsu, son of Gudea.",
      [
        link("Met object page", "https://www.metmuseum.org/art/collection/search/329069"),
        link("Original GLB", "https://api.vntana.com/assets/products/9822c27d-4ce1-4f69-9b90-ac816aca60e7/organizations/The-Metropolitan-Museum-of-Art/clients/masters/5024ce70-4138-4918-9076-f2d3ebaf5ad3.glb")
      ],
      "The title, date, culture, medium, dimensions, and department follow The Met collection record. The object page lists the work in the collection and notes that it was lent by the Musee du Louvre."
    ),
    defaults: {
      zoom: 2.88,
      lightAngle: 24,
      lightPower: 2.02,
      exposure: 0.42,
      rough: 0.24
    },
    model: {
      primaryUrl: "./statue_of_ur_ningirsu.glb",
      fallbackUrl: "./statue_of_ur_ningirsu.glb"
    },
    scene: {
      targetHeight: 0.9,
      focusYRatio: 0.54,
      defaultYaw: Math.PI * 0.06,
      defaultViewVector: [0.98, 0.46, 1.06],
      mobileViewVector: [0.78, 0.36, 0.94]
    }
  },
  "final-neolithic-marble-female-figure": {
    kind: "gltf",
    path: "/final-neolithic-marble-female-figure/",
    sectionId: "greek-classical",
    sortOrder: 24.75,
    viewerTitle: "Marble Female Figure (Cycladic, Final Neolithic, 4500-4000 BCE)",
    subtitle: "Artist: Unknown Cycladic sculptor",
    medium: "Marble",
    dimensions: "H. 8 7/16 in. (21.4 cm)",
    locationLabel: "On view:",
    location: "Gallery 150, The Metropolitan Museum of Art",
    culture: "Cycladic",
    region: "Greek world",
    period: "Final Neolithic",
    current_location: "Gallery 150, The Metropolitan Museum of Art",
    scan_source: "The Met 3D / VNTANA",
    mesh_format: "GLB",
    tags: ["Cycladic", "Final Neolithic", "Marble", "The Met"],
    lobbyMeta: "Source: The Met 3D / Department of Greek and Roman Art",
    source: source(
      "Rendered from The Metropolitan Museum of Art's 3D model of Marble Female Figure.",
      [
        link("Met object page", "https://www.metmuseum.org/art/collection/search/255417"),
        link("Original GLB", "https://api.vntana.com/assets/products/4f395dd2-918a-4d08-8537-ebd0ad6e4696/organizations/The-Metropolitan-Museum-of-Art/clients/masters/6f51cf50-32a6-4ec5-a4cc-94ddc94ed7a7.glb")
      ],
      "The title, culture, period, date, medium, dimensions, department, and gallery location follow The Met collection record."
    ),
    defaults: {
      zoom: 2.9,
      lightAngle: 24,
      lightPower: 2.02,
      exposure: 0.42,
      rough: 0.24
    },
    model: {
      primaryUrl: "./final_neolithic_marble_female_figure.glb",
      fallbackUrl: "./final_neolithic_marble_female_figure.glb"
    },
    scene: {
      targetHeight: 0.94,
      focusYRatio: 0.56,
      defaultYaw: Math.PI * 0.04,
      defaultViewVector: [0.98, 0.44, 1.02],
      mobileViewVector: [0.78, 0.34, 0.92]
    }
  },
  "cycladic-marble-female-figure": {
    kind: "gltf",
    path: "/cycladic-marble-female-figure/",
    sectionId: "greek-classical",
    sortOrder: 24.8,
    viewerTitle: "Marble Female Figure (Cycladic, Early Cycladic II, ca. 2700-2400/2300 BCE)",
    subtitle: "The Metropolitan Museum of Art",
    medium: "Marble",
    dimensions: "H: 86.5 cm | W: 21 cm | D: 6.2 cm",
    locationLabel: "On view:",
    location: "Gallery 151, The Metropolitan Museum of Art",
    culture: "Cycladic",
    region: "Greek world",
    period: "Early Cycladic II",
    current_location: "Gallery 151, The Metropolitan Museum of Art",
    scan_source: "The Met 3D / VNTANA",
    mesh_format: "GLB",
    tags: ["Cycladic", "Marble", "Greek world", "The Met"],
    lobbyMeta: "Source: The Met 3D",
    source: source(
      "Rendered from The Metropolitan Museum of Art's 3D model of Marble Female Figure.",
      [
        link("Met object page", "https://www.metmuseum.org/art/collection/search/854724"),
        link("Original GLB", "https://api.vntana.com/assets/products/76da0393-e35d-4fb0-ada4-5c8841764fd0/organizations/The-Metropolitan-Museum-of-Art/clients/masters/8ff97eac-8d7a-44b7-9062-2d42c43314f9.glb")
      ],
      "The title, culture, period, approximate date, medium, dimensions, and gallery location follow The Met collection record. The object page marks the figure as on view in Gallery 151."
    ),
    defaults: {
      zoom: 2.9,
      lightAngle: 24,
      lightPower: 2.02,
      exposure: 0.42,
      rough: 0.24
    },
    model: {
      primaryUrl: "./marble_female_figure.glb",
      fallbackUrl: "./marble_female_figure.glb"
    },
    scene: {
      targetHeight: 0.94,
      focusYRatio: 0.54,
      defaultYaw: Math.PI * 0.02,
      defaultViewVector: [0.98, 0.44, 1.02],
      mobileViewVector: [0.78, 0.34, 0.92]
    }
  },
  "eros-flying": {
    kind: "gltf",
    path: "/eros-flying/",
    sectionId: "hellenistic-world",
    sortOrder: 91,
    viewerTitle: "Terracotta Statuette of Eros Flying (Greek, South Italian, Tarentine, 3rd century BCE)",
    subtitle: "The Metropolitan Museum of Art, Department of Greek and Roman Art",
    medium: "Terracotta",
    dimensions: "H. 2 7/8 in. (7.3 cm)",
    locationLabel: "On view:",
    location: "Gallery 171, The Metropolitan Museum of Art",
    culture: "Greek, South Italian, Tarentine",
    region: "Greek world",
    period: "Hellenistic",
    current_location: "Gallery 171, The Metropolitan Museum of Art",
    scan_source: "The Met 3D / VNTANA",
    mesh_format: "GLB",
    tags: ["Greek", "South Italian", "Tarentine", "Hellenistic", "Eros", "Terracotta", "The Met"],
    lobbyMeta: "Source: The Met 3D / Department of Greek and Roman Art",
    source: source(
      "Rendered from The Metropolitan Museum of Art's 3D model of Terracotta Statuette of Eros Flying.",
      [
        link("Met object page", "https://www.metmuseum.org/art/collection/search/248612"),
        link("Original GLB", "https://api.vntana.com/assets/products/d070ce07-8fe5-427b-b0b7-be932992b6a0/organizations/The-Metropolitan-Museum-of-Art/clients/masters/105e0c26-f4ed-4324-9499-a7b2df5d17b3.glb")
      ],
      "The title, date, culture, medium, dimensions, and gallery location follow The Met collection record."
    ),
    defaults: {
      zoom: 2.88,
      lightAngle: 24,
      lightPower: 2.02,
      exposure: 0.42,
      rough: 0.24
    },
    model: {
      primaryUrl: "./eros_flying.glb",
      fallbackUrl: "./eros_flying.glb"
    },
    scene: {
      targetHeight: 0.74,
      focusYRatio: 0.54,
      defaultYaw: -Math.PI * 0.08,
      defaultViewVector: [1.02, 0.5, 1.06],
      mobileViewVector: [0.82, 0.38, 0.94]
    }
  },
  "ewer-khurasan-herat": {
    kind: "gltf",
    path: "/asia/ewer-khurasan-herat/",
    sectionId: "asia",
    sortOrder: 21,
    viewerTitle: "Ewer (Iran or Afghanistan, Khurasan or Herat, ca. 1180-1210)",
    subtitle: "The Metropolitan Museum of Art, Department of Islamic Art",
    medium: "Brass; raised, repoussé, inlaid with silver and a black compound",
    dimensions: "H. 15 3/4 in. (40 cm) | Diam. 7 1/2 in. (19.1 cm)",
    locationLabel: "On view:",
    location: "Gallery 453, The Metropolitan Museum of Art",
    region: "Asia",
    period: "ca. 1180-1210",
    current_location: "Gallery 453, The Metropolitan Museum of Art",
    findspot_or_origin: "Iran or Afghanistan, Khurasan or Herat",
    scan_source: "The Met 3D / VNTANA",
    mesh_format: "GLB",
    tags: ["Iran", "Afghanistan", "Khurasan", "Herat", "Islamic Art", "Brass", "The Met"],
    lobbyMeta: "Source: The Met 3D / Department of Islamic Art",
    source: source(
      "Rendered from The Metropolitan Museum of Art's 3D model of Ewer.",
      [
        link("Met object page", "https://www.metmuseum.org/art/collection/search/450513"),
        link("Original GLB", "https://api.vntana.com/assets/products/88f8ea6e-b1f2-4be7-8db3-b533be205e7a/organizations/The-Metropolitan-Museum-of-Art/clients/masters/3bc0deee-43d4-48e4-83e3-e4a8f071151a.glb")
      ],
      "The title, date, country, region, medium, dimensions, department, and gallery number follow The Met collection record."
    ),
    defaults: {
      zoom: 2.86,
      lightAngle: 24,
      lightPower: 2.02,
      exposure: 0.42,
      rough: 0.24
    },
    model: {
      primaryUrl: "./ewer_khurasan_herat.glb",
      fallbackUrl: "./ewer_khurasan_herat.glb"
    },
    scene: {
      targetHeight: 0.94,
      focusYRatio: 0.54,
      defaultYaw: -Math.PI * 0.08,
      defaultViewVector: [0.98, 0.46, 1.08],
      mobileViewVector: [0.78, 0.34, 0.96]
    }
  },
  "bowl-arabic-inscription": {
    kind: "gltf",
    path: "/asia/bowl-arabic-inscription/",
    sectionId: "asia",
    sortOrder: 22,
    viewerTitle: "Bowl with Arabic Inscription (Nishapur, Iran, 10th century)",
    subtitle: "The Metropolitan Museum of Art, Department of Islamic Art",
    medium: "Earthenware; white slip with black-slip decoration under transparent glaze",
    dimensions: "H: 17.8 cm | Diam: 45.7 cm",
    locationLabel: "On view:",
    location: "Gallery 453, The Metropolitan Museum of Art",
    region: "Asia",
    period: "10th century",
    current_location: "Gallery 453, The Metropolitan Museum of Art",
    findspot_or_origin: "Nishapur, Iran",
    scan_source: "The Met 3D / VNTANA",
    mesh_format: "GLB",
    tags: ["Iran", "Nishapur", "Islamic Art", "Earthenware", "The Met"],
    lobbyMeta: "Source: The Met 3D / Department of Islamic Art",
    source: source(
      "Rendered from The Metropolitan Museum of Art's 3D model of Bowl with Arabic Inscription.",
      [
        link("Met object page", "https://www.metmuseum.org/art/collection/search/451802"),
        link("Original GLB", "https://api.vntana.com/assets/products/193bf47c-57fb-4fda-b20f-0d9d350e1dd1/organizations/The-Metropolitan-Museum-of-Art/clients/masters/dce4eedc-2c3f-4ed0-8edf-bd36f768a6ab.glb")
      ],
      "The title, date, medium, dimensions, origin, department, and gallery location follow The Met collection record."
    ),
    defaults: {
      zoom: 2.96,
      lightAngle: 24,
      lightPower: 2.02,
      exposure: 0.42,
      rough: 0.24
    },
    model: {
      primaryUrl: "./bowl_with_arabic_inscription.glb",
      fallbackUrl: "./bowl_with_arabic_inscription.glb"
    },
    scene: {
      targetHeight: 0.78,
      focusYRatio: 0.5,
      defaultYaw: Math.PI * 0.08,
      defaultViewVector: [0.88, 0.34, 0.84],
      mobileViewVector: [0.74, 0.28, 0.74]
    }
  },
  "bronze-figure-boy-eastern-dress": {
    kind: "gltf",
    path: "/bronze-figure-boy-eastern-dress/",
    sectionId: "roman-world",
    sortOrder: 118,
    viewerTitle: "Bronze Figure of a Boy in Eastern Dress (Greek, Ptolemaic or Roman, mid-late 1st century BCE)",
    subtitle: "The Metropolitan Museum of Art, Department of Greek and Roman Art",
    medium: "Bronze",
    dimensions: "H. 25 1/8 in. | W. 11 7/8 x 12 3/4 in. | Weight: 29.5 lb.",
    locationLabel: "On view:",
    location: "Gallery 164, The Metropolitan Museum of Art",
    culture: "Greek, Ptolemaic or Roman",
    region: "Roman world",
    period: "Late Hellenistic or Early Imperial",
    current_location: "Gallery 164, The Metropolitan Museum of Art",
    scan_source: "The Met 3D / VNTANA",
    mesh_format: "GLB",
    tags: ["Greek", "Ptolemaic", "Roman", "Bronze", "The Met"],
    lobbyMeta: "Source: The Met 3D / Department of Greek and Roman Art",
    source: source(
      "Rendered from The Metropolitan Museum of Art's 3D model of Bronze Figure of a Boy in Eastern Dress.",
      [
        link("Met object page", "https://www.metmuseum.org/art/collection/search/254613"),
        link("Original GLB", "https://api.vntana.com/assets/products/d8e73b97-67e5-41d7-b9d1-5788719d4b4f/organizations/The-Metropolitan-Museum-of-Art/clients/masters/93986daf-78a9-4499-aa7b-838443a4db3c.glb")
      ],
      "The title, date, culture, period, medium, dimensions, and gallery location follow The Met collection record."
    ),
    defaults: {
      zoom: 2.86,
      lightAngle: 24,
      lightPower: 2.02,
      exposure: 0.42,
      rough: 0.24
    },
    model: {
      primaryUrl: "./bronze_figure_boy_eastern_dress.glb",
      fallbackUrl: "./bronze_figure_boy_eastern_dress.glb"
    },
    scene: {
      targetHeight: 0.9,
      focusYRatio: 0.54,
      defaultYaw: Math.PI * 0.06,
      defaultViewVector: [0.98, 0.46, 1.08],
      mobileViewVector: [0.78, 0.34, 0.96]
    }
  },
  "marble-sarcophagus-lions-antelope": {
    kind: "gltf",
    path: "/marble-sarcophagus-lions-antelope/",
    sectionId: "roman-world",
    sortOrder: 118.1,
    viewerTitle: "Marble Sarcophagus with Lions Felling Antelope (Roman, 3rd century CE)",
    subtitle: "The Metropolitan Museum of Art, Department of Greek and Roman Art",
    medium: "Marble",
    dimensions: "H. 44 in. | W. 84 in. | D. 40 in. (111.8 x 213.4 x 101.6 cm)",
    locationLabel: "On view:",
    location: "Gallery 169, The Metropolitan Museum of Art",
    culture: "Roman",
    region: "Roman world",
    period: "3rd century",
    current_location: "Gallery 169, The Metropolitan Museum of Art",
    scan_source: "The Met 3D / VNTANA",
    mesh_format: "GLB",
    tags: ["Roman", "Marble", "Sarcophagus", "The Met"],
    lobbyMeta: "Source: The Met 3D / Department of Greek and Roman Art",
    source: source(
      "Rendered from The Metropolitan Museum of Art's 3D model of Marble Sarcophagus with Lions Felling Antelope.",
      [
        link("Met object page", "https://www.metmuseum.org/art/collection/search/854888"),
        link("Original GLB", "https://api.vntana.com/assets/products/8c51d760-f49f-4bb3-ba93-42c2db6eb799/organizations/The-Metropolitan-Museum-of-Art/clients/masters/355f5d97-d15f-45e0-bf3a-eba8b8e21d42.glb")
      ],
      "The title, date, culture, medium, dimensions, department, and gallery location follow The Met collection record."
    ),
    defaults: {
      zoom: 2.84,
      lightAngle: 24,
      lightPower: 2.02,
      exposure: 0.42,
      rough: 0.24
    },
    model: {
      primaryUrl: "./marble_sarcophagus_with_lions_felling_antelope.glb",
      fallbackUrl: "./marble_sarcophagus_with_lions_felling_antelope.glb"
    },
    scene: {
      targetHeight: 0.86,
      focusYRatio: 0.52,
      defaultYaw: Math.PI * 0.04,
      defaultViewVector: [1.08, 0.42, 1.32],
      mobileViewVector: [0.84, 0.34, 1.12]
    }
  },
  "limestone-head-of-a-bearded-man": {
    kind: "gltf",
    path: "/limestone-head-of-a-bearded-man/",
    sectionId: "greek-classical",
    sortOrder: 26.08,
    viewerTitle: "Limestone Head of a Bearded Man (Cypriot, early 6th century BCE)",
    subtitle: "Artist: Unknown Cypriot sculptor",
    medium: "Limestone",
    dimensions: "35 × 14 × 23 in., 500 lb. (88.9 × 35.6 × 58.4 cm, 226.8 kg)",
    locationLabel: "On view:",
    location: "Gallery 515, The Metropolitan Museum of Art",
    culture: "Cypriot",
    region: "Cyprus",
    period: "Archaic",
    current_location: "Gallery 515, The Metropolitan Museum of Art",
    scan_source: "The Met 3D / VNTANA",
    mesh_format: "GLB",
    tags: ["Cypriot", "Archaic", "Limestone", "Head", "The Met"],
    lobbyMeta: "Source: The Met 3D / Department of Greek and Roman Art",
    source: source(
      "Rendered from The Metropolitan Museum of Art's 3D model of Limestone Head of a Bearded Man.",
      [
        link("Met object page", "https://www.metmuseum.org/art/collection/search/242408"),
        link("Original GLB", "https://api.vntana.com/assets/products/e38e7bc7-2e00-42c4-8232-6a39c89bd7b8/organizations/The-Metropolitan-Museum-of-Art/clients/masters/8eb5cc25-be28-48a5-907e-ec0308dc9eb5.glb")
      ],
      "The title, culture, date, medium, dimensions, department, and gallery location follow The Met collection record."
    ),
    defaults: {
      zoom: 2.82,
      lightAngle: 24,
      lightPower: 2.02,
      exposure: 0.42,
      rough: 0.24
    },
    model: {
      primaryUrl: "./limestone_head_of_a_bearded_man.glb",
      fallbackUrl: "./limestone_head_of_a_bearded_man.glb"
    },
    scene: {
      targetHeight: 0.86,
      focusYRatio: 0.64,
      defaultYaw: Math.PI * 0.03,
      defaultViewVector: [0.94, 0.56, 0.98],
      mobileViewVector: [0.76, 0.44, 0.86]
    }
  },
  "marble-stele-youth-and-little-girl": {
    kind: "gltf",
    path: "/marble-stele-youth-and-little-girl/",
    sectionId: "greek-classical",
    sortOrder: 26.09,
    viewerTitle: "Marble Stele with a Youth and Little Girl, with a Capital and Finial in the Form of a Sphinx (Greek, Attic, ca. 530 BCE)",
    subtitle: "Artist: Unknown Greek sculptor",
    medium: "Marble",
    dimensions: "Total H. 13 ft. 10 11/16 in. (423.4 cm)",
    locationLabel: "On view:",
    location: "Gallery 154, The Metropolitan Museum of Art",
    culture: "Greek, Attic",
    region: "Greek world",
    period: "Archaic",
    current_location: "Gallery 154, The Metropolitan Museum of Art",
    scan_source: "The Met 3D / VNTANA",
    mesh_format: "GLB",
    tags: ["Greek", "Attic", "Archaic", "Stele", "Marble", "The Met"],
    lobbyMeta: "Source: The Met 3D / Department of Greek and Roman Art",
    source: source(
      "Rendered from The Metropolitan Museum of Art's 3D model of Marble Stele with a Youth and Little Girl.",
      [
        link("Met object page", "https://www.metmuseum.org/art/collection/search/256974"),
        link("Original GLB", "https://api.vntana.com/assets/products/5556bd54-ea23-487a-bd79-4ef94c245aee/organizations/The-Metropolitan-Museum-of-Art/clients/masters/f5a1c73e-8f32-4c89-85b2-98b0dd68c568.glb")
      ],
      "The title, date, culture, medium, dimensions, department, and gallery location follow The Met collection record."
    ),
    defaults: {
      zoom: 2.84,
      lightAngle: 24,
      lightPower: 2.02,
      exposure: 0.42,
      rough: 0.24
    },
    model: {
      primaryUrl: "./marble_stele_youth_and_little_girl.glb",
      fallbackUrl: "./marble_stele_youth_and_little_girl.glb"
    },
    scene: {
      targetHeight: 0.94,
      focusYRatio: 0.56,
      defaultYaw: Math.PI * 0.04,
      defaultViewVector: [1.02, 0.46, 1.14],
      mobileViewVector: [0.82, 0.36, 0.98]
    }
  },
  "marble-capital-sphinx": {
    kind: "gltf",
    path: "/marble-capital-sphinx/",
    sectionId: "greek-classical",
    sortOrder: 26.1,
    viewerTitle: "Marble Capital and Finial in the Form of a Sphinx (Greek, Attic, ca. 530 BCE)",
    subtitle: "The Metropolitan Museum of Art, Department of Greek and Roman Art",
    medium: "Marble, Parian",
    dimensions: "H. with akroterion 56 1/8 in. (142.6 cm)",
    locationLabel: "On view:",
    location: "Gallery 154, The Metropolitan Museum of Art",
    culture: "Greek, Attic",
    region: "Greek world",
    period: "Archaic",
    current_location: "Gallery 154, The Metropolitan Museum of Art",
    scan_source: "The Met 3D / VNTANA",
    mesh_format: "GLB",
    tags: ["Greek", "Attic", "Archaic", "Sphinx", "Marble", "The Met"],
    lobbyMeta: "Source: The Met 3D / Department of Greek and Roman Art",
    source: source(
      "Rendered from The Metropolitan Museum of Art's 3D model of Marble Capital and Finial in the Form of a Sphinx.",
      [
        link("Met object page", "https://www.metmuseum.org/art/collection/search/248501"),
        link("Original GLB", "https://api.vntana.com/assets/products/76ae4b6a-2503-42f9-86cc-fe2d4ec2050a/organizations/The-Metropolitan-Museum-of-Art/clients/masters/156af359-9cef-40c7-903b-d35120b029a0.glb")
      ],
      "The title, date, culture, medium, dimensions, department, and gallery location follow The Met collection record."
    ),
    defaults: {
      zoom: 2.82,
      lightAngle: 24,
      lightPower: 2.02,
      exposure: 0.42,
      rough: 0.24
    },
    model: {
      primaryUrl: "./marble_capital_and_finial_sphinx.glb",
      fallbackUrl: "./marble_capital_and_finial_sphinx.glb"
    },
    scene: {
      targetHeight: 0.94,
      focusYRatio: 0.56,
      defaultYaw: Math.PI * 0.04,
      defaultViewVector: [0.98, 0.46, 1.08],
      mobileViewVector: [0.78, 0.36, 0.96]
    }
  },
  "silver-bowl-isis-medallion": {
    kind: "gltf",
    path: "/silver-bowl-isis-medallion/",
    sectionId: "greek-classical",
    sortOrder: 26.05,
    viewerTitle: "Silver Bowl with Medallion of Isis (Cypriot, Archaic, ca. 675-625 BCE)",
    subtitle: "The Metropolitan Museum of Art, Department of Greek and Roman Art",
    medium: "Silver",
    dimensions: "H. 1 3/8 in. (3.5 cm) | Diam. 6 in. (15.3 cm)",
    locationLabel: "Collection:",
    location: "The Metropolitan Museum of Art",
    culture: "Cypriot",
    region: "Greek world",
    period: "Archaic",
    current_location: "The Metropolitan Museum of Art",
    scan_source: "The Met 3D / VNTANA",
    mesh_format: "GLB",
    tags: ["Cypriot", "Archaic", "Silver", "Isis", "The Met"],
    lobbyMeta: "Source: The Met 3D / Department of Greek and Roman Art",
    source: source(
      "Rendered from The Metropolitan Museum of Art's 3D model of Silver Bowl with Medallion of Isis.",
      [
        link("Met object page", "https://www.metmuseum.org/art/collection/search/243824"),
        link("Original GLB", "https://api.vntana.com/assets/products/3f88eee5-d29f-4cec-89a8-ab04014fc59c/organizations/The-Metropolitan-Museum-of-Art/clients/masters/776d8451-2eb2-42c4-aa20-b9efe38394fe.glb")
      ],
      "The title, date, culture, medium, dimensions, and department follow The Met collection record."
    ),
    defaults: {
      zoom: 2.94,
      lightAngle: 24,
      lightPower: 2.02,
      exposure: 0.42,
      rough: 0.24
    },
    model: {
      primaryUrl: "./silver_bowl_with_medallion_of_isis.glb",
      fallbackUrl: "./silver_bowl_with_medallion_of_isis.glb"
    },
    scene: {
      targetHeight: 0.72,
      focusYRatio: 0.52,
      defaultYaw: Math.PI * 0.08,
      defaultViewVector: [0.86, 0.34, 0.82],
      mobileViewVector: [0.74, 0.3, 0.74]
    }
  },
  "aphrodite-holding-winged-eros": {
    kind: "gltf",
    path: "/aphrodite-holding-winged-eros/",
    sectionId: "greek-classical",
    sortOrder: 26.2,
    viewerTitle: "Limestone Statue of Aphrodite Holding Winged Eros (Cypriot, late 4th century BCE)",
    subtitle: "The Metropolitan Museum of Art, Department of Greek and Roman Art",
    medium: "Limestone",
    dimensions: "H: 126.4 cm | W: 66 cm | D: 25.4 cm",
    locationLabel: "Collection:",
    location: "The Metropolitan Museum of Art",
    culture: "Cypriot",
    region: "Greek world",
    period: "Classical",
    current_location: "The Metropolitan Museum of Art",
    scan_source: "The Met 3D / VNTANA",
    mesh_format: "GLB",
    tags: ["Cypriot", "Aphrodite", "Eros", "Limestone", "The Met"],
    lobbyMeta: "Source: The Met 3D / Department of Greek and Roman Art",
    source: source(
      "Rendered from The Metropolitan Museum of Art's 3D model of Limestone Statue of Aphrodite Holding Winged Eros.",
      [
        link("Met object page", "https://www.metmuseum.org/art/collection/search/242017"),
        link("Original GLB", "https://api.vntana.com/assets/products/026577c4-3d0f-4aa1-bd6a-e952b252f495/organizations/The-Metropolitan-Museum-of-Art/clients/masters/eace2a12-a38f-41ad-b959-b51a75f1fd25.glb")
      ],
      "The title, date, culture, medium, dimensions, and department follow The Met collection record. The object page marks the sculpture as not on view."
    ),
    defaults: {
      zoom: 2.86,
      lightAngle: 24,
      lightPower: 2.02,
      exposure: 0.42,
      rough: 0.24
    },
    model: {
      primaryUrl: "./aphrodite_holding_winged_eros.glb",
      fallbackUrl: "./aphrodite_holding_winged_eros.glb"
    },
    scene: {
      targetHeight: 0.92,
      focusYRatio: 0.54,
      defaultYaw: Math.PI * 0.06,
      defaultViewVector: [0.98, 0.44, 1.06],
      mobileViewVector: [0.8, 0.34, 0.94]
    }
  },
  "tomb-effigy-ermengol-ix": {
    kind: "gltf",
    path: "/tomb-effigy-ermengol-ix/",
    sectionId: "early-renaissance",
    sortOrder: 73.5,
    viewerTitle: "Tomb Effigy of a Boy, Probably Ermengol IX, Count of Urgell (Catalan, first half 14th century)",
    subtitle: "The Metropolitan Museum of Art, The Cloisters",
    medium: "Limestone, traces of paint",
    dimensions: "15 3/8 x 33 7/8 x 15 1/4 in. (39 x 86 x 38.7 cm)",
    locationLabel: "On view:",
    location: "Gallery 009, The Cloisters, The Metropolitan Museum of Art",
    culture: "Catalan",
    period: "first half 14th century",
    current_location: "Gallery 009, The Cloisters, The Metropolitan Museum of Art",
    scan_source: "The Met 3D / VNTANA",
    mesh_format: "GLB",
    tags: ["Catalan", "Tomb effigy", "Limestone", "The Cloisters", "The Met"],
    lobbyMeta: "Source: The Met 3D / The Cloisters",
    source: source(
      "Rendered from The Metropolitan Museum of Art's 3D model of Tomb Effigy of a Boy, Probably Ermengol IX, Count of Urgell.",
      [
        link("Met object page", "https://www.metmuseum.org/art/collection/search/471965"),
        link("Original GLB", "https://api.vntana.com/assets/products/b87af5fb-bcb7-435c-a642-bb80c25e8024/organizations/The-Metropolitan-Museum-of-Art/clients/masters/43a61c35-5381-4979-a41f-b3ff8396bf37.glb")
      ],
      "The title, date, culture, medium, dimensions, collection, and gallery number follow The Met collection record."
    ),
    defaults: {
      zoom: 2.88,
      lightAngle: 24,
      lightPower: 2.02,
      exposure: 0.42,
      rough: 0.24
    },
    model: {
      primaryUrl: "./tomb_effigy_ermengol_ix.glb",
      fallbackUrl: "./tomb_effigy_ermengol_ix.glb"
    },
    scene: {
      targetHeight: 0.82,
      focusYRatio: 0.5,
      defaultYaw: Math.PI * 0.04,
      defaultViewVector: [0.96, 0.4, 1.28],
      mobileViewVector: [0.78, 0.34, 1.08]
    }
  },
  spandrel: {
    kind: "gltf",
    path: "/spandrel/",
    sectionId: "early-renaissance",
    sortOrder: 73,
    viewerTitle: "Spandrel (Catalan, ca. 1130-40)",
    subtitle: "The Metropolitan Museum of Art, The Cloisters",
    medium: "Marble",
    dimensions: "17 7/8 x 14 1/4 x 7 1/4 in. (45.4 x 36.2 x 18.4 cm)",
    locationLabel: "Collection:",
    location: "The Cloisters, The Metropolitan Museum of Art",
    culture: "Catalan",
    region: "Europe",
    period: "ca. 1130-40",
    current_location: "The Cloisters, The Metropolitan Museum of Art",
    findspot_or_origin: "Present-day France",
    scan_source: "The Met 3D / VNTANA",
    mesh_format: "GLB",
    tags: ["Catalan", "Marble", "Architectural sculpture", "The Cloisters", "The Met"],
    lobbyMeta: "Source: The Met 3D / The Cloisters",
    source: source(
      "Rendered from The Metropolitan Museum of Art's 3D model of Spandrel.",
      [
        link("Met object page", "https://www.metmuseum.org/art/collection/search/470623"),
        link("Original GLB", "https://api.vntana.com/assets/products/27070bd1-28b8-4db5-bb4d-b9783f60c789/organizations/The-Metropolitan-Museum-of-Art/clients/masters/4e54cf5a-594d-4a48-b9ed-62dfdbd275aa.glb")
      ],
      "The title, date, culture, medium, dimensions, collection, and place of origin follow The Met collection record."
    ),
    defaults: {
      zoom: 3.02,
      lightAngle: 24,
      lightPower: 2.02,
      exposure: 0.42,
      rough: 0.24
    },
    model: {
      primaryUrl: "./spandrel.glb",
      fallbackUrl: "./spandrel.glb"
    },
    scene: {
      targetHeight: 0.94,
      focusYRatio: 0.54,
      defaultYaw: Math.PI * 0.06,
      defaultViewVector: [0.92, 0.42, 1.04],
      mobileViewVector: [0.74, 0.34, 0.92]
    }
  },
  "pieta-with-donors": {
    kind: "gltf",
    path: "/pieta-with-donors/",
    sectionId: "early-renaissance",
    sortOrder: 74,
    viewerTitle: "Pieta with Donors (French, ca. 1515)",
    subtitle: "Artist: Unknown French sculptor",
    medium: "Limestone, traces of polychromy",
    dimensions: "Overall: 43 3/8 x 92 1/2 x 22 in. (110.2 x 235 x 55.9 cm)",
    locationLabel: "On view:",
    location: "Gallery 306, The Metropolitan Museum of Art",
    culture: "French",
    region: "Europe",
    period: "ca. 1515",
    current_location: "Gallery 306, The Metropolitan Museum of Art",
    scan_source: "The Met 3D / VNTANA",
    mesh_format: "GLB",
    tags: ["French", "Limestone", "Polychromy", "Pieta", "The Met"],
    lobbyMeta: "Source: The Met 3D / Department of Medieval Art",
    source: source(
      "Rendered from The Metropolitan Museum of Art's 3D model of Pieta with Donors.",
      [
        link("Met object page", "https://www.metmuseum.org/art/collection/search/463716"),
        link("Original GLB", "https://api.vntana.com/assets/products/315550e8-4bc4-43b9-b802-d79561e6fa6f/organizations/The-Metropolitan-Museum-of-Art/clients/masters/64ab0781-c6c6-4a41-9f26-3223814df653.glb")
      ],
      "The title, date, culture, medium, dimensions, department, and gallery location follow The Met collection record."
    ),
    defaults: {
      zoom: 2.82,
      lightAngle: 24,
      lightPower: 2.02,
      exposure: 0.42,
      rough: 0.24
    },
    model: {
      primaryUrl: "./pieta_with_donors.glb",
      fallbackUrl: "./pieta_with_donors.glb"
    },
    scene: {
      targetHeight: 0.82,
      focusYRatio: 0.52,
      defaultYaw: Math.PI * 0.04,
      defaultViewVector: [1.02, 0.42, 1.28],
      mobileViewVector: [0.82, 0.34, 1.08]
    }
  },
  "entombment-of-christ": {
    kind: "gltf",
    path: "/entombment-of-christ/",
    sectionId: "early-renaissance",
    sortOrder: 74.5,
    viewerTitle: "Entombment of Christ (French, ca. 1515)",
    subtitle: "Artist: Unknown French sculptor",
    medium: "Limestone, polychromy",
    dimensions: "Figurative area: 90 in. x 9 ft. 8 1/2 in. x 39 in. (228.6 x 295.9 x 99.1 cm)",
    locationLabel: "On view:",
    location: "Gallery 306, The Metropolitan Museum of Art",
    culture: "French",
    region: "Europe",
    period: "ca. 1515",
    current_location: "Gallery 306, The Metropolitan Museum of Art",
    scan_source: "The Met 3D / VNTANA",
    mesh_format: "GLB",
    tags: ["French", "Limestone", "Polychromy", "Entombment", "The Met"],
    lobbyMeta: "Source: The Met 3D / Department of Medieval Art",
    source: source(
      "Rendered from The Metropolitan Museum of Art's 3D model of Entombment of Christ.",
      [
        link("Met object page", "https://www.metmuseum.org/art/collection/search/463717"),
        link("Original GLB", "https://api.vntana.com/assets/products/54718818-2977-4982-8843-804ad83a9fc3/organizations/The-Metropolitan-Museum-of-Art/clients/masters/c45a1e8b-ac0b-4bf5-a61a-c8a5f70a5e25.glb")
      ],
      "The title, date, culture, medium, dimensions, department, and gallery location follow The Met collection record."
    ),
    defaults: {
      zoom: 2.76,
      lightAngle: 24,
      lightPower: 2.02,
      exposure: 0.42,
      rough: 0.24
    },
    model: {
      primaryUrl: "./entombment_of_christ.glb",
      fallbackUrl: "./entombment_of_christ.glb"
    },
    scene: {
      targetHeight: 0.86,
      focusYRatio: 0.52,
      defaultYaw: Math.PI * 0.04,
      defaultViewVector: [1.08, 0.42, 1.42],
      mobileViewVector: [0.86, 0.34, 1.18]
    }
  },
  "mourning-victory-melvin-memorial": {
    kind: "gltf",
    path: "/mourning-victory-melvin-memorial/",
    sectionId: "modern-sculpture",
    sortOrder: 2,
    viewerTitle: "Mourning Victory from the Melvin Memorial (1906-8, carved 1912-15)",
    subtitle: "Artist: Daniel Chester French (1850-1931); The Metropolitan Museum of Art, The American Wing",
    medium: "Marble",
    dimensions: "120 1/2 x 57 1/4 x 28 3/4 in. (306.1 x 145.4 x 73 cm)",
    locationLabel: "On view:",
    location: "Gallery 700, The Metropolitan Museum of Art",
    culture: "American",
    region: "Americas",
    period: "1906-15",
    current_location: "Gallery 700, The Metropolitan Museum of Art",
    scan_source: "The Met 3D / VNTANA",
    mesh_format: "GLB",
    tags: ["American", "Marble", "Daniel Chester French", "The Met", "Modern Sculpture"],
    lobbyMeta: "Source: The Met 3D / The American Wing",
    source: source(
      "Rendered from The Metropolitan Museum of Art's 3D model of Mourning Victory from the Melvin Memorial.",
      [
        link("Met object page", "https://www.metmuseum.org/art/collection/search/10912"),
        link("Original GLB", "https://api.vntana.com/assets/products/35f5d75d-7032-4a77-aceb-ac479c78133d/organizations/The-Metropolitan-Museum-of-Art/clients/masters/cc930f9f-5073-4864-8105-8d6b8a4a7c65.glb")
      ],
      "The title, date, artist, medium, dimensions, collection, and gallery location follow The Met collection record."
    ),
    defaults: {
      zoom: 2.72,
      lightAngle: 24,
      lightPower: 2.02,
      exposure: 0.42,
      rough: 0.24
    },
    model: {
      primaryUrl: "./mourning_victory_from_the_melvin_memorial.glb",
      fallbackUrl: "./mourning_victory_from_the_melvin_memorial.glb"
    },
    scene: {
      targetHeight: 1.54,
      focusYRatio: 0.56,
      defaultYaw: Math.PI * 0.04,
      defaultViewVector: [1.04, 0.64, 1.16],
      mobileViewVector: [0.84, 0.48, 1.04]
    }
  },
  "outside-row-standing-horse": {
    kind: "gltf",
    path: "/outside-row-standing-horse/",
    sectionId: "modern-sculpture",
    sortOrder: 3,
    viewerTitle: "Outside Row Standing Horse (Carousel Figure) (American, ca. 1917)",
    subtitle: "Artist: Daniel Muller (1872-1952); The Metropolitan Museum of Art, The American Wing",
    medium: "Basswood, paint, glass, steel",
    dimensions: "H: 157.5 cm | W: 30.5 cm | D: 167.6 cm",
    locationLabel: "On view:",
    location: "Gallery 774, The Metropolitan Museum of Art",
    culture: "American",
    region: "Americas",
    period: "ca. 1917",
    current_location: "Gallery 774, The Metropolitan Museum of Art",
    scan_source: "The Met 3D / VNTANA",
    mesh_format: "GLB",
    tags: ["American", "Carousel", "Basswood", "Daniel Muller", "The Met", "Modern Sculpture"],
    lobbyMeta: "Source: The Met 3D / The American Wing",
    source: source(
      "Rendered from The Metropolitan Museum of Art's 3D model of Outside Row Standing Horse (Carousel Figure).",
      [
        link("Met object page", "https://www.metmuseum.org/art/collection/search/830041"),
        link("Original GLB", "https://api.vntana.com/assets/products/9c7970a1-bb46-420a-b6db-7564241e9612/organizations/The-Metropolitan-Museum-of-Art/clients/masters/c94111db-28a8-4555-b748-a7ccf46782d2.glb")
      ],
      "The title, date, artist, medium, dimensions, department, and gallery location follow The Met collection record."
    ),
    defaults: {
      zoom: 2.84,
      lightAngle: 24,
      lightPower: 2.02,
      exposure: 0.42,
      rough: 0.24
    },
    model: {
      primaryUrl: "./outside_row_standing_horse.glb",
      fallbackUrl: "./outside_row_standing_horse.glb"
    },
    scene: {
      targetHeight: 1.08,
      focusYRatio: 0.54,
      defaultYaw: Math.PI * 0.06,
      defaultViewVector: [1.0, 0.46, 1.08],
      mobileViewVector: [0.8, 0.34, 0.96]
    }
  },
  "inscribed-turtle-plastron": {
    kind: "gltf",
    path: "/asia/inscribed-turtle-plastron/index.html",
    sectionId: "asia",
    sortOrder: 1,
    viewerTitle: "Inscribed Turtle Plastron (late Shang dynasty)",
    subtitle: "Institute of History and Philology collection; reign of Wu Ding, Anyang, China",
    medium: "Turtle plastron with pigment",
    locationLabel: "Findspot:",
    location: "Pit No. 127 Hsiao-t'un, Yin-xu Site",
    lobbyMeta: "Source: Smithsonian 3D / Institute of History and Philology",
    source: smithsonianSource({
      summary: "Rendered from Smithsonian 3D's inscribed turtle plastron model from the Anyang collection.",
      recordUrl: "https://3d.si.edu/object/3d/inscribed-turtle-plastron%3A58be9e1e-9966-4f22-8eb8-b62a0205c697",
      packageId: "58be9e1e-9966-4f22-8eb8-b62a0205c697",
      mediumFile: "R041287-70k-2048-medium.glb",
      note: "Smithsonian identifies the oracle bone as a late Shang divination record and lists usage conditions apply."
    }),
    model: {
      primaryUrl: smithsonianAsset("58be9e1e-9966-4f22-8eb8-b62a0205c697", "R041287-70k-2048-medium.glb"),
      fallbackUrl: smithsonianAsset("58be9e1e-9966-4f22-8eb8-b62a0205c697", "R041287-70k-2048-medium.glb")
    },
    defaults: {
      zoom: 3.04,
      lightAngle: 24,
      lightPower: 2.02,
      exposure: 0.42,
      rough: 0.24
    },
    scene: {
      targetHeight: 0.72,
      defaultYaw: Math.PI * 0.06,
      defaultViewVector: [0.9, 0.44, 1.02],
      mobileViewVector: [0.72, 0.34, 0.94]
    }
  },
  "ritual-wine-cup-gu": {
    kind: "gltf",
    path: "/asia/ritual-wine-cup-gu/index.html",
    sectionId: "asia",
    sortOrder: 2,
    viewerTitle: "Ritual Wine Cup (Gu) with Masks, Dragons, and Snakes (China, c. 1150-1100 BCE)",
    subtitle: "Artist: Unknown Chinese bronze caster; Anyang, probably Henan province, China",
    medium: "Bronze",
    dimensions: "H: 32.7 cm | Diam: 19.4 cm",
    locationLabel: "Origin:",
    location: "Anyang, probably Henan province, China",
    lobbyMeta: "Source: Smithsonian 3D / National Museum of Asian Art",
    source: smithsonianSource({
      summary: "Rendered from Smithsonian 3D's ritual wine cup (gu) from the Anyang collection.",
      recordUrl: "https://3d.si.edu/object/3d/ritual-wine-cup-gu-masks-taotie-dragons-and-snakes%3A77942e15-a113-4e4a-a83e-d881844bdf2e",
      packageId: "77942e15-a113-4e4a-a83e-d881844bdf2e",
      mediumFile: "fsg-F1951_18-mg01-140k-2048-medium.glb",
      note: "Smithsonian lists usage conditions apply."
    }),
    model: {
      primaryUrl: smithsonianAsset("77942e15-a113-4e4a-a83e-d881844bdf2e", "fsg-F1951_18-mg01-140k-2048-medium.glb"),
      fallbackUrl: smithsonianAsset("77942e15-a113-4e4a-a83e-d881844bdf2e", "fsg-F1951_18-mg01-140k-2048-medium.glb")
    },
    defaults: {
      zoom: 2.88,
      lightAngle: 24,
      lightPower: 2.04,
      exposure: 0.42,
      rough: 0.22
    },
    scene: {
      rotateX: 0,
      targetHeight: 0.9,
      defaultYaw: -Math.PI * 0.08,
      defaultViewVector: [0.98, 0.48, 1.18],
      mobileViewVector: [0.76, 0.36, 1.06]
    },
    material: {
      color: "#735533",
      metalness: 0.82,
      clearcoat: 0.08,
      clearcoatRoughness: 0.46,
      reflectivity: 0.82
    }
  },
  "ritual-wine-container-fangyi": {
    kind: "gltf",
    path: "/asia/ritual-wine-container-fangyi/index.html",
    sectionId: "asia",
    sortOrder: 3,
    viewerTitle: "Ritual Wine Container (Fangyi) with Masks, Serpents, and Birds (China, c. 1100 BCE)",
    subtitle: "Artist: Unknown Chinese bronze caster; Luoyang, probably Henan province, China",
    medium: "Bronze",
    dimensions: "H: 35.3 cm | W: 24.8 cm | D: 23.3 cm",
    locationLabel: "Origin:",
    location: "Luoyang, probably Henan province, China",
    lobbyMeta: "Source: Smithsonian 3D / National Museum of Asian Art",
    source: smithsonianSource({
      summary: "Rendered from Smithsonian 3D's ritual wine container (fangyi) from the Anyang collection.",
      recordUrl: "https://3d.si.edu/object/3d/ritual-wine-container-fangyi-maskstaotie-serpents-and-birds%3Ad8c62f94-4ebc-11ea-b77f-2e728ce88125",
      packageId: "d8c62f94-4ebc-11ea-b77f-2e728ce88125",
      highFile: "f1930_54-part_01-smartscan-fixed-textured-150k-4096-high.glb",
      mediumFile: "f1930_54-part_01-smartscan-fixed-textured-150k-2048-medium.glb",
      note: "Smithsonian marks the object and package CC0."
    }),
    model: {
      primaryUrl: smithsonianAsset("d8c62f94-4ebc-11ea-b77f-2e728ce88125", "f1930_54-part_01-smartscan-fixed-textured-150k-4096-high.glb"),
      fallbackUrl: smithsonianAsset("d8c62f94-4ebc-11ea-b77f-2e728ce88125", "f1930_54-part_01-smartscan-fixed-textured-150k-2048-medium.glb")
    },
    defaults: {
      zoom: 2.84,
      lightAngle: 24,
      lightPower: 2.04,
      exposure: 0.42,
      rough: 0.22
    },
    scene: {
      targetHeight: 0.96,
      defaultYaw: Math.PI * 0.06,
      defaultViewVector: [0.98, 0.48, 1.2],
      mobileViewVector: [0.76, 0.36, 1.08]
    },
    material: {
      color: "#715331",
      metalness: 0.82,
      clearcoat: 0.08,
      clearcoatRoughness: 0.46,
      reflectivity: 0.82
    }
  },
  "ritual-wine-ewer-gong": {
    kind: "gltf",
    path: "/asia/ritual-wine-ewer-gong/index.html",
    sectionId: "asia",
    sortOrder: 4,
    viewerTitle: "Ritual Wine Ewer (Gong) with Masks, Dragons, and Animals (China, c. 1100-1050 BCE)",
    subtitle: "Artist: Unknown Chinese bronze caster",
    medium: "Bronze",
    dimensions: "H: 32.2 cm | W: 32.2 cm | D: 15.7 cm",
    locationLabel: "Origin:",
    location: "China",
    lobbyMeta: "Source: Smithsonian 3D / National Museum of Asian Art",
    source: smithsonianSource({
      summary: "Rendered from Smithsonian 3D's ritual wine ewer (gong) from the National Museum of Asian Art collection.",
      recordUrl: "https://3d.si.edu/object/3d/ritual-wine-ewer-gong-masks-taotie-dragons-and-real-animals%3Ad8c646aa-4ebc-11ea-b77f-2e728ce88125",
      packageId: "d8c646aa-4ebc-11ea-b77f-2e728ce88125",
      highFile: "f1961_33-part_01-laser-ortery_texture-150k-4096-high.glb",
      mediumFile: "f1961_33-part_01-laser-ortery_texture-150k-2048-medium.glb",
      note: "Smithsonian marks the object and package CC0."
    }),
    model: {
      primaryUrl: smithsonianAsset("d8c646aa-4ebc-11ea-b77f-2e728ce88125", "f1961_33-part_01-laser-ortery_texture-150k-4096-high.glb"),
      fallbackUrl: smithsonianAsset("d8c646aa-4ebc-11ea-b77f-2e728ce88125", "f1961_33-part_01-laser-ortery_texture-150k-2048-medium.glb")
    },
    defaults: {
      zoom: 2.86,
      lightAngle: 24,
      lightPower: 2.04,
      exposure: 0.42,
      rough: 0.22
    },
    scene: {
      rotateZ: -Math.PI,
      targetHeight: 0.94,
      defaultYaw: -Math.PI * 0.04,
      defaultViewVector: [1.0, 0.48, 1.18],
      mobileViewVector: [0.78, 0.36, 1.08]
    },
    material: {
      color: "#745430",
      metalness: 0.82,
      clearcoat: 0.08,
      clearcoatRoughness: 0.46,
      reflectivity: 0.82
    }
  },
  "spouted-vessel-he": {
    kind: "gltf",
    path: "/asia/spouted-vessel-he/index.html",
    sectionId: "asia",
    sortOrder: 5,
    viewerTitle: "Spouted Vessel (He) in the Form of an Elephant (China, c. 1100 BCE)",
    subtitle: "Artist: Unknown Chinese bronze caster; Anyang, probably Henan province, China",
    medium: "Bronze",
    dimensions: "H: 17.2 cm | W: 10.7 cm | D: 21.4 cm",
    locationLabel: "Origin:",
    location: "Anyang, probably Henan province, China",
    lobbyMeta: "Source: Smithsonian 3D / National Museum of Asian Art",
    source: smithsonianSource({
      summary: "Rendered from Smithsonian 3D's elephant-form spouted vessel (he) from the Anyang collection.",
      recordUrl: "https://3d.si.edu/object/3d/spouted-vessel-he-form-elephant-masks-taotie-dragons-and-snakes%3Ad8c63598-4ebc-11ea-b77f-2e728ce88125",
      packageId: "d8c63598-4ebc-11ea-b77f-2e728ce88125",
      highFile: "elephant_zun-36_6_a_b-base-150k-4096-high.glb",
      mediumFile: "elephant_zun-36_6_a_b-base-150k-2048-medium.glb",
      note: "Smithsonian lists usage conditions apply."
    }),
    model: {
      primaryUrl: smithsonianAsset("d8c63598-4ebc-11ea-b77f-2e728ce88125", "elephant_zun-36_6_a_b-base-150k-4096-high.glb"),
      fallbackUrl: smithsonianAsset("d8c63598-4ebc-11ea-b77f-2e728ce88125", "elephant_zun-36_6_a_b-base-150k-2048-medium.glb")
    },
    defaults: {
      zoom: 2.98,
      lightAngle: 24,
      lightPower: 2.06,
      exposure: 0.42,
      rough: 0.22
    },
    scene: {
      rotateX: 0,
      targetHeight: 0.78,
      defaultYaw: Math.PI * 0.08,
      defaultViewVector: [0.94, 0.4, 1.06],
      mobileViewVector: [0.74, 0.32, 0.96]
    },
    material: {
      color: "#7a5932",
      metalness: 0.82,
      clearcoat: 0.08,
      clearcoatRoughness: 0.46,
      reflectivity: 0.82
    }
  },
  "kneeling-winged-monster": {
    kind: "gltf",
    path: "/asia/kneeling-winged-monster/index.html",
    sectionId: "asia",
    sortOrder: 8,
    viewerTitle: "Kneeling Winged Monster (China, 550-577 CE)",
    subtitle: "Freer Gallery of Art collection; Northern Xiangtangshan, Hebei province, China",
    medium: "Limestone freestanding sculpture",
    dimensions: "H: 88.4 cm | W: 47.3 cm | D: 28.5 cm",
    locationLabel: "Origin:",
    location: "Northern Xiangtangshan, Middle Cave, Hebei province, China",
    lobbyMeta: "Source: Smithsonian 3D / National Museum of Asian Art",
    source: smithsonianSource({
      summary: "Rendered from Smithsonian 3D's kneeling winged monster from Northern Xiangtangshan.",
      recordUrl: "https://3d.si.edu/object/3d/kneeling-winged-monster%3A0dc68216-3651-44c7-99cf-18e5d4d1eb9f",
      packageId: "0dc68216-3651-44c7-99cf-18e5d4d1eb9f",
      highFile: "kneeling-winged-monster-150k-4096-high.glb",
      mediumFile: "kneeling-winged-monster-150k-2048-medium.glb",
      note: "Smithsonian marks the object and package CC0."
    }),
    model: {
      primaryUrl: smithsonianAsset("0dc68216-3651-44c7-99cf-18e5d4d1eb9f", "kneeling-winged-monster-150k-4096-high.glb"),
      fallbackUrl: smithsonianAsset("0dc68216-3651-44c7-99cf-18e5d4d1eb9f", "kneeling-winged-monster-150k-2048-medium.glb")
    },
    defaults: {
      zoom: 2.56,
      lightAngle: 24,
      lightPower: 2.04,
      exposure: 0.42,
      rough: 0.24
    },
    scene: {
      targetHeight: 1.16,
      defaultYaw: Math.PI * 0.08,
      defaultViewVector: [1.04, 0.58, 1.34],
      mobileViewVector: [0.82, 0.44, 1.18]
    }
  },
  "gwaneum-crown": {
    kind: "gltf",
    path: "/asia/gwaneum-crown/index.html",
    sectionId: "asia",
    sortOrder: 18,
    viewerTitle: "Bodhisattva Avalokiteshvara (Gwaneum) - Crown",
    subtitle: "National Museum of Asian Art collection; Korea, Goryeo period",
    medium: "Gilt wood, gilt copper, and iron",
    dimensions: "H: 21 cm",
    locationLabel: "Origin:",
    location: "Korea, Goryeo period",
    lobbyMeta: "Source: Smithsonian 3D / National Museum of Asian Art",
    source: smithsonianSource({
      summary: "Rendered from Smithsonian 3D's crown component of the Gwaneum model from the National Museum of Asian Art.",
      recordUrl: "https://3d.si.edu/object/3d/bodhisattva-avalokiteshvara-gwaneum-crown%3A08137edb-b267-4e74-b78a-bebb9562ffd0",
      packageId: "08137edb-b267-4e74-b78a-bebb9562ffd0",
      highFile: "bodhisattva-avalokiteshvara-(gwaneum),-duk-953---crown-only-150k-4096-high.glb",
      mediumFile: "bodhisattva-avalokiteshvara-(gwaneum),-duk-953---crown-only-150k-2048-medium.glb",
      note: "Smithsonian lists usage conditions apply."
    }),
    model: {
      primaryUrl: smithsonianAsset("08137edb-b267-4e74-b78a-bebb9562ffd0", "bodhisattva-avalokiteshvara-(gwaneum),-duk-953---crown-only-150k-4096-high.glb"),
      fallbackUrl: smithsonianAsset("08137edb-b267-4e74-b78a-bebb9562ffd0", "bodhisattva-avalokiteshvara-(gwaneum),-duk-953---crown-only-150k-2048-medium.glb")
    },
    defaults: {
      zoom: 3.12,
      lightAngle: 24,
      lightPower: 2.06,
      exposure: 0.42,
      rough: 0.22
    },
    scene: {
      targetHeight: 0.64,
      defaultYaw: Math.PI * 0.06,
      defaultViewVector: [0.86, 0.38, 0.94],
      mobileViewVector: [0.68, 0.28, 0.86]
    }
  },
  "cosmic-buddha": {
    kind: "gltf",
    path: "/asia/cosmic-buddha/",
    sectionId: "asia",
    sortOrder: 6,
    viewerTitle: "Buddha Draped in Robes Portraying the Realms of Desire (China, 550-577 CE)",
    subtitle: "Freer Gallery of Art collection; Northern Qi dynasty, Henan, China",
    medium: "Limestone",
    dimensions: "H: 151.3 cm | W: 62.9 cm | D: 31.3 cm",
    locationLabel: "Origin:",
    location: "Anyang, Henan province, China",
    lobbyMeta: "Source: Smithsonian 3D / National Museum of Asian Art",
    source: source(
      "Rendered from Smithsonian 3D's model of Buddha draped in robes portraying the Realms of Desire, also circulated in Smithsonian Commons as the 'Cosmic Buddha' scan.",
      [
        link("Smithsonian 3D record", "https://3d.si.edu/object/3d/buddha-draped-robes-portraying-realms-existence:d8c62be8-4ebc-11ea-b77f-2e728ce88125"),
        link("Voyager document", "https://3d-api.si.edu/content/document/3d_package:d8c62be8-4ebc-11ea-b77f-2e728ce88125/document.json"),
        link("High GLB", "https://3d-api.si.edu/content/document/3d_package:d8c62be8-4ebc-11ea-b77f-2e728ce88125/cosmic-buddha-laser-scan-150k-4096-high.glb"),
        link("Wikimedia Commons STL", "https://commons.wikimedia.org/wiki/File:Cosmic-buddha-laser-scan-150k_(Smithsonian_Institution).stl")
      ],
      "Smithsonian marks both the 3D package and the object metadata as CC0. The official object page titles the work 'Buddha draped in robes portraying the Realms of Desire'; the Commons STL uses the shorter 'Cosmic Buddha' label."
    ),
    defaults: {
      zoom: 2.52,
      lightAngle: 24,
      lightPower: 2.08,
      exposure: 0.48,
      rough: 0.22
    },
    model: {
      primaryUrl: "https://3d-api.si.edu/content/document/3d_package:d8c62be8-4ebc-11ea-b77f-2e728ce88125/cosmic-buddha-laser-scan-150k-4096-high.glb",
      fallbackUrl: "https://3d-api.si.edu/content/document/3d_package:d8c62be8-4ebc-11ea-b77f-2e728ce88125/cosmic-buddha-laser-scan-150k-2048-medium.glb"
    },
    scene: {
      targetHeight: 1.52,
      defaultYaw: -Math.PI * 0.06,
      defaultViewVector: [1.28, 0.7, 1.82],
      mobileViewVector: [0.92, 0.52, 1.72]
    }
  },
  ganesha: {
    kind: "stl",
    path: "/asia/ganesha/",
    sectionId: "asia",
    sortOrder: 20,
    viewerTitle: "Ganesha (Indonesia, 10th-11th century CE)",
    subtitle: "Artist: Unknown Javanese sculptor; Sailendra dynasty",
    medium: "Volcanic stone (andesite)",
    dimensions: "H: 88.3 cm | W: 52.1 cm | D: 40.5 cm",
    locationLabel: "Origin:",
    location: "Indonesia (Java)",
    lobbyMeta: "Source: Wikimedia Commons / Minneapolis Institute of Art STL",
    source: source(
      "Rendered from the CC0 Wikimedia Commons STL mirrored from the Minneapolis Institute of Art's Sketchfab model of a Javanese Ganesha.",
      [
        link("Mia collection page", "https://collections.artsmia.org/art/81675/ganesha-indonesia"),
        link("Wikimedia Commons file", "https://commons.wikimedia.org/wiki/File:Ganesha,_10th_-_11th_C_CE_-_3D_model_by_Minneapolis_Institute_of_Art_-_Sketchfab.stl"),
        link("Direct STL", "https://upload.wikimedia.org/wikipedia/commons/3/3f/Ganesha%2C_10th_-_11th_C_CE_-_3D_model_by_Minneapolis_Institute_of_Art_-_Sketchfab.stl"),
        link("Sketchfab source", "https://sketchfab.com/3d-models/ganesha-10th-11th-c-ce-375c670515684977b6ec05be115366ac")
      ],
      "The Commons file is CC0 and identifies the source model as the Minneapolis Institute of Art's public Sketchfab release. The date, dynasty, medium, and dimensions follow Mia's collection page."
    ),
    defaults: {
      zoom: 2.58,
      lightAngle: 26,
      lightPower: 2.12,
      exposure: 0.46,
      rough: 0.22
    },
    model: {
      primaryUrl: "https://upload.wikimedia.org/wikipedia/commons/3/3f/Ganesha%2C_10th_-_11th_C_CE_-_3D_model_by_Minneapolis_Institute_of_Art_-_Sketchfab.stl",
      fallbackUrl: "https://upload.wikimedia.org/wikipedia/commons/3/3f/Ganesha%2C_10th_-_11th_C_CE_-_3D_model_by_Minneapolis_Institute_of_Art_-_Sketchfab.stl"
    },
    timeouts: {
      primaryMs: 60000,
      fallbackMs: 60000
    },
    scene: {
      targetHeight: 1.42,
      defaultYaw: -Math.PI * 0.08,
      defaultViewVector: [1.22, 0.58, 1.82],
      mobileViewVector: [0.9, 0.48, 1.7]
    },
    material: {
      color: "#8f8169",
      clearcoat: 0.12,
      clearcoatRoughness: 0.48,
      sheen: 0.1,
      sheenRoughness: 0.92,
      sheenColor: "#e4d8c5",
      reflectivity: 0.26
    }
  },
  "uma-maheshvara": {
    kind: "stl",
    path: "/asia/uma-maheshvara/",
    sectionId: "asia",
    sortOrder: 22,
    viewerTitle: "Uma-Maheshvara (India, 10th-11th century CE)",
    subtitle: "Artist: Unknown Indian sculptor; Chandella dynasty",
    medium: "Buff sandstone",
    dimensions: "H: 149.9 cm | W: 83.2 cm | D: 34.3 cm",
    locationLabel: "Origin:",
    location: "India",
    lobbyMeta: "Source: Wikimedia Commons / Minneapolis Institute of Art STL",
    source: source(
      "Rendered from the CC0 Wikimedia Commons STL mirrored from the Minneapolis Institute of Art's Sketchfab model of the Chandella-period Uma-Maheshvara relief.",
      [
        link("Mia collection page", "https://collections.artsmia.org/art/5369/uma-maheshvara-india"),
        link("Wikimedia Commons file", "https://commons.wikimedia.org/wiki/File:Uma-Maheshvara,_10th_-_11th_C_CE_-_3D_model_by_Minneapolis_Institute_of_Art_-_Sketchfab.stl"),
        link("Direct STL", "https://upload.wikimedia.org/wikipedia/commons/e/e4/Uma-Maheshvara%2C_10th_-_11th_C_CE_-_3D_model_by_Minneapolis_Institute_of_Art_-_Sketchfab.stl"),
        link("Sketchfab source", "https://sketchfab.com/3d-models/uma-maheshvara-10th-11th-c-ce-892b7917f41346ceb4cf9bc0bb7d9c33")
      ],
      "The Commons file is CC0 and identifies the source model as the Minneapolis Institute of Art's public Sketchfab release. The dynasty, medium, and dimensions follow Mia's collection page."
    ),
    defaults: {
      zoom: 2.44,
      lightAngle: 24,
      lightPower: 2.08,
      exposure: 0.46,
      rough: 0.24
    },
    model: {
      primaryUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e4/Uma-Maheshvara%2C_10th_-_11th_C_CE_-_3D_model_by_Minneapolis_Institute_of_Art_-_Sketchfab.stl",
      fallbackUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e4/Uma-Maheshvara%2C_10th_-_11th_C_CE_-_3D_model_by_Minneapolis_Institute_of_Art_-_Sketchfab.stl"
    },
    timeouts: {
      primaryMs: 60000,
      fallbackMs: 60000
    },
    scene: {
      showPedestal: false,
      targetHeight: 1.06,
      focusYRatio: 0.5,
      defaultYaw: Math.PI * 0.04,
      defaultViewVector: [1.02, 0.28, 2.24],
      mobileViewVector: [0.74, 0.22, 2.04]
    },
    material: {
      color: "#d7c09a",
      clearcoat: 0.1,
      clearcoatRoughness: 0.5,
      sheen: 0.12,
      sheenRoughness: 0.92,
      sheenColor: "#efe0c8",
      reflectivity: 0.24
    }
  },
  "jue-wine-vessel": {
    kind: "stl",
    path: "/asia/jue-wine-vessel/index.html",
    sectionId: "asia",
    sortOrder: 10,
    viewerTitle: "Jue Wine Vessel (China, 16th-15th century BCE)",
    subtitle: "Artist: Unknown Chinese bronze caster; Erligang culture, early Shang period",
    medium: "Bronze",
    dimensions: "H: 14.1 cm | W: 12.1 cm | D: 6.6 cm",
    locationLabel: "Origin:",
    location: "China",
    lobbyMeta: "Source: Wikimedia Commons / Minneapolis Institute of Art STL",
    source: source(
      "Rendered from the CC0 Wikimedia Commons STL mirrored from the Minneapolis Institute of Art's Sketchfab model of a Shang-period jue wine vessel.",
      [
        link("Mia collection page", "https://collections.artsmia.org/art/5813/jue-wine-vessel-china"),
        link("Wikimedia Commons file", "https://commons.wikimedia.org/wiki/File:Jue_wine_vessel,_12th%E2%80%9311th_century_BCE_-_3D_model_by_Minneapolis_Institute_of_Art_-_Sketchfab.stl"),
        link("Direct STL", "https://upload.wikimedia.org/wikipedia/commons/1/1d/Jue_wine_vessel%2C_12th%E2%80%9311th_century_BCE_-_3D_model_by_Minneapolis_Institute_of_Art_-_Sketchfab.stl"),
        link("Sketchfab source", "https://sketchfab.com/3d-models/jue-wine-vessel-12th11th-century-bce-aaacea984640414e8afedbb9370c3455")
      ],
      "The Commons file is CC0 and identifies the source model as the Minneapolis Institute of Art's public Sketchfab release. Mia's collection page dates the object to the 16th-15th century BCE Erligang culture, while the file naming on Commons preserves an older 12th-11th century BCE label from the model trail."
    ),
    defaults: {
      zoom: 2.68,
      lightAngle: 24,
      lightPower: 2.06,
      exposure: 0.42,
      rough: 0.22
    },
    model: {
      primaryUrl: "https://upload.wikimedia.org/wikipedia/commons/1/1d/Jue_wine_vessel%2C_12th%E2%80%9311th_century_BCE_-_3D_model_by_Minneapolis_Institute_of_Art_-_Sketchfab.stl",
      fallbackUrl: "https://upload.wikimedia.org/wikipedia/commons/1/1d/Jue_wine_vessel%2C_12th%E2%80%9311th_century_BCE_-_3D_model_by_Minneapolis_Institute_of_Art_-_Sketchfab.stl"
    },
    timeouts: {
      primaryMs: 60000,
      fallbackMs: 60000
    },
    scene: {
      targetHeight: 0.78,
      defaultYaw: -Math.PI * 0.08,
      defaultViewVector: [1.12, 0.48, 1.48],
      mobileViewVector: [0.84, 0.36, 1.34]
    },
    material: {
      color: "#6f5836",
      metalness: 0.82,
      clearcoat: 0.08,
      clearcoatRoughness: 0.46,
      sheen: 0.0,
      sheenRoughness: 1.0,
      sheenColor: "#000000",
      reflectivity: 0.82
    }
  },
  "garuda-terminal": {
    kind: "stl",
    path: "/asia/terminal-in-the-form-of-garuda/index.html",
    sectionId: "asia",
    sortOrder: 24,
    viewerTitle: "Terminal in the Form of Garuda (Cambodia, 12th-13th century)",
    subtitle: "Artist: Unknown Cambodian metalworker; Bayon style",
    medium: "Bronze",
    dimensions: "H: 17.8 cm",
    locationLabel: "Origin:",
    location: "Cambodia",
    lobbyMeta: "Source: Wikimedia Commons / Minneapolis Institute of Art STL",
    source: source(
      "Rendered from the CC0 Wikimedia Commons STL mirrored from the Minneapolis Institute of Art's Sketchfab model of a small Cambodian Garuda terminal.",
      [
        link("Mia collection page", "https://collections.artsmia.org/art/1780/terminal-in-the-form-of-garuda-cambodia"),
        link("Wikimedia Commons file", "https://commons.wikimedia.org/wiki/File:Terminal_in_the_Form_of_Garuda,_12th-13th_C_CE_-_3D_model_by_Minneapolis_Institute_of_Art_-_Sketchfab.stl"),
        link("Direct STL", "https://upload.wikimedia.org/wikipedia/commons/d/d3/Terminal_in_the_Form_of_Garuda%2C_12th-13th_C_CE_-_3D_model_by_Minneapolis_Institute_of_Art_-_Sketchfab.stl"),
        link("Sketchfab source", "https://sketchfab.com/3d-models/terminal-in-the-form-of-garuda-12th-13th-c-ce-db9e1456641a4a31bef13e34da9021d5")
      ],
      "The Commons file is CC0 and identifies the source model as the Minneapolis Institute of Art's public Sketchfab release. Mia's collection page lists the object as a bronze Garuda terminal from Cambodia, 12th-13th century, and the Sketchfab description notes that the real object stands about 18 cm tall."
    ),
    defaults: {
      zoom: 2.82,
      lightAngle: 24,
      lightPower: 2.12,
      exposure: 0.42,
      rough: 0.22
    },
    model: {
      primaryUrl: "https://upload.wikimedia.org/wikipedia/commons/d/d3/Terminal_in_the_Form_of_Garuda%2C_12th-13th_C_CE_-_3D_model_by_Minneapolis_Institute_of_Art_-_Sketchfab.stl",
      fallbackUrl: "https://upload.wikimedia.org/wikipedia/commons/d/d3/Terminal_in_the_Form_of_Garuda%2C_12th-13th_C_CE_-_3D_model_by_Minneapolis_Institute_of_Art_-_Sketchfab.stl"
    },
    timeouts: {
      primaryMs: 60000,
      fallbackMs: 60000
    },
    scene: {
      targetHeight: 0.92,
      defaultYaw: Math.PI * 0.12,
      defaultViewVector: [1.08, 0.54, 1.46],
      mobileViewVector: [0.82, 0.42, 1.32]
    },
    material: {
      color: "#7b6240",
      metalness: 0.84,
      clearcoat: 0.08,
      clearcoatRoughness: 0.44,
      sheen: 0.0,
      sheenRoughness: 1.0,
      sheenColor: "#000000",
      reflectivity: 0.84
    }
  },
  "yoruba-tusk": {
    kind: "gltf",
    path: "/sub-saharan-africa/yoruba-tusk/",
    sectionId: "sub-saharan-africa",
    sortOrder: 12,
    viewerTitle: "Tusk (Nigeria, mid-20th century)",
    subtitle: "Artist: Yoruba artist",
    medium: "Ivory, stain",
    dimensions: "H: 72.1 cm | W: 5.4 cm | D: 8.6 cm",
    locationLabel: "Geography:",
    location: "Nigeria",
    lobbyMeta: "Source: Smithsonian 3D / National Museum of African Art",
    source: source(
      "Rendered from Smithsonian 3D's Tusk model, cataloged by the National Museum of African Art as a mid-twentieth-century Yoruba work from Nigeria.",
      [
        link("Smithsonian 3D record", "https://3d.si.edu/object/3d/tusk%3A9f619b00-0f0c-453f-96e7-f97454c10454"),
        link("Voyager document", "https://3d-api.si.edu/content/document/3d_package:9f619b00-0f0c-453f-96e7-f97454c10454/document.json"),
        link("High GLB", "https://3d-api.si.edu/content/document/3d_package:9f619b00-0f0c-453f-96e7-f97454c10454/nmafa-71_17_12-150k-4096-high.glb")
      ],
      "Smithsonian lists usage conditions on the source page. The title, maker, geography, medium, and dimensions follow the National Museum of African Art record."
    ),
    defaults: {
      zoom: 2.5,
      lightAngle: 18,
      lightPower: 1.98,
      exposure: 0.48,
      rough: 0.28
    },
    model: {
      primaryUrl: "https://3d-api.si.edu/content/document/3d_package:9f619b00-0f0c-453f-96e7-f97454c10454/nmafa-71_17_12-150k-4096-high.glb",
      fallbackUrl: "https://3d-api.si.edu/content/document/3d_package:9f619b00-0f0c-453f-96e7-f97454c10454/nmafa-71_17_12-150k-2048-medium.glb"
    },
    scene: {
      autoLevel: true,
      autoLevelBottomPercentile: 0.01,
      autoLevelBottomRatio: 0.025,
      showPedestal: false,
      targetHeight: 1.42,
      defaultYaw: 0,
      defaultViewVector: [1.04, 0.52, 1.9],
      mobileViewVector: [0.78, 0.42, 1.72]
    }
  },
  "toussaint-louverture-et-la-vieille-esclave": {
    kind: "gltf",
    path: "/americas/toussaint-louverture-et-la-vieille-esclave/index.html",
    sectionId: "americas",
    sortOrder: 17,
    viewerTitle: "Toussaint Louverture et la vieille esclave (1989)",
    subtitle: "Artist: Ousmane Sow (1935-2016), Senegal",
    medium: "Mixed media (iron, earth, jute, straw)",
    dimensions: "H: 220 cm | W: 100 cm | D: 110 cm",
    locationLabel: "Subject / Geography / Collection:",
    location: "Haiti (Toussaint Louverture); Senegal; National Museum of African Art, Smithsonian Institution",
    current_location: "National Museum of African Art, Smithsonian Institution",
    findspot_or_origin: "Senegal",
    lobbyMeta: "Source: Smithsonian 3D / NMAfA",
    source: smithsonianSource({
      summary: "Rendered from Smithsonian 3D's Toussaint Louverture et la vieille esclave model by Ousmane Sow.",
      recordUrl: "https://3d.si.edu/object/3d/toussaint-louverture-et-la-vieille-esclave:76dca86f-2700-49e2-b9fc-1be193e725ce",
      packageId: "76dca86f-2700-49e2-b9fc-1be193e725ce",
      highFile: "nmafa-200981-master_model-20230121-150k-4096-high.glb",
      mediumFile: "nmafa-200981-master_model-20230121-150k-2048-medium.glb",
      note: "Smithsonian lists usage conditions apply. The source page identifies the maker as Ousmane Sow, gives geography as Senegal, places the work in the National Museum of African Art collection, and describes Toussaint Louverture as the military leader of the Haitian Revolution."
    }),
    model: {
      primaryUrl: smithsonianAsset("76dca86f-2700-49e2-b9fc-1be193e725ce", "nmafa-200981-master_model-20230121-150k-4096-high.glb"),
      fallbackUrl: smithsonianAsset("76dca86f-2700-49e2-b9fc-1be193e725ce", "nmafa-200981-master_model-20230121-150k-2048-medium.glb")
    },
    defaults: {
      zoom: 2.38,
      lightAngle: 24,
      lightPower: 2.04,
      exposure: 0.42,
      rough: 0.24
    },
    scene: {
      rotateX: -Math.PI * 0.5,
      targetHeight: 1.66,
      defaultYaw: Math.PI * 0.04,
      defaultViewVector: [1.14, 0.68, 1.72],
      mobileViewVector: [0.88, 0.52, 1.54]
    }
  },
  "19th-century-kid-queen-victoria": {
    kind: "gltf",
    path: "/sub-saharan-africa/19th-century-kid-queen-victoria/index.html",
    sectionId: "sub-saharan-africa",
    sortOrder: 16,
    viewerTitle: "19th Century Kid (Queen Victoria) (1999)",
    subtitle: "Artist: Yinka Shonibare (born 1962), London, United Kingdom",
    medium: "Cloth, synthetic fiber, dyes, wood, metal, leather",
    dimensions: "H: 158 cm | W: 80 cm | D: 85 cm",
    locationLabel: "Geography / Collection:",
    location: "Nigeria; National Museum of African Art, Smithsonian Institution",
    lobbyMeta: "Source: Smithsonian 3D / NMAfA",
    source: smithsonianSource({
      summary: "Rendered from Smithsonian 3D's 19th Century Kid (Queen Victoria) model by Yinka Shonibare.",
      recordUrl: "https://3d.si.edu/object/3d/19th-century-kid-queen-victoria:e3aa9c93-9e33-4b6f-bdcf-721df5144db6",
      packageId: "e3aa9c93-9e33-4b6f-bdcf-721df5144db6",
      highFile: "nmafa-200061-19th_century_kid-150k-4096-high.glb",
      mediumFile: "nmafa-200061-19th_century_kid-150k-2048-medium.glb",
      note: "Smithsonian lists usage conditions apply. The source page dates the work to 1999, gives geography as Nigeria, and places it in the National Museum of African Art collection."
    }),
    model: {
      primaryUrl: smithsonianAsset("e3aa9c93-9e33-4b6f-bdcf-721df5144db6", "nmafa-200061-19th_century_kid-150k-4096-high.glb"),
      fallbackUrl: smithsonianAsset("e3aa9c93-9e33-4b6f-bdcf-721df5144db6", "nmafa-200061-19th_century_kid-150k-2048-medium.glb")
    },
    defaults: {
      zoom: 2.42,
      lightAngle: 24,
      lightPower: 2.04,
      exposure: 0.42,
      rough: 0.24
    },
    scene: {
      rotateX: -Math.PI * 0.5,
      targetHeight: 1.48,
      defaultYaw: -Math.PI * 0.04,
      defaultViewVector: [1.08, 0.62, 1.58],
      mobileViewVector: [0.84, 0.46, 1.4]
    }
  },
  "gelede-helmet-mask": {
    kind: "gltf",
    path: "/sub-saharan-africa/gelede-helmet-mask/",
    sectionId: "sub-saharan-africa",
    sortOrder: 17,
    viewerTitle: "Gelede helmet mask (mid-20th century)",
    subtitle: "Artist: Yoruba artist; The Metropolitan Museum of Art, The Michael C. Rockefeller Wing",
    medium: "Wood",
    dimensions: "H. 22 1/2 x W. 15 1/4 x D. 18 in. (57.2 x 38.7 x 45.7 cm)",
    locationLabel: "On view:",
    location: "Gallery 343, The Metropolitan Museum of Art",
    culture: "Yoruba",
    region: "Sub-Saharan Africa",
    period: "mid-20th century",
    current_location: "Gallery 343, The Metropolitan Museum of Art",
    findspot_or_origin: "Ketu region, southwestern Nigeria or Republic of Benin",
    scan_source: "The Met 3D / VNTANA",
    mesh_format: "GLB",
    tags: ["Yoruba", "Nigeria", "Benin", "Wood", "The Met", "Mask"],
    lobbyMeta: "Source: The Met 3D / The Michael C. Rockefeller Wing",
    source: source(
      "Rendered from The Metropolitan Museum of Art's 3D model of Gelede helmet mask.",
      [
        link("Met object page", "https://www.metmuseum.org/art/collection/search/316460"),
        link("Original GLB", "https://api.vntana.com/assets/products/27075695-738d-492d-9509-8f1f387f6558/organizations/The-Metropolitan-Museum-of-Art/clients/masters/7ee8cc2e-15c0-42c6-b48a-8ab60b44950b.glb")
      ],
      "The title, date, artist attribution, culture, medium, dimensions, geography, collection, and gallery location follow The Met collection record."
    ),
    defaults: {
      zoom: 2.74,
      lightAngle: 24,
      lightPower: 2.02,
      exposure: 0.42,
      rough: 0.24
    },
    model: {
      primaryUrl: "./gelede_helmet_mask.glb",
      fallbackUrl: "./gelede_helmet_mask.glb"
    },
    scene: {
      targetHeight: 0.96,
      focusYRatio: 0.52,
      defaultYaw: Math.PI * 0.05,
      defaultViewVector: [0.98, 0.48, 1.04],
      mobileViewVector: [0.78, 0.36, 0.92]
    }
  },
  "key-marco-cat": {
    kind: "gltf",
    path: "/americas/key-marco-cat/index.html",
    sectionId: "americas",
    sortOrder: 4,
    viewerTitle: "Key Marco Cat (Florida, c. 700-1500 CE)",
    subtitle: "Artist: Unknown Indigenous woodcarver; possibly Calusa or another Southeastern artist",
    medium: "Wood",
    dimensions: "H: 15 cm | W: 4 cm | D: 6.5 cm",
    locationLabel: "Origin:",
    location: "Key Marco, Collier County, Florida, United States",
    lobbyMeta: "Source: Smithsonian 3D / NMNH Anthropology",
    source: source(
      "Rendered from Smithsonian 3D's 'Statuette of Mountain Lion or Panther Man God' model, popularly known as the Key Marco Cat.",
      [
        link("Smithsonian 3D record", "https://3d.si.edu/object/3d/statuette-mountain-lion-or-panther-man-god-key-marco-cat%3A9868cadc-d331-4b13-9864-a1740df6e47f"),
        link("Voyager document", "https://3d-api.si.edu/content/document/3d_package:9868cadc-d331-4b13-9864-a1740df6e47f/document.json"),
        link("High GLB", "https://3d-api.si.edu/content/document/3d_package:9868cadc-d331-4b13-9864-a1740df6e47f/key-marco-cat-(color)-150k-4096-high.glb")
      ],
      "Smithsonian's anthropology record lists the object's metadata usage as CC0 and places it at Key Marco in Collier County, Florida. The cultural attribution remains debated; the record notes Calusa and broader Southeastern possibilities."
    ),
    defaults: {
      zoom: 2.78,
      lightAngle: 20,
      lightPower: 2.02,
      exposure: 0.42,
      rough: 0.24
    },
    model: {
      primaryUrl: "https://3d-api.si.edu/content/document/3d_package:9868cadc-d331-4b13-9864-a1740df6e47f/key-marco-cat-(color)-150k-4096-high.glb",
      fallbackUrl: "https://3d-api.si.edu/content/document/3d_package:9868cadc-d331-4b13-9864-a1740df6e47f/key-marco-cat-(color)-150k-2048-medium.glb"
    },
    scene: {
      rotateX: 0,
      targetHeight: 0.76,
      defaultYaw: Math.PI * 0.12,
      defaultViewVector: [1.02, 0.46, 1.24],
      mobileViewVector: [0.76, 0.36, 1.12]
    }
  },
  "dying-tecumseh": {
    kind: "gltf",
    path: "/americas/dying-tecumseh/index.html",
    sectionId: "americas",
    sortOrder: 8,
    viewerTitle: "The Dying Tecumseh (modeled c. 1837-1846, carved 1856)",
    subtitle: "Artist: Ferdinand Pettrich (1798-1872); sitter: Tecumseh",
    medium: "Marble",
    dimensions: "H: 93.1 cm | W: 197.2 cm | D: 136.6 cm",
    locationLabel: "Collection:",
    location: "Smithsonian American Art Museum",
    lobbyMeta: "Source: Smithsonian 3D / SAAM",
    source: source(
      "Rendered from Smithsonian 3D's scan of Ferdinand Pettrich's The Dying Tecumseh from the Smithsonian American Art Museum.",
      [
        link("Smithsonian 3D record", "https://3d.si.edu/object/3d/dying-tecumseh%3Aa572abe8-d60a-4ad5-aa86-6609e85ec4a6"),
        link("Voyager document", "https://3d-api.si.edu/content/document/3d_package:a572abe8-d60a-4ad5-aa86-6609e85ec4a6/document.json"),
        link("High GLB", "https://3d-api.si.edu/content/document/3d_package:a572abe8-d60a-4ad5-aa86-6609e85ec4a6/The_Dying_Tecumseh-150k-4096-high.glb")
      ],
      "The Smithsonian object page marks the work and its 3D package as CC0. Title, date, artist, sitter, medium, and dimensions follow the Smithsonian American Art Museum record."
    ),
    defaults: {
      zoom: 2.28,
      lightAngle: 22,
      lightPower: 2.04,
      exposure: 0.42,
      rough: 0.24
    },
    model: {
      primaryUrl: "https://3d-api.si.edu/content/document/3d_package:a572abe8-d60a-4ad5-aa86-6609e85ec4a6/The_Dying_Tecumseh-150k-4096-high.glb",
      fallbackUrl: "https://3d-api.si.edu/content/document/3d_package:a572abe8-d60a-4ad5-aa86-6609e85ec4a6/The_Dying_Tecumseh-150k-2048-medium.glb"
    },
    scene: {
      targetHeight: 0.84,
      focusYRatio: 0.48,
      defaultYaw: -Math.PI * 0.1,
      defaultViewVector: [1.08, 0.32, 1.84],
      mobileViewVector: [0.82, 0.26, 1.62]
    }
  },
  "wounded-scout": {
    kind: "gltf",
    path: "/americas/wounded-scout/index.html",
    sectionId: "americas",
    sortOrder: 10,
    viewerTitle: "The Wounded Scout, a Friend in the Swamp (patented 1864)",
    subtitle: "Artist: John Rogers (1829-1904)",
    medium: "Plaster",
    dimensions: "H: 56.3 cm | W: 28.1 cm | D: 21 cm",
    locationLabel: "Collection:",
    location: "Smithsonian American Art Museum",
    lobbyMeta: "Source: Smithsonian 3D / SAAM",
    source: source(
      "Rendered from Smithsonian 3D's scan of John Rogers's The Wounded Scout, a Friend in the Swamp.",
      [
        link("Smithsonian 3D record", "https://3d.si.edu/object/3d/wounded-scout-friend-swamp%3Aa09bb967-a8b8-46a2-9322-37b25a452b46"),
        link("Voyager document", "https://3d-api.si.edu/content/document/3d_package:a09bb967-a8b8-46a2-9322-37b25a452b46/document.json"),
        link("High GLB", "https://3d-api.si.edu/content/document/3d_package:a09bb967-a8b8-46a2-9322-37b25a452b46/The_Wounded_Scout__a_Friend_in_the_Swamp-150k-4096-high.glb")
      ],
      "The Smithsonian object page marks the work and its 3D package as CC0. Title, date, artist, medium, and dimensions follow the Smithsonian American Art Museum record."
    ),
    defaults: {
      zoom: 2.46,
      lightAngle: 24,
      lightPower: 2.06,
      exposure: 0.42,
      rough: 0.24
    },
    model: {
      primaryUrl: "https://3d-api.si.edu/content/document/3d_package:a09bb967-a8b8-46a2-9322-37b25a452b46/The_Wounded_Scout__a_Friend_in_the_Swamp-150k-4096-high.glb",
      fallbackUrl: "https://3d-api.si.edu/content/document/3d_package:a09bb967-a8b8-46a2-9322-37b25a452b46/The_Wounded_Scout__a_Friend_in_the_Swamp-150k-2048-medium.glb"
    },
    scene: {
      targetHeight: 0.94,
      defaultYaw: Math.PI * 0.08,
      defaultViewVector: [1.08, 0.5, 1.42],
      mobileViewVector: [0.82, 0.38, 1.28]
    }
  },
  "greenough-george-washington": {
    kind: "gltf",
    path: "/americas/george-washington/index.html",
    sectionId: "americas",
    sortOrder: 12,
    viewerTitle: "George Washington (1840)",
    subtitle: "Artist: Horatio Greenough (1805-1852); sitter: George Washington",
    medium: "Marble",
    dimensions: "H: 345.4 cm | W: 259.1 cm | D: 209.6 cm",
    locationLabel: "On view:",
    location: "Smithsonian National Museum of American History",
    lobbyMeta: "Source: Smithsonian 3D / SAAM",
    source: source(
      "Rendered from Smithsonian 3D's scan of Horatio Greenough's George Washington, held by the Smithsonian American Art Museum and installed at the National Museum of American History.",
      [
        link("Smithsonian 3D record", "https://3d.si.edu/object/3d/george-washington%3A789cf90a-4387-4ac1-9e96-c7d6a7b9d26f"),
        link("Voyager document", "https://3d-api.si.edu/content/document/3d_package:789cf90a-4387-4ac1-9e96-c7d6a7b9d26f/document.json"),
        link("High GLB", "https://3d-api.si.edu/content/document/3d_package:789cf90a-4387-4ac1-9e96-c7d6a7b9d26f/george-washington-greenough-statue-(1840)-150k-4096-high.glb")
      ],
      "The Smithsonian object page marks the work and its 3D package as CC0. Title, date, artist, sitter, dimensions, and installation note follow the Smithsonian American Art Museum record."
    ),
    defaults: {
      zoom: 2.14,
      lightAngle: 24,
      lightPower: 2.02,
      exposure: 0.42,
      rough: 0.24
    },
    model: {
      primaryUrl: "https://3d-api.si.edu/content/document/3d_package:789cf90a-4387-4ac1-9e96-c7d6a7b9d26f/george-washington-greenough-statue-(1840)-150k-4096-high.glb",
      fallbackUrl: "https://3d-api.si.edu/content/document/3d_package:789cf90a-4387-4ac1-9e96-c7d6a7b9d26f/george-washington-greenough-statue-(1840)-150k-2048-medium.glb"
    },
    scene: {
      targetHeight: 1.56,
      defaultYaw: -Math.PI * 0.04,
      defaultViewVector: [1.18, 0.68, 1.72],
      mobileViewVector: [0.9, 0.52, 1.54]
    }
  },
  "model-of-the-greek-slave": {
    kind: "gltf",
    path: "/americas/model-of-the-greek-slave/index.html",
    sectionId: "americas",
    sortOrder: 14,
    viewerTitle: "Model of the Greek Slave (1843)",
    subtitle: "Artist: Hiram Powers (1805-1873)",
    medium: "Plaster and metal pins",
    dimensions: "H: 168.6 cm | W: 54.6 cm | D: 46.6 cm",
    locationLabel: "On view:",
    location: "Smithsonian American Art Museum, Luce Foundation Center, 3rd Floor, 18A",
    lobbyMeta: "Source: Smithsonian 3D / SAAM",
    source: source(
      "Rendered from Smithsonian 3D's scan of Hiram Powers's Model of the Greek Slave.",
      [
        link("Smithsonian 3D record", "https://3d.si.edu/object/3d/model-greek-slave%3A8edffe56-c358-4c3a-a61f-019f615ccef0"),
        link("Voyager document", "https://3d-api.si.edu/content/document/3d_package:8edffe56-c358-4c3a-a61f-019f615ccef0/document.json"),
        link("High GLB", "https://3d-api.si.edu/content/document/3d_package:8edffe56-c358-4c3a-a61f-019f615ccef0/greek-slave-plaster-cast-150k-4096-high.glb")
      ],
      "The Smithsonian object page marks the work and its 3D package as CC0. Title, date, artist, medium, dimensions, and installation note follow the Smithsonian American Art Museum record."
    ),
    defaults: {
      zoom: 2.44,
      lightAngle: 24,
      lightPower: 2.06,
      exposure: 0.42,
      rough: 0.24
    },
    model: {
      primaryUrl: "https://3d-api.si.edu/content/document/3d_package:8edffe56-c358-4c3a-a61f-019f615ccef0/greek-slave-plaster-cast-150k-4096-high.glb",
      fallbackUrl: "https://3d-api.si.edu/content/document/3d_package:8edffe56-c358-4c3a-a61f-019f615ccef0/greek-slave-plaster-cast-150k-2048-medium.glb"
    },
    scene: {
      targetHeight: 1.7,
      defaultYaw: Math.PI * 0.06,
      defaultViewVector: [1.26, 0.74, 1.88],
      mobileViewVector: [0.96, 0.56, 1.72]
    }
  },
  "life-cast-left-forearm-and-hand": {
    kind: "gltf",
    path: "/americas/life-cast-left-forearm-and-hand/index.html",
    sectionId: "americas",
    sortOrder: 15,
    viewerTitle: "Life Cast of Left Forearm and Hand (fragment, study for \"Greek Slave\") (ca. 1843)",
    subtitle: "Artist: Studio of Hiram Powers (founded Florence, Italy, 1837-1873)",
    medium: "Plaster",
    dimensions: "H: 8.7 cm | W: 31.5 cm | D: 8.3 cm",
    locationLabel: "On view:",
    location: "Smithsonian American Art Museum, Luce Foundation Center, 3rd Floor, 17B",
    lobbyMeta: "Source: Smithsonian 3D / SAAM",
    source: smithsonianSource({
      summary: "Rendered from Smithsonian 3D's fragmentary Life Cast of Left Forearm and Hand study for Hiram Powers's Greek Slave.",
      recordUrl: "https://3d.si.edu/object/3d/life-cast-left-forearm-and-hand-fragment-study-greek-slave%3A7f2659ba-2953-47a5-9358-921da9b0ce16",
      packageId: "7f2659ba-2953-47a5-9358-921da9b0ce16",
      highFile: "life-cast-of-left-forearm-and-hand-150k-4096-high.glb",
      mediumFile: "life-cast-of-left-forearm-and-hand-150k-2048-medium.glb",
      note: "Smithsonian marks the object and package CC0. The source page identifies the fragment as a ca. 1843 plaster study connected to Greek Slave and places it on view in the Luce Foundation Center."
    }),
    model: {
      primaryUrl: smithsonianAsset("7f2659ba-2953-47a5-9358-921da9b0ce16", "life-cast-of-left-forearm-and-hand-150k-4096-high.glb"),
      fallbackUrl: smithsonianAsset("7f2659ba-2953-47a5-9358-921da9b0ce16", "life-cast-of-left-forearm-and-hand-150k-2048-medium.glb")
    },
    defaults: {
      zoom: 3.04,
      lightAngle: 24,
      lightPower: 2.02,
      exposure: 0.42,
      rough: 0.24
    },
    scene: {
      targetHeight: 0.46,
      defaultYaw: Math.PI * 0.08,
      defaultViewVector: [1.12, 0.34, 1.5],
      mobileViewVector: [0.84, 0.26, 1.34]
    }
  },
  "houdon-george-washington": {
    kind: "gltf",
    path: "/americas/george-washington-houdon/index.html",
    sectionId: "americas",
    sortOrder: 16,
    hiddenFromLobby: true,
    viewerTitle: "George Washington (c. 1786)",
    subtitle: "Artist: Jean-Antoine Houdon (1741-1828); sitter: George Washington",
    medium: "Plaster",
    dimensions: "H: 55.9 cm | W: 33.7 cm | D: 24.8 cm",
    locationLabel: "On view:",
    location: "National Portrait Gallery, South Gallery 240",
    lobbyMeta: "Source: Smithsonian 3D / NPG",
    source: source(
      "Rendered from Smithsonian 3D's scan of Jean-Antoine Houdon's George Washington bust in the National Portrait Gallery.",
      [
        link("Smithsonian 3D record", "https://3d.si.edu/object/3d/george-washington%3Aff28cb3a-ad00-43b3-a928-fa61ab0a288f"),
        link("Voyager document", "https://3d-api.si.edu/content/document/3d_package:ff28cb3a-ad00-43b3-a928-fa61ab0a288f/document.json"),
        link("High GLB", "https://3d-api.si.edu/content/document/3d_package:ff28cb3a-ad00-43b3-a928-fa61ab0a288f/npg-npg_78_1-HiRes_Unwrapped-150k-4096-high.glb")
      ],
      "The Smithsonian object page marks the work and its 3D package as CC0. Title, date, artist, sitter, medium, dimensions, and gallery location follow the National Portrait Gallery record."
    ),
    defaults: {
      zoom: 2.72,
      lightAngle: 24,
      lightPower: 2.04,
      exposure: 0.42,
      rough: 0.24
    },
    model: {
      primaryUrl: "https://3d-api.si.edu/content/document/3d_package:ff28cb3a-ad00-43b3-a928-fa61ab0a288f/npg-npg_78_1-HiRes_Unwrapped-150k-4096-high.glb",
      fallbackUrl: "https://3d-api.si.edu/content/document/3d_package:ff28cb3a-ad00-43b3-a928-fa61ab0a288f/npg-npg_78_1-HiRes_Unwrapped-150k-2048-medium.glb"
    },
    scene: {
      rotateY: -Math.PI * 0.25,
      targetHeight: 0.92,
      defaultYaw: Math.PI * 0.1,
      defaultViewVector: [1.04, 0.56, 1.18],
      mobileViewVector: [0.82, 0.42, 1.08]
    }
  },
  "helen-adams-keller": {
    kind: "gltf",
    path: "/americas/helen-adams-keller/index.html",
    sectionId: "americas",
    sortOrder: 18,
    viewerTitle: "Helen Adams Keller (1916)",
    subtitle: "Artist: Onorio Ruotolo (1888-1966); sitter: Helen Adams Keller",
    medium: "Plaster and paint",
    dimensions: "H: 27.3 cm | W: 21.9 cm | D: 18.4 cm",
    locationLabel: "Collection:",
    location: "National Portrait Gallery, Smithsonian Institution",
    lobbyMeta: "Source: Smithsonian 3D / NPG",
    source: source(
      "Rendered from Smithsonian 3D's scan of Onorio Ruotolo's Helen Adams Keller bust in the National Portrait Gallery.",
      [
        link("Smithsonian 3D record", "https://3d.si.edu/object/3d/helen-adams-keller%3Ad8c64ccc-4ebc-11ea-b77f-2e728ce88125"),
        link("Voyager document", "https://3d-api.si.edu/content/document/3d_package:d8c64ccc-4ebc-11ea-b77f-2e728ce88125/document.json"),
        link("High GLB", "https://3d-api.si.edu/content/document/3d_package:d8c64ccc-4ebc-11ea-b77f-2e728ce88125/HK_NPG_75_16_Final_Render_Model_No_Color-150k-4096-high.glb")
      ],
      "The Smithsonian object page marks the work and its 3D package as CC0. Title, date, artist, sitter, medium, and dimensions follow the National Portrait Gallery record."
    ),
    defaults: {
      zoom: 2.92,
      lightAngle: 24,
      lightPower: 2.02,
      exposure: 0.42,
      rough: 0.24
    },
    model: {
      primaryUrl: "https://3d-api.si.edu/content/document/3d_package:d8c64ccc-4ebc-11ea-b77f-2e728ce88125/HK_NPG_75_16_Final_Render_Model_No_Color-150k-4096-high.glb",
      fallbackUrl: "https://3d-api.si.edu/content/document/3d_package:d8c64ccc-4ebc-11ea-b77f-2e728ce88125/HK_NPG_75_16_Final_Render_Model_No_Color-150k-2048-medium.glb"
    },
    scene: {
      targetHeight: 0.78,
      defaultYaw: Math.PI * 0.04,
      defaultViewVector: [1.02, 0.52, 1.06],
      mobileViewVector: [0.82, 0.42, 0.98]
    }
  },
  "theodore-roosevelt-relief": {
    kind: "gltf",
    path: "/americas/theodore-roosevelt/index.html",
    sectionId: "americas",
    sortOrder: 20,
    viewerTitle: "Theodore Roosevelt (1906)",
    subtitle: "Artist: Sally James Farnham (1869-1943); sitter: Theodore Roosevelt",
    medium: "Bronze relief",
    dimensions: "H: 52.7 cm | W: 53 cm | D: 6.4 cm",
    locationLabel: "Collection:",
    location: "National Portrait Gallery, Smithsonian Institution",
    lobbyMeta: "Source: Smithsonian 3D / NPG",
    source: source(
      "Rendered from Smithsonian 3D's scan of Sally James Farnham's Theodore Roosevelt relief in the National Portrait Gallery.",
      [
        link("Smithsonian 3D record", "https://3d.si.edu/object/3d/theodore-roosevelt%3A1788235b-d2bc-4287-8fb5-f2965a069fd9"),
        link("Voyager document", "https://3d-api.si.edu/content/document/3d_package:1788235b-d2bc-4287-8fb5-f2965a069fd9/document.json"),
        link("High GLB", "https://3d-api.si.edu/content/document/3d_package:1788235b-d2bc-4287-8fb5-f2965a069fd9/theodore-roosevelt-bronze-relief-150k-4096-high.glb")
      ],
      "The Smithsonian object page marks the work and its 3D package as CC0. Title, date, artist, sitter, medium, and dimensions follow the National Portrait Gallery record."
    ),
    defaults: {
      zoom: 2.38,
      lightAngle: 24,
      lightPower: 2.04,
      exposure: 0.42,
      rough: 0.24
    },
    model: {
      primaryUrl: "https://3d-api.si.edu/content/document/3d_package:1788235b-d2bc-4287-8fb5-f2965a069fd9/theodore-roosevelt-bronze-relief-150k-4096-high.glb",
      fallbackUrl: "https://3d-api.si.edu/content/document/3d_package:1788235b-d2bc-4287-8fb5-f2965a069fd9/theodore-roosevelt-bronze-relief-150k-2048-medium.glb"
    },
    scene: {
      showPedestal: false,
      rotateX: 0.2028803676144999,
      rotateY: -0.6138221307832121,
      rotateZ: -1.3947043350835489,
      targetHeight: 0.96,
      focusYRatio: 0.5,
      defaultYaw: 0,
      defaultViewVector: [0.94, 0.24, 2.18],
      mobileViewVector: [0.72, 0.2, 1.98]
    }
  },
  "cast-of-san-lorenzo-head": {
    kind: "gltf",
    path: "/americas/cast-of-san-lorenzo-head/index.html",
    sectionId: "americas",
    sortOrder: 22,
    viewerTitle: "Cast of San Lorenzo Head No. 1 (Olmec, c. 500 BCE)",
    subtitle: "Artist: Olmec sculptor; current scan of a Smithsonian cast after a basalt original",
    medium: "Natural-size cast after a basalt original",
    dimensions: "H: 300 cm | W: 230 cm | D: 137 cm",
    locationLabel: "Place:",
    location: "Veracruz, Mexico, North America",
    lobbyMeta: "Source: Smithsonian 3D / NMNH Anthropology",
    source: source(
      "Rendered from Smithsonian 3D's scan of Cast of San Lorenzo Head No. 1, an Olmec colossal-head cast in the National Museum of Natural History's anthropology collection.",
      [
        link("Smithsonian 3D record", "https://3d.si.edu/object/3d/cast-san-lorenzo-head-no-1:aa4a35c7-0e59-4285-83d5-9e81aa423265"),
        link("Voyager document", "https://3d-api.si.edu/content/document/3d_package:aa4a35c7-0e59-4285-83d5-9e81aa423265/document.json"),
        link("High GLB", "https://3d-api.si.edu/content/document/3d_package:aa4a35c7-0e59-4285-83d5-9e81aa423265/olmec_head-master-tris-150k-4096-high.glb")
      ],
      "The Smithsonian anthropology record identifies the object as a natural-size cast of an Olmec colossal stone head from Veracruz, Mexico, and notes that the original is basalt."
    ),
    defaults: {
      zoom: 2.34,
      lightAngle: 24,
      lightPower: 2.02,
      exposure: 0.42,
      rough: 0.24
    },
    model: {
      primaryUrl: "https://3d-api.si.edu/content/document/3d_package:aa4a35c7-0e59-4285-83d5-9e81aa423265/olmec_head-master-tris-150k-4096-high.glb",
      fallbackUrl: "https://3d-api.si.edu/content/document/3d_package:aa4a35c7-0e59-4285-83d5-9e81aa423265/olmec_head-master-tris-150k-2048-medium.glb"
    },
    scene: {
      targetHeight: 1.28,
      defaultYaw: Math.PI * 0.05,
      defaultViewVector: [1.08, 0.58, 1.46],
      mobileViewVector: [0.84, 0.42, 1.32]
    }
  },
  "virgen-de-monserrate": {
    kind: "gltf",
    path: "/americas/virgen-de-monserrate/index.html",
    sectionId: "americas",
    sortOrder: 24,
    viewerTitle: "Virgen de Monserrate (late 18th or early 19th century)",
    subtitle: "Artist: Unknown Puerto Rican santo maker",
    medium: "Wood and paint",
    dimensions: "H: 33 cm | W: 22.5 cm | D: 24.5 cm",
    locationLabel: "Place made:",
    location: "Jayuya, Puerto Rico",
    lobbyMeta: "Source: Smithsonian 3D / NMAH",
    source: source(
      "Rendered from Smithsonian 3D's scan of Virgen de Monserrate, a carved santo associated with the Miracle of Hormigueros.",
      [
        link("Smithsonian 3D record", "https://3d.si.edu/object/3d/virgen-de-monserrate:1492fab4-3f36-46da-9a7b-2ed02537b996"),
        link("Voyager document", "https://3d-api.si.edu/content/document/3d_package:1492fab4-3f36-46da-9a7b-2ed02537b996/document.json"),
        link("High GLB", "https://3d-api.si.edu/content/document/3d_package:1492fab4-3f36-46da-9a7b-2ed02537b996/nmah-1997_0097_0721-virgen_de_monserrate-150k-4096-high.glb")
      ],
      "The Smithsonian page marks the record CC0 and dates the figure to the late eighteenth or early nineteenth century. Place made, medium, and measurements follow the National Museum of American History record."
    ),
    defaults: {
      zoom: 2.76,
      lightAngle: 24,
      lightPower: 2.02,
      exposure: 0.42,
      rough: 0.24
    },
    model: {
      primaryUrl: "https://3d-api.si.edu/content/document/3d_package:1492fab4-3f36-46da-9a7b-2ed02537b996/nmah-1997_0097_0721-virgen_de_monserrate-150k-4096-high.glb",
      fallbackUrl: "https://3d-api.si.edu/content/document/3d_package:1492fab4-3f36-46da-9a7b-2ed02537b996/nmah-1997_0097_0721-virgen_de_monserrate-150k-2048-medium.glb"
    },
    scene: {
      rotateX: 0,
      targetHeight: 1.02,
      defaultYaw: Math.PI * 0.08,
      defaultViewVector: [1.02, 0.58, 1.16],
      mobileViewVector: [0.8, 0.44, 1.04]
    }
  },
  "pisac-intihuatana": {
    kind: "gltf",
    path: "/americas/pisac-intihuatana/index.html",
    sectionId: "americas",
    sortOrder: 26,
    viewerTitle: "Pisac Intihuatana (Inka, 15th century)",
    subtitle: "Artist: Inka stonemasons",
    medium: "Stone",
    locationLabel: "Place:",
    location: "Pisac, Cusco Region, Peru",
    lobbyMeta: "Source: Smithsonian 3D / NMAI",
    source: source(
      "Rendered from Smithsonian 3D's scan of the Intihuatana sector at Pisac, a sacred Inka stone complex in the Sacred Valley.",
      [
        link("Smithsonian 3D record", "https://3d.si.edu/object/3d/pisac-intihuatana:46fd85b8-3d84-4cf3-b5d8-9673ac778bb9"),
        link("Voyager document", "https://3d-api.si.edu/content/document/3d_package:46fd85b8-3d84-4cf3-b5d8-9673ac778bb9/document.json"),
        link("High GLB", "https://3d-api.si.edu/content/document/3d_package:46fd85b8-3d84-4cf3-b5d8-9673ac778bb9/pisac-intihuatana-150k-4096-high.glb")
      ],
      "The National Museum of the American Indian source page describes Intihuatana as a district at Pisac dedicated to the cult of the sun. The source page does not publish object dimensions, so Form Gallery omits them here rather than inferring scale from the site scan."
    ),
    defaults: {
      zoom: 2.26,
      lightAngle: 22,
      lightPower: 2.0,
      exposure: 0.42,
      rough: 0.26
    },
    model: {
      primaryUrl: "https://3d-api.si.edu/content/document/3d_package:46fd85b8-3d84-4cf3-b5d8-9673ac778bb9/pisac-intihuatana-150k-4096-high.glb",
      fallbackUrl: "https://3d-api.si.edu/content/document/3d_package:46fd85b8-3d84-4cf3-b5d8-9673ac778bb9/pisac-intihuatana-150k-2048-medium.glb"
    },
    scene: {
      showPedestal: false,
      rotateX: -Math.PI * 0.5,
      targetHeight: 1.18,
      focusYRatio: 0.46,
      defaultYaw: Math.PI * 0.04,
      defaultViewVector: [1.08, 0.3, 2.08],
      mobileViewVector: [0.82, 0.22, 1.84]
    }
  },
  "hatunrumiyoc": {
    kind: "gltf",
    path: "/americas/hatunrumiyoc/index.html",
    sectionId: "americas",
    sortOrder: 28,
    viewerTitle: "Hatunrumiyoc (Inka wall, 15th century)",
    subtitle: "Artist: Inka stonemasons",
    medium: "Stone",
    locationLabel: "Place:",
    location: "Cusco, Peru",
    lobbyMeta: "Source: Smithsonian 3D / NMAI",
    source: source(
      "Rendered from Smithsonian 3D's scan of Hatunrumiyoc, the Cusco wall segment known for its famous twelve-angled stone.",
      [
        link("Smithsonian 3D record", "https://3d.si.edu/object/3d/hatunrumiyoc:c49dbdb8-d4c8-49d7-be17-820c87edeb68"),
        link("Voyager document", "https://3d-api.si.edu/content/document/3d_package:c49dbdb8-d4c8-49d7-be17-820c87edeb68/document.json"),
        link("High GLB", "https://3d-api.si.edu/content/document/3d_package:c49dbdb8-d4c8-49d7-be17-820c87edeb68/hatunrumiyoc-150k-4096-high.glb")
      ],
      "The National Museum of the American Indian source page identifies Hatunrumiyoc as part of the palace of Inka Roca in Cusco. The source page does not publish object dimensions, so Form Gallery omits them here rather than inferring scale from the site scan."
    ),
    defaults: {
      zoom: 2.24,
      lightAngle: 22,
      lightPower: 2.0,
      exposure: 0.42,
      rough: 0.26
    },
    model: {
      primaryUrl: "https://3d-api.si.edu/content/document/3d_package:c49dbdb8-d4c8-49d7-be17-820c87edeb68/hatunrumiyoc-150k-4096-high.glb",
      fallbackUrl: "https://3d-api.si.edu/content/document/3d_package:c49dbdb8-d4c8-49d7-be17-820c87edeb68/hatunrumiyoc-150k-2048-medium.glb"
    },
    scene: {
      showPedestal: false,
      targetHeight: 1.12,
      focusYRatio: 0.46,
      defaultYaw: -Math.PI * 0.05,
      defaultViewVector: [1.08, 0.3, 2.02],
      mobileViewVector: [0.82, 0.22, 1.78]
    }
  },
  "girl-skating": {
    kind: "gltf",
    path: "/americas/girl-skating/index.html",
    sectionId: "americas",
    sortOrder: 30,
    viewerTitle: "Girl Skating (modeled 1906)",
    subtitle: "Artist: Abastenia St. Leger Eberle (1878-1942)",
    medium: "Bronze",
    dimensions: "H: 32.8 cm | W: 29.2 cm | D: 17.2 cm",
    lobbyMeta: "Source: Smithsonian 3D / SAAM",
    source: smithsonianSource({
      summary: "Rendered from Smithsonian 3D's Girl Skating model from the Smithsonian American Art Museum.",
      recordUrl: "https://3d.si.edu/object/3d/girl-skating%3Ae8d1f790-28a8-492d-84f5-cf2817f8cdcf",
      packageId: "e8d1f790-28a8-492d-84f5-cf2817f8cdcf",
      highFile: "saam_2011_29-girl_skating-polish-150k-4096-high.glb",
      mediumFile: "saam_2011_29-girl_skating-polish-150k-2048-medium.glb",
      note: "Smithsonian marks the object and package CC0."
    }),
    model: {
      primaryUrl: smithsonianAsset("e8d1f790-28a8-492d-84f5-cf2817f8cdcf", "saam_2011_29-girl_skating-polish-150k-4096-high.glb"),
      fallbackUrl: smithsonianAsset("e8d1f790-28a8-492d-84f5-cf2817f8cdcf", "saam_2011_29-girl_skating-polish-150k-2048-medium.glb")
    },
    defaults: {
      zoom: 2.82,
      lightAngle: 24,
      lightPower: 2.04,
      exposure: 0.42,
      rough: 0.24
    },
    scene: {
      targetHeight: 0.92,
      defaultYaw: -Math.PI * 0.08,
      defaultViewVector: [0.98, 0.5, 1.12],
      mobileViewVector: [0.78, 0.38, 1.0]
    }
  },
  gamin: {
    kind: "gltf",
    path: "/americas/gamin/index.html",
    sectionId: "americas",
    sortOrder: 32,
    viewerTitle: "Gamin (c. 1929)",
    subtitle: "Artist: Augusta Savage (1892-1962)",
    medium: "Painted plaster",
    dimensions: "H: 22.9 cm | W: 14.7 cm | D: 11.2 cm",
    lobbyMeta: "Source: Smithsonian 3D / SAAM",
    source: smithsonianSource({
      summary: "Rendered from Smithsonian 3D's Gamin model by Augusta Savage.",
      recordUrl: "https://3d.si.edu/object/3d/gamin%3A51c3ae66-8411-4145-b9ab-9096918289f6",
      packageId: "51c3ae66-8411-4145-b9ab-9096918289f6",
      highFile: "Gamin-150k-4096-high.glb",
      mediumFile: "Gamin-150k-2048-medium.glb",
      note: "Smithsonian lists metadata usage as not determined."
    }),
    model: {
      primaryUrl: smithsonianAsset("51c3ae66-8411-4145-b9ab-9096918289f6", "Gamin-150k-4096-high.glb"),
      fallbackUrl: smithsonianAsset("51c3ae66-8411-4145-b9ab-9096918289f6", "Gamin-150k-2048-medium.glb")
    },
    defaults: {
      zoom: 2.94,
      lightAngle: 24,
      lightPower: 2.02,
      exposure: 0.42,
      rough: 0.24
    },
    scene: {
      targetHeight: 0.78,
      defaultYaw: Math.PI * 0.08,
      defaultViewVector: [0.92, 0.48, 1.02],
      mobileViewVector: [0.74, 0.36, 0.92]
    }
  },
  "pioneer-woman": {
    kind: "gltf",
    path: "/americas/pioneer-woman/index.html",
    sectionId: "americas",
    sortOrder: 34,
    viewerTitle: "Pioneer Woman (modeled 1927, cast 1968)",
    subtitle: "Artist: Bryant Baker (1881-1970)",
    medium: "Bronze",
    dimensions: "H: 81.3 cm | W: 38.1 cm | D: 41.1 cm",
    lobbyMeta: "Source: Smithsonian 3D",
    source: smithsonianSource({
      summary: "Rendered from Smithsonian 3D's Pioneer Woman model by Bryant Baker.",
      recordUrl: "https://3d.si.edu/object/3d/pioneer-woman%3A57fe1873-98a1-4853-87bc-203ff92deef6",
      packageId: "57fe1873-98a1-4853-87bc-203ff92deef6",
      highFile: "Pioneer_Woman-150k-4096-high.glb",
      mediumFile: "Pioneer_Woman-150k-2048-medium.glb",
      note: "Smithsonian lists metadata usage as not determined."
    }),
    model: {
      primaryUrl: smithsonianAsset("57fe1873-98a1-4853-87bc-203ff92deef6", "Pioneer_Woman-150k-4096-high.glb"),
      fallbackUrl: smithsonianAsset("57fe1873-98a1-4853-87bc-203ff92deef6", "Pioneer_Woman-150k-2048-medium.glb")
    },
    defaults: {
      zoom: 2.72,
      lightAngle: 24,
      lightPower: 2.04,
      exposure: 0.42,
      rough: 0.24
    },
    scene: {
      targetHeight: 1.08,
      defaultYaw: -Math.PI * 0.06,
      defaultViewVector: [1.0, 0.56, 1.18],
      mobileViewVector: [0.8, 0.42, 1.06]
    }
  },
  "rutherford-b-hayes": {
    kind: "gltf",
    path: "/americas/rutherford-b-hayes/index.html",
    sectionId: "americas",
    sortOrder: 36,
    viewerTitle: "Rutherford B. Hayes (1876)",
    subtitle: "Artist: Olin Levi Warner (1844-1896); sitter: Rutherford B. Hayes",
    medium: "Plaster",
    dimensions: "H: 27.3 cm | W: 24.8 cm | D: 12.7 cm",
    locationLabel: "Collection:",
    location: "National Portrait Gallery, Smithsonian Institution",
    lobbyMeta: "Source: Smithsonian 3D / NPG",
    source: smithsonianSource({
      summary: "Rendered from Smithsonian 3D's Rutherford B. Hayes bust in the National Portrait Gallery.",
      recordUrl: "https://3d.si.edu/object/3d/rutherford-b-hayes%3A1f3700e8-6d01-4488-8ab9-ea14031ef641",
      packageId: "1f3700e8-6d01-4488-8ab9-ea14031ef641",
      highFile: "rutherford-b-150k-4096-high.glb",
      mediumFile: "rutherford-b-150k-2048-medium.glb",
      note: "Smithsonian marks the object and package CC0."
    }),
    model: {
      primaryUrl: smithsonianAsset("1f3700e8-6d01-4488-8ab9-ea14031ef641", "rutherford-b-150k-4096-high.glb"),
      fallbackUrl: smithsonianAsset("1f3700e8-6d01-4488-8ab9-ea14031ef641", "rutherford-b-150k-2048-medium.glb")
    },
    defaults: {
      zoom: 2.96,
      lightAngle: 24,
      lightPower: 2.02,
      exposure: 0.42,
      rough: 0.24
    },
    scene: {
      rotateZ: Math.PI * 0.5,
      targetHeight: 0.72,
      defaultYaw: Math.PI * 0.08,
      defaultViewVector: [0.92, 0.46, 1.0],
      mobileViewVector: [0.74, 0.34, 0.9]
    }
  },
  "eugene-jacques-bullard": {
    kind: "gltf",
    path: "/americas/eugene-jacques-bullard/index.html",
    sectionId: "americas",
    sortOrder: 37,
    viewerTitle: "Eugene Jacques Bullard (1990)",
    subtitle: "Artist: Eddie Dixon",
    dimensions: "H: 54.6 cm | W: 19 cm | D: 24.8 cm",
    locationLabel: "Location:",
    location: "National Air and Space Museum in Washington, DC",
    lobbyMeta: "Source: Smithsonian 3D / NASM",
    source: smithsonianSource({
      summary: "Rendered from Smithsonian 3D's Eugene Jacques Bullard portrait bust in the National Air and Space Museum.",
      recordUrl: "https://3d.si.edu/object/3d/eugene-jacques-bullard%3A385124dc-6ca4-4ab3-a314-a46f1c57ea5d",
      packageId: "385124dc-6ca4-4ab3-a314-a46f1c57ea5d",
      highFile: "nasm-A19920064000-bullard_bust-master_model-20221130-150k-4096-high.glb",
      mediumFile: "nasm-A19920064000-bullard_bust-master_model-20221130-150k-2048-medium.glb",
      note: "Smithsonian lists the object location as the National Air and Space Museum in Washington, DC."
    }),
    model: {
      primaryUrl: smithsonianAsset("385124dc-6ca4-4ab3-a314-a46f1c57ea5d", "nasm-A19920064000-bullard_bust-master_model-20221130-150k-4096-high.glb"),
      fallbackUrl: smithsonianAsset("385124dc-6ca4-4ab3-a314-a46f1c57ea5d", "nasm-A19920064000-bullard_bust-master_model-20221130-150k-2048-medium.glb")
    },
    defaults: {
      zoom: 2.96,
      lightAngle: 24,
      lightPower: 2.02,
      exposure: 0.42,
      rough: 0.24
    },
    scene: {
      targetHeight: 0.82,
      defaultYaw: Math.PI * 0.06,
      defaultViewVector: [0.94, 0.48, 1.04],
      mobileViewVector: [0.76, 0.34, 0.92]
    }
  },
  "anne-sullivan-macy": {
    kind: "gltf",
    path: "/americas/anne-sullivan-macy/index.html",
    sectionId: "americas",
    sortOrder: 38,
    viewerTitle: "Anne Sullivan Macy (1916)",
    subtitle: "Artist: Onorio Ruotolo (1888-1966); sitter: Anne Sullivan Macy",
    medium: "Plaster and paint",
    dimensions: "H: 27.3 cm | W: 21.9 cm | D: 21.3 cm",
    locationLabel: "Collection:",
    location: "National Portrait Gallery, Smithsonian Institution",
    lobbyMeta: "Source: Smithsonian 3D / NPG",
    source: smithsonianSource({
      summary: "Rendered from Smithsonian 3D's Anne Sullivan Macy portrait bust in the National Portrait Gallery.",
      recordUrl: "https://3d.si.edu/object/3d/anne-sullivan-macy%3Ad8c63804-4ebc-11ea-b77f-2e728ce88125",
      packageId: "d8c63804-4ebc-11ea-b77f-2e728ce88125",
      highFile: "npg_75_15_as_render_model_no_color-150k-4096-high.glb",
      mediumFile: "npg_75_15_as_render_model_no_color-150k-2048-medium.glb",
      note: "Smithsonian lists metadata usage as not determined."
    }),
    model: {
      primaryUrl: smithsonianAsset("d8c63804-4ebc-11ea-b77f-2e728ce88125", "npg_75_15_as_render_model_no_color-150k-4096-high.glb"),
      fallbackUrl: smithsonianAsset("d8c63804-4ebc-11ea-b77f-2e728ce88125", "npg_75_15_as_render_model_no_color-150k-2048-medium.glb")
    },
    defaults: {
      zoom: 2.94,
      lightAngle: 24,
      lightPower: 2.02,
      exposure: 0.42,
      rough: 0.24
    },
    scene: {
      targetHeight: 0.78,
      defaultYaw: Math.PI * 0.06,
      defaultViewVector: [0.92, 0.46, 1.0],
      mobileViewVector: [0.74, 0.34, 0.9]
    }
  },
  "mary-mcleod-bethune": {
    kind: "gltf",
    path: "/americas/mary-mcleod-bethune/index.html",
    sectionId: "americas",
    sortOrder: 40,
    viewerTitle: "Statue of Mary McLeod Bethune (2020)",
    subtitle: "Artist: Nilda Maria Comas (born 1953); sitter: Mary McLeod Bethune",
    medium: "Plaster with acrylic paint and metal",
    dimensions: "H: 243.8 cm | W: 102.9 cm | D: 92.7 cm",
    lobbyMeta: "Source: Smithsonian 3D / NMAAHC",
    source: smithsonianSource({
      summary: "Rendered from Smithsonian 3D's maquette-scale model for Nilda Maria Comas's statue of Mary McLeod Bethune.",
      recordUrl: "https://3d.si.edu/object/3d/statue-mary-mcleod-bethune%3A500d2c6f-cc9f-4d46-ab45-e735406ca784",
      packageId: "500d2c6f-cc9f-4d46-ab45-e735406ca784",
      highFile: "nmaahc-sc_0092-150k-4096-high.glb",
      mediumFile: "nmaahc-sc_0092-150k-2048-medium.glb",
      note: "Smithsonian marks the object and package CC0."
    }),
    model: {
      primaryUrl: smithsonianAsset("500d2c6f-cc9f-4d46-ab45-e735406ca784", "nmaahc-sc_0092-150k-4096-high.glb"),
      fallbackUrl: smithsonianAsset("500d2c6f-cc9f-4d46-ab45-e735406ca784", "nmaahc-sc_0092-150k-2048-medium.glb")
    },
    defaults: {
      zoom: 2.3,
      lightAngle: 24,
      lightPower: 2.04,
      exposure: 0.42,
      rough: 0.24
    },
    scene: {
      rotateZ: Math.PI * 0.5,
      targetHeight: 1.86,
      defaultYaw: Math.PI * 0.04,
      defaultViewVector: [1.16, 0.74, 1.62],
      mobileViewVector: [0.9, 0.56, 1.42]
    }
  },
  "untitled-woman-and-child": {
    kind: "gltf",
    path: "/americas/untitled-woman-and-child/index.html",
    sectionId: "americas",
    sortOrder: 42,
    viewerTitle: "Untitled (Woman and Child) (c. 1950)",
    subtitle: "Artist: Selma Burke (1900-1995)",
    medium: "Painted red oak",
    dimensions: "H: 119.6 cm | W: 32.3 cm | D: 29.8 cm",
    lobbyMeta: "Source: Smithsonian 3D",
    source: smithsonianSource({
      summary: "Rendered from Smithsonian 3D's Untitled (Woman and Child) model by Selma Burke.",
      recordUrl: "https://3d.si.edu/object/3d/untitled-woman-and-child%3Ad8768395-1664-4695-aba8-8b4b80580722",
      packageId: "d8768395-1664-4695-aba8-8b4b80580722",
      highFile: "Untitled_-Woman_and_Child-150k-4096-high.glb",
      mediumFile: "Untitled_-Woman_and_Child-150k-2048-medium.glb",
      note: "Smithsonian lists metadata usage as not determined."
    }),
    model: {
      primaryUrl: smithsonianAsset("d8768395-1664-4695-aba8-8b4b80580722", "Untitled_-Woman_and_Child-150k-4096-high.glb"),
      fallbackUrl: smithsonianAsset("d8768395-1664-4695-aba8-8b4b80580722", "Untitled_-Woman_and_Child-150k-2048-medium.glb")
    },
    defaults: {
      zoom: 2.46,
      lightAngle: 24,
      lightPower: 2.04,
      exposure: 0.42,
      rough: 0.24
    },
    scene: {
      targetHeight: 1.62,
      defaultYaw: Math.PI * 0.06,
      defaultViewVector: [1.12, 0.68, 1.54],
      mobileViewVector: [0.88, 0.5, 1.38]
    }
  },
  "tree-of-life": {
    kind: "gltf",
    path: "/americas/tree-of-life/index.html",
    sectionId: "americas",
    sortOrder: 43,
    viewerTitle: "Tree of Life",
    subtitle: "Smithsonian Latino Center record",
    lobbyMeta: "Source: Smithsonian 3D / Smithsonian Latino Center",
    source: smithsonianSource({
      summary: "Rendered from Smithsonian 3D's Tree of Life model in the Smithsonian Latino Center collection set.",
      recordUrl: "https://3d.si.edu/object/3d/tree-life%3Ae2e5f282-51e9-459e-9810-c341c21f06ca",
      packageId: "e2e5f282-51e9-459e-9810-c341c21f06ca",
      highFile: "tree_of_life-150k-4096-high.glb",
      mediumFile: "tree_of_life-150k-2048-medium.glb",
      note: "The public 3D record exposes title and data-source information but limited object metadata; Form Gallery leaves unsupported fields blank rather than inferring them."
    }),
    model: {
      primaryUrl: smithsonianAsset("e2e5f282-51e9-459e-9810-c341c21f06ca", "tree_of_life-150k-4096-high.glb"),
      fallbackUrl: smithsonianAsset("e2e5f282-51e9-459e-9810-c341c21f06ca", "tree_of_life-150k-2048-medium.glb")
    },
    defaults: {
      zoom: 2.52,
      lightAngle: 24,
      lightPower: 2.04,
      exposure: 0.42,
      rough: 0.24
    },
    scene: {
      targetHeight: 1.36,
      defaultYaw: Math.PI * 0.08,
      defaultViewVector: [1.06, 0.58, 1.38],
      mobileViewVector: [0.84, 0.44, 1.22]
    }
  },
  "mask-sargent-johnson": {
    kind: "gltf",
    path: "/americas/mask-sargent-johnson/index.html",
    sectionId: "americas",
    sortOrder: 44,
    viewerTitle: "Mask (1935)",
    subtitle: "Artist: Sargent Johnson (1887-1967)",
    medium: "Copper with gilding on walnut base",
    dimensions: "H: 40 cm | W: 34 cm | D: 15.6 cm",
    lobbyMeta: "Source: Smithsonian 3D",
    source: smithsonianSource({
      summary: "Rendered from Smithsonian 3D's Mask model by Sargent Johnson.",
      recordUrl: "https://3d.si.edu/object/3d/mask%3Ae8365c4b-de4a-4581-a927-3e2bbef5bfb2",
      packageId: "e8365c4b-de4a-4581-a927-3e2bbef5bfb2",
      highFile: "Mask-150k-4096-high.glb",
      mediumFile: "Mask-150k-2048-medium.glb",
      note: "Smithsonian lists metadata usage as not determined."
    }),
    model: {
      primaryUrl: smithsonianAsset("e8365c4b-de4a-4581-a927-3e2bbef5bfb2", "Mask-150k-4096-high.glb"),
      fallbackUrl: smithsonianAsset("e8365c4b-de4a-4581-a927-3e2bbef5bfb2", "Mask-150k-2048-medium.glb")
    },
    defaults: {
      zoom: 2.88,
      lightAngle: 24,
      lightPower: 2.02,
      exposure: 0.42,
      rough: 0.24
    },
    scene: {
      targetHeight: 0.84,
      defaultYaw: Math.PI * 0.08,
      defaultViewVector: [0.92, 0.46, 1.0],
      mobileViewVector: [0.74, 0.34, 0.9]
    }
  },
  "james-garfield": {
    kind: "gltf",
    path: "/americas/james-garfield/index.html",
    sectionId: "americas",
    sortOrder: 46,
    viewerTitle: "James Garfield (c. 1883-1887)",
    subtitle: "Attribution: John Quincy Adams Ward (1830-1910); sitter: James Garfield",
    medium: "Bronze on an integral bronze base",
    dimensions: "H: 47.6 cm | W: 14.6 cm | D: 14 cm",
    locationLabel: "Collection:",
    location: "National Portrait Gallery, Smithsonian Institution",
    lobbyMeta: "Source: Smithsonian 3D / NPG",
    source: smithsonianSource({
      summary: "Rendered from Smithsonian 3D's James Garfield portrait in the National Portrait Gallery.",
      recordUrl: "https://3d.si.edu/object/3d/james-garfield%3Ad2887438-0f09-4e72-887d-0966ff177149",
      packageId: "d2887438-0f09-4e72-887d-0966ff177149",
      highFile: "james-garfield-bronze-sculpture-150k-4096-high.glb",
      mediumFile: "james-garfield-bronze-sculpture-150k-2048-medium.glb",
      note: "Smithsonian marks the object and package CC0."
    }),
    model: {
      primaryUrl: smithsonianAsset("d2887438-0f09-4e72-887d-0966ff177149", "james-garfield-bronze-sculpture-150k-4096-high.glb"),
      fallbackUrl: smithsonianAsset("d2887438-0f09-4e72-887d-0966ff177149", "james-garfield-bronze-sculpture-150k-2048-medium.glb")
    },
    defaults: {
      zoom: 2.94,
      lightAngle: 24,
      lightPower: 2.02,
      exposure: 0.42,
      rough: 0.24
    },
    scene: {
      rotateZ: Math.PI * 0.42,
      targetHeight: 0.86,
      defaultYaw: Math.PI * 0.06,
      defaultViewVector: [0.92, 0.46, 1.02],
      mobileViewVector: [0.74, 0.34, 0.92]
    }
  },
  "franklin-d-roosevelt": {
    kind: "gltf",
    path: "/americas/franklin-d-roosevelt/index.html",
    sectionId: "americas",
    sortOrder: 50,
    viewerTitle: "Franklin D. Roosevelt",
    subtitle: "Artist: Reuben Nakian (1897-1986); sitter: Franklin D. Roosevelt",
    medium: "Bronze with integral base",
    dimensions: "H: 64.8 cm | W: 30.5 cm | D: 33 cm",
    locationLabel: "Collection:",
    location: "National Portrait Gallery, Smithsonian Institution",
    lobbyMeta: "Source: Smithsonian 3D / NPG",
    source: smithsonianSource({
      summary: "Rendered from Smithsonian 3D's Franklin D. Roosevelt portrait in the National Portrait Gallery.",
      recordUrl: "https://3d.si.edu/object/3d/franklin-d-roosevelt%3A3a124974-015b-4d9f-813d-3fc563bf60d4",
      packageId: "3a124974-015b-4d9f-813d-3fc563bf60d4",
      highFile: "franklin-d-150k-4096-high.glb",
      mediumFile: "franklin-d-150k-2048-medium.glb",
      note: "Smithsonian lists usage conditions apply."
    }),
    model: {
      primaryUrl: smithsonianAsset("3a124974-015b-4d9f-813d-3fc563bf60d4", "franklin-d-150k-4096-high.glb"),
      fallbackUrl: smithsonianAsset("3a124974-015b-4d9f-813d-3fc563bf60d4", "franklin-d-150k-2048-medium.glb")
    },
    defaults: {
      zoom: 2.86,
      lightAngle: 24,
      lightPower: 2.02,
      exposure: 0.42,
      rough: 0.24
    },
    scene: {
      rotateX: Math.PI * 0.08,
      rotateZ: Math.PI * 0.46,
      targetHeight: 0.98,
      defaultYaw: Math.PI * 0.04,
      defaultViewVector: [0.98, 0.5, 1.1],
      mobileViewVector: [0.78, 0.38, 1.0]
    }
  },
  "jimmy-carter": {
    kind: "gltf",
    path: "/americas/jimmy-carter/index.html",
    sectionId: "americas",
    sortOrder: 52,
    viewerTitle: "Jimmy Carter (1980)",
    subtitle: "Artists: Joan Hall (born 1939) and Neil Estern (born 1926); sitter: Jimmy Carter",
    medium: "Plaster, mixed media, and pine shadow box",
    dimensions: "H: 50.8 cm | W: 38.1 cm | D: 24.1 cm",
    locationLabel: "Collection:",
    location: "National Portrait Gallery, Smithsonian Institution",
    lobbyMeta: "Source: Smithsonian 3D / NPG",
    source: smithsonianSource({
      summary: "Rendered from Smithsonian 3D's Jimmy Carter portrait object in the National Portrait Gallery.",
      recordUrl: "https://3d.si.edu/object/3d/jimmy-carter%3A8e441f83-1e4b-4d14-8ad4-0ae7c1c83d77",
      packageId: "8e441f83-1e4b-4d14-8ad4-0ae7c1c83d77",
      highFile: "jimmy-carter-mixed-media-shadow-box-150k-4096-high.glb",
      mediumFile: "jimmy-carter-mixed-media-shadow-box-150k-2048-medium.glb",
      note: "Smithsonian lists usage conditions apply."
    }),
    model: {
      primaryUrl: smithsonianAsset("8e441f83-1e4b-4d14-8ad4-0ae7c1c83d77", "jimmy-carter-mixed-media-shadow-box-150k-4096-high.glb"),
      fallbackUrl: smithsonianAsset("8e441f83-1e4b-4d14-8ad4-0ae7c1c83d77", "jimmy-carter-mixed-media-shadow-box-150k-2048-medium.glb")
    },
    defaults: {
      zoom: 2.68,
      lightAngle: 24,
      lightPower: 2.02,
      exposure: 0.42,
      rough: 0.24
    },
    scene: {
      rotateZ: Math.PI * 0.5,
      targetHeight: 1.02,
      defaultYaw: -Math.PI * 0.05,
      defaultViewVector: [0.98, 0.5, 1.12],
      mobileViewVector: [0.78, 0.38, 1.0]
    }
  },
  "abraham-lincoln-life-mask": {
    kind: "gltf",
    path: "/americas/abraham-lincoln-life-mask/index.html",
    sectionId: "americas",
    sortOrder: 54,
    viewerTitle: "Abraham Lincoln Life Mask (1860; cast 1917)",
    subtitle: "Cast after Leonard Wells Volk (1828-1895); sitter: Abraham Lincoln",
    medium: "Plaster",
    dimensions: "H: 14.6 cm | W: 21.6 cm | D: 23.5 cm",
    locationLabel: "Collection:",
    location: "National Portrait Gallery, Smithsonian Institution",
    lobbyMeta: "Source: Smithsonian 3D / NPG",
    source: smithsonianSource({
      summary: "Rendered from Smithsonian 3D's Abraham Lincoln life mask cast after Leonard Wells Volk.",
      recordUrl: "https://3d.si.edu/object/3d/abraham-lincoln%3A2b4a081a-9ea1-4b0c-b1c3-6f5389da3244",
      packageId: "2b4a081a-9ea1-4b0c-b1c3-6f5389da3244",
      highFile: "p0-Part-100k-4096.glb",
      mediumFile: "p0-Part-100k-2048.glb",
      note: "Smithsonian marks the object and package CC0."
    }),
    model: {
      primaryUrl: smithsonianAsset("2b4a081a-9ea1-4b0c-b1c3-6f5389da3244", "p0-Part-100k-4096.glb"),
      fallbackUrl: smithsonianAsset("2b4a081a-9ea1-4b0c-b1c3-6f5389da3244", "p0-Part-100k-2048.glb")
    },
    defaults: {
      zoom: 3.04,
      lightAngle: 24,
      lightPower: 2.02,
      exposure: 0.42,
      rough: 0.24
    },
    scene: {
      targetHeight: 0.68,
      defaultYaw: Math.PI * 0.05,
      defaultViewVector: [0.88, 0.42, 0.96],
      mobileViewVector: [0.7, 0.32, 0.86]
    }
  },
  "abraham-lincoln-hands": {
    kind: "gltf",
    path: "/americas/abraham-lincoln-hands/index.html",
    sectionId: "americas",
    sortOrder: 56,
    viewerTitle: "Abraham Lincoln Hands (1860; cast c. 1917)",
    subtitle: "Cast after Leonard Wells Volk (1828-1895); sitter: Abraham Lincoln",
    medium: "Plaster",
    dimensions: "Proper left: 7.6 cm x 11.1 cm x 17.8 cm | Proper right: 8.9 cm x 12.7 cm x 15.2 cm",
    locationLabel: "Collection:",
    location: "National Portrait Gallery, Smithsonian Institution",
    lobbyMeta: "Source: Smithsonian 3D / NPG",
    source: smithsonianSource({
      summary: "Rendered from Smithsonian 3D's cast of Abraham Lincoln's hands after Leonard Wells Volk.",
      recordUrl: "https://3d.si.edu/object/3d/abraham-lincoln%3Ad8c642d6-4ebc-11ea-b77f-2e728ce88125",
      packageId: "d8c642d6-4ebc-11ea-b77f-2e728ce88125",
      mediumFile: "npg_71_6_combined-hires_unwrapped-100k-2048_std_draco.glb",
      note: "The combined Smithsonian GLB is Draco-compressed; Smithsonian marks the object and package CC0."
    }),
    model: {
      primaryUrl: smithsonianAsset("d8c642d6-4ebc-11ea-b77f-2e728ce88125", "npg_71_6_combined-hires_unwrapped-100k-2048_std_draco.glb"),
      fallbackUrl: smithsonianAsset("d8c642d6-4ebc-11ea-b77f-2e728ce88125", "npg_71_6_combined-hires_unwrapped-100k-2048_std_draco.glb")
    },
    defaults: {
      zoom: 3.08,
      lightAngle: 24,
      lightPower: 2.02,
      exposure: 0.42,
      rough: 0.24
    },
    scene: {
      targetHeight: 0.64,
      defaultYaw: Math.PI * 0.08,
      defaultViewVector: [0.88, 0.38, 0.98],
      mobileViewVector: [0.7, 0.3, 0.88]
    }
  },
  "abraham-lincoln-face-cast": {
    kind: "gltf",
    path: "/americas/abraham-lincoln-face-cast/index.html",
    sectionId: "americas",
    sortOrder: 58,
    viewerTitle: "Abraham Lincoln Face Cast (1865; cast c. 1917)",
    subtitle: "Cast after Clark Mills (1810-1883); sitter: Abraham Lincoln",
    medium: "Plaster",
    dimensions: "H: 17.1 cm | W: 20.3 cm | D: 29.8 cm",
    locationLabel: "Collection:",
    location: "National Portrait Gallery, Smithsonian Institution",
    lobbyMeta: "Source: Smithsonian 3D / NPG",
    source: smithsonianSource({
      summary: "Rendered from Smithsonian 3D's cast of Abraham Lincoln's face after Clark Mills.",
      recordUrl: "https://3d.si.edu/object/3d/abraham-lincoln%3Ac02c239d-5ebf-4a7a-a368-e2288bbf4b31",
      packageId: "c02c239d-5ebf-4a7a-a368-e2288bbf4b31",
      highFile: "abraham-lincoln-mills-life-mask-150k-4096-high.glb",
      mediumFile: "abraham-lincoln-mills-life-mask-150k-2048-medium.glb",
      note: "Smithsonian marks the object and package CC0."
    }),
    model: {
      primaryUrl: smithsonianAsset("c02c239d-5ebf-4a7a-a368-e2288bbf4b31", "abraham-lincoln-mills-life-mask-150k-4096-high.glb"),
      fallbackUrl: smithsonianAsset("c02c239d-5ebf-4a7a-a368-e2288bbf4b31", "abraham-lincoln-mills-life-mask-150k-2048-medium.glb")
    },
    defaults: {
      zoom: 3.02,
      lightAngle: 24,
      lightPower: 2.02,
      exposure: 0.42,
      rough: 0.24
    },
    scene: {
      rotateZ: 0,
      targetHeight: 0.72,
      defaultYaw: -Math.PI * 0.04,
      defaultViewVector: [0.88, 0.42, 0.98],
      mobileViewVector: [0.7, 0.32, 0.88]
    }
  },
  "old-arrow-maker": {
    kind: "gltf",
    path: "/americas/old-arrow-maker/index.html",
    sectionId: "americas",
    sortOrder: 60,
    viewerTitle: "Old Arrow Maker (modeled 1866)",
    subtitle: "Artist: Edmonia Lewis (1844-1907)",
    medium: "Marble",
    dimensions: "H: 54.5 cm | W: 34.5 cm | D: 34 cm",
    locationLabel: "Collection:",
    location: "Smithsonian American Art Museum",
    lobbyMeta: "Source: Smithsonian 3D / SAAM",
    source: smithsonianSource({
      summary: "Rendered from Smithsonian 3D's Old Arrow Maker model by Edmonia Lewis.",
      recordUrl: "https://3d.si.edu/object/3d/old-arrow-maker%3A99ca3d6f-6d54-45a5-9b95-f8c245a662c2",
      packageId: "99ca3d6f-6d54-45a5-9b95-f8c245a662c2",
      highFile: "Old_Arrow_Maker-150k-4096-high.glb",
      mediumFile: "Old_Arrow_Maker-150k-2048-medium.glb",
      note: "Smithsonian marks the object and package CC0."
    }),
    model: {
      primaryUrl: smithsonianAsset("99ca3d6f-6d54-45a5-9b95-f8c245a662c2", "Old_Arrow_Maker-150k-4096-high.glb"),
      fallbackUrl: smithsonianAsset("99ca3d6f-6d54-45a5-9b95-f8c245a662c2", "Old_Arrow_Maker-150k-2048-medium.glb")
    },
    defaults: {
      zoom: 2.8,
      lightAngle: 24,
      lightPower: 2.04,
      exposure: 0.42,
      rough: 0.24
    },
    scene: {
      targetHeight: 1.04,
      defaultYaw: -Math.PI * 0.08,
      defaultViewVector: [1.02, 0.52, 1.16],
      mobileViewVector: [0.8, 0.4, 1.04]
    }
  },
  "solomon-islander-climbing-palm-tree": {
    kind: "gltf",
    path: "/americas/solomon-islander-climbing-palm-tree/index.html",
    sectionId: "americas",
    sortOrder: 62,
    viewerTitle: "Solomon Islander Climbing a Palm Tree (1934)",
    subtitle: "Artist: Malvina Hoffman (1885-1966); founder: Cellini Bronze Works",
    medium: "Bronze",
    dimensions: "H: 45.4 cm | W: 32.4 cm | D: 17.1 cm",
    locationLabel: "Collection:",
    location: "Smithsonian American Art Museum, Luce Foundation Center, 4th Floor",
    lobbyMeta: "Source: Smithsonian 3D / SAAM",
    source: smithsonianSource({
      summary: "Rendered from Smithsonian 3D's Solomon Islander Climbing a Palm Tree model by Malvina Hoffman.",
      recordUrl: "https://3d.si.edu/object/3d/solomon-islander-climbing-palm-tree%3A156572a0-6755-4318-a419-76d63f5d5876",
      packageId: "156572a0-6755-4318-a419-76d63f5d5876",
      highFile: "saam_2018_18_02-solomon_islander-polish-150k-4096-high.glb",
      mediumFile: "saam_2018_18_02-solomon_islander-polish-150k-2048-medium.glb",
      note: "Smithsonian lists metadata usage as not determined."
    }),
    model: {
      primaryUrl: smithsonianAsset("156572a0-6755-4318-a419-76d63f5d5876", "saam_2018_18_02-solomon_islander-polish-150k-4096-high.glb"),
      fallbackUrl: smithsonianAsset("156572a0-6755-4318-a419-76d63f5d5876", "saam_2018_18_02-solomon_islander-polish-150k-2048-medium.glb")
    },
    defaults: {
      zoom: 2.86,
      lightAngle: 24,
      lightPower: 2.04,
      exposure: 0.42,
      rough: 0.24
    },
    scene: {
      targetHeight: 0.96,
      defaultYaw: Math.PI * 0.06,
      defaultViewVector: [0.98, 0.48, 1.06],
      mobileViewVector: [0.78, 0.36, 0.94]
    }
  },
  "ancestor-figure-sawos": {
    kind: "gltf",
    path: "/ancestor-figure-sawos/",
    sectionId: "americas",
    sortOrder: 64,
    viewerTitle: "Ancestor Figure (Sawos people, 19th century or earlier)",
    subtitle: "The Metropolitan Museum of Art, The Michael C. Rockefeller Wing",
    medium: "Wood, paint, fiber, ferrous metal",
    dimensions: "H. 72 x W. 12 3/4 x D. 9 7/8 in. (182.9 x 32.4 x 25.1 cm)",
    locationLabel: "Collection:",
    location: "The Michael C. Rockefeller Wing, The Metropolitan Museum of Art",
    culture: "Sawos people",
    region: "Oceania",
    period: "19th century or earlier",
    current_location: "The Michael C. Rockefeller Wing, The Metropolitan Museum of Art",
    findspot_or_origin: "Papua New Guinea",
    scan_source: "The Met 3D / VNTANA",
    mesh_format: "GLB",
    tags: ["Sawos people", "Papua New Guinea", "Wood", "The Met", "Ancestor figure"],
    lobbyMeta: "Source: The Met 3D / The Michael C. Rockefeller Wing",
    source: source(
      "Rendered from The Metropolitan Museum of Art's 3D model of Ancestor Figure.",
      [
        link("Met object page", "https://www.metmuseum.org/art/collection/search/313780"),
        link("Original GLB", "https://api.vntana.com/assets/products/9e2482d7-098c-4312-a645-76da6cf0f578/organizations/The-Metropolitan-Museum-of-Art/clients/masters/d301b8d2-2b9c-4bfb-a2b6-dfb9c3ab3163.glb")
      ],
      "The title, date, culture, medium, dimensions, collection, and place of origin follow The Met collection record."
    ),
    defaults: {
      zoom: 2.86,
      lightAngle: 24,
      lightPower: 2.04,
      exposure: 0.42,
      rough: 0.24
    },
    model: {
      primaryUrl: "./ancestor_figure_sawos.glb",
      fallbackUrl: "./ancestor_figure_sawos.glb"
    },
    scene: {
      targetHeight: 1.22,
      focusYRatio: 0.56,
      defaultYaw: Math.PI * 0.05,
      defaultViewVector: [0.98, 0.56, 1.08],
      mobileViewVector: [0.8, 0.42, 0.96]
    }
  },
  "juno-ludovisi": {
    kind: "stl",
    path: "/juno-ludovisi/index.html",
    sectionId: "roman-world",
    sortOrder: 92,
    viewerTitle: "Juno Ludovisi (Roman bust after a Hellenistic type)",
    subtitle: "Artist: Unknown Roman sculptor",
    medium: "Marble",
    locationLabel: "Original:",
    location: "National Roman Museum, Palazzo Altemps, Rome",
    lobbyMeta: "Source: Scan the World / Wikimedia Commons STL",
    source: source(
      "Local STL mirrored from the Scan the World Juno Ludovisi file on Wikimedia Commons.",
      [
        link("Wikimedia Commons file", "https://commons.wikimedia.org/wiki/File:Scan_the_World_-_Juno_Ludovisi.stl"),
        link("Direct STL", "https://upload.wikimedia.org/wikipedia/commons/4/4e/Scan_the_World_-_Juno_Ludovisi.stl")
      ],
      "The Commons file is part of the Scan the World archive. The title follows the traditional identification of the Ludovisi Juno / Hera bust, though the exact subject remains debated in scholarship."
    ),
    defaults: {
      zoom: 2.68,
      lightAngle: 24,
      lightPower: 2.02,
      exposure: 0.42,
      rough: 0.22
    },
    model: {
      primaryUrl: "./juno_ludovisi_source.stl",
      fallbackUrl: "./juno_ludovisi_source.stl"
    },
    scene: {
      targetHeight: 1.14,
      defaultYaw: Math.PI * 0.05,
      defaultViewVector: [1.02, 0.46, 1.32],
      mobileViewVector: [0.8, 0.38, 1.18]
    }
  },
  "pandora-james-pradier": {
    kind: "stl",
    path: "/pandora-james-pradier/index.html",
    sectionId: "nineteenth-century",
    sortOrder: 10,
    viewerTitle: "Pandora",
    subtitle: "Artist: James Pradier (1790-1852)",
    medium: "Marble",
    locationLabel: "Collection:",
    location: "Musee d'Art et d'Histoire de Geneve",
    lobbyMeta: "Source: Wikimedia Commons / MAHG scan",
    source: source(
      "Local STL mirrored from the Wikimedia Commons scan of James Pradier's Pandora from the Musee d'Art et d'Histoire de Geneve.",
      [
        link("Wikimedia Commons file", "https://commons.wikimedia.org/wiki/File:Pandora-James_Pradier-MAHG_Inv_1991-0006-High_poly.stl"),
        link("Direct STL", "https://upload.wikimedia.org/wikipedia/commons/2/22/Pandora-James_Pradier-MAHG_Inv_1991-0006-High_poly.stl")
      ],
      "The Commons file credits a high-poly scan by Rama from the Geneva museum's collection."
    ),
    defaults: {
      zoom: 2.54,
      lightAngle: 24,
      lightPower: 2.04,
      exposure: 0.42,
      rough: 0.22
    },
    model: {
      primaryUrl: "./pandora_source.stl",
      fallbackUrl: "./pandora_source.stl"
    },
    scene: {
      targetHeight: 1.74,
      defaultYaw: Math.PI * 0.06,
      defaultViewVector: [1.18, 0.68, 1.82],
      mobileViewVector: [0.9, 0.5, 1.64]
    }
  },
  "diana-of-villa-bartholoni": {
    kind: "stl",
    path: "/diana-of-villa-bartholoni/index.html",
    sectionId: "nineteenth-century",
    sortOrder: 12,
    viewerTitle: "Diana of Villa Bartholoni",
    subtitle: "Artist: James Pradier (1790-1852)",
    medium: "Marble",
    locationLabel: "Collection:",
    location: "Musee d'Art et d'Histoire de Geneve",
    lobbyMeta: "Source: Wikimedia Commons / MAHG scan",
    source: source(
      "Local STL mirrored from the Wikimedia Commons scan of James Pradier's Diana of Villa Bartholoni from the Musee d'Art et d'Histoire de Geneve.",
      [
        link("Wikimedia Commons file", "https://commons.wikimedia.org/wiki/File:Diana_of_Villa_Bartholoni-High_poly-001.stl"),
        link("Direct STL", "https://upload.wikimedia.org/wikipedia/commons/d/da/Diana_of_Villa_Bartholoni-High_poly-001.stl")
      ],
      "The Commons file credits a high-poly scan by Rama from the Geneva museum's collection."
    ),
    defaults: {
      zoom: 2.52,
      lightAngle: 24,
      lightPower: 2.04,
      exposure: 0.42,
      rough: 0.22
    },
    model: {
      primaryUrl: "./diana_of_villa_bartholoni_source.stl",
      fallbackUrl: "./diana_of_villa_bartholoni_source.stl"
    },
    scene: {
      targetHeight: 1.76,
      defaultYaw: -Math.PI * 0.04,
      defaultViewVector: [1.2, 0.7, 1.86],
      mobileViewVector: [0.92, 0.52, 1.68]
    }
  },
  "ugolino-and-his-sons": {
    kind: "gltf",
    path: "/ugolino-and-his-sons/",
    sectionId: "nineteenth-century",
    sortOrder: 9,
    viewerTitle: "Ugolino and His Sons (Jean-Baptiste Carpeaux, 1865-67)",
    subtitle: "The Metropolitan Museum of Art, Department of European Sculpture and Decorative Arts",
    medium: "Saint-Beat marble",
    dimensions: "H: 197.5 cm | W: 149.9 cm | D: 110.5 cm",
    locationLabel: "On view:",
    location: "Gallery 548, The Metropolitan Museum of Art",
    culture: "French",
    region: "France",
    period: "1865-67",
    current_location: "Gallery 548, The Metropolitan Museum of Art",
    scan_source: "The Met 3D / VNTANA",
    mesh_format: "GLB",
    tags: ["Jean-Baptiste Carpeaux", "French", "Marble", "The Met", "Nineteenth Century"],
    lobbyMeta: "Source: The Met 3D / Department of European Sculpture and Decorative Arts",
    source: source(
      "Rendered from The Metropolitan Museum of Art's 3D model of Ugolino and His Sons.",
      [
        link("Met object page", "https://www.metmuseum.org/art/collection/search/204812"),
        link("Original GLB", "https://api.vntana.com/assets/products/93b7d97c-9333-4927-8dd1-293c8bf56eca/organizations/The-Metropolitan-Museum-of-Art/clients/masters/8acc969e-ec05-4f33-a906-442ba08a3533.glb")
      ],
      "The title, artist, date, medium, dimensions, department, and gallery location follow The Met collection record."
    ),
    defaults: {
      zoom: 2.82,
      lightAngle: 24,
      lightPower: 2.02,
      exposure: 0.42,
      rough: 0.24
    },
    model: {
      primaryUrl: "./ugolino_and_his_sons.glb",
      fallbackUrl: "./ugolino_and_his_sons.glb"
    },
    scene: {
      targetHeight: 1.12,
      focusYRatio: 0.56,
      defaultYaw: Math.PI * 0.04,
      defaultViewVector: [1.0, 0.5, 1.08],
      mobileViewVector: [0.8, 0.4, 0.96]
    }
  },
  "perseus-with-head-of-medusa": {
    kind: "gltf",
    path: "/perseus-with-head-of-medusa/",
    sectionId: "nineteenth-century",
    sortOrder: 8,
    viewerTitle: "Perseus with the Head of Medusa (Antonio Canova, 1804-6)",
    subtitle: "The Metropolitan Museum of Art, Department of European Sculpture and Decorative Arts",
    medium: "Marble",
    dimensions: "Overall (confirmed): H. 95 1/2 x W. 75 1/2 x D. 40 1/2 in. (242.6 x 191.8 x 102.9 cm)",
    locationLabel: "On view:",
    location: "Gallery 548, The Metropolitan Museum of Art",
    period: "1804-6",
    current_location: "Gallery 548, The Metropolitan Museum of Art",
    scan_source: "The Met 3D / VNTANA",
    mesh_format: "GLB",
    tags: ["Antonio Canova", "Marble", "The Met"],
    lobbyMeta: "Source: The Met 3D / Department of European Sculpture and Decorative Arts",
    source: source(
      "Rendered from The Metropolitan Museum of Art's 3D model of Perseus with the Head of Medusa.",
      [
        link("Met object page", "https://www.metmuseum.org/art/collection/search/204758"),
        link("Original GLB", "https://api.vntana.com/assets/products/3fcfb334-f595-4ace-a2dd-264834acfeb7/organizations/The-Metropolitan-Museum-of-Art/clients/masters/0ebe6e27-4a55-4bd7-a8d5-2f3f3107f6bd.glb")
      ],
      "The title, artist, date, medium, dimensions, department, and gallery number follow The Met collection record."
    ),
    defaults: {
      zoom: 2.9,
      lightAngle: 24,
      lightPower: 2.02,
      exposure: 0.42,
      rough: 0.24
    },
    model: {
      primaryUrl: "./perseus_with_the_head_of_medusa.glb",
      fallbackUrl: "./perseus_with_the_head_of_medusa.glb"
    },
    scene: {
      targetHeight: 1.72,
      focusYRatio: 0.58,
      defaultYaw: Math.PI * 0.05,
      defaultViewVector: [1.08, 0.62, 1.22],
      mobileViewVector: [0.86, 0.44, 1.02]
    }
  },
  ganymede: {
    kind: "stl",
    path: "/ganymede/index.html",
    sectionId: "hellenistic-world",
    sortOrder: 90,
    viewerTitle: "Ganymede (Magna Graecia, 3rd-2nd century BCE)",
    subtitle: "Artist: Unknown Greek sculptor",
    medium: "Terracotta",
    dimensions: "H: 29 cm | W: 9.6 cm | D: 7.2 cm",
    locationLabel: "Collection:",
    location: "Musee Saint-Raymond, Toulouse",
    lobbyMeta: "Source: Scan the World / Wikimedia Commons STL",
    source: source(
      "Local STL mirrored from the Musee Saint-Raymond / Scan the World Ganymede file on Wikimedia Commons.",
      [
        link("Wikimedia Commons file", "https://commons.wikimedia.org/wiki/File:Scan-the-World-msr-2002_3_1-Ganymede.stl"),
        link("Direct STL", "https://commons.wikimedia.org/wiki/Special:Redirect/file/File:Scan-the-World-msr-2002_3_1-Ganymede.stl")
      ],
      "The Commons metadata identifies the statuette as a terracotta Ganymede from Magna Graecia, dated to the third or second century BCE, in the Musee Saint-Raymond collection."
    ),
    defaults: {
      zoom: 2.78,
      lightAngle: 24,
      lightPower: 2.04,
      exposure: 0.42,
      rough: 0.24
    },
    model: {
      primaryUrl: "./ganymede_source.stl",
      fallbackUrl: "./ganymede_source.stl"
    },
    scene: {
      rotateX: 0,
      targetHeight: 1.28,
      defaultYaw: Math.PI * 0.08,
      defaultViewVector: [1.06, 0.58, 1.42],
      mobileViewVector: [0.82, 0.46, 1.24]
    }
  },
  "young-bacchus-bronze": {
    kind: "stl",
    path: "/young-bacchus-bronze/index.html",
    sectionId: "roman-world",
    sortOrder: 94,
    viewerTitle: "Young Bacchus (southern Gaul or Italy, 2nd-3rd century CE)",
    subtitle: "Artist: Unknown Roman sculptor",
    medium: "Bronze",
    dimensions: "H: 7.6 cm | W: 3 cm | D: 2 cm",
    locationLabel: "Collection:",
    location: "Musee Saint-Raymond, Toulouse",
    lobbyMeta: "Source: Musee Saint-Raymond / Wikimedia Commons STL",
    source: source(
      "Local STL mirrored from the Musee Saint-Raymond bronze Young Bacchus file on Wikimedia Commons.",
      [
        link("Wikimedia Commons file", "https://commons.wikimedia.org/wiki/File:Msr-young-bacchus-bronze-10.stl"),
        link("Direct STL", "https://commons.wikimedia.org/wiki/Special:Redirect/file/File:Msr-young-bacchus-bronze-10.stl")
      ],
      "The Commons metadata identifies the object as a bronze figurine of Young Bacchus from southern Gaul or Italy, dated to the second or third century CE."
    ),
    defaults: {
      zoom: 3.18,
      lightAngle: 24,
      lightPower: 2.08,
      exposure: 0.42,
      rough: 0.2
    },
    model: {
      primaryUrl: "./young_bacchus_bronze_source.stl",
      fallbackUrl: "./young_bacchus_bronze_source.stl"
    },
    scene: {
      targetHeight: 0.88,
      defaultYaw: -Math.PI * 0.04,
      defaultViewVector: [0.94, 0.46, 1.02],
      mobileViewVector: [0.74, 0.36, 0.92]
    },
    material: {
      color: "#8f673f",
      metalness: 0.3,
      roughness: 0.46,
      clearcoat: 0.14,
      clearcoatRoughness: 0.38
    }
  },
  vulcan: {
    kind: "stl",
    path: "/vulcan/index.html",
    sectionId: "roman-world",
    sortOrder: 96,
    viewerTitle: "Vulcan (1st-2nd century CE)",
    subtitle: "Artist: Unknown Roman sculptor",
    medium: "Bronze",
    dimensions: "H: 7.5 cm | W: 5.8 cm | D: 3.2 cm",
    locationLabel: "Collection:",
    location: "Musee Saint-Raymond, Toulouse",
    lobbyMeta: "Source: Musee Saint-Raymond / Wikimedia Commons STL",
    source: source(
      "Local STL mirrored from the Musee Saint-Raymond Vulcan bronze file on Wikimedia Commons.",
      [
        link("Wikimedia Commons file", "https://commons.wikimedia.org/wiki/File:Saint-raymond-vulcain-5.stl"),
        link("Direct STL", "https://commons.wikimedia.org/wiki/Special:Redirect/file/File:Saint-raymond-vulcain-5.stl")
      ],
      "The Commons metadata identifies the object as a bronze Vulcan dated to the first or second century CE in the Musee Saint-Raymond collection."
    ),
    defaults: {
      zoom: 3.06,
      lightAngle: 24,
      lightPower: 2.08,
      exposure: 0.42,
      rough: 0.2
    },
    model: {
      primaryUrl: "./vulcan_source.stl",
      fallbackUrl: "./vulcan_source.stl"
    },
    scene: {
      targetHeight: 0.9,
      defaultYaw: Math.PI * 0.04,
      defaultViewVector: [0.96, 0.48, 1.04],
      mobileViewVector: [0.76, 0.36, 0.94]
    },
    material: {
      color: "#8b653f",
      metalness: 0.32,
      roughness: 0.48,
      clearcoat: 0.14,
      clearcoatRoughness: 0.4
    }
  },
  attis: {
    kind: "stl",
    path: "/attis/index.html",
    sectionId: "roman-world",
    sortOrder: 98,
    viewerTitle: "Attis (3rd century CE)",
    subtitle: "Artist: Unknown Roman sculptor",
    medium: "Terracotta",
    dimensions: "H: 20 cm | W: 17 cm | D: 5.4 cm",
    locationLabel: "Collection:",
    location: "Musee Saint-Raymond, Toulouse",
    lobbyMeta: "Source: Musee Saint-Raymond / Wikimedia Commons STL",
    source: source(
      "Local STL mirrored from the Musee Saint-Raymond Attis terracotta file on Wikimedia Commons.",
      [
        link("Wikimedia Commons file", "https://commons.wikimedia.org/wiki/File:Saint-raymond-attis-5.stl"),
        link("Direct STL", "https://commons.wikimedia.org/wiki/Special:Redirect/file/File:Saint-raymond-attis-5.stl")
      ],
      "The Commons metadata identifies the object as a terracotta Attis dated to the third century CE in the Musee Saint-Raymond collection."
    ),
    defaults: {
      zoom: 2.78,
      lightAngle: 24,
      lightPower: 2.04,
      exposure: 0.42,
      rough: 0.24
    },
    model: {
      primaryUrl: "./attis_source.stl",
      fallbackUrl: "./attis_source.stl"
    },
    scene: {
      targetHeight: 1.12,
      defaultYaw: Math.PI * 0.06,
      defaultViewVector: [1.02, 0.54, 1.28],
      mobileViewVector: [0.8, 0.42, 1.14]
    }
  },
  "bust-of-marcus-aurelius": {
    kind: "stl",
    path: "/bust-of-marcus-aurelius/index.html",
    sectionId: "roman-world",
    sortOrder: 100,
    viewerTitle: "Bust of Marcus Aurelius Antoninus (c. 200 CE)",
    subtitle: "Artist: Unknown Roman sculptor",
    medium: "Marble",
    dimensions: "H: 78.5 cm | W: 56.5 cm | D: 32.5 cm",
    locationLabel: "Collection:",
    location: "Musee Saint-Raymond, Toulouse",
    lobbyMeta: "Source: Musee Saint-Raymond / Wikimedia Commons STL",
    source: source(
      "Local STL mirrored from the Musee Saint-Raymond bust of Marcus Aurelius Antoninus file on Wikimedia Commons.",
      [
        link("Wikimedia Commons file", "https://commons.wikimedia.org/wiki/File:Msr-bust-of-marcus-aurelius-cesar.stl"),
        link("Direct STL", "https://commons.wikimedia.org/wiki/Special:Redirect/file/File:Msr-bust-of-marcus-aurelius-cesar.stl")
      ],
      "The linked Commons metadata identifies the sculpture as Musee Saint-Raymond inventory Ra 61 a, a marble bust of Marcus Aurelius Antoninus dated around 200 CE."
    ),
    defaults: {
      zoom: 2.76,
      lightAngle: 24,
      lightPower: 2.04,
      exposure: 0.42,
      rough: 0.24
    },
    model: {
      primaryUrl: "./bust_of_marcus_aurelius_source.stl",
      fallbackUrl: "./bust_of_marcus_aurelius_source.stl"
    },
    scene: {
      rotateX: 0,
      targetHeight: 1.04,
      defaultYaw: Math.PI * 0.08,
      defaultViewVector: [1.0, 0.56, 1.18],
      mobileViewVector: [0.8, 0.42, 1.04]
    }
  },
  "bearded-hercules-head": {
    kind: "stl",
    path: "/bearded-hercules-head/index.html",
    sectionId: "roman-world",
    sortOrder: 102,
    viewerTitle: "Bearded Hercules Head (3rd century CE)",
    subtitle: "Artist: Unknown Roman sculptor",
    medium: "Saint-Beat marble",
    dimensions: "H: 29.5 cm | W: 23.5 cm | D: 22 cm",
    locationLabel: "Collection:",
    location: "Musee Saint-Raymond, Toulouse",
    lobbyMeta: "Source: Musee Saint-Raymond / Wikimedia Commons STL",
    source: source(
      "Local STL mirrored from the Musee Saint-Raymond bearded Hercules head file on Wikimedia Commons.",
      [
        link("Wikimedia Commons file", "https://commons.wikimedia.org/wiki/File:Msr-bearded-hercules-head-5.stl"),
        link("Direct STL", "https://commons.wikimedia.org/wiki/Special:Redirect/file/File:Msr-bearded-hercules-head-5.stl")
      ],
      "The linked Commons metadata identifies the object as Musee Saint-Raymond inventory Ra 28 k, a head of Hercules carved in Saint-Beat marble and dated to the third century CE."
    ),
    defaults: {
      zoom: 2.96,
      lightAngle: 24,
      lightPower: 2.04,
      exposure: 0.42,
      rough: 0.22
    },
    model: {
      primaryUrl: "./bearded_hercules_head_source.stl",
      fallbackUrl: "./bearded_hercules_head_source.stl"
    },
    scene: {
      rotateX: 0,
      targetHeight: 0.72,
      defaultYaw: Math.PI * 0.06,
      defaultViewVector: [0.9, 0.44, 0.98],
      mobileViewVector: [0.72, 0.34, 0.9]
    }
  },
  "head-of-maxence": {
    kind: "stl",
    path: "/head-of-maxence/index.html",
    sectionId: "roman-world",
    sortOrder: 104,
    viewerTitle: "Head of Maxence (?) (c. 293 CE)",
    subtitle: "Artist: Unknown Roman sculptor",
    medium: "Saint-Beat marble",
    dimensions: "H: 33 cm | W: 22 cm | D: 23 cm",
    locationLabel: "Collection:",
    location: "Musee Saint-Raymond, Toulouse",
    lobbyMeta: "Source: Musee Saint-Raymond / Wikimedia Commons STL",
    source: source(
      "Local STL mirrored from the Musee Saint-Raymond young Maxence head file on Wikimedia Commons.",
      [
        link("Wikimedia Commons file", "https://commons.wikimedia.org/wiki/File:Msr-young-maxence-head-5.stl"),
        link("Direct STL", "https://commons.wikimedia.org/wiki/Special:Redirect/file/File:Msr-young-maxence-head-5.stl")
      ],
      "The linked Commons metadata identifies the object as Musee Saint-Raymond inventory Ra 93 ter, a head of Maxence(?) in Saint-Beat marble dated to 293 CE."
    ),
    defaults: {
      zoom: 2.92,
      lightAngle: 24,
      lightPower: 2.04,
      exposure: 0.42,
      rough: 0.22
    },
    model: {
      primaryUrl: "./head_of_maxence_source.stl",
      fallbackUrl: "./head_of_maxence_source.stl"
    },
    scene: {
      rotateX: 0,
      targetHeight: 0.8,
      defaultYaw: -Math.PI * 0.04,
      defaultViewVector: [0.92, 0.46, 1.02],
      mobileViewVector: [0.74, 0.36, 0.92]
    }
  },
  "adolescent-torso": {
    kind: "stl",
    path: "/adolescent-torso/index.html",
    sectionId: "roman-world",
    sortOrder: 106,
    viewerTitle: "Adolescent Torso",
    subtitle: "Artist: Unknown sculptor",
    medium: "Marble",
    dimensions: "H: 58 cm | D: 21.5 cm",
    locationLabel: "Collection:",
    location: "Musee Saint-Raymond, Toulouse (reserves)",
    lobbyMeta: "Source: Musee Saint-Raymond / Wikimedia Commons STL",
    source: source(
      "Local STL mirrored from the Musee Saint-Raymond adolescent torso file on Wikimedia Commons.",
      [
        link("Wikimedia Commons file", "https://commons.wikimedia.org/wiki/File:Msr-adolescent-torso-repaired-repaired.stl"),
        link("Direct STL", "https://commons.wikimedia.org/wiki/Special:Redirect/file/File:Msr-adolescent-torso-repaired-repaired.stl")
      ],
      "The linked Commons metadata identifies the object as Musee Saint-Raymond inventory Ra 47 a, a marble torso currently held in the museum reserves. The source metadata publishes height and depth but does not provide a width measurement."
    ),
    defaults: {
      zoom: 2.84,
      lightAngle: 24,
      lightPower: 2.04,
      exposure: 0.42,
      rough: 0.22
    },
    model: {
      primaryUrl: "./adolescent_torso_source.stl",
      fallbackUrl: "./adolescent_torso_source.stl"
    },
    scene: {
      rotateX: 0,
      targetHeight: 0.96,
      defaultYaw: Math.PI * 0.05,
      defaultViewVector: [0.98, 0.52, 1.08],
      mobileViewVector: [0.78, 0.4, 0.98]
    }
  },
  "bronze-horse-head-herculaneum": {
    kind: "gltf",
    path: "/bronze-horse-head-herculaneum/index.html",
    sectionId: "roman-world",
    sortOrder: 108,
    viewerTitle: "Bronze Horse Head from Herculaneum",
    subtitle: "Artist: Unknown Roman bronze worker",
    medium: "Bronze",
    locationLabel: "Collection:",
    location: "National Archaeological Museum of Naples",
    lobbyMeta: "Source: Archeologia e Calcolatori / ATON",
    source: source(
      "Rendered from the Archeologia e Calcolatori / ATON GLTF package for the bronze horse head from Herculaneum.",
      [
        link("Archeologia e Calcolatori record", "https://www.archcalc.cnr.it/resources/3dmodels/33"),
        link("ATON scene", "https://aton.archcalc.cnr.it/s/aec/34.2-paf2?uip=minimal"),
        link("Direct GLTF", "https://aton.archcalc.cnr.it/collections/aec/models/Pafumi_et_al_2/scene.gltf")
      ],
      "The Archeologia e Calcolatori record identifies the object as a bronze horse head from Herculaneum, now in the National Archaeological Museum of Naples, inv. n. 115391."
    ),
    defaults: {
      zoom: 2.38,
      lightAngle: 24,
      lightPower: 2.06,
      exposure: 0.42,
      rough: 0.24
    },
    model: {
      primaryUrl: "./scene.gltf",
      fallbackUrl: "./scene.gltf"
    },
    scene: {
      showPedestal: true,
      receiveFloorShadow: true,
      pedestalMargin: 1.16,
      pedestalMinRadius: 0.42,
      baseHeight: 0.14,
      pruneNodeNames: ["Cubo", "Disco_1"],
      targetHeight: 0.92,
      defaultYaw: Math.PI * 0.08,
      defaultViewVector: [0.98, 0.5, 1.18],
      mobileViewVector: [0.78, 0.4, 1.02]
    }
  },
  "diana-ra-34-h": {
    kind: "stl",
    path: "/diana-ra-34-h/index.html",
    sectionId: "roman-world",
    sortOrder: 110,
    viewerTitle: "Diana (traditional identification, 3rd century CE)",
    subtitle: "Artist: Unknown Roman sculptor",
    medium: "Marble",
    dimensions: "H: 49 cm | W: 37 cm | D: 27 cm",
    locationLabel: "Collection:",
    location: "Musee Saint-Raymond, Toulouse",
    lobbyMeta: "Source: Musee Saint-Raymond / Wikimedia Commons STL",
    source: source(
      "Local STL mirrored from the Musee Saint-Raymond Diana(?) file on Wikimedia Commons.",
      [
        link("Wikimedia Commons file", "https://commons.wikimedia.org/wiki/File:Saint-raymond-diane-5.stl"),
        link("Direct STL", "https://commons.wikimedia.org/wiki/Special:Redirect/file/File:Saint-raymond-diane-5.stl")
      ],
      "The linked Commons metadata identifies the sculpture as Musee Saint-Raymond inventory Ra 34 h, a marble figure traditionally identified as Diana, with the identification marked as tentative in the source record, dated to the third century CE."
    ),
    defaults: {
      zoom: 2.86,
      lightAngle: 24,
      lightPower: 2.04,
      exposure: 0.42,
      rough: 0.22
    },
    model: {
      primaryUrl: "./diana_ra_34_h_source.stl",
      fallbackUrl: "./diana_ra_34_h_source.stl"
    },
    scene: {
      rotateX: 0,
      targetHeight: 0.96,
      defaultYaw: Math.PI * 0.04,
      defaultViewVector: [0.98, 0.52, 1.08],
      mobileViewVector: [0.78, 0.4, 0.98]
    }
  },
  "cybele-ra-34-i": {
    kind: "stl",
    path: "/cybele-ra-34-i/index.html",
    sectionId: "roman-world",
    sortOrder: 112,
    viewerTitle: "Cybele (3rd century CE)",
    subtitle: "Artist: Unknown Roman sculptor",
    medium: "Marble",
    dimensions: "H: 52 cm | W: 40 cm | D: 40 cm",
    locationLabel: "Collection:",
    location: "Musee Saint-Raymond, Toulouse",
    lobbyMeta: "Source: Musee Saint-Raymond / Wikimedia Commons STL",
    source: source(
      "Local STL mirrored from the Musee Saint-Raymond Cybele file on Wikimedia Commons.",
      [
        link("Wikimedia Commons file", "https://commons.wikimedia.org/wiki/File:Saint-raymond-cybele-5.stl"),
        link("Direct STL", "https://commons.wikimedia.org/wiki/Special:Redirect/file/File:Saint-raymond-cybele-5.stl")
      ],
      "The linked Commons metadata identifies the sculpture as Musee Saint-Raymond inventory Ra 34 i, a marble figure of Cybele dated to the third century CE."
    ),
    defaults: {
      zoom: 2.88,
      lightAngle: 24,
      lightPower: 2.04,
      exposure: 0.42,
      rough: 0.22
    },
    model: {
      primaryUrl: "./cybele_ra_34_i_source.stl",
      fallbackUrl: "./cybele_ra_34_i_source.stl"
    },
    scene: {
      rotateX: 0,
      targetHeight: 0.98,
      defaultYaw: -Math.PI * 0.04,
      defaultViewVector: [1.0, 0.54, 1.12],
      mobileViewVector: [0.8, 0.42, 1.0]
    }
  },
  "cleopatra-v-tryphaena": {
    kind: "stl",
    path: "/cleopatra-v-tryphaena/index.html",
    sectionId: "roman-world",
    sortOrder: 114,
    viewerTitle: "Portrait of Cleopatra V Tryphaena (1st century BCE)",
    subtitle: "Artist: Unknown sculptor",
    medium: "Marble",
    dimensions: "H: 35 cm | W: 25 cm | D: 26 cm",
    locationLabel: "Collection:",
    location: "Musee Saint-Raymond, Toulouse",
    lobbyMeta: "Source: Musee Saint-Raymond / Wikimedia Commons STL",
    source: source(
      "Local STL mirrored from the Musee Saint-Raymond portrait of Cleopatra V Tryphaena file on Wikimedia Commons.",
      [
        link("Wikimedia Commons file", "https://commons.wikimedia.org/wiki/File:25-msr-cleopatre-v-5.stl"),
        link("Direct STL", "https://commons.wikimedia.org/wiki/Special:Redirect/file/File:25-msr-cleopatre-v-5.stl")
      ],
      "The linked Commons metadata identifies the object as Musee Saint-Raymond inventory Ra 80, a marble portrait traditionally identified as Cleopatra V Tryphaena and dated to the first century BCE."
    ),
    defaults: {
      zoom: 2.96,
      lightAngle: 24,
      lightPower: 2.04,
      exposure: 0.42,
      rough: 0.22
    },
    model: {
      primaryUrl: "./cleopatra_v_tryphaena_source.stl",
      fallbackUrl: "./cleopatra_v_tryphaena_source.stl"
    },
    scene: {
      rotateX: -Math.PI * 0.5,
      targetHeight: 0.78,
      defaultYaw: Math.PI * 0.08,
      defaultViewVector: [0.92, 0.46, 1.02],
      mobileViewVector: [0.74, 0.36, 0.92]
    }
  },
  "galeria-valeria-eutropia": {
    kind: "stl",
    path: "/galeria-valeria-eutropia/index.html",
    sectionId: "roman-world",
    sortOrder: 116,
    viewerTitle: "Galeria Valeria Eutropia (3rd-4th century CE)",
    subtitle: "Artist: Unknown Roman sculptor",
    medium: "Marble",
    dimensions: "H: 36 cm | W: 27 cm | D: 17 cm",
    locationLabel: "Collection:",
    location: "Musee Saint-Raymond, Toulouse",
    lobbyMeta: "Source: Musee Saint-Raymond / Wikimedia Commons STL",
    source: source(
      "Local STL mirrored from the Musee Saint-Raymond Galeria Valeria Eutropia file on Wikimedia Commons.",
      [
        link("Wikimedia Commons file", "https://commons.wikimedia.org/wiki/File:35-msr-galeria-valeria-eutropia-5.stl"),
        link("Direct STL", "https://commons.wikimedia.org/wiki/Special:Redirect/file/File:35-msr-galeria-valeria-eutropia-5.stl")
      ],
      "The linked Commons metadata identifies the object as Musee Saint-Raymond inventory Ra 38(2), a marble bust traditionally identified as Galeria Valeria Eutropia and dated between the third and fourth century CE."
    ),
    defaults: {
      zoom: 2.98,
      lightAngle: 24,
      lightPower: 2.04,
      exposure: 0.42,
      rough: 0.22
    },
    model: {
      primaryUrl: "./galeria_valeria_eutropia_source.stl",
      fallbackUrl: "./galeria_valeria_eutropia_source.stl"
    },
    scene: {
      rotateX: -Math.PI * 0.5,
      targetHeight: 0.82,
      defaultYaw: -Math.PI * 0.06,
      defaultViewVector: [0.94, 0.48, 1.04],
      mobileViewVector: [0.76, 0.38, 0.94]
    }
  },
  "figure-of-an-elephant-possibly-a-chessman": {
    kind: "gltf",
    path: "/asia/figure-of-an-elephant-possibly-a-chessman/",
    sectionId: "asia",
    sortOrder: 22,
    viewerTitle: "Figure of an elephant, possibly a chessman (Sasanian, ca. 6th-7th century CE)",
    subtitle: "The Metropolitan Museum of Art",
    medium: "Dolomite (Ferroan-Dolomite)",
    dimensions: "2 15/16 x 1 9/16 x 3 5/8 in. (7.5 x 3.9 x 9.2 cm)",
    locationLabel: "Collection:",
    location: "The Metropolitan Museum of Art",
    culture: "Sasanian",
    region: "Asia",
    period: "Sasanian",
    current_location: "The Metropolitan Museum of Art",
    findspot_or_origin: "Iran or Mesopotamia",
    scan_source: "The Met 3D / VNTANA",
    mesh_format: "GLB",
    tags: ["Sasanian", "Iran", "Mesopotamia", "Dolomite", "The Met", "Elephant"],
    lobbyMeta: "Source: The Met 3D",
    source: source(
      "Rendered from The Metropolitan Museum of Art's 3D model of Figure of an elephant, possibly a chessman.",
      [
        link("Met object page", "https://www.metmuseum.org/art/collection/search/324052"),
        link("Original GLB", "https://api.vntana.com/assets/products/519e217f-8d2e-4808-8a41-06d0538e0e9e/organizations/The-Metropolitan-Museum-of-Art/clients/masters/4b9f090d-1839-4fd9-b590-04462b1a16ca.glb")
      ],
      "The title, date, culture, medium, dimensions, and origin follow The Met collection record."
    ),
    defaults: {
      zoom: 2.86,
      lightAngle: 24,
      lightPower: 2.04,
      exposure: 0.42,
      rough: 0.22
    },
    model: {
      primaryUrl: "./figure_of_an_elephant_possibly_a_chessman.glb",
      fallbackUrl: "./figure_of_an_elephant_possibly_a_chessman.glb"
    },
    scene: {
      targetHeight: 0.62,
      focusYRatio: 0.52,
      defaultYaw: Math.PI * 0.06,
      defaultViewVector: [0.88, 0.34, 0.86],
      mobileViewVector: [0.72, 0.3, 0.74]
    }
  },
  "cypriot-limestone-priest": {
    kind: "gltf",
    path: "/cypriot-limestone-priest/",
    sectionId: "greek-classical",
    sortOrder: 26.25,
    viewerTitle: "Limestone priest (Cypriot, Archaic, end of the 6th century BCE)",
    subtitle: "The Metropolitan Museum of Art",
    medium: "Limestone",
    dimensions: "85 1/2 x 27 x 15 in., 1044 lb. (217.2 x 68.6 x 38.1 cm, 473.6 kg)",
    locationLabel: "Collection:",
    location: "The Metropolitan Museum of Art",
    culture: "Cypriot",
    region: "Greek world",
    period: "Archaic",
    current_location: "The Metropolitan Museum of Art",
    scan_source: "The Met 3D / VNTANA",
    mesh_format: "GLB",
    tags: ["Cypriot", "Archaic", "Limestone", "The Met", "Priest"],
    lobbyMeta: "Source: The Met 3D",
    source: source(
      "Rendered from The Metropolitan Museum of Art's 3D model of Limestone priest.",
      [
        link("Met object page", "https://www.metmuseum.org/art/collection/search/242019"),
        link("Original GLB", "https://api.vntana.com/assets/products/4dc3978f-e140-4e52-bb42-34f664cf6ce7/organizations/The-Metropolitan-Museum-of-Art/clients/masters/6b4229aa-f192-4e8b-9263-2d8586b9ddac.glb")
      ],
      "The title, date, culture, medium, dimensions, and collection follow The Met collection record."
    ),
    defaults: {
      zoom: 2.9,
      lightAngle: 24,
      lightPower: 2.04,
      exposure: 0.42,
      rough: 0.22
    },
    model: {
      primaryUrl: "./limestone_priest.glb",
      fallbackUrl: "./limestone_priest.glb"
    },
    scene: {
      targetHeight: 1.42,
      focusYRatio: 0.56,
      defaultYaw: Math.PI * 0.04,
      defaultViewVector: [1.0, 0.56, 1.16],
      mobileViewVector: [0.82, 0.42, 1.02]
    }
  },
  "seated-figure-middle-niger": {
    kind: "gltf",
    path: "/sub-saharan-africa/seated-figure-middle-niger/",
    sectionId: "sub-saharan-africa",
    sortOrder: 18,
    viewerTitle: "Seated figure (Middle Niger civilization, 13th century)",
    subtitle: "Artist: Middle Niger artist; The Metropolitan Museum of Art",
    medium: "Terracotta",
    dimensions: "H. 10 x W. 9 3/4 x D. 11 3/4 in. (25.4 x 24.8 x 29.8 cm)",
    locationLabel: "Collection:",
    location: "The Metropolitan Museum of Art",
    culture: "Middle Niger civilization",
    region: "Sub-Saharan Africa",
    period: "13th century",
    current_location: "The Metropolitan Museum of Art",
    findspot_or_origin: "Mali",
    scan_source: "The Met 3D / VNTANA",
    mesh_format: "GLB",
    tags: ["Middle Niger civilization", "Mali", "Terracotta", "The Met", "Figure"],
    lobbyMeta: "Source: The Met 3D",
    source: source(
      "Rendered from The Metropolitan Museum of Art's 3D model of Seated figure.",
      [
        link("Met object page", "https://www.metmuseum.org/art/collection/search/314362"),
        link("Original GLB", "https://api.vntana.com/assets/products/2bcfc4bb-da49-4228-9e09-92a4e45a2a68/organizations/The-Metropolitan-Museum-of-Art/clients/masters/dc86eefd-cce7-4f8e-b18b-3c795030a5a5.glb")
      ],
      "The title, date, artist attribution, culture, medium, dimensions, and origin follow The Met collection record."
    ),
    defaults: {
      zoom: 2.88,
      lightAngle: 24,
      lightPower: 2.04,
      exposure: 0.42,
      rough: 0.24
    },
    model: {
      primaryUrl: "./seated_figure_middle_niger.glb",
      fallbackUrl: "./seated_figure_middle_niger.glb"
    },
    scene: {
      targetHeight: 0.72,
      focusYRatio: 0.52,
      defaultYaw: Math.PI * 0.05,
      defaultViewVector: [0.88, 0.36, 0.86],
      mobileViewVector: [0.74, 0.3, 0.76]
    }
  },
  "nkisi-power-figure": {
    kind: "gltf",
    path: "/sub-saharan-africa/nkisi-power-figure/",
    sectionId: "sub-saharan-africa",
    sortOrder: 19,
    viewerTitle: "Nkisi (power figure) (Kongo peoples, 19th-first half of 20th century)",
    subtitle: "Artist: Kongo artist and nganga (ritual specialist); The Metropolitan Museum of Art, The Michael C. Rockefeller Wing",
    medium: "Wood, pigment, resin, iron, brass, tin, cloth, plant fiber cord, beads, cowrie shells, bone or ivory, arrows, leather, seeds, animal horn",
    dimensions: "H. 23 1/8 x D. 10 1/4 x W. 10 in. (58.8 x 26 x 25.4 cm)",
    locationLabel: "Collection:",
    location: "The Michael C. Rockefeller Wing, The Metropolitan Museum of Art",
    culture: "Kongo peoples",
    region: "Sub-Saharan Africa",
    period: "19th-first half of 20th century",
    current_location: "The Michael C. Rockefeller Wing, The Metropolitan Museum of Art",
    findspot_or_origin: "Democratic Republic of the Congo",
    scan_source: "The Met 3D / VNTANA",
    mesh_format: "GLB",
    tags: ["Kongo peoples", "Democratic Republic of the Congo", "Wood", "Power figure", "The Met"],
    lobbyMeta: "Source: The Met 3D / The Michael C. Rockefeller Wing",
    source: source(
      "Rendered from The Metropolitan Museum of Art's 3D model of Nkisi (power figure).",
      [
        link("Met object page", "https://www.metmuseum.org/art/collection/search/312342"),
        link("Original GLB", "https://api.vntana.com/assets/products/c011dd9b-9a46-486c-bbe5-89178949c489/organizations/The-Metropolitan-Museum-of-Art/clients/masters/2138972c-82b7-4811-8b01-143640629837.glb")
      ],
      "The title, date, culture, medium, dimensions, collection, and place of origin follow The Met collection record."
    ),
    defaults: {
      zoom: 2.84,
      lightAngle: 24,
      lightPower: 2.02,
      exposure: 0.42,
      rough: 0.24
    },
    model: {
      primaryUrl: "./nkisi_power_figure.glb",
      fallbackUrl: "./nkisi_power_figure.glb"
    },
    scene: {
      targetHeight: 1.02,
      focusYRatio: 0.56,
      defaultYaw: Math.PI * 0.04,
      defaultViewVector: [0.96, 0.46, 1.0],
      mobileViewVector: [0.78, 0.36, 0.88]
    }
  },
  haliphat: {
    kind: "gltf",
    path: "/palmyra/haliphat/index.html",
    sectionId: "roman-world",
    sortOrder: 115,
    viewerTitle: "Funerary Relief Bust of Haliphat (Palmyra, 231 CE)",
    subtitle: "Freer Gallery of Art collection; Aramaic inscription identifies Haliphat and dates the bust to 231 CE",
    medium: "Limestone",
    dimensions: "H: 60.1 cm | W: 55.3 cm | D: 23 cm",
    locationLabel: "Origin:",
    location: "Palmyra, Homs, Syria",
    current_location: "Freer Gallery of Art, Smithsonian Institution",
    findspot_or_origin: "Palmyra, Homs, Syria",
    license: "Usage conditions apply",
    mesh_format: "GLB",
    tags: ["Palmyra", "Syria", "Roman world", "funerary bust", "limestone"],
    lobbyMeta: "Source: Smithsonian 3D / Freer Gallery of Art",
    source: source(
      "Rendered from Smithsonian 3D's funerary relief bust of Haliphat, a Palmyrene limestone bust in the Freer Gallery of Art collection.",
      [
        link("Smithsonian 3D record", "https://3d.si.edu/object/3d/funerary-relief-bust%3A7bc195a7-385f-43be-93c8-79a6bb46ff4b"),
        link("Media metadata", "https://ids.si.edu/ids/media_view?id=3d_package%3A7bc195a7-385f-43be-93c8-79a6bb46ff4b&format=text"),
        link("Original GLB", "https://3d-api.si.edu/content/document/3d_package:7bc195a7-385f-43be-93c8-79a6bb46ff4b/resources/funerary-relief-bust-of-haliphat-150k-4096.glb")
      ],
      "Smithsonian lists usage conditions apply. Origin, inscription date, medium, and dimensions follow the Smithsonian record."
    ),
    defaults: {
      zoom: 2.92,
      lightAngle: 24,
      lightPower: 2.02,
      exposure: 0.42,
      rough: 0.24
    },
    model: {
      primaryUrl: "./haliphat_source.glb",
      fallbackUrl: "./haliphat_source.glb"
    },
    scene: {
      targetHeight: 1.04,
      defaultYaw: Math.PI * 0.04,
      defaultViewVector: [0.96, 0.52, 1.1],
      mobileViewVector: [0.78, 0.4, 0.98]
    }
  },
  "narcissus-and-echo-puteal": {
    kind: "gltf",
    path: "/narcissus-and-echo-puteal/",
    sectionId: "roman-world",
    sortOrder: 115.5,
    viewerTitle: "Puteal with Narcissus and Echo, and Hylas and the Nymphs (Roman, 2nd century)",
    subtitle: "Artist: Unknown Roman sculptor",
    medium: "Marble",
    dimensions: "Height: 40 15/16 in. (104 cm) | Diameter: 26 3/8 in. (67 cm)",
    locationLabel: "On view:",
    location: "Gallery 162, The Metropolitan Museum of Art",
    culture: "Roman",
    region: "Roman world",
    period: "Antonine or Severan",
    current_location: "Gallery 162, The Metropolitan Museum of Art",
    scan_source: "The Met 3D / VNTANA",
    mesh_format: "GLB",
    tags: ["Roman", "Marble", "Narcissus", "Echo", "The Met"],
    lobbyMeta: "Source: The Met 3D / Department of Greek and Roman Art",
    source: source(
      "Rendered from The Metropolitan Museum of Art's 3D model of Puteal with Narcissus and Echo, and Hylas and the Nymphs.",
      [
        link("Met object page", "https://www.metmuseum.org/art/collection/search/775805"),
        link("Original GLB", "https://api.vntana.com/assets/products/b6d09950-3eec-4bb1-94a1-1fb77fe4c73d/organizations/The-Metropolitan-Museum-of-Art/clients/masters/eddda0f3-c593-4c79-9f4e-fbb45c16026b.glb")
      ],
      "The title, date, culture, period, medium, dimensions, department, and gallery location follow The Met collection record."
    ),
    defaults: {
      zoom: 2.88,
      lightAngle: 24,
      lightPower: 2.02,
      exposure: 0.42,
      rough: 0.24
    },
    model: {
      primaryUrl: "./narcissus_and_echo_puteal.glb",
      fallbackUrl: "./narcissus_and_echo_puteal.glb"
    },
    scene: {
      targetHeight: 0.96,
      focusYRatio: 0.54,
      defaultYaw: Math.PI * 0.06,
      defaultViewVector: [0.96, 0.44, 1.04],
      mobileViewVector: [0.78, 0.34, 0.92]
    }
  },
  "house-model-nayarit": {
    kind: "gltf",
    path: "/americas/house-model-nayarit/",
    sectionId: "americas",
    sortOrder: 64,
    viewerTitle: "House model (Nayarit, 200 BCE-300 CE)",
    subtitle: "Artist: Nayarit artist(s); The Metropolitan Museum of Art, The Michael C. Rockefeller Wing",
    medium: "Ceramic, slip",
    dimensions: "H. 11 15/16 x W. 8 5/8 x D. 6 1/8 in. (30.3 x 21.9 x 15.5 cm)",
    locationLabel: "Displayed / held:",
    location: "The Michael C. Rockefeller Wing, The Metropolitan Museum of Art",
    culture: "Nayarit",
    region: "Americas",
    period: "200 BCE-300 CE",
    current_location: "The Michael C. Rockefeller Wing, The Metropolitan Museum of Art",
    findspot_or_origin: "West Mexico",
    scan_source: "The Met 3D / VNTANA",
    mesh_format: "GLB",
    tags: ["Nayarit", "West Mexico", "Ceramic", "House model", "The Met"],
    lobbyMeta: "Source: The Met 3D / The Michael C. Rockefeller Wing",
    source: source(
      "Rendered from The Metropolitan Museum of Art's 3D model of House model.",
      [
        link("Met object page", "https://www.metmuseum.org/art/collection/search/312581"),
        link("Original GLB", "https://api.vntana.com/assets/products/c8f3cfa5-8f7f-473b-9f13-418005d90d86/organizations/The-Metropolitan-Museum-of-Art/clients/masters/f75b3b2c-06b7-4c11-aa9c-6ec74c29fc4d.glb")
      ],
      "The title, date, artist attribution, culture, medium, dimensions, collection, and place of origin follow The Met collection record."
    ),
    defaults: {
      zoom: 2.88,
      lightAngle: 24,
      lightPower: 2.04,
      exposure: 0.42,
      rough: 0.24
    },
    model: {
      primaryUrl: "./house_model.glb",
      fallbackUrl: "./house_model.glb"
    },
    scene: {
      targetHeight: 0.86,
      focusYRatio: 0.54,
      defaultYaw: Math.PI * 0.04,
      defaultViewVector: [0.94, 0.44, 0.96],
      mobileViewVector: [0.78, 0.34, 0.86]
    }
  },
  "male-pombia-figure": {
    kind: "gltf",
    path: "/sub-saharan-africa/male-pombia-figure/",
    sectionId: "sub-saharan-africa",
    sortOrder: 21,
    viewerTitle: "Male pombia (child of Poro) figure (Senufo peoples, 19th-mid-20th century)",
    subtitle: "Artist: Tyebara-Senufo artist; The Metropolitan Museum of Art, The Michael C. Rockefeller Wing",
    medium: "Wood",
    dimensions: "H. 42 1/2 x W. 8 13/16 x D. 10 1/2 in. (108 x 22.4 x 26.7 cm)",
    locationLabel: "Displayed / held:",
    location: "The Michael C. Rockefeller Wing, The Metropolitan Museum of Art",
    culture: "Senufo peoples, Tyebara group",
    region: "Sub-Saharan Africa",
    period: "19th-mid-20th century",
    current_location: "The Michael C. Rockefeller Wing, The Metropolitan Museum of Art",
    findspot_or_origin: "Cote d'Ivoire",
    scan_source: "The Met 3D / VNTANA",
    mesh_format: "GLB",
    tags: ["Senufo peoples", "Tyebara group", "Cote d'Ivoire", "Wood", "The Met", "Figure"],
    lobbyMeta: "Source: The Met 3D / The Michael C. Rockefeller Wing",
    source: source(
      "Rendered from The Metropolitan Museum of Art's 3D model of Male pombia (child of Poro) figure.",
      [
        link("Met object page", "https://www.metmuseum.org/art/collection/search/310758"),
        link("Original GLB", "https://api.vntana.com/assets/products/34182e49-a89a-4a03-8ac5-57ef7483de8e/organizations/The-Metropolitan-Museum-of-Art/clients/masters/2599f344-d81c-4b69-822f-eb5c1e3ccd51.glb")
      ],
      "The title, date, artist attribution, culture, medium, dimensions, collection, and place of origin follow The Met collection record."
    ),
    defaults: {
      zoom: 2.9,
      lightAngle: 24,
      lightPower: 2.04,
      exposure: 0.42,
      rough: 0.24
    },
    model: {
      primaryUrl: "./male_pombia_figure.glb",
      fallbackUrl: "./male_pombia_figure.glb"
    },
    scene: {
      targetHeight: 1.18,
      focusYRatio: 0.56,
      defaultYaw: Math.PI * 0.04,
      defaultViewVector: [0.98, 0.48, 1.02],
      mobileViewVector: [0.8, 0.38, 0.9]
    }
  },
  ...metBatchPieces
};
