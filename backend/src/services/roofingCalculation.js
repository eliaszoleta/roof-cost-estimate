// RoofCalc — Core roofing cost calculation engine

const {
  STATE_PRICING_MULTIPLIERS,
  STATE_NAMES,
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
} = require('../config/defaults');

// ─── Helpers ──────────────────────────────────────────────────────────────────

function round(n) { return Math.round(n); }

function addCosts(a, b) {
  return { low: a.low + b.low, high: a.high + b.high };
}

/** Apply a single scalar multiplier to a cost band */
function applyMult(cost, mult) {
  return { low: cost.low * mult, high: cost.high * mult };
}

/** Apply state multiplier + markup to a cost band */
function applyFinal(cost, stateMult, markup) {
  return { low: round(cost.low * stateMult * markup), high: round(cost.high * stateMult * markup) };
}

// ─── Input normalisers ────────────────────────────────────────────────────────
// The frontend uses slightly different key names/values than the backend tables.
// All mapping lives here so the calculators stay clean.

/** existingLayers ('one'|'two'|'unknown') → tearoffLayers key */
function normaliseLayers(existingLayers, tearoffLayers) {
  if (tearoffLayers) return tearoffLayers;
  const map = { one: 'single_layer', two: 'double_layer', unknown: 'double_layer' };
  return map[existingLayers] || 'single_layer';
}

/** shingleGrade ('standard'|'architectural'|'designer') → SHINGLE_COSTS key */
function normaliseShingleGrade(shingleGrade, shingleType) {
  if (shingleType && SHINGLE_COSTS_PER_SQFT[shingleType]) return shingleType;
  if (shingleGrade && SHINGLE_COSTS_PER_SQFT[shingleGrade]) return shingleGrade;
  return 'architectural';
}

/** metalType from frontend ('ribbed') → METAL_COSTS key */
function normaliseMetalType(metalType) {
  if (metalType && METAL_COSTS_PER_SQFT[metalType]) return metalType;
  // r_panel is an alias used by some callers
  if (metalType === 'r_panel') return 'ribbed';
  return 'standing_seam';
}

/** tileType ('slate') → TILE_COSTS key */
function normaliseTileType(tileType) {
  if (tileType && TILE_COSTS_PER_SQFT[tileType]) return tileType;
  return 'concrete_tile';
}

/**
 * Map frontend addOns string array to backend parameters.
 * Returns { deckingReplacement, underlayment, extraAddons[] }
 */
function normaliseAddOns(addOnsArray = []) {
  let deckingReplacement = 'none';
  let underlayment = 'standard_felt';
  const extraAddons = [];

  for (const id of addOnsArray) {
    if (id === 'new_decking') {
      deckingReplacement = 'partial'; // assume ~20% deck replacement
    } else if (id === 'ice_water_shield') {
      underlayment = 'ice_water_shield';
    } else if (id === 'ridge_ventilation') {
      extraAddons.push({ type: 'ridge_ventilation', quantity: 1 });
    }
    // gutter_replacement is a separate service — skip in roofing calc
  }
  return { deckingReplacement, underlayment, extraAddons };
}

// ─── Resolve state from ZIP/state input ───────────────────────────────────────

function resolveState(state, zip) {
  if (state && STATE_PRICING_MULTIPLIERS[state.toUpperCase()]) {
    return state.toUpperCase();
  }
  if (zip) {
    const prefix = parseInt(String(zip).substring(0, 3), 10);
    const zipMap = [
      [[0, 2], 'MA'], [[3, 6], 'MA'],
      [[10, 14], 'NY'], [[15, 19], 'PA'], [[20, 20], 'DC'],
      [[21, 21], 'MD'], [[22, 24], 'VA'], [[25, 26], 'WV'],
      [[27, 28], 'NC'], [[29, 29], 'SC'], [[30, 31], 'GA'],
      [[32, 34], 'FL'], [[35, 36], 'AL'], [[37, 38], 'TN'],
      [[39, 39], 'MS'], [[40, 42], 'KY'], [[43, 45], 'OH'],
      [[46, 47], 'IN'], [[48, 49], 'MI'], [[50, 52], 'IA'],
      [[53, 54], 'WI'], [[55, 56], 'MN'], [[57, 57], 'SD'],
      [[58, 58], 'ND'], [[59, 59], 'MT'], [[60, 62], 'IL'],
      [[63, 65], 'MO'], [[66, 67], 'KS'], [[68, 69], 'NE'],
      [[70, 71], 'LA'], [[72, 72], 'AR'], [[73, 74], 'OK'],
      [[75, 79], 'TX'], [[80, 81], 'CO'], [[82, 82], 'WY'],
      [[83, 83], 'ID'], [[84, 84], 'UT'], [[85, 86], 'AZ'],
      [[87, 88], 'NM'], [[89, 89], 'NV'], [[90, 96], 'CA'],
      [[97, 97], 'OR'], [[98, 99], 'WA'],
    ];
    for (const [range, abbr] of zipMap) {
      if (prefix >= range[0] && prefix <= range[1]) return abbr;
    }
  }
  return 'OH'; // national average fallback
}

