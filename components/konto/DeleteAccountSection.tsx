"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { AlertTriangle } from "lucide-react"
import { deleteAccountAction } from "@/app/(public)/konto/profil/actions"

export function DeleteAccountSection() {
  const [confirming, setConfirming] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  function handleDelete() {
    setError(null)
    startTransition(async () => {
      const result = await deleteAccountAction()
      if ("error" in result) {
        setError(result.error)
        setConfirming(false)
      } else {
        router.push("/")
      }
    })
  }

  return (
    <section className="mt-12 border-t border-red-100 pt-10">
      <h2 className="text-sm font-bold uppercase tracking-widest text-red-400 mb-2">
        Gefahrenzone
      </h2>
      <p className="text-sm text-dark/50 font-condensed mb-6">
        Ihr Konto und alle persönlichen Daten werden unwiderruflich gelöscht.
      </p>

      {!confirming ? (
        <button
          onClick={() => setConfirming(true)}
          className="px-6 py-2.5 border-2 border-red-300 text-red-500 hover:bg-red-50 font-bold rounded-xl text-sm transition-colors"
        >
          Konto löschen
        </button>
      ) : (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 space-y-5 max-w-xl">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <p className="text-sm text-red-800 leading-relaxed">
              Ihre persönlichen Daten werden unwiderruflich gelöscht. Ihre Buchungshistorie
              bleibt aus gesetzlichen Gründen anonymisiert erhalten.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleDelete}
              disabled={isPending}
              className="px-5 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold rounded-xl text-sm transition-colors"
            >
              {isPending ? "Wird gelöscht…" : "Ja, Konto löschen"}
            </button>
            <button
              onClick={() => setConfirming(false)}
              disabled={isPending}
              className="px-5 py-2.5 bg-dark/8 hover:bg-dark/12 disabled:opacity-50 text-dark/60 font-bold rounded-xl text-sm transition-colors"
            >
              Abbrechen
            </button>
          </div>
        </div>
      )}

      {error && (
        <p className="mt-4 text-sm text-red-600 font-condensed">{error}</p>
      )}
    </section>
  )
}
