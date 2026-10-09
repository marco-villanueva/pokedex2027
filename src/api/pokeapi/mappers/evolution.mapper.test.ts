import { describe, expect, it } from 'vitest'
import { mapEvolutionTree } from '@/api/pokeapi/mappers/evolution.mapper.ts'
import { branchingChain } from '@/tests/fixtures.ts'

describe('mapEvolutionTree', () => {
  it('preserves branching with per-node conditions', () => {
    const tree = mapEvolutionTree(branchingChain.id, branchingChain.chain)
    expect(tree.chainId).toBe(67)
    expect(tree.root.speciesName).toBe('eevee')
    expect(tree.root.conditions).toEqual([])
    expect(tree.root.children).toHaveLength(3)

    const labels = new Map(
      tree.root.children.map((child) => [child.speciesName, child.conditions[0]?.label]),
    )
    expect(labels.get('vaporeon')).toBe('Water Stone')
    expect(labels.get('jolteon')).toBe('Thunder Stone')
    expect(labels.get('espeon')).toBe('High friendship · Day')
  })

  it('resolves species ids from urls', () => {
    const tree = mapEvolutionTree(branchingChain.id, branchingChain.chain)
    expect(tree.root.speciesId).toBe(133)
    expect(tree.root.children[0]?.speciesId).toBe(134)
  })
})
