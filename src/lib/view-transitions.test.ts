import { describe, expect, it, vi } from 'vitest'
import {
  goWithTransition,
  pokemonArtTransitionName,
  pokemonNumeralTransitionName,
  shouldUseViewTransition,
  transitionNavigate,
} from './view-transitions.ts'

describe('view-transitions (§7 P0-1)', () => {
  it('names shared pairs per specimen id', () => {
    expect(pokemonArtTransitionName(6)).toBe('pokemon-art-6')
    expect(pokemonNumeralTransitionName(6)).toBe('pokemon-numeral-6')
    expect(pokemonArtTransitionName(6)).not.toBe(pokemonArtTransitionName(9))
  })

  function stubMatchMedia(matches: boolean) {
    Object.defineProperty(window, 'matchMedia', {
      value: vi.fn(
        () =>
          ({
            matches,
            media: '(prefers-reduced-motion: reduce)',
          }) as MediaQueryList,
      ),
      configurable: true,
      writable: true,
    })
  }

  it('skips when the API is missing (fallback: plain navigation)', () => {
    const navigate = vi.fn()
    // jsdom has no startViewTransition → plain call.
    transitionNavigate(navigate)
    expect(navigate).toHaveBeenCalledTimes(1)
  })

  it('goWithTransition forwards the destination plainly without the API', () => {
    const navigate = vi.fn()
    goWithTransition(navigate, '/pokemon/25')
    expect(navigate).toHaveBeenCalledTimes(1)
    expect(navigate).toHaveBeenCalledWith('/pokemon/25')
  })

  it('skips under prefers-reduced-motion even with the API present', () => {
    const startViewTransition = vi.fn((callback: () => void) => {
      callback()
      return { finished: Promise.resolve() }
    })
    Object.defineProperty(document, 'startViewTransition', {
      value: startViewTransition,
      configurable: true,
      writable: true,
    })
    stubMatchMedia(true)
    try {
      expect(shouldUseViewTransition()).toBe(false)
      const navigate = vi.fn()
      transitionNavigate(navigate)
      expect(navigate).toHaveBeenCalledTimes(1)
      expect(startViewTransition).not.toHaveBeenCalled()
    } finally {
      vi.restoreAllMocks()
      Reflect.deleteProperty(document, 'startViewTransition')
    }
  })

  it('uses the API when present and motion is allowed', () => {
    const startViewTransition = vi.fn((callback: () => void) => {
      callback()
      return { finished: Promise.resolve() }
    })
    Object.defineProperty(document, 'startViewTransition', {
      value: startViewTransition,
      configurable: true,
      writable: true,
    })
    stubMatchMedia(false)
    try {
      expect(shouldUseViewTransition()).toBe(true)
      const navigate = vi.fn()
      transitionNavigate(navigate)
      expect(startViewTransition).toHaveBeenCalledTimes(1)
      expect(navigate).toHaveBeenCalledTimes(1)
    } finally {
      vi.restoreAllMocks()
      Reflect.deleteProperty(document, 'startViewTransition')
    }
  })
})
