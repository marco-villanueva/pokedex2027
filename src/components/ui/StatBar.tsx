import './StatBar.css'

interface StatBarProps {
  label: string
  value: number
  max?: number
}

/**
 * Base-stat bar. The numeric value is always rendered as text — the bar
 * length is a redundant visual encoding, never the only one.
 */
export function StatBar({ label, value, max = 180 }: StatBarProps) {
  const ratio = Math.max(0, Math.min(1, value / max))
  return (
    <div className="px-stat" role="img" aria-label={`${label}: ${value} out of ${max}`}>
      <span className="px-stat-label" aria-hidden="true">
        {label}
      </span>
      <span className="px-stat-track" aria-hidden="true">
        <span className="px-stat-fill" style={{ inlineSize: `${ratio * 100}%` }} />
      </span>
      <span className="px-stat-value" aria-hidden="true">
        {value}
      </span>
    </div>
  )
}
