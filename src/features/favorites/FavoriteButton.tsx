import { useFavorites } from './favorites-context.tsx'
import './FavoriteButton.css'

/**
 * Favorite toggle: filled heart + pressed state + explicit label.
 * Never color-only; safe over artwork chambers.
 */
export function FavoriteButton({ id, name }: { id: number; name: string }) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const active = isFavorite(id)
  return (
    <button
      type="button"
      className="px-favorite"
      data-active={active || undefined}
      aria-pressed={active}
      aria-label={active ? `Remove ${name} from favorites` : `Add ${name} to favorites`}
      onClick={(event) => {
        event.preventDefault()
        toggleFavorite(id)
      }}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path
          d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
          fill={active ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  )
}
