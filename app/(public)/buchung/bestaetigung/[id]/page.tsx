import type { Metadata } from "next"
import Link from "next/link"
import { CalendarDays, MapPin, Users, CheckCircle } from "lucide-react"
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder"
import { createClient } from "@/lib/supabase/server"
import { getBookingByNumber } from "@/lib/supabase/queries/bookings"

type CourseFields = {
  title: string
  date: string
  start_time: string
  end_time: string | null
  photo_url: string | null
}

type BookingDetails = {
  total_amount: number
  course: CourseFields
}

export const metadata: Metadata = {
  title: "Buchungsbestätigung — menufaktur",
}

type Props = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ count?: string }>
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("de-DE", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

function formatTime(timeStr: string) {
  return timeStr.slice(0, 5)
}

function formatPrice(amount: number) {
  return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(amount)
}

export default async function BookingConfirmationPage({ params, searchParams }: Props) {
  const { id } = await params
  const { count } = await searchParams

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const booking = await getBookingByNumber(id, user?.id ?? null) as BookingDetails | null

  if (!booking || !booking.course) {
    return (
      <div className="bg-light-beige min-h-screen pt-24 pb-24 px-4 flex items-center justify-center">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-wine-red mb-4">Buchung nicht gefunden</h1>
          <p className="text-dark/60 font-condensed mb-8">
            Diese Buchung existiert nicht oder ist nicht mehr verfügbar.
          </p>
          <Link
            href="/kurse"
            className="px-8 py-3 bg-wine-red text-white rounded-xl font-bold hover:bg-garnet-red transition-colors"
          >
            Zurück zu den Kursen
          </Link>
        </div>
      </div>
    )
  }

  const course = booking.course
  const participantCount = count ? parseInt(count, 10) : null

  return (
    <div className="bg-light-beige min-h-screen pt-24 pb-24 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Success header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="w-20 h-20 bg-wine-red rounded-full flex items-center justify-center mb-8 shadow-lg">
            <CheckCircle
              className="w-10 h-10 text-white fill-white"
              aria-hidden="true"
            />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-wine-red mb-4 leading-tight">
            Vielen Dank für Ihre Buchung!
          </h1>
          <p className="text-base font-bold text-garnet-red tracking-wide mb-6">
            Buchungsnummer: {id}
          </p>
          <p className="text-dark/60 leading-relaxed max-w-lg font-condensed text-lg">
            Wir haben Ihnen soeben eine Bestätigung an Ihre E-Mail-Adresse
            gesendet. Wir freuen uns darauf, Sie bald in unserem Atelier
            begrüßen zu dürfen.
          </p>
        </div>

        {/* Booking summary card */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-[0_8px_40px_-8px_rgba(126,20,35,0.1)] flex flex-col md:flex-row min-h-[360px] mb-14">
          {/* Image column */}
          <div className="md:w-[40%] relative overflow-hidden min-h-[220px]">
            {course.photo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={course.photo_url}
                alt={course.title}
                className="w-full h-full absolute inset-0 object-cover"
              />
            ) : (
              <ImagePlaceholder
                label="Course photo — uploaded via admin"
                className="w-full h-full absolute inset-0"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-wine-red/40 to-transparent" />
          </div>

          {/* Details column */}
          <div className="md:w-[60%] p-10 md:p-12 flex flex-col justify-center">
            <p className="text-[0.65rem] uppercase tracking-widest text-dark/40 font-bold mb-4">
              Ihre Buchungsdetails
            </p>
            <h2 className="text-2xl font-bold text-wine-red mb-8 leading-snug">
              {course.title}
            </h2>

            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <CalendarDays
                  className="w-5 h-5 shrink-0 text-wine-red mt-0.5"
                  aria-hidden="true"
                />
                <div>
                  <p className="text-xs text-dark/40 font-bold uppercase tracking-widest mb-0.5">
                    Datum &amp; Zeit
                  </p>
                  <p className="text-sm font-medium text-dark">
                    {formatDate(course.date)}, {formatTime(course.start_time)}
                    {course.end_time ? ` – ${formatTime(course.end_time)} Uhr` : " Uhr"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <MapPin
                  className="w-5 h-5 shrink-0 text-wine-red mt-0.5"
                  aria-hidden="true"
                />
                <div>
                  <p className="text-xs text-dark/40 font-bold uppercase tracking-widest mb-0.5">
                    Ort
                  </p>
                  <p className="text-sm font-medium text-dark">
                    menufaktur — Bornheimer Landwehr 46, 60385 Frankfurt am Main
                  </p>
                </div>
              </div>

              {participantCount !== null && (
                <div className="flex items-start gap-4">
                  <Users
                    className="w-5 h-5 shrink-0 text-wine-red mt-0.5"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="text-xs text-dark/40 font-bold uppercase tracking-widest mb-0.5">
                      Teilnehmer
                    </p>
                    <p className="text-sm font-medium text-dark">
                      {participantCount} {participantCount === 1 ? "Person" : "Personen"}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-10 pt-8 border-t border-dark/8 flex justify-between items-end">
              <div>
                <p className="text-xs text-dark/40 font-bold uppercase tracking-widest mb-1">
                  Gesamtbetrag
                </p>
                <p className="text-2xl font-bold text-wine-red">
                  {formatPrice(Number(booking.total_amount))}
                </p>
              </div>
              <p className="text-xs text-dark/40 italic">Inkl. gesetzl. MwSt.</p>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-20">
          <Link
            href="/kurse"
            className="w-full md:w-auto px-10 py-4 bg-wine-red hover:bg-garnet-red text-white rounded-xl font-bold text-base transition-colors duration-200 text-center"
          >
            Zurück zu den Kursen
          </Link>
          <Link
            href="/konto/buchungen"
            className="w-full md:w-auto px-10 py-4 border-2 border-wine-red text-wine-red hover:bg-wine-red/5 rounded-xl font-bold text-base transition-colors duration-200 text-center"
          >
            Zu meinen Buchungen
          </Link>
        </div>

        {/* Info section */}
        <div className="bg-[#F8F5DA] rounded-2xl p-10 md:p-14">
          <h3 className="text-xl font-bold text-wine-red mb-10 text-center">
            Wichtige Informationen vorab
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div>
              <h4 className="font-bold text-wine-red mb-2 text-sm">
                Parkmöglichkeiten
              </h4>
              <p className="text-sm text-dark/60 leading-relaxed font-condensed">
                Öffentliche Parkplätze sind in der Umgebung der Bornheimer Landwehr
                vorhanden. Alternativ ist das Atelier gut mit dem ÖPNV
                erreichbar (U4, Haltestelle Bornheim Mitte).
              </p>
            </div>
            <div>
              <h4 className="font-bold text-wine-red mb-2 text-sm">
                Kleidung
              </h4>
              <p className="text-sm text-dark/60 leading-relaxed font-condensed">
                Wir stellen Ihnen professionelle Kochschürzen für den Abend.
                Bitte tragen Sie bequeme Kleidung und festes, geschlossenes
                Schuhwerk.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-wine-red mb-2 text-sm">
                Stornierung
              </h4>
              <p className="text-sm text-dark/60 leading-relaxed font-condensed">
                Stornierungen sind bis 48 Stunden vor Kursbeginn möglich.
                Bitte kontaktieren Sie uns hierfür über das Kontaktformular
                mit Ihrer Buchungsnummer.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
