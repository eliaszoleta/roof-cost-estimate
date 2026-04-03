import React from 'react';

const SERVICES = [
  { id: 'shingle_replacement', label: 'Asphalt Shingle Roof', emoji: '🏠', desc: 'Full replacement — most popular' },
  { id: 'metal_roofing',       label: 'Metal Roof',           emoji: '🔩', desc: 'Standing seam, corrugated, ribbed' },
  { id: 'tile_roofing',        label: 'Tile Roof',            emoji: '🎨', desc: 'Clay, concrete, or slate tile' },
  { id: 'flat_roof',           label: 'Flat / TPO Roof',      emoji: '🟧', desc: 'TPO, EPDM, modified bitumen' },
  { id: 'roof_repair',         label: 'Roof Repair',          emoji: '🔧', desc: 'Patch leaks, shingles, flashing' },
  { id: 'roof_inspection',     label: 'Roof Inspection',      emoji: '🔍', desc: 'Pre-purchase or annual checkup' },
  { id: 'gutter_replacement',  label: 'Gutter Installation',  emoji: '💧', desc: 'New gutters + guards' },
];

export default function ServiceSelect({ onSelect, primaryColor = '#ea580c', companyName = null }) {
  const [hovered, setHovered] = React.useState(null);
  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', marginBottom: 4, letterSpacing: '-0.3px' }}>
        {companyName ? `Get a Quote from ${companyName}` : 'What do you need estimated?'}
      </h2>
      <p style={{ color: '#64748b', fontSize: 13.5, marginBottom: 22 }}>Select a service to get your instant estimate.</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {SERVICES.map(({ id, label, emoji, desc }) => (
          <button
            key={id}
            onClick={() => onSelect(id)}
            onMouseEnter={() => setHovered(id)}
            onMouseLeave={() => setHovered(null)}
            style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '14px 18px', borderRadius: 10, cursor: 'pointer',
              border: `1.5px solid ${hovered === id ? primaryColor : '#e2e8f0'}`,
              background: hovered === id ? `${primaryColor}08` : 'white',
              textAlign: 'left', width: '100%', transition: 'all 0.15s',
            }}
          >
            <span style={{ fontSize: 22, flexShrink: 0 }}>{emoji}</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, color: '#0f172a' }}>{label}</div>
              <div style={{ fontSize: 12.5, color: '#64748b', marginTop: 1 }}>{desc}</div>
            </div>
            <span style={{ marginLeft: 'auto', color: hovered === id ? primaryColor : '#cbd5e1', fontSize: 18, fontWeight: 300 }}>›</span>
          </button>
        ))}
      </div>
    </div>
  );
}
