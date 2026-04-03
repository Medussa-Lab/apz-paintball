'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { BlockedSlot } from '@/lib/types'

export default function AdminBlockSlots() {
  const [slots,   setSlots]   = useState<BlockedSlot[]>([])
  const [loading, setLoading] = useState(true)
  const [form,    setForm]    = useState({ cockpitId: 0, date: '', start: '10:00', end: '22:00', reason: '' })
  const [saving,  setSaving]  = useState(false)
  const [msg,     setMsg]     = useState('')
  const supabase = createClient()

  const load = async () => {
    setLoading(true)
    const isConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://xxx.supabase.co'
    if (!isConfigured) { setLoading(false); return }
    const { data } = await supabase.from('blocked_slots').select('*').order('date', { ascending: false }).order('start_time')
    setSlots((data as BlockedSlot[]) || [])
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.date || !form.start || !form.end) return
    setSaving(true); setMsg('')
    const isConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://xxx.supabase.co'
    if (!isConfigured) {
      setSlots(s => [...s, { id: Date.now().toString(), cockpit_id: form.cockpitId || null, date: form.date, start_time: form.start, end_time: form.end, reason: form.reason }] as BlockedSlot[])
      setMsg('Bloqueo añadido (demo — no persistido)')
    } else {
      const { error } = await (supabase as any).from('blocked_slots').insert({ cockpit_id: form.cockpitId || null, date: form.date, start_time: form.start, end_time: form.end, reason: form.reason })
      if (error) { setMsg('Error: ' + error.message); setSaving(false); return }
      setMsg('Bloqueo guardado')
      await load()
    }
    setSaving(false)
  }

  const remove = async (id: string) => {
    const isConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://xxx.supabase.co'
    if (!isConfigured) { setSlots(s => s.filter(x => x.id !== id)); return }
    await supabase.from('blocked_slots').delete().eq('id', id)
    load()
  }

  const inputCls = "bg-[#0a0a0a] border border-white/10 rounded px-4 py-2.5 text-white text-sm focus:border-blue focus:outline-none focus:ring-2 focus:ring-blue/20 transition-all w-full placeholder:text-white/20"

  return (
    <div>
      <h1 className="font-head font-bold text-2xl text-white mb-6">Bloquear franjas</h1>

      <div className="grid lg:grid-cols-[1fr_1.5fr] gap-6">
        {/* Form */}
        <div className="bg-[#111] border border-white/[0.07] rounded-lg p-6">
          <h2 className="font-head font-semibold text-white/70 text-sm uppercase tracking-wider mb-5">Nuevo bloqueo</h2>
          <form onSubmit={save} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[0.7rem] font-head font-semibold uppercase tracking-wider text-white/35">Cockpit</label>
              <select value={form.cockpitId} onChange={e => setForm(f => ({ ...f, cockpitId: parseInt(e.target.value) || 0 }))} className={inputCls}>
                <option value={0}>Todos los cockpits</option>
                {Array.from({ length: 8 }, (_, i) => <option key={i} value={i+1}>Cockpit {i+1}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[0.7rem] font-head font-semibold uppercase tracking-wider text-white/35">Fecha <span className="text-blue">*</span></label>
              <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} required className={inputCls} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-[0.7rem] font-head font-semibold uppercase tracking-wider text-white/35">Desde</label>
                <input type="time" value={form.start} onChange={e => setForm(f => ({ ...f, start: e.target.value }))} className={inputCls} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[0.7rem] font-head font-semibold uppercase tracking-wider text-white/35">Hasta</label>
                <input type="time" value={form.end} onChange={e => setForm(f => ({ ...f, end: e.target.value }))} className={inputCls} />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[0.7rem] font-head font-semibold uppercase tracking-wider text-white/35">Motivo</label>
              <input type="text" placeholder="Mantenimiento, evento privado…" value={form.reason} onChange={e => setForm(f => ({ ...f, reason: e.target.value }))} className={inputCls} />
            </div>
            {msg && <p className={`text-xs ${msg.startsWith('Error') ? 'text-danger' : 'text-success'}`}>{msg}</p>}
            <button type="submit" disabled={saving} className="py-3 bg-danger/80 text-white font-head font-semibold text-sm tracking-wider uppercase rounded hover:bg-danger transition-all disabled:opacity-50">
              {saving ? 'Guardando…' : 'Bloquear franja'}
            </button>
          </form>
        </div>

        {/* List */}
        <div className="bg-[#111] border border-white/[0.07] rounded-lg p-6">
          <h2 className="font-head font-semibold text-white/70 text-sm uppercase tracking-wider mb-5">Bloqueos activos</h2>
          {loading ? (
            <div className="h-24 skeleton bg-white/5 rounded" />
          ) : slots.length === 0 ? (
            <p className="text-white/25 text-sm">No hay bloqueos activos.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {slots.map(s => (
                <div key={s.id} className="flex items-center gap-3 p-3 bg-[#0a0a0a] rounded border border-danger/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-danger flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-white/70 text-sm">{s.cockpit_id ? `Cockpit ${s.cockpit_id}` : 'Todos los cockpits'} · {s.date}</p>
                    <p className="text-white/35 text-xs">{s.start_time}–{s.end_time} {s.reason && `· ${s.reason}`}</p>
                  </div>
                  <button onClick={() => remove(s.id)} className="text-xs text-danger/50 hover:text-danger transition-colors font-head uppercase tracking-wider">Eliminar</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
