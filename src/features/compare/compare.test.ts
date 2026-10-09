import { describe, expect, it } from 'vitest'
import { diffStats, parseCompareParams, serializeCompareParams } from './compare.ts'
import type { PokemonStat } from '@/domain/pokemon/types.ts'

describe('parseCompareParams', () => {
  it('normalises slugs and drops empties', () => {
    expect(parseCompareParams(new URLSearchParams('left=6&right=Blastoise'))).toEqual({
      left: '6',
      right: 'blastoise',
    })
    expect(parseCompareParams(new URLSearchParams('left=&right='))).toEqual({
      left: undefined,
      right: undefined,
    })
  })
})

describe('serializeCompareParams', () => {
  it('round-trips through parse', () => {
    const params = serializeCompareParams({ left: '6', right: '9' })
    expect(params.toString()).toBe('left=6&right=9')
    expect(parseCompareParams(params)).toEqual({ left: '6', right: '9' })
  })
})

describe('diffStats', () => {
  const left: PokemonStat[] = [
    { name: 'hp', value: 78 },
    { name: 'attack', value: 84 },
    { name: 'defense', value: 78 },
    { name: 'special-attack', value: 109 },
    { name: 'special-defense', value: 85 },
    { name: 'speed', value: 100 },
  ]
  const right: PokemonStat[] = [
    { name: 'hp', value: 79 },
    { name: 'attack', value: 83 },
    { name: 'defense', value: 100 },
    { name: 'special-attack', value: 85 },
    { name: 'special-defense', value: 105 },
    { name: 'speed', value: 78 },
  ]

  it('computes leaders and deltas in canonical order', () => {
    const diffs = diffStats(left, right)
    expect(diffs.map((diff) => diff.name)).toEqual([
      'hp',
      'attack',
      'defense',
      'special-attack',
      'special-defense',
      'speed',
    ])
    expect(diffs[1]).toEqual({ name: 'attack', left: 84, right: 83, delta: 1, leader: 'left' })
    expect(diffs[2]?.leader).toBe('right')
  })

  it('marks ties explicitly', () => {
    const ties: PokemonStat[] = [{ name: 'hp', value: 50 }]
    const diffs = diffStats(ties, ties)
    expect(diffs[0]?.leader).toBe('tie')
    expect(diffs[0]?.delta).toBe(0)
    // Missing stats default to zero rather than crashing.
    expect(diffs[1]).toEqual({ name: 'attack', left: 0, right: 0, delta: 0, leader: 'tie' })
  })
})
