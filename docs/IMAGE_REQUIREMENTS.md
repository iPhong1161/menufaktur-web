# Image Requirements — menufaktur

> Generated from a full audit of all `page.tsx`, `layout.tsx`, and `component.tsx` files.
> Total unique image files required: **23** (13 static + 9 dynamic course photos + 1 admin profile).
> All 9 courses currently have `photo_url: null` in the database — every course card shows a placeholder.

---

## Section 1: Home Page

### 1.1 Homepage Feature Image — Atelier Interior

| Field | Value |
|---|---|
| **Page / Component** | `app/(public)/page.tsx` — split-layout intro section (right column) |
| **Filename & Path** | `/public/images/about/atelier-interior.jpg` *(shared with About and Contact heroes)* |
| **Type** | Static |
| **Priority** | High |
| **Dimensions** | 800 × 1000 px |
| **Format** | JPG |

**Description:** Portrait-format interior shot of the menufaktur cooking atelier in Frankfurt-Bornheim. Warm candlelight or late-afternoon natural light from a window. Guests gathered around a large wooden preparation table, smiling mid-conversation. Deep wine red accents visible in equipment or textiles. Rustic yet refined — exposed brick or warm-toned walls, no clutter. Conveys the feeling of being invited into a private, intimate kitchen space. The 4:5 portrait crop means the top and bottom must both contain interest.

---

### 1.2 Featured Course Cards (Dynamic — Supabase)

Course card thumbnails on the homepage are rendered via `components/course/CourseCard.tsx` and pull `photo_url` from Supabase. See **Section 3** for per-course image specifications.

---

## Section 2: Course Catalog

### 2.1 Default / Fallback Course Card Image

| Field | Value |
|---|---|
| **Page / Component** | `components/course/CourseCard.tsx` · `components/course/CatalogCourseCard.tsx` · `app/(public)/kurse/page.tsx` |
| **Filename & Path** | Supabase Storage — `course-photos` bucket, uploaded via admin (`photo_url` field in `courses` table) |
| **Type** | Dynamic |
| **Priority** | High |
| **Dimensions** | 1200 × 900 px (4:3 ratio) |
| **Format** | WebP |

**Description:** Generic fallback displayed when a course has no photo yet. A beautifully composed overhead shot of a variety of fresh, colourful ingredients on a warm wooden surface — fresh pasta, herbs, seasonal vegetables, perhaps a glass of wine at the edge. Warm natural light, no text, no logos. Usable across any course category. This is the ImagePlaceholder that visitors see most until the admin uploads course-specific photos.

---

## Section 3: Individual Course Thumbnails

All course photos are **Dynamic** — uploaded by the admin via the admin panel and stored in the Supabase `course-photos` bucket. The `photo_url` field in the `courses` table is currently `null` for all 9 courses. These images appear on:
- Course cards on the homepage (`components/course/CourseCard.tsx`, `h-56`)
- Course listing page (`components/course/CatalogCourseCard.tsx`, `aspect-[4/3]`)
- Course detail page hero (`app/(public)/kurse/[slug]/page.tsx`, full-width)
- Related courses row at the bottom of the detail page (`h-52`)
- Booking modal sidebar (steps 1, 3, and confirmation)
- Booking confirmation page
- User booking history (displayed at 40 × 40 thumbnail size)
- Admin booking detail view

---

### 3.1 Die Kunst der Pasta-Manufaktur

| Field | Value |
|---|---|
| **Slug** | `kunst-der-pasta-manufaktur` |
| **Supabase Filename** | `pasta-manufaktur.webp` |
| **Type** | Dynamic |
| **Priority** | High |
| **Dimensions** | 1200 × 900 px |
| **Format** | WebP |

**Description:** Fresh egg pasta dough being hand-rolled on a flour-dusted wooden surface. Golden ribbons of tagliatelle or pappardelle draped casually over a pasta board or drying rack. Warm late-afternoon natural light, an artisan Italian kitchen aesthetic. A dusting of semolina in the foreground, a small ceramic bowl of flour and a rolling pin off to the side. Close enough to feel tactile and handcrafted — the skill and patience of the process should be palpable.

---

### 3.2 Wein & Wild: Herbstliches Menü

| Field | Value |
|---|---|
| **Slug** | `wein-wild-herbstliches-menue` |
| **Supabase Filename** | `wein-wild-herbst.webp` |
| **Type** | Dynamic |
| **Priority** | High |
| **Dimensions** | 1200 × 900 px |
| **Format** | WebP |

