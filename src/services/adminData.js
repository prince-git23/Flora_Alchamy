// Flora Alchemy — Admin Data Layer
// Deterministic sample data shared between customer storefront and Handler Portal
import { PRODUCTS } from '../data/products.js';

// ─── Order Status Lifecycle ───
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

// ─── Demo Customers ───
export const CUSTOMERS = [
  { id: 'cust-10428', name: 'Aarav Mehta', email: 'aarav.mehta@example.com', phone: '+91 98200 12345', status: 'Active', orders: 5, totalSpend: 8920, createdAt: '2024-03-15', city: 'Mumbai', state: 'Maharashtra', address: '14 Hill Road, Bandra West, Mumbai 400050' },
  { id: 'cust-10352', name: 'Priya Sharma', email: 'priya.sharma@example.com', phone: '+91 98111 23456', status: 'Active', orders: 3, totalSpend: 5640, createdAt: '2024-05-22', city: 'New Delhi', state: 'Delhi', address: '78 Lajpat Nagar II, New Delhi 110024' },
  { id: 'cust-10298', name: 'Rohan Patel', email: 'rohan.patel@example.com', phone: '+91 98222 34567', status: 'Active', orders: 2, totalSpend: 3700, createdAt: '2024-07-10', city: 'Ahmedabad', state: 'Gujarat', address: '32 Satellite Road, Ahmedabad 380015' },
  { id: 'cust-10187', name: 'Ananya Verma', email: 'ananya.verma@example.com', phone: '+91 98333 45678', status: 'Active', orders: 7, totalSpend: 14250, createdAt: '2024-01-08', city: 'Bangalore', state: 'Karnataka', address: '45 Koramangala 5th Block, Bangalore 560095' },
  { id: 'cust-10445', name: 'Kabir Singh', email: 'kabir.singh@example.com', phone: '+91 98444 56789', status: 'Active', orders: 1, totalSpend: 1850, createdAt: '2025-08-01', city: 'Pune', state: 'Maharashtra', address: '12 Koregaon Park, Pune 411001' },
  { id: 'cust-10503', name: 'Meera Joshi', email: 'meera.joshi@example.com', phone: '+91 98555 67890', status: 'Active', orders: 4, totalSpend: 6590, createdAt: '2024-04-19', city: 'Jaipur', state: 'Rajasthan', address: '89 Malviya Nagar, Jaipur 302017' },
  { id: 'cust-10612', name: 'Devansh Mehta', email: 'devansh.mehta@example.com', phone: '+91 98666 78901', status: 'Inactive', orders: 2, totalSpend: 3149, createdAt: '2024-09-05', city: 'Chennai', state: 'Tamil Nadu', address: '23 T Nagar, Chennai 600017' },
  { id: 'cust-10721', name: 'Isha Gupta', email: 'isha.gupta@example.com', phone: '+91 98777 89012', status: 'Active', orders: 3, totalSpend: 4490, createdAt: '2024-06-12', city: 'Kolkata', state: 'West Bengal', address: '56 Park Street, Kolkata 700016' },
  { id: 'cust-10834', name: 'Arjun Reddy', email: 'arjun.reddy@example.com', phone: '+91 98888 90123', status: 'Active', orders: 6, totalSpend: 11400, createdAt: '2023-11-20', city: 'Hyderabad', state: 'Telangana', address: '67 Banjara Hills, Hyderabad 500034' },
  { id: 'cust-10947', name: 'Sneha Nair', email: 'sneha.nair@example.com', phone: '+91 98999 01234', status: 'Active', orders: 2, totalSpend: 2750, createdAt: '2025-02-14', city: 'Kochi', state: 'Kerala', address: '34 MG Road, Kochi 682016' },
  { id: 'cust-11005', name: 'Rajesh Kumar', email: 'rajesh.kumar@example.com', phone: '+91 98000 11223', status: 'Active', orders: 1, totalSpend: 650, createdAt: '2025-07-30', city: 'Lucknow', state: 'Uttar Pradesh', address: '19 Hazratganj, Lucknow 226001' },
  { id: 'cust-11078', name: 'Divya Menon', email: 'divya.menon@example.com', phone: '+91 98111 22334', status: 'Active', orders: 3, totalSpend: 5100, createdAt: '2024-08-25', city: 'Chennai', state: 'Tamil Nadu', address: '42 Adyar, Chennai 600020' },
];

