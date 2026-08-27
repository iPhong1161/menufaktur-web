import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer"

// Note: @react-pdf/renderer's <Image> primitive does NOT support remote SVG.
// The brand logo at https://menufaktur-web.vercel.app/brand/menufaktur-icon-cream.svg
// is served as SVG, so we use a text wordmark in the header instead. Swap to
// <Image src="..." /> once a PNG variant of the logo is available.

const COLOR_WINE = "#722F37"
const COLOR_CREAM = "#F5E1CC"
const COLOR_DARK = "#2A1E1E"
const COLOR_MUTED = "#8B7F7F"

const styles = StyleSheet.create({
  page: {
    backgroundColor: COLOR_CREAM,
    padding: 0,
    fontFamily: "Helvetica",
  },
  header: {
    backgroundColor: COLOR_WINE,
    paddingHorizontal: 48,
    paddingVertical: 44,
    alignItems: "center",
  },
  wordmark: {
    color: COLOR_CREAM,
    fontSize: 34,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 2,
  },
  tagline: {
    marginTop: 6,
    color: COLOR_CREAM,
    opacity: 0.7,
    fontSize: 10,
    letterSpacing: 3,
    textTransform: "uppercase",
  },
  body: {
    paddingHorizontal: 56,
    paddingTop: 48,
    paddingBottom: 24,
  },
  eyebrow: {
    fontSize: 10,
    letterSpacing: 2.5,
    color: COLOR_MUTED,
    textTransform: "uppercase",
    textAlign: "center",
    fontFamily: "Helvetica-Bold",
    marginBottom: 24,
  },
  codeBox: {
    borderWidth: 2,
    borderColor: COLOR_WINE,
    borderStyle: "solid",
    borderRadius: 8,
    paddingVertical: 28,
    paddingHorizontal: 24,
    marginBottom: 32,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  codeLabel: {
    fontSize: 9,
    letterSpacing: 2,
    color: COLOR_MUTED,
    textTransform: "uppercase",
    marginBottom: 10,
  },
  code: {
    fontSize: 32,
    fontFamily: "Courier-Bold",
    color: COLOR_WINE,
    letterSpacing: 6,
  },
  detailRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E5D9C8",
    borderStyle: "solid",
    paddingVertical: 12,
  },
  detailLabel: {
    width: "40%",
    fontSize: 10,
    color: COLOR_MUTED,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    fontFamily: "Helvetica-Bold",
    paddingTop: 2,
  },
  detailValue: {
    width: "60%",
    fontSize: 13,
    color: COLOR_DARK,
    fontFamily: "Helvetica-Bold",
  },
  detailValueLg: {
    width: "60%",
    fontSize: 20,
    color: COLOR_WINE,
    fontFamily: "Helvetica-Bold",
  },
  tagline2: {
    marginTop: 32,
    marginBottom: 6,
    fontSize: 13,
    color: COLOR_DARK,
    textAlign: "center",
    fontFamily: "Helvetica-Bold",
  },
  small: {
    fontSize: 10,
    color: COLOR_MUTED,
    textAlign: "center",
  },
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 2,
    borderTopColor: COLOR_WINE,
    borderStyle: "solid",
    paddingVertical: 16,
    paddingHorizontal: 40,
  },
  footerText: {
    fontSize: 9,
    color: COLOR_MUTED,
    textAlign: "center",
  },
})

function formatEur(amount: number): string {
  return amount.toLocaleString("de-DE", { minimumFractionDigits: 2 }) + " €"
}

function formatDateDe(iso: string): string {
  const [y, m, d] = iso.slice(0, 10).split("-").map(Number)
  const months = [
    "Januar", "Februar", "März", "April", "Mai", "Juni",
    "Juli", "August", "September", "Oktober", "November", "Dezember",
  ]
  return `${d}. ${months[m - 1]} ${y}`
}

export interface VoucherPDFProps {
  code: string
  wert: number
  empfaengerName: string
  expiresAt: string // ISO date
}

export function VoucherPDF({ code, wert, empfaengerName, expiresAt }: VoucherPDFProps) {
  return (
    <Document title="menufaktur Gutschein" author="menufaktur Kochschule">
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.wordmark}>menufaktur</Text>
          <Text style={styles.tagline}>Kochschule Frankfurt</Text>
        </View>

        <View style={styles.body}>
          <Text style={styles.eyebrow}>Gutschein</Text>

          <View style={styles.codeBox}>
            <Text style={styles.codeLabel}>Ihr Gutscheincode</Text>
            <Text style={styles.code}>{code}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Empfänger</Text>
            <Text style={styles.detailValue}>{empfaengerName}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Wert</Text>
            <Text style={styles.detailValueLg}>{formatEur(wert)}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Gültig bis</Text>
            <Text style={styles.detailValue}>{formatDateDe(expiresAt)}</Text>
          </View>

          <Text style={styles.tagline2}>Einlösbar für alle menufaktur Kochkurse</Text>
          <Text style={styles.small}>Einlösung online unter menufaktur.de mit dem obigen Code.</Text>
        </View>

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>
            menufaktur Kochschule · Bornheimer Landwehr 46 · 60385 Frankfurt am Main
          </Text>
        </View>
      </Page>
    </Document>
  )
}
