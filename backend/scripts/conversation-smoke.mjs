/**
 * Conversation API smoke tests — Phase 3F.
 *
 * Tests the full conversation lifecycle:
 *   A. Customer creates order → conversation → messages
 *   B. Handler opens same conversation → sees messages → replies
 *   C. Customer sees handler reply
 *   D. Customer A cannot access Customer B conversation
 *   E. Unauthenticated access denied
 *   F. Mark read → unread state changes
 *   G. Conversation status update (open/close)
 *   H. Duplicate conversation prevention
 *   I. Empty body rejection
 *   J. Unread count
 */

import fs from 'node:fs';
import { bootTestServer, stopTestServer } from './lib/testServer.mjs';

// Test isolation: own backend process + own database (loads backend/.env
// itself — fixes the Phase 16 finding where process.env.MONGO_URI was unset
// and suites silently ran against the dev database).
const { child, base: API_BASE } = await bootTestServer({
  port: 4099,
  db: 'Flora-Alchemy-Test-Conversation',
  label: 'conversation-smoke',
});
const API = `${API_BASE}/api`;

let passed = 0;
let failed = 0;
const failures = [];

function check(name, cond, detail = '') {
  if (cond) { passed += 1; console.log(`  ✔ ${name}`); }
  else { failed += 1; failures.push(name); console.log(`  ✘ ${name} ${detail}`); }
}

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

