export default function ModeBadge({ mode }) {
  const isThread = mode === 'thread-puller'
  return (
    <span
      className={`text-xs font-dm font-medium px-3 py-1 rounded-full ${
        isThread
          ? 'bg-accent-teal/10 text-accent-teal border border-accent-teal/30'
          : 'bg-accent-blue/10 text-accent-blue border border-accent-blue/30'
      }`}
    >
      {isThread ? 'Thread Puller' : 'Concept Mapper'}
    </span>
  )
}