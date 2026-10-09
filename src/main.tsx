import { QueryClientProvider } from '@tanstack/react-query'
import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'
import { ErrorBoundary } from './components/ErrorBoundary.tsx'
import { LoadingInline } from './components/ui/DataStates.tsx'
import { FavoritesProvider } from './features/favorites/favorites-context.tsx'
import { TeamProvider } from './features/team-builder/team-context.tsx'
import { createQueryClient } from './app/providers/query-client.ts'
import { router } from './app/router/router.tsx'
import './app/styles/tokens.css'
import './app/styles/types.css'
import './app/styles/base.css'
import './app/styles/view-transitions.css'
import './app/styles/scroll-reveals.css'
import './components/ui/DataStates.css'
import './components/ui/Button.css'
import './components/ui/CollectionPage.css'
import './components/ui/TypeBadge.css'
import './components/ui/SearchField.css'
import './components/ui/FilterChip.css'
import './components/ui/DataLabel.css'
import './components/ui/StatBar.css'
import './components/ui/HelpPopover.css'
import './components/ui/HolographicSurface.css'
import './components/ui/ScannerRing.css'
import './app/layout/RootLayout.css'
import './app/pages/LabPage.css'
import './features/pokedex/ExplorerPage.css'
import './features/pokedex/PokemonCard.css'
import './features/compare/ComparePage.css'
import './features/compare/SpeciesCombobox.css'
import './features/evolution/EvolutionPage.css'
import './features/favorites/FavoriteButton.css'
import './features/pokemon-details/DetailPage.css'
import './features/palette/CommandPalette.css'
// Cross-cutting container queries LAST: same-specificity enhancements must
// beat the component base styles in the cascade (see container-queries.css).
import './app/styles/container-queries.css'
// Parent-state reactions (`:has()`) after every component they refine.
import './app/styles/state-has.css'
import './main.css'

const queryClient = createQueryClient()

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('Missing #root element — check index.html.')
}

createRoot(rootElement).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <FavoritesProvider>
        <TeamProvider>
          <ErrorBoundary>
            <Suspense fallback={<LoadingInline label="Initialising archive…" />}>
              <RouterProvider router={router} />
            </Suspense>
          </ErrorBoundary>
        </TeamProvider>
      </FavoritesProvider>
    </QueryClientProvider>
  </StrictMode>,
)
