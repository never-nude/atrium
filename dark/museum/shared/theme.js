export const LIGHT_THEME = "light";
export const DARK_THEME = "dark";
export const EDITORIAL_UI_MODE = "editorial";
export const CLASSIC_UI_MODE = "classic";

const THEME_STORAGE_KEY = "formgallery-theme";
const UI_MODE_STORAGE_KEY = "formgallery-ui-mode";

const META_THEME_COLORS = Object.freeze({
  [LIGHT_THEME]: "#f4efe7",
  [DARK_THEME]: "#14110f"
});

const VIEWER_PALETTES = Object.freeze({
  [LIGHT_THEME]: Object.freeze({
    background: 0xe8dfd0,
    fog: 0xe8dfd0,
    hemiSky: 0xfff7e9,
    hemiGround: 0xbcad98,
    key: 0xfff7ea,
    fill: 0xf4efe7,
    rim: 0xdde4f4,
    bounce: 0xffead1,
    floor: 0xd2c5b2,
    pedestal: 0xc9baa7,
    sculptureColor: "#ece3d3",
    sculptureSheen: "#fff2df"
  }),
  [DARK_THEME]: Object.freeze({
    background: 0x14110f,
    fog: 0x14110f,
    hemiSky: 0xcdb79b,
    hemiGround: 0x1f1813,
    key: 0xffe8c7,
    fill: 0x756759,
    rim: 0xb3c4e1,
    bounce: 0xb7844b,
    floor: 0x2b241e,
    pedestal: 0x3a3128,
    sculptureColor: "#efe6d8",
    sculptureSheen: "#fff7eb"
  })
});

const TOUR_PALETTES = Object.freeze({
  [LIGHT_THEME]: Object.freeze({
    background: 0xefe5d6,
    fog: 0xefe5d6,
    floor: 0xd7cab7,
    runner: 0xc9b9a3,
    wall: 0xefe6d9,
    ceiling: 0xf8f2e8,
    hemiSky: 0xfff8ed,
    hemiGround: 0xc8b7a2,
    key: 0xfffbf0,
    fill: 0xf4efe8,
    entry: 0xffecd2,
    pedestal: 0xcab9a5,
    sculptureColor: "#ece3d3",
    sculptureSheen: "#fff3e2",
    labelFill: "rgba(251, 245, 236, 0.94)",
    labelStroke: "rgba(194, 168, 133, 0.94)",
    labelKicker: "#7d6a54",
    labelTitle: "#342820",
    labelMeta: "#66584a",
    exposure: 0.52
  }),
  [DARK_THEME]: Object.freeze({
    background: 0x13110f,
    fog: 0x13110f,
    floor: 0x2c241f,
    runner: 0x46382c,
    wall: 0x26211d,
    ceiling: 0x1b1815,
    hemiSky: 0xd5be9c,
    hemiGround: 0x1d1712,
    key: 0xffe3bf,
    fill: 0x655b52,
    entry: 0xd7a96f,
    pedestal: 0x403327,
    sculptureColor: "#f0e9dd",
    sculptureSheen: "#fff9f0",
    labelFill: "rgba(28, 24, 21, 0.92)",
    labelStroke: "rgba(170, 145, 112, 0.92)",
    labelKicker: "#d1b189",
    labelTitle: "#f5ede2",
    labelMeta: "#c7b19a",
    exposure: 0.48
  })
});

function canUseDom() {
  return typeof document !== "undefined" && typeof window !== "undefined";
}

function safeStorageGet(key) {
  try {
    return window.localStorage.getItem(key) || "";
  } catch {
    return "";
  }
}

function safeStorageSet(key, value) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Ignore storage failures in private browsing or restricted contexts.
  }
}

export function normalizeTheme(value) {
  return value === DARK_THEME ? DARK_THEME : LIGHT_THEME;
}

export function getPreferredTheme() {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return LIGHT_THEME;
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? DARK_THEME : LIGHT_THEME;
}

export function getStoredTheme() {
  return normalizeTheme(safeStorageGet(THEME_STORAGE_KEY) || getPreferredTheme());
}

export function getActiveTheme() {
  if (!canUseDom()) {
    return LIGHT_THEME;
  }
  const active = document.documentElement.dataset.theme;
  return active === DARK_THEME || active === LIGHT_THEME ? active : getStoredTheme();
}

function updateThemeColorMeta(theme) {
  if (!canUseDom()) return;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) {
    meta.setAttribute("content", META_THEME_COLORS[theme]);
  }
}

export function syncThemeToggles(root = document) {
  if (!root?.querySelectorAll) return;
  const theme = getActiveTheme();
  const isDark = theme === DARK_THEME;

  for (const button of root.querySelectorAll("[data-theme-toggle]")) {
    const label = isDark
      ? button.dataset.labelDark || "Light Mode"
      : button.dataset.labelLight || "Dark Mode";
    button.setAttribute("aria-pressed", isDark ? "true" : "false");
    button.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
    button.dataset.activeTheme = theme;

    const labelNode = button.querySelector("[data-theme-toggle-label]");
    if (labelNode) {
      labelNode.textContent = label;
    }
  }
}

export function applyTheme(theme, options = {}) {
  if (!canUseDom()) {
    return normalizeTheme(theme);
  }

  const resolved = normalizeTheme(theme);
  const previous = document.documentElement.dataset.theme;
  document.documentElement.dataset.theme = resolved;
  document.documentElement.style.colorScheme = resolved;

  if (document.body) {
    document.body.dataset.theme = resolved;
  }

  if (options.persist !== false) {
    safeStorageSet(THEME_STORAGE_KEY, resolved);
  }

  updateThemeColorMeta(resolved);
  syncThemeToggles(document);

  if (previous !== resolved) {
    window.dispatchEvent(new CustomEvent("formgallery:themechange", { detail: { theme: resolved } }));
  }

  return resolved;
}

