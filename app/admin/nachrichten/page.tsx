import type { Metadata } from "next"
import { headers } from "next/headers"
import { createServiceClient } from "@/lib/supabase/server"
import { NachrichtenClient, type ContactMessage } from "./NachrichtenClient"

export const metadata: Metadata = { title: "Nachrichten — menufaktur Admin" }

export default async function AdminNachrichtenPage() {
  const hdrs = await headers()
  const role = (hdrs.get("x-admin-role") ?? "moderator") as "admin" | "moderator"

  const supabase = createServiceClient()
  const { data } = await supabase
    .from("contact_messages")
    .select(
      "id, created_at, name, email, subject, message, read, category, booking_number, course_title, company"
    )
    .order("created_at", { ascending: false })

  const messages: ContactMessage[] = data ?? []

  // Resolve booking numbers to ids so the inbox can deep-link into the booking
  // detail page. A sender can mistype the number, so misses are expected and
  // simply render as plain text.
  const bookingNumbers = Array.from(
    new Set(messages.map((m) => m.booking_number).filter((n): n is string => !!n))
  )
  let bookingIdByNumber: Record<string, string> = {}
  if (bookingNumbers.length > 0) {
    const { data: bookings } = await supabase
      .from("bookings")
      .select("id, booking_number")
      .in("booking_number", bookingNumbers)
    bookingIdByNumber = Object.fromEntries(
      (bookings ?? []).map((b) => [b.booking_number, b.id])
    )
  }

  return (
    <main className="flex-grow pt-32 pb-16 px-8 max-w-screen-xl mx-auto w-full">
      <NachrichtenClient
        messages={messages}
        role={role}
        bookingIdByNumber={bookingIdByNumber}
      />
    </main>
  )
}
