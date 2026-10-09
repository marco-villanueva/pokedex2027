/** Raw PokéAPI `NamedAPIResource` envelope. */
export interface NamedApiResource {
  name: string
  url: string
}

/** Paginated collection envelope used by PokéAPI list endpoints. */
export interface PaginatedList<T = NamedApiResource> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}
