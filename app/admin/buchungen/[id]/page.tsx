import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { headers } from "next/headers"
import { ChevronRight, Download, Banknote, Mail, ShoppingCart, Check } from "lucide-react"
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder"
import { getBookingByNumberAdmin } from "@/lib/supabase/queries/admin-bookings"
import { MarkPaidButton } from "@/components/admin/MarkPaidButton"

export const metadata: Metadata = { title: "Buchungsdetail — menufaktur Admin" }

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("de-DE", {
    weekday: "short",
    day: "2-digit",
    month: "long",
    year: "numeric",
  })
}

function fmtTime(t: string) {
  return t.slice(0, 5)
}

function fmtAmount(n: number) {
  return n.toFixed(2).replace(".", ",") + " €"
}

export default async function AdminBuchungDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const booking = await getBookingByNumberAdmin(id)
  if (!booking) notFound()

  const role = ((await headers()).get("x-admin-role") ?? "moderator") as "admin" | "moderator"
  const isPaid = booking.payment_status === "paid"
  const isCancelled = booking.status === "cancelled" || booking.status === "refunded"

  const PAYMENT_METHOD_LABELS: Record<string, string> = {
    card: "Kreditkarte",
    sepa: "SEPA-Lastschrift",
    bank_transfer: "Banküberweisung",
  }

  const PAYMENT_STATUS_LABELS: Record<string, { label: string; cls: string }> = {
    unpaid: { label: "Zahlung ausstehend", cls: "bg-amber-100 text-amber-800 border border-amber-200" },
    paid: { label: "Bezahlt", cls: "bg-green-100 text-green-800 border border-green-200" },
    refunded: { label: "Erstattet", cls: "bg-dark/8 text-dark/50" },
  }

  const paymentBadge = PAYMENT_STATUS_LABELS[booking.payment_status] ?? {
    label: booking.payment_status,
    cls: "bg-dark/8 text-dark/50",
  }

  const bookedAt = new Date(booking.created_at).toLocaleString("de-DE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })

  return (
    <main className="flex-grow pt-28 px-8 pb-16 max-w-screen-xl mx-auto w-full">
      <nav className="flex items-center gap-2 mb-6 text-sm font-condensed text-dark/40">
        <Link href="/admin/buchungen" className="hover:text-wine-red transition-colors">
          Buchungen
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-dark/60 font-mono text-xs">{booking.booking_number}</span>
      </nav>

      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold text-wine-red tracking-tight mb-2">
            Buchung {booking.booking_number}
          </h1>
          <div className="flex items-center gap-3 flex-wrap">
            <span className={`px-3 py-1 rounded-full text-sm font-bold ${paymentBadge.cls}`}>
              {paymentBadge.label}
            </span>
            <span className="text-dark/40 text-sm font-condensed">
              Eingegangen am {bookedAt} Uhr
            </span>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 items-center">
          <button className="px-6 py-3 bg-[#ECE9CF] text-wine-red font-bold rounded-xl hover:bg-[#E6E4C9] transition-colors flex items-center gap-2 text-sm">
            <Download className="w-4 h-4" />
            Rechnung herunterladen
          </button>
          {role === "admin" && !isPaid && !isCancelled && <MarkPaidButton bookingId={booking.id} />}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left (7 col) */}
        <div className="lg:col-span-7 space-y-8">
          {/* Kurs */}
          <section className="bg-white rounded-xl p-8 shadow-sm border border-dark/5">
            <h2 className="text-2xl font-bold text-wine-red mb-6">Kurs</h2>
            <div className="flex flex-col md:flex-row gap-8">
              <div className="w-full md:w-1/3 aspect-[4/3] rounded-lg overflow-hidden shrink-0">
                {booking.course?.photo_url ? (
                  <img
                    src={booking.course.photo_url}
                    alt={booking.course.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImagePlaceholder label="Kursfoto" className="w-full h-full" />
                )}
              </div>
              <div className="flex-grow space-y-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-dark/30 mb-1 font-condensed">
                    Kursname
                  </p>
                  <h3 className="text-xl font-bold text-wine-red">
                    {booking.course?.title ?? "—"}
                  </h3>
                </div>
                {booking.course && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-dark/30 mb-1 font-condensed">
                        Datum
                      </p>
                      <p className="font-bold text-sm text-dark">{fmtDate(booking.course.date)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-dark/30 mb-1 font-condensed">
                        Uhrzeit
                      </p>
                      <p className="font-bold text-sm text-dark">
                        {fmtTime(booking.course.start_time)} –{" "}
                        {fmtTime(booking.course.end_time)} Uhr
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Teilnehmer */}
          <section className="bg-white rounded-xl p-8 shadow-sm border border-dark/5">
            <h2 className="text-2xl font-bold text-wine-red mb-6">
              Teilnehmer ({booking.participants.length})
            </h2>
            <div className="space-y-5">
              {booking.participants.map((p, i) => {
                const initials = `${p.first_name[0] ?? ""}${p.last_name[0] ?? ""}`.toUpperCase()
                const foods = p.food_preferences.length > 0 ? p.food_preferences : ["Keine Angabe"]
                return (
                  <div
                    key={p.id}
                    className={`flex items-center justify-between ${i < booking.participants.length - 1 ? "pb-5 border-b border-dark/8" : ""}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-full bg-wine-red/10 flex items-center justify-center text-wine-red font-bold text-sm shrink-0">
                        {initials}
                      </div>
                      <div>
                        <p className="font-bold text-dark">
                          {p.first_name} {p.last_name}
                          {p.is_primary && (
                            <span className="ml-2 text-[10px] text-wine-red/60 font-bold uppercase tracking-widest">Kontakt</span>
                          )}
                        </p>
                        <p className="text-xs text-dark/40 font-condensed">{p.email}</p>
                        <div className="flex gap-2 mt-1 flex-wrap">
                          {foods.map((f) => (
                            <span key={f} className="text-xs px-2 py-0.5 rounded bg-dark/8 text-dark/50 font-bold">{f}</span>
                          ))}
                        </div>
                        {p.food_notes && (
                          <p className="text-xs text-dark/50 font-condensed mt-1 italic">{p.food_notes}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

          {/* Rechnungsempfänger */}
          {booking.invoice_recipient && (
            <section className="bg-white rounded-xl p-8 shadow-sm border border-dark/5">
              <h2 className="text-2xl font-bold text-wine-red mb-6">Rechnungsempfänger</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-dark/30 mb-2 font-condensed">
                    Adresse
                  </p>
                  <address className="not-italic font-condensed text-dark/70 leading-relaxed">
                    {booking.invoice_recipient.company_name && (
                      <>
                        {booking.invoice_recipient.company_name}
                        <br />
                      </>
                    )}
                    {booking.invoice_recipient.first_name} {booking.invoice_recipient.last_name}
                    <br />
                    {booking.invoice_recipient.address_line1}
                    <br />
                    {booking.invoice_recipient.postal_code} {booking.invoice_recipient.city}
                    <br />
                    {booking.invoice_recipient.country}
                  </address>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-dark/30 mb-2 font-condensed">
                    Kontakt
                  </p>
                  <p className="font-condensed text-dark/70">{booking.invoice_recipient.email}</p>
                  {booking.invoice_recipient.vat_id && (
                    <p className="font-condensed text-dark/50 text-sm mt-1">
                      USt-IdNr.: {booking.invoice_recipient.vat_id}
                    </p>
                  )}
                </div>
              </div>
            </section>
          )}
        </div>

        {/* Right (5 col) */}
        <div className="lg:col-span-5 space-y-8">
          {/* Zahlung */}
          <section
            className={`bg-white rounded-xl p-8 shadow-sm border-l-4 ${isPaid ? "border-green-400" : "border-garnet-red"}`}
          >
            <h2 className="text-xl font-bold text-wine-red mb-6">Zahlungsübersicht</h2>
            <div className="space-y-3">
              <div className="flex justify-between text-dark/60 font-condensed text-sm">
                <span>
                  {booking.participants.length}× Kursticket á{" "}
                  {fmtAmount(booking.total_amount / booking.participants.length)}
                </span>
                <span>{fmtAmount(booking.total_amount - (booking.total_amount - booking.total_amount))}</span>
              </div>
              <div className="pt-4 border-t border-dark/8 flex justify-between items-center">
                <span className="text-lg font-bold text-dark">Gesamtsumme</span>
                <span className="text-2xl font-bold text-wine-red">
                  {fmtAmount(booking.total_amount)}
                </span>
              </div>
              <div className="mt-4 p-4 rounded-lg bg-[#F8F5DA] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Banknote className="w-5 h-5 text-garnet-red" />
                  <span className="text-sm font-bold text-dark/70 font-condensed">
                    {PAYMENT_METHOD_LABELS[booking.payment_method] ?? booking.payment_method}
                  </span>
                </div>
                {isPaid ? (
                  <span className="text-[10px] font-bold text-green-700 uppercase tracking-wider bg-green-100 px-2 py-1 rounded">
                    Eingegangen
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider bg-amber-100 px-2 py-1 rounded">
                    Warten auf Geldeingang
                  </span>
                )}
              </div>
            </div>
          </section>

          {/* Gutschein */}
          {booking.voucher_id && booking.voucher && (() => {
            const VOUCHER_STATUS: Record<string, { label: string; cls: string }> = {
              active:   { label: "Aktiv",      cls: "bg-green-100 text-green-800 border border-green-200" },
              redeemed: { label: "Eingelöst",  cls: "bg-dark/8 text-dark/50" },
              expired:  { label: "Abgelaufen", cls: "bg-amber-100 text-amber-800 border border-amber-200" },
              cancelled:{ label: "Storniert",  cls: "bg-red-100 text-red-800 border border-red-200" },
            }
            const badge = VOUCHER_STATUS[booking.voucher.status] ?? { label: booking.voucher.status, cls: "bg-dark/8 text-dark/50" }
            return (
              <section className="bg-white rounded-xl p-8 shadow-sm border border-dark/5">
                <h2 className="text-xl font-bold text-wine-red mb-5">Gutschein verwendet</h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-wine-red font-bold text-base tracking-wider">
                      {booking.voucher.code}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${badge.cls}`}>
                      {badge.label}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm font-condensed text-dark/60">
                    <span>Rabatt</span>
                    <span className="font-bold text-dark">− {fmtAmount(booking.voucher_discount)}</span>
                  </div>
                  {booking.voucher.status === "active" && (
                    <div className="mt-3 flex gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 font-condensed">
                      Bitte Gutschein nach Zahlungseingang als eingelöst markieren.
                    </div>
                  )}
                </div>
              </section>
            )
          })()}

          {/* Timeline */}
          <section className="bg-white rounded-xl p-8 shadow-sm border border-dark/5">
            <h2 className="text-xl font-bold text-wine-red mb-6">Aktivität</h2>
            <div className="relative space-y-7 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-px before:bg-dark/8">
              {isPaid && (
                <div className="relative pl-10">
                  <div className="absolute left-0 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center ring-4 ring-white">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <p className="text-sm font-bold text-dark">Zahlung bestätigt</p>
                  <p className="text-xs text-dark/40 font-condensed mt-0.5">Manuell markiert</p>
                </div>
              )}
              {booking.confirmation_email_sent && (
                <div className="relative pl-10">
                  <div className="absolute left-0 w-6 h-6 rounded-full bg-wine-red flex items-center justify-center ring-4 ring-white">
                    <Mail className="w-3 h-3 text-white" />
                  </div>
                  <p className="text-sm font-bold text-dark">Bestätigungs-E-Mail gesendet</p>
                </div>
              )}
              <div className="relative pl-10">
                <div className="absolute left-0 w-6 h-6 rounded-full bg-dark/30 flex items-center justify-center ring-4 ring-white">
                  <ShoppingCart className="w-3 h-3 text-white" />
                </div>
                <p className="text-sm font-bold text-dark">Buchung eingegangen</p>
                <p className="text-xs text-dark/40 font-condensed mt-0.5">{bookedAt} Uhr</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
