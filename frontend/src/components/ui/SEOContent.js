import React from 'react';

const sections = [
  {
    heading: 'How Much Does a New Roof Cost in 2026?',
    body: `The national average for a full roof replacement ranges from about $4,900 to $12,500 for a standard 1,500–2,000 sq ft home using asphalt shingles, though costs vary widely by material, location, and roof complexity. Asphalt shingles remain the most affordable option at $3.25–$6.25 per square foot installed, while metal roofing runs $7.50–$21/sq ft and premium tile can reach $34/sq ft. Your ZIP code is one of the biggest cost drivers — labor rates in California or New York run about 45–48% above the national average.`,
  },
  {
    heading: 'Roofing Cost by Material',
    body: `Asphalt 3-tab shingles ($3.25–$4.75/sq ft) are the budget choice, while architectural shingles ($4.25–$6.25/sq ft) offer better durability. Standing seam metal roofing ($15–$21/sq ft) lasts 40–70 years and is increasingly popular — other metal styles like corrugated panels start lower, around $7.50/sq ft. Clay or concrete tile ($10–$22/sq ft) suits warm climates and lasts 50+ years. Flat roofing systems like TPO or EPDM ($5–$8.50/sq ft installed) are common on low-slope commercial and modern residential roofs.`,
  },
  {
    heading: 'Roof Repair vs. Full Replacement',
    body: `Minor repairs — patching a few shingles, sealing flashing, fixing a small leak — typically run $150–$450. Larger repairs like replacing a section or fixing a valley leak run $1,000–$2,800, and major storm damage can reach $2,500–$6,500. When repairs exceed 30–40% of the roof's area, or when the roof is over 20 years old, full replacement usually offers better long-term value. A standard professional inspection ($150–$325) can help you decide which makes more sense.`,
  },
  {
    heading: 'What Affects Your Roofing Estimate?',
    body: `Key factors include: roof size (measured in "squares" = 100 sq ft), pitch/steepness (steep roofs require more safety equipment and labor), the number of stories, current roof material (tear-off costs vary), local labor rates, and add-ons like new roof decking, ice-and-water shield, or ridge ventilation. Permits typically add $100–$500 depending on your municipality — this is a general guideline, not something our calculator itemizes, since requirements vary by city and county.`,
  },
  {
    heading: 'Gutter Replacement Costs',
    body: `New aluminum gutters run $5–$9 per linear foot installed. Copper gutters cost $20–$38/ft but last decades longer. A typical 150-foot gutter system for a single-story home runs $750–$1,350 in aluminum. Gutter guards add $1.50–$4.50/ft but can significantly cut down on cleaning. If you're replacing your roof, bundling gutter replacement is often cheaper than doing them separately.`,
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
