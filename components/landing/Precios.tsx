'use client'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const PLANS = [
  {
    name: 'Entre Semana',
    sub: 'Lunes a Jueves · No festivos',
    price: '15€',
    per: '/ jugador',
    from: false,
    bolas: '100 bolas incluidas',
    minNote: 'Mínimo 8 jugadores',
    features: [
      'Marcadora Tippmann 98 o BT-4',
      'Máscara Valken MI-3 Thermal',
      'Buzo integral + chaleco',
      'Instructor/monitor',
      'Seguro RC y Accidentes',
      'Agua mineral',
    ],
    featured: false,
    cta: 'Reservar',
  },
  {
    name: 'Fin de Semana',
    sub: 'Viernes, Sábado, Domingo · Festivos',
    price: '20€',
    per: '/ jugador',
    from: false,
    bolas: '100 bolas incluidas',
    minNote: 'Mínimo 6 jugadores',
    features: [
      'Marcadora Tippmann 98 o BT-4',
      'Máscara Valken MI-3 Thermal',
      'Buzo integral + chaleco',
      'Instructor/monitor',
      'Seguro RC y Accidentes',
      'Agua mineral',
    ],
    featured: true,
    badge: 'Más popular',
    cta: 'Reservar',
  },
  {
    name: 'Super Pack',
    sub: 'Cualquier día de la semana',
    price: '35€',
    per: '/ jugador',
    from: false,
    bolas: '500 bolas incluidas',
    minNote: 'Para los más intensos',
    features: [
      'Marcadora Tippmann 98 o BT-4',
      'Máscara Valken MI-3 Thermal',
      'Buzo integral + chaleco',
      'Instructor/monitor',
      'Seguro RC y Accidentes',
      'Agua mineral',
    ],
    featured: false,
    cta: 'Reservar',
  },
  {
    name: 'Paintball Infantil',
    sub: 'Desde 8 años · JT Splatmaster',
    price: '',
    per: '',
    from: false,
    bolas: '',
    minNote: '',
    features: [],
    featured: false,
    badge: 'Niños',
    badgeGold: false,
    isSpecial: true,
    cta: 'Consultar precio',
  },
]

const INFANTIL_TIERS = [
  { name: 'Splatmaster', desc: 'Marcadora manual sin CO₂', age: 'Desde 8 años', highlight: false },
  { name: 'Adultos + Niños', desc: 'Mixto desde 14 años', age: 'Con autorización', highlight: true },
]

const EXTRAS = [
  { label: 'Recarga 100 bolas', precio: '5€' },
  { label: 'Caja 2000 bolas', precio: '90€' },
  { label: 'Grupos privados', precio: 'Consultar' },
  { label: 'Paintball nocturno', precio: 'Especial' },
]

