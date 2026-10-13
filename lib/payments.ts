/**
 * Payment methods offered at Stripe Checkout, for both bookings and vouchers.
 *
 * Card only. SEPA Direct Debit is deliberately excluded: it settles
 * asynchronously, so checkout.session.completed arrives before the money does
 * and a later failure would need async_payment_failed handling that does not
 * exist yet. Re-adding a delayed-notification method here means handling
 * checkout.session.async_payment_succeeded / async_payment_failed first.
 */
export const ENABLED_PAYMENT_METHODS = ["card"] as const

export type EnabledPaymentMethod = (typeof ENABLED_PAYMENT_METHODS)[number]

/**
 * Mutable copy for the Stripe SDK, which types payment_method_types as a
 * mutable array and so will not accept the readonly const directly.
 */
export function enabledPaymentMethodTypes(): EnabledPaymentMethod[] {
  return [...ENABLED_PAYMENT_METHODS]
}
