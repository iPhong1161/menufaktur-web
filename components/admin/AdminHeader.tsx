"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bell, CircleUser, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { AdminLogoutButton } from "./AdminLogoutButton"

const NAV_LINKS = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/kurse", label: "Kurse" },
  { href: "/admin/buchungen", label: "Buchungen" },
  { href: "/admin/gutscheine", label: "Gutscheine" },
  { href: "/admin/kunden", label: "Kunden" },
]

export function AdminHeader() {
  const pathname = usePathname()

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#fdfadf] border-b border-wine-red/10 h-20 flex items-center px-8">
      <div className="flex items-center justify-between w-full">
        {/* Brand + nav */}
        <div className="flex items-center gap-10">
          <Link href="/admin/dashboard" className="flex items-center gap-3 shrink-0">
            <div className="w-8 h-8 bg-wine-red rounded-md shrink-0" />
            <span className="text-xl font-bold text-wine-red tracking-widest uppercase">
              menufaktur
            </span>
          </Link>
          <div className="hidden lg:flex items-center gap-6">
            {NAV_LINKS.map(({ href, label }) => {
              const active =
                pathname === href ||
                pathname.startsWith(href + "/") ||
                (href === "/admin/dashboard" && pathname === "/admin")
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "text-sm transition-colors pb-1",
                    active
                      ? "text-wine-red font-bold border-b-2 border-wine-red"
                      : "text-dark/50 font-medium hover:text-wine-red"
                  )}
                >
                  {label}
                </Link>
              )
            })}
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <div className="relative hidden lg:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark/30" />
            <input
              type="text"
              placeholder="Suchen..."
              className="pl-9 pr-4 py-2 bg-[#ECE9CF] border-none rounded-xl text-sm w-56 focus:outline-none focus:ring-2 focus:ring-wine-red/20 text-dark placeholder:text-dark/30"
            />
          </div>
          <button className="p-2 hover:bg-wine-red/5 rounded-lg text-dark/60 transition-colors">
            <Bell className="w-5 h-5" />
          </button>
          <Link href="/admin/einstellungen" className="p-2 hover:bg-wine-red/5 rounded-lg text-dark/60 transition-colors">
            <CircleUser className="w-5 h-5" />
          </Link>
          <div className="w-px h-5 bg-dark/10 mx-1" />
          <AdminLogoutButton />
        </div>
      </div>
    </nav>
  )
}
