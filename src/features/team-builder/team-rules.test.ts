import { describe, expect, it } from 'vitest'
import { addTeamMember, MAX_TEAM_SIZE, moveTeamMember, removeTeamMember } from './team-rules.ts'

describe('team rules', () => {
  it('adds up to six unique members', () => {
    let members: number[] = []
    for (const id of [1, 4, 7, 25, 133, 150]) {
      const result = addTeamMember(members, id)
      expect('members' in result && result.members).toBeTruthy()
      if ('members' in result) members = result.members
    }
    expect(members).toHaveLength(MAX_TEAM_SIZE)
    expect(addTeamMember(members, 151)).toEqual({ error: 'full' })
  })

  it('rejects duplicates', () => {
    expect(addTeamMember([25], 25)).toEqual({ error: 'duplicate' })
  })

  it('removes members', () => {
    expect(removeTeamMember([1, 25, 150], 25)).toEqual([1, 150])
  })

  it('reorders with bounds safety', () => {
    expect(moveTeamMember([1, 25, 150], 0, 2)).toEqual([25, 150, 1])
    expect(moveTeamMember([1, 25], 5, 0)).toEqual([1, 25])
    expect(moveTeamMember([1, 25], 0, 0)).toEqual([1, 25])
  })
})
