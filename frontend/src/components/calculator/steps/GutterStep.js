import React, { useState } from 'react';
import { Droplets, Check } from 'lucide-react';
import StepWrapper from './StepWrapper';
import {
  IllustGutterAluminum, IllustGutterVinyl,
  IllustGutterSteel,   IllustGutterCopper,
} from './RoofIllustrations';

const GUTTER_MATERIAL_CARDS = [
  { id: 'aluminum', label: 'Aluminum',      sub: 'Most common',  desc: '20–30 yr · low maintenance',  Illust: IllustGutterAluminum },
  { id: 'vinyl',    label: 'Vinyl',          sub: 'Budget',       desc: '10–20 yr · lightweight',       Illust: IllustGutterVinyl },
  { id: 'steel',    label: 'Steel',          sub: 'Heavy duty',   desc: '20–50 yr · dent resistant',   Illust: IllustGutterSteel },
  { id: 'copper',   label: 'Copper',         sub: 'Premium',      desc: '50+ yr · no painting needed', Illust: IllustGutterCopper },
];

const STORY_OPTIONS       = [['1','1 story'],['2','2 stories'],['3','3+ stories']];
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
        transition: 'all 0.18s', position: 'relative',
      }}
    >
      <div style={{ height: 110, overflow: 'hidden', position: 'relative' }}>
        <Illust />
        {active && (
          <div style={{
            position: 'absolute', top: 7, right: 7, width: 22, height: 22, borderRadius: '50%',
            background: primaryColor, display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
          }}>
            <Check size={12} color="white" strokeWidth={3} />
          </div>
        )}
      </div>
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

export default function GutterStep({ value, onBack, onNext, primaryColor = '#ea580c' }) {
  const [linearFeet,     setLinearFeet] = useState(value.linearFeet     || '');
  const [gutterMaterial, setMaterial]   = useState(value.gutterMaterial || '');
  const [stories,        setStories]    = useState(value.stories        || '');
  const [addOns,         setAddOns]     = useState(value.addOns         || []);

  const toggleAddOn = (id) => setAddOns(prev =>
    prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
  );
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
      primaryColor={primaryColor}
    >
      {/* ── Linear footage ── */}
      <div style={fieldWrap}>
        <label style={fieldLabel}>Approximate linear footage</label>
        <Chips options={LINEAR_FEET_OPTIONS} value={linearFeet} onChange={setLinearFeet} primaryColor={primaryColor} />
      </div>

      {/* ── Gutter material — illustration cards ── */}
      <div style={fieldWrap}>
        <label style={fieldLabel}>Gutter material</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginTop: 8 }}>
          {GUTTER_MATERIAL_CARDS.map(item => (
            <IllustrationCard
              key={item.id}
              item={item}
              value={gutterMaterial}
              onChange={setMaterial}
              primaryColor={primaryColor}
            />
          ))}
        </div>
      </div>

      {/* ── Stories ── */}
      <div style={fieldWrap}>
        <label style={fieldLabel}>Number of stories</label>
        <Chips options={STORY_OPTIONS} value={stories} onChange={setStories} primaryColor={primaryColor} />
      </div>

      {/* ── Add-ons ── */}
      <div style={fieldWrap}>
        <label style={{ ...fieldLabel, marginBottom: 8 }}>
          Add-ons <span style={{ color: '#94a3b8', fontWeight: 400 }}>(optional)</span>
        </label>
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
