"use client"

import { useState } from "react"
import { Send } from "lucide-react"
import { cn } from "@/lib/utils"

interface FormData {
  empfaengerName: string
  empfaengerEmail: string
  lieferung: "email" | "post"
  absenderName: string
  absenderEmail: string
}

interface Address {
  firstName: string
  lastName: string
  street: string
  postalCode: string
  city: string
  email: string
}

const VOUCHER_VALUES = [50, 75, 99, 109, 115, 119, 125, 145]
const MIN_QUANTITY = 1
const MAX_QUANTITY = 10

function emptyAddress(): Address {
  return { firstName: "", lastName: "", street: "", postalCode: "", city: "", email: "" }
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function GutscheinAnfrageForm() {
  const [form, setForm] = useState<FormData>({
    empfaengerName: "",
    empfaengerEmail: "",
    lieferung: "email",
    absenderName: "",
    absenderEmail: "",
  })
  const [wert, setWert] = useState<number>(109)
  const [quantity, setQuantity] = useState<number>(1)
  const [billing, setBilling] = useState<Address>(emptyAddress())
  const [delivery, setDelivery] = useState<Address>(emptyAddress())
  const [deliverySameAsBilling, setDeliverySameAsBilling] = useState<boolean>(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  function validate(): Record<string, string> {
    const e: Record<string, string> = {}

    // Voucher recipient / sender
    if (!form.empfaengerName.trim()) e.empfaengerName = "Pflichtfeld"
    if (!form.absenderName.trim()) e.absenderName = "Pflichtfeld"
    if (!form.absenderEmail.trim()) {
      e.absenderEmail = "Pflichtfeld"
    } else if (!EMAIL_REGEX.test(form.absenderEmail)) {
      e.absenderEmail = "Ungültige E-Mail-Adresse"
    }
    if (form.empfaengerEmail && !EMAIL_REGEX.test(form.empfaengerEmail)) {
      e.empfaengerEmail = "Ungültige E-Mail-Adresse"
    }

    // Billing address — always required
    if (!billing.firstName.trim()) e["billing.firstName"] = "Pflichtfeld"
    if (!billing.lastName.trim()) e["billing.lastName"] = "Pflichtfeld"
    if (!billing.street.trim()) e["billing.street"] = "Pflichtfeld"
    if (!billing.postalCode.trim()) e["billing.postalCode"] = "Pflichtfeld"
    if (!billing.city.trim()) e["billing.city"] = "Pflichtfeld"
    if (!billing.email.trim()) {
      e["billing.email"] = "Pflichtfeld"
    } else if (!EMAIL_REGEX.test(billing.email)) {
      e["billing.email"] = "Ungültige E-Mail-Adresse"
    }

    // Delivery address — only required for postal delivery when not sharing billing
    if (form.lieferung === "post" && !deliverySameAsBilling) {
      if (!delivery.firstName.trim()) e["delivery.firstName"] = "Pflichtfeld"
      if (!delivery.lastName.trim()) e["delivery.lastName"] = "Pflichtfeld"
      if (!delivery.street.trim()) e["delivery.street"] = "Pflichtfeld"
      if (!delivery.postalCode.trim()) e["delivery.postalCode"] = "Pflichtfeld"
      if (!delivery.city.trim()) e["delivery.city"] = "Pflichtfeld"
    }

    return e
  }

  function updateForm(field: keyof FormData, value: string) {
    setForm((p) => ({ ...p, [field]: value }))
    if (submitted) setErrors((p) => { const n = { ...p }; delete n[field]; return n })
  }

  function updateBilling(field: keyof Address, value: string) {
    setBilling((p) => ({ ...p, [field]: value }))
    const key = `billing.${field}`
    if (submitted) setErrors((p) => { const n = { ...p }; delete n[key]; return n })
  }

  function updateDelivery(field: keyof Address, value: string) {
    setDelivery((p) => ({ ...p, [field]: value }))
    const key = `delivery.${field}`
    if (submitted) setErrors((p) => { const n = { ...p }; delete n[key]; return n })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(true)
    setServerError(null)
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    setIsSubmitting(true)
    try {
      const res = await fetch("/api/vouchers/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          wert,
          quantity,
          lieferung: form.lieferung,
          empfaengerName: form.empfaengerName,
          empfaengerEmail: form.empfaengerEmail,
          absenderName: form.absenderName,
          absenderEmail: form.absenderEmail,
          billingAddress: billing,
          deliveryAddress:
            form.lieferung === "post"
              ? deliverySameAsBilling ? billing : delivery
              : null,
        }),
      })
      const data = await res.json()
      if (!res.ok || !data?.url) {
        setServerError(data?.error ?? "Zahlung konnte nicht gestartet werden. Bitte versuchen Sie es erneut.")
        setIsSubmitting(false)
        return
      }
      window.location.href = data.url as string
    } catch {
      setServerError("Zahlung konnte nicht gestartet werden. Bitte versuchen Sie es erneut.")
      setIsSubmitting(false)
    }
  }

  function inputClass(field: string) {
    return cn(
      "w-full bg-[#ECE9CF] rounded-lg px-4 py-3.5 text-dark text-base outline-none transition-all border-2 font-condensed",
      errors[field] ? "border-red-500" : "border-transparent focus:border-wine-red"
    )
  }

  const addressFields = (
    kind: "billing" | "delivery",
    address: Address,
    onChange: (field: keyof Address, value: string) => void,
    includeEmail: boolean,
  ) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
      <div>
        <label className="block text-[10px] font-bold uppercase tracking-widest text-dark/40 mb-1.5">
          Vorname <span className="text-wine-red">*</span>
        </label>
        <input
          type="text"
          value={address.firstName}
          onChange={(e) => onChange("firstName", e.target.value)}
          className={inputClass(`${kind}.firstName`)}
        />
        {errors[`${kind}.firstName`] && <p className="text-red-500 text-xs mt-1">{errors[`${kind}.firstName`]}</p>}
      </div>
      <div>
        <label className="block text-[10px] font-bold uppercase tracking-widest text-dark/40 mb-1.5">
          Nachname <span className="text-wine-red">*</span>
        </label>
        <input
          type="text"
          value={address.lastName}
          onChange={(e) => onChange("lastName", e.target.value)}
          className={inputClass(`${kind}.lastName`)}
        />
        {errors[`${kind}.lastName`] && <p className="text-red-500 text-xs mt-1">{errors[`${kind}.lastName`]}</p>}
      </div>
      <div className="sm:col-span-2">
        <label className="block text-[10px] font-bold uppercase tracking-widest text-dark/40 mb-1.5">
          Straße und Hausnummer <span className="text-wine-red">*</span>
        </label>
        <input
          type="text"
          value={address.street}
          onChange={(e) => onChange("street", e.target.value)}
          className={inputClass(`${kind}.street`)}
        />
        {errors[`${kind}.street`] && <p className="text-red-500 text-xs mt-1">{errors[`${kind}.street`]}</p>}
      </div>
      <div>
        <label className="block text-[10px] font-bold uppercase tracking-widest text-dark/40 mb-1.5">
          PLZ <span className="text-wine-red">*</span>
        </label>
        <input
          type="text"
          value={address.postalCode}
          onChange={(e) => onChange("postalCode", e.target.value)}
          className={inputClass(`${kind}.postalCode`)}
        />
        {errors[`${kind}.postalCode`] && <p className="text-red-500 text-xs mt-1">{errors[`${kind}.postalCode`]}</p>}
      </div>
      <div>
        <label className="block text-[10px] font-bold uppercase tracking-widest text-dark/40 mb-1.5">
          Stadt <span className="text-wine-red">*</span>
        </label>
        <input
          type="text"
          value={address.city}
          onChange={(e) => onChange("city", e.target.value)}
          className={inputClass(`${kind}.city`)}
        />
        {errors[`${kind}.city`] && <p className="text-red-500 text-xs mt-1">{errors[`${kind}.city`]}</p>}
      </div>
      {includeEmail && (
        <div className="sm:col-span-2">
          <label className="block text-[10px] font-bold uppercase tracking-widest text-dark/40 mb-1.5">
            E-Mail <span className="text-wine-red">*</span>
            <span className="ml-2 text-dark/30 normal-case font-normal tracking-normal text-xs">
              (für die Zahlungsbestätigung)
            </span>
          </label>
          <input
            type="email"
            value={address.email}
            onChange={(e) => onChange("email", e.target.value)}
            className={inputClass(`${kind}.email`)}
          />
          {errors[`${kind}.email`] && <p className="text-red-500 text-xs mt-1">{errors[`${kind}.email`]}</p>}
        </div>
      )}
    </div>
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-8" noValidate>
      {/* Wert */}
      <div>
        <label className="block text-[10px] font-bold uppercase tracking-widest text-dark/40 mb-2">
          Wert in € <span className="text-wine-red">*</span>
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {VOUCHER_VALUES.map((val) => {
            const active = wert === val
            return (
              <button
                key={val}
                type="button"
                onClick={() => setWert(val)}
                className={cn(
                  "rounded-lg px-4 py-3 text-base font-bold border-2 transition-all font-condensed",
                  active
                    ? "bg-wine-red text-white border-wine-red"
                    : "bg-[#ECE9CF] text-dark border-transparent hover:border-wine-red/30"
                )}
              >
                {val} €
              </button>
            )
          })}
        </div>
      </div>

      {/* Anzahl */}
      <div>
        <label className="block text-[10px] font-bold uppercase tracking-widest text-dark/40 mb-2">
          Anzahl Gutscheine <span className="text-wine-red">*</span>
        </label>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(MIN_QUANTITY, q - 1))}
            disabled={quantity <= MIN_QUANTITY}
            aria-label="Anzahl verringern"
            className="w-11 h-11 rounded-lg bg-[#ECE9CF] text-wine-red font-bold text-xl hover:bg-wine-red hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#ECE9CF] disabled:hover:text-wine-red"
          >
            −
          </button>
          <span className="min-w-[3rem] text-center text-lg font-bold text-dark font-condensed">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.min(MAX_QUANTITY, q + 1))}
            disabled={quantity >= MAX_QUANTITY}
            aria-label="Anzahl erhöhen"
            className="w-11 h-11 rounded-lg bg-[#ECE9CF] text-wine-red font-bold text-xl hover:bg-wine-red hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#ECE9CF] disabled:hover:text-wine-red"
          >
            +
          </button>
        </div>
      </div>

      {/* Lieferung */}
      <div>
        <label className="block text-[10px] font-bold uppercase tracking-widest text-dark/40 mb-2">
          Lieferung <span className="text-wine-red">*</span>
        </label>
        <div className="flex gap-4">
          {(["email", "post"] as const).map((val) => (
            <label
              key={val}
              className={cn(
                "flex-1 flex items-center gap-3 px-4 py-3.5 rounded-lg border-2 cursor-pointer transition-all font-condensed text-sm",
                form.lieferung === val
                  ? "border-wine-red bg-wine-red/5 text-dark font-bold"
                  : "border-transparent bg-[#ECE9CF] text-dark/60 hover:border-wine-red/30"
              )}
            >
              <input
                type="radio"
                name="lieferung"
                value={val}
                checked={form.lieferung === val}
                onChange={() => updateForm("lieferung", val)}
                className="accent-wine-red"
              />
              {val === "email" ? "Per E-Mail" : "Per Post (Postkarte)"}
            </label>
          ))}
        </div>
      </div>

      {/* Empfänger */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-dark/40 mb-1.5">
            Empfänger Name <span className="text-wine-red">*</span>
          </label>
          <input
            type="text"
            value={form.empfaengerName}
            onChange={(e) => updateForm("empfaengerName", e.target.value)}
            placeholder="Für wen ist der Gutschein?"
            className={inputClass("empfaengerName")}
          />
          {errors.empfaengerName && <p className="text-red-500 text-xs mt-1">{errors.empfaengerName}</p>}
        </div>
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-dark/40 mb-1.5">
            Empfänger E-Mail <span className="text-dark/30 normal-case font-normal tracking-normal text-xs">(optional)</span>
          </label>
          <input
            type="email"
            value={form.empfaengerEmail}
            onChange={(e) => updateForm("empfaengerEmail", e.target.value)}
            placeholder="empfaenger@mail.de"
            className={inputClass("empfaengerEmail")}
          />
          {errors.empfaengerEmail && <p className="text-red-500 text-xs mt-1">{errors.empfaengerEmail}</p>}
        </div>
      </div>

      {/* Absender */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-dark/40 mb-1.5">
            Ihr Name <span className="text-wine-red">*</span>
          </label>
          <input
            type="text"
            value={form.absenderName}
            onChange={(e) => updateForm("absenderName", e.target.value)}
            placeholder="Ihr vollständiger Name"
            className={inputClass("absenderName")}
          />
          {errors.absenderName && <p className="text-red-500 text-xs mt-1">{errors.absenderName}</p>}
        </div>
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-dark/40 mb-1.5">
            Ihre E-Mail <span className="text-wine-red">*</span>
          </label>
          <input
            type="email"
            value={form.absenderEmail}
            onChange={(e) => updateForm("absenderEmail", e.target.value)}
            placeholder="ihre@mail.de"
            className={inputClass("absenderEmail")}
          />
          {errors.absenderEmail && <p className="text-red-500 text-xs mt-1">{errors.absenderEmail}</p>}
        </div>
      </div>

      {/* Rechnungsadresse */}
      <div className="space-y-4 pt-4 border-t border-dark/8">
        <h3 className="text-lg font-bold text-wine-red">Rechnungsadresse</h3>
        {addressFields("billing", billing, updateBilling, true)}
      </div>

      {/* Lieferadresse — only when postal delivery */}
      {form.lieferung === "post" && (
        <div className="space-y-4 pt-4 border-t border-dark/8">
          <h3 className="text-lg font-bold text-wine-red">Lieferadresse</h3>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={deliverySameAsBilling}
              onChange={(e) => setDeliverySameAsBilling(e.target.checked)}
              className="mt-1 w-5 h-5 rounded border-dark/20 text-wine-red focus:ring-wine-red/20 bg-[#ECE9CF] shrink-0"
            />
            <span className="text-sm text-dark/80 font-condensed leading-snug">
              Lieferadresse ist identisch mit Rechnungsadresse
            </span>
          </label>
          {!deliverySameAsBilling && addressFields("delivery", delivery, updateDelivery, false)}
        </div>
      )}

      {serverError && (
        <p className="text-red-600 text-sm font-condensed">{serverError}</p>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-3 bg-wine-red hover:bg-garnet-red text-white font-bold uppercase tracking-tight text-sm px-12 py-5 rounded-xl transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Weiterleitung…" : "Zur Zahlung"}
          {!isSubmitting && <Send className="w-4 h-4" aria-hidden="true" />}
        </button>
      </div>
    </form>
  )
}
