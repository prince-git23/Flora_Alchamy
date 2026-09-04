import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash2, ArrowRight, ShieldCheck, Gift, Truck } from 'lucide-react';
import { useStore } from '../context/StoreContext.jsx';

export default function CartPage() {
  const navigate = useNavigate();
  const { cart, cartSubtotal, updateItemQuantity, removeItemFromCart } = useStore();

  const [pincode, setPincode] = useState('400050');
  const [pincodeStatus, setPincodeStatus] = useState('Eligible for Handcrafted Pan-India Delivery (3-5 days)');
  const [luxuryPackaging, setLuxuryPackaging] = useState(false);

  const shippingCost = cartSubtotal >= 1999 || cart.length === 0 ? 0 : 150;
  const packagingCost = luxuryPackaging ? 450 : 0;
  const grandTotal = cartSubtotal + shippingCost + packagingCost;

  const handleCheckPincode = (e) => {
    e.preventDefault();
    if (pincode.trim().length >= 6) {
      setPincodeStatus(`Verified: Pincode ${pincode} eligible for Pan-India express dispatch.`);
    }
  };

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
            <div className="w-16 h-16 rounded-full bg-[#f6f3ee] mx-auto flex items-center justify-center text-3xl">
              🛍️
            </div>
            <h2 className="font-serif text-[26px] text-[#180f0a]">Your bag is currently empty</h2>
            <p className="text-[14px] text-[#4e4540]">
              Discover our everlasting blooms, deckled botanical cards, and bespoke gift boxes.
            </p>
            <div className="pt-2">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#180f0a] text-white hover:bg-[#964735] transition-colors text-[13px] font-semibold"
              >
                <span>Browse The Collection</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Cart Items List (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              {/* Complimentary Note Banner */}
              <div className="p-4 rounded-2xl bg-[#ffdad3]/40 border border-[#964735]/20 flex items-center gap-3">
                <Gift className="w-5 h-5 text-[#964735] shrink-0" />
                <p className="text-[13px] text-[#180f0a]">
                  {cartSubtotal >= 1999 ? (
                    <span><strong>Complimentary Gift:</strong> You unlocked a free handwritten botanical card and Pan-India delivery!</span>
                  ) : (
                    <span>Add <strong>₹{(1999 - cartSubtotal).toLocaleString('en-IN')}</strong> more to unlock complimentary Pan-India shipping and gift card!</span>
                  )}
                </p>
              </div>

              {/* Items */}
              <div className="bg-white rounded-3xl p-4 sm:p-6 border border-[#e5e2dd] divide-y divide-[#e5e2dd] space-y-4">
                {cart.map((item, idx) => (
                  <div key={idx} className="pt-4 first:pt-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 rounded-2xl overflow-hidden bg-[#f6f3ee] shrink-0 border border-[#e5e2dd]">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
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
                          <p className="text-[11px] text-[#964735] italic truncate max-w-xs">
                            Card: "{item.giftMessage}"
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
                          className="text-[16px] text-[#4e4540] hover:text-[#180f0a] px-1"
                        >
                          -
                        </button>
                        <span className="text-[13px] font-semibold text-[#180f0a]">{item.quantity || 1}</span>
                        <button
                          type="button"
                          onClick={() => updateItemQuantity(idx, (item.quantity || 1) + 1)}
                          className="text-[16px] text-[#4e4540] hover:text-[#180f0a] px-1"
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
                        className="text-[#80756f] hover:text-[#964735] p-2"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Luxury Packaging Option */}
              <div className="p-4 rounded-2xl bg-white border border-[#e5e2dd] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="luxuryBox"
                    checked={luxuryPackaging}
                    onChange={(e) => setLuxuryPackaging(e.target.checked)}
                    className="w-4 h-4 rounded text-[#964735] focus:ring-0 cursor-pointer"
                  />
                  <label htmlFor="luxuryBox" className="cursor-pointer text-[13px]">
                    <span className="font-semibold text-[#180f0a] block">Upgrade to Handcrafted Pine Hamper Casket (+₹450)</span>
                    <span className="text-[#80756f]">Solid sliding pine wood keepsake box with custom brass seal.</span>
                  </label>
                </div>
                <span className="text-[14px] font-bold text-[#180f0a] shrink-0">₹450</span>
              </div>
            </div>

            {/* Order Summary Col (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-[#e5e2dd] shadow-sm space-y-6">
                <h3 className="font-serif text-[22px] text-[#180f0a] border-b border-[#e5e2dd] pb-4">
                  Order Summary
                </h3>

                {/* Pincode Estimator */}
                <div className="space-y-2">
                  <label className="block text-[11px] uppercase font-bold text-[#80756f]">
                    Delivery Pincode Check
                  </label>
                  <form onSubmit={handleCheckPincode} className="flex gap-2">
                    <input
                      type="text"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      placeholder="Enter 6-digit Pincode"
                      className="w-full px-3 py-1.5 rounded-xl bg-[#f6f3ee] text-[13px] border border-[#e5e2dd] focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-xl bg-[#180f0a] text-white text-[12px] font-semibold hover:bg-[#964735] transition-colors shrink-0"
                    >
                      Verify
                    </button>
                  </form>
                  {pincodeStatus && (
                    <p className="text-[11px] text-[#5b6d54] flex items-center gap-1 font-medium">
                      <Truck className="w-3.5 h-3.5" />
                      <span>{pincodeStatus}</span>
                    </p>
                  )}
                </div>

                {/* Cost Breakdown */}
                <div className="space-y-3 text-[14px] text-[#4e4540] border-t border-[#e5e2dd] pt-4">
                  <div className="flex justify-between">
                    <span>Subtotal ({cart.length} item{cart.length > 1 ? 's' : ''})</span>
                    <span className="font-semibold text-[#180f0a]">₹{cartSubtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pan-India Air Dispatch</span>
                    <span className="font-semibold text-[#180f0a]">
                      {shippingCost === 0 ? <span className="text-[#5b6d54]">Complimentary</span> : `₹${shippingCost}`}
                    </span>
                  </div>
                  {luxuryPackaging && (
                    <div className="flex justify-between">
                      <span>Pine Hamper Casket</span>
                      <span className="font-semibold text-[#180f0a]">₹450</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t border-[#e5e2dd] pt-3 text-[18px] font-bold text-[#180f0a]">
                    <span>Total Amount</span>
                    <span>₹{grandTotal.toLocaleString('en-IN')}</span>
                  </div>
                  <p className="text-[11px] text-[#80756f]">Inclusive of all taxes & insurance.</p>
                </div>

                {/* Checkout Trigger */}
                <button
                  type="button"
                  onClick={() => navigate('/checkout')}
                  className="w-full py-4 rounded-full bg-[#180f0a] hover:bg-[#964735] text-white text-[13px] font-semibold tracking-wide flex items-center justify-center gap-2 shadow-md transition-all active:translate-y-0.5"
                >
                  <ShoppingBag className="w-4 h-4" />
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
