'use client'
import { useState, useEffect, useCallback, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Booking, SessionType } from '@/lib/types'
import { format, subDays, startOfYear } from 'date-fns'
import { es } from 'date-fns/locale'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid,
} from 'recharts'

const COCKPIT_COLORS = ['#F59E0B', '#8B5CF6', '#0066FF', '#3B82F6', '#0EA5E9', '#06B6D4', '#00AACC', '#3385FF']
const COCKPIT_NAMES  = ['Motion', 'Triple Pro', 'Std 1', 'Std 2', 'Std 3', 'Std 4', 'Std 5', 'Std 6']
const SESSION_COLORS = ['#0066FF', '#8B5CF6', '#F59E0B', '#00FF88', '#FF3333', '#00AACC']
const today = format(new Date(), 'yyyy-MM-dd')

type RangePeriod = '30d' | '90d' | '1y'

const TOOLTIP_STYLE = {
  contentStyle: { background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, fontSize: 12 },
  labelStyle: { color: 'rgba(255,255,255,0.5)' },
  itemStyle: { color: '#fff' },
  cursor: { fill: 'rgba(255,255,255,0.04)' },
}

function StatCard({ label, value, sub, accent, icon }: { label: string; value: string; sub?: string; accent?: string; icon?: React.ReactNode }) {
  return (
    <div className="bg-[#111] border border-white/[0.07] rounded-lg p-5">
      <div className="flex items-start justify-between mb-2">
        <p className="text-white/30 text-xs font-head uppercase tracking-wider">{label}</p>
        {icon && <span className="text-white/20">{icon}</span>}
      </div>
      <p className={`font-head font-bold text-2xl ${accent || 'text-white'}`}>{value}</p>
      {sub && <p className="text-white/25 text-xs mt-1">{sub}</p>}
    </div>
  )
}

