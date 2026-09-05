import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout.jsx';
import { getInventory, getLowStockItems, getInventoryHistory } from '../../services/inventoryService.js';
import { formatINR, formatDate } from '../../services/orderService.js';

export default function AdminInventoryPage() {
  const [viewState, setViewState] = useState('live');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const inventory = useMemo(() => getInventory(), []);
  const history = useMemo(() => getInventoryHistory(), []);

  const totalProducts = inventory.length;
  const inStock = inventory.filter(i => i.status === 'In Stock').length;
  const lowStock = inventory.filter(i => i.status === 'Low Stock').length;
  const critical = inventory.filter(i => i.status === 'Critical').length;
  const totalUnits = inventory.reduce((s, i) => s + i.currentStock, 0);

  const filtered = useMemo(() => {
    let list = [...inventory];
    if (statusFilter !== 'all') {
      list = list.filter(i => i.status.toLowerCase().replace(' ', '_') === statusFilter || i.status === statusFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(i => i.productName.toLowerCase().includes(q) || i.sku.toLowerCase().includes(q));
    }
    return list;
  }, [statusFilter, searchQuery]);

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-6 pb-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#180f0a] tracking-tight font-normal">Inventory Overview</h1>
            <p className="text-[14px] text-[#4e4540] mt-1">Monitor stock levels, track movements, and manage supply · <span className="font-semibold text-[#180f0a]">Sample Data Environment</span></p>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="flex items-center p-1 rounded-full bg-[#ebe8e3] text-[12px]">
              <button type="button" onClick={() => setViewState('live')} className={`px-3 py-1 rounded-full font-semibold transition-all ${viewState === 'live' ? 'bg-white shadow-xs text-[#180f0a]' : 'text-[#4e4540]'}`}>Overview</button>
              <button type="button" onClick={() => setViewState('empty')} className={`px-3 py-1 rounded-full font-semibold transition-all ${viewState === 'empty' ? 'bg-white shadow-xs text-[#180f0a]' : 'text-[#4e4540]'}`}>Empty State</button>
            </div>
          </div>
        </div>

        {/* KPI */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <div className="bg-white p-4 rounded-xl border border-[#e5e2dd] shadow-xs">
            <div className="flex items-center justify-between text-[#80756f] mb-1.5"><span className="text-[11px] uppercase tracking-wider font-semibold">Total SKUs</span><span className="material-symbols-outlined text-[16px]">inventory_2</span></div>
            <div className="text-3xl font-serif font-medium text-[#180f0a] leading-none">{totalProducts}</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-[#e5e2dd] shadow-xs">
            <div className="flex items-center justify-between text-[#80756f] mb-1.5"><span className="text-[11px] uppercase tracking-wider font-semibold">In Stock</span><span className="material-symbols-outlined text-[16px] text-[#5b6d54]">check_circle</span></div>
            <div className="text-3xl font-serif font-medium text-[#180f0a] leading-none">{inStock}</div>
            <p className="text-[11px] text-[#5b6d54] mt-2">{totalUnits} total units</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-[#e5e2dd] shadow-xs">
            <div className="flex items-center justify-between text-[#80756f] mb-1.5"><span className="text-[11px] uppercase tracking-wider font-semibold">Low Stock</span><span className="material-symbols-outlined text-[16px] text-[#964735]">warning</span></div>
            <div className="text-3xl font-serif font-medium text-[#964735] leading-none">{lowStock}</div>
            <p className="text-[11px] text-[#964735] mt-2">Below reorder level</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-[#e5e2dd] shadow-xs">
            <div className="flex items-center justify-between text-[#80756f] mb-1.5"><span className="text-[11px] uppercase tracking-wider font-semibold">Critical</span><span className="material-symbols-outlined text-[16px] text-[#ba1a1a]">error</span></div>
            <div className="text-3xl font-serif font-medium text-[#ba1a1a] leading-none">{critical}</div>
            <p className="text-[11px] text-[#ba1a1a] mt-2">Immediate restock needed</p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link to="/admin/inventory/stock" className="bg-white p-4 rounded-xl border border-[#e5e2dd] shadow-xs hover:border-[#180f0a] hover:shadow-md transition-all group text-center">
            <span className="material-symbols-outlined text-[24px] text-[#80756f] group-hover:text-[#180f0a] transition-colors">warehouse</span>
            <p className="text-[13px] font-semibold text-[#180f0a] mt-2">Stock Management</p>
          </Link>
          <Link to="/admin/inventory/adjust" className="bg-white p-4 rounded-xl border border-[#e5e2dd] shadow-xs hover:border-[#180f0a] hover:shadow-md transition-all group text-center">
            <span className="material-symbols-outlined text-[24px] text-[#80756f] group-hover:text-[#180f0a] transition-colors">tune</span>
            <p className="text-[13px] font-semibold text-[#180f0a] mt-2">Stock Adjustment</p>
          </Link>
          <Link to="/admin/inventory/low-stock" className="bg-white p-4 rounded-xl border border-[#e5e2dd] shadow-xs hover:border-[#180f0a] hover:shadow-md transition-all group text-center">
            <span className="material-symbols-outlined text-[24px] text-[#964735] group-hover:text-[#ba1a1a] transition-colors">notification_important</span>
            <p className="text-[13px] font-semibold text-[#180f0a] mt-2">Low Stock Alerts</p>
          </Link>
          <Link to="/admin/inventory/history" className="bg-white p-4 rounded-xl border border-[#e5e2dd] shadow-xs hover:border-[#180f0a] hover:shadow-md transition-all group text-center">
            <span className="material-symbols-outlined text-[24px] text-[#80756f] group-hover:text-[#180f0a] transition-colors">history</span>
            <p className="text-[13px] font-semibold text-[#180f0a] mt-2">Inventory History</p>
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-[#e5e2dd] p-3.5 shadow-xs">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[240px] max-w-md">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[16px] text-[#80756f]">search</span>
              <input type="search" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search by product name or SKU..."
                className="w-full text-[13px] bg-[#f6f3ee] border border-[#d1c4bd] focus:border-[#180f0a] rounded-lg pl-9 pr-3 py-1.5 text-[#1c1c19] placeholder:text-[#80756f] focus:ring-1 focus:ring-[#180f0a] transition" />
            </div>
            <div className="flex items-center gap-1.5">
              {['all', 'In Stock', 'Low Stock', 'Critical'].map(s => (
                <button key={s} type="button" onClick={() => setStatusFilter(s === 'all' ? 'all' : s)}
                  className={`px-3 py-1.5 rounded-full text-[12px] font-medium transition-all ${(statusFilter === 'all' && s === 'all') || statusFilter === s ? 'bg-[#180f0a] text-white shadow-xs' : 'bg-[#f6f3ee] text-[#4e4540] hover:bg-[#ebe8e3]'}`}>
                  {s === 'all' ? 'All' : s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {viewState === 'empty' ? (
          <div className="p-12 sm:p-16 bg-white rounded-2xl text-center space-y-4 shadow-xs border border-[#e5e2dd]">
            <div className="w-16 h-16 rounded-full bg-[#f6f3ee] mx-auto flex items-center justify-center text-[#80756f]"><span className="material-symbols-outlined text-[32px]">inventory_2</span></div>
            <div className="max-w-md mx-auto"><h3 className="font-serif text-2xl text-[#180f0a] font-medium">No Inventory Data</h3><p className="text-[14px] text-[#4e4540] mt-1.5">No inventory records match your current filter.</p></div>
            <button type="button" onClick={() => setViewState('live')} className="px-5 py-2 rounded-full bg-[#180f0a] text-white text-[13px] font-semibold shadow-xs hover:bg-[#2e241e] transition-colors">Return to Overview</button>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-[#e5e2dd] shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-[13px]">
                <thead>
                  <tr className="bg-[#f6f3ee] border-b border-[#e5e2dd] text-[#80756f] font-semibold tracking-wide uppercase text-[11px]">
                    <th className="py-3 px-4 font-semibold">Product</th>
                    <th className="py-3 px-4 font-semibold">SKU</th>
                    <th className="py-3 px-4 font-semibold">Category</th>
                    <th className="py-3 px-4 font-semibold text-center">Stock</th>
                    <th className="py-3 px-4 font-semibold text-center">Reorder Level</th>
                    <th className="py-3 px-4 font-semibold">Status</th>
                    <th className="py-3 px-4 font-semibold">Last Updated</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0ede9] text-[#1c1c19]">
                  {filtered.map(item => (
                    <tr key={item.productId} className="hover:bg-[#f6f3ee]/50 transition-colors">
                      <td className="py-3 px-4 font-medium text-[#180f0a] max-w-[220px] truncate">{item.productName}</td>
                      <td className="py-3 px-4 text-[12px] font-mono text-[#80756f]">{item.sku}</td>
                      <td className="py-3 px-4 text-[12px] text-[#4e4540]">{item.category}</td>
                      <td className="py-3 px-4 text-center">
                        <span className={`font-bold ${item.currentStock <= item.reorderLevel / 2 ? 'text-[#ba1a1a]' : item.currentStock <= item.reorderLevel ? 'text-[#964735]' : 'text-[#180f0a]'}`}>{item.currentStock}</span>
                      </td>
                      <td className="py-3 px-4 text-center text-[#80756f]">{item.reorderLevel}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${item.status === 'In Stock' ? 'bg-emerald-50 text-emerald-700' : item.status === 'Critical' ? 'bg-red-50 text-red-700' : 'bg-[#ffdad3] text-[#783020]'}`}>{item.status}</span>
                      </td>
                      <td className="py-3 px-4 text-[11px] text-[#80756f]">{formatDate(item.updatedAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-4 bg-[#f6f3ee] border-t border-[#e5e2dd] flex items-center justify-between text-[12px] text-[#80756f]">
              <span>Showing <strong className="text-[#180f0a]">{filtered.length}</strong> items</span>
              <span>Sample Data Environment</span>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
