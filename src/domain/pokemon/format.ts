/** Domain formatting helpers — single source of truth for unit conversions and labels. */

export const STAT_LABELS: Record<string, string> = {
  hp: 'HP',
  attack: 'Attack',
  defense: 'Defense',
  'special-attack': 'Sp. Atk',
  'special-defense': 'Sp. Def',
  speed: 'Speed',
}

export function statLabel(name: string): string {
  return STAT_LABELS[name] ?? name
}

/** PokéAPI height is decimetres → metres. */
export function decimetersToMeters(decimeters: number): number {
  return decimeters / 10
}

/** PokéAPI weight is hectograms → kilograms. */
export function hectogramsToKilograms(hectograms: number): number {
  return hectograms / 10
}

export function formatHeight(meters: number): string {
  return `${meters.toFixed(1)} m`
}

export function formatWeight(kilograms: number): string {
  return `${kilograms.toFixed(1)} kg`
}

export function formatPokedexId(id: number): string {
  return `#${String(id).padStart(4, '0')}`
}

/** `mr-mime` → `Mr Mime`. */
export function toDisplayName(name: string): string {
  return name
    .split('-')
    .map((part) => (part.length > 0 ? part[0]!.toUpperCase() + part.slice(1) : part))
    .join(' ')
}

/** Generation slug (`generation-i`) → `Generation I`. */
export function generationLabel(generation?: string): string | undefined {
  if (!generation) return undefined
  const roman = generation.replace(/^generation-/, '').toUpperCase()
  return `Generation ${roman}`
}
