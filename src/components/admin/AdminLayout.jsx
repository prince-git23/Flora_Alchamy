import React, { useState } from 'react';
import AdminSidebar from './AdminSidebar.jsx';
import AdminHeader from './AdminHeader.jsx';

export default function AdminLayout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#fcf9f4] text-[#1c1c19] flex flex-col">
      {/* Sidebar (Desktop Persistent + Mobile Drawer) */}
      <AdminSidebar
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      {/* Main Container pushed right by sidebar on desktop */}
      <div className="md:pl-[260px] flex-1 flex flex-col min-h-screen">
        {/* Top Header */}
        <AdminHeader onOpenMobileMenu={() => setMobileMenuOpen(true)} />

        {/* Scrollable Page Content */}
        <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>

        {/* Admin Operational Footer */}
        <footer className="w-full bg-[#f6f3ee] border-t border-[#e5e2dd] py-3 px-4 sm:px-8 mt-auto select-none">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-[#80756f] text-[12px]">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#964735]"></span>
              Flora Alchemy Handler Operations Portal • Sample Data Environment
            </span>
            <span>All prices settled in Indian Rupee (INR · ₹)</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
