import { getStored, setStored } from './storage.js';
import { getCustomerById, addOrderToCustomer, getActiveCustomerId } from './customerService.js';
import { getInventoryItem, adjustInventory } from './inventoryService.js';
import { isCatalogueProduct } from './productService.js';
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
const SAMPLE_DATA_CUSTOMER_IDS = [
  'cust-10428', 'cust-10503', 'cust-10352', 'cust-10445', 'cust-10187',
  'cust-10612', 'cust-10721', 'cust-10834', 'cust-10947', 'cust-11005',
  'cust-11078', 'cust-10298',
];

const SAMPLE_DATA_ORDERS = [
  {
    id: 'FA-84291',
    customerId: 'cust-10428',
    customerName: 'Aarav Sharma',
    customerEmail: 'aarav.sharma@example.com',
    items: [
      { productId: 'dusty-rose-lavender-posy', name: 'Dusty Rose & Lavender Posy', price: 1850, quantity: 1, image: PRODUCTS[0].images[0] },
      { productId: 'pressed-wildflower-cards', name: 'Pressed Botanical Wildflower Cards', price: 850, quantity: 1, image: PRODUCTS[1].images[0] },
      { productId: 'gold-foil-pressed-stickers', name: 'Gold Foil Pressed Botanical Stickers', price: 450, quantity: 1, image: PRODUCTS[6].images[0] },
    ],
    subtotal: 3150, shipping: 0, total: 3150,
    paymentStatus: 'Paid', orderStatus: 'in_production',
    shippingAddress: { name: 'Aarav Sharma', address: '14 Hill Road, Bandra West', city: 'Mumbai', state: 'Maharashtra', pincode: '400050', phone: '+91 98200 12345' },
    createdAt: daysAgo(0), updatedAt: daysAgo(0), deliveryTarget: daysAgo(-2),
    isRush: true, trackingNumber: null,
  },
  {
    id: 'FA-84276',
    customerId: 'cust-10503',
    customerName: 'Meera Joshi',
    customerEmail: 'meera.joshi@example.com',
    items: [
      { productId: 'heirloom-keepsake-hamper', name: 'Heirloom Keepsake Wooden Hamper Box', price: 3450, quantity: 1, image: PRODUCTS[3].images[0] },
    ],
    subtotal: 3450, shipping: 0, total: 3450,
    paymentStatus: 'Paid', orderStatus: 'ready_to_dispatch',
    shippingAddress: { name: 'Meera Joshi', address: '89 Malviya Nagar', city: 'Jaipur', state: 'Rajasthan', pincode: '302017', phone: '+91 98555 67890' },
    createdAt: daysAgo(1), updatedAt: daysAgo(1), deliveryTarget: daysAgo(-1),
    isRush: false, trackingNumber: null,
  },
  {
    id: 'FA-84254',
    customerId: 'cust-10352',
    customerName: 'Riya Patel',
    customerEmail: 'riya.patel@example.com',
    items: [
      { productId: 'vintage-peony-eucalyptus-posy', name: 'Vintage Peony & Eucalyptus Posy', price: 2150, quantity: 1, image: PRODUCTS[4].images[0] },
      { productId: 'pressed-wildflower-cards', name: 'Pressed Botanical Wildflower Cards', price: 850, quantity: 1, image: PRODUCTS[1].images[0] },
    ],
    subtotal: 3000, shipping: 0, total: 3000,
    paymentStatus: 'Paid', orderStatus: 'confirmed',
    shippingAddress: { name: 'Riya Patel', address: '78 Lajpat Nagar II', city: 'New Delhi', state: 'Delhi', pincode: '110024', phone: '+91 98111 23456' },
    createdAt: daysAgo(2), updatedAt: daysAgo(2), deliveryTarget: daysAgo(-3),
    isRush: false, trackingNumber: null,
  },
  {
    id: 'FA-84231',
    customerId: 'cust-10445',
    customerName: 'Kabir Singh',
    customerEmail: 'kabir.singh@example.com',
    items: [
      { productId: 'dusty-rose-lavender-posy', name: 'Dusty Rose & Lavender Posy', price: 1850, quantity: 1, image: PRODUCTS[0].images[0] },
    ],
    subtotal: 1850, shipping: 0, total: 1850,
    paymentStatus: 'Pending', orderStatus: 'new',
    shippingAddress: { name: 'Kabir Singh', address: '12 Koregaon Park', city: 'Pune', state: 'Maharashtra', pincode: '411001', phone: '+91 98444 56789' },
    createdAt: daysAgo(2), updatedAt: daysAgo(2), deliveryTarget: daysAgo(-4),
    isRush: false, trackingNumber: null,
  },
  {
    id: 'FA-84219',
    customerId: 'cust-10187',
    customerName: 'Ananya Verma',
    customerEmail: 'ananya.verma@example.com',
    items: [
      { productId: 'pressed-wildflower-cards', name: 'Handmade Botanical Card Set', price: 850, quantity: 1, image: PRODUCTS[1].images[0] },
    ],
    subtotal: 850, shipping: 0, total: 850,
    paymentStatus: 'Paid', orderStatus: 'quality_check',
    shippingAddress: { name: 'Ananya Verma', address: '45 Koramangala 5th Block', city: 'Bangalore', state: 'Karnataka', pincode: '560095', phone: '+91 98333 45678' },
    createdAt: daysAgo(3), updatedAt: daysAgo(1), deliveryTarget: daysAgo(-1),
    isRush: false, trackingNumber: null,
  },
  {
    id: 'FA-84190',
    customerId: 'cust-10612',
    customerName: 'Devansh Mehta',
    customerEmail: 'devansh.mehta@example.com',
    items: [
      { productId: 'desk-bloom-ceramic-pot', name: 'Desk Bloom in Ceramic Pot', price: 1250, quantity: 1, image: PRODUCTS[2].images[0] },
      { productId: 'botanical-wax-seal-kit', name: 'Botanical Wax Seal Ritual Kit', price: 1150, quantity: 1, image: PRODUCTS[9].images[0] },
    ],
    subtotal: 2400, shipping: 0, total: 2400,
    paymentStatus: 'Paid', orderStatus: 'shipped',
    shippingAddress: { name: 'Devansh Mehta', address: '23 T Nagar', city: 'Chennai', state: 'Tamil Nadu', pincode: '600017', phone: '+91 98666 78901' },
    createdAt: daysAgo(4), updatedAt: daysAgo(1), deliveryTarget: daysAgo(-1),
    isRush: false, trackingNumber: 'FA-TRK-84190',
  },
  {
    id: 'FA-84175',
    customerId: 'cust-10721',
    customerName: 'Isha Gupta',
    customerEmail: 'isha.gupta@example.com',
    items: [
      { productId: 'dusty-rose-lavender-posy', name: 'Dusty Rose & Lavender Posy (5-Stem)', price: 1850, quantity: 1, image: PRODUCTS[0].images[0] },
    ],
    subtotal: 1850, shipping: 0, total: 1850,
    paymentStatus: 'Paid', orderStatus: 'delivered',
    shippingAddress: { name: 'Isha Gupta', address: '56 Park Street', city: 'Kolkata', state: 'West Bengal', pincode: '700016', phone: '+91 98777 89012' },
    createdAt: daysAgo(5), updatedAt: daysAgo(2), deliveryTarget: daysAgo(-2),
    isRush: false, trackingNumber: 'FA-TRK-84175',
  },
  {
    id: 'FA-84160',
    customerId: 'cust-10834',
    customerName: 'Arjun Reddy',
    customerEmail: 'arjun.reddy@example.com',
    items: [
      { productId: 'heirloom-keepsake-hamper', name: 'Heirloom Keepsake Hamper', price: 3450, quantity: 1, image: PRODUCTS[3].images[0] },
      { productId: 'chenille-garden-mascot-charm', name: 'Chenille Garden Sunflower Charm', price: 650, quantity: 2, image: PRODUCTS[5].images[0] },
    ],
    subtotal: 4750, shipping: 0, total: 4750,
    paymentStatus: 'Paid', orderStatus: 'in_production',
    shippingAddress: { name: 'Arjun Reddy', address: '67 Banjara Hills', city: 'Hyderabad', state: 'Telangana', pincode: '500034', phone: '+91 98888 90123' },
    createdAt: daysAgo(1), updatedAt: daysAgo(1), deliveryTarget: daysAgo(-3),
    isRush: false, trackingNumber: null,
  },
  {
    id: 'FA-84145',
    customerId: 'cust-10947',
    customerName: 'Sneha Nair',
    customerEmail: 'sneha.nair@example.com',
    items: [
      { productId: 'rakhi-everlasting-bloom-set', name: 'Rakhi Everlasting Ceremonial Bloom Set', price: 2200, quantity: 1, image: PRODUCTS[7].images[0] },
    ],
    subtotal: 2200, shipping: 0, total: 2200,
    paymentStatus: 'Paid', orderStatus: 'delivered',
    shippingAddress: { name: 'Sneha Nair', address: '34 MG Road', city: 'Kochi', state: 'Kerala', pincode: '682016', phone: '+91 98999 01234' },
    createdAt: daysAgo(10), updatedAt: daysAgo(5), deliveryTarget: daysAgo(-5),
    isRush: false, trackingNumber: 'FA-TRK-84145',
  },
  {
    id: 'FA-84130',
    customerId: 'cust-11005',
    customerName: 'Rajesh Kumar',
    customerEmail: 'rajesh.kumar@example.com',
    items: [
      { productId: 'chenille-garden-mascot-charm', name: 'Chenille Garden Sunflower Mascot Charm', price: 650, quantity: 1, image: PRODUCTS[5].images[0] },
    ],
    subtotal: 650, shipping: 0, total: 650,
    paymentStatus: 'Paid', orderStatus: 'shipped',
    shippingAddress: { name: 'Rajesh Kumar', address: '19 Hazratganj', city: 'Lucknow', state: 'Uttar Pradesh', pincode: '226001', phone: '+91 98000 11223' },
    createdAt: daysAgo(6), updatedAt: daysAgo(2), deliveryTarget: daysAgo(-2),
    isRush: false, trackingNumber: 'FA-TRK-84130',
  },
  {
    id: 'FA-84115',
    customerId: 'cust-11078',
    customerName: 'Divya Menon',
    customerEmail: 'divya.menon@example.com',
    items: [
      { productId: 'gold-foil-pressed-stickers', name: 'Gold Foil Pressed Botanical Stickers', price: 450, quantity: 2, image: PRODUCTS[6].images[0] },
      { productId: 'botanical-wax-seal-kit', name: 'Botanical Wax Seal Ritual Kit', price: 1150, quantity: 1, image: PRODUCTS[9].images[0] },
    ],
    subtotal: 2050, shipping: 0, total: 2050,
    paymentStatus: 'Paid', orderStatus: 'confirmed',
    shippingAddress: { name: 'Divya Menon', address: '42 Adyar', city: 'Chennai', state: 'Tamil Nadu', pincode: '600020', phone: '+91 98111 22334' },
    createdAt: daysAgo(3), updatedAt: daysAgo(3), deliveryTarget: daysAgo(-5),
    isRush: false, trackingNumber: null,
  },
  {
    id: 'FA-84100',
    customerId: 'cust-10298',
    customerName: 'Rohan Patel',
    customerEmail: 'rohan.patel@example.com',
    items: [
      { productId: 'vintage-peony-eucalyptus-posy', name: 'Vintage Peony & Eucalyptus Posy', price: 2150, quantity: 1, image: PRODUCTS[4].images[0] },
    ],
    subtotal: 2150, shipping: 0, total: 2150,
    paymentStatus: 'Paid', orderStatus: 'delivered',
    shippingAddress: { name: 'Rohan Patel', address: '32 Satellite Road', city: 'Ahmedabad', state: 'Gujarat', pincode: '380015', phone: '+91 98222 34567' },
    createdAt: daysAgo(14), updatedAt: daysAgo(8), deliveryTarget: daysAgo(-8),
    isRush: false, trackingNumber: 'FA-TRK-84100',
  },
];

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

  // Add all sample orders from adminData
  SAMPLE_DATA_ORDERS.forEach(order => {
    initial.push(order);
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
  if (!customerId) {
    // No guest orders: every order must belong to an authenticated customer.
    throw new Error('Sign in to your account to complete checkout.');
  }
  const customer = getCustomerById(customerId);

  const trackingNumber = orderData.trackingNumber || generateTrackingNumber('');

  const newOrder = {
    id: orderData.id || generateOrderId(),
    customerId: customerId,
    customerName: customer?.name || 'Customer',
    customerEmail: customer?.email || orderData.customerEmail || '',
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

  // Decrement inventory (only for real, stock-tracked catalogue products —
  // made-to-order custom items are not deducted)
  if (newOrder.items && newOrder.items.length > 0) {
    newOrder.items.forEach(item => {
      const productId = item.productId || item.id;
      const qty = item.quantity || 1;
      if (isCatalogueProduct(productId)) {
        adjustInventory(productId, -qty, 'Sale', `Order ${newOrder.id}`);
      }
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
