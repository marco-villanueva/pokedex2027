import { useQuery } from '@tanstack/react-query'
import { useId, useMemo, useRef, useState } from 'react'
import { pokemonIndexOptions } from '@/api/pokeapi/queries.ts'
import { squashName } from '@/domain/explorer/filters.ts'
import { formatPokedexId, toDisplayName } from '@/domain/pokemon/format.ts'
import './SpeciesCombobox.css'

const SUGGESTION_COUNT = 8

interface SpeciesComboboxProps {
  label: string
  value: string | undefined
  onSelect: (slug: string | undefined) => void
}

/**
 * Accessible species picker over the canonical index: type to filter,
 * Arrow keys to move, Enter to select, Escape to dismiss. Selection is
 * always echoed as text, never color-only.
 */
export function SpeciesCombobox({ label, value, onSelect }: SpeciesComboboxProps) {
  const index = useQuery(pokemonIndexOptions())
  const [text, setText] = useState(value ?? '')
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const inputId = useId()
  const listId = useId()
  const inputRef = useRef<HTMLInputElement>(null)

  // Keep the text in sync when the URL drives the value (reload, back).
  const [lastValue, setLastValue] = useState(value)
  if (lastValue !== value) {
    setLastValue(value)
    setText(value ?? '')
  }

  const suggestions = useMemo(() => {
    const query = text.trim().toLowerCase().replace(/^#/, '')
    const squashed = squashName(query)
    const entries = index.data ?? []
    if (query.length === 0) return entries.slice(0, SUGGESTION_COUNT)
    return entries
      .filter(
        (entry) =>
          entry.name.includes(query) ||
          squashName(entry.name).includes(squashed) ||
          String(entry.id) === query,
      )
      .slice(0, SUGGESTION_COUNT)
  }, [index.data, text])

  const commit = (slug: string | undefined) => {
    setText(slug ?? '')
    setOpen(false)
    onSelect(slug)
  }

  const resolved = useMemo(() => {
    if (!value) return null
    const numeric = Number.parseInt(value, 10)
    const entry = Number.isFinite(numeric)
      ? index.data?.find((item) => item.id === numeric)
      : index.data?.find((item) => item.name === value)
    return entry ?? { id: 0, name: value }
  }, [index.data, value])

  return (
    <div className="px-combo">
      <label htmlFor={inputId} className="px-combo-label">
        {label}
      </label>
      <input
        ref={inputRef}
        id={inputId}
        role="combobox"
        aria-expanded={open && suggestions.length > 0}
        aria-controls={listId}
        aria-activedescendant={open ? `${listId}-${active}` : undefined}
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        placeholder="Name or number…"
        value={text}
        onChange={(event) => {
          setText(event.target.value)
          setOpen(true)
          setActive(0)
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown' && suggestions.length > 0) {
            event.preventDefault()
            setOpen(true)
            setActive((index_) => (index_ + 1) % suggestions.length)
          } else if (event.key === 'ArrowUp' && suggestions.length > 0) {
            event.preventDefault()
            setOpen(true)
            setActive((index_) => (index_ - 1 + suggestions.length) % suggestions.length)
          } else if (event.key === 'Enter') {
            event.preventDefault()
            const pick = suggestions[active]
            commit(pick ? String(pick.id) : text.trim() || undefined)
          } else if (event.key === 'Escape') {
            setOpen(false)
            inputRef.current?.blur()
          }
        }}
      />
      {resolved && (
        <p className="px-combo-current">
          Selected:{' '}
          {resolved.id > 0
            ? `${toDisplayName(resolved.name)} ${formatPokedexId(resolved.id)}`
            : value}
          <button type="button" className="px-combo-clear" onClick={() => commit(undefined)}>
            Clear
          </button>
        </p>
      )}
      {open && suggestions.length > 0 && (
        <ul
          id={listId}
          role="listbox"
          aria-label={`${label} suggestions`}
          className="px-combo-list"
        >
          {suggestions.map((entry, position) => (
            <li
              key={entry.id}
              id={`${listId}-${position}`}
              role="option"
              aria-selected={position === active}
              data-active={position === active || undefined}
              onMouseDown={(event) => {
                // Select before blur closes the listbox.
                event.preventDefault()
                commit(String(entry.id))
              }}
              onMouseEnter={() => setActive(position)}
            >
              <span className="px-combo-id">{formatPokedexId(entry.id)}</span>
              <span>{toDisplayName(entry.name)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