export default function Precios() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })
  const scrollTo = () => document.querySelector('#reservas')?.scrollIntoView({ behavior: 'smooth' })

  return (
    <section id="precios" className="py-32" ref={ref}>
      <div className="max-w-7xl mx-auto px-6 md:px-10">

        <motion.div
          initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
          className="text-center mb-16"
        >
          <span className="inline-block font-body text-[0.65rem] font-medium tracking-[0.22em] uppercase text-accent mb-5">006 / Tarifas</span>
          <h2 className="heading-shimmer section-title text-[clamp(2.6rem,5.5vw,4.2rem)] leading-[0.92] mb-4">
            Precios y <span className="text-accent">Tarifas</span>
          </h2>
          <p className="text-text/40 text-[1.05rem] max-w-md mx-auto font-body">Sin costes ocultos. Todo el equipamiento incluido.</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">
          {PLANS.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: i * 0.1, ease: [0.4, 0, 0.2, 1] }}
              className={`relative flex flex-col bg-[#111110] rounded-lg overflow-visible transition-all duration-300 ${
                plan.featured
                  ? 'border border-accent shadow-[0_0_0_1px_rgba(255,208,0,0.15),0_0_50px_rgba(255,208,0,0.08)] hover:shadow-[0_0_0_1px_rgba(255,208,0,0.25),0_24px_64px_rgba(0,0,0,0.5),0_0_60px_rgba(255,208,0,0.14)]'
                  : 'border border-white/[0.07] hover:border-white/[0.14] hover:shadow-[0_8px_40px_rgba(0,0,0,0.4)]'
              }`}
            >
              {/* Badge */}
              {plan.badge && (
                <div className={`absolute -top-3.5 left-1/2 -translate-x-1/2 font-display text-[0.58rem] tracking-[0.12em] uppercase px-3 py-1 rounded-full whitespace-nowrap z-10 ${
                  plan.featured ? 'bg-accent text-bg' : 'bg-[#1e1e1c] text-accent/80 border border-accent/20'
                }`}>
                  {plan.badge}
                </div>
              )}

              {/* Top */}
              <div className="p-6 border-b border-white/[0.06]">
                <p className="font-display text-[1rem] tracking-wide text-text mb-1">{plan.name}</p>
                <p className="text-text/30 text-[0.75rem] mb-5 font-body">{plan.sub}</p>
                {!plan.isSpecial && (
                  <>
                    <div className="flex items-baseline gap-1.5 mb-2">
                      <span className={`font-display leading-none ${plan.featured ? 'text-accent' : 'text-text'}`} style={{ fontSize: 'clamp(2.2rem,4vw,2.8rem)' }}>
                        {plan.price}
                      </span>
                      <span className="text-text/30 text-[0.78rem] font-body">{plan.per}</span>
                    </div>
                    {plan.bolas && (
                      <div className="flex items-center gap-1.5 text-[0.75rem] text-accent/70 font-display tracking-wide">
                        <span>✦</span><span>{plan.bolas}</span>
                      </div>
                    )}
                  </>
                )}
                {plan.isSpecial && <p className="text-text/30 text-[0.8rem] font-body mb-2">Precio adaptado a la edad</p>}
              </div>

              {/* Content */}
              {plan.isSpecial ? (
                <div className="flex flex-col gap-2 p-4 flex-1">
                  {INFANTIL_TIERS.map((tier, j) => (
                    <div key={j} className={`rounded-lg px-4 py-3 ${tier.highlight ? 'bg-accent/8 border border-accent/25' : 'bg-black/20 border border-white/[0.04]'}`}>
                      <div className="flex items-baseline justify-between mb-1">
                        <span className={`font-display text-[0.82rem] tracking-wide ${tier.highlight ? 'text-accent' : 'text-text/60'}`}>{tier.name}</span>
                        <span className="text-text/25 text-[0.65rem] font-body">{tier.age}</span>
                      </div>
                      <p className="text-text/35 text-[0.73rem] font-body">{tier.desc}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <ul className="flex flex-col gap-3 p-6 flex-1">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-2.5 text-[0.87rem] text-text/55 font-body">
                      <span className="text-accent font-bold flex-shrink-0 mt-0.5">✓</span>{f}
                    </li>
                  ))}
                  <li className="flex items-start gap-2.5 text-[0.78rem] text-text/25 font-body mt-2 pt-2 border-t border-white/[0.05]">
                    <span className="text-text/20 flex-shrink-0 mt-0.5">·</span>{plan.minNote}
                  </li>
                </ul>
              )}

              {/* CTA */}
              <div className="px-6 pb-6">
                <button
                  onClick={scrollTo}
                  className="w-full bg-accent text-bg font-display text-[0.78rem] tracking-[0.12em] uppercase py-3.5 rounded-lg hover:bg-accent/90 hover:shadow-[0_0_20px_rgba(255,208,0,0.3)] transition-all duration-200"
                >
                  {plan.cta}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Extras */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.45, ease: [0.4, 0, 0.2, 1] }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6"
        >
          {EXTRAS.map((e) => (
            <div key={e.label} className="bg-[#0d0d0c] border border-white/[0.05] rounded-lg px-5 py-4">
              <span className="text-text/30 text-xs font-body block mb-1">{e.label}</span>
              <span className="font-display text-accent text-base">{e.precio}</span>
            </div>
          ))}
        </motion.div>

        {/* Included note */}
        <motion.div
          initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="relative bg-accent/[0.04] border border-accent/15 rounded-lg p-6 text-center overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
          <p className="text-accent font-display tracking-widest text-xs mb-2">TODO INCLUIDO EN EL PRECIO</p>
          <p className="text-text/35 text-xs leading-relaxed font-body">
            Monitor · Marcadora · Linternas tácticas · Recargas de aire · 100 bolas · Máscara Valken MI-3 Thermal · Buzo integral · Chaleco anti-bolas · Protector de cuello · Guantes · Agua mineral · Seguro RC y Accidentes · IVA 21%
          </p>
        </motion.div>

      </div>
    </section>
  )
}
