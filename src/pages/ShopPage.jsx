import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, ArrowUpDown, X, Search, RotateCcw } from 'lucide-react';
import ProductCard from '../components/ProductCard.jsx';
import { PRODUCTS, CATEGORIES } from '../data/products.js';
import { getProducts } from '../services/api.js';

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';

  const [products, setProducts] = useState(PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [maxPrice, setMaxPrice] = useState(4000);
  const [sortBy, setSortBy] = useState('featured');
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    async function filterData() {
      const filtered = await getProducts({
        category: selectedCategory,
        maxPrice: Number(maxPrice),
        search: searchQuery,
        sort: sortBy === 'featured' ? null : sortBy
      });
      setProducts(filtered);
    }
    filterData();
  }, [selectedCategory, maxPrice, sortBy, searchQuery]);

  const handleCategoryChange = (catId) => {
    setSelectedCategory(catId);
    if (catId === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', catId);
    }
    setSearchParams(searchParams);
  };

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setMaxPrice(4000);
    setSortBy('featured');
    setSearchQuery('');
    setSearchParams({});
  };

  return (
    <div className="w-full bg-[#fcf9f4] min-h-screen py-10 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Title & Intro */}
        <div className="space-y-2 mb-10">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#964735]"></span>
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#964735]">
              Atelier Catalog · Ready to Ship & Made to Order
            </span>
          </div>
          <h1 className="font-serif text-[38px] sm:text-[48px] text-[#180f0a] tracking-tight font-normal">
            The Botanical Archive
          </h1>
          <p className="text-[15px] text-[#4e4540] max-w-2xl leading-relaxed">
            Every creation is individually hand-twisted, tied with fine ribbons, and crafted with archival materials designed to stay joyful forever.
          </p>
        </div>

        {/* Toolbar: Categories Pills, Search & Sort */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-6 border-b border-[#e5e2dd] mb-8">
          {/* Categories Horizontal Scroll */}
          <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`px-4 py-2 rounded-full text-[12px] font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-[#180f0a] text-white shadow-sm'
                    : 'bg-white text-[#4e4540] hover:text-[#180f0a] hover:bg-[#f0ede9] border border-[#e5e2dd]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search, Sort & Filter Trigger */}
          <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-end">
            <div className="relative flex-1 sm:w-64">
              <input
                type="text"
                placeholder="Search keepsakes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-full bg-white text-[13px] border border-[#e5e2dd] focus:outline-none focus:ring-1 focus:ring-[#180f0a]"
              />
              <Search className="w-4 h-4 text-[#80756f] absolute left-3 top-1/2 -translate-y-1/2" />
            </div>

            {/* Sort Dropdown */}
            <div className="relative shrink-0">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 rounded-full bg-white text-[13px] font-medium text-[#1c1c19] border border-[#e5e2dd] focus:outline-none focus:ring-1 focus:ring-[#180f0a] appearance-none pr-8 cursor-pointer"
              >
                <option value="featured">Featured Keepsakes</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
              <ArrowUpDown className="w-3.5 h-3.5 text-[#80756f] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden p-2.5 rounded-full bg-white border border-[#e5e2dd] text-[#180f0a]"
              title="Toggle Filters"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Layout Grid with Sidebar Filters */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Desktop Filters Sidebar (3 cols) */}
          <aside className={`lg:col-span-3 space-y-6 ${mobileFilterOpen ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-3xl p-6 border border-[#e5e2dd] shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-[#e5e2dd] pb-3">
                <span className="font-serif text-[18px] text-[#180f0a] font-medium">Refine Catalog</span>
                {(selectedCategory !== 'all' || maxPrice < 4000 || searchQuery) && (
                  <button
                    onClick={handleResetFilters}
                    className="text-[11px] font-bold uppercase tracking-wider text-[#964735] hover:underline flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Reset
                  </button>
                )}
              </div>

              {/* Price Range Filter */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[12px] font-semibold text-[#180f0a]">
                  <span>Maximum Price</span>
                  <span className="text-[#964735] font-bold">₹{Number(maxPrice).toLocaleString('en-IN')}</span>
                </div>
                <input
                  type="range"
                  min="400"
                  max="4000"
                  step="50"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full accent-[#964735] cursor-pointer"
                />
                <div className="flex items-center justify-between text-[10px] text-[#80756f] font-bold uppercase">
                  <span>₹400</span>
                  <span>₹4,000+</span>
                </div>
              </div>

              {/* Atelier Qualities */}
              <div className="pt-2 border-t border-[#e5e2dd] space-y-2">
                <span className="text-[11px] uppercase font-bold tracking-wider text-[#80756f]">Atelier Highlights</span>
                <div className="space-y-1 text-[13px] text-[#4e4540]">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded text-[#964735] focus:ring-0" />
                    <span>Everlasting Chenille</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded text-[#964735] focus:ring-0" />
                    <span>Includes Deckled Gift Card</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded text-[#964735] focus:ring-0" />
                    <span>Pan-India Handcrafted Delivery</span>
                  </label>
                </div>
              </div>

              {/* Quick Prompt */}
              <div className="p-4 rounded-2xl bg-[#f6f3ee] border border-[#e5e2dd] space-y-2">
                <p className="font-serif text-[15px] text-[#180f0a]">Need something custom?</p>
                <p className="text-[12px] text-[#4e4540] leading-relaxed">
                  We create tailored bridal bouquets, anniversary posies, and corporate gift hampers.
                </p>
                <a
                  href="/custom-gifts"
                  className="inline-block text-[12px] font-bold text-[#964735] hover:underline"
                >
                  Enter Bespoke Studio →
                </a>
              </div>
            </div>
          </aside>

          {/* Product Grid (9 cols) */}
          <main className="lg:col-span-9">
            {products.length > 0 ? (
              <>
                <div className="flex items-center justify-between text-[13px] text-[#4e4540] mb-4">
                  <span>Showing {products.length} artisanal creations</span>
                  <span className="text-[11px] uppercase tracking-wider font-bold text-[#80756f]">
                    All Prices in ₹ INR
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </>
            ) : (
              <div className="rounded-3xl bg-white p-12 text-center border border-[#e5e2dd] space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#f6f3ee] mx-auto flex items-center justify-center text-3xl">
                  🥀
                </div>
                <h3 className="font-serif text-[24px] text-[#180f0a]">No keepsakes match your filters</h3>
                <p className="text-[14px] text-[#4e4540] max-w-md mx-auto">
                  Try adjusting your price ceiling, removing search keywords, or browsing our full botanical collections.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-6 py-2.5 rounded-full bg-[#180f0a] text-white text-[13px] font-semibold hover:bg-[#964735] transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
