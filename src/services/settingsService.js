import { getStored, setStored } from './storage.js';

const STORAGE_KEY = 'flora_alchemy_settings';

const DEFAULT_SETTINGS = {
  storeName: 'Flora Alchemy',
  currency: 'INR',
  currencySymbol: '₹',
  timezone: 'Asia/Kolkata',
  storeStatus: true,
  acceptNewOrders: true,
  contactEmail: 'contact@flora-alchemy.demo',
  contactPhone: '+91 98765 43210 (Sample)',
  shippingEnabled: true,
  freeShippingAbove: 1999,
  standardShippingRate: 0,
  expressShippingRate: 149,
  customGiftsEnabled: true,
  notifications: {
    email: true,
    lowStock: true,
    criticalStock: true,
    orderUpdates: true,
  },
  lastModified: new Date().toISOString(),
};

export function getSettings() {
  if (!getStored(STORAGE_KEY, null)) {
    setStored(STORAGE_KEY, { ...DEFAULT_SETTINGS });
  }
  return getStored(STORAGE_KEY, { ...DEFAULT_SETTINGS });
}

export function updateSettings(updates) {
  const current = getSettings();
  const updated = { ...current, ...updates, lastModified: new Date().toISOString() };
  setStored(STORAGE_KEY, updated);
  return updated;
}

export function resetSettings() {
  setStored(STORAGE_KEY, { ...DEFAULT_SETTINGS });
  return { ...DEFAULT_SETTINGS };
}

export function getShippingCost(subtotal) {
  const settings = getSettings();
  if (subtotal >= settings.freeShippingAbove) return 0;
  return settings.standardShippingRate;
}

export function isStoreOpen() {
  return getSettings().storeStatus;
}
