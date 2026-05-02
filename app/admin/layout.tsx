import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { AdminHeader } from "@/components/admin/AdminHeader"
import { createClient, createServiceClient } from "@/lib/supabase/server"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = (await headers()).get("x-pathname") ?? ""

  // The login page is intentionally unprotected — skip all auth checks to
  // avoid a redirect loop (middleware skips /admin/login; the layout must too)
  if (pathname === "/admin/login") {
    return <>{children}</>
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return <>{children}</>
  }

  // Verify this authenticated user is a designated admin
  const serviceClient = await createServiceClient()
  const { data: adminRecord } = await serviceClient
    .from("admin_users" as any)
    .select("id")
    .eq("user_id", user.id)
    .single()

  if (!adminRecord) {
    redirect("/admin/login?unauthorised=1")
  }

  return (
    <div className="bg-[#fdfadf] min-h-screen flex flex-col">
      <AdminHeader />
      {children}
      <footer className="py-6 border-t border-wine-red/5 text-center">
        <p className="text-[10px] text-dark/30 tracking-widest uppercase font-condensed">
          © 2026 menufaktur · Admin
        </p>
      </footer>
    </div>
  )
}
