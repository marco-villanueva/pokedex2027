import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { afterEach, describe, expect, it } from 'vitest'
import { mapPokemonSummary } from '@/api/pokeapi/mappers/pokemon.mapper.ts'
import { FavoritesProvider } from '@/features/favorites/favorites-context.tsx'
import { PokemonCard } from '@/features/pokedex/PokemonCard.tsx'
import { bulbasaurDto } from '@/tests/fixtures.ts'

afterEach(() => {
  localStorage.clear()
})

describe('PokemonCard', () => {
  it('exposes a named link with types for keyboard and screen-reader users', () => {
    const summary = mapPokemonSummary(bulbasaurDto)
    const client = new QueryClient()
    render(
      <QueryClientProvider client={client}>
        <FavoritesProvider>
          <MemoryRouter>
            <PokemonCard pokemon={summary} />
          </MemoryRouter>
        </FavoritesProvider>
      </QueryClientProvider>,
    )

    const link = screen.getByRole('link', { name: /bulbasaur/i })
    expect(link).toHaveAttribute('href', '/pokemon/1')
    expect(screen.getByText('grass')).toBeInTheDocument()
    expect(screen.getByAltText(/bulbasaur official artwork/i)).toBeInTheDocument()
  })

  it('toggles favorites without following the dossier link', async () => {
    const user = userEvent.setup()
    const summary = mapPokemonSummary(bulbasaurDto)
    const client = new QueryClient()
    render(
      <QueryClientProvider client={client}>
        <FavoritesProvider>
          <MemoryRouter>
            <PokemonCard pokemon={summary} />
          </MemoryRouter>
        </FavoritesProvider>
      </QueryClientProvider>,
    )

    const toggle = screen.getByRole('button', { name: /add bulbasaur to favorites/i })
    await user.click(toggle)
    expect(
      screen.getByRole('button', { name: /remove bulbasaur from favorites/i }),
    ).toHaveAttribute('aria-pressed', 'true')
  })
})