**Description:** A pan-seared venison medallion plated on a dark matte plate, garnished with a glossy deep-red wine reduction, a few autumn berries (lingonberry, rosehip), and a sprig of thyme. A glass of full-bodied red wine beside the plate, candlelight in the background. Moody, low ambient light — the autumnal palette of burgundy, amber, and deep forest green. Understated fine-dining elegance without being overly formal.

---

### 3.3 Plant-Based Gourmet: Vegan kochen

| Field | Value |
|---|---|
| **Slug** | `plant-based-gourmet-vegan` |
| **Supabase Filename** | `plant-based-gourmet.webp` |
| **Type** | Dynamic |
| **Priority** | High |
| **Dimensions** | 1200 × 900 px |
| **Format** | WebP |

**Description:** A vibrant overhead composition of colourful plant-based ingredients on a light stone or pale wood surface. Purple aubergine, golden turmeric root, bright red peppers, heirloom tomatoes, deep green herbs — artfully arranged but not fussy. Bright, clean natural daylight. A beautifully plated gourmet vegan dish partially visible at one corner of the frame. Conveys abundance, flavour, and creativity — no sense of restriction or compromise.

---

### 3.4 Perfect Steak: Grillen & Braten

| Field | Value |
|---|---|
| **Slug** | `perfect-steak-grillen-braten` |
| **Supabase Filename** | `perfect-steak.webp` |
| **Type** | Dynamic |
| **Priority** | High |
| **Dimensions** | 1200 × 900 px |
| **Format** | WebP |

**Description:** A thick, beautifully seared côte de boeuf or ribeye resting on a weathered cast iron pan or heavy wooden chopping board, sliced to reveal a perfect pink medium-rare interior. Visible caramelised crust with char marks. A sprig of rosemary, a crushed garlic clove, and a knob of herb butter melting alongside. Warm dramatic side-lighting that accentuates the texture of the crust. Confident, unapologetically carnivore.

---

### 3.5 Französische Patisserie: Macarons

| Field | Value |
|---|---|
| **Slug** | `franzoesische-patisserie-macarons` |
| **Supabase Filename** | `patisserie-macarons.webp` |
| **Type** | Dynamic |
| **Priority** | High |
| **Dimensions** | 1200 × 900 px |
| **Format** | WebP |

**Description:** A small stack of elegantly crafted macarons in pastel tones — pale rose, ivory, and soft pistachio green — arranged on a white marble surface or a round white plate. Soft, diffused natural light from the side. A few macaron shells scattered casually nearby, one cracked open to reveal the ganache filling. A small sieve with icing sugar dust caught mid-air in the background. French patisserie aesthetic — refined, delicate, quietly precise. No clutter.

---

### 3.6 Sushi Masterclass: Von Maki bis Nigiri

| Field | Value |
|---|---|
| **Slug** | `sushi-masterclass-maki-nigiri` |
| **Supabase Filename** | `sushi-masterclass.webp` |
| **Type** | Dynamic |
| **Priority** | High |
| **Dimensions** | 1200 × 900 px |
| **Format** | WebP |

**Description:** A dark wooden sushi board arranged with freshly hand-made nigiri and maki rolls. Precise, beautiful cuts of salmon and tuna glistening under soft directional light. A bamboo rolling mat and a sharp yanagiba knife in the background. A small ceramic dish of soy sauce and a small mound of wasabi alongside. Clean, minimal Japanese aesthetic — dark wood, white rice, vivid fish tones. Calm, exact composition that highlights texture and freshness.

---

### 3.7 Quick & Healthy: After-Work Cooking

| Field | Value |
|---|---|
| **Slug** | `quick-healthy-after-work-cooking` |
| **Supabase Filename** | `after-work-cooking.webp` |
| **Type** | Dynamic |
| **Priority** | Medium |
| **Dimensions** | 1200 × 900 px |
| **Format** | WebP |

**Description:** Two or three people in casual evening clothes — work attire without jackets — cooking together at a kitchen counter, laughing mid-conversation. Quick, colourful dishes in the making: a grain bowl or stir-fry with vibrant green, orange, and red vegetables. Warm kitchen pendant lighting suggesting an after-work hour. Relaxed, social, achievable — the image should convey that good food on a weeknight is entirely possible and enjoyable.

---

