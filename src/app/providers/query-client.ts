import { QueryClient } from '@tanstack/react-query'

/**
 * Shared QueryClient. PokéAPI reference data is effectively static, so the
 * defaults favour long-lived cache over refetching. Components override
 * per-query where fresher data matters.
 */
export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 60 * 24,
        gcTime: 1000 * 60 * 60 * 24 * 7,
        retry: 2,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
      },
    },
  })
}
