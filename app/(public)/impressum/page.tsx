import type { Metadata } from "next"
import { Phone, Mail, Printer } from "lucide-react"

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

          {/* Left: brand + contact */}
          <div className="md:col-span-5 flex flex-col gap-8">
            <div className="p-10 bg-white rounded-xl border border-dark/8 shadow-sm">
              <h2 className="font-bold text-wine-red mb-6 leading-tight text-2xl">
                Anbieterkennzeichnung gemäß § 5 TMG
              </h2>
              <div className="flex flex-col gap-1 text-base">
                <p className="font-bold text-dark text-lg">menufaktur Kochschule</p>
                <p className="text-dark/60 font-condensed leading-relaxed mt-2">
                  Bornheimer Landwehr 46, Hinterhaus<br />
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
                    <p className="text-base font-medium text-dark">+49 69 977 63 666</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Printer className="w-5 h-5 text-wine-red mt-0.5 shrink-0" aria-hidden="true" />
                  <div>
                    <p className="text-xs text-dark/40 mb-0.5">Telefax</p>
                    <p className="text-base font-medium text-dark">+49 69 977 63 667</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Mail className="w-5 h-5 text-wine-red mt-0.5 shrink-0" aria-hidden="true" />
                  <div>
                    <p className="text-xs text-dark/40 mb-0.5">E-Mail</p>
                    <a
                      href="mailto:post@menufaktur.de"
                      className="text-base font-medium text-dark hover:text-wine-red transition-colors"
                    >
                      post@menufaktur.de
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: legal entity + boilerplate */}
          <div className="md:col-span-7 space-y-12">

            {/* Legal entity */}
            <div className="space-y-6">
              <div>
                <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-wine-red/60 mb-3">
                  Betreiber
                </h3>
                <p className="text-sm text-dark/60 font-condensed mb-5">
                  Die menufaktur gehört seit September 2025 zur:
                </p>
                <p className="text-xl font-bold text-dark mb-1">Kids Event and Catering GmbH</p>
                <p className="text-dark/60 font-condensed leading-relaxed">
                  Arnsburger Straße 41<br />
                  60385 Frankfurt am Main
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-dark/8 pt-6">
                {[
                  ["Registergericht", "Frankfurt am Main"],
                  ["Registernummer", "HRB 118060"],
                  ["USt-IdNr. gem. §27a UStG", "DE329119702"],
                  ["Geschäftsführer", "Sven Jackel"],
                ].map(([label, value]) => (
                  <div key={label} className="space-y-1">
                    <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-wine-red/60">
                      {label}
                    </h4>
                    <p className="text-base text-dark font-condensed">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Haftung für Inhalte */}
            <div className="border-t border-dark/8 pt-12 space-y-8">
              <div>
                <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-wine-red/60 mb-4">
                  Haftung für Inhalte
                </h3>
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

              {/* Bildnachweis */}
              <div>
                <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-wine-red/60 mb-3">
                  Bildnachweis
                </h3>
                <p className="text-sm text-dark/40 font-condensed italic">
                  TODO: Fotografennachweise werden nach Abschluss der Fotoproduktion ergänzt.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

    </div>
  )
}
