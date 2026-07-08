import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiHeart, FiShoppingBag, FiAward } from 'react-icons/fi';
import ProductCard from '../../components/shared/ProductCard';
import { products } from '../../data';

export default function UserDashboard() {
  const trending = products.filter(p => p.trending).slice(0, 4);
  const newArrivals = products.filter(p => p.newArrival).slice(0, 4);
  const recommended = products.filter(p => p.featured).slice(0, 4);

  return (
    <div className="space-y-12">
      {/* Welcome banner */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl bg-gradient-to-r from-[#7B1E3A] via-[#6B1A32] to-[#4A1020] p-8 sm:p-12 md:p-14 mb-12 text-white relative overflow-hidden shadow-xl border border-[#D4AF37]/30">
        <div className="absolute inset-0 opacity-15" style={{ backgroundImage: 'url("https://images.pexels.com/photos/2814808/pexels-photo-2814808.jpeg?auto=compress&cs=tinysrgb&w=800")', backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="relative z-10 max-w-2xl">
          <span className="inline-block text-xs uppercase font-bold tracking-widest text-[#D4AF37] bg-black/40 backdrop-blur-xs px-4 py-2 rounded-full mb-4 border border-[#D4AF37]/30">
            ✦ Saree Connoisseur Club
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-white leading-tight" style={{ fontFamily: 'Playfair Display' }}>
            Welcome back, Ananya! ✨
          </h1>
          <p className="text-white/85 text-sm sm:text-base md:text-lg mb-8 font-light leading-relaxed max-w-xl">
            Discover exquisite handloom drops, Kanjivaram bridals, and festive zari weaves curated exclusively for your wardrobe.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link to="/products" className="btn-golden !py-3 sm:!py-3.5 !px-7 !h-[48px] !text-xs sm:!text-sm !font-semibold !rounded-xl no-underline shadow-lg inline-flex items-center justify-center gap-2">
              Explore New Drops <FiArrowRight />
            </Link>
            <Link to="/wishlist" className="btn-outline-gold !py-3 sm:!py-3.5 !px-7 !h-[48px] !text-xs sm:!text-sm !font-semibold !rounded-xl no-underline bg-black/20 backdrop-blur-xs text-white border-white/30 hover:bg-white hover:text-[#7B1E3A] inline-flex items-center justify-center gap-2">
              <FiHeart /> View Wishlist
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Quick Perks */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mb-14">
        <div className="card-base p-6 sm:p-7 bg-white border border-[#D4AF37]/25 flex items-start sm:items-center gap-5 shadow-sm rounded-2xl">
          <div className="w-14 h-14 rounded-2xl bg-[#7B1E3A]/10 text-[#7B1E3A] flex items-center justify-center text-2xl flex-shrink-0 shadow-2xs">
            <FiShoppingBag />
          </div>
          <div>
            <p className="font-bold text-[#7B1E3A] text-base sm:text-lg m-0 mb-1">Express Priority Shipping</p>
            <p className="text-xs sm:text-sm text-[#6B4A48] m-0 font-light leading-relaxed">Free delivery on all silk weaves</p>
          </div>
        </div>
        <div className="card-base p-6 sm:p-7 bg-white border border-[#D4AF37]/25 flex items-start sm:items-center gap-5 shadow-sm rounded-2xl">
          <div className="w-14 h-14 rounded-2xl bg-[#D4AF37]/10 text-[#D4AF37] flex items-center justify-center text-2xl flex-shrink-0 shadow-2xs">
            <FiAward />
          </div>
          <div>
            <p className="font-bold text-[#7B1E3A] text-base sm:text-lg m-0 mb-1">100% Silk Mark Certified</p>
            <p className="text-xs sm:text-sm text-[#6B4A48] m-0 font-light leading-relaxed">Verified regional handloom quality</p>
          </div>
        </div>
        <div className="card-base p-6 sm:p-7 bg-white border border-[#D4AF37]/25 flex items-start sm:items-center gap-5 shadow-sm rounded-2xl">
          <div className="w-14 h-14 rounded-2xl bg-[#2D8F5E]/10 text-[#2D8F5E] flex items-center justify-center text-2xl flex-shrink-0 shadow-2xs">
            <FiHeart />
          </div>
          <div>
            <p className="font-bold text-[#7B1E3A] text-base sm:text-lg m-0 mb-1">Personalized Wardrobe</p>
            <p className="text-xs sm:text-sm text-[#6B4A48] m-0 font-light leading-relaxed">Tailored weave recommendations</p>
          </div>
        </div>
      </div>

      {/* Sections */}
      {[{ title: 'Trending Royal Weaves', subtitle: 'Most loved by saree connoisseurs this week', data: trending }, { title: 'New Artisan Arrivals', subtitle: 'Fresh off the handlooms of Kanchipuram & Banaras', data: newArrivals }, { title: 'Curated For Your Wardrobe', subtitle: 'Handpicked drapes matching your style profile', data: recommended }].map(sec => (
        <section key={sec.title} className="pt-4">
          <div className="flex items-end justify-between mb-8 pb-4 border-b border-[#D4AF37]/15">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-bold block mb-1">✦ Exclusive Selections</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#7B1E3A] m-0" style={{ fontFamily: 'Playfair Display' }}>{sec.title}</h2>
              <p className="text-xs text-[#6B4A48] m-0 mt-1 font-light">{sec.subtitle}</p>
            </div>
            <Link to="/products" className="text-xs font-bold text-[#7B1E3A] hover:text-[#D4AF37] no-underline flex items-center gap-1 transition-colors">
              View All Catalogue <FiArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {sec.data.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        </section>
      ))}
    </div>
  );
}

