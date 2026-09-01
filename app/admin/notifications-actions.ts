"use server"

import { createServiceClient, getAdminUser } from "@/lib/supabase/server"

export interface NotificationMessage {
  id: string
  subject: string
  name: string
  created_at: string
}

export interface NotificationBooking {
  id: string
  booking_number: string
  created_at: string
  total_amount: number
}

export interface NotificationVoucher {
  id: string
  code: string
  value: number
  recipient_name: string
  created_at: string
  postal_address: Record<string, string> | null
}

export interface NotificationsPayload {
  totalCount: number
  messages: { count: number; items: NotificationMessage[] }
  unpaidBookings: { count: number; items: NotificationBooking[] }
  postalVouchers: { count: number; items: NotificationVoucher[] }
}

const ITEMS_PER_CATEGORY = 3
const BOOKING_STALE_DAYS = 3

function daysAgoISO(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() - days)
  return d.toISOString()
}

export async function getNotifications(): Promise<NotificationsPayload | { error: string }> {
  const adminUser = await getAdminUser()
  if (!adminUser) return { error: "Keine Berechtigung." }

  const supabase = createServiceClient()

  const staleBefore = daysAgoISO(BOOKING_STALE_DAYS)

  const [messagesRes, bookingsRes, vouchersRes] = await Promise.all([
    supabase
      .from("contact_messages")
      .select("id, subject, name, created_at", { count: "exact" })
      .eq("read", false)
      .order("created_at", { ascending: false })
      .limit(ITEMS_PER_CATEGORY),
    supabase
      .from("bookings")
      .select("id, booking_number, created_at, total_amount", { count: "exact" })
      .eq("payment_status", "unpaid")
      .eq("payment_method", "bank_transfer")
      .lt("created_at", staleBefore)
      .order("created_at", { ascending: false })
      .limit(ITEMS_PER_CATEGORY),
    supabase
      .from("vouchers")
      .select("id, code, value, recipient_name, created_at, postal_address", { count: "exact" })
      .not("postal_address", "is", null)
      .eq("status", "active")
      .is("dispatched_at", null)
      .order("created_at", { ascending: false })
      .limit(ITEMS_PER_CATEGORY),
  ])

  const messageItems = (messagesRes.data ?? []) as NotificationMessage[]
  const bookingItems = ((bookingsRes.data ?? []) as Array<{
    id: string
    booking_number: string
    created_at: string
    total_amount: number | string
  }>).map((b) => ({
    id: b.id,
    booking_number: b.booking_number,
    created_at: b.created_at,
    total_amount: Number(b.total_amount),
  }))
  const voucherItems = ((vouchersRes.data ?? []) as Array<{
    id: string
    code: string
    value: number | string
    recipient_name: string
    created_at: string
    postal_address: Record<string, string> | null
  }>).map((v) => ({
    id: v.id,
    code: v.code,
    value: Number(v.value),
    recipient_name: v.recipient_name,
    created_at: v.created_at,
    postal_address: v.postal_address,
  }))

  const messagesCount = messagesRes.count ?? messageItems.length
  const bookingsCount = bookingsRes.count ?? bookingItems.length
  const vouchersCount = vouchersRes.count ?? voucherItems.length

  return {
    totalCount: messagesCount + bookingsCount + vouchersCount,
    messages: { count: messagesCount, items: messageItems },
    unpaidBookings: { count: bookingsCount, items: bookingItems },
    postalVouchers: { count: vouchersCount, items: voucherItems },
  }
}
