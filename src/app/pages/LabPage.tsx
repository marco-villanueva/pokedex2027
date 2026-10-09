import { useQueries } from '@tanstack/react-query'
import { useState } from 'react'
import { pokemonSummaryOptions } from '@/api/pokeapi/queries.ts'
import { Button } from '@/components/ui/Button.tsx'
import { DataLabel } from '@/components/ui/DataLabel.tsx'
import { FilterChip } from '@/components/ui/FilterChip.tsx'
import { ScannerRing } from '@/components/ui/ScannerRing.tsx'
import { SearchField } from '@/components/ui/SearchField.tsx'
import { StatBar } from '@/components/ui/StatBar.tsx'
import { TypeBadge } from '@/components/ui/TypeBadge.tsx'
import { PokemonCard } from '@/features/pokedex/PokemonCard.tsx'
import { sectionTitle, usePageTitle } from '@/lib/use-page-title.ts'
import './LabPage.css'

const TYPES = [
  'normal',
  'fire',
  'water',
  'electric',
  'grass',
  'ice',
  'fighting',
  'poison',
  'ground',
  'flying',
  'psychic',
  'bug',
  'rock',
  'ghost',
  'dragon',
  'dark',
  'steel',
  'fairy',
]

/** Required RC1 type explorations, each with a signature specimen. */
const TYPE_STUDIES = [
  { type: 'fire', id: 6, note: 'Ember atmosphere · warm key light' },
  { type: 'water', id: 9, note: 'Refraction grid · cool depth' },
  { type: 'grass', id: 3, note: 'Organic diffusion · botanical tint' },
  { type: 'electric', id: 25, note: 'High-voltage accents · line energy' },
  { type: 'psychic', id: 65, note: 'Orbital depth · violet field' },
  { type: 'ghost', id: 94, note: 'Fogged contrast · muted drift' },
]

/**
 * RC1 visual playground (internal route): validates the type-driven token
 * system and primitives across all identities before the app scales on them.
 * Not linked from primary navigation.
 */
export function LabPage() {
  const [search, setSearch] = useState('pikachu')
  const [activeTypes, setActiveTypes] = useState<string[]>(['fire'])
  usePageTitle(sectionTitle('Visual lab'))

  const toggleType = (type: string) => {
    setActiveTypes((current) =>
      current.includes(type) ? current.filter((t) => t !== type) : [...current, type],
    )
  }

  return (
    <section aria-label="Visual language lab" className="lab">
      <p className="eyebrow">RC1 · Visual language · internal</p>
      <h1 className="lab-title">Type &amp; material lab</h1>
      <p className="lab-subtitle">
        Every swatch sets <code>data-type</code>; badges, glyphs and ambient surfaces inherit{' '}
        <code>var(--type-*)</code>. Identity is always color plus label plus glyph — never color
        alone.
      </p>

      <h2 className="lab-heading">Type matrix</h2>
      <ul className="lab-type-grid">
        {TYPES.map((type) => (
          <li key={type} className="lab-swatch" data-type={type}>
            <span className="lab-swatch-name">{type}</span>
            <TypeBadge type={type} />
          </li>
        ))}
      </ul>

      <h2 className="lab-heading">Specimen studies</h2>
      <p className="lab-note">
        Required RC1 explorations — one signature specimen per identity, rendered through the
        production card.
      </p>
      <TypeStudies />

      <h2 className="lab-heading">Button primitives</h2>
      <div className="lab-row">
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="secondary" loading>
          Loading
        </Button>
        <Button variant="secondary" disabled>
          Disabled
        </Button>
      </div>

      <h2 className="lab-heading">Search field</h2>
      <form role="search" aria-label="Lab search demo" onSubmit={(e) => e.preventDefault()}>
        <SearchField
          id="lab-search"
          label="Search specimens"
          value={search}
          onChange={setSearch}
          placeholder="e.g. gengar or #94"
        />
      </form>

      <h2 className="lab-heading">Filter chips</h2>
      <div className="lab-row" role="group" aria-label="Type filter demo">
        {['fire', 'water', 'grass', 'electric', 'psychic', 'ghost'].map((type) => (
          <FilterChip
            key={type}
            selected={activeTypes.includes(type)}
            onClick={() => toggleType(type)}
          >
            {type}
          </FilterChip>
        ))}
        <FilterChip disabled>Locked</FilterChip>
      </div>

      <h2 className="lab-heading">Data labels</h2>
      <dl className="lab-data-grid">
        <DataLabel term="Height" value="1.7 m" />
        <DataLabel term="Weight" value="90.5 kg" />
        <DataLabel term="Generation" value="Generation I" mono={false} />
        <DataLabel term="Capture rate" value="45" />
      </dl>

      <h2 className="lab-heading">Stat bars</h2>
      <div className="lab-stats" data-type="fire">
        <StatBar label="HP" value={78} />
        <StatBar label="Attack" value={84} />
        <StatBar label="Sp. Atk" value={109} />
        <StatBar label="Speed" value={100} />
      </div>

      <h2 className="lab-heading">Scanner</h2>
      <div className="lab-scanner-row">
        <div className="lab-scanner-cell" data-type="electric">
          <ScannerRing label="Acquire" />
        </div>
        <div className="lab-scanner-cell" data-type="psychic">
          <ScannerRing label="Analyse" />
        </div>
        <div className="lab-scanner-cell" data-type="ghost">
          <ScannerRing label="Contain" />
        </div>
      </div>
    </section>
  )
}

function TypeStudies() {
  const studies = useQueries({
    queries: TYPE_STUDIES.map((study) => pokemonSummaryOptions(study.id)),
  })
  const pending = studies.some((s) => s.isPending)
  const failed = studies.find((s) => s.isError)

  if (pending) {
    return (
      <p className="lab-note" role="status">
        Materialising study specimens…
      </p>
    )
  }
  if (failed || studies.some((s) => !s.data)) {
    return (
      <p className="lab-note" role="alert">
        Study specimens unavailable — check archive uplink and retry.
      </p>
    )
  }
  return (
    <ul className="lab-study-grid">
      {TYPE_STUDIES.map((study, index) => (
        <li key={study.type} className="lab-study">
          <PokemonCard pokemon={studies[index]!.data!} />
          <p className="lab-study-note">{study.note}</p>
        </li>
      ))}
    </ul>
  )
}
