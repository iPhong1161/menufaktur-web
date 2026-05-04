import { createServiceClient } from "@/lib/supabase/server"

export async function getAdminDashboardStats() {
  const supabase = await createServiceClient()
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  const today = new Date().toISOString().split("T")[0]

  const [bookingsWeek, newRegistrations, upcomingCourses, pendingTransfers] = await Promise.all([
    supabase
      .from("bookings")
      .select("id", { count: "exact", head: true })
      .gte("created_at", sevenDaysAgo),
    supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .gte("created_at", sevenDaysAgo),
    supabase
      .from("courses")
      .select("id", { count: "exact", head: true })
      .eq("status", "published")
      .gte("date", today),
    supabase
      .from("bookings")
      .select("id", { count: "exact", head: true })
      .eq("payment_method", "bank_transfer")
      .eq("payment_status", "unpaid"),
  ])

  return {
    bookingsThisWeek: bookingsWeek.count ?? 0,
    newRegistrations: newRegistrations.count ?? 0,
    upcomingCourses: upcomingCourses.count ?? 0,
    pendingTransfers: pendingTransfers.count ?? 0,
  }
}
