// ─── State roofing cost data ────────────────────────────────────────────────
// Mirrors backend/src/config/defaults.js (STATE_PRICING_MULTIPLIERS,
// STATE_NAMES, STATE_AVERAGE_ROOF_COST_PER_SQFT) so state pages and the
// homepage state table stay consistent with what the calculator itself
// quotes. Update both files together if pricing data changes.

const TYPICAL_ROOF_SQFT = 1800; // average U.S. single-family home roof area
const RANGE_SPREAD = 0.15;      // +/- range shown around a state's average $/sq ft

const STATES = [
  { code: 'AL', name: 'Alabama', slug: 'alabama', multiplier: 0.85, costPerSqft: 4.20 },
  { code: 'AK', name: 'Alaska', slug: 'alaska', multiplier: 1.42, costPerSqft: 7.10 },
  { code: 'AZ', name: 'Arizona', slug: 'arizona', multiplier: 1.05, costPerSqft: 5.30 },
  { code: 'AR', name: 'Arkansas', slug: 'arkansas', multiplier: 0.82, costPerSqft: 4.10 },
  { code: 'CA', name: 'California', slug: 'california', multiplier: 1.48, costPerSqft: 7.40 },
  { code: 'CO', name: 'Colorado', slug: 'colorado', multiplier: 1.20, costPerSqft: 6.00 },
  { code: 'CT', name: 'Connecticut', slug: 'connecticut', multiplier: 1.30, costPerSqft: 6.50 },
  { code: 'DE', name: 'Delaware', slug: 'delaware', multiplier: 1.12, costPerSqft: 5.60 },
  { code: 'DC', name: 'Washington DC', slug: 'washington-dc', multiplier: 1.50, costPerSqft: 7.50 },
  { code: 'FL', name: 'Florida', slug: 'florida', multiplier: 1.10, costPerSqft: 5.50 },
  { code: 'GA', name: 'Georgia', slug: 'georgia', multiplier: 0.95, costPerSqft: 4.80 },
  { code: 'HI', name: 'Hawaii', slug: 'hawaii', multiplier: 1.55, costPerSqft: 7.80 },
  { code: 'ID', name: 'Idaho', slug: 'idaho', multiplier: 0.95, costPerSqft: 4.80 },
  { code: 'IL', name: 'Illinois', slug: 'illinois', multiplier: 1.18, costPerSqft: 5.90 },
  { code: 'IN', name: 'Indiana', slug: 'indiana', multiplier: 0.92, costPerSqft: 4.60 },
  { code: 'IA', name: 'Iowa', slug: 'iowa', multiplier: 0.88, costPerSqft: 4.40 },
  { code: 'KS', name: 'Kansas', slug: 'kansas', multiplier: 0.87, costPerSqft: 4.35 },
  { code: 'KY', name: 'Kentucky', slug: 'kentucky', multiplier: 0.85, costPerSqft: 4.25 },
  { code: 'LA', name: 'Louisiana', slug: 'louisiana', multiplier: 0.88, costPerSqft: 4.40 },
  { code: 'ME', name: 'Maine', slug: 'maine', multiplier: 1.05, costPerSqft: 5.25 },
  { code: 'MD', name: 'Maryland', slug: 'maryland', multiplier: 1.22, costPerSqft: 6.10 },
  { code: 'MA', name: 'Massachusetts', slug: 'massachusetts', multiplier: 1.38, costPerSqft: 6.90 },
  { code: 'MI', name: 'Michigan', slug: 'michigan', multiplier: 1.00, costPerSqft: 5.00 },
  { code: 'MN', name: 'Minnesota', slug: 'minnesota', multiplier: 1.12, costPerSqft: 5.60 },
  { code: 'MS', name: 'Mississippi', slug: 'mississippi', multiplier: 0.80, costPerSqft: 4.00 },
  { code: 'MO', name: 'Missouri', slug: 'missouri', multiplier: 0.90, costPerSqft: 4.50 },
  { code: 'MT', name: 'Montana', slug: 'montana', multiplier: 0.98, costPerSqft: 4.90 },
  { code: 'NE', name: 'Nebraska', slug: 'nebraska', multiplier: 0.90, costPerSqft: 4.50 },
  { code: 'NV', name: 'Nevada', slug: 'nevada', multiplier: 1.10, costPerSqft: 5.50 },
  { code: 'NH', name: 'New Hampshire', slug: 'new-hampshire', multiplier: 1.18, costPerSqft: 5.90 },
  { code: 'NJ', name: 'New Jersey', slug: 'new-jersey', multiplier: 1.32, costPerSqft: 6.60 },
  { code: 'NM', name: 'New Mexico', slug: 'new-mexico', multiplier: 0.88, costPerSqft: 4.40 },
  { code: 'NY', name: 'New York', slug: 'new-york', multiplier: 1.45, costPerSqft: 7.25 },
  { code: 'NC', name: 'North Carolina', slug: 'north-carolina', multiplier: 0.93, costPerSqft: 4.65 },
  { code: 'ND', name: 'North Dakota', slug: 'north-dakota', multiplier: 0.93, costPerSqft: 4.65 },
  { code: 'OH', name: 'Ohio', slug: 'ohio', multiplier: 0.95, costPerSqft: 4.75 },
  { code: 'OK', name: 'Oklahoma', slug: 'oklahoma', multiplier: 0.85, costPerSqft: 4.25 },
  { code: 'OR', name: 'Oregon', slug: 'oregon', multiplier: 1.18, costPerSqft: 5.90 },
  { code: 'PA', name: 'Pennsylvania', slug: 'pennsylvania', multiplier: 1.10, costPerSqft: 5.50 },
  { code: 'RI', name: 'Rhode Island', slug: 'rhode-island', multiplier: 1.22, costPerSqft: 6.10 },
  { code: 'SC', name: 'South Carolina', slug: 'south-carolina', multiplier: 0.88, costPerSqft: 4.40 },
  { code: 'SD', name: 'South Dakota', slug: 'south-dakota', multiplier: 0.88, costPerSqft: 4.40 },
  { code: 'TN', name: 'Tennessee', slug: 'tennessee', multiplier: 0.88, costPerSqft: 4.40 },
  { code: 'TX', name: 'Texas', slug: 'texas', multiplier: 1.05, costPerSqft: 5.25 },
  { code: 'UT', name: 'Utah', slug: 'utah', multiplier: 1.05, costPerSqft: 5.25 },
  { code: 'VT', name: 'Vermont', slug: 'vermont', multiplier: 1.12, costPerSqft: 5.60 },
  { code: 'VA', name: 'Virginia', slug: 'virginia', multiplier: 1.12, costPerSqft: 5.60 },
  { code: 'WA', name: 'Washington', slug: 'washington', multiplier: 1.30, costPerSqft: 6.50 },
  { code: 'WV', name: 'West Virginia', slug: 'west-virginia', multiplier: 0.80, costPerSqft: 4.00 },
  { code: 'WI', name: 'Wisconsin', slug: 'wisconsin', multiplier: 1.00, costPerSqft: 5.00 },
  { code: 'WY', name: 'Wyoming', slug: 'wyoming', multiplier: 0.93, costPerSqft: 4.65 },
];

