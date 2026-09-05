import { getStored, setStored } from './storage.js';
import { PRODUCTS } from '../data/products.js';

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

export const INITIAL_CUSTOMERS = [DEMO_CUSTOMER];

export function getCustomers() {
  if (!getStored(STORAGE_KEY, null)) {
    setStored(STORAGE_KEY, [...INITIAL_CUSTOMERS]);
  }
  return getStored(STORAGE_KEY, [...INITIAL_CUSTOMERS]);
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

export function getAccount() {
  if (!getStored(ACCOUNT_KEY, null)) {
    setStored(ACCOUNT_KEY, { ...DEMO_CUSTOMER, customerId: DEMO_CUSTOMER.id });
  }
  return getStored(ACCOUNT_KEY, { ...DEMO_CUSTOMER, customerId: DEMO_CUSTOMER.id });
}

export function setAccount(accountData) {
  const current = getAccount();
  const updated = { ...current, ...accountData, customerId: current.customerId || current.id };
  setStored(ACCOUNT_KEY, updated);
  return updated;
}

export function getActiveCustomerId() {
  const account = getAccount();
  return account.customerId || account.id || DEMO_CUSTOMER.id;
}

export function getActiveCustomer() {
  const account = getAccount();
  const customerId = account.customerId || account.id || DEMO_CUSTOMER.id;
  return getCustomerById(customerId) || DEMO_CUSTOMER;
}
