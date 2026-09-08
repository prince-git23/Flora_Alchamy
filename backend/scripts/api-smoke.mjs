/**
 * API smoke tests — Flora Alchemy backend.
 *
 * Run against a LIVE server (backend/.env points at the local MongoDB):
 *   npm run test:api   (from backend/)
 *
 * Covers: register, login, me, product CRUD + price integrity, order
 * creation + ownership + lifecycle, inventory deduction/adjustment,
 * analytics derivation, settings persistence, and authorization negatives.
 */
const BASE = process.env.API_URL || 'http://127.0.0.1:4000/api';

let passed = 0;
let failed = 0;
const failures = [];

async function req(method, path, { token, body, raw } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  let json = null;
  try {
    json = await res.json();
  } catch {
    json = { raw: raw || (await res.text()) };
  }
  return { status: res.status, json };
}

function check(name, cond, detail = '') {
  if (cond) {
    passed += 1;
    console.log(`  ✔ ${name}`);
  } else {
    failed += 1;
    failures.push(name);
    console.log(`  ✘ ${name} ${detail}`);
  }
}

const stamp = Date.now();
const EMAIL_A = `smoke-a-${stamp}@example.com`;
const EMAIL_B = `smoke-b-${stamp}@example.com`;
const PASSWORD = 'secret123';

