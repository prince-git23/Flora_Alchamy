import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';

export default function AdminHeader({ onOpenMobileMenu }) {
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Derive breadcrumbs based on pathname
  const getBreadcrumbs = () => {
    const path = location.pathname;
    if (path === '/admin' || path === '/admin/dashboard') {
      return { section: 'Console', current: 'Dashboard' };
    }
    if (path === '/admin/access') {
      return { section: 'System', subsection: 'Settings', current: 'Admin & Handler Access' };
    }
    if (path === '/admin/store-preferences') {
      return { section: 'System', subsection: 'Settings', current: 'Store Preferences' };
    }
    if (path === '/admin/settings') {
      return { section: 'System', subsection: 'Settings', current: 'General Settings' };
    }
    return { section: 'Console', current: 'Operations' };
  };

  const breadcrumbs = getBreadcrumbs();

  const notifications = [
    {
      id: 1,
      title: 'Order FA-1048 ready for hand-assembly',
      time: '10 mins ago',
      type: 'order',
      unread: true
    },
    {
      id: 2,
      title: 'Critical stock: Dusty Rose Velvet Ribbon (2 spools)',
      time: '45 mins ago',
      type: 'alert',
      unread: true
    },
    {
      id: 3,
      title: 'Priya Sharma updated regional delivery schedules',
      time: '2 hours ago',
      type: 'audit',
      unread: false
    }
  ];

  return (
    <header className="sticky top-0 z-20 h-16 bg-[#fcf9f4]/90 backdrop-blur-xl border-b border-[#e5e2dd] px-4 md:px-8 flex items-center justify-between gap-4 select-none">
      {/* Left Area: Mobile Menu button & Breadcrumbs */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 rounded-xl text-[#4e4540] hover:bg-[#ebe8e3] transition-colors"
          aria-label="Open navigation menu"
        >
          <span className="material-symbols-outlined text-[22px]">menu</span>
        </button>

        <div className="flex items-center gap-1.5 text-[13px] text-[#4e4540] truncate">
          <span className="text-[#80756f]">{breadcrumbs.section}</span>
          <span className="text-[#d1c4bd]">/</span>
          {breadcrumbs.subsection && (
            <>
              <span className="text-[#80756f]">{breadcrumbs.subsection}</span>
              <span className="text-[#d1c4bd]">/</span>
            </>
          )}
          <span className="text-[#180f0a] font-semibold truncate">{breadcrumbs.current}</span>
        </div>

        {/* Sample Data Environment badge */}
        <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#ffdad3] text-[#783020] text-[10px] font-bold tracking-wider shrink-0 shadow-xs">
          <span className="h-1.5 w-1.5 rounded-full bg-[#964735] animate-pulse"></span>
          Sample Data Environment
        </span>
      </div>

      {/* Right Area: Search, Notifications, Profile */}
      <div className="flex items-center gap-3 md:gap-4 shrink-0">
        {/* Global Search Bar */}
        <div className="relative hidden sm:flex items-center">
          <span className="material-symbols-outlined absolute left-3 text-[18px] text-[#80756f] pointer-events-none">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search orders, products, inventory... ⌘K"
            className="pl-9 pr-10 py-1.5 w-60 lg:w-72 bg-[#f6f3ee] text-[#1c1c19] text-[13px] rounded-full placeholder:text-[#80756f] focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#180f0a] transition-all border border-transparent focus:border-[#e5e2dd]"
          />
          <kbd className="absolute right-2.5 text-[10px] bg-[#e5e2dd] text-[#4e4540] px-1.5 py-0.5 rounded font-mono font-medium">
            ⌘K
          </kbd>
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-full text-[#4e4540] hover:bg-[#f0ede9] hover:text-[#180f0a] transition-colors"
            aria-label="Toggle notifications"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#964735]"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-[#e5e2dd] p-3 z-50 animate-fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-[#f0ede9]">
                <span className="text-[13px] font-semibold text-[#180f0a]">Handler Activity Stream</span>
                <span className="text-[10px] uppercase font-bold text-[#964735] bg-[#ffdad3] px-2 py-0.5 rounded-full">
                  2 New
                </span>
              </div>
              <div className="divide-y divide-[#f6f3ee] max-h-64 overflow-y-auto">
                {notifications.map((item) => (
                  <div key={item.id} className="py-2.5 px-1 flex items-start gap-2.5 hover:bg-[#fcf9f4] transition-colors rounded-lg">
                    <span className="material-symbols-outlined text-[18px] text-[#964735] mt-0.5">
                      {item.type === 'alert' ? 'warning' : item.type === 'order' ? 'local_florist' : 'verified_user'}
                    </span>
                    <div className="flex-1 text-[12px]">
                      <p className="text-[#1c1c19] font-medium leading-snug">{item.title}</p>
                      <p className="text-[11px] text-[#80756f] mt-0.5">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-2 border-t border-[#f0ede9] text-center">
                <button
                  type="button"
                  onClick={() => setShowNotifications(false)}
                  className="text-[11px] text-[#964735] font-semibold hover:underline"
                >
                  Mark all as reviewed
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Separator */}
        <div className="h-6 w-px bg-[#e5e2dd] hidden sm:block"></div>

        {/* Handler Admin Profile */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 p-1 rounded-full hover:bg-[#f0ede9] transition-colors cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-[#180f0a] text-white flex items-center justify-center font-semibold text-[13px] shadow-sm">
              HA
            </div>
            <div className="hidden lg:flex flex-col text-left leading-tight pr-1">
              <span className="text-[13px] font-semibold text-[#180f0a]">Handler Admin</span>
              <span className="text-[10px] text-[#80756f]">Administrator</span>
            </div>
            <span className="material-symbols-outlined text-[18px] text-[#80756f]">
              {showProfileMenu ? 'expand_less' : 'expand_more'}
            </span>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-[#e5e2dd] p-2 z-50 animate-fade-in text-[13px]">
              <div className="px-3 py-2 border-b border-[#f0ede9]">
                <p className="font-semibold text-[#180f0a]">Handler Admin</p>
                <p className="text-[11px] text-[#80756f] font-mono">handler.admin@flora-alchemy.demo</p>
              </div>
              <div className="py-1">
                <Link
                  to="/admin/access"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-[#4e4540] hover:bg-[#f6f3ee] hover:text-[#180f0a]"
                >
                  <span className="material-symbols-outlined text-[17px]">shield</span>
                  <span>Roles & Permissions</span>
                </Link>
                <Link
                  to="/admin/store-preferences"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-[#4e4540] hover:bg-[#f6f3ee] hover:text-[#180f0a]"
                >
                  <span className="material-symbols-outlined text-[17px]">tune</span>
                  <span>Display Preferences</span>
                </Link>
                <Link
                  to="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-[#4e4540] hover:bg-[#f6f3ee] hover:text-[#180f0a]"
                >
                  <span className="material-symbols-outlined text-[17px]">storefront</span>
                  <span>Open Public Store</span>
                </Link>
              </div>
              <div className="pt-1 border-t border-[#f0ede9]">
                <Link
                  to="/login"
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-[#ba1a1a] hover:bg-[#ffdad6]/40"
                >
                  <span className="material-symbols-outlined text-[17px]">logout</span>
                  <span>Sign Out Session</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
