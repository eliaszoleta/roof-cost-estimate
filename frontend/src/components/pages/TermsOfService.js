import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function TermsOfService() {
  return (
    <>
      <Helmet><title>Terms of Service | RoofCalc</title></Helmet>
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '56px 24px', color: '#374151', fontSize: 15, lineHeight: 1.8 }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>Terms of Service</h1>
        <p style={{ color: '#64748b', marginBottom: 32 }}>Last updated: April 2026</p>

        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0f172a', marginTop: 32, marginBottom: 8 }}>Estimates Are Informational Only</h2>
        <p>All cost estimates provided by RoofCalc are for informational purposes only. They do not constitute a quote, bid, or contract. Actual roofing costs depend on many factors that cannot be assessed without an on-site inspection. Always obtain multiple quotes from licensed, insured contractors.</p>

        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0f172a', marginTop: 32, marginBottom: 8 }}>Use of the Service</h2>
        <p>You may use RoofCalc for personal, non-commercial purposes. You may not scrape, copy, or redistribute our pricing data or algorithms. Contractor accounts are subject to their own subscription terms.</p>

        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0f172a', marginTop: 32, marginBottom: 8 }}>Limitation of Liability</h2>
        <p>RoofCalc and its operators are not liable for any decisions made based on estimate results. Use this tool as a starting point for your research, not as a final determination of cost.</p>

        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0f172a', marginTop: 32, marginBottom: 8 }}>Changes</h2>
        <p>We may update these terms at any time. Continued use of the site constitutes acceptance of the updated terms.</p>
      </div>
    </>
  );
}
