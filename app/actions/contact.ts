"use server"

import { createClient } from "@/lib/supabase/server"
import { isContactCategory, NO_COURSE_OPTION } from "@/lib/contact-categories"

export async function submitContactFormAction(payload: {
  name: string
  company?: string
  email: string
  category: string
  courseTitle?: string
  bookingNumber?: string
  message: string
}): Promise<{ success: true } | { error: string }> {
  const name = payload.name.trim()
  const email = payload.email.trim()
  const category = payload.category.trim()
  const message = payload.message.trim()
  const company = payload.company?.trim() ?? ""
  const bookingNumber = payload.bookingNumber?.trim() ?? ""
  const courseTitleRaw = payload.courseTitle?.trim() ?? ""
  // "Nicht kursbezogen" is the select's placeholder default, not a course.
  const courseTitle = courseTitleRaw === NO_COURSE_OPTION ? "" : courseTitleRaw

  if (!name) return { error: "Name darf nicht leer sein." }
  if (!email) return { error: "E-Mail darf nicht leer sein." }
  if (!category) return { error: "Bitte wählen Sie ein Anliegen." }
  if (!isContactCategory(category)) return { error: "Ungültiges Anliegen." }
  if (!message) return { error: "Nachricht darf nicht leer sein." }

  if (name.length > 200) return { error: "Eingabe zu lang." }
  if (company.length > 200) return { error: "Eingabe zu lang." }
  if (email.length > 254) return { error: "Eingabe zu lang." }
  if (bookingNumber.length > 50) return { error: "Eingabe zu lang." }
  if (courseTitle.length > 300) return { error: "Eingabe zu lang." }
  if (message.length > 5000) return { error: "Eingabe zu lang." }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Ungültige E-Mail-Adresse." }
  }

  // contact_messages.subject is NOT NULL and is still written by the voucher
  // webhook, so it stays — derived from the structured fields rather than typed
  // by the sender. The admin inbox reads category for its own column.
  const subject = bookingNumber
    ? `${category} — Buchung ${bookingNumber}`
    : courseTitle
      ? `${category} — ${courseTitle}`
      : category

  const supabase = await createClient()
  const { error } = await supabase.from("contact_messages").insert({
    name,
    email,
    subject,
    message,
    category,
    company: company || null,
    booking_number: bookingNumber || null,
    course_title: courseTitle || null,
  })

  if (error) return { error: "Nachricht konnte nicht gesendet werden. Bitte versuchen Sie es erneut." }
  return { success: true }
}
