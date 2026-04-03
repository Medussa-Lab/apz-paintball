import { NextRequest, NextResponse } from 'next/server'
import { generateReference } from '@/lib/availability'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      cockpit_ids,
      session_type_id,
      customer_name,
      customer_email,
      customer_phone,
      num_people,
      date,
      start_time,
      end_time,
      notes,
    } = body as {
      cockpit_ids: number[]
      session_type_id: number
      customer_name: string
      customer_email: string
      customer_phone: string
      num_people: number
      date: string
      start_time: string
      end_time: string
      notes: string | null
    }

    // Validation
    if (
      !cockpit_ids || !Array.isArray(cockpit_ids) || cockpit_ids.length === 0 ||
      !date || !start_time || !end_time ||
      !customer_name || !customer_email
    ) {
      return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 })
    }

    const isConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://xxx.supabase.co'

    if (!isConfigured) {
      // Demo mode — no Supabase
      const reference = generateReference()
      return NextResponse.json({
        id: reference,
        reference,
        cockpit_ids,
        session_type_id,
        customer_name,
        customer_email,
        customer_phone,
        num_people: num_people || 1,
        date,
        start_time,
        end_time,
        status: 'confirmed',
        notes: notes || null,
        message: 'Demo: reserva simulada',
      })
    }

    // Real Supabase insert
    const { createServerClient } = await import('@/lib/supabase/server')
    const supabase = await createServerClient()

    // Check for conflicts — any booking that overlaps AND shares at least one cockpit_id
    // We use a broad date+time overlap query, then filter cockpit overlap in JS
    const { data: existing } = await supabase
      .from('bookings')
      .select('id, cockpit_ids')
      .eq('date', date)
      .eq('status', 'confirmed')
      .or(`and(start_time.lt.${end_time},end_time.gt.${start_time})`)

    if (existing && existing.length > 0) {
      const hasConflict = existing.some((b: { id: string; cockpit_ids: number[] }) => {
        const ids: number[] = Array.isArray(b.cockpit_ids) ? b.cockpit_ids : []
        return ids.some(id => cockpit_ids.includes(id))
      })
      if (hasConflict) {
        return NextResponse.json(
          { error: 'Este slot ya no está disponible. Por favor elige otro horario.' },
          { status: 409 }
        )
      }
    }

    const reference = generateReference()

    const insertData = {
      cockpit_ids,
      session_type_id,
      customer_name,
      customer_email,
      customer_phone: customer_phone || '',
      num_people: num_people || 1,
      date,
      start_time,
      end_time,
      notes: notes || null,
      status: 'confirmed' as const,
      reference,
    }

    const { data, error } = await (supabase as any)
      .from('bookings')
      .insert(insertData)
      .select()
      .single()

    if (error) {
      console.error('Booking insert error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ ...(data as object), reference })
  } catch (err) {
    console.error('Booking route error:', err)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const date    = searchParams.get('date')

    const isConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://xxx.supabase.co'

    if (!isConfigured) {
      return NextResponse.json([])
    }

    const { createServerClient } = await import('@/lib/supabase/server')
    const supabase = await createServerClient()

    let query = supabase.from('bookings').select('*').eq('status', 'confirmed')
    if (date) query = query.eq('date', date)

    const { data, error } = await query
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json(data)
  } catch (err) {
    console.error('Bookings GET error:', err)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
