import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import {
  CalendarDays,
  MapPin,
  Users,
  UtensilsCrossed,
  Shirt,
  Wine,
  Star,
  ChevronLeft,
  AlertCircle,
} from "lucide-react"
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder"
import { BookingButton } from "@/components/booking/BookingButton"
import { getCourseBySlug, getCourses } from "@/lib/supabase/queries/courses"
import {
  COURSE_INCLUDES,
  FOOD_NOTE,
  COURSE_REVIEWS,
} from "@/lib/data/courses"
import type { CourseData } from "@/lib/data/courses"

const INCLUDE_ICONS = [UtensilsCrossed, Shirt, Wine]

const GERMAN_MONTHS = [
  "Januar", "Februar", "März", "April", "Mai", "Juni",
  "Juli", "August", "September", "Oktober", "November", "Dezember",
]

function formatDate(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number)
  return `${day}. ${GERMAN_MONTHS[month - 1]} ${year}`
}

function formatTime(t: string): string {
  return t.slice(0, 5)
}

function durationLabel(start: string, end: string): string {
  const [sh, sm] = start.split(":").map(Number)
  const [eh, em] = end.split(":").map(Number)
  const mins = eh * 60 + em - (sh * 60 + sm)
  const h = Math.floor(mins / 60)
  const m = mins % 60
  if (m === 0) return `${h} Std.`
  return `${h} Std. ${m} Min.`
}

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const course = await getCourseBySlug(slug)
  if (!course) return {}
  return {
    title: `${course.title} — menufaktur`,
    description: course.tagline ?? undefined,
  }
}