### 3.8 Sauerteig-Geheimnisse: Brot backen

| Field | Value |
|---|---|
| **Slug** | `sauerteig-geheimnisse-brot-backen` |
| **Supabase Filename** | `sauerteig-brot.webp` |
| **Type** | Dynamic |
| **Priority** | High |
| **Dimensions** | 1200 × 900 px |
| **Format** | WebP |

**Description:** A freshly baked sourdough boule resting on a round wooden board, its scored crust split open in a dramatic ear during baking. Deep golden-brown, almost amber caramelised crust. A cross-section slice partially cut away to reveal the open, chewy crumb structure with large irregular air pockets. A light dusting of rye flour on the board. Warm morning bakery light. In the soft background, hands shaping another loaf. The image should evoke patience, craft, and the primordial satisfaction of real bread.

---

### 3.9 Thai Street Food: Würzig & Authentisch

| Field | Value |
|---|---|
| **Slug** | `thai-street-food-wuerzig-authentisch` |
| **Supabase Filename** | `thai-street-food.webp` |
| **Type** | Dynamic |
| **Priority** | Medium |
| **Dimensions** | 1200 × 900 px |
| **Format** | WebP |

**Description:** A vivid spread of Thai aromatics and fresh ingredients on a dark stone surface: fresh lemongrass stalks, kaffir lime leaves, sliced galangal, a pile of bright red bird's eye chillies, Thai basil. Centre frame: a wok shot from slightly above and the side, with a vibrant stir-fry in motion, steam rising, the colours of the dish vivid and saturated. Rich warm tones — orange, red, deep green. Authentic energy without any kitschy tourist-market cliché.

---

## Section 4: About Us Page

### 4.1 Hero — Atelier Interior *(shared)*

| Field | Value |
|---|---|
| **Page / Component** | `app/(public)/ueber-uns/page.tsx` line 17 — full-width hero background |
| **Filename & Path** | `/public/images/about/atelier-interior.jpg` *(same file as Section 1.1)* |
| **Type** | Static |
| **Priority** | High |
| **Dimensions** | 1920 × 1080 px *(supply at this resolution; Section 1.1 crops to 800 × 1000)* |
| **Format** | JPG |

**Description:** Same image as the homepage feature photo. Used as the full-bleed page hero here, cropped landscape. Ensure the key subject (guests, table, warm light) sits safely within the central 70% of the frame. See Section 1.1 for full description.

---

### 4.2 "Why Menufaktur?" Kitchen Team Image

| Field | Value |
|---|---|
| **Page / Component** | `app/(public)/ueber-uns/page.tsx` line 42 — two-column section |
| **Filename & Path** | `/public/images/about/team-kitchen.jpg` |
| **Type** | Static |
| **Priority** | High |
| **Dimensions** | 800 × 1000 px (4:5) |
| **Format** | JPG |

**Description:** Portrait-format shot of two or three people — the menufaktur team — together in the atelier kitchen, mid-activity: plating a dish, tasting something, or sharing a laugh over a recipe. Not a posed team photo. Warm overhead pendant lighting. The professional kitchen setup is visible in the background. Wine red or warm linen aprons. Conveys passion, expertise, and genuine human warmth. This image tells the "who we are" story more than any headline can.

---

### 4.3 Hands & Dough — Team Story Section

| Field | Value |
|---|---|
| **Page / Component** | `app/(public)/ueber-uns/page.tsx` line 119 — square image block |
| **Filename & Path** | `/public/images/about/hands-dough.jpg` |
| **Type** | Static |
| **Priority** | Medium |
| **Dimensions** | 800 × 800 px (square) |
| **Format** | JPG |

**Description:** Square-format close-up of hands working with fresh dough on a flour-dusted wooden surface. The entire frame is hands and dough — no face needed. Could be bread dough, pasta dough, or pastry. Soft directional side-lighting that catches the texture of the dough and the wood grain. Traces of flour on the forearms. Conveys craft, care, and the hand-made quality at the heart of the menufaktur philosophy.

---

## Section 5: Private Events Page

### 5.1 Private Events Hero

| Field | Value |
|---|---|
| **Page / Component** | `app/(public)/private-events/page.tsx` line 18 — full-width hero background |
| **Filename & Path** | `/public/images/private-events/loft-hero.jpg` |
| **Type** | Static |
| **Priority** | High |
| **Dimensions** | 1920 × 1080 px |
| **Format** | JPG |

