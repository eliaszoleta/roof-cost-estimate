import React, { useState, useEffect } from 'react';
import { url } from '../../utils/routes';

const styles = {
  header: {
    background: 'white',
    borderBottom: '1px solid #e2e8f0',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
  },
  inner: {
    maxWidth: 1200,
    margin: '0 auto',
    padding: '0 24px',
    height: 64,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    textDecoration: 'none',
    fontWeight: 800,
    fontSize: 20,
    color: '#0f172a',
    flexShrink: 0,
  },
  logoIcon: {
    width: 34,
    height: 34,
    background: 'linear-gradient(135deg, #ea580c, #c2410c)',
    borderRadius: 9,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    boxShadow: '0 2px 8px rgba(234,88,12,0.30)',
  },
  nav: { display: 'flex', alignItems: 'center', gap: 4 },
  navLink: {
    padding: '8px 14px',
    borderRadius: 8,
    textDecoration: 'none',
    fontSize: 14,
    fontWeight: 500,
    color: '#475569',
    transition: 'all 0.15s',
  },
  cta: {
    background: '#ea580c',
    color: 'white',
    padding: '9px 18px',
    borderRadius: 8,
    textDecoration: 'none',
    fontSize: 14,
    fontWeight: 600,
    marginLeft: 8,
    transition: 'all 0.15s',
    whiteSpace: 'nowrap',
  },
  ctaMobile: {
    background: '#ea580c',
    color: 'white',
    padding: '8px 14px',
    borderRadius: 8,
    textDecoration: 'none',
    fontSize: 13,
    fontWeight: 600,
    whiteSpace: 'nowrap',
    transition: 'all 0.15s',
  },
};

const navItems = [
  { label: 'Calculator', href: url('/') },
  { label: 'Blog', href: url('/blog') },
  { label: 'About', href: url('/about') },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 768);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <header style={styles.header}>
      <div style={styles.inner}>
        <a href={url("/")} style={{ ...styles.logo, fontSize: isMobile ? 16 : 20 }} aria-label="RoofCalc — Free Roofing Cost Estimator">
          <span style={styles.logoIcon} aria-hidden="true">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="white">
              <path d="M3 11.5L12 3L21 11.5V21H15.5V15H8.5V21H3V11.5Z"/>
            </svg>
          </span>
          RoofCalc
        </a>

        {isMobile ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <a
              href={url("/for-companies")}
              style={styles.ctaMobile}
              onMouseEnter={e => { e.currentTarget.style.background = '#c2410c'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#ea580c'; }}
            >
              For Contractors
            </a>
            <button
              onClick={() => setMenuOpen(m => !m)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px 4px', fontSize: 22, color: '#0f172a', lineHeight: 1 }}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            >
              {menuOpen ? '✕' : '☰'}
            </button>
          </div>
        ) : (
          <nav style={styles.nav}>
            {navItems.map(n => (
              <a
                key={n.href}
                href={n.href}
                style={styles.navLink}
                onMouseEnter={e => { e.target.style.color = '#0f172a'; e.target.style.background = '#f8fafc'; }}
                onMouseLeave={e => { e.target.style.color = '#475569'; e.target.style.background = 'transparent'; }}
              >
                {n.label}
              </a>
            ))}
            <a
              href={url("/for-companies")}
              style={styles.navLink}
              onMouseEnter={e => { e.target.style.color = '#0f172a'; e.target.style.background = '#f8fafc'; }}
              onMouseLeave={e => { e.target.style.color = '#475569'; e.target.style.background = 'transparent'; }}
            >
              For Contractors
            </a>
            <a
              href={url("/company")}
              style={styles.cta}
              onMouseEnter={e => { e.currentTarget.style.background = '#c2410c'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#ea580c'; }}
            >
              Contractor Login →
            </a>
          </nav>
        )}
      </div>

      {isMobile && menuOpen && (
        <div style={{ padding: '12px 24px 20px', borderTop: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: 4, background: 'white' }}>
          {navItems.map(n => (
            <a key={n.href} href={n.href} style={{ ...styles.navLink, display: 'block', padding: '10px 12px' }}>
              {n.label}
            </a>
          ))}
          <a href={url("/company")} style={{ ...styles.cta, display: 'block', textAlign: 'center', marginLeft: 0, marginTop: 8 }}>
            Contractor Login →
          </a>
        </div>
      )}
    </header>
  );
}
