import React from 'react';
import { Check, CreditCard, Shield, Zap, ArrowRight, ExternalLink } from 'lucide-react';
import { url } from '../../../utils/routes';

const PLAN_FEATURES = [
  'Embeddable estimator widget',
  'Custom branding & colors',
  'Your logo & contact info on results',
  'Lead capture (name, email, phone)',
  'Lead management dashboard',
  'Instant email notifications',
  'Unlimited estimates',
  'Priority support',
];

export default function SubscriptionTab({ session }) {
  // Demo: show as active trial for 14 days from signup
  const trialEnd = new Date();
  trialEnd.setDate(trialEnd.getDate() + 14);
  const trialEndStr = trialEnd.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>Subscription</h2>
        <p style={{ fontSize: 14, color: '#64748b' }}>Manage your plan and billing.</p>
      </div>

      {/* Current plan card */}
      <div style={{ background: 'white', borderRadius: 16, border: '1.5px solid #e2e8f0', padding: '28px', marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 20 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#ea580c', textTransform: 'uppercase', letterSpacing: '0.08em', background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: 6, padding: '3px 10px' }}>Pro Plan</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 6, padding: '3px 10px' }}>
              <div style={{ width: 7, height: 7, borderRadius: 99, background: '#22c55e' }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: '#166534' }}>Free Trial</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, marginBottom: 8 }}>
            <span style={{ fontSize: 38, fontWeight: 800, color: '#0f172a', lineHeight: 1, letterSpacing: '-1px' }}>$149</span>
            <span style={{ fontSize: 15, color: '#64748b', marginBottom: 4 }}>/mo</span>
          </div>
          <div style={{ fontSize: 13.5, color: '#64748b' }}>
            Trial ends <strong style={{ color: '#0f172a' }}>{trialEndStr}</strong>. Add a payment method to keep access.
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button
            style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '10px 18px', borderRadius: 9, border: 'none', background: '#ea580c', color: 'white', cursor: 'pointer', fontWeight: 700, fontSize: 14, boxShadow: '0 2px 10px rgba(234,88,12,0.25)' }}>
            <CreditCard size={15} /> Add Payment Method
          </button>
        </div>
      </div>

      {/* Plan features */}
      <div style={{ background: 'white', borderRadius: 14, border: '1px solid #e2e8f0', padding: '24px', marginBottom: 20 }}>
        <div style={{ fontWeight: 700, fontSize: 14.5, color: '#0f172a', marginBottom: 18, paddingBottom: 12, borderBottom: '1px solid #f1f5f9' }}>What's included</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 10 }}>
          {PLAN_FEATURES.map(f => (
            <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 20, height: 20, borderRadius: 6, background: '#f0fdf4', border: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Check size={12} color="#16a34a" strokeWidth={2.5} />
              </div>
              <span style={{ fontSize: 14, color: '#374151' }}>{f}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Trust strip */}
      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
        {[
          [Shield, 'No long-term contract'],
          [Zap, 'Cancel anytime'],
          [CreditCard, 'Secure billing via Stripe'],
        ].map(([Icon, label]) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13.5, color: '#64748b' }}>
            <Icon size={15} color="#94a3b8" /> {label}
          </div>
        ))}
      </div>

      {/* Cancel */}
      <div style={{ marginTop: 32, padding: '20px 24px', background: '#f8fafc', borderRadius: 12, border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ fontWeight: 600, fontSize: 14, color: '#374151', marginBottom: 3 }}>Need to cancel?</div>
          <div style={{ fontSize: 13, color: '#64748b' }}>You'll retain access until the end of your current period.</div>
        </div>
        <button style={{ padding: '8px 16px', borderRadius: 8, border: '1.5px solid #e2e8f0', background: 'white', color: '#64748b', cursor: 'pointer', fontWeight: 600, fontSize: 13.5 }}>
          Cancel Subscription
        </button>
      </div>
    </div>
  );
}
