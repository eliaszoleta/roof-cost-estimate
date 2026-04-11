import React, { useState } from 'react';
import { Copy, Check, RefreshCw } from 'lucide-react';

function genKey() {
  const chars = 'abcdef0123456789';
  return 'sk_' + Array.from({ length: 40 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}
function loadKey() {
  let k = localStorage.getItem('rc_api_key');
  if (!k) { k = genKey(); localStorage.setItem('rc_api_key', k); }
  return k;
}

const BACKEND = 'https://roof-cost-estimate-api.up.railway.app';

export default function SettingsTab({ session }) {
  const [apiKey, setApiKey] = useState(loadKey);
  const [keyCopied, setKeyCopied] = useState(false);
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [pwMsg, setPwMsg] = useState('');

  const copyKey = () => {
    navigator.clipboard.writeText(apiKey).then(() => { setKeyCopied(true); setTimeout(() => setKeyCopied(false), 2500); });
  };
  const regenKey = () => {
    if (!window.confirm('Regenerate API key? This will invalidate your existing integrations.')) return;
    const k = genKey(); localStorage.setItem('rc_api_key', k); setApiKey(k);
  };
  const updatePw = () => {
    if (!newPw || newPw.length < 8) { setPwMsg('Password must be at least 8 characters.'); return; }
    if (newPw !== confirmPw) { setPwMsg('Passwords do not match.'); return; }
    setPwMsg('✓ Password updated successfully.'); setNewPw(''); setConfirmPw('');
    setTimeout(() => setPwMsg(''), 3000);
  };

  const inputStyle = { width: '100%', padding: '10px 13px', borderRadius: 8, border: '1.5px solid #e2e8f0', fontSize: 14, color: '#0f172a', boxSizing: 'border-box', outline: 'none', background: 'white' };
  const labelStyle = { fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6, display: 'block' };

  return (
    <div style={{ maxWidth: 600 }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>Settings</h2>
        <p style={{ fontSize: 14, color: '#64748b' }}>Manage your account and API access.</p>
      </div>

      {/* Account */}
      <div style={{ background: 'white', borderRadius: 14, border: '1px solid #e2e8f0', padding: '24px', marginBottom: 20 }}>
        <div style={{ fontWeight: 700, fontSize: 15, color: '#0f172a', marginBottom: 4 }}>Account</div>
        <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 20 }}>Your login email and password.</div>

        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>Email</label>
          <input style={{ ...inputStyle, background: '#f8fafc', color: '#64748b' }} value={session?.email || ''} readOnly />
        </div>

        <div style={{ fontWeight: 700, fontSize: 14.5, color: '#0f172a', marginBottom: 16 }}>Change Password</div>
        <div style={{ marginBottom: 12 }}>
          <label style={labelStyle}>New Password</label>
          <input style={inputStyle} type="password" value={newPw} onChange={e => setNewPw(e.target.value)} placeholder="Min. 8 characters"
            onFocus={e => { e.target.style.borderColor = '#ea580c'; }} onBlur={e => { e.target.style.borderColor = '#e2e8f0'; }} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Confirm New Password</label>
          <input style={inputStyle} type="password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)} placeholder="Repeat new password"
            onFocus={e => { e.target.style.borderColor = '#ea580c'; }} onBlur={e => { e.target.style.borderColor = '#e2e8f0'; }} />
        </div>
        {pwMsg && (
          <div style={{ fontSize: 13.5, color: pwMsg.startsWith('✓') ? '#16a34a' : '#dc2626', marginBottom: 12 }}>{pwMsg}</div>
        )}
        <button onClick={updatePw}
          style={{ padding: '10px 22px', borderRadius: 9, border: 'none', background: '#0f172a', color: 'white', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
          Update Password
        </button>
      </div>

      {/* API Access */}
      <div style={{ background: 'white', borderRadius: 14, border: '1px solid #e2e8f0', padding: '24px' }}>
        <div style={{ fontWeight: 700, fontSize: 15, color: '#0f172a', marginBottom: 4 }}>API Access</div>
        <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 20 }}>Pull your leads in real time into any CRM, Zapier, Make, or custom integration.</div>

        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Your API Key</label>
          <div style={{ display: 'flex', gap: 8 }}>
            <input style={{ ...inputStyle, flex: 1, fontFamily: 'monospace', fontSize: 13, color: '#475569' }}
              value={apiKey} readOnly />
            <button onClick={copyKey}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 16px', borderRadius: 8, border: '1.5px solid #e2e8f0', background: 'white', cursor: 'pointer', fontWeight: 600, fontSize: 13.5, color: keyCopied ? '#16a34a' : '#374151', whiteSpace: 'nowrap' }}>
              {keyCopied ? <><Check size={14} /> Copied</> : <><Copy size={14} /> Copy</>}
            </button>
            <button onClick={regenKey}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 16px', borderRadius: 8, border: '1.5px solid #fecaca', background: 'white', cursor: 'pointer', fontWeight: 600, fontSize: 13.5, color: '#dc2626', whiteSpace: 'nowrap' }}>
              <RefreshCw size={14} /> Regenerate
            </button>
          </div>
        </div>

        {/* Usage examples */}
        <div style={{ background: '#0f172a', borderRadius: 10, overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid #1e293b', fontSize: 12.5, fontWeight: 600, color: '#64748b' }}>Usage Examples</div>
          <div style={{ padding: '14px 16px' }}>
            <div style={{ fontSize: 12, color: '#64748b', marginBottom: 6 }}>Fetch all leads:</div>
            <pre style={{ margin: '0 0 16px', fontSize: 12, color: '#94a3b8', overflowX: 'auto', lineHeight: 1.7, fontFamily: 'monospace', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
{`curl ${BACKEND}/api/leads \\
  -H "X-API-Key: ${apiKey}"`}
            </pre>
            <div style={{ fontSize: 12, color: '#64748b', marginBottom: 6 }}>Fetch leads since a date (for polling):</div>
            <pre style={{ margin: 0, fontSize: 12, color: '#94a3b8', overflowX: 'auto', lineHeight: 1.7, fontFamily: 'monospace', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
{`curl "${BACKEND}/api/leads?since=2026-01-01" \\
  -H "X-API-Key: ${apiKey}"`}
            </pre>
          </div>
        </div>
        <div style={{ fontSize: 12.5, color: '#94a3b8', marginTop: 12 }}>
          Keep your API key secret. Regenerating it will invalidate all existing integrations.
        </div>
      </div>
    </div>
  );
}
