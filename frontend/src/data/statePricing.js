// ─── State roofing cost data ────────────────────────────────────────────────
// Mirrors backend/src/config/defaults.js (STATE_PRICING_MULTIPLIERS,
// STATE_NAMES, STATE_AVERAGE_ROOF_COST_PER_SQFT) so state pages and the
// homepage state table stay consistent with what the calculator itself
// quotes. Update both files together if pricing data changes.

const RANGE_SPREAD = 0.15; // +/- range shown around a state's average roof-replacement price

// avgCost = STATE_AVERAGE_ROOF_COST_PER_SQFT x a typical 2,000 sq ft roof --
// same reference size services.js uses for its "typical job" figures, so a
// state page and a service page agree with each other.
const STATES = [
  { code: 'AL', name: 'Alabama', slug: 'alabama', multiplier: 0.85, avgCost: 8400 },
  { code: 'AK', name: 'Alaska', slug: 'alaska', multiplier: 1.42, avgCost: 14200 },
  { code: 'AZ', name: 'Arizona', slug: 'arizona', multiplier: 1.05, avgCost: 10600 },
  { code: 'AR', name: 'Arkansas', slug: 'arkansas', multiplier: 0.82, avgCost: 8200 },
  { code: 'CA', name: 'California', slug: 'california', multiplier: 1.48, avgCost: 14800 },
  { code: 'CO', name: 'Colorado', slug: 'colorado', multiplier: 1.20, avgCost: 12000 },
  { code: 'CT', name: 'Connecticut', slug: 'connecticut', multiplier: 1.30, avgCost: 13000 },
  { code: 'DE', name: 'Delaware', slug: 'delaware', multiplier: 1.12, avgCost: 11200 },
  { code: 'DC', name: 'Washington DC', slug: 'washington-dc', multiplier: 1.50, avgCost: 15000 },
  { code: 'FL', name: 'Florida', slug: 'florida', multiplier: 1.10, avgCost: 11000 },
  { code: 'GA', name: 'Georgia', slug: 'georgia', multiplier: 0.95, avgCost: 9600 },
  { code: 'HI', name: 'Hawaii', slug: 'hawaii', multiplier: 1.55, avgCost: 15600 },
  { code: 'ID', name: 'Idaho', slug: 'idaho', multiplier: 0.95, avgCost: 9600 },
  { code: 'IL', name: 'Illinois', slug: 'illinois', multiplier: 1.18, avgCost: 11800 },
  { code: 'IN', name: 'Indiana', slug: 'indiana', multiplier: 0.92, avgCost: 9200 },
  { code: 'IA', name: 'Iowa', slug: 'iowa', multiplier: 0.88, avgCost: 8800 },
  { code: 'KS', name: 'Kansas', slug: 'kansas', multiplier: 0.87, avgCost: 8700 },
  { code: 'KY', name: 'Kentucky', slug: 'kentucky', multiplier: 0.85, avgCost: 8500 },
  { code: 'LA', name: 'Louisiana', slug: 'louisiana', multiplier: 0.88, avgCost: 8800 },
  { code: 'ME', name: 'Maine', slug: 'maine', multiplier: 1.05, avgCost: 10500 },
  { code: 'MD', name: 'Maryland', slug: 'maryland', multiplier: 1.22, avgCost: 12200 },
  { code: 'MA', name: 'Massachusetts', slug: 'massachusetts', multiplier: 1.38, avgCost: 13800 },
  { code: 'MI', name: 'Michigan', slug: 'michigan', multiplier: 1.00, avgCost: 10000 },
  { code: 'MN', name: 'Minnesota', slug: 'minnesota', multiplier: 1.12, avgCost: 11200 },
  { code: 'MS', name: 'Mississippi', slug: 'mississippi', multiplier: 0.80, avgCost: 8000 },
  { code: 'MO', name: 'Missouri', slug: 'missouri', multiplier: 0.90, avgCost: 9000 },
  { code: 'MT', name: 'Montana', slug: 'montana', multiplier: 0.98, avgCost: 9800 },
  { code: 'NE', name: 'Nebraska', slug: 'nebraska', multiplier: 0.90, avgCost: 9000 },
  { code: 'NV', name: 'Nevada', slug: 'nevada', multiplier: 1.10, avgCost: 11000 },
  { code: 'NH', name: 'New Hampshire', slug: 'new-hampshire', multiplier: 1.18, avgCost: 11800 },
  { code: 'NJ', name: 'New Jersey', slug: 'new-jersey', multiplier: 1.32, avgCost: 13200 },
  { code: 'NM', name: 'New Mexico', slug: 'new-mexico', multiplier: 0.88, avgCost: 8800 },
  { code: 'NY', name: 'New York', slug: 'new-york', multiplier: 1.45, avgCost: 14500 },
  { code: 'NC', name: 'North Carolina', slug: 'north-carolina', multiplier: 0.93, avgCost: 9300 },
  { code: 'ND', name: 'North Dakota', slug: 'north-dakota', multiplier: 0.93, avgCost: 9300 },
  { code: 'OH', name: 'Ohio', slug: 'ohio', multiplier: 0.95, avgCost: 9500 },
  { code: 'OK', name: 'Oklahoma', slug: 'oklahoma', multiplier: 0.85, avgCost: 8500 },
  { code: 'OR', name: 'Oregon', slug: 'oregon', multiplier: 1.18, avgCost: 11800 },
  { code: 'PA', name: 'Pennsylvania', slug: 'pennsylvania', multiplier: 1.10, avgCost: 11000 },
  { code: 'RI', name: 'Rhode Island', slug: 'rhode-island', multiplier: 1.22, avgCost: 12200 },
  { code: 'SC', name: 'South Carolina', slug: 'south-carolina', multiplier: 0.88, avgCost: 8800 },
  { code: 'SD', name: 'South Dakota', slug: 'south-dakota', multiplier: 0.88, avgCost: 8800 },
  { code: 'TN', name: 'Tennessee', slug: 'tennessee', multiplier: 0.88, avgCost: 8800 },
  { code: 'TX', name: 'Texas', slug: 'texas', multiplier: 1.05, avgCost: 10500 },
  { code: 'UT', name: 'Utah', slug: 'utah', multiplier: 1.05, avgCost: 10500 },
  { code: 'VT', name: 'Vermont', slug: 'vermont', multiplier: 1.12, avgCost: 11200 },
  { code: 'VA', name: 'Virginia', slug: 'virginia', multiplier: 1.12, avgCost: 11200 },
  { code: 'WA', name: 'Washington', slug: 'washington', multiplier: 1.30, avgCost: 13000 },
  { code: 'WV', name: 'West Virginia', slug: 'west-virginia', multiplier: 0.80, avgCost: 8000 },
  { code: 'WI', name: 'Wisconsin', slug: 'wisconsin', multiplier: 1.00, avgCost: 10000 },
  { code: 'WY', name: 'Wyoming', slug: 'wyoming', multiplier: 0.93, avgCost: 9300 },
];

