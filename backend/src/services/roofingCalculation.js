// RoofCalc — Core roofing cost calculation engine
// All pricing data lives in config/defaults.js

const {
  STATE_PRICING_MULTIPLIERS,
  STATE_NAMES,
  PITCH_MULTIPLIERS,
  STORY_MULTIPLIERS,
  TEAROFF_COSTS,
  DECKING_COSTS,
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

// ─── Helpers ─────────────────────────────────────────────────────────────────────

/** Apply a multiplier pair to a low/high cost object */
function applyMult(cost, multLow, multHigh) {
  return { low: cost.low * multLow, high: cost.high * multHigh };
}

/** Apply state multiplier to both low and high */
function applyState(cost, stateMult) {
  return applyMult(cost, stateMult, stateMult);
}

/** Add two cost objects */
function addCosts(a, b) {
  return { low: a.low + b.low, high: a.high + b.high };
}

/** Resolve state abbreviation from input */
function resolveState(state, zip) {
  if (state && STATE_PRICING_MULTIPLIERS[state.toUpperCase()]) {
    return state.toUpperCase();
  }
  // ZIP-to-state prefix lookup (basic)
  if (zip) {
    const prefix = parseInt(String(zip).substring(0, 3), 10);
    const zipMap = [
      [[0, 2], 'MA'], [[3, 6], 'MA'], // rough groupings
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
 * Roof area = footprint × pitch multiplier (called "roof factor").
 * A 4:12 pitch adds ~7.5% area; 6:12 ~20%; 9:12 ~50% etc.
 */
function estimateRoofArea(houseSqft, pitch) {
  const pitchFactors = {
    flat: 1.00, low: 1.05, medium: 1.20, steep: 1.40, very_steep: 1.60,
  };
  return Math.round(houseSqft * (pitchFactors[pitch] || 1.10));
}

/** Round to nearest dollar */
function round(n) { return Math.round(n); }

// ─── Per-service calculators ────────────────────────────────────────────────────────────

/**
 * SHINGLE REPLACEMENT
 * Inputs: roofArea (sq ft, or houseSqft to estimate from),
 *   shingleType (three_tab|architectural|premium|designer),
 *   tearoffLayers (none|single_layer|double_layer|triple_plus),
 *   deckingReplacement (none|partial|full),
 *   underlayment (standard_felt|synthetic|ice_water_shield),
 *   pitch (flat|low|medium|steep|very_steep),
 *   stories (1|2|3+),
 *   addons: array of { type, quantity }
 */
function calcShingleReplacement(details, stateMult, markup) {
  const {
    roofArea,
    houseSqft,
    shingleType = 'architectural',
    tearoffLayers = 'single_layer',
    deckingReplacement = 'none',
    underlayment = 'standard_felt',
    pitch = 'low',
    stories = 1,
    addons = [],
  } = details;

  // Determine roof area
  const area = roofArea
    ? Number(roofArea)
    : houseSqft
      ? estimateRoofArea(Number(houseSqft), pitch)
      : 1800; // national avg residential default

  const pitchMult = PITCH_MULTIPLIERS[pitch] || PITCH_MULTIPLIERS.low;
  const storyMult = STORY_MULTIPLIERS[stories] || STORY_MULTIPLIERS[1];
  const shingleCost = SHINGLE_COSTS_PER_SQFT[shingleType] || SHINGLE_COSTS_PER_SQFT.architectural;

  const breakdown = [];

  // Base shingle + labor
  let baseLow = shingleCost.low * area * pitchMult.low * storyMult.low;
  let baseHigh = shingleCost.high * area * pitchMult.high * storyMult.high;
  breakdown.push({ label: `Shingle installation (${shingleType.replace(/_/g, ' ')}, ${area.toLocaleString()} sq ft)`, low: round(baseLow), high: round(baseHigh) });

  // Tear-off
  const tearoff = TEAROFF_COSTS[tearoffLayers] || TEAROFF_COSTS.none;
  if (tearoff.low > 0) {
    const tLow = tearoff.low * area;
    const tHigh = tearoff.high * area;
    breakdown.push({ label: `Tear-off (${tearoffLayers.replace(/_/g, ' ')})`, low: round(tLow), high: round(tHigh) });
    baseLow += tLow;
    baseHigh += tHigh;
  }

  // Decking replacement
  const decking = DECKING_COSTS[deckingReplacement] || DECKING_COSTS.none;
  if (decking.low > 0) {
    // Partial = ~20% of area affected; full = full area
    const deckArea = deckingReplacement === 'partial' ? area * 0.20 : area;
    const dLow = decking.low * deckArea;
    const dHigh = decking.high * deckArea;
    breakdown.push({ label: `Decking replacement (${deckingReplacement})`, low: round(dLow), high: round(dHigh) });
    baseLow += dLow;
    baseHigh += dHigh;
  }

  // Underlayment upgrade
  const undUpgrade = UNDERLAYMENT_ADDONS[underlayment] || UNDERLAYMENT_ADDONS.standard_felt;
  if (undUpgrade.low > 0) {
    const uLow = undUpgrade.low * area;
    const uHigh = undUpgrade.high * area;
    breakdown.push({ label: `Underlayment upgrade (${underlayment.replace(/_/g, ' ')})`, low: round(uLow), high: round(uHigh) });
    baseLow += uLow;
    baseHigh += uHigh;
  }

  // Addons
  let addonLow = 0, addonHigh = 0;
  for (const addon of addons) {
    const cost = ADDON_COSTS[addon.type];
    if (!cost) continue;
    const qty = Number(addon.quantity) || 1;
    addonLow += cost.low * qty;
    addonHigh += cost.high * qty;
    breakdown.push({ label: `${addon.type.replace(/_/g, ' ')} ×${qty}`, low: round(cost.low * qty), high: round(cost.high * qty) });
  }

  let totalLow = (baseLow + addonLow) * stateMult * markup;
  let totalHigh = (baseHigh + addonHigh) * stateMult * markup;

  return { breakdown, totalLow: round(totalLow), totalHigh: round(totalHigh), roofArea: area };
}

/**
 * METAL ROOFING
 * Inputs: roofArea / houseSqft, metalType, tearoffLayers, pitch, stories, addons
 */
function calcMetalRoofing(details, stateMult, markup) {
  const {
    roofArea, houseSqft,
    metalType = 'standing_seam',
    tearoffLayers = 'single_layer',
    pitch = 'low',
    stories = 1,
    addons = [],
  } = details;

  const area = roofArea ? Number(roofArea) : houseSqft ? estimateRoofArea(Number(houseSqft), pitch) : 1800;
  const pitchMult = PITCH_MULTIPLIERS[pitch] || PITCH_MULTIPLIERS.low;
  const storyMult = STORY_MULTIPLIERS[stories] || STORY_MULTIPLIERS[1];
  const metalCost = METAL_COSTS_PER_SQFT[metalType] || METAL_COSTS_PER_SQFT.standing_seam;

  const breakdown = [];

  let baseLow = metalCost.low * area * pitchMult.low * storyMult.low;
  let baseHigh = metalCost.high * area * pitchMult.high * storyMult.high;
  breakdown.push({ label: `Metal roofing (${metalType.replace(/_/g, ' ')}, ${area.toLocaleString()} sq ft)`, low: round(baseLow), high: round(baseHigh) });

  // Tear-off
  const tearoff = TEAROFF_COSTS[tearoffLayers] || TEAROFF_COSTS.none;
  if (tearoff.low > 0) {
    const tLow = tearoff.low * area;
    const tHigh = tearoff.high * area;
    breakdown.push({ label: `Tear-off (${tearoffLayers.replace(/_/g, ' ')})`, low: round(tLow), high: round(tHigh) });
    baseLow += tLow;
    baseHigh += tHigh;
  }

  let addonLow = 0, addonHigh = 0;
  for (const addon of addons) {
    const cost = ADDON_COSTS[addon.type];
    if (!cost) continue;
    const qty = Number(addon.quantity) || 1;
    addonLow += cost.low * qty;
    addonHigh += cost.high * qty;
    breakdown.push({ label: `${addon.type.replace(/_/g, ' ')} ×${qty}`, low: round(cost.low * qty), high: round(cost.high * qty) });
  }

  return {
    breakdown,
    totalLow: round((baseLow + addonLow) * stateMult * markup),
    totalHigh: round((baseHigh + addonHigh) * stateMult * markup),
    roofArea: area,
  };
}

/**
 * FLAT ROOF
 * Inputs: roofArea / buildingFootprint, flatMaterial, tearoffLayers, addons
 */
function calcFlatRoof(details, stateMult, markup) {
  const {
    roofArea, buildingFootprint,
    flatMaterial = 'tpo',
    tearoffLayers = 'single_layer',
    addons = [],
  } = details;

  // Flat roofs: area ≈ building footprint (pitch factor ≈ 1)
  const area = roofArea ? Number(roofArea) : buildingFootprint ? Number(buildingFootprint) : 1500;
  const flatCost = FLAT_ROOF_COSTS_PER_SQFT[flatMaterial] || FLAT_ROOF_COSTS_PER_SQFT.tpo;

  const breakdown = [];

  let baseLow = flatCost.low * area;
  let baseHigh = flatCost.high * area;
  breakdown.push({ label: `Flat roof (${flatMaterial.toUpperCase()}, ${area.toLocaleString()} sq ft)`, low: round(baseLow), high: round(baseHigh) });

  const tearoff = TEAROFF_COSTS[tearoffLayers] || TEAROFF_COSTS.none;
  if (tearoff.low > 0) {
    const tLow = tearoff.low * area;
    const tHigh = tearoff.high * area;
    breakdown.push({ label: `Tear-off (${tearoffLayers.replace(/_/g, ' ')})`, low: round(tLow), high: round(tHigh) });
    baseLow += tLow;
    baseHigh += tHigh;
  }

  let addonLow = 0, addonHigh = 0;
  for (const addon of addons) {
    const cost = ADDON_COSTS[addon.type];
    if (!cost) continue;
    const qty = Number(addon.quantity) || 1;
    addonLow += cost.low * qty;
    addonHigh += cost.high * qty;
    breakdown.push({ label: `${addon.type.replace(/_/g, ' ')} ×${qty}`, low: round(cost.low * qty), high: round(cost.high * qty) });
  }

  return {
    breakdown,
    totalLow: round((baseLow + addonLow) * stateMult * markup),
    totalHigh: round((baseHigh + addonHigh) * stateMult * markup),
    roofArea: area,
  };
}

/**
 * TILE ROOFING
 * Inputs: roofArea / houseSqft, tileType, tearoffLayers, pitch, stories, addons
 */
function calcTileRoofing(details, stateMult, markup) {
  const {
    roofArea, houseSqft,
    tileType = 'concrete_tile',
    tearoffLayers = 'single_layer',
    pitch = 'medium',
    stories = 1,
    addons = [],
  } = details;

  const area = roofArea ? Number(roofArea) : houseSqft ? estimateRoofArea(Number(houseSqft), pitch) : 1800;
  const pitchMult = PITCH_MULTIPLIERS[pitch] || PITCH_MULTIPLIERS.medium;
  const storyMult = STORY_MULTIPLIERS[stories] || STORY_MULTIPLIERS[1];
  const tileCost = TILE_COSTS_PER_SQFT[tileType] || TILE_COSTS_PER_SQFT.concrete_tile;

  const breakdown = [];

  let baseLow = tileCost.low * area * pitchMult.low * storyMult.low;
  let baseHigh = tileCost.high * area * pitchMult.high * storyMult.high;
  breakdown.push({ label: `Tile roofing (${tileType.replace(/_/g, ' ')}, ${area.toLocaleString()} sq ft)`, low: round(baseLow), high: round(baseHigh) });

  const tearoff = TEAROFF_COSTS[tearoffLayers] || TEAROFF_COSTS.none;
  if (tearoff.low > 0) {
    const tLow = tearoff.low * area;
    const tHigh = tearoff.high * area;
    breakdown.push({ label: `Tear-off (${tearoffLayers.replace(/_/g, ' ')})`, low: round(tLow), high: round(tHigh) });
    baseLow += tLow;
    baseHigh += tHigh;
  }

  let addonLow = 0, addonHigh = 0;
  for (const addon of addons) {
    const cost = ADDON_COSTS[addon.type];
    if (!cost) continue;
    const qty = Number(addon.quantity) || 1;
    addonLow += cost.low * qty;
    addonHigh += cost.high * qty;
    breakdown.push({ label: `${addon.type.replace(/_/g, ' ')} ×${qty}`, low: round(cost.low * qty), high: round(cost.high * qty) });
  }

  return {
    breakdown,
    totalLow: round((baseLow + addonLow) * stateMult * markup),
    totalHigh: round((baseHigh + addonHigh) * stateMult * markup),
    roofArea: area,
  };
}

/**
 * ROOF REPAIR
 * Inputs: repairSize (minor|small|medium|large|emergency), addons
 */
function calcRoofRepair(details, stateMult, markup) {
  const { repairSize = 'small', addons = [] } = details;
  const repairCost = REPAIR_COSTS[repairSize] || REPAIR_COSTS.small;

  const breakdown = [
    { label: `Roof repair (${repairSize})`, low: repairCost.low, high: repairCost.high },
  ];

  let addonLow = 0, addonHigh = 0;
  for (const addon of addons) {
    const cost = ADDON_COSTS[addon.type];
    if (!cost) continue;
    const qty = Number(addon.quantity) || 1;
    addonLow += cost.low * qty;
    addonHigh += cost.high * qty;
    breakdown.push({ label: `${addon.type.replace(/_/g, ' ')} ×${qty}`, low: round(cost.low * qty), high: round(cost.high * qty) });
  }

  return {
    breakdown,
    totalLow: round((repairCost.low + addonLow) * stateMult * markup),
    totalHigh: round((repairCost.high + addonHigh) * stateMult * markup),
  };
}

/**
 * ROOF INSPECTION
 * Inputs: inspectionType (standard|drone|post_storm|thermal)
 */
function calcRoofInspection(details, stateMult, markup) {
  const { inspectionType = 'standard' } = details;
  const cost = INSPECTION_COSTS[inspectionType] || INSPECTION_COSTS.standard;

  return {
    breakdown: [{ label: `Roof inspection (${inspectionType.replace(/_/g, ' ')})`, low: cost.low, high: cost.high }],
    totalLow: round(cost.low * stateMult * markup),
    totalHigh: round(cost.high * stateMult * markup),
  };
}

/**
 * GUTTER REPLACEMENT
 * Inputs: gutterMaterial (vinyl|aluminum|steel|copper),
 *   linearFeet (number), downspouts (count),
 *   gutterGuards (bool), gutterGuardLinearFeet (number)
 */
function calcGutterReplacement(details, stateMult, markup) {
  const {
    gutterMaterial = 'aluminum',
    linearFeet = 150,
    downspouts = 4,
    gutterGuards = false,
    gutterGuardLinearFeet,
  } = details;

  const lf = Number(linearFeet);
  const gutterCost = GUTTER_COSTS_PER_LF[gutterMaterial] || GUTTER_COSTS_PER_LF.aluminum;
  const breakdown = [];

  let baseLow = gutterCost.low * lf;
  let baseHigh = gutterCost.high * lf;
  breakdown.push({ label: `Gutters (${gutterMaterial}, ${lf} lf)`, low: round(baseLow), high: round(baseHigh) });

  // Downspouts
  if (downspouts > 0) {
    // Average downspout is 10 linear feet
    const dsLow = DOWNSPOUT_COST.low * 10 * downspouts;
    const dsHigh = DOWNSPOUT_COST.high * 10 * downspouts;
    breakdown.push({ label: `Downspouts ×${downspouts}`, low: round(dsLow), high: round(dsHigh) });
    baseLow += dsLow;
    baseHigh += dsHigh;
  }

  // Gutter guards
  if (gutterGuards) {
    const guardLf = gutterGuardLinearFeet ? Number(gutterGuardLinearFeet) : lf;
    const gLow = GUTTER_GUARD_COST.low * guardLf;
    const gHigh = GUTTER_GUARD_COST.high * guardLf;
    breakdown.push({ label: `Gutter guards (${guardLf} lf)`, low: round(gLow), high: round(gHigh) });
    baseLow += gLow;
    baseHigh += gHigh;
  }

  return {
    breakdown,
    totalLow: round(baseLow * stateMult * markup),
    totalHigh: round(baseHigh * stateMult * markup),
    linearFeet: lf,
  };
}

/**
 * FASCIA & SOFFIT
 * Inputs: soffitMaterial (vinyl|aluminum|wood|fiber_cement), soffitSqft,
 *   fasciaMaterial (vinyl|aluminum|wood|fiber_cement), fasciaLinearFeet
 */
function calcFasciaSoffit(details, stateMult, markup) {
  const {
    soffitMaterial = 'vinyl',
    soffitSqft = 400,
    fasciaMaterial = 'aluminum',
    fasciaLinearFeet = 160,
  } = details;

  const soffitCost = SOFFIT_COSTS_PER_SQFT[soffitMaterial] || SOFFIT_COSTS_PER_SQFT.vinyl;
  const fasciaCost = FASCIA_COSTS_PER_LF[fasciaMaterial] || FASCIA_COSTS_PER_LF.aluminum;
  const breakdown = [];

  let baseLow = 0;
  let baseHigh = 0;

  if (soffitSqft > 0) {
    const sLow = soffitCost.low * Number(soffitSqft);
    const sHigh = soffitCost.high * Number(soffitSqft);
    breakdown.push({ label: `Soffit (${soffitMaterial}, ${soffitSqft} sq ft)`, low: round(sLow), high: round(sHigh) });
    baseLow += sLow;
    baseHigh += sHigh;
  }

  if (fasciaLinearFeet > 0) {
    const fLow = fasciaCost.low * Number(fasciaLinearFeet);
    const fHigh = fasciaCost.high * Number(fasciaLinearFeet);
    breakdown.push({ label: `Fascia (${fasciaMaterial}, ${fasciaLinearFeet} lf)`, low: round(fLow), high: round(fHigh) });
    baseLow += fLow;
    baseHigh += fHigh;
  }

  return {
    breakdown,
    totalLow: round(baseLow * stateMult * markup),
    totalHigh: round(baseHigh * stateMult * markup),
  };
}

// ─── Main export ─────────────────────────────────────────────────────────────────────

/**
 * calculateRoofing(input, companyConfig)
 *
 * @param {object} input
 *   serviceType, state, zip, serviceDetails
 * @param {object} companyConfig
 *   company-level overrides (markup, etc.)
 * @returns {object} result with totalLow, totalHigh, breakdown, state, etc.
 */
async function calculateRoofing(input, companyConfig = {}) {
  const { serviceType, state: stateInput, zip, serviceDetails = {} } = input;

  const state = resolveState(stateInput, zip);
  const stateMult = STATE_PRICING_MULTIPLIERS[state] || 1.0;
  const stateName = STATE_NAMES[state] || state;

  // Get per-service markup from company config
  const serviceKeyMap = {
    shingle_replacement: 'shingleReplacement',
    metal_roofing: 'metalRoofing',
    flat_roof: 'flatRoof',
    tile_roofing: 'tileRoofing',
    roof_repair: 'roofRepair',
    roof_inspection: 'roofInspection',
    gutter_replacement: 'gutterReplacement',
    fascia_soffit: 'fasciaSoffit',
  };
  const cfgKey = serviceKeyMap[serviceType];
  const serviceConfig = companyConfig?.services?.[cfgKey] || {};
  const markup = Number(serviceConfig.markup) || 1.0;

  let result;
  switch (serviceType) {
    case 'shingle_replacement':
      result = calcShingleReplacement(serviceDetails, stateMult, markup);
      break;
    case 'metal_roofing':
      result = calcMetalRoofing(serviceDetails, stateMult, markup);
      break;
    case 'flat_roof':
      result = calcFlatRoof(serviceDetails, stateMult, markup);
      break;
    case 'tile_roofing':
      result = calcTileRoofing(serviceDetails, stateMult, markup);
      break;
    case 'roof_repair':
      result = calcRoofRepair(serviceDetails, stateMult, markup);
      break;
    case 'roof_inspection':
      result = calcRoofInspection(serviceDetails, stateMult, markup);
      break;
    case 'gutter_replacement':
      result = calcGutterReplacement(serviceDetails, stateMult, markup);
      break;
    case 'fascia_soffit':
      result = calcFasciaSoffit(serviceDetails, stateMult, markup);
      break;
    default:
      throw new Error(`Unknown serviceType: ${serviceType}`);
  }

  return {
    ...result,
    serviceType,
    state,
    stateName,
    stateMultiplier: stateMult,
    markup,
  };
}

module.exports = { calculateRoofing };
