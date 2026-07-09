import { motion } from 'framer-motion';
import { Link, Navigate } from 'react-router-dom';
import { FiArrowRight, FiShield, FiStar, FiTruck, FiCheckCircle, FiHeart, FiAward, FiUsers, FiShoppingBag } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import ProductCard, { StarRating } from '../components/shared/ProductCard';
import { products, categories, shops, testimonials, festivalBanners } from '../data';
import { useState } from 'react';

/* ─── Hero ─── */
function Hero() {
  return (
    <div className="w-full max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 pt-3 sm:pt-4">
      <section className="relative min-h-[auto] sm:min-h-[72vh] lg:min-h-[82vh] flex flex-col justify-center overflow-hidden bg-gradient-to-br from-[#7B1E3A] via-[#5A1028] to-[#3D1A24] w-full rounded-2xl sm:rounded-3xl shadow-xl border border-[#D4AF37]/30">
        <div className="bg-[#5A1028] text-[#D4AF37] text-[10px] sm:text-xs font-bold tracking-widest uppercase py-2.5 px-4 text-center border-b border-[#D4AF37]/30 flex items-center justify-center gap-2 w-full z-30 relative shadow-inner">
          <FiAward className="text-sm animate-pulse flex-shrink-0" />
          <span>India's Premier Authentic Saree Marketplace</span>
        </div>

        <div className="absolute inset-0 opacity-35 sm:opacity-25 lg:opacity-20 transition-all duration-700" style={{ backgroundImage: 'url("https://images.pexels.com/photos/2814808/pexels-photo-2814808.jpeg?auto=compress&cs=tinysrgb&w=1600")', backgroundSize: 'cover', backgroundPosition: '70% 25%' }} />
        <div className="absolute inset-0 bg-gradient-to-r from-[#7B1E3A]/95 via-[#7B1E3A]/85 to-[#7B1E3A]/50 lg:to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none z-20">
          <svg className="relative block w-full h-8 sm:h-12 lg:h-16 text-[#FFF8F0]" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,0 C300,90 900,90 1200,0 L1200,120 L0,120 Z" fill="currentColor"></path>
          </svg>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-20 sm:py-20 lg:py-24 grid lg:grid-cols-12 gap-8 lg:gap-8 items-center w-full z-20">
          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }} className="lg:col-span-7 flex flex-col justify-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold !text-white leading-snug sm:leading-tight tracking-tight" style={{ fontFamily: 'Playfair Display' }}>
            <span className="!text-white block">Celebrate Every Tradition with</span>
            <span className="!text-[#D4AF37] block mt-1 sm:mt-1.5">Timeless Elegance</span>
          </h1>

          <div className="flex items-center gap-3 my-5 sm:my-6">
            <div className="h-[1px] w-14 sm:w-24 bg-gradient-to-r from-[#D4AF37] to-[#D4AF37]/10"></div>
            <span className="text-[#D4AF37] text-base sm:text-lg">✦</span>
            <div className="h-[1px] w-14 sm:w-24 bg-gradient-to-l from-[#D4AF37] to-[#D4AF37]/10"></div>
          </div>

          <p className="text-xs sm:text-base md:text-lg text-white/85 mb-8 sm:mb-10 max-w-xl leading-relaxed font-light">
            Discover exquisite handwoven Kanjivaram, Banarasi, and contemporary sarees from verified weavers across India. Direct from loom to your wardrobe.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 sm:gap-4 w-full sm:w-auto max-w-xs sm:max-w-none">
            <Link to="/products" className="bg-[#D4AF37] hover:bg-[#E8C94A] text-[#4A2C2A] text-xs sm:text-base px-6 sm:px-8 py-3.5 rounded-full font-bold transition-all duration-300 no-underline shadow-lg hover:shadow-[#D4AF37]/40 flex-1 sm:flex-initial inline-flex items-center justify-center gap-2.5">
              <span>Explore Collection</span> <FiArrowRight className="text-base sm:text-lg" />
            </Link>
            <Link to="/portal" className="bg-[#4A2C2A]/70 hover:bg-[#4A2C2A] text-white border border-[#D4AF37]/70 hover:border-[#D4AF37] px-6 sm:px-8 py-3.5 rounded-full font-semibold transition-all duration-300 no-underline text-xs sm:text-base inline-flex items-center justify-center gap-2.5 backdrop-blur-sm flex-1 sm:flex-initial text-center shadow-md">
              <FiShoppingBag className="text-base sm:text-lg" /> <span>Login/Register</span>
            </Link>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.2 }}
          className="hidden lg:flex lg:col-span-5 justify-end relative pb-8">
          <div className="relative w-[380px] h-[480px] xl:w-[420px] xl:h-[520px]">
            <div className="absolute inset-0 rounded-3xl overflow-hidden border-4 border-[#D4AF37]/40 shadow-2xl bg-[#4A2C2A]">
              <img src="https://images.pexels.com/photos/2814808/pexels-photo-2814808.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Exquisite Indian Silk Saree" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            </div>

            <div className="absolute -bottom-6 -left-6 glass-card p-4 flex items-center gap-3.5 shadow-xl bg-white/90">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#E8C94A] flex items-center justify-center text-[#4A2C2A] shadow-md flex-shrink-0">
                <FiStar size={22} className="fill-current" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#4A2C2A] m-0">4.9 / 5 Rating</p>
                <p className="text-xs text-[#6B4A48] m-0 font-medium">Silk Mark Certified Weavers</p>
              </div>
            </div>

            <div className="absolute -top-4 -right-4 glass-card px-4 py-2.5 flex items-center gap-2 shadow-lg bg-white/90">
              <FiShield className="text-[#2D8F5E]" size={18} />
              <span className="text-xs font-bold text-[#4A2C2A]">100% Genuine Silk</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
    </div>
  );
}

