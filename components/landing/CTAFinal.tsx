'use client'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

export default function CTAFinal() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })

  const scrollTo = (href: string) =>
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <section className="py-24 relative overflow-hidden" ref={ref}>
      {/* Accent glow */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 80% 70% at 50% 50%, rgba(255,208,0,0.06), transparent 70%)',
      }} />
      {/* Top border line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

      <div className="max-w-4xl mx-auto px-6 md:px-10 text-center relative" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
        >
          <span className="inline-block font-body text-[0.65rem] font-medium tracking-[0.22em] uppercase text-accent mb-6">
            ¿A qué esperas?
          </span>
          <h2 className="heading-shimmer section-title text-[clamp(2.8rem,6vw,5rem)] leading-[0.9] mb-6">
            El bosque<br /><span className="text-accent">te espera</span>
          </h2>
          <p className="text-text/40 text-[1.1rem] max-w-xl mx-auto font-body mb-10 leading-relaxed">
            20.000m² de adrenalina en La Zapateira, A Coruña. Reserva ahora sin pago previo — confirmamos en menos de 24 horas.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => scrollTo('#reservas')}
              className="btn-tactical px-10 py-4 text-sm tracking-widest"
            >
              RESERVAR PARTIDA
            </button>
            <a
              href="tel:722124321"
              className="font-display text-[0.82rem] tracking-[0.12em] uppercase text-text/50 hover:text-accent transition-colors duration-200 border border-white/10 hover:border-accent/40 px-8 py-4 rounded-lg"
            >
              722 124 321
            </a>
          </div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="flex flex-wrap items-center justify-center gap-8 mt-14 pt-10 border-t border-white/[0.06]"
          >
            {[
              { value: '+20.000m²', label: 'Campo de batalla' },
              { value: 'Sin pago',  label: 'Previo al reservar' },
              { value: '<24h',      label: 'Confirmación' },
              { value: 'Desde 8',   label: 'Años de edad' },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="font-display text-accent text-2xl leading-none mb-1">{item.value}</div>
                <div className="font-body text-[0.65rem] tracking-[0.12em] uppercase text-text/25">{item.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
