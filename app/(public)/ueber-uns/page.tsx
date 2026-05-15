import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Über uns — menufaktur",
  description:
    "Wo Leidenschaft auf Handwerk trifft. Erfahren Sie mehr über die menufaktur in Frankfurt-Bornheim — seit 2007.",
}

export default function UeberUnsPage() {
  return (
    <div className="bg-light-beige min-h-screen">
      {/* Hero */}
      <section className="relative h-[720px] flex items-end overflow-hidden">
        <Image
          src="/images/about/atelier-interior.png"
          alt="Das menufaktur Atelier in Frankfurt-Bornheim"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="relative z-10 w-full max-w-screen-xl mx-auto px-6 md:px-12 pb-20">
          <h1 className="text-white text-6xl md:text-8xl font-bold tracking-tighter mb-4 leading-none">
            Über uns
          </h1>
          <p className="text-white/90 text-xl md:text-2xl max-w-2xl font-condensed leading-relaxed">
            Wo Leidenschaft auf Handwerk trifft. Willkommen in der menufaktur.
          </p>
        </div>
      </section>

      {/* Story section */}
      <section className="py-24 max-w-screen-xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 items-start">
          {/* Left column */}
          <div className="md:col-span-5">
            <h2 className="text-4xl md:text-5xl font-bold text-wine-red leading-tight mb-8">
              Wieso eigentlich menufaktur?
            </h2>
            <div className="relative aspect-[4/5] rounded-xl overflow-hidden">
              <Image
                src="/images/about/team-kitchen.png"
                alt="Das menufaktur Team in der Küche"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 40vw"
              />
            </div>
          </div>

          {/* Right column */}
          <div className="md:col-span-7 pt-0 md:pt-12 space-y-7 text-dark/60 font-condensed text-lg leading-relaxed">
            <p className="text-xl font-bold text-wine-red/90 leading-snug font-sans">
              Weil Kochen vor allem Handwerk ist. Ein Handwerk, das bei sorgsamer Auswahl
              der Grundprodukte, dem Wissen um die richtigen Techniken der Zubereitung
              und der gebotenen Aufmerksamkeit bei der Umsetzung Speisen zum Ergebnis hat,
              die ein Essen zu Genuss werden lassen.
            </p>
            <p>
              Unser Anliegen ist es, mit Ihnen gemeinsam das Kochen wieder in die eigenen
              Hände zu nehmen, zumindest für einen Abend. Sie werden feststellen, dass es
              einen großen Unterschied macht, wenn beispielsweise ein vermeintlich profanes
              Gericht wie Gnocchi mit Tomatensauce frisch auf den Tisch kommt und sich fortan
              schwer tun, es irgendwo zu bestellen, weil es Ihnen niemand mit derselben Hingabe
              kochen wird, wie Sie sich selbst.
            </p>
            <p>
              <span className="font-bold text-wine-red block mb-1">menufaktur – Konzept</span>
              Zudem sind viele Lebensmittel heute aus der Tüte erhältlich, viele Kochtechniken
              der Generation unserer Großmütter haben den Sprung in die nächste Generation nicht
              geschafft, ein Lebensmittelskandal jagt den anderen. Wir möchten Ihnen zeigen,
              dass es oftmals nicht aufwändig ist, Lebensmittel frisch zuzubereiten anstatt
              die Tüte aufzureißen und anzurühren.
            </p>
            <p>
              Wer ist noch in der Lage, Omas Sonntagsbraten mit Serviettenknödeln zu kochen?
              Wie erkenne und schmecke ich, ob ein Stück Fleisch oder Fisch guter Qualität
              entspringt? Wir helfen Ihnen, diese Fragen zu beantworten und Ihnen einen
              Leitfaden mitzugeben. Kehren Sie zum einen wieder auf die alten und bewährten
              Wege der Kochkunst zurück und lassen Sie sich zum anderen dabei auch von neuen
              Ideen inspirieren. Wir freuen uns darauf, mit Ihnen zu kochen.
            </p>
          </div>
        </div>
      </section>

      {/* Philosophy section */}
      <section className="bg-[#F8F5DA] py-24">
        <div className="max-w-screen-xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left: text card + divider */}
            <div className="space-y-10">
              <div className="bg-white p-10 md:p-12 rounded-xl shadow-sm">
                <h3 className="text-3xl font-bold text-wine-red mb-6">Unsere Philosophie</h3>
                <div className="space-y-5 text-dark/60 font-condensed text-lg leading-relaxed">
                  <p>
                    Wir glauben an die Entschleunigung. In einer hektischen Welt bietet das
                    gemeinsame Kochen einen Ankerpunkt. Es geht darum, sich Zeit zu nehmen –
                    für die Auswahl der Produkte, die Präzision des Schnitts und das gemeinsame
                    Genießen am gedeckten Tisch.
                  </p>
                  <p>
                    Ob Anfänger oder ambitionierter Hobbykoch: Wir begleiten Sie auf Ihrem
                    individuellen Weg zu neuen kulinarischen Horizonten. In entspannter Atmosphäre
                    lernen Sie, wie man Aromen balanciert und Texturen perfektioniert.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="h-px flex-1 bg-dark/10" />
                <span className="font-bold text-wine-red text-lg whitespace-nowrap">
                  Kulinarik erleben
                </span>
                <div className="h-px flex-1 bg-dark/10" />
              </div>
            </div>

            {/* Right: image + floating quote */}
            <div className="relative">
              <div className="relative rounded-xl overflow-hidden aspect-square">
                <Image
                  src="/images/about/hands-dough.png"
                  alt="Handwerk — Teig kneten in der menufaktur"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-wine-red p-8 rounded-xl text-white hidden md:block max-w-xs shadow-xl">
                <p className="font-bold text-base leading-snug mb-2">
                  &bdquo;Kochen ist die einzige Kunst, bei der man alle Sinne gleichzeitig
                  einsetzt.&ldquo;
                </p>
                <p className="text-sm text-white/70">— Unser Credo</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Location section */}
      <section className="py-24 max-w-screen-xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="relative aspect-[3/2] rounded-xl overflow-hidden shadow-xl">
            <Image
              src="/images/about/atelier-exterior.png"
              alt="Die menufaktur von außen — Bornheimer Landstraße, Frankfurt"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div className="space-y-5">
            <h2 className="text-3xl md:text-4xl font-bold text-wine-red leading-tight">
              Unser Standort in Frankfurt-Bornheim
            </h2>
            <div className="space-y-4 text-dark/60 font-condensed text-lg leading-relaxed">
              <p>
                Mitten im lebendigen Stadtteil Bornheim haben wir seit 2007 unser
                Zuhause. Das menufaktur-Atelier liegt im Herzen des Viertels und
                ist mit öffentlichen Verkehrsmitteln bequem erreichbar.
              </p>
              <p>
                Unser 155 m² großes Loft empfängt Sie mit einer einladenden
                Atmosphäre — von der professionellen Kücheninsel über die
                gemütliche Lounge bis hin zur Terrasse mit Garten.
              </p>
            </div>
            <address className="not-italic text-wine-red font-bold text-base leading-relaxed">
              Bornheimer Landwehr 46<br />
              60385 Frankfurt am Main
            </address>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-28 px-6 md:px-12 text-center max-w-4xl mx-auto">
        <span className="text-garnet-red font-bold tracking-[0.2em] uppercase text-sm block mb-6">
          Willkommen am Tisch
        </span>
        <h2 className="text-4xl md:text-6xl font-bold text-wine-red mb-10 leading-tight">
          Wir freuen uns darauf, mit Ihnen zu kochen.
        </h2>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Link
            href="/kurse"
            className="px-10 py-5 bg-wine-red hover:bg-garnet-red text-white rounded-xl font-bold text-lg transition-colors duration-200"
          >
            Kursangebot entdecken
          </Link>
          <Link
            href="/kontakt"
            className="px-10 py-5 bg-[#ECE9CF] hover:bg-[#E0DCBA] text-wine-red rounded-xl font-bold text-lg transition-colors duration-200"
          >
            Kontaktieren Sie uns
          </Link>
        </div>
      </section>
    </div>
  )
}
