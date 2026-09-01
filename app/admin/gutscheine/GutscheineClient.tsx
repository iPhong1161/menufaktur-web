"use client"

import { useState, useMemo, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Search, Download, Eye, Plus, Pencil, Check, Truck } from "lucide-react"
import { AdminBackButton } from "@/components/admin/AdminBackButton"
import { CreateVoucherModal } from "@/components/admin/CreateVoucherModal"
import { updateVoucherStatusAction, markVoucherDispatchedAction } from "./actions"
import type { AdminVoucher } from "@/lib/supabase/queries/vouchers"

type FilterKey = "alle" | "aktiv" | "eingeloest" | "zu-versenden" | "abgelaufen"

const FILTER_TABS: { key: FilterKey; label: string }[] = [
  { key: "alle", label: "Alle" },
  { key: "aktiv", label: "Aktiv" },
  { key: "eingeloest", label: "Eingelöst" },
  { key: "zu-versenden", label: "Zu versenden" },
  { key: "abgelaufen", label: "Abgelaufen" },
]

function isPostalPending(v: AdminVoucher): boolean {
  return v.postal_address != null && v.dispatched_at == null && v.status === "active"
}

function matchesFilter(v: AdminVoucher, filter: FilterKey): boolean {
  switch (filter) {
    case "alle":
      return true
    case "aktiv":
      return v.status === "active"
    case "eingeloest":
      return v.status === "redeemed"
    case "abgelaufen":
      return v.status === "expired" || v.status === "cancelled"
    case "zu-versenden":
      return isPostalPending(v)
  }
}

