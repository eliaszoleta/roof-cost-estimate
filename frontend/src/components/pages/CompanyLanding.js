import React from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '../ui/Header';
import Footer from '../ui/Footer';

const FEATURES = [
  { emoji: '📊', title: 'Instant estimates', desc: 'Homeowners get a detailed, ZIP-adjusted estimate in under 2 minutes — before they even call you.' },
  { emoji: '🏷️', title: 'Your brand, your colors', desc: 'Embed the calculator on your website with your logo, phone number, and CTA button.' },
  { emoji: '📱', title: 'Lead capture built in', desc: 'Collect name, email, phone, and project timeline from every homeowner who gets an estimate.' },
  { emoji: '📅', title: 'Lead dashboard', desc: 'Track every lead, update statuses, and follow up — all in one place. (Coming soon)' },
];

export default function CompanyLanding() {
  return (
    <>
      <Helmet>
        <title>For Roofing Contractors | RoofCalc</title>
        <meta name="description" content="Embed a branded roofing cost estimator on your website. Capture qualified leads automatically." />
      </Helmet>
      <div style={{ background: 'white' }}>
        <Header />
        <main>
          {/* Hero */}
          <div style={{ background: 'linear-gradient(135deg, #fff7ed 0%, #f8fafc 100%)', padding: '72px 24px 64px', textAlign: 'center' }}>
            <div style={{ display: 'inline-block', background: '#ffedd5', color: '#9a3412', padding: '6px 16px', borderRadius: 20, fontSize: 13, fontWeight: 600, marginBottom: 20 }}>
              For Roofing Contractors
            </div>
            <h1 style={{ fontSize: 'clamp(30px, 5vw, 52px)', fontWeight: 800, color: '#0f172a', lineHeight: 1.1, marginBottom: 20, maxWidth: 700, margin: '0 auto 20px' }}>
              Turn Your Website Into a<br /><span style={{ color: '#ea580c' }}>Lead Generation Machine</span>
            </h1>
            <p style={{ fontSize: 18, color: '#64748b', maxWidth: 560, margin: '0 auto 36px', lineHeight: 1.7 }}>
              Embed a branded roofing cost estimator on your site. Homeowners get instant answers — you get qualified, pre-educated leads.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="/company" style={{ background: '#ea580c', color: 'white', padding: '14px 28px', borderRadius: 10, textDecoration: 'none', fontWeight: 700, fontSize: 15 }}>
                Get Started Free →
              </a>
              <a href="/" style={{ background: 'white', color: '#0f172a', padding: '14px 28px', borderRadius: 10, textDecoration: 'none', fontWeight: 600, fontSize: 15, border: '1.5px solid #e2e8f0' }}>
                Try the Calculator
              </a>
            </div>
          </div>

          {/* Features */}
          <div style={{ maxWidth: 960, margin: '0 auto', padding: '64px 24px' }}>
            <h2 style={{ textAlign: 'center', fontSize: 28, fontWeight: 800, color: '#0f172a', marginBottom: 48 }}>Everything you need to capture roofing leads</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24 }}>
              {FEATURES.map(({ emoji, title, desc }) => (
                <div key={title} style={{ background: '#f8fafc', borderRadius: 12, padding: '24px 20px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: 28, marginBottom: 12 }}>{emoji}</div>
                  <div style={{ fontWeight: 700, fontSize: 16, color: '#0f172a', marginBottom: 8 }}>{title}</div>
                  <p style={{ fontSize: 13.5, color: '#64748b', lineHeight: 1.7, margin: 0 }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing */}
          <div style={{ background: '#0f172a', padding: '64px 24px', textAlign: 'center' }}>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: 'white', marginBottom: 8 }}>Simple pricing</h2>
            <p style={{ color: '#94a3b8', fontSize: 16, marginBottom: 40 }}>One plan. No contracts. Cancel anytime.</p>
            <div style={{ maxWidth: 380, margin: '0 auto', background: '#1e293b', borderRadius: 16, padding: '36px 32px', border: '1px solid #334155' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#ea580c', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Pro Plan</div>
              <div style={{ fontSize: 48, fontWeight: 800, color: 'white', lineHeight: 1 }}>$49<span style={{ fontSize: 18, fontWeight: 500, color: '#94a3b8' }}>/mo</span></div>
              <div style={{ color: '#64748b', fontSize: 13, marginTop: 4, marginBottom: 28 }}>Billed monthly. No setup fee.</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px', textAlign: 'left' }}>
                {['Embeddable calculator','Custom branding & colors','Lead capture & notifications','Unlimited estimates','Priority support'].map(f => (
                  <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#e2e8f0', fontSize: 14, marginBottom: 12 }}>
                    <span style={{ color: '#ea580c', fontWeight: 700 }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <a href="/company" style={{ display: 'block', background: '#ea580c', color: 'white', padding: '13px', borderRadius: 10, textDecoration: 'none', fontWeight: 700, fontSize: 15 }}>
                Start Free Trial →
              </a>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
