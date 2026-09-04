import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, BookOpen } from 'lucide-react';
import { PRODUCTS } from '../data/products.js';

export default function CollectionsPage() {
  const collections = [
    {
      id: 'spring-archive',
      title: 'The Spring & Mother\'s Day Archive',
      subtitle: 'Soft blush peonies, wild lavender spires, and deckled cotton cards.',
      image: '/assets/images/flora-asset-14.jpg',
      category: 'bouquets',
      pieceCount: '6 Handcrafted Editions',
      badge: 'Current Archive'
    },
    {
      id: 'keepsake-hampers',
      title: 'Heirloom Casket & Hamper Suites',
      subtitle: 'Solid pine sliding boxes, brass florist shears, and organic wax seals.',
      image: '/assets/images/flora-asset-11.jpg',
      category: 'hampers',
      pieceCount: '4 Bespoke Suites',
      badge: 'Bespoke Craft'
    },
    {
      id: 'desk-sanctuary',
      title: 'Desk & Vessel Sanctuary',
      subtitle: 'Speckled stoneware ceramics, single flower stems, and pocket mascots.',
      image: '/assets/images/flora-asset-09.jpg',
      category: 'charms',
      pieceCount: '8 Minimalist Pieces',
      badge: 'Evergreen'
    },
    {
      id: 'botanical-stationery',
      title: 'Deckled Botanical Papercraft & Seals',
      subtitle: 'Archival 350 GSM cotton rag cards with pressed larkspur and beeswax seals.',
      image: '/assets/images/flora-asset-06.jpg',
      category: 'cards',
      pieceCount: '5 Stationery Suites',
      badge: 'Archival Press'
    }
  ];

  return (
    <div className="w-full bg-[#fcf9f4] min-h-screen py-10 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title Header */}
        <div className="space-y-2 mb-12">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#964735]"></span>
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#964735]">
              Curated Thematic Archives
            </span>
          </div>
          <h1 className="font-serif text-[38px] sm:text-[48px] text-[#180f0a] tracking-tight font-normal">
            Seasonal & Occasion Collections
          </h1>
          <p className="text-[15px] text-[#4e4540] max-w-2xl leading-relaxed">
            Carefully curated groupings of handcrafted florals, stationery, and personalized vessels gathered for meaningful life rituals.
          </p>
        </div>

        {/* Collections List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {collections.map((col) => (
            <div
              key={col.id}
              className="group bg-white rounded-3xl overflow-hidden border border-[#e5e2dd] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#f6f3ee]">
                <img
                  src={col.image}
                  alt={col.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[#180f0a] text-[11px] font-bold uppercase tracking-wider shadow-sm">
                    {col.badge}
                  </span>
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <span className="text-[11px] uppercase font-bold tracking-widest text-[#80756f]">
                    {col.pieceCount}
                  </span>
                  <h2 className="font-serif text-[26px] text-[#180f0a] font-normal leading-snug group-hover:text-[#964735] transition-colors">
                    {col.title}
                  </h2>
                  <p className="text-[14px] text-[#4e4540] leading-relaxed">
                    {col.subtitle}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#e5e2dd] flex items-center justify-between">
                  <Link
                    to={`/shop?category=${col.category}`}
                    className="inline-flex items-center gap-2 text-[13px] font-bold text-[#180f0a] group-hover:text-[#964735] transition-colors"
                  >
                    <span>View Handcrafted Editions</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bespoke Inquiry Banner */}
        <div className="mt-16 rounded-3xl bg-[#180f0a] text-white p-8 sm:p-12 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="text-[11px] uppercase font-bold tracking-widest text-[#ffdad3]">
              Bespoke Bridal & Milestone Suites
            </span>
            <h3 className="font-serif text-[30px] sm:text-[36px] font-normal">
              Planning a wedding, event, or private keepsake drop?
            </h3>
            <p className="text-[14px] text-[#d4c3ba] leading-relaxed">
              We handcraft custom wedding favors, everlasting bridal posies, and bespoke family keepsake suites.
            </p>
          </div>
          <Link
            to="/custom-gifts"
            className="px-8 py-3.5 rounded-full bg-[#ffdad3] text-[#180f0a] hover:bg-white text-[13px] font-semibold transition-all shrink-0 shadow-md"
          >
            Enter Custom Studio
          </Link>
        </div>
      </div>
    </div>
  );
}
