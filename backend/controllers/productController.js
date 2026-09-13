import Product from '../models/Product.js';
import Inventory from '../models/Inventory.js';
import jwt from 'jsonwebtoken';
import { ApiError } from '../middleware/errorMiddleware.js';

// Optional auth for public reads: a valid staff token reveals hidden products.
async function isStaffRequest(req) {
  const header = req.headers.authorization || '';
  if (!header.startsWith('Bearer ')) return false;
  try {
    const decoded = jwt.verify(header.slice(7), process.env.JWT_SECRET);
    return ['admin', 'handler'].includes(decoded.role);
  } catch {
    return false;
  }
}

function slugify(name) {
  return String(name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

function validateProductPayload(body, partial = false) {
  const out = {};
  const errors = [];
  const has = (k) => body[k] !== undefined;

  if (!partial || has('name')) {
    if (!body.name || String(body.name).trim().length < 2) {
      errors.push('Product name is required.');
    } else {
      out.name = String(body.name).trim();
      out.slug = slugify(out.name);
    }
  }
  if (has('price')) {
    const price = Number(body.price);
    if (!Number.isFinite(price) || price < 0) {
      errors.push('Price must be a non-negative number.');
    } else {
      out.price = Math.round(price);
    }
  }
  for (const field of ['sku', 'category', 'description', 'image', 'palette', 'ribbon', 'occasion']) {
    if (has(field)) out[field] = body[field];
  }
  if (has('collections') && Array.isArray(body.collections)) out.collections = body.collections;
  if (has('visibility')) {
    if (!['Visible', 'Hidden'].includes(body.visibility)) {
      errors.push('Visibility must be Visible or Hidden.');
    } else {
      out.visibility = body.visibility;
    }
  }
  if (has('stockTracked')) out.stockTracked = !!body.stockTracked;

  return { out, errors };
}

/** Public: visible catalogue only (hidden products never leak to storefront). */
export async function listProducts(req, res, next) {
  try {
    const staff = await isStaffRequest(req);
    const { category, q, visibility } = req.query;
    const match = {};
    if (!staff) match.visibility = 'Visible';
    if (staff && visibility) match.visibility = visibility;
    if (category) match.category = { $regex: `^${String(category)}$`, $options: 'i' };
    if (q) {
      match.$or = [
        { name: { $regex: String(q), $options: 'i' } },
        { category: { $regex: String(q), $options: 'i' } },
        { sku: { $regex: String(q), $options: 'i' } },
      ];
    }
    const products = await Product.find(match).sort({ createdAt: 1 }).limit(500);
    res.json({ success: true, products });
  } catch (err) {
    next(err);
  }
}

export async function getProduct(req, res, next) {
  try {
    const product = await Product.findOne({ slug: req.params.id });
    if (!product) {
      throw new ApiError(404, 'Product not found.', 'PRODUCT_NOT_FOUND');
    }
    const staff = await isStaffRequest(req);
    if (!staff && product.visibility === 'Hidden') {
      throw new ApiError(404, 'Product not found.', 'PRODUCT_NOT_FOUND');
    }
    res.json({ success: true, product });
  } catch (err) {
    next(err);
  }
}

export async function createProduct(req, res, next) {
  try {
    const { out, errors } = validateProductPayload(req.body);
    if (errors.length) {
      throw new ApiError(422, errors.join(' '), 'VALIDATION_ERROR');
    }
    const existing = await Product.findOne({ slug: out.slug });
    if (existing) {
      throw new ApiError(409, `A product named "${out.name}" already exists.`, 'DUPLICATE');
    }
    const product = await Product.create({ ...out, isFixture: false });

    // Auto-create inventory record for stock-tracked products.
    // Initial stock comes from the request body (default 0 if not provided).
    if (product.stockTracked !== false) {
      const initialStock = Math.max(0, parseInt(req.body.initialStock, 10) || 0);
      const reorderLevel = Math.max(0, parseInt(req.body.reorderLevel, 10) || 5);
      await Inventory.create({
        productSlug: product.slug,
        sku: product.sku || '',
        productName: product.name,
        currentStock: initialStock,
        reorderLevel,
        unit: 'units',
        isFixture: false,
      });
    }

    res.status(201).json({ success: true, product });
  } catch (err) {
    next(err);
  }
}

export async function updateProduct(req, res, next) {
  try {
    const product = await Product.findOne({ slug: req.params.id });
    if (!product) {
      throw new ApiError(404, 'Product not found.', 'PRODUCT_NOT_FOUND');
    }
    const { out, errors } = validateProductPayload(req.body, true);
    if (errors.length) {
      throw new ApiError(422, errors.join(' '), 'VALIDATION_ERROR');
    }
    if (out.slug && out.slug !== product.slug) {
      const clash = await Product.findOne({ slug: out.slug, _id: { $ne: product._id } });
      if (clash) {
        throw new ApiError(409, `A product named "${out.name}" already exists.`, 'DUPLICATE');
      }
    }
    Object.assign(product, out);
    await product.save();
    res.json({ success: true, product });
  } catch (err) {
    next(err);
  }
}

export async function deleteProduct(req, res, next) {
  try {
    const product = await Product.findOne({ slug: req.params.id });
    if (!product) {
      throw new ApiError(404, 'Product not found.', 'PRODUCT_NOT_FOUND');
    }
    await product.deleteOne();
    // Remove the linked inventory record so no orphan survives. Without this,
    // re-creating a product with the same slug fails on the inventory unique
    // index and dead stock rows pollute the inventory views.
    await Inventory.deleteOne({ productSlug: product.slug });
    res.json({ success: true, message: `Deleted "${product.name}".` });
  } catch (err) {
    next(err);
  }
}
