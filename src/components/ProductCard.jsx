import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Star, Eye } from 'lucide-react';
import { useStore } from '../context/StoreContext.jsx';

export default function ProductCard({ product }) {
  const { toggleWishlist, isWishlisted, addItemToCart } = useStore();
  const wishlisted = isWishlisted(product.id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItemToCart(product);
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <article className="group relative flex flex-col bg-white rounded-3xl p-3 sm:p-4 shadow-[0_4px_20px_-2px_rgba(46,36,30,0.04)] hover:shadow-[0_12px_32px_-4px_rgba(46,36,30,0.09)] transition-all duration-300 border border-[#f0ede9]">
      {/* Thumbnail container */}
      <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-[#f6f3ee] mb-3">
        <Link to={`/product/${product.id}`} className="block w-full h-full">
          <img
            src={product.images ? product.images[0] : (product.image || '')}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </Link>

        {/* Badges */}
        {product.badge && (
          <div className="absolute top-3 left-3 flex flex-col gap-1">
            <span className="px-2.5 py-0.5 rounded-full bg-[#964735] text-white text-[10px] font-bold uppercase tracking-wider shadow-sm">
              {product.badge}
            </span>
          </div>
        )}

        {/* Wishlist button */}
        <button
          onClick={handleToggleWishlist}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-[#4e4540] hover:text-[#964735] shadow-sm transition-all"
          title={wishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
          type="button"
        >
          <Heart className={`w-4 h-4 ${wishlisted ? 'fill-[#964735] text-[#964735]' : ''}`} />
        </button>

        {/* Quick View Link */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <Link
            to={`/product/${product.id}`}
            className="w-full py-2 rounded-xl bg-white/95 text-[#180f0a] text-[12px] font-semibold tracking-wide shadow-md hover:bg-[#180f0a] hover:text-white transition-colors flex items-center justify-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View Details</span>
          </Link>
        </div>
      </div>

      {/* Info Content */}
      <div className="flex-1 flex flex-col justify-between px-1">
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#80756f]">
              {product.categoryLabel || product.category}
            </span>
            {product.rating && (
              <div className="flex items-center gap-1 text-[#964735] text-[12px] font-semibold">
                <Star className="w-3 h-3 fill-[#964735] text-[#964735]" />
                <span>{product.rating}</span>
              </div>
            )}
          </div>

          <Link to={`/product/${product.id}`}>
            <h3 className="font-serif text-[18px] text-[#180f0a] leading-snug font-medium hover:text-[#964735] transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>

          <p className="text-[13px] text-[#4e4540] line-clamp-2 leading-relaxed">
            {product.shortDescription || product.description}
          </p>
        </div>

        {/* Price and Cart Button */}
        <div className="pt-4 mt-2 flex items-center justify-between border-t border-[#f0ede9]">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#80756f]">Price</span>
            <span className="text-[17px] font-bold text-[#180f0a]">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            type="button"
            className="px-3.5 py-1.5 rounded-full bg-[#180f0a] text-white hover:bg-[#964735] transition-all text-[12px] font-semibold flex items-center gap-1.5 shadow-sm active:translate-y-0.5"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Add to Bag</span>
          </button>
        </div>
      </div>
    </article>
  );
}
