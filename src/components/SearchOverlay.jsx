import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight } from 'lucide-react';

/**
 * Phase 3G-A — customer search entry experience.
 *
 * This is an ENTRY point, not a second search engine: it never fabricates
 * results. Popular searches and suggested categories are real destinations
 * (live shop filters, the Custom Gift Studio) and free-text submits hand off to
 * the existing /search route, which searches the live catalogue.
 */

const POPULAR_SEARCHES = [
  { label: 'Birthday Gifts', to: '/shop?occasion=birthday' },
  { label: 'Handmade Flowers', to: '/shop?category=bouquets' },
  { label: 'Custom Gifts', to: '/custom-gifts' },
  { label: 'Gifts Under ₹500', to: '/shop?maxPrice=500' },
  { label: 'Personalized Cards', to: '/shop?category=cards' },
  { label: 'Hampers', to: '/shop?category=hampers' },
];

const SUGGESTED_CATEGORIES = [
  { label: 'Flowers', icon: '🌸', to: '/shop?category=bouquets' },
  { label: 'Cards', icon: '💌', to: '/shop?category=cards' },
  { label: 'Keepsakes', icon: '🧸', to: '/shop?category=charms' },
  { label: 'Custom Gifts', icon: '🎁', to: '/custom-gifts' },
];

export default function SearchOverlay({ open, onClose }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current && inputRef.current.focus(), 30);
      return () => clearTimeout(t);
    }
    setQuery('');
    return undefined;
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  const go = (to) => {
    onClose();
    navigate(to);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const q = query.trim();
    go(q ? `/search?q=${encodeURIComponent(q)}` : '/search');
  };

  return (
    <div
      className="fixed inset-0 z-[70] bg-[#180f0a]/40 backdrop-blur-sm flex items-start justify-center px-4 pt-16 sm:pt-24"
      role="dialog"
      aria-modal="true"
      aria-label="Search Flora Alchemy"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-[#fcf9f4] rounded-3xl shadow-2xl border border-[#e5e2dd] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit} className="flex items-center gap-3 px-5 py-4 border-b border-[#e5e2dd]">
          <Search className="w-5 h-5 text-[#964735] shrink-0" aria-hidden="true" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Flora Alchemy"
            aria-label="Search Flora Alchemy"
            className="flex-1 bg-transparent text-[16px] text-[#1c1c19] placeholder:text-[#80756f] focus:outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="p-2 rounded-full text-[#80756f] hover:text-[#180f0a] hover:bg-[#f0ede9] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </form>

        <div className="p-5 sm:p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          <div className="space-y-3">
            <p className="text-[11px] uppercase font-bold tracking-widest text-[#80756f]">Popular Searches</p>
            <div className="flex flex-wrap gap-2">
              {POPULAR_SEARCHES.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => go(item.to)}
                  className="px-3.5 py-1.5 rounded-full bg-white text-[12px] font-medium text-[#4e4540] border border-[#e5e2dd] hover:border-[#180f0a] hover:text-[#180f0a] transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-[11px] uppercase font-bold tracking-widest text-[#80756f]">Suggested Categories</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {SUGGESTED_CATEGORIES.map((cat) => (
                <button
                  key={cat.label}
                  type="button"
                  onClick={() => go(cat.to)}
                  className="group flex items-center gap-2.5 p-3 rounded-2xl bg-white border border-[#e5e2dd] hover:border-[#964735] hover:shadow-sm transition-all text-left"
                >
                  <span className="text-[18px]" aria-hidden="true">{cat.icon}</span>
                  <span className="text-[13px] font-semibold text-[#180f0a] group-hover:text-[#964735] transition-colors">
                    {cat.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => go('/gift-finder')}
            className="w-full flex items-center justify-between gap-3 p-4 rounded-2xl bg-[#180f0a] text-white hover:bg-[#964735] transition-colors text-left"
          >
            <span>
              <span className="block text-[13px] font-semibold">Not sure what to gift?</span>
              <span className="block text-[12px] text-white/70">Let the Gift Finder choose with you.</span>
            </span>
            <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
