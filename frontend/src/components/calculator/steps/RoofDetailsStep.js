import React, { useState } from 'react';
import { Home, Check } from 'lucide-react';
import StepWrapper from './StepWrapper';
import {
  IllustPitchLow, IllustPitchMedium, IllustPitchSteep,
  IllustShapeSimple, IllustShapeModerate, IllustShapeComplex,
  IllustMetalStandingSeam, IllustMetalCorrugated, IllustMetalRibbed,
  IllustShingleStandard, IllustShingleArchitectural, IllustShingleDesigner,
  IllustTileClay, IllustTileConcrete, IllustTileSlate,
  IllustFlatTPO, IllustFlatEPDM, IllustFlatModBitumen,
} from './RoofIllustrations';

// ── Constants ──────────────────────────────────────────────────────────────────
const STORY_OPTIONS = [['1','1 story'],['2','2 stories'],['3','3+ stories']];
const SIZE_OPTIONS  = [
  ['under_1000','Under 1,000 sq ft'],
  ['1000_1500','1,000–1,500 sq ft'],
  ['1500_2000','1,500–2,000 sq ft'],
  ['2000_2500','2,000–2,500 sq ft'],
  ['2500_3000','2,500–3,000 sq ft'],
  ['over_3000','Over 3,000 sq ft'],
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

const SIZE_TO_SQFT = {
  under_1000: 800, '1000_1500': 1250, '1500_2000': 1750,
  '2000_2500': 2250, '2500_3000': 2750, over_3000: 3500,
};

// ── Illustration card data (SVG components replace Unsplash photos) ────────────
const PITCH_CARDS = [
  { id: 'low',    label: 'Low',    sub: 'Flat to 4:12',  desc: 'Ranch, flat, or low-slope',       Illust: IllustPitchLow },
  { id: 'medium', label: 'Medium', sub: '4:12 to 8:12',  desc: 'Most common US residential',      Illust: IllustPitchMedium },
  { id: 'steep',  label: 'Steep',  sub: '8:12 and up',   desc: 'Cape Cod, Victorian, A-frame',    Illust: IllustPitchSteep },
];

const COMPLEXITY_CARDS = [
  { id: 'simple',   label: 'Simple',   sub: 'Gable / shed / lean-to',        desc: 'Basic triangle ridge, few cuts — lowest labor cost',          Illust: IllustShapeSimple,   badge: { label: 'Lowest cost', color: '#16a34a' } },
  { id: 'moderate', label: 'Moderate', sub: 'Hip / gambrel / hip-and-valley', desc: 'Slopes on all 4 sides, some angles and valleys',              Illust: IllustShapeModerate, badge: { label: 'Most common', color: '#d97706' } },
  { id: 'complex',  label: 'Complex',  sub: 'Dormers / multiple peaks',       desc: 'Many angles, intersecting ridges, dormers, skylight cuts',    Illust: IllustShapeComplex,  badge: { label: 'Higher labor', color: '#7c3aed' } },
];

const GRADE_CARDS = [
  { id: 'standard',      label: '3-Tab / Standard',   price: '$',   desc: '20–25 yr warranty, basic protection', Illust: IllustShingleStandard,      priceColor: '#64748b' },
  { id: 'architectural', label: 'Architectural',       price: '$$',  desc: 'Most popular, 30 yr warranty',       Illust: IllustShingleArchitectural, priceColor: '#d97706' },
  { id: 'designer',      label: 'Designer / Premium',  price: '$$$', desc: 'Impact-resistant, 50 yr warranty',   Illust: IllustShingleDesigner,      priceColor: '#7c3aed' },
];

const TILE_CARDS = [
  { id: 'clay_tile',     label: 'Clay Tile',     desc: 'Classic, 50+ yr life',      Illust: IllustTileClay },
  { id: 'concrete_tile', label: 'Concrete Tile', desc: 'Budget-friendly, 30 yr',    Illust: IllustTileConcrete },
  { id: 'slate',         label: 'Slate',         desc: 'Natural stone, 100+ yr',    Illust: IllustTileSlate },
];

const METAL_CARDS = [
  { id: 'standing_seam', label: 'Standing Seam',    desc: 'Modern, 50 yr warranty',    Illust: IllustMetalStandingSeam },
  { id: 'corrugated',    label: 'Corrugated',        desc: 'Classic wave profile',      Illust: IllustMetalCorrugated },
  { id: 'ribbed',        label: 'Ribbed / R-Panel',  desc: 'Strong, commercial-grade',  Illust: IllustMetalRibbed },
];

const FLAT_CARDS = [
  { id: 'tpo',              label: 'TPO Membrane',     desc: 'White reflective, most popular', Illust: IllustFlatTPO },
  { id: 'epdm',             label: 'EPDM (Rubber)',    desc: 'Durable, 20–25 yr',              Illust: IllustFlatEPDM },
  { id: 'modified_bitumen', label: 'Modified Bitumen', desc: 'Torch-down, commercial-grade',   Illust: IllustFlatModBitumen },
];

// ── Illustration card (SVG replaces Unsplash photo) ──────────────────────────
function IllustrationCard({ item, value, onChange, primaryColor }) {
  const active = value === item.id;
  const { Illust } = item;

  return (
    <button
      type="button"
      onClick={() => onChange(item.id)}
      style={{
        padding: 0, borderRadius: 12, cursor: 'pointer', textAlign: 'left',
        border: `2px solid ${active ? primaryColor : '#e2e8f0'}`,
        background: 'white', overflow: 'hidden',
        boxShadow: active ? `0 0 0 3px ${primaryColor}28` : '0 1px 4px rgba(0,0,0,0.06)',
        transition: 'all 0.18s',
        position: 'relative',
      }}
    >
      {/* Illustration area */}
      <div style={{ height: 110, overflow: 'hidden', position: 'relative' }}>
        <Illust />
        {/* Active checkmark */}
        {active && (
          <div style={{
            position: 'absolute', top: 7, right: 7,
            width: 22, height: 22, borderRadius: '50%',
            background: primaryColor, display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
          }}>
            <Check size={12} color="white" strokeWidth={3} />
          </div>
        )}
        {/* Badge */}
        {item.badge && (
          <div style={{
            position: 'absolute', bottom: 7, left: 7, padding: '2px 8px', borderRadius: 6,
            background: `${item.badge.color}e8`, color: 'white', fontSize: 9.5, fontWeight: 700,
            letterSpacing: '0.04em', textTransform: 'uppercase',
          }}>
            {item.badge.label}
          </div>
        )}
        {/* Price badge */}
        {item.price && (
          <div style={{
            position: 'absolute', bottom: 7, left: 7, padding: '3px 9px', borderRadius: 6,
            background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)',
            color: item.priceColor || 'white', fontSize: 13, fontWeight: 800, letterSpacing: '0.02em',
          }}>
            {item.price}
          </div>
        )}
      </div>

      {/* Label area */}
      <div style={{
        padding: '9px 11px 10px',
        borderTop: `1px solid ${active ? primaryColor + '28' : '#f1f5f9'}`,
        background: active ? `${primaryColor}05` : 'white',
      }}>
        <div style={{ fontSize: 12.5, fontWeight: 700, color: active ? '#0f172a' : '#374151', lineHeight: 1.3 }}>
          {item.label}
        </div>
        {item.sub && (
          <div style={{ fontSize: 10.5, color: active ? primaryColor : '#94a3b8', fontWeight: 600, marginTop: 1 }}>
            {item.sub}
          </div>
        )}
        <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2, lineHeight: 1.3 }}>
          {item.desc}
        </div>
      </div>
    </button>
  );
}

