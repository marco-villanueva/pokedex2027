import { describe, expect, it } from 'vitest'
import { mapPokemonIndex, mapTypeIds } from '@/api/pokeapi/mappers/catalog.mapper.ts'
import type { PaginatedList } from '@/api/pokeapi/dto/list.dto.ts'
import type { TypeDto } from '@/api/pokeapi/dto/type.dto.ts'

const resource = (name: string, id: number) => ({ name, url: `https://pokeapi.co/api/v2/x/${id}/` })

describe('mapPokemonIndex', () => {
  it('keeps canonical species sorted and drops forms', () => {
    const list: PaginatedList = {
      count: 4,
      next: null,
      previous: null,
      results: [
        { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
        { name: 'deoxys-attack', url: 'https://pokeapi.co/api/v2/pokemon/10001/' },
        { name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/25/' },
        { name: 'sprigatito', url: 'https://pokeapi.co/api/v2/pokemon/906/' },
      ],
    }
    expect(mapPokemonIndex(list)).toEqual([
      { id: 1, name: 'bulbasaur' },
      { id: 25, name: 'pikachu' },
      { id: 906, name: 'sprigatito' },
    ])
  })
})

describe('mapTypeIds', () => {
  it('returns a sorted canonical id set', () => {
    const dto: TypeDto = {
      id: 10,
      name: 'fire',
      damage_relations: {
        double_damage_from: [],
        half_damage_from: [],
        no_damage_from: [],
        double_damage_to: [],
        half_damage_to: [],
        no_damage_to: [],
      },
      pokemon: [
        { slot: 1, pokemon: resource('charizard', 6) },
        { slot: 1, pokemon: resource('charmander', 4) },
        { slot: 1, pokemon: resource('charizard-mega-x', 10033) },
      ],
    }
    expect(mapTypeIds(dto)).toEqual([4, 6])
  })
})
