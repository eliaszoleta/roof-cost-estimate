// ─── Homepage FAQ content ───────────────────────────────────────────────────
// General roofing-cost questions shown on the homepage FAQ section, with
// FAQPage schema. Service-specific FAQs live alongside each service in
// services.js; state-specific context is generated in statePricing.js /
// the StatePage component.

const FAQS = [
  {
    q: 'How much does a roof replacement cost?',
    a: 'Roof replacement typically costs $5,500–$15,000 for an average home, depending on size, material, and location. Asphalt shingles average $3.25–$6.25 per sq ft installed for the most common tiers, while metal, tile, and premium materials cost significantly more.',
  },
  {
    q: 'How much does roof repair cost?',
    a: 'Minor roof repairs — a few shingles, flashing, or a small leak — cost $150–$450. Larger repairs covering more of the roof or storm damage can run $1,000–$6,500 depending on scope.',
  },
  {
    q: 'How much does a metal roof cost?',
    a: 'Metal roofing costs $7.50–$21 per sq ft installed. Corrugated panels are the most affordable option, while standing seam — the premium, longest-lasting choice — runs $15–$21 per sq ft.',
  },
  {
    q: 'How long does a roof last?',
    a: 'Asphalt shingles last 20–30 years. Metal roofs last 40–70 years. Tile and slate roofs can last 50–100+ years with proper maintenance.',
  },
  {
    q: 'Is RoofingCal really free?',
    a: 'Yes, 100% free. No account needed. Enter your ZIP code and roof details to get an instant, location-specific estimate you can use to compare contractor quotes.',
  },
  {
    q: 'What factors affect my roofing estimate the most?',
    a: 'The five biggest factors are: roof size, material choice, pitch/steepness, number of stories, and your location. Labor rates in high cost-of-living states like California, New York, and Hawaii can run 30–55% above the national average.',
  },
  {
    q: 'Do I need a permit to replace my roof?',
    a: 'Most municipalities require a roofing permit, typically costing $100–$500. Reputable contractors pull permits as a standard part of the job — skipping one can void your homeowner\'s insurance and create issues when you sell your home.',
  },
  {
    q: 'What time of year is cheapest to replace a roof?',
    a: 'Late fall and winter (outside of freezing regions) tend to be the roofing industry\'s slower season, so some contractors offer lower pricing or faster scheduling. Spring and summer are the busiest and most expensive months in most markets.',
  },
  {
    q: 'Will homeowners insurance cover my roof replacement?',
    a: 'Sudden damage from storms, wind, hail, or fallen debris is often covered under a standard homeowner\'s policy. Gradual wear-and-tear or age-related deterioration typically is not. Document damage with photos and contact your insurer before starting any work.',
  },
  {
    q: 'How is roof size measured for pricing?',
    a: 'Roofers price by the "square" — 1 square = 100 sq ft of actual roof surface. Because of pitch, your roof surface is larger than your home\'s footprint; a steep roof can have significantly more surface area than a flat one over the same floor plan.',
  },
  {
    q: 'Should I get multiple roofing quotes?',
    a: 'Yes — getting at least three in-person quotes from licensed, insured contractors is the best way to confirm you\'re getting a fair price and can save 10–15% versus accepting the first bid.',
  },
  {
    q: 'How accurate is RoofingCal\'s estimate?',
    a: 'Our estimates use ZIP-code-level labor data, national material pricing, and your specific roof details (size, pitch, material, complexity) to generate a realistic low-to-high range. Final pricing always requires an in-person contractor assessment.',
  },
];

export function getAllFaqs() {
  return FAQS;
}
