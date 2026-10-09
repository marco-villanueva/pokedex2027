import { Link, useParams, useSearchParams } from 'react-router'
import { ApiError } from '@/api/pokeapi/client.ts'
import { usePokemonDetails, usePrefetchPokemon } from '@/api/pokeapi/queries.ts'
import { TransitionLink } from '@/app/router/TransitionLink.tsx'
import { Button } from '@/components/ui/Button.tsx'
import { DataLabel } from '@/components/ui/DataLabel.tsx'
import { ErrorPanel } from '@/components/ui/DataStates.tsx'
import { HolographicSurface } from '@/components/ui/HolographicSurface.tsx'
import { ScannerRing } from '@/components/ui/ScannerRing.tsx'
import { StatBar } from '@/components/ui/StatBar.tsx'
import { TypeBadge } from '@/components/ui/TypeBadge.tsx'
import { FadeIn } from '@/components/motion/FadeIn.tsx'
import { FavoriteButton } from '@/features/favorites/FavoriteButton.tsx'
import { TeamAddButton } from '@/features/team-builder/TeamAddButton.tsx'
import { AbilityRows } from './AbilityRows.tsx'
import { EvolutionPreview } from './EvolutionPreview.tsx'
import { MatchupsPanel } from './MatchupsPanel.tsx'
import { RelatedStrip } from './RelatedStrip.tsx'
import { SpriteMatrix } from './SpriteMatrix.tsx'
import {
  formatHeight,
  formatPokedexId,
  formatWeight,
  generationLabel,
  statLabel,
} from '@/domain/pokemon/format.ts'
import { heroArtwork, totalBaseStats } from '@/domain/pokemon/types.ts'
import { gallerySprites } from '@/domain/pokemon/types.ts'
import { generationIdFor, MAX_CANONICAL_ID } from '@/domain/explorer/generations.ts'
import { pokemonArtTransitionName, pokemonNumeralTransitionName } from '@/lib/view-transitions.ts'
import { sectionTitle, usePageTitle } from '@/lib/use-page-title.ts'
import './DetailPage.css'
import './AbilityRows.css'
import './EvolutionPreview.css'
import './MatchupsPanel.css'
import './RelatedStrip.css'
import './SpriteMatrix.css'

/**
 * RC3 dossier: scanner hero (reticle + holographic artwork + type
 * environment), shareable shiny variant, primitive-driven data panels.
 * All motion and depth degrade to a static, fully legible composition.
 */
