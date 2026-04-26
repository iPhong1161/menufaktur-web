# Changelog

All notable changes to this project. Format: [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [Unreleased]

### Next up
- Course catalog page (/kurse)
- Course detail page (/kurse/[slug])

---

## [0.2.1] — 2026-04-25

### Added
- Logo SVGs integrated: 4 variants in `public/brand/` (cream/burgundy × transparent/solid-bg)
- `Logo` component (`components/layout/Logo.tsx`) — renders correct SVG variant with calculated width from native aspect ratio; `variant="light"` for Wine Red backgrounds, `variant="dark"` for light backgrounds
- SVG favicon wired via `app/layout.tsx` metadata (`menufaktur-icon-cream-on-burgundy.svg`)

### Changed
- Header: replaced text placeholder with `<Logo variant="light">` (44px desktop, 36px mobile)
- Footer: replaced text placeholder with `<Logo variant="light" height={32}>` 

---

## [0.2.0] — 2026-04-25

### Added
- Global Header component (`components/layout/Header.tsx`) — fixed, Wine Red background, text logo placeholder, mobile hamburger menu with slide-down nav
- Global Footer component (`components/layout/Footer.tsx`) — 4-column grid: brand/contact, menu nav, legal nav, social icons
- Public route group (`app/(public)/layout.tsx`) — wraps all public pages with Header + Footer; admin routes remain separate
- Home page (`app/(public)/page.tsx`) — Hero, Intro, Featured Courses, Why menufaktur (3 features), Testimonial, Voucher CTA sections
- CourseCard component (`components/course/CourseCard.tsx`) — reusable card with capacity badge, photo placeholder, Lucide icons
- Utility functions in `lib/utils.ts`: `formatPrice`, `formatDate`, `formatTime`

### Fixed
- `next.config.ts`: removed deprecated Sentry v9 options (`hideSourceMaps`, `disableLogger`); updated to v10 API (`sourcemaps.deleteSourcemapsAfterUpload`)

---

## [0.1.0] — 2026-04-24

### Added
- Documentation system: PROGRESS.md, COMPONENTS.md, DATABASE.md, API.md, DECISIONS.md, KNOWN_ISSUES.md, CHANGELOG.md
- Project scaffolded: Next.js 15.5.15, TypeScript, App Router, Tailwind CSS v4, Turbopack
- Brand colors configured in Tailwind v4 `@theme`: Wine Red (#7E1423), Light Beige (#FFFCE1), Gold Yellow (#F15A22), Garnet Red (#A72335), Dark (#2A2A2A)
- shadcn/ui initialized with base-nova style (uses @base-ui/react, tw-animate-css)
- Roboto and Roboto Condensed fonts loaded via `next/font/google`; CSS vars `--font-roboto` and `--font-roboto-condensed` set on body
- Sentry installed (@sentry/nextjs@10): client/server/edge config files + `instrumentation.ts`
- Full folder structure from SPEC.md: `app/(public)/`, `app/admin/`, `app/api/`, `components/`, `lib/`, `types/`
- TypeScript interfaces for all database tables (`types/index.ts`)
- Library stubs: `lib/supabase/`, `lib/stripe/`, `lib/resend/`
- `.env.local.example` with all required environment variable names
