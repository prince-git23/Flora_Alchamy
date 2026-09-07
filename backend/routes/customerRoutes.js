import { Router } from 'express';
import {
  listCustomers,
  getCustomer,
  getMyProfile,
  updateCustomer,
} from '../controllers/customerController.js';
import { protect, adminOrHandler } from '../middleware/authMiddleware.js';

const router = Router();

router.use(protect);

// Own profile (must be declared before /:id).
router.get('/me', getMyProfile);

// Staff-only collection listing (handler portal customer list).
router.get('/', adminOrHandler, listCustomers);

// Detail: owner (customer) or staff; controller enforces ownership.
router.get('/:id', getCustomer);

// Update: owner or staff; controller enforces ownership.
router.patch('/:id', updateCustomer);

export default router;
