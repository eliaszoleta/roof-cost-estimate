import React, { useState } from 'react';
import { Home, Plus, Minus } from 'lucide-react';
import StepWrapper from './StepWrapper';

// ── Constants ──────────────────────────────────────────────────────────────────
const METAL_TYPES   = [['standing_seam','Standing Seam'],['corrugated','Corrugated'],['ribbed','Ribbed / R-Panel']];
const TILE_TYPES    = [['clay_tile','Clay'],['concrete_tile','Concrete'],['slate','Slate']];
const FLAT_TYPES    = [['tpo','TPO'],['epdm','EPDM'],['modified_bitumen','Modified Bitumen']];
const STORY_OPTIONS = [['1','1 story'],['2','2 stories'],['3','3+ stories']];
const GRADE_OPTIONS = [
  ['standard',      '3-Tab / Standard',    '$',   '20–25 yr warranty, basic protection'],
  ['architectural', 'Architectural',        '$$',  'Most popular, 30 yr warranty'],
  ['designer',      'Designer / Premium',  '$$$', 'Impact-resistant, 50 yr warranty'],
];
const LAYERS_OPTIONS = [
  ['one',     '1 Layer',    'Standard tear-off cost'],
  ['two',     '2 Layers',   'Extra removal & disposal'],
  ['unknown', "Don't Know", "We'll add a safety buffer"],
];
const ADDONS_ASPHALT = [
  ['new_decking',       'New roof decking'],
  ['ice_water_shield',  'Ice & water shield'],
  ['ridge_ventilation', 'Ridge ventilation'],
  ['gutter_replacement','Gutter replacement'],
];

// Pitch area factors: footprint → approximate roof surface area
const PITCH_AREA_FACTOR = { low: 1.05, medium: 1.20, steep: 1.40 };

// ── Roof Types (replaces Simple / Moderate / Complex) ─────────────────────────
const ROOF_TYPES = [
  { id: 'gable',      label: 'Gable',         complexity: 'simple',   desc: 'Two slopes, center ridge' },
  { id: 'hip',        label: 'Hip',           complexity: 'moderate', desc: '4 slopes, no gable walls' },
  { id: 'flat',       label: 'Flat',          complexity: 'simple',   desc: 'Low-slope membrane roof' },
  { id: 'shed',       label: 'Shed / Lean-to',complexity: 'simple',   desc: 'Single slope, one direction' },
  { id: 'gambrel',    label: 'Gambrel',       complexity: 'moderate', desc: 'Barn-style, two pitch angles' },
  { id: 'dutch_gable',label: 'Dutch Gable',   complexity: 'moderate', desc: 'Hip with gable at the peak' },
  { id: 'hip_valley', label: 'Hip & Valley',  complexity: 'complex',  desc: 'Multiple ridges & valleys' },
  { id: 'mansard',    label: 'Mansard',       complexity: 'complex',  desc: 'Steep sides, near-flat top' },
];

const ROOF_TYPE_COMPLEXITY = Object.fromEntries(ROOF_TYPES.map(r => [r.id, r.complexity]));

const COMPLEXITY_LABEL = { simple: 'Simple', moderate: 'Moderate', complex: 'Complex' };
const COMPLEXITY_COLOR = { simple: '#16a34a', moderate: '#d97706', complex: '#dc2626' };

