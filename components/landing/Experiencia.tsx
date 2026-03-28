'use client'

import { motion } from 'framer-motion'
import type { GameMode } from '@/lib/types'

const gameModes: GameMode[] = [
  {
    id: 'base',
    nombre: 'Capturar la Base',
    descripcion:
      'Infiltra el territorio enemigo y domina su base. Estrategia, coordinación y fuego de cobertura. El clásico que nunca decepciona.',
    icono: '🏴',
    dificultad: 4,
  },
  {
    id: 'capitan',
    nombre: 'El Capitán',
    descripcion:
      'Un jugador se convierte en el objetivo. Protégelo o elimínalo. Cada decisión puede cambiar el resultado del combate.',
    icono: '🎖️',
    dificultad: 5,
  },
  {
    id: 'bandera',
    nombre: 'Bandera Central',
    descripcion:
      'La bandera está en tierra de nadie. Dos equipos, un objetivo. El primero en capturarla y llevarla a su base, gana.',
    icono: '🚩',
    dificultad: 3,
  },
  {
    id: 'nocturno',
    nombre: 'Paintball Nocturno',
    descripcion:
      'Bajo la oscuridad del bosque, con linternas tácticas y bolas fluorescentes. Una experiencia única que no olvidarás.',
    icono: '🌙',
    dificultad: 5,
    tag: 'EXCLUSIVO',
  },
  {
    id: 'infantil',
    nombre: 'Paintball Infantil',
    descripcion:
      'Desde 8 años. Marcadoras de acción manual, bolas más blandas, misma adrenalina. Adultos y niños pueden jugar juntos.',
    icono: '🛡️',
    dificultad: 1,
    tag: 'FAMILIAR',
  },
]

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}

const cardVariant = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
}

function DifficultyDots({ level }: { level: number }) {
  return (
    <div className="flex gap-1.5 items-center">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className={`w-2 h-2 rounded-full border ${
            i < level
              ? 'bg-accent border-accent'
              : 'bg-transparent border-white/20'
          }`}
        />
      ))}
      <span className="text-xs text-text-muted ml-1 font-body">
        {level <= 1 ? 'Iniciación' : level <= 2 ? 'Fácil' : level <= 3 ? 'Medio' : level <= 4 ? 'Avanzado' : 'Extremo'}
      </span>
    </div>
  )
}

export default function Experiencia() {
  return (
    <section id="experiencia" className="relative py-24 bg-bg overflow-hidden">
      {/* Decorative splatter accent */}
      <div className="absolute top-0 right-0 w-64 h-64 opacity-5 pointer-events-none">
        <svg viewBox="0 0 200 200" fill="#FFD000">
          <ellipse cx="120" cy="80" rx="70" ry="50" />
          <circle cx="180" cy="40" r="20" />
          <circle cx="60" cy="140" r="15" />
          <circle cx="170" cy="140" r="12" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <p className="text-accent font-display text-sm tracking-[0.3em] uppercase mb-3">
            // Modalidades
          </p>
          <h2 className="section-title text-4xl md:text-5xl text-text">
            ELIGE TU <span className="text-accent">MISIÓN</span>
          </h2>
          <p className="text-text-muted mt-4 max-w-xl text-lg">
            Cinco modos de juego distintos. Cada partida es un combate diferente.
          </p>
        </motion.div>

        {/* Cards grid — 3+2 asymmetric */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {gameModes.slice(0, 3).map((mode) => (
            <GameCard key={mode.id} mode={mode} />
          ))}
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4"
        >
          {gameModes.slice(3).map((mode) => (
            <GameCard key={mode.id} mode={mode} large />
          ))}
        </motion.div>
      </div>
    </section>
  )
}

function GameCard({ mode, large = false }: { mode: GameMode; large?: boolean }) {
  return (
    <motion.div
      variants={cardVariant}
      className={`card-splatter relative bg-dark border border-white/8 rounded-tactical p-7 flex flex-col gap-4 group hover:border-accent/40 transition-all duration-300 hover:shadow-accent-card ${large ? 'md:flex-row md:items-start md:gap-8' : ''}`}
    >
      {/* Tag */}
      {mode.tag && (
        <span className="absolute top-4 right-4 text-[10px] font-display tracking-widest text-bg bg-accent px-2 py-0.5 rounded-tactical">
          {mode.tag}
        </span>
      )}

      {/* Icon */}
      <div className={`text-4xl ${large ? 'md:text-5xl mt-1 flex-shrink-0' : ''}`}>{mode.icono}</div>

      <div className="flex flex-col gap-3">
        {/* Name */}
        <h3 className="font-display text-xl text-text group-hover:text-accent transition-colors duration-200 tracking-wide">
          {mode.nombre.toUpperCase()}
        </h3>

        {/* Description */}
        <p className="text-text-muted text-sm leading-relaxed flex-1">{mode.descripcion}</p>

        {/* Difficulty */}
        <DifficultyDots level={mode.dificultad} />
      </div>
    </motion.div>
  )
}
