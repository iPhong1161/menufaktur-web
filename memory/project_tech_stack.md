---
name: Tech stack
description: menufaktur website technology choices and environment variable names
type: project
---

**Framework:** Next.js 15, TypeScript
**Styling:** Tailwind CSS + shadcn/ui
**Database:** Supabase Postgres (eu-central-1, Frankfurt)
**Auth:** Supabase Auth
**Payments:** Stripe (card + SEPA) + bank transfer (manual)
**Email:** Resend (transactional only, React Email templates)
**Hosting:** Vercel (domain at DomainFactory)
**Error monitoring:** Sentry
**Analytics:** Plausible (cookieless)
**Cookie consent:** Cookiebot or Usercentrics

**Environment variables (never hardcode):**
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY
- STRIPE_SECRET_KEY / STRIPE_WEBHOOK_SECRET / NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
- RESEND_API_KEY
- NEXT_PUBLIC_SITE_URL

**Why:** Client's chosen stack for a modern, maintainable booking platform.
**How to apply:** Always use env vars for secrets. Use App Router (Next.js 15). shadcn/ui components as base. React Email for transactional emails.
