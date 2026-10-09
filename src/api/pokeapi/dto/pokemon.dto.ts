import type { NamedApiResource } from './list.dto.ts'

/** Minimal typing over `GET /api/v2/pokemon/{id}` — only fields consumed by mappers. */
export interface PokemonDto {
  id: number
  name: string
  height: number
  weight: number
  types: Array<{
    slot: number
    type: NamedApiResource
  }>
  abilities: Array<{
    slot: number
    is_hidden: boolean
    ability: NamedApiResource
  }>
  stats: Array<{
    base_stat: number
    stat: NamedApiResource
  }>
  sprites: {
    front_default: string | null
    front_shiny: string | null
    back_default: string | null
    back_shiny: string | null
    other?: {
      dream_world?: { front_default: string | null }
      home?: { front_default: string | null; front_shiny: string | null }
      'official-artwork'?: { front_default: string | null; front_shiny: string | null }
      showdown?: { front_default: string | null; front_shiny: string | null }
    }
  }
}
