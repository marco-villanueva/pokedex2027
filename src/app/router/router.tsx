import { createBrowserRouter, Navigate } from 'react-router'
import { lazy } from 'react'
import { RootLayout } from '../layout/RootLayout.tsx'
import { NotFoundPage } from '../pages/NotFoundPage.tsx'

const ExplorerPage = lazy(() =>
  import('@/features/pokedex/ExplorerPage.tsx').then((module) => ({
    default: module.ExplorerPage,
  })),
)
const DetailPage = lazy(() =>
  import('@/features/pokemon-details/DetailPage.tsx').then((module) => ({
    default: module.DetailPage,
  })),
)
const LabPage = lazy(() =>
  import('@/app/pages/LabPage.tsx').then((module) => ({ default: module.LabPage })),
)
const EvolutionPage = lazy(() =>
  import('@/features/evolution/EvolutionPage.tsx').then((module) => ({
    default: module.EvolutionPage,
  })),
)
const EvolutionResolverPage = lazy(() =>
  import('@/features/evolution/EvolutionResolverPage.tsx').then((module) => ({
    default: module.EvolutionResolverPage,
  })),
)
const ComparePage = lazy(() =>
  import('@/features/compare/ComparePage.tsx').then((module) => ({
    default: module.ComparePage,
  })),
)
const FavoritesPage = lazy(() =>
  import('@/features/favorites/FavoritesPage.tsx').then((module) => ({
    default: module.FavoritesPage,
  })),
)
const TeamPage = lazy(() =>
  import('@/features/team-builder/TeamPage.tsx').then((module) => ({ default: module.TeamPage })),
)

/**
 * Route map (see `docs/PRODUCT.md` navigation proposal).
 * Heavy regions stay behind `lazy` so the explorer never pays for
 * compare / team / evolution code it has not visited (RC7 budget rule).
 */
export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <Navigate to="/pokedex" replace /> },
      { path: 'pokedex', element: <ExplorerPage /> },
      { path: 'pokemon/:idOrName', element: <DetailPage /> },
      {
        path: 'compare',
        element: <ComparePage />,
      },
      {
        path: 'evolution/:id',
        element: <EvolutionPage />,
      },
      {
        // Specimen alias (§6.1, D-032): resolves a Pokémon id/name to its
        // canonical chain URL. Static `pokemon` outranks `:id`, no conflict.
        path: 'evolution/pokemon/:idOrName',
        element: <EvolutionResolverPage />,
      },
      {
        path: 'favorites',
        element: <FavoritesPage />,
      },
      {
        path: 'team',
        element: <TeamPage />,
      },
      { path: '*', element: <NotFoundPage /> },
      { path: 'lab', element: <LabPage /> },
    ],
  },
])
