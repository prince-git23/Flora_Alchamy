import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout.jsx';
import AdminSettingsTabs from '../../components/admin/AdminSettingsTabs.jsx';
import {
  getGeneralSettings,
  saveGeneralSettings,
  resetGeneralSettings
} from '../../services/adminSettings.js';

export default function AdminGeneralSettingsPage() {
  const [settings, setSettings] = useState(getGeneralSettings());
  const [isDirty, setIsDirty] = useState(false);
  const [saveStatus, setSaveStatus] = useState('idle'); // 'idle' | 'saving' | 'saved'
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    setSettings(getGeneralSettings());
  }, []);

  const handleChange = (field, value) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value
    }));
    setIsDirty(true);
    setSaveStatus('idle');
  };

  const handleToggle = (field) => {
    handleChange(field, !settings[field]);
  };

  const handleSave = () => {
    setSaveStatus('saving');
    setTimeout(() => {
      const saved = saveGeneralSettings(settings);
      setSettings(saved);
      setIsDirty(false);
      setSaveStatus('saved');
      setToastMessage('Store settings persisted to local operational state');

      setTimeout(() => {
        setSaveStatus('idle');
      }, 2500);
    }, 600);
  };

  const handleReset = () => {
    const defaulted = resetGeneralSettings();
    setSettings(defaulted);
    setIsDirty(false);
    setSaveStatus('idle');
    setToastMessage('Reverted store settings to initial defaults');
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-8 pb-16">
        {/* Page Header & Settings Sub-Nav */}
        <header className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-[13px] text-[#80756f]">
                <span>System</span>
                <span className="text-[#d1c4bd]">/</span>
                <span>Settings</span>
                <span className="text-[#d1c4bd]">/</span>
                <span className="text-[#180f0a] font-semibold">General</span>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <h1 className="font-serif text-3xl sm:text-4xl text-[#180f0a] tracking-tight font-normal">
                  General Settings
                </h1>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffdad3] text-[#783020] text-[11px] font-bold shadow-xs">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#964735] animate-pulse"></span>
                  Sample Data Environment
                </span>
              </div>

              <p className="text-[15px] text-[#4e4540] max-w-2xl">
                Manage basic store information, public identifiers, operational availability, and regional catalog formatting.
              </p>
            </div>

            {/* Live Status Indicator Card */}
            <div className="flex items-center gap-3 self-start md:self-auto bg-[#f6f3ee] px-4 py-2.5 rounded-2xl shadow-xs border border-[#e5e2dd]">
              <span className={`material-symbols-outlined text-[20px] ${isDirty ? 'text-[#964735]' : 'text-[#5b6d54]'}`}>
                {isDirty ? 'pending' : 'cloud_done'}
              </span>
              <div className="flex flex-col text-left leading-tight">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#80756f]">Current State</span>
                <span className="text-[13px] font-semibold text-[#180f0a]">
                  {isDirty ? 'Unsaved Changes Pending' : 'Up to date (Local Cache)'}
                </span>
              </div>
            </div>
          </div>

          {/* Sub-Navigation Tabs */}
          <div className="pt-2">
            <AdminSettingsTabs activeTab="general" />
          </div>
        </header>

        {/* Sticky State Control Banner */}
        <aside className="sticky top-16 z-20 p-4 md:px-6 rounded-2xl bg-white/95 backdrop-blur-md shadow-md border border-[#e5e2dd] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                isDirty ? 'bg-[#ffdad3] text-[#964735]' : 'bg-[#f6f3ee] text-[#180f0a]'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">
                {isDirty ? 'pending' : 'verified_user'}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[13px] font-semibold text-[#180f0a]">
                {isDirty ? 'Unsaved changes detected' : 'All changes saved to sample environment'}
              </span>
              <span className="text-[12px] text-[#4e4540]">
                {isDirty
                  ? 'You have modified store preferences that have not been persisted.'
                  : 'Parameters reflect live handler catalog routing.'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-1.5 rounded-full bg-[#f6f3ee] hover:bg-[#ebe8e3] text-[#1c1c19] text-[13px] font-semibold transition-all"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saveStatus === 'saving'}
              className="px-5 py-1.5 rounded-full bg-[#180f0a] hover:bg-[#2e241e] text-white text-[13px] font-semibold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
            >
              <span className={`material-symbols-outlined text-[17px] ${saveStatus === 'saving' ? 'animate-spin' : ''}`}>
                {saveStatus === 'saving' ? 'sync' : saveStatus === 'saved' ? 'done_all' : 'save'}
              </span>
              <span>
                {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved!' : 'Save Changes'}
              </span>
            </button>
          </div>
        </aside>

        {/* Card 1: Store Information */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 shadow-[0_4px_20px_-2px_rgba(46,36,30,0.04)] border border-[#e5e2dd] space-y-6">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-[#180f0a]">
              <span className="material-symbols-outlined text-[#964735] text-[22px]">storefront</span>
              <h2 className="font-serif text-2xl font-medium">Store Information</h2>
            </div>
            <p className="text-[14px] text-[#4e4540]">
              Manage public brand name, contact details, and customer-facing descriptors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Store Name */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#80756f]">
                Store Name
              </label>
              <input
                type="text"
                value={settings.storeName}
                onChange={(e) => handleChange('storeName', e.target.value)}
                className="w-full bg-[#f6f3ee] focus:bg-white px-4 py-2.5 rounded-xl text-[14px] text-[#1c1c19] border border-transparent focus:border-[#180f0a] focus:outline-none transition-all"
              />
              <span className="text-[12px] text-[#80756f] block">
                Public brand descriptor displayed across invoices and receipts.
              </span>
            </div>

            {/* Store Headline & Bio */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#80756f]">
                Store Headline &amp; Bio
              </label>
              <input
                type="text"
                value={settings.storeTagline}
                onChange={(e) => handleChange('storeTagline', e.target.value)}
                className="w-full bg-[#f6f3ee] focus:bg-white px-4 py-2.5 rounded-xl text-[14px] text-[#1c1c19] border border-transparent focus:border-[#180f0a] focus:outline-none transition-all"
              />
              <span className="text-[12px] text-[#80756f] block">
                Embedded into metadata tags and notification email signatures.
              </span>
            </div>

            {/* Contact Email */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#80756f]">
                Contact Email Address
              </label>
              <input
                type="email"
                value={settings.contactEmail}
                onChange={(e) => handleChange('contactEmail', e.target.value)}
                className="w-full bg-[#f6f3ee] focus:bg-white px-4 py-2.5 rounded-xl text-[14px] text-[#1c1c19] border border-transparent focus:border-[#180f0a] focus:outline-none transition-all"
              />
              <span className="text-[12px] text-[#964735] block">
                Demonstration email address for notification routing
              </span>
            </div>

            {/* Support Phone */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#80756f]">
                Support &amp; Handler Telephone
              </label>
              <input
                type="text"
                value={settings.contactPhone}
                onChange={(e) => handleChange('contactPhone', e.target.value)}
                className="w-full bg-[#f6f3ee] focus:bg-white px-4 py-2.5 rounded-xl text-[14px] text-[#1c1c19] border border-transparent focus:border-[#180f0a] focus:outline-none transition-all"
              />
              <span className="text-[12px] text-[#80756f] block">
                Included on package delivery labels and fulfillment records.
              </span>
            </div>

            {/* Settlement Currency (Read-only / Badged) */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#80756f]">
                Primary Settlement Currency
              </label>
              <div className="flex items-center justify-between px-4 py-2.5 bg-[#f0ede9] rounded-xl border border-[#e5e2dd]">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-[#ffdad3] text-[#783020] text-[11px] font-bold">
                    INR
                  </span>
                  <span className="text-[14px] font-medium text-[#180f0a]">
                    Indian Rupee (INR · ₹)
                  </span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#80756f]">
                  Fixed Core Base
                </span>
              </div>
              <span className="text-[12px] text-[#80756f] block">
                Settlement lock active. Multi-currency conversions are handled at checkout.
              </span>
            </div>

            {/* Time Zone */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#80756f]">
                Primary Time Zone
              </label>
              <div className="relative">
                <select
                  value={settings.timezone}
                  onChange={(e) => handleChange('timezone', e.target.value)}
                  className="w-full bg-[#f6f3ee] focus:bg-white px-4 py-2.5 rounded-xl text-[14px] text-[#1c1c19] border border-transparent focus:border-[#180f0a] focus:outline-none appearance-none cursor-pointer transition-all pr-10"
                >
                  <option value="Asia/Kolkata">Asia/Kolkata (IST - UTC+05:30)</option>
                  <option value="Asia/Dubai">Asia/Dubai (GST - UTC+04:00)</option>
                  <option value="Europe/London">Europe/London (GMT/BST - UTC+00:00)</option>
                  <option value="America/New_York">America/New_York (EST - UTC-05:00)</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#80756f] text-[20px]">
                  expand_more
                </span>
              </div>
              <span className="text-[12px] text-[#80756f] block">
                Used for cutoff timestamps on delivery schedules and dispatch schedules.
              </span>
            </div>
          </div>
        </section>

        {/* Visual Asymmetric Spotlight / Operational Health Preview */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-[#f6f3ee] rounded-2xl p-6 sm:p-8 flex flex-col justify-between gap-6 shadow-xs border border-[#e5e2dd]">
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#964735]">
                Operational Readiness
              </span>
              <h3 className="font-serif text-2xl text-[#180f0a] font-medium">
                Sample Fulfillment Routing &amp; Diagnostics
              </h3>
              <p className="text-[13px] text-[#4e4540] max-w-xl">
                This workspace reflects sample order volumes, catalog prices, and test fulfillment workflows. Changes made are immediate in the browser memory session.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="bg-white p-3.5 rounded-xl border border-[#e5e2dd]/60 shadow-xs">
                <span className="text-[10px] font-bold uppercase text-[#80756f]">Active Catalog</span>
                <div className="font-serif text-lg text-[#180f0a] mt-1 font-semibold">24 Items</div>
                <span className="text-[11px] text-[#80756f]">Pipe-cleaner &amp; Paper</span>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-[#e5e2dd]/60 shadow-xs">
                <span className="text-[10px] font-bold uppercase text-[#80756f]">Pending Dispatch</span>
                <div className="font-serif text-lg text-[#964735] mt-1 font-semibold">8 Orders</div>
                <span className="text-[11px] text-[#80756f]">Domestic Express</span>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-[#e5e2dd]/60 shadow-xs">
                <span className="text-[10px] font-bold uppercase text-[#80756f]">Payment Gateway</span>
                <div className="font-serif text-lg text-[#180f0a] mt-1 font-semibold">Mock UPI / Card</div>
                <span className="text-[11px] text-[#80756f]">Razorpay Testbed</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 bg-white rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-xs border border-[#e5e2dd]">
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#80756f]">
                Storefront Snapshot
              </span>
              <h4 className="font-serif text-xl text-[#180f0a] font-medium">Catalog Preview</h4>
              <p className="text-[13px] text-[#4e4540]">
                Live preview of product card rendering under current INR currency conventions.
              </p>
            </div>

            <div className="mt-4 p-3 rounded-xl bg-[#f6f3ee] flex items-center gap-3 border border-[#e5e2dd]/60">
              <img
                src="/assets/images/flora-asset-01.jpg"
                alt="Elysian Bloom Bundle"
                className="w-16 h-16 rounded-lg object-cover shadow-xs shrink-0"
              />
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#964735]">
                  Floral Arrangement
                </span>
                <span className="text-[13px] font-semibold text-[#180f0a] truncate">
                  Elysian Bloom Bundle
                </span>
                <span className="text-[13px] text-[#4e4540] font-medium mt-0.5">
                  ₹3,450.00
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Card 2: Store Availability & Fulfillment Gateways */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 shadow-[0_4px_20px_-2px_rgba(46,36,30,0.04)] border border-[#e5e2dd] space-y-6">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-[#180f0a]">
              <span className="material-symbols-outlined text-[#964735] text-[22px]">toggle_on</span>
              <h2 className="font-serif text-2xl font-medium">
                Store Availability &amp; Fulfillment Gateways
              </h2>
            </div>
            <p className="text-[14px] text-[#4e4540]">
              Control public storefront visibility, checkout authorization, and bespoke inquiry intakes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Toggle 1: Store Status */}
            <div className="p-4 rounded-2xl bg-[#f6f3ee] flex flex-col justify-between gap-4 border border-[#e5e2dd]/60">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[14px] font-semibold text-[#180f0a]">Store Status</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      settings.storeStatus
                        ? 'bg-[#ffdad3] text-[#783020]'
                        : 'bg-[#ebe8e3] text-[#4e4540]'
                    }`}
                  >
                    {settings.storeStatus ? 'Open / Active' : 'Closed / Inactive'}
                  </span>
                </div>
                <p className="text-[12px] text-[#4e4540]">
                  When active, customers can browse the storefront and view catalog pricing.
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#e5e2dd]/40">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#80756f]">Current State</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={settings.storeStatus}
                  onClick={() => handleToggle('storeStatus')}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${
                    settings.storeStatus ? 'bg-[#180f0a]' : 'bg-[#e5e2dd]'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition duration-200 ease-in-out mt-1 ${
                      settings.storeStatus ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Toggle 2: Accept New Orders */}
            <div className="p-4 rounded-2xl bg-[#f6f3ee] flex flex-col justify-between gap-4 border border-[#e5e2dd]/60">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[14px] font-semibold text-[#180f0a]">Accept New Orders</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      settings.ordersStatus
                        ? 'bg-[#ffdad3] text-[#783020]'
                        : 'bg-[#ebe8e3] text-[#4e4540]'
                    }`}
                  >
                    {settings.ordersStatus ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
                <p className="text-[12px] text-[#4e4540]">
                  Allow customers to place checkout orders. When disabled, checkout is temporarily suspended.
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#e5e2dd]/40">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#80756f]">Current State</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={settings.ordersStatus}
                  onClick={() => handleToggle('ordersStatus')}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${
                    settings.ordersStatus ? 'bg-[#180f0a]' : 'bg-[#e5e2dd]'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition duration-200 ease-in-out mt-1 ${
                      settings.ordersStatus ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Toggle 3: Bespoke Requests */}
            <div className="p-4 rounded-2xl bg-[#f6f3ee] flex flex-col justify-between gap-4 border border-[#e5e2dd]/60">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[14px] font-semibold text-[#180f0a]">Bespoke Requests</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      settings.bespokeStatus
                        ? 'bg-[#ffdad3] text-[#783020]'
                        : 'bg-[#ebe8e3] text-[#4e4540]'
                    }`}
                  >
                    {settings.bespokeStatus ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
                <p className="text-[12px] text-[#4e4540]">
                  Allow customers to access the custom bouquet builder and submit bespoke gifting inquiries.
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#e5e2dd]/40">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#80756f]">Current State</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={settings.bespokeStatus}
                  onClick={() => handleToggle('bespokeStatus')}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${
                    settings.bespokeStatus ? 'bg-[#180f0a]' : 'bg-[#e5e2dd]'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition duration-200 ease-in-out mt-1 ${
                      settings.bespokeStatus ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Card 3: Regional Standards & Formatting */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 shadow-[0_4px_20px_-2px_rgba(46,36,30,0.04)] border border-[#e5e2dd] space-y-6">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-[#180f0a]">
              <span className="material-symbols-outlined text-[#964735] text-[22px]">public</span>
              <h2 className="font-serif text-2xl font-medium">Regional Standards &amp; Formatting</h2>
            </div>
            <p className="text-[14px] text-[#4e4540]">
              Configure financial notation, calendar conventions, and dispatch reporting standards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Currency Format */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#80756f]">
                Currency Symbol &amp; Display
              </label>
              <div className="relative">
                <select
                  value={settings.currencyFormat}
                  onChange={(e) => handleChange('currencyFormat', e.target.value)}
                  className="w-full bg-[#f6f3ee] focus:bg-white px-4 py-2.5 rounded-xl text-[14px] text-[#1c1c19] border border-transparent focus:border-[#180f0a] focus:outline-none appearance-none cursor-pointer pr-10"
                >
                  <option value="inr_lakh">INR (₹) — Suffix or Prefix with standard lakh/crore formatting</option>
                  <option value="inr_standard">INR (₹) — Standard international millions grouping (e.g. ₹ 100,000.00)</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#80756f] text-[20px]">
                  expand_more
                </span>
              </div>
              <span className="text-[12px] text-[#80756f] block">
                Example output: ₹ 1,50,000.00 vs ₹ 150,000.00
              </span>
            </div>

            {/* Date Format */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#80756f]">
                Date Format
              </label>
              <div className="relative">
                <select
                  value={settings.dateFormat}
                  onChange={(e) => handleChange('dateFormat', e.target.value)}
                  className="w-full bg-[#f6f3ee] focus:bg-white px-4 py-2.5 rounded-xl text-[14px] text-[#1c1c19] border border-transparent focus:border-[#180f0a] focus:outline-none appearance-none cursor-pointer pr-10"
                >
                  <option value="dd_mmm_yyyy">DD MMM YYYY (e.g., 28 Aug 2026)</option>
                  <option value="yyyy_mm_dd">YYYY-MM-DD (e.g., 2026-08-28)</option>
                  <option value="dd_mm_yyyy">DD/MM/YYYY (e.g., 28/08/2026)</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#80756f] text-[20px]">
                  expand_more
                </span>
              </div>
              <span className="text-[12px] text-[#80756f] block">
                Applied to invoice prints, fulfillment tags, and dispatch logs.
              </span>
            </div>

            {/* Time Format */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#80756f]">
                Time Format
              </label>
              <div className="relative">
                <select
                  value={settings.timeFormat}
                  onChange={(e) => handleChange('timeFormat', e.target.value)}
                  className="w-full bg-[#f6f3ee] focus:bg-white px-4 py-2.5 rounded-xl text-[14px] text-[#1c1c19] border border-transparent focus:border-[#180f0a] focus:outline-none appearance-none cursor-pointer pr-10"
                >
                  <option value="12h">12-Hour (hh:mm A IST)</option>
                  <option value="24h">24-Hour (HH:mm IST)</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#80756f] text-[20px]">
                  expand_more
                </span>
              </div>
              <span className="text-[12px] text-[#80756f] block">
                Customer-facing delivery slot options will adhere to this notation.
              </span>
            </div>

            {/* First Day of the Week */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#80756f]">
                First Day of the Week
              </label>
              <div className="relative">
                <select
                  value={settings.firstDay}
                  onChange={(e) => handleChange('firstDay', e.target.value)}
                  className="w-full bg-[#f6f3ee] focus:bg-white px-4 py-2.5 rounded-xl text-[14px] text-[#1c1c19] border border-transparent focus:border-[#180f0a] focus:outline-none appearance-none cursor-pointer pr-10"
                >
                  <option value="monday">Monday</option>
                  <option value="sunday">Sunday</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#80756f] text-[20px]">
                  expand_more
                </span>
              </div>
              <span className="text-[12px] text-[#80756f] block">
                Affects order analytics calendars and weekly fulfillment recaps.
              </span>
            </div>
          </div>

          {/* Governance Notice */}
          <div className="p-4 rounded-xl bg-[#f6f3ee] flex items-start gap-3 mt-4 border border-[#e5e2dd]/60">
            <span className="material-symbols-outlined text-[#80756f] text-[20px] mt-0.5">info</span>
            <p className="text-[13px] text-[#4e4540]">
              <strong className="text-[#180f0a] font-semibold">Governance notice:</strong> Operational settings operate strictly within the demonstration environment. No external ERP or physical facility configurations are impacted.
            </p>
          </div>

          {/* Card Action Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-[#f0ede9]">
            <div className="flex items-center gap-1.5 text-[#80756f] text-[13px]">
              <span className="material-symbols-outlined text-[16px]">schedule</span>
              <span>Last modified by Handler Admin: {settings.lastModified || 'Today at 10:42 AM IST'}</span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 rounded-full bg-[#ebe8e3] hover:bg-[#e5e2dd] text-[#1c1c19] text-[13px] font-semibold transition-all"
              >
                Reset to Defaults
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={saveStatus === 'saving'}
                className="px-6 py-2 rounded-full bg-[#180f0a] hover:bg-[#2e241e] text-white text-[13px] font-semibold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
              >
                <span className={`material-symbols-outlined text-[16px] ${saveStatus === 'saving' ? 'animate-spin' : ''}`}>
                  {saveStatus === 'saving' ? 'sync' : 'check'}
                </span>
                <span>
                  {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved!' : 'Save Changes'}
                </span>
              </button>
            </div>
          </div>
        </section>

        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-[#180f0a] text-white px-5 py-3 rounded-full shadow-2xl border border-white/10 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-[#ffdad3]"></span>
            <span className="text-[13px] font-medium tracking-wide">{toastMessage}</span>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
