import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext.jsx';

export default function WishlistPage() {
  const { wishlist, toggleWishlist, addItemToCart } = useStore();

  const handleMoveToBag = (product) => {
    addItemToCart(product);
  };

  const handleMoveAllToBag = () => {
    wishlist.forEach(item => {
      addItemToCart(item);
    });
  };

  return (
    <div className="w-full bg-[#fcf9f4] min-h-screen py-10 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div className="space-y-1">
            <span className="text-[11px] uppercase font-bold tracking-widest text-[#964735]">
              Saved Treasures
            </span>
            <h1 className="font-serif text-[36px] sm:text-[44px] text-[#180f0a] font-normal tracking-tight">
              Your Keepsake Wishlist
            </h1>
            <p className="text-[14px] text-[#4e4540]">
              Pieces saved for upcoming birthdays, quiet anniversaries, or gentle everyday surprises.
            </p>
          </div>

          {wishlist.length > 0 && (
            <button
              onClick={handleMoveAllToBag}
              className="px-5 py-2.5 rounded-full bg-[#180f0a] text-white hover:bg-[#964735] transition-colors text-[12px] font-semibold flex items-center gap-2 shrink-0"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Move All to Bag</span>
            </button>
          )}
        </div>

        {wishlist.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 lg:p-16 text-center border border-[#e5e2dd] max-w-xl mx-auto space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#f6f3ee] mx-auto flex items-center justify-center text-3xl">
              🤍
            </div>
            <h2 className="font-serif text-[26px] text-[#180f0a]">No keepsakes saved yet</h2>
            <p className="text-[14px] text-[#4e4540]">
              Tap the heart on any bloom, card, or hamper in our catalog to save it to your personal wishlist.
            </p>
            <div className="pt-2">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#180f0a] text-white hover:bg-[#964735] transition-colors text-[13px] font-semibold"
              >
                <span>Browse The Collection</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlist.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl p-4 border border-[#e5e2dd] shadow-xs flex flex-col justify-between space-y-4 group"
              >
                <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-[#f6f3ee]">
                  <Link to={`/product/${item.id}`}>
                    <img
                      src={item.images ? item.images[0] : (item.image || '')}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </Link>
                  <button
                    type="button"
                    onClick={() => toggleWishlist(item)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 shadow-sm flex items-center justify-center text-[#964735] hover:scale-110 transition-transform"
                    title="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#80756f]">
                    {item.categoryLabel || item.category}
                  </span>
                  <Link to={`/product/${item.id}`}>
                    <h3 className="font-serif text-[18px] text-[#180f0a] font-medium hover:text-[#964735] transition-colors">
                      {item.name}
                    </h3>
                  </Link>
                  <p className="text-[13px] text-[#4e4540] line-clamp-2">
                    {item.shortDescription || item.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#e5e2dd] flex items-center justify-between">
                  <span className="text-[17px] font-bold text-[#180f0a]">
                    ₹{item.price.toLocaleString('en-IN')}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleMoveToBag(item)}
                    className="px-4 py-2 rounded-full bg-[#180f0a] text-white hover:bg-[#964735] text-[12px] font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Move to Bag</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
