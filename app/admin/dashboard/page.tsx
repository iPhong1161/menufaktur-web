import type { Metadata } from "next"
import Link from "next/link"
import { CalendarDays, UserPlus, UtensilsCrossed, AlertCircle, Pencil, Ticket, Users, Settings, BookOpen } from "lucide-react"
import { getAdminDashboardStats } from "@/lib/supabase/queries/admin-stats"
import { getUpcomingCoursesAdmin } from "@/lib/supabase/queries/admin-courses"
import { getRecentBookingsAdmin } from "@/lib/supabase/queries/admin-bookings"

export const metadata: Metadata = { title: "Dashboard — menufaktur Admin" }

const PAYMENT_STATUS: Record<string, { label: string; cls: string }> = {
  paid: { label: "Bezahlt", cls: "bg-green-100 text-green-800" },
  unpaid: { label: "Offen", cls: "bg-amber-100 text-amber-800" },
  refunded: { label: "Erstattet", cls: "bg-dark/8 text-dark/50" },
}

function StatusBadge({ status }: { status: string }) {
  const { label, cls } = PAYMENT_STATUS[status] ?? { label: status, cls: "bg-dark/8 text-dark/50" }
  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${cls}`}>
      {label}
    </span>
  )
}

function fmtCourseDate(d: string) {
  return new Date(d).toLocaleDateString("de-DE", { day: "2-digit", month: "short" })
}

export default async function AdminDashboardPage() {
  const [stats, upcomingCourses, recentBookings] = await Promise.all([
    getAdminDashboardStats(),
    getUpcomingCoursesAdmin(),
    getRecentBookingsAdmin(),
  ])

  const KPIs = [
    {
      icon: CalendarDays,
      label: "Buchungen diese Woche",
      value: String(stats.bookingsThisWeek),
      tag: "7 Tage",
      tagColor: "text-dark/40",
    },
    {
      icon: UserPlus,
      label: "Neue Registrierungen",
      value: String(stats.newRegistrations),
      tag: "7 Tage",
      tagColor: "text-dark/40",
    },
    {
      icon: UtensilsCrossed,
      label: "Anstehende Kurse",
      value: String(stats.upcomingCourses),
      tag: "Kurse",
      tagColor: "text-dark/40",
    },
    {
      icon: AlertCircle,
      label: "Offene Überweisungen",
      value: String(stats.pendingTransfers),
      tag: stats.pendingTransfers > 0 ? "Aktion nötig" : "Alles erledigt",
      tagColor: stats.pendingTransfers > 0 ? "text-garnet-red" : "text-dark/40",
    },
  ]

  return (
    <main className="flex-grow pt-28 pb-12 px-8 max-w-screen-xl mx-auto w-full">
      {/* Header */}
      <header className="mb-10">
        <h1 className="text-5xl font-bold text-wine-red tracking-tight mb-1">Übersicht</h1>
        <p className="text-xl text-wine-red/50 font-condensed">Willkommen zurück, Administrator</p>
      </header>

      {/* Alert banner */}
      {stats.pendingTransfers > 0 && (
        <div className="mb-10 p-5 bg-garnet-red rounded-xl flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4 text-white">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold">Ausstehende Zahlungen</p>
              <p className="text-sm opacity-80 font-condensed">
                Es gibt {stats.pendingTransfers} offene{stats.pendingTransfers === 1 ? "" : ""} Banküberweisung{stats.pendingTransfers === 1 ? "" : "en"}, die Ihre Bestätigung erfordern.
              </p>
            </div>
          </div>
          <Link
            href="/admin/buchungen"
            className="px-6 py-2 bg-white text-garnet-red rounded-xl font-bold text-sm hover:bg-[#fdfadf] transition-colors shrink-0"
          >
            Jetzt prüfen
          </Link>
        </div>
      )}

      {/* KPI grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {KPIs.map(({ icon: Icon, label, value, tag, tagColor }) => (
          <div key={label} className="bg-white p-6 rounded-xl shadow-sm border border-dark/5">
            <div className="flex justify-between items-start mb-4">
              <Icon className="w-7 h-7 text-wine-red" />
              <span className={`text-[10px] font-bold tracking-widest uppercase ${tagColor}`}>{tag}</span>
            </div>
            <p className="text-3xl font-bold text-wine-red mb-1">{value}</p>
            <p className="text-[11px] font-bold uppercase tracking-wider text-dark/40 font-condensed">{label}</p>
          </div>
        ))}
      </div>

      {/* Quick-access cards */}
      <div className="mb-12">
        <h2 className="text-lg font-bold text-wine-red/60 uppercase tracking-widest text-[11px] mb-5 font-condensed">
          Schnellzugriff
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            {
              href: "/admin/kurse",
              icon: UtensilsCrossed,
              title: "Kurse",
              description: "Kurse erstellen und verwalten",
            },
            {
              href: "/admin/buchungen",
              icon: BookOpen,
              title: "Buchungen",
              description: "Buchungsübersicht & Zahlungsstatus",
            },
            {
              href: "/admin/gutscheine",
              icon: Ticket,
              title: "Gutscheine",
              description: "Gutscheine ausgeben & prüfen",
            },
            {
              href: "/admin/kunden",
              icon: Users,
              title: "Kunden",
              description: "Profile, Buchungshistorie & Konten",
            },
            {
              href: "/admin/einstellungen",
              icon: Settings,
              title: "Einstellungen",
              description: "Systemkonfiguration",
            },
          ].map(({ href, icon: Icon, title, description }) => (
            <Link
              key={href}
              href={href}
              className="group bg-white hover:bg-wine-red rounded-xl p-6 border border-dark/5 shadow-sm transition-colors duration-200 flex flex-col gap-4"
            >
              <div className="w-10 h-10 rounded-lg bg-wine-red/8 group-hover:bg-white/20 flex items-center justify-center transition-colors">
                <Icon className="w-5 h-5 text-wine-red group-hover:text-white transition-colors" />
              </div>
              <div>
                <p className="font-bold text-dark group-hover:text-white text-sm transition-colors">{title}</p>
                <p className="text-[11px] text-dark/40 group-hover:text-white/70 font-condensed leading-snug mt-0.5 transition-colors">
                  {description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Main two-column */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">
        {/* Upcoming courses table (60%) */}
        <section className="lg:col-span-6">
          <div className="flex justify-between items-end mb-5">
            <h2 className="text-2xl font-bold text-wine-red">Anstehende Kurse</h2>
            <Link href="/admin/kurse" className="text-wine-red text-sm font-bold hover:underline underline-offset-4 font-condensed">
              Alle Kurse ansehen
            </Link>
          </div>
          <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-dark/5">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#F8F5DA]">
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-dark/40">Datum</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-dark/40">Kursname</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-dark/40">Teilnehmer</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-dark/40 text-right">Aktion</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark/5">
                {upcomingCourses.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-dark/40 font-condensed text-sm">
                      Keine anstehenden Kurse.
                    </td>
                  </tr>
                )}
                {upcomingCourses.map((c) => {
                  const pct = c.capacity > 0 ? Math.round((c.booked_count / c.capacity) * 100) : 0
                  return (
                    <tr key={c.id} className="hover:bg-[#F8F5DA]/30 transition-colors">
                      <td className="px-6 py-5 text-sm text-wine-red font-condensed whitespace-nowrap">
                        {fmtCourseDate(c.date)}, {c.start_time.slice(0, 5)}
                      </td>
                      <td className="px-6 py-5 font-bold text-dark text-sm">{c.title}</td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-1.5 bg-wine-red/10 rounded-full overflow-hidden">
                            <div className="h-full bg-wine-red rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-xs font-bold text-dark/60">
                            {c.booked_count}/{c.capacity}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <Link
                          href={`/admin/kurse/${c.id}/bearbeiten`}
                          className="p-2 hover:bg-wine-red/5 rounded-lg inline-flex text-dark/40 hover:text-wine-red transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Recent bookings (40%) */}
        <section className="lg:col-span-4">
          <div className="flex justify-between items-end mb-5">
            <h2 className="text-2xl font-bold text-wine-red">Letzte Buchungen</h2>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-dark/5">
            <div className="space-y-5">
              {recentBookings.length === 0 && (
                <p className="text-center text-dark/40 font-condensed text-sm py-4">
                  Keine Buchungen vorhanden.
                </p>
              )}
              {recentBookings.map((b) => {
                const firstName = b.profile?.first_name ?? ""
                const lastName = b.profile?.last_name ?? ""
                const name = `${firstName} ${lastName}`.trim() || "Gast"
                const initials = `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase() || "G"
                return (
                  <Link
                    key={b.id}
                    href={`/admin/buchungen/${b.booking_number}`}
                    className="flex items-center gap-4 hover:bg-[#F8F5DA]/40 -mx-2 px-2 py-1 rounded-lg transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-wine-red/10 flex items-center justify-center text-wine-red font-bold text-xs shrink-0">
                      {initials}
                    </div>
                    <div className="flex-grow min-w-0">
                      <p className="font-bold text-dark text-sm truncate">{name}</p>
                      <p className="text-[10px] text-dark/40 font-condensed uppercase tracking-wide truncate">
                        {b.course?.title ?? "—"}
                      </p>
                    </div>
                    <StatusBadge status={b.payment_status} />
                  </Link>
                )
              })}
            </div>
            <Link
              href="/admin/buchungen"
              className="w-full mt-7 py-3 block text-center bg-[#F8F5DA] text-wine-red font-bold rounded-xl text-xs hover:bg-[#ECE9CF] transition-colors uppercase tracking-widest font-condensed"
            >
              Alle Buchungen einsehen
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}
