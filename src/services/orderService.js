import { getStored, setStored } from './storage.js';
import { getCustomerById, addOrderToCustomer, getActiveCustomerId } from './customerService.js';
import { getInventoryItem, adjustInventory } from './inventoryService.js';
import { PRODUCTS } from '../data/products.js';

const STORAGE_KEY = 'flora_alchemy_orders';

function daysAgo(d) {
  const dt = new Date();
  dt.setDate(dt.getDate() - d);
  return dt.toISOString();
}

function generateOrderId() {
  return `FA-${Math.floor(1000 + Math.random() * 9000)}`;
}

function generateTrackingNumber(orderId) {
  const num = orderId.split('-')[1];
  return `FA-TRK-${num}`;
}

// ─── Canonical Status ───
export const ORDER_STATUSES = [
  { key: 'new', label: 'New', description: 'Payment confirmed', stageNum: 1 },
  { key: 'confirmed', label: 'Confirmed', description: 'Stem assigned', stageNum: 2 },
  { key: 'in_production', label: 'In Production', description: 'Currently being crafted', stageNum: 3 },
  { key: 'quality_check', label: 'Quality Check', description: 'Petal inspection', stageNum: 4 },
  { key: 'ready_to_dispatch', label: 'Ready to Dispatch', description: 'Wax seal & box', stageNum: 5 },
  { key: 'shipped', label: 'Shipped', description: 'Handed to courier', stageNum: 6 },
  { key: 'delivered', label: 'Delivered', description: 'Archived delivery', stageNum: 7 },
];

export const PAYMENT_STATUSES = ['Paid', 'Pending', 'Refunded'];

export const ORDER_STATUS_STYLES = {
  new: { bg: 'bg-purple-50', text: 'text-purple-800', border: 'border-purple-200', dot: 'bg-purple-600' },
  confirmed: { bg: 'bg-slate-100', text: 'text-slate-800', border: 'border-slate-200', dot: 'bg-slate-500' },
  in_production: { bg: 'bg-[#ffdad3]', text: 'text-[#783020]', border: 'border-[#edd1cc]', dot: 'bg-[#964735]' },
  quality_check: { bg: 'bg-amber-50', text: 'text-amber-900', border: 'border-amber-200', dot: 'bg-amber-500' },
  ready_to_dispatch: { bg: 'bg-emerald-100', text: 'text-emerald-800', border: 'border-emerald-200', dot: 'bg-emerald-600' },
  shipped: { bg: 'bg-sky-50', text: 'text-sky-800', border: 'border-sky-200', dot: 'bg-sky-600' },
  delivered: { bg: 'bg-stone-100', text: 'text-stone-700', border: 'border-stone-200', dot: 'bg-stone-500' },
  cancelled: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', dot: 'bg-red-500' },
};

// ─── Status mapping helpers ───
export function getStatusLabel(key) {
  const s = ORDER_STATUSES.find(st => st.key === key);
  return s ? s.label : key;
}

export function getStatusDescription(key) {
  const s = ORDER_STATUSES.find(st => st.key === key);
  return s ? s.description : '';
}

export function getStatusStage(key) {
  const s = ORDER_STATUSES.find(st => st.key === key);
  return s ? s.stageNum : 1;
}

export function getCustomerFacingStatus(key) {
  const map = {
    new: 'Order Received',
    confirmed: 'Confirmed',
    in_production: 'Being Crafted',
    quality_check: 'Quality Check',
    ready_to_dispatch: 'Ready for Dispatch',
    shipped: 'Shipped',
    delivered: 'Delivered',
  };
  return map[key] || key;
}

// ─── Migration helpers ───
function normalizeLegacyOrder(order) {
  if (order.id || order.orderId) {
    return {
      id: order.id || order.orderId,
      customerId: order.customerId || 'cust-demo-001',
      items: order.items || [],
      subtotal: order.subtotal || (order.items || []).reduce((s, i) => s + (i.price || 0) * (i.quantity || 1), 0),
      shipping: order.shipping || 0,
      total: order.total || (order.subtotal || 0) + (order.shipping || 0),
      paymentStatus: mapPaymentStatus(order.paymentStatus || order.paymentMethod || 'Paid'),
      orderStatus: mapOrderStatus(order.orderStatus || order.status || 'new'),
      shippingAddress: order.shippingAddress || order.delivery || {},
      giftMessage: order.giftMessage || order.giftNote?.message || '',
      trackingNumber: order.trackingNumber || null,
      createdAt: order.createdAt || order.date || daysAgo(0),
      updatedAt: order.updatedAt || order.date || daysAgo(0),
      deliveryTarget: order.deliveryTarget || null,
      isRush: order.isRush || false,
    };
  }
  return null;
}

