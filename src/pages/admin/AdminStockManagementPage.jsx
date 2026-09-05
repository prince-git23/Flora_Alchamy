import React, { useState, useMemo } from 'react';
import AdminLayout from '../../components/admin/AdminLayout.jsx';
import { getInventory, adjustStock } from '../../services/inventoryService.js';
import { formatDate } from '../../services/orderService.js';

export default function AdminStockManagementPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('productName');
  const [toastMessage, setToastMessage] = useState(null);

  const inventory = useMemo(() => getInventory(), []);

  const filtered = useMemo(() => {
    let list = [...inventory];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(i => i.productName.toLowerCase().includes(q) || i.sku.toLowerCase().includes(q));
    }
    list.sort((a, b) => {
      if (sortField === 'currentStock') return a.currentStock - b.currentStock;
      return a.productName.localeCompare(b.productName);
    });
    return list;
  }, [inventory, searchQuery, sortField]);

  const handleRestock = (item) => {
    adjustStock(item.productId, 10, 'Restock', 'Manual restock from stock management');
    setToastMessage(`${item.productName}: +10 units added — Sample environment saved`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-6 pb-12">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#180f0a] tracking-tight font-normal">Stock Management</h1>
          <p className="text-[14px] text-[#4e4540] mt-1">Manage stock levels, restock requests, and SKU tracking · <span className="font-semibold text-[#180f0a]">Sample Data Environment</span></p>
        </div>

        <div className="bg-white rounded-xl border border-[#e5e2dd] p-3.5 shadow-xs">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[240px] max-w-md">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[16px] text-[#80756f]">search</span>
              <input type="search" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search by product name or SKU..."
                className="w-full text-[13px] bg-[#f6f3ee] border border-[#d1c4bd] focus:border-[#180f0a] rounded-lg pl-9 pr-3 py-1.5 text-[#1c1c19] placeholder:text-[#80756f] focus:ring-1 focus:ring-[#180f0a] transition" />
            </div>
            <div className="flex items-center gap-1.5 text-[12px]">
              <span className="text-[#80756f]">Sort:</span>
              <select value={sortField} onChange={e => setSortField(e.target.value)} className="bg-[#f6f3ee] border border-[#d1c4bd] px-2.5 py-1.5 rounded-lg text-[12px] font-semibold text-[#180f0a] cursor-pointer">
                <option value="productName">Product Name</option>
                <option value="currentStock">Stock Level (Low First)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#e5e2dd] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-[13px]">
              <thead>
                <tr className="bg-[#f6f3ee] border-b border-[#e5e2dd] text-[#80756f] font-semibold tracking-wide uppercase text-[11px]">
                  <th className="py-3 px-4 font-semibold">Product</th>
                  <th className="py-3 px-4 font-semibold">SKU</th>
                  <th className="py-3 px-4 font-semibold text-center">Stock</th>
                  <th className="py-3 px-4 font-semibold text-center">Reorder</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold">Last Restocked</th>
                  <th className="py-3 px-4 text-right font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0ede9] text-[#1c1c19]">
                {filtered.map(item => (
                  <tr key={item.productId} className="hover:bg-[#f6f3ee]/50 transition-colors">
                    <td className="py-3 px-4 font-medium text-[#180f0a]">{item.productName}</td>
                    <td className="py-3 px-4 text-[12px] font-mono text-[#80756f]">{item.sku}</td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-16 h-2 bg-[#f0ede9] rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${item.currentStock <= item.reorderLevel / 2 ? 'bg-[#ba1a1a]' : item.currentStock <= item.reorderLevel ? 'bg-[#964735]' : 'bg-[#5b6d54]'}`}
                            style={{ width: `${Math.min(100, (item.currentStock / (item.reorderLevel * 3)) * 100)}%` }}></div>
                        </div>
                        <span className={`font-bold ${item.currentStock <= item.reorderLevel / 2 ? 'text-[#ba1a1a]' : item.currentStock <= item.reorderLevel ? 'text-[#964735]' : 'text-[#180f0a]'}`}>{item.currentStock}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center text-[#80756f]">{item.reorderLevel}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${item.status === 'In Stock' ? 'bg-emerald-50 text-emerald-700' : item.status === 'Critical' ? 'bg-red-50 text-red-700' : 'bg-[#ffdad3] text-[#783020]'}`}>{item.status}</span>
                    </td>
                    <td className="py-3 px-4 text-[11px] text-[#80756f]">{formatDate(item.lastRestocked)}</td>
                    <td className="py-3 px-4 text-right">
                      <button type="button" onClick={() => handleRestock(item)} className="px-3 py-1 text-[11px] font-semibold text-[#180f0a] bg-[#f6f3ee] hover:bg-[#ebe8e3] border border-[#d1c4bd] rounded-full transition">Restock</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
