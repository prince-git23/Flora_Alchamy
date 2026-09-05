import { getStored, setStored, clearStored } from './storage.js';
import { getCustomerByEmail, createCustomer } from './customerService.js';

const CUSTOMER_SESSION_KEY = 'flora_alchemy_customer_session';
const ADMIN_SESSION_KEY = 'flora_alchemy_admin_session';

// ─── Customer Auth ───

const DEMO_CUSTOMER_EMAIL = 'customer@example.com';
const DEMO_CUSTOMER_PASSWORD = 'demo1234';

export function customerLogin(email, password) {
  if (email === DEMO_CUSTOMER_EMAIL && password === DEMO_CUSTOMER_PASSWORD) {
    const session = {
      email,
      customerId: 'cust-demo-001',
      name: 'Demo Customer',
      loggedInAt: new Date().toISOString(),
    };
    setStored(CUSTOMER_SESSION_KEY, session);
    return { success: true, session };
  }

  // For demo: accept any valid email/password combination
  if (email && password && password.length >= 6) {
    const { customer } = createCustomer({ email, name: email.split('@')[0], phone: '' });
    const session = {
      email,
      customerId: customer.id,
      name: customer.name,
      loggedInAt: new Date().toISOString(),
    };
    setStored(CUSTOMER_SESSION_KEY, session);
    return { success: true, session };
  }

  return { success: false, error: 'Invalid credentials. Use demo account or any email with 6+ character password.' };
}

export function customerRegister(name, email, password, phone) {
  if (!email || !password || password.length < 6) {
    return { success: false, error: 'Email and password (6+ characters) required.' };
  }

  const { customer, created } = createCustomer({ name, email, phone });
  const session = {
    email,
    customerId: customer.id,
    name: customer.name,
    loggedInAt: new Date().toISOString(),
  };
  setStored(CUSTOMER_SESSION_KEY, session);
  return { success: true, session, isNew: created };
}

export function getCustomerSession() {
  try {
    const stored = localStorage.getItem(CUSTOMER_SESSION_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export function customerLogout() {
  clearStored(CUSTOMER_SESSION_KEY);
}

// ─── Admin Auth ───

const DEMO_ADMIN_EMAIL = 'handler.admin@flora-alchemy.demo';
const DEMO_ADMIN_PASSWORD = 'handler1234';

export function adminLogin(email, password) {
  if (email === DEMO_ADMIN_EMAIL && password === DEMO_ADMIN_PASSWORD) {
    const session = {
      email,
      name: 'Handler Admin',
      role: 'ADMINISTRATOR',
      loggedInAt: new Date().toISOString(),
    };
    setStored(ADMIN_SESSION_KEY, session);
    return { success: true, session };
  }
  return { success: false, error: 'Invalid handler credentials. Demo: handler.admin@flora-alchemy.demo / handler1234' };
}

export function getAdminSession() {
  try {
    const stored = localStorage.getItem(ADMIN_SESSION_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export function adminLogout() {
  clearStored(ADMIN_SESSION_KEY);
}

export function isAdminAuthenticated() {
  return getAdminSession() !== null;
}

export function isCustomerAuthenticated() {
  return getCustomerSession() !== null;
}
