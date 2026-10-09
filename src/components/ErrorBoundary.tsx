import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

/**
 * Route-level error boundary: isolates crashes (including optional 3D)
 * so one failing region never takes down the whole application.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('[ErrorBoundary]', error, info.componentStack)
  }

  private handleRetry = (): void => {
    this.setState({ hasError: false })
  }

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback
      return (
        <section role="alert" aria-live="assertive" className="error-panel">
          <h2>Something went wrong</h2>
          <p>This section failed to render. The rest of the archive is intact.</p>
          <button type="button" onClick={this.handleRetry}>
            Retry
          </button>
        </section>
      )
    }
    return this.props.children
  }
}
