import React, { useState } from 'react';
import { Home, Layers, LayoutGrid, Square, Wrench, ScanSearch, Droplets, Save, Check } from 'lucide-react';

const ALL_SERVICES = [
  { id: 'shingle_replacement', label: 'Asphalt Shingle Roof', Icon: Home,       desc: 'Full replacement — most popular' },
  { id: 'metal_roofing',       label: 'Metal Roof',           Icon: Layers,     desc: 'Standing seam, corrugated, ribbed' },
  { id: 'tile_roofing',        label: 'Tile Roof',            Icon: LayoutGrid, desc: 'Clay, concrete, or slate tile' },
  { id: 'flat_roof',           label: 'Flat / TPO Roof',      Icon: Square,     desc: 'TPO, EPDM, modified bitumen' },
  { id: 'roof_repair',         label: 'Roof Repair',          Icon: Wrench,     desc: 'Patch leaks, shingles, flashing' },
  { id: 'roof_inspection',     label: 'Roof Inspection',      Icon: ScanSearch, desc: 'Pre-purchase or annual checkup' },
  { id: 'gutter_replacement',  label: 'Gutter Installation',  Icon: Droplets,   desc: 'New gutters + guards' },
];

export default function ServicesTab() {
  const stored = (() => { try { return JSON.parse(localStorage.getItem('rc_services')) || ALL_SERVICES.map(s => s.id); } catch { return ALL_SERVICES.map(s => s.id); } })();
  const [enabled, setEnabled] = useState(new Set(stored));
  const [saved, setSaved] = useState(false);

  const toggle = (id) => {
    setEnabled(prev => {
      const next = new Set(prev);
      if (next.has(id)) { if (next.size > 1) next.delete(id); }
      else next.add(id);
      return next;
    });
  };

  const save = () => {
    localStorage.setItem('rc_services', JSON.stringify([...enabled]));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>Services</h2>
          <p style={{ fontSize: 14, color: '#64748b' }}>Choose which services to offer in your embedded calculator.</p>
        </div>
        <button onClick={save}
          style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '10px 20px', borderRadius: 9, border: 'none', background: saved ? '#16a34a' : '#ea580c', color: 'white', cursor: 'pointer', fontWeight: 700, fontSize: 14, boxShadow: '0 2px 10px rgba(234,88,12,0.25)' }}>
          {saved ? <><Check size={14} /> Saved!</> : <><Save size={14} /> Save Changes</>}
        </button>
      </div>

      <div style={{ background: 'white', borderRadius: 14, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        {ALL_SERVICES.map(({ id, label, Icon, desc }, i) => {
          const on = enabled.has(id);
          return (
            <div key={id} onClick={() => toggle(id)}
              style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '18px 22px', borderBottom: i < ALL_SERVICES.length - 1 ? '1px solid #f8fafc' : 'none', cursor: 'pointer', transition: 'background 0.12s', background: on ? 'white' : '#fafafa' }}
              onMouseEnter={e => { e.currentTarget.style.background = on ? '#fafffe' : '#f5f5f5'; }}
              onMouseLeave={e => { e.currentTarget.style.background = on ? 'white' : '#fafafa'; }}
            >
              <div style={{ width: 44, height: 44, borderRadius: 12, background: on ? '#fff7ed' : '#f1f5f9', border: `1.5px solid ${on ? '#fed7aa' : '#e2e8f0'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.15s' }}>
                <Icon size={20} color={on ? '#ea580c' : '#94a3b8'} strokeWidth={1.75} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 15, color: on ? '#0f172a' : '#94a3b8', marginBottom: 2 }}>{label}</div>
                <div style={{ fontSize: 13, color: on ? '#64748b' : '#cbd5e1' }}>{desc}</div>
              </div>
              {/* Toggle */}
              <div style={{ width: 44, height: 24, borderRadius: 99, background: on ? '#ea580c' : '#e2e8f0', position: 'relative', flexShrink: 0, transition: 'background 0.2s' }}>
                <div style={{ position: 'absolute', top: 2, left: on ? 22 : 2, width: 20, height: 20, borderRadius: 99, background: 'white', boxShadow: '0 1px 4px rgba(0,0,0,0.2)', transition: 'left 0.2s' }} />
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 16, background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 10, padding: '12px 16px', fontSize: 13, color: '#78350f' }}>
        At least one service must be enabled. Changes take effect after saving.
      </div>
    </div>
  );
}
