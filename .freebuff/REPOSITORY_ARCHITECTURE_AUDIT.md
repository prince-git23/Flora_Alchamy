# FLORA ALCHEMY — REPOSITORY ARCHITECTURE AUDIT
# STEP 1 — COMPLETE AUDIT REPORT

**Date:** 2026-09-08
**Scope:** Full repository inspection, no code changes
**Status:** AUDIT COMPLETE — AWAITING APPROVAL

---

## A. CURRENT TREE — COMPLETE FILE INVENTORY

### Root Files
| Path | Type | Purpose | Status |
|---|---|---|---|
| .env | Config | Environment variables (secrets) | ACTIVE |
| .env.example | Config | Environment template | CONFIG |
| .gitignore | Config | Git ignore rules | CONFIG |
| bun.lock | Config | Bun lockfile (legacy) | DEV-ONLY |
| index.html | Entry | Vite HTML entry | ACTIVE |
| metadata.json | Config | Project metadata | CONFIG |
| package-lock.json | Config | npm lockfile | CONFIG |
| package.json | Config | Frontend dependencies | CONFIG |
| vite.config.js | Config | Vite build config | ACTIVE |

### Frontend Source (src/)
| Path | Type | Purpose | Status |
|---|---|---|---|
| App.jsx | Entry | Root component + routing | ACTIVE |
| index.css | Style | Global styles | ACTIVE |
| main.jsx | Entry | React DOM entry | ACTIVE |

#### Components (src/components/)
| Path | Type | Purpose | Status |
|---|---|---|---|
| AdminRoute.jsx | Component | Admin auth guard | ACTIVE |
| BotanicalCanvas.jsx | Component | 3D hero canvas | ACTIVE |
| Footer.jsx | Component | Site footer | ACTIVE |
| MinimalHeader.jsx | Component | Minimal header (checkout/auth) | ACTIVE |
| Navbar.jsx | Component | Customer navigation | ACTIVE |
| OrderStatusTracker.jsx | Component | Order status display | ACTIVE |
| ProductCard.jsx | Component | Product card display | ACTIVE |
| PromoBar.jsx | Component | Promotional banner | ACTIVE |
| admin/AdminHeader.jsx | Component | Admin header | ACTIVE |
| admin/AdminLayout.jsx | Component | Admin layout wrapper | ACTIVE |
| admin/AdminSettingsTabs.jsx | Component | Settings tab navigation | ACTIVE |
| admin/AdminSidebar.jsx | Component | Admin sidebar navigation | ACTIVE |

#### Context (src/context/)
| Path | Type | Purpose | Status |
|---|---|---|---|
| AdminSessionContext.jsx | Context | Admin session state | ACTIVE |
| DataContext.jsx | Context | Data store provider | ACTIVE |
| StoreContext.jsx | Context | Store state provider | ACTIVE |

#### Pages (src/pages/)
| Path | Type | Purpose | Status |
|---|---|---|---|
| AccountPage.jsx | Page | Customer account/profile | ACTIVE |
| CartPage.jsx | Page | Shopping cart | ACTIVE |
| CheckoutPage.jsx | Page | Multi-step checkout | ACTIVE |
| CollectionsPage.jsx | Page | Collections catalog | ACTIVE |
| CustomGiftsPage.jsx | Page | Custom gifts | ACTIVE |
| HomePage.jsx | Page | Homepage | ACTIVE |
| LoginPage.jsx | Page | Customer login/register | ACTIVE |
| NotFoundPage.jsx | Page | 404 page | ACTIVE |
| OrderSuccessPage.jsx | Page | Order confirmation | ACTIVE |
| OrderTrackingPage.jsx | Page | Order tracking | ACTIVE |
| OurCreationsPage.jsx | Page | Our creations showcase | ACTIVE |
| ProductPage.jsx | Page | Product detail | ACTIVE |
| SearchPage.jsx | Page | Product search | ACTIVE |
| ShopPage.jsx | Page | Shop catalog | ACTIVE |
| WishlistPage.jsx | Page | Customer wishlist | ACTIVE |
| admin/AdminAccessPage.jsx | Page | Admin access/roles | ACTIVE |
| admin/AdminAnalyticsOverviewPage.jsx | Page | Analytics overview | ACTIVE |
| admin/AdminCollectionDetailPage.jsx | Page | Collection detail | ACTIVE |
| admin/AdminCollectionsPage.jsx | Page | Collections list | ACTIVE |
| admin/AdminCommerceSettingsPage.jsx | Page | Commerce settings | ACTIVE |
| admin/AdminCreateOrderPage.jsx | Page | Create order | ACTIVE |
| admin/AdminCreateProductPage.jsx | Page | Create product | ACTIVE |
| admin/AdminCustomerDetailPage.jsx | Page | Customer detail | ACTIVE |
| admin/AdminCustomersPage.jsx | Page | Customers list | ACTIVE |
| admin/AdminDashboardPage.jsx | Page | Admin dashboard | ACTIVE |
| admin/AdminGeneralSettingsPage.jsx | Page | General settings | ACTIVE |
| admin/AdminInventoryHistoryPage.jsx | Page | Inventory history | ACTIVE |
| admin/AdminInventoryPage.jsx | Page | Inventory overview | ACTIVE |
| admin/AdminLoginPage.jsx | Page | Admin login | ACTIVE |
| admin/AdminLowStockPage.jsx | Page | Low stock alerts | ACTIVE |
| admin/AdminNotificationsPage.jsx | Page | Notification settings | ACTIVE |
| admin/AdminOrderDetailPage.jsx | Page | Order detail | ACTIVE |
| admin/AdminOrdersPage.jsx | Page | Orders list | ACTIVE |
| admin/AdminPerformancePage.jsx | Page | Performance analytics | ACTIVE |
| admin/AdminProductDetailPage.jsx | Page | Product detail | ACTIVE |
| admin/AdminProductsPage.jsx | Page | Products list | ACTIVE |
| admin/AdminSalesRevenuePage.jsx | Page | Sales analytics | ACTIVE |
| admin/AdminStockAdjustmentPage.jsx | Page | Stock adjustment | ACTIVE |
| admin/AdminStockManagementPage.jsx | Page | Stock management | ACTIVE |
| admin/AdminStorePreferencesPage.jsx | Page | Store preferences | ACTIVE |

