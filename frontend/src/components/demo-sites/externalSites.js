// Real, live client builds (as opposed to siteConfigs.js's fictional
// businesses rendered by our own DemoHome/DemoAbout/etc. templates) would be
// shown via an iframe at /website-example/:slug (see DemoSitePage.js),
// same pattern as cleanestimator.com's gallery. Empty for now -- there's no
// real, live roofing client site built yet to feature here. Add entries
// here (same shape as cleanestimator's version) once one exists; DemoGallery.js
// already handles an empty list, so nothing else needs to change.
const EXTERNAL_SITES = [];

export function getExternalSite(slug) {
  return EXTERNAL_SITES.find(s => s.slug === slug) || null;
}

export default EXTERNAL_SITES;
