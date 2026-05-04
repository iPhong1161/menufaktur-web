"use client"

import { useState } from "react"
import { UserPlus } from "lucide-react"
import { CustomerTable } from "@/components/admin/CustomerTable"
import { CreateCustomerModal } from "@/components/admin/CreateCustomerModal"
import type { AdminCustomer } from "@/lib/supabase/queries/admin-customers"

export function KundenClient({ customers }: { customers: AdminCustomer[] }) {
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      {/* Header */}
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-5xl font-bold text-wine-red tracking-tight mb-1">Kunden</h1>
          <p className="text-lg text-dark/50 font-condensed">
            {customers.length} registrierte{customers.length === 1 ? "r Kunde" : " Kunden"} im System.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 bg-wine-red text-white px-8 py-3 rounded-xl font-bold hover:bg-garnet-red transition-colors shadow-sm"
        >
          <UserPlus className="w-4 h-4" />
          Kunde anlegen
        </button>
      </div>

      <CustomerTable customers={customers} />

      {showModal && <CreateCustomerModal onClose={() => setShowModal(false)} />}
    </>
  )
}
