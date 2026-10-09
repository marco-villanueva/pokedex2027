/**
 * Native Popover API probe (§7 P0-3). Baseline 2025 (Chrome 114+,
 * Safari 17+, Firefox 125+): true on the whole support matrix, so the
 * `<details>` fallback is defence-in-depth, verified by unit + E2E.
 */
export function supportsPopover(): boolean {
  return typeof HTMLElement !== 'undefined' && 'showPopover' in HTMLElement.prototype
}
