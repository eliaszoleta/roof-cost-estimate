import React, { useState, useEffect } from 'react';
import {
  BarChart3, Users, Palette, Layers, Code2, CreditCard,
  Settings, ListChecks, LogOut, Menu, ChevronRight, Save,
} from 'lucide-react';
import { url } from '../../utils/routes';
import OverviewTab      from './tabs/OverviewTab';
import LeadsTab         from './tabs/LeadsTab';
import BrandingTab      from './tabs/BrandingTab';
import ServicesTab      from './tabs/ServicesTab';
import EmbedTab         from './tabs/EmbedTab';
import SubscriptionTab  from './tabs/SubscriptionTab';
import CustomStepsTab   from './tabs/CustomStepsTab';
import SettingsTab      from './tabs/SettingsTab';

const NAV = [
  { id: 'overview',     label: 'Overview',      Icon: BarChart3  },
  { id: 'branding',     label: 'Branding',       Icon: Palette    },
  { id: 'services',     label: 'Services',       Icon: Layers     },
  { id: 'embed',        label: 'Embed Widget',   Icon: Code2      },
  { id: 'leads',        label: 'Leads',          Icon: Users      },
  { id: 'subscription', label: 'Subscription',   Icon: CreditCard },
  { id: 'custom-steps', label: 'Custom Steps',   Icon: ListChecks },
  { id: 'settings',     label: 'Settings',       Icon: Settings   },
];

const MOCK_LEADS = [
  { id: '1', name: 'Michael Torres',  email: 'm.torres@email.com',  phone: '(555) 234-5678', service: 'shingle_replacement', zip: '77001', state: 'TX', estimateLow: 8200,  estimateHigh: 11400, timeline: 'within_3_months',  status: 'new',       createdAt: '2026-04-02T14:23:00Z' },
  { id: '2', name: 'Sarah Johnson',   email: 'sarah.j@email.com',   phone: '(555) 876-5432', service: 'metal_roofing',       zip: '30301', state: 'GA', estimateLow: 18500, estimateHigh: 24200, timeline: 'within_month',     status: 'contacted', createdAt: '2026-04-01T09:11:00Z' },
  { id: '3', name: 'David Kim',       email: 'dkim@email.com',      phone: '(555) 345-6789', service: 'roof_repair',         zip: '90001', state: 'CA', estimateLow: 950,   estimateHigh: 1800,  timeline: 'asap',             status: 'booked',    createdAt: '2026-03-30T16:45:00Z' },
  { id: '4', name: 'Lisa Martinez',   email: 'lisa.m@gmail.com',    phone: '(555) 567-8901', service: 'gutter_replacement',  zip: '60601', state: 'IL', estimateLow: 1200,  estimateHigh: 2100,  timeline: 'within_3_months',  status: 'new',       createdAt: '2026-03-29T11:02:00Z' },
  { id: '5', name: 'Robert Chen',     email: 'rchen@email.com',     phone: '(555) 789-0123', service: 'tile_roofing',        zip: '33101', state: 'FL', estimateLow: 14800, estimateHigh: 21000, timeline: 'within_6_months',  status: 'new',       createdAt: '2026-03-28T08:30:00Z' },
  { id: '6', name: 'Amanda Wright',   email: 'a.wright@email.com',  phone: '(555) 321-0987', service: 'roof_inspection',     zip: '98101', state: 'WA', estimateLow: 350,   estimateHigh: 550,   timeline: 'within_month',     status: 'contacted', createdAt: '2026-03-26T10:18:00Z' },
  { id: '7', name: 'James Okafor',    email: 'jokafor@email.com',   phone: '(555) 654-3210', service: 'flat_roof',           zip: '10001', state: 'NY', estimateLow: 9800,  estimateHigh: 14500, timeline: 'within_3_months',  status: 'closed',    createdAt: '2026-03-24T15:33:00Z' },
];

function loadLeads() {
  try { const s = JSON.parse(localStorage.getItem('rc_leads')); if (s?.length) return s; } catch {}
  localStorage.setItem('rc_leads', JSON.stringify(MOCK_LEADS));
  return MOCK_LEADS;
}

function trialDaysLeft() {
  const joined = localStorage.getItem('rc_joined') || (() => { const d = new Date().toISOString(); localStorage.setItem('rc_joined', d); return d; })();
  const diff = Math.ceil((new Date(joined).getTime() + 14 * 86400000 - Date.now()) / 86400000);
  return Math.max(0, diff);
}

