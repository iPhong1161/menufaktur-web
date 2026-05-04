import type { Metadata } from "next"
import Link from "next/link"
import { Phone, Mail } from "lucide-react"

export const metadata: Metadata = {
  title: "Impressum — menufaktur",
}

export default function ImpressumPage() {
  return (
    <div className="bg-light-beige min-h-screen">
      {/* Hero */}
      <section className="relative bg-garnet-red min-h-[300px] flex items-center overflow-hidden pt-20 pb-12">
        <div className="max-w-screen-xl mx-auto px-6 md:px-12 relative z-10">
          <h1 className="text-6xl md:text-8xl font-bold text-white tracking-tighter mb-4">
            Impressum
          </h1>
          <div className="h-1 w-24 bg-gold-yellow" />
        </div>
      </section>

      {/* Main content */}
      <main className="max-w-5xl mx-auto px-6 md:px-12 py-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 items-start">
          {/* Left: company info */}
          <div className="md:col-span-5 flex flex-col gap-8">
            <div className="p-10 bg-white rounded-xl border border-dark/8 shadow-sm">
              <h2 className="font-bold text-wine-red mb-6 leading-tight text-2xl">
                Anbieterkennzeichnung gemäß § 5 TMG
              </h2>
              <div className="flex flex-col gap-4 text-lg">
                <p className="font-bold text-dark">menufaktur GmbH Kochschule</p>
                <p className="text-dark/60 font-condensed leading-relaxed">
                  Bornheimer Landwehr 46<br />
                  60385 Frankfurt am Main
                </p>
              </div>
            </div>

            <div className="p-10 bg-[#F8F5DA] rounded-xl border border-dark/8">
              <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-wine-red/60 mb-6">
                Kontaktieren Sie uns
              </h3>
              <div className="flex flex-col gap-5">
                <div className="flex items-start gap-4">
                  <Phone className="w-5 h-5 text-wine-red mt-0.5 shrink-0" aria-hidden="true" />
                  <div>
                    <p className="text-xs text-dark/40 mb-0.5">Telefon</p>
                    <p className="text-base font-medium text-dark">069 / 977 63 666</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Phone className="w-5 h-5 text-wine-red mt-0.5 shrink-0" aria-hidden="true" />
                  <div>
                    <p className="text-xs text-dark/40 mb-0.5">Fax</p>
                    <p className="text-base font-medium text-dark">069 / 977 63 667</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Mail className="w-5 h-5 text-wine-red mt-0.5 shrink-0" aria-hidden="true" />
                  <div>
                    <p className="text-xs text-dark/40 mb-0.5">E-Mail</p>
                    <p className="text-base font-medium text-dark">post@menufaktur.de</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: legal details */}
          <div className="md:col-span-7 space-y-12">
            <div className="space-y-3">
              <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-wine-red/60">
                Vertretungsberechtigt
              </h3>
              <p className="text-2xl font-medium text-dark">Sven Jackel</p>
              <p className="text-dark/40 text-sm">Geschäftsführer</p>
            </div>

            <div className="border-t border-dark/8 pt-12 space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {[
                  ["Registergericht", "Frankfurt am Main"],
                  ["Registernummer", "HRB 79483"],
                  ["USt-IdNr.", "DE814816219"],
                  ["Urheberrecht", "©2007–2026 menufaktur GmbH Kochschule"],
                ].map(([label, value]) => (
                  <div key={label} className="space-y-1">
                    <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-wine-red/60">
                      {label}
                    </h3>
                    <p className="text-base text-dark font-condensed">{value}</p>
                  </div>
                ))}
              </div>

              <div className="bg-wine-red/5 p-8 rounded-xl border-l-4 border-wine-red">
                <p className="text-sm italic text-dark/60 font-condensed leading-relaxed">
                  Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die
                  Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch
                  keine Gewähr übernehmen. Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG
                  für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen
                  verantwortlich.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Newsletter teaser */}
      <aside className="max-w-5xl mx-auto px-6 md:px-12 pb-24">
        <div className="relative overflow-hidden bg-[#ECE9CF] rounded-xl p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="relative z-10 max-w-xl">
            <h4 className="text-3xl font-bold text-wine-red mb-2">
              Kulinarische Post erhalten?
            </h4>
            <p className="text-dark/60 font-condensed">
              Melden Sie sich für unseren Newsletter an und erhalten Sie exklusive Rezepte
              und Kurstermine.
            </p>
          </div>
          <Link
            href="/kontakt"
            className="relative z-10 px-8 py-4 bg-wine-red hover:bg-garnet-red text-white rounded-xl font-bold transition-colors shrink-0"
          >
            Jetzt anmelden
          </Link>
        </div>
      </aside>
    </div>
  )
}
