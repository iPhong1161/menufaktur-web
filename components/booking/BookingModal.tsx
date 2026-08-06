"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { createPortal } from "react-dom"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  X,
  Minus,
  Plus,
  ArrowRight,
  ArrowLeft,
  CalendarDays,
  Clock,
  Users,
  AlertCircle,
  Tag,
  Check,
  CreditCard,
  Building2,
  Landmark,
} from "lucide-react"
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder"
import { validateVoucherAction } from "@/app/actions/voucher"
import type { CourseData } from "@/lib/data/courses"

// ─── Types ───────────────────────────────────────────────────────────────────

type FoodOption =
  | "keine"
  | "vegetarisch"
  | "vegan"
  | "laktosefrei"
  | "glutenfrei"

const FOOD_OPTIONS: { value: FoodOption; label: string }[] = [
  { value: "keine", label: "Keine" },
  { value: "vegetarisch", label: "Vegetarisch" },
  { value: "vegan", label: "Vegan" },
  { value: "laktosefrei", label: "Laktosefrei" },
  { value: "glutenfrei", label: "Glutenfrei" },
]

interface ParticipantData {
  firstName: string
  lastName: string
  email: string
  phone: string
  foodPreferences: FoodOption[]
  food_notes: string
}

interface InvoiceData {
  useParticipant1: boolean
  firstName: string
  lastName: string
  companyName: string
  addressLine1: string
  postalCode: string
  city: string
  email: string
  phone: string
  isBusiness: boolean
  vatId: string
}

export type PaymentMethod = "bank_transfer" | "card" | "sepa"

export interface BookingModalProps {
  course: CourseData
  onClose: () => void
}


function makeParticipant(): ParticipantData {
  return { firstName: "", lastName: "", email: "", phone: "", foodPreferences: ["keine"], food_notes: "" }
}

// ─── Shared sub-components ────────────────────────────────────────────────────

const STEP_LABELS = ["Anzahl", "Teilnehmerdaten", "Rechnungsempfänger", "Bestätigung"]

