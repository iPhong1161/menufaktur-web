import { redirect } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, CalendarDays, Clock, MapPin, CreditCard, Users, Ban, Download } from "lucide-react"
import { getUserBookingDetail } from "@/lib/supabase/queries/bookings"
import { createClient } from "@/lib/supabase/server"
import { CancelBookingButton } from "@/components/booking/CancelBookingButton"

const GERMAN_MONTHS = [
  "Januar", "Februar", "März", "April", "Mai", "Juni",
  "Juli", "August", "September", "Oktober", "November", "Dezember",
]

function formatDate(iso: string) {
  const [year, month, day] = iso.split("-").map(Number)
  return `${day}. ${GERMAN_MONTHS[month - 1]} ${year}`
}

function formatTime(t: string) { return t.slice(0, 5) + " Uhr" }

function formatPrice(n: number) {
  return n.toLocaleString("de-DE", { minimumFractionDigits: 2 }) + " €"
}

const FOOD_LABELS: Record<string, string> = {
  vegetarisch: "Vegetarisch",
  vegan: "Vegan",
  glutenfrei: "Glutenfrei",
  laktosefrei: "Laktosefrei",
  nussallergie: "Nussallergie",
  keine: "Keine",
}

const STATUS_LABELS: Record<string, string> = {
  pending: "Ausstehend",
  confirmed: "Bestätigt",
  cancelled: "Storniert",
  refunded: "Erstattet",
}

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700",
  confirmed: "bg-wine-red/10 text-wine-red",
  cancelled: "bg-dark/8 text-dark/40",
  refunded: "bg-dark/8 text-dark/40",
}

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  bank_transfer: "Überweisung",
  card: "Kreditkarte",
  sepa: "SEPA-Lastschrift",
}

const PAYMENT_STATUS_LABELS: Record<string, string> = {
  unpaid: "Ausstehend",
  paid: "Bezahlt",
  refunded: "Erstattet",
}

const PAYMENT_STATUS_STYLES: Record<string, string> = {
  unpaid: "bg-amber-50 text-amber-700",
  paid: "bg-green-50 text-green-700",
  refunded: "bg-dark/8 text-dark/40",
}

