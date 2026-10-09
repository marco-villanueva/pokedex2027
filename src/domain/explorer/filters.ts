import { GENERATIONS } from './generations.ts'

export type ExplorerSort = 'id-asc' | 'id-desc' | 'name-asc' | 'name-desc'

export interface ExplorerFilters {
  query: string
  type: string | undefined
  generation: number | undefined
  sort: ExplorerSort
}

export const DEFAULT_FILTERS: ExplorerFilters = {
  query: '',
  type: undefined,
  generation: undefined,
  sort: 'id-asc',
}

export const SORT_OPTIONS: Array<{ value: ExplorerSort; label: string }> = [
  { value: 'id-asc', label: 'Number ↑' },
  { value: 'id-desc', label: 'Number ↓' },
  { value: 'name-asc', label: 'Name A–Z' },
  { value: 'name-desc', label: 'Name Z–A' },
]

/** Types offered in the explorer filter rail (battle types; shadow/unknown excluded). */
export const FILTERABLE_TYPES = [
  'normal',
  'fire',
  'water',
  'electric',
  'grass',
  'ice',
  'fighting',
  'poison',
  'ground',
  'flying',
  'psychic',
  'bug',
  'rock',
  'ghost',
  'dragon',
  'dark',
  'steel',
  'fairy',
]

/** Parse `?q=&type=&generation=&sort=` into validated filters. */
export function parseExplorerParams(params: URLSearchParams): ExplorerFilters {
  const sortParam = params.get('sort')
  const sort: ExplorerSort =
    sortParam === 'id-desc' || sortParam === 'name-asc' || sortParam === 'name-desc'
      ? sortParam
      : 'id-asc'

  const generationParam = Number.parseInt(params.get('generation') ?? '', 10)
  const generation = GENERATIONS.some((gen) => gen.id === generationParam)
    ? generationParam
    : undefined

  const typeParam = params.get('type')?.toLowerCase()
  const type = typeParam && FILTERABLE_TYPES.includes(typeParam) ? typeParam : undefined

  return {
    query: params.get('q')?.slice(0, 60) ?? '',
    type,
    generation,
    sort,
  }
}

/** Serialize filters back to shareable URL params (defaults omitted). */
export function serializeExplorerParams(filters: ExplorerFilters): URLSearchParams {
  const params = new URLSearchParams()
  if (filters.query.trim()) params.set('q', filters.query.trim())
  if (filters.type) params.set('type', filters.type)
  if (filters.generation !== undefined) params.set('generation', String(filters.generation))
  if (filters.sort !== 'id-asc') params.set('sort', filters.sort)
  return params
}

export interface FilterableEntry {
  id: number
  name: string
}

/**
 * Pure filter + sort over the canonical index. Type membership comes from
 * the (already fetched) type roster; everything else is local and instant.
 *
 * Name matching ignores separators so human spellings ("mr mime",
 * "farfetch'd") hit API slugs ("mr-mime", "farfetchd").
 */
/**
 * Separator-insensitive name comparison for human spellings
 * ("mr mime", "farfetch'd") against API slugs ("mr-mime", "farfetchd").
 */
export function squashName(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, '')
}

export function applyExplorerFilters(
  index: FilterableEntry[],
  filters: ExplorerFilters,
  typeIds?: Set<number>,
): FilterableEntry[] {
  const query = filters.query.trim().toLowerCase().replace(/^#/, '')
  const squashed = squashName(query)
  const generation = GENERATIONS.find((gen) => gen.id === filters.generation)

  const filtered = index.filter((entry) => {
    if (generation && (entry.id < generation.from || entry.id > generation.to)) return false
    if (typeIds && !typeIds.has(entry.id)) return false
    if (
      query.length > 0 &&
      !entry.name.includes(query) &&
      !squashName(entry.name).includes(squashed) &&
      String(entry.id) !== query
    ) {
      return false
    }
    return true
  })

  switch (filters.sort) {
    case 'id-desc':
      return filtered.sort((a, b) => b.id - a.id)
    case 'name-asc':
      return filtered.sort((a, b) => a.name.localeCompare(b.name))
    case 'name-desc':
      return filtered.sort((a, b) => b.name.localeCompare(a.name))
    case 'id-asc':
    default:
      return filtered.sort((a, b) => a.id - b.id)
  }
}
