// Content engine for the demo sites' dedicated per-service and per-city
// pages -- mirrors the real client sites' seo-content.ts (unique meta
// title/description/H1/intro/FAQs per URL, not one combined listing page).
// Several businesses x ~5 services x ~5 cities is too much to hand-author
// one page at a time, so instead of a single fixed prose block per page,
// each page is assembled from a service-type (or city-flavor) content block
// plus this business's own name/city/tagline/services -- every title, meta
// description, H1, and FAQ answer is still unique per URL, just built from
// reusable parts instead of typed out separately.
import IMAGE_POOL, { imagePath } from './demoImagePool';

export function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export function serviceSlugFor(service) {
  return slugify(service.title);
}

export function areaSlugFor(area) {
  return slugify(area);
}

// --- Service-type content library --------------------------------------
// Keyed by normalized title. Covers every service title used across
// siteConfigs.js; a keyword fallback below catches anything new.
const SERVICE_TYPES = {
  'asphalt shingle roofing': 'shingle',
  'shingle roof replacement': 'shingle',
  'full roof replacement': 'shingle',
  'metal roofing': 'metal',
  'standing seam metal roof': 'metal',
  'tile roofing': 'tile',
  'flat & tpo roofing': 'flat',
  'flat roof repair': 'flat',
  'roof repair': 'repair',
  'storm damage repair': 'repair',
  'leak repair': 'repair',
  'roof inspection': 'inspection',
  'pre-purchase inspection': 'inspection',
  'gutter installation': 'gutters',
  'gutters & guards': 'gutters',
  'commercial roofing': 'commercial',
};

function typeFor(service) {
  const key = service.title.toLowerCase();
  if (SERVICE_TYPES[key]) return SERVICE_TYPES[key];
  if (key.includes('shingle') || key.includes('replace')) return 'shingle';
  if (key.includes('metal') || key.includes('standing seam')) return 'metal';
  if (key.includes('tile') || key.includes('clay') || key.includes('slate')) return 'tile';
  if (key.includes('flat') || key.includes('tpo') || key.includes('epdm') || key.includes('bitumen')) return 'flat';
  if (key.includes('repair') || key.includes('leak') || key.includes('storm') || key.includes('damage')) return 'repair';
  if (key.includes('inspect')) return 'inspection';
  if (key.includes('gutter')) return 'gutters';
  if (key.includes('commercial')) return 'commercial';
  return 'shingle';
}

