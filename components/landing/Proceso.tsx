'use client'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const STEPS = [
  {
    num: '01',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
        <rect x="3" y="4" width="18" height="18" rx="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    ),
    title: 'Reserva online',
    desc: 'Rellena el formulario con tu fecha, número de jugadores y modalidad. Confirmamos en menos de 24 horas sin pago previo.',
  },
  {
    num: '02',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    title: 'Llegada y equipado',
    desc: 'Te recibimos en el campo, firmáis el consentimiento y os equipamos con todo lo necesario. El monitor explica las normas de seguridad.',
  },
  {
    num: '03',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
        <circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/>
      </svg>
    ),
    title: '¡Al campo!',
    desc: 'Adrenalina pura en 20.000m² de bosque. Varias rondas en diferentes escenarios. Entre 2 y 3 horas de partida total.',
  },
  {
    num: '04',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
        <path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
      </svg>
    ),
    title: 'Foto y recuerdo',
    desc: 'Terminada la partida, foto de grupo con el equipo puesto. Una experiencia que no olvidaréis en mucho tiempo.',
  },
]

export default function Proceso() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })

  return (
    <section id="proceso" className="py-32" ref={ref}>
      <div className="max-w-7xl mx-auto px-6 md:px-10">

        <motion.div
          initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
          className="text-center mb-20"
        >
          <span className="inline-block font-body text-[0.65rem] font-medium tracking-[0.22em] uppercase text-accent mb-5">005 / Proceso</span>
          <h2 className="heading-shimmer section-title text-[clamp(2.6rem,5.5vw,4.2rem)] leading-[0.92] mb-4">
            ¿Cómo <span className="text-accent">funciona?</span>
          </h2>
          <p className="text-text/40 text-[1.05rem] font-body">Cuatro pasos para vivir la experiencia completa.</p>
        </motion.div>

        {/* Steps — horizontal desktop, vertical mobile */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_32px_1fr_32px_1fr_32px_1fr] items-start gap-0">
          {STEPS.map((step, i) => (
            <>
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: i * 0.15, ease: [0.4, 0, 0.2, 1] }}
                className="group flex md:flex-col items-start md:items-center gap-5 md:gap-0 p-4 md:text-center"
              >
                {/* Number */}
                <div className="font-display text-[0.58rem] tracking-[0.2em] text-accent/50 md:mb-5 flex-shrink-0">{step.num}</div>

                {/* Icon circle */}
                <div className="hidden md:flex w-14 h-14 rounded-full border border-accent/25 bg-accent/[0.05] items-center justify-center mb-5 text-accent mx-auto group-hover:bg-accent/12 group-hover:border-accent/50 group-hover:scale-110 transition-all duration-300 flex-shrink-0">
                  {step.icon}
                </div>

                <div>
                  <h3 className="font-display text-[0.95rem] tracking-wide text-text mb-2 group-hover:text-accent transition-colors duration-200">
                    {step.title.toUpperCase()}
                  </h3>
                  <p className="text-text/40 text-[0.83rem] leading-[1.8] font-body">{step.desc}</p>
                </div>
              </motion.div>

              {i < STEPS.length - 1 && (
                <div key={`c-${i}`} className="hidden md:flex items-center justify-center pt-16">
                  <svg viewBox="0 0 32 12" className="w-8 h-3" fill="none">
                    <line x1="0" y1="6" x2="22" y2="6" stroke="#FFD000" strokeWidth="1" strokeDasharray="3 3" strokeOpacity="0.35"/>
                    <polyline points="17,1.5 23.5,6 17,10.5" stroke="#FFD000" strokeWidth="1" strokeOpacity="0.5"/>
                  </svg>
                </div>
              )}
            </>
          ))}
        </div>

      </div>
    </section>
  )
}
