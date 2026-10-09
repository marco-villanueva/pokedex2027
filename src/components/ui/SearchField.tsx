import type { InputHTMLAttributes } from 'react'
import './SearchField.css'

interface SearchFieldProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'value' | 'onChange'
> {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  loading?: boolean
  placeholder?: string
}

/**
 * Search input primitive: always labelled, with an accessible clear action
 * and an optional loading state. State lives in the parent (URL in RC2).
 */
export function SearchField({
  id,
  label,
  value,
  onChange,
  loading = false,
  placeholder,
  ...rest
}: SearchFieldProps) {
  return (
    <div className="px-search">
      <label htmlFor={id} className="px-search-label">
        {label}
      </label>
      <div className="px-search-row">
        <input
          id={id}
          type="search"
          className="px-search-input"
          value={value}
          placeholder={placeholder}
          autoComplete="off"
          aria-busy={loading || undefined}
          onChange={(event) => onChange(event.target.value)}
          {...rest}
        />
        {loading && (
          <span className="px-search-status" role="status" aria-label="Searching">
            ◌
          </span>
        )}
        {value.length > 0 && !loading && (
          <button
            type="button"
            className="px-search-clear"
            aria-label="Clear search"
            onClick={() => onChange('')}
          >
            ✕
          </button>
        )}
      </div>
    </div>
  )
}
