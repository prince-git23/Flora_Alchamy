import Notification from '../models/Notification.js';

/**
 * GET /api/notifications
 * List notifications for the current user. Supports ?unread=true filter.
 */
export async function listNotifications(req, res) {
  try {
    const { unread } = req.query;
    const filter = { userId: req.user._id };
    if (unread === 'true') filter.read = false;
    const notifications = await Notification.find(filter)
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();
    const unreadCount = await Notification.countDocuments({ userId: req.user.id, read: false });
    res.json({ notifications, unreadCount });
  } catch (err) {
    console.error('listNotifications error:', err);
    res.status(500).json({ message: 'Failed to load notifications.' });
  }
}

/**
 * GET /api/notifications/unread-count
 * Lightweight endpoint for badge polling.
 */
export async function unreadCount(req, res) {
  try {
    const count = await Notification.countDocuments({ userId: req.user._id, read: false });
    res.json({ unreadCount: count });
  } catch (err) {
    console.error('unreadCount error:', err);
    res.status(500).json({ message: 'Failed to count notifications.' });
  }
}

/**
 * PATCH /api/notifications/:id/read
 * Mark a single notification as read.
 */
export async function markRead(req, res) {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { read: true, readAt: new Date() },
      { new: true },
    );
    if (!notification) return res.status(404).json({ message: 'Notification not found.' });
    const unreadCount = await Notification.countDocuments({ userId: req.user.id, read: false });
    res.json({ notification, unreadCount });
  } catch (err) {
    console.error('markRead error:', err);
    res.status(500).json({ message: 'Failed to update notification.' });
  }
}

/**
 * PATCH /api/notifications/read-all
 * Mark all notifications as read.
 */
export async function markAllRead(req, res) {
  try {
    await Notification.updateMany(
      { userId: req.user._id, read: false },
      { read: true, readAt: new Date() },
    );
    res.json({ unreadCount: 0 });
  } catch (err) {
    console.error('markAllRead error:', err);
    res.status(500).json({ message: 'Failed to update notifications.' });
  }
}

/**
 * Helper: create a notification. Called from other controllers/services.
 */
export async function createNotification({ userId, role, type, title, message, entityType, entityId, link }) {
  try {
    return await Notification.create({
      userId, role, type, title, message,
      entityType: entityType || null,
      entityId: entityId || null,
      link: link || null,
    });
  } catch (err) {
    console.error('createNotification error:', err);
    return null; // Non-critical — don't break business flow
  }
}
