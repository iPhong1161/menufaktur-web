import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer"

// Note: @react-pdf/renderer's <Image> primitive does NOT support remote SVG.
// The brand logo at https://menufaktur.de/brand/menufaktur-icon-cream.svg
// is served as SVG, so we use a text wordmark in the header instead.
// Same convention as lib/pdf/VoucherPDF.tsx.

const COLOR_WINE = "#722F37"
const COLOR_CREAM = "#F5E1CC"
const COLOR_DARK = "#2A1E1E"
const COLOR_MUTED = "#8B7F7F"
const COLOR_BORDER = "#E5D9C8"

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#FFFFFF",
    padding: 0,
    fontFamily: "Helvetica",
  },

  header: {
    backgroundColor: COLOR_WINE,
    paddingHorizontal: 48,
    paddingVertical: 32,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  wordmark: {
    color: COLOR_CREAM,
    fontSize: 28,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 1.5,
  },
  tagline: {
    marginTop: 4,
    color: COLOR_CREAM,
    opacity: 0.7,
    fontSize: 8,
    letterSpacing: 2.5,
    textTransform: "uppercase",
  },
  headerRight: {
    alignItems: "flex-end",
  },
  invoiceLabel: {
    color: COLOR_CREAM,
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 3,
    textTransform: "uppercase",
  },

  body: {
    paddingHorizontal: 48,
    paddingTop: 32,
    paddingBottom: 24,
  },

  metaBlock: {
    marginBottom: 28,
  },
  metaRow: {
    flexDirection: "row",
    marginBottom: 3,
  },
  metaLabel: {
    fontSize: 9,
    color: COLOR_MUTED,
    width: 130,
    textTransform: "uppercase",
    letterSpacing: 1,
    fontFamily: "Helvetica-Bold",
  },
  metaValue: {
    fontSize: 10,
    color: COLOR_DARK,
    fontFamily: "Helvetica-Bold",
  },

  addresses: {
    flexDirection: "row",
    gap: 32,
    marginBottom: 28,
  },
  addressBox: {
    flex: 1,
  },
  addressEyebrow: {
    fontSize: 8,
    letterSpacing: 1.5,
    color: COLOR_MUTED,
    textTransform: "uppercase",
    fontFamily: "Helvetica-Bold",
    marginBottom: 8,
  },
  addressLine: {
    fontSize: 10,
    color: COLOR_DARK,
    lineHeight: 1.5,
  },
  addressLineBold: {
    fontSize: 10,
    color: COLOR_DARK,
    fontFamily: "Helvetica-Bold",
    lineHeight: 1.5,
  },

  // Line-item table
  table: {
    marginTop: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLOR_BORDER,
    borderStyle: "solid",
    borderRadius: 3,
    overflow: "hidden",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: COLOR_CREAM,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  tableHeaderCell: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: COLOR_DARK,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  tableRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: COLOR_BORDER,
    borderStyle: "solid",
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  colDesc: { flex: 4 },
  colQty: { flex: 1, textAlign: "right" },
  colUnit: { flex: 1.4, textAlign: "right" },
  colTotal: { flex: 1.4, textAlign: "right" },
  cellPrimary: {
    fontSize: 10,
    color: COLOR_DARK,
    fontFamily: "Helvetica-Bold",
  },
  cellSecondary: {
    fontSize: 9,
    color: COLOR_MUTED,
    marginTop: 2,
  },
  cellNum: {
    fontSize: 10,
    color: COLOR_DARK,
  },
  cellNumBold: {
    fontSize: 10,
    color: COLOR_DARK,
    fontFamily: "Helvetica-Bold",
  },
  cellDiscount: {
    fontSize: 10,
    color: COLOR_WINE,
    fontFamily: "Helvetica-Bold",
  },

  // Totals block
  totals: {
    marginLeft: "auto",
    width: "50%",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  totalLabel: {
    fontSize: 10,
    color: COLOR_MUTED,
  },
  totalValue: {
    fontSize: 10,
    color: COLOR_DARK,
    fontFamily: "Helvetica-Bold",
  },
  totalRowBrutto: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderTopWidth: 1.5,
    borderTopColor: COLOR_WINE,
    borderStyle: "solid",
    marginTop: 4,
  },
  totalLabelBrutto: {
    fontSize: 12,
    color: COLOR_WINE,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  totalValueBrutto: {
    fontSize: 14,
    color: COLOR_WINE,
    fontFamily: "Helvetica-Bold",
  },

  payment: {
    marginTop: 28,
    padding: 12,
    backgroundColor: COLOR_CREAM,
    borderRadius: 3,
  },
  paymentLabel: {
    fontSize: 8,
    color: COLOR_MUTED,
    textTransform: "uppercase",
    letterSpacing: 1.5,
    fontFamily: "Helvetica-Bold",
    marginBottom: 4,
  },
  paymentValue: {
    fontSize: 11,
    color: COLOR_DARK,
    fontFamily: "Helvetica-Bold",
  },

  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLOR_CREAM,
    borderTopWidth: 2,
    borderTopColor: COLOR_WINE,
    borderStyle: "solid",
    paddingVertical: 14,
    paddingHorizontal: 40,
  },
  footerText: {
    fontSize: 8,
    color: COLOR_MUTED,
    textAlign: "center",
    lineHeight: 1.5,
  },
})

