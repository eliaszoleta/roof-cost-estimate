export function formatPrice(n) {
  if (n == null) return '—';
  return '$' + Math.round(n).toLocaleString();
}

export function formatPriceRange(low, high) {
  if (low == null || high == null) return '—';
  return `${formatPrice(low)} – ${formatPrice(high)}`;
}

export function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function formatDateTime(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
}

export function serviceTypeLabel(type) {
  const map = {
    shingle_replacement: 'Asphalt Shingle Roof',
    metal_roofing:       'Metal Roof',
    tile_roofing:        'Tile Roof',
    flat_roof:           'Flat / TPO Roof',
    roof_repair:         'Roof Repair',
    roof_inspection:     'Roof Inspection',
    gutter_replacement:  'Gutter Installation',
  };
  return map[type] || type;
}

export function urgencyColor(level) {
  if (level === 'critical') return '#dc2626';
  if (level === 'high') return '#d97706';
  return '#2563eb';
}
