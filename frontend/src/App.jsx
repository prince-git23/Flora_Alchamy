import React, { useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import PromoBar from './components/PromoBar.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import MinimalHeader from './components/MinimalHeader.jsx';
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
import OurStoryPage from './pages/OurStoryPage.jsx';
import HowItsMadePage from './pages/HowItsMadePage.jsx';
import CustomRequestPage from './pages/CustomRequestPage.jsx';
import FloraJournalPage from './pages/FloraJournalPage.jsx';
import GiftFinderPage from './pages/GiftFinderPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import ConversationPage from './pages/ConversationPage.jsx';

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
import AdminCustomRequestsPage from './pages/admin/AdminCustomRequestsPage.jsx';
import AdminCustomRequestDetailPage from './pages/admin/AdminCustomRequestDetailPage.jsx';
import AdminConversationsPage from './pages/admin/AdminConversationsPage.jsx';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const { pathname } = location;
  const isAdminRoute = pathname.startsWith('/admin');
  // Conversion/auth pages get a focused minimal header instead of the
  // full marketing navigation — the customer stays in the purchase flow.
  const isMinimalRoute = pathname.startsWith('/checkout') || pathname === '/login';

  // Session hardening: when the backend rejects a token (401), the app
  // clears that session and returns the user to the right login screen.
  // Checkout context is preserved so a mid-purchase session expiry returns
  // the customer to checkout after re-authentication.
  useEffect(() => {
    const onAuthExpired = (e) => {
      const scope = e && e.detail && e.detail.scope;
      if (scope === 'admin') {
        if (pathname !== '/admin/login') navigate('/admin/login', { replace: true });
      } else if (scope === 'customer') {
        if (pathname === '/login') return;
        const redirect = pathname.startsWith('/checkout') ? '?redirect=/checkout' : '';
        navigate(`/login${redirect}`, { replace: true });
      }
    };
    window.addEventListener('fa:auth-expired', onAuthExpired);
    return () => window.removeEventListener('fa:auth-expired', onAuthExpired);
  }, [pathname, navigate]);

  return (
    <div className="flex flex-col min-h-screen bg-[#fcf9f4] text-[#1c1c19] selection:bg-[#ffdad3] selection:text-[#772f1f]">
      <ScrollToTop />
      {!isAdminRoute && !isMinimalRoute && <PromoBar />}
      {!isAdminRoute && !isMinimalRoute && <Navbar />}
      {!isAdminRoute && isMinimalRoute && <MinimalHeader variant={pathname.startsWith('/checkout') ? 'checkout' : 'auth'} />}

      <main className="flex-grow">
        <Routes>
          {/* Storefront Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/custom-gifts" element={<CustomGiftsPage />} />
          <Route path="/gift-finder" element={<GiftFinderPage />} />
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
          <Route path="/our-creations" element={<FloraJournalPage />} />
          <Route path="/our-story" element={<OurStoryPage />} />
          <Route path="/how-its-made" element={<HowItsMadePage />} />
          <Route path="/custom-request" element={<CustomRequestPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/order/:orderId/conversation" element={<ConversationPage />} />

          {/* Admin / Handler Portal Routes */}
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />
          {/* Commerce */}
          <Route path="/admin/orders" element={<AdminRoute><AdminOrdersPage /></AdminRoute>} />
          <Route path="/admin/orders/:orderId" element={<AdminRoute><AdminOrderDetailPage /></AdminRoute>} />
          <Route path="/admin/orders/:orderId/conversation" element={<AdminRoute><ConversationPage /></AdminRoute>} />
          <Route path="/admin/orders/new" element={<AdminRoute><AdminCreateOrderPage /></AdminRoute>} />
          <Route path="/admin/products" element={<AdminRoute><AdminProductsPage /></AdminRoute>} />
          <Route path="/admin/products/:productId" element={<AdminRoute><AdminProductDetailPage /></AdminRoute>} />
          <Route path="/admin/products/new" element={<AdminRoute><AdminCreateProductPage /></AdminRoute>} />
          <Route path="/admin/collections" element={<AdminRoute><AdminCollectionsPage /></AdminRoute>} />
          <Route path="/admin/collections/:collectionId" element={<AdminRoute><AdminCollectionDetailPage /></AdminRoute>} />
          {/* Operations */}
          <Route path="/admin/customers" element={<AdminRoute><AdminCustomersPage /></AdminRoute>} />
          <Route path="/admin/customers/:customerId" element={<AdminRoute><AdminCustomerDetailPage /></AdminRoute>} />
          {/* Conversations */}
          <Route path="/admin/conversations" element={<AdminRoute><AdminConversationsPage /></AdminRoute>} />
          {/* Custom Request Operations */}
          <Route path="/admin/custom-requests" element={<AdminRoute><AdminCustomRequestsPage /></AdminRoute>} />
          <Route path="/admin/custom-requests/:requestId" element={<AdminRoute><AdminCustomRequestDetailPage /></AdminRoute>} />
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

      {!isAdminRoute && !isMinimalRoute && <Footer />}
    </div>
  );
}
