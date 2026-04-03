export default function Loading() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-7 w-28 bg-white/[0.06] rounded" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-36 bg-white/[0.04] rounded-lg border border-white/[0.06]" />
        ))}
      </div>
    </div>
  )
}
