import { useQueries } from '@tanstack/react-query'
import { Link } from 'react-router'
import { pokemonSummaryOptions } from '@/api/pokeapi/queries.ts'
import { Button } from '@/components/ui/Button.tsx'
import { EmptyState, LoadingGrid } from '@/components/ui/DataStates.tsx'
import { FadeIn } from '@/components/motion/FadeIn.tsx'
import { PokemonCard } from '@/features/pokedex/PokemonCard.tsx'
import { useFavorites } from './favorites-context.tsx'
import { sectionTitle, usePageTitle } from '@/lib/use-page-title.ts'
import '@/components/ui/CollectionPage.css'

/** Local favorites shelf: persisted ids rendered through production cards. */
export function FavoritesPage() {
  const { favorites, clearFavorites, persistError } = useFavorites()
  usePageTitle(sectionTitle('Favorites'))
  const summaries = useQueries({ queries: favorites.map((id) => pokemonSummaryOptions(id)) })
  const cards = summaries.map((query) => query.data).filter((card) => card !== undefined)
  const pending = summaries.some((query) => query.isPending)

  return (
    <section aria-label="Favorite specimens" className="collection-page">
      <p className="eyebrow">Collection · local only</p>
      <h1 className="collection-title">Favorites</h1>
      <p className="collection-subtitle">
        {favorites.length === 0
          ? 'Nothing shelved yet — tap the heart on any card or dossier.'
          : `${favorites.length} specimen${favorites.length === 1 ? '' : 's'} shelved on this device.`}
      </p>

      {favorites.length === 0 ? (
        <EmptyState
          title="Shelf is empty"
          message="Favorites live only in this browser. Find a specimen worth keeping."
          action={
            <Link to="/pokedex" className="btn">
              Browse the archive
            </Link>
          }
        />
      ) : (
        <FadeIn key={favorites.join(',')}>
          {pending && cards.length === 0 ? (
            <LoadingGrid label="Retrieving shelved specimens…" />
          ) : (
            <>
              <ul className="explorer-grid">
                {cards.map((pokemon) => (
                  <li key={pokemon.id}>
                    <PokemonCard pokemon={pokemon} />
                  </li>
                ))}
              </ul>
              <div className="collection-tools">
                <Button variant="ghost" onClick={clearFavorites}>
                  Clear shelf
                </Button>
              </div>
              {persistError && (
                <p className="collection-error" role="alert">
                  {persistError}
                </p>
              )}
            </>
          )}
        </FadeIn>
      )}
    </section>
  )
}
