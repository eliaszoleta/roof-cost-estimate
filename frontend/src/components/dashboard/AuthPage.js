import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { url } from '../../utils/routes';

export default function AuthPage({ onAuth }) {
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!form.email || !form.password) { setError('Please fill in all fields.'); return; }
    if (mode === 'signup' && !form.name) { setError('Please enter your company name.'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }

    setLoading(true);
    setTimeout(() => {
      const session = { email: form.email, name: mode === 'signup' ? form.name : (localStorage.getItem('rc_company_name') || form.email.split('@')[0]) };
      if (mode === 'signup') {
        localStorage.setItem('rc_company_name', form.name);
        // seed default branding
        if (!localStorage.getItem('rc_branding')) {
          localStorage.setItem('rc_branding', JSON.stringify({
            companyName: form.name, primaryColor: '#ea580c',
            logoUrl: '', phone: '', ctaText: 'Get a Free Quote', ctaUrl: '',
          }));
        }
        // seed default services
        if (!localStorage.getItem('rc_services')) {
          localStorage.setItem('rc_services', JSON.stringify([
            'shingle_replacement', 'metal_roofing', 'tile_roofing',
            'flat_roof', 'roof_repair', 'roof_inspection', 'gutter_replacement',
          ]));
        }
      }
      localStorage.setItem('rc_session', JSON.stringify(session));
      setLoading(false);
      onAuth(session);
    }, 800);
  };

  const inputStyle = {
    width: '100%', padding: '11px 14px 11px 40px', borderRadius: 9, border: '1.5px solid #e2e8f0',
    fontSize: 14.5, color: '#0f172a', background: 'white', boxSizing: 'border-box',
    outline: 'none', transition: 'border-color 0.15s',
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #0f172a 0%, #1e293b 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 16px' }}>

      {/* Logo */}
      <a href={url('/')} style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: 36 }}>
        <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #ea580c, #c2410c)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 12px rgba(234,88,12,0.35)' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M3 11.5L12 3L21 11.5V21H15.5V15H8.5V21H3V11.5Z"/></svg>
        </div>
        <span style={{ fontWeight: 800, fontSize: 20, color: 'white' }}>RoofCalc</span>
      </a>

      {/* Card */}
      <div style={{ width: '100%', maxWidth: 420, background: 'white', borderRadius: 20, padding: '36px 32px', boxShadow: '0 24px 80px rgba(0,0,0,0.35)' }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>
          {mode === 'login' ? 'Welcome back' : 'Create your account'}
        </h1>
        <p style={{ fontSize: 14, color: '#64748b', marginBottom: 28 }}>
          {mode === 'login' ? 'Sign in to your contractor dashboard.' : 'Start your 14-day free trial — no credit card needed.'}
        </p>

        <form onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <div style={{ marginBottom: 14, position: 'relative' }}>
              <User size={15} color="#94a3b8" style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              <input
                style={inputStyle} type="text" placeholder="Company name" value={form.name}
                onChange={e => set('name', e.target.value)}
                onFocus={e => { e.target.style.borderColor = '#ea580c'; }}
                onBlur={e => { e.target.style.borderColor = '#e2e8f0'; }}
              />
            </div>
          )}

          <div style={{ marginBottom: 14, position: 'relative' }}>
            <Mail size={15} color="#94a3b8" style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            <input
              style={inputStyle} type="email" placeholder="Email address" value={form.email}
              onChange={e => set('email', e.target.value)}
              onFocus={e => { e.target.style.borderColor = '#ea580c'; }}
              onBlur={e => { e.target.style.borderColor = '#e2e8f0'; }}
            />
          </div>

          <div style={{ marginBottom: 20, position: 'relative' }}>
            <Lock size={15} color="#94a3b8" style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            <input
              style={{ ...inputStyle, paddingRight: 42 }} type={showPw ? 'text' : 'password'} placeholder="Password" value={form.password}
              onChange={e => set('password', e.target.value)}
              onFocus={e => { e.target.style.borderColor = '#ea580c'; }}
              onBlur={e => { e.target.style.borderColor = '#e2e8f0'; }}
            />
            <button type="button" onClick={() => setShowPw(p => !p)}
              style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 2, color: '#94a3b8' }}>
              {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>

          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '10px 14px', fontSize: 13.5, color: '#dc2626', marginBottom: 16 }}>
              {error}
            </div>
          )}

          <button type="submit" disabled={loading}
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: loading ? '#f97316' : '#ea580c', color: 'white', padding: '13px', borderRadius: 9, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 700, fontSize: 15, boxShadow: '0 4px 16px rgba(234,88,12,0.3)' }}>
            {loading ? 'Signing in…' : (mode === 'login' ? 'Sign In' : 'Create Account')}
            {!loading && <ArrowRight size={16} />}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 22, fontSize: 13.5, color: '#64748b' }}>
          {mode === 'login' ? (
            <>Don't have an account? <button onClick={() => { setMode('signup'); setError(''); }} style={{ background: 'none', border: 'none', color: '#ea580c', fontWeight: 600, cursor: 'pointer', fontSize: 13.5, padding: 0 }}>Sign up free</button></>
          ) : (
            <>Already have an account? <button onClick={() => { setMode('login'); setError(''); }} style={{ background: 'none', border: 'none', color: '#ea580c', fontWeight: 600, cursor: 'pointer', fontSize: 13.5, padding: 0 }}>Sign in</button></>
          )}
        </div>
      </div>

      <div style={{ marginTop: 24, fontSize: 12.5, color: '#475569', textAlign: 'center' }}>
        By continuing, you agree to our{' '}
        <a href={url('/terms-of-service')} style={{ color: '#64748b' }}>Terms</a> and{' '}
        <a href={url('/privacy-policy')} style={{ color: '#64748b' }}>Privacy Policy</a>.
      </div>
    </div>
  );
}
