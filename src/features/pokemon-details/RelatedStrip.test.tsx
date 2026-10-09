import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import { RelatedStrip } from './RelatedStrip.tsx'

describe('RelatedStrip', () => {
  it('renders nothing without a primary type', () => {
    const client = new QueryClient()
    const { container } = render(
      <QueryClientProvider client={client}>
        <MemoryRouter>
          <RelatedStrip primaryType={undefined} currentId={6} />
        </MemoryRouter>
      </QueryClientProvider>,
    )
    expect(container).toBeEmptyDOMElement()
  })

  it('links to the type explorer when the roster is pending', () => {
    const client = new QueryClient()
    render(
      <QueryClientProvider client={client}>
        <MemoryRouter>
          <RelatedStrip primaryType="fire" currentId={6} />
        </MemoryRouter>
      </QueryClientProvider>,
    )
    expect(screen.getByRole('link', { name: /browse all/i })).toHaveAttribute(
      'href',
      '/pokedex?type=fire',
    )
  })
})
