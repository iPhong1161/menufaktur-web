import type { Metadata } from "next"
import Link from "next/link"
import { Search, Plus, Eye, Pencil, Copy, Trash2 } from "lucide-react"
import { AdminHeader } from "@/components/admin/AdminHeader"

export const metadata: Metadata = { title: "Kurse — menufaktur Admin" }

const COURSES = [
  { id: "MOD-4921", title: "Handgemachte Pasta Masterclass", date: "12. Okt. 2024", time: "18:00 – 21:30", booked: 6, total: 8, price: 129, status: "Aktiv" },
  { id: "MOD-4922", title: "Wild & Wein Herbstmenü", date: "19. Okt. 2024", time: "17:30 – 22:00", booked: 8, total: 12, price: 149, status: "Aktiv" },
  { id: "MOD-4923", title: "Veganische Gourmetküche", date: "26. Okt. 2024", time: "18:00 – 21:00", booked: 3, total: 10, price: 99, status: "Aktiv" },
  { id: "MOD-4924", title: "Kunst der Patisserie", date: "02. Nov. 2024", time: "14:00 – 18:00", booked: 12, total: 12, price: 115, status: "Ausverkauft" },
  { id: "MOD-4925", title: "Asiatische Streetfood-Küche", date: "09. Nov. 2024", time: "17:00 – 21:30", booked: 0, total: 12, price: 119, status: "Entwurf" },
  { id: "MOD-4926", title: "Die Kunst der Saucen", date: "24. Mai 2026", time: "18:00 – 22:30", booked: 11, total: 12, price: 149, status: "Aktiv" },
]

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Aktiv: "bg-green-100 text-green-800 border border-green-200",
    Ausverkauft: "bg-wine-red/10 text-wine-red",
    Entwurf: "bg-dark/8 text-dark/50",
  }
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${map[status] ?? "bg-dark/8 text-dark/50"}`}>
      {status}
    </span>
  )
}

export default function AdminKursePage() {
  return (
    <div className="bg-[#fdfadf] min-h-screen flex flex-col">
      <AdminHeader />
      <main className="flex-grow pt-28 pb-12 px-8 max-w-screen-xl mx-auto w-full">
        {/* Header */}
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-5xl font-bold text-wine-red tracking-tight mb-1">Kurse</h1>
            <p className="text-lg text-dark/50 font-condensed">Alle Kurse verwalten</p>
          </div>
          <Link
            href="/admin/kurse/neu"
            className="inline-flex items-center gap-2 bg-wine-red text-white px-8 py-4 rounded-xl font-bold hover:bg-garnet-red transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Neuer Kurs
          </Link>
        </header>

        {/* Filters */}
        <section className="bg-[#F8F5DA] rounded-xl p-6 mb-8 flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[280px] relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dark/30" />
            <input
              type="text"
              placeholder="Kursnamen oder ID suchen..."
              className="w-full pl-11 pr-4 py-3 bg-[#ECE9CF] border-none rounded-xl text-sm text-dark placeholder:text-dark/30 focus:outline-none focus:ring-2 focus:ring-wine-red/20 font-condensed"
            />
          </div>
          <select className="bg-[#ECE9CF] border-none rounded-xl px-4 py-3 text-sm text-dark focus:outline-none focus:ring-2 focus:ring-wine-red/20 font-condensed">
            <option>Status: Alle</option>
            <option>Aktiv</option>
            <option>Entwurf</option>
            <option>Ausverkauft</option>
          </select>
          <div className="flex items-center bg-[#ECE9CF] rounded-xl px-4 py-3 gap-2 text-sm text-dark/50 font-condensed cursor-pointer">
            <Search className="w-4 h-4" />
            Zeitraum wählen
          </div>
        </section>

        {/* Table */}
        <div className="bg-white rounded-xl overflow-hidden border border-dark/5 shadow-sm">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#F8F5DA]/50 border-b border-dark/8">
                <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-wine-red">Kurs</th>
                <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-wine-red">Datum & Uhrzeit</th>
                <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-wine-red">Kapazität</th>
                <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-wine-red">Preis</th>
                <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-wine-red">Status</th>
                <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-wine-red text-right">Aktionen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark/5">
              {COURSES.map((c) => {
                const pct = Math.round((c.booked / c.total) * 100)
                return (
                  <tr key={c.id} className="hover:bg-[#F8F5DA]/20 transition-colors group">
                    <td className="px-6 py-5">
                      <p className="font-bold text-dark">{c.title}</p>
                      <p className="text-xs text-dark/40 font-mono mt-0.5">ID: {c.id}</p>
                    </td>
                    <td className="px-6 py-5">
                      <p className="font-bold text-sm text-dark">{c.date}</p>
                      <p className="text-sm text-dark/50 font-condensed">{c.time}</p>
                    </td>
                    <td className="px-6 py-5">
                      <div className="w-32">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="font-bold text-wine-red">{c.booked} / {c.total}</span>
                          <span className="text-dark/40">{pct}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-dark/8 rounded-full overflow-hidden">
                          <div className="h-full bg-wine-red rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 font-bold text-wine-red">
                      {c.price.toFixed(2).replace(".", ",")} €
                    </td>
                    <td className="px-6 py-5">
                      <StatusBadge status={c.status} />
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 text-dark/40 hover:text-wine-red rounded-lg transition-colors"><Eye className="w-4 h-4" /></button>
                        <Link href={`/admin/kurse/${c.id}/bearbeiten`} className="p-2 text-dark/40 hover:text-wine-red rounded-lg transition-colors inline-flex"><Pencil className="w-4 h-4" /></Link>
                        <button className="p-2 text-dark/40 hover:text-wine-red rounded-lg transition-colors"><Copy className="w-4 h-4" /></button>
                        <button className="p-2 text-dark/40 hover:text-red-500 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </main>
      <footer className="py-6 border-t border-wine-red/5 text-center">
        <p className="text-[10px] text-dark/30 tracking-widest uppercase font-condensed">© 2026 menufaktur · Admin</p>
      </footer>
    </div>
  )
}
