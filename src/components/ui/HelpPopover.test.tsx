import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { supportsPopover } from '@/lib/popover.ts'
import { HelpPopover } from './HelpPopover.tsx'

describe('HelpPopover (§7 P0-3)', () => {
  it('exposes the Popover API probe', () => {
    // jsdom has no showPopover: the fallback path must engage here.
    expect(supportsPopover()).toBe(false)
  })

  it('renders the details fallback with full content when the API is missing', () => {
    render(
      <HelpPopover buttonLabel="How to read" title="Reading matchups">
        <p>Legend body</p>
      </HelpPopover>,
    )
    const summary = screen.getByText('How to read')
    expect(summary.tagName).toBe('SUMMARY')
    expect(screen.getByText('Reading matchups')).toBeInTheDocument()
    expect(screen.getByText('Legend body')).toBeInTheDocument()
  })
})
