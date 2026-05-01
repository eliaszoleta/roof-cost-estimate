// RoofCalc — Default roofing company configuration & pricing data
// Pricing sourced from: HomeAdvisor 2024, Angi 2024, Remodeling Magazine Cost vs. Value,
// NAHB, Roofing Contractor Magazine, RSMeans data, contractor interviews.
// Updated: 2026

// ─────────────────────────────────────────────────────────────────────────────
// STATE PRICING MULTIPLIERS
// National average = 1.00 (represented by Midwest states like OH, IN, MO)
// Factors: BLS construction wages, local permit costs, material freight, COL
// ─────────────────────────────────────────────────────────────────────────────
const STATE_PRICING_MULTIPLIERS = {
  AL: 0.85, AK: 1.42, AZ: 1.05, AR: 0.82, CA: 1.48, CO: 1.20, CT: 1.30,
  DE: 1.12, DC: 1.50, FL: 1.10, GA: 0.95, HI: 1.55, ID: 0.95, IL: 1.18,
  IN: 0.92, IA: 0.88, KS: 0.87, KY: 0.85, LA: 0.88, ME: 1.05, MD: 1.22,
  MA: 1.38, MI: 1.00, MN: 1.12, MS: 0.80, MO: 0.90, MT: 0.98, NE: 0.90,
  NV: 1.10, NH: 1.18, NJ: 1.32, NM: 0.88, NY: 1.45, NC: 0.93, ND: 0.93,
  OH: 0.95, OK: 0.85, OR: 1.18, PA: 1.10, RI: 1.22, SC: 0.88, SD: 0.88,
  TN: 0.88, TX: 1.05, UT: 1.05, VT: 1.12, VA: 1.12, WA: 1.30, WV: 0.80,
  WI: 1.00, WY: 0.93,
};

const STATE_NAMES = {
  AL: 'Alabama', AK: 'Alaska', AZ: 'Arizona', AR: 'Arkansas', CA: 'California',
  CO: 'Colorado', CT: 'Connecticut', DE: 'Delaware', DC: 'Washington DC',
  FL: 'Florida', GA: 'Georgia', HI: 'Hawaii', ID: 'Idaho', IL: 'Illinois',
  IN: 'Indiana', IA: 'Iowa', KS: 'Kansas', KY: 'Kentucky', LA: 'Louisiana',
  ME: 'Maine', MD: 'Maryland', MA: 'Massachusetts', MI: 'Michigan', MN: 'Minnesota',
  MS: 'Mississippi', MO: 'Missouri', MT: 'Montana', NE: 'Nebraska', NV: 'Nevada',
  NH: 'New Hampshire', NJ: 'New Jersey', NM: 'New Mexico', NY: 'New York',
  NC: 'North Carolina', ND: 'North Dakota', OH: 'Ohio', OK: 'Oklahoma',
  OR: 'Oregon', PA: 'Pennsylvania', RI: 'Rhode Island', SC: 'South Carolina',
  SD: 'South Dakota', TN: 'Tennessee', TX: 'Texas', UT: 'Utah', VT: 'Vermont',
  VA: 'Virginia', WA: 'Washington', WV: 'West Virginia', WI: 'Wisconsin', WY: 'Wyoming',
};

// Average installed roof cost per sq ft by state (for display/SEO)
const STATE_AVERAGE_ROOF_COST_PER_SQFT = {
  AL: 4.20, AK: 7.10, AZ: 5.30, AR: 4.10, CA: 7.40, CO: 6.00, CT: 6.50,
  DE: 5.60, DC: 7.50, FL: 5.50, GA: 4.80, HI: 7.80, ID: 4.80, IL: 5.90,
  IN: 4.60, IA: 4.40, KS: 4.35, KY: 4.25, LA: 4.40, ME: 5.25, MD: 6.10,
  MA: 6.90, MI: 5.00, MN: 5.60, MS: 4.00, MO: 4.50, MT: 4.90, NE: 4.50,
  NV: 5.50, NH: 5.90, NJ: 6.60, NM: 4.40, NY: 7.25, NC: 4.65, ND: 4.65,
  OH: 4.75, OK: 4.25, OR: 5.90, PA: 5.50, RI: 6.10, SC: 4.40, SD: 4.40,
  TN: 4.40, TX: 5.25, UT: 5.25, VT: 5.60, VA: 5.60, WA: 6.50, WV: 4.00,
  WI: 5.00, WY: 4.65,
};

