"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { ExternalLink } from "lucide-react"
import { setParticipantCancelledAction } from "@/app/admin/kurse/actions"

interface FlatParticipant {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string | null
  food_preferences: string[]
  is_primary: boolean
  cancelled: boolean
  booking_number: string
  courseId: string
}

const FOOD_LABELS: Record<string, string> = {
  vegetarisch: "Vegetarisch",
  vegan: "Vegan",
  glutenfrei: "Glutenfrei",
  laktosefrei: "Laktosefrei",
  nussallergie: "Nussallergie",
}

function ParticipantRow({ p }: { p: FlatParticipant }) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [confirming, setConfirming] = useState(false)
  const [isCancelled, setIsCancelled] = useState(p.cancelled)

  function toggle() {
    setError(null)
    startTransition(async () => {
      const result = await setParticipantCancelledAction(p.id, !isCancelled, p.courseId)
      if ("error" in result) {
        setError(result.error)
      } else {
        setIsCancelled(!isCancelled)
      }
    })
  }

  const foods = p.food_preferences.filter((f) => f !== "keine")
  const initials = `${p.first_name[0] ?? ""}${p.last_name[0] ?? ""}`.toUpperCase()

  return (
    <tr className={`border-b border-dark/5 last:border-0 ${isCancelled ? "opacity-40" : "hover:bg-[#fdfadf]/60"}`}>
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-wine-red/10 flex items-center justify-center text-wine-red font-bold text-xs shrink-0">
            {initials}
          </div>
          <div>
            <p className={`font-bold text-dark ${isCancelled ? "line-through" : ""}`}>
              {p.first_name} {p.last_name}
              {p.is_primary && (
                <span className="ml-2 text-[10px] text-wine-red/60 font-bold uppercase tracking-widest">Kontakt</span>
              )}
            </p>
            <p className="text-xs text-dark/50 font-condensed">{p.email}</p>
            {p.phone && <p className="text-xs text-dark/40 font-condensed">{p.phone}</p>}
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        {foods.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {foods.map((f) => (
              <span key={f} className="text-[10px] font-bold uppercase tracking-wide bg-wine-red/8 text-wine-red px-2 py-0.5 rounded-full">
                {FOOD_LABELS[f] ?? f}
              </span>
            ))}
          </div>
        ) : (
          <span className="text-dark/20 text-xs">—</span>
        )}
      </td>
      <td className="px-6 py-4">
        <Link
          href={`/admin/buchungen/${p.booking_number}`}
          className="font-mono text-xs text-wine-red hover:underline underline-offset-2 inline-flex items-center gap-1"
        >
          {p.booking_number}
          <ExternalLink className="w-3 h-3 opacity-50" />
        </Link>
      </td>
      <td className="px-6 py-4 text-right">
        <div className="flex flex-col items-end gap-1">
          {isCancelled ? (
            <button
              onClick={toggle}
              disabled={isPending}
              className="text-[10px] font-bold uppercase tracking-wide px-3 py-1 rounded-full border border-green-300 text-green-700 hover:bg-green-50 transition-colors disabled:opacity-50"
            >
              {isPending ? "..." : "Wieder anmelden"}
            </button>
          ) : confirming ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => { setConfirming(false); toggle() }}
                disabled={isPending}
                className="text-[10px] font-bold uppercase tracking-wide px-3 py-1 rounded-full border border-wine-red bg-wine-red text-white hover:bg-garnet-red transition-colors disabled:opacity-50"
              >
                {isPending ? "..." : "Ja, abmelden"}
              </button>
              <button
                onClick={() => setConfirming(false)}
                disabled={isPending}
                className="text-[10px] font-bold uppercase tracking-wide px-3 py-1 rounded-full border border-dark/20 text-dark/40 hover:bg-dark/5 transition-colors disabled:opacity-50"
              >
                Abbrechen
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirming(true)}
              className="text-[10px] font-bold uppercase tracking-wide px-3 py-1 rounded-full border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
            >
              Abmelden
            </button>
          )}
          {error && <p className="text-[10px] text-red-500">{error}</p>}
        </div>
      </td>
    </tr>
  )
}

export default function ParticipantListAdmin({ participants }: { participants: FlatParticipant[] }) {
  if (participants.length === 0) {
    return (
      <div className="py-16 text-center text-dark/40 font-condensed">
        Keine Teilnehmer für diesen Kurs.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-dark/5 text-[10px] font-bold uppercase tracking-widest text-dark/40">
            <th className="px-6 py-3 text-left">Teilnehmer</th>
            <th className="px-6 py-3 text-left">Kostform</th>
            <th className="px-6 py-3 text-left">Buchungsnr.</th>
            <th className="px-6 py-3 text-right">Aktion</th>
          </tr>
        </thead>
        <tbody>
          {participants.map((p) => (
            <ParticipantRow key={p.id} p={p} />
          ))}
        </tbody>
      </table>
    </div>
  )
}
