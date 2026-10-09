import type { NamedApiResource } from './list.dto.ts'

export interface DamageRelationsDto {
  double_damage_from: NamedApiResource[]
  half_damage_from: NamedApiResource[]
  no_damage_from: NamedApiResource[]
  double_damage_to: NamedApiResource[]
  half_damage_to: NamedApiResource[]
  no_damage_to: NamedApiResource[]
}

/** Minimal typing over `GET /api/v2/type/{name}` — roster + damage relations. */
export interface TypeDto {
  id: number
  name: string
  damage_relations: DamageRelationsDto
  pokemon: Array<{
    slot: number
    pokemon: NamedApiResource
  }>
}
