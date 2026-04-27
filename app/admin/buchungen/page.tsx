import type { Metadata } from "next"
import Link from "next/link"
import { Search, Download, Eye, Pencil } from "lucide-react"
import { AdminHeader } from "@/components/admin/AdminHeader"

export const metadata: Metadata = { title: "Buchungen — menufaktur Admin" }

const BOOKINGS = [
  { nr: "MF-2026-00142", course: "Die Kunst der Saucen: Klassik trifft Moderne", courseDate: "12. Nov. 2024", customer: "Maximilian Lehmann", email: "m.lehmann@email.de", tn: 2, amount: 303, status: "Offen", method: "Banküberweisung", bookedAt: "14.10.2024" },
  { nr: "MF-2026-00141", course: "Handgemachte Pasta Masterclass", courseDate: "12. Okt. 2024", customer: "Marc-André Weber", email: "weber@example.com", tn: 2, amount: 298, status: "Bezahlt", method: "Kreditkarte", bookedAt: "13.10.2024" },
  { nr: "MF-2026-00140", course: "Wild & Wein Herbstmenü", courseDate: "19. Okt. 2024", customer: "Elena Fischer", email: "e.fischer@mail.de", tn: 1, amount: 149, status: "Bezahlt", method: "Kreditkarte", bookedAt: "12.10.2024" },
  { nr: "MF-2026-00139", course: "Sommerküche: Leicht & Edel", courseDate: "25. Mai 2026", customer: "Thomas Müller", email: "t.mueller@web.de", tn: 3, amount: 447, status: "Bezahlt", method: "PayPal", bookedAt: "11.10.2024" },
  { nr: "MF-2026-00138", course: "Kunst der Patisserie", courseDate: "02. Nov. 2024", customer: "Sarah Berger", email: "s.berger@gmail.com", tn: 1, amount: 115, status: "Offen", method: "Banküberweisung", bookedAt: "10.10.2024" },
  { nr: "MF-2026-00137", course: "Handgemachte Pasta Masterclass", courseDate: "12. Okt. 2024", customer: "Hans-Peter Schmidt", email: "hpschmidt@t-online.de", tn: 2, amount: 258, status: "Storniert", method: "Kreditkarte", bookedAt: "09.10.2024" },
]

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Bezahlt: "bg-green-100 text-green-800",
    Offen: "bg-amber-100 text-amber-800",
    Storniert: "bg-red-100 text-red-700",
  }
  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest whitespace-nowrap ${map[status] ?? "bg-dark/8 text-dark/50"}`}>
      {status}
    </span>
  )
}

export default function AdminBuchungenPage() {
  return (
    <div className="bg-[#fdfadf] min-h-screen flex flex-col">
      <AdminHeader />
      <main className="flex-grow pt-32 pb-16 px-8 max-w-screen-xl mx-auto w-full">
        {/* Header */}
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-5xl font-bold text-wine-red tracking-tight mb-1">Buchungen</h1>
            <p className="text-lg text-dark/50 font-condensed">Alle Buchungen einsehen und verwalten</p>
          </div>
          <button className="inline-flex items-center gap-2 bg-wine-red text-white px-8 py-4 rounded-xl font-bold hover:bg-garnet-red transition-colors shadow-sm">
            <Download className="w-4 h-4" />
            CSV exportieren
          </button>
        </header>

        {/* Filter bar */}
        <section className="mb-8 p-6 bg-[#F8F5DA] rounded-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-dark/40 font-condensed ml-1">Kurs</label>
              <select className="bg-[#ECE9CF] border-none rounded-lg text-sm h-12 px-3 focus:outline-none focus:ring-2 focus:ring-wine-red/20 font-condensed text-dark">
                <option>Alle Kurse</option>
                <option>Handgemachte Pasta</option>
                <option>Wild & Wein</option>
                <option>Patisserie</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-dark/40 font-condensed ml-1">Status</label>
              <select className="bg-[#ECE9CF] border-none rounded-lg text-sm h-12 px-3 focus:outline-none focus:ring-2 focus:ring-wine-red/20 font-condensed text-dark">
                <option>Alle Stati</option>
                <option>Bezahlt</option>
                <option>Offen</option>
                <option>Storniert</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-dark/40 font-condensed ml-1">Zahlungsart</label>
              <select className="bg-[#ECE9CF] border-none rounded-lg text-sm h-12 px-3 focus:outline-none focus:ring-2 focus:ring-wine-red/20 font-condensed text-dark">
                <option>Alle Methoden</option>
                <option>Kreditkarte</option>
                <option>PayPal</option>
                <option>Banküberweisung</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5 lg:col-span-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-dark/40 font-condensed ml-1">Suche</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark/30" />
                <input type="text" placeholder="Name oder Buchungsnr. suchen" className="w-full h-12 pl-10 pr-4 bg-[#ECE9CF] border-none rounded-lg text-sm text-dark placeholder:text-dark/30 focus:outline-none focus:ring-2 focus:ring-wine-red/20 font-condensed" />
              </div>
            </div>
          </div>
        </section>

        {/* Table */}
        <div className="bg-white rounded-xl overflow-hidden border border-dark/5 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#F8F5DA]/50 border-b border-dark/8">
                  {["Buchungsnr.", "Kurs", "Kunde", "TN", "Betrag", "Status", "Methode", "Gebucht", ""].map((h) => (
                    <th key={h} className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-wine-red whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-dark/5">
                {BOOKINGS.map((b) => (
                  <tr key={b.nr} className="hover:bg-[#F8F5DA]/20 transition-colors group">
                    <td className="px-6 py-5 font-mono text-xs text-wine-red whitespace-nowrap">#{b.nr}</td>
                    <td className="px-6 py-5">
                      <p className="font-bold text-dark text-sm">{b.course}</p>
                      <p className="text-xs text-dark/40 font-condensed">{b.courseDate}</p>
                    </td>
                    <td className="px-6 py-5">
                      <p className="font-bold text-sm text-dark">{b.customer}</p>
                      <p className="text-xs text-dark/40 font-condensed">{b.email}</p>
                    </td>
                    <td className="px-6 py-5 font-bold text-dark text-sm">{b.tn}</td>
                    <td className="px-6 py-5 font-bold text-dark whitespace-nowrap">
                      {b.amount.toFixed(2).replace(".", ",")} €
                    </td>
                    <td className="px-6 py-5"><StatusBadge status={b.status} /></td>
                    <td className="px-6 py-5 text-sm text-dark/60 font-condensed whitespace-nowrap">{b.method}</td>
                    <td className="px-6 py-5 text-sm text-dark/60 font-condensed whitespace-nowrap">{b.bookedAt}</td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link href={`/admin/buchungen/${b.nr}`} className="p-2 text-dark/40 hover:text-wine-red rounded-lg transition-colors inline-flex">
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button className="p-2 text-dark/40 hover:text-wine-red rounded-lg transition-colors">
                          <Pencil className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      <footer className="py-6 border-t border-wine-red/5 text-center">
        <p className="text-[10px] text-dark/30 tracking-widest uppercase font-condensed">© 2026 menufaktur · Admin</p>
      </footer>
    </div>
  )
}
