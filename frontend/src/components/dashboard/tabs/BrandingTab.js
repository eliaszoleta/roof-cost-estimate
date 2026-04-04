import React, { useState, useEffect } from 'react';
import { Save, Check } from 'lucide-react';
import RoofingCalculator from '../../calculator/RoofingCalculator';

const PRESET_COLORS = ['#ea580c', '#2563eb', '#16a34a', '#7c3aed', '#db2777', '#0f172a', '#0891b2', '#d97706'];

const defaultBranding = {
  companyName: 'Your Roofing Co.', primaryColor: '#ea580c',
  logoUrl: '', phone: '', ctaText: 'Get a Free Quote', ctaUrl: '',
};

export default function BrandingTab() {
  const stored = (() => { try { return JSON.parse(localStorage.getItem('rc_branding')) || {}; } catch { return {}; } })();
  const [form, setForm] = useState({ ...defaultBranding, ...stored });
  const [saved, setSaved] = useState(false);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 900);

  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 900);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const save = () => {
    localStorage.setItem('rc_branding', JSON.stringify(form));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  // Map form fields to the companyConfig shape RoofingCalculator expects
  const previewConfig = {
    companyName:   form.companyName  || null,
    primaryColor:  form.primaryColor || '#ea580c',
    logoUrl:       form.logoUrl      || null,
    ctaPhone:      form.phone        || null,
    ctaButtonText: form.ctaText      || 'Get a Free Quote',
    ctaButtonUrl:  form.ctaUrl       || null,
  };

  const inputStyle = {
    width: '100%', padding: '10px 13px', borderRadius: 9, border: '1.5px solid #e2e8f0',
    fontSize: 14, color: '#0f172a', boxSizing: 'border-box', outline: 'none', background: 'white',
    transition: 'border-color 0.15s',
  };
  const labelStyle = { fontSize: 12.5, fontWeight: 600, color: '#374151', marginBottom: 5, display: 'block' };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>Branding</h2>
          <p style={{ fontSize: 14, color: '#64748b' }}>Changes update the preview instantly.</p>
        </div>
        <button onClick={save}
          style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '10px 20px', borderRadius: 9, border: 'none', background: saved ? '#16a34a' : '#ea580c', color: 'white', cursor: 'pointer', fontWeight: 700, fontSize: 14, boxShadow: '0 2px 10px rgba(234,88,12,0.25)', flexShrink: 0 }}>
          {saved ? <><Check size={14} /> Saved!</> : <><Save size={14} /> Save Changes</>}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '360px 1fr', gap: 24, alignItems: 'start' }}>

        {/* ── Left: Form ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Company info */}
          <div style={{ background: 'white', borderRadius: 14, border: '1px solid #e2e8f0', padding: '20px' }}>
            <div style={{ fontWeight: 700, fontSize: 13.5, color: '#0f172a', marginBottom: 16, paddingBottom: 10, borderBottom: '1px solid #f1f5f9' }}>Company Info</div>
            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Company Name</label>
              <input style={inputStyle} value={form.companyName} onChange={e => set('companyName', e.target.value)} placeholder="Your Roofing Co."
                onFocus={e => { e.target.style.borderColor = '#ea580c'; }} onBlur={e => { e.target.style.borderColor = '#e2e8f0'; }} />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Logo URL <span style={{ fontWeight: 400, color: '#94a3b8' }}>(optional)</span></label>
              <input style={inputStyle} value={form.logoUrl} onChange={e => set('logoUrl', e.target.value)} placeholder="https://yoursite.com/logo.png"
                onFocus={e => { e.target.style.borderColor = '#ea580c'; }} onBlur={e => { e.target.style.borderColor = '#e2e8f0'; }} />
            </div>
            <div>
              <label style={labelStyle}>Phone Number <span style={{ fontWeight: 400, color: '#94a3b8' }}>(optional)</span></label>
              <input style={inputStyle} value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="(555) 123-4567"
                onFocus={e => { e.target.style.borderColor = '#ea580c'; }} onBlur={e => { e.target.style.borderColor = '#e2e8f0'; }} />
            </div>
          </div>

          {/* Brand color */}
          <div style={{ background: 'white', borderRadius: 14, border: '1px solid #e2e8f0', padding: '20px' }}>
            <div style={{ fontWeight: 700, fontSize: 13.5, color: '#0f172a', marginBottom: 16, paddingBottom: 10, borderBottom: '1px solid #f1f5f9' }}>Brand Color</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
              {PRESET_COLORS.map(c => (
                <button key={c} onClick={() => set('primaryColor', c)}
                  style={{ width: 32, height: 32, borderRadius: 8, background: c, border: form.primaryColor === c ? '3px solid #0f172a' : '3px solid transparent', cursor: 'pointer', transition: 'border 0.15s', boxSizing: 'border-box' }} />
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <input type="color" value={form.primaryColor} onChange={e => set('primaryColor', e.target.value)}
                style={{ width: 40, height: 40, borderRadius: 8, border: '1.5px solid #e2e8f0', padding: 2, cursor: 'pointer', background: 'white', flexShrink: 0 }} />
              <input style={{ ...inputStyle }} value={form.primaryColor} onChange={e => set('primaryColor', e.target.value)} placeholder="#ea580c"
                onFocus={e => { e.target.style.borderColor = '#ea580c'; }} onBlur={e => { e.target.style.borderColor = '#e2e8f0'; }} />
            </div>
          </div>

          {/* CTA */}
          <div style={{ background: 'white', borderRadius: 14, border: '1px solid #e2e8f0', padding: '20px' }}>
            <div style={{ fontWeight: 700, fontSize: 13.5, color: '#0f172a', marginBottom: 16, paddingBottom: 10, borderBottom: '1px solid #f1f5f9' }}>Call-to-Action Button</div>
            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Button Text</label>
              <input style={inputStyle} value={form.ctaText} onChange={e => set('ctaText', e.target.value)} placeholder="Get a Free Quote"
                onFocus={e => { e.target.style.borderColor = '#ea580c'; }} onBlur={e => { e.target.style.borderColor = '#e2e8f0'; }} />
            </div>
            <div>
              <label style={labelStyle}>Button URL <span style={{ fontWeight: 400, color: '#94a3b8' }}>(leave blank to use calculator)</span></label>
              <input style={inputStyle} value={form.ctaUrl} onChange={e => set('ctaUrl', e.target.value)} placeholder="https://yoursite.com/contact"
                onFocus={e => { e.target.style.borderColor = '#ea580c'; }} onBlur={e => { e.target.style.borderColor = '#e2e8f0'; }} />
            </div>
          </div>
        </div>

        {/* ── Right: Live Preview ── */}
        <div style={{ position: 'sticky', top: 80 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Live Preview</div>
          <div style={{ border: '1.5px solid #e2e8f0', borderRadius: 16, overflow: 'hidden', background: '#f8fafc', height: 600, overflowY: 'auto', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
            <div style={{ background: 'white' }}>
              <RoofingCalculator companyConfig={previewConfig} embedded={true} />
            </div>
          </div>
          <div style={{ marginTop: 10, fontSize: 12.5, color: '#94a3b8', textAlign: 'center' }}>
            This is exactly how homeowners will see your calculator.
          </div>
        </div>

      </div>
    </div>
  );
}
