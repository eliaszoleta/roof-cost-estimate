import React, { useState } from 'react';
import { Plus, Edit2, Trash2, X, Info } from 'lucide-react';

/* ─── Built-in question config ──────────────────────────── */
const DEFAULT_Q_CONFIG = {
  showStories:     true,
  showPitch:       true,
  showShingleGrade:true,
  showMaterialType:true,
  showComplexity:  true,
  showLayers:      true,
  showPenetrations:true,
  showAddOns:      true,
};

function loadQConfig() {
  try { return { ...DEFAULT_Q_CONFIG, ...JSON.parse(localStorage.getItem('rc_question_config')) }; }
  catch { return DEFAULT_Q_CONFIG; }
}
function saveQConfig(cfg) { localStorage.setItem('rc_question_config', JSON.stringify(cfg)); }

const BUILTIN_QUESTIONS = [
  {
    key: 'showStories',
    label: 'Number of stories',
    desc: 'How many floors the home has — affects labor and safety staging costs.',
    defaultNote: 'Defaults to 1 story when off',
    services: 'All replacement services',
  },
  {
    key: 'showPitch',
    label: 'Roof pitch',
    desc: 'Steeper roofs require more material (larger surface area) and more difficult labor.',
    defaultNote: 'Defaults to medium pitch (4–8:12) when off',
    services: 'All except flat roof',
  },
  {
    key: 'showShingleGrade',
    label: 'Shingle grade',
    desc: 'Standard / Architectural / Designer — the single biggest price variable on asphalt jobs.',
    defaultNote: 'Defaults to Architectural (most popular) when off',
    services: 'Asphalt shingle only',
  },
  {
    key: 'showMaterialType',
    label: 'Material type selector',
    desc: 'Metal panel type, tile material, or flat roof membrane system.',
    defaultNote: 'Defaults to most common type per service when off',
    services: 'Metal / Tile / Flat only',
  },
  {
    key: 'showComplexity',
    label: 'Roof complexity',
    desc: 'Simple gable vs. moderate hip/valley vs. complex dormers — affects labor and material waste.',
    defaultNote: 'Defaults to Moderate when off (safe middle estimate)',
    services: 'All replacement services',
  },
  {
    key: 'showLayers',
    label: 'Existing shingle layers',
    desc: 'A 2nd layer doubles tear-off labor and disposal cost. Big price swing.',
    defaultNote: 'Defaults to 1 layer when off',
    services: 'All replacement services',
  },
  {
    key: 'showPenetrations',
    label: 'Penetrations (chimneys / skylights)',
    desc: 'Each penetration needs custom flashing. Counts drive accuracy on complex roofs.',
    defaultNote: 'Defaults to None when off',
    services: 'All replacement services',
  },
  {
    key: 'showAddOns',
    label: 'Add-ons',
    desc: 'Optional upgrades: new decking, ice & water shield, ridge ventilation, gutters.',
    defaultNote: 'No add-ons included when off',
    services: 'Asphalt shingle only',
  },
];

function Toggle({ on, onToggle }) {
  return (
    <div onClick={onToggle} style={{
      width: 40, height: 22, borderRadius: 99, flexShrink: 0, cursor: 'pointer',
      background: on ? '#ea580c' : '#e2e8f0', position: 'relative', transition: 'background 0.2s',
    }}>
      <div style={{
        position: 'absolute', top: 2, left: on ? 20 : 2, width: 18, height: 18,
        borderRadius: 99, background: 'white', boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
        transition: 'left 0.2s',
      }} />
    </div>
  );
}

/* ─── Custom steps ───────────────────────────────────────── */
const POSITIONS = ['After Location', 'After Details', 'Before Lead Capture'];
const TYPES     = ['Multiple Choice', 'Text Input', 'Yes / No'];

function loadSteps() {
  try { return JSON.parse(localStorage.getItem('rc_custom_steps')) || []; } catch { return []; }
}
function saveSteps(steps) { localStorage.setItem('rc_custom_steps', JSON.stringify(steps)); }

const EMPTY_FORM = { title: '', subtitle: '', position: POSITIONS[0], type: TYPES[0], required: true, options: ['', ''] };

