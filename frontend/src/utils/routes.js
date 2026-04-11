// Base path aware routing helper for GitHub Pages
// When hosted at /roof-cost-estimate/, all paths need that prefix
export const BASE = process.env.PUBLIC_URL || '';
export const url = (path) => `${BASE}${path}`;

// Strip base from pathname so route matching works regardless of host
export function getPathname() {
  const raw = window.location.pathname;
  const stripped = raw.startsWith(BASE) ? raw.slice(BASE.length) : raw;
  return stripped.replace(/\/$/, '') || '/';
}