const TYPE_LIBRARY = {
  shingle: {
    blurb: 'a full tear-off and asphalt shingle replacement, done right the first time',
    idealFor: ['Homeowners with a roof past 20 years old or showing granule loss', 'Anyone who had storm damage and needs a full replacement, not a patch', 'Homeowners selling soon who want a fresh roof for inspection'],
    included: [
      { area: 'Tear-Off', tasks: ['Old shingles, underlayment & flashing fully removed', 'Decking inspected and any rotted boards replaced', 'Jobsite cleared and magnet-swept for nails'] },
      { area: 'Installation', tasks: ['New synthetic underlayment & ice/water barrier installed', 'Architectural shingles installed to manufacturer spec', 'New flashing around vents, chimneys & valleys'] },
      { area: 'Finish', tasks: ['Ridge vent & cap shingles installed', 'Full cleanup and debris haul-away', 'Final walkthrough with photos'] },
    ],
    whyExtra: { title: 'Built for the Full Lifespan, Not Just the Install', text: 'Underlayment, flashing, and ventilation matter as much as the shingles themselves -- we install for the full 25-30 year lifespan, not just a good-looking finish.' },
    faqs: [
      { q: 'How long does a full shingle replacement take in {area}?', a: 'Most homes in {area} take 1-3 days depending on size and roof complexity. Weather can shift the schedule, and we\'ll keep you updated if it does.' },
      { q: 'Do you replace rotted decking as part of the job?', a: "Yes -- any rotted or damaged decking found during tear-off is replaced before new shingles go on, priced as a line item so there are no surprises." },
      { q: 'What shingle brands do you install?', a: `${'{business}'} installs major architectural shingle lines with manufacturer-backed warranties -- we'll walk you through the options and colors during your estimate.` },
      { q: 'Will my yard and landscaping be protected?', a: 'Yes -- tarps go down around the work area and we magnet-sweep the yard for stray nails before we leave.' },
    ],
  },
  metal: {
    blurb: 'a standing-seam metal roof built for decades of weather, not just one season',
    idealFor: ['Homeowners wanting a 40-70 year roof instead of a 20-year one', 'Anyone in a high-wind, hail, or wildfire area wanting extra durability', 'Homeowners who want lower long-term maintenance and better energy efficiency'],
    included: [
      { area: 'Prep', tasks: ['Old roofing removed or metal installed over code-approved decking', 'Underlayment & ice/water barrier installed', 'Decking inspected and repaired as needed'] },
      { area: 'Installation', tasks: ['Standing-seam panels installed to manufacturer spec', 'Hidden fastener system for a clean finish', 'Flashing, trim & ridge caps fitted precisely'] },
      { area: 'Finish', tasks: ['Panel seams checked for proper lock engagement', 'Full cleanup and debris haul-away', 'Final walkthrough with photos'] },
    ],
    whyExtra: { title: 'Precision Matters More on Metal', text: 'A metal roof lives or dies on how precisely the panels, seams, and flashing are installed -- our crews are trained specifically on standing-seam installation, not general roofing alone.' },
    faqs: [
      { q: 'How much more does metal cost than asphalt shingles in {area}?', a: 'Metal typically runs higher upfront than asphalt, but with a 40-70 year lifespan versus 20-30 for shingles, the cost per year is often lower. We\'ll walk through both in your estimate.' },
      { q: 'Is a metal roof noisy in the rain?', a: "Not with proper installation -- solid decking and underlayment underneath the panels absorb sound, so it's not noticeably louder than shingles from inside." },
      { q: 'Can metal roofing help with energy bills?', a: 'Yes -- reflective metal roofing can reduce attic heat buildup, which many homeowners in {area} notice in their summer cooling costs.' },
      { q: 'Will a metal roof attract lightning?', a: "No -- that's a common myth. Metal doesn't attract lightning any more than other roofing materials, and it's actually non-combustible if struck." },
    ],
  },
  tile: {
    blurb: 'clay or concrete tile roofing installed and flashed for long-term weather resistance',
    idealFor: ['Homeowners wanting a tile roof\'s look and 50+ year lifespan', 'Anyone replacing cracked, slipped, or missing tiles', 'Homes in a style (Spanish, Mediterranean, coastal) where tile fits the architecture'],
    included: [
      { area: 'Prep', tasks: ['Old tile & underlayment removed', 'Decking inspected and repaired as needed', 'New underlayment & battens installed'] },
      { area: 'Installation', tasks: ['Tile installed and fastened to manufacturer spec', 'Ridge, hip & valley tiles fitted and sealed', 'Flashing installed around penetrations'] },
      { area: 'Finish', tasks: ['Broken or mismatched tiles replaced for a uniform finish', 'Full cleanup and debris haul-away', 'Final walkthrough with photos'] },
    ],
    whyExtra: { title: 'Weight & Structure Checked First', text: 'Tile is heavy -- before any installation we confirm the structure can support it, so the roof is sound for decades, not just the first few years.' },
    faqs: [
      { q: 'How long does tile roofing last in {area}?', a: 'Clay and concrete tile commonly lasts 50 years or more with proper installation and occasional maintenance -- one of the longest-lasting roofing materials available.' },
      { q: 'Can you match existing tile if I only need a partial repair?', a: "We do our best to source a close match for existing tile -- exact matches depend on age and manufacturer, which we'll confirm during your estimate." },
      { q: 'Is tile roofing heavier than my house can handle?', a: "We check your roof structure before recommending tile -- most homes built for it handle the weight fine, but we'll flag it upfront if reinforcement is needed." },
      { q: 'Do you repair cracked or slipped tiles without a full replacement?', a: 'Yes -- individual tile repair and replacement is available in {area} without redoing the whole roof, as long as the underlayment underneath is still sound.' },
    ],
  },
  flat: {
    blurb: 'TPO, EPDM, or modified bitumen roofing installed for proper drainage and seam integrity',
    idealFor: ['Homeowners or businesses with a flat or low-slope roof section', 'Anyone dealing with ponding water or a failing membrane', 'Additions, porches, or garages with a flat roof needing replacement'],
    included: [
      { area: 'Prep', tasks: ['Old membrane removed down to the deck', 'Decking inspected and repaired as needed', 'Drainage slope checked and corrected if needed'] },
      { area: 'Installation', tasks: ['New insulation board installed where needed', 'TPO, EPDM, or modified bitumen membrane installed', 'Seams heat-welded or sealed per manufacturer spec'] },
      { area: 'Finish', tasks: ['Flashing & edge detail sealed', 'Full cleanup and debris haul-away', 'Final walkthrough with photos'] },
    ],
    whyExtra: { title: 'Drainage Is the Whole Game on Flat Roofs', text: "Most flat roof failures trace back to poor drainage or a bad seam, not the membrane material itself -- we correct slope issues and weld seams properly instead of just relaying the same problem." },
    faqs: [
      { q: 'How long does a flat roof membrane last in {area}?', a: 'TPO and EPDM typically last 20-30 years with proper installation and drainage; modified bitumen is usually 15-20. We\'ll recommend what fits your roof and budget.' },
      { q: 'Why does my flat roof keep ponding water?', a: "Ponding usually means the slope or drainage was never correct to begin with -- we check and correct that as part of any flat roof replacement, not just relay a new membrane over the same problem." },
      { q: 'Can you repair a small leak without replacing the whole membrane?', a: "Yes -- isolated leaks or seam failures can often be repaired without a full replacement, as long as the rest of the membrane is still in good shape." },
      { q: 'Do you work on commercial flat roofs in {area}?', a: `Yes -- ${'{business}'} handles both residential flat-roof sections and commercial low-slope roofing throughout ${'{area}'}.` },
    ],
  },
  repair: {
    blurb: 'leaks, damaged shingles, and storm damage fixed fast, without pushing an unnecessary full replacement',
    idealFor: ['Homeowners with an active leak needing a fast response', 'Anyone with storm or wind damage to a section of the roof', 'Homes with a few damaged or missing shingles, not a full roof failure'],
    included: [
      { area: 'Diagnosis', tasks: ['Full roof inspection to find the actual source of the leak', 'Photos documented for insurance if storm-related', 'Honest assessment of repair vs. replacement'] },
      { area: 'Repair', tasks: ['Damaged or missing shingles replaced', 'Flashing resealed around vents, chimneys & valleys', 'Leak point sealed and tested'] },
      { area: 'Follow-Up', tasks: ['Interior water damage flagged if present', 'Photos provided for your records or insurance', 'Warranty on the repair work'] },
    ],
    whyExtra: { title: 'We Diagnose the Cause, Not Just Patch the Symptom', text: "A leak in one room doesn't always mean the roof above it is the actual source -- we trace it to the real cause before repairing, so the same leak doesn't come back somewhere else." },
    faqs: [
      { q: 'How fast can you get to a leak in {area}?', a: 'Active leaks get priority scheduling -- most repair calls in {area} are seen within 24-48 hours, faster for emergencies.' },
      { q: 'Will you help with my insurance claim for storm damage?', a: 'Yes -- we document damage with photos and a written assessment you can submit with your claim, and can walk an adjuster through the roof if needed.' },
      { q: 'How do I know if I need a repair or a full replacement?', a: "We'll give you an honest answer during the inspection -- isolated damage on an otherwise sound roof gets a repair recommendation, not an upsell to a full replacement." },
      { q: 'Do repairs come with a warranty?', a: `Yes -- ${'{business}'} warranties repair work; ask during your estimate for the specific terms on your job.` },
    ],
  },
  inspection: {
    blurb: 'a full roof inspection with a written report, no pressure to book additional work',
    idealFor: ['Buyers wanting a roof check before closing on a home', 'Homeowners wondering how much life is left in their current roof', 'Anyone preparing for insurance renewal or storm season'],
    included: [
      { area: 'Exterior', tasks: ['Shingles, flashing & ridge checked for damage or wear', 'Gutters & downspouts checked for proper drainage', 'Chimney, vents & penetrations inspected for sealing issues'] },
      { area: 'Attic & Interior', tasks: ['Attic checked for leaks, moisture & ventilation issues', 'Decking checked for soft spots or sagging', 'Interior ceilings checked for water staining'] },
      { area: 'Report', tasks: ['Written report with photos of any issues found', 'Honest estimate of remaining roof life', 'No-pressure recommendations, repair or replace'] },
    ],
    whyExtra: { title: 'A Report You Can Actually Use', text: 'Buyers, sellers, and insurance companies all want documentation -- you get a written report with photos, not just a verbal "looks fine."' },
    faqs: [
      { q: 'How long does a roof inspection take in {area}?', a: 'Most inspections take 30-60 minutes on-site, with the written report following within a day or two.' },
      { q: 'Do I need an inspection before buying a home?', a: "It's one of the most common reasons buyers in {area} request an inspection -- a roof's remaining life is a major factor in negotiating a home purchase." },
      { q: 'Will you try to upsell me on repairs I don\'t need?', a: "No -- the inspection report is honest about what's actually needed versus what's cosmetic or can wait, whether or not you end up booking work with us." },
      { q: 'Can an inspection help with my insurance premium?', a: 'Some insurers offer better rates for a roof in documented good condition -- a written inspection report can support that conversation with your provider.' },
    ],
  },
  gutters: {
    blurb: 'seamless gutter installation and guards, sized and sloped for your actual roofline',
    idealFor: ['Homeowners replacing old, sagging, or leaking gutters', 'New roof installs that need gutters sized to the new roofline', 'Anyone tired of cleaning gutters and wanting guards installed'],
    included: [
      { area: 'Removal', tasks: ['Old gutters & downspouts removed', 'Fascia checked for rot and repaired as needed', 'Debris cleared from the work area'] },
      { area: 'Installation', tasks: ['Seamless gutters formed on-site to fit your roofline', 'Proper slope set for correct drainage', 'Downspouts positioned to route water away from the foundation'] },
      { area: 'Guards', tasks: ['Gutter guards installed on request', 'Hangers spaced for snow & debris load in your area', 'Final walkthrough and water test'] },
    ],
    whyExtra: { title: 'Formed On-Site, Not Pre-Cut', text: "Seamless gutters are formed to your home's actual measurements on the day of install, not pre-cut to a standard length -- fewer joints means fewer leak points down the road." },
    faqs: [
      { q: 'Do I need new gutters with a new roof in {area}?', a: "Not always, but it's a good time to check -- old gutters sized for a prior roofline sometimes don't drain correctly once new shingles or flashing changes the water path." },
      { q: 'Are gutter guards worth it?', a: 'For most homes in {area} with nearby trees, yes -- guards significantly cut down on the debris that causes clogging and sagging over time.' },
      { q: 'What causes gutters to pull away from the house?', a: 'Usually it\'s water weight from clogged gutters or hangers spaced too far apart for the snow/debris load -- we space hangers correctly during installation to prevent this.' },
      { q: 'Can you match my gutter color to my trim?', a: `Yes -- ${'{business}'} offers a range of standard colors, and seamless gutters are formed to order so color and length aren't an issue.` },
    ],
  },
  commercial: {
    blurb: 'commercial roof installation and repair scheduled around your business hours',
    idealFor: ['Business owners with a flat or low-slope commercial roof', 'Property managers overseeing multiple commercial buildings', 'Anyone needing roof work that can\'t disrupt daily operations'],
    included: [
      { area: 'Assessment', tasks: ['Full roof & drainage assessment', 'Written scope and timeline before work begins', 'Coordination with property management or ownership'] },
      { area: 'Work', tasks: ['Installation or repair scheduled around business hours when possible', 'Site kept secured and clean throughout the job', 'Regular progress updates for larger projects'] },
      { area: 'Close-Out', tasks: ['Final walkthrough with photos', 'Documentation provided for records or insurance', 'Warranty paperwork on completed work'] },
    ],
    whyExtra: { title: 'Scheduled Around Your Operations', text: "Commercial roof work is planned to minimize disruption to your business -- loud or disruptive phases scheduled outside operating hours whenever the job allows it." },
    faqs: [
      { q: 'Can you work around our business hours in {area}?', a: 'Yes -- we coordinate scheduling with property management or ownership to minimize disruption wherever the project allows it.' },
      { q: 'Do you handle multi-building or multi-tenant properties?', a: `Yes -- ${'{business}'} works with property managers overseeing multiple commercial buildings, with one point of contact for scheduling and billing.` },
      { q: 'What roofing systems do you install on commercial buildings?', a: 'TPO, EPDM, modified bitumen, and metal are all common for commercial roofs -- we\'ll recommend what fits your building and budget.' },
      { q: 'Can you provide documentation for our insurance or records?', a: 'Yes -- full documentation and photos are provided at project close-out for your records or insurance requirements.' },
    ],
  },
};

