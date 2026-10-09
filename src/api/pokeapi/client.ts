/**
 * Centralised PokéAPI HTTP client.
 *
 * All network access to https://pokeapi.co must flow through this module.
 * Visual components must never construct PokéAPI URLs directly.
 */

export const POKEAPI_BASE_URL = 'https://pokeapi.co/api/v2'

export type ApiErrorKind = 'network' | 'not-found' | 'service' | 'malformed' | 'unknown'

export class ApiError extends Error {
  readonly kind: ApiErrorKind
  readonly status?: number

  constructor(kind: ApiErrorKind, message: string, options?: { status?: number; cause?: unknown }) {
    super(message, options?.cause !== undefined ? { cause: options.cause } : undefined)
    this.name = 'ApiError'
    this.kind = kind
    this.status = options?.status
  }
}

/**
 * User-facing messages never expose raw URLs or payloads (§39). The URL
 * stays in code (and devtools) only.
 */
function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error
  if (error instanceof DOMException && error.name === 'AbortError') {
    return new ApiError('unknown', 'Request was cancelled before completing.', { cause: error })
  }
  if (error instanceof TypeError) {
    // Fetch throws TypeError on network failure.
    return new ApiError(
      'network',
      'Network error while loading archive data. Check your connection and retry.',
      {
        cause: error,
      },
    )
  }
  return new ApiError('unknown', 'Unexpected error while loading archive data.', { cause: error })
}

interface FetchJsonOptions {
  signal?: AbortSignal
}

/**
 * Fetch a JSON resource from PokéAPI and normalise errors.
 *
 * - 404 is terminal: never retry it (callers must configure TanStack Query accordingly).
 * - 5xx / 429 are transient service errors.
 * - Non-JSON payloads become `malformed` errors.
 */
export async function fetchJson<T>(path: string, options: FetchJsonOptions = {}): Promise<T> {
  const url = path.startsWith('http') ? path : `${POKEAPI_BASE_URL}${path}`
  let response: Response
  try {
    response = await fetch(url, { signal: options.signal })
  } catch (error) {
    throw toApiError(error)
  }

  if (response.status === 404) {
    throw new ApiError('not-found', 'Archive holds no entry at this address.', { status: 404 })
  }
  if (response.status === 429 || response.status >= 500) {
    throw new ApiError(
      'service',
      `PokéAPI is temporarily unavailable (status ${response.status}). Please retry.`,
      { status: response.status },
    )
  }
  if (!response.ok) {
    throw new ApiError('unknown', `Request failed with status ${response.status}.`, {
      status: response.status,
    })
  }

  try {
    return (await response.json()) as T
  } catch (error) {
    throw new ApiError('malformed', 'Received malformed archive data.', { cause: error })
  }
}

/** Extract the trailing numeric id from a PokéAPI resource URL. */
export function idFromUrl(url: string): number | undefined {
  const match = url.match(/\/(\d+)\/?$/)
  if (!match) return undefined
  const id = Number.parseInt(match[1] ?? '', 10)
  return Number.isFinite(id) ? id : undefined
}