export default function AdminMetrics() {
  const [bookings,  setBookings]  = useState<Booking[]>([])
  const [loading,   setLoading]   = useState(true)
  const [period,    setPeriod]    = useState<RangePeriod>('30d')
  const supabase = createClient()
  const isConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://xxx.supabase.co'

  const load = useCallback(async (p: RangePeriod) => {
    setLoading(true)
    if (!isConfigured) {
      setBookings(generateDemoData(p))
      setLoading(false)
      return
    }
    const days = p === '30d' ? 30 : p === '90d' ? 90 : 365
    const from = format(subDays(new Date(), days), 'yyyy-MM-dd')
    try {
      const [bRes, stRes] = await Promise.all([
        (supabase as any).from('bookings').select('*').gte('date', from).lte('date', today).order('date'),
        (supabase as any).from('session_types').select('id,name,price'),
      ])
      const stMap: Record<number, { name: string; price: number }> = {}
      if (stRes.data) for (const st of stRes.data) stMap[st.id] = { name: st.name, price: st.price }
      setBookings(((bRes.data || []) as any[]).map(b => ({ ...b, session_type: stMap[b.session_type_id] ?? null })))
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { load(period) }, [period, load])

  // ── Computed metrics ──────────────────────────────────────────
  const confirmed = useMemo(() => bookings.filter(b => b.status === 'confirmed' || b.status === 'no_show'), [bookings])
  const attended  = useMemo(() => bookings.filter(b => b.checked_in === true), [bookings])
  const noShows   = useMemo(() => bookings.filter(b => b.checked_in === false || b.status === 'no_show'), [bookings])

  const totalRevenue  = useMemo(() => confirmed.reduce((s, b) => s + (b.session_type?.price ?? 0), 0), [confirmed])
  const realRevenue   = useMemo(() => attended.reduce((s, b) => s + (b.session_type?.price ?? 0), 0), [attended])
  const ticketMedio   = confirmed.length ? Math.round(totalRevenue / confirmed.length) : 0
  const noShowRate    = confirmed.length ? Math.round(noShows.length / confirmed.length * 100) : 0

  const uniqueClients = useMemo(() => new Set(bookings.map(b => b.customer_email)).size, [bookings])

  // Occupancy rate: session minutes vs available cockpit-minutes
  const occupancyRate = useMemo(() => {
    const days = period === '30d' ? 30 : period === '90d' ? 90 : 365
    const availableMin = 8 * 15 * 60 * days  // 8 cockpits × 15h/day × N days
    const usedMin = confirmed.reduce((s, b) => {
      const [sh, sm] = b.start_time.split(':').map(Number)
      const [eh, em] = b.end_time.split(':').map(Number)
      let dur = eh * 60 + em - (sh * 60 + sm)
      if (dur <= 0) dur += 1440
      return s + dur * b.cockpit_ids.length
    }, 0)
    return availableMin > 0 ? Math.round(usedMin / availableMin * 100) : 0
  }, [confirmed, period])

  // Cockpit usage
  const cockpitUsage = useMemo(() =>
    [1,2,3,4,5,6,7,8].map((id, ci) => ({
      name: COCKPIT_NAMES[ci],
      sesiones: confirmed.filter(b => Array.isArray(b.cockpit_ids) && b.cockpit_ids.includes(id)).length,
      revenue: confirmed.filter(b => Array.isArray(b.cockpit_ids) && b.cockpit_ids.includes(id))
        .reduce((s, b) => s + (b.session_type?.price ?? 0), 0),
      color: COCKPIT_COLORS[ci],
    })).sort((a, b) => b.sesiones - a.sesiones)
  , [confirmed])

  // Peak hours (10–01)
  const peakHours = useMemo(() => {
    const hours = [10,11,12,13,14,15,16,17,18,19,20,21,22,23,0,1]
    return hours.map(h => ({
      label: `${String(h).padStart(2,'0')}h`,
      count: confirmed.filter(b => {
        const [bh] = b.start_time.split(':').map(Number)
        return bh === h
      }).length,
    }))
  }, [confirmed])

  // Day of week
  const dayOfWeek = useMemo(() => {
    const labels = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
    return labels.map((label, i) => ({
      label,
      count: confirmed.filter(b => {
        const d = new Date(b.date + 'T00:00:00')
        return (d.getDay() + 6) % 7 === i
      }).length,
    }))
  }, [confirmed])

  // Monthly revenue (current year)
  const monthlyRevenue = useMemo(() => {
    const year = new Date().getFullYear()
    const currentMonth = new Date().getMonth()
    return Array.from({ length: currentMonth + 1 }, (_, m) => {
      const ms = String(m + 1).padStart(2, '0')
      const mb = confirmed.filter(b => b.date.startsWith(`${year}-${ms}`))
      return {
        label: format(new Date(year, m, 1), 'MMM', { locale: es }),
        revenue: mb.reduce((s, b) => s + (b.session_type?.price ?? 0), 0),
        sesiones: mb.length,
      }
    })
  }, [confirmed])

  // Weekly trend (last N weeks)
  const weeklyTrend = useMemo(() => {
    const weeks = period === '30d' ? 4 : period === '90d' ? 12 : 52
    return Array.from({ length: weeks }, (_, i) => {
      const weekEnd   = subDays(new Date(), i * 7)
      const weekStart = subDays(weekEnd, 6)
      const ws = format(weekStart, 'yyyy-MM-dd')
      const we = format(weekEnd,   'yyyy-MM-dd')
      const wb = confirmed.filter(b => b.date >= ws && b.date <= we)
      return {
        label: format(weekStart, 'd MMM', { locale: es }),
        revenue: wb.reduce((s, b) => s + (b.session_type?.price ?? 0), 0),
        sesiones: wb.length,
      }
    }).reverse()
  }, [confirmed, period])

  // Session type distribution
  const sessionDist = useMemo(() => {
    const map: Record<string, number> = {}
    confirmed.forEach(b => { const n = b.session_type?.name || 'Otro'; map[n] = (map[n] || 0) + 1 })
    return Object.entries(map).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value)
  }, [confirmed])

  // Top customers
  const topCustomers = useMemo(() => {
    const map: Record<string, { name: string; email: string; sessions: number; revenue: number }> = {}
    bookings.forEach(b => {
      const k = b.customer_email
      if (!map[k]) map[k] = { name: b.customer_name, email: k, sessions: 0, revenue: 0 }
      map[k].sessions++
      map[k].revenue += b.session_type?.price ?? 0
    })
    return Object.values(map).sort((a, b) => b.sessions - a.sessions).slice(0, 8)
  }, [bookings])

  // Best cockpit & best day
  const bestCockpit  = cockpitUsage[0]
  const peakHour     = [...peakHours].sort((a, b) => b.count - a.count)[0]
  const bestDay      = [...dayOfWeek].sort((a, b) => b.count - a.count)[0]
  const bestMonth    = [...monthlyRevenue].sort((a, b) => b.revenue - a.revenue)[0]

  const periodLabel = period === '30d' ? 'últimos 30 días' : period === '90d' ? 'últimos 90 días' : 'este año'

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-head font-bold text-2xl text-white">Métricas</h1>
          <p className="text-white/30 text-sm mt-0.5">{loading ? 'Cargando…' : `${confirmed.length} sesiones en los ${periodLabel}`}</p>
        </div>
        <div className="flex items-center gap-1">
          {(['30d', '90d', '1y'] as RangePeriod[]).map(p => (
            <button key={p} onClick={() => setPeriod(p)}
              className={`text-xs font-head uppercase tracking-wider px-3 py-1.5 rounded border transition-all ${period === p ? 'bg-blue/20 text-blue border-blue/30' : 'border-white/10 text-white/30 hover:text-white/60'}`}>
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6 gap-4 mb-8">
        <StatCard label="Total sesiones" value={String(confirmed.length)} sub={`${uniqueClients} clientes únicos`} />
        <StatCard label="Ingresos estimados" value={`€${totalRevenue}`} sub={`${periodLabel}`} accent="text-blue" />
        <StatCard label="Ingresos reales" value={`€${realRevenue}`} sub={`${attended.length} check-ins`} accent="text-success" />
        <StatCard label="Ticket medio" value={`€${ticketMedio}`} sub="por sesión" />
        <StatCard label="Ocupación" value={`${occupancyRate}%`}
          sub="del tiempo disponible"
          accent={occupancyRate > 60 ? 'text-success' : occupancyRate > 30 ? 'text-blue' : 'text-white'} />
        <StatCard label="Tasa no-show" value={`${noShowRate}%`}
          sub={`${noShows.length} de ${confirmed.length}`}
          accent={noShowRate > 15 ? 'text-danger' : noShowRate > 8 ? 'text-warn' : 'text-white'} />
      </div>

      {/* Insights banner */}
      {!loading && confirmed.length > 0 && (
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 mb-8">
          {[
            { label: 'Cockpit estrella', value: bestCockpit?.name || '—', sub: `${bestCockpit?.sesiones || 0} sesiones · €${bestCockpit?.revenue || 0}`, color: COCKPIT_COLORS[cockpitUsage.indexOf(bestCockpit)] },
            { label: 'Hora pico', value: peakHour?.label || '—', sub: `${peakHour?.count || 0} reservas a esta hora`, color: '#0066FF' },
            { label: 'Día más activo', value: bestDay?.label || '—', sub: `${bestDay?.count || 0} sesiones`, color: '#8B5CF6' },
            { label: 'Mejor mes', value: bestMonth?.label || '—', sub: `€${bestMonth?.revenue || 0} · ${bestMonth?.sesiones || 0} ses.`, color: '#F59E0B' },
          ].map(({ label, value, sub, color }) => (
            <div key={label} className="bg-[#111] border border-white/[0.07] rounded-lg p-4 flex items-center gap-3">
              <div className="w-1 self-stretch rounded-full flex-shrink-0" style={{ background: color }} />
              <div>
                <p className="text-white/25 text-[0.6rem] font-head uppercase tracking-wider">{label}</p>
                <p className="font-head font-bold text-white text-base">{value}</p>
                <p className="text-white/30 text-[0.65rem]">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Charts row 1: trend + cockpit usage */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mb-6">
        {/* Weekly trend */}
        <div className="xl:col-span-2 bg-[#111] border border-white/[0.07] rounded-lg p-5">
          <h2 className="font-head font-bold text-xs text-white/40 uppercase tracking-wider mb-4">
            Tendencia de ingresos (por semana)
          </h2>
          {loading ? <div className="h-44 skeleton bg-white/5 rounded" /> : (
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={weeklyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="label" tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 10, fontFamily: 'Rajdhani' }}
                  axisLine={false} tickLine={false} interval={Math.floor(weeklyTrend.length / 6)} />
                <YAxis tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10 }} axisLine={false} tickLine={false}
                  tickFormatter={v => `€${v}`} width={44} />
                <Tooltip {...TOOLTIP_STYLE} formatter={(v, name) => [name === 'revenue' ? `€${v}` : v, name === 'revenue' ? 'Ingresos' : 'Sesiones']} />
                <Line type="monotone" dataKey="revenue" stroke="#0066FF" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="sesiones" stroke="#8B5CF6" strokeWidth={1.5} dot={false} strokeDasharray="4 4" />
              </LineChart>
            </ResponsiveContainer>
          )}
          <div className="flex items-center gap-4 mt-2">
            <span className="flex items-center gap-1.5 text-[0.65rem] text-white/30"><span className="w-3 h-0.5 bg-blue inline-block" />Ingresos</span>
            <span className="flex items-center gap-1.5 text-[0.65rem] text-white/30"><span className="w-3 h-0.5 bg-purple-500 inline-block border-dashed" />Sesiones</span>
          </div>
        </div>

        {/* Cockpit usage */}
        <div className="bg-[#111] border border-white/[0.07] rounded-lg p-5">
          <h2 className="font-head font-bold text-xs text-white/40 uppercase tracking-wider mb-4">Uso por cockpit</h2>
          {loading ? <div className="h-44 skeleton bg-white/5 rounded" /> : (
            <div className="space-y-2.5">
              {cockpitUsage.map((c, i) => {
                const max = cockpitUsage[0]?.sesiones || 1
                return (
                  <div key={c.name}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[0.65rem] text-white/50 font-head">{c.name}</span>
                      <span className="text-[0.65rem] font-head font-bold" style={{ color: c.color }}>{c.sesiones} ses. · €{c.revenue}</span>
                    </div>
                    <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${(c.sesiones / max) * 100}%`, background: c.color }} />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Charts row 2: peak hour + day of week + session types */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mb-6">
        {/* Peak hour */}
        <div className="bg-[#111] border border-white/[0.07] rounded-lg p-5">
          <h2 className="font-head font-bold text-xs text-white/40 uppercase tracking-wider mb-4">Hora pico del día</h2>
          {loading ? <div className="h-40 skeleton bg-white/5 rounded" /> : (
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={peakHours} barSize={10}>
                <XAxis dataKey="label" tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 9 }} axisLine={false} tickLine={false} interval={1} />
                <YAxis hide />
                <Tooltip {...TOOLTIP_STYLE} formatter={(v) => [v, 'Reservas']} />
                <Bar dataKey="count" radius={[3,3,0,0]}>
                  {peakHours.map((h, i) => (
                    <Cell key={i} fill={h.count === Math.max(...peakHours.map(x => x.count)) ? '#0066FF' : 'rgba(255,255,255,0.08)'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Day of week */}
        <div className="bg-[#111] border border-white/[0.07] rounded-lg p-5">
          <h2 className="font-head font-bold text-xs text-white/40 uppercase tracking-wider mb-4">Día más activo</h2>
          {loading ? <div className="h-40 skeleton bg-white/5 rounded" /> : (
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={dayOfWeek} barSize={22}>
                <XAxis dataKey="label" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11, fontFamily: 'Rajdhani' }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip {...TOOLTIP_STYLE} formatter={(v) => [v, 'Sesiones']} />
                <Bar dataKey="count" radius={[4,4,0,0]}>
                  {dayOfWeek.map((d, i) => (
                    <Cell key={i} fill={d.count === Math.max(...dayOfWeek.map(x => x.count)) ? '#8B5CF6' : 'rgba(255,255,255,0.08)'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Session distribution */}
        <div className="bg-[#111] border border-white/[0.07] rounded-lg p-5">
          <h2 className="font-head font-bold text-xs text-white/40 uppercase tracking-wider mb-4">Tipos de sesión</h2>
          {loading ? <div className="h-40 skeleton bg-white/5 rounded" /> : sessionDist.length === 0 ? (
            <div className="h-40 flex items-center justify-center text-white/20 text-sm">Sin datos</div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <ResponsiveContainer width="100%" height={100}>
                <PieChart>
                  <Pie data={sessionDist} cx="50%" cy="50%" innerRadius={28} outerRadius={46} paddingAngle={3} dataKey="value">
                    {sessionDist.map((_, i) => <Cell key={i} fill={SESSION_COLORS[i % SESSION_COLORS.length]} />)}
                  </Pie>
                  <Tooltip {...TOOLTIP_STYLE} />
                </PieChart>
              </ResponsiveContainer>
              <div className="w-full space-y-1.5">
                {sessionDist.slice(0, 5).map((d, i) => (
                  <div key={d.name} className="flex items-center gap-2 text-xs">
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: SESSION_COLORS[i % SESSION_COLORS.length] }} />
                    <span className="text-white/50 flex-1 truncate">{d.name}</span>
                    <span className="text-white/70 font-head font-bold">{d.value}</span>
                    <span className="text-white/25">{confirmed.length ? Math.round(d.value / confirmed.length * 100) : 0}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Monthly revenue bar */}
      <div className="bg-[#111] border border-white/[0.07] rounded-lg p-5 mb-6">
        <h2 className="font-head font-bold text-xs text-white/40 uppercase tracking-wider mb-4">Ingresos por mes (año en curso)</h2>
        {loading ? <div className="h-44 skeleton bg-white/5 rounded" /> : (
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={monthlyRevenue} barSize={28}>
              <XAxis dataKey="label" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11, fontFamily: 'Rajdhani' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10 }} axisLine={false} tickLine={false}
                tickFormatter={v => `€${v}`} width={44} />
              <Tooltip {...TOOLTIP_STYLE} formatter={(v, name) => [name === 'revenue' ? `€${v}` : v, name === 'revenue' ? 'Ingresos' : 'Sesiones']} />
              <Bar dataKey="revenue" radius={[4,4,0,0]}>
                {monthlyRevenue.map((m, i) => (
                  <Cell key={i} fill={m.revenue === Math.max(...monthlyRevenue.map(x => x.revenue)) ? '#F59E0B' : '#0066FF'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Top customers */}
      {topCustomers.length > 0 && (
        <div className="bg-[#111] border border-white/[0.07] rounded-lg overflow-hidden">
          <div className="px-5 py-4 border-b border-white/[0.07]">
            <h2 className="font-head font-bold text-xs text-white/40 uppercase tracking-wider">Top clientes</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.05]">
                  {['#', 'Cliente', 'Email', 'Sesiones', 'Gasto total'].map(h => (
                    <th key={h} className="text-left text-[0.65rem] font-head font-semibold uppercase tracking-wider text-white/25 px-5 py-2.5">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {topCustomers.map((c, i) => (
                  <tr key={c.email} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                    <td className="px-5 py-3 text-white/20 text-xs font-head">{i + 1}</td>
                    <td className="px-5 py-3 text-white/80 text-sm font-medium">{c.name}</td>
                    <td className="px-5 py-3 text-white/40 text-xs">{c.email}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-1 rounded-full bg-blue/20 flex-1 max-w-[60px]">
                          <div className="h-full rounded-full bg-blue" style={{ width: `${(c.sessions / topCustomers[0].sessions) * 100}%` }} />
                        </div>
                        <span className="text-white/70 text-sm font-head font-bold">{c.sessions}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-success font-head font-bold text-sm">€{c.revenue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Demo data generator ───────────────────────────────────────────
function generateDemoData(period: RangePeriod): Booking[] {
  const days    = period === '30d' ? 30 : period === '90d' ? 90 : 365
  const pattern = [0, 2, 1, 3, 1, 2, 0, 3, 1, 2, 2, 0, 3, 1, 2, 4, 1, 3, 2, 1, 0, 2, 3, 1, 2, 1, 3, 0]
  const sessions = [
    { id: 1, name: 'Individual 1h', price: 40 },
    { id: 2, name: 'Individual 30min', price: 25 },
    { id: 3, name: 'Duo 1h', price: 70 },
    { id: 4, name: 'Grupal 2h', price: 100 },
  ]
  const hours = [11, 12, 14, 15, 16, 17, 18, 19, 20, 21]
  const result: Booking[] = []

  for (let d = days - 1; d >= 0; d--) {
    const date  = format(new Date(Date.now() - d * 86400000), 'yyyy-MM-dd')
    const count = pattern[d % pattern.length]
    for (let i = 0; i < count; i++) {
      const st = sessions[(d + i) % sessions.length]
      const h  = hours[(d * 3 + i * 7) % hours.length]
      result.push({
        id: `m${d}-${i}`,
        cockpit_ids:     [((d + i * 3) % 8) + 1],
        session_type_id: st.id,
        customer_name:   ['Carlos G.','Ana M.','Pedro L.','María S.','Juan P.','Laura T.','Sergio B.','Elena R.'][(d + i) % 8],
        customer_email:  `demo${(d + i) % 12}@test.com`,
        customer_phone:  '',
        num_people:      1,
        date,
        start_time:      `${String(h).padStart(2,'0')}:00`,
        end_time:        `${String((h + 1) % 24).padStart(2,'0')}:00`,
        status:          'confirmed',
        checked_in:      d > 3 ? true : null,
        notes:           null,
        created_at:      '',
        session_type:    { id: st.id, name: st.name, duration_minutes: 60, price: st.price, max_people: 4, color: '#0066FF' },
      })
    }
  }
  return result
}
