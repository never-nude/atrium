function link(label, url) {
  return { label, url };
}

function source(summary, links = [], note = "") {
  return { summary, links, note };
}

const MET_DEFAULTS = {
  zoom: 2.88,
  lightAngle: 24,
  lightPower: 2.04,
  exposure: 0.42,
  rough: 0.24
};

const MET_SCENE_PRESETS = {
  head: {
    targetHeight: 0.82,
    focusYRatio: 0.56,
    defaultYaw: Math.PI * 0.05,
    defaultViewVector: [0.84, 0.34, 0.84],
    mobileViewVector: [0.68, 0.26, 0.74]
  },
  figure: {
    targetHeight: 0.96,
    focusYRatio: 0.56,
    defaultYaw: Math.PI * 0.05,
    defaultViewVector: [0.96, 0.46, 1.02],
    mobileViewVector: [0.78, 0.34, 0.9]
  },
  compact: {
    targetHeight: 0.86,
    focusYRatio: 0.54,
    defaultYaw: Math.PI * 0.04,
    defaultViewVector: [0.92, 0.4, 0.96],
    mobileViewVector: [0.76, 0.32, 0.84]
  },
  relief: {
    targetHeight: 0.92,
    focusYRatio: 0.54,
    defaultYaw: Math.PI * 0.06,
    defaultViewVector: [0.92, 0.42, 1.04],
    mobileViewVector: [0.74, 0.34, 0.92]
  },
  wide: {
    targetHeight: 0.82,
    focusYRatio: 0.5,
    defaultYaw: Math.PI * 0.04,
    defaultViewVector: [0.96, 0.4, 1.28],
    mobileViewVector: [0.78, 0.34, 1.08]
  },
  tall: {
    targetHeight: 1.18,
    focusYRatio: 0.56,
    defaultYaw: Math.PI * 0.04,
    defaultViewVector: [0.98, 0.56, 1.08],
    mobileViewVector: [0.8, 0.42, 0.96]
  }
};

function metSource(title, objectUrl, originalGlbUrl, note) {
  return source(
    `Rendered from The Metropolitan Museum of Art's 3D model of ${title}.`,
    [
      link("Met object page", objectUrl),
      link("Original GLB", originalGlbUrl)
    ],
    note
  );
}

