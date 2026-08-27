"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { Bell, MessageSquare, CreditCard, Ticket } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  getNotifications,
  type NotificationsPayload,
} from "@/app/admin/notifications-actions"

function relativeTime(iso: string): string {
  const then = new Date(iso)
  const now = new Date()
  const sameDay =
    then.getFullYear() === now.getFullYear() &&
    then.getMonth() === now.getMonth() &&
    then.getDate() === now.getDate()
  if (sameDay) {
    return then.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })
  }
  const yesterday = new Date(now)
  yesterday.setDate(now.getDate() - 1)
  const isYesterday =
    then.getFullYear() === yesterday.getFullYear() &&
    then.getMonth() === yesterday.getMonth() &&
    then.getDate() === yesterday.getDate()
  if (isYesterday) return "gestern"
  const diffMs = now.getTime() - then.getTime()
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  if (days > 0 && days < 7) return `vor ${days} Tagen`
  return then.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit" })
}

function daysSince(iso: string): number {
  const then = new Date(iso)
  const now = new Date()
  return Math.max(0, Math.floor((now.getTime() - then.getTime()) / (1000 * 60 * 60 * 24)))
}

function truncate(text: string, max = 42): string {
  if (text.length <= max) return text
  return text.slice(0, max - 1).trimEnd() + "…"
}

export function NotificationBell() {
  const [open, setOpen] = useState(false)
  const [data, setData] = useState<NotificationsPayload | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("mousedown", handleClick)
    document.addEventListener("keydown", handleKey)
    return () => {
      document.removeEventListener("mousedown", handleClick)
      document.removeEventListener("keydown", handleKey)
    }
  }, [open])

  async function refresh() {
    setLoading(true)
    setError(null)
    const result = await getNotifications()
    if ("error" in result) {
      setError(result.error)
      setData(null)
    } else {
      setData(result)
    }
    setLoading(false)
  }

  async function toggle() {
    const next = !open
    setOpen(next)
    if (next) await refresh()
  }

  const total = data?.totalCount ?? 0

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={toggle}
        aria-label="Benachrichtigungen"
        aria-expanded={open}
        className="relative p-2 hover:bg-wine-red/5 rounded-lg text-dark/60 transition-colors"
      >
        <Bell className="w-5 h-5" />
        {total > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-wine-red text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 shadow-sm">
            {total > 99 ? "99+" : total}
          </span>
        )}
      </button>

      {open && (
        <div
          className={cn(
            "absolute right-0 mt-2 w-[360px] max-w-[calc(100vw-2rem)] bg-white rounded-xl shadow-xl border border-dark/5 overflow-hidden z-50"
          )}
        >
          <div className="px-5 py-4 border-b border-dark/5 flex items-center justify-between">
            <h3 className="text-sm font-bold text-wine-red uppercase tracking-widest">
              Benachrichtigungen
            </h3>
            {loading && <span className="text-[10px] text-dark/40">Lädt…</span>}
          </div>

          <div className="max-h-[70vh] overflow-y-auto">
            {error && (
              <p className="px-5 py-6 text-center text-sm text-red-600 font-condensed">
                {error}
              </p>
            )}

            {!error && !loading && data && total === 0 && (
              <p className="px-5 py-10 text-center text-sm text-dark/50 font-condensed">
                Keine neuen Benachrichtigungen
              </p>
            )}

            {!error && data && data.messages.items.length > 0 && (
              <Section
                title="Nachrichten"
                icon={<MessageSquare className="w-3.5 h-3.5" aria-hidden="true" />}
                allHref="/admin/nachrichten"
                allLabel="Alle Nachrichten anzeigen"
                onNavigate={() => setOpen(false)}
              >
                {data.messages.items.map((m) => (
                  <Link
                    key={m.id}
                    href="/admin/nachrichten"
                    onClick={() => setOpen(false)}
                    className="block px-5 py-3 hover:bg-wine-red/5 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-dark truncate">
                          {truncate(m.subject || "(kein Betreff)", 40)}
                        </p>
                        <p className="text-xs text-dark/50 font-condensed truncate">
                          {m.name}
                        </p>
                      </div>
                      <span className="text-[10px] text-dark/40 shrink-0 tabular-nums">
                        {relativeTime(m.created_at)}
                      </span>
                    </div>
                  </Link>
                ))}
              </Section>
            )}

            {!error && data && data.unpaidBookings.items.length > 0 && (
              <Section
                title="Unbezahlte Buchungen"
                icon={<CreditCard className="w-3.5 h-3.5" aria-hidden="true" />}
                allHref="/admin/buchungen"
                allLabel="Alle Buchungen anzeigen"
                onNavigate={() => setOpen(false)}
              >
                {data.unpaidBookings.items.map((b) => (
                  <Link
                    key={b.id}
                    href={`/admin/buchungen/${b.id}`}
                    onClick={() => setOpen(false)}
                    className="block px-5 py-3 hover:bg-wine-red/5 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-dark">
                          {b.booking_number}
                        </p>
                        <p className="text-xs text-dark/50 font-condensed">
                          seit {daysSince(b.created_at)} Tagen offen ·{" "}
                          {b.total_amount.toLocaleString("de-DE", { minimumFractionDigits: 2 })} €
                        </p>
                      </div>
                      <span className="text-[10px] text-dark/40 shrink-0 tabular-nums">
                        {relativeTime(b.created_at)}
                      </span>
                    </div>
                  </Link>
                ))}
              </Section>
            )}

            {!error && data && data.postalVouchers.items.length > 0 && (
              <Section
                title="Gutscheine zu versenden"
                icon={<Ticket className="w-3.5 h-3.5" aria-hidden="true" />}
                allHref="/admin/gutscheine"
                allLabel="Alle Gutscheine anzeigen"
                onNavigate={() => setOpen(false)}
              >
                {data.postalVouchers.items.map((v) => (
                  <Link
                    key={v.id}
                    href="/admin/gutscheine"
                    onClick={() => setOpen(false)}
                    className="block px-5 py-3 hover:bg-wine-red/5 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-dark">
                          {v.value.toLocaleString("de-DE", { minimumFractionDigits: 2 })} €
                        </p>
                        <p className="text-xs text-dark/50 font-condensed truncate">
                          {v.recipient_name || v.code}
                        </p>
                      </div>
                      <span className="text-[10px] text-dark/40 shrink-0 tabular-nums">
                        {relativeTime(v.created_at)}
                      </span>
                    </div>
                  </Link>
                ))}
              </Section>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function Section({
  title,
  icon,
  allHref,
  allLabel,
  onNavigate,
  children,
}: {
  title: string
  icon: React.ReactNode
  allHref: string
  allLabel: string
  onNavigate: () => void
  children: React.ReactNode
}) {
  return (
    <section className="border-b border-dark/5 last:border-b-0">
      <div className="px-5 pt-4 pb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-dark/40">
        {icon}
        {title}
      </div>
      {children}
      <Link
        href={allHref}
        onClick={onNavigate}
        className="block px-5 py-2.5 text-xs font-bold text-wine-red hover:bg-wine-red/5 transition-colors border-t border-dark/5"
      >
        {allLabel} →
      </Link>
    </section>
  )
}
