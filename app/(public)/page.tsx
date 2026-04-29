import Link from "next/link"
import { ChefHat, Award, Users, ChevronRight } from "lucide-react"
import { CourseCard } from "@/components/course/CourseCard"
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder"
import { getCourses } from "@/lib/supabase/queries/courses"

const GERMAN_MONTHS = [
  "Januar", "Februar", "März", "April", "Mai", "Juni",
  "Juli", "August", "September", "Oktober", "November", "Dezember",
]

function formatDate(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number)
  return `${day}. ${GERMAN_MONTHS[month - 1]} ${year}`
}

const FEATURES = [
  {
    icon: ChefHat,
    title: "Vollständige Menüs selbst kochen",
    text: "Vom Amuse-Bouche bis zum Dessert – Sie erlernen die Koordination ganzer Menüfolgen unter professioneller Anleitung.",
  },
  {
    icon: Award,
    title: "Seit 2007 in Frankfurt",
    text: "Unsere Wurzeln liegen im Herzen von Bornheim. Über ein Jahrzehnt Erfahrung bürgt für höchste kulinarische Qualität.",
  },
  {
    icon: Users,
    title: "Privat & Firmenevents",
    text: "Ob Teambuilding oder Familienfeier – wir schaffen den perfekten Rahmen für Ihre exklusiven kulinarischen Erlebnisse.",
  },
]

export default async function HomePage() {
  const allCourses = await getCourses()
  const featuredCourses = allCourses.slice(0, 3)
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#5b0011] via-wine-red to-garnet-red">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(255,252,225,0.3),transparent)]" />
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <h1 className="text-light-beige font-bold text-5xl md:text-7xl leading-tight mb-6">
            Kochen als Handwerk.
            <br />
            Essen als Verbindung.
          </h1>
          <p className="text-light-beige/80 text-xl md:text-2xl mb-10 font-condensed">
            Seit 2007 in Frankfurt-Bornheim.
          </p>
          <Link
            href="/kurse"
            className="inline-block bg-gold-yellow text-white px-10 py-4 rounded-xl text-lg font-bold hover:opacity-90 transition-opacity shadow-xl"
          >
            Kurse ansehen
          </Link>
        </div>
      </section>

      {/* Intro */}
      <section className="py-24 md:py-32 px-6 md:px-12 bg-light-beige">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-20 items-center">
          <div className="space-y-6">
            <h2 className="font-bold text-4xl md:text-5xl text-wine-red leading-tight">
              Die Kunst der bewussten Zubereitung.
            </h2>
            <div className="space-y-5 text-dark/70 leading-relaxed font-condensed text-lg">
              <p>
                In der menufaktur verstehen wir Kochen nicht als bloße
                Notwendigkeit, sondern als eine Form des Dialogs – mit den
                Zutaten, der Tradition und Ihren Gästen. Seit über 15 Jahren
                begleiten wir Genießer dabei, ihre handwerklichen Fähigkeiten
                zu verfeinern.
              </p>
              <p>
                In unseren Kursen im Herzen von Frankfurt-Bornheim legen wir
                Wert auf Ruhe, Präzision und die Freude am gemeinsamen
                Entdecken. Wir laden Sie ein, den hektischen Alltag vor der Tür
                zu lassen und sich ganz dem Moment des Kreierens zu widmen.
              </p>
            </div>
            <Link
              href="/ueber-uns"
              className="inline-flex items-center gap-2 text-wine-red font-bold hover:text-garnet-red transition-colors group"
            >
              Mehr über uns{" "}
              <ChevronRight
                className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                aria-hidden="true"
              />
            </Link>
          </div>
          <div className="relative">
            <div className="aspect-[4/5] rounded-lg overflow-hidden shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500">
              <ImagePlaceholder label="about/atelier-interior.jpg" className="w-full h-full" />
            </div>
            <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-wine-red rounded-lg -z-10 opacity-5" />
          </div>
        </div>
      </section>

      {/* Featured courses */}
      <section className="py-20 md:py-24 px-6 md:px-12 bg-[#F8F5DA]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-12">
            <div>
              <h2 className="font-bold text-4xl text-wine-red">
                Kommende Kurse
              </h2>
              <p className="text-dark/60 mt-2 font-condensed">
                Finden Sie den passenden Termin für Ihre kulinarische Reise.
              </p>
            </div>
            <Link
              href="/kurse"
              className="text-wine-red font-bold border-b-2 border-wine-red/30 pb-1 hover:border-wine-red transition-colors self-start md:self-auto whitespace-nowrap"
            >
              Alle Kurse entdecken
            </Link>
          </div>

          {featuredCourses.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-dark/40 font-condensed">
                Neue Termine werden in Kürze bekannt gegeben.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  title={course.title}
                  date={formatDate(course.date)}
                  startTime={course.start_time.slice(0, 5)}
                  endTime={course.end_time.slice(0, 5)}
                  location={course.location}
                  price={Number(course.price_per_person)}
                  slug={course.slug}
                  remainingCapacity={course.remaining_capacity}
                  photoUrl={course.photo_url}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why menufaktur */}
      <section className="py-24 md:py-32 px-6 md:px-12 bg-light-beige">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 text-center">
          {FEATURES.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex flex-col items-center space-y-5">
              <div className="w-20 h-20 rounded-full bg-wine-red/8 flex items-center justify-center text-wine-red">
                <Icon className="w-8 h-8" aria-hidden="true" />
              </div>
              <h3 className="font-bold text-xl text-wine-red">{title}</h3>
              <p className="text-dark/60 leading-relaxed font-condensed px-4">
                {text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonial */}
      <section className="bg-wine-red py-20 md:py-24 px-6 md:px-12">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <svg
            className="w-12 h-12 text-light-beige/20 mx-auto"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
          </svg>
          <blockquote className="text-light-beige font-bold text-2xl md:text-4xl leading-relaxed italic">
            &bdquo;Ein Abend in der menufaktur ist wie ein Kurzurlaub für die Sinne.
            Wir haben nicht nur Techniken gelernt, sondern die echte
            Leidenschaft für gute Lebensmittel gespürt.&ldquo;
          </blockquote>
          <div className="space-y-1">
            <p className="text-light-beige font-bold text-lg">
              Dr. Matthias Weber
            </p>
            <p className="text-light-beige/60 uppercase tracking-widest text-xs">
              Privates Dinner Event
            </p>
          </div>
        </div>
      </section>

      {/* Voucher CTA */}
      <section className="py-20 px-6 md:px-12 bg-light-beige">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="font-bold text-3xl md:text-4xl text-wine-red">
            Verschenken Sie ein kulinarisches Erlebnis.
          </h2>
          <p className="text-dark/60 font-condensed text-lg leading-relaxed">
            Ein menufaktur-Gutschein ist das perfekte Geschenk – für
            Freunde, Familie oder Kollegen, die etwas Besonderes verdienen.
          </p>
          <Link
            href="/gutschein"
            className="inline-block bg-wine-red text-light-beige px-8 py-3 rounded-lg font-bold hover:bg-garnet-red transition-colors"
          >
            Gutschein kaufen
          </Link>
        </div>
      </section>
    </>
  )
}