export const metBatchPieces = {
  "opo-veranda-post-olowe": {
    kind: "gltf",
    path: "/sub-saharan-africa/opo-veranda-post-olowe/",
    sectionId: "sub-saharan-africa",
    sortOrder: 26,
    viewerTitle: "Òpó (veranda post) with equestrian and female figure (Yoruba peoples, before 1938)",
    subtitle: "Artist: Olowe of Ise (ca. 1873-1938)",
    medium: "Iroko wood, paint, resin",
    dimensions: "H. 71 x W. 11 1/4 x D. 14 in. (180.3 x 28.6 x 35.6 cm)",
    locationLabel: "Displayed / held:",
    location: "The Michael C. Rockefeller Wing, The Metropolitan Museum of Art",
    culture: "Yoruba peoples",
    region: "Sub-Saharan Africa",
    current_location: "The Michael C. Rockefeller Wing, The Metropolitan Museum of Art",
    findspot_or_origin: "Efon-Alaaye region, Nigeria",
    scan_source: "The Met 3D / VNTANA",
    mesh_format: "GLB",
    tags: ["Yoruba peoples", "Sub-Saharan Africa", "Nigeria", "Iroko wood", "The Met"],
    lobbyMeta: "Source: The Met 3D / The Michael C. Rockefeller Wing",
    source: metSource(
      "Òpó (veranda post) with equestrian and female figure",
      "https://www.metmuseum.org/art/collection/search/317823",
      "https://api.vntana.com/assets/products/4554ec62-382b-47ee-9f03-d7f907d13422/organizations/The-Metropolitan-Museum-of-Art/clients/masters/de8be35f-11e7-4b4e-974e-76315ac7604d.glb",
      "The title, date, maker attribution, medium, dimensions, and location details follow The Met collection record."
    ),
    defaults: MET_DEFAULTS,
    model: {
      primaryUrl: "./opo_veranda_post_olowe.glb",
      fallbackUrl: "./opo_veranda_post_olowe.glb"
    },
    scene: MET_SCENE_PRESETS.tall
  },
  "zemi-cohoba-stand": {
    kind: "gltf",
    path: "/americas/zemi-cohoba-stand/",
    sectionId: "americas",
    sortOrder: 65,
    viewerTitle: "Zemí cohoba stand (Taíno, ca. 1000 CE)",
    subtitle: "Artist: Taíno artist(s)",
    medium: "Guaiacum wood, shell",
    dimensions: "H. 27 x  W. 8 5/8 x  D. 9 1/8 in. (68.5 x 21.9 x 23.2cm)",
    locationLabel: "Displayed / held:",
    location: "The Michael C. Rockefeller Wing, The Metropolitan Museum of Art",
    culture: "Taíno",
    region: "Caribbean",
    current_location: "The Michael C. Rockefeller Wing, The Metropolitan Museum of Art",
    findspot_or_origin: "Caribbean, Dominican Republic (?)",
    scan_source: "The Met 3D / VNTANA",
    mesh_format: "GLB",
    tags: ["Taíno", "Caribbean", "Dominican Republic", "Guaiacum wood", "The Met"],
    lobbyMeta: "Source: The Met 3D / The Michael C. Rockefeller Wing",
    source: metSource(
      "Zemí cohoba stand",
      "https://www.metmuseum.org/art/collection/search/312602",
      "https://api.vntana.com/assets/products/a6c1e46d-e9ac-485e-aec5-419fa1aec77a/organizations/The-Metropolitan-Museum-of-Art/clients/masters/0c8908ce-5a17-401f-b941-7cf565221bf9.glb",
      "The title, date, maker attribution, medium, dimensions, and location details follow The Met collection record."
    ),
    defaults: MET_DEFAULTS,
    model: {
      primaryUrl: "./zemi_cohoba_stand.glb",
      fallbackUrl: "./zemi_cohoba_stand.glb"
    },
    scene: MET_SCENE_PRESETS.figure
  },
  "bisj-ancestor-pole-omadesep": {
    kind: "gltf",
    path: "/americas/bisj-ancestor-pole-omadesep/",
    sectionId: "americas",
    sortOrder: 76,
    viewerTitle: "bisj (ancestor pole) (Asmat people, late 1950s)",
    subtitle: "Artist: Asmat artist(s)",
    medium: "Wood, paint, fiber, sago palm leaves",
    dimensions: "H. 18 ft. × W. 39 in. × D. 63 in. (548.6 × 99.1 × 160 cm)",
    locationLabel: "Displayed / held:",
    location: "The Michael C. Rockefeller Wing, The Metropolitan Museum of Art",
    culture: "Asmat people",
    region: "Oceania",
    current_location: "The Michael C. Rockefeller Wing, The Metropolitan Museum of Art",
    findspot_or_origin: "Omadesep village, Indonesia",
    scan_source: "The Met 3D / VNTANA",
    mesh_format: "GLB",
    tags: ["Asmat people", "Oceania", "Indonesia", "Wood", "The Met"],
    lobbyMeta: "Source: The Met 3D / The Michael C. Rockefeller Wing",
    source: metSource(
      "bisj (ancestor pole)",
      "https://www.metmuseum.org/art/collection/search/313830",
      "https://api.vntana.com/assets/products/1095769e-7f2a-4981-84f6-ff46f3caf2bf/organizations/The-Metropolitan-Museum-of-Art/clients/masters/32bd2928-486b-42cb-99e0-8a1461c116ef.glb",
      "The title, date, maker attribution, medium, dimensions, and location details follow The Met collection record."
    ),
    defaults: MET_DEFAULTS,
    model: {
      primaryUrl: "./bisj_ancestor_pole_omadesep.glb",
      fallbackUrl: "./bisj_ancestor_pole_omadesep.glb"
    },
    scene: MET_SCENE_PRESETS.tall
  },
  "head-of-a-ruler": {
    kind: "gltf",
    path: "/head-of-a-ruler/",
    sectionId: "egypt-mesopotamia",
    sortOrder: 12.15,
    viewerTitle: "Head of a ruler (ca. 2300–2000 BCE)",
    subtitle: "Artist: Unknown Mesopotamian sculptor",
    medium: "Copper alloy",
    dimensions: "13 9/16 × 8 3/8 × 9 3/16 in. (34.4 × 21.3 × 23.3 cm)",
    locationLabel: "Collection:",
    location: "The Metropolitan Museum of Art",
    region: "Mesopotamia",
    current_location: "The Metropolitan Museum of Art",
    findspot_or_origin: "Mesopotamia",
    scan_source: "The Met 3D / VNTANA",
    mesh_format: "GLB",
    tags: ["Mesopotamia", "Copper alloy", "The Met"],
    lobbyMeta: "Source: The Met 3D / Department of Ancient West Asian Art",
    source: metSource(
      "Head of a ruler",
      "https://www.metmuseum.org/art/collection/search/329077",
      "https://api.vntana.com/assets/products/f9d68472-2236-46d0-ae28-748fc01c9277/organizations/The-Metropolitan-Museum-of-Art/clients/masters/16cdf721-59f1-4308-aac9-c34c087ddee1.glb",
      "The title, date, maker attribution, medium, dimensions, and location details follow The Met collection record."
    ),
    defaults: MET_DEFAULTS,
    model: {
      primaryUrl: "./head_of_a_ruler.glb",
      fallbackUrl: "./head_of_a_ruler.glb"
    },
    scene: MET_SCENE_PRESETS.head
  },
  "head-of-gudea": {
    kind: "gltf",
    path: "/head-of-gudea/",
    sectionId: "egypt-mesopotamia",
    sortOrder: 12.16,
    viewerTitle: "Head of Gudea (Neo-Sumerian, ca. 2090 BCE)",
    subtitle: "Artist: Unknown Neo-Sumerian sculptor",
    medium: "Diorite",
    dimensions: "H. 10 1/16 x W. 7 9/16 x D. 9 15/16 in. (25.5 x 19.2 x 25.3 cm)",
    locationLabel: "Collection:",
    location: "The Metropolitan Museum of Art",
    culture: "Neo-Sumerian",
    region: "Mesopotamia",
    period: "ca. 2090 BCE",
    current_location: "The Metropolitan Museum of Art",
    scan_source: "The Met 3D / VNTANA",
    mesh_format: "GLB",
    tags: ["Neo-Sumerian", "Mesopotamia", "Diorite", "The Met", "Gudea"],
    lobbyMeta: "Source: The Met 3D / Department of Ancient West Asian Art",
    source: metSource(
      "Head of Gudea",
      "https://www.metmuseum.org/art/collection/search/324061",
      "https://api.vntana.com/assets/products/15542420-b22b-41e5-a19f-24422a6db8f7/organizations/The-Metropolitan-Museum-of-Art/clients/masters/a8519968-ffad-47aa-b55d-d3335db1c215.glb",
      "The title, date, culture, medium, dimensions, and collection location follow The Met collection record."
    ),
    defaults: MET_DEFAULTS,
    model: {
      primaryUrl: "./head_of_gudea.glb",
      fallbackUrl: "./head_of_gudea.glb"
    },
    scene: MET_SCENE_PRESETS.head
  },
  "figure-of-a-man-with-an-oryx": {
    kind: "gltf",
    path: "/figure-of-a-man-with-an-oryx/",
    sectionId: "egypt-mesopotamia",
    sortOrder: 12.18,
    viewerTitle: "Figure of a man with an oryx, a monkey, and a leopard skin (Assyrian, ca. 8th century BCE)",
    subtitle: "Artist: Unknown Assyrian sculptor",
    medium: "Ivory",
    dimensions: "H. 5 5/16 x W. 3in. (13.5 x 7.6cm)",
    locationLabel: "Collection:",
    location: "The Metropolitan Museum of Art",
    culture: "Assyrian",
    region: "Mesopotamia",
    current_location: "The Metropolitan Museum of Art",
    findspot_or_origin: "Mesopotamia",
    scan_source: "The Met 3D / VNTANA",
    mesh_format: "GLB",
    tags: ["Assyrian", "Mesopotamia", "Ivory", "The Met"],
    lobbyMeta: "Source: The Met 3D / Department of Ancient West Asian Art",
    source: metSource(
      "Figure of a man with an oryx, a monkey, and a leopard skin",
      "https://www.metmuseum.org/art/collection/search/325089",
      "https://api.vntana.com/assets/products/5e5a3936-505b-4681-a57d-463627cdde44/organizations/The-Metropolitan-Museum-of-Art/clients/masters/6b85636b-521d-47df-a011-caef2d04a603.glb",
      "The title, date, maker attribution, medium, dimensions, and location details follow The Met collection record."
    ),
    defaults: MET_DEFAULTS,
    model: {
      primaryUrl: "./figure_of_a_man_with_an_oryx.glb",
      fallbackUrl: "./figure_of_a_man_with_an_oryx.glb"
    },
    scene: MET_SCENE_PRESETS.figure
  },
  "head-of-a-male-or-female-figure": {
    kind: "gltf",
    path: "/head-of-a-male-or-female-figure/",
    sectionId: "egypt-mesopotamia",
    sortOrder: 12.22,
    viewerTitle: "Head of a male or female figure (Assyrian, ca. 9th–8th century BCE)",
    subtitle: "Artist: Unknown Assyrian sculptor",
    medium: "Ivory, Egyptian Blue",
    dimensions: "H. 3 7/16 x W. 3 9/16 x D. 2 1/8 in. (8.7 x 9 x 5.4 cm)",
    locationLabel: "Collection:",
    location: "The Metropolitan Museum of Art",
    culture: "Assyrian",
    region: "Mesopotamia",
    period: "Neo-Assyrian",
    current_location: "The Metropolitan Museum of Art",
    scan_source: "The Met 3D / VNTANA",
    mesh_format: "GLB",
    tags: ["Assyrian", "Mesopotamia", "Ivory", "Egyptian Blue", "The Met"],
    lobbyMeta: "Source: The Met 3D / Department of Ancient West Asian Art",
    source: metSource(
      "Head of a male or female figure",
      "https://www.metmuseum.org/art/collection/search/325563",
      "https://api.vntana.com/assets/products/003bf659-30db-45ce-b8e6-fb15a93182dc/organizations/The-Metropolitan-Museum-of-Art/clients/masters/efb3e008-1541-43d5-ac21-083730ffd5d2.glb",
      "The title, date, culture, medium, dimensions, and collection location follow The Met collection record."
    ),
    defaults: MET_DEFAULTS,
    model: {
      primaryUrl: "./head_of_a_male_or_female_figure.glb",
      fallbackUrl: "./head_of_a_male_or_female_figure.glb"
    },
    scene: MET_SCENE_PRESETS.head
  },
  "head-of-a-female-or-goddess-wearing-a-necklace": {
    kind: "gltf",
    path: "/head-of-a-female-or-goddess-wearing-a-necklace/",
    sectionId: "egypt-mesopotamia",
    sortOrder: 12.23,
    viewerTitle: "Head of a female or goddess wearing a necklace (Assyrian, ca. 9th–8th century BCE)",
    subtitle: "Artist: Unknown Assyrian sculptor",
    medium: "Ivory, gold",
    dimensions: "5 3/8 x 3 3/16 x 1 15/16 in. (13.6 x 8.1 x 5 cm)",
    locationLabel: "Collection:",
    location: "The Metropolitan Museum of Art",
    culture: "Assyrian",
    region: "Mesopotamia",
    period: "Neo-Assyrian",
    current_location: "The Metropolitan Museum of Art",
    scan_source: "The Met 3D / VNTANA",
    mesh_format: "GLB",
    tags: ["Assyrian", "Mesopotamia", "Ivory", "Gold", "The Met"],
    lobbyMeta: "Source: The Met 3D / Department of Ancient West Asian Art",
    source: metSource(
      "Head of a female or goddess wearing a necklace",
      "https://www.metmuseum.org/art/collection/search/324323",
      "https://api.vntana.com/assets/products/46825ae5-3a9b-4e60-8292-0aec78bde78d/organizations/The-Metropolitan-Museum-of-Art/clients/masters/fb6e338b-3db1-4815-b6c8-953dd56fe3b4.glb",
      "The title, date, culture, medium, dimensions, and collection location follow The Met collection record."
    ),
    defaults: MET_DEFAULTS,
    model: {
      primaryUrl: "./head_of_a_female_or_goddess_wearing_a_necklace.glb",
      fallbackUrl: "./head_of_a_female_or_goddess_wearing_a_necklace.glb"
    },
    scene: MET_SCENE_PRESETS.head
  },
  "female-figure-with-raised-arm": {
    kind: "gltf",
    path: "/sub-saharan-africa/female-figure-with-raised-arm/",
    sectionId: "sub-saharan-africa",
    sortOrder: 22,
    viewerTitle: "Female figure with raised arm (Tellem civilization (?), 15th–16th century)",
    subtitle: "Artist: Tellem blacksmith",
    medium: "Wood (Moraceae family), applied organic materials",
    dimensions: "H. 17 5/8 × W. 3 1/4 × D. 4 7/8 in. (44.8 × 8.3 × 12.4 cm)",
    locationLabel: "Displayed / held:",
    location: "The Michael C. Rockefeller Wing, The Metropolitan Museum of Art",
    culture: "Tellem civilization (?)",
    region: "Sub-Saharan Africa",
    current_location: "The Michael C. Rockefeller Wing, The Metropolitan Museum of Art",
    findspot_or_origin: "Ireli, Mali",
    scan_source: "The Met 3D / VNTANA",
    mesh_format: "GLB",
    tags: ["Tellem civilization", "Sub-Saharan Africa", "Mali", "Wood (Moraceae family)", "The Met"],
    lobbyMeta: "Source: The Met 3D / The Michael C. Rockefeller Wing",
    source: metSource(
      "Female figure with raised arm",
      "https://www.metmuseum.org/art/collection/search/312268",
      "https://api.vntana.com/assets/products/cba47132-771c-439f-bf6f-ac8870a9ac1b/organizations/The-Metropolitan-Museum-of-Art/clients/masters/8d227cef-e587-4357-8cbd-d2e1b583626d.glb",
      "The title, date, maker attribution, medium, dimensions, and location details follow The Met collection record."
    ),
    defaults: MET_DEFAULTS,
    model: {
      primaryUrl: "./female_figure_with_raised_arm.glb",
      fallbackUrl: "./female_figure_with_raised_arm.glb"
    },
    scene: MET_SCENE_PRESETS.figure
  },
  "body-mask-asmat": {
    kind: "gltf",
    path: "/americas/body-mask-asmat/",
    sectionId: "americas",
    sortOrder: 70,
    viewerTitle: "Body mask (Asmat people, mid-20th century)",
    subtitle: "Artist: Asmat artist(s)",
    medium: "Mulberry fiber, rattan, sago palm leaves, wood, pigment",
    dimensions: "H. 67 in. × W. 34 1/2 in. × D. 29 in. (170.2 × 87.6 × 73.7 cm)",
    locationLabel: "Displayed / held:",
    location: "The Michael C. Rockefeller Wing, The Metropolitan Museum of Art",
    culture: "Asmat people",
    region: "Oceania",
    current_location: "The Michael C. Rockefeller Wing, The Metropolitan Museum of Art",
    findspot_or_origin: "Ambisu village, Indonesia",
    scan_source: "The Met 3D / VNTANA",
    mesh_format: "GLB",
    tags: ["Asmat people", "Oceania", "Indonesia", "Mulberry fiber", "The Met"],
    lobbyMeta: "Source: The Met 3D / The Michael C. Rockefeller Wing",
    source: metSource(
      "Body mask",
      "https://www.metmuseum.org/art/collection/search/311745",
      "https://api.vntana.com/assets/products/67ea601c-9164-476c-b9c1-0ee822cac8ce/organizations/The-Metropolitan-Museum-of-Art/clients/masters/ed410885-4465-4a22-9e30-75393cd9a0b5.glb",
      "The title, date, maker attribution, medium, dimensions, and location details follow The Met collection record."
    ),
    defaults: MET_DEFAULTS,
    model: {
      primaryUrl: "./body_mask_asmat.glb",
      fallbackUrl: "./body_mask_asmat.glb"
    },
    scene: MET_SCENE_PRESETS.figure
  },
  "headdress-effigy-hareiga": {
    kind: "gltf",
    path: "/americas/headdress-effigy-hareiga/",
    sectionId: "americas",
    sortOrder: 71,
    viewerTitle: "Headdress Effigy (Hareiga) (Chachet Baining people, late 19th–early 20th century)",
    subtitle: "Artist: Unknown Chachet Baining sculptor",
    medium: "Barkcloth, paint, bamboo, leaves",
    dimensions: "H. 15 ft. × W. 30 in. × D. 36 in. (457.2 × 76.2 × 91.4 cm)",
    locationLabel: "Displayed / held:",
    location: "The Michael C. Rockefeller Wing, The Metropolitan Museum of Art",
    culture: "Chachet Baining people",
    region: "Oceania",
    current_location: "The Michael C. Rockefeller Wing, The Metropolitan Museum of Art",
    findspot_or_origin: "Papua New Guinea",
    scan_source: "The Met 3D / VNTANA",
    mesh_format: "GLB",
    tags: ["Chachet Baining people", "Oceania", "Papua New Guinea", "Barkcloth", "The Met"],
    lobbyMeta: "Source: The Met 3D / The Michael C. Rockefeller Wing",
    source: metSource(
      "Headdress Effigy (Hareiga)",
      "https://www.metmuseum.org/art/collection/search/311935",
      "https://api.vntana.com/assets/products/da28d059-0ca9-4052-9218-9c5c5df07d31/organizations/The-Metropolitan-Museum-of-Art/clients/masters/78e30f3a-69ee-48dc-8040-db485d4ef7a1.glb",
      "The title, date, maker attribution, medium, dimensions, and location details follow The Met collection record."
    ),
    defaults: MET_DEFAULTS,
    model: {
      primaryUrl: "./headdress_effigy_hareiga.glb",
      fallbackUrl: "./headdress_effigy_hareiga.glb"
    },
    scene: MET_SCENE_PRESETS.figure
  },
  "village-scene-nayarit": {
    kind: "gltf",
    path: "/americas/village-scene-nayarit/",
    sectionId: "americas",
    sortOrder: 66,
    viewerTitle: "Village scene (Nayarit, 300 BCE–300 CE)",
    subtitle: "Artist: Nayarit artist(s)",
    medium: "Ceramic, slip",
    dimensions: "H. 6 1/4 × Diam. 8 in. (15.9 × 20.3 cm)",
    locationLabel: "Displayed / held:",
    location: "The Michael C. Rockefeller Wing, The Metropolitan Museum of Art",
    culture: "Nayarit",
    region: "Americas",
    current_location: "The Michael C. Rockefeller Wing, The Metropolitan Museum of Art",
    findspot_or_origin: "West Mexico, Mexico",
    scan_source: "The Met 3D / VNTANA",
    mesh_format: "GLB",
    tags: ["Nayarit", "Americas", "Mexico", "Ceramic", "The Met"],
    lobbyMeta: "Source: The Met 3D / The Michael C. Rockefeller Wing",
    source: metSource(
      "Village scene",
      "https://www.metmuseum.org/art/collection/search/317599",
      "https://api.vntana.com/assets/products/d0e3251c-445c-4c45-87d2-e1d3065ec5ce/organizations/The-Metropolitan-Museum-of-Art/clients/masters/69a4a48a-2279-4b04-a889-cf44e24aeccb.glb",
      "The title, date, maker attribution, medium, dimensions, and location details follow The Met collection record."
    ),
    defaults: MET_DEFAULTS,
    model: {
      primaryUrl: "./village_scene_nayarit.glb",
      fallbackUrl: "./village_scene_nayarit.glb"
    },
    scene: MET_SCENE_PRESETS.compact
  },
  "female-figure-inyai-ewa": {
    kind: "gltf",
    path: "/americas/female-figure-inyai-ewa/",
    sectionId: "americas",
    sortOrder: 72,
    viewerTitle: "Female Figure (Inyai-Ewa people, 16th–19th century)",
    subtitle: "Artist: Unknown Inyai-Ewa sculptor",
    medium: "Wood",
    dimensions: "H. 67 in. × W. 16 1/2 in. × D. 5 in. (170.2 × 41.9 × 12.7 cm)\r\nOther: 16 in. × 2 1/2 in. (40.6 × 6.4 cm)\r\nD. 9 in with mount",
    locationLabel: "Displayed / held:",
    location: "The Michael C. Rockefeller Wing, The Metropolitan Museum of Art",
    culture: "Inyai-Ewa people",
    region: "Oceania",
    current_location: "The Michael C. Rockefeller Wing, The Metropolitan Museum of Art",
    findspot_or_origin: "Papua New Guinea",
    scan_source: "The Met 3D / VNTANA",
    mesh_format: "GLB",
    tags: ["Inyai-Ewa people", "Oceania", "Papua New Guinea", "Wood", "The Met"],
    lobbyMeta: "Source: The Met 3D / The Michael C. Rockefeller Wing",
    source: metSource(
      "Female Figure",
      "https://www.metmuseum.org/art/collection/search/311327",
      "https://api.vntana.com/assets/products/ff972cce-b276-4b8d-8351-cd7add9def5d/organizations/The-Metropolitan-Museum-of-Art/clients/masters/88ff1947-96ab-4731-9fad-4004109ff11f.glb",
      "The title, date, maker attribution, medium, dimensions, and location details follow The Met collection record."
    ),
    defaults: MET_DEFAULTS,
    model: {
      primaryUrl: "./female_figure_inyai_ewa.glb",
      fallbackUrl: "./female_figure_inyai_ewa.glb"
    },
    scene: MET_SCENE_PRESETS.figure
  },
  "ngya-commemorative-post": {
    kind: "gltf",
    path: "/sub-saharan-africa/ngya-commemorative-post/",
    sectionId: "sub-saharan-africa",
    sortOrder: 23,
    viewerTitle: "Ngya (commemorative post) (Bongo, late 19th century)",
    subtitle: "Artist: Bongo artist",
    medium: "Mahogany",
    dimensions: "H. 75 1/2 × W. (approx.)  9 1/2 × D. 9 1/4 in. (191.8 × 24.1 × 23.5 cm)",
    locationLabel: "Displayed / held:",
    location: "The Michael C. Rockefeller Wing, The Metropolitan Museum of Art",
    culture: "Bongo",
    region: "Sub-Saharan Africa",
    current_location: "The Michael C. Rockefeller Wing, The Metropolitan Museum of Art",
    findspot_or_origin: "Tonj, western South Sudan",
    scan_source: "The Met 3D / VNTANA",
    mesh_format: "GLB",
    tags: ["Bongo", "Sub-Saharan Africa", "western South Sudan", "Mahogany", "The Met"],
    lobbyMeta: "Source: The Met 3D / The Michael C. Rockefeller Wing",
    source: metSource(
      "Ngya (commemorative post)",
      "https://www.metmuseum.org/art/collection/search/309909",
      "https://api.vntana.com/assets/products/df792a5c-abc7-4db6-a231-858cfd47eaf4/organizations/The-Metropolitan-Museum-of-Art/clients/masters/0525d5f3-238d-42f5-bb28-b57a955fee07.glb",
      "The title, date, maker attribution, medium, dimensions, and location details follow The Met collection record."
    ),
    defaults: MET_DEFAULTS,
    model: {
      primaryUrl: "./ngya_commemorative_post.glb",
      fallbackUrl: "./ngya_commemorative_post.glb"
    },
    scene: MET_SCENE_PRESETS.tall
  },
  "emperor-xiaowen-entourage-worshipping-buddha": {
    kind: "gltf",
    path: "/asia/emperor-xiaowen-entourage-worshipping-buddha/",
    sectionId: "asia",
    sortOrder: 24.5,
    viewerTitle: "Emperor Xiaowen and his entourage worshipping the Buddha (China, ca. 522–23)",
    subtitle: "Artist: Unknown Chinese sculptor",
    medium: "Limestone with traces of pigment",
    dimensions: "H. 82 in. (208.3 cm); W. 12 ft. 11 in. (393.7 cm)",
    locationLabel: "On view:",
    location: "Gallery 206, The Metropolitan Museum of Art",
    culture: "China",
    region: "Asia",
    current_location: "Gallery 206, The Metropolitan Museum of Art",
    scan_source: "The Met 3D / VNTANA",
    mesh_format: "GLB",
    tags: ["China", "Asia", "Limestone with traces of pigment", "The Met"],
    lobbyMeta: "Source: The Met 3D / Department of Asian Art",
    source: metSource(
      "Emperor Xiaowen and his entourage worshipping the Buddha",
      "https://www.metmuseum.org/art/collection/search/42707",
      "https://api.vntana.com/assets/products/1f14a35f-0eb5-4f5b-860d-b53a0786d8a7/organizations/The-Metropolitan-Museum-of-Art/clients/masters/91fb8c96-0386-4a01-9121-224c21bc6e17.glb",
      "The title, date, maker attribution, medium, dimensions, and location details follow The Met collection record."
    ),
    defaults: MET_DEFAULTS,
    model: {
      primaryUrl: "./emperor_xiaowen_entourage_worshipping_buddha.glb",
      fallbackUrl: "./emperor_xiaowen_entourage_worshipping_buddha.glb"
    },
    scene: MET_SCENE_PRESETS.relief
  },
  "house-model-nayarit-2015-306": {
    kind: "gltf",
    path: "/americas/house-model-nayarit-2015-306/",
    sectionId: "americas",
    sortOrder: 67,
    viewerTitle: "House model (Nayarit, 200 BCE-300 CE; 2015.306)",
    subtitle: "Artist: Nayarit artist(s)",
    medium: "Ceramic, slip",
    dimensions: "H. 12 × W. 10 × D. 6 3/4 in. (30.5 × 25.4 × 17.1 cm)",
    locationLabel: "Displayed / held:",
    location: "The Michael C. Rockefeller Wing, The Metropolitan Museum of Art",
    culture: "Nayarit",
    region: "Americas",
    current_location: "The Michael C. Rockefeller Wing, The Metropolitan Museum of Art",
    findspot_or_origin: "Mexico",
    scan_source: "The Met 3D / VNTANA",
    mesh_format: "GLB",
    tags: ["Nayarit", "Americas", "Mexico", "Ceramic", "The Met"],
    lobbyMeta: "Source: The Met 3D / The Michael C. Rockefeller Wing",
    source: metSource(
      "House model",
      "https://www.metmuseum.org/art/collection/search/319227",
      "https://api.vntana.com/assets/products/d9839ca6-5dd2-4907-a81c-7944760c0f52/organizations/The-Metropolitan-Museum-of-Art/clients/masters/bdd03187-fdc6-486f-a9c7-016ee8c4b99c.glb",
      "The title, date, maker attribution, medium, dimensions, and location details follow The Met collection record."
    ),
    defaults: MET_DEFAULTS,
    model: {
      primaryUrl: "./house_model_nayarit_2015_306.glb",
      fallbackUrl: "./house_model_nayarit_2015_306.glb"
    },
    scene: MET_SCENE_PRESETS.compact
  },
  "white-ogre-tihu-katsina-figure": {
    kind: "gltf",
    path: "/americas/white-ogre-tihu-katsina-figure/",
    sectionId: "americas",
    sortOrder: 69,
    viewerTitle: "White Ogre Tihu (Katsina Figure) (Hopi, Native American, ca. 1900)",
    subtitle: "Artist: Unknown Hopi sculptor",
    medium: "Cottonwood, pigment, cotton cloth, tanned leather, and metal",
    dimensions: "H. 18 1/2 × W. 6 × D. 7 in. (47 × 15.2 × 17.8 cm)",
    locationLabel: "On view:",
    location: "Gallery 746, The American Wing, The Metropolitan Museum of Art",
    culture: "Hopi, Native American",
    region: "Americas",
    current_location: "Gallery 746, The American Wing, The Metropolitan Museum of Art",
    findspot_or_origin: "United States",
    scan_source: "The Met 3D / VNTANA",
    mesh_format: "GLB",
    tags: ["Hopi, Native American", "Americas", "United States", "Cottonwood", "The Met"],
    lobbyMeta: "Source: The Met 3D / The American Wing",
    source: metSource(
      "White Ogre Tihu (Katsina Figure)",
      "https://www.metmuseum.org/art/collection/search/717591",
      "https://api.vntana.com/assets/products/fd102170-afd9-408e-a4d2-fd364c04d9d4/organizations/The-Metropolitan-Museum-of-Art/clients/masters/0e206cb4-eba9-4a0d-88f6-0ad3c4bb2b82.glb",
      "The title, date, maker attribution, medium, dimensions, and location details follow The Met collection record."
    ),
    defaults: MET_DEFAULTS,
    model: {
      primaryUrl: "./white_ogre_tihu_katsina_figure.glb",
      fallbackUrl: "./white_ogre_tihu_katsina_figure.glb"
    },
    scene: MET_SCENE_PRESETS.figure
  },
  "voussoir-472190": {
    kind: "gltf",
    path: "/voussoir-472190/",
    sectionId: "early-renaissance",
    sortOrder: 73.25,
    viewerTitle: "Voussoir (Catalan, ca. 1130–40)",
    subtitle: "Artist: Unknown Catalan sculptor",
    medium: "Marble",
    dimensions: "Overall: 8 1/4 x 17 3/4 x 7 1/2 in. (21 x 45.1 x 19.1 cm)",
    locationLabel: "On view:",
    location: "Gallery 007, The Cloisters, The Metropolitan Museum of Art",
    culture: "Catalan",
    region: "Europe",
    current_location: "Gallery 007, The Cloisters, The Metropolitan Museum of Art",
    findspot_or_origin: "present-day France",
    scan_source: "The Met 3D / VNTANA",
    mesh_format: "GLB",
    tags: ["Catalan", "Europe", "present-day France", "Marble", "The Met"],
    lobbyMeta: "Source: The Met 3D / The Cloisters",
    source: metSource(
      "Voussoir",
      "https://www.metmuseum.org/art/collection/search/472190",
      "https://api.vntana.com/assets/products/bf538074-4f5f-4c9d-8960-b37328ff9b09/organizations/The-Metropolitan-Museum-of-Art/clients/masters/1bd3f29a-83cf-4566-92f2-4031b30b9f1b.glb",
      "The title, date, maker attribution, medium, dimensions, and location details follow The Met collection record."
    ),
    defaults: MET_DEFAULTS,
    model: {
      primaryUrl: "./voussoir_472190.glb",
      fallbackUrl: "./voussoir_472190.glb"
    },
    scene: MET_SCENE_PRESETS.relief
  },
  "arch-keystone-470788": {
    kind: "gltf",
    path: "/arch-keystone-470788/",
    sectionId: "early-renaissance",
    sortOrder: 73.05,
    viewerTitle: "Arch Keystone (Catalan, ca. 1130–40)",
    subtitle: "Artist: Unknown Catalan sculptor",
    medium: "Marble",
    dimensions: "Overall: 16 x 21 x 7 3/4 in. (40.6 x 53.3 x 19.7 cm)",
    locationLabel: "On view:",
    location: "Gallery 007, The Cloisters, The Metropolitan Museum of Art",
    culture: "Catalan",
    region: "Europe",
    current_location: "Gallery 007, The Cloisters, The Metropolitan Museum of Art",
    findspot_or_origin: "present-day France",
    scan_source: "The Met 3D / VNTANA",
    mesh_format: "GLB",
    tags: ["Catalan", "Europe", "present-day France", "Marble", "The Met"],
    lobbyMeta: "Source: The Met 3D / The Cloisters",
    source: metSource(
      "Arch Keystone",
      "https://www.metmuseum.org/art/collection/search/470788",
      "https://api.vntana.com/assets/products/7654916a-5d6f-40c0-a140-6ed13e10e18f/organizations/The-Metropolitan-Museum-of-Art/clients/masters/71b1d1e5-217e-46b2-bc2a-b80640246197.glb",
      "The title, date, maker attribution, medium, dimensions, and location details follow The Met collection record."
    ),
    defaults: MET_DEFAULTS,
    model: {
      primaryUrl: "./arch_keystone_470788.glb",
      fallbackUrl: "./arch_keystone_470788.glb"
    },
    scene: MET_SCENE_PRESETS.relief
  },
  "corbel-25-120-599": {
    kind: "gltf",
    path: "/corbel-25-120-599/",
    sectionId: "early-renaissance",
    sortOrder: 73.1,
    viewerTitle: "Corbel (Catalan, ca. 1130-40; 25.120.599)",
    subtitle: "Artist: Unknown Catalan sculptor",
    medium: "Marble",
    dimensions: "Overall: 6 1/2 x 6 3/8 x 7 3/4 in. (16.5 x 16.2 x 19.7 cm)",
    locationLabel: "On view:",
    location: "Gallery 007, The Cloisters, The Metropolitan Museum of Art",
    culture: "Catalan",
    region: "Europe",
    current_location: "Gallery 007, The Cloisters, The Metropolitan Museum of Art",
    findspot_or_origin: "present-day France",
    scan_source: "The Met 3D / VNTANA",
    mesh_format: "GLB",
    tags: ["Catalan", "Europe", "present-day France", "Marble", "The Met"],
    lobbyMeta: "Source: The Met 3D / The Cloisters",
    source: metSource(
      "Corbel",
      "https://www.metmuseum.org/art/collection/search/470793",
      "https://api.vntana.com/assets/products/90e57970-4ac6-4fc3-b2be-925efbb04e37/organizations/The-Metropolitan-Museum-of-Art/clients/masters/d9506057-bbb4-4d96-8694-3c755d84beff.glb",
      "The title, date, maker attribution, medium, dimensions, and location details follow The Met collection record."
    ),
    defaults: MET_DEFAULTS,
    model: {
      primaryUrl: "./corbel_25_120_599.glb",
      fallbackUrl: "./corbel_25_120_599.glb"
    },
    scene: MET_SCENE_PRESETS.relief
  },
  "corbel-25-120-601": {
    kind: "gltf",
    path: "/corbel-25-120-601/",
    sectionId: "early-renaissance",
    sortOrder: 73.15,
    viewerTitle: "Corbel (Catalan, ca. 1130-40; 25.120.601)",
    subtitle: "Artist: Unknown Catalan sculptor",
    medium: "Marble",
    dimensions: "Overall: 6 3/4 x 6 1/4 x 13 1/2 in. (17.1 x 15.9 x 34.3 cm)",
    locationLabel: "On view:",
    location: "Gallery 007, The Cloisters, The Metropolitan Museum of Art",
    culture: "Catalan",
    region: "Europe",
    current_location: "Gallery 007, The Cloisters, The Metropolitan Museum of Art",
    findspot_or_origin: "present-day France",
    scan_source: "The Met 3D / VNTANA",
    mesh_format: "GLB",
    tags: ["Catalan", "Europe", "present-day France", "Marble", "The Met"],
    lobbyMeta: "Source: The Met 3D / The Cloisters",
    source: metSource(
      "Corbel",
      "https://www.metmuseum.org/art/collection/search/470795",
      "https://api.vntana.com/assets/products/247a9bae-88c3-42d3-911f-bcc8e7f4134a/organizations/The-Metropolitan-Museum-of-Art/clients/masters/1ea5e121-0a1a-4709-a88e-70ce01297e23.glb",
      "The title, date, maker attribution, medium, dimensions, and location details follow The Met collection record."
    ),
    defaults: MET_DEFAULTS,
    model: {
      primaryUrl: "./corbel_25_120_601.glb",
      fallbackUrl: "./corbel_25_120_601.glb"
    },
    scene: MET_SCENE_PRESETS.relief
  },
  "corbel-25-120-602": {
    kind: "gltf",
    path: "/corbel-25-120-602/",
    sectionId: "early-renaissance",
    sortOrder: 73.2,
    viewerTitle: "Corbel (Catalan, ca. 1130-40; 25.120.602)",
    subtitle: "Artist: Unknown Catalan sculptor",
    medium: "Marble",
    dimensions: "Overall: 6 1/4 x 6 1/2 x 11 in. (15.9 x 16.5 x 27.9 cm)",
    locationLabel: "On view:",
    location: "Gallery 007, The Cloisters, The Metropolitan Museum of Art",
    culture: "Catalan",
    region: "Europe",
    current_location: "Gallery 007, The Cloisters, The Metropolitan Museum of Art",
    findspot_or_origin: "present-day France",
    scan_source: "The Met 3D / VNTANA",
    mesh_format: "GLB",
    tags: ["Catalan", "Europe", "present-day France", "Marble", "The Met"],
    lobbyMeta: "Source: The Met 3D / The Cloisters",
    source: metSource(
      "Corbel",
      "https://www.metmuseum.org/art/collection/search/470796",
      "https://api.vntana.com/assets/products/bf6fcff7-375a-430e-919e-47dd8b073b67/organizations/The-Metropolitan-Museum-of-Art/clients/masters/e17aea99-c246-47c4-bda6-1b64c2047f06.glb",
      "The title, date, maker attribution, medium, dimensions, and location details follow The Met collection record."
    ),
    defaults: MET_DEFAULTS,
    model: {
      primaryUrl: "./corbel_25_120_602.glb",
      fallbackUrl: "./corbel_25_120_602.glb"
    },
    scene: MET_SCENE_PRESETS.relief
  },
  "spandrel-sections-of-an-arch": {
    kind: "gltf",
    path: "/spandrel-sections-of-an-arch/",
    sectionId: "early-renaissance",
    sortOrder: 73.45,
    viewerTitle: "Spandrel with Sections of an Arch (Catalan, ca. 1130–40)",
    subtitle: "Artist: Unknown Catalan sculptor",
    medium: "Marble",
    dimensions: "25.120.603: 17 1/4 × 13 1/2 × 10 in. (43.8 × 34.3 × 25.4 cm)\r\n25.120.982: 7 3/4 × 29 1/4 in. (19.7 × 74.3 cm)\r\n25.120.983: 6 3/4 × 29 1/2 in. (17.1 × 74.9 cm)\r\n25.120.984: 6 1/4 × 27 1/4 in. (15.9 × 69.2 cm)\r\n25.120.985: 6 1/2 × 23 1/2 × 10 1/2 in. (16.5 × 59.7 × 26.7 cm)\r\n25.120.986: 6 1/2 × 18 1/2 × 10 in. (16.5 × 47 × 25.4 cm)\r\n25.120.987: 6 × 20 1/2 × 8 in. (15.2 × 52.1 × 20.3 cm)\r\n25.120.988: 6 3/4 × 31 1/4 × 7 1/2 in. (17.1 × 79.4 × 19.1 cm)",
    locationLabel: "On view:",
    location: "Gallery 007, The Cloisters, The Metropolitan Museum of Art",
    culture: "Catalan",
    region: "Europe",
    current_location: "Gallery 007, The Cloisters, The Metropolitan Museum of Art",
    findspot_or_origin: "present-day France",
    scan_source: "The Met 3D / VNTANA",
    mesh_format: "GLB",
    tags: ["Catalan", "Europe", "present-day France", "Marble", "The Met"],
    lobbyMeta: "Source: The Met 3D / The Cloisters",
    source: metSource(
      "Spandrel with Sections of an Arch",
      "https://www.metmuseum.org/art/collection/search/470797",
      "https://api.vntana.com/assets/products/86d3030b-18e1-4f80-8938-3ddf91fc9db1/organizations/The-Metropolitan-Museum-of-Art/clients/masters/7d6b3a9b-3f1c-4d54-b661-2ac179a77792.glb",
      "The title, date, maker attribution, medium, dimensions, and location details follow The Met collection record."
    ),
    defaults: MET_DEFAULTS,
    model: {
      primaryUrl: "./spandrel_sections_of_an_arch.glb",
      fallbackUrl: "./spandrel_sections_of_an_arch.glb"
    },
    scene: MET_SCENE_PRESETS.relief
  },
  "lintel-470947": {
    kind: "gltf",
    path: "/lintel-470947/",
    sectionId: "early-renaissance",
    sortOrder: 73.4,
    viewerTitle: "Lintel (Catalan, ca. 1130–40)",
    subtitle: "Artist: Unknown Catalan sculptor",
    medium: "Marble",
    dimensions: "Overall: 8 1/2 x 17 7/8 x 9 1/2 in. (21.6 x 45.4 x 24.1 cm)",
    locationLabel: "On view:",
    location: "Gallery 007, The Cloisters, The Metropolitan Museum of Art",
    culture: "Catalan",
    region: "Europe",
    current_location: "Gallery 007, The Cloisters, The Metropolitan Museum of Art",
    findspot_or_origin: "present-day France",
    scan_source: "The Met 3D / VNTANA",
    mesh_format: "GLB",
    tags: ["Catalan", "Europe", "present-day France", "Marble", "The Met"],
    lobbyMeta: "Source: The Met 3D / The Cloisters",
    source: metSource(
      "Lintel",
      "https://www.metmuseum.org/art/collection/search/470947",
      "https://api.vntana.com/assets/products/a524e947-b301-4b09-a6c4-f0df8359a9b5/organizations/The-Metropolitan-Museum-of-Art/clients/masters/6b88d865-17ac-439a-a175-1358aac5a6bf.glb",
      "The title, date, maker attribution, medium, dimensions, and location details follow The Met collection record."
    ),
    defaults: MET_DEFAULTS,
    model: {
      primaryUrl: "./lintel_470947.glb",
      fallbackUrl: "./lintel_470947.glb"
    },
    scene: MET_SCENE_PRESETS.relief
  },
  "relief-agnus-dei-and-cherub": {
    kind: "gltf",
    path: "/relief-agnus-dei-and-cherub/",
    sectionId: "early-renaissance",
    sortOrder: 73.3,
    viewerTitle: "Relief of Agnus Dei and Cherub (Catalan, ca. 1140–50)",
    subtitle: "Artist: Unknown Catalan sculptor",
    medium: "Marble",
    dimensions: "Overall: 26 1/2 x 14 1/2 x 5 3/4 in. (67.3 x 36.8 x 14.6 cm)",
    locationLabel: "On view:",
    location: "Gallery 007, The Cloisters, The Metropolitan Museum of Art",
    culture: "Catalan",
    region: "Europe",
    current_location: "Gallery 007, The Cloisters, The Metropolitan Museum of Art",
    findspot_or_origin: "present-day France",
    scan_source: "The Met 3D / VNTANA",
    mesh_format: "GLB",
    tags: ["Catalan", "Europe", "present-day France", "Marble", "The Met"],
    lobbyMeta: "Source: The Met 3D / The Cloisters",
    source: metSource(
      "Relief of Agnus Dei and Cherub",
      "https://www.metmuseum.org/art/collection/search/470771",
      "https://api.vntana.com/assets/products/f9fbe881-501b-4455-bdf9-cb8b3b79eb6d/organizations/The-Metropolitan-Museum-of-Art/clients/masters/e6e0ae7f-f634-4834-8ac8-29fcf5ac510d.glb",
      "The title, date, maker attribution, medium, dimensions, and location details follow The Met collection record."
    ),
    defaults: MET_DEFAULTS,
    model: {
      primaryUrl: "./relief_agnus_dei_and_cherub.glb",
      fallbackUrl: "./relief_agnus_dei_and_cherub.glb"
    },
    scene: MET_SCENE_PRESETS.relief
  },
  "tomb-of-ermengol-x": {
    kind: "gltf",
    path: "/tomb-of-ermengol-x/",
    sectionId: "early-renaissance",
    sortOrder: 73.6,
    viewerTitle: "Tomb of Ermengol X, Count of Urgell (Catalan, ca. 1300–1350)",
    subtitle: "Artist: Unknown Catalan sculptor",
    medium: "Limestone with traces of paint",
    dimensions: "Overall: 51 1/4 x 82 5/8 x 26 1/2 in. (130.2 x 209.9 x 67.3 cm)",
    locationLabel: "On view:",
    location: "Gallery 009, The Cloisters, The Metropolitan Museum of Art",
    culture: "Catalan",
    region: "Europe",
    current_location: "Gallery 009, The Cloisters, The Metropolitan Museum of Art",
    scan_source: "The Met 3D / VNTANA",
    mesh_format: "GLB",
    tags: ["Catalan", "Europe", "Limestone with traces of paint", "The Met"],
    lobbyMeta: "Source: The Met 3D / The Cloisters",
    source: metSource(
      "Tomb of Ermengol X, Count of Urgell",
      "https://www.metmuseum.org/art/collection/search/471321",
      "https://api.vntana.com/assets/products/dc61b9db-a32e-471b-9016-1d92cd26ca18/organizations/The-Metropolitan-Museum-of-Art/clients/masters/75a4bbf1-2c11-484e-a494-9b2f27c74969.glb",
      "The title, date, maker attribution, medium, dimensions, and location details follow The Met collection record."
    ),
    defaults: MET_DEFAULTS,
    model: {
      primaryUrl: "./tomb_of_ermengol_x.glb",
      fallbackUrl: "./tomb_of_ermengol_x.glb"
    },
    scene: MET_SCENE_PRESETS.wide
  },
  "block-470953": {
    kind: "gltf",
    path: "/block-470953/",
    sectionId: "early-renaissance",
    sortOrder: 73.35,
    viewerTitle: "Block (Catalan, ca. 1130–40)",
    subtitle: "Artist: Unknown Catalan sculptor",
    medium: "Marble",
    dimensions: "Overall: 16 7/8 x 8 1/2 x 8 1/2 in. (42.9 x 21.6 x 21.6 cm)",
    locationLabel: "On view:",
    location: "Gallery 007, The Cloisters, The Metropolitan Museum of Art",
    culture: "Catalan",
    region: "Europe",
    current_location: "Gallery 007, The Cloisters, The Metropolitan Museum of Art",
    findspot_or_origin: "present-day France",
    scan_source: "The Met 3D / VNTANA",
    mesh_format: "GLB",
    tags: ["Catalan", "Europe", "present-day France", "Marble", "The Met"],
    lobbyMeta: "Source: The Met 3D / The Cloisters",
    source: metSource(
      "Block",
      "https://www.metmuseum.org/art/collection/search/470953",
      "https://api.vntana.com/assets/products/6a0bc961-0263-4b28-b590-a0be68b21c6f/organizations/The-Metropolitan-Museum-of-Art/clients/masters/2ff3b59a-fc13-49f3-abba-30c7893ec972.glb",
      "The title, date, maker attribution, medium, dimensions, and location details follow The Met collection record."
    ),
    defaults: MET_DEFAULTS,
    model: {
      primaryUrl: "./block_470953.glb",
      fallbackUrl: "./block_470953.glb"
    },
    scene: MET_SCENE_PRESETS.relief
  },
  "mask-le-op": {
    kind: "gltf",
    path: "/americas/mask-le-op/",
    sectionId: "americas",
    sortOrder: 73,
    viewerTitle: "Mask (Le Op) (Torres Strait Island people, mid- to late 19th century)",
    subtitle: "Artist: Unknown Torres Strait Islander sculptor",
    medium: "Turtle shell, hair, fiber, pigment",
    dimensions: "H. 16 1/8 in. × W. 11 in. × D. 8 1/4 in. (41 × 27.9 × 21 cm)",
    locationLabel: "Displayed / held:",
    location: "The Michael C. Rockefeller Wing, The Metropolitan Museum of Art",
    culture: "Torres Strait Island people",
    region: "Oceania",
    current_location: "The Michael C. Rockefeller Wing, The Metropolitan Museum of Art",
    findspot_or_origin: "Erub Island, Australia",
    scan_source: "The Met 3D / VNTANA",
    mesh_format: "GLB",
    tags: ["Torres Strait Island people", "Oceania", "Australia", "Turtle shell", "The Met"],
    lobbyMeta: "Source: The Met 3D / The Michael C. Rockefeller Wing",
    source: metSource(
      "Mask (Le Op)",
      "https://www.metmuseum.org/art/collection/search/310072",
      "https://api.vntana.com/assets/products/1bb08b6f-a796-4d0c-a447-55a2980c4990/organizations/The-Metropolitan-Museum-of-Art/clients/masters/70498c0d-666e-4552-9a3c-a811f4c3684a.glb",
      "The title, date, maker attribution, medium, dimensions, and location details follow The Met collection record."
    ),
    defaults: MET_DEFAULTS,
    model: {
      primaryUrl: "./mask_le_op.glb",
      fallbackUrl: "./mask_le_op.glb"
    },
    scene: MET_SCENE_PRESETS.figure
  },
  "shield-with-owl-figure": {
    kind: "gltf",
    path: "/americas/shield-with-owl-figure/",
    sectionId: "americas",
    sortOrder: 68,
    viewerTitle: "Shield with owl figure (Moche, 500–800 CE)",
    subtitle: "Artist: Moche artist(s)",
    medium: "Gilded copper, silvered copper, shell, beads, fibers",
    dimensions: "H. 10 1/2 × W. 10 1/2 × D. 1 in. (26.7 × 26.7 × 2.5 cm)",
    locationLabel: "Displayed / held:",
    location: "The Michael C. Rockefeller Wing, The Metropolitan Museum of Art",
    culture: "Moche",
    region: "Americas",
    current_location: "The Michael C. Rockefeller Wing, The Metropolitan Museum of Art",
    findspot_or_origin: "Piura region, Peru",
    scan_source: "The Met 3D / VNTANA",
    mesh_format: "GLB",
    tags: ["Moche", "Americas", "Peru", "Gilded copper", "The Met"],
    lobbyMeta: "Source: The Met 3D / The Michael C. Rockefeller Wing",
    source: metSource(
      "Shield with owl figure",
      "https://www.metmuseum.org/art/collection/search/315119",
      "https://api.vntana.com/assets/products/45252e70-c5b3-47aa-b915-8160cc832aea/organizations/The-Metropolitan-Museum-of-Art/clients/masters/c126a286-ce31-4686-a63f-c69ce1594614.glb",
      "The title, date, maker attribution, medium, dimensions, and location details follow The Met collection record."
    ),
    defaults: MET_DEFAULTS,
    model: {
      primaryUrl: "./shield_with_owl_figure.glb",
      fallbackUrl: "./shield_with_owl_figure.glb"
    },
    scene: MET_SCENE_PRESETS.relief
  },
  "atingting-kon-slit-gong": {
    kind: "gltf",
    path: "/americas/atingting-kon-slit-gong/",
    sectionId: "americas",
    sortOrder: 74,
    viewerTitle: "Atingting kon (slit gong) (mid- to late 1960s)",
    subtitle: "Artist: Tin Mweleun",
    medium: "Wood, paint",
    dimensions: "H. 14 ft. 7 1/4 in. × W. 28 in. × D. 23 1/2 in. (445.1 × 71.1 × 59.7 cm)\r\nH. to top of peg: 12 ft. 4 1/2 in. (377.2 cm)",
    locationLabel: "Displayed / held:",
    location: "The Michael C. Rockefeller Wing, The Metropolitan Museum of Art",
    region: "Oceania",
    current_location: "The Michael C. Rockefeller Wing, The Metropolitan Museum of Art",
    findspot_or_origin: "Ambrym Island, Vanuatu",
    scan_source: "The Met 3D / VNTANA",
    mesh_format: "GLB",
    tags: ["Oceania", "Vanuatu", "Wood", "The Met"],
    lobbyMeta: "Source: The Met 3D / The Michael C. Rockefeller Wing",
    source: metSource(
      "Atingting kon (slit gong)",
      "https://www.metmuseum.org/art/collection/search/309995",
      "https://api.vntana.com/assets/products/0853453f-c4ac-44d3-bc7d-9b28b6d4d657/organizations/The-Metropolitan-Museum-of-Art/clients/masters/dd63acd3-143b-4d3b-9208-6de9bee2db68.glb",
      "The title, date, maker attribution, medium, dimensions, and location details follow The Met collection record."
    ),
    defaults: MET_DEFAULTS,
    model: {
      primaryUrl: "./atingting_kon_slit_gong.glb",
      fallbackUrl: "./atingting_kon_slit_gong.glb"
    },
    scene: MET_SCENE_PRESETS.tall
  },
  "marble-anthropoid-sarcophagus-74-51-2454": {
    kind: "gltf",
    path: "/marble-anthropoid-sarcophagus-74-51-2454/",
    sectionId: "greek-classical",
    sortOrder: 25.1,
    viewerTitle: "Marble Anthropoid Sarcophagus (Graeco-Phoenician, last quarter of the 5th century BCE; 74.51.2454)",
    subtitle: "Artist: Unknown Graeco-Phoenician sculptor",
    medium: "Parian marble",
    dimensions: "82 × 34 × 27 in., 2521 lb. (208.3 × 86.4 × 68.6 cm, 1143.5 kg)",
    locationLabel: "On view:",
    location: "Gallery 515, The Metropolitan Museum of Art",
    culture: "Graeco-Phoenician",
    region: "Greek world",
    current_location: "Gallery 515, The Metropolitan Museum of Art",
    scan_source: "The Met 3D / VNTANA",
    mesh_format: "GLB",
    tags: ["Graeco-Phoenician", "Greek world", "Parian marble", "The Met"],
    lobbyMeta: "Source: The Met 3D / Department of Greek and Roman Art",
    source: metSource(
      "Marble anthropoid sarcophagus",
      "https://www.metmuseum.org/art/collection/search/242007",
      "https://api.vntana.com/assets/products/b47bdb4c-8138-46ec-85c3-877cfd58f1aa/organizations/The-Metropolitan-Museum-of-Art/clients/masters/b1156512-110c-402b-af9a-ec33fa7cc702.glb",
      "The title, date, maker attribution, medium, dimensions, and location details follow The Met collection record."
    ),
    defaults: MET_DEFAULTS,
    model: {
      primaryUrl: "./marble_anthropoid_sarcophagus_74_51_2454.glb",
      fallbackUrl: "./marble_anthropoid_sarcophagus_74_51_2454.glb"
    },
    scene: MET_SCENE_PRESETS.wide
  },
  "marble-anthropoid-sarcophagus-74-51-2452": {
    kind: "gltf",
    path: "/marble-anthropoid-sarcophagus-74-51-2452/",
    sectionId: "greek-classical",
    sortOrder: 25.05,
    viewerTitle: "Marble Anthropoid Sarcophagus (Graeco-Phoenician, last quarter of the 5th century BCE; 74.51.2452)",
    subtitle: "Artist: Unknown Graeco-Phoenician sculptor",
    medium: "Parian marble",
    dimensions: "87 3/4 × 35 × 26 in., 2779 lb. (222.9 × 88.9 × 66 cm, 1260.5 kg)",
    locationLabel: "On view:",
    location: "Gallery 515, The Metropolitan Museum of Art",
    culture: "Graeco-Phoenician",
    region: "Greek world",
    current_location: "Gallery 515, The Metropolitan Museum of Art",
    scan_source: "The Met 3D / VNTANA",
    mesh_format: "GLB",
    tags: ["Graeco-Phoenician", "Greek world", "Parian marble", "The Met"],
    lobbyMeta: "Source: The Met 3D / Department of Greek and Roman Art",
    source: metSource(
      "Marble anthropoid sarcophagus",
      "https://www.metmuseum.org/art/collection/search/242005",
      "https://api.vntana.com/assets/products/5fc7f1a2-7f74-40ad-a15b-c80df53dbf6c/organizations/The-Metropolitan-Museum-of-Art/clients/masters/736491d1-2963-49d7-ae96-f8290cf7426a.glb",
      "The title, date, maker attribution, medium, dimensions, and location details follow The Met collection record."
    ),
    defaults: MET_DEFAULTS,
    model: {
      primaryUrl: "./marble_anthropoid_sarcophagus_74_51_2452.glb",
      fallbackUrl: "./marble_anthropoid_sarcophagus_74_51_2452.glb"
    },
    scene: MET_SCENE_PRESETS.wide
  },
  "limestone-funerary-stele-cypriot-capital": {
    kind: "gltf",
    path: "/limestone-funerary-stele-cypriot-capital/",
    sectionId: "greek-classical",
    sortOrder: 25.15,
    viewerTitle: "Limestone funerary stele (shaft) with a \"Cypriot capital\" (Cypriot, 5th century BCE)",
    subtitle: "Artist: Unknown Cypriot sculptor",
    medium: "Limestone",
    dimensions: "54 × 32 × 8 in. (137.2 × 81.3 × 20.3 cm)",
    locationLabel: "On view:",
    location: "Gallery 515, The Metropolitan Museum of Art",
    culture: "Cypriot",
    region: "Greek world",
    current_location: "Gallery 515, The Metropolitan Museum of Art",
    scan_source: "The Met 3D / VNTANA",
    mesh_format: "GLB",
    tags: ["Cypriot", "Greek world", "Limestone", "The Met"],
    lobbyMeta: "Source: The Met 3D / Department of Greek and Roman Art",
    source: metSource(
      "Limestone funerary stele (shaft) with a \"Cypriot capital\"",
      "https://www.metmuseum.org/art/collection/search/242044",
      "https://api.vntana.com/assets/products/6d0e7d23-9b52-453a-bcd4-7a4a8ddf2c6e/organizations/The-Metropolitan-Museum-of-Art/clients/masters/d7884c76-45ba-4e56-8ac6-c75a7dd27b65.glb",
      "The title, date, maker attribution, medium, dimensions, and location details follow The Met collection record."
    ),
    defaults: MET_DEFAULTS,
    model: {
      primaryUrl: "./limestone_funerary_stele_cypriot_capital.glb",
      fallbackUrl: "./limestone_funerary_stele_cypriot_capital.glb"
    },
    scene: MET_SCENE_PRESETS.relief
  },
  "limestone-votive-relief-banquet-scenes": {
    kind: "gltf",
    path: "/limestone-votive-relief-banquet-scenes/",
    sectionId: "greek-classical",
    sortOrder: 25.2,
    viewerTitle: "Limestone votive relief with worship and banquet scenes (Cypriot, 4th century BCE)",
    subtitle: "Artist: Unknown Cypriot sculptor",
    medium: "Limestone",
    dimensions: "WebPub GR 2012 Cesnola: 12 1/2 × 19 7/8 × 3/16 in., 10 lb. (31.8 × 50.5 × 0.5 cm)",
    locationLabel: "On view:",
    location: "Gallery 171, The Metropolitan Museum of Art",
    culture: "Cypriot",
    region: "Greek world",
    current_location: "Gallery 171, The Metropolitan Museum of Art",
    scan_source: "The Met 3D / VNTANA",
    mesh_format: "GLB",
    tags: ["Cypriot", "Greek world", "Limestone", "The Met"],
    lobbyMeta: "Source: The Met 3D / Department of Greek and Roman Art",
    source: metSource(
      "Limestone votive relief with worship and banquet scenes",
      "https://www.metmuseum.org/art/collection/search/241892",
      "https://api.vntana.com/assets/products/6037f9c9-1672-40a1-b9cf-c7c4b5848b9a/organizations/The-Metropolitan-Museum-of-Art/clients/masters/49163cf7-43ba-4021-a4b7-7fc282334392.glb",
      "The title, date, maker attribution, medium, dimensions, and location details follow The Met collection record."
    ),
    defaults: MET_DEFAULTS,
    model: {
      primaryUrl: "./limestone_votive_relief_banquet_scenes.glb",
      fallbackUrl: "./limestone_votive_relief_banquet_scenes.glb"
    },
    scene: MET_SCENE_PRESETS.relief
  },
  "bisj-ancestor-pole-jewer": {
    kind: "gltf",
    path: "/americas/bisj-ancestor-pole-jewer/",
    sectionId: "americas",
    sortOrder: 77,
    viewerTitle: "bisj (ancestor pole) (Asmat people, ca. 1960; Jewer)",
    subtitle: "Artist: Jewer",
    medium: "Wood, paint, fiber, sago palm leaves",
    dimensions: "H. 17 ft. 4 in. × W. 21 1/2 in. × D. 65 in. (528.3 × 54.6 × 165.1 cm)",
    locationLabel: "Displayed / held:",
    location: "The Michael C. Rockefeller Wing, The Metropolitan Museum of Art",
    culture: "Asmat people",
    region: "Oceania",
    current_location: "The Michael C. Rockefeller Wing, The Metropolitan Museum of Art",
    findspot_or_origin: "Omadesep village, Indonesia",
    scan_source: "The Met 3D / VNTANA",
    mesh_format: "GLB",
    tags: ["Asmat people", "Oceania", "Indonesia", "Wood", "The Met"],
    lobbyMeta: "Source: The Met 3D / The Michael C. Rockefeller Wing",
    source: metSource(
      "bisj (ancestor pole)",
      "https://www.metmuseum.org/art/collection/search/311715",
      "https://api.vntana.com/assets/products/fd66d72f-9f52-4e12-9160-0b56705da909/organizations/The-Metropolitan-Museum-of-Art/clients/masters/93d311ff-b09a-4937-9529-796403beca24.glb",
      "The title, date, maker attribution, medium, dimensions, and location details follow The Met collection record."
    ),
    defaults: MET_DEFAULTS,
    model: {
      primaryUrl: "./bisj_ancestor_pole_jewer.glb",
      fallbackUrl: "./bisj_ancestor_pole_jewer.glb"
    },
    scene: MET_SCENE_PRESETS.tall
  },
  "bisj-ancestor-pole-1978-412-1251": {
    kind: "gltf",
    path: "/americas/bisj-ancestor-pole-1978-412-1251/",
    sectionId: "americas",
    sortOrder: 78,
    viewerTitle: "bisj (ancestor pole) (Asmat people, ca. 1960; 1978.412.1251)",
    subtitle: "Artist: Asmat artist(s)",
    medium: "Wood, paint, fiber, sago palm leaves",
    dimensions: "H. 19 ft. × W. 12 in. × D. 48 in. (579.1 × 30.5 × 121.9 cm)",
    locationLabel: "Displayed / held:",
    location: "The Michael C. Rockefeller Wing, The Metropolitan Museum of Art",
    culture: "Asmat people",
    region: "Oceania",
    current_location: "The Michael C. Rockefeller Wing, The Metropolitan Museum of Art",
    findspot_or_origin: "probably Per village, Indonesia",
    scan_source: "The Met 3D / VNTANA",
    mesh_format: "GLB",
    tags: ["Asmat people", "Oceania", "Indonesia", "Wood", "The Met"],
    lobbyMeta: "Source: The Met 3D / The Michael C. Rockefeller Wing",
    source: metSource(
      "bisj (ancestor pole)",
      "https://www.metmuseum.org/art/collection/search/311718",
      "https://api.vntana.com/assets/products/bc872996-f2cb-41d6-a9ac-30c5db397365/organizations/The-Metropolitan-Museum-of-Art/clients/masters/1db634b9-fe3d-4940-8d8d-6919de92d14b.glb",
      "The title, date, maker attribution, medium, dimensions, and location details follow The Met collection record."
    ),
    defaults: MET_DEFAULTS,
    model: {
      primaryUrl: "./bisj_ancestor_pole_1978_412_1251.glb",
      fallbackUrl: "./bisj_ancestor_pole_1978_412_1251.glb"
    },
    scene: MET_SCENE_PRESETS.tall
  },
  "bisj-ancestor-pole-jiem": {
    kind: "gltf",
    path: "/americas/bisj-ancestor-pole-jiem/",
    sectionId: "americas",
    sortOrder: 79,
    viewerTitle: "bisj (ancestor pole) (Asmat people, ca. 1960; Jiem)",
    subtitle: "Artist: Jiem",
    medium: "Wood, paint, fiber, sago palm leaves",
    dimensions: "H. 15 ft. 6 in. × W. 13 in. × D. 44 in. (472.4 × 33 × 111.8 cm)",
    locationLabel: "Displayed / held:",
    location: "The Michael C. Rockefeller Wing, The Metropolitan Museum of Art",
    culture: "Asmat people",
    region: "Oceania",
    current_location: "The Michael C. Rockefeller Wing, The Metropolitan Museum of Art",
    findspot_or_origin: "Otsjanep village, Indonesia",
    scan_source: "The Met 3D / VNTANA",
    mesh_format: "GLB",
    tags: ["Asmat people", "Oceania", "Indonesia", "Wood", "The Met"],
    lobbyMeta: "Source: The Met 3D / The Michael C. Rockefeller Wing",
    source: metSource(
      "bisj (ancestor pole)",
      "https://www.metmuseum.org/art/collection/search/311721",
      "https://api.vntana.com/assets/products/2bfe8217-e7d1-4e24-bb6f-c48e6e17e8b6/organizations/The-Metropolitan-Museum-of-Art/clients/masters/b8e9cda9-115b-4f3a-813c-4368a423eb85.glb",
      "The title, date, maker attribution, medium, dimensions, and location details follow The Met collection record."
    ),
    defaults: MET_DEFAULTS,
    model: {
      primaryUrl: "./bisj_ancestor_pole_jiem.glb",
      fallbackUrl: "./bisj_ancestor_pole_jiem.glb"
    },
    scene: MET_SCENE_PRESETS.tall
  },
  "waka-huia-treasure-box": {
    kind: "gltf",
    path: "/americas/waka-huia-treasure-box/",
    sectionId: "americas",
    sortOrder: 75,
    viewerTitle: "Waka huia (treasure box) (Maori people, mid-late 19th century)",
    subtitle: "Artist: Māori artist",
    medium: "Wood, shell (pāua)",
    dimensions: "Assembled: H. 6 1/2 × W. 22 1/2 × D. 9 3/4 in. (16.5 × 57.2 × 24.8 cm)",
    locationLabel: "Displayed / held:",
    location: "The Michael C. Rockefeller Wing, The Metropolitan Museum of Art",
    culture: "Maori people",
    region: "Oceania",
    current_location: "The Michael C. Rockefeller Wing, The Metropolitan Museum of Art",
    findspot_or_origin: "New Zealand",
    scan_source: "The Met 3D / VNTANA",
    mesh_format: "GLB",
    tags: ["Maori people", "Oceania", "New Zealand", "Wood", "The Met"],
    lobbyMeta: "Source: The Met 3D / The Michael C. Rockefeller Wing",
    source: metSource(
      "Waka huia (treasure box)",
      "https://www.metmuseum.org/art/collection/search/313628",
      "https://api.vntana.com/assets/products/4baaa55f-2849-47c7-b06d-ef4cc2f0c2e1/organizations/The-Metropolitan-Museum-of-Art/clients/masters/921d1940-d9c5-4e55-8fd2-d6065cf7abad.glb",
      "The title, date, maker attribution, medium, dimensions, and location details follow The Met collection record."
    ),
    defaults: MET_DEFAULTS,
    model: {
      primaryUrl: "./waka_huia_treasure_box.glb",
      fallbackUrl: "./waka_huia_treasure_box.glb"
    },
    scene: MET_SCENE_PRESETS.compact
  },
  "ancestor-figure-teke": {
    kind: "gltf",
    path: "/sub-saharan-africa/ancestor-figure-teke/",
    sectionId: "sub-saharan-africa",
    sortOrder: 24,
    viewerTitle: "Ancestor figure (Teke peoples, 19th century)",
    subtitle: "Artist: Teke artist",
    medium: "Wood (ngasu or mulong), cloth, organic matter, pigment",
    dimensions: "H. 19 5/16 × W. 5 × D. 5 in. (49.1 × 12.7 × 12.7 cm)",
    locationLabel: "Displayed / held:",
    location: "The Michael C. Rockefeller Wing, The Metropolitan Museum of Art",
    culture: "Teke peoples",
    region: "Sub-Saharan Africa",
    current_location: "The Michael C. Rockefeller Wing, The Metropolitan Museum of Art",
    findspot_or_origin: "Democratic Republic of Congo",
    scan_source: "The Met 3D / VNTANA",
    mesh_format: "GLB",
    tags: ["Teke peoples", "Sub-Saharan Africa", "Democratic Republic of Congo", "Wood (ngasu or mulong)", "The Met"],
    lobbyMeta: "Source: The Met 3D / The Michael C. Rockefeller Wing",
    source: metSource(
      "Ancestor figure",
      "https://www.metmuseum.org/art/collection/search/824207",
      "https://api.vntana.com/assets/products/9f592099-1fe3-4aea-b93b-3395c8ec414c/organizations/The-Metropolitan-Museum-of-Art/clients/masters/0e309272-674e-4959-ae1e-1c0dc170ce95.glb",
      "The title, date, maker attribution, medium, dimensions, and location details follow The Met collection record."
    ),
    defaults: MET_DEFAULTS,
    model: {
      primaryUrl: "./ancestor_figure_teke.glb",
      fallbackUrl: "./ancestor_figure_teke.glb"
    },
    scene: MET_SCENE_PRESETS.figure
  },
  "helmet-mask-four-faces": {
    kind: "gltf",
    path: "/sub-saharan-africa/helmet-mask-four-faces/",
    sectionId: "sub-saharan-africa",
    sortOrder: 25,
    viewerTitle: "Helmet mask with four faces (Gola peoples, Late 19th–early 20th century)",
    subtitle: "Artist: Gola artist",
    medium: "Wood, pigment",
    dimensions: "H. 14 × W. 8 11/16 × H. 8 1/4 in. (35.6 × 22 × 21 cm)",
    locationLabel: "Displayed / held:",
    location: "The Michael C. Rockefeller Wing, The Metropolitan Museum of Art",
    culture: "Gola peoples",
    region: "Sub-Saharan Africa",
    current_location: "The Michael C. Rockefeller Wing, The Metropolitan Museum of Art",
    findspot_or_origin: "western Liberia",
    scan_source: "The Met 3D / VNTANA",
    mesh_format: "GLB",
    tags: ["Gola peoples", "Sub-Saharan Africa", "western Liberia", "Wood", "The Met"],
    lobbyMeta: "Source: The Met 3D / The Michael C. Rockefeller Wing",
    source: metSource(
      "Helmet mask with four faces",
      "https://www.metmuseum.org/art/collection/search/824209",
      "https://api.vntana.com/assets/products/b9c001b3-a443-4655-98c0-583598bbe4d4/organizations/The-Metropolitan-Museum-of-Art/clients/masters/f96bd55a-4650-4652-944a-f2a1443e7e39.glb",
      "The title, date, maker attribution, medium, dimensions, and location details follow The Met collection record."
    ),
    defaults: MET_DEFAULTS,
    model: {
      primaryUrl: "./helmet_mask_four_faces.glb",
      fallbackUrl: "./helmet_mask_four_faces.glb"
    },
    scene: MET_SCENE_PRESETS.figure
  },
  "house-post-iatmul": {
    kind: "gltf",
    path: "/americas/house-post-iatmul/",
    sectionId: "americas",
    sortOrder: 80,
    viewerTitle: "House Post (Iatmul people, 19th–early 20th century)",
    subtitle: "Artist: Unknown Iatmul sculptor",
    medium: "Wood",
    dimensions: "H. 102 x W. 22 x D. 12 in. (259.1 x 55.9 x 30.5 cm)",
    locationLabel: "Displayed / held:",
    location: "The Michael C. Rockefeller Wing, The Metropolitan Museum of Art",
    culture: "Iatmul people",
    region: "Oceania",
    current_location: "The Michael C. Rockefeller Wing, The Metropolitan Museum of Art",
    findspot_or_origin: "Mindimbit village, Papua New Guinea",
    scan_source: "The Met 3D / VNTANA",
    mesh_format: "GLB",
    tags: ["Iatmul people", "Oceania", "Papua New Guinea", "Wood", "The Met"],
    lobbyMeta: "Source: The Met 3D / The Michael C. Rockefeller Wing",
    source: metSource(
      "House Post",
      "https://www.metmuseum.org/art/collection/search/313891",
      "https://api.vntana.com/assets/products/c9bfc5dc-9afb-474b-b14e-990be08b6856/organizations/The-Metropolitan-Museum-of-Art/clients/masters/fa4f7c2c-094d-4beb-94ac-d919f3de8f10.glb",
      "The title, date, maker attribution, medium, dimensions, and location details follow The Met collection record."
    ),
    defaults: MET_DEFAULTS,
    model: {
      primaryUrl: "./house_post_iatmul.glb",
      fallbackUrl: "./house_post_iatmul.glb"
    },
    scene: MET_SCENE_PRESETS.tall
  },
  "limestone-figure-of-a-woman": {
    kind: "gltf",
    path: "/limestone-figure-of-a-woman/",
    sectionId: "greek-classical",
    sortOrder: 25.0,
    viewerTitle: "Limestone figure of a woman (Cypriot, late 6th century BCE)",
    subtitle: "Artist: Unknown Cypriot sculptor",
    medium: "Limestone",
    dimensions: "Webpub GR 2012 Cesnola: 9 13/16 × 5 × 4 1/4 in., 2.7 lb. (25 × 12.7 × 10.8 cm, 1.2 kg)\r\nOther (without base): 8 in. (20.3 cm)",
    locationLabel: "Collection:",
    location: "The Metropolitan Museum of Art",
    culture: "Cypriot",
    region: "Greek world",
    current_location: "The Metropolitan Museum of Art",
    scan_source: "The Met 3D / VNTANA",
    mesh_format: "GLB",
    tags: ["Cypriot", "Greek world", "Limestone", "The Met"],
    lobbyMeta: "Source: The Met 3D / Department of Greek and Roman Art",
    source: metSource(
      "Limestone figure of a woman",
      "https://www.metmuseum.org/art/collection/search/242109",
      "https://api.vntana.com/assets/products/f5f02009-4cce-4a6b-95f9-ee9361485c2b/organizations/The-Metropolitan-Museum-of-Art/clients/masters/90480b50-0afb-4ac0-9ccf-55093de31862.glb",
      "The title, date, maker attribution, medium, dimensions, and location details follow The Met collection record."
    ),
    defaults: MET_DEFAULTS,
    model: {
      primaryUrl: "./limestone_figure_of_a_woman.glb",
      fallbackUrl: "./limestone_figure_of_a_woman.glb"
    },
    scene: MET_SCENE_PRESETS.figure
  },
  "limestone-statue-of-herakles": {
    kind: "gltf",
    path: "/limestone-statue-of-herakles/",
    sectionId: "greek-classical",
    sortOrder: 25.25,
    viewerTitle: "Limestone statue of Herakles (Cypriot, 2nd half of the 4th century BCE)",
    subtitle: "Artist: Unknown Cypriot sculptor",
    medium: "Limestone",
    dimensions: "WebPub GR 2012 Cesnola: 21 3/8 × 8 × 2 3/4 in., 14 lb. (54.3 × 20.3 × 7 cm, 6.4 kg)",
    locationLabel: "Collection:",
    location: "The Metropolitan Museum of Art",
    culture: "Cypriot",
    region: "Greek world",
    current_location: "The Metropolitan Museum of Art",
    scan_source: "The Met 3D / VNTANA",
    mesh_format: "GLB",
    tags: ["Cypriot", "Greek world", "Limestone", "The Met"],
    lobbyMeta: "Source: The Met 3D / Department of Greek and Roman Art",
    source: metSource(
      "Limestone statue of Herakles",
      "https://www.metmuseum.org/art/collection/search/242211",
      "https://api.vntana.com/assets/products/e62189bd-eb8f-4df3-942c-edc2331f4217/organizations/The-Metropolitan-Museum-of-Art/clients/masters/846feb49-3c5f-4f88-b3e4-3a943f7945ab.glb",
      "The title, date, maker attribution, medium, dimensions, and location details follow The Met collection record."
    ),
    defaults: MET_DEFAULTS,
    model: {
      primaryUrl: "./limestone_statue_of_herakles.glb",
      fallbackUrl: "./limestone_statue_of_herakles.glb"
    },
    scene: MET_SCENE_PRESETS.figure
  },
  "development-of-a-bottle-in-space": {
    kind: "gltf",
    path: "/development-of-a-bottle-in-space/",
    sectionId: "modern-sculpture",
    sortOrder: 3.5,
    viewerTitle: "Development of a Bottle in Space (1913, cast 1950)",
    subtitle: "Artist: Umberto Boccioni (1882-1916)",
    medium: "Bronze",
    dimensions: "15 1/2 × 23 3/4 × 12 1/2 in. (39.4 × 60.3 × 31.8 cm)",
    locationLabel: "Collection:",
    location: "The Metropolitan Museum of Art",
    region: "Europe",
    current_location: "The Metropolitan Museum of Art",
    scan_source: "The Met 3D / VNTANA",
    mesh_format: "GLB",
    tags: ["Europe", "Bronze", "The Met"],
    lobbyMeta: "Source: The Met 3D / Department of Modern and Contemporary Art",
    source: metSource(
      "Development of a Bottle in Space",
      "https://www.metmuseum.org/art/collection/search/485529",
      "https://api.vntana.com/assets/products/dd117fba-ff0f-4a9e-811a-ffc835991af7/organizations/The-Metropolitan-Museum-of-Art/clients/masters/78399e06-df0e-4663-b9d0-f2e4b97ff9fd.glb",
      "The title, date, maker attribution, medium, dimensions, and location details follow The Met collection record."
    ),
    defaults: MET_DEFAULTS,
    model: {
      primaryUrl: "./development_of_a_bottle_in_space.glb",
      fallbackUrl: "./development_of_a_bottle_in_space.glb"
    },
    scene: MET_SCENE_PRESETS.figure
  },
};
