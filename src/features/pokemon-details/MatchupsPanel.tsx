import { useQueries } from '@tanstack/react-query'
import { useMemo } from 'react'
import { typeRelationsOptions } from '@/api/pokeapi/queries.ts'
import { LoadingInline } from '@/components/ui/DataStates.tsx'
import { HelpPopover } from '@/components/ui/HelpPopover.tsx'
import { TypeBadge } from '@/components/ui/TypeBadge.tsx'
import { combineEffectiveness, formatMultiplier } from '@/domain/type/effectiveness.ts'
import type { EffectivenessEntry } from '@/domain/type/effectiveness.ts'
import './MatchupsPanel.css'

/**
 * Defensive matchups for the dossier's type combination.
 * Multipliers are text (2×, ½×, 0×) — the badge color never carries
 * the meaning alone.
 */
export function MatchupsPanel({ types }: { types: string[] }) {
  const relations = useQueries({ queries: types.map((type) => typeRelationsOptions(type)) })

  const effectiveness = useMemo(() => {
    const ready = relations.map((query) => query.data).filter((data) => data !== undefined)
    if (ready.length !== types.length) return undefined
    return combineEffectiveness(ready)
  }, [relations, types.length])

  if (relations.some((query) => query.isPending) || !effectiveness) {
    return (
      <section aria-label="Type matchups" className="panel">
        <LoadingInline label="Computing matchups…" />
      </section>
    )
  }

  if (relations.some((query) => query.isError)) {
    return (
      <section aria-label="Type matchups" className="panel">
        <h2>Matchups</h2>
        <p className="panel-muted">Matchup data unavailable for this specimen.</p>
      </section>
    )
  }

  return (
    <section aria-labelledby="dossier-matchups-heading" className="panel">
      <div className="panel-head">
        <h2 id="dossier-matchups-heading">Matchups</h2>
        <HelpPopover buttonLabel="How to read" title="Reading matchups">
          <p>
            Defensive take against each attacking type: <strong>2×</strong> and <strong>4×</strong>{' '}
            take extra damage, <strong>½×</strong> and <strong>¼×</strong> resist it,{' '}
            <strong>0×</strong> is immune. Dual types combine both multipliers.
          </p>
        </HelpPopover>
      </div>
      <MatchupGroup label="Weak to" entries={effectiveness.weak} />
      <MatchupGroup label="Resists" entries={effectiveness.resist} />
      <MatchupGroup label="Immune to" entries={effectiveness.immune} />
    </section>
  )
}

function MatchupGroup({ label, entries }: { label: string; entries: EffectivenessEntry[] }) {
  if (entries.length === 0) return null
  return (
    <div className="matchup-group">
      <h3>{label}</h3>
      <ul aria-label={label}>
        {entries.map((entry) => (
          <li key={entry.type} data-type={entry.type}>
            <TypeBadge type={entry.type} />
            <span className="matchup-mult">{formatMultiplier(entry.multiplier)}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
