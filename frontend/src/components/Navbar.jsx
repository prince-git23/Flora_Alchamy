import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Heart, ShoppingBag, User, Menu, X, ChevronDown, Gift, Sparkles, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext.jsx';
import { getActiveCustomer } from '../services/customerService.js';
import SearchOverlay from './SearchOverlay.jsx';
import NotificationBell from './NotificationBell.jsx';

const SHOP_ITEMS = [
  { label: 'All Gifts', to: '/shop' },
  { label: 'Flowers & Bouquets', to: '/shop?category=bouquets' },
  { label: 'Handmade Cards', to: '/shop?category=cards' },
  { label: 'Charms & Keepsakes', to: '/shop?category=charms' },
  { label: 'Hampers', to: '/shop?category=hampers' },
  { label: 'Custom Gifts', to: '/custom-gifts' },
];

/**
 * Accessible desktop dropdown.
 *
 * Interaction model:
 *  — Hover opens (with gap-safe bridge so moving trigger→dropdown stays open).
 *  — Click toggles and "pins" the dropdown (mouse-leave does NOT close it).
 *  — Escape, outside click, or route change always closes.
 *  — Arrow keys navigate items; Home/End jump to first/last.
 */
function NavMenu({ label, items, isActive, variant = 'list' }) {
  const [open, setOpen] = useState(false);
  const [pinned, setPinned] = useState(false);
  const containerRef = useRef(null);
  const triggerRef = useRef(null);
  const menuRef = useRef(null);
  const leaveTimer = useRef(null);
  const itemRefs = useRef([]);

  useEffect(() => {
    if (!open) return undefined;
    const onDocClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
        setPinned(false);
      }
    };
    const onDocKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false);
        setPinned(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onDocKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onDocKey);
    };
  }, [open]);

  const handleMouseEnter = () => {
    clearTimeout(leaveTimer.current);
    leaveTimer.current = null;
    setOpen(true);
  };

  const handleMouseLeave = () => {
    if (pinned) return;
    leaveTimer.current = setTimeout(() => {
      setOpen(false);
      leaveTimer.current = null;
    }, 150);
  };

  useEffect(() => () => clearTimeout(leaveTimer.current), []);

  const handleTriggerClick = () => {
    if (open && pinned) {
      setOpen(false);
      setPinned(false);
    } else {
      setOpen(true);
      setPinned(true);
      clearTimeout(leaveTimer.current);
      leaveTimer.current = null;
    }
  };

  const handleMenuKeyDown = (e) => {
    const count = items.length;
    if (!count) return;
    const focused = document.activeElement;
    const idx = itemRefs.current.indexOf(focused);
    let next = -1;
    if (e.key === 'ArrowDown') { e.preventDefault(); next = idx < count - 1 ? idx + 1 : 0; }
    else if (e.key === 'ArrowUp') { e.preventDefault(); next = idx > 0 ? idx - 1 : count - 1; }
    else if (e.key === 'Home') { e.preventDefault(); next = 0; }
    else if (e.key === 'End') { e.preventDefault(); next = count - 1; }
    else if (e.key === 'Tab') { setOpen(false); setPinned(false); return; }
    if (next >= 0 && itemRefs.current[next]) itemRefs.current[next].focus();
  };

  return (
    <div ref={containerRef} className="relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={handleTriggerClick}
        onKeyDown={(e) => { if (e.key === 'ArrowDown' && open) { e.preventDefault(); itemRefs.current[0]?.focus(); } }}
        className={`flex items-center gap-1 px-4 py-2 rounded-full text-[13px] font-semibold tracking-wide transition-all duration-200 ${
          isActive ? 'bg-[#ebe8e3] text-[#1c1c19]' : 'text-[#4e4540] hover:text-[#1c1c19] hover:bg-[#f0ede9]'
        }`}
      >
        {label}
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>

      {open && (
        <div
          ref={menuRef}
          role="menu"
          aria-label={label}
          onKeyDown={handleMenuKeyDown}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="absolute left-0 top-full pt-2 bg-white rounded-2xl shadow-xl border border-[#e5e2dd] p-2 z-50 opacity-0 animate-[fadeIn_0.15s_ease-out_forwards]"
          style={{ animation: 'fadeIn 0.15s ease-out forwards' }}
        >
          <div className={variant === 'grid' ? 'grid grid-cols-2 gap-1' : 'flex flex-col'}>
            {items.map((item, i) => (
              <Link
                key={item.to + item.label}
                ref={(el) => { itemRefs.current[i] = el; }}
                to={item.to}
                role="menuitem"
                tabIndex={-1}
                onClick={() => { setOpen(false); setPinned(false); }}
                className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-[13px] font-medium text-[#4e4540] hover:text-[#180f0a] hover:bg-[#f6f3ee] focus:bg-[#f6f3ee] focus:text-[#180f0a] focus:outline-none transition-colors"
              >
                {item.icon && <span aria-hidden="true">{item.icon}</span>}
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const location = useLocation();
  const { cartCount, cartSubtotal, wishlist } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const activeCustomer = getActiveCustomer();
  const isAuthed = !!activeCustomer;

  const isActive = (path) => {
    const base = path.split('?')[0];
    if (base === '/' && location.pathname === '/') return true;
    if (base !== '/' && location.pathname.startsWith(base)) return true;
    return false;
  };

  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
  }, [location.pathname, location.search]);

  // Scroll compression: shrink navbar on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && String(e.key).toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const utilityButton = 'relative flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#f0ede9] text-[#4e4540] hover:text-[#1c1c19] hover:bg-[#ebe8e3] transition-all duration-200';

  return (
    <>
      <header
        className={`sticky top-0 left-0 right-0 w-full z-50 transition-all duration-300 border-b border-[#e5e2dd] ${
          scrolled
            ? 'bg-[#fcf9f4]/95 backdrop-blur-xl shadow-[0_2px_20px_rgba(0,0,0,0.06)]'
            : 'bg-[#fcf9f4]/90 backdrop-blur-md shadow-[0_1px_8px_rgba(0,0,0,0.03)]'
        }`}
      >
        <div className={`transition-all duration-300 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 ${
          scrolled ? 'h-16' : 'h-20'
        }`}>
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group shrink-0" aria-label="Flora Alchemy home">
            <img
              loading="lazy"
              decoding="async"
              src="/assets/images/flora-asset-27.jpg"
              alt=""
              className="w-auto object-contain transition-all duration-300 group-hover:scale-105"
              style={{ height: scrolled ? '24px' : '32px' }}
            />
            <span className={`font-serif tracking-tight font-medium text-[#180f0a] group-hover:text-[#964735] transition-all duration-300 ${
              scrolled ? 'text-[18px]' : 'text-[22px]'
            }`}>
              Flora Alchemy
            </span>
          </Link>

          {/* Desktop Main Navigation */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Main">
            <NavMenu label="Shop" items={SHOP_ITEMS} isActive={isActive('/shop')} />
            <Link
              to="/custom-gifts"
              className={`px-4 py-2 rounded-full text-[13px] font-semibold tracking-wide transition-all duration-200 ${
                isActive('/custom-gifts') ? 'bg-[#ebe8e3] text-[#1c1c19]' : 'text-[#4e4540] hover:text-[#1c1c19] hover:bg-[#f0ede9]'
              }`}
            >
              Custom Gifts
            </Link>
            <Link
              to="/gift-finder"
              className={`px-4 py-2 rounded-full text-[13px] font-semibold tracking-wide transition-all duration-200 ${
                isActive('/gift-finder') ? 'bg-[#ebe8e3] text-[#1c1c19]' : 'text-[#4e4540] hover:text-[#1c1c19] hover:bg-[#f0ede9]'
              }`}
            >
              Gift Finder
            </Link>
            <NavMenu
              label="Our Story"
              items={[
                { label: 'Our Story', to: '/our-story' },
                { label: "How It's Made", to: '/how-its-made' },
                { label: 'Our Creations', to: '/our-creations' },
              ]}
              isActive={isActive('/our-story') || isActive('/how-its-made') || isActive('/our-creations')}
            />
          </nav>

          {/* Action Utilities */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className={utilityButton}
              title="Search Flora Alchemy"
              aria-label="Search Flora Alchemy"
            >
              <Search className="w-4 h-4 text-[#4e4540]" aria-hidden="true" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#4e4540]/80 hidden sm:inline">⌘K</span>
            </button>

            <NotificationBell />

            <Link
              to="/wishlist"
              className="relative p-2 rounded-full hover:bg-[#f0ede9] text-[#4e4540] hover:text-[#1c1c19] transition-all duration-200 flex items-center justify-center"
              title="Saved Gifts"
              aria-label="Saved Gifts"
            >
              <Heart className={`w-5 h-5 ${wishlist.length > 0 ? 'text-[#964735]' : 'text-[#4e4540]'}`} aria-hidden="true" />
              {wishlist.length > 0 && (
                <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-[#964735] text-white rounded-full text-[9px] font-bold flex items-center justify-center leading-none">
                  {wishlist.length}
                </span>
              )}
            </Link>

            <Link
              to="/cart"
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f0ede9] hover:bg-[#ebe8e3] text-[#1c1c19] transition-all duration-200"
              title="Shopping Bag"
              aria-label={`Shopping Bag, ${cartCount} items`}
            >
              <ShoppingBag className="w-4 h-4 text-[#180f0a]" aria-hidden="true" />
              <span className="text-[12px] font-semibold whitespace-nowrap">
                {cartCount} · ₹{cartSubtotal.toLocaleString('en-IN')}
              </span>
            </Link>

            <Link
              to={isAuthed ? '/account' : '/login'}
              className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-full bg-[#180f0a] hover:bg-[#964735] text-white transition-all duration-200"
              title={isAuthed ? 'My Account' : 'Sign In'}
            >
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white/15 text-[11px] font-bold">
                {isAuthed ? (activeCustomer.name || 'A').charAt(0).toUpperCase() : <User className="w-3.5 h-3.5" />}
              </span>
              <span className="text-[11px] font-semibold hidden sm:inline">
                {isAuthed ? 'My Account' : 'Sign In'}
              </span>
            </Link>

            <button
              type="button"
              className="lg:hidden p-2 rounded-full hover:bg-[#f0ede9] text-[#1c1c19]"
              onClick={() => setMobileMenuOpen((o) => !o)}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#fcf9f4] border-b border-[#e5e2dd] max-h-[calc(100vh-5rem)] overflow-y-auto shadow-lg">
            <div className="px-5 py-5 space-y-6">
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => { setMobileMenuOpen(false); setSearchOpen(true); }}
                  className="flex flex-col items-center gap-1.5 py-3 rounded-2xl bg-white border border-[#e5e2dd] text-[11px] font-semibold text-[#4e4540]"
                >
                  <Search className="w-4 h-4" aria-hidden="true" /> Search
                </button>
                <Link
                  to="/wishlist"
                  className="flex flex-col items-center gap-1.5 py-3 rounded-2xl bg-white border border-[#e5e2dd] text-[11px] font-semibold text-[#4e4540]"
                >
                  <Heart className="w-4 h-4" aria-hidden="true" /> Saved {wishlist.length > 0 ? `(${wishlist.length})` : ''}
                </Link>
                <Link
                  to="/cart"
                  className="flex flex-col items-center gap-1.5 py-3 rounded-2xl bg-white border border-[#e5e2dd] text-[11px] font-semibold text-[#4e4540]"
                >
                  <ShoppingBag className="w-4 h-4" aria-hidden="true" /> Bag ({cartCount})
                </Link>
              </div>

              <div className="space-y-2">
                <p className="text-[11px] uppercase font-bold tracking-widest text-[#80756f]">Shop</p>
                <div className="grid grid-cols-2 gap-1.5">
                  {SHOP_ITEMS.map((item) => (
                    <Link
                      key={item.to + item.label}
                      to={item.to}
                      className="px-3.5 py-2.5 rounded-xl bg-white border border-[#e5e2dd] text-[13px] font-medium text-[#4e4540]"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-[11px] uppercase font-bold tracking-widest text-[#80756f]">Gifting</p>
                <Link
                  to="/gift-finder"
                  className="flex items-center justify-between p-4 rounded-2xl bg-[#180f0a] text-white"
                >
                  <span className="flex items-center gap-2 text-[13px] font-semibold">
                    <Gift className="w-4 h-4" aria-hidden="true" /> Gift Finder
                  </span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
                <Link
                  to="/custom-gifts"
                  className="flex items-center justify-between p-4 rounded-2xl bg-white border border-[#e5e2dd] text-[#180f0a]"
                >
                  <span className="flex items-center gap-2 text-[13px] font-semibold">
                    <Sparkles className="w-4 h-4 text-[#964735]" aria-hidden="true" /> Custom Gift Studio
                  </span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </div>

              <div className="space-y-2">
                <p className="text-[11px] uppercase font-bold tracking-widest text-[#80756f]">Explore</p>
                <div className="flex flex-col gap-1.5">
                  <Link to="/collections" className="px-3.5 py-2.5 rounded-xl text-[13px] font-medium text-[#4e4540] hover:bg-[#f0ede9]">
                    Curated Collections
                  </Link>
                  <Link to="/our-story" className="px-3.5 py-2.5 rounded-xl text-[13px] font-medium text-[#4e4540] hover:bg-[#f0ede9]">
                    Our Story
                  </Link>
                  <Link to="/how-its-made" className="px-3.5 py-2.5 rounded-xl text-[13px] font-medium text-[#4e4540] hover:bg-[#f0ede9]">
                    How It&apos;s Made
                  </Link>
                  <Link to="/our-creations" className="px-3.5 py-2.5 rounded-xl text-[13px] font-medium text-[#4e4540] hover:bg-[#f0ede9]">
                    Our Creations
                  </Link>
                  <Link to="/custom-request" className="px-3.5 py-2.5 rounded-xl text-[13px] font-medium text-[#964735] hover:bg-[#f0ede9]">
                    Request a Custom Creation
                  </Link>
                </div>
              </div>

              <div className="pt-3 border-t border-[#e5e2dd]">
                <Link
                  to={isAuthed ? '/account' : '/login'}
                  className="text-[13px] font-semibold text-[#964735] flex items-center gap-1.5"
                >
                  <User className="w-4 h-4" aria-hidden="true" />
                  <span>{isAuthed ? `My Account${activeCustomer ? ` (${activeCustomer.name})` : ''}` : 'Sign In / Create Account'}</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Global keyframe for dropdown fade-in */}
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </>
  );
}
