import Settings from '../models/Settings.js';
import { ApiError } from '../middleware/errorMiddleware.js';
import { cached, cacheInvalidatePrefix } from '../utils/publicCache.js';

async function getOrCreate() {
  let settings = await Settings.findOne({ key: 'default' });
  if (!settings) {
    settings = await Settings.create({ key: 'default' });
  }
  return settings;
}

export async function getSettings(_req, res, next) {
  try {
    // Public storefront settings: read on every hydration, rarely change.
    // 30s TTL + invalidation on PATCH (Phase 17).
    const settings = await cached('settings:default', getOrCreate, Settings);
    res.json({ success: true, settings });
  } catch (err) {
    next(err);
  }
}

export async function updateSettings(req, res, next) {
  try {
    const settings = await getOrCreate();
    const allowedTop = [
      'storeName',
      'currency',
      'storeAvailability',
      'acceptNewOrders',
      'shippingConfiguration',
      'customGiftConfiguration',
      'storeTagline',
      'contactEmail',
      'contactPhone',
      'timezone',
      'commerceConfiguration',
      'notificationConfiguration',
    ];
    for (const field of allowedTop) {
      if (req.body[field] !== undefined) {
        settings[field] = req.body[field];
      }
    }
    await settings.save();
    cacheInvalidatePrefix('settings:');
    res.json({ success: true, settings });
  } catch (err) {
    next(err);
  }
}
