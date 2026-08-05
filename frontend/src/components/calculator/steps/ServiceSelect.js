import React from 'react';
import { Home, Layers, LayoutGrid, Square, Wrench, ScanSearch, Droplets, Zap, ShieldOff, Clock } from 'lucide-react';

// Fixed thematic accent per service — decorative iconography, not brand identity, so it
// stays put regardless of which company's primaryColor this widget is embedded with.
const SERVICES = [
  { id: 'shingle_replacement', label: 'Asphalt Shingle', Icon: Home,        desc: 'Full replacement', accent: '#c2410c', popular: true },
  { id: 'metal_roofing',       label: 'Metal Roof',      Icon: Layers,      desc: 'Standing seam, corrugated', accent: '#475569' },
  { id: 'tile_roofing',        label: 'Tile Roof',       Icon: LayoutGrid,  desc: 'Clay, concrete, or slate', accent: '#b45309' },
  { id: 'flat_roof',           label: 'Flat / TPO',      Icon: Square,      desc: 'TPO, EPDM, bitumen', accent: '#0e7490' },
  { id: 'roof_repair',         label: 'Roof Repair',     Icon: Wrench,      desc: 'Leaks, shingles, flashing', accent: '#b91c1c' },
  { id: 'roof_inspection',     label: 'Inspection',      Icon: ScanSearch,  desc: 'Pre-purchase or annual', accent: '#6d28d9' },
  { id: 'gutter_replacement',  label: 'Gutters',         Icon: Droplets,    desc: 'New gutters + guards', accent: '#1d4ed8' },
];

const TRUST_ITEMS = [
  { Icon: Clock,     label: '60-second estimate' },
  { Icon: ShieldOff, label: 'No email required' },
  { Icon: Zap,       label: 'Instant results' },
];

export default function ServiceSelect({ onSelect, primaryColor = '#ea580c', companyName = null, companyConfig = null }) {
  const [hovered, setHovered] = React.useState(null);
  const [pressed, setPressed] = React.useState(null);
  const enabled = companyConfig?.enabledServices;
  const visible = enabled ? SERVICES.filter(s => enabled.includes(s.id)) : SERVICES;

  return (
    <div>
      <h2 style={{ fontSize: 21, fontWeight: 800, color: '#0f172a', marginBottom: 5, letterSpacing: '-0.3px' }}>
        {companyName ? `Get a Quote from ${companyName}` : 'What do you need estimated?'}
      </h2>
      <p style={{ color: '#64748b', fontSize: 13.5, marginBottom: 12 }}>Tap a service below to get your free, instant estimate.</p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 16px', marginBottom: 20 }}>
        {TRUST_ITEMS.map(({ Icon, label }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#64748b', fontWeight: 500 }}>
            <Icon size={13} color={primaryColor} strokeWidth={2} /> {label}
          </div>
        ))}
      </div>

      <div className="rc-svc-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
        {visible.map(({ id, label, Icon, desc, accent, popular }, i) => {
          const isHovered = hovered === id;
          return (
            <button
              key={id}
              className="rc-svc-card"
              onClick={() => onSelect(id)}
              onMouseEnter={() => setHovered(id)}
              onMouseLeave={() => setHovered(null)}
              onMouseDown={() => setPressed(id)}
              onMouseUp={() => setPressed(null)}
              style={{
                position: 'relative',
                display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
                padding: '18px 10px 15px', borderRadius: 13, cursor: 'pointer',
                border: `1.5px solid ${isHovered ? primaryColor : '#e7e9ec'}`,
                background: isHovered ? `${primaryColor}08` : 'white',
                boxShadow: isHovered ? '0 6px 16px rgba(15,23,42,0.08)' : '0 1px 2px rgba(15,23,42,0.03)',
                transform: pressed === id ? 'translateY(0) scale(0.98)' : isHovered ? 'translateY(-2px)' : 'translateY(0)',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease, background 0.15s ease',
                gap: 8,
                animation: 'rc-card-in 0.35s ease backwards',
                animationDelay: `${i * 40}ms`,
              }}
            >
              {popular && (
                <span style={{
                  position: 'absolute', top: -9, left: '50%', transform: 'translateX(-50%)',
                  background: primaryColor, color: 'white', fontSize: 9.5, fontWeight: 700,
                  letterSpacing: '0.03em', textTransform: 'uppercase',
                  padding: '2.5px 8px', borderRadius: 20, whiteSpace: 'nowrap',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                }}>
                  Most Popular
                </span>
              )}
              <div style={{
                width: 46, height: 46, borderRadius: 12, flexShrink: 0,
                background: `${accent}14`,
                border: `1.5px solid ${accent}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'transform 0.15s ease',
                transform: isHovered ? 'scale(1.06)' : 'scale(1)',
              }}>
                <Icon size={21} color={accent} strokeWidth={1.75} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 13, color: '#0f172a', lineHeight: 1.3 }}>{label}</div>
                <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2, lineHeight: 1.4 }}>{desc}</div>
              </div>
            </button>
          );
        })}
      </div>

      <style>{`
        @keyframes rc-card-in {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 480px) {
          .rc-svc-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 320px) {
          .rc-svc-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
