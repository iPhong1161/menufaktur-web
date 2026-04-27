"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [code, setCode] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  function validate() {
    const e: Record<string, string> = {}
    if (!email.trim()) e.email = "Pflichtfeld"
    if (!password) e.password = "Pflichtfeld"
    if (!code.trim()) e.code = "Pflichtfeld"
    return e
  }

  function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault()
    setSubmitted(true)
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length > 0) return
    console.log("[AdminLogin] Submit:", { email })
    router.push("/admin/dashboard")
  }

  const fieldClass = (field: string) =>
    cn(
      "w-full bg-[#ECE9CF] border-none border-b-2 rounded-t-lg px-4 py-4 text-dark placeholder:text-dark/30 outline-none transition-colors font-condensed",
      submitted && errors[field] ? "border-b-2 border-red-500" : "focus:border-b-2 focus:border-wine-red"
    )

  return (
    <div className="bg-light-beige min-h-screen flex flex-col items-center justify-center p-6">
      {/* Decorative blobs */}
      <div className="fixed -bottom-24 -right-24 w-96 h-96 bg-wine-red/5 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed -top-24 -left-24 w-64 h-64 bg-garnet-red/5 rounded-full blur-3xl pointer-events-none" />

      <main className="w-full max-w-md relative">
        {/* Logo */}
        <div className="flex flex-col items-center mb-12">
          <p className="text-wine-red text-3xl font-bold tracking-widest uppercase mb-2">
            menufaktur
          </p>
          <div className="h-px w-12 bg-wine-red/20" />
        </div>

        {/* Card */}
        <section className="bg-white rounded-xl p-10 shadow-[0_32px_64px_-12px_rgba(91,0,18,0.06)] border border-dark/5">
          <h1 className="text-2xl font-bold text-wine-red mb-8 text-center tracking-tight">
            Admin Anmeldung
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-dark/40 mb-2">
                E-Mail-Adresse
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); if (submitted) setErrors((p) => ({ ...p, email: "" })) }}
                placeholder="Geben Sie Ihre E-Mail ein"
                className={fieldClass("email")}
                autoComplete="email"
              />
              {submitted && errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-dark/40 mb-2">
                Passwort
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); if (submitted) setErrors((p) => ({ ...p, password: "" })) }}
                placeholder="Geben Sie Ihr Passwort ein"
                className={fieldClass("password")}
                autoComplete="current-password"
              />
              {submitted && errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-dark/40 mb-2">
                2FA Code
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => { setCode(e.target.value); if (submitted) setErrors((p) => ({ ...p, code: "" })) }}
                placeholder="6-stelliger Code"
                className={fieldClass("code")}
                autoComplete="one-time-code"
                maxLength={6}
              />
              {submitted && errors.code ? (
                <p className="text-red-500 text-xs mt-1">{errors.code}</p>
              ) : (
                <p className="text-dark/40 text-[10px] mt-1.5 font-condensed italic">
                  Bitte geben Sie den Sicherheitscode aus Ihrer Authenticator-App ein.
                </p>
              )}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-wine-red hover:bg-garnet-red text-white font-bold py-4 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2 group"
              >
                Anmelden
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="text-center">
              <a href="#" className="text-wine-red text-sm font-bold hover:underline underline-offset-4 font-condensed">
                Passwort vergessen?
              </a>
            </div>
          </form>
        </section>

        <footer className="mt-10 text-center">
          <p className="text-[10px] text-dark/30 tracking-widest uppercase font-condensed">
            © menufaktur · Admin-Bereich
          </p>
        </footer>
      </main>
    </div>
  )
}
