import { PRODUCTS } from '../data/products.js';

const STORAGE_KEYS = {
  CART: 'flora_alchemy_cart',
  WISHLIST: 'flora_alchemy_wishlist',
  ORDERS: 'flora_alchemy_orders',
  ACCOUNT: 'flora_alchemy_account'
};

function getFormattedPastDate(daysAgo) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

const DEFAULT_ACCOUNT = {
  name: 'Demo Customer',
  email: 'customer@example.com',
  phone: '+91 98000 00000',
  city: 'Mumbai',
  state: 'Maharashtra',
  pincode: '400050',
  address: 'Bandra West',
  memberSince: 'Member',
  activeOrdersCount: 1,
  savedNotes: [
    {
      id: 'note-1',
      recipient: 'Demo Customer',
      message: 'May these handcrafted botanicals bring lasting beauty and calm to your home. Warmest regards.',
      waxSeal: 'Terracotta Blossom',
      occasion: 'Just Because & Keepsake Love'
    }
  ]
};

const INITIAL_CART = [
  {
    id: 'dusty-rose-lavender-posy',
    name: 'The Dusty Rose & Lavender Dream Posy',
    price: 1850,
    quantity: 1,
    image: PRODUCTS[0].images[0],
    category: 'Sculptural Bouquet',
    palette: 'Rose & Lilac Palette',
    ribbon: 'Silk Rose Ribbon',
    giftMessage: 'For Demo Customer — Everlasting joy'
  },
  {
    id: 'pressed-wildflower-cards',
    name: 'Pressed Botanical Wildflower Cards (Set of 4)',
    price: 850,
    quantity: 1,
    image: PRODUCTS[1].images[0],
    category: 'Archival Papercraft',
    seal: 'Copper Shimmer',
    paper: 'Deckled 350gsm Cotton'
  }
];

const INITIAL_WISHLIST = [
  'dusty-rose-lavender-posy',
  'heirloom-keepsake-hamper',
  'gold-foil-pressed-stickers',
  'desk-bloom-ceramic-pot'
];

const INITIAL_ORDERS = [
  {
    orderId: 'FA-1024',
    trackingNumber: 'DEMO-TRACK-1024',
    date: getFormattedPastDate(3),
    status: 'Being Crafted', // 'Order Confirmed', 'Being Crafted', 'Packed', 'Out for Delivery', 'Delivered'
    statusStep: 2, // 1 to 5
    total: 2700,
    paymentMethod: 'UPI',
    items: [
      {
        id: 'dusty-rose-lavender-posy',
        name: 'The Dusty Rose & Lavender Dream Posy',
        price: 1850,
        quantity: 1,
        image: PRODUCTS[0].images[0],
        customizations: ['Rose & Lilac Palette', 'Silk Rose Ribbon', 'Calligraphy Tag: "For Demo Customer"']
      },
      {
        id: 'pressed-wildflower-cards',
        name: 'Pressed Botanical Wildflower Cards (Set of 4)',
        price: 850,
        quantity: 1,
        image: PRODUCTS[1].images[0],
        customizations: ['Copper Wax Seal', 'Hand-Deckled Cotton Rag Card']
      }
    ],
    delivery: {
      recipientName: 'Demo Customer',
      address: 'Bandra West',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400050',
      phone: '+91 98000 00000',
      shippingType: 'Standard Pan-India (Complimentary)'
    },
    giftNote: {
      message: 'May these handcrafted botanicals bring lasting beauty and calm to your home. Warmest regards.',
      waxSeal: 'Terracotta Blossom'
    }
  },
  {
    orderId: 'FA-0912',
    trackingNumber: 'DEMO-TRACK-0912',
    date: getFormattedPastDate(21),
    status: 'Delivered',
    statusStep: 4,
    total: 1250,
    paymentMethod: 'Credit/Debit Card',
    items: [
      {
        id: 'desk-bloom-ceramic-pot',
        name: 'Desk Bloom in Ceramic Pot',
        price: 1250,
        quantity: 1,
        image: PRODUCTS[2].images[0],
        customizations: ['Single Sculptural Stem · Sand Glaze']
      }
    ],
    delivery: {
      recipientName: 'Demo Customer',
      address: 'Bandra West',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400050',
      phone: '+91 98000 00000'
    }
  }
];

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

