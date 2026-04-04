import React from 'react';
import { url } from '../../utils/routes';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer style={{ background: '#0f172a', color: '#94a3b8', padding: '48px 24px 32px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 32, marginBottom: 40 }}>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <span style={{ fontSize: 20 }}>🏠</span>
              <span style={{ fontWeight: 800, fontSize: 17, color: 'white' }}>RoofCalc</span>
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.7, margin: 0 }}>
              Free roofing cost estimates for homeowners. Instant ZIP-code specific pricing for replacement, repair, and more.
            </p>
          </div>

          <div>
            <div style={{ fontWeight: 700, color: 'white', marginBottom: 12, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Estimates</div>
            {[
              ['Asphalt Shingle Roof', url('/?service=asphalt_shingle')],
              ['Metal Roof', url('/?service=metal')],
              ['Tile Roof', url('/?service=tile')],
              ['Flat / TPO Roof', url('/?service=flat_tpo')],
              ['Roof Repair', url('/?service=repair')],
              ['Roof Inspection', url('/?service=inspection')],
              ['Gutter Installation', url('/?service=gutter')],
            ].map(([label, href]) => (
              <a key={href} href={href} style={{ display: 'block', fontSize: 13, color: '#94a3b8', textDecoration: 'none', marginBottom: 7, lineHeight: 1.5 }}
                onMouseEnter={e => { e.target.style.color = 'white'; }}
                onMouseLeave={e => { e.target.style.color = '#94a3b8'; }}>
                {label}
              </a>
            ))}
          </div>

          <div>
            <div style={{ fontWeight: 700, color: 'white', marginBottom: 12, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Company</div>
            {[
              ['About', url('/about')],
              ['Contact', url('/contact')],
              ['For Contractors', url('/for-companies')],
              ['Contractor Login', url('/company')],
            ].map(([label, href]) => (
              <a key={href} href={href} style={{ display: 'block', fontSize: 13, color: '#94a3b8', textDecoration: 'none', marginBottom: 7 }}
                onMouseEnter={e => { e.target.style.color = 'white'; }}
                onMouseLeave={e => { e.target.style.color = '#94a3b8'; }}>
                {label}
              </a>
            ))}
          </div>

          <div>
            <div style={{ fontWeight: 700, color: 'white', marginBottom: 12, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Legal</div>
            {[
              ['Privacy Policy', url('/privacy-policy')],
              ['Terms of Service', url('/terms-of-service')],
            ].map(([label, href]) => (
              <a key={href} href={href} style={{ display: 'block', fontSize: 13, color: '#94a3b8', textDecoration: 'none', marginBottom: 7 }}
                onMouseEnter={e => { e.target.style.color = 'white'; }}
                onMouseLeave={e => { e.target.style.color = '#94a3b8'; }}>
                {label}
              </a>
            ))}
          </div>
        </div>

        <div style={{ borderTop: '1px solid #1e293b', paddingTop: 24, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, fontSize: 12.5 }}>
          <span>&copy; {year} RoofCalc. All rights reserved.</span>
          <span>Estimates are for informational purposes only. Always get multiple quotes from licensed roofing contractors.</span>
        </div>
      </div>
    </footer>
  );
}
