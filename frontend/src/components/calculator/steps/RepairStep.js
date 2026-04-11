import React, { useState } from 'react';
import { Wrench } from 'lucide-react';
import StepWrapper from './StepWrapper';

const REPAIR_TYPES = [
  ['leak',       'Leak / water intrusion'],
  ['shingles',   'Missing or damaged shingles'],
  ['flashing',   'Flashing repair'],
  ['valley',     'Valley repair'],
  ['ridge',      'Ridge cap repair'],
  ['puncture',   'Puncture / hole'],
  ['structural', 'Structural / decking damage'],
];

const DAMAGE_SIZES = [
  ['small',  'Small (< 10 sq ft)'],
  ['medium', 'Medium (10–50 sq ft)'],
  ['large',  'Large (50+ sq ft)'],
];

const STORY_OPTIONS = [['1','1 story'],['2','2 stories'],['3','3+ stories']];

const ROOF_AGE = [
  ['lt5',    'Under 5 years'],
  ['5to10',  '5–10 years'],
  ['10to20', '10–20 years'],
  ['gt20',   'Over 20 years'],
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

export default function RepairStep({ value, onBack, onNext, primaryColor = '#ea580c', loading = false }) {
  const [repairType, setRepairType] = useState(value.repairType || '');
  const [damageSize, setDamageSize] = useState(value.damageSize || '');
  const [stories, setStories]       = useState(value.stories || '');
  const [roofAge, setRoofAge]       = useState(value.roofAge || '');

  const canNext = !!repairType && !!damageSize && !!stories && !!roofAge;

  const fieldLabel = { fontSize: 13, fontWeight: 600, color: '#374151' };
  const fieldWrap  = { marginBottom: 18 };

  return (
    <StepWrapper
      icon={<Wrench size={17} color={primaryColor} />}
      title="Tell us about the repair"
      subtitle="More detail means a more accurate estimate."
      onBack={onBack}
      onNext={() => onNext({ repairSize: damageSize, repairType, stories, roofAge })}
      canNext={canNext}
      loading={loading}
      nextLabel={loading ? 'Calculating…' : 'Get My Estimate →'}
      primaryColor={primaryColor}
    >
      <div style={fieldWrap}>
        <label style={fieldLabel}>What needs to be repaired?</label>
        <Chips options={REPAIR_TYPES} value={repairType} onChange={setRepairType} primaryColor={primaryColor} />
      </div>
      <div style={fieldWrap}>
        <label style={fieldLabel}>How large is the damaged area?</label>
        <Chips options={DAMAGE_SIZES} value={damageSize} onChange={setDamageSize} primaryColor={primaryColor} />
      </div>
      <div style={fieldWrap}>
        <label style={fieldLabel}>Stories</label>
        <Chips options={STORY_OPTIONS} value={stories} onChange={setStories} primaryColor={primaryColor} />
      </div>
      <div style={fieldWrap}>
        <label style={fieldLabel}>Approximate roof age</label>
        <Chips options={ROOF_AGE} value={roofAge} onChange={setRoofAge} primaryColor={primaryColor} />
      </div>
    </StepWrapper>
  );
}
