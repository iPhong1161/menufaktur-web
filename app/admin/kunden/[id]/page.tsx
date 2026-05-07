import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, MapPin, Phone, Mail, CreditCard } from "lucide-react"
import {
  getAdminCustomer,
  getCustomerBookings,
  getCustomerVouchers,
  getAdminCount,
} from "@/lib/supabase/queries/admin-customers"
import { AdminActions } from "@/components/admin/AdminActions"

export const metadata: Metadata = { title: "Kundenprofil — menufaktur Admin" }

const GERMAN_MONTHS = [
  "Januar", "Februar", "März", "April", "Mai", "Juni",
  "Juli", "August", "September", "Oktober", "November", "Dezember",
]

function formatDate(iso: string) {
  const d = new Date(iso)
  return `${d.getDate()}. ${GERMAN_MONTHS[d.getMonth()]} ${d.getFullYear()}`
}

function paymentLabel(method: string | null) {
  const map: Record<string, string> = {
    card: "Kreditkarte",
    sepa: "SEPA-Lastschrift",
    bank_transfer: "Banküberweisung",
  }
  return method ? (map[method] ?? method) : "—"
}

function bookingStatusLabel(status: string) {
  const map: Record<string, { label: string; cls: string }> = {
    pending:   { label: "Ausstehend", cls: "bg-amber-100 text-amber-800" },
    confirmed: { label: "Bestätigt",  cls: "bg-green-100 text-green-800" },
    cancelled: { label: "Storniert",  cls: "bg-red-100 text-red-800" },
    refunded:  { label: "Erstattet",  cls: "bg-blue-100 text-blue-800" },
  }
  return map[status] ?? { label: status, cls: "bg-dark/8 text-dark/50" }
}

function voucherStatusLabel(status: string) {
  const map: Record<string, { label: string; cls: string }> = {
    active:    { label: "Aktiv",      cls: "bg-green-100 text-green-800" },
    redeemed:  { label: "Eingelöst",  cls: "bg-blue-100 text-blue-800" },
    expired:   { label: "Abgelaufen", cls: "bg-dark/8 text-dark/50" },
    cancelled: { label: "Storniert",  cls: "bg-red-100 text-red-800" },
  }
  return map[status] ?? { label: status, cls: "bg-dark/8 text-dark/50" }
}

