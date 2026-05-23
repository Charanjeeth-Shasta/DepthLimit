export default function ScoreBadge({ score }) {
  const color =
    score >= 75 ? 'text-success border-success/30 bg-success/10'
    : score >= 50 ? 'text-warning border-warning/30 bg-warning/10'
    : 'text-danger border-danger/30 bg-danger/10'

  return (
    <span className={`font-mono text-sm font-bold px-2 py-0.5 rounded-full border ${color}`}>
      {score} / 10
    </span>
  )
}