"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronRight, Eye, ImagePlus, Save } from "lucide-react"

export default function AdminKursNeuPage() {
  const [status, setStatus] = useState<"draft" | "publish">("draft")

  const inputClass = "w-full bg-[#ECE9CF] border-none border-b-2 border-dark/20 focus:border-wine-red focus:outline-none rounded-t-lg px-4 py-4 text-dark placeholder:text-dark/30 font-condensed transition-colors"
  const labelClass = "block text-[10px] font-bold uppercase tracking-widest text-wine-red/70 mb-2"

  return (
      <main className="flex-grow pt-20 pb-24">
        <div className="max-w-screen-xl mx-auto px-8 pt-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 mb-6 text-sm font-condensed text-dark/40">
            <Link href="/admin/kurse" className="hover:text-wine-red transition-colors">Kurse</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-wine-red font-bold">Neuer Kurs</span>
          </nav>

          <div className="mb-8">
            <h1 className="text-4xl font-bold text-wine-red tracking-tight">Neuer Kurs</h1>
            <p className="text-dark/50 font-condensed mt-1 max-w-2xl leading-relaxed">
              Gestalten Sie ein neues kulinarisches Erlebnis. Füllen Sie die Details sorgfältig aus, um Ihre Gäste zu inspirieren.
            </p>
          </div>

          {/* Content + sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10 items-start">
            {/* Left */}
            <div className="space-y-8">
              {/* General info */}
              <section className="bg-white p-10 rounded-xl shadow-sm space-y-7">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                  <div>
                    <label className={labelClass}>Titel des Kurses</label>
                    <input type="text" placeholder="Geben Sie den Titel ein" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Slug (URL)</label>
                    <div className="flex items-center bg-[#ECE9CF] rounded-t-lg border-b-2 border-dark/20">
                      <span className="pl-4 text-dark/40 font-mono text-xs">/kurse/</span>
                      <input type="text" placeholder="titel-des-kurses" className="flex-grow bg-transparent border-none focus:outline-none px-1 py-4 text-sm font-mono text-dark placeholder:text-dark/30" />
                    </div>
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Beschreibung</label>
                  <textarea
                    rows={6}
                    placeholder="Beschreiben Sie das Erlebnis, die Techniken und das Menü..."
                    className="w-full bg-[#ECE9CF] border-none border-b-2 border-dark/20 focus:border-wine-red focus:outline-none rounded-t-lg px-4 py-4 text-dark placeholder:text-dark/30 font-condensed transition-colors resize-none leading-relaxed"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                  <div>
                    <label className={labelClass}>Trainer</label>
                    <input type="text" placeholder="Name des Trainers" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Kategorie</label>
                    <select className={inputClass}>
                      <option value="">Bitte wählen</option>
                      <option>Pasta & Teigwaren</option>
                      <option>Fleisch & Wild</option>
                      <option>Fisch & Meeresfrüchte</option>
                      <option>Backen & Patisserie</option>
                      <option>Vegetarisch & Vegan</option>
                      <option>International</option>
                    </select>
                  </div>
                </div>
              </section>

              {/* Media upload */}
              <section className="bg-white p-10 rounded-xl shadow-sm">
                <label className={labelClass}>Kursfoto</label>
                <div className="border-2 border-dashed border-dark/15 rounded-xl p-12 flex flex-col items-center justify-center gap-4 hover:bg-[#F8F5DA] transition-colors cursor-pointer">
                  <div className="w-14 h-14 bg-wine-red/5 rounded-full flex items-center justify-center">
                    <ImagePlus className="w-7 h-7 text-wine-red/40" />
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-wine-red text-sm">Klicken zum Hochladen</p>
                    <p className="text-xs text-dark/40 font-condensed mt-1">oder Foto hierher ziehen (JPG, PNG bis 5MB)</p>
                  </div>
                </div>
              </section>

              {/* What's included */}
              <section className="bg-white p-10 rounded-xl shadow-sm space-y-5">
                <h3 className="font-bold text-wine-red text-sm uppercase tracking-widest">Leistungen</h3>
                {["Inklusive Leistung 1", "Inklusive Leistung 2", "Inklusive Leistung 3"].map((ph, i) => (
                  <input key={i} type="text" placeholder={ph} className={inputClass} />
                ))}
                <button className="text-wine-red text-sm font-bold hover:underline underline-offset-4 font-condensed">
                  + Leistung hinzufügen
                </button>
              </section>
            </div>

            {/* Right sidebar */}
            <aside className="space-y-6">
              {/* Publish */}
              <div className="bg-white p-6 rounded-xl shadow-sm space-y-4">
                <h3 className="font-bold text-wine-red flex items-center gap-2 text-sm">
                  <Eye className="w-4 h-4" /> Veröffentlichung
                </h3>
                <div className="space-y-2">
                  {(["draft", "publish"] as const).map((val) => (
                    <label key={val} className="flex items-center gap-3 p-3 bg-[#fdfadf] rounded-lg cursor-pointer hover:bg-[#F8F5DA] transition-colors">
                      <input type="radio" name="status" checked={status === val} onChange={() => setStatus(val)} className="text-wine-red focus:ring-wine-red h-4 w-4" />
                      <span className="text-sm font-condensed font-bold text-dark/70">
                        {val === "draft" ? "Entwurf" : "Sofort veröffentlichen"}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Date/time */}
              <div className="bg-white p-6 rounded-xl shadow-sm space-y-4">
                <h3 className="font-bold text-wine-red text-sm uppercase tracking-widest">Termin</h3>
                <div>
                  <label className={labelClass}>Datum</label>
                  <input type="date" className="w-full bg-[#ECE9CF] border-none rounded-lg px-4 py-3 text-sm text-dark focus:outline-none focus:ring-2 focus:ring-wine-red/20 font-condensed" />
                </div>
                <div>
                  <label className={labelClass}>Uhrzeit (Beginn)</label>
                  <input type="time" className="w-full bg-[#ECE9CF] border-none rounded-lg px-4 py-3 text-sm text-dark focus:outline-none focus:ring-2 focus:ring-wine-red/20 font-condensed" />
                </div>
                <div>
                  <label className={labelClass}>Uhrzeit (Ende)</label>
                  <input type="time" className="w-full bg-[#ECE9CF] border-none rounded-lg px-4 py-3 text-sm text-dark focus:outline-none focus:ring-2 focus:ring-wine-red/20 font-condensed" />
                </div>
              </div>

              {/* Price & capacity */}
              <div className="bg-white p-6 rounded-xl shadow-sm space-y-4">
                <h3 className="font-bold text-wine-red text-sm uppercase tracking-widest">Preis & Kapazität</h3>
                <div>
                  <label className={labelClass}>Preis pro Person (€)</label>
                  <input type="number" placeholder="0,00" min={0} className="w-full bg-[#ECE9CF] border-none rounded-lg px-4 py-3 text-sm text-dark focus:outline-none focus:ring-2 focus:ring-wine-red/20 font-condensed" />
                </div>
                <div>
                  <label className={labelClass}>Max. Teilnehmer</label>
                  <input type="number" placeholder="12" min={1} max={60} className="w-full bg-[#ECE9CF] border-none rounded-lg px-4 py-3 text-sm text-dark focus:outline-none focus:ring-2 focus:ring-wine-red/20 font-condensed" />
                </div>
              </div>

              {/* Save button */}
              <button className="w-full bg-wine-red hover:bg-garnet-red text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2">
                <Save className="w-4 h-4" />
                {status === "draft" ? "Als Entwurf speichern" : "Kurs veröffentlichen"}
              </button>
            </aside>
          </div>
        </div>
      </main>
  )
}
