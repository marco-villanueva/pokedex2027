/**
 * Canonical generation roster. Species ids are stable PokéAPI data, so ranges
 * replace a `/generation` round-trip for filtering (see D-015).
 */
export interface GenerationInfo {
  id: number
  label: string
  from: number
  to: number
}

export const GENERATIONS: GenerationInfo[] = [
  { id: 1, label: 'Kanto', from: 1, to: 151 },
  { id: 2, label: 'Johto', from: 152, to: 251 },
  { id: 3, label: 'Hoenn', from: 252, to: 386 },
  { id: 4, label: 'Sinnoh', from: 387, to: 493 },
  { id: 5, label: 'Unova', from: 494, to: 649 },
  { id: 6, label: 'Kalos', from: 650, to: 721 },
  { id: 7, label: 'Alola', from: 722, to: 809 },
  { id: 8, label: 'Galar', from: 810, to: 905 },
  { id: 9, label: 'Paldea', from: 906, to: 1025 },
]

/** Highest canonical species id in the explorer index (forms excluded). */
export const MAX_CANONICAL_ID = 1025

export function generationForId(id: number): GenerationInfo | undefined {
  return GENERATIONS.find((gen) => id >= gen.from && id <= gen.to)
}

const ROMAN_TO_ID: Record<string, number> = {
  i: 1,
  ii: 2,
  iii: 3,
  iv: 4,
  v: 5,
  vi: 6,
  vii: 7,
  viii: 8,
  ix: 9,
}

/** Species `generation` slug (`generation-i`) → numeric id for explorer links. */
export function generationIdFor(slug: string | undefined): number | undefined {
  if (!slug) return undefined
  return ROMAN_TO_ID[slug.replace(/^generation-/, '').toLowerCase()]
}
