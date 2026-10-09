import { useQueries, useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router'
import { ApiError } from '@/api/pokeapi/client.ts'
import {
  evolutionTreeOptions,
  pokemonSummaryOptions,
  usePrefetchPokemon,
} from '@/api/pokeapi/queries.ts'
import { FadeIn } from '@/components/motion/FadeIn.tsx'
import { TransitionLink } from '@/app/router/TransitionLink.tsx'
import { EmptyState, ErrorPanel, LoadingGrid } from '@/components/ui/DataStates.tsx'
import { TypeBadge } from '@/components/ui/TypeBadge.tsx'
import { formatPokedexId } from '@/domain/pokemon/format.ts'
import { pokemonArtTransitionName } from '@/lib/view-transitions.ts'
import type { PokemonSummary } from '@/domain/pokemon/types.ts'
import { sectionTitle, usePageTitle } from '@/lib/use-page-title.ts'
import { chainSpeciesIds, tiersOf } from './tree-tiers.ts'
import './EvolutionPage.css'

function errorMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message
  if (error instanceof Error) return error.message
  return 'An unexpected error occurred.'
}

/**
 * RC4 evolution explorer: the chain as tiered stages with artwork, types
 * and trigger conditions per node. Tiers are ordered lists, so assistive
 * technology receives the same logical tree without a parallel version.
 */
export function EvolutionPage() {
  const { id = '' } = useParams()
  const chainId = Number.parseInt(id, 10)
  const prefetch = usePrefetchPokemon()
  const tree = useQuery({
    ...evolutionTreeOptions(Number.isFinite(chainId) ? chainId : -1),
  })

  const speciesIds = tree.data ? chainSpeciesIds(tree.data.root) : []
  const summaries = useQueries({ queries: speciesIds.map((sid) => pokemonSummaryOptions(sid)) })
  usePageTitle(
    tree.data
      ? `${tree.data.root.displayName} lineage · Pokédex // 2027`
      : sectionTitle('Evolution'),
  )
  const byId = new Map<number, PokemonSummary>()
  for (const query of summaries) {
    if (query.data) byId.set(query.data.id, query.data)
  }

  if (!Number.isFinite(chainId) || chainId <= 0) {
    return (
      <section aria-label="Evolution explorer">
        <EmptyState
          title="Unknown chain"
          message="Evolution chains are addressed by number, e.g. /evolution/67 for Eevee's lineage — or resolve from a specimen via /evolution/pokemon/133."
          action={
            <Link to="/pokedex" className="btn">
              Back to explorer
            </Link>
          }
        />
      </section>
    )
  }

  if (tree.isPending) {
    return (
      <section aria-label="Evolution explorer">
        <p className="eyebrow">Lineage · chain #{chainId}</p>
        <LoadingGrid label="Tracing lineage…" />
      </section>
    )
  }

  if (tree.isError || !tree.data) {
    return (
      <section aria-label="Evolution explorer">
        <ErrorPanel
          title="Lineage unavailable"
          message={errorMessage(tree.error)}
          onRetry={() => tree.refetch()}
        />
      </section>
    )
  }

  const tiers = tiersOf(tree.data.root)
  const cardsPending = summaries.some((query) => query.isPending)

  return (
    <section aria-label={`Evolution chain ${chainId}`} className="evo-page">
      <FadeIn key={`evo-${chainId}`}>
        <p className="eyebrow">Lineage · chain #{chainId}</p>
        <h1 className="evo-title">{tree.data.root.displayName} lineage</h1>
        <p className="evo-subtitle">
          {speciesIds.length} specimen{speciesIds.length === 1 ? '' : 's'} across {tiers.length}{' '}
          stage{tiers.length === 1 ? '' : 's'}. Every node opens its dossier.
        </p>
      </FadeIn>

      {cardsPending ? (
        <LoadingGrid label="Materialising specimens…" />
      ) : (
        <ol className="evo-tiers">
          {tiers.map((tier) => (
            <li key={tier.depth} className="evo-tier" aria-label={`Stage ${tier.depth + 1}`}>
              <p className="evo-tier-label" aria-hidden="true">
                Stage {tier.depth + 1}
              </p>
              <ul className="evo-nodes">
                {tier.nodes.map((node) => {
                  const summary = byId.get(node.speciesId)
                  const conditions = [...new Set(node.conditions.map((c) => c.label))]
                  return (
                    <li
                      key={node.speciesId}
                      className="evo-card"
                      data-type={summary?.types[0]?.name ?? 'unknown'}
                    >
                      <TransitionLink
                        to={`/pokemon/${node.speciesId}`}
                        className="evo-card-link"
                        aria-label={`${node.displayName}, ${formatPokedexId(node.speciesId)}${conditions.length > 0 ? `, ${conditions.join(', ')}` : ''}`}
                        onMouseEnter={() => prefetch(node.speciesId)}
                        onFocus={() => prefetch(node.speciesId)}
                      >
                        {summary ? (
                          <img
                            src={summary.artwork.official ?? summary.artwork.sprite}
                            alt=""
                            loading="lazy"
                            decoding="async"
                            width={120}
                            height={120}
                            style={{ viewTransitionName: pokemonArtTransitionName(node.speciesId) }}
                          />
                        ) : (
                          <span className="evo-card-missing" aria-hidden="true">
                            ?
                          </span>
                        )}
                        <span className="evo-card-id">{formatPokedexId(node.speciesId)}</span>
                        <span className="evo-card-name">{node.displayName}</span>
                        {summary && summary.types.length > 0 && (
                          <span className="evo-card-types">
                            {summary.types.map((type) => (
                              <TypeBadge key={type.name} type={type.name} />
                            ))}
                          </span>
                        )}
                        {conditions.length > 0 && (
                          <span className="evo-card-condition">{conditions.join(' · ')}</span>
                        )}
                      </TransitionLink>
                    </li>
                  )
                })}
              </ul>
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}
