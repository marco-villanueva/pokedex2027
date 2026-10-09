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
import { addTeamMember, MAX_TEAM_SIZE, moveTeamMember, removeTeamMember } from './team-rules.ts'

const STORAGE_KEY = 'pokedex2027:team'
const STORAGE_VERSION = 1

export type TeamAddError = 'full' | 'duplicate' | null

interface TeamContextValue {
  members: number[]
  isFull: boolean
  lastError: TeamAddError
  /** Set when persistence fails (the visible change was rolled back). */
  persistError: string | null
  addMember: (id: number) => boolean
  removeMember: (id: number) => void
  moveMember: (from: number, to: number) => void
  clearTeam: () => void
}

const TeamContext = createContext<TeamContextValue | null>(null)

function loadTeam(): number[] {
  const data = readCollection<number[]>(STORAGE_KEY, STORAGE_VERSION, [], {
    migrate: (raw) => (Array.isArray(raw) ? raw.filter((id) => Number.isInteger(id)) : undefined),
  })
  return [...new Set(data.filter((id) => Number.isInteger(id) && id > 0))].slice(0, MAX_TEAM_SIZE)
}

/**
 * Local-only six-member team (V1): versioned persistence, invalid-state
 * prevention (max, duplicates), cross-tab sync. Server data stays in
 * TanStack Query; only ids live here.
 *
 * Optimistic (§7 P1-8): mutations apply instantly via `useOptimistic`
 * while persistence resolves in a transition; validation (full/duplicate)
 * stays synchronous, and a storage failure rolls the UI back with
 * `persistError` instead of diverging silently.
 */
export function TeamProvider({ children }: { children: ReactNode }) {
  const [committed, setCommitted] = useState<number[]>(loadTeam)
  const [optimistic, addOptimistic] = useOptimistic<number[], number[]>(
    committed,
    (_current, next) => next,
  )
  const [lastError, setLastError] = useState<TeamAddError>(null)
  const [persistError, setPersistError] = useState<string | null>(null)
  // Live base for chained mutations (a transition may still be in flight).
  const baseRef = useRef(committed)
  useEffect(() => {
    baseRef.current = committed
  }, [committed])

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) setCommitted(loadTeam())
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
          setPersistError('Could not save the team — storage unavailable. Change reverted.')
        }
      })
    },
    [addOptimistic],
  )

  const addMember = useCallback(
    (id: number): boolean => {
      const result = addTeamMember(baseRef.current, id)
      if ('error' in result) {
        setLastError(result.error)
        return false
      }
      setLastError(null)
      commit(result.members)
      return true
    },
    [commit],
  )

  const removeMember = useCallback(
    (id: number) => {
      commit(removeTeamMember(baseRef.current, id))
    },
    [commit],
  )

  const moveMember = useCallback(
    (from: number, to: number) => {
      commit(moveTeamMember(baseRef.current, from, to))
    },
    [commit],
  )

  const clearTeam = useCallback(() => commit([]), [commit])

  const value = useMemo<TeamContextValue>(
    () => ({
      members: optimistic,
      isFull: optimistic.length >= MAX_TEAM_SIZE,
      lastError,
      persistError,
      addMember,
      removeMember,
      moveMember,
      clearTeam,
    }),
    [optimistic, lastError, persistError, addMember, removeMember, moveMember, clearTeam],
  )

  return <TeamContext.Provider value={value}>{children}</TeamContext.Provider>
}

export function useTeam(): TeamContextValue {
  const context = useContext(TeamContext)
  if (!context) throw new Error('useTeam must be used within TeamProvider')
  return context
}

export { MAX_TEAM_SIZE }
