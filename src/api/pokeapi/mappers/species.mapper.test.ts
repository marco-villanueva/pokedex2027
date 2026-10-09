import { describe, expect, it } from 'vitest'
import {
  evolutionChainId,
  mapSpecies,
  pickDescription,
  pickGenus,
} from '@/api/pokeapi/mappers/species.mapper.ts'
import { bulbasaurSpecies } from '@/tests/fixtures.ts'

describe('pickDescription', () => {
  it('takes the latest English entry and sanitises whitespace', () => {
    expect(pickDescription(bulbasaurSpecies)).toBe(
      'It can go for days without eating a single morsel.',
    )
  })

  it('returns undefined when the language is absent', () => {
    expect(pickDescription(bulbasaurSpecies, 'ja')).toBeUndefined()
  })
})

describe('pickGenus', () => {
  it('resolves the English genus', () => {
    expect(pickGenus(bulbasaurSpecies)).toBe('Seed Pokémon')
  })
})

describe('evolutionChainId', () => {
  it('extracts the chain id from the resource url', () => {
    expect(evolutionChainId(bulbasaurSpecies)).toBe(1)
  })
})

describe('mapSpecies', () => {
  it('maps flags, generation and description', () => {
    expect(mapSpecies(bulbasaurSpecies)).toEqual({
      id: 1,
      genus: 'Seed Pokémon',
      description: 'It can go for days without eating a single morsel.',
      generation: 'generation-i',
      isLegendary: false,
      isMythical: false,
      evolutionChainId: 1,
    })
  })
})
