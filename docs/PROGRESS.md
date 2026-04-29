# Build Progress

Most recent session at top.

---

## Session log

| Date | Summary |
|---|---|
| 2026-04-27 | Auth pages (login, registrieren, passwort-zuruecksetzen). Customer account /konto with sidebar layout, booking history (/konto/buchungen), voucher history (/konto/gutscheine) |
| 2026-04-27 | Voucher purchase page (/gutschein), VoucherModal (single-form: buyer data, value selector, quantity, legal), VoucherButton, confirmation page (/gutschein/bestaetigung/[id]) |
| 2026-04-26 | Course detail page (/kurse/[slug]), full booking flow (4-step modal + confirmation page), ImagePlaceholder two-tier system, shared lib/data/courses.ts |
| 2026-04-25 | Finished scaffold. Built global layout (Header, Footer). Built home page with CourseCard component. Course catalog (/kurse) with filters and pagination. Build passing. |
| 2026-04-24 | Project set up: docs created, Next.js 15 scaffolded, Tailwind v4 brand colors, shadcn/ui, Sentry, Roboto fonts, globals.css, layout.tsx |

---

## Phase 1 — Foundation

| Task | Status | Notes |
|---|---|---|
| Next.js 15 scaffold | ✅ | Tailwind v4, shadcn base-nova, bun |
| Tailwind + brand colors | ✅ | @theme in globals.css |
| shadcn/ui init | ✅ | base-nova style, @base-ui/react |
| Sentry setup | ✅ | DSN env var needed before go-live |
| Roboto fonts | ✅ | Roboto + Roboto_Condensed via next/font/google |
| Folder structure from SPEC | ✅ | Route group (public) + admin + api |
| TypeScript types (types/index.ts) | ✅ | All DB table interfaces |
| .env.local.example | ✅ | All required env var names |

## Phase 2 — Global layout

| Task | Status | Notes |
|---|---|---|
| Header component | ✅ | Fixed, Wine Red, text logo placeholder, mobile menu |
| Footer component | ✅ | 4-col: brand, menu, legal, social |
| Public route group layout | ✅ | app/(public)/layout.tsx |
| Admin layout | ⬜ | Will build with admin pages |

## Phase 3 — Public site

| Task | Status | Notes |
|---|---|---|
| Home page (/) | ✅ | Hero, Intro, Courses, Features, Testimonial, Voucher CTA |
| Course catalog (/kurse) | ✅ | Filters (price range, sort), 6-per-page pagination, 9 hardcoded courses |
| Course detail (/kurse/[slug]) | ✅ | Hero, 2-col layout, includes, instructor, reviews, related courses |
| About us (/ueber-uns) | ✅ | Hero, story 2-col, philosophy section, CTA |
| Private events (/private-events) | ✅ | Hero, intro, loft section (60 Gäste badge), catering + private cooking, Konditionen CTA |
| Contact (/kontakt) | ✅ | Hero, form (ContactForm client component), info sidebar, map placeholder |
| Impressum (/impressum) | ✅ | Hero, company info card, registry details, newsletter teaser |
| Datenschutz (/datenschutz) | ✅ | Hero, sticky sidebar nav, 5 sections, GDPR rights grid, contact CTA |
| AGB (/agb) | ✅ | Hero, intro, 8-section card grid (incl. full-width Gruppen + Rechtliches), newsletter teaser |

## Phase 4 — Booking flow

| Task | Status | Notes |
|---|---|---|
| Booking modal wrapper | ✅ | BookingModal.tsx + BookingButton.tsx; triggered from course detail |
| Step 1 — Teilnehmerzahl | ✅ | Counter 1–capacity, price preview |
| Step 2 — Teilnehmerdaten | ✅ | P1: name/email/phone/diet; others: name/diet; inline validation |
| Step 3 — Rechnungsempfänger | ✅ | Radio: Teilnehmer 1 or custom address form with B2B toggle |
| Step 4 — Übersicht & Bestätigung | ✅ | Sidebar, review sections, voucher (TEST123=−30€), AGB gate, console.log submit |
| Step 5 — Bestätigungsseite | ✅ | /buchung/bestaetigung/[id] — booking summary card + info section |

