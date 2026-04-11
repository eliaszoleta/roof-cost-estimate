import React from 'react';
import { url } from '../../utils/routes';

const BLOG_CATEGORIES = [
  { slug: 'roofing-costs',       label: 'Roofing Costs'       },
  { slug: 'roof-materials',      label: 'Roof Materials'       },
  { slug: 'roof-repair',         label: 'Roof Repair'          },
  { slug: 'roof-replacement',    label: 'Roof Replacement'     },
  { slug: 'roofing-insurance',   label: 'Roofing & Insurance'  },
  { slug: 'roofing-basics',      label: 'Roofing Basics'       },
];

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer style={{ background: '#0f172a', color: '#94a3b8', padding: '48px 24px 32px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 32, marginBottom: 40 }}>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg, #ea580c, #c2410c)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 2px 8px rgba(234,88,12,0.35)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                  <path d="M3 11.5L12 3L21 11.5V21H15.5V15H8.5V21H3V11.5Z"/>
                </svg>
              </div>
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
            <div style={{ fontWeight: 700, color: 'white', marginBottom: 12, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Blog Categories</div>
            {BLOG_CATEGORIES.map(({ slug, label }) => (
              <a key={slug} href={url(`/blog/category/${slug}`)} style={{ display: 'block', fontSize: 13, color: '#94a3b8', textDecoration: 'none', marginBottom: 7, lineHeight: 1.5 }}
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