#### Services (src/services/)
| Path | Type | Purpose | Status |
|---|---|---|---|
| adminSettings.js | Service | Admin settings (STORE PREFERENCES ONLY) | ACTIVE |
| analyticsService.js | Service | Analytics API | ACTIVE |
| api.js | Service | Cart/wishlist local storage | ACTIVE |
| apiClient.js | Service | HTTP client with auth | ACTIVE |
| authService.js | Service | Auth session management | ACTIVE |
| collectionService.js | Service | Collection API | ACTIVE |
| customerService.js | Service | Customer API | ACTIVE |
| dataStore.js | Service | Server-hydrated data store | ACTIVE |
| inventoryService.js | Service | Inventory API | ACTIVE |
| orderService.js | Service | Order API + helpers | ACTIVE |
| paymentService.js | Service | Payment abstraction | ACTIVE |
| productService.js | Service | Product API | ACTIVE |
| settingsService.js | Service | Settings API | ACTIVE |
| storage.js | Service | localStorage abstraction | ACTIVE |
| wishlistService.js | Service | Wishlist API | ACTIVE |

### Public Assets (public/)
| Path | Type | Purpose | Status |
|---|---|---|---|
| assets/aistudio/.gitignore | Config | Gitignore for AI studio | DEV-ONLY |
| assets/images/flora-asset-01.jpg | Asset | Product image | ACTIVE |
| assets/images/flora-asset-02.jpg | Asset | Product image | ACTIVE* |
| assets/images/flora-asset-03.jpg | Asset | Product image | ACTIVE |
| assets/images/flora-asset-04.jpg | Asset | Product image | ACTIVE* |
| assets/images/flora-asset-05.jpg | Asset | Product image | ACTIVE* |
| assets/images/flora-asset-06.jpg | Asset | Product image | ACTIVE |
| assets/images/flora-asset-07.jpg | Asset | Product image | ACTIVE* |
| assets/images/flora-asset-08.jpg | Asset | Product image | ACTIVE* |
| assets/images/flora-asset-09.jpg | Asset | Product image | ACTIVE |
| assets/images/flora-asset-10.jpg | Asset | Product image | ACTIVE |
| assets/images/flora-asset-11.jpg | Asset | Product image | ACTIVE |
| assets/images/flora-asset-12.jpg | Asset | Product image | UNUSED |
| assets/images/flora-asset-13.jpg | Asset | Product image | ACTIVE |
| assets/images/flora-asset-14.jpg | Asset | Product image | ACTIVE |
| assets/images/flora-asset-15.jpg | Asset | Product image | UNUSED |
| assets/images/flora-asset-16.jpg | Asset | Product image | ACTIVE |
| assets/images/flora-asset-17.jpg | Asset | Product image | UNUSED |
| assets/images/flora-asset-18.jpg | Asset | Product image | UNUSED |
| assets/images/flora-asset-19.jpg | Asset | Product image | UNUSED |
| assets/images/flora-asset-20.jpg | Asset | Product image | UNUSED |
| assets/images/flora-asset-21.jpg | Asset | Product image | ACTIVE |
| assets/images/flora-asset-22.jpg | Asset | Product image | UNUSED |
| assets/images/flora-asset-23.jpg | Asset | Product image | UNUSED |
| assets/images/flora-asset-24.jpg | Asset | Product image | UNUSED |
| assets/images/flora-asset-25.jpg | Asset | Product image | ACTIVE |
| assets/images/flora-asset-26.jpg | Asset | Product image | ACTIVE |
| assets/images/flora-asset-27.jpg | Asset | Logo/brand image | ACTIVE |

