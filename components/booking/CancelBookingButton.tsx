"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AlertTriangle } from "lucide-react"

interface Props {
  bookingNumber: string
  courseTitle: string
  voucherNote: string
}

export function CancelBookingButton({ bookingNumber, courseTitle, voucherNote }: Props) {
  const [confirming, setConfirming] = useState(false)
  const router = useRouter()

  function handleConfirm() {
    const betreff = `Stornierung Buchung ${bookingNumber}`
    const nachricht =
      `Guten Tag,\n\nich möchte meine Buchung ${bookingNumber} für den Kurs „${courseTitle}" stornieren.\n\nBitte bestätigen Sie die Stornierung.\n\nMit freundlichen Grüßen`
    router.push(
      `/kontakt?betreff=${encodeURIComponent(betreff)}&nachricht=${encodeURIComponent(nachricht)}`
    )
  }

  if (confirming) {
    return (
      <div className="space-y-4">
        <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-lg">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800 leading-relaxed">
            Sie werden zur Kontaktseite weitergeleitet, um die Stornierung zu beantragen.{" "}
            <span className="font-bold">{voucherNote}</span>
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleConfirm}
            className="flex-1 bg-wine-red hover:bg-garnet-red text-white text-sm font-bold py-3 px-4 rounded-xl transition-colors"
          >
            Ja, stornieren
          </button>
          <button
            onClick={() => setConfirming(false)}
            className="flex-1 bg-dark/8 hover:bg-dark/12 text-dark text-sm font-bold py-3 px-4 rounded-xl transition-colors"
          >
            Abbrechen
          </button>
        </div>
      </div>
    )
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="w-full border-2 border-wine-red text-wine-red hover:bg-wine-red hover:text-white text-sm font-bold py-3 px-4 rounded-xl transition-colors"
    >
      Buchung stornieren
    </button>
  )
}
