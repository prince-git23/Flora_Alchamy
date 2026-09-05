import React, { useState } from 'react';
import { NavLink, useLocation, Link } from 'react-router-dom';

export default function AdminSidebar({ isOpen, onClose }) {
  const location = useLocation();
  const [futureModuleNotice, setFutureModuleNotice] = useState(null);

  const handleFutureModuleClick = (e, name) => {
    e.preventDefault();
    setFutureModuleNotice(`${name} workspace will be enabled in Phase 2B. Phase 2A operational foundation active.`);
    setTimeout(() => {
      setFutureModuleNotice(null);
    }, 3500);
  };

  const navGroups = [
    {
      group: 'OVERVIEW',
      items: [
        {
          name: 'Dashboard',
          path: '/admin/dashboard',
          aliases: ['/admin'],
          icon: 'dashboard',
          implemented: true
        }
      ]
    },
    {
      group: 'COMMERCE',
      items: [
        {
          name: 'Orders',
          path: '/admin/orders',
          icon: 'shopping_bag',
          badge: '8',
          implemented: false
        },
        {
          name: 'Products',
          path: '/admin/products',
          icon: 'inventory_2',
          implemented: false
        },
        {
          name: 'Collections',
          path: '/admin/collections',
          icon: 'auto_stories',
          implemented: false
        }
      ]
    },
    {
      group: 'OPERATIONS',
      items: [
        {
          name: 'Inventory',
          path: '/admin/inventory',
          icon: 'warehouse',
          indicator: 'Low',
          implemented: false
        },
        {
          name: 'Customers',
          path: '/admin/customers',
          icon: 'group',
          implemented: false
        }
      ]
    },
    {
      group: 'INSIGHTS',
      items: [
        {
          name: 'Analytics',
          path: '/admin/analytics',
          icon: 'analytics',
          implemented: false
        }
      ]
    },
    {
      group: 'SYSTEM',
      items: [
        {
          name: 'Settings',
          path: '/admin/settings',
          aliases: ['/admin/store-preferences'],
          icon: 'settings',
          implemented: true
        },
        {
          name: 'Access',
          path: '/admin/access',
          icon: 'shield_person',
          implemented: true
        }
      ]
    }
  ];

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between bg-[#f6f3ee] border-r border-[#e5e2dd] select-none">
      <div className="flex flex-col flex-1 min-h-0">
        {/* Brand Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-[#e5e2dd]/70 bg-[#f6f3ee]">
          <Link to="/admin/dashboard" className="flex items-center gap-2.5">
            {/* Custom Botanical Emblem */}
            <div className="w-8 h-8 rounded-full bg-[#180f0a] flex items-center justify-center text-white shadow-sm shrink-0">
              <span className="material-symbols-outlined text-[19px] text-[#ffdad3]">local_florist</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-serif text-[18px] text-[#180f0a] font-medium leading-none tracking-tight">
                Flora Alchemy
              </span>
              <span className="text-[9px] uppercase tracking-widest text-[#964735] font-bold mt-1">
                Handler Portal
              </span>
            </div>
          </Link>

          {/* Close button on mobile */}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="md:hidden p-1.5 rounded-lg text-[#4e4540] hover:bg-[#ebe8e3] transition-colors"
              aria-label="Close Sidebar"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          )}
        </div>

        {/* Grouped Navigation */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
          {navGroups.map((group) => (
            <div key={group.group} className="space-y-1">
              <p className="px-2 text-[10px] font-bold uppercase tracking-wider text-[#80756f]">
                {group.group}
              </p>
              <nav className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive =
                    location.pathname === item.path ||
                    (item.aliases && item.aliases.includes(location.pathname));

                  if (item.implemented) {
                    return (
                      <NavLink
                        key={item.name}
                        to={item.path}
                        onClick={onClose}
                        className={`flex items-center justify-between px-2.5 py-2 rounded-xl text-[13px] font-medium transition-all ${
                          isActive
                            ? 'bg-[#180f0a] text-white font-semibold shadow-sm'
                            : 'text-[#4e4540] hover:bg-[#ebe8e3] hover:text-[#1c1c19]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span
                            className={`material-symbols-outlined text-[19px] ${
                              isActive ? 'text-white' : 'text-[#80756f]'
                            }`}
                          >
                            {item.icon}
                          </span>
                          <span>{item.name}</span>
                        </div>
                        {isActive && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#ffdad3]"></span>
                        )}
                      </NavLink>
                    );
                  }

                  return (
                    <a
                      key={item.name}
                      href={item.path}
                      onClick={(e) => handleFutureModuleClick(e, item.name)}
                      className="flex items-center justify-between px-2.5 py-2 rounded-xl text-[13px] font-medium text-[#4e4540] hover:bg-[#ebe8e3] hover:text-[#1c1c19] transition-all cursor-pointer group"
                      title={`${item.name} (Scheduled for Phase 2B)`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="material-symbols-outlined text-[19px] text-[#80756f] group-hover:text-[#1c1c19]">
                          {item.icon}
                        </span>
                        <span>{item.name}</span>
                      </div>
                      {item.badge && (
                        <span className="px-2 py-0.5 bg-[#ffdad3] text-[#783020] text-[10px] font-bold rounded-full">
                          {item.badge}
                        </span>
                      )}
                      {item.indicator && (
                        <span className="flex items-center gap-1 text-[10px] font-semibold text-[#ba1a1a]">
                          <span className="w-2 h-2 rounded-full bg-[#ba1a1a] animate-pulse"></span>
                          {item.indicator}
                        </span>
                      )}
                    </a>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>
      </div>

      {/* Notice tooltip */}
      {futureModuleNotice && (
        <div className="mx-3 mb-2 p-2.5 bg-[#2e241e] text-[#fcf9f4] rounded-xl text-[11px] leading-snug shadow-md border border-[#ffdad3]/20 flex items-start gap-2">
          <span className="material-symbols-outlined text-[16px] text-[#ffdad3] shrink-0 mt-0.5">schedule</span>
          <div>
            <p className="font-semibold text-[#ffdad3]">Scheduled Phase</p>
            <p className="text-[11px] text-[#fcf9f4]/80">{futureModuleNotice}</p>
          </div>
        </div>
      )}

      {/* Bottom Actions */}
      <div className="p-3 border-t border-[#e5e2dd] space-y-1 bg-[#f6f3ee]">
        <Link
          to="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between px-2.5 py-2 rounded-xl text-[13px] font-medium text-[#4e4540] hover:bg-[#ebe8e3] hover:text-[#1c1c19] transition-all"
        >
          <span className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[18px]">storefront</span>
            <span>View Store</span>
          </span>
          <span className="material-symbols-outlined text-[16px] text-[#80756f]">open_in_new</span>
        </Link>
        <Link
          to="/login"
          className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-[13px] font-medium text-[#4e4540] hover:text-[#ba1a1a] hover:bg-[#ffdad6]/40 transition-all"
        >
          <span className="material-symbols-outlined text-[18px]">logout</span>
          <span>Sign Out</span>
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:flex flex-col fixed left-0 top-0 h-full w-[260px] z-30 shadow-[0_1px_8px_rgba(46,36,30,0.04)]">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Navigation */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={onClose}
          />
          {/* Drawer */}
          <div className="relative w-[280px] max-w-[85vw] h-full shadow-2xl z-10 animate-slide-in">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
