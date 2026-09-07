import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, CreditCard, QrCode, Lock, UserRound, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext.jsx';
import { createOrder } from '../services/orderService.js';
import { isCatalogueProduct } from '../services/productService.js';
import { validateStock } from '../services/inventoryService.js';
import { getActiveCustomer, getActiveCustomerId } from '../services/customerService.js';
import { getSettings, getShippingCost } from '../services/settingsService.js';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, cartSubtotal, clearCart } = useStore();

  // Checkout requires an authenticated customer — there is no guest checkout.
  const activeCustomer = getActiveCustomer();
  const isAuthed = !!activeCustomer;

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    deliveryInstructions: ''
  });

  // Prefill delivery details from the authenticated customer's profile/address.
  useEffect(() => {
    if (!activeCustomer) return;
    const addr = (activeCustomer.addresses || []).find((a) => a.isDefault);
    setFormData((prev) => ({
      ...prev,
      fullName: prev.fullName || activeCustomer.name || '',
      email: prev.email || activeCustomer.email || '',
      phone: prev.phone || activeCustomer.phone || '',
      address: prev.address || addr?.address || '',
      city: prev.city || addr?.city || '',
      state: prev.state || addr?.state || '',
      pincode: prev.pincode || addr?.pincode || '',
    }));
  }, [activeCustomer?.id]);

  const [errors, setErrors] = useState({});
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [inventoryWarning, setInventoryWarning] = useState('');

  const settings = getSettings();
  const shippingCost = getShippingCost(cartSubtotal);
  const totalAmount = cartSubtotal + shippingCost;
  const freeShippingThreshold = settings.freeShippingAbove || 1999;

  const validate = () => {
    const errs = {};
    if (!formData.fullName || formData.fullName.trim().length < 2) {
      errs.fullName = 'Please provide a valid recipient name.';
    }
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Please provide a valid email address.';
    }
    if (!formData.phone || formData.phone.replace(/\D/g, '').length < 10) {
      errs.phone = 'Please provide a valid 10-digit phone number.';
    }
    if (!formData.address || formData.address.trim().length < 3) {
      errs.address = 'Please provide a delivery address.';
    }
    if (!formData.city || formData.city.trim().length < 2) {
      errs.city = 'Please provide a city.';
    }
    if (!formData.pincode || formData.pincode.replace(/\D/g, '').length < 6) {
      errs.pincode = 'Please provide a valid 6-digit postal code.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      setSubmitError('Your shopping bag is empty. Please select keepsakes before completing checkout.');
      return;
    }
    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');
    setInventoryWarning('');

    // Validate inventory before creating the order so no stock is
    // deducted (and no order created) when items are unavailable.
    // Made-to-order custom items are not stock-tracked and are skipped.
    const stockIssues = cart
      .map(item => {
        const productId = item.productId || item.id;
        if (!isCatalogueProduct(productId)) return null;
        const qty = item.quantity || 1;
        const check = validateStock(productId, qty);
        return check.available ? null : { name: item.name, ...check };
      })
      .filter(Boolean);

    if (stockIssues.length > 0) {
      setIsSubmitting(false);
      const first = stockIssues[0];
      setInventoryWarning(`"${first.name}" is out of stock (${first.currentStock} available). Please update the quantity in your bag before continuing.`);
      return;
    }

    try {
      const newOrder = await createOrder({
        customerId: getActiveCustomerId(),
        items: cart,
        subtotal: cartSubtotal,
        shipping: shippingCost,
        total: totalAmount,
        paymentStatus: paymentMethod.toUpperCase(),
        shippingAddress: {
          name: formData.fullName,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          phone: formData.phone,
        },
        giftMessage: 'Thank you for your order.',
        isRush: shippingMethod === 'express',
      });

      // Persist the empty cart so a reload does not resurrect purchased items.
      await clearCart();
      setIsSubmitting(false);
      navigate(`/order-success/${newOrder.id || newOrder.orderId}`);
    } catch (err) {
      setIsSubmitting(false);
      setSubmitError(err.message || 'Order placement encountered an issue. Please try again.');
    }
  };

  return (
    <div className="w-full bg-[#fcf9f4] min-h-screen py-10 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="space-y-1 mb-6">
          <span className="text-[11px] uppercase font-bold tracking-widest text-[#964735]">
            Flora Alchemy Checkout
          </span>
          <h1 className="font-serif text-[36px] sm:text-[42px] text-[#180f0a] font-normal tracking-tight">
            Shipping & Delivery
          </h1>
        </div>

        {/* Checkout Progress */}
        <div className="flex items-center gap-2 sm:gap-3 mb-10 max-w-3xl overflow-x-auto pb-1">
          {['Account', 'Delivery', 'Payment', 'Review'].map((step, i) => {
            const done = i < (isAuthed ? 1 : 0);
            const current = isAuthed ? i === 1 : i === 0;
            return (
              <div key={step} className="flex items-center gap-2 sm:gap-3 shrink-0">
                <div className="flex items-center gap-2">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${
                    current ? 'bg-[#180f0a] text-white' : done ? 'bg-[#d8e7cd] text-[#081405]' : 'bg-[#ebe8e3] text-[#80756f]'
                  }`}>
                    {done && !current ? '✓' : i + 1}
                  </span>
                  <span className={`text-[12px] font-semibold ${current ? 'text-[#180f0a]' : 'text-[#80756f]'}`}>{step}</span>
                </div>
                {i < 3 && <span className="w-6 h-px bg-[#e5e2dd]" />}
              </div>
            );
          })}
        </div>

        {!isAuthed ? (
          /* AUTHENTICATION GATE — no guest checkout */
          <div className="bg-white rounded-3xl p-10 sm:p-14 border border-[#e5e2dd] text-center space-y-5 shadow-sm max-w-xl mx-auto my-8">
            <div className="w-14 h-14 rounded-full bg-[#f6f3ee] flex items-center justify-center mx-auto">
              <UserRound className="w-6 h-6 text-[#964735]" />
            </div>
            <div className="space-y-1">
              <h2 className="font-serif text-[28px] text-[#180f0a]">Sign in to continue</h2>
              <p className="text-[14px] text-[#4e4540] max-w-sm mx-auto">
                Create an account or sign in to continue with checkout. Your bag is safe — we&rsquo;ll
                bring you right back here.
              </p>
            </div>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/login?redirect=/checkout"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#180f0a] hover:bg-[#964735] text-white text-[13px] font-semibold flex items-center justify-center gap-2 shadow-md transition-colors"
              >
                Sign In
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/login?mode=register&redirect=/checkout"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full border border-[#e5e2dd] text-[#180f0a] hover:bg-[#f6f3ee] text-[13px] font-semibold transition-colors"
              >
                Create Account
              </Link>
            </div>
            <div>
              <Link to="/cart" className="text-[12px] font-semibold text-[#964735] hover:underline">
                ← Back to Cart
              </Link>
            </div>
          </div>
        ) : cart.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 sm:p-14 border border-[#e5e2dd] text-center space-y-4 shadow-sm max-w-xl mx-auto my-8">
            <p className="font-serif text-[24px] text-[#180f0a]">Your shopping bag is currently empty.</p>
            <p className="text-[14px] text-[#4e4540]">
              Please explore our handcrafted botanicals and add your favorite creations before proceeding to checkout.
            </p>
            <div className="pt-2">
              <Link
                to="/shop"
                className="inline-flex px-7 py-3.5 rounded-full bg-[#180f0a] text-white text-[13px] font-semibold hover:bg-[#964735] transition-colors shadow-sm"
              >
                Explore Handcrafted Blooms
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handlePlaceOrder} noValidate>
            {submitError && (
              <div className="p-4 rounded-2xl bg-[#ffdad3]/70 text-[#772f1f] text-[13px] font-medium border border-[#ffdad3] mb-6">
                {submitError}
              </div>
            )}
            {inventoryWarning && (
              <div className="p-4 rounded-2xl bg-amber-50 text-amber-900 text-[13px] font-medium border border-amber-200 mb-6">
                {inventoryWarning}
                <Link to="/cart" className="ml-2 underline font-semibold">Review your bag</Link>
              </div>
            )}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left Details (7 cols) */}
            <div className="lg:col-span-7 space-y-8">
              {/* Express UPI Banner */}
              <div className="p-4 rounded-3xl bg-white border border-[#e5e2dd] shadow-xs space-y-3">                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#80756f]">
                      Payment Method
                    </span>
                    <span className="text-[11px] text-[#5b6d54] font-semibold">
                      Demo payment · No real charge
                    </span>
                  </div>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    className={`py-2.5 px-3 rounded-2xl border text-[12px] font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      paymentMethod === 'upi' ? 'bg-[#180f0a] text-white border-[#180f0a]' : 'bg-[#f6f3ee] text-[#180f0a] border-[#e5e2dd]'
                    }`}
                  >
                    <QrCode className="w-4 h-4" />
                    <span>Instant UPI</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`py-2.5 px-3 rounded-2xl border text-[12px] font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      paymentMethod === 'card' ? 'bg-[#180f0a] text-white border-[#180f0a]' : 'bg-[#f6f3ee] text-[#180f0a] border-[#e5e2dd]'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Cards & Netbanking</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    className={`py-2.5 px-3 rounded-2xl border text-[12px] font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      paymentMethod === 'cod' ? 'bg-[#180f0a] text-white border-[#180f0a]' : 'bg-[#f6f3ee] text-[#180f0a] border-[#e5e2dd]'
                    }`}
                  >
                    <span>Pay on Delivery</span>
                  </button>
                </div>
              </div>

              {/* Authenticated context note */}
              <p className="text-[12px] text-[#80756f] flex items-center gap-1.5">
                <UserRound className="w-3.5 h-3.5 shrink-0" />
                <span>Checkout as {activeCustomer.name || 'you'} · {activeCustomer.email}</span>
              </p>

              {/* Delivery Address Section */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e5e2dd] shadow-xs space-y-6">
                <h2 className="font-serif text-[22px] text-[#180f0a] border-b border-[#e5e2dd] pb-3">
                  Recipient & Shipping Address
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] uppercase font-bold text-[#4e4540] mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2.5 rounded-xl bg-[#f6f3ee] text-[14px] text-[#1c1c19] border ${
                        errors.fullName ? 'border-red-500 bg-red-50/20' : 'border-[#e5e2dd]'
                      } focus:outline-none focus:ring-1 focus:ring-[#180f0a]`}
                    />
                    {errors.fullName && (
                      <p className="text-[11px] text-red-600 mt-1 font-medium">{errors.fullName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase font-bold text-[#4e4540] mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2.5 rounded-xl bg-[#f6f3ee] text-[14px] text-[#1c1c19] border ${
                        errors.email ? 'border-red-500 bg-red-50/20' : 'border-[#e5e2dd]'
                      } focus:outline-none focus:ring-1 focus:ring-[#180f0a]`}
                    />
                    {errors.email && (
                      <p className="text-[11px] text-red-600 mt-1 font-medium">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase font-bold text-[#4e4540] mb-1">
                      Phone Number (For Delivery Coordination)
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2.5 rounded-xl bg-[#f6f3ee] text-[14px] text-[#1c1c19] border ${
                        errors.phone ? 'border-red-500 bg-red-50/20' : 'border-[#e5e2dd]'
                      } focus:outline-none focus:ring-1 focus:ring-[#180f0a]`}
                    />
                    {errors.phone && (
                      <p className="text-[11px] text-red-600 mt-1 font-medium">{errors.phone}</p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] uppercase font-bold text-[#4e4540] mb-1">
                      Street Address & Apartment
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2.5 rounded-xl bg-[#f6f3ee] text-[14px] text-[#1c1c19] border ${
                        errors.address ? 'border-red-500 bg-red-50/20' : 'border-[#e5e2dd]'
                      } focus:outline-none focus:ring-1 focus:ring-[#180f0a]`}
                    />
                    {errors.address && (
                      <p className="text-[11px] text-red-600 mt-1 font-medium">{errors.address}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase font-bold text-[#4e4540] mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2.5 rounded-xl bg-[#f6f3ee] text-[14px] text-[#1c1c19] border ${
                        errors.city ? 'border-red-500 bg-red-50/20' : 'border-[#e5e2dd]'
                      } focus:outline-none focus:ring-1 focus:ring-[#180f0a]`}
                    />
                    {errors.city && (
                      <p className="text-[11px] text-red-600 mt-1 font-medium">{errors.city}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase font-bold text-[#4e4540] mb-1">
                      Pincode
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2.5 rounded-xl bg-[#f6f3ee] text-[14px] text-[#1c1c19] border ${
                        errors.pincode ? 'border-red-500 bg-red-50/20' : 'border-[#e5e2dd]'
                      } focus:outline-none focus:ring-1 focus:ring-[#180f0a]`}
                    />
                    {errors.pincode && (
                      <p className="text-[11px] text-red-600 mt-1 font-medium">{errors.pincode}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Delivery Tier Options */}
              <div className="bg-white rounded-3xl p-6 border border-[#e5e2dd] shadow-xs space-y-4">
                <h2 className="font-serif text-[20px] text-[#180f0a]">Delivery Options</h2>
                <div className="space-y-3">
                  <label
                    onClick={() => setShippingMethod('standard')}
                    className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                      shippingMethod === 'standard' ? 'bg-[#f6f3ee] border-[#180f0a]' : 'border-[#e5e2dd]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        checked={shippingMethod === 'standard'}
                        onChange={() => setShippingMethod('standard')}
                        className="text-[#180f0a] focus:ring-0"
                      />
                      <div>
                        <p className="font-semibold text-[14px] text-[#180f0a]">Standard Pan-India Dispatch</p>
                        <p className="text-[12px] text-[#80756f]">Delivery within 3 to 5 business days with tracking.</p>
                      </div>
                    </div>
                    <span className="text-[13px] font-bold text-[#180f0a]">
                      {cartSubtotal >= 1999 ? 'Complimentary' : '₹150'}
                    </span>
                  </label>

                  <label
                    onClick={() => setShippingMethod('express')}
                    className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                      shippingMethod === 'express' ? 'bg-[#f6f3ee] border-[#180f0a]' : 'border-[#e5e2dd]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        checked={shippingMethod === 'express'}
                        onChange={() => setShippingMethod('express')}
                        className="text-[#180f0a] focus:ring-0"
                      />
                      <div>
                        <p className="font-semibold text-[14px] text-[#180f0a]">Express Atelier Dispatch</p>
                        <p className="text-[12px] text-[#80756f]">Priority creation in atelier + expedited dispatch (2 days).</p>
                      </div>
                    </div>
                    <span className="text-[13px] font-bold text-[#180f0a]">₹250</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Summary Col (5 cols) */}
            <div className="lg:col-span-5 sticky top-24 space-y-6">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e5e2dd] shadow-lg space-y-6">
                <div className="border-b border-[#e5e2dd] pb-4 flex items-center justify-between">
                  <h3 className="font-serif text-[22px] text-[#180f0a]">Order Summary</h3>
                  <div className="flex items-center gap-3">
                    <span className="text-[13px] text-[#80756f]">{cart.length} item{cart.length > 1 ? 's' : ''}</span>
                    <Link to="/cart" className="text-[11px] font-bold text-[#964735] hover:underline">Edit Cart</Link>
                  </div>
                </div>

                {/* Compact Item List */}
                <div className="max-h-60 overflow-y-auto space-y-3 pr-2 scrollbar-thin">
                  {cart.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover border border-[#e5e2dd]" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-medium text-[#180f0a] truncate">{item.name}</p>
                        <p className="text-[11px] text-[#80756f]">Qty: {item.quantity || 1}</p>
                      </div>
                      <span className="text-[13px] font-bold text-[#180f0a] shrink-0">
                        ₹{(item.price * (item.quantity || 1)).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Subtotals */}
                <div className="space-y-3 border-t border-[#e5e2dd] pt-4 text-[14px] text-[#4e4540]">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-[#180f0a]">₹{cartSubtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="font-semibold text-[#180f0a]">
                      {shippingCost === 0 ? 'Complimentary' : `₹${shippingCost}`}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-[#e5e2dd] pt-3 text-[18px] font-bold text-[#180f0a]">
                    <span>Total Due</span>
                    <span>₹{totalAmount.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Place Order Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || cart.length === 0}
                  className="w-full py-4 rounded-full bg-[#180f0a] hover:bg-[#964735] text-white text-[14px] font-semibold tracking-wide flex items-center justify-center gap-2 shadow-md transition-all active:translate-y-0.5 disabled:opacity-50"
                >
                  <Lock className="w-4 h-4" />
                  <span>{isSubmitting ? 'Confirming Order...' : `Confirm & Place Order · ₹${totalAmount.toLocaleString('en-IN')}`}</span>
                </button>

                <div className="flex items-center justify-center gap-2 text-[12px] text-[#80756f] text-center">
                  <ShieldCheck className="w-4 h-4 text-[#5b6d54]" />
                  <span>All orders are handcrafted with love and tracked securely.</span>
                </div>
              </div>
            </div>
          </div>
        </form>
        )}
      </div>
    </div>
  );
}