export async function getProducts(filter = {}) {
  let list = [...PRODUCTS];
  if (filter.category && filter.category !== 'all') {
    list = list.filter(p => p.category === filter.category);
  }
  if (filter.search) {
    const q = filter.search.toLowerCase().trim();
    list = list.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.description.toLowerCase().includes(q) ||
      p.tags.some(t => t.toLowerCase().includes(q))
    );
  }
  if (filter.maxPrice) {
    list = list.filter(p => p.price <= filter.maxPrice);
  }
  if (filter.sort) {
    if (filter.sort === 'price-asc') list.sort((a, b) => a.price - b.price);
    if (filter.sort === 'price-desc') list.sort((a, b) => b.price - a.price);
    if (filter.sort === 'rating') list.sort((a, b) => b.rating - a.rating);
  }
  return list;
}

export async function getProductById(id) {
  return PRODUCTS.find(p => p.id === id) || null;
}

export async function getWishlist() {
  const ids = getStored(STORAGE_KEYS.WISHLIST, INITIAL_WISHLIST);
  return PRODUCTS.filter(p => ids.includes(p.id));
}

export async function addToWishlist(productId) {
  const current = getStored(STORAGE_KEYS.WISHLIST, INITIAL_WISHLIST);
  if (!current.includes(productId)) {
    const updated = [...current, productId];
    setStored(STORAGE_KEYS.WISHLIST, updated);
    return updated;
  }
  return current;
}

export async function removeFromWishlist(productId) {
  const current = getStored(STORAGE_KEYS.WISHLIST, INITIAL_WISHLIST);
  const updated = current.filter(id => id !== productId);
  setStored(STORAGE_KEYS.WISHLIST, updated);
  return updated;
}

export async function getCart() {
  return getStored(STORAGE_KEYS.CART, INITIAL_CART);
}

export async function updateCart(items) {
  setStored(STORAGE_KEYS.CART, items);
  return items;
}

export async function addToCart(product, options = {}) {
  const cart = await getCart();
  const quantity = options.quantity || 1;
  const existingIdx = cart.findIndex(item => item.id === product.id && item.palette === options.palette && item.ribbon === options.ribbon);

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
      image: product.images ? product.images[0] : (product.image || ''),
      category: product.categoryLabel || product.category || 'Handcrafted Flora',
      palette: options.palette || null,
      ribbon: options.ribbon || null,
      giftMessage: options.giftMessage || null,
      customDetails: options.customDetails || null
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

export async function getOrders() {
  return getStored(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
}

export async function getOrder(orderId) {
  if (!orderId) return null;
  const orders = await getOrders();
  return orders.find(o => o.orderId === orderId || o.trackingNumber === orderId) || null;
}

export async function createOrder(orderPayload) {
  if (!orderPayload.items || orderPayload.items.length === 0) {
    throw new Error('Cannot create an order with an empty bag.');
  }

  const orders = await getOrders();
  const newOrderId = `FA-${Math.floor(1000 + Math.random() * 9000)}`;
  const newTrackingId = `DEMO-TRACK-${newOrderId.split('-')[1]}`;
  
  const newOrder = {
    orderId: newOrderId,
    trackingNumber: newTrackingId,
    date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
    status: 'Order Confirmed',
    statusStep: 1,
    total: orderPayload.total,
    paymentMethod: orderPayload.paymentMethod || 'UPI',
    items: orderPayload.items || [],
    delivery: orderPayload.delivery || DEFAULT_ACCOUNT,
    giftNote: orderPayload.giftNote || {
      message: 'May these handcrafted botanicals bring lasting beauty and calm to your home.',
      waxSeal: 'Terracotta Blossom'
    }
  };

  const updatedOrders = [newOrder, ...orders];
  setStored(STORAGE_KEYS.ORDERS, updatedOrders);
  // Clear cart after order creation
  setStored(STORAGE_KEYS.CART, []);
  return newOrder;
}

export async function getAccount() {
  return getStored(STORAGE_KEYS.ACCOUNT, DEFAULT_ACCOUNT);
}

export async function updateAccount(accountData) {
  const current = await getAccount();
  const updated = { ...current, ...accountData };
  setStored(STORAGE_KEYS.ACCOUNT, updated);
  return updated;
}
