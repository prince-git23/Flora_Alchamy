import React, { createContext, useContext, useState } from 'react';
import { adminLogin, adminLogout, getAdminSession } from '../services/authService.js';

const AdminSessionContext = createContext(null);

export function AdminSessionProvider({ children }) {
  const [session, setSession] = useState(() => getAdminSession());

  const login = (email, password) => {
    const result = adminLogin(email, password);
    if (result.success) {
      setSession(result.session);
    }
    return result;
  };

  const logout = () => {
    adminLogout();
    setSession(null);
  };

  const isAuthenticated = session !== null;

  return (
    <AdminSessionContext.Provider value={{ session, isAuthenticated, login, logout }}>
      {children}
    </AdminSessionContext.Provider>
  );
}

export function useAdminSession() {
  const context = useContext(AdminSessionContext);
  if (!context) {
    throw new Error('useAdminSession must be used within AdminSessionProvider');
  }
  return context;
}