const STATUS_LABEL: Record<AdminVoucher["status"], string> = {
  active: "Aktiv",
  redeemed: "Eingelöst",
  expired: "Abgelaufen",
  cancelled: "Abgelaufen",
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

type EditableStatus = "active" | "redeemed" | "expired"
const EDITABLE_STATUSES: EditableStatus[] = ["active", "redeemed", "expired"]

function formatDate(iso: string | null): string {
  if (!iso) return "—"
  return new Date(iso).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" })
}

// ─── Status toggle button ─────────────────────────────────────────────────────

function VoucherStatusButton({ id, status }: { id: string; status: AdminVoucher["status"] }) {
  const initial = (status === "cancelled" ? "expired" : status) as EditableStatus
  const [localStatus, setLocalStatus] = useState<EditableStatus>(initial)
  const [open, setOpen] = useState(false)
  const [confirming, setConfirming] = useState<EditableStatus | null>(null)
  const [pending, setPending] = useState(false)

  async function apply(next: EditableStatus) {
    const prev = localStatus
    setLocalStatus(next)
    setOpen(false)
    setConfirming(null)
    setPending(true)
    const result = await updateVoucherStatusAction(id, next)
    setPending(false)
    if ("error" in result) setLocalStatus(prev)
  }

  function handleOption(next: EditableStatus) {
    if (next === localStatus) { setOpen(false); return }
    if (next === "active") {
      apply(next)
    } else {
      setConfirming(next)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest whitespace-nowrap ${STATUS_STYLE[localStatus]} ${pending ? "opacity-50" : ""}`}>
        {STATUS_LABEL[localStatus]}
      </span>

      <div className="relative">
        {open && (
          <div
            className="fixed inset-0 z-10"
            onClick={() => { setOpen(false); setConfirming(null) }}
          />
        )}
        <button
          onClick={() => { setOpen(!open); setConfirming(null) }}
          disabled={pending}
          className="p-1 text-dark/25 hover:text-wine-red rounded transition-colors disabled:opacity-30"
          title="Status ändern"
        >
          <Pencil className="w-3 h-3" />
        </button>

        {open && (
          <div className="absolute left-0 top-full mt-1 z-20 bg-white rounded-xl shadow-lg border border-dark/8 overflow-hidden min-w-[170px]">
            {confirming ? (
              <div className="p-3 space-y-2.5">
                <p className="text-[10px] font-bold uppercase tracking-widest text-dark/40">
                  Status setzen auf
                </p>
                <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest inline-block ${STATUS_STYLE[confirming]}`}>
                  {STATUS_LABEL[confirming]}
                </span>
                <div className="flex gap-2 pt-0.5">
                  <button
                    onClick={() => apply(confirming)}
                    className="flex-1 py-1.5 bg-wine-red hover:bg-garnet-red text-white rounded-lg text-xs font-bold transition-colors"
                  >
                    Bestätigen
                  </button>
                  <button
                    onClick={() => setConfirming(null)}
                    className="flex-1 py-1.5 bg-dark/8 hover:bg-dark/12 text-dark/60 rounded-lg text-xs font-bold transition-colors"
                  >
                    Abbrechen
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-1">
                {EDITABLE_STATUSES.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleOption(s)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center justify-between gap-3 ${
                      s === localStatus ? "cursor-default" : "hover:bg-[#F8F5DA]"
                    }`}
                  >
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${STATUS_STYLE[s]}`}>
                      {STATUS_LABEL[s]}
                    </span>
                    {s === localStatus && <Check className="w-3 h-3 text-dark/30 shrink-0" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Als versendet markieren ──────────────────────────────────────────────────

function MarkDispatchedButton({ id }: { id: string }) {
  const [pending, setPending] = useState(false)
  const [done, setDone] = useState(false)

  async function handleClick() {
    if (pending || done) return
    setPending(true)
    const result = await markVoucherDispatchedAction(id)
    setPending(false)
    if (!("error" in result)) setDone(true)
  }

  return (
    <button
      onClick={handleClick}
      disabled={pending || done}
      title="Als versendet markieren"
      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-wine-red text-white text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-garnet-red transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
    >
      <Truck className="w-3 h-3" />
      {done ? "Versendet" : pending ? "…" : "Als versendet"}
    </button>
  )
}

// ─── Main page client ─────────────────────────────────────────────────────────

export function GutscheineClient({ vouchers, role }: { vouchers: AdminVoucher[]; role: "admin" | "moderator" }) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const initialFilter = (searchParams.get("filter") as FilterKey | null) ?? "alle"
  const validFilter: FilterKey = FILTER_TABS.some((t) => t.key === initialFilter)
    ? (initialFilter as FilterKey)
    : "alle"

  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<FilterKey>(validFilter)
  const [showModal, setShowModal] = useState(false)

  // Keep local state in sync when the URL changes (e.g. via the notification bell)
  useEffect(() => {
    const fromUrl = (searchParams.get("filter") as FilterKey | null) ?? "alle"
    const next: FilterKey = FILTER_TABS.some((t) => t.key === fromUrl) ? fromUrl : "alle"
    setFilter(next)
  }, [searchParams])

  function selectFilter(next: FilterKey) {
    setFilter(next)
    const params = new URLSearchParams(searchParams.toString())
    if (next === "alle") params.delete("filter")
    else params.set("filter", next)
    const qs = params.toString()
    router.replace(qs ? `/admin/gutscheine?${qs}` : "/admin/gutscheine", { scroll: false })
  }

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    return vouchers.filter((v) => {
      if (!matchesFilter(v, filter)) return false
      if (q) {
        const match =
          v.code.toLowerCase().includes(q) ||
          v.purchaser_name.toLowerCase().includes(q) ||
          v.recipient_name.toLowerCase().includes(q)
        if (!match) return false
      }
      return true
    })
  }, [vouchers, search, filter])

  const tabCounts = useMemo(() => {
    const counts: Record<FilterKey, number> = {
      alle: vouchers.length,
      aktiv: 0,
      eingeloest: 0,
      "zu-versenden": 0,
      abgelaufen: 0,
    }
    for (const v of vouchers) {
      if (v.status === "active") counts.aktiv++
      if (v.status === "redeemed") counts.eingeloest++
      if (v.status === "expired" || v.status === "cancelled") counts.abgelaufen++
      if (isPostalPending(v)) counts["zu-versenden"]++
    }
    return counts
  }, [vouchers])

  return (
    <>
      <AdminBackButton role={role} />

      {/* Header */}
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-5xl font-bold text-wine-red tracking-tight mb-1">Gutscheine</h1>
          <p className="text-lg text-dark/50 font-condensed">
            {filtered.length} von {vouchers.length} Gutschein{vouchers.length !== 1 ? "en" : ""}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {role === "admin" && (
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 bg-wine-red text-white px-8 py-4 rounded-xl font-bold hover:bg-garnet-red transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Neuer Gutschein
            </button>
          )}
          <button className="inline-flex items-center gap-2 border border-dark/15 text-dark/60 px-6 py-4 rounded-xl font-bold hover:bg-dark/5 transition-colors">
            <Download className="w-4 h-4" />
            CSV
          </button>
        </div>
      </header>

      {/* Filter tabs + search */}
      <section className="mb-8 space-y-4">
        <div className="flex flex-wrap gap-2">
          {FILTER_TABS.map((tab) => {
            const active = filter === tab.key
            const count = tabCounts[tab.key]
            return (
              <button
                key={tab.key}
                onClick={() => selectFilter(tab.key)}
                className={
                  active
                    ? "inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest bg-wine-red text-white transition-colors"
                    : "inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest bg-[#F8F5DA] text-dark/60 hover:bg-[#ECE9CF] transition-colors"
                }
              >
                {tab.label}
                <span
                  className={
                    active
                      ? "text-[10px] bg-white/20 rounded-full px-1.5 py-0.5 tabular-nums"
                      : "text-[10px] bg-dark/8 rounded-full px-1.5 py-0.5 tabular-nums"
                  }
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>
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
                    <td className="px-6 py-5">
                      <p className="text-sm text-dark font-bold">{v.recipient_name}</p>
                      {v.postal_address && (
                        <span
                          className={
                            v.dispatched_at
                              ? "mt-1 inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-green-100 text-green-800"
                              : "mt-1 inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-amber-100 text-amber-800"
                          }
                        >
                          {v.dispatched_at ? "Versendet" : "Zu versenden"}
                        </span>
                      )}
                    </td>
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
                      {role === "admin" ? (
                        <VoucherStatusButton id={v.id} status={v.status} />
                      ) : (
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest whitespace-nowrap ${STATUS_STYLE[v.status]}`}>
                          {STATUS_LABEL[v.status]}
                        </span>
                      )}
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
                      <div className="flex items-center gap-2">
                        {role === "admin" && isPostalPending(v) && (
                          <MarkDispatchedButton id={v.id} />
                        )}
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-2 text-dark/40 hover:text-wine-red rounded-lg transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-dark/40 hover:text-wine-red rounded-lg transition-colors">
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && <CreateVoucherModal onClose={() => setShowModal(false)} />}
    </>
  )
}
