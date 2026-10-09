/**
 * Versioned localStorage collections. Every payload carries a `version` so
 * future shapes migrate instead of crashing; malformed, foreign or
 * version-mismatched payloads fall back safely without throwing.
 */

export interface VersionedPayload<T> {
  version: number
  data: T
}

interface ReadOptions<T> {
  /** Attempt recovery when the stored version differs (e.g. legacy shapes). */
  migrate?: (raw: unknown, storedVersion: number | undefined) => T | undefined
}

export function readCollection<T>(
  key: string,
  version: number,
  fallback: T,
  options: ReadOptions<T> = {},
): T {
  let raw: string | null = null
  try {
    raw = localStorage.getItem(key)
  } catch {
    return fallback
  }
  if (!raw) return fallback

  let parsed: unknown = null
  try {
    parsed = JSON.parse(raw)
  } catch {
    return fallback
  }
  if (!parsed || typeof parsed !== 'object') return fallback

  const envelope = parsed as Partial<VersionedPayload<T>>
  if (envelope.version === version && envelope.data !== undefined) {
    return envelope.data
  }
  const migrated =
    options.migrate?.(
      parsed,
      typeof envelope.version === 'number' ? envelope.version : undefined,
    ) ?? undefined
  return migrated ?? fallback
}

export function writeCollection<T>(key: string, version: number, data: T): void {
  try {
    const payload: VersionedPayload<T> = { version, data }
    localStorage.setItem(key, JSON.stringify(payload))
  } catch {
    // Quota or privacy mode: persistence is best-effort, never fatal.
  }
}

/**
 * Throwing twin of `writeCollection` for optimistic flows (§7 P1-8):
 * resolves after persisting, rejects when storage is unavailable so the
 * caller can roll the UI back instead of diverging silently.
 */
export async function persistCollection<T>(key: string, version: number, data: T): Promise<void> {
  try {
    const payload: VersionedPayload<T> = { version, data }
    localStorage.setItem(key, JSON.stringify(payload))
  } catch (error) {
    throw new Error(`Cannot persist ${key}: storage unavailable.`, { cause: error })
  }
}