export default async function CourseDetailPage({ params }: Props) {
  const { slug } = await params
  const course = await getCourseBySlug(slug)
  if (!course) notFound()

  const allCourses = await getCourses()
  const related = allCourses.filter((c) => c.slug !== slug).slice(0, 3)

  const soldOut = course.remaining_capacity === 0
  const lowStock = course.remaining_capacity > 0 && course.remaining_capacity <= 3

  // Adapt to CourseData shape for BookingButton
  const courseData: CourseData = {
    id: course.id,
    slug: course.slug,
    title: course.title,
    category: course.category ?? "",
    tagline: course.tagline ?? "",
    description: course.description ? course.description.split(/\n\n|\n/).filter(Boolean) : [],
    dateFormatted: formatDate(course.date),
    startTime: formatTime(course.start_time),
    endTime: formatTime(course.end_time),
    durationLabel: durationLabel(course.start_time, course.end_time),
    location: course.location,
    address: course.address ?? "",
    price: Number(course.price_per_person),
    remainingCapacity: course.remaining_capacity,
    photo_url: course.photo_url,
  }

  return (
    <div className="bg-light-beige min-h-screen">
      {/* Hero */}
      <section className="relative h-[70vh] min-h-[480px] w-full overflow-hidden">
        {course.photo_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={course.photo_url}
            alt={course.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <ImagePlaceholder
            label="Course photo — uploaded via admin"
            className="w-full h-full"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        <Link
          href="/kurse"
          className="absolute top-8 left-6 md:left-12 flex items-center gap-2 text-white/80 hover:text-white text-sm font-bold transition-colors"
        >
          <ChevronLeft className="w-4 h-4" aria-hidden="true" />
          Alle Kurse
        </Link>

        <div className="absolute bottom-0 left-0 w-full px-6 md:px-12 pb-12">
          <div className="max-w-screen-xl mx-auto">
            {course.category && (
              <span className="inline-block bg-gold-yellow text-white px-4 py-1 rounded-full text-xs font-bold tracking-widest mb-5">
                {course.category}
              </span>
            )}
            <h1 className="text-white text-4xl md:text-6xl font-bold leading-tight max-w-3xl">
              {course.title}
            </h1>
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="max-w-screen-xl mx-auto px-6 md:px-12 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-12 lg:gap-16 items-start">
          {/* Left column */}
          <div className="lg:col-span-6 space-y-10">
            <div className="space-y-5">
              {course.tagline && (
                <p className="text-xl md:text-2xl font-bold text-wine-red italic leading-relaxed">
                  {course.tagline}
                </p>
              )}
              {courseData.description.length > 0 && (
                <div className="space-y-4 text-dark/70 leading-relaxed font-condensed text-lg">
                  {courseData.description.map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              )}
            </div>

            {/* What's included */}
            <div className="bg-[#F8F5DA] p-8 rounded-xl">
              <h2 className="text-xl font-bold text-wine-red mb-7">
                Was ist enthalten
              </h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {COURSE_INCLUDES.map((item, i) => {
                  const Icon = INCLUDE_ICONS[i]
                  return (
                    <li key={i} className="flex items-center gap-4">
                      <Icon
                        className="w-5 h-5 shrink-0 text-wine-red"
                        aria-hidden="true"
                      />
                      <span className="text-dark/80 text-sm">{item}</span>
                    </li>
                  )
                })}
              </ul>
            </div>

            <div className="border-l-4 border-wine-red pl-6 py-1">
              <p className="text-sm italic text-dark/60 leading-relaxed">
                {FOOD_NOTE}
              </p>
            </div>

          </div>

          {/* Right column — booking card */}
          <div className="lg:col-span-4">
            <div className="sticky top-28 bg-white rounded-xl shadow-[0_8px_40px_-8px_rgba(126,20,35,0.12)] p-8 space-y-7">
              <div className="flex items-end justify-between">
                <span className="text-xs font-bold uppercase tracking-widest text-dark/40">
                  Kurspreis
                </span>
                <span className="text-4xl font-bold text-wine-red leading-none">
                  {courseData.price} €{" "}
                  <span className="text-base font-normal text-dark/40">
                    / Pers.
                  </span>
                </span>
              </div>

              <div className="h-px bg-dark/8" />

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <CalendarDays
                    className="w-5 h-5 shrink-0 text-wine-red mt-0.5"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="font-bold text-dark text-sm">
                      {courseData.dateFormatted}
                    </p>
                    <p className="text-xs text-dark/50 mt-0.5">
                      {courseData.startTime} – {courseData.endTime} Uhr (
                      {courseData.durationLabel})
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <MapPin
                    className="w-5 h-5 shrink-0 text-wine-red mt-0.5"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="font-bold text-dark text-sm">
                      {course.location}
                    </p>
                    {course.address && (
                      <p className="text-xs text-dark/50 mt-0.5">
                        {course.address}
                      </p>
                    )}
                  </div>
                </div>

                {soldOut ? (
                  <div className="flex items-center gap-3 bg-dark/5 px-4 py-3 rounded-lg">
                    <Users
                      className="w-4 h-4 shrink-0 text-dark/40"
                      aria-hidden="true"
                    />
                    <span className="text-sm font-bold text-dark/50">
                      Ausgebucht
                    </span>
                  </div>
                ) : lowStock ? (
                  <div className="flex items-center gap-3 bg-amber-50 px-4 py-3 rounded-lg">
                    <AlertCircle
                      className="w-4 h-4 shrink-0 text-amber-700"
                      aria-hidden="true"
                    />
                    <span className="text-sm font-bold text-amber-700">
                      {course.remaining_capacity === 1
                        ? "Nur noch 1 Platz verfügbar"
                        : `Nur noch ${course.remaining_capacity} Plätze verfügbar`}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 bg-emerald-50 px-4 py-3 rounded-lg">
                    <Users
                      className="w-4 h-4 shrink-0 text-emerald-700"
                      aria-hidden="true"
                    />
                    <span className="text-sm font-bold text-emerald-700">
                      {course.remaining_capacity} Plätze verfügbar
                    </span>
                  </div>
                )}
              </div>

              {soldOut ? (
                <button
                  disabled
                  className="w-full py-4 bg-dark/10 text-dark/40 rounded-xl font-bold text-base cursor-not-allowed"
                >
                  Ausgebucht
                </button>
              ) : (
                <BookingButton course={courseData} />
              )}

              <p className="text-center text-xs text-dark/40 leading-relaxed">
                Sie erhalten sofort eine Bestätigung sowie alle weiteren
                Details per E-Mail.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="bg-wine-red py-20 md:py-24">
        <div className="max-w-screen-xl mx-auto px-6 md:px-12">
          <h2 className="text-3xl md:text-4xl font-bold text-light-beige mb-14 text-center">
            Stimmen unserer Gäste
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {COURSE_REVIEWS.map((review) => (
              <div
                key={review.author}
                className="bg-garnet-red/60 p-8 rounded-xl space-y-4"
              >
                <div className="flex gap-1">
                  {Array.from({ length: review.stars }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 text-gold-yellow fill-gold-yellow"
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <p className="italic text-light-beige/90 leading-relaxed">
                  &bdquo;{review.text}&ldquo;
                </p>
                <p className="text-xs font-bold uppercase tracking-widest text-light-beige/50">
                  {review.author}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related courses */}
      {related.length > 0 && (
        <section className="py-20 md:py-24">
          <div className="max-w-screen-xl mx-auto px-6 md:px-12">
            <h2 className="text-2xl md:text-3xl font-bold text-wine-red mb-12">
              Das könnte Sie auch interessieren
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {related.map((c) => (
                <Link
                  key={c.id}
                  href={`/kurse/${c.slug}`}
                  className="group block"
                >
                  <div className="relative h-52 mb-5 overflow-hidden rounded-xl">
                    {c.photo_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={c.photo_url}
                        alt={c.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <ImagePlaceholder
                        label="Course photo — uploaded via admin"
                        className="w-full h-full"
                      />
                    )}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-wine-red">
                      {Number(c.price_per_person)} €
                    </div>
                  </div>
                  <h3 className="font-bold text-dark group-hover:text-wine-red transition-colors duration-200 leading-snug mb-1">
                    {c.title}
                  </h3>
                  {c.tagline && (
                    <p className="text-sm text-dark/50">{c.tagline}</p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
