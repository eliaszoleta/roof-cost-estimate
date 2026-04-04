import React, { useState } from 'react';
import { Search, Filter, ChevronDown, Phone, Mail, MapPin, Calendar, X } from 'lucide-react';
import { serviceTypeLabel } from '../../../utils/formatters';

const STATUS_OPTIONS = ['new', 'contacted', 'booked', 'closed'];
const STATUS_COLORS = {
  new:       { bg: '#eff6ff', text: '#1d4ed8', dot: '#3b82f6' },
  contacted: { bg: '#fefce8', text: '#854d0e', dot: '#eab308' },
  booked:    { bg: '#f0fdf4', text: '#166534', dot: '#22c55e' },
  closed:    { bg: '#f8fafc', text: '#64748b', dot: '#94a3b8' },
};

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
function formatPrice(n) {
  return '$' + n.toLocaleString();
}

function LeadDrawer({ lead, onClose, onStatusChange }) {
  if (!lead) return null;
  const s = STATUS_COLORS[lead.status] || STATUS_COLORS.new;
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex' }}>
      <div style={{ flex: 1, background: 'rgba(0,0,0,0.4)' }} onClick={onClose} />
      <div style={{ width: '100%', maxWidth: 420, background: 'white', boxShadow: '-8px 0 40px rgba(0,0,0,0.12)', overflow: 'auto', padding: '28px 28px 40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a' }}>Lead Details</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 4 }}><X size={20} /></button>
        </div>

        {/* Avatar + name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
          <div style={{ width: 52, height: 52, borderRadius: 99, background: 'linear-gradient(135deg, #ea580c, #c2410c)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 20, color: 'white', flexShrink: 0 }}>
            {lead.name.charAt(0)}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 17, color: '#0f172a' }}>{lead.name}</div>
            <div style={{ fontSize: 13, color: '#64748b' }}>{formatDate(lead.createdAt)}</div>
          </div>
        </div>

        {/* Contact */}
        <div style={{ background: '#f8fafc', borderRadius: 12, padding: '16px 18px', marginBottom: 20 }}>
          {[
            [Mail, lead.email, `mailto:${lead.email}`],
            [Phone, lead.phone, `tel:${lead.phone}`],
            [MapPin, `${lead.zip} · ${lead.state}`, null],
          ].map(([Icon, val, href]) => val ? (
            <div key={val} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <Icon size={14} color="#94a3b8" style={{ flexShrink: 0 }} />
              {href
                ? <a href={href} style={{ fontSize: 14, color: '#ea580c', textDecoration: 'none', fontWeight: 500 }}>{val}</a>
                : <span style={{ fontSize: 14, color: '#374151' }}>{val}</span>
              }
            </div>
          ) : null)}
        </div>

        {/* Project */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 12 }}>Project</div>
          {[
            ['Service', serviceTypeLabel(lead.service)],
            ['Estimate', `${formatPrice(lead.estimateLow)} – ${formatPrice(lead.estimateHigh)}`],
            ['Timeline', lead.timeline?.replace(/_/g, ' ')],
          ].map(([label, val]) => val ? (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid #f1f5f9', fontSize: 14 }}>
              <span style={{ color: '#64748b' }}>{label}</span>
              <span style={{ fontWeight: 600, color: '#0f172a', textTransform: 'capitalize' }}>{val}</span>
            </div>
          ) : null)}
        </div>

        {/* Status */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 12 }}>Update Status</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {STATUS_OPTIONS.map(st => {
              const c = STATUS_COLORS[st];
              return (
                <button key={st} onClick={() => onStatusChange(lead.id, st)}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 9, border: `1.5px solid ${lead.status === st ? c.dot : '#e2e8f0'}`, background: lead.status === st ? c.bg : 'white', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s' }}>
                  <div style={{ width: 8, height: 8, borderRadius: 99, background: c.dot, flexShrink: 0 }} />
                  <span style={{ fontSize: 14, fontWeight: lead.status === st ? 700 : 500, color: lead.status === st ? c.text : '#374151', textTransform: 'capitalize' }}>{st}</span>
                  {lead.status === st && <span style={{ marginLeft: 'auto', fontSize: 12, color: c.text, fontWeight: 600 }}>Current</span>}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LeadsTab({ leads, setLeads }) {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selected, setSelected] = useState(null);

  const filtered = leads.filter(l => {
    const matchSearch = !search || l.name.toLowerCase().includes(search.toLowerCase()) || l.email.toLowerCase().includes(search.toLowerCase()) || l.service.includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || l.status === filterStatus;
    return matchSearch && matchStatus;
  }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const handleStatusChange = (id, status) => {
    const updated = leads.map(l => l.id === id ? { ...l, status } : l);
    setLeads(updated);
    localStorage.setItem('rc_leads', JSON.stringify(updated));
    setSelected(s => s?.id === id ? { ...s, status } : s);
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>Leads</h2>
        <p style={{ fontSize: 14, color: '#64748b' }}>{leads.length} total leads captured.</p>
      </div>

      {/* Search + filter */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <Search size={14} color="#94a3b8" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search leads…"
            style={{ width: '100%', padding: '9px 12px 9px 36px', borderRadius: 9, border: '1.5px solid #e2e8f0', fontSize: 14, color: '#0f172a', boxSizing: 'border-box', outline: 'none' }} />
        </div>
        <div style={{ position: 'relative' }}>
          <Filter size={13} color="#94a3b8" style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            style={{ appearance: 'none', padding: '9px 32px 9px 30px', borderRadius: 9, border: '1.5px solid #e2e8f0', fontSize: 14, color: '#374151', background: 'white', cursor: 'pointer', outline: 'none' }}>
            <option value="all">All statuses</option>
            {STATUS_OPTIONS.map(s => <option key={s} value={s} style={{ textTransform: 'capitalize' }}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>
          <ChevronDown size={13} color="#94a3b8" style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
        </div>
      </div>

      {/* Table */}
      <div style={{ background: 'white', borderRadius: 14, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        {filtered.length === 0 ? (
          <div style={{ padding: '48px 24px', textAlign: 'center', color: '#94a3b8', fontSize: 14 }}>
            {leads.length === 0 ? 'No leads yet. Embed your calculator to start capturing leads.' : 'No leads match your search.'}
          </div>
        ) : (
          filtered.map((lead, i) => {
            const s = STATUS_COLORS[lead.status] || STATUS_COLORS.new;
            return (
              <div key={lead.id} onClick={() => setSelected(lead)}
                style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 20px', borderBottom: i < filtered.length - 1 ? '1px solid #f8fafc' : 'none', cursor: 'pointer', transition: 'background 0.12s' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#fafafa'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'white'; }}
              >
                <div style={{ width: 38, height: 38, borderRadius: 99, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, color: '#475569', flexShrink: 0 }}>
                  {lead.name.charAt(0)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: '#0f172a' }}>{lead.name}</div>
                  <div style={{ fontSize: 12.5, color: '#94a3b8' }}>{lead.email}</div>
                </div>
                <div style={{ fontSize: 13, color: '#64748b', minWidth: 130, display: 'none' }} className="hide-mobile">{serviceTypeLabel(lead.service)}</div>
                <div style={{ fontSize: 12.5, color: '#94a3b8', minWidth: 90, textAlign: 'right', whiteSpace: 'nowrap' }}>{formatDate(lead.createdAt)}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: s.bg, borderRadius: 99, padding: '4px 10px', flexShrink: 0 }}>
                  <div style={{ width: 6, height: 6, borderRadius: 99, background: s.dot }} />
                  <span style={{ fontSize: 12, fontWeight: 600, color: s.text, textTransform: 'capitalize' }}>{lead.status}</span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {selected && <LeadDrawer lead={selected} onClose={() => setSelected(null)} onStatusChange={handleStatusChange} />}
    </div>
  );
}
