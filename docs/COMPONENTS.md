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
| CourseCard | `components/course/CourseCard.tsx` | ✅ | Card with photo placeholder, capacity badge, date/time/location, price |
| CourseGrid | `components/course/CourseGrid.tsx` | ⬜ | Responsive grid of CourseCards |
| CourseBadge | `components/course/CourseBadge.tsx` | ⬜ | Status/availability badge |
| CourseDetail | `components/course/CourseDetail.tsx` | ⬜ | Full course detail layout |

---

## Booking components

| Component | Path | Status | Description |
|---|---|---|---|
| BookingModal | `components/booking/BookingModal.tsx` | ⬜ | Modal overlay wrapper for booking flow |
| BookingStep1 | `components/booking/BookingStep1.tsx` | ⬜ | Participant count selector |
| BookingStep2 | `components/booking/BookingStep2.tsx` | ⬜ | Participant data forms |
| BookingStep3 | `components/booking/BookingStep3.tsx` | ⬜ | Invoice recipient form |
| BookingStep4 | `components/booking/BookingStep4.tsx` | ⬜ | Summary, voucher, confirmation |
| BookingConfirmation | `components/booking/BookingConfirmation.tsx` | ⬜ | Post-booking confirmation page |
| ParticipantForm | `components/booking/ParticipantForm.tsx` | ⬜ | Single participant card form |
| FoodPreferenceChips | `components/booking/FoodPreferenceChips.tsx` | ⬜ | Multi-select food preference chips |
| VoucherInput | `components/booking/VoucherInput.tsx` | ⬜ | Voucher code entry + validation |
| PriceBreakdown | `components/booking/PriceBreakdown.tsx` | ⬜ | Price breakdown table (participants × price, VAT, total) |
| StepIndicator | `components/booking/StepIndicator.tsx` | ⬜ | Step progress bar (Steps 1–4) |

---

## Voucher components

| Component | Path | Status | Description |
|---|---|---|---|
| VoucherPurchaseForm | `components/voucher/VoucherPurchaseForm.tsx` | ⬜ | Full voucher purchase flow |
| VoucherValueSelector | `components/voucher/VoucherValueSelector.tsx` | ⬜ | Preset + custom amount selector |
| VoucherDeliveryForm | `components/voucher/VoucherDeliveryForm.tsx` | ⬜ | Delivery method + address form |

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
