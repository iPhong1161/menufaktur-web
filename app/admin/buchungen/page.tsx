import type { Metadata } from "next"
import { headers } from "next/headers"
import { AdminBackButton } from "@/components/admin/AdminBackButton"
import { getBookingsAdmin } from "@/lib/supabase/queries/admin-bookings"
import { BuchungenClient } from "@/components/admin/BuchungenClient"

export const metadata: Metadata = { title: "Buchungen — menufaktur Admin" }

export default async function AdminBuchungenPage() {
  const bookings = await getBookingsAdmin()
  const role = ((await headers()).get("x-admin-role") ?? "moderator") as "admin" | "moderator"

  return (
    <main className="flex-grow pt-32 pb-16 px-8 max-w-screen-xl mx-auto w-full">
      <AdminBackButton />
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-5xl font-bold text-wine-red tracking-tight mb-1">Buchungen</h1>
          <p className="text-lg text-dark/50 font-condensed">
            Alle Buchungen einsehen und verwalten
          </p>
        </div>
      </header>
      <BuchungenClient bookings={bookings} role={role} />
    </main>
  )
}
