import React, { useState } from 'react';
import {
  Search, RefreshCw, Download, Trash2, Mail, Phone,
  X, ChevronDown, RotateCcw, ArrowLeft,
} from 'lucide-react';
import { serviceTypeLabel } from '../../../utils/formatters';

const STATUS_OPTIONS = ['new', 'contacted', 'booked', 'closed'];
const STATUS_COLORS  = {
  new:       { bg: '#eff6ff', text: '#1d4ed8', dot: '#3b82f6', label: 'New'       },
  contacted: { bg: '#fefce8', text: '#854d0e', dot: '#eab308', label: 'Contacted' },
  booked:    { bg: '#f0fdf4', text: '#166534', dot: '#22c55e', label: 'Booked'    },
  closed:    { bg: '#f8fafc', text: '#64748b', dot: '#94a3b8', label: 'Closed'    },
};

const TH = { padding: '11px 14px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.06em', whiteSpace: 'nowrap', background: '#fafafa', borderBottom: '1px solid #e2e8f0' };
const TD = { padding: '11px 14px', fontSize: 13, whiteSpace: 'nowrap', borderBottom: '1px solid #f8fafc' };

function fmt(iso) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: '2-digit' });
}
function fmtPrice(n) { return n != null ? '$' + Number(n).toLocaleString() : '—'; }
function cap(s) { return (s || '').replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()); }

const ROOF_SIZE_LABELS = {
  under_1000: '<1,000 sq ft', '1000_1500': '1,000–1,500', '1500_2000': '1,500–2,000',
  '2000_2500': '2,000–2,500', '2500_3000': '2,500–3,000', over_3000: '3,000+ sq ft',
};
const PITCH_LABELS = { low: 'Low (≤4:12)', medium: 'Medium (4–8:12)', steep: 'Steep (8:12+)' };
const ADDON_LABELS = {
  new_decking: 'New Decking', ice_water_shield: 'Ice & Water Shield',
  ridge_ventilation: 'Ridge Vent', gutter_replacement: 'Gutters',
};
function fmtSize(v)    { return ROOF_SIZE_LABELS[v] || (v ? cap(v) : '—'); }
function fmtPitch(v)   { return PITCH_LABELS[v] || (v ? cap(v) : '—'); }
function fmtStories(v) { return v ? `${v} ${v === 1 ? 'story' : 'stories'}` : '—'; }
function fmtAddOns(arr) {
  if (!arr || arr.length === 0) return '—';
  return arr.map(a => ADDON_LABELS[a] || cap(a)).join(', ');
}

function loadTrash() {
  try { return JSON.parse(localStorage.getItem('rc_leads_trash')) || []; } catch { return []; }
}
function saveTrash(t) { localStorage.setItem('rc_leads_trash', JSON.stringify(t)); }

