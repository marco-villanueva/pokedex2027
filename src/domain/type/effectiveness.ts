/**
 * Defensive type effectiveness: combine one or two type matchups into
 * final multipliers. Pure domain logic — fully unit-tested.
 */

export interface TypeRelations {
  doubleFrom: string[]
  halfFrom: string[]
  noFrom: string[]
}

export interface EffectivenessEntry {
  type: string
  multiplier: number
}

export interface Effectiveness {
  weak: EffectivenessEntry[]
  resist: EffectivenessEntry[]
  immune: EffectivenessEntry[]
}

/** Combine 1–2 defensive types into final damage multipliers. */
export function combineEffectiveness(relations: TypeRelations[]): Effectiveness {
  const multipliers = new Map<string, number>()
  const touch = (type: string, factor: number): void => {
    multipliers.set(type, (multipliers.get(type) ?? 1) * factor)
  }

  for (const relation of relations) {
    for (const type of relation.doubleFrom) touch(type, 2)
    for (const type of relation.halfFrom) touch(type, 0.5)
    for (const type of relation.noFrom) touch(type, 0)
  }

  const weak: EffectivenessEntry[] = []
  const resist: EffectivenessEntry[] = []
  const immune: EffectivenessEntry[] = []
  for (const [type, multiplier] of [...multipliers.entries()].sort(([a], [b]) =>
    a.localeCompare(b),
  )) {
    if (multiplier === 0) immune.push({ type, multiplier })
    else if (multiplier > 1) weak.push({ type, multiplier })
    else if (multiplier < 1) resist.push({ type, multiplier })
  }
  return { weak, resist, immune }
}

export function formatMultiplier(multiplier: number): string {
  if (multiplier === 0.25) return '¼×'
  if (multiplier === 0.5) return '½×'
  if (multiplier === 2) return '2×'
  if (multiplier === 4) return '4×'
  if (multiplier === 0) return '0×'
  return `${multiplier}×`
}
