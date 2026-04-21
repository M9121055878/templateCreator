const ALLOWED_STYLE_KEYS = new Set([
  'backgroundColor',
  'color',
  'borderRadius',
  'padding',
  'opacity',
  'objectFit',
  'fontFamily',
  'fontSize',
  'fontWeight',
  'lineHeight',
  'letterSpacing',
  'border',
  'textAlign',
  'display',
  'alignItems',
  'justifyContent',
]);

export function pickAllowedStyles(style = {}) {
  return Object.fromEntries(Object.entries(style).filter(([key]) => ALLOWED_STYLE_KEYS.has(key)));
}
