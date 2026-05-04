# Image Audit — menufaktur-web

Complete inventory of every image reference in the codebase. Use this as the definitive photo guide for the client photoshoot.

**Legend:**
- ✅ Real image file exists and is wired up
- 🟡 Uses `courseImageSrc()` fallback (static PNG, not course-specific)
- ⛔ `ImagePlaceholder` rendered — no real photo yet
- 📦 Supabase `photo_url` field (uploaded per-course via admin)

---

## 1. Hero Banners

Full-viewport hero images. Should be landscape, high resolution — minimum **2400 × 1350 px** (16:9).

| # | File | Component / Page | Current `src` | Status | Recommended filename & dimensions |
|---|------|-----------------|---------------|--------|-----------------------------------|
| 1 | `app/(public)/page.tsx` | Homepage hero | `/images/hero/hero-main.png` | ✅ | `hero-main.png` — 2400×1350 px, dramatic kitchen or plated dish |
| 2 | `app/(public)/kurse/page.tsx` | Course catalog hero | `/images/hero/hero-kurse.png` | ✅ | `hero-kurse.png` — 2400×1350 px, wide group cooking shot |
| 3 | `app/(public)/gutschein/page.tsx` | Voucher page hero | `/images/hero/gutscheine-hero.png` | ✅ | `gutscheine-hero.png` — 2400×1350 px, gift/celebration mood |
| 4 | `app/(public)/private-events/page.tsx` | Private events hero | `/images/private-events/loft-hero.png` | ✅ | `loft-hero.png` — 2400×1350 px, atelier full-room wide shot |

---

## 2. About / Atelier Photos

Used across `/ueber-uns`, `/kontakt`, homepage about-preview, and the private events page.

| # | File | Component / Page | Current `src` | Status | Recommended filename & dimensions |
|---|------|-----------------|---------------|--------|-----------------------------------|
| 5 | `app/(public)/ueber-uns/page.tsx` (hero) | Über Uns hero | `/images/about/atelier-interior.png` | ✅ | `atelier-interior.png` — 2400×1350 px, warm interior wide angle |
| 6 | `app/(public)/ueber-uns/page.tsx` (team) | Team section | `/images/about/team-kitchen.png` | ✅ | `team-kitchen.png` — 1200×900 px (4:3), whole team at stations |
| 7 | `app/(public)/ueber-uns/page.tsx` (detail) | Craftsmanship detail | `/images/about/hands-dough.png` | ✅ | `hands-dough.png` — 1200×900 px (4:3), close-up hands/dough |
| 8 | `app/(public)/ueber-uns/page.tsx` (exterior) | Standort / location section | `/images/about/atelier-exterior.png` | ✅ | `atelier-exterior.png` — 1200×900 px, building façade, street-level |
| 9 | `app/(public)/page.tsx` (about preview) | Homepage about-preview section | `/images/about/atelier-interior.png` | ✅ | reuses `atelier-interior.png` |
| 10 | `app/(public)/kontakt/page.tsx` (hero) | Kontakt page hero | `/images/about/atelier-interior.png` | ✅ | reuses `atelier-interior.png` |
| 11 | `app/(public)/kontakt/page.tsx` (exterior) | Kontakt location section | `/images/about/atelier-exterior.png` | ✅ | reuses `atelier-exterior.png` |

---

## 3. Instructor Profile

Used as a placeholder on course detail pages.

| # | File | Component / Page | Current `src` | Status | Recommended filename & dimensions |
|---|------|-----------------|---------------|--------|-----------------------------------|
| 12 | `app/(public)/kurse/[slug]/page.tsx` | Course detail — instructor bio | `ImagePlaceholder` label `"about/instructor.jpg"` | ⛔ | `instructor.png` — 200×200 px, square headshot, warm background |

---

## 4. Private Events Photos

Used exclusively on `/private-events`.

| # | File | Component / Page | Current `src` | Status | Recommended filename & dimensions |
|---|------|-----------------|---------------|--------|-----------------------------------|
| 13 | `app/(public)/private-events/page.tsx` | Atelier as venue | `/images/private-events/atelier-space.png` | ✅ | `atelier-space.png` — 1200×900 px (4:3), event set-up shot |
| 14 | `app/(public)/private-events/page.tsx` | Team cooking action | `/images/private-events/team-cooking.png` | ✅ | `team-cooking.png` — 1200×900 px, guests cooking together |
| 15 | `app/(public)/private-events/page.tsx` | Catering at home | `/images/private-events/catering-home.png` | ✅ | `catering-home.png` — 1200×900 px, beautifully plated catering |
| 16 | `app/(public)/private-events/page.tsx` | Private cooking class | `/images/private-events/private-cooking-class.png` | ✅ | `private-cooking-class.png` — 1200×900 px, intimate small group class |

