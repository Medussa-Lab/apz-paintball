'use client'

// Exact same fog background as GZ Simlab
export default function FogBackground() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      {/* Blob 1 — large, top-left */}
      <div style={{
        position: 'absolute',
        width: 760, height: 640,
        top: '-8%', left: '-12%',
        background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.065) 0%, transparent 68%)',
        filter: 'blur(90px)',
      }} />

      {/* Blob 2 — medium, center-right */}
      <div style={{
        position: 'absolute',
        width: 520, height: 480,
        top: '22%', right: '-8%',
        background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.052) 0%, transparent 68%)',
        filter: 'blur(110px)',
      }} />

      {/* Blob 3 — large, bottom */}
      <div style={{
        position: 'absolute',
        width: 820, height: 520,
        bottom: '-6%', left: '8%',
        background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.048) 0%, transparent 68%)',
        filter: 'blur(120px)',
      }} />

      {/* Blob 4 — center, subtle warm tint */}
      <div style={{
        position: 'absolute',
        width: 420, height: 360,
        top: '42%', left: '28%',
        background: 'radial-gradient(ellipse at center, rgba(255,160,0,0.038) 0%, transparent 68%)',
        filter: 'blur(100px)',
      }} />

      {/* Vignette */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse 115% 115% at 50% 50%, transparent 28%, rgba(0,0,0,0.52) 100%)',
      }} />
    </div>
  )
}
