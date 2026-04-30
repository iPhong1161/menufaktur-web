import { NextRequest, NextResponse } from "next/server"
import { createBooking } from "@/lib/supabase/queries/bookings"
import { createClient } from "@/lib/supabase/server"

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

  const inv: InvoiceBody = body.invoiceRecipient

  const result = await createBooking({
    booking: {
      course_id: body.course.id,
      user_id: user?.id ?? null,
      payment_method: "bank_transfer",
      total_amount: body.totalAmount,
      vat_amount: 0,
      voucher_discount: body.voucher?.discount ?? 0,
    },
    participants: body.participants.map((p: ParticipantBody, i: number) => ({
      first_name: p.firstName,
      last_name: p.lastName,
      email: p.email ?? "",
      phone: p.phone ?? null,
      food_preferences: p.foodPreferences ?? [],
      is_primary: i === 0,
    })),
    invoiceRecipient: {
      first_name: inv.firstName,
      last_name: inv.lastName,
      company_name: inv.companyName || null,
      address_line1: inv.addressLine1 || "",
      postal_code: inv.postalCode || "",
      city: inv.city || "",
      email: inv.email,
      is_business: inv.isBusiness ?? false,
      vat_id: inv.vatId || null,
    },
  })

  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 400 })
  }

  return NextResponse.json({ booking_number: result.booking_number, id: result.id })
}
