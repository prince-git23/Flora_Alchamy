/**
 * REAL Razorpay TEST MODE smoke — Phase 18.
 *
 * Talks to the ACTUAL Razorpay sandbox API (api.razorpay.com) — never to a
 * mock. Requires genuine rzp_test_* credentials via environment (or
 * backend/.env); SKIPS (exit 0) when absent, REFUSES (exit 1) on live keys.
 *
 * Runs on the Phase 16/17 shared test-server bootstrap: own backend process,
 * dedicated `Flora-Alchemy-Test-Razorpay` MongoDB database, fresh rate-limit
 * store. ImageKit credentials stay stripped (deterministic uploads) while
 * Razorpay credentials are deliberately REAL — this suite exists to exercise
 * the real provider.
 *
 * Verified end-to-end:
 *   1. Flora order → real Razorpay order (server-authoritative paise amount)
 *   2. retry create-order reuses the same Razorpay order id
 *   3. REAL test-mode payment capture (sandbox card API) when the provider
 *      allows it; otherwise a clearly-reported provider limitation
 *   4. POST /payments/verify against the REAL Razorpay order id:
 *      invalid signature → 400, order-id mismatch → 400, missing fields → 422,
 *      valid signature → Paid, duplicate verify → idempotent,
 *      second payment id → 409 PAYMENT_ALREADY_COMPLETED
 *   5. stock deducted exactly once after payment
 *   6. signed payment.failed webhook → Failed + stock released EXACTLY once
 *      (duplicate webhook delivery is a no-op)
 *   7. payment.failed webhook can never regress a Paid order
 *
 * Secrets are never printed — ids and prefixes only.
 *
 * Usage (from backend/):
 *   RAZORPAY_KEY_ID=rzp_test_xxx RAZORPAY_KEY_SECRET=... \
 *   RAZORPAY_WEBHOOK_SECRET=whsec_... node scripts/razorpay-real-smoke.mjs
 */

import crypto from 'node:crypto';
import { bootTestServer, stopTestServer, loadBackendEnv } from './lib/testServer.mjs';

loadBackendEnv();

const KEY_ID = process.env.RAZORPAY_KEY_ID || '';
const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || '';
const WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET || '';

if (!KEY_ID || !KEY_SECRET) {
  console.log('\nREAL RAZORPAY TEST MODE — SKIPPED');
  console.log('No RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET supplied (env or backend/.env).');
  console.log('Provide genuine rzp_test_* credentials to run. npm test is unaffected.');
  process.exit(0);
}
if (!KEY_ID.startsWith('rzp_test_')) {
  console.log('\nREAL RAZORPAY TEST MODE — REFUSED');
  console.log(`Credentials do not look like TEST mode keys (got id prefix "${KEY_ID.slice(0, 8)}…").`);
  console.log('Only the key id carries the rzp_test_ marker; the secret is an opaque string.');
  console.log('Never run this against live credentials.');
  process.exit(1);
}

let passed = 0;
let failed = 0;
let providerLimited = 0;
const failures = [];
const check = (name, cond, detail = '') => {
  if (cond) { passed += 1; console.log(`  ✔ ${name}`); }
  else { failed += 1; failures.push(name); console.log(`  ✘ ${name} ${detail}`); }
};

async function req(method, path, { token, body } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${API}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  let json = null;
  try { json = await res.json(); } catch { json = null; }
  return { status: res.status, json };
}

/**
 * Genuine TEST-mode payment capture through Razorpay's legacy create-payment
 * endpoint (test-mode only; standard automation entry point). Uses the
 * canonical sandbox Visa. Returns { paymentId, captured } or null when the
 * provider refuses — reported as a provider limitation, never faked.
 */
