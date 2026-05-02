# Component Registry

All reusable components. Update this file whenever a new component is created or its API changes.

---

## Layout

| Component | Path | Status | Description |
|---|---|---|---|
| Header | `components/layout/Header.tsx` | ✅ | Fixed, Wine Red bg, text logo placeholder, desktop nav + mobile hamburger |
| Footer | `components/layout/Footer.tsx` | ✅ | 4-col grid: brand/contact, menu, legal, social icons |
| MobileNav | — | ❌ | Inline in Header (no separate component needed) |
| AdminSidebar | `components/admin/AdminSidebar.tsx` | ⬜ | Admin left sidebar with nav items |
| AdminHeader | `components/admin/AdminHeader.tsx` | ⬜ | Admin top bar |

---

## Course components

| Component | Path | Status | Description |
|---|---|---|---|
| CourseCard | `components/course/CourseCard.tsx` | ✅ | Home page card — white bg, capacity badge, photo_url / ImagePlaceholder |
| CatalogCourseCard | `components/course/CatalogCourseCard.tsx` | ✅ | Catalog grid card — no bg, aspect-[4/3] image, sold-out state |
| CourseFiltersAndGrid | `components/course/CourseFiltersAndGrid.tsx` | ✅ | Client component: price slider, sort select, 6-per-page pagination |

---

## Booking components

| Component | Path | Status | Description |
|---|---|---|---|
| BookingModal | `components/booking/BookingModal.tsx` | ✅ | 4-step modal: participant count → participant data → invoice recipient → overview + submit. Hardcoded data; console.log on submit. Voucher: TEST123 = −30 €. |
| BookingButton | `components/booking/BookingButton.tsx` | ✅ | Client wrapper that renders the "Jetzt buchen" button and mounts BookingModal |

---

## Voucher components

| Component | Path | Status | Description |
|---|---|---|---|
| VoucherModal | `components/voucher/VoucherModal.tsx` | ✅ | Single-form modal: buyer/billing data, value pill selector (9 presets), quantity dropdown, legal (AGB required, postal delivery toggle, newsletter). console.log + route to /gutschein/bestaetigung/[id] on submit. |
| VoucherButton | `components/voucher/VoucherButton.tsx` | ✅ | Client wrapper: "Gutschein jetzt kaufen" button + mounts VoucherModal |

---

## Admin components

| Component | Path | Status | Description |
|---|---|---|---|
| DataTable | `components/admin/DataTable.tsx` | ⬜ | Generic sortable/filterable table |
| StatusBadge | `components/admin/StatusBadge.tsx` | ⬜ | Booking/voucher/course status badge |
| CourseForm | `components/admin/CourseForm.tsx` | ⬜ | Create/edit course form |
| BookingRow | `components/admin/BookingRow.tsx` | ⬜ | Booking list row |
| KPICard | `components/admin/KPICard.tsx` | ⬜ | Dashboard KPI stat card |

---

## Shared / UI

| Component | Path | Status | Description |
|---|---|---|---|
| PageHero | `components/ui/PageHero.tsx` | ⬜ | Full-width hero section with Wine Red background |
| SectionContainer | `components/ui/SectionContainer.tsx` | ⬜ | Max-width content wrapper with consistent padding |
| FormField | `components/ui/FormField.tsx` | ⬜ | Labelled input wrapper |

*shadcn/ui base components live in `components/ui/` and are not listed here individually.*

---

## Email templates

| Template | Path | Status | Description |
|---|---|---|---|
| BookingConfirmationEmail | `components/email/BookingConfirmationEmail.tsx` | ⬜ | Sent after confirmed payment |
| BankTransferPendingEmail | `components/email/BankTransferPendingEmail.tsx` | ⬜ | Sent when bank transfer booked |
| VoucherPurchaseEmail | `components/email/VoucherPurchaseEmail.tsx` | ⬜ | Sent to voucher purchaser |
| VoucherDeliveryEmail | `components/email/VoucherDeliveryEmail.tsx` | ⬜ | Sent to voucher recipient |
