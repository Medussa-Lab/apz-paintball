'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

const stats = [
  { value: 20000, suffix: 'm²', label: 'de campo de batalla', prefix: '+' },
  { value: 30, suffix: '', label: 'jugadores simultáneos', prefix: '' },
  { value: 10, suffix: 'min', label: 'del centro de A Coruña', prefix: '' },
  { value: 2, suffix: '', label: 'escenarios grandes', prefix: '' },
]

const pillars = [
  {
    icon: '🔫',
    title: 'Equipamiento Profesional',
    desc: 'Marcadoras Tippmann 98, BT-4 Combat y Valken SW-1. Mono integral, chaleco anti-bolas, protector de cuello, máscara Valken MI-3 Thermal con doble lente antivaho y guantes con protecciones.',
  },
  {
    icon: '👨‍👩‍👧‍👦',
    title: 'Todas las Edades',
    desc: 'Desde 8 años con marcadoras JT Splatmaster de acción manual y bolas de menor calibre. Adultos (desde 14 años) y niños pueden jugar juntos en la misma partida. Los menores de 16 necesitan autorización parental.',
  },
  {
    icon: '🌙',
    title: 'Paintball Nocturno',
    desc: 'Linternas tácticas con pulsador remoto acopladas a la marcadora. La cápsula de gelatina de las bolas brilla al impactar en la oscuridad del bosque. Una experiencia única que dispara la adrenalina.',
  },
  {
    icon: '🛡️',
    title: 'Todo Incluido',
    desc: 'Seguro de RC y Accidentes, agua mineral, monitor en todo momento, recargas de aire, linternas tácticas para nocturno e IVA 21%. El precio que ves es el precio que pagas.',
  },
]

function Counter({ value, suffix, prefix }: { value: number; suffix: string; prefix: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })

  useEffect(() => {
    if (!inView) return
    const duration = 1600
    const start = Date.now()
    const tick = () => {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * value))
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [inView, value])

  return (
    <span ref={ref}>
      {prefix}{count.toLocaleString('es-ES')}{suffix}
    </span>
  )
}

export default function PorQueAPZ() {
  return (
    <section className="relative py-24 stripe-bg bg-dark overflow-hidden">
      {/* Decorative large number bg */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        aria-hidden="true"
      >
        <span
          className="font-display text-accent opacity-[0.02] whitespace-nowrap"
          style={{ fontSize: 'clamp(8rem, 25vw, 22rem)' }}
        >
          APZ
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
            // Por qué APZ
          </p>
          <h2 className="section-title text-4xl md:text-5xl text-text">
            EL CAMPO QUE{' '}
            <span className="text-accent">DOMINA</span>
          </h2>
        </motion.div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center md:text-left"
            >
              <div className="font-display text-accent leading-none mb-2"
                style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)' }}
              >
                <Counter value={stat.value} suffix={stat.suffix} prefix={stat.prefix} />
              </div>
              <p className="text-text-muted text-sm leading-snug">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent mb-16" />

        {/* Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {pillars.map((pillar, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="bg-bg border-l-4 border-accent p-6 rounded-tactical group hover:shadow-accent-card transition-all duration-300"
            >
              <div className="text-3xl mb-4">{pillar.icon}</div>
              <h3 className="font-display text-base text-text mb-2 tracking-wide group-hover:text-accent transition-colors">
                {pillar.title.toUpperCase()}
              </h3>
              <p className="text-text-muted text-sm leading-relaxed">{pillar.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
