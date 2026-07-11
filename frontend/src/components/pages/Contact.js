import React, { useState, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { url } from '../../utils/routes';

const WEB3FORMS_ACCESS_KEY = 'b0da3f48-9982-4a5a-9195-4200a80ba8c6';

function Icon({ children, size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  );
}
const ClockIcon = p => <Icon {...p}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></Icon>;
const ShieldIcon = p => <Icon {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></Icon>;
const HammerIcon = p => <Icon {...p}><path d="m15 12-8.5 8.5a2.12 2.12 0 1 1-3-3L12 9" /><path d="M17.64 15 22 10.64" /><path d="m20.91 11.7-1.25-1.25c-.6-.6-.93-1.4-.93-2.25v-.86L16.01 4.6a5.56 5.56 0 0 0-3.94-1.64H9l.92.82A6.18 6.18 0 0 1 12 8.4v1.56l2 2h2.47c.85 0 1.65.33 2.25.93L20.9 15.3" /></Icon>;
const CheckCircleIcon = p => <Icon {...p}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></Icon>;
const AlertTriangleIcon = p => <Icon {...p}><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></Icon>;

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: 'General Question', message: '' });
  const [status, setStatus] = useState('idle'); // idle | sending | success | error
  const honeypotRef = useRef(null);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();

    if (honeypotRef.current && honeypotRef.current.value) {
      setStatus('success');
      return;
    }

    setStatus('sending');
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: `New RoofingCal message: ${form.subject}`,
          from_name: 'RoofingCal Contact Form',
          name: form.name,
          email: form.email,
          topic: form.subject,
          message: form.message,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus('success');
        setForm({ name: '', email: '', subject: 'General Question', message: '' });
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh' }}>
      <Helmet>
        <title>Contact RoofingCal | Get In Touch</title>
        <meta name="description" content="Have a question about RoofingCal or our roofing estimates? Contact us — we'd love to hear from you." />
        <link rel="canonical" href="https://roofingcal.com/contact" />
        <meta property="og:title" content="Contact RoofingCal | Get In Touch" />
        <meta property="og:description" content="Have a question about RoofingCal or our roofing estimates? Contact us — we'd love to hear from you." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://roofingcal.com/contact" />
      </Helmet>

      <style>{`
        .rc-contact-grid { display: grid; grid-template-columns: 280px 1fr; gap: 24px; align-items: start; }
        .rc-contact-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        @media (max-width: 780px) {
          .rc-contact-grid { grid-template-columns: 1fr; }
          .rc-contact-row { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #1c1917 0%, #7c2d12 55%, #c2410c 100%)',
        padding: '60px 24px 92px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', bottom: -60, left: -40, width: 240, height: 240, borderRadius: '50%', background: 'rgba(251,146,60,0.14)', filter: 'blur(50px)' }} />
        <div style={{ position: 'absolute', top: -50, right: -30, width: 200, height: 200, borderRadius: '50%', background: 'rgba(251,146,60,0.1)', filter: 'blur(50px)' }} />
        <div style={{ position: 'relative', maxWidth: 560, margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', background: 'rgba(253,186,116,0.14)', border: '1px solid rgba(253,186,116,0.3)', borderRadius: 999, padding: '4px 14px', marginBottom: 20 }}>
            <span style={{ fontSize: 11.5, fontWeight: 700, color: '#fdba74', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Get in Touch</span>
          </div>
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: 900, color: 'white', lineHeight: 1.15, marginBottom: 14, letterSpacing: '-0.02em' }}>
            Contact Us
          </h1>
          <p style={{ fontSize: 16, color: '#fed7aa', lineHeight: 1.65, maxWidth: 420, margin: '0 auto' }}>
            Have a question, found an error in our estimates, or want to partner with us? We'd love to hear from you.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '-56px auto 0', padding: '0 24px 80px', position: 'relative' }}>
        <div className="rc-contact-grid">

          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <SideCard icon={<ClockIcon size={20} />} title="Fast response" body="We aim to reply within 1–2 business days." color="#ea580c" bg="#ffedd5" />
            <SideCard icon={<ShieldIcon size={20} />} title="Honest estimates" body="Found something off in a quote? Tell us and we'll look into it." color="#16a34a" bg="#dcfce7" />
            <SideCard icon={<HammerIcon size={20} />} title="For contractors" body="Interested in embedding our estimator? Mention it in your message." color="#7c3aed" bg="#ede9fe" />

            <div style={{ padding: '18px 20px', background: '#fff7ed', borderRadius: 14, border: '1px solid #fed7aa' }}>
              <p style={{ fontSize: 13, color: '#c2410c', fontWeight: 700, marginBottom: 6 }}>Looking for quick answers?</p>
              <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.65, margin: 0 }}>
                Browse the <a href={url('/blog')} style={{ color: '#ea580c', fontWeight: 600 }}>RoofingCal Blog</a> for guides on roofing costs, materials, and what drives your price.
              </p>
            </div>
          </div>

          {/* Contact form */}
          <div style={{ background: 'white', borderRadius: 18, border: '1px solid #e2e8f0', boxShadow: '0 12px 32px rgba(15,23,42,0.08)', overflow: 'hidden' }}>
            <div style={{ padding: '24px 30px 18px', borderBottom: '1px solid #f1f5f9' }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.01em' }}>Send Us a Message</h2>
              <p style={{ fontSize: 13, color: '#64748b', margin: '4px 0 0' }}>Fields marked * are required.</p>
            </div>

            <div style={{ padding: '26px 30px 30px' }}>
              {status === 'success' ? (
                <div style={{ textAlign: 'center', padding: '36px 0' }}>
                  <div style={{ marginBottom: 14, color: '#16a34a', display: 'flex', justifyContent: 'center' }}><CheckCircleIcon size={44} /></div>
                  <p style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>Message sent!</p>
                  <p style={{ fontSize: 14, color: '#64748b', marginBottom: 22 }}>Thanks for reaching out — we typically reply within 1–2 business days.</p>
                  <button onClick={() => setStatus('idle')} style={{ padding: '10px 22px', background: '#ea580c', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 14, fontFamily: 'inherit' }}>
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                  <input ref={honeypotRef} type="text" name="botcheck" tabIndex="-1" autoComplete="off" style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }} aria-hidden="true" />

                  <div className="rc-contact-row">
                    <div>
                      <label style={labelStyle} htmlFor="contact-name">Name *</label>
                      <input id="contact-name" name="name" type="text" required value={form.name} onChange={handleChange} placeholder="Your name" style={inputStyle} onFocus={e => e.target.style.borderColor = '#ea580c'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                    </div>
                    <div>
                      <label style={labelStyle} htmlFor="contact-email">Email *</label>
                      <input id="contact-email" name="email" type="email" required value={form.email} onChange={handleChange} placeholder="you@example.com" style={inputStyle} onFocus={e => e.target.style.borderColor = '#ea580c'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                    </div>
                  </div>

                  <div>
                    <label style={labelStyle} htmlFor="contact-subject">Subject</label>
                    <select id="contact-subject" name="subject" value={form.subject} onChange={handleChange} style={{ ...inputStyle, cursor: 'pointer' }}>
                      <option>General Question</option>
                      <option>Estimate Feedback</option>
                      <option>Contractor Partnership</option>
                      <option>Privacy / Data Request</option>
                      <option>Bug Report</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div>
                    <label style={labelStyle} htmlFor="contact-message">Message *</label>
                    <textarea id="contact-message" name="message" required rows={5} value={form.message} onChange={handleChange} placeholder="How can we help?" style={{ ...inputStyle, resize: 'vertical' }} onFocus={e => e.target.style.borderColor = '#ea580c'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                  </div>

                  {status === 'error' && (
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '12px 14px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, color: '#b91c1c' }}>
                      <AlertTriangleIcon size={18} />
                      <p style={{ fontSize: 13.5, margin: 0, lineHeight: 1.5 }}>Something went wrong sending your message. Please try again in a moment.</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    style={{
                      padding: '13px 28px',
                      background: '#ea580c',
                      color: 'white',
                      border: 'none',
                      borderRadius: 9,
                      fontWeight: 700,
                      fontSize: 15,
                      cursor: status === 'sending' ? 'not-allowed' : 'pointer',
                      opacity: status === 'sending' ? 0.7 : 1,
                      alignSelf: 'flex-start',
                      transition: 'background 0.15s',
                      fontFamily: 'inherit',
                      boxShadow: '0 4px 14px rgba(234,88,12,0.28)',
                    }}
                    onMouseEnter={e => { if (status !== 'sending') e.currentTarget.style.background = '#c2410c'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#ea580c'; }}
                  >
                    {status === 'sending' ? 'Sending…' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SideCard({ icon, title, body, color, bg }) {
  return (
    <div style={{ display: 'flex', gap: 14, padding: '16px 18px', background: 'white', borderRadius: 14, border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
      <div style={{ width: 38, height: 38, borderRadius: 10, background: bg, color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: 13.5, fontWeight: 700, color: '#0f172a', marginBottom: 3 }}>{title}</div>
        <div style={{ fontSize: 12.5, color: '#64748b', lineHeight: 1.5 }}>{body}</div>
      </div>
    </div>
  );
}

const labelStyle = { display: 'block', fontWeight: 600, fontSize: 13, color: '#374151', marginBottom: 6 };
const inputStyle = {
  width: '100%',
  padding: '10px 14px',
  border: '1.5px solid #e2e8f0',
  borderRadius: 8,
  fontSize: 14,
  color: '#0f172a',
  background: '#fafafa',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.15s',
  fontFamily: 'inherit',
};
