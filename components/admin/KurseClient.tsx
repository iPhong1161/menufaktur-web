"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { Search, Eye, Pencil, Copy, Trash2 } from "lucide-react"
import { deleteCourseAction, duplicateCourseAction } from "@/app/admin/kurse/actions"
import type { AdminCourse } from "@/lib/supabase/queries/admin-courses"

const STATUS_STYLES: Record<string, string> = {
  published: "bg-green-100 text-green-800 border border-green-200",
  draft: "bg-dark/8 text-dark/50",
  cancelled: "bg-red-100 text-red-700",
  archived: "bg-dark/8 text-dark/50",
}

const STATUS_LABELS: Record<string, string> = {
  published: "Aktiv",
  draft: "Entwurf",
  cancelled: "Abgesagt",
  archived: "Archiviert",
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${STATUS_STYLES[status] ?? "bg-dark/8 text-dark/50"}`}
    >
      {STATUS_LABELS[status] ?? status}
    </span>
  )
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

function fmtTime(t: string) {
  return t.slice(0, 5)
}

export function KurseClient({ courses }: { courses: AdminCourse[] }) {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [, startTransition] = useTransition()
  const [rowErrors, setRowErrors] = useState<Record<string, string>>({})

  const filtered = courses.filter((c) => {
    const matchesSearch =
      !search ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.id.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = !statusFilter || c.status === statusFilter
    return matchesSearch && matchesStatus
  })

  function handleDelete(id: string) {
    if (!confirm("Kurs wirklich löschen?")) return
    startTransition(async () => {
      const result = await deleteCourseAction(id)
      if ("error" in result) {
        setRowErrors((prev) => ({ ...prev, [id]: result.error }))
      } else {
        window.location.reload()
      }
    })
  }

  function handleDuplicate(id: string) {
    startTransition(async () => {
      const result = await duplicateCourseAction(id)
      if ("error" in result) {
        setRowErrors((prev) => ({ ...prev, [id]: result.error }))
      } else {
        window.location.reload()
      }
    })
  }

  return (
    <>
      <section className="bg-[#F8F5DA] rounded-xl p-6 mb-8 flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[280px] relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dark/30" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Kursnamen oder ID suchen…"
            className="w-full pl-11 pr-4 py-3 bg-[#ECE9CF] border-none rounded-xl text-sm text-dark placeholder:text-dark/30 focus:outline-none focus:ring-2 focus:ring-wine-red/20 font-condensed"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-[#ECE9CF] border-none rounded-xl px-4 py-3 text-sm text-dark focus:outline-none focus:ring-2 focus:ring-wine-red/20 font-condensed"
        >
          <option value="">Status: Alle</option>
          <option value="published">Aktiv</option>
          <option value="draft">Entwurf</option>
          <option value="cancelled">Abgesagt</option>
          <option value="archived">Archiviert</option>
        </select>
      </section>

      <div className="bg-white rounded-xl overflow-hidden border border-dark/5 shadow-sm">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-[#F8F5DA]/50 border-b border-dark/8">
              <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-wine-red">
                Kurs
              </th>
              <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-wine-red">
                Datum & Uhrzeit
              </th>
              <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-wine-red">
                Kapazität
              </th>
              <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-wine-red">
                Preis
              </th>
              <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-wine-red">
                Status
              </th>
              <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-wine-red text-right">
                Aktionen
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark/5">
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-dark/40 font-condensed">
                  Keine Kurse gefunden.
                </td>
              </tr>
            )}
            {filtered.map((c) => {
              const pct =
                c.capacity > 0 ? Math.round((c.booked_count / c.capacity) * 100) : 0
              return (
                <tr
                  key={c.id}
                  className="hover:bg-[#F8F5DA]/20 transition-colors group"
                >
                  <td className="px-6 py-5">
                    <p className="font-bold text-dark">{c.title}</p>
                    <p className="text-xs text-dark/40 font-mono mt-0.5">
                      {c.id.slice(0, 8)}…
                    </p>
                    {rowErrors[c.id] && (
                      <p className="text-xs text-red-600 mt-1">{rowErrors[c.id]}</p>
                    )}
                  </td>
                  <td className="px-6 py-5">
                    <p className="font-bold text-sm text-dark">{fmtDate(c.date)}</p>
                    <p className="text-sm text-dark/50 font-condensed">
                      {fmtTime(c.start_time)} – {fmtTime(c.end_time)}
                    </p>
                  </td>
                  <td className="px-6 py-5">
                    <div className="w-32">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-bold text-wine-red">
                          {c.booked_count} / {c.capacity}
                        </span>
                        <span className="text-dark/40">{pct}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-dark/8 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-wine-red rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 font-bold text-wine-red">
                    {c.price_per_person.toFixed(2).replace(".", ",")} €
                  </td>
                  <td className="px-6 py-5">
                    <StatusBadge status={c.status} />
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link
                        href={`/kurse/${c.slug}`}
                        target="_blank"
                        className="p-2 text-dark/40 hover:text-wine-red rounded-lg transition-colors inline-flex"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/admin/kurse/${c.id}/bearbeiten`}
                        className="p-2 text-dark/40 hover:text-wine-red rounded-lg transition-colors inline-flex"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDuplicate(c.id)}
                        className="p-2 text-dark/40 hover:text-wine-red rounded-lg transition-colors"
                        title="Kurs duplizieren"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="p-2 text-dark/40 hover:text-red-500 rounded-lg transition-colors"
                        title="Kurs löschen"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      {filtered.length > 0 && (
        <p className="mt-4 text-xs text-dark/40 font-condensed text-right">
          {filtered.length} von {courses.length} Kursen
        </p>
      )}
    </>
  )
}
