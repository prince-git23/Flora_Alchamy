import api from './apiClient.js';
import { store, signalDataChanged } from './dataStore.js';

/**
 * Phase 3C — store configuration now persists in MongoDB via GET/PATCH
 * /api/settings. The service normalizes the backend document into the shape
 * existing storefront/admin components expect. Nothing is reported "saved"
 * until the server confirms.
 */
export function getSettings() {
  const s = store.settings;
  if (!s) return null;
  const shipping = s.shippingConfiguration || {};
  return {
    storeName: s.storeName || 'Flora Alchemy',
    currency: s.currency || 'INR',
    currencySymbol: '₹',
    timezone: 'Asia/Kolkata',
    storeStatus: s.storeAvailability !== 'closed',
    storeAvailability: s.storeAvailability || 'open',
    acceptNewOrders: s.acceptNewOrders !== false,
    contactEmail: 'contact@flora-alchemy.demo',
    contactPhone: '+91 98765 43210 (Sample)',
    shippingEnabled: shipping.panIndia !== false,
    freeShippingAbove: shipping.freeShippingThreshold ?? 1999,
    standardShippingRate: shipping.standardRate ?? 0,
    expressShippingRate: shipping.expressRate ?? 149,
    shippingConfiguration: shipping,
    customGiftsEnabled: (s.customGiftConfiguration || {}).enabled !== false,
    customGiftConfiguration: s.customGiftConfiguration || {},
    notifications: {
      email: true,
      lowStock: true,
      criticalStock: true,
      orderUpdates: true,
    },
    lastModified: s.updatedAt || new Date().toISOString(),
  };
}

export async function updateSettings(updates) {
  const body = {};
  if (updates.storeName !== undefined) body.storeName = updates.storeName;
  if (updates.storeStatus !== undefined || updates.storeAvailability !== undefined) {
    body.storeAvailability =
      updates.storeAvailability ||
      (updates.storeStatus ? 'open' : 'closed');
  }
  if (updates.acceptNewOrders !== undefined) body.acceptNewOrders = !!updates.acceptNewOrders;
  if (updates.currency !== undefined) body.currency = updates.currency;
  if (
    updates.shippingConfiguration !== undefined ||
    updates.freeShippingAbove !== undefined ||
    updates.standardShippingRate !== undefined ||
    updates.expressShippingRate !== undefined
  ) {
    const current = getSettings() || {};
    body.shippingConfiguration = {
      ...(current.shippingConfiguration || {}),
      ...(updates.shippingConfiguration || {}),
      freeShippingThreshold: updates.freeShippingAbove ?? updates.shippingConfiguration?.freeShippingThreshold ?? current.shippingConfiguration?.freeShippingThreshold,
      standardRate: updates.standardShippingRate ?? updates.shippingConfiguration?.standardRate ?? current.shippingConfiguration?.standardRate,
      expressRate: updates.expressShippingRate ?? updates.shippingConfiguration?.expressRate ?? current.shippingConfiguration?.expressRate,
    };
  }
  if (updates.customGiftsEnabled !== undefined || updates.customGiftConfiguration !== undefined) {
    const current = getSettings() || {};
    body.customGiftConfiguration = {
      ...(current.customGiftConfiguration || {}),
      ...(updates.customGiftConfiguration || {}),
      enabled:
        updates.customGiftsEnabled ??
        updates.customGiftConfiguration?.enabled ??
        current.customGiftConfiguration?.enabled,
    };
  }

  const res = await api.patch('/settings', body, { scope: 'admin' });
  if (!res.ok) throw new Error(res.message || 'Settings could not be saved.');
  store.settings = res.data.settings;
  signalDataChanged();
  return getSettings();
}

export function resetSettings() {
  throw new Error('Resetting to defaults requires a backend operation — use updateSettings.');
}

export function getShippingCost(subtotal) {
  const settings = getSettings();
  if (!settings) return 0;
  if (subtotal >= settings.freeShippingAbove) return 0;
  return settings.standardShippingRate;
}

export function isStoreOpen() {
  const s = getSettings();
  return s ? s.storeStatus : true;
}
