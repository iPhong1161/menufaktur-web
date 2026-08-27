import { NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe/client"

interface Address {
  firstName: string
  lastName: string
  street: string
  postalCode: string
  city: string
  email?: string
}

interface CheckoutBody {
  wert: number
  quantity: number
  lieferung: "email" | "post"
  empfaengerName: string
  empfaengerEmail?: string
  absenderName: string
  absenderEmail: string
  billingAddress: Address
  deliveryAddress: Address | null
}

const VOUCHER_VALUES = new Set([50, 75, 99, 109, 115, 119, 125, 145])
const MIN_QUANTITY = 1
const MAX_QUANTITY = 10
const BASE_POSTAL_FEE = 3.5
const PER_VOUCHER_POSTAL_FEE = 0.2
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function isAddressComplete(a: Address | null | undefined, requireEmail: boolean): boolean {
  if (!a) return false
  if (!a.firstName?.trim() || !a.lastName?.trim() || !a.street?.trim() || !a.postalCode?.trim() || !a.city?.trim()) {
    return false
  }
  if (requireEmail) {
    if (!a.email?.trim() || !EMAIL_REGEX.test(a.email.trim())) return false
  }
  return true
}

export async function POST(req: NextRequest) {
  let body: CheckoutBody
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 })
  }

  // Value + quantity validation (server-authoritative)
  if (typeof body.wert !== "number" || !VOUCHER_VALUES.has(body.wert)) {
    return NextResponse.json({ error: "Ungültiger Gutscheinwert." }, { status: 400 })
  }
  if (
    typeof body.quantity !== "number" ||
    !Number.isInteger(body.quantity) ||
    body.quantity < MIN_QUANTITY ||
    body.quantity > MAX_QUANTITY
  ) {
    return NextResponse.json({ error: "Ungültige Anzahl." }, { status: 400 })
  }
  if (body.lieferung !== "email" && body.lieferung !== "post") {
    return NextResponse.json({ error: "Ungültige Lieferoption." }, { status: 400 })
  }

  // Voucher recipient / sender
  if (!body.empfaengerName?.trim()) {
    return NextResponse.json({ error: "Empfänger fehlt." }, { status: 400 })
  }
  if (!body.absenderName?.trim() || !body.absenderEmail?.trim() || !EMAIL_REGEX.test(body.absenderEmail.trim())) {
    return NextResponse.json({ error: "Absenderdaten unvollständig." }, { status: 400 })
  }

  // Billing address (always required; email required for payment confirmation)
  if (!isAddressComplete(body.billingAddress, true)) {
    return NextResponse.json({ error: "Rechnungsadresse unvollständig." }, { status: 400 })
  }

  // Delivery address — only relevant for postal delivery
  let deliveryAddress: Address | null = null
  if (body.lieferung === "post") {
    if (!body.deliveryAddress) {
      return NextResponse.json({ error: "Lieferadresse fehlt." }, { status: 400 })
    }
    if (!isAddressComplete(body.deliveryAddress, false)) {
      return NextResponse.json({ error: "Lieferadresse unvollständig." }, { status: 400 })
    }
    deliveryAddress = body.deliveryAddress
  }

  // Pricing (server-authoritative)
  const subtotal = body.wert * body.quantity
  const postalFee =
    body.lieferung === "post"
      ? BASE_POSTAL_FEE + (body.quantity - 1) * PER_VOUCHER_POSTAL_FEE
      : 0

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://menufaktur-web.vercel.app"

  const lineItems: Array<{
    price_data: {
      currency: string
      product_data: { name: string; description?: string }
      unit_amount: number
    }
    quantity: number
  }> = [
    {
      price_data: {
        currency: "eur",
        product_data: {
          name: `Gutschein menufaktur ${body.wert}€ × ${body.quantity}`,
          description: `Kochkurs-Gutschein für ${body.empfaengerName.trim()}`,
        },
        unit_amount: Math.round(subtotal * 100),
      },
      quantity: 1,
    },
  ]

  if (postalFee > 0) {
    lineItems.push({
      price_data: {
        currency: "eur",
        product_data: { name: "Versandkosten" },
        unit_amount: Math.round(postalFee * 100),
      },
      quantity: 1,
    })
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card", "sepa_debit"],
      customer_email: body.billingAddress.email!.trim(),
      line_items: lineItems,
      metadata: {
        type: "voucher",
        wert: String(body.wert),
        quantity: String(body.quantity),
        lieferung: body.lieferung,
        empfaengerName: body.empfaengerName.trim().slice(0, 200),
        empfaengerEmail: (body.empfaengerEmail ?? "").trim().slice(0, 200),
        absenderName: body.absenderName.trim().slice(0, 200),
        absenderEmail: body.absenderEmail.trim().slice(0, 200),
        billingAddress: JSON.stringify(body.billingAddress).slice(0, 500),
        deliveryAddress: JSON.stringify(deliveryAddress).slice(0, 500),
      },
      success_url: `${siteUrl}/gutschein/bestaetigung?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/gutschein`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error("[api/vouchers/checkout]", err)
    return NextResponse.json({ error: "Stripe-Sitzung konnte nicht erstellt werden." }, { status: 500 })
  }
}
