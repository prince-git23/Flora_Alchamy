import { Router } from 'express';
import { protect, adminOrHandler } from '../middleware/authMiddleware.js';
import { uploadMiddleware, uploadProductImage } from '../controllers/uploadController.js';

const router = Router();

// Product image upload — staff only. Multipart handled by multer; validation
// (type + size) happens in the controller/multer filter.
router.post('/product-image', protect, adminOrHandler, uploadMiddleware.single('image'), uploadProductImage);

export default router;
