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

const PITCH_MULT = { flat:1.00, low:1.05, medium:1.20, steep:1.40 };
const STORY_MULT = { 1:1.00, 2:1.12, 3:1.25 };

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

  const pitch = serviceDetails.pitch || 'low';
  const stories = Number(serviceDetails.stories) || 1;
  const pm = PITCH_MULT[pitch] || 1.05;
  const stm = STORY_MULT[stories] || 1.0;

  let totalLow, totalHigh, adjustments = [], keyFactors = [], disclaimer, urgencyLevel = 'normal', unit = 'total';

  if (serviceType === 'shingle_replacement') {
    const sqft = Number(serviceDetails.houseSqft) || 1750;
    const roofArea = Math.round(sqft * pm);
    const baseLow = 4.0 * roofArea * stm;
    const baseHigh = 6.0 * roofArea * stm;
    adjustments = [
      { label: `Shingle installation (${roofArea.toLocaleString()} sq ft)`, low: r(baseLow), high: r(baseHigh) },
      { label: 'Tear-off & disposal', low: r(roofArea * 0.5), high: r(roofArea * 1.0) },
      { label: 'Underlayment & flashing', low: r(roofArea * 0.3), high: r(roofArea * 0.6) },
    ];
    totalLow = r((baseLow + roofArea*0.5 + roofArea*0.3) * sm);
    totalHigh = r((baseHigh + roofArea*1.0 + roofArea*0.6) * sm);
    keyFactors = [
      { label: 'Roof area', impact: `${roofArea.toLocaleString()} sq ft` },
      { label: 'Pitch', impact: pitch },
      { label: 'Stories', impact: `${stories}` },
    ];
  } else if (serviceType === 'metal_roofing') {
    const sqft = Number(serviceDetails.houseSqft) || 1750;
    const roofArea = Math.round(sqft * pm);
    const metalType = serviceDetails.metalType || 'standing_seam';
    const [pLow, pHigh] = metalType === 'standing_seam' ? [10,16] : metalType === 'corrugated' ? [5,9] : [7,12];
    adjustments = [
      { label: `Metal roofing — ${metalType.replace(/_/g,' ')} (${roofArea.toLocaleString()} sq ft)`, low: r(pLow*roofArea*stm), high: r(pHigh*roofArea*stm) },
      { label: 'Tear-off & disposal', low: r(roofArea*0.5), high: r(roofArea*1.0) },
    ];
    totalLow = r((pLow*roofArea*stm + roofArea*0.5) * sm);
    totalHigh = r((pHigh*roofArea*stm + roofArea*1.0) * sm);
    keyFactors = [{ label: 'Type', impact: metalType.replace(/_/g,' ') }, { label: 'Area', impact: `${roofArea.toLocaleString()} sq ft` }];
  } else if (serviceType === 'tile_roofing') {
    const sqft = Number(serviceDetails.houseSqft) || 1750;
    const roofArea = Math.round(sqft * pm);
    const tileType = serviceDetails.tileType || 'concrete_tile';
    const [pLow, pHigh] = tileType === 'slate' ? [15,25] : tileType === 'clay_tile' ? [12,20] : [9,15];
    adjustments = [
      { label: `Tile roofing — ${tileType.replace(/_/g,' ')} (${roofArea.toLocaleString()} sq ft)`, low: r(pLow*roofArea*stm), high: r(pHigh*roofArea*stm) },
      { label: 'Tear-off & disposal', low: r(roofArea*0.7), high: r(roofArea*1.2) },
    ];
    totalLow = r((pLow*roofArea*stm + roofArea*0.7) * sm);
    totalHigh = r((pHigh*roofArea*stm + roofArea*1.2) * sm);
    keyFactors = [{ label: 'Material', impact: tileType.replace(/_/g,' ') }];
  } else if (serviceType === 'flat_roof') {
    const area = Number(serviceDetails.buildingFootprint) || 1500;
    const mat = serviceDetails.flatMaterial || 'tpo';
    const [pLow, pHigh] = mat === 'epdm' ? [4,7] : mat === 'modified_bitumen' ? [5,8] : [5,8];
    adjustments = [
      { label: `Flat roof — ${mat.toUpperCase()} (${area.toLocaleString()} sq ft)`, low: r(pLow*area), high: r(pHigh*area) },
      { label: 'Tear-off', low: r(area*0.4), high: r(area*0.8) },
    ];
    totalLow = r((pLow*area + area*0.4) * sm);
    totalHigh = r((pHigh*area + area*0.8) * sm);
    keyFactors = [{ label: 'System', impact: mat.toUpperCase() }, { label: 'Area', impact: `${area.toLocaleString()} sq ft` }];
  } else if (serviceType === 'roof_repair') {
    const size = serviceDetails.repairSize || 'small';
    const costs = { minor:[150,350], small:[300,700], medium:[600,1500], large:[1200,3000], emergency:[800,2500] };
    const [cl, ch] = costs[size] || costs.small;
    adjustments = [{ label: `Roof repair — ${size}`, low: cl, high: ch }];
    totalLow = r(cl * sm);
    totalHigh = r(ch * sm);
    if (size === 'large' || size === 'emergency') {
      urgencyLevel = 'high';
      disclaimer = 'Large repairs may indicate the roof is nearing end of life. Get a full inspection before committing to repairs vs. replacement.';
    }
    keyFactors = [{ label: 'Damage size', impact: size }];
  } else if (serviceType === 'roof_inspection') {
    const type = serviceDetails.inspectionType || 'standard';
    const costs = { standard:[100,300], drone:[150,400], post_storm:[175,350], thermal:[300,600] };
    const [cl, ch] = costs[type] || costs.standard;
    adjustments = [{ label: `Roof inspection — ${type.replace(/_/g,' ')}`, low: cl, high: ch }];
    totalLow = r(cl * sm);
    totalHigh = r(ch * sm);
    keyFactors = [{ label: 'Type', impact: type.replace(/_/g,' ') }];
  } else if (serviceType === 'gutter_replacement') {
    const lf = Number(serviceDetails.linearFeet) || 150;
    const mat = serviceDetails.gutterMaterial || 'aluminum';
    const costs = { vinyl:[3,6], aluminum:[6,12], steel:[8,14], copper:[20,40] };
    const [pLow, pHigh] = costs[mat] || costs.aluminum;
    const gutterLow = pLow * lf;
    const gutterHigh = pHigh * lf;
    adjustments = [{ label: `Gutters — ${mat} (${lf} lf)`, low: r(gutterLow), high: r(gutterHigh) }];
    let extraLow = 0, extraHigh = 0;
    if (serviceDetails.downspouts > 0) {
      const ds = serviceDetails.downspouts * 75;
      const dsh = serviceDetails.downspouts * 150;
      adjustments.push({ label: `Downspouts ×${serviceDetails.downspouts}`, low: ds, high: dsh });
      extraLow += ds; extraHigh += dsh;
    }
    if (serviceDetails.gutterGuards) {
      const gl = lf * 3, gh = lf * 8;
      adjustments.push({ label: `Gutter guards (${lf} lf)`, low: gl, high: gh });
      extraLow += gl; extraHigh += gh;
    }
    totalLow = r((gutterLow + extraLow) * sm);
    totalHigh = r((gutterHigh + extraHigh) * sm);
    keyFactors = [{ label: 'Material', impact: mat }, { label: 'Length', impact: `${lf} lf` }];
  } else {
    throw new Error(`Unknown serviceType: ${serviceType}`);
  }

  return {
    success: true,
    data: {
      totalLow, totalHigh, adjustments, keyFactors,
      serviceType, stateName, stateMultiplier, unit,
      urgencyLevel, disclaimer: disclaimer || null,
    },
  };
}
