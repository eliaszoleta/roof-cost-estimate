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
const GRADE_OPTIONS = [
  ['standard',      '3-Tab / Standard',    '$',   '20–25 yr warranty, basic protection'],
  ['architectural', 'Architectural',        '$$',  'Most popular, 30 yr warranty'],
  ['designer',      'Designer / Premium',  '$$$', 'Impact-resistant, 50 yr warranty'],
];
const COMPLEXITY_OPTIONS = [
  ['simple',   'Simple',   'Basic gable, few cuts or angles'],
  ['moderate', 'Moderate', 'Hip/valley roof, some angles'],
  ['complex',  'Complex',  'Dormers, multiple peaks, many angles'],
];
const LAYERS_OPTIONS = [
  ['one',     '1 Layer',    'Standard tear-off cost'],
  ['two',     '2 Layers',   'Extra removal & disposal'],
  ['unknown', "Don't Know", "We'll add a safety buffer"],
];
const PENETRATION_OPTIONS = [
  ['none',   'None',  ''],
  ['low',    '1–2',   'chimney or skylight'],
  ['medium', '3–4',   'multiple penetrations'],
  ['high',   '5+',    'complex penetrations'],
];
const ADDONS_ASPHALT = [
  ['new_decking',       'New roof decking'],
  ['ice_water_shield',  'Ice & water shield'],
  ['ridge_ventilation', 'Ridge ventilation'],
  ['gutter_replacement','Gutter replacement'],
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

function GradeCards({ value, onChange, primaryColor }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 6 }}>
      {GRADE_OPTIONS.map(([id, label, price, desc]) => {
        const active = value === id;
        return (
          <button key={id} type="button" onClick={() => onChange(id)}
            style={{
              padding: '12px 10px', borderRadius: 10, cursor: 'pointer', textAlign: 'left',
              border: `1.5px solid ${active ? primaryColor : '#e2e8f0'}`,
              background: active ? `${primaryColor}08` : 'white',
              transition: 'all 0.15s',
            }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: active ? primaryColor : '#cbd5e1', marginBottom: 4 }}>{price}</div>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: active ? '#0f172a' : '#374151', marginBottom: 3 }}>{label}</div>
            <div style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.4 }}>{desc}</div>
          </button>
        );
      })}
    </div>
  );
}

function ComplexityCards({ value, onChange, primaryColor }) {
  const ICONS = {
    simple:   <svg width="28" height="20" viewBox="0 0 28 20"><polygon points="14,2 26,18 2,18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/></svg>,
    moderate: <svg width="28" height="20" viewBox="0 0 28 20"><polygon points="14,2 26,18 2,18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/><line x1="8" y1="18" x2="8" y2="11" stroke="currentColor" strokeWidth="2"/><polygon points="8,5 14,11 2,11" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/></svg>,
    complex:  <svg width="28" height="20" viewBox="0 0 28 20"><polygon points="7,18 7,10 3,10 10,2 17,10 13,10 13,18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><polygon points="18,18 18,12 15,12 20,6 25,12 22,12 22,18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>,
  };
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 6 }}>
      {COMPLEXITY_OPTIONS.map(([id, label, desc]) => {
        const active = value === id;
        return (
          <button key={id} type="button" onClick={() => onChange(id)}
            style={{
              padding: '12px 10px', borderRadius: 10, cursor: 'pointer', textAlign: 'center',
              border: `1.5px solid ${active ? primaryColor : '#e2e8f0'}`,
              background: active ? `${primaryColor}08` : 'white',
              transition: 'all 0.15s',
            }}>
            <div style={{ color: active ? primaryColor : '#94a3b8', marginBottom: 6 }}>{ICONS[id]}</div>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: active ? '#0f172a' : '#374151', marginBottom: 3 }}>{label}</div>
            <div style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.4 }}>{desc}</div>
          </button>
        );
      })}
    </div>
  );
}

const SIZE_TO_SQFT = {
  under_1000: 800, '1000_1500': 1250, '1500_2000': 1750,
  '2000_2500': 2250, '2500_3000': 2750, over_3000: 3500,
};

