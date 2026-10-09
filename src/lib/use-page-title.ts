import { useEffect } from 'react'

export const ARCHIVE_TITLE = 'Pokédex // 2027 — Advanced Pokémon Research Interface'

/**
 * Per-route document title (bookmarks, history, tab/orientation cues).
 * Restores the archive title on unmount so back-navigation never strands
 * a stale dossier name in the tab.
 */
export function usePageTitle(title: string): void {
  useEffect(() => {
    const previous = document.title
    document.title = title
    return () => {
      document.title = previous
    }
  }, [title])
}

/** Static section titles share one suffix convention. */
export function sectionTitle(section: string): string {
  return `${section} · Pokédex // 2027`
}