/* ─── Statistics Section ─── */
function StatisticsSection() {
  return (
    <section className="bg-[#FFF8F0] pt-8 sm:pt-12 pb-14 sm:pb-18 px-4 sm:px-6 lg:px-8 border-b border-[#D4AF37]/15 w-full relative z-20">
      <div className="max-w-5xl mx-auto grid grid-cols-3 gap-2 sm:gap-8 items-center">
        {[
          { n: '5,000+', l: 'Authentic Sarees', icon: FiAward },
          { n: '120+', l: 'Verified Weavers', icon: FiShield },
          { n: '50K+', l: 'Happy Customers', icon: FiUsers }
        ].map((s, idx) => {
          const Icon = s.icon;
          return (
            <div key={s.l} className={`text-center px-2 sm:px-6 ${idx < 2 ? 'border-r border-[#D4AF37]/30' : ''}`}>
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#7B1E3A] text-white flex items-center justify-center mx-auto mb-2 sm:mb-3 shadow-md">
                <Icon className="text-lg sm:text-xl" />
              </div>
              <p className="text-lg sm:text-3xl lg:text-4xl font-bold text-[#7B1E3A] mb-0.5 sm:mb-1" style={{ fontFamily: 'Playfair Display' }}>{s.n}</p>
              <p className="text-[11px] sm:text-sm text-[#4A2C2A] font-medium leading-tight m-0">{s.l}</p>
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
    <section className="py-14 sm:py-20 max-w-7xl mx-auto px-4 lg:px-8 w-full overflow-hidden bg-[#FFF8F0]">
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

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
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
    <section className="py-16 sm:py-24 bg-white border-y border-[#D4AF37]/10 w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <h2 className="section-title">Featured Sarees</h2>
        <p className="section-subtitle">Handpicked selections representing India's finest craftsmanship</p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
          {products.filter(p => p.featured).slice(0, 8).map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>

        <div className="text-center mt-12">
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
    <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 lg:px-8 w-full overflow-hidden">
      <h2 className="section-title">Trending Weavers & Shops</h2>
      <p className="section-subtitle">Connect directly with verified artisans and heritage silk houses</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
    <section className="py-16 sm:py-24 bg-[#FFF8F0] border-y border-[#D4AF37]/10 w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <h2 className="section-title">Festival & Bridal Specials</h2>
        <p className="section-subtitle">Celebrate auspicious beginnings with our exclusive celebratory drapes</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
    { icon: <FiShield size={26} />, title: 'Silk Mark Certified', desc: '100% authentic pure silk guaranteed by verified master weavers.' },
    { icon: <FiStar size={26} />, title: 'Curated Heritage', desc: 'Only the finest handpicked zari and heirloom sarees make our catalogue.' },
    { icon: <FiHeart size={26} />, title: 'Direct from Artisans', desc: 'Supporting weaving clusters across Kanchipuram, Varanasi & Bengal.' },
    { icon: <FiTruck size={26} />, title: 'Insured Delivery', desc: 'Fast, trackable, and fully insured doorstep shipping worldwide.' },
    { icon: <FiCheckCircle size={26} />, title: 'Easy Returns', desc: 'Hassle-free 7-day return policy with instant refund guarantee.' },
  ];
  return (
    <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 lg:px-8 w-full overflow-hidden">
      <h2 className="section-title">Why Choose Vasthra Cotton</h2>
      <p className="section-subtitle">What makes us India's most trusted luxury saree destination</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {items.map((item, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
            className="card-base p-6 text-center group h-full justify-start items-center">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#7B1E3A] to-[#9B2E4A] text-white flex items-center justify-center mb-5 shadow-md group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
              {item.icon}
            </div>
            <h4 className="text-base font-bold text-[#7B1E3A] mb-2 leading-snug" style={{ fontFamily: 'Playfair Display' }}>
              {item.title}
            </h4>
            <p className="text-xs text-[#6B4A48] leading-relaxed m-0 font-light">
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
    <section className="py-16 sm:py-24 bg-gradient-to-br from-[#7B1E3A] via-[#5A1028] to-[#4A2C2A] text-white w-full overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10">
        <h2 className="section-title !text-white">Voices of Tradition</h2>
        <p className="section-subtitle !text-white/80">Real experiences from saree connoisseurs and brides across India</p>

        <div className="w-full">
          <Swiper modules={[Autoplay, Pagination]} autoplay={{ delay: 5000, disableOnInteraction: false }} pagination={{ clickable: true }} spaceBetween={24}
            breakpoints={{ 0: { slidesPerView: 1 }, 640: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }} className="!pb-14 w-full">
            {testimonials.map(t => (
              <SwiperSlide key={t.id} className="h-auto">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 sm:p-7 h-full flex flex-col justify-between shadow-xl transition-all duration-300 hover:bg-white/15 hover:border-[#D4AF37]/50">
                  <div>
                    <div className="flex items-center gap-3.5 mb-4">
                      <img src={t.image} alt={t.name} className="w-12 h-12 rounded-full object-cover border-2 border-[#D4AF37] shadow-md" />
                      <div>
                        <p className="text-white font-bold text-sm m-0 leading-snug">{t.name}</p>
                        <p className="text-[11px] text-[#D4AF37] m-0 mb-1 font-semibold tracking-wider uppercase">Verified Buyer</p>
                        <StarRating rating={t.rating} size={13} />
                      </div>
                    </div>
                    <p className="text-white/90 text-xs sm:text-sm leading-relaxed italic m-0">
                      "{t.review}"
                    </p>
                  </div>

                  <div className="mt-6 pt-3 border-t border-white/15 flex items-center justify-between text-[11px] text-white/60 font-mono">
                    <span className="text-[#D4AF37]/90">✦ Purchased Kanjivaram Silk</span>
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

/* ─── Newsletter ─── */
function Newsletter() {
  const [email, setEmail] = useState('');
  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-[#FFF8F0] via-white to-[#FFF8F0] w-full overflow-hidden flex justify-center items-center border-t border-[#D4AF37]/15">
      <div className="w-full max-w-4xl mx-auto px-4 lg:px-8 text-center">
        <div className="bg-gradient-to-br from-[#7B1E3A] via-[#5A1028] to-[#4A2C2A] text-white p-8 sm:p-14 lg:p-16 border-2 border-[#D4AF37]/50 shadow-2xl rounded-3xl w-full relative overflow-hidden">
          {/* Decorative Background Glow */}
          <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-[#D4AF37]/15 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-[#D4AF37]/15 blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <span className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#E8C94A] text-[#4A2C2A] flex items-center justify-center mx-auto mb-5 text-2xl font-bold shadow-lg" style={{ fontFamily: 'Playfair Display' }}>
              ✦
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight" style={{ fontFamily: 'Playfair Display' }}>
              Join the Royal Weave Club
            </h2>
            <p className="text-sm sm:text-base text-white/80 max-w-xl mx-auto mb-8 leading-relaxed font-light">
              Subscribe to receive insider access to new weaver drops, bridal collections, and <span className="text-[#D4AF37] font-semibold">₹1,000 off</span> your first order.
            </p>

            <form onSubmit={e => { e.preventDefault(); if (email.trim()) { alert('Welcome to Vasthra Cotton! Check your email for your welcome discount.'); setEmail(''); } }}
              className="flex flex-col sm:flex-row gap-3.5 max-w-lg mx-auto">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="Enter your email address..."
                className="input-field !h-14 !text-base !px-6 !rounded-xl !bg-white/95 !text-[#4A2C2A] !border-[#D4AF37] focus:!bg-white shadow-lg flex-1"
              />
              <button type="submit" className="btn-golden !h-14 !px-8 !text-base !rounded-xl !font-bold shadow-xl cursor-pointer flex-shrink-0">
                Subscribe Now ✨
              </button>
            </form>
            <p className="text-xs text-white/60 mt-5 m-0">
              🔒 We respect your privacy. Unsubscribe at any time with a single click.
            </p>
          </div>
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
    <div className="w-full max-w-full overflow-x-hidden bg-[#FFF8F0]">
      <Hero />
      <StatisticsSection />
      <FeaturedCategories />
      <FeaturedProducts />
      <TrendingShops />
      <FestivalCollections />
      <WhyChooseUs />
      <Testimonials />
      <Newsletter />
    </div>
  );
}

