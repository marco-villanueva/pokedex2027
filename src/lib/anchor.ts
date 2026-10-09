/**
 * CSS anchor-positioning probe (§7 P0-4). Chrome 125+, Safari 26+,
 * Firefox 147+ (Baseline Nuevo 2026): gate the tooltip enhancement behind
 * this; the `title` fallback serves everyone else.
 */
export function supportsAnchorPositioning(): boolean {
  return (
    typeof CSS !== 'undefined' &&
    typeof CSS.supports === 'function' &&
    CSS.supports('position-area', 'block-start')
  )
}