**Note:** Images marked with * are used in seed data but referenced by slug from MongoDB, not direct frontend imports.

### Backend (backend/)
| Path | Type | Purpose | Status |
|---|---|---|---|
| .env | Config | Backend environment | CONFIG |
| .env.example | Config | Backend env template | CONFIG |
| package.json | Config | Backend dependencies | CONFIG |
| package-lock.json | Config | Backend lockfile | CONFIG |
| server.js | Entry | Express server | ACTIVE |
| config/db.js | Config | MongoDB connection | ACTIVE |
| controllers/analyticsController.js | Controller | Analytics endpoints | ACTIVE |
| controllers/authController.js | Controller | Auth endpoints | ACTIVE |
| controllers/collectionController.js | Controller | Collection endpoints | ACTIVE |
| controllers/customerController.js | Controller | Customer endpoints | ACTIVE |
| controllers/inventoryController.js | Controller | Inventory endpoints | ACTIVE |
| controllers/orderController.js | Controller | Order endpoints | ACTIVE |
| controllers/productController.js | Controller | Product endpoints | ACTIVE |
| controllers/settingsController.js | Controller | Settings endpoints | ACTIVE |
| controllers/wishlistController.js | Controller | Wishlist endpoints | ACTIVE |
| middleware/authMiddleware.js | Middleware | JWT auth + role check | ACTIVE |
| middleware/errorMiddleware.js | Middleware | Error handler | ACTIVE |
| models/Collection.js | Model | Collection schema | ACTIVE |
| models/Customer.js | Model | Customer schema | ACTIVE |
| models/Inventory.js | Model | Inventory schema | ACTIVE |
| models/InventoryMovement.js | Model | Inventory movement log | ACTIVE |
| models/Notification.js | Model | Notification schema | ACTIVE |
| models/Order.js | Model | Order schema | ACTIVE |
| models/Product.js | Model | Product schema | ACTIVE |
| models/Settings.js | Model | Settings schema | ACTIVE |
| models/User.js | Model | User auth schema | ACTIVE |
| models/Wishlist.js | Model | Wishlist schema | ACTIVE |
| routes/analyticsRoutes.js | Route | Analytics routes | ACTIVE |
| routes/authRoutes.js | Route | Auth routes | ACTIVE |
| routes/collectionRoutes.js | Route | Collection routes | ACTIVE |
| routes/customerRoutes.js | Route | Customer routes | ACTIVE |
| routes/inventoryRoutes.js | Route | Inventory routes | ACTIVE |
| routes/orderRoutes.js | Route | Order routes | ACTIVE |
| routes/productRoutes.js | Route | Product routes | ACTIVE |
| routes/settingsRoutes.js | Route | Settings routes | ACTIVE |
| routes/wishlistRoutes.js | Route | Wishlist routes | ACTIVE |
| scripts/api-smoke.mjs | Script | API test suite | TEST-ONLY |
| seed/seed.js | Script | Database seeder | SEED-ONLY |
| services/analyticsService.js | Service | Analytics computation | ACTIVE |
| services/inventoryService.js | Service | Inventory operations | ACTIVE |
| services/orderService.js | Service | Order operations | ACTIVE |

### Freebuff Tooling (.freebuff/)
| Path | Type | Purpose | Status |
|---|---|---|---|
| project-id | Config | Project identifier | CONFIG |
| run.md | Doc | Runtime documentation | DOCUMENTATION |
| start-backend.ps1 | Script | Backend startup | CONFIG |
| start-mongod.ps1 | Script | MongoDB startup | CONFIG |
| start-server.ps1 | Script | Frontend startup | CONFIG |
| *.log, *.log.err | Log | Runtime logs | DEV-ONLY |

### Other
| Path | Type | Purpose | Status |
|---|---|---|---|
| .mongo-data/ | Data | Local MongoDB data | DEV-ONLY |
| dist/ | Build | Vite build output | BUILD |
| node_modules/ | Deps | npm dependencies | DEPS |
| backend/node_modules/ | Deps | Backend dependencies | DEPS |

