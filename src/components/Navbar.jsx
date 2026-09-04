import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Heart, ShoppingBag, User, Menu, X } from 'lucide-react';
import { useStore } from '../context/StoreContext.jsx';

export default function Navbar() {
  const location = useLocation();
  const { cartCount, cartSubtotal, wishlist } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Shop', path: '/shop' },
    { label: 'Custom Gifts', path: '/custom-gifts' },
    { label: 'Collections', path: '/collections' },
    { label: 'Our Creations', path: '/our-creations' }
  ];

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 left-0 right-0 w-full z-50 bg-[#fcf9f4]/90 backdrop-blur-md border-b border-[#e5e2dd] shadow-[0_1px_8px_rgba(0,0,0,0.03)]">
      <div className="h-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src="/assets/images/flora-asset-27.jpg"
              alt="Flora Alchemy Emblem"
              className="h-8 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
            <span className="font-serif text-[22px] tracking-tight font-medium text-[#180f0a] group-hover:text-[#964735] transition-colors">
              Flora Alchemy
            </span>
          </Link>
        </div>

        {/* Desktop Main Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-4 py-2 rounded-full text-[13px] font-semibold tracking-wide transition-all ${
                isActive(link.path)
                  ? 'bg-[#ebe8e3] text-[#1c1c19]'
                  : 'text-[#4e4540] hover:text-[#1c1c19] hover:bg-[#f0ede9]'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Action Utilities */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Search Button */}
          <Link
            to="/search"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#f0ede9] text-[#4e4540] hover:text-[#1c1c19] hover:bg-[#ebe8e3] transition-colors"
            title="Search catalog"
          >
            <Search className="w-4 h-4 text-[#4e4540]" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#4e4540]/80 hidden sm:inline">⌘K</span>
          </Link>

          {/* Wishlist Button */}
          <Link
            to="/wishlist"
            className="relative p-2 rounded-full hover:bg-[#f0ede9] text-[#4e4540] hover:text-[#1c1c19] transition-all flex items-center justify-center"
            title="Wishlist"
          >
            <Heart className={`w-5 h-5 ${wishlist.length > 0 ? 'text-[#964735]' : 'text-[#4e4540]'}`} />
            {wishlist.length > 0 && (
              <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-[#964735] text-white rounded-full text-[9px] font-bold flex items-center justify-center leading-none">
                {wishlist.length}
              </span>
            )}
          </Link>

          {/* Shopping Bag Button */}
          <Link
            to="/cart"
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f0ede9] hover:bg-[#ebe8e3] text-[#1c1c19] transition-colors"
            title="Shopping Bag"
          >
            <ShoppingBag className="w-4 h-4 text-[#180f0a]" />
            <span className="text-[12px] font-semibold whitespace-nowrap">
              {cartCount} · ₹{cartSubtotal.toLocaleString('en-IN')}
            </span>
          </Link>

          {/* Account Button */}
          <Link
            to="/account"
            className="flex items-center justify-center w-8 h-8 rounded-full bg-[#180f0a] hover:bg-[#964735] text-white transition-colors"
            title="Customer Account"
          >
            <User className="w-4 h-4 text-white" />
          </Link>

          {/* Mobile Menu Hamburger */}
          <button
            type="button"
            className="lg:hidden p-2 rounded-full hover:bg-[#f0ede9] text-[#1c1c19]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#fcf9f4] border-b border-[#e5e2dd] px-6 py-4 space-y-2 shadow-lg">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-2.5 rounded-xl text-[14px] font-semibold ${
                isActive(link.path)
                  ? 'bg-[#ebe8e3] text-[#1c1c19]'
                  : 'text-[#4e4540] hover:bg-[#f0ede9]'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-[#e5e2dd] flex items-center justify-between">
            <Link
              to="/account"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[13px] font-semibold text-[#964735] flex items-center gap-1.5"
            >
              <User className="w-4 h-4" />
              <span>Customer Account</span>
            </Link>
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[13px] font-semibold text-[#4e4540] hover:text-[#180f0a]"
            >
              Sign In / Register
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
