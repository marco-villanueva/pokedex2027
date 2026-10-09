import { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react'
import './CommandPalette.css'

const CommandPalettePanel = lazy(() =>
  import('./CommandPalettePanel.tsx').then((module) => ({ default: module.CommandPalettePanel })),
)

/**
 * Command palette entry (§7 P1-7): featherweight eager trigger.
 * The panel (index query, ranking UI) lazy-loads on first intent so the
 * entry chunk never pays for unvisited code (RC7 budget rule).
 */
export function CommandPalette() {
  const [wanted, setWanted] = useState(false)
  const [open, setOpen] = useState(false)
  const openRef = useRef(false)
  const wasOpenRef = useRef(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const closeRef = useRef<(() => void) | null>(null)

  const requestToggle = useCallback(() => {
    if (openRef.current) closeRef.current?.()
    else setWanted(true)
  }, [])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        requestToggle()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [requestToggle])

  const handleToggle = useCallback((next: boolean) => {
    openRef.current = next
    setOpen(next)
    if (!next) setWanted(false)
  }, [])

  // After a close that strands focus (Esc, activation), land back on the
  // trigger — never on load (only after having been open).
  useEffect(() => {
    if (wasOpenRef.current && !open && document.activeElement === document.body) {
      triggerRef.current?.focus()
    }
    wasOpenRef.current = open
  }, [open])

  const handleApi = useCallback((close: () => void) => {
    closeRef.current = close
  }, [])

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="px-palette-trigger"
        aria-expanded={open}
        aria-controls="px-palette-panel"
        aria-label="Quick jump to a Pokémon or section (Control K)"
        onClick={requestToggle}
      >
        <span aria-hidden="true">⌕</span>
        <span className="px-palette-trigger-label">Jump</span>
        <kbd className="px-palette-kbd" aria-hidden="true">
          Ctrl K
        </kbd>
      </button>
      {wanted && (
        <Suspense fallback={null}>
          <CommandPalettePanel onToggle={handleToggle} onApi={handleApi} />
        </Suspense>
      )}
    </>
  )
}
