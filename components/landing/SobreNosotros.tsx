'use client'
import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import Image from 'next/image'

function CountUp({ target, suffix = '', prefix = '' }: { target: number; suffix?: string; prefix?: string }) {
  const [value, setValue] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return
    const duration = 1800
    const start = Date.now()
    const tick = () => {
      const progress = Math.min((Date.now() - start) / duration, 1)
      setValue(Math.round((1 - Math.pow(1 - progress, 3)) * target))
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [inView, target])

  return <span ref={ref}>{prefix}{value.toLocaleString('es-ES')}{suffix}</span>
}

const STATS = [
  { target: 20000, suffix: 'm²', prefix: '+', label: 'Campo de batalla' },
  { target: 2,     suffix: '',   prefix: '',  label: 'Escenarios únicos' },
  { target: 30,    suffix: '',   prefix: '',  label: 'Jugadores a la vez' },
  { target: 10,    suffix: 'min',prefix: '',  label: 'Del centro' },
]

export default function SobreNosotros() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })

  return (
    <section id="sobre-nosotros" className="py-32" ref={ref}>
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="grid lg:grid-cols-2 gap-20 items-center">

          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -55 }} animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
          >
            <span className="inline-block font-body text-[0.65rem] font-medium tracking-[0.22em] uppercase text-accent mb-5">001 / Sobre Nosotros</span>
            <h2 className="heading-shimmer section-title text-[clamp(2.6rem,5.5vw,4.2rem)] leading-[0.92] mb-8">
              ¿Qué es<br /><span className="text-accent">APZ Paintball?</span>
            </h2>

            {/* Accent line */}
            <div className="w-12 h-0.5 bg-accent mb-8" />

            <p className="text-text/55 text-[1.05rem] leading-[1.9] mb-5 font-body">
              APZ Paintball es el campo de paintball más grande de Galicia, ubicado en La Zapateira, A Coruña — a solo 10 minutos del centro. 20.000m² de bosque natural con escenarios de combate únicos diseñados para la adrenalina pura.
            </p>
            <p className="text-text/55 text-[1.05rem] leading-[1.9] mb-10 font-body">
              Desde 8 años hasta veteranos experimentados. Paintball diurno, nocturno e infantil. Equipamiento profesional completo incluido: marcadoras Tippmann 98, máscara Valken MI-3 Thermal, buzo integral y seguro de accidentes.
            </p>

            <button
              onClick={() => document.querySelector('#reservas')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-tactical px-8 py-4 text-sm tracking-widest"
            >
              RESERVAR PARTIDA
            </button>
          </motion.div>

          {/* Right */}
          <motion.div
            initial={{ opacity: 0, x: 55 }} animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
            className="flex flex-col gap-5"
          >
            {/* Image */}
            <div className="relative rounded-tactical overflow-hidden aspect-[16/10] group">
              <Image
                src="/gallery/escuadron.png"
                alt="Equipo de paintball en APZ"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              {/* Corner accent */}
              <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-accent/70 pointer-events-none" />
              <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-accent/30 pointer-events-none" />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-px bg-white/[0.05] rounded-tactical overflow-hidden border border-white/[0.05]">
              {STATS.map((stat, i) => (
                <div key={i} className="bg-[#0f0f0e] hover:bg-[#151513] transition-colors duration-300 text-center py-6 px-2 flex flex-col items-center gap-1">
                  <div className="font-display text-accent leading-none" style={{ fontSize: 'clamp(1.2rem,2.8vw,1.9rem)' }}>
                    <CountUp target={stat.target} suffix={stat.suffix} prefix={stat.prefix} />
                  </div>
                  <span className="font-body text-[0.58rem] tracking-[0.1em] uppercase text-text/25 leading-tight text-center">{stat.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
