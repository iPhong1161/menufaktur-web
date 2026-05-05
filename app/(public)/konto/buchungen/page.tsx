import type { Metadata } from "next"
import Link from "next/link"
import { CalendarDays, Clock, FileText, History, Inbox } from "lucide-react"
import { getUserBookings } from "@/lib/supabase/queries/bookings"

export const metadata: Metadata = {
  title: "Meine Buchungen — menufaktur",
}

const GERMAN_MONTHS = [
  "Januar", "Februar", "März", "April", "Mai", "Juni",
  "Juli", "August", "September", "Oktober", "November", "Dezember",
]

function formatDate(iso: string) {
  const [year, month, day] = iso.split("-").map(Number)
  return `${day}. ${GERMAN_MONTHS[month - 1]} ${year}`
}

function formatTime(time: string) {
  return time.slice(0, 5) + " Uhr"
}

function formatPrice(amount: number) {
  return amount.toLocaleString("de-DE", { minimumFractionDigits: 2 }) + " €"
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

export default async function KontoBuchungenPage() {
  const bookings = await getUserBookings()
  const today = new Date().toISOString().split("T")[0]

  const upcoming = bookings.filter(
    (b) => b.course && b.course.date >= today && b.status !== "cancelled"
  )
  const past = bookings.filter(
    (b) => b.course && (b.course.date < today || b.status === "cancelled")
  )

  return (
    <div>
      <header className="mb-12">
        <h1 className="text-4xl font-bold text-wine-red tracking-tight mb-3">
          Meine Buchungen
        </h1>
        <p className="text-dark/50 font-condensed leading-relaxed max-w-2xl">
          Hier finden Sie eine Übersicht Ihrer reservierten Kocherlebnisse. Wir
          freuen uns darauf, Sie bald in unserer Küche begrüßen zu dürfen.
        </p>
      </header>

      <div className="space-y-16">
        {/* Upcoming */}
        <div>
          <h2 className="text-base font-bold text-wine-red mb-6 flex items-center gap-2">
            <span className="w-2 h-2 bg-wine-red rounded-full shrink-0" />
            Bevorstehende Kurse
          </h2>
          {upcoming.length === 0 ? (
            <div className="bg-white rounded-xl p-12 border border-dark/5 text-center">
              <Inbox className="w-10 h-10 text-dark/20 mx-auto mb-4" />
              <p className="font-bold text-dark/40 mb-1">Keine bevorstehenden Kurse</p>
              <p className="text-sm text-dark/30 font-condensed mb-6">
                Sie haben aktuell keine gebuchten Kurse.
              </p>
              <Link
                href="/kurse"
                className="inline-block px-6 py-3 bg-wine-red hover:bg-garnet-red text-white text-sm font-bold rounded-xl transition-colors"
              >
                Kurse entdecken
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {upcoming.map((b) => (
                <div
                  key={b.id}
                  className="bg-white rounded-xl p-8 border border-dark/5 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center">
                    {b.course?.photo_url ? (
                      <img
                        src={b.course.photo_url}
                        alt={b.course.title}
                        className="w-full lg:w-40 h-40 rounded-lg object-cover shrink-0"
                      />
                    ) : (
                      <div className="w-full lg:w-40 h-40 rounded-lg bg-dark/8 shrink-0 flex items-center justify-center">
                        <CalendarDays className="w-8 h-8 text-dark/20" />
                      </div>
                    )}
                    <div className="flex-grow">
                      <div className="flex flex-wrap justify-between items-start gap-3">
                        <div>
                          <p className="text-[10px] font-mono text-dark/30 mb-1">{b.booking_number}</p>
                          <h3 className="text-xl font-bold text-dark">{b.course?.title}</h3>
                          <div className="flex flex-wrap items-center gap-4 mt-2 text-dark/50 font-condensed text-sm">
                            {b.course?.date && (
                              <span className="flex items-center gap-1.5">
                                <CalendarDays className="w-4 h-4" />
                                {formatDate(b.course.date)}
                              </span>
                            )}
                            {b.course?.start_time && (
                              <span className="flex items-center gap-1.5">
                                <Clock className="w-4 h-4" />
                                {formatTime(b.course.start_time)}
                              </span>
                            )}
                          </div>
                        </div>
                        <span className={`px-3 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider ${STATUS_STYLES[b.status] ?? "bg-dark/8 text-dark/40"}`}>
                          {STATUS_LABELS[b.status] ?? b.status}
                        </span>
                      </div>
                      <div className="mt-6 pt-5 border-t border-dark/8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <span className="text-2xl font-bold text-wine-red">{formatPrice(Number(b.total_amount))}</span>
                        <div className="flex flex-wrap gap-6">
                          <Link
                            href={`/buchung/bestaetigung/${b.id}`}
                            className="text-wine-red font-bold text-sm flex items-center gap-1.5 hover:underline underline-offset-4 font-condensed"
                          >
                            <FileText className="w-4 h-4" />
                            Details ansehen
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Past */}
        {past.length > 0 && (
          <div>
            <h2 className="text-base font-bold text-dark/40 mb-6 flex items-center gap-2">
              <span className="w-2 h-2 bg-dark/20 rounded-full shrink-0" />
              Vergangene Kurse
            </h2>
            <div className="space-y-4">
              {past.map((b) => (
                <div
                  key={b.id}
                  className="bg-white rounded-xl p-8 border border-dark/5 opacity-80 hover:opacity-100 transition-opacity"
                >
                  <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center">
                    {b.course?.photo_url ? (
                      <img
                        src={b.course.photo_url}
                        alt={b.course.title}
                        className="w-full lg:w-40 h-40 rounded-lg object-cover shrink-0 grayscale-[0.4]"
                      />
                    ) : (
                      <div className="w-full lg:w-40 h-40 rounded-lg bg-dark/8 shrink-0 grayscale-[0.4] flex items-center justify-center">
                        <History className="w-8 h-8 text-dark/20" />
                      </div>
                    )}
                    <div className="flex-grow">
                      <div className="flex flex-wrap justify-between items-start gap-3">
                        <div>
                          <p className="text-[10px] font-mono text-dark/30 mb-1">{b.booking_number}</p>
                          <h3 className="text-xl font-bold text-dark/70">{b.course?.title}</h3>
                          <div className="flex items-center gap-1.5 mt-2 text-dark/40 font-condensed text-sm">
                            <History className="w-4 h-4" />
                            {b.course?.date ? formatDate(b.course.date) : "—"}
                          </div>
                        </div>
                        <span className={`px-3 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider ${STATUS_STYLES[b.status] ?? "bg-dark/8 text-dark/40"}`}>
                          {STATUS_LABELS[b.status] ?? b.status}
                        </span>
                      </div>
                      <div className="mt-6 pt-5 border-t border-dark/8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <span className="text-2xl font-bold text-dark/40">{formatPrice(Number(b.total_amount))}</span>
                        <Link
                          href={`/buchung/bestaetigung/${b.id}`}
                          className="text-dark/40 hover:text-wine-red font-bold text-sm flex items-center gap-1.5 transition-colors font-condensed"
                        >
                          <FileText className="w-4 h-4" />
                          Details
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
