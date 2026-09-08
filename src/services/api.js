/**
 * Phase 3C — guest UI-state persistence only.
 *
 * Business data (products, collections, customers, orders, inventory,
 * analytics, settings, authentication) is authoritative in MongoDB and is
 * reached through the API via the service layer. This module persists only
 * temporary, non-authoritative browser state:
 *
 *   - guest cart (local browser state — cart survives while browsing)
 *   - wishlist product IDs (local UI state; full product rows are resolved
 *     against the server catalogue at render time)
 *
 * No static catalogue, demo orders, or demo account lives here anymore.
 */

const STORAGE_KEYS = {
  CART: 'flora_alchemy_cart',
  WISHLIST: 'flora_alchemy_wishlist',
};

function getStored(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function setStored(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage quota errors
  }
}

// ─── Guest cart ───
export async function getCart() {
  return getStored(STORAGE_KEYS.CART, []);
}

export async function updateCart(items) {
  setStored(STORAGE_KEYS.CART, items);
  return items;
}

export async function addToCart(product, options = {}) {
  const cart = await getCart();
  const quantity = options.quantity || 1;
  const existingIdx = cart.findIndex(
    (item) =>
      item.id === product.id &&
      item.palette === options.palette &&
      item.ribbon === options.ribbon
  );

  let updated;
  if (existingIdx > -1) {
    updated = [...cart];
    updated[existingIdx].quantity += quantity;
  } else {
    const newItem = {
      id: product.id,
      name: product.name,
      price: options.customPrice || product.price,
      quantity,
      image: product.images
        ? product.images[0]
        : product.image || '',
      category: product.categoryLabel || product.category || 'Handcrafted Flora',
      palette: options.palette || null,
      ribbon: options.ribbon || null,
      giftMessage: options.giftMessage || null,
      customDetails: options.customDetails || null,
    };
    updated = [newItem, ...cart];
  }
  setStored(STORAGE_KEYS.CART, updated);
  return updated;
}

export async function removeFromCart(itemIndex) {
  const cart = await getCart();
  const updated = cart.filter((_, idx) => idx !== itemIndex);
  setStored(STORAGE_KEYS.CART, updated);
  return updated;
}

// ─── Wishlist (IDs only; resolved against the API catalogue) ───
export async function getWishlist() {
  return getStored(STORAGE_KEYS.WISHLIST, []);
}

export async function addToWishlist(productId) {
  const current = await getWishlist();
  if (!current.includes(productId)) {
    const updated = [...current, productId];
    setStored(STORAGE_KEYS.WISHLIST, updated);
    return updated;
  }
  return current;
}

export async function removeFromWishlist(productId) {
  const current = await getWishlist();
  const updated = current.filter((id) => id !== productId);
  setStored(STORAGE_KEYS.WISHLIST, updated);
  return updated;
}
