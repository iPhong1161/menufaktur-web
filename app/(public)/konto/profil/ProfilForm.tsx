"use client"

import { useRef, useState, useTransition } from "react"
import { CheckCircle2, Loader2 } from "lucide-react"
import type { Database } from "@/types/database"

type Profile = Database["public"]["Tables"]["profiles"]["Row"] | null

interface Props {
  profile: Profile
  email: string
  saveAction: (formData: FormData) => Promise<void>
}

const inputClass =
  "w-full px-4 py-3 rounded-lg bg-[#F8F5DA] border-2 border-transparent outline-none transition-colors text-dark placeholder:text-dark/30 focus:border-wine-red text-sm font-condensed"

const readonlyClass =
  "w-full px-4 py-3 rounded-lg bg-dark/5 border-2 border-transparent text-dark/50 text-sm font-condensed cursor-not-allowed"

export function ProfilForm({ profile, email, saveAction }: Props) {
  const [saved, setSaved] = useState(false)
  const [isPending, startTransition] = useTransition()
  const formRef = useRef<HTMLFormElement>(null)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    setSaved(false)
    startTransition(async () => {
      await saveAction(formData)
      setSaved(true)
    })
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
      {saved && (
        <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl px-5 py-4">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <p className="text-sm font-medium text-emerald-700">
            Ihre Daten wurden erfolgreich gespeichert.
          </p>
        </div>
      )}

      {/* Personal details */}
      <section className="bg-white rounded-xl p-8 border border-dark/5 shadow-sm">
        <h2 className="text-sm font-bold uppercase tracking-widest text-dark/40 mb-6">
          Persönliche Daten
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-dark/40 mb-2">
              Vorname
            </label>
            <input
              type="text"
              name="first_name"
              defaultValue={profile?.first_name ?? ""}
              placeholder="Vorname"
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-dark/40 mb-2">
              Nachname
            </label>
            <input
              type="text"
              name="last_name"
              defaultValue={profile?.last_name ?? ""}
              placeholder="Nachname"
              className={inputClass}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-dark/40 mb-2">
              E-Mail-Adresse
              <span className="ml-2 normal-case tracking-normal font-normal text-dark/30">(kann nicht geändert werden)</span>
            </label>
            <input
              type="email"
              value={email}
              readOnly
              className={readonlyClass}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-dark/40 mb-2">
              Telefon
            </label>
            <input
              type="tel"
              name="phone"
              defaultValue={profile?.phone ?? ""}
              placeholder="+49 69 123 456"
              className={inputClass}
            />
          </div>
        </div>
      </section>

      {/* Address */}
      <section className="bg-white rounded-xl p-8 border border-dark/5 shadow-sm">
        <h2 className="text-sm font-bold uppercase tracking-widest text-dark/40 mb-6">
          Adresse
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="sm:col-span-2">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-dark/40 mb-2">
              Straße und Hausnummer
            </label>
            <input
              type="text"
              name="address_line1"
              defaultValue={profile?.address_line1 ?? ""}
              placeholder="Musterstraße 1"
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-dark/40 mb-2">
              Postleitzahl
            </label>
            <input
              type="text"
              name="postal_code"
              defaultValue={profile?.postal_code ?? ""}
              placeholder="60385"
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-dark/40 mb-2">
              Stadt
            </label>
            <input
              type="text"
              name="city"
              defaultValue={profile?.city ?? ""}
              placeholder="Frankfurt am Main"
              className={inputClass}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-dark/40 mb-2">
              Land
            </label>
            <select
              name="country"
              defaultValue={profile?.country ?? "DE"}
              className={inputClass}
            >
              <option value="DE">Deutschland</option>
              <option value="AT">Österreich</option>
              <option value="CH">Schweiz</option>
              <option value="LU">Luxemburg</option>
            </select>
          </div>
        </div>
      </section>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="px-8 py-3 bg-wine-red hover:bg-garnet-red disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-colors flex items-center gap-2"
        >
          {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
          {isPending ? "Speichern…" : "Änderungen speichern"}
        </button>
      </div>
    </form>
  )
}
