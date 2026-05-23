export default function TopicPill({ topic, variant = 'default' }) {
  const styles = {
    default: 'bg-bg-elevated text-accent-teal border border-bg-border',
    strong: 'bg-success/10 text-success border border-success/20',
    shaky: 'bg-warning/10 text-warning border border-warning/20',
    gap: 'bg-danger/10 text-danger border border-danger/20',
  }
  return (
    <span className={`text-xs font-dm px-3 py-1 rounded-full ${styles[variant]}`}>
      {topic}
    </span>
  )
}