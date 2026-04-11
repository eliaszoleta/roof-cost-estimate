import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { AlertCircle, MapPin, BarChart3, ShieldOff, Zap } from 'lucide-react';
import { postCalculate } from '../../utils/api';
import ServiceSelect from './steps/ServiceSelect';
import LocationStep from './steps/LocationStep';
import RoofDetailsStep from './steps/RoofDetailsStep';
import RepairStep from './steps/RepairStep';
import InspectionStep from './steps/InspectionStep';
import GutterStep from './steps/GutterStep';
import ResultsScreen from './ResultsScreen';

// Lead capture moved to results screen (inline) — no separate lead step
const SERVICE_STEPS = {
  shingle_replacement: ['service', 'location', 'details',    'results'],
  metal_roofing:       ['service', 'location', 'details',    'results'],
  tile_roofing:        ['service', 'location', 'details',    'results'],
  flat_roof:           ['service', 'location', 'details',    'results'],
  roof_repair:         ['service', 'location', 'repair',     'results'],
  roof_inspection:     ['service', 'location', 'inspection', 'results'],
  gutter_replacement:  ['service', 'location', 'gutter',     'results'],
};

const DETAIL_STEP_COMPONENT = {
  details:    RoofDetailsStep,
  repair:     RepairStep,
  inspection: InspectionStep,
  gutter:     GutterStep,
};

const PROGRESS_LABELS = ['Service', 'Location', 'Details', 'Results'];

