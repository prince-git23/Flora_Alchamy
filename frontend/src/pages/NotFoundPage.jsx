import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Compass, ShoppingBag, Gift, Sparkles } from 'lucide-react';
import gsap from 'gsap';

export default function NotFoundPage() {
  const pageRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(contentRef.current, { opacity: 0, y: 30, scale: 0.98 }, {
        opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'power3.out'
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={pageRef} className="w-full bg-[#fcf9f4] min-h-[70vh] flex items-center justify-center py-16 px-4 relative overflow-hidden">
      {/* Ambient glow orbs */}
      <div className="absolute top-20 left-1/4 w-64 h-64 bg-[#964735]/8 rounded-full blur-[120px]" />
      <div className="absolute bottom-20 right-1/4 w-48 h-48 bg-[#c17c74]/8 rounded-full blur-[100px]" />

      <div ref={contentRef} className="max-w-lg w-full text-center space-y-6 bg-white rounded-3xl p-8 sm:p-12 border border-[#e5e2dd] shadow-sm relative">
        <div className="w-16 h-16 rounded-full bg-[#f6f3ee] text-[#964735] mx-auto flex items-center justify-center">
          <Compass className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#964735]">
            404 · Page Not Found
          </span>
          <h1 className="font-serif text-[32px] sm:text-[40px] text-[#180f0a] font-normal leading-tight">
            A quiet detour in the garden.
          </h1>
          <p className="text-[14px] text-[#4e4540] leading-relaxed">
            The page, collection, or keepsake you are looking for may have been moved or is no longer in our active atelier catalog.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#180f0a] text-white hover:bg-[#964735] transition-colors text-[13px] font-semibold flex items-center justify-center gap-2 shadow-sm"
          >
            <span>Return to Home</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/shop"
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#f6f3ee] text-[#180f0a] hover:bg-[#e5e2dd] transition-colors text-[13px] font-semibold flex items-center justify-center gap-2 border border-[#e5e2dd]"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Browse Shop</span>
          </Link>
        </div>

        <div className="pt-4 border-t border-[#e5e2dd] space-y-3">
          <p className="text-[12px] text-[#80756f] font-semibold uppercase tracking-wider">Or explore</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/custom-gifts"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#ffdad3]/40 text-[12px] font-semibold text-[#964735] hover:bg-[#ffdad3]/60 transition-colors"
            >
              <Gift className="w-3.5 h-3.5" />
              Custom Gifts
            </Link>
            <Link
              to="/gift-finder"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#d8e7cd]/40 text-[12px] font-semibold text-[#5b6d54] hover:bg-[#d8e7cd]/60 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Gift Finder
            </Link>
            <Link
              to="/collections"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#f6f3ee] text-[12px] font-semibold text-[#4e4540] hover:bg-[#ebe8e3] transition-colors"
            >
              Collections
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
