import React, { useState } from 'react';
import { Search } from 'lucide-react';
import StepWrapper from './StepWrapper';

const PROPERTY_TYPES = [
  ['residential', 'Residential'],
  ['commercial',  'Commercial'],
];

const STORY_OPTIONS = [['1','1 story'],['2','2 stories'],['3','3+ stories']];

const ROOF_AGE = [
  ['lt5',    'Under 5 years'],
  ['5to10',  '5–10 years'],
  ['10to20', '10–20 years'],
  ['gt20',   'Over 20 years'],
];

const REASONS = [
  ['pre_purchase', 'Pre-purchase'],
  ['annual',       'Annual checkup'],
  ['after_storm',  'After storm damage'],
  ['insurance',    'Insurance claim'],
  ['other',        'Other'],
];

function Chips({ options, value, onChange, primaryColor }) {
  return (
    <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginTop: 6 }}>
      {options.map(([id, label]) => (
        <button key={id} type="button" onClick={() => onChange(id)}
          style={{
            padding: '8px 14px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer',
            border: `1.5px solid ${value === id ? primaryColor : '#e2e8f0'}`,
            background: value === id ? primaryColor : 'white',
            color: value === id ? 'white' : '#374151',
            transition: 'all 0.15s',
          }}
        >{label}</button>
      ))}
    </div>
  );
}

export default function InspectionStep({ value, onBack, onNext, primaryColor = '#ea580c', loading = false }) {
  const [propertyType, setPropertyType] = useState(value.propertyType || '');
  const [stories, setStories]           = useState(value.stories || '');
  const [roofAge, setRoofAge]           = useState(value.roofAge || '');
  const [reason, setReason]             = useState(value.reason || '');

  const canNext = !!propertyType && !!stories && !!roofAge;

  const fieldLabel = { fontSize: 13, fontWeight: 600, color: '#374151' };
  const fieldWrap  = { marginBottom: 18 };

  return (
    <StepWrapper
      icon={<Search size={17} color={primaryColor} />}
      title="Tell us about the property"
      subtitle="Help us estimate your inspection cost."
      onBack={onBack}
      onNext={() => onNext({
        inspectionType: reason === 'after_storm' ? 'post_storm' : 'standard',
        propertyType, stories, roofAge, reason,
      })}
      canNext={canNext}
      loading={loading}
      nextLabel={loading ? 'Calculating…' : 'Get My Estimate →'}
      primaryColor={primaryColor}
    >
      <div style={fieldWrap}>
        <label style={fieldLabel}>Property type</label>
        <Chips options={PROPERTY_TYPES} value={propertyType} onChange={setPropertyType} primaryColor={primaryColor} />
      </div>
      <div style={fieldWrap}>
        <label style={fieldLabel}>Number of stories</label>
        <Chips options={STORY_OPTIONS} value={stories} onChange={setStories} primaryColor={primaryColor} />
      </div>
      <div style={fieldWrap}>
        <label style={fieldLabel}>Approximate roof age</label>
        <Chips options={ROOF_AGE} value={roofAge} onChange={setRoofAge} primaryColor={primaryColor} />
      </div>
      <div style={fieldWrap}>
        <label style={fieldLabel}>Reason for inspection <span style={{ color: '#94a3b8', fontWeight: 400 }}>(optional)</span></label>
        <Chips options={REASONS} value={reason} onChange={setReason} primaryColor={primaryColor} />
      </div>
    </StepWrapper>
  );
}
