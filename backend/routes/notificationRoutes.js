import { Router } from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import {
  listNotifications,
  unreadCount,
  markRead,
  markAllRead,
} from '../controllers/notificationController.js';

const router = Router();

router.get('/', authenticate, listNotifications);
router.get('/unread-count', authenticate, unreadCount);
router.patch('/:id/read', authenticate, markRead);
router.patch('/read-all', authenticate, markAllRead);

export default router;
