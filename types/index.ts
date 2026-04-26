// Shared TypeScript types — mirrors the Supabase database schema in SPEC.md

export type CourseStatus = "draft" | "published" | "cancelled" | "archived"
export type BookingStatus = "pending" | "confirmed" | "cancelled" | "refunded"
export type PaymentMethod = "card" | "sepa" | "bank_transfer"
export type PaymentStatus = "unpaid" | "paid" | "refunded"
export type VoucherStatus = "active" | "redeemed" | "expired" | "cancelled"
export type DeliveryMethod = "email" | "post"

export interface Course {
  id: string
  created_at: string
  title: string
  slug: string
  description: string | null
  date: string
  start_time: string
  end_time: string
  location: string
  capacity: number
  price_per_person: number
  vat_rate: number
  photo_url: string | null
  food_options: string[]
  status: CourseStatus
}

export interface Booking {
  id: string
  created_at: string
  course_id: string
  user_id: string | null
  booking_number: string
  status: BookingStatus
  payment_method: PaymentMethod
  payment_status: PaymentStatus
  stripe_session_id: string | null
  stripe_payment_intent: string | null
  total_amount: number
  vat_amount: number
  voucher_id: string | null
  voucher_discount: number
  confirmation_email_sent: boolean
}

export interface Participant {
  id: string
  booking_id: string
  first_name: string
  last_name: string
  email: string
  phone: string | null
  food_preferences: string[]
  food_notes: string | null
  is_primary: boolean
}

export interface InvoiceRecipient {
  id: string
  booking_id: string
  first_name: string
  last_name: string
  company_name: string | null
  address_line1: string
  postal_code: string
  city: string
  country: string
  email: string
  vat_id: string | null
  is_business: boolean
}

export interface Voucher {
  id: string
  created_at: string
  code: string
  value: number
  remaining_value: number
  status: VoucherStatus
  expires_at: string | null
  purchaser_name: string
  purchaser_email: string
  recipient_name: string
  recipient_email: string | null
  delivery_method: DeliveryMethod
  postal_address: Record<string, string> | null
  personal_message: string | null
  stripe_session_id: string | null
  payment_status: PaymentStatus
  postal_fee: number
}

export interface Profile {
  id: string
  first_name: string | null
  last_name: string | null
  email: string | null
  phone: string | null
  address_line1: string | null
  postal_code: string | null
  city: string | null
  country: string
  created_at: string
}

// Derived / UI-layer types

export interface CourseWithCapacity extends Course {
  booked_count: number
  remaining_capacity: number
}

export interface BookingWithDetails extends Booking {
  course: Course
  participants: Participant[]
  invoice_recipient: InvoiceRecipient | null
  voucher: Voucher | null
}

// Booking flow state (client-side only)
export interface BookingFlowState {
  course: Course
  participant_count: number
  participants: Partial<Participant>[]
  invoice_recipient: Partial<InvoiceRecipient> & { use_participant_1: boolean }
  voucher_code: string
  voucher: Pick<Voucher, "code" | "remaining_value"> | null
  payment_method: PaymentMethod | null
}

// Food preference options
export const FOOD_PREFERENCES = [
  "Vegetarisch",
  "Vegan",
  "Glutenfrei",
  "Laktosefrei",
  "Nussallergie",
] as const

export type FoodPreference = (typeof FOOD_PREFERENCES)[number]
