import React from 'react';
import { ArrowLeft } from 'lucide-react';

export default function StepWrapper({ icon, title, subtitle, onBack, onNext, canNext, nextLabel = 'Continue →', loading = false, children, primaryColor = '#ea580c' }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 5 }}>
        {icon && (
          <div style={{ width: 36, height: 36, borderRadius: 9, background: '#fff7ed', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {icon}
          </div>
        )}
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0f172a', letterSpacing: '-0.2px', margin: 0 }}>{title}</h2>
      </div>
      {subtitle && <p style={{ color: '#64748b', fontSize: 13.5, marginBottom: 22, marginTop: 4 }}>{subtitle}</p>}
      {children}
      <div style={{ display: 'flex', gap: 10, marginTop: 28, paddingTop: 20, borderTop: '1px solid #f1f5f9' }}>
        <button
          onClick={onBack}
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '13px 20px', border: '1.5px solid #e2e8f0', borderRadius: 10, background: 'white', cursor: 'pointer', fontSize: 14, fontWeight: 600, color: '#64748b' }}
        >
          <ArrowLeft size={15} /> Back
        </button>
        <button
          onClick={onNext}
          disabled={!canNext || loading}
          style={{ flex: 1, padding: '13px 20px', borderRadius: 10, border: 'none', cursor: canNext && !loading ? 'pointer' : 'not-allowed', fontSize: 14, fontWeight: 700, color: 'white', background: canNext && !loading ? primaryColor : '#cbd5e1', transition: 'all 0.15s' }}
        >
          {nextLabel}
        </button>
      </div>
    </div>
  );
}
