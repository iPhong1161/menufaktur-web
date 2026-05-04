"use client"

import { LogOut } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export function AdminLogoutButton() {
  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    // Full page reload clears the cached layout tree so the admin chrome
    // doesn't remain visible on the login page after signing out.
    window.location.href = "/admin/login"
  }

  return (
    <button
      onClick={handleSignOut}
      className="flex items-center gap-1.5 text-sm text-dark/50 hover:text-wine-red transition-colors font-medium"
    >
      <LogOut className="w-4 h-4" />
      <span className="hidden xl:inline">Abmelden</span>
    </button>
  )
}
