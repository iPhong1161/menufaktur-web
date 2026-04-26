# SPEC.md — menufaktur Website v1.0

This document is the authoritative specification for the menufaktur cooking school website v1.0. Claude Code should read this at the start of every session. All decisions about business logic, data structure, and user flows must align with this document.

---

## Project overview

**Client:** menufaktur — cooking school in Frankfurt-Bornheim, founded 2007
**Site language:** German (formal "Sie" throughout)
**Domain:** managed at DomainFactory, pointed at Vercel
**Goal of v1.0:** A customer can discover a course, book it or purchase a voucher, pay, and receive confirmation. The client can manage courses and bookings via an admin interface.

---

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15, TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| Database | Supabase Postgres (eu-central-1, Frankfurt) |
| Auth | Supabase Auth |
| Storage | Supabase Storage |
| Payments | Stripe (card, SEPA) + bank transfer (manual) |
| Email | Resend (transactional only) |
| Hosting | Vercel |
| Source control | GitHub |
| Error monitoring | Sentry |
| Analytics | Plausible |
| Cookie consent | Cookiebot or Usercentrics |

**Environment variables** (never hardcode, always use .env.local):
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `RESEND_API_KEY`
- `NEXT_PUBLIC_SITE_URL`

---

## Brand

- **Primary:** Wine Red `#7E1423`
- **Light:** Light Beige `#FFFCE1`
- **Accent:** Gold Yellow `#F15A22`
- **Secondary:** Garnet Red `#A72335`
- **Text:** Dark `#2A2A2A`
- **Font:** Roboto (Bold for headings, Regular for sub-headings, Condensed Light for body)
- **Tone:** Calm, confident, warmly professional. German, formal "Sie".

Full brand rules: see `BRAND_GUIDE.md`
Logo rules: see `LOGO_USAGE.md`

---

## v1.0 scope

### In scope
- Marketing site (home, course catalog, course detail, about us, private events, contact, legal pages)
- Course management (admin creates, edits, publishes courses)
- Booking flow (modal, multi-step, multi-participant)
- Payments (Stripe card + SEPA, bank transfer)
- Automated confirmation emails (booking, voucher purchase)
- Vouchers (purchase, personalise, redeem against courses)
- User accounts (signup, login, account page with booking history and voucher history tab)
- Basic admin (course management, booking overview, booking detail, customer list, voucher list, settings, mark bank transfer paid)
- GDPR essentials (Impressum, Datenschutz, AGB, cookie banner)

### Explicitly out of scope for v1.0
- PayPal (evaluate for v1.1 based on client demand)
- lexoffice invoicing (Stripe receipts as stopgap)
- Brevo marketing email (Resend for transactional only)
- Waiting lists
- Recipe engine + Word document generation
- Reporting dashboard
- CRM features
- Email automation (birthday, marketing flows)
- English version
- Blog, FAQ, press section
- Rating and review system
- Picture upload portal
- Discount engine
- Recycling bin / restore

---

## Database schema

### Table: courses
```
id              uuid primary key default gen_random_uuid()
created_at      timestamptz default now()
title           text not null
slug            text not null unique
description     text
date            date not null
start_time      time not null
end_time        time not null
location        text not null
capacity        integer not null
price_per_person numeric(10,2) not null
vat_rate        numeric(5,2) not null default 19.00
photo_url       text
food_options    text[] default '{}'
status          text not null default 'draft'
  -- values: 'draft', 'published', 'cancelled', 'archived'
```

### Table: bookings
```
id              uuid primary key default gen_random_uuid()
created_at      timestamptz default now()
course_id       uuid references courses(id)
user_id         uuid references auth.users(id) null
  -- null if guest checkout
booking_number  text not null unique
  -- format: MF-YYYY-NNNNN (e.g. MF-2026-00142)
status          text not null default 'pending'
  -- values: 'pending', 'confirmed', 'cancelled', 'refunded'
payment_method  text not null
  -- values: 'card', 'sepa', 'bank_transfer'
payment_status  text not null default 'unpaid'
  -- values: 'unpaid', 'paid', 'refunded'
stripe_session_id       text
stripe_payment_intent   text
total_amount    numeric(10,2) not null
vat_amount      numeric(10,2) not null
voucher_id      uuid references vouchers(id) null
voucher_discount numeric(10,2) default 0
confirmation_email_sent boolean default false
```

