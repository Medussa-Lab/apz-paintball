import type { Booking, BlockedSlot, TimeSlot, CockpitAvailability, Cockpit } from './types'

// Opening time: 10:00 = 600 minutes
export const OPEN_MIN = 600
const SLOT_MIN = 60 // 1-hour intervals for paintball

/**
 * Returns closing time in minutes from midnight.
 * Paintball: 10:00–20:00 todos los días (1200 mins)
 */
export function getCloseMins(_date: string): number {
  return 1200 // 20:00
}

/**
 * Convert minutes-from-midnight to "HH:MM".
 */
export function minutesToTime(mins: number): string {
  const wrapped = mins % 1440
  const h = Math.floor(wrapped / 60)
  const m = wrapped % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

/**
 * Convert "HH:MM" to minutes from midnight.
 */
export function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}

/** Add minutes to a "HH:MM" string, returns "HH:MM" */
export function addMinutes(time: string, mins: number): string {
  const base = timeToMinutes(time)
  return minutesToTime(base + mins)
}

/** Generate all time slots from 10:00 to close - duration, every 60min */
export function generateTimeSlots(date: string, durationMinutes = 0): string[] {
  const close = getCloseMins(date)
  const slots: string[] = []
  for (let m = OPEN_MIN; m + durationMinutes <= close; m += SLOT_MIN) {
    slots.push(minutesToTime(m))
  }
  return slots
}

/** Check if two time intervals overlap (all in minutes) */
function overlapsMinutes(s1: number, e1: number, s2: number, e2: number): boolean {
  return s1 < e2 && e1 > s2
}

/** Build availability grid for a given campo on a given date */
export function buildCockpitAvailability(
  cockpit: Cockpit,
  bookings: Booking[],
  blocked: BlockedSlot[],
  durationMinutes: number,
  date: string
): CockpitAvailability {
  const allSlots = generateTimeSlots(date, durationMinutes)
  const close = getCloseMins(date)

  const slots: TimeSlot[] = allSlots.map((time) => {
    const startMins = timeToMinutes(time)
    const endMins   = startMins + durationMinutes

    if (endMins > close) return { time, available: false }

    const conflictingBooking = bookings.find(b =>
      Array.isArray(b.cockpit_ids) &&
      b.cockpit_ids.includes(cockpit.id) &&
      b.status === 'confirmed' &&
      overlapsMinutes(startMins, endMins, timeToMinutes(b.start_time), timeToMinutes(b.end_time))
    )
    if (conflictingBooking) return { time, available: false, booking: conflictingBooking }

    const blockedSlot = blocked.find(bl =>
      (bl.cockpit_id === null || bl.cockpit_id === cockpit.id) &&
      overlapsMinutes(startMins, endMins, timeToMinutes(bl.start_time), timeToMinutes(bl.end_time))
    )
    if (blockedSlot) return { time, available: false }

    return { time, available: true }
  })

  return { cockpit, slots }
}

/** Find first available campo + slot for given date */
export function findFirstAvailable(
  availabilities: CockpitAvailability[],
  preferredTime?: string
): { cockpitId: number; time: string } | null {
  for (const av of availabilities) {
    if (!av.cockpit.is_active) continue
    const slots = preferredTime
      ? av.slots.filter(s => timeToMinutes(s.time) >= timeToMinutes(preferredTime))
      : av.slots
    const slot = slots.find(s => s.available)
    if (slot) return { cockpitId: av.cockpit.id, time: slot.time }
  }
  return null
}

/** Generate a short booking reference */
export function generateReference(): string {
  return 'APZ-' + Math.random().toString(36).slice(2, 8).toUpperCase()
}
