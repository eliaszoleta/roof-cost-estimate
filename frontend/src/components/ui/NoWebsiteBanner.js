import React from 'react';
import { Globe, ArrowRight } from 'lucide-react';

// Shown right after the hero on the homepage and the partner page -- both
// audiences skew toward roofing companies without a website yet, and this
// is the highest-visibility spot to point them at the Done-For-You website
// offer before they scroll past.
export default function NoWebsiteBanner() {
  return (
    <div style={{ background: '#fff7ed', borderBottom: '1px solid #fed7aa', padding: '18px 20px' }}>
      <a
        href="/website-for-roofing-companies"
        className="nwb-link"
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, flexWrap: 'wrap',
          maxWidth: 900, margin: '0 auto', textDecoration: 'none', textAlign: 'center',
        }}
      >
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 9, color: '#9a3412', fontSize: 14.5, fontWeight: 700 }}>
          <Globe size={17} color="#ea580c" strokeWidth={2.2} />
          Don't have a roofing website yet? We've got you — get your Done-For-You roofing website built and hosted for you.
        </span>
        <span className="nwb-cta" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#ea580c', color: 'white', padding: '9px 18px', borderRadius: 8, fontWeight: 700, fontSize: 13.5, flexShrink: 0 }}>
          Get My Done-For-You Roofing Website <ArrowRight size={14} />
        </span>
      </a>
      <style>{`
        .nwb-cta { transition: transform 0.15s ease, box-shadow 0.15s ease; }
        .nwb-link:hover .nwb-cta { transform: translateY(-1px); box-shadow: 0 8px 20px rgba(234,88,12,0.35); }
        @media (prefers-reduced-motion: reduce) { .nwb-cta { transition: none; } }
      `}</style>
    </div>
  );
}
