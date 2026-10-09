import { Link } from 'react-router'
import './DataLabel.css'

/**
 * Telemetry term/value pair. Renders `dt`/`dd` inside a `div` so parents
 * compose valid description lists (`<dl><DataLabel/>…</dl>`).
 * Optional `href` turns the value into an internal navigation link.
 */
export function DataLabel({
  term,
  value,
  mono = true,
  href,
}: {
  term: string
  value: string
  mono?: boolean
  href?: string
}) {
  return (
    <div className="px-data">
      <dt className="px-data-term">{term}</dt>
      <dd className="px-data-value" data-mono={mono || undefined}>
        {href ? (
          <Link to={href} className="px-data-link">
            {value}
          </Link>
        ) : (
          value
        )}
      </dd>
    </div>
  )
}
