'use client'

import { motion } from 'framer-motion'

const items = [
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        <circle cx="12" cy="12" r="10" strokeWidth={1.5} />
      </svg>
    ),
    title: '¿Qué es el paintball?',
    text: 'El paintball es un deporte de equipo donde los jugadores se eliminan al impactar a sus oponentes con proyectiles de pintura biodegradable disparados con marcadoras de aire comprimido. Combina estrategia, trabajo en equipo y adrenalina pura.',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: 'Seguridad ante todo',
    text: 'El equipo de protección es obligatorio: casco homologado con visor térmico antivaho, peto acolchado, guantes y protecciones. Las marcadoras tienen limitadores de velocidad certificados. El índice de lesiones es inferior al del fútbol.',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: 'Deporte de equipo',
    text: 'El paintball desarrolla habilidades clave: comunicación bajo presión, liderazgo, toma de decisiones rápidas y cohesión de equipo. Es la actividad perfecta para team building, despedidas, cumpleaños o simplemente pasar un día diferente con amigos.',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
      </svg>
    ),
    title: 'Bolas biodegradables',
    text: 'Las bolas de paintball están fabricadas con una cáscara de gelatina vegetal y relleno de pintura a base de agua, no tóxica y biodegradable. Son completamente seguras para el medioambiente y se disuelven con la lluvia.',
  },
]

const steps = [
  { num: '01', title: 'Llegada y equipamiento', text: 'Recogida del equipo completo y briefing de normas de seguridad con nuestro instructor.' },
  { num: '02', title: 'Elección de modalidad', text: 'El grupo elige la modalidad de juego: capturar la base, bandera central, El Capitán u otras.' },
  { num: '03', title: 'Al campo de batalla', text: 'Partidas de 10-20 minutos en nuestros escenarios de bosque con obstáculos naturales.' },
  { num: '04', title: 'Recarga y estrategia', text: 'Entre rondas, tiempo para reponer bolas, revisar estrategia y recuperar el aliento.' },
]

export default function SobrePaintball() {
  return (
    <section id="sobre-paintball" className="relative py-24 bg-bg overflow-hidden">
      {/* Faint background text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none" aria-hidden="true">
        <span className="font-display text-text/[0.012] whitespace-nowrap" style={{ fontSize: 'clamp(6rem, 20vw, 18rem)' }}>
          PAINTBALL
        </span>
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <p className="text-accent font-display text-sm tracking-[0.3em] uppercase mb-3">
            // Sobre el deporte
          </p>
          <h2 className="section-title text-4xl md:text-5xl text-text">
            TODO SOBRE EL <span className="text-accent">PAINTBALL</span>
          </h2>
          <p className="text-text-muted mt-4 text-lg max-w-xl">
            Adrenalina, estrategia y trabajo en equipo en 20.000m² de bosque galego.
          </p>
        </motion.div>

        {/* Info grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-20">
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="bg-dark border border-white/8 rounded-tactical p-7 flex gap-5 group hover:border-accent/30 transition-all duration-300"
            >
              <div className="text-accent flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-300">
                {item.icon}
              </div>
              <div>
                <h3 className="font-display text-base text-text tracking-wide mb-2 group-hover:text-accent transition-colors duration-200">
                  {item.title.toUpperCase()}
                </h3>
                <p className="text-text-muted text-sm leading-relaxed">{item.text}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* How it works */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <h3 className="section-title text-2xl md:text-3xl text-text mb-10">
            CÓMO ES UNA <span className="text-accent">PARTIDA</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.1 }}
                className="relative bg-dark border border-white/8 rounded-tactical p-6 hover:border-accent/30 transition-all duration-300"
              >
                <span className="font-display text-accent/20 text-5xl leading-none select-none absolute top-4 right-4">
                  {step.num}
                </span>
                <div className="w-8 h-0.5 bg-accent mb-4" />
                <h4 className="font-display text-sm text-text tracking-wide mb-2">{step.title.toUpperCase()}</h4>
                <p className="text-text-muted text-sm leading-relaxed">{step.text}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
