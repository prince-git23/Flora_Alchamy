# Flora Alchemy — Project Status

**Last Updated:** September 13, 2026

## Current Architecture

```
Flora_Alchamy/
├── frontend/          ← React/Vite application
│   ├── src/
│   │   ├── components/    (14 components)
│   │   ├── pages/         (47 pages: 20 customer + 27 admin)
│   │   ├── context/       (3 providers)
│   │   └── services/      (18 service files)
│   ├── public/assets/     (16 product images)
│   └── vite.config.js
├── backend/           ← Express/MongoDB API
│   ├── config/            (2 files: customGiftPricing, db)
│   ├── controllers/       (11 controllers)
│   ├── middleware/         (2 files: auth, error)
│   ├── models/            (12 MongoDB models)
│   ├── routes/            (12 route files, 57 endpoints)
│   ├── services/          (5 service files)
│   ├── scripts/           (5 test scripts)
│   └── seed/              (seed data)
├── .freebuff/         ← development tooling
├── docs/              ← project documentation
└── root config        ← package.json, README, metadata
```

## Completed Features

### Customer Storefront
- ✅ Home page with 3D botanical canvas
- ✅ Shop with filters (category, occasion, recipient, price, availability)
- ✅ Product detail with gallery, personalization, related products
- ✅ Gift Finder (5-step wizard with live catalogue recommendations)
- ✅ Custom Gift Builder (7-step with server-authoritative pricing)
- ✅ Custom Request form
- ✅ Search with popular searches and category suggestions
- ✅ Collections browsing
- ✅ Our Story, How It's Made, Flora Journal pages
- ✅ Responsive design (360-1440px)

### Commerce
- ✅ Product catalogue (10 seeded products)
- ✅ Collections (3 seeded collections)
- ✅ Cart (browser-local, becomes order on checkout)
- ✅ Checkout (4-step: Account → Delivery → Payment → Review)
- ✅ Server-authoritative pricing (catalogue, custom gifts, add-ons)
- ✅ Order creation with inventory reservation
- ✅ Order lifecycle (7-stage forward-only)
- ✅ Inventory management (atomic, hold/release/deduct)

### Authentication
- ✅ Customer registration and login
- ✅ Admin/handler login
- ✅ JWT-based sessions (7-day expiry)
- ✅ Customer/admin session separation
- ✅ Session expiration handling (401 → clear + redirect)
- ✅ Protected routes (AdminRoute, protect middleware)

### Customer Account
- ✅ Overview with welcome, quick actions
- ✅ Orders tab with tracking and conversation links
- ✅ Saved Gifts (wishlist)
- ✅ Addresses (CRUD)
- ✅ Profile editing

### Admin Portal
- ✅ Dashboard with analytics
- ✅ Orders (list, detail, status update, create)
- ✅ Products (list, detail, create, edit)
- ✅ Collections (list, detail)
- ✅ Customers (list, detail)
- ✅ Inventory (overview, stock, adjust, low stock, history)
- ✅ Analytics (overview, sales, performance)
- ✅ Settings (general, commerce, notifications, access, store preferences)
- ✅ Custom Requests (list, detail, status update)
- ✅ Order conversations

### Payments
- ✅ Razorpay adapter (create order, verify signature, webhook)
- ✅ Idempotent payment handling
- ✅ Failed/cancelled payment flow
- ✅ Retry support
- ⏸️ Real Razorpay test mode (blocked on credentials)

### Messaging
- ✅ Order-linked conversations (customer ↔ handler)
- ✅ Message persistence (MongoDB)
- ✅ Read/unread tracking
- ✅ Entry points: Order Success, Account, Tracking

### Testing
- ✅ API smoke tests (119 assertions)
- ✅ Payment lifecycle tests (45 tests)
- ✅ Conversation tests (34 tests)
- ✅ Custom gift pricing tests (22 tests)

## Remaining Work

### P0 — Must Fix
None. All P0 items resolved.

### P1 — Important
- Rate limiting on auth/API/webhook endpoints
- Tax/GST calculation (business decision needed)
- Refund flow (business decision needed)

### P2 — Quality/Performance
- Code splitting / lazy loading (1.41 MB single chunk)
- Security headers (Helmet)
- Input sanitization
- Additional test coverage (custom requests, wishlist, addresses)

### P3 — Optional
- Docker/PM2 deployment
- Structured logging
- API documentation (OpenAPI/Swagger)
- Newsletter backend

### External — Requires Credentials/Decisions
- Real Razorpay test mode verification (needs rzp_test_* keys)
- Newsletter provider selection
- GST/tax rules
- Cancellation/refund policy

## Production Readiness

### Ready
- ✅ Frontend builds successfully
- ✅ Backend starts and connects to MongoDB
- ✅ All API endpoints functional
- ✅ Authentication working
- ✅ Authorization working
- ✅ Server-authoritative pricing
- ✅ Inventory management
- ✅ Order lifecycle
- ✅ Payment adapter ready
- ✅ Responsive design
- ✅ Error handling

### Not Ready
- ❌ Rate limiting
- ❌ Security headers
- ❌ Production deployment config
- ❌ Structured logging
- ❌ Monitoring/health checks
- ❌ Real payment verification

## External Dependencies

- **MongoDB:** Local or Atlas (configured via backend/.env)
- **Razorpay:** Optional (configured via backend/.env)
- **Node.js:** >=18.0.0

## Environment Variables

### Frontend (frontend/.env)
- `VITE_API_URL` — Backend API base URL

### Backend (backend/.env)
- `PORT` — Server port (default: 4000)
- `MONGO_URI` — MongoDB connection string
- `JWT_SECRET` — Auth token signing key
- `JWT_EXPIRES_IN` — Token lifetime (default: 7d)
- `CORS_ORIGIN` — Allowed browser origins
- `SEED_ON_START` — Auto-seed demo fixtures on boot
- `RAZORPAY_KEY_ID` — Razorpay test key (optional)
- `RAZORPAY_KEY_SECRET` — Razorpay test secret (optional)
