"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Calendar, Ticket, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { KontoLogoutButton } from "./KontoLogoutButton"

const NAV_ITEMS = [
  { href: "/konto/buchungen", icon: Calendar, label: "Meine Buchungen" },
  { href: "/konto/gutscheine", icon: Ticket, label: "Meine Gutscheine" },
  { href: "/konto/profil", icon: User, label: "Profil" },
]

interface Props {
  displayName: string
}

export function KontoSidebarNav({ displayName }: Props) {
  const pathname = usePathname()

  return (
    <nav className="bg-white rounded-xl p-6 shadow-sm border border-dark/5 sticky top-32">
      <div className="mb-8">
        <p className="text-[10px] font-bold uppercase tracking-widest text-wine-red/60 mb-1">
          menufaktur
        </p>
        <p className="text-dark/50 font-condensed text-sm truncate">
          Guten Tag, {displayName}
        </p>
      </div>
      <ul className="space-y-1">
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || pathname.startsWith(href + "/")
          return (
            <li key={href}>
              <Link
                href={href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 text-sm font-condensed transition-all",
                  active
                    ? "text-wine-red font-bold border-l-4 border-wine-red bg-wine-red/5 rounded-r-xl"
                    : "text-dark/50 hover:text-wine-red hover:bg-wine-red/5 rounded-xl"
                )}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {label}
              </Link>
            </li>
          )
        })}
      </ul>
      <div className="mt-8 pt-6 border-t border-dark/8">
        <KontoLogoutButton />
      </div>
    </nav>
  )
}
