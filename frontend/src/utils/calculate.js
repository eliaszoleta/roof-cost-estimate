// Client-side fallback calculator — mirrors backend logic
// Used when REACT_APP_API_URL is not set (e.g. GitHub Pages demo)

const STATE_MULT = {
  AL:0.88,AK:1.22,AZ:0.97,AR:0.85,CA:1.38,CO:1.08,CT:1.18,DE:1.10,FL:1.02,GA:0.95,
  HI:1.45,ID:0.92,IL:1.12,IN:0.93,IA:0.89,KS:0.88,KY:0.90,LA:0.91,ME:1.00,MD:1.12,
  MA:1.22,MI:1.00,MN:1.05,MS:0.84,MO:0.92,MT:0.94,NE:0.90,NV:1.05,NH:1.08,NJ:1.25,
  NM:0.92,NY:1.32,NC:0.93,ND:0.91,OH:0.96,OK:0.87,OR:1.10,PA:1.05,RI:1.15,SC:0.91,
  SD:0.88,TN:0.92,TX:0.96,UT:0.97,VT:1.02,VA:1.02,WA:1.15,WV:0.90,WI:1.00,WY:0.92,DC:1.35,
};

const STATE_NAMES = {
  AL:'Alabama',AK:'Alaska',AZ:'Arizona',AR:'Arkansas',CA:'California',CO:'Colorado',
  CT:'Connecticut',DE:'Delaware',FL:'Florida',GA:'Georgia',HI:'Hawaii',ID:'Idaho',
  IL:'Illinois',IN:'Indiana',IA:'Iowa',KS:'Kansas',KY:'Kentucky',LA:'Louisiana',
  ME:'Maine',MD:'Maryland',MA:'Massachusetts',MI:'Michigan',MN:'Minnesota',MS:'Mississippi',
  MO:'Missouri',MT:'Montana',NE:'Nebraska',NV:'Nevada',NH:'New Hampshire',NJ:'New Jersey',
  NM:'New Mexico',NY:'New York',NC:'North Carolina',ND:'North Dakota',OH:'Ohio',
  OK:'Oklahoma',OR:'Oregon',PA:'Pennsylvania',RI:'Rhode Island',SC:'South Carolina',
  SD:'South Dakota',TN:'Tennessee',TX:'Texas',UT:'Utah',VT:'Vermont',VA:'Virginia',
  WA:'Washington',WV:'West Virginia',WI:'Wisconsin',WY:'Wyoming',DC:'Washington D.C.',
};

// Pitch factor: footprint → roof surface area
const PITCH_MULT = { flat:1.00, low:1.05, medium:1.20, steep:1.40 };

// Story multiplier — working at height adds labor cost
const STORY_MULT = { 1:1.00, 2:1.12, 3:1.28 };

// Complexity labor multiplier — applied to labor-component of installed price only
const COMPLEXITY_LABOR = { simple:1.00, moderate:1.15, complex:1.32 };
// Complexity waste — extra material for cuts/valleys beyond what $/sqft already includes.
// Kept small because contractor quotes already bake in ~8% standard waste.
const COMPLEXITY_WASTE = { simple:1.00, moderate:1.03, complex:1.08 };

// Shingle grade: installed $/sqft of ROOF AREA (material + install labor, no tearoff/underlay).
// These are BASE rates for a simple 1-story job; complexity & story multipliers apply on top.
// Spread ≤22% — tighter than market since multipliers handle the structural variation.
const SHINGLE_GRADE = {
  standard:      { pLow: 3.75, pHigh: 4.75,  label: '3-Tab shingles' },
  architectural: { pLow: 4.50, pHigh: 5.50,  label: 'Architectural shingles' },
  designer:      { pLow: 7.50, pHigh: 9.25,  label: 'Designer/premium shingles' },
};