**Total tracked files (excl. node_modules/.git/dist):** ~90 files

---

## B. DEPENDENCY GRAPH — IMPORTANT DEPENDENCIES

### Frontend Entry Flow
```
index.html
  → src/main.jsx
    → App.jsx
      → React Router (Routes)
        → Customer Pages (15 pages)
        → Admin Pages (25 pages)
        → NotFoundPage
      → PromoBar, Navbar, Footer (storefront)
      → MinimalHeader (checkout/login)
      → AdminRoute guard (admin pages)
```

### Context Providers
```
DataContext.jsx (DataProvider)
  → dataStore.js (server-hydrated)
  → AdminSessionContext (admin auth)
    → authService.js (adminLogin/Logout)
  → StoreContext (cart/wishlist)
    → api.js (cart CRUD)
    → wishlistService.js (API wishlist)
    → productService.js (catalog)
    → customerService.js (active customer)
```

### Service → API → Backend Flow
```
Frontend Service → apiClient.js → Express API → MongoDB
  productService.js    → GET/POST/PATCH/DELETE /products
  collectionService.js → GET/POST/PATCH/DELETE /collections
  orderService.js      → GET/POST/PATCH /orders
  inventoryService.js  → GET/POST /inventory
  customerService.js   → GET/PATCH /customers, /auth/me
  analyticsService.js  → GET /analytics/*
  settingsService.js   → GET/PATCH /settings
  wishlistService.js   → GET/POST/DELETE /wishlist
  authService.js       → POST /auth/login, /register
```

### Backend Service Layer
```
server.js
  → config/db.js (MongoDB connection)
  → routes/*.js → controllers/*.js
    → services/*.js (business logic)
    → models/*.js (Mongoose schemas)
  → middleware/authMiddleware.js
  → middleware/errorMiddleware.js
```

---

## C. ACTIVE FILES — DEFINITELY IN USE

**Frontend (48 files):**
- All 15 customer pages
- All 25 admin pages
- All 12 components
- All 3 context providers
- All 15 services (except adminSettings.js — see DUPLICATES)
- App.jsx, main.jsx, index.css

**Backend (27 files):**
- server.js, config/db.js
- 9 controllers, 2 middleware, 10 models, 9 routes, 3 services
- scripts/api-smoke.mjs (test only)
- seed/seed.js (dev only)

**Public:** 17 active image assets (out of 27 total)

---

## D. DEV/TEST/SEED FILES — CLEARLY CLASSIFIED