export default function RoofingCalculator({ companyConfig = null, embedded = false }) {
  const cardRef = useRef(null);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 640);
  const [serviceType, setServiceType] = useState(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [location, setLocation] = useState({ zip: '', state: '' });
  const [serviceDetails, setServiceDetails] = useState({});
  const [leadInfo, setLeadInfo] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [calcPayload, setCalcPayload] = useState(null); // stored for lead re-submit

  const steps = serviceType ? SERVICE_STEPS[serviceType] : ['service'];
  const currentStep = steps[stepIndex];

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 640);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    const param = new URLSearchParams(window.location.search).get('service');
    if (param && SERVICE_STEPS[param]) {
      setServiceType(param);
      setStepIndex(1);
    }
  }, []);

  useEffect(() => {
    if (stepIndex === 0 || !cardRef.current) return;
    const navbarHeight = 70;
    const top = cardRef.current.getBoundingClientRect().top + window.scrollY - navbarHeight;
    window.scrollTo({ top, behavior: 'smooth' });
  }, [stepIndex]);

  const goNext = () => setStepIndex(i => Math.min(i + 1, steps.length - 1));
  const goBack = () => setStepIndex(i => Math.max(i - 1, 0));

  const handleServiceSelect = (type) => {
    setServiceType(type);
    setServiceDetails({});
    setResult(null);
    setError(null);
    setStepIndex(1);
  };

  const handleLocationNext = (loc) => {
    setLocation(loc);
    goNext();
  };

  const handleDetailsNext = async (details) => {
    setServiceDetails(details);
    setError(null);
    setLoading(true);
    const payload = {
      serviceType,
      zip: location.zip || null,
      state: location.state || null,
      serviceDetails: details,
      companyId: companyConfig?.companyId || null,
    };
    setCalcPayload(payload);
    try {
      const res = await postCalculate(payload);
      setResult(res.data);
      goNext();
    } catch (err) {
      setError(err.message || 'Calculation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setServiceType(null);
    setStepIndex(0);
    setLocation({ zip: '', state: '' });
    setServiceDetails({});
    setLeadInfo(null);
    setResult(null);
    setError(null);
    setCalcPayload(null);
  };

  const primaryColor = companyConfig?.primaryColor || '#ea580c';
  const companyName = companyConfig?.companyName || null;
  const progressStep = Math.min(stepIndex, steps.length - 1);

  if (currentStep === 'results' && result) {
    return (
      <ResultsScreen
        result={result}
        serviceDetails={serviceDetails}
        companyConfig={companyConfig}
        embedded={embedded}
        onReset={handleReset}
        calcPayload={calcPayload}
      />
    );
  }

  const DetailComponent = DETAIL_STEP_COMPONENT[currentStep];

  return (
    <>
      {!embedded && (
        <Helmet>
          <title>Free Roofing Cost Estimator 2026 | RoofCalc</title>
          <meta name="description" content="Free roofing cost calculator for 2026. Get instant ZIP-code specific estimates: roof replacement $5,000–$15,000, repair $150–$1,500, gutter installation, inspections & more. No signup needed." />
          <meta property="og:title" content="Free Roofing Cost Estimator 2026 | RoofCalc" />
          <meta property="og:type" content="website" />
        </Helmet>
      )}

      <div style={{
        background: embedded ? 'white' : 'linear-gradient(135deg, #fff7ed 0%, #f8fafc 100%)',
        minHeight: embedded ? 'auto' : '100vh',
        padding: embedded ? '0' : '24px 16px 40px',
      }}>
        {!embedded && currentStep === 'service' && (
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <div style={{ display: 'inline-block', background: '#ffedd5', color: '#9a3412', padding: '4px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600, marginBottom: 10 }}>
              Free • Instant • No signup required
            </div>
            <h1 style={{ fontSize: 'clamp(22px, 4vw, 36px)', fontWeight: 800, color: '#0f172a', lineHeight: 1.2, marginBottom: 8 }}>
              How Much Does a New Roof Cost{' '}
              <span style={{ color: primaryColor }}>In Your Area?</span>
            </h1>
            <p style={{ fontSize: 15, color: '#64748b', maxWidth: 480, margin: '0 auto' }}>
              ZIP-code accurate estimates for any roofing project — in seconds.
            </p>
          </div>
        )}

        <div ref={cardRef} style={{
          maxWidth: 720,
          margin: '0 auto',
          background: 'white',
          borderRadius: embedded ? 0 : 16,
          boxShadow: embedded ? 'none' : '0 8px 40px rgba(0,0,0,0.10)',
          overflow: 'hidden',
          border: embedded ? 'none' : '1px solid #e2e8f0',
        }}>
          {currentStep !== 'service' && currentStep !== 'results' && (
            <div style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', padding: '16px 24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                {PROGRESS_LABELS.slice(0, steps.length).map((label, i) => (
                  <span key={label} style={{
                    fontSize: 12, fontWeight: 600,
                    color: i <= progressStep ? primaryColor : '#94a3b8',
                  }}>
                    {label}
                  </span>
                ))}
              </div>
              <div style={{ height: 4, background: '#e2e8f0', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${(progressStep / (steps.length - 1)) * 100}%`,
                  background: primaryColor,
                  borderRadius: 2,
                  transition: 'width 0.3s ease',
                }} />
              </div>
            </div>
          )}

          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fef2f2', borderBottom: '1px solid #fecaca', padding: '11px 24px', color: '#dc2626', fontSize: 13.5 }}>
              <AlertCircle size={15} /> {error}
            </div>
          )}

          <div style={{ padding: embedded ? '20px 16px' : isMobile ? '20px 16px' : '32px 40px' }}>
            {currentStep === 'service' && (
              <ServiceSelect onSelect={handleServiceSelect} primaryColor={primaryColor} companyName={companyName} companyConfig={companyConfig} />
            )}
            {currentStep === 'location' && (
              <LocationStep
                value={location}
                onBack={goBack}
                onNext={handleLocationNext}
                primaryColor={primaryColor}
              />
            )}
            {DetailComponent && (
              <DetailComponent
                value={serviceDetails}
                serviceType={serviceType}
                onBack={goBack}
                onNext={handleDetailsNext}
                primaryColor={primaryColor}
                location={location}
                companyConfig={companyConfig}
                loading={loading}
              />
            )}
          </div>
        </div>

        {!embedded && currentStep === 'service' && (
          <div style={{ maxWidth: 720, margin: '20px auto 0', display: 'flex', justifyContent: 'center', gap: 28, flexWrap: 'wrap' }}>
            {[
              { Icon: MapPin,    label: 'All 50 states',       color: '#059669' },
              { Icon: BarChart3, label: '7 service types',     color: '#ea580c' },
              { Icon: ShieldOff, label: 'No email required',   color: '#7c3aed' },
              { Icon: Zap,       label: 'Instant results',     color: '#2563eb' },
            ].map(({ Icon, label, color }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#64748b', fontWeight: 500 }}>
                <Icon size={14} color={color} /> {label}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
