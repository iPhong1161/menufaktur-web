"use client"

import { Lock, Save } from "lucide-react"
import { AdminBackButton } from "@/components/admin/AdminBackButton"
import { cn } from "@/lib/utils"

const inputClass = "w-full bg-[#F8F5DA] border-0 border-b-2 border-dark/15 focus:border-wine-red focus:outline-none px-4 py-3 rounded-t-lg transition-colors font-condensed text-dark"

export function EinstellungenContent({ role }: { role: "admin" | "moderator" }) {
  return (
    <main className="flex-grow pt-32 pb-20 px-8 max-w-screen-xl mx-auto w-full">
      <AdminBackButton role={role} />
      <div className="mb-12 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-wine-red/10 flex items-center justify-center shrink-0">
          <Lock className="w-6 h-6 text-wine-red" />
        </div>
        <div>
          <h1 className="text-5xl font-bold text-wine-red tracking-tight mb-1">Passwort ändern</h1>
          <p className="text-dark/50 text-lg font-condensed">Kontopasswort aktualisieren</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-10 shadow-sm border border-dark/5 space-y-7 max-w-lg">
        <h2 className="text-2xl font-bold text-wine-red">Passwort ändern</h2>
        {[
          { label: "Aktuelles Passwort", placeholder: "••••••••" },
          { label: "Neues Passwort", placeholder: "Min. 8 Zeichen" },
          { label: "Passwort bestätigen", placeholder: "Wiederholen" },
        ].map(({ label, placeholder }) => (
          <div key={label}>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-dark/40 mb-2 font-condensed">{label}</label>
            <input type="password" placeholder={placeholder} className={cn(inputClass)} />
          </div>
        ))}
        <div className="pt-4 border-t border-dark/8 flex justify-end">
          <button className="bg-wine-red text-white px-8 py-4 rounded-xl font-bold hover:bg-garnet-red transition-colors flex items-center gap-2">
            <Save className="w-4 h-4" />
            Passwort aktualisieren
          </button>
        </div>
      </div>
    </main>
  )
}