async function main() {
  console.log('\n— HEALTH —');
  let r = await req('GET', '/health');
  check('GET /api/health → 200', r.status === 200);

  console.log('\n— PUBLIC CATALOGUE —');
  r = await req('GET', '/products');
  check('public products → 200', r.status === 200);
  check('fixture catalogue returned (10)', r.json.products?.length === 10);
  check('all public products visible', r.json.products?.every((p) => p.visibility === 'Visible'));
  check('product exposes slug as id', r.json.products?.[0]?.id === r.json.products?.[0]?.slug);

  r = await req('GET', '/products/does-not-exist');
  check('unknown product → 404', r.status === 404 && r.json.code === 'PRODUCT_NOT_FOUND');

  console.log('\n— REGISTER (real auth, bcrypt, JWT) —');
  r = await req('POST', '/auth/register', { body: { name: 'Smoke A', email: EMAIL_A, password: PASSWORD, phone: '+91 90000 00001' } });
  check('register customer A → 201 + token', r.status === 201 && !!r.json.token);
  check('register returns customerId link', !!r.json.user?.customerId && r.json.user.role === 'customer');
  const TOKEN_A = r.json.token;
  const CUST_A_ID = r.json.user.customerId;
  check('customer doc returned', !!r.json.customer && r.json.customer.email === EMAIL_A);

  r = await req('POST', '/auth/register', { body: { name: 'Smoke B', email: EMAIL_B, password: PASSWORD } });
  check('register customer B → 201', r.status === 201);
  const TOKEN_B = r.json.token;
  const CUST_B_ID = r.json.user.customerId;

  r = await req('POST', '/auth/register', { body: { name: 'Dup', email: EMAIL_A, password: PASSWORD } });
  check('duplicate register → 409 EMAIL_TAKEN', r.status === 409 && r.json.code === 'EMAIL_TAKEN');

  r = await req('POST', '/auth/register', { body: { name: 'X', email: 'bad-email', password: '123' } });
  check('invalid register payload → 422', r.status === 422);

  console.log('\n— LOGIN —');
  r = await req('POST', '/auth/login', { body: { email: EMAIL_A, password: 'wrong-password' } });
  check('wrong password → 401 INVALID_CREDENTIALS', r.status === 401 && r.json.code === 'INVALID_CREDENTIALS');
  r = await req('POST', '/auth/login', { body: { email: 'nobody@example.com', password: 'whatever1' } });
  check('unknown email → 401', r.status === 401);

  r = await req('POST', '/auth/login', { body: { email: 'customer@example.com', password: 'demo1234' } });
  check('fixture demo customer can log in (explicit action)', r.status === 200 && !!r.json.token);
  check('fixture user flagged isFixture', r.json.user?.isFixture === true);

  r = await req('POST', '/auth/login', { body: { email: EMAIL_A, password: PASSWORD } });
  check('valid login → 200 token', r.status === 200 && !!r.json.token);

  r = await req('GET', '/auth/me', { token: TOKEN_A });
  check('GET /auth/me with token → 200', r.status === 200 && r.json.user.email === EMAIL_A);
  r = await req('GET', '/auth/me');
  check('GET /auth/me without token → 401', r.status === 401);
  r = await req('GET', '/auth/me', { token: 'garbage.token.here' });
  check('GET /auth/me bad token → 401', r.status === 401);

  console.log('\n— ADMIN AUTH —');
  r = await req('POST', '/auth/login', { body: { email: 'handler.admin@flora-alchemy.demo', password: 'handler1234' } });
  check('fixture admin login → 200', r.status === 200 && r.json.user.role === 'admin');
  const TOKEN_ADMIN = r.json.token;
  r = await req('POST', '/auth/login', { body: { email: 'handler.admin@flora-alchemy.demo', password: 'wrong' } });
  check('admin wrong password → 401', r.status === 401);

  console.log('\n— PRODUCTS (staff writes) —');
  r = await req('POST', '/products', { token: TOKEN_A, body: { name: 'Sneaky Product', price: 100 } });
  check('customer cannot create product → 403', r.status === 403);
  r = await req('POST', '/products', { token: TOKEN_ADMIN, body: { name: 'Smoke Test Posy', price: 500, category: 'Handmade Cards' } });
  check('admin creates product → 201', r.status === 201);
  const NEW_SLUG = r.json.product?.slug;
  r = await req('POST', '/products', { token: TOKEN_ADMIN, body: { name: 'Smoke Test Posy', price: 1 } });
  check('duplicate slug → 409', r.status === 409);
  r = await req('GET', `/products/${NEW_SLUG}`);
  check('new product visible publicly', r.status === 200);
  r = await req('PATCH', `/products/${NEW_SLUG}`, { token: TOKEN_ADMIN, body: { price: 999 } });
  check('admin updates price → 200', r.status === 200 && r.json.product.price === 999);
  r = await req('PATCH', `/products/${NEW_SLUG}`, { token: TOKEN_ADMIN, body: { visibility: 'Hidden' } });
  check('hide product → 200', r.status === 200);
  r = await req('GET', `/products/${NEW_SLUG}`);
  check('hidden product not public → 404', r.status === 404);
  r = await req('GET', `/products/${NEW_SLUG}`, { token: TOKEN_ADMIN });
  check('hidden product visible to staff', r.status === 200);
  r = await req('DELETE', `/products/${NEW_SLUG}`, { token: TOKEN_ADMIN });
  check('admin deletes product → 200', r.status === 200);

  console.log('\n— ORDERS: PRICE INTEGRITY —');
  // Client sends a bogus price for the catalogue item; server must recompute.
  r = await req('POST', '/orders', {
    token: TOKEN_A,
    body: {
      items: [
        { productSlug: 'dusty-rose-lavender-posy', name: 'Tampered', price: 1, quantity: 1 },
        { name: 'Custom made-to-order keepsake', price: 2400, quantity: 1, isCatalogue: false, customDetails: { occasion: 'birthday' } },
      ],
      shippingAddress: { name: 'Smoke A', address: '1 Test St', city: 'Mumbai', pincode: '400001' },
    },
  });
  check('create order → 201', r.status === 201, JSON.stringify(r.json).slice(0, 200));
  const ORDER_ID = r.json.order?.orderId;
  const order = r.json.order;
  check('order id assigned (FA-…)', /^FA-\d+$/.test(ORDER_ID || ''));
  check('catalogue price recomputed server-side (1850 not 1)', order?.items?.[0]?.price === 1850);
  check('custom item price preserved (2400)', order?.items?.[1]?.price === 2400);
  check('subtotal = 1850 + 2400', order?.subtotal === 4250);
  check('shipping free ≥ ₹1999 threshold', order?.shipping === 0);
  check('total = subtotal + shipping', order?.total === 4250);
  check('status initialized to "new"', order?.orderStatus === 'new');
  check('status history records new', order?.statusHistory?.[0]?.status === 'new');
  check('customer bound from JWT (not client)', order?.customerId === CUST_A_ID || String(order?.customerId) === String(CUST_A_ID));

  console.log('\n— ORDERS: UNAUTHENTICATED / WRONG ROLE —');
  r = await req('POST', '/orders', { body: { items: [{ productSlug: 'dusty-rose-lavender-posy', quantity: 1 }] } });
  check('order without token → 401', r.status === 401);
  r = await req('POST', '/orders', { token: TOKEN_ADMIN, body: { items: [{ productSlug: 'dusty-rose-lavender-posy', quantity: 1 }] } });
  check('admin cannot place customer order → 403', r.status === 403);

  console.log('\n— ORDERS: OWNERSHIP —');
  r = await req('GET', `/orders/${ORDER_ID}`, { token: TOKEN_A });
  check('owner reads own order → 200', r.status === 200 && r.json.order.orderId === ORDER_ID);
  r = await req('GET', `/orders/${ORDER_ID}`, { token: TOKEN_B });
  check('customer B cannot read A’s order → 404 (no leak)', r.status === 404);
  r = await req('GET', `/orders/${ORDER_ID}`);
  check('no token → 401', r.status === 401);
  r = await req('GET', '/orders', { token: TOKEN_A });
  check('customer cannot list all orders → 403', r.status === 403);
  r = await req('GET', '/orders', { token: TOKEN_ADMIN });
  check('admin lists orders → 200', r.status === 200 && r.json.orders.some((o) => o.orderId === ORDER_ID));
  r = await req('GET', '/orders/mine', { token: TOKEN_A });
  check('customer lists own orders → 200 contains order', r.status === 200 && r.json.orders.some((o) => o.orderId === ORDER_ID));
  r = await req('GET', '/orders/mine', { token: TOKEN_B });
  check('B’s own orders exclude A’s', r.status === 200 && !r.json.orders.some((o) => o.orderId === ORDER_ID));

  console.log('\n— ORDERS: LIFECYCLE —');
  r = await req('PATCH', `/orders/${ORDER_ID}/status`, { token: TOKEN_A, body: { status: 'confirmed' } });
  check('customer cannot change status → 403', r.status === 403);
  r = await req('PATCH', `/orders/${ORDER_ID}/status`, { body: { status: 'confirmed' } });
  check('no token status change → 401', r.status === 401);
  r = await req('PATCH', `/orders/${ORDER_ID}/status`, { token: TOKEN_ADMIN, body: { status: 'confirmed' } });
  check('admin confirm → 200', r.status === 200 && r.json.order.orderStatus === 'confirmed');
  r = await req('PATCH', `/orders/${ORDER_ID}/status`, { token: TOKEN_ADMIN, body: { status: 'new' } });
  check('backward transition blocked → 422', r.status === 422);
  r = await req('PATCH', `/orders/${ORDER_ID}/status`, { token: TOKEN_ADMIN, body: { status: 'shipped' } });
  check('forward jump new→confirmed→shipped allowed', r.status === 200 && r.json.order.orderStatus === 'shipped');
  r = await req('PATCH', `/orders/FA-NOPE/status`, { token: TOKEN_ADMIN, body: { status: 'shipped' } });
  check('unknown order status change → 404', r.status === 404);
  r = await req('GET', `/orders/${ORDER_ID}`, { token: TOKEN_A });
  check('customer tracking reads same updated record', r.status === 200 && r.json.order.orderStatus === 'shipped');

  console.log('\n— ORDERS: STAFF CREATE ON BEHALF OF CUSTOMER —');
  const custList = await req('GET', '/customers', { token: TOKEN_ADMIN });
  const staffTarget = custList.json.customers.find((c) => c.email === EMAIL_A) || custList.json.customers[0];
  r = await req('POST', '/orders/admin', {
    token: TOKEN_ADMIN,
    body: {
      customerId: staffTarget.id,
      items: [{ productSlug: 'desk-bloom-ceramic-pot', quantity: 1 }],
      shippingAddress: { name: staffTarget.name, address: 'Staff desk', city: 'Mumbai', pincode: '400001' },
    },
  });
  check('staff creates order for customer → 201', r.status === 201 && !!r.json.order.orderId);
  check('staff order bound to selected customer', String(r.json.order.customerId) === String(staffTarget.id));
  // Subtotal comes from the server catalogue; shipping adds the standard rate below the free-shipping threshold.
  check('staff order subtotal from server (1250)', r.json.order.subtotal === 1250 && r.json.order.total === 1250 + 150);
  r = await req('POST', '/orders/admin', { token: TOKEN_A, body: { customerId: staffTarget.id, items: [{ productSlug: 'desk-bloom-ceramic-pot', quantity: 1 }] } });
  check('customer cannot use staff-create endpoint → 403', r.status === 403);
  r = await req('POST', '/orders/admin', { token: TOKEN_ADMIN, body: { customerId: '000000000000000000000000', items: [{ productSlug: 'desk-bloom-ceramic-pot', quantity: 1 }] } });
  check('staff-create unknown customer → 404', r.status === 404);

  console.log('\n— INVENTORY: DEDUCTION + MOVEMENTS —');
  r = await req('GET', '/inventory', { token: TOKEN_A });
  check('customer cannot view inventory → 403', r.status === 403);
  r = await req('GET', '/inventory/history', { token: TOKEN_ADMIN });
  const movement = r.json.movements.find((m) => m.orderId === ORDER_ID);
  check('movement recorded for order (delta −1)', !!movement && movement.delta === -1 && movement.type === 'sale');
  r = await req('GET', '/inventory', { token: TOKEN_ADMIN });
  const posyAfter = r.json.inventory.find((i) => i.productSlug === 'dusty-rose-lavender-posy');
  // Movement records its own before/after — the live stock must match newStock
  // (proves exactly one decrement for this order).
  check(
    'stock decremented exactly once (matches movement newStock)',
    !!movement && posyAfter.currentStock === movement.newStock && movement.newStock === movement.previousStock - 1
  );

  console.log('\n— INVENTORY: ADJUSTMENT + NEGATIVE GUARD —');
  r = await req('POST', '/inventory/desk-bloom-ceramic-pot/adjust', { token: TOKEN_A, body: { type: 'restock', quantity: 5 } });
  check('customer cannot adjust stock → 403', r.status === 403);
  r = await req('POST', '/inventory/desk-bloom-ceramic-pot/adjust', { token: TOKEN_ADMIN, body: { type: 'restock', quantity: 5, reason: 'smoke test restock' } });
  check('admin restock +5 → 200', r.status === 200);
  const potBefore = (await req('GET', '/inventory', { token: TOKEN_ADMIN })).json.inventory.find((i) => i.productSlug === 'desk-bloom-ceramic-pot');
  r = await req('POST', '/inventory/desk-bloom-ceramic-pot/adjust', { token: TOKEN_ADMIN, body: { type: 'remove', quantity: 9999, reason: 'over-deduct attempt' } });
  check('over-deduction blocked → 409 INSUFFICIENT_STOCK', r.status === 409 && r.json.code === 'INSUFFICIENT_STOCK');
  const potAfter = (await req('GET', '/inventory', { token: TOKEN_ADMIN })).json.inventory.find((i) => i.productSlug === 'desk-bloom-ceramic-pot');
  check('stock unchanged after blocked over-deduction', potAfter.currentStock === potBefore.currentStock);
  r = await req('GET', '/inventory/history', { token: TOKEN_ADMIN });
  check('restock movement recorded (+5)', r.json.movements.some((m) => m.type === 'restock' && m.delta === 5 && m.productSlug === 'desk-bloom-ceramic-pot'));

  console.log('\n— INVENTORY: INSUFFICIENT STOCK BLOCKS ORDER —');
  const stickers = (await req('GET', '/inventory', { token: TOKEN_ADMIN })).json.inventory.find(
    (i) => i.productSlug === 'gold-foil-pressed-stickers'
  );
  const toDrain = stickers.currentStock;
  r = await req('POST', '/inventory/gold-foil-pressed-stickers/adjust', {
    token: TOKEN_ADMIN,
    body: { type: 'remove', quantity: toDrain, reason: 'drain for test' },
  });
  check('drain item to zero → 200', r.status === 200);
  const before = (await req('GET', '/inventory', { token: TOKEN_ADMIN })).json.inventory.find((i) => i.productSlug === 'gold-foil-pressed-stickers');
  check('stock at zero', before.currentStock === 0);
  r = await req('POST', '/orders', {
    token: TOKEN_B,
    body: { items: [{ productSlug: 'gold-foil-pressed-stickers', quantity: 2 }], shippingAddress: { name: 'Smoke B' } },
  });
  check('order for out-of-stock item → 409 INSUFFICIENT_STOCK', r.status === 409 && r.json.code === 'INSUFFICIENT_STOCK');
  r = await req('GET', '/orders/mine', { token: TOKEN_B });
  check('no phantom order persisted', !r.json.orders.some((o) => String(o.customerId) === String(CUST_B_ID)));
  r = await req('POST', '/inventory/gold-foil-pressed-stickers/adjust', {
    token: TOKEN_ADMIN,
    body: { type: 'restock', quantity: toDrain, reason: 'restore for test' },
  });
  check('restore stock', r.status === 200);

  console.log('\n— CUSTOMERS —');
  r = await req('GET', '/customers', { token: TOKEN_ADMIN });
  check('admin lists customers → 200', r.status === 200 && r.json.customers.some((c) => c.email === EMAIL_A));
  r = await req('GET', '/customers', { token: TOKEN_A });
  check('customer cannot list all → 403', r.status === 403);
  r = await req('GET', '/customers/me', { token: TOKEN_A });
  check('customer reads own profile', r.status === 200 && r.json.customer.email === EMAIL_A);
  r = await req('GET', `/customers/${CUST_B_ID}`, { token: TOKEN_A });
  check('customer A cannot read B profile → 404', r.status === 404);
  r = await req('GET', `/customers/${CUST_A_ID}`, { token: TOKEN_A });
  check('customer reads own detail → 200', r.status === 200);
  r = await req('GET', `/customers/${CUST_B_ID}`, { token: TOKEN_ADMIN });
  check('admin reads any customer → 200', r.status === 200);
  r = await req('GET', '/customers/not-a-valid-id', { token: TOKEN_ADMIN });
  check('invalid customer id → 404', r.status === 404);

  console.log('\n— ANALYTICS (server-derived) —');
  r = await req('GET', '/analytics/overview', { token: TOKEN_ADMIN });
  check('overview → 200', r.status === 200);
  check('overview revenue = sum of live orders', typeof r.json.analytics.totalRevenue === 'number' && r.json.analytics.totalOrders >= 6);
  r = await req('GET', '/analytics/sales?days=30', { token: TOKEN_ADMIN });
  check('sales → 200 with daily rows', r.status === 200 && Array.isArray(r.json.analytics.daily));
  r = await req('GET', '/analytics/performance', { token: TOKEN_ADMIN });
  check('performance → 200 with customers', r.status === 200 && Array.isArray(r.json.analytics.customerPerformance));
  r = await req('GET', '/analytics/overview', { token: TOKEN_A });
  check('customer cannot read analytics → 403', r.status === 403);

  console.log('\n— SETTINGS —');
  r = await req('GET', '/settings');
  check('public settings read → 200', r.status === 200 && r.json.settings.currency === 'INR');
  r = await req('PATCH', '/settings', { body: { storeName: 'Hacked' } });
  check('unauthenticated settings write → 401', r.status === 401);
  r = await req('PATCH', '/settings', { token: TOKEN_A, body: { storeName: 'Hacked' } });
  check('customer settings write → 403', r.status === 403);
  r = await req('PATCH', '/settings', { token: TOKEN_ADMIN, body: { storeName: 'Flora Alchemy (smoke)' } });
  check('admin settings write → 200', r.status === 200 && r.json.settings.storeName === 'Flora Alchemy (smoke)');
  r = await req('PATCH', '/settings', { token: TOKEN_ADMIN, body: { storeName: 'Flora Alchemy' } });
  check('revert store name → 200', r.status === 200);

  console.log('\n— ROUTE 404 / ERROR FORMAT —');
  r = await req('GET', '/definitely/not/a/route');
  check('unknown route → 404 JSON', r.status === 404 && r.json.success === false && r.json.code === 'NOT_FOUND');
  r = await req('POST', '/orders', {
    token: TOKEN_A,
    body: { items: [{ productSlug: 'dusty-rose-lavender-posy', price: 1, quantity: 0 }] },
  });
  check('invalid quantity → 422', r.status === 422);

  console.log(`\n══════════════════════════════════════`);
  console.log(`SMOKE RESULT: ${passed} passed, ${failed} failed`);
  if (failed) {
    console.log('FAILURES:', failures.join(' | '));
    process.exit(1);
  }
  console.log('ALL API SMOKE TESTS PASSED');
}

main().catch((err) => {
  console.error('SMOKE RUNNER ERROR:', err);
  process.exit(1);
});
