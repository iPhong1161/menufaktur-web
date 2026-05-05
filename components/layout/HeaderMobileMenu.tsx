"use client"

import { useState } from "react"
import Link from "next/link"
import { UserCircle } from "lucide-react"

const navLinks = [
  { href: "/kurse", label: "Kurse" },
  { href: "/gutschein", label: "Gutschein" },
  { href: "/private-events", label: "Private Events" },
  { href: "/ueber-uns", label: "Über uns" },
  { href: "/kontakt", label: "Kontakt" },
]

interface Props {
  pathname: string
  isLoggedIn: boolean
}

export function HeaderMobileMenu({ pathname, isLoggedIn }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        className="md:hidden text-light-beige p-2 -mr-2"
        aria-label={open ? "Menü schließen" : "Menü öffnen"}
        aria-expanded={open}
      >
        {open ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {open && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-wine-red border-t border-light-beige/10 px-6 py-4">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`py-3 text-sm font-bold transition-colors duration-200 ${
                  pathname.startsWith(link.href)
                    ? "text-light-beige"
                    : "text-light-beige/70"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 pt-4 border-t border-light-beige/10 flex flex-col gap-3">
            {isLoggedIn ? (
              <Link
                href="/konto/buchungen"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 text-light-beige/80 hover:text-light-beige text-sm font-bold transition-colors"
              >
                <UserCircle className="w-5 h-5" />
                Mein Konto
              </Link>
            ) : (
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="text-light-beige/80 text-sm font-bold"
              >
                Anmelden
              </Link>
            )}
            <Link
              href="/kurse"
              onClick={() => setOpen(false)}
              className="bg-gold-yellow text-white px-5 py-3 rounded-lg text-sm font-bold text-center"
            >
              Kurs buchen
            </Link>
          </div>
        </div>
      )}
    </>
  )
}