// ── SVG Roof Shape Icons ──────────────────────────────────────────────────────
function RoofShapeIcon({ type, color, size = 56 }) {
  const s = { stroke: color, strokeWidth: 1.6, strokeLinejoin: 'round', strokeLinecap: 'round' };
  const fill = { ...s, fill: color, fillOpacity: 0.55 };
  const wallFill = { ...s, fill: color, fillOpacity: 0.1 };
  const W = <rect x="5" y="32" width="46" height="15" rx="1" {...wallFill} />;

  if (type === 'gable') return (
    <svg width={size} height={size * 0.83} viewBox="0 0 56 47" fill="none">
      {W}
      <polygon points="28,5 51,32 5,32" {...fill} />
    </svg>
  );
  if (type === 'hip') return (
    <svg width={size} height={size * 0.83} viewBox="0 0 56 47" fill="none">
      {W}
      <polygon points="16,17 40,17 51,32 5,32" {...fill} />
      <line x1="16" y1="17" x2="5" y2="32" {...s} opacity=".4" />
      <line x1="40" y1="17" x2="51" y2="32" {...s} opacity=".4" />
    </svg>
  );
  if (type === 'flat') return (
    <svg width={size} height={size * 0.83} viewBox="0 0 56 47" fill="none">
      <rect x="5" y="20" width="46" height="27" rx="1" {...wallFill} />
      <rect x="3" y="15" width="50" height="7" rx="1" {...fill} />
    </svg>
  );
  if (type === 'shed') return (
    <svg width={size} height={size * 0.83} viewBox="0 0 56 47" fill="none">
      {W}
      <polygon points="5,10 51,24 51,32 5,32" {...fill} />
    </svg>
  );
  if (type === 'gambrel') return (
    <svg width={size} height={size * 0.83} viewBox="0 0 56 47" fill="none">
      {W}
      <polygon points="5,32 14,20 42,20 51,32" {...{ ...fill, fillOpacity: 0.35 }} />
      <polygon points="20,7 36,7 42,20 14,20" {...fill} />
      <line x1="20" y1="7" x2="36" y2="7" {...s} />
    </svg>
  );
  if (type === 'dutch_gable') return (
    <svg width={size} height={size * 0.83} viewBox="0 0 56 47" fill="none">
      {W}
      <polygon points="13,20 43,20 51,32 5,32" {...{ ...fill, fillOpacity: 0.35 }} />
      <polygon points="28,6 43,20 13,20" {...fill} />
    </svg>
  );
  if (type === 'hip_valley') return (
    <svg width={size} height={size * 0.83} viewBox="0 0 56 47" fill="none">
      {/* Front wing */}
      <rect x="5" y="28" width="30" height="14" rx="1" {...wallFill} />
      <polygon points="11,18 29,18 35,28 5,28" {...{ ...fill, fillOpacity: 0.45 }} />
      {/* Side wing */}
      <rect x="29" y="20" width="22" height="22" rx="1" {...{ ...wallFill, fillOpacity: 0.07 }} />
      <polygon points="29,18 51,18 51,28 35,28" {...{ ...fill, fillOpacity: 0.3 }} />
      {/* Valley line */}
      <line x1="35" y1="28" x2="35" y2="42" {...s} opacity=".5" strokeDasharray="2,2" />
    </svg>
  );
  if (type === 'mansard') return (
    <svg width={size} height={size * 0.83} viewBox="0 0 56 47" fill="none">
      {W}
      <polygon points="5,32 15,18 41,18 51,32" {...{ ...fill, fillOpacity: 0.45 }} />
      <rect x="15" y="13" width="26" height="7" rx="1" {...fill} />
    </svg>
  );
  return null;
}

