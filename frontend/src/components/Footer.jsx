import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Gift, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext.jsx';

// Every footer link points at a real, existing route (Phase 3G-A rule:
// no decorative href="#" links, no fake destinations).
const FOOTER_COLUMNS = [
  {
    title: 'Shop',
    links: [
      { label: 'All Gifts', to: '/shop' },
      { label: 'Flowers & Bouquets', to: '/shop?category=bouquets' },
      { label: 'Handmade Cards', to: '/shop?category=cards' },
      { label: 'Charms & Keepsakes', to: '/shop?category=charms' },
      { label: 'Hampers', to: '/shop?category=hampers' },
    ],
  },
  {
    title: 'Gifting',
    links: [
      { label: 'Gift Finder', to: '/gift-finder' },
      { label: 'Custom Gift Studio', to: '/custom-gifts' },
      { label: 'Birthday Gifts', to: '/shop?occasion=birthday' },
      { label: 'Anniversary Gifts', to: '/shop?occasion=anniversary' },
      { label: 'Festival Gifts', to: '/shop?occasion=festival' },
    ],
  },
  {
    title: 'About',
    links: [
      { label: 'Our Story', to: '/our-story' },
      { label: "How It's Made", to: '/how-its-made' },
      { label: 'Our Creations', to: '/our-creations' },
      { label: 'Custom Request', to: '/custom-request' },
    ],
  },
  {
    title: 'Help',
    links: [
      { label: 'Order Tracking', to: '/order-tracking' },
      { label: 'Shopping Bag', to: '/cart' },
      { label: 'Saved Gifts', to: '/wishlist' },
      { label: 'My Account', to: '/account' },
    ],
  },
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const { showToast } = useStore();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      // Honest prototype feedback — no email infrastructure exists yet
      // (Phase 3D.5, E-05).
      showToast('Newsletter signup is currently a preview. No email will be sent.');
      setEmail('');
    }
  };

  return (
    <footer className="w-full bg-[#f6f3ee] border-t border-[#e5e2dd]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[#e5e2dd]">
          {/* Brand Col */}
          <div className="md:col-span-4 space-y-4">
            <Link to="/" className="flex items-center gap-3" aria-label="Flora Alchemy home">
              <img
                loading="lazy"
                decoding="async"
                src="/assets/images/flora-asset-27.jpg"
                alt=""
                className="h-7 w-auto object-contain"
              />
              <span className="font-serif text-[22px] tracking-tight font-medium text-[#180f0a]">
                Flora Alchemy
              </span>
            </Link>
            <p className="text-[14px] leading-relaxed text-[#4e4540] max-w-sm">
              Handcrafted pipe-cleaner floral art, deckled botanical cards, and personalized gift keepsakes made to endure through quiet seasons.
            </p>

            <Link
              to="/gift-finder"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white border border-[#e5e2dd] hover:border-[#964735] transition-colors group"
            >
              <Gift className="w-4 h-4 text-[#964735]" aria-hidden="true" />
              <span className="text-[12px] font-semibold text-[#180f0a]">Not sure what to gift? Use the Gift Finder</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#80756f] group-hover:text-[#964735] transition-colors" aria-hidden="true" />
            </Link>

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
                  aria-label="Your email address"
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
              <p className="text-[11px] text-[#80756f] mt-2 max-w-sm">
                Preview only — newsletter emails aren't connected yet, so nothing is sent.
              </p>
            </div>
          </div>

          {/* Link Columns */}
          {FOOTER_COLUMNS.map((col) => (
            <nav key={col.title} className="md:col-span-2 space-y-3" aria-label={col.title}>
              <h3 className="text-[11px] uppercase font-bold tracking-widest text-[#1c1c19]">{col.title}</h3>
              <ul className="space-y-2 text-[13px] text-[#4e4540]">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to} className="hover:text-[#180f0a] transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
                {col.title === 'Help' && (
                  <li>
                    <Link to="/admin/login" className="text-[12px] text-[#a89f99] hover:text-[#180f0a] transition-colors">
                      Staff / Admin Login
                    </Link>
                  </li>
                )}
              </ul>
            </nav>
          ))}
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[13px] text-[#4e4540]">
          <p>© 2025 Flora Alchemy. All rights reserved. Handcrafted in India.</p>
          <div className="flex items-center gap-6">
            <Link to="/shop" className="hover:text-[#180f0a] transition-colors">Curated Catalog</Link>
            <Link to="/custom-gifts" className="hover:text-[#180f0a] transition-colors">Bespoke Studio</Link>
            <Link to="/order-tracking" className="hover:text-[#180f0a] transition-colors">Track Order</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
