import Image from "next/image"
import Link from "next/link"
import { CalendarDays, Clock, MapPin, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { courseImageSrc } from "@/lib/courseImages"

interface CourseCardProps {
  title: string
  date: string
  startTime: string
  endTime: string
  location: string
  price: number
  slug: string
  remainingCapacity: number | null
  photoUrl?: string | null
}

function CapacityBadge({ remaining }: { remaining: number }) {
  if (remaining === 0) {
    return (
      <span className="absolute top-4 right-4 bg-dark text-light-beige px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
        Ausgebucht
      </span>
    )
  }
  if (remaining > 5) return null
  return (
    <span
      className={cn(
        "absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white",
        remaining <= 2 ? "bg-wine-red" : "bg-gold-yellow"
      )}
    >
      {remaining === 1 ? "noch 1 Platz" : `noch ${remaining} Plätze`}
    </span>
  )
}


export function CourseCard({
  title,
  date,
  startTime,
  endTime,
  location,
  price,
  slug,
  remainingCapacity,
  photoUrl,
}: CourseCardProps) {
  const isSoldOut = remainingCapacity === 0

  return (
    <article className="bg-white rounded-xl overflow-hidden shadow-[0_8px_32px_-8px_rgba(126,20,35,0.1)] hover:-translate-y-2 transition-transform duration-300 flex flex-col">
      <div className="h-56 relative overflow-hidden">
        <Image
          src={courseImageSrc(slug, photoUrl)}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        {remainingCapacity !== null && (
          <CapacityBadge remaining={remainingCapacity} />
        )}
      </div>

      <div className="p-6 flex flex-col gap-4 flex-1">
        <h3 className="font-bold text-lg text-wine-red leading-snug">{title}</h3>

        <div className="flex flex-col gap-2 text-sm text-dark/60">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>
              {startTime} – {endTime} Uhr
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>{location}</span>
          </div>
        </div>

        <div className="mt-auto pt-4 flex items-center justify-between border-t border-dark/10">
          <span className="text-xl font-bold text-wine-red">
            {price.toLocaleString("de-DE")} €
          </span>
          {isSoldOut ? (
            <span className="text-dark/40 text-sm font-bold">Ausgebucht</span>
          ) : (
            <Link
              href={`/kurse/${slug}`}
              className="text-wine-red font-bold flex items-center gap-1 text-sm group"
            >
              Details{" "}
              <ChevronRight
                className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                aria-hidden="true"
              />
            </Link>
          )}
        </div>
      </div>
    </article>
  )
}
