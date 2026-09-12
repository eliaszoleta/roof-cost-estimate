import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { ChevronDown, BarChart3, ListChecks, Lock, Repeat } from 'lucide-react';
import RoofingCalculator from '../calculator/RoofingCalculator';
import { url } from '../../utils/routes';
import './PageHero.css';

const PRIMARY = '#ea580c';

const WHY_POINTS = [
  { Icon: BarChart3, title: 'Real Market Pricing', body: 'This roof cost estimator pulls from actual material and labor pricing data, not a generic industry average.' },
  { Icon: ListChecks, title: 'Covers Every Roof Type', body: 'Estimate shingle, metal, tile, and flat roof replacement, plus repair, inspection, and gutter installation.' },
  { Icon: Repeat, title: 'No Waiting on Quotes', body: "Skip the back-and-forth with roofing contractors — get your price estimate the moment you finish answering a few questions." },
  { Icon: Lock, title: 'Always Free', body: "There's no cost to use this estimator, no account required, and no limit on how many times you can run it." },
];

const ESTIMATOR_FAQS = [
  { q: 'What is a roof cost estimator?', a: 'A roof cost estimator is a tool that calculates an expected price range for roofing work based on inputs like your location, roof size, pitch, and material — instead of requiring an in-person quote.' },
  { q: 'How is a roof cost estimator different from a fixed price?', a: 'An estimator gives you a realistic price range based on typical material and labor rates in your area. The exact price a roofing contractor charges can vary based on the specific condition of your roof, decking, and their own pricing.' },
  { q: 'Can I use this roof cost estimator for a repair instead of a full replacement?', a: 'Yes — select Roof Repair as your service type and describe the damage size to get an estimate, or select Roof Inspection if you just need an assessment.' },
  { q: 'Is my information saved when I use the estimator?', a: "No. Your estimate is calculated instantly and isn't stored unless you choose to submit your contact information at the end." },
  { q: 'How often should I re-check my roof cost estimate?', a: "Material and labor prices can shift year to year, so it's worth re-running your estimate before budgeting for a project, especially if your last estimate is more than a few months old." },
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

export default function EstimatorPage() {
  const [showingResults, setShowingResults] = useState(false);

  const title = 'Roof Cost Estimator - Free Instant Estimate (2026)';
  const description = 'Free roof cost estimator with ZIP-code accurate pricing. Instantly estimate shingle, metal, tile, and flat roof replacement, repair, inspection, and gutters. No signup required.';

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://roofingcal.com' },
      { '@type': 'ListItem', position: 2, name: 'Roof Cost Estimator', item: 'https://roofingcal.com/roof-cost-estimator' },
    ],
  };
  const webAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Roof Cost Estimator',
    url: 'https://roofingcal.com/roof-cost-estimator',
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    description,
  };
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: ESTIMATOR_FAQS.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href="https://roofingcal.com/roof-cost-estimator" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <script type="application/ld+json">{JSON.stringify(webAppSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumb)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <div className="page-hero-wrap">
        <div className="page-hero-breadcrumb">
          <a href={url('/')} style={{ color: '#64748b', textDecoration: 'none' }}>Home</a><span>&rsaquo;</span>
          <span style={{ color: '#0f172a' }}>Roof Cost Estimator</span>
        </div>

        <div className="page-hero-block">
          <h1 className="page-hero-title">Roof Cost Estimator</h1>
          <p className="page-hero-subtitle">
            Get a free roof cost estimator for shingle, metal, tile, and flat roof replacement, plus repair, inspection, and gutters — enter your ZIP code and roof details to see a real price range in under a minute. This standalone estimator works the same whether you're comparing contractor quotes or budgeting ahead, with no signup and no obligation.
          </p>
        </div>

        <div style={showingResults ? undefined : { maxWidth: 720, margin: '0 auto', background: 'white', borderRadius: 16, boxShadow: '0 8px 40px rgba(0,0,0,0.10)', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <RoofingCalculator embedded siteLanding onShowResults={setShowingResults} />
        </div>

        <div style={{ marginTop: 48 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', marginBottom: 20, textAlign: 'center' }}>Why Use This Roof Cost Estimator</h2>
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
          <h2 style={{ fontSize: 19, fontWeight: 800, color: '#0f172a', marginBottom: 16 }}>Roof Cost Estimator FAQs</h2>
          <FaqAccordion faqs={ESTIMATOR_FAQS} />
        </div>

        <div style={{ marginTop: 40, textAlign: 'center' }}>
          <p style={{ fontSize: 14, color: '#64748b', marginBottom: 14 }}>Want cost breakdowns by state or service instead? Browse our <a href={url('/blog')} style={{ color: PRIMARY, fontWeight: 600 }}>roofing cost guides</a>.</p>
        </div>
      </div>
    </>
  );
}