// ─────────────────────────────────────────────────────────────────────────────
// PITCH MULTIPLIERS  (single value — pitch is a known fact, not a range)
// Applied once to roof area cost. Low-slope faster; steep requires equipment.
// ─────────────────────────────────────────────────────────────────────────────
const PITCH_MULTIPLIERS = {
  flat:       0.92,   // < 2:12  — easiest, walkable
  low:        1.00,   // 2:12–4:12 — baseline
  medium:     1.11,   // 4:12–6:12 — slight added labor
  steep:      1.28,   // 6:12–9:12 — harness required
  very_steep: 1.50,   // 9:12+  — major safety/equipment cost
};

// ─────────────────────────────────────────────────────────────────────────────
// STORY MULTIPLIERS  (single value — stories is a known fact, not a range)
// ─────────────────────────────────────────────────────────────────────────────
const STORY_MULTIPLIERS = {
  1:    1.00,
  2:    1.11,
  '3+': 1.25,
};

// ─────────────────────────────────────────────────────────────────────────────
// COMPLEXITY MULTIPLIERS  (roof shape/cut complexity)
// Simple = gable/shed; Moderate = hip/gambrel; Complex = dormers/multi-peak
// ─────────────────────────────────────────────────────────────────────────────
const COMPLEXITY_MULTIPLIERS = {
  simple:   0.92,   // straight runs, minimal cuts
  moderate: 1.00,   // baseline
  complex:  1.20,   // many valleys, dormers, skylight cuts — more waste + labor
};

// ─────────────────────────────────────────────────────────────────────────────
// TEAR-OFF COSTS (per sq ft of roof area)
// ─────────────────────────────────────────────────────────────────────────────
const TEAROFF_COSTS = {
  none:         { low: 0,    high: 0    },
  single_layer: { low: 0.80, high: 1.20 },
  double_layer: { low: 1.30, high: 1.90 },
  triple_plus:  { low: 1.80, high: 2.50 },
};

// ─────────────────────────────────────────────────────────────────────────────
// DECKING / SHEATHING REPLACEMENT (per sq ft)
// ─────────────────────────────────────────────────────────────────────────────
const DECKING_COSTS = {
  none:    { low: 0,    high: 0    },
  partial: { low: 2.00, high: 3.50 }, // ~20% of deck area typically affected
  full:    { low: 3.50, high: 5.50 },
};

// ─────────────────────────────────────────────────────────────────────────────
// PENETRATION COSTS — flat adder for chimneys, skylights, pipe boots
// "low" = 1–2, "medium" = 3–4, "high" = 5+
// Each penetration requires custom flashing: $200–$500 per opening
// ─────────────────────────────────────────────────────────────────────────────
const PENETRATION_COSTS = {
  none:   { low: 0,    high: 0    },
  low:    { low: 350,  high: 700  },   // 1–2 openings × ~$200–350 each
  medium: { low: 700,  high: 1400 },   // 3–4 openings
  high:   { low: 1200, high: 2200 },   // 5+ openings
};

// ─────────────────────────────────────────────────────────────────────────────
// SHINGLE REPLACEMENT — installed cost per sq ft (material + labor)
// Source: HomeAdvisor 2024, Remodeling Magazine Cost vs. Value 2024
// Keys include frontend aliases (standard → three_tab)
// ─────────────────────────────────────────────────────────────────────────────
const SHINGLE_COSTS_PER_SQFT = {
  three_tab:     { low: 3.25, high: 4.75  }, // economy 3-tab
  standard:      { low: 3.25, high: 4.75  }, // frontend alias for three_tab
  architectural: { low: 4.25, high: 6.25  }, // dimensional / laminated (most common)
  premium:       { low: 6.00, high: 9.50  }, // impact-resistant / 50-yr
  designer:      { low: 8.25, high: 12.50 }, // luxury / Class 4
};

