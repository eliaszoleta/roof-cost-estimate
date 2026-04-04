import React, { useState } from 'react';
import { Home } from 'lucide-react';
import StepWrapper from './StepWrapper';

const METAL_TYPES   = [['standing_seam','Standing Seam'],['corrugated','Corrugated'],['ribbed','Ribbed / R-Panel']];
const TILE_TYPES    = [['clay_tile','Clay'],['concrete_tile','Concrete'],['slate','Slate']];
const FLAT_TYPES    = [['tpo','TPO'],['epdm','EPDM'],['modified_bitumen','Modified Bitumen']];
const PITCH_OPTIONS = [['low','Low (flat–4:12)'],['medium','Medium (4–8:12)'],['steep','Steep (8:12+)']];
const STORY_OPTIONS = [['1','1 story'],['2','2 stories'],['3','3+ stories']];
const SIZE_OPTIONS  = [
  ['under_1000','Under 1,000 sq ft'],
  ['1000_1500','1,000–1,500 sq ft'],
  ['1500_2000','1,500–2,000 sq ft'],
  ['2000_2500','2,000–2,500 sq ft'],
  ['2500_3000','2,500–3,000 sq ft'],
  ['over_3000','Over 3,000 sq ft'],
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

export default function RoofDetailsStep({ value, serviceType, onBack, onNext, primaryColor = '#ea580c' }) {
  const [roofSize, setRoofSize]     = useState(value.roofSize || '');
  const [stories, setStories]       = useState(value.stories || '');
  const [pitch, setPitch]           = useState(value.pitch || '');
  const [metalType, setMetalType]   = useState(value.metalType || '');
  const [tileType, setTileType]     = useState(value.tileType || '');
  const [flatType, setFlatType]     = useState(value.flatType || '');
  const [addOns, setAddOns]         = useState(value.addOns || []);

  const toggleAddOn = (id) => setAddOns(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const isAsphalt = serviceType === 'shingle_replacement';
  const isMetal   = serviceType === 'metal_roofing';
  const isTile    = serviceType === 'tile_roofing';
  const isFlat    = serviceType === 'flat_roof';

  const canNext = !!roofSize && !!stories && (isFlat || !!pitch) &&
    (isMetal ? !!metalType : true) &&
    (isTile  ? !!tileType  : true) &&
    (isFlat  ? !!flatType  : true);

  const SIZE_TO_SQFT = {
    under_1000: 800, '1000_1500': 1250, '1500_2000': 1750,
    '2000_2500': 2250, '2500_3000': 2750, over_3000: 3500,
  };
  const sqft = SIZE_TO_SQFT[roofSize] || 1750;

  const handleNext = () => {
    const base = { roofSize, stories: Number(stories), pitch, addOns };
    if (isFlat) {
      onNext({ ...base, buildingFootprint: sqft, flatMaterial: flatType });
    } else if (isMetal) {
      onNext({ ...base, houseSqft: sqft, metalType });
    } else if (isTile) {
      onNext({ ...base, houseSqft: sqft, tileType });
    } else {
      onNext({ ...base, houseSqft: sqft, shingleType: 'architectural' });
    }
  };

  const fieldLabel = { fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 0 };
  const fieldWrap  = { marginBottom: 18 };

  const ADDONS_ASPHALT = [
    ['new_decking',       'New roof decking'],
    ['ice_water_shield',  'Ice & water shield'],
    ['ridge_ventilation', 'Ridge ventilation'],
    ['gutter_replacement','Gutter replacement'],
  ];

  return (
    <StepWrapper
      icon={<Home size={17} color={primaryColor} />}
      title="Tell us about your roof"
      subtitle="We use these details to build an accurate estimate."
      onBack={onBack}
      onNext={handleNext}
      canNext={canNext}
      primaryColor={primaryColor}
    >
      <div style={fieldWrap}>
        <label style={fieldLabel}>Approximate roof size</label>
        <Chips options={SIZE_OPTIONS} value={roofSize} onChange={setRoofSize} primaryColor={primaryColor} />
      </div>

      <div style={fieldWrap}>
        <label style={fieldLabel}>Number of stories</label>
        <Chips options={STORY_OPTIONS} value={stories} onChange={setStories} primaryColor={primaryColor} />
      </div>

      {!isFlat && (
        <div style={fieldWrap}>
          <label style={fieldLabel}>Roof pitch</label>
          <Chips options={PITCH_OPTIONS} value={pitch} onChange={setPitch} primaryColor={primaryColor} />
        </div>
      )}

      {isMetal && (
        <div style={fieldWrap}>
          <label style={fieldLabel}>Metal roof type</label>
          <Chips options={METAL_TYPES} value={metalType} onChange={setMetalType} primaryColor={primaryColor} />
        </div>
      )}

      {isTile && (
        <div style={fieldWrap}>
          <label style={fieldLabel}>Tile material</label>
          <Chips options={TILE_TYPES} value={tileType} onChange={setTileType} primaryColor={primaryColor} />
        </div>
      )}

      {isFlat && (
        <div style={fieldWrap}>
          <label style={fieldLabel}>Flat roof system</label>
          <Chips options={FLAT_TYPES} value={flatType} onChange={setFlatType} primaryColor={primaryColor} />
        </div>
      )}

      {isAsphalt && (
        <div style={fieldWrap}>
          <label style={{ ...fieldLabel, marginBottom: 8 }}>Add-ons <span style={{ color: '#94a3b8', fontWeight: 400 }}>(optional)</span></label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {ADDONS_ASPHALT.map(([id, label]) => (
              <label key={id} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 13.5, color: '#374151', fontWeight: 500 }}>
                <input type="checkbox" checked={addOns.includes(id)} onChange={() => toggleAddOn(id)}
                  style={{ accentColor: primaryColor, width: 16, height: 16, cursor: 'pointer' }} />
                {label}
              </label>
            ))}
          </div>
        </div>
      )}
    </StepWrapper>
  );
}
