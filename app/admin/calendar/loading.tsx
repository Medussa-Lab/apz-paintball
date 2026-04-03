export default function Loading() {
  return (
    <div className="animate-pulse space-y-5">
      <div className="flex items-center justify-between">
        <div className="h-7 w-32 bg-white/[0.06] rounded" />
        <div className="flex gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-8 w-20 bg-white/[0.04] rounded" />
          ))}
        </div>
      </div>
      <div className="bg-white/[0.04] rounded-lg border border-white/[0.06]">
        <div className="h-10 bg-white/[0.03] border-b border-white/[0.06] rounded-t-lg" />
        <div className="p-4 space-y-2">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="flex gap-2">
              <div className="h-12 w-12 bg-white/[0.04] rounded flex-shrink-0" />
              <div className="flex-1 h-12 bg-white/[0.03] rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
