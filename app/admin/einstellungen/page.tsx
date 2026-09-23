import type { Metadata } from "next"
import { getAdminUser } from "@/lib/supabase/server"
import { EinstellungenContent } from "./EinstellungenContent"

export const metadata: Metadata = { title: "Passwort ändern — menufaktur Admin" }

export default async function AdminEinstellungenPage() {
  const adminUser = await getAdminUser()
  const role = adminUser?.role ?? "admin"
  return <EinstellungenContent role={role} />
}
