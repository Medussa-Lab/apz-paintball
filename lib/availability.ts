import type { Booking, BlockedSlot, TimeSlot, CockpitAvailability, Cockpit } from './types'

// Opening time: 10:00 = 600 minutes
export const OPEN_MIN = 600
const SLOT_MIN = 30

/**
 * Returns closing time in minutes from midnight.
 * Mon-Wed (dow 1,2,3): 23:00 = 1380
 * Thu-Sun (dow 0,4,5,6): 01:00 next day = 1500 (25:00)
 */
export function getCloseMins(date: string): number {
  const d = new Date(date + 'T00:00:00')
  const dow = d.getDay() // 0=Sun, 1=Mon … 6=Sat
  // Mon(1), Tue(2), Wed(3) → 23:00
  if (dow === 1 || dow === 2 || dow === 3) return 1380
  // Thu(4), Fri(5), Sat(6), Sun(0) → 01:00 next day = 1500
  return 1500
}

/**
 * Convert minutes-from-midnight to "HH:MM".
 * Handles values > 1440 (past midnight) by wrapping.
 */
export function minutesToTime(mins: number): string {
  const wrapped = mins % 1440
  const h = Math.floor(wrapped / 60)
  const m = wrapped % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

/**
 * Convert "HH:MM" to minutes from midnight.
 * If hour < 10 it is assumed to be "next day" (e.g. 01:00 = 1500 mins when close is 1500).
 * This allows correct overlap checks across midnight.
 */
export function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number)
  const mins = h * 60 + m
  // Hours 00:00–09:59 are treated as "next day" (past midnight)
  if (h < 10) return mins + 1440
  return mins
}

/** Add minutes to a "HH:MM" string, returns "HH:MM" (may wrap past midnight) */
export function addMinutes(time: string, mins: number): string {
  const base = timeToMinutes(time)
  return minutesToTime(base + mins)
}

/** Generate all time slots from 10:00 to close - duration, every 30min */
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

/** Build availability grid for a given cockpit on a given date */
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

    // Check if slot would go past close
    if (endMins > close) return { time, available: false }

    // Check bookings for this cockpit (uses cockpit_ids array)
    const conflictingBooking = bookings.find(b =>
      Array.isArray(b.cockpit_ids) &&
      b.cockpit_ids.includes(cockpit.id) &&
      b.status === 'confirmed' &&
      overlapsMinutes(startMins, endMins, timeToMinutes(b.start_time), timeToMinutes(b.end_time))
    )
    if (conflictingBooking) return { time, available: false, booking: conflictingBooking }

    // Check blocked slots (null cockpit_id = all cockpits)
    const blockedSlot = blocked.find(bl =>
      (bl.cockpit_id === null || bl.cockpit_id === cockpit.id) &&
      overlapsMinutes(startMins, endMins, timeToMinutes(bl.start_time), timeToMinutes(bl.end_time))
    )
    if (blockedSlot) return { time, available: false }

    return { time, available: true }
  })

  return { cockpit, slots }
}

/** Find first available cockpit + slot for given date */
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
  return 'GZ-' + Math.random().toString(36).slice(2, 8).toUpperCase()
}
