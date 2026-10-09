import { idFromUrl } from '@/api/pokeapi/client.ts'
import type { PaginatedList } from '@/api/pokeapi/dto/list.dto.ts'
import type { TypeDto } from '@/api/pokeapi/dto/type.dto.ts'
import { MAX_CANONICAL_ID } from '@/domain/explorer/generations.ts'

export interface IndexEntry {
  id: number
  name: string
}

/**
 * Full `/pokemon` list → canonical species index (forms with ids > 1025
 * excluded; the explorer browses species, forms arrive with detail views).
 */
export function mapPokemonIndex(list: PaginatedList): IndexEntry[] {
  const entries: IndexEntry[] = []
  for (const result of list.results) {
    const id = idFromUrl(result.url)
    if (id === undefined || id > MAX_CANONICAL_ID) continue
    entries.push({ id, name: result.name })
  }
  return entries.sort((a, b) => a.id - b.id)
}

/** `/type` roster → canonical species id set (sorted). */
export function mapTypeIds(dto: TypeDto): number[] {
  const ids = new Set<number>()
  for (const entry of dto.pokemon) {
    const id = idFromUrl(entry.pokemon.url)
    if (id !== undefined && id <= MAX_CANONICAL_ID) ids.add(id)
  }
  return [...ids].sort((a, b) => a - b)
}
