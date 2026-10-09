import { useId } from 'react'
import type { ReactNode } from 'react'
import { supportsPopover } from '@/lib/popover.ts'
import './HelpPopover.css'

interface HelpPopoverProps {
  /** Trigger label, e.g. "How to read". Always text, never icon-only. */
  buttonLabel: string
  /** Panel heading, announced as the popover's accessible name. */
  title: string
  children: ReactNode
}

function sanitise(id: string): string {
  return `px-pop-${id.replace(/[^a-zA-Z0-9_-]/g, '')}`
}

/**
 * Supplementary help as a native popover (§7 P0-3): top layer, Esc and
 * light-dismiss free, entry animation purely declarative via
 * `@starting-style` (see `HelpPopover.css`). Zero JS for open/close.
 *
 * Fallback: where the API is missing the same content renders as a native
 * `<details>` disclosure — fully legible and operable, no polyfill.
 */
export function HelpPopover({ buttonLabel, title, children }: HelpPopoverProps) {
  const panelId = sanitise(useId())

  if (!supportsPopover()) {
    return (
      <details className="px-popover-fallback">
        <summary>{buttonLabel}</summary>
        <div className="px-popover-fallback-body">
          <p className="px-popover-title">{title}</p>
          {children}
        </div>
      </details>
    )
  }

  return (
    <>
      <button type="button" className="px-popover-trigger" popoverTarget={panelId}>
        {buttonLabel}
      </button>
      <div id={panelId} popover="auto" className="px-popover" aria-label={title}>
        <p className="px-popover-title">{title}</p>
        {children}
      </div>
    </>
  )
}
