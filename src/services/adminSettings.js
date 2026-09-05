// Flora Alchemy Admin & Handler Portal Settings & State Storage
const STORAGE_KEYS = {
  GENERAL: 'flora_alchemy_admin_general_settings',
  PREFERENCES: 'flora_alchemy_admin_store_preferences',
  USERS: 'flora_alchemy_admin_users'
};

export const INITIAL_GENERAL_SETTINGS = {
  storeName: 'Flora Alchemy',
  storeTagline: 'Handcrafted botanical arrangements, preserved floral keepsakes, and personalized gifting.',
  contactEmail: 'contact@flora-alchemy.demo',
  contactPhone: '+91 98765 43210 (Sample)',
  primaryCurrency: 'INR',
  primaryCurrencyLabel: 'Indian Rupee (INR · ₹)',
  timezone: 'Asia/Kolkata',
  currencyFormat: 'inr_lakh',
  dateFormat: 'dd_mmm_yyyy',
  timeFormat: '12h',
  firstDay: 'monday',
  storeStatus: true,
  ordersStatus: true,
  bespokeStatus: true,
  lastModified: 'Today at 10:42 AM IST'
};

export const INITIAL_STORE_PREFERENCES = {
  compactTable: false,
  rememberFilters: true,
  showSkeletons: true,
  confirmDestructive: true,
  themeAppearance: 'light',
  motionTransitions: true,
  informationDensity: 'comfortable',
  defaultDateRange: '30d',
  defaultOrdersTab: 'all',
  defaultInventoryFilter: 'all',
  defaultAnalyticsGranularity: 'daily',
  environmentBadges: true,
  confirmDataChanges: true,
  activityLogFeedback: true
};

export const INITIAL_ADMIN_USERS = [
  {
    id: 'usr-1',
    name: 'Handler Admin',
    initials: 'HA',
    title: 'Lead System Curator',
    role: 'ADMINISTRATOR',
    email: 'handler.admin@flora-alchemy.demo',
    status: 'ACTIVE',
    lastActivity: 'Just now'
  },
  {
    id: 'usr-2',
    name: 'Priya Sharma',
    initials: 'PS',
    title: 'Co-Founder & Administrator',
    role: 'ADMINISTRATOR',
    email: 'priya.s@flora-alchemy.demo',
    status: 'ACTIVE',
    lastActivity: '2 hours ago'
  },
  {
    id: 'usr-3',
    name: 'Vikram Rao',
    initials: 'VR',
    title: 'Order Fulfillment Handler',
    role: 'HANDLER',
    email: 'vikram.r@flora-alchemy.demo',
    status: 'ACTIVE',
    lastActivity: 'Yesterday'
  },
  {
    id: 'usr-4',
    name: 'Ananya Sen',
    initials: 'AS',
    title: 'Inventory Handler',
    role: 'HANDLER',
    email: 'ananya.s@flora-alchemy.demo',
    status: 'ACTIVE',
    lastActivity: '3 hours ago'
  },
  {
    id: 'usr-5',
    name: 'Rohan Patel',
    initials: 'RP',
    title: 'Operations Assistant',
    role: 'HANDLER',
    email: 'rohan.p@flora-alchemy.demo',
    status: 'INVITED',
    lastActivity: 'Invitation Sent'
  },
  {
    id: 'usr-6',
    name: 'Dev Kapoor',
    initials: 'DK',
    title: 'Former Handler',
    role: 'HANDLER',
    email: 'dev.k@flora-alchemy.demo',
    status: 'SUSPENDED',
    lastActivity: '2 weeks ago'
  }
];

function getStoredItem(key, fallback) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
}

function setStoredItem(key, val) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch {
    // Ignore quota errors
  }
}

export function getGeneralSettings() {
  return getStoredItem(STORAGE_KEYS.GENERAL, INITIAL_GENERAL_SETTINGS);
}

export function saveGeneralSettings(settings) {
  const updated = {
    ...settings,
    lastModified: `Today at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} IST`
  };
  setStoredItem(STORAGE_KEYS.GENERAL, updated);
  return updated;
}

export function resetGeneralSettings() {
  setStoredItem(STORAGE_KEYS.GENERAL, INITIAL_GENERAL_SETTINGS);
  return INITIAL_GENERAL_SETTINGS;
}

export function getStorePreferences() {
  return getStoredItem(STORAGE_KEYS.PREFERENCES, INITIAL_STORE_PREFERENCES);
}

export function saveStorePreferences(preferences) {
  setStoredItem(STORAGE_KEYS.PREFERENCES, preferences);
  return preferences;
}

export function resetStorePreferences() {
  setStoredItem(STORAGE_KEYS.PREFERENCES, INITIAL_STORE_PREFERENCES);
  return INITIAL_STORE_PREFERENCES;
}

export function getAdminUsers() {
  return getStoredItem(STORAGE_KEYS.USERS, INITIAL_ADMIN_USERS);
}

export function saveAdminUsers(users) {
  setStoredItem(STORAGE_KEYS.USERS, users);
  return users;
}

export function addAdminUser(newUser) {
  const users = getAdminUsers();
  const initials = newUser.name
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'OP';
  const created = {
    id: `usr-${Date.now()}`,
    name: newUser.name,
    initials,
    title: newUser.title || (newUser.role === 'ADMINISTRATOR' ? 'Platform Administrator' : 'Fulfillment Handler'),
    role: newUser.role || 'HANDLER',
    email: newUser.email,
    status: newUser.status || 'INVITED',
    lastActivity: 'Invitation Sent'
  };
  const updated = [created, ...users];
  saveAdminUsers(updated);
  return updated;
}

export function updateAdminUserStatus(userId, newStatus) {
  const users = getAdminUsers();
  const updated = users.map(u => u.id === userId ? { ...u, status: newStatus } : u);
  saveAdminUsers(updated);
  return updated;
}

export function deleteAdminUser(userId) {
  const users = getAdminUsers();
  const updated = users.filter(u => u.id !== userId);
  saveAdminUsers(updated);
  return updated;
}
