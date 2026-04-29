import { createClient } from "@/lib/supabase/server"
import type { Database } from "@/types/database"

type VoucherInsert = Database["public"]["Tables"]["vouchers"]["Insert"]

function generateVoucherCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
  let code = "MF-"
  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < 2; j++) {
      code += chars[Math.floor(Math.random() * chars.length)]
    }
    if (i === 0) code += "-"
  }
  code += "-"
  code += chars[Math.floor(Math.random() * chars.length)]
  return code  // e.g. MF-XJ-99-L
}

export async function createVoucherOrder(
  payload: Omit<VoucherInsert, "code" | "remaining_value" | "expires_at">
): Promise<{ id: string; code: string } | { error: string }> {
  const supabase = await createClient()

  // Generate unique code (retry on collision)
  let code = ""
  let attempts = 0
  while (attempts < 5) {
    const candidate = generateVoucherCode()
    const { data } = await supabase
      .from("vouchers")
      .select("id")
      .eq("code", candidate)
      .single()
    if (!data) { code = candidate; break }
    attempts++
  }
  if (!code) return { error: "Code-Generierung fehlgeschlagen." }

  // Expiry: 3 years from today
  const expires = new Date()
  expires.setFullYear(expires.getFullYear() + 3)
  const expires_at = expires.toISOString().split("T")[0]

  const { data, error } = await supabase
    .from("vouchers")
    .insert({
      ...payload,
      code,
      remaining_value: payload.value,
      expires_at,
    })
    .select("id, code")
    .single()

  if (error || !data) return { error: error?.message ?? "Fehler beim Erstellen." }
  return { id: data.id, code: data.code }
}

export async function getUserVouchers() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from("vouchers")
    .select("*")
    .eq("purchaser_email", user.email ?? "")
    .order("created_at", { ascending: false })

  if (error) return []
  return data ?? []
}

export async function validateVoucherCode(code: string) {
  const supabase = await createClient()

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
