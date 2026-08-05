// ─── Roofing service data ───────────────────────────────────────────────────
// Pricing mirrors backend/src/config/defaults.js (SHINGLE_COSTS_PER_SQFT,
// METAL_COSTS_PER_SQFT, TILE_COSTS_PER_SQFT, FLAT_ROOF_COSTS_PER_SQFT,
// REPAIR_COSTS, INSPECTION_COSTS, GUTTER_COSTS_PER_LF). Update both files
// together if pricing data changes. `id` matches the calculator's SERVICE_STEPS
// key (frontend/src/components/calculator/RoofingCalculator.js) so a service
// page's CTA can deep-link straight into that flow via /?service=<id>.

const SERVICES = [
  {
    id: 'shingle_replacement',
    slug: 'asphalt-shingle-roof-cost',
    name: 'Asphalt Shingle Roof',
    shortLabel: 'Asphalt Shingle',
    tagline: 'The most popular roofing material in America — affordable, durable, and installed by nearly every roofing contractor.',
    seoTitle: 'Asphalt Shingle Roof Cost 2026: Price Per Sq Ft & Total Installed Cost | RoofingCal',
    metaDescription: 'Asphalt shingle roofs cost $3.25–$12.50 per sq ft installed depending on tier. See 2026 pricing for 3-tab, architectural, premium, and designer shingles, plus what a full replacement typically costs.',
    unitType: 'per_sqft',
    unit: 'per sq ft installed',
    typicalQuantity: 1800,
    typicalTierIndex: 1,
    tiers: [
      { label: '3-Tab (Economy)', low: 3.25, high: 4.75, note: 'Budget-friendly, 20–25 year lifespan' },
      { label: 'Architectural (Most Popular)', low: 4.25, high: 6.25, note: 'Best value — dimensional look, 25–30 year lifespan' },
      { label: 'Premium / Impact-Resistant', low: 6.00, high: 9.50, note: 'Class 4 impact rating, can lower insurance premiums' },
      { label: 'Designer / Luxury', low: 8.25, high: 12.50, note: 'Slate or shake look, up to 50-year lifespan' },
    ],
    bullets: [
      'Most affordable roofing material with the widest contractor availability nationwide',
      'Standard installation takes 1–3 days for an average single-family home',
      '20–30 year lifespan depending on tier, backed by 25–50 year manufacturer warranties',
      'Available in dozens of colors and profiles to match any home style',
    ],
    faqs: [
      { q: 'How much does an asphalt shingle roof cost for an average home?', a: 'A full asphalt shingle replacement on an average 1,800 sq ft roof typically runs $7,650–$11,250 using architectural shingles, the most common tier. 3-tab economy shingles bring that down to roughly $5,850–$8,550, while premium impact-resistant shingles can run $10,800–$17,100.' },
      { q: 'What’s the difference between 3-tab and architectural shingles?', a: '3-tab shingles are flat, single-layer, and the most affordable option, typically lasting 20–25 years. Architectural (dimensional) shingles are thicker, layered for a textured look, more wind- and impact-resistant, and typically last 25–30 years — they now account for the large majority of residential shingle installs.' },
      { q: 'Does tear-off cost extra?', a: 'Yes. Removing your existing roof runs an additional $0.80–$2.50 per sq ft depending on how many layers are being removed, on top of the shingle installation cost shown above.' },
      { q: 'How long do asphalt shingles last?', a: 'Standard asphalt shingles last 20–30 years with proper ventilation and maintenance, compared to 40–70 years for metal and 50–100 years for tile or slate.' },
    ],
    relatedSlugs: ['metal-roof-cost', 'roof-repair-cost', 'roof-inspection-cost'],
  },
  {
    id: 'metal_roofing',
    slug: 'metal-roof-cost',
    name: 'Metal Roof',
    shortLabel: 'Metal Roof',
    tagline: 'A long-lasting, energy-efficient upgrade — standing seam and metal shingle systems can outlast asphalt by decades.',
    seoTitle: 'Metal Roof Cost 2026: Standing Seam, Corrugated & Metal Shingle Pricing | RoofingCal',
    metaDescription: 'Metal roofing costs $7.50–$21 per sq ft installed in 2026. Compare corrugated, ribbed, stone-coated, metal shingle, and standing seam pricing, plus full-roof cost examples.',
    unitType: 'per_sqft',
    unit: 'per sq ft installed',
    typicalQuantity: 1800,
    typicalTierIndex: 2,
    tiers: [
      { label: 'Corrugated Panel', low: 7.50, high: 10.50, note: 'Most affordable metal option, common on outbuildings and modern homes' },
      { label: 'Ribbed / R-Panel', low: 9.00, high: 12.50, note: 'Exposed-fastener panel system, mid-range cost' },
      { label: 'Stone-Coated Steel', low: 10.00, high: 14.50, note: 'Mimics shingle or tile look with metal durability' },
      { label: 'Metal Shingle', low: 10.50, high: 15.00, note: 'Interlocking panels styled like traditional shingles' },
      { label: 'Standing Seam (Premium)', low: 15.00, high: 21.00, note: 'Concealed fasteners, the longest-lasting and most weathertight option' },
    ],
    bullets: [
      '40–70 year lifespan — roughly double that of asphalt shingles',
      'Reflects heat and can lower cooling costs 10–25% versus asphalt',
      'Highly wind- and fire-resistant; often qualifies for insurance discounts',
      'Standing seam panels use concealed fasteners for the best long-term weathertightness',
    ],
    faqs: [
      { q: 'How much does a metal roof cost for an average home?', a: 'For an 1,800 sq ft roof, stone-coated steel — a common mid-tier choice — runs about $18,000–$26,100 installed. Entry-level corrugated panels come in around $13,500–$18,900, while premium standing seam runs $27,000–$37,800.' },
      { q: 'Is a metal roof worth the extra cost over asphalt?', a: 'Metal typically costs 2–3x more upfront than asphalt shingles, but its 40–70 year lifespan means it often works out cheaper per year of service, and it can reduce cooling costs and insurance premiums in some markets.' },
      { q: 'Is a metal roof noisy in the rain?', a: 'With proper solid decking and underlayment (standard on residential installs), metal roofs are not noticeably louder than asphalt shingles during rain.' },
      { q: 'Can you install metal roofing over existing shingles?', a: 'In some cases, yes — this can reduce tear-off costs, but many contractors recommend a full tear-off to inspect the decking first. Local building codes may also limit how many layers are allowed.' },
    ],
    relatedSlugs: ['asphalt-shingle-roof-cost', 'tile-roof-cost', 'roof-inspection-cost'],
  },
  {
    id: 'tile_roofing',
    slug: 'tile-roof-cost',
    name: 'Tile Roof',
    shortLabel: 'Tile Roof',
    tagline: 'Concrete, clay, and slate tile roofs offer decades of durability and are especially popular in warm, dry climates.',
    seoTitle: 'Tile Roof Cost 2026: Concrete, Clay & Slate Pricing Per Sq Ft | RoofingCal',
    metaDescription: 'Tile roofing costs $10–$34 per sq ft installed depending on material. See 2026 pricing for concrete, synthetic slate, clay, and natural slate tile, plus full-roof cost examples.',
    unitType: 'per_sqft',
    unit: 'per sq ft installed',
    typicalQuantity: 1800,
    typicalTierIndex: 0,
    tiers: [
      { label: 'Concrete Tile', low: 10.00, high: 16.00, note: 'Most affordable tile option, 50+ year lifespan' },
      { label: 'Synthetic Slate', low: 10.00, high: 16.00, note: 'Lightweight composite, mimics natural slate look' },
      { label: 'Clay Tile', low: 14.00, high: 22.00, note: 'Classic Southwestern/Mediterranean look, excellent heat resistance' },
      { label: 'Natural Slate', low: 22.00, high: 34.00, note: 'Premium, can last 75–100+ years with proper structural support' },
    ],
    bullets: [
      '50–100+ year lifespan depending on material — among the longest-lasting roofing options',
      'Excellent in hot, dry, and coastal climates; naturally fire-resistant',
      'Heavier than asphalt or metal — most homes need a structural check before installation',
      'Individual cracked tiles can be replaced without redoing the whole roof',
    ],
    faqs: [
      { q: 'How much does a tile roof cost for an average home?', a: 'Concrete tile — the most common, budget-friendly option — runs about $18,000–$28,800 for an 1,800 sq ft roof. Clay tile runs $25,200–$39,600, and natural slate, the premium option, runs $39,600–$61,200.' },
      { q: 'Does my roof structure need reinforcement for tile?', a: 'Often, yes. Tile is significantly heavier than asphalt or metal, so many homes — especially older ones — need a structural engineer to confirm the framing can support the added weight before installation.' },
      { q: 'How long does a tile roof last?', a: 'Concrete and synthetic tile typically last 50 years, clay tile 50–100 years, and natural slate can exceed 100 years with proper maintenance — far longer than asphalt shingles.' },
      { q: 'Is tile roofing a good fit for cold or snowy climates?', a: 'Tile performs best in warm, dry, or coastal climates. In areas with heavy freeze-thaw cycles, some tile materials are more prone to cracking, so metal or asphalt is often recommended instead.' },
    ],
    relatedSlugs: ['metal-roof-cost', 'asphalt-shingle-roof-cost', 'roof-inspection-cost'],
  },
  {
    id: 'flat_roof',
    slug: 'flat-roof-cost',
    name: 'Flat / Low-Slope Roof',
    shortLabel: 'Flat / TPO',
    tagline: 'TPO, EPDM, and PVC membrane systems built for low-slope residential additions and commercial roofs.',
    seoTitle: 'Flat Roof Cost 2026: TPO, EPDM, PVC & Modified Bitumen Pricing | RoofingCal',
    metaDescription: 'Flat and low-slope roofing costs $4.50–$9.50 per sq ft installed. Compare TPO, EPDM, PVC, modified bitumen, and built-up roofing pricing for 2026.',
    unitType: 'per_sqft',
    unit: 'per sq ft installed',
    typicalQuantity: 1800,
    typicalTierIndex: 3,
    tiers: [
      { label: 'Modified Bitumen', low: 4.50, high: 6.50, note: 'Torch-down or peel-and-stick, budget-friendly' },
      { label: 'Built-Up Roofing (BUR)', low: 4.50, high: 7.00, note: 'Multi-ply tar-and-gravel system, proven durability' },
      { label: 'EPDM (Rubber)', low: 5.00, high: 7.50, note: 'Synthetic rubber membrane, widely used and easy to repair' },
      { label: 'TPO (Most Popular)', low: 6.00, high: 8.50, note: 'Reflective, energy-efficient, the fastest-growing flat roof material' },
      { label: 'PVC', low: 6.50, high: 9.50, note: 'Most chemical- and fire-resistant membrane option' },
    ],
    bullets: [
      'Common on additions, garages, modern-style homes, and commercial buildings',
      'TPO and PVC membranes reflect heat, reducing cooling costs',
      'Typically installed in a single day for smaller residential sections',
      '10–25 year lifespan depending on membrane type and maintenance',
    ],
    faqs: [
      { q: 'How much does a flat roof cost for an average home?', a: 'For an 1,800 sq ft flat or low-slope section, TPO — the most commonly installed membrane today — runs about $10,800–$15,300 installed. EPDM rubber comes in a bit lower at $9,000–$13,500.' },
      { q: 'What’s the difference between TPO and EPDM?', a: 'TPO is a reflective, heat-welded membrane that’s become the most popular flat roofing choice due to energy efficiency and seam strength. EPDM is a synthetic rubber membrane that’s been used for decades, costs slightly less, and is easy to patch, but is less reflective (typically black).' },
      { q: 'How long does a flat roof last?', a: 'Most flat roofing membranes last 10–25 years depending on material and maintenance — PVC and TPO tend toward the higher end, while modified bitumen is on the lower end.' },
      { q: 'Do flat roofs need more maintenance than sloped roofs?', a: 'Yes — because water doesn’t drain as quickly, flat roofs benefit from annual inspections to check drains, seams, and ponding water, especially after major storms.' },
    ],
    relatedSlugs: ['roof-repair-cost', 'roof-inspection-cost', 'asphalt-shingle-roof-cost'],
  },
  {
    id: 'roof_repair',
    slug: 'roof-repair-cost',
    name: 'Roof Repair',
    shortLabel: 'Roof Repair',
    tagline: 'From a handful of missing shingles to storm damage — most repairs cost far less than a full replacement.',
    seoTitle: 'Roof Repair Cost 2026: Price by Damage Size & Type | RoofingCal',
    metaDescription: 'Roof repair costs $150–$6,500 depending on damage size, from minor shingle and flashing fixes to large storm-damage repairs. See 2026 pricing by repair type.',
    unitType: 'flat',
    unit: 'total repair cost',
    typicalTierIndex: 1,
    tiers: [
      { label: 'Minor (< 50 sq ft)', low: 150, high: 450, note: 'A few shingles, flashing, or a small leak' },
      { label: 'Small (50–200 sq ft)', low: 400, high: 1100, note: 'Localized section repair or valley leak' },
      { label: 'Medium (200–500 sq ft)', low: 1000, high: 2800, note: 'Larger section replacement, moderate storm damage' },
      { label: 'Large (500+ sq ft)', low: 2500, high: 6500, note: 'Extensive damage approaching partial replacement' },
      { label: 'Emergency Tarping / Leak Stop', low: 450, high: 2200, note: 'Same-day service to stop active water intrusion' },
    ],
    bullets: [
      'Most repair calls (a few shingles, flashing, small leaks) fall in the $150–$1,100 range',
      'Getting repairs done quickly prevents small leaks from becoming deck or structural damage',
      'Emergency tarping stops active leaks the same day while a full repair is scheduled',
      'If repairs would cover more than 30–40% of the roof, full replacement is often more cost-effective',
    ],
    faqs: [
      { q: 'How much does it cost to fix a roof leak?', a: 'A small, localized leak — like a cracked flashing seal or a handful of damaged shingles — typically costs $150–$1,100 to repair. Larger leaks tied to more extensive damage can run $1,000–$2,800.' },
      { q: 'Should I repair or replace my roof?', a: 'If damage covers less than 30% of the roof and the roof is under 15–20 years old, repair is usually the better value. Beyond that — or with widespread wear — a full replacement often makes more financial sense long-term.' },
      { q: 'How fast can emergency roof repair be done?', a: 'Most roofing companies offer same-day emergency tarping ($450–$2,200) to stop active leaks, with permanent repairs scheduled within a few days depending on weather and material availability.' },
      { q: 'Will homeowners insurance cover roof repair?', a: 'Sudden damage from storms, wind, or falling debris is often covered, while gradual wear-and-tear typically is not. Document the damage with photos and contact your insurer before starting repairs.' },
    ],
    relatedSlugs: ['roof-inspection-cost', 'asphalt-shingle-roof-cost', 'gutter-replacement-cost'],
  },
  {
    id: 'roof_inspection',
    slug: 'roof-inspection-cost',
    name: 'Roof Inspection',
    shortLabel: 'Inspection',
    tagline: 'A professional inspection catches small problems before they become expensive ones — essential before buying a home or filing an insurance claim.',
    seoTitle: 'Roof Inspection Cost 2026: Standard, Drone & Storm Inspections | RoofingCal',
    metaDescription: 'Roof inspections cost $150–$750 depending on type. Compare standard, drone, post-storm, and thermal imaging inspection pricing for 2026.',
    unitType: 'flat',
    unit: 'total inspection cost',
    typicalTierIndex: 0,
    tiers: [
      { label: 'Standard Inspection', low: 150, high: 325, note: 'Visual walkthrough of the roof surface, flashing, and attic' },
      { label: 'Drone Inspection', low: 200, high: 400, note: 'Aerial imagery for steep or hard-to-access roofs' },
      { label: 'Post-Storm Inspection', low: 200, high: 475, note: 'Documents wind/hail damage for insurance claims' },
      { label: 'Thermal Imaging', low: 400, high: 750, note: 'Detects hidden moisture and insulation gaps' },
    ],
    bullets: [
      'Recommended annually and always before buying a home',
      'Post-storm inspections create the documentation insurers require for claims',
      'A standard inspection typically takes 30–60 minutes',
      'Many contractors credit the inspection fee toward repair or replacement work if you hire them',
    ],
    faqs: [
      { q: 'How much does a roof inspection cost?', a: 'A standard visual inspection runs $150–$325. Drone inspections (useful for steep or fragile roofs) run $200–$400, and thermal imaging — which detects hidden moisture — runs $400–$750.' },
      { q: 'How often should I get my roof inspected?', a: 'Most roofing professionals recommend an annual inspection, plus an additional inspection after any major storm (hail, high winds, or fallen debris).' },
      { q: 'Do I need an inspection before buying a home?', a: 'Yes — a pre-purchase roof inspection can reveal remaining lifespan, hidden leaks, or code violations that a general home inspection may miss, and can be used to negotiate price or repairs.' },
      { q: 'Will an inspection help with an insurance claim?', a: 'A documented post-storm inspection report is often required by insurers to support a wind or hail damage claim, and can significantly speed up claim approval.' },
    ],
    relatedSlugs: ['roof-repair-cost', 'asphalt-shingle-roof-cost', 'metal-roof-cost'],
  },
  {
    id: 'gutter_replacement',
    slug: 'gutter-replacement-cost',
    name: 'Gutter Replacement',
    shortLabel: 'Gutters',
    tagline: 'New gutters protect your roof, siding, and foundation from water damage — often bundled with a roof replacement.',
    seoTitle: 'Gutter Replacement Cost 2026: Price Per Linear Foot by Material | RoofingCal',
    metaDescription: 'Gutter replacement costs $3–$38 per linear foot installed depending on material. See 2026 pricing for vinyl, aluminum, steel, and copper gutters.',
    unitType: 'per_lf',
    unit: 'per linear foot installed',
    typicalQuantity: 150,
    typicalTierIndex: 1,
    tiers: [
      { label: 'Vinyl', low: 3.00, high: 5.50, note: 'Most affordable, good for mild climates, can become brittle in extreme cold' },
      { label: 'Aluminum (Most Popular)', low: 5.00, high: 9.00, note: 'Best balance of cost, durability, and low maintenance' },
      { label: 'Steel', low: 8.00, high: 13.00, note: 'More dent- and impact-resistant, better for heavy snow/ice areas' },
      { label: 'Copper', low: 20.00, high: 38.00, note: 'Decades-long lifespan, develops a distinctive patina, premium cost' },
    ],
    bullets: [
      'A typical 150 linear foot gutter system for a single-story home runs $750–$1,350 in aluminum',
      'Gutter guards add $1.50–$4.50/ft but significantly cut down on cleaning',
      'Bundling gutter replacement with a roof replacement is usually cheaper than doing them separately',
      'Properly sloped, well-maintained gutters help prevent foundation, siding, and fascia water damage',
    ],
    faqs: [
      { q: 'How much does it cost to replace gutters on an average home?', a: 'For a typical 150 linear foot run, aluminum gutters — the most common choice — cost about $750–$1,350 installed. Vinyl is more affordable at $450–$825, while copper runs $3,000–$5,700.' },
      { q: 'What’s the most popular gutter material?', a: 'Aluminum is the most common choice for residential gutters — it doesn’t rust, is lightweight, comes in many colors, and costs significantly less than steel or copper.' },
      { q: 'Should I replace gutters at the same time as my roof?', a: 'Yes, if your gutters are worn or the wrong size for your new roofline — bundling the two jobs typically saves on labor and ensures proper flashing integration between the roof edge and gutter system.' },
      { q: 'Are gutter guards worth the extra cost?', a: 'Gutter guards add $1.50–$4.50 per linear foot but can significantly reduce how often you need to clean your gutters, which is worth it for homes surrounded by trees.' },
    ],
    relatedSlugs: ['asphalt-shingle-roof-cost', 'roof-repair-cost', 'roof-inspection-cost'],
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
// (or per-sqft/per-lf tier x typical quantity) used as the big price at the
// top of a service page and in the homepage service cards.
export function typicalCost(service) {
  const tier = service.tiers[service.typicalTierIndex] || service.tiers[0];
  if (service.unitType === 'flat') return { low: tier.low, high: tier.high };
  const qty = service.typicalQuantity || 1;
  return { low: Math.round(tier.low * qty), high: Math.round(tier.high * qty) };
}
