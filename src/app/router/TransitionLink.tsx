import { flushSync } from 'react-dom'
import { Link, useNavigate } from 'react-router'
import type { MouseEvent } from 'react'
import type { LinkProps } from 'react-router'
import { transitionNavigate } from '@/lib/view-transitions.ts'

/**
 * SPA View Transition link (§7 P0-1).
 *
 * Same-document morph for card ↔ dossier flows: shared
 * `view-transition-name` pairs (artwork + numeral, per specimen id) travel
 * while the rest crossfades. Progressive — without the API or under
 * `prefers-reduced-motion` it behaves exactly like `Link`.
 *
 * Keyboard behaviour is unchanged (real anchor, Enter opens, focus visible).
 */
export function TransitionLink(props: LinkProps) {
  const navigate = useNavigate()

  const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
    props.onClick?.(event)
    // Let modifier/middle clicks, new-tab intents and vetoed events pass.
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return
    }
    event.preventDefault()
    const to = props.to
    const navigateFn = () => {
      flushSync(() => {
        void navigate(to)
      })
    }
    // Prefetch-style hover handlers stay untouched; only the click morphs.
    transitionNavigate(navigateFn)
  }

  return <Link {...props} onClick={onClick} />
}
