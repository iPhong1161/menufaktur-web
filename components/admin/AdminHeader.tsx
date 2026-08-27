"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { CircleUser } from "lucide-react"
import { cn } from "@/lib/utils"
import { AdminLogoutButton } from "./AdminLogoutButton"
import { NotificationBell } from "./NotificationBell"

type NavItem = { href: string; label: string; badge?: number }

function buildAdminNav(unreadCount: number): NavItem[] {
  return [
    { href: "/admin/dashboard", label: "Dashboard" },
    { href: "/admin/kurse", label: "Kurse" },
    { href: "/admin/buchungen", label: "Buchungen" },
    { href: "/admin/gutscheine", label: "Gutscheine" },
    { href: "/admin/kunden", label: "Kunden" },
    { href: "/admin/nachrichten", label: "Nachrichten", badge: unreadCount > 0 ? unreadCount : undefined },
  ]
}

function buildModeratorNav(unreadCount: number): NavItem[] {
  return [
    { href: "/admin/kurse", label: "Kurse" },
    { href: "/admin/buchungen", label: "Buchungen" },
    { href: "/admin/gutscheine", label: "Gutscheine" },
    { href: "/admin/nachrichten", label: "Nachrichten", badge: unreadCount > 0 ? unreadCount : undefined },
  ]
}

export function AdminHeader({ role, unreadMessages = 0 }: { role: "admin" | "moderator"; unreadMessages?: number }) {
  const pathname = usePathname()
  const navLinks = role === "admin" ? buildAdminNav(unreadMessages) : buildModeratorNav(unreadMessages)
  const brandHref = role === "admin" ? "/admin/dashboard" : "/admin/kurse"

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#fdfadf] border-b border-wine-red/10 h-20 flex items-center px-8">
      <div className="flex items-center justify-between w-full">
        {/* Brand + nav */}
        <div className="flex items-center gap-10">
          <Link href={brandHref} className="flex items-center gap-3 shrink-0">
            <div className="w-8 h-8 bg-wine-red rounded-md shrink-0" />
            <span className="text-xl font-bold text-wine-red tracking-widest uppercase">
              menufaktur
            </span>
          </Link>
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map(({ href, label, badge }) => {
              const active =
                pathname === href ||
                pathname.startsWith(href + "/") ||
                (href === "/admin/dashboard" && pathname === "/admin")
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "relative text-sm transition-colors pb-1",
                    active
                      ? "text-wine-red font-bold border-b-2 border-wine-red"
                      : "text-dark/50 font-medium hover:text-wine-red"
                  )}
                >
                  {label}
                  {badge !== undefined && (
                    <span className="absolute -top-2 -right-4 min-w-[18px] h-[18px] bg-wine-red text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                      {badge}
                    </span>
                  )}
                </Link>
              )
            })}
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <NotificationBell />
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