### DEV-ONLY
- .freebuff/*.log, *.log.err
- .freebuff/start-*.ps1 (development startup scripts)
- .mongo-data/ (local MongoDB data)
- public/assets/aistudio/.gitignore
- bun.lock (legacy Bun lockfile)

### TEST-ONLY
- backend/scripts/api-smoke.mjs (119 API tests)

### SEED-ONLY
- backend/seed/seed.js (database seeder)

### BUILD
- dist/ (Vite output)

---

## E. DUPLICATES — DUPLICATE IMPLEMENTATIONS

### E-1: adminSettings.js vs settingsService.js (RESOLVED)
| | adminSettings.js | settingsService.js |
|---|---|---|
| **Authority** | localStorage (STORE PREFERENCES ONLY) | MongoDB/API |
| **Used by** | AdminStorePreferencesPage, AdminAccessPage (roles) | AdminGeneralSettingsPage, AdminCommerceSettingsPage, AdminNotificationsPage |
| **Status** | KEEP (UI preferences only) | KEEP (business settings) |
| **Safe to remove?** | NO — store preferences are legitimately local UI state | NO — business settings are backend-backed |

**Analysis:** These are NOT true duplicates. `adminSettings.js` now only manages UI preferences (compact tables, filter states, theme, motion, etc.) which are legitimately browser-local. `settingsService.js` manages business settings via MongoDB. No merge needed.

### E-2: api.js vs wishlistService.js (RESOLVED)
| | api.js | wishlistService.js |
|---|---|---|
| **Authority** | localStorage (cart only) | MongoDB/API |
| **Used by** | StoreContext (cart CRUD) | StoreContext (wishlist) |
| **Status** | KEEP (cart is intentionally local) | KEEP (wishlist is backend) |

**Analysis:** Not a duplicate. Cart is intentionally local (guest cart → auth → checkout). Wishlist is backend-backed per customer.

### E-3: storage.js vs api.js localStorage helpers
| | storage.js | api.js |
|---|---|---|
| **Purpose** | Generic localStorage abstraction | Cart/wishlist storage |
| **Consumers** | api.js, adminSettings.js, dataStore.js | StoreContext |
| **Status** | KEEP (utility) | KEEP (cart) |

**Analysis:** storage.js is a utility; api.js uses it. Not a duplicate.

**CONCLUSION: No true duplicates remain.** All service files have distinct responsibilities.

---

## F. DEAD FILE CANDIDATES

### CONFIRMED SAFE TO DELETE
None. All tracked files have verified consumers or are configuration/documentation.

### NEEDS HUMAN REVIEW
- public/assets/aistudio/.gitignore — appears empty/unused
- .mongo-data/ — local MongoDB data, should be in .gitignore (check if it is)
- bun.lock — legacy Bun lockfile if project uses npm

### MUST KEEP
All other files.

---

## G. STORAGE — localStorage/sessionStorage INVENTORY

| Key | File | Purpose | Business/UI/Auth | Active | Can Remove? |
|---|---|---|---|---|---|
| flora_alchemy_cart | api.js | Guest cart items | UI (temporary) | YES | NO — intentional guest cart |
| flora_alchemy_admin_token | apiClient.js | Admin JWT token | Auth | YES | NO |
| flora_alchemy_customer_token | apiClient.js | Customer JWT token | Auth | YES | NO |
| flora_alchemy_admin_session | apiClient.js | Admin session marker | Auth | YES | NO |
| flora_alchemy_account | apiClient.js | Customer session marker | Auth | YES | NO |
| flora_alchemy_customer_session | authService.js | Customer session data | Auth | YES | NO |
| flora_alchemy_admin_general_settings | adminSettings.js | General settings (LEGACY?) | Business | MAYBE | REVIEW NEEDED |
| flora_alchemy_admin_store_preferences | adminSettings.js | Store preferences | UI | YES | NO — legitimate UI prefs |
| flora_alchemy_admin_users | adminSettings.js | Admin user roster | Business | MAYBE | REVIEW NEEDED |
| flora_alchemy_access_roster | adminSettings.js | Access/roles data | Business | MAYBE | REVIEW NEEDED |
| flora_alchemy_customers | dataStore.js? | Customer cache | Business | REVIEW | Should be API-only |
| flora_alchemy_inventory | dataStore.js? | Inventory cache | Business | REVIEW | Should be API-only |
| flora_alchemy_inventory_history | dataStore.js? | Inventory history cache | Business | REVIEW | Should be API-only |
| flora_alchemy_orders | dataStore.js? | Orders cache | Business | REVIEW | Should be API-only |
| flora_alchemy_products | dataStore.js? | Products cache | Business | REVIEW | Should be API-only |
| flora_alchemy_summary | dataStore.js? | Analytics cache | Business | REVIEW | Should be API-only |
| flora_alchemy_wishlist | api.js | Wishlist IDs (LEGACY?) | Business | NO | Should be API-only now |

**Key finding:** Several legacy localStorage keys from earlier phases may still exist in users' browsers but are no longer written by current code. The active business data flows through the API.

---

## H. ROUTES — Route → Component → Layout

### Customer Routes
| Route | Component | Layout | Auth Required |
|---|---|---|---|
| `/` | HomePage | Full (PromoBar+Navbar+Footer) | No |
| `/shop` | ShopPage | Full | No |
| `/product/:id` | ProductPage | Full | No |
| `/custom-gifts` | CustomGiftsPage | Full | No |
| `/collections` | CollectionsPage | Full | No |
| `/our-creations` | OurCreationsPage | Full | No |
| `/search` | SearchPage | Full | No |
| `/wishlist` | WishlistPage | Full | No |
| `/cart` | CartPage | Full | No |
| `/checkout` | CheckoutPage | Minimal (MinimalHeader) | Yes (auth gate) |
| `/login` | LoginPage | Minimal (MinimalHeader) | No |
| `/account` | AccountPage | Full | Yes |
| `/order-success/:orderId` | OrderSuccessPage | Full | No |
| `/order-success` | OrderSuccessPage | Full | No |
| `/order-tracking/:orderId` | OrderTrackingPage | Full | Yes (auth gate) |
| `/order-tracking` | OrderTrackingPage | Full | Yes (auth gate) |
| `*` | NotFoundPage | Full | No |

### Admin Routes
| Route | Component | Layout | Auth Required |
|---|---|---|---|
| `/admin` | → Redirect to /admin/dashboard | — | — |
| `/admin/login` | AdminLoginPage | None | No |
| `/admin/dashboard` | AdminDashboardPage | AdminLayout | Admin |
| `/admin/orders` | AdminOrdersPage | AdminLayout | Admin |
| `/admin/orders/:orderId` | AdminOrderDetailPage | AdminLayout | Admin |
| `/admin/orders/new` | AdminCreateOrderPage | AdminLayout | Admin |
| `/admin/products` | AdminProductsPage | AdminLayout | Admin |
| `/admin/products/:productId` | AdminProductDetailPage | AdminLayout | Admin |
| `/admin/products/new` | AdminCreateProductPage | AdminLayout | Admin |
| `/admin/collections` | AdminCollectionsPage | AdminLayout | Admin |
| `/admin/collections/:collectionId` | AdminCollectionDetailPage | AdminLayout | Admin |
| `/admin/customers` | AdminCustomersPage | AdminLayout | Admin |
| `/admin/customers/:customerId` | AdminCustomerDetailPage | AdminLayout | Admin |
| `/admin/inventory` | AdminInventoryPage | AdminLayout | Admin |
| `/admin/inventory/stock` | AdminStockManagementPage | AdminLayout | Admin |
| `/admin/inventory/adjust` | AdminStockAdjustmentPage | AdminLayout | Admin |
| `/admin/inventory/low-stock` | AdminLowStockPage | AdminLayout | Admin |
| `/admin/inventory/history` | AdminInventoryHistoryPage | AdminLayout | Admin |
| `/admin/analytics` | AdminAnalyticsOverviewPage | AdminLayout | Admin |
| `/admin/analytics/sales` | AdminSalesRevenuePage | AdminLayout | Admin |
| `/admin/analytics/performance` | AdminPerformancePage | AdminLayout | Admin |
| `/admin/settings` | AdminGeneralSettingsPage | AdminLayout | Admin |
| `/admin/settings/commerce` | AdminCommerceSettingsPage | AdminLayout | Admin |
| `/admin/access` | AdminAccessPage | AdminLayout | Admin |
| `/admin/settings/notifications` | AdminNotificationsPage | AdminLayout | Admin |
| `/admin/store-preferences` | AdminStorePreferencesPage | AdminLayout | Admin |

**Total routes:** 17 customer + 25 admin = **42 routes**

---

## I. SERVICES — Service → Consumers → API

| Service | Functions | Consumers | Backend API | Status |
|---|---|---|---|---|
| **productService.js** | getProducts, getProductById, createProduct, updateProduct, deleteProduct, isCatalogueProduct, fromApiProduct | HomePage, ShopPage, ProductPage, SearchPage, AdminProductsPage, AdminProductDetailPage, AdminCreateProductPage, AdminCollectionsPage, AdminPerformancePage, AdminDashboardPage, StoreContext, AdminHeader, ProductCard | /products, /products/:id | ACTIVE |
| **collectionService.js** | getCollections, getCollectionById, getCollectionProducts, createCollection, updateCollection, deleteCollection | CollectionsPage, AdminCollectionsPage, AdminCollectionDetailPage, AdminHeader | /collections, /collections/:id | ACTIVE |
| **orderService.js** | getOrders, getMyOrders, getOrderById, createOrder, createAdminOrder, updateOrderStatus, getStatusLabel, getStatusDescription, getStatusStage, getCustomerFacingStatus, getStatusCounts, formatINR, formatDate, ORDER_STATUSES, ORDER_STATUS_STYLES | CheckoutPage, OrderSuccessPage, OrderTrackingPage, AccountPage, AdminOrdersPage, AdminOrderDetailPage, AdminCreateOrderPage, AdminDashboardPage, AdminCustomersPage, AdminCustomerDetailPage, AdminAnalyticsOverviewPage, AdminPerformancePage, AdminSalesRevenuePage, AdminHeader, OrderStatusTracker | /orders, /orders/mine, /orders/:id, /orders/:id/status, /orders/admin | ACTIVE |
| **inventoryService.js** | getInventory, getInventoryItem, getLowStockItems, getCriticalStockItems, adjustInventory, validateStock | AdminInventoryPage, AdminInventoryHistoryPage, AdminLowStockPage, AdminStockAdjustmentPage, AdminStockManagementPage, AdminProductsPage, AdminProductDetailPage, AdminDashboardPage, CheckoutPage | /inventory, /inventory/:productId, /inventory/:productId/adjust, /inventory/history | ACTIVE |
| **customerService.js** | getCustomers, getCustomerById, getCustomerByEmail, createCustomer, updateCustomer, getActiveCustomer, getActiveCustomerId, addAddress, updateAddress, deleteAddress, apiLogin, apiRegister, apiLogout, getAccount | LoginPage, AccountPage, Navbar, CheckoutPage, OrderTrackingPage, WishlistPage, AdminCustomersPage, AdminCustomerDetailPage, AdminCreateOrderPage, AdminOrderDetailPage, AdminAnalyticsOverviewPage, AdminPerformancePage, AdminHeader, AdminOrdersPage, StoreContext | /customers, /customers/:id, /customers/me/addresses, /auth/login, /auth/register, /auth/logout, /auth/me | ACTIVE |
| **analyticsService.js** | getAnalyticsSummary, getStatusCounts, getRevenueByPeriod, getProductPerformance, getCustomerPerformance | AdminAnalyticsOverviewPage, AdminSalesRevenuePage, AdminPerformancePage, AdminDashboardPage | /analytics/overview, /analytics/sales, /analytics/performance | ACTIVE |
| **settingsService.js** | getSettings, updateSettings, resetSettings, getShippingCost, isStoreOpen | AdminGeneralSettingsPage, AdminCommerceSettingsPage, AdminNotificationsPage, CheckoutPage | /settings | ACTIVE |
| **wishlistService.js** | getWishlist, addToWishlist, removeFromWishlist, clearWishlist | StoreContext, WishlistPage, ProductCard | /wishlist, /wishlist/:productId | ACTIVE |
| **paymentService.js** | getPaymentMethods, getPaymentMethodById, preparePayment | CheckoutPage | None (local only) | ACTIVE |
| **authService.js** | getCustomerSession, customerLogout, adminLogin, getAdminSession, adminLogout | AdminSessionContext, LoginPage | /auth/login, /auth/logout, /auth/register | ACTIVE |
| **apiClient.js** | getToken, setToken, clearToken, get (fetch wrapper) | All services | HTTP client | ACTIVE |
| **dataStore.js** | hydrateStore, getStore, subscribeStore, signalDataChanged, hasAdminSessionScope, hasCustomerSessionScope | DataContext, StoreContext | Aggregated from API | ACTIVE |
| **storage.js** | getStored, setStored, hasStored, clearStored, getStorageKeys | api.js, adminSettings.js, dataStore.js | None (localStorage) | ACTIVE |
| **api.js** | getCart, updateCart, addToCart, removeFromCart | StoreContext | None (localStorage cart) | ACTIVE |
| **adminSettings.js** | getStorePreferences, saveStorePreferences, resetStorePreferences, getAdminUsers, saveAdminUsers | AdminStorePreferencesPage, AdminAccessPage | None (localStorage) | ACTIVE |

---

## J. BACKEND — Backend Directory Audit

### Models (10)
| Model | Purpose | Indexed | Frontend Consumer |
|---|---|---|---|
| User.js | Auth identity (email, passwordHash, role) | email | authService, customerService |
| Customer.js | Business profile (name, phone, addresses) | email | customerService |
| Product.js | Catalog (name, sku, price, stock, image) | slug, sku | productService |
| Collection.js | Product groups | name | collectionService |
| Order.js | Canonical orders | customerId, orderNumber | orderService |
| Inventory.js | Stock levels | productSlug | inventoryService |
| InventoryMovement.js | Stock audit trail | productSlug, createdAt | inventoryService |
| Wishlist.js | Customer wishlists | customerId | wishlistService |
| Settings.js | Store config singleton | — | settingsService |
| Notification.js | Notification records | — | NONE (unused frontend) |

### Controllers (9)
All endpoints match frontend service consumers. No orphaned controllers.

### Routes (9)
All routes properly protected with authMiddleware. No orphaned routes.

### Services (3)
- orderService.js — order creation + lifecycle
- inventoryService.js — stock operations
- analyticsService.js — dashboard computations

### Middleware (2)
- authMiddleware.js — JWT verification + role checking
- errorMiddleware.js — error formatting

### Scripts
- api-smoke.mjs — 119 test assertions (TEST-ONLY)
- seed/seed.js — database seeder (SEED-ONLY)

**Backend structure is clean.** No orphaned files, no missing implementations.

---

## K. ASSETS — Asset Usage

### Active Images (17 of 27)
- flora-asset-01.jpg — product fallback, seed data
- flora-asset-03.jpg — custom gifts, seed
- flora-asset-06.jpg — collections, our creations, seed
- flora-asset-09.jpg — custom gifts, collections, our creations, seed
- flora-asset-10.jpg — collection fallback, seed
- flora-asset-11.jpg — custom gifts, collections, our creations
- flora-asset-13.jpg — homepage
- flora-asset-14.jpg — collections
- flora-asset-16.jpg — our creations
- flora-asset-21.jpg — our creations
- flora-asset-25.jpg — homepage
- flora-asset-26.jpg — our creations
- flora-asset-27.jpg — logo (Navbar, Footer, MinimalHeader, LoginPage)
- flora-asset-02.jpg, 04, 05, 07, 08 — seed data only (referenced via MongoDB, not direct import)

### Unused Images (10)
- flora-asset-12.jpg, 15, 17, 18, 19, 20, 22, 23, 24 — no frontend references

---

## L. PACKAGE DEPENDENCIES

### Frontend (package.json)
| Dependency | Used? | Notes |
|---|---|---|
| @google/genai | YES | Used in BotanicalCanvas 3D component |
| @tailwindcss/vite | YES | Vite plugin |
| @vitejs/plugin-react | YES | Vite plugin |
| dotenv | POSSIBLY | May not be needed in Vite (uses VITE_ prefix) |
| express | SHOULD MOVE | Backend dependency in root package.json |
| lucide-react | YES | Icons throughout |
| motion | YES | Animations |
| react | YES | Core |
| react-dom | YES | Core |
| react-router-dom | YES | Routing |

**Note:** `express` in root package.json is unnecessary — it's a backend dependency.

### Backend (backend/package.json)
| Dependency | Used? | Notes |
|---|---|---|
| bcryptjs | YES | Password hashing |
| cors | YES | CORS config |
| dotenv | YES | Environment loading |
| express | YES | Server |
| jsonwebtoken | YES | JWT auth |
| mongoose | YES | MongoDB ODM |

**Backend is clean.**

---

## M. PROPOSED STRUCTURE

### OPTION A: Keep Current Structure (RECOMMENDED)
```
/
├── backend/           ← Express + MongoDB (already self-contained)
├── src/               ← React frontend (already clean)
│   ├── components/    ← Shared + admin components
│   ├── context/       ← React context providers
│   ├── pages/         ← Customer pages + admin/ subdirectory
│   ├── services/      ← Business logic services
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── public/            ← Static assets
├── .freebuff/         ← Dev tooling
├── package.json       ← Frontend dependencies
├── vite.config.js     ← Build config
└── index.html         ← Entry point
```

**Benefits:**
- Zero file moves
- Zero import changes
- Zero build/config changes
- Current structure is already clean and well-organized
- Clear separation: `backend/` for server, `src/` for client

**Risks:**
- None — this is the current state

### OPTION B: Move Frontend into frontend/
```
/
├── backend/           ← Express + MongoDB
├── frontend/          ← React app
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
├── .freebuff/         ← Dev tooling
└── package.json       ← Root (or remove)
```

**Benefits:**
- Explicit monorepo separation
- Clearer "two apps" mental model

**Risks:**
- 100+ file moves
- All import paths break (relative to src/)
- vite.config.js paths change
- index.html location changes
- .freebuff scripts reference current paths
- Backend .env and config unaffected but perception changes
- No functional benefit — current structure already works

---

## N. RECOMMENDATION

**OPTION A — KEEP CURRENT STRUCTURE**

The current repository structure is already clean and well-organized:

1. **backend/** is completely self-contained with its own package.json, config, and entry point
2. **src/** has a clean component/page/service/context separation
3. **src/pages/admin/** clearly separates admin pages from customer pages
4. **Services have single responsibilities** — no true duplicates
5. **All 42 routes map cleanly to page components**
6. **Backend has 10 models, 9 controllers, 9 routes, 3 services** — well-structured

The only issues found are:
1. A few legacy localStorage keys may persist in old browser sessions (harmless)
2. 10 unused image assets (trivial cleanup)
3. `express` listed in root package.json (should be backend-only)
4. `bun.lock` is legacy if using npm

None of these require restructuring.

---

## O. CHANGE PLAN — IF APPROVED

### Safe Deletions (Phase 2 — AFTER APPROVAL)
1. Delete 10 unused images: flora-asset-12, 15, 17, 18, 19, 20, 22, 23, 24
2. Remove `express` from root package.json dependencies

### Potential Cleanup (Low Priority)
1. Remove bun.lock if project uses npm exclusively
2. Add legacy localStorage keys to a cleanup note in documentation
3. Extend Notification model with actual consumer when ready

### DO NOT MOVE
- Do not move frontend into frontend/
- Do not reorganize src/ subdirectories
- Do not restructure backend/
- Do not change any imports

---

**FINAL STATUS: FLORA ALCHEMY — REPOSITORY STRUCTURE AUDIT COMPLETE — AWAITING APPROVAL**

The repository is in good structural shape. The recommended path is to keep the current structure and focus effort on feature completion (payment integration, email, etc.) rather than reorganization.
