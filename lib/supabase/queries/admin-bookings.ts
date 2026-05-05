import { createServiceClient } from "@/lib/supabase/server"

export interface AdminBookingRow {
  id: string
  booking_number: string
  status: "pending" | "confirmed" | "cancelled" | "refunded"
  payment_status: "unpaid" | "paid" | "refunded"
  payment_method: "card" | "sepa" | "bank_transfer"
  total_amount: number
  created_at: string
  user_id: string | null
  course_id: string
  course: { id: string; title: string; date: string; start_time: string } | null
  profile: { first_name: string | null; last_name: string | null; email: string | null } | null
  participant_count: number
}

export interface AdminBookingDetail {
  id: string
  booking_number: string
  status: "pending" | "confirmed" | "cancelled" | "refunded"
  payment_status: "unpaid" | "paid" | "refunded"
  payment_method: "card" | "sepa" | "bank_transfer"
  total_amount: number
  created_at: string
  user_id: string | null
  course_id: string
  confirmation_email_sent: boolean
  course: {
    id: string
    title: string
    date: string
    start_time: string
    end_time: string
    photo_url: string | null
  } | null
  participants: Array<{
    id: string
    first_name: string
    last_name: string
    email: string
    phone: string | null
    food_preferences: string[]
    food_notes: string | null
    is_primary: boolean
  }>
  invoice_recipient: {
    first_name: string
    last_name: string
    company_name: string | null
    address_line1: string
    postal_code: string
    city: string
    country: string
    email: string
    vat_id: string | null
    is_business: boolean
  } | null
}

type ProfileRow = { first_name: string | null; last_name: string | null; email: string | null }

async function fetchBookingDeps(
  supabase: Awaited<ReturnType<typeof createServiceClient>>,
  bookings: Array<{ id: string; course_id: string; user_id: string | null }>
) {
  const courseIds = [...new Set(bookings.map((b) => b.course_id))]
  const userIds = [...new Set(bookings.map((b) => b.user_id).filter((id): id is string => id !== null))]
  const bookingIds = bookings.map((b) => b.id)

  const [coursesResult, profilesResult, participantsResult] = await Promise.all([
    courseIds.length > 0
      ? supabase.from("courses").select("id, title, date, start_time").in("id", courseIds)
      : Promise.resolve({ data: [] as Array<{ id: string; title: string; date: string; start_time: string }> }),
    userIds.length > 0
      ? supabase.from("profiles").select("id, first_name, last_name, email").in("id", userIds)
      : Promise.resolve({ data: [] as Array<{ id: string } & ProfileRow> }),
    bookingIds.length > 0
      ? supabase.from("participants").select("booking_id").in("booking_id", bookingIds)
      : Promise.resolve({ data: [] as Array<{ booking_id: string }> }),
  ])

  const courseMap: Record<string, { id: string; title: string; date: string; start_time: string }> = {}
  for (const c of coursesResult.data ?? []) courseMap[c.id] = c

  const profileMap: Record<string, ProfileRow> = {}
  for (const p of profilesResult.data ?? []) profileMap[p.id] = p

  const countMap: Record<string, number> = {}
  for (const p of participantsResult.data ?? []) {
    countMap[p.booking_id] = (countMap[p.booking_id] ?? 0) + 1
  }

  return { courseMap, profileMap, countMap }
}

export async function getBookingsAdmin(): Promise<AdminBookingRow[]> {
  const supabase = await createServiceClient()

  const { data: bookings, error } = await supabase
    .from("bookings")
    .select("*")
    .order("created_at", { ascending: false })

  if (error || !bookings) return []

  const { courseMap, profileMap, countMap } = await fetchBookingDeps(supabase, bookings)

  return bookings.map((b) => ({
    ...b,
    course: courseMap[b.course_id] ?? null,
    profile: b.user_id ? (profileMap[b.user_id] ?? null) : null,
    participant_count: countMap[b.id] ?? 0,
  }))
}

export async function getBookingByNumberAdmin(
  booking_number: string
): Promise<AdminBookingDetail | null> {
  const supabase = await createServiceClient()

  const { data: booking, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("booking_number", booking_number)
    .single()

  if (error || !booking) return null

  const [courseResult, participantsResult, invoiceResult] = await Promise.all([
    supabase
      .from("courses")
      .select("id, title, date, start_time, end_time, photo_url")
      .eq("id", booking.course_id)
      .single(),
    supabase.from("participants").select("*").eq("booking_id", booking.id),
    supabase
      .from("invoice_recipients")
      .select("*")
      .eq("booking_id", booking.id)
      .maybeSingle(),
  ])

  return {
    ...booking,
    course: courseResult.data ?? null,
    participants: (participantsResult.data ?? []) as AdminBookingDetail["participants"],
    invoice_recipient: invoiceResult.data ?? null,
  }
}

export async function getRecentBookingsAdmin(): Promise<AdminBookingRow[]> {
  const supabase = await createServiceClient()

  const { data: bookings, error } = await supabase
    .from("bookings")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5)

  if (error || !bookings) return []

  const { courseMap, profileMap, countMap } = await fetchBookingDeps(supabase, bookings)

  return bookings.map((b) => ({
    ...b,
    course: courseMap[b.course_id] ?? null,
    profile: b.user_id ? (profileMap[b.user_id] ?? null) : null,
    participant_count: countMap[b.id] ?? 0,
  }))
}

export async function updateBookingPaymentStatus(
  id: string
): Promise<{ success: true } | { error: string }> {
  const supabase = await createServiceClient()
  const { error } = await supabase
    .from("bookings")
    .update({ payment_status: "paid", status: "confirmed" })
    .eq("id", id)
  if (error) return { error: error.message }
  return { success: true }
}
