import React, { useState } from 'react';
import { Save, Check, Eye } from 'lucide-react';

const PRESET_COLORS = ['#ea580c', '#2563eb', '#16a34a', '#7c3aed', '#db2777', '#0f172a', '#0891b2', '#d97706'];

const defaultBranding = {
  companyName: 'Your Roofing Co.', primaryColor: '#ea580c',
  logoUrl: '', phone: '', ctaText: 'Get a Free Quote', ctaUrl: '',
};

export default function BrandingTab() {
  const stored = (() => { try { return JSON.parse(localStorage.getItem('rc_branding')) || {}; } catch { return {}; } })();
  const [form, setForm] = useState({ ...defaultBranding, ...stored });
  const [saved, setSaved] = useState(false);
  const [preview, setPreview] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const save = () => {
    localStorage.setItem('rc_branding', JSON.stringify(form));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const inputStyle = {
    width: '100%', padding: '10px 13px', borderRadius: 9, border: '1.5px solid #e2e8f0',
    fontSize: 14.5, color: '#0f172a', boxSizing: 'border-box', outline: 'none',
  };
  const labelStyle = { fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6, display: 'block' };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>Branding</h2>
          <p style={{ fontSize: 14, color: '#64748b' }}>Customize how the calculator looks on your site.</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => setPreview(p => !p)}
            style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 16px', borderRadius: 9, border: '1.5px solid #e2e8f0', background: 'white', cursor: 'pointer', fontWeight: 600, fontSize: 13.5, color: '#374151' }}>
            <Eye size={14} /> Preview
          </button>
          <button onClick={save}
            style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 18px', borderRadius: 9, border: 'none', background: saved ? '#16a34a' : '#ea580c', color: 'white', cursor: 'pointer', fontWeight: 700, fontSize: 13.5, boxShadow: '0 2px 10px rgba(234,88,12,0.25)' }}>
            {saved ? <><Check size={14} /> Saved!</> : <><Save size={14} /> Save Changes</>}
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: preview ? '1fr 1fr' : '1fr', gap: 24 }}>
        {/* Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Company info */}
          <div style={{ background: 'white', borderRadius: 14, border: '1px solid #e2e8f0', padding: '24px' }}>
            <div style={{ fontWeight: 700, fontSize: 14.5, color: '#0f172a', marginBottom: 18, paddingBottom: 12, borderBottom: '1px solid #f1f5f9' }}>Company Info</div>
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Company Name</label>
              <input style={inputStyle} value={form.companyName} onChange={e => set('companyName', e.target.value)} placeholder="Your Roofing Co." />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Logo URL <span style={{ fontWeight: 400, color: '#94a3b8' }}>(optional)</span></label>
              <input style={inputStyle} value={form.logoUrl} onChange={e => set('logoUrl', e.target.value)} placeholder="https://yoursite.com/logo.png" />
            </div>
            <div>
              <label style={labelStyle}>Phone Number <span style={{ fontWeight: 400, color: '#94a3b8' }}>(optional)</span></label>
              <input style={inputStyle} value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="(555) 123-4567" />
            </div>
          </div>

          {/* Brand color */}
          <div style={{ background: 'white', borderRadius: 14, border: '1px solid #e2e8f0', padding: '24px' }}>
            <div style={{ fontWeight: 700, fontSize: 14.5, color: '#0f172a', marginBottom: 18, paddingBottom: 12, borderBottom: '1px solid #f1f5f9' }}>Brand Color</div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 16 }}>
              {PRESET_COLORS.map(c => (
                <button key={c} onClick={() => set('primaryColor', c)}
                  style={{ width: 34, height: 34, borderRadius: 8, background: c, border: form.primaryColor === c ? '3px solid #0f172a' : '3px solid transparent', cursor: 'pointer', transition: 'border 0.15s', boxSizing: 'border-box' }} />
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <input type="color" value={form.primaryColor} onChange={e => set('primaryColor', e.target.value)}
                style={{ width: 42, height: 42, borderRadius: 9, border: '1.5px solid #e2e8f0', padding: 2, cursor: 'pointer', background: 'white' }} />
              <input style={{ ...inputStyle, flex: 1 }} value={form.primaryColor} onChange={e => set('primaryColor', e.target.value)} placeholder="#ea580c" />
            </div>
          </div>

          {/* CTA */}
          <div style={{ background: 'white', borderRadius: 14, border: '1px solid #e2e8f0', padding: '24px' }}>
            <div style={{ fontWeight: 700, fontSize: 14.5, color: '#0f172a', marginBottom: 18, paddingBottom: 12, borderBottom: '1px solid #f1f5f9' }}>Call-to-Action Button</div>
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Button Text</label>
              <input style={inputStyle} value={form.ctaText} onChange={e => set('ctaText', e.target.value)} placeholder="Get a Free Quote" />
            </div>
            <div>
              <label style={labelStyle}>Button URL <span style={{ fontWeight: 400, color: '#94a3b8' }}>(leave blank to use calculator)</span></label>
              <input style={inputStyle} value={form.ctaUrl} onChange={e => set('ctaUrl', e.target.value)} placeholder="https://yoursite.com/contact" />
            </div>
          </div>
        </div>

        {/* Preview */}
        {preview && (
          <div style={{ position: 'sticky', top: 24, alignSelf: 'flex-start' }}>
            <div style={{ fontWeight: 700, fontSize: 13.5, color: '#64748b', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Live Preview</div>
            <div style={{ background: '#f8fafc', borderRadius: 14, border: '1px solid #e2e8f0', padding: 16, overflow: 'hidden' }}>
              <div style={{ background: 'white', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
                {/* Mock result header */}
                <div style={{ background: form.primaryColor, padding: '20px 22px', color: 'white' }}>
                  <div style={{ fontSize: 10, opacity: 0.8, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Asphalt Shingle Replacement · TX</div>
                  <div style={{ fontSize: 28, fontWeight: 800 }}>$8,400 – $11,200</div>
                  <div style={{ fontSize: 12, opacity: 0.8, marginTop: 4 }}>total installed</div>
                </div>
                <div style={{ padding: '16px 22px' }}>
                  {form.logoUrl && <img src={form.logoUrl} alt="logo" style={{ height: 32, marginBottom: 12, objectFit: 'contain' }} />}
                  <div style={{ fontWeight: 700, fontSize: 13.5, color: '#0f172a', marginBottom: 4 }}>
                    {form.companyName ? `Ready to book with ${form.companyName}?` : 'Ready to get real quotes?'}
                  </div>
                  <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 12px' }}>Contact us for a free, no-obligation on-site estimate.</p>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <a href="#" onClick={e => e.preventDefault()} style={{ background: form.primaryColor, color: 'white', padding: '9px 16px', borderRadius: 7, textDecoration: 'none', fontWeight: 700, fontSize: 12 }}>
                      {form.ctaText || 'Get a Free Quote'}
                    </a>
                    {form.phone && (
                      <a href="#" onClick={e => e.preventDefault()} style={{ background: '#16a34a', color: 'white', padding: '9px 14px', borderRadius: 7, textDecoration: 'none', fontWeight: 700, fontSize: 12 }}>
                        Call {form.phone}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
