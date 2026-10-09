import { Link } from 'react-router'
import { sectionTitle, usePageTitle } from '@/lib/use-page-title.ts'
import './NotFoundPage.css'

export function NotFoundPage() {
  usePageTitle(sectionTitle('Uncharted sector'))
  return (
    <section aria-label="Page not found" className="not-found">
      <span aria-hidden="true" className="not-found-ghost">
        404
      </span>
      <div className="not-found-panel">
        <p className="eyebrow">Signal lost</p>
        <h1>404 — Uncharted sector</h1>
        <p>No archive entry exists at this address. The explorer remains online.</p>
        <p>
          <Link className="not-found-action" to="/pokedex">
            Return to explorer
          </Link>
        </p>
      </div>
    </section>
  )
}
