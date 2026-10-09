import type { PokemonStat } from '@/domain/pokemon/types.ts'

export interface CompareSelection {
  left: string | undefined
  right: string | undefined
}

/** Parse `?left=&right=` — raw slugs validated downstream by the detail query. */
export function parseCompareParams(params: URLSearchParams): CompareSelection {
  const clean = (value: string | null): string | undefined => {
    const slug = value?.trim().toLowerCase()
    return slug ? slug : undefined
  }
  return { left: clean(params.get('left')), right: clean(params.get('right')) }
}

export function serializeCompareParams(selection: CompareSelection): URLSearchParams {
  const params = new URLSearchParams()
  if (selection.left) params.set('left', selection.left)
  if (selection.right) params.set('right', selection.right)
  return params
}

export interface StatDiff {
  name: string
  left: number
  right: number
  delta: number
  leader: 'left' | 'right' | 'tie'
}

/** Per-stat differences in canonical stat order; missing stats default to 0. */
export function diffStats(left: PokemonStat[], right: PokemonStat[]): StatDiff[] {
  const order = ['hp', 'attack', 'defense', 'special-attack', 'special-defense', 'speed']
  const valueOf = (stats: PokemonStat[], name: string): number =>
    stats.find((stat) => stat.name === name)?.value ?? 0
  return order.map((name) => {
    const leftValue = valueOf(left, name)
    const rightValue = valueOf(right, name)
    return {
      name,
      left: leftValue,
      right: rightValue,
      delta: leftValue - rightValue,
      leader: leftValue === rightValue ? 'tie' : leftValue > rightValue ? 'left' : 'right',
    }
  })
}
