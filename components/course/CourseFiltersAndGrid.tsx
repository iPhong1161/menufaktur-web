"use client"

import { useState, useMemo } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { CatalogCourseCard, type CatalogCourse } from "./CatalogCourseCard"

const COURSES_PER_PAGE = 6

const DIETARY_OPTIONS = [
  "Vegetarisch",
  "Vegan",
  "Glutenfrei",
  "Laktosefrei",
  "Nussallergie",
]

type SortOption = "date" | "price-asc" | "price-desc"

interface Props {
  courses: CatalogCourse[]
  activeDietary: string[]
}

export function CourseFiltersAndGrid({ courses, activeDietary }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [sort, setSort] = useState<SortOption>("date")
  const [page, setPage] = useState(1)

  function toggleDietary(option: string) {
    const current = new Set(activeDietary)
    if (current.has(option)) {
      current.delete(option)
    } else {
      current.add(option)
    }
    const params = new URLSearchParams(searchParams.toString())
    params.delete("dietary")
    current.forEach((d) => params.append("dietary", d))
    const qs = params.toString()
    router.push(qs ? `/kurse?${qs}` : "/kurse")
    setPage(1)
  }

  function clearFilters() {
    router.push("/kurse")
    setPage(1)
  }

  const sorted = useMemo(() => {
    const result = [...courses]
    result.sort((a, b) => {
      if (sort === "price-desc") return b.price - a.price
      if (sort === "price-asc") return a.price - b.price
      return a.dateFormatted.localeCompare(b.dateFormatted)
    })
    return result
  }, [courses, sort])

  const totalPages = Math.max(1, Math.ceil(sorted.length / COURSES_PER_PAGE))
  const safePage = Math.min(page, totalPages)
  const paginated = sorted.slice(
    (safePage - 1) * COURSES_PER_PAGE,
    safePage * COURSES_PER_PAGE
  )

  return (
    <>
      {/* Filter bar — sticky below fixed header */}
      <section className="sticky top-16 md:top-20 z-40 bg-[#F8F5DA]/95 backdrop-blur-md border-b border-dark/5">
        <div className="max-w-screen-xl mx-auto px-6 md:px-8 py-5 flex flex-wrap items-end gap-6">
          {/* Zeitraum */}
          <div className="flex-1 min-w-[160px]">
            <label className="block text-[0.7rem] font-bold uppercase tracking-widest text-dark/40 mb-2">
              Zeitraum
            </label>
            <input
              type="text"
              placeholder="Alle Termine"
              className="w-full bg-white/80 border border-dark/10 rounded-lg px-3 py-2.5 text-sm text-dark placeholder:text-dark/30 focus:outline-none focus:ring-2 focus:ring-wine-red/30"
            />
          </div>

          {/* Ernährung / Allergene */}
          <div className="flex-[2] min-w-[260px]">
            <label className="block text-[0.7rem] font-bold uppercase tracking-widest text-dark/40 mb-2">
              Ernährung / Allergene
            </label>
            <div className="flex flex-wrap gap-2">
              {DIETARY_OPTIONS.map((option) => {
                const active = activeDietary.includes(option)
                return (
                  <button
                    key={option}
                    onClick={() => toggleDietary(option)}
                    className={
                      active
                        ? "px-3 py-1.5 rounded-full text-xs font-semibold border-2 border-wine-red bg-wine-red text-white transition-colors"
                        : "px-3 py-1.5 rounded-full text-xs font-semibold border-2 border-[#7E1423]/40 bg-white/80 text-dark/60 hover:border-[#7E1423] hover:text-[#7E1423] transition-colors"
                    }
                  >
                    {option}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Sortieren nach */}
          <div className="flex-none min-w-[180px]">
            <label className="block text-[0.7rem] font-bold uppercase tracking-widest text-dark/40 mb-2">
              Sortieren nach
            </label>
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value as SortOption)
                setPage(1)
              }}
              className="w-full bg-white/80 border border-dark/10 rounded-lg px-3 py-2.5 text-sm text-dark focus:outline-none focus:ring-2 focus:ring-wine-red/30 appearance-none"
            >
              <option value="date">Datum aufsteigend</option>
              <option value="price-desc">Preis absteigend</option>
              <option value="price-asc">Preis aufsteigend</option>
            </select>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="max-w-screen-xl mx-auto px-6 md:px-8 pt-12 pb-4">
        {paginated.length === 0 ? (
          <div className="py-24 text-center text-dark/40">
            <p className="text-lg">Keine Kurse für diese Filter gefunden.</p>
            <button
              onClick={clearFilters}
              className="mt-4 text-wine-red font-bold text-sm underline"
            >
              Filter zurücksetzen
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {paginated.map((course) => (
              <CatalogCourseCard key={course.id} {...course} />
            ))}
          </div>
        )}
      </section>

      {/* Pagination */}
      {totalPages > 1 && (
        <section className="max-w-screen-xl mx-auto px-6 md:px-8 py-16 flex justify-center items-center gap-8">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={safePage === 1}
            aria-label="Vorherige Seite"
            className="flex items-center justify-center w-11 h-11 rounded-full bg-dark/8 text-dark/50 hover:bg-wine-red hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" aria-hidden="true" />
          </button>

          <span className="text-sm font-bold uppercase tracking-widest text-dark/50">
            Seite {safePage} von {totalPages}
          </span>

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={safePage === totalPages}
            aria-label="Nächste Seite"
            className="flex items-center justify-center w-11 h-11 rounded-full bg-dark/8 text-dark/50 hover:bg-wine-red hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5" aria-hidden="true" />
          </button>
        </section>
      )}
    </>
  )
}
