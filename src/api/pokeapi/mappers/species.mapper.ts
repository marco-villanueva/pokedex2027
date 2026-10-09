import { idFromUrl } from '../client.ts'
import { toDisplayName } from '../../../domain/pokemon/format.ts'
import type { PokemonSpeciesSummary } from '../../../domain/pokemon/types.ts'
import type { PokemonSpeciesDto } from '../dto/species.dto.ts'

const DEFAULT_LANGUAGE = 'en'

/**
 * Pick the most recent English flavor text, sanitised for display
 * (PokéAPI entries contain newlines / form-feeds / soft hyphens).
 */
export function pickDescription(
  dto: PokemonSpeciesDto,
  language = DEFAULT_LANGUAGE,
): string | undefined {
  const entries = dto.flavor_text_entries.filter((entry) => entry.language.name === language)
  if (entries.length === 0) return undefined
  const raw = entries[entries.length - 1]!.flavor_text
  return (
    raw
      .replace(/[\n\f\r]+/g, ' ')
      .replace(/­/g, '')
      .replace(/\s+/g, ' ')
      .trim() || undefined
  )
}

export function pickGenus(dto: PokemonSpeciesDto, language = DEFAULT_LANGUAGE): string | undefined {
  return dto.genera.find((genus) => genus.language.name === language)?.genus
}

export function evolutionChainId(dto: PokemonSpeciesDto): number | undefined {
  if (!dto.evolution_chain) return undefined
  return idFromUrl(dto.evolution_chain.url)
}

export function mapSpecies(dto: PokemonSpeciesDto): PokemonSpeciesSummary {
  return {
    id: dto.id,
    genus: pickGenus(dto),
    description: pickDescription(dto),
    generation: dto.generation?.name,
    isLegendary: dto.is_legendary,
    isMythical: dto.is_mythical,
    evolutionChainId: evolutionChainId(dto),
  }
}

/** Localised display name fallback: species names → pretty-printed slug. */
export function speciesDisplayName(dto: PokemonSpeciesDto, language = DEFAULT_LANGUAGE): string {
  const local = dto.names.find((entry) => entry.language.name === language)?.name
  return local ?? toDisplayName(dto.name)
}
