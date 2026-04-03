export default function Loading() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="flex items-center justify-between">
        <div className="h-7 w-28 bg-white/[0.06] rounded" />
        <div className="flex gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-8 w-14 bg-white/[0.04] rounded" />
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-24 bg-white/[0.04] rounded-lg border border-white/[0.06]" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-72 bg-white/[0.04] rounded-lg border border-white/[0.06]" />
        <div className="h-72 bg-white/[0.04] rounded-lg border border-white/[0.06]" />
      </div>
    </div>
  )
}
