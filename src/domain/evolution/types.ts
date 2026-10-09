/**
 * Evolution domain models.
 * Evolution is a tree — never assumed linear. See `docs/DATA_MODEL.md`.
 */

export interface EvolutionCondition {
  kind:
    'level' | 'item' | 'trigger' | 'friendship' | 'time' | 'location' | 'move' | 'trade' | 'other'
  /** Human-readable summary, e.g. `Level 16`, `Thunder Stone`, `High friendship · Day`. */
  label: string
}

export interface EvolutionNode {
  speciesId: number
  speciesName: string
  displayName: string
  /** Conditions to evolve FROM the parent INTO this node. Empty for the root. */
  conditions: EvolutionCondition[]
  children: EvolutionNode[]
}

export interface EvolutionTree {
  chainId: number
  root: EvolutionNode
}
