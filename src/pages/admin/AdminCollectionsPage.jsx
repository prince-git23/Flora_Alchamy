import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout.jsx';
import { getCollections } from '../../services/collectionService.js';
import { getProducts } from '../../services/productService.js';
import { formatINR, formatDate } from '../../services/orderService.js';

export default function AdminCollectionsPage() {
  const [viewState, setViewState] = useState('live');
  const [searchQuery, setSearchQuery] = useState('');

  const collections = useMemo(() => getCollections(), []);

  const filtered = useMemo(() => {
    let list = [...collections];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(c => c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q));
    }
    return list;
  }, [collections, searchQuery]);

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-6 pb-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#180f0a] tracking-tight font-normal">Collections</h1>
            <p className="text-[14px] text-[#4e4540] mt-1">Curated product collections and seasonal groupings · <span className="font-semibold text-[#180f0a]">Sample Data Environment</span></p>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="flex items-center p-1 rounded-full bg-[#ebe8e3] text-[12px]">
              <button type="button" onClick={() => setViewState('live')} className={`px-3 py-1 rounded-full font-semibold transition-all ${viewState === 'live' ? 'bg-white shadow-xs text-[#180f0a]' : 'text-[#4e4540]'}`}>All ({collections.length})</button>
              <button type="button" onClick={() => setViewState('empty')} className={`px-3 py-1 rounded-full font-semibold transition-all ${viewState === 'empty' ? 'bg-white shadow-xs text-[#180f0a]' : 'text-[#4e4540]'}`}>Empty State</button>
            </div>
            <button type="button" className="inline-flex items-center gap-2 px-4 py-2 text-[12px] font-semibold text-white bg-[#180f0a] hover:bg-[#2e241e] rounded-full transition shadow-sm">
              <span className="material-symbols-outlined text-[16px]">add</span>
              + Create Collection
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-[#e5e2dd] p-3.5 shadow-xs">
          <div className="relative max-w-md">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[16px] text-[#80756f]">search</span>
            <input type="search" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search collections..."
              className="w-full text-[13px] bg-[#f6f3ee] border border-[#d1c4bd] focus:border-[#180f0a] rounded-lg pl-9 pr-3 py-1.5 text-[#1c1c19] placeholder:text-[#80756f] focus:ring-1 focus:ring-[#180f0a] transition" />
          </div>
        </div>

        {/* Empty State */}
        {viewState === 'empty' && (
          <div className="p-12 sm:p-16 bg-white rounded-2xl text-center space-y-4 shadow-xs border border-[#e5e2dd]">
            <div className="w-16 h-16 rounded-full bg-[#f6f3ee] mx-auto flex items-center justify-center text-[#80756f]">
              <span className="material-symbols-outlined text-[32px]">auto_stories</span>
            </div>
            <div className="max-w-md mx-auto">
              <h3 className="font-serif text-2xl text-[#180f0a] font-medium">No Collections Found</h3>
              <p className="text-[14px] text-[#4e4540] mt-1.5">Create your first collection to group related products together.</p>
            </div>
            <button type="button" onClick={() => setViewState('live')} className="px-5 py-2 rounded-full bg-[#180f0a] text-white text-[13px] font-semibold shadow-xs hover:bg-[#2e241e] transition-colors">Return to Collections</button>
          </div>
        )}

        {/* Collections Grid */}
        {viewState === 'live' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(col => (
              <Link key={col.id} to={`/admin/collections/${col.id}`}
                className="bg-white rounded-xl border border-[#e5e2dd] shadow-xs hover:shadow-md hover:border-[#d1c4bd] transition-all overflow-hidden group">
                <div className="aspect-[16/9] bg-[#f6f3ee] overflow-hidden">
                  <img src={col.coverImage} alt={col.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                </div>
                <div className="p-5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#80756f]">Collection</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">{col.visibility}</span>
                  </div>
                  <h3 className="font-serif text-[17px] text-[#180f0a] font-medium leading-snug">{col.name}</h3>
                  <p className="text-[13px] text-[#4e4540] line-clamp-2">{col.description}</p>
                  <div className="flex items-center justify-between pt-2 border-t border-[#f0ede9] text-[12px]">
                    <span className="text-[#80756f]">{col.productCount} product{col.productCount !== 1 ? 's' : ''}</span>
                    <span className="text-[#80756f]">Created {formatDate(col.createdAt)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
