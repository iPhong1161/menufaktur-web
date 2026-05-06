import Link from "next/link"
import { Logo } from "@/components/layout/Logo"

const menuLinks = [
  { href: "/kurse", label: "Kurse" },
  { href: "/private-events", label: "Private Events" },
  { href: "/gutschein", label: "Gutschein" },
  { href: "/ueber-uns", label: "Über uns" },
]

const legalLinks = [
  { href: "/impressum", label: "Impressum" },
  { href: "/datenschutz", label: "Datenschutz" },
  { href: "/agb", label: "AGB" },
  { href: "/kontakt", label: "Kontakt" },
]

export function Footer() {
  return (
    <footer className="bg-wine-red text-light-beige">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 px-6 md:px-12 py-16">
        {/* Brand & contact */}
        <div className="space-y-6">
          <Logo variant="light" height={32} />
          <address className="not-italic text-light-beige/70 space-y-1 text-sm leading-relaxed">
            <p>Bornheimer Landwehr 46</p>
            <p>60385 Frankfurt am Main</p>
            <p className="pt-3">Tel: 069 / 977 63 666</p>
            <p>Fax: 069 / 977 63 667</p>
            <p>
              <a
                href="mailto:post@menufaktur.de"
                className="hover:text-light-beige transition-colors"
              >
                post@menufaktur.de
              </a>
            </p>
          </address>
        </div>

        {/* Menu */}
        <div className="space-y-6">
          <h4 className="text-xs font-bold uppercase tracking-widest">Menü</h4>
          <ul className="space-y-3">
            {menuLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-light-beige/70 hover:text-light-beige text-sm transition-colors duration-200"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Legal */}
        <div className="space-y-6">
          <h4 className="text-xs font-bold uppercase tracking-widest">Rechtliches</h4>
          <ul className="space-y-3">
            {legalLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-light-beige/70 hover:text-light-beige text-sm transition-colors duration-200"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Social */}
        <div className="space-y-6">
          <h4 className="text-xs font-bold uppercase tracking-widest">Social Media</h4>
          <div className="flex gap-3">
            <a
              href="https://www.instagram.com/menufaktur/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full border border-light-beige/20 flex items-center justify-center hover:bg-light-beige hover:text-wine-red transition-all duration-200"
              aria-label="menufaktur auf Instagram"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
            <a
              href="https://www.facebook.com/sharer/sharer.php?u=https://www.menufaktur.com/index.asp?&title=MENUFAKTUR%20-%20Startseite"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full border border-light-beige/20 flex items-center justify-center hover:bg-light-beige hover:text-wine-red transition-all duration-200"
              aria-label="menufaktur auf Facebook"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-2.25c0-1.176.21-1.75 1.25-1.75h2.75v-4h-3.75c-3.518 0-5.25 1.838-5.25 4.5v3.5z" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-light-beige/10 px-6 md:px-12 py-6 text-center text-light-beige/40 text-xs">
        © {new Date().getFullYear()} menufaktur. Alle Rechte vorbehalten.
      </div>
    </footer>
  )
}