function ModalStepHeader({
  currentStep,
  onClose,
}: {
  currentStep: 1 | 2 | 3 | 4
  onClose: () => void
}) {
  return (
    <div className="bg-[#F8F5DA] px-8 pt-6 pb-5 shrink-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {([1, 2, 3, 4] as const).map((step, i) => {
            const isDone = step < currentStep
            const isCurrent = step === currentStep
            return (
              <div key={step} className="flex items-center">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold transition-colors ${
                    isCurrent
                      ? "bg-wine-red text-white"
                      : isDone
                      ? "bg-wine-red/15 text-wine-red"
                      : "bg-dark/8 text-dark/30"
                  }`}
                >
                  {isDone ? <Check className="w-3 h-3" /> : step}
                </div>
                {i < 3 && (
                  <div
                    className={`w-7 h-px mx-1 ${
                      step < currentStep ? "bg-wine-red/30" : "bg-dark/10"
                    }`}
                  />
                )}
              </div>
            )
          })}
          <span className="ml-3 text-sm font-bold text-wine-red">
            {STEP_LABELS[currentStep - 1]}
          </span>
        </div>
        <button
          onClick={onClose}
          className="text-dark/40 hover:text-dark transition-colors"
          aria-label="Schließen"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}

function CourseStrip({
  course,
  count,
  total,
}: {
  course: CourseData
  count: number
  total: number
}) {
  return (
    <div className="bg-wine-red text-white px-8 py-3 flex items-center justify-between gap-4">
      <div className="flex items-center gap-5 min-w-0">
        <div className="flex items-center gap-1.5 text-xs text-white/80 shrink-0">
          <CalendarDays className="w-3.5 h-3.5" aria-hidden="true" />
          <span>{course.dateFormatted}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-white/80 shrink-0">
          <Clock className="w-3.5 h-3.5" aria-hidden="true" />
          <span>
            {course.startTime}–{course.endTime} Uhr
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-white/80 shrink-0">
          <Users className="w-3.5 h-3.5" aria-hidden="true" />
          <span>
            {count} {count === 1 ? "Teilnehmer" : "Teilnehmer"}
          </span>
        </div>
      </div>
      <div className="text-xs font-bold text-white/90 shrink-0 hidden sm:block">
        {course.title} — {total.toLocaleString("de-DE")} €
      </div>
    </div>
  )
}

const inputClass =
  "w-full bg-transparent border-0 border-b-2 border-dark/15 px-0 py-2.5 text-sm text-dark placeholder:text-dark/30 focus:border-wine-red focus:ring-0 transition-colors outline-none"
const labelClass =
  "block text-[0.65rem] font-bold uppercase tracking-widest text-dark/40 mb-2"

function FormField({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-0">
      <label className={labelClass}>{label}</label>
      {children}
      {error && <p className="text-[0.65rem] text-red-600 mt-1">{error}</p>}
    </div>
  )
}

function FoodPills({
  preferences,
  onChange,
}: {
  preferences: FoodOption[]
  onChange: (prefs: FoodOption[]) => void
}) {
  function toggle(option: FoodOption) {
    if (option === "keine") {
      onChange(["keine"])
      return
    }
    const without = preferences.filter((p) => p !== "keine" && p !== option)
    const next = preferences.includes(option)
      ? without.length === 0
        ? ["keine" as FoodOption]
        : without
      : [...without, option]
    onChange(next)
  }

  return (
    <div className="flex flex-wrap gap-2">
      {FOOD_OPTIONS.map(({ value, label }) => {
        const active = preferences.includes(value)
        return (
          <button
            key={value}
            type="button"
            onClick={() => toggle(value)}
            className={`px-4 py-1.5 rounded-full border text-xs font-bold transition-all ${
              active
                ? "border-wine-red text-wine-red bg-wine-red/5"
                : "border-dark/20 text-dark/50 hover:border-wine-red hover:text-wine-red"
            }`}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}

// ─── Step 1: Teilnehmerzahl ───────────────────────────────────────────────────

function Step1({
  course,
  count,
  onCountChange,
  onClose,
  onNext,
}: {
  course: CourseData
  count: number
  onCountChange: (n: number) => void
  onClose: () => void
  onNext: () => void
}) {
  const MAX_BOOKING = 6
  const maxCount = Math.min(MAX_BOOKING, course.remainingCapacity)
  const total = count * course.price
  const atGroupLimit = count >= maxCount && maxCount === MAX_BOOKING
  const spotsAfter = maxCount - count
  const spotsColor =
    spotsAfter === 0
      ? "text-red-500"
      : spotsAfter === 1
        ? "text-red-500"
        : spotsAfter <= 3
          ? "text-amber-500"
          : "text-dark/40"
  const spotsLabel =
    spotsAfter === 0
      ? count === 6
        ? "Maximale Gruppengröße erreicht"
        : "Kurs ausgebucht"
      : spotsAfter === 1
        ? "Sie können noch 1 weitere Person hinzufügen"
        : `Sie können noch ${spotsAfter} weitere Personen hinzufügen`

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Header */}
      <ModalStepHeader currentStep={1} onClose={onClose} />

      {/* Course strip */}
      <div className="bg-[#F8F5DA] px-8 pb-5 shrink-0">
        <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-dark/5">
          <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0">
            {course.photo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={course.photo_url}
                alt={course.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <ImagePlaceholder label="" className="w-full h-full" />
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-wine-red truncate">{course.title}</p>
            <p className="text-xs text-dark/50">{course.dateFormatted}</p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="px-8 py-10 flex flex-col items-center text-center flex-1 min-h-0 overflow-y-auto">
        <h2 className="text-3xl font-bold text-wine-red mb-3">
          Wie viele Teilnehmer?
        </h2>
        <p className="text-dark/60 text-sm max-w-[260px] leading-relaxed mb-10">
          Wählen Sie die Anzahl der Plätze, die Sie buchen möchten.
        </p>

        {/* Counter */}
        <div className="flex items-center gap-8 mb-4">
          <button
            onClick={() => onCountChange(Math.max(1, count - 1))}
            disabled={count <= 1}
            className="w-14 h-14 rounded-full border-2 border-dark/15 flex items-center justify-center text-wine-red hover:bg-wine-red hover:text-white hover:border-wine-red transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Weniger"
          >
            <Minus className="w-5 h-5" />
          </button>
          <span className="text-6xl font-bold text-wine-red w-16 text-center tabular-nums">
            {count}
          </span>
          <button
            onClick={() => onCountChange(Math.min(maxCount, count + 1))}
            disabled={count >= maxCount}
            className="w-14 h-14 rounded-full border-2 border-dark/15 flex items-center justify-center text-wine-red hover:bg-wine-red hover:text-white hover:border-wine-red transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Mehr"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Spots remaining */}
        <p className={`text-xs font-bold uppercase tracking-widest mb-8 transition-colors duration-200 ${spotsColor}`}>
          {spotsLabel}
        </p>

        {/* Price */}
        <div className="bg-dark/5 px-6 py-3 rounded-full mb-2">
          <p className="text-base font-medium text-dark">
            Gesamtpreis:{" "}
            <span className="font-bold text-wine-red">
              {total.toLocaleString("de-DE")} €
            </span>
          </p>
        </div>
        <p className="text-[0.65rem] uppercase tracking-widest text-dark/40 font-bold">
          Inkl. gesetzlicher MwSt.
        </p>

        {/* Private Event upsell — shown when group limit is reached */}
        <div
          className={`mt-8 max-w-[300px] text-center transition-all duration-300 ${
            atGroupLimit ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
          }`}
          aria-hidden={!atGroupLimit}
        >
          <p className="text-sm text-dark/70 leading-relaxed mb-3">
            Sie möchten mit mehr als 6 Personen kochen? Für größere Gruppen empfehlen wir ein{" "}
            <strong className="text-dark">Private Event</strong> — wir gestalten Ihnen einen unvergesslichen Abend nach Maß.
          </p>
          <Link
            href="/kontakt"
            className="inline-flex items-center gap-1 text-sm font-bold text-wine-red hover:text-garnet-red transition-colors"
          >
            Zum Private Event anfragen <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="px-8 pb-8 flex items-center justify-between shrink-0">
        <button
          onClick={onClose}
          className="text-dark/50 font-bold hover:text-dark transition-colors text-sm"
        >
          Abbrechen
        </button>
        <button
          onClick={onNext}
          className="bg-wine-red hover:bg-garnet-red text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-colors duration-200"
        >
          Weiter <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

// ─── Step 2: Teilnehmerdaten ──────────────────────────────────────────────────

function Step2({
  course,
  count,
  total,
  participants,
  errors,
  onUpdateParticipant,
  onBack,
  onNext,
  onClose,
}: {
  course: CourseData
  count: number
  total: number
  participants: ParticipantData[]
  errors: Record<string, string>
  onUpdateParticipant: (i: number, field: keyof ParticipantData, value: string) => void
  onBack: () => void
  onNext: () => void
  onClose: () => void
}) {
  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Header */}
      <ModalStepHeader currentStep={2} onClose={onClose} />

      {/* Course strip */}
      <CourseStrip course={course} count={count} total={total} />

      {/* Scrollable form */}
      <div className="flex-1 min-h-0 overflow-y-auto px-8 py-8 space-y-10">
        {participants.map((participant, i) => {
          const isPrimary = i === 0
          return (
            <section key={i}>
              {/* Section header */}
              <div className="flex items-center gap-3 mb-6">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                    isPrimary
                      ? "bg-wine-red text-white"
                      : "bg-dark/8 text-wine-red border border-dark/10"
                  }`}
                >
                  {i + 1}
                </div>
                <h3 className="text-base font-bold text-wine-red">
                  {`Teilnehmer ${i + 1}`}
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
                <FormField label="Vorname" error={errors[`${i}_firstName`]}>
                  <input
                    type="text"
                    className={inputClass}
                    placeholder={isPrimary ? "Geben Sie Ihren Vornamen ein" : "Vorname des Gastes"}
                    value={participant.firstName}
                    onChange={(e) => onUpdateParticipant(i, "firstName", e.target.value)}
                  />
                </FormField>
                <FormField label="Nachname" error={errors[`${i}_lastName`]}>
                  <input
                    type="text"
                    className={inputClass}
                    placeholder={isPrimary ? "Geben Sie Ihren Nachnamen ein" : "Nachname des Gastes"}
                    value={participant.lastName}
                    onChange={(e) => onUpdateParticipant(i, "lastName", e.target.value)}
                  />
                </FormField>

                {isPrimary && (
                  <>
                    <FormField label="E-Mail" error={errors[`${i}_email`]}>
                      <input
                        type="email"
                        className={inputClass}
                        placeholder="beispiel@email.de"
                        value={participant.email}
                        onChange={(e) => onUpdateParticipant(i, "email", e.target.value)}
                      />
                    </FormField>
                    <FormField label="Telefon">
                      <input
                        type="tel"
                        className={inputClass}
                        placeholder="+49 000 0000000"
                        value={participant.phone}
                        onChange={(e) => onUpdateParticipant(i, "phone", e.target.value)}
                      />
                    </FormField>
                  </>
                )}
              </div>

              <div className="mt-6">
                <p className={labelClass}>Ernährungspräferenzen &amp; Allergien</p>
                <FoodPills
                  preferences={participant.foodPreferences}
                  onChange={(prefs) =>
                    onUpdateParticipant(i, "foodPreferences" as keyof ParticipantData, prefs as unknown as string)
                  }
                />
              </div>

              <div className="mt-6">
                <p className={labelClass}>Sonstige Anmerkungen &amp; Allergien</p>
                <textarea
                  rows={2}
                  className={`${inputClass} resize-none`}
                  placeholder="z.B. starke Nussallergie, Laktoseintoleranz, sonstige Hinweise..."
                  value={participant.food_notes}
                  onChange={(e) => onUpdateParticipant(i, "food_notes", e.target.value)}
                />
              </div>

              {i < participants.length - 1 && (
                <div className="mt-10 border-b border-dark/8" />
              )}
            </section>
          )
        })}
      </div>

      {/* Footer */}
      <div className="px-8 py-6 border-t border-dark/8 bg-white flex items-center justify-between shrink-0">
        <button
          onClick={onBack}
          className="text-wine-red font-bold flex items-center gap-2 hover:text-garnet-red transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Zurück
        </button>
        <button
          onClick={onNext}
          className="bg-wine-red hover:bg-garnet-red text-white px-8 py-3 rounded-xl font-bold transition-colors duration-200"
        >
          Weiter zur Zahlung
        </button>
      </div>
    </div>
  )
}

