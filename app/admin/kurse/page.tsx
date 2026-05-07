import type { Metadata } from "next"
import Link from "next/link"
import { Plus } from "lucide-react"
import { headers } from "next/headers"
import { AdminBackButton } from "@/components/admin/AdminBackButton"
import { getCoursesAdmin } from "@/lib/supabase/queries/admin-courses"
import { KurseClient } from "@/components/admin/KurseClient"

export const metadata: Metadata = { title: "Kurse — menufaktur Admin" }

export default async function AdminKursePage() {
  const courses = await getCoursesAdmin()
  const role = ((await headers()).get("x-admin-role") ?? "moderator") as "admin" | "moderator"

  return (
    <main className="flex-grow pt-28 pb-12 px-8 max-w-screen-xl mx-auto w-full">
      <AdminBackButton role={role} />
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-5xl font-bold text-wine-red tracking-tight mb-1">Kurse</h1>
          <p className="text-lg text-dark/50 font-condensed">Alle Kurse verwalten</p>
        </div>
        {role === "admin" && (
          <Link
            href="/admin/kurse/neu"
            className="inline-flex items-center gap-2 bg-wine-red text-white px-8 py-4 rounded-xl font-bold hover:bg-garnet-red transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Neuer Kurs
          </Link>
        )}
      </header>
      <KurseClient courses={courses} role={role} />
    </main>
  )
}
