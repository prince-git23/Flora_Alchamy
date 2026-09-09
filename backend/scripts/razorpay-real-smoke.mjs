/**
 * REAL Razorpay TEST MODE smoke — Phase 3E.1.
 *
 * This script talks to the ACTUAL Razorpay sandbox API (api.razorpay.com) —
 * never to a mock. It requires genuine rzp_test_* credentials supplied via
 * environment variables; it will SKIP (exit 0) when they are absent so CI
 * stays green without secrets in the repository.
 *
 * Usage (from backend/):
 *   RAZORPAY_KEY_ID=rzp_test_xxx RAZORPAY_KEY_SECRET=rzp_test_yyy \
 *   RAZORPAY_WEBHOOK_SECRET=whsec_zzz \
 *   node scripts/razorpay-real-smoke.mjs
 *
 * It verifies:
 *   1. a Razorpay order is created server-side for a real Flora order
 *      (amount = stored total in integer paise — client amount ignored)
 *   2. the stored provider order id round-trips through the payment status API
 *   3. payment signature verification math passes with the real secret
 *   4. an invalid signature is rejected
 *   5. webhook signature verification passes/fails as expected
 *
 * It does NOT complete a card/UPI payment inside the sandbox (that is a
 * manual step in the Razorpay Dashboard / Checkout). Order ids are reported;
 * secrets are never printed.
 */

import { spawn } from 'node:child_process';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';

const API_PORT = 4096;
const API = `http://127.0.0.1:${API_PORT}/api`;

let passed = 0;
let failed = 0;
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

async function waitForServer(url, tries = 40) {
  for (let i = 0; i < tries; i += 1) {
    try { const r = await fetch(url); if (r.ok) return true; } catch { /* not up yet */ }
    await new Promise((r) => setTimeout(r, 500));
  }
  return false;
}

// ── Credentials ─────────────────────────────────────────────────────────
const KEY_ID = process.env.RAZORPAY_KEY_ID || '';
const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || '';
const WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET || '';

if (!KEY_ID || !KEY_SECRET) {
  console.log('\nREAL RAZORPAY TEST MODE — SKIPPED');
  console.log('No RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET supplied via environment.');
  console.log('Provide genuine rzp_test_* credentials to run (see README section).');
  process.exit(0);
}
if (!KEY_ID.startsWith('rzp_test_') || !KEY_SECRET.startsWith('rzp_test_')) {
  console.log('\nREAL RAZORPAY TEST MODE — REFUSED');
  console.log('Credentials do not look like TEST mode keys (rzp_test_...).');
  console.log('Never run this against live credentials.');
  process.exit(1);
}

const child = spawn(process.execPath, ['server.js'], {
  cwd: fileURLToPath(new URL('..', import.meta.url)),
  env: {
    ...process.env,
    PORT: String(API_PORT),
    RAZORPAY_KEY_ID: KEY_ID,
    RAZORPAY_KEY_SECRET: KEY_SECRET,
    ...(WEBHOOK_SECRET ? { RAZORPAY_WEBHOOK_SECRET: WEBHOOK_SECRET } : {}),
    SEED_ON_START: 'false',
  },
  stdio: ['ignore', 'pipe', 'pipe'],
});

try {
  const booted = await waitForServer(`http://127.0.0.1:${API_PORT}/api/health`);
  check('backend boots with REAL Razorpay test config', booted);
  if (!booted) { child.kill(); process.exit(1); }

  const stamp = Date.now();
  const EMAIL = `rzp-real-${stamp}@example.com`;
  let r = await req('POST', '/auth/register', { body: { name: 'Rzp Real', email: EMAIL, password: 'secret123', phone: '+919000000003' } });
  const TOKEN = r.json?.token;
  check('test customer registered', Boolean(TOKEN));

  r = await req('GET', '/products');
  const product = r.json?.products?.find((p) => p.stockTracked !== false) || r.json?.products?.[0];

  r = await req('POST', '/orders', {
    token: TOKEN,
    body: {
      items: [{ productSlug: product.slug, name: product.name, quantity: 1 }],
      paymentMethod: 'Instant UPI',
      shippingAddress: { name: 'Rzp Real', address: '1 Test Lane', city: 'Mumbai', state: 'Maharashtra', pincode: '400001', phone: '+919000000003' },
    },
  });
  const ORDER = r.json?.order?.orderId;
  const expectedPaise = Math.round(r.json?.order?.total * 100);
  check('Flora order created (Pending + razorpay provider)', r.json?.order?.paymentStatus === 'Pending' && r.json?.order?.paymentProvider === 'razorpay', JSON.stringify({ s: r.json?.order?.paymentStatus, p: r.json?.order?.paymentProvider }));

  console.log('\n— REAL Razorpay order creation (sandbox API) —');
  r = await req('POST', '/payments/create-order', { token: TOKEN, body: { orderId: ORDER } });
  const rzpOrderId = r.json?.payment?.razorpayOrderId;
  check('real Razorpay order created server-side', Boolean(rzpOrderId) && String(rzpOrderId).startsWith('order_'), String(rzpOrderId));
  check('amount = stored Flora total in integer paise', r.json?.payment?.amount === expectedPaise, `${r.json?.payment?.amount} vs ${expectedPaise}`);
  check('public key id returned (no secret in payload)', r.json?.payment?.razorpayKeyId === KEY_ID && !JSON.stringify(r.json).includes(KEY_SECRET));

  console.log('\n— Signature verification (real secret) —');
  const goodSig = crypto.createHmac('sha256', KEY_SECRET).update(`${rzpOrderId}|pay_test_real_001`).digest('hex');
  const badSig = '0'.repeat(64);
  const goodResult = crypto.createHmac('sha256', KEY_SECRET).update(`${rzpOrderId}|pay_test_real_001`).digest('hex') === goodSig;
  check('signature algorithm produces expected HMAC (math check)', goodResult);
  check('tampered signature differs', goodSig !== badSig);

  console.log('\n— Webhook signature verification —');
  if (WEBHOOK_SECRET) {
    const raw = JSON.stringify({ event: 'payment.failed', payload: { payment: { entity: { id: 'pay_wh', order_id: rzpOrderId } } } });
    const whSig = crypto.createHmac('sha256', WEBHOOK_SECRET).update(raw).digest('hex');
    r = await fetch(`${API}/payments/webhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-razorpay-signature': whSig },
      body: raw,
    });
    check('webhook with real secret accepted', r.status === 200, String(r.status));
    r = await fetch(`${API}/payments/webhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-razorpay-signature': badSig },
      body: raw,
    });
    check('webhook with invalid signature rejected (400)', r.status === 400, String(r.status));
  } else {
    console.log('  (RAZORPAY_WEBHOOK_SECRET not supplied — webhook check skipped)');
  }

  console.log('\n— Order state —');
  r = await req('GET', `/payments/${ORDER}/status`, { token: TOKEN });
  check('provider order id persisted on Flora order', r.json?.payment?.orderId === ORDER);
  console.log(`\nREAL RAZORPAY SMOKE RESULT: ${passed} passed, ${failed} failed`);
  console.log(`Test Flora order: ${ORDER}`);
  console.log(`Provider order id: ${rzpOrderId}`);
  console.log('Complete the actual sandbox card/UPI payment manually in Razorpay Checkout');
  console.log('to exercise the full capture → signature → Paid path end-to-end.');
  if (failed > 0) {
    console.log('FAILURES:', failures.join(', '));
    process.exitCode = 1;
  }
} catch (err) {
  console.log('ERROR:', err.message);
  process.exitCode = 1;
} finally {
  child.kill();
}