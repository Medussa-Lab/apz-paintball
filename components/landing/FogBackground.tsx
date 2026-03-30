'use client'

// Atmospheric fog — same structure as GZ Simlab but with a trace of amber
// Static blobs (no animation) to avoid layer-recomposition flicker
export default function FogBackground() {
  return (
    <div
      aria-hidden="true"
      style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}
    >
      {/* Blob 1 — large, top-left, neutral white like GZ */}
      <div style={{
        position: 'absolute', width: 760, height: 640,
        top: '-8%', left: '-12%',
        background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.055) 0%, transparent 68%)',
        filter: 'blur(90px)',
      }} />

      {/* Blob 2 — center-right */}
      <div style={{
        position: 'absolute', width: 520, height: 480,
        top: '22%', right: '-8%',
        background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.042) 0%, transparent 68%)',
        filter: 'blur(110px)',
      }} />

      {/* Blob 3 — bottom */}
      <div style={{
        position: 'absolute', width: 820, height: 520,
        bottom: '-6%', left: '8%',
        background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.038) 0%, transparent 68%)',
        filter: 'blur(120px)',
      }} />

      {/* Blob 4 — subtle amber tint center (APZ identity accent) */}
      <div style={{
        position: 'absolute', width: 420, height: 360,
        top: '42%', left: '28%',
        background: 'radial-gradient(ellipse at center, rgba(255,190,0,0.038) 0%, transparent 68%)',
        filter: 'blur(100px)',
      }} />

      {/* Blob 5 — top-right subtle */}
      <div style={{
        position: 'absolute', width: 380, height: 320,
        top: '5%', right: '10%',
        background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.028) 0%, transparent 65%)',
        filter: 'blur(80px)',
      }} />

      {/* Vignette — same as GZ Simlab */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 115% 115% at 50% 50%, transparent 28%, rgba(0,0,0,0.55) 100%)',
      }} />
    </div>
  )
}
