import { describe, expect, it } from 'vitest'
import { ARCHIVE_TITLE, sectionTitle } from './use-page-title.ts'

describe('use-page-title helpers', () => {
  it('keeps the archive title stable', () => {
    expect(ARCHIVE_TITLE).toBe('Pokédex // 2027 — Advanced Pokémon Research Interface')
  })

  it('suffixes section titles consistently', () => {
    expect(sectionTitle('Compare specimens')).toBe('Compare specimens · Pokédex // 2027')
  })
})