async function captureRealTestPayment({ orderId, amount, email, contact }) {
  const auth = Buffer.from(`${KEY_ID}:${KEY_SECRET}`).toString('base64');
  const attempts = [
    // Legacy form-encoded contract (documented shape).
    {
      type: 'form',
      body: new URLSearchParams({
        amount: String(amount), currency: 'INR', order_id: orderId,
        email, contact, method: 'card',
        'card[number]': '4111111111111111', 'card[name]': 'Flora Test',
        'card[expiry_month]': '12', 'card[expiry_year]': '2033', 'card[cvv]': '111',
      }).toString(),
    },
    // JSON nested variant (newer sandbox behavior).
    {
      type: 'json',
      body: JSON.stringify({
        amount, currency: 'INR', order_id: orderId, email, contact, method: 'card',
        card: { number: '4111111111111111', name: 'Flora Test', expiry_month: '12', expiry_year: '2033', cvv: '111' },
      }),
    },
  ];
  for (const attempt of attempts) {
    try {
      const res = await fetch('https://api.razorpay.com/v1/payments/create/json', {
        method: 'POST',
        headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/x-www-form-urlencoded' },
        body: attempt.body,
      });
      const text = await res.text().catch(() => '');
      if (!res.ok) continue; // try next contract shape
      const json = JSON.parse(text);
      if (json?.id && ['captured', 'authorized'].includes(json.status)) {
        return { paymentId: json.id, captured: json.status };
      }
      return null; // provider responded but no usable payment (e.g. declined)
    } catch { /* network/parse — try next shape */ }
  }
  return null;
}

const { child, base } = await bootTestServer({
  // 4096 is occupied by a local proxy controller on some dev machines —
  // avoid commonly-reserved ports for test servers.
  port: 4098,
  db: 'Flora-Alchemy-Test-Razorpay',
  label: 'razorpay-real',
});
const API = `${base}/api`;