// Underlayment upgrades (per sq ft) — standard felt is baseline ($0 addon)
const UNDERLAYMENT_ADDONS = {
  standard_felt:    { low: 0,    high: 0    },
  synthetic:        { low: 0.25, high: 0.45 },
  ice_water_shield: { low: 0.55, high: 0.95 },
};

// ─────────────────────────────────────────────────────────────────────────────
// METAL ROOFING — installed cost per sq ft
// Source: MetalRoofingAlliance.org, Angi 2024
// ─────────────────────────────────────────────────────────────────────────────
const METAL_COSTS_PER_SQFT = {
  corrugated:    { low: 7.50,  high: 10.50 }, // corrugated panels
  ribbed:        { low: 9.00,  high: 12.50 }, // R-panel / ribbed (between corrugated & standing seam)
  metal_shingle: { low: 10.50, high: 15.00 },
  stone_coated:  { low: 10.00, high: 14.50 },
  standing_seam: { low: 15.00, high: 21.00 }, // premium concealed fastener
};

// ─────────────────────────────────────────────────────────────────────────────
// FLAT / LOW-SLOPE ROOFING — installed cost per sq ft
// ─────────────────────────────────────────────────────────────────────────────
const FLAT_ROOF_COSTS_PER_SQFT = {
  tpo:              { low: 6.00, high: 8.50  },
  epdm:             { low: 5.00, high: 7.50  },
  modified_bitumen: { low: 4.50, high: 6.50  },
  built_up:         { low: 4.50, high: 7.00  },
  pvc:              { low: 6.50, high: 9.50  },
};

// ─────────────────────────────────────────────────────────────────────────────
// TILE ROOFING — installed cost per sq ft
// Source: RSMeans 2024, HomeAdvisor
// Keys include frontend aliases (slate → natural_slate)
// ─────────────────────────────────────────────────────────────────────────────
const TILE_COSTS_PER_SQFT = {
  concrete_tile:   { low: 10.00, high: 16.00 },
  clay_tile:       { low: 14.00, high: 22.00 },
  slate:           { low: 22.00, high: 34.00 }, // frontend alias for natural_slate
  natural_slate:   { low: 22.00, high: 34.00 },
  synthetic_slate: { low: 10.00, high: 16.00 },
};

// ─────────────────────────────────────────────────────────────────────────────
// ROOF REPAIR — flat cost by damage size
// ─────────────────────────────────────────────────────────────────────────────
const REPAIR_COSTS = {
  minor:     { low: 150,  high: 450   }, // < 50 sq ft, flashing, 1–5 shingles
  small:     { low: 400,  high: 1100  }, // 50–200 sq ft
  medium:    { low: 1000, high: 2800  }, // 200–500 sq ft
  large:     { low: 2500, high: 6500  }, // 500+ sq ft
  emergency: { low: 450,  high: 2200  }, // emergency tarping / leak stop
};

// ─────────────────────────────────────────────────────────────────────────────
// ROOF INSPECTION
// ─────────────────────────────────────────────────────────────────────────────
const INSPECTION_COSTS = {
  standard:   { low: 150, high: 325 },
  drone:      { low: 200, high: 400 },
  post_storm: { low: 200, high: 475 },
  thermal:    { low: 400, high: 750 },
};

// ─────────────────────────────────────────────────────────────────────────────
// GUTTER REPLACEMENT — per linear foot installed
// ─────────────────────────────────────────────────────────────────────────────
const GUTTER_COSTS_PER_LF = {
  vinyl:     { low: 3.00,  high: 5.50  },
  aluminum:  { low: 5.00,  high: 9.00  },
  steel:     { low: 8.00,  high: 13.00 },
  copper:    { low: 20.00, high: 38.00 },
};

const DOWNSPOUT_COST      = { low: 5,    high: 9    }; // per linear foot
const GUTTER_GUARD_COST   = { low: 1.50, high: 4.50 }; // per linear foot

// ─────────────────────────────────────────────────────────────────────────────
// FASCIA & SOFFIT
// ─────────────────────────────────────────────────────────────────────────────
const SOFFIT_COSTS_PER_SQFT = {
  vinyl:        { low: 2.00, high: 4.50 },
  aluminum:     { low: 3.00, high: 6.00 },
  wood:         { low: 4.00, high: 8.00 },
  fiber_cement: { low: 5.00, high: 9.00 },
};

