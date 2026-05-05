import type { Metadata } from "next"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { notFound } from "next/navigation"
import { getCourseByIdAdmin, getCoursesAdmin } from "@/lib/supabase/queries/admin-courses"
import { KursForm } from "@/components/admin/KursForm"

export const metadata: Metadata = { title: "Kurs bearbeiten — menufaktur Admin" }

export default async function AdminKursBearbeitenPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [course, allCourses] = await Promise.all([
    getCourseByIdAdmin(id),
    getCoursesAdmin(),
  ])
  if (!course) notFound()

  const withBookedCount = {
    ...course,
    booked_count: allCourses.find((c) => c.id === id)?.booked_count ?? 0,
  }

  return (
    <main className="flex-grow pt-20 pb-24">
      <div className="max-w-screen-xl mx-auto px-8 pt-8">
        <nav className="flex items-center gap-2 mb-6 text-sm font-condensed text-dark/40">
          <Link href="/admin/kurse" className="hover:text-wine-red transition-colors">
            Kurse
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-dark/40 font-condensed truncate max-w-xs">{course.title}</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-wine-red font-bold">Bearbeiten</span>
        </nav>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-wine-red tracking-tight">Kurs bearbeiten</h1>
          <p className="text-dark/50 font-condensed mt-1">
            Änderungen werden sofort nach dem Speichern wirksam.
          </p>
        </div>

        <KursForm course={withBookedCount} />
      </div>
    </main>
  )
}
