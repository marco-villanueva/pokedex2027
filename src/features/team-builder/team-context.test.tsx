import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { TeamProvider, useTeam } from './team-context.tsx'

function Harness({ addId = 25 }: { addId?: number }) {
  const { members, isFull, lastError, persistError, addMember, removeMember, moveMember } =
    useTeam()
  return (
    <div>
      <output data-testid="members">{members.join(',')}</output>
      <output data-testid="full">{String(isFull)}</output>
      <output data-testid="error">{lastError ?? 'none'}</output>
      <output data-testid="persist-error">{persistError ?? 'none'}</output>
      <button type="button" onClick={() => addMember(addId)}>
        add
      </button>
      <button type="button" onClick={() => removeMember(25)}>
        remove-25
      </button>
      <button type="button" onClick={() => moveMember(0, 1)}>
        move
      </button>
    </div>
  )
}

function renderTeam(addId?: number) {
  return render(
    <TeamProvider>
      <Harness addId={addId} />
    </TeamProvider>,
  )
}

afterEach(() => {
  localStorage.clear()
})

describe('TeamProvider', () => {
  it('enforces six members and reports duplicates', async () => {
    const user = userEvent.setup()
    const { rerender } = renderTeam(1)
    for (const id of [1, 4, 7, 25, 133, 150]) {
      rerender(
        <TeamProvider>
          <Harness addId={id} />
        </TeamProvider>,
      )
      await user.click(screen.getByRole('button', { name: 'add' }))
    }
    expect(screen.getByTestId('members')).toHaveTextContent('1,4,7,25,133,150')
    expect(screen.getByTestId('full')).toHaveTextContent('true')

    rerender(
      <TeamProvider>
        <Harness addId={151} />
      </TeamProvider>,
    )
    await user.click(screen.getByRole('button', { name: 'add' }))
    expect(screen.getByTestId('error')).toHaveTextContent('full')
  })

  it('removes and reorders members with persistence', async () => {
    const user = userEvent.setup()
    localStorage.setItem('pokedex2027:team', JSON.stringify({ version: 1, data: [25, 6] }))
    renderTeam()
    expect(screen.getByTestId('members')).toHaveTextContent('25,6')

    await user.click(screen.getByRole('button', { name: 'move' }))
    expect(screen.getByTestId('members')).toHaveTextContent('6,25')

    await user.click(screen.getByRole('button', { name: 'remove-25' }))
    expect(screen.getByTestId('members')).toHaveTextContent('6')
    expect(JSON.parse(localStorage.getItem('pokedex2027:team') ?? '{}').data).toEqual([6])
  })

  it('rolls back the visible removal when persistence fails', async () => {
    const user = userEvent.setup()
    localStorage.setItem('pokedex2027:team', JSON.stringify({ version: 1, data: [25, 6] }))
    renderTeam()
    expect(screen.getByTestId('members')).toHaveTextContent('25,6')
    vi.spyOn(Storage.prototype, 'setItem').mockImplementationOnce(() => {
      throw new Error('quota exceeded')
    })
    await user.click(screen.getByRole('button', { name: 'remove-25' }))
    await waitFor(() => expect(screen.getByTestId('members')).toHaveTextContent('25,6'))
    await waitFor(() =>
      expect(screen.getByTestId('persist-error')).toHaveTextContent(/storage unavailable/),
    )
  })
})
