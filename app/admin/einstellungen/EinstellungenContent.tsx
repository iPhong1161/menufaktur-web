"use client"

import { useState } from "react"
import { User, Lock, Bell, Settings, Camera, Save, ShieldCheck } from "lucide-react"
import { AdminBackButton } from "@/components/admin/AdminBackButton"
import { cn } from "@/lib/utils"
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder"

type Tab = "profil" | "passwort" | "benachrichtigungen" | "system"

const TABS: { key: Tab; icon: typeof User; label: string }[] = [
  { key: "profil", icon: User, label: "Profil" },
  { key: "passwort", icon: Lock, label: "Passwort" },
  { key: "benachrichtigungen", icon: Bell, label: "Benachrichtigungen" },
  { key: "system", icon: Settings, label: "System" },
]

const inputClass = "w-full bg-[#F8F5DA] border-0 border-b-2 border-dark/15 focus:border-wine-red focus:outline-none px-4 py-3 rounded-t-lg transition-colors font-condensed text-dark"

export function EinstellungenContent({ role }: { role: "admin" | "moderator" }) {
  const [tab, setTab] = useState<Tab>("profil")

  return (
      <main className="flex-grow pt-32 pb-20 px-8 max-w-screen-xl mx-auto w-full">
        <AdminBackButton role={role} />
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-wine-red tracking-tight mb-1">Einstellungen</h1>
          <p className="text-dark/50 text-lg font-condensed">Konto und Systemeinstellungen</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar tabs */}
          <aside className="w-full lg:w-56 flex flex-col space-y-1">
            {TABS.map(({ key, icon: Icon, label }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={cn(
                  "flex items-center gap-4 px-6 py-4 rounded-xl transition-all text-left",
                  tab === key
                    ? "bg-wine-red text-white font-bold"
                    : "text-dark/50 hover:bg-[#ECE9CF] font-condensed"
                )}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span className="text-base">{label}</span>
              </button>
            ))}
          </aside>

          {/* Content */}
          <div className="flex-grow">
            {tab === "profil" && (
              <div className="space-y-8">
                <div className="bg-white rounded-2xl p-10 shadow-sm border border-dark/5">
                  <div className="flex flex-col md:flex-row gap-10">
                    {/* Avatar */}
                    <div className="flex flex-col items-center gap-4 shrink-0">
                      <div className="relative group">
                        <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-[#ECE9CF]">
                          <ImagePlaceholder label="admin/profile-photo.jpg" className="w-full h-full" />
                        </div>
                        <button className="absolute bottom-0 right-0 bg-wine-red text-white p-3 rounded-full shadow-lg hover:scale-105 transition-transform">
                          <Camera className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="text-center">
                        <p className="font-bold text-wine-red text-sm">Profilbild</p>
                        <p className="text-[10px] text-dark/30 uppercase tracking-widest font-condensed mt-0.5">
                          JPG oder PNG, max. 2 MB
                        </p>
                      </div>
                    </div>

                    {/* Form */}
                    <div className="flex-grow space-y-7">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-widest text-dark/40 mb-2 font-condensed">Vorname</label>
                          <input type="text" defaultValue="Maximilian" className={inputClass} />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-widest text-dark/40 mb-2 font-condensed">Nachname</label>
                          <input type="text" defaultValue="von Berching" className={inputClass} />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-dark/40 mb-2 font-condensed">E-Mail-Adresse</label>
                        <input type="email" defaultValue="m.berching@menufaktur.de" className={inputClass} />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-dark/40 mb-2 font-condensed">Telefonnummer</label>
                        <input type="tel" defaultValue="+49 176 12345678" className={inputClass} />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-dark/40 mb-2 font-condensed">Kurzbiografie</label>
                        <textarea
                          rows={4}
                          defaultValue="Küchenmeister und Sommelier mit Leidenschaft für die alpine Sterneküche. Seit 2018 im menufaktur-Atelier tätig."
                          className={cn(inputClass, "resize-none leading-relaxed")}
                        />
                      </div>
                      <div className="pt-4 border-t border-dark/8 flex justify-end">
                        <button className="bg-wine-red text-white px-10 py-4 rounded-xl font-bold hover:bg-garnet-red transition-colors flex items-center gap-2">
                          <Save className="w-4 h-4" />
                          Speichern
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2FA info */}
                <div className="p-8 bg-[#F8F5DA] rounded-2xl flex flex-col sm:flex-row items-start sm:items-center gap-6 border border-dark/5">
                  <div className="bg-garnet-red/10 p-4 rounded-xl shrink-0">
                    <ShieldCheck className="w-7 h-7 text-garnet-red" />
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-bold text-dark">Zweistufige Verifizierung</h4>
                    <p className="text-dark/50 font-condensed text-sm mt-0.5">
                      Schützen Sie Ihr Konto zusätzlich mit einer Bestätigung per Mobiltelefon.
                    </p>
                  </div>
                  <button className="text-wine-red font-bold hover:underline underline-offset-4 text-sm font-condensed shrink-0">
                    Aktivieren
                  </button>
                </div>
              </div>
            )}

            {tab === "passwort" && (
              <div className="bg-white rounded-2xl p-10 shadow-sm border border-dark/5 space-y-7 max-w-lg">
                <h2 className="text-2xl font-bold text-wine-red">Passwort ändern</h2>
                {[
                  { label: "Aktuelles Passwort", placeholder: "••••••••" },
                  { label: "Neues Passwort", placeholder: "Min. 8 Zeichen" },
                  { label: "Passwort bestätigen", placeholder: "Wiederholen" },
                ].map(({ label, placeholder }) => (
                  <div key={label}>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-dark/40 mb-2 font-condensed">{label}</label>
                    <input type="password" placeholder={placeholder} className={inputClass} />
                  </div>
                ))}
                <div className="pt-4 border-t border-dark/8 flex justify-end">
                  <button className="bg-wine-red text-white px-8 py-4 rounded-xl font-bold hover:bg-garnet-red transition-colors flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    Passwort aktualisieren
                  </button>
                </div>
              </div>
            )}

            {(tab === "benachrichtigungen" || tab === "system") && (
              <div className="bg-white rounded-2xl p-10 shadow-sm border border-dark/5">
                <h2 className="text-2xl font-bold text-wine-red mb-6">
                  {tab === "benachrichtigungen" ? "Benachrichtigungen" : "Systemeinstellungen"}
                </h2>
                <div className="space-y-5">
                  {(tab === "benachrichtigungen"
                    ? ["Neue Buchung eingegangen", "Zahlung bestätigt", "Buchung storniert", "Neuer Gutschein verkauft", "Newsletter-Anmeldung"]
                    : ["Wartungsmodus aktivieren", "Kurskalender öffentlich", "Gast-Buchungen erlauben", "Gutschein-Verkauf aktiv"]
                  ).map((label) => (
                    <label key={label} className="flex items-center justify-between p-5 bg-[#F8F5DA] rounded-xl cursor-pointer hover:bg-[#ECE9CF] transition-colors">
                      <span className="font-bold text-dark text-sm">{label}</span>
                      <div className="w-11 h-6 bg-wine-red rounded-full relative">
                        <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                      </div>
                    </label>
                  ))}
                </div>
                <div className="pt-8 border-t border-dark/8 flex justify-end mt-8">
                  <button className="bg-wine-red text-white px-8 py-4 rounded-xl font-bold hover:bg-garnet-red transition-colors flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    Einstellungen speichern
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
  )
}