**Description:** Full-width hero of the menufaktur atelier set up for a private event. A long table dressed with elegant simplicity — natural linen, flickering candles, wine glasses. Guests visible in the soft background: standing, mingling, laughing. Warm candlelight and pendant lights overhead. The space has urban character — not a generic event hall. 8–12 guests in smart-casual attire. The image should make the viewer immediately think: "I want to host my next event here."

---

### 5.2 Atelier Space — Interior Architecture Shot

| Field | Value |
|---|---|
| **Page / Component** | `app/(public)/private-events/page.tsx` line 57 |
| **Filename & Path** | `/public/images/private-events/atelier-space.jpg` |
| **Type** | Static |
| **Priority** | High |
| **Dimensions** | 800 × 1000 px (4:5) |
| **Format** | JPG |

**Description:** Portrait-format architectural interior shot of the menufaktur space — empty or minimally dressed to show the full room. Wide-angle enough to convey scale. Professional kitchen equipment or a central preparation island visible. Warm golden-hour window light from one side. The image functions as a "see the space" shot for potential private event clients — it should feel like a premium, characterful venue with real personality. Clean surfaces, warm tones.

---

### 5.3 Gallery — Live Event in Action

| Field | Value |
|---|---|
| **Page / Component** | `app/(public)/private-events/page.tsx` line 72 — min-height 480 px gallery block |
| **Filename & Path** | `/public/images/private-events/loft-event.jpg` |
| **Type** | Static |
| **Priority** | Medium |
| **Dimensions** | 1600 × 900 px |
| **Format** | JPG |

**Description:** A candid documentary shot of an actual private event in progress. Multiple guests engaged simultaneously — one chopping, one stirring, one laughing with a glass of wine in hand. The scene around the central preparation island or long kitchen counter. Warm atmospheric lighting from pendants above and candles on surfaces. The image should feel like a genuine, joyful evening — not a styled shoot. The social energy and exclusivity of a private booking should be immediately apparent.

---

### 5.4 Catering at Home Section

| Field | Value |
|---|---|
| **Page / Component** | `app/(public)/private-events/page.tsx` line 123 |
| **Filename & Path** | `/public/images/private-events/catering-home.jpg` |
| **Type** | Static |
| **Priority** | Medium |
| **Dimensions** | 1280 × 720 px (16:9) |
| **Format** | JPG |

**Description:** A beautifully set private home dining table with a professionally catered spread. Warm domestic lighting — table candles, a pendant, perhaps a floor lamp at the edge of frame. Natural flowers, linen napkins, 3–4 dishes presented in the centre. The aesthetic bridges professional culinary quality and home warmth. Could show the menufaktur team member placing a final dish or the host welcoming guests. Makes the viewer imagine their own dinner party elevated by professional hands.

---

### 5.5 Private Cooking Class Section

| Field | Value |
|---|---|
| **Page / Component** | `app/(public)/private-events/page.tsx` line 133 |
| **Filename & Path** | `/public/images/private-events/private-cooking-class.jpg` |
| **Type** | Static |
| **Priority** | Medium |
| **Dimensions** | 1280 × 720 px (16:9) |
| **Format** | JPG |

**Description:** A small, intimate group (4–6 people) in the menufaktur kitchen with an instructor demonstrating a specific technique — perhaps rolling pasta, filleting fish, or tempering chocolate. The group is close, attentive, engaged. Not a large-class feel — this is clearly a private arrangement. Warm kitchen light. The scene conveys the premium, personalised nature of a private booking compared to a public course, and the direct access to expert knowledge.

---

## Section 6: Contact Page

### 6.1 Hero — Atelier Interior *(shared)*

| Field | Value |
|---|---|
| **Page / Component** | `app/(public)/kontakt/page.tsx` line 18 — full-width hero background |
| **Filename & Path** | `/public/images/about/atelier-interior.jpg` *(same file as Sections 1.1 and 4.1)* |
| **Type** | Static |
| **Priority** | Medium |
| **Dimensions** | 1920 × 1080 px *(same source file)* |
| **Format** | JPG |

**Description:** Same image as homepage and about page. No additional photo required — ensure the single file is sized to serve all three contexts (hero landscape crop, portrait feature crop).

---

### 6.2 Location — Atelier Exterior

