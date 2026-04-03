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
    asphalt_shingle: 'Asphalt Shingle Roof',
    metal: 'Metal Roof',
    tile: 'Tile Roof',
    flat_tpo: 'Flat / TPO Roof',
    repair: 'Roof Repair',
    inspection: 'Roof Inspection',
    gutter: 'Gutter Installation',
  };
  return map[type] || type;
}

export function urgencyColor(level) {
  if (level === 'critical') return '#dc2626';
  if (level === 'high') return '#d97706';
  return '#2563eb';
}
