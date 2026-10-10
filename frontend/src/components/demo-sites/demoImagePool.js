// Unlike the cleaning-demo sites' version of this file, there's no pool of
// real roofing photos checked into this repo to draw from (roofingcal.com
// itself uses hand-drawn illustrations, not photography -- see the main
// site's design notes). Every gallery slot below renders through
// ImagePlaceholder.js's dashed-box fallback instead of a real photo, each
// with a `label` describing exactly what to shoot/source for that slot --
// swap in a real file path once real job-site photos exist.
const IMAGE_POOL = [
  { file: null, label: 'full roof replacement, finished, exterior shot' },
  { file: null, label: 'roofer installing architectural shingles' },
  { file: null, label: 'close-up of new shingle roof texture and lines' },
  { file: null, label: 'metal standing-seam roof, finished exterior' },
  { file: null, label: 'roof repair in progress, close-up' },
  { file: null, label: 'tile roof, finished exterior' },
  { file: null, label: 'roofing crew on a ladder at a job site' },
  { file: null, label: 'new gutters installed along a roofline' },
  { file: null, label: 'roof inspection, close-up of flashing and vents' },
  { file: null, label: 'flat/TPO roof, finished commercial exterior' },
];

export function imagePath(file) {
  return file ? `/images/demo-stock/${file}` : null;
}

// Deterministic small int from a slug string, so each business's gallery
// offset is stable across renders without threading an index prop through.
function seedFromSlug(slug) {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) % IMAGE_POOL.length;
  return h;
}

/**
 * Builds a per-site gallery by pairing this site's own services with photo
 * slots from the shared pool, offset by a hash of the site's slug so
 * neighboring businesses don't get an identical image set. Every slot is
 * currently a placeholder (see IMAGE_POOL above) since no real file exists
 * for any of them yet.
 */
export function buildGalleryItems(site) {
  const seed = seedFromSlug(site.slug);
  const services = site.services.slice(0, 5);
  return services.map((service, i) => {
    const img = IMAGE_POOL[(seed + i) % IMAGE_POOL.length];
    return {
      id: `${site.slug}-gallery-${i}`,
      title: service.title,
      category: service.title,
      location: `${site.city}, ${site.state}`,
      image: imagePath(img.file),
      alt: `${img.label.charAt(0).toUpperCase() + img.label.slice(1)} — ${service.title.toLowerCase()} in ${site.city}, ${site.state}`,
      note: img.label,
      description: service.desc,
    };
  });
}

export default IMAGE_POOL;
