import type { EvolutionNode } from '@/domain/evolution/types.ts'

export interface TreeTier {
  depth: number
  nodes: EvolutionNode[]
}

/** Group a chain into depth tiers for column layout (breadth-first). */
export function tiersOf(root: EvolutionNode): TreeTier[] {
  const tiers: TreeTier[] = []
  const visit = (node: EvolutionNode, depth: number): void => {
    const tier = tiers[depth]
    if (tier) tier.nodes.push(node)
    else tiers[depth] = { depth, nodes: [node] }
    for (const child of node.children) visit(child, depth + 1)
  }
  visit(root, 0)
  return tiers
}

/** All species ids in the chain (bounded: chains are small). */
export function chainSpeciesIds(root: EvolutionNode): number[] {
  const ids: number[] = []
  const visit = (node: EvolutionNode): void => {
    ids.push(node.speciesId)
    for (const child of node.children) visit(child)
  }
  visit(root)
  return ids
}
