'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { ReservaForm } from '@/lib/types'

const modalidades = [
  'Sin preferencia',
  'Capturar la Base',
  'El Capitán',
  'Bandera Central',
  'Paintball Nocturno',
  'Paintball Infantil',
]

const today = new Date().toISOString().split('T')[0]

const perks = [
  '✓ Confirmación en menos de 24h',
  '✓ Equipamiento completo incluido',
  '✓ Seguro de accidentes incluido',
  '✓ Instructor/monitor en todo momento',
  '✓ Agua mineral incluida',
  '✓ Sin compromiso de pago al reservar',
]

export default function Reservas() {
  const [form, setForm] = useState<ReservaForm>({
    nombre: '',
    telefono: '',
    email: '',
    fecha: '',
    jugadores: 6,
    modalidad: 'Sin preferencia',
    tipoGrupo: 'adultos',
    mensaje: '',
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: name === 'jugadores' ? Number(value) : value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
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
    <section id="reservas" className="relative py-24 bg-bg overflow-hidden">
      {/* Grain overlay */}
      <div className="absolute inset-0 bg-noise-overlay opacity-30 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <p className="text-accent font-display text-sm tracking-[0.3em] uppercase mb-3">
            // Reservas
          </p>
          <h2 className="section-title text-4xl md:text-5xl text-text">
            SOLICITA TU <span className="text-accent">PARTIDA</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Left column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2 flex flex-col gap-8"
          >
            <div>
              <h3 className="font-display text-xl text-text mb-4 tracking-wide">
                ¿POR QUÉ RESERVAR CON NOSOTROS?
              </h3>
              <ul className="flex flex-col gap-3">
                {perks.map((perk, i) => (
                  <li key={i} className="text-text-muted text-sm leading-relaxed">
                    {perk}
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-l-4 border-accent pl-5">
              <p className="font-display text-text text-sm tracking-wide mb-1">¿PREFIERES LLAMAR?</p>
              <a
                href="tel:722124321"
                className="text-accent text-2xl font-display hover:opacity-80 transition-opacity"
              >
                722 124 321
              </a>
              <p className="text-text-muted text-xs mt-1">Disponible todos los días</p>
            </div>

            <div className="border-l-4 border-accent/30 pl-5">
              <p className="font-display text-text text-sm tracking-wide mb-1">GRUPOS PRIVADOS</p>
              <p className="text-text-muted text-sm">
                Para grupos grandes o team building empresarial, contacta directamente para
                condiciones especiales.
              </p>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-3"
          >
            <AnimatePresence mode="wait">
              {status === 'success' ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-dark border border-accent/30 rounded-tactical p-10 text-center flex flex-col items-center gap-5"
                >
                  <div className="text-5xl">🎯</div>
                  <h3 className="font-display text-2xl text-accent tracking-wide">
                    MISIÓN RECIBIDA
                  </h3>
                  <p className="text-text-muted text-base max-w-sm">
                    Tu solicitud ha sido enviada. Te confirmaremos la reserva en menos de 24 horas.
                    <br />
                    <span className="text-text mt-2 block">¡Prepárate para el combate!</span>
                  </p>
                  <button
                    onClick={() => setStatus('idle')}
                    className="btn-tactical-ghost px-8 py-3 text-sm tracking-widest mt-2"
                  >
                    NUEVA RESERVA
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  className="bg-dark/50 border border-white/8 rounded-tactical p-8 flex flex-col gap-5"
                >
                  {/* Nombre */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-display tracking-widest text-text-muted uppercase">
                      Nombre del responsable *
                    </label>
                    <input
                      name="nombre"
                      value={form.nombre}
                      onChange={handleChange}
                      required
                      placeholder="Tu nombre completo"
                      className="input-tactical px-4 py-3 text-sm w-full"
                    />
                  </div>

                  {/* Tel + Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-display tracking-widest text-text-muted uppercase">
                        Teléfono *
                      </label>
                      <input
                        name="telefono"
                        type="tel"
                        value={form.telefono}
                        onChange={handleChange}
                        required
                        placeholder="666 000 000"
                        className="input-tactical px-4 py-3 text-sm w-full"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-display tracking-widest text-text-muted uppercase">
                        Email *
                      </label>
                      <input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        placeholder="tu@email.com"
                        className="input-tactical px-4 py-3 text-sm w-full"
                      />
                    </div>
                  </div>

                  {/* Fecha + Jugadores */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-display tracking-widest text-text-muted uppercase">
                        Fecha deseada *
                      </label>
                      <input
                        name="fecha"
                        type="date"
                        value={form.fecha}
                        onChange={handleChange}
                        required
                        min={today}
                        className="input-tactical px-4 py-3 text-sm w-full"
                        style={{ colorScheme: 'dark' }}
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-display tracking-widest text-text-muted uppercase">
                        Nº de jugadores *
                      </label>
                      <input
                        name="jugadores"
                        type="number"
                        value={form.jugadores}
                        onChange={handleChange}
                        required
                        min={4}
                        max={30}
                        className="input-tactical px-4 py-3 text-sm w-full"
                      />
                    </div>
                  </div>

                  {/* Modalidad */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-display tracking-widest text-text-muted uppercase">
                      Modalidad preferida
                    </label>
                    <select
                      name="modalidad"
                      value={form.modalidad}
                      onChange={handleChange}
                      className="input-tactical px-4 py-3 text-sm w-full"
                      style={{ colorScheme: 'dark' }}
                    >
                      {modalidades.map((m) => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>

                  {/* Tipo de grupo */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-display tracking-widest text-text-muted uppercase">
                      Tipo de grupo *
                    </label>
                    <div className="flex gap-4 flex-wrap">
                      {([
                        { value: 'adultos', label: 'Solo adultos' },
                        { value: 'ninos', label: 'Solo niños' },
                        { value: 'mixto', label: 'Mixto (adultos + niños)' },
                      ] as const).map((opt) => (
                        <label key={opt.value} className="flex items-center gap-2 cursor-pointer group">
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${form.tipoGrupo === opt.value ? 'border-accent' : 'border-white/30'}`}>
                            {form.tipoGrupo === opt.value && (
                              <div className="w-2 h-2 rounded-full bg-accent" />
                            )}
                          </div>
                          <input
                            type="radio"
                            name="tipoGrupo"
                            value={opt.value}
                            checked={form.tipoGrupo === opt.value}
                            onChange={handleChange}
                            className="sr-only"
                          />
                          <span className="text-sm text-text-muted group-hover:text-text transition-colors">
                            {opt.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Mensaje */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-display tracking-widest text-text-muted uppercase">
                      Mensaje adicional (opcional)
                    </label>
                    <textarea
                      name="mensaje"
                      value={form.mensaje}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Cumpleaños, despedida de soltero, team building... cuéntanos más."
                      className="input-tactical px-4 py-3 text-sm w-full resize-none"
                    />
                  </div>

                  {/* Error */}
                  {status === 'error' && (
                    <p className="text-red-400 text-sm">{errorMsg}</p>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="btn-tactical w-full py-4 text-base tracking-widest disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                  >
                    {status === 'loading' ? 'ENVIANDO...' : 'ENVIAR SOLICITUD DE RESERVA'}
                  </button>

                  <p className="text-text-muted text-xs text-center">
                    Al enviar aceptas que nos pongamos en contacto contigo para confirmar la reserva.
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
