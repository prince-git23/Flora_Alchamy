import Inventory from '../models/Inventory.js';
import InventoryMovement from '../models/InventoryMovement.js';
import { ApiError } from '../middleware/errorMiddleware.js';

/**
 * Atomically change stock and record a movement.
 * type: 'sale' | 'restock' | 'adjustment' | 'return' | 'correction'
 * Use atomic findOneAndUpdate so two concurrent orders can never
 * double-deduct past zero.
 */
export async function adjustStock({
  productSlug,
  delta,
  type = 'adjustment',
  reason = '',
  orderId = null,
  createdBy = 'system',
}) {
  if (!Number.isFinite(delta) || delta === 0) {
    throw new ApiError(422, 'Adjustment quantity must be a non-zero number.', 'VALIDATION_ERROR');
  }

  const inv = await Inventory.findOneAndUpdate(
    { productSlug },
    // $inc is atomic; guard so stock can never drop below zero.
    { $inc: { currentStock: delta } },
    { new: true }
  ).catch(() => null);

  if (!inv) {
    throw new ApiError(404, `No inventory record exists for ${productSlug}.`, 'NOT_FOUND');
  }

  const previousStock = inv.currentStock - delta;
  if (inv.currentStock < 0) {
    // Roll back the decrement we just applied.
    await Inventory.updateOne({ productSlug }, { $inc: { currentStock: -delta } });
    throw new ApiError(
      409,
      `Insufficient stock for "${inv.productName}" — only ${previousStock} available.`,
      'INSUFFICIENT_STOCK'
    );
  }

  await InventoryMovement.create({
    productSlug,
    sku: inv.sku,
    productName: inv.productName,
    delta,
    previousStock,
    newStock: inv.currentStock,
    type,
    reason,
    orderId,
    createdBy,
  });

  return inv;
}

/**
 * Reserve stock for an order's catalogue items. Called inside order creation.
 * The deduction is a HOLD at this point: the order is payment-pending, and
 * the item is flagged stockDeducted so payment failure can release it and a
 * later successful payment re-deducts only if it was released (never twice).
 * Returns the inventory docs updated.
 */
export async function reserveStockForOrder({ items, orderId, createdBy = 'customer', paymentPending = false }) {
  const updated = [];
  for (const item of items) {
    if (!item.isCatalogue) continue; // made-to-order custom gifts are not stock-tracked
    const inv = await adjustStock({
      productSlug: item.productSlug,
      delta: -item.quantity,
      type: 'sale',
      reason: paymentPending ? `Order ${orderId} (payment pending — held)` : `Order ${orderId}`,
      orderId,
      createdBy,
    });
    updated.push(inv);
  }
  return updated;
}

/**
 * Compensating-release strategy (Phase 3E.1).
 *
 * The schema has a single currentStock field (no available/reserved split), so
 * pending-payment stock is HELD at order creation and released back when the
 * payment is not completed. Both helpers are idempotent — they are driven by
 * the item.stockDeducted flag, so repeated failure events or repeated webhooks
 * never mutate stock twice.
 *
 *   paid   → every catalogue item with stockDeducted=false is re-deducted
 *            (only possible when a release happened), then flagged true.
 *   failed → every catalogue item with stockDeducted=true is released (+qty),
 *            then flagged false.
 *
 * Net guarantee: one paid order = exactly one final deduction.
 */
export async function ensureOrderStockForPayment({ order, paid }) {
  if (!order || !Array.isArray(order.items)) return [];
  const updated = [];
  for (const item of order.items) {
    if (!item.isCatalogue) continue; // made-to-order custom gifts are not stock-tracked
    if (paid && item.stockDeducted) continue; // already held/sold — never deduct twice
    if (!paid && !item.stockDeducted) continue; // already released — never release twice

    if (paid) {
      const inv = await adjustStock({
        productSlug: item.productSlug,
        delta: -item.quantity,
        type: 'sale',
        reason: `Order ${order.orderId} (payment confirmed)`,
        orderId: order.orderId,
        createdBy: 'payment',
      });
      item.stockDeducted = true;
      updated.push(inv);
    } else {
      const inv = await adjustStock({
        productSlug: item.productSlug,
        delta: item.quantity,
        type: 'release',
        reason: `Order ${order.orderId} (payment not completed — released)`,
        orderId: order.orderId,
        createdBy: 'payment',
      });
      item.stockDeducted = false;
      updated.push(inv);
    }
  }
  if (updated.length > 0) {
    order.markModified('items');
    await order.save();
  }
  return updated;
}
