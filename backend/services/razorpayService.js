import crypto from 'node:crypto';

/**
 * Razorpay provider adapter — TEST MODE ONLY.
 *
 * The provider stays behind this single module (frontend talks to our own
 * /api/payments endpoints, never to Razorpay directly). No Razorpay SDK is
 * required: we use the public REST API via global fetch and verify signatures
 * with node:crypto HMAC (the mandatory server-side check before an order may
 * be treated as paid).
 *
 * CONFIG (backend/.env):
 *   RAZORPAY_KEY_ID       test-mode public key id   (rzp_test_...)
 *   RAZORPAY_KEY_SECRET   test-mode secret           (never exposed to browser)
 *   RAZORPAY_BASE_URL     default https://api.razorpay.com (overridable for tests)
 *   RAZORPAY_WEBHOOK_SECRET  optional; enables the webhook endpoint
 *
 * When RAZORPAY_KEY_ID/SECRET are absent the whole payment provider is
 * disabled and the application keeps its frozen prototype behavior
 * (paymentStatus 'Sample', no real charge).
 */

const BASE_URL = process.env.RAZORPAY_BASE_URL || 'https://api.razorpay.com';

export function isConfigured() {
  return Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);
}

export function getKeyId() {
  return process.env.RAZORPAY_KEY_ID || '';
}

function basicAuth() {
  const raw = `${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`;
  return `Basic ${Buffer.from(raw).toString('base64')}`;
}

/**
 * POST https://api.razorpay.com/v1/orders
 * Amount is integer paise — the server always computes it from the stored
 * Flora order total; the client amount is never used.
 */
export async function createRazorpayOrder({ amountInPaise, receipt }) {
  if (!isConfigured()) {
    const err = new Error('Razorpay is not configured on this server.');
    err.code = 'PAYMENT_NOT_CONFIGURED';
    throw err;
  }
  const res = await fetch(`${BASE_URL}/v1/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: basicAuth(),
    },
    body: JSON.stringify({
      amount: Math.round(amountInPaise),
      currency: 'INR',
      receipt: String(receipt || '').slice(0, 40),
      payment_capture: 1,
      notes: { source: 'flora-alchemy' },
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    const err = new Error(
      `Razorpay order creation failed (${res.status}). ${detail}`.trim()
    );
    err.code = 'RAZORPAY_UPSTREAM_ERROR';
    err.status = res.status;
    throw err;
  }
  return res.json();
}

/**
 * Mandatory server-side signature verification.
 * HMAC-SHA256(secret, `${razorpay_order_id}|${razorpay_payment_id}`).
 * Timing-safe compare — never trust the browser to have verified itself.
 */
export function verifyPaymentSignature({ razorpayOrderId, razorpayPaymentId, signature }) {
  if (!isConfigured()) {
    return false;
  }
  const expected = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest('hex');
  const provided = String(signature || '').toLowerCase();
  const a = Buffer.from(expected, 'hex');
  const b = Buffer.from(provided, 'hex');
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

/**
 * Webhook signature verification — HMAC-SHA256(secret, raw request body).
 * Requires RAZORPAY_WEBHOOK_SECRET. Returns true/false.
 */
export function verifyWebhookSignature(rawBody, signatureHeader) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) return false;
  const expected = crypto
    .createHmac('sha256', secret)
    .update(rawBody)
    .digest('hex');
  const provided = String(signatureHeader || '').toLowerCase();
  const a = Buffer.from(expected, 'hex');
  const b = Buffer.from(provided, 'hex');
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export function isWebhookConfigured() {
  return Boolean(process.env.RAZORPAY_WEBHOOK_SECRET);
}

/**
 * Which payment methods run through Razorpay Checkout. 'cod' (Pay on
 * Delivery) is deliberately NOT a provider checkout — it stays a delivery
 * settlement recorded as Pending until collected.
 */
export function isRazorpayMethod(paymentMethod) {
  const m = String(paymentMethod || '').toLowerCase();
  return !['cod', 'pay on delivery', 'sample'].includes(m);
}