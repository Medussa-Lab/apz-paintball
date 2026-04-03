'use client'
import { useState, useEffect } from 'react'
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, addDays } from 'date-fns'
import { createClient } from '@/lib/supabase/client'
import type { Booking, BookingStatus, SessionType } from '@/lib/types'

// ── Constants ────────────────────────────────────────────────────────────────
const today = format(new Date(), 'yyyy-MM-dd')
const COCKPIT_IDS    = [1, 2, 3, 4, 5, 6, 7, 8]
const COCKPIT_COLORS = ['#F59E0B', '#8B5CF6', '#FFD000', '#3B82F6', '#0EA5E9', '#06B6D4', '#00AACC', '#3385FF']
const COCKPIT_NAMES  = ['Motion', 'Triple Pro', 'Std 1', 'Std 2', 'Std 3', 'Std 4', 'Std 5', 'Std 6']

const STATUS_COLORS: Record<BookingStatus, string> = {
  confirmed: 'bg-success/10 text-success border-success/30',
  cancelled: 'bg-danger/10 text-danger border-danger/30',
  blocked:   'bg-white/5 text-white/40 border-white/10',
  no_show:   'bg-warn/10 text-warn border-warn/30',
}
const STATUS_LABELS: Record<BookingStatus, string> = {
  confirmed: 'Confirmado',
  cancelled: 'Cancelado',
  blocked:   'Bloqueado',
  no_show:   'No presentado',
}

function cockpitLabel(cockpit_ids: number[]): string {
  if (!Array.isArray(cockpit_ids) || cockpit_ids.length === 0) return '—'
  if (cockpit_ids.length === 1) return `C${cockpit_ids[0]}`
  return cockpit_ids.map(id => `Campo ${id}`).join(', ')
}

