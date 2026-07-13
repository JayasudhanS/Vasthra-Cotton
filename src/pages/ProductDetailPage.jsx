import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { FiHeart, FiShoppingBag, FiShare2, FiTruck, FiShield, FiRefreshCw, FiAward, FiCheckCircle } from 'react-icons/fi';
import { StarRating } from '../components/shared/ProductCard';
import ProductCard from '../components/shared/ProductCard';
import { shops } from '../data';
import { useProducts } from '../context/ProductContext';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import BreadcrumbBack from '../components/shared/BreadcrumbBack';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products: allProducts, approvedProducts } = useProducts();
  const { user, role } = useAuth();

  const product = allProducts.find(p => String(p.id) === String(id));
  const isAuthorized = product && (product.status === 'approved' || role === 'admin' || String(product.ownerId) === String(user?.uid));

  const shop = shops.find(s => String(s.id) === String(product?.shopId)) || { id: '', name: product?.shopName || 'Artisan Weave House', owner: product?.ownerName || 'Master Weaver', location: 'India', logo: product?.image || '/images/placeholder.png', products: 'Handloom Cluster', rating: product?.rating || 4.9 };
  const related = approvedProducts.filter(p => (p.category === product?.category || p.fabric === product?.fabric) && String(p.id) !== String(product?.id)).slice(0, 4);
  const [selectedImg, setSelectedImg] = useState(0);
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  const liked = product?.id ? isInWishlist(product.id) : false;
  const discount = typeof product?.price === 'number' && product.price > 0 && typeof product?.offerPrice === 'number' ? Math.round(((product.price - product.offerPrice) / product.price) * 100) : 0;

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
    addToCart(product);
    // Navigate to cart to show the added item in the new Cart experience
    navigate('/cart');
  };

  if (!product || !isAuthorized) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <div className="card-base p-12 bg-white border border-[#D4AF37]/20 shadow-sm max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-full bg-[#7B1E3A]/10 text-[#7B1E3A] flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
            ✦
          </div>
          <h2 className="text-2xl font-bold text-[#7B1E3A] mb-3" style={{ fontFamily: 'Playfair Display' }}>
            Saree Not Found
          </h2>
          <p className="text-sm text-[#6B4A48] mb-6 font-light">
            This saree is currently unavailable, undergoing Silk Mark verification, or has been sold out from the weaver cluster.
          </p>
          <Link to="/products" className="btn-golden !py-3 !px-8 !text-xs no-underline inline-block">
            Browse Live Catalogue
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumb & Back */}
      <BreadcrumbBack items={[
        { label: 'Sarees', path: '/products' },
        { label: product?.category || 'Collection', path: `/products?category=${product?.category || ''}` },
        { label: product?.name || 'Saree Details' }
      ]} />

      <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 mb-20 items-start">
        {/* Gallery */}
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-6 lg:sticky lg:top-[110px]">
          <div className="rounded-2xl overflow-hidden mb-4 aspect-[4/5] bg-[#F5EDE0] shadow-md border border-[#D4AF37]/20 relative group">
            <img src={product?.images?.[selectedImg] || product?.image || ''} alt={product?.name || ''} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" />
            {discount > 0 && (
              <span className="absolute top-4 left-4 bg-[#7B1E3A] text-white text-xs font-bold px-3 py-1 rounded-full shadow-md tracking-wide">
                {discount}% OFF
              </span>
            )}
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 min-h-[6rem]">
            {(product?.images?.length ? product.images : [product?.image || '']).map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImg(i)}
                className={`w-20 h-24 rounded-xl overflow-hidden cursor-pointer border-2 transition-all flex-shrink-0 bg-[#F5EDE0] ${i === selectedImg ? 'border-[#D4AF37] shadow-md scale-95' : 'border-transparent opacity-60 hover:opacity-100'}`}
              >
                <img src={img || ''} alt="" className="w-full h-full object-cover" />
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
          <div className="flex items-baseline gap-3 mb-8 bg-[#FFF8F0]/50 p-5 sm:p-6 rounded-2xl border border-[#D4AF37]/15 min-h-[5.5rem]">
            <span className="text-3xl sm:text-4xl font-bold text-[#7B1E3A]">{typeof product?.offerPrice === 'number' && product.offerPrice > 0 ? `₹${product.offerPrice.toLocaleString()}` : ''}</span>
            <span className="text-base text-[#6B4A48] line-through">{typeof product?.price === 'number' && product.price > 0 ? `₹${product.price.toLocaleString()}` : ''}</span>
            {typeof product?.price === 'number' && product.price > 0 && typeof product?.offerPrice === 'number' && product.offerPrice > 0 && (
              <span className="ml-auto bg-[#7B1E3A] text-white text-xs font-bold px-3 py-1.5 rounded-full">
                Save ₹{(product.price - product.offerPrice).toLocaleString()}
              </span>
            )}
          </div>

          {/* Description */}
          <div className="mb-8">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#7B1E3A] mb-3">About This Drape</h4>
            <p className="text-sm text-[#6B4A48] leading-relaxed m-0 font-light min-h-[1.5rem]">
              {product?.description || ''}
            </p>
          </div>

          {/* Specifications Grid */}
          <div className="mb-8">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#7B1E3A] mb-4">Specifications & Fabric Care</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              {Object.entries(product?.specifications || { Fabric: product?.fabric || '', Color: product?.color || '', Length: '', Care: '' }).map(([k, v]) => (
                <div key={k} className="bg-white rounded-xl p-4 sm:p-5 border border-[#D4AF37]/20 shadow-xs flex flex-col min-h-[3.5rem]">
                  <p className="text-[10px] uppercase tracking-wider text-[#D4AF37] font-bold m-0 mb-1">{k}</p>
                  <p className="text-xs sm:text-sm text-[#4A2C2A] font-semibold m-0 truncate">{v}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 sm:gap-4 mb-8">
            <button onClick={handleBuyNow} className="btn-golden flex-1 justify-center !py-3.5 !min-h-[50px] !text-sm cursor-pointer shadow-md">
              <FiShoppingBag size={18} /> Buy Now
            </button>

            <button
              onClick={() => toggleWishlist(product)}
              aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
              className={`w-12 h-12 sm:w-13 sm:h-13 rounded-xl flex items-center justify-center border cursor-pointer transition-all flex-shrink-0 shadow-sm ${liked ? 'bg-[#7B1E3A] text-white border-transparent' : 'border-[#D4AF37]/30 text-[#7B1E3A] bg-white hover:bg-[#FFF8F0]'}`}
            >
              <FiHeart size={20} fill={liked ? 'currentColor' : 'none'} />
            </button>

            <button
              onClick={handleShare}
              aria-label="Share product"
              className="w-12 h-12 sm:w-13 sm:h-13 rounded-xl flex items-center justify-center border border-[#D4AF37]/30 text-[#4A2C2A] cursor-pointer bg-white hover:bg-[#FFF8F0] transition-colors flex-shrink-0 shadow-sm"
            >
              <FiShare2 size={18} />
            </button>
          </div>

          {/* Add to Bag */}
          <button onClick={handleAddToBag} className="btn-outline-gold w-full !py-3.5 !text-sm cursor-pointer mb-8 justify-center shadow-sm hover:shadow-md transition-shadow">
            Add to Cart
          </button>

          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-3 p-5 sm:p-6 bg-[#FFF8F0] rounded-2xl border border-[#D4AF37]/20 text-center mb-8">
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
          {/* Shop info */}
          <div className="card-base p-6 sm:p-7 flex flex-col sm:flex-row items-center justify-between gap-5 bg-gradient-to-r from-white via-[#FFF8F0]/30 to-white min-h-[5.5rem]">
            <div className="flex items-center gap-4">
              <img src={shop?.logo || ''} alt={shop?.name || ''} className="w-14 h-14 rounded-full object-cover border-2 border-[#D4AF37]" />
              <div>
                <span className="text-[10px] uppercase font-bold text-[#D4AF37] tracking-wider block">Sold by Verified Weaver</span>
                <p className="font-bold text-[#7B1E3A] text-base m-0 min-h-[1.25rem]" style={{ fontFamily: 'Playfair Display' }}>{shop?.name || ''}</p>
                <p className="text-xs text-[#6B4A48] m-0 font-medium min-h-[1rem]">{shop?.location ? `${shop.location} · ` : ''}{typeof shop?.products === 'number' ? `${shop.products} Products · ` : ''}{typeof shop?.rating === 'number' ? `⭐ ${shop.rating}` : ''}</p>
              </div>
            </div>

            <Link to={`/products?shop=${shop?.id || ''}`} className="btn-outline-gold !py-2 !px-5 !min-h-[38px] !text-xs no-underline flex-shrink-0 w-full sm:w-auto text-center">
              Visit Store
            </Link>
          </div>
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
