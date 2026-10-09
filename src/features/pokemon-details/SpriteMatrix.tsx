import type { GallerySprite } from '@/domain/pokemon/types.ts'
import './SpriteMatrix.css'

/**
 * Sprite matrix: every archived sprite for the specimen with a stable label.
 * Pixel-art rendering preserves the sprite aesthetic; fixed cell boxes
 * prevent layout shift while images load.
 */
export function SpriteMatrix({
  sprites,
  displayName,
}: {
  sprites: GallerySprite[]
  displayName: string
}) {
  if (sprites.length === 0) return null
  return (
    <section aria-labelledby="dossier-sprites-heading" className="panel">
      <h2 id="dossier-sprites-heading">Sprite archive</h2>
      <ul className="sprite-grid">
        {sprites.map((sprite) => (
          <li key={sprite.key} className="sprite-cell">
            <img
              src={sprite.url}
              alt={`${displayName} ${sprite.label} sprite`}
              loading="lazy"
              decoding="async"
              width={96}
              height={96}
            />
            <span>{sprite.label}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
