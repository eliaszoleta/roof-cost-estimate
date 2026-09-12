import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Home, Layers, LayoutGrid, Square, Wrench, ScanSearch, Droplets, Check, MapPin, Ruler, ListChecks, RefreshCw, PlusCircle, Mountain } from 'lucide-react';
import { getAllFaqs } from '../../data/faqs';
import { getAllServices, typicalCost } from '../../data/services';
import { getFeaturedStates } from '../../data/statePricing';
import { url } from '../../utils/routes';

const PRIMARY = '#ea580c';

const FAQ = getAllFaqs();

const PRICE_FACTORS = [
  { Icon: Ruler, term: 'Roof Size (Square Footage)', detail: 'Your base price scales with roof area — $5,100–$7,500 for a roof under 1,500 sq ft, up to $14,900–$21,900 for one over 3,000 sq ft (shingle replacement).' },
  { Icon: ListChecks, term: 'Material', detail: 'Asphalt shingle is the baseline. Metal costs roughly 2–4x more upfront, tile 2–7x more, and flat/low-slope membranes fall between shingle and metal.' },
  { Icon: Mountain, term: 'Pitch & Complexity', detail: 'Steep pitch (6:12–9:12) adds about 28% to labor; very steep (9:12+) adds up to 50%. Complex shapes with dormers and multiple peaks add another 20%.' },
  { Icon: MapPin, term: 'Location (ZIP Code)', detail: 'State labor rates and cost of living adjust your price — California and Hawaii run 45–55% above the national average; many Southern and Midwest states run below it.' },
  { Icon: PlusCircle, term: 'Tear-Off & Decking', detail: 'Removing one existing layer adds $0.80–$1.20/sq ft, two layers $1.30–$1.90/sq ft. Rotted decking found underneath adds $2.00–$5.50/sq ft.' },
  { Icon: RefreshCw, term: 'Penetrations', detail: 'Chimneys, skylights, and pipe boots each need custom flashing — a handful of penetrations adds $350–$2,200 depending on how many.' },
];

const ICONS = {
  shingle_replacement: Home,
  metal_roofing: Layers,
  tile_roofing: LayoutGrid,
  flat_roof: Square,
  roof_repair: Wrench,
  roof_inspection: ScanSearch,
  gutter_replacement: Droplets,
};
const COLORS = {
  shingle_replacement: { color: '#ea580c', bg: '#fff7ed' },
  metal_roofing: { color: '#0891b2', bg: '#ecfeff' },
  tile_roofing: { color: '#7c3aed', bg: '#f5f3ff' },
  flat_roof: { color: '#2563eb', bg: '#eff6ff' },
  roof_repair: { color: '#d97706', bg: '#fffbeb' },
  roof_inspection: { color: '#0d9488', bg: '#f0fdfa' },
  gutter_replacement: { color: '#0284c7', bg: '#f0f9ff' },
};
const TIER_NOTE = {
  high: 'Higher cost of living drives premium pricing',
  low: 'Lower cost market, competitive pricing',
  average: 'Close to the national average for roofing costs',
};

const DETAIL_OVERRIDES = {
  shingle_replacement: 'installed, 1,500–2,000 sq ft roof',
  metal_roofing: 'for a 2,000 sq ft roof, standing seam',
  tile_roofing: 'for a 2,000 sq ft roof, concrete tile',
  flat_roof: 'for an 1,800 sq ft roof, TPO',
  roof_repair: 'for a small, 50–200 sq ft repair',
  roof_inspection: 'standard visual inspection',
  gutter_replacement: 'for a 180 linear ft home, aluminum',
};

function formatPrice(n) {
  return `$${Math.round(n).toLocaleString('en-US')}`;
}

const SERVICES = getAllServices().map(service => {
  const cost = typicalCost(service);
  return {
    id: service.id,
    Icon: ICONS[service.id] || Home,
    ...COLORS[service.id],
    title: service.name,
    range: `${formatPrice(cost.low)} – ${formatPrice(cost.high)}`,
    detail: DETAIL_OVERRIDES[service.id] || service.unit,
    href: url(`/roofing-services/${service.slug}`),
    facts: service.bullets.slice(0, 3),
  };
});

