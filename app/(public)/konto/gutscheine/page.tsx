import type { Metadata } from "next"
import Link from "next/link"
import { Ticket, CalendarCheck, Download, Gift, CheckCircle2, ArrowRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Meine Gutscheine — menufaktur",
}

const ACTIVE_VOUCHERS = [
  {
    id: "MF-XJ-9981-L",
    title: "Kulinarischer Abend für Zwei",
    value: 109,
    validUntil: "31.12.2027",
    bgClass: "bg-wine-red",
  },
  {
    id: "MF-RT-4420-B",
    title: "Wertgutschein Atelier",
    value: 50,
    validUntil: "15.06.2026",
    bgClass: "bg-garnet-red",
  },
]

const PAST_VOUCHERS = [
  {
    id: "MF-AA-1200-Z",
    title: 'Backkurs "Macarons d\'Art"',
    value: 89,
    redeemedOn: "12.11.2023",
  },
]

export default function KontoGutscheinePage() {
  return (
    <div>
      <header className="mb-12">
        <h1 className="text-4xl font-bold text-wine-red tracking-tight mb-3">
          Meine Gutscheine
        </h1>
        <p className="text-dark/50 font-condensed leading-relaxed max-w-2xl">
          Verwalten Sie Ihre erworbenen Atelier-Gutscheine, laden Sie Zertifikate
          herunter oder verschenken Sie kulinarische Momente.
        </p>
      </header>

      {/* Active vouchers */}
      <section className="mb-16">
        <h2 className="text-xl font-bold text-wine-red mb-6 flex items-center gap-4">
          Aktive Gutscheine
          <span className="flex-grow h-px bg-dark/10" />
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {ACTIVE_VOUCHERS.map((v) => (
            <div
              key={v.id}
              className="bg-white rounded-xl p-8 border border-dark/5 shadow-sm hover:-translate-y-1 transition-transform flex flex-col md:flex-row gap-6"
            >
              <div
                className={`shrink-0 w-full md:w-28 h-28 ${v.bgClass} rounded-lg flex items-center justify-center`}
              >
                <Ticket className="w-10 h-10 text-white opacity-50" />
              </div>
              <div className="flex-grow">
                <div className="flex justify-between items-start mb-2">
                  <span className="px-3 py-1 bg-wine-red/10 text-wine-red text-[10px] font-bold rounded-full uppercase tracking-widest">
                    Aktiv
                  </span>
                  <span className="text-wine-red font-bold text-xl">
                    {v.value.toFixed(2).replace(".", ",")} €
                  </span>
                </div>
                <h3 className="font-bold text-dark mb-1">{v.title}</h3>
                <p className="text-[11px] font-mono text-dark/40 mb-3">Code: {v.id}</p>
                <div className="flex items-center gap-1.5 text-sm text-dark/50 font-condensed mb-4">
                  <CalendarCheck className="w-4 h-4" />
                  Gültig bis {v.validUntil}
                </div>
                <div className="flex flex-wrap gap-5 pt-4 border-t border-dark/8">
                  <a
                    href="#"
                    className="flex items-center gap-1 text-sm font-bold text-wine-red hover:underline underline-offset-4 font-condensed"
                  >
                    <Download className="w-4 h-4" />
                    PDF herunterladen
                  </a>
                  <a
                    href="#"
                    className="flex items-center gap-1 text-sm font-bold text-wine-red hover:underline underline-offset-4 font-condensed"
                  >
                    <Gift className="w-4 h-4" />
                    Als Geschenk senden
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Past vouchers */}
      <section className="mb-16">
        <h2 className="text-xl font-bold text-dark/40 mb-6 flex items-center gap-4">
          Vergangene Gutscheine
          <span className="flex-grow h-px bg-dark/10" />
        </h2>
        <div className="space-y-3">
          {PAST_VOUCHERS.map((v) => (
            <div
              key={v.id}
              className="flex items-center justify-between p-6 bg-[#F8F5DA] rounded-xl border border-dark/5 opacity-70"
            >
              <div className="flex items-center gap-5">
                <div className="w-10 h-10 bg-dark/10 rounded-full flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-dark/40" />
                </div>
                <div>
                  <h4 className="font-bold text-dark text-sm">{v.title}</h4>
                  <p className="text-[11px] font-mono text-dark/40">{v.id}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-dark/50 font-condensed text-sm">
                  Eingelöst am {v.redeemedOn}
                </p>
                <p className="text-[10px] uppercase tracking-widest text-dark/30 font-condensed">
                  Wert: {v.value.toFixed(2).replace(".", ",")} €
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="p-10 rounded-2xl bg-[#ECE9CF] flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="max-w-md">
          <h2 className="text-2xl font-bold text-wine-red mb-2">
            Noch kein Geschenk?
          </h2>
          <p className="text-dark/60 font-condensed text-sm leading-relaxed">
            Schenken Sie Freude mit einem individuellen Gutschein für unsere
            exklusiven Kochkurse oder Tastings.
          </p>
        </div>
        <Link
          href="/gutschein"
          className="px-8 py-4 bg-wine-red hover:bg-garnet-red text-white font-bold rounded-xl transition-colors shrink-0 flex items-center gap-2"
        >
          Gutschein kaufen
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>
    </div>
  )
}
