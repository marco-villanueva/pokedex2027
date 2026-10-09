import { useQuery } from '@tanstack/react-query'
import { useEffect, useId, useRef, useState } from 'react'
import { abilityDetailOptions } from '@/api/pokeapi/queries.ts'
import { supportsPopover } from '@/lib/popover.ts'
import type { PokemonAbility } from '@/domain/pokemon/types.ts'
import './AbilityRows.css'

/**
 * Ability rows with on-demand details in a native popover (§7 P0-3).
 * The effect text fetches only when a row opens (cached afterwards) —
 * never upfront for all abilities. Top layer, Esc and light-dismiss are
 * native; entry animation is declarative (`HelpPopover.css`).
 * Without the Popover API the same content renders as `<details>`.
 */
export function AbilityRows({ abilities }: { abilities: PokemonAbility[] }) {
  return (
    <ul className="ability-rows">
      {abilities.map((ability) => (
        <AbilityRow key={ability.name} ability={ability} />
      ))}
    </ul>
  )
}

interface ToggleEventLike extends Event {
  newState?: string
}

function AbilityRow({ ability }: { ability: PokemonAbility }) {
  const [open, setOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const panelId = `px-ability-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`
  const detail = useQuery({ ...abilityDetailOptions(open ? ability.name : undefined) })

  useEffect(() => {
    const panel = panelRef.current
    if (!panel || !supportsPopover()) return
    const onToggle = (event: Event) => {
      if ((event as ToggleEventLike).newState === 'open') setOpen(true)
      else setOpen(false)
    }
    panel.addEventListener('toggle', onToggle)
    return () => panel.removeEventListener('toggle', onToggle)
  }, [])

  const body = (
    <>
      {detail.isPending ? (
        <p role="status">Reading archive entry…</p>
      ) : detail.data?.shortEffect ? (
        <p>{detail.data.shortEffect}</p>
      ) : (
        <p className="panel-muted">No archived description for this ability.</p>
      )}
    </>
  )

  if (!supportsPopover()) {
    return (
      <li className="ability-row">
        <details onToggle={(event) => setOpen(event.currentTarget.open)}>
          <summary className="ability-toggle ability-summary">
            <span>{ability.displayName}</span>
            <span className="ability-tags">
              {ability.hidden && <span className="ability-hidden">Hidden</span>}
              <span className="ability-caret" aria-hidden="true">
                {open ? '▾' : '▸'}
              </span>
            </span>
          </summary>
          <div className="ability-detail">{body}</div>
        </details>
      </li>
    )
  }

  return (
    <li className="ability-row">
      <button type="button" className="ability-toggle" popoverTarget={panelId} aria-expanded={open}>
        <span>{ability.displayName}</span>
        <span className="ability-tags">
          {ability.hidden && <span className="ability-hidden">Hidden</span>}
          <span className="ability-caret" aria-hidden="true">
            {open ? '▾' : '▸'}
          </span>
        </span>
      </button>
      <div
        ref={panelRef}
        id={panelId}
        popover="auto"
        className="px-popover"
        aria-label={ability.displayName}
      >
        <p className="px-popover-title">{ability.displayName}</p>
        <div className="ability-detail ability-detail-popover">{body}</div>
      </div>
    </li>
  )
}
