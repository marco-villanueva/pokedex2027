import { fetchJson } from '../client.ts'
import type { AbilityDto } from '../dto/ability.dto.ts'
import type { EvolutionChainDto } from '../dto/evolution.dto.ts'
import type { PaginatedList } from '../dto/list.dto.ts'
import type { PokemonDto } from '../dto/pokemon.dto.ts'
import type { PokemonSpeciesDto } from '../dto/species.dto.ts'
import type { TypeDto } from '../dto/type.dto.ts'

interface GetListOptions {
  limit?: number
  offset?: number
  signal?: AbortSignal
}

/** `GET /api/v2/pokemon?limit=&offset=` — paginated index of Pokémon resources. */
export function getPokemonList(options: GetListOptions = {}): Promise<PaginatedList> {
  const { limit = 30, offset = 0, signal } = options
  return fetchJson<PaginatedList>(`/pokemon?limit=${limit}&offset=${offset}`, { signal })
}

/**
 * `GET /api/v2/pokemon?limit=2000` — full canonical index in ONE request.
 * Callers filter to species ids ≤ 1025; details load per visible window only.
 */
export function getPokemonIndex(signal?: AbortSignal): Promise<PaginatedList> {
  return fetchJson<PaginatedList>('/pokemon?limit=2000', { signal })
}

/** `GET /api/v2/type/{name}` — roster of Pokémon carrying the type. */
export function getType(name: string, signal?: AbortSignal): Promise<TypeDto> {
  return fetchJson<TypeDto>(`/type/${name.toLowerCase()}`, { signal })
}

/** `GET /api/v2/pokemon/{idOrName}` */
export function getPokemon(idOrName: string | number, signal?: AbortSignal): Promise<PokemonDto> {
  return fetchJson<PokemonDto>(`/pokemon/${String(idOrName).toLowerCase()}`, { signal })
}

/** `GET /api/v2/pokemon-species/{idOrName}` */
export function getPokemonSpecies(
  idOrName: string | number,
  signal?: AbortSignal,
): Promise<PokemonSpeciesDto> {
  return fetchJson<PokemonSpeciesDto>(`/pokemon-species/${String(idOrName).toLowerCase()}`, {
    signal,
  })
}

/** `GET /api/v2/evolution-chain/{id}` */
export function getEvolutionChain(id: number, signal?: AbortSignal): Promise<EvolutionChainDto> {
  return fetchJson<EvolutionChainDto>(`/evolution-chain/${id}`, { signal })
}

/** `GET /api/v2/ability/{name}` — loaded on demand for ability details. */
export function getAbility(name: string, signal?: AbortSignal): Promise<AbilityDto> {
  return fetchJson<AbilityDto>(`/ability/${name.toLowerCase()}`, { signal })
}
