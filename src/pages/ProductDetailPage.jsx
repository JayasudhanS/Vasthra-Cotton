import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useCallback } from 'react';
import { FiHeart, FiShoppingBag, FiShare2, FiTruck, FiShield, FiRefreshCw, FiAward, FiCheckCircle, FiChevronLeft, FiChevronRight, FiMapPin, FiStar, FiPackage } from 'react-icons/fi';
import { StarRating } from '../components/shared/ProductCard';
import ProductCard from '../components/shared/ProductCard';
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
  const isAuthorized = product && (
    (product.status || '').toLowerCase().trim() === 'approved' ||
    role === 'admin' ||
    String(product.ownerId) === String(user?.uid)
  );

  // Build images array from all possible Cloudinary URL fields
  const productImages = (() => {
    const imgs = [];
    if (product?.images && Array.isArray(product.images)) {
      product.images.forEach(url => { if (url) imgs.push(url); });
    }
    if (imgs.length === 0 && product?.image) imgs.push(product.image);
    if (imgs.length === 0 && product?.imageUrl) imgs.push(product.imageUrl);
    if (imgs.length === 0 && product?.thumbnail) imgs.push(product.thumbnail);
    return imgs;
  })();

  // Shop info from product document
  const shopInfo = {
    id: product?.ownerId || product?.shopId || '',
    name: product?.shopName || 'Artisan Weave House',
    owner: product?.ownerName || '',
    location: product?.shopLocation || 'India',
    logo: product?.shopLogo || productImages[0] || '',
    rating: product?.shopRating || product?.rating || 4.9,
  };

  // Related products: same category or same fabric, excluding current product
  const related = approvedProducts
    .filter(p => (p.category === product?.category || p.fabric === product?.fabric) && String(p.id) !== String(product?.id))
    .slice(0, 4);

  // Count how many products the shop owner has
  const shopProductCount = approvedProducts.filter(p => String(p.ownerId) === String(shopInfo.id) || p.shopName === shopInfo.name).length;

  const [selectedImg, setSelectedImg] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [touchStart, setTouchStart] = useState(null);
  const imgContainerRef = useRef(null);

  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  const liked = product?.id ? isInWishlist(product.id) : false;
  const discount = typeof product?.price === 'number' && product.price > 0 && typeof product?.offerPrice === 'number' && product.offerPrice > 0
    ? Math.round(((product.price - product.offerPrice) / product.price) * 100) : 0;

  // Image zoom on hover (desktop)
  const handleMouseMove = useCallback((e) => {
    if (!imgContainerRef.current) return;
    const rect = imgContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  }, []);

  // Swipe handlers (mobile)
  const handleTouchStart = (e) => setTouchStart(e.touches[0].clientX);
  const handleTouchEnd = (e) => {
    if (touchStart === null) return;
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0 && selectedImg < productImages.length - 1) setSelectedImg(prev => prev + 1);
      else if (diff < 0 && selectedImg > 0) setSelectedImg(prev => prev - 1);
    }
    setTouchStart(null);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: product.name, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Product link copied to clipboard!');
    }
  };

  const handleBuyNow = () => {
    if (!user) { navigate('/login/user'); return; }
    navigate('/order-summary', { state: { product, shop: shopInfo } });
  };

  const handleAddToBag = () => {
    if (!user) { navigate('/login/user'); return; }
    addToCart(product);
    navigate('/cart');
  };

  const handleWishlistClick = () => {
    const result = toggleWishlist(product);
    if (result === 'login_required') navigate('/portal');
  };

  // Specifications from product fields
  const specs = product?.specifications || {};
  const mergedSpecs = {
    ...(product?.fabric ? { 'Primary Fabric': product.fabric } : {}),
    ...(product?.category ? { 'Regional Weave': product.category } : {}),
    ...(product?.color ? { 'Color': product.color } : {}),
    ...(product?.zariType ? { 'Zari / Motif': product.zariType } : {}),
    ...specs,
  };

  if (!product || !isAuthorized) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <div className="card-base p-12 bg-white border border-[#D4AF37]/20 shadow-sm max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-full bg-[#7B1E3A]/10 text-[#7B1E3A] flex items-center justify-center mx-auto mb-4 text-2xl font-bold">✦</div>
          <h2 className="text-2xl font-bold text-[#7B1E3A] mb-3" style={{ fontFamily: 'Playfair Display' }}>Saree Not Found</h2>
          <p className="text-sm text-[#6B4A48] mb-6 font-light">This saree is currently unavailable, undergoing Silk Mark verification, or has been sold out from the weaver cluster.</p>
          <Link to="/products" className="btn-golden !py-3 !px-8 !text-xs no-underline inline-block">Browse Live Catalogue</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumb */}
      <BreadcrumbBack items={[
        { label: 'Sarees', path: '/products' },
        { label: product?.category || 'Collection', path: `/products?category=${product?.category || ''}` },
        { label: product?.name || 'Saree Details' }
      ]} />

      <div className="grid lg:grid-cols-12 gap-8 lg:gap-14 mb-20 items-start">

        {/* ═══════ Gallery ═══════ */}
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-6 lg:sticky lg:top-[110px]">

          {/* Main Image with zoom */}
          <div
            ref={imgContainerRef}
            className="rounded-2xl overflow-hidden mb-4 aspect-[4/5] bg-[#F5EDE0] shadow-md border border-[#D4AF37]/20 relative group cursor-crosshair"
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
            onMouseMove={handleMouseMove}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={selectedImg}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                src={productImages[selectedImg] || ''}
                alt={product?.name || ''}
                className="w-full h-full object-cover transition-transform duration-300 ease-out"
                style={isZoomed ? {
                  transform: 'scale(2)',
                  transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                } : {}}
                draggable={false}
              />
            </AnimatePresence>

            {/* Discount badge */}
            {discount > 0 && (
              <span className="absolute top-4 left-4 bg-[#7B1E3A] text-white text-xs font-bold px-3 py-1 rounded-full shadow-md tracking-wide z-10">
                {discount}% OFF
              </span>
            )}

            {/* Image navigation arrows (desktop, if >1 image) */}
            {productImages.length > 1 && (
              <>
                {selectedImg > 0 && (
                  <button onClick={() => setSelectedImg(prev => prev - 1)} className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow-lg flex items-center justify-center text-[#4A2C2A] hover:bg-white cursor-pointer border-none opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <FiChevronLeft size={20} />
                  </button>
                )}
                {selectedImg < productImages.length - 1 && (
                  <button onClick={() => setSelectedImg(prev => prev + 1)} className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow-lg flex items-center justify-center text-[#4A2C2A] hover:bg-white cursor-pointer border-none opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <FiChevronRight size={20} />
                  </button>
                )}
              </>
            )}

            {/* Mobile dot indicators */}
            {productImages.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10 sm:hidden">
                {productImages.map((_, i) => (
                  <button key={i} onClick={() => setSelectedImg(i)} className={`w-2.5 h-2.5 rounded-full transition-all border-none cursor-pointer ${i === selectedImg ? 'bg-[#D4AF37] scale-125 shadow-md' : 'bg-white/70'}`} />
                ))}
              </div>
            )}
          </div>

          {/* Thumbnail gallery (desktop) */}
          {productImages.length > 1 && (
            <div className="hidden sm:flex gap-3 overflow-x-auto pb-2">
              {productImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImg(i)}
                  className={`w-20 h-24 rounded-xl overflow-hidden cursor-pointer border-2 transition-all flex-shrink-0 bg-[#F5EDE0] ${i === selectedImg ? 'border-[#D4AF37] shadow-md ring-2 ring-[#D4AF37]/30' : 'border-transparent opacity-60 hover:opacity-100'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* ═══════ Details ═══════ */}
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-6 flex flex-col">

          {/* Shop Badge & Stock */}
          <div className="flex items-center justify-between gap-4 mb-4">
            <Link to={`/store/${shopInfo.id}`} className="text-xs uppercase tracking-widest text-[#D4AF37] font-bold bg-[#FFF8F0] px-3 py-1 rounded-full border border-[#D4AF37]/30 no-underline hover:bg-[#D4AF37]/10 transition-colors">
              ✦ {product.shopName}
            </Link>
            <span className="text-xs text-[#2D8F5E] font-semibold flex items-center gap-1 bg-[#2D8F5E]/10 px-2.5 py-1 rounded-md">
              <FiCheckCircle /> {(product.stock || 0) > 0 ? 'In Stock' : 'Available'}
            </span>
          </div>

          {/* Product Name */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#7B1E3A] mb-5 leading-tight" style={{ fontFamily: 'Playfair Display' }}>
            {product.name}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center gap-1.5 bg-[#FFF8F0] px-2.5 py-1.5 rounded-lg">
              <StarRating rating={product.rating || 4.9} size={14} />
              <span className="text-xs font-bold text-[#4A2C2A]">{product.rating || 4.9}</span>
            </div>
            <span className="text-xs text-[#6B4A48] font-medium">({product.reviews || 0} Reviews)</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-8 bg-[#FFF8F0]/50 p-5 sm:p-6 rounded-2xl border border-[#D4AF37]/15 min-h-[5.5rem]">
            <span className="text-3xl sm:text-4xl font-bold text-[#7B1E3A]">
              {typeof product?.offerPrice === 'number' && product.offerPrice > 0 ? `₹${product.offerPrice.toLocaleString()}` : (typeof product?.price === 'number' && product.price > 0 ? `₹${product.price.toLocaleString()}` : '')}
            </span>
            {discount > 0 && (
              <>
                <span className="text-base text-[#6B4A48] line-through">₹{product.price.toLocaleString()}</span>
                <span className="ml-auto bg-[#7B1E3A] text-white text-xs font-bold px-3 py-1.5 rounded-full">
                  Save ₹{(product.price - product.offerPrice).toLocaleString()}
                </span>
              </>
            )}
          </div>

          {/* Description */}
          {product?.description && (
            <div className="mb-8">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#7B1E3A] mb-3">About This Drape</h4>
              <p className="text-sm text-[#6B4A48] leading-relaxed m-0 font-light">{product.description}</p>
            </div>
          )}

          {/* Specifications Grid */}
          {Object.keys(mergedSpecs).length > 0 && (
            <div className="mb-8">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#7B1E3A] mb-4">Specifications & Fabric Care</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                {Object.entries(mergedSpecs).filter(([, v]) => v).map(([k, v]) => (
                  <div key={k} className="bg-white rounded-xl p-4 sm:p-5 border border-[#D4AF37]/20 shadow-xs flex flex-col">
                    <p className="text-[10px] uppercase tracking-wider text-[#D4AF37] font-bold m-0 mb-1">{k}</p>
                    <p className="text-xs sm:text-sm text-[#4A2C2A] font-semibold m-0 truncate">{v}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 sm:gap-4 mb-4">
            <button onClick={handleBuyNow} className="btn-golden flex-1 justify-center !py-3.5 !min-h-[50px] !text-sm cursor-pointer shadow-md">
              <FiShoppingBag size={18} /> Buy Now
            </button>

            <button
              onClick={handleWishlistClick}
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

          {/* Add to Cart */}
          <button onClick={handleAddToBag} className="btn-outline-gold w-full !py-3.5 !text-sm cursor-pointer mb-8 justify-center shadow-sm hover:shadow-md transition-shadow">
            Add to Cart
          </button>

          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-3 p-5 sm:p-6 bg-[#FFF8F0] rounded-2xl border border-[#D4AF37]/20 text-center mb-8">
            <div className="flex flex-col items-center gap-1.5">
              <FiTruck className="text-[#2D8F5E]" size={20} />
              <span className="text-[11px] font-bold text-[#4A2C2A]">Shipping</span>
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

          {/* ═══════ SHOP INFO CARD ═══════ */}
          <div className="card-base p-6 sm:p-8 bg-gradient-to-br from-white via-[#FFF8F0]/40 to-white border border-[#D4AF37]/25">
            <div className="flex items-start gap-4 sm:gap-5">
              {/* Shop Logo */}
              <div className="relative flex-shrink-0">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-3 border-[#D4AF37]/40 shadow-md bg-[#F5EDE0]">
                  <img src={shopInfo.logo} alt={shopInfo.name} className="w-full h-full object-cover" />
                </div>
                <span className="absolute -bottom-1 -right-1 bg-[#2D8F5E] text-white p-1 rounded-full text-xs shadow-sm" title="Verified Weaver">
                  <FiCheckCircle size={14} />
                </span>
              </div>

              {/* Shop Details */}
              <div className="flex-1 min-w-0">
                <span className="text-[10px] uppercase font-bold text-[#D4AF37] tracking-widest block mb-1">Sold by Verified Weaver</span>
                <h3 className="text-xl sm:text-2xl font-bold text-[#7B1E3A] m-0 mb-1 truncate" style={{ fontFamily: 'Playfair Display' }}>
                  {shopInfo.name}
                </h3>
                {shopInfo.owner && (
                  <p className="text-xs text-[#6B4A48] m-0 mb-2 font-medium">by {shopInfo.owner}</p>
                )}
                <div className="flex flex-wrap items-center gap-3 text-xs text-[#6B4A48]">
                  <span className="flex items-center gap-1 font-semibold">
                    <FiStar className="text-[#D4AF37]" size={13} /> {shopInfo.rating}
                  </span>
                  <span className="flex items-center gap-1">
                    <FiMapPin size={12} /> {shopInfo.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <FiPackage size={12} /> {shopProductCount} Products
                  </span>
                </div>
              </div>
            </div>

            {/* Visit Store Button */}
            <div className="mt-5 pt-5 border-t border-[#D4AF37]/15">
              <Link
                to={`/store/${shopInfo.id}`}
                className="btn-outline-gold w-full !py-3 !text-xs no-underline text-center justify-center flex items-center gap-2"
              >
                Visit Store →
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ═══════ Related Products ═══════ */}
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
