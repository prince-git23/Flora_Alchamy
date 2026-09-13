/**
 * Phase 14 integration smoke tests — admin users, notifications,
 * collection CRUD, upload authorization, product edit/delete consistency.
 *
 * Run: node scripts/integration-smoke.mjs   (against a live server)
 */
const BASE = process.env.API_URL || 'http://127.0.0.1:4000/api';

let passed = 0;
let failed = 0;
const failures = [];

async function req(method, path, { token, body } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${BASE}${path}`, { method, headers, body: body ? JSON.stringify(body) : undefined });
  let json = null;
  try { json = await res.json(); } catch { /* binary */ }
  return { status: res.status, json };
}

function check(name, cond, detail = '') {
  if (cond) { passed += 1; console.log(`  ✔ ${name}`); }
  else { failed += 1; failures.push(name); console.log(`  ✘ ${name} ${detail}`); }
}

async function main() {
  const stamp = Date.now();

  console.log('\n— SETUP —');
  let r = await req('POST', '/auth/login', { body: { email: 'handler.admin@flora-alchemy.demo', password: 'handler1234' } });
  check('admin login', r.status === 200);
  const ADMIN = r.json.token;

  r = await req('POST', '/auth/register', { body: { name: 'Integration A', email: `int-a-${stamp}@example.com`, password: 'secret123' } });
  check('customer registered', r.status === 201);
  const CUSTOMER = r.json.token;

  console.log('\n— ADMIN USER CRUD —');
  r = await req('GET', '/admin/users', { token: CUSTOMER });
  check('customer cannot list operators → 403', r.status === 403);
  r = await req('GET', '/admin/users');
  check('anonymous cannot list operators → 401', r.status === 401);
  r = await req('GET', '/admin/users', { token: ADMIN });
  check('admin lists operators → 200', r.status === 200 && Array.isArray(r.json.operators));
  check('no password hashes leak', r.json.operators.every((o) => o.passwordHash === undefined && o.password === undefined));

  r = await req('POST', '/admin/users', {
    token: ADMIN,
    body: { name: 'Test Handler', email: `handler-${stamp}@example.com`, role: 'HANDLER', password: 'temppass123' },
  });
  check('admin creates handler → 201', r.status === 201, JSON.stringify(r.json).slice(0, 150));
  const NEW_OP_ID = r.json.operator?.id;
  check('created operator has handler role', r.json.operator?.role === 'HANDLER');
  check('no tempPassword echo when explicit password given', r.json.tempPassword === undefined);

  r = await req('POST', '/admin/users', {
    token: ADMIN,
    body: { name: 'Dup Op', email: `handler-${stamp}@example.com`, role: 'HANDLER' },
  });
  check('duplicate operator email → 409', r.status === 409);

  r = await req('PATCH', `/admin/users/${NEW_OP_ID}/role`, { token: ADMIN, body: { role: 'admin' } });
  check('role change → 200', r.status === 200 && r.json.operator?.role === 'ADMINISTRATOR');

  // New operator can actually log in — proves the account is real.
  r = await req('POST', '/auth/login', { body: { email: `handler-${stamp}@example.com`, password: 'temppass123' } });
  check('created operator can log in', r.status === 200 && ['admin', 'handler'].includes(r.json.user?.role));

  r = await req('DELETE', `/admin/users/${NEW_OP_ID}`, { token: ADMIN });
  check('admin deletes operator → 200', r.status === 200);

  console.log('\n— NOTIFICATIONS —');
  r = await req('GET', '/notifications', { token: ADMIN });
  check('admin reads notifications → 200', r.status === 200 && Array.isArray(r.json.notifications) && typeof r.json.unreadCount === 'number');
  r = await req('GET', '/notifications', { token: CUSTOMER });
  check('customer reads own notifications → 200', r.status === 200);
  r = await req('GET', '/notifications');
  check('anonymous notifications → 401', r.status === 401);
  r = await req('GET', '/notifications/unread-count', { token: ADMIN });
  check('unread count endpoint → 200', r.status === 200 && typeof r.json.unreadCount === 'number');
  r = await req('PATCH', '/notifications/read-all', { token: ADMIN });
  check('mark all read → 200 unreadCount 0', r.status === 200 && r.json.unreadCount === 0);

  // Real event → notification: creating an order must notify staff.
  r = await req('POST', '/orders', {
    token: CUSTOMER,
    body: {
      items: [{ productSlug: 'gold-foil-pressed-stickers', quantity: 1 }],
      shippingAddress: { name: 'Integration A', address: '1 Test St', city: 'Mumbai', state: 'MH', pincode: '400001' },
    },
  });
  check('order created (notification source event)', r.status === 201, JSON.stringify(r.json).slice(0, 150));
  const NOTIF_ORDER = r.json.order?.orderId;
  r = await req('GET', '/notifications', { token: ADMIN });
  const hasNewOrderNotif = (r.json.notifications || []).some((n) => n.type === 'new_order' && n.title.includes(NOTIF_ORDER));
  check('new order generated a staff notification', hasNewOrderNotif, `looking for ${NOTIF_ORDER}`);

  // Mark one notification read and verify unreadCount decrements.
  const firstUnread = (r.json.notifications || []).find((n) => !n.read);
  if (firstUnread) {
    r = await req('PATCH', `/notifications/${firstUnread._id}/read`, { token: ADMIN });
    check('mark single read → 200', r.status === 200 && r.json.notification?.read === true);
  } else {
    check('mark single read → 200', false, 'no unread notification found to test');
  }

  console.log('\n— PRODUCT EDIT + INVENTORY CONSISTENCY —');
  r = await req('POST', '/products', { token: ADMIN, body: { name: `Edit Test Posy ${stamp}`, price: 700, initialStock: 10, reorderLevel: 4 } });
  check('product created with inventory params → 201', r.status === 201);
  const SLUG = r.json.product?.slug;

  r = await req('PATCH', `/products/${SLUG}`, { token: ADMIN, body: { description: 'Updated description', price: 825 } });
  check('product edit persists', r.status === 200 && r.json.product?.price === 825 && r.json.product?.description === 'Updated description');

  r = await req('GET', '/inventory', { token: ADMIN });
  const inv = r.json.inventory.find((i) => i.productSlug === SLUG);
  check('inventory created with initial stock', !!inv && inv.currentStock === 10 && inv.reorderLevel === 4);

  r = await req('DELETE', `/products/${SLUG}`, { token: ADMIN });
  check('product deleted → 200', r.status === 200);
  r = await req('GET', '/inventory', { token: ADMIN });
  check('inventory record removed with product (no orphan)', !r.json.inventory.find((i) => i.productSlug === SLUG));

  // Re-create same name → must NOT hit orphaned inventory unique index.
  r = await req('POST', '/products', { token: ADMIN, body: { name: `Edit Test Posy ${stamp}`, price: 700, initialStock: 3 } });
  check('re-create same product name succeeds (no orphan inventory)', r.status === 201, JSON.stringify(r.json).slice(0, 150));
  await req('DELETE', `/products/${SLUG}`, { token: ADMIN });

  console.log('\n— COLLECTION CRUD —');
  r = await req('POST', '/collections', {
    token: ADMIN,
    body: { name: `Integration Collection ${stamp}`, description: 'Created by integration smoke', productSlugs: ['desk-bloom-ceramic-pot'], visibility: 'Visible' },
  });
  check('collection created → 201', r.status === 201);
  const COL = r.json.collection?.slug;
  r = await req('PATCH', `/collections/${COL}`, {
    token: ADMIN,
    body: { description: 'Updated description', productSlugs: ['desk-bloom-ceramic-pot', 'botanical-wax-seal-kit'], visibility: 'Hidden' },
  });
  check('collection edit persists', r.status === 200 && r.json.collection?.description === 'Updated description' && r.json.collection?.productSlugs?.length === 2);
  r = await req('GET', `/collections/${COL}`);
  check('hidden collection hidden from public → 404', r.status === 404);
  r = await req('DELETE', `/collections/${COL}`, { token: ADMIN });
  check('collection deleted → 200', r.status === 200);

  console.log('\n— UPLOAD AUTHORIZATION —');
  r = await req('POST', '/uploads/product-image');
  check('anonymous upload → 401', r.status === 401);
  r = await req('POST', '/uploads/product-image', { token: CUSTOMER });
  check('customer upload → 403', r.status === 403);

  console.log(`\n══════════════════════════════════════`);
  console.log(`INTEGRATION RESULT: ${passed} passed, ${failed} failed`);
  if (failed) { console.log('FAILURES:', failures.join(' | ')); process.exit(1); }
  console.log('ALL INTEGRATION TESTS PASSED');
}

main().catch((err) => {
  console.error('INTEGRATION RUNNER ERROR:', err);
  process.exit(1);
});
