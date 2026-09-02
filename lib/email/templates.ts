const GERMAN_MONTHS = [
  "Januar", "Februar", "März", "April", "Mai", "Juni",
  "Juli", "August", "September", "Oktober", "November", "Dezember",
]

export function formatGermanDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-").map(Number)
  return `${day}. ${GERMAN_MONTHS[month - 1]} ${year}`
}

export function formatTime(time: string): string {
  return time.slice(0, 5)
}

export function formatEur(amount: number): string {
  return amount.toLocaleString("de-DE", { minimumFractionDigits: 2 }) + " €"
}

function esc(str: string | null | undefined): string {
  return (str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

// ─── Building blocks ─────────────────────────────────────────────────────────

function row(label: string, value: string, shaded = false): string {
  return `
    <tr style="background:${shaded ? "#f8f5da" : "#ffffff"};">
      <td style="padding:11px 16px;color:#777;font-size:13px;width:42%;border-top:1px solid #ede9d5;">${label}</td>
      <td style="padding:11px 16px;font-size:13px;font-weight:600;border-top:1px solid #ede9d5;">${value}</td>
    </tr>`
}

function table(rows: string[]): string {
  return `
    <table width="100%" cellpadding="0" cellspacing="0"
      style="border-collapse:collapse;border:1px solid #ede9d5;border-radius:6px;overflow:hidden;margin:0;">
      <tbody>${rows.join("")}</tbody>
    </table>`
}

function sectionHeading(text: string): string {
  return `<p style="margin:28px 0 10px;font-size:11px;font-weight:700;text-transform:uppercase;
    letter-spacing:0.12em;color:#999;">${text}</p>`
}

// ─── Page layout ─────────────────────────────────────────────────────────────

export function emailLayout(body: string): string {
  return `<!DOCTYPE html>
<html lang="de">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f0ece0;font-family:Arial,Helvetica,sans-serif;-webkit-font-smoothing:antialiased;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0ece0;padding:40px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0"
        style="background:#ffffff;border-radius:8px;overflow:hidden;max-width:600px;box-shadow:0 2px 12px rgba(0,0,0,0.07);">

        <!-- Header -->
        <tr>
          <td style="background:#722F37;padding:36px 40px;text-align:center;">
            <img
              src="https://menufaktur.de/brand/menufaktur-icon-cream.svg"
              alt="menufaktur Kochschule"
              width="180"
              style="display:block;margin:0 auto 8px;"
            />
            <p style="margin:0;color:rgba(255,255,255,0.6);font-size:11px;letter-spacing:0.18em;text-transform:uppercase;">Kochschule Frankfurt</p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:40px 40px 36px;">
            ${body}
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f8f5da;padding:24px 40px;border-top:2px solid #ede9d5;">
            <p style="margin:0;color:#999;font-size:12px;line-height:1.7;">
              Bei Fragen erreichen Sie uns unter
              <a href="mailto:post@menufaktur.de" style="color:#722F37;text-decoration:none;">post@menufaktur.de</a>
              oder +49 69 977 63 666.<br>
              menufaktur Kochschule · Bornheimer Landwehr 46, Hinterhaus · 60385 Frankfurt am Main
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}

// ─── Email templates ──────────────────────────────────────────────────────────

export function buildBankTransferEmail(params: {
  firstName: string
  bookingNumber: string
  courseTitle: string
  dateFormatted: string
  participantCount: number
  total: number
}): string {
  const { firstName, bookingNumber, courseTitle, dateFormatted, participantCount, total } = params

  const body = `
    <h2 style="margin:0 0 8px;color:#722F37;font-size:22px;font-weight:700;">Vielen Dank für Ihre Buchungsanfrage!</h2>
    <p style="margin:0 0 6px;color:#555;font-size:14px;line-height:1.6;">
      Hallo ${esc(firstName)},
    </p>
    <p style="margin:0 0 4px;color:#555;font-size:14px;line-height:1.6;">
      wir haben Ihre Anfrage für <strong>${esc(courseTitle)}</strong> am <strong>${dateFormatted}</strong> erhalten.
      Ihre Buchung wird nach Zahlungseingang bestätigt.
    </p>

    ${sectionHeading("Ihre Buchung")}
    ${table([
      row("Buchungsnummer", bookingNumber, true),
      row("Kurs", esc(courseTitle)),
      row("Datum", dateFormatted, true),
      row("Teilnehmer", String(participantCount)),
      row("Gesamtbetrag", formatEur(total), true),
    ])}

    ${sectionHeading("Zahlungsinformationen")}
    <div style="background:#f8f5da;border:1px solid #ede9d5;border-radius:6px;padding:20px 20px 16px;">
      ${table([
        row("Empfänger", "Kids Events and Catering GmbH", true),
        row("IBAN", "DE13 5125 0000 0001 1931 98"),
        row("BIC", "HELADEF1TSK", true),
        row("Verwendungszweck", bookingNumber),
        row("Betrag", formatEur(total), true),
        row("Zahlungsfrist", "7 Tage"),
      ])}
    </div>
    <p style="margin:12px 0 0;color:#999;font-size:11px;">
      Bitte geben Sie unbedingt Ihre Buchungsnummer als Verwendungszweck an.
    </p>`

  return emailLayout(body)
}

export function buildBookingConfirmedEmail(params: {
  firstName: string
  bookingNumber: string
  courseTitle: string
  dateFormatted: string
  startTime: string
  total: number
}): string {
  const { firstName, bookingNumber, courseTitle, dateFormatted, startTime, total } = params

  const body = `
    <h2 style="margin:0 0 8px;color:#722F37;font-size:22px;font-weight:700;">Ihre Buchung ist bestätigt!</h2>
    <p style="margin:0 0 6px;color:#555;font-size:14px;line-height:1.6;">
      Hallo ${esc(firstName)},
    </p>
    <p style="margin:0 0 4px;color:#555;font-size:14px;line-height:1.6;">
      Ihre Zahlung ist eingegangen. Wir freuen uns, Sie beim Kurs
      <strong>${esc(courseTitle)}</strong> begrüßen zu dürfen!
    </p>

    ${sectionHeading("Buchungsdetails")}
    ${table([
      row("Buchungsnummer", bookingNumber, true),
      row("Kurs", esc(courseTitle)),
      row("Datum", dateFormatted, true),
      row("Uhrzeit", `${startTime} Uhr`),
      row("Ort", "Bornheimer Landwehr 46, Hinterhaus · 60385 Frankfurt am Main", true),
      row("Gesamtbetrag", formatEur(total)),
    ])}

    <p style="margin:24px 0 0;color:#555;font-size:14px;line-height:1.6;">
      Bitte bringen Sie Ihre Buchungsnummer <strong>${bookingNumber}</strong> mit.
      Wir freuen uns auf einen schönen Kochabend mit Ihnen!
    </p>`

  return emailLayout(body)
}

export function buildStripeConfirmationEmail(params: {
  firstName: string
  bookingNumber: string
  courseTitle: string
  dateFormatted: string
  total: number
}): string {
  const { firstName, bookingNumber, courseTitle, dateFormatted, total } = params

  const body = `
    <h2 style="margin:0 0 8px;color:#722F37;font-size:22px;font-weight:700;">Buchungsbestätigung</h2>
    <p style="margin:0 0 6px;color:#555;font-size:14px;line-height:1.6;">
      Hallo ${esc(firstName)},
    </p>
    <p style="margin:0 0 4px;color:#555;font-size:14px;line-height:1.6;">
      vielen Dank für Ihre Buchung. Ihre Zahlung wurde bestätigt und Ihr Platz ist reserviert.
    </p>

    ${sectionHeading("Buchungsdetails")}
    ${table([
      row("Buchungsnummer", bookingNumber, true),
      row("Kurs", esc(courseTitle)),
      row("Datum", dateFormatted, true),
      row("Gesamtbetrag", formatEur(total)),
    ])}

    <p style="margin:24px 0 0;color:#555;font-size:14px;line-height:1.6;">
      Wir freuen uns darauf, mit Ihnen zu kochen!
    </p>`

  return emailLayout(body)
}