// ── Sub-components ────────────────────────────────────────────────────────────
function Chips({ options, value, onChange, primaryColor }) {
  return (
    <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginTop: 6 }}>
      {options.map(([id, label]) => (
        <button key={id} type="button" onClick={() => onChange(id)}
          style={{
            padding: '8px 14px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer',
            border: `1.5px solid ${value === id ? primaryColor : '#e2e8f0'}`,
            background: value === id ? primaryColor : 'white',
            color: value === id ? 'white' : '#374151', transition: 'all 0.15s',
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
              background: active ? `${primaryColor}08` : 'white', transition: 'all 0.15s',
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

function RoofTypeSelector({ value, onChange, primaryColor }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginTop: 6 }}>
      {ROOF_TYPES.map(({ id, label, complexity, desc }) => {
        const active = value === id;
        const badgeColor = COMPLEXITY_COLOR[complexity];
        return (
          <button key={id} type="button" onClick={() => onChange(id)}
            style={{
              padding: '10px 8px 8px', borderRadius: 10, cursor: 'pointer', textAlign: 'center',
              border: `1.5px solid ${active ? primaryColor : '#e2e8f0'}`,
              background: active ? `${primaryColor}08` : 'white', transition: 'all 0.15s',
            }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 5 }}>
              <RoofShapeIcon type={id} color={active ? primaryColor : '#94a3b8'} size={50} />
            </div>
            <div style={{ fontSize: 11.5, fontWeight: 700, color: active ? '#0f172a' : '#374151', lineHeight: 1.3, marginBottom: 3 }}>{label}</div>
            <div style={{
              display: 'inline-block', fontSize: 9.5, fontWeight: 700, padding: '1px 6px', borderRadius: 10,
              background: `${badgeColor}18`, color: badgeColor, marginBottom: 2,
            }}>{COMPLEXITY_LABEL[complexity]}</div>
            <div style={{ fontSize: 10, color: '#94a3b8', lineHeight: 1.3 }}>{desc}</div>
          </button>
        );
      })}
    </div>
  );
}

function PenetrationCounter({ label, sublabel, value, onChange, icon }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderBottom: '1px solid #f1f5f9', background: 'white' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ fontSize: 20, lineHeight: 1 }}>{icon}</div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>{label}</div>
          <div style={{ fontSize: 11, color: '#94a3b8' }}>{sublabel}</div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <button type="button" onClick={() => onChange(Math.max(0, value - 1))}
          style={{ width: 28, height: 28, borderRadius: 7, border: '1.5px solid #e2e8f0', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#374151' }}>
          <Minus size={13} />
        </button>
        <span style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', minWidth: 20, textAlign: 'center' }}>{value}</span>
        <button type="button" onClick={() => onChange(Math.min(20, value + 1))}
          style={{ width: 28, height: 28, borderRadius: 7, border: '1.5px solid #e2e8f0', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#374151' }}>
          <Plus size={13} />
        </button>
      </div>
    </div>
  );
}

// Pitch visual hints
const PITCH_VISUALS = {
  low: (
    <svg width="34" height="22" viewBox="0 0 34 22" fill="none">
      <polygon points="1,20 33,14 33,20" stroke="#64748b" strokeWidth="1.5" fill="#e2e8f0" strokeLinejoin="round"/>
      <text x="7" y="11" fontSize="8" fill="#64748b" fontWeight="600">~5°</text>
    </svg>
  ),
  medium: (
    <svg width="34" height="22" viewBox="0 0 34 22" fill="none">
      <polygon points="1,20 17,8 33,20" stroke="#64748b" strokeWidth="1.5" fill="#e2e8f0" strokeLinejoin="round"/>
      <text x="10" y="7" fontSize="8" fill="#64748b" fontWeight="600">20°</text>
    </svg>
  ),
  steep: (
    <svg width="34" height="22" viewBox="0 0 34 22" fill="none">
      <polygon points="1,20 17,2 33,20" stroke="#64748b" strokeWidth="1.5" fill="#e2e8f0" strokeLinejoin="round"/>
      <text x="10" y="5" fontSize="8" fill="#64748b" fontWeight="600">35°</text>
    </svg>
  ),
};

// ── Main Component ────────────────────────────────────────────────────────────
export default function RoofDetailsStep({
  value, serviceType, onBack, onNext,
  primaryColor = '#ea580c', companyConfig = null, loading = false,
}) {
  const qc = companyConfig?.questionConfig || {};

  // Area mode
  const [areaMode, setAreaMode] = useState(value.areaMode || 'range');
  const [roofSize, setRoofSize]         = useState(value.roofSize     || '');
  const [exactSqft, setExactSqft]       = useState(value.exactSqft   || '');
  const [footprintSqft, setFootprintSqft] = useState(value.footprintSqft || '');
  const [dimLength, setDimLength]       = useState(value.dimLength    || '');
  const [dimWidth, setDimWidth]         = useState(value.dimWidth     || '');

  // Roof details
  const [pitch,          setPitch]          = useState(value.pitch          || '');
  const [stories,        setStories]        = useState(value.stories        || '');
  const [roofType,       setRoofType]       = useState(value.roofType       || '');
  const [shingleGrade,   setShingleGrade]   = useState(value.shingleGrade   || '');
  const [metalType,      setMetalType]      = useState(value.metalType      || '');
  const [tileType,       setTileType]       = useState(value.tileType       || '');
  const [flatType,       setFlatType]       = useState(value.flatType       || '');
  const [existingLayers, setExistingLayers] = useState(value.existingLayers || '');
  const [chimneys,       setChimneys]       = useState(Number(value.chimneys)  || 0);
  const [skylights,      setSkylights]      = useState(Number(value.skylights) || 0);
  const [otherPen,       setOtherPen]       = useState(Number(value.otherPen)  || 0);
  const [addOns,         setAddOns]         = useState(value.addOns || []);

  const toggleAddOn = id => setAddOns(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

  const isAsphalt     = serviceType === 'shingle_replacement';
  const isMetal       = serviceType === 'metal_roofing';
  const isTile        = serviceType === 'tile_roofing';
  const isFlat        = serviceType === 'flat_roof';
  const isReplacement = isAsphalt || isMetal || isTile || isFlat;

  // Show flags from questionConfig
  const showStories      = qc.showStories      !== false;
  const showPitch        = qc.showPitch        !== false;
  const showShingleGrade = qc.showShingleGrade !== false;
  const showMaterialType = qc.showMaterialType !== false;
  const showComplexity   = qc.showComplexity   !== false; // controls roof type selector
  const showLayers       = qc.showLayers       !== false;
  const showPenetrations = qc.showPenetrations !== false;
  const showAddOns       = qc.showAddOns       !== false;

  // Computed area preview (for footprint/dims modes)
  const pitchFactor = PITCH_AREA_FACTOR[pitch] || 1.20;
  const footprintPreview = (() => {
    if (areaMode === 'footprint' && Number(footprintSqft) > 0)
      return Math.round(Number(footprintSqft) * pitchFactor);
    if (areaMode === 'dims' && Number(dimLength) > 0 && Number(dimWidth) > 0)
      return Math.round(Number(dimLength) * Number(dimWidth) * pitchFactor);
    return null;
  })();

  // Area validity
  const areaValid = (() => {
    if (areaMode === 'range')     return !!roofSize;
    if (areaMode === 'exact')     return Number(exactSqft) >= 100;
    if (areaMode === 'footprint') return Number(footprintSqft) >= 100;
    if (areaMode === 'dims')      return Number(dimLength) >= 5 && Number(dimWidth) >= 5;
    return false;
  })();

  const canNext =
    areaValid &&
    (showPitch && !isFlat ? !!pitch : true) &&
    (showStories ? !!stories : true) &&
    (isAsphalt && showShingleGrade ? !!shingleGrade : true) &&
    (isMetal   && showMaterialType ? !!metalType    : true) &&
    (isTile    && showMaterialType ? !!tileType     : true) &&
    (isFlat    && showMaterialType ? !!flatType     : true) &&
    (isReplacement && showComplexity ? !!roofType   : true) &&
    (isReplacement && showLayers   ? !!existingLayers : true);

  const handleNext = () => {
    // Resolve complexity from roofType
    const complexity = showComplexity && roofType
      ? ROOF_TYPE_COMPLEXITY[roofType] || 'moderate'
      : 'moderate';

    // Build area payload
    let areaPayload = {};
    if (areaMode === 'exact') {
      areaPayload = { roofSqft: Number(exactSqft) };
    } else if (areaMode === 'footprint') {
      areaPayload = { houseSqft: Number(footprintSqft) };
    } else if (areaMode === 'dims') {
      areaPayload = { houseSqft: Math.round(Number(dimLength) * Number(dimWidth)) };
    } else {
      // range mode — legacy mapping
      const SIZE_TO_SQFT = {
        under_1000: 800, '1000_1500': 1250, '1500_2000': 1750,
        '2000_2500': 2250, '2500_3000': 2750, over_3000: 3500,
      };
      areaPayload = { houseSqft: SIZE_TO_SQFT[roofSize] || 1750, roofSize };
    }

    const base = {
      ...areaPayload,
      areaMode,
      roofType: showComplexity ? roofType : '',
      pitch:          showPitch        ? (pitch || 'medium')      : 'medium',
      stories:        showStories      ? Number(stories) || 1      : 1,
      complexity,
      existingLayers: showLayers       ? existingLayers            : 'one',
      penetrations:   showPenetrations ? { chimneys, skylights, other: otherPen } : { chimneys: 0, skylights: 0, other: 0 },
      addOns:         showAddOns       ? addOns                    : [],
    };

    if (isFlat) {
      onNext({ ...base,
        buildingFootprint: areaPayload.roofSqft || areaPayload.houseSqft || 1500,
        flatMaterial: showMaterialType ? flatType : 'tpo',
      });
    } else if (isMetal) {
      onNext({ ...base, metalType: showMaterialType ? metalType : 'standing_seam' });
    } else if (isTile) {
      onNext({ ...base, tileType: showMaterialType ? tileType : 'concrete_tile' });
    } else {
      onNext({ ...base, shingleGrade: showShingleGrade ? shingleGrade : 'architectural' });
    }
  };

  const fieldLabel = { fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 0 };
  const fieldWrap  = { marginBottom: 20 };
  const divider    = { borderTop: '1px solid #f1f5f9', paddingTop: 18, marginTop: 4 };
  const inputStyle = {
    width: '100%', padding: '10px 13px', border: '1.5px solid #e2e8f0', borderRadius: 8,
    fontSize: 14, outline: 'none', color: '#0f172a', background: 'white', boxSizing: 'border-box',
  };
  const radioOpt = (id, labelText) => {
    const active = areaMode === id;
    return (
      <label key={id} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '9px 12px', borderRadius: 8, cursor: 'pointer', border: `1.5px solid ${active ? primaryColor : '#e2e8f0'}`, background: active ? `${primaryColor}06` : 'white', marginBottom: 6 }}>
        <input type="radio" name="areaMode" value={id} checked={active} onChange={() => setAreaMode(id)}
          style={{ accentColor: primaryColor, width: 15, height: 15, flexShrink: 0 }} />
        <span style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>{labelText}</span>
      </label>
    );
  };

  return (
    <StepWrapper
      icon={<Home size={17} color={primaryColor} />}
      title="Tell us about your roof"
      subtitle="More detail = more accurate estimate."
      onBack={onBack}
      onNext={handleNext}
      canNext={canNext}
      loading={loading}
      nextLabel={loading ? 'Calculating…' : 'Get My Estimate →'}
      primaryColor={primaryColor}
    >
      {/* ── Area Input ── */}
      <div style={fieldWrap}>
        <label style={fieldLabel}>How do you know your roof size?</label>
        <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 8, marginTop: 2 }}>
          Your roof area is larger than your floor plan due to slope — we'll adjust automatically.
        </div>
        <div>
          {radioOpt('range',     'Not sure — use an approximate size range')}
          {radioOpt('exact',     'I know my exact roof area (sq ft)')}
          {radioOpt('footprint', 'I know my house footprint / floor plan (sq ft)')}
          {radioOpt('dims',      'I know my house dimensions (length × width)')}
        </div>

        {areaMode === 'range' && (
          <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginTop: 4 }}>
            {[
              ['under_1000','< 1,000 sq ft'],['1000_1500','1,000–1,500'],['1500_2000','1,500–2,000'],
              ['2000_2500','2,000–2,500'],['2500_3000','2,500–3,000'],['over_3000','> 3,000 sq ft'],
            ].map(([id, label]) => (
              <button key={id} type="button" onClick={() => setRoofSize(id)}
                style={{ padding: '8px 13px', borderRadius: 8, fontSize: 12.5, fontWeight: 600, cursor: 'pointer', border: `1.5px solid ${roofSize === id ? primaryColor : '#e2e8f0'}`, background: roofSize === id ? primaryColor : 'white', color: roofSize === id ? 'white' : '#374151', transition: 'all 0.15s' }}>
                {label}
              </button>
            ))}
          </div>
        )}

        {areaMode === 'exact' && (
          <div style={{ marginTop: 6 }}>
            <input type="number" min="100" max="50000" value={exactSqft} onChange={e => setExactSqft(e.target.value)}
              placeholder="e.g. 2,100" style={inputStyle} />
            <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>Enter actual roof surface area — this won't be pitch-adjusted.</div>
          </div>
        )}

        {areaMode === 'footprint' && (
          <div style={{ marginTop: 6 }}>
            <input type="number" min="100" max="20000" value={footprintSqft} onChange={e => setFootprintSqft(e.target.value)}
              placeholder="e.g. 1,800" style={inputStyle} />
            {footprintPreview && (
              <div style={{ fontSize: 12, color: '#059669', fontWeight: 600, marginTop: 5 }}>
                ≈ {footprintPreview.toLocaleString()} sq ft roof area (adjusted for pitch)
              </div>
            )}
          </div>
        )}

        {areaMode === 'dims' && (
          <div style={{ marginTop: 6 }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 4, fontWeight: 600 }}>LENGTH (ft)</div>
                <input type="number" min="5" max="500" value={dimLength} onChange={e => setDimLength(e.target.value)}
                  placeholder="e.g. 50" style={inputStyle} />
              </div>
              <div style={{ fontSize: 20, color: '#94a3b8', paddingTop: 18, fontWeight: 300 }}>×</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 4, fontWeight: 600 }}>WIDTH (ft)</div>
                <input type="number" min="5" max="500" value={dimWidth} onChange={e => setDimWidth(e.target.value)}
                  placeholder="e.g. 40" style={inputStyle} />
              </div>
            </div>
            {footprintPreview && (
              <div style={{ fontSize: 12, color: '#059669', fontWeight: 600, marginTop: 6 }}>
                ≈ {footprintPreview.toLocaleString()} sq ft roof area (adjusted for pitch)
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Pitch ── */}
      {showPitch && !isFlat && (
        <div style={fieldWrap}>
          <label style={fieldLabel}>Roof pitch</label>
          <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2, marginBottom: 6 }}>A steeper pitch means more surface area and harder labor.</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {[['low','Low (≤ 4:12)'],['medium','Medium (4–8:12)'],['steep','Steep (8:12+)']].map(([id, label]) => (
              <button key={id} type="button" onClick={() => setPitch(id)}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, padding: '10px 14px', borderRadius: 9, cursor: 'pointer', border: `1.5px solid ${pitch === id ? primaryColor : '#e2e8f0'}`, background: pitch === id ? `${primaryColor}08` : 'white', transition: 'all 0.15s', minWidth: 80 }}>
                {PITCH_VISUALS[id]}
                <span style={{ fontSize: 12, fontWeight: 600, color: pitch === id ? primaryColor : '#374151' }}>{label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Stories ── */}
      {showStories && (
        <div style={fieldWrap}>
          <label style={fieldLabel}>Number of stories</label>
          <Chips options={STORY_OPTIONS} value={stories} onChange={setStories} primaryColor={primaryColor} />
        </div>
      )}

      {/* ── Material grade (Asphalt) ── */}
      {isAsphalt && showShingleGrade && (
        <div style={{ ...fieldWrap, ...divider }}>
          <label style={fieldLabel}>Shingle grade</label>
          <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2, marginBottom: 2 }}>The single biggest price variable — choose what fits your budget.</div>
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

      {/* ── Roof Type (replaces complexity) ── */}
      {isReplacement && showComplexity && (
        <div style={{ ...fieldWrap, ...divider }}>
          <label style={fieldLabel}>Roof shape / type</label>
          <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2, marginBottom: 2 }}>Select the type closest to your roof. This determines complexity & waste factor.</div>
          <RoofTypeSelector value={roofType} onChange={setRoofType} primaryColor={primaryColor} />
          {roofType && (
            <div style={{ marginTop: 8, padding: '7px 12px', borderRadius: 7, background: `${COMPLEXITY_COLOR[ROOF_TYPE_COMPLEXITY[roofType]]}12`, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: COMPLEXITY_COLOR[ROOF_TYPE_COMPLEXITY[roofType]] }}>
                {COMPLEXITY_LABEL[ROOF_TYPE_COMPLEXITY[roofType]]} complexity
              </span>
              <span style={{ fontSize: 12, color: '#64748b' }}>— affects labor and material waste</span>
            </div>
          )}
        </div>
      )}

      {/* ── Existing Layers ── */}
      {isReplacement && showLayers && (
        <div style={fieldWrap}>
          <label style={fieldLabel}>How many existing shingle layers?</label>
          <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2, marginBottom: 2 }}>A second layer doubles tear-off cost and disposal fees.</div>
          <Chips options={LAYERS_OPTIONS} value={existingLayers} onChange={setExistingLayers} primaryColor={primaryColor} />
        </div>
      )}

      {/* ── Penetrations (chimneys, skylights, other) ── */}
      {showPenetrations && (
        <div style={{ ...fieldWrap, ...divider }}>
          <label style={fieldLabel}>Penetrations</label>
          <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2, marginBottom: 8 }}>
            Each penetration requires custom flashing work. Leave at 0 if none.
          </div>
          <div style={{ border: '1px solid #e2e8f0', borderRadius: 10, overflow: 'hidden' }}>
            <PenetrationCounter label="Chimneys" sublabel="~$400–600 each" value={chimneys} onChange={setChimneys} icon="🧱" />
            <PenetrationCounter label="Skylights" sublabel="~$280–430 each" value={skylights} onChange={setSkylights} icon="🪟" />
            <PenetrationCounter label="Other" sublabel="pipe boots, vents, dormers (~$140–270 each)" value={otherPen} onChange={setOtherPen} icon="🔩" />
          </div>
          {(chimneys + skylights + otherPen) > 0 && (
            <div style={{ fontSize: 12, color: '#059669', fontWeight: 600, marginTop: 6 }}>
              {chimneys + skylights + otherPen} penetration{chimneys + skylights + otherPen > 1 ? 's' : ''} — flashing costs included in estimate
            </div>
          )}
        </div>
      )}

      {/* ── Add-ons (Asphalt only) ── */}
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