// What the calculator actually asks for each service — pulled from each
// step component's real form fields (RoofDetailsStep.js, RepairStep.js,
// InspectionStep.js, GutterStep.js), not a generic restatement.
const SERVICE_PRICE_FACTORS = {
  shingle_replacement: [
    'Roof size — square footage tiers from under 1,000 to 4,000+ sq ft',
    'Story count: 1, 2, or 3+ stories',
    'Existing layers to tear off, and number of roof penetrations (chimneys, skylights, pipes)',
    'Pitch: low, medium, or steep, and shape complexity: simple, moderate, or complex',
    'Shingle grade: 3-tab/standard, architectural, or designer/premium',
    'Add-ons: new decking, ridge ventilation, ice & water shield upgrade',
  ],
  metal_roofing: [
    'Roof size, story count, pitch, and shape complexity — same fields as shingle replacement',
    'Panel type: standing seam, corrugated, or ribbed/R-panel',
    'Existing layers to tear off and number of penetrations',
    'Add-ons: new decking, ridge ventilation, ice & water shield upgrade',
  ],
  tile_roofing: [
    'Roof size, story count, pitch, and shape complexity',
    'Tile type: clay, concrete, or slate',
    'Existing layers to tear off and number of penetrations',
    'Add-ons: new decking, ridge ventilation, ice & water shield upgrade',
  ],
  flat_roof: [
    'Roof size, story count, and shape complexity',
    'Membrane type and existing layers to tear off',
    'Number of penetrations (vents, HVAC curbs, skylights)',
    'Add-ons: new decking, ice & water shield upgrade',
  ],
  roof_repair: [
    'Repair type (leak, missing shingles, flashing, storm damage)',
    'Damage size: minor, small, medium, or large',
    'Story count: 1, 2, or 3+ stories',
    'Approximate roof age',
  ],
  roof_inspection: [
    'Property type',
    'Story count: 1, 2, or 3+ stories',
    'Approximate roof age',
    'Reason for the inspection (routine, pre-purchase, post-storm, insurance)',
  ],
  gutter_replacement: [
    'Gutter material: aluminum, vinyl, steel, or copper',
    'Total linear footage needed',
    'Story count: 1, 2, or 3+ stories',
    'Add-ons: downspouts, gutter guards',
  ],
};

const STATES_DATA = getFeaturedStates().map(s => ({
  state: s.name,
  avg: `${formatPrice(s.low)}–${formatPrice(s.high)}`,
  note: TIER_NOTE[s.tier],
  href: url(`/roof-cost/${s.slug}`),
}));

