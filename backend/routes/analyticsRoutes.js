import { Router } from 'express';
import { overview, sales, performance } from '../controllers/analyticsController.js';
import { protect, adminOrHandler } from '../middleware/authMiddleware.js';

const router = Router();

router.use(protect, adminOrHandler);

router.get('/overview', overview);
router.get('/sales', sales);
router.get('/performance', performance);

export default router;
