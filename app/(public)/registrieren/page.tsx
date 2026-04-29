"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"

interface FormData {
  firstName: string
  lastName: string
  email: string
  password: string
  passwordConfirm: string
  street: string
  postalCode: string
  city: string
  country: string
  agb: boolean
  datenschutz: boolean
}

type FieldErrors = Partial<Record<keyof FormData, string>>

export default function RegistrierenPage() {
  const router = useRouter()
  const [form, setForm] = useState<FormData>({
    firstName: "", lastName: "", email: "",
    password: "", passwordConfirm: "",
    street: "", postalCode: "", city: "", country: "Deutschland",
    agb: false, datenschutz: false,
  })
  const [errors, setErrors] = useState<FieldErrors>({})
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formError, setFormError] = useState("")

  function validate(): FieldErrors {
    const e: FieldErrors = {}
    if (!form.firstName.trim()) e.firstName = "Pflichtfeld"
    if (!form.lastName.trim()) e.lastName = "Pflichtfeld"
    if (!form.email.trim()) e.email = "Pflichtfeld"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Ungültige E-Mail"
    if (!form.password) e.password = "Pflichtfeld"
    else if (form.password.length < 8) e.password = "Mindestens 8 Zeichen"
    if (!form.passwordConfirm) e.passwordConfirm = "Pflichtfeld"
    else if (form.password !== form.passwordConfirm) e.passwordConfirm = "Passwörter stimmen nicht überein"
    if (!form.street.trim()) e.street = "Pflichtfeld"
    if (!form.postalCode.trim()) e.postalCode = "Pflichtfeld"
    if (!form.city.trim()) e.city = "Pflichtfeld"
    if (!form.agb) e.agb = "Bitte akzeptieren Sie die AGB"
    if (!form.datenschutz) e.datenschutz = "Pflichtfeld"
    return e
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault()
    setSubmitted(true)
    setFormError("")
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          first_name: form.firstName,
          last_name: form.lastName,
        },
      },
    })

    if (error) {
      setFormError(
        error.message.includes("already registered")
          ? "Diese E-Mail-Adresse ist bereits registriert."
          : "Registrierung fehlgeschlagen. Bitte versuchen Sie es erneut."
      )
      setLoading(false)
      return
    }

    router.push("/konto/buchungen")
    router.refresh()
  }

  function set(field: keyof FormData, value: string | boolean) {
    setForm((p) => ({ ...p, [field]: value }))
    if (submitted) setErrors((p) => { const n = { ...p }; delete n[field]; return n })
  }

  const inputClass = (field: keyof FormData) =>
    cn(
      "w-full bg-[#ECE9CF] border-2 outline-none transition-colors rounded-lg py-3 px-4 text-dark placeholder:text-dark/30 font-condensed",
      submitted && errors[field] ? "border-red-500" : "border-transparent focus:border-wine-red"
    )

  const labelClass = "block text-[10px] font-bold uppercase tracking-widest text-dark/40 mb-1.5"

  return (
    <div className="bg-light-beige min-h-screen flex flex-col">
      <main className="flex-grow flex items-center justify-center py-32 px-4">
        <div className="max-w-[560px] w-full space-y-10">
          {/* Header */}
          <div className="space-y-3">
            <h1 className="text-5xl font-bold text-wine-red tracking-tight leading-none">
              Konto erstellen
            </h1>
            <p className="text-lg text-dark/50 max-w-md font-condensed leading-relaxed">
              Verfolgen Sie Ihre Buchungen und sparen Sie Zeit beim nächsten Buchen.
            </p>
          </div>

          {/* Form card */}
          <div className="bg-white rounded-xl p-8 md:p-12 shadow-[0_32px_64px_-12px_rgba(91,0,18,0.08)] border border-dark/5">
            {formError && (
              <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm font-condensed">{formError}</p>
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              {/* Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>Vorname</label>
                  <input type="text" value={form.firstName} onChange={(e) => set("firstName", e.target.value)}
                    placeholder="Vorname" className={inputClass("firstName")} />
                  {submitted && errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                </div>
                <div>
                  <label className={labelClass}>Nachname</label>
                  <input type="text" value={form.lastName} onChange={(e) => set("lastName", e.target.value)}
                    placeholder="Nachname" className={inputClass("lastName")} />
                  {submitted && errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                </div>
              </div>

              {/* Email */}
              <div>
                <label className={labelClass}>E-Mail</label>
                <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)}
                  placeholder="beispiel@mail.de" className={inputClass("email")} autoComplete="email" />
                {submitted && errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              {/* Password */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>Passwort</label>
                  <input type="password" value={form.password} onChange={(e) => set("password", e.target.value)}
                    placeholder="Min. 8 Zeichen" className={inputClass("password")} autoComplete="new-password" />
                  {submitted && errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                </div>
                <div>
                  <label className={labelClass}>Bestätigen</label>
                  <input type="password" value={form.passwordConfirm} onChange={(e) => set("passwordConfirm", e.target.value)}
                    placeholder="Passwort wiederholen" className={inputClass("passwordConfirm")} autoComplete="new-password" />
                  {submitted && errors.passwordConfirm && <p className="text-red-500 text-xs mt-1">{errors.passwordConfirm}</p>}
                </div>
              </div>

              {/* Address */}
              <div className="pt-2 space-y-5">
                <div>
                  <label className={labelClass}>Straße und Hausnummer</label>
                  <input type="text" value={form.street} onChange={(e) => set("street", e.target.value)}
                    placeholder="Musterstraße 12" className={inputClass("street")} />
                  {submitted && errors.street && <p className="text-red-500 text-xs mt-1">{errors.street}</p>}
                </div>
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass}>PLZ</label>
                    <input type="text" value={form.postalCode} onChange={(e) => set("postalCode", e.target.value)}
                      placeholder="60385" className={inputClass("postalCode")} />
                    {submitted && errors.postalCode && <p className="text-red-500 text-xs mt-1">{errors.postalCode}</p>}
                  </div>
                  <div>
                    <label className={labelClass}>Stadt</label>
                    <input type="text" value={form.city} onChange={(e) => set("city", e.target.value)}
                      placeholder="Frankfurt" className={inputClass("city")} />
                    {submitted && errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Land</label>
                  <select value={form.country} onChange={(e) => set("country", e.target.value)}
                    className={cn(inputClass("country"), "appearance-none")}>
                    <option>Deutschland</option>
                    <option>Österreich</option>
                    <option>Schweiz</option>
                  </select>
                </div>
              </div>

              {/* Checkboxes */}
              <div className="space-y-4 pt-2">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={form.agb} onChange={(e) => set("agb", e.target.checked)}
                    className="mt-0.5 w-5 h-5 rounded border-dark/20 text-wine-red focus:ring-wine-red/20 bg-[#ECE9CF] shrink-0" />
                  <span className="text-sm text-dark/60 font-condensed leading-snug">
                    Ich akzeptiere die{" "}
                    <Link href="/agb" className="text-wine-red font-bold underline" target="_blank">AGB</Link>
                  </span>
                </label>
                {submitted && errors.agb && <p className="text-red-500 text-xs -mt-2 pl-8">{errors.agb}</p>}

                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={form.datenschutz} onChange={(e) => set("datenschutz", e.target.checked)}
                    className="mt-0.5 w-5 h-5 rounded border-dark/20 text-wine-red focus:ring-wine-red/20 bg-[#ECE9CF] shrink-0" />
                  <span className="text-sm text-dark/60 font-condensed leading-snug">
                    Ich habe die{" "}
                    <Link href="/datenschutz" className="text-wine-red font-bold underline" target="_blank">Datenschutzerklärung</Link>
                    {" "}gelesen
                  </span>
                </label>
                {submitted && errors.datenschutz && <p className="text-red-500 text-xs -mt-2 pl-8">{errors.datenschutz}</p>}
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-wine-red hover:bg-garnet-red text-white font-bold py-4 rounded-xl transition-colors duration-200 active:scale-95 shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? "Konto wird erstellt…" : "Konto erstellen"}
                </button>
              </div>
            </form>

            <div className="mt-8 flex items-center gap-4">
              <div className="flex-grow h-px bg-dark/10" />
              <span className="text-xs font-bold uppercase tracking-widest text-dark/20 font-condensed">Oder</span>
              <div className="flex-grow h-px bg-dark/10" />
            </div>

            <div className="mt-6 text-center">
              <Link href="/login" className="text-wine-red font-bold hover:underline underline-offset-4 font-condensed text-sm">
                Bereits ein Konto? Anmelden
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
