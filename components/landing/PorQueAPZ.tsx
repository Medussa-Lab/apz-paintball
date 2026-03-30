'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

const stats = [
  { value: 20000, suffix: 'm²', label: 'campo de batalla',     prefix: '+' },
  { value: 30,    suffix: '',   label: 'jugadores simultáneos', prefix: '' },
  { value: 10,    suffix: 'min',label: 'del centro',            prefix: '' },
  { value: 2,     suffix: '',   label: 'escenarios grandes',    prefix: '' },
]

const pillars = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
    title: 'Equipamiento Profesional',
    desc: 'Marcadoras Tippmann 98, BT-4 Combat y Valken SW-1. Mono integral, chaleco anti-bolas, protector de cuello, máscara Valken MI-3 Thermal con doble lente antivaho y guantes.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: 'Todas las Edades',
    desc: 'Desde 8 años con marcadoras JT Splatmaster. Adultos (14+) y niños pueden jugar juntos. Los menores de 16 necesitan autorización parental. Máximo 30 jugadores simultáneos.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
      </svg>
    ),
    title: 'Paintball Nocturno',
    desc: 'Linternas tácticas con pulsador remoto acopladas a la marcadora. Las bolas brillan al impactar en la oscuridad del bosque. Una experiencia que dispara la adrenalina al máximo.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: 'Todo Incluido',
    desc: 'Seguro de RC y Accidentes, agua mineral, monitor en todo momento, recargas de aire e IVA 21%. El precio que ves es el precio que pagas. Sin sorpresas.',
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

  return <span ref={ref}>{prefix}{count.toLocaleString('es-ES')}{suffix}</span>
}

export default function PorQueAPZ() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })

  return (
    <section id="por-que-apz" className="py-32" ref={ref}>
      <div className="max-w-7xl mx-auto px-6 md:px-10">

        <motion.div
          initial={{ opacity: 0, y: 55 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
          className="mb-16"
        >
          <span className="inline-block font-body text-[0.65rem] font-medium tracking-[0.22em] uppercase text-accent mb-4">004 / Por qué APZ</span>
          <h2 className="heading-shimmer section-title text-[clamp(2.4rem,5.5vw,4rem)] leading-[0.95] mb-4">
            El campo que <span className="text-accent">domina</span>
          </h2>
          <p className="text-text/50 text-[1.05rem] max-w-lg font-body">
            El campo de paintball más completo de Galicia.
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/[0.06] border border-white/[0.06] rounded-tactical overflow-hidden mb-16">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.4, 0, 0.2, 1] }}
              className="bg-[#080807] hover:bg-[#111110] transition-colors duration-200 text-center py-8 px-4"
            >
              <div className="font-display text-accent leading-none mb-2" style={{ fontSize: 'clamp(2rem,5vw,3.2rem)' }}>
                <Counter value={stat.value} suffix={stat.suffix} prefix={stat.prefix} />
              </div>
              <p className="text-text/30 text-[0.72rem] tracking-[0.1em] uppercase font-body">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {pillars.map((pillar, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 + i * 0.1, ease: [0.4, 0, 0.2, 1] }}
              className="bg-[#111110] border border-white/[0.07] rounded-tactical p-6 group hover:border-accent/40 hover:shadow-accent-card transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-full border border-accent/30 bg-accent/[0.06] flex items-center justify-center mb-5 text-accent group-hover:bg-accent/15 group-hover:border-accent/60 transition-all duration-300">
                {pillar.icon}
              </div>
              <h3 className="font-display text-[0.95rem] tracking-wide text-text mb-2 group-hover:text-accent transition-colors">
                {pillar.title.toUpperCase()}
              </h3>
              <p className="text-text/45 text-[0.83rem] leading-relaxed font-body">{pillar.desc}</p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
