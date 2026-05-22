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
              Events in der menufaktur
            </h2>
            <div className="space-y-5 text-lg text-dark/60 font-condensed leading-relaxed">
              <p>
                Sie suchen einen Ort, um Ereignisse wie Geburtstag, Hochzeit oder Taufe
                gebührend zu feiern? Dann sind Sie bei uns vielleicht richtig. Denn bei der
                Gestaltung der menufaktur haben wir nicht nur auf die Einrichtung der Küche,
                sondern auch auf die Architektur unserer Räumlichkeiten großen Wert gelegt.
                Wir hoffen, dass sie ebenso einladend wirkt wie unser kulinarisches Angebot.
              </p>
              <p>
                Sollten Sie für Ihre Veranstaltung also einen Raum mit Atmosphäre suchen,
                schauen Sie doch mal bei uns rein oder besuchen Sie unsere Galerie!
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
              </div>
              <div className="absolute -bottom-6 -right-6 bg-wine-red p-8 hidden lg:block rounded-xl shadow-xl">
                <p className="text-white font-bold text-2xl leading-tight">Bis zu 60 Gäste</p>
                <p className="text-white/70 text-sm mt-1">Raum für Ihre Feier</p>
              </div>
            </div>

            {/* Text */}
            <div className="flex flex-col justify-center space-y-5 text-dark/60 font-condensed text-lg leading-relaxed">
              <h2 className="text-4xl font-bold text-wine-red">Feiern in der menufaktur</h2>
              <p>
                Unser 155 m² großes Loft bietet Veranstaltungen mit bis zu 60 Gästen einen
                würdigen und angenehmen Rahmen. Der großzügige Raum ist von der zentral
                angeordneten Kücheninsel geprägt und lässt sich durch eine große Terrasse mit
                anschließendem Garten erweitern, die Ihnen bei Ihrer Feier selbstverständlich
                auch zur Verfügung steht.
              </p>
              <p>
                Sofern Ihr Anlass nicht ohnehin in der Küche stattfindet (wie etwa beim
                Gruppenkochen), erlaubt Ihnen die offene Anordnung, uns bei der frischen
                Zubereitung Ihres Menüs zuzusehen. Je nach Bedarf oder Art der Veranstaltung
                können Sie unseren Gastraum so gestalten, wie Sie es sich vorstellen. Eine
                Feuerstelle und eine Lounge runden das Angebot ab.
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
            <div className="md:w-1/2 space-y-5">
              <h2 className="text-4xl font-bold text-wine-red leading-tight">
                Die menufaktur besucht Sie auch zu Hause
              </h2>
              <p className="text-lg text-dark/60 font-condensed leading-relaxed">
                Sie planen eine Feier daheim und möchten mal nicht in der Küche stehen, sondern
                sich voll und ganz Ihren Gästen widmen? Die menufaktur kommt gern zu Ihnen nach
                Hause. Wir bereiten das Menü in Ihrer Küche vor und servieren es Ihnen
                anschließend. Auf Wunsch bringen wir Geschirr, Gläser, Besteck, Tischwäsche und
                Tischdekoration gegen Aufpreis mit.
              </p>
            </div>
            <div className="relative md:w-1/2 aspect-video rounded-xl overflow-hidden shadow-xl">
              <Image
                src="/images/private-events/catering-home.png"
                alt="menufaktur Catering bei Ihnen zu Hause"
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
                src="/images/private-events/private-cooking-class.png"
                alt="Privater Kochkurs in der menufaktur"
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
          <h2 className="text-4xl font-bold mb-8">Konditionen</h2>
          <div className="space-y-5 text-xl text-white/80 mb-12 leading-relaxed text-left font-condensed">
            <p>
              Sicher würden Sie gern an dieser Stelle zur Orientierung einen Preis lesen. Bitte
              haben Sie dafür Verständnis, dass es uns aufgrund der Fülle an Möglichkeiten
              schwer fällt, Ihnen einen solchen zu nennen.
            </p>
            <p>
              Jede Veranstaltung ist einzigartig, und so gibt es in der menufaktur kein
              standardisiertes Repertoire, auf das wir für die Vorbereitung Ihres Events
              zurückgreifen. Wir überlegen mit Ihnen gemeinsam, was Ihre Feier hier bei uns
              oder bei Ihnen daheim unvergesslich macht. Anschließend erstellen wir ein
              unverbindliches, individuelles Angebot, das an die Teilnehmerzahl gebunden ist.
            </p>
            <p>
              Haben Sie keine Scheu, uns zu kontaktieren. Wir freuen uns auf Ihre Anfragen.
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
