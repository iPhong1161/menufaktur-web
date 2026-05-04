"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Search, Eye, ShieldCheck, UserX } from "lucide-react"
import type { AdminCustomer } from "@/lib/supabase/queries/admin-customers"
import { promoteToAdmin, deactivateCustomer } from "@/app/admin/kunden/actions"

const GERMAN_MONTHS = [
  "Jan", "Feb", "Mär", "Apr", "Mai", "Jun",
  "Jul", "Aug", "Sep", "Okt", "Nov", "Dez",
]

function formatDate(iso: string) {
  const d = new Date(iso)
  return `${d.getDate()}. ${GERMAN_MONTHS[d.getMonth()]} ${d.getFullYear()}`
}

function initials(c: AdminCustomer) {
  const f = c.first_name?.[0] ?? ""
  const l = c.last_name?.[0] ?? ""
  return (f + l).toUpperCase() || "?"
}

type Filter = "all" | "kunde" | "admin"

export function CustomerTable({ customers }: { customers: AdminCustomer[] }) {
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<Filter>("all")
  const [pending, setPending] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return customers.filter((c) => {
      const matchesSearch =
        !q ||
        `${c.first_name} ${c.last_name}`.toLowerCase().includes(q) ||
        (c.email ?? "").toLowerCase().includes(q)
      const matchesFilter =
        filter === "all" ||
        (filter === "admin" && c.is_admin) ||
        (filter === "kunde" && !c.is_admin)
      return matchesSearch && matchesFilter
    })
  }, [customers, search, filter])

  async function handlePromote(userId: string, name: string) {
    if (!window.confirm(`${name} als Admin registrieren? Diese Person erhält vollen Zugriff auf das Admin-Dashboard.`)) return
    setPending(userId)
    const result = await promoteToAdmin(userId)
    setPending(null)
    if ("error" in result) setError(result.error)
  }

  async function handleDeactivate(userId: string, name: string) {
    if (!window.confirm(`Konto von ${name} wirklich sperren?`)) return
    setPending(userId)
    const result = await deactivateCustomer(userId)
    setPending(null)
    if ("error" in result) setError(result.error)
  }

  return (
    <>
      {/* Filter bar */}
      <div className="bg-[#F8F5DA] p-6 rounded-xl mb-8 flex flex-wrap items-center gap-6">
        <div className="flex-grow min-w-[280px] relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dark/30" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Suchen nach Name oder E-Mail…"
            className="w-full pl-11 pr-4 py-3 bg-[#ECE9CF] rounded-lg text-sm text-dark placeholder:text-dark/30 focus:outline-none focus:ring-2 focus:ring-wine-red/20 font-condensed"
          />
        </div>
        <div className="flex bg-[#ECE9CF] p-1 rounded-lg">
          {(["all", "kunde", "admin"] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-5 py-2 rounded-md text-sm font-bold transition-colors font-condensed ${filter === f ? "bg-wine-red text-white" : "text-dark/50 hover:text-wine-red"}`}
            >
              {f === "all" ? "Alle" : f === "kunde" ? "Kunden" : "Admins"}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
          {error}
          <button onClick={() => setError(null)} className="ml-3 font-bold underline">Schließen</button>
        </div>
      )}

      <div className="bg-white rounded-xl overflow-hidden border border-dark/5 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#F8F5DA]/50 border-b border-dark/8">
                {["Name", "E-Mail", "Registriert", "Buchungen", "Typ", ""].map((h) => (
                  <th
                    key={h}
                    className={`px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-wine-red whitespace-nowrap ${h === "Buchungen" ? "text-center" : ""}`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-dark/5">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-dark/40 font-condensed">
                    Keine Kunden gefunden.
                  </td>
                </tr>
              ) : (
                filtered.map((c) => {
                  const name = [c.first_name, c.last_name].filter(Boolean).join(" ") || "—"
                  const isLoading = pending === c.id
                  return (
                    <tr key={c.id} className="hover:bg-[#F8F5DA]/20 transition-colors group">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-wine-red/10 text-wine-red flex items-center justify-center font-bold text-xs shrink-0">
                            {initials(c)}
                          </div>
                          <span className="font-bold text-dark">{name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-sm text-dark/70 font-condensed">{c.email ?? "—"}</td>
                      <td className="px-6 py-5 text-sm text-dark/50 font-condensed whitespace-nowrap">
                        {formatDate(c.created_at)}
                      </td>
                      <td className="px-6 py-5 text-center font-bold text-dark">{c.booking_count}</td>
                      <td className="px-6 py-5">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                            c.is_admin
                              ? "bg-wine-red text-white"
                              : "bg-wine-red/8 text-wine-red"
                          }`}
                        >
                          {c.is_admin ? "Admin" : "Kunde"}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link
                            href={`/admin/kunden/${c.id}`}
                            className="p-2 rounded-lg hover:bg-wine-red/8 text-dark/40 hover:text-wine-red transition-colors"
                            title="Profil ansehen"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          {!c.is_admin && (
                            <button
                              onClick={() => handlePromote(c.id, name)}
                              disabled={isLoading}
                              className="p-2 rounded-lg hover:bg-wine-red/8 text-dark/40 hover:text-wine-red transition-colors disabled:opacity-40"
                              title="Als Admin registrieren"
                            >
                              <ShieldCheck className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDeactivate(c.id, name)}
                            disabled={isLoading}
                            className="p-2 rounded-lg hover:bg-red-50 text-dark/40 hover:text-red-600 transition-colors disabled:opacity-40"
                            title="Konto sperren"
                          >
                            <UserX className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-dark/5 bg-[#F8F5DA]/30">
          <p className="text-xs text-dark/40 font-condensed">
            {filtered.length} von {customers.length} Kunden
          </p>
        </div>
      </div>
    </>
  )
}
