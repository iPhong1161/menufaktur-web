"use client"

import { useState, useMemo } from "react"
import { Search, Download, Eye, Plus } from "lucide-react"
import { AdminBackButton } from "@/components/admin/AdminBackButton"
import type { AdminVoucher } from "@/lib/supabase/queries/vouchers"

const STATUS_LABEL: Record<AdminVoucher["status"], string> = {
  active: "Aktiv",
  redeemed: "Eingelöst",
  expired: "Abgelaufen",
  cancelled: "Storniert",
}

const STATUS_STYLE: Record<AdminVoucher["status"], string> = {
  active: "bg-green-100 text-green-800",
  redeemed: "bg-dark/8 text-dark/50",
  expired: "bg-red-100 text-red-700",
  cancelled: "bg-red-100 text-red-700",
}

const PAY_LABEL: Record<AdminVoucher["payment_status"], string> = {
  paid: "Bezahlt",
  unpaid: "Offen",
  refunded: "Erstattet",
}

const PAY_STYLE: Record<AdminVoucher["payment_status"], string> = {
  paid: "bg-green-100 text-green-800",
  unpaid: "bg-yellow-100 text-yellow-800",
  refunded: "bg-dark/8 text-dark/50",
}

function formatDate(iso: string | null): string {
  if (!iso) return "—"
  return new Date(iso).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" })
}

export function GutscheineClient({ vouchers }: { vouchers: AdminVoucher[] }) {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<"" | AdminVoucher["status"]>("")

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    return vouchers.filter((v) => {
      if (statusFilter && v.status !== statusFilter) return false
      if (q) {
        const match =
          v.code.toLowerCase().includes(q) ||
          v.purchaser_name.toLowerCase().includes(q) ||
          v.recipient_name.toLowerCase().includes(q)
        if (!match) return false
      }
      return true
    })
  }, [vouchers, search, statusFilter])

  return (
    <>
      <AdminBackButton />

      {/* Header */}
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-5xl font-bold text-wine-red tracking-tight mb-1">Gutscheine</h1>
          <p className="text-lg text-dark/50 font-condensed">
            {filtered.length} von {vouchers.length} Gutschein{vouchers.length !== 1 ? "en" : ""}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 bg-wine-red text-white px-8 py-4 rounded-xl font-bold hover:bg-garnet-red transition-colors shadow-sm">
            <Plus className="w-4 h-4" />
            Neuer Gutschein
          </button>
          <button className="inline-flex items-center gap-2 border border-dark/15 text-dark/60 px-6 py-4 rounded-xl font-bold hover:bg-dark/5 transition-colors">
            <Download className="w-4 h-4" />
            CSV
          </button>
        </div>
      </header>

      {/* Filter bar */}
      <section className="mb-8 p-6 bg-[#F8F5DA] rounded-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-dark/40 font-condensed ml-1">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as "" | AdminVoucher["status"])}
              className="bg-[#ECE9CF] border-none rounded-lg text-sm h-12 px-3 focus:outline-none focus:ring-2 focus:ring-wine-red/20 font-condensed text-dark"
            >
              <option value="">Alle Stati</option>
              <option value="active">Aktiv</option>
              <option value="redeemed">Eingelöst</option>
              <option value="expired">Abgelaufen</option>
              <option value="cancelled">Storniert</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-dark/40 font-condensed ml-1">
              Suche
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark/30" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Code, Käufer oder Empfänger"
                className="w-full h-12 pl-10 pr-4 bg-[#ECE9CF] border-none rounded-lg text-sm text-dark placeholder:text-dark/30 focus:outline-none focus:ring-2 focus:ring-wine-red/20 font-condensed"
              />
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
                {["Code", "Empfänger", "Käufer", "Wert", "Gültig bis", "Status", "Zahlung", "Ausgestellt", ""].map((h) => (
                  <th key={h} className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-wine-red whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-dark/5">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-16 text-center text-dark/40 font-condensed text-sm">
                    Keine Gutscheine gefunden
                  </td>
                </tr>
              ) : (
                filtered.map((v) => (
                  <tr key={v.id} className="hover:bg-[#F8F5DA]/20 transition-colors group">
                    <td className="px-6 py-5 font-mono text-xs text-wine-red whitespace-nowrap">{v.code}</td>
                    <td className="px-6 py-5 text-sm text-dark font-bold">{v.recipient_name}</td>
                    <td className="px-6 py-5">
                      <p className="font-bold text-sm text-dark">{v.purchaser_name}</p>
                      <p className="text-xs text-dark/40 font-condensed">{v.purchaser_email}</p>
                    </td>
                    <td className="px-6 py-5 font-bold text-wine-red whitespace-nowrap">
                      {v.value.toFixed(2).replace(".", ",")} €
                    </td>
                    <td className="px-6 py-5 text-sm text-dark/60 font-condensed whitespace-nowrap">
                      {formatDate(v.expires_at)}
                    </td>
                    <td className="px-6 py-5">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest whitespace-nowrap ${STATUS_STYLE[v.status]}`}>
                        {STATUS_LABEL[v.status]}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest whitespace-nowrap ${PAY_STYLE[v.payment_status]}`}>
                        {PAY_LABEL[v.payment_status]}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-sm text-dark/60 font-condensed whitespace-nowrap">
                      {formatDate(v.created_at)}
                    </td>
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
