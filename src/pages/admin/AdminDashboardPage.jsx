import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout.jsx';

export default function AdminDashboardPage() {
  const [viewState, setViewState] = useState('live'); // 'live' | 'empty' | 'loading'
  const [revenuePeriod, setRevenuePeriod] = useState('7d'); // '7d' | '30d' | '3m'
  const [quickModal, setQuickModal] = useState(null); // for '+ Add Product' / '+ Create Order'
  const [orderFilterStage, setOrderFilterStage] = useState(null);

  // Crafting tasks interactive state
  const [craftingTasks, setCraftingTasks] = useState([
    {
      id: 'FA-1048',
      title: 'FA-1048 · 5-Stem Rose Bouquet',
      priority: 'High Priority',
      priorityColor: 'bg-[#964735]/15 text-[#964735]',
      palette: 'Dusty Rose · Ivory Wrap',
      transcript: '“Happy Birthday, dear Aisha!”',
      due: 'Today · 5:00 PM',
      actionText: 'Mark as Ready',
      status: 'pending'
    },
    {
      id: 'FA-1047',
      title: 'FA-1047 · Custom Gift Posy',
      priority: 'Normal',
      priorityColor: 'bg-[#ebe8e3] text-[#4e4540]',
      palette: 'Lavender · Sage Cotton',
      transcript: '“With love and gratitude”',
      due: 'Today · 6:00 PM',
      actionText: 'Review & Pack',
      status: 'pending'
    },
    {
      id: 'FA-1045',
      title: 'FA-1045 · Sculpted Lily Posy',
      priority: 'Scheduled',
      priorityColor: 'bg-[#ebe8e3] text-[#4e4540]',
      palette: 'Muted Gold · Cream Stems',
      transcript: null,
      due: 'Tomorrow · 11:00 AM',
      actionText: 'Start Crafting',
      status: 'pending'
    }
  ]);

  const handleTaskAction = (taskId) => {
    setCraftingTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          return {
            ...t,
            actionText: 'Completed',
            status: 'completed'
          };
        }
        return t;
      })
    );
  };

  const revenueDataByPeriod = {
    '7d': {
      total: '₹84,620',
      avg: 'Avg order: ₹1,410',
      bars: [
        { label: 'Mon', height: '48%', val: '₹8.8k' },
        { label: 'Tue', height: '64%', val: '₹11.8k' },
        { label: 'Wed', height: '52%', val: '₹9.6k' },
        { label: 'Thu', height: '75%', val: '₹13.8k' },
        { label: 'Fri', height: '85%', val: '₹15.7k' },
        { label: 'Sat', height: '94%', val: '₹17.3k', isSpecial: true },
        { label: 'Sun', height: '70%', val: '₹18.4k', isCurrent: true }
      ]
    },
    '30d': {
      total: '₹3,48,500',
      avg: 'Avg order: ₹1,460',
      bars: [
        { label: 'Wk 1', height: '60%', val: '₹72k' },
        { label: 'Wk 2', height: '78%', val: '₹94k' },
        { label: 'Wk 3', height: '82%', val: '₹98k' },
        { label: 'Wk 4', height: '71%', val: '₹84.5k', isCurrent: true }
      ]
    },
    '3m': {
      total: '₹9,82,000',
      avg: 'Avg order: ₹1,490',
      bars: [
        { label: 'Month 1', height: '65%', val: '₹2.9L' },
        { label: 'Month 2', height: '80%', val: '₹3.4L' },
        { label: 'Month 3', height: '85%', val: '₹3.5L', isCurrent: true }
      ]
    }
  };

  const recentOrders = [
    {
      id: 'FA-1048',
      customer: 'Aarav',
      items: 'Rose Bouquet + Card',
      amount: '₹899',
      status: 'In Production',
      statusStyle: 'bg-[#ffdad3] text-[#783020]',
      date: 'Today, 11:30 AM'
    },
    {
      id: 'FA-1047',
      customer: 'Ananya',
      items: 'Custom Gift Box',
      amount: '₹1,499',
      status: 'Ready to Dispatch',
      statusStyle: 'bg-[#d8e7cd] text-[#3d4a37]',
      date: 'Today, 09:15 AM'
    },
    {
      id: 'FA-1046',
      customer: 'Riya',
      items: 'Tulip Bouquet',
      amount: '₹599',
      status: 'Confirmed',
      statusStyle: 'bg-[#f1dfd5] text-[#50443d]',
      date: 'Yesterday'
    },
    {
      id: 'FA-1045',
      customer: 'Kabir',
      items: '5-Stem Lily Bouquet',
      amount: '₹1,099',
      status: 'Quality Check',
      statusStyle: 'bg-[#ebe8e3] text-[#180f0a]',
      date: 'Yesterday'
    },
    {
      id: 'FA-1044',
      customer: 'Meera',
      items: 'Custom Keepsake',
      amount: '₹1,799',
      status: 'Shipped',
      statusStyle: 'bg-[#e5e2dd] text-[#4e4540]',
      date: '2 days ago'
    }
  ];

  const currentRevenue = revenueDataByPeriod[revenuePeriod];

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-8 pb-12">
        {/* Welcome & Action Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#180f0a] tracking-tight font-normal">
              Good morning, Flora Alchemy
            </h1>
            <p className="text-[15px] text-[#4e4540] mt-1">
              Here’s what needs your attention today.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Prototype View Switcher */}
            <div className="flex items-center p-1 rounded-full bg-[#ebe8e3] text-[12px]">
              <button
                type="button"
                onClick={() => setViewState('live')}
                className={`px-3 py-1 rounded-full font-semibold transition-all ${
                  viewState === 'live'
                    ? 'bg-white shadow-xs text-[#180f0a]'
                    : 'text-[#4e4540] hover:text-[#180f0a]'
                }`}
              >
                Active Live View
              </button>
              <button
                type="button"
                onClick={() => setViewState('empty')}
                className={`px-3 py-1 rounded-full font-semibold transition-all ${
                  viewState === 'empty'
                    ? 'bg-white shadow-xs text-[#180f0a]'
                    : 'text-[#4e4540] hover:text-[#180f0a]'
                }`}
              >
                Empty State
              </button>
              <button
                type="button"
                onClick={() => setViewState('loading')}
                className={`px-3 py-1 rounded-full font-semibold transition-all ${
                  viewState === 'loading'
                    ? 'bg-white shadow-xs text-[#180f0a]'
                    : 'text-[#4e4540] hover:text-[#180f0a]'
                }`}
              >
                Loading Skeleton
              </button>
            </div>

            {/* Quick Action Buttons */}
            <button
              type="button"
              onClick={() => setQuickModal({ title: 'Add Product', desc: 'Product creation wizard is pre-configured with botanical attributes for Phase 2B catalog uploads.' })}
              className="px-4 py-2 rounded-full border border-[#d1c4bd] bg-white text-[#180f0a] hover:bg-[#f6f3ee] text-[13px] font-semibold shadow-xs transition-all flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[17px]">add</span>
              <span>+ Add Product</span>
            </button>

            <button
              type="button"
              onClick={() => setQuickModal({ title: 'Create Order', desc: 'Manual order creation intake is seeded for immediate handler dispatch testing.' })}
              className="px-5 py-2 rounded-full bg-[#180f0a] text-white hover:bg-[#964735] text-[13px] font-semibold shadow-xs transition-all flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[17px]">add_circle</span>
              <span>+ Create Order</span>
            </button>
          </div>
        </div>

        {/* LOADING SKELETON STATE */}
        {viewState === 'loading' && (
          <div className="space-y-8 animate-pulse">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-28 bg-[#ebe8e3] rounded-2xl"></div>
              ))}
            </div>
            <div className="h-44 bg-[#ebe8e3] rounded-2xl"></div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-7 h-96 bg-[#ebe8e3] rounded-2xl"></div>
              <div className="lg:col-span-5 h-96 bg-[#ebe8e3] rounded-2xl"></div>
            </div>
          </div>
        )}

        {/* EMPTY STATE */}
        {viewState === 'empty' && (
          <div className="p-12 sm:p-16 bg-white rounded-2xl text-center space-y-4 shadow-sm border border-[#e5e2dd]">
            <div className="w-16 h-16 rounded-full bg-[#f6f3ee] mx-auto flex items-center justify-center text-[#80756f]">
              <span className="material-symbols-outlined text-[32px]">inventory_2</span>
            </div>
            <div className="max-w-md mx-auto">
              <h3 className="font-serif text-2xl text-[#180f0a] font-medium">
                No Orders Requiring Crafting
              </h3>
              <p className="text-[14px] text-[#4e4540] mt-1.5">
                All botanical stems, paper enclosures, and wax-sealed keepsakes have been fulfilled or dispatched.
              </p>
            </div>
            <div className="pt-2 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() => setViewState('live')}
                className="px-5 py-2 rounded-full bg-[#180f0a] text-white text-[13px] font-semibold shadow-xs hover:bg-[#964735] transition-colors"
              >
                Return to Live Dashboard
              </button>
            </div>
          </div>
        )}

        {/* ACTIVE LIVE VIEW */}
        {viewState === 'live' && (
          <div className="space-y-8">
            {/* 5-Card KPI Metrics Row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {/* KPI 1 */}
              <div className="p-4 bg-white rounded-2xl shadow-[0_4px_20px_-2px_rgba(46,36,30,0.04)] border border-[#e5e2dd] flex flex-col justify-between">
                <div className="flex items-center justify-between text-[#80756f]">
                  <span className="text-[11px] font-bold uppercase tracking-wider">Today's Orders</span>
                  <span className="material-symbols-outlined text-[19px] text-[#5b6d54]">local_florist</span>
                </div>
                <div className="my-2">
                  <span className="font-serif text-3xl sm:text-4xl font-medium text-[#180f0a] leading-none">
                    12
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[12px] text-[#1d2918] font-medium">
                  <span className="material-symbols-outlined text-[15px]">trending_up</span>
                  <span>+3 from yesterday</span>
                </div>
              </div>

              {/* KPI 2 */}
              <div className="p-4 bg-white rounded-2xl shadow-[0_4px_20px_-2px_rgba(46,36,30,0.04)] border border-[#e5e2dd] flex flex-col justify-between">
                <div className="flex items-center justify-between text-[#80756f]">
                  <span className="text-[11px] font-bold uppercase tracking-wider">Pending Orders</span>
                  <span className="material-symbols-outlined text-[19px] text-[#964735]">pending_actions</span>
                </div>
                <div className="my-2">
                  <span className="font-serif text-3xl sm:text-4xl font-medium text-[#180f0a] leading-none">
                    8
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[12px] text-[#964735] font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#964735]"></span>
                  <span>Requires attention</span>
                </div>
              </div>

              {/* KPI 3 */}
              <div className="p-4 bg-white rounded-2xl shadow-[0_4px_20px_-2px_rgba(46,36,30,0.04)] border border-[#e5e2dd] flex flex-col justify-between">
                <div className="flex items-center justify-between text-[#80756f]">
                  <span className="text-[11px] font-bold uppercase tracking-wider">In Production</span>
                  <span className="material-symbols-outlined text-[19px] text-[#180f0a]">precision_manufacturing</span>
                </div>
                <div className="my-2">
                  <span className="font-serif text-3xl sm:text-4xl font-medium text-[#180f0a] leading-none">
                    5
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[12px] text-[#4e4540]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2e241e]"></span>
                  <span>Currently being crafted</span>
                </div>
              </div>

              {/* KPI 4 */}
              <div className="p-4 bg-white rounded-2xl shadow-[0_4px_20px_-2px_rgba(46,36,30,0.04)] border border-[#e5e2dd] flex flex-col justify-between">
                <div className="flex items-center justify-between text-[#80756f]">
                  <span className="text-[11px] font-bold uppercase tracking-wider">Ready to Dispatch</span>
                  <span className="material-symbols-outlined text-[19px] text-[#964735]">package_2</span>
                </div>
                <div className="my-2">
                  <span className="font-serif text-3xl sm:text-4xl font-medium text-[#180f0a] leading-none">
                    4
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[12px] text-[#964735] font-medium">
                  <span className="material-symbols-outlined text-[15px]">schedule</span>
                  <span>Awaiting handover</span>
                </div>
              </div>

              {/* KPI 5 */}
              <div className="p-4 bg-white rounded-2xl shadow-[0_4px_20px_-2px_rgba(46,36,30,0.04)] border border-[#e5e2dd] flex flex-col justify-between col-span-2 sm:col-span-1">
                <div className="flex items-center justify-between text-[#80756f]">
                  <span className="text-[11px] font-bold uppercase tracking-wider">Today's Revenue</span>
                  <span className="material-symbols-outlined text-[19px] text-[#5b6d54]">payments</span>
                </div>
                <div className="my-2">
                  <span className="font-serif text-3xl sm:text-4xl font-medium text-[#180f0a] leading-none">
                    ₹18,450
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[12px] text-[#1d2918] font-medium">
                  <span className="material-symbols-outlined text-[15px]">arrow_upward</span>
                  <span>+12.4% vs yesterday</span>
                </div>
              </div>
            </div>

            {/* Order Pipeline (Canonical Workflow) */}
            <div className="p-6 bg-white rounded-2xl shadow-[0_4px_20px_-2px_rgba(46,36,30,0.04)] border border-[#e5e2dd]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                <div>
                  <h2 className="font-serif text-xl sm:text-2xl text-[#180f0a] font-medium">
                    Order Pipeline
                  </h2>
                  <p className="text-[13px] text-[#4e4540]">
                    Track today’s orders through each operational stage.
                  </p>
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#80756f]">
                  39 Active Today
                </span>
              </div>

              {/* Workflow connecting track */}
              <div className="hidden lg:flex items-center px-2 mb-3">
                <div className="h-1.5 w-full bg-[#f0ede9] rounded-full overflow-hidden flex">
                  <div className="bg-[#e5e2dd] w-[14%]"></div>
                  <div className="bg-[#e5e2dd] w-[14%]"></div>
                  <div className="bg-[#180f0a] w-[14%]"></div>
                  <div className="bg-[#e5e2dd] w-[14%]"></div>
                  <div className="bg-[#e5e2dd] w-[14%]"></div>
                  <div className="bg-[#e5e2dd] w-[14%]"></div>
                  <div className="bg-[#e5e2dd] w-[16%]"></div>
                </div>
              </div>

              {/* Workflow Stages Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
                {/* Stage 1 */}
                <div
                  onClick={() => setOrderFilterStage(orderFilterStage === 1 ? null : 1)}
                  className={`p-3 rounded-xl transition-all cursor-pointer border ${
                    orderFilterStage === 1
                      ? 'bg-[#f0ede9] border-[#180f0a]'
                      : 'bg-[#f6f3ee] hover:bg-[#f0ede9] border-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase text-[#80756f]">Stage 01</span>
                    <span className="px-1.5 py-0.5 rounded-full bg-[#e5e2dd] text-[#180f0a] text-[10px] font-bold">
                      3
                    </span>
                  </div>
                  <div className="mt-3">
                    <span className="text-[13px] font-semibold text-[#180f0a] block">1. New</span>
                    <span className="text-[11px] text-[#80756f]">Payment confirmed</span>
                  </div>
                </div>

                {/* Stage 2 */}
                <div
                  onClick={() => setOrderFilterStage(orderFilterStage === 2 ? null : 2)}
                  className={`p-3 rounded-xl transition-all cursor-pointer border ${
                    orderFilterStage === 2
                      ? 'bg-[#f0ede9] border-[#180f0a]'
                      : 'bg-[#f6f3ee] hover:bg-[#f0ede9] border-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase text-[#80756f]">Stage 02</span>
                    <span className="px-1.5 py-0.5 rounded-full bg-[#e5e2dd] text-[#180f0a] text-[10px] font-bold">
                      5
                    </span>
                  </div>
                  <div className="mt-3">
                    <span className="text-[13px] font-semibold text-[#180f0a] block">2. Confirmed</span>
                    <span className="text-[11px] text-[#80756f]">Stem assigned</span>
                  </div>
                </div>

                {/* Stage 3 (Active Highlight) */}
                <div
                  onClick={() => setOrderFilterStage(orderFilterStage === 3 ? null : 3)}
                  className="p-3 rounded-xl bg-[#2e241e] text-white flex flex-col justify-between shadow-md cursor-pointer relative overflow-hidden ring-2 ring-[#964735]/60"
                >
                  <div className="absolute right-0 top-0 w-12 h-12 bg-[#964735]/25 rounded-full blur-md"></div>
                  <div className="flex items-center justify-between relative z-10">
                    <span className="text-[10px] font-bold uppercase text-[#ffdad3]">Active Work</span>
                    <span className="px-1.5 py-0.5 rounded-full bg-[#964735] text-white text-[10px] font-bold">
                      5
                    </span>
                  </div>
                  <div className="mt-3 relative z-10">
                    <span className="text-[13px] font-bold text-white block">3. In Production</span>
                    <span className="text-[11px] text-[#ffdad3]/80">Pipe-cleaner craft</span>
                  </div>
                </div>

                {/* Stage 4 */}
                <div
                  onClick={() => setOrderFilterStage(orderFilterStage === 4 ? null : 4)}
                  className={`p-3 rounded-xl transition-all cursor-pointer border ${
                    orderFilterStage === 4
                      ? 'bg-[#f0ede9] border-[#180f0a]'
                      : 'bg-[#f6f3ee] hover:bg-[#f0ede9] border-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase text-[#80756f]">Stage 04</span>
                    <span className="px-1.5 py-0.5 rounded-full bg-[#e5e2dd] text-[#180f0a] text-[10px] font-bold">
                      2
                    </span>
                  </div>
                  <div className="mt-3">
                    <span className="text-[13px] font-semibold text-[#180f0a] block">4. Quality Check</span>
                    <span className="text-[11px] text-[#80756f]">Petal inspection</span>
                  </div>
                </div>

                {/* Stage 5 */}
                <div
                  onClick={() => setOrderFilterStage(orderFilterStage === 5 ? null : 5)}
                  className={`p-3 rounded-xl transition-all cursor-pointer border ${
                    orderFilterStage === 5
                      ? 'bg-[#f0ede9] border-[#180f0a]'
                      : 'bg-[#f6f3ee] hover:bg-[#f0ede9] border-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase text-[#80756f]">Stage 05</span>
                    <span className="px-1.5 py-0.5 rounded-full bg-[#e5e2dd] text-[#180f0a] text-[10px] font-bold">
                      4
                    </span>
                  </div>
                  <div className="mt-3">
                    <span className="text-[13px] font-semibold text-[#180f0a] block">5. Ready to Dispatch</span>
                    <span className="text-[11px] text-[#80756f]">Wax seal & box</span>
                  </div>
                </div>

                {/* Stage 6 */}
                <div
                  onClick={() => setOrderFilterStage(orderFilterStage === 6 ? null : 6)}
                  className={`p-3 rounded-xl transition-all cursor-pointer border ${
                    orderFilterStage === 6
                      ? 'bg-[#f0ede9] border-[#180f0a]'
                      : 'bg-[#f6f3ee] hover:bg-[#f0ede9] border-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase text-[#80756f]">Stage 06</span>
                    <span className="px-1.5 py-0.5 rounded-full bg-[#e5e2dd] text-[#180f0a] text-[10px] font-bold">
                      7
                    </span>
                  </div>
                  <div className="mt-3">
                    <span className="text-[13px] font-semibold text-[#180f0a] block">6. Shipped</span>
                    <span className="text-[11px] text-[#80756f]">Handed to courier</span>
                  </div>
                </div>

                {/* Stage 7 */}
                <div
                  onClick={() => setOrderFilterStage(orderFilterStage === 7 ? null : 7)}
                  className={`p-3 rounded-xl transition-all cursor-pointer border ${
                    orderFilterStage === 7
                      ? 'bg-[#f0ede9] border-[#180f0a]'
                      : 'bg-[#f6f3ee] hover:bg-[#f0ede9] border-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase text-[#80756f]">Stage 07</span>
                    <span className="px-1.5 py-0.5 rounded-full bg-[#e5e2dd] text-[#180f0a] text-[10px] font-bold">
                      18
                    </span>
                  </div>
                  <div className="mt-3">
                    <span className="text-[13px] font-semibold text-[#180f0a] block">7. Delivered</span>
                    <span className="text-[11px] text-[#80756f]">Archived delivery</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Two-Column Operational Workspace (7 cols & 5 cols) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* LEFT COLUMN: Recent Orders & Revenue (7 cols) */}
              <div className="lg:col-span-7 space-y-8 min-w-0">
                {/* SECTION A: RECENT ORDERS TABLE */}
                <div className="bg-white rounded-2xl shadow-[0_4px_20px_-2px_rgba(46,36,30,0.04)] border border-[#e5e2dd] p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="font-serif text-xl text-[#180f0a] font-medium">
                        Recent Orders
                      </h2>
                      <p className="text-[13px] text-[#4e4540]">
                        Latest incoming client commissions and deliveries.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setQuickModal({ title: 'Full Orders Roster', desc: 'Orders management ledger with refund and delivery routing will unlock in Phase 2B.' })}
                      className="text-[#964735] hover:text-[#180f0a] text-[13px] font-semibold transition-colors flex items-center gap-1"
                    >
                      View All Orders
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-[13px] border-collapse">
                      <thead>
                        <tr className="text-[#80756f] text-[11px] font-bold uppercase tracking-wider border-b border-[#e5e2dd]">
                          <th className="py-2.5 px-2">Order ID</th>
                          <th className="py-2.5 px-2">Customer</th>
                          <th className="py-2.5 px-2">Items</th>
                          <th className="py-2.5 px-2 text-right">Amount</th>
                          <th className="py-2.5 px-2">Status</th>
                          <th className="py-2.5 px-2">Date</th>
                          <th className="py-2.5 px-2 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#f6f3ee] text-[#1c1c19]">
                        {recentOrders.map((order) => (
                          <tr key={order.id} className="hover:bg-[#f6f3ee]/50 transition-colors group">
                            <td className="py-3 px-2 font-semibold text-[#180f0a]">{order.id}</td>
                            <td className="py-3 px-2 font-medium">{order.customer}</td>
                            <td className="py-3 px-2 text-[#4e4540] truncate max-w-[130px]" title={order.items}>
                              {order.items}
                            </td>
                            <td className="py-3 px-2 font-semibold text-right text-[#180f0a]">{order.amount}</td>
                            <td className="py-3 px-2">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${order.statusStyle}`}>
                                {order.status}
                              </span>
                            </td>
                            <td className="py-3 px-2 text-[12px] text-[#80756f]">{order.date}</td>
                            <td className="py-3 px-2 text-center">
                              <button
                                type="button"
                                onClick={() => setQuickModal({ title: `Order ${order.id}`, desc: `Customer: ${order.customer} · Items: ${order.items} · Total: ${order.amount} · Status: ${order.status}` })}
                                className="p-1 rounded hover:bg-[#ebe8e3] text-[#80756f] group-hover:text-[#180f0a] transition-colors"
                                title="Manage Order"
                              >
                                <span className="material-symbols-outlined text-[18px]">more_horiz</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* SECTION B: REVENUE OVERVIEW (Chart Card) */}
                <div className="bg-white rounded-2xl shadow-[0_4px_20px_-2px_rgba(46,36,30,0.04)] border border-[#e5e2dd] p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                    <div>
                      <h2 className="font-serif text-xl text-[#180f0a] font-medium">
                        Revenue Overview
                      </h2>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="font-serif text-2xl sm:text-3xl text-[#180f0a] font-semibold leading-none">
                          {currentRevenue.total}
                        </span>
                        <span className="text-[13px] text-[#80756f]">{currentRevenue.avg}</span>
                      </div>
                    </div>

                    {/* Period Switcher Tabs */}
                    <div className="flex items-center p-0.5 rounded-full bg-[#f0ede9] self-start sm:self-auto">
                      <button
                        type="button"
                        onClick={() => setRevenuePeriod('7d')}
                        className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all ${
                          revenuePeriod === '7d'
                            ? 'bg-white text-[#180f0a] shadow-xs'
                            : 'text-[#4e4540] hover:text-[#180f0a]'
                        }`}
                      >
                        7 Days
                      </button>
                      <button
                        type="button"
                        onClick={() => setRevenuePeriod('30d')}
                        className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all ${
                          revenuePeriod === '30d'
                            ? 'bg-white text-[#180f0a] shadow-xs'
                            : 'text-[#4e4540] hover:text-[#180f0a]'
                        }`}
                      >
                        30 Days
                      </button>
                      <button
                        type="button"
                        onClick={() => setRevenuePeriod('3m')}
                        className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all ${
                          revenuePeriod === '3m'
                            ? 'bg-white text-[#180f0a] shadow-xs'
                            : 'text-[#4e4540] hover:text-[#180f0a]'
                        }`}
                      >
                        3 Months
                      </button>
                    </div>
                  </div>

                  {/* Visual Bar Chart */}
                  <div className="w-full pt-4">
                    <div className="h-44 w-full flex items-end justify-between gap-3 px-2 border-b border-[#f0ede9] pb-2">
                      {currentRevenue.bars.map((bar, idx) => (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group cursor-pointer">
                          <div
                            className={`w-full max-w-[38px] rounded-t transition-all relative ${
                              bar.isCurrent
                                ? 'bg-[#180f0a] shadow-md group-hover:bg-[#2e241e]'
                                : bar.isSpecial
                                ? 'bg-[#964735] shadow-xs group-hover:bg-[#783020]'
                                : 'bg-[#ebe8e3] group-hover:bg-[#d1c4bd]'
                            }`}
                            style={{ height: bar.height }}
                          >
                            {bar.isCurrent && (
                              <div className="absolute -top-7 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded bg-[#180f0a] text-white text-[9px] font-bold whitespace-nowrap shadow-sm">
                                {bar.val}
                              </div>
                            )}
                          </div>
                          <span
                            className={`text-[10px] font-bold ${
                              bar.isCurrent
                                ? 'text-[#180f0a]'
                                : bar.isSpecial
                                ? 'text-[#964735]'
                                : 'text-[#80756f]'
                            }`}
                          >
                            {bar.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: Tasks, Alerts & Shortcuts (5 cols) */}
              <div className="lg:col-span-5 space-y-8 min-w-0">
                {/* CARD 1: TODAY'S CRAFTING QUEUE */}
                <div className="bg-white rounded-2xl shadow-[0_4px_20px_-2px_rgba(46,36,30,0.04)] border border-[#e5e2dd] p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[20px] text-[#180f0a]">draw</span>
                      <h2 className="font-serif text-xl text-[#180f0a] font-medium">
                        Today’s Crafting Queue
                      </h2>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-[#ffdad3] text-[#783020] text-[10px] font-bold">
                      {craftingTasks.filter((t) => t.status === 'pending').length} pending
                    </span>
                  </div>

                  <div className="space-y-3">
                    {craftingTasks.map((task) => (
                      <div
                        key={task.id}
                        className={`p-3.5 rounded-xl border transition-all space-y-2 ${
                          task.status === 'completed'
                            ? 'bg-[#f6f3ee]/40 border-[#e5e2dd] opacity-70'
                            : 'bg-[#f6f3ee] hover:bg-[#f0ede9] border-[#e5e2dd]/60'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[12px] font-bold text-[#180f0a]">{task.title}</span>
                          <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold ${task.priorityColor}`}>
                            {task.priority}
                          </span>
                        </div>
                        <div className="text-[12px] text-[#4e4540] flex flex-col gap-0.5">
                          <span>
                            Palette: <strong className="text-[#1c1c19]">{task.palette}</strong>
                          </span>
                          {task.transcript && (
                            <span className="italic text-[11px] text-[#80756f]">{task.transcript}</span>
                          )}
                        </div>
                        <div className="pt-1 flex items-center justify-between">
                          <span className="text-[11px] text-[#80756f] flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">timer</span>
                            {task.due}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleTaskAction(task.id)}
                            disabled={task.status === 'completed'}
                            className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all ${
                              task.status === 'completed'
                                ? 'bg-[#d8e7cd] text-[#3d4a37]'
                                : task.id === 'FA-1048'
                                ? 'bg-[#180f0a] text-white hover:bg-[#964735]'
                                : 'bg-white text-[#180f0a] hover:bg-[#f0ede9] shadow-xs border border-[#d1c4bd]'
                            }`}
                          >
                            {task.actionText}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CARD 2: LOW STOCK ALERTS */}
                <div className="bg-white rounded-2xl shadow-[0_4px_20px_-2px_rgba(46,36,30,0.04)] border border-[#e5e2dd] p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[20px] text-[#ba1a1a]">warning</span>
                      <h2 className="font-serif text-xl text-[#180f0a] font-medium">
                        Low Stock Alerts
                      </h2>
                    </div>
                    <button
                      type="button"
                      onClick={() => setQuickModal({ title: 'Inventory Management', desc: 'Detailed stock restock triggers and supplier ledger will unlock in Phase 2B.' })}
                      className="text-[#964735] hover:text-[#180f0a] text-[12px] font-semibold transition-colors flex items-center gap-0.5"
                    >
                      Manage Inventory
                      <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    <div className="p-2 flex items-center justify-between rounded-lg hover:bg-[#f6f3ee] transition-colors">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-2 h-2 rounded-full bg-[#ba1a1a] shrink-0 animate-ping"></span>
                        <span className="text-[13px] font-medium text-[#1c1c19] truncate">
                          Satin Velvet Ribbon (Dusty Rose)
                        </span>
                      </div>
                      <span className="text-[10px] text-[#ba1a1a] font-bold whitespace-nowrap bg-[#ffdad6] px-2 py-0.5 rounded-full">
                        Critical · 2 spools left
                      </span>
                    </div>

                    <div className="p-2 flex items-center justify-between rounded-lg hover:bg-[#f6f3ee] transition-colors">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-2 h-2 rounded-full bg-[#964735] shrink-0"></span>
                        <span className="text-[13px] font-medium text-[#1c1c19] truncate">
                          Ivory Wrapping Paper
                        </span>
                      </div>
                      <span className="text-[10px] text-[#783020] font-bold whitespace-nowrap bg-[#ffdad3] px-2 py-0.5 rounded-full">
                        Low · 8 rolls left
                      </span>
                    </div>

                    <div className="p-2 flex items-center justify-between rounded-lg hover:bg-[#f6f3ee] transition-colors">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-2 h-2 rounded-full bg-[#964735] shrink-0"></span>
                        <span className="text-[13px] font-medium text-[#1c1c19] truncate">
                          Pink Chenille Wire (Pipe Cleaners)
                        </span>
                      </div>
                      <span className="text-[10px] text-[#783020] font-bold whitespace-nowrap bg-[#ffdad3] px-2 py-0.5 rounded-full">
                        Low · 14 units left
                      </span>
                    </div>

                    <div className="p-2 flex items-center justify-between rounded-lg hover:bg-[#f6f3ee] transition-colors">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-2 h-2 rounded-full bg-[#964735] shrink-0"></span>
                        <span className="text-[13px] font-medium text-[#1c1c19] truncate">
                          Deckled Botanical Boxes
                        </span>
                      </div>
                      <span className="text-[10px] text-[#783020] font-bold whitespace-nowrap bg-[#ffdad3] px-2 py-0.5 rounded-full">
                        Low · 5 boxes left
                      </span>
                    </div>
                  </div>
                </div>

                {/* CARD 3: OPERATIONS SHORTCUTS */}
                <div className="bg-white rounded-2xl shadow-[0_4px_20px_-2px_rgba(46,36,30,0.04)] border border-[#e5e2dd] p-6">
                  <h2 className="font-serif text-xl text-[#180f0a] font-medium mb-3">
                    Operations Shortcuts
                  </h2>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setQuickModal({ title: 'Create Order', desc: 'Manual order creation intake is seeded for immediate handler dispatch testing.' })}
                      className="p-3.5 rounded-xl bg-[#f6f3ee] hover:bg-[#ebe8e3] transition-all text-left flex flex-col justify-between group border border-[#e5e2dd]/40 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[20px] text-[#180f0a] group-hover:text-[#964735] transition-colors">
                        add_shopping_cart
                      </span>
                      <span className="mt-2 text-[13px] font-semibold text-[#180f0a]">Create Order</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setQuickModal({ title: 'Add Product', desc: 'Product creation wizard is pre-configured with botanical attributes for Phase 2B catalog uploads.' })}
                      className="p-3.5 rounded-xl bg-[#f6f3ee] hover:bg-[#ebe8e3] transition-all text-left flex flex-col justify-between group border border-[#e5e2dd]/40 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[20px] text-[#180f0a] group-hover:text-[#964735] transition-colors">
                        post_add
                      </span>
                      <span className="mt-2 text-[13px] font-semibold text-[#180f0a]">Add Product</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setQuickModal({ title: 'Update Inventory', desc: 'Direct stock counter and batch arrival logs are scheduled for Phase 2B.' })}
                      className="p-3.5 rounded-xl bg-[#f6f3ee] hover:bg-[#ebe8e3] transition-all text-left flex flex-col justify-between group border border-[#e5e2dd]/40 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[20px] text-[#180f0a] group-hover:text-[#964735] transition-colors">
                        edit_note
                      </span>
                      <span className="mt-2 text-[13px] font-semibold text-[#180f0a]">Update Inventory</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const csvContent = 'data:text/csv;charset=utf-8,Order ID,Customer,Amount,Status\nFA-1048,Aarav,₹899,In Production\nFA-1047,Ananya,₹1499,Ready to Dispatch\nFA-1046,Riya,₹599,Confirmed\nFA-1045,Kabir,₹1099,Quality Check\nFA-1044,Meera,₹1799,Shipped';
                        const encodedUri = encodeURI(csvContent);
                        const link = document.createElement('a');
                        link.setAttribute('href', encodedUri);
                        link.setAttribute('download', 'flora_alchemy_summary.csv');
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      }}
                      className="p-3.5 rounded-xl bg-[#f6f3ee] hover:bg-[#ebe8e3] transition-all text-left flex flex-col justify-between group border border-[#e5e2dd]/40 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[20px] text-[#180f0a] group-hover:text-[#964735] transition-colors">
                        ios_share
                      </span>
                      <span className="mt-2 text-[13px] font-semibold text-[#180f0a]">Export Summary</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Information / Mock Action Modal */}
        {quickModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#e5e2dd] animate-fade-in space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#180f0a]">
                  <span className="material-symbols-outlined text-[22px] text-[#964735]">info</span>
                  <h3 className="font-serif text-xl font-medium">{quickModal.title}</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setQuickModal(null)}
                  className="p-1 rounded-lg text-[#80756f] hover:bg-[#f0ede9]"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>
              <p className="text-[14px] text-[#4e4540] leading-relaxed">
                {quickModal.desc}
              </p>
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setQuickModal(null)}
                  className="px-5 py-2 rounded-full bg-[#180f0a] text-white text-[13px] font-semibold shadow-xs hover:bg-[#2e241e]"
                >
                  Understood
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
