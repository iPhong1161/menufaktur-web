import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getProfile } from "@/lib/supabase/queries/profiles"
import { KontoSidebarNav } from "@/components/konto/KontoSidebarNav"

export default async function KontoLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    const pathname = (await headers()).get("x-pathname") ?? "/konto/buchungen"
    redirect(`/login?redirect=${encodeURIComponent(pathname)}`)
  }

  const profile = await getProfile()
  const displayName = profile?.first_name ?? user.email ?? "Mein Konto"

  return (
    <div className="bg-light-beige min-h-screen">
      <div className="max-w-screen-xl mx-auto px-6 md:px-12 pt-32 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 items-start">
          <aside className="md:col-span-1">
            <KontoSidebarNav displayName={displayName} />
          </aside>

          <section className="md:col-span-3">{children}</section>
        </div>
      </div>
    </div>
  )
}