function round50(n) {
  return Math.round(n / 50) * 50;
}

// Full roof-replacement cost range for a state (+/- 15% around its average),
// for a typical 2,000 sq ft architectural-shingle roof -- matches the figure
// shown on the homepage ("Roof Replacement Cost by State").
function costRange(avgCost) {
  return { low: round50(avgCost * (1 - RANGE_SPREAD)), high: round50(avgCost * (1 + RANGE_SPREAD)) };
}

function marketTier(multiplier) {
  if (multiplier >= 1.15) return 'high';
  if (multiplier <= 0.88) return 'low';
  return 'average';
}

function withComputed(s) {
  return { ...s, ...costRange(s.avgCost), tier: marketTier(s.multiplier) };
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

// A representative spread of states for homepage teaser tables -- mix of
// high-cost, low-cost, and populous average markets.
export function getFeaturedStates() {
  const slugs = ['california', 'texas', 'florida', 'new-york', 'illinois', 'colorado', 'arizona', 'washington'];
  return slugs.map(getStateBySlug).filter(Boolean);
}

// Applies a state's multiplier to a national low/high price range -- the same
// math backend/src/services/roofingCalculation.js's applyFinal uses.
export function adjustForState(low, high, state) {
  return { low: Math.round(low * state.multiplier), high: Math.round(high * state.multiplier) };
}
