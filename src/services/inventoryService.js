import { getStored, setStored } from './storage.js';
import { PRODUCTS } from '../data/products.js';
import { getOrderById } from './orderService.js';

const STORAGE_KEY = 'flora_alchemy_inventory';
const HISTORY_KEY = 'flora_alchemy_inventory_history';

function daysAgo(d) {
  const dt = new Date();
  dt.setDate(dt.getDate() - d);
  return dt.toISOString();
}

function generateSKU(productId) {
  return `FA-${productId.toUpperCase().replace(/-/g, '').slice(0, 8)}`;
}

function seedInitialInventory() {
  const inventory = PRODUCTS.map(p => ({
    productId: p.id,
    sku: generateSKU(p.id),
    productName: p.name,
    category: p.categoryLabel || p.category,
    currentStock: deterministicStock(p.id),
    reorderLevel: 10,
    unit: 'units',
    status: calculateStatus(deterministicStock(p.id), 10),
    updatedAt: daysAgo(Math.floor(Math.abs(hashCode(p.id)) % 10)),
    lastRestocked: daysAgo(10 + Math.floor(Math.abs(hashCode(p.id + 'r')) % 15)),
  }));

  setStored(STORAGE_KEY, inventory);

  // Seed history
  const history = [
    { id: 'inv-h-001', date: daysAgo(0), type: 'Restock', product: 'Dusty Rose & Lavender Posy', sku: inventory[0].sku, quantityChange: 20, stockAfter: inventory[0].currentStock, reference: null, notes: 'Initial seed inventory' },
    { id: 'inv-h-002', date: daysAgo(1), type: 'Restock', product: 'Pressed Botanical Wildflower Cards', sku: inventory[1].sku, quantityChange: 40, stockAfter: inventory[1].currentStock, reference: null, notes: 'Initial seed inventory' },
  ];
  setStored(HISTORY_KEY, history);

  return inventory;
}

function deterministicStock(productId) {
  const stocks = {
    'dusty-rose-lavender-posy': 18,
    'pressed-wildflower-cards': 32,
    'desk-bloom-ceramic-pot': 15,
    'heirloom-keepsake-hamper': 8,
    'vintage-peony-eucalyptus-posy': 22,
    'chenille-garden-mascot-charm': 27,
    'gold-foil-pressed-stickers': 45,
    'rakhi-everlasting-bloom-set': 12,
    'heirloom-brass-snipping-shears': 19,
    'botanical-wax-seal-kit': 6,
  };
  return stocks[productId] || 20;
}

function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return hash;
}

function calculateStatus(current, reorder) {
  if (current <= reorder / 2) return 'Critical';
  if (current <= reorder) return 'Low Stock';
  return 'In Stock';
}

export function getInventory() {
  if (!getStored(STORAGE_KEY, null)) {
    return seedInitialInventory();
  }
  return getStored(STORAGE_KEY, []);
}

export function getInventoryItem(productId) {
  const inventory = getInventory();
  return inventory.find(i => i.productId === productId) || null;
}

export function getLowStockItems() {
  const inventory = getInventory();
  return inventory.filter(i => i.status === 'Low Stock' || i.status === 'Critical');
}

export function getCriticalStockItems() {
  const inventory = getInventory();
  return inventory.filter(i => i.status === 'Critical');
}

export function adjustInventory(productId, quantityChange, type = 'Adjustment', reference = null, notes = '') {
  const inventory = getInventory();
  const idx = inventory.findIndex(i => i.productId === productId);

  if (idx === -1) {
    // Auto-create inventory entry for unknown products
    const product = PRODUCTS.find(p => p.id === productId);
    const newItem = {
      productId: productId,
      sku: generateSKU(productId),
      productName: product?.name || productId,
      category: product?.categoryLabel || product?.category || 'Other',
      currentStock: Math.max(0, quantityChange),
      reorderLevel: 10,
      unit: 'units',
      status: calculateStatus(Math.max(0, quantityChange), 10),
      updatedAt: new Date().toISOString(),
      lastRestocked: new Date().toISOString(),
    };
    inventory.push(newItem);
    setStored(STORAGE_KEY, inventory);
    idx = inventory.length - 1;
  }

  const oldStock = inventory[idx].currentStock;
  const newStock = Math.max(0, oldStock + quantityChange);

  const updated = [...inventory];
  updated[idx] = {
    ...updated[idx],
    currentStock: newStock,
    status: calculateStatus(newStock, updated[idx].reorderLevel),
    updatedAt: new Date().toISOString(),
  };

  setStored(STORAGE_KEY, updated);

  // Record history
  const history = getInventoryHistory();
  const newEntry = {
    id: `inv-h-${Date.now()}`,
    date: new Date().toISOString(),
    type: type,
    product: updated[idx].productName,
    sku: updated[idx].sku,
    quantityChange: quantityChange,
    stockAfter: newStock,
    reference: reference || '',
    notes: notes || '',
  };
  history.unshift(newEntry);
  if (history.length > 100) history.pop();
  setStored(HISTORY_KEY, history);

  return { success: true, productId, oldStock, newStock, quantityChange };
}

export function adjustStock(productId, quantity, type, reason, handlerName = 'Handler Admin') {
  const prefix = type === 'Addition' ? '+' : '-';
  return adjustInventory(productId, quantity, type, null, `${handlerName} — ${reason}`);
}

export function getInventoryHistory() {
  if (!getStored(HISTORY_KEY, null)) {
    seedInitialInventory(); // triggers history seed
  }
  return getStored(HISTORY_KEY, []);
}

export function validateStock(productId, requiredQuantity) {
  const item = getInventoryItem(productId);
  if (!item) {
    // Product not in inventory — assume available for prototype
    return { available: true, currentStock: 999, message: 'Item not tracked in inventory' };
  }
  if (item.currentStock < requiredQuantity) {
    return { available: false, currentStock: item.currentStock, message: `Only ${item.currentStock} units available` };
  }
  return { available: true, currentStock: item.currentStock, message: 'In stock' };
}