export default function SEOContent() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  const webAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'RoofingCal — Free Roof Cost Calculator',
    url: 'https://roofingcal.com',
    description: 'Free roof cost calculator and estimator for US homeowners. Every price factors in roof size, pitch, material, and complexity, then adjusts for ZIP-code specific labor rates, for shingle, metal, tile, and flat roofing, plus repair, inspection, and gutters across all 50 states.',
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Web',
    browserRequirements: 'Requires JavaScript',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    featureList: [
      'Free roof cost estimates with no signup',
      'Every service asks about size, pitch, complexity, and material — not just ZIP code',
      'ZIP-code specific pricing across all 50 US states',
      'Asphalt shingle roof replacement cost calculator',
      'Metal roof cost calculator',
      'Tile roof cost estimator',
      'Flat / TPO roof cost calculator',
      'Roof repair cost estimator',
      'Roof inspection cost calculator',
      'Gutter installation cost estimator',
    ],
    publisher: {
      '@type': 'Organization',
      name: 'RoofingCal',
      url: 'https://roofingcal.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://roofingcal.com/og-image.svg',
      },
    },
  };

  return (
    <>
      <Helmet>
        <title>Free Roofing Cost Calculator 2026 | RoofingCal</title>
        <meta name="description" content="Free roofing cost calculator for 2026. Get instant ZIP-code specific estimates: shingle roof replacement $5,100–$21,900, metal roofing, tile, flat/TPO, repair, inspection, gutters & more. No signup needed." />
        <meta name="keywords" content="roof cost calculator, roofing cost estimator, roof replacement cost, how much does a new roof cost, shingle roof cost, metal roof cost, tile roof cost, flat roof cost, roof repair cost, roof inspection cost, gutter installation cost, free roofing estimate" />
        <link rel="canonical" href="https://roofingcal.com/" />
        <meta property="og:site_name" content="RoofingCal" />
        <meta property="og:title" content="Free Roofing Cost Calculator 2026 | RoofingCal" />
        <meta property="og:description" content="Instant ZIP-code specific roofing cost estimates. Shingle, metal, tile, flat roofing, repair, inspection, gutters and more. Free, no signup." />
        <meta property="og:url" content="https://roofingcal.com/" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free Roofing Cost Calculator 2026 | RoofingCal" />
        <meta name="twitter:description" content="Free roof cost calculator — instant ZIP-code specific estimates for any roofing project. No signup required." />
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(webAppSchema)}</script>
      </Helmet>

      <div style={{ background: 'white' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', padding: 'clamp(32px, 7vw, 56px) 20px 0', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(18px, 4.5vw, 22px)', fontWeight: 700, color: '#0f172a', marginBottom: 12, letterSpacing: '-0.3px' }}>
            Get a FREE Roof Cost Estimate Online
          </h2>
          <p style={{ fontSize: 14.5, color: '#64748b', lineHeight: 1.7, margin: '0 auto 14px' }}>
            No sales calls, no waiting on a callback — just a real roof cost estimate online, built from actual material and labor pricing data instead of a generic national average. Enter your ZIP code and a few details about your roof: size, pitch, story count, and shape complexity. Every price factors in the same variables a roofing contractor actually walks your roof to check.
          </p>
          <p style={{ fontSize: 14.5, color: '#64748b', lineHeight: 1.7, margin: '0 auto 14px' }}>
            It works the same way across all 7 services — asphalt shingle replacement, metal roofing, tile roofing, flat/low-slope roofing, roof repair, roof inspection, and gutter installation — each with its own scope questions, not a one-size-fits-all form.
          </p>
          <p style={{ fontSize: 14.5, color: '#64748b', lineHeight: 1.7, margin: '0 auto' }}>
            It's available 24/7, works the same on mobile or desktop, and there's no signup required to see your roofing cost estimate online — just your price range, instantly.
          </p>
        </div>

        <div style={{ maxWidth: 860, margin: 'clamp(28px, 6vw, 48px) auto 0', padding: '0 20px clamp(32px, 7vw, 56px)' }}>
          <h2 style={{ fontSize: 'clamp(18px, 4.5vw, 22px)', fontWeight: 700, color: '#0f172a', marginBottom: 16, textAlign: 'center' }}>Average Roofing Costs (2026)</h2>
          <ul style={{ margin: '0 0 40px', paddingLeft: 20, color: '#374151', fontSize: 15, lineHeight: 1.9 }}>
            <li><strong>Asphalt Shingle Replacement:</strong> $5,100–$21,900 depending on roof size — $7,400–$10,900 is typical for the most common 1,500–2,000 sq ft roof.</li>
            <li><strong>Metal Roofing:</strong> $15,000–$42,000 for a typical 2,000 sq ft roof, depending on panel type.</li>
            <li><strong>Tile Roofing:</strong> $20,000–$68,000 for a typical 2,000 sq ft roof, depending on material.</li>
            <li><strong>Flat / Low-Slope Roofing:</strong> $8,100–$17,100 for a typical 1,800 sq ft roof, depending on membrane.</li>
            <li><strong>Roof Repair:</strong> $150–$6,500 depending on damage size — $400–$1,100 is typical for a small, localized repair.</li>
          </ul>

          <h2 style={{ fontSize: 'clamp(18px, 4.5vw, 22px)', fontWeight: 700, color: '#0f172a', marginBottom: 10, textAlign: 'center' }}>Key Pricing Factors</h2>
          <p style={{ textAlign: 'center', color: '#64748b', fontSize: 14.5, maxWidth: 620, margin: '0 auto 18px', lineHeight: 1.7 }}>
            Every price on this roof cost estimator depends on size, material, and roof shape — and that's true for all 7 services, not just full replacement.
          </p>
          <ul style={{ margin: '0 0 24px', paddingLeft: 20, color: '#374151', fontSize: 15, lineHeight: 1.9 }}>
            <li><strong>Roof Size:</strong> Base price scales with square footage — larger roofs mean more material and labor.</li>
            <li><strong>Pitch:</strong> Steeper roofs need harnesses and take longer, adding up to 50% for very steep pitches.</li>
            <li><strong>Material:</strong> Not just shingles — every one of our 7 services asks its own scope questions. See the full breakdown by service below.</li>
            <li><strong>Tear-Off:</strong> Removing existing layers adds $0.80–$1.90/sq ft depending on how many layers are already there.</li>
            <li><strong>Penetrations:</strong> Chimneys, skylights, and pipe boots each need custom flashing, priced separately from the base roof.</li>
          </ul>
          <p style={{ textAlign: 'center', fontSize: 13.5, color: '#94a3b8', marginBottom: 'clamp(28px, 6vw, 48px)' }}>
            See the full breakdown on our <a href={url('/how-we-calculate-prices')} style={{ color: PRIMARY, fontWeight: 600 }}>pricing methodology page</a>.
          </p>

          <h2 style={{ fontSize: 'clamp(18px, 4.5vw, 22px)', fontWeight: 700, color: '#0f172a', marginBottom: 10, textAlign: 'center' }}>What Affects Your Price, by Service</h2>
          <p style={{ textAlign: 'center', color: '#64748b', fontSize: 14.5, maxWidth: 640, margin: '0 auto 24px', lineHeight: 1.7 }}>
            Every service on this roof cost estimator asks its own scope questions — not just square footage and ZIP code. Here's exactly what factors into each one.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
            {SERVICES.map(({ id, Icon, color, bg, title, href }) => (
              <div key={id} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 14, padding: '20px 22px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <span style={{ width: 30, height: 30, borderRadius: 9, background: bg, color: color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={15} strokeWidth={2.1} />
                  </span>
                  <a href={href} style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', textDecoration: 'none' }}>{title}</a>
                </div>
                <ul style={{ margin: 0, paddingLeft: 18, color: '#475569', fontSize: 13, lineHeight: 1.7 }}>
                  {(SERVICE_PRICE_FACTORS[id] || []).map((factor, i) => <li key={i}>{factor}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div id="services" style={{ background: 'white' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: 'clamp(40px, 8vw, 80px) 20px' }}>

          {/* Services grid */}
          <div style={{ textAlign: 'center', marginBottom: 'clamp(32px, 7vw, 52px)' }}>
            <h2 style={{ fontSize: 'clamp(22px, 6vw, 32px)', fontWeight: 700, color: '#0f172a', marginBottom: 12, letterSpacing: '-0.5px' }}>
              Roof Cost Calculator — Every Service, Every State
            </h2>
            <p style={{ fontSize: 17, color: '#64748b', maxWidth: 580, margin: '0 auto' }}>
              RoofingCal covers 7 roofing services with ZIP-code specific pricing across all 50 states. Select a service below to get your instant estimate.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16, marginBottom: 'clamp(44px, 9vw, 80px)' }}>
            {SERVICES.map(({ Icon, color, bg, title, range, detail, href, facts }) => (
              <a
                key={title} href={href}
                style={{ display: 'block', background: 'white', border: '1.5px solid #e2e8f0', borderRadius: 14, padding: '22px 20px', textDecoration: 'none', transition: 'all 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 8px 28px ${color}22`; e.currentTarget.style.borderColor = color; e.currentTarget.style.transform = 'translateY(-2px)'; const tile = e.currentTarget.querySelector('.svc-icon'); tile.style.background = color; tile.style.color = 'white'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)'; e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.transform = 'none'; const tile = e.currentTarget.querySelector('.svc-icon'); tile.style.background = bg; tile.style.color = color; }}
              >
                <div
                  className="svc-icon"
                  style={{ width: 40, height: 40, borderRadius: 10, background: bg, color: color, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12, transition: 'all 0.2s' }}
                >
                  <Icon size={19} strokeWidth={1.8} />
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 3 }}>{title}</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: PRIMARY, marginBottom: 2, letterSpacing: '-0.3px' }}>{range}</div>
                <div style={{ fontSize: 12.5, color: '#64748b', marginBottom: 14 }}>{detail}</div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {facts.map(f => (
                    <li key={f} style={{ fontSize: 13, color: '#475569', marginBottom: 5, display: 'flex', alignItems: 'flex-start', gap: 7 }}>
                      <Check size={13} color="#16a34a" strokeWidth={3} strokeLinecap="square" strokeLinejoin="miter" style={{ flexShrink: 0, marginTop: 1 }} />{f}
                    </li>
                  ))}
                </ul>
              </a>
            ))}
          </div>

          {/* State pricing table */}
          <div style={{ marginBottom: 'clamp(44px, 9vw, 80px)' }}>
            <h2 style={{ fontSize: 'clamp(20px, 5.2vw, 28px)', fontWeight: 700, color: '#0f172a', textAlign: 'center', marginBottom: 10, letterSpacing: '-0.3px' }}>
              Roof Replacement Cost by State — 2026 Averages
            </h2>
            <p style={{ textAlign: 'center', color: '#64748b', fontSize: 15, marginBottom: 'clamp(20px, 4.5vw, 32px)' }}>
              Average price for a full asphalt shingle roof replacement, 2,000 sq ft roof.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 10 }}>
              {STATES_DATA.map(s => (
                <a key={s.state} href={s.href} style={{ textDecoration: 'none' }}>
                  <div
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', background: '#f8fafc', borderRadius: 10, padding: '13px 16px', border: '1px solid #f1f5f9', transition: 'border-color 0.15s, background 0.15s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#fed7aa'; e.currentTarget.style.background = '#fff7ed'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#f1f5f9'; e.currentTarget.style.background = '#f8fafc'; }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontWeight: 700, fontSize: 14, color: '#0f172a' }}><MapPin size={12} color={PRIMARY} />{s.state}</div>
                      <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{s.note}</div>
                    </div>
                    <div style={{ fontWeight: 800, fontSize: 15, color: PRIMARY, whiteSpace: 'nowrap', marginLeft: 12 }}>{s.avg}</div>
                  </div>
                </a>
              ))}
            </div>
            <p style={{ textAlign: 'center', fontSize: 12.5, color: '#94a3b8', marginTop: 14 }}>
              Prices vary. <a href={url('/')} style={{ color: PRIMARY }}>Use the calculator above</a> for a ZIP-code specific estimate.
            </p>
          </div>

          {/* How the roof cost estimator calculates price */}
          <div style={{ marginBottom: 'clamp(44px, 9vw, 80px)' }}>
            <h2 style={{ fontSize: 'clamp(20px, 5.2vw, 28px)', fontWeight: 700, color: '#0f172a', textAlign: 'center', marginBottom: 10, letterSpacing: '-0.3px' }}>
              How Our Roof Cost Calculator Estimates Your Price
            </h2>
            <p style={{ textAlign: 'center', color: '#64748b', fontSize: 15, maxWidth: 640, margin: '0 auto 12px' }}>
              RoofingCal is a free roof cost calculator that builds every quote from six real variables — not a flat national guess. Here's exactly what goes into your number.
            </p>
            <p style={{ textAlign: 'center', fontSize: 14, margin: '0 auto clamp(22px, 5vw, 36px)' }}>
              <a href={url('/how-we-calculate-prices')} style={{ color: PRIMARY, fontWeight: 700, textDecoration: 'none' }}>See our full pricing methodology and sources &rarr;</a>
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, maxWidth: 980, margin: '0 auto' }}>
              {PRICE_FACTORS.map(({ Icon, term, detail }) => (
                <div key={term} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 14, padding: '20px 22px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <span style={{ width: 30, height: 30, borderRadius: 9, background: '#fff7ed', color: PRIMARY, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={15} strokeWidth={2.25} />
                    </span>
                    <strong style={{ fontSize: 15, color: '#0f172a' }}>{term}</strong>
                  </div>
                  <p style={{ fontSize: 13.5, color: '#475569', lineHeight: 1.65, margin: 0 }}>{detail}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Key features for businesses */}
          <div style={{ marginBottom: 'clamp(44px, 9vw, 80px)' }}>
            <h2 style={{ fontSize: 'clamp(20px, 5.2vw, 28px)', fontWeight: 700, color: '#0f172a', textAlign: 'center', marginBottom: 10, letterSpacing: '-0.3px' }}>
              Key Features for Roofing Companies
            </h2>
            <p style={{ textAlign: 'center', color: '#64748b', fontSize: 15, maxWidth: 620, margin: '0 auto clamp(20px, 4.5vw, 32px)' }}>
              RoofingCal isn't just a consumer tool — roofing contractors work with us two ways.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, maxWidth: 980, margin: '0 auto' }}>
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 14, padding: '24px 26px' }}>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>Local Partner Program</h3>
                <p style={{ fontSize: 13.5, color: '#475569', lineHeight: 1.65, margin: '0 0 14px' }}>
                  Exclusive, one-partner-per-city placement — your business is recommended directly to homeowners in your city actively searching for a roofing contractor.
                </p>
                <a href={url('/partner-with-us')} style={{ fontSize: 13.5, color: PRIMARY, fontWeight: 700, textDecoration: 'none' }}>See partner program details &rarr;</a>
              </div>
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 14, padding: '24px 26px' }}>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>Website Integration</h3>
                <p style={{ fontSize: 13.5, color: '#475569', lineHeight: 1.65, margin: '0 0 14px' }}>
                  Embed a branded, white-labeled roof cost calculator directly on your own website to capture leads.
                </p>
                <a href={url('/for-companies')} style={{ fontSize: 13.5, color: PRIMARY, fontWeight: 700, textDecoration: 'none' }}>See embeddable calculator details &rarr;</a>
              </div>
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 14, padding: '24px 26px' }}>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>No Signup Needed for Homeowners</h3>
                <p style={{ fontSize: 13.5, color: '#475569', lineHeight: 1.65, margin: 0 }}>
                  Homeowners get instant, free estimates without creating an account — so every lead reaching a partner or embedded calculator is already warm.
                </p>
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div>
            <h2 style={{ fontSize: 'clamp(20px, 5.2vw, 28px)', fontWeight: 700, color: '#0f172a', textAlign: 'center', marginBottom: 'clamp(22px, 5vw, 36px)', letterSpacing: '-0.3px' }}>
              Frequently Asked Questions
            </h2>
            <div style={{ maxWidth: 820, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {FAQ.map(({ q, a }) => (
                <details key={q} style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: 12, overflow: 'hidden' }}>
                  <summary style={{ padding: '16px 22px', fontWeight: 600, fontSize: 15, color: '#0f172a', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {q}
                    <span style={{ fontSize: 18, color: PRIMARY, flexShrink: 0, marginLeft: 12, fontWeight: 400 }}>+</span>
                  </summary>
                  <div style={{ padding: '0 22px 16px', fontSize: 14.5, color: '#374151', lineHeight: 1.7 }}>{a}</div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
