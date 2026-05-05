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
    query = query.overlaps("food_options", dietary)
  }

  const { data: courses, error } = await query

  if (error || !courses) return []

  // Fetch booked participant counts for all returned courses
  // Service client bypasses RLS — needed to count participants across all bookings
  // (anon RLS only sees participants from the current user's own bookings)
  const serviceSupabase = await createServiceClient()
  const courseIds = courses.map((c) => c.id)
  const { data: activeBookings } = await serviceSupabase
    .from("bookings")
    .select("id, course_id")
    .in("course_id", courseIds)
    .in("status", ["pending", "confirmed"])

  const countMap: Record<string, number> = {}
  if (activeBookings && activeBookings.length > 0) {
    const bookingIds = activeBookings.map((b) => b.id)
    const { data: participants } = await serviceSupabase
      .from("participants")
      .select("booking_id")
      .in("booking_id", bookingIds)

    const bookingCourseMap: Record<string, string> = {}
    for (const b of activeBookings) bookingCourseMap[b.id] = b.course_id

    for (const p of participants ?? []) {
      const courseId = bookingCourseMap[p.booking_id]
      if (courseId) countMap[courseId] = (countMap[courseId] ?? 0) + 1
    }
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

  const serviceSupabase = await createServiceClient()
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

  const serviceSupabase = await createServiceClient()
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
    : { count: 0 }

  return {
    ...course,
    booked_count: count ?? 0,
    remaining_capacity: course.capacity - (count ?? 0),
  }
}