function exportCSV(leads) {
  const headers = ['Name','Email','Phone','ZIP','State','Service','Roof Size','Stories','Pitch','Add-ons','Est Low','Est High','Timeline','Status','Date'];
  const rows = leads.map(l => [
    l.name, l.email, l.phone, l.zip || '', l.state,
    serviceTypeLabel(l.service), fmtSize(l.roofSize), fmtStories(l.stories),
    fmtPitch(l.pitch), fmtAddOns(l.addOns),
    fmtPrice(l.estimateLow), fmtPrice(l.estimateHigh),
    cap(l.timeline), l.status, fmt(l.createdAt),
  ]);
  const csv = [headers, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n');
  const a = document.createElement('a');
  a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
  a.download = 'roofcalc-leads.csv'; a.click();
}

/* ─── Detail Panel ─────────────────────────────────────────── */
function DetailPanel({ lead, onClose, onStatusChange, onArchive }) {
  const [note, setNote]   = useState(lead._note || '');
  const [saved, setSaved] = useState(false);

  const saveNote = () => {
    setSaved(true); setTimeout(() => setSaved(false), 2000);
  };

  const Row = ({ label, val, href }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '8px 0', borderBottom: '1px solid #f1f5f9', gap: 8 }}>
      <span style={{ fontSize: 13, color: '#94a3b8', flexShrink: 0 }}>{label}</span>
      {href
        ? <a href={href} style={{ fontSize: 13, color: '#ea580c', fontWeight: 600, textDecoration: 'none', textAlign: 'right' }}>{val}</a>
        : <span style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', textAlign: 'right', textTransform: 'capitalize' }}>{val}</span>
      }
    </div>
  );

  return (
    <div style={{ width: 280, flexShrink: 0, background: 'white', border: '1px solid #e2e8f0', borderRadius: 14, overflow: 'hidden', alignSelf: 'flex-start', position: 'sticky', top: 8, maxHeight: 'calc(100vh - 120px)', overflowY: 'auto' }}>
      {/* Header */}
      <div style={{ padding: '16px 18px 14px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: 17, color: '#0f172a' }}>{lead.name}</div>
          <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 3 }}>{fmt(lead.createdAt)}</div>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 2, marginTop: 2 }}><X size={16} /></button>
      </div>

      <div style={{ padding: '14px 18px' }}>
        <Row label="Email"    val={lead.email}  href={`mailto:${lead.email}`} />
        <Row label="Phone"    val={lead.phone}  href={`tel:${lead.phone}`} />
        <Row label="Location" val={`${lead.zip ? lead.zip + ' · ' : ''}${lead.state}`} />
        <Row label="Service"  val={serviceTypeLabel(lead.service)} />
        <Row label="Roof Size" val={fmtSize(lead.roofSize)} />
        <Row label="Stories"   val={fmtStories(lead.stories)} />
        <Row label="Pitch"     val={fmtPitch(lead.pitch)} />
        {lead.addOns && lead.addOns.length > 0 && (
          <div style={{ padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>
            <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 5 }}>Add-ons</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
              {lead.addOns.map(a => (
                <span key={a} style={{ background: '#fff7ed', color: '#c2410c', fontSize: 11.5, fontWeight: 600, padding: '2px 8px', borderRadius: 6, border: '1px solid #fed7aa' }}>
                  {ADDON_LABELS[a] || cap(a)}
                </span>
              ))}
            </div>
          </div>
        )}
        {(!lead.addOns || lead.addOns.length === 0) && <Row label="Add-ons" val="None" />}
        <Row label="Estimate" val={`${fmtPrice(lead.estimateLow)} – ${fmtPrice(lead.estimateHigh)}`} />
        <Row label="Timeline" val={cap(lead.timeline)} />

        {/* Custom step answers */}
        {lead.customAnswers && Object.entries(lead.customAnswers).map(([k, v]) => (
          <Row key={k} label={k} val={String(v)} />
        ))}

        {/* Status */}
        <div style={{ marginTop: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Status</div>
          <div style={{ position: 'relative' }}>
            <select value={lead.status} onChange={e => onStatusChange(lead.id, e.target.value)}
              style={{ width: '100%', appearance: 'none', padding: '9px 28px 9px 12px', borderRadius: 9, border: '1.5px solid #e2e8f0', fontSize: 14, color: '#374151', background: 'white', cursor: 'pointer', outline: 'none' }}>
              {STATUS_OPTIONS.map(s => <option key={s} value={s}>{STATUS_COLORS[s]?.label || s}</option>)}
            </select>
            <ChevronDown size={12} color="#94a3b8" style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          </div>
        </div>

        {/* Internal Notes */}
        <div style={{ marginTop: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Internal Notes</div>
          <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Add notes about this lead…"
            style={{ width: '100%', minHeight: 90, padding: '9px 11px', borderRadius: 9, border: '1.5px solid #e2e8f0', fontSize: 13, resize: 'vertical', boxSizing: 'border-box', outline: 'none', fontFamily: 'inherit', color: '#374151', lineHeight: 1.6 }} />
          <button onClick={saveNote}
            style={{ marginTop: 8, width: '100%', padding: '10px', borderRadius: 9, border: 'none', background: saved ? '#16a34a' : '#ea580c', color: 'white', fontWeight: 700, fontSize: 14, cursor: 'pointer', transition: 'background 0.2s' }}>
            {saved ? 'Saved!' : 'Save Note'}
          </button>
        </div>

        {/* Action buttons */}
        <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
          <a href={`mailto:${lead.email}`}
            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '10px', borderRadius: 9, background: '#ea580c', color: 'white', textDecoration: 'none', fontWeight: 700, fontSize: 14 }}>
            <Mail size={14} /> Email
          </a>
          <a href={`tel:${lead.phone}`}
            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '10px', borderRadius: 9, background: '#16a34a', color: 'white', textDecoration: 'none', fontWeight: 700, fontSize: 14 }}>
            <Phone size={14} /> Call
          </a>
        </div>
        <button onClick={() => onArchive(lead.id)}
          style={{ marginTop: 8, width: '100%', padding: '9px', borderRadius: 9, border: '1.5px solid #fecaca', background: 'white', color: '#dc2626', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
          Archive
        </button>
      </div>
    </div>
  );
}

