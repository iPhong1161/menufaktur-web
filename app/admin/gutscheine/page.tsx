import type { Metadata } from "next"
import { getVouchersAdmin } from "@/lib/supabase/queries/vouchers"
import { GutscheineClient } from "./GutscheineClient"

export const metadata: Metadata = { title: "Gutscheine — menufaktur Admin" }

export default async function AdminGutscheinePage() {
  const vouchers = await getVouchersAdmin()
  return (
    <main className="flex-grow pt-32 pb-16 px-8 max-w-screen-xl mx-auto w-full">
      <GutscheineClient vouchers={vouchers} />
    </main>
  )
}
