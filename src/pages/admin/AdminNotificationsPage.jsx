import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout.jsx';
import AdminSettingsTabs from '../../components/admin/AdminSettingsTabs.jsx';
import { getSettings, updateSettings } from '../../services/settingsService.js';

/**
 * Notifications & Alerts (Phase 3D.5, E-01/E-04).
 * Preferences persist to the backend Settings document (notificationConfiguration)
 * via settingsService. No email/SMS/push DELIVERY exists yet — the page says so
 * honestly instead of claiming messages were sent.
 */
export default function AdminNotificationsPage() {
  const [settings, setSettings] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    setSettings(getSettings());
  }, []);

  const triggerToast = (msg) => { setToastMessage(msg); setTimeout(() => setToastMessage(null), 3200); };

  const toggle = (key) => setSettings(p => ({ ...p, [key]: !p[key] }));
  const setNum = (key) => (e) => setSettings(p => ({ ...p, [key]: +e.target.value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await updateSettings({
        emailNotifications: settings.emailNotifications,
        orderConfirmations: settings.orderConfirmations,
        orderStatusUpdates: settings.orderStatusUpdates,
        lowStockAlerts: settings.lowStockAlerts,
        criticalStockAlerts: settings.criticalStockAlerts,
        newCustomerRegistrations: settings.newCustomerRegistrations,
        dailyDigest: settings.dailyDigest,
        weeklyReport: settings.weeklyReport,
        browserPush: settings.browserPush,
        smsAlerts: settings.smsAlerts,
        alertThresholdLowStock: settings.alertThresholdLowStock,
        alertThresholdCriticalStock: settings.alertThresholdCriticalStock,
        digestTime: settings.digestTime,
        reportDay: settings.reportDay,
      });
      setSettings(updated);
      triggerToast('Notification preferences saved to the backend.');
    } catch (err) {
      triggerToast(err.message || 'Notification settings could not be saved. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (!settings) {
    return (
      <AdminLayout>
        <div className="max-w-7xl mx-auto p-8 text-[14px] text-[#80756f]">Loading settings…</div>
      </AdminLayout>
    );
  }

  const Switch = ({ on, onToggle }) => (
    <button type="button" onClick={onToggle}
      className={`w-10 h-6 rounded-full transition-colors ${on ? 'bg-[#5b6d54]' : 'bg-[#d1c4bd]'}`}>
      <span className={`block w-4 h-4 bg-white rounded-full transition-transform shadow-sm ${on ? 'translate-x-5' : 'translate-x-1'}`}></span>
    </button>
  );

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
            <p className="text-[15px] text-[#4e4540] mt-1">
              Configure notification preferences. Preferences are saved to the backend; actual email/SMS/push
              <strong> delivery is not connected</strong> in this prototype.
            </p>
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
                  <Switch on={settings[item.key]} onToggle={() => toggle(item.key)} />
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
                <Switch on={settings.lowStockAlerts} onToggle={() => toggle('lowStockAlerts')} />
              </label>
              <label className="flex items-center justify-between py-2">
                <span className="text-[13px] text-[#4e4540]">Critical Stock Alerts</span>
                <Switch on={settings.criticalStockAlerts} onToggle={() => toggle('criticalStockAlerts')} />
              </label>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-[12px] font-semibold text-[#4e4540] mb-1">Low Stock Threshold</label>
                  <input type="number" value={settings.alertThresholdLowStock} onChange={setNum('alertThresholdLowStock')}
                    className="w-full text-[13px] bg-[#f6f3ee] border border-[#d1c4bd] focus:border-[#180f0a] rounded-lg px-3 py-2 focus:ring-1 focus:ring-[#180f0a] transition" />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-[#4e4540] mb-1">Critical Stock Threshold</label>
                  <input type="number" value={settings.alertThresholdCriticalStock} onChange={setNum('alertThresholdCriticalStock')}
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
            <p className="text-[12px] text-[#80756f]">
              Preferences only — no channel is actually sending messages in this prototype.
            </p>
            <div className="space-y-3">
              {[
                { key: 'emailNotifications', label: 'Email Notifications' },
                { key: 'browserPush', label: 'Browser Push Notifications' },
                { key: 'smsAlerts', label: 'SMS Alerts' },
              ].map(item => (
                <label key={item.key} className="flex items-center justify-between py-2">
                  <span className="text-[13px] text-[#4e4540]">{item.label}</span>
                  <Switch on={settings[item.key]} onToggle={() => toggle(item.key)} />
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
                <Switch on={settings.dailyDigest} onToggle={() => toggle('dailyDigest')} />
              </label>
              <label className="flex items-center justify-between py-2">
                <span className="text-[13px] text-[#4e4540]">Weekly Summary Report</span>
                <Switch on={settings.weeklyReport} onToggle={() => toggle('weeklyReport')} />
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
          <button type="button" onClick={handleSave} disabled={saving} className="px-6 py-2.5 text-[13px] font-semibold text-white bg-[#180f0a] hover:bg-[#2e241e] rounded-full transition shadow-sm disabled:opacity-60">
            {saving ? 'Saving...' : 'Save Notification Settings'}
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