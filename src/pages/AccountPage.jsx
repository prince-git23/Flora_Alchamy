import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Package, Heart, MapPin, Sparkles, Mail, Phone, Edit2, LogOut } from 'lucide-react';
import { getAccount, getOrders } from '../services/api.js';

export default function AccountPage() {
  const [account, setAccount] = useState(null);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('orders');

  useEffect(() => {
    async function load() {
      const [acc, ords] = await Promise.all([getAccount(), getOrders()]);
      setAccount(acc);
      setOrders(ords);
    }
    load();
  }, []);

  if (!account) {
    return (
      <div className="w-full min-h-[60vh] flex items-center justify-center bg-[#fcf9f4]">
        <p className="font-serif text-[20px] text-[#180f0a]">Opening Keepsake Vault...</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#fcf9f4] min-h-screen py-10 lg:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e5e2dd] shadow-sm mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#180f0a] text-white flex items-center justify-center font-serif text-[24px]">
              {account.name.charAt(0)}
            </div>
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#964735]">
                Customer Profile
              </span>
              <h1 className="font-serif text-[28px] text-[#180f0a] font-medium leading-tight">
                {account.name}
              </h1>
              <p className="text-[13px] text-[#80756f]">
                {account.email} · Guest / Demo Profile
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/shop"
              className="px-5 py-2 rounded-full bg-[#f6f3ee] text-[#180f0a] hover:bg-[#e5e2dd] text-[12px] font-semibold transition-colors"
            >
              Browse Catalog
            </Link>
            <Link
              to="/login"
              className="px-4 py-2 rounded-full border border-[#e5e2dd] text-[#80756f] hover:text-[#180f0a] text-[12px] flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </Link>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-4 border-b border-[#e5e2dd] pb-4 mb-8">
          {[
            { key: 'orders', label: 'Order History', count: orders.length },
            { key: 'notes', label: 'Saved Gift Notes & Wax Seals' },
            { key: 'address', label: 'Saved Address Book' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`text-[14px] font-serif transition-colors pb-2 relative ${
                activeTab === tab.key ? 'text-[#180f0a] font-semibold' : 'text-[#80756f] hover:text-[#180f0a]'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className="ml-1.5 px-2 py-0.5 rounded-full bg-[#f0ede9] text-[11px] font-sans font-bold">
                  {tab.count}
                </span>
              )}
              {activeTab === tab.key && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#964735] -mb-4 rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {orders.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 border border-[#e5e2dd] text-center space-y-3">
                <p className="font-serif text-[20px] text-[#180f0a]">No orders placed yet</p>
                <p className="text-[13px] text-[#80756f]">Your handcrafted floral orders will appear here once placed.</p>
                <div className="pt-2">
                  <Link to="/shop" className="inline-block px-6 py-2.5 rounded-full bg-[#180f0a] text-white text-[12px] font-semibold hover:bg-[#964735] transition-colors">
                    Explore Handcrafted Blooms
                  </Link>
                </div>
              </div>
            ) : (
              orders.map((ord) => (
                <div key={ord.orderId} className="bg-white rounded-3xl p-6 border border-[#e5e2dd] shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#e5e2dd] pb-4">
                    <div>
                      <span className="text-[12px] font-bold text-[#180f0a]">Order #{ord.orderId}</span>
                      <span className="text-[12px] text-[#80756f] ml-3">{ord.date}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 rounded-full bg-[#ffdad3] text-[#964735] text-[11px] font-bold uppercase">
                        {ord.status}
                      </span>
                      <Link
                        to={`/order-tracking/${ord.orderId}`}
                        className="text-[12px] font-bold text-[#180f0a] hover:text-[#964735] underline"
                      >
                        Track Dispatch →
                      </Link>
                    </div>
                  </div>

                  <div className="divide-y divide-[#e5e2dd] space-y-3">
                    {ord.items.map((item, idx) => (
                      <div key={idx} className="pt-3 first:pt-0 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img src={item.image} alt={item.name} className="w-14 h-14 rounded-xl object-cover border border-[#e5e2dd]" />
                          <div>
                            <p className="font-serif text-[15px] text-[#180f0a] font-medium">{item.name}</p>
                            <p className="text-[11px] text-[#80756f]">Qty: {item.quantity || 1}</p>
                          </div>
                        </div>
                        <span className="text-[14px] font-bold text-[#180f0a]">
                          ₹{(item.price * (item.quantity || 1)).toLocaleString('en-IN')}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-[#e5e2dd] pt-3 flex justify-between text-[14px]">
                    <span className="text-[#80756f]">Payment: {ord.paymentMethod}</span>
                    <span className="font-bold text-[#180f0a]">Total: ₹{ord.total.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Saved Notes Tab */}
        {activeTab === 'notes' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {account.savedNotes && account.savedNotes.map((note) => (
              <div key={note.id} className="bg-white rounded-3xl p-6 border border-[#e5e2dd] shadow-xs space-y-3 relative">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#964735]">
                    {note.occasion}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#f6f3ee] text-[10px] font-bold text-[#80756f]">
                    Seal: {note.waxSeal}
                  </span>
                </div>
                <p className="font-serif text-[18px] text-[#180f0a] italic leading-relaxed">
                  "{note.message}"
                </p>
                <div className="pt-2 border-t border-[#e5e2dd] text-[12px] text-[#80756f]">
                  Dedicated to: <span className="font-semibold text-[#180f0a]">{note.recipient}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Address Tab */}
        {activeTab === 'address' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e5e2dd] shadow-xs max-w-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#e5e2dd] pb-3">
              <h3 className="font-serif text-[20px] text-[#180f0a]">Default Delivery Address</h3>
              <span className="text-[11px] uppercase font-bold text-[#5b6d54] bg-[#d8e7cd] px-2.5 py-0.5 rounded-full">
                Saved Address
              </span>
            </div>
            <div className="space-y-1 text-[14px] text-[#4e4540]">
              <p className="font-bold text-[#180f0a]">{account.name}</p>
              <p>{account.address}</p>
              <p>{account.city}, {account.state} – {account.pincode}</p>
              <p className="pt-2 text-[13px] text-[#80756f]">Phone: {account.phone}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
