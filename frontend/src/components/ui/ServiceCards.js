import React from 'react';
import { Home, Layers, LayoutGrid, Square, Wrench, ScanSearch, Droplets } from 'lucide-react';
import { getAllServices, typicalCost } from '../../data/services';
import { url } from '../../utils/routes';

const ICONS = {
  shingle_replacement: Home,
  metal_roofing: Layers,
  tile_roofing: LayoutGrid,
  flat_roof: Square,
  roof_repair: Wrench,
  roof_inspection: ScanSearch,
  gutter_replacement: Droplets,
};

function formatPrice(n) {
  return `$${Math.round(n).toLocaleString('en-US')}`;
}

export default function ServiceCards() {
  const services = getAllServices();

  return (
    <section id="services" style={{ background: '#f8fafc', borderTop: '1px solid #e2e8f0', padding: '56px 24px 64px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <h2 style={{ fontSize: 'clamp(22px, 4vw, 30px)', fontWeight: 800, color: '#0f172a', marginBottom: 8, textAlign: 'center' }}>
          Roofing Cost Calculator — Every Service, Every State
        </h2>
        <p style={{ color: '#64748b', textAlign: 'center', fontSize: 15, marginBottom: 40, maxWidth: 620, marginLeft: 'auto', marginRight: 'auto' }}>
          RoofingCal covers 7 roofing services with ZIP-code specific pricing across all 50 states. Select a service below for a full cost breakdown.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
          {services.map(service => {
            const Icon = ICONS[service.id] || Home;
            const cost = typicalCost(service);
            return (
              <a key={service.id} href={url(`/roofing-services/${service.slug}`)} style={{ textDecoration: 'none' }}>
                <div
                  style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 14, padding: '22px 22px 20px', height: '100%', boxSizing: 'border-box', transition: 'box-shadow 0.15s, border-color 0.15s' }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.08)'; e.currentTarget.style.borderColor = '#fdba74'; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
                >
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: '#fff7ed', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                    <Icon size={20} color="#ea580c" strokeWidth={1.75} />
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 15.5, color: '#0f172a', marginBottom: 4 }}>{service.name}</div>
                  <div style={{ fontWeight: 800, fontSize: 20, color: '#ea580c', marginBottom: 6 }}>
                    {formatPrice(cost.low)} – {formatPrice(cost.high)}
                  </div>
                  <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 12 }}>
                    {service.unitType === 'flat' ? 'typical job' : service.unitType === 'per_lf' ? `for ${service.typicalQuantity} linear ft` : `for ${service.typicalQuantity.toLocaleString()} sq ft roof`}
                  </div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {service.bullets.slice(0, 2).map((b, i) => (
                      <li key={i} style={{ display: 'flex', gap: 6, fontSize: 12.5, color: '#475569', lineHeight: 1.5, marginBottom: 5 }}>
                        <span style={{ color: '#16a34a', flexShrink: 0 }}>✓</span>{b}
                      </li>
                    ))}
                  </ul>
                  <span style={{ display: 'inline-block', marginTop: 10, fontSize: 13, fontWeight: 700, color: '#ea580c' }}>See full pricing →</span>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
