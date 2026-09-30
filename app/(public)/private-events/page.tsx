import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Private Events — menufaktur",
  description:
    "Feiern Sie Geburtstage, Hochzeiten oder Firmenevents in unserem 155 m² Loft in Frankfurt-Bornheim — oder wir kommen zu Ihnen.",
}

export default function PrivateEventsPage() {
  return (
    <div className="bg-light-beige min-h-screen">
      {/* Hero */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/private-events-loft.jpg"
            alt="Private Events in der menufaktur"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-wine-red/40 to-wine-red/80" />
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <span className="text-white/80 tracking-[0.3em] uppercase text-sm mb-6 block font-bold">
            Exklusive Erlebnisse
          </span>
          <h1 className="text-white text-5xl md:text-7xl font-bold leading-tight mb-8">
            Private Events
          </h1>
          <div className="h-1 w-24 bg-gold-yellow mx-auto" />
        </div>
      </section>

      {/* Intro */}
      <section className="bg-light-beige py-24 max-w-screen-xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-7 space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold text-wine-red leading-[1.1]">
              Sie sind auf der Suche nach einem besonderen Ort für Ihre Feier
            </h2>
            <div className="space-y-5 text-lg text-dark/60 font-condensed leading-relaxed">
              <p>
                Ob Firmenevents, Produktpräsentationen, Geburtstagsfeiern,
                Hochzeiten, Taufen, Junggesellenabschiede oder private Feiern
                jeder Art: Bei uns wird jedes Event zu einem besonderen
                Erlebnis, das Genuss und Gemeinschaft verbindet.
              </p>
              <p>
                Bei der Gestaltung unserer Räumlichkeiten haben wir großen Wert
                auf ein stimmiges Zusammenspiel aus Architektur, Atmosphäre und
                Funktionalität gelegt. So entsteht ein Ambiente, das ebenso
                einladend ist wie unser kulinarisches Angebot. Wenn Sie einen
                Ort mit Charakter und Persönlichkeit suchen, laden wir Sie
                herzlich ein, uns kennenzulernen oder einen Blick in unsere
                Galerie zu werfen.
              </p>
            </div>
          </div>
          <div className="relative lg:col-span-5 aspect-[4/5] rounded-xl overflow-hidden shadow-2xl">
            <Image
              src="/images/private-events-gedeckt.jpg"
              alt="Das menufaktur Atelier — Raum für Events"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
          </div>
        </div>
      </section>

      {/* Feiern section */}
      <section className="bg-[#F8F5DA] py-24">
        <div className="max-w-screen-xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-stretch">
            {/* Image with floating badge */}
            <div className="relative">
              <div className="relative w-full min-h-[480px] rounded-xl overflow-hidden shadow-lg">
                <Image
                  src="/images/private-events-tisch.jpg"
                  alt="Feiern in der menufaktur"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                {/* Anchored to the image box itself, not the grid column — the
                    column stretches to the text's height, which drifted the badge
                    away from the image's bottom edge. */}
                <div className="absolute bottom-4 right-4 bg-wine-red p-5 lg:p-8 rounded-xl shadow-xl">
                  <p className="text-white font-bold text-xl lg:text-2xl leading-tight">Bis zu 60 Gäste</p>
                  <p className="text-white/70 text-sm mt-1">Raum für Ihre Feier</p>
                </div>
              </div>
            </div>

            {/* Text */}
            <div className="flex flex-col justify-center space-y-5 text-dark/60 font-condensed text-lg leading-relaxed">
              <h2 className="text-4xl font-bold text-wine-red">Zwei Räume für besondere Anlässe</h2>
              <div>
                <p className="font-bold text-wine-red mb-2">Die große Küche:</p>
                <p>
                  Unser 155 m² großes Loft bietet Platz für Veranstaltungen
                  mit bis zu 60 Gästen und schafft einen stilvollen Rahmen für
                  unvergessliche Momente. Der offene Raum wird durch eine
                  zentral platzierte Kücheninsel geprägt und kann durch einen
                  zweiten Küchenblock erweitert werden. Auch die Nutzung der
                  Terrasse mit Sitzmöglichkeiten im Grünen ist bei allen
                  Veranstaltungen inkludiert.
                </p>
              </div>
              <div>
                <p className="font-bold text-wine-red mb-2">Die kleine Küche:</p>
                <p>
                  In unserer kleinen Kochschule empfangen wir Gruppen mit bis
                  zu 16 Personen. Fühlen Sie sich in unseren Räumlichkeiten
                  wie zu Hause und erleben Sie das Kochen hautnah an unserem
                  zentralen Küchenblock.
                </p>
              </div>
              <p>
                Die offene Gestaltung unserer Küchen ermöglicht es Ihnen und
                Ihren Gästen, die Zubereitung der Speisen live mitzuerleben.
                Alternativ können die Räume flexibel an Ihre individuellen
                Wünsche und die Art Ihrer Veranstaltung angepasst werden.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Catering & private cooking */}
      <section className="bg-light-beige py-24">
        <div className="max-w-screen-xl mx-auto px-6 md:px-12 space-y-28">
          {/* Catering: text left, image right */}
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="md:w-1/2 space-y-5 text-lg text-dark/60 font-condensed leading-relaxed">
              <h2 className="text-4xl font-bold text-wine-red leading-tight">
                Die menufaktur besucht Sie auch zu Hause
              </h2>
              <p>
                Möchten Sie Ihre Feier zu Hause, im Garten oder am
                Arbeitsplatz entspannt genießen, ohne selbst kochen zu müssen?
                Dann kommt die menufaktur gerne zu Ihnen.
              </p>
              <p>
                Wir bereiten Ihr Menü frisch direkt in Ihrer Küche vor Ort zu
                und servieren es anschließend stilvoll und professionell. Auf
                Wunsch kümmern wir uns außerdem gegen Aufpreis um Geschirr,
                Gläser, Besteck sowie Tischwäsche und passende Dekoration.
              </p>
              <p>
                Alternativ gestalten wir Ihr Event auch als exklusiven
                Kochkurs, bei dem Sie und Ihre Gäste gemeinsam mit uns
                kochen, neue Techniken entdecken und kulinarische Erlebnisse
                aktiv mitgestalten können.
              </p>
            </div>
            <div className="relative md:w-1/2 aspect-video rounded-xl overflow-hidden shadow-xl">
              <Image
                src="/images/private-events-zuhause.png"
                alt="Die menufaktur besucht Sie zu Hause"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>

          {/* Private cooking: wide image left, narrow text right */}
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="relative md:w-2/3 aspect-video rounded-xl overflow-hidden shadow-xl">
              <Image
                src="/images/private-events-firmen.png"
                alt="Gruppen- und Firmenevents in der menufaktur"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 66vw"
              />
            </div>
            <div className="md:w-1/3 space-y-5">
              <h2 className="text-4xl font-bold text-wine-red leading-tight">
                Machen Sie Ihren eigenen Kochkurs
              </h2>
              <p className="text-lg text-dark/60 font-condensed leading-relaxed">
                Sie möchten mit Freunden, der Familie oder Kollegen einen besonderen Kochabend
                verbringen? Wie wäre es mit einem Geburtstag, bei dem die Gäste gemeinsam das
                Menü zubereiten? Egal ob in den Räumen der menufaktur oder bei Ihnen zu Hause,
                wir stehen Ihnen mit Rat und Tat zur Seite und sind auf Ihre Vorschläge gespannt.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Konditionen */}
      <section className="bg-wine-red text-white py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-5 pointer-events-none select-none flex items-center justify-center">
          <div className="text-[24rem] font-bold leading-none">M</div>
        </div>
        <div className="max-w-screen-md mx-auto px-6 md:px-12 text-center relative z-10">
          <h2 className="text-4xl font-bold mb-8">Individuelle Angebote</h2>
          <div className="space-y-5 text-xl text-white/80 mb-12 leading-relaxed text-left font-condensed">
            <p>
              Jede Veranstaltung ist einzigartig – daher verzichten wir
              bewusst auf standardisierte Preisangaben. Umfang, Ablauf und
              kulinarische Gestaltung werden individuell auf Ihre Wünsche
              abgestimmt.
            </p>
            <p>
              Gemeinsam entwickeln wir ein Konzept, das Ihre Feier zu einem
              besonderen Erlebnis macht. Auf dieser Basis erstellen wir Ihnen
              ein unverbindliches Angebot, das sich an der Teilnehmerzahl
              orientiert.
            </p>
            <p>
              Zögern Sie nicht, uns zu kontaktieren – wir beraten Sie gern
              persönlich.
            </p>
          </div>
          <Link
            href="/kontakt"
            className="inline-flex items-center gap-3 bg-gold-yellow hover:bg-amber-500 text-white px-12 py-5 rounded-full text-xl font-bold shadow-2xl transition-all hover:scale-105 active:scale-95"
          >
            Anfrage senden
            <ArrowRight className="w-5 h-5" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </div>
  )
}
