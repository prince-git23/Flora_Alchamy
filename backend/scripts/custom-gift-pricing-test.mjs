/**
 * Phase 3G-C.1 — Custom Gift Pricing Authority Test
 *
 * Tests:
 * 1. Valid config → server calculates price (1850 base + 300 peony = 2150)
 * 2. Tampered client price (₹10) → server ignores, uses authoritative price
 * 3. Invalid base → 422
 * 4. Invalid flower → 422
 * 5. No customGiftConfig and no productSlug → 422
 * 6. Add-on with client price → accepted (packaging upgrade)
 */

const BASE = 'http://127.0.0.1:4000';

async function login() {
  const res = await fetch(`${BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'customer@example.com', password: 'demo1234' }),
  });
  const data = await res.json();
  return data.token;
}

async function createOrder(token, items, extra = {}) {
  const res = await fetch(`${BASE}/api/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      items,
      shippingAddress: { name: 'Test', address: '123 Test', city: 'Mumbai', state: 'MH', pincode: '400001', phone: '9999999999' },
      ...extra,
    }),
  });
  return { status: res.status, data: await res.json() };
}

async function run() {
  let passed = 0;
  let failed = 0;

  function assert(label, condition, detail = '') {
    if (condition) {
      console.log(`  ✔ ${label}`);
      passed++;
    } else {
      console.log(`  ✘ ${label}${detail ? ' — ' + detail : ''}`);
      failed++;
    }
  }

  const token = await login();
  assert('Login succeeds', !!token);
  if (!token) { console.log('\nCannot continue without token.'); return; }

  // TEST 1: Valid config — server calculates price
  console.log('\nTEST 1: Valid custom gift config');
  {
    const r = await createOrder(token, [{
      name: 'Custom Birthday Gift',
      quantity: 1,
      customGiftConfig: {
        baseId: 'keepsake-posy',      // 1850
        flowerIds: ['rose', 'lavender', 'peony'],  // 0 + 0 + 300 = 300
        paletteId: 'mauve',
        ribbonId: 'frayed-silk',
        sealId: 'terracotta',
      },
    }]);
    assert('Order created', r.status === 201, `status=${r.status}`);
    const item = r.data?.order?.items?.[0];
    assert('Price is 2150 (1850 + 300)', item?.price === 2150, `got ${item?.price}`);
    assert('Subtotal is 2150', r.data?.order?.subtotal === 2150, `got ${r.data?.order?.subtotal}`);
    assert('customDetails has pricingBreakdown', !!item?.customDetails?.pricingBreakdown);
    assert('Breakdown base = keepsake-posy', item?.customDetails?.pricingBreakdown?.base?.id === 'keepsake-posy');
  }

  // TEST 2: Tampered client price — server ignores it
  console.log('\nTEST 2: Tampered client price (₹10)');
  {
    const r = await createOrder(token, [{
      name: 'Hacked Gift',
      quantity: 1,
      price: 10,  // TAMPERED — should be ignored
      customGiftConfig: {
        baseId: 'keepsake-posy',
        flowerIds: ['rose'],
        paletteId: 'sage',
        ribbonId: 'velvet-cord',
        sealId: 'gold',
      },
    }]);
    assert('Order created', r.status === 201, `status=${r.status}`);
    const item = r.data?.order?.items?.[0];
    assert('Price is 1850 (server-ignored tampered ₹10)', item?.price === 1850, `got ${item?.price}`);
    assert('Total is 2000 (1850 + 150 shipping), NOT 10', r.data?.order?.total === 2000, `got ${r.data?.order?.total}`);
  }

  // TEST 3: Invalid base → 422
  console.log('\nTEST 3: Invalid base ID');
  {
    const r = await createOrder(token, [{
      name: 'Bad Config',
      quantity: 1,
      customGiftConfig: {
        baseId: 'nonexistent-base',
        flowerIds: ['rose'],
        paletteId: 'mauve',
        ribbonId: 'frayed-silk',
        sealId: 'terracotta',
      },
    }]);
    assert('Rejected with 422', r.status === 422, `status=${r.status}`);
    assert('Error mentions invalid configuration', r.data?.message?.includes('Invalid custom gift configuration'));
  }

  // TEST 4: Invalid flower → 422
  console.log('\nTEST 4: Invalid flower ID');
  {
    const r = await createOrder(token, [{
      name: 'Bad Flower',
      quantity: 1,
      customGiftConfig: {
        baseId: 'ceramic-pot',
        flowerIds: ['rose', 'fake-flower'],
        paletteId: 'cream',
        ribbonId: 'deckled-twine',
        sealId: 'sage',
      },
    }]);
    assert('Rejected with 422', r.status === 422, `status=${r.status}`);
    assert('Error mentions invalid flower', r.data?.message?.includes('fake-flower'));
  }

  // TEST 5: No config and no slug → REJECTED for customer orders
  console.log('\nTEST 5: No customGiftConfig and no productSlug (customer rejected)');
  {
    const r = await createOrder(token, [{
      name: 'Legacy Custom',
      quantity: 1,
      price: 500,
    }]);
    assert('Rejected with 422', r.status === 422, `status=${r.status}`);
    assert('Error mentions productSlug or customGiftConfig', r.data?.message?.includes('productSlug') || r.data?.message?.includes('customGiftConfig'));
  }

  // TEST 6: Valid add-on with addOnId → server resolves price
  console.log('\nTEST 6: Valid add-on with addOnId');
  {
    const r = await createOrder(token, [{
      name: 'Studio Pine Casket',
      quantity: 1,
      addOnId: 'studio-pine-casket',
      isAddOn: true,
    }]);
    assert('Add-on order created', r.status === 201, `status=${r.status}`);
    const item = r.data?.order?.items?.[0];
    assert('Add-on price is 450 (server-resolved)', item?.price === 450, `got ${item?.price}`);
  }

  // TEST 7: Unknown add-on → 422
  console.log('\nTEST 7: Unknown add-on ID');
  {
    const r = await createOrder(token, [{
      name: 'Fake Add-on',
      quantity: 1,
      addOnId: 'nonexistent-addon',
      isAddOn: true,
    }]);
    assert('Rejected with 422', r.status === 422, `status=${r.status}`);
    assert('Error mentions unknown add-on', r.data?.message?.includes('Unknown add-on'));
  }

  // TEST 8: Tampered add-on price → ignored
  console.log('\nTEST 8: Tampered add-on price');
  {
    const r = await createOrder(token, [{
      name: 'Studio Pine Casket',
      quantity: 1,
      addOnId: 'studio-pine-casket',
      price: 1,  // TAMPERED — should be ignored
      isAddOn: true,
    }]);
    assert('Order created', r.status === 201, `status=${r.status}`);
    const item = r.data?.order?.items?.[0];
    assert('Price is 450 (server-ignored tampered ₹1)', item?.price === 450, `got ${item?.price}`);
  }

  // TEST 9: Add-on without addOnId → 422
  console.log('\nTEST 9: Add-on without addOnId');
  {
    const r = await createOrder(token, [{
      name: 'Mystery Add-on',
      quantity: 1,
      price: 450,
      isAddOn: true,
    }]);
    assert('Rejected with 422', r.status === 422, `status=${r.status}`);
  }

  console.log(`\n══════════════════════════════════════`);
  console.log(`PRICING TEST: ${passed} passed, ${failed} failed`);
  if (failed > 0) process.exit(1);
}

run().catch((e) => { console.error(e); process.exit(1); });
