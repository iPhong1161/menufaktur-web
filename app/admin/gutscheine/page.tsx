import type { Metadata } from "next"
import { Search, Download, Eye } from "lucide-react"

export const metadata: Metadata = { title: "Gutscheine — menufaktur Admin" }

const VOUCHERS = [
  { nr: "GS-2026-00047", value: 109, title: "Kulinarischer Abend für Zwei", buyer: "Anna Müller", email: "anna.m@gmail.com", validUntil: "31.12.2027", status: "Aktiv", payStatus: "Bezahlt", createdAt: "27.04.2026" },
  { nr: "GS-2026-00046", value: 50, title: "Wertgutschein Atelier", buyer: "Thomas Weber", email: "t.weber@web.de", validUntil: "27.04.2028", status: "Aktiv", payStatus: "Bezahlt", createdAt: "25.04.2026" },
  { nr: "GS-2026-00045", value: 89, title: "Backkurs Macarons d'Art", buyer: "Jana Klein", email: "jana.klein@mail.de", validUntil: "12.11.2023", status: "Eingelöst", payStatus: "Bezahlt", createdAt: "20.04.2026" },
  { nr: "GS-2026-00044", value: 125, title: "Wertgutschein Premium", buyer: "Karl Hofmann", email: "khofmann@icloud.com", validUntil: "15.06.2026", status: "Aktiv", payStatus: "Bezahlt", createdAt: "18.04.2026" },
  { nr: "GS-2026-00043", value: 99, title: "Wertgutschein Atelier", buyer: "Petra Schulz", email: "petra.s@outlook.com", validUntil: "10.03.2025", status: "Abgelaufen", payStatus: "Bezahlt", createdAt: "10.03.2024" },
]

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Aktiv: "bg-green-100 text-green-800",
    Eingelöst: "bg-dark/8 text-dark/50",
    Abgelaufen: "bg-red-100 text-red-700",
  }
  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest whitespace-nowrap ${map[status] ?? "bg-dark/8 text-dark/50"}`}>
      {status}
    </span>
  )
}

function PayBadge({ status }: { status: string }) {
  return (
    <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-green-100 text-green-800">
      {status}
    </span>
  )
}

export default function AdminGutscheinePage() {
  return (
      <main className="flex-grow pt-32 pb-16 px-8 max-w-screen-xl mx-auto w-full">
        {/* Header */}
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-5xl font-bold text-wine-red tracking-tight mb-1">Gutscheine</h1>
            <p className="text-lg text-dark/50 font-condensed">Alle Gutscheine einsehen und verwalten</p>
          </div>
          <button className="inline-flex items-center gap-2 bg-wine-red text-white px-8 py-4 rounded-xl font-bold hover:bg-garnet-red transition-colors shadow-sm">
            <Download className="w-4 h-4" />
            CSV exportieren
          </button>
        </header>

        {/* Filter bar */}
        <section className="mb-8 p-6 bg-[#F8F5DA] rounded-xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-dark/40 font-condensed ml-1">Status</label>
              <select className="bg-[#ECE9CF] border-none rounded-lg text-sm h-12 px-3 focus:outline-none focus:ring-2 focus:ring-wine-red/20 font-condensed text-dark">
                <option>Alle Stati</option>
                <option>Aktiv</option>
                <option>Eingelöst</option>
                <option>Abgelaufen</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-dark/40 font-condensed ml-1">Zeitraum</label>
              <input type="text" placeholder="Datum wählen" className="h-12 px-3 bg-[#ECE9CF] border-none rounded-lg text-sm text-dark placeholder:text-dark/30 focus:outline-none focus:ring-2 focus:ring-wine-red/20 font-condensed" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-dark/40 font-condensed ml-1">Suche</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark/30" />
                <input type="text" placeholder="Code, Name oder E-Mail" className="w-full h-12 pl-10 pr-4 bg-[#ECE9CF] border-none rounded-lg text-sm text-dark placeholder:text-dark/30 focus:outline-none focus:ring-2 focus:ring-wine-red/20 font-condensed" />
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
                  {["Code", "Titel", "Käufer", "Wert", "Gültig bis", "Status", "Zahlung", "Ausgestellt", ""].map((h) => (
                    <th key={h} className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-wine-red whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-dark/5">
                {VOUCHERS.map((v) => (
                  <tr key={v.nr} className="hover:bg-[#F8F5DA]/20 transition-colors group">
                    <td className="px-6 py-5 font-mono text-xs text-wine-red whitespace-nowrap">#{v.nr}</td>
                    <td className="px-6 py-5 font-bold text-dark text-sm">{v.title}</td>
                    <td className="px-6 py-5">
                      <p className="font-bold text-sm text-dark">{v.buyer}</p>
                      <p className="text-xs text-dark/40 font-condensed">{v.email}</p>
                    </td>
                    <td className="px-6 py-5 font-bold text-wine-red whitespace-nowrap">
                      {v.value.toFixed(2).replace(".", ",")} €
                    </td>
                    <td className="px-6 py-5 text-sm text-dark/60 font-condensed whitespace-nowrap">{v.validUntil}</td>
                    <td className="px-6 py-5"><StatusBadge status={v.status} /></td>
                    <td className="px-6 py-5"><PayBadge status={v.payStatus} /></td>
                    <td className="px-6 py-5 text-sm text-dark/60 font-condensed whitespace-nowrap">{v.createdAt}</td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 text-dark/40 hover:text-wine-red rounded-lg transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-dark/40 hover:text-wine-red rounded-lg transition-colors">
                          <Download className="w-4 h-4" />
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
  )
}
