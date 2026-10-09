import type { ButtonHTMLAttributes } from 'react'
import './FilterChip.css'

interface FilterChipProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'aria-pressed'> {
  selected?: boolean
  count?: number
}

/**
 * Toggle filter primitive. Selection is exposed via `aria-pressed` (never
 * color-only) and an optional result count.
 */
export function FilterChip({ selected = false, count, children, ...rest }: FilterChipProps) {
  return (
    <button
      type="button"
      className="px-chip"
      aria-pressed={selected}
      data-selected={selected || undefined}
      {...rest}
    >
      <span className="px-chip-state" aria-hidden="true">
        {selected ? '●' : '○'}
      </span>
      <span>{children}</span>
      {count !== undefined && <span className="px-chip-count">{count}</span>}
    </button>
  )
}
