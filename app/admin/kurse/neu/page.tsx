import type { Metadata } from "next"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { KursForm } from "@/components/admin/KursForm"

export const metadata: Metadata = { title: "Neuer Kurs — menufaktur Admin" }

export default async function AdminKursNeuPage() {
  const role = (await headers()).get("x-admin-role") ?? "moderator"
  if (role !== "admin") redirect("/admin/kurse")
  return (
    <main className="flex-grow pt-20 pb-24">
      <div className="max-w-screen-xl mx-auto px-8 pt-8">
        <nav className="flex items-center gap-2 mb-6 text-sm font-condensed text-dark/40">
          <Link href="/admin/kurse" className="hover:text-wine-red transition-colors">
            Kurse
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-wine-red font-bold">Neuer Kurs</span>
        </nav>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-wine-red tracking-tight">Neuer Kurs</h1>
          <p className="text-dark/50 font-condensed mt-1 max-w-2xl leading-relaxed">
            Gestalten Sie ein neues kulinarisches Erlebnis. Füllen Sie die Details sorgfältig
            aus, um Ihre Gäste zu inspirieren.
          </p>
        </div>

        <KursForm />
      </div>
    </main>
  )
}
