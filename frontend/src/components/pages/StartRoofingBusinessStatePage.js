import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { MapPin, CheckCircle, ChevronDown, DollarSign } from 'lucide-react';
import { getStateBySlug, getAllStates } from '../../data/statePricing';
import { getStateBusinessStartupByCode } from '../../data/stateRoofingBusinessStartup';
import { url } from '../../utils/routes';

const PRIMARY = '#ea580c';
const PRIMARY_DARK = '#c2410c';

function formatPrice(n) {
  return `$${Math.round(n).toLocaleString('en-US')}`;
}

// States with a full, genuinely state-specific deep-dive post (not just this
// templated page) -- see blogPosts.js's 'starting-a-roofing-business'
// category. Linked prominently when one exists for the state being viewed.
const DEEP_POST_BY_CODE = {
  TX: 'how-to-start-a-roofing-business-in-texas',
  FL: 'how-to-start-a-roofing-business-in-florida',
  CO: 'how-to-start-a-roofing-business-in-colorado',
  OK: 'how-to-start-a-roofing-business-in-oklahoma',
  GA: 'how-to-start-a-roofing-business-in-georgia',
  NC: 'how-to-start-a-roofing-business-in-north-carolina',
};

const STEPS = [
  { title: 'Choose a business structure', body: 'Most roofing businesses should form an LLC rather than operate as a sole proprietor, given the liability in roof work.', href: '/blog/llc-vs-sole-proprietorship-roofing-business', linkText: 'LLC vs. sole proprietorship' },
  { title: 'Confirm your licensing requirements', body: 'Contractor licensing for roofing varies by state -- check directly with your state licensing board before you spend on anything else.', href: '/blog/roofing-contractor-license-requirements-by-state', linkText: 'Full licensing overview' },
  { title: 'Get insured and bonded', body: 'General liability insurance and a contractor license bond, before your first paid job.', href: '/blog/roofing-business-insurance-bonding-guide', linkText: 'Insurance & bonding guide' },
  { title: 'Buy your equipment', body: 'Fall protection, tear-off tools, and nailers -- or start lean by subcontracting installs.', href: '/blog/roofing-crew-equipment-checklist', linkText: 'Equipment checklist' },
  { title: 'Price your jobs', body: 'Bid on a true per-square basis that covers overhead and warranty reserve, not just materials and labor.', href: '/blog/how-to-price-roofing-jobs', linkText: 'Pricing guide' },
  { title: 'Get your first customers', body: 'Your network first, then a real web presence with an instant estimate calculator.', href: '/website-for-roofing-companies', linkText: 'Get a roofing website' },
];

const FAQS = (stateName) => [
  { q: `How much does it cost to form an LLC in ${stateName}?`, a: `See the exact filing fee and agency above. The LLC fee is the same regardless of industry -- what varies for a roofing business specifically is contractor licensing cost and insurance, which depend on your state's requirements and your business model.` },
  { q: `Do I need a special contractor license to roof in ${stateName}?`, a: `This genuinely varies by state and isn't something to guess on. Some states require a dedicated roofing or general contractor license, others leave regulation mostly to the city or county, and requirements change over time. Contact your state contractor licensing board directly to confirm what applies in ${stateName} before committing to a business model.` },
  { q: `What's the fastest way to get my first customers in ${stateName}?`, a: `Your personal network almost always provides your first job. From there, a free Google Business Profile, asking every customer for a review, and getting a real website with an instant estimate calculator online are the highest-leverage next steps.` },
  { q: `Should I install myself or subcontract in ${stateName}?`, a: `Many new roofing businesses start by handling sales, inspections, and insurance-claim coordination while subcontracting the physical tear-off and install to a licensed crew -- lower capital requirement, faster to revenue -- and bring installation in-house once they have volume. See our full startup guide for the tradeoffs.` },
];

