export function isBrowserZoomed({ scale, innerWidth, outerWidth } = {}) {
  if (Number.isFinite(scale) && scale > 1.01) return true;
  return Number.isFinite(innerWidth) && Number.isFinite(outerWidth) && innerWidth < outerWidth * 0.85;
}
