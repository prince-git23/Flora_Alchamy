import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Search, Package, Truck, CheckCircle2, Clock, MapPin, Sparkles, MessageCircle, HelpCircle } from 'lucide-react';
import { getOrder, getOrders } from '../services/api.js';

export default function OrderTrackingPage() {
  const { orderId } = useParams();
  const [searchCode, setSearchCode] = useState(orderId || 'FA-1024');
  const [currentOrder, setCurrentOrder] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      const found = await getOrder(searchCode);
      if (found) {
        setCurrentOrder(found);
        setError(null);
      } else {
        setError('Order not found. Please try searching with "FA-1024" or "FA-0912".');
      }
    }
    load();
  }, [searchCode]);

  const handleSearch = async (e) => {
    e.preventDefault();
    const found = await getOrder(searchCode.trim());
    if (found) {
      setCurrentOrder(found);
      setError(null);
    } else {
      setError('Order not found. Please check your order reference (e.g. FA-1024).');
    }
  };

  return (
    <div className="w-full bg-[#fcf9f4] min-h-screen py-10 lg:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-[11px] uppercase font-bold tracking-widest text-[#964735]">
            Atelier Dispatch Logistics
          </span>
          <h1 className="font-serif text-[36px] sm:text-[44px] text-[#180f0a] font-normal tracking-tight">
            Track Your Botanical Keepsake
          </h1>
          <p className="text-[15px] text-[#4e4540]">
            Follow the handcrafting, wax packaging, and courier journey of your order.
          </p>

          {/* Quick Search Bar */}
          <form onSubmit={handleSearch} className="flex gap-2 max-w-md mx-auto pt-4">
            <input
              type="text"
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              placeholder="Enter Order # or Tracking Code"
              className="w-full px-4 py-2.5 rounded-full bg-white text-[13px] border border-[#e5e2dd] focus:outline-none focus:ring-1 focus:ring-[#180f0a]"
            />
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full bg-[#180f0a] text-white hover:bg-[#964735] text-[13px] font-semibold transition-colors shrink-0 flex items-center gap-1.5"
            >
              <Search className="w-4 h-4" />
              <span>Track</span>
            </button>
          </form>

          {error && <p className="text-[12px] text-[#964735] font-medium pt-2">{error}</p>}
        </div>

        {currentOrder && (
          <div className="space-y-8">
            {/* Status Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e5e2dd] shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e5e2dd] pb-6">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#964735]">
                    Order #{currentOrder.orderId}
                  </span>
                  <h2 className="font-serif text-[24px] sm:text-[28px] text-[#180f0a] font-medium">
                    Status: <span className="text-[#964735]">{currentOrder.status}</span>
                  </h2>
                </div>
                <div className="text-left sm:text-right text-[13px] text-[#4e4540]">
                  <p>Tracking: <span className="font-mono font-bold text-[#180f0a]">{currentOrder.trackingNumber}</span></p>
                  <p>Ordered on: {currentOrder.date}</p>
                </div>
              </div>

              {/* Progress Stepper */}
              <div className="py-4">
                <div className="relative flex items-center justify-between">
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[#ebe8e3] w-full z-0" />
                  <div
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[#964735] transition-all duration-500 z-0"
                    style={{ width: `${((currentOrder.statusStep || 2) - 1) * 33.33}%` }}
                  />

                  {/* Step 1 */}
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-[#180f0a] text-white flex items-center justify-center text-[12px] font-bold shadow-md">
                      ✓
                    </div>
                    <span className="text-[11px] font-bold text-[#180f0a] mt-2">Order Confirmed</span>
                    <span className="text-[10px] text-[#80756f]">Payment Verified</span>
                  </div>

                  {/* Step 2 */}
                  <div className="relative z-10 flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold shadow-md ${
                      currentOrder.statusStep >= 2 ? 'bg-[#964735] text-white animate-pulse' : 'bg-[#ebe8e3] text-[#4e4540]'
                    }`}>
                      ✂️
                    </div>
                    <span className="text-[11px] font-bold text-[#180f0a] mt-2">Being Crafted</span>
                    <span className="text-[10px] text-[#964735]">In Atelier</span>
                  </div>

                  {/* Step 3 */}
                  <div className="relative z-10 flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold shadow-md ${
                      currentOrder.statusStep >= 3 ? 'bg-[#180f0a] text-white' : 'bg-[#ebe8e3] text-[#4e4540]'
                    }`}>
                      📦
                    </div>
                    <span className="text-[11px] font-bold text-[#180f0a] mt-2">Wax Sealed</span>
                    <span className="text-[10px] text-[#80756f]">Gift Packaging</span>
                  </div>

                  {/* Step 4 */}
                  <div className="relative z-10 flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold shadow-md ${
                      currentOrder.statusStep >= 4 ? 'bg-[#5b6d54] text-white' : 'bg-[#ebe8e3] text-[#4e4540]'
                    }`}>
                      🚚
                    </div>
                    <span className="text-[11px] font-bold text-[#180f0a] mt-2">Delivered</span>
                    <span className="text-[10px] text-[#80756f]">
                      {currentOrder.delivery?.city || 'Destination'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Studio Notes Feed */}
              <div className="p-4 rounded-2xl bg-[#f6f3ee] border border-[#e5e2dd] space-y-2">
                <div className="flex items-center gap-2 text-[#964735] text-[12px] font-bold uppercase tracking-wider">
                  <Sparkles className="w-4 h-4" />
                  <span>Order Progress Note</span>
                </div>
                <p className="text-[13px] text-[#4e4540] leading-relaxed">
                  {currentOrder.status === 'Delivered'
                    ? "Your handcrafted botanicals have arrived safely at the destination address."
                    : currentOrder.status === 'Being Crafted'
                    ? "Each stem is being shaped and assembled by hand in our studio atelier."
                    : currentOrder.status === 'Packed'
                    ? "Your order has been wrapped in tissue and carefully sealed for shipment."
                    : "Your order details have been confirmed and queued for crafting in our studio."}
                </p>
              </div>
            </div>

            {/* Delivery & Package Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Delivery Address Details */}
              <div className="bg-white rounded-3xl p-6 border border-[#e5e2dd] shadow-xs space-y-4">
                <div className="flex items-center gap-2 border-b border-[#e5e2dd] pb-3">
                  <MapPin className="w-4 h-4 text-[#964735]" />
                  <h3 className="font-serif text-[18px] text-[#180f0a]">Delivery Destination</h3>
                </div>
                <div className="text-[14px] text-[#4e4540] space-y-1">
                  <p className="font-bold text-[#180f0a]">{currentOrder.delivery?.recipientName || 'Demo Customer'}</p>
                  <p>{currentOrder.delivery?.address || 'Bandra West'}</p>
                  <p>{currentOrder.delivery?.city || 'Mumbai'}, {currentOrder.delivery?.state || 'Maharashtra'} – {currentOrder.delivery?.pincode || '400050'}</p>
                  <p className="pt-2 text-[12px] text-[#80756f]">Contact: {currentOrder.delivery?.phone || '+91 98000 00000'}</p>
                </div>
              </div>

              {/* Items in Package */}
              <div className="bg-white rounded-3xl p-6 border border-[#e5e2dd] shadow-xs space-y-4">
                <div className="flex items-center gap-2 border-b border-[#e5e2dd] pb-3">
                  <Package className="w-4 h-4 text-[#964735]" />
                  <h3 className="font-serif text-[18px] text-[#180f0a]">Package Contents</h3>
                </div>
                <div className="space-y-3">
                  {(currentOrder.items || []).map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-[13px]">
                      <span className="font-medium text-[#180f0a] truncate max-w-[240px]">{item.name}</span>
                      <span className="font-bold text-[#180f0a]">₹{(item.price * (item.quantity || 1)).toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                  <div className="border-t border-[#e5e2dd] pt-2 flex justify-between font-bold text-[14px] text-[#180f0a]">
                    <span>Total Amount Paid</span>
                    <span>₹{(currentOrder.total || 0).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Assistance Banner */}
            <div className="p-6 rounded-3xl bg-[#ebe8e3] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <p className="font-serif text-[18px] text-[#180f0a]">Need assistance with this order?</p>
                <p className="text-[13px] text-[#4e4540]">Our studio support team is happy to assist with any questions.</p>
              </div>
              <a
                href={`mailto:support@example.com?subject=Inquiry regarding Order ${currentOrder.orderId}`}
                className="px-5 py-2.5 rounded-full bg-[#180f0a] text-white text-[12px] font-semibold hover:bg-[#964735] transition-colors shrink-0"
              >
                Contact Studio Support
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
