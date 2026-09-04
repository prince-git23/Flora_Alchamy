import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Package, Printer, Heart, Clock, Truck } from 'lucide-react';
import { getOrder } from '../services/api.js';

export default function OrderSuccessPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      setLoading(true);
      const data = await getOrder(orderId || 'FA-1024');
      setOrder(data);
      setLoading(false);
    }
    fetchOrder();
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
            Your handcrafted order <strong>#{order.orderId}</strong> has entered our studio. Our artisans are carefully preparing each stem and personalized botanical card.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <div className="px-4 py-1.5 rounded-full bg-[#f6f3ee] text-[13px] text-[#180f0a] border border-[#e5e2dd]">
              Tracking ID: <span className="font-mono font-bold text-[#964735]">{order.trackingNumber}</span>
            </div>
            <div className="px-4 py-1.5 rounded-full bg-[#f6f3ee] text-[13px] text-[#180f0a] border border-[#e5e2dd]">
              Order Date: <span className="font-medium">{order.date}</span>
            </div>
          </div>
        </div>

        {/* Timeline Status */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e5e2dd] shadow-xs mb-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-[22px] text-[#180f0a]">Craft & Dispatch Journey</h2>
            <Link
              to={`/order-tracking/${order.orderId}`}
              className="text-[12px] font-bold text-[#964735] hover:underline flex items-center gap-1"
            >
              <span>View Full Tracker</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Stepper */}
          <div className="grid grid-cols-4 gap-2 text-center relative">
            <div className="space-y-1">
              <div className="w-8 h-8 rounded-full bg-[#180f0a] text-white flex items-center justify-center mx-auto text-[12px] font-bold">
                ✓
              </div>
              <p className="text-[12px] font-semibold text-[#180f0a]">Order Received</p>
              <p className="text-[10px] text-[#80756f]">Confirmed</p>
            </div>

            <div className="space-y-1">
              <div className="w-8 h-8 rounded-full bg-[#964735] text-white flex items-center justify-center mx-auto text-[12px] font-bold animate-pulse">
                ✂️
              </div>
              <p className="text-[12px] font-semibold text-[#964735]">Being Crafted</p>
              <p className="text-[10px] text-[#964735]">In Studio</p>
            </div>

            <div className="space-y-1 opacity-50">
              <div className="w-8 h-8 rounded-full bg-[#ebe8e3] text-[#4e4540] flex items-center justify-center mx-auto text-[12px] font-bold">
                📦
              </div>
              <p className="text-[12px] font-semibold text-[#4e4540]">Wax Sealed</p>
              <p className="text-[10px] text-[#80756f]">Packaging</p>
            </div>

            <div className="space-y-1 opacity-50">
              <div className="w-8 h-8 rounded-full bg-[#ebe8e3] text-[#4e4540] flex items-center justify-center mx-auto text-[12px] font-bold">
                🚚
              </div>
              <p className="text-[12px] font-semibold text-[#4e4540]">Delivered</p>
              <p className="text-[10px] text-[#80756f]">Pan-India</p>
            </div>
          </div>
        </div>

        {/* Order Details & Summary */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e5e2dd] shadow-xs mb-8 space-y-6">
          <h2 className="font-serif text-[22px] text-[#180f0a] border-b border-[#e5e2dd] pb-3">
            Handcrafted Items in This Order
          </h2>

          <div className="divide-y divide-[#e5e2dd] space-y-4">
            {order.items && order.items.map((item, idx) => (
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

          <div className="border-t border-[#e5e2dd] pt-4 flex justify-between text-[18px] font-bold text-[#180f0a]">
            <span>Total Paid ({order.paymentMethod})</span>
            <span>₹{order.total.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            to={`/order-tracking/${order.orderId}`}
            className="px-7 py-3.5 rounded-full bg-[#180f0a] text-white hover:bg-[#964735] transition-colors text-[13px] font-semibold flex items-center gap-2 shadow-sm"
          >
            <Truck className="w-4 h-4" />
            <span>Track Delivery Progress</span>
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
