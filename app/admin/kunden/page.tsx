import type { Metadata } from "next"
import { getAdminCustomers } from "@/lib/supabase/queries/admin-customers"
import { KundenClient } from "./KundenClient"

export const metadata: Metadata = { title: "Kunden — menufaktur Admin" }

export default async function AdminKundenPage() {
  const customers = await getAdminCustomers()

  return (
    <main className="flex-grow pt-32 pb-20 px-8 max-w-screen-xl mx-auto w-full">
      <KundenClient customers={customers} />
    </main>
  )
}
