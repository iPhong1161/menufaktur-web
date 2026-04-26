---
name: Project overview
description: menufaktur cooking school website — scope, approach, and key facts
type: project
---

**Client:** menufaktur — cooking school in Frankfurt-Bornheim, founded 2007. Site in German (formal "Sie").

**Goal:** Customer can discover a course, book it or purchase a voucher, pay, and receive confirmation. Admin manages courses and bookings.

**Approach:** Frontend-first with all data hardcoded as placeholders. Supabase wired up later.

**No Next.js project scaffolded yet** as of 2026-04-24. Only spec/brand docs and wireframes/reference HTML exist in the working directory.

**Wireframes:** `/wireframes/*.png` — 30 PNG screenshots covering all screens.
**Reference HTML:** `/reference/stitch-pages/*.html` — one matching HTML file per screen (from Stitch prototype), named identically to the PNGs.

**Key pages (public):** /, /kurse, /kurse/[slug], /buchung/[slug], /gutschein, /konto, /login, /registrieren, /impressum, /datenschutz, /agb
**Key pages (admin):** /admin/dashboard, /admin/kurse, /admin/buchungen, /admin/gutscheine, /admin/kunden, /admin/einstellungen

**Why:** Build a full-featured cooking school booking platform for go-live on Vercel.

**How to apply:** Always check wireframes and reference HTML before implementing any page — the Stitch HTML is the visual ground truth for that screen.