### Table: participants
```
id              uuid primary key default gen_random_uuid()
booking_id      uuid references bookings(id) on delete cascade
first_name      text not null
last_name       text not null
email           text not null
phone           text
food_preferences text[]
  -- e.g. ['vegetarisch', 'glutenfrei']
food_notes      text
  -- free text for 'Sonstiges'
is_primary      boolean default false
  -- true for participant 1 (used as default invoice recipient)
```

### Table: invoice_recipients
```
id              uuid primary key default gen_random_uuid()
booking_id      uuid references bookings(id) on delete cascade
first_name      text not null
last_name       text not null
company_name    text
address_line1   text not null
postal_code     text not null
city            text not null
country         text not null default 'DE'
email           text not null
vat_id          text
  -- EU VAT ID for B2B (v1.1 will validate via VIES)
is_business     boolean default false
```

### Table: vouchers
```
id              uuid primary key default gen_random_uuid()
created_at      timestamptz default now()
code            text not null unique
  -- auto-generated, 12 chars uppercase alphanumeric
value           numeric(10,2) not null
  -- original value in €
remaining_value numeric(10,2) not null
  -- decremented on redemption
status          text not null default 'active'
  -- values: 'active', 'redeemed', 'expired', 'cancelled'
expires_at      date
purchaser_name  text not null
purchaser_email text not null
recipient_name  text not null
recipient_email text
  -- null if postal delivery
delivery_method text not null default 'email'
  -- values: 'email', 'post'
postal_address  jsonb
  -- only for delivery_method = 'post'
personal_message text
stripe_session_id text
payment_status  text not null default 'unpaid'
  -- values: 'unpaid', 'paid'
postal_fee      numeric(10,2) default 0
  -- €2 base + €0.20 per additional person (see postal fee logic)
```

### Table: profiles
```
id              uuid primary key references auth.users(id)
first_name      text
last_name       text
email           text
phone           text
address_line1   text
postal_code     text
city            text
country         text default 'DE'
created_at      timestamptz default now()
```

---

## Row-level security (RLS) policies

Enable RLS on all tables. Key policies:

**courses:** Public read for published courses. Admin full access.

**bookings:** Users can read their own bookings (where user_id = auth.uid()). Admin full access. Guest bookings readable via booking_number lookup only (no auth required for confirmation page).

**participants:** Readable by the booking owner and admin only.

**invoice_recipients:** Same as participants.

**vouchers:** Purchaser can read their own vouchers. Admin full access. Public can validate a voucher code for redemption (read-only, code lookup).

**profiles:** Users can read and update their own profile only.

Admin role: implement via Supabase custom claims or a separate `admin_users` table checked in API routes.

---

## Page routes

### Public site
```
/                               Home
/kurse                          Course catalog
/kurse/[slug]                   Course detail
/buchung/[slug]                 Booking flow (modal, triggered from course detail)
/buchung/bestaetigung/[id]      Booking confirmation (full page)
/gutschein                      Voucher purchase page
/gutschein/bestaetigung/[id]    Voucher purchase confirmation
/konto                          Customer account (requires auth)
/konto/buchungen                Booking history
/login                          Customer login
/registrieren                   Customer signup
/passwort-zuruecksetzen         Password reset
/impressum                      Impressum
/datenschutz                    Datenschutzerklärung
/agb                            AGB
```

### Admin
```
/admin                          Redirects to /admin/dashboard
/admin/login                    Admin login (separate from customer login)
/admin/dashboard                Dashboard with KPIs and quick overview
/admin/kurse                    Course list
/admin/kurse/neu                Create course
/admin/kurse/[id]/bearbeiten    Edit course
/admin/buchungen                Booking list
/admin/buchungen/[id]           Booking detail
/admin/gutscheine               Voucher list
/admin/kunden                   Customer list
/admin/einstellungen            Settings
```

---

## Booking flow — business rules

### Trigger
User clicks "Kurs buchen" on course detail page. A modal overlay opens on top of the blurred course detail page. The modal has 4 steps.

