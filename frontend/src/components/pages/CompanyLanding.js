import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  BarChart3, Palette, Users, LayoutDashboard,
  Check, ChevronDown, ChevronUp, Zap, Shield, Star,
  ArrowRight, Code2, Bell, Clock, TrendingUp,
} from 'lucide-react';
import Header from '../ui/Header';
import Footer from '../ui/Footer';
import { url } from '../../utils/routes';

const FEATURES = [
  {
    Icon: Zap,
    title: 'Instant ZIP-Accurate Estimates',
    desc: 'Homeowners get a detailed, market-adjusted estimate in under 2 minutes — before they ever call you.',
  },
  {
    Icon: Palette,
    title: 'Fully Branded Experience',
    desc: 'Your logo, your colors, your phone number, your CTA. Looks like it was built in-house.',
  },
  {
    Icon: Users,
    title: 'Built-In Lead Capture',
    desc: 'Collect name, email, phone, and project timeline from every homeowner who gets an estimate.',
  },
  {
    Icon: LayoutDashboard,
    title: 'Lead Management Dashboard',
    desc: 'Track every lead, update statuses, and follow up — all from one clean dashboard.',
  },
  {
    Icon: Bell,
    title: 'Instant Notifications',
    desc: 'Get an email the moment a new lead completes an estimate, with full project details.',
  },
  {
    Icon: Code2,
    title: 'One-Line Embed',
    desc: 'Paste a single script tag on any website or landing page. No developer required.',
  },
];

const STEPS = [
  { n: '01', title: 'Sign up in minutes', desc: 'Create your account and customize your branding — colors, logo, phone number, and CTA button.' },
  { n: '02', title: 'Embed on your website', desc: 'Copy one line of code and paste it anywhere on your site. Works with any website builder.' },
  { n: '03', title: 'Receive qualified leads', desc: 'Every homeowner who completes an estimate becomes a lead in your dashboard — pre-educated and ready to buy.' },
];

const PLAN_FEATURES = [
  'Embeddable estimator widget',
  'Custom branding & colors',
  'Your logo & contact info on results',
  'Lead capture (name, email, phone)',
  'Lead management dashboard',
  'Instant email notifications',
  'Unlimited estimates',
  'Priority support',
];

const FAQS = [
  {
    q: 'How does the embed work?',
    a: 'You get a single script tag to paste into your website\'s HTML. The calculator loads inside your page — no iframes, no redirects. Works with WordPress, Wix, Squarespace, Webflow, and any custom site.',
  },
  {
    q: 'How accurate are the estimates?',
    a: 'Estimates are ZIP-code adjusted using real regional labor and material data. They\'re designed to set realistic expectations — homeowners arrive at your call already knowing the ballpark.',
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Yes. No long-term contracts. Cancel from your dashboard at any time and you\'ll retain access through the end of your billing period.',
  },
  {
    q: 'Do I need a developer to install it?',
    a: 'No. If you can paste text into your website editor, you can install it. Most contractors are up and running in under 10 minutes.',
  },
  {
    q: 'What does "custom branding" include?',
    a: 'You can set your company name, logo URL, primary brand color, phone number, CTA button text, and CTA button link. The calculator and results screen reflect your brand throughout.',
  },
];

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      style={{ borderBottom: '1px solid #e2e8f0', cursor: 'pointer' }}
      onClick={() => setOpen(o => !o)}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 0', gap: 16 }}>
        <span style={{ fontWeight: 600, fontSize: 15, color: '#0f172a' }}>{q}</span>
        {open
          ? <ChevronUp size={18} color="#94a3b8" style={{ flexShrink: 0 }} />
          : <ChevronDown size={18} color="#94a3b8" style={{ flexShrink: 0 }} />
        }
      </div>
      {open && (
        <p style={{ fontSize: 14.5, color: '#64748b', lineHeight: 1.75, margin: '0 0 18px', paddingRight: 32 }}>{a}</p>
      )}
    </div>
  );
}

