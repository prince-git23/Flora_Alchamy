import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext.jsx';

export default function Footer() {
  const [email, setEmail] = useState('');
  const { showToast } = useStore();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      showToast('Thank you for subscribing to Flora Alchemy studio notes!');
      setEmail('');
    }
  };

  return (
    <footer className="w-full bg-[#f6f3ee] border-t border-[#e5e2dd]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[#e5e2dd]">
          {/* Brand Col */}
          <div className="md:col-span-4 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <img
                src="/assets/images/flora-asset-27.jpg"
                alt="Flora Alchemy Emblem"
                className="h-7 w-auto object-contain"
              />
              <span className="font-serif text-[22px] tracking-tight font-medium text-[#180f0a]">
                Flora Alchemy
              </span>
            </Link>
            <p className="text-[14px] leading-relaxed text-[#4e4540] max-w-sm">
              Handcrafted pipe-cleaner floral art, deckled botanical cards, and personalized gift keepsakes made to endure through quiet seasons.
            </p>
            <div className="pt-2">
              <p className="text-[11px] uppercase tracking-wider font-bold text-[#4e4540]/80 mb-2">
                Join Our Studio Newsletter
              </p>
              <form onSubmit={handleSubscribe} className="flex items-center gap-2 max-w-sm">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="w-full px-4 py-2 rounded-full bg-white text-[13px] text-[#1c1c19] placeholder:text-[#80756f] border border-[#e5e2dd] focus:outline-none focus:ring-1 focus:ring-[#180f0a]"
                  required
                />
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#180f0a] text-white hover:bg-[#964735] transition-colors text-[12px] font-semibold tracking-wide shrink-0"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          {/* Col: Shop */}
          <div className="md:col-span-2 space-y-3">
            <h3 className="text-[11px] uppercase font-bold tracking-widest text-[#1c1c19]">Shop</h3>
            <ul className="space-y-2 text-[13px] text-[#4e4540]">
              <li><Link to="/shop" className="hover:text-[#180f0a] transition-colors">All Posies & Stems</Link></li>
              <li><Link to="/custom-gifts" className="hover:text-[#180f0a] transition-colors">Custom Gift Studio</Link></li>
              <li><Link to="/shop" className="hover:text-[#180f0a] transition-colors">Desk Blooms in Pots</Link></li>
              <li><Link to="/shop" className="hover:text-[#180f0a] transition-colors">Botanical Cards</Link></li>
              <li><Link to="/collections" className="hover:text-[#180f0a] transition-colors">Curated Archives</Link></li>
            </ul>
          </div>

          {/* Col: Customer Care */}
          <div className="md:col-span-2 space-y-3">
            <h3 className="text-[11px] uppercase font-bold tracking-widest text-[#1c1c19]">Customer Care</h3>
            <ul className="space-y-2 text-[13px] text-[#4e4540]">
              <li><Link to="/order-tracking/FA-1024" className="hover:text-[#180f0a] transition-colors">Order Tracking</Link></li>
              <li><Link to="/cart" className="hover:text-[#180f0a] transition-colors">Shopping Bag</Link></li>
              <li><Link to="/wishlist" className="hover:text-[#180f0a] transition-colors">Saved Keepsakes</Link></li>
              <li><Link to="/account" className="hover:text-[#180f0a] transition-colors">Customer Account</Link></li>
              <li><Link to="/login" className="hover:text-[#180f0a] transition-colors">Sign In / Register</Link></li>
            </ul>
          </div>

          {/* Col: Atelier Craft */}
          <div className="md:col-span-2 space-y-3">
            <h3 className="text-[11px] uppercase font-bold tracking-widest text-[#1c1c19]">Craft & Story</h3>
            <ul className="space-y-2 text-[13px] text-[#4e4540]">
              <li><Link to="/our-creations" className="hover:text-[#180f0a] transition-colors">Our Portfolio</Link></li>
              <li><Link to="/collections" className="hover:text-[#180f0a] transition-colors">Milestones & Occasions</Link></li>
              <li><Link to="/custom-gifts" className="hover:text-[#180f0a] transition-colors">Bespoke Inquiries</Link></li>
              <li><Link to="/shop" className="hover:text-[#180f0a] transition-colors">Studio Packaging</Link></li>
            </ul>
          </div>

          {/* Col: Thoughtful Gifting */}
          <div className="md:col-span-2 space-y-3">
            <h3 className="text-[11px] uppercase font-bold tracking-widest text-[#1c1c19]">Handcrafted</h3>
            <p className="text-[13px] leading-relaxed text-[#4e4540]">
              Each flower petal and stem is hand-twisted with soft cotton chenille and tied with raw silk or cotton ribbons.
            </p>
            <div className="pt-1">
              <span className="inline-block px-3 py-1 rounded-full bg-[#f0ede9] text-[#180f0a] text-[11px] font-semibold">
                Pan-India Delivery
              </span>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[13px] text-[#4e4540]">
          <p>© 2025 Flora Alchemy. All rights reserved. Handcrafted in India.</p>
          <div className="flex items-center gap-6">
            <Link to="/shop" className="hover:text-[#180f0a] transition-colors">Curated Catalog</Link>
            <Link to="/custom-gifts" className="hover:text-[#180f0a] transition-colors">Bespoke Studio</Link>
            <Link to="/order-tracking/FA-1024" className="hover:text-[#180f0a] transition-colors">Track Order</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
