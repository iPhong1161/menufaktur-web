import { createServiceClient } from "@/lib/supabase/server"
import type { Database } from "@/types/database"

type CourseRow = Database["public"]["Tables"]["courses"]["Row"]
type CourseInsert = Database["public"]["Tables"]["courses"]["Insert"]
type CourseUpdate = Database["public"]["Tables"]["courses"]["Update"]

export interface AdminCourse extends CourseRow {
  booked_count: number
}

export async function getCoursesAdmin(): Promise<AdminCourse[]> {
  const supabase = await createServiceClient()

  const { data: courses, error } = await supabase
    .from("courses")
    .select("*")
    .order("date", { ascending: false })

  if (error || !courses) return []

  const courseIds = courses.map((c) => c.id)
  if (courseIds.length === 0) return courses.map((c) => ({ ...c, booked_count: 0 }))

  const { data: bookingRows } = await supabase
    .from("bookings")
    .select("course_id")
    .in("course_id", courseIds)
    .in("status", ["pending", "confirmed"])

  const countMap: Record<string, number> = {}
  for (const row of bookingRows ?? []) {
    countMap[row.course_id] = (countMap[row.course_id] ?? 0) + 1
  }

  return courses.map((c) => ({ ...c, booked_count: countMap[c.id] ?? 0 }))
}

export async function getCourseByIdAdmin(id: string): Promise<CourseRow | null> {
  const supabase = await createServiceClient()
  const { data, error } = await supabase.from("courses").select("*").eq("id", id).single()
  if (error) return null
  return data
}

export async function createCourse(
  data: Omit<CourseInsert, "id">
): Promise<{ id: string } | { error: string }> {
  const supabase = await createServiceClient()
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
  const supabase = await createServiceClient()
  const { error } = await supabase.from("courses").update(data).eq("id", id)
  if (error) return { error: error.message }
  return { success: true }
}

export async function deleteCourse(
  id: string
): Promise<{ success: true } | { error: string }> {
  const supabase = await createServiceClient()

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
  const supabase = await createServiceClient()
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
  const { data: bookingRows } = await supabase
    .from("bookings")
    .select("course_id")
    .in("course_id", courseIds)
    .in("status", ["pending", "confirmed"])

  const countMap: Record<string, number> = {}
  for (const row of bookingRows ?? []) {
    countMap[row.course_id] = (countMap[row.course_id] ?? 0) + 1
  }

  return courses.map((c) => ({ ...c, booked_count: countMap[c.id] ?? 0 }))
}

export async function duplicateCourse(
  id: string
): Promise<{ success: true } | { error: string }> {
  const supabase = await createServiceClient()

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
