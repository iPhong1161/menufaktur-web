"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Logo } from "@/components/layout/Logo"

const navLinks = [
  { href: "/kurse", label: "Kurse" },
  { href: "/gutschein", label: "Gutschein" },
  { href: "/private-events", label: "Private Events" },
  { href: "/ueber-uns", label: "Über uns" },
  { href: "/kontakt", label: "Kontakt" },
]

export function Header() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="fixed top-0 w-full z-50 bg-wine-red">
      <nav className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between h-16 md:h-20">
        <Link href="/" aria-label="menufaktur — zur Startseite">
          <Logo variant="light" height={44} className="hidden md:block" />
          <Logo variant="light" height={36} className="md:hidden" />
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-bold tracking-tight transition-colors duration-200 ${
                pathname?.startsWith(link.href)
                  ? "text-light-beige"
                  : "text-light-beige/70 hover:text-light-beige"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop actions */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/login"
            className="text-light-beige/80 hover:text-light-beige text-sm font-bold tracking-tight transition-colors duration-200"
          >
            Anmelden
          </Link>
          <Link
            href="/kurse"
            className="bg-gold-yellow text-white px-5 py-2 rounded-lg text-sm font-bold tracking-tight hover:opacity-90 transition-opacity"
          >
            Kurs buchen
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="md:hidden text-light-beige p-2 -mr-2"
          aria-label={mobileOpen ? "Menü schließen" : "Menü öffnen"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-wine-red border-t border-light-beige/10 px-6 py-4">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`py-3 text-sm font-bold transition-colors duration-200 ${
                  pathname?.startsWith(link.href)
                    ? "text-light-beige"
                    : "text-light-beige/70"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 pt-4 border-t border-light-beige/10 flex flex-col gap-3">
              <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="text-light-beige/80 text-sm font-bold"
            >
              Anmelden
            </Link>
            <Link
              href="/kurse"
              onClick={() => setMobileOpen(false)}
              className="bg-gold-yellow text-white px-5 py-3 rounded-lg text-sm font-bold text-center"
            >
              Kurs buchen
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