/* ─── Main Component ────────────────────────────────────────── */
export default function LeadsTab({ leads, setLeads }) {
  const [search,       setSearch]       = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selected,     setSelected]     = useState(null);
  const [checked,      setChecked]      = useState(new Set());
  const [view,         setView]         = useState('leads'); // 'leads' | 'trash'
  const [trash,        setTrash]        = useState(loadTrash);

  /* helpers */
  const moveToTrash = (ids) => {
    const toDelete = leads.filter(l => ids.has(l.id));
    const remaining = leads.filter(l => !ids.has(l.id));
    const newTrash = [...trash, ...toDelete.map(l => ({ ...l, deletedAt: new Date().toISOString() }))];
    setLeads(remaining); localStorage.setItem('rc_leads', JSON.stringify(remaining));
    setTrash(newTrash); saveTrash(newTrash);
    if (selected && ids.has(selected.id)) setSelected(null);
    setChecked(new Set());
  };

  const restoreFromTrash = (id) => {
    const lead = trash.find(l => l.id === id);
    if (!lead) return;
    const { deletedAt, ...restored } = lead;
    const newTrash = trash.filter(l => l.id !== id);
    const newLeads = [...leads, restored];
    setLeads(newLeads); localStorage.setItem('rc_leads', JSON.stringify(newLeads));
    setTrash(newTrash); saveTrash(newTrash);
  };

  const deleteForever = (id) => {
    const newTrash = trash.filter(l => l.id !== id);
    setTrash(newTrash); saveTrash(newTrash);
  };

  const emptyTrash = () => {
    if (!window.confirm('Permanently delete all trash? This cannot be undone.')) return;
    setTrash([]); saveTrash([]);
  };

  const updateStatus = (id, status) => {
    const next = leads.map(l => l.id === id ? { ...l, status } : l);
    setLeads(next); localStorage.setItem('rc_leads', JSON.stringify(next));
    setSelected(s => s?.id === id ? { ...s, status } : s);
  };

  const archiveLead = (id) => {
    moveToTrash(new Set([id]));
    setSelected(null);
  };

  const toggleCheck = (id) => setChecked(prev => {
    const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next;
  });

  const filtered = leads.filter(l => {
    const q = search.toLowerCase();
    const matchSearch = !q || l.name.toLowerCase().includes(q) || l.email.toLowerCase().includes(q) || (l.zip || '').includes(q);
    const matchStatus = filterStatus === 'all' || l.status === filterStatus;
    return matchSearch && matchStatus;
  }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const allChecked = filtered.length > 0 && filtered.every(l => checked.has(l.id));
  const toggleAll = () => {
    if (allChecked) { const next = new Set(checked); filtered.forEach(l => next.delete(l.id)); setChecked(next); }
    else { const next = new Set(checked); filtered.forEach(l => next.add(l.id)); setChecked(next); }
  };

  /* ── TRASH VIEW ── */
  if (view === 'trash') {
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={() => setView('leads')}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px', borderRadius: 8, border: '1.5px solid #e2e8f0', background: 'white', cursor: 'pointer', fontSize: 13, fontWeight: 500, color: '#374151' }}>
              <ArrowLeft size={13} /> Back to Leads
            </button>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Trash <span style={{ fontSize: 15, fontWeight: 600, color: '#64748b' }}>({trash.length})</span>
            </h2>
          </div>
          {trash.length > 0 && (
            <button onClick={emptyTrash}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 8, border: '1.5px solid #fecaca', background: '#fef2f2', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#dc2626' }}>
              <Trash2 size={13} /> Empty Trash
            </button>
          )}
        </div>

        <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 10, padding: '11px 16px', marginBottom: 16, fontSize: 13, color: '#78350f' }}>
          Deleted leads are stored here for 30 days. Restore them or delete permanently.
        </div>

        <div style={{ background: 'white', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'auto' }}>
          {trash.length === 0 ? (
            <div style={{ padding: '48px 24px', textAlign: 'center', color: '#94a3b8', fontSize: 14 }}>Trash is empty.</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['NAME','EMAIL','SERVICE','ESTIMATE','DELETED ON','ACTIONS'].map(h => (
                    <th key={h} style={TH}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {trash.map((lead, i) => (
                  <tr key={lead.id} style={{ background: i % 2 === 0 ? 'white' : '#fafafa' }}>
                    <td style={{ ...TD, fontWeight: 600, color: '#374151' }}>{lead.name}</td>
                    <td style={{ ...TD, color: '#64748b' }}>{lead.email}</td>
                    <td style={{ ...TD, color: '#374151' }}>{serviceTypeLabel(lead.service)}</td>
                    <td style={{ ...TD, color: '#16a34a', fontWeight: 600 }}>{fmtPrice(lead.estimateLow)} – {fmtPrice(lead.estimateHigh)}</td>
                    <td style={{ ...TD, color: '#94a3b8' }}>{lead.deletedAt ? fmt(lead.deletedAt) : '—'}</td>
                    <td style={{ ...TD }}>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={() => restoreFromTrash(lead.id)}
                          style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 12px', borderRadius: 7, border: '1.5px solid #bbf7d0', background: '#f0fdf4', cursor: 'pointer', fontSize: 12.5, fontWeight: 600, color: '#16a34a' }}>
                          <RotateCcw size={12} /> Restore
                        </button>
                        <button onClick={() => deleteForever(lead.id)}
                          style={{ padding: '5px 12px', borderRadius: 7, border: '1.5px solid #fecaca', background: 'white', cursor: 'pointer', fontSize: 12.5, fontWeight: 600, color: '#dc2626' }}>
                          Delete Forever
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    );
  }

  /* ── LEADS VIEW ── */
  return (
    <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>

      {/* Left: table area */}
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
            <button
              onClick={() => checked.size ? moveToTrash(checked) : setView('trash')}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px', borderRadius: 8, border: `1.5px solid ${checked.size ? '#fecaca' : '#e2e8f0'}`, background: checked.size ? '#fef2f2' : 'white', cursor: 'pointer', fontSize: 13, fontWeight: 500, color: checked.size ? '#dc2626' : '#374151' }}>
              <Trash2 size={13} /> {checked.size ? `Move to Trash (${checked.size})` : 'Trash'}
              {trash.length > 0 && !checked.size && (
                <span style={{ background: '#94a3b8', color: 'white', fontSize: 11, fontWeight: 700, borderRadius: 99, minWidth: 18, height: 18, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '0 5px', marginLeft: 2 }}>{trash.length}</span>
              )}
            </button>
          </div>
        </div>

        {/* Search + filter */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={13} color="#94a3b8" style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, email, ZIP…"
              style={{ width: '100%', padding: '9px 12px 9px 32px', borderRadius: 9, border: '1.5px solid #e2e8f0', fontSize: 13.5, color: '#0f172a', boxSizing: 'border-box', outline: 'none', background: 'white' }} />
          </div>
          <div style={{ position: 'relative' }}>
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
              style={{ appearance: 'none', padding: '9px 28px 9px 12px', borderRadius: 9, border: '1.5px solid #e2e8f0', fontSize: 13.5, color: '#374151', background: 'white', cursor: 'pointer', outline: 'none' }}>
              <option value="all">All statuses</option>
              {STATUS_OPTIONS.map(s => <option key={s} value={s}>{STATUS_COLORS[s]?.label || s}</option>)}
            </select>
            <ChevronDown size={12} color="#94a3b8" style={{ position: 'absolute', right: 9, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          </div>
        </div>

        {/* Scrollable table */}
        <div style={{ background: 'white', borderRadius: 12, border: '1px solid #e2e8f0', overflowX: 'auto' }}>
          <table style={{ borderCollapse: 'collapse', minWidth: 1100, width: '100%' }}>
            <thead>
              <tr>
                <th style={{ ...TH, width: 40, padding: '11px 12px' }}>
                  <input type="checkbox" checked={allChecked} onChange={toggleAll} style={{ cursor: 'pointer' }} />
                </th>
                {['NAME','EMAIL','PHONE','LOCATION','SERVICE','ROOF SIZE','STORIES','PITCH','ADD-ONS','ESTIMATE','TIMELINE','DATE'].map(h => (
                  <th key={h} style={TH}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={13} style={{ padding: '44px 24px', textAlign: 'center', color: '#94a3b8', fontSize: 14 }}>
                  {leads.length === 0 ? 'No leads yet. Embed your calculator to start capturing.' : 'No leads match your search.'}
                </td></tr>
              ) : filtered.map((lead, i) => {
                const isSelected = selected?.id === lead.id;
                return (
                  <tr key={lead.id}
                    onClick={() => { setSelected(isSelected ? null : lead); }}
                    style={{ cursor: 'pointer', transition: 'background 0.1s', background: isSelected ? '#eff6ff' : 'white' }}
                    onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = '#fafafa'; }}
                    onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = 'white'; }}
                  >
                    <td style={{ ...TD, padding: '11px 12px', borderBottom: '1px solid #f8fafc' }} onClick={e => e.stopPropagation()}>
                      <input type="checkbox" checked={checked.has(lead.id)} onChange={() => toggleCheck(lead.id)} style={{ cursor: 'pointer' }} />
                    </td>
                    <td style={{ ...TD, fontWeight: 700, color: '#0f172a', borderBottom: '1px solid #f8fafc' }}>{lead.name}</td>
                    <td style={{ ...TD, color: '#ea580c', borderBottom: '1px solid #f8fafc' }}>{lead.email}</td>
                    <td style={{ ...TD, color: '#374151', borderBottom: '1px solid #f8fafc' }}>{lead.phone}</td>
                    <td style={{ ...TD, borderBottom: '1px solid #f8fafc' }}>
                      <span style={{ background: '#f1f5f9', color: '#475569', fontWeight: 600, fontSize: 12, padding: '2px 7px', borderRadius: 5 }}>{lead.state}</span>
                    </td>
                    <td style={{ ...TD, color: '#374151', borderBottom: '1px solid #f8fafc', maxWidth: 130, overflow: 'hidden', textOverflow: 'ellipsis' }}>{serviceTypeLabel(lead.service)}</td>
                    <td style={{ ...TD, color: '#374151', borderBottom: '1px solid #f8fafc' }}>{fmtSize(lead.roofSize)}</td>
                    <td style={{ ...TD, color: '#374151', borderBottom: '1px solid #f8fafc' }}>{fmtStories(lead.stories)}</td>
                    <td style={{ ...TD, color: '#374151', borderBottom: '1px solid #f8fafc' }}>{fmtPitch(lead.pitch)}</td>
                    <td style={{ ...TD, borderBottom: '1px solid #f8fafc', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {lead.addOns && lead.addOns.length > 0
                        ? lead.addOns.map(a => ADDON_LABELS[a] || cap(a)).join(', ')
                        : <span style={{ color: '#cbd5e1' }}>—</span>}
                    </td>
                    <td style={{ ...TD, borderBottom: '1px solid #f8fafc', fontWeight: 600 }}>
                      <span style={{ color: '#16a34a' }}>{fmtPrice(lead.estimateLow)} – {fmtPrice(lead.estimateHigh)}</span>
                    </td>
                    <td style={{ ...TD, color: '#64748b', borderBottom: '1px solid #f8fafc', textTransform: 'capitalize' }}>{cap(lead.timeline)}</td>
                    <td style={{ ...TD, color: '#94a3b8', borderBottom: '1px solid #f8fafc' }}>{fmt(lead.createdAt)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Right: Detail Panel */}
      {selected && (
        <DetailPanel
          lead={selected}
          onClose={() => setSelected(null)}
          onStatusChange={updateStatus}
          onArchive={archiveLead}
        />
      )}
    </div>
  );
}
