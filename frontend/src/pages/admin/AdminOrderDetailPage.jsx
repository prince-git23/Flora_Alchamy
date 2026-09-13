import React, { useState, useMemo, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout.jsx';
import { getOrderById as getOrderFromService, updateOrderStatus, ORDER_STATUSES, ORDER_STATUS_STYLES, formatINR, formatDate } from '../../services/orderService.js';
import { getCustomerById } from '../../services/customerService.js';

export default function AdminOrderDetailPage() {
  const { orderId } = useParams();
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const [orderData, setOrderData] = useState(() => getOrderFromService(orderId));
  const order = orderData;
  const customer = order ? getCustomerById(order.customerId) : null;

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  if (!order) {
    return (
      <AdminLayout>
        <div className="max-w-7xl mx-auto pb-12">
          <div className="p-12 sm:p-16 bg-white rounded-2xl text-center space-y-4 shadow-xs border border-[#e5e2dd]">
            <div className="w-16 h-16 rounded-full bg-[#f6f3ee] mx-auto flex items-center justify-center text-[#80756f]">
              <span className="material-symbols-outlined text-[32px]">search_off</span>
            </div>
            <div className="max-w-md mx-auto">
              <h3 className="font-serif text-2xl text-[#180f0a] font-medium">Order Not Found</h3>
              <p className="text-[14px] text-[#4e4540] mt-1.5">The order "{orderId}" does not exist in the system. Please verify the order ID.</p>
            </div>
            <Link to="/admin/orders" className="inline-block px-5 py-2 rounded-full bg-[#180f0a] text-white text-[13px] font-semibold shadow-xs hover:bg-[#2e241e] transition-colors">Return to Orders</Link>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const style = ORDER_STATUS_STYLES[order.orderStatus] || ORDER_STATUS_STYLES.new;
  const statusObj = ORDER_STATUSES.find(s => s.key === order.orderStatus);
  const currentStage = statusObj?.stageNum || 1;

  const advanceStatus = useCallback(async (newStatusKey) => {
    try {
      const updated = await updateOrderStatus(order.id, newStatusKey);
      if (updated) {
        setOrderData(updated);
        const label = ORDER_STATUSES.find(s => s.key === newStatusKey)?.label || newStatusKey;
        triggerToast(`Order ${order.id} is now ${label}`);
      }
    } catch (err) {
      triggerToast(err.message || 'Status could not be updated.');
    }
    setStatusModalOpen(false);
  }, [order]);

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-6 pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link to="/admin/orders" className="p-2 rounded-xl hover:bg-[#ebe8e3] text-[#4e4540] transition-colors" aria-label="Back to orders">
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-2xl sm:text-3xl text-[#180f0a] tracking-tight font-normal">#{order.id}</h1>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${style.bg} ${style.text} border ${style.border}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`}></span>
                  {statusObj?.label}
                </span>
              </div>
              <p className="text-[13px] text-[#80756f] mt-0.5">Order details</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link to={`/admin/orders/${order.id}/conversation`} className="px-4 py-2 text-[12px] font-semibold text-[#964735] bg-[#fdf6f4] border border-[#e5c9c5] hover:bg-[#f9ebe8] rounded-full transition shadow-sm">
              Conversation
            </Link>
            <button type="button" onClick={() => setStatusModalOpen(true)} className="px-4 py-2 text-[12px] font-semibold text-white bg-[#180f0a] hover:bg-[#2e241e] rounded-full transition shadow-sm">
              Update Status
            </button>
          </div>
        </div>

        {/* Pipeline Progress */}
        <div className="bg-white rounded-xl border border-[#e5e2dd] p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[12px] font-bold uppercase tracking-wider text-[#80756f]">Order Pipeline</span>
            <span className="text-[12px] text-[#80756f]">Stage {currentStage} of 7</span>
          </div>
          <div className="hidden sm:flex items-center gap-1">
            {ORDER_STATUSES.map((s, i) => (
              <div key={s.key} className="flex-1 flex flex-col items-center gap-1">
                <div className={`w-full h-2 rounded-full ${i < currentStage ? 'bg-[#180f0a]' : i === currentStage - 1 ? 'bg-[#964735]' : 'bg-[#ebe8e3]'}`}></div>
                <span className={`text-[10px] font-medium ${i < currentStage ? 'text-[#180f0a]' : 'text-[#80756f]'}`}>{s.label}</span>
              </div>
            ))}
          </div>
          <div className="sm:hidden text-[13px] text-[#4e4540] font-medium">Stage {currentStage}: {statusObj?.label}</div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Order Items & Shipping */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <div className="bg-white rounded-xl border border-[#e5e2dd] p-6 shadow-xs">
              <h2 className="font-serif text-lg text-[#180f0a] font-medium mb-4">Order Items</h2>
              <div className="divide-y divide-[#f0ede9]">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-4 py-3 first:pt-0 last:pb-0">
                    <div className="w-14 h-14 rounded-xl bg-[#f6f3ee] overflow-hidden shrink-0 flex items-center justify-center">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
                      ) : (
                        <span className="text-xl" aria-hidden="true">{item.isAddOn ? '🎁' : '🌸'}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0 space-y-0.5">
                      <div className="flex items-center gap-2">
                        <p className="text-[13px] font-semibold text-[#180f0a] truncate">{item.name}</p>
                        {item.isAddOn && (
                          <span className="px-2 py-0.5 rounded-full bg-[#ffdad3]/60 text-[#783020] text-[10px] font-bold uppercase tracking-wider shrink-0">
                            Add-on
                          </span>
                        )}
                      </div>
                      <p className="text-[12px] text-[#80756f]">
                        Qty: {item.quantity} · SKU: {(item.productSlug || 'FA').toString().slice(0, 12).toUpperCase()}
                      </p>
                      {/* Customization captured at purchase — must remain visible to fulfillment */}
                      {(item.palette || item.ribbon) && (
                        <p className="text-[12px] text-[#4e4540]">
                          {item.palette ? `Palette: ${item.palette}` : ''}
                          {item.palette && item.ribbon ? ' · ' : ''}
                          {item.ribbon ? `Ribbon: ${item.ribbon}` : ''}
                        </p>
                      )}
                      {item.giftMessage && (
                        <p className="text-[12px] text-[#964735] italic break-words">
                          Gift note: &ldquo;{item.giftMessage}&rdquo;
                        </p>
                      )}
                      {!item.giftMessage && item.customDetails && (
                        <p className="text-[12px] text-[#4e4540]">
                          {typeof item.customDetails === 'string' ? item.customDetails : (item.customDetails.summary || 'Custom details recorded')}
                        </p>
                      )}
                      {item.isAddOn && item.description && (
                        <p className="text-[12px] text-[#80756f]">{item.description}</p>
                      )}
                    </div>
                    <span className="text-[13px] font-mono font-semibold text-[#180f0a] whitespace-nowrap">{formatINR(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-[#e5e2dd] space-y-2">
                <div className="flex justify-between text-[13px] text-[#4e4540]">
                  <span>Subtotal</span>
                  <span className="font-medium text-[#180f0a]">{formatINR(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-[13px] text-[#4e4540]">
                  <span>Shipping</span>
                  <span className="font-medium text-[#5b6d54]">{order.shipping === 0 ? 'Complimentary' : formatINR(order.shipping)}</span>
                </div>
                <div className="flex justify-between text-[14px] font-bold text-[#180f0a] pt-2 border-t border-[#f0ede9]">
                  <span>Total</span>
                  <span>{formatINR(order.total)}</span>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-xl border border-[#e5e2dd] p-6 shadow-xs">
              <h2 className="font-serif text-lg text-[#180f0a] font-medium mb-4">Shipping Address</h2>
              <div className="space-y-1.5 text-[13px] text-[#4e4540]">
                <p className="font-semibold text-[#180f0a]">{order.shippingAddress.name}</p>
                <p>{order.shippingAddress.address}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}</p>
                <p>{order.shippingAddress.phone}</p>
              </div>
            </div>
          </div>

          {/* Right: Customer & Metadata */}
          <div className="space-y-6">
            {/* Customer Card */}
            <div className="bg-white rounded-xl border border-[#e5e2dd] p-6 shadow-xs">
              <h2 className="font-serif text-lg text-[#180f0a] font-medium mb-4">Customer</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#180f0a] text-white flex items-center justify-center font-semibold text-[13px]">
                    {order.customerName.split(' ').map(w => w[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <p className="font-semibold text-[#180f0a] text-[13px]">{order.customerName}</p>
                    <p className="text-[11px] text-[#80756f]">{order.customerEmail}</p>
                  </div>
                </div>
                {customer && (
                  <Link to={`/admin/customers/${customer.id}`} className="text-[12px] text-[#964735] font-semibold hover:underline flex items-center gap-1">
                    View Customer Profile <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </Link>
                )}
              </div>
            </div>

            {/* Order Metadata */}
            <div className="bg-white rounded-xl border border-[#e5e2dd] p-6 shadow-xs">
              <h2 className="font-serif text-lg text-[#180f0a] font-medium mb-4">Order Information</h2>
              <div className="space-y-3 text-[13px]">
                <div className="flex items-center justify-between">
                  <span className="text-[#80756f]">Payment Status</span>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                    order.paymentStatus === 'Paid'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : order.paymentStatus === 'Failed'
                        ? 'bg-red-50 text-red-700 border border-red-200'
                        : order.paymentStatus === 'Refunded'
                          ? 'bg-stone-100 text-stone-700 border border-stone-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      order.paymentStatus === 'Paid'
                        ? 'bg-emerald-600'
                        : order.paymentStatus === 'Failed'
                          ? 'bg-red-500'
                          : order.paymentStatus === 'Refunded'
                            ? 'bg-stone-500'
                            : 'bg-amber-600'
                    }`}></span>
                    {order.paymentStatus}
                  </span>
                </div>
                {order.paymentProvider && (
                  <div className="pt-2 border-t border-[#f0ede9] space-y-2 mt-1">
                    <div className="flex justify-between">
                      <span className="text-[#80756f]">Provider</span>
                      <span className="font-medium text-[#180f0a] capitalize">{order.paymentProvider}</span>
                    </div>
                    {order.paymentProviderOrderId && (
                      <div className="flex justify-between">
                        <span className="text-[#80756f]">Provider Order ID</span>
                        <span className="font-mono font-medium text-[#180f0a]">{order.paymentProviderOrderId}</span>
                      </div>
                    )}
                    {order.paymentProviderPaymentId && (
                      <div className="flex justify-between">
                        <span className="text-[#80756f]">Provider Payment ID</span>
                        <span className="font-mono font-medium text-[#180f0a]">{order.paymentProviderPaymentId}</span>
                      </div>
                    )}
                    {order.paymentReference && (
                      <div className="flex justify-between">
                        <span className="text-[#80756f]">Reference</span>
                        <span className="font-mono font-medium text-[#180f0a]">{order.paymentReference}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-[#80756f]">Verification</span>
                      <span className={`font-semibold ${order.paymentSignatureVerified ? 'text-[#5b6d54]' : 'text-[#80756f]'}`}>
                        {order.paymentSignatureVerified ? 'Verified' : 'Not verified'}
                      </span>
                    </div>
                    {order.paymentVerifiedAt && (
                      <div className="flex justify-between">
                        <span className="text-[#80756f]">Verified At</span>
                        <span className="font-medium text-[#180f0a]">{formatDate(order.paymentVerifiedAt)}</span>
                      </div>
                    )}
                    {order.paymentFailureReason && (
                      <div className="flex justify-between">
                        <span className="text-[#80756f]">Failure Reason</span>
                        <span className="font-medium text-[#ba1a1a] text-right">{order.paymentFailureReason}</span>
                      </div>
                    )}
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-[#80756f]">Created</span>
                  <span className="font-medium text-[#180f0a]">{formatDate(order.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#80756f]">Last Updated</span>
                  <span className="font-medium text-[#180f0a]">{formatDate(order.updatedAt)}</span>
                </div>
                {order.trackingNumber && (
                  <div className="flex justify-between">
                    <span className="text-[#80756f]">Tracking #</span>
                    <span className="font-mono font-medium text-[#180f0a]">{order.trackingNumber}</span>
                  </div>
                )}
                {order.isRush && (
                  <div className="flex items-center gap-1.5 pt-2">
                    <span className="px-2 py-0.5 rounded bg-[#ffdad3] text-[#783020] text-[10px] font-bold uppercase">Rush Order</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Status Update Modal */}
        {statusModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#e5e2dd] space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-xl font-medium text-[#180f0a]">Update Order Status</h3>
                <button type="button" onClick={() => setStatusModalOpen(false)} className="p-1 rounded-lg text-[#80756f] hover:bg-[#f0ede9]">
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>
              <p className="text-[13px] text-[#4e4540]">Select the next status for order {order.id}:</p>
              <div className="space-y-2">
                {ORDER_STATUSES.map(s => (
                  <button key={s.key} type="button" onClick={() => advanceStatus(s.key)}
                    disabled={s.stageNum <= currentStage}
                    className={`w-full text-left px-4 py-3 rounded-xl border text-[13px] font-medium transition-all flex items-center justify-between ${
                      s.key === order.orderStatus
                        ? 'bg-[#180f0a] text-white border-[#180f0a]'
                        : s.stageNum <= currentStage
                        ? 'bg-[#f6f3ee] text-[#80756f] border-[#e5e2dd] cursor-not-allowed opacity-50'
                        : 'bg-white text-[#180f0a] border-[#d1c4bd] hover:bg-[#f6f3ee] hover:border-[#180f0a] cursor-pointer'
                    }`}>
                    <span>{s.label}</span>
                    <span className="text-[11px] text-[#80756f]">{s.description}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Toast */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-[#180f0a] text-white px-5 py-3 rounded-full shadow-2xl border border-white/10">
            <span className="w-2 h-2 rounded-full bg-[#964735]"></span>
            <span className="text-[13px] font-medium tracking-wide">{toastMessage}</span>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
