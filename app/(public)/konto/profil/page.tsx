import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getProfile, upsertProfile } from "@/lib/supabase/queries/profiles"
import { ProfilForm } from "./ProfilForm"
import { DeleteAccountSection } from "@/components/konto/DeleteAccountSection"

export const metadata: Metadata = {
  title: "Mein Profil — menufaktur",
}

export default async function KontoProfilPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/login?redirect=/konto/profil")

  const profile = await getProfile()

  async function saveProfile(formData: FormData) {
    "use server"
    await upsertProfile({
      first_name: (formData.get("first_name") as string) || null,
      last_name: (formData.get("last_name") as string) || null,
      phone: (formData.get("phone") as string) || null,
      address_line1: (formData.get("address_line1") as string) || null,
      postal_code: (formData.get("postal_code") as string) || null,
      city: (formData.get("city") as string) || null,
      country: (formData.get("country") as string) || "DE",
    })
  }

  return (
    <div>
      <header className="mb-12">
        <h1 className="text-4xl font-bold text-wine-red tracking-tight mb-3">
          Mein Profil
        </h1>
        <p className="text-dark/50 font-condensed leading-relaxed max-w-2xl">
          Verwalten Sie Ihre persönlichen Daten und Kontaktinformationen.
        </p>
      </header>

      <ProfilForm
        profile={profile}
        email={user.email ?? ""}
        saveAction={saveProfile}
      />

      <DeleteAccountSection />
    </div>
  )
}
