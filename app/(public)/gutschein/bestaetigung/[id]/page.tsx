import type { Metadata } from "next"
import Link from "next/link"
import { CheckCircle, Ticket, Mail, Printer } from "lucide-react"

export const metadata: Metadata = {
  title: "Gutschein-Bestellung bestätigt — menufaktur",
}

type Props = { params: Promise<{ id: string }> }

export default async function VoucherConfirmationPage({ params }: Props) {
  const { id } = await params

  return (
    <div className="bg-light-beige min-h-screen pt-24 pb-24 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Success header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="w-20 h-20 bg-wine-red rounded-full flex items-center justify-center mb-8 shadow-lg">
            <CheckCircle
              className="w-10 h-10 text-white fill-white"
              aria-hidden="true"
            />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-wine-red mb-4 leading-tight">
            Vielen Dank für Ihre Bestellung!
          </h1>
          <p className="text-base font-bold text-garnet-red tracking-wide mb-6">
            Bestellnummer: {id}
          </p>
          <p className="text-dark/60 leading-relaxed max-w-lg font-condensed text-lg">
            Wir haben Ihnen soeben eine Bestätigung mit dem Gutschein-Download-Link
            an Ihre E-Mail-Adresse gesendet.
          </p>
        </div>

        {/* Summary card */}
        <div className="bg-white rounded-2xl shadow-[0_8px_40px_-8px_rgba(126,20,35,0.1)] overflow-hidden mb-12">
          {/* Card header */}
          <div className="bg-wine-red px-10 py-8">
            <div className="flex items-center gap-4">
              <Ticket className="w-8 h-8 text-white/80 shrink-0" aria-hidden="true" />
              <div>
                <p className="text-white/60 text-xs uppercase tracking-widest font-bold mb-1">
                  Ihre Bestellung
                </p>
                <h2 className="text-white text-xl font-bold leading-snug">
                  Gutschein — menufaktur Kochkurse
                </h2>
              </div>
            </div>
          </div>

          {/* Card body */}
          <div className="px-10 py-10 space-y-6">
            <div className="flex items-start gap-4">
              <Mail
                className="w-5 h-5 shrink-0 text-wine-red mt-0.5"
                aria-hidden="true"
              />
              <div>
                <p className="text-xs text-dark/40 font-bold uppercase tracking-widest mb-0.5">
                  Versand
                </p>
                <p className="text-sm font-medium text-dark">
                  Ihr Gutschein wurde an Ihre E-Mail-Adresse versandt. Den
                  Download-Link finden Sie in der Bestätigungsmail.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Printer
                className="w-5 h-5 shrink-0 text-wine-red mt-0.5"
                aria-hidden="true"
              />
              <div>
                <p className="text-xs text-dark/40 font-bold uppercase tracking-widest mb-0.5">
                  Ausdrucken
                </p>
                <p className="text-sm font-medium text-dark">
                  Sie können Ihren Gutschein jederzeit über den Link in der
                  E-Mail herunterladen und ausdrucken.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-dark/8">
              <p className="text-xs text-dark/40 font-bold uppercase tracking-widest mb-1">
                Einlösung
              </p>
              <p className="text-sm text-dark/60 font-condensed leading-relaxed">
                Der Gutschein kann bei jeder Kursanmeldung auf menufaktur.de
                im Schritt &bdquo;Übersicht &amp; Bestätigung&ldquo; eingelöst werden.
                Geben Sie dazu den aufgedruckten Code in das Gutschein-Feld ein.
              </p>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-16">
          <Link
            href="/kurse"
            className="w-full md:w-auto px-10 py-4 bg-wine-red hover:bg-garnet-red text-white rounded-xl font-bold text-base transition-colors duration-200 text-center"
          >
            Zu den Kursen
          </Link>
          <Link
            href="/konto/gutscheine"
            className="w-full md:w-auto px-10 py-4 border-2 border-wine-red text-wine-red hover:bg-wine-red/5 rounded-xl font-bold text-base transition-colors duration-200 text-center"
          >
            Meine Gutscheine
          </Link>
        </div>

        {/* Info section */}
        <div className="bg-[#F8F5DA] rounded-2xl p-10 md:p-12">
          <h3 className="text-xl font-bold text-wine-red mb-8 text-center">
            Wichtige Informationen zum Gutschein
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="font-bold text-wine-red mb-2 text-sm">Gültigkeit</h4>
              <p className="text-sm text-dark/60 leading-relaxed font-condensed">
                Gutscheine sind 3 Jahre ab Kaufdatum gültig. Das genaue
                Ablaufdatum finden Sie auf Ihrem Gutschein.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-wine-red mb-2 text-sm">Kombinierbarkeit</h4>
              <p className="text-sm text-dark/60 leading-relaxed font-condensed">
                Mehrere Gutscheine können bei einer Buchung kombiniert werden.
                Der Restbetrag kann per Kreditkarte oder Überweisung beglichen
                werden.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-wine-red mb-2 text-sm">Rückerstattung</h4>
              <p className="text-sm text-dark/60 leading-relaxed font-condensed">
                Nicht eingelöste Gutscheine können nicht in bar ausgezahlt
                werden. Bei Fragen wenden Sie sich bitte an unser Team.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
