import React from 'react';
import RoofingCalculator from '../../calculator/RoofingCalculator';

// Run the real calculator against this contractor's own branding and see
// the result on screen immediately -- no lead capture, nothing saved as a
// lead, nothing shown to a homeowner. Reuses RoofingCalculator wholesale
// (the same component the public widget and embed preview already use)
// via enableLeadCapture:false, rather than building a second calculator
// from scratch. Mirrors cleanestimator's and solarcostpredictor's own
// internal "Run an Estimate" tabs.
function readBranding() {
  try { return JSON.parse(localStorage.getItem('rc_branding')) || {}; } catch { return {}; }
}

export default function RunEstimateTab() {
  const branding = readBranding();
  const companyConfig = {
    companyName: branding.companyName || null,
    primaryColor: branding.primaryColor || '#ea580c',
    enableLeadCapture: false,
  };

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>Run an Estimate</h2>
        <p style={{ fontSize: 14, color: '#64748b' }}>Price a job on your own screen — the number stays here unless you decide to share it.</p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: 720, background: 'white', borderRadius: 14, boxShadow: '0 8px 40px rgba(0,0,0,0.08)', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <RoofingCalculator companyConfig={companyConfig} embedded={true} />
        </div>
      </div>
    </div>
  );
}