| Field | Value |
|---|---|
| **Page / Component** | `app/(public)/kontakt/page.tsx` line 119 |
| **Filename & Path** | `/public/images/about/atelier-exterior.jpg` |
| **Type** | Static |
| **Priority** | Medium |
| **Dimensions** | 1280 × 720 px (16:9) |
| **Format** | JPG |

**Description:** The exterior of the menufaktur location in Frankfurt-Bornheim. A street-level or slightly elevated shot of the building facade showing the entrance clearly. Warm golden-hour or late-afternoon light. The Bornheim neighbourhood character visible — period Wilhelminian architecture, a quiet residential street, perhaps a few plane trees or planters nearby. Welcoming and identifiable as a destination. A visitor who has never been there should feel oriented and curious to arrive.

---

## Section 7: Voucher Page (Gutschein)

### 7.1 Voucher Page Hero

| Field | Value |
|---|---|
| **Page / Component** | `app/(public)/gutschein/page.tsx` line 18 — full-width hero background |
| **Filename & Path** | `/public/images/hero/gutscheine-hero.jpg` |
| **Type** | Static |
| **Priority** | Medium |
| **Dimensions** | 1920 × 1080 px |
| **Format** | JPG |

**Description:** A warm, celebratory gifting moment in a kitchen or dining setting. Two people — one presenting a beautifully wrapped gift box or envelope, the other smiling in genuine surprise. Could be set in the menufaktur atelier or a warm domestic kitchen. The aesthetic is personal and genuine, not commercial: this is the gift of an experience, not a product. Warm candlelight or late-afternoon glow. Wine red ribbon or wrapping as an accent colour.

---

### 7.2 Voucher Preview / Description Section

| Field | Value |
|---|---|
| **Page / Component** | `app/(public)/gutschein/page.tsx` line 44 |
| **Filename & Path** | `/public/images/general/gutschein-preview.jpg` |
| **Type** | Static |
| **Priority** | Medium |
| **Dimensions** | 800 × 1000 px (4:5) |
| **Format** | JPG |

**Description:** A lifestyle still-life with a menufaktur gift voucher (or an elegant cream envelope representing one) resting on a warm wooden table surface. Alongside it: a small sprig of rosemary or a dried flower stem, perhaps a half-full glass of red wine or an espresso cup in the soft background. Warm, diffused natural side-light. No text overlays. The image makes the voucher feel like a considered, quiet luxury gift — something the recipient would be genuinely delighted to open.

---

## Section 8: Auth & Account Pages

No page-specific hero or editorial images exist on the login, register, or account overview pages — these pages are functional UI only.

### 8.1 Booking History — Course Thumbnails *(Dynamic, shared)*

| Field | Value |
|---|---|
| **Page / Component** | `app/(public)/konto/buchungen/page.tsx` lines 58 and 121 |
| **Filename & Path** | Supabase Storage `course-photos` bucket — same `photo_url` as course cards |
| **Type** | Dynamic |
| **Priority** | Medium |
| **Dimensions** | Displayed at 40 × 40 (160 px); source file: 1200 × 900 px *(same as Section 3)* |
| **Format** | WebP |

**Description:** The same course photo uploaded via the admin panel is reused here as a small 40 × 40 thumbnail in the user's upcoming and past booking lists. Past bookings render the image in greyscale. No separate image file needed — the `photo_url` from the courses table is used directly.

---

## Section 9: Course Detail Page

### 9.1 Course Hero Image *(Dynamic, shared with Section 3)*

| Field | Value |
|---|---|
| **Page / Component** | `app/(public)/kurse/[slug]/page.tsx` lines 101–107 — full-width hero |
| **Filename & Path** | Supabase Storage `course-photos` bucket — per-course `photo_url` |
| **Type** | Dynamic |
| **Priority** | High |
| **Dimensions** | 1920 × 1080 px for full-width hero display; same source file as 1200 × 900 card thumbnail |
| **Format** | WebP |

**Description:** The same image uploaded for the course card (Section 3) is reused as the full-bleed page hero. Upload the source at 1920 × 1080 minimum so it looks sharp in both the hero and thumbnail contexts. Ensure the main subject is centred both horizontally and vertically for safe cropping across aspect ratios. See per-course descriptions in Section 3.

---

### 9.2 Instructor Avatar

| Field | Value |
|---|---|
| **Page / Component** | `app/(public)/kurse/[slug]/page.tsx` line 186 — displayed at w-24 h-24 (96 × 96 px) |
| **Filename & Path** | `/public/images/about/instructor.jpg` |
| **Type** | Static |
| **Priority** | Medium |
| **Dimensions** | 192 × 192 px (2× for retina) |
| **Format** | JPG |

