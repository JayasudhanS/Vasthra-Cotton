import { motion } from 'framer-motion';
import { FiHeart, FiEye, FiShoppingBag } from 'react-icons/fi';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useWishlist } from '../../context/WishlistContext';

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
  const liked = isInWishlist(product.id);
  const discount = Math.round(((product.price - product.offerPrice) / product.price) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay: (index % 8) * 0.05 }}
      className="group card-base h-full relative"
    >
      {/* Image Container with Fixed 4:5 Aspect Ratio */}
      <div className="relative overflow-hidden aspect-[4/5] bg-[#F5EDE0] w-full">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Discount badge */}
        {discount > 0 && (
          <span className="absolute top-3 left-3 bg-[#7B1E3A] text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm z-10 tracking-wide">
            {discount}% OFF
          </span>
        )}

        {/* Wishlist btn */}
        <button
          onClick={() => toggleWishlist(product)}
          aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer border border-[#D4AF37]/30 z-10 shadow-sm ${liked ? 'bg-[#7B1E3A] text-white border-transparent' : 'bg-white/90 backdrop-blur-md text-[#4A2C2A] hover:bg-[#7B1E3A] hover:text-white hover:border-transparent'}`}
        >
          <FiHeart size={16} fill={liked ? 'currentColor' : 'none'} />
        </button>

        {/* Hover overlay for Desktop */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4 gap-2 z-10">
          <Link
            to={`/product/${product.id}`}
            className="bg-white/95 backdrop-blur-sm text-[#4A2C2A] px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 hover:bg-white hover:text-[#7B1E3A] transition-colors no-underline shadow-md"
          >
            <FiEye size={14} /> Quick View
          </Link>
          <Link
            to={`/product/${product.id}`}
            className="bg-gradient-to-r from-[#D4AF37] to-[#E8C94A] text-[#4A2C2A] px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 hover:shadow-lg transition-all no-underline shadow-md"
          >
            <FiShoppingBag size={14} /> Buy Now
          </Link>
        </div>
      </div>

      {/* Info Section - Flex-1 with space-between ensures uniform price alignment at bottom */}
      <div className="flex flex-col flex-1 p-4 justify-between bg-white">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-[10px] uppercase tracking-wider text-[#D4AF37] font-bold truncate">
              {product.shopName}
            </span>
            <span className="text-[11px] text-[#6B4A48] bg-[#FFF8F0] px-2 py-0.5 rounded-md truncate font-medium">
              {product.category}
            </span>
          </div>

          <Link to={`/product/${product.id}`} className="no-underline block group-hover:text-[#7B1E3A] transition-colors">
            <h3 className="text-sm font-semibold text-[#4A2C2A] mb-1.5 line-clamp-1 leading-snug" style={{ fontFamily: 'Poppins' }}>
              {product.name}
            </h3>
          </Link>

          <div className="flex items-center gap-1.5 mb-3">
            <StarRating rating={product.rating} size={12} />
            <span className="text-[11px] text-[#6B4A48] font-medium">({product.reviews})</span>
          </div>
        </div>

        {/* Bottom Price Row */}
        <div className="flex items-center justify-between border-t border-[#D4AF37]/15 pt-3 mt-auto">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-bold text-[#7B1E3A]">₹{product.offerPrice.toLocaleString()}</span>
            <span className="text-xs text-[#6B4A48] line-through">₹{product.price.toLocaleString()}</span>
          </div>
          <Link
            to={`/product/${product.id}`}
            aria-label={`View ${product.name}`}
            className="w-8 h-8 rounded-lg bg-[#FFF8F0] text-[#7B1E3A] flex items-center justify-center hover:bg-[#7B1E3A] hover:text-white transition-colors no-underline sm:hidden"
          >
            <FiShoppingBag size={15} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