// ── Create Booking Modal ─────────────────────────────────────────────────────
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
    if (!form.name || !form.email || !form.phone || !form.date || !form.startTime || !form.endTime || !form.sessionTypeId || form.cockpits.length === 0) {
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

            <div>
              <label className="text-[0.65rem] font-head uppercase tracking-wider text-white/30 block mb-2">Campos * (selecciona al menos uno)</label>
              <div className="flex flex-wrap gap-2">
                {COCKPIT_IDS.map((id, ci) => (
                  <button key={id} type="button" onClick={() => toggleCockpit(id)}
                    className={`px-3 py-1.5 rounded border text-xs font-head font-semibold transition-all ${
                      form.cockpits.includes(id) ? 'border-opacity-60 text-white' : 'border-white/10 text-white/30 hover:border-white/20'
                    }`}
                    style={form.cockpits.includes(id)
                      ? { borderColor: COCKPIT_COLORS[ci], background: COCKPIT_COLORS[ci] + '20', color: COCKPIT_COLORS[ci] }
                      : {}}>
                    C{id} {COCKPIT_NAMES[ci]}
                  </button>
                ))}
              </div>
            </div>

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
                <label className="text-[0.65rem] font-head uppercase tracking-wider text-white/30 block mb-1">Teléfono *</label>
                <input type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  required placeholder="+34 600 000 000" className={inputCls} />
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
                rows={2} placeholder="Observaciones, cumpleaños, corporativo…" className={inputCls + ' resize-none'} />
            </div>

            {error && <p className="text-danger text-xs">{error}</p>}

            <div className="flex gap-3 pt-1">
              <button type="button" onClick={onClose}
                className="flex-1 py-2.5 text-sm font-head font-semibold uppercase tracking-wider rounded border border-white/10 text-white/40 hover:text-white/70 hover:border-white/20 transition-all">
                Cancelar
              </button>
              <button type="submit" disabled={loading}
                className="flex-1 py-2.5 text-sm font-head font-semibold uppercase tracking-wider rounded bg-accent text-black hover:bg-accent/80 transition-all disabled:opacity-50">
                {loading ? 'Creando…' : 'Crear Reserva'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────
type DateRange = 'all' | 'today' | 'week' | 'month'
type AttendanceFilter = 'all' | 'yes' | 'no' | 'pending'

export default function AdminBookings() {
  const [bookings,      setBookings]      = useState<Booking[]>([])
  const [sessionTypes,  setSessionTypes]  = useState<SessionType[]>([])
  const [loading,       setLoading]       = useState(true)
  const [search,        setSearch]        = useState('')
  const [statusF,       setStatusF]       = useState<string>('all')
  const [dateRange,     setDateRange]     = useState<DateRange>('all')
  const [dateF,         setDateF]         = useState('')
  const [cockpitF,      setCockpitF]      = useState<number | 'all'>('all')
  const [peopleF,       setPeopleF]       = useState<string>('all')
  const [attendanceF,   setAttendanceF]   = useState<AttendanceFilter>('all')
  const [selected,      setSelected]      = useState<Booking | null>(null)
  const [showCreate,    setShowCreate]    = useState(false)
  const supabase = createClient()

  // Load once on mount — all filtering is client-side
  const load = async () => {
    setLoading(true)
    const isConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://xxx.supabase.co'
    if (!isConfigured) { setBookings(DEMO); setLoading(false); return }

    const [{ data: bData }, { data: stData }] = await Promise.all([
      (supabase as any).from('bookings').select('*').order('date', { ascending: false }).order('start_time'),
      (supabase as any).from('session_types').select('id,name,price,color,duration_minutes,max_people'),
    ])

    const stMap: Record<number, any> = {}
    if (stData) for (const st of stData) stMap[st.id] = st
    if (stData) setSessionTypes(stData)

    const rows: Booking[] = (bData || []).map((b: any) => ({ ...b, session_type: stMap[b.session_type_id] ?? null }))
    setBookings(rows)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  // ── Optimistic mutations (no load() call) ──────────────────────────────────
  const applyOptimistic = (id: string, patch: Partial<Booking>) => {
    setBookings(prev => prev.map(x => x.id === id ? { ...x, ...patch } : x))
    setSelected(s => s?.id === id ? { ...s, ...patch } : s)
  }

  const updateStatus = async (id: string, status: BookingStatus) => {
    applyOptimistic(id, { status })
    const isConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://xxx.supabase.co'
    if (!isConfigured) return
    await (supabase as any).from('bookings').update({ status }).eq('id', id)
  }

  const updateCheckin = async (id: string, value: boolean) => {
    const patch = { checked_in: value, ...(value ? {} : { status: 'no_show' as BookingStatus }) }
    applyOptimistic(id, patch)
    const isConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://xxx.supabase.co'
    if (!isConfigured) return
    await (supabase as any).from('bookings').update(patch).eq('id', id)
  }

  const resetCheckin = async (id: string) => {
    const patch = { checked_in: null, status: 'confirmed' as BookingStatus }
    applyOptimistic(id, patch)
    const isConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://xxx.supabase.co'
    if (!isConfigured) return
    await (supabase as any).from('bookings').update(patch).eq('id', id)
  }

  // ── Date range helpers ─────────────────────────────────────────────────────
  const weekStart = format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd')
  const weekEnd   = format(endOfWeek(new Date(),   { weekStartsOn: 1 }), 'yyyy-MM-dd')
  const monthStart = format(startOfMonth(new Date()), 'yyyy-MM-dd')
  const monthEnd   = format(endOfMonth(new Date()),   'yyyy-MM-dd')

  // ── Client-side filtering ──────────────────────────────────────────────────
  const filtered = bookings.filter(b => {
    if (search) {
      const q = search.toLowerCase()
      if (!b.customer_name.toLowerCase().includes(q) &&
          !b.customer_email.toLowerCase().includes(q) &&
          !b.id.toLowerCase().includes(q)) return false
    }
    if (statusF !== 'all' && b.status !== statusF) return false

    // Date filter: quick range takes priority, then manual date input
    if (dateRange === 'today'  && b.date !== today)                       return false
    if (dateRange === 'week'   && (b.date < weekStart || b.date > weekEnd)) return false
    if (dateRange === 'month'  && (b.date < monthStart || b.date > monthEnd)) return false
    if (dateRange === 'all' && dateF && b.date !== dateF)                 return false

    if (cockpitF !== 'all' && !b.cockpit_ids.includes(cockpitF as number)) return false

    if (peopleF === '1'   && b.num_people !== 1)  return false
    if (peopleF === '2-4' && (b.num_people < 2 || b.num_people > 4)) return false
    if (peopleF === '5+'  && b.num_people < 5)    return false

    if (attendanceF === 'yes'     && b.checked_in !== true)  return false
    if (attendanceF === 'no'      && b.checked_in !== false) return false
    if (attendanceF === 'pending' && b.checked_in !== null && b.checked_in !== undefined) return false

    return true
  })

  const hasFilters = search || statusF !== 'all' || dateRange !== 'all' || dateF ||
    cockpitF !== 'all' || peopleF !== 'all' || attendanceF !== 'all'

  const clearFilters = () => {
    setSearch(''); setStatusF('all'); setDateRange('all'); setDateF('')
    setCockpitF('all'); setPeopleF('all'); setAttendanceF('all')
  }

  const exportCSV = () => {
    const cols = ['ID', 'Fecha', 'Hora', 'Cliente', 'Email', 'Teléfono', 'Campos', 'Tipo sesión', 'Personas', 'Estado']
    const rows = filtered.map(b => [
      b.id, b.date, `${b.start_time}–${b.end_time}`,
      b.customer_name, b.customer_email, b.customer_phone,
      cockpitLabel(b.cockpit_ids),
      b.session_type?.name || b.session_type_id,
      b.num_people, b.status,
    ])
    const csv = [cols, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n')
    const a   = document.createElement('a')
    a.href    = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
    a.download = `reservas-${Date.now()}.csv`
    a.click()
  }

  const selectCls = "bg-[#111] border border-white/10 rounded px-3 py-2 text-white text-sm focus:border-accent focus:outline-none transition-all"

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="font-head font-bold text-2xl text-white">Reservas</h1>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 text-sm font-head font-semibold uppercase tracking-wider px-4 py-2 bg-accent text-black rounded hover:bg-accent/80 transition-all duration-200"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Nueva Reserva
          </button>
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 text-sm font-head font-semibold uppercase tracking-wider px-4 py-2 border border-white/10 text-white/50 rounded hover:border-accent hover:text-accent transition-all duration-200"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-3.5 h-3.5">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
            </svg>
            Exportar CSV
          </button>
        </div>
      </div>

      {/* Quick date range buttons */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        {(['all', 'today', 'week', 'month'] as DateRange[]).map(r => (
          <button
            key={r}
            onClick={() => { setDateRange(r); if (r !== 'all') setDateF('') }}
            className={`text-xs font-head font-semibold uppercase tracking-wider px-3 py-1.5 rounded border transition-all ${
              dateRange === r
                ? 'border-accent bg-accent/10 text-accent'
                : 'border-white/10 text-white/30 hover:border-white/20 hover:text-white/50'
            }`}
          >
            {r === 'all' ? 'Todas' : r === 'today' ? 'Hoy' : r === 'week' ? 'Esta semana' : 'Este mes'}
          </button>
        ))}
      </div>

      {/* Filters row */}
      <div className="flex flex-wrap gap-2 mb-6">
        <input
          type="text"
          placeholder="Buscar nombre, email, ID…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="bg-[#111] border border-white/10 rounded px-3 py-2 text-white text-sm focus:border-accent focus:outline-none transition-all min-w-[180px] flex-1 max-w-xs placeholder:text-white/20"
        />
        <select value={statusF} onChange={e => setStatusF(e.target.value)} className={selectCls}>
          <option value="all">Todos los estados</option>
          <option value="confirmed">Confirmado</option>
          <option value="cancelled">Cancelado</option>
          <option value="no_show">No presentado</option>
        </select>
        <select value={String(cockpitF)} onChange={e => setCockpitF(e.target.value === 'all' ? 'all' : Number(e.target.value))} className={selectCls}>
          <option value="all">Todos los campos</option>
          {COCKPIT_IDS.map((id, ci) => (
            <option key={id} value={id}>C{id} {COCKPIT_NAMES[ci]}</option>
          ))}
        </select>
        <select value={peopleF} onChange={e => setPeopleF(e.target.value)} className={selectCls}>
          <option value="all">Cualquier nº personas</option>
          <option value="1">1 persona</option>
          <option value="2-4">2–4 personas</option>
          <option value="5+">5+ personas</option>
        </select>
        <select value={attendanceF} onChange={e => setAttendanceF(e.target.value as AttendanceFilter)} className={selectCls}>
          <option value="all">Cualquier asistencia</option>
          <option value="yes">Asistió</option>
          <option value="no">No show</option>
          <option value="pending">Pendiente</option>
        </select>
        {dateRange === 'all' && (
          <input
            type="date"
            value={dateF}
            onChange={e => setDateF(e.target.value)}
            className={selectCls}
          />
        )}
        {hasFilters && (
          <button onClick={clearFilters} className="text-sm text-white/30 hover:text-white/60 transition-colors px-2">
            Limpiar
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-[#111] border border-white/[0.07] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.07]">
                {['Fecha', 'Hora', 'Cliente', 'Campos', 'Tipo', 'Personas', 'Estado', 'Asistencia', 'Acciones'].map(h => (
                  <th key={h} className="text-left text-[0.65rem] font-head font-semibold uppercase tracking-wider text-white/25 px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}><td colSpan={9} className="px-4 py-3"><div className="h-4 skeleton bg-white/5 rounded" /></td></tr>
                ))
              ) : filtered.length === 0 ? (
                <tr><td colSpan={9} className="px-4 py-10 text-center text-white/25 text-sm">Sin resultados</td></tr>
              ) : (
                filtered.map(b => (
                  <tr key={b.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] cursor-pointer transition-colors" onClick={() => setSelected(b)}>
                    <td className="px-4 py-3 text-sm text-white/70">{b.date}</td>
                    <td className="px-4 py-3 text-sm text-white/70 whitespace-nowrap">{b.start_time.slice(0,5)}–{b.end_time.slice(0,5)}</td>
                    <td className="px-4 py-3 text-sm text-white font-medium">{b.customer_name}</td>
                    <td className="px-4 py-3 text-sm text-white/50 whitespace-nowrap">{cockpitLabel(b.cockpit_ids)}</td>
                    <td className="px-4 py-3 text-sm text-white/50">{b.session_type?.name || `#${b.session_type_id}`}</td>
                    <td className="px-4 py-3 text-sm text-white/50">{b.num_people}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded border whitespace-nowrap ${STATUS_COLORS[b.status]}`}>{STATUS_LABELS[b.status]}</span>
                    </td>
                    <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                      {b.status === 'confirmed' && b.checked_in == null && (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => updateCheckin(b.id, true)}
                            className="text-[0.65rem] font-head uppercase tracking-wider px-2 py-0.5 rounded border border-success/30 text-success/60 hover:bg-success/10 hover:text-success transition-all whitespace-nowrap"
                          >
                            ✓ Asistió
                          </button>
                          <button
                            onClick={() => updateCheckin(b.id, false)}
                            className="text-[0.65rem] font-head uppercase tracking-wider px-2 py-0.5 rounded border border-danger/20 text-danger/40 hover:bg-danger/10 hover:text-danger transition-all"
                          >
                            ✗
                          </button>
                        </div>
                      )}
                      {b.checked_in === true && (
                        <div className="flex items-center gap-1">
                          <span className="text-[0.65rem] font-head uppercase tracking-wider px-2 py-0.5 rounded border border-success/40 bg-success/10 text-success whitespace-nowrap">✓ Asistió</span>
                          <button onClick={() => resetCheckin(b.id)} title="Deshacer" className="w-5 h-5 flex items-center justify-center rounded border border-white/10 text-white/20 hover:border-white/30 hover:text-white/50 transition-all text-[0.65rem]">↩</button>
                        </div>
                      )}
                      {(b.checked_in === false || b.status === 'no_show') && b.checked_in !== true && (
                        <div className="flex items-center gap-1">
                          <span className="text-[0.65rem] font-head uppercase tracking-wider px-2 py-0.5 rounded border border-danger/30 bg-danger/10 text-danger/70 whitespace-nowrap">No show</span>
                          {b.status !== 'cancelled' && (
                            <button onClick={() => resetCheckin(b.id)} title="Deshacer" className="w-5 h-5 flex items-center justify-center rounded border border-white/10 text-white/20 hover:border-white/30 hover:text-white/50 transition-all text-[0.65rem]">↩</button>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                      {b.status === 'confirmed' && (
                        <button onClick={() => updateStatus(b.id, 'cancelled')} className="text-xs text-danger/50 hover:text-danger font-head uppercase tracking-wider transition-colors">
                          Cancelar
                        </button>
                      )}
                      {b.status === 'cancelled' && (
                        <button onClick={() => updateStatus(b.id, 'confirmed')} className="text-xs text-success/50 hover:text-success font-head uppercase tracking-wider transition-colors">
                          Restaurar
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {!loading && filtered.length > 0 && (
          <div className="px-4 py-2.5 border-t border-white/[0.04] text-[0.7rem] text-white/25">
            {filtered.length} de {bookings.length} reserva{bookings.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-[#111] border border-white/[0.1] rounded-xl p-6 w-full max-w-md shadow-[0_24px_80px_rgba(0,0,0,0.8)]" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-5">
              <div>
                <h3 className="font-head font-bold text-lg text-white">{selected.customer_name}</h3>
                <p className="text-white/30 text-xs mt-0.5">#{selected.id.slice(-6).toUpperCase()}</p>
              </div>
              <button onClick={() => setSelected(null)} className="w-7 h-7 flex items-center justify-center rounded text-white/25 hover:text-white hover:bg-white/5 transition-all text-lg leading-none">×</button>
            </div>

            <div className="mb-5">
              <span className={`text-xs px-2.5 py-1 rounded border ${STATUS_COLORS[selected.status]}`}>{STATUS_LABELS[selected.status]}</span>
            </div>

            <div className="space-y-0 text-sm mb-5">
              {([
                ['Fecha',      selected.date],
                ['Horario',    `${selected.start_time} – ${selected.end_time}`],
                ['Campos',   cockpitLabel(selected.cockpit_ids)],
                ['Sesión',     selected.session_type?.name || `#${selected.session_type_id}`],
                ['Email',      selected.customer_email],
                ['Teléfono',   selected.customer_phone],
                ['Personas',   String(selected.num_people)],
                ['Notas',      selected.notes || '—'],
                ['Asistencia', selected.checked_in === true ? '✓ Asistió' : selected.checked_in === false ? '✗ No show' : '—'],
              ] as [string, string][]).map(([k, v]) => (
                <div key={k} className="flex gap-4 py-2 border-b border-white/[0.05]">
                  <span className="text-white/30 w-20 flex-shrink-0">{k}</span>
                  <span className="text-white/80 break-all">{v}</span>
                </div>
              ))}
            </div>

            {selected.status === 'confirmed' && (
              <div className="flex gap-2 mb-3">
                <button
                  onClick={() => updateCheckin(selected.id, true)}
                  className={`flex-1 py-2 text-xs font-head font-semibold uppercase tracking-wider rounded border transition-all ${selected.checked_in === true ? 'bg-success/20 border-success/50 text-success' : 'bg-success/5 border-success/20 text-success/50 hover:bg-success/15 hover:text-success'}`}
                >
                  ✓ Asistió
                </button>
                <button
                  onClick={() => updateCheckin(selected.id, false)}
                  className={`flex-1 py-2 text-xs font-head font-semibold uppercase tracking-wider rounded border transition-all ${selected.checked_in === false ? 'bg-danger/20 border-danger/50 text-danger' : 'bg-danger/5 border-danger/20 text-danger/50 hover:bg-danger/15 hover:text-danger'}`}
                >
                  ✗ No show
                </button>
                {selected.checked_in !== null && selected.checked_in !== undefined && (
                  <button
                    onClick={() => resetCheckin(selected.id)}
                    className="px-3 py-2 text-xs font-head font-semibold uppercase tracking-wider rounded border border-white/10 text-white/30 hover:border-white/30 hover:text-white/60 transition-all"
                    title="Deshacer asistencia"
                  >
                    ↩
                  </button>
                )}
              </div>
            )}
            <div className="flex gap-2 flex-wrap">
              {selected.status !== 'confirmed' && (
                <button onClick={() => updateStatus(selected.id, 'confirmed')} className="flex-1 py-2 bg-success/10 border border-success/30 text-success text-xs font-head font-semibold uppercase tracking-wider rounded hover:bg-success/20 transition-all">Confirmar</button>
              )}
              {selected.status !== 'cancelled' && (
                <button onClick={() => updateStatus(selected.id, 'cancelled')} className="flex-1 py-2 bg-danger/10 border border-danger/30 text-danger text-xs font-head font-semibold uppercase tracking-wider rounded hover:bg-danger/20 transition-all">Cancelar</button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Create booking modal */}
      {showCreate && (
        <CreateBookingModal
          sessionTypes={sessionTypes}
          onClose={() => setShowCreate(false)}
          onCreated={() => { load() }}
        />
      )}
    </div>
  )
}

// ── Demo data ────────────────────────────────────────────────────────────────
const DEMO: Booking[] = [
  {
    id: 'GZ-A1B2C3', cockpit_ids: [1], session_type_id: 2,
    customer_name: 'Carlos García', customer_email: 'carlos@demo.com', customer_phone: '+34 600 111 222',
    num_people: 1, date: today, start_time: '11:00', end_time: '12:00', status: 'confirmed', notes: null,
    created_at: '2026-03-20T10:00:00Z',
    session_type: { id: 2, name: 'Individual 1h', duration_minutes: 60, price: 40, max_people: 1, color: '#FFD000' },
  },
  {
    id: 'GZ-D3E4F5', cockpit_ids: [3, 4, 5], session_type_id: 3,
    customer_name: 'Ana Martínez', customer_email: 'ana@demo.com', customer_phone: '+34 600 333 444',
    num_people: 3, date: today, start_time: '14:00', end_time: '15:00', status: 'confirmed', notes: 'Cumpleaños',
    created_at: '2026-03-21T15:00:00Z',
    session_type: { id: 3, name: 'Grupal 1h', duration_minutes: 60, price: 30, max_people: 8, color: '#8B5CF6' },
  },
  {
    id: 'GZ-G5H6I7', cockpit_ids: [2], session_type_id: 1,
    customer_name: 'Pedro López', customer_email: 'pedro@demo.com', customer_phone: '+34 600 555 666',
    num_people: 1, date: format(addDays(new Date(), -1), 'yyyy-MM-dd'), start_time: '16:30', end_time: '17:00', status: 'cancelled', notes: null,
    created_at: '2026-03-19T12:00:00Z',
    session_type: { id: 1, name: 'Individual 30min', duration_minutes: 30, price: 25, max_people: 1, color: '#FFD000' },
  },
  {
    id: 'GZ-J7K8L9', cockpit_ids: [1, 2, 3, 4, 5, 6, 7, 8], session_type_id: 5,
    customer_name: 'Empresa Celta S.L.', customer_email: 'biz@demo.com', customer_phone: '+34 600 777 888',
    num_people: 20, date: format(addDays(new Date(), 4), 'yyyy-MM-dd'), start_time: '18:00', end_time: '20:00', status: 'confirmed', notes: 'Team building corporativo',
    created_at: '2026-03-15T09:00:00Z',
    session_type: { id: 5, name: 'Evento Premium', duration_minutes: 120, price: 500, max_people: 50, color: '#F59E0B' },
  },
  {
    id: 'GZ-M1N2O3', cockpit_ids: [1], session_type_id: 2,
    customer_name: 'Laura Sánchez', customer_email: 'laura@demo.com', customer_phone: '+34 600 999 000',
    num_people: 1, date: today, start_time: '17:00', end_time: '18:00', status: 'confirmed', notes: null,
    checked_in: true,
    created_at: '2026-03-22T09:00:00Z',
    session_type: { id: 2, name: 'Individual 1h', duration_minutes: 60, price: 40, max_people: 1, color: '#FFD000' },
  },
]
