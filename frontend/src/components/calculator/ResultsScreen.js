import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { MapPin, AlertTriangle, Zap, Phone, Share2, Printer, Check, ArrowLeft, CheckCircle2, XCircle, AlertCircle, Mail, Loader2 } from 'lucide-react';
import { formatPrice, formatPriceRange, serviceTypeLabel, urgencyColor } from '../../utils/formatters';
import { postCalculate } from '../../utils/api';

export default function ResultsScreen({ result, serviceDetails, companyConfig, embedded, onReset, calcPayload }) {
  const [shared, setShared] = useState(false);
  const [leadName, setLeadName]     = useState('');
  const [leadEmail, setLeadEmail]   = useState('');
  const [leadPhone, setLeadPhone]   = useState('');
  const [leadSending, setLeadSending] = useState(false);
  const [leadSent, setLeadSent]     = useState(false);
  const [leadError, setLeadError]   = useState(null);

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, []);

  if (!result) return null;

  const {
    totalLow, totalHigh, stateName, stateMultiplier,
    adjustments = [], keyFactors = [], disclaimer, urgencyLevel,
    serviceType, unit, included = [], notIncluded = [],
  } = result;

  const primaryColor = companyConfig?.primaryColor || '#ea580c';
  const ctaPhone = companyConfig?.ctaPhone || null;
  const ctaButtonText = companyConfig?.ctaButtonText || 'Get Free Quotes from Local Roofers →';
  const ctaButtonUrl = companyConfig?.ctaButtonUrl || null;
  const companyName = companyConfig?.companyName || null;

  const urgColor = urgencyColor(urgencyLevel);
  const isHighState = stateMultiplier >= 1.15;
  const isLowState = stateMultiplier <= 0.85;

  const emailValid = !leadEmail || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(leadEmail);

  const handleLeadSubmit = async (e) => {
    e.preventDefault();
    if (!leadEmail || !emailValid) return;
    setLeadSending(true);
    setLeadError(null);
    try {
      if (calcPayload) {
        await postCalculate({ ...calcPayload, leadInfo: { name: leadName || null, email: leadEmail, phone: leadPhone || null } });
      } else {
        // No-backend: save to localStorage
        try {
          const leads = JSON.parse(localStorage.getItem('rc_leads') || '[]');
          leads.unshift({
            id: Date.now().toString(),
            name: leadName || null, email: leadEmail, phone: leadPhone || null,
            service_type: result.serviceType,
            estimated_price_low: result.totalLow, estimated_price_high: result.totalHigh,
            created_at: new Date().toISOString(),
          });
          localStorage.setItem('rc_leads', JSON.stringify(leads.slice(0, 1000)));
        } catch {}
      }
      setLeadSent(true);
    } catch (err) {
      setLeadError('Could not send — please try again.');
    } finally {
      setLeadSending(false);
    }
  };

  const handleShare = async () => {
    const payload = { r: result, d: serviceDetails };
    const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
    const url = `${window.location.origin}/results#${encoded}`;
    try {
      await navigator.clipboard.writeText(url);
      setShared(true);
      setTimeout(() => setShared(false), 3000);
    } catch {
      window.prompt('Copy this link:', url);
    }
  };

  const headerBg = urgencyLevel === 'critical'
    ? 'linear-gradient(135deg, #7f1d1d, #dc2626)'
    : urgencyLevel === 'high'
    ? 'linear-gradient(135deg, #78350f, #d97706)'
    : `linear-gradient(135deg, ${primaryColor}, ${primaryColor}cc)`;

  return (
    <>
      {!embedded && (
        <Helmet>
          <title>{serviceTypeLabel(serviceType)} Cost Estimate — {stateName} | RoofCalc</title>
          <meta name="description" content={`Your estimated cost for ${serviceTypeLabel(serviceType).toLowerCase()} in ${stateName}: ${formatPriceRange(totalLow, totalHigh)}.`} />
        </Helmet>
      )}

      <div style={{ padding: embedded ? '0' : '40px 16px', background: embedded ? 'white' : '#f8fafc', minHeight: embedded ? 'auto' : '100vh' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>

          <div style={{ background: 'white', borderRadius: 16, overflow: 'hidden', boxShadow: embedded ? 'none' : '0 8px 40px rgba(0,0,0,0.10)', border: embedded ? 'none' : '1px solid #e2e8f0', marginBottom: 20 }}>

            {/* Header */}
            <div style={{ background: headerBg, padding: '28px 32px', color: 'white' }}>
              <div style={{ fontSize: 11, fontWeight: 700, opacity: 0.8, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {serviceTypeLabel(serviceType)} Estimate · {stateName}
              </div>
              <div style={{ fontSize: 'clamp(32px, 8vw, 48px)', fontWeight: 800, lineHeight: 1.1, marginBottom: 8, letterSpacing: '-1px' }}>
                {formatPrice(totalLow)} – {formatPrice(totalHigh)}
              </div>
              <div style={{ fontSize: 13.5, opacity: 0.85 }}>
                {unit === 'per_sqft' ? 'total installed' : 'total estimate'}
                {isHighState && ` · ${stateName} is a higher-cost market`}
                {isLowState && ` · ${stateName} is a lower-cost market`}
              </div>
            </div>

            {/* Body */}
            <div style={{ padding: '24px 28px' }}>

              {disclaimer && (
                <div style={{ background: urgencyLevel === 'critical' ? '#fef2f2' : '#fffbeb', border: `1px solid ${urgencyLevel === 'critical' ? '#fecaca' : '#fde68a'}`, borderRadius: 10, padding: '13px 16px', marginBottom: 20, display: 'flex', gap: 10 }}>
                  <div style={{ flexShrink: 0, marginTop: 1 }}>
                    {urgencyLevel === 'critical'
                      ? <AlertTriangle size={16} color="#dc2626" />
                      : <Zap size={16} color="#d97706" />}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: urgColor, marginBottom: 3, fontSize: 13 }}>
                      {urgencyLevel === 'critical' ? 'Important Notice' : 'Heads Up'}
                    </div>
                    <p style={{ fontSize: 13, color: urgencyLevel === 'critical' ? '#7f1d1d' : '#78350f', lineHeight: 1.6, margin: 0 }}>{disclaimer}</p>
                  </div>
                </div>
              )}

              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10 }}>Price breakdown</div>
                <div style={{ border: '1px solid #f1f5f9', borderRadius: 10, overflow: 'hidden' }}>
                  {adjustments.map((adj, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', borderBottom: i < adjustments.length - 1 ? '1px solid #f8fafc' : 'none', fontSize: 13.5, background: i % 2 === 0 ? 'white' : '#fafafa' }}>
                      <span style={{ color: '#374151', textTransform: 'capitalize' }}>{adj.label}</span>
                      <span style={{ fontWeight: 600, color: (adj.low < 0 || adj.high < 0) ? '#16a34a' : '#0f172a' }}>
                        {adj.low < 0
                          ? `−${formatPrice(Math.abs(adj.low))} – −${formatPrice(Math.abs(adj.high))}`
                          : (adj.low === 0 && adj.high === 0 ? 'Included' : formatPriceRange(adj.low, adj.high))}
                      </span>
                    </div>
                  ))}
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '13px 14px', background: '#f8fafc', borderTop: '1.5px solid #e2e8f0', fontWeight: 700, fontSize: 15 }}>
                    <span>Estimated total</span>
                    <span style={{ color: primaryColor }}>{formatPriceRange(totalLow, totalHigh)}</span>
                  </div>
                </div>
              </div>

              {keyFactors.length > 0 && (
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10 }}>Key factors in your estimate</div>
                  <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
                    {keyFactors.map((f, i) => (
                      <div key={i} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 7, padding: '6px 12px', fontSize: 12.5 }}>
                        <span style={{ color: '#64748b' }}>{f.label}: </span>
                        <span style={{ fontWeight: 600, color: '#0f172a', textTransform: 'capitalize' }}>{f.impact}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ background: '#fff7ed', borderRadius: 10, padding: '13px 16px', marginBottom: 20, fontSize: 13, color: '#9a3412', display: 'flex', gap: 9, alignItems: 'flex-start' }}>
                <MapPin size={14} style={{ marginTop: 2, flexShrink: 0 }} />
                <span>
                  <strong>{stateName} market: </strong>
                  {stateMultiplier > 1.05 && `Roofing prices in ${stateName} run ${Math.round((stateMultiplier - 1) * 100)}% above the national average.`}
                  {stateMultiplier < 0.95 && `Roofing prices in ${stateName} run ${Math.round((1 - stateMultiplier) * 100)}% below the national average.`}
                  {stateMultiplier >= 0.95 && stateMultiplier <= 1.05 && `${stateName} is close to the national average for roofing costs.`}
                </span>
              </div>

              {/* What's included */}
              {(included.length > 0 || notIncluded.length > 0) && (
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10 }}>What's typically included</div>
                  <div style={{ border: '1px solid #f1f5f9', borderRadius: 10, overflow: 'hidden' }}>
                    {included.map((item, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 9, padding: '9px 14px', borderBottom: '1px solid #f8fafc', background: 'white', fontSize: 13 }}>
                        <CheckCircle2 size={14} color="#16a34a" style={{ flexShrink: 0, marginTop: 1 }} />
                        <span style={{ color: '#374151' }}>{item}</span>
                      </div>
                    ))}
                    {notIncluded.map((item, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 9, padding: '9px 14px', borderBottom: i < notIncluded.length - 1 ? '1px solid #f8fafc' : 'none', background: '#fafafa', fontSize: 13 }}>
                        <XCircle size={14} color="#f59e0b" style={{ flexShrink: 0, marginTop: 1 }} />
                        <span style={{ color: '#64748b' }}><strong style={{ color: '#374151', fontWeight: 600 }}>Not included:</strong> {item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Contractor red flags */}
              <div style={{ background: '#fefce8', border: '1px solid #fde68a', borderRadius: 10, padding: '14px 16px', marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
                  <AlertCircle size={14} color="#d97706" />
                  <span style={{ fontWeight: 700, fontSize: 13, color: '#78350f' }}>4 red flags to watch for when getting quotes</span>
                </div>
                {[
                  ['Demands full payment upfront', 'A small deposit (10–30%) is normal. Full payment before work starts is a scam signal.'],
                  ['Quote is way below everyone else', "Storm chasers and uninsured crews low-ball then disappear. If it seems too good to be true, it is."],
                  ["Can't provide license & insurance certificate", 'Always ask for their roofing license number and a certificate of insurance — verify both before signing.'],
                  ['No written contract', 'Every legitimate contractor provides a written contract with materials, timeline, warranty terms, and payment schedule.'],
                ].map(([flag, detail], i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, marginBottom: i < 3 ? 8 : 0 }}>
                    <span style={{ fontWeight: 800, color: '#d97706', fontSize: 13, flexShrink: 0, marginTop: 1 }}>!</span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 12.5, color: '#78350f' }}>{flag}</div>
                      <div style={{ fontSize: 12, color: '#92400e', lineHeight: 1.5 }}>{detail}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ background: embedded && companyName ? `${primaryColor}08` : '#f8fafc', border: `1px solid ${embedded && companyName ? primaryColor + '28' : '#e2e8f0'}`, borderRadius: 12, padding: '18px 20px' }}>
                <div style={{ fontWeight: 700, fontSize: 15, color: '#0f172a', marginBottom: 4 }}>
                  {companyName ? `Ready to book with ${companyName}?` : 'Ready to get real quotes?'}
                </div>
                <p style={{ fontSize: 13, color: '#64748b', marginBottom: 14, margin: '4px 0 14px' }}>
                  {companyName ? 'Contact us for a free, no-obligation on-site estimate.' : 'Compare quotes from vetted local roofing contractors.'}
                </p>
                <div style={{ display: 'flex', gap: 9, flexWrap: 'wrap' }}>
                  {ctaButtonUrl && (
                    <a href={ctaButtonUrl} target="_blank" rel="noopener noreferrer"
                      style={{ background: primaryColor, color: 'white', padding: '11px 22px', borderRadius: 8, textDecoration: 'none', fontWeight: 700, fontSize: 14 }}>
                      {ctaButtonText}
                    </a>
                  )}
                  {ctaPhone && (
                    <a href={`tel:${ctaPhone}`}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: '#16a34a', color: 'white', padding: '11px 22px', borderRadius: 8, textDecoration: 'none', fontWeight: 700, fontSize: 14 }}>
                      <Phone size={14} /> Call {ctaPhone}
                    </a>
                  )}
                  {!ctaButtonUrl && !ctaPhone && (
                    <a href="/" style={{ background: primaryColor, color: 'white', padding: '11px 22px', borderRadius: 8, textDecoration: 'none', fontWeight: 700, fontSize: 14 }}>
                      {ctaButtonText}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Email this estimate */}
          <div style={{ background: 'white', borderRadius: 16, overflow: 'hidden', boxShadow: embedded ? 'none' : '0 2px 12px rgba(0,0,0,0.07)', border: embedded ? 'none' : '1px solid #e2e8f0', marginBottom: 12 }}>
            <div style={{ padding: '18px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: 9, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Mail size={16} color="#2563eb" />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14.5, color: '#0f172a' }}>Email this estimate to yourself</div>
                <div style={{ fontSize: 12, color: '#64748b' }}>Optional — get a copy in your inbox. No spam, ever.</div>
              </div>
            </div>
            <div style={{ padding: '16px 24px' }}>
              {leadSent ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#16a34a', fontWeight: 600, fontSize: 14 }}>
                  <CheckCircle2 size={18} /> Estimate sent to {leadEmail}
                </div>
              ) : (
                <form onSubmit={handleLeadSubmit}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
                    <input type="text" placeholder="Your name (optional)" value={leadName} onChange={e => setLeadName(e.target.value)}
                      style={{ padding: '10px 12px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 13, outline: 'none', color: '#0f172a' }} />
                    <input type="tel" placeholder="Phone (optional)" value={leadPhone} onChange={e => setLeadPhone(e.target.value)}
                      style={{ padding: '10px 12px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 13, outline: 'none', color: '#0f172a' }} />
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input type="email" placeholder="Email address *" value={leadEmail} onChange={e => setLeadEmail(e.target.value)}
                      style={{ flex: 1, padding: '10px 12px', border: `1.5px solid ${leadEmail && !emailValid ? '#dc2626' : '#e2e8f0'}`, borderRadius: 8, fontSize: 13, outline: 'none', color: '#0f172a' }} />
                    <button type="submit" disabled={!leadEmail || !emailValid || leadSending}
                      style={{ padding: '10px 18px', borderRadius: 8, border: 'none', background: leadEmail && emailValid ? '#2563eb' : '#cbd5e1', color: 'white', fontWeight: 700, fontSize: 13, cursor: leadEmail && emailValid ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}>
                      {leadSending ? <><Loader2 size={13} className="spin" /> Sending…</> : 'Send →'}
                    </button>
                  </div>
                  {leadError && <div style={{ color: '#dc2626', fontSize: 12, marginTop: 6 }}>{leadError}</div>}
                  {leadEmail && !emailValid && <div style={{ color: '#dc2626', fontSize: 12, marginTop: 4 }}>Please enter a valid email.</div>}
                </form>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={onReset} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 20px', border: '1.5px solid #e2e8f0', borderRadius: 8, background: 'white', cursor: 'pointer', fontWeight: 600, fontSize: 13.5, color: '#374151' }}>
              <ArrowLeft size={14} /> New Estimate
            </button>
            {!embedded && (
              <button onClick={handleShare} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 20px', border: '1.5px solid #e2e8f0', borderRadius: 8, background: 'white', cursor: 'pointer', fontWeight: 600, fontSize: 13.5, color: '#374151' }}>
                {shared ? <><Check size={14} /> Copied!</> : <><Share2 size={14} /> Share Results</>}
              </button>
            )}
            {!embedded && (
              <button onClick={() => window.print()} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 20px', border: '1.5px solid #e2e8f0', borderRadius: 8, background: 'white', cursor: 'pointer', fontWeight: 600, fontSize: 13.5, color: '#374151' }}>
                <Printer size={14} /> Print
              </button>
            )}
          </div>

          {!embedded && (
            <p style={{ textAlign: 'center', fontSize: 11.5, color: '#94a3b8', marginTop: 16, maxWidth: 520, margin: '16px auto 0' }}>
              These estimates are for informational purposes only. Actual prices vary. Always get multiple quotes from licensed, insured roofing contractors.
            </p>
          )}
        </div>
      </div>
    </>
  );
}
