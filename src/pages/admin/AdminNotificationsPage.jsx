import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout.jsx';
import AdminSettingsTabs from '../../components/admin/AdminSettingsTabs.jsx';

const INITIAL_NOTIFICATIONS = {
  emailNotifications: true,
  orderConfirmations: true,
  orderStatusUpdates: true,
  lowStockAlerts: true,
  criticalStockAlerts: true,
  newCustomerRegistrations: false,
  dailyDigest: true,
  weeklyReport: true,
  browserPush: false,
  smsAlerts: false,
  alertThresholdLowStock: 10,
  alertThresholdCriticalStock: 5,
  digestTime: '09:00',
  reportDay: 'Monday',
};

export default function AdminNotificationsPage() {
  const [settings, setSettings] = useState(INITIAL_NOTIFICATIONS);
  const [toastMessage, setToastMessage] = useState(null);

  const triggerToast = (msg) => { setToastMessage(msg); setTimeout(() => setToastMessage(null), 3000); };

  const toggle = (key) => setSettings(p => ({ ...p, [key]: !p[key] }));

  const handleSave = () => {
    triggerToast('Notification settings saved locally (sample data). Backend integration pending.');
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-8 pb-12">
        {/* Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-[#f6f3ee] p-6 sm:p-8 shadow-xs border border-[#e5e2dd]">
          <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-gradient-to-br from-[#ffdad3]/40 via-[#f1dfd5]/30 to-transparent blur-3xl pointer-events-none"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-1.5 text-[13px] text-[#80756f] mb-2">
              <span>System</span><span className="text-[#d1c4bd]">/</span><span>Settings</span><span className="text-[#d1c4bd]">/</span><span className="text-[#180f0a] font-semibold">Notifications & Alerts</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#180f0a] tracking-tight font-normal">Notifications & Alerts</h1>
            <p className="text-[15px] text-[#4e4540] mt-1">Configure notification channels, alert thresholds, and digest preferences.</p>
          </div>
          <div className="mt-6 pt-2 border-t border-[#e5e2dd]/60">
            <AdminSettingsTabs activeTab="notifications" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Order Notifications */}
          <div className="bg-white rounded-xl border border-[#e5e2dd] p-6 shadow-xs space-y-4">
            <h2 className="font-serif text-lg text-[#180f0a] font-medium flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">shopping_bag</span> Order Notifications
            </h2>
            <div className="space-y-3">
              {[
                { key: 'orderConfirmations', label: 'Order Confirmations' },
                { key: 'orderStatusUpdates', label: 'Order Status Updates' },
                { key: 'newCustomerRegistrations', label: 'New Customer Registrations' },
              ].map(item => (
                <label key={item.key} className="flex items-center justify-between py-2">
                  <span className="text-[13px] text-[#4e4540]">{item.label}</span>
                  <button type="button" onClick={() => toggle(item.key)}
                    className={`w-10 h-6 rounded-full transition-colors ${settings[item.key] ? 'bg-[#5b6d54]' : 'bg-[#d1c4bd]'}`}>
                    <span className={`block w-4 h-4 bg-white rounded-full transition-transform shadow-sm ${settings[item.key] ? 'translate-x-5' : 'translate-x-1'}`}></span>
                  </button>
                </label>
              ))}
            </div>
          </div>

          {/* Inventory Alerts */}
          <div className="bg-white rounded-xl border border-[#e5e2dd] p-6 shadow-xs space-y-4">
            <h2 className="font-serif text-lg text-[#180f0a] font-medium flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-[#964735]">warning</span> Inventory Alerts
            </h2>
            <div className="space-y-3">
              <label className="flex items-center justify-between py-2">
                <span className="text-[13px] text-[#4e4540]">Low Stock Alerts</span>
                <button type="button" onClick={() => toggle('lowStockAlerts')}
                  className={`w-10 h-6 rounded-full transition-colors ${settings.lowStockAlerts ? 'bg-[#5b6d54]' : 'bg-[#d1c4bd]'}`}>
                  <span className={`block w-4 h-4 bg-white rounded-full transition-transform shadow-sm ${settings.lowStockAlerts ? 'translate-x-5' : 'translate-x-1'}`}></span>
                </button>
              </label>
              <label className="flex items-center justify-between py-2">
                <span className="text-[13px] text-[#4e4540]">Critical Stock Alerts</span>
                <button type="button" onClick={() => toggle('criticalStockAlerts')}
                  className={`w-10 h-6 rounded-full transition-colors ${settings.criticalStockAlerts ? 'bg-[#ba1a1a]' : 'bg-[#d1c4bd]'}`}>
                  <span className={`block w-4 h-4 bg-white rounded-full transition-transform shadow-sm ${settings.criticalStockAlerts ? 'translate-x-5' : 'translate-x-1'}`}></span>
                </button>
              </label>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-[12px] font-semibold text-[#4e4540] mb-1">Low Stock Threshold</label>
                  <input type="number" value={settings.alertThresholdLowStock} onChange={e => setSettings(p => ({ ...p, alertThresholdLowStock: +e.target.value }))}
                    className="w-full text-[13px] bg-[#f6f3ee] border border-[#d1c4bd] focus:border-[#180f0a] rounded-lg px-3 py-2 focus:ring-1 focus:ring-[#180f0a] transition" />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-[#4e4540] mb-1">Critical Stock Threshold</label>
                  <input type="number" value={settings.alertThresholdCriticalStock} onChange={e => setSettings(p => ({ ...p, alertThresholdCriticalStock: +e.target.value }))}
                    className="w-full text-[13px] bg-[#f6f3ee] border border-[#d1c4bd] focus:border-[#180f0a] rounded-lg px-3 py-2 focus:ring-1 focus:ring-[#180f0a] transition" />
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Channels */}
          <div className="bg-white rounded-xl border border-[#e5e2dd] p-6 shadow-xs space-y-4">
            <h2 className="font-serif text-lg text-[#180f0a] font-medium flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">send</span> Delivery Channels
            </h2>
            <div className="space-y-3">
              {[
                { key: 'emailNotifications', label: 'Email Notifications' },
                { key: 'browserPush', label: 'Browser Push Notifications' },
                { key: 'smsAlerts', label: 'SMS Alerts' },
              ].map(item => (
                <label key={item.key} className="flex items-center justify-between py-2">
                  <span className="text-[13px] text-[#4e4540]">{item.label}</span>
                  <button type="button" onClick={() => toggle(item.key)}
                    className={`w-10 h-6 rounded-full transition-colors ${settings[item.key] ? 'bg-[#5b6d54]' : 'bg-[#d1c4bd]'}`}>
                    <span className={`block w-4 h-4 bg-white rounded-full transition-transform shadow-sm ${settings[item.key] ? 'translate-x-5' : 'translate-x-1'}`}></span>
                  </button>
                </label>
              ))}
            </div>
          </div>

          {/* Reports & Digests */}
          <div className="bg-white rounded-xl border border-[#e5e2dd] p-6 shadow-xs space-y-4">
            <h2 className="font-serif text-lg text-[#180f0a] font-medium flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">analytics</span> Reports & Digests
            </h2>
            <div className="space-y-3">
              <label className="flex items-center justify-between py-2">
                <span className="text-[13px] text-[#4e4540]">Daily Digest Email</span>
                <button type="button" onClick={() => toggle('dailyDigest')}
                  className={`w-10 h-6 rounded-full transition-colors ${settings.dailyDigest ? 'bg-[#5b6d54]' : 'bg-[#d1c4bd]'}`}>
                  <span className={`block w-4 h-4 bg-white rounded-full transition-transform shadow-sm ${settings.dailyDigest ? 'translate-x-5' : 'translate-x-1'}`}></span>
                </button>
              </label>
              <label className="flex items-center justify-between py-2">
                <span className="text-[13px] text-[#4e4540]">Weekly Summary Report</span>
                <button type="button" onClick={() => toggle('weeklyReport')}
                  className={`w-10 h-6 rounded-full transition-colors ${settings.weeklyReport ? 'bg-[#5b6d54]' : 'bg-[#d1c4bd]'}`}>
                  <span className={`block w-4 h-4 bg-white rounded-full transition-transform shadow-sm ${settings.weeklyReport ? 'translate-x-5' : 'translate-x-1'}`}></span>
                </button>
              </label>
              <div>
                <label className="block text-[12px] font-semibold text-[#4e4540] mb-1">Digest Time</label>
                <input type="time" value={settings.digestTime} onChange={e => setSettings(p => ({ ...p, digestTime: e.target.value }))}
                  className="w-full text-[13px] bg-[#f6f3ee] border border-[#d1c4bd] focus:border-[#180f0a] rounded-lg px-3 py-2 focus:ring-1 focus:ring-[#180f0a] transition" />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-[#4e4540] mb-1">Weekly Report Day</label>
                <select value={settings.reportDay} onChange={e => setSettings(p => ({ ...p, reportDay: e.target.value }))}
                  className="w-full text-[13px] bg-[#f6f3ee] border border-[#d1c4bd] focus:border-[#180f0a] rounded-lg px-3 py-2 focus:ring-1 focus:ring-[#180f0a] transition">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Save */}
        <div className="flex justify-end pt-4">
          <button type="button" onClick={handleSave} className="px-6 py-2.5 text-[13px] font-semibold text-white bg-[#180f0a] hover:bg-[#2e241e] rounded-full transition shadow-sm">
            Save Notification Settings
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
