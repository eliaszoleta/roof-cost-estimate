import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { ChevronDown, Home, Layers, LayoutGrid, Square, Wrench, ScanSearch, Droplets, MapPin } from 'lucide-react';
import { getCityBySlug, getCitiesByState, getFeaturedCities, cityServicePrices } from '../../data/cityPricing';
import { getAllFaqs } from '../../data/faqs';
import { url } from '../../utils/routes';

const PRIMARY = '#ea580c';
const PRIMARY_DARK = '#c2410c';

const ICONS = {
  shingle_replacement: Home,
  metal_roofing: Layers,
  tile_roofing: LayoutGrid,
  flat_roof: Square,
  roof_repair: Wrench,
  roof_inspection: ScanSearch,
  gutter_replacement: Droplets,
};

const TIER_COPY = {
  high: (name) => `Roofing costs in ${name} run above the national average, in line with ${name}'s overall cost of living.`,
  low: (name) => `Roofing costs in ${name} run below the national average, making it a comparatively affordable market for roofing work.`,
  average: (name) => `Roofing costs in ${name} are close to the national average.`,
};

function formatPrice(n) {
  return `$${Math.round(n).toLocaleString('en-US')}`;
}

function CityServiceTable({ city }) {
  const rows = cityServicePrices(city);
  return (
    <div style={{ overflowX: 'auto', margin: '20px 0' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
        <thead>
          <tr style={{ background: '#f8fafc' }}>
            <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 700, color: '#374151', borderBottom: '2px solid #e2e8f0' }}>Service</th>
            <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 700, color: '#374151', borderBottom: '2px solid #e2e8f0', whiteSpace: 'nowrap' }}>{city.name} Estimate</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ service, low, high }, i) => {
            const Icon = ICONS[service.id] || Home;
            return (
              <tr key={service.id} style={{ background: i % 2 === 0 ? 'white' : '#fafafa' }}>
                <td style={{ padding: '10px 14px', borderBottom: '1px solid #f1f5f9' }}>
                  <a href={url(`/roofing-services/${service.slug}`)} style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#0f172a', fontWeight: 600, textDecoration: 'none' }}>
                    <Icon size={15} color={PRIMARY} strokeWidth={1.75} />{service.name}
                  </a>
                </td>
                <td style={{ padding: '10px 14px', color: PRIMARY, fontWeight: 700, borderBottom: '1px solid #f1f5f9', whiteSpace: 'nowrap' }}>
                  {formatPrice(low)}–{formatPrice(high)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function FaqAccordion({ faqs }) {
  const [openIndex, setOpenIndex] = useState(0);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {faqs.map((faq, i) => {
        const open = openIndex === i;
        return (
          <div key={i} style={{ background: '#fafafa', border: '1px solid #f1f5f9', borderRadius: 10, overflow: 'hidden' }}>
            <button
              onClick={() => setOpenIndex(open ? -1 : i)}
              style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, padding: '14px 18px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
              aria-expanded={open}
            >
              <span style={{ fontWeight: 700, fontSize: 14.5, color: '#0f172a' }}>{faq.q}</span>
              <ChevronDown size={16} color="#94a3b8" style={{ flexShrink: 0, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
            </button>
            {open && (
              <div style={{ padding: '0 18px 16px' }}>
                <p style={{ fontSize: 13.5, color: '#475569', lineHeight: 1.7, margin: 0 }}>{faq.a}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function CityPage({ slug }) {
  const city = getCityBySlug(slug);

  if (!city) return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12 }}>
      <h2 style={{ color: '#0f172a' }}>City not found</h2>
      <a href={url('/')} style={{ color: PRIMARY, fontWeight: 600 }}>← Back to home</a>
    </div>
  );

  const otherCitiesInState = getCitiesByState(city.stateSlugRef).filter(c => c.slug !== city.slug);
  const featuredCities = getFeaturedCities().filter(c => c.slug !== city.slug).slice(0, 8);
  const faqs = getAllFaqs().slice(0, 5);
  const pctVsNational = Math.round((city.multiplier - 1) * 100);

  const title = `Roofing Cost in ${city.name}, ${city.stateCode} (2026) | RoofingCal`;
  const description = `See average roofing costs in ${city.name}, ${city.stateName} for 2026: shingle, metal, tile, flat roofing, repair, inspection, and gutters. Get a free instant estimate.`;

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://roofingcal.com' },
      { '@type': 'ListItem', position: 2, name: `Roof Cost in ${city.stateName}`, item: `https://roofingcal.com/roof-cost/${city.stateSlugRef}` },
      { '@type': 'ListItem', position: 3, name: `Roof Cost in ${city.name}`, item: `https://roofingcal.com/roof-cost/city/${city.slug}` },
    ],
  };
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={`https://roofingcal.com/roof-cost/city/${city.slug}`} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <script type="application/ld+json">{JSON.stringify(breadcrumb)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '40px 24px 64px' }}>
        <div style={{ maxWidth: 780, margin: '0 auto' }}>

          <div style={{ display: 'flex', gap: 6, fontSize: 13, color: '#94a3b8', marginBottom: 24, flexWrap: 'wrap' }}>
            <a href={url('/')} style={{ color: '#64748b', textDecoration: 'none' }}>Home</a>
            <span>›</span>
            <a href={url(`/roof-cost/${city.stateSlugRef}`)} style={{ color: '#64748b', textDecoration: 'none' }}>{city.stateName}</a>
            <span>›</span>
            <span style={{ color: '#0f172a' }}>{city.name}</span>
          </div>

          <div style={{ background: 'white', borderRadius: 14, border: '1px solid #e2e8f0', padding: '32px 36px', marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <MapPin size={18} color={PRIMARY} />
              <span style={{ fontSize: 12, fontWeight: 700, color: PRIMARY, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{city.name}, {city.stateCode}</span>
            </div>
            <h1 style={{ fontSize: 'clamp(24px,4vw,32px)', fontWeight: 800, color: '#0f172a', lineHeight: 1.25, marginBottom: 10 }}>Roofing Cost in {city.name}, {city.stateCode} (2026)</h1>
            <p style={{ fontSize: 15.5, color: '#64748b', lineHeight: 1.7, marginBottom: 20 }}>
              {TIER_COPY[city.tier](city.name)} {pctVsNational !== 0 && `That's about ${Math.abs(pctVsNational)}% ${pctVsNational > 0 ? 'above' : 'below'} the national average, matching the broader ${city.stateName} market.`}
            </p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 30, fontWeight: 800, color: PRIMARY }}>{formatPrice(city.low)} – {formatPrice(city.high)}</span>
              <span style={{ fontSize: 13, color: '#94a3b8' }}>full asphalt shingle roof replacement, 2,000 sq ft roof</span>
            </div>
          </div>

          <div style={{ background: `linear-gradient(135deg, ${PRIMARY}, ${PRIMARY_DARK})`, borderRadius: 12, padding: '18px 24px', marginBottom: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ color: 'white' }}>
              <div style={{ fontWeight: 700, fontSize: 15 }}>Get a ZIP-code accurate estimate in {city.name}</div>
              <div style={{ fontSize: 13, opacity: 0.9 }}>Free · No signup · 60 seconds</div>
            </div>
            <a href={url('/')} style={{ background: 'white', color: PRIMARY, padding: '10px 20px', borderRadius: 8, textDecoration: 'none', fontWeight: 700, fontSize: 14, whiteSpace: 'nowrap' }}>
              Calculate Now →
            </a>
          </div>

          <div style={{ background: 'white', borderRadius: 14, border: '1px solid #e2e8f0', padding: '32px 36px', marginBottom: 24 }}>
            <h2 style={{ fontSize: 19, fontWeight: 800, color: '#0f172a', marginBottom: 6 }}>Cost by Service in {city.name}</h2>
            <p style={{ fontSize: 13.5, color: '#64748b', marginBottom: 4 }}>Estimated typical job cost, adjusted for the {city.stateName} market. <a href={url('/how-we-calculate-prices')} style={{ color: PRIMARY, fontWeight: 600 }}>See how we calculate these prices →</a></p>
            <CityServiceTable city={city} />

            <h2 style={{ fontSize: 19, fontWeight: 800, color: '#0f172a', marginTop: 32, marginBottom: 14 }}>FAQs</h2>
            <FaqAccordion faqs={faqs} />
          </div>

          <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: 12, padding: '24px 28px', marginBottom: 32, textAlign: 'center' }}>
            <div style={{ fontWeight: 800, fontSize: 18, color: '#0f172a', marginBottom: 6 }}>Ready to get an accurate estimate?</div>
            <p style={{ fontSize: 14, color: '#64748b', marginBottom: 16 }}>Use our free calculator for a ZIP-code accurate roofing estimate in {city.name} in under 60 seconds.</p>
            <a href={url('/')} style={{ background: PRIMARY, color: 'white', padding: '12px 28px', borderRadius: 9, textDecoration: 'none', fontWeight: 700, fontSize: 15 }}>
              Get My Free Estimate →
            </a>
          </div>

          {otherCitiesInState.length > 0 && (
            <div style={{ marginBottom: 32 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 16 }}>More Cities in {city.stateName}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {otherCitiesInState.map(c => (
                  <a key={c.slug} href={url(`/roof-cost/city/${c.slug}`)} style={{ fontSize: 12.5, color: '#64748b', textDecoration: 'none', background: 'white', border: '1px solid #e2e8f0', borderRadius: 20, padding: '6px 12px' }}>
                    {c.name}
                  </a>
                ))}
                <a href={url(`/roof-cost/${city.stateSlugRef}`)} style={{ fontSize: 12.5, color: PRIMARY, fontWeight: 700, textDecoration: 'none', background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: 20, padding: '6px 12px' }}>
                  All of {city.stateName} →
                </a>
              </div>
            </div>
          )}

          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 16 }}>Popular Cities</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {featuredCities.map(c => (
                <a key={c.slug} href={url(`/roof-cost/city/${c.slug}`)} style={{ fontSize: 12.5, color: '#64748b', textDecoration: 'none', background: 'white', border: '1px solid #e2e8f0', borderRadius: 20, padding: '6px 12px' }}>
                  {c.name}, {c.stateCode}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