/**
 * Estimate roof area from house footprint.
 * Roof area = footprint × pitch factor.
 */
function estimateRoofArea(houseSqft, pitch) {
  const pitchFactors = {
    flat: 1.00, low: 1.05, medium: 1.20, steep: 1.40, very_steep: 1.60,
  };
  return Math.round(houseSqft * (pitchFactors[pitch] || 1.10));
}

// ─── Per-service calculators ──────────────────────────────────────────────────

function calcShingleReplacement(details, stateMult, markup) {
  const {
    roofArea, houseSqft,
    pitch = 'medium',
    stories = 1,
    complexity = 'moderate',
    penetrations = 'none',
    addOns = [],      // frontend string array
    addons = [],      // backend object array (direct API calls)
  } = details;

  const shingleKey   = normaliseShingleGrade(details.shingleGrade, details.shingleType);
  const tearoffKey   = normaliseLayers(details.existingLayers, details.tearoffLayers);
  const { deckingReplacement, underlayment, extraAddons } = normaliseAddOns(addOns);

  const area       = roofArea ? Number(roofArea) : houseSqft ? estimateRoofArea(Number(houseSqft), pitch) : 1800;
  const pitchMult  = PITCH_MULTIPLIERS[pitch]            || PITCH_MULTIPLIERS.medium;
  const storyMult  = STORY_MULTIPLIERS[String(stories)]  || STORY_MULTIPLIERS[1];
  const complexMult= COMPLEXITY_MULTIPLIERS[complexity]  || COMPLEXITY_MULTIPLIERS.moderate;
  const combinedMult = pitchMult * storyMult * complexMult;

  const shingleCost = SHINGLE_COSTS_PER_SQFT[shingleKey] || SHINGLE_COSTS_PER_SQFT.architectural;
  const breakdown   = [];

  // Base install (material + labor)
  let total = applyMult(shingleCost, area * combinedMult);
  breakdown.push({ label: `${shingleKey.replace(/_/g, ' ')} shingles — ${area.toLocaleString()} sq ft`, low: round(total.low), high: round(total.high) });

  // Tear-off
  const tearoff = TEAROFF_COSTS[tearoffKey] || TEAROFF_COSTS.single_layer;
  if (tearoff.low > 0) {
    const t = applyMult(tearoff, area);
    breakdown.push({ label: `Tear-off (${tearoffKey.replace(/_/g, ' ')})`, low: round(t.low), high: round(t.high) });
    total = addCosts(total, t);
  }

  // Decking replacement
  const deckingKey = details.deckingReplacement || deckingReplacement;
  const decking    = DECKING_COSTS[deckingKey]  || DECKING_COSTS.none;
  if (decking.low > 0) {
    const deckArea = deckingKey === 'partial' ? area * 0.20 : area;
    const d = applyMult(decking, deckArea);
    breakdown.push({ label: `Decking replacement (${deckingKey})`, low: round(d.low), high: round(d.high) });
    total = addCosts(total, d);
  }

  // Underlayment upgrade
  const underlayKey  = details.underlayment || underlayment;
  const underlayAddon = UNDERLAYMENT_ADDONS[underlayKey] || UNDERLAYMENT_ADDONS.standard_felt;
  if (underlayAddon.low > 0) {
    const u = applyMult(underlayAddon, area);
    breakdown.push({ label: `Underlayment upgrade (${underlayKey.replace(/_/g, ' ')})`, low: round(u.low), high: round(u.high) });
    total = addCosts(total, u);
  }

  // Penetrations (chimneys, skylights, pipe boots)
  const penetrationCost = PENETRATION_COSTS[penetrations] || PENETRATION_COSTS.none;
  if (penetrationCost.low > 0) {
    breakdown.push({ label: `Penetration flashing (${penetrations})`, low: penetrationCost.low, high: penetrationCost.high });
    total = addCosts(total, penetrationCost);
  }

  // Extra add-ons (from both frontend string array and direct addons)
  const allAddons = [...extraAddons, ...addons];
  for (const addon of allAddons) {
    const cost = ADDON_COSTS[addon.type];
    if (!cost || cost.low === 0) continue;
    const qty = Number(addon.quantity) || 1;
    const a = applyMult(cost, qty);
    breakdown.push({ label: `${addon.type.replace(/_/g, ' ')} ×${qty}`, low: round(a.low), high: round(a.high) });
    total = addCosts(total, a);
  }

  const final = applyFinal(total, stateMult, markup);
  return { breakdown, totalLow: final.low, totalHigh: final.high, roofArea: area };
}

