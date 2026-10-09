import { render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { supportsAnchorPositioning } from '@/lib/anchor.ts'
import { TypeBadge } from './TypeBadge.tsx'

describe('TypeBadge anchor tooltip (§7 P0-4)', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('reports no anchor support in this runtime', () => {
    expect(supportsAnchorPositioning()).toBe(false)
  })

  it('falls back to a static title without anchor support', () => {
    render(<TypeBadge type="fire" />)
    const badge = screen.getByTitle('fire type')
    expect(badge).toHaveTextContent('fire')
    expect(badge.querySelector('.px-type-tip')).toBeNull()
  })

  it('anchors a tooltip and drops the title when supported', () => {
    vi.stubGlobal('CSS', { supports: () => true })
    expect(supportsAnchorPositioning()).toBe(true)
    render(<TypeBadge type="fire" />)
    const badge = screen.getByText('fire', { exact: false })
    expect(badge).not.toHaveAttribute('title')
    const tip = badge.querySelector('.px-type-tip')
    expect(tip).not.toBeNull()
    expect(tip).toHaveAttribute('aria-hidden', 'true')
  })

  it('keeps the static title for unknown types even when supported', () => {
    vi.stubGlobal('CSS', { supports: () => true })
    render(<TypeBadge type="unknown" />)
    const badge = screen.getByTitle('unknown type')
    expect(badge.querySelector('.px-type-tip')).toBeNull()
  })
})
