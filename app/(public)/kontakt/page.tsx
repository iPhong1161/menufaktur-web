import type { Metadata } from "next"
import Image from "next/image"
import { MapPin, Phone, Mail, Train, ParkingSquare } from "lucide-react"
import { ContactForm } from "@/components/contact/ContactForm"
import { MapEmbed } from "@/components/ui/MapEmbed"
import { getUpcomingCourseTitles } from "@/lib/supabase/queries/courses"

export const metadata: Metadata = {
  title: "Kontakt — menufaktur",
  description:
    "Schreiben Sie uns oder besuchen Sie die menufaktur in Frankfurt-Bornheim. Bornheimer Landwehr 46, 60385 Frankfurt am Main. Tel: 069 / 977 63 666.",
}

export default async function KontaktPage({
  searchParams,
}: {
  searchParams: Promise<{
    anliegen?: string
    kurs?: string
    buchungsnummer?: string
    nachricht?: string
  }>
}) {
  const params = await searchParams
  const initialCategory = params.anliegen ?? ""
  const initialCourseTitle = params.kurs ?? ""
  const initialBookingNumber = params.buchungsnummer ?? ""
  const initialMessage = params.nachricht ?? ""
  const courseTitles = await getUpcomingCourseTitles()

  return (
    <div className="bg-light-beige min-h-screen">
      {/* Hero */}
      <section className="relative h-[640px] flex items-end overflow-hidden">
        <Image
          src="/images/kontakt-hero-new.png"
          alt="menufaktur Kontakt"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-wine-red/40 to-transparent" />
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
            <ContactForm
              courseTitles={courseTitles}
              initialCategory={initialCategory}
              initialCourseTitle={initialCourseTitle}
              initialBookingNumber={initialBookingNumber}
              initialMessage={initialMessage}
            />
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
                  <p className="text-lg text-dark/60 font-condensed">069 / 977 63 666</p>
                </div>
                <div className="flex items-center gap-4">
                  <Mail className="w-5 h-5 text-wine-red shrink-0" aria-hidden="true" />
                  <p className="text-lg text-dark/60 font-condensed">post@menufaktur.de</p>
                </div>
              </div>
            </div>

            {/* Büroöffnungszeiten */}
            <div className="pt-8 border-t border-dark/8">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-garnet-red mb-5">
                Büroöffnungszeiten
              </h3>
              <p className="text-base text-dark/60 font-condensed">
                Montag – Freitag <span className="font-medium text-dark/80">10:00 – 16:00 Uhr</span>
              </p>
            </div>

            {/* Anfahrt */}
            <div className="pt-8 border-t border-dark/8">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-garnet-red mb-5">
                Anfahrt &amp; Parken
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <Train className="w-5 h-5 text-wine-red mt-0.5 shrink-0" aria-hidden="true" />
                  <div className="text-base text-dark/60 font-condensed space-y-1.5">
                    <p>
                      U4 Haltestelle Bornheim Mitte oder Höhenstraße
                      (Fußweg ca. 7 Minuten)
                    </p>
                    <p>
                      U7 Haltestelle Parlamentsplatz (Fußweg ca. 9 Minuten)
                    </p>
                    <p>
                      Straßenbahn Linie 14 Haltestelle Freiligrathstraße
                      (Fußweg ca. 5 Minuten)
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <ParkingSquare className="w-5 h-5 text-wine-red mt-0.5 shrink-0" aria-hidden="true" />
                  <p className="text-base text-dark/60 font-condensed">
                    Parkhaus BH Bornheim (Fußweg ca. 5 Minuten)
                  </p>
                </div>
              </div>

              <div className="mt-6 relative rounded-xl overflow-hidden aspect-[4/3] shadow-md">
                <Image
                  src="/images/einfahrt-zur-kochschule.png"
                  alt="Einfahrt zur menufaktur Kochschule"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 40vw"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Map */}
      <section className="border-t border-dark/8">
        <MapEmbed className="w-full h-[400px]" />
      </section>
    </div>
  )
}
