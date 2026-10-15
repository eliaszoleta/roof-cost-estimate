import React from 'react';
import { Helmet } from 'react-helmet-async';
import {
  ClipboardList, MapPin, Settings, Check, Star,
  Quote, ShieldCheck, Zap, ArrowRight, Rocket, Sparkles, Tag,
  Building2, TrendingDown, Filter, Mail, Code2, Lock,
} from 'lucide-react';
import Header from '../ui/Header';
import Footer from '../ui/Footer';
import { url } from '../../utils/routes';

const PRIMARY = '#ea580c';

// One plan, one accurate pricing engine -- used internally by default, with
// a calculator widget for the contractor's website included for anyone who
// also wants public lead capture. Mirrors the "why go internal" pivot
// cleanestimator and solarcostpredictor made on their own sales pages.
const FEATURES = [
  { Icon: Zap,           color: '#7c3aed', bg: '#f5f3ff', title: 'Unlimited internal calculations', desc: 'Run as many estimates as you need, every month, with no per-quote cost.' },
  { Icon: Lock,          color: PRIMARY,   bg: '#fff7ed', title: 'Instant result, nothing public',  desc: "See the number immediately on your own screen — it's never shown to a homeowner unless you decide to share it." },
  { Icon: MapPin,        color: '#059669', bg: '#ecfdf5', title: 'ZIP-code accurate pricing',       desc: 'State labor rates and cost-of-living adjustments ensure your quotes reflect your local market, not a national average.' },
  { Icon: Settings,      color: '#d97706', bg: '#fffbeb', title: 'Per-service markup control',      desc: 'Location-accurate base price plus optional per-service markup so every estimate matches your real cost and margin.' },
  { Icon: ClipboardList, color: '#2563eb', bg: '#eff6ff', title: 'All 7 service calculators',        desc: 'Shingle replacement, metal, tile, flat/TPO, repair, inspection, and gutters — each with its own scope questions.' },
  { Icon: Code2,         color: '#0891b2', bg: '#ecfeff', title: 'Calculator widget for your website', desc: 'Want public lead capture too? The same plan includes an embeddable, branded calculator widget for your site — no upgrade required.' },
];

// Why we don't pitch a public price-range widget as the default: showing a
// homeowner a minimum price before they've even talked to you invites
// exactly the lowballing a roofing contractor doesn't want.
const PROBLEMS = [
  { Icon: TrendingDown, color: '#dc2626', bg: '#fef2f2', title: 'Homeowners shop the low end', desc: 'Show someone "$7,400–$10,900" and they\'ll anchor on $7,400 every time — even on a job with a steep pitch or extra tear-off that should price higher.' },
  { Icon: Filter,       color: '#d97706', bg: '#fffbeb', title: 'A public price invites tire-kickers',  desc: 'Price-shoppers who were never going to book will happily grab a number off your site and move on to the next contractor\'s calculator.' },
  { Icon: ShieldCheck,  color: '#16a34a', bg: '#f0fdf4', title: 'Keep pricing power on your side',       desc: 'Run the numbers yourself before a sales call, quote with confidence, and only show a price when you decide to.' },
];

const STEPS = [
  { n: '1', Icon: Rocket,   color: PRIMARY,   bg: '#fff7ed', title: 'Sign up',               desc: 'Create your account and start your 14-day free trial.' },
  { n: '2', Icon: Settings, color: '#7c3aed', bg: '#f5f3ff', title: 'Set up your pricing',    desc: 'Add your logo, service area, and per-service markup — accurate ZIP-level roofing data is already built in.' },
  { n: '3', Icon: Zap,      color: '#d97706', bg: '#fffbeb', title: 'Run instant estimates',  desc: 'Get an accurate number the moment you need one — for your own quoting, not a public page.' },
  { n: '4', Icon: Code2,    color: '#0891b2', bg: '#ecfeff', title: 'Embed it too, if you want', desc: "Want leads coming straight from your website? Paste its calculator widget code on your site anytime — it's included." },
];

const TESTIMONIALS = [
  { name: 'Mark D.',   company: 'Summit Roofing — Columbus, OH',    text: "We stopped showing homeowners a price range on the site. I run the numbers myself before every call and quote with confidence — no more haggling from the bottom of a range." },
  { name: 'Carla R.',  company: 'TrueLine Roofing — San Antonio, TX', text: "We embedded it on our site too and it's generated qualified leads every week. Conversion is way higher than our old contact form because visitors already have a ballpark before they call." },
  { name: 'Tyler B.',  company: 'Northstar Exteriors — Grand Rapids, MI', text: "My estimators run it on their phones during the walkthrough and text the number over before they even leave the driveway. Every one of them quotes the exact same job the exact same way now." },
];

