// Shared by the contact form (client) and submitContactFormAction (server), so
// the required-field rule is defined once and cannot drift between the two.

export const CONTACT_CATEGORIES = [
  "Stornierung",
  "Terminverschiebung",
  "Allgemeine Frage",
  "Sonstiges",
] as const

export type ContactCategory = (typeof CONTACT_CATEGORIES)[number]

/** Default first option of the Kurs select — means "no course involved". */
export const NO_COURSE_OPTION = "Nicht kursbezogen"

export function isContactCategory(value: string): value is ContactCategory {
  return (CONTACT_CATEGORIES as readonly string[]).includes(value)
}