### Capacity check
Before opening the modal, check remaining capacity:
```
remaining = course.capacity - count of confirmed + pending bookings for this course
```
If remaining = 0, show "Auf Warteliste setzen" instead of "Kurs buchen" (v1.0: captures email only, no full waitlist logic).

### Step 1 — Teilnehmerzahl
- Number selector, min 1, max = remaining capacity
- Live price preview: `participants × price_per_person`
- If a voucher will be applied, show discounted total (but voucher entry is in step 4)

### Step 2 — Teilnehmerdaten
- One form card per participant
- Fields per participant: Vorname (required), Nachname (required), Email (required), Telefon (optional), Essenspräferenzen (multi-select chips), Sonstiges Allergien/Notizen (free text, optional)
- Food preference options: Vegetarisch, Vegan, Glutenfrei, Laktosefrei, Nussallergie
- Participant 1 is marked `is_primary = true`

### Step 3 — Rechnungsempfänger
- Default: "Rechnung an Teilnehmer 1" — pre-fills from participant 1 data
- Option: "Anderer Rechnungsempfänger" — reveals full address form
- Fields: Vorname, Nachname, Firmenname (optional), Straße + Hausnummer, PLZ, Stadt, Land (default DE), Email, USt-IdNr (optional)
- If USt-IdNr is entered, set `is_business = true` on the invoice recipient
- Note: B2B 0% reverse charge VAT validation via VIES deferred to v1.1. In v1.0, all invoices use 19% VAT regardless of B2B status.

### Step 4 — Übersicht & Bestätigung
- Summary of course, participants, invoice recipient, price breakdown
- Voucher code field: user enters code → validate against `vouchers` table:
  - Code must exist, status = 'active', not expired, remaining_value > 0
  - Deduct from total (full deduction only in v1.0 — partial redemption in v1.1)
  - If voucher value ≥ total, booking is free (no Stripe session needed)
- Price breakdown display:
  ```
  X Teilnehmer × €89 = €178
  Gutschein: -€50
  Zwischensumme: €128
  MwSt. (19%): €20.42 (included)
  Gesamtbetrag: €128
  ```
- Two required checkboxes: AGB, Datenschutzerklärung
- "Buchung absenden" button disabled until both checked

### Step 5 — Zahlung (not a modal step — redirects to Stripe or bank info)
- **Card / SEPA:** Create Stripe Checkout session → redirect to Stripe → on success, Stripe webhook updates booking status → redirect to confirmation page
- **Bank transfer:** Create booking with status = 'pending', payment_status = 'unpaid' → show bank details and reference number → redirect to confirmation page with "Zahlung ausstehend" status

### Post-booking
- Booking number generated: `MF-{YEAR}-{5-digit-padded-sequence}`
- Confirmation email sent via Resend (see email section)
- Customer account created automatically if email matches existing account, or guest booking otherwise

### Edge cases
- If Stripe session expires without payment: booking remains 'pending' for 24 hours, then cron job (Supabase Edge Function) cancels it and restores capacity
- If two users book simultaneously and one takes the last spot: the second user sees an error at payment stage ("Dieser Platz wurde soeben vergeben") and is offered the waitlist
- Duplicate booking prevention: check for existing confirmed booking with same course_id + participant email before creating

---

## Voucher purchase flow — business rules

### Voucher purchase page `/gutschein`
- Select value: preset options (€50, €100, €150, €200) or custom amount (min €10, max €500)
- Personalise:
  - Purchaser name + email (required)
  - Recipient name (required)
  - Recipient email (required for email delivery, optional for postal)
  - Personal message (optional, max 200 chars)
  - Delivery method: Email or Post
- Postal delivery additional fields: full address for the recipient
- Postal fee logic:
  - Base fee: €2.00
  - Additional per person beyond 1: €0.20
  - In v1.0, vouchers are single-recipient, so postal fee = €2.00 flat
  - Show postal fee clearly in the price breakdown
- Expiry: default 3 years from purchase date (configurable in admin settings later)

### Voucher payment
- Payment via Stripe Checkout (card + SEPA)
- On payment success:
  - Generate unique voucher code (12-char uppercase alphanumeric, check uniqueness in DB)
  - Set `remaining_value` = purchased value
  - Set `expires_at` = purchase date + 3 years
  - Set `status` = 'active'
  - Send confirmation email to purchaser
  - Send voucher email to recipient (if email delivery)
  - Postal delivery: flag in admin for manual printing and sending

