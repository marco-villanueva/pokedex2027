import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router'
import { ApiError } from '@/api/pokeapi/client.ts'
import { pokemonDetailsOptions } from '@/api/pokeapi/queries.ts'
import { Button } from '@/components/ui/Button.tsx'
import { ErrorPanel, LoadingGrid } from '@/components/ui/DataStates.tsx'
import { TypeBadge } from '@/components/ui/TypeBadge.tsx'
import { FadeIn } from '@/components/motion/FadeIn.tsx'
import { formatHeight, formatPokedexId, formatWeight, statLabel } from '@/domain/pokemon/format.ts'
import { totalBaseStats } from '@/domain/pokemon/types.ts'
import type { PokemonDetails } from '@/domain/pokemon/types.ts'
import { diffStats, parseCompareParams, serializeCompareParams } from './compare.ts'
import { SpeciesCombobox } from './SpeciesCombobox.tsx'
import { sectionTitle, usePageTitle } from '@/lib/use-page-title.ts'
import './ComparePage.css'

function randomId(): number {
  const array = new Uint32Array(1)
  crypto.getRandomValues(array)
  return ((array[0] as number) % 1025) + 1
}

/**
 * RC5 compare: two specimens side by side with numeric stat differences,
 * shareable via `?left=&right=`. Differences are text (deltas, totals,
 * leader counts) — never animation- or color-only.
 */
export function ComparePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const selection = useMemo(() => parseCompareParams(searchParams), [searchParams])
  usePageTitle(sectionTitle('Compare specimens'))

  const update = (patch: Partial<typeof selection>) => {
    setSearchParams(serializeCompareParams({ ...selection, ...patch }), {
      replace: true,
      preventScrollReset: true,
    })
  }

  const left = useQuery({
    ...pokemonDetailsOptions(selection.left ?? 'none'),
    enabled: selection.left !== undefined,
  })
  const right = useQuery({
    ...pokemonDetailsOptions(selection.right ?? 'none'),
    enabled: selection.right !== undefined,
  })

  const surprise = () => {
    const first = randomId()
    let second = randomId()
    while (second === first) second = randomId()
    setSearchParams(serializeCompareParams({ left: String(first), right: String(second) }), {
      replace: true,
    })
  }

  return (
    <section aria-label="Pokémon comparison" className="compare-page">
      <p className="eyebrow">Analysis · side by side</p>
      <h1 className="compare-title">Compare specimens</h1>
      <p className="compare-subtitle">
        Pick two specimens — every selection lives in the URL, so comparisons are shareable and
        survive reloads.
      </p>

      <div className="compare-selectors">
        <SpeciesCombobox
          label="Left specimen"
          value={selection.left}
          onSelect={(slug) => update({ left: slug })}
        />
        <div className="compare-tools">
          <Button
            variant="ghost"
            onClick={() => update({ left: selection.right, right: selection.left })}
            disabled={!selection.left && !selection.right}
            aria-label="Swap sides"
          >
            ⇄ Swap
          </Button>
          <Button variant="ghost" onClick={surprise}>
            ⚄ Surprise me
          </Button>
        </div>
        <SpeciesCombobox
          label="Right specimen"
          value={selection.right}
          onSelect={(slug) => update({ right: slug })}
        />
      </div>

      {!selection.left || !selection.right ? (
        <p className="compare-hint" role="status">
          Select a specimen on each side to begin the analysis.
        </p>
      ) : left.isPending || right.isPending ? (
        <LoadingGrid label="Retrieving both dossiers…" />
      ) : left.isError || right.isError ? (
        <CompareError
          leftSlug={selection.left}
          rightSlug={selection.right}
          leftError={left.error}
          rightError={right.error}
          onClear={(side) => update(side === 'left' ? { left: undefined } : { right: undefined })}
        />
      ) : left.data && right.data ? (
        <FadeIn key={`${left.data.id}-${right.data.id}`}>
          <ComparisonTable left={left.data} right={right.data} />
        </FadeIn>
      ) : null}
    </section>
  )
}

function CompareError({
  leftSlug,
  rightSlug,
  leftError,
  rightError,
  onClear,
}: {
  leftSlug: string
  rightSlug: string
  leftError: unknown
  rightError: unknown
  onClear: (side: 'left' | 'right') => void
}) {
  const failing: Array<{ side: 'left' | 'right'; slug: string; error: unknown }> = []
  if (leftError) failing.push({ side: 'left', slug: leftSlug, error: leftError })
  if (rightError) failing.push({ side: 'right', slug: rightSlug, error: rightError })
  const first = failing[0]
  const notFound = first?.error instanceof ApiError && first.error.kind === 'not-found'
  return (
    <ErrorPanel
      title={notFound ? `No specimen “${first?.slug}”` : 'Comparison unavailable'}
      message={
        notFound
          ? 'One side names a specimen the archive does not hold. Pick another contender.'
          : 'One dossier failed to load. Check the connection and retry.'
      }
      onRetry={() => first && onClear(first.side)}
    />
  )
}

