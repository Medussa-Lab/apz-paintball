'use client'

// Atmospheric fog background — static blobs with blur
// Fixed position behind all content, yellow/amber tinted for APZ tactical aesthetic
export default function FogBackground() {
  return (
    <div
      aria-hidden="true"
      style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}
    >
      {/* Large amber blob — top-left */}
      <div style={{
        position: 'absolute', width: 900, height: 700,
        top: '-12%', left: '-18%',
        background: 'radial-gradient(ellipse at center, rgba(255,208,0,0.045) 0%, transparent 62%)',
        filter: 'blur(100px)',
      }} />
      {/* Medium — center-right */}
      <div style={{
        position: 'absolute', width: 560, height: 520,
        top: '28%', right: '-12%',
        background: 'radial-gradient(ellipse at center, rgba(255,208,0,0.032) 0%, transparent 62%)',
        filter: 'blur(120px)',
      }} />
      {/* Large — bottom */}
      <div style={{
        position: 'absolute', width: 780, height: 560,
        bottom: '-8%', left: '8%',
        background: 'radial-gradient(ellipse at center, rgba(255,180,0,0.038) 0%, transparent 62%)',
        filter: 'blur(130px)',
      }} />
      {/* Small — center warm */}
      <div style={{
        position: 'absolute', width: 420, height: 380,
        top: '52%', left: '32%',
        background: 'radial-gradient(ellipse at center, rgba(255,120,0,0.022) 0%, transparent 62%)',
        filter: 'blur(110px)',
      }} />
      {/* Top-right subtle */}
      <div style={{
        position: 'absolute', width: 380, height: 340,
        top: '5%', right: '10%',
        background: 'radial-gradient(ellipse at center, rgba(255,208,0,0.02) 0%, transparent 60%)',
        filter: 'blur(90px)',
      }} />
      {/* Vignette — darkens edges for depth */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 130% 130% at 50% 50%, transparent 22%, rgba(0,0,0,0.5) 100%)',
      }} />
    </div>
  )
}
