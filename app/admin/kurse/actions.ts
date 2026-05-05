"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import {
  createCourse,
  updateCourse,
  deleteCourse,
  duplicateCourse,
} from "@/lib/supabase/queries/admin-courses"
import { createServiceClient } from "@/lib/supabase/server"
import type { Database } from "@/types/database"

type CourseInsert = Database["public"]["Tables"]["courses"]["Insert"]

export async function createCourseAction(
  data: Omit<CourseInsert, "id">
): Promise<{ error: string } | void> {
  const result = await createCourse(data)
  if ("error" in result) return { error: result.error }
  revalidatePath("/admin/kurse")
  redirect("/admin/kurse")
}

export async function updateCourseAction(
  id: string,
  data: Omit<CourseInsert, "id">
): Promise<{ error: string } | { success: true }> {
  const result = await updateCourse(id, data)
  if ("error" in result) return { error: result.error }
  revalidatePath("/admin/kurse")
  revalidatePath(`/admin/kurse/${id}/bearbeiten`)
  revalidatePath("/kurse")
  return { success: true }
}

export async function deleteCourseAction(
  id: string
): Promise<{ error: string } | { success: true }> {
  const result = await deleteCourse(id)
  if ("error" in result) return { error: result.error }
  revalidatePath("/admin/kurse")
  return { success: true }
}

export async function duplicateCourseAction(
  id: string
): Promise<{ error: string } | { success: true }> {
  const result = await duplicateCourse(id)
  if ("error" in result) return { error: result.error }
  revalidatePath("/admin/kurse")
  return { success: true }
}

export async function setParticipantCancelledAction(
  participantId: string,
  cancelled: boolean,
  courseId: string
): Promise<{ error: string } | { success: true }> {
  const supabase = createServiceClient()
  const { error } = await supabase
    .from("participants")
    .update({ cancelled })
    .eq("id", participantId)
  if (error) return { error: error.message }
  revalidatePath(`/admin/kurse/${courseId}`)
  return { success: true }
}
