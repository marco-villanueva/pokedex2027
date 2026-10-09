import { describe, expect, it } from 'vitest'
import { mapEvolutionTree } from '@/api/pokeapi/mappers/evolution.mapper.ts'
import { branchingChain } from '@/tests/fixtures.ts'
import { chainSpeciesIds, tiersOf } from './tree-tiers.ts'

describe('tiersOf', () => {
  it('groups a branching chain by depth', () => {
    const tree = mapEvolutionTree(branchingChain.id, branchingChain.chain)
    const tiers = tiersOf(tree.root)
    expect(tiers).toHaveLength(2)
    expect(tiers[0]?.nodes.map((node) => node.speciesName)).toEqual(['eevee'])
    expect(tiers[1]?.nodes).toHaveLength(3)
  })
})

describe('chainSpeciesIds', () => {
  it('collects every species once in visit order', () => {
    const tree = mapEvolutionTree(branchingChain.id, branchingChain.chain)
    expect(chainSpeciesIds(tree.root)).toEqual([133, 134, 135, 196])
  })
})
