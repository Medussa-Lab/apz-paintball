'use client'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const STEPS = [
  {
    num: '01',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
        <rect x="3" y="4" width="18" height="18" rx="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    ),
    title: 'Reserva online',
    desc: 'Rellena el formulario con tu fecha, número de jugadores y modalidad. Confirmamos en menos de 24 horas.',
  },
  {
    num: '02',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    title: 'Llegada y equipado',
    desc: 'Te recibimos en el campo, firmáis el consentimiento y os equipamos con todo lo necesario. El monitor explica las normas.',
  },
  {
    num: '03',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
        <circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/>
      </svg>
    ),
    title: '¡Al campo!',
    desc: 'Adrenalina pura en 20.000m² de bosque. Varias rondas de juego en diferentes escenarios, de 2 a 3 horas de partida.',
  },
  {
    num: '04',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
        <path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
      </svg>
    ),
    title: 'Foto y recuerdo',
    desc: 'Terminada la partida, foto de grupo con el equipo puesto. Una experiencia que no olvidaréis.',
  },
]

export default function Proceso() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })

  return (
    <section id="proceso" className="py-32" ref={ref}>
      <div className="max-w-7xl mx-auto px-6 md:px-10">

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }} animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.9, ease: [0.4,0,0.2,1] }}
          className="text-center mb-16"
        >
          <span className="inline-block font-body text-[0.65rem] font-medium tracking-[0.22em] uppercase text-accent mb-4">003 / Proceso</span>
          <h2 className="heading-shimmer section-title text-[clamp(2.4rem,5.5vw,4rem)] leading-[0.95] mb-4">
            ¿Cómo <span className="text-accent">funciona?</span>
          </h2>
          <p className="text-text-muted text-[1.05rem]">Cuatro pasos para vivir la experiencia completa.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] items-start gap-0">
          {STEPS.map((step, i) => (
            <>
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 45 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: i * 0.15, ease: [0.4,0,0.2,1] }}
                className="text-center md:text-center flex md:flex-col items-start md:items-center gap-4 md:gap-0 p-4 md:px-4 group"
              >
                <div className="font-display font-bold text-[0.58rem] tracking-[0.2em] text-accent md:mb-5">{step.num}</div>
                <div className="hidden md:flex w-14 h-14 rounded-full border border-accent/40 bg-accent/[0.06] items-center justify-center mb-5 text-accent group-hover:bg-accent/20 group-hover:border-accent group-hover:shadow-accent-hover transition-all duration-300 mx-auto">
                  {step.icon}
                </div>
                <div>
                  <h3 className="font-display text-[1.05rem] tracking-wide text-text mb-2">{step.title}</h3>
                  <p className="text-[0.85rem] text-text-muted leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>

              {i < STEPS.length - 1 && (
                <div key={`arrow-${i}`} className="hidden md:flex items-center pt-[4.5rem]">
                  <svg viewBox="0 0 44 12" className="w-11 h-3 flex-shrink-0" fill="none">
                    <line x1="0" y1="6" x2="34" y2="6" stroke="#FFD000" strokeWidth="1.5" strokeDasharray="4 3" strokeOpacity="0.5"/>
                    <polyline points="29,1 36,6 29,11" stroke="#FFD000" strokeWidth="1.5" strokeOpacity="0.7"/>
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
