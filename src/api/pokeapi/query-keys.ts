/**
 * Centralised TanStack Query keys. Every PokéAPI query must derive from here
 * so caching, prefetch and invalidation stay consistent.
 */
export const pokemonKeys = {
  all: ['pokemon'] as const,
  lists: () => [...pokemonKeys.all, 'list'] as const,
  list: (params: { limit: number; offset: number }) => [...pokemonKeys.lists(), params] as const,
  index: () => [...pokemonKeys.all, 'index'] as const,
  types: () => [...pokemonKeys.all, 'type'] as const,
  type: (name: string) => [...pokemonKeys.types(), name.toLowerCase()] as const,
  details: () => [...pokemonKeys.all, 'detail'] as const,
  detail: (idOrName: string | number) =>
    [...pokemonKeys.details(), String(idOrName).toLowerCase()] as const,
  species: (idOrName: string | number) =>
    [...pokemonKeys.all, 'species', String(idOrName).toLowerCase()] as const,
  evolutionChain: (id: number) => [...pokemonKeys.all, 'evolution-chain', id] as const,
}
