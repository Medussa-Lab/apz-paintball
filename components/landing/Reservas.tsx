'use client'

import { useState, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import type { ReservaForm } from '@/lib/types'

const STEPS = [
  { num: '01', label: 'Fecha', desc: 'Selecciona cuándo quieres jugar' },
  { num: '02', label: 'Grupo',  desc: 'Cuántos jugadores y qué tipo' },
  { num: '03', label: 'Datos',  desc: 'Tu información de contacto' },
]

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

const inputCls = 'w-full bg-[#0a0a0a] border border-white/[0.08] rounded-lg px-4 py-3 text-sm text-text placeholder-text/20 font-body focus:outline-none focus:border-accent/60 focus:ring-1 focus:ring-accent/20 transition-all duration-200'
const labelCls = 'block text-[0.7rem] font-display tracking-[0.15em] uppercase text-text/35 mb-1.5'

export default function Reservas() {
  const [step, setStep]     = useState(1)
  const [form, setForm]     = useState<ReservaForm>(EMPTY)
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
      {/* Subtle accent glow */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(255,208,0,0.03), transparent 70%)',
      }} />

      <div className="max-w-7xl mx-auto px-6 md:px-10 relative">

        <motion.div
          initial={{ opacity: 0, y: 55 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
          className="text-center mb-16"
        >
          <span className="inline-block font-body text-[0.65rem] font-medium tracking-[0.22em] uppercase text-accent mb-5">
            005 / Reservas
          </span>
          <h2 className="heading-shimmer section-title text-[clamp(2.6rem,5.5vw,4.2rem)] leading-[0.92] mb-4">
            ¿Listo para<br /><span className="text-accent">el combate?</span>
          </h2>
          <p className="text-text/40 text-[1.05rem] max-w-lg mx-auto font-body">
            Solicita tu partida en pocos pasos. Confirmamos en menos de 24 horas. Sin pago previo.
          </p>
        </motion.div>

        <div className="max-w-2xl mx-auto">

          {/* Process steps — visual reference (GZ Simlab style) */}
          <motion.div
            initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_auto_1fr] items-start gap-0 mb-12"
          >
            {STEPS.map((s, i) => {
              const done    = step > i + 1
              const current = step === i + 1
              return (
                <>
                  <div key={s.num} className={`group flex md:flex-col items-start md:items-center gap-4 md:gap-0 p-3 md:text-center transition-all duration-300`}>
                    {/* Number */}
                    <div className={`font-display text-[0.58rem] tracking-[0.2em] md:mb-4 ${current ? 'text-accent' : done ? 'text-accent/50' : 'text-text/20'}`}>
                      {s.num}
                    </div>
                    {/* Circle */}
                    <div className={`hidden md:flex w-12 h-12 rounded-full border items-center justify-center mx-auto mb-4 transition-all duration-300 ${
                      done    ? 'bg-accent border-accent text-bg' :
                      current ? 'border-accent bg-accent/10 text-accent shadow-[0_0_20px_rgba(255,208,0,0.15)]' :
                                'border-white/15 text-text/20'
                    }`}>
                      {done ? (
                        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
                          <polyline points="3,8 7,12 13,4" />
                        </svg>
                      ) : (
                        <span className="font-display text-[0.8rem]">{i + 1}</span>
                      )}
                    </div>
                    <div>
                      <h3 className={`font-display text-[0.9rem] tracking-wide mb-1 ${current ? 'text-accent' : done ? 'text-text/50' : 'text-text/25'}`}>
                        {s.label.toUpperCase()}
                      </h3>
                      <p className={`text-[0.78rem] font-body leading-relaxed ${current ? 'text-text/45' : 'text-text/20'}`}>{s.desc}</p>
                    </div>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div key={`arrow-${i}`} className="hidden md:flex items-center pt-[3.5rem]">
                      <svg viewBox="0 0 44 12" className="w-11 h-3 flex-shrink-0" fill="none">
                        <line x1="0" y1="6" x2="34" y2="6" stroke={step > i + 1 ? '#FFD000' : 'rgba(255,255,255,0.12)'} strokeWidth="1.5" strokeDasharray="4 3" />
                        <polyline points="29,1 36,6 29,11" stroke={step > i + 1 ? '#FFD000' : 'rgba(255,255,255,0.12)'} strokeWidth="1.5" />
                      </svg>
                    </div>
                  )}
                </>
              )
            })}
          </motion.div>

          {/* Form card */}
          <AnimatePresence mode="wait">
            {status === 'success' ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#111110] border border-accent/30 rounded-lg p-10 text-center flex flex-col items-center gap-5"
              >
                <div className="w-16 h-16 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8 text-accent">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h3 className="font-display text-2xl text-accent tracking-wide">MISIÓN RECIBIDA</h3>
                <p className="text-text/50 text-base font-body max-w-sm">
                  Tu solicitud ha sido enviada. Te confirmaremos la reserva en menos de 24 horas.
                  <br />
                  <span className="text-text/70 mt-2 block">¡Prepárate para el combate!</span>
                </p>
                <button
                  onClick={() => { setForm(EMPTY); setStep(1); setStatus('idle') }}
                  className="font-display text-[0.78rem] tracking-[0.12em] uppercase px-8 py-3 rounded-lg border border-white/15 text-text/50 hover:border-accent/50 hover:text-accent transition-all duration-200 mt-2"
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
                className="bg-[#111110] border border-white/[0.07] rounded-lg p-8 flex flex-col gap-6"
              >

                {/* STEP 1 — Fecha + Modalidad */}
                {step === 1 && (
                  <>
                    <div>
                      <h3 className="font-display text-lg text-text tracking-wide mb-1">Fecha y modalidad</h3>
                      <p className="text-text/35 text-[0.83rem] font-body">¿Cuándo quieres jugar y qué modalidad prefieres?</p>
                    </div>
                    <div className="flex flex-col gap-5">
                      <div>
                        <label className={labelCls}>Fecha deseada *</label>
                        <input
                          type="date"
                          value={form.fecha}
                          onChange={e => update({ fecha: e.target.value })}
                          min={today}
                          required
                          className={inputCls}
                          style={{ colorScheme: 'dark' }}
                        />
                      </div>
                      <div>
                        <label className={labelCls}>Modalidad preferida</label>
                        <select
                          value={form.modalidad}
                          onChange={e => update({ modalidad: e.target.value })}
                          className={inputCls}
                          style={{ colorScheme: 'dark' }}
                        >
                          {modalidades.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                      </div>
                    </div>
                    <button
                      onClick={next}
                      disabled={!form.fecha}
                      className="w-full bg-accent text-bg font-display text-[0.78rem] tracking-[0.12em] uppercase py-3.5 rounded-lg hover:bg-accent/90 hover:shadow-[0_0_20px_rgba(255,208,0,0.25)] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed mt-2"
                    >
                      CONTINUAR →
                    </button>
                  </>
                )}

                {/* STEP 2 — Grupo */}
                {step === 2 && (
                  <>
                    <div>
                      <h3 className="font-display text-lg text-text tracking-wide mb-1">Tu grupo</h3>
                      <p className="text-text/35 text-[0.83rem] font-body">¿Cuántos jugadores y de qué tipo?</p>
                    </div>
                    <div className="flex flex-col gap-5">
                      <div>
                        <label className={labelCls}>Nº de jugadores *</label>
                        <input
                          type="number"
                          value={form.jugadores}
                          onChange={e => update({ jugadores: Number(e.target.value) })}
                          min={4}
                          max={30}
                          required
                          className={inputCls}
                        />
                        <p className="text-[0.72rem] text-text/25 font-body mt-1.5">Mín. 6 (fin de semana) · Mín. 8 (entre semana) · Máx. 30</p>
                      </div>
                      <div>
                        <label className={labelCls}>Tipo de grupo *</label>
                        <div className="flex flex-wrap gap-3">
                          {([
                            { value: 'adultos', label: 'Solo adultos (14+)' },
                            { value: 'ninos',   label: 'Solo niños (8-13)' },
                            { value: 'mixto',   label: 'Mixto adultos + niños' },
                          ] as const).map(opt => (
                            <label key={opt.value} className="flex items-center gap-2 cursor-pointer group">
                              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${form.tipoGrupo === opt.value ? 'border-accent' : 'border-white/20'}`}>
                                {form.tipoGrupo === opt.value && <div className="w-2 h-2 rounded-full bg-accent" />}
                              </div>
                              <input type="radio" name="tipoGrupo" value={opt.value} checked={form.tipoGrupo === opt.value}
                                onChange={e => update({ tipoGrupo: e.target.value as ReservaForm['tipoGrupo'] })} className="sr-only" />
                              <span className="text-sm text-text/50 group-hover:text-text/80 transition-colors font-body">{opt.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3 mt-2">
                      <button onClick={back} className="flex-1 py-3.5 rounded-lg border border-white/10 text-text/40 font-display text-[0.75rem] tracking-[0.1em] uppercase hover:border-white/20 hover:text-text/70 transition-all duration-200">← ATRÁS</button>
                      <button onClick={next} className="flex-1 bg-accent text-bg font-display text-[0.78rem] tracking-[0.12em] uppercase py-3.5 rounded-lg hover:bg-accent/90 hover:shadow-[0_0_20px_rgba(255,208,0,0.25)] transition-all duration-200">CONTINUAR →</button>
                    </div>
                  </>
                )}

                {/* STEP 3 — Datos de contacto */}
                {step === 3 && (
                  <>
                    <div>
                      <h3 className="font-display text-lg text-text tracking-wide mb-1">Datos de contacto</h3>
                      <p className="text-text/35 text-[0.83rem] font-body">¿Cómo nos ponemos en contacto contigo?</p>
                    </div>
                    <div className="flex flex-col gap-4">
                      <div>
                        <label className={labelCls}>Nombre del responsable *</label>
                        <input
                          type="text"
                          value={form.nombre}
                          onChange={e => update({ nombre: e.target.value })}
                          required
                          placeholder="Tu nombre completo"
                          className={inputCls}
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className={labelCls}>Teléfono *</label>
                          <input
                            type="tel"
                            value={form.telefono}
                            onChange={e => update({ telefono: e.target.value })}
                            required
                            placeholder="666 000 000"
                            className={inputCls}
                          />
                        </div>
                        <div>
                          <label className={labelCls}>Email *</label>
                          <input
                            type="email"
                            value={form.email}
                            onChange={e => update({ email: e.target.value })}
                            required
                            placeholder="tu@email.com"
                            className={inputCls}
                          />
                        </div>
                      </div>
                      <div>
                        <label className={labelCls}>Mensaje adicional (opcional)</label>
                        <textarea
                          value={form.mensaje}
                          onChange={e => update({ mensaje: e.target.value })}
                          rows={3}
                          placeholder="Cumpleaños, despedida de soltero, team building..."
                          className={`${inputCls} resize-none`}
                        />
                      </div>
                    </div>

                    {status === 'error' && (
                      <p className="text-red-400 text-sm font-body">{errorMsg}</p>
                    )}

                    <div className="flex gap-3 mt-2">
                      <button onClick={back} className="flex-1 py-3.5 rounded-lg border border-white/10 text-text/40 font-display text-[0.75rem] tracking-[0.1em] uppercase hover:border-white/20 hover:text-text/70 transition-all duration-200">← ATRÁS</button>
                      <button
                        onClick={handleSubmit}
                        disabled={!form.nombre || !form.telefono || !form.email || status === 'loading'}
                        className="flex-1 bg-accent text-bg font-display text-[0.78rem] tracking-[0.12em] uppercase py-3.5 rounded-lg hover:bg-accent/90 hover:shadow-[0_0_20px_rgba(255,208,0,0.25)] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        {status === 'loading' ? 'ENVIANDO...' : 'ENVIAR RESERVA'}
                      </button>
                    </div>
                    <p className="text-text/25 text-xs text-center font-body">
                      Al enviar aceptas que nos pongamos en contacto para confirmar la reserva. Sin pago previo.
                    </p>
                  </>
                )}

              </motion.div>
            )}
          </AnimatePresence>

          {/* Call CTA */}
          {status !== 'success' && (
            <motion.div
              initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-8 flex items-center gap-5 pl-5 border-l-2 border-accent/40"
            >
              <div>
                <p className="font-display text-text/50 text-[0.72rem] tracking-widest uppercase mb-1">¿Prefieres llamar?</p>
                <a href="tel:722124321" className="text-accent text-2xl font-display hover:opacity-80 transition-opacity">
                  722 124 321
                </a>
                <p className="text-text/30 text-xs mt-0.5 font-body">Disponible todos los días</p>
              </div>
            </motion.div>
          )}

        </div>
      </div>
    </section>
  )
}
