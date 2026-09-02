import Image from "next/image"
import Link from "next/link"
import { CalendarDays, Clock, MapPin } from "lucide-react"
import { courseImageSrc } from "@/lib/courseImages"

export interface CatalogCourse {
  date: string        // ISO yyyy-mm-dd — used for chronological sorting
  id: string
  slug: string
  title: string
  dateFormatted: string
  startTime: string
  location: string
  price: number
  remainingCapacity: number
  photo_url?: string | null
}

function CapacityBadge({ remaining }: { remaining: number }) {
  if (remaining === 0) {
    return (
      <span className="bg-dark/10 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-dark/60">
        Ausgebucht
      </span>
    )
  }
  const isLow = remaining <= 2
  return (
    <span
      className={`bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold ${
        isLow ? "text-amber-800" : "text-emerald-800"
      }`}
    >
      {isLow
        ? remaining === 1
          ? "nur noch 1 Platz"
          : `nur noch ${remaining} Plätze`
        : `noch ${remaining} Plätze`}
    </span>
  )
}

export function CatalogCourseCard({
  slug,
  title,
  dateFormatted,
  startTime,
  location,
  price,
  remainingCapacity,
  photo_url,
}: CatalogCourse) {
  const soldOut = remainingCapacity === 0
  const detailHref = `/kurse/${slug}`

  return (
    <article className={`group flex flex-col${soldOut ? " opacity-70" : ""}`}>
      {/* Image — clickable */}
      <Link
        href={detailHref}
        aria-label={`Details zu ${title} ansehen`}
        className="relative overflow-hidden rounded-lg aspect-[4/3] mb-5 block transition-shadow duration-300 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wine-red/50"
      >
        <Image
          src={courseImageSrc(slug, photo_url)}
          alt={title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute top-4 left-4">
          <CapacityBadge remaining={remainingCapacity} />
        </div>
      </Link>

      {/* Title — clickable */}
      <Link
        href={detailHref}
        className={`text-lg font-bold mb-3 leading-snug transition-colors duration-200 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wine-red/50 ${
          soldOut
            ? "text-dark/60 hover:text-wine-red"
            : "text-dark group-hover:text-wine-red hover:text-wine-red"
        }`}
      >
        <h3>{title}</h3>
      </Link>

      <div className="flex items-center gap-4 text-sm text-dark/50 mb-2">
        <span className="flex items-center gap-1.5">
          <CalendarDays className="w-4 h-4 shrink-0" aria-hidden="true" />
          {dateFormatted}
        </span>
        <span className="flex items-center gap-1.5">
          <Clock className="w-4 h-4 shrink-0" aria-hidden="true" />
          {startTime} Uhr
        </span>
      </div>

      <p className="text-sm text-dark/50 mb-6 flex items-center gap-1.5">
        <MapPin className="w-4 h-4 shrink-0" aria-hidden="true" />
        {location}
      </p>

      {/* Price + CTA */}
      <div className="mt-auto flex items-center justify-between">
        <span className="text-lg font-bold text-wine-red">
          {price} €{" "}
          <span className="text-xs font-normal text-dark/40 uppercase tracking-wider">
            pro Person
          </span>
        </span>

        {soldOut ? (
          <button
            disabled
            className="bg-dark/10 text-dark/40 px-5 py-2 rounded-xl text-sm font-bold cursor-not-allowed"
          >
            Warteliste
          </button>
        ) : (
          <Link
            href={`/kurse/${slug}`}
            className="bg-wine-red hover:bg-garnet-red text-white px-5 py-2 rounded-xl text-sm font-bold transition-colors duration-200"
          >
            Details ansehen
          </Link>
        )}
      </div>
    </article>
  )
}
