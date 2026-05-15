"use client"

import { useState, useTransition } from "react"
import {
  subscribeNewsletterAction,
  unsubscribeNewsletterAction,
} from "@/app/(public)/konto/profil/newsletter-actions"

interface Props {
  isSubscribed: boolean
}

export function NewsletterToggle({ isSubscribed: initial }: Props) {
  const [subscribed, setSubscribed] = useState(initial)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState("")

  function handleToggle() {
    const next = !subscribed
    setSubscribed(next)
    setError("")

    startTransition(async () => {
      const result = next
        ? await subscribeNewsletterAction()
        : await unsubscribeNewsletterAction()

      if ("error" in result) {
        setSubscribed(!next)
        setError(result.error)
      }
    })
  }

  return (
    <div className="bg-white rounded-xl border border-dark/8 shadow-sm p-8 max-w-xl">
      <div className="flex items-center justify-between gap-6">
        <div>
          <p className="font-bold text-dark">Newsletter abonnieren</p>
          <p className="text-sm text-dark/50 font-condensed mt-0.5">
            Erhalten Sie exklusive Rezepte und Kurstermine
          </p>
        </div>

        <button
          role="switch"
          aria-checked={subscribed}
          onClick={handleToggle}
          disabled={isPending}
          className={[
            "relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-wine-red/40 disabled:opacity-50",
            subscribed ? "bg-wine-red" : "bg-dark/20",
          ].join(" ")}
        >
          <span
            className={[
              "pointer-events-none inline-block h-6 w-6 rounded-full bg-white shadow-sm transition-transform duration-200",
              subscribed ? "translate-x-5" : "translate-x-0",
            ].join(" ")}
          />
        </button>
      </div>

      {error && (
        <p className="mt-3 text-sm text-red-600 font-condensed">{error}</p>
      )}
    </div>
  )
}
