import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, X, Sparkles, ArrowRight } from 'lucide-react';
import ProductCard from '../components/ProductCard.jsx';
import { getProducts } from '../services/api.js';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

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
    async function executeSearch() {
      setLoading(true);
      const matched = await getProducts({ search: query });
      setResults(matched);
      setLoading(false);
    }
    executeSearch();
  }, [query]);

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
    <div className="w-full bg-[#fcf9f4] min-h-screen py-10 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Bar Input */}
        <div className="max-w-3xl mx-auto text-center space-y-6 mb-12">
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
              className="w-full pl-12 pr-12 py-4 rounded-full bg-white text-[15px] border border-[#e5e2dd] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#180f0a]"
            />
            <Search className="w-5 h-5 text-[#80756f] absolute left-5 top-1/2 -translate-y-1/2" />
            {query && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-[#80756f] hover:text-[#180f0a]"
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
              <button
                onClick={handleClear}
                className="px-6 py-2.5 rounded-full bg-[#180f0a] text-white text-[13px] font-semibold hover:bg-[#964735] transition-colors"
              >
                Clear Search
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
