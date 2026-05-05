"use server"

import { revalidatePath } from "next/cache"
import { updateBookingPaymentStatus } from "@/lib/supabase/queries/admin-bookings"

export async function markBookingPaidAction(
  id: string
): Promise<{ error: string } | { success: true }> {
  const result = await updateBookingPaymentStatus(id)
  if ("error" in result) return { error: result.error }
  revalidatePath("/admin/buchungen")
  return { success: true }
}
