import { NextRequest, NextResponse } from "next/server"
import { createClient, createServiceClient } from "@/lib/supabase/server"
import { resend } from "@/lib/resend/client"
import { buildBankTransferEmail, formatGermanDate } from "@/lib/email/templates"

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

  // Fetch course server-side — authoritative source for pricing and capacity
  const serviceSupabase = createServiceClient()
  const { data: course } = await serviceSupabase
    .from("courses")
    .select("capacity, price_per_person, title, date")
    .eq("id", body.course.id)
    .single()

  if (!course) return NextResponse.json({ error: "Kurs nicht gefunden." }, { status: 400 })

  // Validate participant count
  const participantCount: number = body.participants?.length ?? 0
  if (participantCount < 1)
    return NextResponse.json({ error: "Mindestens ein Teilnehmer erforderlich." }, { status: 400 })

  // Capacity guard — uses service client to bypass RLS and see all bookings
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
  if (remaining < participantCount) {
    return NextResponse.json(
      { error: "Leider sind nicht mehr genug Plätze verfügbar" },
      { status: 409 }
    )
  }

  // Server-side pricing — client-supplied totalAmount is ignored
  const serverTotal = course.price_per_person * participantCount

  // Voucher re-validation — client-supplied discount amount is ignored
  let serverDiscount = 0
  let validatedVoucherId: string | null = null
  if (body.voucher?.id) {
    const { data: voucher } = await serviceSupabase
      .from("vouchers")
      .select("id, remaining_value, status, expires_at")
      .eq("id", body.voucher.id)
      .eq("status", "active")
      .single()
    if (!voucher || (voucher.expires_at && new Date(voucher.expires_at) < new Date())) {
      return NextResponse.json({ error: "Ungültiger oder abgelaufener Gutscheincode." }, { status: 400 })
    }
    serverDiscount = Math.min(voucher.remaining_value, serverTotal)
    validatedVoucherId = voucher.id
  }

  // Input length validation on participant fields
  for (const p of body.participants as ParticipantBody[]) {
    if ((p.firstName?.length ?? 0) > 200 || (p.lastName?.length ?? 0) > 200)
      return NextResponse.json({ error: "Eingabe zu lang." }, { status: 400 })
    if ((p.email?.length ?? 0) > 254)
      return NextResponse.json({ error: "Eingabe zu lang." }, { status: 400 })
    if ((p.phone?.length ?? 0) > 50)
      return NextResponse.json({ error: "Eingabe zu lang." }, { status: 400 })
  }

  const finalTotal = serverTotal - serverDiscount
  const vatAmount = Math.round((finalTotal - finalTotal / 1.19) * 100) / 100
  const inv: InvoiceBody = body.invoiceRecipient

  const paymentMethod = ["card", "sepa", "bank_transfer"].includes(body.paymentMethod)
    ? body.paymentMethod
    : "bank_transfer"

  const { data, error } = await supabase.rpc("create_booking_atomic", {
    p_course_id:         body.course.id,
    p_user_id:           user?.id ?? null,
    p_payment_method:    paymentMethod,
    p_total_amount:      finalTotal,
    p_vat_amount:        vatAmount,
    p_voucher_discount:  serverDiscount,
    p_voucher_id:        validatedVoucherId,
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
    if (error.message?.includes("VOUCHER_ALREADY_USED")) {
      return NextResponse.json(
        { error: "Dieser Gutschein wurde bereits eingelöst oder ist nicht mehr gültig." },
        { status: 409 }
      )
    }
    console.error("[api/bookings]", error)
    return NextResponse.json({ error: "Buchung konnte nicht erstellt werden." }, { status: 400 })
  }

  const result = data as { booking_number: string; id: string }

  // Send bank transfer payment instructions email
  if (paymentMethod === "bank_transfer") {
    const primaryEmail = body.participants[0]?.email
    if (primaryEmail && course.title && course.date) {
      resend.emails.send({
        from: "onboarding@resend.dev",
        to: primaryEmail,
        subject: "Buchungsanfrage eingegangen — menufaktur Kochschule",
        html: buildBankTransferEmail({
          firstName: body.participants[0].firstName,
          bookingNumber: result.booking_number,
          courseTitle: course.title,
          dateFormatted: formatGermanDate(course.date),
          participantCount: participantCount,
          total: finalTotal,
        }),
      }).catch((err) => console.error("[api/bookings] bank transfer email", err))
    }
  }

  return NextResponse.json({ booking_number: result.booking_number, id: result.id })
}
