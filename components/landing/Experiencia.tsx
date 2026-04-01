'use client'
import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const gameModes = [
  {
    id: 'base',
    category: 'estrategia',
    nombre: 'Capturar la Base',
    sub: 'El clásico del combate táctico',
    icono: '🏴',
    dificultad: 4,
    diffLabel: 'Avanzado',
    specs: [
      'Dos equipos, un objetivo',
      'Estrategia y coordinación total',
      'Fuego de cobertura y flanqueo',
      'Escenario: bosque abierto',
      'Duración: 20–30 min por ronda',
    ],
    featured: false,
  },
  {
    id: 'capitan',
    category: 'estrategia',
    nombre: 'El Capitán',
    sub: 'Protege o elimina al objetivo',
    icono: '🎖️',
    dificultad: 5,
    diffLabel: 'Extremo',
    specs: [
      'Un jugador es el objetivo VIP',
      'Máxima presión táctica',
      'Rotación de roles entre rondas',
      'Escenario: campo cerrado',
      'Duración: 15–20 min por ronda',
    ],
    featured: false,
  },
  {
    id: 'bandera',
    category: 'estrategia',
    nombre: 'Bandera Central',
    sub: 'Dos equipos, una sola bandera',
    icono: '🚩',
    dificultad: 3,
    diffLabel: 'Medio',
    specs: [
      'Bandera en zona neutral',
      'Capturar y llevar a tu base',
      'Ideal para grupos equilibrados',
      'Escenario: bosque mixto',
      'Duración: 20–25 min por ronda',
    ],
    featured: false,
  },
  {
    id: 'nocturno',
    category: 'nocturno',
    nombre: 'Paintball Nocturno',
    sub: 'Oscuridad, adrenalina y bolas fluorescentes',
    icono: '🌙',
    dificultad: 5,
    diffLabel: 'Extremo',
    specs: [
      'Linternas tácticas en la marcadora',
      'Bolas fluorescentes al impactar',
      'Experiencia única en A Coruña',
      'Escenario: bosque nocturno',
      'Solo bajo reserva previa',
    ],
    featured: true,
    tag: 'EXCLUSIVO',
  },
  {
    id: 'infantil',
    category: 'familiar',
    nombre: 'Paintball Infantil',
    sub: 'Desde 8 años · JT Splatmaster',
    icono: '🛡️',
    dificultad: 1,
    diffLabel: 'Iniciación',
    specs: [
      'Marcadoras manuales JT Splatmaster',
      'Sin CO₂ · Impacto suave',
      'Adultos y niños pueden jugar juntos',
      'Edad mínima: 8 años',
      'Monitor dedicado para los pequeños',
    ],
    featured: false,
    tag: 'FAMILIAR',
  },
]

const FILTERS = [
  { id: 'all',       label: 'Todas' },
  { id: 'estrategia', label: 'Estrategia' },
  { id: 'nocturno',  label: 'Nocturno' },
  { id: 'familiar',  label: 'Familiar' },
]

const BANNER_COLORS: Record<string, string> = {
  base:     'from-[#1a1610] to-[#0d0c0b]',
  capitan:  'from-[#1a1208] to-[#0d0c0b]',
  bandera:  'from-[#0e1510] to-[#0d0c0b]',
  nocturno: 'from-[#0e0e1a] to-[#080810]',
  infantil: 'from-[#111510] to-[#0d0c0b]',
}

