/* eslint-disable react-refresh/only-export-components -- provider + hook are intentionally co-located per feature */
import {
  createContext,
  startTransition,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useOptimistic,
  useRef,
  useState,
} from 'react'
import type { ReactNode } from 'react'
import { persistCollection, readCollection } from '@/lib/storage.ts'

const STORAGE_KEY = 'pokedex2027:favorites'
const STORAGE_VERSION = 1

interface FavoritesContextValue {
  favorites: number[]
  isFavorite: (id: number) => boolean
  toggleFavorite: (id: number) => void
  clearFavorites: () => void
  /** Set when persistence fails (the visible change was rolled back). */
  persistError: string | null
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null)

function loadFavorites(): number[] {
  const data = readCollection<number[]>(STORAGE_KEY, STORAGE_VERSION, [], {
    migrate: (raw) => (Array.isArray(raw) ? raw.filter((id) => Number.isInteger(id)) : undefined),
  })
  return [...new Set(data.filter((id) => Number.isInteger(id) && id > 0))]
}

/**
 * Local-only favorites (V1): versioned persistence, malformed-data safety,
 * cross-tab sync via storage events. No server state is mirrored here.
 *
 * Optimistic (§7 P1-8): the UI applies toggles instantly via
 * `useOptimistic` while persistence resolves in a transition; when
 * storage is unavailable the change rolls back and `persistError`
 * reports it instead of diverging silently.
 */
export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [committed, setCommitted] = useState<number[]>(loadFavorites)
  const [optimistic, addOptimistic] = useOptimistic<number[], number[]>(
    committed,
    (_current, next) => next,
  )
  const [persistError, setPersistError] = useState<string | null>(null)
  // Live base for chained toggles (a transition may still be in flight).
  const baseRef = useRef(committed)
  useEffect(() => {
    baseRef.current = committed
  }, [committed])

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) setCommitted(loadFavorites())
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const commit = useCallback(
    (next: number[]) => {
      const prev = baseRef.current
      baseRef.current = next
      startTransition(async () => {
        addOptimistic(next)
        try {
          await persistCollection(STORAGE_KEY, STORAGE_VERSION, next)
          setCommitted(next)
          setPersistError(null)
        } catch {
          baseRef.current = prev
          setPersistError('Could not save favorites — storage unavailable. Change reverted.')
        }
      })
    },
    [addOptimistic],
  )

  const toggleFavorite = useCallback(
    (id: number) => {
      const current = baseRef.current
      commit(
        current.includes(id) ? current.filter((favorite) => favorite !== id) : [...current, id],
      )
    },
    [commit],
  )

  const clearFavorites = useCallback(() => commit([]), [commit])

  const value = useMemo<FavoritesContextValue>(
    () => ({
      favorites: optimistic,
      isFavorite: (id: number) => optimistic.includes(id),
      toggleFavorite,
      clearFavorites,
      persistError,
    }),
    [optimistic, toggleFavorite, clearFavorites, persistError],
  )

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
}

export function useFavorites(): FavoritesContextValue {
  const context = useContext(FavoritesContext)
  if (!context) throw new Error('useFavorites must be used within FavoritesProvider')
  return context
}
