import type { NamedApiResource } from './list.dto.ts'

export interface EvolutionDetailDto {
  min_level: number | null
  trigger: NamedApiResource | null
  item: NamedApiResource | null
  held_item: NamedApiResource | null
  known_move: NamedApiResource | null
  known_move_type: NamedApiResource | null
  location: NamedApiResource | null
  min_happiness: number | null
  min_beauty: number | null
  min_affection: number | null
  time_of_day: string
  gender: number | null
  needs_overworld_rain: boolean
  turn_upside_down: boolean
  relative_physical_stats: number | null
  party_species: NamedApiResource | null
  party_type: NamedApiResource | null
  trade_species: NamedApiResource | null
}

export interface EvolutionChainLinkDto {
  species: NamedApiResource
  evolution_details: EvolutionDetailDto[]
  evolves_to: EvolutionChainLinkDto[]
}

/** Minimal typing over `GET /api/v2/evolution-chain/{id}`. */
export interface EvolutionChainDto {
  id: number
  chain: EvolutionChainLinkDto
}
