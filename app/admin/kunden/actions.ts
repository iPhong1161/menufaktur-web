"use server"

import { createServiceClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function createAdminCustomer(data: {
  first_name: string
  last_name: string
  email: string
  password: string
  phone?: string
  address_line1?: string
  postal_code?: string
  city?: string
  preferred_payment_method?: string
}): Promise<{ success: true; email: string; password: string } | { error: string }> {
  const supabase = createServiceClient()

  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: data.email,
    password: data.password,
    email_confirm: true,
  })

  if (authError || !authData.user) {
    return { error: authError?.message ?? "Fehler beim Erstellen des Kontos." }
  }

  const userId = authData.user.id

  const { error: profileError } = await supabase.from("profiles").insert({
    id: userId,
    first_name: data.first_name,
    last_name: data.last_name,
    email: data.email,
    phone: data.phone || null,
    address_line1: data.address_line1 || null,
    postal_code: data.postal_code || null,
    city: data.city || null,
    preferred_payment_method:
      (data.preferred_payment_method as "card" | "sepa" | "bank_transfer") || null,
  })

  if (profileError) {
    await supabase.auth.admin.deleteUser(userId)
    return { error: "Profil konnte nicht angelegt werden: " + profileError.message }
  }

  revalidatePath("/admin/kunden")
  return { success: true, email: data.email, password: data.password }
}

export async function promoteToAdmin(
  userId: string
): Promise<{ success: true } | { error: string }> {
  const supabase = createServiceClient()

  const { error } = await supabase.from("admin_users").insert({ user_id: userId })

  if (error) return { error: error.message }

  revalidatePath("/admin/kunden")
  revalidatePath(`/admin/kunden/${userId}`)
  return { success: true }
}

export async function revokeAdmin(
  userId: string
): Promise<{ success: true } | { error: string }> {
  const supabase = createServiceClient()

  const { error } = await supabase.from("admin_users").delete().eq("user_id", userId)

  if (error) return { error: error.message }

  revalidatePath("/admin/kunden")
  revalidatePath(`/admin/kunden/${userId}`)
  return { success: true }
}

export async function sendPasswordReset(
  email: string
): Promise<{ success: true } | { error: string }> {
  const supabase = createServiceClient()

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteUrl}/konto/passwort-reset`,
  })

  if (error) return { error: error.message }
  return { success: true }
}

export async function deactivateCustomer(
  userId: string
): Promise<{ success: true } | { error: string }> {
  const supabase = createServiceClient()

  const { error } = await supabase.auth.admin.updateUserById(userId, {
    ban_duration: "87600h",
  })

  if (error) return { error: error.message }

  revalidatePath("/admin/kunden")
  revalidatePath(`/admin/kunden/${userId}`)
  return { success: true }
}
