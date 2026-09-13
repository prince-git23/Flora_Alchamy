import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout.jsx';
import { getProducts } from '../../services/productService.js';
import { getInventory, getInventoryItem, getInventoryHistory } from '../../services/inventoryService.js';
import { formatINR, formatDate } from '../../services/orderService.js';

export default function AdminProductDetailPage() {
  const { productId } = useParams();

  const products = useMemo(() => getProducts(), []);
  const inventoryData = useMemo(() => getInventory(), []);
  const history = useMemo(() => getInventoryHistory(), []);
  const product = useMemo(() => products.find(p => p.id === productId) || null, [products, productId]);
  const inventory = useMemo(() => inventoryData.find(i => i.productId === productId) || null, [inventoryData, productId]);
  const productHistory = useMemo(() => history.filter(h => h.sku === inventory?.sku).slice(0, 5), [history, inventory]);

  if (!product) {
    return (
      <AdminLayout>
        <div className="max-w-7xl mx-auto pb-12">
          <div className="p-12 sm:p-16 bg-white rounded-2xl text-center space-y-4 shadow-xs border border-[#e5e2dd]">
            <div className="w-16 h-16 rounded-full bg-[#f6f3ee] mx-auto flex items-center justify-center text-[#80756f]">
              <span className="material-symbols-outlined text-[32px]">search_off</span>
            </div>
            <div className="max-w-md mx-auto">
              <h3 className="font-serif text-2xl text-[#180f0a] font-medium">Product Not Found</h3>
              <p className="text-[14px] text-[#4e4540] mt-1.5">The product "{productId}" does not exist in the catalog.</p>
            </div>
            <Link to="/admin/products" className="inline-block px-5 py-2 rounded-full bg-[#180f0a] text-white text-[13px] font-semibold shadow-xs hover:bg-[#2e241e] transition-colors">Return to Products</Link>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-6 pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link to="/admin/products" className="p-2 rounded-xl hover:bg-[#ebe8e3] text-[#4e4540] transition-colors">
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            </Link>
            <div>
              <h1 className="font-serif text-2xl sm:text-3xl text-[#180f0a] tracking-tight font-normal">{product.name}</h1>
              <p className="text-[13px] text-[#80756f] mt-0.5">{product.categoryLabel} · SKU: {inventory?.sku || 'N/A'} · Sample Data Environment</p>
            </div>
          </div>
          <Link to="/admin/products" className="px-4 py-2 text-[12px] font-semibold text-[#180f0a] bg-white hover:bg-[#f6f3ee] border border-[#d1c4bd] rounded-full transition shadow-xs">
            Back to Catalog
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Images & Description */}
          <div className="lg:col-span-2 space-y-6">
            {/* Images */}
            <div className="bg-white rounded-xl border border-[#e5e2dd] p-6 shadow-xs">
              <h2 className="font-serif text-lg text-[#180f0a] font-medium mb-4">Product Images</h2>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                {product.images.map((img, idx) => (
                  <div key={idx} className="aspect-square rounded-xl bg-[#f6f3ee] overflow-hidden border border-[#f0ede9]">
                    <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl border border-[#e5e2dd] p-6 shadow-xs">
              <h2 className="font-serif text-lg text-[#180f0a] font-medium mb-4">Description</h2>
              <p className="text-[14px] text-[#4e4540] leading-relaxed">{product.description}</p>
              <div className="mt-4 space-y-2 text-[13px]">
                <div className="flex justify-between py-1 border-b border-[#f0ede9]"><span className="text-[#80756f]">Craft Time</span><span className="font-medium text-[#180f0a]">{product.craftTime}</span></div>
                <div className="flex justify-between py-1 border-b border-[#f0ede9]"><span className="text-[#80756f]">Materials</span><span className="font-medium text-[#180f0a] text-right max-w-xs">{product.materials}</span></div>
                <div className="flex justify-between py-1"><span className="text-[#80756f]">Dimensions</span><span className="font-medium text-[#180f0a] text-right max-w-xs">{product.dimensions}</span></div>
              </div>
            </div>

            {/* Recent Activity */}
            {productHistory.length > 0 && (
              <div className="bg-white rounded-xl border border-[#e5e2dd] p-6 shadow-xs">
                <h2 className="font-serif text-lg text-[#180f0a] font-medium mb-4">Recent Activity</h2>
                <div className="divide-y divide-[#f0ede9]">
                  {productHistory.map(h => (
                    <div key={h.id} className="py-3 flex items-start gap-3">
                      <span className={`material-symbols-outlined text-[18px] mt-0.5 ${h.type === 'Restock' ? 'text-[#5b6d54]' : h.type === 'Adjustment' ? 'text-[#964735]' : 'text-[#80756f]'}`}>
                        {h.type === 'Restock' ? 'add_circle' : h.type === 'Adjustment' ? 'edit' : 'shopping_bag'}
                      </span>
                      <div className="flex-1">
                        <p className="text-[13px] text-[#1c1c19]">{h.notes}</p>
                        <p className="text-[11px] text-[#80756f] mt-0.5">{formatDate(h.date)} · {h.type} · {h.quantityChange > 0 ? '+' : ''}{h.quantityChange} units</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Pricing & Inventory */}
          <div className="space-y-6">
            {/* Pricing */}
            <div className="bg-white rounded-xl border border-[#e5e2dd] p-6 shadow-xs">
              <h2 className="font-serif text-lg text-[#180f0a] font-medium mb-4">Pricing</h2>
              <div className="space-y-3 text-[13px]">
                <div className="flex justify-between"><span className="text-[#80756f]">Current Price</span><span className="font-bold text-[#180f0a] text-lg">{formatINR(product.price)}</span></div>
                {product.originalPrice && (
                  <div className="flex justify-between"><span className="text-[#80756f]">Original Price</span><span className="font-medium text-[#80756f] line-through">{formatINR(product.originalPrice)}</span></div>
                )}
                <div className="flex justify-between pt-2 border-t border-[#f0ede9]"><span className="text-[#80756f]">Discount</span><span className="font-semibold text-[#5b6d54]">{Math.round((1 - product.price / product.originalPrice) * 100)}% off</span></div>
              </div>
            </div>

            {/* Inventory */}
            <div className="bg-white rounded-xl border border-[#e5e2dd] p-6 shadow-xs">
              <h2 className="font-serif text-lg text-[#180f0a] font-medium mb-4">Inventory</h2>
              {inventory ? (
                <div className="space-y-3 text-[13px]">
                  <div className="flex justify-between"><span className="text-[#80756f]">Current Stock</span><span className={`font-bold text-lg ${inventory.currentStock <= inventory.reorderLevel ? 'text-[#964735]' : 'text-[#180f0a]'}`}>{inventory.currentStock} units</span></div>
                  <div className="flex justify-between"><span className="text-[#80756f]">Reorder Level</span><span className="font-medium text-[#180f0a]">{inventory.reorderLevel} units</span></div>
                  <div className="flex justify-between"><span className="text-[#80756f]">Status</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${inventory.status === 'In Stock' ? 'bg-emerald-50 text-emerald-700' : inventory.status === 'Critical' ? 'bg-red-50 text-red-700' : 'bg-[#ffdad3] text-[#783020]'}`}>{inventory.status}</span>
                  </div>
                  <div className="flex justify-between"><span className="text-[#80756f]">Last Restocked</span><span className="font-medium text-[#180f0a]">{formatDate(inventory.lastRestocked)}</span></div>
                </div>
              ) : (
                <p className="text-[13px] text-[#80756f]">No inventory data available.</p>
              )}
            </div>

            {/* Tags */}
            <div className="bg-white rounded-xl border border-[#e5e2dd] p-6 shadow-xs">
              <h2 className="font-serif text-lg text-[#180f0a] font-medium mb-4">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-full bg-[#f6f3ee] text-[#4e4540] text-[11px] font-semibold border border-[#e5e2dd]">{tag}</span>
                ))}
              </div>
            </div>

            {/* Customer Visibility */}
            <div className="bg-white rounded-xl border border-[#e5e2dd] p-6 shadow-xs">
              <h2 className="font-serif text-lg text-[#180f0a] font-medium mb-4">Storefront</h2>
              <div className="space-y-2 text-[13px]">
                <div className="flex justify-between"><span className="text-[#80756f]">Visibility</span><span className="font-medium text-[#5b6d54]">Public</span></div>
                <div className="flex justify-between"><span className="text-[#80756f]">Availability</span><span className="font-medium text-[#180f0a]">{product.availability}</span></div>
                <div className="flex justify-between"><span className="text-[#80756f]">Rating</span><span className="font-medium text-[#180f0a]">⭐ {product.rating}</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
