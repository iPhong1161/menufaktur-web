"use server"

import { createServiceClient } from "@/lib/supabase/server"

export async function validateVoucherAction(
  code: string
): Promise<{ valid: true; value: number; id: string } | null> {
  const supabase = createServiceClient()

  const { data } = await supabase
    .from("vouchers")
    .select("id, remaining_value, status, expires_at")
    .eq("code", code.toUpperCase().trim())
    .eq("payment_status", "paid")
    .single()

  if (!data) return null
  if (data.status !== "active") return null
  if (data.expires_at && new Date(data.expires_at) < new Date()) return null

  return { valid: true, value: data.remaining_value, id: data.id }
}
