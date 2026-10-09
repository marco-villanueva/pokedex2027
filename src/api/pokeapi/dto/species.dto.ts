import type { NamedApiResource } from './list.dto.ts'

/** Minimal typing over `GET /api/v2/pokemon-species/{id}`. */
export interface PokemonSpeciesDto {
  id: number
  name: string
  genera: Array<{
    genus: string
    language: NamedApiResource
  }>
  flavor_text_entries: Array<{
    flavor_text: string
    language: NamedApiResource
    version: NamedApiResource
  }>
  generation: NamedApiResource | null
  evolution_chain: { url: string } | null
  is_legendary: boolean
  is_mythical: boolean
  names: Array<{
    name: string
    language: NamedApiResource
  }>
}
