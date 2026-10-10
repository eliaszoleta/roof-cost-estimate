import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { url } from '../../utils/routes';

const PRIMARY = '#ea580c';
const WEB3FORMS_KEY = 'b0da3f48-9982-4a5a-9195-4200a80ba8c6';

const IconHammer = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={PRIMARY} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 12l-8.5 8.5a2.12 2.12 0 0 1-3-3L12 9" />
    <path d="M17.64 15L22 10.64" />
    <path d="M20.91 11.7l-1.25-1.25c-.6-.6-.93-1.4-.93-2.25v-.86L16.01 4.6a5.56 5.56 0 0 0-3.94-1.64H9l.92.82A6.18 6.18 0 0 1 12 8.4v1.56l2 2h2.47l2.26 1.91" />
  </svg>
);

const IconPin = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={PRIMARY} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
    <circle cx="12" cy="9" r="2.5" />
  </svg>
);

const IconWallet = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={PRIMARY} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="5" width="20" height="14" rx="2" />
    <path d="M16 12h2" />
    <path d="M2 9h20" />
  </svg>
);

const IconCheck = ({ size = 18, color = '#16a34a', bg = '#dcfce7' }) => (
  <div style={{ width: size + 4, height: size + 4, borderRadius: '50%', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
    <svg width={size - 4} height={size - 4} viewBox="0 0 12 12" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="1.5,6 4.5,9 10.5,3" />
    </svg>
  </div>
);

const IconArrow = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', verticalAlign: 'middle', marginLeft: 6 }}>
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="13,6 19,12 13,18" />
  </svg>
);

const IconSuccess = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="7,12 10,15 17,9" />
  </svg>
);

function StatBadge({ number, label }) {
  return (
    <div style={{ textAlign: 'center', padding: '24px 20px' }}>
      <div style={{ fontSize: 'clamp(36px, 6vw, 52px)', fontWeight: 900, color: PRIMARY, lineHeight: 1, letterSpacing: '-2px' }}>{number}</div>
      <div style={{ fontSize: 14, color: '#64748b', marginTop: 6, fontWeight: 500 }}>{label}</div>
    </div>
  );
}

