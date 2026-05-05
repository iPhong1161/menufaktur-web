"use client"

import { useState, useTransition } from "react"
import { Trash2, Plus, X, Loader2 } from "lucide-react"
import { removeParticipantAction, addParticipantAction, type AddParticipantData } from "@/app/admin/buchungen/actions"

interface Participant {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string | null
  food_preferences: string[]
  food_notes: string | null
  is_primary: boolean
}

interface Props {
  bookingId: string
  bookingNumber: string
  courseId: string
  participants: Participant[]
  isCancelled: boolean
}

const FOOD_OPTIONS = [
  { value: "vegetarisch", label: "Vegetarisch" },
  { value: "vegan", label: "Vegan" },
  { value: "glutenfrei", label: "Glutenfrei" },
  { value: "laktosefrei", label: "Laktosefrei" },
  { value: "nussallergie", label: "Nussallergie" },
]

const EMPTY_FORM: AddParticipantData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  foodPreferences: [],
}

export function ParticipantManager({
  bookingId,
  bookingNumber,
  courseId,
  participants,
  isCancelled,
}: Props) {
  const [confirmRemoveId, setConfirmRemoveId] = useState<string | null>(null)
  const [rowError, setRowError] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [form, setForm] = useState<AddParticipantData>(EMPTY_FORM)
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof AddParticipantData, string>>>({})
  const [addError, setAddError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleRemoveClick(id: string) {
    setConfirmRemoveId(id)
    setRowError(null)
  }

  function handleRemoveConfirm(participantId: string) {
    startTransition(async () => {
      const result = await removeParticipantAction(participantId, bookingId, bookingNumber)
      if ("error" in result) {
        setRowError(result.error)
        setConfirmRemoveId(null)
      } else {
        setConfirmRemoveId(null)
      }
    })
  }

  function validateForm(): boolean {
    const errors: Partial<Record<keyof AddParticipantData, string>> = {}
    if (!form.firstName.trim()) errors.firstName = "Pflichtfeld"
    if (!form.lastName.trim()) errors.lastName = "Pflichtfeld"
    if (!form.email.trim()) errors.email = "Pflichtfeld"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = "Ungültige E-Mail"
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  function handleAddSubmit() {
    if (!validateForm()) return
    setAddError(null)
    startTransition(async () => {
      const result = await addParticipantAction(bookingId, bookingNumber, courseId, form)
      if ("error" in result) {
        setAddError(result.error)
      } else {
        setShowAddForm(false)
        setForm(EMPTY_FORM)
        setFormErrors({})
      }
    })
  }

  function toggleFoodPref(value: string) {
    setForm((prev) => ({
      ...prev,
      foodPreferences: prev.foodPreferences.includes(value)
        ? prev.foodPreferences.filter((f) => f !== value)
        : [...prev.foodPreferences, value],
    }))
  }

  return (
    <section className="bg-white rounded-xl p-8 shadow-sm border border-dark/5">
      <h2 className="text-2xl font-bold text-wine-red mb-6">
        Teilnehmer ({participants.length})
      </h2>

      <div className="space-y-5">
        {participants.map((p, i) => {
          const initials = `${p.first_name[0] ?? ""}${p.last_name[0] ?? ""}`.toUpperCase()
          const foods = p.food_preferences.length > 0 ? p.food_preferences : ["Keine Angabe"]
          const isConfirming = confirmRemoveId === p.id
          const isRemoving = isPending && confirmRemoveId === p.id

          return (
            <div
              key={p.id}
              className={`flex items-start justify-between gap-4 ${i < participants.length - 1 ? "pb-5 border-b border-dark/8" : ""}`}
            >
              {/* Participant info */}
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="w-11 h-11 rounded-full bg-wine-red/10 flex items-center justify-center text-wine-red font-bold text-sm shrink-0">
                  {initials}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-dark">
                    {p.first_name} {p.last_name}
                    {p.is_primary && (
                      <span className="ml-2 text-[10px] text-wine-red/60 font-bold uppercase tracking-widest">
                        Kontakt
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-dark/40 font-condensed">{p.email}</p>
                  {p.phone && (
                    <p className="text-xs text-dark/30 font-condensed">{p.phone}</p>
                  )}
                  <div className="flex gap-2 mt-1 flex-wrap">
                    {foods.map((f) => (
                      <span key={f} className="text-xs px-2 py-0.5 rounded bg-dark/8 text-dark/50 font-bold">
                        {f}
                      </span>
                    ))}
                  </div>
                  {p.food_notes && (
                    <p className="text-xs text-dark/50 font-condensed mt-1 italic">{p.food_notes}</p>
                  )}
                </div>
              </div>

              {/* Remove action */}
              {!isCancelled && (
                <div className="shrink-0 flex items-center gap-2">
                  {isConfirming ? (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-dark/60 font-condensed whitespace-nowrap">Teilnehmer entfernen?</span>
                      <button
                        onClick={() => handleRemoveConfirm(p.id)}
                        disabled={isRemoving}
                        className="px-3 py-1 bg-wine-red text-white text-xs font-bold rounded-lg hover:bg-garnet-red transition-colors disabled:opacity-50 flex items-center gap-1"
                      >
                        {isRemoving && <Loader2 className="w-3 h-3 animate-spin" />}
                        Ja
                      </button>
                      <button
                        onClick={() => setConfirmRemoveId(null)}
                        disabled={isRemoving}
                        className="px-3 py-1 bg-dark/8 text-dark text-xs font-bold rounded-lg hover:bg-dark/12 transition-colors"
                      >
                        Abbrechen
                      </button>
                    </div>
                  ) : p.is_primary ? (
                    <button
                      disabled
                      title="Hauptteilnehmer kann nicht entfernt werden — Buchung stornieren, um den Kontakt zu ändern"
                      className="p-2 text-dark/20 cursor-not-allowed rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleRemoveClick(p.id)}
                      className="p-2 text-dark/30 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Teilnehmer entfernen"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {rowError && (
        <p className="mt-4 text-sm text-red-600 font-condensed">{rowError}</p>
      )}

      {/* Add participant */}
      {!isCancelled && (
        <div className="mt-6 pt-6 border-t border-dark/8">
          {!showAddForm ? (
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center gap-2 text-sm font-bold text-wine-red hover:text-garnet-red transition-colors"
            >
              <Plus className="w-4 h-4" />
              Teilnehmer hinzufügen
            </button>
          ) : (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-dark uppercase tracking-widest">Neuer Teilnehmer</h3>
                <button
                  onClick={() => { setShowAddForm(false); setForm(EMPTY_FORM); setFormErrors({}); setAddError(null) }}
                  className="p-1 text-dark/30 hover:text-dark/60 rounded transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-dark/40 mb-1.5">
                    Vorname *
                  </label>
                  <input
                    type="text"
                    value={form.firstName}
                    onChange={(e) => { setForm((p) => ({ ...p, firstName: e.target.value })); setFormErrors((p) => ({ ...p, firstName: undefined })) }}
                    className={`w-full bg-[#F8F5DA] rounded-lg px-3 py-2.5 text-sm text-dark outline-none border-2 transition-colors ${formErrors.firstName ? "border-red-400" : "border-transparent focus:border-wine-red"}`}
                  />
                  {formErrors.firstName && <p className="text-xs text-red-500 mt-1">{formErrors.firstName}</p>}
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-dark/40 mb-1.5">
                    Nachname *
                  </label>
                  <input
                    type="text"
                    value={form.lastName}
                    onChange={(e) => { setForm((p) => ({ ...p, lastName: e.target.value })); setFormErrors((p) => ({ ...p, lastName: undefined })) }}
                    className={`w-full bg-[#F8F5DA] rounded-lg px-3 py-2.5 text-sm text-dark outline-none border-2 transition-colors ${formErrors.lastName ? "border-red-400" : "border-transparent focus:border-wine-red"}`}
                  />
                  {formErrors.lastName && <p className="text-xs text-red-500 mt-1">{formErrors.lastName}</p>}
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-dark/40 mb-1.5">
                    E-Mail *
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => { setForm((p) => ({ ...p, email: e.target.value })); setFormErrors((p) => ({ ...p, email: undefined })) }}
                    className={`w-full bg-[#F8F5DA] rounded-lg px-3 py-2.5 text-sm text-dark outline-none border-2 transition-colors ${formErrors.email ? "border-red-400" : "border-transparent focus:border-wine-red"}`}
                  />
                  {formErrors.email && <p className="text-xs text-red-500 mt-1">{formErrors.email}</p>}
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-dark/40 mb-1.5">
                    Telefon
                  </label>
                  <input
                    type="tel"
                    value={form.phone ?? ""}
                    onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                    className="w-full bg-[#F8F5DA] rounded-lg px-3 py-2.5 text-sm text-dark outline-none border-2 border-transparent focus:border-wine-red transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-dark/40 mb-2">
                  Ernährung
                </label>
                <div className="flex flex-wrap gap-2">
                  {FOOD_OPTIONS.map(({ value, label }) => {
                    const checked = form.foodPreferences.includes(value)
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => toggleFoodPref(value)}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold border-2 transition-colors ${
                          checked
                            ? "bg-wine-red text-white border-wine-red"
                            : "bg-transparent text-dark/50 border-dark/15 hover:border-wine-red/40"
                        }`}
                      >
                        {label}
                      </button>
                    )
                  })}
                </div>
              </div>

              {addError && (
                <p className="text-sm text-red-600 font-condensed">{addError}</p>
              )}

              <div className="flex items-center gap-3">
                <button
                  onClick={handleAddSubmit}
                  disabled={isPending}
                  className="inline-flex items-center gap-2 bg-wine-red hover:bg-garnet-red text-white text-sm font-bold px-6 py-2.5 rounded-xl transition-colors disabled:opacity-50"
                >
                  {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                  Teilnehmer hinzufügen
                </button>
                <button
                  onClick={() => { setShowAddForm(false); setForm(EMPTY_FORM); setFormErrors({}); setAddError(null) }}
                  className="text-sm font-bold text-dark/40 hover:text-dark/60 transition-colors"
                >
                  Abbrechen
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  )
}
