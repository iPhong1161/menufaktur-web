# API Routes Reference

All routes live under `/app/api/`. All responses use consistent error shape: `{ error: string, code?: string }`.

Stripe webhook errors always return HTTP 200 to Stripe even on internal processing failure — log internally and never let retries flood the system.

---

## Bookings — `/api/bookings`

### POST `/api/bookings`
Creates a new booking.

**Request body:**
```typescript
{
  course_id: string
  participants: {
    first_name: string
    last_name: string
    email: string
    phone?: string
    food_preferences?: string[]
    food_notes?: string
  }[]
  invoice_recipient: {
    use_participant_1: boolean
    first_name?: string
    last_name?: string
    company_name?: string
    address_line1?: string
    postal_code?: string
    city?: string
    country?: string
    email?: string
    vat_id?: string
  }
  payment_method: 'card' | 'sepa' | 'bank_transfer'
  voucher_code?: string
}
```

**Response (success):**
```typescript
{
  booking_id: string
  booking_number: string
  stripe_checkout_url?: string  // present for card/sepa payments
  bank_details?: {              // present for bank_transfer
    iban: string
    bic: string
    reference: string
    amount: number
  }
}
```

### GET `/api/bookings/[id]`
Returns booking details. Requires auth or valid booking_number query param for guest access.

---

## Courses — `/api/courses`

### GET `/api/courses`
Returns published courses. Accepts query params: `?status=published` (default), `?limit=`, `?offset=`.

### GET `/api/courses/[slug]`
Returns a single course by slug. Includes remaining capacity.

---

## Vouchers — `/api/vouchers`

### POST `/api/vouchers`
Creates a new voucher purchase and Stripe Checkout session.

**Request body:**
```typescript
{
  value: number           // 10–500
  purchaser_name: string
  purchaser_email: string
  recipient_name: string
  recipient_email?: string
  delivery_method: 'email' | 'post'
  postal_address?: object
  personal_message?: string
}
```

**Response:** `{ voucher_id: string, stripe_checkout_url: string }`

### POST `/api/vouchers/validate`
Validates a voucher code for use in booking flow.

**Request body:** `{ code: string, booking_total: number }`

**Response:** `{ valid: boolean, remaining_value?: number, error?: string }`

---

## Stripe webhook — `/api/webhooks/stripe`

### POST `/api/webhooks/stripe`
Handles Stripe events. Verifies `stripe-signature` header with `STRIPE_WEBHOOK_SECRET`.

**Handled events:**

| Event | Action |
|---|---|
| `checkout.session.completed` | Update booking or voucher to paid/confirmed, send confirmation email |
| `checkout.session.expired` | Log — cron will clean up pending bookings after 24h |
| `payment_intent.payment_failed` | Log error, notify admin if needed |
| `charge.refunded` | Update payment_status to 'refunded' |

**Always returns HTTP 200** — even on processing error. Log error internally.

---

## Admin routes (protected — admin session required)

### GET `/api/admin/bookings`
All bookings with filters: `?course_id=`, `?status=`, `?payment_status=`, `?from=`, `?to=`.

### PATCH `/api/admin/bookings/[id]/mark-paid`
Marks a bank_transfer booking as paid. Triggers confirmation email.

### GET `/api/admin/bookings/export`
CSV export of all bookings.

### GET `/api/admin/courses`
All courses (all statuses).

### POST `/api/admin/courses`
Create a course.

### PATCH `/api/admin/courses/[id]`
Update a course.

### DELETE `/api/admin/courses/[id]`
Delete a course. Returns 409 if confirmed bookings exist.

### PATCH `/api/admin/vouchers/[id]/deactivate`
Sets voucher status to 'cancelled'.

---

## Error codes

| Code | Meaning |
|---|---|
| `COURSE_NOT_FOUND` | Course slug/ID does not exist |
| `COURSE_FULL` | No remaining capacity |
| `VOUCHER_INVALID` | Code not found |
| `VOUCHER_EXPIRED` | expires_at in the past |
| `VOUCHER_REDEEMED` | remaining_value = 0 |
| `VOUCHER_CANCELLED` | Status = cancelled |
| `DUPLICATE_BOOKING` | Same course + participant email already confirmed |
| `BOOKING_NOT_FOUND` | ID does not match |
| `PAYMENT_REQUIRED` | Booking exists but unpaid |