const PLAN_FEATURES = [
  'Unlimited internal price calculations',
  'Instant result on screen — never a public price range',
  'ZIP-code accurate pricing & per-service markup control',
  'All 7 service calculators — shingle, metal, tile, flat, repair, inspection, gutters',
  'Calculator widget for your website, included whenever you want public lead capture',
  'Automatic lead capture + instant email alerts once it\'s on your site',
  'Custom branding, logo, and lead-capture questions',
  'Priority support',
];

const TRUST_BADGES = [
  { Icon: ShieldCheck, text: '14-day free trial' },
  { Icon: Zap,          text: 'First estimate in 2 minutes' },
  { Icon: Check,        text: 'Cancel anytime' },
];

const cardStyle = { background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, boxShadow: '0 1px 3px rgba(15,23,42,0.04)' };

function FeatureIcon({ Icon, color, bg }) {
  return (
    <div className="rc-feature-icon" style={{ width: 42, height: 42, borderRadius: 11, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <Icon size={19} color={color} strokeWidth={1.9} />
    </div>
  );
}

function Arrow({ size }) {
  return <span className="rc-arrow"><ArrowRight size={size} /></span>;
}

// A static mock of the internal result card (not a real screenshot) -- no
// browser-chrome wrapper around it, since that would imply a public website
// page when this is meant to read as the contractor's own internal result.
function WidgetPreview() {
  return (
    <div className="rc-float" style={{ position: 'relative' }}>
      <div style={{ position: 'relative', width: '100%', minHeight: 340, borderRadius: 16, overflow: 'hidden', background: 'linear-gradient(135deg, #0f172a, #7c2d12)', boxShadow: '0 30px 70px -20px rgba(2,6,23,0.55), 0 8px 20px rgba(2,6,23,0.25)', padding: '28px 24px', color: 'white' }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.7, marginBottom: 10 }}>Shingle Replacement Estimate</div>
        <div style={{ fontSize: 30, fontWeight: 800, marginBottom: 6 }}>$8,200 – $11,400</div>
        <div style={{ fontSize: 13, opacity: 0.75, marginBottom: 24 }}>1,800 sq ft · medium pitch · architectural shingle</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {[['Roof Size', '1,800 sq ft'], ['Tear-Off', '1 layer'], ['Pitch', 'Medium'], ['Penetrations', '3']].map(([label, val]) => (
            <div key={label} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.14)', borderRadius: 10, padding: '12px 14px' }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#fdba74' }}>{val}</div>
              <div style={{ fontSize: 10.5, opacity: 0.7, marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating "instant result" chip -- intentionally doesn't show a
          price, since the whole point of the internal Run an Estimate tab
          (now the primary pitch on this page) is that the number stays off
          any public-facing screen. */}
      <div style={{
        position: 'absolute', left: -18, bottom: -22, display: 'flex', alignItems: 'center', gap: 10,
        background: 'white', borderRadius: 12, padding: '11px 16px 11px 12px',
        boxShadow: '0 14px 32px -8px rgba(2,6,23,0.35)', border: '1px solid #f1f5f9',
      }}>
        <div style={{ width: 30, height: 30, borderRadius: 8, background: '#fff7ed', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Zap size={14} color={PRIMARY} strokeWidth={2.2} />
        </div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#0f172a' }}>Estimate ready</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10.5, color: '#94a3b8' }}>
            <span className="rc-pulse-dot" /> calculated in seconds &middot; yours alone
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CompanyLanding() {
  return (
    <>
      <Helmet>
        <title>Internal Roofing Price Estimator for Roofing Contractors | RoofingCal</title>
        <meta name="description" content="An internal pricing tool for roofing contractors. Run unlimited accurate estimates instantly on screen — with a calculator widget for your website included if you also want public lead capture. $45/month, 14-day free trial." />
        <link rel="canonical" href="https://roofingcal.com/for-companies" />
        <meta property="og:title" content="Internal Roofing Price Estimator for Roofing Contractors | RoofingCal" />
        <meta property="og:description" content="Price every job on your own screen before you ever show a homeowner a number. Calculator widget for your website included. $45/month." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://roofingcal.com/for-companies" />
      </Helmet>

      <div style={{ background: 'white' }}>
        <Header />
        <main>

          {/* Hero */}
          <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #7c2d12 100%)', padding: 'clamp(48px, 7vw, 80px) 0', position: 'relative', overflow: 'hidden' }}>
            <div aria-hidden="true" style={{ position: 'absolute', top: -100, right: '6%', width: 340, height: 340, borderRadius: '50%', background: 'radial-gradient(circle, rgba(251,146,60,0.18), transparent 70%)', pointerEvents: 'none' }} />
            <div aria-hidden="true" style={{ position: 'absolute', bottom: -120, left: '2%', width: 280, height: 280, borderRadius: '50%', background: 'radial-gradient(circle, rgba(234,88,12,0.16), transparent 70%)', pointerEvents: 'none' }} />
            <div className="rc-hero-grid" style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'grid', gap: 56, alignItems: 'center', position: 'relative' }}>
              <div>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(251,146,60,0.15)', color: '#fdba74', padding: '6px 14px', borderRadius: 20, fontSize: 11.5, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', border: '1px solid rgba(251,146,60,0.3)', marginBottom: 18 }}>
                  <Building2 size={12} />
                  For roofing contractors
                </span>
                <h1 style={{ fontSize: 'clamp(24px,4vw,36px)', fontWeight: 800, lineHeight: 1.3, marginBottom: 16, letterSpacing: '-0.5px', color: 'white' }}>
                  Price every job right<br />
                  <span style={{ color: '#fb923c' }}>without tipping your hand</span>
                </h1>
                <p style={{ fontSize: 17, color: '#cbd5e1', maxWidth: 480, marginBottom: 32, lineHeight: 1.65 }}>
                  RoofingCal is an internal pricing tool for roofing contractors: unlimited, instant{' '}
                  <span style={{ position: 'relative', fontWeight: 700, color: '#78350f', padding: '1px 6px', whiteSpace: 'nowrap' }}>
                    <span aria-hidden="true" style={{ position: 'absolute', inset: '2px -2px', background: '#fde047', borderRadius: '3px 7px 4px 8px / 5px 3px 6px 4px', transform: 'rotate(-0.6deg)', zIndex: 0 }} />
                    <span style={{ position: 'relative', zIndex: 1 }}>on-screen estimates</span>
                  </span>
                  {' '}ready the second you click — no more guessing what to quote. Want a public-facing version for your website too? It's included — no separate plan to buy.
                </p>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  <a href={url('/company?mode=signup')} className="rc-btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: PRIMARY, color: 'white', padding: '15px 28px', borderRadius: 10, textDecoration: 'none', fontWeight: 700, fontSize: 15.5, boxShadow: '0 10px 28px rgba(234,88,12,0.4)' }}>
                    Start Free Trial <Arrow size={16} />
                  </a>
                  <a href="#pricing" className="rc-btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', background: 'rgba(255,255,255,0.07)', color: 'white', padding: '15px 28px', borderRadius: 10, textDecoration: 'none', fontWeight: 600, fontSize: 15.5, border: '1px solid rgba(255,255,255,0.15)' }}>
                    See Pricing
                  </a>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div style={{ width: '100%', maxWidth: 480 }}>
                  <WidgetPreview />
                </div>
              </div>
            </div>
          </div>

          {/* Trust strip */}
          <div style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '22px 24px' }}>
            <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '14px 40px' }}>
              {TRUST_BADGES.map(({ Icon, text }) => (
                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#475569', fontSize: 13.5, fontWeight: 600 }}>
                  <Icon size={15} color="#16a34a" strokeWidth={2.3} />
                  {text}
                </div>
              ))}
            </div>
          </div>

          {/* The "why" -- makes the case for keeping pricing internal before
              the page asks for a sale. */}
          <div style={{ padding: 'clamp(40px, 9vw, 84px) 20px', maxWidth: 1120, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 14 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#fef2f2', color: '#dc2626', padding: '6px 14px', borderRadius: 20, fontSize: 11.5, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', border: '1px solid #fecaca' }}>
                <Lock size={12} />
                Why go internal
              </span>
            </div>
            <h2 style={{ fontSize: 'clamp(24px, 5.5vw, 32px)', fontWeight: 700, textAlign: 'center', color: '#0f172a', marginBottom: 10, letterSpacing: '-0.4px' }}>A public price range works against you</h2>
            <p style={{ textAlign: 'center', color: '#64748b', fontSize: 16, marginBottom: 'clamp(28px, 6vw, 52px)', maxWidth: 640, marginLeft: 'auto', marginRight: 'auto' }}>
              That's why more roofing contractors now run pricing internally instead of publishing it.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 18 }}>
              {PROBLEMS.map(({ Icon, color, bg, title, desc }) => (
                <div key={title} className="rc-card" style={{ ...cardStyle, padding: '24px 22px' }}>
                  <FeatureIcon Icon={Icon} color={color} bg={bg} />
                  <h3 style={{ fontSize: 15.5, fontWeight: 700, color: '#0f172a', margin: '16px 0 8px' }}>{title}</h3>
                  <p style={{ fontSize: 13.5, color: '#475569', lineHeight: 1.65, margin: 0 }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Features */}
          <div style={{ background: '#f8fafc', padding: 'clamp(40px, 9vw, 84px) 20px', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
            <div style={{ maxWidth: 1120, margin: '0 auto' }}>
              <h2 style={{ fontSize: 'clamp(24px, 5.5vw, 32px)', fontWeight: 700, textAlign: 'center', color: '#0f172a', marginBottom: 10, letterSpacing: '-0.4px' }}>One accurate pricing engine, two ways to use it</h2>
              <p style={{ textAlign: 'center', color: '#64748b', fontSize: 16, marginBottom: 'clamp(28px, 6vw, 52px)', maxWidth: 560, marginLeft: 'auto', marginRight: 'auto' }}>Keep it internal, or put it on your website — the calculations underneath are the same either way.</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 18 }}>
                {FEATURES.map(({ Icon, color, bg, title, desc }) => (
                  <div key={title} className="rc-card" style={{ ...cardStyle, padding: '24px 22px' }}>
                    <FeatureIcon Icon={Icon} color={color} bg={bg} />
                    <h3 style={{ fontSize: 15.5, fontWeight: 700, color: '#0f172a', margin: '16px 0 8px' }}>{title}</h3>
                    <p style={{ fontSize: 13.5, color: '#475569', lineHeight: 1.65, margin: 0 }}>{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* How it works */}
          <div style={{ padding: 'clamp(40px, 9vw, 84px) 20px', position: 'relative', overflow: 'hidden' }}>
            <div aria-hidden="true" style={{ position: 'absolute', top: -80, right: '8%', width: 280, height: 280, borderRadius: '50%', background: 'radial-gradient(circle, rgba(234,88,12,0.08), transparent 70%)', pointerEvents: 'none' }} />
            <div style={{ maxWidth: 1120, margin: '0 auto', position: 'relative' }}>
              <div style={{ textAlign: 'center', marginBottom: 14 }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#fff7ed', color: PRIMARY, padding: '6px 14px', borderRadius: 20, fontSize: 11.5, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', border: '1px solid #fed7aa' }}>
                  <Sparkles size={12} />
                  Simple onboarding
                </span>
              </div>
              <h2 style={{ fontSize: 'clamp(24px, 5.5vw, 32px)', fontWeight: 700, textAlign: 'center', color: '#0f172a', marginBottom: 10, letterSpacing: '-0.4px' }}>Start quoting in minutes</h2>
              <p style={{ textAlign: 'center', color: '#64748b', fontSize: 16, marginBottom: 'clamp(28px, 6vw, 52px)' }}>Four steps, no developer required — run your first estimate right after signup, then customize your branding and embed the widget on your site whenever you want.</p>
              <div className="rc-steps-grid">
                {STEPS.map((s, i) => (
                  <React.Fragment key={s.n}>
                    <div className="rc-card" style={{ ...cardStyle, padding: '26px 22px', position: 'relative', overflow: 'hidden' }}>
                      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: PRIMARY }} />
                      <div style={{ position: 'relative', width: 42, height: 42, marginBottom: 16 }}>
                        <div className="rc-feature-icon" style={{ width: 42, height: 42, borderRadius: 11, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <s.Icon size={19} color={s.color} strokeWidth={1.9} />
                        </div>
                        <div className="rc-step-badge" style={{ position: 'absolute', top: -6, right: -6, width: 22, height: 22, borderRadius: '50%', background: PRIMARY, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 11, border: '2px solid white', boxShadow: '0 1px 3px rgba(15,23,42,0.15)' }}>{s.n}</div>
                      </div>
                      <h3 style={{ fontWeight: 700, fontSize: 15.5, color: '#0f172a', marginBottom: 8 }}>{s.title}</h3>
                      <p style={{ fontSize: 13.5, color: '#64748b', lineHeight: 1.6, margin: 0 }}>{s.desc}</p>
                    </div>
                    {i < STEPS.length - 1 && (
                      <div className="rc-step-arrow" aria-hidden="true">
                        <ArrowRight size={18} />
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          {/* Testimonials */}
          <div style={{ background: '#f8fafc', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', padding: 'clamp(40px, 9vw, 84px) 20px' }}>
            <div style={{ maxWidth: 1120, margin: '0 auto' }}>
              <h2 style={{ fontSize: 'clamp(24px, 5.5vw, 32px)', fontWeight: 700, textAlign: 'center', color: '#0f172a', marginBottom: 'clamp(24px, 5vw, 44px)', letterSpacing: '-0.4px' }}>What roofing contractors say</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 18 }}>
                {TESTIMONIALS.map(t => (
                  <div key={t.name} className="rc-card" style={{ ...cardStyle, padding: '24px 22px' }}>
                    <Quote size={20} color="#fed7aa" fill="#fed7aa" style={{ marginBottom: 10 }} />
                    <div style={{ display: 'flex', gap: 2, marginBottom: 12 }}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={14} color="#f59e0b" fill="#f59e0b" />
                      ))}
                    </div>
                    <p style={{ fontSize: 14.5, color: '#374151', lineHeight: 1.7, marginBottom: 18 }}>{t.text}</p>
                    <div style={{ fontWeight: 700, fontSize: 13.5, color: '#0f172a' }}>{t.name}</div>
                    <div style={{ fontSize: 12.5, color: '#64748b', marginTop: 2 }}>{t.company}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pricing + closing CTA */}
          <div id="pricing" style={{ padding: 'clamp(40px, 9vw, 84px) 20px', position: 'relative', overflow: 'hidden' }}>
            <div aria-hidden="true" style={{ position: 'absolute', top: -60, left: '4%', width: 260, height: 260, borderRadius: '50%', background: 'radial-gradient(circle, rgba(234,88,12,0.07), transparent 70%)', pointerEvents: 'none' }} />
            <div style={{ maxWidth: 980, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 56, alignItems: 'center', position: 'relative' }}>

              <div>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#fff7ed', color: PRIMARY, padding: '6px 14px', borderRadius: 20, fontSize: 11.5, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', border: '1px solid #fed7aa', marginBottom: 16 }}>
                  <Tag size={12} />
                  Pricing
                </span>
                <h2 style={{ fontSize: 'clamp(24px, 5.5vw, 32px)', fontWeight: 700, color: '#0f172a', marginBottom: 14, letterSpacing: '-0.4px' }}>Simple, transparent pricing</h2>
                <p style={{ color: '#64748b', fontSize: 16, lineHeight: 1.65, marginBottom: 28, maxWidth: 400 }}>
                  One plan, everything included, no surprises. Run it as your internal pricing tool from day one, or add it as a calculator widget on your website whenever you're ready, at no extra cost.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 10, maxWidth: 420 }}>
                  {TRUST_BADGES.map(({ Icon, text }) => (
                    <div key={text} className="rc-card" style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'white', border: '1px solid #e2e8f0', borderRadius: 11, padding: '12px 14px' }}>
                      <div style={{ width: 30, height: 30, borderRadius: 9, background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Icon size={15} color="#16a34a" strokeWidth={2.3} />
                      </div>
                      <span style={{ color: '#334155', fontSize: 13.5, fontWeight: 600, lineHeight: 1.3 }}>{text}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rc-card" style={{ ...cardStyle, borderRadius: 14, padding: 0, overflow: 'hidden' }}>
                <div style={{ height: 3, background: `linear-gradient(90deg, ${PRIMARY}, #fb923c)` }} />
                <div style={{ padding: '30px 28px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                    <Lock size={16} color={PRIMARY} />
                    <span style={{ fontWeight: 800, fontSize: 16.5, color: '#0f172a' }}>Internal Estimator</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 3, marginBottom: 6 }}>
                    <span style={{ fontSize: 38, fontWeight: 900, color: '#0f172a', letterSpacing: '-1.5px' }}>$45</span>
                    <span style={{ fontSize: 14, color: '#64748b' }}>/month</span>
                  </div>
                  <div style={{ color: '#64748b', fontSize: 13, marginBottom: 22 }}>
                    After your{' '}
                    <span style={{ position: 'relative', fontWeight: 700, color: '#78350f', padding: '1px 6px', whiteSpace: 'nowrap' }}>
                      <span aria-hidden="true" style={{ position: 'absolute', inset: '2px -2px', background: '#fde047', borderRadius: '3px 7px 4px 8px / 5px 3px 6px 4px', transform: 'rotate(-0.6deg)', zIndex: 0 }} />
                      <span style={{ position: 'relative', zIndex: 1 }}>14-day free trial</span>
                    </span>
                    {' '}&middot; cancel anytime
                  </div>
                  <ul style={{ listStyle: 'none', padding: 0, marginBottom: 24, textAlign: 'left' }}>
                    {PLAN_FEATURES.map(item => (
                      <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 9, marginBottom: 10, fontSize: 14, color: '#374151', lineHeight: 1.4 }}>
                        <span style={{ width: 17, height: 17, borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                          <Check size={10} color="#16a34a" strokeWidth={3} strokeLinecap="square" strokeLinejoin="miter" />
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <a href={url('/company?mode=signup')} className="rc-btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: PRIMARY, color: 'white', padding: '13px 0', borderRadius: 9, textDecoration: 'none', fontWeight: 700, fontSize: 15 }}>
                    Start Free Trial <Arrow size={15} />
                  </a>
                  <div style={{ color: '#94a3b8', fontSize: 11.5, textAlign: 'center', marginTop: 10 }}>
                    No credit card required to start your 14-day trial.
                  </div>
                </div>
              </div>

            </div>
            <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: 12.5, marginTop: 32 }}>
              <Mail size={13} style={{ verticalAlign: -2, marginRight: 6 }} /> Questions? Email <a href="mailto:eliaszoleta87@gmail.com" style={{ color: PRIMARY }}>eliaszoleta87@gmail.com</a> and we'll help you get set up.
            </p>
          </div>

        </main>
        <Footer />
      </div>

      {/* Small, tasteful motion only -- a hover lift on cards/badges, an
          arrow nudge on buttons, a slow idle float on the hero mockup, and
          a live-status pulse on its "instant result" chip. Respects
          prefers-reduced-motion. */}
      <style>{`
        .rc-hero-grid { grid-template-columns: minmax(320px, 1fr) minmax(400px, 480px); }
        @media (max-width: 900px) { .rc-hero-grid { grid-template-columns: 1fr; } }
        .rc-steps-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 18px; align-items: stretch; }
        .rc-step-arrow { display: none; }
        @media (min-width: 900px) {
          .rc-steps-grid { grid-template-columns: 1fr auto 1fr auto 1fr auto 1fr; }
          .rc-step-arrow { display: flex; align-items: center; justify-content: center; color: #cbd5e1; }
        }
        .rc-card { transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease; }
        .rc-card:hover { transform: translateY(-4px); box-shadow: 0 16px 32px -10px rgba(15,23,42,0.16); border-color: #fed7aa; }
        .rc-feature-icon { transition: transform 0.2s ease; }
        .rc-card:hover .rc-feature-icon { transform: scale(1.08) rotate(-2deg); }
        .rc-step-badge { transition: background 0.2s ease, color 0.2s ease; }
        .rc-btn-primary, .rc-btn-secondary { transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease; }
        .rc-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 16px 34px rgba(234,88,12,0.45); }
        .rc-btn-secondary:hover { background: rgba(255,255,255,0.14); transform: translateY(-2px); }
        .rc-arrow { display: inline-flex; transition: transform 0.15s ease; }
        .rc-btn-primary:hover .rc-arrow, .rc-btn-secondary:hover .rc-arrow { transform: translateX(3px); }
        @keyframes rc-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        .rc-float { animation: rc-float 5s ease-in-out infinite; }
        @keyframes rc-pulse-ring { 0% { transform: scale(0.9); opacity: 0.6; } 70%, 100% { transform: scale(2.1); opacity: 0; } }
        .rc-pulse-dot { position: relative; width: 7px; height: 7px; border-radius: 50%; background: #22c55e; flex-shrink: 0; }
        .rc-pulse-dot::after { content: ''; position: absolute; inset: 0; border-radius: 50%; background: #22c55e; animation: rc-pulse-ring 1.8s ease-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .rc-float, .rc-pulse-dot::after { animation: none; }
          .rc-card, .rc-btn-primary, .rc-btn-secondary, .rc-feature-icon, .rc-step-badge, .rc-arrow { transition: none; }
        }
      `}</style>
    </>
  );
}
