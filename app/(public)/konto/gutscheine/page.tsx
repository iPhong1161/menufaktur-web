import type { Metadata } from "next"
import Link from "next/link"
import { Ticket, CalendarCheck, CheckCircle2, ArrowRight, Gift } from "lucide-react"
import { getUserVouchers } from "@/lib/supabase/queries/vouchers"

export const metadata: Metadata = {
  title: "Meine Gutscheine — menufaktur",
}

function formatPrice(amount: number) {
  return amount.toLocaleString("de-DE", { minimumFractionDigits: 2 }) + " €"
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

const STATUS_STYLES: Record<string, string> = {
  active: "bg-wine-red/10 text-wine-red",
  redeemed: "bg-dark/8 text-dark/40",
  expired: "bg-dark/8 text-dark/40",
  cancelled: "bg-dark/8 text-dark/40",
}

const STATUS_LABELS: Record<string, string> = {
  active: "Aktiv",
  redeemed: "Eingelöst",
  expired: "Abgelaufen",
  cancelled: "Storniert",
}

const CARD_COLOURS = ["bg-wine-red", "bg-garnet-red", "bg-dark/60"]

export default async function KontoGutscheinePage() {
  const vouchers = await getUserVouchers()

  const active = vouchers.filter((v) => v.status === "active")
  const past = vouchers.filter((v) => v.status !== "active")

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
        {active.length === 0 ? (
          <div className="bg-white rounded-xl p-12 border border-dark/5 text-center">
            <Ticket className="w-10 h-10 text-dark/20 mx-auto mb-4" />
            <p className="font-bold text-dark/40 mb-1">Keine aktiven Gutscheine</p>
            <p className="text-sm text-dark/30 font-condensed mb-6">
              Sie haben derzeit keine einlösbaren Gutscheine.
            </p>
            <Link
              href="/gutschein"
              className="inline-flex items-center gap-2 px-6 py-3 bg-wine-red hover:bg-garnet-red text-white text-sm font-bold rounded-xl transition-colors"
            >
              <Gift className="w-4 h-4" />
              Gutschein kaufen
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {active.map((v, i) => (
              <div
                key={v.id}
                className="bg-white rounded-xl p-8 border border-dark/5 shadow-sm hover:-translate-y-1 transition-transform flex flex-col md:flex-row gap-6"
              >
                <div className={`shrink-0 w-full md:w-28 h-28 ${CARD_COLOURS[i % CARD_COLOURS.length]} rounded-lg flex items-center justify-center`}>
                  <Ticket className="w-10 h-10 text-white opacity-50" />
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <span className={`px-3 py-1 text-[10px] font-bold rounded-full uppercase tracking-widest ${STATUS_STYLES[v.status]}`}>
                      {STATUS_LABELS[v.status]}
                    </span>
                    <span className="text-wine-red font-bold text-xl">
                      {formatPrice(Number(v.remaining_value))}
                    </span>
                  </div>
                  <h3 className="font-bold text-dark mb-1">Gutschein für {v.recipient_name}</h3>
                  <p className="text-[11px] font-mono text-dark/40 mb-3">Code: {v.code}</p>
                  {v.expires_at && (
                    <div className="flex items-center gap-1.5 text-sm text-dark/50 font-condensed mb-4">
                      <CalendarCheck className="w-4 h-4" />
                      Gültig bis {formatDate(v.expires_at)}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Past vouchers */}
      {past.length > 0 && (
        <section className="mb-16">
          <h2 className="text-xl font-bold text-dark/40 mb-6 flex items-center gap-4">
            Vergangene Gutscheine
            <span className="flex-grow h-px bg-dark/10" />
          </h2>
          <div className="space-y-3">
            {past.map((v) => (
              <div
                key={v.id}
                className="flex items-center justify-between p-6 bg-[#F8F5DA] rounded-xl border border-dark/5 opacity-70"
              >
                <div className="flex items-center gap-5">
                  <div className="w-10 h-10 bg-dark/10 rounded-full flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-dark/40" />
                  </div>
                  <div>
                    <h4 className="font-bold text-dark text-sm">Gutschein für {v.recipient_name}</h4>
                    <p className="text-[11px] font-mono text-dark/40">{v.code}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider inline-block mb-1 ${STATUS_STYLES[v.status]}`}>
                    {STATUS_LABELS[v.status]}
                  </p>
                  <p className="text-[10px] uppercase tracking-widest text-dark/30 font-condensed">
                    Wert: {formatPrice(Number(v.value))}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

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
