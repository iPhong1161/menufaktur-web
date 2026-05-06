"use client"

import { useState } from "react"
import { X, CheckCircle, Copy } from "lucide-react"
import { createAdminVoucherAction, type CreateAdminVoucherResult } from "@/app/admin/gutscheine/actions"

function defaultExpiry(): string {
  const d = new Date()
  d.setFullYear(d.getFullYear() + 3)
  return d.toISOString().split("T")[0]
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" })
}

export function CreateVoucherModal({ onClose }: { onClose: () => void }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<CreateAdminVoucherResult | null>(null)
  const [copied, setCopied] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const fd = new FormData(e.currentTarget)
    const result = await createAdminVoucherAction({
      value: parseFloat(fd.get("value") as string),
      recipient_name: fd.get("recipient_name") as string,
      recipient_email: fd.get("recipient_email") as string,
      expires_at: fd.get("expires_at") as string,
      personal_message: fd.get("personal_message") as string,
    })
    setLoading(false)
    if ("error" in result) {
      setError(result.error)
    } else {
      setSuccess(result)
    }
  }

  function handleCopy() {
    if (!success) return
    navigator.clipboard.writeText(success.code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-dark/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-dark/8">
          <h2 className="text-2xl font-bold text-wine-red">Neuer Gutschein</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-dark/5 text-dark/40 hover:text-dark transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {success ? (
          /* Success state */
          <div className="px-8 py-10 space-y-6">
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-dark mb-1">Gutschein erstellt</h3>
                <p className="text-dark/50 font-condensed text-sm">
                  Notieren Sie die folgenden Details für den Kunden.
                </p>
              </div>
            </div>

            <div className="bg-[#F8F5DA] rounded-xl p-6 space-y-4">
              {/* Code — prominent with copy */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-dark/40 mb-2">Gutscheincode</p>
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono text-2xl font-bold text-wine-red tracking-widest">
                    {success.code}
                  </span>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 text-xs font-bold text-wine-red hover:text-garnet-red transition-colors shrink-0"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    {copied ? "Kopiert!" : "Kopieren"}
                  </button>
                </div>
              </div>

              <div className="border-t border-dark/10 pt-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-dark/40 mb-1">Wert</p>
                  <p className="font-bold text-dark text-lg">
                    {success.value.toFixed(2).replace(".", ",")} €
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-dark/40 mb-1">Gültig bis</p>
                  <p className="font-bold text-dark text-lg">{formatDate(success.expires_at)}</p>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-4 bg-wine-red hover:bg-garnet-red text-white rounded-xl font-bold transition-colors"
            >
              Schließen
            </button>
          </div>
        ) : (
          /* Form state */
          <form onSubmit={handleSubmit} className="px-8 py-6 space-y-5">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-dark/50">
                  Wert (€) <span className="text-garnet-red">*</span>
                </label>
                <input
                  name="value"
                  type="number"
                  step="0.01"
                  min="1"
                  required
                  placeholder="50.00"
                  className="w-full px-4 py-3 bg-[#F8F5DA] rounded-lg text-sm text-dark focus:outline-none focus:ring-2 focus:ring-wine-red/30 font-condensed"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-dark/50">
                  Ablaufdatum <span className="text-garnet-red">*</span>
                </label>
                <input
                  name="expires_at"
                  type="date"
                  required
                  defaultValue={defaultExpiry()}
                  className="w-full px-4 py-3 bg-[#F8F5DA] rounded-lg text-sm text-dark focus:outline-none focus:ring-2 focus:ring-wine-red/30 font-condensed"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-dark/50">
                Empfänger Name <span className="text-garnet-red">*</span>
              </label>
              <input
                name="recipient_name"
                type="text"
                required
                placeholder="Maria Mustermann"
                className="w-full px-4 py-3 bg-[#F8F5DA] rounded-lg text-sm text-dark focus:outline-none focus:ring-2 focus:ring-wine-red/30 font-condensed"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-dark/50">
                Empfänger E-Mail
              </label>
              <input
                name="recipient_email"
                type="email"
                placeholder="maria@beispiel.de"
                className="w-full px-4 py-3 bg-[#F8F5DA] rounded-lg text-sm text-dark focus:outline-none focus:ring-2 focus:ring-wine-red/30 font-condensed"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-dark/50">
                Notiz
              </label>
              <input
                name="personal_message"
                type="text"
                placeholder="z.B. Stornierung MF-2026-00123, 50%"
                className="w-full px-4 py-3 bg-[#F8F5DA] rounded-lg text-sm text-dark focus:outline-none focus:ring-2 focus:ring-wine-red/30 font-condensed"
              />
            </div>

            <div className="flex gap-4 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-4 bg-[#F8F5DA] hover:bg-[#ECE9CF] text-dark/70 rounded-xl font-bold transition-colors"
              >
                Abbrechen
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-4 bg-wine-red hover:bg-garnet-red text-white rounded-xl font-bold transition-colors disabled:opacity-60"
              >
                {loading ? "Wird erstellt…" : "Gutschein erstellen"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