function interpolate(str, vars) {
  return str.replace(/\{(\w+)\}/g, (_, key) => vars[key] ?? '');
}

export function getServicePageList(site) {
  return site.services.map((service) => ({ ...service, slug: serviceSlugFor(service) }));
}

export function getServicePageContent(site, slug) {
  const service = site.services.find((s) => serviceSlugFor(s) === slug);
  if (!service) return null;
  const type = TYPE_LIBRARY[typeFor(service)];
  const vars = { business: site.businessName, city: site.city, state: site.state, area: site.city, service: service.title.toLowerCase() };

  return {
    slug,
    name: service.title,
    desc: service.desc,
    metaTitle: `${service.title} in ${site.city}, ${site.state} | ${site.businessName}`,
    metaDescription: `${service.title} in ${site.city}, ${site.state} from ${site.businessName} -- ${type.blurb}. Licensed & insured crews, upfront pricing. Get a free estimate.`,
    h1: `${service.title} in ${site.city}, ${site.state}`,
    intro: [
      `${service.desc} ${site.businessName} brings ${type.blurb} to every job across ${site.city} and the surrounding area.`,
      `Every job is backed by a licensed, insured crew and upfront pricing before any work begins.`,
    ],
    idealFor: type.idealFor,
    included: type.included,
    whyUs: [
      { title: `Why ${site.city} Trusts ${site.businessName}`, text: `${site.tagline} Every crew is licensed, insured, and trained to the same standard for every ${service.title.toLowerCase()} job.` },
      { title: interpolate(type.whyExtra.title, vars), text: interpolate(type.whyExtra.text, vars) },
    ],
    faqs: type.faqs.map((f) => ({ q: interpolate(f.q, vars), a: interpolate(f.a, vars) })),
    image: imagePath(IMAGE_POOL[(slugHash(slug) + slugHash(site.slug)) % IMAGE_POOL.length].file),
    imageNote: IMAGE_POOL[(slugHash(slug) + slugHash(site.slug)) % IMAGE_POOL.length].label,
  };
}

