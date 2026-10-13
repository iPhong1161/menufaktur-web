"use client"

import { useState, useTransition } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Archive, Eye, ImagePlus, Save, Trash2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import {
  createCourseAction,
  updateCourseAction,
  deleteCourseAction,
} from "@/app/admin/kurse/actions"
import type { Database } from "@/types/database"

type CourseRow = Database["public"]["Tables"]["courses"]["Row"]

interface Props {
  course?: CourseRow & { booked_count?: number }
}

const CATEGORIES = [
  "Pasta & Teigwaren",
  "Fleisch & Wild",
  "Fisch & Meeresfrüchte",
  "Backen & Patisserie",
  "Vegetarisch & Vegan",
  "International",
]

const FOOD_OPTIONS = [
  { value: "vegetarisch", label: "Vegetarisch" },
  { value: "vegan", label: "Vegan" },
  { value: "glutenfrei", label: "Glutenfrei" },
  { value: "lactosefrei", label: "Laktosefrei" },
  { value: "nussallergie", label: "Nussallergie" },
]

function autoSlug(value: string) {
  return value
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function KursForm({ course }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [isDeleting, startDeleteTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [info, setInfo] = useState<string | null>(null)

  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(course?.photo_url ?? null)

  const [title, setTitle] = useState(course?.title ?? "")
  const [slug, setSlug] = useState(course?.slug ?? "")
  const [tagline, setTagline] = useState(course?.tagline ?? "")
  const [category, setCategory] = useState(course?.category ?? "")
  const [description, setDescription] = useState(course?.description ?? "")
  const [date, setDate] = useState(course?.date ?? "")
  const [startTime, setStartTime] = useState(course?.start_time ?? "")
  const [endTime, setEndTime] = useState(course?.end_time ?? "")
  const [location, setLocation] = useState(course?.location ?? "")
  const [address, setAddress] = useState(course?.address ?? "")
  const [capacity, setCapacity] = useState(String(course?.capacity ?? 12))
  const [price, setPrice] = useState(String(course?.price_per_person ?? ""))
  const [vatRate, setVatRate] = useState(String(course?.vat_rate ?? 19))
  const [foodOptions, setFoodOptions] = useState<string[]>(course?.food_options ?? [])
  const [status, setStatus] = useState<"draft" | "published">(
    course?.status === "published" ? "published" : "draft"
  )

  const inputClass =
    "w-full bg-[#ECE9CF] border-none border-b-2 border-dark/20 focus:border-wine-red focus:outline-none rounded-t-lg px-4 py-4 text-dark placeholder:text-dark/30 font-condensed transition-colors"
  const labelClass =
    "block text-[10px] font-bold uppercase tracking-widest text-wine-red/70 mb-2"

  function handleTitleChange(value: string) {
    setTitle(value)
    if (!course) setSlug(autoSlug(value))
  }

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      setError("Das Bild darf maximal 5 MB groß sein.")
      e.target.value = ""
      return
    }
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Bitte nur JPG, PNG oder WebP Bilder hochladen.")
      e.target.value = ""
      return
    }
    setError(null)
    setPhotoFile(file)
    setPhotoPreview(URL.createObjectURL(file))
  }

  function toggleFood(value: string) {
    setFoodOptions((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    startTransition(async () => {
      let photo_url = course?.photo_url ?? null

      if (photoFile) {
        const supabase = createClient()
        const ext = photoFile.name.split(".").pop()
        const path = `courses/${Date.now()}.${ext}`
        const { error: uploadError } = await supabase.storage
          .from("course-photos")
          .upload(path, photoFile, { upsert: true })
        if (uploadError) {
          setError(`Foto-Upload fehlgeschlagen: ${uploadError.message}`)
          return
        }
        const {
          data: { publicUrl },
        } = supabase.storage.from("course-photos").getPublicUrl(path)
        photo_url = publicUrl
      }

      const data = {
        title,
        slug,
        tagline: tagline || null,
        category: category || null,
        description: description || null,
        date,
        start_time: startTime,
        end_time: endTime,
        location,
        address: address || null,
        capacity: parseInt(capacity),
        price_per_person: parseFloat(price),
        vat_rate: parseFloat(vatRate),
        photo_url,
        food_options: foodOptions,
        status,
      }

      if (course) {
        const result = await updateCourseAction(course.id, data)
        if ("error" in result) {
          setError(result.error)
        } else {
          setSuccess(true)
        }
      } else {
        const result = await createCourseAction(data)
        if (result && "error" in result) setError(result.error)
        // on success, createCourseAction redirects to /admin/kurse
      }
    })
  }

  function handleDelete() {
    if (!course) return
    if (
      !confirm(
        "Kurs wirklich löschen? Kurse mit Buchungen werden stattdessen archiviert."
      )
    )
      return
    setError(null)
    setInfo(null)
    startDeleteTransition(async () => {
      const result = await deleteCourseAction(course.id)
      if ("error" in result) {
        setError(result.error)
      } else if (result.outcome === "archived") {
        // Stay on the page so the admin sees why, and refresh so the status
        // field reflects "Archiviert".
        setInfo(result.message)
        router.refresh()
      } else {
        router.push("/admin/kurse")
      }
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10 items-start">
        {/* Left */}
        <div className="space-y-8">
          {/* General info */}
          <section className="bg-white p-10 rounded-xl shadow-sm space-y-7">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
              <div>
                <label className={labelClass}>Titel des Kurses</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Geben Sie den Titel ein"
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Slug (URL)</label>
                <div className="flex items-center bg-[#ECE9CF] rounded-t-lg border-b-2 border-dark/20">
                  <span className="pl-4 text-dark/40 font-mono text-xs">/kurse/</span>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="titel-des-kurses"
                    className="flex-grow bg-transparent border-none focus:outline-none px-1 py-4 text-sm font-mono text-dark placeholder:text-dark/30"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className={labelClass}>Kurzbeschreibung (Tagline)</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="Ein Satz, der den Kurs beschreibt"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Beschreibung</label>
              <textarea
                rows={6}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Beschreiben Sie das Erlebnis, die Techniken und das Menü…"
                className="w-full bg-[#ECE9CF] border-none border-b-2 border-dark/20 focus:border-wine-red focus:outline-none rounded-t-lg px-4 py-4 text-dark placeholder:text-dark/30 font-condensed transition-colors resize-none leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
              <div>
                <label className={labelClass}>Kategorie</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={inputClass}
                >
                  <option value="">Bitte wählen</option>
                  {CATEGORIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Veranstaltungsort</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="z. B. Frankfurt"
                  className={inputClass}
                  required
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Adresse</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Straße, Hausnummer, PLZ Stadt"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Ernährung / Allergene</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {FOOD_OPTIONS.map(({ value, label }) => (
                  <button
                    type="button"
                    key={value}
                    onClick={() => toggleFood(value)}
                    className={`px-4 py-2 rounded-full text-sm font-bold transition-all border ${
                      foodOptions.includes(value)
                        ? "bg-wine-red text-white border-wine-red"
                        : "bg-[#ECE9CF] text-dark/60 border-transparent hover:border-wine-red/30"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Photo upload */}
          <section className="bg-white p-10 rounded-xl shadow-sm">
            <label className={labelClass}>Kursfoto</label>
            <label className="block border-2 border-dashed border-dark/15 rounded-xl p-12 flex flex-col items-center justify-center gap-4 hover:bg-[#F8F5DA] transition-colors cursor-pointer">
              {photoPreview ? (
                <Image
                  src={photoPreview}
                  alt="Vorschau"
                  width={400}
                  height={192}
                  className="max-h-48 rounded-lg object-cover"
                  unoptimized
                />
              ) : (
                <>
                  <div className="w-14 h-14 bg-wine-red/5 rounded-full flex items-center justify-center">
                    <ImagePlus className="w-7 h-7 text-wine-red/40" />
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-wine-red text-sm">Klicken zum Hochladen</p>
                    <p className="text-xs text-dark/40 font-condensed mt-1">
                      oder Foto hierher ziehen (JPG, PNG bis 5 MB)
                    </p>
                  </div>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </label>
            {photoPreview && (
              <button
                type="button"
                onClick={() => {
                  setPhotoFile(null)
                  setPhotoPreview(null)
                }}
                className="mt-3 text-xs text-dark/40 hover:text-red-500 font-condensed transition-colors"
              >
                Foto entfernen
              </button>
            )}
          </section>
        </div>

        {/* Right sidebar */}
        <aside className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm space-y-4">
            <h3 className="font-bold text-wine-red flex items-center gap-2 text-sm">
              <Eye className="w-4 h-4" /> Veröffentlichung
            </h3>
            <div className="space-y-2">
              {(["draft", "published"] as const).map((val) => (
                <label
                  key={val}
                  className="flex items-center gap-3 p-3 bg-[#fdfadf] rounded-lg cursor-pointer hover:bg-[#F8F5DA] transition-colors"
                >
                  <input
                    type="radio"
                    name="status"
                    checked={status === val}
                    onChange={() => setStatus(val)}
                    className="text-wine-red focus:ring-wine-red h-4 w-4"
                  />
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
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full bg-[#ECE9CF] border-none rounded-lg px-4 py-3 text-sm text-dark focus:outline-none focus:ring-2 focus:ring-wine-red/20 font-condensed"
              />
            </div>
            <div>
              <label className={labelClass}>Uhrzeit (Beginn)</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
                className="w-full bg-[#ECE9CF] border-none rounded-lg px-4 py-3 text-sm text-dark focus:outline-none focus:ring-2 focus:ring-wine-red/20 font-condensed"
              />
            </div>
            <div>
              <label className={labelClass}>Uhrzeit (Ende)</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
                className="w-full bg-[#ECE9CF] border-none rounded-lg px-4 py-3 text-sm text-dark focus:outline-none focus:ring-2 focus:ring-wine-red/20 font-condensed"
              />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm space-y-4">
            <h3 className="font-bold text-wine-red text-sm uppercase tracking-widest">
              Preis & Kapazität
            </h3>
            <div>
              <label className={labelClass}>Preis pro Person (€)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                min={0}
                step={0.01}
                required
                className="w-full bg-[#ECE9CF] border-none rounded-lg px-4 py-3 text-sm text-dark focus:outline-none focus:ring-2 focus:ring-wine-red/20 font-condensed"
              />
            </div>
            <div>
              <label className={labelClass}>Max. Teilnehmer</label>
              <input
                type="number"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                placeholder="12"
                min={1}
                max={60}
                required
                className="w-full bg-[#ECE9CF] border-none rounded-lg px-4 py-3 text-sm text-dark focus:outline-none focus:ring-2 focus:ring-wine-red/20 font-condensed"
              />
            </div>
            <div>
              <label className={labelClass}>MwSt-Satz (%)</label>
              <input
                type="number"
                value={vatRate}
                onChange={(e) => setVatRate(e.target.value)}
                placeholder="19"
                min={0}
                max={100}
                className="w-full bg-[#ECE9CF] border-none rounded-lg px-4 py-3 text-sm text-dark focus:outline-none focus:ring-2 focus:ring-wine-red/20 font-condensed"
              />
            </div>
            {course && (
              <div className="p-3 bg-[#F8F5DA] rounded-lg">
                <p className="text-[10px] font-bold uppercase tracking-widest text-dark/40 mb-0.5">
                  Aktuell gebucht
                </p>
                <p className="font-bold text-wine-red">
                  {course.booked_count ?? "—"} / {course.capacity} Plätze
                </p>
              </div>
            )}
          </div>

          {success && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-800 text-sm font-condensed">
              Änderungen erfolgreich gespeichert.
            </div>
          )}
          {info && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-sm font-condensed flex items-start gap-2.5">
              <Archive className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
              <span>{info}</span>
            </div>
          )}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-condensed">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-wine-red hover:bg-garnet-red text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
          >
            <Save className="w-4 h-4" />
            {isPending
              ? "Wird gespeichert…"
              : course
              ? "Änderungen speichern"
              : status === "draft"
              ? "Als Entwurf speichern"
              : "Kurs veröffentlichen"}
          </button>

          {course && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 border border-red-200 text-red-500 rounded-xl text-sm font-bold hover:bg-red-50 transition-colors font-condensed disabled:opacity-60"
            >
              <Trash2 className="w-4 h-4" />
              {isDeleting ? "Wird gelöscht…" : "Kurs löschen"}
            </button>
          )}
        </aside>
      </div>
    </form>
  )
}