---

## 5. Course Thumbnails (Static Fallbacks via `courseImageSrc()`)

These images are used as category-level fallbacks when a course has no `photo_url` uploaded in Supabase. Each image covers multiple course slugs. Recommended size: **900×675 px (4:3)** to match the `aspect-[4/3]` card ratio.

| # | Physical file | Slug(s) it covers | Status | Subject |
|---|--------------|-------------------|--------|---------|
| 17 | `/images/courses/pasta-manufaktur.png` | `italienische-klassiker`, `spanische-klassiker`, `nudeln-selbstgemacht`, `risotto-pasta-gnocchi`, `kunst-der-pasta-manufaktur` + DEFAULT fallback | ✅ | Fresh pasta or Italian mise en place |
| 18 | `/images/courses/wein-wild-herbst.png` | `franzoesische-klassiker`, `festtagsbraten`, `wein-wild-herbstliches-menue` | ✅ | Autumn game dish, wine pairing |
| 19 | `/images/courses/after-work-cooking.png` | `hessische-kueche`, `einmaleins-der-kueche`, `die-schnelle-kueche`, `quick-healthy-after-work-cooking` | ✅ | Quick weeknight cooking, casual mood |
| 20 | `/images/courses/thai-street-food.png` | `thaiaendische-kueche`, `indische-kueche`, `tuerkisch-griechische-kueche`, `thai-street-food-wuerzig-authentisch` | ✅ | Asian street food, spices, wok |
| 21 | `/images/courses/plant-based-gourmet.png` | `vegetarische-kueche`, `vegane-kueche`, `spargel-satt`, `vegetarische-meze`, `plant-based-gourmet-vegan` | ✅ | Colourful vegetables, plant-based dish |
| 22 | `/images/courses/perfect-steak.png` | `steak-schnitzel-und-co`, `saucen-und-fonds`, `hackfleisch`, `perfect-steak-grillen-braten` | ✅ | Perfectly seared steak, cast iron |
| 23 | `/images/courses/sushi-masterclass.png` | `von-kopf-bis-fuss-fisch`, `sushi-masterclass-maki-nigiri` | ✅ | Sushi rolls, fish preparation |
| 24 | `/images/courses/patisserie-macarons.png` | `haeppchen-fingerfood-tapas`, `suesser-frankreich`, `franzoesische-patisserie-macarons` | ✅ | French pastry, macarons |
| 25 | `/images/courses/sauerteig-brot.png` | `sauerteig-geheimnisse-brot-backen` | ✅ | Artisan bread, sourdough loaf |

---

## 6. Course Images from Supabase (`photo_url`)

These are dynamically loaded per-course from the Supabase `courses.photo_url` column. When `photo_url` is set, it takes priority over the static fallbacks above. When null, the static fallback is used.

| # | File(s) | Where it appears | Current state | Notes |
|---|---------|-----------------|---------------|-------|
| 26 | `app/(public)/kurse/[slug]/page.tsx` | Course detail page hero (full width) | 📦 `course.photo_url` or ⛔ `ImagePlaceholder` | Primary large image per course — upload via admin |
| 27 | `app/(public)/kurse/[slug]/page.tsx` | Related courses section — card thumbnails | 📦 `course.photo_url` or ⛔ `ImagePlaceholder` | h-52 cards |
| 28 | `components/course/CatalogCourseCard.tsx` | Course catalog grid card | 🟡 `courseImageSrc(slug, photo_url)` | `aspect-[4/3]`; uses static fallback unless `photo_url` is set |
| 29 | `components/course/CourseCard.tsx` | Homepage/featured course card | 🟡 `courseImageSrc(slug, photo_url)` | `h-56` (224 px); same fallback logic |
| 30 | `components/booking/BookingModal.tsx` | Booking modal — step 1 thumbnail | 📦 `course.photo_url` or ⛔ `ImagePlaceholder` | `w-12 h-12` (48×48 px) |
| 31 | `components/booking/BookingModal.tsx` | Booking modal — step 2 thumbnail | 📦 `course.photo_url` or ⛔ `ImagePlaceholder` | `w-10 h-10` (40×40 px) |
| 32 | `components/booking/BookingModal.tsx` | Booking modal — summary step | 📦 `course.photo_url` or ⛔ `ImagePlaceholder` | `aspect-video` |
| 33 | `app/(public)/buchung/bestaetigung/[id]/page.tsx` | Booking confirmation — course photo | 📦 `course.photo_url` or ⛔ `ImagePlaceholder` | Confirmation summary card |
| 34 | `app/(public)/konto/buchungen/page.tsx` | My bookings — course thumbnail | 📦 `course.photo_url` or ⛔ `ImagePlaceholder` | `w-40 h-40`; past bookings rendered in grayscale |
| 35 | `app/admin/buchungen/[id]/page.tsx` | Admin booking detail — course photo | ⛔ `ImagePlaceholder` label `"Course photo — uploaded via admin"` | Admin-only view |

