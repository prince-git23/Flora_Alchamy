import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout.jsx';
import AdminSettingsTabs from '../../components/admin/AdminSettingsTabs.jsx';
import {
  getStorePreferences,
  saveStorePreferences,
  resetStorePreferences
} from '../../services/adminSettings.js';

export default function AdminStorePreferencesPage() {
  const [preferences, setPreferences] = useState(getStorePreferences());
  const [syncStatus, setSyncStatus] = useState('Sample preferences ready');
  const [saveStatus, setSaveStatus] = useState('idle'); // 'idle' | 'saving' | 'saved'
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    setPreferences(getStorePreferences());
  }, []);

  const handleToggle = (key) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
    setSyncStatus('Unsaved preferences pending synchronization');
  };

  const handleChange = (key, val) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: val
    }));
    setSyncStatus('Unsaved preferences pending synchronization');
  };

  const handleSave = () => {
    setSaveStatus('saving');
    setSyncStatus('Syncing preferences with portal server...');

    setTimeout(() => {
      saveStorePreferences(preferences);
      setSaveStatus('saved');
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setSyncStatus(`Preferences synced successfully at ${now}`);
      setToastMessage('Preferences saved and synced to current session');

      setTimeout(() => {
        setSaveStatus('idle');
      }, 2000);
    }, 650);
  };

  const handleReset = () => {
    const defaults = resetStorePreferences();
    setPreferences(defaults);
    setSaveStatus('idle');
    setSyncStatus('Reverted to system benchmark defaults');
    setToastMessage('Preferences reverted to system benchmark defaults');

    setTimeout(() => {
      setSyncStatus('Preferences synced to current browser session');
    }, 2500);
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-8 pb-20">
        {/* Page Header & Breadcrumb Context */}
        <header className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-[13px] text-[#80756f]">
                <span>System</span>
                <span className="text-[#d1c4bd]">/</span>
                <span>Settings</span>
                <span className="text-[#d1c4bd]">/</span>
                <span className="text-[#180f0a] font-semibold">Store Preferences</span>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl text-[#180f0a] tracking-tight font-normal">
                Store Preferences
              </h1>
              <p className="text-[15px] text-[#4e4540]">
                Customize operational defaults for the Handler Portal.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffdad3] text-[#783020] text-[11px] font-bold shadow-xs">
                <span className="h-1.5 w-1.5 rounded-full bg-[#964735] animate-pulse"></span>
                Sample Data Environment
              </span>
            </div>
          </div>

          {/* Settings Sub-Navigation Tabs */}
          <div className="pt-2">
            <AdminSettingsTabs activeTab="preferences" />
          </div>
        </header>

        {/* Top Sync Status & Action Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-[#f6f3ee] rounded-xl shadow-[0_2px_12px_rgba(46,36,30,0.03)] border border-[#e5e2dd]">
          <div className="flex items-center gap-2 text-[#4e4540]">
            <span className={`material-symbols-outlined text-[#964735] text-[20px] ${saveStatus === 'saving' ? 'animate-spin' : ''}`}>
              sync
            </span>
            <span className="text-[13px]">{syncStatus}</span>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-1.5 rounded-full text-[13px] font-semibold text-[#4e4540] hover:text-[#180f0a] hover:bg-[#ebe8e3] transition-all"
            >
              Reset to Defaults
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saveStatus === 'saving'}
              className="inline-flex items-center gap-1.5 px-5 py-1.5 rounded-full bg-[#180f0a] text-white text-[13px] font-semibold shadow-xs hover:bg-[#2e241e] transition-all disabled:opacity-60 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">
                {saveStatus === 'saved' ? 'done_all' : 'check'}
              </span>
              <span>{saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved!' : 'Save Changes'}</span>
            </button>
          </div>
        </div>

        {/* Preferences Settings Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (Wide, 7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            {/* 1. Interface & Table Behavior */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-[0_4px_20px_-2px_rgba(46,36,30,0.04)] border border-[#e5e2dd] space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-[#f0ede9]">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#964735] text-[20px]">table_rows</span>
                  <h2 className="font-serif text-2xl text-[#180f0a] font-medium">
                    Interface &amp; Table Behavior
                  </h2>
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#80756f]">
                  Display Engine
                </span>
              </div>

              <div className="space-y-4 divide-y divide-[#f0ede9]">
                {/* Compact Table View */}
                <div className="flex items-center justify-between pt-3">
                  <div className="pr-4">
                    <label
                      htmlFor="toggle-compact"
                      className="text-[14px] font-semibold text-[#180f0a] block cursor-pointer"
                    >
                      Compact Table View
                    </label>
                    <p className="text-[13px] text-[#4e4540]">
                      Display tighter row spacing and conceal botanical preview thumbnails.
                    </p>
                  </div>
                  <button
                    id="toggle-compact"
                    type="button"
                    role="switch"
                    aria-checked={preferences.compactTable}
                    onClick={() => handleToggle('compactTable')}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${
                      preferences.compactTable ? 'bg-[#180f0a]' : 'bg-[#e5e2dd]'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition duration-200 ease-in-out mt-1 ${
                        preferences.compactTable ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Remember Table Filters & Search */}
                <div className="flex items-center justify-between pt-4">
                  <div className="pr-4">
                    <label
                      htmlFor="toggle-filters"
                      className="text-[14px] font-semibold text-[#180f0a] block cursor-pointer"
                    >
                      Remember Table Filters &amp; Search
                    </label>
                    <p className="text-[13px] text-[#4e4540]">
                      Persist active filters, batch statuses, and search parameters across navigation.
                    </p>
                  </div>
                  <button
                    id="toggle-filters"
                    type="button"
                    role="switch"
                    aria-checked={preferences.rememberFilters}
                    onClick={() => handleToggle('rememberFilters')}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${
                      preferences.rememberFilters ? 'bg-[#180f0a]' : 'bg-[#e5e2dd]'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition duration-200 ease-in-out mt-1 ${
                        preferences.rememberFilters ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Show Loading Indicators & Skeletons */}
                <div className="flex items-center justify-between pt-4">
                  <div className="pr-4">
                    <label
                      htmlFor="toggle-skeletons"
                      className="text-[14px] font-semibold text-[#180f0a] block cursor-pointer"
                    >
                      Show Loading Indicators &amp; Skeletons
                    </label>
                    <p className="text-[13px] text-[#4e4540]">
                      Display smooth skeleton placeholders on background catalogue and inventory fetches.
                    </p>
                  </div>
                  <button
                    id="toggle-skeletons"
                    type="button"
                    role="switch"
                    aria-checked={preferences.showSkeletons}
                    onClick={() => handleToggle('showSkeletons')}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${
                      preferences.showSkeletons ? 'bg-[#180f0a]' : 'bg-[#e5e2dd]'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition duration-200 ease-in-out mt-1 ${
                        preferences.showSkeletons ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Confirm Destructive Actions */}
                <div className="flex items-center justify-between pt-4">
                  <div className="pr-4">
                    <label
                      htmlFor="toggle-destructive"
                      className="text-[14px] font-semibold text-[#180f0a] block cursor-pointer"
                    >
                      Confirm Destructive Actions
                    </label>
                    <p className="text-[13px] text-[#4e4540]">
                      Require modal dialog verification before batch deletion, archival, or stock removals.
                    </p>
                  </div>
                  <button
                    id="toggle-destructive"
                    type="button"
                    role="switch"
                    aria-checked={preferences.confirmDestructive}
                    onClick={() => handleToggle('confirmDestructive')}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${
                      preferences.confirmDestructive ? 'bg-[#180f0a]' : 'bg-[#e5e2dd]'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition duration-200 ease-in-out mt-1 ${
                        preferences.confirmDestructive ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* 2. Visual Presentation & Accessibility */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-[0_4px_20px_-2px_rgba(46,36,30,0.04)] border border-[#e5e2dd] space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-[#f0ede9]">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#964735] text-[20px]">palette</span>
                  <h2 className="font-serif text-2xl text-[#180f0a] font-medium">
                    Visual Presentation &amp; Accessibility
                  </h2>
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#80756f]">
                  Renderer
                </span>
              </div>

              <div className="space-y-6">
                {/* Theme Appearance */}
                <div className="space-y-2">
                  <label className="text-[14px] font-semibold text-[#180f0a] block">
                    Theme Appearance
                  </label>
                  <div className="grid grid-cols-3 gap-2 bg-[#f6f3ee] p-1.5 rounded-xl border border-[#e5e2dd]/60">
                    <button
                      type="button"
                      onClick={() => handleChange('themeAppearance', 'light')}
                      className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-[13px] font-semibold transition-all cursor-pointer ${
                        preferences.themeAppearance === 'light'
                          ? 'bg-white text-[#180f0a] shadow-xs'
                          : 'text-[#4e4540] hover:text-[#180f0a]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">light_mode</span>
                      <span>Light Mode</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleChange('themeAppearance', 'dark')}
                      className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-[13px] font-semibold transition-all cursor-pointer ${
                        preferences.themeAppearance === 'dark'
                          ? 'bg-white text-[#180f0a] shadow-xs'
                          : 'text-[#4e4540] hover:text-[#180f0a]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">dark_mode</span>
                      <span>Dark Mode</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleChange('themeAppearance', 'system')}
                      className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-[13px] font-semibold transition-all cursor-pointer ${
                        preferences.themeAppearance === 'system'
                          ? 'bg-white text-[#180f0a] shadow-xs'
                          : 'text-[#4e4540] hover:text-[#180f0a]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">settings_brightness</span>
                      <span>System</span>
                    </button>
                  </div>
                </div>

                {/* Motion & Transitions */}
                <div className="flex items-center justify-between pt-4 border-t border-[#f0ede9]">
                  <div className="pr-4">
                    <label
                      htmlFor="toggle-motion"
                      className="text-[14px] font-semibold text-[#180f0a] block cursor-pointer"
                    >
                      Motion &amp; Transitions
                    </label>
                    <p className="text-[13px] text-[#4e4540]">
                      Enable smooth drawer easing while respecting hardware reduced-motion flags.
                    </p>
                  </div>
                  <button
                    id="toggle-motion"
                    type="button"
                    role="switch"
                    aria-checked={preferences.motionTransitions}
                    onClick={() => handleToggle('motionTransitions')}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${
                      preferences.motionTransitions ? 'bg-[#180f0a]' : 'bg-[#e5e2dd]'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition duration-200 ease-in-out mt-1 ${
                        preferences.motionTransitions ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Information Density */}
                <div className="space-y-2 pt-4 border-t border-[#f0ede9]">
                  <div className="flex items-center justify-between">
                    <label className="text-[14px] font-semibold text-[#180f0a] block">
                      Information Density
                    </label>
                    <span className="text-[11px] font-bold text-[#80756f]">Viewport Baseline</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 bg-[#f6f3ee] p-1.5 rounded-xl border border-[#e5e2dd]/60">
                    <button
                      type="button"
                      onClick={() => handleChange('informationDensity', 'comfortable')}
                      className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-[13px] font-semibold transition-all cursor-pointer ${
                        preferences.informationDensity === 'comfortable'
                          ? 'bg-white text-[#180f0a] shadow-xs'
                          : 'text-[#4e4540] hover:text-[#180f0a]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">view_agenda</span>
                      <span>Comfortable (Recommended)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleChange('informationDensity', 'compact')}
                      className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-[13px] font-semibold transition-all cursor-pointer ${
                        preferences.informationDensity === 'compact'
                          ? 'bg-white text-[#180f0a] shadow-xs'
                          : 'text-[#4e4540] hover:text-[#180f0a]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">density_small</span>
                      <span>Compact</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (Complementary, 5 cols) */}
          <div className="lg:col-span-5 space-y-8">
            {/* 3. Default Operational Viewports */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-[0_4px_20px_-2px_rgba(46,36,30,0.04)] border border-[#e5e2dd] space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-[#f0ede9]">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#964735] text-[20px]">view_quilt</span>
                  <h2 className="font-serif text-2xl text-[#180f0a] font-medium">
                    Default Operational Viewports
                  </h2>
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#80756f]">
                  Routing
                </span>
              </div>

              <div className="space-y-4">
                {/* Default Dashboard Date Range */}
                <div className="space-y-1">
                  <label
                    htmlFor="select-date-range"
                    className="text-[13px] font-semibold text-[#180f0a] block"
                  >
                    Default Dashboard Date Range
                  </label>
                  <div className="relative">
                    <select
                      id="select-date-range"
                      value={preferences.defaultDateRange}
                      onChange={(e) => handleChange('defaultDateRange', e.target.value)}
                      className="w-full appearance-none bg-[#f6f3ee] py-2.5 pl-3 pr-10 rounded-xl text-[13px] text-[#1c1c19] focus:outline-none focus:bg-white border border-transparent focus:border-[#180f0a] cursor-pointer transition-all"
                    >
                      <option value="7d">Last 7 Days</option>
                      <option value="30d">Last 30 Days</option>
                      <option value="90d">Last 90 Days</option>
                      <option value="1y">This Year</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#80756f] pointer-events-none text-[18px]">
                      expand_more
                    </span>
                  </div>
                </div>

                {/* Default Orders Tab */}
                <div className="space-y-1">
                  <label
                    htmlFor="select-orders-tab"
                    className="text-[13px] font-semibold text-[#180f0a] block"
                  >
                    Default Orders Tab
                  </label>
                  <div className="relative">
                    <select
                      id="select-orders-tab"
                      value={preferences.defaultOrdersTab}
                      onChange={(e) => handleChange('defaultOrdersTab', e.target.value)}
                      className="w-full appearance-none bg-[#f6f3ee] py-2.5 pl-3 pr-10 rounded-xl text-[13px] text-[#1c1c19] focus:outline-none focus:bg-white border border-transparent focus:border-[#180f0a] cursor-pointer transition-all"
                    >
                      <option value="all">All Orders</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="production">In Production</option>
                      <option value="dispatch">Ready to Dispatch</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#80756f] pointer-events-none text-[18px]">
                      expand_more
                    </span>
                  </div>
                </div>

                {/* Default Inventory Filter */}
                <div className="space-y-1">
                  <label
                    htmlFor="select-inventory-filter"
                    className="text-[13px] font-semibold text-[#180f0a] block"
                  >
                    Default Inventory Filter
                  </label>
                  <div className="relative">
                    <select
                      id="select-inventory-filter"
                      value={preferences.defaultInventoryFilter}
                      onChange={(e) => handleChange('defaultInventoryFilter', e.target.value)}
                      className="w-full appearance-none bg-[#f6f3ee] py-2.5 pl-3 pr-10 rounded-xl text-[13px] text-[#1c1c19] focus:outline-none focus:bg-white border border-transparent focus:border-[#180f0a] cursor-pointer transition-all"
                    >
                      <option value="all">All Items</option>
                      <option value="in_stock">In Stock</option>
                      <option value="low_stock">Low Stock</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#80756f] pointer-events-none text-[18px]">
                      expand_more
                    </span>
                  </div>
                </div>

                {/* Default Analytics Granularity */}
                <div className="space-y-1">
                  <label
                    htmlFor="select-analytics-granularity"
                    className="text-[13px] font-semibold text-[#180f0a] block"
                  >
                    Default Analytics Granularity
                  </label>
                  <div className="relative">
                    <select
                      id="select-analytics-granularity"
                      value={preferences.defaultAnalyticsGranularity}
                      onChange={(e) => handleChange('defaultAnalyticsGranularity', e.target.value)}
                      className="w-full appearance-none bg-[#f6f3ee] py-2.5 pl-3 pr-10 rounded-xl text-[13px] text-[#1c1c19] focus:outline-none focus:bg-white border border-transparent focus:border-[#180f0a] cursor-pointer transition-all"
                    >
                      <option value="daily">Daily Breakdown</option>
                      <option value="weekly">Weekly Aggregation</option>
                      <option value="monthly">Monthly Overview</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#80756f] pointer-events-none text-[18px]">
                      expand_more
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Sample Data & Governance */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-[0_4px_20px_-2px_rgba(46,36,30,0.04)] border border-[#e5e2dd] space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-[#f0ede9]">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#964735] text-[20px]">shield</span>
                  <h2 className="font-serif text-2xl text-[#180f0a] font-medium">
                    Sample Data &amp; Governance
                  </h2>
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#80756f]">
                  Audit
                </span>
              </div>

              <div className="space-y-4 divide-y divide-[#f0ede9]">
                {/* Environment Badges (Mandatory) */}
                <div className="flex items-center justify-between pt-2">
                  <div className="pr-4">
                    <span className="text-[14px] font-semibold text-[#180f0a] block">
                      Environment Badges
                    </span>
                    <span className="text-[13px] text-[#80756f]">
                      Mandatory across all portal screens
                    </span>
                  </div>
                  <button
                    type="button"
                    disabled
                    className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-not-allowed rounded-full bg-[#180f0a] opacity-60"
                  >
                    <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white shadow-xs mt-1" />
                  </button>
                </div>

                {/* Confirm Data Changes */}
                <div className="flex items-center justify-between pt-4">
                  <div className="pr-4">
                    <label
                      htmlFor="toggle-confirm-changes"
                      className="text-[14px] font-semibold text-[#180f0a] block cursor-pointer"
                    >
                      Confirm Data Changes
                    </label>
                    <span className="text-[13px] text-[#4e4540]">
                      Prompt before updating demonstration records
                    </span>
                  </div>
                  <button
                    id="toggle-confirm-changes"
                    type="button"
                    role="switch"
                    aria-checked={preferences.confirmDataChanges}
                    onClick={() => handleToggle('confirmDataChanges')}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${
                      preferences.confirmDataChanges ? 'bg-[#180f0a]' : 'bg-[#e5e2dd]'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition duration-200 ease-in-out mt-1 ${
                        preferences.confirmDataChanges ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Activity Log Feedback */}
                <div className="flex items-center justify-between pt-4">
                  <div className="pr-4">
                    <label
                      htmlFor="toggle-ledger-toast"
                      className="text-[14px] font-semibold text-[#180f0a] block cursor-pointer"
                    >
                      Activity Log Feedback
                    </label>
                    <span className="text-[13px] text-[#4e4540]">
                      Display instant toast notice on ledger edits
                    </span>
                  </div>
                  <button
                    id="toggle-ledger-toast"
                    type="button"
                    role="switch"
                    aria-checked={preferences.activityLogFeedback}
                    onClick={() => handleToggle('activityLogFeedback')}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${
                      preferences.activityLogFeedback ? 'bg-[#180f0a]' : 'bg-[#e5e2dd]'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition duration-200 ease-in-out mt-1 ${
                        preferences.activityLogFeedback ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Informational Card */}
            <div className="p-4 rounded-2xl bg-[#f6f3ee] flex items-start gap-3 shadow-xs border border-[#e5e2dd]">
              <span className="material-symbols-outlined text-[#964735] text-[20px] shrink-0 mt-0.5">
                info
              </span>
              <div className="space-y-1">
                <h3 className="text-[13px] font-semibold text-[#180f0a]">Client-Side Persistence</h3>
                <p className="text-[13px] text-[#4e4540]">
                  Preferences configured here apply to the sample environment demonstration. Resetting defaults will revert views to standard defaults.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Bottom Save Action Bar */}
        <div className="sticky bottom-4 z-20 w-full p-3.5 bg-white/95 backdrop-blur-md rounded-2xl shadow-[0_12px_32px_-4px_rgba(46,36,30,0.1)] border border-[#e5e2dd] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#1d2918]"></span>
            <span className="text-[13px] text-[#4e4540]">
              Sample configuration • Prototype demonstration
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 rounded-full text-[13px] font-semibold text-[#4e4540] hover:text-[#180f0a] hover:bg-[#f6f3ee] transition-all"
            >
              Reset to System Defaults
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saveStatus === 'saving'}
              className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-[#180f0a] text-white text-[13px] font-semibold shadow-xs hover:bg-[#2e241e] transition-all disabled:opacity-60 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">
                {saveStatus === 'saved' ? 'done_all' : 'save'}
              </span>
              <span>{saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved!' : 'Save Preferences'}</span>
            </button>
          </div>
        </div>

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
