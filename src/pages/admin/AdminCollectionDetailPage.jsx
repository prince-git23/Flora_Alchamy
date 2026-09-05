import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout.jsx';
import { getCollectionById } from '../../services/collectionService.js';
import { getProducts } from '../../services/productService.js';
import { formatDate, formatINR } from '../../services/orderService.js';

export default function AdminCollectionDetailPage() {
  const { collectionId } = useParams();
  const collection = useMemo(() => getCollectionById(collectionId), [collectionId]);
  const allProducts = useMemo(() => getProducts(), []);
  const products = useMemo(() => {
    if (!collection) return [];
    return collection.productIds.map(pid => allProducts.find(p => p.id === pid)).filter(Boolean);
  }, [collection, allProducts]);

  if (!collection) {
    return (
      <AdminLayout>
        <div className="max-w-7xl mx-auto pb-12">
          <div className="p-12 sm:p-16 bg-white rounded-2xl text-center space-y-4 shadow-xs border border-[#e5e2dd]">
            <div className="w-16 h-16 rounded-full bg-[#f6f3ee] mx-auto flex items-center justify-center text-[#80756f]">
              <span className="material-symbols-outlined text-[32px]">search_off</span>
            </div>
            <div className="max-w-md mx-auto">
              <h3 className="font-serif text-2xl text-[#180f0a] font-medium">Collection Not Found</h3>
              <p className="text-[14px] text-[#4e4540] mt-1.5">The collection "{collectionId}" does not exist.</p>
            </div>
            <Link to="/admin/collections" className="inline-block px-5 py-2 rounded-full bg-[#180f0a] text-white text-[13px] font-semibold shadow-xs hover:bg-[#2e241e] transition-colors">Return to Collections</Link>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-6 pb-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link to="/admin/collections" className="p-2 rounded-xl hover:bg-[#ebe8e3] text-[#4e4540] transition-colors">
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            </Link>
            <div>
              <h1 className="font-serif text-2xl sm:text-3xl text-[#180f0a] tracking-tight font-normal">{collection.name}</h1>
              <p className="text-[13px] text-[#80756f] mt-0.5">{collection.productCount} products · {collection.visibility} · Created {formatDate(collection.createdAt)}</p>
            </div>
          </div>
        </div>

        {/* Cover Image */}
        <div className="bg-white rounded-xl border border-[#e5e2dd] overflow-hidden shadow-xs">
          <div className="aspect-[3/1] bg-[#f6f3ee]">
            <img src={collection.coverImage} alt={collection.name} className="w-full h-full object-cover" />
          </div>
          <div className="p-6">
            <p className="text-[14px] text-[#4e4540] leading-relaxed">{collection.description}</p>
          </div>
        </div>

        {/* Products in Collection */}
        <div className="bg-white rounded-xl border border-[#e5e2dd] p-6 shadow-xs">
          <h2 className="font-serif text-lg text-[#180f0a] font-medium mb-4">Products in Collection</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map(product => (
              <Link key={product.id} to={`/admin/products/${product.id}`}
                className="flex items-center gap-4 p-3 rounded-xl bg-[#f6f3ee] hover:bg-[#f0ede9] border border-[#e5e2dd] transition-all group">
                <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-white">
                  <img src={product.images?.[0] || ''} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-[#180f0a] truncate group-hover:text-[#964735] transition-colors">{product.shortName || product.name}</p>
                  <p className="text-[11px] text-[#80756f]">{product.categoryLabel || product.category}</p>
                  <p className="text-[13px] font-bold text-[#180f0a] mt-0.5">{formatINR(product.price)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
