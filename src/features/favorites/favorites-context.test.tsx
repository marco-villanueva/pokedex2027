import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { FavoritesProvider, useFavorites } from './favorites-context.tsx'

function Harness() {
  const { favorites, isFavorite, toggleFavorite, clearFavorites, persistError } = useFavorites()
  return (
    <div>
      <output data-testid="list">{favorites.join(',')}</output>
      <button type="button" onClick={() => toggleFavorite(25)}>
        toggle-25
      </button>
      <button type="button" onClick={() => toggleFavorite(6)}>
        toggle-6
      </button>
      <button type="button" onClick={clearFavorites}>
        clear
      </button>
      <span data-testid="is-fav">{String(isFavorite(25))}</span>
      <span data-testid="persist-error">{persistError ?? 'none'}</span>
    </div>
  )
}

afterEach(() => {
  localStorage.clear()
})

describe('FavoritesProvider', () => {
  it('toggles and persists ids across remounts', async () => {
    const user = userEvent.setup()
    const { unmount } = render(
      <FavoritesProvider>
        <Harness />
      </FavoritesProvider>,
    )
    await user.click(screen.getByRole('button', { name: 'toggle-25' }))
    await user.click(screen.getByRole('button', { name: 'toggle-6' }))
    expect(screen.getByTestId('list')).toHaveTextContent('25,6')
    expect(JSON.parse(localStorage.getItem('pokedex2027:favorites') ?? '{}')).toEqual({
      version: 1,
      data: [25, 6],
    })
    unmount()

    render(
      <FavoritesProvider>
        <Harness />
      </FavoritesProvider>,
    )
    expect(screen.getByTestId('list')).toHaveTextContent('25,6')
    expect(screen.getByTestId('is-fav')).toHaveTextContent('true')
  })

  it('recovers from malformed storage', async () => {
    localStorage.setItem('pokedex2027:favorites', '💥')
    render(
      <FavoritesProvider>
        <Harness />
      </FavoritesProvider>,
    )
    expect(screen.getByTestId('list')).toHaveTextContent('')
  })

  it('rolls back the visible toggle when persistence fails', async () => {
    localStorage.setItem('pokedex2027:favorites', JSON.stringify({ version: 1, data: [25] }))
    const user = userEvent.setup()
    render(
      <FavoritesProvider>
        <Harness />
      </FavoritesProvider>,
    )
    expect(screen.getByTestId('list')).toHaveTextContent('25')
    vi.spyOn(Storage.prototype, 'setItem').mockImplementationOnce(() => {
      throw new Error('quota exceeded')
    })
    await user.click(screen.getByRole('button', { name: 'toggle-25' }))
    // Optimistic removal rolls back; the failure is reported, not silent.
    await waitFor(() => expect(screen.getByTestId('list')).toHaveTextContent('25'))
    await waitFor(() =>
      expect(screen.getByTestId('persist-error')).toHaveTextContent(/storage unavailable/),
    )
  })
})
