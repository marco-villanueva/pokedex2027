import type { EvolutionChainDto } from '@/api/pokeapi/dto/evolution.dto.ts'
import type { PokemonDto } from '@/api/pokeapi/dto/pokemon.dto.ts'
import type { PokemonSpeciesDto } from '@/api/pokeapi/dto/species.dto.ts'

const resource = (name: string, id: number) => ({ name, url: `https://pokeapi.co/api/v2/x/${id}/` })

/** Bulbasaur: dual type, full artwork set, six unordered stats. */
export const bulbasaurDto: PokemonDto = {
  id: 1,
  name: 'bulbasaur',
  height: 7,
  weight: 69,
  types: [
    { slot: 2, type: resource('poison', 4) },
    { slot: 1, type: resource('grass', 12) },
  ],
  abilities: [
    { slot: 1, is_hidden: false, ability: resource('overgrow', 65) },
    { slot: 3, is_hidden: true, ability: resource('chlorophyll', 34) },
  ],
  stats: [
    { base_stat: 49, stat: resource('attack', 2) },
    { base_stat: 45, stat: resource('hp', 1) },
    { base_stat: 65, stat: resource('special-attack', 4) },
    { base_stat: 65, stat: resource('special-defense', 5) },
    { base_stat: 49, stat: resource('defense', 3) },
    { base_stat: 45, stat: resource('speed', 6) },
  ],
  sprites: {
    front_default: 'https://example.com/sprite/1.png',
    front_shiny: 'https://example.com/sprite-shiny/1.png',
    back_default: null,
    back_shiny: null,
    other: {
      'official-artwork': {
        front_default: 'https://example.com/official/1.png',
        front_shiny: 'https://example.com/official-shiny/1.png',
      },
      home: { front_default: 'https://example.com/home/1.png', front_shiny: null },
      dream_world: { front_default: null },
    },
  },
}

/** Ditto-like: no usable artwork anywhere — placeholder path. */
export const missingArtworkDto: PokemonDto = {
  ...bulbasaurDto,
  id: 132,
  name: 'dito',
  sprites: {
    front_default: null,
    front_shiny: null,
    back_default: null,
    back_shiny: null,
    other: {},
  },
}

export const bulbasaurSpecies: PokemonSpeciesDto = {
  id: 1,
  name: 'bulbasaur',
  genera: [{ genus: 'Seed Pokémon', language: resource('en', 9) }],
  flavor_text_entries: [
    {
      flavor_text: 'A strange seed was\nplanted on its\fback at birth.',
      language: resource('en', 9),
      version: resource('red', 1),
    },
    {
      flavor_text: 'It can go for days\nwithout eating a single morsel.',
      language: resource('en', 9),
      version: resource('blue', 2),
    },
    {
      flavor_text: 'Semilla extraña.',
      language: resource('es', 7),
      version: resource('red', 1),
    },
  ],
  generation: resource('generation-i', 1),
  evolution_chain: { url: 'https://pokeapi.co/api/v2/evolution-chain/1/' },
  is_legendary: false,
  is_mythical: false,
  names: [{ name: 'Bulbasaur', language: resource('en', 9) }],
}

/** Eevee-like branching chain: one root, three children with distinct triggers. */
export const branchingChain: EvolutionChainDto = {
  id: 67,
  chain: {
    species: resource('eevee', 133),
    evolution_details: [],
    evolves_to: [
      {
        species: resource('vaporeon', 134),
        evolution_details: [
          {
            min_level: null,
            trigger: resource('use-item', 3),
            item: resource('water-stone', 82),
            held_item: null,
            known_move: null,
            known_move_type: null,
            location: null,
            min_happiness: null,
            min_beauty: null,
            min_affection: null,
            time_of_day: '',
            gender: null,
            needs_overworld_rain: false,
            turn_upside_down: false,
            relative_physical_stats: null,
            party_species: null,
            party_type: null,
            trade_species: null,
          },
        ],
        evolves_to: [],
      },
      {
        species: resource('jolteon', 135),
        evolution_details: [
          {
            min_level: null,
            trigger: resource('use-item', 3),
            item: resource('thunder-stone', 83),
            held_item: null,
            known_move: null,
            known_move_type: null,
            location: null,
            min_happiness: null,
            min_beauty: null,
            min_affection: null,
            time_of_day: '',
            gender: null,
            needs_overworld_rain: false,
            turn_upside_down: false,
            relative_physical_stats: null,
            party_species: null,
            party_type: null,
            trade_species: null,
          },
        ],
        evolves_to: [],
      },
      {
        species: resource('espeon', 196),
        evolution_details: [
          {
            min_level: null,
            trigger: resource('level-up', 1),
            item: null,
            held_item: null,
            known_move: null,
            known_move_type: null,
            location: null,
            min_happiness: 220,
            min_beauty: null,
            min_affection: null,
            time_of_day: 'day',
            gender: null,
            needs_overworld_rain: false,
            turn_upside_down: false,
            relative_physical_stats: null,
            party_species: null,
            party_type: null,
            trade_species: null,
          },
        ],
        evolves_to: [],
      },
    ],
  },
}
