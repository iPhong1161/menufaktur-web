"use client"

import { useState } from "react"
import { MapPin } from "lucide-react"

interface MapEmbedProps {
  className?: string
}

export function MapEmbed({ className = "" }: MapEmbedProps) {
  const [accepted, setAccepted] = useState(false)

  if (accepted) {
    return (
      <div className={`overflow-hidden ${className}`}>
        <iframe
          src="https://maps.google.com/maps?q=Bornheimer+Landwehr+46,+60385+Frankfurt+am+Main&output=embed"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="menufaktur auf Google Maps"
        />
      </div>
    )
  }

  return (
    <div className={`bg-[#ECE9CF] flex flex-col items-center justify-center gap-5 ${className}`}>
      <MapPin className="w-10 h-10 text-wine-red/40" aria-hidden="true" />
      <div className="text-center space-y-1.5 px-6">
        <p className="font-bold text-dark/50 text-sm">
          Bornheimer Landwehr 46, 60385 Frankfurt am Main
        </p>
        <p className="text-xs text-dark/30 font-condensed max-w-xs leading-relaxed">
          Durch Klick auf „Karte anzeigen" stimmen Sie der Übertragung von Daten an Google zu.
        </p>
      </div>
      <button
        onClick={() => setAccepted(true)}
        className="bg-wine-red hover:bg-garnet-red text-white px-6 py-3 rounded-xl font-bold text-sm transition-colors"
      >
        Karte anzeigen
      </button>
    </div>
  )
}
