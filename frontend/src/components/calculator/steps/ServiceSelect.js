import React from 'react';
import { Home, Layers, LayoutGrid, Square, Wrench, ScanSearch, Droplets } from 'lucide-react';

const SERVICES = [
  { id: 'shingle_replacement', label: 'Asphalt Shingle', Icon: Home,        desc: 'Full replacement — most popular' },
  { id: 'metal_roofing',       label: 'Metal Roof',      Icon: Layers,      desc: 'Standing seam, corrugated' },
  { id: 'tile_roofing',        label: 'Tile Roof',       Icon: LayoutGrid,  desc: 'Clay, concrete, or slate' },
  { id: 'flat_roof',           label: 'Flat / TPO',      Icon: Square,      desc: 'TPO, EPDM, bitumen' },
  { id: 'roof_repair',         label: 'Roof Repair',     Icon: Wrench,      desc: 'Leaks, shingles, flashing' },
  { id: 'roof_inspection',     label: 'Inspection',      Icon: ScanSearch,  desc: 'Pre-purchase or annual' },
  { id: 'gutter_replacement',  label: 'Gutters',         Icon: Droplets,    desc: 'New gutters + guards' },
];

export default function ServiceSelect({ onSelect, primaryColor = '#ea580c', companyName = null, companyConfig = null }) {
  const [hovered, setHovered] = React.useState(null);
  const enabled = companyConfig?.enabledServices;
  const visible = enabled ? SERVICES.filter(s => enabled.includes(s.id)) : SERVICES;

  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', marginBottom: 4, letterSpacing: '-0.3px' }}>
        {companyName ? `Get a Quote from ${companyName}` : 'What do you need estimated?'}
      </h2>
      <p style={{ color: '#64748b', fontSize: 13.5, marginBottom: 18 }}>Tap a service to get your free, instant estimate.</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
        {visible.map(({ id, label, Icon, desc }) => (
          <button
            key={id}
            onClick={() => onSelect(id)}
            onMouseEnter={() => setHovered(id)}
            onMouseLeave={() => setHovered(null)}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
              padding: '16px 10px 14px', borderRadius: 12, cursor: 'pointer',
              border: `1.5px solid ${hovered === id ? primaryColor : '#e2e8f0'}`,
              background: hovered === id ? `${primaryColor}08` : 'white',
              transition: 'all 0.15s', gap: 8,
            }}
          >
            <div style={{
              width: 44, height: 44, borderRadius: 12, flexShrink: 0,
              background: hovered === id ? `${primaryColor}12` : '#f8fafc',
              border: `1.5px solid ${hovered === id ? primaryColor + '35' : '#e2e8f0'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.15s',
            }}>
              <Icon size={20} color={hovered === id ? primaryColor : '#64748b'} strokeWidth={1.75} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 13, color: '#0f172a', lineHeight: 1.3 }}>{label}</div>
              <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2, lineHeight: 1.4 }}>{desc}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
