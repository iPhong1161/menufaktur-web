"use client"

import { useState, useTransition } from "react"
import { Banknote } from "lucide-react"
import { markBookingPaidAction } from "@/app/admin/buchungen/actions"

interface Props {
  bookingId: string
}

export function MarkPaidButton({ bookingId }: Props) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  function handleClick() {
    startTransition(async () => {
      const result = await markBookingPaidAction(bookingId)
      if ("error" in result) {
        setError(result.error)
      } else {
        setDone(true)
        window.location.reload()
      }
    })
  }

  if (done) return null

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={isPending}
        className="px-6 py-3 bg-wine-red text-white font-bold rounded-xl hover:bg-garnet-red transition-colors flex items-center gap-2 text-sm disabled:opacity-60"
      >
        <Banknote className="w-4 h-4" />
        {isPending ? "Wird gespeichert…" : "Als bezahlt markieren"}
      </button>
      {error && <p className="mt-2 text-red-600 text-sm font-condensed">{error}</p>}
    </div>
  )
}
