import type { Metadata } from "next"
import Image from "next/image"
import { CourseFiltersAndGrid } from "@/components/course/CourseFiltersAndGrid"
import { getCourses } from "@/lib/supabase/queries/courses"
import type { CatalogCourse } from "@/components/course/CatalogCourseCard"

export const metadata: Metadata = {
  title: "Kurskatalog — menufaktur",
  description:
    "Entdecken Sie unsere Kochkurse in Frankfurt-Bornheim. Pasta, Steak, Sushi, Patisserie und mehr — seit 2007.",
}

const GERMAN_MONTHS = [
  "Januar", "Februar", "März", "April", "Mai", "Juni",
  "Juli", "August", "September", "Oktober", "November", "Dezember",
]

function formatDate(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number)
  return `${day}. ${GERMAN_MONTHS[month - 1]} ${year}`
}

function toCatalogCourse(c: Awaited<ReturnType<typeof getCourses>>[number]): CatalogCourse {
  return {
    id: c.id,
    slug: c.slug,
    title: c.title,
    date: c.date,
    dateFormatted: formatDate(c.date),
    startTime: c.start_time.slice(0, 5),
    location: c.location,
    price: Number(c.price_per_person),
    remainingCapacity: c.remaining_capacity,
    photo_url: c.photo_url,
  }
}

export default async function KursePage({
  searchParams,
}: {
  searchParams: Promise<{ dietary?: string | string[] }>
}) {
  const params = await searchParams
  const dietary = params.dietary
    ? Array.isArray(params.dietary)
      ? params.dietary
      : [params.dietary]
    : undefined

  const rawCourses = await getCourses(dietary)
  const courses: CatalogCourse[] = rawCourses.map(toCatalogCourse)

  return (
    <div className="pb-20 bg-light-beige min-h-screen">
      {/* Hero */}
      <section className="relative h-[480px] flex items-end overflow-hidden">
        <Image
          src="/images/hero/hero-kurse.png"
          alt="Kochkurse in Frankfurt-Bornheim — menufaktur"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-wine-red/70 via-wine-red/30 to-transparent" />
        <div className="relative z-10 w-full max-w-screen-xl mx-auto px-6 md:px-8 pb-16">
          <h1 className="text-white text-5xl md:text-6xl font-bold leading-tight mb-3">
            Unsere Kurse
          </h1>
          <p className="text-white/80 text-lg font-condensed max-w-2xl leading-relaxed">
            Entdecken Sie die Vielfalt unserer Kochkurse in Frankfurt-Bornheim.
            Erleben Sie kulinarische Perfektion in einer Atmosphäre, die zum
            Verweilen und Genießen einlädt.
          </p>
        </div>
      </section>

      <div className="pt-12" />

      {courses.length === 0 && !dietary?.length ? (
        <div className="max-w-screen-xl mx-auto px-6 md:px-8 py-20 text-center">
          <p className="text-2xl font-bold text-wine-red mb-3">
            Keine Kurse verfügbar
          </p>
          <p className="text-dark/50 font-condensed">
            Aktuell sind keine Kochkurse veröffentlicht. Schauen Sie bald wieder
            vorbei — neue Termine werden in Kürze bekannt gegeben.
          </p>
        </div>
      ) : (
        <CourseFiltersAndGrid courses={courses} activeDietary={dietary ?? []} />
      )}
    </div>
  )
}
