import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, Heart, ShoppingBag, ShieldCheck, Truck, RefreshCw, Sparkles, ChevronRight, Check } from 'lucide-react';
import { getProductById } from '../services/api.js';
import { PRODUCTS } from '../data/products.js';
import { useStore } from '../context/StoreContext.jsx';
import ProductCard from '../components/ProductCard.jsx';

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItemToCart, toggleWishlist, isWishlisted } = useStore();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedPalette, setSelectedPalette] = useState(null);
  const [selectedRibbon, setSelectedRibbon] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [giftMessage, setGiftMessage] = useState('');
  const [activeTab, setActiveTab] = useState('craft');

  useEffect(() => {
    async function load() {
      const found = await getProductById(id);
      if (found) {
        setProduct(found);
        setSelectedImage(0);
        setSelectedPalette(found.palettes && found.palettes.length > 0 ? found.palettes[0].name : null);
        setSelectedRibbon(found.ribbons && found.ribbons.length > 0 ? found.ribbons[0].name : null);
      } else {
        // Fallback to first product if not found
        setProduct(PRODUCTS[0]);
      }
    }
    load();
    window.scrollTo(0, 0);
  }, [id]);

  if (!product) {
    return (
      <div className="w-full min-h-[60vh] flex items-center justify-center bg-[#fcf9f4]">
        <div className="text-center space-y-3">
          <p className="font-serif text-[24px] text-[#180f0a]">Locating Botanical Keepsake...</p>
        </div>
      </div>
    );
  }

  const wishlisted = isWishlisted(product.id);

  const handleAddToCart = () => {
    addItemToCart(product, {
      quantity,
      palette: selectedPalette,
      ribbon: selectedRibbon,
      giftMessage: giftMessage.trim() || undefined
    });
  };

  const relatedProducts = PRODUCTS.filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <div className="w-full bg-[#fcf9f4] min-h-screen py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-[12px] text-[#80756f] mb-8 font-medium">
          <Link to="/" className="hover:text-[#180f0a] transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/shop" className="hover:text-[#180f0a] transition-colors">Shop</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#180f0a] truncate">{product.name}</span>
        </nav>

        {/* Product Hero Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Gallery Col (6 Cols) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-white shadow-sm border border-[#e5e2dd]">
              <img
                src={product.images ? product.images[selectedImage] : (product.image || '')}
                alt={product.name}
                className="w-full h-full object-cover transition-all duration-300"
              />
              {product.badge && (
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full bg-[#964735] text-white text-[11px] font-bold uppercase tracking-wider shadow-sm">
                    {product.badge}
                  </span>
                </div>
              )}
            </div>

            {/* Gallery Thumbnail Strips */}
            {product.images && product.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
                {product.images.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    type="button"
                    className={`relative w-20 h-20 rounded-2xl overflow-hidden bg-white border-2 transition-all shrink-0 ${
                      selectedImage === idx ? 'border-[#964735] ring-2 ring-[#ffdad3]' : 'border-[#e5e2dd] opacity-75 hover:opacity-100'
                    }`}
                  >
                    <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Atelier Craftsmanship Stamp */}
            <div className="p-4 rounded-2xl bg-[#f6f3ee] border border-[#e5e2dd] flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[#180f0a] text-white flex items-center justify-center font-serif text-[18px]">
                FA
              </div>
              <div className="text-[13px] text-[#4e4540]">
                <p className="font-semibold text-[#180f0a]">Handmade in Small Batches</p>
                <p>{product.craftTime || 'Hand-sculpted chenille wire armature'}</p>
              </div>
            </div>
          </div>

          {/* Config & Buy Col (6 Cols) */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase font-bold tracking-widest text-[#964735]">
                  {product.categoryLabel || 'Handcrafted Flora'}
                </span>
                {product.rating && (
                  <div className="flex items-center gap-1.5 text-[#964735] text-[13px] font-semibold">
                    <Star className="w-4 h-4 fill-[#964735]" />
                    <span>{product.rating}</span>
                    <span className="text-[#80756f] font-normal text-[12px]">· Studio Rating</span>
                  </div>
                )}
              </div>

              <h1 className="font-serif text-[32px] sm:text-[40px] text-[#180f0a] font-normal leading-tight tracking-tight">
                {product.name}
              </h1>

              <div className="flex items-baseline gap-3 pt-1">
                <span className="text-[28px] font-bold text-[#180f0a]">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {product.originalPrice && (
                  <span className="text-[16px] text-[#80756f] line-through">
                    ₹{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
                <span className="text-[11px] uppercase font-bold text-[#5b6d54] bg-[#d8e7cd] px-2.5 py-0.5 rounded-full">
                  All Taxes Included
                </span>
              </div>

              <p className="text-[15px] text-[#4e4540] leading-relaxed pt-2">
                {product.description}
              </p>
            </div>

            {/* Custom Palette Selection */}
            {product.palettes && product.palettes.length > 0 && (
              <div className="space-y-3 pt-2 border-t border-[#e5e2dd]">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-bold uppercase tracking-wider text-[#180f0a]">
                    Botanical Colorway
                  </span>
                  <span className="text-[12px] text-[#964735] font-semibold">{selectedPalette}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {product.palettes.map((pal) => (
                    <button
                      key={pal.id}
                      type="button"
                      onClick={() => setSelectedPalette(pal.name)}
                      className={`p-3 rounded-2xl flex items-center gap-3 border text-left transition-all ${
                        selectedPalette === pal.name
                          ? 'bg-white border-[#180f0a] shadow-xs'
                          : 'bg-[#f6f3ee] border-[#e5e2dd] hover:bg-white'
                      }`}
                    >
                      <div className="flex -space-x-1 shrink-0">
                        <span
                          style={{ backgroundColor: pal.color1 }}
                          className="w-4 h-4 rounded-full border border-white"
                        />
                        <span
                          style={{ backgroundColor: pal.color2 }}
                          className="w-4 h-4 rounded-full border border-white"
                        />
                      </div>
                      <span className="text-[12px] font-medium text-[#1c1c19] line-clamp-1">{pal.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Ribbon Finish */}
            {product.ribbons && product.ribbons.length > 0 && (
              <div className="space-y-3 pt-2 border-t border-[#e5e2dd]">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-bold uppercase tracking-wider text-[#180f0a]">
                    Ribbon & Stem Tie
                  </span>
                  <span className="text-[12px] text-[#964735] font-semibold">{selectedRibbon}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {product.ribbons.map((ribbon) => (
                    <button
                      key={ribbon.id}
                      type="button"
                      onClick={() => setSelectedRibbon(ribbon.name)}
                      className={`p-3 rounded-2xl flex flex-col justify-center border text-left transition-all ${
                        selectedRibbon === ribbon.name
                          ? 'bg-white border-[#180f0a] shadow-xs'
                          : 'bg-[#f6f3ee] border-[#e5e2dd] hover:bg-white'
                      }`}
                    >
                      <span className="text-[12px] font-semibold text-[#180f0a]">{ribbon.name}</span>
                      <span className="text-[10px] text-[#80756f]">{ribbon.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Complimentary Gift Card Input */}
            <div className="space-y-2 pt-2 border-t border-[#e5e2dd]">
              <label className="block text-[12px] font-bold uppercase tracking-wider text-[#180f0a]">
                Complimentary Calligraphy Gift Note (Optional)
              </label>
              <textarea
                rows={2}
                value={giftMessage}
                onChange={(e) => setGiftMessage(e.target.value)}
                placeholder="Include a personal message for the recipient..."
                className="w-full p-3 rounded-2xl bg-white text-[13px] border border-[#e5e2dd] focus:outline-none focus:ring-1 focus:ring-[#180f0a] resize-none"
              />
              <p className="text-[11px] text-[#80756f]">
                Will be hand-inscribed on deckled cotton paper and enclosed with an organic wax seal.
              </p>
            </div>

            {/* Quantity and Actions */}
            <div className="pt-4 border-t border-[#e5e2dd] flex flex-col sm:flex-row items-center gap-3">
              {/* Quantity Counter */}
              <div className="flex items-center justify-between px-4 py-2.5 rounded-full bg-white border border-[#e5e2dd] w-full sm:w-36 shrink-0">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="text-[18px] text-[#4e4540] hover:text-[#180f0a] px-2"
                >
                  -
                </button>
                <span className="text-[14px] font-bold text-[#180f0a]">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="text-[18px] text-[#4e4540] hover:text-[#180f0a] px-2"
                >
                  +
                </button>
              </div>

              {/* Add to Bag Button */}
              <button
                type="button"
                onClick={handleAddToCart}
                className="w-full flex-1 py-3.5 rounded-full bg-[#180f0a] hover:bg-[#964735] text-white text-[13px] font-semibold tracking-wide flex items-center justify-center gap-2 shadow-md transition-all active:translate-y-0.5"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Bag · ₹{(product.price * quantity).toLocaleString('en-IN')}</span>
              </button>

              {/* Wishlist Button */}
              <button
                type="button"
                onClick={() => toggleWishlist(product)}
                className={`p-3.5 rounded-full border transition-all ${
                  wishlisted
                    ? 'bg-[#ffdad3] border-[#964735] text-[#964735]'
                    : 'bg-white border-[#e5e2dd] text-[#4e4540] hover:text-[#964735]'
                }`}
                title={wishlisted ? 'Saved in Wishlist' : 'Save to Wishlist'}
              >
                <Heart className={`w-5 h-5 ${wishlisted ? 'fill-[#964735]' : ''}`} />
              </button>
            </div>

            {/* Trust Assurances */}
            <div className="grid grid-cols-3 gap-2 pt-4 text-center">
              <div className="p-3 rounded-2xl bg-white border border-[#e5e2dd]">
                <Truck className="w-4 h-4 text-[#964735] mx-auto mb-1" />
                <span className="text-[11px] font-medium text-[#1c1c19] block">Pan-India Delivery</span>
              </div>
              <div className="p-3 rounded-2xl bg-white border border-[#e5e2dd]">
                <Sparkles className="w-4 h-4 text-[#964735] mx-auto mb-1" />
                <span className="text-[11px] font-medium text-[#1c1c19] block">Everlasting Blooms</span>
              </div>
              <div className="p-3 rounded-2xl bg-white border border-[#e5e2dd]">
                <ShieldCheck className="w-4 h-4 text-[#964735] mx-auto mb-1" />
                <span className="text-[11px] font-medium text-[#1c1c19] block">Rigid Gift Packaging</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Tabs: Craft, Dimensions, Delivery */}
        <div className="mt-16 bg-white rounded-3xl p-6 lg:p-10 border border-[#e5e2dd] shadow-xs">
          <div className="flex items-center gap-6 border-b border-[#e5e2dd] pb-4 mb-6">
            {[
              { key: 'craft', label: 'Artisanal Materials & Craft' },
              { key: 'dimensions', label: 'Dimensions & Care' },
              { key: 'delivery', label: 'Packaging & Dispatch' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`text-[14px] font-serif transition-colors pb-1 relative ${
                  activeTab === tab.key
                    ? 'text-[#180f0a] font-medium'
                    : 'text-[#80756f] hover:text-[#180f0a]'
                }`}
              >
                {tab.label}
                {activeTab === tab.key && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#964735] -mb-4 rounded-full" />
                )}
              </button>
            ))}
          </div>

          {activeTab === 'craft' && (
            <div className="space-y-4 max-w-3xl text-[14px] text-[#4e4540] leading-relaxed">
              <p>
                Each stem is formed around a pliable copper wire armature, overlaid with dense velvet cotton chenille yarns. Petals are individually twisted, sculpted, and arranged to mimic botanical curvature while remaining soft to the touch.
              </p>
              <div className="p-4 rounded-2xl bg-[#f6f3ee] border border-[#e5e2dd]">
                <h4 className="text-[12px] uppercase font-bold tracking-wider text-[#180f0a] mb-1">
                  Atelier Composition
                </h4>
                <p>{product.materials}</p>
              </div>
            </div>
          )}

          {activeTab === 'dimensions' && (
            <div className="space-y-4 max-w-3xl text-[14px] text-[#4e4540] leading-relaxed">
              <p>
                <strong>Measurements:</strong> {product.dimensions}
              </p>
              <p>
                <strong>Care Instructions:</strong> Simply dust with a soft camel-hair brush or dry cloth periodically. Keep away from direct water or soaking to protect paper wrapping and natural plant dyes.
              </p>
            </div>
          )}

          {activeTab === 'delivery' && (
            <div className="space-y-4 max-w-3xl text-[14px] text-[#4e4540] leading-relaxed">
              <p>
                Arrives nested in shredded wood excelsior inside a rigid custom Kraft presentation gift box, closed with an artisan wax seal.
              </p>
              <p>
                Dispatches from our Mumbai atelier within 1–2 business days. Express Pan-India air delivery arrives in 3–5 days.
              </p>
            </div>
          )}
        </div>

        {/* Related Creations */}
        <div className="mt-16 lg:mt-24 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] uppercase font-bold tracking-widest text-[#964735]">
                Complementary Keepsakes
              </span>
              <h2 className="font-serif text-[28px] sm:text-[36px] text-[#180f0a]">
                You May Also Cherish
              </h2>
            </div>
            <Link to="/shop" className="text-[13px] font-semibold text-[#180f0a] hover:text-[#964735]">
              Browse All →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
