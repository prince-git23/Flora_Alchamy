import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Filter } from 'lucide-react';

const CATEGORIES = ['All', 'Bouquets', 'Cards', 'Keepsakes', 'Custom Creations', 'Behind the Scenes'];

const CREATIONS = [
  {
    id: 1,
    title: 'The Pressed Botanical Wildflower Card',
    category: 'Cards',
    image: '/assets/images/flora-asset-06.jpg',
    excerpt: 'Hand-pressed wildflower petals set into deckled mulberry bark — a card that becomes a keepsake.',
    relatedProduct: 'pressed-botanical-wildflower-card',
  },
  {
    id: 2,
    title: 'Lavender & Dusty Rose Posy',
    category: 'Bouquets',
    image: '/assets/images/flora-asset-03.jpg',
    excerpt: 'Our signature everlasting posy in a harmonizing lavender and dusty rose palette.',
    relatedProduct: null,
  },
  {
    id: 3,
    title: 'Solid Pine Sliding Hamper',
    category: 'Keepsakes',
    image: '/assets/images/flora-asset-11.jpg',
    excerpt: 'A hand-finished pine casket containing brass shears, a botanical card, and a forever posy.',
    relatedProduct: 'solid-pine-sliding-hamper',
  },
  {
    id: 4,
    title: 'Custom Anniversary Gift — The Refined Collection',
    category: 'Custom Creations',
    image: '/assets/images/flora-asset-21.jpg',
    excerpt: 'A bespoke arrangement built around the couple\'s favourite colours and shared memories.',
    relatedProduct: null,
  },
  {
    id: 5,
    title: 'The Chenille Sunflower Mascot',
    category: 'Keepsakes',
    image: '/assets/images/flora-asset-16.jpg',
    excerpt: 'A cheerful handmade sunflower mascot — equal parts decoration and companion.',
    relatedProduct: 'chenille-sunflower-mascot',
  },
  {
    id: 6,
    title: 'Behind the Scenes — Petal Shaping',
    category: 'Behind the Scenes',
    image: '/assets/images/flora-asset-26.jpg',
    excerpt: 'Every petal is individually twisted and shaped by hand. Here\'s a glimpse at the process.',
    relatedProduct: null,
  },
  {
    id: 7,
    title: 'Artisan Speckled Ceramic Vessel',
    category: 'Keepsakes',
    image: '/assets/images/flora-asset-09.jpg',
    excerpt: 'Hand-thrown stoneware pottery with natural moss bedding — functional art for your home.',
    relatedProduct: 'artisan-speckled-ceramic-vessel',
  },
  {
    id: 8,
    title: 'Heirloom Brass Shears',
    category: 'Keepsakes',
    image: '/assets/images/flora-asset-06.jpg',
    excerpt: 'Vintage-inspired brass garden shears — a functional keepsake for the plant lover.',
    relatedProduct: 'heirloom-brass-shears',
  },
];

export default function FloraJournalPage() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = activeCategory === 'All'
    ? CREATIONS
    : CREATIONS.filter((c) => c.category === activeCategory);

  return (
    <div className="w-full bg-[#fcf9f4] min-h-screen py-8 lg:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#d8e7cd]/50 text-[#5b6d54] text-[11px] font-bold uppercase tracking-wider">
            <Filter className="w-3.5 h-3.5" />
            <span>Our Creations</span>
          </div>
          <h1 className="font-serif text-[34px] sm:text-[44px] text-[#180f0a] tracking-tight">The Flora Journal</h1>
          <p className="text-[15px] text-[#4e4540] leading-relaxed">
            Stories behind the arrangements — the materials, the makers, and the moments they're made for.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-8 justify-start lg:justify-center">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 px-4 py-2 rounded-full border text-[12px] font-semibold transition-all ${
                activeCategory === cat
                  ? 'bg-[#180f0a] text-white border-[#180f0a]'
                  : 'bg-white text-[#4e4540] border-[#e5e2dd] hover:border-[#80756f]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Creations Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((creation) => (
            <article key={creation.id} className="group bg-white rounded-2xl border border-[#e5e2dd] overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-[4/3] overflow-hidden bg-[#f6f3ee]">
                <img
                  loading="lazy"
                  decoding="async"
                  src={creation.image}
                  alt={creation.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#964735] bg-[#ffdad3]/40 px-2 py-0.5 rounded-full">
                    {creation.category}
                  </span>
                </div>
                <h3 className="font-serif text-[18px] text-[#180f0a] leading-tight">{creation.title}</h3>
                <p className="text-[13px] text-[#4e4540] leading-relaxed">{creation.excerpt}</p>
                {creation.relatedProduct ? (
                  <Link
                    to={`/product/${creation.relatedProduct}`}
                    className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#964735] hover:underline mt-2"
                  >
                    View Product <ArrowRight className="w-3 h-3" />
                  </Link>
                ) : (
                  <Link
                    to="/custom-gifts"
                    className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#964735] hover:underline mt-2"
                  >
                    Create Something Similar <ArrowRight className="w-3 h-3" />
                  </Link>
                )}
              </div>
            </article>
          ))}
        </div>

        {/* Empty State */}
        {filtered.length === 0 && (
          <div className="text-center py-16 space-y-4">
            <p className="text-[15px] text-[#80756f]">No creations in this category yet.</p>
            <button
              type="button"
              onClick={() => setActiveCategory('All')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#e5e2dd] text-[13px] font-semibold text-[#180f0a] hover:bg-[#f6f3ee] transition-colors"
            >
              View All Creations
            </button>
          </div>
        )}

        {/* CTA */}
        <div className="text-center mt-16 space-y-4">
          <h2 className="font-serif text-[28px] text-[#180f0a]">Inspired?</h2>
          <p className="text-[14px] text-[#4e4540]">Build your own creation or explore the full collection.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/custom-gifts"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#180f0a] text-white text-[13px] font-semibold hover:bg-[#964735] transition-colors shadow-md"
            >
              Build a Custom Gift
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#e5e2dd] text-[#180f0a] text-[13px] font-semibold hover:bg-[#f6f3ee] transition-colors"
            >
              Browse All Gifts
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
