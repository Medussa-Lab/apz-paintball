'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const faqs = [
  {
    q: '¿Cuántos jugadores se necesitan para jugar?',
    a: 'El mínimo es 6 jugadores para partidas de fin de semana y 8 para entre semana. No hay máximo: aceptamos grupos de hasta 30 jugadores simultáneos. Para grupos más grandes, contacta con nosotros para organizarlo.',
  },
  {
    q: '¿Cuál es la edad mínima para jugar?',
    a: 'Desde 8 años con nuestra modalidad Paintball Infantil, que usa marcadoras de acción manual y bolas más blandas. Para la modalidad estándar, la edad mínima recomendada es 14 años. Adultos y niños pueden jugar juntos en partidas mixtas.',
  },
  {
    q: '¿Qué ropa debo llevar?',
    a: 'Ropa deportiva cómoda y calzado con buen agarre (botas de monte o zapatillas deportivas). Evita ropa muy ajustada. El traje de protección, casco y guantes están incluidos en el precio.',
  },
  {
    q: '¿Duelen las bolas de paintball?',
    a: 'La sensación es similar a un capirotazo fuerte. Con el traje y el equipo de protección incluido (casco, peto y protecciones), el impacto es mínimo. El paintball infantil usa bolas aún más suaves.',
  },
  {
    q: '¿Está incluido todo el equipamiento?',
    a: 'Sí, 100%. Marcadora, traje completo, casco térmico antivaho, protecciones, guantes, 100 bolas de pintura, seguro de accidentes, agua mineral e instructor/monitor durante toda la partida. Sin sorpresas en el precio.',
  },
  {
    q: '¿Cuánto tiempo dura una partida?',
    a: 'Una sesión completa dura entre 2 y 3 horas aproximadamente, incluyendo la llegada, explicación de normas, equipamiento y las rondas de juego. Cada ronda de combate dura entre 10 y 20 minutos.',
  },
  {
    q: '¿Se puede jugar sin experiencia previa?',
    a: 'Por supuesto. No se necesita ninguna experiencia. El instructor explica todas las normas y el manejo de la marcadora antes de comenzar. Tenemos modalidades para todos los niveles, desde iniciación hasta avanzado.',
  },
  {
    q: '¿Cómo funciona la reserva?',
    a: 'Rellena el formulario de reserva en esta página o llámanos al 722 124 321. Recibirás confirmación en menos de 24 horas. No se requiere pago previo para reservar: el pago se realiza el día de la partida.',
  },
  {
    q: '¿Dónde estáis ubicados?',
    a: 'En Av. Nueva York 33-35, La Zapateira, A Coruña. A solo 10 minutos del centro. Accesible en bus línea 24 (parada "O Carón") o en coche con parking gratuito.',
  },
]

function FAQItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="border-b border-white/8"
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between py-5 text-left gap-4 group"
      >
        <span className="font-display text-sm md:text-base tracking-wide text-text group-hover:text-accent transition-colors duration-200">
          {q}
        </span>
        <span
          className={`flex-shrink-0 w-6 h-6 rounded-full border border-white/20 flex items-center justify-center text-accent transition-all duration-300 ${open ? 'rotate-45 border-accent/50 bg-accent/10' : ''}`}
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        </span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p className="text-text-muted text-sm leading-relaxed pb-5 max-w-2xl">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function FAQ() {
  return (
    <section id="faq" className="relative py-24 bg-dark overflow-hidden">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <p className="text-accent font-display text-sm tracking-[0.3em] uppercase mb-3">
            // FAQ
          </p>
          <h2 className="section-title text-4xl md:text-5xl text-text">
            PREGUNTAS <span className="text-accent">FRECUENTES</span>
          </h2>
          <p className="text-text-muted mt-4 text-lg">
            Todo lo que necesitas saber antes de tu primera partida.
          </p>
        </motion.div>

        <div>
          {faqs.map((faq, i) => (
            <FAQItem key={i} q={faq.q} a={faq.a} index={i} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 bg-bg border border-accent/20 rounded-tactical p-6 flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <p className="text-text-muted text-sm">¿Tienes otra pregunta? Estamos aquí para ayudarte.</p>
          <a
            href="tel:722124321"
            className="btn-tactical px-6 py-2.5 text-sm tracking-widest whitespace-nowrap"
          >
            LLAMAR AHORA
          </a>
        </motion.div>
      </div>
    </section>
  )
}
