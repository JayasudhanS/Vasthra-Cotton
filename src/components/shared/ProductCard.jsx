import { motion } from 'framer-motion';
import { FiHeart, FiEye, FiShoppingBag } from 'react-icons/fi';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';

function StarRating({ rating, size = 13 }) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) stars.push(<FaStar key={i} size={size} className="star-filled" />);
    else if (rating >= i - 0.5) stars.push(<FaStarHalfAlt key={i} size={size} className="star-filled" />);
    else stars.push(<FaRegStar key={i} size={size} className="star-empty" />);
  }
  return <div className="flex items-center gap-0.5">{stars}</div>;
}

export { StarRating };

export default function ProductCard({ product, index = 0 }) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const liked = product?.id ? isInWishlist(product.id) : false;
  const discount = typeof product?.price === 'number' && product.price > 0 && typeof product?.offerPrice === 'number' ? Math.round(((product.price - product.offerPrice) / product.price) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay: (index % 8) * 0.05 }}
      className="group card-base h-full relative"
    >
      {/* Image Container */}
      <div className="relative overflow-hidden aspect-[3/4] bg-[#F5EDE0] w-full" style={{ minHeight: '220px' }}>
        <img
          src={product?.image || product?.imageUrl || product?.images?.[0] || product?.thumbnail || ''}
          alt={product?.name || ''}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-[1.08] transition-transform duration-700 ease-out"
        />

        {/* Discount badge */}
        {discount > 0 && (
          <span className="absolute top-3 sm:top-3.5 left-3 sm:left-3.5 bg-gradient-to-r from-[#7B1E3A] to-[#9B2E4A] text-white text-[10px] sm:text-[11px] font-bold px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-md z-10 tracking-wider">
            {discount}% OFF
          </span>
        )}

        {/* Wishlist btn */}
        <button
          onClick={() => toggleWishlist(product)}
          aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
          className={`absolute top-3 sm:top-3.5 right-3 sm:right-3.5 w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer z-10 shadow-md ${liked ? 'bg-[#7B1E3A] text-white border-2 border-white/30' : 'bg-white/95 backdrop-blur-md text-[#4A2C2A] hover:bg-[#7B1E3A] hover:text-white border border-[#D4AF37]/20'}`}
        >
          <FiHeart size={16} fill={liked ? 'currentColor' : 'none'} />
        </button>

        {/* Hover overlay for Desktop */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-5 gap-2.5 z-10">
          <Link
            to={`/product/${product.id}`}
            className="bg-white/95 backdrop-blur-sm text-[#4A2C2A] px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 hover:bg-white hover:text-[#7B1E3A] transition-colors no-underline shadow-lg"
          >
            <FiEye size={14} /> Quick View
          </Link>
          <button
            onClick={(e) => { e.preventDefault(); addToCart(product); }}
            className="bg-gradient-to-r from-[#D4AF37] to-[#E8C94A] text-[#4A2C2A] px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 hover:shadow-lg transition-all border-none cursor-pointer shadow-lg"
          >
            <FiShoppingBag size={14} /> Add to Cart
          </button>
        </div>
      </div>

      {/* Info Section */}
      <div className="flex flex-col flex-1 p-3.5 sm:p-4 md:p-5 justify-between bg-white gap-1.5">
        <div>
          <div className="flex items-center justify-between gap-1.5 mb-1.5">
            <span className="text-[10px] sm:text-[11px] uppercase tracking-wider text-[#D4AF37] font-bold truncate min-h-[1rem] inline-block">
              {product?.shopName || ''}
            </span>
            <div className="flex items-center gap-1 flex-shrink-0">
              {product?.fabric && (
                <span className="text-[9px] sm:text-[10px] text-[#7B1E3A] font-semibold bg-[#7B1E3A]/10 px-2 py-0.5 rounded-md truncate max-w-[80px]">
                  {product.fabric}
                </span>
              )}
              <span className="text-[10px] sm:text-[11px] text-[#6B4A48] bg-[#FFF8F0] px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md truncate font-medium min-h-[1.25rem] inline-block">
                {product?.category || ''}
              </span>
            </div>
          </div>

          <Link to={`/product/${product?.id || ''}`} className="no-underline block group-hover:text-[#7B1E3A] transition-colors">
            <h3 className="text-[13px] sm:text-sm font-semibold text-[#4A2C2A] mb-1 sm:mb-1.5 line-clamp-1 leading-snug min-h-[1.25rem]" style={{ fontFamily: 'Poppins' }}>
              {product?.name || ''}
            </h3>
          </Link>

          <div className="flex items-center gap-1.5 mb-2 min-h-[1rem]">
            <StarRating rating={product?.rating || 4.9} size={13} />
            <span className="text-[11px] sm:text-xs text-[#6B4A48] font-medium">({product?.reviews || 12})</span>
          </div>
        </div>

        {/* Bottom Price Row */}
        <div className="flex items-center justify-between border-t border-[#D4AF37]/15 pt-2.5 sm:pt-3 mt-auto min-h-[2.5rem]">
          <div className="flex items-baseline gap-1.5 sm:gap-2">
            <span className="text-[15px] sm:text-base md:text-lg font-bold text-[#7B1E3A] min-h-[1.5rem] inline-block">{typeof product?.offerPrice === 'number' && product.offerPrice > 0 ? `₹${product.offerPrice.toLocaleString()}` : ''}</span>
            <span className="text-[11px] sm:text-xs text-[#6B4A48]/70 line-through min-h-[1rem] inline-block">{typeof product?.price === 'number' && product.price > 0 ? `₹${product.price.toLocaleString()}` : ''}</span>
          </div>
          <button
            onClick={(e) => { e.preventDefault(); addToCart(product); }}
            aria-label={`Add ${product?.name || ''} to cart`}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-[#FFF8F0] text-[#7B1E3A] flex items-center justify-center hover:bg-[#7B1E3A] hover:text-white transition-colors cursor-pointer border-none sm:hidden shadow-sm"
          >
            <FiShoppingBag size={15} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

