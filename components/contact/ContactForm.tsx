"use client"

import { useState, useTransition } from "react"
import { Send, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { submitContactFormAction } from "@/app/actions/contact"
import { CONTACT_CATEGORIES, NO_COURSE_OPTION } from "@/lib/contact-categories"

interface FormData {
  name: string
  company: string
  email: string
  category: string
  courseTitle: string
  bookingNumber: string
  message: string
}

interface ContactFormProps {
  /** Titles of upcoming published courses, for the Kurs select. */
  courseTitles?: string[]
  initialCategory?: string
  initialCourseTitle?: string
  initialBookingNumber?: string
  initialMessage?: string
}

export function ContactForm({
  courseTitles = [],
  initialCategory = "",
  initialCourseTitle = "",
  initialBookingNumber = "",
  initialMessage = "",
}: ContactFormProps) {
  const [form, setForm] = useState<FormData>({
    name: "",
    company: "",
    email: "",
    category: initialCategory,
    // Only preselect a course we actually offer, otherwise fall back to the default.
    courseTitle: courseTitles.includes(initialCourseTitle) ? initialCourseTitle : NO_COURSE_OPTION,
    bookingNumber: initialBookingNumber,
    message: initialMessage,
  })
  const [errors, setErrors] = useState<Partial<FormData>>({})
  const [submitted, setSubmitted] = useState(false)
  const [success, setSuccess] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function validate(): Partial<FormData> {
    const e: Partial<FormData> = {}
    if (!form.name.trim()) e.name = "Pflichtfeld"
    if (!form.email.trim()) {
      e.email = "Pflichtfeld"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = "Ungültige E-Mail-Adresse"
    }
    if (!form.category.trim()) e.category = "Pflichtfeld"
    if (!form.message.trim()) e.message = "Pflichtfeld"
    return e
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(true)
    setServerError(null)
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    startTransition(async () => {
      const result = await submitContactFormAction(form)
      if ("error" in result) {
        setServerError(result.error)
      } else {
        setSuccess(true)
      }
    })
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

  const labelClass = "block text-[10px] font-bold uppercase tracking-widest text-dark/40 mb-2"
  const optionalHint = <span className="font-normal normal-case tracking-normal text-dark/40">(optional)</span>

  if (success) {
    return (
      <div className="bg-white p-10 md:p-14 rounded-xl shadow-sm flex flex-col items-center text-center gap-5 py-24">
        <div className="w-16 h-16 bg-wine-red rounded-full flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-white fill-white" />
        </div>
        <h3 className="text-2xl font-bold text-wine-red">Vielen Dank für Ihre Nachricht!</h3>
        <p className="text-dark/60 font-condensed text-lg max-w-sm leading-relaxed">
          Ihre Nachricht wurde gesendet. Wir melden uns so bald wie möglich.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white p-10 md:p-14 rounded-xl shadow-sm">
      <form onSubmit={handleSubmit} className="space-y-7" noValidate>
        <div>
          <label htmlFor="contact-name" className={labelClass}>Ihr Name</label>
          <input
            id="contact-name"
            type="text"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="Vorname Nachname"
            className={inputClass("name")}
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="contact-company" className={labelClass}>Firma {optionalHint}</label>
          <input
            id="contact-company"
            type="text"
            value={form.company}
            onChange={(e) => update("company", e.target.value)}
            placeholder="Firmenname"
            className={inputClass("company")}
          />
        </div>

        <div>
          <label htmlFor="contact-email" className={labelClass}>E-Mail-Adresse</label>
          <input
            id="contact-email"
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="beispiel@mail.de"
            className={inputClass("email")}
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="contact-category" className={labelClass}>Anliegen</label>
          <select
            id="contact-category"
            value={form.category}
            onChange={(e) => update("category", e.target.value)}
            className={cn(inputClass("category"), "cursor-pointer")}
          >
            <option value="">Bitte wählen…</option>
            {CONTACT_CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
        </div>

        {courseTitles.length > 0 && (
          <div>
            <label htmlFor="contact-course" className={labelClass}>Kurs {optionalHint}</label>
            <select
              id="contact-course"
              value={form.courseTitle}
              onChange={(e) => update("courseTitle", e.target.value)}
              className={cn(inputClass("courseTitle"), "cursor-pointer")}
            >
              <option value={NO_COURSE_OPTION}>{NO_COURSE_OPTION}</option>
              {courseTitles.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label htmlFor="contact-booking" className={labelClass}>Buchungsnummer {optionalHint}</label>
          <input
            id="contact-booking"
            type="text"
            value={form.bookingNumber}
            onChange={(e) => update("bookingNumber", e.target.value)}
            placeholder="z. B. MF-2026-00123"
            className={inputClass("bookingNumber")}
          />
        </div>

        <div>
          <label htmlFor="contact-message" className={labelClass}>Ihre Nachricht</label>
          <textarea
            id="contact-message"
            value={form.message}
            onChange={(e) => update("message", e.target.value)}
            placeholder="Ihre Nachricht an uns…"
            rows={5}
            className={cn(inputClass("message"), "resize-none")}
          />
          {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
        </div>

        {serverError && (
          <p className="text-red-600 text-sm font-condensed">{serverError}</p>
        )}

        <div className="pt-2">
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center gap-3 bg-wine-red hover:bg-garnet-red text-white font-bold uppercase tracking-tight text-sm px-12 py-5 rounded-xl transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isPending ? "Wird gesendet…" : "Nachricht senden"}
            {!isPending && <Send className="w-4 h-4" aria-hidden="true" />}
          </button>
        </div>
      </form>
    </div>
  )
}
