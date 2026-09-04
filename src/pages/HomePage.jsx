import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Heart, Star, Eye, ShoppingBag, Brush, Gift, ShieldCheck } from 'lucide-react';
import BotanicalCanvas from '../components/BotanicalCanvas.jsx';
import ProductCard from '../components/ProductCard.jsx';
import { PRODUCTS } from '../data/products.js';

export default function HomePage() {
  const [bestsellerFilter, setBestsellerFilter] = useState('all');
  const [monogramText, setMonogramText] = useState('For Sarah, with love');
  const [messageText, setMessageText] = useState(
    'May these flowers never fade, just like our quiet and lasting friendship. Happy Spring, darling.'
  );
  const [sealColor, setSealColor] = useState('#964735');

  const filteredBestsellers = PRODUCTS.filter((p) => {
    if (bestsellerFilter === 'all') return p.isBestseller || p.isFeatured;
    return p.category === bestsellerFilter;
  }).slice(0, 4);

  return (
    <div className="w-full">
      {/* 1. HERO SECTION */}
      <section className="relative w-full overflow-hidden bg-gradient-to-b from-[#fcf9f4] via-[#f6f3ee]/50 to-[#fcf9f4] pt-8 pb-16 lg:py-20">
        {/* Ambient Botanical Glow */}
        <div className="absolute -top-24 -left-20 w-96 h-96 rounded-full bg-[#ffdad3]/30 blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-80 h-80 rounded-full bg-[#d8e7cd]/25 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center min-h-[580px]">
            {/* Left Content (7 Cols) */}
            <div className="lg:col-span-7 flex flex-col items-start gap-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ebe8e3] text-[#4e4540] shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#964735] animate-pulse"></span>
                <span className="text-[11px] font-bold uppercase tracking-widest">
                  The Artisanal Gift Atelier · Handcrafted in Small Batches
                </span>
              </div>

              <h1 className="font-serif text-[42px] sm:text-[54px] lg:text-[62px] text-[#180f0a] font-normal tracking-tight leading-[1.1] max-w-2xl">
                Handmade with love. <br />
                <span className="italic font-light text-[#964735]">Made specially</span> for you.
              </h1>

              <p className="text-[16px] sm:text-[18px] text-[#4e4540] max-w-xl leading-relaxed">
                Thoughtfully handcrafted flowers, personalized gifts, and little tactile things made to bring pure delight. Infused with timeless floral alchemy and bespoke devotion.
              </p>

              {/* Action CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-2 w-full sm:w-auto">
                <Link
                  to="/shop"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#180f0a] text-white shadow-md hover:bg-[#964735] hover:-translate-y-0.5 transition-all duration-300 text-[13px] font-semibold tracking-wide"
                >
                  <span>Shop Collection</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/custom-gifts"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#ebe8e3] text-[#1c1c19] hover:bg-[#ffdad3]/50 transition-all duration-300 text-[13px] font-semibold tracking-wide"
                >
                  <Sparkles className="w-4 h-4 text-[#964735]" />
                  <span>Create a Custom Gift</span>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 w-full">
                <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/80 border border-[#e5e2dd] shadow-xs">
                  <div className="w-8 h-8 rounded-full bg-[#d8e7cd] flex items-center justify-center shrink-0">
                    <span className="text-[#081405] text-[16px]">🌿</span>
                  </div>
                  <span className="text-[13px] text-[#1c1c19] font-medium">Handmade with care</span>
                </div>
                <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/80 border border-[#e5e2dd] shadow-xs">
                  <div className="w-8 h-8 rounded-full bg-[#ffdad3] flex items-center justify-center shrink-0">
                    <span className="text-[#964735] text-[16px]">🌸</span>
                  </div>
                  <span className="text-[13px] text-[#1c1c19] font-medium">Everlasting blooms</span>
                </div>
                <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/80 border border-[#e5e2dd] shadow-xs">
                  <div className="w-8 h-8 rounded-full bg-[#ebe8e3] flex items-center justify-center shrink-0">
                    <span className="text-[#180f0a] text-[16px]">💌</span>
                  </div>
                  <span className="text-[13px] text-[#1c1c19] font-medium">Handwritten wax card</span>
                </div>
              </div>
            </div>

            {/* Right Canvas: Botanical 3D Experience (5 Cols) */}
            <div className="lg:col-span-5 relative h-[480px] sm:h-[540px] lg:h-[600px] w-full flex items-center justify-center">
              <div className="relative w-full h-full rounded-3xl overflow-hidden bg-[#f6f3ee] border border-[#e5e2dd] shadow-xl">
                <BotanicalCanvas />
                <div className="absolute bottom-4 left-4 right-4 p-3 rounded-2xl bg-white/90 backdrop-blur-md shadow-md flex items-center justify-between pointer-events-none">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#964735] animate-ping" />
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#1c1c19]">
                      Interactive 3D Flora Atelier
                    </span>
                  </div>
                  <span className="text-[12px] text-[#4e4540] italic">Move cursor to tilt ↺</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CURATED CRAFT COLLECTIONS */}
      <section className="w-full py-16 lg:py-24 bg-[#fcf9f4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div className="max-w-xl space-y-1">
              <p className="text-[11px] uppercase tracking-widest font-bold text-[#964735]">Artisanal Taxonomy</p>
              <h2 className="font-serif text-[32px] sm:text-[40px] text-[#180f0a] tracking-tight font-normal">
                Curated Craft Collections
              </h2>
              <p className="text-[15px] text-[#4e4540]">
                Explore our signature handmade creations sculpted one stem, fiber, and stitch at a time.
              </p>
            </div>
            <Link
              to="/collections"
              className="inline-flex items-center gap-1 text-[13px] font-semibold text-[#180f0a] hover:text-[#964735] transition-colors"
            >
              <span>View all archives</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link
              to="/shop"
              className="group relative rounded-3xl p-6 bg-[#f6f3ee] hover:bg-[#f0ede9] hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-72 overflow-hidden border border-[#e5e2dd]"
            >
              <div className="absolute top-0 right-0 w-44 h-44 rounded-full bg-[#ffdad3]/40 -mr-10 -mt-10 blur-2xl group-hover:scale-125 transition-transform duration-500" />
              <div className="relative z-10 flex items-start justify-between">
                <span className="p-3 rounded-2xl bg-white shadow-sm text-2xl">🌸</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#964735] bg-[#ffdad3] px-3 py-1 rounded-full">
                  Iconic
                </span>
              </div>
              <div className="relative z-10 space-y-1">
                <h3 className="font-serif text-[22px] text-[#180f0a] group-hover:text-[#964735] transition-colors">
                  Flowers & Bouquets
                </h3>
                <p className="text-[13px] text-[#4e4540] leading-relaxed">
                  Everlasting chenille wire & velvet blossoms wrapped in deckled washi paper.
                </p>
                <div className="pt-2 inline-flex items-center gap-1 text-[12px] font-bold text-[#180f0a]">
                  <span>Explore Stems</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>

            <Link
              to="/shop"
              className="group relative rounded-3xl p-6 bg-[#f6f3ee] hover:bg-[#f0ede9] hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-72 overflow-hidden border border-[#e5e2dd]"
            >
              <div className="absolute top-0 right-0 w-44 h-44 rounded-full bg-[#d8e7cd]/40 -mr-10 -mt-10 blur-2xl group-hover:scale-125 transition-transform duration-500" />
              <div className="relative z-10 flex items-start justify-between">
                <span className="p-3 rounded-2xl bg-white shadow-sm text-2xl">💌</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#5b6d54] bg-[#d8e7cd] px-3 py-1 rounded-full">
                  Pressed
                </span>
              </div>
              <div className="relative z-10 space-y-1">
                <h3 className="font-serif text-[22px] text-[#180f0a] group-hover:text-[#964735] transition-colors">
                  Handmade Sentiment Cards
                </h3>
                <p className="text-[13px] text-[#4e4540] leading-relaxed">
                  Pressed botanical paper, custom dip-pen ink & wax seal impressions.
                </p>
                <div className="pt-2 inline-flex items-center gap-1 text-[12px] font-bold text-[#180f0a]">
                  <span>View Stationery</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>

            <Link
              to="/custom-gifts"
              className="group relative rounded-3xl p-6 bg-[#f6f3ee] hover:bg-[#f0ede9] hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-72 overflow-hidden border border-[#e5e2dd]"
            >
              <div className="absolute top-0 right-0 w-44 h-44 rounded-full bg-[#fd9882]/30 -mr-10 -mt-10 blur-2xl group-hover:scale-125 transition-transform duration-500" />
              <div className="relative z-10 flex items-start justify-between">
                <span className="p-3 rounded-2xl bg-white shadow-sm text-2xl">🎁</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#180f0a] bg-[#f1dfd5] px-3 py-1 rounded-full">
                  Bespoke
                </span>
              </div>
              <div className="relative z-10 space-y-1">
                <h3 className="font-serif text-[22px] text-[#180f0a] group-hover:text-[#964735] transition-colors">
                  Custom Keepsake Hampers
                </h3>
                <p className="text-[13px] text-[#4e4540] leading-relaxed">
                  Tailored gift bundles wrapped with French velvet bows and dried flora.
                </p>
                <div className="pt-2 inline-flex items-center gap-1 text-[12px] font-bold text-[#180f0a]">
                  <span>Build A Hamper</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>

            <Link
              to="/shop"
              className="group relative rounded-3xl p-6 bg-[#f6f3ee] hover:bg-[#f0ede9] hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-72 overflow-hidden border border-[#e5e2dd]"
            >
              <div className="relative z-10 flex items-start justify-between">
                <span className="p-3 rounded-2xl bg-white shadow-sm text-2xl">🧸</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#4e4540] bg-[#ebe8e3] px-3 py-1 rounded-full">
                  Fuzzy Charm
                </span>
              </div>
              <div className="relative z-10 space-y-1">
                <h3 className="font-serif text-[22px] text-[#180f0a] group-hover:text-[#964735] transition-colors">
                  Handcrafted Keychains
                </h3>
                <p className="text-[13px] text-[#4e4540] leading-relaxed">
                  Tactile chenille mascots, miniature flower pots, and pocket keepsakes.
                </p>
                <div className="pt-2 inline-flex items-center gap-1 text-[12px] font-bold text-[#180f0a]">
                  <span>Browse Charms</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>

            <Link
              to="/shop"
              className="group relative rounded-3xl p-6 bg-[#f6f3ee] hover:bg-[#f0ede9] hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-72 overflow-hidden border border-[#e5e2dd]"
            >
              <div className="relative z-10 flex items-start justify-between">
                <span className="p-3 rounded-2xl bg-white shadow-sm text-2xl">✨</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#964735] bg-[#ffdad3] px-3 py-1 rounded-full">
                  Foil Touch
                </span>
              </div>
              <div className="relative z-10 space-y-1">
                <h3 className="font-serif text-[22px] text-[#180f0a] group-hover:text-[#964735] transition-colors">
                  Foil Stickers & Botanical Art
                </h3>
                <p className="text-[13px] text-[#4e4540] leading-relaxed">
                  Embossed gold leaf illustrations, archival bookmarks, and vinyl seals.
                </p>
                <div className="pt-2 inline-flex items-center gap-1 text-[12px] font-bold text-[#180f0a]">
                  <span>View Art Prints</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>

            <Link
              to="/collections"
              className="group relative rounded-3xl p-6 bg-[#2e241e] text-white hover:shadow-2xl transition-all duration-300 flex flex-col justify-between h-72 overflow-hidden border border-[#180f0a]"
            >
              <div className="absolute top-0 right-0 w-52 h-52 rounded-full bg-[#964735]/40 -mr-12 -mt-12 blur-3xl group-hover:scale-125 transition-transform duration-500" />
              <div className="relative z-10 flex items-start justify-between">
                <span className="p-3 rounded-2xl bg-[#180f0a] text-2xl">🪔</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#ffdad3] bg-[#964735] px-3 py-1 rounded-full">
                  Seasonal Edition
                </span>
              </div>
              <div className="relative z-10 space-y-1">
                <h3 className="font-serif text-[22px] text-white group-hover:text-[#ffdad3] transition-colors">
                  Festive Keepsakes
                </h3>
                <p className="text-[13px] text-[#d4c3ba] leading-relaxed">
                  Diwali, Mother's Day, and seasonal celebratory milestone creations.
                </p>
                <div className="pt-2 inline-flex items-center gap-1 text-[12px] font-bold text-[#ffdad3]">
                  <span>Explore Limited Drops</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 3. BELOVED CREATIONS (Bestsellers Showcase) */}
      <section className="w-full py-16 lg:py-24 bg-[#f6f3ee] border-t border-[#e5e2dd]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
            <div>
              <div className="inline-flex items-center gap-1 text-[#964735] text-[11px] uppercase font-bold tracking-wider mb-1">
                <Star className="w-3.5 h-3.5 fill-[#964735]" />
                <span>Artisan Atelier Favorites</span>
              </div>
              <h2 className="font-serif text-[32px] sm:text-[40px] text-[#180f0a] tracking-tight font-normal">
                Beloved Creations
              </h2>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-2 flex-wrap">
              {[
                { key: 'all', label: 'All Keepsakes' },
                { key: 'bouquets', label: 'Sculpted Bouquets' },
                { key: 'cards', label: 'Botanical Cards' },
                { key: 'hampers', label: 'Gift Boxes' }
              ].map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setBestsellerFilter(filter.key)}
                  className={`px-4 py-1.5 rounded-full text-[12px] font-semibold transition-all ${
                    bestsellerFilter === filter.key
                      ? 'bg-[#180f0a] text-white shadow-sm'
                      : 'bg-white text-[#4e4540] hover:text-[#180f0a] border border-[#e5e2dd]'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredBestsellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. SIGNATURE CUSTOM GIFT STUDIO PREVIEW */}
      <section className="w-full py-16 lg:py-24 bg-[#fcf9f4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#ffdad3]/50 text-[#964735] text-[11px] font-bold uppercase tracking-wider">
              <Brush className="w-3.5 h-3.5" />
              <span>Bespoke Digital Atelier</span>
            </div>
            <h2 className="font-serif text-[32px] sm:text-[44px] text-[#180f0a] tracking-tight font-normal">
              Create something that is uniquely theirs.
            </h2>
            <p className="text-[15px] text-[#4e4540] leading-relaxed">
              Step into our craft studio. We personalize your heartfelt vision from individual sculpted petals to customized wax-stamped gift tags.
            </p>
          </div>

          {/* 4 Steps */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <div className="p-6 rounded-3xl bg-[#f6f3ee] flex flex-col justify-between space-y-4 border border-[#e5e2dd]">
              <div className="flex items-center justify-between">
                <span className="w-9 h-9 rounded-full bg-[#180f0a] text-white font-serif text-[18px] flex items-center justify-center">1</span>
                <span className="text-2xl">🪴</span>
              </div>
              <div>
                <h3 className="font-serif text-[20px] text-[#180f0a] mb-1 font-medium">Choose Your Base</h3>
                <p className="text-[13px] text-[#4e4540] leading-relaxed">
                  Select from an everlasting bouquet, pine keepsake box, or desktop ceramic pot.
                </p>
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#964735]">4 physical canvases</span>
            </div>

            <div className="p-6 rounded-3xl bg-[#f6f3ee] flex flex-col justify-between space-y-4 border border-[#e5e2dd]">
              <div className="flex items-center justify-between">
                <span className="w-9 h-9 rounded-full bg-[#180f0a] text-white font-serif text-[18px] flex items-center justify-center">2</span>
                <span className="text-2xl">🎨</span>
              </div>
              <div>
                <h3 className="font-serif text-[20px] text-[#180f0a] mb-1 font-medium">Personalize Palette</h3>
                <p className="text-[13px] text-[#4e4540] leading-relaxed">
                  Pick your botanical hues, select silk or velvet ribbons, and draft your custom message.
                </p>
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#964735]">Curated mineral pigments</span>
            </div>

            <div className="p-6 rounded-3xl bg-[#f6f3ee] flex flex-col justify-between space-y-4 border border-[#e5e2dd]">
              <div className="flex items-center justify-between">
                <span className="w-9 h-9 rounded-full bg-[#180f0a] text-white font-serif text-[18px] flex items-center justify-center">3</span>
                <span className="text-2xl">✂️</span>
              </div>
              <div>
                <h3 className="font-serif text-[20px] text-[#180f0a] mb-1 font-medium">We Handcraft</h3>
                <p className="text-[13px] text-[#4e4540] leading-relaxed">
                  Our artisans shape each wire stem and apply pressed dried flora with dedicated care.
                </p>
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#5b6d54]">Takes 2-3 studio days</span>
            </div>

            <div className="p-6 rounded-3xl bg-[#f6f3ee] flex flex-col justify-between space-y-4 border border-[#e5e2dd]">
              <div className="flex items-center justify-between">
                <span className="w-9 h-9 rounded-full bg-[#964735] text-white font-serif text-[18px] flex items-center justify-center">4</span>
                <span className="text-2xl">📦</span>
              </div>
              <div>
                <h3 className="font-serif text-[20px] text-[#180f0a] mb-1 font-medium">You Gift With Joy</h3>
                <p className="text-[13px] text-[#4e4540] leading-relaxed">
                  Packed in rigid boxes, finished with a wax stamp seal, and delivered safely across India.
                </p>
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#964735]">Pan-India dispatch</span>
            </div>
          </div>

          {/* Interactive Live Tag & Card Preview Box */}
          <div className="rounded-3xl bg-[#f6f3ee] p-6 lg:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border border-[#e5e2dd] shadow-sm">
            <div className="lg:col-span-7 space-y-4">
              <span className="text-[11px] uppercase font-bold tracking-widest text-[#964735]">
                Live Atelier Previewer
              </span>
              <h3 className="font-serif text-[26px] sm:text-[32px] text-[#180f0a] tracking-tight font-normal">
                Try Our Instant Gift Note & Wax Seal Customizer
              </h3>
              <p className="text-[14px] text-[#4e4540]">
                Type your message below and watch it render live on our simulated deckled cotton card with your choice of wax seal.
              </p>

              <div className="space-y-3 max-w-lg">
                <div>
                  <label className="block text-[11px] uppercase font-bold text-[#4e4540] mb-1">
                    Envelope Addressee / Recipient
                  </label>
                  <input
                    type="text"
                    value={monogramText}
                    onChange={(e) => setMonogramText(e.target.value)}
                    className="w-full px-4 py-2 rounded-full bg-white text-[14px] text-[#1c1c19] border border-[#e5e2dd] focus:outline-none focus:ring-1 focus:ring-[#180f0a]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase font-bold text-[#4e4540] mb-1">
                    Handwritten Botanical Card Message
                  </label>
                  <textarea
                    rows={3}
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    className="w-full p-3.5 rounded-2xl bg-white text-[14px] text-[#1c1c19] border border-[#e5e2dd] focus:outline-none focus:ring-1 focus:ring-[#180f0a] resize-none"
                  />
                </div>
                <div className="flex items-center gap-3 pt-1">
                  <span className="text-[11px] uppercase font-bold text-[#4e4540]">Wax Seal Color:</span>
                  {[
                    { color: '#964735', label: 'Terracotta' },
                    { color: '#5B6D54', label: 'Sage' },
                    { color: '#B89746', label: 'Burnished Gold' }
                  ].map((s) => (
                    <button
                      key={s.color}
                      type="button"
                      onClick={() => setSealColor(s.color)}
                      style={{ backgroundColor: s.color }}
                      className={`w-6 h-6 rounded-full shadow-sm transition-transform ${
                        sealColor === s.color ? 'ring-2 ring-[#180f0a] scale-110' : 'hover:scale-105'
                      }`}
                      title={s.label}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Simulated Card Presentation */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-sm p-6 rounded-2xl bg-[#faf7f2] shadow-xl border border-[#e5e2dd] rotate-1 hover:rotate-0 transition-transform duration-500">
                {/* Wax Seal */}
                <div
                  style={{ backgroundColor: sealColor }}
                  className="absolute -top-3 -right-3 w-10 h-10 rounded-full shadow-md flex items-center justify-center text-white text-[11px] font-serif font-bold tracking-widest border border-white/30"
                >
                  FA
                </div>
                <div className="space-y-3">
                  <div className="border-b border-[#e5e2dd] pb-2">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#964735]">
                      Deckled Cotton Card
                    </span>
                    <p className="font-serif text-[18px] text-[#180f0a] italic">
                      {monogramText || 'For Someone Special'}
                    </p>
                  </div>
                  <p className="font-serif text-[16px] text-[#1c1c19] leading-relaxed italic pt-1">
                    "{messageText || 'Thinking of you with fond botanical thoughts.'}"
                  </p>
                  <div className="pt-4 flex items-center justify-between text-[10px] text-[#80756f] font-bold uppercase tracking-widest">
                    <span>Hand-inscribed · Flora Alchemy</span>
                    <span>No. FA-2025</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FESTIVAL & SEASONAL SPOTLIGHT */}
      <section className="w-full py-16 lg:py-20 bg-[#180f0a] text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#964735] text-white text-[11px] font-bold uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Limited Seasonal Vault</span>
              </div>
              <h2 className="font-serif text-[36px] sm:text-[48px] text-white tracking-tight leading-tight">
                The Spring Blossom & Keepsake Archive
              </h2>
              <p className="text-[16px] text-[#d4c3ba] max-w-xl leading-relaxed">
                Sculpted from dusty blush chenille velvet and botanical cotton thread. Each limited batch suite is hand-bound with a pressed botanical greeting scroll, wax medallions, and presentation gift boxes.
              </p>
              <div className="pt-2">
                <Link
                  to="/collections"
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#ffdad3] text-[#180f0a] font-semibold text-[13px] hover:bg-white transition-all shadow-md"
                >
                  <span>Explore Seasonal Vault</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-md aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-white/10">
                <img
                  src="/assets/images/flora-asset-25.jpg"
                  alt="Spring Blossom Archive"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-3 left-3 right-3 p-3 rounded-2xl bg-[#180f0a]/80 backdrop-blur-md flex items-center justify-between text-white text-[13px]">
                  <span className="font-medium">Limited Hamper: The Spring Vault</span>
                  <span className="font-bold text-[#ffdad3]">₹3,450</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. ATELIER STORY & GENUINE CRAFTSMANSHIP */}
      <section className="w-full py-16 lg:py-24 bg-[#fcf9f4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-xl aspect-[4/3] border border-[#e5e2dd]">
                <img
                  src="/assets/images/flora-asset-13.jpg"
                  alt="Flora Alchemy Studio Table"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -right-2 sm:right-6 p-4 rounded-2xl bg-white shadow-lg border border-[#e5e2dd] flex items-center gap-3">
                <span className="text-2xl">🌱</span>
                <div>
                  <p className="text-[11px] font-bold uppercase text-[#964735]">Genuine Craft</p>
                  <p className="text-[13px] font-semibold text-[#180f0a]">Handmade in Small Batches</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 space-y-4">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#964735]">
                Our Studio Atelier
              </span>
              <h2 className="font-serif text-[32px] sm:text-[40px] text-[#180f0a] tracking-tight leading-tight font-normal">
                Crafting flowers designed to <span className="italic font-light text-[#964735]">endure</span>.
              </h2>
              <p className="text-[15px] text-[#4e4540] leading-relaxed">
                Flora Alchemy began with a quiet desire for gifts that outlive fleeting moments. Every flower petal is individually shaped from high-density velvet chenille wire, bound with unbleached cotton threads, and accompanied by hand-deckled cards.
              </p>
              <p className="text-[15px] text-[#4e4540] leading-relaxed">
                When you hold our creations, you feel the soft plush texture of velvet wire, the organic deckle of rag paper, and the personal touch of wax seals stamped by hand.
              </p>

              <div className="grid grid-cols-3 gap-3 pt-3">
                <div className="p-3.5 rounded-2xl bg-[#f6f3ee] text-center border border-[#e5e2dd]">
                  <p className="font-serif text-[18px] text-[#180f0a] font-medium">Handmade</p>
                  <p className="text-[11px] text-[#80756f]">Petal-by-petal</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#f6f3ee] text-center border border-[#e5e2dd]">
                  <p className="font-serif text-[18px] text-[#180f0a] font-medium">Personalized</p>
                  <p className="text-[11px] text-[#80756f]">With wax seals</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#f6f3ee] text-center border border-[#e5e2dd]">
                  <p className="font-serif text-[18px] text-[#180f0a] font-medium">Made to Order</p>
                  <p className="text-[11px] text-[#80756f]">Tailored gifting</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FOUR PILLARS */}
      <section className="w-full py-16 bg-[#f6f3ee] border-t border-[#e5e2dd]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12 space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#964735]">The Atelier Creed</span>
            <h2 className="font-serif text-[32px] sm:text-[38px] text-[#180f0a] tracking-tight font-normal">
              Four Pillars of Every Creation
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-3xl bg-white shadow-sm flex flex-col justify-between border border-[#e5e2dd]">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#964735]">01 / Genuine Handcraft</span>
              <h3 className="font-serif text-[20px] text-[#180f0a] my-2 font-medium">Human Touches</h3>
              <p className="text-[13px] text-[#4e4540] leading-relaxed">
                Every stem, leaf twist, and card fold is assembled with patient human touch.
              </p>
            </div>
            <div className="p-6 rounded-3xl bg-white shadow-sm flex flex-col justify-between border border-[#e5e2dd]">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#964735]">02 / Personalization</span>
              <h3 className="font-serif text-[20px] text-[#180f0a] my-2 font-medium">Uniquely Crafted</h3>
              <p className="text-[13px] text-[#4e4540] leading-relaxed">
                Add personalized monogram tags, custom handwritten letters, and tailor color combinations.
              </p>
            </div>
            <div className="p-6 rounded-3xl bg-white shadow-sm flex flex-col justify-between border border-[#e5e2dd]">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#964735]">03 / Tactile Quality</span>
              <h3 className="font-serif text-[20px] text-[#180f0a] my-2 font-medium">Everlasting Materials</h3>
              <p className="text-[13px] text-[#4e4540] leading-relaxed">
                High-density chenille wire, Japanese washi papers, raw silk ribbons, and deckled cotton cards.
              </p>
            </div>
            <div className="p-6 rounded-3xl bg-white shadow-sm flex flex-col justify-between border border-[#e5e2dd]">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#964735]">04 / Thoughtful Joy</span>
              <h3 className="font-serif text-[20px] text-[#180f0a] my-2 font-medium">Enduring Keepsakes</h3>
              <p className="text-[13px] text-[#4e4540] leading-relaxed">
                Crafted to sit on desks, nightstands, and bookshelf nooks for years without wilting.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. WORDS FROM GIFTERS */}
      <section className="w-full py-16 lg:py-24 bg-[#fcf9f4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#964735]">Gifting Inscriptions</span>
              <h2 className="font-serif text-[32px] sm:text-[40px] text-[#180f0a] tracking-tight font-normal">
                Card Messages & Dedicated Sentiments
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-7 rounded-3xl bg-[#f6f3ee] flex flex-col justify-between space-y-4 border border-[#e5e2dd]">
              <span className="text-[11px] uppercase font-bold text-[#964735]">Sisterly Gratitude</span>
              <p className="font-serif text-[18px] text-[#180f0a] italic leading-relaxed">
                "May these dusty rose petals remind you of how deeply you are appreciated, through every season."
              </p>
              <div className="pt-2 border-t border-[#e5e2dd]">
                <p className="text-[13px] font-semibold text-[#180f0a]">Sample Card Dedication</p>
                <p className="text-[12px] text-[#80756f]">Paired with The Dusty Rose Posy</p>
              </div>
            </div>

            <div className="p-7 rounded-3xl bg-[#f6f3ee] flex flex-col justify-between space-y-4 border border-[#e5e2dd]">
              <span className="text-[11px] uppercase font-bold text-[#964735]">Anniversary Milestone</span>
              <p className="font-serif text-[18px] text-[#180f0a] italic leading-relaxed">
                "For ten years of shared laughter, quiet mornings, and blossoms that never lose their warmth."
              </p>
              <div className="pt-2 border-t border-[#e5e2dd]">
                <p className="text-[13px] font-semibold text-[#180f0a]">Sample Card Dedication</p>
                <p className="text-[12px] text-[#80756f]">Paired with Keepsake Wooden Hamper</p>
              </div>
            </div>

            <div className="p-7 rounded-3xl bg-[#f6f3ee] flex flex-col justify-between space-y-4 border border-[#e5e2dd]">
              <span className="text-[11px] uppercase font-bold text-[#964735]">Workplace Desk Cheer</span>
              <p className="font-serif text-[18px] text-[#180f0a] italic leading-relaxed">
                "A joyful desk bloom to keep your workdays calm, bright, and filled with creative energy."
              </p>
              <div className="pt-2 border-t border-[#e5e2dd]">
                <p className="text-[13px] font-semibold text-[#180f0a]">Sample Card Dedication</p>
                <p className="text-[12px] text-[#80756f]">Paired with Desk Bloom Ceramic Pot</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. EMOTIONAL CLOSING CTA */}
      <section className="w-full py-16 lg:py-20 bg-[#ebe8e3] text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#964735]">
            Made For Memories That Last
          </span>
          <h2 className="font-serif text-[36px] sm:text-[46px] text-[#180f0a] tracking-tight font-normal">
            Make someone's ordinary day feel <span className="italic font-light text-[#964735]">extraordinary</span>.
          </h2>
          <p className="text-[16px] text-[#4e4540] max-w-xl mx-auto leading-relaxed">
            Whether it's a silent gesture of gratitude, an anniversary milestone, or just a little something to make them smile today.
          </p>
          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/shop"
              className="px-8 py-3.5 rounded-full bg-[#180f0a] text-white hover:bg-[#964735] transition-all text-[13px] font-semibold shadow-md"
            >
              Shop All Handcrafted Pieces
            </Link>
            <Link
              to="/custom-gifts"
              className="px-8 py-3.5 rounded-full bg-white text-[#180f0a] hover:bg-[#f0ede9] transition-all text-[13px] font-semibold shadow-sm border border-[#e5e2dd]"
            >
              Custom Gift Studio
            </Link>
          </div>
          <p className="text-[12px] text-[#80756f] pt-4">
            Complimentary handwritten botanical card included with orders above ₹1,999.
          </p>
        </div>
      </section>
    </div>
  );
}
