import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { FiHeart, FiShoppingBag, FiShare2, FiTruck, FiShield, FiRefreshCw, FiAward, FiCheckCircle } from 'react-icons/fi';
import { StarRating } from '../components/shared/ProductCard';
import ProductCard from '../components/shared/ProductCard';
import { products, shops } from '../data';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = products.find(p => p.id === +id) || products[0];
  const shop = shops.find(s => s.id === product.shopId);
  const related = products.filter(p => p.categoryId === product.categoryId && p.id !== product.id).slice(0, 4);
  const [selectedImg, setSelectedImg] = useState(0);
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { user } = useAuth();
  const liked = isInWishlist(product.id);
  const discount = Math.round(((product.price - product.offerPrice) / product.price) * 100);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: product.name, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Product link copied to clipboard!');
    }
  };

  const handleBuyNow = () => {
    if (!user) {
      navigate('/login/user');
      return;
    }
    navigate('/order-summary', { state: { product, shop } });
  };

  const handleAddToBag = () => {
    if (!user) {
      navigate('/login/user');
      return;
    }
    navigate('/order-summary', { state: { product, shop } });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-[#6B4A48] mb-8 overflow-x-auto pb-2">
        <Link to="/" className="text-[#6B4A48] hover:text-[#7B1E3A] no-underline">Home</Link>
        <span>/</span>
        <Link to="/products" className="text-[#6B4A48] hover:text-[#7B1E3A] no-underline">Sarees</Link>
        <span>/</span>
        <Link to={`/products?category=${product.category}`} className="text-[#6B4A48] hover:text-[#7B1E3A] no-underline">{product.category}</Link>
        <span>/</span>
        <span className="text-[#7B1E3A] font-semibold truncate">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 mb-20 items-start">
        {/* Gallery */}
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-6 lg:sticky lg:top-[110px]">
          <div className="rounded-2xl overflow-hidden mb-4 aspect-[4/5] bg-[#F5EDE0] shadow-md border border-[#D4AF37]/20 relative group">
            <img src={product.images[selectedImg] || product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" />
            {discount > 0 && (
              <span className="absolute top-4 left-4 bg-[#7B1E3A] text-white text-xs font-bold px-3 py-1 rounded-full shadow-md tracking-wide">
                {discount}% OFF
              </span>
            )}
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2">
            {(product.images || [product.image]).map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImg(i)}
                className={`w-20 h-24 rounded-xl overflow-hidden cursor-pointer border-2 transition-all flex-shrink-0 bg-[#F5EDE0] ${i === selectedImg ? 'border-[#D4AF37] shadow-md scale-95' : 'border-transparent opacity-60 hover:opacity-100'}`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </motion.div>

        {/* Details */}
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-6 flex flex-col">
          {/* Shop Badge & Stock */}
          <div className="flex items-center justify-between gap-4 mb-4">
            <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-bold bg-[#FFF8F0] px-3 py-1 rounded-full border border-[#D4AF37]/30">
              ✦ {product.shopName}
            </span>
            <span className="text-xs text-[#2D8F5E] font-semibold flex items-center gap-1 bg-[#2D8F5E]/10 px-2.5 py-1 rounded-md">
              <FiCheckCircle /> In Stock
            </span>
          </div>

          {/* Product Name */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#7B1E3A] mb-5 leading-tight" style={{ fontFamily: 'Playfair Display' }}>
            {product.name}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center gap-1.5 bg-[#FFF8F0] px-2.5 py-1.5 rounded-lg">
              <StarRating rating={product.rating} size={14} />
              <span className="text-xs font-bold text-[#4A2C2A]">{product.rating}</span>
            </div>
            <span className="text-xs text-[#6B4A48] font-medium">({product.reviews} Verified Reviews)</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-8 bg-[#FFF8F0]/50 p-5 rounded-2xl border border-[#D4AF37]/15">
            <span className="text-3xl sm:text-4xl font-bold text-[#7B1E3A]">₹{product.offerPrice.toLocaleString()}</span>
            <span className="text-base text-[#6B4A48] line-through">₹{product.price.toLocaleString()}</span>
            <span className="ml-auto bg-[#7B1E3A] text-white text-xs font-bold px-3 py-1.5 rounded-full">
              Save ₹{(product.price - product.offerPrice).toLocaleString()}
            </span>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#7B1E3A] mb-3">About This Drape</h4>
            <p className="text-sm text-[#6B4A48] leading-relaxed m-0 font-light">
              {product.description || "An authentic handloom weave crafted with meticulous attention to traditional motifs and rich zari borders. Perfect for weddings, festivities, and heirloom gifting."}
            </p>
          </div>

          {/* Specifications Grid */}
          <div className="mb-8">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#7B1E3A] mb-4">Specifications & Fabric Care</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {Object.entries(product.specifications || { Fabric: product.fabric, Color: product.color, Length: '6.3 Meters (inc. Blouse)', Care: 'Dry Clean Only' }).map(([k, v]) => (
                <div key={k} className="bg-white rounded-xl p-4 border border-[#D4AF37]/20 shadow-xs flex flex-col">
                  <p className="text-[10px] uppercase tracking-wider text-[#D4AF37] font-bold m-0 mb-1">{k}</p>
                  <p className="text-xs sm:text-sm text-[#4A2C2A] font-semibold m-0 truncate">{v}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 mb-8">
            <button onClick={handleBuyNow} className="btn-golden flex-1 justify-center !py-3.5 !min-h-[50px] !text-sm cursor-pointer shadow-md">
              <FiShoppingBag size={18} /> Buy Now
            </button>

            <button
              onClick={() => toggleWishlist(product)}
              aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
              className={`w-12 h-12 rounded-xl flex items-center justify-center border cursor-pointer transition-all flex-shrink-0 shadow-sm ${liked ? 'bg-[#7B1E3A] text-white border-transparent' : 'border-[#D4AF37]/30 text-[#7B1E3A] bg-white hover:bg-[#FFF8F0]'}`}
            >
              <FiHeart size={20} fill={liked ? 'currentColor' : 'none'} />
            </button>

            <button
              onClick={handleShare}
              aria-label="Share product"
              className="w-12 h-12 rounded-xl flex items-center justify-center border border-[#D4AF37]/30 text-[#4A2C2A] cursor-pointer bg-white hover:bg-[#FFF8F0] transition-colors flex-shrink-0 shadow-sm"
            >
              <FiShare2 size={18} />
            </button>
          </div>

          {/* Add to Bag */}
          <button onClick={handleAddToBag} className="btn-outline-gold w-full !py-3 !text-sm cursor-pointer mb-8 justify-center">
            Add to Bag
          </button>

          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-3 p-5 bg-[#FFF8F0] rounded-2xl border border-[#D4AF37]/20 text-center mb-8">
            <div className="flex flex-col items-center gap-1.5">
              <FiTruck className="text-[#2D8F5E]" size={20} />
              <span className="text-[11px] font-bold text-[#4A2C2A]">Free Shipping</span>
              <span className="text-[10px] text-[#6B4A48]">Across India</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 border-x border-[#D4AF37]/20 px-2">
              <FiAward className="text-[#2D8F5E]" size={20} />
              <span className="text-[11px] font-bold text-[#4A2C2A]">Silk Mark</span>
              <span className="text-[10px] text-[#6B4A48]">100% Certified</span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <FiRefreshCw className="text-[#2D8F5E]" size={20} />
              <span className="text-[11px] font-bold text-[#4A2C2A]">7-Day Return</span>
              <span className="text-[10px] text-[#6B4A48]">Easy Exchange</span>
            </div>
          </div>

          {/* Shop info */}
          {shop && (
            <div className="card-base p-6 flex flex-col sm:flex-row items-center justify-between gap-5 bg-gradient-to-r from-white via-[#FFF8F0]/30 to-white">
              <div className="flex items-center gap-4">
                <img src={shop.logo} alt={shop.name} className="w-14 h-14 rounded-full object-cover border-2 border-[#D4AF37]" />
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#D4AF37] tracking-wider block">Sold by Verified Weaver</span>
                  <p className="font-bold text-[#7B1E3A] text-base m-0" style={{ fontFamily: 'Playfair Display' }}>{shop.name}</p>
                  <p className="text-xs text-[#6B4A48] m-0 font-medium">{shop.location} · {shop.products} Products · ⭐ {shop.rating}</p>
                </div>
              </div>

              <Link to={`/products?shop=${shop.id}`} className="btn-outline-gold !py-2 !px-5 !min-h-[38px] !text-xs no-underline flex-shrink-0 w-full sm:w-auto text-center">
                Visit Store
              </Link>
            </div>
          )}
        </motion.div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <section className="pt-14 border-t border-[#D4AF37]/15 mt-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-bold block mb-1">✦ Complete Your Wardrobe</span>
              <h2 className="section-title !text-left !text-2xl lg:!text-3xl m-0">Similar Royal Drapes</h2>
            </div>
            <Link to={`/products?category=${product.category}`} className="text-xs sm:text-sm font-semibold text-[#7B1E3A] hover:text-[#D4AF37] no-underline transition-colors">
              View All {product.category} →
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {related.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
