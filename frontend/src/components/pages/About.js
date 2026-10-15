import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Ruler, Layers, Mountain, MapPin, Building2 } from 'lucide-react';
import { url } from '../../utils/routes';

const DOMAIN = 'https://roofingcal.com';
const PRIMARY = '#ea580c';

const h2Style = { fontSize: 20, fontWeight: 800, color: '#0f172a', marginBottom: 14, letterSpacing: '-0.01em' };
const pStyle = { fontSize: 14.5, color: '#334155', lineHeight: 1.8, marginBottom: 14 };

export default function About() {
  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh' }}>
      <Helmet>
        <title>About RoofingCal | Free Roofing Cost Estimator for Homeowners</title>
        <meta name="description" content="RoofingCal provides free, instant ZIP-code accurate roofing cost estimates for homeowners across the US. No signup required." />
        <link rel="canonical" href={`${DOMAIN}/about`} />
        <meta property="og:title" content="About RoofingCal | Free Roofing Cost Estimator" />
        <meta property="og:description" content="RoofingCal provides free, instant ZIP-code accurate roofing cost estimates for homeowners across the US. No signup required." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${DOMAIN}/about`} />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'RoofingCal',
          url: DOMAIN,
          description: 'Free roofing cost calculator for US homeowners. ZIP-code accurate estimates for roof replacement, repair, and more.',
          logo: { '@type': 'ImageObject', url: `${DOMAIN}/og-image.svg` },
          contactPoint: { '@type': 'ContactPoint', contactType: 'customer support', email: 'eliaszoleta87@gmail.com', url: `${DOMAIN}/contact` },
          sameAs: [],
        })}</script>
      </Helmet>

      {/* Page Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #1c1917 0%, #7c2d12 55%, #c2410c 100%)',
        padding: '64px 24px 56px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -60, right: -60, width: 280, height: 280, borderRadius: '50%', background: 'rgba(251,146,60,0.14)', filter: 'blur(50px)' }} />
        <div style={{ position: 'absolute', bottom: -50, left: -40, width: 220, height: 220, borderRadius: '50%', background: 'rgba(251,146,60,0.1)', filter: 'blur(50px)' }} />
        <div style={{ position: 'relative', maxWidth: 640, margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(253,186,116,0.14)', border: '1px solid rgba(253,186,116,0.3)', borderRadius: 999, padding: '4px 14px', marginBottom: 20 }}>
            <span style={{ fontSize: 11.5, fontWeight: 700, color: '#fdba74', letterSpacing: '0.08em', textTransform: 'uppercase' }}>About Us</span>
          </div>
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 44px)', fontWeight: 900, color: 'white', lineHeight: 1.15, marginBottom: 16, letterSpacing: '-0.02em' }}>
            About RoofingCal
          </h1>
          <p style={{ fontSize: 17, color: '#fed7aa', lineHeight: 1.7, maxWidth: 520, margin: '0 auto' }}>
            We built the roofing calculator we wished existed — honest, fast, and built from real local pricing data.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '48px 24px 80px' }}>

        {/* Mission */}
        <section style={{ marginBottom: 40 }}>
          <div style={{ background: 'white', borderRadius: 16, padding: '32px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h2 style={h2Style}>Our Mission</h2>
            <p style={pStyle}>
              A new roof is one of the biggest repair bills a homeowner will ever face — yet most people call their first contractor with no idea what a fair price looks like. Quotes for the exact same shingle replacement can swing by thousands of dollars depending on who you call first.
            </p>
            <p style={{ ...pStyle, marginBottom: 0 }}>
              RoofingCal exists to level the playing field. Our free calculator gives you an independent, data-driven estimate <em>before</em> you talk to a single contractor. Armed with that number, you can spot an outlier quote, negotiate with confidence, and make a better decision on one of the biggest investments in your home.
            </p>
          </div>
        </section>

        {/* How it's built */}
        <section style={{ marginBottom: 40 }}>
          <h2 style={{ ...h2Style, paddingLeft: 4 }}>Built on Real Pricing Factors</h2>
          <p style={{ ...pStyle, paddingLeft: 4, marginBottom: 20 }}>Unlike a calculator that spits out one flat national average, every RoofingCal estimate factors in the same variables a contractor actually walks your roof to check:</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
            {[
              { icon: <Ruler size={22} />, title: 'Roof Size & Shape', desc: 'Your base price scales with square footage, and complex shapes with dormers or multiple peaks add labor on top of that.' },
              { icon: <Layers size={22} />, title: 'Material', desc: 'Asphalt shingle is the baseline — metal, tile, and flat/low-slope membranes each price very differently, so every service asks its own scope questions.' },
              { icon: <Mountain size={22} />, title: 'Pitch & Tear-Off', desc: 'Steep roofs need harnesses and take longer. Removing existing layers, and any rotted decking underneath, adds its own line item.' },
              { icon: <MapPin size={22} />, title: 'ZIP-Code Location', desc: 'State labor rates and cost of living adjust your price — we don\'t show the same number to a homeowner in Ohio and one in California.' },
            ].map(item => (
              <div key={item.title} style={{ background: 'white', borderRadius: 14, padding: '22px 20px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: '#fff7ed', color: PRIMARY, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                  {item.icon}
                </div>
                <h3 style={{ fontSize: 14.5, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>{item.title}</h3>
                <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.65, margin: 0 }}>{item.desc}</p>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 13.5, color: '#94a3b8', marginTop: 18, paddingLeft: 4 }}>
            See the full breakdown on our <a href={url('/how-we-calculate-prices')} style={{ color: PRIMARY, fontWeight: 600 }}>pricing methodology page</a>.
          </p>
        </section>

        {/* Accuracy note */}
        <section style={{ marginBottom: 40 }}>
          <div style={{ background: '#fff7ed', borderRadius: 16, padding: '28px 32px', border: '1px solid #fed7aa' }}>
            <h2 style={{ ...h2Style, marginTop: 0 }}>A Note on Accuracy</h2>
            <p style={pStyle}>
              Our estimates are designed to set realistic expectations, not replace an on-site inspection. They give you a real range to walk into a contractor conversation with — enough to know whether a quote is in the right ballpark and to ask informed questions about what's driving the price.
            </p>
            <p style={{ ...pStyle, marginBottom: 0 }}>
              For a final, binding price, you'll always need an on-site visit from a licensed roofing contractor who can assess your roof's actual condition, decking, and any hidden damage. Our goal isn't to replace that — it's to make sure you go into it informed.
            </p>
          </div>
        </section>

        {/* For contractors */}
        <section style={{ marginBottom: 40 }}>
          <div style={{ background: 'white', borderRadius: 16, padding: '28px 32px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: '#fff7ed', color: PRIMARY, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Building2 size={18} />
              </div>
              <h2 style={{ ...h2Style, margin: 0 }}>Also Built for Roofing Contractors</h2>
            </div>
            <p style={pStyle}>
              In addition to the free public calculator, RoofingCal offers an internal pricing tool contractors use to run unlimited estimates on their own screen, plus a white-label embeddable calculator widget for their own website — included in the same plan, at no extra cost.
            </p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <a href={url('/for-companies')} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 20px', background: PRIMARY, color: 'white', borderRadius: 8, fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>
                See the Internal Estimator
              </a>
              <a href={url('/partner-with-us')} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 20px', background: 'white', color: PRIMARY, border: `1.5px solid ${PRIMARY}`, borderRadius: 8, fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>
                Partner Program
              </a>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section style={{
          background: 'linear-gradient(135deg, #1c1917, #7c2d12)',
          borderRadius: 20,
          padding: '40px 32px',
          textAlign: 'center',
        }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: 'white', marginBottom: 10, letterSpacing: '-0.01em' }}>Questions or Feedback?</h2>
          <p style={{ color: '#fed7aa', marginBottom: 24, fontSize: 15, lineHeight: 1.6 }}>We're a small team and we read every message.</p>
          <a
            href={url('/contact')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '12px 28px',
              background: 'white',
              color: '#0f172a',
              borderRadius: 10,
              fontWeight: 700,
              fontSize: 15,
              textDecoration: 'none',
            }}
          >
            Contact Us
          </a>
        </section>

      </div>
    </div>
  );
}