function mapOrderStatus(status) {
  const statusMap = {
    'new': 'new',
    'Order Received': 'new',
    'confirmed': 'confirmed',
    'Confirmed': 'confirmed',
    'in_production': 'in_production',
    'In Production': 'in_production',
    'Being Crafted': 'in_production',
    'Packed': 'quality_check',
    'Quality Check': 'quality_check',
    'Ready to Dispatch': 'ready_to_dispatch',
    'Ready for Dispatch': 'ready_to_dispatch',
    'shipped': 'shipped',
    'Shipped': 'shipped',
    'Out for Delivery': 'shipped',
    'delivered': 'delivered',
    'Delivered': 'delivered',
    'Being Crafted': 'in_production',
  };
  const lower = status.toLowerCase();
  if (statusMap[status]) return statusMap[status];
  if (statusMap[lower]) return statusMap[lower];
  return 'new';
}

function mapPaymentStatus(status) {
  const map = {
    'Paid': 'Paid',
    'paid': 'Paid',
    'Pending': 'Pending',
    'pending': 'Pending',
    'Refunded': 'Refunded',
    'refunded': 'Refunded',
    'UPI': 'Paid',
    'Credit/Debit Card': 'Paid',
    'COD': 'Pending',
  };
  if (map[status]) return map[status];
  return 'Paid';
}

// ─── Seed initial data ───
function seedInitialOrders() {
  const initial = [];
  // Demo customer orders
  initial.push({
    id: 'FA-1024',
    customerId: 'cust-demo-001',
    items: [
      { productId: 'dusty-rose-lavender-posy', name: 'The Dusty Rose & Lavender Dream Posy', price: 1850, quantity: 1, image: PRODUCTS[0].images[0], customizations: ['Rose & Lilac Palette', 'Silk Rose Ribbon'] },
      { productId: 'pressed-wildflower-cards', name: 'Pressed Botanical Wildflower Cards (Set of 4)', price: 850, quantity: 1, image: PRODUCTS[1].images[0], customizations: ['Copper Wax Seal'] },
    ],
    subtotal: 2700,
    shipping: 0,
    total: 2700,
    paymentStatus: 'Paid',
    orderStatus: 'in_production',
    shippingAddress: { name: 'Demo Customer', address: 'Bandra West', city: 'Mumbai', state: 'Maharashtra', pincode: '400050', phone: '+91 98000 00000' },
    giftMessage: 'May these handcrafted botanicals bring lasting beauty and calm to your home. Warmest regards.',
    trackingNumber: 'FA-TRK-1024',
    createdAt: daysAgo(3),
    updatedAt: daysAgo(1),
    deliveryTarget: daysAgo(-2),
    isRush: false,
  });

  initial.push({
    id: 'FA-0912',
    customerId: 'cust-demo-001',
    items: [
      { productId: 'desk-bloom-ceramic-pot', name: 'Desk Bloom in Ceramic Pot', price: 1250, quantity: 1, image: PRODUCTS[2].images[0] },
    ],
    subtotal: 1250,
    shipping: 0,
    total: 1250,
    paymentStatus: 'Paid',
    orderStatus: 'delivered',
    shippingAddress: { name: 'Demo Customer', address: 'Bandra West', city: 'Mumbai', state: 'Maharashtra', pincode: '400050', phone: '+91 98000 00000' },
    giftMessage: '',
    trackingNumber: 'FA-TRK-0912',
    createdAt: daysAgo(21),
    updatedAt: daysAgo(18),
    deliveryTarget: daysAgo(-15),
    isRush: false,
  });

  setStored(STORAGE_KEY, initial);
  return initial;
}

export function getOrders() {
  if (!getStored(STORAGE_KEY, null)) {
    seedInitialOrders();
  }
  const stored = getStored(STORAGE_KEY, []);
  // Migrate legacy orders if needed
  const migrated = stored.map(o => {
    if (o.id && o.orderStatus !== undefined) return o; // already canonical
    if (o.orderId && o.status) return normalizeLegacyOrder(o);
    return o;
  });
  setStored(STORAGE_KEY, migrated);
  return migrated;
}

