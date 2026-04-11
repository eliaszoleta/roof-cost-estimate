import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function About() {
  return (
    <>
      <Helmet>
        <title>About | RoofCalc</title>
        <meta name="description" content="RoofCalc provides free, instant roofing cost estimates for homeowners across the US." />
      </Helmet>
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '56px 24px' }}>
        <h1 style={{ fontSize: 36, fontWeight: 800, color: '#0f172a', marginBottom: 16 }}>About RoofCalc</h1>
        <p style={{ fontSize: 16, color: '#475569', lineHeight: 1.8, marginBottom: 24 }}>
          RoofCalc is a free roofing cost estimator that helps homeowners understand what they should expect to pay before calling a contractor. We use ZIP-code-level labor data, material price indices, and regional cost-of-living adjustments to generate accurate, honest estimates.
        </p>
        <p style={{ fontSize: 16, color: '#475569', lineHeight: 1.8, marginBottom: 24 }}>
          Our goal is simple: put the homeowner in the driver's seat. Armed with a realistic estimate, you can have more informed conversations with contractors, spot outliers, and make better decisions for one of the biggest investments on your home.
        </p>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: '#0f172a', marginBottom: 12, marginTop: 40 }}>How It Works</h2>
        <p style={{ fontSize: 16, color: '#475569', lineHeight: 1.8, marginBottom: 24 }}>
          You answer a few questions about your roof — size, material, pitch, location — and our engine applies national base pricing adjusted for your specific state or ZIP code. Estimates include a realistic low-to-high range, a line-item breakdown, and notes on what factors most affect your price.
        </p>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: '#0f172a', marginBottom: 12, marginTop: 40 }}>For Contractors</h2>
        <p style={{ fontSize: 16, color: '#475569', lineHeight: 1.8 }}>
          Roofing contractors can embed our estimator on their own websites and receive qualified leads directly. <a href="/for-companies" style={{ color: '#ea580c', fontWeight: 600 }}>Learn more →</a>
        </p>
      </div>
    </>
  );
}
