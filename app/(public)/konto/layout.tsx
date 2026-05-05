import { headers } from "next/headers"
import Link from "next/link"
import { redirect } from "next/navigation"
import { Calendar, Ticket, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/server"
import { getProfile } from "@/lib/supabase/queries/profiles"
import { KontoLogoutButton } from "@/components/konto/KontoLogoutButton"

const NAV_ITEMS = [
  { href: "/konto/buchungen", icon: Calendar, label: "Meine Buchungen" },
  { href: "/konto/gutscheine", icon: Ticket, label: "Meine Gutscheine" },
  { href: "/konto/profil", icon: User, label: "Profil" },
]

export default async function KontoLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    const pathname = (await headers()).get("x-pathname") ?? "/konto/buchungen"
    redirect(`/login?redirect=${encodeURIComponent(pathname)}`)
  }

  const profile = await getProfile()
  const pathname = (await headers()).get("x-pathname") ?? ""

  return (
    <div className="bg-light-beige min-h-screen">
      <div className="max-w-screen-xl mx-auto px-6 md:px-12 pt-32 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 items-start">
          <aside className="md:col-span-1">
            <nav className="bg-white rounded-xl p-6 shadow-sm border border-dark/5 sticky top-32">
              <div className="mb-8">
                <p className="text-[10px] font-bold uppercase tracking-widest text-wine-red/60 mb-1">
                  menufaktur
                </p>
                <p className="text-dark/50 font-condensed text-sm truncate">
                  Guten Tag, {profile?.first_name ?? user.email}
                </p>
              </div>
              <ul className="space-y-1">
                {NAV_ITEMS.map(({ href, icon: Icon, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 text-sm font-condensed transition-all",
                        pathname === href || pathname.startsWith(href + "/")
                          ? "text-wine-red font-bold border-l-4 border-wine-red bg-wine-red/5 rounded-r-xl"
                          : "text-dark/50 hover:bg-wine-red/5 rounded-xl"
                      )}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-8 pt-6 border-t border-dark/8">
                <KontoLogoutButton />
              </div>
            </nav>
          </aside>

          <section className="md:col-span-3">{children}</section>
        </div>
      </div>
    </div>
  )
}
