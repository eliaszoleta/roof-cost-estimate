import React, { useState } from 'react';
import { Droplets } from 'lucide-react';
import StepWrapper from './StepWrapper';

const MATERIALS = [
  ['aluminum', 'Aluminum (most common)'],
  ['vinyl',    'Vinyl (budget)'],
  ['steel',    'Steel (heavy duty)'],
  ['copper',   'Copper (premium)'],
];

const STORY_OPTIONS = [['1','1 story'],['2','2 stories'],['3','3+ stories']];

const LINEAR_FEET_OPTIONS = [
  ['under_100', 'Under 100 ft'],
  ['100_150',   '100–150 ft'],
  ['150_200',   '150–200 ft'],
  ['200_300',   '200–300 ft'],
  ['over_300',  'Over 300 ft'],
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

export default function GutterStep({ value, onBack, onNext, primaryColor = '#ea580c', loading = false }) {
  const [linearFeet, setLinearFeet]     = useState(value.linearFeet || '');
  const [gutterMaterial, setMaterial]   = useState(value.gutterMaterial || '');
  const [stories, setStories]           = useState(value.stories || '');
  const [addOns, setAddOns]             = useState(value.addOns || []);

  const toggleAddOn = (id) => setAddOns(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const canNext = !!linearFeet && !!gutterMaterial && !!stories;

  const fieldLabel = { fontSize: 13, fontWeight: 600, color: '#374151' };
  const fieldWrap  = { marginBottom: 18 };

  const ADDON_OPTIONS = [
    ['guards',     'Gutter guards'],
    ['downspouts', 'Downspout replacement'],
    ['fascia',     'Fascia board repair'],
  ];

  return (
    <StepWrapper
      icon={<Droplets size={17} color={primaryColor} />}
      title="Tell us about your gutters"
      subtitle="Gutter cost depends on material, linear footage, and stories."
      onBack={onBack}
      onNext={() => {
        const LF_MAP = { under_100: 75, '100_150': 125, '150_200': 175, '200_300': 250, over_300: 350 };
        onNext({
          linearFeet: LF_MAP[linearFeet] || 150,
          gutterMaterial,
          stories: Number(stories),
          downspouts: addOns.includes('downspouts') ? 4 : 0,
          gutterGuards: addOns.includes('guards'),
        });
      }}
      canNext={canNext}
      loading={loading}
      nextLabel={loading ? 'Calculating…' : 'Get My Estimate →'}
      primaryColor={primaryColor}
    >
      <div style={fieldWrap}>
        <label style={fieldLabel}>Approximate linear footage</label>
        <Chips options={LINEAR_FEET_OPTIONS} value={linearFeet} onChange={setLinearFeet} primaryColor={primaryColor} />
      </div>
      <div style={fieldWrap}>
        <label style={fieldLabel}>Gutter material</label>
        <Chips options={MATERIALS} value={gutterMaterial} onChange={setMaterial} primaryColor={primaryColor} />
      </div>
      <div style={fieldWrap}>
        <label style={fieldLabel}>Number of stories</label>
        <Chips options={STORY_OPTIONS} value={stories} onChange={setStories} primaryColor={primaryColor} />
      </div>
      <div style={fieldWrap}>
        <label style={{ ...fieldLabel, marginBottom: 8 }}>Add-ons <span style={{ color: '#94a3b8', fontWeight: 400 }}>(optional)</span></label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {ADDON_OPTIONS.map(([id, label]) => (
            <label key={id} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 13.5, color: '#374151', fontWeight: 500 }}>
              <input type="checkbox" checked={addOns.includes(id)} onChange={() => toggleAddOn(id)}
                style={{ accentColor: primaryColor, width: 16, height: 16, cursor: 'pointer' }} />
              {label}
            </label>
          ))}
        </div>
      </div>
    </StepWrapper>
  );
}
