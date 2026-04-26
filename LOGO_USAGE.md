# Menufaktur — Logo Usage Guide

This document covers logo variants, usage rules, and what to avoid. Logo files (SVG, PNG) should be stored separately in the `/assets/logos/` folder of the project repo.

---

## Logo variants

The brand has three main logo configurations:

### 1. Main logo (vertical / stacked)
Logo mark (chef's hat icon) above the "menufaktur" wordmark. **Primary usage** — use whenever space allows.

### 2. Horizontal logo
Logo mark to the left of the wordmark. Use when vertical space is restrictive (e.g. website headers, narrow banners).

### 3. Inverted logo
Wine Red logo on Light Beige background. Use when production constraints or background color make the primary version illegible.

### 4. Logo mark (icon only)
Just the chef's hat symbol. Used as:
- App icon / favicon
- Social media avatar
- Watermark
- Decorative element when partially cropped

### 5. Monochrome versions
Black on white, or white on black. **Only when the primary color version isn't suitable** for the artwork (e.g. single-color print, fax, certain merchandise).

---

## Color rules

**Primary color combination:**
- Logo: Light Beige `#FFFCE1`
- Background: Wine Red `#7E1423`

**Inverted (alternative):**
- Logo: Wine Red `#7E1423`
- Background: Light Beige `#FFFCE1`

**Monochrome (rare exceptions):**
- Black logo on white background
- White logo on black background

The logo must always appear in Light Beige on Wine Red as the default unless an exception applies.

---

## Clear space (minimum padding)

Maintain clear space around the logo equal to the **height of the letter "k"** in the wordmark. Nothing else — text, images, edges — should encroach on this space.

## Minimum size

| Use | Minimum height |
|---|---|
| Print | 10 mm |
| Digital | 30 px |

Below these sizes, logo details become illegible.

---

## Logo mark — creative usage (Do's)

The standalone logo mark (chef's hat icon) can be used decoratively in these specific ways:

- **Bottom-right corner**, showing only the upper portion of the mark
- **Top-right corner**, showing only the lower portion of the mark
- **Right-center**, showing only the left portion of the mark
- **As an image mask** — images can be placed inside the shape of the logo mark

These creative crops are allowed only with the standalone icon, not with the full logo (icon + wordmark).

---

## Don'ts — Main logo

Never:
- Stretch or distort the logo (height/width ratio is fixed)
- Use the logo without its Wine Red background (except inverted version on Light Beige)
- Add color outlines
- Add drop shadows
- Remove the fill color
- Change the colors
- Rotate the logo
- Change the spacing between the icon and the wordmark
- Change the size ratio or position of the wordmark relative to the icon

## Don'ts — Logo mark (icon)

Never:
- Stretch or distort the logo mark
- Add gradients
- Add color outlines
- Add drop shadows
- Remove the fill color
- Change the color
- Rotate the logo mark
- Shear or skew the logo mark
- Blur the logo mark

---

## Web-specific guidance

**Header logo:**
- Use the horizontal logo variant
- Default: Light Beige logo on Wine Red header background
- Alternative: Wine Red logo on Light Beige header background (for a lighter site feel)
- Maintain minimum 30px height; recommended 40–60px height for desktop, 32–40px for mobile
- Always link to homepage

**Favicon / app icon:**
- Use the logo mark only (chef's hat icon)
- Provide multiple sizes: 16x16, 32x32, 48x48, 192x192, 512x512
- Format: SVG preferred, PNG fallback, ICO for legacy browsers
- Background: solid Wine Red or transparent (test both)

**Social media / sharing:**
- Open Graph image: full main logo on Wine Red background, recommended 1200x630px
- Profile/avatar image: logo mark only on Wine Red, square format

**Email signatures / transactional emails:**
- Horizontal logo, max 200px wide
- Use PNG (for email client compatibility), not SVG

---

## Files needed in `/assets/logos/`

Request these from the designer or generate from source files:

- `menufaktur-logo-main.svg` — vertical logo, Light Beige on transparent
- `menufaktur-logo-horizontal.svg` — horizontal logo, Light Beige on transparent
- `menufaktur-logo-inverted.svg` — Wine Red on transparent
- `menufaktur-logomark.svg` — icon only, Light Beige on transparent
- `menufaktur-logomark-wine.svg` — icon only, Wine Red on transparent
- `menufaktur-logo-mono-black.svg`
- `menufaktur-logo-mono-white.svg`
- PNG fallbacks of each at 2x and 3x resolution
- `favicon.ico`, `favicon-32x32.png`, `apple-touch-icon.png` (180x180)
- `og-image.png` (1200x630, full logo on Wine Red background)

If only PDF assets exist, the designer can export SVGs from the source. Don't trace logos from screenshots — always work from vector source files.
