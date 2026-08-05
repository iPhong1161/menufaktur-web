"use client"

import { useState, useMemo } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { CatalogCourseCard, type CatalogCourse } from "./CatalogCourseCard"

const COURSES_PER_PAGE = 6

const GERMAN_MONTHS = [
  "Januar", "Februar", "März", "April", "Mai", "Juni",
  "Juli", "August", "September", "Oktober", "November", "Dezember",
]

function monthLabel(yearMonth: string): string {
  const [year, month] = yearMonth.split("-").map(Number)
  return `${GERMAN_MONTHS[month - 1]} ${year}`
}

// label → exact value stored in food_options column (lowercase)
const DIETARY_OPTIONS: { label: string; value: string }[] = [
  { label: "Laktosefrei", value: "lactosefrei" },
  { label: "Glutenfrei", value: "glutenfrei" },
]

interface Props {
  courses: CatalogCourse[]
  activeDietary: string[]
}

export function CourseFiltersAndGrid({ courses, activeDietary }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [selectedMonth, setSelectedMonth] = useState("")
  const [selectedTheme, setSelectedTheme] = useState("")
  const [page, setPage] = useState(1)

  const availableMonths = useMemo(() => {
    const months = new Set(courses.map((c) => c.date.slice(0, 7)))
    return Array.from(months).sort()
  }, [courses])

  const availableThemes = useMemo(() => {
    const titles = new Set(courses.map((c) => c.title))
    return Array.from(titles).sort((a, b) => a.localeCompare(b, "de"))
  }, [courses])

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
    setSelectedMonth("")
    setSelectedTheme("")
    setPage(1)
  }

  const filtered = useMemo(() => {
    const result = courses.filter(
      (c) =>
        (!selectedMonth || c.date.startsWith(selectedMonth)) &&
        (!selectedTheme || c.title === selectedTheme)
    )
    result.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    )
    return result
  }, [courses, selectedMonth, selectedTheme])

  const totalPages = Math.max(1, Math.ceil(filtered.length / COURSES_PER_PAGE))
  const safePage = Math.min(page, totalPages)
  const paginated = filtered.slice(
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
            <select
              value={selectedMonth}
              onChange={(e) => {
                setSelectedMonth(e.target.value)
                setPage(1)
              }}
              className="w-full bg-white/80 border border-dark/10 rounded-lg px-3 py-2.5 text-sm text-dark focus:outline-none focus:ring-2 focus:ring-wine-red/30 appearance-none"
            >
              <option value="">Alle Termine</option>
              {availableMonths.map((ym) => (
                <option key={ym} value={ym}>
                  {monthLabel(ym)}
                </option>
              ))}
            </select>
          </div>

          {/* Kochkursthema */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-[0.7rem] font-bold uppercase tracking-widest text-dark/40 mb-2">
              Kochkursthema
            </label>
            <select
              value={selectedTheme}
              onChange={(e) => {
                setSelectedTheme(e.target.value)
                setPage(1)
              }}
              className="w-full bg-white/80 border border-dark/10 rounded-lg px-3 py-2.5 text-sm text-dark focus:outline-none focus:ring-2 focus:ring-wine-red/30 appearance-none"
            >
              <option value="">Alle Kochkursthemen</option>
              {availableThemes.map((title) => (
                <option key={title} value={title}>
                  {title}
                </option>
              ))}
            </select>
          </div>

          {/* Ernährung / Allergene */}
          <div className="flex-[2] min-w-[220px]">
            <label className="block text-[0.7rem] font-bold uppercase tracking-widest text-dark/40 mb-2">
              Ernährung / Allergene
            </label>
            <div className="flex flex-wrap gap-2">
              {DIETARY_OPTIONS.map(({ label, value }) => {
                const active = activeDietary.includes(value)
                return (
                  <button
                    key={value}
                    onClick={() => toggleDietary(value)}
                    className={
                      active
                        ? "px-3 py-1.5 rounded-full text-xs font-semibold border-2 border-wine-red bg-wine-red text-white transition-colors"
                        : "px-3 py-1.5 rounded-full text-xs font-semibold border-2 border-[#7E1423]/40 bg-white/80 text-dark/60 hover:border-[#7E1423] hover:text-[#7E1423] transition-colors"
                    }
                  >
                    {label}
                  </button>
                )
              })}
            </div>
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
