import React from 'react';
import { MapPin } from 'lucide-react';
import { getFeaturedStates } from '../../data/statePricing';
import { url } from '../../utils/routes';

function formatPrice(n) {
  return `$${Math.round(n).toLocaleString('en-US')}`;
}

const TIER_NOTE = {
  high: 'higher cost of living drives premium pricing',
  low: 'lower cost market, competitive pricing',
  average: 'close to the national average for roofing costs',
};

export default function StateCostTable() {
  const states = getFeaturedStates();

  return (
    <section style={{ background: 'white', borderTop: '1px solid #e2e8f0', padding: '56px 24px 64px' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <h2 style={{ fontSize: 'clamp(22px, 4vw, 30px)', fontWeight: 800, color: '#0f172a', marginBottom: 8, textAlign: 'center' }}>
          Roof Replacement Cost by State — 2026 Averages
        </h2>
        <p style={{ color: '#64748b', textAlign: 'center', fontSize: 15, marginBottom: 36 }}>
          Average price for a full roof replacement on a 1,800 sq ft home.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
          {states.map(state => (
            <a key={state.code} href={url(`/roofing-cost/${state.slug}`)} style={{ textDecoration: 'none' }}>
              <div
                style={{ border: '1px solid #f1f5f9', background: '#fafafa', borderRadius: 10, padding: '16px 18px', height: '100%', boxSizing: 'border-box', transition: 'border-color 0.15s, background 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#fdba74'; e.currentTarget.style.background = '#fff7ed'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#f1f5f9'; e.currentTarget.style.background = '#fafafa'; }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, fontSize: 14.5, color: '#0f172a' }}>
                    <MapPin size={13} color="#ea580c" />{state.name}
                  </div>
                  <div style={{ fontWeight: 800, fontSize: 14, color: '#ea580c', whiteSpace: 'nowrap' }}>
                    {formatPrice(state.low)}–{formatPrice(state.high)}
                  </div>
                </div>
                <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 6, lineHeight: 1.5 }}>{TIER_NOTE[state.tier]}</div>
              </div>
            </a>
          ))}
        </div>
        <p style={{ textAlign: 'center', fontSize: 13, color: '#94a3b8', marginTop: 24 }}>
          Prices vary by ZIP code. <a href={url('/')} style={{ color: '#ea580c', fontWeight: 600, textDecoration: 'none' }}>Use the calculator above</a> for a location-specific estimate.
        </p>
      </div>
    </section>
  );
}
