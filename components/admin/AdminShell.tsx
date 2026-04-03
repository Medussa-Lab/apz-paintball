'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { format } from 'date-fns'

// ── Icons ────────────────────────────────────────────────────────────────────
function IconGrid() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4 flex-shrink-0"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>
}
function IconCalendar() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4 flex-shrink-0"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
}
function IconCalendarDots() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4 flex-shrink-0"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01"/></svg>
}
function IconBlock() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4 flex-shrink-0"><circle cx="12" cy="12" r="9"/><path d="M4.93 4.93l14.14 14.14"/></svg>
}
function IconSettings() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4 flex-shrink-0"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
}
function IconCockpit() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4 flex-shrink-0"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
}
function IconMetrics() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4 flex-shrink-0"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>
}

// ── Nav ──────────────────────────────────────────────────────────────────────
const NAV = [
  { href: '/admin',             label: 'Dashboard',  Icon: IconGrid },
  { href: '/admin/bookings',    label: 'Reservas',   Icon: IconCalendar },
  { href: '/admin/calendar',    label: 'Calendario', Icon: IconCalendarDots },
  { href: '/admin/cockpits',    label: 'Cockpits',   Icon: IconCockpit },
  { href: '/admin/metricas',    label: 'Métricas',   Icon: IconMetrics },
  { href: '/admin/block-slots', label: 'Bloquear',   Icon: IconBlock },
  { href: '/admin/settings',    label: 'Ajustes',    Icon: IconSettings },
]

// ── Pending check-in type ─────────────────────────────────────────────────────
interface PendingCheckin {
  id:        string
  name:      string
  cockpits:  string
  endTime:   string
}

function hhmm(t: string) { return t ? t.slice(0, 5) : '' }
function toMins(t: string) {
  const [h, m] = hhmm(t).split(':').map(Number)
  return h * 60 + m
}