export default function CompanyLanding() {
  return (
    <>
      <Helmet>
        <title>Roofing Estimator for Contractors — Capture More Leads | RoofCalc</title>
        <meta name="description" content="Embed a branded roofing cost estimator on your website. Capture qualified leads automatically. $149/mo. No setup fee." />
        <link rel="canonical" href="https://eliaszoleta.github.io/roof-cost-estimate/for-companies" />
      </Helmet>

      <div style={{ background: 'white' }}>
        <Header />
        <main>

          {/* ── Hero ── */}
          <div style={{
            background: 'linear-gradient(160deg, #0f172a 0%, #1e293b 60%, #0f172a 100%)',
            padding: '88px 24px 80px',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* subtle grid overlay */}
            <div style={{
              position: 'absolute', inset: 0, opacity: 0.04,
              backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
              backgroundSize: '48px 48px',
              pointerEvents: 'none',
            }} />

            <div style={{ position: 'relative', maxWidth: 760, margin: '0 auto' }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 7,
                background: 'rgba(234,88,12,0.15)', border: '1px solid rgba(234,88,12,0.35)',
                color: '#fb923c', padding: '6px 14px', borderRadius: 20, fontSize: 12.5, fontWeight: 600,
                marginBottom: 28, letterSpacing: '0.03em',
              }}>
                <Star size={12} fill="#fb923c" color="#fb923c" /> For Roofing Contractors
              </div>

              <h1 style={{
                fontSize: 'clamp(32px, 5.5vw, 58px)', fontWeight: 800, color: 'white',
                lineHeight: 1.08, marginBottom: 22, letterSpacing: '-1.5px',
              }}>
                Turn Your Website Into a<br />
                <span style={{ color: '#fb923c' }}>Lead Generation Machine</span>
              </h1>

              <p style={{ fontSize: 'clamp(16px,2vw,19px)', color: '#94a3b8', maxWidth: 560, margin: '0 auto 40px', lineHeight: 1.7 }}>
                Embed a branded roofing estimator on your site. Homeowners get instant answers — you get qualified, pre-educated leads on autopilot.
              </p>

              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                <a href={url('/company')}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#ea580c', color: 'white', padding: '14px 28px', borderRadius: 10, textDecoration: 'none', fontWeight: 700, fontSize: 15, boxShadow: '0 4px 20px rgba(234,88,12,0.40)' }}
                >
                  Get Started — $149/mo <ArrowRight size={16} />
                </a>
                <a href={url('/')}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.07)', color: '#e2e8f0', padding: '14px 28px', borderRadius: 10, textDecoration: 'none', fontWeight: 600, fontSize: 15, border: '1px solid rgba(255,255,255,0.12)' }}
                >
                  Try the Calculator
                </a>
              </div>

              {/* Social proof bar */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: 32, marginTop: 52, flexWrap: 'wrap' }}>
                {[
                  ['500+', 'Contractors'],
                  ['50,000+', 'Estimates delivered'],
                  ['4.9★', 'Average rating'],
                ].map(([num, label]) => (
                  <div key={label} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 22, fontWeight: 800, color: 'white' }}>{num}</div>
                    <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── How It Works ── */}
          <div style={{ padding: '80px 24px 72px', background: '#f8fafc' }}>
            <div style={{ maxWidth: 960, margin: '0 auto' }}>
              <div style={{ textAlign: 'center', marginBottom: 56 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#ea580c', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Simple Setup</div>
                <h2 style={{ fontSize: 'clamp(24px,3.5vw,36px)', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>Up and running in 10 minutes</h2>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
                {STEPS.map(({ n, title, desc }) => (
                  <div key={n} style={{ background: 'white', borderRadius: 16, padding: '32px 28px', border: '1px solid #e2e8f0', position: 'relative' }}>
                    <div style={{
                      fontSize: 11, fontWeight: 800, color: '#ea580c', letterSpacing: '0.1em',
                      background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: 8,
                      padding: '4px 10px', display: 'inline-block', marginBottom: 18,
                    }}>{n}</div>
                    <h3 style={{ fontSize: 17, fontWeight: 700, color: '#0f172a', marginBottom: 10 }}>{title}</h3>
                    <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.7, margin: 0 }}>{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Features ── */}
          <div style={{ padding: '80px 24px', background: 'white' }}>
            <div style={{ maxWidth: 1040, margin: '0 auto' }}>
              <div style={{ textAlign: 'center', marginBottom: 56 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#ea580c', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Features</div>
                <h2 style={{ fontSize: 'clamp(24px,3.5vw,36px)', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>Everything you need to capture roofing leads</h2>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
                {FEATURES.map(({ Icon, title, desc }) => (
                  <div key={title} style={{ borderRadius: 14, padding: '26px 24px', border: '1.5px solid #e2e8f0', display: 'flex', gap: 18, alignItems: 'flex-start', transition: 'border-color 0.15s, box-shadow 0.15s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#fbd9c1'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.06)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.boxShadow = 'none'; }}
                  >
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: '#fff7ed', border: '1.5px solid #fed7aa', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={20} color="#ea580c" strokeWidth={1.75} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 15.5, color: '#0f172a', marginBottom: 6 }}>{title}</div>
                      <p style={{ fontSize: 13.5, color: '#64748b', lineHeight: 1.7, margin: 0 }}>{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Pricing ── */}
          <div style={{ background: 'linear-gradient(160deg, #0f172a, #1e293b)', padding: '80px 24px' }}>
            <div style={{ maxWidth: 960, margin: '0 auto', textAlign: 'center' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#fb923c', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Pricing</div>
              <h2 style={{ fontSize: 'clamp(24px,3.5vw,36px)', fontWeight: 800, color: 'white', marginBottom: 10, letterSpacing: '-0.5px' }}>Simple, transparent pricing</h2>
              <p style={{ color: '#64748b', fontSize: 16, marginBottom: 48 }}>One plan. Everything included. No contracts, cancel anytime.</p>

              <div style={{ maxWidth: 440, margin: '0 auto', background: '#1e293b', borderRadius: 20, padding: '44px 40px', border: '1.5px solid #334155', boxShadow: '0 0 0 1px rgba(234,88,12,0.1), 0 24px 80px rgba(0,0,0,0.3)', position: 'relative', overflow: 'hidden' }}>
                {/* glow */}
                <div style={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, background: 'radial-gradient(circle, rgba(234,88,12,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />

                <div style={{ fontSize: 12, fontWeight: 700, color: '#fb923c', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 18 }}>Pro Plan</div>

                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 4, marginBottom: 6 }}>
                  <span style={{ fontSize: 18, fontWeight: 700, color: '#94a3b8', alignSelf: 'flex-start', marginTop: 10 }}>$</span>
                  <span style={{ fontSize: 64, fontWeight: 800, color: 'white', lineHeight: 1, letterSpacing: '-2px' }}>149</span>
                  <span style={{ fontSize: 16, color: '#64748b', marginBottom: 8 }}>/mo</span>
                </div>
                <div style={{ color: '#64748b', fontSize: 13, marginBottom: 32 }}>No setup fee. No contracts.</div>

                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px', textAlign: 'left' }}>
                  {PLAN_FEATURES.map(f => (
                    <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#e2e8f0', fontSize: 14.5, marginBottom: 13 }}>
                      <div style={{ width: 20, height: 20, borderRadius: 6, background: 'rgba(234,88,12,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Check size={12} color="#fb923c" strokeWidth={3} />
                      </div>
                      {f}
                    </li>
                  ))}
                </ul>

                <a href={url('/company')} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  background: '#ea580c', color: 'white', padding: '14px 20px', borderRadius: 10,
                  textDecoration: 'none', fontWeight: 700, fontSize: 15,
                  boxShadow: '0 4px 20px rgba(234,88,12,0.35)',
                }}>
                  Get Started Now <ArrowRight size={16} />
                </a>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 16 }}>
                  <Shield size={13} color="#64748b" />
                  <span style={{ fontSize: 12.5, color: '#64748b' }}>14-day free trial · Cancel anytime</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Trust Strip ── */}
          <div style={{ background: '#f8fafc', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', padding: '32px 24px' }}>
            <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', justifyContent: 'center', gap: 40, flexWrap: 'wrap' }}>
              {[
                [Shield, 'No contracts'],
                [Clock, '14-day free trial'],
                [TrendingUp, 'Unlimited estimates'],
                [Zap, 'Up in 10 minutes'],
              ].map(([Icon, label]) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Icon size={16} color="#ea580c" strokeWidth={2} />
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#374151' }}>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── FAQ ── */}
          <div style={{ padding: '80px 24px', background: 'white' }}>
            <div style={{ maxWidth: 680, margin: '0 auto' }}>
              <div style={{ textAlign: 'center', marginBottom: 48 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#ea580c', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>FAQ</div>
                <h2 style={{ fontSize: 'clamp(22px,3vw,32px)', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>Common questions</h2>
              </div>
              <div style={{ border: '1px solid #e2e8f0', borderBottom: 'none', borderRadius: 14, overflow: 'hidden', padding: '0 28px' }}>
                {FAQS.map((faq, i) => <FaqItem key={i} {...faq} />)}
              </div>
            </div>
          </div>

          {/* ── Final CTA ── */}
          <div style={{ background: '#fff7ed', borderTop: '1px solid #fed7aa', padding: '72px 24px', textAlign: 'center' }}>
            <div style={{ maxWidth: 600, margin: '0 auto' }}>
              <h2 style={{ fontSize: 'clamp(24px,4vw,38px)', fontWeight: 800, color: '#0f172a', marginBottom: 14, letterSpacing: '-0.5px' }}>
                Ready to generate more roofing leads?
              </h2>
              <p style={{ fontSize: 16, color: '#64748b', marginBottom: 32, lineHeight: 1.7 }}>
                Join 500+ roofing contractors who use RoofCalc to turn website visitors into booked jobs.
              </p>
              <a href={url('/company')} style={{
                display: 'inline-flex', alignItems: 'center', gap: 8, background: '#ea580c',
                color: 'white', padding: '15px 32px', borderRadius: 10, textDecoration: 'none',
                fontWeight: 700, fontSize: 16, boxShadow: '0 4px 20px rgba(234,88,12,0.30)',
              }}>
                Start Your Free Trial <ArrowRight size={17} />
              </a>
              <div style={{ marginTop: 14, fontSize: 13, color: '#94a3b8' }}>14-day free trial · $149/mo after · No credit card required</div>
            </div>
          </div>

        </main>
        <Footer />
      </div>
    </>
  );
}
