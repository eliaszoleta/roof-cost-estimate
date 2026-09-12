// ─── Roofing service data ───────────────────────────────────────────────────
// Pricing mirrors backend/src/config/defaults.js (SHINGLE_COSTS_PER_SQFT,
// METAL_COSTS_PER_SQFT, TILE_COSTS_PER_SQFT, FLAT_ROOF_COSTS_PER_SQFT,
// REPAIR_COSTS, INSPECTION_COSTS, GUTTER_COSTS_PER_LF). Update both files
// together if pricing data changes. `id` matches the calculator's
// SERVICE_STEPS key (frontend/src/components/calculator/RoofingCalculator.js)
// so a service page's CTA can deep-link straight into that flow via
// /?service=<id>.

const SERVICES = [
  {
    id: 'shingle_replacement',
    slug: 'shingle-roof-replacement-cost',
    name: 'Asphalt Shingle Roof Replacement',
    shortLabel: 'Asphalt Shingle',
    tagline: 'Full tear-off and replacement with architectural (dimensional) shingles, priced by roof size — the most popular roofing material in the U.S.',
    seoTitle: 'Shingle Roof Replacement Cost 2026: Price by Roof Size | RoofingCal',
    metaDescription: 'Asphalt shingle roof replacement costs $5,100–$21,900 depending on roof size, using architectural shingles. See 2026 pricing by square footage, plus 3-tab vs. architectural vs. premium comparisons.',
    unitType: 'flat',
    unit: 'installed, architectural shingles',
    typicalTierIndex: 1,
    tiers: [
      { label: 'Under 1,500 sq ft', low: 5100, high: 7500, note: 'Small single-story home' },
      { label: '1,500–2,000 sq ft (Most Common)', low: 7400, high: 10900, note: 'Typical 3-bed/2-bath home' },
      { label: '2,000–2,500 sq ft', low: 9600, high: 14100, note: 'Larger single or 2-story home' },
      { label: '2,500–3,000 sq ft', low: 11700, high: 17200, note: 'Large home, more roof planes' },
      { label: 'Over 3,000 sq ft', low: 14900, high: 21900, note: 'Extra-large home' },
    ],
    bullets: [
      'Economy 3-tab shingles cost roughly 24% less than architectural; premium impact-resistant shingles cost 40–55% more',
      'Tear-off adds $0.80–$1.20/sq ft for a single existing layer, $1.30–$1.90/sq ft for two layers',
      'Rotted decking replacement adds $2.00–$3.50/sq ft for partial repair, $3.50–$5.50/sq ft for a full deck replacement',
      'Steep pitch (6:12–9:12) adds about 28% to labor cost; very steep (9:12+) adds up to 50%',
    ],
    faqs: [
      { q: 'How much does it cost to reroof a 2,000 sq ft house?', a: 'A 1,500–2,000 sq ft roof — the most common size — costs $7,400–$10,900 installed with architectural shingles, including standard tear-off of a single existing layer.' },
      { q: '3-tab vs. architectural shingles — what\'s the price difference?', a: 'Architectural (dimensional) shingles cost about 24% more than economy 3-tab shingles, but last longer (25–30 years vs. 15–20) and carry a stronger wind rating, which is why most homeowners choose them.' },
      { q: 'Does tear-off cost extra, or is it included?', a: 'Tear-off of the old roof is a separate line item: $0.80–$1.20/sq ft for one existing layer, $1.30–$1.90/sq ft if there are two layers to remove.' },
      { q: 'What if my roof deck is rotted underneath?', a: 'Rotted decking (plywood/OSB sheathing) is priced separately once it\'s exposed during tear-off — $2.00–$3.50/sq ft for a partial replacement, $3.50–$5.50/sq ft if the whole deck needs replacing.' },
    ],
    relatedSlugs: ['roof-repair-cost', 'gutter-installation-cost', 'roof-inspection-cost'],
  },
  {
    id: 'metal_roofing',
    slug: 'metal-roof-cost',
    name: 'Metal Roofing',
    shortLabel: 'Metal Roof',
    tagline: 'Standing seam, corrugated, or metal shingle roofing, priced per square foot by panel type — built to last 40-70 years.',
    seoTitle: 'Metal Roof Cost 2026: Price by Panel Type | RoofingCal',
    metaDescription: 'Metal roofing costs $15,000–$42,000 installed for a typical 2,000 sq ft roof, depending on panel type. See 2026 pricing for corrugated, R-panel, stone-coated, and standing seam metal roofs.',
    unitType: 'per_sqft',
    unit: 'per sq ft, installed',
    typicalQuantity: 2000,
    typicalTierIndex: 4,
    tiers: [
      { label: 'Corrugated Panel', low: 7.50, high: 10.50, note: 'Lowest cost, common on outbuildings and budget jobs' },
      { label: 'Ribbed / R-Panel', low: 9.00, high: 12.50, note: 'Exposed-fastener panel, mid-range cost' },
      { label: 'Stone-Coated Steel', low: 10.00, high: 14.50, note: 'Looks like shingle or tile, extra durability' },
      { label: 'Metal Shingle', low: 10.50, high: 15.00, note: 'Interlocking panels styled like shingles' },
      { label: 'Standing Seam (Most Popular)', low: 15.00, high: 21.00, note: 'Concealed fasteners, premium look and longevity' },
    ],
    bullets: [
      'Standing seam metal roofs typically last 40–70 years with minimal maintenance, versus 20–30 for asphalt shingles',
      'Metal reflects heat and can cut summer cooling costs by 10–25% compared to a dark asphalt roof',
      'Exposed-fastener panels (corrugated, R-panel) need fastener re-tightening every 10–15 years; standing seam does not',
      'Most metal roofs qualify for lower homeowner\'s insurance premiums due to fire and impact resistance',
    ],
    faqs: [
      { q: 'How much does a metal roof cost for an average house?', a: 'For a typical 2,000 sq ft roof, metal roofing runs $15,000–$42,000 installed depending on panel type — corrugated panels are cheapest at $15,000–$21,000, while standing seam runs $30,000–$42,000.' },
      { q: 'Why is standing seam so much more expensive than corrugated metal?', a: 'Standing seam panels use hidden (concealed) fasteners and interlocking seams, which take more skill and time to install and virtually eliminate leak points — corrugated and R-panel use exposed screws that need periodic maintenance.' },
      { q: 'Does a metal roof actually last longer than shingles?', a: 'Yes — standing seam metal typically lasts 40–70 years versus 20–30 years for asphalt shingles, though exposed-fastener panels (corrugated, R-panel) are usually on the shorter end, around 25–40 years.' },
      { q: 'Is a metal roof worth the higher upfront cost?', a: 'For homeowners planning to stay 15+ years, the longer lifespan, lower maintenance, and potential energy/insurance savings often offset the higher upfront cost compared to reroofing with shingles twice over the same period.' },
    ],
    relatedSlugs: ['shingle-roof-replacement-cost', 'roof-inspection-cost', 'gutter-installation-cost'],
  },
  {
    id: 'tile_roofing',
    slug: 'tile-roof-cost',
    name: 'Tile Roofing',
    shortLabel: 'Tile Roof',
    tagline: 'Concrete, clay, or slate tile roofing, priced per square foot by material — a durable, high-end option that can last 50+ years.',
    seoTitle: 'Tile Roof Cost 2026: Price by Material (Concrete, Clay, Slate) | RoofingCal',
    metaDescription: 'Tile roof installation costs $20,000–$68,000 for a typical 2,000 sq ft roof depending on material. See 2026 pricing for concrete, clay, synthetic slate, and natural slate tile roofs.',
    unitType: 'per_sqft',
    unit: 'per sq ft, installed',
    typicalQuantity: 2000,
    typicalTierIndex: 0,
    disclaimer: 'Tile roofing is significantly heavier than shingles or metal — most homes need a structural engineer to confirm the existing framing can support the added weight before installation.',
    tiers: [
      { label: 'Concrete Tile (Most Common)', low: 10.00, high: 16.00, note: 'Most affordable tile option, wide style range' },
      { label: 'Synthetic Slate', low: 10.00, high: 16.00, note: 'Lightweight composite, mimics natural slate look' },
      { label: 'Clay Tile', low: 14.00, high: 22.00, note: 'Classic Spanish/Mediterranean styles, very durable' },
      { label: 'Natural Slate', low: 22.00, high: 34.00, note: 'Premium, can last 75–100+ years' },
    ],
    bullets: [
      'Tile roofing can weigh 3–5x more than asphalt shingles — a structural inspection is required before installation on most homes',
      'Concrete and clay tile typically last 50+ years; natural slate can last 75–100+ years with proper installation',
      'Individual cracked tiles are easy and inexpensive to replace without redoing the whole roof',
      'Tile is one of the best-performing roofing materials in wildfire-prone and hail-prone regions',
    ],
    faqs: [
      { q: 'How much does a tile roof cost for a 2,000 sq ft home?', a: 'Concrete or synthetic slate tile costs $20,000–$32,000 installed for a typical 2,000 sq ft roof. Clay tile runs $28,000–$44,000, and natural slate — the premium option — runs $44,000–$68,000.' },
      { q: 'Does my roof structure need to be reinforced for tile?', a: 'Often, yes. Tile is much heavier than shingles or metal, so most homes need a structural engineer to verify the existing rafters/trusses can support the added weight, or be reinforced first.' },
      { q: 'How long does a tile roof last?', a: 'Concrete and clay tile typically last 50+ years, and natural slate can last 75–100+ years — significantly longer than asphalt shingles (20–30 years) or most metal panels.' },
      { q: 'What\'s the difference between synthetic and natural slate?', a: 'Synthetic slate is a lightweight composite that mimics the look of natural slate at roughly half the cost, and doesn\'t require the same structural reinforcement — natural slate is heavier, longer-lasting, and priced accordingly.' },
    ],
    relatedSlugs: ['metal-roof-cost', 'roof-inspection-cost', 'shingle-roof-replacement-cost'],
  },
  {
    id: 'flat_roof',
    slug: 'flat-roof-cost',
    name: 'Flat / Low-Slope Roofing',
    shortLabel: 'Flat / TPO',
    tagline: 'TPO, EPDM, or PVC membrane roofing for flat and low-slope roofs, priced per square foot by material.',
    seoTitle: 'Flat Roof Cost 2026: TPO, EPDM & PVC Pricing | RoofingCal',
    metaDescription: 'Flat roof replacement costs $8,100–$17,100 for a typical 1,800 sq ft flat roof, depending on membrane type. See 2026 pricing for EPDM, TPO, PVC, modified bitumen, and built-up roofing.',
    unitType: 'per_sqft',
    unit: 'per sq ft, installed',
    typicalQuantity: 1800,
    typicalTierIndex: 3,
    tiers: [
      { label: 'Modified Bitumen', low: 4.50, high: 6.50, note: 'Torch-down or peel-and-stick, budget-friendly' },
      { label: 'Built-Up Roofing (BUR)', low: 4.50, high: 7.00, note: 'Traditional tar-and-gravel, multi-ply' },
      { label: 'EPDM (Rubber)', low: 5.00, high: 7.50, note: 'Most common residential flat roof membrane' },
      { label: 'TPO (Most Popular)', low: 6.00, high: 8.50, note: 'Reflective, energy-efficient, widely used' },
      { label: 'PVC', low: 6.50, high: 9.50, note: 'Most durable, best chemical/grease resistance' },
    ],
    bullets: [
      'TPO is the most commonly installed flat-roof membrane today for its reflectivity and energy efficiency',
      'Flat roofs need a slight slope (or added tapered insulation) for proper drainage — standing water is the #1 cause of premature failure',
      'Most membrane roofing systems carry a 15–30 year warranty depending on material and installation method',
      'Roof coating ($1.00–$3.50/sq ft) can extend the life of an aging flat roof by several years without a full replacement',
    ],
    faqs: [
      { q: 'How much does it cost to replace a flat roof?', a: 'For a typical 1,800 sq ft flat roof, EPDM rubber runs $9,000–$13,500 and TPO — the most popular option — runs $10,800–$15,300. Modified bitumen is the cheapest at $8,100–$11,700.' },
      { q: 'What\'s the best material for a flat roof?', a: 'TPO is the most widely recommended for residential and light-commercial flat roofs — it\'s reflective (lowers cooling costs), seam-welded for fewer leak points, and mid-priced. PVC costs more but resists grease and chemicals better, useful for restaurant roofs.' },
      { q: 'Why do flat roofs leak more than pitched roofs?', a: 'Flat and low-slope roofs rely on a slight grade and proper drainage to shed water — standing water from clogged drains or an undersized slope is the leading cause of leaks and premature membrane failure.' },
      { q: 'Can I just recoat my flat roof instead of replacing it?', a: 'If the membrane is still structurally sound with no major leaks, a roof coating ($1.00–$3.50/sq ft) can extend its life by several years for a fraction of full replacement cost — but it\'s a maintenance step, not a permanent fix.' },
    ],
    relatedSlugs: ['roof-repair-cost', 'roof-inspection-cost', 'gutter-installation-cost'],
  },
  {
    id: 'roof_repair',
    slug: 'roof-repair-cost',
    name: 'Roof Repair',
    shortLabel: 'Roof Repair',
    tagline: 'Leak, flashing, and storm damage repair, priced by the size of the damaged area.',
    seoTitle: 'Roof Repair Cost 2026: Price by Damage Size | RoofingCal',
    metaDescription: 'Roof repair costs $150–$6,500 depending on damage size, from a few shingles or flashing to a large storm-damaged section. See 2026 pricing and emergency tarping costs.',
    unitType: 'flat',
    unit: 'per repair',
    typicalTierIndex: 1,
    tiers: [
      { label: 'Minor (Under 50 sq ft)', low: 150, high: 450, note: 'A few shingles, flashing, or a small leak' },
      { label: 'Small (50–200 sq ft, Most Common)', low: 400, high: 1100, note: 'Typical single-area storm or leak damage' },
      { label: 'Medium (200–500 sq ft)', low: 1000, high: 2800, note: 'Larger section, possible decking damage' },
      { label: 'Large (500+ sq ft)', low: 2500, high: 6500, note: 'Major storm damage or multiple areas' },
      { label: 'Emergency Tarping / Leak Stop', low: 450, high: 2200, note: 'Same-day service to stop active water intrusion' },
    ],
    bullets: [
      'A small, localized repair (50–200 sq ft) is the most common roof repair call, usually from a storm, fallen branch, or aging flashing',
      'Emergency tarping stops water intrusion immediately and is typically billed separately from the permanent repair',
      'Repairs found during a roof inspection are often bundled at a discount versus scheduling them separately',
      'If damage covers more than about 30% of the roof, most contractors will recommend a full replacement instead of a repair',
    ],
    faqs: [
      { q: 'How much does a typical roof repair cost?', a: 'A small, localized repair (50–200 sq ft) — the most common type — costs $400–$1,100. Minor fixes like a few shingles or flashing run $150–$450, while major storm damage over 500 sq ft can run $2,500–$6,500.' },
      { q: 'How fast can someone come out for an emergency leak?', a: 'Most roofing companies offer same-day emergency tarping ($450–$2,200) to stop active water intrusion, with the permanent repair scheduled separately once the weather clears.' },
      { q: 'Will my homeowner\'s insurance cover roof repair?', a: 'Sudden damage from a storm, wind, hail, or a fallen tree is typically covered by homeowner\'s insurance (minus your deductible); gradual wear-and-tear or lack of maintenance usually is not.' },
      { q: 'At what point does a repair stop making sense vs. a full replacement?', a: 'As a rule of thumb, if damage affects more than roughly 30% of the roof, or the roof is already near the end of its expected lifespan, a full replacement is usually more cost-effective than another repair.' },
    ],
    relatedSlugs: ['roof-inspection-cost', 'shingle-roof-replacement-cost', 'gutter-installation-cost'],
  },
  {
    id: 'roof_inspection',
    slug: 'roof-inspection-cost',
    name: 'Roof Inspection',
    shortLabel: 'Inspection',
    tagline: 'Pre-purchase, post-storm, or annual roof inspections, priced by inspection type and method.',
    seoTitle: 'Roof Inspection Cost 2026: Price by Type | RoofingCal',
    metaDescription: 'A roof inspection costs $150–$750 depending on type, from a standard visual inspection to drone, post-storm, and thermal/infrared inspections. See 2026 pricing.',
    unitType: 'flat',
    unit: 'per inspection',
    typicalTierIndex: 0,
    tiers: [
      { label: 'Standard Visual (Most Common)', low: 150, high: 325, note: 'Ground and ladder inspection, written report' },
      { label: 'Drone Inspection', low: 200, high: 400, note: 'Aerial photos of hard-to-reach or steep roofs' },
      { label: 'Post-Storm / Insurance Inspection', low: 200, high: 475, note: 'Documents damage for an insurance claim' },
      { label: 'Thermal / Infrared Inspection', low: 400, high: 750, note: 'Detects hidden moisture and insulation gaps' },
    ],
    bullets: [
      'A standard visual inspection is recommended annually, and always before buying a home or filing an insurance claim',
      'Drone inspections are useful for steep or very tall roofs where a physical walk-on isn\'t safe or practical',
      'Post-storm inspections come with photo documentation contractors can submit directly to your insurance adjuster',
      'Thermal inspections find moisture trapped under the surface — leaks that aren\'t visible yet from a standard walk-through',
    ],
    faqs: [
      { q: 'How much does a roof inspection cost?', a: 'A standard visual inspection — the most common type — costs $150–$325. Drone inspections run $200–$400, post-storm/insurance inspections run $200–$475, and thermal/infrared inspections run $400–$750.' },
      { q: 'Do I need a roof inspection before buying a house?', a: 'Yes — a pre-purchase roof inspection ($150–$325) can reveal age, hidden damage, or remaining lifespan that a general home inspection may not cover in detail, which can be significant leverage in negotiating price.' },
      { q: 'What\'s the benefit of a drone inspection over a standard one?', a: 'A drone inspection captures close-up aerial photos of every roof plane without anyone walking on a steep or fragile roof, which is safer and can catch damage a ground-level inspection would miss.' },
      { q: 'Is a roof inspection free with an insurance claim?', a: 'Many roofing companies offer a free basic inspection when storm damage is suspected, but a formal, documented post-storm inspection ($200–$475) for insurance purposes is usually a paid service.' },
    ],
    relatedSlugs: ['roof-repair-cost', 'shingle-roof-replacement-cost', 'metal-roof-cost'],
  },
  {
    id: 'gutter_replacement',
    slug: 'gutter-installation-cost',
    name: 'Gutter Installation',
    shortLabel: 'Gutters',
    tagline: 'New gutters and downspouts, priced per linear foot by material, for a typical home\'s roofline.',
    seoTitle: 'Gutter Installation Cost 2026: Price by Material | RoofingCal',
    metaDescription: 'Gutter installation costs $540–$6,840 for a typical 180 linear foot home, depending on material. See 2026 pricing for vinyl, aluminum, steel, and copper gutters, plus downspout and guard costs.',
    unitType: 'per_sqft',
    unit: 'per linear ft, installed',
    typicalQuantity: 180,
    typicalTierIndex: 1,
    tiers: [
      { label: 'Vinyl', low: 3.00, high: 5.50, note: 'Most affordable, good for mild climates' },
      { label: 'Aluminum (Most Common)', low: 5.00, high: 9.00, note: 'Best balance of cost, durability, and style options' },
      { label: 'Steel', low: 8.00, high: 13.00, note: 'More dent- and impact-resistant than aluminum' },
      { label: 'Copper', low: 20.00, high: 38.00, note: 'Premium, develops a natural patina, lasts 50+ years' },
    ],
    bullets: [
      'Based on a typical 180 linear foot home perimeter — measure your own roofline for a precise number',
      'Downspouts are priced separately at $5–$9 per linear foot',
      'Gutter guards ($1.50–$4.50/linear ft) cut down on cleaning and reduce clogs from leaves and debris',
      'Seamless aluminum gutters, formed on-site to your home\'s exact length, are the most commonly installed style today',
    ],
    faqs: [
      { q: 'How much does it cost to install new gutters?', a: 'For a typical 180 linear foot home, aluminum gutters — the most common choice — cost $900–$1,620 installed. Vinyl is cheapest at $540–$990, while copper runs $3,600–$6,840.' },
      { q: 'Are downspouts included in gutter pricing?', a: 'No, downspouts are priced separately at $5–$9 per linear foot on top of the gutter cost itself.' },
      { q: 'Are gutter guards worth the extra cost?', a: 'Gutter guards ($1.50–$4.50/linear ft) significantly cut down on how often you need to clean your gutters and help prevent clogs, ice dams, and overflow damage — a common add-on when installing new gutters.' },
      { q: 'How long do aluminum gutters last?', a: 'Well-installed aluminum gutters typically last 20–30 years with basic maintenance, compared to 20+ years for vinyl and 50+ years for copper.' },
    ],
    relatedSlugs: ['shingle-roof-replacement-cost', 'roof-repair-cost', 'roof-inspection-cost'],
  },
];

export function getAllServices() {
  return SERVICES;
}

export function getServiceBySlug(slug) {
  return SERVICES.find(s => s.slug === slug) || null;
}

export function getServiceById(id) {
  return SERVICES.find(s => s.id === id) || null;
}

export function getRelatedServices(service) {
  return (service.relatedSlugs || [])
    .map(slug => SERVICES.find(s => s.slug === slug))
    .filter(Boolean);
}

// The "typical job" headline number for a service — one representative tier
// (or per-sqft tier x typical quantity) used as the big price at the top of
// a service page and in the homepage service cards.
export function typicalCost(service) {
  const tier = service.tiers[service.typicalTierIndex] || service.tiers[0];
  if (service.unitType === 'flat') return { low: tier.low, high: tier.high };
  const qty = service.typicalQuantity || 1;
  return { low: Math.round(tier.low * qty), high: Math.round(tier.high * qty) };
}
