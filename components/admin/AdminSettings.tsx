'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Cockpit, SessionType } from '@/lib/types'

// Fallback data using integer IDs matching the real DB
const FALLBACK_COCKPITS: Cockpit[] = [
  { id: 1, name: 'Campo Bosque',     description: '20.000m² de bosque natural',       is_active: true },
  { id: 2, name: 'Campo Contenedor', description: 'Estructuras y cobertura urbana',   is_active: true },
]

const FALLBACK_SESSIONS: SessionType[] = [
  { id: 1, name: 'Entre Semana',       duration_minutes: 120, price: 15,  max_people: 30, color: '#FFD000', is_active: true },
  { id: 2, name: 'Fin de Semana',      duration_minutes: 120, price: 20,  max_people: 30, color: '#FF9900', is_active: true },
  { id: 3, name: 'Super Pack',         duration_minutes: 180, price: 35,  max_people: 30, color: '#FF3333', is_active: true },
  { id: 4, name: 'Paintball Nocturno', duration_minutes: 120, price: 25,  max_people: 30, color: '#8B5CF6', is_active: true },
  { id: 5, name: 'Paintball Infantil', duration_minutes: 90,  price: 12,  max_people: 30, color: '#00FF88', is_active: true },
  { id: 7, name: 'Membresía Pro',    duration_minutes: 60,  price: 0,   max_people: 1,  color: '#00CC66', is_active: true },
]

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      aria-label={on ? 'Desactivar' : 'Activar'}
      className={`relative w-10 h-5 rounded-full transition-all duration-200 flex-shrink-0 ${on ? 'bg-accent' : 'bg-white/10'}`}
    >
      <span
        className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all duration-200"
        style={{ left: on ? '22px' : '2px' }}
      />
    </button>
  )
}

