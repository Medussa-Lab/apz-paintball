'use client'
import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Booking, BookingStatus, BlockedSlot } from '@/lib/types'
import { format, startOfWeek, addDays, eachDayOfInterval, isSameDay } from 'date-fns'
import { es } from 'date-fns/locale'

// ── Event colors ──────────────────────────────────────────────────
const EVENT_COLORS = ['#0066FF', '#8B5CF6', '#F59E0B', '#10B981', '#EF4444', '#EC4899']

interface CalendarEvent {
  id:           string
  title:        string
  date:         string  // yyyy-MM-dd
  time?:        string  // HH:mm
  description?: string
  color:        string
}

// ── Constants ─────────────────────────────────────────────────────
const COCKPIT_COLORS: Record<number, string> = {
  1: '#F59E0B', 2: '#8B5CF6', 3: '#0066FF',
  4: '#3B82F6', 5: '#0EA5E9', 6: '#06B6D4', 7: '#00AACC', 8: '#3385FF',
}
const STATUS_COLORS: Record<BookingStatus, string> = {
  confirmed: 'bg-success/10 text-success border-success/30',
  cancelled:  'bg-danger/10 text-danger border-danger/30',
  blocked:    'bg-white/5 text-white/40 border-white/10',
  no_show:    'bg-warn/10 text-warn border-warn/30',
}
const STATUS_LABELS: Record<BookingStatus, string> = {
  confirmed: 'Confirmado',
  cancelled:  'Cancelado',
  blocked:    'Bloqueado',
  no_show:    'No presentado',
}

// Timeline: 10:00 → 01:00 (+1 day) = 15 hours
const HOUR_PX   = 64          // px per hour
const TL_START  = 10 * 60    // 600 mins
const TL_RANGE  = 15 * 60    // 900 mins
const TL_HEIGHT = 15 * HOUR_PX  // 960px
const TL_HOURS  = [10,11,12,13,14,15,16,17,18,19,20,21,22,23,0,1]

// ── Helpers ───────────────────────────────────────────────────────
function hhmm(t: string) { return t ? t.slice(0, 5) : '' }

function toMins(t: string): number {
  const [h, m] = hhmm(t).split(':').map(Number)
  return h * 60 + m
}

function tlTop(t: string): number {
  let m = toMins(t) - TL_START
  if (m < 0) m += 1440
  return Math.max(0, (m / 60) * HOUR_PX)
}

function tlHeight(start: string, end: string): number {
  let sm = toMins(start)
  let em = toMins(end)
  if (em <= sm) em += 1440
  return Math.max(20, ((em - sm) / 60) * HOUR_PX)
}

function cockpitLabel(ids: number[]): string {
  if (!Array.isArray(ids) || ids.length === 0) return '—'
  if (ids.length === 1) return `C${ids[0]}`
  return ids.map(id => `C${id}`).join(', ')
}

function primaryColor(ids: number[]): string {
  if (!Array.isArray(ids) || ids.length === 0) return '#0066FF'
  return COCKPIT_COLORS[ids[0]] || '#0066FF'
}

// ── Overlap layout ────────────────────────────────────────────────
interface LayoutBooking extends Booking {
  _left:  number
  _width: number
}

function layoutDay(bookings: Booking[]): LayoutBooking[] {
  if (!bookings.length) return []
  const sorted = [...bookings].sort((a, b) => toMins(a.start_time) - toMins(b.start_time))
  const colEnds: number[] = []
  const assignments: number[] = []

  for (const b of sorted) {
    const sm = toMins(b.start_time)
    let em = toMins(b.end_time)
    if (em <= sm) em += 1440

    let col = colEnds.findIndex(end => end <= sm)
    if (col === -1) { col = colEnds.length; colEnds.push(em) }
    else colEnds[col] = em
    assignments.push(col)
  }

  const totalCols = colEnds.length
  return sorted.map((b, i) => ({
    ...b,
    _left:  assignments[i] / totalCols,
    _width: 1 / totalCols,
  }))
}