export default function RoofDetailsStep({ value, serviceType, onBack, onNext, primaryColor = '#ea580c', companyConfig = null }) {
  // qc = question config; missing key = enabled (default true)
  const qc = companyConfig?.questionConfig || {};
  const [roofSize,      setRoofSize]      = useState(value.roofSize      || '');
  const [stories,       setStories]       = useState(value.stories       || '');
  const [pitch,         setPitch]         = useState(value.pitch         || '');
  const [shingleGrade,  setShingleGrade]  = useState(value.shingleGrade  || '');
  const [complexity,    setComplexity]    = useState(value.complexity    || '');
  const [existingLayers,setExistingLayers]= useState(value.existingLayers|| '');
  const [penetrations,  setPenetrations]  = useState(value.penetrations  || 'none');
  const [metalType,     setMetalType]     = useState(value.metalType     || '');
  const [tileType,      setTileType]      = useState(value.tileType      || '');
  const [flatType,      setFlatType]      = useState(value.flatType      || '');
  const [addOns,        setAddOns]        = useState(value.addOns        || []);

  const toggleAddOn = (id) => setAddOns(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const isAsphalt = serviceType === 'shingle_replacement';
  const isMetal   = serviceType === 'metal_roofing';
  const isTile    = serviceType === 'tile_roofing';
  const isFlat    = serviceType === 'flat_roof';
  const isReplacement = isAsphalt || isMetal || isTile || isFlat;

  const sqft = SIZE_TO_SQFT[roofSize] || 1750;

  // A field is "needed" only when it's shown (not disabled) and not auto-filled
  const showStories      = qc.showStories      !== false;
  const showPitch        = qc.showPitch        !== false;
  const showShingleGrade = qc.showShingleGrade !== false;
  const showMaterialType = qc.showMaterialType !== false;
  const showComplexity   = qc.showComplexity   !== false;
  const showLayers       = qc.showLayers       !== false;
  const showPenetrations = qc.showPenetrations !== false;
  const showAddOns       = qc.showAddOns       !== false;

  const canNext =
    !!roofSize &&
    (showStories  ? !!stories  : true) &&
    (showPitch && !isFlat ? !!pitch : true) &&
    (isAsphalt && showShingleGrade  ? !!shingleGrade : true) &&
    (isMetal   && showMaterialType  ? !!metalType    : true) &&
    (isTile    && showMaterialType  ? !!tileType     : true) &&
    (isFlat    && showMaterialType  ? !!flatType     : true) &&
    (isReplacement && showComplexity ? !!complexity   : true) &&
    (isReplacement && showLayers     ? !!existingLayers : true);

  const handleNext = () => {
    // Defaults for disabled questions — chosen to avoid underquoting
    const resolvedStories      = showStories      ? Number(stories) : 1;
    const resolvedPitch        = showPitch        ? pitch           : 'medium';
    const resolvedShingleGrade = showShingleGrade ? shingleGrade    : 'architectural';
    const resolvedComplexity   = showComplexity   ? complexity      : 'moderate';
    const resolvedLayers       = showLayers       ? existingLayers  : 'one';
    const resolvedPenetrations = showPenetrations ? penetrations    : 'none';
    const resolvedAddOns       = showAddOns       ? addOns          : [];

    const base = {
      roofSize,
      stories:       resolvedStories,
      pitch:         resolvedPitch,
      addOns:        resolvedAddOns,
      complexity:    resolvedComplexity,
      existingLayers:resolvedLayers,
      penetrations:  resolvedPenetrations,
    };

    if (isFlat) {
      onNext({ ...base, buildingFootprint: sqft, flatMaterial: showMaterialType ? flatType  : 'tpo'          });
    } else if (isMetal) {
      onNext({ ...base, houseSqft: sqft,          metalType:   showMaterialType ? metalType : 'standing_seam' });
    } else if (isTile) {
      onNext({ ...base, houseSqft: sqft,          tileType:    showMaterialType ? tileType  : 'concrete_tile' });
    } else {
      onNext({ ...base, houseSqft: sqft, shingleGrade: resolvedShingleGrade });
    }
  };

  const fieldLabel = { fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 0 };
  const fieldWrap  = { marginBottom: 20 };
  const divider    = { borderTop: '1px solid #f1f5f9', paddingTop: 18, marginTop: 4 };

  return (
    <StepWrapper
      icon={<Home size={17} color={primaryColor} />}
      title="Tell us about your roof"
      subtitle="More detail = more accurate estimate."
      onBack={onBack}
      onNext={handleNext}
      canNext={canNext}
      primaryColor={primaryColor}
    >
      {/* Roof size */}
      <div style={fieldWrap}>
        <label style={fieldLabel}>Approximate roof size</label>
        <Chips options={SIZE_OPTIONS} value={roofSize} onChange={setRoofSize} primaryColor={primaryColor} />
      </div>

      {/* Stories */}
      {showStories && (
        <div style={fieldWrap}>
          <label style={fieldLabel}>Number of stories</label>
          <Chips options={STORY_OPTIONS} value={stories} onChange={setStories} primaryColor={primaryColor} />
        </div>
      )}

      {/* Pitch */}
      {showPitch && !isFlat && (
        <div style={fieldWrap}>
          <label style={fieldLabel}>Roof pitch</label>
          <Chips options={PITCH_OPTIONS} value={pitch} onChange={setPitch} primaryColor={primaryColor} />
        </div>
      )}

      {/* ── Asphalt-specific ── */}
      {isAsphalt && showShingleGrade && (
        <div style={{ ...fieldWrap, ...divider }}>
          <label style={fieldLabel}>Shingle grade</label>
          <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2, marginBottom: 2 }}>This is the single biggest price variable — choose what fits your budget.</div>
          <GradeCards value={shingleGrade} onChange={setShingleGrade} primaryColor={primaryColor} />
        </div>
      )}

      {/* ── Metal type ── */}
      {isMetal && showMaterialType && (
        <div style={{ ...fieldWrap, ...divider }}>
          <label style={fieldLabel}>Metal roof type</label>
          <Chips options={METAL_TYPES} value={metalType} onChange={setMetalType} primaryColor={primaryColor} />
        </div>
      )}

      {/* ── Tile type ── */}
      {isTile && showMaterialType && (
        <div style={{ ...fieldWrap, ...divider }}>
          <label style={fieldLabel}>Tile material</label>
          <Chips options={TILE_TYPES} value={tileType} onChange={setTileType} primaryColor={primaryColor} />
        </div>
      )}

      {/* ── Flat system ── */}
      {isFlat && showMaterialType && (
        <div style={{ ...fieldWrap, ...divider }}>
          <label style={fieldLabel}>Flat roof system</label>
          <Chips options={FLAT_TYPES} value={flatType} onChange={setFlatType} primaryColor={primaryColor} />
        </div>
      )}

      {/* ── Replacement-universal questions ── */}
      {isReplacement && (showComplexity || showLayers || showPenetrations) && (
        <>
          {showComplexity && (
            <div style={{ ...fieldWrap, ...divider }}>
              <label style={fieldLabel}>Roof shape / complexity</label>
              <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2, marginBottom: 2 }}>More angles and valleys = more labor and material waste.</div>
              <ComplexityCards value={complexity} onChange={setComplexity} primaryColor={primaryColor} />
            </div>
          )}

          {showLayers && (
            <div style={showComplexity ? fieldWrap : { ...fieldWrap, ...divider }}>
              <label style={fieldLabel}>How many existing shingle layers?</label>
              <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2, marginBottom: 2 }}>A second layer doubles tear-off cost and disposal fees.</div>
              <Chips options={LAYERS_OPTIONS} value={existingLayers} onChange={setExistingLayers} primaryColor={primaryColor} />
            </div>
          )}

          {showPenetrations && (
            <div style={fieldWrap}>
              <label style={fieldLabel}>Penetrations — chimneys, skylights, pipe boots</label>
              <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2, marginBottom: 2 }}>Each one requires custom flashing work.</div>
              <Chips options={PENETRATION_OPTIONS} value={penetrations} onChange={setPenetrations} primaryColor={primaryColor} />
            </div>
          )}
        </>
      )}

      {/* ── Asphalt add-ons ── */}
      {isAsphalt && showAddOns && (
        <div style={{ ...fieldWrap, ...divider }}>
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
