import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash2, ArrowRight, Gift, Truck, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext.jsx';
import { PACKAGING_ADD_ON } from '../services/api.js';
import { getSettings, getShippingCost } from '../services/settingsService.js';

export default function CartPage() {
  const navigate = useNavigate();
  const { cart, cartSubtotal, updateItemQuantity, removeItemFromCart, addItemToCart } = useStore();

  const settings = getSettings();

  // Add-ons live in the cart alongside products, so the visible subtotal must
  // separate them (the previous cart total added the upgrade twice).
  const productItems = cart.filter((item) => !item.isAddOn);
  const addOnItems = cart.filter((item) => item.isAddOn);
  const addOnTotal = addOnItems.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
  const productSubtotal = cartSubtotal - addOnTotal;
  const itemCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  // Shipping is authoritative: the same helper + settings the checkout uses.
  // The server computes shipping off the full order subtotal (products +
  // add-ons), so we pass the full cartSubtotal here too.
  const shippingCost = cart.length === 0 ? 0 : getShippingCost(cartSubtotal);
  const grandTotal = cartSubtotal + shippingCost;

  const freeShippingThreshold = settings && settings.freeShippingAbove
    ? Number(settings.freeShippingAbove)
    : null;
  const amountToFreeShipping = freeShippingThreshold
    ? Math.max(0, freeShippingThreshold - cartSubtotal)
    : 0;

  const standardDays = settings?.shippingConfiguration?.standardDays;

  return (
    <div className="w-full bg-[#fcf9f4] min-h-screen py-10 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Title */}
        <div className="space-y-1 mb-8">
          <span className="text-[11px] uppercase font-bold tracking-widest text-[#964735]">
            Artisanal Bag
          </span>
          <h1 className="font-serif text-[36px] sm:text-[44px] text-[#180f0a] font-normal tracking-tight">
            Your Keepsake Bag
          </h1>
        </div>

        {cart.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 lg:p-16 text-center border border-[#e5e2dd] max-w-xl mx-auto space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#f6f3ee] mx-auto flex items-center justify-center text-3xl" aria-hidden="true">
              🛍️
            </div>
            <h2 className="font-serif text-[26px] text-[#180f0a]">Your bag is waiting for something special</h2>
            <p className="text-[14px] text-[#4e4540]">
              Discover our everlasting blooms, deckled botanical cards, and bespoke gift boxes.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#180f0a] text-white hover:bg-[#964735] transition-colors text-[13px] font-semibold"
              >
                <span>Browse Gifts</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <Link
                to="/gift-finder"
                className="px-6 py-3 rounded-full bg-white border border-[#e5e2dd] text-[#180f0a] hover:bg-[#f6f3ee] transition-colors text-[13px] font-semibold"
              >
                Find a Gift
              </Link>
              <Link
                to="/custom-gifts"
                className="px-6 py-3 rounded-full bg-white border border-[#e5e2dd] text-[#180f0a] hover:bg-[#f6f3ee] transition-colors text-[13px] font-semibold"
              >
                Create a Custom Gift
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Cart Items List (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              {/* Complimentary shipping progress — only when a real threshold
                  is configured in store settings. */}
              {freeShippingThreshold && (
                <div className="p-4 rounded-2xl bg-[#ffdad3]/40 border border-[#964735]/20 flex items-center gap-3">
                  <Gift className="w-5 h-5 text-[#964735] shrink-0" aria-hidden="true" />
                  <p className="text-[13px] text-[#180f0a]">
                    {amountToFreeShipping === 0 ? (
                      <span><strong>Complimentary delivery unlocked</strong> — this order ships on us.</span>
                    ) : (
                      <span>Add <strong>₹{amountToFreeShipping.toLocaleString('en-IN')}</strong> more for complimentary delivery.</span>
                    )}
                  </p>
                </div>
              )}

              {/* Product lines */}
              <div className="bg-white rounded-3xl p-4 sm:p-6 border border-[#e5e2dd] divide-y divide-[#e5e2dd] space-y-4">
                {productItems.map((item) => {
                  const idx = cart.indexOf(item);
                  return (
                    <div key={`${item.id}-${item.palette || ''}-${item.ribbon || ''}-${idx}`} className="pt-4 first:pt-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-20 rounded-2xl overflow-hidden bg-[#f6f3ee] shrink-0 border border-[#e5e2dd]">
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="w-full h-full flex items-center justify-center text-2xl" aria-hidden="true">🌸</span>
                          )}
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] uppercase font-bold tracking-widest text-[#80756f]">
                            {item.category}
                          </span>
                          <h3 className="font-serif text-[17px] text-[#180f0a] font-medium leading-snug">
                            {item.name}
                          </h3>
                          {item.palette && (
                            <p className="text-[12px] text-[#4e4540]">Palette: {item.palette}</p>
                          )}
                          {item.ribbon && (
                            <p className="text-[12px] text-[#4e4540]">Ribbon: {item.ribbon}</p>
                          )}
                          {item.giftMessage && (
                            <p className="text-[11px] text-[#964735] italic break-words">
                              Card: &ldquo;{item.giftMessage}&rdquo;
                            </p>
                          )}
                          <p className="text-[14px] font-bold text-[#180f0a] sm:hidden">
                            ₹{(item.price * (item.quantity || 1)).toLocaleString('en-IN')}
                          </p>
                        </div>
                      </div>

                      {/* Quantity and Actions */}
                      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                        <div className="flex items-center justify-between px-3 py-1 rounded-full bg-[#f6f3ee] border border-[#e5e2dd] w-28">
                          <button
                            type="button"
                            onClick={() => updateItemQuantity(idx, (item.quantity || 1) - 1)}
                            aria-label={`Decrease quantity of ${item.name}`}
                            className="text-[16px] text-[#4e4540] hover:text-[#180f0a] px-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#180f0a] rounded"
                          >
                            −
                          </button>
                          <span className="text-[13px] font-semibold text-[#180f0a]" aria-live="polite">{item.quantity || 1}</span>
                          <button
                            type="button"
                            onClick={() => updateItemQuantity(idx, (item.quantity || 1) + 1)}
                            aria-label={`Increase quantity of ${item.name}`}
                            className="text-[16px] text-[#4e4540] hover:text-[#180f0a] px-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#180f0a] rounded"
                          >
                            +
                          </button>
                        </div>

                        <div className="hidden sm:block text-right">
                          <span className="text-[15px] font-bold text-[#180f0a]">
                            ₹{(item.price * (item.quantity || 1)).toLocaleString('en-IN')}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeItemFromCart(idx)}
                          aria-label={`Remove ${item.name} from bag`}
                          className="text-[#80756f] hover:text-[#964735] p-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#964735] rounded-full"
                        >
                          <Trash2 className="w-4 h-4" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Selected add-ons — real cart lines, carried through checkout */}
              {addOnItems.length > 0 && (
                <div className="bg-white rounded-3xl p-4 sm:p-6 border border-[#e5e2dd] space-y-3">
                  <p className="text-[11px] uppercase font-bold tracking-wider text-[#80756f]">Gift add-ons</p>
                  {addOnItems.map((item) => {
                    const idx = cart.indexOf(item);
                    return (
                      <div key={`${item.id}-${idx}`} className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="w-9 h-9 rounded-full bg-[#ffdad3]/60 flex items-center justify-center text-[#964735] shrink-0" aria-hidden="true">
                            <Gift className="w-4 h-4" />
                          </span>
                          <div className="min-w-0">
                            <p className="text-[13px] font-semibold text-[#180f0a] truncate">{item.name}</p>
                            {item.description && (
                              <p className="text-[11px] text-[#80756f] truncate">{item.description}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-4 shrink-0">
                          <span className="text-[14px] font-bold text-[#180f0a]">₹{item.price.toLocaleString('en-IN')}</span>
                          <button
                            type="button"
                            onClick={() => removeItemFromCart(idx)}
                            aria-label={`Remove ${item.name} from bag`}
                            className="text-[#80756f] hover:text-[#964735] p-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#964735] rounded-full"
                          >
                            <Trash2 className="w-4 h-4" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Studio Packaging Add-on — toggles a real cart line so it survives
                  checkout → order → admin order detail. */}
              <div className="p-4 rounded-2xl bg-white border border-[#e5e2dd] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="studio-pine-casket"
                    checked={addOnItems.some((item) => item.id === PACKAGING_ADD_ON.id)}
                    onChange={(e) => {
                      const idx = cart.findIndex((item) => item.isAddOn && item.id === PACKAGING_ADD_ON.id);
                      if (e.target.checked) {
                        if (idx === -1) {
                          addItemToCart(PACKAGING_ADD_ON, { isAddOn: true, addOnId: PACKAGING_ADD_ON.id });
                        }
                      } else if (idx > -1) {
                        removeItemFromCart(idx);
                      }
                    }}
                    className="w-4 h-4 rounded text-[#964735] focus:ring-0 cursor-pointer"
                  />
                  <label htmlFor="studio-pine-casket" className="cursor-pointer text-[13px]">
                    <span className="font-semibold text-[#180f0a] block">Upgrade to Studio Pine Keepsake Casket (+₹{PACKAGING_ADD_ON.price})</span>
                    <span className="text-[#80756f]">{PACKAGING_ADD_ON.description}</span>
                  </label>
                </div>
                <span className="text-[14px] font-bold text-[#180f0a] shrink-0">₹{PACKAGING_ADD_ON.price}</span>
              </div>
            </div>

            {/* Order Summary Col (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-[#e5e2dd] shadow-sm space-y-6">
                <h3 className="font-serif text-[22px] text-[#180f0a] border-b border-[#e5e2dd] pb-4">
                  Order Summary
                </h3>

                {/* Delivery information — from store settings only, never invented */}
                <div className="space-y-2">
                  <span className="block text-[11px] uppercase font-bold text-[#80756f]">
                    Delivery
                  </span>
                  <p className="text-[12px] text-[#5b6d54] flex items-center gap-1.5 font-medium">
                    <Truck className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>
                      Pan-India dispatch
                      {standardDays ? ` · ${standardDays}` : ''}
                    </span>
                  </p>
                </div>

                {/* Cost Breakdown */}
                <div className="space-y-3 text-[14px] text-[#4e4540] border-t border-[#e5e2dd] pt-4">
                  <div className="flex justify-between">
                    <span>Subtotal ({itemCount} item{itemCount === 1 ? '' : 's'})</span>
                    <span className="font-semibold text-[#180f0a]">₹{productSubtotal.toLocaleString('en-IN')}</span>
                  </div>
                  {addOnItems.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#964735]" aria-hidden="true" />
                        {item.name}
                      </span>
                      <span className="font-semibold text-[#180f0a]">₹{item.price.toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                  <div className="flex justify-between">
                    <span>Pan-India Delivery</span>
                    <span className="font-semibold text-[#180f0a]">
                      {shippingCost === 0 ? <span className="text-[#5b6d54]">Complimentary</span> : `₹${shippingCost.toLocaleString('en-IN')}`}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-[#e5e2dd] pt-3 text-[18px] font-bold text-[#180f0a]">
                    <span>Total Amount</span>
                    <span>₹{grandTotal.toLocaleString('en-IN')}</span>
                  </div>
                  <p className="text-[11px] text-[#80756f]">Inclusive of all taxes.</p>
                </div>

                {/* Checkout Trigger */}
                <button
                  type="button"
                  onClick={() => navigate('/checkout')}
                  className="w-full py-4 rounded-full bg-[#180f0a] hover:bg-[#964735] text-white text-[13px] font-semibold tracking-wide flex items-center justify-center gap-2 shadow-md transition-all active:translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#964735] focus-visible:ring-offset-2"
                >
                  <ShoppingBag className="w-4 h-4" aria-hidden="true" />
                  <span>Proceed to Checkout · ₹{grandTotal.toLocaleString('en-IN')}</span>
                </button>

                <div className="text-center pt-2">
                  <Link to="/shop" className="text-[12px] font-semibold text-[#964735] hover:underline">
                    ← Continue exploring the collection
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
