import { getStored, setStored, clearStored } from './storage.js';
import { PRODUCTS } from '../data/products.js';
import { api, setToken, clearToken } from './apiClient.js';

const STORAGE_KEY = 'flora_alchemy_customers';
const ACCOUNT_KEY = 'flora_alchemy_account';

function daysAgo(d) {
  const dt = new Date();
  dt.setDate(dt.getDate() - d);
  return dt.toISOString();
}

function generateCustomerId() {
  return `cust-${Date.now()}`;
}

const DEMO_CUSTOMER = {
  id: 'cust-demo-001',
  name: 'Demo Customer',
  email: 'customer@example.com',
  phone: '+91 98000 00000',
  password: 'demo1234',
  status: 'Active',
  createdAt: daysAgo(30),
  preferences: {
    newsletter: true,
    notifications: true,
  },
  addresses: [
    {
      id: 'addr-1',
      label: 'Home',
      name: 'Demo Customer',
      address: 'Bandra West',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400050',
      phone: '+91 98000 00000',
      isDefault: true,
    },
  ],
  totalSpend: 0,
  orderCount: 0,
};

const SAMPLE_CUSTOMERS = [
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

const INITIAL_CUSTOMERS = [DEMO_CUSTOMER, ...SAMPLE_CUSTOMERS];

export function getCustomers() {
  const stored = getStored(STORAGE_KEY, null);
  if (!stored) {
    setStored(STORAGE_KEY, INITIAL_CUSTOMERS);
    return INITIAL_CUSTOMERS;
  }
  // Light migration: keep the demo helper account usable by backfilling the
  // credential fields added in later versions of the seed.
  const demoIdx = stored.findIndex(c => c.email === DEMO_CUSTOMER.email);
  if (demoIdx !== -1 && !stored[demoIdx].password) {
    const updated = [...stored];
    updated[demoIdx] = { ...updated[demoIdx], password: DEMO_CUSTOMER.password };
    setStored(STORAGE_KEY, updated);
    return updated;
  }
  return stored;
}

export function getCustomerById(customerId) {
  const customers = getCustomers();
  return customers.find(c => c.id === customerId) || null;
}

export function getCustomerByEmail(email) {
  const customers = getCustomers();
  return customers.find(c => c.email.toLowerCase() === email.toLowerCase()) || null;
}

export function createCustomer(data) {
  const customers = getCustomers();
  const existing = customers.find(c => c.email.toLowerCase() === data.email.toLowerCase());
  if (existing) {
    return { customer: existing, created: false };
  }

  const newCustomer = {
    id: generateCustomerId(),
    name: data.name || 'Guest Customer',
    email: data.email,
    phone: data.phone || '',
    password: data.password || '',
    status: 'Active',
    createdAt: new Date().toISOString(),
    preferences: {
      newsletter: data.newsletter ?? true,
      notifications: data.notifications ?? true,
    },
    addresses: data.address ? [{
      id: 'addr-1',
      label: 'Home',
      name: data.name || 'Customer',
      address: data.address || '',
      city: data.city || '',
      state: data.state || '',
      pincode: data.pincode || '',
      phone: data.phone || '',
      isDefault: true,
    }] : [],
    totalSpend: 0,
    orderCount: 0,
  };

  const updated = [newCustomer, ...customers];
  setStored(STORAGE_KEY, updated);
  return { customer: newCustomer, created: true };
}

export function updateCustomer(customerId, updates) {
  const customers = getCustomers();
  const idx = customers.findIndex(c => c.id === customerId);
  if (idx === -1) return null;

  const updated = [...customers];
  updated[idx] = { ...updated[idx], ...updates };
  setStored(STORAGE_KEY, updated);
  return updated[idx];
}

export function addOrderToCustomer(customerId, orderTotal) {
  const customers = getCustomers();
  const idx = customers.findIndex(c => c.id === customerId);
  if (idx === -1) return;

  const updated = [...customers];
  updated[idx] = {
    ...updated[idx],
    orderCount: (updated[idx].orderCount || 0) + 1,
    totalSpend: (updated[idx].totalSpend || 0) + (orderTotal || 0),
  };
  setStored(STORAGE_KEY, updated);
}

// ─── Customer session (explicit auth only) ───
// A fresh browser starts as GUEST: no session is created implicitly and
// sample/demo customer records never become the active identity on their own.
export function getAccount() {
  return getStored(ACCOUNT_KEY, null);
}

export function setAccount(accountData) {
  const current = getAccount() || {};
  const updated = {
    ...current,
    ...accountData,
    // An explicit identity from auth (register/login) always wins,
    // so the session points at the canonical customer record.
    customerId: accountData.customerId || current.customerId || null,
  };
  setStored(ACCOUNT_KEY, updated);
  return updated;
}

export function logoutAccount() {
  clearStored(ACCOUNT_KEY);
}

export function getActiveCustomerId() {
  const account = getAccount();
  return account?.customerId ?? null;
}

export function getActiveCustomer() {
  const customerId = getActiveCustomerId();
  if (!customerId) return null;
  return getCustomerById(customerId);
}

// Prototype credential check against the locally stored customer records.
// Returns { customer } on success or { error } with a truthful message.
export function authenticateCustomer(email, password) {
  const customer = getCustomerByEmail(email);
  if (!customer) {
    return { error: 'No account found with this email. Create an account to continue.' };
  }
  if (!customer.password) {
    return { error: 'This account has no password set. Use “Forgot password” to set one.' };
  }
  if (customer.password !== password) {
    return { error: 'Incorrect password. Please try again.' };
  }
  return { customer };
}

// ─── Real API authentication (Phase 3B) ───
// The server (Express + MongoDB) validates credentials with bcrypt and issues
// a JWT. A fresh browser stays GUEST until an explicit login/registration
// succeeds; demo fixture records never auto-authenticate.

async function applyAuthSession({ token, user, customer }) {
  setToken(token, 'customer');
  if (customer) {
    setAccount({
      name: customer.name,
      email: customer.email,
      phone: customer.phone || '',
      customerId: customer.id,
    });
  }
  return { user, customer };
}

export async function apiLogin(email, password) {
  const res = await api.post('/auth/login', { email, password });
  if (!res.ok) {
    return {
      error: res.message || 'Sign in failed. Please try again.',
      code: res.code,
      status: res.status,
    };
  }
  await applyAuthSession(res.data);
  return { success: true, ...res.data };
}

export async function apiRegister({ name, email, password, phone }) {
  const res = await api.post('/auth/register', { name, email, password, phone });
  if (!res.ok) {
    return {
      error: res.message || 'Registration failed. Please try again.',
      code: res.code,
      status: res.status,
    };
  }
  await applyAuthSession(res.data);
  return { success: true, created: res.status === 201, ...res.data };
}

export async function apiLogout() {
  try {
    await api.post('/auth/logout', {}); // stateless; best-effort
  } catch {
    /* ignore */
  }
  clearToken('customer');
  logoutAccount();
}
