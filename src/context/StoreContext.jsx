import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCart, updateCart, addToCart as apiAddToCart, removeFromCart as apiRemoveFromCart, getWishlist, addToWishlist as apiAddToWishlist, removeFromWishlist as apiRemoveFromWishlist } from '../services/api.js';
import { getProducts } from '../services/productService.js';
import { subscribeStore } from '../services/dataStore.js';

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    let mounted = true;

    // Resolve stored wishlist IDs against the server catalogue. Products are
    // never read from a static array — rows come from the API-hydrated store,
    // and IDs whose product no longer exists are dropped.
    async function syncWishlistFromCatalogue() {
      const ids = await getWishlist();
      if (!mounted) return;
      const catalog = getProducts();
      const resolved = ids
        .map((id) => catalog.find((p) => p.id === id))
        .filter(Boolean);
      setWishlist((prev) =>
        prev.length === resolved.length && prev.every((x, i) => x && x.id === resolved[i].id)
          ? prev
          : resolved
      );
    }

    async function loadData() {
      const c = await getCart();
      if (mounted) setCart(c);
      await syncWishlistFromCatalogue();
    }

    loadData();
    const unsub = subscribeStore(syncWishlistFromCatalogue);
    return () => {
      mounted = false;
      unsub();
    };
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3200);
  };

  const addItemToCart = async (product, options = {}) => {
    const updated = await apiAddToCart(product, options);
    setCart(updated);
    showToast(`Added "${product.name || product.shortName}" to your bag`);
  };

  const removeItemFromCart = async (index) => {
    const updated = await apiRemoveFromCart(index);
    setCart(updated);
    showToast('Item removed from your bag');
  };

  const updateItemQuantity = async (index, newQuantity) => {
    if (newQuantity < 1) {
      return removeItemFromCart(index);
    }
    const updated = [...cart];
    updated[index].quantity = newQuantity;
    await updateCart(updated);
    setCart(updated);
  };

  // Persisted empty cart (used after a successful order) so a later reload
  // never resurrects the purchased items.
  const clearCart = async () => {
    await updateCart([]);
    setCart([]);
  };

  const toggleWishlist = async (product) => {
    const isSaved = wishlist.some(item => item.id === product.id);
    if (isSaved) {
      await apiRemoveFromWishlist(product.id);
      setWishlist(prev => prev.filter(item => item.id !== product.id));
      showToast(`Removed "${product.name}" from your wishlist`);
    } else {
      await apiAddToWishlist(product.id);
      // Persist only the ID; the full row is resolved from the catalogue.
      const resolved = getProducts().find((p) => p.id === product.id) || product;
      setWishlist(prev => [resolved, ...prev]);
      showToast(`Saved "${product.name}" to your wishlist`);
    }
  };

  const isWishlisted = (productId) => {
    return wishlist.some(item => item.id === productId);
  };

  const cartCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);

  return (
    <StoreContext.Provider value={{
      cart,
      wishlist,
      cartCount,
      cartSubtotal,
      addItemToCart,
      removeItemFromCart,
      updateItemQuantity,
      clearCart,
      toggleWishlist,
      isWishlisted,
      showToast,
      setCart
    }}>
      {children}

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-[#180f0a] text-white px-5 py-3 rounded-full shadow-2xl border border-white/10 animate-bounce duration-300">
          <span className="w-2 h-2 rounded-full bg-[#964735]"></span>
          <span className="text-[13px] font-medium tracking-wide">{toast.message}</span>
        </div>
      )}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
