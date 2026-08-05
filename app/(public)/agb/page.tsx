import type { Metadata } from "next"
import Link from "next/link"
import {
  Receipt,
  UtensilsCrossed,
  XCircle,
  RefreshCw,
  Gift,
  Scale,
  Users,
  BookOpen,
  FileText,
} from "lucide-react"
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder"

export const metadata: Metadata = {
  title: "AGB — menufaktur",
}

const AGB_SECTIONS = [
  {
    Icon: Receipt,
    title: "1. Anmeldung",
    bg: "bg-white",
    paragraphs: [
      "Ihre Anmeldung erfolgt verbindlich über unser Online-Portal oder schriftlich. Nach Eingang Ihrer Buchung erhalten Sie eine Bestätigung per E-Mail.",
      "Die Kursgebühr ist unmittelbar nach Erhalt der Rechnung ohne Abzug fällig, um Ihren Platz fest zu reservieren.",
    ],
  },
  {
    Icon: UtensilsCrossed,
    title: "2. Kursumfang",
    bg: "bg-[#F8F5DA]",
    paragraphs: [
      "Die Kursgebühr umfasst bei den meisten Kochkursen die Zubereitung eines 4-gängigen Menüs, das anschließend gemeinsam verspeist wird, alle im Rahmen des Kochkurses verwendeten Lebensmittel und Getränke (Wein, Bier, Softdrinks, Espresso), den Rezepten des Kurses sowie die gesetzliche Mehrwertsteuer. Abweichungen sind bei den jeweiligen Kursbeschreibungen aufgeführt. Alle notwendigen Kochutensilien werden Ihnen gestellt, Ihre Kochschürze dürfen Sie mit nach Hause nehmen.",
    ],
  },
  {
    Icon: XCircle,
    title: "3. Stornierung",
    bg: "bg-[#ECE9CF]",
    paragraphs: [
      "Bei Stornierung einer Anmeldung zum Kochkurs von mehr als 7 Tage vor Kurstermin erhält der/die Teilnehmer*in einen Gutschein über den vollen gezahlten Betrag, der eine Gültigkeit von drei Jahren hat. Eine Barauszahlung oder Rücküberweisung ist ausgeschlossen. Ab 6 Tagen bis 72 Stunden vor Kursbeginn erhält der/die Teilnehmer*in einen Gutschein über 50% der Teilnahmegebühr. Bei weniger als 72 Stunden vor Kursbeginn ist keine Stornierung mehr möglich, jedoch kann immer eine andere Person als Teilnehmer*in einspringen. Die Stornierung eines Kochkurses muss schriftlich erfolgen. Ohne schriftliche Stornierung bzw. bei Nichterscheinen zu einem gebuchten Kurs, besteht kein Anspruch auf einen Gutschein oder Rückerstattung.",
    ],
  },
  {
    Icon: RefreshCw,
    title: "4. Umbuchung",
    bg: "bg-white",
    paragraphs: [
      "Eine Umbuchung auf einen anderen Termin ist bis 21 Tage vor dem ursprünglich gebuchten Kurs kostenfrei möglich.",
      "Danach gelten die Stornierungsbedingungen. Wir bitten um Verständnis, dass wir aufgrund der Warenplanung streng an diese Fristen gebunden sind.",
    ],
  },
  {
    Icon: Gift,
    title: "5. Gutscheine",
    bg: "bg-white",
    paragraphs: [
      "Gutscheine sind drei Jahre nach Ausstellungsdatum gültig und können zu jedem beliebigen, freien Kochkurstermin eingelöst werden. Ist der Wert des Gutscheines geringer als die Kochkursgebühr, so ist der Differenzbetrag zu begleichen. Im umgekehrten Fall stellen wir einen Gutschein über den Differenzbetrag aus. Eine Barauszahlung eines Kochkurs-Gutscheines oder des Differenzbetrages ist nicht möglich.",
    ],
  },
  {
    Icon: Scale,
    title: "6. Haftung",
    bg: "bg-[#F8F5DA]",
    paragraphs: [
      "Die Teilnahme an den Kursen erfolgt auf eigene Gefahr. Für Personen- oder Sachschäden haftet die menufaktur nur bei Vorsatz oder grober Fahrlässigkeit.",
      "Allergien und Unverträglichkeiten sind dem Kursleiter zwingend vor Beginn der Zubereitung mitzuteilen.",
    ],
  },
]