function slugHash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) % 97;
  return h;
}

// --- Area-flavor content library ----------------------------------------
const AREA_FLAVORS = [
  { title: 'Older Homes & Original Roof Lines', text: 'Plenty of homes here were built decades ago, with roof lines and decking that need a careful look before any new material goes on.' },
  { title: 'Storm & Wind Exposure', text: 'This area sees its share of severe weather -- wind-rated shingles and proper flashing make a real difference in how a roof holds up here.' },
  { title: 'Family Homes & Tight Timelines', text: 'With kids and daily schedules to work around, most homeowners here want a clear start and finish date, not an open-ended project.' },
  { title: 'New Construction & Builder-Grade Roofs', text: 'Newer homes here often shipped with builder-grade roofing -- a lot of our repair and replacement calls come from upgrading past that baseline.' },
  { title: 'Coastal & Humidity-Prone Homes', text: 'Salt air and humidity accelerate wear on flashing and fasteners, so roofs here often need attention sooner than inland homes of the same age.' },
  { title: 'Steep & Complex Roof Lines', text: 'A lot of homes in this area have steep pitches or multiple roof planes, which changes both the safety approach and the materials that make sense.' },
  { title: 'High Tree Coverage', text: 'Heavy tree coverage here means more debris buildup and gutter maintenance than homes in more open areas.' },
  { title: 'Larger Lots & Rural Properties', text: 'Homes with more square footage and outbuildings need a roofing plan scoped to the actual property, not a one-size estimate.' },
];

