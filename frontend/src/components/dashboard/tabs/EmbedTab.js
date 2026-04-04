import React, { useState } from 'react';
import { Copy, Check, ExternalLink, Code2, Smartphone, Monitor } from 'lucide-react';
import { url } from '../../../utils/routes';

export default function EmbedTab({ companyId = 'demo' }) {
  const [copied, setCopied] = useState('');

  const snippet = `<div id="roofcalc-widget"></div>\n<script src="https://eliaszoleta.github.io/roof-cost-estimate/embed.js"\n  data-company="${companyId}"\n  async>\n</script>`;

  const iframeSnippet = `<iframe\n  src="https://eliaszoleta.github.io/roof-cost-estimate/embed?company=${companyId}"\n  width="100%" height="640"\n  frameborder="0"\n  style="border-radius:12px;border:1px solid #e2e8f0;"\n>\n</iframe>`;

  const copy = (text, key) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(''), 2500);
    });
  };

  const CodeBlock = ({ code, id, label }) => (
    <div style={{ background: '#0f172a', borderRadius: 12, overflow: 'hidden', border: '1px solid #1e293b' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 16px', borderBottom: '1px solid #1e293b' }}>
        <span style={{ fontSize: 12.5, fontWeight: 600, color: '#64748b' }}>{label}</span>
        <button onClick={() => copy(code, id)}
          style={{ display: 'flex', alignItems: 'center', gap: 6, background: copied === id ? '#16a34a' : 'rgba(255,255,255,0.06)', border: `1px solid ${copied === id ? '#16a34a' : 'rgba(255,255,255,0.1)'}`, color: copied === id ? '#4ade80' : '#94a3b8', padding: '5px 12px', borderRadius: 7, cursor: 'pointer', fontSize: 12.5, fontWeight: 600 }}>
          {copied === id ? <><Check size={13} /> Copied!</> : <><Copy size={13} /> Copy</>}
        </button>
      </div>
      <pre style={{ margin: 0, padding: '16px 20px', fontSize: 13, color: '#94a3b8', overflowX: 'auto', lineHeight: 1.7, fontFamily: 'monospace' }}>{code}</pre>
    </div>
  );

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>Embed</h2>
        <p style={{ fontSize: 14, color: '#64748b' }}>Add your branded calculator to any website in minutes.</p>
      </div>

      {/* Steps */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 32 }}>
        {[
          [Code2, '1. Copy the code', 'Copy the snippet below.'],
          [Monitor, '2. Paste into your site', 'Add it to any page on your website.'],
          [Smartphone, '3. It just works', 'Fully responsive on all devices.'],
        ].map(([Icon, title, desc]) => (
          <div key={title} style={{ background: 'white', borderRadius: 12, border: '1px solid #e2e8f0', padding: '18px 20px', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: '#fff7ed', border: '1px solid #fed7aa', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon size={17} color="#ea580c" strokeWidth={2} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 13.5, color: '#0f172a', marginBottom: 3 }}>{title}</div>
              <div style={{ fontSize: 12.5, color: '#64748b' }}>{desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Script embed */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 10 }}>Script Embed (recommended)</div>
        <CodeBlock code={snippet} id="script" label="HTML" />
      </div>

      {/* iFrame fallback */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 10 }}>iFrame Embed (fallback)</div>
        <CodeBlock code={iframeSnippet} id="iframe" label="HTML" />
      </div>

      {/* Preview link */}
      <div style={{ background: 'white', borderRadius: 14, border: '1px solid #e2e8f0', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 14.5, color: '#0f172a', marginBottom: 4 }}>Preview your widget</div>
          <div style={{ fontSize: 13.5, color: '#64748b' }}>See exactly how homeowners will experience your calculator.</div>
        </div>
        <a href={url(`/embed?company=${companyId}`)} target="_blank" rel="noopener noreferrer"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: '#ea580c', color: 'white', padding: '10px 20px', borderRadius: 9, textDecoration: 'none', fontWeight: 700, fontSize: 14, whiteSpace: 'nowrap' }}>
          Open Preview <ExternalLink size={14} />
        </a>
      </div>

      {/* Compatibility */}
      <div style={{ marginTop: 20, background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, padding: '14px 18px', fontSize: 13.5, color: '#166534' }}>
        Works with WordPress, Shopify, Wix, Squarespace, Webflow, Framer, and any custom HTML site.
      </div>
    </div>
  );
}
