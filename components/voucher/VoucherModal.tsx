"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { X, Info } from "lucide-react"
import { cn } from "@/lib/utils"

interface VoucherModalProps {
  onClose: () => void
}

interface BuyerData {
  company: string
  department: string
  salutation: string
  firstName: string
  lastName: string
  street: string
  postalCity: string
  phone: string
  fax: string
  email: string
}

const VOUCHER_VALUES = [25, 50, 75, 95, 99, 109, 115, 125, 145]
const BASE_POSTAL_FEE = 3.5
const PER_VOUCHER_POSTAL_FEE = 0.2

function makeBuyer(): BuyerData {
  return {
    company: "",
    department: "",
    salutation: "Frau",
    firstName: "",
    lastName: "",
    street: "",
    postalCity: "",
    phone: "",
    fax: "",
    email: "",
  }
}

export function VoucherModal({ onClose }: VoucherModalProps) {
  const router = useRouter()

  const [buyer, setBuyer] = useState<BuyerData>(makeBuyer())
  const [selectedValue, setSelectedValue] = useState(25)
  const [quantity, setQuantity] = useState(1)
  const [agbAccepted, setAgbAccepted] = useState(false)
  const [postalDelivery, setPostalDelivery] = useState(false)
  const [newsletter, setNewsletter] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<keyof BuyerData | "agb", string>>>({})
  const [submitted, setSubmitted] = useState(false)

  const postalFee = postalDelivery ? BASE_POSTAL_FEE + (quantity - 1) * PER_VOUCHER_POSTAL_FEE : 0
  const total = selectedValue * quantity + postalFee

  // Scroll lock
  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => { document.body.style.overflow = "" }
  }, [])

  // Escape key
  const handleKey = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") onClose()
  }, [onClose])
  useEffect(() => {
    document.addEventListener("keydown", handleKey)
    return () => document.removeEventListener("keydown", handleKey)
  }, [handleKey])

  function validateBuyer(): Partial<Record<keyof BuyerData | "agb", string>> {
    const e: Partial<Record<keyof BuyerData | "agb", string>> = {}
    if (!buyer.firstName.trim()) e.firstName = "Pflichtfeld"
    if (!buyer.lastName.trim()) e.lastName = "Pflichtfeld"
    if (!buyer.street.trim()) e.street = "Pflichtfeld"
    if (!buyer.postalCity.trim()) e.postalCity = "Pflichtfeld"
    if (!buyer.phone.trim()) e.phone = "Pflichtfeld"
    if (!buyer.email.trim()) {
      e.email = "Pflichtfeld"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(buyer.email)) {
      e.email = "Ungültige E-Mail-Adresse"
    }
    if (!agbAccepted) e.agb = "Bitte akzeptieren Sie die AGB"
    return e
  }

  function handleSubmit() {
    setSubmitted(true)
    const errs = validateBuyer()
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    const orderData = {
      buyer,
      selectedValue,
      quantity,
      postalDelivery,
      postalFee,
      newsletter,
      total,
    }

    router.push("/gutschein/bestaetigung/GS-2026-00047")
    onClose()
  }

  function updateBuyer(field: keyof BuyerData, value: string) {
    setBuyer((prev) => ({ ...prev, [field]: value }))
    if (submitted) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  const inputClass = (field?: keyof BuyerData) =>
    cn(
      "w-full bg-[#ECE9CF] rounded-lg px-3 py-3 text-dark text-sm outline-none transition-all",
      "border-2 focus:border-wine-red",
      field && errors[field]
        ? "border-red-500"
        : "border-transparent"
    )

  const labelClass = "block text-[10px] font-bold uppercase tracking-widest text-dark/40 mb-1.5"

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8 bg-dark/60 backdrop-blur-sm overflow-y-auto"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-light-beige w-full max-w-3xl rounded-[2rem] shadow-2xl relative flex flex-col max-h-[90vh]">
        {/* Sticky header */}
        <div className="sticky top-0 bg-light-beige z-10 px-8 py-6 rounded-t-[2rem] border-b border-wine-red/10">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-bold text-wine-red leading-tight">Gutschein kaufen</h2>
              <p className="text-xs text-dark/50 mt-1">
                Felder mit <span className="text-red-500 font-bold">*</span> sind Pflichtfelder.
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-dark/8 transition-colors shrink-0 ml-4"
              aria-label="Schließen"
            >
              <X className="w-5 h-5 text-dark/60" />
            </button>
          </div>
        </div>

        {/* Scrollable form body */}
        <div className="px-8 pb-6 overflow-y-auto space-y-10 flex-1">

          {/* Section 1: Buyer data */}
          <section className="pt-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-wine-red flex items-center justify-center text-white text-sm font-bold shrink-0">
                1
              </div>
              <h3 className="text-lg font-bold text-wine-red">
                Daten des Gutscheinkäufers und Rechnungsempfängers
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className={labelClass}>Firma</label>
                <input
                  type="text"
                  value={buyer.company}
                  onChange={(e) => updateBuyer("company", e.target.value)}
                  placeholder="Firmenname (optional)"
                  className={inputClass()}
                />
              </div>

              <div>
                <label className={labelClass}>Abteilung</label>
                <input
                  type="text"
                  value={buyer.department}
                  onChange={(e) => updateBuyer("department", e.target.value)}
                  placeholder="Abteilung (optional)"
                  className={inputClass()}
                />
              </div>

              <div>
                <label className={labelClass}>Anrede</label>
                <select
                  value={buyer.salutation}
                  onChange={(e) => updateBuyer("salutation", e.target.value)}
                  className={inputClass()}
                >
                  <option value="Frau">Frau</option>
                  <option value="Herr">Herr</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Vorname *</label>
                <input
                  type="text"
                  value={buyer.firstName}
                  onChange={(e) => updateBuyer("firstName", e.target.value)}
                  placeholder="Vorname"
                  className={inputClass("firstName")}
                />
                {errors.firstName && (
                  <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
                )}
              </div>

              <div>
                <label className={labelClass}>Nachname *</label>
                <input
                  type="text"
                  value={buyer.lastName}
                  onChange={(e) => updateBuyer("lastName", e.target.value)}
                  placeholder="Nachname"
                  className={inputClass("lastName")}
                />
                {errors.lastName && (
                  <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className={labelClass}>Straße und Hausnummer *</label>
                <input
                  type="text"
                  value={buyer.street}
                  onChange={(e) => updateBuyer("street", e.target.value)}
                  placeholder="Straße und Hausnummer"
                  className={inputClass("street")}
                />
                {errors.street && (
                  <p className="text-red-500 text-xs mt-1">{errors.street}</p>
                )}
              </div>

              <div>
                <label className={labelClass}>PLZ und Ort *</label>
                <input
                  type="text"
                  value={buyer.postalCity}
                  onChange={(e) => updateBuyer("postalCity", e.target.value)}
                  placeholder="12345 Stadt"
                  className={inputClass("postalCity")}
                />
                {errors.postalCity && (
                  <p className="text-red-500 text-xs mt-1">{errors.postalCity}</p>
                )}
              </div>

              <div>
                <label className={labelClass}>Telefon *</label>
                <input
                  type="tel"
                  value={buyer.phone}
                  onChange={(e) => updateBuyer("phone", e.target.value)}
                  placeholder="Telefonnummer"
                  className={inputClass("phone")}
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                )}
              </div>

              <div>
                <label className={labelClass}>Fax</label>
                <input
                  type="tel"
                  value={buyer.fax}
                  onChange={(e) => updateBuyer("fax", e.target.value)}
                  placeholder="Faxnummer (optional)"
                  className={inputClass()}
                />
              </div>

              <div>
                <label className={labelClass}>E-Mail *</label>
                <input
                  type="email"
                  value={buyer.email}
                  onChange={(e) => updateBuyer("email", e.target.value)}
                  placeholder="beispiel@mail.de"
                  className={inputClass("email")}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>
            </div>
          </section>

          {/* Section 2: Voucher value */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-wine-red flex items-center justify-center text-white text-sm font-bold shrink-0">
                2
              </div>
              <h3 className="text-lg font-bold text-wine-red">Wert des Gutscheins</h3>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
              {VOUCHER_VALUES.map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setSelectedValue(val)}
                  className={cn(
                    "py-3 rounded-xl border-2 text-center font-bold text-sm transition-all",
                    selectedValue === val
                      ? "border-wine-red bg-wine-red/5 text-wine-red"
                      : "border-transparent bg-[#ECE9CF] text-dark/70 hover:border-wine-red/30"
                  )}
                >
                  {val} €
                </button>
              ))}
            </div>
          </section>

          {/* Section 3: Quantity */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-wine-red flex items-center justify-center text-white text-sm font-bold shrink-0">
                3
              </div>
              <h3 className="text-lg font-bold text-wine-red">Anzahl der Gutscheine</h3>
            </div>

            <div className="w-full sm:w-64">
              <select
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full bg-[#ECE9CF] border-2 border-transparent rounded-lg px-3 py-3 text-dark text-sm outline-none focus:border-wine-red transition-all"
              >
                {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>
                    {n} {n === 1 ? "Gutschein" : "Gutscheine"}
                  </option>
                ))}
              </select>
            </div>
          </section>

          {/* Section 4: Terms */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-wine-red flex items-center justify-center text-white text-sm font-bold shrink-0">
                4
              </div>
              <h3 className="text-lg font-bold text-wine-red">Sonstige Angaben</h3>
            </div>

            <div className="space-y-5">
              <label className="flex items-start gap-4 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agbAccepted}
                  onChange={(e) => {
                    setAgbAccepted(e.target.checked)
                    if (submitted) setErrors((prev) => { const n = { ...prev }; delete n.agb; return n })
                  }}
                  className="mt-0.5 w-5 h-5 rounded border-dark/20 text-wine-red focus:ring-wine-red/20 bg-[#ECE9CF] shrink-0"
                />
                <span className="text-sm text-dark/80 leading-snug">
                  Ich akzeptiere die{" "}
                  <a href="/agb" className="text-wine-red font-bold underline" target="_blank">
                    Allgemeinen Geschäftsbedingungen
                  </a>{" "}
                  (AGB) *
                </span>
              </label>
              {errors.agb && (
                <p className="text-red-500 text-xs -mt-3 pl-9">{errors.agb}</p>
              )}

              <div className="bg-[#F8F5DA] p-4 rounded-xl border-l-4 border-wine-red/20 flex gap-3">
                <Info className="w-5 h-5 text-wine-red shrink-0 mt-0.5" aria-hidden="true" />
                <p className="text-sm text-dark/60 italic leading-relaxed">
                  Nach dem Kauf können Sie Ihren/Ihre Gutschein/e direkt ausdrucken oder als
                  PDF speichern. Der Download-Link wird Ihnen per E-Mail zugesandt.
                </p>
              </div>

              <label className="flex items-start gap-4 cursor-pointer">
                <input
                  type="checkbox"
                  checked={postalDelivery}
                  onChange={(e) => setPostalDelivery(e.target.checked)}
                  className="mt-0.5 w-5 h-5 rounded border-dark/20 text-wine-red focus:ring-wine-red/20 bg-[#ECE9CF] shrink-0"
                />
                <span className="text-sm text-dark/80 leading-snug">
                  Ja, ich möchte den/die Gutschein/e zusätzlich per Post erhalten.{" "}
                  <span className="font-bold text-wine-red">
                    (+ {(BASE_POSTAL_FEE + (quantity - 1) * PER_VOUCHER_POSTAL_FEE).toLocaleString("de-DE", { minimumFractionDigits: 2 })} € Servicegebühr)
                  </span>
                </span>
              </label>

              <label className="flex items-start gap-4 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newsletter}
                  onChange={(e) => setNewsletter(e.target.checked)}
                  className="mt-0.5 w-5 h-5 rounded border-dark/20 text-wine-red focus:ring-wine-red/20 bg-[#ECE9CF] shrink-0"
                />
                <span className="text-sm text-dark/80 leading-snug">
                  Ja, ich möchte den Newsletter erhalten und über kulinarische Events informiert
                  werden. (Jederzeit abbestellbar.)
                </span>
              </label>
            </div>
          </section>
        </div>

        {/* Sticky footer */}
        <div className="p-6 md:p-8 bg-[#F8F5DA] rounded-b-[2rem] flex flex-col sm:flex-row justify-between items-center gap-5 border-t border-wine-red/10">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-dark/40 font-bold mb-1">
              Gesamtbetrag
            </p>
            <p className="text-3xl font-bold text-wine-red leading-none">
              {total.toLocaleString("de-DE", { minimumFractionDigits: 2 })} €
            </p>
            {postalDelivery && (
              <p className="text-xs text-dark/40 mt-1">
                inkl. {postalFee.toLocaleString("de-DE", { minimumFractionDigits: 2 })} € Versand
              </p>
            )}
          </div>
          <button
            onClick={handleSubmit}
            className="w-full sm:w-auto px-10 py-4 bg-wine-red hover:bg-garnet-red text-white font-bold text-base rounded-xl shadow-lg transition-all hover:-translate-y-0.5 active:scale-95"
          >
            Kauf abschließen
          </button>
        </div>
      </div>
    </div>
  )
}
