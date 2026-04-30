import { AdminHeader } from "@/components/admin/AdminHeader"
import { createClient } from "@/lib/supabase/server"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Unauthenticated: render bare (middleware handles the /admin/login redirect;
  // this path is only hit by the login page itself)
  if (!user) {
    return <>{children}</>
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
