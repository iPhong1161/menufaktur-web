import { createClient, createServiceClient } from "@/lib/supabase/server"
import type { Database } from "@/types/database"

type CourseRow = Database["public"]["Tables"]["courses"]["Row"]

export interface CourseWithCapacity extends CourseRow {
  booked_count: number
  remaining_capacity: number
}

export async function getCourses(dietary?: string[]): Promise<CourseWithCapacity[]> {
  const supabase = await createClient()

  let query = supabase
    .from("courses")
    .select("*")
    .eq("status", "published")
    .gte("date", new Date().toISOString().split("T")[0])
    .order("date", { ascending: true })

  if (dietary && dietary.length > 0) {
    query = query.contains("food_options", dietary)
  }

  const { data: courses, error } = await query

  if (error || !courses) return []

  const countMap: Record<string, number> = {}
  try {
    const serviceSupabase = createServiceClient()
    const courseIds = courses.map((c) => c.id)
    const { data: activeBookings } = await serviceSupabase
      .from("bookings")
      .select("id, course_id")
      .in("course_id", courseIds)
      .in("status", ["pending", "confirmed"])

    if (activeBookings && activeBookings.length > 0) {
      const bookingIds = activeBookings.map((b) => b.id)
      const { data: participants } = await serviceSupabase
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
  } catch {
    // capacity count failed — return courses with 0 booked
  }

  return courses.map((c) => ({
    ...c,
    booked_count: countMap[c.id] ?? 0,
    remaining_capacity: c.capacity - (countMap[c.id] ?? 0),
  }))
}

export async function getCourseBySlug(
  slug: string
): Promise<CourseWithCapacity | null> {
  const supabase = await createClient()

  const { data: course, error } = await supabase
    .from("courses")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single()

  if (error || !course) return null

  const serviceSupabase = createServiceClient()
  const { data: bookings } = await serviceSupabase
    .from("bookings")
    .select("id")
    .eq("course_id", course.id)
    .in("status", ["pending", "confirmed"])

  const bookingIds = (bookings ?? []).map((b) => b.id)
  const { count } = bookingIds.length > 0
    ? await serviceSupabase
        .from("participants")
        .select("*", { count: "exact", head: true })
        .in("booking_id", bookingIds)
        .eq("cancelled", false)
    : { count: 0 }

  return {
    ...course,
    booked_count: count ?? 0,
    remaining_capacity: course.capacity - (count ?? 0),
  }
}

export async function getCourseById(
  id: string
): Promise<CourseWithCapacity | null> {
  const supabase = await createClient()

  const { data: course, error } = await supabase
    .from("courses")
    .select("*")
    .eq("id", id)
    .eq("status", "published")
    .single()

  if (error || !course) return null

  const serviceSupabase = createServiceClient()
  const { data: bookings } = await serviceSupabase
    .from("bookings")
    .select("id")
    .eq("course_id", course.id)
    .in("status", ["pending", "confirmed"])

  const bookingIds = (bookings ?? []).map((b) => b.id)
  const { count } = bookingIds.length > 0
    ? await serviceSupabase
        .from("participants")
        .select("*", { count: "exact", head: true })
        .in("booking_id", bookingIds)
        .eq("cancelled", false)
    : { count: 0 }

  return {
    ...course,
    booked_count: count ?? 0,
    remaining_capacity: course.capacity - (count ?? 0),
  }
}

/**
 * Distinct titles of upcoming published courses, for the Kurs select on the
 * contact form. The same course title can recur on several dates, so titles are
 * deduped and returned in date order (soonest first).
 */
export async function getUpcomingCourseTitles(): Promise<string[]> {
  const supabase = await createClient()

  const { data } = await supabase
    .from("courses")
    .select("title, date")
    .eq("status", "published")
    .gte("date", new Date().toISOString().split("T")[0])
    .order("date", { ascending: true })

  return Array.from(new Set((data ?? []).map((c) => c.title)))
}
