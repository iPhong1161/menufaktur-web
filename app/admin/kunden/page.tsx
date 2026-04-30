import type { Metadata } from "next"
import { Search, UserPlus, MoreHorizontal } from "lucide-react"

export const metadata: Metadata = { title: "Kunden — menufaktur Admin" }

const CUSTOMERS = [
  { initials: "AB", name: "Andreas Buchberger", email: "andreas.b@web.de", phone: "+49 172 8849 221", type: "Registriert", bookings: 12, revenue: 1420, lastActivity: "Gestern, 14:20", bg: "bg-wine-red/10 text-wine-red" },
  { initials: "SM", name: "Sophie Müller", email: "sophie.m@gmail.com", phone: "+49 151 2231 990", type: "Gast", bookings: 1, revenue: 149, lastActivity: "12. Okt 2023", bg: "bg-garnet-red/10 text-garnet-red" },
  { initials: "JK", name: "Johann Krämer", email: "kraemer.johann@t-online.de", phone: "+49 160 3345 112", type: "Registriert", bookings: 4, revenue: 590, lastActivity: "Gerade eben", bg: "bg-dark/10 text-dark/60" },
  { initials: "LW", name: "Lara Wagner", email: "lara.w@outlook.com", phone: "+49 152 4432 001", type: "Registriert", bookings: 22, revenue: 3850, lastActivity: "08. Okt 2023", bg: "bg-wine-red/10 text-wine-red" },
  { initials: "MK", name: "Maximilian Klein", email: "max.klein@business.de", phone: "+49 176 9901 223", type: "Gast", bookings: 0, revenue: 0, lastActivity: "Nie", bg: "bg-dark/10 text-dark/50" },
  { initials: "CH", name: "Claudia Heuser", email: "c.heuser@icloud.com", phone: "+49 155 0098 776", type: "Registriert", bookings: 5, revenue: 745, lastActivity: "Vor 3 Stunden", bg: "bg-garnet-red/10 text-garnet-red" },
  { initials: "PR", name: "Peter Richter", email: "p.richter@freenet.de", phone: "+49 163 5512 847", type: "Registriert", bookings: 3, revenue: 447, lastActivity: "Vor 2 Tagen", bg: "bg-dark/10 text-dark/60" },
  { initials: "ML", name: "Maximilian Lehmann", email: "m.lehmann@email.de", phone: "+49 151 12345678", type: "Registriert", bookings: 2, revenue: 303, lastActivity: "14. Okt 2024", bg: "bg-wine-red/10 text-wine-red" },
]

export default function AdminKundenPage() {
  return (
      <main className="flex-grow pt-32 pb-20 px-8 max-w-screen-xl mx-auto w-full">
        {/* Header */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-5xl font-bold text-wine-red tracking-tight mb-1">Kunden</h1>
            <p className="text-lg text-dark/50 font-condensed">Alle registrierten und Gast-Kunden Ihres Ateliers.</p>
          </div>
          <button className="inline-flex items-center gap-2 bg-wine-red text-white px-8 py-3 rounded-xl font-bold hover:bg-garnet-red transition-colors shadow-sm">
            <UserPlus className="w-4 h-4" />
            Neuen Kunden anlegen
          </button>
        </div>

        {/* Filter bar */}
        <div className="bg-[#F8F5DA] p-6 rounded-xl mb-8 flex flex-wrap items-center gap-6">
          <div className="flex-grow min-w-[280px] relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dark/30" />
            <input
              type="text"
              placeholder="Suchen nach Name, E-Mail oder Telefon..."
              className="w-full pl-11 pr-4 py-3 bg-[#ECE9CF] border-none rounded-lg text-sm text-dark placeholder:text-dark/30 focus:outline-none focus:ring-2 focus:ring-wine-red/20 font-condensed"
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="flex bg-[#ECE9CF] p-1 rounded-lg">
              {["Alle", "Registriert", "Gast"].map((label, i) => (
                <button
                  key={label}
                  className={`px-5 py-2 rounded-md text-sm font-bold transition-colors font-condensed ${i === 0 ? "bg-wine-red text-white" : "text-dark/50 hover:text-wine-red"}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl overflow-hidden border border-dark/5 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#F8F5DA]/50 border-b border-dark/8">
                  {["Name", "Kontakt", "Typ", "Buchungen", "Umsatz", "Letzte Aktivität", ""].map((h) => (
                    <th key={h} className={`px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-wine-red whitespace-nowrap ${h === "Buchungen" ? "text-center" : h === "Umsatz" ? "text-right" : ""}`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-dark/5">
                {CUSTOMERS.map((c) => (
                  <tr key={c.email} className="hover:bg-[#F8F5DA]/20 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full ${c.bg} flex items-center justify-center font-bold text-xs shrink-0`}>
                          {c.initials}
                        </div>
                        <span className="font-bold text-dark">{c.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-sm font-bold text-dark">{c.email}</p>
                      <p className="text-xs text-dark/40 font-condensed">{c.phone}</p>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${c.type === "Registriert" ? "bg-wine-red/8 text-wine-red" : "bg-dark/8 text-dark/50"}`}>
                        {c.type}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-center font-bold text-dark">{c.bookings}</td>
                    <td className="px-6 py-5 text-right font-bold text-dark whitespace-nowrap">
                      {c.revenue.toFixed(2).replace(".", ",")} €
                    </td>
                    <td className="px-6 py-5 text-sm text-dark/50 font-condensed">{c.lastActivity}</td>
                    <td className="px-6 py-5">
                      <button className="text-dark/30 hover:text-wine-red transition-colors opacity-0 group-hover:opacity-100">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
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
