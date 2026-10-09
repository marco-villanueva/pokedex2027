import { useTeam } from './team-context.tsx'

/**
 * Team admission button for dossiers: adds the specimen, reports
 * duplicates and the six-member ceiling without navigating away.
 */
export function TeamAddButton({ id, name }: { id: number; name: string }) {
  const { members, isFull, addMember, lastError, persistError } = useTeam()
  const enrolled = members.includes(id)

  if (enrolled) {
    return (
      <p className="team-note" role="status">
        {name} is on your team.
      </p>
    )
  }

  return (
    <div className="team-add">
      <button
        type="button"
        className="btn"
        disabled={isFull}
        onClick={() => addMember(id)}
        aria-label={isFull ? 'Team is full (six members)' : `Add ${name} to your team`}
      >
        {isFull ? 'Team full' : 'Add to team'}
      </button>
      {lastError === 'full' && (
        <p className="team-note" role="alert">
          Team holds six at most — remove one first.
        </p>
      )}
      {lastError === 'duplicate' && (
        <p className="team-note" role="alert">
          Already on your team.
        </p>
      )}
      {persistError && (
        <p className="team-note" role="alert">
          {persistError}
        </p>
      )}
    </div>
  )
}
