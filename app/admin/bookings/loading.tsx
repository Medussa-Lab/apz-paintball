export default function Loading() {
  return (
    <div className="animate-pulse space-y-5">
      <div className="flex items-center justify-between">
        <div className="h-7 w-36 bg-white/[0.06] rounded" />
        <div className="flex gap-2">
          <div className="h-8 w-24 bg-white/[0.06] rounded" />
          <div className="h-8 w-28 bg-white/[0.06] rounded" />
        </div>
      </div>
      <div className="flex gap-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-8 w-20 bg-white/[0.04] rounded" />
        ))}
      </div>
      <div className="bg-white/[0.04] rounded-lg border border-white/[0.06] overflow-hidden">
        <div className="h-10 bg-white/[0.03] border-b border-white/[0.06]" />
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-14 border-b border-white/[0.04] px-4 flex items-center gap-4">
            <div className="h-4 w-24 bg-white/[0.05] rounded" />
            <div className="h-4 w-32 bg-white/[0.05] rounded" />
            <div className="h-4 w-16 bg-white/[0.05] rounded ml-auto" />
          </div>
        ))}
      </div>
    </div>
  )
}
