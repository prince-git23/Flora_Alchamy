import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout.jsx';
import AdminSettingsTabs from '../../components/admin/AdminSettingsTabs.jsx';

const INITIAL_COMMERCE = {
  currency: 'INR',
  currencySymbol: '₹',
  shippingEnabled: true,
  shippingFreeAbove: 1999,
  standardShippingRate: 0,
  expressShippingRate: 149,
  taxEnabled: false,
  taxRate: 0,
  taxLabel: 'GST',
  minimumOrderValue: 250,
  maximumOrderItems: 20,
  orderCancellationWindow: 2,
  returnWindow: 7,
  paymentMethods: { upi: true, cards: true, netbanking: true, cod: false, wallets: true },
  autoConfirmOrders: true,
  autoAssignShipping: true,
  orderPrefix: 'FA',
  trackingEnabled: true,
};

export default function AdminCommerceSettingsPage() {
  const [settings, setSettings] = useState(INITIAL_COMMERCE);
  const [toastMessage, setToastMessage] = useState(null);

  const triggerToast = (msg) => { setToastMessage(msg); setTimeout(() => setToastMessage(null), 3000); };

  const handleSave = () => {
    triggerToast('Commerce settings saved locally (sample data). Backend integration pending.');
  };

  const handleReset = () => {
    setSettings(INITIAL_COMMERCE);
    triggerToast('Commerce settings reset to defaults.');
  };

  const togglePaymentMethod = (key) => {
    setSettings(prev => ({ ...prev, paymentMethods: { ...prev.paymentMethods, [key]: !prev.paymentMethods[key] } }));
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-8 pb-12">
        {/* Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-[#f6f3ee] p-6 sm:p-8 shadow-xs border border-[#e5e2dd]">
          <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-gradient-to-br from-[#ffdad3]/40 via-[#f1dfd5]/30 to-transparent blur-3xl pointer-events-none"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-1.5 text-[13px] text-[#80756f] mb-2">
              <span>System</span><span className="text-[#d1c4bd]">/</span><span>Settings</span><span className="text-[#d1c4bd]">/</span><span className="text-[#180f0a] font-semibold">Order & Commerce</span>
            </div>
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <h1 className="font-serif text-3xl sm:text-4xl text-[#180f0a] tracking-tight font-normal">Order & Commerce Settings</h1>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffdad3] text-[#783020] text-[11px] font-bold shadow-xs">
                <span className="h-1.5 w-1.5 rounded-full bg-[#964735]"></span>
                Sample Configuration
              </span>
            </div>
            <p className="text-[15px] text-[#4e4540] mt-1">Configure shipping, payments, taxes, and order lifecycle rules.</p>
          </div>
          <div className="mt-6 pt-2 border-t border-[#e5e2dd]/60">
            <AdminSettingsTabs activeTab="commerce" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Shipping Settings */}
          <div className="bg-white rounded-xl border border-[#e5e2dd] p-6 shadow-xs space-y-4">
            <h2 className="font-serif text-lg text-[#180f0a] font-medium flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">local_shipping</span> Shipping
            </h2>
            <div className="space-y-3">
              <label className="flex items-center justify-between py-2">
                <span className="text-[13px] text-[#4e4540]">Enable Shipping</span>
                <button type="button" onClick={() => setSettings(p => ({ ...p, shippingEnabled: !p.shippingEnabled }))}
                  className={`w-10 h-6 rounded-full transition-colors ${settings.shippingEnabled ? 'bg-[#5b6d54]' : 'bg-[#d1c4bd]'}`}>
                  <span className={`block w-4 h-4 bg-white rounded-full transition-transform shadow-sm ${settings.shippingEnabled ? 'translate-x-5' : 'translate-x-1'}`}></span>
                </button>
              </label>
              <div>
                <label className="block text-[12px] font-semibold text-[#4e4540] mb-1">Free Shipping Above</label>
                <input type="number" value={settings.shippingFreeAbove} onChange={e => setSettings(p => ({ ...p, shippingFreeAbove: +e.target.value }))}
                  className="w-full text-[13px] bg-[#f6f3ee] border border-[#d1c4bd] focus:border-[#180f0a] rounded-lg px-3 py-2 focus:ring-1 focus:ring-[#180f0a] transition" />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-[#4e4540] mb-1">Express Shipping Rate (₹)</label>
                <input type="number" value={settings.expressShippingRate} onChange={e => setSettings(p => ({ ...p, expressShippingRate: +e.target.value }))}
                  className="w-full text-[13px] bg-[#f6f3ee] border border-[#d1c4bd] focus:border-[#180f0a] rounded-lg px-3 py-2 focus:ring-1 focus:ring-[#180f0a] transition" />
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="bg-white rounded-xl border border-[#e5e2dd] p-6 shadow-xs space-y-4">
            <h2 className="font-serif text-lg text-[#180f0a] font-medium flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">payments</span> Payment Methods
            </h2>
            <div className="space-y-3">
              {Object.entries(settings.paymentMethods).map(([key, enabled]) => (
                <label key={key} className="flex items-center justify-between py-2">
                  <span className="text-[13px] text-[#4e4540] capitalize">{key === 'upi' ? 'UPI' : key === 'cod' ? 'Cash on Delivery' : key.charAt(0).toUpperCase() + key.slice(1)}</span>
                  <button type="button" onClick={() => togglePaymentMethod(key)}
                    className={`w-10 h-6 rounded-full transition-colors ${enabled ? 'bg-[#5b6d54]' : 'bg-[#d1c4bd]'}`}>
                    <span className={`block w-4 h-4 bg-white rounded-full transition-transform shadow-sm ${enabled ? 'translate-x-5' : 'translate-x-1'}`}></span>
                  </button>
                </label>
              ))}
            </div>
          </div>

          {/* Order Lifecycle */}
          <div className="bg-white rounded-xl border border-[#e5e2dd] p-6 shadow-xs space-y-4">
            <h2 className="font-serif text-lg text-[#180f0a] font-medium flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">receipt_long</span> Order Lifecycle
            </h2>
            <div className="space-y-3">
              <div>
                <label className="block text-[12px] font-semibold text-[#4e4540] mb-1">Order Prefix</label>
                <input type="text" value={settings.orderPrefix} onChange={e => setSettings(p => ({ ...p, orderPrefix: e.target.value }))}
                  className="w-full text-[13px] bg-[#f6f3ee] border border-[#d1c4bd] focus:border-[#180f0a] rounded-lg px-3 py-2 focus:ring-1 focus:ring-[#180f0a] transition" />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-[#4e4540] mb-1">Cancellation Window (hours)</label>
                <input type="number" value={settings.orderCancellationWindow} onChange={e => setSettings(p => ({ ...p, orderCancellationWindow: +e.target.value }))}
                  className="w-full text-[13px] bg-[#f6f3ee] border border-[#d1c4bd] focus:border-[#180f0a] rounded-lg px-3 py-2 focus:ring-1 focus:ring-[#180f0a] transition" />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-[#4e4540] mb-1">Return Window (days)</label>
                <input type="number" value={settings.returnWindow} onChange={e => setSettings(p => ({ ...p, returnWindow: +e.target.value }))}
                  className="w-full text-[13px] bg-[#f6f3ee] border border-[#d1c4bd] focus:border-[#180f0a] rounded-lg px-3 py-2 focus:ring-1 focus:ring-[#180f0a] transition" />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-[#4e4540] mb-1">Minimum Order Value (₹)</label>
                <input type="number" value={settings.minimumOrderValue} onChange={e => setSettings(p => ({ ...p, minimumOrderValue: +e.target.value }))}
                  className="w-full text-[13px] bg-[#f6f3ee] border border-[#d1c4bd] focus:border-[#180f0a] rounded-lg px-3 py-2 focus:ring-1 focus:ring-[#180f0a] transition" />
              </div>
            </div>
          </div>

          {/* Automation */}
          <div className="bg-white rounded-xl border border-[#e5e2dd] p-6 shadow-xs space-y-4">
            <h2 className="font-serif text-lg text-[#180f0a] font-medium flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">smart_toy</span> Automation
            </h2>
            <div className="space-y-3">
              <label className="flex items-center justify-between py-2">
                <span className="text-[13px] text-[#4e4540]">Auto-Confirm Orders</span>
                <button type="button" onClick={() => setSettings(p => ({ ...p, autoConfirmOrders: !p.autoConfirmOrders }))}
                  className={`w-10 h-6 rounded-full transition-colors ${settings.autoConfirmOrders ? 'bg-[#5b6d54]' : 'bg-[#d1c4bd]'}`}>
                  <span className={`block w-4 h-4 bg-white rounded-full transition-transform shadow-sm ${settings.autoConfirmOrders ? 'translate-x-5' : 'translate-x-1'}`}></span>
                </button>
              </label>
              <label className="flex items-center justify-between py-2">
                <span className="text-[13px] text-[#4e4540]">Auto-Assign Shipping</span>
                <button type="button" onClick={() => setSettings(p => ({ ...p, autoAssignShipping: !p.autoAssignShipping }))}
                  className={`w-10 h-6 rounded-full transition-colors ${settings.autoAssignShipping ? 'bg-[#5b6d54]' : 'bg-[#d1c4bd]'}`}>
                  <span className={`block w-4 h-4 bg-white rounded-full transition-transform shadow-sm ${settings.autoAssignShipping ? 'translate-x-5' : 'translate-x-1'}`}></span>
                </button>
              </label>
              <label className="flex items-center justify-between py-2">
                <span className="text-[13px] text-[#4e4540]">Order Tracking Enabled</span>
                <button type="button" onClick={() => setSettings(p => ({ ...p, trackingEnabled: !p.trackingEnabled }))}
                  className={`w-10 h-6 rounded-full transition-colors ${settings.trackingEnabled ? 'bg-[#5b6d54]' : 'bg-[#d1c4bd]'}`}>
                  <span className={`block w-4 h-4 bg-white rounded-full transition-transform shadow-sm ${settings.trackingEnabled ? 'translate-x-5' : 'translate-x-1'}`}></span>
                </button>
              </label>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4">
          <button type="button" onClick={handleReset} className="px-5 py-2 text-[13px] font-semibold text-[#4e4540] bg-white hover:bg-[#f6f3ee] border border-[#d1c4bd] rounded-full transition">
            Reset to Defaults
          </button>
          <button type="button" onClick={handleSave} className="px-6 py-2.5 text-[13px] font-semibold text-white bg-[#180f0a] hover:bg-[#2e241e] rounded-full transition shadow-sm">
            Save Changes
          </button>
        </div>

        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-[#180f0a] text-white px-5 py-3 rounded-full shadow-2xl">
            <span className="w-2 h-2 rounded-full bg-[#964735]"></span>
            <span className="text-[13px] font-medium">{toastMessage}</span>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
