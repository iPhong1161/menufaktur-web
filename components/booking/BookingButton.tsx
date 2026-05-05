"use client"

import { useState } from "react"
import { BookingModal } from "./BookingModal"
import type { CourseData } from "@/lib/data/courses"

interface Props {
  course: CourseData
}

export function BookingButton({ course }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full py-4 bg-wine-red hover:bg-garnet-red text-white rounded-xl font-bold text-base transition-colors duration-200 active:scale-[0.98]"
      >
        Jetzt buchen
      </button>

      {open && (
        <BookingModal course={course} onClose={() => setOpen(false)} />
      )}
    </>
  )
}
