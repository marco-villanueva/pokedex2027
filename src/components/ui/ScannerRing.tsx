import './ScannerRing.css'

/**
 * Decorative scanner reticle: concentric rings, tick band and sweep.
 * Pure CSS, aria-hidden — essential information always lives in DOM text
 * around it. Rotation halts under `prefers-reduced-motion`.
 */
export function ScannerRing({ label }: { label?: string }) {
  return (
    <div className="px-scanner" role="presentation">
      <div className="px-scanner-ring px-scanner-ring--outer" aria-hidden="true" />
      <div className="px-scanner-ring px-scanner-ring--ticks" aria-hidden="true" />
      <div className="px-scanner-ring px-scanner-ring--inner" aria-hidden="true" />
      <div className="px-scanner-sweep" aria-hidden="true" />
      {label && <span className="px-scanner-label">{label}</span>}
    </div>
  )
}
