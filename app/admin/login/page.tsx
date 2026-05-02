"use client"

import { Suspense, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowRight, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"

function AdminLoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isUnauthorised = searchParams.get("unauthorised") === "1"

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)

  function validate() {
    const e: Record<string, string> = {}
    if (!email.trim()) e.email = "Pflichtfeld"
    if (!password) e.password = "Pflichtfeld"
    return e
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault()
    setSubmitted(true)
    setAuthError(null)

    const errs = validate()
    setFieldErrors(errs)
    if (Object.keys(errs).length > 0) return

    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)

    if (error) {
      setAuthError("Ungültige E-Mail-Adresse oder Passwort.")
      return
    }

    // Middleware will verify admin_users on arrival at /admin/dashboard
    router.push("/admin/dashboard")
  }

  const fieldClass = (field: string) =>
    cn(
      "w-full bg-[#ECE9CF] border-none border-b-2 rounded-t-lg px-4 py-4 text-dark placeholder:text-dark/30 outline-none transition-colors font-condensed",
      submitted && fieldErrors[field]
        ? "border-b-2 border-red-500"
        : "focus:border-b-2 focus:border-wine-red"
    )

  return (
    <div className="bg-light-beige min-h-screen flex flex-col items-center justify-center p-6">
      <div className="fixed -bottom-24 -right-24 w-96 h-96 bg-wine-red/5 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed -top-24 -left-24 w-64 h-64 bg-garnet-red/5 rounded-full blur-3xl pointer-events-none" />

      <main className="w-full max-w-md relative">
        <div className="flex flex-col items-center mb-12">
          <p className="text-wine-red text-3xl font-bold tracking-widest uppercase mb-2">
            menufaktur
          </p>
          <div className="h-px w-12 bg-wine-red/20" />
        </div>

        {isUnauthorised && (
          <div className="mb-6 flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
            <p className="text-sm text-red-700 font-condensed">
              Ihr Konto hat keinen Admin-Zugang. Bitte wenden Sie sich an den Administrator.
            </p>
          </div>
        )}

        <section className="bg-white rounded-xl p-10 shadow-[0_32px_64px_-12px_rgba(91,0,18,0.06)] border border-dark/5">
          <h1 className="text-2xl font-bold text-wine-red mb-8 text-center tracking-tight">
            Admin Anmeldung
          </h1>

          {authError && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
              <p className="text-sm text-red-700 font-condensed">{authError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-dark/40 mb-2">
                E-Mail-Adresse
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (submitted) setFieldErrors((p) => ({ ...p, email: "" }))
                }}
                placeholder="Geben Sie Ihre E-Mail ein"
                className={fieldClass("email")}
                autoComplete="email"
                disabled={loading}
              />
              {submitted && fieldErrors.email && (
                <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-dark/40 mb-2">
                Passwort
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  if (submitted) setFieldErrors((p) => ({ ...p, password: "" }))
                }}
                placeholder="Geben Sie Ihr Passwort ein"
                className={fieldClass("password")}
                autoComplete="current-password"
                disabled={loading}
              />
              {submitted && fieldErrors.password && (
                <p className="text-red-500 text-xs mt-1">{fieldErrors.password}</p>
              )}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-wine-red hover:bg-garnet-red disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2 group"
              >
                {loading ? "Anmelden …" : "Anmelden"}
                {!loading && (
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                )}
              </button>
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

export default function AdminLoginPage() {
  return (
    <Suspense>
      <AdminLoginForm />
    </Suspense>
  )
}
