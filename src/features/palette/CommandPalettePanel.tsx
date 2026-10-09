import { useQuery } from '@tanstack/react-query'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { pokemonIndexOptions, usePrefetchPokemon } from '@/api/pokeapi/queries.ts'
import { MAX_CANONICAL_ID } from '@/domain/explorer/generations.ts'
import { rankPaletteEntries } from '@/domain/palette/ranking.ts'
import { formatPokedexId, toDisplayName } from '@/domain/pokemon/format.ts'
import { goWithTransition } from '@/lib/view-transitions.ts'

interface PaletteAction {
  key: string
  label: string
  hint: string
  run: () => void
}

type PaletteItem =
  { kind: 'pokemon'; id: number; name: string } | { kind: 'action'; action: PaletteAction }

const LIST_ID = 'px-palette-list'

interface CommandPalettePanelProps {
  onToggle: (open: boolean) => void
  onApi: (close: () => void) => void
}

/**
 * Lazily-loaded palette panel (§7 P1-7): opens itself on mount (first
 * Ctrl+K/click pays the chunk + index cost once, cached afterwards).
 * Listbox keyboard contract: arrows move, Enter activates, Esc and
 * light-dismiss are native (auto popover).
 */
export function CommandPalettePanel({ onToggle, onApi }: CommandPalettePanelProps) {
  const navigate = useNavigate()
  const go = useCallback((to: string) => goWithTransition(navigate, to), [navigate])
  const prefetch = usePrefetchPokemon()

  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const panelRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const index = useQuery(pokemonIndexOptions())

  const actions = useMemo<PaletteAction[]>(
    () => [
      { key: 'explorer', label: 'Open explorer', hint: 'Archive', run: () => go('/pokedex') },
      { key: 'compare', label: 'Open compare', hint: 'Versus', run: () => go('/compare') },
      { key: 'favorites', label: 'Open favorites', hint: 'Shelf', run: () => go('/favorites') },
      { key: 'team', label: 'Open team', hint: 'Bench', run: () => go('/team') },
      {
        key: 'surprise',
        label: 'Surprise me',
        hint: 'Random',
        run: () => go(`/pokemon/${1 + Math.floor(Math.random() * MAX_CANONICAL_ID)}`),
      },
    ],
    [go],
  )

  const items = useMemo<PaletteItem[]>(() => {
    if (query.trim().length === 0) return actions.map((action) => ({ kind: 'action', action }))
    if (!index.data) return []
    return rankPaletteEntries(query, index.data).map((entry) => ({
      kind: 'pokemon',
      id: entry.id,
      name: entry.name,
    }))
  }, [query, index.data, actions])

  // The highlight never escapes the list; derived, never corrected.
  const safeActive = items.length === 0 ? 0 : Math.min(active, items.length - 1)

  useEffect(() => {
    const panel = panelRef.current
    if (!panel) return
    panel.showPopover()
    onApi(() => panel.hidePopover())
    const onToggleEvent = (event: Event) => {
      const state = (event as Event & { newState?: string }).newState
      if (state === 'open') {
        onToggle(true)
        setActive(0)
        inputRef.current?.focus()
      } else {
        onToggle(false)
      }
    }
    panel.addEventListener('toggle', onToggleEvent)
    return () => panel.removeEventListener('toggle', onToggleEvent)
  }, [onToggle, onApi])

  // Warm the dossier cache for the highlighted match.
  useEffect(() => {
    const current = items[safeActive]
    if (current?.kind === 'pokemon') prefetch(current.id)
  }, [safeActive, items, prefetch])

  const activate = (item: PaletteItem | undefined) => {
    if (!item) return
    if (item.kind === 'pokemon') go(`/pokemon/${item.id}`)
    else item.action.run()
    panelRef.current?.hidePopover()
  }

  const onInputKey = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActive((value) => (items.length === 0 ? 0 : (value + 1) % items.length))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActive((value) => (items.length === 0 ? 0 : (value - 1 + items.length) % items.length))
    } else if (event.key === 'Enter') {
      event.preventDefault()
      activate(items[safeActive])
    }
  }

  const activeId = items[safeActive] ? `px-palette-option-${safeActive}` : undefined

  return (
    <div
      ref={panelRef}
      id="px-palette-panel"
      popover="auto"
      role="dialog"
      aria-label="Quick jump"
      className="px-palette"
    >
      <div className="px-palette-box">
        <input
          ref={inputRef}
          className="px-palette-input"
          type="text"
          role="combobox"
          aria-expanded="true"
          aria-controls={LIST_ID}
          aria-activedescendant={activeId}
          aria-label="Jump to a Pokémon by name or number"
          placeholder="Type a name or number…"
          autoComplete="off"
          spellCheck={false}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value)
            setActive(0)
          }}
          onKeyDown={onInputKey}
        />
        {index.isPending ? (
          <p className="px-palette-status" role="status">
            Contacting the archive…
          </p>
        ) : index.isError ? (
          <p className="px-palette-status" role="alert">
            The archive index is unreachable — retry from the explorer.
          </p>
        ) : items.length === 0 ? (
          <p className="px-palette-status" role="status">
            No specimens match.
          </p>
        ) : (
          <ul id={LIST_ID} role="listbox" aria-label="Matches" className="px-palette-list">
            {items.map((item, position) => {
              const key = item.kind === 'pokemon' ? `p-${item.id}` : `a-${item.action.key}`
              return (
                <li
                  key={key}
                  id={`px-palette-option-${position}`}
                  role="option"
                  aria-selected={position === safeActive}
                  className="px-palette-option"
                  data-active={position === safeActive || undefined}
                  onMouseEnter={() => setActive(position)}
                  onClick={() => activate(item)}
                >
                  {item.kind === 'pokemon' ? (
                    <>
                      <span className="px-palette-id">{formatPokedexId(item.id)}</span>
                      <span className="px-palette-name">{toDisplayName(item.name)}</span>
                      <span className="px-palette-go" aria-hidden="true">
                        →
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="px-palette-name">{item.action.label}</span>
                      <span className="px-palette-hint">{item.action.hint}</span>
                    </>
                  )}
                </li>
              )
            })}
          </ul>
        )}
        <p className="px-palette-foot" aria-hidden="true">
          ↑↓ navigate · Enter open · Esc close
        </p>
      </div>
    </div>
  )
}