---

## 7. General / Other

| # | File | Component / Page | Current `src` | Status | Notes |
|---|------|-----------------|---------------|--------|-------|
| 36 | `app/(public)/gutschein/page.tsx` | Voucher page — certificate preview | `/images/general/gutschein-preview.png` | ✅ | Sample voucher design; 600×400 px (3:2) |
| 37 | `app/admin/einstellungen/page.tsx` | Admin settings — profile photo | `ImagePlaceholder` label `"admin/profile-photo.jpg"` | ⛔ | Admin-only; could stay as placeholder |
| 38 | `public/images/_extras/private_events.png` | Not referenced in code | — | ⚠️ unused | Exists on disk but not imported anywhere |

---

## 8. Brand / Logo Assets (SVG)

| # | File | Used in | Context |
|---|------|---------|---------|
| 39 | `/brand/menufaktur-icon-burgundy.svg` | `components/layout/Logo.tsx` (variant="dark") | Logo on light/cream backgrounds |
| 40 | `/brand/menufaktur-icon-cream.svg` | `components/layout/Logo.tsx` (variant="light", default) | Logo on wine-red backgrounds |
| 41 | `/brand/menufaktur-icon-burgundy-on-cream.svg` | Not referenced in code | Available asset |
| 42 | `/brand/menufaktur-icon-cream-on-burgundy.svg` | Not referenced in code | Available asset |

---

## Summary

| Category | Count | Status |
|----------|-------|--------|
| Hero banners | 4 | ✅ all have real images |
| About / atelier | 7 | ✅ all have real images (several are reuses of same file) |
| Instructor portrait | 1 | ⛔ placeholder only |
| Private events | 4 | ✅ all have real images |
| Course static fallbacks | 9 | ✅ all have real images (category-level, not per-course) |
| Per-course Supabase images | 10 slots | 📦 dynamically loaded; all fallback to placeholder if `photo_url` is null |
| General | 1 | ✅ real image |
| Admin placeholders | 2 | ⛔ admin-only, low priority |
| Brand SVGs | 4 | ✅ all present |
| **Total image references** | **42** | |

### ImagePlaceholder slots still needing real photos (public-facing)

| Slot | Where | Priority |
|------|-------|----------|
| Instructor headshot | Course detail page `/kurse/[slug]` — bio section | High |
| Per-course hero image | Course detail page `/kurse/[slug]` — top of page | High — upload via admin `photo_url` field for each course |
| Per-course card thumbnail | Catalog cards fall back to category image | Medium — `photo_url` in Supabase upgrades these automatically |
| Booking modal thumbnails | 3 sizes in `BookingModal.tsx` | Resolved once `photo_url` is uploaded |
| Booking confirmation | `/buchung/bestaetigung/[id]` | Resolved once `photo_url` is uploaded |
| My bookings history | `/konto/buchungen` | Resolved once `photo_url` is uploaded |

### Photoshoot priority order

1. **Atelier interior** — used as hero on 3 different pages (`atelier-interior.png`)
2. **Atelier exterior** — used on 2 pages (`atelier-exterior.png`)
3. **Per-course hero images** — one good photo per course type, uploaded to Supabase
4. **Team photo** in kitchen (`team-kitchen.png`)
5. **Instructor headshot** — square crop for bio section
6. **Homepage hero** — single dramatic wide shot (`hero-main.png`)
7. **Hands/detail shots** — dough, plating, close-ups (`hands-dough.png`)
8. Private events series (4 images)
9. Voucher hero and preview
