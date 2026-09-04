import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Eye, Camera } from 'lucide-react';
import { PRODUCTS } from '../data/products.js';

export default function OurCreationsPage() {
  const [filter, setFilter] = useState('all');

  const galleryItems = [
    {
      id: 1,
      title: 'Dusty Rose & Lavender Posy in Mulberry Wrap',
      category: 'bouquets',
      tag: 'Double-Stem Velvet Posy',
      image: '/assets/images/flora-asset-26.jpg',
      aspect: 'tall'
    },
    {
      id: 2,
      title: 'Natural Pressed Flora on Deckled Cotton Rag',
      category: 'cards',
      tag: 'Archival Stationery Suite',
      image: '/assets/images/flora-asset-06.jpg',
      aspect: 'wide'
    },
    {
      id: 3,
      title: 'Solid Pine Hamper with Brass Florist Snips',
      category: 'hampers',
      tag: 'Heirloom Hamper Suite',
      image: '/assets/images/flora-asset-11.jpg',
      aspect: 'square'
    },
    {
      id: 4,
      title: 'Speckled Stoneware Pottery with Single Stem',
      category: 'charms',
      tag: 'Desk & Table Bloom',
      image: '/assets/images/flora-asset-09.jpg',
      aspect: 'square'
    },
    {
      id: 5,
      title: 'Hand-Twisted Sunflower Mascot Charm',
      category: 'charms',
      tag: 'Tactile Pocket Keepsake',
      image: '/assets/images/flora-asset-16.jpg',
      aspect: 'tall'
    },
    {
      id: 6,
      title: 'Ceremonial Rakhi with Muga Silk Ribbon',
      category: 'bouquets',
      tag: 'Festive Blossom Set',
      image: '/assets/images/flora-asset-21.jpg',
      aspect: 'wide'
    }
  ];

  const filteredItems = galleryItems.filter((item) => {
    if (filter === 'all') return true;
    return item.category === filter;
  });

  return (
    <div className="w-full bg-[#fcf9f4] min-h-screen py-10 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Title */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ebe8e3] text-[#4e4540] text-[11px] font-bold uppercase tracking-wider">
            <Camera className="w-3.5 h-3.5 text-[#964735]" />
            <span>Visual Portfolio & Craft Chronicle</span>
          </div>
          <h1 className="font-serif text-[38px] sm:text-[48px] text-[#180f0a] tracking-tight font-normal">
            Our Handcrafted Creations
          </h1>
          <p className="text-[15px] text-[#4e4540] leading-relaxed">
            A visual retrospective of bespoke posies, botanical cards, and presentation hampers crafted with human hands.
          </p>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            {[
              { id: 'all', label: 'All Portfolio Works' },
              { id: 'bouquets', label: 'Sculpted Flowers & Posies' },
              { id: 'cards', label: 'Botanical Cards' },
              { id: 'hampers', label: 'Keepsake Hampers' },
              { id: 'charms', label: 'Charms & Vessels' }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-4 py-1.5 rounded-full text-[12px] font-semibold transition-all ${
                  filter === f.id
                    ? 'bg-[#180f0a] text-white shadow-sm'
                    : 'bg-white text-[#4e4540] hover:text-[#180f0a] border border-[#e5e2dd]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group bg-white rounded-3xl overflow-hidden border border-[#e5e2dd] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#f6f3ee]">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full bg-[#180f0a]/80 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider">
                    {item.tag}
                  </span>
                </div>
              </div>

              <div className="p-6 space-y-3">
                <h3 className="font-serif text-[20px] text-[#180f0a] leading-snug font-medium">
                  {item.title}
                </h3>
                <div className="flex items-center justify-between pt-2 border-t border-[#e5e2dd]">
                  <Link
                    to="/shop"
                    className="text-[12px] font-bold text-[#964735] hover:underline flex items-center gap-1"
                  >
                    <span>Request Similar Piece</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <span className="text-[11px] text-[#80756f]">Atelier Edition</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center space-y-4 max-w-xl mx-auto">
          <h3 className="font-serif text-[28px] text-[#180f0a]">Have a distinct vision in mind?</h3>
          <p className="text-[14px] text-[#4e4540]">
            We frequently craft bespoke bridal suites, anniversary posies, and corporate brand gifting.
          </p>
          <div className="pt-2">
            <Link
              to="/custom-gifts"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#180f0a] text-white hover:bg-[#964735] transition-colors text-[13px] font-semibold shadow-md"
            >
              <Sparkles className="w-4 h-4" />
              <span>Design Your Custom Piece</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
