import type { Metadata } from "next"
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
    dateFormatted: formatDate(c.date),
    startTime: c.start_time.slice(0, 5),
    location: c.location,
    price: Number(c.price_per_person),
    remainingCapacity: c.remaining_capacity,
    photo_url: c.photo_url,
  }
}

export default async function KursePage() {
  const rawCourses = await getCourses()
  const courses: CatalogCourse[] = rawCourses.map(toCatalogCourse)

  return (
    <div className="pt-16 md:pt-20 pb-20 bg-light-beige min-h-screen">
      <section className="max-w-screen-xl mx-auto px-6 md:px-8 py-16 md:py-20">
        <div className="max-w-2xl">
          <h1 className="text-5xl md:text-6xl font-bold text-wine-red leading-tight mb-5">
            Unsere Kurse
          </h1>
          <p className="text-lg text-dark/60 font-condensed leading-relaxed">
            Entdecken Sie die Vielfalt unserer Kochkurse in Frankfurt-Bornheim.
            Erleben Sie kulinarische Perfektion in einer Atmosphäre, die zum
            Verweilen und Genießen einlädt.
          </p>
        </div>
      </section>

      {courses.length === 0 ? (
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
        <CourseFiltersAndGrid courses={courses} />
      )}
    </div>
  )
}
