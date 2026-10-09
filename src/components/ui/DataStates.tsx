import type { ReactNode } from 'react'
import './DataStates.css'

/** Shared loading / empty / error regions for every remote-data feature. */

export function LoadingGrid({ label = 'Loading specimens…' }: { label?: string }) {
  return (
    <div className="data-state" role="status" aria-live="polite" aria-label={label}>
      <div className="skeleton-grid" aria-hidden="true">
        {Array.from({ length: 6 }, (_, index) => (
          <div key={index} className="skeleton-card" />
        ))}
      </div>
      <p>{label}</p>
    </div>
  )
}

export function LoadingInline({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="data-state" role="status" aria-live="polite">
      <p>{label}</p>
    </div>
  )
}

interface ErrorPanelProps {
  title?: string
  message: string
  onRetry?: () => void
}

export function ErrorPanel({ title = 'Could not load data', message, onRetry }: ErrorPanelProps) {
  return (
    <div className="data-state" role="alert">
      <h2>{title}</h2>
      <p>{message}</p>
      {onRetry && (
        <button type="button" className="btn" onClick={onRetry}>
          Retry
        </button>
      )}
    </div>
  )
}

interface EmptyStateProps {
  title: string
  message: string
  action?: ReactNode
}

export function EmptyState({ title, message, action }: EmptyStateProps) {
  return (
    <div className="data-state">
      <h2>{title}</h2>
      <p>{message}</p>
      {action}
    </div>
  )
}
