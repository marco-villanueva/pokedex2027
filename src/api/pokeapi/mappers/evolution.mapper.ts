import { idFromUrl } from '../client.ts'
import { toDisplayName } from '../../../domain/pokemon/format.ts'
import type {
  EvolutionCondition,
  EvolutionNode,
  EvolutionTree,
} from '../../../domain/evolution/types.ts'
import type { EvolutionChainLinkDto, EvolutionDetailDto } from '../dto/evolution.dto.ts'

function labelForDetail(detail: EvolutionDetailDto): EvolutionCondition {
  const item = detail.item?.name
  if (item) {
    return { kind: 'item', label: toDisplayName(item) }
  }
  if (detail.min_level != null) {
    return { kind: 'level', label: `Level ${detail.min_level}` }
  }
  if ((detail.min_happiness ?? 0) > 0 || (detail.min_affection ?? 0) > 0) {
    const time = detail.time_of_day ? ` · ${capitalize(detail.time_of_day)}` : ''
    return { kind: 'friendship', label: `High friendship${time}` }
  }
  if (detail.known_move?.name) {
    return { kind: 'move', label: `Knows ${toDisplayName(detail.known_move.name)}` }
  }
  if (detail.location?.name) {
    return { kind: 'location', label: `At ${toDisplayName(detail.location.name)}` }
  }
  if (detail.trigger?.name && detail.trigger.name !== 'level-up') {
    if (detail.trigger.name === 'trade') {
      const species = detail.trade_species?.name
      return {
        kind: 'trade',
        label: species ? `Trade for ${toDisplayName(species)}` : 'Trade',
      }
    }
    return { kind: 'trigger', label: toDisplayName(detail.trigger.name) }
  }
  if (detail.time_of_day) {
    return { kind: 'time', label: capitalize(detail.time_of_day) }
  }
  return { kind: 'other', label: 'Special condition' }
}

function capitalize(value: string): string {
  return value.length > 0 ? value[0]!.toUpperCase() + value.slice(1) : value
}

function mapNode(link: EvolutionChainLinkDto): EvolutionNode {
  const speciesId = idFromUrl(link.species.url) ?? -1
  return {
    speciesId,
    speciesName: link.species.name,
    displayName: toDisplayName(link.species.name),
    // Conditions describe how the PARENT evolves into this node; the root has none.
    // They are attached by the parent mapper below.
    conditions: [],
    children: link.evolves_to.map((child) => {
      const node = mapNode(child)
      const details = child.evolution_details ?? []
      node.conditions =
        details.length > 0 ? details.map(labelForDetail) : [{ kind: 'other', label: 'Evolves' }]
      return node
    }),
  }
}

/** Normalise an evolution chain DTO into a navigable domain tree. */
export function mapEvolutionTree(chainId: number, root: EvolutionChainLinkDto): EvolutionTree {
  return { chainId, root: mapNode(root) }
}
