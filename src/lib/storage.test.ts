import { afterEach, describe, expect, it, vi } from 'vitest'
import { persistCollection, readCollection, writeCollection } from './storage.ts'

const KEY = 'px-test-collection'

afterEach(() => {
  localStorage.clear()
})

describe('readCollection', () => {
  it('returns fallback when empty', () => {
    expect(readCollection(KEY, 1, [1])).toEqual([1])
  })

  it('round-trips versioned payloads', () => {
    writeCollection(KEY, 1, [1, 25])
    expect(readCollection<number[]>(KEY, 1, [])).toEqual([1, 25])
  })

  it('falls back on malformed JSON', () => {
    localStorage.setItem(KEY, '{not-json')
    expect(readCollection(KEY, 1, ['fallback'])).toEqual(['fallback'])
  })

  it('falls back on version mismatch without migration', () => {
    writeCollection(KEY, 99, ['future'])
    expect(readCollection<string[]>(KEY, 1, [])).toEqual([])
  })

  it('migrates legacy shapes when a migrator is provided', () => {
    localStorage.setItem(KEY, JSON.stringify([6, 9]))
    expect(
      readCollection<number[]>(KEY, 1, [], {
        migrate: (raw) => (Array.isArray(raw) ? (raw as number[]) : undefined),
      }),
    ).toEqual([6, 9])
  })

  it('falls back when migration declines', () => {
    localStorage.setItem(KEY, JSON.stringify({ version: 2, data: ['x'] }))
    expect(readCollection<string[]>(KEY, 1, ['fallback'], { migrate: () => undefined })).toEqual([
      'fallback',
    ])
  })
})

describe('persistCollection', () => {
  it('resolves after persisting the versioned payload', async () => {
    await persistCollection(KEY, 1, [1, 25])
    expect(readCollection<number[]>(KEY, 1, [])).toEqual([1, 25])
  })

  it('rejects when storage is unavailable', async () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementationOnce(() => {
      throw new Error('quota exceeded')
    })
    await expect(persistCollection(KEY, 1, [1])).rejects.toThrow(/storage unavailable/)
  })
})
