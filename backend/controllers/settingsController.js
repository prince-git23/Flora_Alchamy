import Settings from '../models/Settings.js';
import { ApiError } from '../middleware/errorMiddleware.js';

async function getOrCreate() {
  let settings = await Settings.findOne({ key: 'default' });
  if (!settings) {
    settings = await Settings.create({ key: 'default' });
  }
  return settings;
}

export async function getSettings(_req, res, next) {
  try {
    const settings = await getOrCreate();
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
    ];
    for (const field of allowedTop) {
      if (req.body[field] !== undefined) {
        settings[field] = req.body[field];
      }
    }
    await settings.save();
    res.json({ success: true, settings });
  } catch (err) {
    next(err);
  }
}
