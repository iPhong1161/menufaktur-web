"use server"

import { createClient } from "@/lib/supabase/server"

export async function submitContactFormAction(payload: {
  name: string
  company?: string
  email: string
  subject: string
  message: string
}): Promise<{ success: true } | { error: string }> {
  if (!payload.name.trim()) return { error: "Name darf nicht leer sein." }
  if (!payload.email.trim()) return { error: "E-Mail darf nicht leer sein." }
  if (!payload.subject.trim()) return { error: "Betreff darf nicht leer sein." }
  if (!payload.message.trim()) return { error: "Nachricht darf nicht leer sein." }

  const company = payload.company?.trim() ?? ""

  if (payload.name.trim().length > 200) return { error: "Eingabe zu lang." }
  if (company.length > 200) return { error: "Eingabe zu lang." }
  if (payload.email.trim().length > 254) return { error: "Eingabe zu lang." }
  if (payload.subject.trim().length > 300) return { error: "Eingabe zu lang." }
  if (payload.message.trim().length > 5000) return { error: "Eingabe zu lang." }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email.trim())) {
    return { error: "Ungültige E-Mail-Adresse." }
  }

  const messageWithCompany = company
    ? `Firma: ${company}\n\n${payload.message.trim()}`
    : payload.message.trim()

  const supabase = await createClient()
  const { error } = await supabase.from("contact_messages").insert({
    name: payload.name.trim(),
    email: payload.email.trim(),
    subject: payload.subject.trim(),
    message: messageWithCompany,
  })

  if (error) return { error: "Nachricht konnte nicht gesendet werden. Bitte versuchen Sie es erneut." }
  return { success: true }
}
