"use server"

import { revalidatePath } from "next/cache"
import { updateBookingPaymentStatus } from "@/lib/supabase/queries/admin-bookings"
import { createServiceClient, getAdminUser } from "@/lib/supabase/server"
import { resend } from "@/lib/resend/client"
import { buildBookingConfirmedEmail, formatGermanDate, formatTime } from "@/lib/email/templates"

export async function markBookingPaidAction(
  id: string
): Promise<{ error: string } | { success: true }> {
  const adminUser = await getAdminUser()
  if (!adminUser) return { error: "Keine Berechtigung." }

  const result = await updateBookingPaymentStatus(id)
  if ("error" in result) return { error: result.error }

  // Send booking confirmed email (fire-and-forget)
  const supabase = createServiceClient()
  ;(async () => {
    const { data: booking } = await supabase
      .from("bookings")
      .select("booking_number, total_amount, course_id")
      .eq("id", id)
      .single()
    if (!booking) return
    const [{ data: course }, { data: participant }] = await Promise.all([
      supabase
        .from("courses")
        .select("title, date, start_time")
        .eq("id", booking.course_id)
        .single(),
      supabase
        .from("participants")
        .select("first_name, email")
        .eq("booking_id", id)
        .eq("is_primary", true)
        .single(),
    ])
    if (!course || !participant?.email) return
    await resend.emails.send({
      from: "noreply@menufaktur.de",
      to: participant.email,
      subject: "Buchung bestätigt — wir freuen uns auf Sie!",
      html: buildBookingConfirmedEmail({
        firstName: participant.first_name,
        bookingNumber: booking.booking_number,
        courseTitle: course.title,
        dateFormatted: formatGermanDate(course.date),
        startTime: formatTime(course.start_time),
        total: Number(booking.total_amount),
      }),
    })
  })().catch((err) => console.error("[markBookingPaidAction] confirmation email", err))

  revalidatePath("/admin/buchungen")
  return { success: true }
}

export async function removeParticipantAction(
  participantId: string,
  bookingId: string,
  bookingNumber: string
): Promise<{ error: string } | { success: true }> {
  const adminUser = await getAdminUser()
  if (!adminUser) return { error: "Keine Berechtigung." }

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

  if (deleteError) {
    console.error("[removeParticipantAction] delete", deleteError)
    return { error: "Teilnehmer konnte nicht entfernt werden." }
  }

  const newTotal = Number(bookingResult.data.total_amount) - pricePerPerson

  const { error: updateError } = await supabase
    .from("bookings")
    .update({ total_amount: Math.max(0, newTotal) })
    .eq("id", bookingId)

  if (updateError) {
    console.error("[removeParticipantAction] update total", updateError)
    return { error: "Buchungsbetrag konnte nicht aktualisiert werden." }
  }

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
  const adminUser = await getAdminUser()
  if (!adminUser) return { error: "Keine Berechtigung." }

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

  if (insertError) {
    console.error("[addParticipantAction] insert", insertError)
    return { error: "Teilnehmer konnte nicht hinzugefügt werden." }
  }

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