**Description:** A warm, professional headshot of the menufaktur head instructor or chef-founder. Photographed in or near the atelier kitchen — not a studio portrait. Candid in quality: perhaps mid-preparation or turning naturally to face the camera. Warm, approachable smile. A linen or wine red apron visible at the shoulder. Soft natural light from the side. The image renders as a small circular avatar, so the face must be tightly centred in the frame with minimal dead space around the subject.

---

## Section 10: Admin Pages

### 10.1 Admin Profile Photo

| Field | Value |
|---|---|
| **Page / Component** | `app/admin/einstellungen/page.tsx` line 59 |
| **Filename & Path** | `/public/images/admin/profile-photo.jpg` *(or Supabase Storage if dynamic upload is later implemented)* |
| **Type** | Static |
| **Priority** | Low |
| **Dimensions** | 192 × 192 px |
| **Format** | JPG |

**Description:** Professional profile headshot of the admin user. Not customer-facing — shown only in the admin settings panel. A clean, well-lit headshot against a neutral background or a soft kitchen environment is sufficient.

---

### 10.2 Admin Booking Detail — Course Photo *(Dynamic, shared)*

| Field | Value |
|---|---|
| **Page / Component** | `app/admin/buchungen/[id]/page.tsx` line 55 |
| **Filename & Path** | Supabase Storage `course-photos` bucket — same `photo_url` |
| **Type** | Dynamic |
| **Priority** | Low |
| **Dimensions** | Same as course thumbnails *(Section 3)* |
| **Format** | WebP |

**Description:** Reuses the same course photo uploaded via admin. No additional image required. Displayed in the admin panel booking detail view for quick visual identification of the booked course.

---

## Section 11: Miscellaneous

### 11.1 AGB Page — Team Cooking Section

| Field | Value |
|---|---|
| **Page / Component** | `app/(public)/agb/page.tsx` line 130 — aspect-[4/3] image block |
| **Filename & Path** | `/public/images/private-events/team-cooking.jpg` |
| **Type** | Static |
| **Priority** | Low |
| **Dimensions** | 1200 × 900 px (4:3) |
| **Format** | JPG |

**Description:** A team-building cooking event in progress — a larger group of 8–12 people in business casual attire working together around the menufaktur kitchen island. Multiple tasks happening simultaneously: one team chopping, another stirring, everyone engaged. Warm, energetic atmosphere. Laughing, collaboration, a little healthy chaos. The image illustrates the "team event" use case referenced in the terms & conditions section. Can share an asset with the private events gallery (Section 5.3) if the subject matter overlaps.

---

---

## Gemini Generation Prompts

One ready-to-use English prompt per unique image file. Apply these brand style notes to every image:

> **Brand style notes:** Warm, soft, diffused natural lighting — no harsh flash or studio lighting. Authentic moments — real people cooking together, not posed. Color palette: deep wine red accents, warm beige neutrals, subtle gold-yellow highlights. Frankfurt-Bornheim urban kitchen setting where relevant. Quiet confidence — understated, premium, never gimmicky. Close-ups of real ingredients and handcrafted dishes where appropriate. No watermarks, no text overlays, no borders.

---

**about/atelier-interior.jpg**
Prompt: A warm, authentic interior photograph of an intimate cooking atelier in Frankfurt-Bornheim. Guests gathered around a large wooden preparation table, laughing mid-conversation. Soft late-afternoon natural light from a side window casting long warm shadows. Deep wine red accents in kitchen equipment or linen aprons. Exposed brick or warm-plastered walls, no clutter. Rustic yet refined. Portrait orientation, 4:5 ratio for primary crop, also usable landscape. High resolution.

---

**about/team-kitchen.jpg**
Prompt: A warm, authentic photograph of two or three people in linen or wine red aprons working together in a professional kitchen — plating a dish, tasting from a spoon, sharing a quiet laugh. Candid, not posed. Warm overhead pendant lighting. A clean, characterful urban kitchen in the background. Soft natural light from one side. Unpretentious, quietly premium aesthetic. Portrait orientation, 4:5 ratio. High resolution.

---

