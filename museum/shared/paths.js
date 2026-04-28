const PROJECT_BASE_PATHS = Object.freeze(["/atrium"]);

function normalizePathname(pathname = "/") {
  return pathname.startsWith("/") ? pathname : `/${pathname}`;
}

function configuredBasePath() {
  const configured = window.FORM_GALLERY_BASE_PATH;
  return typeof configured === "string" && configured.startsWith("/") ? configured.replace(/\/+$/, "") : "";
}

export function getSiteBasePath(pathname = window.location.pathname) {
  const configured = configuredBasePath();
  if (configured) return configured;

  const normalized = normalizePathname(pathname);
  return PROJECT_BASE_PATHS.find((basePath) => (
    normalized === basePath || normalized.startsWith(`${basePath}/`)
  )) || "";
}

export function stripSiteBasePath(pathname = window.location.pathname) {
  const normalized = normalizePathname(pathname);
  const basePath = getSiteBasePath(normalized);
  if (!basePath) return normalized;
  if (normalized === basePath) return "/";
  return normalized.startsWith(`${basePath}/`) ? normalized.slice(basePath.length) || "/" : normalized;
}

export function withSiteBasePath(path) {
  if (!path || typeof path !== "string") return path;
  if (/^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i.test(path)) return path;
  if (!path.startsWith("/")) return path;

  const basePath = getSiteBasePath();
  if (!basePath || path === basePath || path.startsWith(`${basePath}/`)) return path;
  return `${basePath}${path}`;
}
