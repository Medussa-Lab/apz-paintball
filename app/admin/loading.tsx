export default function AdminLoading() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-7 w-40 bg-white/[0.06] rounded" />
          <div className="h-4 w-56 bg-white/[0.04] rounded" />
        </div>
        <div className="h-8 w-8 bg-white/[0.06] rounded" />
      </div>
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 bg-white/[0.04] rounded-lg border border-white/[0.06]" />
        ))}
      </div>
      <div className="h-64 bg-white/[0.04] rounded-lg border border-white/[0.06]" />
      <div className="h-48 bg-white/[0.04] rounded-lg border border-white/[0.06]" />
    </div>
  )
}
