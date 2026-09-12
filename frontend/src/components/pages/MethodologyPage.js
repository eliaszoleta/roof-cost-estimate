import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Database, MapPin, SlidersHorizontal, BookOpen, ShieldCheck, RefreshCw } from 'lucide-react';
import { url } from '../../utils/routes';

const PRIMARY = '#ea580c';

const SECTIONS = [
  {
    Icon: Database,
    title: 'Our Base Pricing',
    body: "Every price tier in our calculator — for shingle, metal, tile, and flat roofing, plus repair, inspection, and gutters — starts from aggregated material and labor cost research across residential roofing contractors nationwide: published rate surveys, manufacturer install guides, and industry cost data. We don't invent a number and work backward; we build each tier from what contractors are actually charging per square foot or per job, then keep it current as material costs and labor rates shift.",
  },
  {
    Icon: MapPin,
    title: 'State Cost-of-Living Adjustments',
    body: "The same shingle roof replacement costs more in California than in Mississippi, and our numbers reflect that. Each state carries a multiplier — California sits around 1.48× the national baseline, Mississippi and West Virginia around 0.80× — built from regional construction labor cost, permit costs, and material freight differences. That multiplier is applied directly to the national base price for whichever service you're pricing, not estimated separately per state.",
  },
  {
    Icon: MapPin,
    title: 'City and ZIP Code Pricing',
    body: "For city-level pages, we intentionally reuse the parent state's pricing data rather than inventing separate city-specific numbers. Reliable, verifiable roofing cost data doesn't exist at neighborhood granularity for most markets — and we'd rather show you a number we can stand behind than a more precise-looking one we made up. If that changes for a given metro area, we'll update it.",
  },
  {
    Icon: SlidersHorizontal,
    title: 'How Roof Size, Pitch, and Complexity Change Your Price',
    body: "Tear-off, decking replacement, pitch, story count, and roof shape complexity are all priced as multipliers or per-sq-ft adders on top of the base material cost, derived from how roofing contractors actually structure their own estimates — for example, a steep 6:12–9:12 pitch consistently adds around 28% to labor cost across the contractors we've reviewed, and a very steep 9:12+ pitch can add up to 50%, since both require harnesses and slower, more careful work.",
  },
  {
    Icon: BookOpen,
    title: 'Where We Reference Outside Sources',
    body: null, // rendered specially below
  },
  {
    Icon: ShieldCheck,
    title: "What Our Estimates Are — and Aren't",
    body: "Every number on RoofingCal is a starting point, not a quote. Actual pricing depends on the specific condition of a roof (rotted decking, extra penetrations, hidden damage), local competition, and each contractor's own pricing — factors that are only ever fully visible from an in-person inspection. Use our numbers to negotiate confidently and spot outliers, then always get multiple quotes from licensed, insured roofing contractors before booking.",
  },
  {
    Icon: RefreshCw,
    title: 'How Often We Update Pricing',
    body: "We review and adjust our pricing models as national and regional material and labor costs change, rather than on a fixed calendar schedule. If you ever see a number that looks out of step with what you're being quoted locally, we want to know — contact us and we'll take a look.",
  },
];

const CITATIONS = [
  { name: 'National Roofing Contractors Association (NRCA)', use: 'Industry installation standards and terminology (pitch categories, tear-off practices) referenced across our roofing cost guides.', href: 'https://www.nrca.net' },
  { name: 'Insurance Institute for Business & Home Safety (IBHS)', use: 'Roofing material durability and storm-resistance guidance referenced in our metal and impact-resistant shingle content.', href: 'https://ibhs.org' },
  { name: 'ENERGY STAR (U.S. EPA / DOE program)', use: 'Reflective/cool-roofing energy-efficiency claims referenced in our metal and TPO roofing content.', href: 'https://www.energystar.gov' },
];

export default function MethodologyPage() {
  const title = 'How We Calculate Roofing Prices | RoofingCal';
  const description = "See exactly how RoofingCal builds its pricing: base rate research, state cost-of-living adjustments, city pricing methodology, and the external sources we cite. Full transparency on where our numbers come from.";

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://roofingcal.com' },
      { '@type': 'ListItem', position: 2, name: 'How We Calculate Prices', item: 'https://roofingcal.com/how-we-calculate-prices' },
    ],
  };

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href="https://roofingcal.com/how-we-calculate-prices" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <script type="application/ld+json">{JSON.stringify(breadcrumb)}</script>
      </Helmet>

      <div style={{ maxWidth: 780, margin: '0 auto', padding: '60px 24px' }}>
        <div style={{ display: 'flex', gap: 6, fontSize: 13, color: '#94a3b8', marginBottom: 20, flexWrap: 'wrap' }}>
          <a href={url('/')} style={{ color: '#64748b', textDecoration: 'none' }}>Home</a><span>&rsaquo;</span>
          <span style={{ color: '#0f172a' }}>How We Calculate Prices</span>
        </div>

        <h1 style={{ fontSize: 40, fontWeight: 900, color: '#0f172a', marginBottom: 12, letterSpacing: '-0.01em' }}>How We Calculate Roofing Prices</h1>
        <p style={{ fontSize: 18, color: '#64748b', marginBottom: 40, lineHeight: 1.7 }}>
          Every estimate on RoofingCal comes from a real methodology, not a guess. Here's exactly how the numbers behind the calculator — and every cost guide on this site — actually get built.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {SECTIONS.map(({ Icon, title: t, body }) => (
            <div key={t} style={{ background: 'white', borderRadius: 16, padding: '26px 28px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(15,23,42,0.03), 0 4px 16px rgba(15,23,42,0.05)', display: 'flex', gap: 18 }}>
              <span style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg,#fff7ed,#fed7aa)', color: '#9a3412', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={22} strokeWidth={2} />
              </span>
              <div style={{ flex: 1 }}>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>{t}</h2>
                {body && <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.7, margin: 0 }}>{body}</p>}
                {t === 'Where We Reference Outside Sources' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 4 }}>
                    <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.7, margin: '0 0 4px' }}>
                      Where our content relies on industry standards, material performance claims, or program guidance rather than our own pricing data, we cite the source directly:
                    </p>
                    {CITATIONS.map(c => (
                      <div key={c.name} style={{ fontSize: 14, color: '#475569', lineHeight: 1.6, paddingLeft: 14, borderLeft: '2px solid #e2e8f0' }}>
                        <a href={c.href} target="_blank" rel="noopener noreferrer" style={{ color: PRIMARY, fontWeight: 700, textDecoration: 'none' }}>{c.name}</a> — {c.use}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 44, background: 'linear-gradient(135deg,#0f172a,#1e293b)', borderRadius: 16, padding: '32px 36px', textAlign: 'center' }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: 'white', marginBottom: 10 }}>See the Methodology in Action</h2>
          <p style={{ color: '#94a3b8', marginBottom: 20, fontSize: 15 }}>Run a real, ZIP-code accurate estimate using the pricing engine described above.</p>
          <a href={url('/roof-cost-calculator')} style={{ background: PRIMARY, color: 'white', padding: '13px 30px', borderRadius: 10, textDecoration: 'none', fontWeight: 700, fontSize: 16, display: 'inline-block' }}>Try the Calculator &rarr;</a>
        </div>
      </div>
    </>
  );
}
