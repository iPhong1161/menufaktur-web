"use client"

import { useState } from "react"
import { ShieldCheck, ShieldOff, KeyRound, CheckCircle } from "lucide-react"
import { promoteToAdmin, revokeAdmin, sendPasswordReset } from "@/app/admin/kunden/actions"

interface Props {
  userId: string
  userEmail: string
  userName: string
  isAdmin: boolean
  adminCount: number
}

export function AdminActions({ userId, userEmail, userName, isAdmin, adminCount }: Props) {
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [resetSent, setResetSent] = useState(false)
  const [confirmAction, setConfirmAction] = useState<"promote" | "revoke" | null>(null)

  async function handleAction(action: "promote" | "revoke") {
    setLoading(action)
    setError(null)
    const result = action === "promote"
      ? await promoteToAdmin(userId)
      : await revokeAdmin(userId)
    setLoading(null)
    setConfirmAction(null)
    if ("error" in result) setError(result.error)
  }

  async function handleResetPassword() {
    setLoading("reset")
    setError(null)
    const result = await sendPasswordReset(userEmail)
    setLoading(null)
    if ("error" in result) {
      setError(result.error)
    } else {
      setResetSent(true)
    }
  }

  const canRevokeAdmin = isAdmin && adminCount > 1

  return (
    <div className="bg-white rounded-xl border border-dark/5 shadow-sm p-8 space-y-6">
      <h2 className="text-xl font-bold text-wine-red">Aktionen</h2>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
          {error}
          <button onClick={() => setError(null)} className="ml-3 font-bold underline">Schließen</button>
        </div>
      )}

      {/* Confirm dialog */}
      {confirmAction && (
        <div className="p-5 bg-[#F8F5DA] rounded-xl border border-wine-red/20 space-y-4">
          <p className="font-bold text-dark text-sm">
            {confirmAction === "promote"
              ? `Möchten Sie ${userName} als Admin registrieren? Diese Person erhält vollen Zugriff auf das Admin-Dashboard.`
              : `Admin-Rechte von ${userName} wirklich entziehen?`}
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => handleAction(confirmAction)}
              disabled={loading !== null}
              className="px-5 py-2.5 bg-wine-red hover:bg-garnet-red text-white rounded-lg font-bold text-sm transition-colors disabled:opacity-60"
            >
              {loading ? "Bitte warten…" : "Bestätigen"}
            </button>
            <button
              onClick={() => setConfirmAction(null)}
              className="px-5 py-2.5 bg-white border border-dark/10 text-dark/60 rounded-lg font-bold text-sm hover:bg-dark/5 transition-colors"
            >
              Abbrechen
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {/* Promote to admin */}
        {!isAdmin && (
          <button
            onClick={() => setConfirmAction("promote")}
            disabled={loading !== null || confirmAction !== null}
            className="w-full flex items-center gap-3 px-5 py-4 bg-[#F8F5DA] hover:bg-[#ECE9CF] rounded-xl text-left transition-colors disabled:opacity-60 group"
          >
            <ShieldCheck className="w-5 h-5 text-wine-red shrink-0" />
            <div>
              <p className="font-bold text-dark text-sm">Als Admin registrieren</p>
              <p className="text-xs text-dark/40 font-condensed">Gewährt vollen Zugriff auf das Admin-Dashboard</p>
            </div>
          </button>
        )}

        {/* Revoke admin */}
        {canRevokeAdmin && (
          <button
            onClick={() => setConfirmAction("revoke")}
            disabled={loading !== null || confirmAction !== null}
            className="w-full flex items-center gap-3 px-5 py-4 bg-[#F8F5DA] hover:bg-red-50 rounded-xl text-left transition-colors disabled:opacity-60"
          >
            <ShieldOff className="w-5 h-5 text-red-500 shrink-0" />
            <div>
              <p className="font-bold text-dark text-sm">Admin-Rechte entziehen</p>
              <p className="text-xs text-dark/40 font-condensed">Entfernt den Administrator-Zugriff</p>
            </div>
          </button>
        )}

        {/* Password reset */}
        <button
          onClick={handleResetPassword}
          disabled={loading !== null || resetSent}
          className="w-full flex items-center gap-3 px-5 py-4 bg-[#F8F5DA] hover:bg-[#ECE9CF] rounded-xl text-left transition-colors disabled:opacity-60"
        >
          {resetSent
            ? <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
            : <KeyRound className="w-5 h-5 text-wine-red shrink-0" />
          }
          <div>
            <p className="font-bold text-dark text-sm">
              {resetSent ? "E-Mail wurde gesendet" : "Passwort zurücksetzen"}
            </p>
            <p className="text-xs text-dark/40 font-condensed">
              {resetSent
                ? `Eine Passwort-Reset-E-Mail wurde an ${userEmail} gesendet`
                : "Sendet eine Passwort-Reset-E-Mail an den Kunden"}
            </p>
          </div>
        </button>
      </div>
    </div>
  )
}
