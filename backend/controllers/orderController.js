import Order, { NEXT_STATUS } from '../models/Order.js';
import Customer from '../models/Customer.js';
import User from '../models/User.js';
import { ApiError } from '../middleware/errorMiddleware.js';
import { assertValidTransition, createOrder } from '../services/orderService.js';
import { createNotification } from './notificationController.js';

export async function listOrders(req, res, next) {
  try {
    const { status, q } = req.query;
    const match = {};
    if (status && status !== 'All') match.orderStatus = status;
    if (q) {
      const regex = { $regex: String(q), $options: 'i' };
      match.$or = [
        { orderId: regex },
        { customerName: regex },
        { customerEmail: regex },
      ];
    }
    const orders = await Order.find(match).sort({ createdAt: -1 }).limit(500);
    res.json({ success: true, orders });
  } catch (err) {
    next(err);
  }
}

export async function listMyOrders(req, res, next) {
  try {
    const orders = await Order.find({
      customerId: req.user.customerId,
    }).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (err) {
    next(err);
  }
}

export async function getOrder(req, res, next) {
  try {
    const order = await Order.findOne({ orderId: req.params.id });
    if (!order) {
      throw new ApiError(404, 'Order not found.', 'ORDER_NOT_FOUND');
    }
    // Customer can only read their own order; staff can read all.
    const isStaff = ['admin', 'handler'].includes(req.user.role);
    if (!isStaff && String(order.customerId) !== String(req.user.customerId || '')) {
      // Do not leak existence to other customers.
      throw new ApiError(404, 'Order not found.', 'ORDER_NOT_FOUND');
    }
    res.json({ success: true, order });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/orders — customer-only. Identity comes from the JWT; a client
 * supplied customerId is ignored. Prices/totals are recomputed server-side.
 */
export async function createCustomerOrder(req, res, next) {
  try {
    if (req.user.role !== 'customer' || !req.user.customerId) {
      throw new ApiError(403, 'Only authenticated customers can place orders.', 'FORBIDDEN');
    }
    const Customer = (await import('../models/Customer.js')).default;
    const customer = await Customer.findById(req.user.customerId);
    if (!customer) {
      throw new ApiError(404, 'Customer profile not found.', 'NOT_FOUND');
    }

    const { items, paymentMethod, shippingAddress, giftMessage, isRush } = req.body || {};
    const order = await createOrder({
      customer,
      items,
      paymentMethod,
      shippingAddress,
      giftMessage,
      isRush,
    });

    // Generate notification for admin/handler
    const staffUsers = await User.find({ role: { $in: ['admin', 'handler'] } }).select('_id role');
    for (const staff of staffUsers) {
      await createNotification({
        userId: staff._id,
        role: staff.role,
        type: 'new_order',
        title: `New order ${order.orderId}`,
        message: `${customer.name} placed an order for ₹${order.total.toLocaleString('en-IN')}.`,
        entityType: 'order',
        entityId: order._id,
        link: `/admin/orders/${order.orderId}`,
      });
    }

    res.status(201).json({ success: true, order });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/orders/admin — handler/admin creates an order for a chosen
 * existing customer (e.g. phone order). The customer must exist; prices and
 * totals are still recomputed server-side and inventory is deducted
 * transactionally. A handler can never impersonate a customer for their own
 * account operations — this is an explicit staff action on a verified customer.
 */
export async function createStaffOrder(req, res, next) {
  try {
    const { customerId, items, shippingAddress, giftMessage, paymentMethod, isRush } = req.body || {};
    if (!customerId) {
      throw new ApiError(422, 'A customer must be selected for this order.', 'VALIDATION_ERROR');
    }
    const customer = await Customer.findById(customerId);
    if (!customer) {
      throw new ApiError(404, 'Customer not found.', 'NOT_FOUND');
    }
    // Staff orders are recorded business transactions (e.g. a phone order) with
    // no customer-facing payment flow — they never enter Razorpay 'Pending'
    // limbo and always keep the prototype 'Sample' settlement marker.
    const order = await createOrder({
      customer,
      items,
      shippingAddress,
      giftMessage,
      paymentMethod: paymentMethod === 'UPI' ? 'Sample' : paymentMethod,
      isRush,
      forceSamplePayment: true,
      allowLegacyPricing: true,
    });
    res.status(201).json({ success: true, order });
  } catch (err) {
    next(err);
  }
}

/**
 * PATCH /api/orders/:id/status — handler/admin only; forward transitions only.
 */
export async function updateOrderStatus(req, res, next) {
  try {
    const order = await Order.findOne({ orderId: req.params.id });
    if (!order) {
      throw new ApiError(404, 'Order not found.', 'ORDER_NOT_FOUND');
    }
    const { status } = req.body || {};
    if (!status) {
      throw new ApiError(422, 'A target status is required.', 'VALIDATION_ERROR');
    }
    const nextStatus = String(status).toLowerCase();
    assertValidTransition(order, nextStatus);

    order.orderStatus = nextStatus;
    order.statusHistory.push({
      status: nextStatus,
      note: req.body.note || '',
      changedBy: req.user.name || req.user.email,
    });
    order.updatedAt = new Date();
    await order.save();

    // Notify customer of status change
    if (order.customerId) {
      await createNotification({
        userId: order.customerId,
        role: 'customer',
        type: 'order_status_change',
        title: `Order ${order.orderId} updated`,
        message: `Your order status has been updated to ${nextStatus}.`,
        entityType: 'order',
        entityId: order._id,
        link: `/order-tracking/${order.orderId}`,
      });
    }

    res.json({ success: true, order, availableNext: NEXT_STATUS[nextStatus] || null });
  } catch (err) {
    next(err);
  }
}