// ─── Step 3: Rechnungsempfänger ───────────────────────────────────────────────

function Step3({
  course,
  total,
  participants,
  invoice,
  onInvoiceChange,
  onBack,
  onNext,
  onClose,
}: {
  course: CourseData
  total: number
  participants: ParticipantData[]
  invoice: InvoiceData
  onInvoiceChange: (updates: Partial<InvoiceData>) => void
  onBack: () => void
  onNext: () => void
  onClose: () => void
}) {
  const p1 = participants[0]

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Header */}
      <ModalStepHeader currentStep={3} onClose={onClose} />

      {/* Course strip */}
      <div className="bg-wine-red text-white px-8 py-3 flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-white/20">
            {course.photo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={course.photo_url} alt={course.title} className="w-full h-full object-cover" />
            ) : (
              <ImagePlaceholder label="" className="w-full h-full" />
            )}
          </div>
          <div>
            <p className="text-[0.6rem] uppercase tracking-widest text-white/60 font-bold">
              Aktuelle Auswahl
            </p>
            <p className="text-sm font-bold">
              {course.title} — {course.dateFormatted}
            </p>
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="text-[0.6rem] text-white/60 uppercase tracking-widest">
            Gesamtbetrag
          </p>
          <p className="font-bold">{total.toLocaleString("de-DE")} €</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 overflow-y-auto px-8 py-8">
        <p className="text-xs font-bold uppercase tracking-widest text-wine-red/60 mb-1">
          Schritt 3 von 4
        </p>
        <h2 className="text-3xl font-bold text-wine-red mb-8">
          Rechnungsempfänger
        </h2>

        <div className="space-y-5">
          {/* Option 1 */}
          <label className="flex items-start gap-4 cursor-pointer">
            <input
              type="radio"
              name="invoice_recipient"
              checked={invoice.useParticipant1}
              onChange={() => onInvoiceChange({ useParticipant1: true })}
              className="mt-1 w-4 h-4 border-dark/20 text-wine-red focus:ring-wine-red cursor-pointer"
            />
            <div className="flex-1">
              <span className="font-bold text-base text-wine-red">
                Rechnung an Teilnehmer 1
              </span>
              {invoice.useParticipant1 && (
                <div className="mt-3 p-4 bg-[#F8F5DA] rounded-xl border-l-4 border-wine-red">
                  <p className="font-bold text-sm text-dark">
                    {p1.firstName || "Vorname"} {p1.lastName || "Nachname"}
                  </p>
                  <p className="text-xs text-dark/60 mt-0.5">{p1.email || "E-Mail"}</p>
                  <p className="text-[0.6rem] uppercase tracking-widest text-wine-red/50 font-bold mt-2">
                    Angaben aus Schritt 2
                  </p>
                </div>
              )}
            </div>
          </label>

          {/* Option 2 */}
          <label className="flex items-start gap-4 cursor-pointer">
            <input
              type="radio"
              name="invoice_recipient"
              checked={!invoice.useParticipant1}
              onChange={() => onInvoiceChange({ useParticipant1: false })}
              className="mt-1 w-4 h-4 border-dark/20 text-wine-red focus:ring-wine-red cursor-pointer"
            />
            <div className="flex-1">
              <span
                className={`font-bold text-base transition-colors ${
                  !invoice.useParticipant1 ? "text-wine-red" : "text-dark/50"
                }`}
              >
                Anderer Rechnungsempfänger
              </span>
              <p className="text-xs text-dark/50 mt-0.5">
                Firmenadresse oder abweichende Privatadresse angeben.
              </p>

              {/* Expanded form */}
              {!invoice.useParticipant1 && (
                <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                  <FormField label="Vorname">
                    <input
                      type="text"
                      className={inputClass}
                      value={invoice.firstName}
                      onChange={(e) => onInvoiceChange({ firstName: e.target.value })}
                    />
                  </FormField>
                  <FormField label="Nachname">
                    <input
                      type="text"
                      className={inputClass}
                      value={invoice.lastName}
                      onChange={(e) => onInvoiceChange({ lastName: e.target.value })}
                    />
                  </FormField>
                  <div className="sm:col-span-2">
                    <FormField label="Firma (optional)">
                      <input
                        type="text"
                        className={inputClass}
                        value={invoice.companyName}
                        onChange={(e) => onInvoiceChange({ companyName: e.target.value })}
                      />
                    </FormField>
                  </div>
                  <div className="sm:col-span-2">
                    <FormField label="Straße und Hausnummer">
                      <input
                        type="text"
                        className={inputClass}
                        value={invoice.addressLine1}
                        onChange={(e) => onInvoiceChange({ addressLine1: e.target.value })}
                      />
                    </FormField>
                  </div>
                  <FormField label="PLZ">
                    <input
                      type="text"
                      className={inputClass}
                      value={invoice.postalCode}
                      onChange={(e) => onInvoiceChange({ postalCode: e.target.value })}
                    />
                  </FormField>
                  <FormField label="Stadt">
                    <input
                      type="text"
                      className={inputClass}
                      value={invoice.city}
                      onChange={(e) => onInvoiceChange({ city: e.target.value })}
                    />
                  </FormField>
                  <div className="sm:col-span-2">
                    <FormField label="E-Mail">
                      <input
                        type="email"
                        className={inputClass}
                        value={invoice.email}
                        onChange={(e) => onInvoiceChange({ email: e.target.value })}
                      />
                    </FormField>
                  </div>
                  <div className="sm:col-span-2">
                    <FormField label="Telefon">
                      <input
                        type="tel"
                        className={inputClass}
                        placeholder="+49 69 ..."
                        value={invoice.phone}
                        onChange={(e) => onInvoiceChange({ phone: e.target.value })}
                      />
                    </FormField>
                  </div>

                  {/* B2B toggle */}
                  <div className="sm:col-span-2">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={invoice.isBusiness}
                        onChange={(e) => onInvoiceChange({ isBusiness: e.target.checked })}
                        className="w-4 h-4 text-wine-red border-dark/20 rounded focus:ring-wine-red"
                      />
                      <span className="text-sm text-dark/70">
                        Ich buche als Unternehmen (mit USt-IdNr.)
                      </span>
                    </label>
                    {invoice.isBusiness && (
                      <div className="mt-3">
                        <FormField label="USt-IdNr. (optional)">
                          <input
                            type="text"
                            className={inputClass}
                            placeholder="DE123456789"
                            value={invoice.vatId}
                            onChange={(e) => onInvoiceChange({ vatId: e.target.value })}
                          />
                        </FormField>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </label>
        </div>
      </div>

      {/* Footer */}
      <div className="px-8 py-6 border-t border-dark/8 bg-white flex items-center justify-between shrink-0">
        <button
          onClick={onBack}
          className="text-wine-red font-bold flex items-center gap-2 hover:text-garnet-red transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Zurück
        </button>
        <button
          onClick={onNext}
          className="bg-wine-red hover:bg-garnet-red text-white px-8 py-3 rounded-xl font-bold transition-colors duration-200"
        >
          Weiter
        </button>
      </div>
    </div>
  )
}

// ─── Step 4: Übersicht & Bestätigung ─────────────────────────────────────────

function Step4({
  course,
  count,
  participants,
  invoice,
  voucherCode,
  voucherState,
  voucherDiscount,
  agbAccepted,
  datenschutzAccepted,
  paymentMethod,
  onVoucherCodeChange,
  onApplyVoucher,
  onAgbChange,
  onDatenschutzChange,
  onPaymentMethodChange,
  onGoToStep,
  onBack,
  onSubmit,
  submitting = false,
  submitError,
  onClose,
}: {
  course: CourseData
  count: number
  participants: ParticipantData[]
  invoice: InvoiceData
  voucherCode: string
  voucherState: "idle" | "loading" | "valid" | "invalid"
  voucherDiscount: number
  agbAccepted: boolean
  datenschutzAccepted: boolean
  onVoucherCodeChange: (v: string) => void
  onApplyVoucher: () => void
  onAgbChange: (v: boolean) => void
  onDatenschutzChange: (v: boolean) => void
  paymentMethod: PaymentMethod
  onPaymentMethodChange: (v: PaymentMethod) => void
  onGoToStep: (s: 1 | 2 | 3) => void
  onBack: () => void
  onSubmit: () => void
  submitting?: boolean
  submitError?: string | null
  onClose: () => void
}) {
  const totalBeforeDiscount = count * course.price
  const total = totalBeforeDiscount - voucherDiscount
  const p1 = participants[0]
  const canSubmit = agbAccepted && datenschutzAccepted

  const invoiceDisplay = invoice.useParticipant1
    ? { name: `${p1.firstName} ${p1.lastName}`, email: p1.email, address: "" }
    : {
        name: `${invoice.firstName} ${invoice.lastName}`,
        email: invoice.email,
        address: [invoice.addressLine1, `${invoice.postalCode} ${invoice.city}`]
          .filter(Boolean)
          .join(", "),
      }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Header */}
      <ModalStepHeader currentStep={4} onClose={onClose} />

      {/* Two-column body */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col w-60 bg-[#F8F5DA] border-r border-dark/8 p-8 shrink-0 min-h-0 overflow-y-auto">
          {/* Course card */}
          <div className="p-4 bg-white rounded-xl space-y-3">
            <div className="aspect-video rounded-lg overflow-hidden">
              {course.photo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={course.photo_url} alt={course.title} className="w-full h-full object-cover" />
              ) : (
                <ImagePlaceholder label="Course photo" className="w-full h-full" />
              )}
            </div>
            <p className="text-[0.6rem] text-wine-red/50 uppercase tracking-widest font-bold">
              Kurs
            </p>
            <p className="text-xs font-bold text-wine-red leading-snug">{course.title}</p>
            <p className="text-xs text-dark/50">
              {course.dateFormatted}, {course.startTime} Uhr
            </p>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden min-h-0">
          <div className="flex-1 min-h-0 overflow-y-auto px-8 md:px-10 py-8 space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-wine-red mb-1">
              Übersicht &amp; Bestätigung
            </h2>
            <p className="text-sm text-dark/60">
              Bitte überprüfen Sie Ihre Angaben, bevor Sie die Buchung abschließen.
            </p>
          </div>

          {/* Kurs & Termin */}
          <section>
            <div className="flex justify-between items-center border-b border-dark/8 pb-2 mb-4">
              <h3 className="text-[0.65rem] font-bold uppercase tracking-widest text-dark/40">
                Kurs &amp; Termin
              </h3>
              <button
                onClick={() => onGoToStep(1)}
                className="text-xs font-bold text-wine-red hover:underline"
              >
                Bearbeiten
              </button>
            </div>
            <p className="font-bold text-dark text-sm">{course.title}</p>
            <p className="text-xs text-dark/60 mt-1">
              {course.dateFormatted} | {course.startTime} – {course.endTime} Uhr
            </p>
          </section>

          {/* Teilnehmer */}
          <section>
            <div className="flex justify-between items-center border-b border-dark/8 pb-2 mb-4">
              <h3 className="text-[0.65rem] font-bold uppercase tracking-widest text-dark/40">
                Teilnehmer
              </h3>
              <button
                onClick={() => onGoToStep(2)}
                className="text-xs font-bold text-wine-red hover:underline"
              >
                Bearbeiten
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {participants.map((p, i) => (
                <div
                  key={i}
                  className="p-3 rounded-lg bg-[#F8F5DA] border border-dark/5"
                >
                  <p className="text-[0.6rem] text-wine-red/50 font-bold uppercase tracking-widest mb-1">
                    Teilnehmer {i + 1}
                  </p>
                  <p className="text-sm font-medium text-dark">
                    {p.firstName || "—"} {p.lastName}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Rechnungsempfänger */}
          <section>
            <div className="flex justify-between items-center border-b border-dark/8 pb-2 mb-4">
              <h3 className="text-[0.65rem] font-bold uppercase tracking-widest text-dark/40">
                Rechnungsempfänger
              </h3>
              <button
                onClick={() => onGoToStep(3)}
                className="text-xs font-bold text-wine-red hover:underline"
              >
                Bearbeiten
              </button>
            </div>
            <p className="text-sm font-bold text-dark">{invoiceDisplay.name || "—"}</p>
            {invoiceDisplay.address && (
              <p className="text-xs text-dark/60 mt-0.5">{invoiceDisplay.address}</p>
            )}
            {invoiceDisplay.email && (
              <p className="text-xs text-dark/60 mt-0.5">{invoiceDisplay.email}</p>
            )}
          </section>

          {/* Preisübersicht */}
          <section className="bg-[#F8F5DA] p-6 rounded-xl">
            <h3 className="text-[0.65rem] font-bold uppercase tracking-widest text-dark/40 mb-4">
              Preisübersicht
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-dark/70">
                  {count} × Kursgebühr (à {course.price.toLocaleString("de-DE")} €)
                </span>
                <span className="font-medium">
                  {totalBeforeDiscount.toLocaleString("de-DE")} €
                </span>
              </div>
              <div className="flex justify-between text-dark/50 text-xs">
                <span>MwSt. (19%)</span>
                <span>Inklusive</span>
              </div>
              {voucherState === "valid" && (
                <div className="flex justify-between text-emerald-700 text-xs font-bold">
                  <span>Gutschein ({voucherCode.toUpperCase()})</span>
                  <span>−{voucherDiscount.toLocaleString("de-DE")} €</span>
                </div>
              )}
            </div>

            {/* Voucher field */}
            <div className="mt-4 flex gap-2">
              <div className="relative flex-1">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-dark/30" />
                <input
                  type="text"
                  placeholder="Gutscheincode"
                  value={voucherCode}
                  onChange={(e) => {
                    onVoucherCodeChange(e.target.value)
                  }}
                  className={`w-full pl-8 pr-3 py-2 text-sm rounded-lg border focus:ring-1 focus:ring-wine-red outline-none transition-colors ${
                    voucherState === "valid"
                      ? "border-emerald-500 bg-emerald-50"
                      : voucherState === "invalid"
                      ? "border-red-400 bg-red-50"
                      : "border-dark/15 bg-white"
                  }`}
                disabled={voucherState === "loading"}
                />
              </div>
              <button
                onClick={onApplyVoucher}
                disabled={voucherState === "loading" || !voucherCode.trim()}
                className="bg-wine-red hover:bg-garnet-red disabled:opacity-50 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
              >
                {voucherState === "loading" ? "…" : "Anwenden"}
              </button>
            </div>
            {voucherState === "valid" && (
              <p className="text-xs text-emerald-700 font-bold mt-1 flex items-center gap-1">
                <Check className="w-3 h-3" /> Gutschein erfolgreich angewendet
              </p>
            )}
            {voucherState === "invalid" && (
              <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> Ungültiger oder abgelaufener Gutscheincode
              </p>
            )}

            {/* Total */}
            <div className="mt-4 pt-4 border-t border-dark/10 flex justify-between items-center">
              <span className="font-bold text-wine-red">Gesamtbetrag</span>
              <span className="text-2xl font-bold text-wine-red">
                {total.toLocaleString("de-DE")} €
              </span>
            </div>
          </section>

          {/* Zahlungsart */}
          <section>
            <div className="border-b border-dark/8 pb-2 mb-4">
              <h3 className="text-[0.65rem] font-bold uppercase tracking-widest text-dark/40">
                Zahlungsart
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(
                [
                  { value: "bank_transfer", label: "Überweisung", Icon: Building2, sub: "Rechnung per E-Mail" },
                  { value: "card", label: "Kreditkarte", Icon: CreditCard, sub: "Visa, Mastercard" },
                  { value: "sepa", label: "SEPA-Lastschrift", Icon: Landmark, sub: "EU Bankeinzug" },
                ] as const
              ).map(({ value, label, Icon, sub }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => onPaymentMethodChange(value)}
                  className={[
                    "flex flex-col items-start gap-1.5 p-4 rounded-xl border-2 text-left transition-colors",
                    paymentMethod === value
                      ? "border-wine-red bg-wine-red/5"
                      : "border-dark/10 bg-white hover:border-wine-red/30",
                  ].join(" ")}
                >
                  <Icon
                    className={`w-4 h-4 ${paymentMethod === value ? "text-wine-red" : "text-dark/40"}`}
                    aria-hidden="true"
                  />
                  <span
                    className={`text-xs font-bold ${paymentMethod === value ? "text-wine-red" : "text-dark"}`}
                  >
                    {label}
                  </span>
                  <span className="text-[0.65rem] text-dark/50">{sub}</span>
                </button>
              ))}
            </div>
          </section>

          {/* AGB & Datenschutz */}
          <section className="space-y-4">
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={agbAccepted}
                onChange={(e) => onAgbChange(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-dark/20 text-wine-red focus:ring-wine-red cursor-pointer"
              />
              <span className="text-xs text-dark/70 leading-relaxed">
                Ich habe die{" "}
                <a href="/agb" className="text-wine-red font-bold hover:underline" target="_blank">
                  Allgemeinen Geschäftsbedingungen
                </a>{" "}
                gelesen und akzeptiere diese.
              </span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={datenschutzAccepted}
                onChange={(e) => onDatenschutzChange(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-dark/20 text-wine-red focus:ring-wine-red cursor-pointer"
              />
              <span className="text-xs text-dark/70 leading-relaxed">
                Ich bestätige, die{" "}
                <a href="/datenschutz" className="text-wine-red font-bold hover:underline" target="_blank">
                  Datenschutzerklärung
                </a>{" "}
                zur Kenntnis genommen zu haben.
              </span>
            </label>
          </section>
        </div>

        {/* Footer */}
        <div className="px-8 md:px-10 py-6 border-t border-dark/8 bg-white flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
          <button
            onClick={onBack}
            disabled={submitting}
            className="text-wine-red font-bold flex items-center gap-2 hover:text-garnet-red transition-colors text-sm disabled:opacity-40"
          >
            <ArrowLeft className="w-4 h-4" /> Zurück
          </button>
          <div className="flex flex-col items-end gap-2">
            {submitError && (
              <p className="text-red-500 text-xs font-condensed">{submitError}</p>
            )}
            <button
              onClick={onSubmit}
              disabled={!canSubmit || submitting}
              className="w-full sm:w-auto bg-wine-red hover:bg-garnet-red disabled:bg-dark/15 disabled:cursor-not-allowed text-white disabled:text-dark/40 px-10 py-3.5 rounded-xl font-bold transition-colors duration-200"
            >
              {submitting
                ? paymentMethod === "bank_transfer" ? "Wird gesendet…" : "Weiterleiten…"
                : paymentMethod === "bank_transfer" ? "Buchung absenden" : "Weiter zur Zahlung →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}

// ─── Main modal ───────────────────────────────────────────────────────────────

export function BookingModal({ course, onClose }: BookingModalProps) {
  const router = useRouter()
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1)
  const [count, setCount] = useState(1)
  const [participants, setParticipants] = useState<ParticipantData[]>([makeParticipant()])
  const [invoice, setInvoice] = useState<InvoiceData>({
    useParticipant1: true,
    firstName: "",
    lastName: "",
    companyName: "",
    addressLine1: "",
    postalCode: "",
    city: "",
    email: "",
    phone: "",
    isBusiness: false,
    vatId: "",
  })
  const [voucherCode, setVoucherCode] = useState("")
  const [voucherState, setVoucherState] = useState<"idle" | "loading" | "valid" | "invalid">("idle")
  const [voucherDiscount, setVoucherDiscount] = useState(0)
  const voucherIdRef = useRef<string | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("bank_transfer")
  const [agbAccepted, setAgbAccepted] = useState(false)
  const [datenschutzAccepted, setDatenschutzAccepted] = useState(false)
  const [step2Errors, setStep2Errors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = ""
    }
  }, [])

  const handleClose = useCallback(() => onClose(), [onClose])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose()
    }
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [handleClose])

  const total = count * course.price - voucherDiscount

  function handleCountChange(newCount: number) {
    setCount(newCount)
    setParticipants((prev) => {
      if (newCount > prev.length) {
        return [
          ...prev,
          ...Array.from({ length: newCount - prev.length }, makeParticipant),
        ]
      }
      return prev.slice(0, newCount)
    })
  }

  function updateParticipant(
    i: number,
    field: keyof ParticipantData,
    value: string | FoodOption[]
  ) {
    setParticipants((prev) =>
      prev.map((p, idx) => (idx === i ? { ...p, [field]: value } : p))
    )
  }

  function validateStep2(): boolean {
    const errors: Record<string, string> = {}
    if (!participants[0].firstName.trim()) errors["0_firstName"] = "Pflichtfeld"
    if (!participants[0].lastName.trim()) errors["0_lastName"] = "Pflichtfeld"
    if (!participants[0].email.trim()) errors["0_email"] = "Pflichtfeld"
    else if (!/\S+@\S+\.\S+/.test(participants[0].email))
      errors["0_email"] = "Ungültige E-Mail-Adresse"
    for (let i = 1; i < participants.length; i++) {
      if (!participants[i].firstName.trim()) errors[`${i}_firstName`] = "Pflichtfeld"
      if (!participants[i].lastName.trim()) errors[`${i}_lastName`] = "Pflichtfeld"
    }
    setStep2Errors(errors)
    return Object.keys(errors).length === 0
  }

  async function handleApplyVoucher() {
    setVoucherState("loading")
    const result = await validateVoucherAction(voucherCode.trim())
    if (result) {
      const discount = Math.min(result.value, total)
      setVoucherState("valid")
      setVoucherDiscount(discount)
      voucherIdRef.current = result.id
    } else {
      setVoucherState("invalid")
      setVoucherDiscount(0)
      voucherIdRef.current = null
    }
  }

  async function handleSubmit() {
    const p1 = participants[0]
    const payload = {
      course: { id: course.id },
      count,
      totalAmount: total,
      paymentMethod,
      participants: participants.map((p) => ({
        firstName: p.firstName,
        lastName: p.lastName,
        email: p.email || "",
        phone: p.phone || null,
        foodPreferences: p.foodPreferences,
        foodNotes: p.food_notes || "",
      })),
      invoiceRecipient: invoice.useParticipant1
        ? {
            firstName: p1.firstName,
            lastName: p1.lastName,
            email: p1.email,
          }
        : {
            firstName: invoice.firstName,
            lastName: invoice.lastName,
            companyName: invoice.companyName || null,
            addressLine1: invoice.addressLine1,
            postalCode: invoice.postalCode,
            city: invoice.city,
            email: invoice.email,
            phone: invoice.phone || null,
            isBusiness: invoice.isBusiness,
            vatId: invoice.vatId || null,
          },
      voucher:
        voucherState === "valid"
          ? { code: voucherCode.toUpperCase(), discount: voucherDiscount, id: voucherIdRef.current }
          : null,
    }

    setSubmitting(true)
    setSubmitError(null)
    try {
      // Step 1: Create booking in DB
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) {
        setSubmitError(data.error ?? "Buchung fehlgeschlagen. Bitte versuchen Sie es erneut.")
        return
      }

      if (paymentMethod === "bank_transfer") {
        // Bank transfer: go straight to confirmation
        router.push(`/buchung/bestaetigung/${data.booking_number}?count=${count}`)
        onClose()
      } else {
        // Card / SEPA: create Stripe Checkout Session and redirect
        const stripePaymentMethod = paymentMethod === "card" ? "card" : "sepa_debit"
        const stripeRes = await fetch("/api/stripe/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            bookingNumber: data.booking_number,
            paymentMethod: stripePaymentMethod,
          }),
        })
        const stripeData = await stripeRes.json()
        if (!stripeRes.ok || !stripeData.url) {
          setSubmitError(stripeData.error ?? "Fehler beim Weiterleiten zur Zahlung.")
          return
        }
        window.location.href = stripeData.url
      }
    } catch {
      setSubmitError("Verbindungsfehler. Bitte versuchen Sie es erneut.")
    } finally {
      setSubmitting(false)
    }
  }

  const maxWidthClass = {
    1: "max-w-lg",
    2: "max-w-4xl",
    3: "max-w-2xl",
    4: "max-w-4xl",
  }[step]

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-wine-red/20 backdrop-blur-sm"
        onClick={handleClose}
      />

      <div
        className={`relative bg-white rounded-2xl shadow-[0_32px_64px_-12px_rgba(126,20,35,0.2)] w-full ${maxWidthClass} max-h-[85vh] flex flex-col overflow-hidden transition-all duration-300`}
        onClick={(e) => e.stopPropagation()}
      >
          {step === 1 && (
            <Step1
              course={course}
              count={count}
              onCountChange={handleCountChange}
              onClose={handleClose}
              onNext={() => setStep(2)}
            />
          )}

          {step === 2 && (
            <Step2
              course={course}
              count={count}
              total={count * course.price}
              participants={participants}
              errors={step2Errors}
              onUpdateParticipant={(i, field, value) =>
                updateParticipant(i, field, value as string)
              }
              onBack={() => setStep(1)}
              onNext={() => {
                if (validateStep2()) setStep(3)
              }}
              onClose={handleClose}
            />
          )}

          {step === 3 && (
            <Step3
              course={course}
              total={count * course.price}
              participants={participants}
              invoice={invoice}
              onInvoiceChange={(updates) =>
                setInvoice((prev) => ({ ...prev, ...updates }))
              }
              onBack={() => setStep(2)}
              onNext={() => setStep(4)}
              onClose={handleClose}
            />
          )}

          {step === 4 && (
            <Step4
              course={course}
              count={count}
              participants={participants}
              invoice={invoice}
              voucherCode={voucherCode}
              voucherState={voucherState}
              voucherDiscount={voucherDiscount}
              agbAccepted={agbAccepted}
              datenschutzAccepted={datenschutzAccepted}
              paymentMethod={paymentMethod}
              onVoucherCodeChange={(v) => {
                setVoucherCode(v)
                if (voucherState !== "idle") {
                  setVoucherState("idle")
                  setVoucherDiscount(0)
                }
              }}
              onApplyVoucher={handleApplyVoucher}
              onAgbChange={setAgbAccepted}
              onDatenschutzChange={setDatenschutzAccepted}
              onPaymentMethodChange={setPaymentMethod}
              onGoToStep={(s) => setStep(s)}
              onBack={() => setStep(3)}
              onSubmit={handleSubmit}
              submitting={submitting}
              submitError={submitError}
              onClose={handleClose}
            />
          )}
      </div>
    </div>,
    document.body
  )
}
