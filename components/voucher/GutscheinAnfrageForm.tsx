"use client"

import { useState, useTransition } from "react"
import { Send, CheckCircle, Info } from "lucide-react"
import { cn } from "@/lib/utils"
import { submitContactFormAction } from "@/app/actions/contact"

interface FormData {
  wert: string
  empfaengerName: string
  empfaengerEmail: string
  lieferung: "email" | "post"
  absenderName: string
  absenderEmail: string
  nachricht: string
}

type FieldErrors = Partial<Record<keyof FormData, string>>

export function GutscheinAnfrageForm() {
  const [form, setForm] = useState<FormData>({
    wert: "",
    empfaengerName: "",
    empfaengerEmail: "",
    lieferung: "email",
    absenderName: "",
    absenderEmail: "",
    nachricht: "",
  })
  const [errors, setErrors] = useState<FieldErrors>({})
  const [submitted, setSubmitted] = useState(false)
  const [success, setSuccess] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function validate(): FieldErrors {
    const e: FieldErrors = {}
    const wertNum = parseFloat(form.wert)
    if (!form.wert) e.wert = "Pflichtfeld"
    else if (isNaN(wertNum) || wertNum < 10) e.wert = "Mindestbetrag: 10 €"
    if (!form.empfaengerName.trim()) e.empfaengerName = "Pflichtfeld"
    if (!form.absenderName.trim()) e.absenderName = "Pflichtfeld"
    if (!form.absenderEmail.trim()) {
      e.absenderEmail = "Pflichtfeld"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.absenderEmail)) {
      e.absenderEmail = "Ungültige E-Mail-Adresse"
    }
    if (form.empfaengerEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.empfaengerEmail)) {
      e.empfaengerEmail = "Ungültige E-Mail-Adresse"
    }
    return e
  }

  function update(field: keyof FormData, value: string) {
    setForm((p) => ({ ...p, [field]: value }))
    if (submitted) setErrors((p) => { const n = { ...p }; delete n[field]; return n })
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(true)
    setServerError(null)
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    const lieferungLabel = form.lieferung === "email" ? "Per E-Mail" : "Per Post (Postkarte)"
    const subject = `Gutschein-Anfrage: ${form.wert} € für ${form.empfaengerName} (${lieferungLabel})`
    const message = [
      `Wert: ${form.wert} €`,
      `Empfänger: ${form.empfaengerName}`,
      `Empfänger E-Mail: ${form.empfaengerEmail || "–"}`,
      `Lieferung: ${lieferungLabel}`,
      `Absender: ${form.absenderName}`,
      `Absender E-Mail: ${form.absenderEmail}`,
      `Persönliche Nachricht: ${form.nachricht.trim() || "–"}`,
    ].join("\n")

    startTransition(async () => {
      const result = await submitContactFormAction({
        name: form.absenderName,
        email: form.absenderEmail,
        subject,
        message,
      })
      if ("error" in result) {
        setServerError(result.error)
      } else {
        setSuccess(true)
      }
    })
  }

  const inputClass = (field: keyof FormData) =>
    cn(
      "w-full bg-[#ECE9CF] rounded-lg px-4 py-3.5 text-dark text-base outline-none transition-all border-2 font-condensed",
      errors[field] ? "border-red-500" : "border-transparent focus:border-wine-red"
    )

  if (success) {
    return (
      <div className="flex flex-col items-center text-center gap-5 py-12">
        <div className="w-16 h-16 bg-wine-red rounded-full flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-white fill-white" />
        </div>
        <h3 className="text-2xl font-bold text-wine-red">Anfrage eingegangen!</h3>
        <p className="text-dark/60 font-condensed text-lg max-w-sm leading-relaxed">
          Ihre Gutschein-Anfrage ist eingegangen. Wir melden uns in Kürze mit den
          Zahlungsdetails bei Ihnen.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {/* Notice */}
      <div className="flex gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
        <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" aria-hidden="true" />
        <p className="text-sm text-amber-800 font-condensed leading-relaxed">
          <span className="font-bold">Online-Zahlung folgt in Kürze.</span> Gutschein-Bestellungen
          werden derzeit manuell bearbeitet. Nach Eingang Ihrer Anfrage erhalten Sie von uns
          die Bankdaten zur Überweisung.
        </p>
      </div>

      {/* Wert */}
      <div>
        <label className="block text-[10px] font-bold uppercase tracking-widest text-dark/40 mb-1.5">
          Wert in € <span className="text-wine-red">*</span>
        </label>
        <input
          type="number"
          min={10}
          step="1"
          value={form.wert}
          onChange={(e) => update("wert", e.target.value)}
          placeholder="z.B. 109"
          className={inputClass("wert")}
        />
        {errors.wert && <p className="text-red-500 text-xs mt-1">{errors.wert}</p>}
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
                onChange={() => update("lieferung", val)}
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
            onChange={(e) => update("empfaengerName", e.target.value)}
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
            onChange={(e) => update("empfaengerEmail", e.target.value)}
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
            onChange={(e) => update("absenderName", e.target.value)}
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
            onChange={(e) => update("absenderEmail", e.target.value)}
            placeholder="ihre@mail.de"
            className={inputClass("absenderEmail")}
          />
          {errors.absenderEmail && <p className="text-red-500 text-xs mt-1">{errors.absenderEmail}</p>}
        </div>
      </div>

      {/* Persönliche Nachricht */}
      <div>
        <label className="block text-[10px] font-bold uppercase tracking-widest text-dark/40 mb-1.5">
          Persönliche Nachricht <span className="text-dark/30 normal-case font-normal tracking-normal text-xs">(optional)</span>
        </label>
        <textarea
          value={form.nachricht}
          onChange={(e) => update("nachricht", e.target.value)}
          placeholder="Eine persönliche Botschaft für den Gutschein…"
          rows={3}
          className={cn(inputClass("nachricht"), "resize-none")}
        />
      </div>

      {serverError && (
        <p className="text-red-600 text-sm font-condensed">{serverError}</p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex items-center gap-3 bg-wine-red hover:bg-garnet-red text-white font-bold uppercase tracking-tight text-sm px-12 py-5 rounded-xl transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isPending ? "Wird gesendet…" : "Anfrage senden"}
        {!isPending && <Send className="w-4 h-4" aria-hidden="true" />}
      </button>
    </form>
  )
}
