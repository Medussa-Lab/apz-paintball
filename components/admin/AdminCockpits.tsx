'use client'
import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Booking, BlockedSlot } from '@/lib/types'
import { format, startOfWeek, addDays, eachDayOfInterval, isSameDay } from 'date-fns'
import { es } from 'date-fns/locale'

const COCKPIT_COLORS = ['#FFD000', '#8B5CF6']
const COCKPIT_NAMES  = ['Campo Bosque', 'Campo Contenedor']
const COCKPIT_DESCS  = ['20.000m² de bosque natural', 'Estructuras y cobertura urbana']
const today = format(new Date(), 'yyyy-MM-dd')

function hhmm(t: string) { return t ? t.slice(0, 5) : '' }

interface CockpitDetail {
  id: number
  name: string
  description: string
  is_active: boolean
}

export default function AdminCockpits() {
  const [bookings,     setBookings]     = useState<Booking[]>([])
  const [blocked,      setBlocked]      = useState<BlockedSlot[]>([])
  const [cockpits,     setCockpits]     = useState<CockpitDetail[]>(
    Array.from({ length: 2 }, (_, i) => ({
      id: i + 1, name: COCKPIT_NAMES[i], description: COCKPIT_DESCS[i], is_active: true,
    }))
  )
  const [loading,      setLoading]      = useState(true)
  const [selected,     setSelected]     = useState<number | null>(null)
  const [weekStart,    setWeekStart]    = useState(() => startOfWeek(new Date(), { weekStartsOn: 1 }))
  const [saving,       setSaving]       = useState<number | null>(null)
  const supabase = createClient()
  const isConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://xxx.supabase.co'

  const load = useCallback(async () => {
    setLoading(true)
    if (!isConfigured) {
      setBookings(DEMO_BOOKINGS)
      setBlocked(DEMO_BLOCKED)
      setLoading(false)
      return
    }
    try {
      const weekEnd = format(addDays(weekStart, 6), 'yyyy-MM-dd')
      const weekS   = format(weekStart, 'yyyy-MM-dd')
      const [bRes, stRes, bsRes, cRes] = await Promise.all([
        (supabase as any).from('bookings').select('*').gte('date', weekS).lte('date', weekEnd).order('date').order('start_time'),
        (supabase as any).from('session_types').select('id,name,price'),
        (supabase as any).from('blocked_slots').select('*').gte('date', weekS).lte('date', weekEnd),
        (supabase as any).from('cockpits').select('*').order('id'),
      ])
      const stMap: Record<number, { name: string; price: number }> = {}
      if (stRes.data) for (const st of stRes.data) stMap[st.id] = { name: st.name, price: st.price }
      setBookings(((bRes.data || []) as any[]).map(b => ({ ...b, session_type: stMap[b.session_type_id] ?? null })))
      setBlocked(bsRes.data || [])
      if (cRes.data?.length) setCockpits(cRes.data)
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }, [weekStart])

  useEffect(() => { load() }, [load])

  const toggleActive = async (id: number, value: boolean) => {
    setSaving(id)
    setCockpits(prev => prev.map(c => c.id === id ? { ...c, is_active: value } : c))
    if (isConfigured) await (supabase as any).from('cockpits').update({ is_active: value }).eq('id', id)
    setSaving(null)
  }

  const nowHHMM = format(new Date(), 'HH:mm')
  const weekDays = eachDayOfInterval({ start: weekStart, end: addDays(weekStart, 6) })

  const cockpitStatus = (id: number) => {
    const c = cockpits.find(x => x.id === id)
    if (!c?.is_active) return 'inactive'
    const active = bookings.find(b =>
      b.date === today &&
      Array.isArray(b.cockpit_ids) && b.cockpit_ids.includes(id) &&
      b.status === 'confirmed' &&
      hhmm(b.start_time) <= nowHHMM && hhmm(b.end_time) > nowHHMM
    )
    if (active) return 'active'
    const next = bookings.find(b =>
      b.date === today &&
      Array.isArray(b.cockpit_ids) && b.cockpit_ids.includes(id) &&
      b.status === 'confirmed' &&
      hhmm(b.start_time) > nowHHMM
    )
    if (next) return 'next:' + hhmm(next.start_time)
    return 'free'
  }

  const cockpitToday = (id: number) =>
    bookings.filter(b => b.date === today && Array.isArray(b.cockpit_ids) && b.cockpit_ids.includes(id) && b.status === 'confirmed')

  const cockpitRevToday = (id: number) =>
    cockpitToday(id).reduce((s, b) => s + (b.session_type?.price ?? 0), 0)

  const cockpitWeek = (id: number) =>
    bookings.filter(b => Array.isArray(b.cockpit_ids) && b.cockpit_ids.includes(id) && b.status === 'confirmed')

  const selectedCockpit = selected !== null ? cockpits.find(c => c.id === selected) : null
  const selectedBookings = selected !== null
    ? bookings.filter(b => Array.isArray(b.cockpit_ids) && b.cockpit_ids.includes(selected))
    : []

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-head font-bold text-2xl text-white">Campos</h1>
          <p className="text-white/30 text-sm mt-0.5 capitalize">
            {format(new Date(), "EEEE, d 'de' MMMM", { locale: es })}
          </p>
        </div>
        <button onClick={load}
          className="w-8 h-8 flex items-center justify-center rounded border border-white/10 text-white/30 hover:border-accent hover:text-accent transition-all">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-3.5 h-3.5">
            <path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
          </svg>
        </button>
      </div>

      {/* Cockpit cards grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {Array.from({ length: 8 }, (_, i) => i + 1).map(id => {
          const ci     = id - 1
          const color  = COCKPIT_COLORS[ci]
          const c      = cockpits.find(x => x.id === id)
          const status = cockpitStatus(id)
          const today_ = cockpitToday(id)
          const rev    = cockpitRevToday(id)
          const isActive = c?.is_active !== false
          const isSelected = selected === id

          let statusBadge = null
          if (!isActive) {
            statusBadge = <span className="text-[0.6rem] font-head uppercase tracking-wider px-2 py-0.5 rounded border border-white/10 text-white/25">Inactivo</span>
          } else if (status === 'active') {
            statusBadge = <span className="flex items-center gap-1 text-[0.6rem] font-head uppercase tracking-wider px-2 py-0.5 rounded border border-success/40 bg-success/10 text-success"><span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />En sesión</span>
          } else if (status.startsWith('next:')) {
            statusBadge = <span className="text-[0.6rem] font-head uppercase tracking-wider px-2 py-0.5 rounded border border-accent/30 bg-accent/5 text-accent">Próx. {status.slice(5)}</span>
          } else {
            statusBadge = <span className="text-[0.6rem] font-head uppercase tracking-wider px-2 py-0.5 rounded border border-white/10 text-white/25">Libre hoy</span>
          }

          return (
            <div
              key={id}
              className={`bg-[#111] border rounded-lg overflow-hidden cursor-pointer transition-all ${isSelected ? 'border-opacity-50' : 'border-white/[0.07] hover:border-white/20'} ${!isActive ? 'opacity-50' : ''}`}
              style={isSelected ? { borderColor: color + '80' } : {}}
              onClick={() => setSelected(selected === id ? null : id)}
            >
              <div className="h-0.5" style={{ background: color }} />
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-head font-bold text-white text-sm">{c?.name || COCKPIT_NAMES[ci]}</p>
                    <p className="text-white/25 text-[0.65rem]">{c?.description || COCKPIT_DESCS[ci]}</p>
                  </div>
                  <span className="text-[0.65rem] font-head font-bold px-1.5 py-0.5 rounded"
                    style={{ background: color + '20', color }}>C{id}</span>
                </div>

                <div className="mb-3">{statusBadge}</div>

                <div className="flex items-center justify-between text-xs mb-3">
                  <div className="text-center">
                    <p className="text-white/20 text-[0.6rem] font-head uppercase tracking-wider">Sesiones</p>
                    <p className="font-head font-bold text-white">{loading ? '—' : today_.length}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-white/20 text-[0.6rem] font-head uppercase tracking-wider">Hoy</p>
                    <p className="font-head font-bold" style={{ color }}>{loading ? '—' : `€${rev}`}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-white/20 text-[0.6rem] font-head uppercase tracking-wider">Semana</p>
                    <p className="font-head font-bold text-white/60">{loading ? '—' : cockpitWeek(id).length}</p>
                  </div>
                </div>

                {/* Active toggle */}
                <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]" onClick={e => e.stopPropagation()}>
                  <span className="text-[0.65rem] text-white/30 font-head">Activo</span>
                  <button
                    onClick={() => toggleActive(id, !isActive)}
                    disabled={saving === id}
                    className={`w-10 h-5 rounded-full transition-all relative ${isActive ? 'bg-success/40' : 'bg-white/10'}`}
                  >
                    <span className={`absolute top-0.5 w-4 h-4 rounded-full transition-all ${isActive ? 'left-5 bg-success' : 'left-0.5 bg-white/30'}`} />
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Selected cockpit detail panel */}
      {selectedCockpit && (() => {
        const color = COCKPIT_COLORS[selectedCockpit.id - 1]
        const todaySessions = selectedBookings
          .filter(b => b.date === today)
          .sort((a, b) => hhmm(a.start_time).localeCompare(hhmm(b.start_time)))
        const upcomingSessions = selectedBookings
          .filter(b => b.date > today && b.status === 'confirmed')
          .sort((a, b) => a.date.localeCompare(b.date) || hhmm(a.start_time).localeCompare(hhmm(b.start_time)))
          .slice(0, 10)
        const todayRevenue = todaySessions.filter(b => b.status === 'confirmed').reduce((s, b) => s + (b.session_type?.price ?? 0), 0)
        const weekRevenue = selectedBookings.filter(b => b.status === 'confirmed').reduce((s, b) => s + (b.session_type?.price ?? 0), 0)

        return (
          <div className="bg-[#111] border rounded-xl overflow-hidden mb-8"
            style={{ borderColor: color + '40' }}>
            <div className="h-0.5" style={{ background: color }} />
            <div className="p-5">
              {/* Panel header */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-head font-bold"
                    style={{ background: color + '20', color }}>C{selectedCockpit.id}</span>
                  <div>
                    <h2 className="font-head font-bold text-lg text-white leading-tight">{selectedCockpit.name}</h2>
                    <p className="text-white/30 text-xs">{selectedCockpit.description}</p>
                  </div>
                </div>
                <button onClick={() => setSelected(null)} className="w-7 h-7 flex items-center justify-center rounded text-white/25 hover:text-white hover:bg-white/5 transition-all text-lg">×</button>
              </div>

              {/* Quick stats */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {[
                  { label: 'Sesiones hoy', value: String(todaySessions.filter(b => b.status === 'confirmed').length), accent: 'text-white' },
                  { label: 'Ingresos hoy', value: `€${todayRevenue}`, accent: `text-[${color}]` },
                  { label: 'Ingresos semana', value: `€${weekRevenue}`, accent: 'text-white/60' },
                ].map(s => (
                  <div key={s.label} className="bg-white/[0.03] rounded-lg p-3 border border-white/[0.06]">
                    <p className="text-[0.6rem] text-white/25 font-head uppercase tracking-wider mb-1">{s.label}</p>
                    <p className={`font-head font-bold text-xl ${s.accent}`} style={s.label === 'Ingresos hoy' ? { color } : {}}>{s.value}</p>
                  </div>
                ))}
              </div>

              {/* TODAY'S SESSIONS — most important section */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-head font-bold text-xs uppercase tracking-wider" style={{ color }}>
                    Sesiones de hoy
                  </h3>
                  <span className="text-[0.65rem] text-white/25 font-head capitalize">
                    {format(new Date(), "EEEE, d 'de' MMMM", { locale: es })}
                  </span>
                </div>
                {todaySessions.length === 0 ? (
                  <div className="flex items-center justify-center py-6 rounded-lg border border-white/[0.06] text-white/20 text-sm">
                    Sin sesiones para hoy
                  </div>
                ) : (
                  <div className="space-y-2">
                    {todaySessions.map(b => {
                      const isNow = hhmm(b.start_time) <= nowHHMM && hhmm(b.end_time) > nowHHMM && b.status === 'confirmed'
                      const isPast = hhmm(b.end_time) <= nowHHMM
                      return (
                        <div key={b.id}
                          className={`flex items-center gap-3 px-4 py-3 rounded-lg border transition-all ${isNow ? 'border-opacity-40 bg-opacity-5' : 'border-white/[0.06] bg-white/[0.02]'}`}
                          style={isNow ? { borderColor: color + '60', background: color + '08' } : {}}>
                          {/* Time block */}
                          <div className="w-14 flex-shrink-0 text-center">
                            <p className="font-head font-bold text-sm" style={isNow ? { color } : { color: isPast ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.7)' }}>
                              {hhmm(b.start_time)}
                            </p>
                            <p className="text-[0.6rem] text-white/25">{hhmm(b.end_time)}</p>
                          </div>
                          {/* Divider */}
                          <div className="w-px h-8 flex-shrink-0" style={{ background: isNow ? color + '60' : 'rgba(255,255,255,0.08)' }} />
                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium truncate ${isPast ? 'text-white/40' : 'text-white/80'}`}>{b.customer_name}</p>
                            <p className="text-[0.65rem] text-white/30 truncate">{b.session_type?.name} · {b.num_people} pers.</p>
                          </div>
                          {/* Status */}
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {isNow && (
                              <span className="flex items-center gap-1 text-[0.6rem] font-head uppercase px-2 py-0.5 rounded border" style={{ borderColor: color + '60', background: color + '15', color }}>
                                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: color }} />
                                En curso
                              </span>
                            )}
                            {b.checked_in === true && (
                              <span className="text-[0.6rem] text-success border border-success/30 bg-success/10 px-2 py-0.5 rounded">✓ Asistió</span>
                            )}
                            {(b.checked_in === false || b.status === 'no_show') && (
                              <span className="text-[0.6rem] text-danger border border-danger/30 bg-danger/10 px-2 py-0.5 rounded">No show</span>
                            )}
                            {b.status === 'cancelled' && (
                              <span className="text-[0.6rem] text-white/25 border border-white/10 px-2 py-0.5 rounded">Cancelado</span>
                            )}
                            <span className="text-white/40 text-xs font-head">{b.session_type?.price ? `€${b.session_type.price}` : ''}</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Week calendar */}
              <div className="mb-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-head font-bold text-xs text-white/30 uppercase tracking-wider">Semana</h3>
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => setWeekStart(d => addDays(d, -7))}
                      className="w-6 h-6 rounded border border-white/10 text-white/30 hover:border-accent hover:text-accent transition-all flex items-center justify-center">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3"><path d="M15 18l-6-6 6-6"/></svg>
                    </button>
                    <span className="text-white/30 text-[0.65rem] font-head">
                      {format(weekStart, "d MMM", { locale: es })} – {format(addDays(weekStart, 6), "d MMM", { locale: es })}
                    </span>
                    <button onClick={() => setWeekStart(d => addDays(d, 7))}
                      className="w-6 h-6 rounded border border-white/10 text-white/30 hover:border-accent hover:text-accent transition-all flex items-center justify-center">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3"><path d="M9 18l6-6-6-6"/></svg>
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {weekDays.map(day => {
                    const ds = format(day, 'yyyy-MM-dd')
                    const isToday = isSameDay(day, new Date())
                    const dayBkgs = selectedBookings.filter(b => b.date === ds)
                    const dayBlocked = blocked.filter(s => s.date === ds && (s.cockpit_id === selectedCockpit.id || s.cockpit_id === null))
                    return (
                      <div key={ds} className={`rounded p-2 border min-h-[90px] ${isToday ? 'border-accent/30 bg-accent/[0.03]' : 'border-white/[0.06]'}`}>
                        <p className={`text-[0.6rem] font-head font-semibold uppercase tracking-wider mb-0.5 ${isToday ? 'text-accent' : 'text-white/25'}`}>
                          {format(day, 'EEE', { locale: es })}
                        </p>
                        <p className={`font-head font-bold text-base leading-none mb-1.5 ${isToday ? 'text-accent' : 'text-white/50'}`}>
                          {format(day, 'd')}
                        </p>
                        <div className="flex flex-col gap-0.5">
                          {dayBkgs.map(b => (
                            <div key={b.id} className="text-[0.52rem] leading-tight px-1 py-0.5 rounded truncate"
                              style={{ background: color + '20', color, borderLeft: `2px solid ${color}` }}>
                              {hhmm(b.start_time)} {b.customer_name.split(' ')[0]}
                            </div>
                          ))}
                          {dayBlocked.map(s => (
                            <div key={s.id} className="text-[0.52rem] leading-tight px-1 py-0.5 rounded truncate"
                              style={{ background: 'repeating-linear-gradient(45deg,rgba(255,255,255,0.04),rgba(255,255,255,0.04) 2px,transparent 2px,transparent 6px)', borderLeft: '2px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.3)' }}>
                              {hhmm(s.start_time)} Bloqueado
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Upcoming bookings (rest of week) */}
              {upcomingSessions.length > 0 && (
                <div>
                  <h3 className="font-head font-bold text-xs text-white/30 uppercase tracking-wider mb-3">Próximas reservas</h3>
                  <div className="space-y-1">
                    {upcomingSessions.map(b => (
                      <div key={b.id} className="flex items-center gap-3 px-3 py-2 bg-white/[0.02] rounded border border-white/[0.04]">
                        <div className="w-14 flex-shrink-0">
                          <p className="text-[0.65rem] text-white/30 font-head">{format(new Date(b.date + 'T00:00:00'), 'EEE d', { locale: es })}</p>
                          <p className="text-xs text-white/60 font-head font-bold">{hhmm(b.start_time)}</p>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white/80 text-sm truncate">{b.customer_name}</p>
                          <p className="text-white/30 text-xs">{b.session_type?.name}</p>
                        </div>
                        <span className="text-white/40 text-xs font-head flex-shrink-0">{b.session_type?.price ? `€${b.session_type.price}` : ''}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )
      })()}

      {/* Blocked slots for the week */}
      {blocked.length > 0 && (
        <div className="bg-[#111] border border-white/[0.07] rounded-lg overflow-hidden">
          <div className="px-5 py-4 border-b border-white/[0.07]">
            <h2 className="font-head font-bold text-xs text-white/30 uppercase tracking-wider">Bloqueos de la semana</h2>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {blocked.map(s => (
              <div key={s.id} className="flex items-center gap-4 px-5 py-3">
                <div className="w-3 h-3 rounded-sm flex-shrink-0"
                  style={{ background: 'repeating-linear-gradient(45deg,rgba(255,255,255,0.08),rgba(255,255,255,0.08) 2px,transparent 2px,transparent 6px)', border: '1px solid rgba(255,255,255,0.15)' }} />
                <div className="flex-1 min-w-0">
                  <p className="text-white/60 text-sm">{s.reason || 'Sin motivo'}</p>
                  <p className="text-white/25 text-xs">{s.date} · {hhmm(s.start_time)}–{hhmm(s.end_time)}</p>
                </div>
                <span className="text-white/25 text-xs font-head">{s.cockpit_id ? `Campo ${s.cockpit_id}` : 'Todos'}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Demo data ─────────────────────────────────────────────────────
const _mon = format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd')
const DEMO_SESSION = { id: 1, name: 'Individual 1h', duration_minutes: 60, price: 40, max_people: 1, color: '#FFD000' }

const DEMO_BOOKINGS: Booking[] = [
  { id:'c1', cockpit_ids:[1], session_type_id:1, customer_name:'Carlos García', customer_email:'carlos@demo.com', customer_phone:'', num_people:1, date:today, start_time:'11:00', end_time:'12:00', status:'confirmed', checked_in:true, notes:null, created_at:'', session_type:DEMO_SESSION },
  { id:'c2', cockpit_ids:[1,2], session_type_id:1, customer_name:'Ana Martínez', customer_email:'ana@demo.com', customer_phone:'', num_people:2, date:today, start_time:'14:00', end_time:'15:00', status:'confirmed', checked_in:null, notes:null, created_at:'', session_type:DEMO_SESSION },
  { id:'c3', cockpit_ids:[3], session_type_id:1, customer_name:'Pedro López', customer_email:'pedro@demo.com', customer_phone:'', num_people:1, date:today, start_time:'18:00', end_time:'19:00', status:'confirmed', checked_in:null, notes:null, created_at:'', session_type:DEMO_SESSION },
  { id:'c4', cockpit_ids:[2], session_type_id:1, customer_name:'María Sánchez', customer_email:'m@demo.com', customer_phone:'', num_people:1, date:format(addDays(new Date(), 1), 'yyyy-MM-dd'), start_time:'11:00', end_time:'12:00', status:'confirmed', checked_in:null, notes:null, created_at:'', session_type:DEMO_SESSION },
  { id:'c5', cockpit_ids:[1,2,3,4,5], session_type_id:1, customer_name:'Equipo Fenix', customer_email:'fenix@demo.com', customer_phone:'', num_people:5, date:format(addDays(new Date(), 2), 'yyyy-MM-dd'), start_time:'16:00', end_time:'18:00', status:'confirmed', checked_in:null, notes:'Team building', created_at:'', session_type:{id:4, name:'Grupal 2h', duration_minutes:120, price:100, max_people:8, color:'#F59E0B'} },
]

const DEMO_BLOCKED: BlockedSlot[] = [
  { id:'cb1', cockpit_id:2, date:format(addDays(new Date(), 1), 'yyyy-MM-dd'), start_time:'14:00', end_time:'16:00', reason:'Revisión técnica C2' },
]
