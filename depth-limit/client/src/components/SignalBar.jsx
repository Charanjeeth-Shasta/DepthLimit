export default function SignalBar({ label, value }) {
  const pct = Math.round(value * 100)
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs font-dm text-text-secondary w-36 shrink-0">{label}</span>
      <div className="flex-1 h-1.5 bg-bg-elevated rounded-full overflow-hidden">
        <div
          className="h-full bg-accent-teal rounded-full progress-bar-fill"
          style={{ '--target-width': `${pct}%`, width: `${pct}%` }}
        />
      </div>
      <span className="text-xs font-mono text-text-tertiary w-8 text-right">{pct}%</span>
    </div>
  )
}