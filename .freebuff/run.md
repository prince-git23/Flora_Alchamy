# Flora Alchemy — how to run (full stack)

## Services

| Service | Command / script | URL |
|---|---|---|
| MongoDB (single-node replica set) | `powershell -ExecutionPolicy Bypass -File .freebuff/start-mongod.ps1` | mongodb://127.0.0.1:27018 (db `flora_alchemy`) |
| Express API (backend) | `powershell -ExecutionPolicy Bypass -File .freebuff/start-backend.ps1` | http://localhost:4000 (`/api/health`) |
| Vite frontend | `powershell -ExecutionPolicy Bypass -File .freebuff/start-server.ps1` | http://localhost:3000 |

Logs: `.freebuff/mongod.log(.err)`, `.freebuff/backend.log(.err)`, `.freebuff/preview-*.log(.err)`.

## Reproduce uncommitted artifacts

1. **MongoDB data** — `.mongo-data/` (gitignored) is created and managed by `start-mongod.ps1`. On a fresh machine: install MongoDB 8.x, then run the script and, once, initialize the replica set:
   ```
   mongosh --port 27018 --eval "rs.initiate()"
   ```
   (Transactions — order creation, registration — require the replica set.)
2. **Env files** (gitignored, never committed):
   - `backend/.env` — copy from `backend/.env.example`; set `MONGO_URI=mongodb://127.0.0.1:27018/flora_alchemy?replicaSet=rs0` and a real `JWT_SECRET`.
   - root `.env` — `VITE_API_URL=http://localhost:4000/api`.
3. **Backend deps** — `cd backend && npm install`.
4. **Seed** — runs automatically on API boot when `SEED_ON_START=true` (fixtures only; 26 records). Manual re-run: `cd backend && npm run seed`.

## Run order

Start mongod → backend (waits for DB) → frontend.

## Verify

- API health: `curl http://localhost:4000/api/health`
- API smoke suite (needs backend up): `cd backend && npm run test:api` (89 assertions)
- Storefront: open http://localhost:3000 — fresh visitors are GUEST; demo quick-fill helpers exist on /login and /admin/login but authenticate only on explicit action against the real backend (bcrypt + JWT).

## Notes / migration state (Phase 3B)

- Auth (customer + admin) is fully backend-backed: register/login/logout go to `/api/auth/*`; passwords hashed with bcrypt; JWTs stored per-portal.
- Catalogue, orders, inventory, collections, analytics, settings currently still read/write the localStorage prototype adapter through the service layer — the backend endpoints exist and are API-tested. UI service rewiring to those endpoints is the next work group.
- Cart/wishlist remain local browser state (guest + authenticated alike).
