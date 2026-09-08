import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  hydratePublic,
  hydrateAdmin,
  hydrateCustomer,
  clearSessionData,
  hasAdminSessionScope,
  hasCustomerSessionScope,
} from '../services/dataStore.js';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const location = useLocation();
  const [status, setStatus] = useState('loading'); // 'loading' | 'ready' | 'error'
  const [error, setError] = useState('');
  const [tick, setTick] = useState(0);
  const syncing = useRef(false);

  const isAuthPage = location.pathname === '/login' || location.pathname === '/admin/login';

  const sync = async () => {
    if (syncing.current) return;
    syncing.current = true;
    setStatus('loading');
    try {
      await hydratePublic();
      const admin = hasAdminSessionScope();
      const customer = hasCustomerSessionScope();
      if (admin) await hydrateAdmin();
      if (customer && !admin) await hydrateCustomer();
      if (!customer && !admin) clearSessionData();
      setStatus('ready');
    } catch (err) {
      console.error('[data] hydration failed', err);
      setError(err.message || 'Unable to load data from the server.');
      setStatus('error');
    } finally {
      syncing.current = false;
    }
  };

  // Hydrate on mount, on route change, and whenever auth/data signals fire.
  useEffect(() => {
    const timer = setTimeout(sync, 0);
    const onRefresh = () => {
      clearTimeout(timer);
      sync();
    };
    window.addEventListener('fa:refresh', onRefresh);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('fa:refresh', onRefresh);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, tick]);

  const value = useMemo(
    () => ({
      status,
      error,
      ready: status === 'ready',
      retry: () => setTick((t) => t + 1),
    }),
    [status, error]
  );

  if (isAuthPage) {
    // Auth screens need nothing from the store until submit — never block them.
    return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
  }

  if (status === 'loading') {
    return (
      <DataContext.Provider value={value}>
        <div className="min-h-screen bg-[#fcf9f4] flex items-center justify-center">
          <div className="text-center space-y-3 px-6">
            <div className="mx-auto w-10 h-10 rounded-full border-2 border-[#e5d8cd] border-t-[#964735] animate-spin" />
            <p className="font-serif text-[18px] text-[#4e4540]">Loading Flora Alchemy…</p>
          </div>
        </div>
      </DataContext.Provider>
    );
  }

  if (status === 'error') {
    return (
      <DataContext.Provider value={value}>
        <div className="min-h-screen bg-[#fcf9f4] flex items-center justify-center px-6">
          <div className="max-w-md text-center space-y-4">
            <p className="text-[40px]">🌿</p>
            <h1 className="font-serif text-[24px] text-[#180f0a]">We couldn’t reach the studio server</h1>
            <p className="text-[14px] text-[#4e4540]">{error}</p>
            <p className="text-[13px] text-[#80756f]">
              Start the API server (see <code className="text-[#964735]">.freebuff/run.md</code>) then retry.
            </p>
            <button
              type="button"
              onClick={() => setTick((t) => t + 1)}
              className="px-6 py-2.5 rounded-full bg-[#180f0a] text-white text-[14px] font-semibold hover:bg-[#964735] transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </DataContext.Provider>
    );
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}

export { hasAdminSessionScope, hasCustomerSessionScope } from '../services/dataStore.js';
