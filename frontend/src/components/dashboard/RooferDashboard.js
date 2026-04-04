import React, { useState, useEffect } from 'react';
import { BarChart3, Users, Palette, Layers, Code2, CreditCard, LogOut, Menu, X, ChevronRight } from 'lucide-react';
import { url } from '../../utils/routes';
import OverviewTab from './tabs/OverviewTab';
import LeadsTab from './tabs/LeadsTab';
import BrandingTab from './tabs/BrandingTab';
import ServicesTab from './tabs/ServicesTab';
import EmbedTab from './tabs/EmbedTab';
import SubscriptionTab from './tabs/SubscriptionTab';

const NAV = [
  { id: 'overview',      label: 'Overview',     Icon: BarChart3  },
  { id: 'leads',         label: 'Leads',        Icon: Users      },
  { id: 'branding',      label: 'Branding',     Icon: Palette    },
  { id: 'services',      label: 'Services',     Icon: Layers     },
  { id: 'embed',         label: 'Embed',        Icon: Code2      },
  { id: 'subscription',  label: 'Subscription', Icon: CreditCard },
];

const MOCK_LEADS = [
  { id: '1', name: 'Michael Torres',  email: 'm.torres@email.com',   phone: '(555) 234-5678', service: 'shingle_replacement', zip: '77001', state: 'TX', estimateLow: 8200,  estimateHigh: 11400, timeline: 'within_3_months', status: 'new',       createdAt: '2026-04-02T14:23:00Z' },
  { id: '2', name: 'Sarah Johnson',   email: 'sarah.j@email.com',    phone: '(555) 876-5432', service: 'metal_roofing',       zip: '30301', state: 'GA', estimateLow: 18500, estimateHigh: 24200, timeline: 'within_month',   status: 'contacted', createdAt: '2026-04-01T09:11:00Z' },
  { id: '3', name: 'David Kim',       email: 'dkim@email.com',       phone: '(555) 345-6789', service: 'roof_repair',         zip: '90001', state: 'CA', estimateLow: 950,   estimateHigh: 1800,  timeline: 'asap',           status: 'booked',    createdAt: '2026-03-30T16:45:00Z' },
  { id: '4', name: 'Lisa Martinez',   email: 'lisa.m@gmail.com',     phone: '(555) 567-8901', service: 'gutter_replacement',  zip: '60601', state: 'IL', estimateLow: 1200,  estimateHigh: 2100,  timeline: 'within_3_months', status: 'new',      createdAt: '2026-03-29T11:02:00Z' },
  { id: '5', name: 'Robert Chen',     email: 'rchen@email.com',      phone: '(555) 789-0123', service: 'tile_roofing',        zip: '33101', state: 'FL', estimateLow: 14800, estimateHigh: 21000, timeline: 'within_6_months', status: 'new',      createdAt: '2026-03-28T08:30:00Z' },
  { id: '6', name: 'Amanda Wright',   email: 'a.wright@email.com',   phone: '(555) 321-0987', service: 'roof_inspection',     zip: '98101', state: 'WA', estimateLow: 350,   estimateHigh: 550,   timeline: 'within_month',   status: 'contacted', createdAt: '2026-03-26T10:18:00Z' },
  { id: '7', name: 'James Okafor',    email: 'jokafor@email.com',    phone: '(555) 654-3210', service: 'flat_roof',           zip: '10001', state: 'NY', estimateLow: 9800,  estimateHigh: 14500, timeline: 'within_3_months', status: 'closed',   createdAt: '2026-03-24T15:33:00Z' },
];

function loadLeads() {
  try {
    const stored = JSON.parse(localStorage.getItem('rc_leads'));
    if (stored && stored.length > 0) return stored;
  } catch {}
  localStorage.setItem('rc_leads', JSON.stringify(MOCK_LEADS));
  return MOCK_LEADS;
}