// ─── Utils ────────────────────────────────────────────────────────────────────

function formatEur(amount: number): string {
  return amount.toLocaleString("de-DE", { minimumFractionDigits: 2 }) + " €"
}

const GERMAN_MONTHS = [
  "Januar", "Februar", "März", "April", "Mai", "Juni",
  "Juli", "August", "September", "Oktober", "November", "Dezember",
]

function formatGermanDate(iso: string): string {
  const [y, m, d] = iso.slice(0, 10).split("-").map(Number)
  return `${d}. ${GERMAN_MONTHS[m - 1]} ${y}`
}

const PAYMENT_METHOD_LABEL: Record<string, string> = {
  bank_transfer: "Überweisung",
  card: "Kreditkarte",
  sepa: "SEPA-Lastschrift",
}

// ─── Props ────────────────────────────────────────────────────────────────────

export interface InvoicePDFProps {
  bookingNumber: string
  invoiceDate: string       // ISO date — booking.paid_at, falling back to created_at
  serviceDate: string       // ISO date — course date
  courseTitle: string
  courseDate: string        // ISO date — same as serviceDate, used in line item description
  participantCount: number
  pricePerPerson: number
  totalAmount: number       // gross (Brutto)
  vatAmount: number         // VAT included in totalAmount
  voucherDiscount: number   // subtracted from subtotal
  voucherCode: string | null
  paymentMethod: string
  buyer: {
    firstName: string
    lastName: string
    companyName: string | null
    addressLine1: string | null
    postalCode: string | null
    city: string | null
    country: string | null
    email: string
    vatId: string | null
  }
}