### Voucher redemption
- Entered in booking flow Step 4
- Validation:
  - Code exists in database
  - Status = 'active'
  - Not expired (`expires_at` > today or null)
  - `remaining_value` > 0
- In v1.0: full redemption only
  - If voucher value ≥ booking total: booking is free, voucher `remaining_value` set to `remaining_value - total`, status set to 'redeemed' if remaining_value = 0
  - If voucher value < booking total: customer pays the difference via Stripe
- On booking confirmed: update voucher `remaining_value`, update `status` if fully redeemed
- One voucher per booking in v1.0

### VAT on vouchers (German tax law)
- Voucher purchase: no VAT due at point of sale (vouchers are multi-purpose vouchers in German law)
- VAT is due when the voucher is redeemed against a course
- In v1.0: display no VAT on voucher purchase receipt, show 19% VAT on the booking invoice when redeemed
- Do not get this wrong — consult with the client's tax advisor before launch

---

## Email flows (Resend)

### 1. Booking confirmation email
**Trigger:** Stripe webhook `checkout.session.completed` or admin marks bank transfer as paid
**To:** Invoice recipient email (and participant 1 email if different)
**Subject:** "Buchungsbestätigung – [Course title] am [Date]"
**Content:**
- Warm greeting
- Booking number
- Course details (title, date, time, location)
- Participant list (names only)
- Total paid
- "Was passiert als nächstes" section (arrive 10 min early, bring nothing, recipes provided)
- Contact info

### 2. Bank transfer pending email
**Trigger:** Booking created with payment_method = 'bank_transfer'
**To:** Invoice recipient email
**Subject:** "Buchungsanfrage erhalten – [Course title]"
**Content:**
- Booking received confirmation
- Bank details for transfer:
  - IBAN: [from admin settings]
  - BIC: [from admin settings]
  - Reference: booking number (MF-2026-00142)
  - Amount: total
- Note that booking is confirmed once payment is received
- Payment deadline: 7 days (configurable)

### 3. Voucher purchase confirmation (to purchaser)
**Trigger:** Stripe webhook for voucher payment
**To:** Purchaser email
**Subject:** "Ihr Gutschein für menufaktur"
**Content:**
- Thank you message
- Voucher details (value, expiry, recipient name)
- Note about delivery (email sent to recipient / post will follow)

### 4. Voucher delivery email (to recipient)
**Trigger:** Same as above, sent after purchaser confirmation
**To:** Recipient email
**Subject:** "[Purchaser name] schenkt Ihnen einen menufaktur-Gutschein"
**Content:**
- Warm personal message from purchaser (if provided)
- Voucher code (large, prominent)
- Value and expiry date
- Instructions for redemption (book a course at menufaktur.de, enter code at checkout)

### Email templates
- Build as React Email templates (works natively with Resend and Next.js)
- Use brand colors: Wine Red header, Light Beige background, Gold Yellow CTA button
- Mobile responsive
- Plain text fallback

---

## Admin — business rules

### Authentication
- Admin login at `/admin/login` — separate from customer login
- Admin users stored in a separate `admin_users` table or via Supabase custom JWT claims
- Recommend: single admin user for v1.0, multi-user in v1.1
- Session timeout: 8 hours

### Course management
- Admin can create, edit, duplicate, delete courses
- Status flow: draft → published → cancelled / archived
- Published courses appear in public catalog
- Cancelled courses: still visible to booked customers in their account, not bookable
- Capacity: admin can see `booked/total` for each course at a glance
- Deleting a course with confirmed bookings: not allowed — must cancel first

### Booking management
- Admin sees all bookings with filters (course, date range, payment status, method)
- Booking detail shows: course, all participants with food preferences, invoice recipient, payment info
- "Als bezahlt markieren": only available for bank_transfer bookings with payment_status = 'unpaid'. Sets payment_status = 'paid', status = 'confirmed', triggers confirmation email.
- Admin cannot edit participant data in v1.0 (defer to v1.1)
- CSV export of booking list (all fields)

### Voucher management
- Admin sees all vouchers with status, value, remaining value, expiry
- Admin can manually deactivate a voucher (sets status = 'cancelled')
- Admin sees which booking a voucher was redeemed against
- Postal vouchers flagged in admin with recipient address for manual printing

