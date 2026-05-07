// Supabase Database type — used by createClient<Database>()
// Keep in sync with supabase/migrations/

export type Database = {
  public: {
    Tables: {
      courses: {
        Row: {
          id: string
          created_at: string
          title: string
          slug: string
          tagline: string | null
          category: string | null
          description: string | null
          date: string
          start_time: string
          end_time: string
          location: string
          address: string | null
          capacity: number
          price_per_person: number
          vat_rate: number
          photo_url: string | null
          food_options: string[]
          status: "draft" | "published" | "cancelled" | "archived"
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          slug: string
          tagline?: string | null
          category?: string | null
          description?: string | null
          date: string
          start_time: string
          end_time: string
          location: string
          address?: string | null
          capacity: number
          price_per_person: number
          vat_rate?: number
          photo_url?: string | null
          food_options?: string[]
          status?: "draft" | "published" | "cancelled" | "archived"
        }
        Update: Partial<Database["public"]["Tables"]["courses"]["Insert"]>
        Relationships: []
      }
      bookings: {
        Row: {
          id: string
          created_at: string
          course_id: string
          user_id: string | null
          booking_number: string
          status: "pending" | "confirmed" | "cancelled" | "refunded"
          payment_method: "card" | "sepa" | "bank_transfer"
          payment_status: "unpaid" | "paid" | "refunded"
          stripe_session_id: string | null
          stripe_payment_intent: string | null
          total_amount: number
          vat_amount: number
          voucher_id: string | null
          voucher_discount: number
          confirmation_email_sent: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          course_id: string
          user_id?: string | null
          booking_number: string
          status?: "pending" | "confirmed" | "cancelled" | "refunded"
          payment_method: "card" | "sepa" | "bank_transfer"
          payment_status?: "unpaid" | "paid" | "refunded"
          stripe_session_id?: string | null
          stripe_payment_intent?: string | null
          total_amount: number
          vat_amount: number
          voucher_id?: string | null
          voucher_discount?: number
          confirmation_email_sent?: boolean
        }
        Update: Partial<Database["public"]["Tables"]["bookings"]["Insert"]>
        Relationships: []
      }
      participants: {
        Row: {
          id: string
          booking_id: string
          first_name: string
          last_name: string
          email: string
          phone: string | null
          food_preferences: string[]
          food_notes: string | null
          is_primary: boolean
          cancelled: boolean
        }
        Insert: {
          id?: string
          booking_id: string
          first_name: string
          last_name: string
          email: string
          phone?: string | null
          food_preferences?: string[]
          food_notes?: string | null
          is_primary?: boolean
          cancelled?: boolean
        }
        Update: Partial<Database["public"]["Tables"]["participants"]["Insert"]>
        Relationships: []
      }
      invoice_recipients: {
        Row: {
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
        Insert: {
          id?: string
          booking_id: string
          first_name: string
          last_name: string
          company_name?: string | null
          address_line1: string
          postal_code: string
          city: string
          country?: string
          email: string
          vat_id?: string | null
          is_business?: boolean
        }
        Update: Partial<Database["public"]["Tables"]["invoice_recipients"]["Insert"]>
        Relationships: []
      }
      vouchers: {
        Row: {
          id: string
          created_at: string
          code: string
          value: number
          remaining_value: number
          status: "active" | "redeemed" | "expired" | "cancelled"
          expires_at: string | null
          purchaser_name: string
          purchaser_email: string
          recipient_name: string
          recipient_email: string | null
          delivery_method: "email" | "post"
          postal_address: Record<string, string> | null
          personal_message: string | null
          stripe_session_id: string | null
          payment_status: "unpaid" | "paid" | "refunded"
          postal_fee: number
        }
        Insert: {
          id?: string
          created_at?: string
          code: string
          value: number
          remaining_value?: number
          status?: "active" | "redeemed" | "expired" | "cancelled"
          expires_at?: string | null
          purchaser_name: string
          purchaser_email: string
          recipient_name: string
          recipient_email?: string | null
          delivery_method: "email" | "post"
          postal_address?: Record<string, string> | null
          personal_message?: string | null
          stripe_session_id?: string | null
          payment_status?: "unpaid" | "paid" | "refunded"
          postal_fee?: number
        }
        Update: Partial<Database["public"]["Tables"]["vouchers"]["Insert"]>
        Relationships: []
      }
      profiles: {
        Row: {
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
          preferred_payment_method: "card" | "sepa" | "bank_transfer" | null
        }
        Insert: {
          id: string
          first_name?: string | null
          last_name?: string | null
          email?: string | null
          phone?: string | null
          address_line1?: string | null
          postal_code?: string | null
          city?: string | null
          country?: string
          created_at?: string
          preferred_payment_method?: "card" | "sepa" | "bank_transfer" | null
        }
        Update: Partial<Omit<Database["public"]["Tables"]["profiles"]["Insert"], "id">>
        Relationships: []
      }
      admin_users: {
        Row: {
          id: string
          user_id: string
          created_at: string
          role: string | null
        }
        Insert: {
          id?: string
          user_id: string
          created_at?: string
          role?: string | null
        }
        Update: Partial<Omit<Database["public"]["Tables"]["admin_users"]["Insert"], "id">>
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: {
      create_booking_atomic: {
        Args: {
          p_course_id: string
          p_user_id: string | null
          p_payment_method: string
          p_total_amount: number
          p_vat_amount: number
          p_voucher_discount: number
          p_participants: unknown
          p_invoice_recipient: unknown
        }
        Returns: { booking_number: string; id: string }
      }
      next_booking_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: Record<string, never>
  }
}
