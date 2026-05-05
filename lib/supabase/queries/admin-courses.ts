import { createServiceClient } from "@/lib/supabase/server"
import type { Database } from "@/types/database"

type CourseRow = Database["public"]["Tables"]["courses"]["Row"]
type CourseInsert = Database["public"]["Tables"]["courses"]["Insert"]
type CourseUpdate = Database["public"]["Tables"]["courses"]["Update"]

export interface AdminCourse extends CourseRow {
  booked_count: number
}

export async function getCoursesAdmin(): Promise<AdminCourse[]> {
  const supabase = createServiceClient()

  const { data: courses, error } = await supabase
    .from("courses")
    .select("*")
    .order("date", { ascending: false })

  console.log("[getCoursesAdmin] courses:", courses?.length ?? 0, "error:", error)
  if (error || !courses) return []

  const courseIds = courses.map((c) => c.id)
  if (courseIds.length === 0) return courses.map((c) => ({ ...c, booked_count: 0 }))

  const countMap: Record<string, number> = {}
  try {
    const { data: activeBookings, error: bookingsError } = await supabase
      .from("bookings")
      .select("id, course_id")
      .in("course_id", courseIds)
      .in("status", ["pending", "confirmed"])

    console.log("[getCoursesAdmin] activeBookings:", activeBookings?.length ?? 0, "bookingsError:", bookingsError)

    if (activeBookings && activeBookings.length > 0) {
      const bookingIds = activeBookings.map((b) => b.id)
      const { data: participants } = await supabase
        .from("participants")
        .select("booking_id")
        .in("booking_id", bookingIds)
        .eq("cancelled", false)

      const bookingCourseMap: Record<string, string> = {}
      for (const b of activeBookings) bookingCourseMap[b.id] = b.course_id

      for (const p of participants ?? []) {
        const courseId = bookingCourseMap[p.booking_id]
        if (courseId) countMap[courseId] = (countMap[courseId] ?? 0) + 1
      }
    }
  } catch (err) {
    console.error("[getCoursesAdmin] service client threw:", err)
  }

  return courses.map((c) => ({ ...c, booked_count: countMap[c.id] ?? 0 }))
}

export interface CourseBookingAdmin {
  id: string
  booking_number: string
  status: "pending" | "confirmed" | "cancelled" | "refunded"
  payment_status: "unpaid" | "paid" | "refunded"
  payment_method: string
  total_amount: number
  created_at: string
  participants: Array<{
    id: string
    first_name: string
    last_name: string
    email: string
    phone: string | null
    food_preferences: string[]
    is_primary: boolean
    cancelled: boolean
  }>
}

export interface CourseDetailAdmin {
  course: CourseRow
  bookings: CourseBookingAdmin[]
  total_booked_spots: number
  remaining_spots: number
  total_revenue: number
}

export async function getCourseDetailAdmin(id: string): Promise<CourseDetailAdmin | null> {
  const supabase = createServiceClient()

  const [courseResult, bookingsResult] = await Promise.all([
    supabase.from("courses").select("*").eq("id", id).single(),
    supabase
      .from("bookings")
      .select("id, booking_number, status, payment_status, payment_method, total_amount, created_at")
      .eq("course_id", id)
      .order("created_at", { ascending: false }),
  ])

  if (courseResult.error || !courseResult.data) return null

  const course = courseResult.data
  const bookings = bookingsResult.data ?? []

  if (bookings.length === 0) {
    return { course, bookings: [], total_booked_spots: 0, remaining_spots: course.capacity, total_revenue: 0 }
  }

  const bookingIds = bookings.map((b) => b.id)
  const { data: participants } = await supabase
    .from("participants")
    .select("id, booking_id, first_name, last_name, email, phone, food_preferences, is_primary, cancelled")
    .in("booking_id", bookingIds)

  const participantsByBooking: Record<string, CourseBookingAdmin["participants"]> = {}
  for (const p of participants ?? []) {
    if (!participantsByBooking[p.booking_id]) participantsByBooking[p.booking_id] = []
    participantsByBooking[p.booking_id].push(p as CourseBookingAdmin["participants"][number])
  }

  const activeStatuses = new Set(["pending", "confirmed"])
  let total_booked_spots = 0
  let total_revenue = 0

  const enrichedBookings: CourseBookingAdmin[] = bookings.map((b) => {
    const bParticipants = participantsByBooking[b.id] ?? []
    if (activeStatuses.has(b.status)) {
      total_booked_spots += bParticipants.filter((p) => !p.cancelled).length
      total_revenue += Number(b.total_amount)
    }
    return { ...b, participants: bParticipants }
  })

  return {
    course,
    bookings: enrichedBookings,
    total_booked_spots,
    remaining_spots: course.capacity - total_booked_spots,
    total_revenue,
  }
}

