import type { Metadata } from "next"
import { CalendarDays, Clock, FileText, History } from "lucide-react"
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder"

export const metadata: Metadata = {
  title: "Meine Buchungen — menufaktur",
}

const UPCOMING = [
  {
    id: "BU-2026-00031",
    title: "Handgemachte Pasta & Saucen",
    date: "14. November 2025",
    time: "18:00 – 22:00 Uhr",
    price: 218,
    participants: 2,
  },
]

const PAST = [
  {
    id: "BU-2024-00018",
    title: "Thai Street Food Klassiker",
    date: "2. September 2024",
    price: 189,
    participants: 1,
  },
]

export default function KontoBuchungenPage() {
  return (
    <div>
      <header className="mb-12">
        <h1 className="text-4xl font-bold text-wine-red tracking-tight mb-3">
          Meine Buchungen
        </h1>
        <p className="text-dark/50 font-condensed leading-relaxed max-w-2xl">
          Hier finden Sie eine Übersicht Ihrer reservierten Kocherlebnisse. Wir
          freuen uns darauf, Sie bald in unserer Küche begrüßen zu dürfen.
        </p>
      </header>

      <div className="space-y-16">
        {/* Upcoming */}
        <div>
          <h2 className="text-base font-bold text-wine-red mb-6 flex items-center gap-2">
            <span className="w-2 h-2 bg-wine-red rounded-full shrink-0" />
            Bevorstehende Kurse
          </h2>
          <div className="space-y-4">
            {UPCOMING.map((b) => (
              <div
                key={b.id}
                className="bg-white rounded-xl p-8 border border-dark/5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center">
                  <div className="w-full lg:w-40 h-40 rounded-lg overflow-hidden shrink-0">
                    <ImagePlaceholder
                      label="Course photo — uploaded via admin"
                      className="w-full h-full"
                    />
                  </div>
                  <div className="flex-grow">
                    <div className="flex flex-wrap justify-between items-start gap-3">
                      <div>
                        <h3 className="text-xl font-bold text-dark">{b.title}</h3>
                        <div className="flex flex-wrap items-center gap-4 mt-2 text-dark/50 font-condensed text-sm">
                          <span className="flex items-center gap-1.5">
                            <CalendarDays className="w-4 h-4" />
                            {b.date}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4" />
                            {b.time}
                          </span>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-wine-red/10 text-wine-red text-[10px] font-bold rounded-full uppercase tracking-wider">
                        Bezahlt
                      </span>
                    </div>
                    <div className="mt-6 pt-5 border-t border-dark/8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <span className="text-2xl font-bold text-wine-red">{b.price} €</span>
                      <div className="flex flex-wrap gap-6">
                        <a
                          href="#"
                          className="text-wine-red font-bold text-sm flex items-center gap-1.5 hover:underline underline-offset-4 font-condensed"
                        >
                          <FileText className="w-4 h-4" />
                          Rechnung herunterladen
                        </a>
                        <a
                          href="#"
                          className="text-wine-red font-bold text-sm hover:underline underline-offset-4 font-condensed"
                        >
                          Details ansehen
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Past */}
        <div>
          <h2 className="text-base font-bold text-dark/40 mb-6 flex items-center gap-2">
            <span className="w-2 h-2 bg-dark/20 rounded-full shrink-0" />
            Vergangene Kurse
          </h2>
          <div className="space-y-4">
            {PAST.map((b) => (
              <div
                key={b.id}
                className="bg-white rounded-xl p-8 border border-dark/5 opacity-80 hover:opacity-100 transition-opacity"
              >
                <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center">
                  <div className="w-full lg:w-40 h-40 rounded-lg overflow-hidden shrink-0 grayscale-[0.4]">
                    <ImagePlaceholder
                      label="Course photo — uploaded via admin"
                      className="w-full h-full"
                    />
                  </div>
                  <div className="flex-grow">
                    <div className="flex flex-wrap justify-between items-start gap-3">
                      <div>
                        <h3 className="text-xl font-bold text-dark/70">{b.title}</h3>
                        <div className="flex items-center gap-1.5 mt-2 text-dark/40 font-condensed text-sm">
                          <History className="w-4 h-4" />
                          {b.date}
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-dark/8 text-dark/40 text-[10px] font-bold rounded-full uppercase tracking-wider">
                        Bezahlt
                      </span>
                    </div>
                    <div className="mt-6 pt-5 border-t border-dark/8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <span className="text-2xl font-bold text-dark/40">{b.price} €</span>
                      <div className="flex flex-wrap gap-6">
                        <a
                          href="#"
                          className="text-dark/40 hover:text-wine-red font-bold text-sm flex items-center gap-1.5 transition-colors font-condensed"
                        >
                          <FileText className="w-4 h-4" />
                          Rechnung
                        </a>
                        <a
                          href="#"
                          className="text-dark/40 hover:text-wine-red font-bold text-sm transition-colors font-condensed"
                        >
                          Details
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
