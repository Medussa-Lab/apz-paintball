'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

const photos = [
  { src: '/gallery/ataque.png',       label: 'Asalto táctico',      tag: 'ACCIÓN' },
  { src: '/gallery/campo.png',        label: 'Campo en acción',     tag: 'CAMPO' },
  { src: '/gallery/barco-team.png',   label: 'Equipo en el barco',  tag: 'ESCENARIO' },
  { src: '/gallery/ataque2.png',      label: 'Combate en el bosque',tag: 'ACCIÓN' },
  { src: '/gallery/barco2.png',       label: 'Escenario del barco', tag: 'ESCENARIO' },
  { src: '/gallery/escuadron.png',    label: 'Escuadrón listo',     tag: 'EQUIPO' },
  { src: '/gallery/campo2.png',       label: 'Vista del campo',     tag: 'CAMPO' },
  { src: '/gallery/contenedor.png',   label: 'Zona de contenedores',tag: 'ESCENARIO' },
  { src: '/gallery/barco3.webp',      label: 'El barco de noche',   tag: 'NOCTURNO' },
]

const videos = [
  { id: 'f_XVfEcGlag', label: 'APZ Paintball en acción' },
  { id: 'n4KsfQ1dQRY', label: 'Partida completa en APZ' },
]

export default function Galeria() {
  return (
    <section id="galeria" className="relative py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <span className="inline-block font-body text-[0.65rem] font-medium tracking-[0.22em] uppercase text-accent mb-4">005 / Galería</span>
          <h2 className="heading-shimmer section-title text-[clamp(2.4rem,5.5vw,4rem)] leading-[0.95] mb-4">
            El campo en <span className="text-accent">acción</span>
          </h2>
          <p className="text-text-muted text-lg max-w-xl">
            20.000m² de bosque, escenarios únicos y partidas que no olvidarás.
          </p>
        </motion.div>

        {/* Photo masonry grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4 mb-8">
          {photos.map((photo, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
              className="relative break-inside-avoid group overflow-hidden rounded-tactical bg-[#111110]"
            >
              <div className="relative w-full aspect-[4/3]">
                <Image
                  src={photo.src}
                  alt={photo.label}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-bg/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2">
                  <span className="text-xs font-display tracking-[0.3em] text-accent">{photo.tag}</span>
                  <span className="text-text text-sm font-body text-center px-4">{photo.label}</span>
                </div>
                {/* Tag */}
                <div className="absolute bottom-3 left-3 group-hover:opacity-0 transition-opacity duration-200">
                  <span className="text-[10px] font-display tracking-widest text-bg bg-accent/80 px-2 py-0.5 rounded-tactical">
                    {photo.tag}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* YouTube videos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {videos.map((video, i) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative overflow-hidden rounded-tactical border border-white/[0.07] bg-[#111110]"
            >
              <div className="relative aspect-video">
                <iframe
                  src={`https://www.youtube.com/embed/${video.id}?modestbranding=1&rel=0`}
                  title={video.label}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
              </div>
              <div className="px-4 py-3 border-t border-white/[0.05]">
                <span className="text-text-muted text-xs font-body">{video.label}</span>
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
          className="text-center"
        >
          <p className="text-text-muted text-sm mb-4 font-body">
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
