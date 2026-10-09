import { describe, expect, it } from 'vitest'
import {
  mapAbilities,
  mapArtwork,
  mapPokemonDetails,
  mapPokemonSummary,
  mapStats,
  mapTypes,
} from '@/api/pokeapi/mappers/pokemon.mapper.ts'
import { bulbasaurDto, missingArtworkDto } from '@/tests/fixtures.ts'

describe('mapTypes', () => {
  it('orders by slot and resolves ids from urls', () => {
    expect(mapTypes(bulbasaurDto)).toEqual([
      { id: 12, name: 'grass' },
      { id: 4, name: 'poison' },
    ])
  })
})

describe('mapAbilities', () => {
  it('marks hidden abilities and prettifies names', () => {
    expect(mapAbilities(bulbasaurDto)).toEqual([
      { name: 'overgrow', displayName: 'Overgrow', hidden: false },
      { name: 'chlorophyll', displayName: 'Chlorophyll', hidden: true },
    ])
  })
})

describe('mapStats', () => {
  it('returns canonical stat order with values', () => {
    expect(mapStats(bulbasaurDto).map((stat) => stat.name)).toEqual([
      'hp',
      'attack',
      'defense',
      'special-attack',
      'special-defense',
      'speed',
    ])
    expect(mapStats(bulbasaurDto).find((stat) => stat.name === 'hp')).toEqual({
      name: 'hp',
      value: 45,
    })
  })
})

describe('mapArtwork', () => {
  it('resolves preferred sources and tolerates absence', () => {
    const art = mapArtwork(bulbasaurDto)
    expect(art.official).toBe('https://example.com/official/1.png')
    expect(art.officialShiny).toBe('https://example.com/official-shiny/1.png')
    expect(art.home).toBe('https://example.com/home/1.png')
    expect(art.dreamWorld).toBeUndefined()
    expect(art.spriteFrontShiny).toBe('https://example.com/sprite-shiny/1.png')
    expect(mapArtwork(missingArtworkDto)).toEqual({
      official: undefined,
      officialShiny: undefined,
      home: undefined,
      homeShiny: undefined,
      dreamWorld: undefined,
      spriteFront: undefined,
      spriteFrontShiny: undefined,
      spriteBack: undefined,
      spriteBackShiny: undefined,
      showdown: undefined,
      showdownShiny: undefined,
    })
  })
})

describe('mapPokemonDetails', () => {
  it('converts units and display names', () => {
    const details = mapPokemonDetails(bulbasaurDto)
    expect(details.id).toBe(1)
    expect(details.displayName).toBe('Bulbasaur')
    expect(details.heightMeters).toBeCloseTo(0.7)
    expect(details.weightKilograms).toBeCloseTo(6.9)
  })
})

describe('mapPokemonSummary', () => {
  it('carries the artwork fallback chain for cards', () => {
    const summary = mapPokemonSummary(bulbasaurDto)
    expect(summary.artwork.official).toBe('https://example.com/official/1.png')
    expect(summary.artwork.sprite).toBe('https://example.com/sprite/1.png')
  })
})
