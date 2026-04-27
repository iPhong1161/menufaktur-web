import type { Metadata } from "next"
import Link from "next/link"
import { ChevronRight, Download, Banknote, Mail, ShoppingCart, Check } from "lucide-react"
import { AdminHeader } from "@/components/admin/AdminHeader"
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder"

export const metadata: Metadata = { title: "Buchungsdetail — menufaktur Admin" }

export default function AdminBuchungDetailPage({ params }: { params: { id: string } }) {
  const id = params.id

  return (
    <div className="bg-[#fdfadf] min-h-screen flex flex-col">
      <AdminHeader />
      <main className="flex-grow pt-28 px-8 pb-16 max-w-screen-xl mx-auto w-full">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 mb-6 text-sm font-condensed text-dark/40">
          <Link href="/admin/buchungen" className="hover:text-wine-red transition-colors">Buchungen</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-dark/60">{id}</span>
        </nav>

        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold text-wine-red tracking-tight mb-2">Buchung {id}</h1>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-bold border border-amber-200">
                Zahlung ausstehend
              </span>
              <span className="text-dark/40 text-sm font-condensed">Eingegangen am 14. Okt. 2024, 14:32</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <button className="px-6 py-3 bg-[#ECE9CF] text-wine-red font-bold rounded-xl hover:bg-[#E6E4C9] transition-colors flex items-center gap-2 text-sm">
              <Download className="w-4 h-4" />
              Rechnung herunterladen
            </button>
            <button className="px-6 py-3 bg-wine-red text-white font-bold rounded-xl hover:bg-garnet-red transition-colors flex items-center gap-2 text-sm">
              <Banknote className="w-4 h-4" />
              Als bezahlt markieren
            </button>
            <button className="px-4 py-3 text-garnet-red font-bold text-sm hover:underline underline-offset-4 font-condensed">
              Stornieren
            </button>
          </div>
        </div>

        {/* Content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left (7 col) */}
          <div className="lg:col-span-7 space-y-8">
            {/* Kurs */}
            <section className="bg-white rounded-xl p-8 shadow-sm border border-dark/5">
              <h2 className="text-2xl font-bold text-wine-red mb-6">Kurs</h2>
              <div className="flex flex-col md:flex-row gap-8">
                <div className="w-full md:w-1/3 aspect-[4/3] rounded-lg overflow-hidden shrink-0">
                  <ImagePlaceholder label="Course photo — uploaded via admin" className="w-full h-full" />
                </div>
                <div className="flex-grow space-y-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-dark/30 mb-1 font-condensed">Kursname</p>
                    <h3 className="text-xl font-bold text-wine-red">Die Kunst der Saucen: Klassik trifft Moderne</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-dark/30 mb-1 font-condensed">Datum</p>
                      <p className="font-bold text-sm text-dark">Sa, 12. Nov. 2024</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-dark/30 mb-1 font-condensed">Uhrzeit</p>
                      <p className="font-bold text-sm text-dark">18:00 – 22:30 Uhr</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Teilnehmer */}
            <section className="bg-white rounded-xl p-8 shadow-sm border border-dark/5">
              <h2 className="text-2xl font-bold text-wine-red mb-6">Teilnehmer (2)</h2>
              <div className="space-y-5">
                {[
                  { initials: "ML", name: "Maximilian Lehmann", tags: ["Vegetarisch", "Laktoseintoleranz"], tagColors: ["bg-garnet-red/10 text-garnet-red", "bg-red-100 text-red-600"] },
                  { initials: "SL", name: "Sophie Lehmann", tags: ["Keine Besonderheiten"], tagColors: ["bg-dark/8 text-dark/50"] },
                ].map((p, i) => (
                  <div key={i} className={`flex items-center justify-between ${i === 0 ? "pb-5 border-b border-dark/8" : ""}`}>
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-full bg-wine-red/10 flex items-center justify-center text-wine-red font-bold text-sm shrink-0">
                        {p.initials}
                      </div>
                      <div>
                        <p className="font-bold text-dark">{p.name}</p>
                        <div className="flex gap-2 mt-1 flex-wrap">
                          {p.tags.map((tag, ti) => (
                            <span key={ti} className={`text-xs px-2 py-0.5 rounded font-bold ${p.tagColors[ti] ?? "bg-dark/8 text-dark/50"}`}>
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-dark/20" />
                  </div>
                ))}
              </div>
            </section>

            {/* Rechnungsempfänger */}
            <section className="bg-white rounded-xl p-8 shadow-sm border border-dark/5">
              <h2 className="text-2xl font-bold text-wine-red mb-6">Rechnungsempfänger</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-dark/30 mb-2 font-condensed">Adresse</p>
                  <address className="not-italic font-condensed text-dark/70 leading-relaxed">
                    Maximilian Lehmann<br />
                    Sophienstraße 42<br />
                    80333 München<br />
                    Deutschland
                  </address>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-dark/30 mb-2 font-condensed">Kontakt</p>
                  <p className="font-condensed text-dark/70">m.lehmann@email.de</p>
                  <p className="font-condensed text-dark/70">+49 151 12345678</p>
                </div>
              </div>
            </section>
          </div>

          {/* Right (5 col) */}
          <div className="lg:col-span-5 space-y-8">
            {/* Zahlung */}
            <section className="bg-white rounded-xl p-8 shadow-sm border-l-4 border-garnet-red">
              <h2 className="text-xl font-bold text-wine-red mb-6">Zahlungsübersicht</h2>
              <div className="space-y-3">
                <div className="flex justify-between text-dark/60 font-condensed text-sm">
                  <span>2× Kursticket á 149,00 €</span>
                  <span>298,00 €</span>
                </div>
                <div className="flex justify-between text-dark/60 font-condensed text-sm">
                  <span>Servicepauschale</span>
                  <span>5,00 €</span>
                </div>
                <div className="pt-4 border-t border-dark/8 flex justify-between items-center">
                  <span className="text-lg font-bold text-dark">Gesamtsumme</span>
                  <span className="text-2xl font-bold text-wine-red">303,00 €</span>
                </div>
                <div className="mt-4 p-4 rounded-lg bg-[#F8F5DA] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Banknote className="w-5 h-5 text-garnet-red" />
                    <span className="text-sm font-bold text-dark/70 font-condensed">Banküberweisung</span>
                  </div>
                  <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider bg-amber-100 px-2 py-1 rounded">
                    Warten auf Geldeingang
                  </span>
                </div>
              </div>
            </section>

            {/* Rechnungsdokument */}
            <section className="bg-white rounded-xl p-8 shadow-sm border border-dark/5">
              <h2 className="text-xl font-bold text-wine-red mb-4">Rechnungsdokumente</h2>
              <div className="flex items-center justify-between p-4 rounded-lg border border-dark/8 hover:border-wine-red/20 hover:bg-wine-red/5 transition-all cursor-pointer group">
                <div className="flex items-center gap-4">
                  <Download className="w-6 h-6 text-dark/30 group-hover:text-wine-red transition-colors" />
                  <div>
                    <p className="font-bold text-sm text-dark">RE-2024-00142.pdf</p>
                    <p className="text-xs text-dark/40 font-condensed">PDF Dokument · 124 KB</p>
                  </div>
                </div>
                <Download className="w-4 h-4 text-dark/30" />
              </div>
            </section>

            {/* Timeline */}
            <section className="bg-white rounded-xl p-8 shadow-sm border border-dark/5">
              <h2 className="text-xl font-bold text-wine-red mb-6">Aktivität</h2>
              <div className="relative space-y-7 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-px before:bg-dark/8">
                {[
                  { icon: Mail, label: "Bestätigungs-E-Mail gesendet", time: "14. Okt. 2024, 14:33 Uhr", color: "bg-wine-red" },
                  { icon: ShoppingCart, label: "Buchung erstellt durch Maximilian Lehmann", time: "14. Okt. 2024, 14:32 Uhr", color: "bg-dark/30" },
                  { icon: Check, label: "Rechnung generiert", time: "System · 14. Okt. 2024", color: "bg-dark/15", muted: true },
                ].map(({ icon: Icon, label, time, color, muted }) => (
                  <div key={label} className={`relative pl-10 ${muted ? "opacity-50" : ""}`}>
                    <div className={`absolute left-0 w-6 h-6 rounded-full ${color} flex items-center justify-center ring-4 ring-white`}>
                      <Icon className="w-3 h-3 text-white" />
                    </div>
                    <p className="text-sm font-bold text-dark">{label}</p>
                    <p className="text-xs text-dark/40 font-condensed mt-0.5">{time}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
      <footer className="py-6 border-t border-wine-red/5 text-center">
        <p className="text-[10px] text-dark/30 tracking-widest uppercase font-condensed">© 2026 menufaktur · Admin</p>
      </footer>
    </div>
  )
}
