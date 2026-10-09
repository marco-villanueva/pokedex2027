import type { NamedApiResource } from './list.dto.ts'

/** Minimal typing over `GET /api/v2/ability/{name}` — English effect only. */
export interface AbilityDto {
  id: number
  name: string
  effect_entries: Array<{
    effect: string
    short_effect: string
    language: NamedApiResource
  }>
}
