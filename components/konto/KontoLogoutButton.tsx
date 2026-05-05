"use client"

import { LogOut } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export function KontoLogoutButton() {
  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = "/"
  }

  return (
    <button
      onClick={handleSignOut}
      className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-dark/60 hover:text-wine-red hover:bg-wine-red/5 rounded-xl transition-all w-full text-left"
    >
      <LogOut className="w-4 h-4 shrink-0" />
      Abmelden
    </button>
  )
}
