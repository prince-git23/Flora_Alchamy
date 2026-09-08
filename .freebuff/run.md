# Flora Alchemy — how to run (full stack)

## Services

| Service | Command / script | URL |
|---|---|---|
| MongoDB | configurable via `backend/.env` `MONGO_URI` — either a **local single-node replica set** (`powershell -ExecutionPolicy Bypass -File .freebuff/start-mongod.ps1`, mongodb://127.0.0.1:27018, db `flora_alchemy`) or a hosted cluster (the checked-in `backend/.env` currently points at MongoDB Atlas — gitignored, do not commit) | — |
| Express API (backend) | `powershell -ExecutionPolicy Bypass -File .freebuff/start-backend.ps1` | http://localhost:4000 (`/api/health`) |
| Vite frontend | `powershell -ExecutionPolicy Bypass -File .freebuff/start-server.ps1` | http://localhost:3000 |

Logs: `.freebuff/mongod.log(.err)`, `.freebuff/backend.log(.err)`, `.freebuff/preview-*.log(.err)`.

## Reproduce uncommitted artifacts

1. **MongoDB data** — `.mongo-data/` (gitignored) is created and managed by `start-mongod.ps1`. On a fresh machine: install MongoDB 8.x, then run the script and, once, initialize the replica set:
   ```
   mongosh --port 27018 --eval "rs.initiate()"
   ```
   (Transactions — order creation, registration — require a replica set. MongoDB Atlas replica sets support them natively.)
2. **Env files** (gitignored, never committed):
   - `backend/.env` — copy from `backend/.env.example`; set `MONGO_URI` (local: `mongodb://127.0.0.1:27018/flora_alchemy?replicaSet=rs0`, or your Atlas string) and a real `JWT_SECRET`.
   - root `.env` — `VITE_API_URL=http://localhost:4000/api`.
3. **Backend deps** — `cd backend && npm install`.
4. **Seed** — runs automatically on API boot when `SEED_ON_START=true` (fixtures only; flagged `isFixture`, never auto-authenticated). Manual re-run: `cd backend && npm run seed`.

## Run order

Start mongod (or rely on Atlas) → backend (waits for DB) → frontend.

## Verify

- API health: `curl http://localhost:4000/api/health`
- API smoke suite (needs backend up): `cd backend && npm run test:api` (119 assertions — auth, products, orders, lifecycle, inventory, analytics, settings, wishlist ownership, addresses)
- Storefront: open http://localhost:3000 — fresh visitors are **GUEST**; demo quick-fill helpers exist on /login and /admin/login but authenticate only on explicit action against the real backend (bcrypt + JWT).

## Notes / migration state (Phase 3C + 3D)

- **Auth (customer + admin)** is fully backend-backed: register/login/logout → `/api/auth/*`; bcrypt(12) hashes; separate per-portal JWTs. Fresh sessions start as GUEST — demo fixtures never auto-authenticate.
- **All business data is backend-backed** through `src/services/apiClient.js` → Express → MongoDB: products, collections, orders (+ server-side pricing/inventory), inventory, customers, analytics, settings, and now the **wishlist** (Phase 3D: `/api/wishlist`, customer-owned, guests get a "Sign in to save" prompt) and **customer addresses** (`/api/customers/me/addresses`).
- **Cart** is browser-local by design (guest + authenticated alike) and becomes an order via `POST /api/orders` after authentication; the wishlist is account-owned and persisted in MongoDB.
- **Session hardening** (Phase 3D): a token-bearing request rejected with 401 clears that portal's session and redirects to the matching login screen (`/login` or `/admin/login`); checkout context is preserved via `?redirect=/checkout`.
- **Payment** is prototype-only: `src/services/paymentService.js` is the seam for a future gateway; orders record an honest `Sample` payment status. No real charge is made or claimed.