export default function RooferDashboard({ session, onLogout }) {
  const [tab, setTab] = useState('overview');
  const [leads, setLeads] = useState(loadLeads);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 900);

  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 900);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);

  const companyName = (() => { try { return JSON.parse(localStorage.getItem('rc_branding'))?.companyName || session.name; } catch { return session.name; } })();
  const newLeadsCount = leads.filter(l => l.status === 'new').length;

  const handleLogout = () => {
    localStorage.removeItem('rc_session');
    onLogout();
  };

  const handleTabChange = (t) => {
    setTab(t);
    setSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const Sidebar = () => (
    <aside style={{
      width: 240, flexShrink: 0, background: '#0f172a',
      display: 'flex', flexDirection: 'column',
      ...(isMobile ? {
        position: 'fixed', inset: '0 auto 0 0', zIndex: 300,
        transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.25s cubic-bezier(0.4,0,0.2,1)',
        boxShadow: sidebarOpen ? '8px 0 40px rgba(0,0,0,0.3)' : 'none',
      } : { position: 'sticky', top: 0, height: '100vh' }),
    }}>
      {/* Logo */}
      <div style={{ padding: '22px 20px 18px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <a href={url('/')} style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg, #ea580c, #c2410c)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 2px 10px rgba(234,88,12,0.4)' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M3 11.5L12 3L21 11.5V21H15.5V15H8.5V21H3V11.5Z"/></svg>
          </div>
          <span style={{ fontWeight: 800, fontSize: 17, color: 'white' }}>RoofCalc</span>
        </a>
        <div style={{ fontSize: 11.5, color: '#475569', marginTop: 6, marginLeft: 42 }}>Contractor Portal</div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 10px', overflowY: 'auto' }}>
        {NAV.map(({ id, label, Icon }) => {
          const active = tab === id;
          const badge = id === 'leads' && newLeadsCount > 0 ? newLeadsCount : null;
          return (
            <button key={id} onClick={() => handleTabChange(id)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 11, padding: '10px 12px',
                borderRadius: 9, border: 'none', cursor: 'pointer', marginBottom: 2, textAlign: 'left',
                background: active ? 'rgba(234,88,12,0.15)' : 'transparent',
                borderLeft: active ? '3px solid #ea580c' : '3px solid transparent',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
            >
              <Icon size={17} color={active ? '#fb923c' : '#64748b'} strokeWidth={active ? 2.5 : 2} />
              <span style={{ fontSize: 14, fontWeight: active ? 700 : 500, color: active ? '#fb923c' : '#94a3b8', flex: 1 }}>{label}</span>
              {badge && (
                <span style={{ background: '#ea580c', color: 'white', fontSize: 11, fontWeight: 700, borderRadius: 99, minWidth: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 6px' }}>{badge}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* User + logout */}
      <div style={{ padding: '14px 10px 20px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', marginBottom: 4 }}>
          <div style={{ width: 32, height: 32, borderRadius: 99, background: 'linear-gradient(135deg, #ea580c, #c2410c)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, color: 'white', flexShrink: 0 }}>
            {(companyName || 'U').charAt(0).toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{companyName}</div>
            <div style={{ fontSize: 11.5, color: '#475569', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{session.email}</div>
          </div>
        </div>
        <button onClick={handleLogout}
          style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 9, border: 'none', background: 'transparent', cursor: 'pointer', transition: 'background 0.15s' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
        >
          <LogOut size={16} color="#64748b" />
          <span style={{ fontSize: 13.5, color: '#64748b', fontWeight: 500 }}>Sign Out</span>
        </button>
      </div>
    </aside>
  );

  const activeNav = NAV.find(n => n.id === tab);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc', fontFamily: 'inherit' }}>
      {/* Sidebar */}
      {!isMobile && <Sidebar />}
      {isMobile && sidebarOpen && (
        <>
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 299 }} onClick={() => setSidebarOpen(false)} />
          <Sidebar />
        </>
      )}

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top bar */}
        <header style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {isMobile && (
              <button onClick={() => setSidebarOpen(o => !o)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: '#374151' }}>
                <Menu size={22} />
              </button>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#64748b' }}>
              <span>Dashboard</span>
              <ChevronRight size={13} />
              <span style={{ fontWeight: 600, color: '#0f172a' }}>{activeNav?.label}</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {newLeadsCount > 0 && (
              <button onClick={() => handleTabChange('leads')} style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#ea580c' }}>
                <span style={{ width: 7, height: 7, borderRadius: 99, background: '#ea580c', display: 'inline-block' }} />
                {newLeadsCount} new lead{newLeadsCount > 1 ? 's' : ''}
              </button>
            )}
          </div>
        </header>

        {/* Tab content */}
        <main style={{ flex: 1, padding: isMobile ? '24px 16px' : '32px 32px', maxWidth: 1000 }}>
          {tab === 'overview'     && <OverviewTab leads={leads} onTabChange={handleTabChange} />}
          {tab === 'leads'        && <LeadsTab leads={leads} setLeads={setLeads} />}
          {tab === 'branding'     && <BrandingTab />}
          {tab === 'services'     && <ServicesTab />}
          {tab === 'embed'        && <EmbedTab companyId={session.email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '')} />}
          {tab === 'subscription' && <SubscriptionTab session={session} />}
        </main>
      </div>
    </div>
  );
}
