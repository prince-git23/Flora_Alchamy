import React, { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash2, ArrowRight, Gift, Truck, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext.jsx';
import { PACKAGING_ADD_ON } from '../services/api.js';
import { getSettings, getShippingCost } from '../services/settingsService.js';

/* ── GSAP (static import — stable across HMR) ── */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

const prefersReduced = typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function CartPage() {
  const navigate = useNavigate();
  const { cart, cartSubtotal, updateItemQuantity, removeItemFromCart, addItemToCart } = useStore();
  const pageRef = useRef(null);
  const headerRef = useRef(null);
  const itemsRef = useRef(null);
  const summaryRef = useRef(null);

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

  /* ── GSAP entrance animations ── */
  useEffect(() => {
    if (prefersReduced || !pageRef.current) return;
    const ctx = gsap.context(() => {
      // Header reveal
      if (headerRef.current) {
        gsap.from(headerRef.current.children, {
          y: 30,
          opacity: 0,
          duration: 0.7,
          ease: 'power3.out',
          stagger: 0.1,
        });
      }
      // Cart items stagger
      if (itemsRef.current) {
        const rows = itemsRef.current.querySelectorAll('[data-cart-item]');
        if (rows.length) {
          gsap.from(rows, {
            y: 24,
            opacity: 0,
            duration: 0.6,
            ease: 'power3.out',
            stagger: 0.08,
            scrollTrigger: {
              trigger: itemsRef.current,
              start: 'top 85%',
              once: true,
            },
          });
        }
      }
      // Summary panel reveal
      if (summaryRef.current) {
        gsap.from(summaryRef.current, {
          y: 30,
          opacity: 0,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: summaryRef.current,
            start: 'top 85%',
            once: true,
          },
        });
      }
    }, pageRef);
    return () => ctx.revert();
  }, [cart.length]);

  return (
    <div ref={pageRef} className="w-full bg-[#fcf9f4] min-h-screen py-10 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Title */}
        <div ref={headerRef} className="space-y-1 mb-8">
          <span className="text-[11px] uppercase font-bold tracking-widest text-[#964735]">
            Artisanal Bag
          </span>
          <h1 className="font-serif text-[36px] sm:text-[44px] text-[#180f0a] font-normal tracking-tight">
            Your Keepsake Bag
          </h1>
        </div>

        {cart.length === 0 ? (
          <div className="relative bg-white rounded-3xl p-12 lg:p-16 text-center border border-[#e5e2dd] max-w-xl mx-auto space-y-4 overflow-hidden">
            {/* Ambient glow orbs */}
            <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-[#ffdad3]/30 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-[#d8e7cd]/25 blur-3xl pointer-events-none" />
            <div className="relative w-16 h-16 rounded-full bg-[#f6f3ee] mx-auto flex items-center justify-center text-3xl" aria-hidden="true">
              🛍️
            </div>
            <h2 className="relative font-serif text-[26px] text-[#180f0a]">Your bag is waiting for something special</h2>
            <p className="relative text-[14px] text-[#4e4540]">
              Discover our everlasting blooms, deckled botanical cards, and bespoke gift boxes.
            </p>
            <div className="relative pt-2 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#180f0a] text-white hover:bg-[#964735] transition-colors text-[13px] font-semibold shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Browse Gifts</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <Link
                to="/gift-finder"
                className="px-6 py-3 rounded-full bg-white border border-[#e5e2dd] text-[#180f0a] hover:bg-[#f6f3ee] hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all text-[13px] font-semibold"
              >
                Find a Gift
              </Link>
              <Link
                to="/custom-gifts"
                className="px-6 py-3 rounded-full bg-white border border-[#e5e2dd] text-[#180f0a] hover:bg-[#f6f3ee] hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all text-[13px] font-semibold"
              >
                Create a Custom Gift
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Cart Items List (7 cols) */}
            <div ref={itemsRef} className="lg:col-span-7 space-y-4">
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
                    <div key={`${item.id}-${item.palette || ''}-${item.ribbon || ''}-${idx}`} data-cart-item className="pt-4 first:pt-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-20 rounded-2xl overflow-hidden bg-[#f6f3ee] shrink-0 border border-[#e5e2dd]">
                          {item.image ? (
                            <img
                              loading="lazy"
                              decoding="async" src={item.image} alt={item.name} className="w-full h-full object-cover" />
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
                            disabled={(item.quantity || 1) <= 1}
                            aria-label={`Decrease quantity of ${item.name}`}
                            className="text-[16px] text-[#4e4540] hover:text-[#180f0a] px-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#180f0a] rounded disabled:opacity-30 disabled:cursor-not-allowed"
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
                          className="text-[#80756f] hover:text-[#964735] p-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#964735] rounded-full transition-colors"
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
                <div data-cart-item className="bg-white rounded-3xl p-4 sm:p-6 border border-[#e5e2dd] space-y-3">
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
                            className="text-[#80756f] hover:text-[#964735] p-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#964735] rounded-full transition-colors"
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
              <div data-cart-item className="p-4 rounded-2xl bg-white border border-[#e5e2dd] flex items-center justify-between">
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
              <div ref={summaryRef} className="bg-white rounded-3xl p-6 border border-[#e5e2dd] shadow-sm space-y-6 hover:shadow-md transition-shadow duration-300">
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
                  className="w-full py-4 rounded-full bg-[#180f0a] hover:bg-[#964735] text-white text-[13px] font-semibold tracking-wide flex items-center justify-center gap-2 shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#964735] focus-visible:ring-offset-2"
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
