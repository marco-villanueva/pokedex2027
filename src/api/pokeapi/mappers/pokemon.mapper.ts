import { idFromUrl } from '../client.ts'
import {
  decimetersToMeters,
  hectogramsToKilograms,
  toDisplayName,
} from '../../../domain/pokemon/format.ts'
import type {
  PokemonAbility,
  PokemonArtwork,
  PokemonDetails,
  PokemonStat,
  PokemonStatName,
  PokemonSummary,
  PokemonTypeRef,
} from '../../../domain/pokemon/types.ts'
import type { PokemonDto } from '../dto/pokemon.dto.ts'

const STAT_NAMES: ReadonlySet<string> = new Set([
  'hp',
  'attack',
  'defense',
  'special-attack',
  'special-defense',
  'speed',
])

function isStatName(value: string): value is PokemonStatName {
  return STAT_NAMES.has(value)
}

function undefinedIfEmpty(value: string | null | undefined): string | undefined {
  return value && value.length > 0 ? value : undefined
}

export function mapTypes(dto: PokemonDto): PokemonTypeRef[] {
  return [...dto.types]
    .sort((a, b) => a.slot - b.slot)
    .map((entry) => ({
      id: idFromUrl(entry.type.url),
      name: entry.type.name,
    }))
}

export function mapAbilities(dto: PokemonDto): PokemonAbility[] {
  return [...dto.abilities]
    .sort((a, b) => a.slot - b.slot)
    .map((entry) => ({
      name: entry.ability.name,
      displayName: toDisplayName(entry.ability.name),
      hidden: entry.is_hidden,
    }))
}

export function mapStats(dto: PokemonDto): PokemonStat[] {
  const mapped = dto.stats
    .filter((entry) => isStatName(entry.stat.name))
    .map((entry) => ({
      name: entry.stat.name as PokemonStatName,
      value: entry.base_stat,
    }))
  // Preserve canonical stat order regardless of API ordering.
  const order: PokemonStatName[] = [
    'hp',
    'attack',
    'defense',
    'special-attack',
    'special-defense',
    'speed',
  ]
  return order.flatMap((name) => mapped.filter((stat) => stat.name === name))
}

export function mapArtwork(dto: PokemonDto): PokemonArtwork {
  const other = dto.sprites.other
  return {
    official: undefinedIfEmpty(other?.['official-artwork']?.front_default),
    officialShiny: undefinedIfEmpty(other?.['official-artwork']?.front_shiny),
    home: undefinedIfEmpty(other?.home?.front_default),
    homeShiny: undefinedIfEmpty(other?.home?.front_shiny),
    dreamWorld: undefinedIfEmpty(other?.dream_world?.front_default),
    spriteFront: undefinedIfEmpty(dto.sprites.front_default),
    spriteFrontShiny: undefinedIfEmpty(dto.sprites.front_shiny),
    spriteBack: undefinedIfEmpty(dto.sprites.back_default),
    spriteBackShiny: undefinedIfEmpty(dto.sprites.back_shiny),
    showdown: undefinedIfEmpty(other?.showdown?.front_default),
    showdownShiny: undefinedIfEmpty(other?.showdown?.front_shiny),
  }
}

/** Full Pokémon detail mapper: DTO → domain. */
export function mapPokemonDetails(dto: PokemonDto): Omit<PokemonDetails, 'species'> {
  return {
    id: dto.id,
    name: dto.name,
    displayName: toDisplayName(dto.name),
    artwork: mapArtwork(dto),
    types: mapTypes(dto),
    abilities: mapAbilities(dto),
    stats: mapStats(dto),
    heightMeters: decimetersToMeters(dto.height),
    weightKilograms: hectogramsToKilograms(dto.weight),
  }
}

/** Lightweight card mapper for Explorer results. */
export function mapPokemonSummary(dto: PokemonDto): PokemonSummary {
  const artwork = mapArtwork(dto)
  return {
    id: dto.id,
    name: dto.name,
    displayName: toDisplayName(dto.name),
    types: mapTypes(dto),
    artwork: {
      official: artwork.official,
      officialShiny: artwork.officialShiny,
      home: artwork.home,
      sprite: artwork.spriteFront,
    },
  }
}