// ─── Demo Orders (canonical lifecycle) ───
function daysAgo(d) {
  const dt = new Date();
  dt.setDate(dt.getDate() - d);
  return dt.toISOString();
}
function formatShortDate(iso) {
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export const ORDERS = [
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

// ─── Collections ───
export const COLLECTIONS = [
  { id: 'col-festival', name: 'Festival Celebrations', description: 'Handcrafted floral keepsakes curated for festive occasions and ceremonial gifting.', coverImage: PRODUCTS[7].images[0], productIds: ['rakhi-everlasting-bloom-set', 'heirloom-keepsake-hamper', 'botanical-wax-seal-kit'], visibility: 'Public', productCount: 3, createdAt: daysAgo(30) },
  { id: 'col-signature', name: 'Signature Posies', description: 'Our best-selling botanical posy collection featuring the finest chenille floral artistry.', coverImage: PRODUCTS[0].images[0], productIds: ['dusty-rose-lavender-posy', 'vintage-peony-eucalyptus-posy'], visibility: 'Public', productCount: 2, createdAt: daysAgo(60) },
  { id: 'col-stationery', name: 'Botanical Stationery', description: 'Handmade cards, pressed flower ephemera, and wax-sealed correspondence sets.', coverImage: PRODUCTS[1].images[0], productIds: ['pressed-wildflower-cards', 'gold-foil-pressed-stickers', 'botanical-wax-seal-kit'], visibility: 'Public', productCount: 3, createdAt: daysAgo(45) },
  { id: 'col-desk', name: 'Desk & Living', description: 'Charming desk blooms, ceramic vessels, and botanical tools for everyday elegance.', coverImage: PRODUCTS[2].images[0], productIds: ['desk-bloom-ceramic-pot', 'heirloom-brass-snipping-shears'], visibility: 'Public', productCount: 2, createdAt: daysAgo(20) },
];

// ─── Inventory (linked to product catalog) ───
export const INVENTORY = PRODUCTS.map(p => ({
  productId: p.id,
  sku: `FA-${p.id.toUpperCase().replace(/-/g, '').slice(0, 8)}`,
  productName: p.name,
  category: p.categoryLabel || p.category,
  currentStock: Math.floor(Math.random() * 40) + 3,
  reorderLevel: 10,
  unit: 'units',
  status: 'In Stock',
  updatedAt: daysAgo(Math.floor(Math.random() * 5)),
  lastRestocked: daysAgo(Math.floor(Math.random() * 20) + 10),
}));

// Fix deterministic stock levels
INVENTORY[0].currentStock = 18; // Dusty Rose Posy
INVENTORY[1].currentStock = 32; // Pressed Cards
INVENTORY[2].currentStock = 15; // Desk Bloom
INVENTORY[3].currentStock = 8;  // Heirloom Hamper
INVENTORY[4].currentStock = 22; // Peony Posy
INVENTORY[5].currentStock = 27; // Sunflower Charm
INVENTORY[6].currentStock = 45; // Gold Foil Stickers
INVENTORY[7].currentStock = 12; // Rakhi Set
INVENTORY[8].currentStock = 19; // Brass Shears
INVENTORY[9].currentStock = 6;  // Wax Seal Kit

// Set statuses based on stock
INVENTORY.forEach(item => {
  if (item.currentStock <= item.reorderLevel / 2) {
    item.status = 'Critical';
  } else if (item.currentStock <= item.reorderLevel) {
    item.status = 'Low Stock';
  } else {
    item.status = 'In Stock';
  }
});

// ─── Inventory History ───
export const INVENTORY_HISTORY = [
  { id: 'inv-h-001', date: daysAgo(0), type: 'Sale', product: 'Dusty Rose & Lavender Posy', sku: INVENTORY[0].sku, quantityChange: -1, stockAfter: INVENTORY[0].currentStock, reference: 'FA-84291', notes: 'Order fulfillment' },
  { id: 'inv-h-002', date: daysAgo(0), type: 'Sale', product: 'Pressed Botanical Wildflower Cards', sku: INVENTORY[1].sku, quantityChange: -1, stockAfter: INVENTORY[1].currentStock, reference: 'FA-84291', notes: 'Order fulfillment' },
  { id: 'inv-h-003', date: daysAgo(1), type: 'Restock', product: 'Gold Foil Pressed Botanical Stickers', sku: INVENTORY[6].sku, quantityChange: +20, stockAfter: INVENTORY[6].currentStock, reference: null, notes: 'Supplier delivery — batch #FL-2025-089' },
  { id: 'inv-h-004', date: daysAgo(1), type: 'Sale', product: 'Heirloom Keepsake Wooden Hamper Box', sku: INVENTORY[3].sku, quantityChange: -1, stockAfter: INVENTORY[3].currentStock, reference: 'FA-84276', notes: 'Order fulfillment' },
  { id: 'inv-h-005', date: daysAgo(2), type: 'Adjustment', product: 'Botanical Wax Seal Ritual Kit', sku: INVENTORY[9].sku, quantityChange: -2, stockAfter: INVENTORY[9].currentStock, reference: null, notes: 'Damaged in transit — written off' },
  { id: 'inv-h-006', date: daysAgo(3), type: 'Sale', product: 'Vintage Peony & Eucalyptus Posy', sku: INVENTORY[4].sku, quantityChange: -1, stockAfter: INVENTORY[4].currentStock, reference: 'FA-84254', notes: 'Order fulfillment' },
  { id: 'inv-h-007', date: daysAgo(5), type: 'Restock', product: 'Satin Velvet Ribbon (Dusty Rose)', sku: 'FL-RIBB-DR01', quantityChange: +15, stockAfter: 22, reference: null, notes: 'Supplier restock — batch #FL-2025-087' },
  { id: 'inv-h-008', date: daysAgo(7), type: 'Sale', product: 'Desk Bloom in Ceramic Pot', sku: INVENTORY[2].sku, quantityChange: -2, stockAfter: INVENTORY[2].currentStock, reference: 'FA-84190', notes: 'Multi-item order fulfillment' },
  { id: 'inv-h-009', date: daysAgo(10), type: 'Restock', product: 'Cotton Chenille Wire (Pink)', sku: 'FL-WIRE-PK01', quantityChange: +30, stockAfter: 42, reference: null, notes: 'Wholesale procurement' },
  { id: 'inv-h-010', date: daysAgo(12), type: 'Adjustment', product: 'Ivory Wrapping Paper', sku: 'FL-WRAP-IV01', quantityChange: -3, stockAfter: 8, reference: null, notes: 'Quality control rejection' },
];

// ─── Stock Adjustment Records ───
export const STOCK_ADJUSTMENTS = [
  { id: 'adj-001', date: daysAgo(0), product: 'Dusty Rose & Lavender Posy', type: 'Subtraction', quantity: -1, reason: 'Order fulfillment — FA-84291', handler: 'Handler Admin' },
  { id: 'adj-002', date: daysAgo(1), product: 'Botanical Wax Seal Ritual Kit', type: 'Subtraction', quantity: -2, reason: 'Damaged in transit — quality write-off', handler: 'Ananya Sen' },
  { id: 'adj-003', date: daysAgo(5), product: 'Satin Velvet Ribbon (Dusty Rose)', type: 'Addition', quantity: +15, reason: 'Supplier restock batch #FL-2025-087', handler: 'Handler Admin' },
  { id: 'adj-004', date: daysAgo(12), product: 'Ivory Wrapping Paper', type: 'Subtraction', quantity: -3, reason: 'Quality control rejection — batch #FL-2025-083', handler: 'Vikram Rao' },
];

// ─── Helper Functions ───
export function getOrderById(orderId) {
  return ORDERS.find(o => o.id === orderId) || null;
}

export function getCustomerById(customerId) {
  return CUSTOMERS.find(c => c.id === customerId) || null;
}

export function getCustomerOrders(customerId) {
  return ORDERS.filter(o => o.customerId === customerId);
}

export function getCollectionById(collectionId) {
  return COLLECTIONS.find(c => c.id === collectionId) || null;
}

export function getInventoryItem(productId) {
  return INVENTORY.find(i => i.productId === productId) || null;
}

export function getLowStockItems() {
  return INVENTORY.filter(i => i.status === 'Low Stock' || i.status === 'Critical');
}

// ─── Analytics Derivation ───
export function getAnalyticsSummary() {
  const totalRevenue = ORDERS.reduce((sum, o) => sum + o.total, 0);
  const totalOrders = ORDERS.length;
  const aov = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
  const deliveredOrders = ORDERS.filter(o => o.orderStatus === 'delivered').length;
  const totalCustomers = CUSTOMERS.length;
  const totalProducts = PRODUCTS.length;

  const categoryRevenue = {};
  ORDERS.forEach(order => {
    order.items.forEach(item => {
      const product = PRODUCTS.find(p => p.id === item.productId);
      const cat = product?.categoryLabel || product?.category || 'Other';
      categoryRevenue[cat] = (categoryRevenue[cat] || 0) + (item.price * item.quantity);
    });
  });

  return { totalRevenue, totalOrders, aov, deliveredOrders, totalCustomers, totalProducts, categoryRevenue };
}

export function getOrdersByStatus() {
  const counts = {};
  ORDER_STATUSES.forEach(s => { counts[s.key] = 0; });
  ORDERS.forEach(o => { if (counts[o.orderStatus] !== undefined) counts[o.orderStatus]++; });
  return counts;
}

// ─── Format Helpers ───
export function formatINR(amount) {
  return `₹${amount.toLocaleString('en-IN')}`;
}

export function formatDate(iso) {
  return formatShortDate(iso);
}

export function getStatusCounts() {
  const counts = getOrdersByStatus();
  return {
    total: ORDERS.length,
    new: counts.new || 0,
    confirmed: counts.confirmed || 0,
    inProduction: counts.in_production || 0,
    qualityCheck: counts.quality_check || 0,
    readyToDispatch: counts.ready_to_dispatch || 0,
    shipped: counts.shipped || 0,
    delivered: counts.delivered || 0,
  };
}
