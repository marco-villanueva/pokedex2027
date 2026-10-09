/**
 * Related-specimen selection: nearest neighbours by id within a type roster.
 * Deterministic (no random) so URLs, tests and screenshots stay stable.
 */
export function pickRelatedIds(roster: number[], currentId: number, count = 4): number[] {
  return roster
    .filter((id) => id !== currentId)
    .sort((a, b) => Math.abs(a - currentId) - Math.abs(b - currentId) || a - b)
    .slice(0, count)
    .sort((a, b) => a - b)
}
