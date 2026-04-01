'use client'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import type { GameMode } from '@/lib/types'

const gameModes: GameMode[] = [
  {
    id: 'base',
    nombre: 'Capturar la Base',
    descripcion: 'Infiltra el territorio enemigo y domina su base. Estrategia, coordinación y fuego de cobertura. El clásico que nunca decepciona.',
    icono: '🏴',
    dificultad: 4,
  },
  {
    id: 'capitan',
    nombre: 'El Capitán',
    descripcion: 'Un jugador se convierte en el objetivo. Protégelo o elimínalo. Cada decisión puede cambiar el resultado del combate.',
    icono: '🎖️',
    dificultad: 5,
  },
  {
    id: 'bandera',
    nombre: 'Bandera Central',
    descripcion: 'La bandera está en tierra de nadie. Dos equipos, un objetivo. El primero en capturarla y llevarla a su base, gana.',
    icono: '🚩',
    dificultad: 3,
  },
  {
    id: 'nocturno',
    nombre: 'Paintball Nocturno',
    descripcion: 'Bajo la oscuridad del bosque, con linternas tácticas y bolas fluorescentes. Una experiencia única que no olvidarás.',
    icono: '🌙',
    dificultad: 5,
    tag: 'EXCLUSIVO',
  },
  {
    id: 'infantil',
    nombre: 'Paintball Infantil',
    descripcion: 'Desde 8 años. Marcadoras de acción manual, bolas más blandas, misma adrenalina. Adultos y niños pueden jugar juntos.',
    icono: '🛡️',
    dificultad: 1,
    tag: 'FAMILIAR',
  },
]

const DIFF_LABELS = ['', 'Iniciación', 'Fácil', 'Medio', 'Avanzado', 'Extremo']

function DifficultyBar({ level }: { level: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-1 w-5 rounded-full transition-all"
            style={{ background: i < level ? '#FFD000' : 'rgba(255,255,255,0.1)' }}
          />
        ))}
      </div>
      <span className="text-[0.7rem] text-text/35 font-body tracking-wide">{DIFF_LABELS[level]}</span>
    </div>
  )
}

function GameCard({ mode, delay, featured = false }: { mode: GameMode; delay: number; featured?: boolean }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-8%' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.4, 0, 0.2, 1] }}
      className={`group relative flex flex-col gap-5 p-7 rounded-tactical transition-all duration-300 overflow-hidden ${
        featured
          ? 'bg-gradient-to-br from-[#181714] to-[#111110] border border-accent/25 shadow-[0_0_40px_rgba(255,208,0,0.06)] hover:shadow-[0_0_60px_rgba(255,208,0,0.12)] hover:border-accent/40'
          : 'bg-[#111110] border border-white/[0.06] hover:border-white/[0.14] hover:bg-[#141412] hover:shadow-[0_8px_40px_rgba(0,0,0,0.4)]'
      }`}
    >
      {/* Top accent line on featured */}
      {featured && <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />}

      {/* Tag */}
      {mode.tag && (
        <span className="absolute top-4 right-4 text-[0.6rem] font-display tracking-[0.12em] text-bg bg-accent px-2.5 py-1 rounded-tactical">
          {mode.tag}
        </span>
      )}

      {/* Icon */}
      <div className="text-3xl">{mode.icono}</div>

      <div className="flex flex-col gap-3 flex-1">
        <h3 className={`font-display text-[1.05rem] tracking-wide transition-colors duration-200 ${featured ? 'text-accent' : 'text-text group-hover:text-accent'}`}>
          {mode.nombre.toUpperCase()}
        </h3>
        <p className="text-text/45 text-[0.85rem] leading-[1.8] font-body flex-1">{mode.descripcion}</p>
        <DifficultyBar level={mode.dificultad} />
      </div>
    </motion.div>
  )
}

export default function Experiencia() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })

  return (
    <section id="experiencia" className="py-32" ref={ref}>
      <div className="max-w-7xl mx-auto px-6 md:px-10">

        <motion.div
          initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
          className="mb-16"
        >
          <span className="inline-block font-body text-[0.65rem] font-medium tracking-[0.22em] uppercase text-accent mb-5">002 / Modalidades</span>
          <h2 className="heading-shimmer section-title text-[clamp(2.6rem,5.5vw,4.2rem)] leading-[0.92] mb-4">
            Elige tu <span className="text-accent">Misión</span>
          </h2>
          <p className="text-text/45 text-[1.05rem] max-w-lg font-body">
            Cinco modos de juego distintos. Cada partida es un combate diferente.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {gameModes.slice(0, 3).map((mode, i) => (
            <GameCard key={mode.id} mode={mode} delay={i * 0.1} />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {gameModes.slice(3).map((mode, i) => (
            <GameCard key={mode.id} mode={mode} delay={i * 0.1} featured={mode.id === 'nocturno'} />
          ))}
        </div>

      </div>
    </section>
  )
}