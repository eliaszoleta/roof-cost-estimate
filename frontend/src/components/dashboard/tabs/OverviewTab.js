import React from 'react';
import { Users, TrendingUp, Eye, CheckCircle, ArrowRight, ArrowUpRight } from 'lucide-react';
import { url } from '../../../utils/routes';
import { serviceTypeLabel } from '../../../utils/formatters';

const STATUS_COLORS = {
  new:       { bg: '#eff6ff', text: '#1d4ed8', dot: '#3b82f6' },
  contacted: { bg: '#fefce8', text: '#854d0e', dot: '#eab308' },
  booked:    { bg: '#f0fdf4', text: '#166534', dot: '#22c55e' },
  closed:    { bg: '#f8fafc', text: '#64748b', dot: '#94a3b8' },
};

export default function OverviewTab({ leads, onTabChange }) {
  const thisMonth = leads.filter(l => {
    const d = new Date(l.createdAt);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const newLeads = leads.filter(l => l.status === 'new');
  const booked   = leads.filter(l => l.status === 'booked');
  const convRate = leads.length ? Math.round((booked.length / leads.length) * 100) : 0;

  const stats = [
    { label: 'Total Leads',    value: leads.length,       Icon: Users,       color: '#3b82f6', bg: '#eff6ff' },
    { label: 'This Month',     value: thisMonth.length,   Icon: TrendingUp,  color: '#8b5cf6', bg: '#f5f3ff' },
    { label: 'New (unread)',   value: newLeads.length,    Icon: Eye,         color: '#f59e0b', bg: '#fffbeb' },
    { label: 'Booked / Won',   value: booked.length,      Icon: CheckCircle, color: '#10b981', bg: '#ecfdf5' },
  ];

  const recent = [...leads].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>Overview</h2>
        <p style={{ fontSize: 14, color: '#64748b' }}>Your dashboard at a glance.</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 16, marginBottom: 32 }}>
        {stats.map(({ label, value, Icon, color, bg }) => (
          <div key={label} style={{ background: 'white', borderRadius: 14, border: '1px solid #e2e8f0', padding: '20px 22px', display: 'flex', gap: 14, alignItems: 'center' }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon size={20} color={color} strokeWidth={2} />
            </div>
            <div>
              <div style={{ fontSize: 26, fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>{value}</div>
              <div style={{ fontSize: 12.5, color: '#64748b', marginTop: 3 }}>{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Conversion */}
      <div style={{ background: 'white', borderRadius: 14, border: '1px solid #e2e8f0', padding: '22px 24px', marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: '#0f172a' }}>Conversion Rate</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: convRate >= 20 ? '#10b981' : '#f59e0b' }}>{convRate}%</div>
        </div>
        <div style={{ background: '#f1f5f9', borderRadius: 99, height: 8, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${convRate}%`, background: convRate >= 20 ? '#10b981' : '#f59e0b', borderRadius: 99, transition: 'width 0.6s ease' }} />
        </div>
        <div style={{ fontSize: 12.5, color: '#94a3b8', marginTop: 8 }}>{booked.length} booked out of {leads.length} total leads</div>
      </div>

      {/* Recent Leads */}
      <div style={{ background: 'white', borderRadius: 14, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <div style={{ padding: '18px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: '#0f172a' }}>Recent Leads</div>
          <button onClick={() => onTabChange('leads')}
            style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'none', border: 'none', color: '#ea580c', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
            View all <ArrowRight size={14} />
          </button>
        </div>
        {recent.length === 0 ? (
          <div style={{ padding: '40px 24px', textAlign: 'center', color: '#94a3b8', fontSize: 14 }}>
            No leads yet. Embed your calculator to start capturing leads.
          </div>
        ) : (
          recent.map((lead, i) => {
            const s = STATUS_COLORS[lead.status] || STATUS_COLORS.new;
            return (
              <div key={lead.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 24px', borderBottom: i < recent.length - 1 ? '1px solid #f8fafc' : 'none' }}>
                <div style={{ width: 36, height: 36, borderRadius: 99, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, color: '#475569', flexShrink: 0 }}>
                  {lead.name.charAt(0)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{lead.name}</div>
                  <div style={{ fontSize: 12.5, color: '#64748b' }}>{serviceTypeLabel(lead.service)} · {lead.state}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: s.bg, border: `1px solid ${s.dot}30`, borderRadius: 99, padding: '3px 10px', flexShrink: 0 }}>
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
