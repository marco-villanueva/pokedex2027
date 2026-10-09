import { useQueries, useQuery } from '@tanstack/react-query'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router'
import { ApiError } from '@/api/pokeapi/client.ts'
import {
  pokemonIndexOptions,
  pokemonSummaryOptions,
  pokemonTypeOptions,
} from '@/api/pokeapi/queries.ts'
import { Button } from '@/components/ui/Button.tsx'
import { EmptyState, ErrorPanel, LoadingGrid } from '@/components/ui/DataStates.tsx'
import { FilterChip } from '@/components/ui/FilterChip.tsx'
import { HelpPopover } from '@/components/ui/HelpPopover.tsx'
import { SearchField } from '@/components/ui/SearchField.tsx'
import {
  applyExplorerFilters,
  DEFAULT_FILTERS,
  FILTERABLE_TYPES,
  parseExplorerParams,
  serializeExplorerParams,
  SORT_OPTIONS,
} from '@/domain/explorer/filters.ts'
import { GENERATIONS } from '@/domain/explorer/generations.ts'
import type { ExplorerFilters } from '@/domain/explorer/filters.ts'
import { sectionTitle, usePageTitle } from '@/lib/use-page-title.ts'
import { PokemonCard } from './PokemonCard.tsx'
import './ExplorerPage.css'

/** Cards materialised per infinite window — bounded detail batch. */
const WINDOW_SIZE = 48

function errorMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message
  if (error instanceof Error) return error.message
  return 'An unexpected error occurred.'
}

/**
 * RC2 Explorer: global search + type/generation filters + sort over the
 * canonical index, all mirrored in URL params. Details load only for the
 * visible infinite window and stay cached under the shared summary keys,
 * so detail navigation never refetches.
 */
