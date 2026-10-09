import { Link } from 'react-router'
import { TransitionLink } from '@/app/router/TransitionLink.tsx'
import { useEvolutionTree } from '@/api/pokeapi/queries.ts'
import { LoadingInline } from '@/components/ui/DataStates.tsx'
import type { EvolutionNode } from '@/domain/evolution/types.ts'
import './EvolutionPreview.css'

interface FlatNode {
  node: EvolutionNode
  depth: number
}

function flatten(node: EvolutionNode, depth = 0): FlatNode[] {
  return [{ node, depth }, ...node.children.flatMap((child) => flatten(child, depth + 1))]
}

/**
 * Evolution bridge on the dossier (RC4 preview): the full chain as a
 * navigable, screen-reader-friendly list with trigger conditions.
 * Artwork and the spatial tree view land with the RC4 explorer.
 */
export function EvolutionPreview({
  chainId,
  currentId,
}: {
  chainId: number | undefined
  currentId: number
}) {
  const tree = useEvolutionTree(chainId)

  if (chainId === undefined) return null
  if (tree.isPending) {
    return (
      <section aria-label="Evolution preview" className="panel">
        <LoadingInline label="Tracing evolution chain…" />
      </section>
    )
  }
  if (tree.isError || !tree.data) return null

  const nodes = flatten(tree.data.root)
  return (
    <section aria-labelledby="dossier-evolution-heading" className="panel">
      <div className="panel-head">
        <h2 id="dossier-evolution-heading">Evolution chain</h2>
        <Link to={`/evolution/${tree.data.chainId}`} className="panel-link">
          Open full tree →
        </Link>
      </div>
      <ol className="evo-list">
        {nodes.map(({ node, depth }) => {
          const isCurrent = node.speciesId === currentId
          return (
            <li
              key={node.speciesId}
              className="evo-node"
              style={{ '--evo-depth': depth } as React.CSSProperties}
            >
              {node.conditions.length > 0 && depth > 0 && (
                <span className="evo-condition">
                  {[...new Set(node.conditions.map((condition) => condition.label))].join(' · ')}
                </span>
              )}
              {isCurrent ? (
                <span className="evo-current" aria-current="true">
                  {node.displayName}
                </span>
              ) : (
                <TransitionLink to={`/pokemon/${node.speciesId}`} className="evo-link">
                  {node.displayName}
                </TransitionLink>
              )}
            </li>
          )
        })}
      </ol>
    </section>
  )
}
