"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [submitted, setSubmitted] = useState(false)

  function validate() {
    const e: typeof errors = {}
    if (!email.trim()) e.email = "Pflichtfeld"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Ungültige E-Mail-Adresse"
    if (!password) e.password = "Pflichtfeld"
    return e
  }

  function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault()
    setSubmitted(true)
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length > 0) return
    console.log("[Login] Submit:", { email })
    router.push("/konto")
  }

  const inputClass = (field: "email" | "password") =>
    cn(
      "w-full px-4 py-4 rounded-lg bg-[#ECE9CF] border-2 outline-none transition-colors text-dark placeholder:text-dark/30",
      submitted && errors[field] ? "border-red-500" : "border-transparent focus:border-wine-red"
    )

  return (
    <div className="bg-light-beige min-h-screen flex flex-col">
      <main className="flex-grow flex items-center justify-center px-4 pt-32 pb-20">
        <div className="w-full max-w-[480px]">
          {/* Card */}
          <div className="bg-white rounded-xl p-10 shadow-[0_32px_64px_-12px_rgba(91,0,18,0.08)] border border-dark/5">
            <div className="text-center mb-10">
              <h1 className="text-4xl font-bold text-wine-red tracking-tight mb-2">
                Anmelden
              </h1>
              <p className="text-dark/50 font-condensed">
                Willkommen zurück in der menufaktur.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-dark/40 mb-2">
                  E-Mail-Adresse
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); if (submitted) setErrors((p) => ({ ...p, email: undefined })) }}
                  placeholder="Geben Sie Ihre E-Mail ein"
                  className={inputClass("email")}
                  autoComplete="email"
                />
                {submitted && errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-dark/40">
                    Passwort
                  </label>
                  <Link
                    href="/passwort-zuruecksetzen"
                    className="text-xs font-bold text-wine-red hover:underline underline-offset-4"
                  >
                    Passwort vergessen?
                  </Link>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); if (submitted) setErrors((p) => ({ ...p, password: undefined })) }}
                  placeholder="Ihr Passwort"
                  className={inputClass("password")}
                  autoComplete="current-password"
                />
                {submitted && errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-4 bg-wine-red hover:bg-garnet-red text-white font-bold rounded-xl transition-colors duration-200 shadow-lg active:scale-95"
                >
                  Anmelden
                </button>
              </div>
            </form>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-dark/10" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-dark/30 italic font-condensed">oder</span>
              </div>
            </div>

            <div className="text-center">
              <p className="text-dark/50 font-condensed text-sm">
                Noch kein Konto?{" "}
                <Link
                  href="/registrieren"
                  className="text-wine-red font-bold hover:underline underline-offset-4 ml-1"
                >
                  Jetzt registrieren
                </Link>
              </p>
            </div>
          </div>

          <div className="mt-8 text-center px-6">
            <p className="text-[10px] text-dark/30 tracking-widest uppercase leading-relaxed font-condensed">
              menufaktur standard<br />
              Exklusive Rezepte &bull; Kochkurse &bull; Community
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
