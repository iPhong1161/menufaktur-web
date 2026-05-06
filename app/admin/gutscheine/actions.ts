"use server"

import { revalidatePath } from "next/cache"
import { createServiceClient } from "@/lib/supabase/server"
import { generateVoucherCode } from "@/lib/supabase/queries/vouchers"

export interface CreateAdminVoucherResult {
  code: string
  value: number
  expires_at: string
}

export async function createAdminVoucherAction(payload: {
  value: number
  recipient_name: string
  recipient_email: string
  expires_at: string
  personal_message: string
}): Promise<CreateAdminVoucherResult | { error: string }> {
  const supabase = createServiceClient()

  // Generate unique code with retry on collision
  let code = ""
  for (let i = 0; i < 5; i++) {
    const candidate = generateVoucherCode()
    const { data } = await supabase
      .from("vouchers")
      .select("id")
      .eq("code", candidate)
      .single()
    if (!data) { code = candidate; break }
  }
  if (!code) return { error: "Code-Generierung fehlgeschlagen." }

  const { data, error } = await supabase
    .from("vouchers")
    .insert({
      code,
      value: payload.value,
      remaining_value: payload.value,
      status: "active",
      payment_status: "paid",
      expires_at: payload.expires_at,
      recipient_name: payload.recipient_name,
      recipient_email: payload.recipient_email || null,
      purchaser_name: "menufaktur Admin",
      purchaser_email: "",
      delivery_method: "email",
      personal_message: payload.personal_message || null,
      postal_fee: 0,
    })
    .select("code, value")
    .single()

  if (error || !data) return { error: error?.message ?? "Fehler beim Erstellen." }

  revalidatePath("/admin/gutscheine")
  return { code: data.code, value: data.value, expires_at: payload.expires_at }
}
