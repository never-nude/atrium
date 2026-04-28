import { bindThemeToggles, bindUiModeToggles, renderThemeToggle, renderUiModeToggle } from "./theme.js";

export const DEFAULT_VIEWER_DEFAULTS = Object.freeze({
  spin: 0.12,
  zoom: 3.3,
  lightAngle: 34,
  lightPower: 2.2,
  exposure: 0.24,
  rough: 0.2,
  canManipulate: true,
  autoRotate: true,
  multiLight: true,
  wire: false
});

export const RANGE_IDS = Object.freeze(["spin", "zoom", "lightAngle", "lightPower", "exposure", "rough"]);
export const CHECKBOX_IDS = Object.freeze(["canManipulate", "autoRotate", "multiLight", "wire"]);

function checkedAttr(value) {
  return value ? " checked" : "";
}

function titleParagraph(className, value) {
  return value ? `<p class="${className}">${value}</p>` : "";
}

function labeledParagraph(className, label, value) {
  return value ? `<p class="${className}"><span class="meta-label">${label}</span> ${value}</p>` : "";
}

function renderSourceCard(source) {
  if (!source) return "";

  const links = Array.isArray(source.links)
    ? source.links
        .map((item) => `<a href="${item.url}" target="_blank" rel="noreferrer">${item.label}</a>`)
        .join(" | ")
    : "";

  return `
    <details class="source-card">
      <summary>Source & Attribution</summary>
      ${titleParagraph("source-copy", source.summary)}
      ${titleParagraph("source-links", links)}
      ${titleParagraph("source-note", source.note)}
    </details>
  `;
}

function renderPrintLinks(links) {
  if (!Array.isArray(links) || !links.length) return "";

  return `
    <p class="print-links">
      ${links
        .map((item) => {
          const attrs = [];
          if (item.download) attrs.push("download");
          if (item.external) attrs.push('target="_blank"', 'rel="noreferrer"');
          return `<a href="${item.url}" ${attrs.join(" ")}>${item.label}</a>`;
        })
        .join(" | ")}
    </p>
  `;
}

function renderPrintingCard(printing) {
  if (!printing) return "";

  const facts = Array.isArray(printing.facts)
    ? printing.facts
        .filter((item) => item?.label && item?.value)
        .map((item) => `<p class="print-fact"><span class="meta-label">${item.label}:</span> ${item.value}</p>`)
        .join("")
    : "";

  const directions = Array.isArray(printing.directions)
    ? printing.directions
        .filter(Boolean)
        .map((item) => `<li class="print-step">${item}</li>`)
        .join("")
    : "";

  return `
    <details class="source-card print-card">
      <summary>${printing.title || "3D Printing"}</summary>
      ${facts ? `<div class="print-facts">${facts}</div>` : ""}
      ${directions ? `<ol class="print-steps">${directions}</ol>` : ""}
      ${titleParagraph("print-note", printing.note)}
      ${renderPrintLinks(printing.links)}
    </details>
  `;
}

export function createViewerDefaults(overrides = {}) {
  return { ...DEFAULT_VIEWER_DEFAULTS, ...overrides };
}