// ── Main component ───────────────────────────────────────────────────────────
export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [authed,    setAuthed]    = useState<boolean | null>(null)
  const [email,     setEmail]     = useState('')
  const [pass,      setPass]      = useState('')
  const [err,       setErr]       = useState('')
  const [loading,   setLoading]   = useState(false)
  const [collapsed,      setCollapsed]      = useState(false)
  const [pending,        setPending]        = useState<PendingCheckin[]>([])
  const [dismissed,      setDismissed]      = useState<Set<string>>(new Set())
  const [newBookings,    setNewBookings]    = useState<{ id: string; name: string; time: string }[]>([])
  const [newDismissed,   setNewDismissed]   = useState<Set<string>>(new Set())
  const adminCreatedAt = useRef<number>(0)

  const supabase     = createClient()
  const isConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://xxx.supabase.co'
  const today        = format(new Date(), 'yyyy-MM-dd')

  // ── Auth ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isConfigured) { setAuthed(true); return }
    supabase.auth.getSession().then(({ data }) => setAuthed(!!data.session))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, s) => setAuthed(!!s))
    return () => subscription.unsubscribe()
  }, [])

  // ── Fetch pending check-ins (session ended, no check-in registered) ────────
  const fetchPending = useCallback(async () => {
    if (!authed) return
    const nowM = new Date().getHours() * 60 + new Date().getMinutes()
    let bookings: any[] = []

    if (!isConfigured) {
      const pad = (n: number) => String(n).padStart(2, '0')
      const t   = (m: number) => `${pad(Math.floor(((m % 1440) + 1440) % 1440 / 60))}:${pad(((m % 60) + 60) % 60)}`
      bookings  = [
        { id: 'n1', customer_name: 'Carlos García', cockpit_ids: [1],   start_time: t(nowM - 90), end_time: t(nowM - 30), status: 'confirmed', checked_in: null },
        { id: 'n2', customer_name: 'Ana Martínez',  cockpit_ids: [3,4], start_time: t(nowM - 70), end_time: t(nowM - 10), status: 'confirmed', checked_in: null },
      ]
    } else {
      const { data } = await (supabase as any)
        .from('bookings')
        .select('id,customer_name,cockpit_ids,start_time,end_time,status,checked_in')
        .eq('date', today)
        .eq('status', 'confirmed')
        .is('checked_in', null)
      bookings = data || []
    }

    const items: PendingCheckin[] = bookings
      .filter((b: any) => {
        const endM = toMins(b.end_time) <= toMins(b.start_time)
          ? toMins(b.end_time) + 1440
          : toMins(b.end_time)
        return endM < nowM
      })
      .map((b: any) => ({
        id:       b.id,
        name:     b.customer_name,
        cockpits: (b.cockpit_ids as number[])?.map(c => `C${c}`).join(', ') || '—',
        endTime:  hhmm(b.end_time),
      }))

    setPending(items)
  }, [authed, today])

  useEffect(() => {
    if (!authed) return
    fetchPending()
    const id = setInterval(fetchPending, 60_000)
    window.addEventListener('admin:refresh', fetchPending)
    return () => {
      clearInterval(id)
      window.removeEventListener('admin:refresh', fetchPending)
    }
  }, [authed, fetchPending])

  // ── Realtime: new bookings from clients ───────────────────────────────────
  useEffect(() => {
    const handler = () => { adminCreatedAt.current = Date.now() }
    window.addEventListener('admin:booking-created', handler)
    return () => window.removeEventListener('admin:booking-created', handler)
  }, [])

  useEffect(() => {
    if (!authed || !isConfigured) return
    const channel = (supabase as any)
      .channel('shell-new-bookings')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'bookings' }, (payload: any) => {
        if (Date.now() - adminCreatedAt.current < 4000) return
        const b = payload.new
        setNewBookings(prev => [
          { id: b.id, name: b.customer_name, time: format(new Date(), 'HH:mm') },
          ...prev,
        ])
      })
      .subscribe()
    return () => { (supabase as any).removeChannel(channel) }
  }, [authed])

  // ── Login / logout ─────────────────────────────────────────────────────────
  const login = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setErr('')
    const { error } = await supabase.auth.signInWithPassword({ email, password: pass })
    if (error) setErr(error.message)
    setLoading(false)
  }
  const logout = async () => { await supabase.auth.signOut(); setAuthed(false) }

  const visible    = pending.filter(p => !dismissed.has(p.id))
  const visibleNew = newBookings.filter(b => !newDismissed.has(b.id))

  if (authed === null) {
    return <div className="min-h-screen bg-[#060606] flex items-center justify-center text-white/30 text-sm">Cargando…</div>
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-[#060606] flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <Image src="/assets/logotipo-gzsimlab-sinfondo.png" alt="GZ Simlab" width={160} height={80} className="h-20 w-auto mx-auto mb-4" />
            <h1 className="font-head font-bold text-2xl text-white">Panel de Administración</h1>
          </div>
          <form onSubmit={login} className="bg-[#111] border border-white/[0.07] rounded-xl p-6 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[0.72rem] font-head font-semibold tracking-[0.1em] uppercase text-white/40">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                className="bg-[#0a0a0a] border border-white/10 rounded px-4 py-2.5 text-white text-sm focus:border-blue focus:outline-none focus:ring-2 focus:ring-blue/20 transition-all" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[0.72rem] font-head font-semibold tracking-[0.1em] uppercase text-white/40">Contraseña</label>
              <input type="password" value={pass} onChange={e => setPass(e.target.value)} required
                className="bg-[#0a0a0a] border border-white/10 rounded px-4 py-2.5 text-white text-sm focus:border-blue focus:outline-none focus:ring-2 focus:ring-blue/20 transition-all" />
            </div>
            {err && <p className="text-danger text-xs">{err}</p>}
            <button type="submit" disabled={loading}
              className="w-full py-3 bg-blue text-white font-head font-semibold text-sm tracking-wider uppercase rounded hover:bg-blueL transition-all duration-200 disabled:opacity-50">
              {loading ? 'Entrando…' : 'Entrar'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-[#060606] flex overflow-hidden">
      {/* Sidebar */}
      <aside className={`flex-shrink-0 bg-[#0a0a0a] border-r border-white/[0.06] flex flex-col transition-all duration-200 ${collapsed ? 'w-14' : 'w-56'}`}>

        {/* Logo + collapse toggle */}
        <div className={`border-b border-white/[0.06] flex items-center ${collapsed ? 'justify-center p-3' : 'p-4'}`}>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <Image src="/assets/logotipo-gzsimlab-sinfondo.png" alt="GZ Simlab" width={200} height={100} className="h-auto w-full max-h-28 object-contain" />
              <p className="text-[0.6rem] text-white/25 font-head uppercase tracking-widest mt-1">Admin Panel</p>
            </div>
          )}
          <button
            onClick={() => setCollapsed(c => !c)}
            className={`flex-shrink-0 w-7 h-7 flex items-center justify-center rounded text-white/20 hover:text-white/60 hover:bg-white/5 transition-all ${collapsed ? '' : 'ml-2'}`}
            title={collapsed ? 'Expandir menú' : 'Colapsar menú'}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4">
              {collapsed ? <path d="M9 18l6-6-6-6"/> : <path d="M15 18l-6-6 6-6"/>}
            </svg>
          </button>
        </div>

        {/* Nav links */}
        <nav className={`flex-1 ${collapsed ? 'p-2' : 'p-3'}`}>
          {NAV.map(({ href, label, Icon }) => {
            const active = pathname === href
            return (
              <Link key={href} href={href}
                title={collapsed ? label : undefined}
                className={`flex items-center ${collapsed ? 'justify-center px-0' : 'gap-3 px-3'} py-2.5 rounded mb-1 text-sm font-head font-medium transition-all duration-200 ${
                  active ? 'bg-blue/10 text-blue border border-blue/20' : 'text-white/40 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon />
                {!collapsed && label}
              </Link>
            )
          })}
        </nav>

        {/* ── New bookings from clients ── */}
        {visibleNew.length > 0 && (
          <div className={`border-t border-blue/20 bg-blue/[0.04] ${collapsed ? 'p-2' : 'p-3'}`}>
            {collapsed ? (
              <Link href="/admin/bookings" title={`${visibleNew.length} nueva${visibleNew.length !== 1 ? 's' : ''} reserva${visibleNew.length !== 1 ? 's' : ''}`}
                className="flex items-center justify-center w-full py-1 relative">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4 text-blue/70">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                </svg>
                <span className="absolute top-0 right-1 min-w-[16px] h-4 flex items-center justify-center rounded-full bg-blue text-[0.55rem] font-bold text-white px-0.5">
                  {visibleNew.length}
                </span>
              </Link>
            ) : (
              <>
                <div className="flex items-center justify-between mb-2 px-1">
                  <span className="flex items-center gap-1.5 text-[0.6rem] font-head font-semibold uppercase tracking-wider text-blue/80">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue animate-pulse" />
                    Nueva{visibleNew.length !== 1 ? 's' : ''} reserva{visibleNew.length !== 1 ? 's' : ''}
                  </span>
                  <button
                    onClick={() => setNewDismissed(new Set(visibleNew.map(b => b.id)))}
                    className="text-[0.6rem] text-white/20 hover:text-white/50 font-head transition-colors"
                  >
                    Limpiar
                  </button>
                </div>
                <div className="space-y-1">
                  {visibleNew.map(b => (
                    <Link key={b.id} href="/admin/bookings"
                      className="flex items-center gap-2 px-2 py-1.5 rounded bg-blue/10 border border-blue/20 hover:border-blue/40 transition-all group">
                      <div className="flex-1 min-w-0">
                        <p className="text-[0.7rem] font-head font-semibold text-white/80 truncate">{b.name}</p>
                        <p className="text-[0.6rem] text-blue/60 truncate">Reserva a las {b.time}</p>
                      </div>
                      <button
                        onClick={e => { e.preventDefault(); e.stopPropagation(); setNewDismissed(prev => new Set(Array.from(prev).concat(b.id))) }}
                        className="flex-shrink-0 w-4 h-4 flex items-center justify-center rounded text-white/10 hover:text-white/50 opacity-0 group-hover:opacity-100 transition-all text-xs leading-none"
                      >
                        ×
                      </button>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* ── Pending check-ins — always visible ── */}
        {visible.length > 0 && (
          <div className={`border-t border-danger/20 bg-danger/[0.04] ${collapsed ? 'p-2' : 'p-3'}`}>
            {collapsed ? (
              /* Collapsed: just a red dot with count */
              <Link href="/admin/bookings" title={`${visible.length} check-in${visible.length !== 1 ? 's' : ''} pendiente${visible.length !== 1 ? 's' : ''}`}
                className="flex items-center justify-center w-full py-1 relative">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4 text-danger/60">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
                <span className="absolute top-0 right-1 min-w-[16px] h-4 flex items-center justify-center rounded-full bg-danger text-[0.55rem] font-bold text-white px-0.5">
                  {visible.length}
                </span>
              </Link>
            ) : (
              /* Expanded: full list */
              <>
                <div className="flex items-center justify-between mb-2 px-1">
                  <span className="flex items-center gap-1.5 text-[0.6rem] font-head font-semibold uppercase tracking-wider text-danger/80">
                    <span className="w-1.5 h-1.5 rounded-full bg-danger animate-pulse" />
                    Check-in pendiente
                  </span>
                  {visible.length > 1 && (
                    <button
                      onClick={() => setDismissed(new Set(visible.map(p => p.id)))}
                      className="text-[0.6rem] text-white/20 hover:text-white/50 font-head transition-colors"
                    >
                      Limpiar
                    </button>
                  )}
                </div>
                <div className="space-y-1">
                  {visible.map(p => (
                    <Link key={p.id} href="/admin/bookings"
                      className="flex items-center gap-2 px-2 py-1.5 rounded bg-danger/10 border border-danger/20 hover:border-danger/40 transition-all group">
                      <div className="flex-1 min-w-0">
                        <p className="text-[0.7rem] font-head font-semibold text-white/80 truncate">{p.name}</p>
                        <p className="text-[0.6rem] text-danger/60 truncate">{p.cockpits} · terminó {p.endTime}</p>
                      </div>
                      <button
                        onClick={e => { e.preventDefault(); e.stopPropagation(); setDismissed(prev => new Set(Array.from(prev).concat(p.id))) }}
                        className="flex-shrink-0 w-4 h-4 flex items-center justify-center rounded text-white/10 hover:text-white/50 opacity-0 group-hover:opacity-100 transition-all text-xs leading-none"
                      >
                        ×
                      </button>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Footer: logout + web */}
        <div className={`border-t border-white/[0.06] ${collapsed ? 'p-2' : 'p-3'}`}>
          <button onClick={logout}
            title={collapsed ? 'Cerrar sesión' : undefined}
            className={`w-full flex items-center ${collapsed ? 'justify-center' : 'gap-2 px-3'} py-2 text-[0.78rem] text-white/25 hover:text-danger transition-colors rounded`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-3.5 h-3.5 flex-shrink-0">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
            </svg>
            {!collapsed && 'Cerrar sesión'}
          </button>
          <Link href="/" target="_blank"
            title={collapsed ? 'Ver sitio web' : undefined}
            className={`flex items-center ${collapsed ? 'justify-center' : 'gap-2 px-3'} py-1 text-[0.78rem] text-white/25 hover:text-blue transition-colors rounded`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-3.5 h-3.5 flex-shrink-0">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />
            </svg>
            {!collapsed && 'Ver sitio web'}
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
