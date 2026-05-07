import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export function AdminBackButton({ role = "admin" }: { role?: "admin" | "moderator" }) {
  const href = role === "moderator" ? "/admin/kurse" : "/admin/dashboard"
  const label = role === "moderator" ? "Zurück zur Übersicht" : "Zurück zum Dashboard"

  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 text-sm text-dark/40 hover:text-wine-red transition-colors mb-8 font-medium"
    >
      <ArrowLeft className="w-4 h-4" />
      {label}
    </Link>
  )
}
