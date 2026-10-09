import type { IndexEntry } from '@/api/pokeapi/mappers/catalog.mapper.ts'
import { squashName } from '@/domain/explorer/filters.ts'

/**
 * Command-palette ranking (§7 P1-7): pure, deterministic, tested.
 * Reuses `squashName` so human spellings ("mr mime", "farfetch'd") keep
 * working — no duplicated tolerance logic.
 *
 * Tiers (lower wins, ties break by id):
 * - 0 exact id (`25` → Pikachu)
 * - 1 id prefix (`2` → 2, 20–29, 200–299…)
 * - 2 exact squashed name (`charizard`)
 * - 3 squashed name prefix (`char` → Charmander first, by id)
 * - 4 squashed name substring (`zard`)
 */
export function rankPaletteEntries(query: string, index: IndexEntry[], limit = 8): IndexEntry[] {
  const raw = query.trim().toLowerCase().replace(/^#/, '')
  if (raw.length === 0) return []
  const squashed = squashName(raw)

  const scored: Array<{ entry: IndexEntry; score: number }> = []
  for (const entry of index) {
    const idText = String(entry.id)
    if (idText === raw) {
      scored.push({ entry, score: 0 })
      continue
    }
    if (/^\d+$/.test(raw) && idText.startsWith(raw)) {
      scored.push({ entry, score: 1 })
      continue
    }
    if (squashed.length === 0) continue
    const slug = squashName(entry.name)
    if (slug === squashed) scored.push({ entry, score: 2 })
    else if (slug.startsWith(squashed)) scored.push({ entry, score: 3 })
    else if (slug.includes(squashed)) scored.push({ entry, score: 4 })
  }

  scored.sort((a, b) => a.score - b.score || a.entry.id - b.entry.id)
  return scored.slice(0, Math.max(0, limit)).map((item) => item.entry)
}
