import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Truck, Package, Heart, Clock } from 'lucide-react';
import { getOrderById, formatINR, formatDate } from '../services/orderService.js';
import OrderStatusTracker from '../components/OrderStatusTracker.jsx';

export default function OrderSuccessPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      setLoading(true);
      if (!orderId) {
        // No reference provided — drop the customer at account/order history.
        navigate('/account', { replace: true });
        return;
      }
      const data = await getOrderById(orderId);
      setOrder(data);
      setLoading(false);
    }
    fetchOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  if (loading) {
    return (
      <div className="w-full min-h-[60vh] flex items-center justify-center bg-[#fcf9f4]">
        <p className="font-serif text-[20px] text-[#180f0a]">Preparing Order Keepsake Confirmation...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center bg-[#fcf9f4] px-4 text-center space-y-4">
        <p className="font-serif text-[22px] text-[#180f0a]">Order reference not found.</p>
        <p className="text-[14px] text-[#4e4540] max-w-md">
          We couldn't locate this order keepsake. You can check your recent orders in your account or explore the shop.
        </p>
        <div className="flex gap-3 pt-2">
          <Link to="/account" className="px-6 py-2.5 rounded-full bg-[#180f0a] text-white text-[13px] font-semibold">
            View Account
          </Link>
          <Link to="/shop" className="px-6 py-2.5 rounded-full bg-white border border-[#e5e2dd] text-[#180f0a] text-[13px] font-semibold">
            Browse Shop
          </Link>
        </div>
      </div>
    );
  }

  const items = order.items || [];
  const paymentStatus = order.paymentStatus || 'Paid';
  const delivery = order.shippingAddress || {};

  return (
    <div className="w-full bg-[#fcf9f4] min-h-screen py-10 lg:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Celebration Header Card */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#e5e2dd] shadow-sm text-center space-y-4 mb-8">
          <div className="w-16 h-16 rounded-full bg-[#d8e7cd] text-[#081405] mx-auto flex items-center justify-center shadow-inner">
            <CheckCircle2 className="w-8 h-8 text-[#5b6d54]" />
          </div>

          <span className="text-[11px] font-bold uppercase tracking-widest text-[#964735]">
            Artisan Order Received
          </span>

          <h1 className="font-serif text-[36px] sm:text-[46px] text-[#180f0a] font-normal leading-tight">
            Thank you for gifting with Flora Alchemy.
          </h1>

          <p className="text-[15px] text-[#4e4540] max-w-xl mx-auto leading-relaxed">
            Your handcrafted order <strong>#{order.id}</strong> has entered our studio. Our artisans are carefully preparing each stem and personalized botanical card.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {order.trackingNumber && (
              <div className="px-4 py-1.5 rounded-full bg-[#f6f3ee] text-[13px] text-[#180f0a] border border-[#e5e2dd]">
                Tracking ID: <span className="font-mono font-bold text-[#964735]">{order.trackingNumber}</span>
              </div>
            )}
            <div className="px-4 py-1.5 rounded-full bg-[#f6f3ee] text-[13px] text-[#180f0a] border border-[#e5e2dd]">
              Order Date: <span className="font-medium">{formatDate(order.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Status Tracker */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e5e2dd] shadow-xs mb-8">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-serif text-[22px] text-[#180f0a]">Craft & Dispatch Journey</h2>
            <Link
              to={`/order-tracking/${order.id}`}
              className="text-[12px] font-bold text-[#964735] hover:underline flex items-center gap-1"
            >
              <span>View Full Tracker</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <OrderStatusTracker order={order} />
        </div>

        {/* Order Details & Summary */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e5e2dd] shadow-xs mb-8 space-y-6">
          <h2 className="font-serif text-[22px] text-[#180f0a] border-b border-[#e5e2dd] pb-3">
            Handcrafted Items in This Order
          </h2>

          <div className="divide-y divide-[#e5e2dd] space-y-4">
            {items.map((item, idx) => (
              <div key={idx} className="pt-4 first:pt-0 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img src={item.image} alt={item.name} className="w-16 h-16 rounded-2xl object-cover border border-[#e5e2dd]" />
                  <div>
                    <h3 className="font-serif text-[16px] text-[#180f0a] font-medium">{item.name}</h3>
                    <p className="text-[12px] text-[#80756f]">Qty: {item.quantity || 1}</p>
                    {item.customizations && (
                      <p className="text-[11px] text-[#964735]">{item.customizations.join(' · ')}</p>
                    )}
                  </div>
                </div>
                <span className="text-[15px] font-bold text-[#180f0a]">
                  ₹{(item.price * (item.quantity || 1)).toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>

          {delivery.name && (
            <div className="border-t border-[#e5e2dd] pt-4 flex flex-col sm:flex-row sm:items-start justify-between gap-3 text-[13px]">
              <div className="text-[#4e4540]">
                <p className="font-bold text-[#180f0a] flex items-center gap-1.5">
                  <Package className="w-4 h-4 text-[#964735]" /> Delivering to
                </p>
                <p>{delivery.name} · {delivery.address}, {delivery.city} {delivery.pincode}</p>
              </div>
              <div className="text-[#4e4540] sm:text-right">
                <p className="font-bold text-[#180f0a] flex items-center gap-1.5 justify-start sm:justify-end">
                  <Clock className="w-4 h-4 text-[#964735]" /> Estimated arrival
                </p>
                <p>{order.deliveryTarget ? formatDate(order.deliveryTarget) : (order.isRush ? '2–3 business days' : '3–5 business days')}</p>
              </div>
            </div>
          )}

          <div className="border-t border-[#e5e2dd] pt-4 flex justify-between text-[18px] font-bold text-[#180f0a]">
            <span>Total ({paymentStatus})</span>
            <span>{formatINR(order.total)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            to={`/order-tracking/${order.id}`}
            className="px-7 py-3.5 rounded-full bg-[#180f0a] text-white hover:bg-[#964735] transition-colors text-[13px] font-semibold flex items-center gap-2 shadow-sm"
          >
            <Truck className="w-4 h-4" />
            <span>Track Delivery Progress</span>
          </Link>

          <Link
            to="/account"
            className="px-7 py-3.5 rounded-full bg-white text-[#180f0a] border border-[#e5e2dd] hover:bg-[#f6f3ee] transition-colors text-[13px] font-semibold flex items-center gap-2"
          >
            <Heart className="w-4 h-4" />
            <span>View My Account</span>
          </Link>

          <Link
            to="/shop"
            className="px-7 py-3.5 rounded-full bg-white text-[#180f0a] border border-[#e5e2dd] hover:bg-[#f6f3ee] transition-colors text-[13px] font-semibold"
          >
            Explore More Botanical Art
          </Link>
        </div>
      </div>
    </div>
  );
}
