"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronRight, Eye, ImagePlus, Save, Trash2 } from "lucide-react"
import { useParams } from "next/navigation"

export default function AdminKursBearbeitenPage() {
  const { id } = useParams<{ id: string }>()
  const [status, setStatus] = useState<"draft" | "publish">("publish")

  const inputClass = "w-full bg-[#ECE9CF] border-none border-b-2 border-dark/20 focus:border-wine-red focus:outline-none rounded-t-lg px-4 py-4 text-dark placeholder:text-dark/30 font-condensed transition-colors"
  const labelClass = "block text-[10px] font-bold uppercase tracking-widest text-wine-red/70 mb-2"

  return (
      <main className="flex-grow pt-20 pb-24">
        <div className="max-w-screen-xl mx-auto px-8 pt-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 mb-6 text-sm font-condensed text-dark/40">
            <Link href="/admin/kurse" className="hover:text-wine-red transition-colors">Kurse</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-dark/40 font-mono text-xs">{id}</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-wine-red font-bold">Bearbeiten</span>
          </nav>

          <div className="mb-8 flex items-start justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold text-wine-red tracking-tight">Kurs bearbeiten</h1>
              <p className="text-dark/50 font-condensed mt-1">Änderungen werden sofort nach dem Speichern wirksam.</p>
            </div>
            <button className="flex items-center gap-2 px-5 py-3 border border-red-200 text-red-500 rounded-xl text-sm font-bold hover:bg-red-50 transition-colors font-condensed">
              <Trash2 className="w-4 h-4" />
              Kurs löschen
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10 items-start">
            {/* Left */}
            <div className="space-y-8">
              <section className="bg-white p-10 rounded-xl shadow-sm space-y-7">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                  <div>
                    <label className={labelClass}>Titel des Kurses</label>
                    <input type="text" defaultValue="Handgemachte Pasta Masterclass" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Slug (URL)</label>
                    <div className="flex items-center bg-[#ECE9CF] rounded-t-lg border-b-2 border-dark/20">
                      <span className="pl-4 text-dark/40 font-mono text-xs">/kurse/</span>
                      <input type="text" defaultValue="handgemachte-pasta-masterclass" className="flex-grow bg-transparent border-none focus:outline-none px-1 py-4 text-sm font-mono text-dark" />
                    </div>
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Beschreibung</label>
                  <textarea
                    rows={6}
                    defaultValue="Entdecken Sie die Kunst der handgemachten Pasta in unserem exklusiven Kurs. Von Tagliatelle bis Ravioli — erleben Sie die Freude frischer Pasta aus eigener Hand."
                    className="w-full bg-[#ECE9CF] border-none border-b-2 border-dark/20 focus:border-wine-red focus:outline-none rounded-t-lg px-4 py-4 text-dark font-condensed transition-colors resize-none leading-relaxed"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                  <div>
                    <label className={labelClass}>Trainer</label>
                    <input type="text" defaultValue="Chef Lorenzo Rossi" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Kategorie</label>
                    <select className={inputClass} defaultValue="Pasta & Teigwaren">
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

              <section className="bg-white p-10 rounded-xl shadow-sm">
                <label className={labelClass}>Kursfoto</label>
                <div className="border-2 border-dashed border-dark/15 rounded-xl p-10 flex flex-col items-center justify-center gap-4 hover:bg-[#F8F5DA] transition-colors cursor-pointer bg-[#fdfadf]">
                  <ImagePlus className="w-8 h-8 text-wine-red/30" />
                  <div className="text-center">
                    <p className="font-bold text-wine-red text-sm">Neues Foto hochladen</p>
                    <p className="text-xs text-dark/40 font-condensed mt-1">Aktuelles Bild ersetzen (JPG, PNG bis 5MB)</p>
                  </div>
                </div>
              </section>

              <section className="bg-white p-10 rounded-xl shadow-sm space-y-5">
                <h3 className="font-bold text-wine-red text-sm uppercase tracking-widest">Leistungen</h3>
                {[
                  "Alle Zutaten und Werkzeuge inklusive",
                  "4-gängiges Abendessen mit hausgemachter Pasta",
                  "Rezeptbuch zum Mitnehmen",
                ].map((val, i) => (
                  <input key={i} type="text" defaultValue={val} className={inputClass} />
                ))}
                <button className="text-wine-red text-sm font-bold hover:underline underline-offset-4 font-condensed">
                  + Leistung hinzufügen
                </button>
              </section>
            </div>

            {/* Right sidebar */}
            <aside className="space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-sm space-y-4">
                <h3 className="font-bold text-wine-red flex items-center gap-2 text-sm">
                  <Eye className="w-4 h-4" /> Veröffentlichung
                </h3>
                <div className="space-y-2">
                  {(["draft", "publish"] as const).map((val) => (
                    <label key={val} className="flex items-center gap-3 p-3 bg-[#fdfadf] rounded-lg cursor-pointer hover:bg-[#F8F5DA] transition-colors">
                      <input type="radio" name="status" checked={status === val} onChange={() => setStatus(val)} className="text-wine-red focus:ring-wine-red h-4 w-4" />
                      <span className="text-sm font-condensed font-bold text-dark/70">
                        {val === "draft" ? "Entwurf" : "Veröffentlicht"}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm space-y-4">
                <h3 className="font-bold text-wine-red text-sm uppercase tracking-widest">Termin</h3>
                <div>
                  <label className={labelClass}>Datum</label>
                  <input type="date" defaultValue="2024-10-12" className="w-full bg-[#ECE9CF] border-none rounded-lg px-4 py-3 text-sm text-dark focus:outline-none focus:ring-2 focus:ring-wine-red/20 font-condensed" />
                </div>
                <div>
                  <label className={labelClass}>Uhrzeit (Beginn)</label>
                  <input type="time" defaultValue="18:00" className="w-full bg-[#ECE9CF] border-none rounded-lg px-4 py-3 text-sm text-dark focus:outline-none focus:ring-2 focus:ring-wine-red/20 font-condensed" />
                </div>
                <div>
                  <label className={labelClass}>Uhrzeit (Ende)</label>
                  <input type="time" defaultValue="21:30" className="w-full bg-[#ECE9CF] border-none rounded-lg px-4 py-3 text-sm text-dark focus:outline-none focus:ring-2 focus:ring-wine-red/20 font-condensed" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm space-y-4">
                <h3 className="font-bold text-wine-red text-sm uppercase tracking-widest">Preis & Kapazität</h3>
                <div>
                  <label className={labelClass}>Preis pro Person (€)</label>
                  <input type="number" defaultValue={129} className="w-full bg-[#ECE9CF] border-none rounded-lg px-4 py-3 text-sm text-dark focus:outline-none focus:ring-2 focus:ring-wine-red/20 font-condensed" />
                </div>
                <div>
                  <label className={labelClass}>Max. Teilnehmer</label>
                  <input type="number" defaultValue={8} className="w-full bg-[#ECE9CF] border-none rounded-lg px-4 py-3 text-sm text-dark focus:outline-none focus:ring-2 focus:ring-wine-red/20 font-condensed" />
                </div>
                <div className="p-3 bg-[#F8F5DA] rounded-lg">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-dark/40 mb-0.5">Aktuell gebucht</p>
                  <p className="font-bold text-wine-red">6 / 8 Plätze</p>
                </div>
              </div>

              <button className="w-full bg-wine-red hover:bg-garnet-red text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2">
                <Save className="w-4 h-4" />
                Änderungen speichern
              </button>
            </aside>
          </div>
        </div>
      </main>
  )
}
