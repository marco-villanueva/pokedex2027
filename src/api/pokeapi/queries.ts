import { queryOptions, useQuery, useQueryClient } from '@tanstack/react-query'
import { ApiError } from './client.ts'
import {
  getAbility,
  getEvolutionChain,
  getPokemon,
  getPokemonIndex,
  getPokemonList,
  getPokemonSpecies,
  getType,
} from './endpoints/pokemon.ts'
import { mapPokemonIndex, mapTypeIds } from './mappers/catalog.mapper.ts'
import { mapAbilityDetail, mapDamageRelations } from './mappers/discovery.mapper.ts'
import type { AbilityDetail } from './mappers/discovery.mapper.ts'
import { mapEvolutionTree } from './mappers/evolution.mapper.ts'
import { mapPokemonDetails, mapPokemonSummary } from './mappers/pokemon.mapper.ts'
import { mapSpecies } from './mappers/species.mapper.ts'
import { pokemonKeys } from './query-keys.ts'
import type { IndexEntry } from './mappers/catalog.mapper.ts'
import type { EvolutionTree } from '../../domain/evolution/types.ts'
import type { PokemonDetails, PokemonSummary } from '../../domain/pokemon/types.ts'

/**
 * Reference data from PokéAPI is effectively static.
 * Long staleTime + long gcTime honour the API's caching guidance and keep
 * navigation instant. 404s never retry.
 */
const STATIC_STALE_TIME = 1000 * 60 * 60 * 24 // 24 h
const STATIC_GC_TIME = 1000 * 60 * 60 * 24 * 7 // 7 days

function shouldRetry(failureCount: number, error: unknown): boolean {
  if (error instanceof ApiError && (error.kind === 'not-found' || error.kind === 'malformed')) {
    return false
  }
  return failureCount < 2
}

export function pokemonListOptions(limit: number, offset: number) {
  return queryOptions({
    queryKey: pokemonKeys.list({ limit, offset }),
    queryFn: ({ signal }) => getPokemonList({ limit, offset, signal }),
    staleTime: STATIC_STALE_TIME,
    gcTime: STATIC_GC_TIME,
    retry: shouldRetry,
  })
}

/** Canonical species index: one request, cached for the session lifetime. */
export function pokemonIndexOptions() {
  return queryOptions({
    queryKey: pokemonKeys.index(),
    queryFn: async ({ signal }): Promise<IndexEntry[]> => {
      const list = await getPokemonIndex(signal)
      return mapPokemonIndex(list)
    },
    staleTime: STATIC_STALE_TIME,
    gcTime: STATIC_GC_TIME,
    retry: shouldRetry,
  })
}

/**
 * Shared type document: roster ids + damage relations from ONE request.
 * Consumers select their slice; the network fires once per type.
 */
export function typeDataOptions(typeName: string) {
  return queryOptions({
    queryKey: pokemonKeys.type(typeName),
    queryFn: async ({ signal }) => {
      const dto = await getType(typeName, signal)
      return { ids: mapTypeIds(dto), relations: mapDamageRelations(dto.damage_relations) }
    },
    staleTime: STATIC_STALE_TIME,
    gcTime: STATIC_GC_TIME,
    retry: shouldRetry,
  })
}

/** Type roster → canonical id list. Only fetched when a type filter is set. */
export function pokemonTypeOptions(typeName: string | undefined) {
  return queryOptions({
    ...typeDataOptions(typeName ?? 'none'),
    enabled: typeName !== undefined && typeName.length > 0,
    select: (data) => data.ids,
  })
}

export function pokemonSummaryOptions(idOrName: string | number) {
  return queryOptions({
    queryKey: pokemonKeys.detail(idOrName),
    queryFn: async ({ signal }): Promise<PokemonSummary> => {
      const dto = await getPokemon(idOrName, signal)
      return mapPokemonSummary(dto)
    },
    staleTime: STATIC_STALE_TIME,
    gcTime: STATIC_GC_TIME,
    retry: shouldRetry,
  })
}

export function pokemonDetailsOptions(idOrName: string | number) {
  return queryOptions({
    queryKey: [...pokemonKeys.detail(idOrName), 'full'] as const,
    queryFn: async ({ signal }): Promise<PokemonDetails> => {
      const [pokemonDto, speciesDto] = await Promise.all([
        getPokemon(idOrName, signal),
        getPokemonSpecies(idOrName, signal),
      ])
      return {
        ...mapPokemonDetails(pokemonDto),
        species: mapSpecies(speciesDto),
      }
    },
    staleTime: STATIC_STALE_TIME,
    gcTime: STATIC_GC_TIME,
    retry: shouldRetry,
  })
}

export function evolutionTreeOptions(chainId: number | undefined) {
  return queryOptions({
    queryKey: pokemonKeys.evolutionChain(chainId ?? -1),
    enabled: chainId != null && chainId > 0,
    queryFn: async ({ signal }): Promise<EvolutionTree> => {
      const dto = await getEvolutionChain(chainId as number, signal)
      return mapEvolutionTree(dto.id, dto.chain)
    },
    staleTime: STATIC_STALE_TIME,
    gcTime: STATIC_GC_TIME,
    retry: shouldRetry,
  })
}

export function usePokemonList(limit: number, offset: number) {
  return useQuery(pokemonListOptions(limit, offset))
}

export function usePokemonSummary(idOrName: string | number) {
  return useQuery(pokemonSummaryOptions(idOrName))
}

export function usePokemonDetails(idOrName: string | number) {
  return useQuery(pokemonDetailsOptions(idOrName))
}

export function useEvolutionTree(chainId: number | undefined) {
  return useQuery(evolutionTreeOptions(chainId))
}

/** Type relations for matchups (max 2 per dossier — shared document, no refetch). */
export function typeRelationsOptions(typeName: string) {
  return queryOptions({
    ...typeDataOptions(typeName),
    select: (data) => data.relations,
  })
}

/** Ability detail, fetched on demand when a dossier row expands. */
export function abilityDetailOptions(abilityName: string | undefined) {
  return queryOptions({
    queryKey: [...pokemonKeys.all, 'ability', abilityName ?? 'none'] as const,
    enabled: abilityName !== undefined && abilityName.length > 0,
    queryFn: async ({ signal }): Promise<AbilityDetail> => {
      const dto = await getAbility(abilityName as string, signal)
      return mapAbilityDetail(dto)
    },
    staleTime: STATIC_STALE_TIME,
    gcTime: STATIC_GC_TIME,
    retry: shouldRetry,
  })
}

/** Selective prefetch for hover/focus on cards — never mass crawling. */
export function usePrefetchPokemon() {
  const client = useQueryClient()
  return (idOrName: string | number) => {
    void client.prefetchQuery(pokemonDetailsOptions(idOrName))
  }
}
