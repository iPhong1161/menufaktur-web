"use client"

import { useState } from "react"
import Link from "next/link"
import { CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"

export default function PasswortZuruecksetzenPage() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault()
    setSubmitted(true)
    if (!email.trim()) { setError("Pflichtfeld"); return }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError("Ungültige E-Mail-Adresse"); return }

    setLoading(true)
    const supabase = createClient()
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/konto/passwort-aendern`,
    })
    // Always show success to avoid email enumeration
    setSuccess(true)
  }

  return (
    <div className="bg-light-beige min-h-screen flex flex-col">
      <main className="flex-grow flex items-center justify-center px-4 pt-32 pb-20">
        <div className="w-full max-w-[480px]">
          <div className="bg-white rounded-xl p-10 shadow-[0_32px_64px_-12px_rgba(91,0,18,0.08)] border border-dark/5">
            {success ? (
              <div className="flex flex-col items-center text-center gap-5 py-8">
                <div className="w-16 h-16 bg-wine-red rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-white fill-white" />
                </div>
                <h2 className="text-2xl font-bold text-wine-red">E-Mail verschickt</h2>
                <p className="text-dark/50 font-condensed leading-relaxed max-w-sm">
                  Falls ein Konto mit dieser E-Mail-Adresse existiert, erhalten Sie in Kürze
                  einen Link zum Zurücksetzen Ihres Passworts.
                </p>
                <Link
                  href="/login"
                  className="mt-2 text-wine-red font-bold hover:underline underline-offset-4 font-condensed text-sm"
                >
                  Zurück zur Anmeldung
                </Link>
              </div>
            ) : (
              <>
                <div className="text-center mb-10">
                  <h1 className="text-3xl font-bold text-wine-red tracking-tight mb-2">
                    Passwort zurücksetzen
                  </h1>
                  <p className="text-dark/50 font-condensed text-sm leading-relaxed max-w-xs mx-auto">
                    Geben Sie Ihre E-Mail-Adresse ein und wir senden Ihnen einen Link zum
                    Zurücksetzen Ihres Passworts.
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
                      onChange={(e) => { setEmail(e.target.value); if (submitted) setError("") }}
                      placeholder="Geben Sie Ihre E-Mail ein"
                      className={cn(
                        "w-full px-4 py-4 rounded-lg bg-[#ECE9CF] border-2 outline-none transition-colors text-dark placeholder:text-dark/30 font-condensed",
                        submitted && error ? "border-red-500" : "border-transparent focus:border-wine-red"
                      )}
                      autoComplete="email"
                    />
                    {submitted && error && <p className="text-red-500 text-xs mt-1">{error}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-wine-red hover:bg-garnet-red text-white font-bold rounded-xl transition-colors duration-200 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? "Wird gesendet…" : "Link anfordern"}
                  </button>
                </form>

                <div className="mt-8 text-center">
                  <Link
                    href="/login"
                    className="text-wine-red font-bold hover:underline underline-offset-4 font-condensed text-sm"
                  >
                    Zurück zur Anmeldung
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