export async function getCourseByIdAdmin(id: string): Promise<CourseRow | null> {
  const supabase = createServiceClient()
  const { data, error } = await supabase.from("courses").select("*").eq("id", id).single()
  if (error) return null
  return data
}

export async function createCourse(
  data: Omit<CourseInsert, "id">
): Promise<{ id: string } | { error: string }> {
  const supabase = createServiceClient()
  const { data: row, error } = await supabase
    .from("courses")
    .insert(data)
    .select("id")
    .single()
  if (error || !row) return { error: error?.message ?? "Fehler beim Erstellen des Kurses." }
  return { id: row.id }
}

export async function updateCourse(
  id: string,
  data: CourseUpdate
): Promise<{ success: true } | { error: string }> {
  const supabase = createServiceClient()
  const { error } = await supabase.from("courses").update(data).eq("id", id)
  if (error) return { error: error.message }
  return { success: true }
}

export async function deleteCourse(
  id: string
): Promise<{ success: true } | { error: string }> {
  const supabase = createServiceClient()

  const { count } = await supabase
    .from("bookings")
    .select("*", { count: "exact", head: true })
    .eq("course_id", id)
    .eq("status", "confirmed")

  if (count && count > 0) {
    return {
      error: `Dieser Kurs hat ${count} bestätigte Buchung${count > 1 ? "en" : ""} und kann nicht gelöscht werden.`,
    }
  }

  const { error } = await supabase.from("courses").delete().eq("id", id)
  if (error) return { error: error.message }
  return { success: true }
}

export async function getUpcomingCoursesAdmin(): Promise<AdminCourse[]> {
  const supabase = createServiceClient()
  const today = new Date().toISOString().split("T")[0]

  const { data: courses, error } = await supabase
    .from("courses")
    .select("*")
    .eq("status", "published")
    .gte("date", today)
    .order("date", { ascending: true })
    .limit(5)

  if (error || !courses || courses.length === 0) return []

  const courseIds = courses.map((c) => c.id)
  const { data: activeBookings } = await supabase
    .from("bookings")
    .select("id, course_id")
    .in("course_id", courseIds)
    .in("status", ["pending", "confirmed"])

  const countMap: Record<string, number> = {}
  if (activeBookings && activeBookings.length > 0) {
    const bookingIds = activeBookings.map((b) => b.id)
    const { data: participants } = await supabase
      .from("participants")
      .select("booking_id")
      .in("booking_id", bookingIds)
      .eq("cancelled", false)

    const bookingCourseMap: Record<string, string> = {}
    for (const b of activeBookings) bookingCourseMap[b.id] = b.course_id

    for (const p of participants ?? []) {
      const courseId = bookingCourseMap[p.booking_id]
      if (courseId) countMap[courseId] = (countMap[courseId] ?? 0) + 1
    }
  }

  return courses.map((c) => ({ ...c, booked_count: countMap[c.id] ?? 0 }))
}

export async function duplicateCourse(
  id: string
): Promise<{ success: true } | { error: string }> {
  const supabase = createServiceClient()

  const { data: original, error: fetchError } = await supabase
    .from("courses")
    .select("*")
    .eq("id", id)
    .single()

  if (fetchError || !original) return { error: "Kurs nicht gefunden." }

  // Find unique slug
  const baseSlug = `${original.slug}-kopie`
  let slug = baseSlug
  let attempt = 2
  for (;;) {
    const { count } = await supabase
      .from("courses")
      .select("id", { count: "exact", head: true })
      .eq("slug", slug)
    if (!count) break
    slug = `${baseSlug}-${attempt++}`
  }

  const { id: _id, created_at: _ca, ...rest } = original
  const { error: insertError } = await supabase.from("courses").insert({
    ...rest,
    slug,
    title: `${original.title} (Kopie)`,
    status: "draft",
  })

  if (insertError) return { error: insertError.message }
  return { success: true }
}
