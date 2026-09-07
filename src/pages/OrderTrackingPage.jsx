import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Search, Package, MapPin, Sparkles, Clock } from 'lucide-react';
import { getOrderById, formatINR, formatDate, getCustomerFacingStatus } from '../services/orderService.js';
import OrderStatusTracker from '../components/OrderStatusTracker.jsx';

export default function OrderTrackingPage() {
  const { orderId } = useParams();
  const [searchCode, setSearchCode] = useState(orderId || '');
  const [currentOrder, setCurrentOrder] = useState(null);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    async function load() {
      const code = searchCode.trim();
      if (!code) return;
      const found = await getOrderById(code);
      if (found) {
        setCurrentOrder(found);
        setError(null);
      } else {
        setCurrentOrder(null);
        setError('Order not found. Please check your order reference (e.g. FA-1024).');
      }
      setSearched(true);
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    const code = searchCode.trim();
    if (!code) {
      setError('Please enter an order reference or tracking code.');
      return;
    }
    const found = await getOrderById(code);
    if (found) {
      setCurrentOrder(found);
      setError(null);
    } else {
      setCurrentOrder(null);
      setError('Order not found. Please check your order reference (e.g. FA-1024).');
    }
    setSearched(true);
  };

  const delivery = currentOrder?.shippingAddress || {};
  const orderLabel = currentOrder
    ? getCustomerFacingStatus(currentOrder.orderStatus || 'new')
    : '';

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
          {searched && !error && currentOrder && (
            <p className="text-[12px] text-[#5b6d54] font-semibold pt-1">
              Showing {orderLabel} for #{currentOrder.id}
            </p>
          )}
        </div>

        {currentOrder && (
          <div className="space-y-8">
            {/* Status Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e5e2dd] shadow-sm space-y-6">
              <OrderStatusTracker order={currentOrder} />

              {/* Studio Notes Feed */}
              <div className="p-4 rounded-2xl bg-[#f6f3ee] border border-[#e5e2dd] space-y-2">
                <div className="flex items-center gap-2 text-[#964735] text-[12px] font-bold uppercase tracking-wider">
                  <Sparkles className="w-4 h-4" />
                  <span>Order Progress Note</span>
                </div>
                <p className="text-[13px] text-[#4e4540] leading-relaxed">
                  {currentOrder.orderStatus === 'delivered'
                    ? 'Your handcrafted botanicals have arrived safely at the destination address.'
                    : currentOrder.orderStatus === 'shipped'
                    ? 'Your order has been handed to our courier partner and is on its way to you.'
                    : currentOrder.orderStatus === 'ready_to_dispatch'
                    ? 'Your order is wax-sealed, boxed, and ready for dispatch.'
                    : currentOrder.orderStatus === 'quality_check'
                    ? 'Your order is undergoing its final petal and packaging inspection.'
                    : currentOrder.orderStatus === 'in_production'
                    ? 'Each stem is being shaped and assembled by hand in our studio atelier.'
                    : currentOrder.orderStatus === 'confirmed'
                    ? 'Your order details have been confirmed and queued for crafting in our studio.'
                    : 'Your order has been received and is waiting to be confirmed.'}
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
                  <p className="font-bold text-[#180f0a]">{delivery.name || '—'}</p>
                  <p>{delivery.address || '—'}</p>
                  <p>{delivery.city || '—'}, {delivery.state || ''} – {delivery.pincode || ''}</p>
                  <p className="pt-2 text-[12px] text-[#80756f]">Contact: {delivery.phone || '—'}</p>
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
                      <span className="font-bold text-[#180f0a]">{formatINR(item.price * (item.quantity || 1))}</span>
                    </div>
                  ))}
                  {!currentOrder.items || currentOrder.items.length === 0 ? (
                    <p className="text-[13px] text-[#80756f]">No items recorded for this order.</p>
                  ) : null}
                  <div className="border-t border-[#e5e2dd] pt-2 flex justify-between font-bold text-[14px] text-[#180f0a]">
                    <span>Total Amount</span>
                    <span>{formatINR(currentOrder.total)}</span>
                  </div>
                  <div className="flex justify-between text-[12px] text-[#80756f]">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> Ordered on {formatDate(currentOrder.createdAt)}
                    </span>
                    <span>Payment: {currentOrder.paymentStatus || 'Paid'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Assistance Banner */}
            <div className="p-6 rounded-3xl bg-[#ebe8e3] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <p className="font-serif text-[18px] text-[#180f0a]">Need assistance with this order?</p>
                <p className="text-[13px] text-[#4e4540]">
                  Visit your account for order details, or continue browsing the shop.
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <Link
                  to="/account"
                  className="px-5 py-2.5 rounded-full bg-[#180f0a] text-white text-[12px] font-semibold hover:bg-[#964735] transition-colors"
                >
                  Go to My Account
                </Link>
                <Link
                  to="/shop"
                  className="px-5 py-2.5 rounded-full bg-white border border-[#e5e2dd] text-[#180f0a] text-[12px] font-semibold hover:bg-[#f6f3ee] transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}

        {!currentOrder && !error && (
          <div className="bg-white rounded-3xl p-10 sm:p-14 border border-[#e5e2dd] text-center space-y-4 shadow-sm max-w-xl mx-auto">
            <p className="font-serif text-[24px] text-[#180f0a]">Track your order</p>
            <p className="text-[14px] text-[#4e4540]">
              Enter the order reference from your confirmation (for example FA-1024) or your tracking code above to see its live journey.
            </p>
            <div className="pt-2">
              <Link to="/account" className="inline-flex px-7 py-3.5 rounded-full bg-[#180f0a] text-white text-[13px] font-semibold hover:bg-[#964735] transition-colors shadow-sm">
                View Orders in My Account
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
