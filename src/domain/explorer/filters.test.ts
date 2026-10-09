import { describe, expect, it } from 'vitest'
import {
  applyExplorerFilters,
  DEFAULT_FILTERS,
  parseExplorerParams,
  serializeExplorerParams,
} from '@/domain/explorer/filters.ts'
import { GENERATIONS, generationForId, generationIdFor } from '@/domain/explorer/generations.ts'

const INDEX = [
  { id: 1, name: 'bulbasaur' },
  { id: 4, name: 'charmander' },
  { id: 6, name: 'charizard' },
  { id: 25, name: 'pikachu' },
  { id: 83, name: 'farfetchd' },
  { id: 122, name: 'mr-mime' },
  { id: 152, name: 'chikorita' },
]

describe('generations', () => {
  it('covers species 1–1025 without gaps', () => {
    expect(GENERATIONS[0]?.from).toBe(1)
    expect(GENERATIONS[GENERATIONS.length - 1]?.to).toBe(1025)
    for (let i = 1; i < GENERATIONS.length; i++) {
      expect(GENERATIONS[i]!.from).toBe(GENERATIONS[i - 1]!.to + 1)
    }
  })

  it('resolves generation by id', () => {
    expect(generationForId(25)?.id).toBe(1)
    expect(generationForId(152)?.id).toBe(2)
    expect(generationForId(906)?.id).toBe(9)
    expect(generationForId(2000)).toBeUndefined()
  })

  it('maps species slugs to explorer generation ids', () => {
    expect(generationIdFor('generation-i')).toBe(1)
    expect(generationIdFor('generation-ix')).toBe(9)
    expect(generationIdFor(undefined)).toBeUndefined()
    expect(generationIdFor('generation-x')).toBeUndefined()
  })
})

describe('parseExplorerParams', () => {
  it('validates sort and generation, trims query', () => {
    const filters = parseExplorerParams(
      new URLSearchParams('q=%20pika%20&type=Electric&generation=1&sort=name-desc'),
    )
    expect(filters).toEqual({ query: ' pika ', type: 'electric', generation: 1, sort: 'name-desc' })
  })

  it('falls back to defaults on garbage', () => {
    expect(parseExplorerParams(new URLSearchParams('generation=99&sort=bogus&type=bogus'))).toEqual(
      DEFAULT_FILTERS,
    )
  })
})

describe('serializeExplorerParams', () => {
  it('round-trips through parse and omits defaults', () => {
    const params = serializeExplorerParams({
      query: 'char',
      type: 'fire',
      generation: 1,
      sort: 'name-asc',
    })
    expect(params.toString()).toBe('q=char&type=fire&generation=1&sort=name-asc')
    expect(serializeExplorerParams(DEFAULT_FILTERS).toString()).toBe('')
  })
})

describe('applyExplorerFilters', () => {
  it('searches by name and by number', () => {
    expect(
      applyExplorerFilters(INDEX, { ...DEFAULT_FILTERS, query: 'char' }).map((e) => e.id),
    ).toEqual([4, 6])
    expect(
      applyExplorerFilters(INDEX, { ...DEFAULT_FILTERS, query: '#25' }).map((e) => e.id),
    ).toEqual([25])
  })

  it('intersects type roster and generation range', () => {
    const fire = new Set([4, 6])
    expect(
      applyExplorerFilters(INDEX, { ...DEFAULT_FILTERS, type: 'fire' }, fire).map((e) => e.id),
    ).toEqual([4, 6])
    expect(
      applyExplorerFilters(INDEX, { ...DEFAULT_FILTERS, generation: 2 }).map((e) => e.id),
    ).toEqual([152])
  })

  it('sorts by id and name in both directions', () => {
    const ids = (sort: 'id-desc' | 'name-asc' | 'name-desc') =>
      applyExplorerFilters(INDEX, { ...DEFAULT_FILTERS, sort }).map((e) => e.id)
    expect(ids('id-desc')[0]).toBe(152)
    expect(ids('name-asc')[0]).toBe(1)
    expect(ids('name-desc')[0]).toBe(25)
  })

  it('tolerates human spellings of slug names', () => {
    const ids = (query: string) =>
      applyExplorerFilters(INDEX, { ...DEFAULT_FILTERS, query }).map((e) => e.id)
    expect(ids("farfetch'd")).toEqual([83])
    expect(ids('mr mime')).toEqual([122])
    expect(ids('mr-mime')).toEqual([122])
  })
})
