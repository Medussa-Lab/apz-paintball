'use client'

// Smoke battlefield background
// SVG feTurbulence generates genuinely organic, non-geometric smoke tendrils
// Yellow-gold underglow bleeds through the smoke from below like a buried flare
export default function FogBackground() {
  return (
    <div
      aria-hidden="true"
      style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden', background: '#000' }}
    >
      {/* ── Layer 1: base smoke volume ── */}
      <svg
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <filter id="apz-smoke-base" x="0%" y="0%" width="100%" height="100%" colorInterpolationFilters="sRGB">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.007 0.0035"
              numOctaves="7"
              seed="11"
              stitchTiles="stitch"
              result="noise"
            />
            <feColorMatrix type="saturate" values="0" in="noise" result="gray" />
            {/* Push towards very dark charcoal — smoke barely visible on black */}
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.10
                      0 0 0 0 0.10
                      0 0 0 0 0.10
                      0 0 0 5 -3.0"
              in="gray"
              result="darkSmoke"
            />
          </filter>

          {/* Tendril pass — thinner, more directional wisps */}
          <filter id="apz-smoke-tendrils" x="0%" y="0%" width="100%" height="100%" colorInterpolationFilters="sRGB">
            <feTurbulence
              type="turbulence"
              baseFrequency="0.004 0.0015"
              numOctaves="9"
              seed="29"
              stitchTiles="stitch"
              result="noise2"
            />
            <feColorMatrix type="saturate" values="0" in="noise2" result="gray2" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.07
                      0 0 0 0 0.07
                      0 0 0 0 0.07
                      0 0 0 6 -3.8"
              in="gray2"
              result="tendrils"
            />
          </filter>
        </defs>

        {/* Base smoke fill */}
        <rect width="100%" height="100%" fill="black" />
        <rect width="100%" height="100%" filter="url(#apz-smoke-base)" opacity="0.92" />
        {/* Tendril overlay — screen blend so only lighter areas show */}
        <rect
          width="100%" height="100%"
          filter="url(#apz-smoke-tendrils)"
          opacity="0.55"
          style={{ mixBlendMode: 'screen' }}
        />
      </svg>

      {/* ── Layer 2: yellow-gold underglow from far below ──
           Buried light source — max 12% opacity, heavily blurred to scatter through smoke */}
      <div style={{
        position: 'absolute',
        width: '130%', height: '65%',
        bottom: '-18%', left: '-15%',
        background: 'radial-gradient(ellipse at 50% 70%, rgba(255,208,0,0.12) 0%, rgba(220,130,0,0.07) 30%, rgba(180,70,0,0.03) 52%, transparent 68%)',
        filter: 'blur(72px)',
        mixBlendMode: 'screen',
      }} />

      {/* Secondary amber scatter — light scattering through smoke particles */}
      <div style={{
        position: 'absolute',
        width: '75%', height: '45%',
        bottom: '8%', left: '12%',
        background: 'radial-gradient(ellipse at 48% 80%, rgba(255,170,0,0.07) 0%, rgba(200,90,0,0.03) 45%, transparent 65%)',
        filter: 'blur(100px)',
        mixBlendMode: 'screen',
      }} />

      {/* Faint warm edge scatter — realistic light bleed */}
      <div style={{
        position: 'absolute',
        width: '50%', height: '30%',
        bottom: '15%', right: '5%',
        background: 'radial-gradient(ellipse, rgba(255,140,0,0.04) 0%, transparent 60%)',
        filter: 'blur(80px)',
        mixBlendMode: 'screen',
      }} />

      {/* ── Layer 3: vignette — battlefield darkness closes in from edges ── */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 85% 85% at 50% 38%, transparent 10%, rgba(0,0,0,0.60) 72%, rgba(0,0,0,0.88) 100%)',
      }} />
    </div>
  )
}
