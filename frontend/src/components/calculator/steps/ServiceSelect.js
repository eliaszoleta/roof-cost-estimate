import React from 'react';
import { Home, Layers, LayoutGrid, Square, Wrench, ScanSearch, Droplets } from 'lucide-react';

const SERVICES = [
  { id: 'shingle_replacement', label: 'Asphalt Shingle Roof', Icon: Home,        desc: 'Full replacement — most popular' },
  { id: 'metal_roofing',       label: 'Metal Roof',           Icon: Layers,      desc: 'Standing seam, corrugated, ribbed' },
  { id: 'tile_roofing',        label: 'Tile Roof',            Icon: LayoutGrid,  desc: 'Clay, concrete, or slate tile' },
  { id: 'flat_roof',           label: 'Flat / TPO Roof',      Icon: Square,      desc: 'TPO, EPDM, modified bitumen' },
  { id: 'roof_repair',         label: 'Roof Repair',          Icon: Wrench,      desc: 'Patch leaks, shingles, flashing' },
  { id: 'roof_inspection',     label: 'Roof Inspection',      Icon: ScanSearch,  desc: 'Pre-purchase or annual checkup' },
  { id: 'gutter_replacement',  label: 'Gutter Installation',  Icon: Droplets,    desc: 'New gutters + guards' },
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
        {SERVICES.map(({ id, label, Icon, desc }) => (
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
            <div style={{
              width: 42, height: 42, borderRadius: 10, flexShrink: 0,
              background: hovered === id ? `${primaryColor}12` : '#f8fafc',
              border: `1px solid ${hovered === id ? primaryColor + '30' : '#e2e8f0'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.15s',
            }}>
              <Icon size={19} color={hovered === id ? primaryColor : '#64748b'} strokeWidth={1.75} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: '#0f172a' }}>{label}</div>
              <div style={{ fontSize: 12.5, color: '#64748b', marginTop: 1 }}>{desc}</div>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={hovered === id ? primaryColor : '#cbd5e1'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
}
