"use client"

import { useState } from "react"
import { ShoppingCart } from "lucide-react"
import { VoucherModal } from "./VoucherModal"

export function VoucherButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-3 bg-wine-red hover:bg-garnet-red text-white font-bold px-10 py-5 rounded-xl shadow-lg transition-all hover:-translate-y-0.5 active:scale-95"
      >
        <ShoppingCart className="w-5 h-5" aria-hidden="true" />
        Gutschein jetzt kaufen
      </button>
      {open && <VoucherModal onClose={() => setOpen(false)} />}
    </>
  )
}
