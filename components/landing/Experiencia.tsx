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

function DifficultyDots({ level }: { level: number }) {
  const label = level <= 1 ? 'Iniciación' : level <= 2 ? 'Fácil' : level <= 3 ? 'Medio' : level <= 4 ? 'Avanzado' : 'Extremo'
  return (
    <div className="flex gap-1.5 items-center">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className={`w-2 h-2 rounded-full border ${i < level ? 'bg-accent border-accent' : 'bg-transparent border-white/20'}`} />
      ))}
      <span className="text-xs text-text-muted ml-1 font-body">{label}</span>
    </div>
  )
}

function GameCard({ mode, delay }: { mode: GameMode; delay: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-8%' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.4, 0, 0.2, 1] }}
      className="relative bg-[#111110] border border-white/[0.07] rounded-tactical p-7 flex flex-col gap-4 group hover:border-accent/40 transition-all duration-300 hover:shadow-accent-card"
    >
      {mode.tag && (
        <span className="absolute top-4 right-4 text-[10px] font-display tracking-widest text-bg bg-accent px-2 py-0.5 rounded-tactical">
          {mode.tag}
        </span>
      )}
      <div className="text-4xl">{mode.icono}</div>
      <div className="flex flex-col gap-3">
        <h3 className="font-display text-[1.1rem] tracking-wide text-text group-hover:text-accent transition-colors duration-200">
          {mode.nombre.toUpperCase()}
        </h3>
        <p className="text-text/50 text-[0.87rem] leading-relaxed font-body flex-1">{mode.descripcion}</p>
        <DifficultyDots level={mode.dificultad} />
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
          initial={{ opacity: 0, y: 55 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
          className="mb-16"
        >
          <span className="inline-block font-body text-[0.65rem] font-medium tracking-[0.22em] uppercase text-accent mb-4">002 / Modalidades</span>
          <h2 className="heading-shimmer section-title text-[clamp(2.4rem,5.5vw,4rem)] leading-[0.95] mb-4">
            Elige tu <span className="text-accent">Misión</span>
          </h2>
          <p className="text-text/50 text-[1.05rem] max-w-lg font-body">
            Cinco modos de juego distintos. Cada partida es un combate diferente.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {gameModes.slice(0, 3).map((mode, i) => (
            <GameCard key={mode.id} mode={mode} delay={i * 0.08} />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {gameModes.slice(3).map((mode, i) => (
            <GameCard key={mode.id} mode={mode} delay={i * 0.08} />
          ))}
        </div>

      </div>
    </section>
  )
}
