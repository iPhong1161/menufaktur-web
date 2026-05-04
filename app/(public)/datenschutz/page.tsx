import type { Metadata } from "next"
import { CheckCircle, FileText, Shield, Pencil, Trash2, Lock, MoveUp } from "lucide-react"

export const metadata: Metadata = {
  title: "Datenschutzerklärung — menufaktur",
}

export default function DatenschutzPage() {
  return (
    <div className="bg-light-beige min-h-screen">
      {/* Hero */}
      <section className="relative bg-garnet-red min-h-[300px] flex items-center overflow-hidden pt-20 pb-12">
        <div className="max-w-screen-xl mx-auto px-6 md:px-12 relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tighter mb-4 max-w-3xl leading-tight">
            Datenschutzerklärung
          </h1>
          <div className="h-1 w-24 bg-gold-yellow" />
        </div>
      </section>

      {/* Main content */}
      <main className="max-w-screen-xl mx-auto px-6 md:px-12 py-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 items-start">
          {/* Sidebar */}
          <aside className="hidden md:block md:col-span-3 sticky top-32">
            <nav className="space-y-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-wine-red/60 mb-6">
                Inhalt
              </p>
              <ul className="space-y-3 text-sm font-medium font-condensed">
                {[
                  ["#verantwortlicher", "1. Verantwortlicher"],
                  ["#rechtsgrundlagen", "2. Rechtsgrundlagen"],
                  ["#drittanbieter", "3. Drittanbieter & Tools"],
                  ["#betroffenenrechte", "4. Betroffenenrechte"],
                  ["#speicherdauer", "5. Speicherdauer"],
                ].map(([href, label]) => (
                  <li key={href}>
                    <a
                      href={href}
                      className="text-dark/50 hover:text-wine-red transition-colors"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          {/* Article */}
          <article className="md:col-span-9 space-y-16">
            {/* Intro */}
            <p className="text-xl text-dark/70 italic font-condensed leading-relaxed max-w-3xl">
              Der Schutz Ihrer persönlichen Daten ist uns ein besonderes Anliegen. Wir behandeln
              Ihre personenbezogenen Daten vertraulich und entsprechend der gesetzlichen
              Datenschutzvorschriften sowie dieser Datenschutzerklärung.
            </p>

            {/* Section 1 */}
            <section id="verantwortlicher" className="scroll-mt-32">
              <div className="p-10 bg-white rounded-xl border border-dark/8 shadow-sm">
                <h2 className="text-3xl font-bold text-wine-red mb-6">1. Verantwortlicher</h2>
                <div className="flex flex-col gap-3 text-lg">
                  <p className="font-bold text-dark">menufaktur GmbH Kochschule</p>
                  <p className="text-dark/60 font-condensed leading-relaxed">
                    Bornheimer Landwehr 46<br />
                    60385 Frankfurt am Main
                  </p>
                  <div className="mt-3 pt-4 border-t border-dark/8 space-y-2 text-sm font-condensed">
                    <p className="text-dark/60">
                      <span className="font-bold text-dark">E-Mail:</span>{" "}
                      datenschutz@menufaktur.de
                    </p>
                    <p className="text-dark/60">
                      <span className="font-bold text-dark">Telefon:</span>{" "}
                      069 / 977 63 666
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 2 */}
            <section id="rechtsgrundlagen" className="scroll-mt-32">
              <h2 className="text-3xl font-bold text-wine-red mb-6">
                2. Rechtsgrundlagen (DSGVO)
              </h2>
              <p className="mb-7 text-dark/60 font-condensed text-lg leading-relaxed">
                Die Verarbeitung Ihrer Daten erfolgt auf Grundlage der folgenden Bestimmungen
                der Datenschutz-Grundverordnung (DSGVO):
              </p>
              <div className="grid gap-4">
                {[
                  {
                    Icon: CheckCircle,
                    label: "Art. 6 Abs. 1 lit. a DSGVO",
                    text: "Ihre Einwilligung zur Verarbeitung für bestimmte Zwecke.",
                  },
                  {
                    Icon: FileText,
                    label: "Art. 6 Abs. 1 lit. b DSGVO",
                    text: "Erfüllung eines Vertrags oder vorvertraglicher Maßnahmen (z.B. Kursbuchung).",
                  },
                  {
                    Icon: Shield,
                    label: "Art. 6 Abs. 1 lit. f DSGVO",
                    text: "Wahrung unserer berechtigten Interessen (z.B. Analyse der Website-Nutzung).",
                  },
                ].map(({ Icon, label, text }) => (
                  <div
                    key={label}
                    className="p-6 bg-[#F8F5DA] rounded-xl border border-dark/5 flex gap-5"
                  >
                    <Icon className="w-6 h-6 text-wine-red shrink-0 mt-0.5" aria-hidden="true" />
                    <div>
                      <p className="font-bold text-dark mb-1 text-sm">{label}</p>
                      <p className="text-dark/60 font-condensed text-sm">{text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 3 */}
            <section id="drittanbieter" className="scroll-mt-32">
              <h2 className="text-3xl font-bold text-wine-red mb-5">
                3. Drittanbieter &amp; Tools
              </h2>
              <p className="text-dark/60 font-condensed mb-7 leading-relaxed">
                Zur Optimierung unserer Dienste nutzen wir ausgewählte Partner. Hierbei achten
                wir strikt auf die Einhaltung höchster Sicherheitsstandards.
              </p>
              <div className="space-y-4">
                {[
                  {
                    name: "Google Analytics",
                    desc: "Zur Analyse des Nutzerverhaltens und Verbesserung unserer Kursangebote.",
                  },
                  {
                    name: "Stripe Payments",
                    desc: "Sichere Abwicklung Ihrer Zahlungen für unsere Events und Kurse.",
                  },
                  {
                    name: "Supabase",
                    desc: "Speicherung und Verwaltung von Buchungsdaten in einer DSGVO-konformen Cloud-Datenbank (EU-Server).",
                  },
                ].map(({ name, desc }) => (
                  <div
                    key={name}
                    className="p-6 border border-dark/10 rounded-xl bg-white"
                  >
                    <h4 className="font-bold text-wine-red mb-2 text-sm">{name}</h4>
                    <p className="text-dark/60 font-condensed text-sm">{desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 4 */}
            <section id="betroffenenrechte" className="scroll-mt-32">
              <h2 className="text-3xl font-bold text-wine-red mb-6">
                4. Ihre Rechte als Betroffene(r)
              </h2>
              <p className="text-dark/60 font-condensed mb-8 text-lg leading-relaxed">
                Sie haben jederzeit das Recht auf unentgeltliche Auskunft über Ihre gespeicherten
                personenbezogenen Daten. Darüber hinaus stehen Ihnen folgende Rechte zu:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {[
                  { Icon: Pencil, title: "Berichtigung", desc: "Korrektur fehlerhafter Daten" },
                  { Icon: Trash2, title: "Löschung", desc: "„Recht auf Vergessenwerden“" },
                  { Icon: Lock, title: "Einschränkung", desc: "Sperrung der Verarbeitung" },
                  { Icon: MoveUp, title: "Datenübertragbarkeit", desc: "Mitnahme Ihrer Daten" },
                ].map(({ Icon, title, desc }) => (
                  <div
                    key={title}
                    className="p-7 bg-white rounded-xl border border-dark/8 shadow-sm flex items-start gap-4"
                  >
                    <Icon className="w-6 h-6 text-wine-red shrink-0 mt-0.5" aria-hidden="true" />
                    <div>
                      <p className="font-bold text-dark text-sm">{title}</p>
                      <p className="text-xs text-dark/50 font-condensed mt-0.5">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 5 */}
            <section id="speicherdauer" className="scroll-mt-32">
              <h2 className="text-3xl font-bold text-wine-red mb-5">5. Speicherdauer</h2>
              <div className="bg-wine-red/5 p-8 rounded-xl border-l-4 border-wine-red">
                <p className="text-base italic text-dark/60 font-condensed leading-relaxed">
                  Wir speichern Ihre Daten nur so lange, wie es für den jeweiligen
                  Verarbeitungszweck erforderlich ist oder gesetzliche Aufbewahrungsfristen
                  (insbesondere nach Handels- und Steuerrecht) eine längere Speicherung
                  vorschreiben. Nach Wegfall des Zwecks bzw. Ablauf der Fristen werden die
                  Daten routinemäßig gelöscht.
                </p>
              </div>
            </section>

            {/* Contact CTA */}
            <div className="pt-8 border-t border-dark/8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-10 bg-[#ECE9CF] rounded-2xl">
                <div>
                  <h4 className="text-2xl font-bold text-wine-red mb-1">
                    Haben Sie Datenschutz-Fragen?
                  </h4>
                  <p className="text-dark/60 font-condensed text-sm">
                    Kontaktieren Sie direkt unseren Datenschutzbeauftragten.
                  </p>
                </div>
                <a
                  href="mailto:datenschutz@menufaktur.de"
                  className="px-8 py-4 bg-wine-red hover:bg-garnet-red text-white rounded-xl font-bold transition-colors shrink-0 text-sm"
                >
                  Anfrage senden
                </a>
              </div>
            </div>
          </article>
        </div>
      </main>
    </div>
  )
}