// ── Booking detail modal ──────────────────────────────────────────
function BookingModal({
  booking,
  onClose,
  onUpdate,
}: {
  booking: Booking
  onClose:  () => void
  onUpdate: (id: string, patch: Partial<Booking>) => void
}) {
  const b = booking
  const color = primaryColor(b.cockpit_ids)

  const rows: [string, string][] = [
    ['Fecha',     b.date],
    ['Horario',   `${hhmm(b.start_time)} – ${hhmm(b.end_time)}`],
    ['Cockpits',  cockpitLabel(b.cockpit_ids)],
    ['Sesión',    b.session_type?.name || `#${b.session_type_id}`],
    ['Cliente',   b.customer_name],
    ['Email',     b.customer_email],
    ['Teléfono',  b.customer_phone || '—'],
    ['Personas',  String(b.num_people)],
    ['Notas',     b.notes || '—'],
  ]

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#111] border border-white/[0.1] rounded-xl w-full max-w-md shadow-[0_24px_80px_rgba(0,0,0,0.8)]"
        onClick={e => e.stopPropagation()}
      >
        {/* Color bar */}
        <div className="h-1 rounded-t-xl" style={{ background: color }} />

        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-head font-bold text-lg text-white">{b.customer_name}</h3>
              <p className="text-white/30 text-xs mt-0.5">#{(b.reference || b.id.slice(-6)).toUpperCase()}</p>
            </div>
            <button
              onClick={onClose}
              className="w-7 h-7 flex items-center justify-center rounded text-white/25 hover:text-white hover:bg-white/5 transition-all"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>

          {/* Status */}
          <div className="mb-4 flex items-center gap-2">
            <span className={`text-xs px-2.5 py-1 rounded border ${STATUS_COLORS[b.status]}`}>
              {STATUS_LABELS[b.status]}
            </span>
            {b.checked_in === true && (
              <span className="text-xs px-2.5 py-1 rounded border border-success/40 bg-success/10 text-success">
                ✓ Asistió
              </span>
            )}
            {b.checked_in === false && (
              <span className="text-xs px-2.5 py-1 rounded border border-danger/30 bg-danger/10 text-danger/70">
                No show
              </span>
            )}
          </div>

          {/* Details */}
          <div className="space-y-0 text-sm mb-5">
            {rows.map(([k, v]) => (
              <div key={k} className="flex gap-4 py-2 border-b border-white/[0.05]">
                <span className="text-white/30 w-20 flex-shrink-0 text-xs">{k}</span>
                <span className="text-white/80 break-all text-xs">{v}</span>
              </div>
            ))}
          </div>

          {/* Actions */}
          {(b.status === 'confirmed' || b.status === 'no_show') && (
            <div className="flex gap-2 mb-3">
              <button
                onClick={() => onUpdate(b.id, { checked_in: true, status: 'confirmed' })}
                className={`flex-1 py-2 text-xs font-head font-semibold uppercase tracking-wider rounded border transition-all ${b.checked_in === true ? 'bg-success/20 border-success/50 text-success' : 'bg-success/5 border-success/20 text-success/50 hover:bg-success/15 hover:text-success'}`}
              >
                ✓ Asistió
              </button>
              <button
                onClick={() => onUpdate(b.id, { checked_in: false, status: 'no_show' })}
                className={`flex-1 py-2 text-xs font-head font-semibold uppercase tracking-wider rounded border transition-all ${b.checked_in === false ? 'bg-danger/20 border-danger/50 text-danger' : 'bg-danger/5 border-danger/20 text-danger/50 hover:bg-danger/15 hover:text-danger'}`}
              >
                ✗ No show
              </button>
              {b.checked_in !== null && b.checked_in !== undefined && (
                <button
                  onClick={() => onUpdate(b.id, { checked_in: null, status: 'confirmed' })}
                  className="px-3 py-2 text-xs font-head font-semibold uppercase tracking-wider rounded border border-white/10 text-white/30 hover:border-white/30 hover:text-white/60 transition-all"
                  title="Deshacer"
                >
                  ↩
                </button>
              )}
            </div>
          )}
          <div className="flex gap-2">
            {b.status === 'cancelled' && (
              <button
                onClick={() => onUpdate(b.id, { status: 'confirmed' })}
                className="flex-1 py-2 bg-success/10 border border-success/30 text-success text-xs font-head font-semibold uppercase tracking-wider rounded hover:bg-success/20 transition-all"
              >
                Confirmar
              </button>
            )}
            {b.status !== 'cancelled' && (
              <button
                onClick={() => onUpdate(b.id, { status: 'cancelled' })}
                className="flex-1 py-2 bg-danger/10 border border-danger/30 text-danger text-xs font-head font-semibold uppercase tracking-wider rounded hover:bg-danger/20 transition-all"
              >
                Cancelar
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Add Event Modal ────────────────────────────────────────────────
function AddEventModal({ onAdd, onClose }: {
  onAdd:   (e: CalendarEvent) => void
  onClose: () => void
}) {
  const [form, setForm] = useState({
    title: '', date: format(new Date(), 'yyyy-MM-dd'),
    time: '', description: '', color: EVENT_COLORS[0],
  })

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault()
    if (!form.title || !form.date) return
    onAdd({ id: Math.random().toString(36).slice(2), ...form })
    onClose()
  }

  const inp = "w-full bg-[#0a0a0a] border border-white/10 rounded px-3 py-2 text-white text-sm focus:border-blue focus:outline-none transition-all placeholder:text-white/20"

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-[#111] border border-white/[0.1] rounded-xl w-full max-w-sm shadow-[0_24px_80px_rgba(0,0,0,0.9)]" onClick={e => e.stopPropagation()}>
        <div className="h-0.5 rounded-t-xl" style={{ background: form.color }} />
        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-head font-bold text-base text-white">Nuevo evento</h3>
            <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded text-white/25 hover:text-white hover:bg-white/5 transition-all text-lg">×</button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="text-[0.65rem] font-head uppercase tracking-wider text-white/30 block mb-1">Título *</label>
              <input autoFocus type="text" value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required
                className={inp} placeholder="Nombre del evento" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[0.65rem] font-head uppercase tracking-wider text-white/30 block mb-1">Fecha *</label>
                <input type="date" value={form.date}
                  onChange={e => setForm(f => ({ ...f, date: e.target.value }))} required className={inp} />
              </div>
              <div>
                <label className="text-[0.65rem] font-head uppercase tracking-wider text-white/30 block mb-1">Hora</label>
                <input type="time" value={form.time}
                  onChange={e => setForm(f => ({ ...f, time: e.target.value }))} className={inp} />
              </div>
            </div>
            <div>
              <label className="text-[0.65rem] font-head uppercase tracking-wider text-white/30 block mb-1">Descripción</label>
              <textarea value={form.description} rows={2}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                className={`${inp} resize-none`} placeholder="Notas opcionales…" />
            </div>
            <div>
              <label className="text-[0.65rem] font-head uppercase tracking-wider text-white/30 block mb-2">Color</label>
              <div className="flex gap-2">
                {EVENT_COLORS.map(c => (
                  <button key={c} type="button" onClick={() => setForm(f => ({ ...f, color: c }))}
                    className={`w-6 h-6 rounded-full transition-all ${form.color === c ? 'ring-2 ring-white/50 ring-offset-1 ring-offset-[#111]' : 'opacity-50 hover:opacity-100'}`}
                    style={{ background: c }} />
                ))}
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <button type="button" onClick={onClose}
                className="flex-1 py-2 text-xs font-head uppercase tracking-wider rounded border border-white/10 text-white/30 hover:border-white/30 transition-all">
                Cancelar
              </button>
              <button type="submit"
                className="flex-1 py-2 text-xs font-head uppercase tracking-wider rounded bg-blue/20 border border-blue/40 text-blue hover:bg-blue/30 transition-all">
                Crear evento
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

type CalendarView = 'day' | '3days' | 'week'

// ── Main component ────────────────────────────────────────────────
export default function AdminCalendar() {
  const [viewMode,      setViewMode]      = useState<CalendarView>('week')
  const [viewStart,     setViewStart]     = useState(() =>
    startOfWeek(new Date(), { weekStartsOn: 1 })
  )
  const [bookings,      setBookings]      = useState<Booking[]>([])
  const [blockedSlots,  setBlockedSlots]  = useState<BlockedSlot[]>([])
  const [loading,       setLoading]       = useState(true)
  const [selected,      setSelected]      = useState<Booking | null>(null)
  const [nowMins,   setNowMins]   = useState(() => {
    const d = new Date(); return d.getHours() * 60 + d.getMinutes()
  })
  const [events,       setEvents]       = useState<CalendarEvent[]>([])
  const [eventView,    setEventView]    = useState<'list' | 'month'>('list')
  const [showAddEvent, setShowAddEvent] = useState(false)
  const [eventMonth,   setEventMonth]   = useState(() => new Date())
  const scrollRef = useRef<HTMLDivElement>(null)
  const supabase  = createClient()

  const viewDays  = viewMode === 'day' ? 1 : viewMode === '3days' ? 3 : 7
  const viewDaysArr = eachDayOfInterval({ start: viewStart, end: addDays(viewStart, viewDays - 1) })
  // keep old aliases for compat
  const weekDays = viewDaysArr
  const dateFrom = format(viewStart, 'yyyy-MM-dd')
  const dateTo   = format(addDays(viewStart, viewDays - 1), 'yyyy-MM-dd')
  const today    = new Date()
  const isCurrentPeriod = viewDaysArr.some(d => isSameDay(d, today))

  const navBack = () => setViewStart(d => addDays(d, -viewDays))
  const navFwd  = () => setViewStart(d => addDays(d, viewDays))
  const goToday = () => {
    if (viewMode === 'week') setViewStart(startOfWeek(new Date(), { weekStartsOn: 1 }))
    else setViewStart(new Date())
  }

  // keep old name for one compatibility line
  const isCurrentWeek = isCurrentPeriod

  // Update "now" every minute
  useEffect(() => {
    const id = setInterval(() => {
      const d = new Date()
      setNowMins(d.getHours() * 60 + d.getMinutes())
    }, 60_000)
    return () => clearInterval(id)
  }, [])

  // Auto-scroll to current time on load
  useEffect(() => {
    if (!isCurrentWeek || !scrollRef.current) return
    const nowOffset = nowMins - TL_START < 0 ? nowMins - TL_START + 1440 : nowMins - TL_START
    const scrollTo  = Math.max(0, (nowOffset / 60) * HOUR_PX - 120)
    scrollRef.current.scrollTop = scrollTo
  }, [loading, isCurrentWeek])

  const load = async () => {
    setLoading(true)
    const isConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://xxx.supabase.co'

    if (!isConfigured) {
      setBookings(DEMO)
      setLoading(false)
      return
    }
    try {
      const [bRes, stRes, bsRes] = await Promise.all([
        (supabase as any).from('bookings').select('*')
          .gte('date', dateFrom).lte('date', dateTo)
          .order('start_time'),
        (supabase as any).from('session_types').select('id,name,price'),
        (supabase as any).from('blocked_slots').select('*')
          .gte('date', dateFrom).lte('date', dateTo)
          .order('start_time'),
      ])
      const stMap: Record<number, { name: string; price: number }> = {}
      if (stRes.data) for (const st of stRes.data) stMap[st.id] = st
      const enriched = (bRes.data || []).map((b: any) => ({
        ...b, session_type: stMap[b.session_type_id] ?? null,
      }))
      setBookings(enriched)
      setBlockedSlots(bsRes.data || [])
    } catch (err) {
      console.error('Calendar load error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [viewStart, viewMode])

  // ── Persist events in localStorage ────────────────────────────────
  useEffect(() => {
    try { const s = localStorage.getItem('gz-events'); if (s) setEvents(JSON.parse(s)) } catch {}
  }, [])
  useEffect(() => {
    try { localStorage.setItem('gz-events', JSON.stringify(events)) } catch {}
  }, [events])

  const updateBooking = async (id: string, patch: Partial<Booking>) => {
    const isConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://xxx.supabase.co'
    setBookings(prev => prev.map(b => b.id === id ? { ...b, ...patch } : b))
    setSelected(prev => prev?.id === id ? { ...prev, ...patch } : prev)
    if (!isConfigured) return
    await (supabase as any).from('bookings').update(patch).eq('id', id)
  }

  // Week stats
  const confirmed  = bookings.filter(b => b.status === 'confirmed')
  const revenue    = confirmed.reduce((s, b) => s + (b.session_type?.price ?? 0), 0)
  const noShows    = bookings.filter(b => b.status === 'no_show' || b.checked_in === false).length
  const realRevenue = bookings
    .filter(b => b.checked_in === true)
    .reduce((s, b) => s + (b.session_type?.price ?? 0), 0)

  // Now indicator position
  const nowOffset  = nowMins - TL_START < 0 ? nowMins - TL_START + 1440 : nowMins - TL_START
  const nowTop     = (nowOffset / 60) * HOUR_PX
  const nowVisible = isCurrentWeek && nowOffset >= 0 && nowOffset <= TL_RANGE

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div>
          <h1 className="font-head font-bold text-2xl text-white">Calendario</h1>
          <p className="text-white/30 text-xs mt-0.5 capitalize">
            {viewDays === 1
              ? format(viewStart, "EEEE, d 'de' MMMM yyyy", { locale: es })
              : `${format(viewStart, "d 'de' MMMM", { locale: es })} – ${format(addDays(viewStart, viewDays - 1), "d 'de' MMMM yyyy", { locale: es })}`}
          </p>
        </div>

        {/* Week stats */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-4 px-4 py-2 bg-[#111] border border-white/[0.07] rounded-lg">
            <div className="text-center">
              <p className="text-white/25 text-[0.6rem] font-head uppercase tracking-wider">Reservas</p>
              <p className="font-head font-bold text-white text-sm">{confirmed.length}</p>
            </div>
            <div className="w-px h-6 bg-white/[0.07]" />
            <div className="text-center">
              <p className="text-white/25 text-[0.6rem] font-head uppercase tracking-wider">Estimado</p>
              <p className="font-head font-bold text-blue text-sm">€{revenue}</p>
            </div>
            {realRevenue > 0 && (
              <>
                <div className="w-px h-6 bg-white/[0.07]" />
                <div className="text-center">
                  <p className="text-white/25 text-[0.6rem] font-head uppercase tracking-wider">Real</p>
                  <p className="font-head font-bold text-success text-sm">€{realRevenue}</p>
                </div>
              </>
            )}
            {noShows > 0 && (
              <>
                <div className="w-px h-6 bg-white/[0.07]" />
                <div className="text-center">
                  <p className="text-white/25 text-[0.6rem] font-head uppercase tracking-wider">No shows</p>
                  <p className="font-head font-bold text-warn text-sm">{noShows}</p>
                </div>
              </>
            )}
          </div>

          {/* View mode selector */}
          <div className="flex items-center rounded border border-white/10 overflow-hidden">
            {([['day', 'Hoy'], ['3days', '3 días'], ['week', 'Semana']] as [CalendarView, string][]).map(([mode, label]) => (
              <button
                key={mode}
                onClick={() => { setViewMode(mode); if (mode === 'week') setViewStart(startOfWeek(new Date(), { weekStartsOn: 1 })); else setViewStart(new Date()) }}
                className={`text-xs font-head uppercase tracking-wider px-3 py-1.5 transition-all border-r border-white/10 last:border-r-0 ${viewMode === mode ? 'bg-blue/20 text-blue' : 'text-white/30 hover:text-white/60'}`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-1.5">
            <button onClick={navBack}
              className="w-8 h-8 rounded border border-white/10 text-white/40 hover:border-blue hover:text-blue transition-all flex items-center justify-center"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <path d="M15 18l-6-6 6-6"/>
              </svg>
            </button>
            <button onClick={goToday}
              className={`text-xs font-head uppercase tracking-wider px-3 py-1.5 rounded border transition-all ${
                isCurrentPeriod
                  ? 'border-blue/40 text-blue bg-blue/10'
                  : 'border-white/10 text-white/30 hover:border-blue hover:text-blue'
              }`}
            >
              Hoy
            </button>
            <button onClick={navFwd}
              className="w-8 h-8 rounded border border-white/10 text-white/40 hover:border-blue hover:text-blue transition-all flex items-center justify-center"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Calendar grid */}
      {loading ? (
        <div className="h-[500px] skeleton bg-white/5 rounded-lg" />
      ) : (
        <div className="bg-[#111] border border-white/[0.07] rounded-lg overflow-hidden flex flex-col">
          {/* Day headers — sticky */}
          <div
            className="grid border-b border-white/[0.07] bg-[#111] flex-shrink-0"
            style={{ gridTemplateColumns: `52px repeat(${viewDays}, 1fr)` }}
          >
            <div className="border-r border-white/[0.04]" />
            {weekDays.map(day => {
              const isToday  = isSameDay(day, today)
              const dayStr   = format(day, 'yyyy-MM-dd')
              const dayCount = bookings.filter(b => b.date === dayStr && b.status === 'confirmed').length
              return (
                <div
                  key={day.toISOString()}
                  className={`text-center py-3 border-l border-white/[0.04] ${isToday ? 'bg-blue/[0.04]' : ''}`}
                >
                  <p className={`text-[0.65rem] font-head font-semibold uppercase tracking-wider ${isToday ? 'text-blue' : 'text-white/25'}`}>
                    {format(day, 'EEE', { locale: es })}
                  </p>
                  <p className={`text-xl font-head font-bold mt-0.5 leading-none ${isToday ? 'text-blue' : 'text-white/60'}`}>
                    {format(day, 'd')}
                  </p>
                  {dayCount > 0 && (
                    <p className="text-[0.55rem] font-head text-white/20 mt-1">
                      {dayCount} res.
                    </p>
                  )}
                </div>
              )
            })}
          </div>

          {/* Scrollable body */}
          <div ref={scrollRef} className="overflow-y-auto overflow-x-auto" style={{ height: 'calc(100vh - 260px)' }}>
            <div style={{ minWidth: 560 }}>
              <div
                className="grid relative"
                style={{ gridTemplateColumns: `52px repeat(${viewDays}, 1fr)` }}
              >
                {/* Time axis */}
                <div className="border-r border-white/[0.04] relative" style={{ height: TL_HEIGHT }}>
                  {TL_HOURS.map((h, i) => (
                    <div
                      key={i}
                      className="absolute right-2 text-[0.6rem] text-white/20 font-body"
                      style={{ top: i * HOUR_PX, transform: i === 0 ? 'translateY(3px)' : 'translateY(-50%)' }}
                    >
                      {String(h).padStart(2, '0')}h
                    </div>
                  ))}
                </div>

                {/* Day columns */}
                {weekDays.map(day => {
                  const isToday = isSameDay(day, today)
                  const dateStr = format(day, 'yyyy-MM-dd')
                  const dayBookings = bookings.filter(b => b.date === dateStr)
                  const dayBlocked  = blockedSlots.filter(s => s.date === dateStr)
                  const laid = layoutDay(dayBookings)

                  return (
                    <div
                      key={day.toISOString()}
                      className={`border-l border-white/[0.04] relative ${isToday ? 'bg-blue/[0.015]' : ''}`}
                      style={{ height: TL_HEIGHT }}
                    >
                      {/* Hour grid lines */}
                      {TL_HOURS.map((_, i) => (
                        <div
                          key={i}
                          className="absolute left-0 right-0 border-t border-white/[0.035]"
                          style={{ top: i * HOUR_PX }}
                        />
                      ))}
                      {/* Half-hour lines */}
                      {TL_HOURS.map((_, i) => (
                        <div
                          key={`h${i}`}
                          className="absolute left-0 right-0 border-t border-white/[0.015]"
                          style={{ top: i * HOUR_PX + HOUR_PX / 2 }}
                        />
                      ))}

                      {/* Now indicator */}
                      {nowVisible && isToday && (
                        <div
                          className="absolute left-0 right-0 z-20 pointer-events-none"
                          style={{ top: nowTop }}
                        >
                          <div className="relative flex items-center">
                            <div className="w-2 h-2 rounded-full bg-blue flex-shrink-0 -ml-1" />
                            <div className="flex-1 h-px bg-blue/70" />
                          </div>
                        </div>
                      )}

                      {/* Blocked slot overlays */}
                      {dayBlocked.map(s => {
                        const top    = tlTop(s.start_time)
                        const height = tlHeight(s.start_time, s.end_time)
                        return (
                          <div
                            key={s.id}
                            className="absolute left-0 right-0 z-[3]"
                            style={{
                              top: top + 1, height: height - 2,
                              background: 'repeating-linear-gradient(45deg,rgba(255,255,255,0.03),rgba(255,255,255,0.03) 2px,transparent 2px,transparent 8px)',
                              borderLeft: '2px solid rgba(255,255,255,0.15)',
                            }}
                            title={`Bloqueado: ${s.reason || 'Sin motivo'}${s.cockpit_id ? ` · C${s.cockpit_id}` : ' · Todos'}`}
                          >
                            <p className="text-[0.55rem] text-white/30 px-1.5 pt-1 truncate">{s.reason || 'Bloqueado'}{s.cockpit_id ? ` — C${s.cockpit_id}` : ''}</p>
                          </div>
                        )
                      })}

                      {/* Booking blocks */}
                      {laid.map(b => {
                        const top    = tlTop(b.start_time)
                        const height = tlHeight(b.start_time, b.end_time)
                        const color  = primaryColor(b.cockpit_ids)
                        const isCancelled = b.status === 'cancelled'
                        const isNoShow    = b.status === 'no_show' || b.checked_in === false
                        const isAttended  = b.checked_in === true
                        const blockColor  = isNoShow ? '#FF5050' : isAttended ? '#00FF88' : color

                        return (
                          <div
                            key={b.id}
                            className="absolute rounded cursor-pointer overflow-hidden group transition-all hover:z-10 hover:brightness-110"
                            style={{
                              top:    top + 1,
                              height: height - 2,
                              left:   `calc(${b._left * 100}% + 2px)`,
                              width:  `calc(${b._width * 100}% - 4px)`,
                              background: isCancelled
                                ? 'rgba(255,255,255,0.04)'
                                : `${blockColor}20`,
                              borderLeft: `2.5px solid ${isCancelled ? 'rgba(255,255,255,0.15)' : blockColor}`,
                              opacity: isCancelled ? 0.5 : 1,
                            }}
                            onClick={() => setSelected(b)}
                            title={`${b.customer_name} · ${hhmm(b.start_time)}–${hhmm(b.end_time)}`}
                          >
                            <div className="px-1.5 py-1 h-full flex flex-col justify-start overflow-hidden">
                              {height >= 28 && (
                                <p
                                  className="text-[0.6rem] font-head font-semibold leading-tight truncate"
                                  style={{ color: isCancelled ? 'rgba(255,255,255,0.2)' : blockColor }}
                                >
                                  {b.customer_name.split(' ')[0]}
                                </p>
                              )}
                              {height >= 44 && (
                                <p className="text-[0.55rem] font-body leading-tight opacity-60 truncate"
                                   style={{ color: isCancelled ? 'rgba(255,255,255,0.15)' : blockColor }}>
                                  {hhmm(b.start_time)}–{hhmm(b.end_time)}
                                </p>
                              )}
                              {height >= 60 && (
                                <p className="text-[0.52rem] font-body leading-tight opacity-50 truncate"
                                   style={{ color: isCancelled ? 'rgba(255,255,255,0.15)' : blockColor }}>
                                  {cockpitLabel(b.cockpit_ids)}
                                </p>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center gap-4 mt-3 flex-wrap">
        {[
          { color: '#0066FF', label: 'Confirmado' },
          { color: '#00FF88', label: 'Asistió' },
          { color: '#FF5050', label: 'No show' },
          { color: 'rgba(255,255,255,0.15)', label: 'Cancelado' },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <span
              className="w-3 h-3 rounded-sm border-l-2 flex-shrink-0"
              style={{ background: color + '30', borderColor: color }}
            />
            <span className="text-[0.65rem] text-white/30 font-body">{label}</span>
          </div>
        ))}
        <span className="text-[0.65rem] text-white/20 font-body ml-auto hidden sm:block">
          Click en una reserva para ver detalles
        </span>
      </div>

      {/* ── Events section ── */}
      <div className="mt-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-head font-bold text-lg text-white">Eventos</h2>
            <p className="text-white/25 text-xs mt-0.5">Notas, cierres, días especiales…</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center rounded border border-white/10 overflow-hidden">
              {(['list', 'month'] as const).map(v => (
                <button key={v} onClick={() => setEventView(v)}
                  className={`text-xs font-head uppercase tracking-wider px-3 py-1.5 transition-all border-r border-white/10 last:border-r-0 ${eventView === v ? 'bg-blue/20 text-blue' : 'text-white/30 hover:text-white/60'}`}>
                  {v === 'list' ? 'Lista' : 'Mes'}
                </button>
              ))}
            </div>
            <button onClick={() => setShowAddEvent(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-head uppercase tracking-wider rounded border border-blue/30 text-blue bg-blue/10 hover:bg-blue/20 transition-all">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5"><path d="M12 5v14M5 12h14"/></svg>
              Añadir
            </button>
          </div>
        </div>

        {eventView === 'list' ? (
          events.length === 0 ? (
            <div className="bg-[#111] border border-white/[0.07] rounded-lg px-6 py-10 text-center">
              <p className="text-white/20 text-sm font-head">No hay eventos. Crea el primero.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {[...events]
                .sort((a, b) => a.date.localeCompare(b.date) || (a.time || '').localeCompare(b.time || ''))
                .map(ev => (
                  <div key={ev.id} className="flex items-start gap-3 bg-[#111] border border-white/[0.07] rounded-lg px-4 py-3 group"
                    style={{ borderLeftColor: ev.color, borderLeftWidth: 3 }}>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-head font-semibold text-sm text-white truncate">{ev.title}</p>
                        {ev.time && <span className="text-[0.65rem] text-white/30 font-body">{ev.time}</span>}
                      </div>
                      <p className="text-[0.65rem] text-white/30 font-body mt-0.5">
                        {format(new Date(ev.date + 'T12:00:00'), "EEEE, d 'de' MMMM yyyy", { locale: es })}
                      </p>
                      {ev.description && (
                        <p className="text-xs text-white/40 font-body mt-1 line-clamp-2">{ev.description}</p>
                      )}
                    </div>
                    <button
                      onClick={() => setEvents(prev => prev.filter(e => e.id !== ev.id))}
                      className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded text-white/10 hover:text-danger opacity-0 group-hover:opacity-100 transition-all text-base leading-none">
                      ×
                    </button>
                  </div>
                ))}
            </div>
          )
        ) : (() => {
          const mStart  = new Date(eventMonth.getFullYear(), eventMonth.getMonth(), 1)
          const mEnd    = new Date(eventMonth.getFullYear(), eventMonth.getMonth() + 1, 0)
          const gStart  = startOfWeek(mStart, { weekStartsOn: 1 })
          const gEnd    = addDays(startOfWeek(mEnd, { weekStartsOn: 1 }), 6)
          const days    = eachDayOfInterval({ start: gStart, end: gEnd })
          const inMonth = (d: Date) => d.getMonth() === eventMonth.getMonth()
          return (
            <div className="bg-[#111] border border-white/[0.07] rounded-lg overflow-hidden">
              {/* Month nav */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.07]">
                <button
                  onClick={() => setEventMonth(m => new Date(m.getFullYear(), m.getMonth() - 1, 1))}
                  className="w-7 h-7 flex items-center justify-center rounded border border-white/10 text-white/40 hover:text-blue hover:border-blue transition-all">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M15 18l-6-6 6-6"/></svg>
                </button>
                <p className="font-head font-semibold text-sm text-white capitalize">
                  {format(eventMonth, "MMMM yyyy", { locale: es })}
                </p>
                <button
                  onClick={() => setEventMonth(m => new Date(m.getFullYear(), m.getMonth() + 1, 1))}
                  className="w-7 h-7 flex items-center justify-center rounded border border-white/10 text-white/40 hover:text-blue hover:border-blue transition-all">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M9 18l6-6-6-6"/></svg>
                </button>
              </div>
              {/* DOW headers */}
              <div className="grid grid-cols-7 border-b border-white/[0.07]">
                {['L','M','X','J','V','S','D'].map(d => (
                  <div key={d} className="text-center py-2 text-[0.6rem] font-head uppercase tracking-wider text-white/25">{d}</div>
                ))}
              </div>
              {/* Day cells */}
              <div className="grid grid-cols-7">
                {days.map(day => {
                  const ds       = format(day, 'yyyy-MM-dd')
                  const dayEvs   = events.filter(e => e.date === ds)
                  const isToday_ = isSameDay(day, today)
                  return (
                    <div key={ds}
                      className={`min-h-[72px] border-r border-b border-white/[0.05] p-1.5 ${isToday_ ? 'bg-blue/[0.06]' : ''} ${!inMonth(day) ? 'opacity-25' : ''}`}>
                      <p className={`text-[0.65rem] font-head font-semibold leading-none mb-1.5 ${isToday_ ? 'text-blue' : 'text-white/40'}`}>
                        {format(day, 'd')}
                      </p>
                      <div className="space-y-0.5">
                        {dayEvs.slice(0, 3).map(ev => (
                          <div key={ev.id} className="flex items-center gap-1 group/ev cursor-default">
                            <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: ev.color }} />
                            <p className="text-[0.55rem] font-head truncate leading-tight flex-1" style={{ color: ev.color }}>
                              {ev.title}
                            </p>
                            <button
                              onClick={() => setEvents(prev => prev.filter(e => e.id !== ev.id))}
                              className="text-[0.6rem] text-white/0 hover:text-danger group-hover/ev:text-white/20 transition-colors leading-none flex-shrink-0">
                              ×
                            </button>
                          </div>
                        ))}
                        {dayEvs.length > 3 && (
                          <p className="text-[0.55rem] text-white/20 font-body">+{dayEvs.length - 3} más</p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })()}
      </div>

      {/* Add event modal */}
      {showAddEvent && (
        <AddEventModal
          onAdd={ev => setEvents(prev => [...prev, ev])}
          onClose={() => setShowAddEvent(false)}
        />
      )}

      {/* Detail modal */}
      {selected && (
        <BookingModal
          booking={selected}
          onClose={() => setSelected(null)}
          onUpdate={(id, patch) => updateBooking(id, patch)}
        />
      )}
    </div>
  )
}

// ── Demo data ─────────────────────────────────────────────────────
const _today = format(new Date(), 'yyyy-MM-dd')
const _mon   = format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd')
const _tue   = format(addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), 1), 'yyyy-MM-dd')
const _wed   = format(addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), 2), 'yyyy-MM-dd')
const _fri   = format(addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), 4), 'yyyy-MM-dd')
const _sat   = format(addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), 5), 'yyyy-MM-dd')

const DEMO: Booking[] = [
  { id:'d1', cockpit_ids:[1], session_type_id:1, customer_name:'Carlos García', customer_email:'carlos@demo.com', customer_phone:'+34 600 111 222', num_people:1, date:_today, start_time:'11:00', end_time:'12:00', status:'confirmed', checked_in:true, notes:null, created_at:'', session_type:{id:1,name:'Individual 1h',duration_minutes:60,price:40,max_people:1,color:'#0066FF'} },
  { id:'d2', cockpit_ids:[3,4,5], session_type_id:3, customer_name:'Ana Martínez', customer_email:'ana@demo.com', customer_phone:'+34 600 333 444', num_people:3, date:_today, start_time:'14:00', end_time:'15:00', status:'confirmed', checked_in:null, notes:'Cumpleaños', created_at:'', session_type:{id:3,name:'Grupal 1h',duration_minutes:60,price:30,max_people:8,color:'#8B5CF6'} },
  { id:'d3', cockpit_ids:[2], session_type_id:1, customer_name:'Pedro López', customer_email:'pedro@demo.com', customer_phone:'', num_people:1, date:_today, start_time:'16:30', end_time:'17:00', status:'no_show', checked_in:false, notes:null, created_at:'', session_type:{id:1,name:'Individual 30min',duration_minutes:30,price:25,max_people:1,color:'#0066FF'} },
  { id:'d4', cockpit_ids:[1,2], session_type_id:2, customer_name:'Equipo Fenix', customer_email:'fenix@demo.com', customer_phone:'', num_people:2, date:_today, start_time:'19:00', end_time:'20:00', status:'confirmed', checked_in:null, notes:null, created_at:'', session_type:{id:2,name:'Duo 1h',duration_minutes:60,price:70,max_people:2,color:'#8B5CF6'} },
  { id:'d5', cockpit_ids:[1], session_type_id:1, customer_name:'Mario Rossi', customer_email:'mario@demo.com', customer_phone:'', num_people:1, date:_tue, start_time:'12:00', end_time:'13:00', status:'confirmed', checked_in:null, notes:null, created_at:'', session_type:{id:1,name:'Individual 1h',duration_minutes:60,price:40,max_people:1,color:'#0066FF'} },
  { id:'d6', cockpit_ids:[3], session_type_id:1, customer_name:'Lucía Torres', customer_email:'lucia@demo.com', customer_phone:'', num_people:1, date:_wed, start_time:'17:00', end_time:'18:00', status:'cancelled', checked_in:null, notes:null, created_at:'', session_type:{id:1,name:'Individual 1h',duration_minutes:60,price:40,max_people:1,color:'#0066FF'} },
  { id:'d7', cockpit_ids:[1,2,3,4,5,6,7,8], session_type_id:5, customer_name:'Empresa Acme S.L.', customer_email:'biz@demo.com', customer_phone:'+34 600 777 888', num_people:20, date:_sat, start_time:'18:00', end_time:'20:00', status:'confirmed', checked_in:null, notes:'Team building', created_at:'', session_type:{id:5,name:'Evento Premium',duration_minutes:120,price:500,max_people:50,color:'#F59E0B'} },
  { id:'d8', cockpit_ids:[2], session_type_id:1, customer_name:'Sergio Blanco', customer_email:'sergio@demo.com', customer_phone:'', num_people:1, date:_fri, start_time:'11:30', end_time:'12:00', status:'confirmed', checked_in:null, notes:null, created_at:'', session_type:{id:1,name:'Individual 30min',duration_minutes:30,price:25,max_people:1,color:'#0066FF'} },
]
