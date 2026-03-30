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
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(eased * target))
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [inView, target])

  return <span ref={ref}>{prefix}{value.toLocaleString('es-ES')}{suffix}</span>
}

export default function SobreNosotros() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })

  return (
    <section id="sobre-nosotros" className="py-32" ref={ref}>
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="grid lg:grid-cols-2 gap-20 items-center">

          {/* Left — text */}
          <motion.div
            initial={{ opacity: 0, x: -65 }} animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
          >
            <span className="inline-block font-body text-[0.65rem] font-medium tracking-[0.22em] uppercase text-accent mb-4">001 / Sobre Nosotros</span>
            <h2 className="heading-shimmer section-title text-[clamp(2.4rem,5.5vw,4rem)] leading-[0.95] mb-7">
              ¿Qué es<br /><span className="text-accent">APZ Paintball?</span>
            </h2>
            <p className="text-text/60 text-[1.05rem] leading-[1.85] mb-5 font-body">
              APZ Paintball es el campo de paintball más grande de Galicia, ubicado en La Zapateira, A Coruña — a solo 10 minutos del centro. 20.000m² de bosque natural con escenarios de combate únicos.
            </p>
            <p className="text-text/60 text-[1.05rem] leading-[1.85] mb-8 font-body">
              Desde 8 años hasta veteranos experimentados. Paintball diurno, nocturno e infantil. Equipamiento profesional completo incluido: marcadoras Tippmann 98, máscara Valken MI-3 Thermal, buzo integral y seguro de accidentes.
            </p>
            <button
              onClick={() => document.querySelector('#reservas')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-tactical px-8 py-3.5 text-sm tracking-widest"
            >
              RESERVAR PARTIDA
            </button>
          </motion.div>

          {/* Right — image + stats */}
          <motion.div
            initial={{ opacity: 0, x: 65 }} animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="relative rounded-tactical overflow-hidden aspect-[4/3] mb-5 group">
              <Image
                src="/gallery/escuadron.png"
                alt="Equipo de paintball en APZ"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {/* Corner accent */}
              <div className="absolute bottom-0 right-0 w-1/2 h-1/2 border-b-2 border-r-2 border-accent/60 rounded-br-sm pointer-events-none" />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 divide-x divide-white/[0.07] border border-white/[0.07] rounded-tactical overflow-hidden">
              {[
                { target: 20000, suffix: 'm²', prefix: '+', label: 'Campo de batalla' },
                { target: 2,     suffix: '',   prefix: '',  label: 'Escenarios grandes' },
                { target: 30,    suffix: '',   prefix: '',  label: 'Jugadores a la vez' },
                { target: 10,    suffix: 'min',prefix: '',  label: 'Del centro' },
              ].map((stat, i) => (
                <div key={i} className="bg-[#111110] hover:bg-[#181817] transition-colors duration-200 text-center py-5 px-2">
                  <div className="font-display text-accent leading-none mb-1" style={{ fontSize: 'clamp(1.3rem,3vw,2rem)' }}>
                    <CountUp target={stat.target} suffix={stat.suffix} prefix={stat.prefix} />
                  </div>
                  <span className="font-body text-[0.6rem] tracking-[0.1em] uppercase text-text/30 leading-tight">{stat.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
