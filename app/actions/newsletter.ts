"use server"

import { createServiceClient } from "@/lib/supabase/server"

export async function subscribeNewsletterAction(
  email: string
): Promise<{ success: true } | { error: string }> {
  const trimmed = email.trim().toLowerCase()

  if (!trimmed) return { error: "E-Mail-Adresse erforderlich." }
  if (trimmed.length > 254) return { error: "Eingabe zu lang." }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return { error: "Ungültige E-Mail-Adresse." }
  }

  const supabase = createServiceClient()
  const { error } = await supabase
    .from("newsletter_subscribers")
    .insert({ email: trimmed })

  if (error) {
    if (error.code === "23505") {
      // Already subscribed — succeed silently to avoid email enumeration
      return { success: true }
    }
    console.error("[newsletter]", error)
    return { error: "Anmeldung fehlgeschlagen. Bitte versuchen Sie es erneut." }
  }

  return { success: true }
}