export default function Experiencia() {
  const [filter, setFilter] = useState('all')
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })

  const visible = gameModes.filter(m => filter === 'all' || m.category === filter)
  const scrollTo = () => document.querySelector('#reservas')?.scrollIntoView({ behavior: 'smooth' })

  return (
    <section id="experiencia" className="py-32" ref={ref}>
      <div className="max-w-7xl mx-auto px-6 md:px-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
          className="text-center mb-12"
        >
          <span className="inline-block font-body text-[0.65rem] font-medium tracking-[0.22em] uppercase text-accent mb-5">002 / Modalidades</span>
          <h2 className="heading-shimmer section-title text-[clamp(2.6rem,5.5vw,4.2rem)] leading-[0.92] mb-4">
            Elige tu <span className="text-accent">Misión</span>
          </h2>
          <p className="text-text/45 text-[1.05rem] max-w-lg mx-auto font-body">
            Cinco modos de combate distintos. Cada partida es una experiencia diferente.
          </p>
        </motion.div>

        {/* Filter tabs */}
        <motion.div
          initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex justify-center gap-2 mb-10 flex-wrap"
        >
          {FILTERS.map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`font-display text-[0.78rem] tracking-[0.12em] uppercase px-5 py-2 rounded-full border transition-all duration-200 ${
                filter === f.id
                  ? 'border-accent bg-accent text-bg shadow-[0_0_20px_rgba(255,208,0,0.2)]'
                  : 'border-white/10 text-text/40 hover:border-accent/50 hover:text-accent'
              }`}
            >
              {f.label}
            </button>
          ))}
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {visible.map((mode, i) => (
            <motion.div
              key={mode.id}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.4, 0, 0.2, 1] }}
              className={`group relative flex flex-col bg-[#111110] rounded-lg overflow-hidden transition-all duration-300 hover:-translate-y-2 ${
                mode.featured
                  ? 'border border-accent/50 shadow-[0_0_50px_rgba(255,208,0,0.12)] hover:shadow-[0_24px_64px_rgba(0,0,0,0.6),0_0_60px_rgba(255,208,0,0.22)]'
                  : 'border border-white/[0.06] hover:border-accent/30 hover:shadow-[0_24px_64px_rgba(0,0,0,0.5),0_0_40px_rgba(255,208,0,0.06)]'
              }`}
            >
              {/* Banner top */}
              <div className={`relative h-36 bg-gradient-to-br ${BANNER_COLORS[mode.id]} overflow-hidden flex items-center justify-center`}>
                {/* Subtle grain texture */}
                <div className="absolute inset-0 opacity-[0.04]" style={{
                  backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
                }} />
                {/* Accent corner */}
                {mode.featured && (
                  <div className="absolute bottom-0 right-0 w-1/3 h-1/3 border-b-2 border-r-2 border-accent/50 rounded-br pointer-events-none" />
                )}
                {/* Icon */}
                <span className="text-6xl opacity-70 select-none group-hover:scale-110 transition-transform duration-500">
                  {mode.icono}
                </span>
                {/* Tag badge */}
                {mode.tag && (
                  <span className={`absolute top-3 right-3 font-display text-[0.6rem] tracking-[0.12em] uppercase px-2.5 py-1 rounded ${
                    mode.featured ? 'bg-accent text-bg' : 'bg-[#1e1e1c] text-accent/80 border border-accent/20'
                  }`}>
                    {mode.tag}
                  </span>
                )}
                {/* Difficulty badge */}
                <div className="absolute bottom-3 left-4 flex items-center gap-1.5">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <div key={j} className="h-1 w-4 rounded-full" style={{ background: j < mode.dificultad ? '#FFD000' : 'rgba(255,255,255,0.12)' }} />
                  ))}
                  <span className="text-[0.65rem] text-text/40 font-body ml-1">{mode.diffLabel}</span>
                </div>
              </div>

              {/* Body */}
              <div className="p-5 flex flex-col flex-1">
                <h3 className={`font-display text-[1.05rem] tracking-wide mb-0.5 ${mode.featured ? 'text-accent' : 'text-text'}`}>
                  {mode.nombre.toUpperCase()}
                </h3>
                <p className="text-text/30 text-[0.75rem] mb-4 font-body">{mode.sub}</p>
                <ul className="flex flex-col gap-2 mb-5 flex-1">
                  {mode.specs.map((spec, j) => (
                    <li key={j} className="flex items-center gap-2 text-[0.82rem] text-text/50 font-body">
                      <span className={`w-1 h-1 rounded-full flex-shrink-0 ${mode.featured ? 'bg-accent/70' : 'bg-accent/50'}`} />
                      {spec}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={scrollTo}
                  className={`font-display text-[0.78rem] tracking-[0.1em] uppercase hover:border-b pb-0.5 w-fit transition-all duration-200 ${
                    mode.featured ? 'text-accent border-accent/0 hover:border-accent' : 'text-text/50 border-text/0 hover:text-accent hover:border-accent'
                  }`}
                >
                  Reservar →
                </button>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