function round50(n) {
  return Math.round(n / 50) * 50;
}

// Typical full-roof-replacement cost range for a state, based on its average
// $/sq ft and a representative 1,800 sq ft roof (+/- 15%).
function costRange(costPerSqft) {
  const mid = costPerSqft * TYPICAL_ROOF_SQFT;
  return { low: round50(mid * (1 - RANGE_SPREAD)), high: round50(mid * (1 + RANGE_SPREAD)) };
}

function marketTier(multiplier) {
  if (multiplier >= 1.15) return 'high';
  if (multiplier <= 0.88) return 'low';
  return 'average';
}

function withComputed(s) {
  return { ...s, ...costRange(s.costPerSqft), tier: marketTier(s.multiplier) };
}

export function getAllStates() {
  return STATES.map(withComputed).sort((a, b) => a.name.localeCompare(b.name));
}

export function getStateBySlug(slug) {
  const s = STATES.find(st => st.slug === slug);
  return s ? withComputed(s) : null;
}

export function getStateByCode(code) {
  const s = STATES.find(st => st.code === code);
  return s ? withComputed(s) : null;
}

// A representative spread of states for homepage teaser tables — mix of
// high-cost, low-cost, and populous average markets.
export function getFeaturedStates() {
  const slugs = ['california', 'texas', 'florida', 'new-york', 'pennsylvania', 'illinois', 'ohio', 'georgia', 'arizona'];
  return slugs.map(getStateBySlug).filter(Boolean);
}

// Applies a state's multiplier to a national low/high price range — the same
// math backend/src/services/roofingCalculation.js uses (applyFinal: cost * stateMult).
export function adjustForState(low, high, state) {
  return { low: round50(low * state.multiplier), high: round50(high * state.multiplier) };
}