// Tear-off cost per sqft — a single merged line item regardless of layer count.
// Spread kept tight (±10%) since tear-off is a standardized labor task.
const TEAROFF_COST = {
  one:     { pLow: 0.72, pHigh: 0.88 },  // single layer
  two:     { pLow: 1.20, pHigh: 1.45 },  // two layers — ~65% more work
  unknown: { pLow: 0.88, pHigh: 1.10 },  // assume between 1–2 layers
};

// Penetration flashing costs (chimneys, skylights, pipe boots)
const PENETRATION_COST = { none:[0,0], low:[375,575], medium:[750,1100], high:[1300,1900] };

// Metal roofing: installed $/sqft. Spread ≤25%.
const METAL_PRICE = {
  corrugated:    { pLow:  6.25, pHigh:  7.75 },
  ribbed:        { pLow:  9.00, pHigh: 11.25 },
  metal_shingle: { pLow: 10.00, pHigh: 12.50 },
  stone_coated:  { pLow:  9.75, pHigh: 12.25 },
  standing_seam: { pLow: 13.50, pHigh: 17.00 },
};

// Tile roofing: installed $/sqft. Spread ≤28%.
const TILE_PRICE = {
  concrete_tile:   { pLow: 10.00, pHigh: 12.50 },
  clay_tile:       { pLow: 13.50, pHigh: 17.00 },
  slate:           { pLow: 19.00, pHigh: 24.00 },
  natural_slate:   { pLow: 19.00, pHigh: 24.00 },
  synthetic_slate: { pLow: 10.00, pHigh: 12.50 },
};

function resolveState(state, zip) {
  if (state && STATE_MULT[state.toUpperCase()]) return state.toUpperCase();
  if (zip) {
    const p = parseInt(String(zip).substring(0, 3), 10);
    if (p<=9) return 'MA'; if (p<=14) return 'NY'; if (p<=19) return 'PA';
    if (p<=20) return 'DC'; if (p<=21) return 'MD'; if (p<=24) return 'VA';
    if (p<=28) return 'NC'; if (p<=29) return 'SC'; if (p<=31) return 'GA';
    if (p<=34) return 'FL'; if (p<=36) return 'AL'; if (p<=38) return 'TN';
    if (p<=39) return 'MS'; if (p<=42) return 'KY'; if (p<=45) return 'OH';
    if (p<=47) return 'IN'; if (p<=49) return 'MI'; if (p<=52) return 'IA';
    if (p<=54) return 'WI'; if (p<=56) return 'MN'; if (p<=62) return 'IL';
    if (p<=65) return 'MO'; if (p<=67) return 'KS'; if (p<=69) return 'NE';
    if (p<=71) return 'LA'; if (p<=72) return 'AR'; if (p<=74) return 'OK';
    if (p<=79) return 'TX'; if (p<=81) return 'CO'; if (p<=84) return 'UT';
    if (p<=86) return 'AZ'; if (p<=88) return 'NM'; if (p<=89) return 'NV';
    if (p<=96) return 'CA'; if (p<=97) return 'OR'; if (p<=99) return 'WA';
  }
  return 'OH';
}

function r(n) { return Math.round(n); }

