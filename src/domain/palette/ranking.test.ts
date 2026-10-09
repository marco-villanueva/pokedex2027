import { describe, expect, it } from 'vitest'
import type { IndexEntry } from '@/api/pokeapi/mappers/catalog.mapper.ts'
import { rankPaletteEntries } from './ranking.ts'

const INDEX: IndexEntry[] = [
  { id: 1, name: 'bulbasaur' },
  { id: 4, name: 'charmander' },
  { id: 5, name: 'charmeleon' },
  { id: 6, name: 'charizard' },
  { id: 25, name: 'pikachu' },
  { id: 122, name: 'mr-mime' },
  { id: 134, name: 'vaporeon' },
]

describe('rankPaletteEntries (§7 P1-7)', () => {
  it('returns nothing for blank queries (actions own that state)', () => {
    expect(rankPaletteEntries('', INDEX)).toEqual([])
    expect(rankPaletteEntries('   ', INDEX)).toEqual([])
  })

  it('ranks exact ids first', () => {
    expect(rankPaletteEntries('25', INDEX).map((entry) => entry.id)).toEqual([25])
  })

  it('ranks exact names above prefixes above substrings', () => {
    const ids = rankPaletteEntries('char', INDEX).map((entry) => entry.id)
    // charmander/charmeleon/charizard share the prefix: id order wins.
    expect(ids).toEqual([4, 5, 6])
    expect(rankPaletteEntries('charizard', INDEX).map((entry) => entry.id)).toEqual([6])
    expect(rankPaletteEntries('zard', INDEX).map((entry) => entry.id)).toEqual([6])
  })

  it('tolerates human spellings via squashName', () => {
    expect(rankPaletteEntries('mr mime', INDEX).map((entry) => entry.id)).toEqual([122])
    expect(rankPaletteEntries('#25', INDEX).map((entry) => entry.id)).toEqual([25])
  })

  it('caps results at the limit in rank order', () => {
    const ids = rankPaletteEntries('a', INDEX, 3).map((entry) => entry.id)
    expect(ids).toEqual([1, 4, 5])
    expect(rankPaletteEntries('a', INDEX, 0)).toEqual([])
  })

  it('matches id prefixes for numeric queries', () => {
    const ids = rankPaletteEntries('1', INDEX).map((entry) => entry.id)
    expect(ids[0]).toBe(1)
    expect(ids).toContain(122)
    expect(ids).toContain(134)
  })
})
