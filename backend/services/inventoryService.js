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
 * Returns the inventory docs updated.
 */
export async function reserveStockForOrder({ items, orderId, createdBy = 'customer' }) {
  const updated = [];
  for (const item of items) {
    if (!item.isCatalogue) continue; // made-to-order custom gifts are not stock-tracked
    const inv = await adjustStock({
      productSlug: item.productSlug,
      delta: -item.quantity,
      type: 'sale',
      reason: `Order ${orderId}`,
      orderId,
      createdBy,
    });
    updated.push(inv);
  }
  return updated;
}