export function renderViewerShell(config) {
  const defaults = createViewerDefaults(config.defaults);
  const statsLoading = config.statsLoading || "Loading high-fidelity STL sculpture...";
  const loadingText = config.loadingText || statsLoading;
  const pageTitle = config.pageTitle || `${config.viewerTitle} — Form Gallery`;
  const atriumHref = config.atriumHref || document.body.dataset.atriumHref || "/museum/";
  const searchParams = new URLSearchParams(window.location.search);
  const embedMode = config.embedMode || searchParams.get("embed") || searchParams.get("mode") || "";
  const viewerClasses = ["app", "viewer-app"];
  const sourceCard = renderSourceCard(config.source);
  const printingCard = renderPrintingCard(config.printing);

  if (embedMode) {
    viewerClasses.push(`viewer-app--${embedMode}`);
  }

  document.body.innerHTML = `
    <a class="skip-link" href="#stage">Skip to 3D viewer</a>
    <main class="${viewerClasses.join(" ")}">
      <section class="panel">
        <div class="viewer-utility-row">
          ${renderUiModeToggle({ className: "ui-mode-toggle--viewer" })}
          ${renderThemeToggle({ className: "theme-toggle--viewer" })}
        </div>

        <div class="viewer-header">
          <div class="viewer-object">
            <p class="viewer-kicker">Form Gallery</p>
            <h1 class="viewer-title" id="viewerTitle">${config.viewerTitle}</h1>
            ${titleParagraph("viewer-artist", config.subtitle)}
            ${labeledParagraph("viewer-medium", "Medium:", config.medium)}
            ${labeledParagraph("viewer-dimensions", "Dimensions:", config.dimensions)}
            ${labeledParagraph("viewer-location", config.locationLabel || "Location:", config.location)}
          </div>

          <div class="viewer-meta" aria-labelledby="viewerMetadataLabel">
            <p class="viewer-section-label" id="viewerMetadataLabel">Publication Metadata</p>
            <p id="stats" class="viewer-stats">${statsLoading}</p>
            ${sourceCard ? `<div class="viewer-source">${sourceCard}</div>` : ""}
            ${printingCard ? `<div class="viewer-printing">${printingCard}</div>` : ""}
          </div>
        </div>

        <details class="viewer-controls" open>
          <summary>Viewer Controls</summary>

          <div class="viewer-controls-panel">
            <input id="spin" type="hidden" value="${defaults.spin.toFixed(2)}" />
            <output id="spinv" hidden>${defaults.spin.toFixed(2)}</output>
            <div class="grid">
              <div class="control"><label for="zoom">Zoom</label><input id="zoom" type="range" min="0.55" max="6.4" step="0.01" value="${defaults.zoom.toFixed(2)}" /><output id="zoomv">${defaults.zoom.toFixed(2)}</output></div>
              <div class="control"><label for="lightAngle">Key Angle</label><input id="lightAngle" type="range" min="-180" max="180" step="1" value="${defaults.lightAngle}" /><output id="lightAnglev">${Number(defaults.lightAngle).toFixed(2)}</output></div>
              <div class="control"><label for="lightPower">Light Power</label><input id="lightPower" type="range" min="0.2" max="4.5" step="0.01" value="${defaults.lightPower.toFixed(2)}" /><output id="lightPowerv">${defaults.lightPower.toFixed(2)}</output></div>
              <div class="control"><label for="exposure">Exposure</label><input id="exposure" type="range" min="0" max="2.8" step="0.01" value="${defaults.exposure.toFixed(2)}" /><output id="exposurev">${defaults.exposure.toFixed(2)}</output></div>
              <div class="control"><label for="rough">Roughness</label><input id="rough" type="range" min="0.2" max="1" step="0.01" value="${defaults.rough.toFixed(2)}" /><output id="roughv">${defaults.rough.toFixed(2)}</output></div>
            </div>

            <div class="viewer-controls-toolbar">
              <div class="viewer-toggle-row">
                <label><input id="canManipulate" type="checkbox"${checkedAttr(defaults.canManipulate)} /> Manipulate</label>
                <label><input id="autoRotate" type="checkbox"${checkedAttr(defaults.autoRotate)} /> Auto Rotate</label>
                <label><input id="multiLight" type="checkbox"${checkedAttr(defaults.multiLight)} /> Multi-Light</label>
                <label><input id="wire" type="checkbox"${checkedAttr(defaults.wire)} /> Wireframe</label>
              </div>

              <div class="viewer-action-row">
                <button id="frontBtn" class="btn" type="button">Front</button>
                <button id="resetBtn" class="btn" type="button">Reset</button>
                <button id="museumBtn" class="btn" type="button">Back to Atrium</button>
              </div>
            </div>

            <p class="viewer-controls-hint">${config.controlsHint || "Drag to rotate. Scroll or pinch to zoom. Shift-drag to pan."}</p>
          </div>
        </details>
      </section>

      <section class="viewer-stage-shell" aria-label="3D sculpture viewer">
        <div id="stage" tabindex="-1" aria-busy="true">
          <div class="loading" id="loading" role="status" aria-live="polite" data-state="loading">
            <span class="loading-eyebrow">Preparing Viewer</span>
            <strong class="loading-title" data-loading-title>Building the gallery stage</strong>
            <span class="loading-message" data-loading-message>${loadingText}</span>
          </div>
        </div>
      </section>
    </main>
  `;

  document.title = pageTitle;
  document.body.dataset.atriumHref = atriumHref;
  bindThemeToggles(document.body);
  bindUiModeToggles(document.body);

  return createViewerUi(defaults);
}

export function createViewerUi(defaults) {
  const stage = document.getElementById("stage");
  const stats = document.getElementById("stats");
  const loading = document.getElementById("loading");
  const loadingTitle = document.querySelector("[data-loading-title]");
  const loadingMessage = document.querySelector("[data-loading-message]");

  function n(id) {
    return Number(document.getElementById(id).value);
  }

  function refreshReadouts() {
    for (const id of RANGE_IDS) {
      document.getElementById(`${id}v`).textContent = n(id).toFixed(2);
    }
  }

  function setDefaults() {
    for (const id of RANGE_IDS) {
      document.getElementById(id).value = String(defaults[id]);
    }
    for (const id of CHECKBOX_IDS) {
      document.getElementById(id).checked = defaults[id];
    }
    refreshReadouts();
  }

  function setLoadingState(message, options = {}) {
    if (!loading) return;
    const state = options.state || "loading";
    loading.dataset.state = state;
    if (loadingTitle) {
      loadingTitle.textContent =
        options.title ||
        (state === "error" ? "Unable to load this sculpture" : "Building the gallery stage");
    }
    if (loadingMessage) {
      loadingMessage.textContent = message;
    } else {
      loading.textContent = message;
    }
    if (stage) {
      stage.setAttribute("aria-busy", state === "ready" ? "false" : "true");
    }
  }

  function clearLoading() {
    if (stage) {
      stage.setAttribute("aria-busy", "false");
    }
    loading?.remove();
  }

  function bindControls(handlers = {}) {
    for (const id of RANGE_IDS) {
      document.getElementById(id).addEventListener("input", () => {
        refreshReadouts();
        handlers.onRangeInput?.(id);
      });
    }

    for (const id of CHECKBOX_IDS) {
      document.getElementById(id).addEventListener("change", () => {
        handlers.onCheckboxChange?.(id);
      });
    }

    document.getElementById("frontBtn").addEventListener("click", () => {
      handlers.onFront?.();
    });

    document.getElementById("resetBtn").addEventListener("click", () => {
      handlers.onReset?.();
    });

    document.getElementById("museumBtn").addEventListener("click", () => {
      if (handlers.onMuseum) {
        handlers.onMuseum();
      } else {
        window.location.href = document.body.dataset.atriumHref || "/museum/";
      }
    });
  }

  return {
    stage,
    stats,
    loading,
    defaults,
    n,
    setLoadingState,
    clearLoading,
    refreshReadouts,
    setDefaults,
    bindControls
  };
}
