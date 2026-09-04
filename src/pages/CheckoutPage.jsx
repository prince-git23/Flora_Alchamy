import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Truck, CreditCard, QrCode, Lock, CheckCircle2 } from 'lucide-react';
import { useStore } from '../context/StoreContext.jsx';
import { createOrder } from '../services/api.js';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, cartSubtotal, setCart } = useStore();

  const [formData, setFormData] = useState({
    fullName: 'Demo Customer',
    email: 'customer@example.com',
    phone: '+91 98000 00000',
    address: 'Bandra West',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400050',
    deliveryInstructions: 'Please leave with reception if unavailable.'
  });

  const [errors, setErrors] = useState({});
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const shippingCost = shippingMethod === 'express' ? 250 : (cartSubtotal >= 1999 ? 0 : 150);
  const totalAmount = cartSubtotal + shippingCost;

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

    try {
      const newOrder = await createOrder({
        items: cart,
        total: totalAmount,
        paymentMethod: paymentMethod.toUpperCase(),
        delivery: {
          recipientName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          shippingType: shippingMethod === 'express' ? 'Express Atelier Dispatch' : 'Standard Pan-India Dispatch'
        }
      });

      // Update state in store
      setCart([]);
      setIsSubmitting(false);
      navigate(`/order-success/${newOrder.orderId}`);
    } catch (err) {
      setIsSubmitting(false);
      setSubmitError(err.message || 'Order placement encountered an issue. Please try again.');
    }
  };

  return (
    <div className="w-full bg-[#fcf9f4] min-h-screen py-10 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="space-y-1 mb-8">
          <span className="text-[11px] uppercase font-bold tracking-widest text-[#964735]">
            Secure Atelier Checkout
          </span>
          <h1 className="font-serif text-[36px] sm:text-[42px] text-[#180f0a] font-normal tracking-tight">
            Shipping & Dispatch
          </h1>
        </div>

        {cart.length === 0 ? (
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
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left Details (7 cols) */}
            <div className="lg:col-span-7 space-y-8">
              {/* Express UPI Banner */}
              <div className="p-4 rounded-3xl bg-white border border-[#e5e2dd] shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#80756f]">
                    Express Checkout
                  </span>
                  <span className="text-[11px] text-[#5b6d54] font-semibold flex items-center gap-1">
                    <Lock className="w-3 h-3" /> 256-Bit Encrypted
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
                  <h3 className="font-serif text-[22px] text-[#180f0a]">Keepsake Summary</h3>
                  <span className="text-[13px] text-[#80756f]">{cart.length} item{cart.length > 1 ? 's' : ''}</span>
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
