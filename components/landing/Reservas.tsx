'use client'

import { useState, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import type { ReservaForm } from '@/lib/types'

const STEP_LABELS = ['Fecha', 'Grupo', 'Datos']

const modalidades = [
  'Sin preferencia',
  'Capturar la Base',
  'El Capitán',
  'Bandera Central',
  'Paintball Nocturno',
  'Paintball Infantil',
]

const today = new Date().toISOString().split('T')[0]

const EMPTY: ReservaForm = {
  nombre: '',
  telefono: '',
  email: '',
  fecha: '',
  jugadores: 6,
  modalidad: 'Sin preferencia',
  tipoGrupo: 'adultos',
  mensaje: '',
}

export default function Reservas() {
  const [step, setStep]   = useState(1)
  const [form, setForm]   = useState<ReservaForm>(EMPTY)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })

  const update = (patch: Partial<ReservaForm>) => setForm(prev => ({ ...prev, ...patch }))

  const next = () => setStep(s => Math.min(s + 1, 3))
  const back = () => setStep(s => Math.max(s - 1, 1))

  const handleSubmit = async () => {
    setStatus('loading')
    setErrorMsg('')
    try {
      const res = await fetch('/api/reservas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Error al enviar')
      setStatus('success')
    } catch {
      setStatus('error')
      setErrorMsg('No se pudo enviar. Llámanos al 722 124 321.')
    }
  }

  return (
    <section id="reservas" className="py-32 relative overflow-hidden" ref={ref}>
      {/* Accent glow */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(255,208,0,0.04), transparent 70%)',
      }} />

      <div className="max-w-7xl mx-auto px-6 md:px-10 relative">

        <motion.div
          initial={{ opacity: 0, y: 55 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
          className="text-center mb-12"
        >
          <span className="inline-block font-body text-[0.65rem] font-medium tracking-[0.22em] uppercase text-accent mb-4">
            007 / Reservas
          </span>
          <h2 className="heading-shimmer section-title text-[clamp(2.4rem,5vw,3.8rem)] leading-[0.95] mb-4">
            ¿LISTO PARA<br /><span className="text-accent">EL COMBATE?</span>
          </h2>
          <p className="text-text-muted text-[1.05rem] max-w-lg mx-auto">
            Solicita tu partida en pocos pasos. Confirmamos en menos de 24 horas.
          </p>
        </motion.div>

        {/* Stepper */}
        <motion.div
          initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex items-center justify-center gap-0 mb-10 overflow-x-auto pb-2"
        >
          {STEP_LABELS.map((label, i) => {
            const n       = i + 1
            const done    = step > n
            const current = step === n
            return (
              <div key={n} className="flex items-center">
                <div className="flex flex-col items-center gap-1.5">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[0.75rem] font-display border transition-all duration-300 ${
                    done    ? 'bg-accent border-accent text-bg' :
                    current ? 'border-accent text-accent bg-accent/10' :
                              'border-white/20 text-text/30'
                  }`}>
                    {done ? '✓' : n}
                  </div>
                  <span className={`text-[0.62rem] tracking-[0.08em] uppercase font-display whitespace-nowrap transition-colors duration-200 ${
                    current ? 'text-accent' : done ? 'text-text/40' : 'text-text/20'
                  }`}>
                    {label}
                  </span>
                </div>
                {i < STEP_LABELS.length - 1 && (
                  <div className={`w-12 sm:w-20 h-px mx-1 mb-5 transition-all duration-300 ${done ? 'bg-accent' : 'bg-white/10'}`} />
                )}
              </div>
            )
          })}
        </motion.div>

        {/* Step content */}
        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">

            {status === 'success' ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-dark border border-accent/30 rounded-tactical p-10 text-center flex flex-col items-center gap-5"
              >
                <div className="text-5xl">🎯</div>
                <h3 className="font-display text-2xl text-accent tracking-wide">MISIÓN RECIBIDA</h3>
                <p className="text-text-muted text-base max-w-sm">
                  Tu solicitud ha sido enviada. Te confirmaremos la reserva en menos de 24 horas.
                  <br />
                  <span className="text-text mt-2 block">¡Prepárate para el combate!</span>
                </p>
                <button
                  onClick={() => { setForm(EMPTY); setStep(1); setStatus('idle') }}
                  className="btn-tactical-ghost px-8 py-3 text-sm tracking-widest mt-2"
                >
                  NUEVA RESERVA
                </button>
              </motion.div>
            ) : (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                className="bg-dark/50 border border-white/[0.08] rounded-tactical p-8 flex flex-col gap-6"
              >

                {/* STEP 1 — Fecha + Modalidad */}
                {step === 1 && (
                  <>
                    <h3 className="font-display text-lg text-text tracking-wide">Fecha y modalidad</h3>
                    <div className="flex flex-col gap-5">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-display tracking-widest text-text-muted uppercase">Fecha deseada *</label>
                        <input
                          type="date"
                          value={form.fecha}
                          onChange={e => update({ fecha: e.target.value })}
                          min={today}
                          required
                          className="input-tactical px-4 py-3 text-sm w-full"
                          style={{ colorScheme: 'dark' }}
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-display tracking-widest text-text-muted uppercase">Modalidad preferida</label>
                        <select
                          value={form.modalidad}
                          onChange={e => update({ modalidad: e.target.value })}
                          className="input-tactical px-4 py-3 text-sm w-full"
                          style={{ colorScheme: 'dark' }}
                        >
                          {modalidades.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                      </div>
                    </div>
                    <button
                      onClick={next}
                      disabled={!form.fecha}
                      className="btn-tactical w-full py-3.5 text-sm tracking-widest disabled:opacity-40 mt-2"
                    >
                      CONTINUAR →
                    </button>
                  </>
                )}

                {/* STEP 2 — Grupo */}
                {step === 2 && (
                  <>
                    <h3 className="font-display text-lg text-text tracking-wide">Tu grupo</h3>
                    <div className="flex flex-col gap-5">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-display tracking-widest text-text-muted uppercase">Nº de jugadores *</label>
                        <input
                          type="number"
                          value={form.jugadores}
                          onChange={e => update({ jugadores: Number(e.target.value) })}
                          min={4}
                          max={30}
                          required
                          className="input-tactical px-4 py-3 text-sm w-full"
                        />
                        <p className="text-xs text-text-muted/50 font-body">Mín. 6 (fin de semana) · Mín. 8 (entre semana) · Máx. 30</p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-display tracking-widest text-text-muted uppercase">Tipo de grupo *</label>
                        <div className="flex flex-wrap gap-4">
                          {([
                            { value: 'adultos', label: 'Solo adultos (14+)' },
                            { value: 'ninos',   label: 'Solo niños (8-13)' },
                            { value: 'mixto',   label: 'Mixto adultos + niños' },
                          ] as const).map(opt => (
                            <label key={opt.value} className="flex items-center gap-2 cursor-pointer group">
                              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${form.tipoGrupo === opt.value ? 'border-accent' : 'border-white/30'}`}>
                                {form.tipoGrupo === opt.value && <div className="w-2 h-2 rounded-full bg-accent" />}
                              </div>
                              <input type="radio" name="tipoGrupo" value={opt.value} checked={form.tipoGrupo === opt.value}
                                onChange={e => update({ tipoGrupo: e.target.value as ReservaForm['tipoGrupo'] })} className="sr-only" />
                              <span className="text-sm text-text-muted group-hover:text-text transition-colors font-body">{opt.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3 mt-2">
                      <button onClick={back} className="btn-tactical-ghost flex-1 py-3.5 text-sm tracking-widest">← ATRÁS</button>
                      <button onClick={next} className="btn-tactical flex-1 py-3.5 text-sm tracking-widest">CONTINUAR →</button>
                    </div>
                  </>
                )}

                {/* STEP 3 — Datos de contacto */}
                {step === 3 && (
                  <>
                    <h3 className="font-display text-lg text-text tracking-wide">Datos de contacto</h3>
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-display tracking-widest text-text-muted uppercase">Nombre del responsable *</label>
                        <input
                          type="text"
                          value={form.nombre}
                          onChange={e => update({ nombre: e.target.value })}
                          required
                          placeholder="Tu nombre completo"
                          className="input-tactical px-4 py-3 text-sm w-full"
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-display tracking-widest text-text-muted uppercase">Teléfono *</label>
                          <input
                            type="tel"
                            value={form.telefono}
                            onChange={e => update({ telefono: e.target.value })}
                            required
                            placeholder="666 000 000"
                            className="input-tactical px-4 py-3 text-sm w-full"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-display tracking-widest text-text-muted uppercase">Email *</label>
                          <input
                            type="email"
                            value={form.email}
                            onChange={e => update({ email: e.target.value })}
                            required
                            placeholder="tu@email.com"
                            className="input-tactical px-4 py-3 text-sm w-full"
                          />
                        </div>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-display tracking-widest text-text-muted uppercase">Mensaje adicional (opcional)</label>
                        <textarea
                          value={form.mensaje}
                          onChange={e => update({ mensaje: e.target.value })}
                          rows={3}
                          placeholder="Cumpleaños, despedida de soltero, team building..."
                          className="input-tactical px-4 py-3 text-sm w-full resize-none"
                        />
                      </div>
                    </div>

                    {status === 'error' && (
                      <p className="text-red-400 text-sm font-body">{errorMsg}</p>
                    )}

                    <div className="flex gap-3 mt-2">
                      <button onClick={back} className="btn-tactical-ghost flex-1 py-3.5 text-sm tracking-widest">← ATRÁS</button>
                      <button
                        onClick={handleSubmit}
                        disabled={!form.nombre || !form.telefono || !form.email || status === 'loading'}
                        className="btn-tactical flex-1 py-3.5 text-sm tracking-widest disabled:opacity-40"
                      >
                        {status === 'loading' ? 'ENVIANDO...' : 'ENVIAR RESERVA'}
                      </button>
                    </div>
                    <p className="text-text-muted text-xs text-center font-body">
                      Al enviar aceptas que nos pongamos en contacto para confirmar la reserva. Sin pago previo.
                    </p>
                  </>
                )}

              </motion.div>
            )}

          </AnimatePresence>

          {/* Call to action alt */}
          {status !== 'success' && (
            <motion.div
              initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-8 border-l-4 border-accent pl-5"
            >
              <p className="font-display text-text text-sm tracking-wide mb-1">¿PREFIERES LLAMAR?</p>
              <a href="tel:722124321" className="text-accent text-2xl font-display hover:opacity-80 transition-opacity">
                722 124 321
              </a>
              <p className="text-text-muted text-xs mt-1 font-body">Disponible todos los días</p>
            </motion.div>
          )}
        </div>

      </div>
    </section>
  )
}
