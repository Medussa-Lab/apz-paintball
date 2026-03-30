'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const items = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
    ),
    title: 'Origen: 1981, New Hampshire',
    text: 'El paintball nació en 1981 en Estados Unidos. Los ganaderos usaban marcadoras de aire comprimido para marcar árboles y ganado. La imaginación hizo el resto y lo que era trabajo rutinario se convirtió en el deporte más adrenalínico del mundo.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: 'Más seguro que el tenis',
    text: 'El índice de lesiones del paintball es inferior al del tenis, fútbol o golf. Mono integral, chaleco anti-bolas, máscara Valken MI-3 Thermal de doble lente antivaho y guantes. El monitor explica todas las normas antes de cada partida.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: 'Acción, estrategia y equipo',
    text: 'El paintball combina acción física, estrategia y trabajo en equipo. Es el único juego que da la sensación de vivir una aventura real. Ideal para team building, despedidas de soltero, cumpleaños o simplemente descargar adrenalina.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
      </svg>
    ),
    title: '100% biodegradable',
    text: 'La cápsula exterior es de gelatina orgánica. El interior, colorante alimenticio y propilenglicol — el mismo líquido que en los jarabes. No tóxicas, se retiran con agua y son totalmente respetuosas con el medioambiente del bosque.',
  },
]

export default function SobrePaintball() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })

  return (
    <section id="sobre-paintball" className="py-32" ref={ref}>
      <div className="max-w-7xl mx-auto px-6 md:px-10">

        <motion.div
          initial={{ opacity: 0, y: 55 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
          className="mb-16"
        >
          <span className="inline-block font-body text-[0.65rem] font-medium tracking-[0.22em] uppercase text-accent mb-4">003 / El Deporte</span>
          <h2 className="heading-shimmer section-title text-[clamp(2.4rem,5.5vw,4rem)] leading-[0.95] mb-4">
            Todo sobre el <span className="text-accent">Paintball</span>
          </h2>
          <p className="text-text/50 text-[1.05rem] max-w-lg font-body">
            Adrenalina, estrategia y trabajo en equipo. Más de 40 años de historia, millones de aficionados.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.4, 0, 0.2, 1] }}
              className="bg-[#111110] border border-white/[0.07] rounded-tactical p-7 flex gap-5 group hover:border-accent/30 transition-all duration-300"
            >
              <div className="text-accent flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-300">
                {item.icon}
              </div>
              <div>
                <h3 className="font-display text-[1rem] tracking-wide text-text mb-2.5 group-hover:text-accent transition-colors duration-200">
                  {item.title.toUpperCase()}
                </h3>
                <p className="text-text/50 text-[0.87rem] leading-relaxed font-body">{item.text}</p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