export function applyStoredTheme() {
  return applyTheme(getStoredTheme(), { persist: false });
}

export function toggleTheme() {
  return applyTheme(getActiveTheme() === DARK_THEME ? LIGHT_THEME : DARK_THEME);
}

export function bindThemeToggles(root = document) {
  if (!root?.querySelectorAll) return;

  for (const button of root.querySelectorAll("[data-theme-toggle]")) {
    if (button.dataset.themeToggleBound === "1") continue;
    button.dataset.themeToggleBound = "1";
    button.addEventListener("click", () => {
      toggleTheme();
    });
  }

  syncThemeToggles(root);
}

export function renderThemeToggle(options = {}) {
  const className = options.className ? ` ${options.className}` : "";
  const labelLight = options.labelLight || "Dark Mode";
  const labelDark = options.labelDark || "Light Mode";

  return `
    <button
      class="theme-toggle${className}"
      type="button"
      data-theme-toggle
      data-label-light="${labelLight}"
      data-label-dark="${labelDark}"
      aria-pressed="false"
      aria-label="Switch to dark mode"
    >
      <span class="theme-toggle-swatch" aria-hidden="true"></span>
      <span class="theme-toggle-text" data-theme-toggle-label>${labelLight}</span>
    </button>
  `;
}

export function normalizeUiMode(value) {
  return value === CLASSIC_UI_MODE ? CLASSIC_UI_MODE : EDITORIAL_UI_MODE;
}

export function getStoredUiMode() {
  return normalizeUiMode(safeStorageGet(UI_MODE_STORAGE_KEY) || EDITORIAL_UI_MODE);
}

export function getActiveUiMode() {
  if (!canUseDom()) {
    return EDITORIAL_UI_MODE;
  }
  const active = document.documentElement.dataset.uiMode;
  return active === CLASSIC_UI_MODE || active === EDITORIAL_UI_MODE ? active : getStoredUiMode();
}

export function syncUiModeToggles(root = document) {
  if (!root?.querySelectorAll) return;
  const uiMode = getActiveUiMode();
  const isClassic = uiMode === CLASSIC_UI_MODE;

  for (const button of root.querySelectorAll("[data-ui-mode-toggle]")) {
    const label = isClassic
      ? button.dataset.labelClassic || "Editorial Layout"
      : button.dataset.labelEditorial || "Classic Layout";
    button.setAttribute("aria-pressed", isClassic ? "true" : "false");
    button.setAttribute("aria-label", isClassic ? "Switch to editorial layout" : "Switch to classic layout");
    button.dataset.activeUiMode = uiMode;

    const labelNode = button.querySelector("[data-ui-mode-toggle-label]");
    if (labelNode) {
      labelNode.textContent = label;
    }
  }
}

export function applyUiMode(uiMode, options = {}) {
  if (!canUseDom()) {
    return normalizeUiMode(uiMode);
  }

  const resolved = normalizeUiMode(uiMode);
  const previous = document.documentElement.dataset.uiMode;
  document.documentElement.dataset.uiMode = resolved;

  if (document.body) {
    document.body.dataset.uiMode = resolved;
  }

  if (options.persist !== false) {
    safeStorageSet(UI_MODE_STORAGE_KEY, resolved);
  }

  syncUiModeToggles(document);

  if (previous !== resolved) {
    window.dispatchEvent(new CustomEvent("formgallery:uimodechange", { detail: { uiMode: resolved } }));
  }

  return resolved;
}

export function applyStoredUiMode() {
  return applyUiMode(getStoredUiMode(), { persist: false });
}

export function toggleUiMode() {
  return applyUiMode(getActiveUiMode() === CLASSIC_UI_MODE ? EDITORIAL_UI_MODE : CLASSIC_UI_MODE);
}

export function bindUiModeToggles(root = document) {
  if (!root?.querySelectorAll) return;

  for (const button of root.querySelectorAll("[data-ui-mode-toggle]")) {
    if (button.dataset.uiModeToggleBound === "1") continue;
    button.dataset.uiModeToggleBound = "1";
    button.addEventListener("click", () => {
      toggleUiMode();
    });
  }

  syncUiModeToggles(root);
}

export function renderUiModeToggle(options = {}) {
  const className = options.className ? ` ${options.className}` : "";
  const labelEditorial = options.labelEditorial || "Classic Layout";
  const labelClassic = options.labelClassic || "Editorial Layout";

  return `
    <button
      class="ui-mode-toggle${className}"
      type="button"
      data-ui-mode-toggle
      data-label-editorial="${labelEditorial}"
      data-label-classic="${labelClassic}"
      aria-pressed="false"
      aria-label="Switch to classic layout"
    >
      <span class="ui-mode-toggle-glyph" aria-hidden="true"></span>
      <span class="ui-mode-toggle-text" data-ui-mode-toggle-label>${labelEditorial}</span>
    </button>
  `;
}

export function getViewerThemePalette(theme = getActiveTheme()) {
  return VIEWER_PALETTES[normalizeTheme(theme)];
}

export function getTourThemePalette(theme = getActiveTheme()) {
  return TOUR_PALETTES[normalizeTheme(theme)];
}
