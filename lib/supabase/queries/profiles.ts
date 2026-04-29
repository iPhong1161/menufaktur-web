import { createClient } from "@/lib/supabase/server"
import type { Database } from "@/types/database"

type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"]

export async function getProfile() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  return data ?? null
}

export async function upsertProfile(updates: ProfileUpdate) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Nicht angemeldet." }

  const { error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", user.id)

  if (error) return { error: error.message }
  return { success: true }
}