function daysUntil(isoDate: string): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const course = new Date(isoDate)
  course.setHours(0, 0, 0, 0)
  return Math.round((course.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}

export default async function BookingDetailPage({
  params,
}: {
  params: Promise<{ booking_number: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { booking_number } = await params
  const booking = await getUserBookingDetail(booking_number)
  if (!booking) redirect("/konto/buchungen")

  const days = booking.course ? daysUntil(booking.course.date) : -1
  const coursePast = days < 0
  const cancelled = booking.status === "cancelled" || booking.status === "refunded"

  let cancellationBlock: React.ReactNode = null
  if (!cancelled && !coursePast) {
    if (days < 3) {
      cancellationBlock = (
        <p className="text-sm text-dark/60 leading-relaxed font-condensed">
          Eine Stornierung ist nicht mehr möglich. Bei Verhinderung kann eine andere Person teilnehmen.
        </p>
      )
    } else {
      const voucherNote =
        days > 7
          ? "Sie erhalten einen Gutschein über den vollen Betrag."
          : "Sie erhalten einen Gutschein über 50 % der Kursgebühr."
      cancellationBlock = (
        <>
          <p className="text-sm text-dark/60 leading-relaxed font-condensed mb-4">
            {voucherNote}
          </p>
          <CancelBookingButton
            bookingNumber={booking.booking_number}
            courseTitle={booking.course?.title ?? ""}
            voucherNote={voucherNote}
          />
        </>
      )
    }
  }

  return (
    <div>
      {/* Back link */}
      <Link
        href="/konto/buchungen"
        className="inline-flex items-center gap-2 text-sm font-bold text-dark/40 hover:text-wine-red transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Meine Buchungen
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4 mb-10">
        <div>
          <p className="text-[10px] font-mono text-dark/30 mb-1">{booking.booking_number}</p>
          <h1 className="text-3xl font-bold text-wine-red tracking-tight">
            {booking.course?.title ?? "Kursdetails"}
          </h1>
        </div>
        <div className="flex flex-col items-end gap-3">
          <span className={`px-3 py-1.5 text-[10px] font-bold rounded-full uppercase tracking-wider ${STATUS_STYLES[booking.status] ?? "bg-dark/8 text-dark/40"}`}>
            {STATUS_LABELS[booking.status] ?? booking.status}
          </span>
          {booking.payment_status === "paid" ? (
            <a
              href={`/api/bookings/${booking.booking_number}/invoice`}
              download
              className="px-5 py-2.5 bg-[#ECE9CF] text-wine-red font-bold rounded-xl hover:bg-[#E6E4C9] transition-colors flex items-center gap-2 text-sm"
            >
              <Download className="w-4 h-4" />
              Rechnung herunterladen
            </a>
          ) : (
            <button
              disabled
              title="Verfügbar nach Zahlungseingang"
              className="px-5 py-2.5 bg-[#ECE9CF] text-wine-red font-bold rounded-xl flex items-center gap-2 text-sm opacity-40 cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
              Rechnung herunterladen
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-6">

          {/* Course info */}
          <div className="bg-white rounded-xl p-8 border border-dark/5 shadow-sm">
            <h2 className="text-xs font-bold uppercase tracking-widest text-dark/40 mb-6">Kursdetails</h2>
            <div className="space-y-4">
              {booking.course?.date && (
                <div className="flex items-center gap-3 text-dark/70">
                  <CalendarDays className="w-4 h-4 text-wine-red shrink-0" />
                  <span className="font-condensed">{formatDate(booking.course.date)}</span>
                </div>
              )}
              {booking.course?.start_time && (
                <div className="flex items-center gap-3 text-dark/70">
                  <Clock className="w-4 h-4 text-wine-red shrink-0" />
                  <span className="font-condensed">
                    {formatTime(booking.course.start_time)}
                    {booking.course.end_time && ` – ${formatTime(booking.course.end_time)}`}
                  </span>
                </div>
              )}
              {booking.course?.location && (
                <div className="flex items-center gap-3 text-dark/70">
                  <MapPin className="w-4 h-4 text-wine-red shrink-0" />
                  <span className="font-condensed">{booking.course.location}</span>
                </div>
              )}
            </div>
          </div>

          {/* Participants */}
          <div className="bg-white rounded-xl p-8 border border-dark/5 shadow-sm">
            <h2 className="text-xs font-bold uppercase tracking-widest text-dark/40 mb-6 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Teilnehmer ({booking.participants.length})
            </h2>
            <div className="space-y-4">
              {booking.participants
                .sort((a, b) => (b.is_primary ? 1 : 0) - (a.is_primary ? 1 : 0))
                .map((p, i) => {
                  const prefs = (p.food_preferences ?? []).filter((f) => f !== "keine")
                  return (
                    <div key={i} className="flex items-start justify-between gap-4 py-3 border-b border-dark/5 last:border-0 last:pb-0">
                      <div>
                        <p className="font-bold text-dark">
                          {p.first_name} {p.last_name}
                          {p.is_primary && (
                            <span className="ml-2 text-[10px] font-bold uppercase tracking-widest text-dark/30">
                              Hauptteilnehmer
                            </span>
                          )}
                        </p>
                        {prefs.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {prefs.map((f) => (
                              <span key={f} className="text-[10px] font-bold uppercase tracking-wider bg-wine-red/8 text-wine-red px-2 py-0.5 rounded-full">
                                {FOOD_LABELS[f] ?? f}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">

          {/* Payment summary */}
          <div className="bg-white rounded-xl p-8 border border-dark/5 shadow-sm">
            <h2 className="text-xs font-bold uppercase tracking-widest text-dark/40 mb-6 flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Zahlung
            </h2>
            <div className="space-y-3 text-sm font-condensed">
              <div className="flex justify-between">
                <span className="text-dark/50">Zahlungsart</span>
                <span className="font-bold text-dark">
                  {PAYMENT_METHOD_LABELS[booking.payment_method] ?? booking.payment_method}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-dark/50">Status</span>
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider ${PAYMENT_STATUS_STYLES[booking.payment_status] ?? "bg-dark/8 text-dark/40"}`}>
                  {PAYMENT_STATUS_LABELS[booking.payment_status] ?? booking.payment_status}
                </span>
              </div>
              {booking.voucher_discount > 0 && (
                <div className="flex justify-between text-green-700">
                  <span>Gutschein</span>
                  <span className="font-bold">− {formatPrice(booking.voucher_discount)}</span>
                </div>
              )}
              <div className="flex justify-between pt-3 border-t border-dark/8">
                <span className="font-bold text-dark">Gesamtbetrag</span>
                <span className="text-xl font-bold text-wine-red">{formatPrice(Number(booking.total_amount))}</span>
              </div>
            </div>
          </div>

          {/* Booking meta */}
          <div className="bg-white rounded-xl p-8 border border-dark/5 shadow-sm text-sm font-condensed space-y-3">
            <div className="flex justify-between">
              <span className="text-dark/50">Buchungsnummer</span>
              <span className="font-mono text-xs text-dark/60">{booking.booking_number}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-dark/50">Buchungsdatum</span>
              <span className="text-dark/70">{formatDate(booking.created_at.split("T")[0])}</span>
            </div>
          </div>

          {/* Cancellation */}
          {(cancellationBlock || cancelled) && (
            <div className="bg-white rounded-xl p-8 border border-dark/5 shadow-sm">
              <h2 className="text-xs font-bold uppercase tracking-widest text-dark/40 mb-5 flex items-center gap-2">
                <Ban className="w-4 h-4" />
                Stornierung
              </h2>
              {cancelled ? (
                <p className="text-sm text-dark/40 font-condensed">
                  Diese Buchung wurde storniert.
                </p>
              ) : (
                cancellationBlock
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
