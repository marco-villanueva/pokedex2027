import { useRef } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import './HolographicSurface.css'

interface HolographicSurfaceProps {
  children: ReactNode
  /** Disable pointer reactivity (tests, low-power contexts). */
  static?: boolean
  className?: string
}

/**
 * Pointer-reactive holographic material (CSS-first 3D).
 *
 * Pointer position is written to CSS custom properties on the element via a
 * throttled rAF — React never re-renders per `pointermove`. Tilt, specular
 * highlight and foil all derive from `--px`/`--py`/`--rx`/`--ry`.
 *
 * Fallbacks: coarse pointers get a static sheen, `prefers-reduced-motion`
 * removes tilt and animated sheen entirely. Content stays fully legible
 * without any effect.
 */
export function HolographicSurface({
  children,
  static: isStatic = false,
  className,
}: HolographicSurfaceProps) {
  const ref = useRef<HTMLDivElement>(null)
  const raf = useRef(0)

  const update = (clientX: number, clientY: number) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    if (rect.width === 0 || rect.height === 0) return
    const px = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
    const py = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height))
    el.style.setProperty('--px', px.toFixed(3))
    el.style.setProperty('--py', py.toFixed(3))
    el.style.setProperty('--rx', ((0.5 - py) * 10).toFixed(2) + 'deg')
    el.style.setProperty('--ry', ((px - 0.5) * 12).toFixed(2) + 'deg')
  }

  const handleMove = (event: React.PointerEvent) => {
    if (isStatic) return
    if (event.pointerType !== 'mouse' && event.pointerType !== 'pen') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const { clientX, clientY } = event
    cancelAnimationFrame(raf.current)
    raf.current = requestAnimationFrame(() => update(clientX, clientY))
  }

  const handleLeave = () => {
    cancelAnimationFrame(raf.current)
    const el = ref.current
    if (!el) return
    el.style.setProperty('--rx', '0deg')
    el.style.setProperty('--ry', '0deg')
  }

  return (
    <div
      ref={ref}
      className={['px-holo', className].filter(Boolean).join(' ')}
      data-static={isStatic || undefined}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      style={{ '--px': 0.5, '--py': 0.35, '--rx': '0deg', '--ry': '0deg' } as CSSProperties}
    >
      <div className="px-holo-tilt">
        <div className="px-holo-foil" aria-hidden="true" />
        <div className="px-holo-spec" aria-hidden="true" />
        <div className="px-holo-content">{children}</div>
      </div>
    </div>
  )
}
