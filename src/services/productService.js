import { getStored, setStored } from './storage.js';
import { PRODUCTS } from '../data/products.js';
import { getInventory, adjustInventory } from './inventoryService.js';

const STORAGE_KEY = 'flora_alchemy_products';

function generateId() {
  return `prod-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

function seedInitialProducts() {
  setStored(STORAGE_KEY, PRODUCTS);
  return PRODUCTS;
}

export function getProducts() {
  if (!getStored(STORAGE_KEY, null)) {
    seedInitialProducts();
  }
  return getStored(STORAGE_KEY, PRODUCTS);
}

export function getProductById(id) {
  const products = getProducts();
  return products.find(p => p.id === id) || null;
}

export function createProduct(data) {
  const products = getProducts();

  const newProduct = {
    id: data.id || generateId(),
    name: data.name,
    shortName: data.shortName || data.name,
    category: data.category || 'bouquets',
    categoryLabel: data.categoryLabel || data.category || 'Other',
    price: data.price || 0,
    originalPrice: data.originalPrice || null,
    images: data.images && data.images.length > 0 ? data.images : ['/assets/images/flora-asset-01.jpg'],
    description: data.description || '',
    shortDescription: data.shortDescription || '',
    badge: data.badge || '',
    craftTime: data.craftTime || '',
    materials: data.materials || '',
    dimensions: data.dimensions || '',
    rating: data.rating || 4.5,
    reviewCount: data.reviewCount || 0,
    palettes: data.palettes || [],
    ribbons: data.ribbons || [],
    tags: data.tags || [],
    isFeatured: data.isFeatured || false,
    isBestseller: data.isBestseller || false,
    availability: data.availability || 'Ready to Ship',
    visibility: 'Public',
    stock: data.stock !== undefined ? data.stock : 20,
    reorderLevel: data.reorderLevel || 10,
  };

  const updated = [newProduct, ...products];
  setStored(STORAGE_KEY, updated);

  // Initial inventory entry
  adjustInventory(newProduct.id, newProduct.stock, 'Restock', null, `Product creation — ${newProduct.name}`);

  return newProduct;
}

export function updateProduct(id, data) {
  const products = getProducts();
  const idx = products.findIndex(p => p.id === id);
  if (idx === -1) return null;

  const updated = [...products];
  updated[idx] = { ...updated[idx], ...data };
  setStored(STORAGE_KEY, updated);
  return updated[idx];
}

export function deleteProduct(id) {
  const products = getProducts();
  const updated = products.filter(p => p.id !== id);
  setStored(STORAGE_KEY, updated);

  // Remove inventory entry
  const inventory = getInventory();
  const invIdx = inventory.findIndex(i => i.productId === id);
  if (invIdx !== -1) {
    inventory.splice(invIdx, 1);
    setStored('flora_alchemy_inventory', inventory);
  }

  return updated;
}

export function getProductImage(product) {
  return product.images && product.images.length > 0 ? product.images[0] : '/assets/images/flora-asset-01.jpg';
}
