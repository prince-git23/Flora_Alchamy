# Flora Alchemy — how to run (full stack)

## Project Structure

```
Flora_Alchamy/
├── frontend/          ← React/Vite application
├── backend/           ← Express/MongoDB API
├── .freebuff/         ← development tooling
├── docs/              ← project documentation
└── root config        ← repository-level files
```

## Services

| Service | Command / script | URL |
|---|---|---|
| MongoDB | configurable via `backend/.env` `MONGO_URI` — either a **local single-node replica set** (`powershell -ExecutionPolicy Bypass -File .freebuff/start-mongod.ps1`, mongodb://127.0.0.1:27018, db `flora_alchemy`) or a hosted cluster (the checked-in `backend/.env` currently points at MongoDB Atlas — gitignored, do not commit) | — |
| Express API (backend) | `powershell -ExecutionPolicy Bypass -File .freebuff/start-backend.ps1` | http://localhost:4000 (`/api/health`) |
| Vite frontend | `powershell -ExecutionPolicy Bypass -File .freebuff/start-server.ps1` | http://localhost:3000 |

Logs: `.freebuff/mongod.log(.err)`, `.freebuff/backend.log(.err)`, `.freebuff/preview-*.log(.err)`.

## Quick Start

### Frontend
```bash
cd frontend
npm install
npm run dev        # http://localhost:3000
```

### Backend
```bash
cd backend
npm install
cp .env.example .env   # configure MONGO_URI, JWT_SECRET
npm run dev            # http://localhost:4000
```

### Both (Windows PowerShell)
```powershell
powershell -ExecutionPolicy Bypass -File .freebuff/start-mongod.ps1
powershell -ExecutionPolicy Bypass -File .freebuff/start-backend.ps1
powershell -ExecutionPolicy Bypass -File .freebuff/start-server.ps1
```

## Reproduce uncommitted artifacts

1. **MongoDB data** — `.mongo-data/` (gitignored) is created and managed by `start-mongod.ps1`. On a fresh machine: install MongoDB 8.x, then run the script and, once, initialize the replica set:
   ```
   mongosh --port 27018 --eval "rs.initiate()"
   ```
   (Transactions — order creation, registration — require a replica set. MongoDB Atlas replica sets support them natively.)
2. **Env files** (gitignored, never committed):
   - `backend/.env` — copy from `backend/.env.example`; set `MONGO_URI` (local: `mongodb://127.0.0.1:27018/flora_alchemy?replicaSet=rs0`, or your Atlas string) and a real `JWT_SECRET`.
   - `frontend/.env` — `VITE_API_URL=http://localhost:4000/api`.
3. **Backend deps** — `cd backend && npm install`.
4. **Frontend deps** — `cd frontend && npm install`.
5. **Seed** — runs automatically on API boot when `SEED_ON_START=true` (fixtures only; flagged `isFixture`, never auto-authenticated). Manual re-run: `cd backend && npm run seed`.
6. **Security env (Phase 15)** — all optional with sensible defaults; see the “Security (Phase 15)” block in `backend/.env.example`. In production set `NODE_ENV=production` and `CORS_ORIGIN` to your real domain(s); set `TRUST_PROXY=true` only behind a reverse proxy.

## Run order

Start mongod (or rely on Atlas) → backend (waits for DB) → frontend.

## Verify

- API health (dev server only): `curl http://localhost:4000/api/health`
- **Full QA (no dev server needed — every suite boots its own isolated backend + dedicated test DB):**
  ```
  cd backend && npm test          # runs ALL suites via scripts/run-all.mjs
  ```
  Suite order is fixed: Pricing → API → Integration → Payment → Conversation → Security. Exit code is non-zero on any failure.
- Individual suites (each self-contained, safe to run in any order, repeatedly):
  - `npm run test:api` (120) — auth, products, orders, lifecycle, inventory, wishlist, addresses, analytics, settings
  - `npm run test:integration` (56) — operator CRUD, notifications, product/inventory consistency, collection CRUD, real multipart upload, custom requests
  - `npm run test:payment` (45) — boots a mock Razorpay server
  - `npm run test:conversation` (34)
  - `npm run test:pricing` (22) — server-authoritative custom-gift pricing
  - `npm run test:security` (56) — token forgery, isolation, tampering, rate limits; boots its own server so limiter exhaustion stays contained
  - `npm run test:razorpay-real` — SKIPPED (exit 0) unless real rzp_test_* credentials are exported
- **Test databases:** suites write ONLY to `Flora-Alchemy-Test-*` databases derived from `MONGO_URI` in `backend/.env`; the dev database is never touched. Shared helper: `backend/scripts/lib/testServer.mjs`.
- Storefront: open http://localhost:3000 — fresh visitors are **GUEST**; demo quick-fill helpers exist on /login and /admin/login but authenticate only on explicit action against the real backend (bcrypt + JWT).

## Architecture

- **Auth (customer + admin)** is fully backend-backed: register/login/logout → `/api/auth/*`; bcrypt(12) hashes; separate per-portal JWTs. Fresh sessions start as GUEST — demo fixtures never auto-authenticate.
- **All business data is backend-backed** through `frontend/src/services/apiClient.js` → Express → MongoDB: products, collections, orders (+ server-side pricing/inventory), inventory, customers, analytics, settings, wishlist, customer addresses, conversations, and custom requests.
- **Cart** is browser-local by design (guest + authenticated alike) and becomes an order via `POST /api/orders` after authentication; the wishlist is account-owned and persisted in MongoDB.
- **Server-authoritative pricing**: catalogue products, custom gifts, and add-ons are all priced server-side. Client-supplied prices are rejected.
- **Payment** is Razorpay-ready: when `RAZORPAY_KEY_ID`/`RAZORPAY_KEY_SECRET` are configured, orders flow through real Razorpay Test Mode; otherwise orders record an honest `Sample` payment status.