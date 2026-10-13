import { createClient, createServiceClient } from "@/lib/supabase/server"

// Every read here goes through the service client, server-side only. The
// permissive "Booking number lookup" policy is being dropped, so the anon and
// cookie-based clients can no longer see bookings they do not own. Ownership is
// enforced in code instead: each function establishes the caller's identity via
// the cookie client's auth.getUser() and then filters by user_id explicitly.

export interface UserBooking {
  id: string
  booking_number: string
  status: "pending" | "confirmed" | "cancelled" | "refunded"
  total_amount: number
  created_at: string
  user_id: string | null
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

/** Shape returned to the booking confirmation page. */
export interface BookingConfirmation {
  booking_number: string
  total_amount: number
  course: {
    title: string
    date: string
    start_time: string
    end_time: string | null
    photo_url: string | null
  } | null
}

/**
 * Lookup for the post-checkout confirmation page, which a guest reaches via
 * Stripe's success_url without logging in.
 *
 * Deliberately narrow: no participant, invoice-recipient, payment or Stripe
 * fields are selected, because anyone holding the booking number can call this.
 * Pass userId to additionally require ownership.
 */
export async function getBookingByNumber(
  booking_number: string,
  userId: string | null = null
): Promise<BookingConfirmation | null> {
  const supabase = createServiceClient()

  let query = supabase
    .from("bookings")
    .select(
      `booking_number, total_amount,
       course:courses(title, date, start_time, end_time, photo_url)`
    )
    .eq("booking_number", booking_number)

  if (userId !== null) {
    query = query.eq("user_id", userId)
  }

  const { data, error } = await query.single()

  if (error || !data) return null
  return data as unknown as BookingConfirmation
}

export interface BookingDetail {
  id: string
  booking_number: string
  status: "pending" | "confirmed" | "cancelled" | "refunded"
  total_amount: number
  voucher_discount: number
  payment_method: string
  payment_status: string
  created_at: string
  course: {
    title: string
    date: string
    start_time: string
    end_time: string
    location: string
  } | null
  participants: {
    first_name: string
    last_name: string
    food_preferences: string[]
    is_primary: boolean
  }[]
}

export async function getUserBookingDetail(
  booking_number: string
): Promise<BookingDetail | null> {
  const authClient = await createClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) return null

  const supabase = createServiceClient()

  const { data, error } = await supabase
    .from("bookings")
    .select(`
      id, booking_number, status, total_amount, voucher_discount,
      payment_method, payment_status, created_at,
      course:courses(title, date, start_time, end_time, location),
      participants(first_name, last_name, food_preferences, is_primary)
    `)
    .eq("booking_number", booking_number)
    .eq("user_id", user.id)
    .single()

  if (error || !data) return null
  return data as unknown as BookingDetail
}

export async function getUserBookings(): Promise<UserBooking[]> {
  const authClient = await createClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) return []

  const supabase = createServiceClient()

  const { data, error } = await supabase
    .from("bookings")
    .select(
      `id, booking_number, status, total_amount, created_at, user_id, course_id,
       course:courses(id, title, date, start_time, end_time, photo_url)`
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) return []
  return (data ?? []) as unknown as UserBooking[]
}