export function ExplorerPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const filters = useMemo(() => parseExplorerParams(searchParams), [searchParams])
  usePageTitle(sectionTitle('Pokédex Explorer'))

  const updateFilters = (patch: Partial<ExplorerFilters>) => {
    const next: ExplorerFilters = { ...filters, ...patch }
    setSearchParams(serializeExplorerParams(next), { replace: true, preventScrollReset: true })
  }

  const indexQuery = useQuery(pokemonIndexOptions())
  const typeQuery = useQuery(pokemonTypeOptions(filters.type))

  const typeIds = useMemo(
    () => (typeQuery.data !== undefined ? new Set(typeQuery.data) : undefined),
    [typeQuery.data],
  )

  const results = useMemo(
    () => (indexQuery.data ? applyExplorerFilters(indexQuery.data, filters, typeIds) : []),
    [indexQuery.data, filters, typeIds],
  )

  const [visibleCount, setVisibleCount] = useState(WINDOW_SIZE)
  const filterKey = serializeExplorerParams(filters).toString()
  // Reset the infinite window when the result set identity changes.
  // Render-time adjustment (no effect): keeps URL as source of truth.
  const [lastFilterKey, setLastFilterKey] = useState(filterKey)
  if (lastFilterKey !== filterKey) {
    setLastFilterKey(filterKey)
    setVisibleCount(WINDOW_SIZE)
  }

  const visible = results.slice(0, visibleCount)
  const summaries = useQueries({ queries: visible.map((entry) => pokemonSummaryOptions(entry.id)) })

  const sentinelRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (visibleCount >= results.length) return
    const sentinel = sentinelRef.current
    if (!sentinel) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisibleCount((count) => Math.min(count + WINDOW_SIZE, results.length))
        }
      },
      { rootMargin: '600px' },
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [visibleCount, results.length])

  const generationCounts = useMemo(() => {
    const counts = new Map<number, number>()
    for (const entry of indexQuery.data ?? []) {
      const gen = GENERATIONS.find((g) => entry.id >= g.from && entry.id <= g.to)
      if (gen) counts.set(gen.id, (counts.get(gen.id) ?? 0) + 1)
    }
    return counts
  }, [indexQuery.data])

  const hasActiveFilters =
    filters.query.trim() !== '' || filters.type !== undefined || filters.generation !== undefined
  const clearAll = () => {
    setSearchParams(serializeExplorerParams(DEFAULT_FILTERS), {
      replace: true,
      preventScrollReset: true,
    })
  }

  const cards = summaries.map((query) => query.data).filter((card) => card !== undefined)
  const byId = new Map(cards.map((card) => [card.id, card]))
  const cardsPending = summaries.some((query) => query.isPending)
  const cardsFailed = summaries.filter((query) => query.isError)
  const retryCards = () => {
    for (const query of cardsFailed) void query.refetch()
  }

  return (
    <section aria-label="Pokédex explorer">
      <div className="explorer-header">
        <div>
          <p className="eyebrow">Archive index · all generations</p>
          <h1 className="explorer-title">Pokédex Explorer</h1>
          <p className="explorer-subtitle">
            {indexQuery.data
              ? `${indexQuery.data.length.toLocaleString()} specimens in reach — search and filters apply across the full archive.`
              : 'Establishing uplink with the archive…'}
          </p>
        </div>
        <form
          role="search"
          aria-label="Search the archive"
          className="explorer-search"
          onSubmit={(event) => event.preventDefault()}
        >
          <SearchField
            id="explorer-search-input"
            label="Search by name or number"
            value={filters.query}
            onChange={(value) => updateFilters({ query: value })}
            placeholder="e.g. pikachu or #25"
          />
        </form>
      </div>

      <div className="explorer-filters">
        <fieldset className="explorer-filter-group">
          <legend>Type</legend>
          <div className="explorer-chip-row" role="presentation">
            <FilterChip
              selected={filters.type === undefined}
              onClick={() => updateFilters({ type: undefined })}
            >
              All
            </FilterChip>
            {FILTERABLE_TYPES.map((type) => (
              <FilterChip
                key={type}
                selected={filters.type === type}
                onClick={() => updateFilters({ type: filters.type === type ? undefined : type })}
              >
                {type}
              </FilterChip>
            ))}
          </div>
        </fieldset>

        <fieldset className="explorer-filter-group">
          <legend>Generation</legend>
          <div className="explorer-chip-row" role="presentation">
            <FilterChip
              selected={filters.generation === undefined}
              onClick={() => updateFilters({ generation: undefined })}
            >
              All
            </FilterChip>
            {GENERATIONS.map((gen) => (
              <FilterChip
                key={gen.id}
                selected={filters.generation === gen.id}
                count={generationCounts.get(gen.id)}
                onClick={() =>
                  updateFilters({ generation: filters.generation === gen.id ? undefined : gen.id })
                }
              >
                {gen.id} · {gen.label}
              </FilterChip>
            ))}
          </div>
        </fieldset>

        <div className="explorer-tools">
          <label className="explorer-sort">
            <span>Sort</span>
            <select
              value={filters.sort}
              onChange={(event) =>
                updateFilters({ sort: event.target.value as ExplorerFilters['sort'] })
              }
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          {hasActiveFilters && (
            <Button variant="ghost" onClick={clearAll}>
              Clear all
            </Button>
          )}
          <HelpPopover buttonLabel="Search help" title="Searching the archive">
            <p>
              Match by name or Pokédex number — separators are ignored, so “mr mime” and
              “farfetch&apos;d” both resolve. Type and generation rails intersect with the search,
              and every combination lives in the URL, ready to share.
            </p>
          </HelpPopover>
        </div>
      </div>

      {indexQuery.isPending ? (
        <LoadingGrid label="Contacting the archive…" />
      ) : indexQuery.isError ? (
        <ErrorPanel message={errorMessage(indexQuery.error)} onRetry={() => indexQuery.refetch()} />
      ) : filters.type && typeQuery.isPending ? (
        <LoadingGrid label={`Triangulating ${filters.type} specimens…`} />
      ) : filters.type && typeQuery.isError ? (
        <ErrorPanel message={errorMessage(typeQuery.error)} onRetry={() => typeQuery.refetch()} />
      ) : results.length === 0 ? (
        <EmptyState
          title="No specimens on this frequency"
          message="Nothing in the archive matches this combination. Loosen a filter or try another name."
          action={
            <Button variant="secondary" onClick={clearAll}>
              Clear all filters
            </Button>
          }
        />
      ) : (
        <>
          <p className="explorer-status" role="status" aria-live="polite">
            {cards.length} of {results.length} specimens materialised
          </p>
          <ul className="explorer-grid" aria-busy={cardsPending || undefined}>
            {visible.map((entry) => {
              const pokemon = byId.get(entry.id)
              return (
                <li key={entry.id}>
                  {pokemon ? (
                    <PokemonCard pokemon={pokemon} />
                  ) : (
                    <div className="pokemon-card-skeleton" aria-hidden="true">
                      <span className="pokemon-card-skeleton-media" />
                      <span className="pokemon-card-skeleton-line" />
                      <span className="pokemon-card-skeleton-line pokemon-card-skeleton-title" />
                      <span className="pokemon-card-skeleton-badges">
                        <span />
                        <span />
                      </span>
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
          {cardsFailed.length > 0 && cards.length > 0 && (
            <p className="explorer-batch-error" role="alert">
              {cardsFailed.length} specimen{cardsFailed.length === 1 ? '' : 's'} failed to
              materialise.{' '}
              <button type="button" className="explorer-retry-link" onClick={retryCards}>
                Retry
              </button>
            </p>
          )}
          {cards.length === 0 && !cardsPending ? (
            <ErrorPanel message="Specimen data failed to load." onRetry={retryCards} />
          ) : (
            visibleCount < results.length && (
              <>
                <div ref={sentinelRef} className="explorer-sentinel" aria-hidden="true" />
                <div className="explorer-more">
                  <Button
                    variant="secondary"
                    onClick={() =>
                      setVisibleCount((c) => Math.min(c + WINDOW_SIZE, results.length))
                    }
                  >
                    Show more ({results.length - visibleCount} remaining)
                  </Button>
                </div>
              </>
            )
          )}
        </>
      )}
    </section>
  )
}
