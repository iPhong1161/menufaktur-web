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
    .select("id, created_at, name, email, subject, message, read")
    .order("created_at", { ascending: false })

  const messages: ContactMessage[] = data ?? []

  return (
    <main className="flex-grow pt-32 pb-16 px-8 max-w-screen-xl mx-auto w-full">
      <NachrichtenClient messages={messages} role={role} />
    </main>
  )
}
