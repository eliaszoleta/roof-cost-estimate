import React from 'react';
import { Users, Calendar, DollarSign, Globe, Palette, Code2, ArrowRight } from 'lucide-react';
import { serviceTypeLabel } from '../../../utils/formatters';

const STATUS_COLORS = {
  new:       { bg: '#eff6ff', text: '#1d4ed8', dot: '#3b82f6' },
  contacted: { bg: '#fefce8', text: '#854d0e', dot: '#eab308' },
  booked:    { bg: '#f0fdf4', text: '#166534', dot: '#22c55e' },
  closed:    { bg: '#f8fafc', text: '#64748b', dot: '#94a3b8' },
};

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function OverviewTab({ leads, onTabChange }) {
  const thisMonth = leads.filter(l => {
    const d = new Date(l.createdAt), now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  const avgEstimate = leads.length
    ? Math.round(leads.reduce((s, l) => s + (l.estimateLow + l.estimateHigh) / 2, 0) / leads.length)
    : null;

  const stats = [
    {
      label: 'TOTAL LEADS', Icon: Users, color: '#2563eb',
      value: <span style={{ fontSize: 32, fontWeight: 800, color: '#2563eb' }}>{leads.length}</span>,
    },
    {
      label: 'THIS MONTH', Icon: Calendar, color: '#16a34a',
      value: <span style={{ fontSize: 32, fontWeight: 800, color: '#16a34a' }}>{thisMonth.length}</span>,
    },
    {
      label: 'AVG ESTIMATE', Icon: DollarSign, color: '#f59e0b',
      value: avgEstimate
        ? <span style={{ fontSize: 28, fontWeight: 800, color: '#0f172a' }}>${avgEstimate.toLocaleString()}</span>
        : <span style={{ fontSize: 28, fontWeight: 800, color: '#cbd5e1' }}>—</span>,
    },
    {
      label: 'WIDGET STATUS', Icon: Globe, color: '#22c55e',
      value: <span style={{ fontSize: 26, fontWeight: 800, color: '#16a34a' }}>Active</span>,
    },
  ];

  const recent = [...leads].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', marginBottom: 2 }}>Dashboard Overview</h2>
        <p style={{ fontSize: 14, color: '#64748b' }}>Welcome back.</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginBottom: 20 }}>
        {stats.map(({ label, Icon, color, value }) => (
          <div key={label} style={{ background: 'white', borderRadius: 12, border: '1px solid #e2e8f0', padding: '20px 22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.08em' }}>{label}</div>
              <Icon size={18} color={color} strokeWidth={1.75} />
            </div>
            {value}
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={{ background: 'white', borderRadius: 12, border: '1px solid #e2e8f0', padding: '18px 22px', marginBottom: 20 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>Quick Actions</div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {[
            [Palette, 'Customize Branding', 'branding'],
            [Code2, 'Get Embed Code', 'embed'],
            [Users, 'View All Leads', 'leads'],
            [DollarSign, 'Manage Billing', 'subscription'],
          ].map(([Icon, label, tab]) => (
            <button key={label} onClick={() => onTabChange(tab)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '8px 14px', borderRadius: 8, border: '1.5px solid #e2e8f0', background: 'white', cursor: 'pointer', fontSize: 13.5, fontWeight: 500, color: '#374151', transition: 'all 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#6366f1'; e.currentTarget.style.color = '#4f46e5'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#374151'; }}
            >
              <Icon size={14} /> {label}
            </button>
          ))}
        </div>
      </div>

      {/* Recent Leads */}
      <div style={{ background: 'white', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <div style={{ padding: '16px 22px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: '#0f172a' }}>Recent Leads</div>
          <button onClick={() => onTabChange('leads')}
            style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'none', border: 'none', color: '#2563eb', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
            View all <ArrowRight size={13} />
          </button>
        </div>

        {recent.length === 0 ? (
          <div style={{ padding: '52px 24px', textAlign: 'center' }}>
            <div style={{ width: 52, height: 52, borderRadius: 99, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
              <Users size={24} color="#cbd5e1" />
            </div>
            <div style={{ fontWeight: 600, fontSize: 15, color: '#374151', marginBottom: 6 }}>No leads yet</div>
            <div style={{ fontSize: 13.5, color: '#94a3b8' }}>Embed your calculator on your website to start capturing leads automatically.</div>
          </div>
        ) : (
          recent.map((lead, i) => {
            const s = STATUS_COLORS[lead.status] || STATUS_COLORS.new;
            return (
              <div key={lead.id} onClick={() => onTabChange('leads')}
                style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '13px 22px', borderBottom: i < recent.length - 1 ? '1px solid #f8fafc' : 'none', cursor: 'pointer' }}
                onMouseEnter={e => e.currentTarget.style.background = '#fafafa'}
                onMouseLeave={e => e.currentTarget.style.background = 'white'}
              >
                <div style={{ width: 36, height: 36, borderRadius: 99, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, color: '#475569', flexShrink: 0 }}>
                  {lead.name.charAt(0)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: '#0f172a' }}>{lead.name}</div>
                  <div style={{ fontSize: 12.5, color: '#94a3b8' }}>{serviceTypeLabel(lead.service)} · {lead.state}</div>
                </div>
                <div style={{ fontSize: 12, color: '#94a3b8', marginRight: 10 }}>{formatDate(lead.createdAt)}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: s.bg, borderRadius: 99, padding: '3px 10px' }}>
                  <div style={{ width: 6, height: 6, borderRadius: 99, background: s.dot }} />
                  <span style={{ fontSize: 12, fontWeight: 600, color: s.text, textTransform: 'capitalize' }}>{lead.status}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