**about/hands-dough.jpg**
Prompt: A warm, authentic close-up photograph of two hands kneading or shaping fresh dough on a flour-dusted wooden surface. No face, no body beyond the forearms. Soft directional side-lighting that catches the texture of the dough and the wood grain. A light dusting of flour visible on the skin and the board. The image should feel tactile, patient, and skilled. Square crop. High resolution.

---

**about/atelier-exterior.jpg**
Prompt: A warm, authentic street-level photograph of the exterior facade of a cooking atelier in Frankfurt-Bornheim. Late-afternoon golden-hour light. Wilhelminian period architecture, a quiet residential street, plane trees or planters nearby. The building entrance clearly visible and welcoming. Unpretentious, neighbourhood feel — a destination worth seeking out. Landscape orientation, 16:9 ratio. High resolution.

---

**about/instructor.jpg**
Prompt: A warm, authentic close-up headshot of a chef instructor in a linen or wine red apron, photographed in or near a professional kitchen. Turning naturally toward the camera with a relaxed, genuine smile. Soft natural side-lighting. Not a studio portrait — candid and real. The face must be tightly centred for circular avatar cropping. Square crop, 1:1 ratio. High resolution.

---

**hero/gutscheine-hero.jpg**
Prompt: A warm, authentic photograph of two people sharing a gift-giving moment in a kitchen or dining setting. One person presenting a beautifully wrapped gift box or cream envelope with a wine red ribbon, the other smiling in genuine surprise. Warm candlelight or late-afternoon glow. Authentic and personal — the gift of a cooking experience, not a product. Landscape orientation, 16:9 ratio. High resolution.

---

**general/gutschein-preview.jpg**
Prompt: A warm, authentic lifestyle still-life photograph of an elegant cream envelope or gift voucher card resting on a warm wooden table surface. A small sprig of rosemary or a dried flower stem alongside it. A half-full glass of red wine or an espresso cup softly out of focus in the background. Diffused warm natural side-light. No text overlays. Quiet luxury aesthetic. Portrait orientation, 4:5 ratio. High resolution.

---

**private-events/loft-hero.jpg**
Prompt: A warm, authentic photograph of an urban cooking atelier set up for a private dinner event. A long table dressed with natural linen, flickering candles, and wine glasses. Eight to twelve guests in smart-casual attire standing and mingling in the soft background. Warm candlelight and pendant lights overhead. The venue has real character — not a generic event hall. The image should make the viewer immediately want to host their next gathering here. Landscape orientation, 16:9 ratio. High resolution.

---

**private-events/atelier-space.jpg**
Prompt: A warm, authentic wide-angle architectural interior photograph of a professional cooking atelier in Frankfurt-Bornheim, mostly empty to show the full venue potential. A central preparation island or long kitchen counter as the focal point. Professional kitchen equipment visible in the background. Warm golden-hour light from a side window. Clean surfaces, warm beige and wine red accents. Portrait orientation, 4:5 ratio. High resolution.

---

**private-events/loft-event.jpg**
Prompt: A warm, authentic candid photograph of a private cooking event in progress at an urban kitchen atelier. Multiple guests engaged simultaneously around a central preparation island — one chopping, one stirring, one laughing with a glass of wine. Atmospheric warm pendant lighting and candles on surfaces. Social, energetic, and exclusive. No posing — pure documentary moment. Landscape orientation, 16:9 ratio. High resolution.

---

**private-events/catering-home.jpg**
Prompt: A warm, authentic photograph of a beautifully set private home dining table with a professionally catered spread. Table candles, linen napkins, fresh flowers. Three or four dishes presented in the centre. A person placing a final dish or welcoming a guest at the edge of frame. The aesthetic bridges professional culinary quality and home warmth. Landscape orientation, 16:9 ratio. High resolution.

---

**private-events/private-cooking-class.jpg**
Prompt: A warm, authentic photograph of a small, intimate group of four to six people in a professional kitchen with a chef instructor demonstrating a cooking technique — pasta rolling, knife work, or sauce finishing. The group is close and attentive. Warm kitchen pendant lighting. The scene conveys a premium, personalised private experience rather than a large public class. Landscape orientation, 16:9 ratio. High resolution.

---

**private-events/team-cooking.jpg**
Prompt: A warm, authentic photograph of eight to twelve people in business casual attire cooking together around a large kitchen island, laughing and collaborating. Multiple tasks happening simultaneously — chopping, stirring, plating. Warm atmospheric kitchen lighting. Energetic, social, and genuinely fun. Conveys the team-building spirit of a corporate private cooking event. Landscape orientation, 4:3 ratio. High resolution.