export default function StartRoofingBusinessStatePage({ slug }) {
  const [openIndex, setOpenIndex] = useState(0);

  const state = getStateBySlug(slug);
  const biz = state ? getStateBusinessStartupByCode(state.code) : null;

  if (!state || !biz) return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12 }}>
      <h2 style={{ color: '#0f172a' }}>State not found</h2>
      <a href={url('/start-a-roofing-business')} style={{ color: PRIMARY, fontWeight: 600 }}>← Back to all states</a>
    </div>
  );

  const otherStates = getAllStates().filter(s => s.slug !== state.slug);
  const faqs = FAQS(state.name);
  const deepPostSlug = DEEP_POST_BY_CODE[state.code];

  const title = `How to Start a Roofing Business in ${state.name} (2026): Costs, LLC Fees & Licensing | RoofingCal`;
  const description = `Everything you need to start a roofing business in ${state.name}: LLC filing fee (${formatPrice(biz.llcFee)}), licensing, insurance, equipment, pricing, and getting your first customers.`;

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://roofingcal.com' },
      { '@type': 'ListItem', position: 2, name: 'Start a Roofing Business', item: 'https://roofingcal.com/start-a-roofing-business' },
      { '@type': 'ListItem', position: 3, name: `Start a Roofing Business in ${state.name}`, item: `https://roofingcal.com/start-a-roofing-business/${state.slug}` },
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
        <link rel="canonical" href={`https://roofingcal.com/start-a-roofing-business/${state.slug}`} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="article" />
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
            <a href={url('/start-a-roofing-business')} style={{ color: '#64748b', textDecoration: 'none' }}>Start a Roofing Business</a>
            <span>›</span>
            <span style={{ color: '#0f172a' }}>{state.name}</span>
          </div>

          <div style={{ background: 'white', borderRadius: 14, border: '1px solid #e2e8f0', padding: '32px 36px', marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <MapPin size={18} color={PRIMARY} />
              <span style={{ fontSize: 12, fontWeight: 700, color: PRIMARY, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{state.name}</span>
            </div>
            <h1 style={{ fontSize: 'clamp(24px,4vw,32px)', fontWeight: 800, color: '#0f172a', lineHeight: 1.25, marginBottom: 10 }}>How to Start a Roofing Business in {state.name}</h1>
            <p style={{ fontSize: 15.5, color: '#64748b', lineHeight: 1.7 }}>
              What it costs to register and insure a roofing business in {state.name}, what to check on licensing, and the full step-by-step checklist to get your first customer.
            </p>
          </div>

          <div style={{ background: 'white', borderRadius: 14, border: '1px solid #e2e8f0', padding: '32px 36px', marginBottom: 24 }}>
            <h2 style={{ fontSize: 19, fontWeight: 800, color: '#0f172a', marginBottom: 16 }}>{state.name} LLC Filing Quick Facts</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14, marginBottom: 16 }}>
              <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: 10, padding: '14px 16px' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: PRIMARY_DARK, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 4 }}>LLC Filing Fee</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: '#0f172a' }}>{formatPrice(biz.llcFee)}</div>
              </div>
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: '14px 16px' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 4 }}>Filing Agency</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', lineHeight: 1.4 }}>{biz.agency}</div>
              </div>
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: '14px 16px' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 4 }}>State Income Tax</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{biz.noIncomeTax ? 'None' : 'Applies'}</div>
              </div>
            </div>
            <p style={{ fontSize: 13.5, color: '#475569', lineHeight: 1.7, margin: 0 }}>{biz.note}</p>
            <p style={{ fontSize: 11.5, color: '#94a3b8', lineHeight: 1.6, marginTop: 12, margin: '12px 0 0' }}>
              Filing fees change periodically — confirm the current fee directly with the {biz.agency} before filing. This is general informational content, not legal, tax, or licensing advice.
            </p>
          </div>

          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 12, padding: '20px 24px', marginBottom: 24 }}>
            <div style={{ fontWeight: 800, fontSize: 15, color: '#0f172a', marginBottom: 6 }}>Contractor licensing is state-specific — don't guess</div>
            <p style={{ fontSize: 13.5, color: '#991b1b', lineHeight: 1.7, margin: 0 }}>
              Unlike the LLC fee above, contractor licensing requirements for roofing vary meaningfully by state and change over time. Before you commit to a business model, contact {state.name}'s contractor licensing board directly to confirm what license type, exam, and bonding your state requires. See our <a href={url('/blog/roofing-contractor-license-requirements-by-state')} style={{ color: '#991b1b', fontWeight: 700 }}>full licensing overview</a> for what to ask and who to contact.
            </p>
          </div>

          {deepPostSlug && (
            <a href={url(`/blog/${deepPostSlug}`)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: 12, padding: '16px 20px', marginBottom: 24, textDecoration: 'none', flexWrap: 'wrap' }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>Read the full {state.name}-specific guide — market size, storm demand, and more →</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: PRIMARY, whiteSpace: 'nowrap' }}>Read guide</span>
            </a>
          )}

          <div style={{ background: `linear-gradient(135deg, ${PRIMARY}, ${PRIMARY_DARK})`, borderRadius: 12, padding: '18px 24px', marginBottom: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ color: 'white' }}>
              <div style={{ fontWeight: 700, fontSize: 15 }}>Get your {state.name} roofing business online</div>
              <div style={{ fontSize: 13, opacity: 0.9 }}>$5 to start · 2 months free · then $249/mo</div>
            </div>
            <a href={url('/website-for-roofing-companies')} style={{ background: 'white', color: PRIMARY, padding: '10px 20px', borderRadius: 8, textDecoration: 'none', fontWeight: 700, fontSize: 14, whiteSpace: 'nowrap' }}>
              Get a Free Website →
            </a>
          </div>

          <div style={{ background: 'white', borderRadius: 14, border: '1px solid #e2e8f0', padding: '32px 36px', marginBottom: 24 }}>
            <h2 style={{ fontSize: 19, fontWeight: 800, color: '#0f172a', marginBottom: 16 }}>Startup Checklist for {state.name}</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {STEPS.map((step, i) => (
                <div key={i} style={{ display: 'flex', gap: 12 }}>
                  <div style={{ flexShrink: 0, marginTop: 1 }}><CheckCircle size={18} color={PRIMARY} /></div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14.5, color: '#0f172a', marginBottom: 2 }}>{i + 1}. {step.title}</div>
                    <div style={{ fontSize: 13.5, color: '#64748b', lineHeight: 1.6 }}>{step.body} <a href={url(step.href)} style={{ color: PRIMARY, fontWeight: 600 }}>{step.linkText} →</a></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: 'white', borderRadius: 14, border: '1px solid #e2e8f0', padding: '32px 36px', marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <DollarSign size={18} color="#16a34a" />
              <h2 style={{ fontSize: 19, fontWeight: 800, color: '#0f172a', margin: 0 }}>The {state.name} Roofing Market</h2>
            </div>
            <p style={{ fontSize: 13.5, color: '#64748b', lineHeight: 1.7 }}>
              A typical full roof replacement in {state.name} runs roughly <strong style={{ color: '#0f172a' }}>{formatPrice(state.low)}–{formatPrice(state.high)}</strong> for a 2,000 sq ft roof — a useful benchmark when you're setting your own bids. See the <a href={url(`/roofing-cost/${state.slug}`)} style={{ color: PRIMARY, fontWeight: 600 }}>full {state.name} pricing breakdown</a>, or our <a href={url('/blog/how-to-price-roofing-jobs')} style={{ color: PRIMARY, fontWeight: 600 }}>complete pricing guide</a> for how to build your own bids from there.
            </p>

            <h2 style={{ fontSize: 19, fontWeight: 800, color: '#0f172a', marginTop: 32, marginBottom: 14 }}>FAQs</h2>
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
          </div>

          <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: 12, padding: '24px 28px', marginBottom: 32, textAlign: 'center' }}>
            <div style={{ fontWeight: 800, fontSize: 18, color: '#0f172a', marginBottom: 6 }}>Not ready to build your own marketing yet?</div>
            <p style={{ fontSize: 14, color: '#64748b', marginBottom: 16 }}>RoofingCal's Partner Program gives one roofing company per city exclusive, guaranteed lead visibility — no website required to start.</p>
            <a href={url('/partner-with-us')} style={{ background: PRIMARY, color: 'white', padding: '12px 28px', borderRadius: 9, textDecoration: 'none', fontWeight: 700, fontSize: 15 }}>
              See If Your City Is Available →
            </a>
          </div>

          <div style={{ marginBottom: 32 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 16 }}>The Full Starting-a-Roofing-Business Guide</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              <a href={url('/blog/how-to-start-a-roofing-business')} style={{ fontSize: 12.5, color: '#64748b', textDecoration: 'none', background: 'white', border: '1px solid #e2e8f0', borderRadius: 20, padding: '6px 12px' }}>Full Startup Guide</a>
              <a href={url('/blog/cost-to-start-a-roofing-business')} style={{ fontSize: 12.5, color: '#64748b', textDecoration: 'none', background: 'white', border: '1px solid #e2e8f0', borderRadius: 20, padding: '6px 12px' }}>Startup Cost Breakdown</a>
              <a href={url('/blog/roofing-crew-equipment-checklist')} style={{ fontSize: 12.5, color: '#64748b', textDecoration: 'none', background: 'white', border: '1px solid #e2e8f0', borderRadius: 20, padding: '6px 12px' }}>Equipment Checklist</a>
              <a href={url('/blog/category/starting-a-roofing-business')} style={{ fontSize: 12.5, color: PRIMARY, fontWeight: 700, textDecoration: 'none', background: 'white', border: '1px solid #fed7aa', borderRadius: 20, padding: '6px 12px' }}>See All Roofing Business Guides →</a>
            </div>
          </div>

          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 16 }}>Start a Roofing Business in Other States</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {otherStates.map(s => (
                <a key={s.code} href={url(`/start-a-roofing-business/${s.slug}`)} style={{ fontSize: 12.5, color: '#64748b', textDecoration: 'none', background: 'white', border: '1px solid #e2e8f0', borderRadius: 20, padding: '6px 12px' }}>
                  {s.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
