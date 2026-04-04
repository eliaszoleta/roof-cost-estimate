import React, { useState } from 'react';
import { Copy, Check, ExternalLink } from 'lucide-react';

const BASE = 'https://eliaszoleta.github.io/roof-cost-estimate';

export default function EmbedTab({ companyId = 'demo' }) {
  const [copied, setCopied] = useState('');

  const HEIGHT = 680;
  const RADIUS = 12;

  const iframeCode = `<iframe
  src="${BASE}/embed?company=${companyId}"
  width="100%"
  height="${HEIGHT}"
  style="border:none;border-radius:${RADIUS}px;box-shadow:0 4px 24px rgba(0,0,0,0.10);"
  title="Roofing Cost Estimator"
  loading="lazy">
</iframe>`;

  const jsCode = `<div id="roofcalc-widget"></div>
<script>
  (function(){
    var el=document.createElement('iframe');
    el.src='${BASE}/embed?company=${companyId}';
    el.width='100%';el.height='${HEIGHT}';
    el.style.cssText='border:none;border-radius:${RADIUS}px;box-shadow:0 4px 24px rgba(0,0,0,.10);';
    el.title='Roofing Cost Estimator';el.loading='lazy';
    document.getElementById('roofcalc-widget').appendChild(el);
  })();
</script>`;

  const wpCode = `[roofcalc_widget company_id="${companyId}" height="${HEIGHT}"]`;

  const copy = (text, key) => {
    navigator.clipboard.writeText(text).then(() => { setCopied(key); setTimeout(() => setCopied(''), 2500); });
  };

  const CodeBlock = ({ id, label, badge, sub, code }) => (
    <div style={{ background: 'white', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden', marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontWeight: 700, fontSize: 15, color: '#0f172a' }}>{label}</span>
            {badge && <span style={{ background: '#eff6ff', color: '#1d4ed8', fontSize: 11.5, fontWeight: 700, padding: '2px 9px', borderRadius: 99, border: '1px solid #bfdbfe' }}>{badge}</span>}
          </div>
          {sub && <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 3 }}>{sub}</div>}
        </div>
        <button onClick={() => copy(code, id)}
          style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 16px', borderRadius: 8, border: '1.5px solid #e2e8f0', background: 'white', cursor: 'pointer', fontSize: 13.5, fontWeight: 600, color: copied === id ? '#16a34a' : '#374151', whiteSpace: 'nowrap' }}>
          {copied === id ? <><Check size={14} /> Copied!</> : <><Copy size={14} /> Copy Code</>}
        </button>
      </div>
      <pre style={{ margin: 0, padding: '16px 20px', fontSize: 13, background: '#0f172a', color: '#94a3b8', overflowX: 'auto', lineHeight: 1.7, fontFamily: '"Fira Code", "Cascadia Code", monospace' }}>{code}</pre>
    </div>
  );

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>Embed Your Widget</h2>
        <p style={{ fontSize: 14, color: '#64748b' }}>Paste the code below anywhere on your website to embed your branded calculator.</p>
      </div>

      <CodeBlock id="iframe" label="Standard iFrame" badge="Recommended" sub="Works on any website. Paste inside your page's HTML." code={iframeCode} />
      <CodeBlock id="js"     label="JavaScript Snippet" sub="Dynamically injects the widget. Good for CMS platforms." code={jsCode} />
      <CodeBlock id="wp"     label="WordPress Shortcode" sub="Install the RoofCalc WordPress plugin, then paste this shortcode." code={wpCode} />

      {/* Installation Guide */}
      <div style={{ background: 'white', borderRadius: 12, border: '1px solid #e2e8f0', padding: '22px 24px', marginBottom: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 18 }}>Installation Guide</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 24 }}>
          {[
            ['Wix', ['Go to Edit Site', 'Add an Embed element', 'Paste the iFrame code']],
            ['Squarespace', ['Add a Code Block', 'Switch to HTML mode', 'Paste the iFrame code']],
            ['WordPress', ['Open Gutenberg editor', 'Add a Custom HTML block', 'Paste the iFrame code']],
            ['Weebly / Duda', ['Add Embed Code element', 'Paste iFrame in the box', 'Publish your changes']],
          ].map(([platform, steps]) => (
            <div key={platform}>
              <div style={{ fontWeight: 700, fontSize: 14, color: '#0f172a', marginBottom: 10 }}>{platform}</div>
              <ol style={{ margin: 0, padding: '0 0 0 16px' }}>
                {steps.map((s, i) => <li key={i} style={{ fontSize: 13, color: '#64748b', marginBottom: 5, lineHeight: 1.5 }}>{s}</li>)}
              </ol>
            </div>
          ))}
        </div>
      </div>

      {/* Preview */}
      <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 12, padding: '18px 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 14.5, color: '#1e40af' }}>Preview your widget</div>
          <div style={{ fontSize: 13.5, color: '#3b82f6', marginTop: 3 }}>See exactly how it looks before embedding on your site.</div>
        </div>
        <a href={`${BASE}/embed?company=${companyId}`} target="_blank" rel="noopener noreferrer"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: '#2563eb', color: 'white', padding: '10px 20px', borderRadius: 9, textDecoration: 'none', fontWeight: 700, fontSize: 14, whiteSpace: 'nowrap' }}>
          Open Preview <ExternalLink size={14} />
        </a>
      </div>
    </div>
  );
}
