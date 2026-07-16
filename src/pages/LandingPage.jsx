import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, Navigate } from 'react-router-dom';
import { FiArrowRight, FiShield, FiStar, FiTruck, FiCheckCircle, FiHeart, FiAward, FiUsers, FiShoppingBag, FiUser, FiChevronRight } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import ProductCard, { StarRating } from '../components/shared/ProductCard';
import { categories, shops, testimonials, festivalBanners } from '../data';
import { useProducts } from '../context/ProductContext';
import { collection, onSnapshot } from 'firebase/firestore';
import { db, COLLECTIONS } from '../firebase/config';

/* ─── Hero ─── */
function Hero() {
  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 pt-4 sm:pt-6">
      <section className="bg-[#FFF8F0] w-full rounded-2xl sm:rounded-3xl shadow-lg border border-[#D4AF37]/20 overflow-hidden">
        <div className="flex flex-col lg:flex-row">

          {/* ── Left: Text Content ── */}
          <div className="w-full lg:w-[55%] xl:w-[52%] px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16 pt-8 sm:pt-10 lg:pt-14 xl:pt-16 pb-8 sm:pb-10 lg:pb-14 xl:pb-16 flex flex-col justify-center">

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-[#5A1028] text-white text-[11px] sm:text-xs lg:text-[13px] font-bold tracking-[0.13em] uppercase py-2.5 sm:py-3 px-4 sm:px-5 rounded-full inline-flex items-center gap-2.5 w-fit mb-6 sm:mb-7 lg:mb-8 shadow-sm border border-[#D4AF37]/25"
            >
              <span className="text-[#D4AF37] text-sm sm:text-base">✦</span>
              <span>India's Premier Saree Marketplace</span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-[36px] sm:text-[42px] md:text-[46px] lg:text-[46px] xl:text-[56px] font-bold leading-[1.12] sm:leading-[1.15] tracking-tight"
              style={{ fontFamily: 'Playfair Display' }}
            >
              <span className="text-[#4A2C2A] block">Celebrate Every</span>
              <span className="text-[#4A2C2A] block">Tradition with</span>
              <span className="text-[#C9993A] block mt-1 sm:mt-1.5">Timeless Elegance</span>
            </motion.h1>

            {/* Divider */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-3 sm:gap-4 my-5 sm:my-6 lg:my-7 xl:my-8 w-[200px] sm:w-[240px] lg:w-[260px] xl:w-[300px]"
            >
              <div className="h-px flex-1 bg-[#C9993A]/50"></div>
              <span className="text-[#C9993A] text-base sm:text-lg">✦</span>
              <div className="h-px flex-1 bg-[#C9993A]/50"></div>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-[15px] sm:text-[16px] lg:text-[17px] xl:text-[18px] text-[#4A2C2A]/85 leading-[1.7] sm:leading-[1.75] mb-7 sm:mb-8 lg:mb-9 xl:mb-10 max-w-[460px] font-normal"
            >
              Discover handcrafted Kanjivaram, Banarasi, and designer sarees from trusted weavers across India.
            </motion.p>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col lg:flex-row gap-3.5 sm:gap-4 lg:gap-5 w-full lg:w-auto"
            >
              <Link to="/products"
                className="bg-[#5A1028] hover:bg-[#4A0E22] text-white h-[52px] sm:h-[56px] lg:h-[54px] xl:h-[58px] px-6 sm:px-7 lg:px-8 xl:px-9 rounded-xl font-semibold transition-all duration-300 no-underline shadow-md hover:shadow-lg inline-flex items-center justify-center gap-2.5 sm:gap-3 text-[14px] sm:text-[15px] lg:text-[15px] xl:text-[16px] w-full lg:w-auto whitespace-nowrap"
              >
                <FiShoppingBag className="text-lg sm:text-xl flex-shrink-0" />
                <span>Explore Collection</span>
                <FiArrowRight className="text-lg sm:text-xl flex-shrink-0" />
              </Link>
              <Link to="/portal"
                className="bg-white hover:bg-[#FFF8F0] text-[#4A2C2A] border-2 border-[#D4AF37]/35 hover:border-[#D4AF37]/70 h-[52px] sm:h-[56px] lg:h-[54px] xl:h-[58px] px-6 sm:px-7 lg:px-8 xl:px-9 rounded-xl font-semibold transition-all duration-300 no-underline shadow-sm inline-flex items-center justify-center gap-2.5 sm:gap-3 text-[14px] sm:text-[15px] lg:text-[15px] xl:text-[16px] w-full lg:w-auto whitespace-nowrap"
              >
                <FiUser className="text-lg sm:text-xl text-[#4A2C2A] flex-shrink-0" />
                <span>Login / Register</span>
              </Link>
            </motion.div>
          </div>

          {/* ── Right: Hero Image ── */}
          <div className="w-full lg:w-[45%] xl:w-[48%] lg:relative lg:self-stretch">
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mx-5 sm:mx-7 md:mx-8 mb-6 sm:mb-8 lg:m-0 lg:absolute lg:inset-0 rounded-2xl lg:rounded-none overflow-hidden h-[300px] sm:h-[380px] md:h-[420px] lg:h-auto"
            >
              <img
                src="/hero-saree.png"
                alt="Premium Kanjivaram Silk Saree Collection"
                className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-1000 ease-in-out"
              />
            </motion.div>
          </div>

        </div>
      </section>
    </div>
  );
}

/* ─── Statistics Section ─── */
function StatisticsSection() {
  const [approvedProductsCount, setApprovedProductsCount] = useState(0);
  const [approvedShopsCount, setApprovedShopsCount] = useState(0);

  useEffect(() => {
    let usersList = [];
    let shopsList = [];

    // Listener 1: Products
    const productsRef = collection(db, COLLECTIONS.PRODUCTS);
    const unsubProducts = onSnapshot(productsRef, (snapshot) => {
      let count = 0;
      snapshot.docs.forEach((d) => {
        const p = d.data();
        const status = (p.status || p.publishStatus || '').toString().trim().toLowerCase();
        const isApproved = status === 'approved' || status === 'published' || status === 'live' || p.isApproved === true || p.approved === true;
        const isExcluded = status === 'pending' || status === 'rejected' || status === 'draft' || status === 'deleted' || p.isDeleted === true || p.isPublished === false;
        if (isApproved && !isExcluded) {
          count++;
        }
      });
      setApprovedProductsCount(count);
    }, (error) => {
      console.error('Error in products statistic listener:', error);
    });

    // Helper to calculate total verified weavers from users & shops
    const calculateWeavers = (uDocs, sDocs) => {
      const map = new Map();
      uDocs.forEach((d) => {
        const data = typeof d.data === 'function' ? d.data() : d;
        const st = (data.status || '').toString().trim().toLowerCase();
        const isRoleShop = data.role === 'shopOwner' || data.role === 'shopkeeper' || data.isShop === true;
        const isApproved = st === 'active' || st === 'approved' || st === 'verified' || data.isApproved === true || data.verified === true;
        const isExcluded = st === 'pending' || st === 'rejected' || st === 'disabled' || st === 'inactive' || data.isDisabled === true;
        if (isRoleShop && isApproved && !isExcluded) {
          map.set(d.id || data.uid || data.id, true);
        }
      });
      sDocs.forEach((d) => {
        const data = typeof d.data === 'function' ? d.data() : d;
        const st = (data.status || '').toString().trim().toLowerCase();
        const isApproved = st === 'active' || st === 'approved' || st === 'verified' || data.isApproved === true || data.verified === true;
        const isExcluded = st === 'pending' || st === 'rejected' || st === 'disabled' || st === 'inactive' || data.isDisabled === true;
        if (isApproved && !isExcluded) {
          map.set(d.id || data.uid || data.id, true);
        }
      });
      setApprovedShopsCount(map.size);
    };

    // Listener 2: Users (to check for approved shopOwners if accessible)
    const usersRef = collection(db, COLLECTIONS.USERS);
    const unsubUsers = onSnapshot(usersRef, (snapshot) => {
      usersList = snapshot.docs;
      calculateWeavers(usersList, shopsList);
    }, () => {
      calculateWeavers(usersList, shopsList);
    });

    // Listener 3: Shops (publicly accessible)
    const shopsRef = collection(db, COLLECTIONS.SHOPS);
    const unsubShops = onSnapshot(shopsRef, (snapshot) => {
      shopsList = snapshot.docs;
      calculateWeavers(usersList, shopsList);
    }, (error) => {
      console.error('Error in shops statistic listener:', error);
      calculateWeavers(usersList, shopsList);
    });

    return () => {
      unsubProducts();
      unsubUsers();
      unsubShops();
    };
  }, []);

  return (
    <section className="bg-[#FFF8F0] pt-12 sm:pt-14 pb-12 sm:pb-14 px-5 sm:px-6 lg:px-12 border-b border-[#D4AF37]/15 w-full relative z-20">
      <div className="max-w-[1240px] mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-8 lg:gap-16 items-center">
        {[
          { n: approvedProductsCount, l: 'Authentic Sarees', icon: FiAward },
          { n: approvedShopsCount, l: 'Verified Weavers', icon: FiShield },
          { n: '5K+', l: 'Happy Customers', icon: FiUsers }
        ].map((s, idx) => {
          const Icon = s.icon;
          return (
            <div key={s.l} className={`text-center px-4 sm:px-6 ${idx < 2 ? 'border-b sm:border-b-0 sm:border-r border-[#D4AF37]/30 pb-7 sm:pb-0' : ''}`}>
              <div className="w-12 h-12 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-full bg-[#7B1E3A] text-white flex items-center justify-center mx-auto mb-3 sm:mb-3 shadow-md">
                <Icon className="text-xl sm:text-xl lg:text-2xl" />
              </div>
              <p className="text-[36px] sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-[#7B1E3A] mb-1 sm:mb-1" style={{ fontFamily: 'Playfair Display' }}>{s.n}</p>
              <p className="text-base sm:text-sm lg:text-base text-[#4A2C2A] font-semibold tracking-wide leading-tight m-0">{s.l}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ─── Featured Categories ─── */
function FeaturedCategories() {
  return (
    <section className="py-12 sm:py-16 lg:py-20 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 w-full overflow-hidden bg-[#FFF8F0]">
      <div className="flex items-center justify-between mb-2 sm:mb-3">
        <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#D4AF37] flex items-center gap-1.5">
          ✦ TRENDING WEAVES & COLLECTIONS
        </span>
        <Link to="/categories" className="text-xs sm:text-sm font-bold text-[#7B1E3A] hover:underline flex items-center gap-1 no-underline">
          View All <FiArrowRight className="text-base" />
        </Link>
      </div>
      <h2 className="section-title !text-left !mb-1 sm:!mb-2" style={{ fontFamily: 'Playfair Display' }}>Explore Royal Collections</h2>
      <p className="section-subtitle !text-left !mb-8 sm:!mb-10 text-[#4A2C2A]/80">Browse through our handpicked regional collections and heritage weaves</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
        {categories.slice(0, 8).map((cat, i) => (
          <motion.div key={cat.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: (i % 4) * 0.08 }} className="h-full">
            <Link to={`/categories`} className="group block relative rounded-2xl overflow-hidden shadow-md hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 no-underline h-full bg-[#F5EDE0] flex flex-col">
              <div className="aspect-[4/5] w-full overflow-hidden relative">
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" loading="lazy" />
              </div>
              <div className="p-4 text-center border-t border-[#D4AF37]/20 flex flex-col justify-center flex-1 bg-[#F5EDE0] group-hover:bg-[#FFF8F0] transition-colors">
                <h3 className="text-[#4A2C2A] text-base sm:text-lg font-bold mb-0.5 tracking-wide group-hover:text-[#7B1E3A] transition-colors leading-tight" style={{ fontFamily: 'Playfair Display' }}>
                  {cat.name}
                </h3>
                <p className="text-[#7B1E3A] text-xs font-semibold m-0">{cat.count} Weaves</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ─── Trending Royal Weaves ─── */
function TrendingRoyalWeaves({ approvedProducts }) {
  // Display the most popular or highest-selling products first. If unavailable, use newest.
  const sorted = [...approvedProducts].sort((a, b) => {
    const popA = (a.rating || 0) * (a.reviews || 1) + (a.salesCount || 0);
    const popB = (b.rating || 0) * (b.reviews || 1) + (b.salesCount || 0);
    if (popB !== popA) return popB - popA;
    return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
  });

  return (
    <section className="py-14 sm:py-20 lg:py-24 bg-white border-y border-[#D4AF37]/10 w-full overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
        <h2 className="section-title">Trending Royal Weaves</h2>
        <p className="section-subtitle">Most popular and sought-after heirloom weaves</p>

        {sorted.length === 0 ? (
          <div className="card-base p-16 text-center max-w-lg mx-auto my-8 bg-[#FFF8F0]/30 border-dashed">
            <h3 className="text-xl font-bold text-[#7B1E3A] mb-2" style={{ fontFamily: 'Playfair Display' }}>
              No Products Available
            </h3>
            <p className="text-sm text-[#6B4A48] m-0">Check back soon for new artisan uploads and verified weaves.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6 lg:gap-8">
            {sorted.slice(0, 8).map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        )}

        <div className="text-center mt-12 lg:mt-16">
          <Link to="/products" className="btn-maroon !px-8 !py-3.5 no-underline shadow-md">
            View All Collection <FiArrowRight className="text-base" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ─── New Artisan Arrivals ─── */
function NewArtisanArrivals({ approvedProducts }) {
  // Display recently approved products sorted by newest first
  const sorted = [...approvedProducts].sort((a, b) => {
    return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
  });

  return (
    <section className="py-14 sm:py-20 lg:py-24 bg-[#FFF8F0]/60 border-b border-[#D4AF37]/10 w-full overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
        <h2 className="section-title">New Artisan Arrivals</h2>
        <p className="section-subtitle">Freshly verified additions directly from weaver clusters across India</p>

        {sorted.length === 0 ? (
          <div className="card-base p-16 text-center max-w-lg mx-auto my-8 bg-white/70 border-dashed">
            <h3 className="text-xl font-bold text-[#7B1E3A] mb-2" style={{ fontFamily: 'Playfair Display' }}>
              No Products Available
            </h3>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6 lg:gap-8">
            {sorted.slice(0, 8).map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ─── Curated For Your Wardrobe ─── */
function CuratedForYourWardrobe({ approvedProducts }) {
  // Display mixed selection, avoiding duplicate products already shown in top slots whenever possible
  const sortedTrendingIds = new Set([...approvedProducts].sort((a, b) => ((b.rating || 0) - (a.rating || 0))).slice(0, 4).map(p => p.id));
  const sortedNewestIds = new Set([...approvedProducts].sort((a, b) => (new Date(b.createdAt || 0) - new Date(a.createdAt || 0))).slice(0, 4).map(p => p.id));
  
  const uniqueSelection = approvedProducts.filter(p => !sortedTrendingIds.has(p.id) && !sortedNewestIds.has(p.id));
  const displayList = uniqueSelection.length > 0 ? uniqueSelection : approvedProducts;

  return (
    <section className="py-14 sm:py-20 lg:py-24 bg-white border-b border-[#D4AF37]/10 w-full overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
        <h2 className="section-title">Curated For Your Wardrobe</h2>
        <p className="section-subtitle">Exclusive selections customized for weddings, celebrations, and festive gatherings</p>

        {displayList.length === 0 ? (
          <div className="card-base p-16 text-center max-w-lg mx-auto my-8 bg-[#FFF8F0]/30 border-dashed">
            <h3 className="text-xl font-bold text-[#7B1E3A] mb-2" style={{ fontFamily: 'Playfair Display' }}>
              No Products Available
            </h3>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6 lg:gap-8">
            {displayList.slice(0, 8).map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ─── Trending Shops ─── */
function TrendingShops() {
  return (
    <section className="py-14 sm:py-20 lg:py-24 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 w-full overflow-hidden">
      <h2 className="section-title">Trending Weavers & Shops</h2>
      <p className="section-subtitle">Connect directly with verified artisans and heritage silk houses</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        {shops.filter(s => s.status === 'approved').slice(0, 4).map((shop, i) => (
          <motion.div key={shop.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
            className="card-base p-6 text-center group h-full justify-between">
            <div>
              <div className="relative w-22 h-22 mx-auto mb-4">
                <img src={shop.logo} alt={shop.name} className="w-full h-full rounded-full object-cover border-4 border-[#FFF8F0] shadow-md group-hover:border-[#D4AF37]/50 transition-colors" />
                <span className="absolute bottom-0 right-0 w-6 h-6 bg-[#2D8F5E] text-white rounded-full flex items-center justify-center text-xs shadow-sm" title="Verified Seller">
                  ✓
                </span>
              </div>
              <h3 className="text-lg font-bold text-[#7B1E3A] mb-1 group-hover:text-[#D4AF37] transition-colors truncate" style={{ fontFamily: 'Playfair Display' }}>
                {shop.name}
              </h3>
              <p className="text-xs font-medium text-[#6B4A48] mb-1.5">by {shop.owner}</p>
              <p className="text-xs text-[#6B4A48]/80 mb-3 flex items-center justify-center gap-1">
                📍 {shop.location}
              </p>
            </div>

            <div>
              <div className="flex items-center justify-center gap-1.5 bg-[#FFF8F0] py-1.5 px-3 rounded-lg mx-auto w-fit mb-4">
                <StarRating rating={shop.rating} size={12} />
                <span className="text-xs font-bold text-[#4A2C2A]">{shop.rating}</span>
                <span className="text-[11px] text-[#6B4A48]/70">(120+ rev.)</span>
              </div>
              <div className="border-t border-[#D4AF37]/15 pt-4 mt-2 flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-[#4A2C2A]">{shop.products} Weaves</span>
                <Link to="/shops" className="btn-golden !py-1.5 !px-4 !min-h-[36px] !text-xs no-underline">
                  Visit Shop
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ─── Festival Banners ─── */
function FestivalCollections() {
  return (
    <section className="py-14 sm:py-20 lg:py-24 bg-[#FFF8F0] border-y border-[#D4AF37]/10 w-full overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
        <h2 className="section-title">Festival & Bridal Specials</h2>
        <p className="section-subtitle">Celebrate auspicious beginnings with our exclusive celebratory drapes</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {festivalBanners.map((b, i) => (
            <motion.div key={b.id} initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="relative rounded-3xl overflow-hidden h-72 lg:h-80 group cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500">
              <img src={b.image} alt={b.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" loading="lazy" />
              <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${b.color}E6, ${b.color}80)` }} />

              <div className="absolute inset-0 flex flex-col justify-center p-8 lg:p-10 max-w-md">
                <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37] mb-2 inline-block">
                  ✦ Limited Edition
                </span>
                <h3 className="text-2xl lg:text-3xl font-bold text-white mb-3 leading-tight" style={{ fontFamily: 'Playfair Display' }}>
                  {b.title}
                </h3>
                <p className="text-sm text-white/85 mb-6 leading-relaxed font-light">
                  {b.subtitle}
                </p>
                <Link to="/products" className="btn-golden !py-2.5 !px-6 !text-xs w-fit no-underline shadow-md">
                  Explore Collection <FiArrowRight />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Why Choose Us ─── */
function WhyChooseUs() {
  const items = [
    { icon: <FiShield size={26} />, title: 'Silk Mark Certified', desc: '100% authentic pure silk guaranteed.' },
    { icon: <FiStar size={26} />, title: 'Curated Heritage', desc: 'Handpicked heirloom zari craftsmanship.' },
    { icon: <FiHeart size={26} />, title: 'Direct from Artisans', desc: 'Direct from weaving clusters across India.' },
    { icon: <FiTruck size={26} />, title: 'Insured Delivery', desc: 'Trackable and insured shipping.' },
    { icon: <FiCheckCircle size={26} />, title: 'Easy Returns', desc: '7-day return policy guarantee.' },
  ];
  return (
    <section className="py-14 sm:py-20 lg:py-24 max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-12 w-full overflow-hidden">
      <h2 className="section-title">Why Choose Vasthra Cotton</h2>
      <p className="section-subtitle">India's trusted luxury saree destination</p>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 sm:gap-6 lg:gap-8">
        {items.map((item, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
            className={`card-base p-5 sm:p-6 lg:p-7 text-center group h-full flex flex-col justify-between items-center ${i === 4 ? 'col-span-2 sm:col-span-1 md:col-span-1' : ''}`}>
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-[#7B1E3A] to-[#9B2E4A] text-white flex items-center justify-center mb-4 sm:mb-5 shadow-md group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                {item.icon}
              </div>
              <h4 className="text-base sm:text-base lg:text-lg font-bold text-[#7B1E3A] mb-1.5 leading-snug" style={{ fontFamily: 'Playfair Display' }}>
                {item.title}
              </h4>
            </div>
            <p className="text-xs sm:text-sm lg:text-sm text-[#6B4A48] leading-[1.65] m-0 font-normal mt-1.5">
              {item.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ─── Testimonials ─── */
function Testimonials() {
  return (
    <section className="py-14 sm:py-20 lg:py-24 bg-gradient-to-br from-[#7B1E3A] via-[#5A1028] to-[#4A2C2A] text-white w-full overflow-hidden relative">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-12 relative z-10">
        <h2 className="section-title !text-white">Voices of Tradition</h2>
        <p className="section-subtitle !text-white/75">Real experiences from saree connoisseurs and brides across India</p>

        <div className="w-full">
          <Swiper modules={[Autoplay, Pagination]} autoplay={{ delay: 5000, disableOnInteraction: false }} pagination={{ clickable: true }} spaceBetween={24}
            breakpoints={{ 0: { slidesPerView: 1 }, 640: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }} className="!pb-14 w-full">
            {testimonials.map(t => (
              <SwiperSlide key={t.id} className="h-auto">
                <div className="bg-white/8 backdrop-blur-md border border-white/15 rounded-2xl p-5 sm:p-6 h-full flex flex-col justify-between shadow-xl transition-all duration-400 hover:bg-white/14 hover:border-[#D4AF37]/40 hover:-translate-y-1">
                  <div>
                    <div className="flex items-center gap-3.5 mb-4">
                      <img src={t.image} alt={t.name} className="w-13 h-13 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-[#D4AF37]/60 shadow-lg" />
                      <div>
                        <p className="text-white font-bold text-sm sm:text-[15px] m-0 leading-snug">{t.name}</p>
                        <p className="text-[10px] sm:text-[11px] text-[#D4AF37] m-0 mb-1 font-semibold tracking-widest uppercase">Verified Buyer</p>
                        <StarRating rating={t.rating} size={14} />
                      </div>
                    </div>
                    <p className="text-white/85 text-[13px] sm:text-sm leading-[1.7] italic m-0">
                      "{t.review}"
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-white/12 flex items-center justify-between text-[11px] text-white/60">
                    <span className="text-[#D4AF37]/90 font-medium">✦ Purchased Kanjivaram Silk</span>
                    <span className="bg-white/10 px-2.5 py-1 rounded-lg text-white/80 text-[10px] font-semibold">⭐ Verified</span>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}

/* ─── Main Landing Page ─── */
export default function LandingPage() {
  const { approvedProducts } = useProducts();

  return (
    <div className="w-full max-w-full overflow-x-hidden bg-[#FFF8F0] flex flex-col gap-4 sm:gap-6 lg:gap-8 pb-8 sm:pb-12">
      <Hero />
      <StatisticsSection />
      <FeaturedCategories />
      <TrendingRoyalWeaves approvedProducts={approvedProducts} />
      <NewArtisanArrivals approvedProducts={approvedProducts} />
      <CuratedForYourWardrobe approvedProducts={approvedProducts} />
      <TrendingShops />
      <FestivalCollections />
      <WhyChooseUs />
      <Testimonials />
    </div>
  );
}

