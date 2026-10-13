"use client"

import { useState } from "react"
import { X, Eye, EyeOff, CheckCircle, Copy } from "lucide-react"
import { createAdminCustomer } from "@/app/admin/kunden/actions"

interface Props {
  onClose: () => void
}

type Result = { email: string; password: string }

const PAYMENT_OPTIONS = [
  { value: "", label: "Keine Angabe" },
  { value: "card", label: "Kreditkarte" },
  { value: "bank_transfer", label: "Banküberweisung" },
]

export function CreateCustomerModal({ onClose }: Props) {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<Result | null>(null)
  const [copied, setCopied] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const fd = new FormData(e.currentTarget)
    const result = await createAdminCustomer({
      first_name: fd.get("first_name") as string,
      last_name: fd.get("last_name") as string,
      email: fd.get("email") as string,
      password: fd.get("password") as string,
      phone: fd.get("phone") as string,
      address_line1: fd.get("address_line1") as string,
      postal_code: fd.get("postal_code") as string,
      city: fd.get("city") as string,
      preferred_payment_method: fd.get("preferred_payment_method") as string,
    })

    setLoading(false)
    if ("error" in result) {
      setError(result.error)
    } else {
      setSuccess({ email: result.email, password: result.password })
    }
  }

  function copyCredentials(email: string, password: string) {
    navigator.clipboard.writeText(`E-Mail: ${email}\nPasswort: ${password}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-dark/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-dark/8">
          <h2 className="text-2xl font-bold text-wine-red">Kunde anlegen</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-dark/5 text-dark/40 hover:text-dark transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {success ? (
          /* Success state */
          <div className="px-8 py-10 space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-dark mb-1">Konto erfolgreich angelegt</h3>
              <p className="text-dark/50 font-condensed">
                Notieren Sie die Zugangsdaten für den Kunden.
              </p>
            </div>
            <div className="bg-[#F8F5DA] rounded-xl p-6 text-left space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold uppercase tracking-widest text-dark/40">Zugangsdaten</span>
                <button
                  onClick={() => copyCredentials(success.email, success.password)}
                  className="flex items-center gap-1.5 text-xs font-bold text-wine-red hover:text-garnet-red transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                  {copied ? "Kopiert!" : "Kopieren"}
                </button>
              </div>
              <div className="font-mono text-sm space-y-1">
                <p><span className="text-dark/40">E-Mail:   </span><span className="font-bold text-dark">{success.email}</span></p>
                <p><span className="text-dark/40">Passwort: </span><span className="font-bold text-dark">{success.password}</span></p>
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
          <form onSubmit={handleSubmit} className="px-8 py-6 space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
                {error}
              </div>
            )}

            {/* Name row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-dark/50">
                  Vorname <span className="text-garnet-red">*</span>
                </label>
                <input
                  name="first_name"
                  required
                  className="w-full px-4 py-3 bg-[#F8F5DA] rounded-lg text-sm text-dark focus:outline-none focus:ring-2 focus:ring-wine-red/30 font-condensed"
                  placeholder="Maria"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-dark/50">
                  Nachname <span className="text-garnet-red">*</span>
                </label>
                <input
                  name="last_name"
                  required
                  className="w-full px-4 py-3 bg-[#F8F5DA] rounded-lg text-sm text-dark focus:outline-none focus:ring-2 focus:ring-wine-red/30 font-condensed"
                  placeholder="Mustermann"
                />
              </div>
            </div>

            {/* Email + Password */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-dark/50">
                  E-Mail <span className="text-garnet-red">*</span>
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  className="w-full px-4 py-3 bg-[#F8F5DA] rounded-lg text-sm text-dark focus:outline-none focus:ring-2 focus:ring-wine-red/30 font-condensed"
                  placeholder="maria@beispiel.de"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-dark/50">
                  Temporäres Passwort <span className="text-garnet-red">*</span>
                </label>
                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={8}
                    className="w-full px-4 py-3 pr-11 bg-[#F8F5DA] rounded-lg text-sm text-dark focus:outline-none focus:ring-2 focus:ring-wine-red/30 font-condensed"
                    placeholder="min. 8 Zeichen"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-dark/30 hover:text-dark/60"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-dark/50">Telefon</label>
              <input
                name="phone"
                type="tel"
                className="w-full px-4 py-3 bg-[#F8F5DA] rounded-lg text-sm text-dark focus:outline-none focus:ring-2 focus:ring-wine-red/30 font-condensed"
                placeholder="+49 69 123 456"
              />
            </div>

            {/* Address */}
            <div className="space-y-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-dark/50">Adresse</p>
              <input
                name="address_line1"
                className="w-full px-4 py-3 bg-[#F8F5DA] rounded-lg text-sm text-dark focus:outline-none focus:ring-2 focus:ring-wine-red/30 font-condensed"
                placeholder="Straße und Hausnummer"
              />
              <div className="grid grid-cols-3 gap-4">
                <input
                  name="postal_code"
                  className="px-4 py-3 bg-[#F8F5DA] rounded-lg text-sm text-dark focus:outline-none focus:ring-2 focus:ring-wine-red/30 font-condensed"
                  placeholder="PLZ"
                />
                <input
                  name="city"
                  className="col-span-2 px-4 py-3 bg-[#F8F5DA] rounded-lg text-sm text-dark focus:outline-none focus:ring-2 focus:ring-wine-red/30 font-condensed"
                  placeholder="Stadt"
                />
              </div>
            </div>

            {/* Payment method */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-dark/50">
                Bevorzugte Zahlungsart
              </label>
              <select
                name="preferred_payment_method"
                className="w-full px-4 py-3 bg-[#F8F5DA] rounded-lg text-sm text-dark focus:outline-none focus:ring-2 focus:ring-wine-red/30 font-condensed appearance-none"
              >
                {PAYMENT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>

            {/* Actions */}
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
                {loading ? "Wird angelegt…" : "Kunde anlegen"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
