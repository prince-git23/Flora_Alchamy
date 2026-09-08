/**
 * Payment architecture (Phase 3D).
 *
 * This is a clean seam for a future payment gateway — NO real provider is
 * integrated in this prototype. The order model already carries
 * paymentMethod / paymentStatus / paymentReference, and this module is the
 * single place that decides how payment is represented. Nothing here claims a
 * payment was processed, bank-verified, or gateway-connected.
 *
 * When a real provider is added, only this module (and the server-side order
 * creation) needs to change.
 */

export const PAYMENT_METHODS = [
  { id: 'upi', label: 'Instant UPI', description: 'Any UPI app', icon: 'qr' },
  { id: 'card', label: 'Cards & Netbanking', description: 'Credit / debit cards, netbanking', icon: 'card' },
  { id: 'cod', label: 'Pay on Delivery', description: 'Cash or UPI at delivery', icon: 'cod' },
];

export function getPaymentMethods() {
  return PAYMENT_METHODS;
}

export function getPaymentMethodById(id) {
  return PAYMENT_METHODS.find((m) => m.id === id) || PAYMENT_METHODS[0];
}

/**
 * Prototype payment preparation — honest Sample status.
 *
 * Returns the chosen method label plus an explicit "Sample" payment status so
 * orders never claim to have been charged. The server also records
 * paymentStatus: 'Sample' on the order document.
 */
export function preparePayment(methodId, amount) {
  const method = getPaymentMethodById(methodId);
  return {
    method: method.label,
    status: 'Sample',
    reference: null,
    amount: Number(amount) || 0,
    note: 'Prototype checkout — no real payment is processed and no charge is made.',
  };
}