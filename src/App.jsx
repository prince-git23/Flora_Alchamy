import React, { useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import PromoBar from './components/PromoBar.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';

import HomePage from './pages/HomePage.jsx';
import ShopPage from './pages/ShopPage.jsx';
import ProductPage from './pages/ProductPage.jsx';
import CustomGiftsPage from './pages/CustomGiftsPage.jsx';
import CartPage from './pages/CartPage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';
import OrderSuccessPage from './pages/OrderSuccessPage.jsx';
import OrderTrackingPage from './pages/OrderTrackingPage.jsx';
import AccountPage from './pages/AccountPage.jsx';
import WishlistPage from './pages/WishlistPage.jsx';
import SearchPage from './pages/SearchPage.jsx';
import CollectionsPage from './pages/CollectionsPage.jsx';
import OurCreationsPage from './pages/OurCreationsPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

// Admin / Handler Pages (Phase 2A)
import AdminDashboardPage from './pages/admin/AdminDashboardPage.jsx';
import AdminAccessPage from './pages/admin/AdminAccessPage.jsx';
import AdminGeneralSettingsPage from './pages/admin/AdminGeneralSettingsPage.jsx';
import AdminStorePreferencesPage from './pages/admin/AdminStorePreferencesPage.jsx';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen bg-[#fcf9f4] text-[#1c1c19] selection:bg-[#ffdad3] selection:text-[#772f1f]">
      <ScrollToTop />
      {!isAdminRoute && <PromoBar />}
      {!isAdminRoute && <Navbar />}

      <main className="flex-grow">
        <Routes>
          {/* Storefront Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/custom-gifts" element={<CustomGiftsPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-success/:orderId" element={<OrderSuccessPage />} />
          <Route path="/order-success" element={<OrderSuccessPage />} />
          <Route path="/order-tracking/:orderId" element={<OrderTrackingPage />} />
          <Route path="/order-tracking" element={<OrderTrackingPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/collections" element={<CollectionsPage />} />
          <Route path="/our-creations" element={<OurCreationsPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Admin / Handler Portal Routes (Phase 2A) */}
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin/access" element={<AdminAccessPage />} />
          <Route path="/admin/settings" element={<AdminGeneralSettingsPage />} />
          <Route path="/admin/store-preferences" element={<AdminStorePreferencesPage />} />

          {/* Wildcard Fallback */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      {!isAdminRoute && <Footer />}
    </div>
  );
}