export function InvoicePDF(props: InvoicePDFProps) {
  const {
    bookingNumber,
    invoiceDate,
    serviceDate,
    courseTitle,
    courseDate,
    participantCount,
    pricePerPerson,
    totalAmount,
    vatAmount,
    voucherDiscount,
    voucherCode,
    paymentMethod,
    buyer,
  } = props

  const nettoTotal = totalAmount - vatAmount
  const lineSubtotal = pricePerPerson * participantCount
  const paymentLabel = PAYMENT_METHOD_LABEL[paymentMethod] ?? paymentMethod
  const hasDiscount = voucherDiscount > 0

  return (
    <Document title={`Rechnung RE-${bookingNumber}`} author="menufaktur Kochschule">
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.wordmark}>menufaktur</Text>
            <Text style={styles.tagline}>Kochschule Frankfurt</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.invoiceLabel}>Rechnung</Text>
          </View>
        </View>

        <View style={styles.body}>
          {/* Meta */}
          <View style={styles.metaBlock}>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Rechnungsnummer</Text>
              <Text style={styles.metaValue}>RE-{bookingNumber}</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Rechnungsdatum</Text>
              <Text style={styles.metaValue}>{formatGermanDate(invoiceDate)}</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Leistungsdatum</Text>
              <Text style={styles.metaValue}>{formatGermanDate(serviceDate)}</Text>
            </View>
          </View>

          {/* Seller + Buyer */}
          <View style={styles.addresses}>
            <View style={styles.addressBox}>
              <Text style={styles.addressEyebrow}>Rechnungssteller</Text>
              <Text style={styles.addressLineBold}>Kids Event and Catering GmbH</Text>
              <Text style={styles.addressLine}>Arnsburger Straße 41</Text>
              <Text style={styles.addressLine}>60385 Frankfurt am Main</Text>
              <Text style={[styles.addressLine, { marginTop: 8 }]}>
                USt-IdNr. DE329119702
              </Text>
              <Text style={styles.addressLine}>Geschäftsführer: Sven Jackel</Text>
            </View>

            <View style={styles.addressBox}>
              <Text style={styles.addressEyebrow}>Rechnungsempfänger</Text>
              {buyer.companyName && (
                <Text style={styles.addressLineBold}>{buyer.companyName}</Text>
              )}
              <Text style={buyer.companyName ? styles.addressLine : styles.addressLineBold}>
                {buyer.firstName} {buyer.lastName}
              </Text>
              {buyer.addressLine1 && (
                <Text style={styles.addressLine}>{buyer.addressLine1}</Text>
              )}
              {(buyer.postalCode || buyer.city) && (
                <Text style={styles.addressLine}>
                  {[buyer.postalCode, buyer.city].filter(Boolean).join(" ")}
                </Text>
              )}
              {buyer.country && (
                <Text style={styles.addressLine}>{buyer.country}</Text>
              )}
              <Text style={[styles.addressLine, { marginTop: 8 }]}>{buyer.email}</Text>
              {buyer.vatId && (
                <Text style={styles.addressLine}>USt-IdNr. {buyer.vatId}</Text>
              )}
            </View>
          </View>

          {/* Line items */}
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCell, styles.colDesc]}>Position</Text>
              <Text style={[styles.tableHeaderCell, styles.colQty]}>Menge</Text>
              <Text style={[styles.tableHeaderCell, styles.colUnit]}>Einzelpreis</Text>
              <Text style={[styles.tableHeaderCell, styles.colTotal]}>Summe</Text>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.colDesc}>
                <Text style={styles.cellPrimary}>{courseTitle}</Text>
                <Text style={styles.cellSecondary}>
                  Kurstermin: {formatGermanDate(courseDate)}
                </Text>
              </View>
              <Text style={[styles.cellNum, styles.colQty]}>{participantCount}</Text>
              <Text style={[styles.cellNum, styles.colUnit]}>{formatEur(pricePerPerson)}</Text>
              <Text style={[styles.cellNumBold, styles.colTotal]}>{formatEur(lineSubtotal)}</Text>
            </View>

            {hasDiscount && (
              <View style={styles.tableRow}>
                <View style={styles.colDesc}>
                  <Text style={styles.cellPrimary}>Gutschein-Rabatt</Text>
                  {voucherCode && (
                    <Text style={styles.cellSecondary}>Code: {voucherCode}</Text>
                  )}
                </View>
                <Text style={[styles.cellNum, styles.colQty]}>—</Text>
                <Text style={[styles.cellNum, styles.colUnit]}>—</Text>
                <Text style={[styles.cellDiscount, styles.colTotal]}>
                  −{formatEur(voucherDiscount)}
                </Text>
              </View>
            )}
          </View>

          {/* Totals */}
          <View style={styles.totals}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Nettobetrag</Text>
              <Text style={styles.totalValue}>{formatEur(nettoTotal)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>MwSt (19%)</Text>
              <Text style={styles.totalValue}>{formatEur(vatAmount)}</Text>
            </View>
            <View style={styles.totalRowBrutto}>
              <Text style={styles.totalLabelBrutto}>Bruttobetrag</Text>
              <Text style={styles.totalValueBrutto}>{formatEur(totalAmount)}</Text>
            </View>
          </View>

          {/* Payment */}
          <View style={styles.payment}>
            <Text style={styles.paymentLabel}>Zahlungsart</Text>
            <Text style={styles.paymentValue}>{paymentLabel}</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>
            menufaktur Kochschule · Bornheimer Landwehr 46 · 60385 Frankfurt am Main
          </Text>
          <Text style={styles.footerText}>
            Betreiber: Kids Event and Catering GmbH · HRB 118060 · USt-IdNr. DE329119702
          </Text>
        </View>
      </Page>
    </Document>
  )
}
