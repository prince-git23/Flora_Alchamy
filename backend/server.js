import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { connectDB } from './config/db.js';
import { errorHandler, notFoundHandler } from './middleware/errorMiddleware.js';
import {
  paymentLimiter,
  uploadLimiter,
  notificationLimiter,
  webhookLimiter,
  apiWriteLimiter,
  REQUEST_BODY_LIMIT,
} from './middleware/securityMiddleware.js';
import authRoutes from './routes/authRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import productRoutes from './routes/productRoutes.js';
import collectionRoutes from './routes/collectionRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import inventoryRoutes from './routes/inventoryRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import wishlistRoutes from './routes/wishlistRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import conversationRoutes from './routes/conversationRoutes.js';
import customRequestRoutes from './routes/customRequestRoutes.js';
import adminUserRoutes from './routes/adminUserRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import { seedIfEmpty } from './seed/seed.js';

const app = express();

// Behind a reverse proxy, trust the proxy's X-Forwarded-For so rate limiting
// sees real client IPs. Disabled in direct exposure to prevent IP spoofing.
if (process.env.TRUST_PROXY === 'true') {
  app.set('trust proxy', 1);
}

// ── Security headers (Helmet) ────────────────────────────────────────────
// The API serves JSON only — CSP can be locked down hard. crossOriginResource
// and crossOriginEmbedder are left off because the Vite frontend and Razorpay
// Checkout load cross-origin resources.
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'", 'https:'],
        frameAncestors: ["'none'"],
      },
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// ── CORS — explicit allowlist, never wildcard for an auth-bearing API ────
// Development defaults to localhost origins; production MUST configure
// CORS_ORIGIN (see backend/.env.example). Non-browser clients (curl, node
// smoke tests) send no Origin header and are allowed through.
const corsOrigins = (process.env.CORS_ORIGIN || 'http://localhost:3000,http://127.0.0.1:3000')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, cb) {
      if (!origin || corsOrigins.includes(origin)) return cb(null, true);
      return cb(new Error(`Origin ${origin} not allowed by CORS`));
    },
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 86400,
  })
);
// Capture the raw body for the payment webhook signature check while still
// parsing JSON normally (verify runs before body parsing).
app.use(
  express.json({
    limit: REQUEST_BODY_LIMIT,
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  })
);

// Health / diagnostics
app.get('/api/health', (_req, res) => {
  res.json({ success: true, service: 'flora-alchemy-api', status: 'ok', time: new Date().toISOString() });
});

// ── Rate-limited route mounting ──────────────────────────────────────
// Auth endpoints carry their own granular limiters inside authRoutes
// (failed-login brute-force control on /login, register cap on /register).
// Moderate on payments/uploads/notifications, generous on public catalogue
// reads (products/collections stay unlimited so browsing is never throttled).
app.use('/api/auth', authRoutes);
app.use('/api/customers', apiWriteLimiter, customerRoutes);
app.use('/api/orders', apiWriteLimiter, orderRoutes);
app.use('/api/products', productRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api/inventory', apiWriteLimiter, inventoryRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/wishlist', apiWriteLimiter, wishlistRoutes);
app.use('/api/payments', paymentLimiter, paymentRoutes);
app.use('/api/conversations', apiWriteLimiter, conversationRoutes);
app.use('/api/custom-requests', apiWriteLimiter, customRequestRoutes);
app.use('/api/admin/users', apiWriteLimiter, adminUserRoutes);
app.use('/api/notifications', notificationLimiter, notificationRoutes);
app.use('/api/uploads', uploadLimiter, uploadRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

// The hosting harness may inject PORT=0 ("pick a free port"); treat any
// non-positive value as unset so backend/.env controls the port.
const PORT = Number(process.env.PORT) > 0 ? Number(process.env.PORT) : 4000;

async function main() {
  try {
    await connectDB();
    console.log('[db] connected to MongoDB');

    if (process.env.SEED_ON_START === 'true') {
      const created = await seedIfEmpty();
      console.log(`[seed] fixtures ensured (${created} created)`);
    }

    app.listen(PORT, () => {
      console.log(`[server] Flora Alchemy API listening on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('[server] failed to start:', err.message);
    process.exit(1);
  }
}

main();
