# Database Reference

Supabase Postgres (eu-central-1, Frankfurt). Schema source of truth: `SPEC.md`.

This file is a usage reference — for migrations, the Supabase dashboard or migration files are authoritative.

---

## Tables

### courses

| Column | Type | Notes |
|---|---|---|
| id | uuid PK | `gen_random_uuid()` |
| created_at | timestamptz | `now()` |
| title | text NOT NULL | |
| slug | text NOT NULL UNIQUE | |
| description | text | |
| date | date NOT NULL | |
| start_time | time NOT NULL | |
| end_time | time NOT NULL | |
| location | text NOT NULL | |
| capacity | integer NOT NULL | |
| price_per_person | numeric(10,2) NOT NULL | |
| vat_rate | numeric(5,2) NOT NULL | default 19.00 |
| photo_url | text | Supabase Storage URL |
| food_options | text[] | default '{}' |
| status | text NOT NULL | 'draft' \| 'published' \| 'cancelled' \| 'archived' |

### bookings

| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| created_at | timestamptz | |
| course_id | uuid FK → courses.id | |
| user_id | uuid FK → auth.users.id | null for guest checkout |
| booking_number | text NOT NULL UNIQUE | Format: MF-YYYY-NNNNN |
| status | text NOT NULL | 'pending' \| 'confirmed' \| 'cancelled' \| 'refunded' |
| payment_method | text NOT NULL | 'card' \| 'sepa' \| 'bank_transfer' |
| payment_status | text NOT NULL | 'unpaid' \| 'paid' \| 'refunded' |
| stripe_session_id | text | |
| stripe_payment_intent | text | |
| total_amount | numeric(10,2) NOT NULL | Gross (VAT-inclusive) |
| vat_amount | numeric(10,2) NOT NULL | |
| voucher_id | uuid FK → vouchers.id | null if no voucher |
| voucher_discount | numeric(10,2) | default 0 |
| confirmation_email_sent | boolean | default false |

### participants

| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| booking_id | uuid FK → bookings.id | ON DELETE CASCADE |
| first_name | text NOT NULL | |
| last_name | text NOT NULL | |
| email | text NOT NULL | |
| phone | text | |
| food_preferences | text[] | e.g. ['vegetarisch', 'glutenfrei'] |
| food_notes | text | Free text for 'Sonstiges' |
| is_primary | boolean | default false — true for participant 1 |

### invoice_recipients

| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| booking_id | uuid FK → bookings.id | ON DELETE CASCADE |
| first_name | text NOT NULL | |
| last_name | text NOT NULL | |
| company_name | text | |
| address_line1 | text NOT NULL | |
| postal_code | text NOT NULL | |
| city | text NOT NULL | |
| country | text NOT NULL | default 'DE' |
| email | text NOT NULL | |
| vat_id | text | EU VAT ID — VIES validation deferred to v1.1 |
| is_business | boolean | default false — true if vat_id provided |

### vouchers

| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| created_at | timestamptz | |
| code | text NOT NULL UNIQUE | 12-char uppercase alphanumeric |
| value | numeric(10,2) NOT NULL | Original value in € |
| remaining_value | numeric(10,2) NOT NULL | Decremented on redemption |
| status | text NOT NULL | 'active' \| 'redeemed' \| 'expired' \| 'cancelled' |
| expires_at | date | null = no expiry; default: 3 years from purchase |
| purchaser_name | text NOT NULL | |
| purchaser_email | text NOT NULL | |
| recipient_name | text NOT NULL | |
| recipient_email | text | null if postal delivery |
| delivery_method | text NOT NULL | 'email' \| 'post' |
| postal_address | jsonb | Only when delivery_method = 'post' |
| personal_message | text | Max 200 chars |
| stripe_session_id | text | |
| payment_status | text NOT NULL | 'unpaid' \| 'paid' |
| postal_fee | numeric(10,2) | €2.00 flat in v1.0 |

### profiles

| Column | Type | Notes |
|---|---|---|
| id | uuid PK FK → auth.users.id | |
| first_name | text | |
| last_name | text | |
| email | text | |
| phone | text | |
| address_line1 | text | |
| postal_code | text | |
| city | text | |
| country | text | default 'DE' |
| created_at | timestamptz | |

---

## Row-level security (RLS) policies

Enable RLS on all tables.

| Table | Public read | Owner read | Admin full |
|---|---|---|---|
| courses | Published only | — | ✅ |
| bookings | No (guest: booking_number lookup only) | user_id = auth.uid() | ✅ |
| participants | No | Via booking ownership | ✅ |
| invoice_recipients | No | Via booking ownership | ✅ |
| vouchers | Code lookup for redemption validation | purchaser_email match | ✅ |
| profiles | No | id = auth.uid() | ✅ |

Admin role: Supabase custom JWT claims or separate `admin_users` table checked in API routes.

---

## Useful queries

```typescript
// Remaining capacity for a course
const remaining = course.capacity - count(bookings where course_id = X and status IN ('pending', 'confirmed'))

// Booking number format
`MF-${year}-${sequence.toString().padStart(5, '0')}`
// e.g. MF-2026-00142
```

---

## Data retention (GDPR / GoBD)

- Booking + payment records: **10 years** (tax law)
- User account data: while active + 3 years after last activity
- No hard deletion of booking or payment records
