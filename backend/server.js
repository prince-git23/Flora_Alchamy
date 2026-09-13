import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import { errorHandler, notFoundHandler } from './middleware/errorMiddleware.js';
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
import { seedIfEmpty } from './seed/seed.js';

const app = express();

// CORS — allow the configured dev origins only.
const origins = (process.env.CORS_ORIGIN || 'http://localhost:3000,http://127.0.0.1:3000')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, cb) {
      // Allow non-browser clients (curl/node smoke tests) with no Origin.
      if (!origin || origins.includes(origin)) return cb(null, true);
      return cb(new Error(`Origin ${origin} not allowed by CORS`));
    },
  })
);
// Capture the raw body for the payment webhook signature check while still
// parsing JSON normally (verify runs before body parsing).
app.use(
  express.json({
    limit: '1mb',
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  })
);

// Health / diagnostics
app.get('/api/health', (_req, res) => {
  res.json({ success: true, service: 'flora-alchemy-api', status: 'ok', time: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/products', productRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/custom-requests', customRequestRoutes);
app.use('/api/admin/users', adminUserRoutes);
app.use('/api/notifications', notificationRoutes);

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
