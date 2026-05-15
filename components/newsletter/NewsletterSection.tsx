"use client"

import { useRef, useTransition, useState } from "react"
import { subscribeNewsletterAction } from "@/app/actions/newsletter"

export function NewsletterSection() {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMsg, setErrorMsg] = useState("")
  const [isPending, startTransition] = useTransition()
  const inputRef = useRef<HTMLInputElement>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const email = inputRef.current?.value ?? ""
    startTransition(async () => {
      const result = await subscribeNewsletterAction(email)
      if ("error" in result) {
        setErrorMsg(result.error)
        setStatus("error")
      } else {
        setStatus("success")
        if (inputRef.current) inputRef.current.value = ""
      }
    })
  }

  return (
    <section className="bg-wine-red py-20 px-6 md:px-12">
      <div className="max-w-3xl mx-auto text-center space-y-6">
        <span className="text-white/60 tracking-[0.2em] uppercase text-sm font-bold block">
          Newsletter
        </span>
        <h2 className="font-bold text-3xl md:text-4xl text-white leading-tight">
          Bleiben Sie auf dem Laufenden.
        </h2>
        <p className="text-white/70 font-condensed text-lg leading-relaxed">
          Exklusive Rezepte, neue Kurstermine und kulinarische Inspirationen — direkt in
          Ihr Postfach.
        </p>

        {status === "success" ? (
          <div className="bg-white/10 border border-white/20 rounded-xl px-8 py-5 text-white font-bold text-lg">
            Vielen Dank! Sie sind nun angemeldet.
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                ref={inputRef}
                type="email"
                name="email"
                placeholder="Ihre E-Mail-Adresse"
                required
                className="flex-1 px-5 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-white/60 font-condensed text-base"
              />
              <button
                type="submit"
                disabled={isPending}
                className="px-8 py-4 bg-gold-yellow hover:opacity-90 disabled:opacity-60 text-white rounded-xl font-bold text-base transition-opacity shrink-0"
              >
                {isPending ? "..." : "Anmelden"}
              </button>
            </div>
            {status === "error" && (
              <p className="mt-3 text-red-300 text-sm font-condensed">{errorMsg}</p>
            )}
          </form>
        )}
      </div>
    </section>
  )
}
