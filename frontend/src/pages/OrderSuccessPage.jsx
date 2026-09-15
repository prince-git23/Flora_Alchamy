import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Package, MapPin, Phone, Truck, Feather, MessageSquare, Home } from 'lucide-react';
import { getOrderById, formatINR, formatDate, getStatusStage, getCustomerFacingStatus } from '../services/orderService.js';

/* ── GSAP ── */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

const prefersReduced = typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Description line for an ordered keepsake — assembled from the real
// customization fields the customer selected (palette, ribbon, extras).
function itemDescription(item) {
  const parts = [];
  if (item.palette) parts.push(item.palette);
  if (item.ribbon) parts.push(item.ribbon);
  if (item.customDetails) {
    const detail = item.customDetails;
    if (typeof detail === 'string' && detail.trim()) parts.push(detail.trim());
    else if (detail && detail.summary) parts.push(String(detail.summary));
  }
  return parts.length > 0 ? parts.join(' · ') : 'Handcrafted atelier piece';
}

export default function OrderSuccessPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const pageRef = useRef(null);
  const heroRef = useRef(null);
  const detailsRef = useRef(null);

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

  /* ── GSAP entrance animation ── */
  useEffect(() => {
    if (prefersReduced || loading || !order || !pageRef.current) return;
    const ctx = gsap.context(() => {
      // Hero card entrance
      if (heroRef.current) {
        gsap.from(heroRef.current, {
          y: 40,
          opacity: 0,
          scale: 0.97,
          duration: 0.8,
          ease: 'power3.out',
        });
      }
      // Details sections stagger
      if (detailsRef.current) {
        const sections = detailsRef.current.querySelectorAll('[data-order-section]');
        if (sections.length) {
          gsap.from(sections, {
            y: 30,
            opacity: 0,
            duration: 0.6,
            ease: 'power3.out',
            stagger: 0.1,
            scrollTrigger: {
              trigger: detailsRef.current,
              start: 'top 85%',
              once: true,
            },
          });
        }
      }
    }, pageRef);
    return () => ctx.revert();
  }, [loading, order]);

  if (loading) {
    return (
      <div className="w-full min-h-[60vh] flex items-center justify-center bg-[#fcf9f4]">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#ffdad3]/40 mx-auto flex items-center justify-center animate-pulse">
            <CheckCircle2 className="w-6 h-6 text-[#964735]" />
          </div>
          <p className="font-serif text-[20px] text-[#180f0a]">Loading your order...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center bg-[#fcf9f4] px-4 text-center space-y-4">
        <div className="relative">
          <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-[#ffdad3]/15 blur-3xl pointer-events-none" />
          <p className="relative font-serif text-[22px] text-[#180f0a]">Order reference not found.</p>
        </div>
        <p className="text-[14px] text-[#4e4540] max-w-md">
          We couldn't locate this order keepsake. You can check your recent orders in your account or explore the shop.
        </p>
        <div className="flex gap-3 pt-2">
          <Link to="/account" className="px-6 py-2.5 rounded-full bg-[#180f0a] text-white text-[13px] font-semibold hover:bg-[#964735] transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0">
            View Account
          </Link>
          <Link to="/shop" className="px-6 py-2.5 rounded-full bg-white border border-[#e5e2dd] text-[#180f0a] text-[13px] font-semibold hover:bg-[#f6f3ee] hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0">
            Browse Shop
          </Link>
        </div>
      </div>
    );
  }

  const items = order.items || [];
  const paymentStatus = order.paymentStatus || 'Pending';
  const delivery = order.shippingAddress || {};
  const firstName = (order.customerName || 'friend').trim().split(' ')[0];
  const statusStage = getStatusStage(order.orderStatus);
  const statusLabel = getCustomerFacingStatus(order.orderStatus);

  // Transcript card appears only when a real card message was ordered —
  // either the order-level gift message or a per-item calligraphy note.
  const cardMessage = order.giftMessage?.trim()
    || items.map((it) => it.giftMessage?.trim()).find(Boolean)
    || '';

  const paidPill = paymentStatus === 'Paid'
    ? <span className="px-2 py-0.5 rounded-full bg-[#d8e7cd] text-[#2e5a2a] text-[10px] font-bold uppercase tracking-wide">Paid</span>
    : <span className="px-2 py-0.5 rounded-full bg-[#ebe8e3] text-[#4e4540] text-[10px] font-bold uppercase tracking-wide">{paymentStatus}</span>;

  return (
    <div ref={pageRef} className="w-full bg-[#fcf9f4] min-h-screen py-10 lg:py-14 relative overflow-hidden">
      {/* Ambient glow orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-[#ffdad3]/15 blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-60 h-60 rounded-full bg-[#d8e7cd]/10 blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* ── Order Success Hero Card ── */}
        <div ref={heroRef} className="rounded-3xl border border-[#e5e2dd] shadow-[0_16px_40px_-12px_rgba(46,36,30,0.12)] bg-gradient-to-b from-[#fffdf9] via-[#fffaf4] to-[#fdeee8] p-8 sm:p-12 text-center space-y-5 mb-8 overflow-hidden relative">
          {/* Inner glow */}
          <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-[#ffdad3]/20 blur-3xl pointer-events-none" />

          {/* Confirmation Badge */}
          <div className="relative w-16 h-16 rounded-full bg-[#ffdad3] border border-[#e8b3a6] shadow-inner mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-[#964735]" />
          </div>

          <div className="relative space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#964735]">
              Order Confirmed
            </span>
            <h1 className="font-serif text-[34px] sm:text-[44px] text-[#180f0a] font-normal leading-tight tracking-tight">
              Thank you, {firstName}!
            </h1>
            <p className="text-[15px] text-[#4e4540] max-w-xl mx-auto leading-relaxed">
              Your handcrafted gift has been received and is being prepared.
              {paymentStatus === 'Paid'
                ? ' A receipt for this order has been recorded in your account.'
                : ` Payment is recorded as ${paymentStatus.toLowerCase()} — no amount has been captured yet.`}
            </p>
          </div>

          {/* Details Bar */}
          <div className="relative grid grid-cols-2 lg:grid-cols-4 gap-4 p-5 sm:p-6 rounded-2xl bg-[#f0eae1] border border-[#e5ddd2] text-left mt-2">
            <div className="space-y-1">
              <p className="text-[10px] uppercase font-bold tracking-wider text-[#80756f]">Order</p>
              <p className="text-[15px] font-bold text-[#180f0a] font-mono">{order.id}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] uppercase font-bold tracking-wider text-[#80756f]">Date</p>
              <p className="text-[15px] font-bold text-[#180f0a]">{formatDate(order.createdAt)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] uppercase font-bold tracking-wider text-[#80756f]">Total</p>
              <p className="text-[15px] font-bold text-[#180f0a] flex items-center gap-2">
                {formatINR(order.total)} {paidPill}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] uppercase font-bold tracking-wider text-[#80756f]">Status</p>
              <p className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#e5e2dd] text-[12px] font-semibold text-[#180f0a]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#5b6d54]" />
                {statusStage}. {statusLabel}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="relative flex flex-wrap items-center justify-center gap-3 pt-1">
            <Link
              to={`/order-tracking/${order.id}`}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white text-[#180f0a] border-2 border-[#180f0a] hover:bg-[#f6f3ee] transition-all duration-300 text-[13px] font-semibold shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0"
            >
              <Truck className="w-4 h-4" />
              <span>Track Order {order.id}</span>
            </Link>
            <Link
              to="/account"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#964735] text-white hover:bg-[#7d3a2b] transition-all duration-300 text-[13px] font-semibold shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
            >
              <Home className="w-4 h-4" />
              <span>View Account &amp; Order History</span>
            </Link>
            {order?.id && (
              <Link
                to={`/order/${order.id}/conversation`}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white text-[#180f0a] border-2 border-[#c17c74] hover:bg-[#fdf6f4] transition-all duration-300 text-[13px] font-semibold shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Message Flora Alchemy</span>
              </Link>
            )}
          </div>

          <p className="relative text-[12px] text-[#80756f] max-w-lg mx-auto leading-relaxed">
            Need to adjust your handwritten card wording or delivery window? Use the message button above to reach the Flora Alchemy team directly about this order.
          </p>
        </div>

        {/* ── Lower Two-Column Section ── */}
        <div ref={detailsRef} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column — Keepsakes + Transcript */}
          <div className="lg:col-span-7 space-y-6">
            {/* Ordered Keepsakes */}
            <div data-order-section className="bg-white rounded-3xl border border-[#e5e2dd] shadow-sm p-6 sm:p-7 hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-serif text-[22px] text-[#180f0a]">Ordered Keepsakes</h2>
                <span className="text-[13px] text-[#80756f]">
                  {items.length} {items.length === 1 ? 'Item' : 'Items'}
                </span>
              </div>

              <div className="divide-y divide-[#f0ede9]">
                {items.map((item, idx) => (
                  <div key={idx} className="py-4 first:pt-0 last:pb-0 flex items-center gap-4">
                    {/* Thumbnail — real product image, tinted fallback tile when absent */}
                    <div className="w-16 h-16 rounded-2xl overflow-hidden bg-[#f6f3ee] border border-[#f0ede9] shrink-0 flex items-center justify-center">
                      {item.image ? (
                        <img
                          loading="lazy"
                          decoding="async" src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-2xl">🌸</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-serif text-[16px] text-[#180f0a] font-medium leading-snug">{item.name}</h3>
                      <p className="text-[12px] text-[#4e4540] leading-relaxed truncate">{itemDescription(item)}</p>
                      <p className="text-[11px] text-[#80756f] mt-0.5">Qty: {item.quantity || 1}</p>
                    </div>
                    <span className="text-[15px] font-bold text-[#180f0a] whitespace-nowrap">
                      {formatINR((item.price || 0) * (item.quantity || 1))}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Personalized Deckled Card Transcript — only when a real message was ordered */}
            {cardMessage && (
              <div data-order-section className="bg-white rounded-3xl border border-[#e5e2dd] shadow-sm p-6 sm:p-7 hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center gap-2 mb-4">
                  <Feather className="w-4 h-4 text-[#964735]" />
                  <span className="text-[11px] font-bold uppercase tracking-widest text-[#964735]">
                    Personalized Deckled Card Transcript
                  </span>
                </div>
                <div className="p-5 rounded-2xl bg-[#faf7f2] border border-[#e8e2d8]">
                  <p className="font-serif text-[17px] text-[#1c1c19] italic leading-relaxed">
                    &ldquo;{cardMessage}&rdquo;
                  </p>
                </div>
                <p className="text-[12px] text-[#80756f] mt-4 leading-relaxed">
                  Hand-inscribed on deckled cotton paper and finished with an organic wax seal.
                </p>
              </div>
            )}
          </div>

          {/* Right Column — Delivery + Conversation */}
          <div className="lg:col-span-5 space-y-6">
            {/* Delivery Destination */}
            <div data-order-section className="bg-white rounded-3xl border border-[#e5e2dd] shadow-sm p-6 sm:p-7 hover:shadow-md transition-shadow duration-300">
              <h2 className="font-serif text-[22px] text-[#180f0a] mb-4">Delivery Destination</h2>
              {delivery.name ? (
                <>
                  <div className="space-y-0.5 text-[14px] text-[#1c1c19]">
                    <p className="font-semibold text-[#180f0a]">{delivery.name}</p>
                    <p>{delivery.address}</p>
                    <p>{[delivery.city, delivery.state].filter(Boolean).join(', ')} — {delivery.pincode}</p>
                  </div>
                  {delivery.phone && (
                    <p className="mt-2 flex items-center gap-1.5 text-[13px] text-[#4e4540]">
                      <Phone className="w-3.5 h-3.5 text-[#964735]" />
                      Contact: {delivery.phone}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2 pt-4">
                    <span className="px-3 py-1 rounded-full bg-[#f0eae1] text-[#4e4540] text-[11px] font-semibold">
                      Standard Courier
                    </span>
                    <span className="px-3 py-1 rounded-full bg-[#f0eae1] text-[#4e4540] text-[11px] font-semibold">
                      Handcrafted Delivery
                    </span>
                  </div>
                </>
              ) : (
                <p className="text-[13px] text-[#4e4540]">
                  Delivery details were not recorded for this order.
                </p>
              )}
            </div>

            {/* Order Conversation — live order-linked chat */}
            <div data-order-section className="rounded-3xl bg-[#2c2622] text-white p-6 sm:p-7 shadow-md relative overflow-hidden">
              {/* Subtle depth glow */}
              <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full bg-[#964735]/10 blur-3xl pointer-events-none" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2 h-2 rounded-full bg-[#7e947b] animate-pulse" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#e8b3a6]">
                    Order Support — Live
                  </span>
                </div>
                <h2 className="font-serif text-[22px] text-white mb-2">Order Conversation</h2>
                <p className="text-[13px] text-[#d4c3ba] leading-relaxed">
                  A direct messaging channel for inquiring about craft status, card wording, or parcel dispatch.
                  Your order status is always available on the tracking page as well.
                </p>
                <Link
                  to={`/order/${order.id}/conversation`}
                  className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-[#180f0a] hover:bg-[#f6f3ee] text-[12px] font-semibold transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  Open Conversation
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
