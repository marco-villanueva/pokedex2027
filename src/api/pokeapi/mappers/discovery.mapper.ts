import { toDisplayName } from '../../../domain/pokemon/format.ts'
import type { AbilityDto } from '../dto/ability.dto.ts'
import type { DamageRelationsDto } from '../dto/type.dto.ts'
import type { TypeRelations } from '../../../domain/type/effectiveness.ts'

export interface AbilityDetail {
  name: string
  displayName: string
  shortEffect?: string
}

/** English short effect (battle-relevant summary); tolerates absence. */
export function mapAbilityDetail(dto: AbilityDto): AbilityDetail {
  const entry = dto.effect_entries.find((item) => item.language.name === 'en')
  return {
    name: dto.name,
    displayName: toDisplayName(dto.name),
    shortEffect: entry?.short_effect.replace(/\s+/g, ' ').trim() || undefined,
  }
}

export function mapDamageRelations(dto: DamageRelationsDto): TypeRelations {
  const names = (list: { name: string }[]): string[] => list.map((item) => item.name)
  return {
    doubleFrom: names(dto.double_damage_from),
    halfFrom: names(dto.half_damage_from),
    noFrom: names(dto.no_damage_from),
  }
}
