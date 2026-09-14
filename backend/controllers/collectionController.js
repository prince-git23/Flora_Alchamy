import Collection from '../models/Collection.js';
import jwt from 'jsonwebtoken';
import { ApiError } from '../middleware/errorMiddleware.js';
import { cached, cacheInvalidatePrefix } from '../utils/publicCache.js';

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

export async function listCollections(req, res, next) {
  try {
    const staff = await isStaffRequest(req);
    const match = {};
    if (!staff) match.visibility = 'Visible';
    // Public visible-only listing: 30s TTL cache, invalidated on writes.
    const load = () => Collection.find(match).sort({ createdAt: 1 }).limit(200).lean();
    const collections = staff ? await load() : await cached('collections:list', load, Collection);
    res.json({ success: true, collections });
  } catch (err) {
    next(err);
  }
}

export async function getCollection(req, res, next) {
  try {
    const collection = await Collection.findOne({ slug: req.params.id });
    if (!collection) {
      throw new ApiError(404, 'Collection not found.', 'NOT_FOUND');
    }
    const staff = await isStaffRequest(req);
    if (!staff && collection.visibility === 'Hidden') {
      throw new ApiError(404, 'Collection not found.', 'NOT_FOUND');
    }
    res.json({ success: true, collection });
  } catch (err) {
    next(err);
  }
}

export async function createCollection(req, res, next) {
  try {
    const { name, description, image, occasion, productSlugs, visibility } = req.body || {};
    if (!name || String(name).trim().length < 2) {
      throw new ApiError(422, 'Collection name is required.', 'VALIDATION_ERROR');
    }
    const slug = slugify(name);
    const clash = await Collection.findOne({ slug });
    if (clash) {
      throw new ApiError(409, `A collection named "${name}" already exists.`, 'DUPLICATE');
    }
    const collection = await Collection.create({
      slug,
      name: String(name).trim(),
      description: description || '',
      image: image || '',
      occasion: occasion || '',
      productSlugs: Array.isArray(productSlugs) ? productSlugs : [],
      visibility: ['Visible', 'Hidden'].includes(visibility) ? visibility : 'Visible',
      isFixture: false,
    });
    cacheInvalidatePrefix('collections:');
    res.status(201).json({ success: true, collection });
  } catch (err) {
    next(err);
  }
}

export async function updateCollection(req, res, next) {
  try {
    const collection = await Collection.findOne({ slug: req.params.id });
    if (!collection) {
      throw new ApiError(404, 'Collection not found.', 'NOT_FOUND');
    }
    const allowed = ['description', 'image', 'occasion', 'productSlugs', 'visibility', 'name'];
    for (const field of allowed) {
      if (req.body[field] !== undefined) {
        if (field === 'name') {
          collection.name = String(req.body.name).trim();
          collection.slug = slugify(collection.name);
        } else if (field === 'visibility' && !['Visible', 'Hidden'].includes(req.body.visibility)) {
          throw new ApiError(422, 'Visibility must be Visible or Hidden.', 'VALIDATION_ERROR');
        } else {
          collection[field] = req.body[field];
        }
      }
    }
    await collection.save();
    cacheInvalidatePrefix('collections:');
    res.json({ success: true, collection });
  } catch (err) {
    next(err);
  }
}

export async function deleteCollection(req, res, next) {
  try {
    const collection = await Collection.findOne({ slug: req.params.id });
    if (!collection) {
      throw new ApiError(404, 'Collection not found.', 'NOT_FOUND');
    }
    await collection.deleteOne();
    cacheInvalidatePrefix('collections:');
    res.json({ success: true, message: `Deleted collection "${collection.name}".` });
  } catch (err) {
    next(err);
  }
}
