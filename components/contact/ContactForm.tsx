"use client"

import { useState } from "react"
import { Send, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface FormData {
  name: string
  email: string
  subject: string
  message: string
}

export function ContactForm() {
  const [form, setForm] = useState<FormData>({ name: "", email: "", subject: "", message: "" })
  const [errors, setErrors] = useState<Partial<FormData>>({})
  const [submitted, setSubmitted] = useState(false)
  const [success, setSuccess] = useState(false)

  function validate(): Partial<FormData> {
    const e: Partial<FormData> = {}
    if (!form.name.trim()) e.name = "Pflichtfeld"
    if (!form.email.trim()) {
      e.email = "Pflichtfeld"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = "Ungültige E-Mail-Adresse"
    }
    if (!form.message.trim()) e.message = "Pflichtfeld"
    return e
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(true)
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length > 0) return
    console.log("[ContactForm] Message submitted:", form)
    setSuccess(true)
  }

  function update(field: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (submitted) setErrors((prev) => { const n = { ...prev }; delete n[field]; return n })
  }

  const inputClass = (field: keyof FormData) =>
    cn(
      "w-full bg-[#ECE9CF] rounded-lg px-4 py-3.5 text-dark text-base outline-none transition-all border-2",
      errors[field] ? "border-red-500" : "border-transparent focus:border-wine-red"
    )

  if (success) {
    return (
      <div className="bg-white p-10 md:p-14 rounded-xl shadow-sm flex flex-col items-center text-center gap-5 py-24">
        <div className="w-16 h-16 bg-wine-red rounded-full flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-white fill-white" />
        </div>
        <h3 className="text-2xl font-bold text-wine-red">Vielen Dank für Ihre Nachricht!</h3>
        <p className="text-dark/60 font-condensed text-lg max-w-sm leading-relaxed">
          Wir melden uns in Kürze bei Ihnen. Bis dahin freuen wir uns auf Ihren Besuch in
          der menufaktur.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white p-10 md:p-14 rounded-xl shadow-sm">
      <form onSubmit={handleSubmit} className="space-y-7" noValidate>
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-dark/40 mb-2">
            Ihr Name
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="Vorname Nachname"
            className={inputClass("name")}
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-dark/40 mb-2">
            E-Mail-Adresse
          </label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="beispiel@mail.de"
            className={inputClass("email")}
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-dark/40 mb-2">
            Betreff
          </label>
          <input
            type="text"
            value={form.subject}
            onChange={(e) => update("subject", e.target.value)}
            placeholder="Wie können wir Ihnen helfen?"
            className={inputClass("subject")}
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-dark/40 mb-2">
            Ihre Nachricht
          </label>
          <textarea
            value={form.message}
            onChange={(e) => update("message", e.target.value)}
            placeholder="Ihre Nachricht an uns…"
            rows={5}
            className={cn(inputClass("message"), "resize-none")}
          />
          {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className="inline-flex items-center gap-3 bg-wine-red hover:bg-garnet-red text-white font-bold uppercase tracking-tight text-sm px-12 py-5 rounded-xl transition-colors duration-200"
          >
            Nachricht senden
            <Send className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </form>
    </div>
  )
}
