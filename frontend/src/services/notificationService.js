import api from './apiClient.js';

/**
 * GET /api/notifications
 * Returns { notifications: [...], unreadCount: number }
 */
export async function fetchNotifications(unreadOnly = false) {
  const params = unreadOnly ? '?unread=true' : '';
  const res = await api.get(`/notifications${params}`, { scope: 'customer' });
  if (!res.ok) throw new Error(res.message || 'Failed to load notifications.');
  return res.data;
}

/**
 * GET /api/notifications/unread-count
 * Lightweight polling endpoint.
 */
export async function fetchUnreadCount() {
  const res = await api.get('/notifications/unread-count', { scope: 'customer' });
  if (!res.ok) throw new Error(res.message || 'Failed to count notifications.');
  return res.data.unreadCount ?? 0;
}

/**
 * PATCH /api/notifications/:id/read
 */
export async function markNotificationRead(id) {
  const res = await api.patch(`/notifications/${id}/read`, {}, { scope: 'customer' });
  if (!res.ok) throw new Error(res.message || 'Failed to update notification.');
  return res.data;
}

/**
 * PATCH /api/notifications/read-all
 */
export async function markAllNotificationsRead() {
  const res = await api.patch('/notifications/read-all', {}, { scope: 'customer' });
  if (!res.ok) throw new Error(res.message || 'Failed to update notifications.');
  return res.data;
}