---

## GDPR and legal requirements

### Required pages
- **Impressum** `/impressum` — legally required in Germany. Must include: company name, address, responsible person, contact, Handelsregistereintrag (if applicable), VAT ID
- **Datenschutzerklärung** `/datenschutz` — GDPR privacy policy. Must cover: data collected, purposes, legal basis, subprocessors (Supabase, Stripe, Resend, Vercel, Plausible), retention periods, user rights (access, deletion, portability), contact for data requests
- **AGB** `/agb` — terms and conditions. Must cover: booking conditions, cancellation policy, payment terms, voucher terms, liability

### Cookie consent
- Implement Cookiebot or Usercentrics before launch
- Categories: necessary (Supabase session), analytics (Plausible — can be set as cookieless), marketing (none in v1.0)
- Plausible is cookieless by default — may not require consent banner entry

### Data processing agreements (DPAs)
- Supabase: sign DPA at supabase.com/dpa
- Stripe: covered by Stripe's standard terms for EU merchants
- Resend: sign DPA if available, or confirm EU data processing
- Vercel: sign DPA at vercel.com/legal/dpa

### Data retention
- Booking data: retain for 10 years (GoBD requirement for tax records)
- User account data: retain while account active + 3 years after last activity
- Do not implement hard deletion of booking or payment records

---

## Stripe configuration

### Test mode (weeks 1–2)
- Use Stripe test keys
- Test cards: 4242 4242 4242 4242 (success), 4000 0025 0000 3155 (3D Secure)
- Test SEPA IBAN: DE89370400440532013000
- Test webhook via Stripe CLI: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`

### Webhook events to handle
- `checkout.session.completed` — payment confirmed, update booking/voucher status, send confirmation email
- `checkout.session.expired` — payment not completed, keep booking as pending (cron will clean up)
- `payment_intent.payment_failed` — log error, notify admin if needed
- `charge.refunded` — update payment_status to 'refunded' (v1.0 manual process)

### Stripe Checkout configuration
- `success_url`: `/buchung/bestaetigung/{booking_id}?session_id={CHECKOUT_SESSION_ID}`
- `cancel_url`: `/kurse/{slug}` (back to course detail)
- `metadata`: include booking_id so webhook can identify which booking to update
- `payment_method_types`: ['card', 'sepa_debit']
- Currency: 'eur'

### Going live checklist (week 3, day 5)
- [ ] Stripe account fully verified (business details, bank account)
- [ ] Switch from test to live API keys in Vercel environment variables
- [ ] Register live webhook endpoint in Stripe dashboard
- [ ] Place a real test booking with a real card (small amount, then refund)
- [ ] Verify confirmation email arrives
- [ ] Verify booking appears in admin

---

## Development conventions

### File structure
```
/app
  /kurse
    /[slug]
      page.tsx          -- course detail (server component)
  /buchung
    /[slug]
      page.tsx          -- booking flow wrapper
    /bestaetigung
      /[id]
        page.tsx        -- confirmation page
  /gutschein
    page.tsx
  /konto
    page.tsx
  /admin
    /dashboard
    /kurse
    /buchungen
    /gutscheine
    /kunden
  /api
    /webhooks
      /stripe
        route.ts        -- Stripe webhook handler
    /bookings
      route.ts
    /vouchers
      route.ts
    /courses
      route.ts
/components
  /ui                   -- shadcn/ui components
  /booking              -- booking modal components
  /course               -- course card, detail components
  /admin                -- admin-specific components
  /email                -- React Email templates
/lib
  /supabase
    client.ts           -- browser client
    server.ts           -- server client
  /stripe
    client.ts
  /resend
    client.ts
  /utils.ts
/types
  index.ts              -- shared TypeScript types
