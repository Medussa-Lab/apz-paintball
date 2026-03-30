'use client'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const PLANS = [
  {
    name: 'Entre Semana',
    sub: 'Lunes a Jueves · No festivos',
    price: '15€',
    per: '/ jugador',
    bolas: '100 bolas incluidas',
    minNote: 'Mínimo 8 jugadores',
    features: [
      'Marcadora Tippmann 98 o BT-4',
      'Máscara Valken MI-3 Thermal',
      'Buzo integral + chaleco anti-bolas',
      'Instructor/monitor incluido',
      'Seguro RC y Accidentes',
      'Agua mineral',
    ],
    featured: false,
    cta: 'Reservar',
  },
  {
    name: 'Fin de Semana',
    sub: 'Viernes, Sábado, Domingo y Festivos',
    price: '20€',
    per: '/ jugador',
    bolas: '100 bolas incluidas',
    minNote: 'Mínimo 6 jugadores',
    features: [
      'Marcadora Tippmann 98 o BT-4',
      'Máscara Valken MI-3 Thermal',
      'Buzo integral + chaleco anti-bolas',
      'Instructor/monitor incluido',
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
    bolas: '500 bolas incluidas',
    minNote: 'Ideal para los más intensos',
    features: [
      'Marcadora Tippmann 98 o BT-4',
      'Máscara Valken MI-3 Thermal',
      'Buzo integral + chaleco anti-bolas',
      'Instructor/monitor incluido',
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
    bolas: '',
    minNote: '',
    features: [],
    featured: false,
    badge: 'Niños',
    isSpecial: true,
    cta: 'Consultar precio',
  },
]

const EXTRAS = [
  { label: 'Recarga 100 bolas', precio: '5€' },
  { label: 'Caja 2000 bolas', precio: '90€' },
  { label: 'Grupos privados / Team building', precio: 'Consultar' },
  { label: 'Paintball nocturno', precio: 'Precio especial' },
]

const INFANTIL_TIERS = [
  { name: 'Splatmaster', desc: 'Marcadora manual sin CO₂', age: 'Desde 8 años', note: 'Bolas más blandas y pequeñas', highlight: false },
  { name: 'Adultos + Niños', desc: 'Mixto desde 14 años', age: 'Mixto 14+', note: 'Con autorización parental', highlight: true },
]

export default function Precios() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })
  const scrollTo = () => document.querySelector('#reservas')?.scrollIntoView({ behavior: 'smooth' })

  return (
    <section id="precios" className="py-32" ref={ref}>
      <div className="max-w-7xl mx-auto px-6 md:px-10">

        <motion.div
          initial={{ opacity: 0, y: 55 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.4,0,0.2,1] }}
          className="text-center mb-14"
        >
          <span className="inline-block font-body text-[0.65rem] font-medium tracking-[0.22em] uppercase text-accent mb-4">004 / Tarifas</span>
          <h2 className="heading-shimmer section-title text-[clamp(2.4rem,5.5vw,4rem)] leading-[0.95] mb-4">
            Precios y <span className="text-accent">Tarifas</span>
          </h2>
          <p className="text-text-muted text-[1.05rem] max-w-md mx-auto">Sin costes ocultos. Todo el equipamiento incluido en el precio.</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 items-stretch mb-8">
          {PLANS.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: i * 0.1, ease: [0.4,0,0.2,1] }}
              className={`relative flex flex-col bg-[#111110] rounded-tactical overflow-visible ${
                plan.featured
                  ? 'border border-accent shadow-[0_0_0_1px_rgba(255,208,0,0.4),0_0_50px_rgba(255,208,0,0.1)]'
                  : 'border border-white/[0.07]'
              }`}
            >
              {plan.badge && (
                <div className={`absolute -top-3.5 left-1/2 -translate-x-1/2 font-display text-[0.6rem] tracking-[0.1em] uppercase px-3 py-1 rounded-full whitespace-nowrap z-10 ${
                  plan.featured ? 'bg-accent text-bg' : 'bg-[#222] text-accent border border-accent/30'
                }`}>
                  {plan.badge}
                </div>
              )}

              {/* Top */}
              <div className="p-6 border-b border-white/[0.07]">
                <p className="font-display text-[1.1rem] tracking-wide text-text mb-1">{plan.name}</p>
                <p className="text-[0.78rem] text-text-muted/60 mb-5">{plan.sub}</p>
                {!plan.isSpecial && (
                  <div className="flex items-baseline gap-1.5 mb-2">
                    <span className="font-display text-[2.6rem] text-text leading-none">{plan.price}</span>
                    <span className="text-[0.82rem] text-text-muted/50">{plan.per}</span>
                  </div>
                )}
                {plan.isSpecial && (
                  <p className="text-[0.82rem] text-text-muted/60 mb-2">Precio especial adaptado a la edad</p>
                )}
                {plan.bolas && (
                  <div className="flex items-center gap-1.5 text-[0.8rem] text-accent/80 font-display tracking-wide">
                    <span>🎯</span><span>{plan.bolas}</span>
                  </div>
                )}
              </div>

              {/* Content */}
              {plan.isSpecial ? (
                <div className="flex flex-col gap-2 p-4 flex-1">
                  {INFANTIL_TIERS.map((tier, j) => (
                    <div key={j} className={`rounded-tactical px-4 py-3 ${
                      tier.highlight
                        ? 'bg-accent/10 border border-accent/30'
                        : 'bg-[#0a0a0a] border border-white/[0.05]'
                    }`}>
                      <div className="flex items-baseline justify-between mb-1.5">
                        <span className={`font-display text-[0.85rem] tracking-wider ${tier.highlight ? 'text-accent' : 'text-text/70'}`}>{tier.name}</span>
                        <span className="text-[0.7rem] text-text-muted/50">{tier.age}</span>
                      </div>
                      <p className="text-[0.75rem] text-text-muted/50">{tier.desc}</p>
                      <p className="text-[0.7rem] text-text-muted/40 mt-1">{tier.note}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <ul className="flex flex-col gap-3 p-6 flex-1">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-2.5 text-[0.85rem] text-text-muted/60">
                      <span className="text-accent font-bold flex-shrink-0 mt-0.5">✓</span>
                      {f}
                    </li>
                  ))}
                  <li className="flex items-start gap-2.5 text-[0.85rem] text-text-muted/60">
                    <span className="text-accent font-bold flex-shrink-0 mt-0.5">✓</span>
                    Protector cuello + linternas tácticas
                  </li>
                  <li className="flex items-start gap-2.5 text-[0.82rem] text-text-muted/40 mt-1 border-t border-white/[0.05] pt-3">
                    <span className="text-text-muted/30 font-bold flex-shrink-0 mt-0.5">·</span>
                    {plan.minNote}
                  </li>
                </ul>
              )}

              <div className="px-6 pb-6">
                <button
                  onClick={scrollTo}
                  className={`w-full font-display text-[0.82rem] tracking-[0.1em] uppercase py-3 rounded-tactical transition-all duration-200 ${
                    plan.featured
                      ? 'bg-accent text-bg hover:bg-transparent hover:text-accent border-2 border-accent'
                      : 'btn-tactical-ghost'
                  }`}
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
          transition={{ duration: 0.7, delay: 0.4, ease: [0.4,0,0.2,1] }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {EXTRAS.map((extra) => (
            <div key={extra.label} className="bg-bg border border-white/[0.07] rounded-tactical px-5 py-4 flex flex-col gap-1">
              <span className="text-text-muted/60 text-xs font-body">{extra.label}</span>
              <span className="font-display text-accent text-base">{extra.precio}</span>
            </div>
          ))}
        </motion.div>

        {/* Included badge */}
        <motion.div
          initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="bg-accent/[0.06] border border-accent/20 rounded-tactical p-5 text-center"
        >
          <p className="text-accent font-display tracking-wide text-sm mb-2">TODO INCLUIDO EN EL PRECIO</p>
          <p className="text-text-muted/60 text-xs leading-relaxed font-body">
            Monitor · Marcadora · Linternas tácticas (nocturno) · Recargas de aire · 100 bolas · Máscara Valken MI-3 Thermal · Buzo integral · Chaleco anti-bolas · Protector de cuello · Guantes · Agua mineral · Seguro RC y Accidentes · IVA 21%
          </p>
        </motion.div>

      </div>
    </section>
  )
}
