// Five fictional demo roofing businesses for the /website-example gallery.
// Names, logos, "about" stories, and testimonials are all invented -- none
// represent a real company. Addresses use real city/state/ZIP combinations
// in a realistic street-address format (so the page doesn't read as an
// obvious placeholder like "123 Fake St"), but the street-level address
// itself is not a real, occupied business location. No real photos exist
// for any of these yet -- every image field below is left unset so
// ImagePlaceholder.js renders a labeled placeholder box instead of a
// broken or misleading photo.
//
// `layout` picks which of the three structurally different page templates
// a site uses (see DemoSiteLayout.js / DemoHome.js etc.) -- grouped so
// palette + layout + type pairing all vary together, not just color.

// Generic, business-agnostic questions that build trust before a first-time
// visitor commits to an estimate -- lightly personalized with the business
// name/city rather than written fresh per site.
export function getFaqs(site) {
  return [
    { q: 'Do you offer free estimates?', a: `Yes. ${site.businessName} gives every ${site.city} homeowner a free, no-obligation roof estimate -- in person, with real measurements, not a rough guess over the phone.` },
    { q: 'Are you licensed and insured?', a: `Yes. ${site.businessName} is fully licensed and insured, and every crew member carries their own coverage before they ever step on a roof.` },
    { q: 'How long does a typical roof replacement take?', a: 'Most residential roofs take 1-3 days from tear-off to final cleanup, depending on size, pitch, and weather.' },
    { q: 'Do you help with insurance claims for storm damage?', a: "Yes -- we document damage with photos and a written assessment you can submit with your claim, and can walk your adjuster through the roof if needed." },
    { q: 'What if I\'m not happy with the finished work?', a: 'Every job is backed by a workmanship warranty -- tell us within the warranty period and we\'ll come back and make it right.' },
  ];
}

