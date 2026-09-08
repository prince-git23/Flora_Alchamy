import Wishlist from '../models/Wishlist.js';
import Product from '../models/Product.js';
import { ApiError } from '../middleware/errorMiddleware.js';

/**
 * Customer wishlist controller. Ownership is ALWAYS derived from the
 * authenticated customer (req.user.customerId) — a client-supplied owner id
 * is never accepted, so customers can never read or modify another
 * customer's wishlist.
 */

function serialize(products) {
  // Product docs serialize with `id` via the model's toJSON transform.
  return products.map((p) => p.toJSON());
}

async function loadWishlistDoc(customerId) {
  return Wishlist.findOneAndUpdate(
    { customerId },
    { $setOnInsert: { productIds: [] } },
    { upsert: true, new: true }
  );
}

async function resolveProducts(doc) {
  const products = await Product.find({ slug: { $in: doc.productIds } });
  const bySlug = new Map(products.map((p) => [p.slug, p]));
  // Deterministic order + split out references whose product no longer exists.
  const existing = [];
  const unavailableIds = [];
  for (const id of doc.productIds) {
    const p = bySlug.get(id);
    if (p) existing.push(p);
    else unavailableIds.push(id);
  }
  return { existing, unavailableIds };
}

export async function getWishlist(req, res, next) {
  try {
    const doc = await loadWishlistDoc(req.user.customerId);
    const { existing, unavailableIds } = await resolveProducts(doc);
    res.json({
      success: true,
      wishlist: {
        productIds: doc.productIds.map((id) => id.toString()),
        products: serialize(existing),
        unavailableIds,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function addToWishlist(req, res, next) {
  try {
    const { productId } = req.params;
    const slug = String(productId).trim().toLowerCase();
    const product = await Product.findOne({ slug });
    if (!product) {
      throw new ApiError(404, 'This creation no longer exists.', 'PRODUCT_NOT_FOUND');
    }

    const doc = await Wishlist.findOneAndUpdate(
      { customerId: req.user.customerId },
      { $addToSet: { productIds: product.slug } },
      { upsert: true, new: true }
    );
    const { existing, unavailableIds } = await resolveProducts(doc);
    res.json({
      success: true,
      wishlist: {
        productIds: doc.productIds.map((id) => id.toString()),
        products: serialize(existing),
        unavailableIds,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function removeFromWishlist(req, res, next) {
  try {
    const { productId } = req.params;
    const slug = String(productId).trim().toLowerCase();
    const doc = await Wishlist.findOneAndUpdate(
      { customerId: req.user.customerId },
      { $pull: { productIds: slug } },
      { new: true }
    );
    if (!doc) {
      throw new ApiError(404, 'Wishlist not found.', 'NOT_FOUND');
    }
    const { existing, unavailableIds } = await resolveProducts(doc);
    res.json({
      success: true,
      wishlist: {
        productIds: doc.productIds.map((id) => id.toString()),
        products: serialize(existing),
        unavailableIds,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function clearWishlist(req, res, next) {
  try {
    const doc = await Wishlist.findOneAndUpdate(
      { customerId: req.user.customerId },
      { $set: { productIds: [] } },
      { upsert: true, new: true }
    );
    res.json({
      success: true,
      wishlist: { productIds: [], products: [], unavailableIds: [] },
    });
  } catch (err) {
    next(err);
  }
}