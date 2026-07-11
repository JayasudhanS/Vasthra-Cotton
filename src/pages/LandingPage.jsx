import { motion } from 'framer-motion';
import { Link, Navigate } from 'react-router-dom';
import { FiArrowRight, FiShield, FiStar, FiTruck, FiCheckCircle, FiHeart, FiAward, FiUsers, FiShoppingBag, FiUser } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import ProductCard, { StarRating } from '../components/shared/ProductCard';
import { products, categories, shops, testimonials, festivalBanners } from '../data';

/* ─── Hero ─── */
function Hero() {
  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 pt-4 sm:pt-6">
      <section className="relative overflow-hidden bg-[#FFF8F0] w-full rounded-2xl sm:rounded-3xl shadow-xl border border-[#D4AF37]/30 flex flex-col lg:flex-row min-h-[500px] lg:min-h-[640px]">
        {/* Left Content Area */}
        <div className="w-full lg:w-[55%] px-6 sm:px-10 lg:px-16 xl:px-20 py-12 sm:py-16 lg:py-24 flex flex-col justify-center relative z-20 bg-[#FFF8F0]">
          
          {/* Top Badge */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="bg-[#5A1028] text-white text-[10px] sm:text-xs font-bold tracking-widest uppercase py-2 px-4 sm:py-2.5 sm:px-5 rounded-full flex items-center gap-2.5 w-fit mb-6 sm:mb-8 shadow-sm">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
               <path d="M12 2C12 2 15 8 15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 8 12 2 12 2Z" fill="currentColor"/>
               <path d="M22 12C22 12 16 15 12 15C10.3431 15 9 16.3431 9 18C9 19.6569 15 22 15 22C15 22 15 16 15 12C15 10.3431 16.3431 9 18 9C19.6569 9 22 12 22 12Z" fill="currentColor"/>
               <path d="M2 12C2 12 8 15 12 15C13.6569 15 15 16.3431 15 18C15 19.6569 9 22 9 22C9 22 9 16 9 12C9 10.3431 7.65685 9 6 9C4.34315 9 2 12 2 12Z" fill="currentColor"/>
            </svg>
            <span>India's Premier Saree Marketplace</span>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
            <h1 className="text-[38px] sm:text-[46px] lg:text-[52px] xl:text-[64px] font-bold leading-[1.1] tracking-tight max-w-xl" style={{ fontFamily: 'Playfair Display' }}>
              <span className="text-[#4A2C2A] block mb-1">Celebrate Every</span>
              <span className="text-[#4A2C2A] block mb-1">Tradition with</span>
              <span className="text-[#D4AF37] block mt-1 sm:mt-2">Timeless Elegance</span>
            </h1>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6 sm:my-8 w-full max-w-[280px]">
              <div className="h-[1px] flex-1 bg-[#D4AF37]/40"></div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-[#D4AF37]" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
              </svg>
              <div className="h-[1px] flex-1 bg-[#D4AF37]/40"></div>
            </div>

            <p className="text-sm sm:text-base lg:text-lg text-[#4A2C2A] mb-8 sm:mb-10 max-w-md leading-[1.65] font-medium">
              Discover handcrafted Kanjivaram, Banarasi, and designer sarees from trusted weavers across India.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-start gap-4 sm:gap-5 w-full sm:w-auto">
              <Link to="/products" className="w-full sm:w-auto bg-[#5A1028] hover:bg-[#4A2C2A] text-white px-6 sm:px-8 h-[52px] sm:h-[56px] rounded-xl font-medium transition-all duration-300 no-underline shadow-md hover:shadow-lg inline-flex items-center justify-center gap-2.5 text-sm sm:text-base min-w-[210px]">
                <FiShoppingBag className="text-lg opacity-90" /> <span>Explore Collection</span> <FiArrowRight className="text-lg opacity-90" />
              </Link>
              <Link to="/portal" className="w-full sm:w-auto bg-transparent text-[#4A2C2A] hover:bg-[#D4AF37]/10 border border-[#D4AF37]/60 hover:border-[#D4AF37] px-6 sm:px-8 h-[52px] sm:h-[56px] rounded-xl font-bold transition-all duration-300 no-underline text-sm sm:text-base inline-flex items-center justify-center gap-2.5 min-w-[210px]">
                <FiUser className="text-lg text-[#4A2C2A]" /> <span>Login / Register</span>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Right Image Area */}
        <div className="w-full lg:w-[45%] relative h-[320px] sm:h-[450px] lg:h-auto overflow-hidden">
          {/* Main background image */}
          <img 
            src="https://images.pexels.com/photos/2814808/pexels-photo-2814808.jpeg?auto=compress&cs=tinysrgb&w=1200" 
            alt="Exquisite Indian Silk Saree" 
            className="absolute inset-0 w-full h-full object-cover object-center lg:object-[60%_50%] hover:scale-105 transition-transform duration-1000 ease-in-out" 
          />
          {/* Subtle gradient overlay to soften edges */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#FFF8F0]/30 to-transparent" />
          {/* Gradient to blend with the left side on desktop */}
          <div className="hidden lg:block absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#FFF8F0] to-transparent z-10" />
          {/* Gradient to blend with top side on mobile */}
          <div className="block lg:hidden absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#FFF8F0] to-transparent z-10" />
        </div>
      </section>
    </div>
  );
}

/* ─── Statistics Section ─── */
function StatisticsSection() {
  return (
    <section className="bg-[#FFF8F0] pt-16 sm:pt-18 pb-16 sm:pb-18 px-5 sm:px-6 lg:px-12 border-b border-[#D4AF37]/15 w-full relative z-20">
      <div className="max-w-[1240px] mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-8 lg:gap-16 items-center">
        {[
          { n: '5,000+', l: 'Authentic Sarees', icon: FiAward },
          { n: '120+', l: 'Verified Weavers', icon: FiShield },
          { n: '50K+', l: 'Happy Customers', icon: FiUsers }
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
    <section className="py-14 sm:py-20 lg:py-24 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 w-full overflow-hidden bg-[#FFF8F0]">
      <div className="flex items-center justify-between mb-2 sm:mb-3">
        <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#D4AF37] flex items-center gap-1.5">
          ✦ TRENDING WEAVES & COLLECTIONS
        </span>
        <Link to="/categories" className="text-xs sm:text-sm font-bold text-[#7B1E3A] hover:underline flex items-center gap-1 no-underline">
          View All <FiArrowRight className="text-base" />
        </Link>
      </div>
      <h2 className="section-title !text-left !mb-1 sm:!mb-2" style={{ fontFamily: 'Playfair Display' }}>Explore Royal Collections</h2>
      <p className="section-subtitle !text-left !mb-8 sm:!mb-10 text-[#4A2C2A]/80">Browse through our handpicked regional weaves and heritage masterpieces</p>

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
                <p className="text-[#7B1E3A] text-xs font-semibold m-0">{cat.count} Masterpieces</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ─── Featured Products ─── */
function FeaturedProducts() {
  return (
    <section className="py-16 sm:py-24 lg:py-28 bg-white border-y border-[#D4AF37]/10 w-full overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
        <h2 className="section-title">Featured Sarees</h2>
        <p className="section-subtitle">Handpicked selections representing India's finest craftsmanship</p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6 lg:gap-8">
          {products.filter(p => p.featured).slice(0, 8).map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>

        <div className="text-center mt-12 lg:mt-16">
          <Link to="/products" className="btn-maroon !px-8 !py-3.5 no-underline shadow-md">
            View All Collection <FiArrowRight className="text-base" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ─── Trending Shops ─── */
function TrendingShops() {
  return (
    <section className="py-16 sm:py-24 lg:py-28 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 w-full overflow-hidden">
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
    <section className="py-16 sm:py-24 lg:py-28 bg-[#FFF8F0] border-y border-[#D4AF37]/10 w-full overflow-hidden">
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

/* ─── Portal CTA Strip ─── */
function PortalCTASection() {
  return (
    <section className="relative z-30 max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-12 w-full">
      <div className="bg-gradient-to-r from-[#4A2C2A] via-[#5A1028] to-[#4A2C2A] p-5 sm:p-6 lg:px-8 lg:py-4.5 rounded-3xl shadow-2xl border-2 border-[#D4AF37]/40 flex flex-col lg:flex-row items-center justify-between gap-5 lg:gap-8 backdrop-blur-md">
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5 text-center sm:text-left w-full lg:w-auto">
          <div className="w-13 h-13 lg:w-13 lg:h-13 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#E8C94A] text-[#4A2C2A] flex items-center justify-center text-2xl lg:text-2xl font-bold shadow-md flex-shrink-0 mx-auto sm:mx-0">
            ✦
          </div>
          <div>
            <h3 className="text-[22px] sm:text-2xl lg:text-xl font-bold text-white m-0 leading-tight" style={{ fontFamily: 'Playfair Display' }}>
              Vasthra Command & Access Portal
            </h3>
            <p className="text-sm sm:text-base lg:text-xs xl:text-sm text-[#D4AF37] m-0 mt-1.5 lg:mt-1 font-medium tracking-wide">
              Dedicated Gateway for Customers, Master Weavers & Administration
            </p>
          </div>
        </div>

        <div className="flex flex-row items-center justify-center gap-2 sm:gap-3 lg:gap-3 w-full lg:w-auto bg-[#3D1A24]/90 p-1.5 sm:p-2 lg:p-2 rounded-2xl border border-[#D4AF37]/30 shadow-inner overflow-x-auto sm:overflow-visible">
          <Link to="/login/user" className="flex-1 lg:flex-initial px-3 sm:px-5 lg:px-5 py-2 sm:py-2.5 lg:py-2.5 h-[42px] sm:h-[44px] lg:h-[44px] rounded-xl bg-[#D4AF37] text-[#4A2C2A] font-bold text-xs sm:text-sm lg:text-sm hover:bg-[#E8C94A] transition-all no-underline text-center shadow-md flex items-center justify-center gap-1.5 sm:gap-2 whitespace-nowrap">
            <FiUsers className="text-base sm:text-sm lg:text-base flex-shrink-0" /> User Portal
          </Link>
          <Link to="/login/shopkeeper" className="flex-1 lg:flex-initial px-3 sm:px-5 lg:px-5 py-2 sm:py-2.5 lg:py-2.5 h-[42px] sm:h-[44px] lg:h-[44px] rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm lg:text-sm transition-all no-underline text-center border border-[#D4AF37]/30 flex items-center justify-center gap-1.5 sm:gap-2 whitespace-nowrap">
            <FiShoppingBag className="text-base sm:text-sm lg:text-base text-[#D4AF37] flex-shrink-0" /> Shop Owner
          </Link>
          <Link to="/login/admin" className="flex-1 lg:flex-initial px-3 sm:px-5 lg:px-5 py-2 sm:py-2.5 lg:py-2.5 h-[42px] sm:h-[44px] lg:h-[44px] rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm lg:text-sm transition-all no-underline text-center border border-[#D4AF37]/30 flex items-center justify-center gap-1.5 sm:gap-2 whitespace-nowrap">
            <FiShield className="text-base sm:text-sm lg:text-base text-[#D4AF37] flex-shrink-0" /> Admin
          </Link>
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
    <section className="py-16 sm:py-24 lg:py-28 max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-12 w-full overflow-hidden">
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
    <section className="py-16 sm:py-24 lg:py-28 bg-gradient-to-br from-[#7B1E3A] via-[#5A1028] to-[#4A2C2A] text-white w-full overflow-hidden relative">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-12 relative z-10">
        <h2 className="section-title !text-white">Voices of Tradition</h2>
        <p className="section-subtitle !text-white/80">Real experiences from saree connoisseurs and brides across India</p>

        <div className="w-full">
          <Swiper modules={[Autoplay, Pagination]} autoplay={{ delay: 5000, disableOnInteraction: false }} pagination={{ clickable: true }} spaceBetween={28}
            breakpoints={{ 0: { slidesPerView: 1 }, 640: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }} className="!pb-14 w-full">
            {testimonials.map(t => (
              <SwiperSlide key={t.id} className="h-auto">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 sm:p-7 h-full flex flex-col justify-between shadow-xl transition-all duration-300 hover:bg-white/15 hover:border-[#D4AF37]/50">
                  <div>
                    <div className="flex items-center gap-3.5 mb-4">
                      <img src={t.image} alt={t.name} className="w-12 h-12 rounded-full object-cover border-2 border-[#D4AF37] shadow-md" />
                      <div>
                        <p className="text-white font-bold text-sm sm:text-base m-0 leading-snug">{t.name}</p>
                        <p className="text-xs text-[#D4AF37] m-0 mb-1 font-semibold tracking-wider uppercase">Verified Buyer</p>
                        <StarRating rating={t.rating} size={14} />
                      </div>
                    </div>
                    <p className="text-white/90 text-sm sm:text-base leading-[1.65] italic m-0">
                      "{t.review}"
                    </p>
                  </div>

                  <div className="mt-6 pt-3 border-t border-white/15 flex items-center justify-between text-xs text-white/70 font-mono">
                    <span className="text-[#D4AF37]/95">✦ Purchased Kanjivaram Silk</span>
                    <span className="bg-white/10 px-2 py-0.5 rounded text-white">⭐ Verified</span>
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
  const { user, role } = useAuth();

  if (user) {
    const dashboardPath = role === 'admin' ? '/admin/dashboard' : role === 'shopkeeper' ? '/shopkeeper/dashboard' : '/user/dashboard';
    return <Navigate to={dashboardPath} replace />;
  }

  return (
    <div className="w-full max-w-full overflow-x-hidden bg-[#FFF8F0] flex flex-col gap-6 sm:gap-8 lg:gap-9 pb-10 sm:pb-14">
      <Hero />
      <PortalCTASection />
      <StatisticsSection />
      <FeaturedCategories />
      <FeaturedProducts />
      <TrendingShops />
      <FestivalCollections />
      <WhyChooseUs />
      <Testimonials />
    </div>
  );
}

