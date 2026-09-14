import { Router } from 'express';
import {
  createPaymentOrder,
  verifyPayment,
  getPaymentStatus,
  handlePaymentWebhook,
} from '../controllers/paymentController.js';
import { protect, adminOrHandler } from '../middleware/authMiddleware.js';
import { webhookLimiter } from '../middleware/securityMiddleware.js';

const router = Router();

// Provider callback — verified by HMAC webhook signature, NOT a user session.
// Rate limited separately: forged floods are cheap to reject before HMAC work.
router.post('/webhook', webhookLimiter, handlePaymentWebhook);

// Authenticated customer/staff payment operations.
router.use(protect);

// Customer initiates payment for their own order (controller enforces owner).
router.post('/create-order', createPaymentOrder);
router.post('/verify', verifyPayment);

// Owner (customer) or staff can inspect payment state.
router.get('/:orderId/status', getPaymentStatus);

export default router;