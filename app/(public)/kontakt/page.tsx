import type { Metadata } from "next"
import { MapPin, Phone, Mail, Train, ParkingSquare } from "lucide-react"
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder"
import { ContactForm } from "@/components/contact/ContactForm"

export const metadata: Metadata = {
  title: "Kontakt — menufaktur",
  description:
    "Schreiben Sie uns oder besuchen Sie die menufaktur in Frankfurt-Bornheim. Bornheimer Landwehr 46, 60385 Frankfurt am Main.",
}

export default function KontaktPage() {
  return (
    <div className="bg-light-beige min-h-screen">
      {/* Hero */}
      <section className="relative h-[640px] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <ImagePlaceholder
            label="about/atelier-interior.jpg"
            className="w-full h-full"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-wine-red/40 to-transparent" />
        </div>
        <div className="relative w-full max-w-screen-xl mx-auto px-6 md:px-12 pb-20">
          <h1 className="text-white text-6xl md:text-8xl font-bold tracking-tighter mb-4 leading-none">
            Kontakt
          </h1>
          <p className="text-white/90 text-xl md:text-2xl max-w-2xl font-condensed leading-relaxed">
            Wir freuen uns auf Ihre Nachricht oder Ihren Besuch in Frankfurt-Bornheim.
          </p>
        </div>
      </section>

      {/* Content grid */}
      <section className="py-24 max-w-screen-xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 items-start">
          {/* Left: form */}
          <div className="md:col-span-7">
            <h2 className="text-4xl md:text-5xl font-bold text-wine-red leading-tight mb-8">
              Schreiben Sie uns
            </h2>
            <ContactForm />
          </div>

          {/* Right: info */}
          <div className="md:col-span-5 space-y-10">
            {/* Direktkontakt */}
            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-garnet-red mb-6">
                Direktkontakt
              </h3>
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <MapPin className="w-5 h-5 text-wine-red mt-1 shrink-0" aria-hidden="true" />
                  <p className="text-lg text-dark/60 font-condensed leading-relaxed">
                    Bornheimer Landwehr 46<br />
                    60385 Frankfurt am Main
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <Phone className="w-5 h-5 text-wine-red shrink-0" aria-hidden="true" />
                  <p className="text-lg text-dark/60 font-condensed">+49 69 977 63 666</p>
                </div>
                <div className="flex items-center gap-4">
                  <Mail className="w-5 h-5 text-wine-red shrink-0" aria-hidden="true" />
                  <p className="text-lg text-dark/60 font-condensed">post@menufaktur.de</p>
                </div>
              </div>
            </div>

            {/* Öffnungszeiten */}
            <div className="pt-8 border-t border-dark/8">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-garnet-red mb-5">
                Öffnungszeiten
              </h3>
              <div className="space-y-2 text-base text-dark/60 font-condensed">
                {[
                  ["Montag", "09:00 – 17:30"],
                  ["Dienstag", "09:00 – 17:30"],
                  ["Mittwoch", "09:00 – 17:30"],
                  ["Donnerstag", "09:00 – 17:30"],
                  ["Freitag", "09:00 – 17:30"],
                  ["Samstag", "Geschlossen"],
                  ["Sonntag", "Geschlossen"],
                ].map(([day, hours]) => (
                  <div key={day} className="flex justify-between">
                    <span>{day}</span>
                    <span className={hours === "Geschlossen" ? "text-dark/30" : "font-medium text-dark/80"}>
                      {hours}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Anfahrt */}
            <div className="pt-8 border-t border-dark/8">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-garnet-red mb-5">
                Anfahrt &amp; Parken
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <Train className="w-5 h-5 text-wine-red mt-0.5 shrink-0" aria-hidden="true" />
                  <p className="text-base text-dark/60 font-condensed">
                    U4 Höhenstraße oder Bornheim Mitte
                  </p>
                </div>
                <div className="flex items-start gap-4">
                  <ParkingSquare className="w-5 h-5 text-wine-red mt-0.5 shrink-0" aria-hidden="true" />
                  <p className="text-base text-dark/60 font-condensed">
                    Saalbau Bornheim oder Parkhaus Im Prüfling
                  </p>
                </div>
              </div>
            </div>

            {/* Atelier image */}
            <div className="pt-4 rounded-xl overflow-hidden aspect-video">
              <ImagePlaceholder
                label="about/atelier-exterior.jpg"
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Map placeholder */}
      <section className="w-full h-[400px] bg-[#ECE9CF] flex items-center justify-center border-t border-dark/8">
        <div className="text-center">
          <MapPin className="w-12 h-12 text-dark/20 mx-auto mb-3" aria-hidden="true" />
          <p className="text-xl font-bold text-dark/30">Google Maps</p>
          <p className="text-dark/20 text-sm font-condensed mt-1">
            Bornheimer Landwehr 46, 60385 Frankfurt am Main
          </p>
        </div>
      </section>
    </div>
  )
}
