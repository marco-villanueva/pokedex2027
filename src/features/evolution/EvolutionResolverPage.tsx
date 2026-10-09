import { Link, Navigate, useParams } from 'react-router'
import { ApiError } from '@/api/pokeapi/client.ts'
import { usePokemonDetails } from '@/api/pokeapi/queries.ts'
import { EmptyState, ErrorPanel, LoadingGrid } from '@/components/ui/DataStates.tsx'
import { sectionTitle, usePageTitle } from '@/lib/use-page-title.ts'

function errorMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message
  if (error instanceof Error) return error.message
  return 'An unexpected error occurred.'
}

/**
 * Specimen → lineage resolver (§6.1, D-032): `/evolution/pokemon/:idOrName`
 * accepts a Pokédex id or name and redirects to the canonical chain URL
 * (`/evolution/:chainId`). The chain route stays canonical — dossier links
 * and shared URLs never change shape — while typed specimen ids resolve
 * instead of surprising (see `/evolution/133`: chain, not Eevee).
 */
export function EvolutionResolverPage() {
  const { idOrName = '' } = useParams()
  const details = usePokemonDetails(idOrName)
  usePageTitle(sectionTitle('Evolution'))

  if (details.isPending) {
    return (
      <section aria-label="Evolution explorer">
        <p className="eyebrow">Lineage · resolving specimen</p>
        <LoadingGrid label="Tracing lineage…" />
      </section>
    )
  }

  if (details.isError) {
    return (
      <section aria-label="Evolution explorer">
        <ErrorPanel
          title={`No specimen “${idOrName}”`}
          message={errorMessage(details.error)}
          onRetry={() => details.refetch()}
        />
        <p className="detail-back">
          <Link to="/pokedex">← Return to explorer</Link>
        </p>
      </section>
    )
  }

  const chainId = details.data.species.evolutionChainId
  if (chainId === undefined) {
    return (
      <section aria-label="Evolution explorer">
        <EmptyState
          title={`${details.data.displayName} stands alone`}
          message="The archive records no evolution chain for this specimen."
          action={
            <Link to={`/pokemon/${details.data.id}`} className="btn">
              Open dossier
            </Link>
          }
        />
      </section>
    )
  }

  return <Navigate to={`/evolution/${chainId}`} replace />
}
