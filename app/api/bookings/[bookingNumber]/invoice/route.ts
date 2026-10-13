import { NextRequest, NextResponse } from "next/server"
import { renderToBuffer } from "@react-pdf/renderer"
import { createClient, createServiceClient, getAdminUser } from "@/lib/supabase/server"
import { InvoicePDF } from "@/lib/pdf/InvoicePDF"

// @react-pdf/renderer requires Node runtime — same as the voucher webhook.
export const runtime = "nodejs"

type Params = { params: Promise<{ bookingNumber: string }> }

interface BookingRow {
  id: string
  user_id: string | null
  booking_number: string
  status: string
  payment_status: string
  payment_method: string
  total_amount: number | string
  vat_amount: number | string
  voucher_discount: number | string
  voucher_id: string | null
  created_at: string
  paid_at: string | null
  course: {
    title: string
    date: string
    price_per_person: number | string
  } | null
  participants: Array<{
    first_name: string
    last_name: string
    email: string
    is_primary: boolean
  }>
  invoice_recipient: {
    first_name: string
    last_name: string
    company_name: string | null
    address_line1: string
    postal_code: string
    city: string
    country: string
    email: string
    vat_id: string | null
  } | null
}

export async function GET(_req: NextRequest, { params }: Params) {
  const { bookingNumber } = await params

  const service = createServiceClient()
  const { data, error } = await service
    .from("bookings")
    .select(
      `id, user_id, booking_number, status, payment_status, payment_method,
       total_amount, vat_amount, voucher_discount, voucher_id, created_at, paid_at,
       course:courses(title, date, price_per_person),
       participants(first_name, last_name, email, is_primary),
       invoice_recipient:invoice_recipients(first_name, last_name, company_name,
         address_line1, postal_code, city, country, email, vat_id)`
    )
    .eq("booking_number", bookingNumber)
    .single()

  if (error || !data) {
    return NextResponse.json({ error: "Buchung nicht gefunden." }, { status: 404 })
  }

  const booking = data as unknown as BookingRow

  // Auth: allow admin/moderator, or the booking's owner
  const admin = await getAdminUser()
  if (!admin) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || booking.user_id !== user.id) {
      return NextResponse.json({ error: "Keine Berechtigung." }, { status: 403 })
    }
  }

  if (booking.payment_status !== "paid") {
    return NextResponse.json(
      { error: "Rechnung erst nach Zahlungseingang verfügbar." },
      { status: 409 }
    )
  }

  if (!booking.course) {
    return NextResponse.json({ error: "Kursdaten fehlen." }, { status: 500 })
  }

  const participantCount = booking.participants?.length ?? 1
  const primary = booking.participants.find((p) => p.is_primary) ?? booking.participants[0]
  const totalAmount = Number(booking.total_amount)
  const vatAmount = Number(booking.vat_amount)
  const voucherDiscount = Number(booking.voucher_discount)
  const pricePerPerson = Number(booking.course.price_per_person)

  // Fallback buyer from primary participant if no invoice_recipient row.
  const buyer = booking.invoice_recipient
    ? {
        firstName: booking.invoice_recipient.first_name,
        lastName: booking.invoice_recipient.last_name,
        companyName: booking.invoice_recipient.company_name,
        addressLine1: booking.invoice_recipient.address_line1,
        postalCode: booking.invoice_recipient.postal_code,
        city: booking.invoice_recipient.city,
        country: booking.invoice_recipient.country,
        email: booking.invoice_recipient.email,
        vatId: booking.invoice_recipient.vat_id,
      }
    : {
        firstName: primary?.first_name ?? "",
        lastName: primary?.last_name ?? "",
        companyName: null,
        addressLine1: null,
        postalCode: null,
        city: null,
        country: null,
        email: primary?.email ?? "",
        vatId: null,
      }

  let voucherCode: string | null = null
  if (voucherDiscount > 0 && booking.voucher_id) {
    const { data: voucher } = await service
      .from("vouchers")
      .select("code")
      .eq("id", booking.voucher_id)
      .single()
    voucherCode = voucher?.code ?? null
  }

  // Invoice date = when payment landed. Older bookings predate paid_at, so fall
  // back to created_at rather than dating the invoice "today" on every download.
  const invoiceDate = (booking.paid_at ?? booking.created_at).slice(0, 10)

  try {
    const buffer = await renderToBuffer(
      InvoicePDF({
        bookingNumber: booking.booking_number,
        invoiceDate,
        serviceDate: booking.course.date,
        courseTitle: booking.course.title,
        courseDate: booking.course.date,
        participantCount,
        pricePerPerson,
        totalAmount,
        vatAmount,
        voucherDiscount,
        voucherCode,
        paymentMethod: booking.payment_method,
        buyer,
      })
    )

    return new Response(buffer as unknown as BodyInit, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="Rechnung-${booking.booking_number}.pdf"`,
        "Cache-Control": "private, no-store",
      },
    })
  } catch (err) {
    console.error("[api/bookings/invoice] PDF render failed", bookingNumber, err)
    return NextResponse.json(
      { error: "Rechnung konnte nicht erstellt werden." },
      { status: 500 }
    )
  }
}
