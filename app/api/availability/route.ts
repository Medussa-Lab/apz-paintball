export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { buildCockpitAvailability } from '@/lib/availability'
import type { Cockpit, Booking, BlockedSlot } from '@/lib/types'

const MOCK_COCKPITS: Cockpit[] = [
  { id: 1, name: 'Cabina Motion',      description: 'Movimiento real 3 ejes — la experiencia más inmersiva', is_active: true },
  { id: 2, name: 'Triple Screen Pro',  description: 'Triple pantalla curva, setup profesional sin movimiento', is_active: true },
  { id: 3, name: 'Standard 1',         description: 'Pantalla ultrawide, setup completo', is_active: true },
  { id: 4, name: 'Standard 2',         description: 'Pantalla ultrawide, setup completo', is_active: true },
  { id: 5, name: 'Standard 3',         description: 'Pantalla ultrawide, setup completo', is_active: true },
  { id: 6, name: 'Standard 4',         description: 'Pantalla ultrawide, setup completo', is_active: true },
  { id: 7, name: 'Standard 5',         description: 'Pantalla ultrawide, setup completo', is_active: true },
  { id: 8, name: 'Standard 6',         description: 'Pantalla ultrawide, setup completo', is_active: true },
]

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const date     = searchParams.get('date')
    const duration = parseInt(searchParams.get('duration') || '60')

    if (!date) return NextResponse.json({ error: 'date requerido' }, { status: 400 })

    const isConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://xxx.supabase.co'

    let cockpits: Cockpit[] = MOCK_COCKPITS
    let bookings: Booking[] = []
    let blocked:  BlockedSlot[] = []

    if (isConfigured) {
      const { createServerClient } = await import('@/lib/supabase/server')
      const supabase = await createServerClient()

      const [c, b, bl] = await Promise.all([
        supabase.from('cockpits').select('*').eq('is_active', true),
        supabase.from('bookings').select('*').eq('date', date).eq('status', 'confirmed'),
        supabase.from('blocked_slots').select('*').eq('date', date),
      ])
      if (c.data)  cockpits = c.data as Cockpit[]
      if (b.data)  bookings = b.data as Booking[]
      if (bl.data) blocked  = bl.data as BlockedSlot[]
    }

    const availabilities = cockpits.map(cockpit =>
      buildCockpitAvailability(cockpit, bookings, blocked, duration, date)
    )

    return NextResponse.json(availabilities)
  } catch (err) {
    console.error('Availability route error:', err)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