try {
  console.log('\nREAL RAZORPAY TEST MODE — booting isolated backend (Flora-Alchemy-Test-Razorpay)…');
  check('backend boots with REAL Razorpay test config', Boolean(base));

  const stamp = Date.now();
  const EMAIL = `rzp-real-${stamp}@example.com`;

  // ── Setup: customer + staff + stock-tracked product ────────────────────
  let r = await req('POST', '/auth/register', { body: { name: 'Rzp Real', email: EMAIL, password: 'secret123', phone: '+919000000003' } });
  const CUST = r.json?.token;
  check('test customer registered', Boolean(CUST));

  r = await req('POST', '/auth/login', { body: { email: 'handler.admin@flora-alchemy.demo', password: 'handler1234' } });
  const ADMIN = r.json?.token;
  check('staff login (fixtures) works', Boolean(ADMIN));

  r = await req('GET', '/products');
  const products = r.json?.products || [];
  const product = products.find((p) => p.stockTracked !== false) || products[0];
  check('stock-tracked product available', Boolean(product?.slug));

  async function currentStock(slug) {
    const inv = await req('GET', '/inventory', { token: ADMIN });
    const item = (inv.json?.inventory || inv.json?.items || []).find((i) => i.productSlug === slug);
    return item ? Number(item.currentStock) : null;
  }
  const stockBefore = await currentStock(product.slug);
  check('inventory readable (baseline stock)', stockBefore !== null, String(stockBefore));

  async function makeOrder() {
    const rr = await req('POST', '/orders', {
      token: CUST,
      body: {
        items: [{ productSlug: product.slug, name: product.name, quantity: 1 }],
        paymentMethod: 'Instant UPI',
        shippingAddress: { name: 'Rzp Real', address: '1 Test Lane', city: 'Mumbai', state: 'Maharashtra', pincode: '400001', phone: '+919000000003' },
      },
    });
    return rr;
  }

  // ══ Order A: the full paid path ═════════════════════════════════════════
  r = await makeOrder();
  const ORDER = r.json?.order?.orderId;
  const total = r.json?.order?.total;
  check('Flora order created (Pending + razorpay provider)', r.status === 201 && r.json?.order?.paymentStatus === 'Pending' && r.json?.order?.paymentProvider === 'razorpay', JSON.stringify({ s: r.status, ps: r.json?.order?.paymentStatus }));

  console.log('\n— REAL Razorpay order creation (sandbox API) —');
  r = await req('POST', '/payments/create-order', { token: CUST, body: { orderId: ORDER, amount: 1 } });
  const rzpOrderId = r.json?.payment?.razorpayOrderId;
  const amount = r.json?.payment?.amount;
  check('real Razorpay order created server-side', Boolean(rzpOrderId) && String(rzpOrderId).startsWith('order_'), String(rzpOrderId));
  check('client amount field ignored — server total authoritative (paise)', amount === Math.round(total * 100), `${amount} vs ${Math.round(total * 100)}`);
  check('currency INR', r.json?.payment?.currency === 'INR');
  check('public key id returned, secret never in payload', r.json?.payment?.razorpayKeyId === KEY_ID && !JSON.stringify(r.json).includes(KEY_SECRET));

  r = await req('POST', '/payments/create-order', { token: CUST, body: { orderId: ORDER } });
  check('retry create-order reuses the same Razorpay order id', r.json?.payment?.razorpayOrderId === rzpOrderId, `${r.json?.payment?.razorpayOrderId} vs ${rzpOrderId}`);

  const OTHER = await req('POST', '/auth/register', { body: { name: 'Rzp Other', email: `rzp-other-${stamp}@example.com`, password: 'secret123', phone: '+919000000004' } });
  r = await req('POST', '/payments/create-order', { token: OTHER.json?.token, body: { orderId: ORDER } });
  check('cross-customer create-order → 404 (no existence leak)', r.status === 404, JSON.stringify({ s: r.status }));

  console.log('\n— Server verify endpoint (REAL Razorpay order id + REAL secret) —');
  // Negative: invalid / mismatched / incomplete — every invalid case fails safely.
  r = await req('POST', '/payments/verify', { token: CUST, body: { orderId: ORDER, razorpay_payment_id: 'pay_fake_1', razorpay_order_id: rzpOrderId, razorpay_signature: '0'.repeat(64) } });
  check('invalid signature → 400 INVALID_SIGNATURE', r.status === 400 && r.json?.code === 'INVALID_SIGNATURE', JSON.stringify({ s: r.status, c: r.json?.code }));
  r = await req('POST', '/payments/verify', { token: CUST, body: { orderId: ORDER, razorpay_payment_id: 'pay_fake_1', razorpay_order_id: 'order_forged_other_order', razorpay_signature: 'x'.repeat(64) } });
  check('client-claimed foreign Razorpay order id → 400', r.status === 400, String(r.status));
  r = await req('POST', '/payments/verify', { token: CUST, body: { orderId: ORDER, razorpay_payment_id: 'pay_fake_1', razorpay_order_id: rzpOrderId } });
  check('missing signature → 422', r.status === 422, String(r.status));
  r = await req('GET', `/payments/${ORDER}/status`, { token: CUST });
  check('status still Pending after failed verifications', r.json?.payment?.paymentStatus === 'Pending', String(r.json?.payment?.paymentStatus));

  // Real capture when the sandbox permits; else honest fallback with real-secret HMAC.
  const realPayment = await captureRealTestPayment({ orderId: rzpOrderId, amount, email: EMAIL, contact: '+919000000003' });
  let paymentId = realPayment?.paymentId || `pay_${crypto.randomBytes(8).toString('hex')}`;
  if (realPayment) {
    console.log(`  REAL sandbox payment captured: ${paymentId} (${realPayment.captured})`);
  } else {
    providerLimited += 1;
    console.log('  ⚠ sandbox payment-capture endpoint unavailable — using real-secret HMAC with a synthetic payment id (order/payment state math is still genuinely exercised)');
  }
  const signature = crypto.createHmac('sha256', KEY_SECRET).update(`${rzpOrderId}|${paymentId}`).digest('hex');

  r = await req('POST', '/payments/verify', { token: CUST, body: { orderId: ORDER, razorpay_payment_id: paymentId, razorpay_order_id: rzpOrderId, razorpay_signature: signature } });
  check('valid signature (real secret) → Paid', r.status === 200 && r.json?.order?.paymentStatus === 'Paid', JSON.stringify({ s: r.status, ps: r.json?.order?.paymentStatus }));
  check('signature verified flag recorded', r.json?.order?.paymentSignatureVerified === true);

  r = await req('POST', '/payments/verify', { token: CUST, body: { orderId: ORDER, razorpay_payment_id: paymentId, razorpay_order_id: rzpOrderId, razorpay_signature: signature } });
  check('duplicate verification → idempotent success', r.status === 200 && r.json?.order?.paymentStatus === 'Paid', JSON.stringify({ s: r.status, ps: r.json?.order?.paymentStatus }));
  const sig2 = crypto.createHmac('sha256', KEY_SECRET).update(`${rzpOrderId}|pay_second_attempt`).digest('hex');
  r = await req('POST', '/payments/verify', { token: CUST, body: { orderId: ORDER, razorpay_payment_id: 'pay_second_attempt', razorpay_order_id: rzpOrderId, razorpay_signature: sig2 } });
  check('different payment id on paid order → 409', r.status === 409, String(r.status));

  const stockAfterPaid = await currentStock(product.slug);
  check('stock deducted exactly once after payment', stockAfterPaid === stockBefore - 1, `${stockBefore} → ${stockAfterPaid}`);

  console.log('\n— Webhooks (real secret) —');
  if (WEBHOOK_SECRET) {
    const webhook = (raw) => fetch(`${API}/payments/webhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-razorpay-signature': crypto.createHmac('sha256', WEBHOOK_SECRET).update(raw).digest('hex') },
      body: raw,
    });
    const failEvent = (payId) => JSON.stringify({ event: 'payment.failed', payload: { payment: { entity: { id: payId, order_id: rzpOrderId, error_description: 'Test-mode card declined' } } } });

    // Paid order must NEVER regress via webhook.
    let wr = await webhook(failEvent(paymentId));
    check('payment.failed on Paid order → 200 and ignored', wr.status === 200, String(wr.status));
    r = await req('GET', `/payments/${ORDER}/status`, { token: CUST });
    check('Paid state survives failed webhook', r.json?.payment?.paymentStatus === 'Paid', String(r.json?.payment?.paymentStatus));
    const stockStill = await currentStock(product.slug);
    check('no stock change from ignored webhook', stockStill === stockAfterPaid, `${stockAfterPaid} → ${stockStill}`);

    // Invalid + malformed webhooks rejected safely.
    wr = await fetch(`${API}/payments/webhook`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-razorpay-signature': '0'.repeat(64) }, body: failEvent('x') });
    check('webhook with invalid signature → 400', wr.status === 400, String(wr.status));
    wr = await fetch(`${API}/payments/webhook`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: 'not-json' });
    check('malformed webhook body → 4xx (no state change)', wr.status >= 400 && wr.status < 500, String(wr.status));

    // Order B: failed-payment path with duplicate delivery → release exactly once.
    r = await makeOrder();
    const ORDER_B = r.json?.order?.orderId;
    r = await req('POST', '/payments/create-order', { token: CUST, body: { orderId: ORDER_B } });
    const rzpOrderB = r.json?.payment?.razorpayOrderId;
    const beforeB = await currentStock(product.slug);

    const failB = JSON.stringify({ event: 'payment.failed', payload: { payment: { entity: { id: 'pay_fail_b', order_id: rzpOrderB, error_description: 'Test-mode card declined' } } } });
    wr = await webhook(failB);
    check('payment.failed on pending order B → 200', wr.status === 200, String(wr.status));
    wr = await webhook(failB);
    check('duplicate failed webhook → 200 (idempotent)', wr.status === 200, String(wr.status));
    r = await req('GET', `/payments/${ORDER_B}/status`, { token: CUST });
    check('order B → Failed with provider reason', r.json?.payment?.paymentStatus === 'Failed' && String(r.json?.payment?.paymentFailureReason).includes('Test-mode card declined'), JSON.stringify(r.json?.payment).slice(0, 120));
    const afterB = await currentStock(product.slug);
    check('failed payment released held stock exactly once', afterB === beforeB + 1, `${beforeB} → ${afterB}`);

    // Retry after failure: same Flora order reuses its Razorpay order id.
    r = await req('POST', '/payments/create-order', { token: CUST, body: { orderId: ORDER_B } });
    check('retry after failure reuses provider order id', r.json?.payment?.razorpayOrderId === rzpOrderB, String(r.json?.payment?.razorpayOrderId));
  } else {
    providerLimited += 1;
    console.log('  (RAZORPAY_WEBHOOK_SECRET not supplied — webhook block skipped)');
  }

  console.log(`\nREAL RAZORPAY SMOKE RESULT: ${passed} passed, ${failed} failed${providerLimited ? `, ${providerLimited} provider limitation(s)` : ''}`);
  console.log(`Flora order (paid path): ${ORDER}`);
  console.log(`Provider order id: ${rzpOrderId}`);
  if (failed > 0) {
    console.log('FAILURES:', failures.join(', '));
    process.exitCode = 1;
  }
} catch (err) {
  console.log('ERROR:', err.message);
  process.exitCode = 1;
} finally {
  stopTestServer(child);
}
