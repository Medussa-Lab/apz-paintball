'use client'
import { useState, useEffect, useCallback, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Booking, BlockedSlot, SessionType } from '@/lib/types'
import { format, subDays, eachDayOfInterval, startOfMonth, startOfYear } from 'date-fns'
import { es } from 'date-fns/locale'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts'

// ── Constants ─────────────────────────────────────────────────────
const COCKPIT_COLORS = ['#F59E0B', '#8B5CF6', '#FFD000', '#3B82F6', '#0EA5E9', '#06B6D4', '#00AACC', '#3385FF']
const COCKPIT_NAMES  = ['Motion', 'Triple Pro', 'Std 1', 'Std 2', 'Std 3', 'Std 4', 'Std 5', 'Std 6']
const SESSION_COLORS = ['#FFD000', '#8B5CF6', '#F59E0B', '#00FF88', '#FF3333', '#00AACC']
const COCKPIT_IDS    = [1, 2, 3, 4, 5, 6, 7, 8]

const TL_START = 10 * 60
const TL_RANGE = 15 * 60
const TL_HOURS = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 0, 1]

const today = format(new Date(), 'yyyy-MM-dd')

// ── Helpers ───────────────────────────────────────────────────────
function hhmm(t: string) { return t ? t.slice(0, 5) : '' }
function toMins(t: string) {
  const [h, m] = hhmm(t).split(':').map(Number)
  return h * 60 + m
}
function tlPct(t: string) {
  let m = toMins(t) - TL_START
  if (m < 0) m += 1440
  return Math.max(0, Math.min(100, m / TL_RANGE * 100))
}

// ── Sub-components ────────────────────────────────────────────────
function StatCard({ label, value, sub, accent }: { label: string; value: string; sub: string; accent?: string }) {
  return (
    <div className="bg-[#111] border border-white/[0.07] rounded-lg p-5">
      <p className="text-white/30 text-xs font-head uppercase tracking-wider mb-2">{label}</p>
      <p className={`font-head font-bold text-2xl ${accent || 'text-white'}`}>{value}</p>
      <p className="text-white/25 text-xs mt-1">{sub}</p>
    </div>
  )
}

type Period = 'day' | 'week' | 'month' | 'year'
function PeriodTabs({ value, onChange }: { value: Period; onChange: (p: Period) => void }) {
  const labels: Record<Period, string> = { day: '1D', week: '7D', month: '1M', year: '1A' }
  return (
    <div className="flex items-center gap-1">
      {(['day', 'week', 'month', 'year'] as Period[]).map(p => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={`text-[0.65rem] font-head uppercase tracking-wider px-2.5 py-1 rounded transition-all ${
            value === p ? 'bg-accent/20 text-accent border border-accent/30' : 'text-white/25 border border-transparent hover:text-white/50'
          }`}
        >
          {labels[p]}
        </button>
      ))}
    </div>
  )
}

