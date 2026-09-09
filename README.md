# Flora Alchemy

Handcrafted botanical keepsakes, personalized gifts, and floral art boutique — full-stack ecommerce application.

## Architecture

- **Frontend:** React 19 + Vite + Tailwind CSS
- **Backend:** Express.js + MongoDB/Mongoose
- **Auth:** JWT (customer + admin/handler sessions)
- **Package Manager:** npm

## Project Surfaces

- **Customer Storefront** — `/` (public browsing, search, cart, wishlist, checkout)
- **Handler Portal** — `/admin` (orders, products, inventory, analytics, settings)

## Quick Start

### Frontend

```bash
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

## Environment Variables

### Frontend (.env)

| Variable | Purpose |
|---|---|
| `VITE_API_URL` | Backend API base URL (default: `http://localhost:4000/api`) |

### Backend (backend/.env)

| Variable | Purpose |
|---|---|
| `PORT` | Server port (default: 4000) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Auth token signing key |
| `JWT_EXPIRES_IN` | Token lifetime (default: 7d) |
| `CORS_ORIGIN` | Allowed browser origins |
| `SEED_ON_START` | Auto-seed demo fixtures on boot |

## Customer Flow

Browse → Shop → Product → Add to Cart → Checkout → Authentication → Delivery → Payment → Review → Place Order → Order Success → Tracking

## Admin Flow

`/admin/login` → Dashboard → Orders / Products / Collections / Customers / Inventory / Analytics / Settings

## API

Backend runs at `/api` with RESTful endpoints:

- Auth: register, login, logout, current user
- Products: CRUD (public read, admin write)
- Collections: CRUD
- Orders: create (customer), list (admin), status update
- Inventory: stock levels, adjustments, history
- Analytics: overview, sales, performance
- Settings: read/write store configuration
- Wishlist: customer-owned, per-account
- Customers: profile, addresses

All business data is server-authoritative. Client prices are never trusted for order creation.

## Testing

```bash
cd backend
npm run test:api     # 119 API smoke tests
```

## Canonical Order Lifecycle

`new` → `confirmed` → `in_production` → `quality_check` → `ready_to_dispatch` → `shipped` → `delivered`

## License

Private — Flora Alchemy.
