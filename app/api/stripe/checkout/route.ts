import { NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe/client"
import { enabledPaymentMethodTypes } from "@/lib/payments"
import { createServiceClient } from "@/lib/supabase/server"

const GERMAN_MONTHS = [
  "Januar", "Februar", "März", "April", "Mai", "Juni",
  "Juli", "August", "September", "Oktober", "November", "Dezember",
]

export async function POST(req: NextRequest) {
  // paymentMethod from the request body is ignored — the server decides which
  // methods are offered.
  const { bookingNumber } = await req.json()

  if (!bookingNumber) {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 })
  }

  const supabase = createServiceClient()

  // Fetch booking — use server-stored total, never trust client price
  const { data: booking } = await supabase
    .from("bookings")
    .select("id, total_amount, voucher_id, courses!inner(title, date)")
    .eq("booking_number", bookingNumber)
    .eq("payment_status", "unpaid")
    .single()

  if (!booking) {
    return NextResponse.json({ error: "Buchung nicht gefunden." }, { status: 404 })
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://menufaktur-web.vercel.app"
  const amountCents = Math.round(Number(booking.total_amount) * 100)
  const course = booking.courses as unknown as { title: string; date: string }
  const [year, month, day] = course.date.split("-").map(Number)
  const dateFormatted = `${day}. ${GERMAN_MONTHS[month - 1]} ${year}`

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: enabledPaymentMethodTypes(),
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: course.title,
              description: `Kochkurs am ${dateFormatted} · menufaktur Frankfurt`,
            },
            unit_amount: amountCents,
          },
          quantity: 1,
        },
      ],
      metadata: {
        bookingNumber,
        voucherId: booking.voucher_id ?? "",
      },
      success_url: `${siteUrl}/buchung/bestaetigung/${bookingNumber}?payment=success`,
      cancel_url: `${siteUrl}/kurse`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error("[api/stripe/checkout]", err)
    return NextResponse.json({ error: "Stripe-Sitzung konnte nicht erstellt werden." }, { status: 500 })
  }
}
