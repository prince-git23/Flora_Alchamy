import { Router } from 'express';
import {
  overview,
  byProduct,
  history,
  adjust,
} from '../controllers/inventoryController.js';
import { protect, adminOrHandler } from '../middleware/authMiddleware.js';

const router = Router();

router.use(protect, adminOrHandler);

router.get('/', overview);
router.get('/history', history);
router.get('/:productId', byProduct);
router.post('/:productId/adjust', adjust);

export default router;