export function DetailPage() {
  const { idOrName = '' } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const details = usePokemonDetails(idOrName)
  const prefetch = usePrefetchPokemon()

  const shiny = searchParams.get('shiny') === '1'
  usePageTitle(
    details.data
      ? `${details.data.displayName} ${formatPokedexId(details.data.id)} · Pokédex // 2027`
      : sectionTitle('Dossier'),
  )
  const setShiny = (next: boolean) => {
    const params = new URLSearchParams(searchParams)
    if (next) params.set('shiny', '1')
    else params.delete('shiny')
    setSearchParams(params, { replace: true, preventScrollReset: true })
  }

  if (details.isPending) {
    return (
      <section aria-label="Pokémon dossier" aria-busy="true" className="dossier dossier-pending">
        <p role="status" className="dossier-pending-label">
          Retrieving dossier for “{idOrName}”…
        </p>
        <div className="dossier-hero" aria-hidden="true">
          <div className="skeleton-card dossier-pending-chamber" />
          <div className="dossier-pending-identity">
            <span className="skeleton-card dossier-pending-title" />
            <span className="dossier-pending-badges">
              <span className="skeleton-card" />
              <span className="skeleton-card" />
            </span>
            <span className="skeleton-card dossier-pending-row" />
            <span className="skeleton-card dossier-pending-row" />
            <span className="skeleton-card dossier-pending-row" />
          </div>
        </div>
        <div className="dossier-pending-panels" aria-hidden="true">
          <div className="skeleton-card" />
          <div className="skeleton-card" />
        </div>
      </section>
    )
  }

  if (details.isError) {
    const notFound = details.error instanceof ApiError && details.error.kind === 'not-found'
    const message =
      details.error instanceof ApiError || details.error instanceof Error
        ? details.error.message
        : 'An unexpected error occurred.'
    return (
      <section aria-label="Pokémon dossier">
        <ErrorPanel
          title={notFound ? `No specimen “${idOrName}”` : 'Dossier unavailable'}
          message={
            notFound
              ? 'The archive holds no Pokémon under that name or number. Check the spelling and retry.'
              : message
          }
          onRetry={() => details.refetch()}
        />
        <p className="detail-back">
          <Link to="/pokedex">← Return to explorer</Link>
        </p>
      </section>
    )
  }

  const pokemon = details.data
  const artwork = heroArtwork(pokemon, shiny)
  const hasShiny = Boolean(
    pokemon.artwork.officialShiny ?? pokemon.artwork.homeShiny ?? pokemon.artwork.showdownShiny,
  )
  const id = pokemon.id

  return (
    <article
      aria-label={`${pokemon.displayName} dossier`}
      className="dossier"
      data-type={pokemon.types[0]?.name ?? 'unknown'}
    >
      <nav className="dossier-context" aria-label="Dossier navigation">
        <Link to="/pokedex">← Explorer</Link>
        <div className="dossier-stepper">
          {id > 1 ? (
            <TransitionLink
              to={`/pokemon/${id - 1}`}
              aria-label={`Previous Pokémon, number ${id - 1}`}
              onMouseEnter={() => prefetch(id - 1)}
              onFocus={() => prefetch(id - 1)}
            >
              ← #{id - 1}
            </TransitionLink>
          ) : (
            <span aria-hidden="true" className="is-disabled">
              ← #—
            </span>
          )}
          <span
            className="dossier-id"
            style={{ viewTransitionName: pokemonNumeralTransitionName(id) }}
          >
            {formatPokedexId(id)}
          </span>
          {id < MAX_CANONICAL_ID ? (
            <TransitionLink
              to={`/pokemon/${id + 1}`}
              aria-label={`Next Pokémon, number ${id + 1}`}
              onMouseEnter={() => prefetch(id + 1)}
              onFocus={() => prefetch(id + 1)}
            >
              #{id + 1} →
            </TransitionLink>
          ) : (
            <span aria-hidden="true" className="is-disabled">
              #— →
            </span>
          )}
        </div>
      </nav>

      <FadeIn key={`hero-${id}`}>
        <header className="dossier-hero">
          <div className="scanner-chamber">
            <div className="scanner-field" aria-hidden="true">
              <ScannerRing label={shiny ? 'Shiny' : 'Standard'} />
            </div>
            <HolographicSurface className="scanner-holo">
              {artwork ? (
                <img
                  className="scanner-art"
                  src={artwork}
                  alt={`${pokemon.displayName} ${shiny ? 'shiny' : 'official'} artwork`}
                  width={320}
                  height={320}
                  fetchPriority="high"
                  style={{ viewTransitionName: pokemonArtTransitionName(id) }}
                />
              ) : (
                <div
                  className="dossier-missing"
                  role="img"
                  aria-label={`No artwork available for ${pokemon.displayName}`}
                >
                  No artwork in archive
                </div>
              )}
            </HolographicSurface>
            <p className="scanner-readout" aria-hidden="true">
              <span>{formatPokedexId(id)}</span>
              <span>{shiny ? 'SHN' : 'STD'}</span>
            </p>
            <div className="scanner-variant" role="group" aria-label="Artwork variant">
              <Button
                variant={shiny ? 'ghost' : 'secondary'}
                aria-pressed={!shiny}
                onClick={() => setShiny(false)}
              >
                Standard
              </Button>
              <Button
                variant={shiny ? 'secondary' : 'ghost'}
                aria-pressed={shiny}
                onClick={() => setShiny(true)}
              >
                Shiny
              </Button>
            </div>
            {shiny && !hasShiny && (
              <p className="scanner-note" role="note">
                Shiny specimen not archived — showing standard artwork.
              </p>
            )}
          </div>

          <div className="dossier-identity">
            <p className="eyebrow">{pokemon.species.genus ?? 'Specimen record'}</p>
            <h1>{pokemon.displayName}</h1>
            <div className="dossier-actions">
              <FavoriteButton id={id} name={pokemon.displayName} />
              <TeamAddButton id={id} name={pokemon.displayName} />
            </div>
            <ul
              className="dossier-types"
              aria-label={`Types: ${pokemon.types.map((t) => t.name).join(', ')}`}
            >
              {pokemon.types.map((type) => (
                <li key={type.name}>
                  <TypeBadge type={type.name} />
                </li>
              ))}
            </ul>
            {(pokemon.species.isLegendary || pokemon.species.isMythical) && (
              <p className="dossier-flags" role="note">
                {pokemon.species.isLegendary && <span>Legendary</span>}
                {pokemon.species.isMythical && <span>Mythical</span>}
              </p>
            )}
            {pokemon.species.description && (
              <p className="dossier-flavor">{pokemon.species.description}</p>
            )}
            <dl className="dossier-meta">
              <DataLabel term="Height" value={formatHeight(pokemon.heightMeters)} />
              <DataLabel term="Weight" value={formatWeight(pokemon.weightKilograms)} />
              <DataLabel
                term="Generation"
                value={generationLabel(pokemon.species.generation) ?? 'Unknown'}
                mono={false}
                href={
                  generationIdFor(pokemon.species.generation) !== undefined
                    ? `/pokedex?generation=${generationIdFor(pokemon.species.generation)}`
                    : undefined
                }
              />
              <DataLabel term="Total stats" value={String(totalBaseStats(pokemon.stats))} />
            </dl>
          </div>
        </header>
      </FadeIn>

      <div className="dossier-panels">
        <FadeIn key={`stats-${id}`}>
          <section aria-labelledby="dossier-stats-heading" className="panel">
            <h2 id="dossier-stats-heading">Base statistics</h2>
            <div className="panel-stats">
              {pokemon.stats.map((stat) => (
                <StatBar key={stat.name} label={statLabel(stat.name)} value={stat.value} />
              ))}
            </div>
          </section>
        </FadeIn>

        <FadeIn key={`abilities-${id}`} delay={0.06}>
          <section aria-labelledby="dossier-abilities-heading" className="panel">
            <h2 id="dossier-abilities-heading">Abilities</h2>
            <AbilityRows abilities={pokemon.abilities} />
          </section>
        </FadeIn>

        <FadeIn key={`matchups-${id}`} delay={0.09}>
          <MatchupsPanel types={pokemon.types.map((type) => type.name)} />
        </FadeIn>

        <FadeIn key={`related-${id}`} delay={0.15}>
          <RelatedStrip primaryType={pokemon.types[0]?.name} currentId={id} />
        </FadeIn>

        <FadeIn key={`evo-${id}`} delay={0.12}>
          <EvolutionPreview chainId={pokemon.species.evolutionChainId} currentId={id} />
        </FadeIn>

        <FadeIn key={`sprites-${id}`} delay={0.18}>
          <SpriteMatrix
            sprites={gallerySprites(pokemon, shiny)}
            displayName={pokemon.displayName}
          />
        </FadeIn>
      </div>
    </article>
  )
}
