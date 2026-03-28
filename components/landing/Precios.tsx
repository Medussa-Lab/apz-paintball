'use client'

import { motion } from 'framer-motion'

const plans = [
  {
    nombre: 'Entre Semana',
    subtitulo: 'Lunes a Jueves · No festivos',
    precio: '15',
    unidad: '€/jugador',
    bolas: '100 bolas incluidas',
    minPlayers: 'Mínimo 8 jugadores',
    features: [
      'Equipamiento completo',
      'Instructor/monitor',
      'Seguro incluido',
      'Agua mineral',
      '100 bolas de pintura',
    ],
    highlighted: false,
    cta: 'RESERVAR',
  },
  {
    nombre: 'Fin de Semana',
    subtitulo: 'Viernes, Sábado, Domingo y Festivos',
    precio: '20',
    unidad: '€/jugador',
    bolas: '100 bolas incluidas',
    minPlayers: 'Mínimo 6 jugadores',
    features: [
      'Equipamiento completo',
      'Instructor/monitor',
      'Seguro incluido',
      'Agua mineral',
      '100 bolas de pintura',
    ],
    highlighted: true,
    tag: 'MÁS POPULAR',
    cta: 'RESERVAR',
  },
  {
    nombre: 'Super Pack',
    subtitulo: 'Cualquier día de la semana',
    precio: '35',
    unidad: '€/jugador',
    bolas: '500 bolas incluidas',
    minPlayers: 'Ideal para intensos',
    features: [
      'Equipamiento completo',
      'Instructor/monitor',
      'Seguro incluido',
      'Agua mineral',
      '500 bolas de pintura',
    ],
    highlighted: false,
    cta: 'RESERVAR',
  },
]

const extras = [
  { label: 'Recarga 100 bolas', precio: '5€' },
  { label: 'Caja 2000 bolas', precio: '90€' },
  { label: 'Grupos privados', precio: 'Consultar' },
  { label: 'Paintball infantil', precio: 'Precio especial' },
]

export default function Precios() {
  const handleReserva = () => {
    const el = document.querySelector('#reservas')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="precios" className="relative py-24 stripe-bg bg-dark overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <p className="text-accent font-display text-sm tracking-[0.3em] uppercase mb-3">
            // Precios
          </p>
          <h2 className="section-title text-4xl md:text-5xl text-text">
            SIN COSTES <span className="text-accent">OCULTOS</span>
          </h2>
          <p className="text-text-muted mt-4 text-lg max-w-xl">
            Todo el equipamiento incluido en el precio. Ven con ropa deportiva y calzado con agarre.
          </p>
        </motion.div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.nombre}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`relative rounded-tactical p-8 flex flex-col gap-6 transition-all duration-300 ${
                plan.highlighted
                  ? 'bg-accent-dim border-2 border-accent shadow-accent-hover'
                  : 'bg-dark border border-white/8 hover:border-accent/30 hover:shadow-accent-card'
              }`}
            >
              {/* Tag */}
              {plan.tag && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-display tracking-widest text-bg bg-accent px-3 py-1 rounded-tactical whitespace-nowrap">
                  {plan.tag}
                </span>
              )}

              {/* Plan name */}
              <div>
                <h3 className={`font-display text-xl tracking-wide mb-1 ${plan.highlighted ? 'text-accent' : 'text-text'}`}>
                  {plan.nombre.toUpperCase()}
                </h3>
                <p className="text-text-muted text-xs">{plan.subtitulo}</p>
              </div>

              {/* Price */}
              <div className="flex items-end gap-2">
                <span className="font-display leading-none text-text" style={{ fontSize: 'clamp(3rem, 6vw, 4rem)' }}>
                  {plan.precio}€
                </span>
                <span className="text-text-muted text-sm mb-2">/jugador</span>
              </div>

              {/* Balls highlight */}
              <div className={`flex items-center gap-2 text-sm font-display tracking-wide ${plan.highlighted ? 'text-accent' : 'text-accent/70'}`}>
                <span>🎯</span>
                <span>{plan.bolas}</span>
              </div>

              {/* Min players */}
              <p className="text-text-muted text-xs border-t border-white/8 pt-4">{plan.minPlayers}</p>

              {/* Features */}
              <ul className="flex flex-col gap-2 flex-1">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-2 text-sm text-text-muted">
                    <span className="text-accent text-xs">■</span>
                    {f}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <button
                onClick={handleReserva}
                className={`w-full py-3 text-sm font-display tracking-widest rounded-tactical transition-all duration-200 ${
                  plan.highlighted
                    ? 'bg-accent text-bg hover:bg-transparent hover:text-accent hover:border-2 hover:border-accent border-2 border-accent'
                    : 'btn-tactical'
                }`}
              >
                {plan.cta}
              </button>
            </motion.div>
          ))}
        </div>

        {/* Extras row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {extras.map((extra) => (
            <div
              key={extra.label}
              className="bg-bg border border-white/8 rounded-tactical px-5 py-4 flex flex-col gap-1"
            >
              <span className="text-text-muted text-xs">{extra.label}</span>
              <span className="font-display text-accent text-lg">{extra.precio}</span>
            </div>
          ))}
        </motion.div>

        {/* Included badge */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8 bg-accent/8 border border-accent/20 rounded-tactical p-5 text-center"
        >
          <p className="text-text text-sm">
            <span className="text-accent font-display tracking-wide">TODO INCLUIDO</span>
            {' '}—{' '}
            Marcadora · Traje completo · Casco térmico antivaho · Protecciones · Guantes · Instructor · Seguro · Agua · IVA 21%
          </p>
        </motion.div>
      </div>
    </section>
  )
}
