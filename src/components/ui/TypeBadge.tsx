import { useId, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { useQuery } from '@tanstack/react-query'
import { typeRelationsOptions } from '@/api/pokeapi/queries.ts'
import { FILTERABLE_TYPES } from '@/domain/explorer/filters.ts'
import { combineEffectiveness, formatMultiplier } from '@/domain/type/effectiveness.ts'
import { supportsAnchorPositioning } from '@/lib/anchor.ts'
import './TypeBadge.css'

function sanitise(id: string): string {
  // Anchor names must be <dashed-ident>: always start with `--`.
  return `--px-tip-${id.replace(/[^a-zA-Z0-9_-]/g, '')}`
}

/**
 * Type identity is never color-only: the badge always pairs the type color
 * with an uppercase text label (and a glyph from the type token), so meaning
 * survives color-vision deficiency and monochrome rendering.
 *
 * Anchor tooltip (§7 P0-4): on hover the badge shows its defensive table
 * (`position-area` + `flip-block`, zero JS positioning), fetched lazily on
 * first hover through the shared type document (cached per type). The tip
 * lives in the top layer (`popover="manual"` shown on hover) so card
 * `overflow: hidden` never clips it; it is `aria-hidden` and
 * `pointer-events: none`: supplementary only — the full matchups live as
 * text in the dossier panel, and the badge stays out of the tab order (no
 * new stops). Without anchor support the static `title` serves as fallback.
 */
export function TypeBadge({ type }: { type: string }) {
  const anchor = sanitise(useId())
  const anchored = supportsAnchorPositioning()
  const tippable = anchored && FILTERABLE_TYPES.includes(type)
  const [armed, setArmed] = useState(false)
  const tipRef = useRef<HTMLSpanElement>(null)

  // Anchor wiring is declarative: valid `--`-prefixed dashed-idents in
  // `style` objects serialize normally (verified in Chromium).
  const anchorStyle = { anchorName: anchor } as CSSProperties
  const tipStyle = { positionAnchor: anchor } as CSSProperties

  const showTip = () => {
    if (!tippable) return
    setArmed(true)
    const tip = tipRef.current as (HTMLSpanElement & { showPopover?: () => void }) | null
    try {
      tip?.showPopover?.()
    } catch {
      /* Already open or top-layer busy: the tip stays hidden, title-less
       * but harmless — full data lives in the dossier panel. */
    }
  }

  const hideTip = () => {
    const tip = tipRef.current as (HTMLSpanElement & { hidePopover?: () => void }) | null
    try {
      tip?.hidePopover?.()
    } catch {
      /* Already hidden: nothing to do. */
    }
  }

  return (
    <span
      className="px-type-badge"
      data-type={type}
      title={tippable ? undefined : `${type} type`}
      style={tippable ? anchorStyle : undefined}
      onMouseEnter={showTip}
      onMouseLeave={hideTip}
    >
      <span className="px-type-glyph" aria-hidden="true" />
      {type}
      {tippable && (
        <span
          ref={tipRef}
          popover="manual"
          className="px-type-tip"
          style={tipStyle}
          aria-hidden="true"
        >
          {armed ? <TypeTipBody type={type} /> : <span>Reading archive…</span>}
        </span>
      )}
    </span>
  )
}

function TypeTipBody({ type }: { type: string }) {
  const relations = useQuery({ ...typeRelationsOptions(type) })

  if (relations.isPending) return <span>Reading archive…</span>
  if (relations.isError || !relations.data) return <span>Type archive unavailable.</span>

  const effectiveness = combineEffectiveness([relations.data])
  return (
    <span className="px-type-tip-grid">
      <TipRow label="Weak to" entries={effectiveness.weak} />
      <TipRow label="Resists" entries={effectiveness.resist} />
      <TipRow label="Immune" entries={effectiveness.immune} />
    </span>
  )
}

function TipRow({
  label,
  entries,
}: {
  label: string
  entries: { type: string; multiplier: number }[]
}) {
  if (entries.length === 0) return null
  return (
    <span className="px-type-tip-row">
      <span className="px-type-tip-label">{label}</span>
      <span>
        {entries.map((entry) => `${entry.type} ${formatMultiplier(entry.multiplier)}`).join(' · ')}
      </span>
    </span>
  )
}
