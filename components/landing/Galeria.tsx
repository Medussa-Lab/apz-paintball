'use client'

import { motion } from 'framer-motion'

const photos = [
  { id: 1, aspect: 'aspect-video', label: 'Combate en el bosque', tag: 'ACCIÓN' },
  { id: 2, aspect: 'aspect-square', label: 'Equipamiento táctico', tag: 'EQUIPO' },
  { id: 3, aspect: 'aspect-[3/4]', label: 'Jugador en posición', tag: 'CAMPO' },
  { id: 4, aspect: 'aspect-[3/4]', label: 'Asalto a la base', tag: 'ACCIÓN' },
  { id: 5, aspect: 'aspect-video', label: 'Escenario nocturno', tag: 'NOCTURNO' },
  { id: 6, aspect: 'aspect-square', label: 'Marcadora Tippmann 98', tag: 'EQUIPO' },
  { id: 7, aspect: 'aspect-video', label: 'Grupo celebrando', tag: 'GRUPOS' },
  { id: 8, aspect: 'aspect-square', label: 'Impacto directo', tag: 'ACCIÓN' },
  { id: 9, aspect: 'aspect-[3/4]', label: 'Paintball infantil', tag: 'FAMILIAR' },
]

// Different muted forest shades for visual variety
const bgShades = [
  '#111110', '#0f0f0e', '#131312',
  '#111110', '#0f0f0e', '#131312',
  '#111110', '#0f0f0e', '#131312',
]

export default function Galeria() {
  return (
    <section id="galeria" className="relative py-24 bg-bg overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <p className="text-accent font-display text-sm tracking-[0.3em] uppercase mb-3">
            // Galería
          </p>
          <h2 className="section-title text-4xl md:text-5xl text-text">
            EL CAMPO EN <span className="text-accent">ACCIÓN</span>
          </h2>
          <p className="text-text-muted mt-4 max-w-xl text-lg">
            20.000m² de bosque, escenarios únicos y partidas que no olvidarás.
          </p>
        </motion.div>

        {/* Masonry grid using CSS columns */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {photos.map((photo, i) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
              className="relative break-inside-avoid group overflow-hidden rounded-tactical"
              style={{ backgroundColor: bgShades[i] }}
            >
              {/* Placeholder with aspect ratio */}
              <div className={`${photo.aspect} relative`}>
                {/* Grid pattern overlay */}
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage:
                      'linear-gradient(rgba(255,208,0,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,208,0,0.15) 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                  }}
                />

                {/* APZ watermark */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span
                    className="font-display text-accent/10 select-none"
                    style={{ fontSize: 'clamp(3rem, 8vw, 6rem)' }}
                  >
                    APZ
                  </span>
                </div>

                {/* Placeholder icon */}
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                  <span className="text-4xl opacity-20">
                    {i % 3 === 0 ? '🎯' : i % 3 === 1 ? '🔫' : '🌲'}
                  </span>
                  <span className="text-text-muted/30 text-xs font-display tracking-widest">
                    PRÓXIMAMENTE
                  </span>
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-bg/80 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-3">
                  <span className="text-xs font-display tracking-[0.3em] text-accent">
                    {photo.tag}
                  </span>
                  <span className="text-text text-sm font-body text-center px-4">
                    {photo.label}
                  </span>
                </div>
              </div>

              {/* Tag bottom-left */}
              <div className="absolute bottom-3 left-3 opacity-100 group-hover:opacity-0 transition-opacity duration-200">
                <span className="text-[10px] font-display tracking-widest text-bg bg-accent/80 px-2 py-0.5 rounded-tactical">
                  {photo.tag}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Instagram CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 text-center"
        >
          <p className="text-text-muted text-sm mb-4">
            ¿Quieres ver más? Síguenos en Instagram y etiquétanos en tus partidas.
          </p>
          <a
            href="https://instagram.com/apzpaintball"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 btn-tactical-ghost px-8 py-3 text-sm tracking-widest"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
            @APZPAINTBALL
          </a>
        </motion.div>
      </div>
    </section>
  )
}
