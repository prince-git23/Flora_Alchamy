import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, X, Sparkles, ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import ProductCard from '../components/ProductCard.jsx';
import { getProducts } from '../services/productService.js';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const headerRef = useRef(null);
  const resultsRef = useRef(null);

  const suggestedTags = [
    'Dusty Rose',
    'Pressed Flowers',
    'Ceramic Pot',
    'Heirloom Hamper',
    'Wax Seal',
    'Sunflower Charm',
    'Gold Foil',
    'Rakhi'
  ];

  useEffect(() => {
    function executeSearch() {
      setLoading(true);
      const q = query.trim().toLowerCase();
      const all = getProducts();
      const matched = q
        ? all.filter(p => p.visibility !== 'Hidden' && [p.name, p.shortDescription, p.description, p.categoryLabel, ...(p.tags || [])]
            .filter(Boolean).join(' ').toLowerCase().includes(q))
        : all.filter(p => p.visibility !== 'Hidden');
      setResults(matched);
      setLoading(false);
    }
    executeSearch();
  }, [query]);

  // GSAP entrance
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(headerRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' });
    });

    return () => ctx.revert();
  }, []);

  // Stagger results when they change
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!resultsRef.current || results.length === 0) return;

    const ctx = gsap.context(() => {
      const cards = resultsRef.current.querySelectorAll('article');
      gsap.fromTo(cards, { opacity: 0, y: 30 }, {
        opacity: 1, y: 0, duration: 0.5, stagger: 0.06, ease: 'power3.out'
      });
    });

    return () => ctx.revert();
  }, [results]);

  const handleTagClick = (tag) => {
    setQuery(tag);
    searchParams.set('q', tag);
    setSearchParams(searchParams);
  };

  const handleClear = () => {
    setQuery('');
    searchParams.delete('q');
    setSearchParams(searchParams);
  };

  return (
    <div className="w-full bg-[#fcf9f4] min-h-screen py-10 lg:py-16 relative overflow-hidden">
      {/* Ambient glow orbs */}
      <div className="absolute top-20 left-1/3 w-64 h-64 bg-[#964735]/6 rounded-full blur-[120px]" />
      <div className="absolute bottom-20 right-1/3 w-48 h-48 bg-[#c17c74]/6 rounded-full blur-[100px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Search Bar Input */}
        <div ref={headerRef} className="max-w-3xl mx-auto text-center space-y-6 mb-12">
          <span className="text-[11px] uppercase font-bold tracking-widest text-[#964735]">
            Atelier Search Directory
          </span>
          <h1 className="font-serif text-[36px] sm:text-[44px] text-[#180f0a] font-normal tracking-tight">
            Find an Everlasting Keepsake
          </h1>

          <div className="relative w-full">
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                if (e.target.value) {
                  searchParams.set('q', e.target.value);
                } else {
                  searchParams.delete('q');
                }
                setSearchParams(searchParams);
              }}
              placeholder="Search by flower name, material, occasion, or gift style..."
              autoFocus
              className="w-full pl-12 pr-12 py-4 rounded-full bg-white text-[15px] border border-[#e5e2dd] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#180f0a] transition-all"
            />
            <Search className="w-5 h-5 text-[#80756f] absolute left-5 top-1/2 -translate-y-1/2" />
            {query && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-[#80756f] hover:text-[#180f0a] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Popular Tag Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <span className="text-[12px] text-[#80756f] font-semibold">Popular Searches:</span>
            {suggestedTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleTagClick(tag)}
                className="px-3.5 py-1 rounded-full bg-white text-[12px] text-[#4e4540] border border-[#e5e2dd] hover:border-[#180f0a] hover:text-[#180f0a] transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Search Results */}
        <div>
          <div className="flex items-center justify-between border-b border-[#e5e2dd] pb-4 mb-8">
            <span className="text-[14px] text-[#4e4540]">
              {query ? (
                <span>Showing {results.length} results for "<strong className="text-[#180f0a]">{query}</strong>"</span>
              ) : (
                <span>Browse our complete collection of {results.length} handcrafted pieces</span>
              )}
            </span>
            <span className="text-[11px] uppercase font-bold text-[#80756f]">
              All Prices in ₹ INR
            </span>
          </div>

          {results.length > 0 ? (
            <div ref={resultsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {results.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-[#e5e2dd] max-w-lg mx-auto space-y-4">
              <div className="w-14 h-14 rounded-full bg-[#f6f3ee] mx-auto flex items-center justify-center text-2xl">
                🔍
              </div>
              <h3 className="font-serif text-[22px] text-[#180f0a]">No keepsakes found for "{query}"</h3>
              <p className="text-[14px] text-[#4e4540]">
                Try searching for broader keywords such as "rose", "card", "hamper", or "pot".
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={handleClear}
                  className="px-6 py-2.5 rounded-full bg-[#180f0a] text-white text-[13px] font-semibold hover:bg-[#964735] transition-colors"
                >
                  Clear Search
                </button>
                <Link
                  to="/gift-finder"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-[#e5e2dd] text-[13px] font-semibold text-[#180f0a] hover:bg-[#f6f3ee] transition-colors"
                >
                  <Sparkles className="w-4 h-4 text-[#964735]" />
                  Try Gift Finder
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
