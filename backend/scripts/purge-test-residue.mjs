/**
 * Phase 20 — dev-database test-residue purge (one-off, dry-run first).
 *
 * Context: before Phase 16's isolated test databases, the smoke suites ran
 * against the development Atlas database, accumulating throwaway test
 * customers/orders/notifications. Every accumulated email matches a test
 * pattern (conv-*, pay-*, smoke-*, sec-*, int-*, diag-*, …) and every address
 * is example.com — verified in the Phase 20 audit. No real customers exist.
 *
 * Retention: the 6 seeded fixture customers (customer@example.com, the four
 * seed personas, demo-fixture@…) and their orders are ALWAYS kept.
 *
 * Scope: customers (and their auth Users), orders, wishlists, notifications,
 * conversations+messages, custom requests belonging to residue customers.
 * Fixture rows (isFixture/fixture:true) are never touched.
 *
 * Usage:
 *   node scripts/purge-test-residue.mjs --dry-run   (default: report only)
 *   node scripts/purge-test-residue.mjs --apply     (perform deletions)
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const APPLY = process.argv.includes('--apply');
const conn = await mongoose.connect(process.env.MONGO_URI);
const db = conn.connection.db;

// Seed fixture emails — never touched.
const SEED_EMAILS = new Set([
  'customer@example.com',
  'aarav.mehta@example.com',
  'priya.sharma@example.com',
  'ananya.verma@example.com',
  'sneha.nair@example.com',
  'demo-fixture@flora-alchemy.demo',
]);

// Residue email pattern: known throwaway prefixes used by old smoke suites.
const RESIDUE_RE = /^(conv-|pay-|paya-|smoke|sec-|sec[ab]|int-|integ|diag-|dbg-|stitch\.|regtest|audit-|live-|qa-|stock-|waste-|rzp-|rzpreal|perf-|p3d-)/i;

const customers = await db.collection('customers').find({}).project({ _id: 1, email: 1 }).toArray();
const residueCustomers = customers.filter(
  (c) => !SEED_EMAILS.has(String(c.email || '').toLowerCase()) && RESIDUE_RE.test(String(c.email || ''))
);
const residueIds = residueCustomers.map((c) => c._id);
console.log(`customers total=${customers.length} residue-matched=${residueCustomers.length} retained=${customers.length - residueCustomers.length}`);

if (residueIds.length === 0) {
  console.log('Nothing to purge.');
  await mongoose.disconnect();
  process.exit(0);
}

const counts = {};
counts.orders = await db.collection('orders').countDocuments({ customerId: { $in: residueIds } });
counts.wishlists = await db.collection('wishlists').countDocuments({ customerId: { $in: residueIds } });
counts.notifications = await db.collection('notifications').countDocuments({ userId: { $in: residueIds } });
counts.customrequests = await db.collection('customrequests').countDocuments({ customerId: { $in: residueIds } });

// conversations belong to the customer; messages hang off conversations
const convs = await db.collection('conversations').find({ customerId: { $in: residueIds } }).project({ _id: 1 }).toArray();
const convIds = convs.map((c) => c._id);
counts.conversations = convIds.length;
counts.messages = convIds.length ? await db.collection('messages').countDocuments({ conversationId: { $in: convIds } }) : 0;

// auth users for residue customers (role=customer, matching email)
const residueEmails = residueCustomers.map((c) => String(c.email).toLowerCase());
counts.users = await db.collection('users').countDocuments({
  role: 'customer',
  email: { $in: residueEmails, $nin: [...SEED_EMAILS] },
});

console.log('Dependent rows to remove:', JSON.stringify(counts, null, 1));

if (!APPLY) {
  console.log('\nDRY RUN — no changes made. Re-run with --apply to delete.');
  await mongoose.disconnect();
  process.exit(0);
}

console.log('\nAPPLYING…');
if (convIds.length) {
  const mr = await db.collection('messages').deleteMany({ conversationId: { $in: convIds } });
  console.log('messages deleted:', mr.deletedCount);
  const cr = await db.collection('conversations').deleteMany({ _id: { $in: convIds } });
  console.log('conversations deleted:', cr.deletedCount);
}
const del = async (name, q) => {
  const r = await db.collection(name).deleteMany(q);
  console.log(`${name} deleted:`, r.deletedCount);
  return r.deletedCount;
};
await del('orders', { customerId: { $in: residueIds }, isFixture: { $ne: true } });
await del('wishlists', { customerId: { $in: residueIds } });
await del('notifications', { userId: { $in: residueIds } });
await del('customrequests', { customerId: { $in: residueIds } });
await del('customers', { _id: { $in: residueIds } });
await del('users', { role: 'customer', email: { $in: residueEmails, $nin: [...SEED_EMAILS] } });

console.log('\nPurge complete. Fixture data untouched.');
await mongoose.disconnect();
