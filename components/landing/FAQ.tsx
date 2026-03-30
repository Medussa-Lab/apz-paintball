'use client'
import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const FAQS = [
  { q: '¿La práctica del paintball conlleva algún riesgo?', a: 'El índice de lesiones es muy inferior al de deportes como el tenis, fútbol o golf. Siempre que se use la equipación adecuada y se respeten las normas no se sufrirá ningún daño. Únicamente podría dejar pequeños moratones si se incumpliera la norma de no disparar a menos de 10 metros. El monitor informa de todas las normas antes de cada partida.' },
  { q: '¿Se usan pistolas de verdad?', a: 'No. Se llaman marcadoras, no pistolas, porque su función es marcar con pintura, no disparar proyectiles. Funcionan con aire comprimido de alta presión. Para los niños usamos marcadoras infantiles JT Splatmaster que funcionan con muelle, con mucha menos velocidad y bolas de menor calibre.' },
  { q: '¿La pintura de las bolas es tóxica?', a: 'No. Las bolas están fabricadas con una cápsula de gelatina y relleno de colorante alimenticio y propilenglicol (el mismo que se usa en jarabes). Son 100% biodegradables, no tóxicas y se retiran fácilmente con agua. No dejan manchas permanentes.' },
  { q: '¿Cuántos jugadores se necesitan?', a: 'El mínimo es 6 jugadores en fin de semana y festivos, y 8 jugadores entre semana (lunes a jueves no festivos). El máximo son 30 jugadores simultáneos. Para grupos especiales o team building, consúltanos para condiciones personalizadas.' },
  { q: '¿Cuál es la edad mínima para jugar?', a: 'Desde 8 años con Paintball Infantil (marcadoras de acción manual, bolas más blandas). Para la modalidad adultos, la edad mínima es 14 años. Los jugadores de 14 a 16 años deben presentar autorización firmada por sus padres. Adultos y niños pueden jugar juntos.' },
  { q: '¿Cuánto dura una sesión?', a: 'Entre 2 y 3 horas dependiendo de la cantidad de munición y la estrategia de los equipos. Cada ronda es corta: cuando un jugador es eliminado sale a la zona de seguridad y en unos instantes comienza la siguiente ronda.' },
  { q: '¿Hay seguro que cubra a los jugadores?', a: 'Sí. Contamos con seguro de responsabilidad civil y accidentes que cubre a todos los jugadores dentro del campo, incluido en el precio. Es importante firmar el documento de consentimiento que facilitamos antes de la partida.' },
  { q: '¿Cómo llego al campo?', a: 'Estamos en Av. Nueva York 33-35, La Zapateira, A Coruña — a 10 minutos del centro. Bus línea 24 de A Coruña, parada "O Carón", a escasos metros del campo. Disponemos de zona de aparcamiento en el propio campo.' },
  { q: '¿Cómo funciona la reserva?', a: 'Rellena el formulario de esta página o llámanos al 981 151 871 · 653 101 094 · 722 124 321. Recibirás confirmación en menos de 24 horas. No se requiere pago previo: el abono se realiza el día de la partida.' },
  { q: '¿Puedo llevar gafas debajo de la máscara?', a: 'Sí, siempre que el tamaño no sea muy grande. Usamos máscaras Valken MI-3 Thermal con lentes de doble pantalla para evitar empañamiento. Si tus gafas se empañan, te proporcionamos líquido antivaho.' },
]

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })

  return (
    <section id="faq" className="py-32" ref={ref}>
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="grid lg:grid-cols-[1fr_1.8fr] gap-16 lg:gap-20 items-start">

          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -65 }} animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.4,0,0.2,1] }}
          >
            <span className="inline-block font-body text-[0.65rem] font-medium tracking-[0.22em] uppercase text-accent mb-4">009 / FAQ</span>
            <h2 className="heading-shimmer section-title text-[clamp(2.4rem,5.5vw,4rem)] leading-[0.95] mb-5">
              Preguntas <span className="text-accent">frecuentes</span>
            </h2>
            <p className="text-text-muted text-[0.95rem] leading-relaxed mb-8">
              ¿Tienes otra duda? Llámanos directamente.
            </p>
            <div className="flex flex-col gap-3">
              <a href="tel:981151871" className="text-accent font-display tracking-wider text-lg hover:opacity-80 transition-opacity">
                981 151 871
              </a>
              <a href="tel:653101094" className="text-accent font-display tracking-wider text-lg hover:opacity-80 transition-opacity">
                653 101 094
              </a>
              <a href="tel:722124321" className="text-accent font-display tracking-wider text-lg hover:opacity-80 transition-opacity">
                722 124 321
              </a>
            </div>
          </motion.div>

          {/* Right — accordion */}
          <motion.div
            initial={{ opacity: 0, x: 65 }} animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.4,0,0.2,1] }}
          >
            {FAQS.map((faq, i) => (
              <div key={i} className={`border-b border-white/[0.07] ${i === 0 ? 'border-t' : ''}`}>
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  aria-expanded={open === i}
                  className={`w-full text-left flex justify-between items-center gap-4 py-5 font-display text-[0.9rem] tracking-wide transition-colors duration-200 ${open === i ? 'text-accent' : 'text-text/80 hover:text-accent'}`}
                >
                  <span>{faq.q}</span>
                  <span className={`flex-shrink-0 w-5 h-5 rounded-full border flex items-center justify-center transition-all duration-300 ${open === i ? 'border-accent bg-accent' : 'border-white/20 opacity-60'}`}>
                    <svg viewBox="0 0 10 10" className="w-3 h-3" fill="none" stroke={open === i ? '#080807' : 'currentColor'} strokeWidth="1.5">
                      <line x1="1" y1="5" x2="9" y2="5"/>
                      {open !== i && <line x1="5" y1="1" x2="5" y2="9"/>}
                    </svg>
                  </span>
                </button>
                <div
                  className="overflow-hidden transition-all duration-300"
                  style={{ maxHeight: open === i ? '240px' : '0' }}
                >
                  <p className="text-text-muted text-[0.9rem] leading-[1.85] pb-5 pr-8 font-body">{faq.a}</p>
                </div>
              </div>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  )
}
