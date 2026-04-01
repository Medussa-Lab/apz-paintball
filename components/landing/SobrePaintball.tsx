'use client'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const items = [
  {
    num: '01',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10"/>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01"/>
      </svg>
    ),
    title: 'Origen: 1981, New Hampshire',
    text: 'El paintball nació en 1981 en Estados Unidos. Los ganaderos usaban marcadoras de aire comprimido para marcar árboles y ganado. La imaginación hizo el resto y lo que era trabajo rutinario se convirtió en el deporte más adrenalínico del mundo.',
  },
  {
    num: '02',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
      </svg>
    ),
    title: 'Más seguro que el tenis o el golf',
    text: 'El índice de lesiones del paintball es inferior al del tenis, fútbol o golf. Mono integral, chaleco anti-bolas, máscara Valken MI-3 Thermal de doble lente antivaho y guantes. El monitor explica todas las normas antes de cada partida.',
  },
  {
    num: '03',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
      </svg>
    ),
    title: 'Acción, estrategia y trabajo en equipo',
    text: 'El paintball combina acción física, estrategia y trabajo en equipo. Es el único juego que da la sensación de vivir una aventura real. Ideal para team building, despedidas de soltero, cumpleaños o simplemente descargar adrenalina.',
  },
  {
    num: '04',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064"/>
      </svg>
    ),
    title: '100% biodegradable y no tóxico',
    text: 'La cápsula exterior es de gelatina orgánica. El interior, colorante alimenticio y propilenglicol — el mismo líquido que en los jarabes. No tóxicas, se retiran con agua y son totalmente respetuosas con el medioambiente del bosque.',
  },
]

export default function SobrePaintball() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })

  return (
    <section id="sobre-paintball" className="py-32" ref={ref}>
      <div className="max-w-7xl mx-auto px-6 md:px-10">

        <div className="grid lg:grid-cols-[1fr_1.7fr] gap-20 items-start">

          {/* Left — sticky header */}
          <motion.div
            initial={{ opacity: 0, x: -40 }} animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
            className="lg:sticky lg:top-32"
          >
            <span className="inline-block font-body text-[0.65rem] font-medium tracking-[0.22em] uppercase text-accent mb-5">003 / El Deporte</span>
            <h2 className="heading-shimmer section-title text-[clamp(2.6rem,5.5vw,4.2rem)] leading-[0.92] mb-6">
              Todo sobre el <span className="text-accent">Paintball</span>
            </h2>
            <div className="w-12 h-0.5 bg-accent mb-6" />
            <p className="text-text/45 text-[0.95rem] leading-[1.85] font-body">
              Más de 40 años de historia, millones de aficionados en todo el mundo. Adrenalina, estrategia y equipo.
            </p>
          </motion.div>

          {/* Right — stacked items */}
          <div className="flex flex-col divide-y divide-white/[0.06]">
            {items.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: i * 0.1, ease: [0.4, 0, 0.2, 1] }}
                className="group flex gap-6 py-8 first:pt-0 hover:pl-2 transition-all duration-300"
              >
                {/* Number + icon */}
                <div className="flex flex-col items-center gap-3 flex-shrink-0 pt-1">
                  <span className="font-display text-[0.6rem] tracking-[0.15em] text-accent/60">{item.num}</span>
                  <div className="w-9 h-9 rounded-full border border-accent/20 bg-accent/[0.05] flex items-center justify-center text-accent group-hover:bg-accent/10 group-hover:border-accent/40 transition-all duration-300">
                    {item.icon}
                  </div>
                </div>

                <div className="flex flex-col gap-2 pt-1">
                  <h3 className="font-display text-[1rem] tracking-wide text-text group-hover:text-accent transition-colors duration-200">
                    {item.title.toUpperCase()}
                  </h3>
                  <p className="text-text/45 text-[0.87rem] leading-[1.85] font-body">{item.text}</p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
