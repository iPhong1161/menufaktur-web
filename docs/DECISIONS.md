# Architecture Decision Records

Format: Decision → Rationale → Consequences. Most recent first.

---

## ADR-007 — Contact page: use kontakt_menufaktur_updated as canonical design
**Date:** 2026-04-24
**Status:** Accepted

**Decision:** Ignore `kontakt_menufaktur.html` and `kontakt_menufaktur.png`. Use `kontakt_menufaktur_updated.html` as the canonical design for `/kontakt`.

**Rationale:** The updated version supersedes the original per client instruction.

**Consequences:** The original kontakt wireframe files remain in the directory but are never referenced.

---

## ADR-006 — Voucher admin list page: follow buchungsliste style
**Date:** 2026-04-24
**Status:** Accepted

**Decision:** No wireframe was designed for `/admin/gutscheine`. When building it, follow the visual style of `buchungsliste_admin_menufaktur` as the closest equivalent.

**Rationale:** The voucher list was intentionally omitted from the Stitch prototype. The booking list is the most structurally similar admin list view.

**Consequences:** Voucher list will have a familiar, consistent look with the booking list without requiring a separate design sign-off.

---

## ADR-005 — Logo: SVG files integrated via Logo component
**Date:** 2026-04-24 (resolved 2026-04-25)
**Status:** Resolved

**Decision:** Four SVG icon variants delivered by designer and placed in `public/brand/`. A single `<Logo>` component (`components/layout/Logo.tsx`) wraps the correct variant per context. Text placeholder removed.

**Variants available:**
- `menufaktur-icon-cream.svg` (1300×843) — cream icon, transparent bg → use on Wine Red backgrounds (header, footer)
- `menufaktur-icon-cream-on-burgundy.svg` (1300×843) — cream icon, Wine Red bg → favicon, OG image, email
- `menufaktur-icon-burgundy.svg` (769×673) — burgundy icon, transparent bg → use on light backgrounds
- `menufaktur-icon-burgundy-on-cream.svg` (769×673) — burgundy icon, cream bg → print / inverted use

**Consequences:** Header uses `variant="light" height={44}` (desktop) / `height={36}` (mobile). Footer uses `variant="light" height={32}`. Favicon uses the cream-on-burgundy SVG.

---

## ADR-004 — Frontend-first: all data hardcoded as placeholders
**Date:** 2026-04-24
**Status:** Accepted

**Decision:** Build the entire frontend with hardcoded placeholder data. Supabase, Stripe, and Resend are wired up in a separate backend integration phase.

**Rationale:** Allows fast visual iteration and client review without backend setup blocking progress.

**Consequences:** All `lib/supabase/`, `lib/stripe/`, `lib/resend/` files start as stubs. API routes are empty shells. Replace placeholders systematically in Phase 8.

---

## ADR-003 — Sentry: manual config, no interactive wizard
**Date:** 2026-04-24
**Status:** Accepted

**Decision:** Install `@sentry/nextjs` and create config files manually instead of running `@sentry/wizard` (which requires browser authentication).

**Rationale:** The wizard is interactive and cannot run non-interactively in this environment.

**Consequences:** `SENTRY_DSN` env var is a placeholder. Sentry will be fully functional once DSN is added to Vercel environment variables before go-live.

---

## ADR-002 — VAT on vouchers: treated as gross (VAT-inclusive)
**Date:** 2026-04-24
**Status:** Accepted (pending confirmation from client's Steuerberater before go-live)

**Decision:** Voucher purchase price is gross (VAT-inclusive). No VAT line on voucher purchase receipt. 19% VAT shown on booking invoice when voucher is redeemed.

**Rationale:** Per German tax law, multi-purpose vouchers have no VAT due at point of sale. VAT is due on redemption.

**Consequences:** Do not show VAT on the voucher purchase confirmation page. Show full 19% VAT on booking confirmation when a voucher is used. Confirm treatment with client's Steuerberater before launch.

---

## ADR-001 — Cancellation policy: contact-based in v1.0
**Date:** 2026-04-24
**Status:** Accepted

**Decision:** No self-service cancellation in v1.0. Customer contacts admin via contact form with booking number. Admin handles refund manually via Stripe dashboard.

**Rationale:** Self-service cancellation with deadline logic and automated refund is complex. Defer to v1.1.

**Consequences:** Booking detail page in customer account shows a "Buchung stornieren" contact link that pre-fills the contact form with the booking number.
