import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Button } from '@/components/ui/Button.tsx'
import { DataLabel } from '@/components/ui/DataLabel.tsx'
import { FilterChip } from '@/components/ui/FilterChip.tsx'
import { SearchField } from '@/components/ui/SearchField.tsx'
import { StatBar } from '@/components/ui/StatBar.tsx'
import { TypeBadge } from '@/components/ui/TypeBadge.tsx'

describe('Button', () => {
  it('renders variants with accessible names', () => {
    render(
      <>
        <Button variant="primary">Launch scan</Button>
        <Button variant="ghost">Cancel</Button>
      </>,
    )
    expect(screen.getByRole('button', { name: 'Launch scan' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
  })

  it('disables interaction while loading and announces busy state', () => {
    render(<Button loading>Save team</Button>)
    const button = screen.getByRole('button', { name: /working/i })
    expect(button).toBeDisabled()
    expect(button).toHaveAttribute('aria-busy', 'true')
  })
})

describe('TypeBadge', () => {
  it('always pairs color with a text label', () => {
    render(<TypeBadge type="fire" />)
    const badge = screen.getByTitle('fire type')
    expect(badge).toHaveTextContent('fire')
    expect(badge).toHaveAttribute('data-type', 'fire')
  })
})

describe('SearchField', () => {
  it('is labelled and clears via an accessible action', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    const { rerender } = render(
      <SearchField id="q" label="Search specimens" value="pika" onChange={onChange} />,
    )
    expect(screen.getByLabelText('Search specimens')).toHaveValue('pika')

    await user.click(screen.getByRole('button', { name: 'Clear search' }))
    expect(onChange).toHaveBeenCalledWith('')

    rerender(<SearchField id="q" label="Search specimens" value="" onChange={onChange} />)
    expect(screen.queryByRole('button', { name: 'Clear search' })).not.toBeInTheDocument()
  })

  it('exposes a loading status', () => {
    render(<SearchField id="q" label="Search" value="a" onChange={() => {}} loading />)
    expect(screen.getByRole('status', { name: 'Searching' })).toBeInTheDocument()
  })
})

describe('FilterChip', () => {
  it('toggles pressed state on click', async () => {
    const user = userEvent.setup()
    let selected = false
    const onClick = vi.fn(() => {
      selected = !selected
    })
    const { rerender } = render(
      <FilterChip selected={selected} onClick={onClick}>
        Fire
      </FilterChip>,
    )
    const chip = screen.getByRole('button', { name: /fire/i })
    expect(chip).toHaveAttribute('aria-pressed', 'false')

    await user.click(chip)
    expect(onClick).toHaveBeenCalled()
    rerender(
      <FilterChip selected onClick={onClick}>
        Fire
      </FilterChip>,
    )
    expect(chip).toHaveAttribute('aria-pressed', 'true')
  })
})

describe('DataLabel', () => {
  it('renders a term/value pair inside description lists', () => {
    render(
      <dl>
        <DataLabel term="Height" value="1.7 m" />
      </dl>,
    )
    expect(screen.getByText('Height')).toBeInTheDocument()
    expect(screen.getByText('1.7 m')).toBeInTheDocument()
  })
})

describe('StatBar', () => {
  it('announces the numeric value, not just the bar', () => {
    render(<StatBar label="Attack" value={84} />)
    expect(screen.getByRole('img', { name: 'Attack: 84 out of 180' })).toBeInTheDocument()
    expect(screen.getByText('84')).toBeInTheDocument()
  })
})
