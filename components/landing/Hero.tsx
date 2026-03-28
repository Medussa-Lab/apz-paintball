'use client'

import { useRef, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'

const TOTAL_FRAMES = 96

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.18, delayChildren: 0.3 } },
}

const item = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const framesRef = useRef<HTMLImageElement[]>([])
  const rafRef = useRef<number>(0)
  const currentFrameRef = useRef(-1)

  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const img = framesRef.current[index]
    if (!img?.complete || !img.naturalWidth) return

    const cw = canvas.width
    const ch = canvas.height
    const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight)
    const sw = img.naturalWidth * scale
    const sh = img.naturalHeight * scale
    ctx.clearRect(0, 0, cw, ch)
    ctx.drawImage(img, (cw - sw) / 2, (ch - sh) / 2, sw, sh)
  }, [])

  // Preload all frames
  useEffect(() => {
    const imgs: HTMLImageElement[] = []

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image()
      img.src = `/frames/frame-${String(i + 1).padStart(4, '0')}.jpg`
      // Draw frame 0 as soon as it loads
      if (i === 0) {
        img.onload = () => drawFrame(0)
      }
      imgs.push(img)
    }
    framesRef.current = imgs
  }, [drawFrame])

  // Canvas size = viewport size
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      if (currentFrameRef.current >= 0) drawFrame(currentFrameRef.current)
    }

    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [drawFrame])

  // Scroll → frame
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const scrub = () => {
      const rect = section.getBoundingClientRect()
      const scrollRange = section.offsetHeight - window.innerHeight
      if (scrollRange <= 0) return

      const progress = Math.max(0, Math.min(1, -rect.top / scrollRange))
      const frameIndex = Math.min(
        TOTAL_FRAMES - 1,
        Math.floor(progress * TOTAL_FRAMES)
      )

      if (frameIndex === currentFrameRef.current) return
      currentFrameRef.current = frameIndex
      drawFrame(frameIndex)
    }

    const onScroll = () => {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(scrub)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(rafRef.current)
    }
  }, [drawFrame])

  const handleNavScroll = (href: string) => {
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      ref={sectionRef}
      className="relative bg-bg"
      style={{ height: '300vh' }}
    >
      <div
        className="sticky top-0 flex items-center justify-center bg-bg"
        style={{ height: '100vh', overflow: 'hidden' }}
      >
        {/* Canvas — frames precargados */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0"
          style={{ width: '100%', height: '100%' }}
        />

        {/* Viñeta radial */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 90% 85% at 50% 50%, transparent 30%, rgba(8,8,7,0.6) 62%, #080807 100%)',
          }}
        />

        {/* Degradado inferior */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-bg to-transparent pointer-events-none" />

        {/* Overlay oscuro detrás del texto */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'rgba(8,8,7,0.28)' }}
        />

        {/* Contenido */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="relative z-10 text-center px-6 max-w-5xl mx-auto"
        >
          <motion.p
            variants={item}
            className="text-accent font-display tracking-[0.35em] uppercase mb-6"
            style={{ fontSize: '0.7rem' }}
          >
            Campo de Paintball · A Coruña · 20.000m²
          </motion.p>

          <motion.h1
            variants={item}
            className="font-display text-text leading-none mb-6"
            style={{ fontSize: 'clamp(2.08rem, 6.4vw, 5.2rem)' }}
          >
            EL CAMPO DE{' '}
            <span className="text-accent">BATALLA</span>
            <br />
            ESTÁ EN A CORUÑA
          </motion.h1>

          <motion.p
            variants={item}
            className="text-text-muted text-xl md:text-2xl font-body font-bold mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            20.000m² de bosque. Adrenalina real.
            <br className="hidden md:block" /> Reserva ahora.
          </motion.p>

          <motion.div variants={item} className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => handleNavScroll('#reservas')}
              className="btn-tactical px-10 py-4 text-base tracking-widest"
            >
              RESERVAR PARTIDA
            </button>
            <button
              onClick={() => handleNavScroll('#experiencia')}
              className="btn-tactical-ghost px-10 py-4 text-base tracking-widest"
            >
              VER MODALIDADES
            </button>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-text-muted z-10"
        >
          <span className="text-xs tracking-[0.25em] uppercase font-display">Scroll</span>
          <svg
            className="w-5 h-5 animate-scroll-bounce"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </div>
    </section>
  )
}