function areaFlavorsFor(area, site) {
  const h = slugHash(area + site.slug);
  const a = AREA_FLAVORS[h % AREA_FLAVORS.length];
  const b = AREA_FLAVORS[(h + 3) % AREA_FLAVORS.length];
  return a === b ? [a, AREA_FLAVORS[(h + 5) % AREA_FLAVORS.length]] : [a, b];
}

export function getAreaPageList(site) {
  return site.serviceAreas.map((area) => ({ area, slug: areaSlugFor(area) }));
}

export function getAreaPageContent(site, slug) {
  const area = site.serviceAreas.find((a) => areaSlugFor(a) === slug);
  if (!area) return null;
  const flavors = areaFlavorsFor(area, site);
  const nearby = site.serviceAreas.filter((a) => a !== area).slice(0, 4);

  return {
    slug,
    area,
    metaTitle: `Roofing Contractor in ${area}, ${site.state} | ${site.businessName}`,
    metaDescription: `${site.businessName} provides roof replacement, repair, and inspections in ${area}, ${site.state}. Licensed & insured crews, upfront pricing. Free estimate.`,
    h1: `Roofing Contractor in ${area}, ${site.state}`,
    intro: [
      `${site.businessName} is proud to serve ${area} as part of our coverage across greater ${site.city}. Whether you need a full roof replacement or a single repair, our licensed, insured crews bring the same standard and upfront pricing to every job in ${area}.`,
      flavors[0].text,
    ],
    localNotes: flavors,
    services: site.services.map((s) => ({ title: s.title, slug: serviceSlugFor(s) })),
    nearby,
    faqs: [
      { q: `Does ${site.businessName} serve all of ${area}?`, a: `Yes -- ${area} is fully within our regular service area, alongside ${nearby.slice(0, 2).join(' and ') || 'nearby communities'}.` },
      { q: `How much does a roof replacement cost in ${area}?`, a: `Pricing depends on roof size, pitch, and material. Request a free estimate and we'll give you an upfront price before any work begins.` },
      { q: `How quickly can I get on the schedule in ${area}?`, a: `Non-emergency jobs in ${area} are typically scheduled within one to two weeks; active leaks and storm damage get priority.` },
      { q: `Do you work with insurance claims for storm damage in ${area}?`, a: `Yes -- we document damage with photos and a written assessment you can submit with your claim, and can walk an adjuster through the roof if needed.` },
    ],
  };
}
