import type { Metadata } from "next"
import Image from "next/image"
import { Ticket, ShoppingBasket } from "lucide-react"
import { GutscheinAnfrageForm } from "@/components/voucher/GutscheinAnfrageForm"

export const metadata: Metadata = {
  title: "Gutscheine — menufaktur",
  description:
    "Verschenken Sie kulinarische Erlebnisse: Gutscheine für Kochkurse bei der menufaktur in Frankfurt-Bornheim.",
}

export default function GutscheinPage() {
  return (
    <div className="bg-light-beige min-h-screen">
      {/* Hero */}
      <section className="relative h-[560px] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/hero/gutscheine-hero.png"
            alt="menufaktur Gutscheine — kulinarische Erlebnisse verschenken"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-dark/60" />
        </div>
        <div className="max-w-screen-xl mx-auto px-6 md:px-12 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-white font-bold text-6xl md:text-8xl tracking-tight mb-4 leading-none">
              Gutscheine
            </h1>
            <div className="w-24 h-1 bg-white/30 rounded-full mb-6" />
            <p className="text-white/90 text-xl leading-relaxed max-w-xl font-condensed">
              Verschenken Sie kulinarische Erlebnisse und unvergessliche Momente
              in der menufaktur.
            </p>
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="py-24 max-w-screen-xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Left sidebar */}
          <div className="lg:col-span-4 space-y-10">
            <div className="relative aspect-[4/5] rounded-xl overflow-hidden shadow-2xl rotate-1">
              <Image
                src="/images/general/gutschein-preview.png"
                alt="menufaktur Gutschein"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 33vw"
              />
            </div>
            <div className="bg-[#F8F5DA] p-8 rounded-xl border-l-4 border-wine-red">
              <p className="text-wine-red italic text-lg leading-relaxed font-condensed">
                &bdquo;Ein Kochkurs ist mehr als nur ein Rezept — es ist die
                Leidenschaft für das Handwerk, die wir teilen möchten.&ldquo;
              </p>
            </div>
          </div>

          {/* Right content */}
          <div className="lg:col-span-8 space-y-16">
            {/* Redeem section */}
            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <Ticket
                  className="w-8 h-8 text-wine-red shrink-0"
                  aria-hidden="true"
                />
                <h2 className="text-wine-red font-bold text-3xl md:text-4xl tracking-tight">
                  Sie möchten einen Gutschein einlösen
                </h2>
              </div>
              <p className="text-dark/60 text-lg leading-relaxed font-condensed max-w-2xl">
                Um einen Gutschein einzulösen, melden Sie sich einfach zum
                gewünschten Kurs an und geben im Laufe der Kursanmeldung
                Ihren Gutscheincode in das entsprechende Feld ein.
              </p>
            </div>

            {/* Buy section */}
            <div className="bg-white p-10 md:p-14 rounded-xl shadow-sm border border-dark/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-[0.04] pointer-events-none">
                <Ticket className="w-32 h-32 text-wine-red" />
              </div>
              <div className="relative z-10 space-y-8">
                <div className="flex items-center gap-4">
                  <ShoppingBasket
                    className="w-8 h-8 text-wine-red shrink-0"
                    aria-hidden="true"
                  />
                  <h2 className="text-wine-red font-bold text-3xl md:text-4xl tracking-tight">
                    Gutschein bestellen
                  </h2>
                </div>
                <GutscheinAnfrageForm />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact teaser */}
      <section className="bg-wine-red py-20 overflow-hidden relative">
        <div className="max-w-screen-xl mx-auto px-6 md:px-12 flex flex-col items-center text-center space-y-5">
          <h3 className="text-white font-bold text-3xl md:text-5xl leading-tight">
            Haben Sie Fragen zu unseren Gutscheinen?
          </h3>
          <p className="text-white/70 text-lg max-w-xl font-condensed">
            Unser Team berät Sie gerne persönlich zu unseren Kursangeboten und
            Konditionen.
          </p>
          <a
            href="/kontakt"
            className="text-white font-bold border-b-2 border-white/40 hover:border-white transition-all pb-1 mt-2 text-base"
          >
            Kontaktieren Sie uns
          </a>
        </div>
      </section>
    </div>
  )
}
