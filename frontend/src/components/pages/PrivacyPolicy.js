import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function PrivacyPolicy() {
  return (
    <>
      <Helmet><title>Privacy Policy | RoofCalc</title></Helmet>
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '56px 24px', color: '#374151', fontSize: 15, lineHeight: 1.8 }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>Privacy Policy</h1>
        <p style={{ color: '#64748b', marginBottom: 32 }}>Last updated: April 2026</p>

        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0f172a', marginTop: 32, marginBottom: 8 }}>Information We Collect</h2>
        <p>When you use RoofCalc, we may collect: ZIP code or state (to compute location-adjusted estimates), and optionally your name, email, and phone if you choose to provide them in the lead capture form. We also collect standard server logs (IP address, browser type, pages visited).</p>

        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0f172a', marginTop: 32, marginBottom: 8 }}>How We Use It</h2>
        <p>We use your location to generate accurate estimates. If you provide contact info, it may be shared with the roofing contractor whose estimator you're using (embed mode) or used to email you your estimate results. We do not sell your personal data to third parties.</p>

        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0f172a', marginTop: 32, marginBottom: 8 }}>Cookies</h2>
        <p>We use minimal session cookies to keep the calculator working. We do not use advertising trackers.</p>

        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0f172a', marginTop: 32, marginBottom: 8 }}>Contact</h2>
        <p>For privacy questions, reach out via our <a href="/contact" style={{ color: '#ea580c' }}>contact page</a>.</p>
      </div>
    </>
  );
}
