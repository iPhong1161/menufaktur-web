"use server"

import { revalidatePath } from "next/cache"
import { createServiceClient, getAdminUser } from "@/lib/supabase/server"

export async function updateMessageReadAction(
  id: string,
  read: boolean
): Promise<{ success: true } | { error: string }> {
  const adminUser = await getAdminUser()
  if (!adminUser) return { error: "Keine Berechtigung." }

  const supabase = createServiceClient()
  const { error } = await supabase
    .from("contact_messages")
    .update({ read })
    .eq("id", id)

  if (error) return { error: error.message }
  revalidatePath("/admin/nachrichten")
  return { success: true }
}