export default function AdminSettings() {
  const [cockpits,  setCockpits]  = useState<Cockpit[]>([])
  const [sessions,  setSessions]  = useState<SessionType[]>([])
  const [loading,   setLoading]   = useState(true)
  const [saving,    setSaving]    = useState(false)
  const [saveState, setSaveState] = useState<'idle' | 'ok' | 'error'>('idle')

  const supabase = createClient()
  const isConfigured = !!process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://xxx.supabase.co'

  // Load from Supabase on mount
  useEffect(() => {
    const load = async () => {
      setLoading(true)
      if (!isConfigured) {
        setCockpits(FALLBACK_COCKPITS)
        setSessions(FALLBACK_SESSIONS)
        setLoading(false)
        return
      }
      const [cpRes, stRes] = await Promise.all([
        supabase.from('cockpits').select('*').order('id'),
        supabase.from('session_types').select('*').order('id'),
      ])
      setCockpits((cpRes.data as Cockpit[]) || FALLBACK_COCKPITS)
      setSessions((stRes.data as SessionType[]) || FALLBACK_SESSIONS)
      setLoading(false)
    }
    load()
  }, [])

  const toggleCockpit = (id: number) =>
    setCockpits(cs => cs.map(c => c.id === id ? { ...c, is_active: !c.is_active } : c))

  const updateSession = (id: number, field: keyof SessionType, value: string | number | boolean) =>
    setSessions(ss => ss.map(s => s.id === id ? { ...s, [field]: value } : s))

  const saveAll = async () => {
    setSaving(true)
    if (!isConfigured) {
      await new Promise(r => setTimeout(r, 600))
      setSaveState('ok')
      setSaving(false)
      setTimeout(() => setSaveState('idle'), 2500)
      return
    }
    try {
      // Upsert cockpits (only is_active field, preserve everything else)
      const cockpitUpdates = cockpits.map(c => ({ id: c.id, is_active: c.is_active }))
      // Upsert session types (price + is_active are the editable fields)
      const sessionUpdates = sessions.map(s => ({ id: s.id, price: s.price, is_active: s.is_active }))

      const [cpRes, stRes] = await Promise.all([
        Promise.all(cockpitUpdates.map(u => (supabase as any).from('cockpits').update({ is_active: u.is_active }).eq('id', u.id))),
        Promise.all(sessionUpdates.map(u => (supabase as any).from('session_types').update({ price: u.price, is_active: u.is_active }).eq('id', u.id))),
      ])

      const anyError = [...cpRes, ...stRes].some(r => (r as any).error)
      setSaveState(anyError ? 'error' : 'ok')
    } catch {
      setSaveState('error')
    } finally {
      setSaving(false)
      setTimeout(() => setSaveState('idle'), 2500)
    }
  }

  const btnLabel = saving ? 'Guardando…' : saveState === 'ok' ? 'Guardado' : saveState === 'error' ? 'Error al guardar' : 'Guardar cambios'
  const btnClass = saving
    ? 'bg-white/5 border border-white/10 text-white/40 cursor-wait'
    : saveState === 'ok'
    ? 'bg-success/10 border border-success/30 text-success'
    : saveState === 'error'
    ? 'bg-danger/10 border border-danger/30 text-danger'
    : 'bg-accent text-black hover:bg-accent/80 hover:shadow-accent-glow'

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="font-head font-bold text-2xl text-white">Ajustes</h1>
        <button
          onClick={saveAll}
          disabled={saving}
          className={`font-head font-semibold text-sm tracking-wider uppercase px-5 py-2.5 rounded transition-all duration-200 ${btnClass}`}
        >
          {btnLabel}
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col gap-4">
          <div className="h-48 skeleton bg-white/5 rounded-lg" />
          <div className="h-64 skeleton bg-white/5 rounded-lg" />
        </div>
      ) : (
        <>
          {/* Campos */}
          <div className="bg-[#111] border border-white/[0.07] rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-head font-semibold text-white/70 text-sm uppercase tracking-wider">Campos</h2>
              <span className="text-[0.68rem] text-white/25">
                {cockpits.filter(c => c.is_active).length}/{cockpits.length} activos
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {cockpits.map(c => (
                <div
                  key={c.id}
                  className={`flex items-center gap-3 p-3.5 rounded-lg border transition-all duration-200 ${
                    c.is_active ? 'border-white/10 bg-[#0f0f0f]' : 'border-white/5 bg-[#080808] opacity-50'
                  }`}
                >
                  <Toggle on={c.is_active} onToggle={() => toggleCockpit(c.id)} />
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-head font-semibold">{c.name}</p>
                    <p className="text-white/30 text-xs truncate">{c.description}</p>
                  </div>
                  <span className={`text-[0.62rem] font-head uppercase tracking-wider flex-shrink-0 ${c.is_active ? 'text-success' : 'text-white/20'}`}>
                    {c.is_active ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Session types */}
          <div className="bg-[#111] border border-white/[0.07] rounded-lg p-6">
            <h2 className="font-head font-semibold text-white/70 text-sm uppercase tracking-wider mb-5">Tipos de sesión</h2>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px]">
                <thead>
                  <tr className="border-b border-white/[0.07]">
                    {['Nombre', 'Duración', 'Precio (€)', 'Máx. personas', 'Activo'].map(h => (
                      <th key={h} className="text-left text-[0.62rem] font-head font-semibold uppercase tracking-wider text-white/25 px-3 py-2.5">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sessions.map(s => (
                    <tr key={s.id} className="border-b border-white/[0.04] hover:bg-white/[0.015] transition-colors">
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: s.color }} />
                          <span className="text-white/80 text-sm">{s.name}</span>
                        </div>
                      </td>
                      <td className="px-3 py-2.5 text-white/50 text-sm">{s.duration_minutes}min</td>
                      <td className="px-3 py-2.5">
                        <input
                          type="number"
                          value={s.price}
                          min={0}
                          onChange={e => updateSession(s.id, 'price', parseInt(e.target.value) || 0)}
                          className="bg-[#0a0a0a] border border-white/10 rounded px-2.5 py-1 text-white text-sm w-20 focus:border-accent focus:outline-none transition-all"
                        />
                      </td>
                      <td className="px-3 py-2.5 text-white/50 text-sm">{s.max_people === 50 ? 'Hasta 50' : s.max_people}</td>
                      <td className="px-3 py-2.5">
                        <Toggle on={!!s.is_active} onToggle={() => updateSession(s.id, 'is_active', !s.is_active)} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