function StepCard({ number, title, desc }) {
  return (
    <div style={{ display: 'flex', gap: 18, alignItems: 'flex-start' }}>
      <div style={{ width: 40, height: 40, borderRadius: '50%', background: PRIMARY, color: 'white', fontWeight: 800, fontSize: 17, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{number}</div>
      <div>
        <div style={{ fontWeight: 700, fontSize: 16, color: '#0f172a', marginBottom: 4 }}>{title}</div>
        <div style={{ fontSize: 14, color: '#64748b', lineHeight: 1.65 }}>{desc}</div>
      </div>
    </div>
  );
}

function Check({ children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
      <div style={{ marginTop: 1 }}><IconCheck /></div>
      <span style={{ fontSize: 14.5, color: '#374151', lineHeight: 1.55 }}>{children}</span>
    </div>
  );
}

export default function PartnerWithUs() {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', business: '', email: '', phone: '', cities: '', message: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setError('');
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: 'Partnership Inquiry - RoofingCal',
          from_name: form.name,
          name: form.name,
          business: form.business,
          email: form.email,
          phone: form.phone || 'Not provided',
          cities: form.cities,
          message: form.message || 'No additional message',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSent(true);
      } else {
        setError('Something went wrong. Please try again or email us directly at eliaszoleta87@gmail.com');
      }
    } catch {
      setError('Network error. Please try again or email us directly at eliaszoleta87@gmail.com');
    } finally {
      setSending(false);
    }
  };

  const inputStyle = { width: '100%', padding: '11px 14px', border: '1.5px solid #e2e8f0', borderRadius: 9, fontSize: 14, outline: 'none', boxSizing: 'border-box', color: '#0f172a', background: 'white' };

  return (
    <>
      <Helmet>
        <title>Partner With Us | RoofingCal</title>
        <meta name="description" content="Get your roofing business recommended to thousands of homeowners actively getting roofing estimates in your city. Join RoofingCal's partner network for $350/month per city." />
        <link rel="canonical" href="https://roofingcal.com/partner-with-us" />
      </Helmet>

      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #7c2d12 100%)', color: 'white', padding: 'clamp(60px, 10vw, 100px) 24px' }}>
        <div style={{ maxWidth: 780, margin: '0 auto', textAlign: 'center' }}>
          <h1 style={{ fontSize: 'clamp(32px, 6vw, 58px)', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-1.5px', marginBottom: 22 }}>
            Get Recommended to Thousands of Homeowners
            <span style={{ display: 'block', color: '#fdba74' }}> Ready to Hire a Roofer</span>
          </h1>
          <p style={{ fontSize: 'clamp(15px, 2.5vw, 18px)', color: '#cbd5e1', lineHeight: 1.7, maxWidth: 620, margin: '0 auto 36px' }}>
            RoofingCal gets <strong style={{ color: 'white' }}>20,000&ndash;30,000 organic visits per month</strong> from homeowners actively pricing out roofing jobs &mdash; not casual browsers, but people with a real project in mind and a budget in hand.
          </p>
          <a href="#apply" style={{ display: 'inline-flex', alignItems: 'center', background: PRIMARY, color: 'white', padding: '15px 36px', borderRadius: 10, textDecoration: 'none', fontWeight: 800, fontSize: 17, letterSpacing: '-0.2px', gap: 4 }}>
            Get My City <IconArrow size={18} color="white" />
          </a>
        </div>
      </div>

      {/* Stats bar */}
      <div style={{ borderBottom: '1px solid #e2e8f0', borderTop: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' }}>
          <StatBadge number="20K+" label="Monthly visitors" />
          <StatBadge number="100%" label="Organic, targeted traffic" />
          <StatBadge number="1" label="Partner per city" />
          <StatBadge number="$350" label="Per city / month" />
        </div>
      </div>

      {/* Why it works */}
      <div style={{ padding: 'clamp(48px, 8vw, 80px) 24px', background: 'white' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px', marginBottom: 12 }}>Why This Traffic Converts</h2>
            <p style={{ fontSize: 15, color: '#64748b', maxWidth: 540, margin: '0 auto', lineHeight: 1.65 }}>Most advertising reaches people who aren&apos;t looking. Our visitors are different.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
            {[
              { icon: <IconHammer />, title: 'They already need the work done', body: 'Every visitor used our estimator to price out a roofing job. They came here because they have a real project &mdash; not because an ad interrupted them.' },
              { icon: <IconPin />, title: 'They give us their location', body: 'Users enter their ZIP code to get accurate local pricing. We know exactly where they are and match them to your service area.' },
              { icon: <IconWallet />, title: 'They know their budget', body: "Our estimator gives them a price range before they see you. By the time your card appears, they're prepared and ready to get a quote." },
            ].map((card, i) => (
              <div key={i} style={{ background: '#f8fafc', borderRadius: 14, padding: '28px 24px', border: '1px solid #e2e8f0' }}>
                <div style={{ width: 52, height: 52, background: '#fff7ed', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>{card.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 16, color: '#0f172a', marginBottom: 8 }}>{card.title}</div>
                <div style={{ fontSize: 14, color: '#64748b', lineHeight: 1.65 }} dangerouslySetInnerHTML={{ __html: card.body }} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How it works */}
      <div style={{ padding: 'clamp(48px, 8vw, 80px) 24px', background: '#f8fafc' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 44 }}>
            <h2 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px', marginBottom: 12 }}>How the Partnership Works</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            <StepCard number="1" title="You choose your city (or cities)" desc="Tell us which cities or metro areas you serve. Each city is $350/month and gives you exclusive placement there — only one partner per city." />
            <StepCard number="2" title="We add your business to our platform" desc="We set up your profile with your business name, phone number, website, and logo. No tech work needed on your end." />
            <StepCard number="3" title="Your business appears on estimate results" desc="When a homeowner in your city finishes using our estimator, your contact card shows up on their results page as a recommended local roofer — right when they're ready to get quotes." />
            <StepCard number="4" title="They call or visit your website directly" desc="There's no middleman and no lead fee. The homeowner contacts you directly. Every lead is yours, no commission, no strings." />
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div style={{ padding: 'clamp(48px, 8vw, 80px) 24px', background: 'white' }}>
        <div style={{ maxWidth: 780, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 44 }}>
            <h2 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px', marginBottom: 12 }}>Simple, Transparent Pricing</h2>
            <p style={{ fontSize: 15, color: '#64748b' }}>One flat rate. No setup fees. No commissions. Cancel anytime.</p>
          </div>
          <div style={{ background: 'linear-gradient(135deg, #fff7ed, #fef3c7)', border: `2px solid ${PRIMARY}`, borderRadius: 20, padding: 'clamp(28px, 5vw, 48px)', maxWidth: 540, margin: '0 auto' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: PRIMARY, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Per City Plan</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 6 }}>
              <span style={{ fontSize: 56, fontWeight: 900, color: '#0f172a', letterSpacing: '-2px', lineHeight: 1 }}>$350</span>
              <span style={{ fontSize: 16, color: '#64748b', fontWeight: 500 }}>/month</span>
            </div>
            <div style={{ fontSize: 13.5, color: '#64748b', marginBottom: 28 }}>per city you want coverage in</div>
            <div style={{ marginBottom: 28 }}>
              <Check>Exclusive placement — only 1 partner per city</Check>
              <Check>Your name, phone, website &amp; logo on every results page in your city</Check>
              <Check>Direct contact — homeowners call or click you straight away</Check>
              <Check>No lead fees, no commissions, no hidden costs</Check>
              <Check>Cancel anytime with 30 days notice</Check>
              <Check>Add more cities at the same rate as you grow</Check>
            </div>
            <div style={{ background: 'white', borderRadius: 10, padding: '14px 18px', border: `1px solid #fed7aa`, fontSize: 13.5, color: '#9a3412', lineHeight: 1.6 }}>
              <strong>Example:</strong> A contractor serving Houston and San Antonio pays $700/month and appears on every estimate result from both cities.
            </div>
          </div>
        </div>
      </div>

      {/* Who it's for */}
      <div style={{ padding: 'clamp(40px, 7vw, 72px) 24px', background: '#0f172a', color: 'white' }}>
        <div style={{ maxWidth: 780, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(22px, 4vw, 32px)', fontWeight: 800, marginBottom: 16, letterSpacing: '-0.5px' }}>Who Is This Right For?</h2>
          <p style={{ fontSize: 15, color: '#94a3b8', maxWidth: 540, margin: '0 auto 40px', lineHeight: 1.65 }}>This works best for established roofing contractors that want a consistent, low-effort source of warm inbound leads.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, textAlign: 'left' }}>
            {['Residential roof replacement', 'Roof repair & leak fix', 'Metal roofing installation', 'Flat & commercial roofing', 'Gutter installation & repair', 'Roof inspection services'].map((item, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '14px 18px', fontSize: 14, color: '#e2e8f0', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 10 }}>
                <IconCheck size={16} color="#4ade80" bg="rgba(74,222,128,0.15)" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div style={{ padding: 'clamp(48px, 8vw, 80px) 24px', background: '#f8fafc' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(22px, 4vw, 32px)', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px', marginBottom: 36, textAlign: 'center' }}>Common Questions</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {[
              { q: 'Is there really only one partner per city?', a: 'Yes. We give one roofing contractor exclusive placement per city. Once a city is taken, we waitlist new applicants. Apply early to lock in your market.' },
              { q: 'How exactly does my business appear?', a: 'After a homeowner completes an estimate, a branded card with your business name, logo, phone number, and website link appears on their results page under "Recommended Roofer Near You." It looks like a trusted recommendation, not a banner ad.' },
              { q: 'What counts as a city?', a: "We go by city name as detected from the user's IP address. Major metros count as one city each. If you serve a wide metro area, let us know and we'll figure out the best coverage for you." },
              { q: 'What if traffic in my city is low?', a: "We can share an estimate of current monthly sessions for your city before you commit. You're still getting targeted, high-intent visitors for less than the cost of one Google Ads day." },
              { q: 'Can I cancel?', a: "Yes. Give us 30 days notice and we'll remove your listing at the end of the billing cycle. No long-term contracts." },
            ].map((item, i) => (
              <div key={i} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, padding: '18px 22px', marginBottom: 2 }}>
                <div style={{ fontWeight: 700, fontSize: 15, color: '#0f172a', marginBottom: 8 }}>{item.q}</div>
                <div style={{ fontSize: 14, color: '#64748b', lineHeight: 1.65 }}>{item.a}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Apply form */}
      <div id="apply" style={{ padding: 'clamp(48px, 8vw, 80px) 24px', background: 'white' }}>
        <div style={{ maxWidth: 580, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <h2 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px', marginBottom: 12 }}>Apply for Your City</h2>
            <p style={{ fontSize: 15, color: '#64748b', lineHeight: 1.65 }}>Fill out the form below and we'll confirm availability in your market and get you set up within 48 hours.</p>
          </div>
          {sent ? (
            <div style={{ background: '#f0fdf4', border: '2px solid #86efac', borderRadius: 16, padding: '36px 28px', textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}><IconSuccess /></div>
              <div style={{ fontWeight: 800, fontSize: 20, color: '#15803d', marginBottom: 8 }}>Application Sent!</div>
              <div style={{ fontSize: 15, color: '#166534' }}>We'll review your application and get back to you within 48 hours to confirm availability in your city.</div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 16, padding: 'clamp(24px, 4vw, 40px)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ fontSize: 12.5, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Your Name *</label>
                  <input required style={inputStyle} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="John Smith" />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ fontSize: 12.5, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Business Name *</label>
                  <input required style={inputStyle} value={form.business} onChange={e => setForm(f => ({ ...f, business: e.target.value }))} placeholder="Smith Roofing Co." />
                </div>
                <div>
                  <label style={{ fontSize: 12.5, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email *</label>
                  <input required type="email" style={inputStyle} value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="you@yourbusiness.com" />
                </div>
                <div>
                  <label style={{ fontSize: 12.5, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Phone</label>
                  <input type="tel" style={inputStyle} value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="(555) 000-0000" />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ fontSize: 12.5, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Cities You Want to Cover *</label>
                  <input required style={inputStyle} value={form.cities} onChange={e => setForm(f => ({ ...f, cities: e.target.value }))} placeholder="e.g. Houston TX, Austin TX" />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ fontSize: 12.5, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Anything else?</label>
                  <textarea rows={3} style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} placeholder="Services you offer, website URL, questions..." />
                </div>
              </div>
              {error && (
                <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 8, padding: '10px 14px', fontSize: 13.5, color: '#dc2626', marginBottom: 14 }}>{error}</div>
              )}
              <button type="submit" disabled={sending} style={{ width: '100%', background: sending ? '#fdba74' : PRIMARY, color: 'white', border: 'none', borderRadius: 10, padding: '14px 0', fontWeight: 800, fontSize: 16, cursor: sending ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, transition: 'background 0.2s' }}>
                {sending ? 'Sending...' : <> Send My Application <IconArrow size={18} color="white" /> </>}
              </button>
              <p style={{ fontSize: 12, color: '#94a3b8', textAlign: 'center', marginTop: 14, marginBottom: 0 }}>We'll confirm city availability and pricing within 48 hours. No payment required to apply.</p>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