export default function RooferDashboard({ session, onLogout }) {
  const [tab, setTab]             = useState('overview');
  const [leads, setLeads]         = useState(loadLeads);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile]   = useState(() => window.innerWidth < 900);
  const [savePulse, setSavePulse] = useState(false);

  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 900);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);

  const companyName = (() => { try { return JSON.parse(localStorage.getItem('rc_branding'))?.companyName || session.name; } catch { return session.name; } })();
  const newLeadsCount = leads.filter(l => l.status === 'new').length;
  const daysLeft = trialDaysLeft();
  const companyId = (session.email || '').split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');

  const handleLogout = () => { localStorage.removeItem('rc_session'); onLogout(); };
  const handleTab = (t) => { setTab(t); setSidebarOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const handleSave = () => { setSavePulse(true); setTimeout(() => setSavePulse(false), 1800); };

  // ── Sidebar ──
  const Sidebar = () => (
    <aside style={{
      width: 200, flexShrink: 0, background: 'white', borderRight: '1px solid #e2e8f0',
      display: 'flex', flexDirection: 'column',
      ...(isMobile ? {
        position: 'fixed', inset: '0 auto 0 0', zIndex: 300,
        transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.25s cubic-bezier(0.4,0,0.2,1)',
        boxShadow: sidebarOpen ? '8px 0 32px rgba(0,0,0,0.12)' : 'none',
      } : { position: 'sticky', top: 52, height: 'calc(100vh - 52px)', overflowY: 'auto' }),
    }}>
      {/* Company name */}
      <div style={{ padding: '16px 18px 10px', fontSize: 12, color: '#94a3b8', fontWeight: 500, letterSpacing: '0.02em', borderBottom: '1px solid #f1f5f9' }}>
        {companyName}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '8px 10px' }}>
        <div style={{ fontSize: 10.5, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '10px 8px 6px' }}>Menu</div>
        {NAV.map(({ id, label, Icon }) => {
          const active = tab === id;
          const badge  = id === 'leads' && newLeadsCount > 0 ? newLeadsCount : null;
          return (
            <button key={id} onClick={() => handleTab(id)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 9, padding: '9px 10px',
                borderRadius: 8, border: 'none', cursor: 'pointer', marginBottom: 1, textAlign: 'left',
                background: active ? '#eff6ff' : 'transparent', transition: 'all 0.12s',
              }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.background = '#f8fafc'; }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
            >
              <Icon size={16} color={active ? '#2563eb' : '#64748b'} strokeWidth={active ? 2.5 : 2} />
              <span style={{ fontSize: 13.5, fontWeight: active ? 700 : 500, color: active ? '#1d4ed8' : '#374151', flex: 1 }}>{label}</span>
              {badge && <span style={{ background: '#2563eb', color: 'white', fontSize: 11, fontWeight: 700, borderRadius: 99, minWidth: 20, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 5px' }}>{badge}</span>}
            </button>
          );
        })}
      </nav>

      {/* Sign Out */}
      <div style={{ padding: '10px 10px 16px', borderTop: '1px solid #f1f5f9' }}>
        <button onClick={handleLogout}
          style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 9, padding: '9px 10px', borderRadius: 8, border: 'none', background: 'transparent', cursor: 'pointer', transition: 'background 0.12s' }}
          onMouseEnter={e => { e.currentTarget.style.background = '#fef2f2'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
        >
          <LogOut size={15} color="#ef4444" />
          <span style={{ fontSize: 13.5, color: '#ef4444', fontWeight: 500 }}>Sign Out</span>
        </button>
      </div>
    </aside>
  );

  const activeNav = NAV.find(n => n.id === tab);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#f1f5f9', fontFamily: 'inherit' }}>

      {/* ── Dark Top Bar ── */}
      <header style={{ background: '#0f172a', height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', position: 'sticky', top: 0, zIndex: 200, flexShrink: 0 }}>
        {/* Left: logo + breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {isMobile && (
            <button onClick={() => setSidebarOpen(o => !o)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 4 }}>
              <Menu size={20} />
            </button>
          )}
          <a href={url('/')} style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <div style={{ width: 28, height: 28, background: 'linear-gradient(135deg, #ea580c, #c2410c)', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M3 11.5L12 3L21 11.5V21H15.5V15H8.5V21H3V11.5Z"/></svg>
            </div>
            <span style={{ fontWeight: 800, fontSize: 15, color: 'white' }}>RoofCalc</span>
          </a>
          <span style={{ color: '#475569', fontSize: 14 }}>/</span>
          <span style={{ color: '#94a3b8', fontSize: 14 }}>Dashboard</span>
        </div>

        {/* Right: trial badge + save + email + sign out */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {daysLeft > 0 && (
            <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, padding: '4px 12px', fontSize: 12.5, fontWeight: 600, color: '#94a3b8' }}>
              Trial · {daysLeft}d left
            </div>
          )}
          <button onClick={handleSave}
            style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '7px 16px', borderRadius: 8, border: 'none', background: savePulse ? '#1d4ed8' : '#2563eb', color: 'white', cursor: 'pointer', fontWeight: 700, fontSize: 13.5, transition: 'background 0.2s' }}>
            <Save size={13} /> Save Changes
          </button>
          {!isMobile && <span style={{ fontSize: 13, color: '#64748b' }}>{session.email}</span>}
          <button onClick={handleLogout}
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', fontSize: 13, fontWeight: 500 }}>
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </header>

      {/* ── Body ── */}
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        {/* Sidebar */}
        {!isMobile && <Sidebar />}
        {isMobile && sidebarOpen && (
          <>
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 299 }} onClick={() => setSidebarOpen(false)} />
            <Sidebar />
          </>
        )}

        {/* Main */}
        <main style={{ flex: 1, padding: isMobile ? '24px 16px' : '28px 32px', maxWidth: 1100, minWidth: 0 }}>
          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#94a3b8', marginBottom: 20 }}>
            <span style={{ color: '#0f172a', fontWeight: 700, fontSize: 15 }}>{activeNav?.label}</span>
          </div>

          {tab === 'overview'     && <OverviewTab leads={leads} onTabChange={handleTab} />}
          {tab === 'leads'        && <LeadsTab leads={leads} setLeads={setLeads} />}
          {tab === 'branding'     && <BrandingTab />}
          {tab === 'services'     && <ServicesTab />}
          {tab === 'embed'        && <EmbedTab companyId={companyId} />}
          {tab === 'subscription' && <SubscriptionTab session={session} />}
          {tab === 'custom-steps' && <CustomStepsTab />}
          {tab === 'settings'     && <SettingsTab session={session} />}
        </main>
      </div>
    </div>
  );
}