// ── Boot backend (spawned by bootTestServer above) ───────────────────
try {
  check('backend boots (isolated server, dedicated test DB)', Boolean(API_BASE));

  // ── Register two customers + one admin ──────────────────────────────
  const stamp = Date.now();
  const custAEmail = `conv-a-${stamp}@example.com`;
  const custBEmail = `conv-b-${stamp}@example.com`;

  let r = await req('POST', '/auth/register', { body: { name: 'Conv A', email: custAEmail, password: 'secret123', phone: '+919000000001' } });
  const TOKEN_A = r.json?.token;
  check('customer A registered', Boolean(TOKEN_A));

  r = await req('POST', '/auth/register', { body: { name: 'Conv B', email: custBEmail, password: 'secret123', phone: '+919000000002' } });
  const TOKEN_B = r.json?.token;
  check('customer B registered', Boolean(TOKEN_B));

  // Get admin token (use existing admin from seed or register one)
  r = await req('POST', '/auth/login', { body: { email: 'handler.admin@flora-alchemy.demo', password: 'handler1234' } });
  const ADMIN_TOKEN = r.json?.token;
  check('admin authenticated', Boolean(ADMIN_TOKEN));

  // ── Create orders for both customers ────────────────────────────────
  r = await req('GET', '/products');
  const products = r.json?.products || [];
  const product = products[0];
  check('products available', products.length > 0);

  r = await req('POST', '/orders', {
    token: TOKEN_A,
    body: {
      items: [{ productSlug: product.slug, name: product.name, quantity: 1 }],
      paymentMethod: 'Sample',
      shippingAddress: { name: 'Conv A', address: '1 Test Lane', city: 'Mumbai', state: 'Maharashtra', pincode: '400001', phone: '+919000000001' },
    },
  });
  const ORDER_A = r.json?.order?.orderId;
  check('order A created', Boolean(ORDER_A), JSON.stringify(r.json));

  r = await req('POST', '/orders', {
    token: TOKEN_B,
    body: {
      items: [{ productSlug: product.slug, name: product.name, quantity: 1 }],
      paymentMethod: 'Sample',
      shippingAddress: { name: 'Conv B', address: '2 Test Lane', city: 'Mumbai', state: 'Maharashtra', pincode: '400001', phone: '+919000000002' },
    },
  });
  const ORDER_B = r.json?.order?.orderId;
  check('order B created', Boolean(ORDER_B));

  // ── TEST A: Customer creates conversation for their order ───────────
  console.log('\n— TEST A: Customer creates conversation —');
  r = await req('GET', `/conversations/order/${ORDER_A}`, { token: TOKEN_A });
  check('customer A gets conversation', r.status === 200 && r.json?.conversation?.id, JSON.stringify({ s: r.status, conv: r.json?.conversation?.id }));
  const CONV_A = r.json?.conversation?.id;

  // Idempotent — same conversation returned
  r = await req('GET', `/conversations/order/${ORDER_A}`, { token: TOKEN_A });
  check('conversation is idempotent', r.json?.conversation?.id === CONV_A);

  // ── TEST B: Customer sends message ──────────────────────────────────
  console.log('\n— TEST B: Customer sends message —');
  r = await req('POST', `/conversations/${CONV_A}/messages`, { token: TOKEN_A, body: { body: 'Hello, I have a question about my order.' } });
  check('message sent', r.status === 201 && r.json?.message?.body === 'Hello, I have a question about my order.', JSON.stringify({ s: r.status, b: r.json?.message?.body }));
  check('sender role is customer', r.json?.message?.senderRole === 'customer');
  check('sender name populated', Boolean(r.json?.message?.senderName));

  // ── TEST C: Handler opens same conversation ──────────────────────────
  console.log('\n— TEST C: Handler accesses conversation —');
  r = await req('GET', `/conversations/order/${ORDER_A}`, { token: ADMIN_TOKEN });
  check('handler gets conversation', r.status === 200 && r.json?.conversation?.id === CONV_A);

  // Handler reads messages
  r = await req('GET', `/conversations/${CONV_A}/messages`, { token: ADMIN_TOKEN });
  check('handler sees customer message', r.status === 200 && r.json?.messages?.length === 1);
  check('message body matches', r.json?.messages?.[0]?.body === 'Hello, I have a question about my order.');

  // ── TEST D: Handler replies ─────────────────────────────────────────
  console.log('\n— TEST D: Handler replies —');
  r = await req('POST', `/conversations/${CONV_A}/messages`, { token: ADMIN_TOKEN, body: { body: 'Thank you for reaching out! How can we help?' } });
  check('handler reply sent', r.status === 201 && r.json?.message?.body === 'Thank you for reaching out! How can we help?');
  check('handler sender role', r.json?.message?.senderRole === 'admin' || r.json?.message?.senderRole === 'handler');

  // Customer sees both messages
  r = await req('GET', `/conversations/${CONV_A}/messages`, { token: TOKEN_A });
  check('customer sees both messages', r.status === 200 && r.json?.messages?.length === 2);
  check('messages in order', r.json?.messages?.[0]?.senderRole === 'customer' && r.json?.messages?.[1]?.senderRole !== 'customer');

  // ── TEST E: Customer A cannot access Customer B conversation ─────────
  console.log('\n— TEST E: Cross-customer security —');
  r = await req('GET', `/conversations/order/${ORDER_B}`, { token: TOKEN_A });
  check('customer A cannot get B conversation (403)', r.status === 403, JSON.stringify({ s: r.status }));

  r = await req('POST', `/conversations/${CONV_A}/messages`, { token: TOKEN_B, body: { body: 'Trying to access A conversation' } });
  check('customer B cannot message A conversation (403)', r.status === 403, JSON.stringify({ s: r.status }));

  // ── TEST F: Unauthenticated access denied ───────────────────────────
  console.log('\n— TEST F: Unauthenticated access —');
  r = await req('GET', `/conversations/order/${ORDER_A}`);
  check('unauthenticated → 401', r.status === 401, JSON.stringify({ s: r.status }));

  r = await req('POST', `/conversations/${CONV_A}/messages`, { body: { body: 'Hello' } });
  check('unauthenticated message → 401', r.status === 401, JSON.stringify({ s: r.status }));

  // ── TEST G: Mark read ──────────────────────────────────────────────
  console.log('\n— TEST G: Mark read —');
  r = await req('PATCH', `/conversations/${CONV_A}/read`, { token: TOKEN_A });
  check('mark read succeeds', r.status === 200);

  // ── TEST H: Conversation status update ──────────────────────────────
  console.log('\n— TEST H: Conversation status —');
  r = await req('PATCH', `/conversations/${CONV_A}/status`, { token: ADMIN_TOKEN, body: { status: 'closed' } });
  check('admin closes conversation', r.status === 200 && r.json?.status === 'closed');

  // Cannot send to closed conversation
  r = await req('POST', `/conversations/${CONV_A}/messages`, { token: TOKEN_A, body: { body: 'Testing closed' } });
  check('message to closed conversation rejected', r.status === 409, JSON.stringify({ s: r.status }));

  // Reopen
  r = await req('PATCH', `/conversations/${CONV_A}/status`, { token: ADMIN_TOKEN, body: { status: 'open' } });
  check('admin reopens conversation', r.status === 200 && r.json?.status === 'open');

  // Customer cannot change status
  r = await req('PATCH', `/conversations/${CONV_A}/status`, { token: TOKEN_A, body: { status: 'closed' } });
  check('customer cannot change status (403)', r.status === 403, JSON.stringify({ s: r.status }));

  // ── TEST I: Empty body rejection ────────────────────────────────────
  console.log('\n— TEST I: Validation —');
  r = await req('POST', `/conversations/${CONV_A}/messages`, { token: TOKEN_A, body: { body: '' } });
  check('empty body rejected', r.status === 422, JSON.stringify({ s: r.status }));

  r = await req('POST', '/conversations/nonexistent/messages', { token: TOKEN_A, body: { body: 'Hello' } });
  check('nonexistent conversation → 404', r.status === 404, JSON.stringify({ s: r.status }));

  // ── TEST J: Unread count ───────────────────────────────────────────
  console.log('\n— TEST J: Unread count —');
  r = await req('GET', '/conversations/unread', { token: ADMIN_TOKEN });
  check('unread count returned', r.status === 200 && typeof r.json?.count === 'number');

  // ── TEST K: List conversations (admin) ──────────────────────────────
  console.log('\n— TEST K: List conversations —');
  r = await req('GET', '/conversations', { token: ADMIN_TOKEN });
  check('admin lists conversations', r.status === 200 && Array.isArray(r.json?.conversations));
  check('conversation appears in list', r.json?.conversations?.some(c => String(c.id || c._id) === String(CONV_A)));

  // Customer cannot list all conversations
  r = await req('GET', '/conversations', { token: TOKEN_A });
  check('customer cannot list all (403)', r.status === 403, JSON.stringify({ s: r.status }));

  // ── Summary ─────────────────────────────────────────────────────────
  console.log(`\n══════════════════════════════════════════════════════════════════════`);
  console.log(`CONVERSATION SMOKE RESULT: ${passed} passed, ${failed} failed`);
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