function calcMetalRoofing(details, stateMult, markup) {
  const {
    roofArea, houseSqft,
    pitch = 'medium',
    stories = 1,
    complexity = 'moderate',
    penetrations = 'none',
    addons = [],
  } = details;

  const metalKey   = normaliseMetalType(details.metalType);
  const tearoffKey = normaliseLayers(details.existingLayers, details.tearoffLayers);

  const area        = roofArea ? Number(roofArea) : houseSqft ? estimateRoofArea(Number(houseSqft), pitch) : 1800;
  const pitchMult   = PITCH_MULTIPLIERS[pitch]           || PITCH_MULTIPLIERS.medium;
  const storyMult   = STORY_MULTIPLIERS[String(stories)] || STORY_MULTIPLIERS[1];
  const complexMult = COMPLEXITY_MULTIPLIERS[complexity] || COMPLEXITY_MULTIPLIERS.moderate;
  const combinedMult = pitchMult * storyMult * complexMult;

  const metalCost = METAL_COSTS_PER_SQFT[metalKey] || METAL_COSTS_PER_SQFT.standing_seam;
  const breakdown = [];

  let total = applyMult(metalCost, area * combinedMult);
  breakdown.push({ label: `${metalKey.replace(/_/g, ' ')} metal roofing — ${area.toLocaleString()} sq ft`, low: round(total.low), high: round(total.high) });

  const tearoff = TEAROFF_COSTS[tearoffKey] || TEAROFF_COSTS.single_layer;
  if (tearoff.low > 0) {
    const t = applyMult(tearoff, area);
    breakdown.push({ label: `Tear-off (${tearoffKey.replace(/_/g, ' ')})`, low: round(t.low), high: round(t.high) });
    total = addCosts(total, t);
  }

  const penetrationCost = PENETRATION_COSTS[penetrations] || PENETRATION_COSTS.none;
  if (penetrationCost.low > 0) {
    breakdown.push({ label: `Penetration flashing (${penetrations})`, low: penetrationCost.low, high: penetrationCost.high });
    total = addCosts(total, penetrationCost);
  }

  for (const addon of addons) {
    const cost = ADDON_COSTS[addon.type];
    if (!cost || cost.low === 0) continue;
    const qty = Number(addon.quantity) || 1;
    const a = applyMult(cost, qty);
    breakdown.push({ label: `${addon.type.replace(/_/g, ' ')} ×${qty}`, low: round(a.low), high: round(a.high) });
    total = addCosts(total, a);
  }

  const final = applyFinal(total, stateMult, markup);
  return { breakdown, totalLow: final.low, totalHigh: final.high, roofArea: area };
}

function calcFlatRoof(details, stateMult, markup) {
  const {
    roofArea, buildingFootprint,
    flatMaterial = 'tpo',
    addons = [],
  } = details;

  const tearoffKey = normaliseLayers(details.existingLayers, details.tearoffLayers);
  const area       = roofArea ? Number(roofArea) : buildingFootprint ? Number(buildingFootprint) : 1500;
  const flatCost   = FLAT_ROOF_COSTS_PER_SQFT[flatMaterial] || FLAT_ROOF_COSTS_PER_SQFT.tpo;
  const breakdown  = [];

  let total = applyMult(flatCost, area);
  breakdown.push({ label: `${flatMaterial.toUpperCase()} membrane — ${area.toLocaleString()} sq ft`, low: round(total.low), high: round(total.high) });

  const tearoff = TEAROFF_COSTS[tearoffKey] || TEAROFF_COSTS.single_layer;
  if (tearoff.low > 0) {
    const t = applyMult(tearoff, area);
    breakdown.push({ label: `Tear-off (${tearoffKey.replace(/_/g, ' ')})`, low: round(t.low), high: round(t.high) });
    total = addCosts(total, t);
  }

  for (const addon of addons) {
    const cost = ADDON_COSTS[addon.type];
    if (!cost || cost.low === 0) continue;
    const qty = Number(addon.quantity) || 1;
    const a = applyMult(cost, qty);
    breakdown.push({ label: `${addon.type.replace(/_/g, ' ')} ×${qty}`, low: round(a.low), high: round(a.high) });
    total = addCosts(total, a);
  }

  const final = applyFinal(total, stateMult, markup);
  return { breakdown, totalLow: final.low, totalHigh: final.high, roofArea: area };
}

