import { useQueries, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { Link } from 'react-router'
import { TransitionLink } from '@/app/router/TransitionLink.tsx'
import { pokemonSummaryOptions, pokemonTypeOptions } from '@/api/pokeapi/queries.ts'
import { LoadingInline } from '@/components/ui/DataStates.tsx'
import { formatPokedexId, toDisplayName } from '@/domain/pokemon/format.ts'
import { pickRelatedIds } from '@/domain/type/related.ts'
import './RelatedStrip.css'

/**
 * Related specimens: nearest neighbours by id sharing the primary type.
 * Deterministic (no random) so URLs and screenshots stay stable.
 */
export function RelatedStrip({
  primaryType,
  currentId,
}: {
  primaryType: string | undefined
  currentId: number
}) {
  const roster = useQuery(pokemonTypeOptions(primaryType))
  const ids = useMemo(
    () => (roster.data ? pickRelatedIds(roster.data, currentId) : []),
    [roster.data, currentId],
  )
  const summaries = useQueries({ queries: ids.map((id) => pokemonSummaryOptions(id)) })
  const cards = summaries.map((query) => query.data).filter((card) => card !== undefined)

  if (primaryType === undefined) return null
  return (
    <section aria-labelledby="dossier-related-heading" className="panel">
      <div className="panel-head">
        <h2 id="dossier-related-heading">Related {toDisplayName(primaryType)} specimens</h2>
        <Link to={`/pokedex?type=${primaryType}`} className="panel-link">
          Browse all →
        </Link>
      </div>
      {roster.isPending || summaries.some((query) => query.isPending) ? (
        <LoadingInline label="Scanning neighbouring specimens…" />
      ) : cards.length === 0 ? (
        <p className="panel-muted">No neighbouring specimens found.</p>
      ) : (
        <ul className="related-grid">
          {cards.map((card) => (
            <li key={card.id}>
              <TransitionLink
                to={`/pokemon/${card.id}`}
                className="related-card"
                aria-label={`${card.displayName}, ${formatPokedexId(card.id)}`}
              >
                {card.artwork.sprite ? (
                  <img
                    src={card.artwork.sprite}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    width={72}
                    height={72}
                  />
                ) : (
                  <span className="related-missing" aria-hidden="true">
                    ?
                  </span>
                )}
                <span className="related-name">{card.displayName}</span>
                <span className="related-id">{formatPokedexId(card.id)}</span>
              </TransitionLink>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
