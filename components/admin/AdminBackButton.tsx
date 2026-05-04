import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export function AdminBackButton() {
  return (
    <Link
      href="/admin/dashboard"
      className="inline-flex items-center gap-1.5 text-sm text-dark/40 hover:text-wine-red transition-colors mb-8 font-medium"
    >
      <ArrowLeft className="w-4 h-4" />
      Zurück zum Dashboard
    </Link>
  )
}
