"use client"

import { createClient } from "@/lib/supabase/client"

export function HeaderLogoutButton() {
  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = "/"
  }

  return (
    <button
      onClick={handleSignOut}
      className="text-light-beige/80 hover:text-light-beige text-sm font-bold tracking-tight transition-colors duration-200"
    >
      Abmelden
    </button>
  )
}