function ComparisonTable({ left, right }: { left: PokemonDetails; right: PokemonDetails }) {
  const diffs = diffStats(left.stats, right.stats)
  const leftTotal = totalBaseStats(left.stats)
  const rightTotal = totalBaseStats(right.stats)
  const leftLeads = diffs.filter((diff) => diff.leader === 'left').length
  const rightLeads = diffs.filter((diff) => diff.leader === 'right').length
  const verdict =
    leftLeads === rightLeads
      ? 'Dead even across individual stats.'
      : leftLeads > rightLeads
        ? `${left.displayName} leads ${leftLeads}–${rightLeads} on individual stats.`
        : `${right.displayName} leads ${rightLeads}–${leftLeads} on individual stats.`

  return (
    <div className="compare-result">
      <div className="compare-heroes">
        <CompareHero pokemon={left} side="Left" />
        <CompareHero pokemon={right} side="Right" />
      </div>

      <div className="compare-table-wrap">
        <table className="compare-table">
          <caption>
            {left.displayName} versus {right.displayName} — {verdict} Totals: {leftTotal} to{' '}
            {rightTotal}.
          </caption>
          <thead>
            <tr>
              <th scope="col">Measure</th>
              <th scope="col">{left.displayName}</th>
              <th scope="col">Δ</th>
              <th scope="col">{right.displayName}</th>
            </tr>
          </thead>
          <tbody>
            <BioRow
              label="Height"
              leftText={formatHeight(left.heightMeters)}
              rightText={formatHeight(right.heightMeters)}
              leftWins={left.heightMeters > right.heightMeters}
              tied={left.heightMeters === right.heightMeters}
            />
            <BioRow
              label="Weight"
              leftText={formatWeight(left.weightKilograms)}
              rightText={formatWeight(right.weightKilograms)}
              leftWins={left.weightKilograms > right.weightKilograms}
              tied={left.weightKilograms === right.weightKilograms}
            />
            {diffs.map((diff) => (
              <tr key={diff.name}>
                <th scope="row">{statLabel(diff.name)}</th>
                <td data-leader={diff.leader === 'left' || undefined}>{diff.left}</td>
                <td className="compare-delta">
                  {diff.leader === 'tie' ? 'Tie' : `${diff.delta > 0 ? '+' : ''}${diff.delta}`}
                </td>
                <td data-leader={diff.leader === 'right' || undefined}>{diff.right}</td>
              </tr>
            ))}
            <tr className="compare-total-row">
              <th scope="row">Total</th>
              <td data-leader={leftTotal > rightTotal || undefined}>{leftTotal}</td>
              <td className="compare-delta">
                {leftTotal === rightTotal
                  ? 'Tie'
                  : `${leftTotal - rightTotal > 0 ? '+' : ''}${leftTotal - rightTotal}`}
              </td>
              <td data-leader={rightTotal > leftTotal || undefined}>{rightTotal}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

function BioRow({
  label,
  leftText,
  rightText,
  leftWins,
  tied,
}: {
  label: string
  leftText: string
  rightText: string
  leftWins: boolean
  tied: boolean
}) {
  return (
    <tr>
      <th scope="row">{label}</th>
      <td data-leader={(!tied && leftWins) || undefined}>{leftText}</td>
      <td className="compare-delta">{tied ? 'Tie' : leftWins ? 'Left' : 'Right'}</td>
      <td data-leader={(!tied && !leftWins) || undefined}>{rightText}</td>
    </tr>
  )
}

function CompareHero({ pokemon, side }: { pokemon: PokemonDetails; side: string }) {
  return (
    <article
      className="compare-hero"
      data-type={pokemon.types[0]?.name ?? 'unknown'}
      aria-label={`${side}: ${pokemon.displayName}`}
    >
      <img
        src={pokemon.artwork.official ?? pokemon.artwork.spriteFront}
        alt={`${pokemon.displayName} artwork`}
        loading="lazy"
        decoding="async"
        width={160}
        height={160}
      />
      <p className="compare-hero-id">{formatPokedexId(pokemon.id)}</p>
      <h2 className="compare-hero-name">
        <Link to={`/pokemon/${pokemon.id}`}>{pokemon.displayName}</Link>
      </h2>
      <div className="compare-hero-types">
        {pokemon.types.map((type) => (
          <TypeBadge key={type.name} type={type.name} />
        ))}
      </div>
    </article>
  )
}
