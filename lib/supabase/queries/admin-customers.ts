import { createServiceClient } from "@/lib/supabase/server"
import type { Database } from "@/types/database"

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"]

export type AdminCustomer = ProfileRow & {
  booking_count: number
  is_admin: boolean
}

export type CustomerBooking = {
  id: string
  booking_number: string
  created_at: string
  status: "pending" | "confirmed" | "cancelled" | "refunded"
  payment_status: "unpaid" | "paid" | "refunded"
  payment_method: "card" | "sepa" | "bank_transfer"
  total_amount: number
  course: { id: string; title: string; date: string } | null
}

export type CustomerVoucher = {
  id: string
  code: string
  value: number
  remaining_value: number
  status: "active" | "redeemed" | "expired" | "cancelled"
  created_at: string
  expires_at: string | null
  payment_status: "unpaid" | "paid" | "refunded"
}

export async function getAdminCustomers(): Promise<AdminCustomer[]> {
  const supabase = createServiceClient()

  const [profilesResult, bookingsResult, adminUsersResult] = await Promise.all([
    supabase.from("profiles").select("*").order("created_at", { ascending: false }),
    supabase.from("bookings").select("user_id").not("user_id", "is", null),
    supabase.from("admin_users").select("user_id"),
  ])

  const bookingCounts: Record<string, number> = {}
  for (const b of bookingsResult.data ?? []) {
    if (b.user_id) bookingCounts[b.user_id] = (bookingCounts[b.user_id] ?? 0) + 1
  }
  const adminIds = new Set((adminUsersResult.data ?? []).map((a) => a.user_id))

  return (profilesResult.data ?? []).map((p) => ({
    ...p,
    booking_count: bookingCounts[p.id] ?? 0,
    is_admin: adminIds.has(p.id),
  }))
}

export async function getAdminCustomer(id: string): Promise<(AdminCustomer) | null> {
  const supabase = createServiceClient()

  const [profileResult, adminResult] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", id).single(),
    supabase.from("admin_users").select("id").eq("user_id", id).maybeSingle(),
  ])

  if (!profileResult.data) return null

  const bookingResult = await supabase
    .from("bookings")
    .select("id", { count: "exact", head: true })
    .eq("user_id", id)

  return {
    ...profileResult.data,
    booking_count: bookingResult.count ?? 0,
    is_admin: !!adminResult.data,
  }
}

export async function getCustomerBookings(userId: string): Promise<CustomerBooking[]> {
  const supabase = createServiceClient()

  const { data: bookings } = await supabase
    .from("bookings")
    .select("id, booking_number, created_at, status, payment_status, payment_method, total_amount, course_id")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (!bookings || bookings.length === 0) return []

  const courseIds = [...new Set(bookings.map((b) => b.course_id))]
  const { data: courses } = await supabase
    .from("courses")
    .select("id, title, date")
    .in("id", courseIds)

  const courseMap = Object.fromEntries((courses ?? []).map((c) => [c.id, c]))

  return bookings.map((b) => ({
    ...b,
    course: courseMap[b.course_id] ?? null,
  }))
}

export async function getCustomerVouchers(email: string): Promise<CustomerVoucher[]> {
  const supabase = createServiceClient()

  const { data } = await supabase
    .from("vouchers")
    .select("id, code, value, remaining_value, status, created_at, expires_at, payment_status")
    .eq("purchaser_email", email)
    .order("created_at", { ascending: false })

  return data ?? []
}

export async function getAdminCount(): Promise<number> {
  const supabase = createServiceClient()
  const { count } = await supabase
    .from("admin_users")
    .select("id", { count: "exact", head: true })
  return count ?? 0
}
