'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const faqs = [
  {
    q: '¿La práctica del paintball conlleva algún tipo de riesgo?',
    a: 'El índice de lesiones es muy inferior al de deportes como el tenis, fútbol o golf. Siempre que se use la equipación adecuada y se respeten las normas de seguridad no se sufrirá ningún daño. Únicamente podría dejar pequeños moratones si se incumpliera la norma de no disparar a menos de 10 metros. Antes de cada partida el monitor informa a todos los jugadores de las normas de seguridad.',
  },
  {
    q: '¿Se usan pistolas de verdad?',
    a: 'No. Se llaman marcadoras, no pistolas, porque su función es marcar con pintura, no disparar proyectiles. Funcionan con aire comprimido de alta presión. Para los niños usamos marcadoras infantiles JT Splatmaster que funcionan con muelle, lo que implica mucha menos velocidad y bolas de menor calibre.',
  },
  {
    q: '¿La pintura de las bolas es tóxica?',
    a: 'No. Las bolas están fabricadas con una cápsula de gelatina y relleno de colorante alimenticio y propilenglicol (el mismo líquido que se usa en jarabes). Son 100% biodegradables, no tóxicas y se retiran fácilmente con agua. No dejan manchas permanentes.',
  },
  {
    q: '¿Cuántos jugadores se necesitan para jugar?',
    a: 'El mínimo es 6 jugadores en fin de semana y festivos, y 8 jugadores de lunes a jueves no festivos. El máximo son 30 jugadores simultáneos. Para grupos especiales o team building, consúltanos para condiciones personalizadas.',
  },
  {
    q: '¿Cuál es la edad mínima para jugar?',
    a: 'Desde 8 años con Paintball Infantil (marcadoras de acción manual, bolas más blandas y de menor calibre). Para la modalidad de adultos, la edad mínima es 14 años. Los jugadores entre 14 y 16 años deben presentar autorización firmada por sus padres o tutores. Adultos y niños pueden jugar juntos.',
  },
  {
    q: '¿Cuánto tiempo dura una sesión?',
    a: 'Entre 2 y 3 horas dependiendo de la cantidad de munición y la estrategia de los equipos. Cada ronda de juego es corta: cuando un jugador es eliminado sale a la zona de seguridad y en unos instantes comienza la siguiente ronda.',
  },
  {
    q: '¿Puedo llevar gafas debajo de la máscara?',
    a: 'Sí, siempre que el tamaño no sea muy grande. Usamos máscaras con lentes térmicas de doble pantalla que evitan que se empañen. Si las lentes de tus gafas se empañan, te proporcionamos líquido antivaho para aplicar sobre ellas.',
  },
  {
    q: '¿Hay seguro que cubra a los jugadores?',
    a: 'Sí. Contamos con seguro de responsabilidad civil y accidentes que cubre a todos los jugadores dentro del campo, incluido en el precio. Es importante firmar el documento de consentimiento que facilitamos antes del inicio de la partida.',
  },
  {
    q: '¿Cómo llego al campo?',
    a: 'El campo está en Av. Nueva York 33-35, La Zapateira, A Coruña, a 10 minutos del centro. En transporte público: bus línea 24 de A Coruña, parada en la urbanización "O Carón", a escasos metros del campo. En coche: disponemos de zona de aparcamiento en el propio campo.',
  },
  {
    q: '¿Cómo funciona la reserva?',
    a: 'Rellena el formulario de esta página o llámanos al 981 151 871, 653 101 094 o 722 124 321. Recibirás confirmación en menos de 24 horas. No se requiere pago previo: el abono se realiza el día de la partida.',
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
