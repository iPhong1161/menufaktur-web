import { headers } from "next/headers"
import Link from "next/link"
import { UserCircle } from "lucide-react"
import { Logo } from "@/components/layout/Logo"
import { HeaderMobileMenu } from "@/components/layout/HeaderMobileMenu"
import { createClient } from "@/lib/supabase/server"

const navLinks = [
  { href: "/kurse", label: "Kurse" },
  { href: "/gutschein", label: "Gutschein" },
  { href: "/private-events", label: "Private Events" },
  { href: "/ueber-uns", label: "Über uns" },
  { href: "/kontakt", label: "Kontakt" },
]

export async function Header() {
  const pathname = (await headers()).get("x-pathname") ?? ""
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const isLoggedIn = !!user

  return (
    <header className="fixed top-0 w-full z-50 bg-wine-red">
      <nav className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between h-16 md:h-20 relative">
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
                pathname.startsWith(link.href)
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
          {isLoggedIn ? (
            <Link
              href="/konto/buchungen"
              aria-label="Mein Konto"
              className="text-light-beige/70 hover:text-light-beige transition-colors duration-200"
            >
              <UserCircle className="w-6 h-6" />
            </Link>
          ) : (
            <Link
              href="/login"
              className="text-light-beige/70 hover:text-light-beige text-sm font-bold tracking-tight transition-colors duration-200"
            >
              Anmelden
            </Link>
          )}
          <Link
            href="/kurse"
            className="bg-gold-yellow text-white px-5 py-2 rounded-lg text-sm font-bold tracking-tight hover:opacity-90 transition-opacity"
          >
            Kurs buchen
          </Link>
        </div>

        {/* Mobile menu (client component handles toggle state) */}
        <HeaderMobileMenu pathname={pathname} isLoggedIn={isLoggedIn} />
      </nav>
    </header>
  )
}
