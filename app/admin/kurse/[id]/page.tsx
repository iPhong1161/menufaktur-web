import { redirect } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  Pencil,
  CalendarDays,
  Clock,
  MapPin,
  Users,
  Euro,
  ExternalLink,
} from "lucide-react"
import { getCourseDetailAdmin } from "@/lib/supabase/queries/admin-courses"
import ParticipantListAdmin from "@/components/admin/ParticipantListAdmin"

const GERMAN_MONTHS = [
  "Januar","Februar","März","April","Mai","Juni",
  "Juli","August","September","Oktober","November","Dezember",
]

function formatDate(iso: string) {
  const [year, month, day] = iso.split("-").map(Number)
  return `${day}. ${GERMAN_MONTHS[month - 1]} ${year}`
}
function formatTime(t: string) { return t.slice(0, 5) + " Uhr" }
function formatPrice(n: number) {
  return n.toLocaleString("de-DE", { minimumFractionDigits: 2 }) + " €"
}

const COURSE_STATUS: Record<string, { label: string; style: string }> = {
  published: { label: "Veröffentlicht", style: "bg-green-100 text-green-800 border border-green-200" },
  draft:     { label: "Entwurf",        style: "bg-amber-100 text-amber-800 border border-amber-200" },
  cancelled: { label: "Abgesagt",       style: "bg-red-100 text-red-800 border border-red-200" },
  sold_out:  { label: "Ausgebucht",     style: "bg-purple-100 text-purple-800 border border-purple-200" },
}

const BOOKING_STATUS: Record<string, { label: string; style: string }> = {
  pending:   { label: "Ausstehend", style: "bg-amber-50 text-amber-700" },
  confirmed: { label: "Bestätigt",  style: "bg-green-50 text-green-700" },
  cancelled: { label: "Storniert",  style: "bg-dark/8 text-dark/40" },
  refunded:  { label: "Erstattet", style: "bg-dark/8 text-dark/40" },
}

const PAYMENT_STATUS: Record<string, { label: string; style: string }> = {
  unpaid:   { label: "Ausstehend", style: "bg-amber-50 text-amber-700" },
  paid:     { label: "Bezahlt",    style: "bg-green-50 text-green-700" },
  refunded: { label: "Erstattet", style: "bg-dark/8 text-dark/40" },
}

const PAYMENT_METHOD: Record<string, string> = {
  bank_transfer: "Überweisung",
  card: "Kreditkarte",
  sepa: "SEPA",
}

const FOOD_LABELS: Record<string, string> = {
  vegetarisch: "Vegetarisch",
  vegan: "Vegan",
  glutenfrei: "Glutenfrei",
  laktosefrei: "Laktosefrei",
  nussallergie: "Nussallergie",
}