export function getOrderById(orderId) {
  const orders = getOrders();
  return orders.find(o => o.id === orderId || o.trackingNumber === orderId) || null;
}

export function getOrdersByCustomer(customerId) {
  return getOrders().filter(o => o.customerId === customerId);
}

export function getOrdersByStatus(statusKey) {
  return getOrders().filter(o => o.orderStatus === statusKey);
}

export function createOrder(orderData) {
  const orders = getOrders();
  const now = new Date().toISOString();

  const customerId = orderData.customerId || getActiveCustomerId();
  const customer = getCustomerById(customerId);

  const trackingNumber = orderData.trackingNumber || generateTrackingNumber('');

  const newOrder = {
    id: orderData.id || generateOrderId(),
    customerId: customerId,
    customerName: customer?.name || 'Guest Customer',
    customerEmail: customer?.email || orderData.customerEmail || 'guest@example.com',
    items: orderData.items || [],
    subtotal: orderData.subtotal || (orderData.items || []).reduce((s, i) => s + (i.price || 0) * (i.quantity || 1), 0),
    shipping: orderData.shipping || 0,
    total: orderData.total || (orderData.subtotal || 0) + (orderData.shipping || 0),
    paymentStatus: orderData.paymentStatus || 'Paid',
    orderStatus: 'confirmed',
    shippingAddress: orderData.shippingAddress || {
      name: customer?.name || 'Customer',
      address: orderData.address || '',
      city: orderData.city || '',
      state: orderData.state || '',
      pincode: orderData.pincode || '',
      phone: customer?.phone || orderData.phone || '',
    },
    giftMessage: orderData.giftMessage || '',
    trackingNumber: trackingNumber,
    createdAt: now,
    updatedAt: now,
    deliveryTarget: null,
    isRush: orderData.isRush || false,
  };

  // Update tracking number properly
  newOrder.trackingNumber = generateTrackingNumber(newOrder.id);

  const updatedOrders = [newOrder, ...orders];
  setStored(STORAGE_KEY, updatedOrders);

  // Update customer stats
  addOrderToCustomer(customerId, newOrder.total);

  // Decrement inventory
  if (newOrder.items && newOrder.items.length > 0) {
    newOrder.items.forEach(item => {
      const productId = item.productId || item.id;
      const qty = item.quantity || 1;
      adjustInventory(productId, -qty, 'Sale', `Order ${newOrder.id}`);
    });
  }

  return newOrder;
}

export function updateOrderStatus(orderId, newStatusKey) {
  const orders = getOrders();
  const idx = orders.findIndex(o => o.id === orderId);
  if (idx === -1) return null;

  const validStatuses = ORDER_STATUSES.map(s => s.key);
  if (!validStatuses.includes(newStatusKey)) return null;

  const updated = [...orders];
  updated[idx] = {
    ...updated[idx],
    orderStatus: newStatusKey,
    updatedAt: new Date().toISOString(),
  };

  setStored(STORAGE_KEY, updated);
  return updated[idx];
}

export function updateOrder(orderId, updates) {
  const orders = getOrders();
  const idx = orders.findIndex(o => o.id === orderId);
  if (idx === -1) return null;

  const updated = [...orders];
  updated[idx] = { ...updated[idx], ...updates, updatedAt: new Date().toISOString() };
  setStored(STORAGE_KEY, updated);
  return updated[idx];
}

export function deleteOrder(orderId) {
  const orders = getOrders();
  const updated = orders.filter(o => o.id !== orderId);
  setStored(STORAGE_KEY, updated);
  return updated;
}

// ─── Format Helpers ───
function formatShortDate(iso) {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return iso;
  }
}

export function formatINR(amount) {
  return `\u20B9${Number(amount || 0).toLocaleString('en-IN')}`;
}

export function formatDate(iso) {
  return formatShortDate(iso);
}

export function getStatusCounts() {
  const orders = getOrders();
  const counts = {};
  ORDER_STATUSES.forEach(s => { counts[s.key] = 0; });
  orders.forEach(o => {
    if (counts[o.orderStatus] !== undefined) counts[o.orderStatus]++;
  });
  return {
    total: orders.length,
    new: counts.new || 0,
    confirmed: counts.confirmed || 0,
    inProduction: counts.in_production || 0,
    qualityCheck: counts.quality_check || 0,
    readyToDispatch: counts.ready_to_dispatch || 0,
    shipped: counts.shipped || 0,
    delivered: counts.delivered || 0,
  };
}
