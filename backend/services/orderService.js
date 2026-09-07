import Order, { ORDER_STATUSES, NEXT_STATUS } from '../models/Order.js';
import Product from '../models/Product.js';
import { ApiError } from '../middleware/errorMiddleware.js';
import { reserveStockForOrder } from './inventoryService.js';

export { ORDER_STATUSES };

let orderSeq = 1000 + Math.floor(Math.random() * 9000);

function nextOrderId() {
  orderSeq += 1;
  return `FA-${orderSeq}`;
}

function nextTracking(orderId) {
  return `FA-TRK-${orderId.replace('FA-', '')}`;
}

/**
 * Validate an order can move to newStatus (forward-only lifecycle).
 */
export function assertValidTransition(order, newStatus) {
  if (!ORDER_STATUSES.includes(newStatus)) {
    throw new ApiError(422, `Unknown order status "${newStatus}".`, 'VALIDATION_ERROR');
  }
  const currentIndex = ORDER_STATUSES.indexOf(order.orderStatus);
  const nextIndex = ORDER_STATUSES.indexOf(newStatus);
  if (nextIndex <= currentIndex) {
    throw new ApiError(
      422,
      `Cannot move order from ${order.orderStatus} back to ${newStatus} (lifecycle is forward-only).`,
      'INVALID_TRANSITION'
    );
  }
  return true;
}

/**
 * Create a canonical order.
 *
 * Security rules enforced here (the server is authoritative):
 *  - catalogue prices are re-read from the Product catalog (client price ignored)
 *  - shipping/total are recomputed server-side
 *  - inventory is reserved after order creation risk is cleared; the whole
 *    sequence runs inside a Mongoose session transaction.
 *  - made-to-order (custom, non-catalogue) items carry bespoke pricing and are
 *    not stock-tracked, preserving the Phase 3A.5 behavior.
 */
export async function createOrder({ customer, items, paymentMethod = 'Sample', shippingAddress, giftMessage = '', isRush = false }) {
  if (!customer) {
    throw new ApiError(401, 'An authenticated customer is required to place an order.', 'UNAUTHORIZED');
  }
  if (!Array.isArray(items) || items.length === 0) {
    throw new ApiError(422, 'An order must contain at least one item.', 'VALIDATION_ERROR');
  }

  const session = await Order.startSession();
  let order;
  try {
    session.startTransaction();

    const normalized = [];
    let subtotal = 0;
    for (const item of items) {
      const quantity = Math.floor(Number(item.quantity));
      if (!quantity || quantity < 1) {
        throw new ApiError(422, `Invalid quantity for "${item.name}".`, 'VALIDATION_ERROR');
      }

      if (item.productSlug) {
        const product = await Product.findOne({ slug: item.productSlug }).session(session);
        if (!product) {
          throw new ApiError(404, `Product "${item.productSlug}" no longer exists.`, 'PRODUCT_NOT_FOUND');
        }
        // Server-authoritative price.
        const price = product.price;
        const line = {
          productSlug: product.slug,
          name: item.name || product.name,
          price,
          quantity,
          image: product.image,
          category: product.category,
          palette: item.palette || product.palette || '',
          ribbon: item.ribbon || product.ribbon || '',
          giftMessage: item.giftMessage || '',
          customDetails: item.customDetails || null,
          isCatalogue: product.stockTracked,
        };
        normalized.push(line);
        subtotal += price * quantity;
      } else {
        // Made-to-order custom item (bespoke price, not stock-tracked).
        const price = Number(item.price);
        if (!Number.isFinite(price) || price < 0) {
          throw new ApiError(422, `Invalid price for custom item "${item.name}".`, 'VALIDATION_ERROR');
        }
        normalized.push({
          productSlug: null,
          name: item.name || 'Custom Gift',
          price,
          quantity,
          image: item.image || '',
          category: item.category || 'Custom Gifts',
          palette: item.palette || '',
          ribbon: item.ribbon || '',
          giftMessage: item.giftMessage || giftMessage,
          customDetails: item.customDetails || null,
          isCatalogue: false,
        });
        subtotal += price * quantity;
      }
    }

    const settings = await getShippingSettings(session);
    const shipping = isRush
      ? settings.shippingConfiguration.expressRate
      : subtotal >= settings.shippingConfiguration.freeShippingThreshold
        ? 0
        : settings.shippingConfiguration.standardRate;

    const orderId = nextOrderId();
    order = await Order.create(
      [
        {
          orderId,
          customerId: customer._id,
          customerName: customer.name,
          customerEmail: customer.email,
          items: normalized,
          subtotal: Math.round(subtotal),
          shipping,
          total: Math.round(subtotal + shipping),
          paymentStatus: 'Sample',
          paymentMethod: paymentMethod || 'Sample',
          orderStatus: 'new',
          shippingAddress: shippingAddress || {},
          giftMessage: giftMessage || '',
          trackingNumber: nextTracking(orderId),
          statusHistory: [{ status: 'new', note: 'Order received' }],
        },
      ],
      { session }
    );
    order = order[0];

    // Reserve catalogue stock inside the same transaction.
    await reserveStockForOrder({ items: normalized, orderId, createdBy: customer.name || 'customer' });

    await session.commitTransaction();
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }

  return order;
}

async function getShippingSettings(session) {
  const Settings = (await import('../models/Settings.js')).default;
  let settings = await Settings.findOne({ key: 'default' }).session(session);
  if (!settings) {
    settings = await Settings.create([{ key: 'default' }], { session });
    settings = settings[0];
  }
  return settings;
}
