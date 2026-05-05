"use server"

import { revalidatePath } from "next/cache"
import { updateBookingPaymentStatus } from "@/lib/supabase/queries/admin-bookings"
import { createServiceClient } from "@/lib/supabase/server"

export async function markBookingPaidAction(
  id: string
): Promise<{ error: string } | { success: true }> {
  const result = await updateBookingPaymentStatus(id)
  if ("error" in result) return { error: result.error }
  revalidatePath("/admin/buchungen")
  return { success: true }
}

export async function removeParticipantAction(
  participantId: string,
  bookingId: string,
  bookingNumber: string
): Promise<{ error: string } | { success: true }> {
  const supabase = createServiceClient()

  const [bookingResult, participantResult] = await Promise.all([
    supabase
      .from("bookings")
      .select("course_id, total_amount, payment_status")
      .eq("id", bookingId)
      .single(),
    supabase
      .from("participants")
      .select("is_primary")
      .eq("id", participantId)
      .single(),
  ])

  if (bookingResult.error || !bookingResult.data)
    return { error: "Buchung nicht gefunden." }
  if (participantResult.error || !participantResult.data)
    return { error: "Teilnehmer nicht gefunden." }
  if (participantResult.data.is_primary)
    return { error: "Hauptteilnehmer kann nicht entfernt werden." }

  const { data: course } = await supabase
    .from("courses")
    .select("price_per_person")
    .eq("id", bookingResult.data.course_id)
    .single()

  const pricePerPerson = Number(course?.price_per_person ?? 0)

  const { error: deleteError } = await supabase
    .from("participants")
    .delete()
    .eq("id", participantId)

  if (deleteError) return { error: deleteError.message }

  const newTotal = Number(bookingResult.data.total_amount) - pricePerPerson

  const { error: updateError } = await supabase
    .from("bookings")
    .update({ total_amount: Math.max(0, newTotal) })
    .eq("id", bookingId)

  if (updateError) return { error: updateError.message }

  // TODO: if payment_status is paid, admin should be notified that a partial refund
  // may be needed — implement in v1.1 with Stripe refund API

  revalidatePath(`/admin/buchungen/${bookingNumber}`)
  return { success: true }
}

export interface AddParticipantData {
  firstName: string
  lastName: string
  email: string
  phone?: string
  foodPreferences: string[]
}

export async function addParticipantAction(
  bookingId: string,
  bookingNumber: string,
  courseId: string,
  data: AddParticipantData
): Promise<{ error: string } | { success: true }> {
  const supabase = createServiceClient()

  const { data: course } = await supabase
    .from("courses")
    .select("capacity, price_per_person")
    .eq("id", courseId)
    .single()

  if (!course) return { error: "Kurs nicht gefunden." }

  // Count current active participants for this course across all bookings
  const { data: activeBookings } = await supabase
    .from("bookings")
    .select("id")
    .eq("course_id", courseId)
    .in("status", ["pending", "confirmed"])

  const bookingIds = (activeBookings ?? []).map((b) => b.id)
  const { count: participantCount } = bookingIds.length > 0
    ? await supabase
        .from("participants")
        .select("*", { count: "exact", head: true })
        .in("booking_id", bookingIds)
    : { count: 0 }

  if ((participantCount ?? 0) >= course.capacity)
    return { error: "Kurs ist ausgebucht, kein Platz mehr verfügbar." }

  const { error: insertError } = await supabase
    .from("participants")
    .insert({
      booking_id: bookingId,
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      phone: data.phone || null,
      food_preferences: data.foodPreferences,
      is_primary: false,
    })

  if (insertError) return { error: insertError.message }

  const { data: booking } = await supabase
    .from("bookings")
    .select("total_amount")
    .eq("id", bookingId)
    .single()

  if (booking) {
    await supabase
      .from("bookings")
      .update({ total_amount: Number(booking.total_amount) + Number(course.price_per_person) })
      .eq("id", bookingId)
  }

  revalidatePath(`/admin/buchungen/${bookingNumber}`)
  return { success: true }
}
