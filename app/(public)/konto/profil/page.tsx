import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getProfile } from "@/lib/supabase/queries/profiles"
import { DeleteAccountSection } from "@/components/konto/DeleteAccountSection"

export const metadata: Metadata = {
  title: "Mein Profil — menufaktur",
}

export default async function KontoProfilPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/login?redirect=/konto/profil")

  const profile = await getProfile()

  const displayName = [profile?.first_name, profile?.last_name].filter(Boolean).join(" ") || "—"

  return (
    <div>
      <header className="mb-12">
        <h1 className="text-4xl font-bold text-wine-red tracking-tight mb-3">
          Mein Profil
        </h1>
        <p className="text-dark/50 font-condensed leading-relaxed max-w-2xl">
          Ihre persönlichen Daten und Kontaktinformationen.
        </p>
      </header>

      <div className="bg-white rounded-xl border border-dark/8 shadow-sm p-8 max-w-xl mb-12">
        <dl className="space-y-6">
          <div>
            <dt className="text-[10px] font-bold uppercase tracking-widest text-dark/40 mb-1">
              Name
            </dt>
            <dd className="text-dark font-medium">{displayName}</dd>
          </div>
          <div>
            <dt className="text-[10px] font-bold uppercase tracking-widest text-dark/40 mb-1">
              E-Mail
            </dt>
            <dd className="text-dark font-medium">{user.email}</dd>
          </div>
        </dl>
      </div>

      <DeleteAccountSection />
    </div>
  )
}
