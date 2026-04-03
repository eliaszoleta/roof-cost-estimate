import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function Contact() {
  return (
    <>
      <Helmet>
        <title>Contact | RoofCalc</title>
      </Helmet>
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '56px 24px' }}>
        <h1 style={{ fontSize: 36, fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>Contact Us</h1>
        <p style={{ fontSize: 16, color: '#475569', lineHeight: 1.8, marginBottom: 32 }}>
          Have a question, found an error in our estimates, or want to partner with us? We'd love to hear from you.
        </p>
        <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, padding: '28px 32px' }}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontWeight: 600, fontSize: 13, color: '#374151', marginBottom: 6 }}>Name</label>
            <input type="text" placeholder="Your name" style={{ width: '100%', padding: '11px 13px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 14, outline: 'none' }} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontWeight: 600, fontSize: 13, color: '#374151', marginBottom: 6 }}>Email</label>
            <input type="email" placeholder="you@example.com" style={{ width: '100%', padding: '11px 13px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 14, outline: 'none' }} />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontWeight: 600, fontSize: 13, color: '#374151', marginBottom: 6 }}>Message</label>
            <textarea rows={5} placeholder="How can we help?" style={{ width: '100%', padding: '11px 13px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 14, outline: 'none', resize: 'vertical' }} />
          </div>
          <button style={{ background: '#ea580c', color: 'white', border: 'none', borderRadius: 8, padding: '12px 28px', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
            Send Message
          </button>
        </div>
      </div>
    </>
  );
}
