import React, { useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import PromoBar from './components/PromoBar.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import AdminRoute from './components/AdminRoute.jsx';

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

// Admin / Handler Pages
import AdminDashboardPage from './pages/admin/AdminDashboardPage.jsx';
import AdminOrdersPage from './pages/admin/AdminOrdersPage.jsx';
import AdminOrderDetailPage from './pages/admin/AdminOrderDetailPage.jsx';
import AdminProductsPage from './pages/admin/AdminProductsPage.jsx';
import AdminProductDetailPage from './pages/admin/AdminProductDetailPage.jsx';
import AdminCollectionsPage from './pages/admin/AdminCollectionsPage.jsx';
import AdminCollectionDetailPage from './pages/admin/AdminCollectionDetailPage.jsx';
import AdminCustomersPage from './pages/admin/AdminCustomersPage.jsx';
import AdminCustomerDetailPage from './pages/admin/AdminCustomerDetailPage.jsx';
import AdminInventoryPage from './pages/admin/AdminInventoryPage.jsx';
import AdminStockManagementPage from './pages/admin/AdminStockManagementPage.jsx';
import AdminStockAdjustmentPage from './pages/admin/AdminStockAdjustmentPage.jsx';
import AdminLowStockPage from './pages/admin/AdminLowStockPage.jsx';
import AdminInventoryHistoryPage from './pages/admin/AdminInventoryHistoryPage.jsx';
import AdminAnalyticsOverviewPage from './pages/admin/AdminAnalyticsOverviewPage.jsx';
import AdminSalesRevenuePage from './pages/admin/AdminSalesRevenuePage.jsx';
import AdminPerformancePage from './pages/admin/AdminPerformancePage.jsx';
import AdminGeneralSettingsPage from './pages/admin/AdminGeneralSettingsPage.jsx';
import AdminCommerceSettingsPage from './pages/admin/AdminCommerceSettingsPage.jsx';
import AdminAccessPage from './pages/admin/AdminAccessPage.jsx';
import AdminNotificationsPage from './pages/admin/AdminNotificationsPage.jsx';
import AdminStorePreferencesPage from './pages/admin/AdminStorePreferencesPage.jsx';
import AdminLoginPage from './pages/admin/AdminLoginPage.jsx';
import AdminCreateOrderPage from './pages/admin/AdminCreateOrderPage.jsx';
import AdminCreateProductPage from './pages/admin/AdminCreateProductPage.jsx';

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

          {/* Admin / Handler Portal Routes */}
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />
          {/* Commerce */}
          <Route path="/admin/orders" element={<AdminRoute><AdminOrdersPage /></AdminRoute>} />
          <Route path="/admin/orders/:orderId" element={<AdminRoute><AdminOrderDetailPage /></AdminRoute>} />
          <Route path="/admin/orders/new" element={<AdminRoute><AdminCreateOrderPage /></AdminRoute>} />
          <Route path="/admin/products" element={<AdminRoute><AdminProductsPage /></AdminRoute>} />
          <Route path="/admin/products/:productId" element={<AdminRoute><AdminProductDetailPage /></AdminRoute>} />
          <Route path="/admin/products/new" element={<AdminRoute><AdminCreateProductPage /></AdminRoute>} />
          <Route path="/admin/collections" element={<AdminRoute><AdminCollectionsPage /></AdminRoute>} />
          <Route path="/admin/collections/:collectionId" element={<AdminRoute><AdminCollectionDetailPage /></AdminRoute>} />
          {/* Operations */}
          <Route path="/admin/customers" element={<AdminRoute><AdminCustomersPage /></AdminRoute>} />
          <Route path="/admin/customers/:customerId" element={<AdminRoute><AdminCustomerDetailPage /></AdminRoute>} />
          <Route path="/admin/inventory" element={<AdminRoute><AdminInventoryPage /></AdminRoute>} />
          <Route path="/admin/inventory/stock" element={<AdminRoute><AdminStockManagementPage /></AdminRoute>} />
          <Route path="/admin/inventory/adjust" element={<AdminRoute><AdminStockAdjustmentPage /></AdminRoute>} />
          <Route path="/admin/inventory/low-stock" element={<AdminRoute><AdminLowStockPage /></AdminRoute>} />
          <Route path="/admin/inventory/history" element={<AdminRoute><AdminInventoryHistoryPage /></AdminRoute>} />
          {/* Insights */}
          <Route path="/admin/analytics" element={<AdminRoute><AdminAnalyticsOverviewPage /></AdminRoute>} />
          <Route path="/admin/analytics/sales" element={<AdminRoute><AdminSalesRevenuePage /></AdminRoute>} />
          <Route path="/admin/analytics/performance" element={<AdminRoute><AdminPerformancePage /></AdminRoute>} />
          {/* System */}
          <Route path="/admin/settings" element={<AdminRoute><AdminGeneralSettingsPage /></AdminRoute>} />
          <Route path="/admin/settings/commerce" element={<AdminRoute><AdminCommerceSettingsPage /></AdminRoute>} />
          <Route path="/admin/access" element={<AdminRoute><AdminAccessPage /></AdminRoute>} />
          <Route path="/admin/settings/notifications" element={<AdminRoute><AdminNotificationsPage /></AdminRoute>} />
          <Route path="/admin/store-preferences" element={<AdminRoute><AdminStorePreferencesPage /></AdminRoute>} />

          {/* Wildcard Fallback */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      {!isAdminRoute && <Footer />}
    </div>
  );
}
