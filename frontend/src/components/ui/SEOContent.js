import React from 'react';

const sections = [
  {
    heading: 'How Much Does a New Roof Cost in 2026?',
    body: `The national average for a full roof replacement ranges from $5,500 to $12,000 for a standard 1,500–2,000 sq ft home, though costs vary widely by material, location, and roof complexity. Asphalt shingles remain the most affordable option at $3.50–$5.50 per square foot installed, while metal roofing runs $7–$14/sq ft and premium tile can reach $20+/sq ft. Your ZIP code is one of the biggest cost drivers — labor rates in California or New York can run 30–50% above the national average.`,
  },
  {
    heading: 'Roofing Cost by Material',
    body: `Asphalt 3-tab shingles ($3.50–$4.50/sq ft) are the budget choice, while architectural shingles ($4.50–$6.50/sq ft) offer better durability. Metal roofing (standing seam, $10–$16/sq ft) lasts 40–70 years and is increasingly popular. Clay or concrete tile ($10–$20/sq ft) suits warm climates and lasts 50+ years. Flat roofing systems like TPO or EPDM ($4–$8/sq ft installed) are common on low-slope commercial and modern residential roofs.`,
  },
  {
    heading: 'Roof Repair vs. Full Replacement',
    body: `Minor repairs — patching a few shingles, sealing flashing, fixing a small leak — typically run $150–$500. Moderate repairs like replacing a large section or valley repair cost $400–$1,500. When repairs exceed 30–40% of the roof's area, or when the roof is over 20 years old, full replacement usually offers better long-term value. A professional inspection ($100–$300) can help you decide which makes more sense.`,
  },
  {
    heading: 'What Affects Your Roofing Estimate?',
    body: `Key factors include: roof size (measured in "squares" = 100 sq ft), pitch/steepness (steep roofs require more safety equipment and labor), the number of stories, current roof material (tear-off costs vary), local labor rates, and add-ons like new roof decking, ice-and-water shield, or ridge ventilation. Permits typically add $100–$500 depending on your municipality.`,
  },
  {
    heading: 'Gutter Replacement Costs',
    body: `New aluminum gutters run $6–$12 per linear foot installed. Copper gutters cost $20–$40/ft but last decades longer. A typical 150-foot gutter system for a single-story home runs $900–$1,800 installed. Gutter guards add $5–$12/ft but can eliminate cleaning costs. If you're replacing your roof, bundling gutter replacement is often cheaper than doing them separately.`,
  },
];

export default function SEOContent() {
  return (
    <section style={{ background: 'white', borderTop: '1px solid #e2e8f0', padding: '56px 24px 64px' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <h2 style={{ fontSize: 'clamp(22px, 4vw, 30px)', fontWeight: 800, color: '#0f172a', marginBottom: 8, textAlign: 'center' }}>
          Roofing Cost Guide 2026
        </h2>
        <p style={{ color: '#64748b', textAlign: 'center', fontSize: 15, marginBottom: 48 }}>
          Everything you need to know before getting a roofing quote.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
          {sections.map(({ heading, body }) => (
            <div key={heading}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', marginBottom: 10 }}>{heading}</h3>
              <p style={{ fontSize: 14.5, color: '#475569', lineHeight: 1.75, margin: 0 }}>{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
