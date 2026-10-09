/** Pure team-composition rules: max six, unique ids, stable order. */

export const MAX_TEAM_SIZE = 6

export type TeamError = 'full' | 'duplicate'

export function addTeamMember(
  members: number[],
  id: number,
): { members: number[] } | { error: TeamError } {
  if (members.includes(id)) return { error: 'duplicate' }
  if (members.length >= MAX_TEAM_SIZE) return { error: 'full' }
  return { members: [...members, id] }
}

export function removeTeamMember(members: number[], id: number): number[] {
  return members.filter((member) => member !== id)
}

export function moveTeamMember(members: number[], from: number, to: number): number[] {
  if (from < 0 || from >= members.length || to < 0 || to >= members.length) return members
  if (from === to) return members
  const next = [...members]
  const [moved] = next.splice(from, 1)
  next.splice(to, 0, moved as number)
  return next
}