---

**courses/pasta-manufaktur.webp**
Prompt: A warm, authentic close-up photograph of fresh egg pasta dough being hand-rolled on a flour-dusted wooden surface. Golden ribbons of tagliatelle or pappardelle draped casually over a pasta board. Warm late-afternoon natural light. A small ceramic bowl of semolina and a rolling pin off to the side. The image should feel tactile and handcrafted — the skill and patience of the craft palpable. Landscape orientation, 4:3 ratio. High resolution.

---

**courses/wein-wild-herbst.webp**
Prompt: A warm, authentic food photograph of a pan-seared venison medallion on a dark matte plate, garnished with a glossy deep-red wine reduction, a few autumn berries, and a sprig of thyme. A glass of full-bodied red wine beside the plate, candlelight in the background. Moody, low ambient light in autumnal burgundy, amber, and forest green. Understated fine-dining elegance. Landscape orientation, 4:3 ratio. High resolution.

---

**courses/plant-based-gourmet.webp**
Prompt: A warm, authentic overhead photograph of colourful plant-based ingredients on a light stone surface — purple aubergine, golden turmeric root, bright red peppers, heirloom tomatoes, deep green herbs — artfully composed. A beautifully plated gourmet vegan dish partially visible at one corner. Bright, clean natural daylight. Conveys abundance and creative flavour, not restriction. Landscape orientation, 4:3 ratio. High resolution.

---

**courses/perfect-steak.webp**
Prompt: A warm, authentic food photograph of a thick seared ribeye or côte de boeuf resting on a cast iron pan, sliced to reveal a perfect pink medium-rare interior. Caramelised crust with visible char marks. A sprig of rosemary, a crushed garlic clove, and a knob of herb butter melting alongside. Warm dramatic side-lighting that accentuates texture. Confident, unapologetically meat-forward. Landscape orientation, 4:3 ratio. High resolution.

---

**courses/patisserie-macarons.webp**
Prompt: A warm, authentic food photograph of a small stack of hand-crafted macarons in pale rose, ivory, and pistachio green on a white marble surface. Soft diffused natural light from the side. A few shells scattered nearby, one cracked open to reveal ganache filling. A small sieve with icing sugar dust in the background. Refined, delicate, quietly precise French patisserie aesthetic. Landscape orientation, 4:3 ratio. High resolution.

---

**courses/sushi-masterclass.webp**
Prompt: A warm, authentic food photograph of a dark wooden sushi board arranged with freshly hand-made nigiri and maki rolls. Precise cuts of glistening salmon and tuna. A bamboo rolling mat and yanagiba knife in the background. A small ceramic dish of soy sauce and wasabi alongside. Clean, minimal Japanese aesthetic — dark wood, white rice, vivid fish tones. Calm, exact lighting. Landscape orientation, 4:3 ratio. High resolution.

---

**courses/after-work-cooking.webp**
Prompt: A warm, authentic photograph of two or three people in casual evening clothes cooking together at a kitchen counter, laughing mid-conversation. A colourful quick grain bowl or stir-fry with vibrant vegetables in the making. Warm kitchen pendant lighting suggesting an after-work hour. Relaxed, social, achievable — the image says good food on a weeknight is entirely possible. Landscape orientation, 4:3 ratio. High resolution.

---

**courses/sauerteig-brot.webp**
Prompt: A warm, authentic food photograph of a freshly baked sourdough boule on a round wooden board, its scored crust split open in a dramatic ear during baking. Deep golden-brown caramelised crust. A cross-section slice revealing the open, chewy crumb structure with large air pockets. A light dusting of rye flour on the board. Warm morning bakery light. Hands shaping another loaf softly in the background. Landscape orientation, 4:3 ratio. High resolution.

---

**courses/thai-street-food.webp**
Prompt: A warm, authentic photograph of Thai aromatics and fresh ingredients on a dark stone surface — fresh lemongrass, kaffir lime leaves, sliced galangal, bright red bird's eye chillies, Thai basil. Centre frame: a wok shot from a slight angle with a vivid stir-fry in motion, steam rising. Rich warm tones — orange, red, deep green. Authentic energy, no kitschy tourist-market styling. Landscape orientation, 4:3 ratio. High resolution.

---

*End of IMAGE_REQUIREMENTS.md — 23 unique image files required.*
