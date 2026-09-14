// Flora Alchemy Admin & Handler Portal local UI state.
//
// Phase 3D.5 (E-01): business/store settings (general, commerce, notifications)
// moved to settingsService → PATCH /api/settings → MongoDB.
// Phase 14: operator/access management moved to adminUserService →
// /api/admin/users → MongoDB (the old localStorage roster was removed —
// see backend adminUserRoutes/controller for the real operator API).
//
// What remains here is ONLY per-operator UI preferences (theme, density,
// defaults) — device-local by design, never a business source of truth.
const STORAGE_KEYS = {
  PREFERENCES: 'flora_alchemy_admin_store_preferences'
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
