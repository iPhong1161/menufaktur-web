"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { ChevronDown, ChevronUp, Check, Ticket, GraduationCap, Building2 } from "lucide-react"
import { AdminBackButton } from "@/components/admin/AdminBackButton"
import { updateMessageReadAction } from "./actions"

export type ContactMessage = {
  id: string
  created_at: string
  name: string
  email: string
  subject: string
  message: string
  read: boolean
  // Structured fields — null on messages sent before the contact form rebuild,
  // and on the voucher webhook's postal-order notifications.
  category: string | null
  booking_number: string | null
  course_title: string | null
  company: string | null
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

const TAG_CLASS =
  "inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-dark/8 text-dark/50"

function MessageRow({
  msg,
  bookingId,
}: {
  msg: ContactMessage
  bookingId?: string
}) {
  const [expanded, setExpanded] = useState(false)
  const [read, setRead] = useState(msg.read)
  const [isPending, startTransition] = useTransition()

  function markRead() {
    setRead(true)
    startTransition(async () => {
      const result = await updateMessageReadAction(msg.id, true)
      if ("error" in result) setRead(msg.read)
    })
  }

  return (
    <>
      <tr
        className={`border-b border-dark/5 cursor-pointer hover:bg-[#F8F5DA] transition-colors ${!read ? "bg-wine-red/3" : ""}`}
        onClick={() => setExpanded((v) => !v)}
      >
        <td className="px-6 py-4 w-8">
          {expanded
            ? <ChevronUp className="w-4 h-4 text-dark/40" />
            : <ChevronDown className="w-4 h-4 text-dark/40" />
          }
        </td>
        <td className="px-4 py-4">
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${read ? "bg-dark/8 text-dark/40" : "bg-wine-red/10 text-wine-red"}`}>
            {read ? "Gelesen" : "Ungelesen"}
          </span>
        </td>
        <td className="px-4 py-4">
          <p className={`text-sm ${!read ? "font-bold text-dark" : "font-medium text-dark/70"}`}>{msg.name}</p>
          <p className="text-xs text-dark/40 font-condensed">{msg.email}</p>
          {msg.company && (
            <p className="text-xs text-dark/40 font-condensed flex items-center gap-1 mt-0.5">
              <Building2 className="w-3 h-3" aria-hidden="true" />
              {msg.company}
            </p>
          )}
          {(msg.booking_number || msg.course_title) && (
            <div className="flex gap-1.5 mt-1.5 flex-wrap">
              {msg.booking_number && (
                bookingId ? (
                  <Link
                    href={`/admin/buchungen/${bookingId}`}
                    onClick={(e) => e.stopPropagation()}
                    className={`${TAG_CLASS} bg-wine-red/10 text-wine-red hover:bg-wine-red/20 transition-colors`}
                  >
                    <Ticket className="w-3 h-3" aria-hidden="true" />
                    {msg.booking_number}
                  </Link>
                ) : (
                  <span className={TAG_CLASS} title="Keine passende Buchung gefunden">
                    <Ticket className="w-3 h-3" aria-hidden="true" />
                    {msg.booking_number}
                  </span>
                )
              )}
              {msg.course_title && (
                <span className={TAG_CLASS}>
                  <GraduationCap className="w-3 h-3" aria-hidden="true" />
                  {msg.course_title}
                </span>
              )}
            </div>
          )}
        </td>
        <td className="px-4 py-4">
          {msg.category ? (
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-garnet-red/10 text-garnet-red whitespace-nowrap">
              {msg.category}
            </span>
          ) : (
            <span className="text-xs text-dark/25 font-condensed">—</span>
          )}
        </td>
        <td className="px-4 py-4 text-sm text-dark/70 font-condensed max-w-xs truncate">{msg.subject}</td>
        <td className="px-4 py-4 text-xs text-dark/40 font-condensed whitespace-nowrap">{formatDate(msg.created_at)}</td>
        <td className="px-4 py-4 text-right">
          {!read && (
            <button
              onClick={(e) => { e.stopPropagation(); markRead() }}
              disabled={isPending}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-dark/40 hover:text-wine-red transition-colors disabled:opacity-40"
            >
              <Check className="w-3.5 h-3.5" />
              Als gelesen markieren
            </button>
          )}
        </td>
      </tr>
      {expanded && (
        <tr className="border-b border-dark/5 bg-[#F8F5DA]">
          <td />
          <td colSpan={6} className="px-4 pb-6 pt-3">
            <p className="text-sm text-dark/70 font-condensed leading-relaxed whitespace-pre-wrap">{msg.message}</p>
          </td>
        </tr>
      )}
    </>
  )
}

export function NachrichtenClient({
  messages,
  role,
  bookingIdByNumber = {},
}: {
  messages: ContactMessage[]
  role: "admin" | "moderator"
  bookingIdByNumber?: Record<string, string>
}) {
  const unread = messages.filter((m) => !m.read).length

  return (
    <>
      <AdminBackButton role={role} />

      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-5xl font-bold text-wine-red tracking-tight mb-1">Nachrichten</h1>
          <p className="text-lg text-dark/50 font-condensed">
            Kontaktanfragen über das Website-Formular
            {unread > 0 && (
              <span className="ml-3 px-2.5 py-0.5 bg-wine-red text-white text-xs font-bold rounded-full">
                {unread} ungelesen
              </span>
            )}
          </p>
        </div>
      </header>

      {messages.length === 0 ? (
        <div className="py-24 text-center text-dark/30 font-condensed">
          Noch keine Nachrichten eingegangen.
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-dark/8 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-dark/8 bg-[#fdfadf]">
                <th className="px-6 py-4 w-8" />
                <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest text-dark/40">Status</th>
                <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest text-dark/40">Absender</th>
                <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest text-dark/40">Anliegen</th>
                <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest text-dark/40">Betreff</th>
                <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest text-dark/40">Datum</th>
                <th className="px-4 py-4" />
              </tr>
            </thead>
            <tbody>
              {messages.map((msg) => (
                <MessageRow
                  key={msg.id}
                  msg={msg}
                  bookingId={msg.booking_number ? bookingIdByNumber[msg.booking_number] : undefined}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
