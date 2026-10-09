import { describe, expect, it } from 'vitest'
import { pickRelatedIds } from './related.ts'

describe('pickRelatedIds', () => {
  it('picks nearest neighbours deterministically, excluding self', () => {
    expect(pickRelatedIds([1, 4, 6, 25, 26, 37, 38], 6, 4)).toEqual([1, 4, 25, 26])
  })

  it('caps at the requested count', () => {
    expect(pickRelatedIds([1, 2, 3, 4, 5], 3, 2)).toEqual([2, 4])
  })
})
