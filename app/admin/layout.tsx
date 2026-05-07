import { headers } from "next/headers"
import { AdminHeader } from "@/components/admin/AdminHeader"
import { createClient } from "@/lib/supabase/server"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const hdrs = await headers()
  const pathname = hdrs.get("x-pathname") ?? ""

  // Login page renders bare — no header, no auth check needed.
  // Middleware already blocks unauthenticated and non-admin requests before
  // they reach any layout, so the only role of this check is to decide
  // whether to render the admin chrome (header + footer).
  if (pathname === "/admin/login") {
    return <>{children}</>
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // No session — render bare children. Middleware will redirect on the next
  // navigation; we avoid a double-check race condition by not re-querying
  // admin_users here (middleware is the sole authority for that check).
  if (!user) {
    return <>{children}</>
  }

  const role = (hdrs.get("x-admin-role") ?? "moderator") as "admin" | "moderator"

  return (
    <div className="bg-[#fdfadf] min-h-screen flex flex-col">
      <AdminHeader role={role} />
      {children}
      <footer className="py-6 border-t border-wine-red/5 text-center">
        <p className="text-[10px] text-dark/30 tracking-widest uppercase font-condensed">
          © 2026 menufaktur · Admin
        </p>
      </footer>
    </div>
  )
}
