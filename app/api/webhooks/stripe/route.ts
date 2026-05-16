import { NextRequest, NextResponse } from "next/server"
import type Stripe from "stripe"
import { stripe } from "@/lib/stripe/client"
import { createServiceClient } from "@/lib/supabase/server"
import { resend } from "@/lib/resend/client"
import { buildStripeConfirmationEmail, formatGermanDate } from "@/lib/email/templates"

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get("stripe-signature")

  if (!sig) {
    return NextResponse.json({ error: "Missing stripe-signature header." }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error("[webhook/stripe] signature verification failed", err)
    return NextResponse.json({ error: "Webhook signature invalid." }, { status: 400 })
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session
    const bookingNumber = session.metadata?.bookingNumber
    const voucherId = session.metadata?.voucherId

    if (!bookingNumber) {
      return NextResponse.json({ received: true })
    }

    const supabase = createServiceClient()

    // Fetch booking first — idempotency check before any mutation
    const { data: booking, error: fetchError } = await supabase
      .from("bookings")
      .select("id, payment_status, total_amount, courses!inner(title, date)")
      .eq("booking_number", bookingNumber)
      .single()

    if (fetchError || !booking) {
      console.error("[webhook/stripe] booking not found", bookingNumber, fetchError)
      return NextResponse.json({ received: true })
    }

    // Already processed — return early to prevent duplicate emails on webhook retry
    if (booking.payment_status === "paid") {
      return NextResponse.json({ received: true })
    }

    // Mark booking as paid
    const { error: updateError } = await supabase
      .from("bookings")
      .update({ payment_status: "paid", stripe_session_id: session.id })
      .eq("booking_number", bookingNumber)

    if (updateError) {
      console.error("[webhook/stripe] booking update failed", bookingNumber, updateError)
      return NextResponse.json({ received: true })
    }

    // Note: voucher is already marked redeemed atomically inside create_booking_atomic.
    // No separate redemption step needed here.

    // Fetch primary participant for confirmation email
    const { data: participant } = await supabase
      .from("participants")
      .select("first_name, last_name, email")
      .eq("booking_id", booking.id)
      .eq("is_primary", true)
      .single()

    if (participant?.email) {
      const course = booking.courses as unknown as { title: string; date: string }
      try {
        await resend.emails.send({
          from: "onboarding@resend.dev",
          to: participant.email,
          subject: `Buchungsbestätigung — ${course.title}`,
          html: buildStripeConfirmationEmail({
            firstName: participant.first_name,
            bookingNumber,
            courseTitle: course.title,
            dateFormatted: formatGermanDate(course.date),
            total: Number(booking.total_amount),
          }),
        })
      } catch (emailErr) {
        console.error("[webhook/stripe] confirmation email failed", emailErr)
      }
    }
  }

  return NextResponse.json({ received: true })
}
