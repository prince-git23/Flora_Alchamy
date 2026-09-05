import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

export default function AdminSettingsTabs({ activeTab }) {
  const [notice, setNotice] = useState(null);

  const tabs = [
    { id: 'general', label: 'General Settings', to: '/admin/settings' },
    { id: 'commerce', label: 'Order & Commerce', isFuture: true, phase: 'Phase 2B' },
    { id: 'access', label: 'Admin & Handler Access', to: '/admin/access' },
    { id: 'notifications', label: 'Notifications & Alerts', isFuture: true, phase: 'Phase 2B' },
    { id: 'preferences', label: 'Store Preferences', to: '/admin/store-preferences' },
  ];

  const handleFutureTab = (tab) => {
    setNotice(`${tab.label} settings will be operational in ${tab.phase}. Currently managing Phase 2A foundation modules.`);
    setTimeout(() => setNotice(null), 3500);
  };

  return (
    <div className="relative">
      <nav 
        aria-label="Settings Navigation"
        className="flex items-center gap-1 overflow-x-auto pb-1 border-b border-[#e5e2dd] scrollbar-none"
      >
        {tabs.map((tab) => {
          if (tab.isFuture) {
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleFutureTab(tab)}
                className="px-4 py-2 rounded-xl text-[13px] font-semibold tracking-[0.01em] text-[#4e4540] hover:bg-[#ebe8e3] hover:text-[#1c1c19] transition-all whitespace-nowrap cursor-pointer"
              >
                {tab.label}
              </button>
            );
          }

          const isActive = tab.id === activeTab;

          return (
            <NavLink
              key={tab.id}
              to={tab.to}
              className={`px-4 py-2 rounded-xl text-[13px] font-semibold tracking-[0.01em] whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-[#180f0a] text-white shadow-sm'
                  : 'text-[#4e4540] hover:bg-[#ebe8e3] hover:text-[#1c1c19]'
              }`}
            >
              {tab.label}
            </NavLink>
          );
        })}
      </nav>

      {notice && (
        <div className="absolute top-12 left-0 z-20 flex items-center gap-2 px-4 py-2 bg-[#2e241e] text-[#fcf9f4] rounded-xl text-[12px] shadow-lg border border-[#e5e2dd]/20 animate-fade-in">
          <span className="material-symbols-outlined text-[16px] text-[#ffdad3]">info</span>
          <span>{notice}</span>
        </div>
      )}
    </div>
  );
}