const SITES = [
  {
    slug: 'ironridge-roofing',
    businessName: 'Ironridge Roofing',
    logoLabel: 'IR',
    tagline: 'Hail-tough roofing for Denver homes, built to take the next storm.',
    layout: 'A',
    fontHeading: "'Fraunces', Georgia, serif",
    fontBody: "'Poppins', Arial, sans-serif",
    colors: { primary: '#7c2d12', primaryDark: '#5c2108', accent: '#d97706', ink: '#241a14', bg: '#faf6ee', bgAlt: '#f1ead9', card: '#ffffff', border: '#e2d9c3', textMuted: '#6b5f52' },
    phone: '(303) 555-0142',
    email: 'hello@ironridgeroofing.com',
    address: '4521 Colfax Ave, Suite 2',
    city: 'Denver', state: 'CO', zip: '80220',
    founded: 2011,
    aboutStory: [
      "Ironridge Roofing started in 2011 after a hailstorm tore through east Denver and left founder Pete Kowalski's own roof — and half his neighborhood's — in rough shape. He was a framing contractor at the time, not a roofer, but he spent that summer learning everything about hail-rated materials and proper installation, and never looked back.",
      "Over a decade later, we're still Denver-owned, still specializing in the hail and wind damage that's common along the Front Range, and still training every crew member on the same installation standard Pete set from day one. A roof here has to survive more than most — we build for that.",
    ],
    services: [
      { title: 'Asphalt Shingle Roofing', desc: 'Impact-rated shingle replacement built for hail and high wind.' },
      { title: 'Metal Roofing', desc: 'Standing-seam metal for homeowners who want 40+ years of durability.' },
      { title: 'Roof Repair', desc: 'Fast response for storm damage, leaks, and missing shingles.' },
      { title: 'Roof Inspection', desc: 'Full written report before you buy, sell, or file an insurance claim.' },
      { title: 'Gutter Installation', desc: 'Seamless gutters sized and sloped for Colorado snow load.' },
    ],
    serviceAreas: ['Denver', 'Aurora', 'Lakewood', 'Centennial', 'Littleton', 'Arvada'],
    testimonials: [
      { name: 'Renee K.', text: 'Our roof took a direct hit from a hailstorm and Ironridge handled the insurance paperwork as much as the actual roof. Painless process.' },
      { name: 'Doug M.', text: 'Fast, honest, and the crew actually cleaned up after themselves. Switched from two other companies before landing here.' },
    ],
    aboutImage: null,
    aboutImageNote: 'Finished asphalt shingle roof on a Denver-area home, clear mountain-view sky.',
    whyUs: [
      {
        headline: 'Built for the Front Range, Not a Generic Climate',
        body: ["Hail, high wind, and big temperature swings put more stress on a Denver roof than most places. We install impact-rated materials and flash every penetration like the next storm is already on its way, because around here, it usually is."],
        checklist: ['Impact-rated shingle options on every job', 'Trained on Colorado wind & hail codes', 'Direct insurance claim support', 'Fully licensed & insured'],
        imageNote: 'Finished asphalt shingle roof on a Denver-area home, clear mountain-view sky in the background.',
      },
      {
        headline: 'A Crew You Can Actually Trust',
        body: ["Every installer is background-checked and trained on the same standard Pete set in 2011. You'll get a written estimate before anything starts, and a straight answer about repair versus replacement."],
        checklist: ['Background-checked crews', 'Written, itemized estimates', 'Same crew lead from start to finish', 'Workmanship warranty on every job'],
        imageNote: 'Roofing crew installing shingles on a steep-pitch residential roof, safety harnesses visible.',
      },
    ],
  },
  {
    slug: 'palmetto-roofing-co',
    businessName: 'Palmetto Roofing Co.',
    logoLabel: 'PR',
    tagline: 'Hurricane-rated roofing for Charleston homes and historic properties.',
    layout: 'B',
    fontHeading: "'Manrope', Arial, sans-serif",
    fontBody: "'Manrope', Arial, sans-serif",
    colors: { primary: '#0b2545', primaryDark: '#081b34', accent: '#c9a44c', ink: '#0b2545', bg: '#f7f5f0', bgAlt: '#eef1f5', card: '#ffffff', border: '#dde3ea', textMuted: '#5a6472' },
    phone: '(843) 555-0176',
    email: 'book@palmettoroofingco.com',
    address: '118 Meeting Street',
    city: 'Charleston', state: 'SC', zip: '29401',
    founded: 2009,
    aboutStory: [
      "Palmetto Roofing Co. has spent over a decade keeping historic Charleston homes and coastal properties storm-ready. We started by reroofing a handful of downtown historic homes for a local preservation group — word spread, and now we split our time between hurricane-rated replacements and the metal and tile work this city's architecture calls for.",
      "Charleston's salt air, humidity, and historic roof lines come with their own challenges. Our crews train specifically on how to flash and fasten for this coast, not a generic standard built for somewhere inland.",
    ],
    services: [
      { title: 'Metal Roofing', desc: 'Standing-seam metal rated for coastal wind and salt exposure.' },
      { title: 'Tile Roofing', desc: 'Clay and concrete tile installation and repair for historic homes.' },
      { title: 'Full Roof Replacement', desc: 'Hurricane-rated tear-off and replacement, permitted and inspected.' },
      { title: 'Roof Repair', desc: 'Storm damage and leak repair with insurance documentation.' },
      { title: 'Commercial Roofing', desc: 'Flat and low-slope roofing for storefronts and small businesses.' },
    ],
    serviceAreas: ['Charleston', 'Mount Pleasant', 'James Island', 'Folly Beach', 'Summerville'],
    testimonials: [
      { name: 'Patricia A.', text: 'Our historic home needed tile work most companies wouldn\'t touch. Palmetto matched it perfectly and handled the permitting too.' },
      { name: 'Wade T.', text: 'They actually know hurricane-rated installation, not just a standard roof with extra nails. Worth every penny after the last storm season.' },
    ],
    aboutImage: null,
    aboutImageNote: 'Standing-seam metal roof on a historic Charleston-style home, detail shot.',
    whyUs: [
      {
        headline: "Built for Charleston's Roofs",
        body: ["Historic tile, salt air off the harbor, hurricane season every year — this city's roofs need more than a standard install. We trained specifically for it, permits and all."],
        checklist: ["Trained on historic tile & metal roofing", 'Hurricane-rated fastening & flashing', 'Permit & inspection handled for you', 'Locally owned since 2009'],
        imageNote: 'Standing-seam metal roof on a historic Charleston-style home, close-up of seam detail.',
      },
      {
        headline: 'Storm-Ready, Every Time',
        body: ['For coastal homeowners, a roof that fails in a storm means a lot more than a leak. We install and flash to hurricane-rated spec on every job, not just the ones that ask for it.'],
        checklist: ['Hurricane-rated materials & fastening', 'Photo-documented storm damage claims', 'Direct line for insurance adjusters', 'Flexible scheduling around storm season'],
        imageNote: 'Clay tile roof detail on a coastal home, ridge and hip tiles visible.',
      },
    ],
  },
  {
    slug: 'summit-roofing-exteriors',
    businessName: 'Summit Roofing & Exteriors',
    logoLabel: 'SR',
    tagline: 'Snow-load rated roofing built for real Minnesota winters.',
    layout: 'C',
    fontHeading: "'Playfair Display', Georgia, serif",
    fontBody: "'Poppins', Arial, sans-serif",
    colors: { primary: '#1e3a5f', primaryDark: '#15293f', accent: '#c1502e', ink: '#1a2430', bg: '#f2ece0', bgAlt: '#ece4d4', card: '#ffffff', border: '#e1d3bd', textMuted: '#6b5f52' },
    phone: '(612) 555-0198',
    email: 'hello@summitroofingmn.com',
    address: '2200 Hennepin Ave',
    city: 'Minneapolis', state: 'MN', zip: '55405',
    founded: 2016,
    aboutStory: [
      "Summit Roofing & Exteriors was built on a simple frustration: too many roofs in this region get installed for mild weather, not the heavy snow loads and freeze-thaw cycles Minnesota actually delivers. We started in 2016 with three installers and a shared standard — proper ice and water barrier, correct ventilation, and ice dam prevention on every single roof, not just the ones that ask for it.",
      "We're still a tight crew on purpose. Every installer is trained in-house on our own standard, and every roof gets the same attention whether it's a starter home or a lake house.",
    ],
    services: [
      { title: 'Asphalt Shingle Roofing', desc: 'Ice-dam-resistant shingle installation for Minnesota winters.' },
      { title: 'Metal Roofing', desc: 'Snow-shedding standing-seam metal for steep or heavy-load roofs.' },
      { title: 'Roof Repair', desc: 'Ice dam, leak, and wind damage repair, fast.' },
      { title: 'Gutter Installation', desc: 'Heated and standard gutters sized for heavy snow load.' },
      { title: 'Roof Inspection', desc: 'Full report before winter, before a sale, or after a storm.' },
    ],
    serviceAreas: ['Minneapolis', 'St. Paul', 'Bloomington', 'Edina', 'Maple Grove'],
    testimonials: [
      { name: 'Julia S.', text: 'They explained ice damming better than any other roofer we talked to, and it showed in the actual install. No more ceiling stains.' },
      { name: 'Marcus D.', text: 'Replaced our roof in the fall before winter hit and it\'s held up through two brutal seasons already. Worth booking early.' },
    ],
    aboutImage: null,
    aboutImageNote: 'Finished shingle roof on a Minneapolis home with snow on the ground, clean roofline.',
    whyUs: [
      {
        headline: 'Built for Real Minnesota Winters',
        body: ['Ice dams, heavy snow load, freeze-thaw cycles — most roof failures here trace back to a roof installed for a milder climate. We install ice and water barrier, proper ventilation, and ice dam prevention on every job.'],
        checklist: ['Full ice & water barrier on every roof', 'Ventilation checked & corrected if needed', 'Snow-load rated materials', 'Fully insured for your peace of mind'],
        imageNote: 'Finished shingle roof on a Minneapolis home, snow visible on the ground, clean roofline with no ice damming.',
      },
      {
        headline: 'A Calmer Winter, Top to Bottom',
        body: ['Ice dams, leaks, and emergency winter repairs are stressful enough — we handle the diagnosis and the fix with the same care we bring to a full replacement.'],
        checklist: ['Fast response for winter leaks & ice dams', 'In-house trained installers, not contractors', 'Flexible scheduling around weather windows', 'Workmanship warranty on every job'],
        imageNote: 'Standing-seam metal roof with snow guards, close-up of panel seams and snow-shedding detail.',
      },
    ],
  },
  {
    slug: 'lone-star-roofing',
    businessName: 'Lone Star Roofing',
    logoLabel: 'LS',
    tagline: 'Heat- and hail-tested roofing for Austin-area homes.',
    layout: 'A',
    fontHeading: "'Fraunces', Georgia, serif",
    fontBody: "'Manrope', Arial, sans-serif",
    colors: { primary: '#991b1b', primaryDark: '#7a1515', accent: '#f59e0b', ink: '#2a1a14', bg: '#faf6ee', bgAlt: '#f3e9d9', card: '#ffffff', border: '#e8dcc3', textMuted: '#6b5f52' },
    phone: '(512) 555-0134',
    email: 'quotes@lonestarroofingtx.com',
    address: '900 E 6th St',
    city: 'Austin', state: 'TX', zip: '78702',
    founded: 2013,
    aboutStory: [
      "Lone Star Roofing started in 2013 when founder Danny Ruiz, a third-generation Texan, got tired of watching neighbors get sold roofs that couldn't handle a real Hill Country hailstorm. He built the company around materials rated for Texas heat and hail specifically, not whatever was cheapest that month.",
      "A decade later we're still Austin-owned, still specializing in impact-rated shingle and tile roofing, and still training every crew on the same install standard Danny set from the start — proper ventilation matters as much here as the shingles themselves, given how hot an attic gets in July.",
    ],
    services: [
      { title: 'Asphalt Shingle Roofing', desc: 'Impact- and heat-rated shingle replacement for Central Texas.' },
      { title: 'Tile Roofing', desc: 'Clay and concrete tile for Hill Country and Spanish-style homes.' },
      { title: 'Roof Repair', desc: 'Hail, wind, and leak repair with insurance documentation.' },
      { title: 'Roof Inspection', desc: 'Full report before a sale, purchase, or insurance renewal.' },
      { title: 'Gutter Installation', desc: 'Seamless gutters built for Texas flash-flood downpours.' },
    ],
    serviceAreas: ['Austin', 'Round Rock', 'Cedar Park', 'Pflugerville', 'Kyle', 'Georgetown'],
    testimonials: [
      { name: 'Marisol T.', text: 'Our tile roof needed a real specialist, not a generic shingle crew. Lone Star matched the existing tile perfectly.' },
      { name: 'Brian F.', text: 'Hail hit our street hard and they were out within two days to tarp and assess, then handled the whole insurance claim.' },
    ],
    aboutImage: null,
    aboutImageNote: 'Finished tile roof on a Hill Country-style Austin home, clear blue sky.',
    whyUs: [
      {
        headline: 'Built for Texas Heat and Hail',
        body: ["A roof here takes more abuse from sun and hail than almost anywhere else in the country. We install impact-rated materials and proper attic ventilation on every job, because an underventilated roof fails faster in Texas summers than most homeowners realize."],
        checklist: ['Impact-rated shingle & tile options', 'Attic ventilation checked on every job', 'Direct insurance claim support', 'Fully licensed & insured'],
        imageNote: 'Finished tile roof on a Hill Country-style Austin home, clear blue sky.',
      },
      {
        headline: 'A Crew That Knows This Climate',
        body: ["Every installer trains on the same Texas-specific standard Danny set in 2013 — attic ventilation, impact-rated materials, and flashing built for flash-flood downpours, not a one-size roof."],
        checklist: ['Family-owned since 2013', 'Written, itemized estimates', 'Same crew lead start to finish', 'Workmanship warranty on every job'],
        imageNote: 'Roofing crew installing impact-rated shingles on an Austin-area home, midday sun.',
      },
    ],
  },
  {
    slug: 'cascade-roof-co',
    businessName: 'Cascade Roof Co.',
    logoLabel: 'CR',
    tagline: 'Moss-resistant, rain-tested roofing for Pacific Northwest homes.',
    layout: 'B',
    fontHeading: "'Manrope', Arial, sans-serif",
    fontBody: "'Manrope', Arial, sans-serif",
    colors: { primary: '#1b4332', primaryDark: '#123c28', accent: '#c9a227', ink: '#1c2b22', bg: '#f7f5f0', bgAlt: '#eef1ec', card: '#ffffff', border: '#dde3da', textMuted: '#5a6457' },
    phone: '(503) 555-0121',
    email: 'hello@cascaderoofco.com',
    address: '4521 SE Hawthorne Blvd',
    city: 'Portland', state: 'OR', zip: '97215',
    founded: 2018,
    aboutStory: [
      "Cascade Roof Co. started in 2018 with a focus most roofers in the area skip: moss and moisture prevention, not just installation. Founder Mara Ellison spent years watching good roofs fail early from moss buildup and trapped moisture, and built the company around proper ventilation, moss-resistant materials, and a maintenance mindset from day one.",
      "We're still Portland-owned and operated, still recommending moss treatment as part of every estimate, and still training every installer on the same ventilation-first standard Mara started with — a roof here has to shed water and resist moss for nine months of rain a year.",
    ],
    services: [
      { title: 'Asphalt Shingle Roofing', desc: 'Moss-resistant shingle replacement built for Pacific Northwest rain.' },
      { title: 'Metal Roofing', desc: 'Standing-seam metal for homeowners who want minimal moss upkeep.' },
      { title: 'Roof Repair', desc: 'Leak, moss damage, and storm repair, fast response.' },
      { title: 'Gutter Installation', desc: 'Seamless gutters sized for heavy seasonal rainfall.' },
      { title: 'Roof Inspection', desc: 'Full report including moss and moisture risk assessment.' },
    ],
    serviceAreas: ['Portland', 'Beaverton', 'Lake Oswego', 'Milwaukie', 'Tigard', 'Gresham'],
    testimonials: [
      { name: 'Colleen W.', text: 'They explained moss prevention better than any other roofer we talked to, and it shows — no buildup two years later.' },
      { name: 'Aaron P.', text: 'Replaced our roof with proper ventilation and our attic moisture problem is finally gone. Should have called them years ago.' },
    ],
    aboutImage: null,
    aboutImageNote: 'Finished asphalt shingle roof on a Portland-area home, overcast sky, moss-control strip at the ridge.',
    whyUs: [
      {
        headline: 'Built for Nine Months of Rain',
        body: ["Moss, trapped moisture, and constant rain shorten a roof's life faster here than almost anywhere else in the country. We install for proper drainage and ventilation on every job, and recommend moss treatment as standard, not an upsell."],
        checklist: ['Moss-resistant materials & zinc strips', 'Ventilation checked & corrected if needed', 'Moss & moisture risk assessed on every estimate', 'Fully licensed & insured'],
        imageNote: 'Finished asphalt shingle roof on a Portland-area home, overcast sky, zinc moss-control strip visible at the ridge.',
      },
      {
        headline: 'A Team That Plans for the Climate, Not Just the Install',
        body: ["Every installer trains on the same ventilation-first standard Mara set in 2018 — because a roof that doesn't breathe traps moisture, and a roof that traps moisture fails early in this climate."],
        checklist: ['Locally owned since 2018', 'Written, itemized estimates', 'Moss treatment included in every estimate', 'Workmanship warranty on every job'],
        imageNote: 'Roofing crew installing standing-seam metal panels on a Pacific Northwest home, misty tree line in the background.',
      },
    ],
  },
];

export function getSite(slug) {
  return SITES.find(s => s.slug === slug) || null;
}

export function getAllSites() {
  return SITES;
}

export default SITES;
