/**
 * Stable domain models for Pokémon entities.
 *
 * UI layers consume these — never raw PokéAPI DTOs.
 * See `docs/DATA_MODEL.md`.
 */

export interface PokemonTypeRef {
  id?: number
  name: string
}

export interface PokemonArtworkSummary {
  official?: string
  officialShiny?: string
  home?: string
  sprite?: string
}

export interface PokemonSummary {
  id: number
  name: string
  displayName: string
  types: PokemonTypeRef[]
  artwork: PokemonArtworkSummary
}

export type PokemonStatName =
  'hp' | 'attack' | 'defense' | 'special-attack' | 'special-defense' | 'speed'

export interface PokemonStat {
  name: PokemonStatName
  value: number
}

export interface PokemonAbility {
  name: string
  displayName: string
  hidden: boolean
}

export interface PokemonArtwork {
  official?: string
  officialShiny?: string
  home?: string
  homeShiny?: string
  dreamWorld?: string
  spriteFront?: string
  spriteFrontShiny?: string
  spriteBack?: string
  spriteBackShiny?: string
  showdown?: string
  showdownShiny?: string
}

export interface PokemonSpeciesSummary {
  id: number
  genus?: string
  description?: string
  generation?: string
  isLegendary: boolean
  isMythical: boolean
  evolutionChainId?: number
}

export interface PokemonDetails {
  id: number
  name: string
  displayName: string
  artwork: PokemonArtwork
  types: PokemonTypeRef[]
  abilities: PokemonAbility[]
  stats: PokemonStat[]
  heightMeters: number
  weightKilograms: number
  species: PokemonSpeciesSummary
}

/** Sum of all base stats — used for compare and team insights. */
export function totalBaseStats(stats: PokemonStat[]): number {
  return stats.reduce((sum, stat) => sum + stat.value, 0)
}

/**
 * Preferred hero artwork fallback order:
 * official → home → dreamWorld → sprite.
 * Returns `undefined` when nothing usable exists so callers render a placeholder.
 */
export function heroArtwork(
  pokemon: Pick<PokemonDetails, 'artwork'>,
  shiny = false,
): string | undefined {
  const art = pokemon.artwork
  if (shiny) {
    return (
      art.officialShiny ??
      art.homeShiny ??
      art.showdownShiny ??
      art.spriteFrontShiny ??
      heroArtwork(pokemon, false)
    )
  }
  return art.official ?? art.home ?? art.dreamWorld ?? art.spriteFront
}

/** Gallery sprite entry with a stable human label. */
export interface GallerySprite {
  key: string
  label: string
  url: string
}

/**
 * Sprite matrix for the dossier gallery, honouring the shiny toggle.
 * Sources without a usable image are omitted — never rendered broken.
 */
export function gallerySprites(
  pokemon: Pick<PokemonDetails, 'artwork' | 'displayName'>,
  shiny = false,
): GallerySprite[] {
  const art = pokemon.artwork
  const pick = (normal?: string, variant?: string): string | undefined =>
    shiny ? (variant ?? normal) : normal
  const candidates: Array<{ key: string; label: string; url?: string }> = [
    { key: 'front', label: 'Front', url: pick(art.spriteFront, art.spriteFrontShiny) },
    { key: 'back', label: 'Back', url: pick(art.spriteBack, art.spriteBackShiny) },
    { key: 'home', label: 'HOME', url: pick(art.home, art.homeShiny) },
    { key: 'dream', label: 'Dream World', url: art.dreamWorld },
    { key: 'showdown', label: 'Showdown', url: pick(art.showdown, art.showdownShiny) },
    { key: 'official', label: 'Official', url: pick(art.official, art.officialShiny) },
  ]
  return candidates.flatMap((entry) =>
    entry.url ? [{ key: entry.key, label: entry.label, url: entry.url }] : [],
  )
}
