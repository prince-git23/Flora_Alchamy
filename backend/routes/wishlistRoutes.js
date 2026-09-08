import { Router } from 'express';
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
} from '../controllers/wishlistController.js';
import { protect, requireRole } from '../middleware/authMiddleware.js';

const router = Router();

// Every wishlist route requires an authenticated customer (handler/admin
// accounts have no customer wishlist).
router.use(protect, requireRole('customer'));

router.get('/', getWishlist);
router.post('/:productId', addToWishlist);
router.delete('/:productId', removeFromWishlist);
router.delete('/', clearWishlist);

export default router;