import { NextRequest, NextResponse } from "next/server"
import { createClient, createServiceClient } from "@/lib/supabase/server"

type ParticipantBody = {
  firstName: string
  lastName: string
  email?: string
  phone?: string
  foodPreferences?: string[]
}

type InvoiceBody = {
  firstName: string
  lastName: string
  companyName?: string | null
  addressLine1?: string
  postalCode?: string
  city?: string
  email: string
  isBusiness?: boolean
  vatId?: string | null
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Server-side capacity guard — prevents double-bookings under race conditions
  // Uses service client to see ALL participants regardless of user_id (bypasses RLS)
  const serviceSupabase = createServiceClient()
  const { data: course } = await serviceSupabase
    .from("courses")
    .select("capacity")
    .eq("id", body.course.id)
    .single()

  if (course) {
    const { data: activeBookings } = await serviceSupabase
      .from("bookings")
      .select("id")
      .eq("course_id", body.course.id)
      .in("status", ["pending", "confirmed"])

    const bookingIds = (activeBookings ?? []).map((b: { id: string }) => b.id)
    const { count: bookedCount } = bookingIds.length > 0
      ? await serviceSupabase
          .from("participants")
          .select("*", { count: "exact", head: true })
          .in("booking_id", bookingIds)
          .eq("cancelled", false)
      : { count: 0 }

    const remaining = course.capacity - (bookedCount ?? 0)
    if (remaining < body.participants.length) {
      return NextResponse.json(
        { error: "Leider sind nicht mehr genug Plätze verfügbar" },
        { status: 409 }
      )
    }
  }

  const totalAmount: number = body.totalAmount
  const vatAmount = Math.round((totalAmount - totalAmount / 1.19) * 100) / 100
  const inv: InvoiceBody = body.invoiceRecipient

  const { data, error } = await supabase.rpc("create_booking_atomic", {
    p_course_id:         body.course.id,
    p_user_id:           user?.id ?? null,
    p_payment_method:    "bank_transfer",
    p_total_amount:      totalAmount,
    p_vat_amount:        vatAmount,
    p_voucher_discount:  body.voucher?.discount ?? 0,
    p_voucher_id:        body.voucher?.id ?? null,
    p_participants:      body.participants.map((p: ParticipantBody, i: number) => ({
      first_name:       p.firstName,
      last_name:        p.lastName,
      email:            p.email ?? "",
      phone:            p.phone ?? "",
      food_preferences: p.foodPreferences ?? [],
      food_notes:       "",
      is_primary:       i === 0,
    })),
    p_invoice_recipient: {
      first_name:    inv.firstName,
      last_name:     inv.lastName,
      company_name:  inv.companyName ?? "",
      address_line1: inv.addressLine1 ?? "",
      postal_code:   inv.postalCode ?? "",
      city:          inv.city ?? "",
      country:       "Deutschland",
      email:         inv.email,
      vat_id:        inv.vatId ?? "",
      is_business:   inv.isBusiness ?? false,
    },
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  const result = data as { booking_number: string; id: string }
  return NextResponse.json({ booking_number: result.booking_number, id: result.id })
}
