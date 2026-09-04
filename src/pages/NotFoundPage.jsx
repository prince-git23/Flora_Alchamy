import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Compass, ShoppingBag, Truck } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="w-full bg-[#fcf9f4] min-h-[70vh] flex items-center justify-center py-16 px-4">
      <div className="max-w-lg w-full text-center space-y-6 bg-white rounded-3xl p-8 sm:p-12 border border-[#e5e2dd] shadow-sm">
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

        <div className="pt-4 border-t border-[#e5e2dd]">
          <Link
            to="/order-tracking"
            className="text-[12px] font-medium text-[#80756f] hover:text-[#964735] transition-colors inline-flex items-center gap-1.5"
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Looking for an existing delivery? Track your order</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