export function clientCalculate({ serviceType, zip, state: stateIn, serviceDetails = {} }) {
  const state = resolveState(stateIn, zip);
  const sm = STATE_MULT[state] || 1.0;
  const stateName = STATE_NAMES[state] || state;
  const stateMultiplier = sm;

  const pitch        = serviceDetails.pitch    || 'low';
  const stories      = Number(serviceDetails.stories) || 1;
  const complexity   = serviceDetails.complexity     || 'moderate';
  const existingLayers = serviceDetails.existingLayers || 'one';
  const penetrations   = serviceDetails.penetrations   || 'none';

  const pm       = PITCH_MULT[pitch]          || 1.05;
  const stm      = STORY_MULT[stories]        || 1.00;
  const cLaborM  = COMPLEXITY_LABOR[complexity] || 1.15;
  const cWasteM  = COMPLEXITY_WASTE[complexity] || 1.10;
  const [penLow, penHigh] = PENETRATION_COST[penetrations] || [0, 0];
  const tearoffRate = TEAROFF_COST[existingLayers] || TEAROFF_COST.one;

  let totalLow, totalHigh, adjustments = [], keyFactors = [], disclaimer, urgencyLevel = 'normal', unit = 'total';
  let included = [], notIncluded = [];

  if (serviceType === 'shingle_replacement') {
    const sqft      = Number(serviceDetails.houseSqft) || 1750;
    const grade     = serviceDetails.shingleGrade || 'architectural';
    const gradeData = SHINGLE_GRADE[grade] || SHINGLE_GRADE.architectural;
    const addOns    = serviceDetails.addOns || [];

    // User enters total living area (all floors). Divide by stories to get roof footprint,
    // then multiply by pitch factor for slope area, and waste factor for cuts/valleys.
    const footprint = Math.round(sqft / Math.max(stories, 1));
    const roofArea  = r(footprint * pm * cWasteM);
    const laborMult = stm * cLaborM;

    // 1. Shingles (material + labor)
    const shingleLow  = gradeData.pLow  * roofArea * laborMult;
    const shingleHigh = gradeData.pHigh * roofArea * laborMult;

    // 2. Tear-off — single line item regardless of layer count
    const tearoffLabel = existingLayers === 'two'
      ? 'Tear-off & disposal (2 layers)'
      : existingLayers === 'unknown'
      ? 'Tear-off & disposal (est. 1–2 layers)'
      : 'Tear-off & disposal';
    const tearoffLow  = roofArea * tearoffRate.pLow  * stm;
    const tearoffHigh = roofArea * tearoffRate.pHigh * stm;

    // 3. Underlayment, drip edge, flashing, ridge cap (~$0.45–0.55/sqft)
    const underlayLow  = roofArea * 0.45;
    const underlayHigh = roofArea * 0.55;

    // 4. Penetration flashing
    const penCostLow  = penLow;
    const penCostHigh = penHigh;

    // 5. Add-ons
    const addOnItems = [];
    if (addOns.includes('new_decking')) {
      const deckSqft = r(sqft * 0.15);
      addOnItems.push({ label: `New decking (est. ${deckSqft} sq ft)`, low: r(deckSqft * 2.25), high: r(deckSqft * 3.25) });
    }
    if (addOns.includes('ice_water_shield')) {
      addOnItems.push({ label: 'Ice & water shield', low: r(roofArea * 0.18), high: r(roofArea * 0.28) });
    }
    if (addOns.includes('ridge_ventilation')) {
      addOnItems.push({ label: 'Ridge ventilation upgrade', low: 475, high: 875 });
    }
    if (addOns.includes('gutter_replacement')) {
      addOnItems.push({ label: 'Gutter replacement (est. 150 lf)', low: 1200, high: 2200 });
    }
    const addOnTotalLow  = addOnItems.reduce((s, a) => s + a.low,  0);
    const addOnTotalHigh = addOnItems.reduce((s, a) => s + a.high, 0);

    adjustments = [
      { label: `${gradeData.label} — ${roofArea.toLocaleString()} sq ft`, low: r(shingleLow), high: r(shingleHigh) },
      { label: tearoffLabel, low: r(tearoffLow), high: r(tearoffHigh) },
      { label: 'Underlayment, drip edge & flashing', low: r(underlayLow), high: r(underlayHigh) },
    ];
    if (penCostLow > 0) {
      adjustments.push({ label: 'Chimney / skylight / pipe boot flashing', low: penCostLow, high: penCostHigh });
    }
    adjustments.push(...addOnItems);

    const baseLow  = shingleLow  + tearoffLow  + underlayLow  + penCostLow  + addOnTotalLow;
    const baseHigh = shingleHigh + tearoffHigh + underlayHigh + penCostHigh + addOnTotalHigh;
    totalLow  = r(baseLow  * sm);
    totalHigh = r(baseHigh * sm);

    const gradeLabel   = grade === 'standard' ? '3-Tab' : grade === 'architectural' ? 'Architectural' : 'Designer/Premium';
    const complexLabel = complexity === 'simple' ? 'Simple (gable)' : complexity === 'moderate' ? 'Moderate (hip/valley)' : 'Complex (dormers)';
    keyFactors = [
      { label: 'Shingle grade', impact: gradeLabel },
      { label: 'Roof area',     impact: `${roofArea.toLocaleString()} sq ft` },
      { label: 'Complexity',    impact: complexLabel },
      { label: 'Pitch',         impact: pitch },
      { label: 'Stories',       impact: `${stories}` },
    ];
    if (existingLayers !== 'one') keyFactors.push({ label: 'Existing layers', impact: existingLayers === 'two' ? '2 layers' : 'Unknown (est. 1–2)' });
    if (penetrations !== 'none') keyFactors.push({ label: 'Penetrations', impact: penetrations === 'low' ? '1–2' : penetrations === 'medium' ? '3–4' : '5+' });

    included = [
      'Full tear-off & haul-away',
      'Deck inspection for rot/damage',
      'Underlayment, drip edge & step flashing',
      'Ridge cap shingles',
      'Cleanup',
    ];
    notIncluded = [
      'Rotted decking replacement (~$70–$100/sheet extra)',
      'Building permit ($150–$600 depending on city)',
      'Structural repairs (rafters, fascia, etc.)',
    ];

  } else if (serviceType === 'metal_roofing') {
    const sqft      = Number(serviceDetails.houseSqft) || 1750;
    const metalType = serviceDetails.metalType || 'standing_seam';
    const footprint = Math.round(sqft / Math.max(stories, 1));
    const roofArea  = r(footprint * pm * cWasteM);
    const laborMult = stm * cLaborM;
    const metalPrice = METAL_PRICE[metalType] || METAL_PRICE.standing_seam;
    const metalLow   = metalPrice.pLow  * roofArea * laborMult;
    const metalHigh  = metalPrice.pHigh * roofArea * laborMult;

    const tearoffLabel = existingLayers === 'two'
      ? 'Tear-off & disposal (2 layers)'
      : existingLayers === 'unknown'
      ? 'Tear-off & disposal (est. 1–2 layers)'
      : 'Tear-off & disposal';
    const tearoffLow  = r(roofArea * tearoffRate.pLow  * stm);
    const tearoffHigh = r(roofArea * tearoffRate.pHigh * stm);

    adjustments = [
      { label: `${metalType.replace(/_/g,' ')} metal — ${roofArea.toLocaleString()} sq ft`, low: r(metalLow), high: r(metalHigh) },
      { label: tearoffLabel, low: tearoffLow, high: tearoffHigh },
    ];
    if (penLow > 0) adjustments.push({ label: 'Penetration flashing', low: penLow, high: penHigh });

    const baseLow  = metalLow  + tearoffLow  + penLow;
    const baseHigh = metalHigh + tearoffHigh + penHigh;
    totalLow  = r(baseLow  * sm);
    totalHigh = r(baseHigh * sm);

    const complexLabel = complexity === 'simple' ? 'Simple (gable)' : complexity === 'moderate' ? 'Moderate (hip/valley)' : 'Complex (dormers)';
    keyFactors = [
      { label: 'Type',       impact: metalType.replace(/_/g,' ') },
      { label: 'Roof area',  impact: `${roofArea.toLocaleString()} sq ft` },
      { label: 'Complexity', impact: complexLabel },
      { label: 'Pitch',      impact: pitch },
    ];
    included    = ['Tear-off & haul-away', 'Fasteners & trim', 'Ridge cap', 'Cleanup'];
    notIncluded = ['Rotted decking (~$70–$100/sheet)', 'Building permit ($150–$600)', 'Structural repairs'];

  } else if (serviceType === 'tile_roofing') {
    const sqft     = Number(serviceDetails.houseSqft) || 1750;
    const tileType = serviceDetails.tileType || 'concrete_tile';
    const footprint = Math.round(sqft / Math.max(stories, 1));
    const roofArea  = r(footprint * pm * cWasteM);
    const laborMult = stm * cLaborM;
    const tilePrice = TILE_PRICE[tileType] || TILE_PRICE.concrete_tile;
    const matLow    = tilePrice.pLow  * roofArea * laborMult;
    const matHigh   = tilePrice.pHigh * roofArea * laborMult;

    // Tile tear-off is heavier — use a higher rate
    const tileTearoffRate = { pLow: tearoffRate.pLow * 1.2, pHigh: tearoffRate.pHigh * 1.2 };
    const tearoffLabel = existingLayers === 'two' ? 'Tear-off & disposal (2 layers, tile)' : 'Tear-off & disposal (tile)';
    const tearoffLow  = r(roofArea * tileTearoffRate.pLow  * stm);
    const tearoffHigh = r(roofArea * tileTearoffRate.pHigh * stm);

    adjustments = [
      { label: `${tileType.replace(/_/g,' ')} — ${roofArea.toLocaleString()} sq ft`, low: r(matLow), high: r(matHigh) },
      { label: tearoffLabel, low: tearoffLow, high: tearoffHigh },
    ];
    if (penLow > 0) adjustments.push({ label: 'Penetration flashing', low: penLow, high: penHigh });

    const baseLow  = matLow  + tearoffLow  + penLow;
    const baseHigh = matHigh + tearoffHigh + penHigh;
    totalLow  = r(baseLow  * sm);
    totalHigh = r(baseHigh * sm);

    keyFactors = [
      { label: 'Material',   impact: tileType.replace(/_/g,' ') },
      { label: 'Roof area',  impact: `${roofArea.toLocaleString()} sq ft` },
      { label: 'Complexity', impact: complexity },
    ];
    included    = ['Tear-off & haul-away', 'Underlayment & flashing', 'Ridge tile', 'Cleanup'];
    notIncluded = ['Rafter/structural reinforcement for tile weight', 'Building permit', 'Rotted decking'];

  } else if (serviceType === 'flat_roof') {
    const area         = Number(serviceDetails.buildingFootprint) || 1500;
    const mat          = serviceDetails.flatMaterial || 'tpo';
    const complexity_  = serviceDetails.complexity || 'simple';
    const cM           = COMPLEXITY_LABOR[complexity_] || 1.00;
    const FLAT_PRICE   = { tpo:[6.25,7.75], epdm:[5.25,6.75], modified_bitumen:[4.75,6.25], built_up:[4.75,6.50], pvc:[6.75,8.50] };
    const [pLow, pHigh] = FLAT_PRICE[mat] || FLAT_PRICE.tpo;
    const matLow  = pLow  * area * cM;
    const matHigh = pHigh * area * cM;
    const tearoffLow  = r(area * 0.50);
    const tearoffHigh = r(area * 0.65);

    adjustments = [
      { label: `Flat roof — ${mat.toUpperCase()} membrane (${area.toLocaleString()} sq ft)`, low: r(matLow), high: r(matHigh) },
      { label: 'Tear-off & disposal', low: tearoffLow, high: tearoffHigh },
      ...(penLow > 0 ? [{ label: 'Penetration flashing & boots', low: penLow, high: penHigh }] : []),
    ];
    totalLow  = r((matLow  + tearoffLow  + penLow)  * sm);
    totalHigh = r((matHigh + tearoffHigh + penHigh) * sm);
    keyFactors = [{ label: 'System', impact: mat.toUpperCase() }, { label: 'Area', impact: `${area.toLocaleString()} sq ft` }];
    included    = ['Membrane installation', 'Tear-off', 'Seams & edge details', 'Drain inspection'];
    notIncluded = ['Insulation board (if needed)', 'Building permit', 'Structural deck repairs'];

  } else if (serviceType === 'roof_repair') {
    const size  = serviceDetails.repairSize || 'small';
    const costs = { minor:[175,300], small:[400,625], medium:[825,1350], large:[1700,2800], emergency:[900,2100] };
    const [cl, ch] = costs[size] || costs.small;
    adjustments = [{ label: `Roof repair — ${size}`, low: cl, high: ch }];
    totalLow  = r(cl * sm);
    totalHigh = r(ch * sm);
    if (size === 'large' || size === 'emergency') {
      urgencyLevel = 'high';
      disclaimer = 'Large repairs may signal the roof is near end-of-life. Consider getting a full inspection before committing to repairs — replacement may be the better long-term value.';
    }
    keyFactors  = [{ label: 'Damage size', impact: size }];
    included    = ['Labor & patching materials', 'Seal & waterproofing', 'Debris cleanup'];
    notIncluded = ['Decking replacement if rot is found', 'Structural repairs', 'Interior water damage repairs'];

  } else if (serviceType === 'roof_inspection') {
    const type  = serviceDetails.inspectionType || 'standard';
    const costs = { standard:[150,250], drone:[200,325], post_storm:[200,325], thermal:[375,550] };
    const [cl, ch] = costs[type] || costs.standard;
    adjustments = [{ label: `Roof inspection — ${type.replace(/_/g,' ')}`, low: cl, high: ch }];
    totalLow  = r(cl * sm);
    totalHigh = r(ch * sm);
    keyFactors  = [{ label: 'Inspection type', impact: type.replace(/_/g,' ') }];
    included    = ['Visual inspection', 'Written report', 'Photo documentation'];
    notIncluded = ['Repairs', 'Infrared/thermal scan (unless thermal type selected)'];

  } else if (serviceType === 'gutter_replacement') {
    const lf  = Number(serviceDetails.linearFeet) || 150;
    const mat = serviceDetails.gutterMaterial || 'aluminum';
    const GUTTER_PRICE = { vinyl:[3.50,4.50], aluminum:[6.50,8.50], steel:[9.00,12.00], copper:[24.00,34.00] };
    const [pLow, pHigh] = GUTTER_PRICE[mat] || GUTTER_PRICE.aluminum;
    const gutterLow  = pLow  * lf;
    const gutterHigh = pHigh * lf;
    adjustments = [{ label: `${mat} gutters (${lf} lf)`, low: r(gutterLow), high: r(gutterHigh) }];
    let extraLow = 0, extraHigh = 0;
    if (serviceDetails.downspouts > 0) {
      const dl = serviceDetails.downspouts * 90, dh = serviceDetails.downspouts * 150;
      adjustments.push({ label: `Downspouts ×${serviceDetails.downspouts}`, low: dl, high: dh });
      extraLow += dl; extraHigh += dh;
    }
    if (serviceDetails.gutterGuards) {
      const gl = r(lf * 3.25), gh = r(lf * 7.50);
      adjustments.push({ label: `Gutter guards (${lf} lf)`, low: gl, high: gh });
      extraLow += gl; extraHigh += gh;
    }
    totalLow  = r((gutterLow  + extraLow)  * sm);
    totalHigh = r((gutterHigh + extraHigh) * sm);
    keyFactors  = [{ label: 'Material', impact: mat }, { label: 'Length', impact: `${lf} lf` }];
    included    = ['Remove old gutters', 'Install new gutters & downspouts', 'Secure to fascia', 'Test drainage'];
    notIncluded = ['Fascia board repair/replacement', 'Soffit repair', 'Underground drainage'];

  } else {
    throw new Error(`Unknown serviceType: ${serviceType}`);
  }

  return {
    success: true,
    data: {
      totalLow, totalHigh, adjustments, keyFactors,
      serviceType, stateName, stateMultiplier, unit,
      urgencyLevel, disclaimer: disclaimer || null,
      included, notIncluded,
    },
  };
}
