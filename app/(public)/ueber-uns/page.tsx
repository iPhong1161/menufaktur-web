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
                src="/images/ueber-uns-pasta.jpg"
                alt="Das menufaktur Team in der Küche"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 40vw"
              />
            </div>
          </div>

          {/* Right column */}
          <div className="md:col-span-7 pt-0 md:pt-12 space-y-8 text-dark/60 font-condensed text-lg leading-relaxed">
            <div className="space-y-4">
              <p className="text-xl font-bold text-wine-red/90 leading-snug font-sans">
                Weil Kochen vor allem Handwerk ist.
              </p>
              <p>
                Mit guten Zutaten, den richtigen Techniken und viel
                Aufmerksamkeit entstehen Speisen, die Genuss schaffen.
              </p>
            </div>

            <div className="space-y-4 border-t border-dark/8 pt-8">
              <h3 className="text-2xl font-bold text-wine-red font-sans">
                Unser Konzept
              </h3>
              <p>
                Wir haben über die Jahre ein einzigartiges Kochkurskonzept
                entwickelt:
              </p>
              <p>
                Bei uns erlebt jeder Gast das komplette Menü. Statt nur einen
                einzelnen Gang zuzubereiten, lernen Sie alle Schritte und
                Komponenten kennen – vom ersten Handgriff bis zum fertigen
                Gericht. So entsteht ein ganzheitliches Kocherlebnis, das
                inspiriert, Wissen vermittelt und vor allem Freude macht.
              </p>
            </div>
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
                    Ein wesentlicher Bestandteil unseres Erfolgs ist unser
                    eingespieltes Küchenteam. Viele unserer Köchinnen und
                    Köche begleiten uns bereits seit Jahren und bereichern
                    jedes Menü mit Erfahrung, Leidenschaft und Persönlichkeit
                    – spürbar in jedem Detail.
                  </p>
                  <div>
                    <p className="font-bold text-wine-red mb-1">
                      Ob Anfänger oder ambitionierter Hobbykoch:
                    </p>
                    <p>
                      In der menufaktur kochen wir auf Augenhöhe – unabhängig
                      von Erfahrung oder Vorkenntnissen. Willkommen ist jeder,
                      der Freude an gutem Essen und Genuss mitbringt.
                    </p>
                  </div>
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
                  src="/images/ueber-uns-teig.jpg"
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
              Unser Standort
            </h2>
            <div className="space-y-4 text-dark/60 font-condensed text-lg leading-relaxed">
              <p>
                Seit 2007 befinden sich unsere Kochschulen zentral in
                Frankfurt-Bornheim und sind über verschiedene Anfahrtswege
                bequem erreichbar. Weitere Informationen zur Anreise finden
                Sie unter „Kontakt".
              </p>
            </div>
            <address className="not-italic text-wine-red font-bold text-base leading-relaxed">
              Bornheimer Landwehr 46<br />
              60385 Frankfurt am Main
            </address>
          </div>
        </div>

        <div className="relative mt-16 aspect-[16/9] rounded-xl overflow-hidden shadow-xl">
          <Image
            src="/images/eingangsbereich.png"
            alt="Eingangsbereich der menufaktur Kochschule"
            fill
            className="object-cover"
            sizes="(max-width: 1280px) 100vw, 1280px"
          />
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
