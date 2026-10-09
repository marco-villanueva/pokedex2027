import type { CSSProperties, ReactNode } from 'react'

/**
 * Purposeful entrance: a short fade/rise when content arrives.
 * Pure CSS (see `px-enter` in base.css) — no JS animation library, zero
 * runtime cost. Global reduced-motion rules render it instant.
 */
export function FadeIn({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const style = { animationDelay: `${delay}s` } as CSSProperties
  return (
    <div className="px-enter" style={style}>
      {children}
    </div>
  )
}
