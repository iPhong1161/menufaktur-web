"use server"

import { createClient, createServiceClient } from "@/lib/supabase/server"

export async function subscribeNewsletterAction(): Promise<{ success: true } | { error: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user?.email) return { error: "Nicht angemeldet." }

  const service = createServiceClient()
  const { error } = await service
    .from("newsletter_subscribers")
    .insert({ email: user.email.toLowerCase() })

  if (error) {
    if (error.code === "23505") return { success: true }
    console.error("[newsletter/subscribe]", error)
    return { error: "Anmeldung fehlgeschlagen." }
  }
  return { success: true }
}

export async function unsubscribeNewsletterAction(): Promise<{ success: true } | { error: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user?.email) return { error: "Nicht angemeldet." }

  const service = createServiceClient()
  const { error } = await service
    .from("newsletter_subscribers")
    .delete()
    .eq("email", user.email.toLowerCase())

  if (error) {
    console.error("[newsletter/unsubscribe]", error)
    return { error: "Abmeldung fehlgeschlagen." }
  }
  return { success: true }
}