function StepModal({ initial, onSave, onClose }) {
  const [form, setForm] = useState(initial || EMPTY_FORM);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const setOption = (i, v) => set('options', form.options.map((o, idx) => idx === i ? v : o));
  const addOption = () => set('options', [...form.options, '']);
  const removeOption = (i) => set('options', form.options.filter((_, idx) => idx !== i));

  const inputStyle = { width: '100%', padding: '9px 12px', borderRadius: 8, border: '1.5px solid #e2e8f0', fontSize: 14, color: '#0f172a', boxSizing: 'border-box', outline: 'none' };
  const labelStyle = { fontSize: 12.5, fontWeight: 600, color: '#374151', marginBottom: 5, display: 'block' };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.45)' }}>
      <div style={{ background: 'white', borderRadius: 16, width: '100%', maxWidth: 520, maxHeight: '90vh', overflow: 'auto', padding: '28px 28px 24px', boxShadow: '0 24px 80px rgba(0,0,0,0.2)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h3 style={{ fontSize: 17, fontWeight: 800, color: '#0f172a', margin: 0 }}>{initial ? 'Edit Step' : 'Add Custom Step'}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}><X size={18} /></button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={labelStyle}>Step Title</label>
            <input style={inputStyle} value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. Roof Age"
              onFocus={e => { e.target.style.borderColor = '#ea580c'; }} onBlur={e => { e.target.style.borderColor = '#e2e8f0'; }} />
          </div>
          <div>
            <label style={labelStyle}>Question</label>
            <input style={inputStyle} value={form.subtitle} onChange={e => set('subtitle', e.target.value)} placeholder="e.g. How old is your roof?"
              onFocus={e => { e.target.style.borderColor = '#ea580c'; }} onBlur={e => { e.target.style.borderColor = '#e2e8f0'; }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={labelStyle}>Position</label>
              <select value={form.position} onChange={e => set('position', e.target.value)}
                style={{ ...inputStyle, cursor: 'pointer' }}>
                {POSITIONS.map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Input Type</label>
              <select value={form.type} onChange={e => set('type', e.target.value)}
                style={{ ...inputStyle, cursor: 'pointer' }}>
                {TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>

          {form.type === 'Multiple Choice' && (
            <div>
              <label style={labelStyle}>Options</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {form.options.map((opt, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8 }}>
                    <input style={{ ...inputStyle, flex: 1 }} value={opt} onChange={e => setOption(i, e.target.value)} placeholder={`Option ${i + 1}`}
                      onFocus={e => { e.target.style.borderColor = '#ea580c'; }} onBlur={e => { e.target.style.borderColor = '#e2e8f0'; }} />
                    {form.options.length > 2 && (
                      <button onClick={() => removeOption(i)} style={{ background: 'none', border: '1.5px solid #e2e8f0', borderRadius: 8, cursor: 'pointer', color: '#94a3b8', padding: '0 10px' }}><X size={14} /></button>
                    )}
                  </div>
                ))}
                <button onClick={addOption}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 12px', borderRadius: 8, border: '1.5px dashed #e2e8f0', background: 'none', cursor: 'pointer', fontSize: 13, color: '#64748b', fontWeight: 500 }}>
                  <Plus size={14} /> Add option
                </button>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Toggle on={form.required} onToggle={() => set('required', !form.required)} />
            <span style={{ fontSize: 13.5, color: '#374151', fontWeight: 500 }}>Required</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
          <button onClick={onClose}
            style={{ flex: 1, padding: '11px', borderRadius: 9, border: '1.5px solid #e2e8f0', background: 'white', cursor: 'pointer', fontWeight: 600, fontSize: 14, color: '#374151' }}>
            Cancel
          </button>
          <button onClick={() => { if (!form.title || !form.subtitle) return; onSave(form); onClose(); }}
            style={{ flex: 1, padding: '11px', borderRadius: 9, border: 'none', background: '#ea580c', color: 'white', cursor: 'pointer', fontWeight: 700, fontSize: 14 }}>
            {initial ? 'Save Changes' : 'Add Step'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main ───────────────────────────────────────────────── */
export default function CustomStepsTab() {
  const [qConfig, setQConfig] = useState(loadQConfig);
  const [steps,   setSteps]   = useState(loadSteps);
  const [modal,   setModal]   = useState(null);

  const toggleQ = (key) => {
    const next = { ...qConfig, [key]: !qConfig[key] };
    setQConfig(next);
    saveQConfig(next);
  };

  const addStep    = (form) => { const next = [...steps, { ...form, id: Date.now().toString() }]; setSteps(next); saveSteps(next); };
  const editStep   = (i, form) => { const next = steps.map((s, idx) => idx === i ? { ...s, ...form } : s); setSteps(next); saveSteps(next); };
  const deleteStep = (i) => { const next = steps.filter((_, idx) => idx !== i); setSteps(next); saveSteps(next); };

  const enabledCount = BUILTIN_QUESTIONS.filter(q => qConfig[q.key]).length;

  return (
    <div style={{ maxWidth: 680 }}>

      {/* ── Built-in Questions ── */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ marginBottom: 16 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>Built-in Questions</h2>
          <p style={{ fontSize: 14, color: '#64748b', margin: 0 }}>
            Toggle which questions appear in the "Tell us about your roof" step.
            Disabled questions use smart defaults so estimates stay accurate.
          </p>
        </div>

        <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: 10, padding: '11px 14px', marginBottom: 14, display: 'flex', alignItems: 'flex-start', gap: 9, fontSize: 13, color: '#9a3412' }}>
          <Info size={14} style={{ flexShrink: 0, marginTop: 1 }} />
          <span>Turning off a question removes it from the homeowner's form. The calculator automatically substitutes the default value shown — no accuracy lost.</span>
        </div>

        <div style={{ background: 'white', borderRadius: 14, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          {BUILTIN_QUESTIONS.map((q, i) => (
            <div key={q.key} style={{
              display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px',
              borderBottom: i < BUILTIN_QUESTIONS.length - 1 ? '1px solid #f1f5f9' : 'none',
              opacity: qConfig[q.key] ? 1 : 0.6, transition: 'opacity 0.2s',
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                  <span style={{ fontWeight: 700, fontSize: 14, color: '#0f172a' }}>{q.label}</span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8', background: '#f1f5f9', padding: '2px 7px', borderRadius: 5 }}>{q.services}</span>
                </div>
                <div style={{ fontSize: 13, color: '#64748b', marginBottom: 3 }}>{q.desc}</div>
                {!qConfig[q.key] && (
                  <div style={{ fontSize: 12, color: '#ea580c', fontWeight: 600 }}>↳ {q.defaultNote}</div>
                )}
              </div>
              <Toggle on={qConfig[q.key]} onToggle={() => toggleQ(q.key)} />
            </div>
          ))}
        </div>

        <div style={{ marginTop: 10, fontSize: 12.5, color: '#94a3b8', textAlign: 'right' }}>
          {enabledCount} of {BUILTIN_QUESTIONS.length} questions enabled
        </div>
      </div>

      {/* ── Custom Steps ── */}
      <div>
        <div style={{ marginBottom: 16 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>
            Custom Steps <span style={{ fontSize: 15, fontWeight: 600, color: '#64748b' }}>({steps.length})</span>
          </h2>
          <p style={{ fontSize: 14, color: '#64748b', margin: 0 }}>Add your own questions between the default calculator steps. Answers are recorded in the Leads tab.</p>
        </div>

        <div style={{ background: 'white', borderRadius: 14, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          {steps.length === 0 ? (
            <div style={{ padding: '32px 24px', textAlign: 'center', color: '#94a3b8', fontSize: 14 }}>
              No custom steps yet. Add one to collect extra info from homeowners.
            </div>
          ) : steps.map((step, i) => (
            <div key={step.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 20px', borderBottom: i < steps.length - 1 ? '1px solid #f1f5f9' : 'none', gap: 16 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14.5, color: '#0f172a', marginBottom: 3 }}>{step.title}</div>
                <div style={{ fontSize: 13, color: '#64748b', marginBottom: 4 }}>{step.subtitle}</div>
                <div style={{ fontSize: 12, color: '#94a3b8' }}>
                  {step.position} · {step.type}{step.required ? ' · Required' : ''}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                <button onClick={() => setModal({ index: i, step })}
                  style={{ padding: '6px 14px', borderRadius: 7, border: '1.5px solid #e2e8f0', background: 'white', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#374151' }}>
                  Edit
                </button>
                <button onClick={() => deleteStep(i)}
                  style={{ width: 32, height: 32, borderRadius: 7, border: '1.5px solid #fecaca', background: '#fef2f2', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#dc2626' }}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}

          <button onClick={() => setModal('add')}
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '16px', border: 'none', borderTop: steps.length ? '1px solid #f1f5f9' : 'none', background: 'white', cursor: 'pointer', fontSize: 14, fontWeight: 600, color: '#2563eb', borderRadius: 0 }}
            onMouseEnter={e => { e.currentTarget.style.background = '#f8faff'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'white'; }}
          >
            <Plus size={16} /> Add Custom Step
          </button>
        </div>
      </div>

      {modal === 'add' && <StepModal onSave={addStep} onClose={() => setModal(null)} />}
      {modal?.index !== undefined && (
        <StepModal initial={modal.step} onSave={form => editStep(modal.index, form)} onClose={() => setModal(null)} />
      )}
    </div>
  );
}