function calcTileRoofing(details, stateMult, markup) {
  const {
    roofArea, houseSqft,
    pitch = 'medium',
    stories = 1,
    complexity = 'moderate',
    penetrations = 'none',
    addons = [],
  } = details;

  const tileKey    = normaliseTileType(details.tileType);
  const tearoffKey = normaliseLayers(details.existingLayers, details.tearoffLayers);

  const area        = roofArea ? Number(roofArea) : houseSqft ? estimateRoofArea(Number(houseSqft), pitch) : 1800;
  const pitchMult   = PITCH_MULTIPLIERS[pitch]           || PITCH_MULTIPLIERS.medium;
  const storyMult   = STORY_MULTIPLIERS[String(stories)] || STORY_MULTIPLIERS[1];
  const complexMult = COMPLEXITY_MULTIPLIERS[complexity] || COMPLEXITY_MULTIPLIERS.moderate;
  const combinedMult = pitchMult * storyMult * complexMult;

  const tileCost  = TILE_COSTS_PER_SQFT[tileKey] || TILE_COSTS_PER_SQFT.concrete_tile;
  const breakdown = [];

  let total = applyMult(tileCost, area * combinedMult);
  breakdown.push({ label: `${tileKey.replace(/_/g, ' ')} — ${area.toLocaleString()} sq ft`, low: round(total.low), high: round(total.high) });

  const tearoff = TEAROFF_COSTS[tearoffKey] || TEAROFF_COSTS.single_layer;
  if (tearoff.low > 0) {
    const t = applyMult(tearoff, area);
    breakdown.push({ label: `Tear-off (${tearoffKey.replace(/_/g, ' ')})`, low: round(t.low), high: round(t.high) });
    total = addCosts(total, t);
  }

  const penetrationCost = PENETRATION_COSTS[penetrations] || PENETRATION_COSTS.none;
  if (penetrationCost.low > 0) {
    breakdown.push({ label: `Penetration flashing (${penetrations})`, low: penetrationCost.low, high: penetrationCost.high });
    total = addCosts(total, penetrationCost);
  }

  for (const addon of addons) {
    const cost = ADDON_COSTS[addon.type];
    if (!cost || cost.low === 0) continue;
    const qty = Number(addon.quantity) || 1;
    const a = applyMult(cost, qty);
    breakdown.push({ label: `${addon.type.replace(/_/g, ' ')} ×${qty}`, low: round(a.low), high: round(a.high) });
    total = addCosts(total, a);
  }

  const final = applyFinal(total, stateMult, markup);
  return { breakdown, totalLow: final.low, totalHigh: final.high, roofArea: area };
}

function calcRoofRepair(details, stateMult, markup) {
  const { repairSize = 'small', addons = [] } = details;
  const repairCost = REPAIR_COSTS[repairSize] || REPAIR_COSTS.small;

  let total = { ...repairCost };
  const breakdown = [{ label: `Roof repair (${repairSize})`, low: repairCost.low, high: repairCost.high }];

  for (const addon of addons) {
    const cost = ADDON_COSTS[addon.type];
    if (!cost || cost.low === 0) continue;
    const qty = Number(addon.quantity) || 1;
    const a = applyMult(cost, qty);
    breakdown.push({ label: `${addon.type.replace(/_/g, ' ')} ×${qty}`, low: round(a.low), high: round(a.high) });
    total = addCosts(total, a);
  }

  const final = applyFinal(total, stateMult, markup);
  return { breakdown, totalLow: final.low, totalHigh: final.high };
}

function calcRoofInspection(details, stateMult, markup) {
  const { inspectionType = 'standard' } = details;
  const cost = INSPECTION_COSTS[inspectionType] || INSPECTION_COSTS.standard;
  const final = applyFinal(cost, stateMult, markup);
  return {
    breakdown: [{ label: `Roof inspection (${inspectionType.replace(/_/g, ' ')})`, low: cost.low, high: cost.high }],
    totalLow: final.low, totalHigh: final.high,
  };
}

