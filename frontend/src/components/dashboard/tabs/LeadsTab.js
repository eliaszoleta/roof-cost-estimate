import React, { useState } from 'react';
import { Search, RefreshCw, Download, Trash2, Mail, Phone, X, ChevronDown } from 'lucide-react';
import { serviceTypeLabel } from '../../../utils/formatters';

const STATUS_OPTIONS = ['new', 'contacted', 'booked', 'closed'];
const STATUS_COLORS = {
  new:       { bg: '#eff6ff', text: '#1d4ed8', dot: '#3b82f6' },
  contacted: { bg: '#fefce8', text: '#854d0e', dot: '#eab308' },
  booked:    { bg: '#f0fdf4', text: '#166534', dot: '#22c55e' },
  closed:    { bg: '#f8fafc', text: '#64748b', dot: '#94a3b8' },
};

function fmt(iso) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: '2-digit' });
}
function fmtPrice(n) { return '$' + n.toLocaleString(); }

function exportCSV(leads) {
  const headers = ['Name', 'Email', 'Phone', 'Location', 'Service', 'Est Low', 'Est High', 'Timeline', 'Status', 'Date'];
  const rows = leads.map(l => [
    l.name, l.email, l.phone, `${l.zip} ${l.state}`,
    serviceTypeLabel(l.service), fmtPrice(l.estimateLow), fmtPrice(l.estimateHigh),
    (l.timeline || '').replace(/_/g, ' '), l.status, fmt(l.createdAt),
  ]);
  const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n');
  const a = document.createElement('a'); a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
  a.download = 'roofcalc-leads.csv'; a.click();
}