export default function AgbPage() {
  return (
    <div className="bg-light-beige min-h-screen flex flex-col">
      {/* Hero */}
      <section className="relative bg-garnet-red min-h-[300px] flex items-center overflow-hidden pt-20 pb-12">
        <div className="max-w-screen-xl mx-auto px-6 md:px-12 relative z-10">
          <h1 className="text-6xl md:text-8xl font-bold text-white tracking-tighter mb-4 uppercase">
            AGB
          </h1>
          <div className="h-1 w-24 bg-gold-yellow" />
        </div>
      </section>

      {/* Intro */}
      <main className="max-w-screen-lg mx-auto px-6 md:px-12 py-24 flex-grow">
        <div className="mb-14 max-w-3xl">
          <p className="text-dark/60 text-lg font-condensed leading-relaxed italic border-l-4 border-wine-red pl-6 py-2">
            Allgemeine Geschäftsbedingungen der Kids Event and Catering GmbH (menufaktur Kochschule). Hier finden Sie alle Details
            zu Buchungen, Stornierungen und Ihrer Teilnahme an unseren kulinarischen Erlebnissen.
          </p>
        </div>

        {/* 6 cards in 2-col grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {AGB_SECTIONS.map(({ Icon, title, bg, paragraphs }) => (
            <div key={title} className={`p-10 ${bg} rounded-xl border border-dark/8 shadow-sm`}>
              <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-wine-red/60 mb-5 flex items-center gap-2">
                <Icon className="w-4 h-4" aria-hidden="true" />
                {title}
              </h3>
              <div className="space-y-4 text-dark/60 font-condensed leading-relaxed text-sm">
                {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
              </div>
            </div>
          ))}

          {/* Wide card: Gruppen & Firmenevents */}
          <div className="md:col-span-2 p-10 bg-wine-red text-white rounded-xl flex flex-col md:flex-row gap-10 items-center">
            <div className="flex-1 space-y-5">
              <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/60 flex items-center gap-2">
                <Users className="w-4 h-4" aria-hidden="true" />
                7. Gruppen &amp; Firmenevents
              </h3>
              <p className="text-lg leading-relaxed font-condensed opacity-90">
                Für exklusive Gruppenbuchungen gelten gesonderte Konditionen. Die Preise richten
                sich nach dem gewählten Paket und der Teilnehmerzahl.
              </p>
              <p className="text-sm leading-relaxed font-condensed opacity-70">
                Stornierungen für Firmenevents sind bis 4 Wochen vor Termin kostenfrei möglich.
                Danach werden gestaffelte Ausfallgebühren (50 % bis 100 %) fällig. Die finale
                Teilnehmerzahl muss 7 Tage vor dem Event gemeldet werden.
              </p>
            </div>
            <div className="w-full md:w-1/3 aspect-[4/3] rounded-xl overflow-hidden shrink-0">
              <ImagePlaceholder
                label="private-events/team-cooking.jpg"
                className="w-full h-full"
              />
            </div>
          </div>

          {/* Wide card: Widerrufsrecht */}
          <div className="md:col-span-2 p-10 bg-white rounded-xl border border-dark/8 shadow-sm">
            <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-wine-red/60 mb-5 flex items-center gap-2">
              <FileText className="w-4 h-4" aria-hidden="true" />
              8. Widerrufsrecht
            </h3>
            <p className="text-dark/60 font-condensed leading-relaxed text-sm">
              Gemäß § 312g Abs. 2 Nr. 9 BGB besteht kein Widerrufsrecht für Verträge über die
              Erbringung von Dienstleistungen im Zusammenhang mit Freizeitbetätigungen, wenn der
              Vertrag für einen bestimmten Termin geschlossen wird. Da Kochkurse der
              Kids Event and Catering GmbH (menufaktur Kochschule) als termingebundene Freizeitveranstaltungen gelten, ist das gesetzliche
              Widerrufsrecht ausgeschlossen. Es gelten ausschließlich die Stornierungsbedingungen
              gemäß Ziffer 2 dieser AGB.
            </p>
          </div>

          {/* Wide card: Rechtliches */}
          <div className="md:col-span-2 p-10 bg-white rounded-xl border border-dark/8 shadow-sm">
            <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-wine-red/60 mb-5 flex items-center gap-2">
              <BookOpen className="w-4 h-4" aria-hidden="true" />
              9. Rechtliches
            </h3>
            <div className="grid md:grid-cols-2 gap-7 text-dark/60 font-condensed leading-relaxed text-sm">
              <p>
                Die ausgehändigten Rezepte sind urheberrechtlich geschützt und nur für den
                privaten Gebrauch bestimmt.
              </p>
              <p>
                Gerichtsstand für alle Streitigkeiten aus dem Vertragsverhältnis ist Frankfurt
                am Main. Es gilt das Recht der Bundesrepublik Deutschland.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Newsletter teaser */}
      <aside className="max-w-screen-lg mx-auto px-6 md:px-12 pb-24 w-full">
        <div className="relative overflow-hidden bg-[#ECE9CF] rounded-xl p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="relative z-10 max-w-xl">
            <h4 className="text-3xl font-bold text-wine-red mb-2">
              Kulinarische Post erhalten?
            </h4>
            <p className="text-dark/60 font-condensed">
              Melden Sie sich für unseren Newsletter an und erhalten Sie exklusive Rezepte
              und Kurstermine.
            </p>
          </div>
          <Link
            href="/kontakt"
            className="relative z-10 px-8 py-4 bg-wine-red hover:bg-garnet-red text-white rounded-xl font-bold transition-colors shrink-0"
          >
            Jetzt anmelden
          </Link>
        </div>
      </aside>
    </div>
  )
}
