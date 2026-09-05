const STORAGE_KEYS = {
  PRODUCTS: 'flora_alchemy_products',
  CUSTOMERS: 'flora_alchemy_customers',
  ORDERS: 'flora_alchemy_orders',
  INVENTORY: 'flora_alchemy_inventory',
  CART: 'flora_alchemy_cart',
  WISHLIST: 'flora_alchemy_wishlist',
  ACCOUNT: 'flora_alchemy_account',
  ADMIN_USERS: 'flora_alchemy_admin_users',
  ADMIN_SESSION: 'flora_alchemy_admin_session',
  GENERAL_SETTINGS: 'flora_alchemy_admin_general_settings',
  STORE_PREFERENCES: 'flora_alchemy_admin_store_preferences',
  INVENTORY_HISTORY: 'flora_alchemy_inventory_history',
};

let storageInitialized = false;

export function getStorageKeys() {
  return STORAGE_KEYS;
}

export function getStored(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function setStored(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore quota errors
  }
}

export function hasStored(key) {
  try {
    return localStorage.getItem(key) !== null;
  } catch {
    return false;
  }
}

export function clearStored(key) {
  try {
    localStorage.removeItem(key);
  } catch {}
}

export function isStorageInitialized() {
  return storageInitialized;
}

export function markStorageInitialized() {
  storageInitialized = true;
}
