import { useQueries } from '@tanstack/react-query'
import { useMemo } from 'react'
import { Link } from 'react-router'
import { pokemonSummaryOptions } from '@/api/pokeapi/queries.ts'
import { Button } from '@/components/ui/Button.tsx'
import { EmptyState, LoadingGrid } from '@/components/ui/DataStates.tsx'
import { TypeBadge } from '@/components/ui/TypeBadge.tsx'
import { FadeIn } from '@/components/motion/FadeIn.tsx'
import { formatPokedexId } from '@/domain/pokemon/format.ts'
import { MAX_TEAM_SIZE, useTeam } from './team-context.tsx'
import { sectionTitle, usePageTitle } from '@/lib/use-page-title.ts'
import '@/components/ui/CollectionPage.css'

/**
 * Six-slot team bench: reorder, release, type composition at a glance.
 * Order and membership persist locally; summaries resolve lazily.
 */
export function TeamPage() {
  const { members, removeMember, moveMember, clearTeam, persistError } = useTeam()
  usePageTitle(sectionTitle('Team bench'))
  const summaries = useQueries({ queries: members.map((id) => pokemonSummaryOptions(id)) })

  const composition = useMemo(() => {
    const counts = new Map<string, number>()
    for (const query of summaries) {
      for (const type of query.data?.types ?? []) {
        counts.set(type.name, (counts.get(type.name) ?? 0) + 1)
      }
    }
    return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
  }, [summaries])

  return (
    <section aria-label="Pokémon team" className="collection-page">
      <p className="eyebrow">
        Squad · {members.length} of {MAX_TEAM_SIZE}
      </p>
      <h1 className="collection-title">Team bench</h1>
      <p className="collection-subtitle">
        Six slots, local only. Reorder with the arrows — order persists with the squad.
      </p>

      {members.length === 0 ? (
        <EmptyState
          title="No squad assembled"
          message="Recruit from any dossier with “Add to team”."
          action={
            <Link to="/pokedex" className="btn">
              Browse the archive
            </Link>
          }
        />
      ) : (
        <FadeIn key={members.join(',')}>
          <ol className="team-slots">
            {members.map((id, position) => {
              const summary = summaries[position]?.data
              return (
                <li key={id} className="team-slot" data-type={summary?.types[0]?.name ?? 'unknown'}>
                  <Link to={`/pokemon/${id}`} className="team-slot-link">
                    {summary?.artwork.sprite ? (
                      <img
                        src={summary.artwork.sprite}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        width={72}
                        height={72}
                      />
                    ) : (
                      <span className="team-slot-missing" aria-hidden="true">
                        ?
                      </span>
                    )}
                    <span className="team-slot-name">{summary?.displayName ?? `#${id}`}</span>
                    <span className="team-slot-id">{formatPokedexId(id)}</span>
                  </Link>
                  <div className="team-slot-actions">
                    <button
                      type="button"
                      aria-label={`Move ${summary?.displayName ?? id} earlier`}
                      disabled={position === 0}
                      onClick={() => moveMember(position, position - 1)}
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      aria-label={`Move ${summary?.displayName ?? id} later`}
                      disabled={position === members.length - 1}
                      onClick={() => moveMember(position, position + 1)}
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      aria-label={`Release ${summary?.displayName ?? id} from team`}
                      onClick={() => removeMember(id)}
                    >
                      ✕
                    </button>
                  </div>
                </li>
              )
            })}
          </ol>

          {composition.length > 0 && (
            <section aria-label="Type composition" className="panel team-composition">
              <h2>Type composition</h2>
              <ul>
                {composition.map(([type, count]) => (
                  <li key={type} data-type={type}>
                    <TypeBadge type={type} />
                    <span
                      className="team-count"
                      aria-label={`${count} member${count === 1 ? '' : 's'}`}
                    >
                      ×{count}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <div className="collection-tools">
            <Button variant="ghost" onClick={clearTeam}>
              Disband team
            </Button>
          </div>
          {persistError && (
            <p className="collection-error" role="alert">
              {persistError}
            </p>
          )}
        </FadeIn>
      )}
      {members.length > 0 && summaries.some((query) => query.isPending) && (
        <LoadingGrid label="Resolving squad members…" />
      )}
    </section>
  )
}
