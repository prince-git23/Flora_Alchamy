import { Router } from 'express';
import { protect, adminOrHandler } from '../middleware/authMiddleware.js';
import {
  listNotifications,
  unreadCount,
  markRead,
  markAllRead,
} from '../controllers/notificationController.js';

const router = Router();

// Notifications are per-authenticated-user; staff and customers both may read
// their own feed. Creation happens server-side from real business events.
router.get('/', protect, listNotifications);
router.get('/unread-count', protect, unreadCount);
router.patch('/:id/read', protect, markRead);
router.patch('/read-all', protect, markAllRead);

export default router;