```

### Naming conventions
- Components: PascalCase (`CourseCard.tsx`)
- Utilities: camelCase (`formatPrice.ts`)
- Database queries: in `/lib/supabase/queries/` folder, one file per entity
- API routes: RESTful where possible

### Git conventions
- Commit after every working feature: `git add . && git commit -m "feat: add booking step 2 participant form"`
- Commit messages: `feat:`, `fix:`, `style:`, `refactor:`, `docs:`
- Never commit: `.env.local`, API keys, secrets

### Error handling
- All API routes must return consistent error shapes: `{ error: string, code?: string }`
- Log errors to Sentry in production
- User-facing errors: calm German message, never expose technical details
- Stripe webhook errors: always return 200 to Stripe even on processing error (prevents retries flooding the system), log internally

---

## Testing checklist before client handover

### Booking flow
- [ ] Book a course with 1 participant, pay by card — confirmation email received
- [ ] Book a course with 3 participants, different invoice recipient, pay by SEPA
- [ ] Book a course via bank transfer — pending email received, admin can mark as paid, confirmation email sent
- [ ] Attempt to book a sold-out course — see appropriate message
- [ ] Apply a valid voucher code — correct discount applied
- [ ] Apply an expired voucher code — clear error message
- [ ] Apply an invalid voucher code — clear error message
- [ ] Book with voucher that covers full amount — no Stripe redirect, booking confirmed directly

### Voucher purchase
- [ ] Purchase voucher with email delivery — purchaser confirmation + recipient email received
- [ ] Purchase voucher with postal delivery — admin sees it flagged for printing
- [ ] Voucher code is unique and correct format

### Auth
- [ ] Customer signup — confirmation email received, can log in
- [ ] Customer login — sees own bookings, not others
- [ ] Admin login — can access /admin, customer cannot
- [ ] Password reset flow works

### Admin
- [ ] Create a course — appears in public catalog after publishing
- [ ] Edit a course — changes reflected immediately on public site
- [ ] View booking detail — all participant data visible
- [ ] Mark bank transfer as paid — booking confirmed, email sent to customer
- [ ] CSV export of bookings works

### GDPR
- [ ] Cookie banner appears on first visit
- [ ] Impressum, Datenschutz, AGB all accessible from footer
- [ ] Plausible analytics loading (or Cookiebot blocking it until consent)

---

## Open questions — resolved

1. **Cancellation policy:** ✅ RESOLVED
   - v1.0: Customer contacts admin via contact form to request cancellation
   - Admin removes participant manually via admin dashboard
   - No automated refund flow in v1.0 — admin handles refund manually via Stripe dashboard
   - v1.1+: Self-service cancellation in customer account with deadline logic and automated refund
   - Implementation note: add a visible "Buchung stornieren" contact link on the booking detail page in the customer account, pre-filling the contact form with the booking number

2. **Voucher VAT:** ✅ RESOLVED
   - Voucher purchase price includes VAT (gross amount)
   - Full course price including VAT can be paid off by voucher
   - Implementation: voucher value is treated as gross (VAT-inclusive). When redeemed, the booking invoice shows the course price with 19% VAT, offset by the voucher amount. No separate VAT line on voucher purchase receipt.
   - Note: confirm final treatment with client's Steuerberater before go-live — document this decision.

3. **Bank account details:** ✅ RESOLVED — client will provide IBAN and BIC during build week 1. Store as environment variables, not hardcoded.

4. **Admin email addresses:** ✅ RESOLVED — client will create branded email addresses (e.g. buchung@menufaktur.de, info@menufaktur.de). Required before Resend domain verification. Needed by end of week 1.

5. **Voucher expiry:** ✅ RESOLVED — 3 years from purchase date.

6. **Stripe account:** ✅ RESOLVED — Stripe account to be registered immediately by the development team — verification takes several business days. Live payments needed by day 19 (week 3). Do not wait until week 2 to start this.

7. **Postal voucher process:** ✅ RESOLVED
   - Client has existing physical process and capacity for printing and sending
   - Print-ready PDF design will be created by the outsourced brand designer (design83.studio)
   - v1.0: admin sees postal voucher orders flagged in dashboard with recipient address — physical fulfilment handled manually by client
   - v1.1: consider auto-generated PDF in brand design for admin to download and print

8. **Resend domain verification:** ✅ RESOLVED — domain menufaktur.de registered at DomainFactory for 10 years, DNS access granted. Add Resend DNS records (SPF, DKIM, DMARC) in week 1 to allow propagation time before emails are needed in week 2.

---

*Last updated: project planning phase. Update this document when business rules change or open questions are resolved. All changes should be committed to GitHub.*
