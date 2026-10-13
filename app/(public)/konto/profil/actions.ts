"use server"

import { createClient, createServiceClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export async function deleteAccountAction(): Promise<{ error: string } | { success: true }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const userId = user.id
  const service = createServiceClient()

  // Block deletion if the user has active upcoming bookings
  const today = new Date().toISOString().split("T")[0]
  const { data: upcomingBookings } = await service
    .from("bookings")
    .select("id, courses!inner(date)")
    .eq("user_id", userId)
    .in("status", ["pending", "confirmed"])
    .gte("courses.date", today)
    .limit(1)
  if (upcomingBookings && upcomingBookings.length > 0) {
    return { error: "Sie haben noch aktive Buchungen. Bitte stornieren Sie diese zuerst oder kontaktieren Sie uns." }
  }

  // Step 1 — Anonymise profile row
  const { error: profileError } = await service
    .from("profiles")
    .update({
      first_name: "Gelöscht",
      last_name: "Nutzer",
      email: `deleted_${userId}@deleted.invalid`,
      phone: null,
      address_line1: null,
      postal_code: null,
      city: null,
    })
    .eq("id", userId)
  if (profileError) console.error("[deleteAccount] profiles:", profileError.message)

  // Step 2 — Collect booking IDs for this user
  const { data: bookings } = await service
    .from("bookings")
    .select("id")
    .eq("user_id", userId)

  const bookingIds = (bookings ?? []).map((b) => b.id)

  if (bookingIds.length > 0) {
    // Step 3a — Anonymise participants (personal data only)
    const { error: participantsError } = await service
      .from("participants")
      .update({
        first_name: "Gelöscht",
        last_name: "Nutzer",
        email: "deleted@deleted.invalid",
        phone: null,
        food_preferences: [],
      })
      .in("booking_id", bookingIds)
    if (participantsError) console.error("[deleteAccount] participants:", participantsError.message)

    // Step 3b — Anonymise invoice recipient names/emails only
    // Address, company, VAT fields are retained for GoBD compliance
    const { error: invoiceError } = await service
      .from("invoice_recipients")
      .update({
        first_name: "Gelöscht",
        last_name: "Nutzer",
        email: "deleted@deleted.invalid",
      })
      .in("booking_id", bookingIds)
    if (invoiceError) console.error("[deleteAccount] invoice_recipients:", invoiceError.message)
  }

  // Step 4 — Delete auth account (always attempted regardless of prior errors)
  const { error: deleteError } = await service.auth.admin.deleteUser(userId)
  if (deleteError) {
    console.error("[deleteAccount] auth deletion:", deleteError.message)
    return { error: "Konto konnte nicht gelöscht werden. Bitte kontaktieren Sie uns." }
  }

  return { success: true }
}