export default function LeadsTab({ leads, setLeads }) {
  const [search, setSearch]           = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selected, setSelected]       = useState(null);
  const [checked, setChecked]         = useState(new Set());
  const [note, setNote]               = useState('');
  const [noteSaved, setNoteSaved]     = useState(false);

  const filtered = leads.filter(l => {
    const q = search.toLowerCase();
    const matchSearch = !q || l.name.toLowerCase().includes(q) || l.email.toLowerCase().includes(q) || (l.zip||'').includes(q);
    const matchStatus = filterStatus === 'all' || l.status === filterStatus;
    return matchSearch && matchStatus;
  }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const updateStatus = (id, status) => {
    const next = leads.map(l => l.id === id ? { ...l, status } : l);
    setLeads(next); localStorage.setItem('rc_leads', JSON.stringify(next));
    setSelected(s => s?.id === id ? { ...s, status } : s);
  };

  const deleteBulk = () => {
    if (!checked.size) return;
    if (!window.confirm(`Delete ${checked.size} lead(s)?`)) return;
    const next = leads.filter(l => !checked.has(l.id));
    setLeads(next); localStorage.setItem('rc_leads', JSON.stringify(next));
    if (selected && checked.has(selected.id)) setSelected(null);
    setChecked(new Set());
  };

  const saveNote = () => {
    setNoteSaved(true); setTimeout(() => setNoteSaved(false), 2000);
  };

  const toggleCheck = (id) => setChecked(prev => {
    const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next;
  });

  const allChecked = filtered.length > 0 && filtered.every(l => checked.has(l.id));
  const toggleAll = () => {
    if (allChecked) { const next = new Set(checked); filtered.forEach(l => next.delete(l.id)); setChecked(next); }
    else { const next = new Set(checked); filtered.forEach(l => next.add(l.id)); setChecked(next); }
  };

  return (
    <div style={{ display: 'flex', gap: 0, height: '100%', minHeight: 600 }}>
      {/* Left: Table */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Leads <span style={{ fontSize: 15, fontWeight: 600, color: '#64748b' }}>({leads.length})</span>
          </h2>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => window.location.reload()}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px', borderRadius: 8, border: '1.5px solid #e2e8f0', background: 'white', cursor: 'pointer', fontSize: 13, fontWeight: 500, color: '#374151' }}>
              <RefreshCw size={13} /> Refresh
            </button>
            <button onClick={() => exportCSV(leads)}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px', borderRadius: 8, border: '1.5px solid #e2e8f0', background: 'white', cursor: 'pointer', fontSize: 13, fontWeight: 500, color: '#374151' }}>
              <Download size={13} /> Export CSV
            </button>
            <button onClick={deleteBulk} disabled={!checked.size}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px', borderRadius: 8, border: `1.5px solid ${checked.size ? '#fecaca' : '#e2e8f0'}`, background: checked.size ? '#fef2f2' : 'white', cursor: checked.size ? 'pointer' : 'not-allowed', fontSize: 13, fontWeight: 500, color: checked.size ? '#dc2626' : '#94a3b8' }}>
              <Trash2 size={13} /> Trash
            </button>
          </div>
        </div>

        {/* Search + filter */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={13} color="#94a3b8" style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, email, ZIP…"
              style={{ width: '100%', padding: '8px 12px 8px 30px', borderRadius: 8, border: '1.5px solid #e2e8f0', fontSize: 13.5, color: '#0f172a', boxSizing: 'border-box', outline: 'none' }} />
          </div>
          <div style={{ position: 'relative' }}>
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
              style={{ appearance: 'none', padding: '8px 28px 8px 12px', borderRadius: 8, border: '1.5px solid #e2e8f0', fontSize: 13.5, color: '#374151', background: 'white', cursor: 'pointer', outline: 'none' }}>
              <option value="all">All statuses</option>
              {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
            </select>
            <ChevronDown size={12} color="#94a3b8" style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          </div>
        </div>

        {/* Table */}
        <div style={{ background: 'white', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                <th style={{ padding: '10px 12px', textAlign: 'left', width: 36 }}>
                  <input type="checkbox" checked={allChecked} onChange={toggleAll} style={{ cursor: 'pointer' }} />
                </th>
                {['NAME','EMAIL','PHONE','LOCATION','SERVICE','ESTIMATE','TIMELINE','DATE'].map(h => (
                  <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={9} style={{ padding: '40px 24px', textAlign: 'center', color: '#94a3b8', fontSize: 13.5 }}>
                  {leads.length === 0 ? 'No leads yet.' : 'No leads match your search.'}
                </td></tr>
              ) : filtered.map((lead, i) => {
                const s = STATUS_COLORS[lead.status] || STATUS_COLORS.new;
                const isSelected = selected?.id === lead.id;
                return (
                  <tr key={lead.id} onClick={() => { setSelected(isSelected ? null : lead); setNote(''); }}
                    style={{ borderBottom: i < filtered.length - 1 ? '1px solid #f8fafc' : 'none', background: isSelected ? '#f8faff' : 'white', cursor: 'pointer', transition: 'background 0.1s' }}
                    onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = '#fafafa'; }}
                    onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = 'white'; }}
                  >
                    <td style={{ padding: '11px 12px' }} onClick={e => e.stopPropagation()}>
                      <input type="checkbox" checked={checked.has(lead.id)} onChange={() => toggleCheck(lead.id)} style={{ cursor: 'pointer' }} />
                    </td>
                    <td style={{ padding: '11px 12px', fontWeight: 600, color: '#0f172a', whiteSpace: 'nowrap' }}>{lead.name}</td>
                    <td style={{ padding: '11px 12px', color: '#2563eb', whiteSpace: 'nowrap' }}>{lead.email}</td>
                    <td style={{ padding: '11px 12px', whiteSpace: 'nowrap', color: '#374151' }}>{lead.phone}</td>
                    <td style={{ padding: '11px 12px', color: '#374151' }}>{lead.state}</td>
                    <td style={{ padding: '11px 12px', color: '#374151', whiteSpace: 'nowrap', maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis' }}>{serviceTypeLabel(lead.service)}</td>
                    <td style={{ padding: '11px 12px', whiteSpace: 'nowrap', color: '#374151' }}>
                      <span style={{ color: '#16a34a', fontWeight: 600 }}>{fmtPrice(lead.estimateLow)}</span>
                      <span style={{ color: '#94a3b8' }}> – </span>
                      <span style={{ color: '#16a34a', fontWeight: 600 }}>{fmtPrice(lead.estimateHigh)}</span>
                    </td>
                    <td style={{ padding: '11px 12px', color: '#374151', whiteSpace: 'nowrap', textTransform: 'capitalize' }}>{(lead.timeline||'').replace(/_/g,' ')}</td>
                    <td style={{ padding: '11px 12px', color: '#94a3b8', whiteSpace: 'nowrap' }}>{fmt(lead.createdAt)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Right: Detail Panel */}
      {selected && (
        <div style={{ width: 300, flexShrink: 0, marginLeft: 20, background: 'white', border: '1px solid #e2e8f0', borderRadius: 14, overflow: 'hidden', alignSelf: 'flex-start', position: 'sticky', top: 0 }}>
          {/* Panel header */}
          <div style={{ padding: '16px 18px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 16, color: '#0f172a' }}>{selected.name}</div>
              <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>{fmt(selected.createdAt)}</div>
            </div>
            <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 2 }}><X size={16} /></button>
          </div>

          {/* Fields */}
          <div style={{ padding: '14px 18px' }}>
            {[
              ['Email',    selected.email,    `mailto:${selected.email}`],
              ['Phone',    selected.phone,    `tel:${selected.phone}`],
              ['Location', selected.state,    null],
              ['Service',  serviceTypeLabel(selected.service), null],
              ['Estimate', `${fmtPrice(selected.estimateLow)} – ${fmtPrice(selected.estimateHigh)}`, null],
              ['Timeline', (selected.timeline||'').replace(/_/g,' '), null],
            ].map(([label, val, href]) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid #f8fafc', fontSize: 13 }}>
                <span style={{ color: '#94a3b8', fontWeight: 500 }}>{label}</span>
                {href
                  ? <a href={href} style={{ color: '#ea580c', fontWeight: 600, textDecoration: 'none', textAlign: 'right', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{val}</a>
                  : <span style={{ fontWeight: 600, color: '#0f172a', textAlign: 'right', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textTransform: 'capitalize' }}>{val}</span>
                }
              </div>
            ))}

            {/* Status */}
            <div style={{ marginTop: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>Status</div>
              <div style={{ position: 'relative' }}>
                <select value={selected.status} onChange={e => updateStatus(selected.id, e.target.value)}
                  style={{ width: '100%', appearance: 'none', padding: '8px 28px 8px 10px', borderRadius: 8, border: '1.5px solid #e2e8f0', fontSize: 13.5, color: '#374151', background: 'white', cursor: 'pointer', outline: 'none' }}>
                  {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                </select>
                <ChevronDown size={12} color="#94a3b8" style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              </div>
            </div>

            {/* Internal Notes */}
            <div style={{ marginTop: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>Internal Notes</div>
              <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Add notes about this lead…"
                style={{ width: '100%', minHeight: 80, padding: '8px 10px', borderRadius: 8, border: '1.5px solid #e2e8f0', fontSize: 13, resize: 'vertical', boxSizing: 'border-box', outline: 'none', fontFamily: 'inherit', color: '#374151' }} />
              <button onClick={saveNote}
                style={{ marginTop: 8, padding: '8px 16px', borderRadius: 8, border: 'none', background: noteSaved ? '#16a34a' : '#ea580c', color: 'white', fontWeight: 700, fontSize: 13, cursor: 'pointer', width: '100%' }}>
                {noteSaved ? 'Saved!' : 'Save Note'}
              </button>
            </div>

            {/* Action buttons */}
            <div style={{ marginTop: 14, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <a href={`mailto:${selected.email}`}
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '9px 10px', borderRadius: 8, background: '#ea580c', color: 'white', textDecoration: 'none', fontWeight: 700, fontSize: 13 }}>
                <Mail size={13} /> Email
              </a>
              <a href={`tel:${selected.phone}`}
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '9px 10px', borderRadius: 8, background: '#16a34a', color: 'white', textDecoration: 'none', fontWeight: 700, fontSize: 13 }}>
                <Phone size={13} /> Call
              </a>
            </div>
            <button
              style={{ marginTop: 8, width: '100%', padding: '8px', borderRadius: 8, border: '1.5px solid #fecaca', background: '#fef2f2', color: '#dc2626', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}
              onClick={() => {
                const next = leads.map(l => l.id === selected.id ? { ...l, status: 'closed' } : l);
                setLeads(next); localStorage.setItem('rc_leads', JSON.stringify(next)); setSelected(null);
              }}>
              Archive
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
