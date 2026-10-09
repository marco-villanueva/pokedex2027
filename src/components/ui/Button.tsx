import type { ButtonHTMLAttributes } from 'react'
import './Button.css'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'icon'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  loading?: boolean
}

/**
 * Project button primitive. Every variant carries default / hover /
 * focus-visible / active / disabled / loading states; reduced motion
 * disables the loading shimmer via global rules.
 */
export function Button({
  variant = 'secondary',
  loading = false,
  disabled,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      type="button"
      className={`px-button px-button--${variant}`}
      disabled={disabled ?? loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading && (
        <span className="px-button-spinner" aria-hidden="true">
          ◌
        </span>
      )}
      <span className="px-button-label">{loading ? 'Working…' : children}</span>
    </button>
  )
}
