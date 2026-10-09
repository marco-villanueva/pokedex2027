import { describe, expect, it } from 'vitest'
import {
  decimetersToMeters,
  formatHeight,
  formatPokedexId,
  formatWeight,
  generationLabel,
  hectogramsToKilograms,
  statLabel,
  toDisplayName,
} from '@/domain/pokemon/format.ts'
import { gallerySprites, heroArtwork, totalBaseStats } from '@/domain/pokemon/types.ts'

describe('unit conversions', () => {
  it('decimetres → metres', () => {
    expect(decimetersToMeters(7)).toBeCloseTo(0.7)
  })

  it('hectograms → kilograms', () => {
    expect(hectogramsToKilograms(69)).toBeCloseTo(6.9)
  })
})

describe('formatters', () => {
  it('formats height and weight with one decimal', () => {
    expect(formatHeight(0.7)).toBe('0.7 m')
    expect(formatWeight(6.9)).toBe('6.9 kg')
  })

  it('pads pokédex ids', () => {
    expect(formatPokedexId(25)).toBe('#0025')
  })

  it('prettifies slugs', () => {
    expect(toDisplayName('mr-mime')).toBe('Mr Mime')
    expect(toDisplayName('ho-oh')).toBe('Ho Oh')
  })

  it('labels stats and generations', () => {
    expect(statLabel('special-attack')).toBe('Sp. Atk')
    expect(statLabel('unknown-stat')).toBe('unknown-stat')
    expect(generationLabel('generation-i')).toBe('Generation I')
    expect(generationLabel(undefined)).toBeUndefined()
  })
})

describe('heroArtwork', () => {
  const base = {
    artwork: {
      official: 'official.png',
      home: 'home.png',
      dreamWorld: 'dream.png',
      spriteFront: 'sprite.png',
    },
  }

  it('prefers official → home → dream → sprite', () => {
    expect(heroArtwork(base)).toBe('official.png')
    expect(heroArtwork({ artwork: { home: 'home.png', spriteFront: 'sprite.png' } })).toBe(
      'home.png',
    )
    expect(heroArtwork({ artwork: {} })).toBeUndefined()
  })

  it('falls back to normal art when shiny is missing', () => {
    expect(heroArtwork({ artwork: { official: 'official.png' } }, true)).toBe('official.png')
    expect(heroArtwork({ artwork: { official: 'n.png', officialShiny: 's.png' } }, true)).toBe(
      's.png',
    )
  })
})

describe('totalBaseStats', () => {
  it('sums values', () => {
    expect(
      totalBaseStats([
        { name: 'hp', value: 45 },
        { name: 'attack', value: 49 },
      ]),
    ).toBe(94)
  })
})

describe('gallerySprites', () => {
  const pokemon = {
    displayName: 'Pikachu',
    artwork: {
      official: 'official.png',
      spriteFront: 'front.png',
      spriteFrontShiny: 'front-shiny.png',
      spriteBack: 'back.png',
      showdown: 'showdown.png',
    },
  }

  it('lists usable sources with labels and skips the rest', () => {
    const gallery = gallerySprites(pokemon)
    expect(gallery.map((sprite) => sprite.key)).toEqual(['front', 'back', 'showdown', 'official'])
    expect(gallery[0]).toEqual({ key: 'front', label: 'Front', url: 'front.png' })
  })

  it('honours the shiny toggle with fallback to standard', () => {
    const gallery = gallerySprites(pokemon, true)
    expect(gallery.find((sprite) => sprite.key === 'front')?.url).toBe('front-shiny.png')
    // Back has no shiny archived: falls back to the standard sprite.
    expect(gallery.find((sprite) => sprite.key === 'back')?.url).toBe('back.png')
  })

  it('returns nothing archivable when empty', () => {
    expect(gallerySprites({ displayName: 'Missing', artwork: {} })).toEqual([])
  })
})