export default async function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const [customer, adminCount] = await Promise.all([
    getAdminCustomer(id),
    getAdminCount(),
  ])

  if (!customer) notFound()

  const [bookings, vouchers] = await Promise.all([
    getCustomerBookings(id),
    customer.email ? getCustomerVouchers(customer.email) : Promise.resolve([]),
  ])

  const fullName = [customer.first_name, customer.last_name].filter(Boolean).join(" ") || "Unbekannt"
  const initials = ((customer.first_name?.[0] ?? "") + (customer.last_name?.[0] ?? "")).toUpperCase() || "?"

  return (
    <main className="flex-grow pt-28 pb-20 px-8 max-w-screen-xl mx-auto w-full">
      {/* Back link */}
      <Link
        href="/admin/kunden"
        className="inline-flex items-center gap-2 text-wine-red/60 hover:text-wine-red text-sm font-bold mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Zurück zur Kundenliste
      </Link>

      {/* Page header */}
      <div className="flex items-center gap-6 mb-10">
        <div className="w-20 h-20 rounded-2xl bg-wine-red/10 text-wine-red flex items-center justify-center font-bold text-2xl shrink-0">
          {initials}
        </div>
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-4xl font-bold text-wine-red tracking-tight">{fullName}</h1>
            <span
              className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                !customer.is_admin
                  ? "bg-wine-red/8 text-wine-red"
                  : customer.admin_role === "moderator"
                  ? "bg-amber-100 text-amber-800"
                  : "bg-wine-red text-white"
              }`}
            >
              {!customer.is_admin ? "Kunde" : customer.admin_role === "moderator" ? "Moderator" : "Admin"}
            </span>
          </div>
          <p className="text-dark/50 font-condensed">
            Registriert am {formatDate(customer.created_at)} · {customer.booking_count} Buchung{customer.booking_count === 1 ? "" : "en"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column */}
        <div className="space-y-6">
          {/* Personal info card */}
          <div className="bg-white rounded-xl border border-dark/5 shadow-sm p-8 space-y-5">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-dark/40">Persönliche Daten</h2>

            {customer.email && (
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-wine-red mt-0.5 shrink-0" />
                <p className="text-sm text-dark/70 font-condensed break-all">{customer.email}</p>
              </div>
            )}
            {customer.phone && (
              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-wine-red mt-0.5 shrink-0" />
                <p className="text-sm text-dark/70 font-condensed">{customer.phone}</p>
              </div>
            )}
            {(customer.address_line1 || customer.city) && (
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-wine-red mt-0.5 shrink-0" />
                <address className="not-italic text-sm text-dark/70 font-condensed leading-relaxed">
                  {customer.address_line1 && <span className="block">{customer.address_line1}</span>}
                  {(customer.postal_code || customer.city) && (
                    <span className="block">
                      {[customer.postal_code, customer.city].filter(Boolean).join(" ")}
                    </span>
                  )}
                </address>
              </div>
            )}
            {customer.preferred_payment_method && (
              <div className="flex items-start gap-3">
                <CreditCard className="w-4 h-4 text-wine-red mt-0.5 shrink-0" />
                <p className="text-sm text-dark/70 font-condensed">
                  {paymentLabel(customer.preferred_payment_method)}
                </p>
              </div>
            )}
          </div>

          {/* Admin actions */}
          <AdminActions
            userId={id}
            userEmail={customer.email ?? ""}
            userName={fullName}
            isAdmin={customer.is_admin}
            adminCount={adminCount}
            admin_role={customer.admin_role}
          />
        </div>

        {/* Right column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Booking history */}
          <section>
            <h2 className="text-xl font-bold text-wine-red mb-4">Buchungsverlauf</h2>
            {bookings.length === 0 ? (
              <div className="bg-white rounded-xl border border-dark/5 shadow-sm p-8 text-center text-dark/40 font-condensed">
                Keine Buchungen vorhanden.
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-dark/5 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-[#F8F5DA]/60 border-b border-dark/8">
                      {["Kurs", "Datum", "Status", "Betrag", ""].map((h) => (
                        <th key={h} className="px-5 py-4 text-[10px] font-bold uppercase tracking-widest text-dark/40">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-dark/5">
                    {bookings.map((b) => {
                      const s = bookingStatusLabel(b.status)
                      return (
                        <tr key={b.id} className="hover:bg-[#F8F5DA]/20 transition-colors">
                          <td className="px-5 py-4">
                            <p className="font-bold text-dark text-sm">{b.course?.title ?? "—"}</p>
                            <p className="text-xs text-dark/40 font-condensed">
                              {b.course ? formatDate(b.course.date) : ""}
                            </p>
                          </td>
                          <td className="px-5 py-4 text-sm text-dark/60 font-condensed whitespace-nowrap">
                            {formatDate(b.created_at)}
                          </td>
                          <td className="px-5 py-4">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${s.cls}`}>
                              {s.label}
                            </span>
                          </td>
                          <td className="px-5 py-4 font-bold text-dark text-sm whitespace-nowrap">
                            {Number(b.total_amount).toFixed(2).replace(".", ",")} €
                          </td>
                          <td className="px-5 py-4">
                            <Link
                              href={`/admin/buchungen/${b.booking_number}`}
                              className="text-xs font-bold text-wine-red hover:underline underline-offset-2 font-condensed whitespace-nowrap"
                            >
                              {b.booking_number}
                            </Link>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* Voucher history */}
          <section>
            <h2 className="text-xl font-bold text-wine-red mb-4">Gutscheine</h2>
            {vouchers.length === 0 ? (
              <div className="bg-white rounded-xl border border-dark/5 shadow-sm p-8 text-center text-dark/40 font-condensed">
                Keine Gutscheine vorhanden.
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-dark/5 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-[#F8F5DA]/60 border-b border-dark/8">
                      {["Code", "Wert", "Verbleibend", "Status", "Gekauft"].map((h) => (
                        <th key={h} className="px-5 py-4 text-[10px] font-bold uppercase tracking-widest text-dark/40">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-dark/5">
                    {vouchers.map((v) => {
                      const s = voucherStatusLabel(v.status)
                      return (
                        <tr key={v.id} className="hover:bg-[#F8F5DA]/20 transition-colors">
                          <td className="px-5 py-4 font-mono text-sm font-bold text-dark">{v.code}</td>
                          <td className="px-5 py-4 font-bold text-dark text-sm whitespace-nowrap">
                            {Number(v.value).toFixed(2).replace(".", ",")} €
                          </td>
                          <td className="px-5 py-4 font-bold text-dark text-sm whitespace-nowrap">
                            {Number(v.remaining_value).toFixed(2).replace(".", ",")} €
                          </td>
                          <td className="px-5 py-4">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${s.cls}`}>
                              {s.label}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-sm text-dark/50 font-condensed whitespace-nowrap">
                            {formatDate(v.created_at)}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  )
}
