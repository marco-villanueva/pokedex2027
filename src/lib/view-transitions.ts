import { flushSync } from 'react-dom'

/**
 * View Transitions helpers (§7 item P0-1).
 *
 * SPA morph card → dossier with `view-transition-name` pairs shared by id
 * (artwork + numeral); everything else crossfades by default. CSS-first,
 * zero dependencies, progressive: no API → plain navigation.
 *
 * Rules honoured:
 * - feature-detect `document.startViewTransition`;
 * - skip entirely under `prefers-reduced-motion` (content stays intact);
 * - each transition serves orientation/continuity (AGENTS.md visual rule).
 */

export function pokemonArtTransitionName(id: number | string): string {
  return `pokemon-art-${id}`
}

export function pokemonNumeralTransitionName(id: number | string): string {
  return `pokemon-numeral-${id}`
}

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function supportsViewTransitions(): boolean {
  return typeof document !== 'undefined' && 'startViewTransition' in document
}

/** True when a transition should run: API present + motion allowed. */
export function shouldUseViewTransition(): boolean {
  return supportsViewTransitions() && !prefersReducedMotion()
}

interface ViewTransitionCapable {
  startViewTransition?: (callback: () => void | Promise<void>) => unknown
}

/**
 * Run a same-document navigation inside `document.startViewTransition`
 * when available and motion is allowed; otherwise run it plainly.
 * The callback must perform the DOM-updating navigation synchronously
 * (callers wrap React state updates with `flushSync`).
 */
export function transitionNavigate(navigate: () => void): void {
  if (!shouldUseViewTransition()) {
    navigate()
    return
  }
  const doc = document as unknown as ViewTransitionCapable
  try {
    doc.startViewTransition?.(() => {
      navigate()
    })
  } catch {
    navigate()
  }
}

/**
 * Imperative twin of `<TransitionLink>` for programmatic jumps (command
 * palette, surprise-me): the router update flushes synchronously inside
 * the transition so the outgoing snapshot is correct.
 */
export function goWithTransition(navigate: (to: string) => void, to: string): void {
  transitionNavigate(() => {
    flushSync(() => {
      navigate(to)
    })
  })
}
