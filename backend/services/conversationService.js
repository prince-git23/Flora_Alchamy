import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
import Order from '../models/Order.js';
import User from '../models/User.js';
import { ApiError } from '../middleware/errorMiddleware.js';
import { createNotification, createNotificationsForUsers } from '../controllers/notificationController.js';

/**
 * conversationService — order-linked customer ↔ handler text chat.
 *
 * Ownership is always derived server-side from the authenticated user;
 * no client-supplied customerId or senderRole is ever trusted.
 */

// ─── Conversation ─────────────────────────────────────────────────────

/**
 * Get or create the conversation for a given order.
 * Enforces: one conversation per order/customer pair.
 */
export async function getOrCreateConversation({ orderId, user }) {
  const order = await Order.findOne({ orderId });
  if (!order) {
    throw new ApiError(404, 'Order not found.', 'NOT_FOUND');
  }

  // Customers can only access their own order conversations.
  if (user.role === 'customer') {
    if (String(order.customerId) !== String(user.customerId)) {
      throw new ApiError(403, 'You do not have access to this order conversation.', 'FORBIDDEN');
    }
  }
  // Admin/handler may access any order conversation (existing RBAC already gates the route).

  const conversation = await Conversation.findOneAndUpdate(
    { orderId, customerId: order.customerId },
    { $setOnInsert: { orderId, customerId: order.customerId, status: 'open' } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  return { conversation, order };
}

/**
 * Get conversation for an order (returns null if none exists).
 */
export async function getConversationForOrder({ orderId, user }) {
  const order = await Order.findOne({ orderId });
  if (!order) {
    throw new ApiError(404, 'Order not found.', 'NOT_FOUND');
  }

  if (user.role === 'customer') {
    if (String(order.customerId) !== String(user.customerId)) {
      throw new ApiError(403, 'You do not have access to this order conversation.', 'FORBIDDEN');
    }
  }

  const conversation = await Conversation.findOne({ orderId, customerId: order.customerId });
  return { conversation, order };
}

// ─── Messages ─────────────────────────────────────────────────────────

/**
 * List messages for a conversation (newest-last, with pagination).
 */
export async function getMessages({ conversationId, user, before, limit = 50 }) {
  const conversation = await Conversation.findById(conversationId);
  if (!conversation) {
    throw new ApiError(404, 'Conversation not found.', 'NOT_FOUND');
  }

  // Ownership check
  if (user.role === 'customer') {
    if (String(conversation.customerId) !== String(user._id) &&
        String(conversation.customerId) !== String(user.customerId)) {
      throw new ApiError(403, 'Access denied.', 'FORBIDDEN');
    }
  }

  const query = { conversationId };
  if (before) query.createdAt = { $lt: new Date(before) };

  const messages = await Message.find(query)
    .sort({ createdAt: -1 })
    .limit(Math.min(limit, 100))
    .lean();

  return messages.reverse(); // oldest-first for display
}

/**
 * Send a message in a conversation.
 * Server derives sender identity from the authenticated user.
 */
export async function sendMessage({ conversationId, body, user }) {
  if (!body || !body.trim()) {
    throw new ApiError(422, 'Message body is required.', 'VALIDATION_ERROR');
  }

  const conversation = await Conversation.findById(conversationId);
  if (!conversation) {
    throw new ApiError(404, 'Conversation not found.', 'NOT_FOUND');
  }

  if (conversation.status === 'closed') {
    throw new ApiError(409, 'This conversation is closed.', 'CONVERSATION_CLOSED');
  }

  // Ownership check
  if (user.role === 'customer') {
    if (String(conversation.customerId) !== String(user._id) &&
        String(conversation.customerId) !== String(user.customerId)) {
      throw new ApiError(403, 'Access denied.', 'FORBIDDEN');
    }
  }

  // Determine sender role from server-side user object
  const senderRole = ['admin', 'handler'].includes(user.role) ? user.role : 'customer';
  const senderName = user.name || user.email || (senderRole === 'customer' ? 'Customer' : 'Flora Alchemy');

  const message = await Message.create({
    conversationId,
    senderUserId: user._id,
    senderRole,
    senderName,
    body: body.trim(),
    readBy: [user._id],
  });

  // Update conversation metadata
  await Conversation.findByIdAndUpdate(conversationId, {
    $set: { lastMessageAt: message.createdAt },
    $inc: { unreadCount: 1 },
  });

  // Notify the other party
  const order = await Order.findOne({ orderId: conversation.orderId }).select('orderId customerName').lean();
  if (senderRole === 'customer') {
    // Notify all staff — batched insertMany (Phase 17 N+1 fix).
    const staffUsers = await User.find({ role: { $in: ['admin', 'handler'] } }).select('_id role');
    await createNotificationsForUsers(staffUsers, {
      type: 'new_message',
      title: `New message from ${order?.customerName || 'customer'}`,
      message: body.trim().substring(0, 120),
      entityType: 'conversation',
      entityId: conversation._id,
      link: `/admin/conversations`,
    });
  } else {
    // Notify the customer
    await createNotification({
      userId: conversation.customerId,
      role: 'customer',
      type: 'new_message',
      title: `Flora Alchemy replied to order ${conversation.orderId}`,
      message: body.trim().substring(0, 120),
      entityType: 'conversation',
      entityId: conversation._id,
      link: `/order/${conversation.orderId}/conversation`,
    });
  }

  return message;
}

/**
 * Mark messages as read by a user.
 */
export async function markAsRead({ conversationId, user }) {
  const conversation = await Conversation.findById(conversationId);
  if (!conversation) {
    throw new ApiError(404, 'Conversation not found.', 'NOT_FOUND');
  }

  // Ownership check
  if (user.role === 'customer') {
    if (String(conversation.customerId) !== String(user._id) &&
        String(conversation.customerId) !== String(user.customerId)) {
      throw new ApiError(403, 'Access denied.', 'FORBIDDEN');
    }
  }

  // Mark all messages not yet read by this user
  await Message.updateMany(
    { conversationId, readBy: { $ne: user._id } },
    { $addToSet: { readBy: user._id } }
  );

  // Reset unread count for this conversation
  await Conversation.findByIdAndUpdate(conversationId, { $set: { unreadCount: 0 } });

  return { success: true };
}

/**
 * Update conversation status (open/close).
 */
export async function updateConversationStatus({ conversationId, status, user }) {
  if (!['open', 'closed'].includes(status)) {
    throw new ApiError(422, 'Status must be "open" or "closed".', 'VALIDATION_ERROR');
  }

  const conversation = await Conversation.findById(conversationId);
  if (!conversation) {
    throw new ApiError(404, 'Conversation not found.', 'NOT_FOUND');
  }

  // Only staff may close/reopen conversations
  if (!['admin', 'handler'].includes(user.role)) {
    throw new ApiError(403, 'Only staff may update conversation status.', 'FORBIDDEN');
  }

  await Conversation.findByIdAndUpdate(conversationId, { $set: { status } });
  return { success: true, status };
}

/**
 * Get unread conversation count for the dashboard indicator.
 */
export async function getUnreadCount({ user }) {
  // Admin/handler: count conversations with unread messages
  if (['admin', 'handler'].includes(user.role)) {
    const count = await Conversation.countDocuments({ unreadCount: { $gt: 0 } });
    return { count };
  }
  // Customer: count their conversations with unread messages
  const customerId = user.customerId || user._id;
  const count = await Conversation.countDocuments({ customerId, unreadCount: { $gt: 0 } });
  return { count };
}

/**
 * List conversations for a customer (only their own).
 */
export async function listMyConversations({ user, limit = 50 }) {
  const customerId = user.customerId || user._id;
  const conversations = await Conversation.find({ customerId })
    .sort({ lastMessageAt: -1 })
    .limit(limit)
    .lean();
  return conversations;
}

/**
 * List conversations for admin/handler (all conversations with last message).
 */
export async function listConversations({ user, status, limit = 50 }) {
  const query = {};
  if (status) query.status = status;

  const conversations = await Conversation.find(query)
    .sort({ lastMessageAt: -1 })
    .limit(limit)
    .lean();

  return conversations;
}
