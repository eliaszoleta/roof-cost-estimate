import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { ChevronDown, Zap, MapPin, ShieldCheck, Gift } from 'lucide-react';
import RoofingCalculator from '../calculator/RoofingCalculator';
import { url } from '../../utils/routes';
import './PageHero.css';

const PRIMARY = '#ea580c';

const WHY_POINTS = [
  { Icon: MapPin, title: 'ZIP-Code Accurate', body: 'Every price this roof cost calculator returns is adjusted for your local labor rates and cost of living, not a flat national guess.' },
  { Icon: Zap, title: 'Instant Results', body: 'Answer a few quick questions about your roof and get your estimate in under 60 seconds — no waiting for a callback from a contractor.' },
  { Icon: ShieldCheck, title: '7 Service Types Covered', body: 'From full shingle replacement to metal, tile, flat roofing, repair, inspection, and gutters, this calculator covers the full range of roofing work.' },
  { Icon: Gift, title: '100% Free, No Signup', body: 'Use the roof cost calculator as many times as you want. No account, no credit card, and no obligation to hire anyone.' },
];

const CALCULATOR_FAQS = [
  { q: 'Is this roof cost calculator really free?', a: 'Yes. Our roof cost calculator is completely free to use, with no signup, no account, and no hidden fees. You can run as many estimates as you need.' },
  { q: 'How accurate is the roof cost calculator?', a: 'The calculator uses real material and labor pricing data with state-by-state cost-of-living adjustments, so your estimate reflects typical local pricing. Final prices from an actual roofing contractor can vary based on the specific condition of your roof and other in-person factors, so treat the result as a reliable starting range rather than a binding quote.' },
  { q: 'What information do I need to use the roof cost calculator?', a: 'Just your ZIP code, the type of roofing work you need, and a few basic details about your roof (like square footage, pitch, and story count). No email or phone number is required to see your price range.' },
  { q: 'Does the roof cost calculator work for repairs and inspections too?', a: 'Yes. In addition to full roof replacement (shingle, metal, tile, and flat), the calculator includes roof repair, roof inspection, and gutter installation.' },
  { q: 'Can I embed this roof cost calculator on my own website?', a: "Yes — roofing companies can embed a white-labeled version of this calculator on their own site to capture leads with accurate, localized estimates. Visit our for-companies page for details." },
];

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

export default function CalculatorPage() {
  const [showingResults, setShowingResults] = useState(false);

  const title = 'Roof Cost Calculator - Free Instant Estimate (2026)';
  const description = 'Free roof cost calculator with ZIP-code accurate pricing. Instantly estimate shingle, metal, tile, and flat roof replacement, repair, inspection, and gutters. No signup required.';

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://roofingcal.com' },
      { '@type': 'ListItem', position: 2, name: 'Roof Cost Calculator', item: 'https://roofingcal.com/roof-cost-calculator' },
    ],
  };
  const webAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Roof Cost Calculator',
    url: 'https://roofingcal.com/roof-cost-calculator',
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    description,
  };
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: CALCULATOR_FAQS.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href="https://roofingcal.com/roof-cost-calculator" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <script type="application/ld+json">{JSON.stringify(webAppSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumb)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <div className="page-hero-wrap">
        <div className="page-hero-breadcrumb">
          <a href={url('/')} style={{ color: '#64748b', textDecoration: 'none' }}>Home</a><span>&rsaquo;</span>
          <span style={{ color: '#0f172a' }}>Roof Cost Calculator</span>
        </div>

        <div className="page-hero-block">
          <h1 className="page-hero-title">Roof Cost Calculator</h1>
          <p className="page-hero-subtitle">
            This free roof cost calculator gives you an instant, ZIP-code specific price for shingle, metal, tile, and flat roof replacement, plus repair, inspection, and gutters. Built as a standalone roofing calculator you can bookmark and reuse — no signup, no phone calls, just enter your details and get a real price range in under 60 seconds.
          </p>
        </div>

        <div style={showingResults ? undefined : { maxWidth: 720, margin: '0 auto', background: 'white', borderRadius: 16, boxShadow: '0 8px 40px rgba(0,0,0,0.10)', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <RoofingCalculator embedded siteLanding onShowResults={setShowingResults} />
        </div>

        <div style={{ marginTop: 48 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', marginBottom: 20, textAlign: 'center' }}>Why Use This Roof Cost Calculator</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
            {WHY_POINTS.map(({ Icon, title: t, body }) => (
              <div key={t} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 14, padding: '22px 24px' }}>
                <span style={{ width: 38, height: 38, borderRadius: 10, background: '#fff7ed', color: PRIMARY, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                  <Icon size={19} strokeWidth={2.1} />
                </span>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>{t}</h3>
                <p style={{ fontSize: 13.5, color: '#475569', lineHeight: 1.6, margin: 0 }}>{body}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 48, background: 'white', border: '1px solid #e2e8f0', borderRadius: 16, padding: '32px 36px' }}>
          <h2 style={{ fontSize: 19, fontWeight: 800, color: '#0f172a', marginBottom: 16 }}>Roof Cost Calculator FAQs</h2>
          <FaqAccordion faqs={CALCULATOR_FAQS} />
        </div>

        <div style={{ marginTop: 40, textAlign: 'center' }}>
          <p style={{ fontSize: 14, color: '#64748b', marginBottom: 14 }}>Want cost breakdowns by state or service instead? Browse our <a href={url('/blog')} style={{ color: PRIMARY, fontWeight: 600 }}>roofing cost guides</a>.</p>
        </div>
      </div>
    </>
  );
}
