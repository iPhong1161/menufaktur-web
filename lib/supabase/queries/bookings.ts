import { createClient } from "@/lib/supabase/server"
import type { Database } from "@/types/database"

export interface UserBooking {
  id: string
  booking_number: string
  status: "pending" | "confirmed" | "cancelled" | "refunded"
  total_amount: number
  created_at: string
  user_id: string
  course_id: string
  course: {
    id: string
    title: string
    date: string
    start_time: string
    end_time: string
    photo_url: string | null
  } | null
}

type BookingInsert = Database["public"]["Tables"]["bookings"]["Insert"]
type ParticipantInsert = Database["public"]["Tables"]["participants"]["Insert"]
type InvoiceRecipientInsert = Database["public"]["Tables"]["invoice_recipients"]["Insert"]

export interface CreateBookingPayload {
  booking: Omit<BookingInsert, "booking_number">
  participants: Omit<ParticipantInsert, "booking_id">[]
  invoiceRecipient: Omit<InvoiceRecipientInsert, "booking_id">
}

export async function createBooking(
  payload: CreateBookingPayload
): Promise<{ booking_number: string; id: string } | { error: string }> {
  const supabase = await createClient()

  // Generate booking number server-side
  const { data: numberData, error: numberError } = await supabase
    .rpc("next_booking_number")

  if (numberError || !numberData) {
    return { error: "Buchungsnummer konnte nicht generiert werden." }
  }

  const booking_number = numberData as string

  const { data: booking, error: bookingError } = await supabase
    .from("bookings")
    .insert({ ...payload.booking, booking_number })
    .select("id, booking_number")
    .single()

  if (bookingError || !booking) {
    return { error: bookingError?.message ?? "Buchung fehlgeschlagen." }
  }

  // Insert participants
  const { error: participantsError } = await supabase
    .from("participants")
    .insert(payload.participants.map((p) => ({ ...p, booking_id: booking.id })))

  if (participantsError) {
    return { error: "Teilnehmerdaten konnten nicht gespeichert werden." }
  }

  // Insert invoice recipient
  const { error: recipientError } = await supabase
    .from("invoice_recipients")
    .insert({ ...payload.invoiceRecipient, booking_id: booking.id })

  if (recipientError) {
    return { error: "Rechnungsempfänger konnte nicht gespeichert werden." }
  }

  return { booking_number: booking.booking_number, id: booking.id }
}

export async function getBookingByNumber(booking_number: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("bookings")
    .select(
      `*,
       course:courses(*),
       participants(*),
       invoice_recipient:invoice_recipients(*)`
    )
    .eq("booking_number", booking_number)
    .single()

  if (error) return null
  return data
}

export async function getUserBookings(): Promise<UserBooking[]> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from("bookings")
    .select(`*, course:courses(id, title, date, start_time, end_time, photo_url)`)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) return []
  return data ?? []
}