// ── Timeline ──────────────────────────────────────────────────────
function Timeline({
  bookings,
  blockedSlots = [],
  loading,
  onSelect,
  expanded = false,
}: {
  bookings: Booking[]
  blockedSlots?: BlockedSlot[]
  loading: boolean
  onSelect?: (b: Booking) => void
  expanded?: boolean
}) {
  const [now, setNow] = useState(() => {
    const d = new Date(); return d.getHours() * 60 + d.getMinutes()
  })
  useEffect(() => {
    const id = setInterval(() => {
      const d = new Date(); setNow(d.getHours() * 60 + d.getMinutes())
    }, 30_000)
    return () => clearInterval(id)
  }, [])

  const nowOffset  = now - TL_START < 0 ? now - TL_START + 1440 : now - TL_START
  const nowVisible = nowOffset >= 0 && nowOffset <= TL_RANGE
  const nowPct     = nowOffset / TL_RANGE * 100
  if (loading) return <div className={`${expanded ? 'flex-1' : 'h-[220px]'} skeleton bg-white/5 rounded`} />

  return (
    <div className={expanded ? 'flex flex-col h-full' : ''}>
      {/* Hour axis */}
      <div className="relative h-5 mb-2 ml-[88px] mr-2 flex-shrink-0">
        {TL_HOURS.map((h, i) => (
          <span
            key={i}
            className="absolute text-[0.58rem] text-white/20 font-body -translate-x-1/2"
            style={{ left: `${(i / (TL_HOURS.length - 1)) * 100}%` }}
          >
            {String(h).padStart(2, '0')}h
          </span>
        ))}
      </div>

      {/* Cockpit rows */}
      <div className={expanded ? 'flex-1 flex flex-col gap-1.5 overflow-hidden' : ''}>
      {COCKPIT_IDS.map((cockpitId, ci) => {
        const rowBookings = bookings.filter(
          b => Array.isArray(b.cockpit_ids) && b.cockpit_ids.includes(cockpitId)
        )
        const rowBlocked = blockedSlots.filter(
          s => s.cockpit_id === cockpitId || s.cockpit_id === null
        )
        return (
          <div key={cockpitId} className={`flex items-center gap-2 ${expanded ? 'flex-1' : 'mb-1.5'}`}>
            <div className="w-[88px] flex-shrink-0 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: COCKPIT_COLORS[ci] }} />
              <span className="text-[0.6rem] text-white/30 truncate font-body">{COCKPIT_NAMES[ci]}</span>
            </div>
            <div className={`relative flex-1 ${expanded ? 'self-stretch' : 'h-6'} bg-white/[0.03] rounded-sm overflow-hidden`}>
              {/* Hour grid lines */}
              {TL_HOURS.slice(1, -1).map((_, i) => (
                <div key={i} className="absolute top-0 bottom-0 w-px bg-white/[0.04]"
                  style={{ left: `${((i + 1) / (TL_HOURS.length - 1)) * 100}%` }} />
              ))}

              {/* Now indicator */}
              {nowVisible && (
                <div className="absolute top-0 bottom-0 w-px bg-accent/60 z-10"
                  style={{ left: `${nowPct}%` }} />
              )}

              {/* Blocked slots */}
              {rowBlocked.map(s => {
                const sp = tlPct(s.start_time)
                const ep = tlPct(s.end_time)
                return (
                  <div
                    key={s.id}
                    className="absolute top-0 bottom-0 z-0"
                    style={{
                      left: `${sp}%`, width: `${Math.max(0.5, ep - sp)}%`,
                      background: 'repeating-linear-gradient(45deg,rgba(255,255,255,0.03),rgba(255,255,255,0.03) 2px,transparent 2px,transparent 8px)',
                      borderLeft: '2px solid rgba(255,255,255,0.12)',
                    }}
                    title={`Bloqueado: ${s.reason || 'Sin motivo'}`}
                  />
                )
              })}

              {/* Booking blocks */}
              {rowBookings.map(b => {
                const sp      = tlPct(b.start_time)
                const ep      = tlPct(b.end_time)
                const wpct    = Math.max(0.5, ep - sp)
                const color   = COCKPIT_COLORS[ci]
                const isNoShow = b.status === 'no_show' || b.checked_in === false
                const isDone   = b.checked_in === true
                const blockColor = isNoShow ? '#FF5050' : isDone ? '#00FF88' : color
                return (
                  <div
                    key={b.id}
                    className={`absolute top-0.5 bottom-0.5 rounded-sm flex items-center overflow-hidden px-1 z-[5] ${onSelect ? 'cursor-pointer hover:brightness-125' : ''}`}
                    style={{
                      left: `${sp}%`, width: `${wpct}%`,
                      background: isNoShow ? 'rgba(255,80,80,0.18)' : isDone ? '#00FF8825' : color + '35',
                      borderLeft: `2px solid ${blockColor}`,
                      opacity: b.status === 'cancelled' ? 0.3 : 1,
                    }}
                    onClick={() => onSelect?.(b)}
                    title={`${b.customer_name} · ${hhmm(b.start_time)}–${hhmm(b.end_time)}`}
                  >
                    <span className="text-[0.52rem] leading-none truncate font-body" style={{ color: blockColor }}>
                      {b.customer_name.split(' ')[0]}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
      </div>

      {nowVisible && (
        <div className="relative ml-[88px] mt-1 h-4 flex-shrink-0">
          <span className="absolute text-[0.58rem] text-accent/60 font-body -translate-x-1/2"
            style={{ left: `${nowPct}%` }}>
            {String(Math.floor(now / 60)).padStart(2, '0')}:{String(now % 60).padStart(2, '0')}
          </span>
        </div>
      )}
    </div>
  )
}

// ── SessionRow ────────────────────────────────────────────────────
function SessionRow({
  booking, onCheckin, onNoShow, onReset,
}: {
  booking: Booking
  onCheckin: (id: string) => void
  onNoShow:  (id: string) => void
  onReset:   (id: string) => void
}) {
  const b        = booking
  const nowHHMM  = format(new Date(), 'HH:mm')
  const isPast   = hhmm(b.end_time) <= nowHHMM
  const isNow    = hhmm(b.start_time) <= nowHHMM && !isPast

  return (
    <div className={`flex items-center gap-3 px-4 py-3 border-b border-white/[0.04] last:border-0 ${isNow ? 'bg-accent/[0.04]' : ''}`}>
      <div className="w-14 flex-shrink-0">
        <span className={`font-head font-bold text-sm ${isNow ? 'text-accent' : 'text-white/50'}`}>{hhmm(b.start_time)}</span>
        <span className="text-white/20 text-xs block">{hhmm(b.end_time)}</span>
      </div>
      <div className="w-12 flex-shrink-0 flex flex-wrap gap-0.5">
        {b.cockpit_ids.map(id => (
          <span key={id} className="text-[0.55rem] font-head font-bold px-1 py-0.5 rounded"
            style={{ background: COCKPIT_COLORS[id - 1] + '25', color: COCKPIT_COLORS[id - 1] }}>
            C{id}
          </span>
        ))}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white/80 text-sm truncate">{b.customer_name}</p>
        <p className="text-white/30 text-[0.7rem] truncate">{b.session_type?.name || `#${b.session_type_id}`}</p>
      </div>
      <span className="text-white/40 text-sm font-head w-10 text-right flex-shrink-0">
        {b.session_type?.price ? `€${b.session_type.price}` : '—'}
      </span>
      <div className="flex items-center gap-1 flex-shrink-0">
        {b.status === 'confirmed' && b.checked_in == null && (
          <>
            <button onClick={() => onCheckin(b.id)}
              className="text-[0.65rem] font-head uppercase tracking-wider px-2 py-1 rounded border border-success/30 text-success/60 hover:bg-success/10 hover:text-success transition-all">
              ✓ Asistió
            </button>
            <button onClick={() => onNoShow(b.id)}
              className="text-[0.65rem] font-head uppercase tracking-wider px-2 py-1 rounded border border-danger/20 text-danger/40 hover:bg-danger/10 hover:text-danger transition-all">
              ✗
            </button>
          </>
        )}
        {b.checked_in === true && (
          <div className="flex items-center gap-1">
            <span className="text-[0.65rem] font-head uppercase tracking-wider px-2 py-1 rounded border border-success/40 bg-success/10 text-success">✓ Asistió</span>
            <button onClick={() => onReset(b.id)} title="Deshacer"
              className="w-6 h-6 flex items-center justify-center rounded border border-white/10 text-white/20 hover:border-white/30 hover:text-white/50 transition-all text-xs">↩</button>
          </div>
        )}
        {(b.checked_in === false || b.status === 'no_show') && b.checked_in !== true && (
          <div className="flex items-center gap-1">
            <span className="text-[0.65rem] font-head uppercase tracking-wider px-2 py-1 rounded border border-danger/30 bg-danger/10 text-danger/70">No show</span>
            {b.status !== 'cancelled' && (
              <button onClick={() => onReset(b.id)} title="Deshacer"
                className="w-6 h-6 flex items-center justify-center rounded border border-white/10 text-white/20 hover:border-white/30 hover:text-white/50 transition-all text-xs">↩</button>
            )}
          </div>
        )}
        {b.status === 'cancelled' && (
          <span className="text-[0.65rem] px-2 py-0.5 rounded border bg-danger/10 text-danger border-danger/30">Cancelado</span>
        )}
      </div>
    </div>
  )
}

// ── Booking quick modal (from timeline click) ─────────────────────
function BookingQuickModal({
  booking, onClose, onCheckin, onNoShow, onReset,
}: {
  booking: Booking
  onClose:  () => void
  onCheckin: () => void
  onNoShow:  () => void
  onReset:   () => void
}) {
  const b     = booking
  const color = COCKPIT_COLORS[(b.cockpit_ids[0] ?? 1) - 1] ?? '#FFD000'
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60] flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-[#111] border border-white/[0.1] rounded-xl w-full max-w-sm shadow-[0_24px_80px_rgba(0,0,0,0.8)]" onClick={e => e.stopPropagation()}>
        <div className="h-0.5 rounded-t-xl" style={{ background: color }} />
        <div className="p-5">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="font-head font-bold text-base text-white">{b.customer_name}</h3>
              <p className="text-white/30 text-xs mt-0.5">{hhmm(b.start_time)}–{hhmm(b.end_time)} · {b.cockpit_ids.map(id => `Campo ${id}`).join(', ')}</p>
            </div>
            <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded text-white/25 hover:text-white hover:bg-white/5 transition-all text-lg">×</button>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs mb-4">
            {[
              ['Sesión',    b.session_type?.name || `#${b.session_type_id}`],
              ['Precio',    b.session_type?.price ? `€${b.session_type.price}` : '—'],
              ['Email',     b.customer_email],
              ['Tel',       b.customer_phone || '—'],
              ['Personas',  String(b.num_people)],
              ['Notas',     b.notes || '—'],
            ].map(([k, v]) => (
              <p key={k} className="text-white/30">{k}: <span className="text-white/60">{v}</span></p>
            ))}
          </div>
          {b.status === 'confirmed' && b.checked_in == null && (
            <div className="flex gap-2 mb-2">
              <button onClick={onCheckin} className="flex-1 py-1.5 text-xs font-head font-semibold uppercase tracking-wider rounded border border-success/30 text-success/60 hover:bg-success/10 hover:text-success transition-all">✓ Asistió</button>
              <button onClick={onNoShow}  className="flex-1 py-1.5 text-xs font-head font-semibold uppercase tracking-wider rounded border border-danger/20 text-danger/40 hover:bg-danger/10 hover:text-danger transition-all">✗ No show</button>
            </div>
          )}
          {(b.checked_in === true || b.checked_in === false) && b.status !== 'cancelled' && (
            <div className="flex gap-2 mb-2">
              <div className={`flex-1 py-1.5 text-xs font-head font-semibold uppercase tracking-wider rounded border text-center ${b.checked_in === true ? 'border-success/40 bg-success/10 text-success' : 'border-danger/30 bg-danger/10 text-danger/70'}`}>
                {b.checked_in === true ? '✓ Asistió' : '✗ No show'}
              </div>
              <button onClick={onReset} title="Deshacer"
                className="px-3 py-1.5 text-xs font-head font-semibold uppercase tracking-wider rounded border border-white/10 text-white/30 hover:border-white/30 hover:text-white/60 transition-all">
                ↩
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Create Booking Modal ──────────────────────────────────────────
function CreateBookingModal({
  sessionTypes, onClose, onCreated,
}: {
  sessionTypes: SessionType[]
  onClose:    () => void
  onCreated:  () => void
}) {
  const supabase = createClient()
  const [form, setForm] = useState({
    date:          today,
    sessionTypeId: sessionTypes[0]?.id ? String(sessionTypes[0].id) : '',
    startTime:     '11:00',
    endTime:       '12:00',
    cockpits:      [] as number[],
    name:          '',
    email:         '',
    phone:         '',
    people:        '1',
    notes:         '',
  })
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  // Auto-calculate end time from session type duration
  useEffect(() => {
    if (!form.startTime || !form.sessionTypeId) return
    const st = sessionTypes.find(s => s.id === Number(form.sessionTypeId))
    if (!st) return
    const [h, m] = form.startTime.split(':').map(Number)
    const totalMins = h * 60 + m + st.duration_minutes
    const endH = Math.floor(totalMins / 60) % 24
    const endM = totalMins % 60
    setForm(f => ({ ...f, endTime: `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}` }))
  }, [form.startTime, form.sessionTypeId, sessionTypes])

  const toggleCockpit = (id: number) =>
    setForm(f => ({
      ...f,
      cockpits: f.cockpits.includes(id) ? f.cockpits.filter(x => x !== id) : [...f.cockpits, id].sort(),
    }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.date || !form.startTime || !form.endTime || !form.sessionTypeId || form.cockpits.length === 0) {
      setError('Completa todos los campos obligatorios y selecciona al menos un cockpit.')
      return
    }
    setLoading(true); setError('')
    const ref = 'GZ-' + Math.random().toString(36).substring(2, 8).toUpperCase()
    const isConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://xxx.supabase.co'
    if (!isConfigured) { onCreated(); onClose(); return }
    const { error: err } = await (supabase as any).from('bookings').insert({
      cockpit_ids:    form.cockpits,
      session_type_id: Number(form.sessionTypeId),
      customer_name:  form.name.trim(),
      customer_email: form.email.trim(),
      customer_phone: form.phone.trim(),
      num_people:     Number(form.people) || 1,
      date:           form.date,
      start_time:     form.startTime,
      end_time:       form.endTime,
      status:         'confirmed',
      notes:          form.notes.trim() || null,
      reference:      ref,
      checked_in:     null,
    })
    if (err) { setError(err.message); setLoading(false); return }
    window.dispatchEvent(new CustomEvent('admin:booking-created'))
    onCreated(); onClose()
  }

  const inputCls = "bg-[#0a0a0a] border border-white/10 rounded px-3 py-2 text-white text-sm focus:border-accent focus:outline-none transition-all w-full placeholder:text-white/20"

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-[#111] border border-white/[0.1] rounded-xl w-full max-w-lg shadow-[0_24px_80px_rgba(0,0,0,0.9)] my-4" onClick={e => e.stopPropagation()}>
        <div className="h-0.5 rounded-t-xl bg-accent" />
        <div className="p-6">
          <div className="flex justify-between items-center mb-5">
            <h3 className="font-head font-bold text-lg text-white">Nueva Reserva</h3>
            <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded text-white/25 hover:text-white hover:bg-white/5 transition-all text-lg">×</button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Sesión */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[0.65rem] font-head uppercase tracking-wider text-white/30 block mb-1">Fecha *</label>
                <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                  required className={inputCls} />
              </div>
              <div>
                <label className="text-[0.65rem] font-head uppercase tracking-wider text-white/30 block mb-1">Tipo de sesión *</label>
                <select value={form.sessionTypeId} onChange={e => setForm(f => ({ ...f, sessionTypeId: e.target.value }))}
                  className={inputCls}>
                  {sessionTypes.map(st => (
                    <option key={st.id} value={st.id}>{st.name} — €{st.price}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[0.65rem] font-head uppercase tracking-wider text-white/30 block mb-1">Hora inicio *</label>
                <input type="time" value={form.startTime} onChange={e => setForm(f => ({ ...f, startTime: e.target.value }))}
                  required className={inputCls} />
              </div>
              <div>
                <label className="text-[0.65rem] font-head uppercase tracking-wider text-white/30 block mb-1">Hora fin *</label>
                <input type="time" value={form.endTime} onChange={e => setForm(f => ({ ...f, endTime: e.target.value }))}
                  required className={inputCls} />
              </div>
            </div>

            {/* Campos */}
            <div>
              <label className="text-[0.65rem] font-head uppercase tracking-wider text-white/30 block mb-2">Campos * (selecciona al menos uno)</label>
              <div className="flex flex-wrap gap-2">
                {COCKPIT_IDS.map((id, ci) => (
                  <button key={id} type="button" onClick={() => toggleCockpit(id)}
                    className={`px-3 py-1.5 rounded border text-xs font-head font-semibold transition-all ${
                      form.cockpits.includes(id)
                        ? 'border-opacity-60 text-white'
                        : 'border-white/10 text-white/30 hover:border-white/20'
                    }`}
                    style={form.cockpits.includes(id)
                      ? { borderColor: COCKPIT_COLORS[ci], background: COCKPIT_COLORS[ci] + '20', color: COCKPIT_COLORS[ci] }
                      : {}}>
                    C{id} {COCKPIT_NAMES[ci]}
                  </button>
                ))}
              </div>
            </div>

            {/* Cliente */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[0.65rem] font-head uppercase tracking-wider text-white/30 block mb-1">Nombre *</label>
                <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  required placeholder="Nombre completo" className={inputCls} />
              </div>
              <div>
                <label className="text-[0.65rem] font-head uppercase tracking-wider text-white/30 block mb-1">Email *</label>
                <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  required placeholder="cliente@email.com" className={inputCls} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[0.65rem] font-head uppercase tracking-wider text-white/30 block mb-1">Teléfono</label>
                <input type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  placeholder="+34 600 000 000" className={inputCls} />
              </div>
              <div>
                <label className="text-[0.65rem] font-head uppercase tracking-wider text-white/30 block mb-1">Personas</label>
                <input type="number" min="1" max="20" value={form.people} onChange={e => setForm(f => ({ ...f, people: e.target.value }))}
                  className={inputCls} />
              </div>
            </div>
            <div>
              <label className="text-[0.65rem] font-head uppercase tracking-wider text-white/30 block mb-1">Notas</label>
              <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                rows={2} placeholder="Peticiones especiales, observaciones..." className={`${inputCls} resize-none`} />
            </div>

            {error && <p className="text-danger text-xs">{error}</p>}

            <div className="flex gap-2 pt-1">
              <button type="button" onClick={onClose}
                className="flex-1 py-2.5 text-sm font-head font-semibold uppercase tracking-wider border border-white/10 text-white/40 rounded hover:border-white/20 hover:text-white/60 transition-all">
                Cancelar
              </button>
              <button type="submit" disabled={loading}
                className="flex-1 py-2.5 text-sm font-head font-semibold uppercase tracking-wider bg-accent text-black rounded hover:bg-accent/80 transition-all disabled:opacity-50">
                {loading ? 'Creando…' : 'Crear Reserva'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────
export default function AdminDashboard() {
  const [bookings,      setBookings]      = useState<Booking[]>([])
  const [chartBookings, setChartBookings] = useState<Booking[]>([])
  const [blockedSlots,  setBlockedSlots]  = useState<BlockedSlot[]>([])
  const [sessionTypes,  setSessionTypes]  = useState<SessionType[]>([])
  const [loading,       setLoading]       = useState(true)
  const [chartLoading,  setChartLoading]  = useState(false)
  const [chartPeriod,   setChartPeriod]   = useState<Period>('week')
  const [sessionView,   setSessionView]   = useState<'today' | 'now'>('today')
  const [selectedBkg,   setSelectedBkg]   = useState<Booking | null>(null)
  const [timelineExp,   setTimelineExp]   = useState(false)
  const [showCreate,    setShowCreate]    = useState(false)
  const [nowTime,       setNowTime]       = useState(() => format(new Date(), 'HH:mm'))

  const supabase = createClient()
  const isConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://xxx.supabase.co'

  // Update nowTime every 30s for "Ahora" filter
  useEffect(() => {
    const id = setInterval(() => setNowTime(format(new Date(), 'HH:mm')), 30_000)
    return () => clearInterval(id)
  }, [])

  // ── Load today data ───────────────────────────────────────────
  const load = useCallback(async () => {
    setLoading(true)
    if (!isConfigured) {
      setBookings(DEMO_BOOKINGS)
      setSessionTypes(DEMO_SESSION_TYPES)
      setBlockedSlots(DEMO_BLOCKED)
      setLoading(false)
      return
    }
    try {
      const week7 = format(subDays(new Date(), 6), 'yyyy-MM-dd')
      const nextWeek = format(new Date(Date.now() + 7 * 86400000), 'yyyy-MM-dd')
      const [todayRes, stRes, bsRes] = await Promise.all([
        (supabase as any).from('bookings').select('*').eq('date', today).order('start_time'),
        (supabase as any).from('session_types').select('*'),
        (supabase as any).from('blocked_slots').select('*').gte('date', today).lte('date', nextWeek).order('date').order('start_time'),
      ])
      const stMap: Record<number, SessionType> = {}
      if (stRes.data) for (const st of stRes.data) stMap[st.id] = st
      setBookings(((todayRes.data || []) as any[]).map(b => ({ ...b, session_type: stMap[b.session_type_id] ?? null })))
      setSessionTypes(stRes.data || [])
      setBlockedSlots(bsRes.data || [])
    } catch (err) { console.error('Dashboard load error:', err) }
    finally { setLoading(false) }
  }, [])

  // ── Load chart data ──────────────────────────────────────────
  const loadChart = useCallback(async (period: Period) => {
    setChartLoading(true)
    if (!isConfigured) {
      setChartBookings(generateDemoChart(period))
      setChartLoading(false)
      return
    }
    try {
      const now = new Date()
      const from = period === 'day'
        ? today
        : period === 'week'
        ? format(subDays(now, 6), 'yyyy-MM-dd')
        : period === 'month'
        ? format(startOfMonth(now), 'yyyy-MM-dd')
        : format(startOfYear(now), 'yyyy-MM-dd')
      const [bRes, stRes] = await Promise.all([
        (supabase as any).from('bookings').select('*').gte('date', from).lte('date', today).in('status', ['confirmed', 'no_show']),
        (supabase as any).from('session_types').select('id,name,price'),
      ])
      const stMap: Record<number, { name: string; price: number }> = {}
      if (stRes.data) for (const st of stRes.data) stMap[st.id] = { name: st.name, price: st.price }
      setChartBookings(((bRes.data || []) as any[]).map(b => ({ ...b, session_type: stMap[b.session_type_id] ?? null })))
    } catch (err) { console.error('Chart load error:', err) }
    finally { setChartLoading(false) }
  }, [])

  useEffect(() => {
    load()
    const ch = (supabase as any)
      .channel('dashboard')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings', filter: `date=eq.${today}` }, load)
      .subscribe()
    return () => { supabase.removeChannel(ch) }
  }, [load])

  useEffect(() => { loadChart(chartPeriod) }, [chartPeriod, loadChart])

  // ── Checkin actions — optimistic updates, no reload ──────────
  const applyPatch = (id: string, patch: Partial<Booking>) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, ...patch } : b))
    setSelectedBkg(prev => prev?.id === id ? { ...prev, ...patch } : prev)
  }

  const updateCheckin = async (id: string, value: boolean) => {
    const patch = { checked_in: value, ...(value ? {} : { status: 'no_show' as const }) }
    applyPatch(id, patch)
    if (!isConfigured) return
    await (supabase as any).from('bookings').update(patch).eq('id', id)
  }

  const resetCheckin = async (id: string) => {
    const patch = { checked_in: null, status: 'confirmed' as const }
    applyPatch(id, patch)
    if (!isConfigured) return
    await (supabase as any).from('bookings').update(patch).eq('id', id)
  }

  // ── Derived stats ─────────────────────────────────────────────
  const confirmed   = bookings.filter(b => b.status === 'confirmed')
  const attended    = bookings.filter(b => b.checked_in === true)
  const noShows     = bookings.filter(b => b.checked_in === false || b.status === 'no_show')
  const estRevenue  = confirmed.reduce((s, b) => s + (b.session_type?.price ?? 0), 0)
  const realRevenue = attended.reduce((s, b) => s + (b.session_type?.price ?? 0), 0)

  const todayAll      = [...bookings].sort((a, b) => hhmm(a.start_time).localeCompare(hhmm(b.start_time)))
  const activeSessions = todayAll.filter(b =>
    hhmm(b.start_time) <= nowTime && hhmm(b.end_time) > nowTime && b.status === 'confirmed'
  )
  const displaySessions = sessionView === 'now' ? activeSessions : todayAll
  const upcoming = confirmed.filter(b => hhmm(b.end_time) > nowTime)

  // ── Chart data ────────────────────────────────────────────────
  const revenueData = useMemo(() => {
    const now = new Date()
    if (chartPeriod === 'day') {
      return TL_HOURS.map(h => ({
        label: `${String(h).padStart(2, '0')}h`,
        ingresos: chartBookings
          .filter(b => b.date === today && parseInt(b.start_time.split(':')[0]) === h)
          .reduce((s, b) => s + (b.session_type?.price ?? 0), 0),
      }))
    }
    if (chartPeriod === 'week') {
      return eachDayOfInterval({ start: subDays(now, 6), end: now }).map(d => ({
        label: format(d, 'EEE', { locale: es }),
        ingresos: chartBookings.filter(b => b.date === format(d, 'yyyy-MM-dd'))
          .reduce((s, b) => s + (b.session_type?.price ?? 0), 0),
      }))
    }
    if (chartPeriod === 'month') {
      return eachDayOfInterval({ start: startOfMonth(now), end: now }).map(d => ({
        label: format(d, 'd'),
        ingresos: chartBookings.filter(b => b.date === format(d, 'yyyy-MM-dd'))
          .reduce((s, b) => s + (b.session_type?.price ?? 0), 0),
      }))
    }
    // year: by month
    const year = now.getFullYear()
    return Array.from({ length: now.getMonth() + 1 }, (_, m) => {
      const ms = String(m + 1).padStart(2, '0')
      return {
        label: format(new Date(year, m, 1), 'MMM', { locale: es }),
        ingresos: chartBookings.filter(b => b.date.startsWith(`${year}-${ms}`))
          .reduce((s, b) => s + (b.session_type?.price ?? 0), 0),
      }
    })
  }, [chartBookings, chartPeriod])

  const sessionData = useMemo(() => {
    const map: Record<string, number> = {}
    chartBookings.forEach(b => {
      const n = b.session_type?.name || 'Otro'
      map[n] = (map[n] || 0) + 1
    })
    return Object.entries(map).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value)
  }, [chartBookings])

  // ── Today's blocked slots (for display section) ───────────────
  const todayBlocked = blockedSlots.filter(s => s.date === today)
  const upcomingBlocked = blockedSlots

  // ── Render ────────────────────────────────────────────────────
  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-head font-bold text-2xl text-white">Dashboard</h1>
          <p className="text-white/40 text-sm mt-1 capitalize">
            {format(new Date(), "EEEE, d 'de' MMMM yyyy", { locale: es })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 text-sm font-head font-semibold uppercase tracking-wider px-4 py-2 bg-accent text-black rounded hover:bg-accent/80 transition-all"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M12 5v14M5 12h14"/></svg>
            Nueva Reserva
          </button>
          <button onClick={() => { load(); window.dispatchEvent(new CustomEvent('admin:refresh')) }}
            className="w-8 h-8 flex items-center justify-center rounded border border-white/10 text-white/30 hover:border-accent/50 hover:text-accent transition-all"
            title="Recargar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-3.5 h-3.5">
              <path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
            </svg>
          </button>
          <span className="flex items-center gap-2 text-success text-xs font-head uppercase tracking-wider border border-success/30 bg-success/5 px-3 py-1.5 rounded">
            <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" /> En directo
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <StatCard label="Reservas hoy" value={String(confirmed.length)}
          sub={`${todayAll.filter(b => b.status === 'cancelled').length} canceladas`} />
        <StatCard label="Ingresos estimados" value={`€${estRevenue}`}
          sub={`${upcoming.length} sesiones pendientes`} />
        <StatCard label="Ingresos reales" value={`€${realRevenue}`}
          sub={`${attended.length} check-ins confirmados`} accent="text-success" />
        <StatCard label="No shows hoy" value={String(noShows.length)}
          sub={noShows.length > 0 ? `€${noShows.reduce((s, b) => s + (b.session_type?.price ?? 0), 0)} perdidos` : 'Sin no shows'}
          accent={noShows.length > 0 ? 'text-warn' : 'text-white'} />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mb-8">
        {/* Revenue chart */}
        <div className="xl:col-span-2 bg-[#111] border border-white/[0.07] rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-head font-bold text-xs text-white/40 uppercase tracking-wider">Ingresos</h2>
            <PeriodTabs value={chartPeriod} onChange={p => { setChartPeriod(p) }} />
          </div>
          {chartLoading || loading ? (
            <div className="h-40 skeleton bg-white/5 rounded" />
          ) : (
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={revenueData} barSize={chartPeriod === 'month' ? 8 : chartPeriod === 'day' ? 12 : chartPeriod === 'year' ? 16 : 20}>
                <XAxis dataKey="label" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10, fontFamily: 'Rajdhani' }}
                  axisLine={false} tickLine={false} interval={chartPeriod === 'month' ? 4 : chartPeriod === 'day' ? 1 : 0} />
                <YAxis tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10 }} axisLine={false} tickLine={false}
                  tickFormatter={v => `€${v}`} width={40} />
                <Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, fontSize: 12 }}
                  labelStyle={{ color: 'rgba(255,255,255,0.5)' }} itemStyle={{ color: '#fff' }}
                  formatter={(v) => [`€${v}`, 'Ingresos']} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
                <Bar dataKey="ingresos" fill="#FFD000" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
          <p className="text-[0.65rem] text-white/15 mt-1 text-right font-body">
            Total: <span className="text-white/30">€{chartBookings.reduce((s, b) => s + (b.session_type?.price ?? 0), 0)}</span>
          </p>
        </div>

        {/* Session types pie */}
        <div className="bg-[#111] border border-white/[0.07] rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-head font-bold text-xs text-white/40 uppercase tracking-wider">Tipos de sesión</h2>
            <PeriodTabs value={chartPeriod} onChange={setChartPeriod} />
          </div>
          {chartLoading || loading ? (
            <div className="h-40 skeleton bg-white/5 rounded" />
          ) : sessionData.length === 0 ? (
            <div className="h-40 flex items-center justify-center text-white/20 text-sm">Sin datos</div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <ResponsiveContainer width="100%" height={110}>
                <PieChart>
                  <Pie data={sessionData} cx="50%" cy="50%" innerRadius={30} outerRadius={50} paddingAngle={3} dataKey="value">
                    {sessionData.map((_, i) => <Cell key={i} fill={SESSION_COLORS[i % SESSION_COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, fontSize: 12 }}
                    itemStyle={{ color: '#fff' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-col gap-1.5 w-full">
                {sessionData.slice(0, 5).map((d, i) => (
                  <div key={d.name} className="flex items-center gap-2 text-xs">
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: SESSION_COLORS[i % SESSION_COLORS.length] }} />
                    <span className="text-white/50 flex-1 truncate">{d.name}</span>
                    <span className="text-white/70 font-head">{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-[#111] border border-white/[0.07] rounded-lg p-5 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-head font-bold text-xs text-white/40 uppercase tracking-wider">
            Timeline de hoy · 8 cockpits
          </h2>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3 text-[0.65rem] font-body text-white/25">
              <span className="flex items-center gap-1">
                <span className="w-3 h-2 rounded-sm inline-block bg-accent/35 border-l-2 border-accent" /> Reservado
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-2 rounded-sm inline-block bg-success/30 border-l-2 border-success" /> Asistió
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-2 rounded-sm inline-block" style={{ background: 'repeating-linear-gradient(45deg,rgba(255,255,255,0.05),rgba(255,255,255,0.05) 2px,transparent 2px,transparent 6px)', borderLeft: '2px solid rgba(255,255,255,0.15)' }} /> Bloqueado
              </span>
            </div>
            <button
              onClick={() => setTimelineExp(true)}
              className="w-7 h-7 flex items-center justify-center rounded border border-white/10 text-white/25 hover:border-accent hover:text-accent transition-all"
              title="Ampliar timeline"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-3.5 h-3.5">
                <path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3"/>
              </svg>
            </button>
          </div>
        </div>
        <Timeline
          bookings={bookings}
          blockedSlots={todayBlocked}
          loading={loading}
          onSelect={setSelectedBkg}
        />
      </div>

      {/* Sessions de hoy */}
      <div className="bg-[#111] border border-white/[0.07] rounded-lg overflow-hidden mb-8">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.07]">
          <h2 className="font-head font-bold text-xs text-white/40 uppercase tracking-wider">Sesiones</h2>
          <div className="flex items-center gap-2">
            <div className="flex items-center rounded border border-white/10 overflow-hidden">
              <button
                onClick={() => setSessionView('today')}
                className={`text-xs font-head uppercase tracking-wider px-3 py-1.5 transition-all ${sessionView === 'today' ? 'bg-accent/20 text-accent' : 'text-white/25 hover:text-white/50'}`}
              >
                Hoy
                <span className="ml-1.5 text-[0.6rem]">{todayAll.length}</span>
              </button>
              <button
                onClick={() => setSessionView('now')}
                className={`text-xs font-head uppercase tracking-wider px-3 py-1.5 transition-all border-l border-white/10 ${sessionView === 'now' ? 'bg-accent/20 text-accent' : 'text-white/25 hover:text-white/50'}`}
              >
                Ahora
                {activeSessions.length > 0 && (
                  <span className="ml-1.5 text-[0.6rem] w-4 h-4 inline-flex items-center justify-center rounded-full bg-success/20 text-success">{activeSessions.length}</span>
                )}
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="p-5 space-y-2">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-10 skeleton bg-white/5 rounded" />)}</div>
        ) : displaySessions.length === 0 ? (
          <div className="px-5 py-10 text-center text-white/20 text-sm">
            {sessionView === 'now' ? 'No hay sesiones activas en este momento.' : 'No hay sesiones para hoy.'}
          </div>
        ) : (
          displaySessions.map(b => (
            <SessionRow key={b.id} booking={b}
              onCheckin={id => updateCheckin(id, true)}
              onNoShow={id => updateCheckin(id, false)}
              onReset={resetCheckin}
            />
          ))
        )}
      </div>

      {/* Bloqueos activos */}
      {upcomingBlocked.length > 0 && (
        <div className="bg-[#111] border border-white/[0.07] rounded-lg overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.07]">
            <h2 className="font-head font-bold text-xs text-white/40 uppercase tracking-wider">
              Bloqueos próximos
            </h2>
            <a href="/admin/block-slots" className="text-[0.65rem] font-head uppercase tracking-wider text-white/20 hover:text-accent transition-colors">
              Gestionar →
            </a>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {upcomingBlocked.map(s => (
              <div key={s.id} className="flex items-center gap-4 px-5 py-3">
                <div className="w-3 h-3 rounded-sm flex-shrink-0"
                  style={{ background: 'repeating-linear-gradient(45deg,rgba(255,255,255,0.08),rgba(255,255,255,0.08) 2px,transparent 2px,transparent 6px)', border: '1px solid rgba(255,255,255,0.15)' }} />
                <div className="flex-1 min-w-0">
                  <p className="text-white/60 text-sm truncate">{s.reason || 'Sin motivo'}</p>
                  <p className="text-white/25 text-xs">{s.date} · {hhmm(s.start_time)}–{hhmm(s.end_time)}</p>
                </div>
                <span className="text-white/25 text-xs font-head flex-shrink-0">
                  {s.cockpit_id ? `Campo ${s.cockpit_id}` : 'Todos'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Timeline fullscreen overlay */}
      {timelineExp && (
        <div className="fixed inset-0 bg-[#060606]/98 backdrop-blur-sm z-50 flex flex-col p-6 overflow-hidden">
          <div className="flex items-center justify-between mb-4 flex-shrink-0">
            <div>
              <h2 className="font-head font-bold text-xl text-white">Timeline de hoy</h2>
              <p className="text-white/30 text-sm capitalize">{format(new Date(), "EEEE, d 'de' MMMM", { locale: es })}</p>
            </div>
            <button onClick={() => setTimelineExp(false)}
              className="flex items-center gap-2 text-sm font-head uppercase tracking-wider border border-white/10 text-white/40 hover:border-white/30 hover:text-white px-4 py-2 rounded transition-all">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4">
                <path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3"/>
              </svg>
              Cerrar
            </button>
          </div>
          <div className="bg-[#111] border border-white/[0.07] rounded-lg p-6 flex-1 flex flex-col overflow-hidden">
            <Timeline bookings={bookings} blockedSlots={todayBlocked} loading={false} onSelect={b => setSelectedBkg(b)} expanded />
          </div>
        </div>
      )}

      {/* Booking quick modal */}
      {selectedBkg && (
        <BookingQuickModal
          booking={selectedBkg}
          onClose={() => setSelectedBkg(null)}
          onCheckin={() => updateCheckin(selectedBkg.id, true)}
          onNoShow={() => updateCheckin(selectedBkg.id, false)}
          onReset={() => resetCheckin(selectedBkg.id)}
        />
      )}

      {/* Create booking modal */}
      {showCreate && (
        <CreateBookingModal
          sessionTypes={sessionTypes}
          onClose={() => setShowCreate(false)}
          onCreated={load}
        />
      )}
    </div>
  )
}

// ── Demo data ─────────────────────────────────────────────────────
const DEMO_SESSION_TYPES: SessionType[] = [
  { id: 1, name: 'Individual 1h', duration_minutes: 60, price: 40, max_people: 1, color: '#FFD000' },
  { id: 2, name: 'Individual 30min', duration_minutes: 30, price: 25, max_people: 1, color: '#FFD000' },
  { id: 3, name: 'Duo 1h', duration_minutes: 60, price: 70, max_people: 2, color: '#8B5CF6' },
  { id: 4, name: 'Grupal 2h', duration_minutes: 120, price: 100, max_people: 8, color: '#F59E0B' },
]

const DEMO_BOOKINGS: Booking[] = [
  { id:'1', cockpit_ids:[1], session_type_id:1, customer_name:'Carlos García', customer_email:'carlos@demo.com', customer_phone:'+34 600 111 222', num_people:1, date:today, start_time:'11:00', end_time:'12:00', status:'confirmed', checked_in:true, notes:null, created_at:'', session_type:DEMO_SESSION_TYPES[0] },
  { id:'2', cockpit_ids:[3,4,5], session_type_id:3, customer_name:'Ana Martínez', customer_email:'ana@demo.com', customer_phone:'+34 600 333 444', num_people:3, date:today, start_time:'14:00', end_time:'15:00', status:'confirmed', checked_in:null, notes:'Cumpleaños', created_at:'', session_type:DEMO_SESSION_TYPES[2] },
  { id:'3', cockpit_ids:[2], session_type_id:2, customer_name:'Pedro López', customer_email:'pedro@demo.com', customer_phone:'', num_people:1, date:today, start_time:'16:30', end_time:'17:00', status:'no_show', checked_in:false, notes:null, created_at:'', session_type:DEMO_SESSION_TYPES[1] },
  { id:'4', cockpit_ids:[1,2], session_type_id:3, customer_name:'Equipo Fenix', customer_email:'fenix@demo.com', customer_phone:'', num_people:2, date:today, start_time:'19:00', end_time:'20:00', status:'confirmed', checked_in:null, notes:null, created_at:'', session_type:DEMO_SESSION_TYPES[2] },
]

const DEMO_BLOCKED: BlockedSlot[] = [
  { id:'b1', cockpit_id:null, date:today, start_time:'22:00', end_time:'23:30', reason:'Mantenimiento general' },
  { id:'b2', cockpit_id:2, date:format(subDays(new Date(), -1), 'yyyy-MM-dd'), start_time:'14:00', end_time:'16:00', reason:'Revisión cockpit 2' },
]

function generateDemoChart(period: Period): Booking[] {
  const now = new Date()
  if (period === 'day') {
    const slots = [
      { h: 11, price: 40, name: 'Individual 1h' },
      { h: 12, price: 70, name: 'Duo 1h' },
      { h: 14, price: 40, name: 'Individual 1h' },
      { h: 16, price: 25, name: 'Individual 30min' },
      { h: 17, price: 100, name: 'Premium 2h' },
      { h: 19, price: 70, name: 'Duo 1h' },
      { h: 20, price: 40, name: 'Individual 1h' },
    ]
    return slots.map((s, i) => ({
      id: `dd-${i}`, cockpit_ids: [(i % 8) + 1], session_type_id: (i % 4) + 1,
      customer_name: 'Demo', customer_email: 'demo@test.com', customer_phone: '',
      num_people: 1, date: today,
      start_time: `${String(s.h).padStart(2,'0')}:00`,
      end_time:   `${String(s.h + 1).padStart(2,'0')}:00`,
      status: 'confirmed', checked_in: null, notes: null, created_at: '',
      session_type: { id: (i % 4) + 1, name: s.name, duration_minutes: 60, price: s.price, max_people: 1, color: '#FFD000' },
    }))
  }
  const range = period === 'week' ? 7 : period === 'month' ? 30 : 365
  const patterns = [0, 2, 1, 3, 1, 2, 0, 3, 1, 2, 1, 0, 3, 2]
  const prices   = [40, 25, 70, 100, 30, 40, 70]
  const result: Booking[] = []

  for (let d = range - 1; d >= 0; d--) {
    const date  = format(subDays(now, d), 'yyyy-MM-dd')
    const count = patterns[d % patterns.length]
    for (let i = 0; i < count; i++) {
      const price = prices[(d + i) % prices.length]
      result.push({
        id: `dc${d}-${i}`,
        cockpit_ids: [((d + i) % 8) + 1],
        session_type_id: (i % 4) + 1,
        customer_name: 'Demo',
        customer_email: 'demo@test.com',
        customer_phone: '',
        num_people: 1,
        date,
        start_time: `${11 + i}:00`,
        end_time: `${12 + i}:00`,
        status: 'confirmed',
        checked_in: null,
        notes: null,
        created_at: '',
        session_type: { id: 1, name: DEMO_SESSION_TYPES[i % 4].name, duration_minutes: 60, price, max_people: 1, color: '#FFD000' },
      })
    }
  }
  return result
}
