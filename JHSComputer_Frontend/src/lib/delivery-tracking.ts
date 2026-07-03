export function normalizeTrackingNo(trackingNo?: string | null) {
  return (trackingNo ?? '').replace(/[^0-9]/g, '');
}

export function getCjTrackingUrl(trackingNo?: string | null) {
  const normalized = normalizeTrackingNo(trackingNo);
  if (!normalized) return 'https://www.cjlogistics.com/ko/tool/parcel/tracking';
  return `https://trace.cjlogistics.com/next/tracking.html?wblNo=${encodeURIComponent(normalized)}`;
}

export function getTrackingCompanyLabel(company?: string | null) {
  if (!company || company === 'CJ') return 'CJ대한통운';
  return company;
}