function IllustrationGrid({ items, value, onChange, primaryColor, cols = 3 }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${cols}, 1fr)`,
      gap: 10,
      marginTop: 8,
    }}>
      {items.map(item => (
        <IllustrationCard
          key={item.id}
          item={item}
          value={value}
          onChange={onChange}
          primaryColor={primaryColor}
        />
      ))}
    </div>
  );
}

// ── Small chips (for less visual things: stories, size, layers, penetrations) ──
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

// ── Main Component ────────────────────────────────────────────────────────────
export default function RoofDetailsStep({ value, serviceType, onBack, onNext, primaryColor = '#ea580c', companyConfig = null }) {
  const qc = companyConfig?.questionConfig || {};

  const [roofSize,       setRoofSize]       = useState(value.roofSize       || '');
  const [stories,        setStories]        = useState(value.stories        || '');
  const [pitch,          setPitch]          = useState(value.pitch          || '');
  const [shingleGrade,   setShingleGrade]   = useState(value.shingleGrade   || '');
  const [complexity,     setComplexity]     = useState(value.complexity     || '');
  const [existingLayers, setExistingLayers] = useState(value.existingLayers || '');
  const [penetrations,   setPenetrations]   = useState(value.penetrations   || 'none');
  const [metalType,      setMetalType]      = useState(value.metalType      || '');
  const [tileType,       setTileType]       = useState(value.tileType       || '');
  const [flatType,       setFlatType]       = useState(value.flatType       || '');
  const [addOns,         setAddOns]         = useState(value.addOns         || []);

  const toggleAddOn = (id) => setAddOns(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const isAsphalt     = serviceType === 'shingle_replacement';
  const isMetal       = serviceType === 'metal_roofing';
  const isTile        = serviceType === 'tile_roofing';
  const isFlat        = serviceType === 'flat_roof';
  const isReplacement = isAsphalt || isMetal || isTile || isFlat;

  const sqft = SIZE_TO_SQFT[roofSize] || 1750;

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
    const resolvedStories      = showStories      ? Number(stories) : 1;
    const resolvedPitch        = showPitch        ? pitch           : 'medium';
    const resolvedShingleGrade = showShingleGrade ? shingleGrade    : 'architectural';
    const resolvedComplexity   = showComplexity   ? complexity      : 'moderate';
    const resolvedLayers       = showLayers       ? existingLayers  : 'one';
    const resolvedPenetrations = showPenetrations ? penetrations    : 'none';
    const resolvedAddOns       = showAddOns       ? addOns          : [];

    const base = {
      roofSize,
      stories:        resolvedStories,
      pitch:          resolvedPitch,
      addOns:         resolvedAddOns,
      complexity:     resolvedComplexity,
      existingLayers: resolvedLayers,
      penetrations:   resolvedPenetrations,
    };

    if (isFlat) {
      onNext({ ...base, buildingFootprint: sqft, flatMaterial: showMaterialType ? flatType  : 'tpo'           });
    } else if (isMetal) {
      onNext({ ...base, houseSqft: sqft,          metalType:   showMaterialType ? metalType : 'standing_seam' });
    } else if (isTile) {
      onNext({ ...base, houseSqft: sqft,          tileType:    showMaterialType ? tileType  : 'concrete_tile' });
    } else {
      onNext({ ...base, houseSqft: sqft, shingleGrade: resolvedShingleGrade });
    }
  };

  const fieldLabel = { fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 0 };
  const fieldWrap  = { marginBottom: 22 };
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
      {/* ── Roof size ── */}
      <div style={fieldWrap}>
        <label style={fieldLabel}>Approximate roof size</label>
        <Chips options={SIZE_OPTIONS} value={roofSize} onChange={setRoofSize} primaryColor={primaryColor} />
      </div>

      {/* ── Pitch — photo cards ── */}
      {showPitch && !isFlat && (
        <div style={fieldWrap}>
          <label style={fieldLabel}>Roof pitch</label>
          <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>How steep is the slope? Steeper = more surface area and tougher labor.</div>
          <IllustrationGrid items={PITCH_CARDS} value={pitch} onChange={setPitch} primaryColor={primaryColor} cols={3} />
        </div>
      )}

      {/* ── Stories ── */}
      {showStories && (
        <div style={fieldWrap}>
          <label style={fieldLabel}>Number of stories</label>
          <Chips options={STORY_OPTIONS} value={stories} onChange={setStories} primaryColor={primaryColor} />
        </div>
      )}

      {/* ── Asphalt: shingle grade — photo cards ── */}
      {isAsphalt && showShingleGrade && (
        <div style={{ ...fieldWrap, ...divider }}>
          <label style={fieldLabel}>Shingle grade</label>
          <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>The single biggest price variable. Choose what fits your budget and longevity needs.</div>
          <IllustrationGrid items={GRADE_CARDS} value={shingleGrade} onChange={setShingleGrade} primaryColor={primaryColor} cols={3} />
        </div>
      )}

      {/* ── Metal roof type — photo cards ── */}
      {isMetal && showMaterialType && (
        <div style={{ ...fieldWrap, ...divider }}>
          <label style={fieldLabel}>Metal roof type</label>
          <IllustrationGrid items={METAL_CARDS} value={metalType} onChange={setMetalType} primaryColor={primaryColor} cols={3} />
        </div>
      )}

      {/* ── Tile material — photo cards ── */}
      {isTile && showMaterialType && (
        <div style={{ ...fieldWrap, ...divider }}>
          <label style={fieldLabel}>Tile material</label>
          <IllustrationGrid items={TILE_CARDS} value={tileType} onChange={setTileType} primaryColor={primaryColor} cols={3} />
        </div>
      )}

      {/* ── Flat roof system ── */}
      {isFlat && showMaterialType && (
        <div style={{ ...fieldWrap, ...divider }}>
          <label style={fieldLabel}>Flat roof system</label>
          <IllustrationGrid items={FLAT_CARDS} value={flatType} onChange={setFlatType} primaryColor={primaryColor} cols={3} />
        </div>
      )}

      {/* ── Roof complexity — photo cards ── */}
      {isReplacement && showComplexity && (
        <div style={{ ...fieldWrap, ...divider }}>
          <label style={fieldLabel}>Roof shape / complexity</label>
          <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>More angles, valleys, and dormers = higher labor cost and more material waste.</div>
          <IllustrationGrid items={COMPLEXITY_CARDS} value={complexity} onChange={setComplexity} primaryColor={primaryColor} cols={3} />
        </div>
      )}

      {/* ── Existing layers ── */}
      {isReplacement && showLayers && (
        <div style={fieldWrap}>
          <label style={fieldLabel}>How many existing shingle layers?</label>
          <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>A second layer doubles tear-off cost and disposal fees.</div>
          <Chips options={LAYERS_OPTIONS} value={existingLayers} onChange={setExistingLayers} primaryColor={primaryColor} />
        </div>
      )}

      {/* ── Penetrations ── */}
      {showPenetrations && (
        <div style={fieldWrap}>
          <label style={fieldLabel}>Penetrations — chimneys, skylights, pipe boots</label>
          <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>Each one requires custom flashing work.</div>
          <Chips options={PENETRATION_OPTIONS} value={penetrations} onChange={setPenetrations} primaryColor={primaryColor} />
        </div>
      )}

      {/* ── Add-ons (asphalt only) ── */}
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
