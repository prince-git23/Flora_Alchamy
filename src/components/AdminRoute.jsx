import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAdminSession } from '../context/AdminSessionContext.jsx';

export default function AdminRoute({ children }) {
  const { isAuthenticated } = useAdminSession();

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