## Phase 5 — Voucher

| Task | Status | Notes |
|---|---|---|
| Voucher purchase page (/gutschein) | ✅ | Hero, redeem info, buy section, VoucherModal, contact teaser |
| Voucher confirmation page | ✅ | /gutschein/bestaetigung/[id] — order summary card + info section |

## Phase 6 — Auth & account

| Task | Status | Notes |
|---|---|---|
| Login (/login) | ✅ | anmelden_menufaktur |
| Register (/registrieren) | ✅ | konto_erstellen_menufaktur |
| Password reset (/passwort-zuruecksetzen) | ✅ | |
| Customer account (/konto) | ✅ | Redirects to /konto/buchungen |
| Booking history tab | ✅ | konto_meine_buchungen_menufaktur |
| Voucher history tab | ✅ | konto_meine_gutscheine_menufaktur |

## Phase 7 — Admin

| Task | Status | Notes |
|---|---|---|
| Admin login (/admin/login) | ✅ | admin_login_menufaktur |
| Admin dashboard (/admin/dashboard) | ✅ | admin_dashboard_menufaktur |
| Course list (/admin/kurse) | ✅ | kursliste_admin_menufaktur |
| Create course (/admin/kurse/neu) | ✅ | kurs_erstellen_bearbeiten_admin_menufaktur_1/2 |
| Edit course (/admin/kurse/[id]/bearbeiten) | ✅ | Same as create |
| Booking list (/admin/buchungen) | ✅ | buchungsliste_admin_menufaktur |
| Booking detail (/admin/buchungen/[id]) | ✅ | buchungsdetails_admin_menufaktur |
| Voucher list (/admin/gutscheine) | ✅ | No wireframe — follow buchungsliste style |
| Customer list (/admin/kunden) | ✅ | kundenliste_admin_menufaktur |
| Settings (/admin/einstellungen) | ✅ | einstellungen_admin_menufaktur |

## Phase 8 — Backend integration

| Task | Status | Notes |
|---|---|---|
| Supabase packages installed | ✅ | @supabase/supabase-js + @supabase/ssr |
| Supabase browser client | ✅ | lib/supabase/client.ts |
| Supabase server client | ✅ | lib/supabase/server.ts (anon + service-role) |
| .env.local with real credentials | ✅ | Project URL + publishable + secret keys |
| TypeScript database types | ✅ | types/database.ts — all 6 tables with Relationships |
| Initial schema migration | ✅ | supabase/migrations/20260429000000_initial_schema.sql |
| RLS policies migration | ✅ | supabase/migrations/20260429000001_rls_policies.sql |
| Next.js middleware | ✅ | Session refresh + /konto/* + /admin/* auth guards |
| Query module: courses | ✅ | getCourses(), getCourseBySlug(), getCourseById() |
| Query module: bookings | ✅ | createBooking(), getBookingByNumber(), getUserBookings() |
| Query module: vouchers | ✅ | createVoucherOrder(), getUserVouchers(), validateVoucherCode() |
| Query module: profiles | ✅ | getProfile(), upsertProfile() |
| /kurse page — real data | ✅ | Fetches from Supabase, empty state if no courses |
| /kurse/[slug] page — real data | ✅ | getCourseBySlug(), related courses from DB |
| / home page — featured courses | ✅ | First 3 upcoming published courses from DB |
| Login page — Supabase auth | ✅ | signInWithPassword, redirect param, Suspense wrapper |
| Register page — Supabase auth | ✅ | signUp with first_name/last_name metadata |
| Password reset page — Supabase auth | ✅ | resetPasswordForEmail, anti-enumeration pattern |
| API routes (courses, bookings, vouchers) | ⬜ | Next up |
| Stripe Checkout integration | ⬜ | Deferred |
| Stripe webhook handler | ⬜ | Deferred |
| Resend transactional emails | ⬜ | Deferred |
| Admin auth guard | ⬜ | Deferred |

---

## Status legend

| Symbol | Meaning |
|---|---|
| ⬜ | Not started |
| 🔄 | In progress |
| ✅ | Complete |
| ⏸ | Blocked |
| ❌ | Cancelled / out of scope |
