"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, Download, Eye } from "lucide-react"
import type { AdminBookingRow } from "@/lib/supabase/queries/admin-bookings"

const PAYMENT_STATUS: Record<string, { label: string; cls: string }> = {
  paid: { label: "Bezahlt", cls: "bg-green-100 text-green-800" },
  unpaid: { label: "Offen", cls: "bg-amber-100 text-amber-800" },
  refunded: { label: "Erstattet", cls: "bg-dark/8 text-dark/50" },
}

const METHOD_LABELS: Record<string, string> = {
  card: "Kreditkarte",
  sepa: "SEPA",
  bank_transfer: "Banküberweisung",
}

function StatusBadge({ status }: { status: string }) {
  const { label, cls } = PAYMENT_STATUS[status] ?? {
    label: status,
    cls: "bg-dark/8 text-dark/50",
  }
  return (
    <span
      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest whitespace-nowrap ${cls}`}
    >
      {label}
    </span>
  )
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

function fmtCourseDate(d: string) {
  return new Date(d).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

export function BuchungenClient({ bookings }: { bookings: AdminBookingRow[]; role: "admin" | "moderator" }) {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [methodFilter, setMethodFilter] = useState("")

  const filtered = bookings.filter((b) => {
    const name = b.profile
      ? `${b.profile.first_name ?? ""} ${b.profile.last_name ?? ""}`.toLowerCase()
      : ""
    const matchSearch =
      !search ||
      name.includes(search.toLowerCase()) ||
      b.booking_number.toLowerCase().includes(search.toLowerCase()) ||
      (b.profile?.email ?? "").toLowerCase().includes(search.toLowerCase())
    const matchStatus = !statusFilter || b.payment_status === statusFilter
    const matchMethod = !methodFilter || b.payment_method === methodFilter
    return matchSearch && matchStatus && matchMethod
  })

  function exportCSV() {
    const headers = [
      "Buchungsnr.",
      "Kurs",
      "Kursdatum",
      "Kunde",
      "E-Mail",
      "TN",
      "Betrag",
      "Zahlungsstatus",
      "Methode",
      "Eingegangen",
    ]
    const rows = filtered.map((b) => {
      const name = b.profile
        ? `${b.profile.first_name ?? ""} ${b.profile.last_name ?? ""}`.trim()
        : ""
      return [
        b.booking_number,
        b.course?.title ?? "",
        b.course?.date ? fmtCourseDate(b.course.date) : "",
        name,
        b.profile?.email ?? "",
        b.participant_count,
        b.total_amount.toFixed(2),
        PAYMENT_STATUS[b.payment_status]?.label ?? b.payment_status,
        METHOD_LABELS[b.payment_method] ?? b.payment_method,
        fmtDate(b.created_at),
      ]
    })
    const csv = [headers, ...rows]
      .map((row) => row.map((v) => `"${v}"`).join(","))
      .join("\n")
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `buchungen-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <>
      <div className="mb-6 flex justify-end">
        <button
          onClick={exportCSV}
          className="inline-flex items-center gap-2 bg-wine-red text-white px-6 py-3 rounded-xl font-bold hover:bg-garnet-red transition-colors shadow-sm text-sm"
        >
          <Download className="w-4 h-4" />
          CSV exportieren
        </button>
      </div>

      <section className="mb-8 p-6 bg-[#F8F5DA] rounded-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-dark/40 font-condensed ml-1">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#ECE9CF] border-none rounded-lg text-sm h-12 px-3 focus:outline-none focus:ring-2 focus:ring-wine-red/20 font-condensed text-dark"
            >
              <option value="">Alle Stati</option>
              <option value="paid">Bezahlt</option>
              <option value="unpaid">Offen</option>
              <option value="refunded">Erstattet</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-dark/40 font-condensed ml-1">
              Zahlungsart
            </label>
            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="bg-[#ECE9CF] border-none rounded-lg text-sm h-12 px-3 focus:outline-none focus:ring-2 focus:ring-wine-red/20 font-condensed text-dark"
            >
              <option value="">Alle Methoden</option>
              <option value="card">Kreditkarte</option>
              <option value="sepa">SEPA</option>
              <option value="bank_transfer">Banküberweisung</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5 lg:col-span-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-dark/40 font-condensed ml-1">
              Suche
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark/30" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Name, E-Mail oder Buchungsnr. suchen"
                className="w-full h-12 pl-10 pr-4 bg-[#ECE9CF] border-none rounded-lg text-sm text-dark placeholder:text-dark/30 focus:outline-none focus:ring-2 focus:ring-wine-red/20 font-condensed"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="bg-white rounded-xl overflow-hidden border border-dark/5 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#F8F5DA]/50 border-b border-dark/8">
                {[
                  "Buchungsnr.",
                  "Kurs",
                  "Kunde",
                  "TN",
                  "Betrag",
                  "Zahlung",
                  "Methode",
                  "Eingegangen",
                  "",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-wine-red whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-dark/5">
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={9}
                    className="px-6 py-12 text-center text-dark/40 font-condensed"
                  >
                    Keine Buchungen gefunden.
                  </td>
                </tr>
              )}
              {filtered.map((b) => {
                const name = b.profile
                  ? `${b.profile.first_name ?? ""} ${b.profile.last_name ?? ""}`.trim() || "—"
                  : "Gast"
                return (
                  <tr
                    key={b.id}
                    className="hover:bg-[#F8F5DA]/20 transition-colors group"
                  >
                    <td className="px-6 py-5 font-mono text-xs text-wine-red whitespace-nowrap">
                      #{b.booking_number}
                    </td>
                    <td className="px-6 py-5">
                      <p className="font-bold text-dark text-sm">{b.course?.title ?? "—"}</p>
                      {b.course?.date && (
                        <p className="text-xs text-dark/40 font-condensed">
                          {fmtCourseDate(b.course.date)}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-5">
                      <p className="font-bold text-sm text-dark">{name}</p>
                      {b.profile?.email && (
                        <p className="text-xs text-dark/40 font-condensed">{b.profile.email}</p>
                      )}
                    </td>
                    <td className="px-6 py-5 font-bold text-dark text-sm">
                      {b.participant_count}
                    </td>
                    <td className="px-6 py-5 font-bold text-dark whitespace-nowrap">
                      {b.total_amount.toFixed(2).replace(".", ",")} €
                    </td>
                    <td className="px-6 py-5">
                      <StatusBadge status={b.payment_status} />
                    </td>
                    <td className="px-6 py-5 text-sm text-dark/60 font-condensed whitespace-nowrap">
                      {METHOD_LABELS[b.payment_method] ?? b.payment_method}
                    </td>
                    <td className="px-6 py-5 text-sm text-dark/60 font-condensed whitespace-nowrap">
                      {fmtDate(b.created_at)}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link
                          href={`/admin/buchungen/${b.booking_number}`}
                          className="p-2 text-dark/40 hover:text-wine-red rounded-lg transition-colors inline-flex"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
      {filtered.length > 0 && (
        <p className="mt-4 text-xs text-dark/40 font-condensed text-right">
          {filtered.length} von {bookings.length} Buchungen
        </p>
      )}
    </>
  )
}
