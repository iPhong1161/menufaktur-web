import type { Metadata } from "next"
import Link from "next/link"
import { CheckCircle, Ticket } from "lucide-react"
import { stripe } from "@/lib/stripe/client"

export const metadata: Metadata = {
  title: "Gutschein-Kauf bestätigt — menufaktur",
}

type Props = { searchParams: Promise<{ session_id?: string }> }

function formatEur(cents: number | null | undefined): string {
  if (typeof cents !== "number") return "—"
  return (cents / 100).toLocaleString("de-DE", { minimumFractionDigits: 2 }) + " €"
}

export default async function VoucherStripeConfirmationPage({ searchParams }: Props) {
  const { session_id } = await searchParams

  let sessionSummary: {
    email: string | null
    total: number | null
    wert: string | null
    quantity: string | null
    lieferung: string | null
    empfaengerName: string | null
  } | null = null

  if (session_id) {
    try {
      const session = await stripe.checkout.sessions.retrieve(session_id)
      sessionSummary = {
        email: session.customer_details?.email ?? null,
        total: session.amount_total ?? null,
        wert: session.metadata?.wert ?? null,
        quantity: session.metadata?.quantity ?? null,
        lieferung: session.metadata?.lieferung ?? null,
        empfaengerName: session.metadata?.empfaengerName ?? null,
      }
    } catch {
      sessionSummary = null
    }
  }

  const lieferungLabel =
    sessionSummary?.lieferung === "post"
      ? "Per Post (Postkarte)"
      : sessionSummary?.lieferung === "email"
        ? "Per E-Mail"
        : null

  return (
    <div className="bg-light-beige min-h-screen pt-24 pb-24 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Success header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="w-20 h-20 bg-wine-red rounded-full flex items-center justify-center mb-8 shadow-lg">
            <CheckCircle className="w-10 h-10 text-white fill-white" aria-hidden="true" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-wine-red mb-4 leading-tight">
            Vielen Dank für Ihren Kauf!
          </h1>
          <p className="text-dark/60 leading-relaxed max-w-lg font-condensed text-lg">
            Ihre Gutscheine werden in Kürze zugeschickt. Eine Bestätigung der
            Zahlung geht separat per E-Mail an Sie raus.
          </p>
        </div>

        {sessionSummary && (
          <div className="bg-white rounded-2xl shadow-[0_8px_40px_-8px_rgba(126,20,35,0.1)] overflow-hidden mb-12">
            <div className="bg-wine-red px-10 py-8">
              <div className="flex items-center gap-4">
                <Ticket className="w-8 h-8 text-white/80 shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-white/60 text-xs uppercase tracking-widest font-bold mb-1">
                    Ihre Bestellung
                  </p>
                  <h2 className="text-white text-xl font-bold leading-snug">
                    Gutschein — menufaktur Kochkurse
                  </h2>
                </div>
              </div>
            </div>

            <div className="px-10 py-10 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {sessionSummary.wert && sessionSummary.quantity && (
                <div>
                  <p className="text-xs text-dark/40 font-bold uppercase tracking-widest mb-1">
                    Gutschein
                  </p>
                  <p className="text-base font-bold text-dark">
                    {sessionSummary.quantity}× {sessionSummary.wert} €
                  </p>
                </div>
              )}
              {sessionSummary.empfaengerName && (
                <div>
                  <p className="text-xs text-dark/40 font-bold uppercase tracking-widest mb-1">
                    Empfänger
                  </p>
                  <p className="text-base font-medium text-dark">
                    {sessionSummary.empfaengerName}
                  </p>
                </div>
              )}
              {lieferungLabel && (
                <div>
                  <p className="text-xs text-dark/40 font-bold uppercase tracking-widest mb-1">
                    Lieferung
                  </p>
                  <p className="text-base font-medium text-dark">
                    {lieferungLabel}
                  </p>
                </div>
              )}
              <div>
                <p className="text-xs text-dark/40 font-bold uppercase tracking-widest mb-1">
                  Gesamtbetrag
                </p>
                <p className="text-base font-bold text-wine-red">
                  {formatEur(sessionSummary.total)}
                </p>
              </div>
              {sessionSummary.email && (
                <div className="sm:col-span-2">
                  <p className="text-xs text-dark/40 font-bold uppercase tracking-widest mb-1">
                    Bestätigung an
                  </p>
                  <p className="text-base font-medium text-dark">
                    {sessionSummary.email}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="text-center">
          <Link
            href="/kurse"
            className="inline-block bg-wine-red text-white px-10 py-4 rounded-xl font-bold hover:bg-garnet-red transition-colors"
          >
            Zu den Kursen
          </Link>
        </div>
      </div>
    </div>
  )
}
