import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout.jsx';
import { getCustomers, getCustomerById } from '../../services/customerService.js';
import { getProducts, getProductById } from '../../services/api.js';
import { createOrder, getOrdersByCustomer } from '../../services/orderService.js';
import { adjustInventory, getInventoryItem } from '../../services/inventoryService.js';
import { formatINR } from '../../services/adminData.js';
import { ArrowLeft, ArrowRight, Plus, Minus, Save, AlertCircle, Trash2 } from 'lucide-react';

export default function AdminCreateOrderPage() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [orderItems, setOrderItems] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [shippingAddress, setShippingAddress] = useState({ name: '', address: '', city: '', state: '', pincode: '', phone: '' });
  const [paymentStatus, setPaymentStatus] = useState('Paid');
  const [giftMessage, setGiftMessage] = useState('');
  const [isRush, setIsRush] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    setCustomers(getCustomers());
    setProducts(getProducts());
  }, []);

  const addItem = (product) => {
    const existing = orderItems.find(i => i.productId === product.id);
    if (existing) {
      setOrderItems(orderItems.map(i =>
        i.productId === product.id ? { ...i, quantity: i.quantity + 1 } : i
      ));
    } else {
      setOrderItems([...orderItems, {
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.images?.[0] || '',
      }]);
    }
  };

  const removeItem = (productId) => {
    setOrderItems(orderItems.filter(i => i.productId !== productId));
  };

  const updateQuantity = (productId, delta) => {
    setOrderItems(orderItems.map(i => {
      if (i.productId === productId) {
        const newQty = Math.max(1, i.quantity + delta);
        return { ...i, quantity: newQty };
      }
      return i;
    }));
  };

  const totalAmount = orderItems.reduce((s, i) => s + (i.price || 0) * (i.quantity || 1), 0);

  const handleCustomerChange = (e) => {
    const custId = e.target.value;
    setSelectedCustomerId(custId);
    if (custId) {
      const cust = getCustomerById(custId);
      if (cust) {
        setCustomerName(cust.name);
        setCustomerEmail(cust.email);
        setCustomerPhone(cust.phone);
        const addr = cust.addresses?.[0];
        if (addr) {
          setShippingAddress({
            name: cust.name,
            address: addr.address || '',
            city: addr.city || '',
            state: addr.state || '',
            pincode: addr.pincode || '',
            phone: cust.phone || '',
          });
        }
      }
    } else {
      setCustomerName('');
      setCustomerEmail('');
      setCustomerPhone('');
      setShippingAddress({ name: '', address: '', city: '', state: '', pincode: '', phone: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCustomerId) {
      setSubmitError('Please select a customer.');
      return;
    }
    if (orderItems.length === 0) {
      setSubmitError('Please add at least one product to the order.');
      return;
    }

    setLoading(true);
    setSubmitError('');

    try {
      const orderData = {
        customerId: selectedCustomerId,
        customerName: customerName,
        customerEmail: customerEmail,
        items: orderItems.map(i => ({
          productId: i.productId,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
          image: i.image,
        })),
        subtotal: totalAmount,
        shipping: 0,
        total: totalAmount,
        paymentStatus: paymentStatus,
        shippingAddress: {
          name: customerName || 'Customer',
          address: shippingAddress.address || '',
          city: shippingAddress.city || '',
          state: shippingAddress.state || '',
          pincode: shippingAddress.pincode || '',
          phone: shippingAddress.phone || customerPhone || '',
        },
        giftMessage: giftMessage || '',
        isRush: isRush,
      };

      const newOrder = createOrder(orderData);

      // Re-fetch orders to refresh
      navigate(`/admin/orders/${newOrder.id}`);
    } catch (err) {
      setSubmitError(err.message || 'Failed to create order.');
    }
    setLoading(false);
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-6 pb-12">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link to="/admin/orders" className="p-2 rounded-xl hover:bg-[#ebe8e3] text-[#4e4540] transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl text-[#180f0a] tracking-tight font-normal">Create Order</h1>
            <p className="text-[13px] text-[#80756f] mt-0.5">Sample Data Environment · New orders stored in Sample Configuration</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Customer + Products */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Selection */}
            <div className="bg-white rounded-xl border border-[#e5e2dd] p-6 shadow-xs">
              <h2 className="font-serif text-lg text-[#180f0a] font-medium mb-4">Customer</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] font-semibold text-[#4e4540] mb-1.5">Select Customer</label>
                  <select value={selectedCustomerId} onChange={handleCustomerChange}
                    className="w-full text-[13px] bg-[#f6f3ee] border border-[#d1c4bd] focus:border-[#180f0a] rounded-lg px-3 py-2 text-[#1c1c19] focus:ring-1 focus:ring-[#180f0a] transition">
                    <option value="">Select a customer...</option>
                    {customers.map(c => (
                      <option key={c.id} value={c.id}>{c.name} ({c.email})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-[#4e4540] mb-1.5">Payment Status</label>
                  <select value={paymentStatus} onChange={e => setPaymentStatus(e.target.value)}
                    className="w-full text-[13px] bg-[#f6f3ee] border border-[#d1c4bd] focus:border-[#180f0a] rounded-lg px-3 py-2 text-[#1c1c19] focus:ring-1 focus:ring-[#180f0a] transition">
                    <option value="Paid">Paid</option>
                    <option value="Pending">Pending</option>
                    <option value="Refunded">Refunded</option>
                  </select>
                </div>
              </div>
              {selectedCustomerId && (
                <div className="mt-3 pt-3 border-t border-[#e5e2dd] text-[13px] text-[#4e4540] space-y-1">
                  <p><span className="font-medium text-[#180f0a]">{customerName}</span></p>
                  <p>{customerEmail}</p>
                  <p>{customerPhone}</p>
                </div>
              )}
            </div>

            {/* Products */}
            <div className="bg-white rounded-xl border border-[#e5e2dd] p-6 shadow-xs">
              <h2 className="font-serif text-lg text-[#180f0a] font-medium mb-4">Add Products</h2>
              <div className="max-h-48 overflow-y-auto border border-[#e5e2dd] rounded-lg p-2 space-y-1">
                {products.map(product => (
                  <div key={product.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-[#f6f3ee] cursor-pointer transition-colors"
                    onClick={() => addItem(product)}>
                    <div className="flex items-center gap-3 min-w-0">
                      <img src={product.images?.[0]} alt={product.name} className="w-10 h-10 rounded-lg object-cover shrink-0" loading="lazy" />
                      <div className="min-w-0">
                        <p className="text-[13px] font-medium text-[#180f0a] truncate">{product.shortName || product.name}</p>
                        <p className="text-[11px] text-[#80756f]">{formatINR(product.price)}</p>
                      </div>
                    </div>
                    <Plus className="w-4 h-4 text-[#964735] shrink-0" />
                  </div>
                ))}
              </div>

              {/* Order Items */}
              {orderItems.length > 0 && (
                <div className="mt-4 space-y-2">
                  <h3 className="text-[13px] font-semibold text-[#4e4540] uppercase tracking-wider">Order Items</h3>
                  <div className="divide-y divide-[#f0ede9]">
                    {orderItems.map(item => (
                      <div key={item.productId} className="flex items-center justify-between py-2">
                        <div className="flex items-center gap-3 min-w-0">
                          <img src={item.image} alt={item.name} className="w-8 h-8 rounded-lg object-cover shrink-0" loading="lazy" />
                          <div className="min-w-0">
                            <p className="text-[12px] font-medium text-[#180f0a] truncate">{item.name}</p>
                            <p className="text-[11px] text-[#80756f]">{formatINR(item.price)} each</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button type="button" onClick={() => updateQuantity(item.productId, -1)}
                            className="w-6 h-6 rounded-full bg-[#f6f3ee] hover:bg-[#ebe8e3] flex items-center justify-center text-[#4e4540] transition-colors">
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-[13px] font-semibold text-[#180f0a] w-6 text-center">{item.quantity}</span>
                          <button type="button" onClick={() => updateQuantity(item.productId, 1)}
                            className="w-6 h-6 rounded-full bg-[#f6f3ee] hover:bg-[#ebe8e3] flex items-center justify-center text-[#4e4540] transition-colors">
                            <Plus className="w-3 h-3" />
                          </button>
                          <button type="button" onClick={() => removeItem(item.productId)}
                            className="ml-1 w-6 h-6 rounded-full bg-[#ffdad3]/50 hover:bg-[#ffdad3] text-[#964735] flex items-center justify-center transition-colors">
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="pt-2 border-t border-[#e5e2dd] flex justify-between text-[14px] font-bold text-[#180f0a]">
                    <span>Total</span>
                    <span>{formatINR(totalAmount)}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Order Flags */}
            <div className="bg-white rounded-xl border border-[#e5e2dd] p-6 shadow-xs">
              <h2 className="font-serif text-lg text-[#180f0a] font-medium mb-4">Order Options</h2>
              <label className="flex items-center justify-between p-3 rounded-lg border border-[#e5e2dd] cursor-pointer hover:bg-[#f6f3ee] transition-colors">
                <div>
                  <p className="text-[13px] font-medium text-[#180f0a]">Rush Order</p>
                  <p className="text-[11px] text-[#80756f]">Prioritized handling and dispatch</p>
                </div>
                <input type="checkbox" checked={isRush} onChange={e => setIsRush(e.target.checked)}
                  className="w-4 h-4 rounded border-[#d1c4bd] text-[#180f0a] focus:ring-[#180f0a]" />
              </label>
              <div className="mt-3">
                <label className="block text-[12px] font-semibold text-[#4e4540] mb-1.5">Gift Message (optional)</label>
                <textarea value={giftMessage} onChange={e => setGiftMessage(e.target.value)} rows={2}
                  className="w-full text-[13px] bg-[#f6f3ee] border border-[#d1c4bd] focus:border-[#180f0a] rounded-lg px-3 py-2 text-[#1c1c19] focus:ring-1 focus:ring-[#180f0a] transition resize-none" />
              </div>
            </div>
          </div>

          {/* Right: Shipping + Submit */}
          <div className="space-y-6">
            {/* Shipping Address */}
            <div className="bg-white rounded-xl border border-[#e5e2dd] p-6 shadow-xs">
              <h2 className="font-serif text-lg text-[#180f0a] font-medium mb-4">Shipping Address</h2>
              <div className="space-y-3">
                <input type="text" value={shippingAddress.name} onChange={e => setShippingAddress({ ...shippingAddress, name: e.target.value })}
                  placeholder="Recipient name" className="w-full text-[13px] bg-[#f6f3ee] border border-[#d1c4bd] focus:border-[#180f0a] rounded-lg px-3 py-2 text-[#1c1c19] placeholder:text-[#80756f] focus:ring-1 focus:ring-[#180f0a] transition" />
                <input type="text" value={shippingAddress.address} onChange={e => setShippingAddress({ ...shippingAddress, address: e.target.value })}
                  placeholder="Street address" className="w-full text-[13px] bg-[#f6f3ee] border border-[#d1c4bd] focus:border-[#180f0a] rounded-lg px-3 py-2 text-[#1c1c19] placeholder:text-[#80756f] focus:ring-1 focus:ring-[#180f0a] transition" />
                <div className="grid grid-cols-2 gap-2">
                  <input type="text" value={shippingAddress.city} onChange={e => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                    placeholder="City" className="w-full text-[13px] bg-[#f6f3ee] border border-[#d1c4bd] focus:border-[#180f0a] rounded-lg px-3 py-2 text-[#1c1c19] placeholder:text-[#80756f] focus:ring-1 focus:ring-[#180f0a] transition" />
                  <input type="text" value={shippingAddress.state} onChange={e => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                    placeholder="State" className="w-full text-[13px] bg-[#f6f3ee] border border-[#d1c4bd] focus:border-[#180f0a] rounded-lg px-3 py-2 text-[#1c1c19] placeholder:text-[#80756f] focus:ring-1 focus:ring-[#180f0a] transition" />
                </div>
                <input type="text" value={shippingAddress.pincode} onChange={e => setShippingAddress({ ...shippingAddress, pincode: e.target.value })}
                  placeholder="Pincode" className="w-full text-[13px] bg-[#f6f3ee] border border-[#d1c4bd] focus:border-[#180f0a] rounded-lg px-3 py-2 text-[#1c1c19] placeholder:text-[#80756f] focus:ring-1 focus:ring-[#180f0a] transition" />
                <input type="text" value={shippingAddress.phone} onChange={e => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                  placeholder="Phone" className="w-full text-[13px] bg-[#f6f3ee] border border-[#d1c4bd] focus:border-[#180f0a] rounded-lg px-3 py-2 text-[#1c1c19] placeholder:text-[#80756f] focus:ring-1 focus:ring-[#180f0a] transition" />
              </div>
            </div>

            {/* Submit */}
            <div className="bg-white rounded-xl border border-[#e5e2dd] p-6 shadow-xs space-y-4">
              <h2 className="font-serif text-lg text-[#180f0a] font-medium">Order Summary</h2>
              <div className="space-y-2 text-[13px]">
                <div className="flex justify-between"><span className="text-[#80756f]">Items</span><span className="font-medium text-[#180f0a]">{orderItems.length}</span></div>
                <div className="flex justify-between"><span className="text-[#80756f]">Subtotal</span><span className="font-medium text-[#180f0a]">{formatINR(totalAmount)}</span></div>
                <div className="flex justify-between"><span className="text-[#80756f]">Shipping</span><span className="font-medium text-[#5b6d54]">Complimentary</span></div>
                <div className="pt-2 border-t border-[#e5e2dd] flex justify-between font-bold text-[#180f0a]"><span>Total</span><span>{formatINR(totalAmount)}</span></div>
              </div>

              {submitError && (
                <div className="p-3 rounded-xl bg-[#ffdad3]/70 text-[#783020] text-[12px] flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {submitError}
                </div>
              )}

              <button type="submit" disabled={loading || orderItems.length === 0}
                className="w-full py-3 rounded-full bg-[#180f0a] hover:bg-[#2e241e] disabled:opacity-50 text-white text-[13px] font-semibold transition shadow-sm flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    Creating Order...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Create Order
                  </>
                )}
              </button>

              <p className="text-[11px] text-[#80756f] text-center">
                Order will be stored in Sample Configuration and appear in Admin Orders.
              </p>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