function calcGutterReplacement(details, stateMult, markup) {
  const {
    gutterMaterial = 'aluminum',
    linearFeet = 150,
    downspouts = 4,
    gutterGuards = false,
    gutterGuardLinearFeet,
  } = details;

  const lf         = Number(linearFeet);
  const gutterCost = GUTTER_COSTS_PER_LF[gutterMaterial] || GUTTER_COSTS_PER_LF.aluminum;
  const breakdown  = [];

  let total = applyMult(gutterCost, lf);
  breakdown.push({ label: `${gutterMaterial} gutters — ${lf} lf`, low: round(total.low), high: round(total.high) });

  if (downspouts > 0) {
    const ds = applyMult(DOWNSPOUT_COST, 10 * downspouts);
    breakdown.push({ label: `Downspouts ×${downspouts}`, low: round(ds.low), high: round(ds.high) });
    total = addCosts(total, ds);
  }

  if (gutterGuards) {
    const guardLf = gutterGuardLinearFeet ? Number(gutterGuardLinearFeet) : lf;
    const g = applyMult(GUTTER_GUARD_COST, guardLf);
    breakdown.push({ label: `Gutter guards — ${guardLf} lf`, low: round(g.low), high: round(g.high) });
    total = addCosts(total, g);
  }

  const final = applyFinal(total, stateMult, markup);
  return { breakdown, totalLow: final.low, totalHigh: final.high, linearFeet: lf };
}

function calcFasciaSoffit(details, stateMult, markup) {
  const {
    soffitMaterial = 'vinyl',   soffitSqft = 400,
    fasciaMaterial = 'aluminum', fasciaLinearFeet = 160,
  } = details;

  const soffitCost = SOFFIT_COSTS_PER_SQFT[soffitMaterial] || SOFFIT_COSTS_PER_SQFT.vinyl;
  const fasciaCost = FASCIA_COSTS_PER_LF[fasciaMaterial]   || FASCIA_COSTS_PER_LF.aluminum;
  const breakdown  = [];

  let total = { low: 0, high: 0 };

  if (soffitSqft > 0) {
    const s = applyMult(soffitCost, Number(soffitSqft));
    breakdown.push({ label: `Soffit (${soffitMaterial}, ${soffitSqft} sq ft)`, low: round(s.low), high: round(s.high) });
    total = addCosts(total, s);
  }

  if (fasciaLinearFeet > 0) {
    const f = applyMult(fasciaCost, Number(fasciaLinearFeet));
    breakdown.push({ label: `Fascia (${fasciaMaterial}, ${fasciaLinearFeet} lf)`, low: round(f.low), high: round(f.high) });
    total = addCosts(total, f);
  }

  const final = applyFinal(total, stateMult, markup);
  return { breakdown, totalLow: final.low, totalHigh: final.high };
}

// ─── Main export ──────────────────────────────────────────────────────────────

async function calculateRoofing(input, companyConfig = {}) {
  const { serviceType, state: stateInput, zip, serviceDetails = {} } = input;

  const state      = resolveState(stateInput, zip);
  const stateMult  = STATE_PRICING_MULTIPLIERS[state] || 1.0;
  const stateName  = STATE_NAMES[state] || state;

  const serviceKeyMap = {
    shingle_replacement: 'shingleReplacement',
    metal_roofing:       'metalRoofing',
    flat_roof:           'flatRoof',
    tile_roofing:        'tileRoofing',
    roof_repair:         'roofRepair',
    roof_inspection:     'roofInspection',
    gutter_replacement:  'gutterReplacement',
    fascia_soffit:       'fasciaSoffit',
  };
  const cfgKey       = serviceKeyMap[serviceType];
  const serviceConfig = companyConfig?.services?.[cfgKey] || {};
  const markup       = Number(serviceConfig.markup) || 1.0;

  let result;
  switch (serviceType) {
    case 'shingle_replacement': result = calcShingleReplacement(serviceDetails, stateMult, markup); break;
    case 'metal_roofing':       result = calcMetalRoofing(serviceDetails, stateMult, markup);       break;
    case 'flat_roof':           result = calcFlatRoof(serviceDetails, stateMult, markup);           break;
    case 'tile_roofing':        result = calcTileRoofing(serviceDetails, stateMult, markup);        break;
    case 'roof_repair':         result = calcRoofRepair(serviceDetails, stateMult, markup);         break;
    case 'roof_inspection':     result = calcRoofInspection(serviceDetails, stateMult, markup);     break;
    case 'gutter_replacement':  result = calcGutterReplacement(serviceDetails, stateMult, markup);  break;
    case 'fascia_soffit':       result = calcFasciaSoffit(serviceDetails, stateMult, markup);       break;
    default: throw new Error(`Unknown serviceType: ${serviceType}`);
  }

  return { ...result, serviceType, state, stateName, stateMultiplier: stateMult, markup };
}

module.exports = { calculateRoofing };
