export default function Loading() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-7 w-24 bg-white/[0.06] rounded" />
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-20 bg-white/[0.04] rounded-lg border border-white/[0.06]" />
        ))}
      </div>
    </div>
  )
}
