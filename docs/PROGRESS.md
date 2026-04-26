# Build Progress

Most recent session at top.

---

## Session log

| Date | Summary |
|---|---|
| 2026-04-25 | Finished scaffold. Built global layout (Header, Footer). Built home page with CourseCard component. Build passing. |
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
| Course catalog (/kurse) | ⬜ | kurse_menufaktur |
| Course detail (/kurse/[slug]) | ⬜ | kursdetails_menufaktur |
| About us (/ueber-uns) | ⬜ | ber_uns_menufaktur |
| Private events (/private-events) | ⬜ | private_events_menufaktur |
| Contact (/kontakt) | ⬜ | kontakt_menufaktur_updated (canonical) |
| Impressum (/impressum) | ⬜ | impressum_menufaktur |
| Datenschutz (/datenschutz) | ⬜ | datenschutzerkl_rung_menufaktur |
| AGB (/agb) | ⬜ | agb_menufaktur |

## Phase 4 — Booking flow

| Task | Status | Notes |
|---|---|---|
| Booking modal wrapper | ⬜ | Triggered from course detail |
| Step 1 — Teilnehmerzahl | ⬜ | step_1_teilnehmerzahl |
| Step 2 — Teilnehmerdaten | ⬜ | step_2_teilnehmerdaten |
| Step 3 — Rechnungsempfänger | ⬜ | step_3_rechnungsempf_nger |
| Step 4 — Übersicht & Bestätigung | ⬜ | step_4_bersicht_best_tigung |
| Step 5 — Bestätigungsseite | ⬜ | step_5_best_tigung_uniform |

## Phase 5 — Voucher

| Task | Status | Notes |
|---|---|---|
| Voucher purchase page (/gutschein) | ⬜ | gutscheine_kauf_modal_menufaktur_1/2 |
| Voucher confirmation page | ⬜ | |

## Phase 6 — Auth & account

| Task | Status | Notes |
|---|---|---|
| Login (/login) | ⬜ | anmelden_menufaktur |
| Register (/registrieren) | ⬜ | konto_erstellen_menufaktur |
| Password reset (/passwort-zuruecksetzen) | ⬜ | |
| Customer account (/konto) | ⬜ | |
| Booking history tab | ⬜ | konto_meine_buchungen_menufaktur |
| Voucher history tab | ⬜ | konto_meine_gutscheine_menufaktur |

## Phase 7 — Admin

| Task | Status | Notes |
|---|---|---|
| Admin login (/admin/login) | ⬜ | admin_login_menufaktur |
| Admin dashboard (/admin/dashboard) | ⬜ | admin_dashboard_menufaktur |
| Course list (/admin/kurse) | ⬜ | kursliste_admin_menufaktur |
| Create course (/admin/kurse/neu) | ⬜ | kurs_erstellen_bearbeiten_admin_menufaktur_1/2 |
| Edit course (/admin/kurse/[id]/bearbeiten) | ⬜ | Same as create |
| Booking list (/admin/buchungen) | ⬜ | buchungsliste_admin_menufaktur |
| Booking detail (/admin/buchungen/[id]) | ⬜ | buchungsdetails_admin_menufaktur |
| Voucher list (/admin/gutscheine) | ⬜ | No wireframe — follow buchungsliste style |
| Customer list (/admin/kunden) | ⬜ | kundenliste_admin_menufaktur |
| Settings (/admin/einstellungen) | ⬜ | einstellungen_admin_menufaktur |

## Phase 8 — Backend integration

| Task | Status | Notes |
|---|---|---|
| Supabase client setup | ⬜ | Deferred |
| Supabase schema migration | ⬜ | Deferred |
| API routes (courses, bookings, vouchers) | ⬜ | Deferred |
| Stripe Checkout integration | ⬜ | Deferred |
| Stripe webhook handler | ⬜ | Deferred |
| Resend transactional emails | ⬜ | Deferred |
| RLS policies | ⬜ | Deferred |
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
