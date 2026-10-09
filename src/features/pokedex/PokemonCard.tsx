import { usePrefetchPokemon } from '@/api/pokeapi/queries.ts'
import { TransitionLink } from '@/app/router/TransitionLink.tsx'
import { HolographicSurface } from '@/components/ui/HolographicSurface.tsx'
import { TypeBadge } from '@/components/ui/TypeBadge.tsx'
import { FavoriteButton } from '@/features/favorites/FavoriteButton.tsx'
import { formatPokedexId } from '@/domain/pokemon/format.ts'
import { pokemonArtTransitionName, pokemonNumeralTransitionName } from '@/lib/view-transitions.ts'
import type { PokemonSummary } from '@/domain/pokemon/types.ts'
import './PokemonCard.css'

interface PokemonCardProps {
  pokemon: PokemonSummary
}

/**
 * Expressive specimen card (RC1): holographic tilt + foil on the artwork
 * chamber, type-tinted atmosphere, instrument framing and an index
 * watermark — while the link, name and badges stay plain DOM for
 * readability, keyboard users and reduced-motion mode.
 */
export function PokemonCard({ pokemon }: PokemonCardProps) {
  const prefetch = usePrefetchPokemon()
  const artwork = pokemon.artwork.official ?? pokemon.artwork.home ?? pokemon.artwork.sprite
  const primaryType = pokemon.types[0]?.name ?? 'unknown'

  return (
    <article className="pokemon-card" data-type={primaryType}>
      <FavoriteButton id={pokemon.id} name={pokemon.displayName} />
      <TransitionLink
        to={`/pokemon/${pokemon.id}`}
        className="pokemon-card-link"
        aria-label={`${pokemon.displayName}, ${formatPokedexId(pokemon.id)}`}
        onMouseEnter={() => prefetch(pokemon.id)}
        onFocus={() => prefetch(pokemon.id)}
      >
        <HolographicSurface className="pokemon-card-holo">
          <div className="pokemon-card-media">
            <span
              className="pokemon-card-watermark"
              aria-hidden="true"
              style={{ viewTransitionName: pokemonNumeralTransitionName(pokemon.id) }}
            >
              {formatPokedexId(pokemon.id)}
            </span>
            {artwork ? (
              <img
                className="pokemon-card-art"
                src={artwork}
                alt={`${pokemon.displayName} official artwork`}
                loading="lazy"
                decoding="async"
                width={160}
                height={160}
                style={{ viewTransitionName: pokemonArtTransitionName(pokemon.id) }}
              />
            ) : (
              <div
                className="pokemon-card-missing"
                role="img"
                aria-label={`No artwork for ${pokemon.displayName}`}
              >
                ?
              </div>
            )}
          </div>
        </HolographicSurface>
        <div className="pokemon-card-body">
          <p className="pokemon-card-id">{formatPokedexId(pokemon.id)}</p>
          <h2 className="pokemon-card-name">{pokemon.displayName}</h2>
          <ul
            className="pokemon-card-types"
            aria-label={`Types: ${pokemon.types.map((t) => t.name).join(', ') || 'unknown'}`}
          >
            {pokemon.types.map((type) => (
              <li key={type.name}>
                <TypeBadge type={type.name} />
              </li>
            ))}
          </ul>
        </div>
      </TransitionLink>
    </article>
  )
}
