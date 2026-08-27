import { NextRequest, NextResponse } from "next/server"
import type Stripe from "stripe"
import { renderToBuffer } from "@react-pdf/renderer"
import { stripe } from "@/lib/stripe/client"
import { createServiceClient } from "@/lib/supabase/server"
import { resend } from "@/lib/resend/client"
import { emailLayout } from "@/lib/email/templates"
import { generateVoucherCode } from "@/lib/supabase/queries/vouchers"
import { VoucherPDF } from "@/lib/pdf/VoucherPDF"
import type { Database } from "@/types/database"

type VoucherInsert = Database["public"]["Tables"]["vouchers"]["Insert"]

const FROM_ADDRESS = "onboarding@resend.dev"
const ADMIN_ADDRESS = "noreply@menufaktur.de"

function esc(str: string | null | undefined): string {
  return (str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

function formatEur(amount: number): string {
  return amount.toLocaleString("de-DE", { minimumFractionDigits: 2 }) + " €"
}

interface Address {
  firstName?: string
  lastName?: string
  street?: string
  postalCode?: string
  city?: string
  email?: string
}

interface VoucherMetadata {
  wert: number
  quantity: number
  lieferung: "email" | "post"
  empfaengerName: string
  empfaengerEmail: string
  absenderName: string
  absenderEmail: string
  billingAddress: Address | null
  deliveryAddress: Address | null
}

function parseMetadata(session: Stripe.Checkout.Session): VoucherMetadata | null {
  const m = session.metadata ?? {}
  const wert = Number(m.wert)
  const quantity = Number(m.quantity)
  const lieferung = m.lieferung as "email" | "post"
  if (!Number.isFinite(wert) || !Number.isInteger(quantity) || quantity < 1) return null
  if (lieferung !== "email" && lieferung !== "post") return null

  let billingAddress: Address | null = null
  let deliveryAddress: Address | null = null
  try {
    if (m.billingAddress) billingAddress = JSON.parse(m.billingAddress) as Address
  } catch {}
  try {
    if (m.deliveryAddress && m.deliveryAddress !== "null") {
      deliveryAddress = JSON.parse(m.deliveryAddress) as Address
    }
  } catch {}

  return {
    wert,
    quantity,
    lieferung,
    empfaengerName: m.empfaengerName ?? "",
    empfaengerEmail: m.empfaengerEmail ?? "",
    absenderName: m.absenderName ?? "",
    absenderEmail: m.absenderEmail ?? "",
    billingAddress,
    deliveryAddress,
  }
}

async function generateUniqueCode(
  supabase: ReturnType<typeof createServiceClient>,
  used: Set<string>,
): Promise<string | null> {
  for (let attempt = 0; attempt < 8; attempt++) {
    const candidate = generateVoucherCode()
    if (used.has(candidate)) continue
    const { data } = await supabase.from("vouchers").select("id").eq("code", candidate).maybeSingle()
    if (!data) {
      used.add(candidate)
      return candidate
    }
  }
  return null
}

function threeYearsFromNowISO(): string {
  const d = new Date()
  d.setFullYear(d.getFullYear() + 3)
  return d.toISOString().slice(0, 10)
}

function digitalRecipientHtml(params: {
  wert: number
  codes: string[]
}): string {
  const codeList = params.codes
    .map((c) => `<li style="font-family:Courier,monospace;font-size:16px;color:#722F37;font-weight:bold;letter-spacing:2px;">${esc(c)}</li>`)
    .join("")
  return emailLayout(`
    <h1 style="margin:0 0 16px;font-size:24px;color:#722F37;">Ihr Gutschein ist da!</h1>
    <p style="margin:0 0 12px;color:#333;font-size:14px;line-height:1.6;">
      Im Anhang finden Sie Ihren menufaktur Gutschein über ${formatEur(params.wert)}.
    </p>
    <p style="margin:20px 0 8px;font-size:11px;text-transform:uppercase;letter-spacing:0.12em;color:#999;font-weight:700;">
      Ihre Gutscheincodes
    </p>
    <ul style="margin:0 0 20px;padding:0 0 0 20px;">${codeList}</ul>
    <p style="margin:16px 0 0;color:#666;font-size:13px;">
      Einlösbar unter <a href="https://menufaktur.de" style="color:#722F37;">menufaktur.de</a>.
    </p>
  `)
}

function postalAdminHtml(params: {
  wert: number
  quantity: number
  codes: string[]
  empfaengerName: string
  delivery: Address | null
  billing: Address | null
  buyerName: string
  buyerEmail: string
}): string {
  const addr = params.delivery ?? params.billing
  const addrHtml = addr
    ? `${esc(addr.firstName)} ${esc(addr.lastName)}<br>${esc(addr.street)}<br>${esc(addr.postalCode)} ${esc(addr.city)}`
    : "<em>keine Adresse angegeben</em>"
  const codeList = params.codes
    .map((c) => `<li style="font-family:Courier,monospace;font-size:14px;color:#722F37;font-weight:bold;letter-spacing:2px;">${esc(c)}</li>`)
    .join("")
  return emailLayout(`
    <h1 style="margin:0 0 12px;font-size:22px;color:#722F37;">Neuer Postversand-Auftrag</h1>
    <p style="margin:0 0 20px;color:#333;font-size:14px;line-height:1.6;">
      ${params.quantity}× Gutschein à ${formatEur(params.wert)} für ${esc(params.empfaengerName)}.
    </p>
    <p style="margin:16px 0 8px;font-size:11px;text-transform:uppercase;letter-spacing:0.12em;color:#999;font-weight:700;">Lieferadresse</p>
    <p style="margin:0;color:#333;font-size:14px;line-height:1.7;">${addrHtml}</p>
    <p style="margin:20px 0 8px;font-size:11px;text-transform:uppercase;letter-spacing:0.12em;color:#999;font-weight:700;">Bestellt von</p>
    <p style="margin:0;color:#333;font-size:14px;">${esc(params.buyerName)} · ${esc(params.buyerEmail)}</p>
    <p style="margin:20px 0 8px;font-size:11px;text-transform:uppercase;letter-spacing:0.12em;color:#999;font-weight:700;">Codes</p>
    <ul style="margin:0;padding:0 0 0 20px;">${codeList}</ul>
    <p style="margin:20px 0 0;color:#666;font-size:12px;">Die Gutschein-PDFs sind angehängt — bitte ausdrucken und versenden.</p>
  `)
}

function buyerConfirmationHtml(params: {
  wert: number
  quantity: number
  codes: string[]
  lieferung: "email" | "post"
  empfaengerEmail: string
}): string {
  const codeList = params.codes
    .map((c) => `<li style="font-family:Courier,monospace;font-size:14px;color:#722F37;font-weight:bold;letter-spacing:2px;">${esc(c)}</li>`)
    .join("")
  const deliveryLine =
    params.lieferung === "post"
      ? `Die Gutscheine werden in Kürze an die angegebene Adresse versendet.`
      : `Die Gutscheine wurden an ${esc(params.empfaengerEmail || "den Empfänger")} verschickt.`
  return emailLayout(`
    <h1 style="margin:0 0 12px;font-size:22px;color:#722F37;">Vielen Dank für Ihre Bestellung!</h1>
    <p style="margin:0 0 12px;color:#333;font-size:14px;line-height:1.6;">
      ${params.quantity} Gutschein(e) über je ${formatEur(params.wert)}.
    </p>
    <p style="margin:0 0 20px;color:#333;font-size:14px;line-height:1.6;">${deliveryLine}</p>
    <p style="margin:20px 0 8px;font-size:11px;text-transform:uppercase;letter-spacing:0.12em;color:#999;font-weight:700;">Ihre Codes zur Referenz</p>
    <ul style="margin:0 0 12px;padding:0 0 0 20px;">${codeList}</ul>
  `)
}

/**
 * Idempotent handler for a voucher checkout.session.completed event.
 * Safe to call multiple times for the same session — returns early if the
 * session has already been processed.
 */
export async function processVoucherCheckoutCompleted(
  session: Stripe.Checkout.Session,
): Promise<void> {
  const meta = parseMetadata(session)
  if (!meta) {
    console.error("[webhook/stripe/voucher] invalid metadata", session.id)
    return
  }

  const supabase = createServiceClient()

  // Idempotency check — has this session already produced vouchers?
  const { data: existing } = await supabase
    .from("vouchers")
    .select("id, code")
    .eq("stripe_session_id", session.id)
    .limit(1)

  if (existing && existing.length > 0) {
    return
  }

  // Reserve unique codes
  const codes: string[] = []
  const used = new Set<string>()
  for (let i = 0; i < meta.quantity; i++) {
    const code = await generateUniqueCode(supabase, used)
    if (!code) {
      console.error("[webhook/stripe/voucher] code generation exhausted for", session.id)
      return
    }
    codes.push(code)
  }

  const expiresAt = threeYearsFromNowISO()

  // Insert vouchers
  const inserts: VoucherInsert[] = codes.map((code) => ({
    code,
    value: meta.wert,
    remaining_value: meta.wert,
    status: "active",
    payment_status: "paid",
    expires_at: expiresAt,
    purchaser_name: meta.absenderName,
    purchaser_email: meta.absenderEmail,
    recipient_name: meta.empfaengerName,
    recipient_email: meta.empfaengerEmail || null,
    delivery_method: meta.lieferung,
    postal_address: meta.deliveryAddress ? (meta.deliveryAddress as unknown as Record<string, string>) : null,
    stripe_session_id: session.id,
    postal_fee: 0,
  }))

  const { error: insertError } = await supabase.from("vouchers").insert(inserts)
  if (insertError) {
    console.error("[webhook/stripe/voucher] insert failed", session.id, insertError)
    return
  }

  // Generate PDFs
  const attachments: Array<{ filename: string; content: Buffer }> = []
  for (const code of codes) {
    try {
      const buffer = await renderToBuffer(
        VoucherPDF({
          code,
          wert: meta.wert,
          empfaengerName: meta.empfaengerName,
          expiresAt,
        }),
      )
      attachments.push({ filename: `menufaktur-gutschein-${code}.pdf`, content: buffer })
    } catch (err) {
      console.error("[webhook/stripe/voucher] PDF render failed for", code, err)
    }
  }

  // Digital delivery — send to recipient (or buyer as fallback), CC admin
  if (meta.lieferung === "email") {
    const recipient = meta.empfaengerEmail || meta.absenderEmail
    if (recipient && attachments.length > 0) {
      try {
        await resend.emails.send({
          from: FROM_ADDRESS,
          to: recipient,
          cc: ADMIN_ADDRESS,
          subject: "Ihr menufaktur Gutschein",
          html: digitalRecipientHtml({ wert: meta.wert, codes }),
          attachments,
        })
      } catch (err) {
        console.error("[webhook/stripe/voucher] digital email failed", err)
      }
    }
  }

  // Postal delivery — send to recipient AND separately to admin with PDFs + record contact_message
  if (meta.lieferung === "post") {
    // Recipient email (same content as digital flow, no admin CC)
    const recipient = meta.empfaengerEmail || meta.absenderEmail
    if (recipient && attachments.length > 0) {
      try {
        await resend.emails.send({
          from: FROM_ADDRESS,
          to: recipient,
          subject: "Ihr menufaktur Gutschein",
          html: digitalRecipientHtml({ wert: meta.wert, codes }),
          attachments,
        })
      } catch (err) {
        console.error("[webhook/stripe/voucher] postal recipient email failed", err)
      }
    }

    // Admin email with printing instructions
    if (attachments.length > 0) {
      try {
        await resend.emails.send({
          from: FROM_ADDRESS,
          to: ADMIN_ADDRESS,
          subject: `Neuer Gutschein-Auftrag: ${meta.quantity}x ${meta.wert}€ — Bitte drucken und versenden`,
          html: postalAdminHtml({
            wert: meta.wert,
            quantity: meta.quantity,
            codes,
            empfaengerName: meta.empfaengerName,
            delivery: meta.deliveryAddress,
            billing: meta.billingAddress,
            buyerName: meta.absenderName,
            buyerEmail: meta.absenderEmail,
          }),
          attachments,
        })
      } catch (err) {
        console.error("[webhook/stripe/voucher] postal admin email failed", err)
      }
    }

    const addr = meta.deliveryAddress ?? meta.billingAddress
    const addrLines = addr
      ? `${addr.firstName ?? ""} ${addr.lastName ?? ""}\n${addr.street ?? ""}\n${addr.postalCode ?? ""} ${addr.city ?? ""}`.trim()
      : "keine Adresse angegeben"
    const messageBody = [
      `Wert: ${meta.wert} €`,
      `Anzahl: ${meta.quantity}`,
      `Empfänger: ${meta.empfaengerName}`,
      `Absender: ${meta.absenderName} <${meta.absenderEmail}>`,
      ``,
      `Lieferadresse:`,
      addrLines,
      ``,
      `Codes:`,
      ...codes.map((c) => `  ${c}`),
    ].join("\n")

    const { error: msgError } = await supabase.from("contact_messages").insert({
      name: meta.absenderName || "Gutschein-Auftrag",
      email: meta.absenderEmail || ADMIN_ADDRESS,
      subject: `Physischer Gutschein: ${meta.quantity}x ${meta.wert}€`,
      message: messageBody,
    })
    if (msgError) {
      console.error("[webhook/stripe/voucher] contact_messages insert failed", msgError)
    }
  }

  // Buyer confirmation — always
  if (meta.absenderEmail) {
    try {
      await resend.emails.send({
        from: FROM_ADDRESS,
        to: meta.absenderEmail,
        subject: "Ihre Gutschein-Bestellung — menufaktur Kochschule",
        html: buyerConfirmationHtml({
          wert: meta.wert,
          quantity: meta.quantity,
          codes,
          lieferung: meta.lieferung,
          empfaengerEmail: meta.empfaengerEmail,
        }),
      })
    } catch (err) {
      console.error("[webhook/stripe/voucher] buyer confirmation email failed", err)
    }
  }
}

/**
 * Standalone webhook endpoint. Useful if you point Stripe at this route
 * directly. The main `/api/webhooks/stripe` route already dispatches
 * voucher sessions here via a direct function call, so this POST is
 * primarily for testing or for a separate Stripe endpoint.
 */
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
    console.error("[webhook/stripe/voucher] signature verification failed", err)
    return NextResponse.json({ error: "Webhook signature invalid." }, { status: 400 })
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session
    if (session.metadata?.type === "voucher") {
      await processVoucherCheckoutCompleted(session)
    }
  }

  return NextResponse.json({ received: true })
}