export default async function AdminKursDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const detail = await getCourseDetailAdmin(id)
  if (!detail) redirect("/admin/kurse")

  const { course, bookings, total_booked_spots, remaining_spots, total_revenue } = detail
  const courseStatus = COURSE_STATUS[course.status] ?? { label: course.status, style: "bg-dark/8 text-dark/40" }

  const flatParticipants = bookings
    .filter((b) => b.status === "pending" || b.status === "confirmed")
    .flatMap((b) =>
      b.participants.map((p) => ({
        ...p,
        booking_number: b.booking_number,
        courseId: id,
      }))
    )

  return (
    <main className="flex-grow pt-28 pb-16 px-8 max-w-screen-xl mx-auto w-full">

      {/* Top bar */}
      <div className="flex items-center justify-between mb-8">
        <Link
          href="/admin/kurse"
          className="inline-flex items-center gap-2 text-sm font-bold text-dark/40 hover:text-wine-red transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Kurse
        </Link>
        <Link
          href={`/admin/kurse/${id}/bearbeiten`}
          className="inline-flex items-center gap-2 bg-wine-red text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-garnet-red transition-colors"
        >
          <Pencil className="w-3.5 h-3.5" />
          Bearbeiten
        </Link>
      </div>

      {/* Course summary card */}
      <div className="bg-white rounded-xl border border-dark/5 shadow-sm p-8 mb-6">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div>
            <p className="text-[10px] font-mono text-dark/30 mb-1">{course.id}</p>
            <h1 className="text-3xl font-bold text-wine-red tracking-tight">{course.title}</h1>
          </div>
          <span className={`px-3 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider ${courseStatus.style}`}>
            {courseStatus.label}
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm font-condensed">
          <div className="flex items-center gap-2 text-dark/60">
            <CalendarDays className="w-4 h-4 text-wine-red shrink-0" />
            {formatDate(course.date)}
          </div>
          <div className="flex items-center gap-2 text-dark/60">
            <Clock className="w-4 h-4 text-wine-red shrink-0" />
            {formatTime(course.start_time)}
            {course.end_time && ` – ${formatTime(course.end_time)}`}
          </div>
          <div className="flex items-center gap-2 text-dark/60">
            <MapPin className="w-4 h-4 text-wine-red shrink-0" />
            {course.location}
          </div>
          <div className="flex items-center gap-2 text-dark/60">
            <Euro className="w-4 h-4 text-wine-red shrink-0" />
            {Number(course.price_per_person).toLocaleString("de-DE")} € / Pers.
          </div>
        </div>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-dark/5 shadow-sm p-6 text-center">
          <p className="text-[10px] font-bold uppercase tracking-widest text-dark/40 mb-2 flex items-center justify-center gap-1">
            <Users className="w-3.5 h-3.5" /> Gebuchte Plätze
          </p>
          <p className="text-3xl font-bold text-wine-red">
            {total_booked_spots}
            <span className="text-lg text-dark/30 font-medium"> / {course.capacity}</span>
          </p>
        </div>
        <div className="bg-white rounded-xl border border-dark/5 shadow-sm p-6 text-center">
          <p className="text-[10px] font-bold uppercase tracking-widest text-dark/40 mb-2">Freie Plätze</p>
          <p className={`text-3xl font-bold ${remaining_spots === 0 ? "text-red-500" : remaining_spots <= 3 ? "text-amber-500" : "text-green-600"}`}>
            {remaining_spots}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-dark/5 shadow-sm p-6 text-center">
          <p className="text-[10px] font-bold uppercase tracking-widest text-dark/40 mb-2">Umsatz</p>
          <p className="text-3xl font-bold text-wine-red">{formatPrice(total_revenue)}</p>
        </div>
      </div>

      {/* Bookings table */}
      <div className="bg-white rounded-xl border border-dark/5 shadow-sm overflow-hidden">
        <div className="px-8 py-5 border-b border-dark/5 flex items-center justify-between">
          <h2 className="text-sm font-bold text-dark">
            Buchungen
            <span className="ml-2 text-dark/40 font-normal">({bookings.length})</span>
          </h2>
        </div>

        {bookings.length === 0 ? (
          <div className="py-16 text-center text-dark/40 font-condensed">
            Keine Buchungen für diesen Kurs.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-dark/5 text-[10px] font-bold uppercase tracking-widest text-dark/40">
                  <th className="px-6 py-3 text-left">Buchungsnr.</th>
                  <th className="px-6 py-3 text-left">Hauptteilnehmer</th>
                  <th className="px-6 py-3 text-center">Pers.</th>
                  <th className="px-6 py-3 text-left">Kostform</th>
                  <th className="px-6 py-3 text-left">Zahlung</th>
                  <th className="px-6 py-3 text-right">Betrag</th>
                  <th className="px-6 py-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark/5">
                {bookings.map((b) => {
                  const primary = b.participants.find((p) => p.is_primary) ?? b.participants[0]
                  const allPrefs = b.participants.flatMap((p) => p.food_preferences ?? [])
                  const uniquePrefs = [...new Set(allPrefs)].filter((f) => f !== "keine")
                  const isCancelled = b.status === "cancelled" || b.status === "refunded"
                  const bookingBadge = BOOKING_STATUS[b.status] ?? { label: b.status, style: "bg-dark/8 text-dark/40" }
                  const paymentBadge = PAYMENT_STATUS[b.payment_status] ?? { label: b.payment_status, style: "bg-dark/8 text-dark/40" }

                  return (
                    <tr key={b.id} className={isCancelled ? "opacity-40" : "hover:bg-[#fdfadf]/60"}>
                      <td className="px-6 py-4">
                        <Link
                          href={`/admin/buchungen/${b.booking_number}`}
                          className="font-mono text-xs text-wine-red hover:underline underline-offset-2 inline-flex items-center gap-1"
                        >
                          {b.booking_number}
                          <ExternalLink className="w-3 h-3 opacity-50" />
                        </Link>
                        <p className="text-[10px] text-dark/30 mt-0.5 font-condensed">
                          {formatDate(b.created_at.split("T")[0])}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        {primary ? (
                          <>
                            <p className="font-bold text-dark">
                              {primary.first_name} {primary.last_name}
                            </p>
                            <p className="text-xs text-dark/50 font-condensed">{primary.email}</p>
                            {primary.phone && (
                              <p className="text-xs text-dark/40 font-condensed">{primary.phone}</p>
                            )}
                          </>
                        ) : (
                          <span className="text-dark/30">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-wine-red/8 text-wine-red text-xs font-bold">
                          {b.participants.length}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {uniquePrefs.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {uniquePrefs.map((f) => (
                              <span key={f} className="text-[10px] font-bold uppercase tracking-wide bg-wine-red/8 text-wine-red px-2 py-0.5 rounded-full">
                                {FOOD_LABELS[f] ?? f}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-dark/20">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wide ${paymentBadge.style}`}>
                          {paymentBadge.label}
                        </span>
                        <p className="text-xs text-dark/40 font-condensed mt-1">
                          {PAYMENT_METHOD[b.payment_method] ?? b.payment_method}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-dark">
                        {formatPrice(Number(b.total_amount))}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wide ${bookingBadge.style}`}>
                          {bookingBadge.label}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Teilnehmerliste */}
      <div className="bg-white rounded-xl border border-dark/5 shadow-sm overflow-hidden mt-6">
        <div className="px-8 py-5 border-b border-dark/5">
          <h2 className="text-sm font-bold text-dark">
            Teilnehmerliste
            <span className="ml-2 text-dark/40 font-normal">({flatParticipants.length})</span>
          </h2>
        </div>
        <ParticipantListAdmin participants={flatParticipants} />
      </div>
    </main>
  )
}
