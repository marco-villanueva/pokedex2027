import { describe, expect, it } from 'vitest'
import { mapAbilityDetail, mapDamageRelations } from '@/api/pokeapi/mappers/discovery.mapper.ts'
import { combineEffectiveness, formatMultiplier } from '@/domain/type/effectiveness.ts'

const charizardRelations = [
  {
    doubleFrom: ['water', 'electric', 'rock'],
    halfFrom: ['fire', 'fighting', 'steel', 'fairy', 'grass', 'bug'],
    noFrom: ['ground'],
  },
  {
    doubleFrom: ['electric', 'ice', 'rock'],
    halfFrom: ['fighting', 'fire', 'grass', 'bug'],
    noFrom: ['ground'],
  },
]

describe('combineEffectiveness', () => {
  it('multiplies dual-type matchups (Charizard: 4× rock, immune ground)', () => {
    const result = combineEffectiveness(charizardRelations)
    expect(result.weak.find((entry) => entry.type === 'rock')).toEqual({
      type: 'rock',
      multiplier: 4,
    })
    expect(result.weak.find((entry) => entry.type === 'water')).toEqual({
      type: 'water',
      multiplier: 2,
    })
    expect(result.immune).toEqual([{ type: 'ground', multiplier: 0 }])
    // Fighting appears in both half lists → ¼×.
    expect(result.resist.find((entry) => entry.type === 'fighting')).toEqual({
      type: 'fighting',
      multiplier: 0.25,
    })
    // Neutral (1×) types are omitted entirely.
    expect(result.weak.find((entry) => entry.type === 'normal')).toBeUndefined()
  })

  it('handles single types', () => {
    const result = combineEffectiveness([
      {
        doubleFrom: ['fire', 'ice', 'poison', 'flying', 'bug'],
        halfFrom: ['water', 'electric', 'grass', 'ground'],
        noFrom: [],
      },
    ])
    expect(result.weak).toHaveLength(5)
    expect(result.immune).toHaveLength(0)
  })
})

describe('formatMultiplier', () => {
  it('renders vulgar fractions for reductions', () => {
    expect(formatMultiplier(4)).toBe('4×')
    expect(formatMultiplier(2)).toBe('2×')
    expect(formatMultiplier(0.5)).toBe('½×')
    expect(formatMultiplier(0.25)).toBe('¼×')
    expect(formatMultiplier(0)).toBe('0×')
  })
})

describe('mapDamageRelations', () => {
  it('projects DTO relations to domain names', () => {
    const resource = (name: string) => ({ name, url: `https://pokeapi.co/api/v2/type/1/` })
    expect(
      mapDamageRelations({
        double_damage_from: [resource('water')],
        half_damage_from: [resource('fire')],
        no_damage_from: [resource('ground')],
        double_damage_to: [],
        half_damage_to: [],
        no_damage_to: [],
      }),
    ).toEqual({ doubleFrom: ['water'], halfFrom: ['fire'], noFrom: ['ground'] })
  })
})

describe('mapAbilityDetail', () => {
  it('picks the English short effect and prettifies the name', () => {
    const resource = (name: string) => ({ name, url: `https://pokeapi.co/api/v2/x/1/` })
    expect(
      mapAbilityDetail({
        id: 66,
        name: 'blaze',
        effect_entries: [
          { effect: 'Largo', short_effect: 'Corto', language: resource('es') },
          {
            effect: 'Powers up Fire-type moves when the Pokémon is in trouble.',
            short_effect: 'Powers up Fire-type moves in a pinch.',
            language: resource('en'),
          },
        ],
      }),
    ).toEqual({
      name: 'blaze',
      displayName: 'Blaze',
      shortEffect: 'Powers up Fire-type moves in a pinch.',
    })
  })

  it('tolerates missing English text', () => {
    expect(mapAbilityDetail({ id: 1, name: 'stench', effect_entries: [] })).toEqual({
      name: 'stench',
      displayName: 'Stench',
      shortEffect: undefined,
    })
  })
})
