import { getStored, setStored } from './storage.js';
import { PRODUCTS } from '../data/products.js';

const STORAGE_KEY = 'flora_alchemy_collections';

function daysAgo(d) {
  const dt = new Date();
  dt.setDate(dt.getDate() - d);
  return dt.toISOString();
}

const INITIAL_COLLECTIONS = [
  { id: 'col-festival', name: 'Festival Celebrations', description: 'Handcrafted floral keepsakes curated for festive occasions and ceremonial gifting.', coverImage: PRODUCTS[7].images[0], productIds: ['rakhi-everlasting-bloom-set', 'heirloom-keepsake-hamper', 'botanical-wax-seal-kit'], visibility: 'Public', productCount: 3, createdAt: daysAgo(30) },
  { id: 'col-signature', name: 'Signature Posies', description: 'Our best-selling botanical posy collection featuring the finest chenille floral artistry.', coverImage: PRODUCTS[0].images[0], productIds: ['dusty-rose-lavender-posy', 'vintage-peony-eucalyptus-posy'], visibility: 'Public', productCount: 2, createdAt: daysAgo(60) },
  { id: 'col-stationery', name: 'Botanical Stationery', description: 'Handmade cards, pressed flower ephemera, and wax-sealed correspondence sets.', coverImage: PRODUCTS[1].images[0], productIds: ['pressed-wildflower-cards', 'gold-foil-pressed-stickers', 'botanical-wax-seal-kit'], visibility: 'Public', productCount: 3, createdAt: daysAgo(45) },
  { id: 'col-desk', name: 'Desk & Living', description: 'Charming desk blooms, ceramic vessels, and botanical tools for everyday elegance.', coverImage: PRODUCTS[2].images[0], productIds: ['desk-bloom-ceramic-pot', 'heirloom-brass-snipping-shears'], visibility: 'Public', productCount: 2, createdAt: daysAgo(20) },
];

export function getCollections() {
  if (!getStored(STORAGE_KEY, null)) {
    setStored(STORAGE_KEY, INITIAL_COLLECTIONS);
  }
  return getStored(STORAGE_KEY, INITIAL_COLLECTIONS);
}

export function getCollectionById(id) {
  return getCollections().find(c => c.id === id) || null;
}

export function getCollectionProducts(id) {
  const collection = getCollectionById(id);
  if (!collection) return [];
  const products = PRODUCTS;
  return collection.productIds.map(pid => products.find(p => p.id === pid)).filter(Boolean);
}

export function createCollection(data) {
  const collections = getCollections();
  const newCollection = {
    id: data.id || `col-${Date.now()}`,
    name: data.name,
    description: data.description || '',
    coverImage: data.coverImage || '',
    productIds: data.productIds || [],
    visibility: data.visibility || 'Public',
    productCount: data.productIds?.length || 0,
    createdAt: new Date().toISOString(),
  };
  const updated = [newCollection, ...collections];
  setStored(STORAGE_KEY, updated);
  return newCollection;
}