const FASCIA_COSTS_PER_LF = {
  vinyl:        { low: 4.00, high: 8.00  },
  aluminum:     { low: 5.00, high: 10.00 },
  wood:         { low: 6.00, high: 14.00 },
  fiber_cement: { low: 7.00, high: 13.00 },
};

// ─────────────────────────────────────────────────────────────────────────────
// COMMON ADD-ON COSTS
// ─────────────────────────────────────────────────────────────────────────────
const ADDON_COSTS = {
  ridge_cap_upgrade:     { low: 200,  high: 500  },
  attic_vent_each:       { low: 150,  high: 325  },
  chimney_flashing:      { low: 200,  high: 500  },
  skylight_flashing:     { low: 150,  high: 350  },
  drip_edge_per_lf:      { low: 1.50, high: 3.00 },
  pipe_boot_each:        { low: 75,   high: 150  },
  ice_dam_prevention_lf: { low: 2.50, high: 5.00 },
  solar_mount_prep:      { low: 500,  high: 1500 },
  roof_coating:          { low: 1.00, high: 3.50 },
  radiant_barrier:       { low: 0.50, high: 1.50 },
  // Frontend add-on aliases (flat costs per job)
  new_decking:           { low: 0,    high: 0    }, // handled separately via deckingReplacement
  ridge_ventilation:     { low: 400,  high: 900  }, // full ridge vent system
  gutter_replacement:    { low: 0,    high: 0    }, // separate service — excluded from roofing calc
};

// ─────────────────────────────────────────────────────────────────────────────
// DEFAULT ROOFING COMPANY CONFIG
// ─────────────────────────────────────────────────────────────────────────────
const DEFAULT_COMPANY_CONFIG = {
  companyName: '',
  logo: '',
  primaryColor: '#dc2626',
  accentColor: '#b45309',
  fontFamily: 'Inter',
  ctaHeadline: 'Get Your Free Roof Estimate',
  ctaSubtext: 'Licensed, insured roofing contractors ready to help.',
  ctaButtonText: 'Schedule Free Inspection',
  ctaPhone: '',
  ctaButtonUrl: '',
  frameHeight: '750px',
  borderRadius: '12px',
  serviceStates: [],
  customSteps: [],
  subscription: {
    status: 'trialing',
    trialStartedAt: null,
    stripeCustomerId: null,
    stripeSubscriptionId: null,
    currentPeriodEnd: null,
    cancelAtPeriodEnd: false,
  },
  apiKey: null,
  services: {
    shingleReplacement: { enabled: true, markup: 1.0 },
    metalRoofing:       { enabled: true, markup: 1.0 },
    flatRoof:           { enabled: true, markup: 1.0 },
    tileRoofing:        { enabled: true, markup: 1.0 },
    roofRepair:         { enabled: true, markup: 1.0 },
    roofInspection:     { enabled: true, markup: 1.0 },
    gutterReplacement:  { enabled: true, markup: 1.0 },
    fasciaSoffit:       { enabled: true, markup: 1.0 },
  },
};

module.exports = {
  STATE_PRICING_MULTIPLIERS,
  STATE_NAMES,
  STATE_AVERAGE_ROOF_COST_PER_SQFT,
  PITCH_MULTIPLIERS,
  STORY_MULTIPLIERS,
  COMPLEXITY_MULTIPLIERS,
  TEAROFF_COSTS,
  DECKING_COSTS,
  PENETRATION_COSTS,
  SHINGLE_COSTS_PER_SQFT,
  UNDERLAYMENT_ADDONS,
  METAL_COSTS_PER_SQFT,
  FLAT_ROOF_COSTS_PER_SQFT,
  TILE_COSTS_PER_SQFT,
  REPAIR_COSTS,
  INSPECTION_COSTS,
  GUTTER_COSTS_PER_LF,
  DOWNSPOUT_COST,
  GUTTER_GUARD_COST,
  SOFFIT_COSTS_PER_SQFT,
  FASCIA_COSTS_PER_LF,
  ADDON_COSTS,
  DEFAULT_COMPANY_CONFIG,
};
