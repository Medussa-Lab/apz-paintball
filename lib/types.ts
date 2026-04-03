// ─── APZ Paintball types ──────────────────────────────────────────
export interface ReservaForm {
  nombre: string
  telefono: string
  email: string
  fecha: string
  jugadores: number
  modalidad: string
  tipoGrupo: 'adultos' | 'ninos' | 'mixto'
  mensaje?: string
}

export type GameMode = {
  id: string
  nombre: string
  descripcion: string
  icono: string
  dificultad: number
  tag?: string
}

// ─── Database types (Admin Dashboard) ─────────────────────────────
export type BookingStatus = 'confirmed' | 'cancelled' | 'blocked' | 'no_show'

export interface Cockpit {
  id: number
  name: string
  description: string
  is_active: boolean
}

export interface SessionType {
  id: number
  name: string
  duration_minutes: number
  price: number
  max_people: number
  color: string
  is_active?: boolean
}

export interface Booking {
  id: string
  cockpit_ids: number[]
  session_type_id: number
  customer_name: string
  customer_email: string
  customer_phone: string
  num_people: number
  date: string
  start_time: string
  end_time: string
  status: BookingStatus
  checked_in?: boolean | null
  reference?: string
  notes: string | null
  created_at: string
  // joined
  cockpit?: Cockpit
  session_type?: SessionType
}

export interface BlockedSlot {
  id: string
  cockpit_id: number | null
  date: string
  start_time: string
  end_time: string
  reason: string
}

// ─── App-level types ──────────────────────────────────────────────
export interface TimeSlot {
  time: string       // "10:00"
  available: boolean
  booking?: Booking
}

export interface CockpitAvailability {
  cockpit: Cockpit
  slots: TimeSlot[]
}

export interface BookingFormData {
  date: string
  sessionTypeId: number | null
  sessionType: SessionType | null
  durationMinutes: number
  cockpitId: number | null
  cockpit: Cockpit | null
  startTime: string
  customerName: string
  customerEmail: string
  customerPhone: string
  numPeople: number
  notes: string
  price: number
}

// ─── Supabase generated types stub ───────────────────────────────
export type Database = {
  public: {
    Tables: {
      cockpits:      { Row: Cockpit; Insert: Omit<Cockpit, 'id'>; Update: Partial<Cockpit> }
      session_types: { Row: SessionType; Insert: Omit<SessionType, 'id'>; Update: Partial<SessionType> }
      bookings:      { Row: Booking; Insert: Omit<Booking, 'id' | 'created_at'>; Update: Partial<Booking> }
      blocked_slots: { Row: BlockedSlot; Insert: Omit<BlockedSlot, 'id'>; Update: Partial<BlockedSlot> }
    }
  }
}
