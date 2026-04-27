import type { Metadata } from "next"
import Link from "next/link"
import { CalendarDays, Banknote, UtensilsCrossed, AlertCircle, Pencil } from "lucide-react"
import { AdminHeader } from "@/components/admin/AdminHeader"

export const metadata: Metadata = { title: "Dashboard — menufaktur Admin" }

const KPIs = [
  { icon: CalendarDays, label: "Buchungen heute", value: "14", tag: "Heute", tagColor: "text-dark/40" },
  { icon: Banknote, label: "Umsatz Monat", value: "12.840 €", tag: "Umsatz", tagColor: "text-garnet-red" },
  { icon: UtensilsCrossed, label: "Anstehende Kurse", value: "8", tag: "Kurse", tagColor: "text-dark/40" },
  { icon: AlertCircle, label: "Offene Überweisungen", value: "12", tag: "Aktion nötig", tagColor: "text-garnet-red" },
]

const UPCOMING_COURSES = [
  { date: "24. Mai, 18:00", name: "Die Kunst der Saucen", booked: 12, total: 12 },
  { date: "25. Mai, 17:30", name: "Sommerküche: Leicht & Edel", booked: 8, total: 12 },
  { date: "27. Mai, 19:00", name: "Wild & Wein Pairing", booked: 10, total: 12 },
  { date: "01. Jun, 18:00", name: "Grundlagen: Brot backen", booked: 4, total: 10 },
  { date: "03. Jun, 17:00", name: "Meeresfrüchte & Krustentiere", booked: 11, total: 12 },
]

const RECENT_BOOKINGS = [
  { initials: "MW", name: "Dr. Marcus Weber", course: "Die Kunst der Saucen", time: "Vor 12 Min.", status: "Bezahlt" },
  { initials: "EF", name: "Elena Fischer", course: "Wild & Wein Pairing", time: "Vor 45 Min.", status: "Offen" },
  { initials: "TM", name: "Thomas Müller", course: "Sommerküche", time: "Vor 2 Std.", status: "Bezahlt" },
  { initials: "SB", name: "Sarah Berger", course: "Grundlagen: Brot", time: "Vor 3 Std.", status: "Offen" },
  { initials: "HS", name: "Hans-Peter Schmidt", course: "Die Kunst der Saucen", time: "Vor 5 Std.", status: "Bezahlt" },
]

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Bezahlt: "bg-green-100 text-green-800",
    Offen: "bg-amber-100 text-amber-800",
    Storniert: "bg-red-100 text-red-800",
  }
  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${map[status] ?? "bg-dark/8 text-dark/50"}`}>
      {status}
    </span>
  )
}

export default function AdminDashboardPage() {
  return (
    <div className="bg-[#fdfadf] min-h-screen flex flex-col">
      <AdminHeader />
      <main className="flex-grow pt-28 pb-12 px-8 max-w-screen-xl mx-auto w-full">
        {/* Header */}
        <header className="mb-10">
          <h1 className="text-5xl font-bold text-wine-red tracking-tight mb-1">Übersicht</h1>
          <p className="text-xl text-wine-red/50 font-condensed">Willkommen zurück, Administrator</p>
        </header>

        {/* Alert banner */}
        <div className="mb-10 p-5 bg-garnet-red rounded-xl flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4 text-white">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <Banknote className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold">Ausstehende Zahlungen</p>
              <p className="text-sm opacity-80 font-condensed">
                Es gibt 12 offene Banküberweisungen, die Ihre Bestätigung erfordern.
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
                  {UPCOMING_COURSES.map((c) => {
                    const pct = Math.round((c.booked / c.total) * 100)
                    return (
                      <tr key={c.name} className="hover:bg-[#F8F5DA]/30 transition-colors">
                        <td className="px-6 py-5 text-sm text-wine-red font-condensed">{c.date}</td>
                        <td className="px-6 py-5 font-bold text-dark text-sm">{c.name}</td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2">
                            <div className="w-20 h-1.5 bg-wine-red/10 rounded-full overflow-hidden">
                              <div className="h-full bg-wine-red rounded-full" style={{ width: `${pct}%` }} />
                            </div>
                            <span className="text-xs font-bold text-dark/60">{c.booked}/{c.total}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <Link href="/admin/kurse" className="p-2 hover:bg-wine-red/5 rounded-lg inline-flex text-dark/40 hover:text-wine-red transition-colors">
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
                {RECENT_BOOKINGS.map((b) => (
                  <div key={b.name} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-wine-red/10 flex items-center justify-center text-wine-red font-bold text-xs shrink-0">
                      {b.initials}
                    </div>
                    <div className="flex-grow min-w-0">
                      <p className="font-bold text-dark text-sm truncate">{b.name}</p>
                      <p className="text-[10px] text-dark/40 font-condensed uppercase tracking-wide">
                        {b.course} · {b.time}
                      </p>
                    </div>
                    <StatusBadge status={b.status} />
                  </div>
                ))}
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

      <footer className="py-6 border-t border-wine-red/5 text-center">
        <p className="text-[10px] text-dark/30 tracking-widest uppercase font-condensed">
          © 2026 menufaktur · Admin
        </p>
      </footer>
    </div>
  )
}
