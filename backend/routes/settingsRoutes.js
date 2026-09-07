import { Router } from 'express';
import { getSettings, updateSettings } from '../controllers/settingsController.js';
import { protect, adminOrHandler } from '../middleware/authMiddleware.js';

const router = Router();

// Public: storefront reads currency/shipping/availability config.
router.get('/', getSettings);

// Staff writes.
router.patch('/', protect, adminOrHandler, updateSettings);

export default router;
